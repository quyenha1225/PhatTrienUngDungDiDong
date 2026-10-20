import React, { useMemo, useState } from 'react';
import { Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button, Cover, Empty, Loading, money } from '../components';
import { colors, styles } from '../theme';

export default function CoursesScreen({ courses, categories, loading, error, refresh, onDetail, onAdd, onCategories }) {
  const [keyword, setKeyword] = useState('');
  const [filterId, setFilterId] = useState('all');
  const visibleCourses = useMemo(() => courses.filter((item) => {
    const matchName = String(item.title || '').toLocaleLowerCase('vi-VN')
      .includes(keyword.trim().toLocaleLowerCase('vi-VN'));
    return matchName && (filterId === 'all' || String(item.categoryId) === filterId);
  }), [courses, keyword, filterId]);
  const getCategory = (id) => categories.find((c) => String(c.id) === String(id))?.name || 'Chưa xác định';

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.page}
      refreshControl={Platform.OS === 'web' ? undefined :
        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}>
      <View style={[styles.card, { backgroundColor: colors.navy, padding: 20, marginBottom: 18 }]}>
        <Text style={{ color: '#B8C5FF', fontWeight: '700', fontSize: 12, marginBottom: 8 }}>COURSE MANAGEMENT</Text>
        <Text style={{ color: '#fff', fontSize: 25, fontWeight: '800', marginBottom: 8 }}>Khám phá khóa học ✨</Text>
        <Text style={{ color: '#D6DFFF', lineHeight: 20 }}>Quản lý khóa học với dữ liệu từ MockAPI.</Text>
        <View style={[styles.horizontal, { marginTop: 16 }]}>
          <View style={{ flex: 1 }}><Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>{courses.length}</Text>
            <Text style={{ color: '#CAD3FF', fontSize: 11 }}>Khóa học</Text></View>
          <View style={{ flex: 1 }}><Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>{categories.length}</Text>
            <Text style={{ color: '#CAD3FF', fontSize: 11 }}>Danh mục</Text></View>
        </View>
      </View>

      <View style={[styles.horizontal, { marginBottom: 14 }]}>
        <TextInput value={keyword} onChangeText={setKeyword}
          placeholder="🔎  Tìm tên khóa học..." placeholderTextColor="#99A3B5"
          style={[styles.input, { flex: 1, backgroundColor: '#fff' }]} />
        <Button title="+ Thêm" onPress={onAdd} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
        {[{ id: 'all', name: 'Tất cả' }, ...categories].map((category) => (
          <TouchableOpacity key={category.id} onPress={() => setFilterId(String(category.id))}
            style={[styles.chip, filterId === String(category.id) && styles.chipActive]}>
            <Text style={[styles.chipText, filterId === String(category.id) && styles.chipTextActive]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={[styles.horizontal, { justifyContent: 'space-between', marginBottom: 10 }]}>
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 17 }}>Khóa học ({visibleCourses.length})</Text>
        <TouchableOpacity onPress={refresh}><Text style={{ color: colors.accent, fontWeight: '700' }}>↻ Tải lại</Text></TouchableOpacity>
      </View>
      {error ? <View style={styles.empty}>
        <Text style={{ color: colors.red, textAlign: 'center' }}>{error}</Text>
        <Button title="Thử lại" onPress={refresh} style={{ marginTop: 12 }} />
      </View> : loading && courses.length === 0 ? <Loading /> : visibleCourses.length === 0 ?
        <Empty title={keyword || filterId !== 'all' ? 'Không tìm thấy khóa học' : 'Chưa có khóa học'}
          description={keyword || filterId !== 'all' ? 'Thử đổi từ khóa hoặc bộ lọc.' : 'Bấm + Thêm để tạo khóa học đầu tiên, hoặc chạy lệnh npm run seed.'} /> :
        visibleCourses.map((item) => <TouchableOpacity key={String(item.id)} activeOpacity={0.85}
          style={styles.card} onPress={() => onDetail(String(item.id))}>
          <View style={styles.courseRow}>
            <Cover uri={item.thumbnail} style={styles.courseImage} />
            <View style={styles.courseContent}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{getCategory(item.categoryId)}</Text></View>
              <Text style={styles.small} numberOfLines={1}>👨‍🏫 {item.instructor}</Text>
              <Text style={styles.price}>{money(item.price)}</Text>
            </View>
          </View>
        </TouchableOpacity>)}
    </ScrollView>
  );
}
