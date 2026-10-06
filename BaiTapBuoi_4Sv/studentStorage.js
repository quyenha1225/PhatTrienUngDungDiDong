import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENT_KEY = '@student_manager_students';

// LẤY DANH SÁCH SINH VIÊN
export const getStudents = async () => {
  try {
    const data = await AsyncStorage.getItem(STUDENT_KEY);

    if (data) {
      return JSON.parse(data);
    }

    return [];
  } catch (error) {
    console.log('Lỗi lấy dữ liệu:', error);
    return [];
  }
};

// LƯU DANH SÁCH SINH VIÊN
export const saveStudents = async (students) => {
  try {
    await AsyncStorage.setItem(
      STUDENT_KEY,
      JSON.stringify(students)
    );

    return true;
  } catch (error) {
    console.log('Lỗi lưu dữ liệu:', error);
    return false;
  }
};

// THÊM SINH VIÊN
export const addStudent = async (student) => {
  const students = await getStudents();

  students.push(student);

  return await saveStudents(students);
};

// SỬA SINH VIÊN
export const updateStudent = async (updatedStudent) => {
  const students = await getStudents();

  const newStudents = students.map((student) => {
    if (student.id === updatedStudent.id) {
      return updatedStudent;
    }

    return student;
  });

  return await saveStudents(newStudents);
};

// ===============================
// XÓA SINH VIÊN
// ===============================
export const deleteStudent = async (studentId) => {
  const students = await getStudents();

  const newStudents = students.filter(
    (student) => student.id !== studentId
  );

  return await saveStudents(newStudents);
};