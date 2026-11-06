<template>
<div>
    <button id="chat-toggle" :style="{ display: isBubbleVisible ? 'flex' : 'none' }"
            @click="toggleChat"
            style="border-radius: 50%;
            width: 80px; height: 80px;
            background-color: #0084ff;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            border: none; display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 20px;
            right: 20px;">
        🤖
    </button>

    <div id="chat-box" :style="{ display: isChatVisible ? 'flex' : 'none' }">
        <div id="chat-header">
            <span>
                <button @click="clearHistoryFromSessionStorage" id="chat-clear-history" :disabled="isLoading">
                    <feather-icon icon="TrashIcon" svgClasses="w-4 h-4" />
                </button>
            </span>
            <span>Asistente Virtual</span>
            <span id="chat-close" @click="closeChat">✕</span>
        </div>
        <div id="chat-messages" ref="chatMessages">
            <div v-for="message in messages" :key="message.id" :class="message.type + '-message'">
                <div v-html="parseMarkdown(message.content)"></div>
            </div>
            <div v-if="isLoading" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div id="chat-input">
            <input type="text"
                   id="message-input"
                   v-model="currentMessage"
                   @keypress.enter="sendMessage"
                   :disabled="isLoading"
                   placeholder="Pregúntame algo..."
                   style="width: 80%;"/>
            <button @click="sendMessage" :disabled="isLoading || !currentMessage.trim()">
                {{ isLoading ? 'Enviando...' : 'Enviar' }}
            </button>
        </div>
        <div id="resize-handle"> </div>
    </div>
</div>
</template>

<script>
import Echo from '../services/echo.js';
import axios from 'axios';
import { marked } from 'marked';
export default {
  name: 'AIChat',
  data() {
    return {
      isChatVisible: false,
      isBubbleVisible: true,
      isLoading: false,
      currentMessage: '',
      messages: [],
      messageIdCounter: 0,
      chatId: null
    }
  },
  // mounted() {
  //   this.loadMessagesFromSessionStorage();
  //   this.initializeChatEventListeners();
  //   this.generateChatId();
  //   console.log("uwu")
  //   // 🎧 Escuchar mensajes en tiempo real
  //   Echo.channel(`chat.${this.chatId}`)
  //     .listen('MessageSent', (e) => {
  //       this.addMessage(e.message, 'model');
  //       this.saveMessagesToSessionStorage();
  //     });
  // },
  mounted() {
    this.generateChatId();
    Echo.channel(`chat.${this.chatId}`)
    .listen('MessageSent', (e) => {
      console.log('Evento recibido por WebSocket:', e); // <-- Aquí verás el evento completo
      this.addMessage(e.message, 'model');
      this.saveMessagesToSessionStorage();
    });
    this.loadMessagesFromSessionStorage();
    this.initializeChatEventListeners();
    console.log("uwu")
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    parseMarkdown(content) {
      // Configurar marked para un renderizado más seguro
      marked.setOptions({
        breaks: true, // Convertir saltos de línea en <br>
        gfm: true,    // GitHub Flavored Markdown
        sanitize: false // En producción, considera usar DOMPurify para sanitizar
      });

      return marked(content);
    },

    generateChatId() {
      // Generar un ID único para este chat
      this.chatId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
     },
    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
      this.isBubbleVisible = !this.isChatVisible;
      if (this.isChatVisible) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    closeChat() {
      this.isChatVisible = false;
      this.isBubbleVisible = true;
    },

    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return;

      const userMessage = this.currentMessage.trim();
      this.currentMessage = '';

      // Agrega mensaje del usuario
      this.addMessage(userMessage, 'user');
      this.isLoading = true;

      try {
        // Simula llamada al backend
                this.saveMessagesToSessionStorage();
        await this.callAI(userMessage);
      } catch (error) {
        console.error('Error enviando mensaje:', error);
        this.addMessage('Lo siento, hubo un error al procesar tu mensaje.', 'model');
      } finally {
        this.isLoading = false;
      }
    },

    addMessage(content, type) {
      const message = {
        id: ++this.messageIdCounter,
        content,
        type
      };

      this.messages.push(message);

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    async callAI(message) {

      try {
 const savedData = sessionStorage.getItem('chatMessages');
        let chatHistory = [];

        if (savedData) {
          const chatData = JSON.parse(savedData);
          // Convertir los mensajes al formato requerido por el backend
          chatHistory = chatData.messages && chatData.messages.map(msg => ({
            content: msg.content,
            role: msg.type // 'user' o 'model'
          })) || [];
        }

        // Preparar el payload con la estructura correcta
        const payload = {
          chatId: this.chatId,
          messages: chatHistory
        };

        console.log('Enviando payload:', payload);

        // Usar axios en lugar de fetch
        const response = await axios.post(process.env.apiProlipa +'api/send-message', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        const data = response.data;
        console.log('Respuesta del servidor:', data);
      } catch (error) {
        console.error('Error al enviar mensaje al backend:', error);
      }
    },

    clearHistoryFromSessionStorage() {
      if (this.isLoading) return;

      this.messages = [];
      this.messageIdCounter = 0;
      sessionStorage.removeItem('chatMessages');
    },

    saveMessagesToSessionStorage() {
      try {
        const chatData = {
          messages: this.messages,
          messageIdCounter: this.messageIdCounter
        };
        sessionStorage.setItem('chatMessages', JSON.stringify(chatData));
      } catch (error) {
        console.error('Error guardando mensajes en sessionStorage:', error);
      }
    },

    loadMessagesFromSessionStorage() {
      try {
        const savedData = sessionStorage.getItem('chatMessages');
        if (savedData) {
          const chatData = JSON.parse(savedData);
          this.messages = chatData.messages || [];
          this.messageIdCounter = chatData.messageIdCounter || 0;
        }
      } catch (error) {
        console.error('Error cargando mensajes del sessionStorage:', error);
        this.messages = [];
        this.messageIdCounter = 0;
      }
    },

    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    },

    initializeChatEventListeners() {
    },

    cleanup() {
    }
  }
}
</script>

