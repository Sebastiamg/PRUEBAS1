<template>
  <div class="th-index-root">
    <!-- Mostrar login si no hay sesión (ocupa toda la pantalla, el Login ya tiene su propio fondo) -->
    <transition name="fade-slide" mode="out-in">
      <LoginPlanificaciones
        v-if="!usuarioLogueado"
        key="login"
        @login-success="handleLoginSuccess"
        @logout="handleLogout"
      />

      <!-- Mostrar la vista principal si hay sesión, dentro de un wrapper elegante -->
      <div v-else key="main" class="th-main-wrapper">
        <!-- Fondo degradado sutil -->
        <div class="th-bg-gradient"></div>

        <!-- Card contenedor principal -->
        <div class="th-main-card">
          <!-- Header superior con info del usuario y botón de salida -->
          <div class="th-topbar">
            <div class="th-topbar-brand">
              <div class="th-brand-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span class="th-brand-label">Reportes</span>
            </div>

            <div class="th-topbar-user" v-if="usuario">
              <div class="th-user-avatar">
                {{ getInitials(usuario) }}
              </div>
              <div class="th-user-info">
                <span class="th-user-name">{{ getNombreUsuario(usuario) }}</span>
                <span class="th-user-role">{{ usuario.jefe_departamento == '1' ? 'Jefe de Área' : 'Usuario Prolipa' }}</span>
              </div>
              <!-- Botón Salir en el topbar -->
              <button @click="cerrarSesion" class="th-btn-salir" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="th-btn-salir-label">Salir</span>
              </button>
            </div>
          </div>

          <!-- Divisor -->
          <div class="th-divider"></div>

          <!-- Contenido principal (screen_reportesth sin su propio wrapper) -->
          <div class="th-content">
            <screen_reportesth
              :usuarioExterno="usuario"
              @logout="cerrarSesion"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import LoginPlanificaciones from './Login_TalentoHumano.vue'
import screen_reportesth from '../talento_humano/screen_reportesth.vue'

export default {
  name: 'IndexTalentoHumano',
  components: {
    LoginPlanificaciones,
    screen_reportesth
  },
  data() {
    return {
      usuario: null,
      usuarioLogueado: false
    }
  },
  created() {
    // Eliminado porque ahora se controla por ruta
    this.verificarSesion()
  },


  methods: {
    verificarSesion() {
      // Eliminado porque ahora se controla por ruta

      const userProlipa = localStorage.getItem('userProlipa')
      if (userProlipa) {
        try {
          this.usuario = JSON.parse(userProlipa)
          this.usuarioLogueado = true
        } catch (error) {
          console.error('Error al parsear usuario:', error)
          localStorage.removeItem('userProlipa')
        }
      }
    },

    handleLoginSuccess(usuario) {
      this.usuario = usuario
      this.usuarioLogueado = true
    },

    handleLogout() {
      this.cerrarSesion()
    },

    cerrarSesion() {
      this.usuario = null
      this.usuarioLogueado = false
      localStorage.removeItem('userProlipa')
      localStorage.removeItem('talento_humano_menus')
      this.$vs.notify({
        text: 'Sesión cerrada correctamente',
        color: 'success',
        time: 3000,
        iconPack: 'feather',
        icon: 'icon-check'
      })
    },

    getInitials(usuario) {
      if (!usuario) return '?'
      const nombres = usuario.nombres || ''
      const apellidos = usuario.apellidos || ''
      return ((nombres[0] || '') + (apellidos[0] || '')).toUpperCase() || '?'
    },

    getNombreUsuario(usuario) {
      if (!usuario) return ''
      const n = usuario.nombres || ''
      const a = usuario.apellidos || ''
      return (n + ' ' + a).trim()
    },
  }
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────── */
.th-index-root {
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ── Transición entre login y pantalla principal ──── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-slide-enter {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Wrapper pantalla principal ───────────────────── */
.th-main-wrapper {
  min-height: 100vh;
  height: 100vh;
  position: relative;
  background: #f0f4f8;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* Fondo con gradiente sutil */
.th-bg-gradient {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 40%, #eef2f7 100%);
  z-index: 0;
  pointer-events: none;
}

/* ── Card principal ───────────────────────────────── */
.th-main-card {
  position: relative;
  z-index: 1;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ── Topbar ───────────────────────────────────────── */
.th-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
}

.th-topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.th-brand-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.th-brand-icon svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.th-brand-label {
  font-weight: 700;
  font-size: 1.1rem;
  color: #ffffff;
  letter-spacing: -0.01em;
}

/* Usuario en topbar */
.th-topbar-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.th-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.th-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.th-user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.th-user-role {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.75rem;
  font-weight: 500;
}

/* ── Divisor ──────────────────────────────────────── */
.th-divider {
  height: 1px;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 100%);
}

/* ── Contenido ────────────────────────────────────── */
.th-content {
  padding: 20px 24px 28px;
  position: relative;
  flex: 1;
  overflow-y: auto;
}

/* ── Botón Salir en topbar ───────────────────────── */
.th-btn-salir {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-left: 12px;
  flex-shrink: 0;
}

.th-btn-salir svg {
  width: 17px;
  height: 17px;
  transition: transform 0.25s ease;
}

.th-btn-salir:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  transform: translateY(-1px);
}

.th-btn-salir:hover svg {
  transform: translateX(3px);
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 640px) {
  .th-topbar {
    padding: 14px 16px;
  }

  .th-btn-salir-label {
    display: none;
  }

  .th-btn-salir {
    padding: 8px;
    border-radius: 50%;
    margin-left: 8px;
  }

  .th-user-name {
    max-width: 120px;
  }

  .th-content {
    padding: 16px 12px 20px;
  }
}
</style>
