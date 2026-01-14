<script setup>
import { ref, nextTick, onMounted } from "vue";
import api from "@/api/api";
import { session } from "@/services/session";
import { conversation } from "@/services/conversation";

const user = ref(null);
const conversationId = ref(null);

onMounted(() => {
  user.value = session.get();
  conversationId.value = conversation.getOrCreate();
});

const messages = ref([
  {
    id: "1",
    type: "bot",
    text: "¡Hola! Soy Travory, tu asistente de viajes. ¿En qué puedo ayudarte hoy?",
    timestamp: new Date(),
  },
]);

const inputValue = ref("");
const sending = ref(false);
const messagesEndRef = ref(null);

async function scrollToBottom() {
  await nextTick();
  messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
}

async function handleSend() {
  if (
    !inputValue.value.trim() ||
    sending.value ||
    !user.value?.id ||
    !conversationId.value
  ) {
    return;
  }
  const userMessage = {
    id: Date.now().toString(),
    type: "user",
    text: inputValue.value,
    timestamp: new Date(),
  };

  messages.value.push(userMessage);
  inputValue.value = "";
  sending.value = true;

  await scrollToBottom();

  const thinkingId = Date.now() + "-bot";
  messages.value.push({
    id: thinkingId,
    type: "bot",
    text: "Estoy pensando… 🤔",
    timestamp: new Date(),
    loading: true,
  });

  await scrollToBottom();

  try {
    const res = await api.sendChatMessage({
      userId: user.value.id,
      conversationId: conversationId.value,
      message: userMessage.text,
    });
    const index = messages.value.findIndex((m) => m.id === thinkingId);

    if (index !== -1) {
      messages.value[index] = {
        id: thinkingId,
        type: "bot",
        text: res.data.reply,
        timestamp: new Date(),
      };
    }
  } catch (e) {
    console.error("Chat error:", e);
    messages.value.push({
      id: Date.now() + "-error",
      type: "bot",
      text: "Hubo un error al responder 😕",
      timestamp: new Date(),
    });
  } finally {
    sending.value = false;
    await scrollToBottom();
  }
}
</script>
<template>
  <div class="chat-view">
    <!-- HEADER -->
    <header class="chat-header">
      <div class="bot-avatar">🤖</div>
      <div>
        <h1>Asistente IA</h1>
        <span class="online">● En línea</span>
      </div>
    </header>

    <!-- MESSAGES -->
    <div class="messages">
      <div v-for="msg in messages" :key="msg.id" :class="['message', msg.type]">
        <div class="bubble">
          <p>{{ msg.text }}</p>
          <small>
            {{
              msg.timestamp.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </small>
        </div>
      </div>

      <div ref="messagesEndRef" />
    </div>

    <!-- INPUT -->
    <footer class="input-area">
      <input
        v-model="inputValue"
        placeholder="Escribe tu mensaje…"
        @keyup.enter="handleSend"
      />
      <button @click="handleSend" :disabled="sending">➤</button>
    </footer>
  </div>
</template>

<style scoped>
.chat-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* HEADER */
.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.bot-avatar {
  background: #0f172a;
  color: white;
  border-radius: 50%;
  padding: 10px;
}

.online {
  font-size: 12px;
  color: #16a34a;
}

/* MESSAGES */
.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 12px;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 75%;
  padding: 12px;
  border-radius: 16px;
  font-size: 14px;
}

.message.user .bubble {
  background: #0f172a;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .bubble {
  background: white;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.bubble small {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.6;
}

/* INPUT */
.input-area {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.input-area input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
}

.input-area button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #0f172a;
  color: white;
}
</style>
