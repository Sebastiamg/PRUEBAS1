<template>
  <div class="salle-super" v-if="userRoot">
    <vx-card class="menu-card">
      <div class="menu-tabs">
        <!-- Tabs principales -->
        <button
          class="menu-tab"
          :class="{ active: activeTab === 'tipoInstitucion' }"
          @click="activeTab = 'tipoInstitucion'"
          type="button"
        >
          <feather-icon icon="GridIcon" class="mr-2" svgClasses="h-4 w-4" />
          tipo institución
        </button>
        <button
          class="menu-tab"
          :class="{ active: activeTab === 'periodos' }"
          @click="activeTab = 'periodos';getTiposInstitucion()"
          type="button"
        >
          <feather-icon icon="CalendarIcon" class="mr-2" svgClasses="h-4 w-4" />
          períodos evaluación
        </button>
        <button
          class="menu-tab"
          :class="{ active: activeTab === 'gestion' }"
          @click="activeTab = 'gestion'"
          type="button"
        >
          <feather-icon icon="BookOpenIcon" class="mr-2" svgClasses="h-4 w-4" />
          gestión evaluación docente
          <span v-if="!evaluacionSeleccionada" class="ml-2 badge-locked">🔒</span>
        </button>
      </div>
    </vx-card>

    <!-- Selector de Tipo de Institución y Evaluación -->
    <vx-card title="Seleccionar Contexto de Evaluación" class="selector-card" v-if="activeTab === 'gestion'">
      <div class="vx-row">
        <div class="vx-col w-full md:w-1/2 mb-4">
          <label class="vs-input--label block mb-2">Tipo de Institución:</label>
          <v-select
            v-model="tipoSeleccionado"
            :options="tiposInstitucion"
            :reduce="tipo => tipo.id"
            label="descripcion"
            placeholder="Seleccione un tipo de institución"
            @input="onTipoChange"
          >
            <template #option="option">
              <div class="d-center">
                {{ option.descripcion }}
                <span v-if="option.evaluaciones.length > 0" class="ml-2 badge-small">{{ option.evaluaciones.length }}</span>
              </div>
            </template>
          </v-select>
        </div>

        <div class="vx-col w-full md:w-1/2 mb-4">
          <label class="vs-input--label block mb-2">Período de Evaluación:</label>
          <v-select
            v-model="evaluacionSeleccionada"
            :options="evaluacionesDisponibles"
            :reduce="evaluacion => evaluacion.id"
            label="nombre"
            placeholder="Seleccione una evaluación"
            :disabled="!tipoSeleccionado"
            :clearable="true"
            @input="onEvaluacionChange"
          >
            <template #option="option">
              <div>
                {{ option.nombre }}
                <span v-if="option.estado == 1" class="ml-2 badge-active">Activo</span>
              </div>
            </template>
          </v-select>
        </div>
      </div>

      <vs-alert v-if="!evaluacionSeleccionada" color="warning" class="mt-2">
        Por favor, seleccione un tipo de institución y un período de evaluación para continuar.
      </vs-alert>

      <!-- Submenú de Gestión Solo si hay evaluación seleccionada -->
      <div v-if="evaluacionSeleccionada" class="submenu-gestion mt-4">
        <h5 class="mb-3">Módulos de Gestión:</h5>
        <div class="submenu-buttons">
          <button
            @click="subTab = 'usuarios'"
            class="submenu-btn btn-usuarios"
            :class="{ 'active': subTab === 'usuarios' }"
          >
            <feather-icon icon="UsersIcon" class="mr-2" svgClasses="h-4 w-4" />
            Usuarios
          </button>
          <button
            @click="subTab = 'areas'"
            class="submenu-btn btn-areas"
            :class="{ 'active': subTab === 'areas' }"
          >
            <feather-icon icon="LayersIcon" class="mr-2" svgClasses="h-4 w-4" />
            Áreas
          </button>
          <button
            @click="subTab = 'preguntas'"
            class="submenu-btn btn-preguntas"
            :class="{ 'active': subTab === 'preguntas' }"
          >
            <feather-icon icon="HelpCircleIcon" class="mr-2" svgClasses="h-4 w-4" />
            Preguntas
          </button>
          <button
            @click="subTab = 'instituciones'"
            class="submenu-btn btn-instituciones"
            :class="{ 'active': subTab === 'instituciones' }"
          >
            <feather-icon icon="HomeIcon" class="mr-2" svgClasses="h-4 w-4" />
            Instituciones
          </button>
          <button
            @click="subTab = 'reporte'"
            class="submenu-btn btn-reporte"
            :class="{ 'active': subTab === 'reporte' }"
          >
            <feather-icon icon="BarChartIcon" class="mr-2" svgClasses="h-4 w-4" />
            Reporte Evaluaciones
          </button>
        </div>
      </div>
    </vx-card>

    <!-- Contenido de las tabs normales (tipo institución y períodos) -->
    <div class="tab-content" v-if="activeTab !== 'gestion'">
      <component :is="activeComponent" :key="componentKey" />
    </div>

    <!-- Contenido de la tab de gestión (solo si hay evaluación seleccionada) -->
    <div class="tab-content" v-else-if="activeTab === 'gestion' && evaluacionSeleccionada">
      <component
        :is="activeComponent"
        :key="`${subTab}-${evaluacionSeleccionada}-${tipoSeleccionado}`"
        :evaluacion-id="evaluacionSeleccionada"
        :tipo-institucion-id="tipoSeleccionado"
      />
    </div>
  </div>
  <vx-card v-else>
    <vs-alert
      color="danger"
      title="Acceso Denegado" active="true">
      No tienes permisos para acceder a esta sección.
    </vs-alert>
  </vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select'

