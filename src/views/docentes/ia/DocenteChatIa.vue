<template>
  <div class="chat-page" v-if="usuario.id_group == 1 || usuario.id_group == 6 || usuario.id_group == 10">
    <!-- Header -->
    <div class="chat-header">
      <div class="header-content">
        <div class="bot-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div class="header-info">
          <h1>Prolipa AI - Asistente Inteligente</h1>
          <span class="status-online">
            <span class="status-dot"></span>
            En línea • IA Activa
          </span>
        </div>

        <div class="header-actions">
          <button class="action-btn" v-if="messages.length > 1" @click="confirmNewChat" title="Empezar de nuevo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              <path d="M11 6h2v3h3v2h-3v3h-2v-3H8V9h3z"/>
            </svg>
            <span class="btn-text">Empezar de nuevo</span>
          </button>
          <!-- <button class="action-btn danger" @click="confirmClearAll" title="Limpiar Todo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button> -->
        </div>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="chat-container">
      <!-- Messages Area -->
      <div class="messages-area" ref="messagesArea">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.type]"
        >
          <div class="message-avatar" v-if="message.type === 'bot'">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-bubble" v-html="formatMessage(message.text)"></div>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <div class="message-avatar user-avatar" v-if="message.type === 'user'">
            <span>{{ getUserInitials() }}</span>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div class="message bot typing-indicator" v-if="isTyping">
          <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-bubble typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Suggestions -->
      <div class="quick-suggestions" v-if="showSuggestions && messages.length <= 1">
        <span class="suggestion-label">Sugerencias rápidas:</span>
        <div class="suggestions-list">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-btn"
            @click="sendSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="input-container">
          <input
            type="text"
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="Escribe cualquier pregunta..."
            :disabled="isTyping"
            ref="inputField"
          />
          <button
            class="send-btn"
            @click="sendMessage"
            :disabled="!userInput.trim() || isTyping"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p class="input-hint">🤖 Pregunta lo que quieras • Prolipa AI puede responder cualquier consulta</p>
      </div>
    </div>
  </div>

  <!-- Access Denied -->
  <div class="access-denied" v-else>
    <div class="denied-content">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <h2>Acceso Restringido</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuario: [],
      userInput: '',
      messages: [],
      isTyping: false,
      showSuggestions: true,
      conversationHistory: [],
      // Configuración de APIs (múltiples opciones de fallback)
      apis: [
        {
          name: 'gemini',
          url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
          key: 'AIzaSyDxG7aeJOuw8GpHnlvRu1wv8FKca-aO6qI'
        }
      ],
      suggestions: [
        '¿Cuánto es 125 × 48?',
        '¿Cuál es la capital de Ecuador?',
        'Explícame la fotosíntesis',
        '¿Cuántas provincias tiene Ecuador?',
        'Dame un dato curioso'
      ]
    };
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    this.resetChat();
  },
  methods: {
    confirmNewChat() {
      if (this.messages.length > 1) {
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: '¿Empezar de nuevo?',
          text: 'Se perderá el historial de la conversación actual. ¿Deseas continuar?',
          accept: this.resetChat,
          acceptText: 'Sí, empezar de nuevo',
          cancelText: 'Cancelar'
        });
      } else {
        this.resetChat();
      }
    },
    confirmClearAll() {
      if (this.messages.length > 0) {
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: '¿Limpiar todo?',
          text: 'Se borrarán todos los mensajes de la pantalla. ¿Deseas continuar?',
          accept: this.clearAll
        });
      }
    },
    resetChat() {
      this.messages = [];
      this.conversationHistory = [];
      this.showSuggestions = true;
      this.isTyping = false;
      this.userInput = '';
      this.addBotMessage('¡Hola! 👋 Soy **Prolipa AI**, tu asistente inteligente.\n\n🤖 **Puedo responder cualquier pregunta:**\n• Matemáticas y cálculos\n• Ciencias y tecnología\n• Historia y geografía\n• Idiomas y literatura\n• Tareas escolares\n• ¡Y mucho más!\n\n¿En qué puedo ayudarte hoy?');
    },
    clearAll() {
      this.messages = [];
      this.conversationHistory = [];
      this.showSuggestions = true; // Mostramos sugerencias si está vacío
      this.isTyping = false;
      this.userInput = '';
    },
    getUserInitials() {
      if (this.usuario && this.usuario.nombre) {
        const parts = this.usuario.nombre.split(' ');
        return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
      }
      return 'U';
    },
    getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    },
    formatMessage(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/• /g, '&bull; ');
    },
    addBotMessage(text) {
      this.messages.push({
        type: 'bot',
        text: text,
        time: this.getCurrentTime()
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    addUserMessage(text) {
      this.messages.push({
        type: 'user',
        text: text,
        time: this.getCurrentTime()
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      if (this.$refs.messagesArea) {
        this.$refs.messagesArea.scrollTop = this.$refs.messagesArea.scrollHeight;
      }
    },
    // async callGeminiAPI(prompt) {
    //   // Usar el proxy Laravel del backend para evitar CORS
    //   const proxyUrl = 'http://localhost:8000/api/gemini-proxy';

    //   const contents = [
    //     {
    //       role: 'user',
    //       parts: [{ text: 'Eres Prolipa AI, un asistente educativo amigable para estudiantes y docentes de Ecuador y Latinoamérica. Responde SIEMPRE en español de forma clara, concisa y educativa. Usa emojis ocasionalmente para hacer las respuestas más amigables. Si te preguntan operaciones matemáticas, calcula y muestra el resultado. Adapta tus respuestas al nivel educativo apropiado. Sé amable y motivador.' }]
    //     },
    //     {
    //       role: 'model',
    //       parts: [{ text: '¡Entendido! Soy Prolipa AI, tu asistente educativo. Respondo en español, uso emojis cuando es apropiado y puedo hacer cálculos matemáticos. ¿En qué puedo ayudarte hoy? 😊' }]
    //     },
    //     ...this.conversationHistory.slice(-8),
    //     {
    //       role: 'user',
    //       parts: [{ text: prompt }]
    //     }
    //   ];

    //   const response = await fetch(proxyUrl, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       contents: contents,
    //       generationConfig: {
    //         temperature: 0.7,
    //         maxOutputTokens: 1024,
    //       }
    //     })
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({}));
    //     console.error('Gemini API Error:', errorData);
    //     throw new Error('API Error');
    //   }

    //   const data = await response.json();

    //   if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    //     const text = data.candidates[0].content.parts[0].text;
    //     this.conversationHistory.push({ role: 'user', parts: [{ text: prompt }] });
    //     this.conversationHistory.push({ role: 'model', parts: [{ text }] });
    //     return text;
    //   }

    //   throw new Error('No response');
    // },
    async callGroqAPI(prompt) {
      const proxyUrl = 'http://localhost:8000/api/groq-proxy';

      const messages = [
        {
          role: 'system',
          content: 'Eres Prolipa AI, un asistente educativo amigable para estudiantes y docentes de Ecuador y Latinoamérica. Responde SIEMPRE en español, de forma clara, educativa y amable. Usa emojis ocasionalmente.'
        },
        ...this.conversationHistory.slice(-8),
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) throw new Error('Groq API Error');

      const data = await response.json();

      const text = data.choices[0].message.content;

      this.conversationHistory.push({ role: 'user', content: prompt });
      this.conversationHistory.push({ role: 'assistant', content: text });

      return text;
    },

    solveMath(input) {
      let cleanInput = input.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/cuanto es/gi, '').replace(/cuanto da/gi, '')
        .replace(/\?/g, '').trim()
        .replace(/\bmas\b/gi, '+').replace(/\bmenos\b/gi, '-')
        .replace(/\bpor\b/gi, '*').replace(/\bentre\b/gi, '/')
        .replace(/\bx\b/gi, '*').replace(/×/g, '*').replace(/÷/g, '/').trim();

      const pattern = /(\d+\.?\d*)\s*([\+\-\*\/])\s*(\d+\.?\d*)/;
      try {
        if (pattern.test(cleanInput)) {
          const match = cleanInput.match(pattern);
          const num1 = parseFloat(match[1]);
          const op = match[2];
          const num2 = parseFloat(match[3]);
          let result, expr;

          switch(op) {
            case '+': result = num1 + num2; expr = `${num1} + ${num2}`; break;
            case '-': result = num1 - num2; expr = `${num1} - ${num2}`; break;
            case '*': result = num1 * num2; expr = `${num1} × ${num2}`; break;
            case '/':
              if (num2 === 0) return '⚠️ ¡No se puede dividir entre cero!';
              result = num1 / num2; expr = `${num1} ÷ ${num2}`;
              break;
          }

          if (result !== undefined) {
            const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
            return `🧮 **${expr} = ${formatted}**`;
          }
        }
      } catch (e) { return null; }
      return null;
    },
    getLocalResponse(input) {
      const lower = input.toLowerCase();

      // Matemáticas
      const math = this.solveMath(input);
      if (math) return math;

      // Respuestas educativas locales
      if (lower.includes('provincia') && lower.includes('ecuador'))
        return '🇪🇨 Ecuador tiene **24 provincias**:\n\n**Costa:** Esmeraldas, Manabí, Santa Elena, Guayas, Los Ríos, El Oro\n**Sierra:** Carchi, Imbabura, Pichincha, Santo Domingo, Cotopaxi, Tungurahua, Bolívar, Chimborazo, Cañar, Azuay, Loja\n**Oriente:** Sucumbíos, Napo, Orellana, Pastaza, Morona Santiago, Zamora Chinchipe\n**Insular:** Galápagos';

      if (lower.includes('capital') && lower.includes('ecuador'))
        return '🇪🇨 La capital de Ecuador es **Quito**, ubicada en la provincia de Pichincha, en la Sierra.';

      if (lower.includes('fotosintesis') || lower.includes('fotosíntesis'))
        return '🌱 **La fotosíntesis** es el proceso por el cual las plantas convierten:\n\n• **Luz solar** ☀️\n• **Agua** 💧\n• **Dióxido de carbono (CO₂)** 🌫️\n\nEn:\n• **Glucosa** (alimento) 🍬\n• **Oxígeno** (O₂) que liberan al aire 💨\n\n*Fórmula:* 6CO₂ + 6H₂O + Luz → C₆H₁₂O₆ + 6O₂';

      if (lower.includes('hola')) return '¡Hola! 👋 ¿En qué puedo ayudarte hoy?';
      if (lower.includes('gracias')) return '¡De nada! 😊 Estoy aquí para ayudarte siempre.';
      if (lower.includes('quien eres') || lower.includes('quién eres'))
        return '🤖 Soy **Prolipa AI**, tu asistente educativo inteligente. Puedo ayudarte con tareas, resolver dudas, hacer cálculos matemáticos y responder preguntas sobre cualquier tema. ¡Pregúntame lo que quieras!';

      if (lower.includes('dato curioso'))
        return '🧠 **Dato curioso:** ¿Sabías que el cerebro humano tiene aproximadamente **86 mil millones de neuronas**? ¡Es el órgano más complejo del universo conocido! 🌟';

      if (lower.includes('tabla') && lower.includes('multiplicar'))
        return '✖️ **Tablas de multiplicar básicas:**\n\n2×2=4, 2×3=6, 2×4=8, 2×5=10\n3×3=9, 3×4=12, 3×5=15\n4×4=16, 4×5=20\n5×5=25\n\n¿Necesitas una tabla específica?';

      // Respuesta genérica mejorada
      return '📚 Esa es una excelente pregunta. Estoy procesando la información para darte la mejor respuesta. ¿Podrías darme más detalles o intentar reformular tu pregunta?';
    },
    async sendMessage() {
      const message = this.userInput.trim();
      if (!message) return;

      this.addUserMessage(message);
      this.userInput = '';
      this.showSuggestions = false;
      this.isTyping = true;

      try {
        // Primero intentar con la API de Groq
        const response = await this.callGroqAPI(message);
        this.isTyping = false;
        this.addBotMessage(response);
      } catch (error) {
        console.error('API Error:', error);
        this.isTyping = false;
        // Fallback a respuestas locales inteligentes
        const localResponse = this.getLocalResponse(message);
        this.addBotMessage(localResponse);
      }
    },
    sendSuggestion(suggestion) {
      this.userInput = suggestion;
      this.sendMessage();
    }
  }
};
</script>

<style scoped>
.chat-page {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --secondary: #10b981;
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --bg-input: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-color: #334155;
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-dark) 0%, #1a1a2e 50%, #16213e 100%);
  padding: 20px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.chat-header {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 20px 20px 0 0;
  padding: 24px 30px;
  box-shadow: var(--shadow);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bot-avatar {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.bot-avatar svg {
  width: 32px;
  height: 32px;
  color: white;
}

.header-info h1 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.status-online {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  font-family: inherit;
}

.action-btn svg { width: 20px; height: 20px; }
.action-btn span { font-size: 0.9rem; font-weight: 500; }

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.action-btn:active { transform: translateY(0); }

.action-btn.danger { padding: 0 12px; }
.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.chat-container {
  background: var(--bg-card);
  border-radius: 0 0 20px 20px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  min-height: 500px;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.messages-area::-webkit-scrollbar { width: 6px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user { align-self: flex-end; flex-direction: row-reverse; }
.message.bot { align-self: flex-start; }

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.bot .message-avatar {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.message.bot .message-avatar svg { width: 24px; height: 24px; color: white; }

.user-avatar {
  background: linear-gradient(135deg, var(--secondary) 0%, #059669 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.message-content { display: flex; flex-direction: column; gap: 4px; }

.message-bubble {
  padding: 14px 18px;
  border-radius: 18px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.message.bot .message-bubble {
  background: var(--bg-input);
  color: var(--text-primary);
  border-bottom-left-radius: 6px;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.message-time { font-size: 0.75rem; color: var(--text-muted); padding: 0 4px; }
.message.user .message-time { text-align: right; }

.typing-indicator .message-bubble.typing { display: flex; gap: 6px; padding: 16px 20px; }

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
.typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
}

.quick-suggestions {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: rgba(99, 102, 241, 0.05);
}

.suggestion-label { display: block; color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 12px; }
.suggestions-list { display: flex; flex-wrap: wrap; gap: 8px; }

.suggestion-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.input-area {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.2);
}

.input-container {
  display: flex;
  gap: 12px;
  background: var(--bg-input);
  border-radius: 16px;
  padding: 6px;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.input-container:focus-within { border-color: var(--primary); }

.input-container input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 1rem;
  padding: 12px 16px;
}

.input-container input::placeholder { color: var(--text-muted); }

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.send-btn svg { width: 22px; height: 22px; }

.input-hint { text-align: center; color: var(--text-muted); font-size: 0.75rem; margin-top: 10px; }

.access-denied {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%);
}

.denied-content { text-align: center; color: white; }
.denied-content svg { width: 80px; height: 80px; color: #ef4444; margin-bottom: 20px; }
.denied-content h2 { font-size: 1.5rem; margin-bottom: 10px; }
.denied-content p { color: #94a3b8; }

@media (max-width: 768px) {
  .chat-page { padding: 10px; }
  .chat-header { padding: 16px 20px; border-radius: 16px 16px 0 0; }
  .header-content { flex-direction: column; align-items: flex-start; gap: 12px; }
  .header-info h1 { font-size: 1.1rem; }
  .bot-avatar { width: 48px; height: 48px; }
  .header-actions { width: 100%; margin: 0; display: flex; gap: 8px; }
  .action-btn { flex: 1; justify-content: center; height: 38px; }
  .message { max-width: 90%; }
  .suggestions-list { flex-direction: column; }
  .suggestion-btn { text-align: center; }
}
</style>
