<template>
  <div class="overlay">
    <div class="modal">
      <header>
        <h2>Crear viaje</h2>
        <button @click="$emit('close')">✕</button>
      </header>

      <form @submit.prevent="submit">
        <input v-model="name" placeholder="Nombre del viaje" required />
        <input v-model="destination" placeholder="Destino" required />

        <label>Fecha inicio</label>
        <input type="date" v-model="startDate" required />

        <label>Fecha fin</label>
        <input type="date" v-model="endDate" required />

        <button type="submit" :disabled="loading">
          {{ loading ? 'Guardando…' : 'Crear viaje' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/api'

const emit = defineEmits(['close', 'created'])

const name = ref('')
const destination = ref('')
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    await api.post('/trips', {
      name: name.value,
      destination: destination.value,
      start_date: startDate.value,
      end_date: endDate.value,
      status: 'UPCOMING'
    })

    emit('created')
    emit('close')
  } catch (e) {
    alert('Error creando viaje')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal {
  background: white;
  width: 100%;
  border-radius: 16px 16px 0 0;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

button[type="submit"] {
  margin-top: 8px;
  background: #111827;
  color: white;
  padding: 14px;
  border-radius: 999px;
  border: none;
}
</style>
