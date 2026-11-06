<template>
  <div v-if="usuario">
    <div class="chat-container" v-if="usuario.name_usuario == 'no_mostrar'">
    <!-- Botón flotante -->
    <vs-button
      floating
      circle
      icon
      size="large"
      @click="toggleChat"
      class="chat-toggle-btn"
    >
      <i v-if="!isChatVisible" class="fas fa-comment-dots"></i>
      <i v-else class="fas fa-times"></i>
    </vs-button>

    <!-- Ventana flotante -->
    <transition name="fade">
      <div
        v-if="isChatVisible"
        class="chat-content"
        ref="chatWindow"
        :style="{ width: width + 'px', height: isMinimized ? '60px' : height + 'px', top: posY + 'px', left: posX + 'px' }"
      >
      <h3 class="chat-title" @mousedown="startDrag" @touchstart="startTouch">
        <span class="chat-title-text">Prolipa AI</span>

        <div class="chat-buttons">
          <button @click="toggleMinimize" title="Minimizar">
            <i :class="isMinimized ? 'fas fa-window-restore' : 'fas fa-window-minimize'"></i>
          </button>
          <button @click="maximizeChat" title="Maximizar">
            <i class="fas fa-expand"></i>
          </button>
          <button @click="resetChat" title="Restaurar">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button class="btn-close-chat" @click="toggleChat" title="Cerrar chat">×</button>
        </div>

      </h3>

        <iframe
          v-show="!isMinimized"
          ref="chatIframe"
          src="https://www.deepseekr1.org/es/embed"
          class="chat-iframe"
          frameborder="0"
          @load="onIframeLoad"
        ></iframe>

        <!-- resizers si quieres que no funcionen minimizado, podrías ocultarlos -->
        <div v-show="!isMinimized" class="resizer resizer-right" @mousedown="startResize('right')"></div>
        <div v-show="!isMinimized" class="resizer resizer-left" @mousedown="startResize('left')"></div>
        <div v-show="!isMinimized" class="resizer resizer-bottom" @mousedown="startResize('bottom')"></div>
        <div v-show="!isMinimized" class="resizer resizer-corner" @mousedown="startResize('corner')"></div>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ChatWidget",
  data() {
    return {
      isMinimized: false,
      usuario: null,
      isChatVisible: false,
      width: 500,
      height: 500,
      posX: window.innerWidth - 540,
      posY: 100,
      // mover
      isDragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      // redimensionar
      isResizing: false,
      currentDirection: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startLeft: 0,
    };
  },
   created() {
    this.syncUsuario();
    window.addEventListener("usuario-login", this.syncUsuario);
    window.addEventListener("usuario-logout", this.syncUsuario);

    // ← Aquí escuchas cambios desde otras pestañas
    window.addEventListener("storage", this.syncUsuario);

  },
 beforeUnmount() {
  window.removeEventListener("storage", this.syncUsuario);
  window.removeEventListener("usuario-logout", this.syncUsuario);
  window.removeEventListener("usuario-login", this.syncUsuario);
},
  computed:{
    ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador','asesorSelectedPedido']),

  },
  methods: {
    resetChat() {
      this.width = 500;
      this.height = 500;
      this.posX = window.innerWidth - 540;
      this.posY = 100;
      this.isMinimized = false;
    },
    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
    },
    maximizeChat() {
      this.width = 800;
      this.height = 600; // o lo que quieras
      this.isMinimized = false;
    },
     syncUsuario() {
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      // console.log("Usuario sincronizado:", this.usuario);
    },
    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
      if (this.isChatVisible) this.$vs.loading();
    },
    onIframeLoad() {
      this.$vs.loading.close();
    },

    // --- MOVER CHAT ---
    startDrag(event) {
      this.isDragging = true;
      const el = this.$refs.chatWindow;
      this.dragOffsetX = event.clientX - el.getBoundingClientRect().left;
      this.dragOffsetY = event.clientY - el.getBoundingClientRect().top;

      document.addEventListener("mousemove", this.doDrag);
      document.addEventListener("mouseup", this.stopDrag);
    },
    startTouch(event) {
      if (!event.touches.length) return;
      this.isDragging = true;
      const touch = event.touches[0];
      const el = this.$refs.chatWindow;
      this.dragOffsetX = touch.clientX - el.getBoundingClientRect().left;
      this.dragOffsetY = touch.clientY - el.getBoundingClientRect().top;

      document.addEventListener("touchmove", this.doTouchMove);
      document.addEventListener("touchend", this.stopTouch);
    },
    doTouchMove(event) {
      if (!this.isDragging || !event.touches.length) return;
      const touch = event.touches[0];
      this.posX = touch.clientX - this.dragOffsetX;
      this.posY = touch.clientY - this.dragOffsetY;
    },
    stopTouch() {
      this.isDragging = false;
      document.removeEventListener("touchmove", this.doTouchMove);
      document.removeEventListener("touchend", this.stopTouch);
    },
    doDrag(event) {
      if (!this.isDragging) return;
      this.posX = event.clientX - this.dragOffsetX;
      this.posY = event.clientY - this.dragOffsetY;
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.doDrag);
      document.removeEventListener("mouseup", this.stopDrag);
    },

    // --- REDIMENSIONAR CHAT ---
    startResize(direction) {
      this.isResizing = true;
      this.currentDirection = direction;
      const el = this.$refs.chatWindow;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.startWidth = el.offsetWidth;
      this.startHeight = el.offsetHeight;
      this.startLeft = el.getBoundingClientRect().left;

      document.addEventListener("mousemove", this.doResize);
      document.addEventListener("mouseup", this.stopResize);
    },
    doResize(event) {
      if (!this.isResizing) return;
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;

      if (this.currentDirection === "right" || this.currentDirection === "corner") {
        this.width = Math.max(300, this.startWidth + dx);
      }
      if (this.currentDirection === "bottom" || this.currentDirection === "corner") {
        this.height = Math.max(300, this.startHeight + dy);
      }
      if (this.currentDirection === "left") {
        this.width = Math.max(300, this.startWidth - dx);
        this.posX = this.startLeft + dx;
      }
    },
    stopResize() {
      this.isResizing = false;
      document.removeEventListener("mousemove", this.doResize);
      document.removeEventListener("mouseup", this.stopResize);
    },
  },
};
</script>

