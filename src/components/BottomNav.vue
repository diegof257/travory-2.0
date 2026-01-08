<template>
  <nav class="bottom-nav">
    <RouterLink to="/home" class="item">
      <HomeIcon />
    </RouterLink>

    <RouterLink to="/trips" class="item">
      <PlaneIcon />
    </RouterLink>

    <RouterLink to="/preferences" class="item">
      <HeartIcon />
    </RouterLink>

    <RouterLink to="/profile" class="item">
      <UserIcon />
    </RouterLink>
  </nav>
</template>

<script setup>
import HomeIcon from '@/components/icons/HomeIcon.vue'
import PlaneIcon from '@/components/icons/PlaneIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.item {
  color: #9ca3af;
}

.router-link-active {
  color: #111827;
}
</style>
