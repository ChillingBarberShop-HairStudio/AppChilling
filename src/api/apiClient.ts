import axios from 'axios'

// Lấy IP cấu hình từ localStorage (đối với Mobile App)
// Mặc định là localhost:3000 (đối với PC App đang chạy Electron)
const getServerIp = () => {
  return localStorage.getItem('server_ip') || 'http://localhost:3000'
}

export const apiClient = axios.create({
  baseURL: getServerIp() + '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Cập nhật lại baseURL khi user lưu cấu hình mới
export const updateApiBaseUrl = (ip: string) => {
  let formattedIp = ip;
  if (!formattedIp.startsWith('http')) {
    formattedIp = 'http://' + formattedIp;
  }
  localStorage.setItem('server_ip', formattedIp);
  apiClient.defaults.baseURL = formattedIp + '/api';
}
