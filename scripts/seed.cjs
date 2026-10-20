/**
 * Chạy: npm run seed
 * Chỉ thêm dữ liệu còn thiếu (theo tên category / title course).
 * KHÔNG xóa hoặc ghi đè dữ liệu cũ trên MockAPI.
 * Yêu cầu Node.js 22+ (có sẵn fetch).
 */
const BASE = (process.env.MOCKAPI_BASE_URL || 'https://6acefe39f338359cf1c3d55a.mockapi.io').replace(/\/+$/, '');
const VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

const categorySeeds = [
  { name: 'Lập trình Mobile', description: 'Android, Flutter, React Native' },
  { name: 'Lập trình Web', description: 'Frontend và Backend' },
  { name: 'Trí tuệ nhân tạo', description: 'AI, Machine Learning, Deep Learning' },
];

const courseSeeds = [
  ['Lập trình Android cơ bản', 'Xây dựng ứng dụng Android với Kotlin', 'Lập trình Mobile', 'Nguyễn Văn A', 500000, 30, 'android'],
  ['React Native từ cơ bản', 'Xây dựng ứng dụng đa nền tảng với Expo', 'Lập trình Mobile', 'Trần Thị B', 650000, 36, 'react-native'],
  ['Flutter thực hành', 'Thiết kế giao diện và quản lý trạng thái Flutter', 'Lập trình Mobile', 'Lê Văn C', 550000, 28, 'flutter'],
  ['JavaScript hiện đại', 'ES6, bất đồng bộ và lập trình web', 'Lập trình Web', 'Phạm Thị D', 400000, 24, 'javascript'],
  ['ReactJS cho người mới', 'Component, hooks và xây dựng SPA', 'Lập trình Web', 'Ngô Văn E', 600000, 32, 'reactjs'],
  ['Node.js và Express', 'Xây dựng REST API và kết nối cơ sở dữ liệu', 'Lập trình Web', 'Đỗ Thị F', 700000, 40, 'nodejs'],
  ['HTML CSS thực chiến', 'Responsive layout và giao diện website', 'Lập trình Web', 'Hoàng Văn G', 300000, 20, 'html-css'],
  ['Python cho AI', 'Python, NumPy và Pandas dành cho AI', 'Trí tuệ nhân tạo', 'Bùi Thị H', 750000, 44, 'python-ai'],
  ['Machine Learning cơ bản', 'Hồi quy, phân loại và đánh giá mô hình', 'Trí tuệ nhân tạo', 'Vũ Văn I', 900000, 48, 'machine-learning'],
  ['Deep Learning nhập môn', 'Mạng nơ-ron và TensorFlow', 'Trí tuệ nhân tạo', 'Dương Thị K', 1000000, 50, 'deep-learning'],
];

async function request(path, method = 'GET', data) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
  } catch (e) { throw new Error(`Không kết nối được ${BASE}: ${e.message}`); }
  if (!response.ok) throw new Error(`${method} ${path} -> HTTP ${response.status}. Kiểm tra endpoint và schema MockAPI.`);
  return response.json();
}

async function main() {
  console.log(`\nĐang nạp dữ liệu mẫu lên: ${BASE}`);
  if (BASE.includes('YOUR_') || !BASE.startsWith('https://')) throw new Error('Bạn chưa cấu hình URL MockAPI hợp lệ.');
  const categories = await request('/categories');
  if (!Array.isArray(categories)) throw new Error('/categories không trả về mảng JSON.');
  for (const seed of categorySeeds) {
    if (categories.some((c) => c.name === seed.name)) { console.log(`= Đã có danh mục: ${seed.name}`); continue; }
    const created = await request('/categories', 'POST', seed);
    if (!created?.id || created?.name !== seed.name) throw new Error('Schema categories không đúng. Hãy kiểm tra id (Object ID), name, description trong Edit.');
    categories.push(created);
    console.log(`+ Danh mục: ${seed.name} [id=${created.id}]`);
  }

  const courses = await request('/courses');
  if (!Array.isArray(courses)) throw new Error('/courses không trả về mảng JSON.');
  for (const [title, description, categoryName, instructor, price, duration, imageSeed] of courseSeeds) {
    if (courses.some((c) => c.title === title)) { console.log(`= Đã có khóa học: ${title}`); continue; }
    const category = categories.find((c) => c.name === categoryName);
    if (!category) throw new Error(`Không tìm thấy danh mục ${categoryName}`);
    const created = await request('/courses', 'POST', {
      title, description, categoryId: String(category.id), instructor, price, duration,
      thumbnail: `https://picsum.photos/seed/course-${imageSeed}/900/540`,
      trailerUrl: VIDEO, // Video mẫu công khai để kiểm tra trình phát.
      createdAt: new Date().toISOString(),
    });
    if (!created?.id || created?.title !== title || String(created?.categoryId) !== String(category.id)) {
      throw new Error('Schema courses có thể chưa khai báo đúng title, categoryId. Vào Edit để kiểm tra đủ 10 field.');
    }
    courses.push(created);
    console.log(`+ Khóa học: ${title} [id=${created.id}]`);
  }
  console.log(`\nXONG: ${categories.length} danh mục, ${courses.length} khóa học (bao gồm dữ liệu có sẵn).`);
  console.log('Mở app bằng: npm run web hoặc npm start');
}

if (require.main === module) {
  main().catch((e) => {
    console.error('\nLỖI:', e.message);
    console.error('Nếu URL API khác, sửa src/config.js và đặt MOCKAPI_BASE_URL trước khi seed.');
    process.exitCode = 1;
  });
}
module.exports = { categorySeeds, courseSeeds, request, main };
