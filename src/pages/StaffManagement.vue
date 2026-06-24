<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon, TrashIcon, PencilIcon, UserIcon } from '@heroicons/vue/24/outline'

interface Staff {
  id: number
  name: string
  position: string
  phone: string
  avatar: string
  custom_fields: Array<{key: string, value: string}>
}

// MOCK DATA cho Supabase sau này
const staffList = ref<Staff[]>([
  { id: 1, name: 'Nguyễn Văn Quản', position: 'Quản lý', phone: '0901234567', avatar: '', custom_fields: [{key: 'Kinh nghiệm', value: '5 năm'}] },
  { id: 2, name: 'Trần Thợ Chính', position: 'Thợ chính', phone: '0987654321', avatar: '', custom_fields: [{key: 'Sở trường', value: 'Cắt tóc nam'}] },
])
const loading = ref(false)

// Modal state
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// Form state
const formData = ref({
  name: '',
  position: '',
  phone: '',
  avatar: null as File | null,
  custom_fields: [] as Array<{key: string, value: string}>
})

// Preview URL for avatar
const avatarPreview = ref('')

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.value.avatar = target.files[0]
    avatarPreview.value = URL.createObjectURL(target.files[0])
  }
}

const addCustomField = () => {
  formData.value.custom_fields.push({ key: '', value: '' })
}

const removeCustomField = (index: number) => {
  formData.value.custom_fields.splice(index, 1)
}

const openAddModal = () => {
  isEdit.value = false
  currentId.value = null
  formData.value = { name: '', position: '', phone: '', avatar: null, custom_fields: [] }
  avatarPreview.value = ''
  showModal.value = true
}

const openEditModal = (staff: Staff) => {
  isEdit.value = true
  currentId.value = staff.id
  formData.value = {
    name: staff.name,
    position: staff.position,
    phone: staff.phone,
    avatar: null,
    custom_fields: [...staff.custom_fields]
  }
  avatarPreview.value = staff.avatar || ''
  showModal.value = true
}

const saveStaff = async () => {
  try {
    if (isEdit.value && currentId.value) {
      // Mock update
      const index = staffList.value.findIndex(s => s.id === currentId.value)
      if (index !== -1) {
        staffList.value[index] = {
          ...staffList.value[index],
          name: formData.value.name,
          position: formData.value.position,
          phone: formData.value.phone,
          custom_fields: [...formData.value.custom_fields],
          avatar: avatarPreview.value
        }
      }
    } else {
      // Mock insert
      staffList.value.push({
        id: Date.now(),
        name: formData.value.name,
        position: formData.value.position,
        phone: formData.value.phone,
        custom_fields: [...formData.value.custom_fields],
        avatar: avatarPreview.value
      })
    }
    showModal.value = false
  } catch (error) {
    console.error('Lỗi lưu nhân viên', error)
    alert('Có lỗi xảy ra, vui lòng thử lại!')
  }
}

const deleteStaff = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xoá nhân viên này?')) {
    try {
      staffList.value = staffList.value.filter(s => s.id !== id)
    } catch (error) {
      console.error('Lỗi xoá nhân viên', error)
    }
  }
}
</script>

