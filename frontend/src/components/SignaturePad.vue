<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  width: { type: Number, default: 320 },
  height: { type: Number, default: 160 },
})

const emit = defineEmits(['update:modelValue', 'clear'])

const canvasRef = ref(null)
const isDrawing = ref(false)
const hasSignature = ref(false)
const lastPoint = ref(null)

function setupCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, props.width, props.height)
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#0f172a'
}

function getPos(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const scaleX = props.width / rect.width
  const scaleY = props.height / rect.height
  const point = e.touches ? e.touches[0] : e
  return {
    x: (point.clientX - rect.left) * scaleX,
    y: (point.clientY - rect.top) * scaleY,
  }
}

function startDraw(e) {
  e.preventDefault()
  isDrawing.value = true
  lastPoint.value = getPos(e)
}

function draw(e) {
  if (!isDrawing.value) return
  e.preventDefault()
  const ctx = canvasRef.value.getContext('2d')
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(lastPoint.value.x, lastPoint.value.y)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  lastPoint.value = pos
  hasSignature.value = true
  emitSignature()
}

function endDraw() {
  if (!isDrawing.value) return
  isDrawing.value = false
  lastPoint.value = null
  emitSignature()
}

function emitSignature() {
  if (!hasSignature.value) return
  const dataUrl = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataUrl)
}

function clearSignature() {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, props.width, props.height)
  hasSignature.value = false
  emit('update:modelValue', '')
  emit('clear')
}

watch(
  () => props.width,
  () => {
    setupCanvas()
    hasSignature.value = false
  }
)

onMounted(setupCanvas)
</script>

<template>
  <div class="inline-block">
    <div class="overflow-hidden rounded-xl border border-slate-300 bg-white">
      <canvas
        ref="canvasRef"
        :width="width"
        :height="height"
        class="cursor-crosshair touch-none"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="endDraw"
        @mouseleave="endDraw"
        @touchstart="startDraw"
        @touchmove="draw"
        @touchend="endDraw"
      ></canvas>
    </div>
    <button
      type="button"
      class="mt-1 text-xs font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!hasSignature"
      @click="clearSignature"
    >
      <i class="pi pi-trash mr-1"></i>Hapus Tanda Tangan
    </button>
  </div>
</template>
