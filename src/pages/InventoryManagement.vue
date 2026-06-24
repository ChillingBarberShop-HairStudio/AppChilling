<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon, PencilIcon, UserIcon } from '@heroicons/vue/24/outline'

interface Product {
  id: number
  name: string
  quantity: number
  price: number
  group_name: string
}

interface Log {
  id: number
  product_id: number
  product_name: string
  type: 'import' | 'export'
  quantity: number
  date: string
  note: string
}

// MOCK DATA
const products = ref<Product[]>([
  { id: 1, name: 'Sáp vuốt tóc Volcanic', quantity: 15, price: 250000, group_name: 'Sản phẩm tạo kiểu' },
  { id: 2, name: 'Gôm xịt tóc Butterfly', quantity: 3, price: 120000, group_name: 'Sản phẩm tạo kiểu' },
])
const logs = ref<Log[]>([
  { id: 1, product_id: 1, product_name: 'Sáp vuốt tóc Volcanic', type: 'import', quantity: 20, date: new Date().toISOString(), note: 'Nhập đầu tháng' }
])
const loading = ref(false)

// Tabs: 0: Sẵn có, 1: Nhập kho, 2: Xuất kho, 3: Lịch sử
const activeTab = ref(0)
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// Mức cảnh báo tồn kho
const getStockColor = (qty: number) => {
  if (qty < 5) return 'text-danger bg-red-50'
  if (qty < 20) return 'text-warning bg-orange-50'
  return 'text-success bg-green-50'
}

// Form Nhập kho
const importForm = ref({ name: '', quantity: 1, price: 0 })
const submitImport = async () => {
  if (!importForm.value.name) return alert('Vui lòng nhập tên sản phẩm')
  try {
    let existing = products.value.find(p => p.name === importForm.value.name)
    if (existing) {
      existing.quantity += importForm.value.quantity
    } else {
      products.value.push({ id: Date.now(), name: importForm.value.name, quantity: importForm.value.quantity, price: importForm.value.price, group_name: 'Mới' })
    }
    logs.value.unshift({ id: Date.now(), product_id: existing?.id || Date.now(), product_name: importForm.value.name, type: 'import', quantity: importForm.value.quantity, date: new Date().toISOString(), note: '' })
    alert('Đã nhập kho thành công!')
    importForm.value = { name: '', quantity: 1, price: 0 }
    activeTab.value = 0
  } catch (err) {
    alert('Lỗi nhập kho')
  }
}

// Form Xuất kho
const exportForm = ref({ product_id: '', quantity: 1 })
const submitExport = async () => {
  if (!exportForm.value.product_id) return alert('Vui lòng chọn sản phẩm')
  try {
    let p = products.value.find(p => p.id === parseInt(exportForm.value.product_id))
    if (!p) return alert('Không tìm thấy sản phẩm')
    if (p.quantity < exportForm.value.quantity) return alert('Số lượng tồn không đủ')
    
    p.quantity -= exportForm.value.quantity
    logs.value.unshift({ id: Date.now(), product_id: p.id, product_name: p.name, type: 'export', quantity: exportForm.value.quantity, date: new Date().toISOString(), note: '' })
    
    alert('Đã xuất kho thành công!')
    exportForm.value = { product_id: '', quantity: 1 }
    activeTab.value = 0
  } catch (err: any) {
    alert('Lỗi xuất kho')
  }
}

const formatDate = (isoString: string) => {
  const d = new Date(isoString)
  return d.toLocaleString('vi-VN')
}
</script>

