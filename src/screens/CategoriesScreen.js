import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../api';
import { Button, confirmAction, Empty, Field, Loading, notify } from '../components';
import { colors, styles } from '../theme';
import { categoryUsageCount } from '../validation';

export default function CategoriesScreen({ categories, courses, loading, refresh }) {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function openModal(category = null) {
    setEditing(category);
    setName(category?.name || '');
    setDescription(category?.description || '');
    setError('');
    setVisible(true);
  }

  async function save() {
    if (!name.trim() || !description.trim()) {
      setError('Bạn phải nhập tên danh mục và mô tả.'); return;
    }
    if (categories.some((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      String(c.id) !== String(editing?.id))) {
      setError('Tên danh mục đã tồn tại.'); return;
    }
    setBusy(true);
    try {
      const payload = { name: name.trim(), description: description.trim() };
      if (editing) await api.editCategory(editing.id, payload);
      else await api.addCategory(payload);
      await refresh();
      setVisible(false);
      notify(editing ? 'Đã cập nhật danh mục.' : 'Đã thêm danh mục.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function remove(category) {
    setBusy(true);
    try {
      // Đọc dữ liệu MỚI từ API, không chỉ dựa trên danh sách đang hiển thị.
      const latestCourses = await api.getCourses();
      const usage = categoryUsageCount(category.id, latestCourses);
      if (usage > 0) {
        notify(`Không thể xóa: danh mục này đang chứa ${usage} khóa học.`, 'Không thể xóa');
        return;
      }
      await api.deleteCategory(category.id);
      await refresh();
      notify('Đã xóa danh mục.');
    } catch (err) { notify(err.message, 'Lỗi'); }
    finally { setBusy(false); }
  }

  return <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>Quản lý danh mục</Text>
      <Text style={styles.subtitle}>Thêm, sửa, xóa danh mục qua REST API /categories.</Text>
      <Button title="+ Thêm danh mục mới" onPress={() => openModal()} style={{ marginBottom: 18 }} />
      {loading && categories.length === 0 ? <Loading /> : categories.length === 0 ?
        <Empty title="Chưa có danh mục" description="Bấm Thêm danh mục để tạo dữ liệu đầu tiên." /> :
        categories.map((category) => {
          const usage = categoryUsageCount(category.id, courses);
          return <View style={styles.card} key={category.id}>
            <View style={[styles.horizontal, { justifyContent: 'space-between', marginBottom: 8 }]}>
              <Text style={[styles.itemTitle, { flex: 1 }]}>{category.name}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{usage} khóa học</Text></View>
            </View>
            <Text style={[styles.small, { marginBottom: 14 }]}>{category.description}</Text>
            <View style={styles.horizontal}>
              <Button title="✎ Sửa" variant="outline" style={{ flex: 1 }} disabled={busy} onPress={() => openModal(category)} />
              <Button title="🗑 Xóa" variant="danger" style={{ flex: 1 }} disabled={busy || usage > 0}
                onPress={() => confirmAction('Xóa danh mục?', `Bạn muốn xóa "${category.name}"?`, () => remove(category))} />
            </View>
            {usage > 0 && <Text style={[styles.small, { marginTop: 9 }]}>Không thể xóa khi danh mục đang có khóa học.</Text>}
          </View>;
        })}
    </ScrollView>
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!busy) setVisible(false); }}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{editing ? 'Sửa danh mục' : 'Thêm danh mục'}</Text>
          <Field label="Tên danh mục *" value={name} onChangeText={(v) => { setName(v); setError(''); }} placeholder="VD: Lập trình Web" />
          <Field label="Mô tả *" value={description} onChangeText={(v) => { setDescription(v); setError(''); }} placeholder="VD: Frontend và Backend" multiline />
          {!!error && <Text style={{ color: colors.red, marginBottom: 10 }}>{error}</Text>}
          <View style={styles.horizontal}>
            <Button title="Hủy" variant="outline" style={{ flex: 1 }} disabled={busy} onPress={() => setVisible(false)} />
            <Button title={busy ? 'Đang lưu...' : 'Lưu'} style={{ flex: 1 }} disabled={busy} onPress={save} />
          </View>
        </View>
      </View>
    </Modal>
  </View>;
}