<template>
  <div class="p-6 h-full overflow-y-auto w-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý nhân viên</h1>
      <button @click="openAddModal" class="bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition shadow-md">
        <PlusIcon class="w-5 h-5" /> Thêm nhân viên
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
    </div>

    <!-- Staff Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="staff in staffList" :key="staff.id" class="bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition">
        <!-- Avatar Section -->
        <div class="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 relative flex justify-center pt-6">
          <div class="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
            <img v-if="staff.avatar" :src="staff.avatar" class="w-full h-full object-cover" />
            <UserIcon v-else class="w-12 h-12 text-gray-400" />
          </div>
        </div>
        
        <!-- Info Section -->
        <div class="pt-8 pb-4 px-5 text-center">
          <h3 class="text-lg font-semibold text-gray-800">{{ staff.name }}</h3>
          <p class="text-sm font-medium text-primary-blue mb-1">{{ staff.position || 'Nhân viên' }}</p>
          <p class="text-sm text-gray-500 mb-4">{{ staff.phone || 'Chưa cập nhật SĐT' }}</p>
          
          <!-- Custom Fields -->
          <div class="text-left space-y-2 mb-4" v-if="staff.custom_fields && staff.custom_fields.length > 0">
            <div v-for="(field, idx) in staff.custom_fields" :key="idx" class="text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 flex justify-between">
              <span class="text-gray-500">{{ field.key }}:</span>
              <span class="font-medium text-gray-700">{{ field.value }}</span>
            </div>
          </div>
          
          <div class="flex border-t border-border mt-4 pt-4">
            <button @click="openEditModal(staff)" class="flex-1 flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-primary-blue transition">
              <PencilIcon class="w-4 h-4" /> Sửa
            </button>
            <div class="w-px bg-border"></div>
            <button @click="deleteStaff(staff.id)" class="flex-1 flex items-center justify-center gap-1 text-sm text-danger hover:text-red-700 transition">
              <TrashIcon class="w-4 h-4" /> Xoá
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="staffList.length === 0" class="col-span-full py-16 text-center bg-surface rounded-xl border border-dashed border-gray-300">
        <UserIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-600">Chưa có nhân viên nào</h3>
        <p class="text-gray-400 text-sm mt-1 mb-4">Thêm nhân viên mới để quản lý dễ dàng hơn</p>
        <button @click="openAddModal" class="text-primary-blue hover:underline font-medium">
          + Thêm nhân viên ngay
        </button>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-bold text-gray-800">{{ isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới' }}</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="saveStaff" class="space-y-4">
            
            <!-- Avatar Upload -->
            <div class="flex justify-center mb-6">
              <div class="relative group cursor-pointer" @click="($refs.fileInput as HTMLInputElement).click()">
                <div class="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-primary-blue transition">
                  <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" />
                  <div v-else class="text-center text-gray-400 flex flex-col items-center">
                    <PlusIcon class="w-6 h-6" />
                    <span class="text-[10px] mt-1">Ảnh đại diện</span>
                  </div>
                </div>
                <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
              </div>
            </div>

            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input v-model="formData.name" type="text" required class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:bg-white transition" placeholder="Ví dụ: Nguyễn Văn A">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <input v-model="formData.position" type="text" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:bg-white transition" placeholder="VD: Thợ chính">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input v-model="formData.phone" type="text" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:bg-white transition" placeholder="09xx...">
              </div>
            </div>

            <!-- Custom Fields -->
            <div class="mt-6 border-t border-gray-100 pt-4">
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-medium text-gray-700">Thông tin bổ sung tuỳ chỉnh</label>
                <button type="button" @click="addCustomField" class="text-xs text-primary-blue font-medium hover:underline flex items-center gap-1">
                  <PlusIcon class="w-3 h-3" /> Thêm trường
                </button>
              </div>
              
              <div v-for="(field, idx) in formData.custom_fields" :key="idx" class="flex gap-2 mb-2 items-start">
                <input v-model="field.key" type="text" placeholder="Tên thông tin (VD: Quê quán)" class="w-1/3 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-blue focus:bg-white">
                <input v-model="field.value" type="text" placeholder="Giá trị (VD: Hà Nội)" class="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-blue focus:bg-white">
                <button type="button" @click="removeCustomField(idx)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
              <p v-if="formData.custom_fields.length === 0" class="text-xs text-gray-400 italic">Có thể thêm quê quán, CCCD, ngày sinh...</p>
            </div>

          </form>
        </div>
        
        <div class="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Hủy</button>
          <button type="button" @click="saveStaff" class="px-6 py-2 bg-primary-blue text-white rounded-lg font-medium hover:bg-blue-600 shadow-md shadow-blue-500/20 transition">Lưu nhân viên</button>
        </div>
      </div>
    </div>

  </div>
</template>
