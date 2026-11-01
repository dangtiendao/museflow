# Công nghệ và Môi trường Runtime

## 1. Ngôn ngữ lập trình & Công nghệ Web
Dự án MuseFlow được xây dựng hoàn toàn bằng các công nghệ chuẩn của nền tảng Web hiện đại, không phụ thuộc vào bất kỳ framework đóng gói nào:

| Thành phần | Công nghệ | Chi tiết sử dụng |
| :--- | :--- | :--- |
| **Logic lõi** | Modern JavaScript (ES2022+) | - Sử dụng cú pháp `async/await`, `Promise`, `Set`, `Map`, `structuredClone`<br/>- Điều khiển bất đồng bộ với `AbortController` và `AbortSignal`<br/>- Quản lý luồng nhị phân với `ArrayBuffer`, `DataView`, `Blob`, `File` |
| **Cấu trúc giao diện** | HTML5 Semantic | Khai báo các phân vùng `<header>`, `<main>`, `<section>`, `<aside>`, `<video>`, `<canvas>`, `<svg>` |
| **Định dạng & Bố cục** | CSS3 & CSS Variables | Bố cục CSS Grid, Flexbox, Pseudo-classes `:has()`, `:focus-visible`, Dark theme palette |
| **Đồ họa Dây nối** | SVG (Scalable Vector Graphics) | Vẽ đường cong Bezier bậc ba (`<path d="M... C...">`) với độ uốn mềm mại |

---

## 2. Nền tảng Runtime & Extension Specs
- **Chuẩn Tiện ích mở rộng:** **Google Chrome Extension Manifest V3 (MV3)**.
- **Service Worker:** [background.js](file:///e:/Project/museflow/background.js) hoạt động dưới dạng Event-driven Service Worker, tự động giải phóng bộ nhớ khi không có sự kiện.
- **Content Security Policy (CSP):**
  ```json
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
  }
  ```
  Cho phép nạp và biên dịch mã WebAssembly cục bộ (`wasm-unsafe-eval`) phục vụ FFmpeg WASM.
- **Hệ thống API Trình duyệt:**
  - `chrome.action`: Quản lý sự kiện nhấp biểu tượng tiện ích.
  - `chrome.tabs`: Truy vấn tab, tạo tab mới và gửi tin nhắn (`sendMessage`).
  - `chrome.scripting`: Inject content script vào tab khi cần thiết.
  - `chrome.storage.local`: Lưu trữ trạng thái đồ thị và cài đặt người dùng.

---

## 3. Hệ thống Lưu trữ & Xử lý Media
- **IndexedDB API:**
  - Cơ sở dữ liệu: `museflow-media`, Object Store: `assets`.
  - Lưu trữ các tệp Blob nhị phân dung lượng lớn của video, ảnh kết quả và ảnh trích xuất khung hình cuối.
- **HTML5 Canvas 2D Context:**
  - Thực hiện vẽ và đổi kích thước ảnh (`Image Resize` node) với các thuật toán `cover`, `contain`, `stretch`.
  - Trích xuất khung hình cuối cùng của video (`extractVideoEndFrame`) làm ảnh nối tiếp cho cảnh kế tiếp.
- **Web Audio API:**
  - Sử dụng `AudioContext` và `MediaStreamAudioDestinationNode` để ghép đường âm thanh vào luồng canvas capture.
  - Tạo tệp âm thanh khoảng lặng định dạng WAV chuẩn (16-bit PCM, 48kHz Stereo) bằng thao tác trực tiếp trên byte nhị phân.
- **MediaRecorder API:**
  - Thu và xuất chuỗi video trực tiếp từ canvas stream với định dạng WebM (VP9/VP8 và Opus).

---

## 4. Động cơ FFmpeg WebAssembly (Client-Side Encoding)
- **Thư viện:** FFmpeg.wasm phiên bản UMD đóng gói sẵn trong `vendor/ffmpeg/`.
- **Cơ chế hoạt động:**
  1. Nạp file nhị phân WebAssembly `ffmpeg-core.wasm` vào Web Worker độc lập.
  2. Tạo hệ thống tệp ảo trong bộ nhớ (virtual in-memory filesystem) với các lệnh `writeFile()`, `readFile()`.
  3. Dùng `ffprobe` trích xuất codec video, audio, kích thước và framerate của từng clip.
  4. Lắp ráp filter graph phức tạp (`filter_complex`) để scale đồng nhất kích thước, bù trừ khoảng lặng âm thanh và ghép chuỗi video.
  5. Mã hóa xuất ra định dạng chuẩn `MP4` (codec `libx264` ultrafast, `aac` 192kbps).

---

## 5. Triết lý Thiết kế: Zero-Dependency & Zero-Build
- **Không có bước biên dịch (No Transpilation / No Bundling):** Mã nguồn viết như thế nào sẽ chạy trực tiếp như thế đó trong trình duyệt. Không cần `npm run build`, không cần Babel, Webpack hay Vite.
- **Tải về là dùng ngay (Load Unpacked):** Người dùng chỉ cần tải gói ZIP, giải nén và nạp trực tiếp vào `chrome://extensions`.
- **Bảo toàn tính riêng tư (Privacy & Local Processing):** Dữ liệu không bao giờ rời khỏi thiết bị người dùng ngoại trừ lệnh prompt và ảnh gửi trực tiếp lên phiên Muse.ai.

---

## Liên kết liên quan
- [Kiến trúc tổng thể](kien-truc.md)
- [Yêu cầu hệ thống](../02-cai-dat/yeu-cau-he-thong.md)
- [Chi tiết Module Timeline](../03-module/timeline-engine.md)
