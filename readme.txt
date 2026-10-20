BẮT ĐẦU TẠI ĐÂY — QUẢN LÝ KHÓA HỌC + MOCKAPI
===============================================

BƯỚC 1. Mở trang MockAPI, vào resource "courses" > "Edit".
          Tạo ĐÚNG schema các trường:
          id (Object ID - tự sinh)
          title (String)
          description (String)
          categoryId (String)
          instructor (String)
          price (Number)
          duration (Number)
          thumbnail (String)
          trailerUrl (String)
          createdAt (String)
          => LƯU.

BƯỚC 2. Resource "categories" phải có:
          id (Object ID - tự sinh)
          name (String)
          description (String)
          => LƯU.

BƯỚC 3. Giải nén, mở thư mục CourseManagementMockAPI trong VS Code.
          Mở Terminal > New Terminal.

BƯỚC 4. Nhập các lệnh (mỗi dòng Enter một lần):

          node -v
          npm install
          npm run seed
          npm run web

BƯỚC 5. Mở đường dẫn localhost hiển thị ở Terminal để thử app.
          Hoặc chạy "npm start" rồi quét QR với Expo Go SDK 57.

LƯU Ý: npm run seed sẽ THÊM dữ liệu mẫu lên MockAPI của bạn.
         Nếu bạn không muốn thêm dữ liệu mẫu, bỏ qua lệnh đó.
         Nếu URL trong src/config.js khác URL thực tế, phải sửa.
         Đối với lệnh seed: sửa BASE trong scripts/seed.cjs hoặc
         đặt biến môi trường MOCKAPI_BASE_URL.

FILE QUAN TRỌNG:
- App.js                         : Điều hướng các màn hình.
- src/config.js                  : Địa chỉ MockAPI.
- src/api.js                     : Gọi GET / POST / PUT / DELETE.
- src/screens/                   : 5 màn hình (4 chính + trailer).
- scripts/seed.cjs               : 3 danh mục và 10 khóa học mẫu.
- README.md                      : Giải thích chi tiết, lỗi thường gặp.
