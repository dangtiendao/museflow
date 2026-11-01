# Đặc tả Giao thức Tin nhắn Nội bộ (Internal Message Passing API)

## 1. Tổng quan
Do MuseFlow là một tiện ích mở rộng Chrome chạy theo mô hình không máy chủ (Serverless / Zero-backend), hệ thống không sử dụng REST API hay GraphQL truyền thống qua mạng HTTP. Thay vào đó, giao diện Canvas chính ([app.js](../../app.js)) giao tiếp với Content Script ([muse-bridge.js](../../muse-bridge.js)) thông qua cơ chế **Chrome Extension Message Passing API** (`chrome.tabs.sendMessage`).

Tài liệu này đặc tả toàn bộ các loại thông điệp (Messages), cấu trúc dữ liệu yêu cầu (Request payload), phản hồi (Response payload) và các mã lỗi chuẩn của hệ thống.

---

## 2. Danh mục các Thông điệp (Message Endpoints)

### 1. `MUSEFLOW_CHECK_SESSION`
Kiểm tra trạng thái sẵn sàng của phiên làm việc trên tab Muse.ai đang mở.

- **Chiều gửi:** Canvas App $\rightarrow$ Content Script (Muse tab).
- **Cấu trúc Request:**
  ```json
  {
    "type": "MUSEFLOW_CHECK_SESSION"
  }
  ```
- **Cấu trúc Response thành công:**
  ```json
  {
    "ok": true,
    "signedIn": true,
    "composer": true,
    "loginRequired": false,
    "title": "Muse - AI Video & Image Generator",
    "url": "https://muse.ai/chat"
  }
  ```
- **Ý nghĩa các trường phản hồi:**
  - `ok` (*boolean*): Luôn bằng `true` nếu script cầu nối nhận và xử lý được thông điệp.
  - `signedIn` (*boolean*): `true` nếu hộp thoại chat sẵn sàng và không có form bắt đăng nhập.
  - `composer` (*boolean*): `true` nếu phần tử `<textarea>` soạn thảo tin nhắn hiển thị và cho phép nhập liệu.
  - `loginRequired` (*boolean*): `true` nếu phát hiện có ô nhập mật khẩu hoặc nút bấm đăng nhập tài khoản.
  - `title` (*string*): Tiêu đề của tab Muse.ai hiện tại.
  - `url` (*string*): Địa chỉ URL hiện tại của tab.

---

### 2. `MUSEFLOW_GENERATE`
Yêu cầu Muse.ai thực hiện sinh một hình ảnh tĩnh hoặc một clip video theo prompt và các ảnh tham chiếu được chỉ định.

- **Chiều gửi:** Canvas App $\rightarrow$ Content Script (Muse tab).
- **Cấu trúc Request:**
  ```json
  {
    "type": "MUSEFLOW_GENERATE",
    "requestId": "generation-f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "prompt": "Cinematic portrait of a futuristic Vietnamese woman...",
    "negativePrompt": "blurry, low quality, distorted anatomy",
    "mediaType": "video",
    "size": "16:9",
    "model": "muse-video",
    "duration": 5,
    "referenceImages": [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "https://muse.ai/attachment/example-123.jpg"
    ],
    "timeoutSec": 600
  }
  ```
- **Ý nghĩa các tham số Request:**
  - `requestId` (*string, bắt buộc*): Mã định danh duy nhất của yêu cầu để theo dõi và hỗ trợ hủy bỏ.
  - `prompt` (*string, bắt buộc*): Nội dung câu lệnh văn bản gửi vào hộp chat Muse.
  - `negativePrompt` (*string, tùy chọn*): Nội dung các chi tiết cần tránh.
  - `mediaType` (*"image" \| "video", mặc định: "image"*): Loại media cần sinh.
  - `size` (*string, mặc định: "1:1"*): Tỷ lệ khung hình mong muốn (`"1:1"`, `"16:9"`, `"9:16"`, `"4:3"`, `"3:4"`).
  - `model` (*string*): Định danh model (`"muse-image"` hoặc `"muse-video"`).
  - `duration` (*number, chỉ dùng cho video*): Thời lượng clip tính theo giây (`5`, `6`, `8`, `10`).
  - `referenceImages` (*string[]*): Danh sách URL hoặc chuỗi DataURL của các ảnh tham chiếu cần đính kèm.
  - `timeoutSec` (*number, mặc định: 600*): Thời gian tối đa chờ đợi Muse hoàn tất trước khi báo lỗi timeout.

- **Cấu trúc Response thành công:**
  ```json
  {
    "ok": true,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```
  *(Với video, `url` có thể là link blob hoặc link trực tiếp tệp MP4/WebM trên máy chủ Muse).*

- **Cấu trúc Response thất bại:**
  ```json
  {
    "ok": false,
    "code": "SCENE_REFUSED",
    "error": "Muse could not generate this scene: Tôi rất tiếc, tôi không thể tạo nội dung này..."
  }
  ```

---

### 3. `MUSEFLOW_STOP_GENERATION`
Yêu cầu dừng khẩn cấp tác vụ đang sinh media trên Muse.ai.

- **Chiều gửi:** Canvas App $\rightarrow$ Content Script (Muse tab).
- **Cấu trúc Request:**
  ```json
  {
    "type": "MUSEFLOW_STOP_GENERATION",
    "requestId": "generation-f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
  ```
  *(Nếu bỏ trống `requestId`, bridge sẽ hủy tất cả các tác vụ đang chạy).*

- **Cấu trúc Response:**
  ```json
  {
    "ok": true,
    "stopped": true
  }
  ```

---

## 3. Bảng Mã Lỗi Chuẩn (Error Codes)

| Mã lỗi (`code`) | Tên ngoại lệ | Nguyên nhân và Ý nghĩa | Cách hệ thống xử lý |
| :--- | :--- | :--- | :--- |
| `SCENE_REFUSED` | Scene Refusal Error | Trợ lý Muse phản hồi văn bản từ chối tạo cảnh do vi phạm chính sách an toàn nội dung. | [app.js](../../app.js) tự động ghép thêm chỉ dẫn `SAFE EQUIVALENT RETRY` và gửi thử lại đúng 1 lần duy nhất. |
| `MEDIA_TYPE_MISMATCH` | Media Type Mismatch | Người dùng yêu cầu sinh hình ảnh (`image`) nhưng Muse lại trả về video, hoặc ngược lại. | Báo lỗi trên statusbar yêu cầu người dùng chuyển composer của Muse sang đúng chế độ và thử lại. |
| `MUSE_ERROR` | Generic Bridge Error | Lỗi không tìm thấy hộp chat, lỗi đính kèm ảnh tham chiếu thất bại, hoặc hết thời gian chờ timeout. | Hiển thị thông báo lỗi chi tiết màu đỏ trên thanh statusbar. |
| `AbortError` | DOM Abort Exception | Người dùng chủ động bấm nút "■ Stop" hoặc chuyển đổi trạng thái khi đang chạy. | Cập nhật node sang trạng thái `stopped` và hủy tiến trình ngầm êm ái. |

---

## Liên kết liên quan
- [Module Muse Bridge](../03-module/muse-bridge.md)
- [Luồng Thực thi Workflow](../05-luong-xu-ly/thuc-thi-workflow-sinh-media.md)
- [Luồng Xử lý Từ chối](../05-luong-xu-ly/xu-ly-refusal-va-retry.md)
