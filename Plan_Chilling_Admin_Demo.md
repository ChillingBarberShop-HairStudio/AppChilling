# Plan.md - Chilling Admin App Demo

> Mục tiêu trước mắt: tạo **bản demo UI/UX đầu tiên** cho app quản lý Chilling Barber Shop để xem giao diện, luồng menu, phong cách thiết kế, hiệu ứng barber pole và cấu trúc màn hình.  
> Chưa cần kết nối database thật, chưa cần nhận đơn thật từ landing page, chưa cần máy in POS/loa thanh toán ở bản demo này.

---

## 1. Bối cảnh hệ thống

Landing page hiện tại đã hoàn thiện và chạy riêng tại:

```txt
https://chillingbarbershop-hairstudio.github.io/Chilling/
```

App quản lý mới phải là một hệ thống **riêng hoàn toàn**, không phụ thuộc landing page về UI/source code.

Sau này landing page chỉ gửi đơn đặt lịch vào API của app. Landing page không lưu bất kỳ thông tin nào.

---

## 2. Mục tiêu bản demo đầu tiên

Build một bản demo có thể chạy được để xem trước:

```txt
1. Màn hình đăng nhập.
2. Shell app chính.
3. Menu tổng quan độc đáo, không quá giống app quản lý truyền thống.
4. Menu Hóa đơn.
5. Menu Lịch hẹn.
6. Menu Báo cáo.
7. Menu Thêm.
8. Cấu trúc báo cáo doanh thu nhiều cấp.
9. Thẻ KPI demo.
10. Hiệu ứng barber pole animation từ Ani.PNG.
11. Sử dụng Logo.PNG và panel.PNG trong giao diện.
12. Icon 2.5D phong cách barber/cắt tóc.
13. Responsive cho PC, APK Android, iOS/mobile preview.
```

Bản demo chỉ dùng mock data:

```txt
Không backend thật.
Không SQLite thật.
Không Telegram thật.
Không POS printer thật.
Không loa thanh toán thật.
Không login thật.
Không API thật.
```

Nhưng phải thiết kế code sẵn để sau này dễ gắn backend.

---

## 3. Tech stack đề xuất cho Antigravity

Ưu tiên stack dễ build đa nền tảng:

```txt
Vite
Vue 3
TypeScript
Tailwind CSS
Pinia
Vue Router
Lucide icons
ECharts
Capacitor-ready
Electron-ready
```

Nếu Antigravity chọn React thì vẫn phải giữ đúng logic, màn hình, style, data structure. Nhưng ưu tiên Vue 3.

---

## 4. Hướng đóng gói sau này

### PC

```txt
Electron + electron-builder
Xuất .exe cài trên Windows
```

### Android APK

```txt
Capacitor Android
Xuất APK cài trực tiếp
```

### iOS

```txt
Capacitor iOS
Giai đoạn demo chỉ cần responsive mobile preview.
Build iOS chính thức cần macOS + Xcode.
Nếu muốn cài ổn định cho nhiều iPhone về sau sẽ cần Apple Developer.
```

Bản demo hiện tại chỉ cần:

```txt
npm run dev
npm run build
```

Có thể chuẩn bị cấu hình Capacitor/Electron nhưng chưa cần xuất file cài.

---

## 5. Asset bắt buộc

Antigravity cần dùng đúng tên file sau trong thư mục `public/` hoặc `assets/`:

```txt
public/Logo.PNG
public/panel.PNG
public/Ani.PNG
```

Ý nghĩa:

```txt
Logo.PNG = logo thương hiệu, dùng ở login, sidebar/header, report card.
panel.PNG = hình chủ đề/phong cách app, dùng ở dashboard hero/card thương hiệu.
Ani.PNG = ảnh phát triển hiệu ứng barber pole animation.
```

Nếu chưa thấy file, tạo placeholder đẹp và ghi TODO:

```txt
TODO: Replace with public/Logo.PNG
TODO: Replace with public/panel.PNG
TODO: Replace with public/Ani.PNG
```

---

## 6. Phong cách thiết kế

