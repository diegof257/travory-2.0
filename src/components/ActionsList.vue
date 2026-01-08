<template>
  <section class="actions">
    <h3>Acciones</h3>

    <ul>
  <li @click="emit('trips')">
    <span class="icon">✈️</span>
    <span class="text">Mis viajes</span>
    <span class="chevron">›</span>
  </li>

  <li @click="emit('preferences')">
    <span class="icon">⚙️</span>
    <span class="text">Preferencias</span>
    <span class="chevron">›</span>
  </li>
</ul>

  </section>
</template>

<script setup>
const emit = defineEmits([
  'new-trip',
  'trips',
  'preferences'
])
</script>

<style scoped>
.actions {
  margin-top: 32px;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border-radius: 14px;
  overflow: hidden;
}

li {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
}

li:last-child {
  border-bottom: none;
}

.icon {
  width: 32px;
  text-align: center;
  font-size: 18px;
}

.text {
  flex: 1;
  font-size: 15px;
}

.chevron {
  color: #9ca3af;
  font-size: 18px;
}
</style>
