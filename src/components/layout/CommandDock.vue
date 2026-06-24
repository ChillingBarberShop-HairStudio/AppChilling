<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LayoutDashboard, Package, Users, UserCircle, Grid3x3 } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'Tổng quan', path: '/app/overview', icon: LayoutDashboard },
  { name: 'Kho hàng', path: '/app/inventory', icon: Package },
  { name: 'Nhân viên', path: '/app/staff', icon: Users },
  { name: 'Khách hàng', path: '/app/customers', icon: UserCircle },
  { name: 'Cài đặt', path: '/app/more', icon: Grid3x3 },
]

const isActive = (path: string) => {
  if (path === '/app/reports' && route.path.startsWith('/app/reports')) return true;
  return route.path === path;
}
</script>

<template>
  <div class="hidden md:flex flex-col w-20 lg:w-64 bg-surface border-r border-border h-full overflow-y-auto">
    <div class="p-4 py-8 flex flex-col gap-2">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="flex items-center gap-3 px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl transition-all duration-200 group"
        :class="isActive(item.path) ? 'bg-primary-blue/10 text-primary-blue font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-barber-navy'"
      >
        <component :is="item.icon" class="w-6 h-6 flex-shrink-0" :class="{ 'text-primary-blue': isActive(item.path) }" />
        <span class="hidden lg:block">{{ item.name }}</span>
        
        <!-- Active Indicator for compact mode -->
        <div v-if="isActive(item.path)" class="lg:hidden absolute left-0 w-1 h-8 bg-primary-blue rounded-r-full"></div>
      </router-link>
    </div>
  </div>
</template>
