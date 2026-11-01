# Hướng dẫn Đóng góp (Contributing to MuseFlow)

Cảm ơn bạn đã quan tâm đóng góp cho dự án **MuseFlow (26Flow)**! Dự án được phát triển theo mô hình mã nguồn mở với cam kết duy trì chuẩn công nghiệp về độ tin cậy và hệ thống tài liệu.

---

## ⚠️ NGUYÊN TẮC BẮT BUỘC: TÀI LIỆU SONG HÀNH CÙNG CODE
> [!IMPORTANT]
> **Mọi thay đổi mã nguồn (code changes) — dù là thêm tính năng mới, sửa lỗi, cập nhật selector hay đổi phím tắt — ĐỀU BẮT BUỘC PHẢI CẬP NHẬT TÀI LIỆU TƯƠNG ỨNG TRONG THƯ MỤC `docs/`.**
> 
> Bất kỳ Pull Request nào chỉ sửa code mà không cập nhật tài liệu giải thích kiến trúc hoặc hướng dẫn người dùng liên quan sẽ không được chấp nhận (merge).

---

## Quy trình Đóng góp Chuẩn

### 1. Chuẩn bị môi trường
- Đảm bảo máy tính đã cài đặt **Node.js (v18.0 trở lên)** và trình duyệt nền Chromium (Google Chrome, Microsoft Edge, Brave).
- Clone dự án về máy:
  ```bash
  git clone https://github.com/<YOUR_USERNAME>/museflow.git
  cd museflow
  ```

### 2. Tạo nhánh tính năng (Branch)
- Đặt tên nhánh theo quy ước:
  - `feat/<tên-tính-năng>` (ví dụ: `feat/audio-waveform`)
  - `fix/<tên-lỗi>` (ví dụ: `fix/bridge-stop-button`)
  - `docs/<nội-dung-tài-liệu>` (ví dụ: `docs/update-faq`)
  - `refactor/<tên-module>` (ví dụ: `refactor/canvas-math`)

### 3. Quy chuẩn Lập trình (Coding Standards)
- **Zero-Dependency First:** Không đưa thêm các gói npm vào mã nguồn chạy của tiện ích.
- **JSDoc Tiếng Việt Đầy đủ:** Mọi hàm mới hoặc hàm chỉnh sửa phải có JSDoc tiếng Việt mô tả chi tiết tham số, giá trị trả về và ngoại lệ.
- **Bảo toàn tính tương thích:** Đảm bảo đồ thị workflow cũ của người dùng vẫn nạp và chạy được bình thường.
- Xem chi tiết tại: [Quy ước lập trình (docs/07-huong-dan-phat-trien/coding-convention.md)](docs/07-huong-dan-phat-trien/coding-convention.md).

### 4. Kiểm thử Cục bộ Trước khi Gửi PR
Chạy lệnh kiểm tra cú pháp toàn bộ tệp JavaScript:
```powershell
node -c background.js; node -c muse-bridge.js; node -c app.js
```
Đảm bảo tất cả lệnh đều thoát với mã `0` (không có lỗi cú pháp).

### 5. Cập nhật Tài liệu Kỹ thuật
- Nếu thêm node mới: Cập nhật [docs/03-module/graph-engine.md](docs/03-module/graph-engine.md).
- Nếu sửa logic điều khiển: Cập nhật [docs/04-chi-tiet-ma-nguon/app-js.md](docs/04-chi-tiet-ma-nguon/app-js.md).
- Nếu thay đổi luồng xử lý: Cập nhật các sơ đồ tuần tự trong [docs/05-luong-xu-ly/](docs/05-luong-xu-ly/).

### 6. Gửi Pull Request (PR)
- Viết commit message theo chuẩn **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`).
- Mở PR trên GitHub và điền đầy đủ thông tin theo mẫu template có sẵn, tích chọn xác nhận đã cập nhật tài liệu trong `docs/`.

---

## Liên kết Hữu ích
- [Mục lục Tài liệu Kỹ thuật](docs/README.md)
- [Kiến trúc Tổng thể](docs/01-tong-quan/kien-truc.md)
- [Hướng dẫn Kiểm thử](docs/07-huong-dan-phat-trien/kiem-thu.md)
