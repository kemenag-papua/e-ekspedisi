import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true, title: 'Login' },
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { title: 'Dashboard', roles: ['super_admin', 'admin', 'pimpinan'] },
      },
      {
        path: 'surat',
        name: 'surat',
        component: () => import('@/pages/surat/SuratListPage.vue'),
        meta: { title: 'Surat Keluar', roles: ['super_admin', 'admin'] },
      },
      {
        path: 'surat/tambah',
        name: 'surat-tambah',
        component: () => import('@/pages/surat/SuratFormPage.vue'),
        meta: { title: 'Tambah Surat', roles: ['super_admin', 'admin'] },
      },
      {
        path: 'pengaturan',
        name: 'pengaturan',
        component: () => import('@/pages/PengaturanPage.vue'),
        meta: { title: 'Pengaturan', roles: ['super_admin'] },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/pages/NotFoundPage.vue'),
        meta: { title: 'Halaman Tidak Ditemukan' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  document.title = to.meta.title ? `${to.meta.title} | e-Ekspedisi` : 'e-Ekspedisi'

  if (to.meta.public) {
    if (auth.isAuthenticated && to.name === 'login') {
      return { name: 'dashboard' }
    }
    return true
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && to.meta.roles.length > 0) {
    if (!auth.user || !to.meta.roles.includes(auth.user.role)) {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