<style scoped>

.chat-container {
  position: relative;
}

.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1100;
}

.chat-content {
  position: fixed;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 12px;
  z-index: 1100;
  box-sizing: border-box;
  overflow: hidden;
}

/* Título con botones */
.chat-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  cursor: move;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
  position: relative;
}

/* Botones de minimizar, maximizar y cerrar */
.chat-buttons {
  display: flex;
  gap: 8px;
}

.chat-buttons button {
  background: transparent;
  border: none;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  user-select: none;
}

.chat-buttons button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Botón de cerrar (X) */
.btn-close-chat {
  transform: scale(1.5);
  line-height: 1;
  margin-left: 10px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: #000;
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}


.btn-close-chat:hover {
  color: #c43a3a;
  background-color: rgba(255, 0, 0, 0.1);
}

/* Iframe del chat */
.chat-iframe {
  width: 100%;
  height: calc(100% - 30px);
  border: none;
}

/* Transición de aparición/desaparición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Controles de redimensionar */
.resizer {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resizer-right {
  width: 10px;
  top: 0;
  right: 0;
  height: 100%;
  cursor: ew-resize;
}

.resizer-left {
  width: 10px;
  top: 0;
  left: 0;
  height: 100%;
  cursor: ew-resize;
}

.resizer-bottom {
  height: 10px;
  bottom: 0;
  left: 0;
  width: 100%;
  cursor: ns-resize;
}

.resizer-corner {
  width: 15px;
  height: 15px;
  bottom: 0;
  right: 0;
  position: absolute;
  cursor: nwse-resize;
}
/*media querys */
@media (max-width: 768px) {
  .chat-content {
    width: 95% !important;
    height: 80% !important;
    left: 2.5% !important;
    top: 10% !important;
    border-radius: 8px;
  }

  .chat-toggle-btn {
    bottom: 10px;
    right: 10px;
    transform: scale(0.9);
  }

  .chat-title {
    font-size: 14px;
    padding-right: 8px;
  }

  .chat-buttons {
    gap: 0;
  }

  .chat-buttons button {
    font-size: 16px;
    padding: 2px 6px;
  }

  .chat-buttons button:not(.btn-close-chat) {
    display: none !important;
  }

  .btn-close-chat {
    transform: scale(1.3);
    margin-left: 0 !important;
  }
}


</style>
