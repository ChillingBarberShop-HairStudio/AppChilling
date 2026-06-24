<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LayoutDashboard, Package, Users, UserCircle, Grid3x3 } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'Tổng quan', path: '/app/overview', icon: LayoutDashboard },
  { name: 'Kho hàng', path: '/app/inventory', icon: Package },
  { name: 'Nhân viên', path: '/app/staff', icon: Users },
  { name: 'Khách hàng', path: '/app/customers', icon: UserCircle },
  { name: 'Thêm', path: '/app/more', icon: Grid3x3 },
]

const isActive = (path: string) => {
  if (path === '/app/reports' && route.path.startsWith('/app/reports')) return true;
  return route.path === path;
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border pb-safe z-50 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
    <div class="flex justify-around items-center h-16">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative"
        :class="isActive(item.path) ? 'text-primary-blue' : 'text-gray-400 hover:text-gray-600'"
      >
        <div class="relative">
          <component :is="item.icon" class="w-6 h-6 transition-transform" :class="{ 'scale-110': isActive(item.path) }" />
          <div v-if="isActive(item.path)" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-blue rounded-full"></div>
        </div>
        <span class="text-[10px] font-medium tracking-wide">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>
