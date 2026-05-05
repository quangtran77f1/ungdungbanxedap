/**
 * data.js - VeloShop product catalogue & static content
 * Images: real bicycle photos from Unsplash (free-to-use CDN)
 */

const PRODUCTS = [
  {
    id: 1, name: 'Xe Dap Dua Giant Contend SL 1 (Cu)', brand: 'Giant',
    price: 8500000, original: 12000000, condition: 'Con rat tot',
    pct: 30, type: 'dua', color: '#e74c3c', isNew: false, isSale: true,
    specs: ['Shimano 105', '700c', '22 toc do'],
    img: 'https://images.unsplash.com/photo-1615722247020-1fb3e1f5b489?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1615722247020-1fb3e1f5b489?w=400&q=80',
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&q=80',
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&q=80',
    ]
  },
  {
    id: 2, name: 'Xe Dap XdS AD300 Road Bike Cu 2023', brand: 'XdS',
    price: 6200000, original: 9500000, condition: 'Tot',
    pct: 35, type: 'dua', color: '#2980b9', isNew: false, isSale: true,
    specs: ['LTWOO R7', '700c', '20 toc do'],
    img: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400&q=80',
      'https://images.unsplash.com/photo-1505705694340-019e1e335916?w=400&q=80',
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=400&q=80',
    ]
  },
  {
    id: 3, name: 'Xe Dap Touring Nakxus 700c013 (Cu)', brand: 'Nakxus',
    price: 4800000, original: 6800000, condition: 'Con rat tot',
    pct: 29, type: 'cu', color: '#27ae60', isNew: true, isSale: true,
    specs: ['Altus 24sp', '700c', 'Nhom'],
    img: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80',
      'https://images.unsplash.com/photo-1622315023340-44e41c1e7d78?w=400&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
    ]
  },
  {
    id: 4, name: 'Xe Dap Dia Hinh Trinx M136 (Cu)', brand: 'Trinx',
    price: 3200000, original: 4500000, condition: 'Tot',
    pct: 29, type: 'dia', color: '#8e44ad', isNew: false, isSale: true,
    specs: ['21 toc do', '26"', 'Thep'],
    img: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&q=80',
      'https://images.unsplash.com/photo-1479654392099-4c350f2a5e84?w=400&q=80',
      'https://images.unsplash.com/photo-1601956921680-64fa5f793261?w=400&q=80',
    ]
  },
  {
    id: 5, name: 'Xe Dap Nhat Noi Dia Bridgestone (Cu)', brand: 'Bridgestone',
    price: 5600000, original: 0, condition: 'Con rat tot',
    pct: 0, type: 'nhat', color: '#e67e22', isNew: true, isSale: false,
    specs: ['3 toc do', '26"', 'Nhom'],
    img: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
      'https://images.unsplash.com/photo-1618787372374-9b8d7d8beb17?w=400&q=80',
      'https://images.unsplash.com/photo-1597075219946-eb41e97bc8d2?w=400&q=80',
    ]
  },
  {
    id: 6, name: 'Xe Dap Gap Dahon Speed D7 (Cu)', brand: 'Dahon',
    price: 7800000, original: 11000000, condition: 'Con rat tot',
    pct: 29, type: 'gap', color: '#16a085', isNew: false, isSale: true,
    specs: ['7 toc do', '20"', 'Nhom'],
    img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
      'https://images.unsplash.com/photo-1604868189265-219bbe4ccd5e?w=400&q=80',
      'https://images.unsplash.com/photo-1567950009541-5c2a2994bfc7?w=400&q=80',
    ]
  },
  {
    id: 7, name: 'Xe Dap The Thao Galaxy MT26 (Cu)', brand: 'Galaxy',
    price: 2500000, original: 3800000, condition: 'Kha',
    pct: 34, type: 'thenao', color: '#c0392b', isNew: false, isSale: true,
    specs: ['21 toc do', '26"', 'Thep'],
    img: 'https://images.unsplash.com/photo-1526401281623-3e6d79571cd1?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1526401281623-3e6d79571cd1?w=400&q=80',
      'https://images.unsplash.com/photo-1595432541891-a461100d3054?w=400&q=80',
      'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&q=80',
    ]
  },
  {
    id: 8, name: 'Xe Dap GTA V600 Fullsus (Cu)', brand: 'GTA',
    price: 9200000, original: 13500000, condition: 'Con rat tot',
    pct: 32, type: 'dia', color: '#1a252f', isNew: false, isSale: true,
    specs: ['XT 30sp', '27.5"', 'Carbon'],
    img: 'https://images.unsplash.com/photo-1479654392099-4c350f2a5e84?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1479654392099-4c350f2a5e84?w=400&q=80',
      'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&q=80',
      'https://images.unsplash.com/photo-1601956921680-64fa5f793261?w=400&q=80',
    ]
  },
  {
    id: 9, name: 'Xe Dap Giant Escape 3 City Bike (Cu)', brand: 'Giant',
    price: 5400000, original: 7200000, condition: 'Tot',
    pct: 25, type: 'cu', color: '#2471a3', isNew: false, isSale: true,
    specs: ['Acera 24sp', '700c', 'Nhom'],
    img: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=400&q=80',
      'https://images.unsplash.com/photo-1505705694340-019e1e335916?w=400&q=80',
      'https://images.unsplash.com/photo-1622315023340-44e41c1e7d78?w=400&q=80',
    ]
  },
  {
    id: 10, name: 'Xe Dap Nhat Panasonic Touring (Cu)', brand: 'Panasonic',
    price: 4100000, original: 0, condition: 'Con rat tot',
    pct: 0, type: 'nhat', color: '#117a65', isNew: true, isSale: false,
    specs: ['6 toc do', '700c', 'Thep'],
    img: 'https://images.unsplash.com/photo-1597075219946-eb41e97bc8d2?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1597075219946-eb41e97bc8d2?w=400&q=80',
      'https://images.unsplash.com/photo-1618787372374-9b8d7d8beb17?w=400&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&q=80',
    ]
  },
  {
    id: 11, name: 'Xe Dap XdS Fixed Gear Track (Cu)', brand: 'XdS',
    price: 3600000, original: 5200000, condition: 'Tot',
    pct: 31, type: 'thenao', color: '#784212', isNew: false, isSale: true,
    specs: ['Fixed/Free', '700c', 'Thep'],
    img: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&q=80',
      'https://images.unsplash.com/photo-1615722247020-1fb3e1f5b489?w=400&q=80',
      'https://images.unsplash.com/photo-1595432541891-a461100d3054?w=400&q=80',
    ]
  },
  {
    id: 12, name: 'Xe Dap Merida Matts 6 MTB (Cu)', brand: 'Merida',
    price: 11500000, original: 16000000, condition: 'Con rat tot',
    pct: 28, type: 'dia', color: '#1c2833', isNew: false, isSale: true,
    specs: ['Deore 30sp', '29"', 'Nhom'],
    img: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&q=80',
      'https://images.unsplash.com/photo-1479654392099-4c350f2a5e84?w=400&q=80',
    ]
  },
];

