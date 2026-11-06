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
          {{ toast.tipo === 'success' ? '✓' : '✕' }}
        </span>
        <div class="toast-content">
          <p class="toast-message">{{ toast.mensaje }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-admin animate-fade-in">
      <!-- Contenedor principal con bordes redondeados -->
      <div class="main-container">
      <!-- Menú de navegación horizontal -->
      <div class="nav-tabs">
        <button
          class="tab-button"
          :class="{ active: vistaActual === 'dashboard' }"
          @click="selectView('dashboard')"
        >
          <Icon name="chart" />
          Dashboard
        </button>

        <button
          class="tab-button"
          :class="{ active: vistaActual === 'lista' }"
          @click="selectView('lista')"
        >
          <Icon name="list" />
          Gestionar Capacitaciones
        </button>

        <button
          class="tab-button"
          :class="{ active: vistaActual === 'crear' }"
          @click="selectView('crear')"
        >
          <Icon name="plus" />
          Crear Capacitación
        </button>

        <button
          class="tab-button"
          :class="{ active: vistaActual === 'colaboradores' }"
          @click="selectView('colaboradores')"
        >
          <Icon name="users" />
          Colaboradores
        </button>

        <button
          class="tab-button"
          :class="{ active: ['encuestas', 'crear-encuesta', 'analytics-encuesta', 'gestionar-encuesta', 'editar-encuesta'].includes(vistaActual) }"
          @click="selectView('encuestas')"
        >
          <Icon name="clipboard" />
          Encuestas
        </button>
      </div>

      <!-- Área de contenido -->
      <main class="workspace">
        <Dashboard v-if="vistaActual === 'dashboard'" @show-toast="handleToast" />

        <div v-else-if="vistaActual === 'lista'" class="animate-fade-in">
          <AdminListaCapacitaciones 
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @cambiar-vista="selectView"
            @ver-analytics="verAnalytics"
            @gestionar-capacitacion="gestionarCapacitacion"
            @gestionar-firmas="gestionarFirmas"
          />
        </div>

        <div v-else-if="vistaActual === 'gestionar'" class="animate-fade-in">
          <GestionarCapacitacion
            :capacitacionId="capacitacionSeleccionada"
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @cerrar="volverALista"
            @editar-contenido="editarContenidoCapacitacion"
          />
        </div>

        <div v-else-if="vistaActual === 'editar'" class="animate-fade-in">
          <EditarCapacitacion
            :capacitacionId="capacitacionSeleccionada"
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @cerrar="volverAGestionar"
            @actualizar-lista="cargarCapacitacionActual"
          />
        </div>

        <!-- Analytics -->
        <div v-else-if="vistaActual === 'analytics'" class="animate-fade-in">
          <AnalyticsCapacitacion
            :capacitacionId="capacitacionSeleccionada"
            @volver="volverALista"
            @show-toast="handleToast"
          />
        </div>

        <!-- Gestión de Firmas -->
        <div v-else-if="vistaActual === 'firmas'" class="animate-fade-in">
          <GestionFirmas
            :capacitacionId="capacitacionSeleccionada"
            @volver="volver"
            @show-toast="handleToast"
          />
        </div>

        <div v-else-if="vistaActual === 'crear'" class="animate-fade-in" key="crear-view">
          <FormularioCapacitacion 
            :key="`formulario-${formKey}`"
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
          />
        </div>

        <div v-else-if="vistaActual === 'colaboradores'" class="animate-fade-in">
          <Colaboradores @show-toast="handleToast" />
        </div>

        <!-- Encuestas -->
        <div v-else-if="vistaActual === 'encuestas'" class="animate-fade-in">
          <AdminListaEncuestas
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @cambiar-vista="selectView"
            @ver-analytics-encuesta="verAnalyticsEncuesta"
            @gestionar-encuesta="gestionarEncuesta"
          />
        </div>

        <div v-else-if="vistaActual === 'crear-encuesta'" class="animate-fade-in" key="crear-encuesta-view">
          <FormularioEncuesta
            :key="`formulario-encuesta-${formKey}`"
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @encuesta-creada="volverAEncuestas"
          />
        </div>

        <div v-else-if="vistaActual === 'gestionar-encuesta'" class="animate-fade-in">
          <GestionarEncuesta
            :encuestaId="encuestaSeleccionada"
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @cerrar="volverAEncuestas"
            @editar-contenido="editarContenidoEncuesta"
          />
        </div>

        <div v-else-if="vistaActual === 'editar-encuesta'" class="animate-fade-in">
          <EditarEncuesta
            :encuestaId="encuestaSeleccionada"
            :idusuario="admin ? admin.idusuario : null"
            @show-toast="handleToast"
            @cerrar="volverAGestionarEncuesta"
            @actualizar-lista="cargarEncuestaActual"
          />
        </div>

        <div v-else-if="vistaActual === 'analytics-encuesta'" class="animate-fade-in">
          <AnalyticsEncuesta
            :encuestaId="encuestaSeleccionada"
            @volver="volverAEncuestas"
            @show-toast="handleToast"
          />
        </div>
      </main>
    </div>
    </div>
  </div>
</template>

<script>
import Dashboard from './Dashboard.vue';
import FormularioCapacitacion from '../components/FormularioCapacitacion.vue';
import AdminListaCapacitaciones from './AdminListaCapacitaciones.vue';
import GestionarCapacitacion from '../components/GestionarCapacitacion.vue';
import EditarCapacitacion from '../components/EditarCapacitacion.vue';
import GestionFirmas from './GestionFirmas.vue';
import AnalyticsCapacitacion from './AnalyticsCapacitacion.vue';
import Colaboradores from './Colaboradores.vue';
import AdminListaEncuestas from '../encuestas/AdminListaEncuestas.vue';
import FormularioEncuesta from '../encuestas/FormularioEncuesta.vue';
import AnalyticsEncuesta from '../encuestas/AnalyticsEncuesta.vue';
import GestionarEncuesta from '../encuestas/GestionarEncuesta.vue';
import EditarEncuesta from '../encuestas/EditarEncuesta.vue';
import Icon from '../components/Icon.vue';

export default {
  name: 'AdminDashboard',
  components: {
    Dashboard,
    FormularioCapacitacion,
    AdminListaCapacitaciones,
    GestionarCapacitacion,
    EditarCapacitacion,
    GestionFirmas,
    AnalyticsCapacitacion,
    Colaboradores,
    AdminListaEncuestas,
    FormularioEncuesta,
    AnalyticsEncuesta,
    GestionarEncuesta,
    EditarEncuesta,
    Icon
  },
  data() {
    return {
      admin: null,
      vistaActual: 'dashboard',
      toasts: [],
      capacitacionSeleccionada: null,
      encuestaSeleccionada: null,
      formKey: 0
    };
  },
  mounted() {
    // Usar la sesión general de la plataforma
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      this.admin = JSON.parse(usuario);
    } else {
      // Si no hay sesión, redirigir al login general de la plataforma
      this.$router.push({ name: 'page-login' }).catch(() => {});
      return;
    }

    // Restaurar vista actual y capacitación seleccionada después del refresh
    const vistaGuardada = localStorage.getItem('admin_vista_actual');
    const capacitacionGuardada = localStorage.getItem('admin_capacitacion_seleccionada');
    
    if (vistaGuardada) {
      this.vistaActual = vistaGuardada;
    }
    
    if (capacitacionGuardada) {
      this.capacitacionSeleccionada = parseInt(capacitacionGuardada);
    }
  },
  methods: {
    handleToast({ mensaje, tipo }) {
      const id = Date.now();
      this.toasts.push({ id, mensaje, tipo });

      setTimeout(() => {
        this.toasts = this.toasts.filter(toast => toast.id !== id);
      }, 4000);
    },
    verAnalytics(id) {
      this.capacitacionSeleccionada = id;
      this.vistaActual = 'analytics';
      // Guardar en localStorage
      localStorage.setItem('admin_vista_actual', 'analytics');
      localStorage.setItem('admin_capacitacion_seleccionada', id);
    },
    gestionarCapacitacion(id) {
      this.capacitacionSeleccionada = id;
      this.vistaActual = 'gestionar';
      // Guardar en localStorage
      localStorage.setItem('admin_vista_actual', 'gestionar');
      localStorage.setItem('admin_capacitacion_seleccionada', id);
    },
    gestionarFirmas(id) {
      this.capacitacionSeleccionada = id;
      this.vistaActual = 'firmas';
      // Guardar en localStorage
      localStorage.setItem('admin_vista_actual', 'firmas');
      localStorage.setItem('admin_capacitacion_seleccionada', id);
    },
    volverALista() {
      this.capacitacionSeleccionada = null;
      this.vistaActual = 'lista';
      // Limpiar localStorage
      localStorage.removeItem('admin_capacitacion_seleccionada');
      localStorage.setItem('admin_vista_actual', 'lista');
    },
    editarContenidoCapacitacion(capacitacion) {
      this.capacitacionSeleccionada = capacitacion.id;
      this.vistaActual = 'editar';
      // Guardar en localStorage
      localStorage.setItem('admin_vista_actual', 'editar');
      localStorage.setItem('admin_capacitacion_seleccionada', capacitacion.id);
    },
    volverAGestionar() {
      this.vistaActual = 'gestionar';
      // Actualizar localStorage
      localStorage.setItem('admin_vista_actual', 'gestionar');
    },
    volver() {
      this.volverALista();
    },
    cargarCapacitacionActual() {
      // Recargar la capacitación actual (opcional)
      this.handleToast({ mensaje: 'Contenido actualizado', tipo: 'success' });
    },
    verAnalyticsEncuesta(id) {
      this.encuestaSeleccionada = id;
      this.vistaActual = 'analytics-encuesta';
      localStorage.setItem('admin_vista_actual', 'analytics-encuesta');
      localStorage.setItem('admin_encuesta_seleccionada', id);
    },
    gestionarEncuesta(id) {
      this.encuestaSeleccionada = id;
      this.vistaActual = 'gestionar-encuesta';
      localStorage.setItem('admin_vista_actual', 'gestionar-encuesta');
      localStorage.setItem('admin_encuesta_seleccionada', id);
    },
    editarContenidoEncuesta(encuesta) {
      this.encuestaSeleccionada = encuesta.id;
      this.vistaActual = 'editar-encuesta';
      localStorage.setItem('admin_vista_actual', 'editar-encuesta');
      localStorage.setItem('admin_encuesta_seleccionada', encuesta.id);
    },
    volverAGestionarEncuesta() {
      this.vistaActual = 'gestionar-encuesta';
      localStorage.setItem('admin_vista_actual', 'gestionar-encuesta');
    },
    cargarEncuestaActual() {
      this.handleToast({ mensaje: 'Contenido actualizado', tipo: 'success' });
    },
    volverAEncuestas() {
      this.encuestaSeleccionada = null;
      this.vistaActual = 'encuestas';
      localStorage.removeItem('admin_encuesta_seleccionada');
      localStorage.setItem('admin_vista_actual', 'encuestas');
    },
    cerrarSesion() {
      // No eliminar la sesión general, solo volver al home
      this.$router.push({ name: 'home' }).catch(() => {});
    },
    selectView(view) {
      this.vistaActual = view;
      // Guardar vista en localStorage
      localStorage.setItem('admin_vista_actual', view);
      // Si cambiamos de vista principal, limpiar capacitación seleccionada
      if (['dashboard', 'metricas', 'lista', 'crear', 'colaboradores', 'encuestas'].includes(view)) {
        this.capacitacionSeleccionada = null;
        localStorage.removeItem('admin_capacitacion_seleccionada');
      }
      // Si cambiamos de vista principal, limpiar encuesta seleccionada
      if (['dashboard', 'metricas', 'lista', 'crear', 'colaboradores', 'encuestas'].includes(view)) {
        this.encuestaSeleccionada = null;
        localStorage.removeItem('admin_encuesta_seleccionada');
      }
      // Incrementar formKey cuando se vuelve a la vista de crear
      if (view === 'crear' || view === 'crear-encuesta') {
        this.formKey++;
      }
    }
  }
};
</script>

