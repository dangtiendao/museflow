/**
 * @file muse-bridge.js - Content Script cầu nối giao tiếp với trang Muse.ai.
 * @description Tự động hóa việc tương tác trực tiếp với giao diện chat của Muse.ai trong cùng phiên đăng nhập trình duyệt.
 *              Đảm nhiệm: kiểm tra phiên đăng nhập, điền prompt, đính kèm ảnh tham chiếu (reference images),
 *              gửi lệnh tạo, giám sát DOM để phát hiện kết quả ảnh/video, kiểm tra tỷ lệ khung hình,
 *              bắt các trường hợp bị từ chối (refusal/safety) hoặc hết credit, và hỗ trợ hủy tác vụ.
 * @module MuseBridge
 * @version 0.5.2
 */

(() => {
  // Ngăn chặn việc nạp trùng lặp script cầu nối vào cùng một trang
  if (window.__museFlowBridgeInstalled) return;
  window.__museFlowBridgeInstalled = true;

  /**
   * Lắng nghe các thông điệp (messages) từ extension gửi đến content script.
   * Hỗ trợ các hành động: kiểm tra phiên làm việc, bắt đầu tạo media và dừng tác vụ.
   */
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    // Kiểm tra trạng thái phiên làm việc và khả năng sẵn sàng của chat Muse.ai
    if (message?.type === 'MUSEFLOW_CHECK_SESSION') {
      checkSession().then(sendResponse);
      return true; // Giữ kênh phản hồi bất đồng bộ mở
    }
    // Thực hiện tác vụ sinh ảnh hoặc video theo yêu cầu từ canvas
    if (message?.type === 'MUSEFLOW_GENERATE') {
      const controller = new AbortController();
      activeGenerations.set(message.requestId, controller);
      generate(message, controller.signal)
        .then(sendResponse, error => sendResponse({ ok: false, code: error.code || 'MUSE_ERROR', error: error.message || String(error) }))
        .finally(() => activeGenerations.delete(message.requestId));
      return true;
    }
    // Yêu cầu dừng tác vụ sinh nội dung đang chạy
    if (message?.type === 'MUSEFLOW_STOP_GENERATION') {
      const stopped = message.requestId ? abortGeneration(message.requestId) : [...activeGenerations.keys()].some(id => abortGeneration(id));
      sendResponse({ ok: true, stopped });
      return false;
    }
  });

  /**
   * Tìm phần tử textarea nhập liệu của hộp thoại chat Muse (composer).
   * Ưu tiên tìm textarea đang hiển thị, không bị disabled và có placeholder phù hợp.
   *
   * @returns {HTMLTextAreaElement|null} Phần tử textarea của composer hoặc null nếu không tìm thấy.
   */
  function findComposer() {
    const candidates = [...document.querySelectorAll('textarea')].filter(el => visible(el) && !el.disabled);
    return candidates.find(el => /message|消息/i.test(el.getAttribute('placeholder') || '')) || candidates[0] || null;
  }

  /**
   * Kiểm tra xem một phần tử DOM có thực sự hiển thị trên màn hình người dùng hay không.
   *
   * @param {Element|null} el - Phần tử DOM cần kiểm tra.
   * @returns {boolean} True nếu phần tử hiển thị và có diện tích hiển thị (getClientRects > 0).
   */
  function visible(el) { return Boolean(el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden'); }

  /**
   * Tạo độ trễ bất đồng bộ (sleep), có hỗ trợ ngắt sớm thông qua AbortSignal.
   *
   * @param {number} ms - Thời gian chờ (mili-giây).
   * @param {AbortSignal} [signal] - Tín hiệu ngắt để hủy thời gian chờ trước hạn.
   * @returns {Promise<void>}
   * @throws {DOMException} Ném ngoại lệ 'AbortError' nếu bị ngắt bởi tín hiệu signal.
   */
  const delay = (ms, signal) => new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Generation stopped by user.', 'AbortError')); return; }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', cancel); resolve(); }, ms);
    const cancel = () => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(new DOMException('Generation stopped by user.', 'AbortError')); };
    signal?.addEventListener('abort', cancel, { once: true });
  });

  /** Bộ chọn CSS định vị các phần tử tệp đính kèm (media presentation) trên giao diện Muse chat */
  const attachmentSelector = '[data-testid^="hatch-chat-attachment-presentation-"]';
  /** Bảng ánh xạ theo dõi các bộ điều khiển hủy bỏ (AbortController) theo mã định danh yêu cầu (requestId) */
  const activeGenerations = new Map();

  /**
   * Tìm và nhấp vào nút "Stop" trên giao diện của Muse nếu quá trình tạo đang diễn ra.
   *
   * @returns {boolean} True nếu tìm thấy và đã kích hoạt nút Stop thành công.
   */
  function clickMuseStop() {
    const button = [...document.querySelectorAll('[data-testid="hatch-composer-stop-button"],button[aria-label*="Stop" i],button[aria-label*="停止"]')].find(visible);
    if (button) { button.click(); return true; }
    return false;
  }

  /**
   * Hủy bỏ một tác vụ sinh nội dung cụ thể theo requestId và dừng trên giao diện Muse.
   *
   * @param {string} requestId - Mã định danh của yêu cầu cần hủy.
   * @returns {boolean} True nếu yêu cầu đã được tìm thấy và hủy.
   */
  function abortGeneration(requestId) {
    const controller = activeGenerations.get(requestId);
    if (!controller) return false;
    controller.abort();
    clickMuseStop();
    return true;
  }

  /**
   * Kiểm tra tính sẵn sàng của phiên làm việc trên tab Muse.ai.
   * Xác định xem người dùng đã đăng nhập chưa và khung chat có thể nhận lệnh không.
   *
   * @returns {Promise<{ok: boolean, signedIn: boolean, title: string, composer: boolean, loginRequired: boolean, url: string}>}
   */
  async function checkSession() {
    await waitHydrated(5000);
    const composer = findComposer();
    const ready = Boolean(composer && visible(composer) && !composer.disabled && !composer.readOnly);
    // Nhận diện trạng thái yêu cầu đăng nhập qua sự hiện diện của password input hoặc từ khóa đăng nhập
    const loginRequired = Boolean(document.querySelector('input[type="password"],button[type="submit"]')) && /sign in|log in|登录/i.test(document.body?.innerText || '');
    return { ok: true, signedIn: ready && !loginRequired, title: document.title, composer: ready, loginRequired, url: location.href };
  }

  /**
   * Chờ đợi trang Muse.ai hoàn tất quá trình client-side hydration và composer sẵn sàng.
   *
   * @param {number} timeout - Thời gian tối đa chờ đợi (mili-giây).
   * @param {AbortSignal} [signal] - Tín hiệu ngắt để dừng chờ.
   * @returns {Promise<void>}
   * @throws {Error|DOMException} Ném lỗi nếu hết hạn chờ mà composer chưa sẵn sàng hoặc bị hủy.
   */
  async function waitHydrated(timeout, signal) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const hydration = document.querySelector('[data-hatch-shell-hydration-state]');
      if (document.readyState === 'complete' && findComposer() && (!hydration || hydration.getAttribute('data-hatch-shell-hydration-state') === 'hydrated')) return;
      if (signal?.aborted) throw new DOMException('Generation stopped by user.', 'AbortError');
      await delay(120, signal);
    }
    if (!findComposer()) throw new Error('Muse chat is not ready. Open the Muse chat page and wait for the message box to load.');
  }

  /**
   * Thu thập danh sách tất cả các phần tử đính kèm media (ảnh/video) hợp lệ trong khung chat Muse.
   * Loại trừ các bong bóng tin nhắn của chính người dùng và khung soạn thảo.
   *
   * @returns {Array<{el: Element, tid: string, src: string, videoUrl: string, isVideo: boolean, width: number, height: number}>}
   */
  function attachments() {
    return [...document.querySelectorAll(attachmentSelector)].filter(el => !el.closest('form,[class*="chat-user-bubble"],[class*="group/msg"]') && !el.closest('[data-testid="hatch-composer-placeholder-overlay"]')).map(el => {
      const tid = el.getAttribute('data-testid') || '', video = el.querySelector('video'), image = el.querySelector('img');
      const urls = [...el.querySelectorAll('a[href],video source[src],source[src],[data-video-src],[data-download-url]')].map(item => ({ url: item.href || item.src || item.getAttribute('data-video-src') || item.getAttribute('data-download-url') || '', download: item.getAttribute('download') || '', type: item.getAttribute('type') || '' })).filter(item => item.url);
      const videoLink = urls.find(item => /video\//i.test(item.type) || /\.(?:mp4|webm|mov|m4v)(?:$|[?#])/i.test(item.url) || /\.(?:mp4|webm|mov|m4v)$/i.test(item.download))?.url || '';
      const videoUrl = video?.currentSrc || video?.src || videoLink || '';
      const media = video || image;
      return { el, tid, src: videoUrl || media?.currentSrc || media?.src || '', videoUrl, isVideo: Boolean(videoUrl) || video instanceof HTMLVideoElement || /video/i.test(tid), width: video?.videoWidth || image?.naturalWidth || 0, height: video?.videoHeight || image?.naturalHeight || 0 };
    }).filter(a => a.src);
  }

  /**
   * Lắng nghe sự thay đổi của cây DOM bằng MutationObserver cho đến khi có thay đổi liên quan đến media hoặc hết hạn.
   *
   * @param {number} timeoutMs - Thời gian chờ tối đa (mili-giây).
   * @param {AbortSignal} [signal] - Tín hiệu ngắt tác vụ.
   * @returns {Promise<void>}
   */
  function waitForAttachmentChange(timeoutMs, signal) {
    return new Promise(resolve => {
      let timer;
      const observer = new MutationObserver(() => finish());
      const finish = () => { observer.disconnect(); clearTimeout(timer); signal?.removeEventListener('abort', finish); resolve(); };
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'poster', 'href', 'download', 'type', 'data-testid', 'data-video-src', 'data-download-url'] });
      timer = setTimeout(finish, timeoutMs);
      signal?.addEventListener('abort', finish, { once: true });
    });
  }

  /**
   * Lấy danh sách các phần tử chứa tin nhắn phản hồi của trợ lý AI (Muse assistant).
   *
   * @returns {Element[]} Mảng các phần tử DOM tin nhắn trợ lý đang hiển thị.
   */
  function assistantMessageElements() {
    return [...document.querySelectorAll('div[class*="hatch-chat-groupable-bubble"],[data-message-author-role="assistant"],[data-testid*="assistant" i],[data-testid*="message-content" i],[class*="assistant-message" i],[class*="assistant-bubble" i]')].filter(el => visible(el) && !el.closest('[class*="chat-user-bubble"],[data-message-author-role="user"],[data-testid*="user-message" i]'));
  }

  /**
   * Đọc phần văn bản tin nhắn mới nhất mà trợ lý Muse phản hồi (so với trước khi gửi lệnh).
   * Dùng để phát hiện các thông báo lỗi, từ chối hoặc hướng dẫn sửa kịch bản.
   *
   * @param {Map<Element, string>} previousBubbleTexts - Bản đồ ghi nhớ nội dung text trước khi gửi prompt.
   * @returns {string} Chuỗi văn bản mới nhất (cắt tối đa 6000 ký tự cuối).
   */
  function readNewAssistantContext(previousBubbleTexts) {
    const bubbles = assistantMessageElements();
    // Muse wraps assistant replies in group containers too; excluding every group/msg
    // ancestor accidentally filtered out the refusal text that should trigger retry.
    const messages = bubbles.map(el => ({ el, text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() })).filter(item => item.text && item.text !== previousBubbleTexts.get(item.el));
    return messages.map(item => item.text).join('\n').slice(-6000);
  }

  /**
   * Phân tích văn bản phản hồi của Muse để xác định có phải lời từ chối tạo cảnh (Refusal/Policy Violation) hay không.
   * Hỗ trợ cả thông điệp tiếng Anh và các thông điệp cảnh báo/từ chối tiếng Việt.
   *
   * @param {string} context - Nội dung phản hồi từ trợ lý Muse.
   * @returns {boolean} True nếu phát hiện dấu hiệu từ chối nội dung.
   */
  function isRefusalContext(context) {
    const text = String(context || '');
    const explicit = /(?:i|we)\s+(?:am\s+)?sorry[\s\S]{0,180}(?:cannot|can't|unable|won't)|(?:cannot|can't|couldn't|unable to|not able to)\s+(?:help|assist|create|generate|make|produce|fulfill|complete|comply)|(?:request|prompt).{0,100}(?:violat|disallowed|restricted|not allowed)|(?:policy|safety).{0,100}(?:prevent|restrict|unable)|generation (?:was )?(?:declined|blocked)|content (?:is )?not allowed|i can't comply/i;
    const inability = /(?:không tạo được|không thể tạo|chưa thể tạo|không thực hiện được|vẫn không tạo được|không làm được)/i;
    const sceneContext = /(?:cảnh|bản|đoạn|video|ảnh|nội dung|yêu cầu|này)/i;
    const offerAlternative = /(?:bản|phiên bản|phương án)\s+tương\s+đương|tương\s+đương.{0,100}(?:bám|theo|kịch bản)|muốn.{0,100}(?:tạo mới|thử lại|làm lại)|(?:would you like|do you want|want me to).{0,100}(?:create|make|generate|try)|equivalent alternative/i;
    return explicit.test(text) || inability.test(text) && (sceneContext.test(text) || offerAlternative.test(text));
  }

  /**
   * Quy trình tạo ảnh hoặc video tự động trên trang Muse.ai:
   * 1. Đính kèm ảnh tham chiếu (nếu có).
   * 2. Gán prompt vào textarea thông qua descriptor setter (kích hoạt React synthetic events).
   * 3. Nhấp nút Send hoặc submit form/nhấn Enter.
   * 4. Giám sát DOM chờ attachment mới, kiểm tra tỷ lệ khung hình, bắt lỗi từ chối/hết quota.
   * 5. Trích xuất URL media (chuyển sang base64 data URL với ảnh).
   *
   * @param {Object} options - Các thông số cấu hình tác vụ.
   * @param {string} options.prompt - Nội dung prompt gửi cho Muse.
   * @param {number} [options.timeoutSec=600] - Thời gian chờ tối đa (giây).
   * @param {'image'|'video'} [options.mediaType='image'] - Loại media cần tạo.
   * @param {string} [options.referenceImage] - URL ảnh tham chiếu đơn.
   * @param {string[]} [options.referenceImages] - Mảng URL các ảnh tham chiếu.
   * @param {string} [options.size='1:1'] - Tỷ lệ khung hình mong muốn ('1:1', '16:9', '9:16', ...).
   * @param {string} options.requestId - Mã định danh yêu cầu.
   * @param {AbortSignal} signal - Tín hiệu ngắt để hủy tác vụ.
   * @returns {Promise<{ok: boolean, url: string, error?: string}>} Kết quả tạo media kèm URL.
   * @throws {Error|DOMException} Ném ngoại lệ khi có lỗi trong quá trình tạo hoặc bị hủy.
   */
  async function generate({ prompt, timeoutSec = 600, mediaType = 'image', referenceImage = '', referenceImages = [], size = '1:1', requestId }, signal) {
    const throwIfAborted = () => { if (signal?.aborted) throw new DOMException('Generation stopped by user.', 'AbortError'); };
    throwIfAborted();
    if (!String(prompt || '').trim()) throw new Error('Prompt is empty.');
    await waitHydrated(15000, signal);
    throwIfAborted();
    const composer = findComposer();
    if (!visible(composer)) throw new Error('Muse message box is not visible. Open the chat composer and retry.');
    const referenceList = Array.isArray(referenceImages) && referenceImages.length ? referenceImages : referenceImage ? [referenceImage] : [];
    if (referenceList.length) await attachReferences(referenceList, signal);
    throwIfAborted();

    // Ghi nhận baseline các attachments hiện có để chỉ nhận diện attachment sinh ra sau thời điểm này
    const baseline = new Set(attachments().map(a => a.src));
    const priorBubbleTexts = new Map(assistantMessageElements().map(el => [el, (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim()]));
    composer.scrollIntoView({ block: 'center' });
    composer.focus();

    // Dùng native setter của HTMLTextAreaElement để vượt qua các can thiệp trạng thái ảo của React
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    if (!setter) throw new Error('Muse message box is unsupported.');
    setter.call(composer, String(prompt));
    composer.dispatchEvent(new Event('input', { bubbles: true }));
    composer.dispatchEvent(new Event('change', { bubbles: true }));

    // Tìm kiếm nút Send trên giao diện
    let sendButton = null;
    for (let i = 0; i < 30; i++) {
      throwIfAborted();
      sendButton = [...document.querySelectorAll('button,[role="button"]')].filter(visible).find(b => /send|发送/i.test(`${b.getAttribute('aria-label') || ''} ${b.getAttribute('data-testid') || ''} ${b.innerText || ''}`));
      if (sendButton && !sendButton.disabled) break;
      await delay(100, signal);
    }
    if (!composer.value.trim()) throw new Error('Muse did not accept the prompt into its message box. Nothing was submitted.');
    const bubbleCount = () => document.querySelectorAll('div[class*="hatch-chat-groupable-bubble"]').length;
    const beforeSendCount = bubbleCount();
    let submitted = false;
    throwIfAborted();

    if (sendButton && !sendButton.disabled) { sendButton.click(); submitted = true; }
    else {
      // Match M2A's keyboard fallback: submit once only when Muse exposes no active Send button.
      const form = composer.closest('form');
      if (form && typeof form.requestSubmit === 'function') { form.requestSubmit(); submitted = true; }
      else {
        composer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        composer.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
        submitted = true;
      }
    }

    // Chờ xác nhận prompt đã được Muse chấp nhận (composer xóa rỗng, xuất hiện bong bóng mới hoặc nút Stop)
    let accepted = false;
    for (let i = 0; i < 30; i++) {
      throwIfAborted();
      if (!composer.isConnected || !composer.value.trim() || bubbleCount() > beforeSendCount || document.querySelector('[data-testid="hatch-composer-stop-button"],button[aria-label*="Stop" i],button[aria-label*="停止"]')) { accepted = true; break; }
      await delay(100, signal);
    }
    if (!submitted || !accepted) throw new Error('Muse did not confirm the prompt submission. Check the chat box and try again; MuseFlow will not resubmit automatically.');

    const deadline = Date.now() + Math.min(900, Math.max(30, Number(timeoutSec) || 600)) * 1000;
    let lastProgress = Date.now(), firstWrongRatioAt = 0, wrongMediaSince = 0;
    let refusalContext = '', refusalContextSince = 0;

    // Vòng lặp chờ media kết quả xuất hiện trên DOM
    while (Date.now() < deadline) {
      throwIfAborted();
      const fresh = attachments().filter(a => !baseline.has(a.src));
      const matching = fresh.filter(a => mediaType === 'video' ? a.isVideo : !a.isVideo);
      const wrongMedia = fresh.find(a => mediaType === 'image' ? a.isVideo : !a.isVideo);

      // Phát hiện trả về sai loại media (ví dụ node tạo ảnh nhưng Muse lại trả về video)
      if (wrongMedia) {
        if (!wrongMediaSince) wrongMediaSince = Date.now();
        if (Date.now() - wrongMediaSince >= 1800) {
          const expected = mediaType === 'image' ? 'image' : 'video', actual = mediaType === 'image' ? 'video' : 'image';
          const error = new Error(`Muse returned a ${actual} for a Generate ${expected === 'image' ? 'Image' : 'Video'} node. Switch the Muse composer to ${expected} generation, then retry.`);
          error.code = 'MEDIA_TYPE_MISMATCH';
          throw error;
        }
      } else wrongMediaSince = 0;

      // Tính toán độ lệch tỷ lệ khung hình theo log-ratio score để chọn kết quả chính xác nhất
      const [ratioW, ratioH] = String(size || '1:1').split(':').map(Number), expectedRatio = ratioW > 0 && ratioH > 0 ? ratioW / ratioH : 1;
      const measured = matching.filter(a => a.width > 0 && a.height > 0).sort((a, b) => {
        const scoreA = Math.abs(Math.log((a.width / a.height) / expectedRatio)), scoreB = Math.abs(Math.log((b.width / b.height) / expectedRatio));
        if (Math.abs(scoreA - scoreB) > .015) return scoreA - scoreB;
        return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1;
      });
      const best = measured[0], bestRatioError = best ? Math.abs(Math.log((best.width / best.height) / expectedRatio)) : Infinity;
      if (best && bestRatioError <= .09) firstWrongRatioAt = 0;
      else if (best && !firstWrongRatioAt) firstWrongRatioAt = Date.now();
      const result = best && (bestRatioError <= .09 || Date.now() - firstWrongRatioAt >= 3500) ? best : null;

      if (result) {
        const media = mediaType === 'video' ? (result.el.querySelector('video') || null) : (result.el.querySelector('img') || null);
        const src = mediaType === 'video' ? (result.videoUrl || media?.currentSrc || media?.src || '') : (media?.currentSrc || media?.src || '');
        // Muse may first render a poster and attach the playable/download URL after
        // hydration. Keep waiting for that URL instead of rejecting a completed clip.
        if (!src) { firstWrongRatioAt = firstWrongRatioAt || Date.now(); await waitForAttachmentChange(Math.min(500, deadline - Date.now()), signal); continue; }
        if (mediaType === 'video' && !src.startsWith('blob:') && !src.startsWith('data:')) return { ok: true, url: src };
        if (src.startsWith('data:')) return { ok: true, url: src };
        try {
          // Sao chép nội dung media về dạng data URL cục bộ để đảm bảo an toàn truy cập
          const response = await fetch(src, { credentials: 'include' });
          if (!response.ok) throw new Error(`${mediaType} download returned HTTP ${response.status}.`);
          const blob = await response.blob();
          return { ok: true, url: await blobToDataUrl(blob) };
        } catch (error) { return { ok: true, url: src, error: `New ${mediaType} detected but could not be copied locally: ${error.message}` }; }
      }

      // Giám sát trạng thái từ chối từ Muse AI
      const stop = Boolean(document.querySelector('[data-testid="hatch-composer-stop-button"],button[aria-label*="Stop" i],button[aria-label*="停止"]'));
      const currentContext = readNewAssistantContext(priorBubbleTexts), refusal = isRefusalContext(currentContext);
      if (refusal) {
        if (currentContext !== refusalContext) { refusalContext = currentContext; refusalContextSince = Date.now(); }
        const clearRefusal = inability.test(currentContext) && sceneContext.test(currentContext) && offerAlternative.test(currentContext);
        if (clearRefusal || Date.now() - refusalContextSince >= 1200) {
          if (stop) clickMuseStop();
          const error = new Error(`Muse could not generate this scene: ${currentContext.slice(-700)}`);
          error.code = 'SCENE_REFUSED';
          throw error;
        }
      } else { refusalContext = ''; refusalContextSince = 0; }

      // Kiểm tra thông báo hết credit tài khoản
      if (!stop && Date.now() - lastProgress > 5000) {
        const tail = (document.body?.innerText || '').slice(-800);
        if (/out of credits|insufficient credits|额度不足|积分不足/i.test(tail)) throw new Error('Muse account has insufficient image credits.');
      }
      await waitForAttachmentChange(Math.min(500, deadline - Date.now()), signal);
    }
    throwIfAborted();
    throw new Error(`Timed out waiting for a new Muse ${mediaType} attachment. Prompt was submitted once; it was not resubmitted.`);
  }

  /**
   * Tải và đính kèm danh sách ảnh tham chiếu (reference images) vào ô nhập chat của Muse.
   * Sử dụng DataTransfer API kết hợp với native input files setter.
   *
   * @param {Array<string|{url: string}>} references - Danh sách URL hoặc đối tượng ảnh tham chiếu.
   * @param {AbortSignal} [signal] - Tín hiệu ngắt tác vụ.
   * @returns {Promise<void>}
   * @throws {Error|DOMException} Ném ngoại lệ nếu không thể tải ảnh hoặc không tìm thấy ô đính kèm.
   */
  async function attachReferences(references, signal) {
    const files = await Promise.all(references.map(async (reference, index) => {
      const url = typeof reference === 'string' ? reference : reference?.url;
      if (!url) throw new Error(`Reference image ${index + 1} has no URL.`);
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error(`Could not load reference image ${index + 1} (${response.status}).`);
      const blob = await response.blob();
      if (!blob.type.startsWith('image/') || !blob.size) throw new Error(`Reference ${index + 1} is not a readable image.`);
      const extension = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg').replace(/[^a-z0-9]/gi, '') || 'png';
      return new File([blob], `museflow-reference-${String(index + 1).padStart(2, '0')}.${extension}`, { type: blob.type });
    }));

    const composer = findComposer();
    let composerRoot = composer.closest('form') || composer.parentElement;
    for (let i = 0; i < 8 && composerRoot?.parentElement; i++) {
      if (composerRoot.querySelector('input[type="file"]')) break;
      composerRoot = composerRoot.parentElement;
    }

    const acceptsImage = input => {
      const accept = (input.accept || '').toLowerCase();
      return !accept || accept.includes('image') || accept.includes('*/*') || /\.(png|jpe?g|webp|gif|bmp|avif)/.test(accept);
    };

    const findInput = () => {
      const all = [...document.querySelectorAll('input[type="file"]')].filter(input => !input.disabled && acceptsImage(input));
      const isImageInput = input => /image|\.png|\.jpe?g|\.webp|\.gif|\.avif/i.test(input.accept || '');
      return all.find(input => composerRoot?.contains(input) && isImageInput(input)) ||
        all.find(input => composerRoot?.contains(input)) ||
        all.find(isImageInput) || null;
    };

    let input = findInput();
    if (!input) {
      const roots = [composerRoot, composer.closest('form'), composer.parentElement].filter(Boolean);
      const uploadButton = roots.flatMap(root => [...root.querySelectorAll('button,[role="button"],label')]).filter(visible).find(el => /attach|upload|image|photo|file|đính kèm|tải lên/i.test(`${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''} ${el.innerText || ''}`));
      if (uploadButton) { uploadButton.click(); await delay(250, signal); input = findInput(); }
    }
    if (!input) throw new Error('Muse image upload control was not found near the chat composer; the prompt was not submitted.');

    const previewSelector = 'img,[role="img"],[data-testid*="attachment" i],[data-testid*="upload" i],[class*="attachment" i],[class*="upload" i]';
    const previewElements = () => [...document.querySelectorAll(previewSelector)].filter(visible);
    const previewKey = el => {
      const src = el.matches('img') ? (el.currentSrc || el.src || '') : /url\(["']?(blob:|data:image\/|https?:)[^)]*\)/i.exec(getComputedStyle(el).backgroundImage)?.[0] || '';
      return `${src}|${el.getAttribute('data-testid') || ''}|${el.getAttribute('class') || ''}|${el.getAttribute('aria-label') || ''}|${el.getAttribute('title') || ''}`;
    };

    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files')?.set;
    if (!setter) throw new Error('Browser does not allow setting the Muse attachment input.');

    /**
     * Tải lên một lô tệp (batch) vào input file và xác thực hiển thị preview.
     *
     * @param {File[]} batch - Danh sách File cần nạp.
     * @returns {Promise<void>}
     */
    const uploadBatch = async (batch) => {
      const previousPreviews = new Set(previewElements().map(previewKey));
      const transfer = new DataTransfer();
      batch.forEach(file => transfer.items.add(file));
      if (batch.length > 1) input.multiple = true;
      setter.call(input, transfer.files);
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      const started = Date.now(), deadline = started + 8000;
      const accepted = () => batch.every(file => [...(input.files || [])].some(item => item.name === file.name && item.size === file.size && item.type === file.type));
      const previewSeen = () => previewElements().some(el => {
        const key = previewKey(el), src = el.matches('img') ? (el.currentSrc || el.src || '') : key.split('|', 1)[0];
        return !previousPreviews.has(key) && Boolean(src);
      });
      while (Date.now() < deadline) {
        if (signal?.aborted) throw new DOMException('Generation stopped by user.', 'AbortError');
        if (previewSeen() || accepted() && Date.now() - started > 1000) return;
        await delay(160, signal);
      }
      throw new Error(`Muse did not confirm ${batch.length} reference image${batch.length === 1 ? '' : 's'} in the chat composer (upload input accepts: ${input.accept || 'any file'}); the prompt was not submitted.`);
    };

    // Nếu input không hỗ trợ nhiều tệp cùng lúc thì tải tuần tự từng ảnh
    if (files.length > 1 && !input.multiple) {
      for (const file of files) await uploadBatch([file]);
    } else await uploadBatch(files);
  }

  /**
   * Chuyển đổi đối tượng Blob thành chuỗi Base64 Data URL.
   *
   * @param {Blob} blob - Đối tượng Blob cần chuyển đổi.
   * @returns {Promise<string>} Chuỗi định dạng data URL.
   */
  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Media conversion failed.'));
      reader.readAsDataURL(blob);
    });
  }
})();
