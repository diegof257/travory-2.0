<template>
  <header class="header">
    <div class="text">
      <span class="welcome">Bienvenido de nuevo</span>
      <h1>{{ name }}</h1>
    </div>

    <img src="/logo.svg" alt="Travory" class="logo" />
  </header>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.welcome {
  font-size: 13px;
  color: #6b7280;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  margin-top: 4px;
}

.logo {
  width: 36px;
  height: 36px;
}
</style>
