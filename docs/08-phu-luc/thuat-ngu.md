# Bảng Chú giải Thuật ngữ Kỹ thuật (Glossary)

Tài liệu này giải thích các thuật ngữ chuyên môn và khái niệm cốt lõi được sử dụng xuyên suốt trong mã nguồn và tài liệu của dự án MuseFlow (26Flow).

---

| Thuật ngữ | Tên tiếng Anh / Viết tắt | Định nghĩa & Ý nghĩa trong MuseFlow |
| :--- | :--- | :--- |
| **Đồ thị Có hướng Không Chu trình** | **DAG (Directed Acyclic Graph)** | Cấu trúc toán học biểu diễn quy trình làm việc trên canvas. Các node là đỉnh, các đường nối là cạnh có hướng. Không tồn tại bất kỳ chu trình khép kín nào. |
| **Sắp xếp Topo** | **Topological Sort** | Thuật toán tuyến tính hóa các đỉnh của DAG sao cho đối với mọi cạnh có hướng từ $u \rightarrow v$, đỉnh $u$ luôn xuất hiện trước đỉnh $v$ trong danh sách thực thi. |
| **Bán bậc vào** | **In-degree** | Số lượng đường nối đầu vào trỏ tới một cổng hoặc một node. Trong thuật toán Kahn, node có `in-degree == 0` là node không phụ thuộc và sẵn sàng được chạy ngay. |
| **Khóa Liên tục Khung hình** | **Continuity / Continuity Lock** | Kỹ thuật trích xuất khung hình cuối cùng (`endFrame`) của clip video trước đó để làm ảnh tham chiếu mở đầu (`reference`) cho clip kế tiếp, giúp nhân vật, trang phục và bối cảnh chuyển tiếp mượt mà. |
| **Khử nước Dữ liệu** | **Dehydration** | Quá trình tách các chuỗi Base64 và dữ liệu Blob media nhị phân nặng ra khỏi cây JSON đồ thị để đưa vào IndexedDB, chỉ lưu lại chuỗi khóa tham chiếu nhẹ `museflow-idb:...` trong Chrome Storage. |
| **Tái lập Dữ liệu** | **Hydration** | Quá trình ngược lại với Dehydration: khi nạp lại đồ thị vào RAM, hệ thống đọc Blob từ IndexedDB và sinh các `blob:` URLs để gán vào các thẻ `<img>` và `<video>`. |
| **Đệm Kép Liền mạch** | **Seamless Double Buffering** | Kỹ thuật sử dụng 2 video player (`timelinePlayer` và `timelinePlayerNext`) xoay vòng: một thẻ đang phát trong khi thẻ kia nạp trước khung hình của clip kế tiếp trong nền, giúp loại bỏ hiện tượng nhấp nháy đen khi chuyển cảnh. |
| **Sai số Tỷ lệ Log-Ratio** | **Log-Ratio Aspect Score** | Công thức toán học $\lvert \ln((w/h) / expected) \rvert$ dùng để so khớp độ lệch tỷ lệ khung hình giữa ảnh thực tế Muse trả về với tỷ lệ người dùng yêu cầu. |
| **Kịch bản Phân cảnh** | **Scene Script** | Văn bản có cấu trúc phân chia câu chuyện theo từng cảnh (Scene), ghi rõ thời lượng mốc giây, khung đầu, khung cuối, diễn biến nhịp độ, prompt ảnh và prompt video. |
| **Khóa Dùng chung** | **Shared Prompt Locks** | Các khối văn bản định nghĩa ngoại hình nhân vật (`[CHAR_LOCK]`), phong cách (`[STYLE_LOCK]`) hoặc bối cảnh (`[SET_LOCK]`) được khai báo ở đầu kịch bản và tự động bung vào prompt của từng cảnh. |
| **Cầu nối Trang** | **Page Bridge / Content Script** | Script JavaScript (`muse-bridge.js`) được chèn trực tiếp vào context của trang web Muse.ai để tương tác với cây DOM của trang đó theo lệnh từ Canvas Extension. |
| **Bộ mã hóa WebAssembly** | **FFmpeg WASM** | Bản biên dịch của phần mềm xử lý đa phương tiện FFmpeg sang dạng mã nhị phân WebAssembly, cho phép trình duyệt trực tiếp giải mã, cắt ghép và đóng gói tệp video MP4 (H.264/AAC) mà không cần cài đặt phần mềm ngoài. |

---

## Liên kết liên quan
- [Kiến trúc tổng thể](../01-tong-quan/kien-truc.md)
- [Module Graph Engine](../03-module/graph-engine.md)
- [Module Timeline Engine](../03-module/timeline-engine.md)
- [FAQ](faq.md)
