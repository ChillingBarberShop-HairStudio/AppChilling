<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  CalendarIcon as CalendarClock, 
  UserIcon as User, 
  CubeIcon as Package, 
  TruckIcon as Truck, 
  BookOpenIcon as BookOpen, 
  UsersIcon as Users, 
  BanknotesIcon as Banknotes, 
  Cog6ToothIcon as Cog,
  ChevronRightIcon as ChevronRight,
  PencilSquareIcon as PencilSquare
} from '@heroicons/vue/24/outline'

const router = useRouter()

const menuItems = [
  { title: 'Quản lý thu chi', icon: CalendarClock, path: '/app/invoices' },
  { title: 'Khách hàng', icon: User, path: '/app/customers' },
  { title: 'Kho hàng', icon: Package, path: '/app/inventory' },
  { title: 'Nhà cung cấp', icon: Truck, path: '/app/more' },
  { title: 'Sản phẩm & dịch vụ', icon: BookOpen, path: '/app/more' },
  { title: 'Nhân viên', icon: Users, path: '/app/staff' },
  { title: 'Quản lý lương', icon: Banknotes, path: '/app/more' },
  { title: 'Cài đặt', icon: Cog, path: '/app/more' },
]
</script>

<template>
  <div class="max-w-md mx-auto min-h-screen bg-background -mx-4 lg:-mx-8">
    
    <!-- Header Section (Blue gradient) -->
    <div class="bg-primary-blue pt-8 pb-6 px-4 text-center text-white relative">
      <div class="absolute top-4 right-4">
        <button class="p-2 hover:bg-white/10 rounded-full transition">
          <PencilSquare class="w-6 h-6" />
        </button>
      </div>

      <div class="flex justify-center mb-4 mt-4">
        <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
          <img src="/Logo.PNG" alt="Chilling Barbershop" class="w-20 h-auto" />
        </div>
      </div>
      
      <h1 class="text-2xl font-bold mb-1 tracking-wide">Chilling Barbershop</h1>
      <p class="text-blue-100 text-sm font-medium">chillinghairstudio@gmail.com</p>
    </div>

    <!-- Menu List -->
    <div class="bg-white">
      <div v-for="(item, index) in menuItems" :key="index">
        <button 
          @click="router.push(item.path)"
          class="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition active:bg-gray-100"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <span class="text-base font-medium text-gray-800">{{ item.title }}</span>
          </div>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>
        <div class="w-full h-px bg-gray-100 ml-16" v-if="index !== menuItems.length - 1"></div>
      </div>
    </div>
    
  </div>
</template>
