<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowUpRight, Wallet, Users, Clock, Scissors } from 'lucide-vue-next'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import { supabase } from '../lib/supabase'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val)

const isLoading = ref(true)

// KPIs
const stats = ref([
  { title: 'Tổng doanh thu', value: '0 đ', change: '+0%', isPositive: true, icon: Wallet, color: 'text-primary-blue', bg: 'bg-blue-50' },
  { title: 'Tổng đơn hàng', value: '0', change: '+0%', isPositive: true, icon: Scissors, color: 'text-success', bg: 'bg-green-50' },
  { title: 'Khách hàng mới', value: '0', change: '+0%', isPositive: true, icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
  { title: 'Tổng chi phí', value: '0 đ', change: '0%', isPositive: false, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' }
])

// Chart Options
const revenueOption = ref({})
const serviceOption = ref({})
const staffOption = ref({})
const customerOption = ref({})

const fetchData = async () => {
  isLoading.value = true

  // Lấy đơn hàng đã thanh toán
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, booking_services(*)')
    .eq('status', 'paid')

  // Lấy chi phí từ giao dịch kho (Giả định giá trị xuất kho - Cần nâng cấp thêm bảng costs thực tế)
  // Ở đây mock tạm chi phí
  
  if (bookings) {
    let totalRev = 0
    let totalInvoices = bookings.length
    
    // Aggregations
    const revenueByMonth: Record<string, number> = {}
    const serviceCounts: Record<string, number> = {}
    const staffRevenue: Record<string, number> = {}
    
    bookings.forEach((b: any) => {
      totalRev += Number(b.total_amount)
      
      const month = new Date(b.created_at).toLocaleString('vi-VN', { month: 'short' })
      revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(b.total_amount)

      b.booking_services?.forEach((s: any) => {
        serviceCounts[s.service_name] = (serviceCounts[s.service_name] || 0) + s.quantity
        staffRevenue[s.staff_name || 'Khác'] = (staffRevenue[s.staff_name || 'Khác'] || 0) + (s.price * s.quantity)
      })
    })

    // Update KPIs
    stats.value[0].value = formatCurrency(totalRev) + ' đ'
    stats.value[1].value = totalInvoices.toString()
    
    // Revenue Chart (6 tháng)
    const months = Object.keys(revenueByMonth)
    const revData = Object.values(revenueByMonth)
    
    revenueOption.value = {
      tooltip: { trigger: 'axis', formatter: (p: any) => formatCurrency(p[0].value) + ' đ' },
      xAxis: { type: 'category', data: months.length ? months : ['Tháng này'], axisLine: { lineStyle: { color: '#E5E7EB' } } },
      yAxis: { type: 'value', axisLabel: { formatter: (v: number) => (v / 1000000) + 'M' } },
      series: [{ data: revData.length ? revData : [totalRev], type: 'line', smooth: true, areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }, itemStyle: { color: '#3B82F6' } }]
    }

    // Top Services
    const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    serviceOption.value = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: sortedServices.map(s => s[0]).reverse() },
      series: [{ type: 'bar', data: sortedServices.map(s => s[1]).reverse(), itemStyle: { color: '#3B82F6', borderRadius: [0, 4, 4, 0] } }]
    }

    // Staff Performance
    const staffData = Object.entries(staffRevenue).map(s => ({ name: s[0], value: s[1] }))
    staffOption.value = {
      tooltip: { trigger: 'item', formatter: '{b}: {c} đ ({d}%)' },
      series: [{ type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false, itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }, data: staffData.length ? staffData : [{name: 'Chưa có', value: 0}] }]
    }
  }

  // Khách hàng
  const { data: customers } = await supabase.from('customers').select('*').order('total_spent', { ascending: false })
  if (customers) {
    stats.value[2].value = customers.length.toString()

    const topCustomers = customers.slice(0, 5)
    customerOption.value = {
      tooltip: { trigger: 'axis', formatter: (p: any) => formatCurrency(p[0].value) + ' đ' },
      xAxis: { type: 'category', data: topCustomers.map((c: any) => c.full_name) },
      yAxis: { type: 'value', axisLabel: { formatter: (v: number) => (v / 1000000) + 'M' } },
      series: [{ data: topCustomers.map((c: any) => c.total_spent), type: 'bar', itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] } }]
    }
  }

  isLoading.value = false
}

onMounted(() => {
  fetchData()
})

</script>

<template>
  <div class="space-y-6 pb-24 p-4 max-w-7xl mx-auto">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p class="text-sm text-gray-500">Phân tích kinh doanh từ dữ liệu hệ thống</p>
      </div>
      <button @click="fetchData" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
        Làm mới
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div :class="[stat.bg, stat.color, 'w-12 h-12 rounded-xl flex items-center justify-center']">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div :class="[stat.isPositive ? 'text-success bg-green-50' : 'text-red-500 bg-red-50', 'px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-semibold']">
            <ArrowUpRight v-if="stat.isPositive" class="w-4 h-4" />
            <ArrowUpRight v-else class="w-4 h-4 rotate-180" />
            {{ stat.change }}
          </div>
        </div>
        <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="py-12 flex justify-center">
      <div class="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Charts -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Doanh thu 6 tháng</h3>
        <v-chart class="h-64 w-full" :option="revenueOption" autoresize />
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Hiệu suất nhân viên</h3>
        <v-chart class="h-64 w-full" :option="staffOption" autoresize />
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Dịch vụ bán chạy</h3>
        <v-chart class="h-64 w-full" :option="serviceOption" autoresize />
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Top khách hàng VIP</h3>
        <v-chart class="h-64 w-full" :option="customerOption" autoresize />
      </div>
    </div>
  </div>
</template>
