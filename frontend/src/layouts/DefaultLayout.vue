<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const sidebarOpen = ref(false)

const menuItems = computed(() => {
  const items = []
  if (auth.isAuthenticated) {
    items.push({ name: 'Dashboard', to: '/dashboard', icon: 'pi pi-home' })
  }
  if (auth.isAdmin || auth.isSuperAdmin) {
    items.push({ name: 'Surat Keluar', to: '/surat', icon: 'pi pi-file' })
    items.push({
      name: 'Master Data',
      to: '/master/unit',
      icon: 'pi pi-database',
      children: [
        { name: 'Unit', to: '/master/unit', icon: 'pi pi-building' },
        { name: 'Pegawai', to: '/master/pegawai', icon: 'pi pi-users' },
      ],
    })
    items.push({ name: 'Audit Trail', to: '/audit', icon: 'pi pi-history' })
  }
  if (auth.isSuperAdmin) {
    items.push({ name: 'Pengaturan', to: '/pengaturan', icon: 'pi pi-cog' })
  }
  return items
})

const isActive = (to) => route.path.startsWith(to)

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-200 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center justify-between border-b border-slate-800 px-6">
        <h1 class="text-lg font-semibold">e-Ekspedisi</h1>
        <button
          class="text-slate-400 hover:text-white lg:hidden"
          aria-label="Tutup menu"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <nav class="mt-4 space-y-1 px-3">
        <template v-for="item in menuItems" :key="item.name">
          <div v-if="item.children">
            <p class="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {{ item.name }}
            </p>
            <RouterLink
              v-for="child in item.children"
              :key="child.name"
              :to="child.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
              :class="
                isActive(child.to)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              "
              @click="sidebarOpen = false"
            >
              <i :class="child.icon"></i>
              <span>{{ child.name }}</span>
            </RouterLink>
          </div>
          <RouterLink
            v-else
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            :class="
              isActive(item.to)
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            "
            @click="sidebarOpen = false"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </RouterLink>
        </template>
      </nav>

      <div class="absolute inset-x-0 bottom-0 border-t border-slate-800 p-4">
        <div class="mb-3">
          <p class="truncate text-sm font-medium">{{ auth.user?.nama || 'Pengguna' }}</p>
          <p class="text-xs text-slate-400">{{ auth.user?.jabatan || auth.user?.role }}</p>
        </div>
        <button
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          @click="handleLogout"
        >
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-8">
        <button
          class="text-slate-600 lg:hidden"
          aria-label="Buka menu"
          @click="sidebarOpen = true"
        >
          <i class="pi pi-bars"></i>
        </button>
        <h2 class="text-lg font-semibold text-slate-800">{{ route.meta.title }}</h2>
      </header>

      <main class="p-4 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
