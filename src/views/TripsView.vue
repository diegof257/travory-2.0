<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'
import EmptyTrips from '@/components/EmptyTrips.vue'
import CreateTripModal from '@/components/CreateTripModal.vue'
import { session } from '@/services/session'


const trips = ref([])
const loading = ref(true)
const showModal = ref(false)

async function loadTrips() {
  loading.value = true

  try {
    const user = session.get()
    if (!user || !user.id) {
      throw new Error('Usuario no autenticado')
    }
    console.log('🔄 Cargando viajes para el usuario:', user.id);
    const res = await api.get(`/trips/${user.id}`)
    trips.value = res.data
  } catch (e) {
    console.error('❌ Error cargando viajes:', e)
    trips.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadTrips)
</script>

<template>
  <div class="trips-view">

    <!-- HEADER -->
    <header class="header">
      <h1>Mis viajes</h1>
      <button class="add-btn" @click="showModal = true">＋</button>
    </header>

    <!-- LOADING -->
    <div v-if="loading" class="center">
      Cargando viajes…
    </div>

    <!-- EMPTY STATE -->
    <EmptyTrips
      v-else-if="trips.length === 0"
      @create="showModal = true"
    />

    <!-- LISTADO -->
    <div v-else class="list">
      <button class="create-btn" @click="showModal = true">
        + Crear viaje
      </button>

      <div
        v-for="trip in trips"
        :key="trip.id"
        class="trip-card"
      >
        <h3>{{ trip.name }}</h3>
        <p>{{ trip.destination }}</p>
      </div>
    </div>

    <!-- MODAL -->
    <CreateTripModal
      v-if="showModal"
      @close="showModal = false"
      @created="handleCreated"
    />

  </div>
</template>

<style scoped>
  .trips-view {
  min-height: 100vh;
  background: #fafafa;
  padding: 16px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h1 {
  font-size: 22px;
  font-weight: 600;
}

.add-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #111827;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

/* LIST */
.trip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* LOADING */
.center {
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6b7280;
}
</style>