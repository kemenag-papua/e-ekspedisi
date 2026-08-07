<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
      <i class="pi pi-exclamation-triangle text-4xl text-slate-400"></i>
    </div>
    <h3 class="text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan</h3>
    <p class="mt-2 text-sm text-slate-500">Halaman yang Anda cari tidak tersedia.</p>
    <button
      class="mt-6 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      @click="router.push('/dashboard')"
    >
      Kembali ke Dashboard
    </button>
  </div>
</template>
