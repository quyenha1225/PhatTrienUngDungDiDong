import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function App() {
  // 1 = Screen 1
  // 2 = Screen 2
  const [screen, setScreen] = useState(1);

  // Dữ liệu nhập
  const [userName, setUserName] = useState('');
  const [mssv, setMssv] = useState('');

  // Lỗi validate
  const [userNameError, setUserNameError] = useState('');
  const [mssvError, setMssvError] = useState('');

  // ==========================
  // VALIDATE
  // ==========================
  const validateForm = () => {
    let isValid = true;

    setUserNameError('');
    setMssvError('');

    // Kiểm tra họ tên
    if (userName.trim() === '') {
      setUserNameError('Họ tên sinh viên không được để trống');
      isValid = false;
    }

    // Kiểm tra MSSV
    if (mssv.trim() === '') {
      setMssvError('Mã sinh viên không được để trống');
      isValid = false;
    } else {
      /*
        MSSV phải có dạng:

        BIT242906

        B       -> bắt đầu bằng B
        IT      -> 2 chữ cái mã ngành
        242906  -> 6 chữ số
      */

      const mssvRegex = /^B[A-Z]{2}[0-9]{6}$/;

      if (!mssvRegex.test(mssv.trim())) {
        setMssvError(
          'MSSV sai định dạng. Ví dụ đúng: BIT242906'
        );
        isValid = false;
      }
    }

    return isValid;
  };

  // ==========================
  // CLICK ME
  // ==========================
  const handleClickMe = () => {
    const valid = validateForm();

    // Nếu sai thì không chuyển trang
    if (!valid) {
      return;
    }

    // Nếu đúng thì sang Screen 2
    setScreen(2);
  };

  // =====================================================
  // SCREEN 1
  // =====================================================

  if (screen === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.screen1}>

          {/* Ô 1 */}
          <View style={styles.box1}>
            <Text style={styles.whiteNumber}>1</Text>
          </View>

          {/* Ô 2 */}
          <View style={styles.box2}>
            <Text style={styles.whiteNumber}>2</Text>
          </View>

          {/* Ô 3 - 4 - 5 */}
          <View style={styles.row345}>

            <View style={styles.box3}>
              <Text style={styles.blackNumber}>3</Text>
            </View>

            <View style={styles.box4}>
              <Text style={styles.whiteNumber}>4</Text>
            </View>

            <View style={styles.box5}>
              <Text style={styles.whiteNumber}>5</Text>
            </View>

          </View>

          {/* Ô 6 */}
          <View style={styles.box6}>
            <Text style={styles.whiteNumber}>6</Text>
          </View>

          {/* Dòng tiêu đề */}
          <Text style={styles.titleText}>
            Họ và tên - MSSV
          </Text>

          {/* ==========================
              NHẬP HỌ TÊN
             ========================== */}

          <TextInput
            style={[
              styles.input,
              userNameError !== '' && styles.inputError,
            ]}
            placeholder="Nhập họ tên sinh viên"
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              setUserNameError('');
            }}
          />

          {/* Lỗi họ tên */}
          {userNameError !== '' && (
            <Text style={styles.errorText}>
              {userNameError}
            </Text>
          )}

          {/* ==========================
              NHẬP MSSV
             ========================== */}

          <TextInput
            style={[
              styles.input,
              mssvError !== '' && styles.inputError,
            ]}
            placeholder="Nhập MSSV, ví dụ: BIT242906"
            value={mssv}
            onChangeText={(text) => {
              // Tự động đổi thành chữ HOA
              setMssv(text.toUpperCase());
              setMssvError('');
            }}
            autoCapitalize="characters"
            maxLength={9}
          />

          {/* Lỗi MSSV */}
          {mssvError !== '' && (
            <Text style={styles.errorText}>
              {mssvError}
            </Text>
          )}

          {/* ==========================
              BUTTON CLICK ME
             ========================== */}

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.clickButton}
              onPress={handleClickMe}
            >
              <Text style={styles.buttonText}>
                Click me
              </Text>
            </Pressable>
          </View>

        </View>
      </SafeAreaView>
    );
  }

  // =====================================================
  // SCREEN 2
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen2}>

        {/* ==========================
            NÚT QUAY LẠI
           ========================== */}

        <Pressable
          style={styles.backButton}
          onPress={() => setScreen(1)}
        >
          <Text style={styles.backArrow}>
            ←
          </Text>
        </Pressable>

        {/* Tiêu đề */}
        <Text style={styles.screen2Title}>
          SCREEN 2
        </Text>

        {/* ==========================
            HIỆN HỌ TÊN
           ========================== */}

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>
            Họ và tên sinh viên:
          </Text>

          <Text style={styles.infoValue}>
            {userName}
          </Text>
        </View>

        {/* ==========================
            HIỆN MSSV
           ========================== */}

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>
            Mã số sinh viên:
          </Text>

          <Text style={styles.infoValue}>
            {mssv}
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

// =====================================================
// STYLE
// =====================================================

const styles = StyleSheet.create({
  // ==========================
  // CHUNG
  // ==========================

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // ==========================
  // SCREEN 1
  // ==========================

  screen1: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  // Ô 1
  box1: {
    height: 70,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  // Ô 2
  box2: {
    height: 70,
    backgroundColor: '#FF3B3F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  // Hàng 3 4 5
  row345: {
    height: 145,
    flexDirection: 'row',
    marginBottom: 6,
  },

  // Ô 3
  box3: {
    flex: 1,
    backgroundColor: '#FFD21C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  // Ô 4
  box4: {
    flex: 1,
    backgroundColor: '#2DB36B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  // Ô 5
  box5: {
    flex: 1,
    backgroundColor: '#7A3FE0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Ô 6
  box6: {
    height: 120,
    backgroundColor: '#FF7514',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  // ==========================
  // SỐ
  // ==========================

  whiteNumber: {
    color: '#ffffff',
    fontSize: 29,
    fontWeight: 'bold',
  },

  blackNumber: {
    color: '#000000',
    fontSize: 29,
    fontWeight: 'bold',
  },

  // ==========================
  // TIÊU ĐỀ
  // ==========================

  titleText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#333333',
    marginBottom: 10,
  },

  // ==========================
  // INPUT
  // ==========================

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },

  inputError: {
    borderColor: 'red',
  },

  // ==========================
  // ERROR
  // ==========================

  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 6,
  },

  // ==========================
  // CLICK ME
  // ==========================

  buttonContainer: {
    alignItems: 'center',
    marginTop: 5,
  },

  clickButton: {
    width: 180,
    height: 45,
    backgroundColor: '#000000',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // =====================================================
  // SCREEN 2
  // =====================================================

  screen2: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Nút quay lại góc trái
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  backArrow: {
    color: '#000000',
    fontSize: 38,
    fontWeight: 'bold',
  },

  // Tiêu đề Screen 2
  screen2Title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  // Khung thông tin
  infoBox: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  infoValue: {
    fontSize: 18,
    color: '#333333',
  },
});