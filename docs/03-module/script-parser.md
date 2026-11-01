# Module Script Parser (Bộ Phân tích Kịch bản Phân cảnh)

## 1. Mục đích và Phạm vi
Module **Script Parser** giải quyết nhu cầu chuyển đổi nhanh kịch bản phân cảnh dạng văn bản thuần túy (do con người viết tay hoặc do các mô hình ngôn ngữ lớn như Gemini, Claude, GPT sinh ra) thành hệ thống các node đồ thị hoàn chỉnh đã nối dây sẵn, đồng thời tự động đưa các clip video vào đúng thứ tự trên thanh dock Timeline.

---

## 2. Định dạng Kịch bản Chuẩn (Scene Script Syntax)
Bộ bóc tách hỗ trợ cả tiếng Việt và tiếng Anh, nhận diện theo mẫu cấu trúc:

```text
A) THÔNG TIN CHUNG (PREAMBLE):
[CHAR_LOCK]: Mô tả ngoại hình nhân vật chính giữ xuyên suốt...
[STYLE_LOCK]: Phong cách hình ảnh (cinematic 4k, neon cyberpunk, 35mm film)...
[SET_LOCK]: Bối cảnh tổng thể...
[VIDEO_SUFFIX]: Hướng dẫn chuyển động camera chung...
NEGATIVE: blurry, distorted, extra fingers, text, watermark

B) CÁC PHÂN CẢNH (SCENES):

CẢNH 1 (0:00 đến 0:05): Cuộc gặp gỡ dưới mưa
Khung đầu: Cô gái đứng bên trạm xe bus, áo khoác ướt sũng.
Khung cuối: Chàng trai bước đến cầm ô che nghiêng về phía cô gái.
Diễn biến: 1. 0-2s: Mưa rơi nặng hạt, cô gái co ro vì lạnh. 2. 2-5s: Chàng trai xuất hiện, nhẹ nhàng mở ô.
Prompt ảnh: [CHAR_LOCK], cô gái đứng dưới mưa nép vào trạm xe bus, ánh đèn neon phản chiếu vũng nước, [STYLE_LOCK].
Prompt video: [CHAR_LOCK], camera lia chậm, chàng trai tiến lại gần và che ô cho cô gái, [SET_LOCK], chuyển động tự nhiên.
Audio: Tiếng mưa rơi rả rích trên mái tôn, tiếng bước chân lội nước. Không có lời thoại.
```

---

## 3. Thuật toán Bóc tách Cú pháp (`parseSceneScript`)

### Bước 1: Trích xuất phần Mở đầu (Preamble & Locks)
- Hàm `extractBracketLocks(preamble)` quét regex `^\s*\[([A-Z][A-Z0-9_]*)\][^\r\n]*:\s*$` để bóc tách các khối khóa chung như `[CHAR_LOCK]`, `[STYLE_LOCK]`, `[SET_LOCK]`, `[NEGATIVE]`.
- Lưu trữ các khóa vào một từ điển (dictionary/map) để chuẩn bị bung khóa ở các phân cảnh phía dưới.

### Bước 2: Bóc tách từng Phân cảnh
- Regex nhận diện tiêu đề cảnh:
  ```javascript
  const heading = /^\s*(?:#{1,6}\s*)?(?:CẢNH|SCENE)\s+(\d+)\s*\(([^)]*)\)\s*:\s*(.*?)\s*$/gim;
  ```
  Nhận diện được cả `CẢNH 1 (0:00–0:05): Tên cảnh` lẫn `Scene 1 (0:00 to 0:05): Title`.
- Tính toán thời lượng cảnh theo giây từ khoảng thời gian trong ngoặc đơn (ví dụ `0:00 đến 0:05` $\rightarrow$ 5 giây).
- Sử dụng hàm `scriptField(body, label, nextLabels)` để trích xuất từng trường con:
  - `Khung đầu`: Trích xuất thành phần bố cục khung mở đầu.
  - `Khung cuối`: Trích xuất mục tiêu khung kết thúc của cảnh.
  - `Diễn biến`: Trích xuất các mốc nhịp độ hành động (timed action beats).
  - `Prompt ảnh`: Prompt sinh ảnh khung đầu.
  - `Prompt video`: Prompt sinh video cảnh.
  - `Audio`: Chỉ dẫn âm thanh không lời thoại.
  - `Negative prompt`: Prompt âm tính cho cảnh đó (nếu có).

### Bước 3: Bung Khóa và Bổ sung Ngữ cảnh Tự động
- Hàm `expandScriptLocks(text, locks)` thay thế các token `[CHAR_LOCK]`, `[STYLE_LOCK]` trong prompt bằng nội dung mô tả chi tiết tương ứng.
- Hàm `withPromptContext()` tự động chèn mô tả nhân vật và phong cách vào prompt ảnh nếu chưa có.
- Ghép diễn biến hành động, khung cuối và chỉ dẫn audio vào prompt video:
  ```text
  Prompt video gốc
  
  Timed action beats:
  1. 0-2s: ... 2. 2-5s: ...
  
  Final frame to reach: Khung cuối...
  
  Audio direction: Hướng dẫn âm thanh... No speech.
  ```

---

## 4. Tự động Dựng Node trên Canvas (`buildSceneNodesFromScript`)
Sau khi phân tích xong kịch bản, hệ thống thực hiện:
1. Tính toán tọa độ hiển thị dạng lưới cột (Grid layout: 4 cảnh một hàng, giãn cách 650px).
2. Với mỗi cảnh:
   - Tạo node `prompt` và node `generateImage` (nếu có prompt ảnh). Nối cổng `text` $\rightarrow$ `prompt`.
   - Tạo node `prompt` và node `generateVideo` (nếu có prompt video). Nối cổng `text` $\rightarrow$ `prompt`.
   - Nếu có cả ảnh và video trong cảnh, tự động nối cổng `image` của Generate Image sang cổng `reference` của Generate Video để làm ảnh tham chiếu mở đầu.
   - Nếu cảnh có negative prompt, tạo node `negativePrompt` và nối vào cổng `negative` của cả hai node tạo media.
3. Tạo hoặc định vị node `references` gom ảnh tham chiếu chung đặt ở góc trái đồ thị.
4. Đưa toàn bộ các node `generateVideo` vừa tạo vào danh sách phát của dock **Timeline**, thiết lập đúng thời lượng từng cảnh và tự động bật cờ `continuity: true` cho các cảnh từ thứ hai trở đi.

---

## Liên kết liên quan
- [Biểu mẫu kịch bản mẫu](../../templates/museflow-scene-script-template-vi.txt)
- [Module Graph Engine](graph-engine.md)
- [Module Timeline Engine](timeline-engine.md)
