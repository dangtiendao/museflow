# Hướng dẫn Kiểm thử (Testing Guide)

## 1. Chiến lược Kiểm thử của Dự án
Do đặc thù là Chrome Extension tương tác tự động hóa với nền tảng Muse.ai từ xa và cam kết không dùng npm build, chiến lược kiểm thử của MuseFlow bao gồm 3 lớp:

1. **Lớp 1: Kiểm thử cú pháp tĩnh (Syntax Validation):** Dùng Node.js engine kiểm tra lỗi cú pháp biên dịch của toàn bộ file JavaScript.
2. **Lớp 2: Kiểm thử đơn vị thuật toán đồ thị (Unit Testing with Native Runner):** Sử dụng module kiểm thử có sẵn `node:test` của Node.js (từ v18+) để kiểm tra độc lập các thuật toán thuần túy (Topological Sort, Cycle Detection, Script Parser).
3. **Lớp 3: Kiểm thử thủ công trên trình duyệt (Manual Integration Testing):** Nạp tiện ích vào Chrome và thực thi quy trình end-to-end với phiên Muse.ai thực.

---

## 2. Kiểm thử Cú pháp Tĩnh (Static Syntax Check)
Trước mỗi lần đóng gói hoặc gửi commit, chạy lệnh sau trên terminal:

```powershell
# Trên Windows PowerShell
node -c background.js; node -c muse-bridge.js; node -c app.js
```
Nếu bất kỳ tệp nào có lỗi cú pháp (dấu ngoặc thiếu, biến khai báo sai, cú pháp regex không hợp lệ), Node.js sẽ báo lỗi dòng và vị trí cụ thể.

---

## 3. Kiểm thử Đơn vị với Node.js Native Test Runner (`node:test`)
Để kiểm thử các hàm thuật toán trong `app.js` mà không cần cài Jest hay Mocha, bạn có thể tạo một script test nhỏ sử dụng `node:test` và `node:assert`:

```javascript
// Ví dụ script test: tests/graph-test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

test('Kiểm tra hàm so sánh phiên bản semver', () => {
  function compareVersions(a, b) {
    const left = String(a).split('.').map(Number), right = String(b).split('.').map(Number);
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      const delta = (left[i] || 0) - (right[i] || 0);
      if (delta) return delta;
    }
    return 0;
  }

  assert.equal(compareVersions('0.5.2', '0.5.1') > 0, true);
  assert.equal(compareVersions('0.5.2', '0.5.2'), 0);
  assert.equal(compareVersions('0.5.0', '0.5.2') < 0, true);
});
```

Chạy test bằng lệnh có sẵn của Node.js:
```bash
node --test tests/graph-test.mjs
```

---

## 4. Kịch bản Kiểm thử Tích hợp Thủ công (Manual Test Checklist)
Khi có sự thay đổi về mã nguồn, người kiểm thử cần rà soát qua các kịch bản sau:

| STT | Kịch bản kiểm thử | Thao tác | Kết quả mong đợi |
| :---: | :--- | :--- | :--- |
| **1** | Mở tiện ích | Nhấp icon tiện ích trên Chrome | Tab `app.html` mở ra (hoặc focus tab cũ), thanh statusbar hiển thị `● Muse session ready`. |
| **2** | Tạo node & kết nối | Thêm Prompt $\rightarrow$ Generate Image $\rightarrow$ Preview | Cổng xuất `text` nối được vào cổng `prompt`; dây SVG đổi màu tím, không cho phép nối ngược tạo vòng lặp. |
| **3** | Phím tắt canvas | Nhấn `G` kéo vùng nhóm, nhấn `T` thêm note, giữ `Space` kéo chuột | Khung nhóm xuất hiện, note văn bản gõ được chữ, canvas trượt êm ái. |
| **4** | Bóc tách kịch bản | Mở `Script → Nodes`, dán kịch bản mẫu tiếng Việt, bấm tạo | Tự động sinh danh sách node chia theo từng cảnh, video được đưa vào Timeline. |
| **5** | Chạy đơn lẻ | Bấm `▶ Run Image` trên node | Prompt được điền vào Muse.ai, ảnh kết quả được tải về và hiển thị trên node Preview. |
| **6** | Xử lý từ chối | Gửi prompt cố tình vi phạm policy | Hệ thống nhận diện `SCENE_REFUSED` và tự động gửi prompt thay thế an toàn 1 lần. |
| **7** | Xem trước Timeline | Bấm `▶ Preview` trên dock Timeline | Hai video player xoay vòng phát liền mạch, kim phát playhead di chuyển theo giây. |
| **8** | Xuất MP4 | Chọn định dạng MP4 $\rightarrow$ Bấm `⇩ Export` | Thanh tiến trình FFmpeg hiển thị `%`, tệp MP4 tải về máy mở phát có tiếng và hình chuẩn. |
| **9** | Undo & Reset | Nhấn `Ctrl+Z` nhiều lần, bấm nút `Reset` | Các thao tác được hoàn tác chính xác, canvas quay về đồ thị mẫu ban đầu. |
| **10**| Lưu & Nhập file | Bấm `Save workflow` rồi mở lại bằng `Import workflow` | Toàn bộ các node và ảnh nhúng base64 được khôi phục nguyên vẹn. |

---

## Liên kết liên quan
- [Quy ước lập trình](coding-convention.md)
- [Quy trình đóng góp](quy-trinh-dong-gop.md)
- [Chi tiết Luồng xử lý](../05-luong-xu-ly/thuc-thi-workflow-sinh-media.md)
