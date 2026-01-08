<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <header>
        <div>
          <h2>Crear nuevo viaje</h2>
          <p>Agrega los detalles de tu próximo viaje</p>
        </div>
        <button class="close" @click="emit('close')">×</button>
      </header>

      <form @submit.prevent="create">
        <div class="field">
          <label>Nombre del viaje</label>
          <input v-model="form.name" placeholder="Ej: Vacaciones de verano" />
        </div>

        <div class="field">
          <label>Destino</label>
          <input v-model="form.destination" placeholder="Ej: París, Francia" />
        </div>

        <div class="dates">
          <div class="field">
            <label>Inicio</label>
            <input type="date" v-model="form.start_date" />
          </div>
          <div class="field">
            <label>Fin</label>
            <input type="date" v-model="form.end_date" />
          </div>
        </div>

        <button class="primary" :disabled="loading">
          {{ loading ? 'Creando…' : 'Crear viaje' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/api'
import { session } from '@/services/session'

const emit = defineEmits(['close', 'created'])

const loading = ref(false)

const form = ref({
  name: '',
  destination: '',
  start_date: '',
  end_date: ''
})

async function create() {
  loading.value = true

  try {
    await api.createTrip({
      user_id: session.get().id,
      name: form.value.name,
      destination: form.value.destination,
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      status: 'UPCOMING'
    })

    emit('created')
  } catch (err) {
    console.error('Error creando viaje', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

header h2 {
  font-size: 20px;
  font-weight: 600;
}

header p {
  font-size: 14px;
  color: #6b7280;
}

.close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  font-weight: 500;
}

input {
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
}

.dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.primary {
  margin-top: 24px;
  height: 48px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
}

</style>