App cần có gu riêng, không giống dashboard văn phòng khô cứng.

### 6.1 Design direction

```txt
Premium Barber Studio OS
Sạch, sang, mạnh, nam tính
Có cảm giác app quản lý hiện đại nhưng vẫn mang chất barber
Không quá màu mè
Không quá giống POS truyền thống
Không dùng layout menu quá nhàm chán
```

### 6.2 Visual tokens

```txt
Background chính: #f4f6f8
Surface/card: #ffffff
Text chính: #111827
Text phụ: #6b7280
Primary blue: #1687ff
Barber red: #ef4444
Barber navy: #111827
Accent gold: #d4a84f
Success: #10b981
Warning: #f59e0b
Danger: #ef4444
Border: #e5e7eb
Radius: 18px / 24px / 32px
Shadow: mềm, không quá đậm
```

### 6.3 Icon style

Dùng icon kiểu 2.5D liên quan barber:

```txt
Dao cạo
Kéo cắt tóc
Lược
Ghế barber
Barber pole
Máy sấy
Gương
Lưỡi dao
Hóa đơn
Lịch hẹn
Ví tiền
Biểu đồ
Khách hàng
Nhân viên
Chi nhánh
Máy in
Loa thanh toán
```

Nếu chưa có icon 2.5D thật, dùng Lucide icon + card gradient + shadow 2.5D để giả lập.

### 6.4 Animation style

```txt
Barber pole animation từ Ani.PNG.
Card xuất hiện dạng slide/fade.
Menu có hover lift.
KPI card có counter animation nhẹ.
Không làm animation quá nặng gây lag mobile.
Tôn trọng prefers-reduced-motion.
```

---

## 7. Barber Pole Animation

Tạo component:

```txt
src/components/brand/BarberPoleAnimation.vue
```

Yêu cầu:

```txt
1. Dùng Ani.PNG làm texture/hình chủ đề.
2. Tạo hiệu ứng quay/di chuyển stripe gợi nhớ cây barber pole.
3. Có fallback CSS nếu Ani.PNG không load.
4. Dùng ở màn hình login.
5. Dùng ở dashboard hero.
6. Dùng ở loading/brand badge nhỏ nếu hợp lý.
```

Gợi ý CSS fallback:

```css
.barber-pole-fallback {
  background:
    repeating-linear-gradient(
      135deg,
      #ef4444 0 12px,
      #ffffff 12px 24px,
      #1687ff 24px 36px,
      #ffffff 36px 48px
    );
  animation: barberPoleSlide 1.6s linear infinite;
}

@keyframes barberPoleSlide {
  from { background-position: 0 0; }
  to { background-position: 48px 48px; }
}
```

Khi dùng Ani.PNG:

```css
.barber-pole-texture {
  background-image:
    linear-gradient(120deg, rgba(17,24,39,.70), rgba(17,24,39,.20)),
    url('/Ani.PNG');
  background-size: cover;
  background-position: center;
  animation: poleFloat 5s ease-in-out infinite;
}
```

---

## 8. Màn hình đăng nhập

Route:

```txt
/login
```

### 8.1 Nội dung

Màn hình đăng nhập phải có:

```txt
Logo.PNG
Tên: Chilling Barber Shop
Subtitle: Barber Studio Management OS
BarberPoleAnimation từ Ani.PNG
Form đăng nhập
Nút đăng nhập
Gợi ý tài khoản demo
```

Demo credentials:

```txt
Username: admin
Password: 123456
```

Bản demo không cần auth thật, chỉ mock login và chuyển vào `/app`.

### 8.2 UI

Layout desktop:

```txt
Trái: brand panel lớn + Ani.PNG barber pole effect + panel.PNG
Phải: login card trắng
```

Layout mobile:

```txt
Logo trên cùng
Animation nhỏ
Login card
```

### 8.3 Copy đề xuất

```txt
Chilling Barber Shop
Quản lý lịch hẹn, hóa đơn, doanh thu và khách hàng trong một không gian duy nhất.
```

---

## 9. App Shell

