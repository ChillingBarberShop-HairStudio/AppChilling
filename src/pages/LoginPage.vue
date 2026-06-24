<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Settings } from 'lucide-vue-next'
import BarberPoleAnimation from '../components/brand/BarberPoleAnimation.vue'
import BrandLogo from '../components/brand/BrandLogo.vue'
import { updateApiBaseUrl } from '../api/apiClient'

const router = useRouter()
const isLoading = ref(false)
const showSettings = ref(false)
const serverIp = ref('')

onMounted(() => {
  serverIp.value = localStorage.getItem('server_ip') || 'http://localhost:3000'
})

const saveServerIp = () => {
  updateApiBaseUrl(serverIp.value)
  showSettings.value = false
  alert('Đã lưu cấu hình máy chủ!')
}

const handleLogin = () => {
  isLoading.value = true
  setTimeout(() => {
    router.push('/app/overview')
  }, 800)
}
</script>

<template>
  <div class="min-h-screen bg-surface flex">
    <!-- Left Brand Panel (Desktop only) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-barber-navy">
      <div class="absolute inset-0 bg-gradient-to-br from-barber-navy/90 to-barber-navy/40 z-10"></div>
      <img src="/panel.PNG" class="absolute inset-0 w-full h-full object-cover opacity-60" alt="Barber Panel" />
      
      <!-- Barber Pole Accent -->
      <div class="absolute left-0 top-0 bottom-0 w-4 z-20 shadow-2xl">
        <BarberPoleAnimation size="hero" />
      </div>

      <div class="relative z-20 flex flex-col justify-center px-16 h-full text-white">
        <BrandLogo size="xl" show-text light-text class="mb-8" />
        <h1 class="text-5xl font-bold mb-4 tracking-tight">Premium Barber Studio OS</h1>
        <p class="text-xl text-gray-300 max-w-md font-light leading-relaxed">
          Quản lý lịch hẹn, hóa đơn, doanh thu và khách hàng trong một không gian duy nhất.
        </p>
      </div>
    </div>

    <!-- Right Login Form -->
    <div class="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-background relative">
      <!-- Mobile Hero -->
      <div class="lg:hidden w-full max-w-md mx-auto mb-8">
        <BrandLogo size="lg" show-text class="mb-6 justify-center" />
        <div class="h-2 w-32 mx-auto rounded-full overflow-hidden shadow-sm mb-2">
          <BarberPoleAnimation size="hero" />
        </div>
        <p class="text-center text-gray-500 font-medium text-sm">Barber Studio Management OS</p>
      </div>

      <div class="w-full max-w-md mx-auto bg-surface p-8 sm:p-10 rounded-2xl shadow-sm border border-border relative">
        <button @click="showSettings = !showSettings" class="absolute top-6 right-6 text-gray-400 hover:text-primary-blue transition-colors">
          <Settings class="w-5 h-5" />
        </button>

        <h2 class="text-2xl font-bold text-barber-navy mb-2">Đăng nhập</h2>
        <p class="text-gray-500 mb-8 text-sm">Vui lòng đăng nhập để tiếp tục</p>

        <!-- Settings Panel -->
        <div v-if="showSettings" class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cấu hình IP Máy chủ (Mobile)</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              v-model="serverIp"
              placeholder="VD: 192.168.1.100:3000"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-blue/20 outline-none"
            />
            <button @click="saveServerIp" class="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium">Lưu</button>
          </div>
          <p class="text-xs text-gray-500 mt-2">Dùng cho nhân viên kết nối từ điện thoại qua WiFi quán.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input 
              type="text" 
              value="admin"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              value="123456"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all bg-gray-50"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="rounded text-primary-blue focus:ring-primary-blue w-4 h-4" />
              <span class="text-sm text-gray-600">Ghi nhớ</span>
            </label>
            <a href="#" class="text-sm font-medium text-primary-blue hover:text-blue-700">Quên mật khẩu?</a>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-primary-blue hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <span v-if="!isLoading">Đăng nhập ngay</span>
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
        </form>

        <div class="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-center">
          <p class="text-xs text-gray-500 mb-1">Demo credentials</p>
          <p class="text-sm font-medium text-barber-navy">admin / 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>