<style>
#chat-toggle {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, #007bff 60%, #0056b3 100%);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    font-size: 28px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    transition: box-shadow 0.3s, transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}
#chat-toggle:hover {
    background: linear-gradient(135deg, #0056b3 60%, #003d80 100%);
    transform: scale(1.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.30);
}
#chat-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 770px;
    height: 850px; /* Adding default height */
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    display: none;
    flex-direction: column;
    z-index: 999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    overflow: hidden;
    min-width: 250px;
    min-height: 300px;
    max-width: 100vw; max-height: 80vh;
    resize: both; /* Habilita el redimensionamiento nativo */
}

#resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3 L21 3 L21 9"></path><path d="M9 21 L3 21 L3 15"></path></svg>');
    background-position: bottom right;
    background-repeat: no-repeat;
    cursor: nwse-resize;
    z-index: 1001;
}

#chat-header {
    background: linear-gradient(135deg, #007bff 60%, #0056b3 100%);
    color: #fff;
    padding: 16px 20px;
    border-radius: 16px 16px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 17px;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    flex: 0 0 auto; /* Prevent shrinking */
}

#chat-close {
    cursor: pointer;
    font-size: 16px;
    transition: transform 0.2s;
}

#chat-close:hover {
    transform: scale(1.2);
}

#chat-messages {
    flex: 1 1 auto; /* Allow growing and shrinking */
    padding: 18px;
    overflow-y: auto;
    background: #f4f7fb;
    scroll-behavior: smooth;
    min-height: 100px; /* Ensure some minimum space */
}

#chat-messages::-webkit-scrollbar {
    width: 7px;
}
#chat-messages::-webkit-scrollbar-track {
    background: #e9ecef;
}
#chat-messages::-webkit-scrollbar-thumb {
    background: #b0b8c1;
    border-radius: 4px;
}

#chat-input {
    display: flex;
    border-top: 1px solid #e9ecef;
    background: #fff;
    border-radius: 0 0 16px 16px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.03);
    flex: 0 0 auto; /* Prevent shrinking */
    position: sticky;
    bottom: 0;
}

