# Phân tích Chi tiết Tệp: `app.js`

## 1. Thông tin chung
- **Đường dẫn file:** `app.js`
- **Đường dẫn mã nguồn gốc:** [../../app.js](../../app.js)
- **Quy mô tập tin:** ~1.350 dòng mã nguồn, ~88 hàm nghiệp vụ.
- **Chức năng chính:** Khối điều khiển trung tâm (Master Application Controller) quản lý toàn bộ vòng đời của MuseFlow: quản lý trạng thái state, dựng cây DOM node, vẽ đồ họa SVG, giải quyết quan hệ đồ thị DAG, bóc tách kịch bản phân cảnh, giao tiếp cầu nối Muse.ai, phát xem trước và xuất video timeline bằng FFmpeg WASM, quản lý lưu trữ IndexedDB và Chrome Storage.

---

## 2. Vai trò trong Hệ thống
- **Thuộc tầng:** Tầng Lõi Nghiệp vụ & Điều khiển Ứng dụng (Core Business & Application Layer).
- **Được gọi bởi:** [app.html](../../app.html) khi trang canvas được nạp vào trình duyệt.
- **Gọi đến:**
  - `chrome.runtime`, `chrome.tabs`, `chrome.storage.local`, `chrome.scripting`.
  - Content Script [muse-bridge.js](../../muse-bridge.js) thông qua message passing.
  - Cơ sở dữ liệu IndexedDB `museflow-media`.
  - Thư viện WebAssembly `window.FFmpegWASM.FFmpeg`.
  - Các phần tử DOM trong [app.html](../../app.html).

---

## 3. Cấu trúc Đối tượng Trạng thái Toàn cục (`state`)
Mọi dữ liệu hoạt động của MuseFlow được gói gọn trong đối tượng `state`:
- `nodes`: Mảng chứa danh sách các node hiện có trên canvas.
- `edges`: Mảng chứa các đường nối (`{ id, source, sourcePort, target, targetPort }`).
- `groups`: Mảng các vùng phân nhóm node (`{ id, name, x, y, width, height, nodeIds }`).
- `notes`: Mảng các thẻ ghi chú văn bản tự do (`{ id, text, x, y, width, height }`).
- `selectedNodeIds`, `selectedEdgeIds`: Tập hợp các đối tượng đang được chọn.
- `zoom`, `panX`, `panY`: Thông số biến đổi khung nhìn canvas.
- `isRunning`, `activeGenerationId`: Trạng thái thực thi tiến trình sinh nội dung.
- `timelineExporting`, `timelineFFmpeg`: Trạng thái tiến trình xuất video.

---

## 4. Phân nhóm Các Hàm Nghiệp vụ Chính (Functional Modules)

### a. Nhóm Quản lý Đồ thị & Undo/Redo
- `createUndoSnapshot(label, options)`: Chụp sâu trạng thái vào `undoStack` (tối đa 40 bước).
- `undoLastChange()`: Phục hồi trạng thái trước đó, giữ lại asset runtime nếu `preserveRuntime=true`.
- `addNode(type, x, y)`: Thêm node mới, tự động nối node References nếu có.
- `removeNode(id)` / `removeSelectedNodes()`: Xóa node và dọn dẹp các đường nối mồ côi.
- `selectNode(id, options)`: Xử lý chọn đơn, chọn nhiều (Shift/Ctrl).
- `duplicateNodesForDrag(ids)`: Nhân bản nhóm node khi người dùng giữ phím Alt và kéo chuột.

