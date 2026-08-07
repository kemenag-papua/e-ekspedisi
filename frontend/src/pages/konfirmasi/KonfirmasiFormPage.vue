<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import SignaturePad from '@/components/SignaturePad.vue'
import { ekspedisiApi } from '@/api/ekspedisi'
import { suratApi } from '@/api/surat'
import { penerimaanApi } from '@/api/penerimaan'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const ekspedisiId = route.params.ekspedisiId
const loading = ref(false)
const submitting = ref(false)

const ekspedisi = ref(null)
const surat = ref(null)

const form = ref({
  nama_penerima: '',
  jabatan: '',
  instansi: '',
  signature: '',
  foto: '',
  gps_lat: '',
  gps_lng: '',
  gps_skipped: false,
})

// Camera
const videoRef = ref(null)
const cameraCanvasRef = ref(null)
const cameraActive = ref(false)
const stream = ref(null)
const cameraError = ref('')
const photoTaken = ref(false)

// GPS
const gpsLoading = ref(false)

const formatTanggal = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function startCamera() {
  cameraError.value = ''
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraError.value = 'Browser tidak mendukung kamera. Gunakan fitur upload foto.'
    return
  }
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 } },
      audio: false,
    })
    cameraActive.value = true
    await nextTickVideo()
  } catch {
    cameraError.value = 'Tidak dapat mengakses kamera. Gunakan fitur upload foto.'
  }
}

async function nextTickVideo() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  if (videoRef.value) {
    videoRef.value.srcObject = stream.value
    await videoRef.value.play().catch(() => {})
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop())
    stream.value = null
  }
  cameraActive.value = false
}

function capturePhoto() {
  const video = videoRef.value
  const canvas = cameraCanvasRef.value
  if (!video || !canvas) return
  canvas.width = video.videoWidth || 640
  canvas.height = video.videoHeight || 480
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  form.value.foto = canvas.toDataURL('image/png')
  photoTaken.value = true
  stopCamera()
}

function resetPhoto() {
  form.value.foto = ''
  photoTaken.value = false
}

function onPhotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'File harus berupa gambar', life: 3000 })
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.value.foto = reader.result
    photoTaken.value = true
  }
  reader.readAsDataURL(file)
}

