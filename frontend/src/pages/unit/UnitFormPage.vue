<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { unitApi } from '@/api/unit'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const isEdit = route.params.id !== undefined
const loading = ref(false)
const submitting = ref(false)
const form = ref({
  nama: '',
  keterangan: '',
})

onMounted(async () => {
  if (isEdit) {
    loading.value = true
    try {
      const response = await unitApi.getUnit(route.params.id)
      const unit = response.data
      form.value = {
        nama: unit.nama || '',
        keterangan: unit.keterangan || '',
      }
    } catch (e) {
      toast.add({
        severity: 'error',
        summary: 'Gagal Memuat Data',
        detail: e.response?.data?.message || 'Terjadi kesalahan',
        life: 5000,
      })
      router.push('/master/unit')
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    if (isEdit) {
      await unitApi.updateUnit(route.params.id, form.value)
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit diperbarui', life: 3000 })
    } else {
      await unitApi.createUnit(form.value)
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit dibuat', life: 3000 })
    }
    router.push('/master/unit')
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Menyimpan',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-4">
    <div class="flex items-center gap-3">
      <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.back()" />
      <h3 class="text-xl font-semibold text-slate-900">{{ isEdit ? 'Edit Unit' : 'Tambah Unit' }}</h3>
    </div>

    <form class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="nama" class="mb-1 block text-sm font-medium text-slate-700">Nama Unit</label>
          <InputText id="nama" v-model="form.nama" class="w-full" placeholder="Contoh: Sekretariat" required />
        </div>

        <div>
          <label for="keterangan" class="mb-1 block text-sm font-medium text-slate-700">Keterangan</label>
          <InputText id="keterangan" v-model="form.keterangan" class="w-full" placeholder="Deskripsi unit (opsional)" />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button label="Batal" severity="secondary" @click="router.push('/master/unit')" />
          <Button label="Simpan" icon="pi pi-check" type="submit" :loading="submitting" />
        </div>
      </div>
    </form>
  </div>
</template>
