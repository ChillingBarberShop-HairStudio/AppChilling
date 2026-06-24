<script setup lang="ts">
import { DollarSign, FileText, CreditCard, Gift, Users, Contact, MapPin, Target } from 'lucide-vue-next'
import ReportListItem from '../components/ui/ReportListItem.vue'

const reportGroups = [
  { title: 'Doanh thu', icon: DollarSign, path: '/app/reports/revenue' },
  { title: 'Công nợ', icon: FileText, path: '/app/reports/debt' },
  { title: 'Thu chi', icon: Target, path: '/app/reports/cashflow' },
  { title: 'Thẻ tiền mặt', icon: CreditCard, path: '/app/reports/cards' },
  { title: 'Tích điểm', icon: Gift, path: '/app/reports/points' },
  { title: 'Khách hàng', icon: Users, path: '/app/reports/customers' },
  { title: 'Nhân viên', icon: Contact, path: '/app/reports/staff' },
  { title: 'Chi nhánh', icon: MapPin, path: '/app/reports/branches' },
]
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="text-center sm:text-left mb-8">
      <h1 class="text-2xl font-bold text-barber-navy">Báo cáo trung tâm</h1>
      <p class="text-sm text-gray-500">Chọn nhóm báo cáo bạn muốn xem chi tiết.</p>
    </div>

    <!-- Mobile List Style (Also works for Desktop as a clean list) -->
    <div class="bg-surface rounded-2xl p-2 sm:p-4 shadow-sm border border-border">
      <div class="grid grid-cols-1 gap-2">
        <ReportListItem 
          v-for="report in reportGroups" 
          :key="report.title"
          :title="report.title"
          :icon="report.icon"
          :to="report.path"
        />
      </div>
    </div>
  </div>
</template>
