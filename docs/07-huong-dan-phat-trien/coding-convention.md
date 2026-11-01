# Quy ước Lập trình (Coding Conventions)

## 1. Nguyên tắc cốt lõi
1. **Zero-Dependency & Zero-Build First:** Không thêm các thư viện npm bên ngoài trừ khi thực sự cần thiết và được đóng gói nội bộ (như trường hợp FFmpeg WebAssembly). Mã nguồn viết bằng JavaScript chuẩn hiện đại có thể thực thi trực tiếp trên Chromium V8 Engine.
2. **Không phá vỡ tính tương thích:** Mọi cập nhật phải tương thích ngược với cấu trúc đồ thị JSON đã lưu của người dùng.
3. **Comment và Tài liệu hóa 100% bằng tiếng Việt:** Giữ chuẩn JSDoc cho tất cả các hàm và chú thích kỹ thuật tiếng Việt mạch lạc cho các khối logic phức tạp.

---

## 2. Quy ước đặt tên (Naming Conventions)

| Đối tượng | Quy tắc | Ví dụ |
| :--- | :--- | :--- |
| **Biến & Thuộc tính** | `camelCase` | `selectedNodeId`, `activeGenerations`, `timelinePreviewPosition` |
| **Hàm & Phương thức** | `camelCase`, bắt đầu bằng động từ | `addNode()`, `wouldCreateCycle()`, `dehydrateMediaUrl()` |
| **Hằng số toàn cục** | `camelCase` hoặc `UPPER_SNAKE_CASE` | `maxUndoSteps`, `idbMediaPrefix`, `nodeDefs` |
| **Phần tử DOM (ID/Class)** | `camelCase` cho ID, `kebab-case` cho Class | ID: `runBtn`, `timelineDock`<br/>Class: `timeline-clip`, `canvas-note` |
| **Loại Node (NodeType)** | `camelCase` | `generateImage`, `generateVideo`, `negativePrompt`, `textConcat` |
| **Tên tệp mã nguồn** | `kebab-case` hoặc tên quy ước web | `muse-bridge.js`, `background.js`, `app.html` |
| **Tệp tài liệu docs** | `kebab-case`, không dấu | `kien-truc.md`, `huong-dan-cai-dat.md` |

---

## 3. Tiêu chuẩn viết JSDoc cho Hàm và Lớp
Mọi hàm trong dự án bắt buộc phải có khối JSDoc tiếng Việt đặt ngay phía trên hàm, bao gồm tối thiểu:
- Mô tả chức năng rõ ràng.
- Danh sách tham số `@param` (kèm kiểu dữ liệu, tên biến, ý nghĩa, giá trị mặc định).
- Giá trị trả về `@returns` (kèm kiểu dữ liệu và ý nghĩa).
- Ngoại lệ có thể ném ra `@throws` (nếu có).
- Ghi chú tác dụng phụ `@note` (side-effects, hiệu năng, điều kiện tiên quyết).

### Mẫu JSDoc chuẩn:
```javascript
/**
 * So sánh hai chuỗi phiên bản dạng ngữ nghĩa (semantic versioning).
 *
 * @param {string|number} a - Chuỗi phiên bản thứ nhất (ví dụ: '0.5.2').
 * @param {string|number} b - Chuỗi phiên bản thứ hai (ví dụ: '0.5.1').
 * @returns {number} Số âm nếu a < b, 0 nếu a === b, số dương nếu a > b.
 */
function compareVersions(a, b) {
  // Logic xử lý...
}
```

---

## 4. Quy ước Chú thích Inline (Inline Comments)
- **Không chú thích điều hiển nhiên:** Tránh viết các comment vô nghĩa như `i++; // tăng i lên 1`.
- **Giải thích "Lý do tại sao" (Why), không chỉ giải thích "Làm gì" (What):**
  ```javascript
  // Dùng native setter của HTMLTextAreaElement để vượt qua các can thiệp trạng thái ảo của React
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
  setter.call(composer, String(prompt));
  ```
- **Các thuật toán phức tạp bắt buộc phải có comment từng bước:**
  - Thuật toán sắp xếp Topo Kahn's Algorithm.
  - Thuật toán duyệt BFS phát hiện chu trình đồ thị.
  - Bộ lọc ghép âm thanh và video FFmpeg `filter_complex`.

---

## 5. Định dạng mã nguồn (Formatting & Code Style)
- **Thụt lề (Indentation):** Sử dụng 2 dấu khoảng trắng (spaces). Không dùng Tab.
- **Dấu chấm phẩy (Semicolons):** Bắt buộc sử dụng dấu chấm phẩy `;` kết thúc câu lệnh để tránh lỗi ASI (Automatic Semicolon Insertion).
- **Chuỗi ký tự (Strings):** Ưu tiên dấu nháy đơn `'...'` cho chuỗi tĩnh và template literal `` `...` `` cho chuỗi nội suy.
- **Xử lý bất đồng bộ:** Ưu tiên `async/await` thay cho việc lồng `then/catch` sâu; luôn bọc `try...catch` ở các hàm tương tác ngoại vi (Chrome Storage, IndexedDB, fetch mạng).

---

## Liên kết liên quan
- [Quy trình đóng góp](quy-trinh-dong-gop.md)
- [Hướng dẫn kiểm thử](kiem-thu.md)
- [Chi tiết mã nguồn app.js](../04-chi-tiet-ma-nguon/app-js.md)
