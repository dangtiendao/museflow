# Giới thiệu Dự án MuseFlow (26Flow)

## 1. Mục tiêu dự án
**MuseFlow** (còn gọi là **26Flow**) là một tiện ích mở rộng (Browser Extension) dành cho các trình duyệt nền tảng Chromium, được thiết kế để cung cấp một môi trường làm việc trực quan dạng đồ thị node (**Visual Workflow Canvas**) và bàn dựng timeline (**Timeline Video Editor**) tương tác trực tiếp với phiên làm việc đã đăng nhập trên [Muse.ai](https://muse.ai).

Mục tiêu cốt lõi của MuseFlow:
- **Xóa bỏ rào cản hạ tầng:** Không yêu cầu cài đặt Docker, Python backend, dịch vụ trung gian `muse2api`, cơ sở dữ liệu bên ngoài hay khóa API (API Key).
- **Trực quan hóa luồng sáng tạo:** Biến các câu prompt đơn lẻ thành một quy trình có hướng (DAG), hỗ trợ ghép văn bản, negative prompt, quản lý ảnh tham chiếu (references), và kế thừa khung hình cuối (continuity) giữa các cảnh video.
- **Dựng và xuất video tại chỗ (Client-Side Video Assembly):** Tích hợp công cụ **FFmpeg WebAssembly** trực tiếp trong tiện ích để ghép nối, thêm dải âm thanh khoảng lặng và xuất tệp video chuẩn MP4 (H.264/AAC) hoặc WebM ngay trên máy tính của người dùng mà không cần tải lên máy chủ ngoài.

---

## 2. Phạm vi ứng dụng
- **Phạm vi hỗ trợ:**
  - Tự động hóa quá trình sinh hình ảnh và video thông qua giao diện chat của Muse.ai.
  - Chuyển đổi kịch bản phân cảnh văn bản (`Script → Nodes`) thành mạng lưới các node ảnh/video có liên kết logic.
  - Sắp xếp, biên tập thời lượng và xem trước chuỗi clip video trên thanh dock Timeline.
  - Xuất bản video hoàn chỉnh định dạng MP4 và WebM.
  - Nhập/xuất tệp quy trình làm việc (`.json`) có nhúng toàn bộ tài nguyên media dạng base64.
- **Giới hạn phạm vi (Out of Scope):**
  - Dự án không lưu trữ tài khoản người dùng, không tạo máy chủ backend riêng.
  - Khả năng tạo media phụ thuộc hoàn toàn vào hạn mức (credit), quyền hạn tài khoản và tính năng của nền tảng Muse.ai.

---

## 3. Đối tượng sử dụng
- **Nhà sáng tạo nội dung AI (AI Creators / Storytellers):** Những người sáng tác phim ngắn, video hoạt hình, clip quảng cáo cần kiểm soát tính liên tục giữa các cảnh quay.
- **Biên kịch & Đạo diễn hình ảnh (Screenwriters / Visual Directors):** Người có sẵn kịch bản phân cảnh chuẩn và muốn chuyển đổi nhanh chóng thành danh sách cảnh trực quan.
- **Lập trình viên & Kỹ sư AI:** Những người muốn nghiên cứu mô hình tích hợp WebExtension Manifest V3 không backend, kiến trúc DOM Automation và xử lý video bằng WebAssembly trên trình duyệt.

---

## Liên kết liên quan
- [Kiến trúc tổng thể](kien-truc.md)
- [Cấu trúc thư mục](cau-truc-thu-muc.md)
- [Công nghệ sử dụng](cong-nghe.md)
- [Hướng dẫn cài đặt](../02-cai-dat/huong-dan-cai-dat.md)
