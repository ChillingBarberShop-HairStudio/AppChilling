<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  title: string
  icon: any
  to?: string
}>()
</script>

<template>
  <component :is="to ? 'router-link' : 'button'" :to="to" class="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:shadow-md hover:border-primary-blue/30 transition-all duration-200 group active:scale-[0.98]">
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-barber-navy group-hover:bg-primary-blue/10 group-hover:text-primary-blue transition-colors">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <span class="font-medium text-gray-800 group-hover:text-barber-navy">{{ title }}</span>
    </div>
    <ChevronRight class="w-5 h-5 text-gray-400 group-hover:text-primary-blue transition-colors" />
  </component>
</template>
