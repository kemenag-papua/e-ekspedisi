<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()

const form = ref({
  nomor_surat: '',
  tanggal_surat: new Date().toISOString().split('T')[0],
  perihal: '',
  unit_id: '',
})

const units = ref([])
const submitting = ref(false)

onMounted(async () => {
  try {
    // TODO: Sprint 3 - fetch data master unit dari /master/unit
    units.value = []
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data unit', life: 5000 })
  }
})

async function handleSubmit() {
  submitting.value = true
  try {
    // TODO: Sprint 3 - POST /surat
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Surat keluar berhasil dibuat',
      life: 5000,
    })
    router.push('/surat')
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
      <h3 class="text-xl font-semibold text-slate-900">Tambah Surat Keluar</h3>
    </div>

    <form
      class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      @submit.prevent="handleSubmit"
    >
      <div class="space-y-4">
        <div>
          <label for="nomor_surat" class="mb-1 block text-sm font-medium text-slate-700">
            Nomor Surat
          </label>
          <InputText
            id="nomor_surat"
            v-model="form.nomor_surat"
            class="w-full"
            placeholder="Contoh: B-001"
            required
          />
        </div>

        <div>
          <label for="tanggal_surat" class="mb-1 block text-sm font-medium text-slate-700">
            Tanggal Surat
          </label>
          <InputText
            id="tanggal_surat"
            v-model="form.tanggal_surat"
            type="date"
            class="w-full"
            required
          />
        </div>

        <div>
          <label for="perihal" class="mb-1 block text-sm font-medium text-slate-700">
            Perihal
          </label>
          <InputText
            id="perihal"
            v-model="form.perihal"
            class="w-full"
            placeholder="Perihal surat"
            required
          />
        </div>

        <div>
          <label for="unit_id" class="mb-1 block text-sm font-medium text-slate-700">
            Unit
          </label>
          <select
            id="unit_id"
            v-model="form.unit_id"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-500 focus:outline-none"
            required
          >
            <option value="" disabled>Pilih unit</option>
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.nama }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button
            label="Batal"
            severity="secondary"
            @click="router.push('/surat')"
          />
          <Button
            label="Simpan"
            icon="pi pi-check"
            type="submit"
            :loading="submitting"
          />
        </div>
      </div>
    </form>

    <p class="text-xs text-slate-400">
      TODO: Sprint 3 - Implementasi upload PDF surat dan generate nomor ekspedisi otomatis
    </p>
  </div>
</template>
