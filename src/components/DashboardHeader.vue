<template>
  <header class="header">
    <div class="text">
      <h3 class="welcome">Hola,</h3>
      <h1>{{ user.name }}</h1>
    </div>

    <button class="logout" @click="logout" aria-label="Cerrar sesión">
      <LogoutIcon />
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { session } from '@/services/session'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'

const router = useRouter()
const user = session.get()

function logout() {
  session.clear()
  router.push('/login')
}
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
  margin-top: 2px;
}

.logout {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #6b7280;
}

.logout:hover {
  color: #111827;
}
</style>
