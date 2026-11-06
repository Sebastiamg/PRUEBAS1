<template>
  <!-- Toast Container - Fuera del dashboard para máxima prioridad -->
  <div>
    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.tipo"
      >
        <span class="toast-icon">
          {{ toast.tipo === 'success' ? '✓' : toast.tipo === 'warning' ? '⚠' : '✕' }}
        </span>
        <div class="toast-content">
          <p class="toast-message">{{ toast.mensaje }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-user animate-fade-in">
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <aside v-if="!['evaluacion', 'responder-encuesta', 'resultados'].includes(vistaActual)" class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <img src="@/assets/images/capacitaciones/logo prolipa B.png" alt="Prolipa" class="brand-logo" />
        <button @click="closeSidebar" class="btn-close-sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-menu">
        <a 
          href="#" 
          class="menu-item" 
          :class="{ 'active': vistaActual === 'lista' }"
          @click.prevent="irACapacitaciones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Mis Capacitaciones
        </a>
        <a 
          href="#" 
          class="menu-item" 
          :class="{ 'active': vistaActual === 'certificados' }"
          @click.prevent="irACertificados"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Mis Certificados
        </a>
        <a
          href="#"
          class="menu-item"
          :class="{ 'active': vistaActual === 'encuestas' || vistaActual === 'responder-encuesta' }"
          @click.prevent="irAEncuestas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Encuestas
        </a>
      </nav>

      <div class="sidebar-footer">
        <button @click="cerrarSesion" class="btn-logout">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión 
        </button>
      </div>
    </aside>

    <main class="main-content" :class="{ 'fullscreen': ['evaluacion', 'responder-encuesta', 'resultados'].includes(vistaActual) }">
      <header v-if="!['evaluacion', 'responder-encuesta', 'resultados'].includes(vistaActual)" class="top-bar">
        <button @click="toggleSidebar" class="btn-hamburger">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button @click="refrescarVista" class="btn-refresh" title="Actualizar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <div class="user-info" v-if="colaborador">
          <div class="avatar">{{ colaborador.nombres.charAt(0) }}{{ colaborador.apellidos.charAt(0) }}</div>
          <div class="user-text">
            <span class="user-name">{{ colaborador.nombres }} {{ colaborador.apellidos }}</span>
            <span class="user-role">Colaborador Institucional</span>
          </div>
        </div>
      </header>

      <section class="workspace">
        <!-- Lista de capacitaciones -->
        <UserListaCapacitaciones 
          v-if="vistaActual === 'lista' && colaborador"
          :key="'lista-' + componentKey"
          :idusuario="colaborador.idusuario"
          @ver-detalles="verDetalles"
          @continuar-evaluacion="continuarEvaluacion"
          @ver-resultados="verResultadosDeCapacitacion"
          @ver-certificado="verCertificado"
        />

        <!-- Mis Certificados -->
        <MisCertificados
          v-if="vistaActual === 'certificados' && colaborador"
          :key="'certificados-' + componentKey"
          :idusuario="colaborador.idusuario"
          @ver-resultados="verResultados"
          @ir-a-capacitaciones="irACapacitaciones"
          @show-toast="mostrarToast"
        />

        <!-- Ver detalles de capacitación -->
        <VerCapacitacion
          v-if="vistaActual === 'detalles' && capacitacionSeleccionada"
          :capacitacion-id="capacitacionSeleccionada.id"
          :idusuario="colaborador.idusuario"
          @volver="volverALista"
          @iniciar-evaluacion="iniciarEvaluacion"
        />

        <!-- Realizar evaluación -->
        <RealizarEvaluacion
          v-if="vistaActual === 'evaluacion' && intentoActualId"
          :intento-id="intentoActualId"
          :idusuario="colaborador.idusuario"
          @volver="volverALista"
          @evaluacion-finalizada="mostrarResultados"
        />

        <!-- Ver resultados -->
        <ResultadosEvaluacion
          v-if="vistaActual === 'resultados' && intentoActualId"
          :intento-id="intentoActualId"
          :idusuario="colaborador.idusuario"
          @volver="volverALista"
          @volver-a-capacitacion="volverACapacitacion"
        />

        <!-- Lista de encuestas -->
        <UserListaEncuestas
          v-if="vistaActual === 'encuestas' && colaborador"
          :key="'encuestas-' + componentKey"
          :idusuario="colaborador.idusuario"
          @responder-encuesta="abrirEncuesta"
          @show-toast="mostrarToast"
        />

        <!-- Responder encuesta -->
        <ResponderEncuesta
          v-if="vistaActual === 'responder-encuesta' && encuestaSeleccionada"
          :encuesta-id="encuestaSeleccionada.id"
          :idusuario="colaborador.idusuario"
          @volver="irAEncuestas"
          @encuesta-respondida="encuestaRespondida"
          @show-toast="mostrarToast"
        />
      </section>
    </main>
  </div>
  </div>
</template>

<script>
import UserListaCapacitaciones from './UserListaCapacitaciones.vue';
import VerCapacitacion from './VerCapacitacion.vue';
import RealizarEvaluacion from './RealizarEvaluacion.vue';
import ResultadosEvaluacion from './ResultadosEvaluacion.vue';
import MisCertificados from './MisCertificados.vue';
import UserListaEncuestas from './UserListaEncuestas.vue';
import ResponderEncuesta from './ResponderEncuesta.vue';

export default {
  name: 'UserDashboard',
  components: {
    UserListaCapacitaciones,
    VerCapacitacion,
    RealizarEvaluacion,
    ResultadosEvaluacion,
    MisCertificados,
    UserListaEncuestas,
    ResponderEncuesta
  },
  data() {
    return {
      colaborador: null,
      sidebarOpen: false,
      vistaActual: 'lista', // 'lista', 'detalles', 'evaluacion', 'resultados', 'encuestas', 'responder-encuesta'
      capacitacionSeleccionada: null,
      intentoActualId: null,
      encuestaSeleccionada: null,
      toasts: [],
      componentKey: 0
    };
  },
  mounted() {
    this.validarSesionColaborador();
    
    // Restaurar vista actual después del refresh (como en AdminScreen)
    const vistaGuardada = localStorage.getItem('user_vista_actual');
    const intentoGuardado = localStorage.getItem('user_intento_actual');
    const capacitacionGuardada = localStorage.getItem('user_capacitacion_seleccionada');
    const encuestaGuardada = localStorage.getItem('user_encuesta_seleccionada');
    
    if (vistaGuardada) {
      this.vistaActual = vistaGuardada;
    }
    
    if (intentoGuardado) {
      this.intentoActualId = parseInt(intentoGuardado);
    }
    
    if (capacitacionGuardada) {
      this.capacitacionSeleccionada = { id: parseInt(capacitacionGuardada) };
    }

    if (encuestaGuardada) {
      this.encuestaSeleccionada = { id: parseInt(encuestaGuardada) };
    }
  },
  methods: {
    validarSesionColaborador() {
      const userCapacitaciones = localStorage.getItem("userCapacitaciones");

      if (!userCapacitaciones) {
        this.forzarRedireccionLogin();
        return;
      }

      try {
        const usuarioParsed = JSON.parse(userCapacitaciones);

        if (usuarioParsed && usuarioParsed.cedula && usuarioParsed.idusuario) {
          this.colaborador = usuarioParsed;
        } else {
          this.forzarRedireccionLogin();
        }
      } catch (error) {
        this.forzarRedireccionLogin();
      }
    },
    cerrarSesion() {
      this.forzarRedireccionLogin();
    },
    forzarRedireccionLogin() {
      localStorage.removeItem('userCapacitaciones');
      this.$router.push({ name: 'capacitaciones_prolipa_login' }).catch(() => {});
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      // Bloquear scroll del body cuando sidebar está abierto en móvil
      if (this.sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    refrescarVista() {
      // Forzar recarga incrementando la key del componente
      this.componentKey += 1;
      this.mostrarToast({ mensaje: 'Vista actualizada', tipo: 'success' });
    },
    closeSidebar() {
      this.sidebarOpen = false;
      // Restaurar scroll del body
      document.body.style.overflow = '';
    },
    verDetalles(capacitacion) {
      this.capacitacionSeleccionada = capacitacion;
      this.vistaActual = 'detalles';
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'detalles');
      localStorage.setItem('user_capacitacion_seleccionada', capacitacion.id);
    },
    continuarEvaluacion(capacitacion) {
      // Si tiene intento en progreso, usar ese ID
      if (capacitacion.tiene_intento_en_progreso && capacitacion.intento_en_progreso) {
        this.intentoActualId = capacitacion.intento_en_progreso.id;
        this.capacitacionSeleccionada = capacitacion;
        this.vistaActual = 'evaluacion';
        // Guardar en localStorage
        localStorage.setItem('user_vista_actual', 'evaluacion');
        localStorage.setItem('user_intento_actual', capacitacion.intento_en_progreso.id);
        localStorage.setItem('user_capacitacion_seleccionada', capacitacion.id);
      } else {
        alert('No tienes una evaluación en progreso');
      }
    },
    verResultados(intentoId) {
      this.intentoActualId = intentoId;
      this.vistaActual = 'resultados';
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'resultados');
      localStorage.setItem('user_intento_actual', intentoId);
    },
    async verResultadosDeCapacitacion(capacitacionId) {
      // Obtener el último intento completado de esta capacitación
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/mis-intentos`,
          {
            params: {
              idusuario: this.colaborador.idusuario,
              capacitacion_id: capacitacionId
            }
          }
        );
        
        if (response.data.success && response.data.data.length > 0) {
          // Tomar el último intento completado
          const intentoCompletado = response.data.data.find(i => i.estado === 'completado');
          if (intentoCompletado) {
            this.intentoActualId = intentoCompletado.id;
            this.vistaActual = 'resultados';
            // Guardar en localStorage
            localStorage.setItem('user_vista_actual', 'resultados');
            localStorage.setItem('user_intento_actual', intentoCompletado.id);
          } else {
            alert('No tienes intentos completados para esta capacitación');
          }
        } else {
          alert('No se encontraron intentos para esta capacitación');
        }
      } catch (error) {
        alert('Error al obtener resultados');
      }
    },
    async verCertificado(capacitacionId) {
      // Obtener el certificado de esta capacitación
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/mis-certificados`,
          {
            params: { idusuario: this.colaborador.idusuario }
          }
        );
        
        if (response.data.success && response.data.data.length > 0) {
          // Buscar el certificado de esta capacitación
          const certificado = response.data.data.find(c => c.capacitacion && c.capacitacion.id === capacitacionId);
          
          if (certificado) {
            // Descargar el certificado
            const downloadResponse = await this.$http.get(
              `${this.$server_url}capacitaciones_prolipa/usuario/certificados/${certificado.id}/descargar`,
              {
                responseType: 'blob'
              }
            );
            
            // Crear blob y descargar
            const blob = new Blob([downloadResponse.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificado_${certificado.codigo_certificado}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            alert('No se encontró el certificado para esta capacitación');
          }
        } else {
          alert('No tienes certificados disponibles');
        }
      } catch (error) {
        alert('Error al descargar el certificado');
      }
    },
    irACapacitaciones() {
      this.vistaActual = 'lista';
      this.capacitacionSeleccionada = null;
      this.intentoActualId = null;
      this.closeSidebar();
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'lista');
      localStorage.removeItem('user_intento_actual');
      localStorage.removeItem('user_capacitacion_seleccionada');
    },
    irACertificados() {
      this.vistaActual = 'certificados';
      this.capacitacionSeleccionada = null;
      this.intentoActualId = null;
      this.closeSidebar();
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'certificados');
      localStorage.removeItem('user_intento_actual');
      localStorage.removeItem('user_capacitacion_seleccionada');
    },
    irAEncuestas() {
      this.vistaActual = 'encuestas';
      this.encuestaSeleccionada = null;
      this.closeSidebar();
      localStorage.setItem('user_vista_actual', 'encuestas');
      localStorage.removeItem('user_encuesta_seleccionada');
    },
    abrirEncuesta(encuesta) {
      this.encuestaSeleccionada = encuesta;
      this.vistaActual = 'responder-encuesta';
      localStorage.setItem('user_vista_actual', 'responder-encuesta');
      localStorage.setItem('user_encuesta_seleccionada', encuesta.id);
    },
    encuestaRespondida() {
      this.mostrarToast({ mensaje: '¡Gracias por completar la encuesta!', tipo: 'success' });
      this.irAEncuestas();
    },
    mostrarToast({ mensaje, tipo }) {
      const id = Date.now();
      this.toasts.push({ id, mensaje, tipo });

      setTimeout(() => {
        this.toasts = this.toasts.filter(toast => toast.id !== id);
      }, 4000);
    },
    volverALista() {
      this.vistaActual = 'lista';
      this.capacitacionSeleccionada = null;
      this.intentoActualId = null;
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'lista');
      localStorage.removeItem('user_intento_actual');
      localStorage.removeItem('user_capacitacion_seleccionada');
    },
    iniciarEvaluacion(intentoId) {
      this.intentoActualId = intentoId;
      this.vistaActual = 'evaluacion';
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'evaluacion');
      localStorage.setItem('user_intento_actual', intentoId);
    },
    mostrarResultados(data) {
      this.intentoActualId = data.intento.id;
      this.vistaActual = 'resultados';
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'resultados');
      localStorage.setItem('user_intento_actual', data.intento.id);
    },
    volverACapacitacion(capacitacionId) {
      this.capacitacionSeleccionada = { id: capacitacionId };
      this.vistaActual = 'detalles';
      // Guardar en localStorage
      localStorage.setItem('user_vista_actual', 'detalles');
      localStorage.setItem('user_capacitacion_seleccionada', capacitacionId);
    }
  }
};
</script>

