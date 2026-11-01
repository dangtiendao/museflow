# Hướng dẫn Khởi chạy và Vận hành Dự án

## 1. Khởi chạy trong Môi trường Người dùng (User Runtime)
1. Mở trình duyệt Chrome.
2. Đăng nhập và mở một tab chat tại [https://muse.ai](https://muse.ai).
3. Nhấp biểu tượng **26Flow** trên thanh công cụ Extension.
4. Tab làm việc của tiện ích sẽ mở ra tại địa chỉ nội bộ: `chrome-extension://<EXTENSION_ID>/app.html`.
5. Tạo các node và nhấn **▶ Run workflow** để thực thi.

---

## 2. Quy trình Phát triển và Debug (Development & Debugging)

### Cách mở Chrome DevTools cho từng ngữ cảnh

Dự án có 3 ngữ cảnh thực thi độc lập, mỗi ngữ cảnh cần cách mở DevTools riêng:

#### a. Ngữ cảnh Giao diện Canvas (`app.html` & `app.js`)
- Nhấp chuột phải bất kỳ đâu trên trang canvas MuseFlow, chọn **Kiểm tra (Inspect)** (hoặc nhấn `F12` / `Ctrl+Shift+I`).
- Tab **Console** sẽ hiển thị các log render, trạng thái vẽ SVG edges, log của FFmpeg WASM và các lỗi xử lý.
- Tab **Application** $\rightarrow$ **Storage**:
  - Chọn **IndexedDB** $\rightarrow$ `museflow-media` $\rightarrow$ `assets` để kiểm tra các Blob ảnh/video đã lưu.
  - Chọn **Extension Storage** để xem cây JSON của workflow.

#### b. Ngữ cảnh Service Worker (`background.js`)
- Mở `chrome://extensions`.
- Tìm thẻ của tiện ích **26Flow**.
- Nhấp vào liên kết **Service Worker** (dòng chữ "Kiểm tra chế độ xem: Service worker").
- Cửa sổ DevTools riêng sẽ mở ra theo dõi các sự kiện vòng đời và action click.

#### c. Ngữ cảnh Content Script (`muse-bridge.js`)
- Chuyển sang tab đang mở trang web [https://muse.ai](https://muse.ai).
- Nhấn `F12` để mở DevTools của trang Muse.ai.
- Tại tab **Console**, chọn ngữ cảnh dropdown từ `top` sang ngữ cảnh của extension **26Flow** (nếu muốn debug trực tiếp các biến trong bridge).
- Tại đây bạn có thể đặt breakpoint trong hàm `generate()`, `findComposer()` hoặc `attachReferences()`.

---

## 3. Cập nhật mã nguồn khi đang chỉnh sửa (Hot Reload)
Mỗi khi bạn sửa đổi mã nguồn trong các file `.js`, `.html`, `.css`:
1. Vào `chrome://extensions`.
2. Tìm thẻ **26Flow** và nhấp vào biểu tượng **Tải lại (Reload / ↻)**.
3. Chuyển sang tab Muse.ai và nhấn `F5` để tải lại (giúp nạp lại script cầu nối `muse-bridge.js` mới nhất).
4. Tải lại tab Canvas MuseFlow để áp dụng giao diện mới.

---

## 4. Kiểm thử cú pháp tự động (Syntax Checking)
Trước khi commit mã nguồn, chạy lệnh kiểm tra tính toàn vẹn cú pháp của các tệp JavaScript:

```powershell
# Chạy kiểm tra cú pháp trên Windows PowerShell
node -c background.js; node -c muse-bridge.js; node -c app.js
```
Nếu lệnh chạy không in ra thông báo lỗi và thoát với mã `0`, mã nguồn đạt chuẩn cú pháp.

---

## 5. Sinh tài liệu API tự động từ JSDoc (Automated Docs Generation)
Dự án được cấu hình sẵn tệp [jsdoc.json](file:///e:/Project/museflow/jsdoc.json). Bạn có thể sinh tài liệu HTML động từ toàn bộ các chú thích JSDoc tiếng Việt trong mã nguồn:

```bash
# Cài đặt jsdoc toàn cục (nếu chưa có)
npm install -g jsdoc

# Hoặc chạy trực tiếp qua npx (không cần cài đặt)
npx jsdoc -c jsdoc.json

# Kết quả tài liệu HTML sẽ được sinh ra tại thư mục: docs/api-html/
```

---

## 6. Đóng gói phân phối (Packaging Release)
Để đóng gói phiên bản mới phân phối cho người dùng:
1. Nén toàn bộ các tệp trong thư mục gốc (bao gồm `manifest.json`, `app.html`, `app.js`, `background.js`, `muse-bridge.js`, `styles.css`, `icons/`, `vendor/`, `licenses/`, `templates/`) thành tệp ZIP.
2. Loại trừ các thư mục không cần thiết: `.git/`, `docs/`, `scratch/`.
3. Đặt tệp ZIP vào thư mục `downloads/MuseFlow-extension.zip` để cập nhật bản phát hành.

---

## Liên kết liên quan
- [Hướng dẫn cài đặt](huong-dan-cai-dat.md)
- [Cấu hình hệ thống](cau-hinh.md)
- [Quy trình đóng góp](../07-huong-dan-phat-trien/quy-trinh-dong-gop.md)
- [Hướng dẫn kiểm thử](../07-huong-dan-phat-trien/kiem-thu.md)
