<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  try {
    await auth.login(username.value, password.value)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Login gagal. Periksa kembali username dan password.'
    toast.add({
      severity: 'error',
      summary: 'Login Gagal',
      detail: errorMessage.value,
      life: 5000,
    })
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <Toast />
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
          <i class="pi pi-book text-2xl text-white"></i>
        </div>
        <h1 class="text-2xl font-bold text-slate-900">e-Ekspedisi</h1>
        <p class="mt-1 text-sm text-slate-500">Sistem bukti penerimaan dokumen elektronik</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="username" class="mb-1 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none"
            placeholder="Masukkan password"
          />
        </div>

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ auth.loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
