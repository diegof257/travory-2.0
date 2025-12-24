<template>
  <div
    class="card"
    :class="{ primary }"
    @click="$emit('click')"
  >
    <div class="icon">
      {{ icon }}
    </div>

    <div class="text">
      <h3>{{ title }}</h3>
      <p>{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: String,
  primary: Boolean
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  cursor: pointer;
}

.card.primary {
  background: linear-gradient(180deg, #0f172a, #020617);
  color: white;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.card.primary .icon {
  background: rgba(255,255,255,0.15);
}

h3 {
  font-size: 14px;
  font-weight: 600;
}

p {
  font-size: 12px;
  opacity: 0.7;
}
</style>
