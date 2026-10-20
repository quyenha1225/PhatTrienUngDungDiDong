import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from './studentStorage';

// ======================================================
// NGÔN NGỮ
// ======================================================

const deviceLanguage =
  typeof navigator !== 'undefined' && navigator.language
    ? navigator.language
    : 'vi-VN';

const isEnglish = deviceLanguage.startsWith('en');

const TEXT = {
  vi: {
    appName: 'Quản lý sinh viên',
    studentList: 'Danh sách sinh viên',
    addStudent: 'Thêm sinh viên',
    studentDetail: 'Thông tin sinh viên',
    editStudent: 'Sửa thông tin sinh viên',

    fullName: 'Họ tên sinh viên',
    studentId: 'Mã số sinh viên',
    email: 'Email',
    avatar: 'Link ảnh Avatar',

    save: 'Lưu',
    edit: 'Sửa',
    delete: 'Xóa',
    back: 'Quay lại',

    noStudents: 'Chưa có sinh viên nào',
    confirmEdit: 'Bạn có muốn sửa thông tin SV này không?',
    confirmDelete: 'Bạn có muốn xóa thông tin SV này không?',

    yes: 'Có',
    no: 'Không',

    success: 'Thành công',
    addSuccess: 'Đã thêm sinh viên thành công!',
    updateSuccess: 'Đã cập nhật sinh viên thành công!',
    deleteSuccess: 'Đã xóa sinh viên!',

    error: 'Thông báo lỗi',
    errRequired: 'Vui lòng điền đầy đủ Họ tên, Mã sinh viên và Email.',
    errNameLength: 'Họ tên phải có ít nhất 2 ký tự.',
    errStudentIdFormat: 'Mã số sinh viên chỉ gồm chữ và số, độ dài từ 4 đến 15 ký tự.',
    errEmailFormat: 'Email không hợp lệ (Ví dụ hợp lệ: name@example.com).',
    errDuplicateId: 'Mã số sinh viên đã tồn tại trên hệ thống.',
    errDuplicateEmail: 'Email này đã được sử dụng bởi sinh viên khác.',
    errAvatarUrl: 'Đường dẫn ảnh đại diện phải bắt đầu bằng http:// hoặc https://',
  },

  en: {
    appName: 'Student Manager',
    studentList: 'Student List',
    addStudent: 'Add Student',
    studentDetail: 'Student Details',
    editStudent: 'Edit Student',

    fullName: 'Full Name',
    studentId: 'Student ID',
    email: 'Email',
    avatar: 'Avatar Image URL',

    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',

    noStudents: 'No students yet',
    confirmEdit: 'Do you want to edit this student?',
    confirmDelete: 'Do you want to delete this student?',

    yes: 'Yes',
    no: 'No',

    success: 'Success',
    addSuccess: 'Student added successfully!',
    updateSuccess: 'Student updated successfully!',
    deleteSuccess: 'Student deleted successfully!',

    error: 'Validation Error',
    errRequired: 'Please fill in full name, student ID, and email.',
    errNameLength: 'Full name must be at least 2 characters long.',
    errStudentIdFormat: 'Student ID must be alphanumeric and between 4-15 characters.',
    errEmailFormat: 'Invalid email address format (e.g. name@example.com).',
    errDuplicateId: 'This student ID already exists.',
    errDuplicateEmail: 'This email is already in use.',
    errAvatarUrl: 'Avatar link must start with http:// or https://',
  },
};

const t = isEnglish ? TEXT.en : TEXT.vi;

// Thông báo cross-platform (Web & Mobile)
const showNotification = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// ======================================================
// HÀM VALIDATE DỮ LIỆU
// ======================================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STUDENT_ID_REGEX = /^[a-zA-Z0-9_-]{4,15}$/;

