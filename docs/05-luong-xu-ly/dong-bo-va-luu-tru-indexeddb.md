# Luồng Đồng bộ và Lưu trữ Lai (IndexedDB & Chrome Storage)

## 1. Mục đích
Mô tả chi tiết luồng xử lý tự động lưu (Auto-save), cơ chế **Dehydration** (tách dữ liệu nhị phân nặng đưa vào IndexedDB) và **Hydration** (tái lập Object URL khi nạp ứng dụng) nhằm đảm bảo dữ liệu workflow được bảo toàn bền vững mà không bị giới hạn bởi trần dung lượng 10MB của `chrome.storage.local`.

---

## 2. Sơ đồ Tuần tự (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng / Sự kiện chạy
    participant App as Canvas App (app.js)
    participant Debounce as scheduleAutoSave() (Timer 650ms)
    participant Queue as workflowSaveQueue (Sequential Chain)
    participant IDB as IndexedDB ('museflow-media')
    participant ChromeStorage as chrome.storage.local

    User->>App: Chỉnh sửa text / Thêm node / Sinh xong ảnh hoặc video
    App->>Debounce: scheduleAutoSave() -> Đặt hẹn giờ 650ms
    Note over Debounce: Gom các thay đổi liên tiếp (Debounce) để tránh ghi đĩa liên tục
    Debounce->>Queue: queueWorkflowSave() -> Đưa vào hàng đợi Promise
    
    Queue->>App: saveWorkflowSnapshot()
    App->>App: structuredClone(state) -> Bản sao sâu dữ liệu
    
    loop Với từng node có data.localDataUrl / data.asset / data.endFrame
        opt Nếu URL là dạng data: hoặc blob:
            App->>App: fetch(url) -> Trích xuất đối tượng Blob nhị phân
            App->>IDB: putMedia(key, blob) -> Ghi vào Object Store 'assets'
            IDB-->>App: Ghi thành công
            App->>App: Thay thế URL bằng 'museflow-idb:' + encodeURIComponent(key)
        end
    end

    App->>ChromeStorage: set({ museflow: snapshotDehydrated })
    ChromeStorage-->>App: Lưu thành công
    App->>App: setRunStatus('Saved.', 'ok')

    Note over App: Khi người dùng mở lại trang (loadState)
    App->>ChromeStorage: get('museflow')
    ChromeStorage-->>App: Trả về snapshot JSON
    App->>App: hydrateWorkflowMedia()
    loop Với các URL có tiền tố 'museflow-idb:'
        App->>IDB: getMedia(key)
        IDB-->>App: Trả về Blob gốc
        App->>App: URL.createObjectURL(blob) -> Gán lại vào node.data
    end
    App->>App: render() -> Vẽ lại canvas đầy đủ hình ảnh và video
```

---

## 3. Các đặc điểm tối ưu hóa hiệu năng
1. **Debounce Auto-Save (650ms):** Khi người dùng gõ văn bản nhanh trong textarea hoặc di chuyển chuột kéo node liên tục, hàm `scheduleAutoSave()` sẽ reset bộ hẹn giờ để không thực hiện ghi đĩa liên tục, bảo vệ tuổi thọ ổ cứng và tránh làm chậm luồng UI.
2. **Hàng đợi Promise tuần tự (`workflowSaveQueue`):** Toàn bộ các yêu cầu lưu được xếp nối tiếp nhau (`workflowSaveQueue = workflowSaveQueue.catch(()=>{}).then(saveWorkflowSnapshot)`). Điều này ngăn chặn tình trạng một tác vụ lưu trước đó chưa ghi xong IndexedDB thì tác vụ lưu mới đã đè lên làm rách dữ liệu (race condition).
3. **Bộ nhớ đệm trong phiên (`cache Map`):** Trong quá trình nạp lại (`hydrateWorkflowMedia`), nếu cùng một ảnh được chia sẻ cho nhiều node (ví dụ node References nối sang 5 node Generate khác nhau), hàm hydrate chỉ đọc IndexedDB và gọi `URL.createObjectURL` đúng một lần duy nhất, chia sẻ chung URL blob cho các node để tiết kiệm tối đa bộ nhớ RAM.

---

## Liên kết liên quan
- [Module Lưu trữ](../03-module/storage-system.md)
- [Module Canvas Core](../03-module/canvas-core.md)
- [Chi tiết Luồng thực thi](thuc-thi-workflow-sinh-media.md)