#chat-input input {
    flex: 1;
    border: none;
    padding: 14px 18px;
    outline: none;
    font-size: 15px;
    border-radius: 0 0 0 16px;
    background: #f8fafc;
    color: #222;
    transition: background 0.2s;
}
#chat-input input:focus {
    background: #e9f2ff;
}

#chat-input button {
    padding: 14px 24px;
    border: none;
    background: linear-gradient(135deg, #949499 60%, #6c757d 100%);
    color: #fff;
    cursor: pointer;
    font-size: 15px;
    border-radius: 0 0 16px 0;
    transition: background 0.2s, transform 0.2s;
    font-weight: 500;
}
#chat-input button:hover:not(:disabled) {
    background: linear-gradient(135deg, #0056b3 60%, #007bff 100%);
    transform: scale(1.04);
}
#chat-input button:disabled {
    background: #b0b8c1;
    cursor: not-allowed;
}

.user-message {
    background: #a9d4ff;
    color: #222;
    font-size: 13px;
    padding: 8px 12px;
    margin: 6px 0 6px auto;
    border-radius: 12px 12px 2px 12px;
    max-width: 80%;
    text-align: right;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    word-break: break-word;
    animation: fadeIn 0.3s ease-in;
}

.model-message {
    background: #ffd7a9;
    color: #222;
    font-size: 13px;
    padding: 8px 12px;
    margin: 6px auto 6px 0;
    border-radius: 12px 12px 12px 2px;
    max-width: 80%;
    text-align: left;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    word-break: break-word;
    animation: fadeIn 0.3s ease-in;
}

/* Estilos para elementos Markdown dentro de los mensajes */
.user-message div, .model-message div {
    line-height: 1.4;
}

.user-message p, .model-message p {
    margin: 0 0 8px 0;
}

.user-message p:last-child, .model-message p:last-child {
    margin-bottom: 0;
}

.user-message h1, .user-message h2, .user-message h3,
.model-message h1, .model-message h2, .model-message h3 {
    margin: 8px 0 4px 0;
    font-weight: 600;
}

.user-message h1, .model-message h1 { font-size: 16px; }
.user-message h2, .model-message h2 { font-size: 15px; }
.user-message h3, .model-message h3 { font-size: 14px; }

.user-message code, .model-message code {
    background: rgba(0,0,0,0.1);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
}

.user-message pre, .model-message pre {
    background: rgba(0,0,0,0.1);
    padding: 8px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 4px 0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
}

.user-message ul, .user-message ol,
.model-message ul, .model-message ol {
    margin: 4px 0;
    padding-left: 16px;
}

.user-message li, .model-message li {
    margin: 2px 0;
}

.user-message blockquote, .model-message blockquote {
    border-left: 3px solid rgba(0,0,0,0.2);
    margin: 4px 0;
    padding-left: 8px;
    font-style: italic;
}

.user-message strong, .model-message strong {
    font-weight: 600;
}

.user-message em, .model-message em {
    font-style: italic;
}
.message {
    animation: fadeIn 0.3s ease-in;
}

/* Animación de puntos suspensivos */
.typing-indicator {
    background-color: #e6e7ed;
    padding: 10px;
    border-radius: 12px 12px 12px 2px;
    width: 60px;
    margin: 6px auto 6px 0;
    position: relative;
    text-align: center;
}

.typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: #666;
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    opacity: 0.4;
    animation: typing 1.2s infinite;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0% {
        transform: translateY(0);
        opacity: 0.4;
    }
    50% {
        transform: translateY(-5px);
        opacity: 1;
    }
    100% {
        transform: translateY(0);
        opacity: 0.4;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Clear History Button */
#chat-clear-history {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    border-radius: 50%;
    transition: all 0.2s ease;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#chat-clear-history:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

#chat-clear-history:active:not(:disabled) {
    transform: scale(0.95);
}

#chat-clear-history:disabled {
    background: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
