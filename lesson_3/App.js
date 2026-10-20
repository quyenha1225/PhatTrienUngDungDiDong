import React, { useState } from 'react';

import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';


// =====================================================
//                         APP
// =====================================================

export default function App() {

  // ===================================================
  //                  QUẢN LÝ TRANG
  // ===================================================

  const [page, setPage] = useState(1);


  // ===================================================
  //                  DỮ LIỆU SINH VIÊN
  // ===================================================

  const [studentName, setStudentName] = useState('');

  const [studentId, setStudentId] = useState('');


  // ===================================================
  //              KIỂM TRA ĐÃ NHẬP ĐỦ CHƯA
  // ===================================================

  const isValid =
    studentName.trim() !== '' &&
    studentId.trim() !== '';


  // ===================================================
  //                     TRANG 2
  // ===================================================

  if (page === 2) {

    return (
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.page2}>

          {/* Tiêu đề */}

          <Text style={styles.page2Title}>
            TRANG 2
          </Text>


          {/* Thông báo */}

          <Text style={styles.page2Subtitle}>
            THÔNG TIN SINH VIÊN
          </Text>


          {/* Khung thông tin */}

          <View style={styles.infoBox}>

            {/* Tên sinh viên */}

            <Text style={styles.infoLabel}>
              Tên sinh viên:
            </Text>

            <Text style={styles.infoValue}>
              {studentName}
            </Text>


            {/* Mã sinh viên */}

            <Text style={styles.infoLabel}>
              Mã sinh viên:
            </Text>

            <Text style={styles.infoValue}>
              {studentId}
            </Text>

          </View>


          {/* Nút quay lại */}

          <View style={styles.backButton}>

            <Button
              title="QUAY LẠI"
              onPress={() => setPage(1)}
            />

          </View>

        </View>

      </SafeAreaView>
    );
  }


  // ===================================================
  //                     TRANG 1
  // ===================================================

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        {/* =================================================
                            Ô 1
        ================================================= */}

        <View style={styles.box1}>

          <Text style={styles.textWhite}>
            1
          </Text>

        </View>


        {/* =================================================
                            Ô 2
        ================================================= */}

        <View style={styles.box2}>

          <Text style={styles.textWhite}>
            2
          </Text>

        </View>


        {/* =================================================
                    HÀNG Ô 3 - 4 - 5 - TRẮNG
        ================================================= */}

        <View style={styles.middleRow}>

          {/* Ô 3 */}

          <View style={styles.box3}>

            <Text style={styles.textBlack}>
              3
            </Text>

          </View>


          {/* Ô 4 */}

          <View style={styles.box4}>

            <Text style={styles.textWhite}>
              4
            </Text>

          </View>


          {/* Ô 5 */}

          <View style={styles.box5}>

            <Text style={styles.textWhite}>
              5
            </Text>

          </View>


          {/* Ô trắng */}

          <View style={styles.whiteBox} />

        </View>


        {/* =================================================
                            Ô 6
        ================================================= */}

        <View style={styles.box6}>

          <Text style={styles.textWhite}>
            6
          </Text>

        </View>


        {/* =================================================
                      KHU VỰC NHẬP THÔNG TIN
        ================================================= */}

        <View style={styles.inputArea}>

          {/* Ô nhập tên */}

          <TextInput
            style={styles.input}
            placeholder="Nhập tên sinh viên"
            placeholderTextColor="#777"
            value={studentName}
            onChangeText={setStudentName}
          />


          {/* Ô nhập mã sinh viên */}

          <TextInput
            style={styles.input}
            placeholder="Nhập mã sinh viên"
            placeholderTextColor="#777"
            value={studentId}
            onChangeText={setStudentId}
          />


          {/* =================================================
                         NÚT CLICK ME
          ================================================= */}

          <View style={styles.buttonContainer}>

            <Button
              title="CLICK ME"

              // Chưa nhập đủ thì không cho bấm
              disabled={!isValid}

              onPress={() => {

                // Chuyển sang trang 2
                setPage(2);

              }}

            />

          </View>

        </View>


        {/* =================================================
                       HỌ TÊN + MSSV
        ================================================= */}

        <Text style={styles.name}>
          Hà Văn Võ Quyền - BIT242958
        </Text>

      </View>

    </SafeAreaView>
  );
}


