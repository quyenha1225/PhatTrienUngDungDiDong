# QUẢN LÝ KHÓA HỌC — REACT NATIVE + MOCKAPI

Bài tập môn **Lập trình Mobile App**, viết bằng **React Native (Expo SDK 57)**, dữ liệu lưu trên **MockAPI.io**.

## 1. Chạy trong VS Code (Windows)

Yêu cầu: **Node.js 22.13 trở lên** (LTS phù hợp Expo SDK 57), Internet, VS Code.

1. **Giải nén** `CourseManagementMockAPI.zip`.
2. VS Code → **File > Open Folder** → chọn `CourseManagementMockAPI`.
3. Mở **Terminal > New Terminal** rồi chạy:

```powershell
node -v
npm install
npm run seed
npm run web
```

`npm install`: tải các thư viện (chỉ cần lần đầu).  
`npm run seed`: nạp 3 danh mục và 10 khóa học lên **MockAPI thật**, không tạo trùng theo tên.  
`npm run web`: chạy React Native Web trên trình duyệt; chờ Expo in đường dẫn `localhost`.

**Chạy trên điện thoại:** Cài Expo Go tương thích SDK 57 → điện thoại và PC dùng cùng Wi-Fi → trong terminal chạy `npm start` → quét QR bằng Expo Go (Android). Nếu kết nối bị lỗi, thử `npx expo start --tunnel` (cần Internet).

> Không được chạy `npm run seed` nếu bạn không muốn **thêm bản ghi thật** lên resource đang dùng. Lệnh chỉ thêm, không xóa hay ghi đè, nhưng sẽ tạo dữ liệu trên MockAPI của bạn.

## 2. Cấu hình địa chỉ API (QUAN TRỌNG)

Sửa file `src/config.js`:

```javascript
export const API_BASE_URL = 'https://6acefe39f338359cf1c3d55a.mockapi.io';
```

Đây là URL được đọc từ ảnh màn hình của bạn, **hãy đối chiếu lại với “API endpoint” thực tế** trong trang MockAPI.

- Nếu MockAPI của bạn hiển thị `https://xxx.mockapi.io`, giữ nguyên dạng đó.
- Nếu MockAPI hiển thị `https://xxx.mockapi.io/api/v1`, giữ cả `/api/v1`.
- Phải có 2 resource tên chính xác `categories` và `courses` (viết chữ thường, số nhiều).

**Nếu bạn thay API URL**, script nạp dữ liệu cũng phải sử dụng cùng URL. Cách làm trên PowerShell:

```powershell
$env:MOCKAPI_BASE_URL="https://TEN-CUA-BAN.mockapi.io"
npm run seed
```

Hoặc chỉnh biến `BASE` mặc định trong `scripts/seed.cjs`.

Kiểm tra bằng trình duyệt (thay URL thực tế):
- `https://xxx.mockapi.io/categories`
- `https://xxx.mockapi.io/courses`

Nếu trả về `[]` nghĩa API hoạt động nhưng bảng trống. Nếu 404, URL hoặc resource không đúng.

## 3. Schema chính xác trên MockAPI

### Resource: categories
| Field | Type | Ghi chú |
|---|---|---|
| id | Object ID | Tự sinh |
| name | String | Tên danh mục |
| description | String | Mô tả |

### Resource: courses
| Field | Type | Ghi chú |
|---|---|---|
| id | Object ID | Tự sinh |
| title | String | Tên khóa học |
| description | String | Mô tả |
| categoryId | String | ID danh mục |
| instructor | String | Giảng viên |
| price | Number | Học phí VNĐ |
| duration | Number | Số giờ |
| thumbnail | String | URL ảnh |
| trailerUrl | String | URL MP4 |
| createdAt | String | Ngày tạo |

Lưu ý: trường `categoryId` trong `courses` **phải thuộc ID của resource `categories`**. `createdAt` dùng String đúng theo đề. Không cần bật tính năng trả phí “Object template”.

## 4. 4 màn hình yêu cầu và API

| Màn hình | File | Chức năng |
|---|---|---|
| Danh sách khóa học | `src/screens/CoursesScreen.js` | GET `/courses`, tìm kiếm, lọc danh mục |
| Chi tiết khóa học | `src/screens/CourseDetailScreen.js` | GET `/courses/:id`, ảnh, thông tin, trailer |
| Thêm/sửa khóa học | `src/screens/CourseFormScreen.js` | POST/PUT `/courses`, validation, ảnh xem trước |
| Quản lý danh mục | `src/screens/CategoriesScreen.js` | GET/POST/PUT/DELETE `/categories` |
| Màn hình phụ: Trailer | `src/screens/VideoScreen.js` | Phát MP4 trực tiếp bằng expo-video |

Ngoài ra `App.js` điều hướng các màn hình, `src/api.js` gom mọi hàm fetch, `src/validation.js` kiểm tra dữ liệu, `src/components.js` các thành phần tái sử dụng.