<template>
  <div class="p-6 h-full overflow-y-auto w-full bg-background">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Kho hàng</h1>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-border mb-6">
      <button @click="activeTab = 0" :class="['px-6 py-3 font-medium text-sm transition', activeTab === 0 ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-gray-500 hover:text-gray-700']">
        Sẵn có
      </button>
      <button @click="activeTab = 1" :class="['px-6 py-3 font-medium text-sm transition', activeTab === 1 ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-gray-500 hover:text-gray-700']">
        Nhập kho
      </button>
      <button @click="activeTab = 2" :class="['px-6 py-3 font-medium text-sm transition', activeTab === 2 ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-gray-500 hover:text-gray-700']">
        Xuất kho
      </button>
      <button @click="activeTab = 3" :class="['px-6 py-3 font-medium text-sm transition', activeTab === 3 ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-gray-500 hover:text-gray-700']">
        Lịch sử
      </button>
    </div>

    <!-- Tab Sẵn có -->
    <div v-if="activeTab === 0" class="bg-surface rounded-xl shadow-sm border border-border p-4">
      <div class="flex gap-4 mb-4">
        <input v-model="searchQuery" type="text" placeholder="Tìm sản phẩm..." class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50">
        <select class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-600">
          <option>Nhóm sản phẩm</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 text-sm text-gray-500">
              <th class="py-3 px-4 font-medium">Tên sản phẩm</th>
              <th class="py-3 px-4 font-medium">Số lượng</th>
              <th class="py-3 px-4 font-medium text-right">Giá bán</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b border-gray-100">
              <td colspan="3" class="text-center py-8 text-gray-400">Đang tải dữ liệu...</td>
            </tr>
            <tr v-else-if="filteredProducts.length === 0" class="border-b border-gray-100">
              <td colspan="3" class="text-center py-8 text-gray-400">Không tìm thấy sản phẩm nào</td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
              <td class="py-3 px-4 text-primary-blue font-medium">{{ product.name }}</td>
              <td class="py-3 px-4">
                <span :class="['px-2 py-1 rounded-md font-semibold text-sm', getStockColor(product.quantity)]">
                  {{ product.quantity }}
                </span>
              </td>
              <td class="py-3 px-4 text-right text-gray-700">{{ product.price.toLocaleString('vi-VN') }}đ</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Cảnh báo màu -->
      <div class="flex gap-4 mt-6 pt-4 border-t border-gray-100 text-xs">
        <div class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-red-400"></div> Sắp hết (&lt;5)</div>
        <div class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-orange-400"></div> Chú ý (5-19)</div>
        <div class="flex items-center gap-1"><div class="w-3 h-3 rounded bg-green-400"></div> An toàn (&ge;20)</div>
      </div>
    </div>

    <!-- Tab Nhập kho -->
    <div v-if="activeTab === 1" class="bg-surface rounded-xl shadow-sm border border-border p-6 max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-6 text-gray-800">Tạo phiếu nhập kho</h2>
      <form @submit.prevent="submitImport" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm * (Nhập tên cũ để cộng dồn)</label>
          <input v-model="importForm.name" list="product-names" required type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue outline-none" placeholder="VD: Gôm xịt tóc nam">
          <datalist id="product-names">
            <option v-for="p in products" :key="p.id" :value="p.name"></option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập *</label>
            <input v-model.number="importForm.quantity" type="number" min="1" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Giá bán / SP *</label>
            <input v-model.number="importForm.price" type="number" min="0" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue outline-none">
          </div>
        </div>
        <div class="pt-4">
          <button type="submit" class="w-full py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-blue-600 transition">Nhập vào kho</button>
        </div>
      </form>
    </div>

    <!-- Tab Xuất kho -->
    <div v-if="activeTab === 2" class="bg-surface rounded-xl shadow-sm border border-border p-6 max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-6 text-gray-800">Tạo phiếu xuất kho</h2>
      <form @submit.prevent="submitExport" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Chọn sản phẩm cần xuất *</label>
          <select v-model="exportForm.product_id" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue outline-none bg-white">
            <option value="" disabled>-- Chọn sản phẩm --</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }} (Tồn: {{ p.quantity }})</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng xuất *</label>
          <input v-model.number="exportForm.quantity" type="number" min="1" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-blue outline-none">
        </div>
        <div class="pt-4">
          <button type="submit" class="w-full py-3 bg-danger text-white rounded-lg font-medium hover:bg-red-600 transition">Xuất khỏi kho</button>
        </div>
      </form>
    </div>

    <!-- Tab Lịch sử -->
    <div v-if="activeTab === 3" class="bg-surface rounded-xl shadow-sm border border-border p-4">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 text-sm text-gray-500">
              <th class="py-3 px-4 font-medium">Thời gian</th>
              <th class="py-3 px-4 font-medium">Sản phẩm</th>
              <th class="py-3 px-4 font-medium">Loại</th>
              <th class="py-3 px-4 font-medium text-right">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-500 text-sm">{{ formatDate(log.date) }}</td>
              <td class="py-3 px-4 text-gray-800 font-medium">{{ log.product_name || 'SP đã xoá' }}</td>
              <td class="py-3 px-4">
                <span :class="log.type === 'import' ? 'text-primary-blue bg-blue-50 px-2 py-1 rounded text-xs font-medium' : 'text-danger bg-red-50 px-2 py-1 rounded text-xs font-medium'">
                  {{ log.type === 'import' ? 'Nhập kho' : 'Xuất kho' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right font-medium" :class="log.type === 'import' ? 'text-primary-blue' : 'text-danger'">
                {{ log.type === 'import' ? '+' : '-' }}{{ log.quantity }}
              </td>
            </tr>
            <tr v-if="logs.length === 0">
              <td colspan="4" class="text-center py-8 text-gray-400">Chưa có lịch sử giao dịch nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
