<template>
  <section class="actions">
    <h2>Acciones rápidas</h2>

    <div class="grid">
      <ActionCard
  primary
  icon="+"
  title="Nuevo viaje"
  subtitle="Planifica tu próxima aventura"
/>

<ActionCard
  icon="✈️"
  title="Mis viajes"
  subtitle="Ver todos"
/>

<ActionCard
  icon="⚙️"
  title="Preferencias"
  subtitle="Personaliza la app"
/>
    </div>
  </section>
</template>

<script setup>
import ActionCard from '@/components/ActionCard.vue'

function onNewTrip() {
  console.log('Abrir modal crear viaje')
}
const emit = defineEmits([
  'new-trip',
  'go-trips',
  'go-preferences',
  'go-profile'
])

</script>

<style scoped>
.actions {
  margin-top: 12px;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
