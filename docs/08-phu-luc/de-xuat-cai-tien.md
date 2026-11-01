# Đề xuất Cải tiến & Quản lý Nợ Kỹ thuật (Technical Debt)

## 1. Đánh giá Hiện trạng Kiến trúc
Dự án MuseFlow phiên bản 0.5.2 đã đạt được một kỳ tích kiến trúc xuất sắc: **Zero-Dependency, Zero-Build Visual Canvas with Local Client-Side Video Assembly**. Tiện ích vận hành ổn định, giao diện tối ưu và không tốn chi phí máy chủ backend.

Tuy nhiên, dưới góc nhìn của một Senior Software Architect, dự án vẫn còn một số nợ kỹ thuật (technical debt) cần được tái cấu trúc khi mở rộng quy mô.

---

## 2. Các Đề xuất Cải tiến Cốt lõi

### a. Kiến trúc & Tái cấu trúc Mã nguồn (Refactoring)
- **Vấn đề hiện tại:** Toàn bộ logic giao diện, đồ thị, lưu trữ và FFmpeg (~1.350 dòng) nằm trong một tệp IIFE `app.js` duy nhất (mô hình *God Object*).
- **Giải pháp đề xuất:** Sử dụng chuẩn **Native ES Modules** của trình duyệt mà không cần cài đặt Webpack/Vite:
  ```html
  <!-- Trong app.html -->
  <script type="module" src="src/main.js"></script>
  ```
  Phân tách cấu trúc mã nguồn thành các module chuyên biệt:
  - `src/core/state.js`: Quản lý store toàn cục, undo/redo stack.
  - `src/graph/topology.js`: Thuật toán `topoOrder`, `wouldCreateCycle`, `normalizeSavedGraph`.
  - `src/canvas/renderer.js`: Điều khiển pan/zoom, vẽ dây SVG, render nodes.
  - `src/timeline/timeline.js`: Quản lý dock timeline, dual-buffer preview.
  - `src/storage/media-db.js`: Quản lý IndexedDB và serialize/hydrate.
  - `src/bridge/muse-client.js`: Quản lý kết nối tab và gửi lệnh cho content script.

### b. Tối ưu Hiệu năng & Bộ nhớ (Performance & Memory)
- **Quản lý Vòng đời Blob trong IndexedDB:** Hiện tại, khi người dùng xóa node hoặc gỡ clip khỏi timeline, các Blob liên quan vẫn có thể tồn tại trong IndexedDB `assets` store. Cần bổ sung hàm thu gom rác định kỳ (`garbageCollectOrphanAssets()`) quét toàn bộ ID trong đồ thị và xóa các bản ghi không còn tham chiếu để tránh làm phình dung lượng ổ cứng người dùng.
- **Offscreen Canvas & Web Worker cho Image Resize:** Việc đổi kích thước ảnh trên main thread trong hàm `drawResized()` có thể gây khựng nhẹ UI nếu ảnh có độ phân giải lớn (4K). Nên chuyển thao tác vẽ canvas sang `OffscreenCanvas` chạy trong Web Worker.

### c. Nâng cao Tính Ổn định của Cầu nối DOM (Bridge Resilience)
- **Bộ chọn DOM Thích ứng Đa tầng (Adaptive Multi-level Selectors):** Thay vì chỉ dựa vào `data-testid`, xây dựng mảng fallback selector:
  ```javascript
  const composerSelectors = [
    'textarea[data-testid*="composer"]',
    'form textarea',
    'textarea[placeholder*="message" i]',
    'div[role="textbox"][contenteditable="true"]'
  ];
  ```
- **Xử lý Giới hạn Tần suất (Rate-Limiting & Backoff):** Bổ sung bộ đếm thời gian tự động giãn cách giữa các lần gửi lệnh tạo liên tiếp (ví dụ: nghỉ 3-5 giây giữa các scene) để tránh tài khoản bị Muse.ai đánh dấu nghi vấn spam.

### d. Chiến lược Kiểm thử Tự động (Automated Test Suite)
- **Unit Testing:** Thiết lập bộ test suite sử dụng `node:test` tích hợp sẵn của Node.js để kiểm thử tự động các hàm thuần túy:
  - Kiểm thử `wouldCreateCycle()` với các dạng đồ thị phức tạp (đồ thị kim cương, đồ thị rẽ nhánh nhiều tầng).
  - Kiểm thử `parseSceneScript()` với 10+ mẫu kịch bản tiếng Việt và tiếng Anh đa dạng.
- **E2E Testing:** Sử dụng **Puppeteer** để chạy kịch bản kiểm thử tải tiện ích vào Chromium headless và kiểm tra quy trình kết nối tự động.

---

## 3. Lộ trình Tính năng Mở rộng (Feature Roadmap)
1. **Audio Waveform Display:** Hiển thị dạng sóng âm thanh trực quan dưới từng clip trên thanh dock Timeline.
2. **Preset Templates Library:** Thư viện các mẫu workflow phổ biến dựng sẵn (Phim hoạt hình 3D, Phim tài liệu lịch sử, Video âm nhạc điện ảnh, Clip quảng cáo sản phẩm).
3. **Export to Premiere / DaVinci XML / FCPXML:** Xuất cấu trúc timeline dạng tệp XML để người dùng có thể mở tiếp dự án trong các phần mềm dựng phim chuyên nghiệp Adobe Premiere Pro hoặc DaVinci Resolve.

---

## Liên kết liên quan
- [Kiến trúc tổng thể](../01-tong-quan/kien-truc.md)
- [Quy ước lập trình](../07-huong-dan-phat-trien/coding-convention.md)
- [Hướng dẫn kiểm thử](../07-huong-dan-phat-trien/kiem-thu.md)
