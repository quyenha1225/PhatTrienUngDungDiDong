// Hàm thuần (không phụ thuộc React Native), dễ đọc và dễ viết test.
export function isHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch (_) { return false; }
}

export function validateCourse(form, categories) {
  const title = String(form.title || '').trim();
  const description = String(form.description || '').trim();
  const instructor = String(form.instructor || '').trim();
  const priceText = String(form.price ?? '').trim().replace(',', '.');
  const durationText = String(form.duration ?? '').trim().replace(',', '.');
  const price = Number(priceText);
  const duration = Number(durationText);
  const thumbnail = String(form.thumbnail || '').trim();
  const trailerUrl = String(form.trailerUrl || '').trim();
  const categoryId = String(form.categoryId || '');

  if (!title) return 'Bạn chưa nhập tên khóa học.';
  if (!description) return 'Bạn chưa nhập mô tả khóa học.';
  if (!instructor) return 'Bạn chưa nhập tên giảng viên.';
  if (!categories.some((category) => String(category.id) === categoryId)) {
    return 'Hãy chọn một danh mục hợp lệ từ MockAPI.';
  }
  if (!priceText || !Number.isFinite(price) || price < 0) {
    return 'Học phí phải là một số không âm.';
  }
  if (!durationText || !Number.isFinite(duration) || duration <= 0) {
    return 'Thời lượng phải là số lớn hơn 0.';
  }
  if (!isHttpUrl(thumbnail)) return 'URL ảnh phải bắt đầu bằng http:// hoặc https://';
  if (!isHttpUrl(trailerUrl)) return 'URL trailer phải bắt đầu bằng http:// hoặc https://';
  if (!/\.mp4(?:\?|#|$)/i.test(trailerUrl)) {
    return 'Để phát trực tiếp trong ứng dụng, hãy nhập URL video MP4 (kết thúc bằng .mp4).';
  }
  return null;
}

export function coursePayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    categoryId: String(form.categoryId),
    instructor: form.instructor.trim(),
    price: Number(String(form.price).replace(',', '.')),
    duration: Number(String(form.duration).replace(',', '.')),
    thumbnail: form.thumbnail.trim(),
    trailerUrl: form.trailerUrl.trim(),
  };
}

export function categoryUsageCount(categoryId, courses) {
  return courses.filter((course) => String(course.categoryId) === String(categoryId)).length;
}
