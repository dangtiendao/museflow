# Phân tích Chi tiết Tệp: `background.js`

## 1. Thông tin chung
- **Đường dẫn file:** `background.js`
- **Đường dẫn mã nguồn gốc:** [../../background.js](../../background.js)
- **Chức năng chính:** Service Worker xử lý sự kiện kích hoạt tiện ích từ thanh công cụ của trình duyệt, quản lý việc mở mới hoặc kích hoạt tab giao diện canvas `app.html`.

---

## 2. Vai trò trong Hệ thống
- **Thuộc tầng:** Tầng Khởi tạo / Điểm vào Ứng dụng (Entry Point & Lifecycle Layer).
- **Được gọi bởi:** Trình duyệt Chrome thông qua sự kiện `chrome.action.onClicked`.
- **Gọi đến:** Các API của Chrome (`chrome.runtime.getURL`, `chrome.tabs.query`, `chrome.tabs.update`, `chrome.windows.update`, `chrome.tabs.create`).

---

## 3. Luồng Xử lý Dữ liệu
```mermaid
flowchart TD
    Click[Người dùng nhấp Action Icon] --> GetUrl[Lấy URL tuyệt đối: chrome.runtime.getURL('app.html')]
    GetUrl --> QueryTab[chrome.tabs.query({ url })]
    QueryTab --> CheckExists{Tab đã tồn tại?}
    CheckExists -- Có --> ActivateTab[Kích hoạt tab: chrome.tabs.update(tabId, { active: true })]
    ActivateTab --> FocusWin[Focus cửa sổ: chrome.windows.update(winId, { focused: true })]
    CheckExists -- Không --> CreateTab[Mở tab mới: chrome.tabs.create({ url })]
```

- **Input:** Sự kiện `onClicked` từ giao diện Chrome.
- **Xử lý:** Truy vấn xem đã có tab nào đang mở trang `app.html` chưa. Nếu có, chuyển tiêu điểm sang tab đó; nếu chưa có, tạo tab mới.
- **Output:** Màn hình làm việc MuseFlow xuất hiện trước mắt người dùng.

---

## 4. Bảng Phụ thuộc (Dependencies)
- **Thư viện bên ngoài:** Không có (sử dụng Chrome Extension APIs).
- **Module nội bộ tham chiếu:** [app.html](../../app.html).

---

## 5. Lưu ý Kỹ thuật và Đánh giá Rủi ro
- **Tiêu thụ tài nguyên tối ưu:** Tuân thủ chuẩn Service Worker không trạng thái (stateless) của Manifest V3. Sau khi xử lý xong sự kiện click, worker tự động ngừng chạy (idle) và không chiếm dụng bộ nhớ RAM.
- **Xử lý cửa sổ đa màn hình:** Việc bổ sung `chrome.windows.update(tabs[0].windowId, { focused: true })` giải quyết triệt để vấn đề tab canvas nằm ở một cửa sổ trình duyệt bị thu nhỏ hoặc ở màn hình phụ khác.

---

## Liên kết liên quan
- [Chi tiết manifest.json](manifest-json.md)
- [Chi tiết app.html](app-html.md)
- [Luồng Khởi chạy & Kết nối](../05-luong-xu-ly/khoi-chay-va-ket-noi-muse.md)
