# Cấu hình Tiện ích và Quyền hạn

## 1. Bản kê quyền hạn Manifest (Permissions Matrix)
Trong tệp `manifest.json`, MuseFlow khai báo các quyền hạn chuẩn tối thiểu để đáp ứng các tính năng:

| Quyền (Permission) | Loại quyền | Mục đích sử dụng | Mức độ rủi ro |
| :--- | :--- | :--- | :--- |
| `storage` | API Permission | Cho phép tiện ích lưu trữ trạng thái đồ thị (nodes, edges, settings) vào `chrome.storage.local`. | Thấp (chỉ lưu cục bộ trên máy) |
| `tabs` | API Permission | Cho phép tiện ích phát hiện các tab đang mở `https://muse.ai/*`, kiểm tra URL và gửi thông điệp điều khiển. | Trung bình |
| `scripting` | API Permission | Cho phép tiện ích tự động chèn (inject) script cầu nối [muse-bridge.js](file:///e:/Project/museflow/muse-bridge.js) vào tab Muse.ai nếu tab đó chưa nạp sẵn bridge. | Trung bình |
| `https://muse.ai/*`<br/>`https://*.muse.ai/*` | Host Permission | Cho phép content script chạy và tương tác với DOM của tên miền Muse.ai. | Cần thiết cho tính năng lõi |
| `https://raw.githubusercontent.com/...` | Host Permission | Cho phép hàm `checkForAppUpdate()` truy vấn tệp `manifest.json` trên nhánh main của repository GitHub để kiểm tra phiên bản mới. | Thấp (chỉ đọc tệp công khai) |

---

## 2. Chính sách Bảo mật Nội dung (Content Security Policy - CSP)
```json
"content_security_policy": {
  "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
}
```

- `'self'`: Chỉ cho phép thực thi các tệp JavaScript và tài nguyên nằm ngay trong gói mở rộng của extension. Nghiêm cấm nạp script từ bên ngoài (CDN, external domain) để phòng chống tấn công XSS.
- `'wasm-unsafe-eval'`: Cho phép biên dịch và thực thi mã nhị phân WebAssembly trong trang mở rộng. Đây là yêu cầu kỹ thuật bắt buộc để động cơ **FFmpeg WebAssembly Core** (`ffmpeg-core.wasm`) có thể chạy và mã hóa video.

---

## 3. Cấu hình Content Scripts
```json
"content_scripts": [{
  "matches": ["https://muse.ai/*", "https://*.muse.ai/*"],
  "js": ["muse-bridge.js"],
  "run_at": "document_idle"
}]
```
- `run_at: "document_idle"`: Đảm bảo trang web Muse.ai đã tải xong cây DOM chính và tài nguyên cơ bản trước khi script cầu nối được nạp, tránh làm chậm tốc độ tải trang ban đầu của người dùng.

---

## 4. Quản lý Trạng thái & Cơ sở dữ liệu Cục bộ
Ứng dụng không sử dụng file cấu hình `.env` vì toàn bộ cài đặt được lưu trữ động trong trình duyệt:

1. **Khóa lưu trữ `chrome.storage.local`:**
   - Khóa `'museflow'`: Chứa bản chụp cấu trúc đồ thị JSON (danh sách nodes, edges, groups, notes, settings).
   - Khóa `'museflowDismissedUpdateVersion'`: Ghi nhớ phiên bản cập nhật mà người dùng đã bấm tắt thông báo để không làm phiền lại.
2. **Cơ sở dữ liệu `IndexedDB`:**
   - Tên database: `museflow-media` (phiên bản 1).
   - Object Store: `assets`.
   - Cấu trúc bản ghi: `key` là chuỗi định danh tài nguyên (ví dụ: `input:prompt-1`, `asset:asset-uuid`, `endFrame:node-id`), `value` là đối tượng `Blob` nhị phân của ảnh hoặc video.

---

## Liên kết liên quan
- [Yêu cầu hệ thống](yeu-cau-he-thong.md)
- [Hướng dẫn cài đặt](huong-dan-cai-dat.md)
- [Chi tiết file manifest.json](../04-chi-tiet-ma-nguon/manifest-json.md)
