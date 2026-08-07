<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import { suratApi } from '@/api/surat'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const loading = ref(false)
const surat = ref(null)

const formatStatus = (status) => {
  const map = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-600' },
    menunggu_pengambilan: { label: 'Menunggu Pengambilan', class: 'bg-amber-100 text-amber-700' },
    diterima: { label: 'Diterima', class: 'bg-green-100 text-green-700' },
  }
  return map[status] || { label: status, class: 'bg-slate-100 text-slate-600' }
}

const formatTanggal = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const pdfPreviewUrl = () => {
  if (!surat.value?.file_pdf) return ''
  return `https://drive.google.com/file/d/${surat.value.file_pdf}/preview`
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await suratApi.getSurat(route.params.id)
    surat.value = response.data
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Memuat Data',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
    router.push('/surat')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-4">
    <div class="flex items-center gap-3">
      <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.push('/surat')" />
      <h3 class="text-xl font-semibold text-slate-900">Detail Surat</h3>
      <div class="ml-auto flex gap-2">
        <Button
          v-if="surat && surat.status !== 'diterima' && (auth.isAdmin || auth.isSuperAdmin)"
          label="Edit"
          icon="pi pi-pencil"
          severity="secondary"
          @click="router.push(`/surat/${surat.id}/edit`)"
        />
      </div>
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
      Memuat data...
    </div>

    <template v-else-if="surat">
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-slate-900">{{ surat.perihal }}</h4>
            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="formatStatus(surat.status).class"
            >
              {{ formatStatus(surat.status).label }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Nomor Surat</p>
            <p class="mt-1 text-sm font-medium text-slate-900">{{ surat.nomor_surat }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Tanggal Surat</p>
            <p class="mt-1 text-sm text-slate-700">{{ formatTanggal(surat.tanggal_surat) }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Unit</p>
            <p class="mt-1 text-sm text-slate-700">{{ surat.unit_name || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">No. Ekspedisi</p>
            <p class="mt-1 text-sm font-mono font-medium text-slate-900">
              {{ surat.nomor_ekspedisi || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Dibuat Oleh</p>
            <p class="mt-1 text-sm text-slate-700">{{ surat.created_by || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Terakhir Diubah</p>
            <p class="mt-1 text-sm text-slate-700">{{ formatTanggal(surat.updated_at) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">Dokumen Surat</h4>
        </div>
        <div class="p-6">
          <iframe
            v-if="pdfPreviewUrl()"
            :src="pdfPreviewUrl()"
            class="h-[480px] w-full rounded-lg border border-slate-200"
            title="Preview PDF Surat"
          ></iframe>
          <p v-else class="text-sm text-slate-400">Dokumen tidak tersedia.</p>
        </div>
      </div>
    </template>
  </div>
</template>
