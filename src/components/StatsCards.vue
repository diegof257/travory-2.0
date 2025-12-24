<template>
  <div class="stats">
    <div class="card" v-for="item in stats" :key="item.label">
      <span class="number">{{ item.value }}</span>
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.card {
  background: linear-gradient(180deg, #0f172a, #020617);
  color: white;
  border-radius: 16px;
  padding: 16px 12px;
  text-align: center;
}

.number {
  font-size: 22px;
  font-weight: 700;
  display: block;
}

.label {
  font-size: 12px;
  opacity: 0.8;
}
</style>
