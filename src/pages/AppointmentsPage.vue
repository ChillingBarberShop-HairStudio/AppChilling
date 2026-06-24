<script setup lang="ts">
import { Calendar, Plus, Clock, User, Scissors } from 'lucide-vue-next'
import StatusBadge from '../components/ui/StatusBadge.vue'
import { mockAppointments } from '../data/mockData'

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-barber-navy">Lịch hẹn hôm nay</h1>
        <p class="text-sm text-gray-500">Quản lý và điều phối lịch cắt tóc, dịch vụ.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-surface border border-gray-300 rounded-xl font-medium text-gray-700 flex-1 sm:flex-none items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
          <Calendar class="w-4 h-4" /> Xem lịch tuần
        </button>
        <button class="bg-primary-blue text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm flex-1 sm:flex-none">
          <Plus class="w-4 h-4" /> Thêm lịch
        </button>
      </div>
    </div>

    <!-- Appointment Board -->
    <div class="relative bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <!-- Time Rail (Mocked visually) -->
      <div class="flex flex-col md:flex-row">
        
        <div class="w-full md:w-24 bg-gray-50 border-b md:border-b-0 md:border-r border-border p-4 flex md:flex-col gap-4 overflow-x-auto">
          <div class="text-xs font-semibold text-gray-400 whitespace-nowrap">09:00</div>
          <div class="text-xs font-semibold text-primary-blue whitespace-nowrap">10:00 (Hiện tại)</div>
          <div class="text-xs font-semibold text-gray-400 whitespace-nowrap">11:00</div>
          <div class="text-xs font-semibold text-gray-400 whitespace-nowrap">13:00</div>
          <div class="text-xs font-semibold text-gray-400 whitespace-nowrap">15:00</div>
        </div>

        <!-- Cards Area -->
        <div class="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="app in mockAppointments" :key="app.id" 
               class="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
               :class="app.status === 'in_service' ? 'border-primary-blue ring-1 ring-primary-blue/20' : 'border-border'">
            
            <div v-if="app.status === 'in_service'" class="absolute top-0 left-0 w-1 h-full bg-primary-blue"></div>
            
            <div class="flex justify-between items-start mb-3">
              <StatusBadge :status="app.status" type="appointment" />
              <div class="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                <Clock class="w-3.5 h-3.5" /> {{ app.time }}
              </div>
            </div>
            
            <h3 class="font-bold text-barber-navy text-lg mb-1">{{ app.customer }}</h3>
            
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Scissors class="w-4 h-4 text-gray-400" /> {{ app.service }}
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white">
                  <User class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium text-gray-700">{{ app.staff }}</span>
              </div>
              <div class="text-sm font-semibold text-primary-blue">
                {{ formatCurrency(app.price) }}
              </div>
            </div>

            <!-- Hover Actions -->
            <div class="absolute inset-x-0 bottom-0 p-4 bg-white/95 backdrop-blur border-t translate-y-full group-hover:translate-y-0 transition-transform flex gap-2 justify-end">
              <button class="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Sửa</button>
              <button v-if="app.status === 'scheduled'" class="px-3 py-1.5 text-xs font-medium bg-primary-blue text-white rounded-lg hover:bg-blue-600">Xác nhận</button>
              <button v-if="app.status === 'confirmed'" class="px-3 py-1.5 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600">Đã đến</button>
              <button v-if="app.status === 'arrived'" class="px-3 py-1.5 text-xs font-medium bg-primary-blue text-white rounded-lg hover:bg-blue-600">Phục vụ</button>
              <button v-if="app.status === 'in_service'" class="px-3 py-1.5 text-xs font-medium bg-success text-white rounded-lg hover:bg-green-600">Hoàn thành</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
