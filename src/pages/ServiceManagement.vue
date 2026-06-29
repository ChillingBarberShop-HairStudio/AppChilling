<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/outline'
import { supabase } from '../lib/supabase'

interface Service {
  id: string
  group_name: string
  name: string
  price: number
  duration_minutes: number
  staff_role: string
  staff_options: string[]
  is_active: boolean
}

const services = ref<Service[]>([])
const isLoading = ref(true)

const showModal = ref(false)
const isEditing = ref(false)
const currentService = ref<Partial<Service>>({
  group_name: '1/. Đặt Lịch Cắt Tóc Tại Đây',
  name: '',
  price: 0,
  duration_minutes: 30,
  staff_role: 'mixed',
  staff_options: [],
  is_active: true
})
const staffOptionsStr = ref('')

const fetchServices = async () => {
  isLoading.value = true
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('group_name')
    .order('name')
  
  if (!error && data) {
    services.value = data
  }
  isLoading.value = false
}

onMounted(() => {
  fetchServices()
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const openAddModal = () => {
  isEditing.value = false
  currentService.value = {
    group_name: '1/. Đặt Lịch Cắt Tóc Tại Đây',
    name: '',
    price: 0,
    duration_minutes: 30,
    staff_role: 'mixed',
    staff_options: [],
    is_active: true
  }
  staffOptionsStr.value = ''
  showModal.value = true
}

const openEditModal = (svc: Service) => {
  isEditing.value = true
  currentService.value = { ...svc }
  staffOptionsStr.value = svc.staff_options.join(', ')
  showModal.value = true
}

const saveService = async () => {
  // Convert staff options string to array
  const optionsArr = staffOptionsStr.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
  currentService.value.staff_options = optionsArr

  if (isEditing.value && currentService.value.id) {
    await supabase
      .from('services')
      .update(currentService.value)
      .eq('id', currentService.value.id)
  } else {
    await supabase
      .from('services')
      .insert(currentService.value)
  }
  
  showModal.value = false
  fetchServices()
}

const deleteService = async (id: string) => {
  if (confirm('Bạn có chắc muốn xóa dịch vụ này? (Có thể ảnh hưởng tới các đơn cũ)')) {
    await supabase.from('services').delete().eq('id', id)
    fetchServices()
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Sản phẩm & Dịch vụ</h1>
        <p class="text-sm text-gray-500 mt-1">Quản lý giá và nhân viên phục vụ, đồng bộ trực tiếp lên Landing Page</p>
      </div>
      <button @click="openAddModal" class="flex items-center gap-2 bg-primary-blue hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors">
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Thêm dịch vụ</span>
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th class="px-4 py-3">Nhóm</th>
              <th class="px-4 py-3">Tên dịch vụ</th>
              <th class="px-4 py-3">Giá</th>
              <th class="px-4 py-3">Thời gian</th>
              <th class="px-4 py-3">Nhân viên</th>
              <th class="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="svc in services" :key="svc.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-gray-500">{{ svc.group_name }}</td>
              <td class="px-4 py-3 font-medium text-gray-900">{{ svc.name }}</td>
              <td class="px-4 py-3 text-blue-600 font-semibold">{{ formatCurrency(svc.price) }}</td>
              <td class="px-4 py-3 text-gray-500">{{ svc.duration_minutes }} phút</td>
              <td class="px-4 py-3 text-gray-500 truncate max-w-[150px]">{{ svc.staff_options.join(', ') }}</td>
              <td class="px-4 py-3 flex items-center justify-end gap-2">
                <button @click="openEditModal(svc)" class="p-1.5 text-gray-400 hover:text-primary-blue rounded-lg transition-colors">
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button @click="deleteService(svc.id)" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <TrashIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới' }}</h3>
        </div>
        
        <form @submit.prevent="saveService" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nhóm dịch vụ</label>
            <select v-model="currentService.group_name" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none">
              <option>1/. Đặt Lịch Cắt Tóc Tại Đây</option>
              <option>2. UỐN - ÉP SIDE - TẨY - NHUỘM</option>
              <option>3. Dịch Vụ Thư Giãn</option>
              <option>4. Dịch Vụ Riêng Lẻ</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input v-model="currentService.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
              <input v-model="currentService.price" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian (Phút)</label>
              <input v-model="currentService.duration_minutes" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Danh sách nhân viên phục vụ (cách nhau dấu phẩy)</label>
            <input v-model="staffOptionsStr" type="text" placeholder="VD: Thông, Nam, Hương" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue/20 outline-none" />
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input type="checkbox" v-model="currentService.is_active" id="isActive" class="rounded text-primary-blue w-4 h-4" />
            <label for="isActive" class="text-sm font-medium text-gray-700">Đang hoạt động (Hiển thị trên web)</label>
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
            <button type="submit" class="px-5 py-2.5 bg-primary-blue hover:bg-blue-600 text-white font-medium rounded-xl shadow-sm transition-colors">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
