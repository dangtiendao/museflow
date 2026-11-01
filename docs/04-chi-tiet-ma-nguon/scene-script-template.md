# Phân tích Chi tiết Tệp: `templates/museflow-scene-script-template-vi.txt`

## 1. Thông tin chung
- **Đường dẫn file:** `templates/museflow-scene-script-template-vi.txt`
- **Đường dẫn mã nguồn gốc:** [../../templates/museflow-scene-script-template-vi.txt](../../templates/museflow-scene-script-template-vi.txt)
- **Chức năng chính:** Bản mẫu kịch bản phân cảnh chuẩn hóa bằng tiếng Việt, quy định chi tiết quy cách viết tiêu đề cảnh, khung đầu, khung cuối, diễn biến theo giây, prompt ảnh, prompt video, audio và các khóa ràng buộc dùng chung.

---

## 2. Vai trò trong Hệ thống
- **Thuộc tầng:** Tầng Dữ liệu Mẫu & Đặc tả Kịch bản (Template / Schema Specification Layer).
- **Được gọi bởi:**
  - Người dùng tải về từ nút "⇩ Download strict template" trong Modal `Script → Nodes` trên [app.html](../../app.html).
  - Sử dụng làm System Prompt / Hướng dẫn định dạng (Format Prompt) đưa vào các mô hình LLM (như Gemini, ChatGPT, Claude) để sinh kịch bản chuẩn.
  - Được bóc tách trực tiếp bởi hàm `parseSceneScript()` trong [app.js](../../app.js).

---

## 3. Cấu trúc Schema Kịch bản

### Khối 1: Các Khóa Ràng buộc Dùng chung (Shared Prompt Locks)
Các thông tin cần nhất quán xuyên suốt toàn bộ video được khai báo ở đầu kịch bản:
- `[CHAR_LOCK]`: Đặc tả ngoại hình, trang phục, độ tuổi, vóc dáng của nhân vật.
- `[STYLE_LOCK]`: Đặc tả phong cách nghệ thuật, ánh sáng, góc máy, chất lượng hình ảnh (ví dụ: Cinematic 4K, 35mm lens, volumetric lighting).
- `[SET_LOCK]`: Đặc tả không gian bối cảnh tổng thể của câu chuyện.
- `[VIDEO_SUFFIX]`: Các chỉ dẫn chuyển động máy quay chung (ví dụ: slow pan, natural motion, cinematic pacing).
- `NEGATIVE`: Các chi tiết tiêu cực cần loại bỏ chung cho toàn bộ dự án.

### Khối 2: Cấu trúc từng Phân cảnh (Scene Blocks)
Mỗi cảnh bắt buộc phải tuân theo cấu trúc cú pháp:
```text
CẢNH <Số_thứ_tự> (<Thời_gian_bắt_đầu> đến <Thời_gian_kết_thúc>): <Tiêu_đề_cảnh>
Khung đầu: <Mô tả bố cục và đối tượng ở giây đầu tiên>
Khung cuối: <Mô tả bố cục và đối tượng cần đạt đến ở giây cuối cùng>
Diễn biến: 1. 0-2s: <Hành động> 2. 2-5s: <Hành động tiếp theo>
Prompt ảnh khung đầu: <Prompt chi tiết sinh ảnh mở đầu cảnh>
Prompt video: <Prompt chi tiết sinh clip video>
Audio: <Chỉ dẫn âm thanh môi trường và hiệu ứng tiếng động, không có thoại>
```

---

## 4. Bảng Phụ thuộc (Dependencies)
- Không có phụ thuộc phần mềm.
- Tương thích trực tiếp với biểu thức chính quy của bộ phân tích cú pháp trong [script-parser.md](../03-module/script-parser.md).

---

## 5. Lưu ý Kỹ thuật và Đánh giá Rủi ro
- **Giữ nguyên thứ tự các trường:** Bộ phân giải `parseSceneScript` sử dụng nhãn của trường kế tiếp làm điểm dừng (stop-token) để cắt chuỗi. Do đó, người dùng không nên thay đổi thứ tự giữa `Khung đầu:`, `Khung cuối:`, `Diễn biến:`, `Prompt ảnh:`, `Prompt video:` để tránh làm sai lệch dữ liệu bóc tách.

---

## Liên kết liên quan
- [Module Script Parser](../03-module/script-parser.md)
- [Module Graph Engine](../03-module/graph-engine.md)
- [Chi tiết app.js](app-js.md)
