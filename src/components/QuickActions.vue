<template>
  <section class="actions">
    <h2>Acciones rápidas</h2>

    <div class="grid">
      <ActionCard
        primary
        icon="+"
        title="Nuevo viaje"
        subtitle="Planifica tu próxima aventura"
        @click="onNewTrip"
      />

      <ActionCard
        icon="✨"
        title="IA Itinerario"
        subtitle="Generado automáticamente"
      />

      <ActionCard
        icon="🧭"
        title="Explorar"
        subtitle="Descubre destinos"
      />

      <ActionCard
        icon="📈"
        title="Estadísticas"
        subtitle="Tu historial"
      />
    </div>
  </section>
</template>

<script setup>
import ActionCard from '@/components/ActionCard.vue'

function onNewTrip() {
  console.log('Abrir modal crear viaje')
}
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
