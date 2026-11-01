/**
 * @file background.js - Service Worker xử lý điểm vào (Entry Point) của tiện ích mở rộng MuseFlow (26Flow).
 * @description Quản lý sự kiện nhấp chuột vào biểu tượng tiện ích trên thanh công cụ của trình duyệt Chrome.
 *              Điều hướng người dùng đến giao diện canvas chính (app.html) hoặc kích hoạt lại tab/cửa sổ đã mở trước đó.
 * @module BackgroundServiceWorker
 * @version 0.5.2
 */

/**
 * Lắng nghe sự kiện click vào action icon của extension trên thanh công cụ trình duyệt.
 * Nếu tab chứa giao diện app.html đã tồn tại trong session hiện tại thì kích hoạt và focus vào tab/cửa sổ đó;
 * ngược lại sẽ khởi tạo một tab mới tải app.html.
 *
 * @listens chrome.action.onClicked
 * @returns {Promise<void>}
 */
chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('app.html');
  // Truy vấn danh sách các tab đang mở đúng địa chỉ URL của extension
  const tabs = await chrome.tabs.query({ url });
  if (tabs.length && tabs[0].id) {
    // Nếu tab đã tồn tại, kích hoạt tab và đưa cửa sổ trình duyệt chứa tab lên phía trước (focus)
    await chrome.tabs.update(tabs[0].id, { active: true });
    if (tabs[0].windowId) await chrome.windows.update(tabs[0].windowId, { focused: true });
    return;
  }
  // Mở tab mới với URL của ứng dụng
  await chrome.tabs.create({ url });
});
