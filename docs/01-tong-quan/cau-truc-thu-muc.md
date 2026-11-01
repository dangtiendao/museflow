# Cấu trúc Thư mục Dự án MuseFlow

## 1. Sơ đồ cây thư mục hoàn chỉnh

```text
museflow/
├── .gitignore                      # Danh sách các tệp và thư mục bị bỏ qua bởi Git
├── app.html                        # Giao diện người dùng Single Page Canvas, Toolbar và Modals
├── app.js                          # Module điều khiển trung tâm (Canvas, Graph, Timeline, Storage)
├── background.js                   # Service Worker của Chrome Extension (Entry Point lắng nghe action)
├── LICENSE                         # Văn bản giấy phép GNU General Public License v2.0
├── manifest.json                   # WebExtension Manifest V3 khai báo quyền hạn và metadata
├── muse-bridge.js                  # Content Script cầu nối DOM Automation với trang Muse.ai
├── README.md                       # Tài liệu tổng quan dự án tiếng Anh
├── README-vi.md                    # Tài liệu tổng quan dự án tiếng Việt
├── REQUIREMENTS.md                 # Tóm tắt các yêu cầu bắt buộc khi chạy tiện ích
├── styles.css                      # Toàn bộ định dạng giao diện, hiệu ứng chuyển động và Dark Theme
├── THIRD_PARTY_NOTICES.md          # Thông cáo bản quyền và giấy phép của FFmpeg và các wrapper
├── VERSION.txt                     # Số phiên bản phát hành hiện tại và kiểu tích hợp
├── docs/                           # Thư mục tài liệu kỹ thuật toàn diện của dự án
│   ├── README.md                   # Mục lục tổng và lộ trình đọc tài liệu
│   ├── 01-tong-quan/               # Tài liệu giới thiệu, kiến trúc, cấu trúc và công nghệ
│   ├── 02-cai-dat/                 # Tài liệu hướng dẫn cài đặt, cấu hình và chạy dự án
│   ├── 03-module/                  # Tài liệu chi tiết các phân hệ module nghiệp vụ
│   ├── 04-chi-tiet-ma-nguon/       # Tài liệu phân tích chuyên sâu từng tệp mã nguồn
│   ├── 05-luong-xu-ly/             # Sơ đồ tuần tự cho các luồng xử lý cốt lõi
│   ├── 06-api/                     # Đặc tả giao thức Message Passing nội bộ
│   ├── 07-huong-dan-phat-trien/    # Quy ước lập trình, đóng góp mã nguồn và kiểm thử
│   ├── 08-phu-luc/                 # Bảng chú giải thuật ngữ, FAQ và đề xuất cải tiến
│   └── screenshots/                # Ảnh chụp giao diện minh họa cho tài liệu
├── downloads/                      # Bản phân phối dựng sẵn tiện ích mở rộng
│   └── MuseFlow-extension.zip      # Gói nén cài đặt trực tiếp không cần build
├── icons/                          # Bộ icon ứng dụng cho Chrome Extension các kích thước
│   ├── 26flow.svg                  # Icon vector logo chính của ứng dụng
│   ├── icon16.png                  # Kích thước 16x16px (favicon và thanh tiện ích thu nhỏ)
│   ├── icon32.png                  # Kích thước 32x32px (thanh tiện ích Chrome Windows)
│   ├── icon48.png                  # Kích thước 48x48px (trang quản lý chrome://extensions)
│   └── icon128.png                 # Kích thước 128x128px (Chrome Web Store và hiển thị lớn)
├── licenses/                       # Văn bản đầy đủ của các giấy phép bản quyền liên quan
│   ├── GPL-2.0.txt                 # Giấy phép GNU GPL v2.0 áp dụng cho mã nguồn MuseFlow và FFmpeg Core
│   └── MIT.txt                     # Giấy phép MIT áp dụng cho wrapper FFmpeg JS
├── templates/                      # Các biểu mẫu kịch bản phân cảnh chuẩn hóa
│   └── museflow-scene-script-template-vi.txt # Mẫu kịch bản phân cảnh chi tiết tiếng Việt
└── vendor/                         # Các thư viện bên thứ ba được đóng gói nội bộ
    └── ffmpeg/                     # Thư viện FFmpeg WebAssembly (xử lý video client-side)
        ├── ffmpeg.js               # Wrapper UMD JavaScript điều khiển FFmpeg WASM
        ├── ffmpeg-core.js          # Script nạp WebAssembly Core của FFmpeg
        └── ffmpeg-core.wasm        # Tệp nhị phân WebAssembly của FFmpeg (mã hóa H.264/AAC)
```

---

## 2. Ý nghĩa và vai trò các thư mục cốt lõi

| Thư mục | Vai trò kiến trúc | Tần suất sửa đổi |
| :--- | :--- | :--- |
| **Thư mục gốc `/`** | Chứa các file mã nguồn chính của tiện ích mở rộng (`app.js`, `muse-bridge.js`, `background.js`, `app.html`, `styles.css`) và tệp cấu hình `manifest.json`. | Cao (mỗi khi phát triển tính năng) |
| **`docs/`** | Chứa toàn bộ hệ thống tài liệu kỹ thuật, kiến trúc, sơ đồ Mermaid và hướng dẫn quy chuẩn cho lập trình viên. | Thường xuyên (đồng bộ cùng mã nguồn) |
| **`templates/`** | Chứa mẫu kịch bản phân cảnh chuẩn hóa giúp người dùng tự điền hoặc gửi System Prompt cho LLM sinh kịch bản. | Thấp (khi mở rộng cú pháp kịch bản) |
| **`vendor/ffmpeg/`** | Bộ mã nhị phân WebAssembly phục vụ xử lý video cục bộ. Được giữ nguyên vẹn để đảm bảo chuẩn zero-dependency. | Rất thấp (chỉ khi nâng cấp core FFmpeg) |
| **`icons/`** | Bộ tài nguyên đồ họa định danh thương hiệu của extension. | Rất thấp |
| **`downloads/`** | Nơi chứa gói ZIP phân phối cho người dùng cuối tải về giải nén và dùng ngay. | Mỗi đợt release |

---

## Liên kết liên quan
- [Kiến trúc tổng thể](kien-truc.md)
- [Công nghệ sử dụng](cong-nghe.md)
- [Chi tiết từng tệp mã nguồn](../04-chi-tiet-ma-nguon/app-js.md)
