/**
 * chat.js – Live chatbox with auto-responses and quick replies
 */

let chatOpen = false;
let chatHistory = [];
let chatUnread = 1;

const BOT_NAME  = 'Tư vấn VeloShop';
const GREET_MSG = 'Xin chào! 👋 Tôi là nhân viên tư vấn của VeloShop. Tôi có thể giúp gì cho bạn hôm nay?';

const QUICK_REPLIES_INIT = [
  'Xe đạp dưới 5 triệu',
  'Xe đạp Nhật nội địa',
  'Chính sách bảo hành',
  'Hướng dẫn mua hàng',
];

const AUTO_RESPONSES = [
  {
    keywords: ['giá', 'bao nhiêu', 'tiền', 'chi phí', 'rẻ', 'đắt'],
    reply: 'VeloShop có xe từ 2.5 triệu đến 12 triệu đồng. Bạn có thể dùng bộ lọc giá bên trái để tìm xe phù hợp ngân sách nhé! 💰',
    quick: ['Xe dưới 5 triệu', 'Xe trên 5 triệu', 'Trả góp 0%'],
  },
  {
    keywords: ['bảo hành', 'warranty', 'hỏng', 'lỗi', 'đổi trả'],
    reply: 'Tất cả xe tại VeloShop được bảo hành 6–12 tháng và đổi trả trong 30 ngày. Nếu xe có vấn đề, bạn chỉ cần mang xe đến cửa hàng hoặc liên hệ hotline 096 44 111 66 🔧',
    quick: ['Điều kiện bảo hành', 'Quy trình đổi trả'],
  },
  {
    keywords: ['giao hàng', 'ship', 'vận chuyển', 'nhận hàng'],
    reply: 'VeloShop giao hàng toàn quốc! Miễn phí ship cho đơn từ 500K. Thời gian giao:\n• Hà Nội: 1–2 ngày\n• Các tỉnh: 3–5 ngày 🚚',
    quick: ['Phí vận chuyển', 'Theo dõi đơn hàng'],
  },
  {
    keywords: ['trả góp', 'góp', 'installment', '0%'],
    reply: 'VeloShop hỗ trợ trả góp 0% lãi suất, chia 12 tháng! Bạn chỉ cần CMND/CCCD và hóa đơn điện/nước để đăng ký. Rất đơn giản và nhanh chóng 💳',
    quick: ['Điều kiện trả góp', 'Tính toán góp tháng'],
  },
  {
    keywords: ['nhật', 'japan', 'bridgestone', 'panasonic', 'nội địa nhật'],
    reply: 'Xe đạp Nhật nội địa là dòng xe rất được ưa chuộng tại VeloShop! Độ bền cao, thiết kế cổ điển, nhập khẩu nguyên chiếc. Hiện có Bridgestone 5.6 triệu và Panasonic 4.1 triệu 🇯🇵',
    quick: ['Xem xe Nhật', 'So sánh Bridgestone vs Panasonic'],
  },
  {
    keywords: ['giant', 'xe đua', 'đua', 'road bike'],
    reply: 'VeloShop có Giant Contend SL 1 giá 8.5 triệu và Giant Escape 3 giá 5.4 triệu. Cả hai đều trong tình trạng rất tốt, đã qua kiểm định kỹ! 🚴',
    quick: ['Giant Contend SL', 'Giant Escape 3'],
  },
  {
    keywords: ['gấp', 'folding', 'dahon', 'gọn'],
    reply: 'Xe đạp gấp Dahon Speed D7 đang có tại VeloShop, giá 7.8 triệu (gốc 11 triệu). Gấp mở 15 giây, nhôm nhẹ, rất tiện cho dân văn phòng 📦',
    quick: ['Xem Dahon D7', 'Xe gấp khác'],
  },
  {
    keywords: ['địa hình', 'mountain', 'mtb', 'trinx', 'merida', 'gta'],
    reply: 'Xe địa hình VeloShop đang có: Trinx M136 (3.2tr), GTA V600 Fullsus (9.2tr), Merida Matts 6 MTB (11.5tr). Bạn thích dòng nào? 🏔️',
    quick: ['Trinx M136', 'GTA V600', 'Merida Matts'],
  },
  {
    keywords: ['liên hệ', 'hotline', 'điện thoại', 'gọi', 'zalo'],
    reply: 'Bạn có thể liên hệ VeloShop qua:\n📞 Hotline: 096 44 111 66\n💬 Zalo: 096 44 111 66\n✉️ Email: contact@veloshop.vn\n📍 223 Hoàng Hoa Thám, Ba Đình, HN 🗺️',
    quick: ['Gọi ngay', 'Chat Zalo'], zaloCta: true,
  },
  {
    keywords: ['cảm ơn', 'thanks', 'thank', 'ok', 'được rồi'],
    reply: 'Cảm ơn bạn đã ghé VeloShop! Chúc bạn tìm được chiếc xe ưng ý 🚲 Nếu cần hỗ trợ thêm, đừng ngại hỏi nhé!',
    quick: ['Xem sản phẩm', 'Liên hệ cửa hàng'],
  },
];

