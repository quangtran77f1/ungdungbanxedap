/**
 * checkout.js – Full online checkout flow (3 steps: Info → Payment → Confirm)
 */

let checkoutStep = 1;
let selectedPayment = 'cod';
let checkoutData = {};

/* ── Open / Close ─────────────────────────── */
function openCheckout() {
  if (cart.length === 0) { showToast('Giỏ hàng đang trống!'); return; }
  checkoutStep = 1;
  selectedPayment = 'cod';
  renderCheckoutStep();
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeCheckoutIfOutside(e) {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
}

/* ── Step renderer ────────────────────────── */
function renderCheckoutStep() {
  const modal = document.getElementById('checkoutModal');
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = total >= 500000 ? 0 : 30000;

  if (checkoutStep === 99) {
    // Success
    modal.innerHTML = `
      <div class="checkout-success">
        <div class="success-icon">🎉</div>
        <div class="success-title">Đặt hàng thành công!</div>
        <div class="success-msg">Cảm ơn bạn đã mua sắm tại VeloShop!<br>Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.</div>
        <div class="order-code">
          <div class="order-code-label">Mã đơn hàng của bạn</div>
          <div class="order-code-value">VS-${Date.now().toString().slice(-8)}</div>
        </div>
        <button class="btn-checkout-next" style="width:100%;max-width:280px;margin:0 auto;" onclick="closeCheckout(); cart=[]; updateCartUI();">
          Tiếp tục mua sắm 🚴
        </button>
      </div>`;
    return;
  }

  const stepNames = ['Thông tin', 'Thanh toán', 'Xác nhận'];
  const stepsHTML = stepNames.map((name, i) => {
    const n = i + 1;
    const cls = n < checkoutStep ? 'done' : n === checkoutStep ? 'active' : '';
    const sep = i < stepNames.length - 1 ? `<div class="step-sep${n < checkoutStep ? ' done' : ''}"></div>` : '';
    return `<div class="step-item ${cls}">
      <div class="step-num">${n < checkoutStep ? '✓' : n}</div>
      <div class="step-label">${name}</div>
    </div>${sep}`;
  }).join('');

  let bodyHTML = '';

  if (checkoutStep === 1) {
    // Step 1: Customer info
    bodyHTML = `
      <div class="checkout-body">
        <div class="form-row">
          <div class="form-group">
            <label>Họ và tên *</label>
            <input type="text" id="ckName" placeholder="Nguyễn Văn A" value="${checkoutData.name||''}" required>
          </div>
          <div class="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" id="ckPhone" placeholder="09x xxx xxxx" value="${checkoutData.phone||''}" required>
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="ckEmail" placeholder="email@example.com" value="${checkoutData.email||''}">
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label>Địa chỉ nhận hàng *</label>
            <input type="text" id="ckAddr" placeholder="Số nhà, tên đường..." value="${checkoutData.addr||''}" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tỉnh / Thành phố</label>
            <select id="ckCity">
              <option>Hà Nội</option><option>TP. Hồ Chí Minh</option><option>Đà Nẵng</option>
              <option>Hải Phòng</option><option>Cần Thơ</option><option>Bình Dương</option><option>Tỉnh khác</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quận / Huyện</label>
            <input type="text" id="ckDistrict" placeholder="Quận Ba Đình" value="${checkoutData.district||''}">
          </div>
        </div>
        <div class="form-row full">
          <div class="form-group">
            <label>Ghi chú thêm</label>
            <textarea id="ckNote" placeholder="Thời gian nhận hàng, yêu cầu đặc biệt...">${checkoutData.note||''}</textarea>
          </div>
        </div>
        ${orderSummaryHTML(total, shipping)}
      </div>`;
  } else if (checkoutStep === 2) {
    // Step 2: Payment
    const payMethods = [
      { id:'cod',  icon:'🚚', name:'Thanh toán khi nhận hàng', desc:'COD – Trả tiền mặt khi nhận xe' },
      { id:'bank', icon:'🏦', name:'Chuyển khoản ngân hàng',   desc:'Thanh toán trước qua tài khoản' },
      { id:'momo', icon:'💜', name:'Ví MoMo',                  desc:'Quét QR hoặc số điện thoại' },
      { id:'vnpay',icon:'💙', name:'VNPay',                    desc:'Thẻ ATM / Visa / QR nội địa' },
    ];
    bodyHTML = `
      <div class="checkout-body">
        <div style="font-size:14px;font-weight:700;color:var(--gray-700);margin-bottom:12px;">Chọn phương thức thanh toán</div>
        <div class="pay-methods">
          ${payMethods.map(m => `
            <div class="pay-method ${selectedPayment===m.id?'selected':''}" onclick="selectPayment('${m.id}')">
              <span class="pay-method-icon">${m.icon}</span>
              <div class="pay-method-info">
                <div class="pay-method-name">${m.name}</div>
                <div class="pay-method-desc">${m.desc}</div>
              </div>
              <div class="pay-method-radio"></div>
            </div>`).join('')}
        </div>
        <div id="payDetail"></div>
        ${orderSummaryHTML(total, shipping)}
      </div>`;
  } else if (checkoutStep === 3) {
    // Step 3: Confirm order
    const itemsHTML = cart.map(item => `
      <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <div style="width:52px;height:52px;border-radius:8px;overflow:hidden;background:#f5f5f5;flex-shrink:0;">
          <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;color:var(--gray-900);line-height:1.3;">${item.name}</div>
          <div style="font-size:12px;color:var(--gray-500);">SL: ${item.qty}</div>
        </div>
        <div style="font-size:14px;font-weight:700;color:var(--green-dark);">${fmtPrice(item.price * item.qty)}</div>
      </div>`).join('');

    const payLabel = {cod:'COD – Tiền mặt',bank:'Chuyển khoản ngân hàng',momo:'Ví MoMo',vnpay:'VNPay'}[selectedPayment];
    bodyHTML = `
      <div class="checkout-body">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;">Thông tin giao hàng</div>
        <div style="background:#f8fafb;border-radius:10px;padding:14px;font-size:13px;line-height:1.8;margin-bottom:14px;">
          <strong>${checkoutData.name}</strong> — ${checkoutData.phone}<br>
          ${checkoutData.addr}, ${checkoutData.district||''} ${checkoutData.city||''}<br>
          ${checkoutData.note ? `<em>Ghi chú: ${checkoutData.note}</em>` : ''}
        </div>
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Sản phẩm đặt mua</div>
        ${itemsHTML}
        <div style="font-size:14px;font-weight:700;margin:14px 0 8px;">Phương thức thanh toán</div>
        <div style="background:#f8fafb;border-radius:10px;padding:12px;font-size:13px;font-weight:600;">
          ${payLabel}
        </div>
        ${orderSummaryHTML(total, shipping)}
      </div>`;
  }

  const nextLabel = checkoutStep === 1 ? 'Tiếp theo: Thanh toán →' :
                    checkoutStep === 2 ? 'Tiếp theo: Xác nhận →'  :
                    '✅ Đặt hàng ngay';

  modal.innerHTML = `
    <div class="checkout-header">
      <h3>🛒 Đặt hàng online</h3>
      <button class="checkout-close" onclick="closeCheckout()">✕</button>
    </div>
    <div class="checkout-steps">${stepsHTML}</div>
    ${bodyHTML}
    <div class="checkout-actions">
      ${checkoutStep > 1 ? `<button class="checkout-btn-back btn-checkout-back" onclick="checkoutBack()">← Quay lại</button>` : ''}
      <button class="btn-checkout-next" onclick="checkoutNext()">${nextLabel}</button>
    </div>`;

  // If step 2, render initial payment detail
  if (checkoutStep === 2) renderPayDetail();
}

function orderSummaryHTML(total, shipping) {
  return `
    <div class="checkout-summary">
      <div class="summary-row"><span>Tạm tính (${cart.reduce((s,x)=>s+x.qty,0)} sản phẩm)</span><span>${fmtPrice(total)}</span></div>
      <div class="summary-row shipping"><span>Phí vận chuyển</span><span>${shipping===0?'Miễn phí':fmtPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Tổng thanh toán</span><span>${fmtPrice(total+shipping)}</span></div>
    </div>`;
}

/* ── Payment detail ───────────────────────── */
function selectPayment(id) {
  selectedPayment = id;
  renderCheckoutStep();
  renderPayDetail();
}

function renderPayDetail() {
  const el = document.getElementById('payDetail');
  if (!el) return;
  const total = cart.reduce((s,x)=>s+x.price*x.qty,0);

  if (selectedPayment === 'bank') {
    el.innerHTML = `
      <div class="card-form">
        <div class="card-form-title">💳 Thông tin chuyển khoản</div>
        <div style="font-size:13px;line-height:2;color:var(--gray-700);">
          <strong>Ngân hàng:</strong> VietcomBank<br>
          <strong>Số tài khoản:</strong> 1234 5678 9012 3456<br>
          <strong>Chủ tài khoản:</strong> VELOSHOP TRADING CO.<br>
          <strong>Nội dung CK:</strong> VELOSHOP + Số điện thoại<br>
          <strong>Số tiền:</strong> <span style="color:var(--green-dark);font-weight:800;">${fmtPrice(total)}</span>
        </div>
        <div style="background:#fff8e1;border-radius:8px;padding:10px;margin-top:10px;font-size:12px;color:#795548;">
          ⚠️ Đơn hàng sẽ được xác nhận trong 15 phút sau khi nhận được chuyển khoản.
        </div>
      </div>`;
  } else if (selectedPayment === 'momo') {
    el.innerHTML = `
      <div class="qr-box">
        <div class="qr-img">💜</div>
        <div class="qr-info">Quét mã QR bằng app <strong>MoMo</strong></div>
        <div class="qr-amount">${fmtPrice(total)}</div>
        <div style="font-size:12px;color:var(--gray-500);">Số MoMo: <strong>0964 411 166</strong><br>Chủ TK: VeloShop</div>
      </div>`;
  } else if (selectedPayment === 'vnpay') {
    el.innerHTML = `
      <div class="qr-box" style="border-color:#0066cc;background:#f0f7ff;">
        <div class="qr-img" style="border-color:#0066cc;">💙</div>
        <div class="qr-info">Quét mã QR bằng app ngân hàng hoặc <strong>VNPay</strong></div>
        <div class="qr-amount" style="color:#0066cc;">${fmtPrice(total)}</div>
        <div style="font-size:12px;color:var(--gray-500);">Hỗ trợ: ATM nội địa, Visa, MasterCard, JCB</div>
      </div>
      <div class="card-form">
        <div class="card-form-title">Hoặc nhập thông tin thẻ</div>
        <div class="card-logos">
          <div class="card-logo">VISA</div>
          <div class="card-logo">MC</div>
          <div class="card-logo">JCB</div>
          <div class="card-logo">ATM</div>
        </div>
        <div class="form-group" style="margin-bottom:10px;">
          <label>Số thẻ</label>
          <div class="card-number-wrap">
            <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" oninput="fmtCardNum(this)">
            <span class="card-icon">💳</span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Ngày hết hạn</label>
            <input type="text" placeholder="MM/YY" maxlength="5">
          </div>
          <div class="form-group">
            <label>CVV</label>
            <input type="text" placeholder="•••" maxlength="3">
          </div>
        </div>
        <div class="form-group">
          <label>Tên chủ thẻ</label>
          <input type="text" placeholder="NGUYEN VAN A">
        </div>
      </div>`;
  } else {
    el.innerHTML = `
      <div style="background:#f0faf4;border-radius:10px;padding:14px;text-align:center;font-size:13px;color:var(--green-dark);font-weight:600;margin-bottom:12px;">
        🚚 Bạn sẽ thanh toán <strong>${fmtPrice(total)}</strong> bằng tiền mặt khi nhận hàng.<br>
        <span style="font-weight:400;color:var(--gray-600);">Không cần chuẩn bị trước — nhân viên giao hàng sẽ xuất hóa đơn.</span>
      </div>`;
  }
}

function fmtCardNum(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

/* ── Navigation ───────────────────────────── */
function checkoutNext() {
  if (checkoutStep === 1) {
    const name  = document.getElementById('ckName')?.value.trim();
    const phone = document.getElementById('ckPhone')?.value.trim();
    const addr  = document.getElementById('ckAddr')?.value.trim();
    if (!name || !phone || !addr) { showToast('Vui lòng điền đầy đủ thông tin bắt buộc!'); return; }
    checkoutData = {
      name, phone, addr,
      email:    document.getElementById('ckEmail')?.value.trim(),
      district: document.getElementById('ckDistrict')?.value.trim(),
      city:     document.getElementById('ckCity')?.value,
      note:     document.getElementById('ckNote')?.value.trim(),
    };
    checkoutStep = 2;
  } else if (checkoutStep === 2) {
    checkoutStep = 3;
  } else if (checkoutStep === 3) {
    // Place order
    checkoutStep = 99;
    cart = []; updateCartUI();
    closeCart();
  }
  renderCheckoutStep();
  document.getElementById('checkoutModal').scrollTop = 0;
}

function checkoutBack() {
  if (checkoutStep > 1) { checkoutStep--; renderCheckoutStep(); }
}
