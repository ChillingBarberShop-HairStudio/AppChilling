<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  type?: 'invoice' | 'appointment'
}>()

const statusMap = computed(() => {
  if (props.type === 'invoice') {
    switch (props.status) {
      case 'paid': return { text: 'Đã thanh toán', classes: 'bg-success/10 text-success border-success/20' }
      case 'unpaid': return { text: 'Chưa thanh toán', classes: 'bg-danger/10 text-danger border-danger/20' }
      case 'partial': return { text: 'Thanh toán một phần', classes: 'bg-warning/10 text-warning border-warning/20' }
      case 'draft': return { text: 'Nháp', classes: 'bg-gray-100 text-gray-600 border-gray-200' }
      case 'cancelled': return { text: 'Đã hủy', classes: 'bg-gray-100 text-gray-500 border-gray-200' }
      default: return { text: props.status, classes: 'bg-gray-100 text-gray-600' }
    }
  } else {
    // appointment
    switch (props.status) {
      case 'scheduled': return { text: 'Đã đặt', classes: 'bg-blue-50 text-blue-600 border-blue-200' }
      case 'confirmed': return { text: 'Đã xác nhận', classes: 'bg-indigo-50 text-indigo-600 border-indigo-200' }
      case 'arrived': return { text: 'Khách đã đến', classes: 'bg-amber-50 text-amber-600 border-amber-200' }
      case 'in_service': return { text: 'Đang phục vụ', classes: 'bg-primary-blue/10 text-primary-blue border-primary-blue/20' }
      case 'completed': return { text: 'Hoàn thành', classes: 'bg-success/10 text-success border-success/20' }
      case 'cancelled': return { text: 'Đã hủy', classes: 'bg-danger/10 text-danger border-danger/20' }
      case 'no_show': return { text: 'Không đến', classes: 'bg-gray-100 text-gray-500 border-gray-200' }
      default: return { text: props.status, classes: 'bg-gray-100 text-gray-600' }
    }
  }
})
</script>

<template>
  <span class="px-2.5 py-1 text-xs font-medium rounded-full border" :class="statusMap.classes">
    {{ statusMap.text }}
  </span>
</template>