Route gốc sau login:

```txt
/app
```

### 9.1 Layout PC

Không dùng sidebar quá truyền thống kiểu menu dọc nhàm chán.  
Dùng layout độc đáo:

```txt
Top brand rail:
- Logo
- trạng thái online/offline
- ngày hiện tại
- user avatar

Center command dock:
- Tổng quan
- Hóa đơn
- Lịch hẹn
- Báo cáo
- Thêm

Main canvas:
- Card lớn, KPI, quick action, timeline

Right insight rail:
- Lịch hẹn gần nhất
- Đơn mới
- Thanh toán chờ
```

### 9.2 Layout mobile/APK/iOS preview

Dùng bottom navigation như ảnh tham chiếu:

```txt
Tổng quan
Hóa đơn
Lịch hẹn
Báo cáo
Thêm
```

Bottom nav phải mềm, sáng, icon rõ, active màu xanh.

---

## 10. Menu chính

Các menu chính:

```txt
1. Tổng quan
2. Hóa đơn
3. Lịch hẹn
4. Báo cáo
5. Thêm
```

Route:

```txt
/app/overview
/app/invoices
/app/appointments
/app/reports
/app/more
```

---

## 11. Màn hình Tổng quan

Route:

```txt
/app/overview
```

### 11.1 KPI demo

Hiển thị các thẻ:

```txt
Doanh thu hôm nay
Lịch hẹn hôm nay
Hóa đơn mới
Đã thanh toán
Công nợ
Khách mới
```

### 11.2 Quick actions

```txt
Tạo hóa đơn
Thêm lịch hẹn
Tìm khách hàng
In hóa đơn
Kiểm tra loa thanh toán
```

### 11.3 Timeline

```txt
09:00 - Khách đặt lịch cắt tóc
10:30 - Hóa đơn HD0001 đã thanh toán
13:00 - Dịch vụ nhuộm màu
16:30 - Khách VIP quay lại
```

### 11.4 Brand card

Dùng:

```txt
Logo.PNG
panel.PNG
Ani.PNG barber pole accent
```

---

## 12. Màn hình Hóa đơn

Route:

```txt
/app/invoices
```

### 12.1 Chức năng demo

```txt
Danh sách hóa đơn
Tìm theo mã hóa đơn
Tìm theo số điện thoại
Lọc trạng thái
Lọc ngày
Nút tạo hóa đơn
Nút in thử
Nút thanh toán thử
```

### 12.2 Trạng thái hóa đơn

```txt
draft = Nháp
unpaid = Chưa thanh toán
paid = Đã thanh toán
partial = Thanh toán một phần
cancelled = Đã hủy
```

### 12.3 Mock columns

```txt
Mã hóa đơn
Khách hàng
Dịch vụ
Tổng tiền
Đã thanh toán
Còn nợ
Phương thức
Trạng thái
Thời gian
```

---

## 13. Màn hình Lịch hẹn

Route:

```txt
/app/appointments
```

### 13.1 Chức năng demo

```txt
Lịch hẹn hôm nay
Lịch theo ngày
Lịch theo tuần
Thêm lịch hẹn
Đổi giờ
Xác nhận khách đến
Đánh dấu hoàn thành
Đánh dấu khách hủy
```

### 13.2 Layout độc đáo

Không chỉ là bảng. Gợi ý:

```txt
Time rail bên trái
Appointment cards dạng vé dịch vụ
Mỗi card có màu theo trạng thái
Staff avatar/icon
Tổng thời gian
Tổng tiền dự kiến
```

### 13.3 Trạng thái

```txt
scheduled = Đã đặt
confirmed = Đã xác nhận
arrived = Khách đã đến
in_service = Đang phục vụ
completed = Hoàn thành
cancelled = Đã hủy
no_show = Không đến
```

---

## 14. Màn hình Báo cáo

Route:

```txt
/app/reports
```

Màn hình này giống phong cách ảnh tham chiếu: danh sách nhóm báo cáo dạng card/list, có icon trái và chevron phải.

### 14.1 Nhóm báo cáo chính