<style scoped>
/* -----------------------------------------
   SISTEMA DE TOASTS FLOTANTES (ARRIBA A LA DERECHA)
-------------------------------------------- */
.toast-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 2147483647; /* Máximo z-index posible */
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
   DISEÑO BASE
-------------------------------------------- */
.dashboard-admin {
  padding: 20px;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

/* Contenedor principal con bordes redondeados */
.main-container {
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Menú de navegación horizontal (tabs) */
.nav-tabs {
  display: flex;
  gap: 8px;
  padding: 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.nav-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #3b82f6;
}

.tab-button.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(59, 130, 246, 0.3);
}

/* ÁREA DE TRABAJO */
.workspace {
  padding: 24px;
  background-color: #ffffff;
  min-height: 500px;
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

/* -----------------------------------------
   RESPONSIVE (MÓVIL)
-------------------------------------------- */
@media (max-width: 768px) {
  .dashboard-admin {
    padding: 12px;
  }

  .main-container {
    border-radius: 12px;
  }

  .nav-tabs {
    padding: 12px;
    gap: 6px;
  }

  .tab-button {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .workspace {
    padding: 16px;
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
  .dashboard-admin {
    padding: 8px;
  }

  .nav-tabs {
    padding: 8px;
  }

  .tab-button {
    padding: 6px 12px;
    font-size: 0.75rem;
    gap: 6px;
  }

  .workspace {
    padding: 12px;
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
