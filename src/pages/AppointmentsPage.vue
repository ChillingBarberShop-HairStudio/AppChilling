<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Plus, Clock, User, Scissors } from 'lucide-vue-next'
import StatusBadge from '../components/ui/StatusBadge.vue'
import { supabase } from '../lib/supabase'

const router = useRouter()
const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val)

const appointments = ref<any[]>([])
const isLoading = ref(true)

const fetchAppointments = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, booking_services(*)')
    .order('created_at', { ascending: false })

  if (!error && data) {
    appointments.value = data
  }
  isLoading.value = false
}

onMounted(() => {
  fetchAppointments()
  
  // Realtime subscription
  const subscription = supabase
    .channel('bookings_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchAppointments)
    .subscribe()

  onUnmounted(() => {
    subscription.unsubscribe()
  })
})

const updateStatus = async (id: string, newStatus: string) => {
  if (newStatus === 'completed') {
    // Chuyển sang màn thanh toán
    router.push(`/app/payment/${id}`)
    return
  }

  await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', id)
  
  fetchAppointments()
}

const getPrimaryService = (app: any) => {
  if (app.booking_services && app.booking_services.length > 0) {
    const names = app.booking_services.map((s: any) => s.service_name)
    return names.join(', ')
  }
  return 'Dịch vụ tùy chọn'
}

const getPrimaryStaff = (app: any) => {
  if (app.booking_services && app.booking_services.length > 0) {
    const staffs = app.booking_services.map((s: any) => s.staff_name).filter((s: string) => s)
    return staffs.length > 0 ? staffs.join(', ') : 'Chưa phân công'
  }
  return 'Chưa phân công'
}
</script>

<template>
  <div class="space-y-6 pb-24">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-barber-navy">Quản lý Đơn hàng</h1>
        <p class="text-sm text-gray-500">Quản lý trạng thái phục vụ và thanh toán đơn.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-surface border border-gray-300 rounded-xl font-medium text-gray-700 flex-1 sm:flex-none items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
          <Calendar class="w-4 h-4" /> Xem lịch tuần
        </button>
        <button class="bg-primary-blue text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm flex-1 sm:flex-none">
          <Plus class="w-4 h-4" /> Thêm đơn
        </button>
      </div>
    </div>

    <!-- Appointment Board -->
    <div class="relative bg-surface rounded-2xl border border-border shadow-sm overflow-hidden min-h-[400px]">
      
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <div class="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="flex flex-col md:flex-row">
        <!-- Cards Area -->
        <div class="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="app in appointments" :key="app.id" 
               class="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
               :class="app.status === 'serving' ? 'border-primary-blue ring-1 ring-primary-blue/20' : 'border-border'">
            
            <div v-if="app.status === 'serving'" class="absolute top-0 left-0 w-1 h-full bg-primary-blue"></div>
            
            <div class="flex justify-between items-start mb-3">
              <StatusBadge :status="app.status" type="appointment" />
              <div class="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                <Clock class="w-3.5 h-3.5" /> {{ app.time_slot }}
              </div>
            </div>
            
            <h3 class="font-bold text-barber-navy text-lg mb-1">{{ app.customer_name }}</h3>
            
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Scissors class="w-4 h-4 text-gray-400" /> {{ getPrimaryService(app) }}
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white">
                  <User class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium text-gray-700 truncate max-w-[100px]">{{ getPrimaryStaff(app) }}</span>
              </div>
              <div class="text-sm font-semibold text-primary-blue">
                {{ formatCurrency(app.total_amount) }}
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2 justify-end">
              <button v-if="app.status === 'waiting'" @click="updateStatus(app.id, 'serving')" class="px-3 py-1.5 text-xs font-medium bg-primary-blue text-white rounded-lg hover:bg-blue-600 w-full transition-colors">Bắt đầu phục vụ</button>
              <button v-if="app.status === 'serving'" @click="updateStatus(app.id, 'completed')" class="px-3 py-1.5 text-xs font-medium bg-success text-white rounded-lg hover:bg-green-600 w-full transition-colors">Hoàn thành & Thanh toán</button>
              <button v-if="app.status === 'paid'" class="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed w-full">Đã thanh toán</button>
              <button v-if="app.status === 'completed'" @click="updateStatus(app.id, 'completed')" class="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 w-full transition-colors">Mở lại thanh toán</button>
            </div>
          </div>
          
          <div v-if="appointments.length === 0" class="col-span-full text-center py-12 text-gray-500">
            Không có đơn hàng nào hôm nay.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
