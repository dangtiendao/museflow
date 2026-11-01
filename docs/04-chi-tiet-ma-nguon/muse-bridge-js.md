# Phân tích Chi tiết Tệp: `muse-bridge.js`

## 1. Thông tin chung
- **Đường dẫn file:** `muse-bridge.js`
- **Đường dẫn mã nguồn gốc:** [../../muse-bridge.js](../../muse-bridge.js)
- **Chức năng chính:** Content script tự động hóa giao tiếp với trang chat của Muse.ai: kiểm tra phiên làm việc, tự động điền prompt, đính kèm ảnh tham chiếu, lắng nghe sự kiện DOM để thu nhận media kết quả, và nhận diện lời từ chối của AI.

---

## 2. Vai trò trong Hệ thống
- **Thuộc tầng:** Tầng Cầu nối Tự động hóa Giao diện (DOM Automation Bridge Layer).
- **Được gọi bởi:** [app.js](../../app.js) thông qua hàm `chrome.tabs.sendMessage()`.
- **Gọi đến:** Cây DOM của trang web Muse.ai (`https://muse.ai/*`).

---

## 3. Luồng Xử lý Dữ liệu
- **Input:**
  - Tin nhắn `MUSEFLOW_CHECK_SESSION`
  - Tin nhắn `MUSEFLOW_GENERATE` (kèm `prompt`, `mediaType`, `size`, `referenceImages`, `timeoutSec`, `requestId`)
  - Tin nhắn `MUSEFLOW_STOP_GENERATION` (kèm `requestId`)
- **Xử lý:**
  1. Gán cờ `window.__museFlowBridgeInstalled` tránh nạp script lặp lại.
  2. `checkSession()`: Kiểm tra trạng thái khung nhập và form đăng nhập.
  3. `attachReferences()`: Tải ảnh qua `fetch()`, tạo đối tượng `File` và đưa vào `HTMLInputElement` qua `DataTransfer`.
  4. Gán prompt vào textarea bằng `Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set` và kích hoạt synthetic events.
  5. Click nút Send hoặc submit form / dispatch phím Enter.
  6. Theo dõi DOM bằng `MutationObserver` để bắt thẻ `img` hoặc `video` mới.
  7. Tính toán sai số tỷ lệ khung hình (log-ratio score) để chọn chính xác media vừa sinh.
  8. Quét regex `isRefusalContext()` phát hiện lời từ chối bằng tiếng Việt hoặc tiếng Anh.
- **Output:** Trả về đối tượng `{ ok: true, url: dataUrl|videoUrl }` hoặc ném ngoại lệ `{ ok: false, code: 'SCENE_REFUSED'|'MEDIA_TYPE_MISMATCH', error }`.

---

## 4. Danh sách các hàm chính trong tệp

| Tên hàm | Tham số | Giá trị trả về | Chức năng |
| :--- | :--- | :--- | :--- |
| `findComposer()` | Không | `HTMLTextAreaElement\|null` | Tìm phần tử textarea soạn thảo tin nhắn trên Muse chat |
| `visible(el)` | `el: Element` | `boolean` | Kiểm tra phần tử có thực sự hiển thị trên màn hình không |
| `delay(ms, signal)` | `ms: number, signal?: AbortSignal` | `Promise<void>` | Tạo độ trễ bất đồng bộ có hỗ trợ ngắt bởi tín hiệu hủy |
| `clickMuseStop()` | Không | `boolean` | Tìm và click nút Stop trên giao diện Muse |
| `abortGeneration(requestId)` | `requestId: string` | `boolean` | Hủy tác vụ tạo đang chạy theo mã yêu cầu |
| `checkSession()` | Không | `Promise<Object>` | Kiểm tra tính sẵn sàng của phiên Muse.ai |
| `waitHydrated(timeout, signal)` | `timeout: number, signal?: AbortSignal` | `Promise<void>` | Chờ trang web Muse hoàn tất quá trình client hydration |
| `attachments()` | Không | `Array<Object>` | Thu thập danh sách attachments media của trợ lý AI |
| `waitForAttachmentChange()` | `timeoutMs: number, signal?: AbortSignal` | `Promise<void>` | Dùng MutationObserver lắng nghe DOM cập nhật |
| `assistantMessageElements()` | Không | `Element[]` | Lấy các phần tử bong bóng chat của Muse Assistant |
| `readNewAssistantContext()` | `previousBubbleTexts: Map` | `string` | Đọc đoạn văn bản phản hồi mới nhất của trợ lý |
| `isRefusalContext(context)` | `context: string` | `boolean` | Kiểm tra Regex phát hiện lời từ chối tạo cảnh |
| `generate(options, signal)` | `options: Object, signal: AbortSignal` | `Promise<Object>` | Quy trình tự động hóa sinh ảnh/video hoàn chỉnh |
| `attachReferences(refs, signal)` | `refs: Array, signal?: AbortSignal` | `Promise<void>` | Tải và đính kèm danh sách ảnh tham chiếu vào composer |
| `blobToDataUrl(blob)` | `blob: Blob` | `Promise<string>` | Chuyển đổi Blob nhị phân thành base64 data URL |

---

## 5. Bảng Phụ thuộc (Dependencies)
- **Thư viện bên ngoài:** Native Web APIs (`MutationObserver`, `DataTransfer`, `FileReader`, `fetch`, `AbortController`).
- **Module nội bộ tham chiếu:** Không có.

---

## 6. Lưu ý Kỹ thuật và Đánh giá Rủi ro
- **Sự thay đổi giao diện của Muse.ai:** Nếu Muse.ai thay đổi các thuộc tính selector (ví dụ `data-testid="hatch-composer-stop-button"` hoặc cấu trúc thẻ input file), bridge sẽ không thể tìm thấy phần tử. Cần duy trì các selector dự phòng linh hoạt.
- **Bảo mật CORS & Fetch:** Khi fetch ảnh tham chiếu dạng blob, hàm sử dụng `credentials: 'include'` để đảm bảo gửi kèm cookie phiên đăng nhập hợp lệ.

---

## Liên kết liên quan
- [Module Muse Bridge](../03-module/muse-bridge.md)
- [Đặc tả Message Protocol](../06-api/message-protocol.md)
- [Luồng Xử lý Từ chối](../05-luong-xu-ly/xu-ly-refusal-va-retry.md)
