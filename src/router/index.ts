import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { 
      path: "/login", 
      component: () => import('@/pages/LoginPage.vue') 
    },
    {
      path: "/app",
      component: () => import('@/components/layout/AppShell.vue'),
      children: [
        { path: "", redirect: "/app/overview" },
        { path: "overview", component: () => import('@/pages/OverviewPage.vue') },
        { path: "invoices", component: () => import('@/pages/InvoicesPage.vue') },
        { path: "appointments", component: () => import('@/pages/AppointmentsPage.vue') },
        { path: "reports", component: () => import('@/pages/ReportsPage.vue') },
        { path: "reports/revenue", component: () => import('@/pages/RevenueReportMenuPage.vue') },
        { path: "reports/revenue/invoices", component: () => import('@/pages/RevenueInvoiceReportPage.vue') },
        { path: "more", component: () => import('@/pages/MorePage.vue') },
        { path: "staff", component: () => import('@/pages/StaffManagement.vue') },
        { path: "inventory", component: () => import('@/pages/InventoryManagement.vue') },
        { path: "customers", component: () => import('@/pages/CustomerManagement.vue') }
      ]
    }
  ]
});

export default router;