const validateStudent = (data, currentList, editingId = null) => {
  const name = (data.fullName || '').trim();
  const studentId = (data.studentId || '').trim();
  const email = (data.email || '').trim();
  const avatar = (data.avatar || '').trim();

  // 1. Kiểm tra trường bắt buộc
  if (!name || !studentId || !email) {
    return t.errRequired;
  }

  // 2. Kiểm tra độ dài họ tên
  if (name.length < 2) {
    return t.errNameLength;
  }

  // 3. Kiểm tra định dạng MSSV
  if (!STUDENT_ID_REGEX.test(studentId)) {
    return t.errStudentIdFormat;
  }

  // 4. Kiểm tra định dạng Email
  if (!EMAIL_REGEX.test(email)) {
    return t.errEmailFormat;
  }

  // 5. Kiểm tra trùng lặp MSSV
  const isDuplicateId = currentList.some(
    (s) =>
      s.studentId.trim().toLowerCase() === studentId.toLowerCase() &&
      s.id !== editingId
  );
  if (isDuplicateId) {
    return t.errDuplicateId;
  }

  // 6. Kiểm tra trùng lặp Email
  const isDuplicateEmail = currentList.some(
    (s) =>
      s.email.trim().toLowerCase() === email.toLowerCase() &&
      s.id !== editingId
  );
  if (isDuplicateEmail) {
    return t.errDuplicateEmail;
  }

  // 7. Kiểm tra link Avatar (nếu có nhập)
  if (avatar && !avatar.startsWith('http://') && !avatar.startsWith('https://')) {
    return t.errAvatarUrl;
  }

  return null; // Không có lỗi
};

// ======================================================
// APP
// ======================================================

export default function App() {
  const [screen, setScreen] = useState('list'); // 'list' | 'detail' | 'form'
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openDetail = (student) => {
    setSelectedStudent(student);
    setScreen('detail');
  };

  const openAddForm = () => {
    setEditingStudent(null);
    setScreen('form');
  };

  // Mở form sửa (Tương thích Web & Mobile)
  const openEditForm = () => {
    if (!selectedStudent) return;

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(t.confirmEdit);
      if (confirmed) {
        setEditingStudent(selectedStudent);
        setScreen('form');
      }
    } else {
      Alert.alert(t.editStudent, t.confirmEdit, [
        { text: t.no, style: 'cancel' },
        {
          text: t.yes,
          onPress: () => {
            setEditingStudent(selectedStudent);
            setScreen('form');
          },
        },
      ]);
    }
  };

  // Xóa sinh viên (Tương thích Web & Mobile)
  const handleDelete = () => {
    if (!selectedStudent) return;

    const executeDelete = async () => {
      const studentId = selectedStudent.id;
      await deleteStudent(studentId);

      const newStudents = students.filter((s) => s.id !== studentId);
      setStudents(newStudents);
      setSelectedStudent(null);
      setScreen('list');

      showNotification(t.success, t.deleteSuccess);
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(t.confirmDelete);
      if (confirmed) {
        executeDelete();
      }
    } else {
      Alert.alert(t.delete, t.confirmDelete, [
        { text: t.no, style: 'cancel' },
        {
          text: t.yes,
          style: 'destructive',
          onPress: executeDelete,
        },
      ]);
    }
  };

  // Lưu thông tin sinh viên có validate
  const handleSaveStudent = async (studentData) => {
    // Thực thi validate
    const errorMsg = validateStudent(
      studentData,
      students,
      editingStudent ? editingStudent.id : null
    );

    if (errorMsg) {
      showNotification(t.error, errorMsg);
      return;
    }

    // THÊM MỚI
    if (!editingStudent) {
      const newStudent = {
        id: Date.now().toString(),
        fullName: studentData.fullName.trim(),
        studentId: studentData.studentId.trim(),
        email: studentData.email.trim(),
        avatar: studentData.avatar.trim(),
      };

      await addStudent(newStudent);
      const newStudents = [...students, newStudent];
      setStudents(newStudents);

      showNotification(t.success, t.addSuccess);
      setScreen('list');
      return;
    }

    // CẬP NHẬT / SỬA
    const updatedStudent = {
      ...editingStudent,
      fullName: studentData.fullName.trim(),
      studentId: studentData.studentId.trim(),
      email: studentData.email.trim(),
      avatar: studentData.avatar.trim(),
    };

    await updateStudent(updatedStudent);

    const newStudents = students.map((s) =>
      s.id === updatedStudent.id ? updatedStudent : s
    );

    setStudents(newStudents);
    setSelectedStudent(updatedStudent);
    setEditingStudent(null);

    showNotification(t.success, t.updateSuccess);
    setScreen('detail');
  };

  // ====================================================
  // TRANG 1: DANH SÁCH SINH VIÊN
  // ====================================================
  if (screen === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.appName}</Text>
          <Text style={styles.headerSubtitle}>{t.studentList}</Text>
        </View>

        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            students.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          ListEmptyComponent={
            <View>
              <Text style={styles.emptyText}>{t.noStudents}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.studentCard}
              onPress={() => openDetail(item)}
            >
              <Image
                source={{
                  uri: item.avatar || 'https://i.pravatar.cc/150',
                }}
                style={styles.avatar}
              />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.fullName}</Text>
                <Text style={styles.studentId}>
                  {t.studentId}: {item.studentId}
                </Text>
                <Text style={styles.studentEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={openAddForm}>
          <Text style={styles.addButtonText}>+ {t.addStudent}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ====================================================
  // TRANG 2: CHI TIẾT SINH VIÊN
  // ====================================================
  if (screen === 'detail' && selectedStudent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setScreen('list')}>
              <Text style={styles.backText}>← {t.back}</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>{t.studentDetail}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Image
              source={{
                uri: selectedStudent.avatar || 'https://i.pravatar.cc/150',
              }}
              style={styles.detailAvatar}
            />

            <Text style={styles.detailName}>{selectedStudent.fullName}</Text>

            <View style={styles.detailBox}>
              <Text style={styles.label}>{t.studentId}</Text>
              <Text style={styles.value}>{selectedStudent.studentId}</Text>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.label}>{t.email}</Text>
              <Text style={styles.value}>{selectedStudent.email}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={openEditForm}
              >
                <Text style={styles.buttonText}>{t.edit}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>{t.delete}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ====================================================
  // TRANG 3: THÊM / SỬA SINH VIÊN
  // ====================================================
  return (
    <StudentForm
      student={editingStudent}
      onSave={handleSaveStudent}
      onBack={() => {
        setEditingStudent(null);
        if (selectedStudent) {
          setScreen('detail');
        } else {
          setScreen('list');
        }
      }}
      language={t}
    />
  );
}

