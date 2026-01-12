<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <RouterLink to="/home" class="item">
        <HomeIcon class="icon" />
        <span class="label">Home</span>
      </RouterLink>

      <RouterLink to="/trips" class="item">
        <PlaneIcon class="icon" />
        <span class="label">Viajes</span>
      </RouterLink>

      <RouterLink to="/chat" class="item">
        <ChatIcon class="icon" />
        <span class="label">Chat IA</span>
      </RouterLink>

      <RouterLink to="/profile" class="item">
        <UserIcon class="icon" />
        <span class="label">Ajustes</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import HomeIcon from '@/components/icons/HomeIcon.vue'
import PlaneIcon from '@/components/icons/PlaneIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import ChatIcon from './icons/ChatIcon.vue';
</script>

<style scoped>
/* Barra fija inferior */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f8fafc; /* slate-100 */
  border-top: 1px solid #cbd5f5; /* slate-300 */
  z-index: 50;
}

/* Contenedor centrado (como Figma) */
.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  max-width: 32rem; /* max-w-lg */
  margin: 0 auto;
  padding: 0 8px;
}

/* Cada tab */
.item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #64748b; /* slate-500 */
  text-decoration: none;
  transition: color 0.2s ease;
}

/* Icono */
.icon {
  width: 24px;
  height: 24px;
}

/* Label */
.label {
  font-size: 12px;
  font-weight: 500;
}

/* Activo (RouterLink) */
.router-link-active {
  color: #334155; /* slate-700 */
}
</style>
