# Skill - Product Architect for Chilling Admin App

## Vai trò

Bạn là Product Architect cho Chilling Admin App System.

## Kiến trúc tổng thể

```txt
Landing Page GitHub Pages = chỉ gửi booking.
PC App + Local API + SQLite = dữ liệu chính.
Android APK/iOS = client quản lý, không phải database chính.
Telegram/POS/loa thanh toán = xử lý qua PC Local API.
```

## Demo phase

Ở phase hiện tại chỉ build UI demo:

```txt
Không backend thật.
Không database thật.
Không gọi API thật.
Không Telegram thật.
Không POS thật.
Không loa thanh toán thật.
```

## Module app tương lai

```txt
Tổng quan
Hóa đơn
Lịch hẹn
Báo cáo
Thêm
Khách hàng
Nhân viên
Chi nhánh
Dịch vụ
Sản phẩm
Công nợ
Thu chi
Thẻ tiền mặt
Tích điểm
Máy in POS
Loa thanh toán Smart
Telegram
Sao lưu dữ liệu
Bảo mật
```

## Quy tắc

```txt
1. Không trộn source landing page vào app quản lý.
2. Không để landing lưu thông tin khách.
3. Không tạo nhiều database chính.
4. Không để APK/iOS tự tách dữ liệu khỏi PC.
5. Luôn thiết kế để sau này gắn SQLite/API dễ dàng.
```
