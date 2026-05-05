/**
 * products.js – product grid rendering, filters, pagination & detail modal
 */

let currentPage = 1;
const perPage   = 12;

/* ── Filters ───────────────────────────────────────── */

const activeFilters = {
  category:  'cu',
  brands:    ['Giant', 'XdS'],
  condition: null,
  priceMin:  0,
  priceMax:  Infinity,
  search:    '',
  sort:      'new',
};

function getFilteredProducts() {
  let list = [...PRODUCTS];
  if (activeFilters.category && activeFilters.category !== 'all') {
    list = list.filter(p => p.type === activeFilters.category);
  }
  if (activeFilters.brands.length > 0) {
    list = list.filter(p => activeFilters.brands.includes(p.brand));
  }
  if (activeFilters.condition) {
    list = list.filter(p => p.condition === activeFilters.condition);
  }
  list = list.filter(p => p.price >= activeFilters.priceMin && p.price <= activeFilters.priceMax);
  if (activeFilters.search) {
    const q = activeFilters.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }
  switch (activeFilters.sort) {
    case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price_desc': list.sort((a, b) => b.price - a.price); break;
    case 'discount':   list.sort((a, b) => b.pct - a.pct);     break;
    case 'popular':    list.sort((a, b) => b.id - a.id);        break;
    default: break;
  }
  return list;
}

/* ── Render ────────────────────────────────────────── */