// ======================================================
// FORM COMPONENT (TRANG 3)
// ======================================================

function StudentForm({ student, onSave, onBack, language }) {
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [studentId, setStudentId] = useState(student?.studentId || '');
  const [email, setEmail] = useState(student?.email || '');
  const [avatar, setAvatar] = useState(student?.avatar || '');

  const handleSave = () => {
    onSave({
      fullName,
      studentId,
      email,
      avatar,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← {language.back}</Text>
        </TouchableOpacity>

        <Text style={styles.formTitle}>
          {student ? language.editStudent : language.addStudent}
        </Text>

        {/* HỌ TÊN */}
        <Text style={styles.inputLabel}>{language.fullName}</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder={language.fullName}
        />

        {/* MSSV */}
        <Text style={styles.inputLabel}>{language.studentId}</Text>
        <TextInput
          style={styles.input}
          value={studentId}
          onChangeText={setStudentId}
          placeholder={language.studentId}
          autoCapitalize="characters"
        />

        {/* EMAIL */}
        <Text style={styles.inputLabel}>{language.email}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={language.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* AVATAR */}
        <Text style={styles.inputLabel}>{language.avatar}</Text>
        <TextInput
          style={styles.input}
          value={avatar}
          onChangeText={setAvatar}
          placeholder="https://images.unsplash.com/..."
          autoCapitalize="none"
        />

        {/* XEM TRƯỚC AVATAR */}
        {avatar.trim() !== '' && (
          <Image source={{ uri: avatar }} style={styles.previewAvatar} />
        )}

        {/* NÚT LƯU */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>{language.save}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 25,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#dbeafe',
    fontSize: 16,
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#ddd',
  },
  studentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  studentId: {
    marginTop: 5,
    color: '#4b5563',
  },
  studentEmail: {
    marginTop: 3,
    color: '#6b7280',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  detailHeader: {
    padding: 20,
  },
  backText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
  },
  detailContainer: {
    padding: 25,
    alignItems: 'center',
  },
  detailAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
  },
  detailName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#111827',
  },
  detailBox: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 25,
    paddingBottom: 50,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 25,
    color: '#111827',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 12,
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
  },
  previewAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
});