const DETAIL_DESCS = {
  dua:    'Xe dap dua cao cap, thiet ke khung nhe giup toi uu toc do tren duong truong. He thong truyen dong duoc bao duong ky luong, van hanh muot ma. Ly tuong cho cac buoi dap xe dai hoac tham gia giai dau ban chuyen.',
  cu:     'Xe dap duong truong da dung, phu hop cho ca di lam lan du lich dai ngay. Khung hop kim nhom nhe ben, yen va tay lai co the dieu chinh de tang su thoai mai tren moi hanh trinh.',
  dia:    'Xe dia hinh toan dia hinh voi he thong phuoc nhun hap thu chan dong hieu qua. Lop ban rong bam duong tot, bo truyen dong nhieu toc do linh hoat tren moi loai dia hinh tu duong mon den soi da.',
  nhat:   'Xe dap noi dia Nhat nhap khau nguyen chiec, noi tieng voi do ben vuot thoi gian va thiet ke thanh lich. Duoc bao tri dinh ky, toan bo chi tiet hoat dong on dinh.',
  gap:    'Xe dap gap gon nhe, ly tuong cho dan van phong ket hop phuong tien cong cong. Gap/mo trong vong 15 giay, banh nho nhung he so lan tot, de mang len thang may hay cat trong cop xe hoi.',
  thenao: 'Xe dap the thao phong cach, phu hop dap xe giai tri va ren luyen suc khoe. He thong phanh dia phan ung nhanh, khung thep ben chac, mau son dep thu hut anh nhin tren pho.',
};
