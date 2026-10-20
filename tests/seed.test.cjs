/** Test seeding tại bộ nhớ: tuyệt đối KHÔNG gọi MockAPI thật. */
const assert = require('node:assert/strict');
const { main } = require('../scripts/seed.cjs');
const state = { categories: [], courses: [] };
let nextId = 1;
global.fetch = async (url, options = {}) => {
  const path = new URL(url).pathname;
  const resource = path.slice(1);
  if (!(resource in state)) throw Error(`Unexpected resource: ${resource}`);
  if (options.method === 'POST') {
    const item = { ...JSON.parse(options.body), id: String(nextId++) };
    state[resource].push(item);
    return { ok: true, json: async () => item };
  }
  return { ok: true, json: async () => JSON.parse(JSON.stringify(state[resource])) };
};
(async () => {
  await main();
  assert.equal(state.categories.length, 3);
  assert.equal(state.courses.length, 10);
  for (const course of state.courses) {
    assert.equal(typeof course.price, 'number');
    assert.equal(typeof course.duration, 'number');
    assert.ok(state.categories.some(cat => cat.id === course.categoryId));
    assert.ok(course.trailerUrl.endsWith('.mp4'));
    assert.ok(course.thumbnail.startsWith('https://'));
  }
  await main();
  assert.equal(state.categories.length, 3, 'seed danh mục không bị trùng');
  assert.equal(state.courses.length, 10, 'seed khóa học không bị trùng');
  console.log('\nPASS: Seed đúng 3 danh mục, 10 khóa học, quan hệ categoryId, và chống tạo trùng.');
})().catch(err => { console.error(err); process.exitCode = 1; });
