import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { api } from './src/api';
import { confirmAction, notify } from './src/components';
import { colors, styles } from './src/theme';
import CoursesScreen from './src/screens/CoursesScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import CourseFormScreen from './src/screens/CourseFormScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import VideoScreen from './src/screens/VideoScreen';

export default function App() {
  const [page, setPage] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [videoCourse, setVideoCourse] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [courseItems, categoryItems] = await Promise.all([api.getCourses(), api.getCategories()]);
      if (!Array.isArray(courseItems) || !Array.isArray(categoryItems)) {
        throw new Error('API phải trả về mảng JSON cho /courses và /categories.');
      }
      setCourses(courseItems);
      setCategories(categoryItems);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh().catch(() => {}); }, [refresh]);
  const back = useCallback(() => {
    if (page === 'video') { setPage('detail'); return true; }
    if (page === 'form') { setPage(editingCourse?.id ? 'detail' : 'courses'); return true; }
    if (page !== 'courses') { setPage('courses'); return true; }
    return false;
  }, [page, editingCourse]);
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const listener = BackHandler.addEventListener('hardwareBackPress', back);
    return () => listener.remove();
  }, [back]);

  function openDetail(id) { setSelectedId(String(id)); setPage('detail'); }
  function openAdd() { setEditingCourse(null); setPage('form'); }
  function openEdit(course) { setEditingCourse(course); setPage('form'); }
  async function formDone(message) {
    await refresh();
    setPage('courses');
    notify(message, 'Thành công');
  }
  function deleteCourse(course) {
    confirmAction('Xóa khóa học?', `Bạn chắc chắn muốn xóa "${course.title}"?`, async () => {
      try {
        await api.deleteCourse(course.id);
        await refresh();
        setPage('courses');
        notify('Khóa học đã được xóa.', 'Thành công');
      } catch (err) { notify(err.message, 'Lỗi xóa'); }
    });
  }

  const pageTitles = {
    courses: '📘  COURSE MANAGER',
    detail: 'Chi tiết khóa học',
    form: editingCourse ? 'Sửa khóa học' : 'Thêm khóa học',
    categories: 'Quản lý danh mục',
    video: 'Xem trailer',
  };

  return <SafeAreaView style={styles.root}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <View style={styles.header}>
      {page !== 'courses' && <TouchableOpacity onPress={back} style={{ paddingVertical: 6, paddingRight: 16 }}>
        <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 19 }}>←</Text>
      </TouchableOpacity>}
      <Text style={styles.headerTitle}>{pageTitles[page]}</Text>
      {page === 'courses' && <TouchableOpacity onPress={() => setPage('categories')}>
        <Text style={{ color: colors.accent, fontWeight: '800' }}>Danh mục</Text>
      </TouchableOpacity>}
    </View>

    {page === 'courses' && <CoursesScreen courses={courses} categories={categories}
      loading={loading} error={error} refresh={() => refresh().catch(() => {})}
      onDetail={openDetail} onAdd={openAdd} onCategories={() => setPage('categories')} />}
    {page === 'detail' && <CourseDetailScreen id={selectedId} categories={categories}
      onEdit={openEdit} onDelete={deleteCourse}
      onVideo={(course) => { setVideoCourse(course); setPage('video'); }} />}
    {page === 'form' && <CourseFormScreen course={editingCourse} categories={categories}
      onDone={formDone} onCategories={() => setPage('categories')} />}
    {page === 'categories' && <CategoriesScreen categories={categories} courses={courses}
      loading={loading} refresh={refresh} />}
    {page === 'video' && videoCourse && <VideoScreen course={videoCourse} />}
  </SafeAreaView>;
}
