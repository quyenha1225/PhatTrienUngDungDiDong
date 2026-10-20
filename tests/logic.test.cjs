const assert = require('node:assert/strict');
const { isHttpUrl, validateCourse, coursePayload, categoryUsageCount } = require('../src/validation.js');

const categories = [{ id: '1', name: 'Lập trình Mobile' }, { id: '2', name: 'Lập trình Web' }];
const valid = {
  title: 'React Native', description: 'Lập trình mobile', categoryId: '1',
  instructor: 'Giảng viên A', price: '500000', duration: '30',
  thumbnail: 'https://picsum.photos/seed/demo/900/540',
  trailerUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
};
const cases = [
  ['URL hợp lệ', isHttpUrl(valid.thumbnail), true],
  ['URL sai giao thức', isHttpUrl('file:///test.jpg'), false],
  ['Khóa học hợp lệ', validateCourse(valid, categories), null],
  ['Không có category hợp lệ', Boolean(validateCourse({ ...valid, categoryId: '99' }, categories)), true],
  ['Không được âm học phí', Boolean(validateCourse({ ...valid, price: '-1' }, categories)), true],
  ['Không được âm thời lượng', Boolean(validateCourse({ ...valid, duration: '0' }, categories)), true],
  ['Link Youtube không dùng như MP4 trực tiếp', Boolean(validateCourse({ ...valid, trailerUrl: 'https://youtube.com/watch?v=abc' }, categories)), true],
  ['Đổi giá thành số', coursePayload(valid).price, 500000],
  ['Đếm khóa học theo ID danh mục', categoryUsageCount(1, [{ categoryId: '1' }, { categoryId: '2' }]), 1],
];
for (const [name, actual, expected] of cases) {
  assert.deepEqual(actual, expected);
  console.log(`✓ ${name}`);
}
console.log(`\n${cases.length} bài kiểm tra logic thành công.`);