const FALLBACK_REPLIES = [
  'Cảm ơn bạn đã hỏi! Để tư vấn chính xác hơn, bạn vui lòng gọi hotline <strong>096 44 111 66</strong> hoặc để lại số điện thoại — nhân viên sẽ liên hệ ngay 😊',
  'VeloShop luôn sẵn sàng hỗ trợ bạn! Câu hỏi này cần tư vấn chuyên sâu hơn. Bạn có thể gọi <strong>096 44 111 66</strong> hoặc chat Zalo để được giải đáp nhanh nhất nhé 👍',
  'Câu hỏi hay đó! Để giải đáp chính xác nhất, mời bạn gọi hotline <strong>096 44 111 66</strong> — nhân viên luôn sẵn sàng 7 ngày/tuần từ 8h–21h 🕐',
];

/* ── Init ────────────────────────────────── */
function initChat() {
  // Show greeting message after 1s
  setTimeout(() => {
    chatHistory.push({ role: 'bot', text: GREET_MSG, time: nowStr(), quickReplies: QUICK_REPLIES_INIT });
    if (!chatOpen) updateChatBadge(1);
    if (chatOpen) renderMessages();
  }, 1000);
}

function nowStr() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
}

/* ── Toggle ──────────────────────────────── */
function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open', chatOpen);
  if (chatOpen) {
    chatUnread = 0;
    updateChatBadge(0);
    renderMessages();
    setTimeout(() => {
      const inp = document.getElementById('chatInput');
      if (inp) inp.focus();
    }, 200);
  }
}

function updateChatBadge(n) {
  const badge = document.getElementById('chatBadge');
  if (badge) { badge.textContent = n; badge.style.display = n > 0 ? 'flex' : 'none'; }
}

/* ── Render messages ─────────────────────── */
function renderMessages() {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  container.innerHTML = chatHistory.map(msg => {
    const isBot = msg.role === 'bot';
    const avatar = isBot ? '<div class="msg-avatar">🤖</div>' : '';
    const quickHTML = (isBot && msg.quickReplies) ? `
      <div class="quick-replies">
        ${msg.quickReplies.map(r => `<button class="quick-reply" onclick="sendQuickReply('${r}')">${r}</button>`).join('')}
      </div>` : '';
    return `
      <div class="chat-msg ${isBot?'bot':'user'}">
        ${avatar}
        <div>
          <div class="msg-bubble">${msg.text}</div>
          ${quickHTML}
          <div class="msg-time">${msg.time}</div>
        </div>
      </div>`;
  }).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

/* ── Send message ────────────────────────── */
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  // Add user message
  chatHistory.push({ role: 'user', text: escapeHTML(text), time: nowStr() });
  renderMessages();

  // Show typing indicator
  showTyping();

  // Auto-response after delay
  setTimeout(() => {
    hideTyping();
    const reply = getAutoReply(text);
    chatHistory.push(reply);
    renderMessages();
  }, 900 + Math.random() * 700);
}

function sendQuickReply(text) {
  if (text === 'Chat Zalo') { if (typeof openZaloModal === 'function') openZaloModal(); return; }
  chatHistory.push({ role: 'user', text: text, time: nowStr() });
  renderMessages();
  showTyping();
  setTimeout(() => {
    hideTyping();
    const reply = getAutoReply(text);
    chatHistory.push(reply);
    renderMessages();
  }, 800 + Math.random() * 500);
}

function getAutoReply(text) {
  const lower = text.toLowerCase();
  for (const r of AUTO_RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) {
      return { role: 'bot', text: r.reply.replace(/\n/g,'<br>'), time: nowStr(), quickReplies: r.quick };
    }
  }
  // Fallback
  const fb = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
  return { role: 'bot', text: fb, time: nowStr(), quickReplies: ['Gọi hotline', 'Xem sản phẩm'] };
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.id = 'typingIndicator';
  div.className = 'chat-msg bot';
  div.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function hideTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Send on Enter
function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}
