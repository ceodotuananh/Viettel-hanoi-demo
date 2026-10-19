# Viettel Hà Nội – Social Hub (demo)

Bản demo theo dõi Fanpage và TikTok của 30 quận, huyện Viettel Hà Nội, quản lý chiến dịch truyền thông và thống kê bài đăng của từng nhân viên.

- Toàn bộ ứng dụng nằm trong một tệp `index.html` (HTML, CSS, JavaScript thuần; Chart.js và SheetJS tải từ CDN).
- Mở trực tiếp `index.html` trên trình duyệt hoặc triển khai lên bất kỳ static host nào (Netlify, GitHub Pages…).
- Đăng nhập: Quản lý nhập tên hiển thị; người dùng nội bộ nhập số điện thoại, mã user (ví dụ `ANHTN_HNI_CNKD`) hoặc email; Booking/Event nhập email. Mật khẩu mặc định `123456`, lần đầu đăng nhập trang yêu cầu đổi mật khẩu.
- Số liệu kênh là dữ liệu mô phỏng. Khi mở lần đầu (trình duyệt chưa có dữ liệu), trang tự nạp dữ liệu demo: khoảng 190 người tham gia ở 30 quận, huyện, 30 thành viên Booking/Event, 4 chiến dịch (đã kết thúc, đang chạy, chưa gửi thông báo) kèm bài đăng và nhật ký nhắc nhở. Muốn nạp lại, xóa dữ liệu trang (localStorage) rồi tải lại.
- Khi chạy ngoài claude.ai, dữ liệu (người tham gia, chiến dịch, bài đăng) được lưu trong `localStorage` của trình duyệt, chưa dùng chung giữa nhiều người. Tải file Excel chạy trực tiếp trên trình duyệt; Google Drive cần cấu hình một lần (xem bên dưới).

Nguồn: Artifact https://claude.ai/artifact/Kiwki1kaGrbXTmGsnRb32x (trước đây: https://claude.ai/artifact/RN1X8ed9Vpcf94duT3LCrV)

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

## Số liệu bài đăng (Nộp báo cáo)

Nhân viên dán link công khai Facebook hoặc TikTok rồi bấm **Cập nhật số liệu** để đếm lượt thích, bình luận và chia sẻ. Số liệu lấy qua hàm `netlify/functions/metrics.js`, gọi một dịch vụ dữ liệu bên thứ ba.

Cấu hình trên Netlify (Site configuration → Environment variables):
- `METRICS_API_URL`: địa chỉ endpoint của nhà cung cấp.
- `METRICS_API_KEY`: khóa API. Không đưa khóa vào mã nguồn.

Sau khi đặt biến, chỉnh hai đoạn có chú thích trong `netlify/functions/metrics.js` cho đúng tài liệu của nhà cung cấp. Chưa cấu hình thì bài hiển thị số liệu mô phỏng, có đánh dấu rõ.

## Danh sách người tham gia demo

Danh sách 776 nhân viên nội bộ lấy từ file DS_CNKD (mã nhân viên = MA_USER, cụm được đổi sang mã quận, huyện của ứng dụng: NTLM→NTL, BTLM→BTL, PTO→PTH, TTI→TTR, HDC→HDU). File không có số điện thoại, email, link, nên các trường đó để trống. Trình duyệt đã có dữ liệu cũ sẽ được cập nhật danh sách này một lần khi mở trang.
