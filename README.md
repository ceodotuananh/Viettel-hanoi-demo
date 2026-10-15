# Viettel Hà Nội – Social Hub (demo)

Bản demo theo dõi Fanpage và TikTok của 30 quận, huyện Viettel Hà Nội, quản lý chiến dịch truyền thông và thống kê bài đăng của từng nhân viên.

- Toàn bộ ứng dụng nằm trong một tệp `index.html` (HTML, CSS, JavaScript thuần; Chart.js và SheetJS tải từ CDN).
- Mở trực tiếp `index.html` trên trình duyệt hoặc triển khai lên bất kỳ static host nào (Netlify, GitHub Pages…).
- Số liệu kênh là dữ liệu mô phỏng. Khi mở lần đầu (trình duyệt chưa có dữ liệu), trang tự nạp dữ liệu demo: khoảng 190 người tham gia ở 30 quận, huyện, 30 thành viên Booking/Event, 4 chiến dịch (đã kết thúc, đang chạy, chưa gửi thông báo) kèm bài đăng và nhật ký nhắc nhở. Muốn nạp lại, xóa dữ liệu trang (localStorage) rồi tải lại.
- Khi chạy ngoài claude.ai, dữ liệu (người tham gia, chiến dịch, bài đăng) được lưu trong `localStorage` của trình duyệt, chưa dùng chung giữa nhiều người. Tải file Excel chạy trực tiếp trên trình duyệt; Google Drive cần cấu hình một lần (xem bên dưới).

Nguồn: Artifact https://claude.ai/artifact/RN1X8ed9Vpcf94duT3LCrV

## Kết nối Google Drive

Khi chạy ngoài claude.ai, trang dùng Google Identity Services để người dùng đăng nhập Google và cấp quyền:

- `drive.file`: tạo Google Sheet mẫu trong Drive của người dùng (chỉ chạm tới file do trang tạo ra).
- `spreadsheets.readonly`: đọc nội dung Google Sheet mà người dùng dán link để đồng bộ danh sách.

Token chỉ nằm trên trình duyệt (hết hạn sau khoảng 1 giờ) và chỉ dùng để gọi API của Google.

### Cấu hình một lần trên Google Cloud

1. Vào https://console.cloud.google.com, tạo (hoặc chọn) một project.
2. **APIs & Services → Library**: bật **Google Drive API** và **Google Sheets API**.
3. **OAuth consent screen** (Google Auth Platform):
   - Tài khoản Google Workspace của công ty: chọn loại **Internal**.
   - Tài khoản Gmail: chọn **External**, ở mục **Test users** thêm email những người sẽ dùng.
   - Thêm 2 scope ở trên vào mục **Data access**.
4. **Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins**: thêm đúng địa chỉ trang sẽ chạy, ví dụ `https://viettel-hanoi-demo.netlify.app` và `http://localhost:8000` (để thử trên máy).
5. Sao chép **Client ID** (dạng `….apps.googleusercontent.com`).

### Gắn Client ID vào trang

- **Dùng chung cho mọi người (khuyên dùng):** trong `index.html`, tìm `const GOOGLE_CLIENT_ID='';` và dán Client ID vào giữa hai dấu nháy, rồi commit.
- **Thử nhanh:** đăng nhập Quản lý, vào **Người tham gia**, dán Client ID vào ô trong khung "Tạo form trực tiếp trên Google Sheets" và bấm **Lưu** (chỉ lưu trên trình duyệt đó).

Sau đó bấm **Kết nối Google Drive**, chọn tài khoản và cho phép các quyền.

Lưu ý: đăng nhập Google không chạy khi mở file trực tiếp (`file://`). Hãy mở qua web (Netlify, GitHub Pages) hoặc chạy thử trên máy bằng `python3 -m http.server 8000` rồi vào `http://localhost:8000`.
