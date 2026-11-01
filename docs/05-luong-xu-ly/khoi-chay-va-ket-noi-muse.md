# Luồng Khởi chạy và Kết nối Phiên Muse.ai

## 1. Mục đích
Mô tả toàn bộ trình tự khởi chạy của tiện ích MuseFlow từ lúc người dùng bấm biểu tượng tiện ích trên thanh công cụ của Chrome, nạp trạng thái workflow đã lưu, cho đến khi tự động bắt tay (handshake) với tab Muse.ai đang mở để xác nhận phiên làm việc sẵn sàng.

---

## 2. Sơ đồ Tuần tự (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Icon as Chrome Action Icon
    participant BG as background.js (Service Worker)
    participant Tab as Tab MuseFlow (app.html)
    participant App as app.js (Canvas Controller)
    participant Storage as Chrome Storage & IndexedDB
    participant ChromeTabs as chrome.tabs API
    participant Bridge as Content Script (muse-bridge.js)
    participant MuseDOM as Muse.ai Page DOM

    User->>Icon: Nhấp biểu tượng 26Flow
    Icon->>BG: Sự kiện chrome.action.onClicked
    BG->>ChromeTabs: query({ url: 'chrome-extension://.../app.html' })
    alt Tab đã tồn tại
        BG->>ChromeTabs: tabs.update(active: true) & windows.update(focused: true)
    else Tab chưa mở
        BG->>ChromeTabs: tabs.create({ url: 'app.html' })
    end

    Tab->>App: Nạp và chạy app.js (IIFE)
    App->>Storage: loadState() -> Đọc khóa 'museflow'
    Storage-->>App: Trả về { nodes, edges, groups, notes, settings }
    App->>Storage: hydrateWorkflowMedia() -> Đọc Blob từ IndexedDB 'museflow-media'
    App->>App: normalizeSavedGraph() -> Chuẩn hóa đồ thị
    App->>App: render() & applyCanvasTransform() -> Vẽ Canvas & SVG Edges
    
    App->>App: detectMuse()
    App->>ChromeTabs: query({ url: 'https://muse.ai/*' })
    alt Không tìm thấy tab Muse.ai nào
        App->>Tab: Statusbar: "● Open muse.ai and sign in" (warn)
    else Tìm thấy tab Muse.ai
        App->>App: testMuseSession(activeTab.id)
        App->>ChromeTabs: sendMessage(tabId, { type: 'MUSEFLOW_CHECK_SESSION' })
        alt Tab chưa nạp bridge script
            App->>ChromeTabs: chrome.scripting.executeScript({ files: ['muse-bridge.js'] })
            App->>ChromeTabs: sendMessage(tabId, { type: 'MUSEFLOW_CHECK_SESSION' })
        end
        ChromeTabs->>Bridge: Nhận MUSEFLOW_CHECK_SESSION
        Bridge->>MuseDOM: waitHydrated() & findComposer()
        MuseDOM-->>Bridge: Composer textarea hiển thị, không bị disabled
        Bridge-->>App: { ok: true, signedIn: true, composer: true, title: 'Muse Chat' }
        App->>Tab: Statusbar: "● Muse session ready" (ok)
    end
    App->>App: checkForAppUpdate() -> Kiểm tra manifest.json mới trên GitHub
```

---

## 3. Các bước xử lý chi tiết
1. **Kiểm tra Tab trùng lặp:** `background.js` truy vấn URL tiện ích để tránh việc người dùng nhấp nhiều lần mở ra nhiều tab canvas trùng lặp gây lãng phí tài nguyên RAM và xung đột bộ nhớ IndexedDB.
2. **Khôi phục trạng thái:** `loadState()` đọc dữ liệu đồ thị từ Chrome Storage, đồng thời gọi `hydrateWorkflowMedia()` để chuyển đổi các khóa lưu trữ `museflow-idb:...` thành `blob:` URLs hiển thị trên canvas.
3. **Tự động bắt tay (Auto-handshake):** `detectMuse()` tự động rà soát danh sách các tab đang mở tên miền `https://muse.ai/*`. Nếu tab đó vừa được mở hoặc người dùng vừa tải lại trang Muse, `chrome.tabs.onUpdated` và `chrome.tabs.onCreated` sẽ tự động kích hoạt kiểm tra lại phiên làm việc mà không cần người dùng bấm kiểm tra thủ công.
4. **Kiểm tra tính sẵn sàng:** `muse-bridge.js` kiểm tra xem phần tử `<textarea>` soạn thảo tin nhắn có hiển thị không, trang web đã hoàn tất hydration chưa, và có đang hiển thị form đăng nhập mật khẩu hay không.

---

## Liên kết liên quan
- [Kiến trúc tổng thể](../01-tong-quan/kien-truc.md)
- [Module Muse Bridge](../03-module/muse-bridge.md)
- [Đặc tả Message Protocol](../06-api/message-protocol.md)