const PeriodosSalleVue    = () => import('@/views/salle/administrador/periodos/periodosSalle.vue')
const listaUsuariosVue    = () => import('@/views/salle/administrador/usuarios/listaUsuarios.vue')
const AreasComponentVue   = () => import('@/views/salle/administrador/evaluaciones/AreasComponent.vue')
const SallePreguntas      = () => import('@/views/salle/administrador/evaluaciones/PreguntasMenu.vue')
const SalleInstituciones  = () => import('@/views/salle/administrador/InstitucionesComponent.vue')
const SalleReporte        = () => import('@/views/salle/administrador/evaluaciones/Reporte_evaluaciones2.vue')
const tipoInstitucionVue  = () => import('@/views/institucion/components/tipoInstitucion/tipoInstitucion.vue')
const TAB_COMPONENTS = {
  tipoInstitucion: tipoInstitucionVue,
  periodos: PeriodosSalleVue,
  usuarios: listaUsuariosVue,
  areas: AreasComponentVue,
  preguntas: SallePreguntas,
  instituciones: SalleInstituciones,
  reporte: SalleReporte,
}

const STORAGE_KEY = 'salle_super_active_tab'
const STORAGE_SUBTAB_KEY = 'salle_super_active_subtab'

export default {
  name: 'ScreenSalleSuper',
  components: {
    tipoInstitucionVue,
    PeriodosSalleVue,
    listaUsuariosVue,
    AreasComponentVue,
    SallePreguntas,
    SalleInstituciones,
    SalleReporte,
    'v-select': vSelect,
  },
  data() {
    return {
      activeTab: 'periodos',
      subTab: 'usuarios',
      tiposInstitucion: [],
      tipoSeleccionado: null,
      evaluacionSeleccionada: null,
      componentKey: 0,
    }
  },
  computed: {
    ...mapState(['userRoot']),
    activeComponent() {
      if (this.activeTab === 'gestion') {
        return TAB_COMPONENTS[this.subTab] || listaUsuariosVue
      }
      return TAB_COMPONENTS[this.activeTab] || PeriodosSalleVue
    },
    evaluacionesDisponibles() {
      if (!this.tipoSeleccionado) return []
      const tipo = this.tiposInstitucion.find(t => t.id === this.tipoSeleccionado)
      return tipo ? tipo.evaluaciones : []
    },
  },
  watch: {
    activeTab(newTab) {
      localStorage.setItem(STORAGE_KEY, newTab)
    },
    evaluacionSeleccionada(newVal, oldVal) {
      if (newVal !== oldVal) {
        // Forzar re-render de todos los componentes
        this.componentKey += 1

        // Emitir evento global para que los componentes hijos se enteren
        this.$root.$emit('evaluacionChanged', {
          evaluacionId: newVal,
          tipoInstitucionId: this.tipoSeleccionado
        })
      }
    },
    subTab(newVal) {
      // Guardar el subtab seleccionado en localStorage
      localStorage.setItem(STORAGE_SUBTAB_KEY, newVal)
      // Incrementar key cuando cambia el subtab para forzar re-render
      this.componentKey += 1
    }
  },
  methods: {
    async getTiposInstitucion() {
      try {
        const response = await this.$http.get(
          this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion&todasPeriodosEvaluaciones=1'
        )
        if (response.data.status === 1) {
          this.tiposInstitucion = response.data.data

          // Restaurar selección si existe en localStorage
          const savedEval = localStorage.getItem('EvaluacionSelectSalle')
          if (savedEval) {
            this.evaluacionSeleccionada = parseInt(savedEval)
            // Encontrar el tipo de institución correspondiente
            for (const tipo of this.tiposInstitucion) {
              if (tipo.evaluaciones.some(e => e.id === this.evaluacionSeleccionada)) {
                this.tipoSeleccionado = tipo.id
                break
              }
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar tipos de institución:', error)
        this.$vs.notify({
          text: 'Error al cargar tipos de institución',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      }
    },

    onTipoChange() {
      this.evaluacionSeleccionada = null
      localStorage.removeItem('EvaluacionSelectSalle')
      localStorage.removeItem('Salletipo_institucion_id')
      localStorage.removeItem('EvaluacionSelectSalleNombre')
      this.subTab = 'usuarios'
    },

    onEvaluacionChange(evaluacionId) {
      if (evaluacionId) {
        localStorage.setItem('EvaluacionSelectSalle', evaluacionId)
        //encontrar en arrayPeriodos el periodo seleccionado para obtener su tipo_institucion_id
        const tipo = this.tiposInstitucion.find(t => t.id === this.tipoSeleccionado)
        const evaluacion = tipo.evaluaciones.find(e => e.id === evaluacionId)
        localStorage.setItem('Salletipo_institucion_id', evaluacion.tipo_institucion_id)
        localStorage.setItem('EvaluacionSelectSalleNombre', evaluacion.nombre)

        this.$vs.notify({
          text: 'Período de evaluación seleccionado',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        })

        // Forzar actualización del componente reactivo
        this.$nextTick(() => {
          this.componentKey += 1
          this.$forceUpdate()
        })
      } else {
        // Si se limpia la selección (evaluacionId es null)
        this.evaluacionSeleccionada = null
        localStorage.removeItem('EvaluacionSelectSalle')
        localStorage.removeItem('Salletipo_institucion_id')
        localStorage.removeItem('EvaluacionSelectSalleNombre')

        this.$vs.notify({
          text: 'Selección de evaluación eliminada',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      }
    },
  },

  mounted() {
    const savedTab = localStorage.getItem(STORAGE_KEY)
    const validTabs = ['tipoInstitucion', 'periodos', 'gestion']
    if (savedTab && validTabs.includes(savedTab)) {
      this.activeTab = savedTab
    }

    // Restaurar el subtab guardado
    const savedSubTab = localStorage.getItem(STORAGE_SUBTAB_KEY)
    const validSubTabs = ['usuarios', 'areas', 'preguntas', 'instituciones', 'reporte']
    if (savedSubTab && validSubTabs.includes(savedSubTab)) {
      this.subTab = savedSubTab
    }

    this.getTiposInstitucion()
  },
}
</script>

<style scoped>
.salle-super {
  padding: 16px;
}

.menu-card {
  margin-bottom: 24px;
}

.menu-tabs {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.menu-tab {
  display: inline-flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  background: #fafafa;
  color: #555;
  padding: 12px 28px;
  margin-right: 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.menu-tab:last-child {
  margin-right: 0;
}

.menu-tab:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.menu-tab.active {
  border-color: #1f6feb;
  background: #e8f0ff;
  color: #1f6feb;
  box-shadow: 0 2px 6px rgba(31, 111, 235, 0.2);
}



.menu-tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.badge-locked {
  font-size: 14px;
}

.submenu-gestion {
  border-top: 2px solid #e0e0e0;
  padding-top: 16px;
}

.submenu-gestion h5 {
  color: #2c3e50;
  font-weight: 600;
}

.submenu-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.submenu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #f5f5f5;
  color: #666;
  min-width: 140px;
}

.submenu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Botón Usuarios - Violeta */
.btn-usuarios.active {
  background: linear-gradient(118deg, #7367f0, #9e95f5);
  color: white;
  border-color: #7367f0;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.4);
}

.btn-usuarios:hover:not(.active) {
  background: rgba(115, 103, 240, 0.1);
  color: #7367f0;
  border-color: #7367f0;
}

/* Botón Áreas - Verde */
.btn-areas.active {
  background: linear-gradient(118deg, #28c76f, #48da89);
  color: white;
  border-color: #28c76f;
  box-shadow: 0 4px 12px rgba(40, 199, 111, 0.4);
}

.btn-areas:hover:not(.active) {
  background: rgba(40, 199, 111, 0.1);
  color: #28c76f;
  border-color: #28c76f;
}

/* Botón Preguntas - Naranja */
.btn-preguntas.active {
  background: linear-gradient(118deg, #ff9f43, #ffb976);
  color: white;
  border-color: #ff9f43;
  box-shadow: 0 4px 12px rgba(255, 159, 67, 0.4);
}

.btn-preguntas:hover:not(.active) {
  background: rgba(255, 159, 67, 0.1);
  color: #ff9f43;
  border-color: #ff9f43;
}

/* Botón Instituciones - Rojo */
.btn-instituciones.active {
  background: linear-gradient(118deg, #ea5455, #f08182);
  color: white;
  border-color: #ea5455;
  box-shadow: 0 4px 12px rgba(234, 84, 85, 0.4);
}

.btn-instituciones:hover:not(.active) {
  background: rgba(234, 84, 85, 0.1);
  color: #ea5455;
  border-color: #ea5455;
}

/* Botón Reporte - Cyan */
.btn-reporte.active {
  background: linear-gradient(118deg, #00cfe8, #41e2f8);
  color: white;
  border-color: #00cfe8;
  box-shadow: 0 4px 12px rgba(0, 207, 232, 0.4);
}

.btn-reporte:hover:not(.active) {
  background: rgba(0, 207, 232, 0.1);
  color: #00cfe8;
  border-color: #00cfe8;
}

.tab-content {
  width: 100%;
}

.selector-card {
  margin-bottom: 24px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.badge-small {
  display: inline-block;
  background: #1f6feb;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.badge-active {
  display: inline-block;
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
</style>
