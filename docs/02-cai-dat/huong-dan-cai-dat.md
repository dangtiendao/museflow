# Hướng dẫn Cài đặt Từng bước

## 1. Phương án 1: Cài đặt từ tệp nén ZIP phát hành (Khuyến nghị cho Người dùng)

### Bước 1: Tải gói tiện ích
- Tải tệp nén mới nhất: [MuseFlow-extension.zip](https://github.com/bynne2602/museflow/raw/refs/heads/main/downloads/MuseFlow-extension.zip).
- Hoặc tải toàn bộ repository dạng ZIP: [Tải Repository ZIP](https://github.com/bynne2602/museflow/archive/refs/heads/main.zip).

### Bước 2: Giải nén tệp
- Giải nén tệp ZIP vào một thư mục cố định trên máy tính (ví dụ: `C:\Tools\museflow` hoặc `D:\Extensions\museflow`).
- **Lưu ý quan trọng:** Không di chuyển hoặc xóa thư mục này sau khi cài đặt, vì Chrome sẽ đọc trực tiếp mã nguồn từ đây mỗi lần khởi động.

### Bước 3: Nạp tiện ích vào trình duyệt Chrome
1. Mở trình duyệt Google Chrome hoặc trình duyệt Chromium.
2. Nhập vào thanh địa chỉ: `chrome://extensions` và nhấn **Enter**.
3. Tại góc trên bên phải, bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)**.
4. Nhấp vào nút **Tải tiện ích đã giải nén (Load unpacked)** ở góc trên bên trái.
5. Duyệt và chọn thư mục chứa trực tiếp tệp `manifest.json`.

---

## 2. Phương án 2: Cài đặt từ mã nguồn Git (Dành cho Lập trình viên)

```bash
# 1. Clone repository về máy tính
git clone https://github.com/bynne2602/museflow.git

# 2. Di chuyển vào thư mục dự án
cd museflow

# 3. Mở trang quản lý extensions trên Chrome
# Truy cập chrome://extensions và kích hoạt "Developer mode"

# 4. Nhấp "Load unpacked" và trỏ tới thư mục museflow vừa clone
```

> [!NOTE]
> Dự án không có bước `npm install` hay `npm run build`. Sau khi clone xong là tiện ích đã sẵn sàng nạp ngay lập tức.

---

## 3. Khởi tạo phiên làm việc với Muse.ai
Sau khi cài đặt xong tiện ích, thực hiện lần lượt các bước sau:

1. Mở một tab mới trên trình duyệt, truy cập [https://muse.ai](https://muse.ai).
2. Đăng nhập tài khoản của bạn và điều hướng vào trang chat tạo nội dung.
3. Nhấp vào biểu tượng của **26Flow** trên thanh công cụ của trình duyệt Chrome để mở giao diện Canvas (`app.html`).
4. Quan sát thanh trạng thái dưới cùng:
   - Nếu hiển thị: `● Muse session ready` màu xanh lá $\rightarrow$ Đã kết nối thành công.
   - Nếu hiển thị: `● Checking muse.ai...` hoặc `● Open muse.ai and sign in` màu vàng $\rightarrow$ Hãy kiểm tra tab Muse.ai, tải lại trang chat và nhấp nút **Check Muse session** trong menu **Settings**.

---

## 4. Cách hiển thị song song hai cửa sổ (Split-screen)
Để quan sát trực tiếp phản hồi của AI trên Muse.ai đồng thời với tiến trình chạy trên Canvas MuseFlow:
1. Kéo tab MuseFlow ra khỏi thanh tab để tách thành một cửa sổ riêng biệt.
2. Trên Windows:
   - Chọn cửa sổ MuseFlow và nhấn tổ hợp phím: `Windows + Phím Mũi tên Trái`.
   - Chọn cửa sổ Muse.ai và nhấn tổ hợp phím: `Windows + Phím Mũi tên Phải`.
3. Giữ cả hai cửa sổ cùng mở trong suốt quá trình chạy workflow.

---

## Liên kết liên quan
- [Yêu cầu hệ thống](yeu-cau-he-thong.md)
- [Cấu hình](cau-hinh.md)
- [Cách chạy dự án](chay-du-an.md)
- [Giải đáp thắc mắc (FAQ)](../08-phu-luc/faq.md)
