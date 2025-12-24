<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- LOGO / TITLE -->
      <h1 class="title">Travory</h1>
      <p class="subtitle">
        Inicia sesión para gestionar tus viajes
      </p>

      <!-- FORM -->
      <form @submit.prevent="login">
        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button class="btn-primary" :disabled="loading">
          {{ loading ? 'Entrando…' : 'Iniciar sesión' }}
        </button>

        <p v-if="error" class="error">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/api'
import { session } from '@/services/session'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    session.save(res.data.user)
    router.push('/trips')
  } catch (e) {
    error.value = 'Email o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== MOBILE FIRST ===== */

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f8f8fb;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.field input {
  height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.field input:focus {
  outline: none;
  border-color: #4f46e5;
}

.btn-primary {
  width: 100%;
  height: 48px;
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  background: #4f46e5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 12px;
  color: #e53935;
  font-size: 13px;
  text-align: center;
}

/* ===== DESKTOP AJUSTES ===== */
@media (min-width: 768px) {
  .login-card {
    padding: 32px;
  }
}
</style>