```txt
Doanh thu
Công nợ
Thu chi
Thẻ tiền mặt
Tích điểm
Khách hàng
Nhân viên
Chi nhánh
```

### 14.2 Report menu style mobile

Dạng list card:

```txt
[icon] Doanh thu       >
[icon] Công nợ         >
[icon] Thu chi         >
[icon] Thẻ tiền mặt    >
[icon] Tích điểm       >
[icon] Khách hàng      >
[icon] Nhân viên       >
[icon] Chi nhánh       >
```

### 14.3 Desktop report hub

Desktop không chỉ list đơn điệu. Gợi ý:

```txt
Report constellation layout:
- Card Doanh thu lớn ở giữa
- Các report khác xếp xung quanh
- Có icon 2.5D và mini sparkline
```

---

## 15. Màn hình Báo cáo > Doanh thu

Route:

```txt
/app/reports/revenue
```

Khi bấm vào "Doanh thu", hiện các nhóm con:

```txt
Doanh thu theo hóa đơn
Doanh thu theo phương thức thanh toán
Doanh thu theo khách hàng
Doanh thu theo dịch vụ
Doanh thu theo sản phẩm
Doanh thu theo gói dịch vụ
```

Style giống ảnh mẫu: list rõ, nền sáng, card bo góc, chevron phải.

---

## 16. Màn hình Báo cáo > Doanh thu theo hóa đơn

Route:

```txt
/app/reports/revenue/invoices
```

### 16.1 KPI cards

Hiển thị thẻ KPI:

```txt
Doanh thu
Nợ
Đã thanh toán
Số lượng hóa đơn
Thuế VAT
Giảm giá
```

### 16.2 Filter bar

```txt
Hôm nay
Hôm qua
7 ngày
Tháng này
Tùy chọn ngày
```

### 16.3 Table demo

Columns:

```txt
Hóa đơn
Khách hàng
Tổng tiền
Giảm giá
Đã thanh toán
Nợ
Ngày
```

### 16.4 Data mock

Tạo dữ liệu demo:

```txt
HD0001 - Khách Lẻ - 210,000
HD0002 - Nguyễn Văn A - 130,000
HD0003 - Trần Minh B - 450,000
```

---

## 17. Menu Thêm

Route:

```txt
/app/more
```

Bao gồm:

```txt
Dịch vụ
Sản phẩm
Gói dịch vụ
Khách hàng
Nhân viên
Chi nhánh
Công nợ
Thu chi
Cài đặt
Máy in POS
Loa thanh toán Smart
Telegram
Sao lưu dữ liệu
Bảo mật
Đăng xuất
```

Style: card grid độc đáo, icon 2.5D.

---

## 18. Data mock cần tạo

Tạo file:

```txt
src/data/mockData.ts
```

Bao gồm:

```txt
mockKpis
mockInvoices
mockAppointments
mockCustomers
mockStaff
mockReports
mockPayments
```

---

## 19. Component bắt buộc

```txt
src/components/brand/BarberPoleAnimation.vue
src/components/brand/BrandLogo.vue
src/components/layout/AppShell.vue
src/components/layout/MobileBottomNav.vue
src/components/layout/CommandDock.vue
src/components/ui/AppCard.vue
src/components/ui/KpiCard.vue
src/components/ui/IconTile.vue
src/components/ui/ReportListItem.vue
src/components/ui/StatusBadge.vue
src/components/reports/ReportHub.vue
src/components/reports/RevenueReportMenu.vue
src/components/reports/RevenueInvoiceReport.vue
```

---

## 20. Route map

```ts
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginPage },
  {
    path: "/app",
    component: AppShell,
    children: [
      { path: "", redirect: "/app/overview" },
      { path: "overview", component: OverviewPage },
      { path: "invoices", component: InvoicesPage },
      { path: "appointments", component: AppointmentsPage },
      { path: "reports", component: ReportsPage },
      { path: "reports/revenue", component: RevenueReportMenuPage },
      { path: "reports/revenue/invoices", component: RevenueInvoiceReportPage },
      { path: "more", component: MorePage }
    ]
  }
]
```