<style scoped>
/* -----------------------------------------
   SISTEMA DE TOASTS FLOTANTES
-------------------------------------------- */
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.toast.success {
  background-color: #064e3b;
  border-left: 4px solid #10b981;
}

.toast.error {
  background-color: #7f1d1d;
  border-left: 4px solid #ef4444;
}

.toast.warning {
  background-color: #78350f;
  border-left: 4px solid #f59e0b;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  text-align: left;
}

.toast-message {
  margin: 0;
  line-height: 1.4;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* -----------------------------------------
   DISEÑO ESTRUCTURAL (Idéntico al Admin para consistencia de marca)
-------------------------------------------- */
.dashboard-user {
  display: flex;
  min-height: 100vh;
  background-color: #0b0f19;
  color: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  min-width: 260px;
  max-width: 260px;
  background-color: #0f172a;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed; /* Fija la barra lateral */
  top: 0;
  left: 0;
  z-index: 100;
  transition: transform 0.3s ease;
  overflow-y: auto; /* Permitir scroll interno si el contenido es largo */
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-close-sidebar {
  display: none;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-close-sidebar:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.btn-close-sidebar svg {
  width: 20px;
  height: 20px;
}

.sidebar-overlay {
  display: none;
}

.btn-hamburger {
  display: none;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-hamburger:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-hamburger svg {
  width: 24px;
  height: 24px;
}

.btn-refresh {
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #60a5fa;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: auto;
}

.btn-refresh:hover {
  background-color: rgba(96, 165, 250, 0.2);
  transform: rotate(180deg);
}

.btn-refresh svg {
  width: 20px;
  height: 20px;
}

.brand-logo {
  max-width: 160px;
  max-height: 50px;
  height: auto;
  object-fit: contain;
}

.sidebar-menu {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Hover y estado activo con colores de la plataforma */
.menu-item:hover {
  color: #ffffff;
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
}

.menu-item.active {
  color: #ffffff;
  background-color: rgba(59, 130, 246, 0.15);
  border-left: 3px solid #3b82f6;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background-color: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fda4af;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: rgba(244, 63, 94, 0.15);
}

/* Contenido Principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 260px; /* Compensar el ancho del sidebar fijo */
  height: 100vh; /* Altura completa del viewport */
  overflow-y: auto; /* Scroll independiente */
  transition: margin-left 0.3s ease;
}

.main-content.fullscreen {
  margin-left: 0;
  width: 100vw;
}

.top-bar {
  min-height: 70px;
  background-color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #ffffff;
  flex-shrink: 0;
}

.user-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* Área de Trabajo */
.workspace {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.welcome-banner {
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 16px;
  text-align: left;
  margin-bottom: 24px;
}

.welcome-banner h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
}

.welcome-banner p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Tarjetas */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.card {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 16px;
  text-align: left;
}

.card h3 {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  word-break: break-word;
}

.icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* RESPONSIVE STYLES */
@media (max-width: 1024px) {
  .workspace {
    padding: 16px;
  }

  .welcome-banner h2 {
    font-size: 1.35rem;
  }

  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .dashboard-user {
    flex-direction: column;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    transform: translateX(-100%);
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  }

  .main-content {
    margin-left: 0;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  .btn-close-sidebar {
    display: block;
  }

  .btn-hamburger {
    display: flex;
  }

  .sidebar-header {
    padding: 16px 20px;
  }

  .brand-text {
    font-size: 1.1rem;
  }

  .sidebar-menu {
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;
    padding: 16px;
    gap: 8px;
  }

  .menu-item {
    white-space: normal;
    flex-shrink: 1;
    padding: 12px;
    font-size: 0.9rem;
  }

  .menu-item .icon {
    width: 18px;
    height: 18px;
  }

  .sidebar-footer {
    display: flex;
    padding: 16px;
  }

  .btn-logout {
    display: flex;
    font-size: 0.9rem;
  }

  .btn-logout .icon {
    width: 18px;
    height: 18px;
  }

  .top-bar {
    padding: 12px 16px;
    min-height: 60px;
    justify-content: space-between;
  }

  .user-info {
    gap: 10px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }

  .user-name {
    font-size: 0.8rem;
  }

  .user-role {
    font-size: 0.7rem;
  }

  .workspace {
    padding: 16px;
  }

  .welcome-banner {
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .welcome-banner h2 {
    font-size: 1.25rem;
  }

  .welcome-banner p {
    font-size: 0.875rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card {
    padding: 16px;
    border-radius: 12px;
  }

  .info-value {
    font-size: 1.35rem;
  }

  .toast-container {
    top: 70px;
    right: 12px;
    left: 12px;
    max-width: none;
  }

  .toast {
    font-size: 0.85rem;
    padding: 12px 14px;
  }
}

@media (max-width: 480px) {
  .sidebar-header {
    padding: 12px 16px;
  }

  .brand-logo {
    max-width: 140px;
    max-height: 45px;
  }

  .sidebar-menu {
    padding: 10px 12px;
    gap: 6px;
  }

  .menu-item {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .top-bar {
    padding: 10px 12px;
  }

  .workspace {
    padding: 12px;
  }

  .welcome-banner {
    padding: 14px;
  }

  .welcome-banner h2 {
    font-size: 1.15rem;
  }

  .welcome-banner p {
    font-size: 0.8rem;
  }

  .card h3 {
    font-size: 0.75rem;
  }

  .info-value {
    font-size: 1.25rem;
  }

  .toast-container {
    top: 65px;
    right: 8px;
    left: 8px;
  }

  .toast {
    font-size: 0.8rem;
    padding: 10px 12px;
    gap: 10px;
  }

  .toast-icon {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }
}
</style>
