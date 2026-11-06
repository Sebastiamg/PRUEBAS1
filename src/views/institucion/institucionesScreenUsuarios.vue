<template>
  <div>
    <!-- Menú de 3 Botones Personalizados -->
    <div class="custom-tab-menu">
      <button 
        @click="activeTab = 'usuarios'"
        :class="['tab-btn', { 'active': activeTab === 'usuarios' }]">
        <vs-icon icon="people" size="small" class="mr-2"></vs-icon>
        Usuarios
      </button>
      
      <button 
        @click="activeTab = 'asignaturas'"
        :class="['tab-btn', { 'active': activeTab === 'asignaturas' }]">
        <vs-icon icon="book" size="small" class="mr-2"></vs-icon>
        Asignaturas por docentes
      </button>
      
      <button 
        @click="activeTab = 'visitas'"
        :class="['tab-btn', { 'active': activeTab === 'visitas' }]">
        <vs-icon icon="visibility" size="small" class="mr-2"></vs-icon>
        Visitas
      </button>
    </div>

    <!-- Contenido Dinámico -->
    <div class="tab-content mt-4">
      <div v-if="activeTab === 'usuarios'">
        <institucionesUsuariosVue :institucionSelected="institucionSelected" />
      </div>
      
      <div v-if="activeTab === 'asignaturas'">
        <Asignaturas_x_docente_Vue :institucionSelected="institucionSelected" />
      </div>
      
      <div v-if="activeTab === 'visitas'">
        <visitasUsers :institucionSelected="institucionSelected" />
      </div>
    </div>
  </div>
</template>

<script>
import institucionesUsuariosVue from './institucionesUsuarios.vue'
const Asignaturas_x_docente_Vue = () => import('@/views/docentes/asignaturas_docente/asignaturas_x_docente.vue')
const visitasUsers = () => import('@/views/director/visitasUsers.vue')

export default {
  name: 'institucionesScreenUsuarios',
  components: {
    institucionesUsuariosVue,
    Asignaturas_x_docente_Vue,
    visitasUsers
  },
  props: {
    institucionSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'usuarios'
    }
  }
}
</script>

<style scoped>
.custom-tab-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid #dae1e7;
  background-color: transparent;
  color: #626262;
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.tab-btn:hover {
  background-color: #f6f6f6;
  color: #1e1e1e;
  border-color: #c2c2c2;
}

.tab-btn.active {
  background-color: #1e1e1e;
  color: #ffffff;
  border-color: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Margen derecho para el icono dentro del botón */
.mr-2 {
  margin-right: 8px;
}

.tab-content {
  transition: all 0.3s ease;
}
</style>