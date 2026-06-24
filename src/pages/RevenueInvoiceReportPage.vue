<script setup lang="ts">
import { ChevronLeft, Calendar, Download } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import KpiCard from '../components/ui/KpiCard.vue'
import AppCard from '../components/ui/AppCard.vue'
import { mockInvoices } from '../data/mockData'

const router = useRouter()
const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val)
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-4">
        <button @click="router.push('/app/reports/revenue')" class="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-barber-navy">Doanh thu theo hóa đơn</h1>
          <p class="text-sm text-gray-500">Thống kê doanh thu từ các hóa đơn đã xuất.</p>
        </div>
      </div>
      <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto">
        <Download class="w-4 h-4" /> Xuất Excel
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-2 rounded-xl border border-border flex gap-2 overflow-x-auto shadow-sm">
      <button class="px-4 py-2 bg-primary-blue text-white rounded-lg text-sm font-medium whitespace-nowrap shadow-sm">Hôm nay</button>
      <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Hôm qua</button>
      <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">7 ngày</button>
      <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Tháng này</button>
      <div class="w-px bg-gray-200 mx-1 hidden sm:block"></div>
      <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2">
        <Calendar class="w-4 h-4" /> Tùy chọn ngày
      </button>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <KpiCard title="Doanh thu" :value="1860000" />
      <KpiCard title="Đã thanh toán" :value="1410000" />
      <KpiCard title="Còn nợ" :value="450000" />
      <KpiCard title="Giảm giá" :value="0" />
      <KpiCard title="Thuế VAT" :value="0" />
      <KpiCard title="Số hóa đơn" :value="5" />
    </div>

    <!-- Table -->
    <AppCard no-padding title="Chi tiết hóa đơn">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-border text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-4">Mã HĐ</th>
              <th class="px-5 py-4">Khách hàng</th>
              <th class="px-5 py-4 text-right">Tổng tiền</th>
              <th class="px-5 py-4 text-right">Giảm giá</th>
              <th class="px-5 py-4 text-right">Đã thanh toán</th>
              <th class="px-5 py-4 text-right">Còn nợ</th>
              <th class="px-5 py-4">Ngày</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="inv in mockInvoices" :key="inv.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-medium text-primary-blue">{{ inv.id }}</td>
              <td class="px-5 py-4 text-barber-navy">{{ inv.customer }}</td>
              <td class="px-5 py-4 text-right font-semibold text-barber-navy">{{ formatCurrency(inv.total) }}</td>
              <td class="px-5 py-4 text-right text-gray-500">0</td>
              <td class="px-5 py-4 text-right font-medium text-success">{{ formatCurrency(inv.paid) }}</td>
              <td class="px-5 py-4 text-right">
                <span :class="inv.debt > 0 ? 'text-danger font-medium' : 'text-gray-500'">
                  {{ formatCurrency(inv.debt) }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-gray-500">{{ inv.date }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colspan="2" class="px-5 py-4 font-bold text-barber-navy text-right">Tổng cộng</td>
              <td class="px-5 py-4 text-right font-bold text-barber-navy">{{ formatCurrency(1860000) }}</td>
              <td class="px-5 py-4 text-right font-bold text-gray-500">0</td>
              <td class="px-5 py-4 text-right font-bold text-success">{{ formatCurrency(1410000) }}</td>
              <td class="px-5 py-4 text-right font-bold text-danger">{{ formatCurrency(450000) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AppCard>
  </div>
</template>