### b. Nhóm Kết nối Cổng & Thuật toán Đồ thị
- `canConnectTypes(outType, inType)`: Kiểm tra tương thích kiểu dữ liệu (hỗ trợ ép kiểu `media`).
- `wouldCreateCycle(sourceId, targetId, replacedPort)`: Duyệt BFS phát hiện chu trình lặp kín.
- `connect(targetNodeId, targetPortId)`: Thiết lập đường nối hợp lệ, tự động gán video vào Timeline.
- `topoOrder(preferredGenerationOrder)`: Sắp xếp topo (Kahn's algorithm) để xác định thứ tự thực thi.
- `requiredNodeOrder(targetId)`: Lọc tập hợp tối thiểu các node tiền đề để chạy một node đích.
- `resolvePrompt(nodeId)` / `resolveText()`: Đệ quy thu thập văn bản prompt từ các node nguồn.
- `resolveReferences(nodeId)`: Thu thập toàn bộ ảnh tham chiếu và frame cuối của clip trước nếu bật continuity.

### c. Nhóm Bóc tách Kịch bản (Script to Nodes)
- `parseSceneScript(text)`: Quét regex nhận diện các tiêu đề cảnh `CẢNH X (...)` hoặc `Scene X (...)`, bóc tách các trường khung đầu/cuối, nhịp độ diễn biến, prompt ảnh, prompt video, audio và negative prompt.
- `extractBracketLocks()` & `expandScriptLocks()`: Bung các khối khóa dùng chung `[CHAR_LOCK]`, `[STYLE_LOCK]` vào prompt từng cảnh.
- `buildSceneNodesFromScript()`: Tự động tạo hệ thống node ảnh/video theo hàng cột trên canvas và nạp clip vào Timeline dock.

### d. Nhóm Tương tác Canvas & Đồ họa SVG
- `applyCanvasTransform()`: Áp dụng CSS `translate` và `scale` lên canvas và SVG edges.
- `zoomAt(x, y, factor)` / `setZoom()` / `fitCanvas()`: Điều khiển thu phóng và căn vừa màn hình.
- `startPan()` / `movePan()` / `endPan()`: Kéo trượt màn hình qua Hand tool hoặc phím Space / chuột giữa.
- `drawEdges()` & `scheduleDrawEdges()`: Lên lịch vẽ lại đường cong Bezier trên SVG bằng `requestAnimationFrame`.
- `startSelectionMarquee()` & `moveGroupMarquee()`: Kéo khung chọn đa đối tượng và vẽ vùng nhóm.

### e. Nhóm Điều phối Thực thi & Kết nối Muse.ai
- `testMuseSession(tabId)`: Gửi thông điệp kiểm tra session Muse.ai và cập nhật statusbar.
- `museTabMessage(message, tabId, signal)`: Gửi lệnh đến tab Muse.ai, tự động inject script cầu nối nếu tab chưa có bridge.
- `execute(targetId, options)`: Hàm thực thi cốt lõi:
  - Duyệt qua từng node theo thứ tự topo.
  - Xử lý đổi kích thước ảnh (`imageResize`).
  - Điền prompt và ảnh tham chiếu gửi tới Muse.ai.
  - Tự động bắt mã lỗi `SCENE_REFUSED` và gửi prompt an toàn tương đương để thử lại 1 lần duy nhất.
  - Trích xuất khung hình cuối của video (`extractVideoEndFrame`) làm continuity.
  - Kiểm tra độ lệch tỷ lệ khung hình intrinsic (`sizeMismatch`).
- `stopGeneration(nodeId)` & `sendMuseStop()`: Hủy tác vụ và gửi lệnh dừng tới giao diện Muse.ai.

### f. Nhóm Timeline & Biên tập Video
- `syncTimelineDock()`: Đồng bộ hóa danh sách clip, thước đo thời gian và kim phát trên dock Timeline.
- `playTimeline(node, options)`: Phát xem trước video liên tục bằng kỹ thuật double-buffering giữa 2 player.
- `createSilentWav()`: Sinh tệp âm thanh khoảng lặng 16-bit PCM 48kHz Stereo ngay trong bộ nhớ.
- `exportTimelineMp4WithFFmpeg()`: Nạp FFmpeg WASM, thăm dò thông số clip qua ffprobe, ghép nối trực tiếp (copy-mode) hoặc chạy filter graph phức tạp để xuất tệp MP4 H.264/AAC.
- `exportTimelineVideo()`: Điểm điều phối xuất video (MP4 FFmpeg hoặc WebM MediaRecorder).

### g. Nhóm Lưu trữ Bền vững (Hybrid Storage)
- `mediaDb()` / `putMedia()` / `getMedia()`: Đọc và ghi tệp Blob media nhị phân vào IndexedDB `museflow-media`.
- `dehydrateMediaUrl()` / `saveWorkflowSnapshot()`: Tách Blob ra khỏi JSON đồ thị và lưu cấu trúc nhẹ vào Chrome Storage.
- `hydrateMediaUrl()` / `hydrateWorkflowMedia()`: Đọc Blob từ IndexedDB và tái lập `blob:` URLs khi nạp ứng dụng.
- `exportWorkflowFile()` / `importWorkflowFile()`: Xuất/nhập tệp workflow di động dạng JSON nhúng toàn bộ ảnh/video base64.

---

## 5. Bảng Phụ thuộc (Dependencies)
- **Thư viện bên ngoài:** `window.FFmpegWASM.FFmpeg` (từ `vendor/ffmpeg/ffmpeg.js`).
- **APIs Trình duyệt:** Chrome Extension APIs (`storage`, `tabs`, `scripting`, `runtime`), IndexedDB API, Web Audio API, Canvas 2D API, MediaRecorder API.
- **Module nội bộ tham chiếu:** [muse-bridge.js](../../muse-bridge.js), [app.html](../../app.html), [styles.css](../../styles.css).

---

## 6. Lưu ý Kỹ thuật và Đánh giá Rủi ro
- **Kiến trúc Tệp đơn (Single File Architecture):** Toàn bộ logic gói trong một IIFE duy nhất. Mặc dù giúp tiện ích đạt chuẩn zero-build/zero-dependency, nhưng mã nguồn có độ dài lớn (~1.350 dòng). Việc đã bổ sung JSDoc toàn diện cho 88 hàm giúp lập trình viên dễ dàng định vị các khối chức năng.
- **Quản lý bộ đệm IndexedDB:** Cần chú ý dọn dẹp các bản ghi mồ côi trong IndexedDB khi người dùng xóa node hoặc làm mới workflow để tối ưu dung lượng ổ cứng.

---

## Liên kết liên quan
- [Module Canvas Core](../03-module/canvas-core.md)
- [Module Graph Engine](../03-module/graph-engine.md)
- [Module Timeline Engine](../03-module/timeline-engine.md)
- [Module Lưu trữ](../03-module/storage-system.md)
- [Luồng Thực thi Workflow](../05-luong-xu-ly/thuc-thi-workflow-sinh-media.md)
