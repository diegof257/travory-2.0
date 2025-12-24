<template>
  <div class="app-layout">
    <main class="content">
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '@/components/BottomNav.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding-bottom: 70px; /* espacio para el menú */
}
</style>
