<template>
  <div class="stats">
    <div class="stat">
      <span class="value">{{ stats.total }}</span>
      <span class="label">Viajes</span>
    </div>

    <div class="stat">
      <span class="value">{{ stats.upcoming }}</span>
      <span class="label">Próximos</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.stat {
  background: white;
  border-radius: 14px;
  padding: 14px;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
}

.value {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.label {
  font-size: 13px;
  color: #6b7280;
}
</style>
