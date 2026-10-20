import { API_BASE_URL } from './config';

const BASE = API_BASE_URL.replace(/\/+$/, '');

/** Chung cho GET/POST/PUT/DELETE. Lỗi HTTP được chuyển thành Error dễ đọc. */
export async function request(path, options = {}) {
  const headers = { Accept: 'application/json' };
  if (options.body != null) headers['Content-Type'] = 'application/json';
  let response;
  try {
    response = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch (_) {
    throw new Error('Không thể kết nối MockAPI. Kiểm tra Internet và API_BASE_URL.');
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    let reason = '';
    try { reason = JSON.parse(body)?.message || ''; } catch (_) { reason = ''; }
    if (response.status === 404) throw new Error('Không tìm thấy API hoặc bản ghi. Kiểm tra URL/resource.');
    throw new Error(reason || `Máy chủ trả về lỗi HTTP ${response.status}.`);
  }
  if (response.status === 204) return null;
  const body = await response.text();
  if (!body) return null;
  try { return JSON.parse(body); }
  catch (_) { throw new Error('MockAPI trả về dữ liệu JSON không hợp lệ.'); }
}

export const api = {
  getCourses: () => request('/courses'),
  getCourse: (id) => request(`/courses/${encodeURIComponent(id)}`),
  addCourse: (course) => request('/courses', { method: 'POST', body: JSON.stringify(course) }),
  editCourse: (id, course) => request(`/courses/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(course) }),
  deleteCourse: (id) => request(`/courses/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getCategories: () => request('/categories'),
  addCategory: (category) => request('/categories', { method: 'POST', body: JSON.stringify(category) }),
  editCategory: (id, category) => request(`/categories/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(category) }),
  deleteCategory: (id) => request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
