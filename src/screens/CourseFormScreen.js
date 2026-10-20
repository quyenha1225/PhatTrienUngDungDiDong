import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { api } from '../api';
import { Button, CategoryPicker, Cover, Field, notify } from '../components';
import { styles } from '../theme';
import { coursePayload, validateCourse } from '../validation';

const EMPTY = {
  title: '', description: '', categoryId: '', instructor: '',
  price: '', duration: '', thumbnail: '', trailerUrl: '',
};

export default function CourseFormScreen({ course, categories, onDone, onCategories }) {
  const editing = Boolean(course?.id);
  const [form, setForm] = useState(() => course ? {
    title: String(course.title || ''), description: String(course.description || ''),
    categoryId: String(course.categoryId || ''), instructor: String(course.instructor || ''),
    price: String(course.price ?? ''), duration: String(course.duration ?? ''),
    thumbnail: String(course.thumbnail || ''), trailerUrl: String(course.trailerUrl || ''),
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (name) => (value) => { setForm((previous) => ({ ...previous, [name]: value })); setError(''); };

  async function save() {
    const message = validateCourse(form, categories);
    if (message) { setError(message); return; }
    setSaving(true);
    setError('');
    try {
      const payload = coursePayload(form);
      if (editing) await api.editCourse(course.id, payload);
      else await api.addCourse({ ...payload, createdAt: new Date().toISOString() });
      await onDone(editing ? 'Đã cập nhật khóa học!' : 'Đã thêm khóa học!');
    } catch (err) { setError(err.message); notify(err.message, 'Lỗi lưu khóa học'); }
    finally { setSaving(false); }
  }

  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Text style={styles.heading}>{editing ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}</Text>
    <Text style={styles.subtitle}>Dữ liệu sẽ được gửi lên MockAPI qua {editing ? 'PUT' : 'POST'} /courses.</Text>
    <Field label="Tên khóa học *" value={form.title} onChangeText={set('title')} placeholder="VD: React Native từ cơ bản" />
    <Field label="Mô tả *" multiline value={form.description} onChangeText={set('description')}
      placeholder="Khóa học cung cấp kiến thức..." />
    <CategoryPicker selected={form.categoryId} categories={categories} onSelect={set('categoryId')} />
    {categories.length === 0 && <Button title="Tạo danh mục trước →" variant="outline" onPress={onCategories} style={{ marginBottom: 16 }} />}
    <Field label="Tên giảng viên *" value={form.instructor} onChangeText={set('instructor')} placeholder="VD: Nguyễn Văn A" />
    <Field label="Học phí (VNĐ) *" value={form.price} onChangeText={set('price')} keyboardType="decimal-pad" placeholder="500000" />
    <Field label="Thời lượng (giờ) *" value={form.duration} onChangeText={set('duration')} keyboardType="decimal-pad" placeholder="30" />
    <Field label="URL ảnh bìa *" value={form.thumbnail} onChangeText={set('thumbnail')}
      autoCapitalize="none" placeholder="https://.../anh.jpg" />
    <Text style={[styles.fieldLabel, { marginTop: -5 }]}>Xem trước ảnh</Text>
    <Cover uri={form.thumbnail} style={[styles.imageHero, { height: 165, marginBottom: 17 }]} />
    <Field label="URL trailer MP4 *" value={form.trailerUrl} onChangeText={set('trailerUrl')}
      autoCapitalize="none" placeholder="https://.../video.mp4" />
    <Text style={[styles.small, { marginBottom: 14 }]}>Dùng URL MP4 trực tiếp, không dùng link trang YouTube.</Text>
    {!!error && <Text style={{ color: '#D94151', marginBottom: 12, fontWeight: '700' }}>{error}</Text>}
    <Button title={saving ? 'Đang lưu...' : (editing ? 'Lưu thay đổi' : '+ Tạo khóa học')}
      onPress={save} disabled={saving} style={{ marginBottom: 15 }} />
  </ScrollView>;
}
