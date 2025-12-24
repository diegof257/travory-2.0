<template>
  <div class="empty-wrapper">
    <div class="icon">
      ✨
    </div>

    <h2>¡Empieza tu aventura!</h2>

    <p>
      Crea tu primer viaje y deja que la IA te ayude a planificarlo
    </p>

    <button @click="$emit('create')">
      <span>+</span>
      Crear mi primer viaje
    </button>
  </div>
</template>

<style scoped>
.empty-wrapper {
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
}

.icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f1f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 24px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

p {
  font-size: 14px;
  color: #6b7280;
  max-width: 300px;
  margin-bottom: 24px;
}

button {
  background: #111827;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>
