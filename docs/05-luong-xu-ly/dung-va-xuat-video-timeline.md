# Luồng Dựng và Xuất Video Timeline (FFmpeg WASM & WebM)

## 1. Mục đích
Mô tả quy trình xử lý biên tập các clip video trên thanh dock Timeline, từ thao tác sắp xếp thứ tự phân cảnh, xem trước chuỗi video bằng kỹ thuật xoay vòng 2 player, cho đến khi ghép và xuất thành tệp video MP4 (H.264/AAC) hoàn chỉnh bằng FFmpeg WebAssembly ngay trên trình duyệt.

---

## 2. Sơ đồ Tuần tự (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Dock as Timeline Dock UI
    participant Preview as Preview Panel (Dual Player)
    participant Engine as exportTimelineMp4WithFFmpeg()
    participant IDB as IndexedDB ('museflow-media')
    participant FFmpeg as FFmpeg WebAssembly Worker
    participant Browser as Trình duyệt (File Download)

    User->>Dock: Kéo thả các clip để sắp xếp thứ tự cảnh, đặt thời lượng (Duration)
    
    opt Xem trước chuỗi video
        User->>Dock: Bấm nút "▶ Preview"
        Dock->>Preview: playTimeline({ startTime: 0 })
        Preview->>Preview: Player 1 phát Clip 0, Player 2 nạp trước Clip 1
        Preview->>Preview: Chuyển cảnh xoay vòng mượt mà (double buffering)
    end

    User->>Dock: Chọn format "MP4 (H.264)" và bấm "⇩ Export"
    Dock->>Engine: Kích hoạt exportTimelineMp4WithFFmpeg()
    Engine->>Dock: Đổi nút thành "Encoding 0%..." và hiện nút "■ Stop"
    
    Engine->>FFmpeg: ffmpeg.load() nạp ffmpeg-core.js và ffmpeg-core.wasm
    loop Với từng clip trên Timeline
        Engine->>IDB: Đọc Blob video theo ID
        IDB-->>Engine: Trả về Binary ArrayBuffer
        Engine->>FFmpeg: writeFile('/scene_xxx.bin', bytes)
        Engine->>FFmpeg: ffprobe đọc codec, kích thước, audio
    end

    alt Nếu tất cả clip đồng nhất H.264/AAC và cùng kích thước
        Engine->>FFmpeg: exec(['-f', 'concat', '-c', 'copy', ...]) -> Ghép trực tiếp
    else Nếu clip khác kích thước hoặc thiếu âm thanh
        Engine->>Engine: createSilentWav() -> Sinh file WAV khoảng lặng 48kHz Stereo
        Engine->>FFmpeg: writeFile('/timeline-silence.wav', silentBytes)
        Engine->>FFmpeg: exec(['-filter_complex', filterGraph, '-c:v', 'libx264', '-c:a', 'aac', ...])
    end

    FFmpeg-->>Engine: Ghi tệp kết quả vào '/museflow-timeline.mp4'
    Engine->>FFmpeg: readFile('/museflow-timeline.mp4')
    FFmpeg-->>Engine: Trả về Uint8Array nhị phân của tệp MP4
    Engine->>Browser: Tạo Blob([output], { type: 'video/mp4' }) -> URL.createObjectURL()
    Engine->>Preview: Tự động nạp tệp MP4 vào cửa sổ xem trước
    Engine->>Browser: Kích hoạt thẻ `<a download>` để tải tệp MP4 về máy tính người dùng
    Engine->>Dock: Reset nút bấm về "⇩ Export", ẩn nút Stop
```

---

## 3. Các đặc điểm kỹ thuật nổi bật
1. **Khả năng ghép không cần nén lại (Zero-loss Stream Copy):** Nếu người dùng xuất các video tải trực tiếp từ Muse.ai cùng định dạng 1080p và AAC, FFmpeg sẽ chạy ở chế độ `-c copy`. Thời gian ghép một video 1 phút chỉ mất từ **1 đến 3 giây**, giữ trọn vẹn chất lượng điểm ảnh gốc.
2. **Tự động bù trừ âm thanh (Audio Infill):** Nếu người dùng có một clip câm (silent clip) xen giữa các clip có tiếng, engine tự động chèn dải âm thanh khoảng lặng để đảm bảo luồng audio không bị ngắt hoặc mất đồng bộ tiếng-hình (A/V desync).
3. **Cơ chế Hủy khẩn cấp (Graceful Abort):** Người dùng có thể bấm nút **■ Stop** bất cứ lúc nào trong lúc xuất video; hàm `stopTimelineExport()` sẽ gửi tín hiệu hủy tới AbortController và gọi `ffmpeg.terminate()` để giải phóng ngay lập tức luồng Web Worker và bộ nhớ RAM.

---

## Liên kết liên quan
- [Module Timeline Engine](../03-module/timeline-engine.md)
- [Module Lưu trữ](../03-module/storage-system.md)
- [Chi tiết Luồng thực thi Workflow](thuc-thi-workflow-sinh-media.md)
