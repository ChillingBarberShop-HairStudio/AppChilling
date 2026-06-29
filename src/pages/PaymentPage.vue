<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'

const route = useRoute()
const router = useRouter()
const bookingId = route.params.id as string

const booking = ref<any>(null)
const services = ref<any[]>([])
const isLoading = ref(true)

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const fetchBooking = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, booking_services(*)')
    .eq('id', bookingId)
    .single()

  if (!error && data) {
    booking.value = data
    services.value = data.booking_services || []
  }
  isLoading.value = false
}

onMounted(() => {
  fetchBooking()
})

const calculateTotal = () => {
  return services.value.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
}

const completePayment = async () => {
  if (!confirm('Xác nhận hoàn tất thanh toán cho đơn này?')) return

  // 1. Cập nhật tổng tiền vào bookings
  const finalTotal = calculateTotal()
  await supabase
    .from('bookings')
    .update({ 
      status: 'paid',
      subtotal: finalTotal,
      total_amount: finalTotal
    })
    .eq('id', bookingId)

  // 2. Lưu/Cập nhật vào CRM Khách hàng
  if (booking.value) {
    const phone = booking.value.customer_phone
    // Check xem khách tồn tại chưa
    const { data: existCustomer } = await supabase.from('customers').select('*').eq('phone', phone).single()
    
    if (existCustomer) {
      await supabase.from('customers').update({
        total_spent: Number(existCustomer.total_spent) + finalTotal,
        loyal_points: Number(existCustomer.loyal_points) + Math.floor(finalTotal / 10000)
      }).eq('id', existCustomer.id)
    } else {
      await supabase.from('customers').insert({
        phone: phone,
        full_name: booking.value.customer_name,
        total_spent: finalTotal,
        loyal_points: Math.floor(finalTotal / 10000)
      })
    }
  }

  alert('Thanh toán thành công! Khách hàng đã được lưu vào CRM.')
  router.push('/app/appointments')
}

// Giả lập thêm dịch vụ (Trong thực tế sẽ fetch từ bảng services và chọn)
const addExtraService = () => {
  services.value.push({
    id: 'temp-' + Date.now(),
    service_name: 'Dịch vụ phát sinh',
    staff_name: 'Thông',
    price: 50000,
    quantity: 1,
    isNew: true // Đánh dấu chưa lưu lên DB
  })
}

const removeService = (index: number) => {
  services.value.splice(index, 1)
}

</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 pb-24 p-4">
    <button @click="router.back()" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
      <ArrowLeft class="w-5 h-5" /> Quay lại
    </button>

    <div v-if="isLoading" class="text-center py-12">
      <div class="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <template v-else-if="booking">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Thanh toán Đơn hàng</h2>
        
        <div class="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl text-sm">
          <div>
            <p class="text-gray-500 mb-1">Khách hàng</p>
            <p class="font-semibold text-gray-900">{{ booking.customer_name }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Số điện thoại</p>
            <p class="font-semibold text-gray-900">{{ booking.customer_phone }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Thời gian</p>
            <p class="font-semibold text-gray-900">{{ booking.time_slot }} - {{ new Date(booking.appointment_date).toLocaleDateString('vi-VN') }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Mã đơn</p>
            <p class="font-semibold text-primary-blue">{{ booking.booking_code }}</p>
          </div>
        </div>

        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">Chi tiết dịch vụ</h3>
          <button @click="addExtraService" class="flex items-center gap-1 text-sm font-medium text-primary-blue hover:text-blue-700">
            <Plus class="w-4 h-4" /> Thêm dịch vụ
          </button>
        </div>

        <div class="space-y-4 mb-8">
          <div v-for="(svc, index) in services" :key="svc.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div class="flex-1">
              <input v-if="svc.isNew" v-model="svc.service_name" class="font-semibold text-gray-900 w-full outline-none bg-transparent" placeholder="Tên dịch vụ..." />
              <p v-else class="font-semibold text-gray-900">{{ svc.service_name }}</p>
              
              <div class="flex items-center gap-2 mt-1">
                <span class="text-sm text-gray-500">Nhân viên:</span>
                <input v-if="svc.isNew" v-model="svc.staff_name" class="text-sm text-gray-900 w-24 outline-none bg-transparent" placeholder="Tên NV" />
                <span v-else class="text-sm text-gray-900 font-medium">{{ svc.staff_name || 'Chưa rõ' }}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <input v-if="svc.isNew" v-model="svc.price" type="number" class="w-24 text-right font-semibold text-primary-blue outline-none border-b border-gray-300" />
                <p v-else class="font-semibold text-primary-blue">{{ formatCurrency(svc.price) }}</p>
                <span class="text-gray-400">x</span>
                <input type="number" v-model="svc.quantity" min="1" class="w-12 text-center border border-gray-300 rounded p-1" />
              </div>
              <button v-if="svc.isNew" @click="removeService(index)" class="text-red-500 hover:bg-red-50 p-1 rounded">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-gray-500">Tổng cộng</p>
            <p class="text-2xl font-bold text-barber-navy">{{ formatCurrency(calculateTotal()) }}</p>
          </div>
          <p class="text-sm text-gray-500 text-right mb-6">Đã bao gồm thuế VAT</p>

          <button @click="completePayment" class="w-full py-4 bg-success hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
            <CheckCircle class="w-5 h-5" /> HOÀN TẤT THANH TOÁN
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
