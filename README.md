# 🚲 VeloShop — Xe Đạp Cũ Chất Lượng

Website bán xe đạp cũ tĩnh (vanilla HTML/CSS/JS) — không cần build tool hay server.

---

## 📁 Cấu trúc dự án

```
veloshop/
├── index.html          ← Trang chính (HTML thuần, không inline CSS/JS)
├── css/
│   └── style.css       ← Toàn bộ styles (variables, layout, components, responsive)
├── js/
│   ├── data.js         ← Dữ liệu sản phẩm & mô tả chi tiết
│   ├── utils.js        ← Hàm tiện ích: fmtPrice, bikeSVG, showToast, removeTag
│   ├── cart.js         ← Trạng thái giỏ hàng, render, drawer open/close
│   ├── products.js     ← Grid sản phẩm, bộ lọc, phân trang, modal chi tiết
│   └── main.js         ← Bootstrap (DOMContentLoaded)
└── README.md
```

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| **Giỏ hàng** | Thêm/xóa/thay đổi số lượng, tổng tiền tự động |
| **Modal chi tiết** | Ảnh sản phẩm, thông số, trả góp, nút mua ngay |
| **Bộ lọc** | Danh mục, hãng, tình trạng, khoảng giá |
| **Sắp xếp** | Mới nhất, giá tăng/giảm, phổ biến, giảm giá |
| **Tìm kiếm live** | Debounce 300 ms, lọc theo tên & hãng |
| **Yêu thích** | Toggle lưu client-side |
| **Phân trang** | 12 sản phẩm/trang |
| **Chế độ xem** | Lưới (3 cột) ↔ Danh sách (1 cột) |
| **Responsive** | Mobile-first breakpoints: 900 px, 680 px, 480 px |

---

## 🚀 Khởi chạy

Mở trực tiếp `index.html` trong trình duyệt, **hoặc** dùng live server:

```bash
# VS Code: Right-click index.html → "Open with Live Server"

# Hoặc dùng Python
python3 -m http.server 8080
# → http://localhost:8080
```

---

## 🛠 Mở rộng

- **Thêm sản phẩm** → chỉnh `js/data.js`, mảng `PRODUCTS`
- **Đổi màu thương hiệu** → chỉnh CSS variables trong `css/style.css` `:root`
- **Kết nối backend** → thay `PRODUCTS` bằng `fetch('/api/products')` trong `js/main.js`
- **Thêm trang** → tạo `pages/cart.html`, `pages/detail.html`, dùng chung `css/style.css`
