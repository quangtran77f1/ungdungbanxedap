/**
 * utils.js – shared helper functions
 */

function fmtPrice(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

/** Fallback SVG if real image fails */
function bikeImgFallback(color) {
  return `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50"  cy="80" r="30" fill="none" stroke="${color}" stroke-width="5"/>
    <circle cx="150" cy="80" r="30" fill="none" stroke="${color}" stroke-width="5"/>
    <circle cx="50"  cy="80" r="8"  fill="${color}"/>
    <circle cx="150" cy="80" r="8"  fill="${color}"/>
    <line x1="50"  y1="80" x2="100" y2="45"  stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="100" y1="45" x2="150" y2="80"  stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="100" y1="45" x2="100" y2="80"  stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="50"  y1="80" x2="80"  y2="45"  stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="80"  y1="45" x2="100" y2="45"  stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="80"  y1="45" x2="95"  y2="35"  stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="90"  y1="33" x2="100" y2="33"  stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="100" y1="45" x2="100" y2="32"  stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="96"  y1="32" x2="104" y2="32"  stroke="${color}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="80" r="5" fill="${color}" opacity="0.4"/>
    <line x1="100" y1="75" x2="100" y2="80"  stroke="${color}" stroke-width="3"/>
    <line x1="95"  y1="78" x2="105" y2="78"  stroke="${color}" stroke-width="3"/>
  </svg>`;
}

/** Keep bikeSVG alias for cart drawer thumbnails */
function bikeSVG(color) {
  return bikeImgFallback(color);
}

let _toastTimer;
function showToast(msg) {
  const t   = document.getElementById('toast');
  const txt = document.getElementById('toastMsg');
  txt.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function removeTag(el) { el.remove(); }