function getGps() {
  if (!navigator.geolocation) {
    toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Browser tidak mendukung GPS', life: 3000 })
    return
  }
  gpsLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.value.gps_lat = pos.coords.latitude.toFixed(6)
      form.value.gps_lng = pos.coords.longitude.toFixed(6)
      form.value.gps_skipped = false
      gpsLoading.value = false
    },
    () => {
      toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Tidak dapat mengambil lokasi GPS', life: 3000 })
      gpsLoading.value = false
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

function skipGps() {
  form.value.gps_lat = ''
  form.value.gps_lng = ''
  form.value.gps_skipped = true
}

async function handleSubmit() {
  submitting.value = true
  try {
    const payload = {
      ekspedisiId,
      namaPenerima: form.value.nama_penerima,
      jabatan: form.value.jabatan,
      instansi: form.value.instansi,
      foto: form.value.foto,
      signature: form.value.signature,
    }
    if (!form.value.gps_skipped && form.value.gps_lat && form.value.gps_lng) {
      payload.gpsLat = Number(form.value.gps_lat)
      payload.gpsLng = Number(form.value.gps_lng)
    }
    await penerimaanApi.createPenerimaan(payload)
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Penerimaan dikonfirmasi. Surat ditandai Diterima.',
      life: 5000,
    })
    router.push(`/surat/${surat.value.id}`)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const eksResponse = await ekspedisiApi.getEkspedisi(ekspedisiId)
    ekspedisi.value = eksResponse.data
    const suratResponse = await suratApi.getSurat(ekspedisi.value.surat_id)
    surat.value = suratResponse.data
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

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-4">
    <div class="flex items-center gap-3">
      <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.back()" />
      <h3 class="text-xl font-semibold text-slate-900">Konfirmasi Penerimaan</h3>
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
      Memuat data...
    </div>

    <form v-else-if="surat && ekspedisi" class="space-y-4" @submit.prevent="handleSubmit">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Data Surat</h4>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p class="text-xs text-slate-400">Nomor Surat</p>
            <p class="text-sm font-medium text-slate-900">{{ surat.nomor_surat }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">No. Ekspedisi</p>
            <p class="text-sm font-mono font-medium text-slate-900">{{ ekspedisi.nomor_ekspedisi }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Tanggal Surat</p>
            <p class="text-sm text-slate-700">{{ formatTanggal(surat.tanggal_surat) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Unit</p>
            <p class="text-sm text-slate-700">{{ surat.unit_name || '-' }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-xs text-slate-400">Perihal</p>
            <p class="text-sm font-medium text-slate-900">{{ surat.perihal }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Identitas Penerima</h4>
        <div class="space-y-4">
          <div>
            <label for="nama_penerima" class="mb-1 block text-sm font-medium text-slate-700">Nama Penerima</label>
            <InputText id="nama_penerima" v-model="form.nama_penerima" class="w-full" placeholder="Nama lengkap penerima" required />
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="jabatan" class="mb-1 block text-sm font-medium text-slate-700">Jabatan</label>
              <InputText id="jabatan" v-model="form.jabatan" class="w-full" placeholder="Contoh: Analis" required />
            </div>
            <div>
              <label for="instansi" class="mb-1 block text-sm font-medium text-slate-700">Instansi</label>
              <InputText id="instansi" v-model="form.instansi" class="w-full" placeholder="Instansi penerima" required />
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Foto Penerima</h4>
        <div class="flex flex-col items-center gap-3">
          <img
            v-if="photoTaken && form.foto"
            :src="form.foto"
            class="h-48 w-auto rounded-lg border border-slate-200 object-cover"
            alt="Foto penerima"
          />
          <div v-if="!photoTaken" class="w-full space-y-3">
            <div v-if="cameraActive">
              <video ref="videoRef" class="w-full rounded-lg border border-slate-200 bg-black" playsinline muted></video>
              <div class="mt-3 flex gap-2">
                <Button label="Ambil Foto" icon="pi pi-camera" size="small" @click="capturePhoto" />
                <Button label="Batal" severity="secondary" size="small" @click="stopCamera" />
              </div>
            </div>
            <div v-else class="space-y-3">
              <Button label="Buka Kamera" icon="pi pi-camera" @click="startCamera" />
              <div class="flex items-center gap-3">
                <span class="text-sm text-slate-400">atau</span>
                <label class="cursor-pointer text-sm font-medium text-blue-600 hover:underline">
                  Upload foto dari perangkat
                  <input type="file" accept="image/*" class="hidden" @change="onPhotoUpload" />
                </label>
              </div>
              <p v-if="cameraError" class="text-xs text-amber-600">{{ cameraError }}</p>
            </div>
          </div>
          <Button v-else label="Ambil Ulang" icon="pi pi-refresh" severity="secondary" size="small" @click="resetPhoto" />
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-400">Tanda Tangan Digital</h4>
          <Button label="Hapus" icon="pi pi-times" severity="secondary" text size="small" @click="form.signature = ''" />
        </div>
        <SignaturePad v-model="form.signature" />
        <p v-if="!form.signature" class="mt-2 text-xs text-amber-600">Tanda tangan wajib diisi.</p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Lokasi GPS</h4>
        <div v-if="form.gps_lat && form.gps_lng">
          <p class="text-sm text-slate-700">
            📍 Lat: {{ form.gps_lat }} | Lng: {{ form.gps_lng }}
          </p>
          <div class="mt-2 flex gap-2">
            <Button label="Refresh GPS" icon="pi pi-refresh" severity="secondary" size="small" :loading="gpsLoading" @click="getGps" />
            <Button label="Hapus Lokasi" severity="secondary" text size="small" @click="skipGps" />
          </div>
        </div>
        <div v-else-if="form.gps_skipped" class="flex items-center justify-between">
          <p class="text-sm text-slate-400">Lokasi GPS dilewati.</p>
          <Button label="Ambil GPS" icon="pi pi-map-marker" severity="secondary" size="small" @click="getGps" />
        </div>
        <div v-else class="space-y-2">
          <p class="text-sm text-slate-500">Ambil lokasi GPS untuk pencatatan tempat penerimaan (opsional).</p>
          <div class="flex gap-2">
            <Button label="Ambil Lokasi" icon="pi pi-map-marker" size="small" :loading="gpsLoading" @click="getGps" />
            <Button label="Lewati" severity="secondary" text size="small" @click="skipGps" />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <Button label="Batal" severity="secondary" @click="router.back()" />
        <Button label="Simpan Konfirmasi" icon="pi pi-check" type="submit" :loading="submitting" />
      </div>
    </form>
  </div>
</template>
