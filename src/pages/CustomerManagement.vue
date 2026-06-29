<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LockClosedIcon, PlusIcon, FunnelIcon, StarIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { supabase } from '../lib/supabase'

interface Customer {
  id: string
  phone: string
  full_name: string
  loyal_points: number
  customer_class: string
  total_spent: number
  created_at: string
}

const customers = ref<Customer[]>([])
const loading = ref(false)
const isAuthenticated = ref(false)
const passwordInput = ref('')

const sortOrder = ref<'asc' | 'desc'>('desc')
const searchQuery = ref('')
const showAddModal = ref(false)

const newCustomer = ref({
  full_name: '',
  phone: ''
})

const fetchCustomers = async () => {
  loading.value = true
  const { data } = await supabase.from('customers').select('*').order('total_spent', { ascending: false })
  if (data) {
    // Tự động phân hạng
    const updatedData = data.map((c: any) => {
      let tier = 'Standard'
      if (c.loyal_points >= 500) tier = 'Diamond'
      else if (c.loyal_points >= 200) tier = 'Gold'
      else if (c.loyal_points >= 50) tier = 'Silver'
      return { ...c, customer_class: tier }
    })
    customers.value = updatedData
  }
  loading.value = false
}

onMounted(() => {
  fetchCustomers()
})

const loginAdmin = () => {
  if (passwordInput.value === 'admin123') {
    isAuthenticated.value = true
  } else {
    alert('Sai mật khẩu Admin!')
  }
}

const sortedAndFilteredCustomers = computed(() => {
  let result = customers.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.full_name.toLowerCase().includes(q) || 
      (c.phone && c.phone.includes(q))
    )
  }
  
  return result.sort((a, b) => {
    if (sortOrder.value === 'desc') return b.total_spent - a.total_spent
    return a.total_spent - b.total_spent
  })
})

const addCustomer = async () => {
  if (!newCustomer.value.full_name || !newCustomer.value.phone) {
    return alert('Vui lòng nhập tên và SĐT')
  }
  try {
    const { data, error } = await supabase.from('customers').insert([{
      full_name: newCustomer.value.full_name,
      phone: newCustomer.value.phone,
      total_spent: 0,
      loyal_points: 0,
      customer_class: 'Standard'
    }]).select()
    
    if (error) throw error
    
    if (data) {
      customers.value.unshift(data[0])
    }
    alert('Đã thêm khách hàng thành công!')
    showAddModal.value = false
    newCustomer.value = { full_name: '', phone: '' }
  } catch (error: any) {
    alert('Lỗi thêm khách hàng: ' + error.message)
  }
}

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
</script>

<template>
  <!-- Security Lock Screen -->
  <div v-if="!isAuthenticated" class="h-full flex items-center justify-center bg-background p-6 w-full">
    <div class="bg-surface p-8 rounded-2xl shadow-lg max-w-sm w-full text-center border border-border">
      <div class="w-16 h-16 bg-blue-50 text-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
        <LockClosedIcon class="w-8 h-8" />
      </div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Xác thực Admin</h2>
      <p class="text-sm text-gray-500 mb-6">Trang quản lý khách hàng chứa dữ liệu bảo mật. Vui lòng nhập mật khẩu (Mặc định: admin123).</p>
      <form @submit.prevent="loginAdmin">
        <input v-model="passwordInput" type="password" placeholder="Nhập mật khẩu..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue mb-4 text-center tracking-widest">
        <button type="submit" class="w-full py-3 bg-primary-blue text-white rounded-xl font-medium hover:bg-blue-600 transition shadow-md shadow-blue-500/20">Mở khoá</button>
      </form>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else class="p-6 h-full overflow-y-auto w-full bg-background">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
      <button @click="showAddModal = true" class="bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-md w-full md:w-auto">
        <PlusIcon class="w-5 h-5" /> Thêm khách hàng
      </button>
    </div>

    <div class="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      <!-- Search & Filter Bar -->
      <div class="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
        <div class="flex-1 relative">
          <input v-model="searchQuery" type="text" placeholder="Tìm tên, SĐT, Mã KH..." class="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50">
        </div>
        <button @click="toggleSort" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium">
          <FunnelIcon class="w-5 h-5" />
          {{ sortOrder === 'desc' ? 'Ghé thăm nhiều nhất' : 'Ghé thăm ít nhất' }}
        </button>
      </div>

      <!-- Customer List -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 text-sm text-gray-500 bg-white">
              <th class="py-4 px-6 font-medium">Khách hàng</th>
              <th class="py-4 px-6 font-medium text-center">Hạng thẻ & Điểm</th>
              <th class="py-4 px-6 font-medium text-right">Tổng chi tiêu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b border-gray-100">
              <td colspan="3" class="text-center py-8 text-gray-400">Đang tải dữ liệu...</td>
            </tr>
            <tr v-else-if="sortedAndFilteredCustomers.length === 0" class="border-b border-gray-100">
              <td colspan="3" class="text-center py-8 text-gray-400">Không tìm thấy khách hàng nào</td>
            </tr>
            <tr v-for="customer in sortedAndFilteredCustomers" :key="customer.id" class="border-b border-gray-100 hover:bg-gray-50 transition bg-white">
              <td class="py-4 px-6">
                <div class="font-bold text-gray-900">{{ customer.full_name }}</div>
                <div class="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  {{ customer.phone }}
                </div>
              </td>
              <td class="py-4 px-6 text-center">
                <div class="flex flex-col items-center gap-1">
                  <span class="inline-block px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-bold text-xs" :class="{ 'bg-blue-50 text-blue-600 border-blue-200': customer.customer_class === 'Diamond', 'bg-gray-100 text-gray-600 border-gray-300': customer.customer_class === 'Standard' }">
                    {{ customer.customer_class }}
                  </span>
                  <span class="text-xs font-semibold text-gray-500">{{ customer.loyal_points }} điểm</span>
                </div>
              </td>
              <td class="py-4 px-6 text-right font-bold text-primary-blue">
                {{ formatCurrency(customer.total_spent) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-bold text-gray-800">Thêm khách hàng</h2>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="addCustomer" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input v-model="newCustomer.name" type="text" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:bg-white" placeholder="Nguyễn Văn A">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input v-model="newCustomer.phone" type="text" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:bg-white" placeholder="098xxxxxx">
            </div>
            <div class="pt-4 flex justify-end gap-3">
              <button type="button" @click="showAddModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Hủy</button>
              <button type="submit" class="px-6 py-2 bg-primary-blue text-white rounded-lg font-medium hover:bg-blue-600 shadow-md">Lưu thông tin</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>
