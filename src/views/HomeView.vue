<template>
  <div class="home" v-if="!loading">
    <!-- Header -->
    <DashboardHeader />

    <!-- Próximo viaje -->
    <NextTripCard
      :trip="nextTrip"
      @open="goToTrip"
      @create="showCreateTripModal = true"
    />

    <!-- Stats -->
    <StatsMiniCards :stats="stats" />

    <!-- Modal crear viaje -->
    <CreateTripModal
      v-if="showCreateTripModal"
      @close="showCreateTripModal = false"
      @created="onTripCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'
import { session } from '@/services/session'

// Components
import DashboardHeader from '@/components/DashboardHeader.vue'
import NextTripCard from '@/components/NextTripCard.vue'
import StatsMiniCards from '@/components/StatsMiniCards.vue'
import ActionsList from '@/components/ActionsList.vue'
import CreateTripModal from '@/components/CreateTripModal.vue'

const router = useRouter()
const user = session.get()

// State
const loading = ref(true)
const nextTrip = ref(null)
const stats = ref({ total: 0, upcoming: 0 })
const showCreateTripModal = ref(false)

// Load Home data
onMounted(async () => {
  try {
    const { data } = await api.getHome(user.id)
    nextTrip.value = data.nextTrip
    stats.value = data.stats
  } catch (err) {
    console.error('Error cargando Home', err)
  } finally {
    loading.value = false
  }
})

// Navigation
function goToTrip(tripId) {
  router.push(`/trips/${tripId}`)
}

function goToTrips() {
  router.push('/trips')
}

function goToPreferences() {
  router.push('/preferences')
}

// After creating a trip
async function onTripCreated() {
  showCreateTripModal.value = false
  loading.value = true

  try {
    const { data } = await api.getHome(user.id)
    nextTrip.value = data.nextTrip
    stats.value = data.stats
  } catch (err) {
    console.error('Error recargando Home', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  padding: 16px;
}
</style>
