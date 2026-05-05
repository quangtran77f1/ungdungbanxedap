/**
 * cart.js – shopping-cart state & UI
 */

let cart = [];

/* ── State helpers ─────────────────────────────────── */

function addToCartById(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  updateCartUI();
  showToast(`Đã thêm "${p.name.slice(0, 30)}…" vào giỏ!`);
}

function addToCart(id, e) {
  e.stopPropagation();
  addToCartById(id);
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function checkout_old_unused() {
  if (cart.length === 0) { showToast('Giỏ hàng đang trống!'); return; }
  showToast('Đặt hàng thành công! Cảm ơn bạn 🎉');
  cart = [];
  updateCartUI();
  closeCart();
}

/* ── UI ────────────────────────────────────────────── */

function updateCartUI() {
  const total = cart.reduce((s, x) => s + x.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent    = total;
  badge.style.display  = total ? 'flex' : 'none';

  const totalPrice = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById('cartTotal').textContent = fmtPrice(totalPrice);

  const cartItemsEl = document.getElementById('cartItems');
  const emptyEl     = document.getElementById('cartEmpty');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    return;
  }

  cartItemsEl.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-thumb" style="overflow:hidden;border-radius:6px;">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">` : bikeSVG(item.color)}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${fmtPrice(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <span class="cart-remove" onclick="removeFromCart(${item.id})">🗑 Xóa</span>
        </div>
      </div>`;
    cartItemsEl.appendChild(div);
  });
}

/* ── Drawer open / close ───────────────────────────── */

function openCart()  { document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartOverlay').classList.remove('open'); }
function closeCartIfOutside(e) {
  if (e.target === document.getElementById('cartOverlay')) closeCart();
}
