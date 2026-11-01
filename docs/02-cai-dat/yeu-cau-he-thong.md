# Yêu cầu Hệ thống

## 1. Môi trường Trình duyệt (Browser Requirements)
MuseFlow được thiết kế dưới dạng Chrome Extension tuân thủ chuẩn **Manifest V3**. Do đó, yêu cầu trình duyệt bắt buộc bao gồm:

- **Hệ trình duyệt hỗ trợ:**
  - Google Chrome (phiên bản 109 trở lên; khuyến nghị phiên bản 116+ để hỗ trợ đầy đủ CSS `:has()` và Service Worker tối ưu).
  - Microsoft Edge (phiên bản 109 trở lên).
  - Brave Browser, Opera, Cốc Cốc hoặc bất kỳ trình duyệt nào xây dựng trên nền tảng Chromium.
- **Tính năng trình duyệt bắt buộc kích hoạt:**
  - Quyền truy cập chế độ Nhà phát triển (**Developer mode**).
  - Hỗ trợ WebAssembly (WASM).
  - Hỗ trợ IndexedDB và Local Storage.

---

## 2. Tài khoản và Dịch vụ Muse.ai
Để thực hiện việc sinh ảnh và video thông qua tiện ích, bạn cần chuẩn bị:

1. **Tài khoản Muse.ai:** Đã đăng ký và còn hiệu lực tại [https://muse.ai](https://muse.ai).
2. **Phiên đăng nhập đang mở:** Phải có ít nhất một tab trình duyệt đang mở trang chat Muse.ai trong cùng một Chrome Profile với tiện ích MuseFlow.
3. **Số dư Credit:** Tài khoản Muse.ai phải còn hạn mức tạo ảnh / tạo video tương ứng với yêu cầu.
4. **Quyền hạn tính năng:** Một số tính năng đặc thù (như chọn tỷ lệ khung hình 16:9, 9:16, hoặc sinh âm thanh trong video) phụ thuộc vào gói đăng ký và khả năng cung cấp của Muse.ai tại thời điểm thực hiện.

---

## 3. Yêu cầu Phần cứng (Hardware Specifications)
Do MuseFlow tích hợp engine **FFmpeg WebAssembly** để ghép video trực tiếp trong trình duyệt trên máy người dùng, cấu hình phần cứng khuyến nghị như sau:

| Thông số | Cấu hình tối thiểu | Cấu hình khuyến nghị |
| :--- | :--- | :--- |
| **CPU** | Dual-Core 2.0 GHz (x86_64 hoặc ARM64) | Quad-Core 2.5 GHz trở lên (Intel Core i5/i7/i9, AMD Ryzen, Apple M-Series) |
| **RAM** | 4 GB | 8 GB trở lên (đặc biệt khi ghép chuỗi từ 5 clip video 1080p trở lên) |
| **Ổ cứng trống** | 500 MB | 2 GB trở lên (phục vụ bộ đệm lưu trữ Blob trong IndexedDB) |
| **Độ phân giải màn hình** | 1280 × 720 px | 1920 × 1080 px (Full HD) trở lên để có không gian canvas thoải mái |

---

## 4. Phần mềm Bổ trợ (Dành cho Lập trình viên)
Nếu bạn chỉ sử dụng tiện ích, bạn **hoàn toàn không cần cài đặt thêm bất kỳ công cụ nào**.  
Nếu bạn tham gia phát triển hoặc kiểm thử mã nguồn:
- **Node.js (v18.0 trở lên):** Dùng để chạy cú pháp kiểm thử tự động `node -c` hoặc chạy công cụ sinh tài liệu `jsdoc`.
- **Git:** Dùng để quản lý mã nguồn và gửi Pull Request.

---

## Liên kết liên quan
- [Hướng dẫn cài đặt](huong-dan-cai-dat.md)
- [Cấu hình hệ thống](cau-hinh.md)
- [Giải đáp thắc mắc (FAQ)](../08-phu-luc/faq.md)
