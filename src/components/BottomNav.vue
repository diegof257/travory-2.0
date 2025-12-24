<template>
  <nav class="bottom-nav">
    <RouterLink to="/trips" class="item">
      🏠
      <span>Inicio</span>
    </RouterLink>

    <RouterLink to="/trips" class="item">
      ✈️
      <span>Viajes</span>
    </RouterLink>

    <RouterLink to="/preferences" class="item">
      ❤️
      <span>Preferencias</span>
    </RouterLink>

    <RouterLink to="/chat" class="item">
      💬
      <span>Chat</span>
    </RouterLink>

    <RouterLink to="/profile" class="item">
      👤
      <span>Perfil</span>
    </RouterLink>
  </nav>
</template>

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
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
  text-decoration: none;
}

.router-link-active {
  color: #111827;
  font-weight: 600;
}
</style>