---

## 21. Yêu cầu UI chi tiết theo ảnh tham chiếu

### 21.1 Report list

Phải giống tinh thần ảnh:

```txt
Nền ngoài: xám rất nhạt.
Card list: trắng, bo góc lớn.
Mỗi dòng cao 64-76px.
Icon trái nét mảnh hoặc 2.5D.
Text đậm vừa.
Chevron phải.
Đường chia mảnh.
```

### 21.2 Revenue detail

Phải có:

```txt
Header có nút back.
Tab filter ngày.
KPI cards 2 cột trên mobile.
Table phía dưới.
Số tiền format đúng.
```

---

## 22. Không làm trong demo phase

```txt
Không kết nối SQLite thật.
Không nhận đơn thật từ landing.
Không in POS thật.
Không gọi loa thanh toán thật.
Không gọi Telegram thật.
Không build iOS thật.
Không build APK thật nếu chưa cần.
Không làm phân quyền thật.
```

Chỉ tạo placeholder rõ ràng cho các module này.

---

## 23. Acceptance Criteria

Bản demo đạt yêu cầu khi:

```txt
1. Chạy được bằng npm run dev.
2. Build được bằng npm run build.
3. Có màn hình login đẹp với Logo.PNG + Ani.PNG barber pole animation.
4. Login demo vào được app.
5. Có App Shell độc đáo, không quá truyền thống.
6. Có đủ 5 menu: Tổng quan, Hóa đơn, Lịch hẹn, Báo cáo, Thêm.
7. Báo cáo có đủ nhóm: Doanh thu, Công nợ, Thu chi, Thẻ tiền mặt, Tích điểm, Khách hàng, Nhân viên, Chi nhánh.
8. Bấm Doanh thu thấy đủ submenu doanh thu.
9. Bấm Doanh thu theo hóa đơn thấy KPI cards và table.
10. Có icon barber/cắt tóc/dao kéo/loa/máy in theo phong cách 2.5D.
11. Có mock data đẹp.
12. Responsive tốt trên mobile.
13. Code tách component rõ.
14. Chưa có secret/token/API thật trong frontend.
```

---

## 24. Prompt cho Antigravity

Dùng prompt này sau khi đặt `Plan.md` và các file skill vào project:

```txt
Hãy đọc kỹ Plan.md và toàn bộ file trong thư mục skills trước khi code.

Nhiệm vụ hiện tại: build bản demo UI/UX đầu tiên cho Chilling Admin App System.

Chỉ làm demo frontend/app shell, chưa kết nối backend thật.

Yêu cầu bắt buộc:
- Vite + Vue 3 + TypeScript + Tailwind CSS.
- Màn hình login có Logo.PNG, panel.PNG và BarberPoleAnimation phát triển từ Ani.PNG.
- Có App Shell độc đáo, không giống menu quản lý truyền thống khô cứng.
- Có đủ menu: Tổng quan, Hóa đơn, Lịch hẹn, Báo cáo, Thêm.
- Báo cáo có list: Doanh thu, Công nợ, Thu chi, Thẻ tiền mặt, Tích điểm, Khách hàng, Nhân viên, Chi nhánh.
- Bấm Doanh thu hiển thị: Doanh thu theo hóa đơn, phương thức thanh toán, khách hàng, dịch vụ, sản phẩm, gói dịch vụ.
- Bấm Doanh thu theo hóa đơn hiển thị KPI cards và bảng demo.
- Dùng icon 2.5D liên quan barber/cắt tóc/dao kéo/loa/máy in.
- Dùng mock data.
- Không gọi API thật, không database thật, không Telegram thật.
- Code sạch, component nhỏ, responsive tốt.
- Chạy npm run build và sửa lỗi trước khi báo hoàn thành.

Sau khi xong, tóm tắt:
1. Đã tạo file nào.
2. Cách chạy demo.
3. Cách thay Logo.PNG, panel.PNG, Ani.PNG.
4. Các phần placeholder để phát triển tiếp.
```