function renderProducts() {
  const filtered = getFilteredProducts();
  const grid = document.getElementById('productGrid');
  const start = (currentPage - 1) * perPage;
  const page  = filtered.slice(start, start + perPage);

  const totalEl = document.getElementById('totalCount');
  if (totalEl) totalEl.textContent = filtered.length;

  grid.innerHTML = '';
  page.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-thumb">
        <div class="product-img-inner">
          <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.parentElement.innerHTML=bikeImgFallback('${p.color}')">
        </div>
        <div class="product-badges">
          ${p.isUserListing ? `<span class="badge" style="background:var(--orange);color:#fff;font-size:10px;padding:2px 7px;border-radius:20px">📢 Tin đăng</span>` : ''}
          ${p.isSale && !p.isUserListing ? `<span class="badge badge-sale">-${p.pct}%</span>` : ''}
          ${p.isSale && p.isUserListing && p.pct > 0 ? `<span class="badge badge-sale">-${p.pct}%</span>` : ''}
          ${p.isNew && !p.isUserListing ? `<span class="badge badge-new">Mới về</span>` : ''}
        </div>
        <div class="product-wishlist" onclick="toggleWishlist(${p.id}, this)">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-specs">
          ${p.specs.map(s => `<span class="spec-tag">${s}</span>`).join('')}
          <span class="spec-tag" style="border-color:#a3d9b5;background:#d4edda;color:#155724">${p.condition}</span>
        </div>
        <div class="product-price-row">
          <span class="price-current">${fmtPrice(p.price)}</span>
          ${p.original ? `<span class="price-original">${fmtPrice(p.original)}</span>
          <span class="price-discount">-${p.pct}%</span>` : ''}
        </div>
      </div>
      <div class="product-actions">
        <button class="btn-cart" onclick="addToCart(${p.id}, event)">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          Thêm vào giỏ
        </button>
        <button class="btn-detail" onclick="openDetail(${p.id}, event)">Chi tiết</button>
      </div>`;
    card.addEventListener('click', e => {
      if (!e.target.closest('.btn-cart') && !e.target.closest('.product-wishlist')) {
        openDetail(p.id, e);
      }
    });
    grid.appendChild(card);
  });

  renderPagination(filtered.length);
}

/* ── Pagination ────────────────────────────────────── */

function renderPagination(total) {
  const pages = Math.max(Math.ceil(total / perPage), 1);
  const pg    = document.getElementById('pagination');
  pg.innerHTML = '';

  const mkBtn = (label, page, disabled = false) => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (page === currentPage ? ' active' : '');
    btn.textContent = label;
    btn.disabled = disabled;
    btn.onclick = () => { currentPage = page; renderProducts(); window.scrollTo(0, 0); };
    return btn;
  };

  pg.appendChild(mkBtn('‹', currentPage - 1, currentPage === 1));
  for (let i = 1; i <= pages; i++) pg.appendChild(mkBtn(i, i));
  pg.appendChild(mkBtn('›', currentPage + 1, currentPage >= pages));
}

/* ── Toolbar handlers ──────────────────────────────── */

function sortProducts(val) {
  activeFilters.sort = val;
  currentPage = 1;
  renderProducts();
}

function setView(mode, btn) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('productGrid').style.gridTemplateColumns =
    mode === 'list' ? '1fr' : '';
}

/* ── Nav / sidebar filters ─────────────────────────── */

function filterCategory(cat) {
  activeFilters.category = cat;
  currentPage = 1;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts();
}

function sideFilter(cat, el) {
  event.preventDefault();
  activeFilters.category = cat;
  currentPage = 1;
  document.querySelectorAll('.sidebar-list a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}

function applyPrice() {
  const from = parseFloat(document.getElementById('priceFrom').value.replace(/\D/g, '')) || 0;
  const to   = parseFloat(document.getElementById('priceTo').value.replace(/\D/g, ''))   || Infinity;
  activeFilters.priceMin = from;
  activeFilters.priceMax = to;
  currentPage = 1;
  renderProducts();
  showToast('Đã lọc theo khoảng giá');
}

function applyBrand() {
  const checked = [...document.querySelectorAll('.brand-check input:checked')];
  activeFilters.brands = checked.map(cb => cb.parentElement.textContent.trim());
  currentPage = 1;
  renderProducts();
}

function setCond(btn) {
  document.querySelectorAll('.cond-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilters.condition = btn.textContent.replace(/[🟢🟡🔴]/g, '').trim().split('(')[0].trim();
  currentPage = 1;
  renderProducts();
}

/* ── Wishlist ─────────────────────────────────────── */
const wishlist = new Set();

function toggleWishlist(id, el) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    el.style.color = '';
    showToast('Đã xóa khỏi danh sách yêu thích');
  } else {
    wishlist.add(id);
    el.querySelector('svg').style.fill = '#e74c3c';
    el.querySelector('svg').style.stroke = '#e74c3c';
    showToast('Đã thêm vào yêu thích ❤️');
  }
}

/* ── Detail modal ──────────────────────────────────── */

function openDetail(id, e) {
  if (e) e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const badgesEl = document.getElementById('detailBadges');
  badgesEl.innerHTML = '';
  if (p.isSale) badgesEl.innerHTML += `<span class="badge badge-sale">-${p.pct}%</span>`;
  if (p.isNew)  badgesEl.innerHTML += `<span class="badge badge-new">Mới về</span>`;

  // Main image – real photo
  document.getElementById('detailImg').innerHTML =
    `<img src="${p.imgs[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.outerHTML=bikeImgFallback('${p.color}')">`;

  // Thumbnails
  document.getElementById('detailThumbs').innerHTML = p.imgs.map((src, i) =>
    `<div class="detail-thumb ${i === 0 ? 'active' : ''}" onclick="switchThumbImg(this,'${src}','${p.name}','${p.color}')">
      <img src="${src}" alt="thumb" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
    </div>`
  ).join('');

  document.getElementById('detailBrand').textContent     = p.brand;
  document.getElementById('detailCondition').textContent = '🟢 ' + p.condition;
  document.getElementById('detailName').textContent      = p.name;
  document.getElementById('detailPriceCurrent').textContent = fmtPrice(p.price);

  const origRow = document.getElementById('detailPriceOrigRow');
  if (p.original) {
    const saved = p.original - p.price;
    origRow.innerHTML = `
      <span class="detail-price-orig">${fmtPrice(p.original)}</span>
      <span class="detail-save">Tiết kiệm ${fmtPrice(saved)}</span>`;
  } else {
    origRow.innerHTML = `<span style="font-size:12px;color:var(--green-dark);font-weight:600">Giá niêm yết chính thức</span>`;
  }

  const monthly = Math.round(p.price / 12 / 1000) * 1000;
  document.getElementById('detailInstallment').textContent =
    `💳 Trả góp 0%: ~${fmtPrice(monthly)}/tháng × 12 tháng`;

  const specKeys = [
    { label: 'Hệ truyền động', value: p.specs[0] || '—' },
    { label: 'Kích thước bánh', value: p.specs[1] || '—' },
    { label: 'Chất liệu khung', value: p.specs[2] || '—' },
    { label: 'Tình trạng xe',   value: p.condition },
    { label: 'Thương hiệu',     value: p.brand },
    { label: 'Mã sản phẩm',     value: 'VS-' + String(id).padStart(4, '0') },
  ];
  document.getElementById('detailSpecsGrid').innerHTML = specKeys.map(s => `
    <div class="detail-spec-item">
      <span class="detail-spec-label">${s.label}</span>
      <span class="detail-spec-value">${s.value}</span>
    </div>`).join('');

  const desc = p.isUserListing && p.desc
    ? p.desc
    : (DETAIL_DESCS[p.type] || DETAIL_DESCS['cu']);
  let descHtml = `<strong>Mô tả sản phẩm:</strong> ${desc}`;
  if (p.isUserListing) {
    descHtml += `<div style="margin-top:12px;padding:12px;background:#fff8f2;border-radius:10px;border:1.5px solid #ffd4a8;">
      <div style="font-weight:700;font-size:13px;color:var(--orange);margin-bottom:6px">📢 Người bán</div>
      <div style="font-size:13.5px;color:#333"><strong>${p.sellerName || 'Người dùng VeloShop'}</strong></div>
      <div style="font-size:13px;color:#555;margin-top:3px">📞 ${p.sellerPhone || 'Liên hệ qua chat'}</div>
    </div>`;
  }
  document.getElementById('detailDesc').innerHTML = descHtml;

  document.getElementById('btnDetailCart').onclick = () => { addToCartById(id); closeDetail(); };
  document.getElementById('btnDetailBuy').onclick  = () => { addToCartById(id); closeDetail(); setTimeout(openCart, 200); };

  document.getElementById('detailOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function switchThumbImg(el, src, name, color) {
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('detailImg').innerHTML =
    `<img src="${src}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.outerHTML=bikeImgFallback('${color}')">`;
}

function switchThumb(el, id, color) {
  // Legacy fallback
  switchThumbImg(el, color, '', color);
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeDetailIfOutside(e) {
  if (e.target === document.getElementById('detailOverlay')) closeDetail();
}

/* ── Search (live) ─────────────────────────────────── */

function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      activeFilters.search = input.value.trim();
      currentPage = 1;
      renderProducts();
    }, 300);
  });

  document.querySelector('.btn-search')?.addEventListener('click', () => {
    activeFilters.search = input.value.trim();
    currentPage = 1;
    renderProducts();
  });
}
