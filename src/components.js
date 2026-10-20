import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, styles } from './theme';

export function Button({ title, onPress, variant = 'primary', disabled = false, style }) {
  const outline = variant === 'outline';
  const danger = variant === 'danger';
  return (
    <TouchableOpacity activeOpacity={0.8} disabled={disabled} onPress={onPress}
      style={[styles.button, outline && styles.outlineButton, danger && styles.dangerButton,
        disabled && { opacity: 0.5 }, style]}>
      <Text style={[styles.buttonText, outline && styles.outlineText, danger && styles.dangerText]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, value, onChangeText, placeholder, multiline = false, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, multiline && { height: 98, textAlignVertical: 'top' }]}
        value={String(value ?? '')} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor="#9AA4B5" multiline={multiline} keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'sentences'} />
    </View>
  );
}

export function Cover({ uri, style }) {
  const [badImage, setBadImage] = useState(false);
  useEffect(() => setBadImage(false), [uri]);
  if (!uri || badImage) {
    return (
      <View style={[style, { backgroundColor: colors.accentPale, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 28 }}>📚</Text>
        <Text style={{ color: colors.accent, fontSize: 10 }}>Course</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={style} resizeMode="cover" onError={() => setBadImage(true)} />;
}

export function Loading({ label = 'Đang tải dữ liệu...' }) {
  return <View style={{ alignItems: 'center', justifyContent: 'center', padding: 38, gap: 14 }}>
    <ActivityIndicator size="large" color={colors.accent} />
    <Text style={styles.small}>{label}</Text>
  </View>;
}

export function Empty({ title = 'Chưa có dữ liệu', description }) {
  return <View style={styles.empty}>
    <Text style={{ fontSize: 36 }}>📭</Text>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.emptyText}>{description}</Text>
  </View>;
}

export function notify(message, title = 'Thông báo') {
  if (Platform.OS === 'web') { window.alert(`${title}\n${message}`); return; }
  Alert.alert(title, message);
}

export function confirmAction(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Hủy', style: 'cancel' },
    { text: 'Đồng ý', style: 'destructive', onPress: onConfirm },
  ]);
}

export function CategoryPicker({ selected, categories, onSelect }) {
  const [visible, setVisible] = useState(false);
  const name = categories.find((c) => String(c.id) === String(selected))?.name;
  return <View style={styles.field}>
    <Text style={styles.fieldLabel}>Danh mục khóa học *</Text>
    <TouchableOpacity style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
      onPress={() => setVisible(true)}>
      <Text style={{ color: name ? colors.text : colors.sub }}>{name || 'Chọn danh mục từ MockAPI'}</Text>
      <Text style={{ color: colors.sub }}>▾</Text>
    </TouchableOpacity>
    <Modal animationType="fade" transparent visible={visible} onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Chọn danh mục</Text>
          <ScrollView style={{ maxHeight: 340 }}>
            {categories.length === 0 ? <Text>Chưa có danh mục. Hãy tạo trong Quản lý danh mục.</Text> :
              categories.map((category) => <TouchableOpacity key={category.id}
                onPress={() => { onSelect(String(category.id)); setVisible(false); }}
                style={{ padding: 15, borderBottomWidth: 1, borderColor: colors.line }}>
                <Text style={{ fontWeight: '700', color: colors.text }}>{category.name}</Text>
                <Text style={styles.small}>{category.description}</Text>
              </TouchableOpacity>)}
          </ScrollView>
          <Button title="Đóng" variant="outline" onPress={() => setVisible(false)} style={{ marginTop: 16 }} />
        </View>
      </View>
    </Modal>
  </View>;
}

export function money(value) {
  const number = Number(value);
  return `${Number.isFinite(number) ? number.toLocaleString('vi-VN') : '0'} đ`;
}
