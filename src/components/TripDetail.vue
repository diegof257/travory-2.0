<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/api";

defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const generating = ref(false);
const preferences = ref([]);

const route = useRoute();
const router = useRouter();

const trip = ref(null);
const loading = ref(true);

/** Cargar preferencias del usuario */
async function loadPreferences() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const res = await api.getPreferences(user.id);
  preferences.value = res.data;
}

/** Cargar el detalle del viaje  */
async function loadTrip() {
  try {
    const res = await api.getTripDetails(route.params.id);

    const rawTrip = res.data.trip ?? res.data;

    trip.value = {
      ...rawTrip,
      itinerary: rawTrip.itinerary ?? {
        id: null,
        name: null,
        items: [],
      },
    };

    console.log("TRIP NORMALIZED:", trip.value);
  } catch (e) {
    console.error("Error cargando viaje", e);
    router.push("/trips");
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadTrip();
  await loadPreferences();
});

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/trips");
  }
}

const itineraryByDate = computed(() => {
  if (!trip.value?.itinerary?.items) return {};

  return trip.value.itinerary.items.reduce((acc, item) => {
    const date = item.start_datetime
      ? item.start_datetime.split("T")[0]
      : "Sin fecha";

    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
});

const sortedDates = computed(() =>
  Object.keys(itineraryByDate.value).sort((a, b) => {
    if (a === "Sin fecha") return 1;
    if (b === "Sin fecha") return -1;
    return new Date(a) - new Date(b);
  })
);

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function formatDay(date) {
  if (date === "Sin fecha") return "Sin fecha";
  return new Date(date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function openAddModal() {
  console.log("Abrir modal agregar actividad");
}

async function generateWithAI() {
  if (!trip.value) return;

  try {
    generating.value = true;

    const payload = buildIAPayload();

    console.log("📤 Payload IA:", payload);

    await api.generateItineraryAI(trip.value.id, payload);

    await loadTrip(); // 🔄 refresca itinerario
  } catch (e) {
    console.error("❌ Error generando itinerario con IA", e);
    alert("No se pudo generar el itinerario");
  } finally {
    generating.value = false;
  }
}

const isUpcoming = computed(() => trip.value?.status === "UPCOMING");

function calculateTripDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
}

function buildIAPayload() {
  const days = calculateTripDays(trip.value.start_date, trip.value.end_date);

  return {
    mensaje: `¿Puedes generarme un itinerario de ${days} día${
      days > 1 ? "s" : ""
    } en ${trip.value.destination}?`,
    preferencias: preferences.value.map((p) => ({
      tipo: p.preference_type,
      nivel: p.preference_level,
    })),
    viaje: {
      destino: trip.value.destination,
      duracionDias: days,
    },
  };
}
</script>

<template>
  <div v-if="loading" class="center">Cargando viaje…</div>

  <div v-else-if="!trip" class="center">Viaje no encontrado</div>

  <div v-else class="trip-detail">
    <!-- HERO -->
    <section class="hero">
      <button class="back-btn" @click="goBack">←</button>

      <span class="status-badge">
        {{ isUpcoming ? "Próximo" : "Pasado" }}
      </span>

      <div class="hero-content">
        <h1 class="hero-title">{{ trip.name }}</h1>
        <p class="hero-destination">📍 {{ trip.destination }}</p>
        <p class="hero-dates">
          {{ formatDate(trip.start_date) }} – {{ formatDate(trip.end_date) }}
        </p>
      </div>
    </section>

    <!-- ACTIONS -->
    <div class="actions">
      <button class="primary" @click="openAddModal">
        ＋ Agregar actividad
      </button>

      <button
        v-if="
          isUpcoming && (!trip.itinerary || trip.itinerary.items.length === 0)
        "
        class="primary"
        :disabled="generating"
        @click="generateWithAI"
      >
        <span v-if="!generating">✨ Generar con IA</span>
        <span v-else>Generando…</span>
      </button>
    </div>

    <!-- ITINERARY -->
    <section class="itinerary">
      <h2>Itinerario</h2>

      <div v-if="trip.itinerary.items.length === 0" class="empty">
        Aún no hay actividades
      </div>

      <div v-else class="timeline">
        <div v-for="date in sortedDates" :key="date" class="day-group">
          <div class="day-header">
            <div class="day-icon">📅</div>
            <div>
              <p class="day-name">{{ formatDay(date) }}</p>
              <p class="day-date">{{ formatDate(date) }}</p>
            </div>
          </div>

          <div class="day-items">
            <div
              v-for="item in itineraryByDate[date]"
              :key="item.id"
              class="timeline-item"
            >
              <div class="item-icon">
                {{ item.type === "POI" ? "🏛️" : "🍽️" }}
              </div>

              <div class="item-card">
                <div class="item-header">
                  <h4>{{ item.title }}</h4>
                  <span class="badge">{{ item.type }}</span>
                </div>

                <p v-if="item.description" class="item-desc">
                  {{ item.description }}
                </p>

                <div class="item-meta">
                  <span v-if="item.start_datetime">
                    ⏰ {{ item.start_datetime.slice(11, 16) }}
                  </span>
                  <span> 📍 {{ item.location }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-if="generating" class="ai-overlay">
    <div class="ai-box">
      <div class="spinner"></div>
      <h3>Generando tu itinerario</h3>
      <p>Travory está planificando tu viaje…</p>
    </div>
  </div>
</template>

<style scoped>
.trip-detail {
  background: #f8fafc;
  min-height: 100vh;
}

/* HERO */
.hero {
  position: relative;
  padding: 72px 20px 40px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  text-align: center;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top right,
    rgba(255, 255, 255, 0.15),
    transparent 60%
  );
}

.hero-content {
  position: relative;
  max-width: 420px;
  margin: 0 auto;
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero::after {
  pointer-events: none;
}

.hero-destination,
.hero-dates {
  font-size: 14px;
  color: #e5e7eb;
}

.hero-dates {
  margin-bottom: 20px;
}

.ai-btn:hover {
  background: #1c3b7a;
  color: white;
}

/* NAV */
.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: white;
}

.status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  color: #0f172a;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
}

/* ACTIONS */
.actions {
  padding: 16px;
}

.primary {
  width: 50%;
  padding: 14px;
  font-weight: 700;
  border-radius: 999px;
  border: solid 2px #10244a;
  background: rgb(255, 255, 255);
}

.primary:hover {
  background: #1c3b7a;
  color: white;
}

/* ITINERARY */
.itinerary {
  padding: 16px;
}

.item-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 32px 0;
}

/* CENTER */
.center {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

/* TIMELINE */
.timeline {
  margin-top: 16px;
}

.day-group {
  margin-bottom: 32px;
}

/* DAY HEADER */
.day-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.day-icon {
  background: #111827;
  color: white;
  border-radius: 12px;
  padding: 10px;
  font-size: 16px;
}

.day-name {
  font-weight: 600;
  text-transform: capitalize;
}

.day-date {
  font-size: 13px;
  color: #6b7280;
}

/* ITEMS */
.day-items {
  margin-left: 22px;
  border-left: 2px solid #e5e7eb;
  padding-left: 20px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

/* ICON */
.item-icon {
  margin-left: -36px;
  background: #111827;
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* CARD */
.item-card {
  background: white;
  border-radius: 12px;
  padding: 14px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.item-header h4 {
  font-size: 15px;
  font-weight: 600;
}

.badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #111827;
}

.item-desc {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #6b7280;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.ai-box {
  background: white;
  padding: 32px 28px;
  border-radius: 20px;
  text-align: center;
  width: 90%;
  max-width: 320px;
}

.ai-box h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.ai-box p {
  font-size: 14px;
  color: #6b7280;
}

/* SPINNER */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
