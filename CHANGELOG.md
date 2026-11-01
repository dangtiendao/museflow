# Changelog

Tất cả những thay đổi đáng chú ý của dự án **MuseFlow (26Flow)** sẽ được ghi nhận trong tệp này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), và dự án tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.2] - 2026-11-01

### Added
- **Hệ thống Tài liệu Kỹ thuật Toàn diện:** Xây dựng toàn bộ thư viện tài liệu trong thư mục `docs/`:
  - `01-tong-quan/`: Giới thiệu, kiến trúc hệ thống, cấu trúc thư mục và bảng công nghệ runtime.
  - `02-cai-dat/`: Hướng dẫn cài đặt unpack extension, yêu cầu hệ thống, cấu hình quyền hạn và lệnh chạy.
  - `03-module/`: Phân tích chuyên sâu 6 phân hệ (Canvas Core, Graph Engine, Script Parser, Muse Bridge, Timeline Engine, Storage System).
  - `04-chi-tiet-ma-nguon/`: Phân tích chi tiết từng file mã nguồn kèm liên kết đối chiếu tương đối.
  - `05-luong-xu-ly/`: Sơ đồ tuần tự (Mermaid Sequence Diagrams) cho 5 luồng xử lý nghiệp vụ cốt lõi.
  - `06-api/`: Đặc tả chi tiết giao thức tin nhắn nội bộ `Message Passing API` giữa Canvas App và Content Script.
  - `07-huong-dan-phat-trien/`: Quy ước đặt tên, chuẩn JSDoc tiếng Việt, quy trình đóng góp Git flow và hướng dẫn kiểm thử.
  - `08-phu-luc/`: Bảng chú giải thuật ngữ kỹ thuật (Glossary), FAQ và báo cáo đề xuất cải tiến kiến trúc.
- **Tài liệu Hóa Mã nguồn Trực tiếp:**
  - Bổ sung JSDoc tiếng Việt chi tiết cho toàn bộ 88 hàm trong `app.js` và 15 hàm trong `muse-bridge.js`.
  - Thêm File Header kiến trúc cho `background.js`, `muse-bridge.js`, `app.js`, `app.html`, `styles.css`.
  - Thêm comment inline giải thích chi tiết các thuật toán phức tạp: Topological Sort (Kahn's Algorithm), phát hiện chu trình (BFS Cycle Detection), so khớp tỷ lệ khung hình log-ratio, và cơ chế Dehydration/Hydration với IndexedDB.
- **Tích hợp Quy trình Phát triển:**
  - Bổ sung tệp `CONTRIBUTING.md` quy định nguyên tắc bắt buộc cập nhật tài liệu song hành cùng mã nguồn.
  - Bổ sung cấu hình `jsdoc.json` phục vụ sinh tài liệu HTML động từ JSDoc.
  - Bổ sung Pull Request Template `.github/PULL_REQUEST_TEMPLATE.md`.
  - Bổ sung mẫu CI/CD GitHub Actions `.github/workflows/docs-check.yml`.

---

## [0.5.1] - 2026-10-15

### Added
- Bổ sung tính năng tự động kiểm tra phiên bản mới từ GitHub (`checkForAppUpdate`) và hiển thị thông báo trên thanh trạng thái.
- Hỗ trợ đổi tên hiển thị tùy chỉnh cho từng node (Custom Node Naming).
- Bổ sung phím tắt `G` để vẽ nhanh vùng phân nhóm (Group Region).
- Bổ sung phím tắt `T` để tạo ghi chú văn bản tự do (Text Note) trên canvas.

---

## [0.5.0] - 2026-10-01

### Added
- Tích hợp bộ giải mã **FFmpeg WebAssembly Core** cục bộ trong thư mục `vendor/ffmpeg/` để ghép và xuất tệp video MP4 (H.264/AAC) trực tiếp từ trình duyệt.
- Bổ sung tính năng tự động sinh âm thanh khoảng lặng (WAV silence 48kHz stereo) trong bộ nhớ để bù đắp cho các clip câm khi ghép video.
- Chuyển đổi mô hình tích hợp: Tương tác trực tiếp với tab Muse.ai đã đăng nhập thông qua Content Script, loại bỏ hoàn toàn yêu cầu máy chủ trung gian `muse2api`.
- Triển khai cơ chế lưu trữ lai (Hybrid Storage) kết hợp `IndexedDB` (`museflow-media`) để lưu Blob video dung lượng lớn và `chrome.storage.local` để lưu cấu trúc đồ thị JSON.
