export const mockKpis = {
  revenueToday: 5450000,
  appointmentsToday: 12,
  newInvoices: 5,
  paidInvoices: 4,
  debt: 1250000,
  newCustomers: 3,
};

export const mockInvoices = [
  { id: 'HD0001', customer: 'Khách Lẻ', service: 'Cắt tóc nam', total: 210000, paid: 210000, debt: 0, method: 'Tiền mặt', status: 'paid', time: '10:30', date: '2023-10-27' },
  { id: 'HD0002', customer: 'Nguyễn Văn A', service: 'Uốn tóc', total: 450000, paid: 450000, debt: 0, method: 'Chuyển khoản', status: 'paid', time: '11:15', date: '2023-10-27' },
  { id: 'HD0003', customer: 'Trần Minh B', service: 'Nhuộm màu', total: 850000, paid: 500000, debt: 350000, method: 'Thẻ', status: 'partial', time: '13:00', date: '2023-10-27' },
  { id: 'HD0004', customer: 'Lê Hoàng C', service: 'Cắt + Gội', total: 150000, paid: 0, debt: 150000, method: '-', status: 'unpaid', time: '14:30', date: '2023-10-27' },
  { id: 'HD0005', customer: 'Khách Lẻ', service: 'Mua sáp Vuốt tóc', total: 250000, paid: 250000, debt: 0, method: 'Tiền mặt', status: 'paid', time: '16:00', date: '2023-10-27' },
];

export const mockAppointments = [
  { id: 'L001', customer: 'Anh Tuấn', service: 'Cắt tóc', time: '09:00', status: 'completed', staff: 'Barber Hùng', duration: 45, price: 100000 },
  { id: 'L002', customer: 'Anh Hải', service: 'Uốn tóc', time: '10:30', status: 'in_service', staff: 'Barber Dũng', duration: 90, price: 450000 },
  { id: 'L003', customer: 'Khách VIP', service: 'Cắt + Gội + Nhuộm', time: '13:00', status: 'arrived', staff: 'Barber Hùng', duration: 120, price: 850000 },
  { id: 'L004', customer: 'Anh Bảo', service: 'Cắt tóc', time: '15:00', status: 'confirmed', staff: 'Barber Tuấn', duration: 45, price: 100000 },
  { id: 'L005', customer: 'Anh Quân', service: 'Gội đầu', time: '16:30', status: 'scheduled', staff: 'Barber Dũng', duration: 30, price: 50000 },
];

export const mockTimeline = [
  { time: '09:00', text: 'Khách đặt lịch cắt tóc' },
  { time: '10:30', text: 'Hóa đơn HD0001 đã thanh toán' },
  { time: '13:00', text: 'Dịch vụ nhuộm màu' },
  { time: '16:30', text: 'Khách VIP quay lại' },
];
