# Phân tích Chi tiết Tệp: `styles.css`

## 1. Thông tin chung
- **Đường dẫn file:** `styles.css`
- **Đường dẫn mã nguồn gốc:** [../../styles.css](../../styles.css)
- **Quy mô tập tin:** ~45KB CSS, hơn 50 nhóm quy tắc định dạng.
- **Chức năng chính:** Định nghĩa toàn bộ hệ thống thiết kế (Design System), bố cục giao diện, bảng màu Dark Theme, định dạng các loại Node, mã màu cổng dữ liệu, dây nối SVG, thanh dock Timeline và các cửa sổ Modal đối thoại của MuseFlow.

---

## 2. Vai trò trong Hệ thống
- **Thuộc tầng:** Tầng Định dạng / Trải nghiệm Người dùng (Styling & UX Layer).
- **Được gọi bởi:** [app.html](../../app.html) thông qua thẻ `<link rel="stylesheet" href="styles.css" />`.
- **Gọi đến:** Các phần tử DOM trong [app.html](../../app.html) và các phần tử được sinh động bởi [app.js](../../app.js).

---

## 3. Các Phân khu Thiết kế Chính

### a. Hệ thống Tokens & Toàn cục (`:root`, `body`)
- Phông chữ hệ thống: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Bảng màu nền: Nền tối `#0b0c10`, nền toolbar `#12131a`, viền `#282a33`.
- Bố cục trang chủ sử dụng **CSS Grid**:
  ```css
  body {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
  }
  ```
  Giúp thanh công cụ, thanh trạng thái, vùng nhìn canvas và dock timeline phân chia không gian màn hình chính xác và không bị tràn thanh cuộn ngoài ý muốn.

### b. Vùng nhìn Canvas (`#viewport`, `#canvas`, `#edges`)
- `#viewport`: Hiển thị lưới tọa độ chấm bi chấm tròn tinh tế bằng kỹ thuật `radial-gradient(#2b2d37 1px, transparent 1px)` kích thước `20px 20px`.
- `#edges`: Lớp SVG phủ toàn bộ kích thước viewport với `pointer-events: none` để các thao tác chuột có thể xuyên qua tác động vào canvas bên dưới.

### c. Hệ thống Node và Cổng Dữ liệu
- Khung node (`.node`): Kích thước chuẩn rộng 270px, bo góc 13px, đổ bóng sâu `box-shadow: 0 16px 40px #0007`.
- Trạng thái chọn (`.node.selected`): Viền sáng tím `#8268ff` và hiệu ứng hào quang.
- **Mã màu phân loại kiểu dữ liệu cổng (Port Color Coding):**
  - Cổng văn bản `text`: Màu tím tím `#8b6fff`.
  - Cổng prompt âm `negative`: Màu đỏ hồng `#e56c82`.
  - Cổng hình ảnh `image`: Màu xanh dương `#48a8ed`.
  - Cổng video `video`: Màu xanh ngọc `#38c9a0`.
  - Cổng đa phương tiện `media`: Màu tím oải hương `#a182ff`.

### d. Thanh dock Timeline (`#timelineDock`)
- Nằm cố định ở chân màn hình với hiệu ứng chuyển động mượt mà (`transition: height .18s ease`).
- Thước đo thời gian (`.timeline-ruler`): Có các vạch chia giây dính (`position: sticky`) khi cuộn ngang.
- Thẻ clip (`.dock-clip`): Hiển thị thumbnail, tên cảnh và điều khiển thời lượng dạng Compact hoặc Full.

### e. Khung xem trước kép (`#timelinePreviewPanel`)
- Quản lý 2 thẻ `<video>` chồng khít lên nhau bằng `position: absolute; inset: 0`.
- Chuyển cảnh mượt mà qua các lớp `.is-active` (opacity 1) và `.is-fading` (opacity 0, `transition: opacity .14s ease`).

---

## 4. Bảng Phụ thuộc (Dependencies)
- **Thư viện bên ngoài:** Không có (Pure CSS3).
- **Module nội bộ tham chiếu:** Gắn kết chặt chẽ với cấu trúc class của [app.html](../../app.html) và [app.js](../../app.js).

---

## 5. Lưu ý Kỹ thuật và Đánh giá Rủi ro
- **Bộ chọn `:has()` hiện đại:** Sử dụng `body:has(#timelineDock:not(.collapsed)) #viewport` để tự động tính toán lại chiều cao vùng nhìn canvas khi dock timeline mở ra hoặc thu gọn lại mà không cần lắng nghe sự kiện bằng JavaScript. Yêu cầu trình duyệt Chromium phiên bản 105 trở lên.

---

## Liên kết liên quan
- [Chi tiết app.html](app-html.md)
- [Module Canvas Core](../03-module/canvas-core.md)
- [Module Timeline Engine](../03-module/timeline-engine.md)
