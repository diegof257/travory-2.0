<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/api'
import EmptyTrips from '@/components/EmptyTrips.vue'
import CreateTripModal from '@/components/CreateTripModal.vue'
import { session } from '@/services/session'
import { useRouter } from 'vue-router'

const router = useRouter()

function openTrip(tripId) {
  router.push(`/trips/${tripId}`)
}


const trips = ref([])

const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const ongoingTrips = computed(() =>
  trips.value.filter(t => {
    const start = new Date(t.start_date)
    const end = new Date(t.end_date)
    return start <= today() && end >= today()
  })
)

const upcomingTrips = computed(() =>
  trips.value.filter(t => {
    const start = new Date(t.start_date)
    return start > today()
  })
)

const pastTrips = computed(() =>
  trips.value.filter(t => {
    const end = new Date(t.end_date)
    return end < today()
  })
)

const openSection = ref('ongoing') // ongoing | upcoming | past

function toggleSection(section) {
  openSection.value = openSection.value === section ? null : section
}

function formatTripDates(start, end) {
  const options = { day: 'numeric', month: 'short' }

  const startDate = new Date(start).toLocaleDateString('es-ES', options)
  const endDate = new Date(end).toLocaleDateString('es-ES', options)

  return `${startDate} – ${endDate}`
}


const loading = ref(true)
const showModal = ref(false)
async function handleCreated() {
  showModal.value = false
  await loadTrips()

  const start = new Date(newTrip.start_date)
  const end = new Date(newTrip.end_date)
  const todayDate = today()

  if (start <= todayDate && end >= todayDate) {
    openSection.value = 'ongoing'
  } else if (start > todayDate) {
    openSection.value = 'upcoming'
  } else {
    openSection.value = 'past'
  }
}

async function loadTrips() {
  loading.value = true

  try {
    const user = session.get()
    if (!user || !user.id) {
      throw new Error('Usuario no autenticado')
    }
    const res = await api.getTrips(user.id)
    trips.value = res.data
    console.log('🔄 Cargando viajes para el usuario:', res.data);
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

   <div v-else class="list">

  <!-- VIAJES EN CURSO -->
  <section>
    <button class="section-header" @click="toggleSection('ongoing')">
      <span>En curso</span>
      <span class="count">{{ ongoingTrips.length }}</span>
    </button>

    <div v-if="openSection === 'ongoing'" class="section-content">
      <div v-if="ongoingTrips.length">
        <div
          v-for="trip in ongoingTrips"
          :key="trip.id"
          class="trip-card"
          @click="openTrip(trip.id)"
        >
          <h3>{{ trip.name }}</h3>
          <p>{{ trip.destination }}</p>
          <p class="trip-dates">
            {{ formatTripDates(trip.start_date, trip.end_date) }}
          </p>

        </div>
      </div>

      <p v-else class="empty-text">
        No tienes viajes en curso
      </p>
    </div>
  </section>

  <!-- PRÓXIMOS VIAJES -->
  <section>
    <button class="section-header" @click="toggleSection('upcoming')">
      <span>Próximos</span>
      <span class="count">{{ upcomingTrips.length }}</span>
    </button>

    <div v-if="openSection === 'upcoming'" class="section-content">
      <div v-if="upcomingTrips.length">
        <div
          v-for="trip in upcomingTrips"
          :key="trip.id"
          class="trip-card"
          @click="openTrip(trip.id)"
        >
          <h3>{{ trip.name }}</h3>
          <p>{{ trip.destination }}</p>
          <p class="trip-dates">
            {{ formatTripDates(trip.start_date, trip.end_date) }}
          </p>

        </div>
      </div>

      <p v-else class="empty-text">
        No hay viajes próximos
      </p>
    </div>
  </section>

  <!-- HISTORIAL -->
  <section>
    <button class="section-header" @click="toggleSection('past')">
      <span>Historial</span>
      <span class="count">{{ pastTrips.length }}</span>
    </button>

    <div v-if="openSection === 'past'" class="section-content">
      <div v-if="pastTrips.length">
        <div
          v-for="trip in pastTrips"
          :key="trip.id"
          class="trip-card past"
          @click="openTrip(trip.id)"
        >
          <h3>{{ trip.name }}</h3>
          <p>{{ trip.destination }}</p>
          <p class="trip-dates">
            {{ formatTripDates(trip.start_date, trip.end_date) }}
          </p>
        </div>
      </div>

      <p v-else class="empty-text">
        Aún no tienes viajes pasados
      </p>
    </div>
  </section>

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

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Secciones */
.section-header {
  width: 100%;
  background: white;
  border: none;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
}

.count {
  background: #111827;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
}

.section-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Cards */
.trip-card {
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

.trip-card.past {
  opacity: 0.6;
}

.trip-card h3 {
  font-size: 16px;
  font-weight: 600;
}

.trip-card p {
  font-size: 14px;
  color: #6b7280;
}

.empty-text {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 12px;
}

.trip-dates {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
}
.trip-card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.trip-card:active {
  transform: scale(0.98);
}

.trip-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

</style>