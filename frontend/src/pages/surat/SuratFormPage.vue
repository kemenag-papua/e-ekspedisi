<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { suratApi } from '@/api/surat'
import { unitApi } from '@/api/unit'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const isEdit = route.params.id !== undefined
const loading = ref(false)
const submitting = ref(false)
const units = ref([])
const fileInput = ref(null)
const fileName = ref('')
const fileError = ref('')

const MAX_FILE_SIZE = 5 * 1024 * 1024

const form = ref({
  nomor_surat: '',
  tanggal_surat: new Date().toISOString().split('T')[0],
  perihal: '',
  unit_id: '',
})

onMounted(async () => {
  try {
    const unitRes = await unitApi.getUnitList()
    units.value = unitRes.data?.items || []
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data unit', life: 5000 })
  }

  if (isEdit) {
    loading.value = true
    try {
      const response = await suratApi.getSurat(route.params.id)
      const s = response.data
      form.value = {
        nomor_surat: s.nomor_surat || '',
        tanggal_surat: s.tanggal_surat ? String(s.tanggal_surat).slice(0, 10) : '',
        perihal: s.perihal || '',
        unit_id: s.unit_id || '',
      }
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
  }
})

function onFileChange(event) {
  const file = event.target.files[0]
  fileError.value = ''
  fileName.value = ''
  if (!file) return

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    fileError.value = 'File harus berformat PDF'
    fileInput.value.value = ''
    return
  }
  if (file.size > MAX_FILE_SIZE) {
    fileError.value = 'Ukuran file maksimal 5 MB'
    fileInput.value.value = ''
    return
  }
  fileName.value = file.name
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleSubmit() {
  submitting.value = true
  try {
    const payload = { ...form.value }
    if (!isEdit) {
      const file = fileInput.value?.files?.[0]
      if (!file) {
        toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'File PDF wajib diunggah', life: 3000 })
        submitting.value = false
        return
      }
      payload.file_pdf = await fileToBase64(file)
    }

    if (isEdit) {
      await suratApi.updateSurat(route.params.id, payload)
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Surat diperbarui', life: 3000 })
    } else {
      const response = await suratApi.createSurat(payload)
      const nomorEkspedisi = response.data?.ekspedisi?.nomor_ekspedisi
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: nomorEkspedisi ? `Nomor Ekspedisi: ${nomorEkspedisi}` : 'Surat berhasil dibuat',
        life: 5000,
      })
    }
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
      <h3 class="text-xl font-semibold text-slate-900">
        {{ isEdit ? 'Edit Surat Keluar' : 'Tambah Surat Keluar' }}
      </h3>
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
      Memuat data...
    </div>

    <form
      v-else
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
            :disabled="isEdit"
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
            :disabled="isEdit"
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
          <label for="unit_id" class="mb-1 block text-sm font-medium text-slate-700">Unit</label>
          <Select
            v-model="form.unit_id"
            :options="units"
            option-label="nama"
            option-value="id"
            placeholder="Pilih unit"
            class="w-full"
            :disabled="isEdit"
          />
        </div>

        <div v-if="!isEdit">
          <label for="file_pdf" class="mb-1 block text-sm font-medium text-slate-700">
            File PDF Surat
          </label>
          <input
            id="file_pdf"
            ref="fileInput"
            type="file"
            accept="application/pdf,.pdf"
            class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
            @change="onFileChange"
          />
          <p v-if="fileName" class="mt-1 text-xs text-green-600">
            <i class="pi pi-file-pdf mr-1"></i>{{ fileName }}
          </p>
          <p v-if="fileError" class="mt-1 text-xs text-red-600">{{ fileError }}</p>
          <p class="mt-1 text-xs text-slate-400">Maksimal 5 MB, format PDF.</p>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button label="Batal" severity="secondary" @click="router.push('/surat')" />
          <Button label="Simpan" icon="pi pi-check" type="submit" :loading="submitting" />
        </div>
      </div>
    </form>
  </div>
</template>
