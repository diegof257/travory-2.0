<template>
  <section class="next-trip">
    <span class="label">Próximo viaje</span>

    <!-- CON VIAJE -->
    <div v-if="trip" class="content" @click="emit('open', trip.id)">
      <h2>{{ trip.destination }}</h2>

      <p class="meta">
        {{ formatDate(trip.start_date) }} – {{ formatDate(trip.end_date) }}
        · Faltan {{ daysLeft }} días
      </p>

      <button class="link">Ver detalles</button>
    </div>

    <!-- SIN VIAJE -->
    <div v-else class="content empty">
      <p class="empty-text">Aún no tienes viajes planeados</p>

      <button class="primary" @click="emit('create')">
        + Crear viaje
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  trip: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['open', 'create'])

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const daysLeft = computed(() => {
  if (!props.trip) return 0
  const start = new Date(props.trip.start_date)
  const now = new Date()
  const diff = start - now
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
})
</script>

<style scoped>
.next-trip {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
}

.content {
  margin-top: 8px;
}

h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.meta {
  font-size: 14px;
  color: #4b5563;
}

.link {
  margin-top: 10px;
  background: none;
  border: none;
  padding: 0;
  color: #111827;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.empty {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-text {
  font-size: 14px;
  color: #6b7280;
}

.primary {
  align-self: flex-start;
  background: #111827;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>
