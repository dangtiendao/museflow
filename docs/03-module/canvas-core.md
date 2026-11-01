# Module Canvas Core (Hệ thống Khung nhìn & Tương tác Trực quan)

## 1. Mục đích và Phạm vi
Module **Canvas Core** chịu trách nhiệm quản lý không gian làm việc vô hạn (2D Infinite Canvas), cơ chế tọa độ, hệ thống thu phóng (zoom), kéo trượt (pan), lựa chọn đa đối tượng (marquee selection), quản lý thẻ ghi chú tự do (Text Notes) và phân vùng nhóm trực quan (Group Regions).

---

## 2. Quản lý Tọa độ và Biến đổi ma trận (Transform & Coordinates)

### Cơ chế tính toán tọa độ
Canvas của MuseFlow sử dụng công thức chuyển đổi giữa **Tọa độ Màn hình (Screen/Client Coordinates)** và **Tọa độ Không gian Canvas (Canvas World Coordinates)**:

$$X_{canvas} = \frac{X_{client} - X_{viewport\_left} - panX}{zoom}$$
$$Y_{canvas} = \frac{Y_{client} - Y_{viewport\_top} - panY}{zoom}$$

### Các hàm tính toán chính trong `app.js`
- `screenToCanvas(x, y)`: Chuyển đổi tọa độ con trỏ chuột sang tọa độ tương đối trên canvas.
- `applyCanvasTransform()`: Cập nhật thuộc tính CSS `transform = translate(${panX}px, ${panY}px) scale(${zoom})` đồng thời cho cả `#canvas` và lớp SVG `#edges`.
- `zoomAt(clientX, clientY, factor)`: Thu phóng mượt mà xung quanh tâm con trỏ chuột, tính toán lại `panX` và `panY` để điểm dưới con trỏ chuột không bị trôi vị trí. Giới hạn tỷ lệ zoom từ `0.25` (25%) đến `2.5` (250%).
- `fitCanvas()`: Tính toán bounding box của toàn bộ các node hiện có trên canvas, tự động điều chỉnh pan và zoom để căn vừa khít màn hình người dùng với lề an toàn.

---

## 3. Hệ thống Tương tác Thao tác Chuột & Bàn phím

### Kéo trượt màn hình (Pan Gesture)
Hệ thống hỗ trợ 3 cách kích hoạt trượt canvas:
1. Nhấn giữ phím **Space** và kéo chuột trái.
2. Nhấn giữ **con lăn chuột giữa (Button 1)** và kéo chuột.
3. Bật công cụ **Hand Tool (phím H hoặc icon bàn tay ✋)** trên thanh công cụ góc trên bên phải.

### Khung chữ nhật chọn nhiều (Marquee Selection)
- Khi người dùng nhấn chuột trái trên vùng canvas trống và kéo rê:
  - Một khung viền nét đứt `.selection-marquee` được sinh ra.
  - Hàm `moveSelectionMarquee()` liên tục tính toán va chạm hình học (AABB Bounding Box collision) với các thẻ `.node` và đường cong SVG `.edge[data-edge-id]`.
  - Hỗ trợ giữ phím `Shift` hoặc `Ctrl` để thêm/bớt đối tượng vào tập chọn hiện tại (`state.selectedNodeIds`).

### Phân vùng nhóm (Group Regions)
- Nhấn phím **G** hoặc icon **▱** để bật chế độ `groupDrawMode`.
- Kéo khung bao quanh một nhóm các node.
- Khi nhả chuột, modal `openGroupNameModal()` sẽ mở ra để người dùng đặt tên cho nhóm (ví dụ: "Cảnh 1 - Ngoại cảnh hoàng hôn").
- Vùng nhóm được lưu trữ trong `state.groups` và tự động hiển thị khung bo viền màu tím nhạt làm nổi bật các khối logic.

### Thẻ Ghi chú Tự do (Text Notes)
- Nhấn phím **T** hoặc chọn menu ngữ cảnh chuột phải để thêm thẻ ghi chú (`addTextNote()`).
- Thẻ ghi chú là một thẻ `<article class="canvas-note">` cho phép gõ nội dung đa dòng, tự động co giãn và di chuyển tự do. Ghi chú được lưu trữ trong `state.notes`.

---

## 4. Hệ thống Hoàn tác (Undo/Redo Stack)
- Quản lý qua mảng `undoStack` với độ sâu tối đa `maxUndoSteps = 40`.
- Hàm `createUndoSnapshot(label, { preserveRuntime })` thực hiện sao chép sâu toàn bộ cấu trúc đồ thị trước các thao tác có khả năng thay đổi cấu trúc (thêm/xóa node, di chuyển, nối dây, đổi tên).
- Phím tắt `Ctrl+Z` (hoặc `Cmd+Z` trên macOS) kích hoạt `undoLastChange()`. Nếu người dùng đang gõ văn bản trong textarea, sự kiện `Ctrl+Z` sẽ được nhường cho cơ chế undo tự nhiên của trình duyệt để tránh mất ký tự vừa gõ.

---

## Liên kết liên quan
- [Kiến trúc tổng thể](../01-tong-quan/kien-truc.md)
- [Module Graph Engine](graph-engine.md)
- [Chi tiết mã nguồn app.js](../04-chi-tiet-ma-nguon/app-js.md)
