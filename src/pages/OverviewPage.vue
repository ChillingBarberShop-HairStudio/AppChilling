<script setup lang="ts">
import { DollarSign, CalendarCheck, FileText, TrendingUp, Plus, Printer, Volume2 } from 'lucide-vue-next'
import AppCard from '../components/ui/AppCard.vue'
import KpiCard from '../components/ui/KpiCard.vue'
import IconTile from '../components/ui/IconTile.vue'
import BarberPoleAnimation from '../components/brand/BarberPoleAnimation.vue'
import { mockTimeline } from '../data/mockData'
import { apiClient } from '../api/apiClient'
import { ref, onMounted } from 'vue'

const kpis = ref({
  revenueToday: 0,
  appointmentsToday: 0,
  newInvoices: 0,
  paidInvoices: 0,
  debt: 0,
  newCustomers: 0,
})

onMounted(async () => {
  try {
    const res = await apiClient.get('/kpis')
    kpis.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải KPIs:', err)
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-barber-navy">Tổng quan hôm nay</h1>
        <p class="text-sm text-gray-500">Xin chào Admin, chúc một ngày làm việc hiệu quả.</p>
      </div>
      <div class="hidden sm:block">
        <button class="bg-primary-blue text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
          <Plus class="w-4 h-4" /> Tạo hóa đơn
        </button>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Doanh thu" :value="kpis.revenueToday" trend="up" trendValue="+12%" :icon="DollarSign" />
      <KpiCard title="Lịch hẹn" :value="kpis.appointmentsToday" :icon="CalendarCheck" />
      <KpiCard title="Hóa đơn mới" :value="kpis.newInvoices" :icon="FileText" />
      <KpiCard title="Khách mới" :value="kpis.newCustomers" trend="up" trendValue="+2" :icon="TrendingUp" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Quick Actions -->
        <AppCard title="Thao tác nhanh">
          <div class="grid grid-cols-4 gap-4">
            <IconTile title="Hóa đơn" :icon="Receipt" color="blue" />
            <IconTile title="Lịch hẹn" :icon="CalendarPlus" color="gold" />
            <IconTile title="In thử" :icon="Printer" color="gray" />
            <IconTile title="Test loa" :icon="Volume2" color="red" />
          </div>
        </AppCard>

        <!-- Brand Banner -->
        <div class="relative rounded-2xl overflow-hidden h-40 shadow-sm border border-border group">
          <img src="/panel.PNG" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Brand Panel" />
          <div class="absolute inset-0 bg-gradient-to-r from-barber-navy/90 to-transparent"></div>
          <div class="absolute left-0 top-0 bottom-0 w-2">
            <BarberPoleAnimation size="hero" />
          </div>
          <div class="absolute inset-0 p-6 flex flex-col justify-center text-white">
            <img src="/Logo.PNG" class="h-8 object-contain object-left mb-2 brightness-0 invert" alt="Logo" />
            <h3 class="text-xl font-bold">Chilling Studio OS</h3>
            <p class="text-sm text-gray-300">Hệ thống đang hoạt động ổn định.</p>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Timeline -->
        <AppCard title="Hoạt động gần đây">
          <div class="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-2 before:w-px before:bg-gray-200">
            <div v-for="(item, i) in mockTimeline" :key="i" class="relative">
              <div class="absolute -left-[29px] w-3 h-3 rounded-full bg-primary-blue border-2 border-white shadow-sm top-1"></div>
              <div class="text-xs font-semibold text-primary-blue mb-0.5">{{ item.time }}</div>
              <div class="text-sm text-gray-700">{{ item.text }}</div>
            </div>
          </div>
          <button class="w-full mt-6 py-2 text-sm font-medium text-primary-blue hover:bg-blue-50 rounded-lg transition-colors">
            Xem tất cả
          </button>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Receipt, CalendarPlus } from 'lucide-vue-next'
export default {
  components: {
    Receipt, CalendarPlus
  }
}
</script>
