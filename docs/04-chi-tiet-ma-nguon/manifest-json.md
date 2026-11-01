# Phân tích Chi tiết Tệp: `manifest.json`

## 1. Thông tin chung
- **Đường dẫn file:** `manifest.json`
- **Đường dẫn mã nguồn gốc:** [../../manifest.json](../../manifest.json)
- **Chức năng chính:** Khai báo cấu hình mở rộng WebExtension Manifest V3 cho tiện ích "26Flow" (MuseFlow), định nghĩa quyền hạn, scripts nền, content scripts, và quy tắc bảo mật CSP.

---

## 2. Vai trò trong Hệ thống
- **Thuộc tầng:** Tầng Cấu hình Nền tảng (Platform & Security Configuration Layer).
- **Được gọi bởi:** Trình duyệt Chromium (Chrome, Edge, Brave...) tự động đọc và phân tích khi tiện ích được nạp hoặc khởi động trình duyệt.
- **Gọi đến:**
  - [background.js](../../background.js): Đăng ký làm Service Worker nền.
  - [muse-bridge.js](../../muse-bridge.js): Đăng ký làm Content Script tự động inject vào `https://muse.ai/*`.
  - [app.html](../../app.html): Trang đích mặc định mở ra khi nhấp action.
  - [icons/](../../icons/): Các icon định dạng chuẩn của extension.

---

## 3. Luồng Xử lý Dữ liệu
- **Input:** Tệp JSON tĩnh chứa các khóa cấu hình chuẩn Manifest V3.
- **Xử lý:** Trình duyệt Chrome kiểm tra tính hợp lệ của schema Manifest V3:
  - Cấp quyền lưu trữ (`storage`), truy cập tab (`tabs`) và chèn script (`scripting`).
  - Thiết lập bộ lọc URL để chèn `muse-bridge.js` khi người dùng truy cập `https://muse.ai/*`.
  - Thiết lập quyền CSP nới lỏng cho phép `wasm-unsafe-eval` trong trang tiện ích.
- **Output:** Môi trường thực thi bảo mật cho extension với đầy đủ quyền hạn vận hành.

---

## 4. Bảng Phụ thuộc (Dependencies)
- **Thư viện bên ngoài:** Không có (tuân thủ đặc tả WebExtensions W3C / Chrome Manifest V3).
- **Module nội bộ tham chiếu:**
  - `background.js`
  - `muse-bridge.js`
  - `icons/icon16.png`, `icons/icon32.png`, `icons/icon48.png`, `icons/icon128.png`

---

## 5. Lưu ý Kỹ thuật và Đánh giá Rủi ro
- **Chính sách CSP (`wasm-unsafe-eval`):** Mặc dù cần thiết cho FFmpeg WebAssembly, thuộc tính này có thể bị kiểm duyệt kỹ khi nộp lên Chrome Web Store. Cần duy trì chính sách không nạp script từ xa để đảm bảo tuân thủ Store Review Policies.
- **Host permissions rộng (`https://raw.githubusercontent.com/...`):** Được sử dụng cho hàm tự kiểm tra phiên bản mới `checkForAppUpdate()`. Nếu sau này chuyển sang hệ thống cập nhật riêng, cần cập nhật lại domain.

---

## Liên kết liên quan
- [Kiến trúc tổng thể](../01-tong-quan/kien-truc.md)
- [Cấu hình hệ thống](../02-cai-dat/cau-hinh.md)
- [Chi tiết background.js](background-js.md)
