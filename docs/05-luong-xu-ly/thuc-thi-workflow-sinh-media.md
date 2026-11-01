# Luồng Thực thi Workflow và Sinh Media

## 1. Mục đích
Mô tả quy trình xử lý từ khi người dùng kích hoạt lệnh chạy workflow (hoặc chạy một node đơn lẻ) cho đến khi toàn bộ các node tạo ảnh và video được thực thi tuần tự theo đúng thứ tự phụ thuộc topo, tải media về lưu vào IndexedDB và cập nhật lên Timeline.

---

## 2. Sơ đồ Tuần tự (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Giao diện Canvas
    participant Modal as Modal Xác nhận Thứ tự chạy
    participant Exec as Bộ điều phối execute()
    participant Graph as topoOrder() & Prompt Resolver
    participant Bridge as Content Script (muse-bridge.js)
    participant Muse as Muse.ai Page DOM
    participant IDB as IndexedDB ('museflow-media')

    User->>UI: Bấm nút "▶ Run workflow"
    UI->>Modal: openRunOrderModal()
    Modal->>User: Hiển thị danh sách các node tạo media, cảnh báo nếu thiếu nguồn
    User->>Modal: Kéo sắp xếp thứ tự / tick chọn node muốn chạy
    User->>Modal: Bấm "▶ Chạy X node"
    Modal->>Exec: execute(null, { generationOrder })
    
    Exec->>Exec: Khởi tạo AbortController, bật cờ state.isRunning = true
    Exec->>UI: Đổi nút Run thành "■ Stop workflow"
    Exec->>Graph: topoOrder(generationOrder) -> Xác định danh sách ID cần chạy

    loop Với từng node tạo media trong thứ tự
        Exec->>Graph: resolvePrompt(nodeId) -> Đệ quy ghép text từ các node nguồn
        Exec->>Graph: resolveNegativePrompt(nodeId)
        Exec->>Graph: resolveReferences(nodeId) -> Gom ảnh tham chiếu + endFrame clip trước
        
        Exec->>UI: Cập nhật node data.status = 'running' & render()
        Exec->>Bridge: chrome.tabs.sendMessage('MUSEFLOW_GENERATE', { prompt, size, duration, referenceImages })
        
        Bridge->>Muse: attachReferences(files) -> Nạp ảnh vào file input
        Bridge->>Muse: Gán prompt vào textarea qua Descriptor Setter + Gửi
        Bridge->>Muse: MutationObserver chờ Attachment mới xuất hiện
        Muse-->>Bridge: Thẻ <img> hoặc <video> mới xuất hiện trên DOM
        Bridge->>Bridge: So khớp Aspect Ratio theo log-ratio score <= 0.09
        Bridge-->>Exec: Trả về { ok: true, url: mediaUrl }

        alt Nếu là node Generate Image
            Exec->>Exec: persistImage(url) -> Chuyển thành Data URL an toàn
        else Nếu là node Generate Video
            Exec->>Exec: extractVideoEndFrame(url) -> Dùng canvas trích xuất frame cuối
            Exec->>UI: Gán endFrame vào node để làm tham chiếu cho cảnh tiếp
        end

        Exec->>IDB: Lưu Blob vào Object Store 'assets'
        Exec->>UI: Cập nhật node data.status = 'success', data.asset = { ... }
        Exec->>UI: Đồng bộ media sang node Preview (syncPreviewOutputs)
    end

    Exec->>UI: setRunStatus('Workflow completed.', 'ok')
    Exec->>Exec: state.isRunning = false, đổi lại nút "▶ Run workflow"
    Exec->>IDB: queueWorkflowSave() -> Lưu trạng thái bền vững
```

---

## 3. Các điểm kiểm soát chất lượng (Quality Control Gates)
1. **Kiểm tra tiền đề trước khi chạy (`missingGenerationPrerequisites`):** Modal thứ tự chạy sẽ cảnh báo ngay nếu người dùng chọn chạy một node video đòi hỏi ảnh tham chiếu từ một node ảnh chưa từng được tạo kết quả trước đó.
2. **Khóa liên tục khung hình (Continuity Lock Prompting):** Nếu node video kế tiếp bật cờ `continuity: true`, hệ thống tự động bổ sung câu lệnh hướng dẫn chặt chẽ vào đầu prompt gửi cho Muse:
   ```text
   CONTINUITY LOCK: Attached image 1 is the exact final frame of the previous Timeline clip.
   Use image 1 as the exact first frame of this video: preserve its subject identity, pose, position, camera angle, crop, lighting, and background. Continue motion naturally from that precise moment.
   ```
3. **Kiểm tra sai lệch tỷ lệ khung hình (Aspect Ratio Mismatch):** Nếu người dùng yêu cầu tỷ lệ 16:9 nhưng Muse.ai trả về ảnh vuông 1:1, hệ thống sẽ phát hiện độ lệch tỷ lệ vượt ngưỡng log-score `> 0.09` và ném lỗi rõ ràng để người dùng điều chỉnh thiết lập trên composer của Muse.ai.

---

## Liên kết liên quan
- [Module Graph Engine](../03-module/graph-engine.md)
- [Module Muse Bridge](../03-module/muse-bridge.md)
- [Luồng Xử lý Từ chối và Thử lại](xu-ly-refusal-va-retry.md)
