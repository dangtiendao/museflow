# Câu hỏi Thường gặp (FAQ) & Hướng dẫn Khắc phục Sự cố

## 1. Vấn đề Cài đặt & Kết nối

### Q1: Tại sao trạng thái luôn báo "● Open muse.ai and sign in" hoặc "● Checking muse.ai..." màu vàng?
- **Nguyên nhân:**
  1. Bạn chưa mở trang web [https://muse.ai](https://muse.ai) hoặc chưa đăng nhập.
  2. Tab Muse.ai đang nằm ở một Cửa sổ Ẩn danh (Incognito) hoặc ở một Profile Chrome khác với tiện ích MuseFlow.
  3. Trang Muse.ai đang tải dở hoặc hộp thoại chat chưa được mở.
- **Cách khắc phục:**
  1. Mở tab mới trên cùng cửa sổ trình duyệt, truy cập [https://muse.ai](https://muse.ai), đăng nhập và vào trang chat.
  2. Bấm phím `F5` để tải lại trang Muse.ai.
  3. Mở lại tab MuseFlow, vào menu **Settings** và bấm **Check Muse session**.

### Q2: Tại sao khi cài đặt Chrome báo lỗi "Manifest is not valid" hoặc không tìm thấy `manifest.json`?
- **Nguyên nhân:** Khi chọn **Load unpacked (Tải tiện ích đã giải nén)**, bạn đã chọn nhầm thư mục cha bọc ngoài.
- **Cách khắc phục:** Đảm bảo thư mục bạn chọn phải chứa trực tiếp tệp `manifest.json` ngay bên trong, không nằm trong thư mục con lồng nhau.

---

## 2. Vấn đề Sinh Hình ảnh & Video

### Q3: Tại sao node Generate báo lỗi "Port types are not compatible"?
- **Nguyên nhân:** Bạn đang kéo cổng xuất nối vào cổng nhập không cùng kiểu dữ liệu (ví dụ: kéo cổng `image` vào cổng `prompt` nhận `text`, hoặc cổng `negative` vào cổng `image`).
- **Cách khắc phục:**
  - Cổng `prompt` chỉ nhận dây màu tím từ node `Prompt`, `Text Append`, hoặc `Text Merge`.
  - Cổng `reference` nhận dây màu xanh dương từ node `Image Input`, `References`, hoặc cổng `image`/`endFrame`.

### Q4: Tiện ích báo "Workflow contains a cycle. Remove the loop first"?
- **Nguyên nhân:** Bạn đã vô tình nối một đường dây tạo thành vòng lặp kín (ví dụ: Node A nối sang Node B, Node B lại nối ngược lại Node A).
- **Cách khắc phục:** Luồng dữ liệu phải luôn đi theo một chiều từ trái sang phải. Nhấp chuột phải vào đường nối bị lặp và chọn **Delete connection** để xóa bỏ vòng lặp.

### Q5: Muse AI từ chối tạo cảnh thì hệ thống xử lý thế nào?
- **Nguyên nhân:** Prompt có thể chứa từ khóa nhạy cảm chạm vào bộ lọc an toàn nội dung của Muse.
- **Cách hoạt động:** MuseFlow sẽ tự động phát hiện mã lỗi `SCENE_REFUSED` và thử lại **đúng một lần duy nhất** bằng cách ghép thêm chỉ dẫn an toàn `SAFE EQUIVALENT RETRY` yêu cầu AI thay thế chi tiết nhạy cảm bằng phiên bản an toàn tương đương mà vẫn giữ nguyên cốt truyện.

---

## 3. Vấn đề Timeline & Xuất Video

### Q6: Tại sao khi bấm xuất MP4 trình duyệt báo lỗi hoặc không tải được file về?
- **Nguyên nhân:**
  1. Trình duyệt không đủ RAM trống để worker WebAssembly khởi tạo.
  2. Một trong các clip trên timeline bị rỗng (0 bytes) do tải về dở dang.
- **Cách khắc phục:**
  - Đóng bớt các tab không cần thiết trên trình duyệt để giải phóng RAM.
  - Thử chọn xuất sang định dạng **WebM** để dùng động cơ ghi màn hình nhẹ hơn của trình duyệt.
  - Tải lại extension tại `chrome://extensions` và bấm xuất lại.

### Q7: Video xuất ra có giữ được âm thanh không?
- **Có:** MuseFlow hỗ trợ ghép luồng âm thanh AAC stereo 48kHz. Nếu trong timeline có một cảnh câm không có tiếng, hệ thống sẽ tự động bù đắp dải âm thanh khoảng lặng để video xuất ra không bị mất tiếng hay lỗi đồng bộ âm thanh - hình ảnh.

---

## Liên kết liên quan
- [Hướng dẫn cài đặt](../02-cai-dat/huong-dan-cai-dat.md)
- [Thuật ngữ kỹ thuật](thuat-ngu.md)
- [Đề xuất cải tiến](de-xuat-cai-tien.md)