### Bảng các phương thức REST

| API | Phương thức | Chức năng |
|---|---|---|
| `/categories` | GET, POST | Danh sách/thêm danh mục |
| `/categories/:id` | PUT, DELETE | Sửa/xóa danh mục |
| `/courses` | GET, POST | Danh sách/thêm khóa học |
| `/courses/:id` | GET, PUT, DELETE | Chi tiết/sửa/xóa khóa học |

Dữ liệu được lấy từ MockAPI, không hardcode trong các màn hình. Script seed chỉ là bộ dữ liệu mẫu để thêm lên API từ Terminal, không phải nguồn dữ liệu lúc ứng dụng đang chạy.

## 5. Dùng các chức năng để kiểm tra bài

1. Sau `npm run seed`, trang Danh sách có **ít nhất 3 danh mục, 10 khóa học** (nếu MockAPI cho phép số lượng này).
2. Gõ từ khóa như `React` để lọc theo tên, bấm danh mục `Lập trình Web` để lọc.
3. Nhấn một khóa học → xem chi tiết → `Xem trailer`, thử phát/tạm dừng.
4. `+ Thêm` → điền thông tin, chọn danh mục từ popup lấy qua API → `Tạo khóa học`.
5. Mở khóa học → `Chỉnh sửa`, sau đó `Xóa khóa học` → xác nhận.
6. Mở `Danh mục` → thêm/sửa và thử xóa: danh mục đang chứa khóa học bị chặn xóa.
7. Kiểm tra việc cập nhật thật: mở lại `/courses` hoặc `/categories` trên trình duyệt để xem JSON mới.

**Video demo:** Mười khóa học seed đều sử dụng cùng một file MP4 ngắn, công khai để kiểm tra chức năng phát. Đây là video kỹ thuật mẫu (không phải trailer liên quan đến tên khóa học). Để nộp bài đẹp hơn, thay `trailerUrl` bằng video MP4 do bạn có quyền sử dụng và đúng nội dung từng khóa học. Ảnh dùng Picsum làm ảnh placeholder, yêu cầu có kết nối mạng.

## 6. Giải thích cách API hoạt động

```text
Chạm nút THÊM tại React Native
    ↓
CourseFormScreen kiểm tra dữ liệu
    ↓
api.addCourse(payload) gọi fetch(POST /courses)
    ↓
MockAPI lưu JSON và trả JSON khóa học vừa tạo
    ↓
App gọi GET /courses và GET /categories lại
    ↓
React cập nhật useState → giao diện vẽ lại danh sách
```

Lấy danh sách: `api.getCourses()` = `fetch(BASE_URL + '/courses')`.  
Sửa: `api.editCourse(id, data)` = `PUT /courses/:id`.  
Xóa: `api.deleteCourse(id)` = `DELETE /courses/:id`.  
Từ `categoryId`, ứng dụng tra danh mục đã được tải qua `GET /categories` để hiển thị **tên danh mục**, không hardcode.

## 7. Chạy kiểm tra logic

```powershell
npm test
```

Bộ test xác nhận kiểm tra URL, trường bắt buộc, giá không âm, thời lượng >0, danh mục hợp lệ, đổi kiểu Number và chặn URL trailer không phải MP4.

## 8. Xử lý lỗi thường gặp

- **Network request failed / Failed to fetch**: Kiểm tra Wi-Fi, API_BASE_URL và truy cập endpoint trực tiếp bằng trình duyệt.
- **404**: Sai tên resource (`courses`/`categories`) hoặc thiếu `/api/v1` trong URL.
- **`[]`**: Chưa có dữ liệu; chạy `npm run seed` nếu muốn thêm dữ liệu mẫu.
- **Không hiển thị ảnh**: Link ảnh không công khai hoặc hosting chặn tải ảnh.
- **Không phát trailer**: Dùng link `.mp4` trực tiếp, không phải đường dẫn một trang YouTube. Thử mở MP4 trên trình duyệt.
- **npm install lỗi**: Kiểm tra Node.js 22.13+, kết nối Internet và lệnh `npm install` đúng tại thư mục chứa `package.json`.
- **Expo Go thông báo SDK khác nhau**: Cập nhật Expo Go phù hợp SDK 57 hoặc dùng chế độ Web để thử trước.

## 9. Sản phẩm cần nộp

- Toàn bộ mã nguồn trong thư mục này (không cần `node_modules`).
- Link project/API MockAPI của bạn.
- Video quay màn hình thao tác CRUD, tìm kiếm, lọc, video và giải thích fetch/JSON.
- README này (hướng dẫn chạy app).

*Ghi chú: Nguồn là đề PDF “Bài tập lập trình Mobile App – Quản lý khóa học”, 3 trang. Mọi bản ghi được tạo bởi seed script chỉ là dữ liệu mẫu.*
