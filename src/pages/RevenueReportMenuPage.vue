<script setup lang="ts">
import { ChevronLeft, Receipt, CreditCard, Users, Scissors, Package, Layers } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import ReportListItem from '../components/ui/ReportListItem.vue'

const router = useRouter()

const revenueReports = [
  { title: 'Doanh thu theo hóa đơn', icon: Receipt, path: '/app/reports/revenue/invoices' },
  { title: 'Doanh thu theo phương thức thanh toán', icon: CreditCard, path: '/app/reports/revenue/methods' },
  { title: 'Doanh thu theo khách hàng', icon: Users, path: '/app/reports/revenue/customers' },
  { title: 'Doanh thu theo dịch vụ', icon: Scissors, path: '/app/reports/revenue/services' },
  { title: 'Doanh thu theo sản phẩm', icon: Package, path: '/app/reports/revenue/products' },
  { title: 'Doanh thu theo gói dịch vụ', icon: Layers, path: '/app/reports/revenue/packages' },
]
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center gap-4 mb-8">
      <button @click="router.back()" class="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
        <ChevronLeft class="w-6 h-6" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-barber-navy">Báo cáo Doanh thu</h1>
        <p class="text-sm text-gray-500">Phân tích chi tiết nguồn thu của cửa hàng.</p>
      </div>
    </div>

    <!-- Report List -->
    <div class="bg-surface rounded-2xl p-2 sm:p-4 shadow-sm border border-border">
      <div class="grid grid-cols-1 gap-2">
        <ReportListItem 
          v-for="report in revenueReports" 
          :key="report.title"
          :title="report.title"
          :icon="report.icon"
          :to="report.path"
        />
      </div>
    </div>
  </div>
</template>
