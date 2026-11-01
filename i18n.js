/**
 * @file i18n.js - Module đa ngôn ngữ (Internationalization & Localization) cho MuseFlow (26Flow).
 * @description Quản lý từ điển song ngữ (Tiếng Việt <-> English), chuyển đổi ngôn ngữ thời gian thực,
 *              nội suy tham số, lưu tùy chọn người dùng và đồng bộ giao diện DOM mà không tải lại trang.
 * @module I18nEngine
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * Bộ từ điển bản dịch song ngữ (Tiếng Việt / English).
   */
  const translations = {
    vi: {
      common: {
        save: 'Lưu',
        cancel: 'Hủy',
        reset: 'Đặt lại',
        close: 'Đóng',
        delete: 'Xóa',
        rename: 'Đổi tên',
        ok: 'Đồng ý',
        skip: 'Bỏ qua',
        name: 'Tên',
        status: 'Trạng thái',
        error: 'Lỗi',
        success: 'Thành công',
        warning: 'Cảnh báo',
        loading: 'Đang tải…',
        run: 'Chạy',
        stop: 'Dừng',
        again: 'Tạo lại',
        fit: 'Vừa màn hình'
      },
      toolbar: {
        scriptImport: '＋ Kịch bản → Node',
        addNode: '＋ Thêm node',
        save: 'Lưu',
        saveWorkflow: 'Lưu workflow',
        saveWorkflowTitle: 'Lưu workflow thành file JSON tái sử dụng',
        importWorkflow: 'Nhập workflow',
        importWorkflowTitle: 'Nhập workflow MuseFlow đã lưu',
        settings: 'Cài đặt',
        reset: 'Đặt lại',
        runWorkflow: '▶ Chạy workflow',
        runWorkflowTitle: 'Chạy toàn bộ các node trong workflow theo thứ tự phụ thuộc',
        buyCoffee: '☕ Mua cà phê ủng hộ',
        buyCoffeeTitle: 'Ủng hộ nhà phát triển MuseFlow qua VietQR',
        langAria: 'Chọn ngôn ngữ giao diện'
      },
      statusbar: {
        checkingMuse: '● Đang kiểm tra muse.ai...',
        generationSession: 'Tạo media: Phiên trình duyệt Muse.ai',
        museConnected: 'Muse session · v{version}',
        updateAvailable: 'Đã có bản cập nhật MuseFlow {version}',
        downloadUpdate: 'Tải bản cập nhật',
        dismissUpdateAria: 'Bỏ qua thông báo cập nhật'
      },
      settings: {
        title: 'Cài đặt phiên làm việc Muse.ai',
        languageLabel: 'Ngôn ngữ giao diện / Language:',
        sessionDesc: 'MuseFlow sử dụng trực tiếp tab trình duyệt Muse.ai đã đăng nhập của bạn. Hãy giữ tab chat Muse mở trong khi chạy workflow.',
        checkSessionBtn: 'Kiểm tra phiên Muse',
        connectionStatus: 'Trạng thái kết nối',
        cancel: 'Hủy',
        save: 'Lưu'
      },
      menu: {
        addNode: 'Thêm node',
        groups: {
          text: 'Văn bản',
          images: 'Hình ảnh',
          video: 'Video & Timeline'
        },
        nodes: {
          prompt: 'Prompt',
          negativePrompt: 'Prompt phủ định',
          textAppend: 'Nối văn bản',
          textConcat: 'Hợp nhất văn bản',
          textNote: 'Ghi chú văn bản',
          imageInput: 'Nạp ảnh',
          references: 'Ảnh tham chiếu',
          generateImage: 'Tạo ảnh',
          imageResize: 'Đổi kích thước ảnh',
          preview: 'Xem trước',
          generateVideo: 'Tạo video',
          timeline: 'Dòng thời gian (Timeline)'
        },
        actions: {
          saveWorkflow: 'Lưu workflow',
          runWorkflow: '▶ Chạy workflow',
          arrangeNodes: 'Sắp xếp các node',
          deleteSelected: 'Xóa node đã chọn',
          disconnectAll: 'Ngắt toàn bộ kết nối'
        },
        connectionPicker: {
          sendOutput: 'Gửi {label} · {type}',
          connectExisting: 'Kết nối node có sẵn',
          createCompatible: 'Tạo node tương thích',
          noCompatible: 'Không có hành động node tương thích cho đầu ra này.',
          timelineDockSuffix: ' (Thanh Timeline)'
        }
      },
      canvas: {
        handToolTitle: 'Công cụ bàn tay (H) · Giữ phím Cách để cuộn · Alt-kéo để sao chép · Ctrl+Z hoàn tác · G tạo nhóm · T ghi chú',
        groupToolTitle: 'Vẽ vùng phân nhóm (G)',
        zoomOutTitle: 'Thu nhỏ',
        zoomInTitle: 'Phóng to',
        fitTitle: 'Căn vừa toàn bộ node',
        addNodeMenuCaption: 'Thêm node'
      },
      nodes: {
        definitions: {
          prompt: { title: 'Prompt', text: 'văn bản' },
          negativePrompt: { title: 'Prompt phủ định', text: 'phủ định' },
          textAppend: { title: 'Nối văn bản', inText: 'văn bản', outText: 'văn bản' },
          textConcat: { title: 'Hợp nhất văn bản', inText: 'văn bản', outText: 'văn bản' },
          imageInput: { title: 'Nạp ảnh', outImage: 'ảnh' },
          references: { title: 'Ảnh tham chiếu', inRef: 'ảnh {num}', outImages: 'các ảnh' },
          generateImage: { title: 'Tạo ảnh', inPrompt: 'prompt', inNegative: 'phủ định', inReference: 'tham chiếu', outImage: 'ảnh' },
          generateVideo: { title: 'Tạo video', inPrompt: 'prompt', inNegative: 'phủ định', inReference: 'tham chiếu', outVideo: 'video', outEndFrame: 'khung cuối' },
          timeline: { title: 'Timeline', inClip: 'clip {num}' },
          imageResize: { title: 'Đổi kích cỡ ảnh', inImage: 'ảnh', outImage: 'ảnh' },
          preview: { title: 'Xem trước', inMedia: 'media' }
        },
        header: {
          renameNode: 'Đổi tên node',
          renameAria: 'Đổi tên {name}',
          deleteTitle: 'Xóa'
        },
        hints: {
          negativePrompt: 'Kết nối với cổng phủ định trên node tạo ảnh hoặc video.',
          textAppend: 'Nối văn bản này vào chuỗi prompt được kết nối phía trước.',
          textConcatSeparator: 'Dấu phân cách',
          textConcatJoin: 'Ghép các văn bản kết nối bằng:',
          imageInputEmpty: 'Chưa chọn ảnh nào',
          imageInputChoose: 'Chọn ảnh',
          imageInputHint: 'Kết nối ảnh này vào Generate Image → reference.',
          referencesConnectedBadge: '{count} nguồn ảnh đã kết nối',
          referencesRow: '{label} · kết nối nguồn ảnh',
          referencesHint: 'Tất cả các ảnh kết nối sẽ được gửi tới mọi node Tạo ảnh và Tạo video liên kết.',
          useContinuity: 'Dùng khung cuối của clip trước làm ảnh tham chiếu bắt đầu',
          endFrameAlt: 'Khung hình cuối được trích xuất để nối cảnh liên tục',
          endFrameTitle: 'Khung cuối video · kết nối “khung cuối” vào cổng tham chiếu của video tiếp theo',
          dragToTimeline: 'Kéo đầu ra vào Timeline',
          dragToTimelineTitle: 'Kéo kết quả video này vào dòng thời gian',
          downloadResized: 'Tải ảnh đã đổi kích cỡ',
          previewEmpty: 'Chạy workflow để xem kết quả',
          previewSequence: '▶ Xem trước chuỗi clip',
          dropVideoHere: 'Thả node video vào đây hoặc kết nối với cổng clip',
          playSec: 'Thời lượng (giây)',
          promptSourcesBadge: '{count} nguồn prompt kết hợp',
          referenceImagesBadge: '{count} ảnh tham chiếu đã kết nối',
          requestedActual: 'Yêu cầu {req} · thực tế {actual}',
          sizeMismatchRatio: ' (Muse trả về tỉ lệ khác)'
        },
        actions: {
          runImage: '▶ Chạy Tạo ảnh',
          runVideo: '▶ Chạy Tạo video',
          stop: '■ Dừng',
          stopTitle: 'Dừng tác vụ tạo này',
          again: '↻ Tạo lại',
          againTitle: 'Tạo lại video này với độ bám sát kịch bản và tham chiếu cao hơn'
        },
        options: {
          aspectRatio: {
            square: 'Vuông (1:1)',
            landscape16_9: 'Ngang (16:9)',
            portrait9_16: 'Dọc (9:16)',
            landscape4_3: 'Ngang (4:3)',
            portrait3_4: 'Dọc (3:4)'
          },
          fit: {
            cover: 'Cắt vừa khung (Cover)',
            contain: 'Thu vừa khung (Contain)',
            stretch: 'Kéo giãn (Stretch)'
          }
        },
        contextMenu: {
          renameNode: 'Đổi tên node…',
          runVideo: '▶ Chạy Video',
          runImage: '▶ Chạy Ảnh',
          stopVideo: '■ Dừng Video',
          stopImage: '■ Dừng Ảnh',
          again: '↻ Tạo lại · bám sát prompt hơn',
          previewSequence: '▶ Xem trước chuỗi',
          createTextMerge: 'Tạo node Hợp nhất văn bản',
          createPreview: 'Tạo node Xem trước',
          chooseImage: 'Chọn / thay thế ảnh',
          downloadResized: 'Tải ảnh đã đổi kích cỡ',
          downloadPreview: 'Tải bản xem trước',
          focusText: 'Nhập văn bản',
          duplicateNode: 'Nhân bản node',
          disconnectNode: 'Ngắt toàn bộ kết nối',
          deleteNode: 'Xóa node',
          removeEdge: 'Xóa đường nối này',
          connectionTitle: 'Kết nối',
          deleteConnection: 'Xóa kết nối'
        }
      },
      timeline: {
        heading: 'Dòng thời gian',
        clipCount: '{count} clip',
        arrangeHint: 'Sắp xếp phân cảnh · kéo clip để đổi thứ tự',
        importAllBtn: '＋ Nhập tất cả video',
        importAllTitle: 'Thêm tất cả các node Tạo Video vào dòng thời gian',
        addClipBtn: '＋ Thêm clip',
        addClipTitle: 'Thêm đầu ra video',
        previewBtn: '▶ Xem trước',
        previewTitle: 'Xem trước chuỗi phân cảnh liền mạch',
        exportFormatTitle: 'Chọn định dạng xuất video',
        exportBtn: '⇩ Xuất video',
        exportTitle: 'Ghép và xuất toàn bộ video trên dòng thời gian',
        stopExportBtn: '■ Dừng',
        stopExportTitle: 'Dừng xuất video',
        showTimelineTitle: 'Hiển thị dòng thời gian',
        dropZoneText: 'Kéo node Tạo Video hoặc clip vào đây',
        previewPanelTitle: 'Xem trước Dòng thời gian',
        closePreviewAria: 'Đóng khung xem trước',
        scenePlayback: 'Đang phát phân cảnh',
        allVideosOnTimeline: 'Tất cả đầu ra video đã có trên dòng thời gian',
        noVideosAvailable: 'Không có đầu ra video nào',
        importAllVideoTitle: 'Nhập tất cả node Tạo Video',
        noVideosToImport: 'Không có node Tạo Video nào để nhập',
        hideTimelineTitle: 'Thu gọn dòng thời gian',
        duration: 'Thời lượng',
        removeClip: 'Xóa clip',
        videoFallbackName: 'Video {index}'
      },
      modals: {
        confirmReplaceCanvas: 'Nhập workflow này sẽ thay thế toàn bộ canvas hiện tại. Bạn có muốn tiếp tục?',
        groupName: {
          titleGroup: 'Đặt tên nhóm',
          descGroup: 'Bỏ qua để sử dụng tên mặc định.',
          titleNode: 'Đổi tên node',
          descNode: 'Nhập nhãn hiển thị mới cho thanh tiêu đề node.',
          labelGroup: 'Tên nhóm',
          labelNode: 'Tên node',
          placeholderGroup: 'Nhóm 1',
          placeholderNode: 'Tên node',
          skipBtn: 'Bỏ qua',
          cancelBtn: 'Hủy',
          okBtn: 'Đồng ý'
        },
        donation: {
          title: 'Mua cho tôi ly cà phê',
          subtitle: 'Ủng hộ MuseFlow qua VietQR',
          closeAria: 'Đóng',
          qrFallback: 'Không tải được mã QR xem trước. Mở ảnh VietQR trực tiếp bên dưới.',
          openLink: 'Mở VietQR trong tab mới',
          bmacLink: 'Buy Me a Coffee ↗'
        },
        script: {
          title: 'Tạo node từ kịch bản phân cảnh',
          desc1: 'Dán kịch bản phân cảnh theo định dạng chuẩn Grumbo & Snowy. MuseFlow sẽ tự động phân tích khung đầu/cuối, hành động theo mốc thời gian, prompt ảnh/video, audio, khóa nhân vật/bối cảnh và prompt phủ định, sau đó liên kết các node và sắp xếp video trên Timeline.',
          desc2: 'Tải file mẫu định dạng chuẩn để tự điền hoặc cung cấp cho AI. Giữ nguyên các tiêu đề mục.',
          label: 'Kịch bản',
          downloadTemplate: '⇩ Tải mẫu kịch bản chuẩn',
          cancel: 'Hủy',
          buildNodes: 'Tạo các node phân cảnh',
          placeholder: 'CẢNH 1 (0:00 đến 0:10): Tiêu đề phân cảnh\nKhung đầu: ...\nKhung cuối: ...\nDiễn biến: 1. 0-2s: ...\nPrompt ảnh khung đầu: ...\nPrompt video: ...\nAudio: ...'
        },
        runOrder: {
          title: 'Xác nhận thứ tự chạy',
          subtitle: 'Các node tạo sẽ chạy theo thứ tự bên dưới.',
          closeAria: 'Đóng',
          listAria: 'Thứ tự node tạo',
          note: 'Tick node muốn chạy; bỏ tick để bỏ qua. Node đang được chọn áp dụng khi chạy workflow.',
          cancel: 'Hủy',
          resetOrder: 'Đặt lại theo thứ tự tạo',
          runNodes: '▶ Chạy node',
          typeVideo: 'Video',
          typeImage: 'Ảnh',
          subtitleSelection: '{count}/{total} node được chọn · kéo để sắp xếp thứ tự',
          runNodesCount: '▶ Chạy {count} node',
          selectNodeAria: 'Chọn {name} để chạy',
          willRun: 'Sẽ chạy node này',
          willSkip: 'Bỏ qua node này',
          createdOrder: 'tạo thứ {num}',
          typeVideoUpper: 'VIDEO',
          typeImageUpper: 'ẢNH',
          skipped: 'BỎ QUA',
          warningSelectAtLeastOne: 'Chọn ít nhất một node để chạy.',
          warningMissingPrerequisites: 'Node đã chọn cần đầu ra từ: {missing}. Hãy chọn thêm node nguồn hoặc tạo đầu ra trước.',
          warningCycleConflict: 'Thứ tự này xung đột với kết nối phụ thuộc giữa các node. Hãy đưa node tạo nguồn lên trước.'
        }
      },
      status: {
        
        "undoStopWorkflow": "Hãy dừng workflow đang chạy trước khi hoàn tác.",
        "nothingToUndo": "Không có gì để hoàn tác.",
        "undidAction": "Đã hoàn tác: {label}.",
        "textNoteAdded": "Đã thêm thẻ ghi chú vào canvas.",
        "connectedTo": "Đã kết nối với {label}.",
        "createNodeFailed": "Không thể tạo node đã chọn.",
        "nodeCreatedAndConnected": "Đã tạo {type} và kết nối với {label}.",
        "incompatiblePorts": "Kiểu cổng kết nối không tương thích.",
        "loopDetected": "Kết nối này sẽ tạo vòng lặp workflow. Hãy kết nối các node theo một chiều.",
        "scenesCreated": "Đã tạo {scenes} phân cảnh · {nodes} node · {clips} clip video trên Timeline.",
        "nodeCopyCreated": "Đã tạo bản sao node.",
        "dropOutputToChoose": "Thả đầu ra vào canvas để chọn node tương thích.",
        "startFromOutputPort": "Bắt đầu từ một cổng đầu ra tương thích, sau đó nhấp vào cổng vào này.",
        "connectingPortClick": "Đang kết nối {type}: nhấp vào cổng đầu vào tương thích.",
        "connectingPortDrag": "Đang kết nối {type}: nhấp hoặc kéo dây vào cổng đầu vào tương thích.",
        "preparingTimelineClips": "Đang chuẩn bị các clip timeline cho FFmpeg…",
        "joiningClipsFast": "Đang ghép các clip tương thích mà không cần mã hóa lại (nhanh, chất lượng gốc)…",
        "encodingCompleteTimeline": "FFmpeg đang lắp ráp và mã hóa toàn bộ timeline cục bộ…",
        "timelineExportSuccess": "Đã xuất video timeline thành file MP4 ({name}).",
        "timelineExportStopped": "Đã dừng quá trình xuất video timeline.",
        "recordingWebm": "Đang ghi video timeline dạng WebM liền mạch ({percent}%)…",
        "timelineExportWebmSuccess": "Đã xuất video timeline thành file WebM ({name}).",
        "exportCanvasFailed": "Không thể tạo canvas xuất video.",
        "browserCannotEncodeMp4": "Trình duyệt này không hỗ trợ mã hóa MP4 (H.264). Hãy chọn WebM.",
        "videoEncodingFailed": "Mã hóa video thất bại.",
        "exportedVideoEmpty": "File video xuất ra bị rỗng.",
        "selectWebmSuggestion": "Trình duyệt không tạo được file MP4. Hãy chọn WebM hoặc dùng trình duyệt hỗ trợ MP4 MediaRecorder.",
        "stopRunningWorkflowFirst": "Hãy dừng workflow đang chạy trước khi bắt đầu lại.",
        "noNodesToRun": "Không có node nào để chạy trong workflow.",
        "workflowCompleted": "Workflow hoàn thành.",
        "workflowStopped": "Đã dừng workflow.",
        "workflowRunningOrder": "Đang chạy workflow ({count} node tạo media)…",
        "runningNodeIndex": "Đang chạy node {index}/{total}: {title}…",
        "stopRequested": "Đã gửi yêu cầu dừng tới Muse. Đang dừng tác vụ…",
        "promptEmpty": "Prompt bị rỗng.",
        "promptNotSubmitted": "Muse không nhận prompt vào khung chat. Không có lệnh nào được gửi.",
        "promptSubmissionUnconfirmed": "Muse chưa xác nhận gửi prompt. Hãy kiểm tra khung chat và thử lại.",
        "sceneRefused": "Muse từ chối phân cảnh này: {detail}",
        "accountOutOfCredits": "Tài khoản Muse không đủ credit ảnh.",
        "timeoutWaitingMedia": "Hết thời gian chờ tệp đính kèm {mediaType} từ Muse.",
        "mediaTypeMismatch": "Muse trả về {actual} cho node tạo {expected}. Hãy chuyển composer của Muse sang tạo {expected} rồi thử lại.",
        "openMuseAndSignIn": "Hãy mở trang Muse.ai và đăng nhập, sau đó thử lại.",
        "museSessionActive": "Phiên chat Muse.ai đang hoạt động.",
        "museNotReady": "Khung chat Muse chưa sẵn sàng. Hãy mở trang chat Muse và đợi hộp nhập tin nhắn nạp xong.",
        "museNotFound": "Không tìm thấy tab Muse.ai nào đang mở. Hãy mở Muse và đăng nhập.",
        "workflowCycleError": "Workflow chứa vòng lặp kín. Hãy ngắt vòng lặp trước khi chạy.",
        "selectedNodeNotExist": "Node tạo media đã chọn không còn tồn tại.",
        "cannotLoadWorkflow": "Không thể nạp workflow đã lưu: {error}",
        "workflowOpenMediaFailed": "Workflow đã mở, nhưng quá trình nạp media thất bại: {error}",
        "cannotDownloadTimelineClip": "Không thể tải clip timeline {index} (HTTP {status}).",
        "timelineClipEmpty": "Clip timeline {index} bị rỗng.",
        "timelineClipNoVideo": "Clip timeline {index} không có luồng video đọc được.",
        "nextClipTimeout": "Clip timeline tiếp theo không tải kịp thời gian.",
        "ffmpegEmptyMp4": "FFmpeg tạo ra file MP4 rỗng.",
        "nodeCreatedConnectedGeneral": "Đã tạo {type} và kết nối.",
        "onlyVideoToTimeline": "Chỉ có thể thêm đầu ra của node Tạo Video vào dòng thời gian.",
        "allVideosAlreadyOnTimeline": "Tất cả các node Tạo Video đã có trên dòng thời gian.",
        "noVideoNodesToImport": "Không có node Tạo Video nào để nhập.",
        "importedVideoNodes": "Đã nhập {count} node video vào dòng thời gian. Khi chạy sẽ tạo video theo thứ tự trên timeline.",
        "connectCompletedClipsFirst": "Hãy kết nối các clip video hoàn chỉnh vào dòng thời gian trước.",
        "timelinePreviewComplete": "Đã xem trước dòng thời gian xong.",
        "timelineClipReadyPressPlay": "Clip timeline đã sẵn sàng; nhấn Phát để tiếp tục ({error})",
        "timelineShotProgress": "Phân cảnh timeline {index}/{total}",
        "encodingMp4Progress": "Đang mã hóa MP4 bằng FFmpeg · {percent}%",
        "loadingFfmpegEngine": "Đang nạp bộ máy xử lý video FFmpeg cục bộ…",
        "loadingClipToFfmpeg": "Đang nạp clip {index}/{total} vào FFmpeg cục bộ…",
        "addCompletedVideosBeforeExport": "Hãy thêm các clip video hoàn chỉnh vào Timeline trước khi xuất.",
        "ffmpegEngineLoadFailed": "Không thể nạp bộ máy FFmpeg đính kèm. Hãy tải lại tiện ích và thử lại.",
        "cannotExportStitchedVideo": "Trình duyệt này không thể xuất video ghép từ Timeline.",
        "preparingClipForExport": "Đang chuẩn bị clip {index}/{total} để xuất video…",
        "exportingClipInOrder": "Đang xuất clip {index}/{total} theo thứ tự phân cảnh…",
        "stitchedExportSuccess": "Đã xuất video ghép timeline thành file {format}.",
        "stoppingExport": "Đang dừng xuất timeline…",
        "groupTooSmall": "Vùng nhóm quá nhỏ. Hãy kéo vùng lớn hơn để tạo.",
        "nodeNameEmpty": "Tên node không được để trống.",
        "groupNameEmpty": "Tên nhóm không được để trống.",
        "groupCreatedAroundNodes": "Đã tạo vùng nhóm bao quanh {count} node.",
        "groupToolActive": "Công cụ nhóm đang bật: kéo trên canvas để đánh dấu vùng nhóm. Nhấn G hoặc Escape để hủy.",
        "nodeRenamed": "Đã đổi tên node.",
        "textMergeCreatedConnected": "Đã tạo node Hợp nhất văn bản và kết nối với đầu ra này.",
        "nodeConnectionsRemoved": "Đã xóa toàn bộ kết nối của node.",
        "noOutputToDownload": "Node này chưa có kết quả đầu ra để tải xuống.",
        "nodeDuplicated": "Đã nhân bản node.",
        "nodesArranged": "Đã tự động sắp xếp các node theo thứ tự workflow.",
        "connectionDeleted": "Đã xóa kết nối.",
        "selectNodesFirst": "Hãy chọn một hoặc nhiều node trước.",
        "allConnectionsRemoved": "Đã xóa toàn bộ kết nối.",
        "stoppedGenerationId": "Đã dừng tác vụ tạo {type}: {id}",
        "regeneratingAgain": "Đang tạo lại video với độ bám sát prompt cao hơn…",
        "runningSelectedNode": "Đang chạy node tạo media đã chọn…",
        "runningWorkflow": "Đang chạy workflow...",
        "imageResizeWaiting": "Node Đổi cỡ ảnh đang chờ ảnh đầu vào.",
        "generationStepProgress": "{label} · đang tạo {type}: {id}",
        "retryingSceneSafeAlt": "Muse không thể tạo {scene}; đang thử lại với phương án an toàn tương đương…",
        "nodeGenerationCompleted": "Đã hoàn thành tạo node.",
        "generationCompletedSaveFailed": "Đã tạo xong, nhưng không thể lưu workflow: {error}",
        "museConnectionFailed": "Kết nối tới Muse thất bại. Hãy tải lại MuseFlow {version}, sau đó kiểm tra phiên Muse.",
        "autoSaveFailed": "Tự động lưu thất bại: {error}",
        "saved": "Đã lưu.",
        "workflowSavedWithMedia": "Đã lưu workflow bao gồm toàn bộ media.",
        "workflowSavedExternalUrls": "Đã lưu workflow; {count} URL media không thể nhúng trực tiếp và có thể cần phiên Muse gốc.",
        "cannotSaveWorkflowFile": "Không thể lưu file workflow: {error}",
        "stopWorkflowBeforeImport": "Hãy dừng workflow đang chạy trước khi nhập file mới.",
        "cannotImportWorkflow": "Không thể nhập file workflow: {error}",
        "workflowImported": "Đã nhập workflow: {name}",
        "selectedConnectionsDeleted": "Đã xóa các kết nối đã chọn.",
        "selectedNodeLabel": "Node đã chọn",
        "generationStepLabel": "Tiến trình tạo {step}/{total}",
        "thisScene": "phân cảnh này",
        "cannotSaveWorkflow": "Không thể lưu workflow: {error}",
        "timelineExportMp4Success": "Đã xuất video timeline thành file MP4 (H.264) bằng FFmpeg cục bộ."
      }
    },
    en: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        reset: 'Reset',
        close: 'Close',
        delete: 'Delete',
        rename: 'Rename',
        ok: 'OK',
        skip: 'Skip',
        name: 'Name',
        status: 'Status',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        loading: 'Loading…',
        run: 'Run',
        stop: 'Stop',
        again: 'Again',
        fit: 'Fit'
      },
      toolbar: {
        scriptImport: '＋ Script → Nodes',
        addNode: '＋ Add node',
        save: 'Save',
        saveWorkflow: 'Save workflow',
        saveWorkflowTitle: 'Save workflow as a reusable JSON file',
        importWorkflow: 'Import workflow',
        importWorkflowTitle: 'Import a saved MuseFlow workflow',
        settings: 'Settings',
        reset: 'Reset',
        runWorkflow: '▶ Run workflow',
        runWorkflowTitle: 'Run every node in the workflow in dependency order',
        buyCoffee: '☕ Buy me a coffee',
        buyCoffeeTitle: 'Support MuseFlow via VietQR',
        langAria: 'Select interface language'
      },
      statusbar: {
        checkingMuse: '● Checking muse.ai...',
        generationSession: 'Generation: Muse.ai browser session',
        museConnected: 'Muse session · v{version}',
        updateAvailable: 'MuseFlow {version} is available',
        downloadUpdate: 'Download update',
        dismissUpdateAria: 'Dismiss update notice'
      },
      settings: {
        title: 'Muse.ai session settings',
        languageLabel: 'Interface language / Ngôn ngữ:',
        sessionDesc: 'MuseFlow uses your signed-in Muse.ai browser tab directly. Keep the Muse chat tab open while a workflow runs.',
        checkSessionBtn: 'Check Muse session',
        connectionStatus: 'Connection status',
        cancel: 'Cancel',
        save: 'Save'
      },
      menu: {
        addNode: 'Add node',
        groups: {
          text: 'Text',
          images: 'Images',
          video: 'Video and timeline'
        },
        nodes: {
          prompt: 'Prompt',
          negativePrompt: 'Negative prompt',
          textAppend: 'Text append',
          textConcat: 'Text merge',
          textNote: 'Text note',
          imageInput: 'Image input',
          references: 'References',
          generateImage: 'Generate image',
          imageResize: 'Image resize',
          preview: 'Preview',
          generateVideo: 'Generate video',
          timeline: 'Timeline'
        },
        actions: {
          saveWorkflow: 'Save workflow',
          runWorkflow: '▶ Run workflow',
          arrangeNodes: 'Arrange nodes',
          deleteSelected: 'Delete selected node',
          disconnectAll: 'Remove all connections'
        },
        connectionPicker: {
          sendOutput: 'Send {label} · {type}',
          connectExisting: 'Connect existing node',
          createCompatible: 'Create a compatible node',
          noCompatible: 'No compatible node actions for this output.',
          timelineDockSuffix: ' (Timeline dock)'
        }
      },
      canvas: {
        handToolTitle: 'Hand tool (H) · Hold Space to pan · Alt-drag to copy · Ctrl+Z to undo · G group · T Text note',
        groupToolTitle: 'Draw a group region (G)',
        zoomOutTitle: 'Zoom out',
        zoomInTitle: 'Zoom in',
        fitTitle: 'Fit all nodes',
        addNodeMenuCaption: 'Add node'
      },
      nodes: {
        definitions: {
          prompt: { title: 'Prompt', text: 'text' },
          negativePrompt: { title: 'Negative Prompt', text: 'negative' },
          textAppend: { title: 'Text Append', inText: 'text', outText: 'text' },
          textConcat: { title: 'Text Merge', inText: 'text', outText: 'text' },
          imageInput: { title: 'Image Input', outImage: 'image' },
          references: { title: 'References', inRef: 'image {num}', outImages: 'images' },
          generateImage: { title: 'Generate Image', inPrompt: 'prompt', inNegative: 'negative', inReference: 'reference', outImage: 'image' },
          generateVideo: { title: 'Generate Video', inPrompt: 'prompt', inNegative: 'negative', inReference: 'reference', outVideo: 'video', outEndFrame: 'end frame' },
          timeline: { title: 'Timeline', inClip: 'clip {num}' },
          imageResize: { title: 'Image Resize', inImage: 'image', outImage: 'image' },
          preview: { title: 'Preview', inMedia: 'media' }
        },
        header: {
          renameNode: 'Rename node',
          renameAria: 'Rename {name}',
          deleteTitle: 'Delete'
        },
        hints: {
          negativePrompt: 'Connect to the negative input on an image or video node.',
          textAppend: 'Appends this text to an incoming prompt.',
          textConcatSeparator: 'Separator',
          textConcatJoin: 'Join connected text inputs with:',
          imageInputEmpty: 'No image selected',
          imageInputChoose: 'Choose image',
          imageInputHint: 'Connect this image to Generate Image → reference.',
          referencesConnectedBadge: '{count} image source(s) connected',
          referencesRow: '{label} · connect image source',
          referencesHint: 'All connected images are sent to every connected Generate Image and Generate Video node.',
          useContinuity: 'Use previous clip end frame as start reference',
          endFrameAlt: 'Extracted final frame for continuity',
          endFrameTitle: 'Video end frame · connect “end frame” to the next video reference',
          dragToTimeline: 'Drag output to Timeline',
          dragToTimelineTitle: 'Drag this output to the timeline',
          downloadResized: 'Download resized image',
          previewEmpty: 'Run workflow',
          previewSequence: '▶ Preview sequence',
          dropVideoHere: 'Drop video nodes here or connect them to clip inputs',
          playSec: 'Play (sec)',
          promptSourcesBadge: '{count} prompt sources combined',
          referenceImagesBadge: '{count} reference image(s) connected',
          requestedActual: 'Requested {req} · actual {actual}',
          sizeMismatchRatio: ' (Muse returned a different ratio)'
        },
        actions: {
          runImage: '▶ Run Image',
          runVideo: '▶ Run Video',
          stop: '■ Stop',
          stopTitle: 'Stop this generation',
          again: '↻ Again',
          againTitle: 'Regenerate this video with stronger adherence to the connected prompt and references'
        },
        options: {
          aspectRatio: {
            square: 'Square (1:1)',
            landscape16_9: 'Landscape 16:9',
            portrait9_16: 'Portrait 9:16',
            landscape4_3: 'Landscape 4:3',
            portrait3_4: 'Portrait 3:4'
          },
          fit: {
            cover: 'Crop to fill',
            contain: 'Fit inside',
            stretch: 'Stretch'
          }
        },
        contextMenu: {
          renameNode: 'Rename node…',
          runVideo: '▶ Run Video',
          runImage: '▶ Run Image',
          stopVideo: '■ Stop Video',
          stopImage: '■ Stop Image',
          again: '↻ Again · follow prompt more closely',
          previewSequence: '▶ Preview sequence',
          createTextMerge: 'Create Text Merge node',
          createPreview: 'Create Preview node',
          chooseImage: 'Choose / replace image',
          downloadResized: 'Download resized image',
          downloadPreview: 'Download preview',
          focusText: 'Focus text field',
          duplicateNode: 'Duplicate node',
          disconnectNode: 'Disconnect node',
          deleteNode: 'Delete node',
          removeEdge: 'Remove this wire',
          connectionTitle: 'Connection',
          deleteConnection: 'Delete connection'
        }
      },
      timeline: {
        heading: 'Timeline',
        clipCount: '{count} clips',
        arrangeHint: 'Arrange scenes · drag clips to reorder',
        importAllBtn: '＋ Import all videos',
        importAllTitle: 'Add every Generate Video node to the timeline',
        addClipBtn: '＋ Add clip',
        addClipTitle: 'Add a video output',
        previewBtn: '▶ Preview',
        previewTitle: 'Preview sequence',
        exportFormatTitle: 'Choose export format',
        exportBtn: '⇩ Export',
        exportTitle: 'Export the full stitched timeline video',
        stopExportBtn: '■ Stop',
        stopExportTitle: 'Stop timeline export',
        showTimelineTitle: 'Show timeline',
        dropZoneText: 'Drag a Generate Video node or video clip here',
        previewPanelTitle: 'Timeline Preview',
        closePreviewAria: 'Close preview',
        scenePlayback: 'Scene playback',
        allVideosOnTimeline: 'All video outputs are already on the timeline',
        noVideosAvailable: 'No video outputs available',
        importAllVideoTitle: 'Import all Generate Video nodes',
        noVideosToImport: 'No Generate Video nodes to import',
        hideTimelineTitle: 'Hide timeline',
        duration: 'Duration',
        removeClip: 'Remove clip',
        videoFallbackName: 'Video {index}'
      },
      modals: {
        confirmReplaceCanvas: 'Importing this workflow will replace the current canvas. Continue?',
        groupName: {
          titleGroup: 'Name group',
          descGroup: 'Skip to use the default name.',
          titleNode: 'Rename node',
          descNode: 'Change the label shown on this node header.',
          labelGroup: 'Name',
          labelNode: 'Node name',
          placeholderGroup: 'Group 1',
          placeholderNode: 'Node name',
          skipBtn: 'Skip',
          cancelBtn: 'Cancel',
          okBtn: 'OK'
        },
        donation: {
          title: 'Buy me a coffee',
          subtitle: 'Support MuseFlow via VietQR',
          closeAria: 'Close',
          qrFallback: 'QR preview could not be loaded. Open the VietQR image directly below.',
          openLink: 'Open VietQR in a new tab',
          bmacLink: 'Buy Me a Coffee ↗'
        },
        script: {
          title: 'Build nodes from a scene script',
          desc1: 'Paste a scene script using the Grumbo & Snowy form. MuseFlow reads each scene’s opening/ending frames, timed actions, image/video prompts, audio, shared locks and negative prompt, then connects the scene nodes and orders videos on the Timeline.',
          desc2: 'Download the strict template to fill in yourself or give to an AI. Keep the headings and field order unchanged.',
          label: 'Script',
          downloadTemplate: '⇩ Download strict template',
          cancel: 'Cancel',
          buildNodes: 'Create scene nodes',
          placeholder: 'CẢNH 1 (0:00 đến 0:10): Scene title\nKhung đầu: ...\nKhung cuối: ...\nDiễn biến: 1. 0-2s: ...\nPrompt ảnh khung đầu: ...\nPrompt video: ...\nAudio: ...'
        },
        runOrder: {
          title: 'Confirm run order',
          subtitle: 'Generation nodes will run in the order below.',
          closeAria: 'Close',
          listAria: 'Generation node order',
          note: 'Tick nodes to run; uncheck to skip. Selected node applies when running workflow.',
          cancel: 'Cancel',
          resetOrder: 'Reset to creation order',
          runNodes: '▶ Run nodes',
          typeVideo: 'Video',
          typeImage: 'Image',
          subtitleSelection: '{count}/{total} nodes selected · drag to reorder',
          runNodesCount: '▶ Run {count} nodes',
          selectNodeAria: 'Select {name} to run',
          willRun: 'Will run this node',
          willSkip: 'Skip this node',
          createdOrder: 'created #{num}',
          typeVideoUpper: 'VIDEO',
          typeImageUpper: 'IMAGE',
          skipped: 'SKIPPED',
          warningSelectAtLeastOne: 'Select at least one node to run.',
          warningMissingPrerequisites: 'Selected nodes need output from: {missing}. Select the source nodes or generate their outputs first.',
          warningCycleConflict: 'This order conflicts with dependencies between nodes. Move source generation nodes earlier.'
        }
      },
      status: {
        
        "undoStopWorkflow": "Stop the running workflow before undoing edits.",
        "nothingToUndo": "Nothing to undo.",
        "undidAction": "Undid: {label}.",
        "textNoteAdded": "Text note added to canvas.",
        "connectedTo": "Connected to {label}.",
        "createNodeFailed": "Could not create the selected node.",
        "nodeCreatedAndConnected": "{type} created and connected to {label}.",
        "incompatiblePorts": "Port types are not compatible.",
        "loopDetected": "This connection would create a workflow loop. Connect the nodes in one direction.",
        "scenesCreated": "Created {scenes} scenes · {nodes} nodes · {clips} video clips ordered on the Timeline.",
        "nodeCopyCreated": "Node copy created.",
        "dropOutputToChoose": "Drop the output on the canvas to choose a compatible node.",
        "startFromOutputPort": "Start from a compatible output port, then click this input.",
        "connectingPortClick": "Connecting {type}: click a compatible input port.",
        "connectingPortDrag": "Connecting {type}: click a compatible input or drag to one.",
        "preparingTimelineClips": "Preparing timeline clips for FFmpeg…",
        "joiningClipsFast": "Joining compatible timeline clips without re-encoding (fast, original quality)…",
        "encodingCompleteTimeline": "FFmpeg is assembling and encoding the complete timeline locally…",
        "timelineExportSuccess": "Timeline exported as MP4 ({name}).",
        "timelineExportStopped": "Timeline export stopped.",
        "recordingWebm": "Recording seamless WebM timeline video ({percent}%)…",
        "timelineExportWebmSuccess": "Timeline exported as WebM ({name}).",
        "exportCanvasFailed": "Could not create the video export canvas.",
        "browserCannotEncodeMp4": "This browser cannot encode MP4 (H.264). Choose WebM instead.",
        "videoEncodingFailed": "Video encoding failed.",
        "exportedVideoEmpty": "The exported video is empty.",
        "selectWebmSuggestion": "The browser did not produce an MP4 file. Choose WebM or use a browser with MP4 MediaRecorder support.",
        "stopRunningWorkflowFirst": "Stop the running workflow before running again.",
        "noNodesToRun": "No nodes to run in this workflow.",
        "workflowCompleted": "Workflow completed.",
        "workflowStopped": "Stopped running workflow.",
        "workflowRunningOrder": "Running workflow ({count} generation nodes)…",
        "runningNodeIndex": "Running node {index}/{total}: {title}…",
        "stopRequested": "Stop requested. Stopping generation on Muse…",
        "promptEmpty": "Prompt is empty.",
        "promptNotSubmitted": "Muse did not accept the prompt into its message box. Nothing was submitted.",
        "promptSubmissionUnconfirmed": "Muse did not confirm the prompt submission. Check the chat box and try again; MuseFlow will not resubmit automatically.",
        "sceneRefused": "Muse could not generate this scene: {detail}",
        "accountOutOfCredits": "Muse account has insufficient image credits.",
        "timeoutWaitingMedia": "Timed out waiting for a new Muse {mediaType} attachment.",
        "mediaTypeMismatch": "Muse returned a {actual} for a Generate {expected} node. Switch the Muse composer to {expected} generation, then retry.",
        "openMuseAndSignIn": "Open Muse.ai and sign in, then retry.",
        "museSessionActive": "Muse chat session is active.",
        "museNotReady": "Muse chat is not ready. Open the Muse chat page and wait for the message box to load.",
        "museNotFound": "No open Muse.ai tabs found. Open Muse and sign in, then retry.",
        "workflowCycleError": "Workflow contains a cycle. Remove the loop first.",
        "selectedNodeNotExist": "Selected generation node no longer exists.",
        "cannotLoadWorkflow": "Could not load saved workflow: {error}",
        "workflowOpenMediaFailed": "Workflow is open, but media migration failed: {error}",
        "cannotDownloadTimelineClip": "Could not download timeline clip {index} (HTTP {status}).",
        "timelineClipEmpty": "Timeline clip {index} is empty.",
        "timelineClipNoVideo": "Timeline clip {index} has no readable video stream.",
        "nextClipTimeout": "The next timeline clip did not load in time.",
        "ffmpegEmptyMp4": "FFmpeg produced an empty MP4 file.",
        "nodeCreatedConnectedGeneral": "{type} created and connected.",
        "onlyVideoToTimeline": "Only Generate Video outputs can be added to the timeline.",
        "allVideosAlreadyOnTimeline": "All Generate Video nodes are already on the timeline.",
        "noVideoNodesToImport": "No Generate Video nodes to import.",
        "importedVideoNodes": "Imported {count} video node(s) to the timeline. Run will generate videos in timeline order.",
        "connectCompletedClipsFirst": "Connect completed video clips to the timeline first.",
        "timelinePreviewComplete": "Timeline preview complete.",
        "timelineClipReadyPressPlay": "Timeline clip is ready; press Play to continue ({error})",
        "timelineShotProgress": "Timeline shot {index}/{total}",
        "encodingMp4Progress": "Encoding MP4 with FFmpeg · {percent}%",
        "loadingFfmpegEngine": "Loading the local FFmpeg video engine…",
        "loadingClipToFfmpeg": "Loading timeline clip {index}/{total} into local FFmpeg…",
        "addCompletedVideosBeforeExport": "Add completed video clips to the Timeline before exporting.",
        "ffmpegEngineLoadFailed": "The bundled FFmpeg engine could not be loaded. Reload the extension and try again.",
        "cannotExportStitchedVideo": "This browser cannot export a stitched video from the Timeline.",
        "preparingClipForExport": "Preparing timeline clip {index}/{total} for export…",
        "exportingClipInOrder": "Exporting timeline clip {index}/{total} in track order…",
        "stitchedExportSuccess": "Stitched timeline exported as {format}.",
        "stoppingExport": "Stopping timeline export…",
        "groupTooSmall": "Group region is too small. Drag a larger area to create it.",
        "nodeNameEmpty": "Node name cannot be empty.",
        "groupNameEmpty": "Group name cannot be empty.",
        "groupCreatedAroundNodes": "Group region created around {count} node(s).",
        "groupToolActive": "Group tool active: drag across the canvas to mark a group region. Press G or Escape to cancel.",
        "nodeRenamed": "Node renamed.",
        "textMergeCreatedConnected": "Text Merge created and connected to this text output.",
        "nodeConnectionsRemoved": "Node connections removed.",
        "noOutputToDownload": "This node has no output to download.",
        "nodeDuplicated": "Node duplicated.",
        "nodesArranged": "Nodes arranged by workflow order.",
        "connectionDeleted": "Connection deleted.",
        "selectNodesFirst": "Select one or more nodes first.",
        "allConnectionsRemoved": "All connections removed.",
        "stoppedGenerationId": "Stopped {type} generation: {id}",
        "regeneratingAgain": "Regenerating video with stronger prompt adherence…",
        "runningSelectedNode": "Running selected generation node…",
        "runningWorkflow": "Running workflow...",
        "imageResizeWaiting": "Image Resize is waiting for an input image.",
        "generationStepProgress": "{label} · generating {type}: {id}",
        "retryingSceneSafeAlt": "Muse could not create {scene}; retrying once with a close, safe alternative…",
        "nodeGenerationCompleted": "Node generation completed.",
        "generationCompletedSaveFailed": "Generation completed, but workflow could not be saved: {error}",
        "museConnectionFailed": "Muse connection failed. Reload MuseFlow {version}, then check the Muse session.",
        "autoSaveFailed": "Auto-save failed: {error}",
        "saved": "Saved.",
        "workflowSavedWithMedia": "Workflow saved with media included.",
        "workflowSavedExternalUrls": "Workflow saved; {count} media URL(s) could not be embedded and may require the original Muse session.",
        "cannotSaveWorkflowFile": "Could not save workflow file: {error}",
        "stopWorkflowBeforeImport": "Stop the running workflow before importing another one.",
        "cannotImportWorkflow": "Could not import workflow: {error}",
        "workflowImported": "Workflow imported: {name}",
        "selectedConnectionsDeleted": "Selected connections deleted.",
        "selectedNodeLabel": "Selected node",
        "generationStepLabel": "Generation {step}/{total}",
        "thisScene": "this scene",
        "cannotSaveWorkflow": "Could not save workflow: {error}",
        "timelineExportMp4Success": "Timeline exported as MP4 (H.264) with local FFmpeg."
      }
    }
  };

  /**
   * Danh sách các hàm lắng nghe sự kiện thay đổi ngôn ngữ.
   * @type {Array<function(string): void>}
   */
  const listeners = [];

  /**
   * Ngôn ngữ hợp lệ được hỗ trợ.
   */
  const SUPPORTED_LANGS = ['vi', 'en'];
  const DEFAULT_LANG = 'vi';

  /**
   * Xác định ngôn ngữ ban đầu.
   * Ưu tiên 1: Lựa chọn hợp lệ đã lưu trong localStorage.
   * Ưu tiên 2: Mặc định là 'vi' (Tiếng Việt).
   * @returns {string} Mã ngôn ngữ ('vi' hoặc 'en').
   */
  function detectInitialLanguage() {
    try {
      const saved = localStorage.getItem('museflow_lang');
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }
    } catch {
      // localStorage có thể bị chặn trong môi trường sandbox
    }
    return DEFAULT_LANG;
  }

  let currentLang = detectInitialLanguage();

  /**
   * Tra cứu bản dịch theo khóa (hỗ trợ dạng lồng nhau 'toolbar.save') và nội suy tham số.
   *
   * @param {string} key - Khóa bản dịch (ví dụ: 'toolbar.save', 'statusbar.museConnected').
   * @param {Object} [params] - Đối tượng chứa tham số nội suy (ví dụ: { version: '0.5.2' }).
   * @returns {string} Chuỗi văn bản đã được dịch hoặc fallback.
   */
  function t(key, params) {
    if (!key || typeof key !== 'string') return '';

    const getNested = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

    // 1. Tìm trong ngôn ngữ hiện tại
    let text = getNested(translations[currentLang], key);

    // 2. Fallback sang tiếng Anh nếu ngôn ngữ hiện tại bị thiếu
    if (text === undefined || text === null) {
      text = getNested(translations.en, key);
    }

    // 3. Fallback về chính khóa nếu cả 2 đều không có
    if (text === undefined || text === null) {
      return key;
    }

    // 4. Nội suy tham số dạng {paramName}
    if (params && typeof params === 'object') {
      text = String(text).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, paramName) => {
        return params[paramName] !== undefined ? String(params[paramName]) : match;
      });
    }

    return String(text);
  }

  /**
   * Cập nhật toàn bộ các phần tử DOM mang thuộc tính data-i18n.
   *
   * @param {Document|HTMLElement} [root=document] - Phần tử gốc cần quét.
   */
  function applyToDOM(root = document) {
    if (!root || !root.querySelectorAll) return;

    // Cập nhật text content
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    // Cập nhật thuộc tính title
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.title = t(key);
    });

    // Cập nhật placeholder
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = t(key);
    });

    // Cập nhật aria-label
    root.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });

    // Cập nhật thuộc tính lang của document
    if (document.documentElement) {
      document.documentElement.lang = currentLang;
    }
  }

  /**
   * Thay đổi ngôn ngữ hiện hành của ứng dụng và thông báo cho các component liên quan.
   *
   * @param {string} lang - Mã ngôn ngữ mới ('vi' hoặc 'en').
   * @param {Object} [options] - Tùy chọn.
   * @param {boolean} [options.syncStorage=true] - Có ghi vào localStorage và chrome.storage không.
   */
  function setLanguage(lang, { syncStorage = true } = {}) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;

    currentLang = lang;

    if (syncStorage) {
      try {
        localStorage.setItem('museflow_lang', lang);
      } catch {}

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ museflow_lang: lang });
      }
    }

    // Cập nhật DOM tĩnh
    applyToDOM();

    // Đồng bộ lại giá trị của các dropdown chọn ngôn ngữ trên giao diện
    const selectors = document.querySelectorAll('#langSelect, #modalLangSelect');
    selectors.forEach(sel => {
      if (sel && sel.value !== currentLang) {
        sel.value = currentLang;
      }
    });

    // Kích hoạt các hàm callback đăng ký
    listeners.forEach(fn => {
      try { fn(currentLang); } catch (e) { console.error('i18n listener error:', e); }
    });

    // Phát sự kiện toàn cục trên window nếu có hỗ trợ
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent('museflow:languageChange', { detail: { lang: currentLang } }));
      } catch {}
    }
  }

  /**
   * Đăng ký hàm lắng nghe sự kiện thay đổi ngôn ngữ.
   *
   * @param {function(string): void} fn - Hàm callback nhận mã ngôn ngữ mới.
   * @returns {function(): void} Hàm hủy đăng ký.
   */
  function onLanguageChange(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    }
    return () => {};
  }

  /**
   * Lấy mã ngôn ngữ hiện hành.
   * @returns {string} 'vi' hoặc 'en'.
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Khởi tạo i18n khi tải trang.
   */
  function init() {
    // Đặt thuộc tính lang trên thẻ <html> ngay lập tức
    if (document.documentElement) {
      document.documentElement.lang = currentLang;
    }

    // Đồng bộ từ chrome.storage.local nếu có cấu hình bất đồng bộ
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get('museflow_lang', (res) => {
        if (res && res.museflow_lang && SUPPORTED_LANGS.includes(res.museflow_lang)) {
          if (res.museflow_lang !== currentLang) {
            setLanguage(res.museflow_lang, { syncStorage: false });
          }
        }
      });

      // Lắng nghe thay đổi từ các tab/window khác
      chrome.storage.onChanged?.addListener((changes, area) => {
        if (area === 'local' && changes.museflow_lang) {
          const newLang = changes.museflow_lang.newValue;
          if (newLang && SUPPORTED_LANGS.includes(newLang) && newLang !== currentLang) {
            setLanguage(newLang, { syncStorage: false });
          }
        }
      });
    }

    // Quét DOM ngay khi tài liệu sẵn sàng
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => applyToDOM());
    } else {
      applyToDOM();
    }
  }

  // Khởi tạo ngay lập tức
  init();

  // Xuất ra phạm vi toàn cục
  window.i18n = {
    t,
    setLanguage,
    getLanguage,
    onLanguageChange,
    applyToDOM,
    translations,
    SUPPORTED_LANGS,
    DEFAULT_LANG
  };
  window.t = t;

})();
