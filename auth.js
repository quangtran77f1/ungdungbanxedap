/**
 * auth.js - Login & Register modal for VeloShop
 */

// Simple in-browser user store (localStorage)
const AUTH_KEY = 'veloshop_users';
const SESSION_KEY = 'veloshop_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || []; } catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ── Open / Close ─────────────────────────────── */
function openAuthModal(tab) {
  tab = tab || 'login';
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('open'), 10);
  switchAuthTab(tab);
  clearAuthErrors();
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form-section').forEach(s => s.classList.remove('active'));
  const btn = document.querySelector(`.auth-tab[data-tab="${tab}"]`);
  const section = document.getElementById(`authForm_${tab}`);
  if (btn) btn.classList.add('active');
  if (section) section.classList.add('active');
  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.auth-error').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
  document.querySelectorAll('.auth-success').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
}

/* ── Register ─────────────────────────────────── */
function doRegister() {
  clearAuthErrors();
  const name     = document.getElementById('reg_name').value.trim();
  const email    = document.getElementById('reg_email').value.trim();
  const phone    = document.getElementById('reg_phone').value.trim();
  const password = document.getElementById('reg_password').value;
  const confirm  = document.getElementById('reg_confirm').value;
  const err      = document.getElementById('reg_error');
  const ok       = document.getElementById('reg_success');

  if (!name || !email || !password || !confirm) {
    showAuthErr(err, 'Vui lòng điền đầy đủ thông tin bắt buộc.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAuthErr(err, 'Email không hợp lệ.');
    return;
  }
  if (password.length < 6) {
    showAuthErr(err, 'Mật khẩu phải có ít nhất 6 ký tự.');
    return;
  }
  if (password !== confirm) {
    showAuthErr(err, 'Mật khẩu xác nhận không khớp.');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    showAuthErr(err, 'Email này đã được đăng ký. Hãy đăng nhập.');
    return;
  }

  const newUser = { id: Date.now(), name, email, phone, password, createdAt: new Date().toISOString() };
  users.push(newUser);
  saveUsers(users);

  ok.textContent = 'Đăng ký thành công! Đang chuyển sang đăng nhập...';
  ok.style.display = 'block';
  document.getElementById('reg_name').value = '';
  document.getElementById('reg_email').value = '';
  document.getElementById('reg_phone').value = '';
  document.getElementById('reg_password').value = '';
  document.getElementById('reg_confirm').value = '';

  setTimeout(() => switchAuthTab('login'), 1500);
}

/* ── Login ────────────────────────────────────── */
function doLogin() {
  clearAuthErrors();
  const email    = document.getElementById('login_email').value.trim();
  const password = document.getElementById('login_password').value;
  const remember = document.getElementById('login_remember').checked;
  const err      = document.getElementById('login_error');

  if (!email || !password) {
    showAuthErr(err, 'Vui lòng nhập email và mật khẩu.');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    showAuthErr(err, 'Email hoặc mật khẩu không đúng.');
    return;
  }

  const session = { id: user.id, name: user.name, email: user.email, phone: user.phone };
  saveSession(session);
  updateHeaderUser(session);
  closeAuthModal();
  showToast(`Chào mừng trở lại, ${user.name}! 🎉`);
}

/* ── Logout ───────────────────────────────────── */
function doLogout() {
  clearSession();
  updateHeaderUser(null);
  showToast('Đã đăng xuất thành công.');
  document.getElementById('userDropdown').classList.remove('open');
}

/* ── Header UI ────────────────────────────────── */
function updateHeaderUser(user) {
  const btnAccount  = document.getElementById('btnAccount');
  const btnLogout   = document.getElementById('btnLogout');
  const userNameEl  = document.getElementById('headerUserName');
  const userEmailEl = document.getElementById('headerUserEmail');

  if (user) {
    if (userNameEl)  userNameEl.textContent  = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (btnAccount)  btnAccount.style.display = 'none';
    if (btnLogout)   btnLogout.style.display  = 'flex';
  } else {
    if (btnAccount)  btnAccount.style.display = 'flex';
    if (btnLogout)   btnLogout.style.display  = 'none';
  }
}

function toggleUserDropdown() {
  document.getElementById('userDropdown').classList.toggle('open');
}

/* ── Helpers ──────────────────────────────────── */
function showAuthErr(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

function authKeydown(e, fn) {
  if (e.key === 'Enter') fn();
}

/* ── Init on page load ────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  const session = getSession();
  if (session) updateHeaderUser(session);

  // Close modal on overlay click
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeAuthModal();
    });
  }

  // Close user dropdown when clicking outside
  document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('userDropdown');
    const trigger  = document.getElementById('btnLogout');
    if (dropdown && trigger && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
});

/* ── Zalo Modal ───────────────────────────────── */
function openZaloChat() {
  openZaloModal();
}

function openZaloModal() {
  const m = document.getElementById('zaloModal');
  if (m) m.style.display = 'flex';
}

function closeZaloModal() {
  const m = document.getElementById('zaloModal');
  if (m) m.style.display = 'none';
}

/* ── Toggle password visibility ───────────────── */
function togglePw(inputId, icon) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.textContent = '🙈';
  } else {
    inp.type = 'password';
    icon.textContent = '👁';
  }
}

// Close zalo overlay on background click
document.addEventListener('DOMContentLoaded', function () {
  const zalo = document.getElementById('zaloModal');
  if (zalo) {
    zalo.addEventListener('click', function (e) {
      if (e.target === zalo) closeZaloModal();
    });
  }
});