// =====================================================
//                       STYLE
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  //                     SAFE AREA
  // ===================================================

  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },


  // ===================================================
  //                     TRANG 1
  // ===================================================

  container: {
    flex: 1,

    padding: 10,

    backgroundColor: 'white',
  },


  // ===================================================
  //                        Ô 1
  // ===================================================

  box1: {
    width: '100%',

    height: 100,

    backgroundColor: 'blue',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 8,
  },


  // ===================================================
  //                        Ô 2
  // ===================================================

  box2: {
    width: '100%',

    height: 100,

    backgroundColor: 'red',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 8,
  },


  // ===================================================
  //                 HÀNG Ô 3 - 4 - 5
  // ===================================================

  middleRow: {
    width: '100%',

    height: 170,

    flexDirection: 'row',

    marginBottom: 8,
  },


  // ===================================================
  //                        Ô 3
  // ===================================================

  box3: {
    flex: 1,

    backgroundColor: 'gold',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 8,
  },


  // ===================================================
  //                        Ô 4
  // ===================================================

  box4: {
    flex: 1,

    backgroundColor: 'green',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 8,
  },


  // ===================================================
  //                        Ô 5
  // ===================================================

  box5: {
    flex: 1,

    backgroundColor: 'purple',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 8,
  },


  // ===================================================
  //                      Ô TRẮNG
  // ===================================================

  whiteBox: {
    flex: 1,

    backgroundColor: 'white',
  },


  // ===================================================
  //                        Ô 6
  // ===================================================

  box6: {
    width: '100%',

    height: 100,

    backgroundColor: 'orange',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 10,
  },


  // ===================================================
  //                     KHU NHẬP LIỆU
  // ===================================================

  inputArea: {
    width: '100%',

    marginTop: 'auto',
  },


  // ===================================================
  //                     Ô INPUT
  // ===================================================

  input: {
    width: '100%',

    height: 45,

    borderWidth: 1,

    borderColor: '#555',

    borderRadius: 5,

    paddingHorizontal: 12,

    fontSize: 16,

    backgroundColor: 'white',

    marginBottom: 8,
  },


  // ===================================================
  //                    NÚT CLICK ME
  // ===================================================

  buttonContainer: {
    width: '100%',

    marginBottom: 8,
  },


  // ===================================================
  //                    CHỮ 1 - 6
  // ===================================================

  textWhite: {
    fontSize: 42,

    fontWeight: 'bold',

    color: 'white',
  },


  textBlack: {
    fontSize: 42,

    fontWeight: 'bold',

    color: 'black',
  },


  // ===================================================
  //                  HỌ TÊN + MSSV
  // ===================================================

  name: {
    textAlign: 'center',

    fontSize: 14,

    fontWeight: 'bold',

    color: 'black',

    marginBottom: 5,
  },


  // ===================================================
  //                     TRANG 2
  // ===================================================

  page2: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: 'white',

    padding: 20,
  },


  // ===================================================
  //                  TIÊU ĐỀ TRANG 2
  // ===================================================

  page2Title: {
    fontSize: 40,

    fontWeight: 'bold',

    marginBottom: 15,

    color: 'black',
  },


  // ===================================================
  //                TIÊU ĐỀ THÔNG TIN
  // ===================================================

  page2Subtitle: {
    fontSize: 20,

    fontWeight: 'bold',

    marginBottom: 20,

    color: '#333',
  },


  // ===================================================
  //                   KHUNG THÔNG TIN
  // ===================================================

  infoBox: {
    width: '90%',

    borderWidth: 1,

    borderColor: '#333',

    borderRadius: 8,

    padding: 20,

    backgroundColor: '#f5f5f5',

    marginBottom: 30,
  },


  // ===================================================
  //                    NHÃN THÔNG TIN
  // ===================================================

  infoLabel: {
    fontSize: 16,

    fontWeight: 'bold',

    marginBottom: 5,

    color: '#555',
  },


  // ===================================================
  //                   GIÁ TRỊ THÔNG TIN
  // ===================================================

  infoValue: {
    fontSize: 22,

    fontWeight: 'bold',

    color: 'black',

    marginBottom: 20,
  },


  // ===================================================
  //                     QUAY LẠI
  // ===================================================

  backButton: {
    width: 200,
  },

});