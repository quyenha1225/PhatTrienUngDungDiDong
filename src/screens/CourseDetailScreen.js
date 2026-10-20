import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { api } from '../api';
import { Button, Cover, Loading, money } from '../components';
import { colors, styles } from '../theme';

export default function CourseDetailScreen({ id, categories, onEdit, onDelete, onVideo }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getCourse(id).then((data) => { if (active) { setCourse(data); setError(''); } })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <Loading label="Đang lấy chi tiết qua GET /courses/:id ..." />;
  if (error) return <View style={styles.page}><Text style={{ color: colors.red }}>{error}</Text></View>;
  if (!course) return <View style={styles.page}><Text>Không tìm thấy khóa học.</Text></View>;
  const categoryName = categories.find((item) => String(item.id) === String(course.categoryId))?.name || 'Chưa xác định';

  return <ScrollView contentContainerStyle={styles.page}>
    <Cover uri={course.thumbnail} style={styles.imageHero} />
    <View style={styles.badge}><Text style={styles.badgeText}>{categoryName}</Text></View>
    <Text style={[styles.heading, { marginTop: 6 }]}>{course.title}</Text>
    <Text style={styles.subtitle}>{course.description}</Text>

    <View style={styles.card}>
      <Info title="Giảng viên" value={course.instructor} />
      <Info title="Học phí" value={money(course.price)} />
      <Info title="Thời lượng" value={`${course.duration} giờ`} />
      <Info title="Mã danh mục (categoryId)" value={String(course.categoryId)} />
      <Info title="ID khóa học" value={String(course.id)} />
      <Info title="Ngày tạo" value={course.createdAt ? String(course.createdAt).substring(0, 10) : 'Chưa có'} last />
    </View>
    <Button title="▶  Xem trailer" onPress={() => onVideo(course)} style={{ marginBottom: 12 }} />
    <View style={styles.horizontal}>
      <Button title="✎  Chỉnh sửa" variant="outline" style={{ flex: 1 }} onPress={() => onEdit(course)} />
      <Button title="🗑  Xóa khóa học" variant="danger" style={{ flex: 1 }} onPress={() => onDelete(course)} />
    </View>
  </ScrollView>;
}

function Info({ title, value, last }) {
  return <View style={{ paddingVertical: 10, borderBottomWidth: last ? 0 : 1, borderColor: colors.line }}>
    <Text style={styles.small}>{title}</Text>
    <Text style={{ fontWeight: '700', color: colors.text, fontSize: 15 }}>{value}</Text>
  </View>;
}
