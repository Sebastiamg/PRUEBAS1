<template>
  <div>
    <vx-card title="Análisis de Reportes de Evaluación" title-color="primary" class="mb-base" subtitle="Generación de reportes detallados por áreas, asignaturas y desempeño docente">
      <div class="filter-section">
        <div class="vx-row">
          <div class="vx-col w-full mb-4">
            <label class="form-label">Período de Evaluación</label>
            <div class="input-wrapper">
              <v-select 
                :options="arregloPeriodos" 
                :reduce="arregloPeriodos => arregloPeriodos.id" 
                label="nombre" 
                class="select-custom" 
                v-model="periodoSelect"
                placeholder="Seleccione un período"
              />
            </div>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full mb-4">
            <label class="form-label">Institución</label>
            <div class="input-wrapper">
              <v-select 
                :options="arregloInstituciones" 
                :reduce="arregloInstituciones => arregloInstituciones" 
                label="institucion_ciudad" 
                class="select-custom"
                v-model="institucion_selected"
                placeholder="Seleccione una institución"
              />
            </div>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full flex justify-end">
            <vs-button 
              @click="buscarReporte()" 
              class="btn-generate w-full sm:w-1/4" 
              color="primary" 
              type="filled"
              icon="search"
            >
              Buscar
            </vs-button>
          </div>
        </div>
      </div>
      <!--REPORTE DE ÁREAS-->
      <div class="report-container" style="margin-top: 20px;">
        <ReporteAreaSalleVue 
          :institucion_selected="institucion_selected" 
          :periodoSelect="periodoSelect" 
          :searchReporte="searchReporte"
        />
      </div>
    </vx-card>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import ReporteAreaSalleVue from '@/views/salle/administrador/evaluaciones/components/reporte/detalle/ReporteAreaSalle'
export default{
  data(){
    return{
      periodoSelect:'',
      institucion_selected:'',
      searchReporte:false,
    }
  },
  props:{
    arregloPeriodos:{
      type:Array,
      default:[]
    },
    arregloInstituciones:{
      type:Array,
      default:[]
    },
  },
  components:{
    'v-select': vSelect,
    ReporteAreaSalleVue,
  },
  mounted(){
    let me = this;
    setTimeout(function() {
      if(me.arregloPeriodos.length > 0){
        me.periodoSelect = parseInt(localStorage.EvaluacionSelectSalle)
      }
    }, 2000);
  },
  methods:{
    buscarReporte(){
      let me = this;
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        me.$vs.notify({
        text:'Seleccione un período evaluación por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.institucion_selected == null || me.institucion_selected == "" || me.institucion_selected == undefined){
        me.$vs.notify({
        text:'Seleccione una institución por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.searchReporte =  !me.searchReporte
    },
  }
}
</script>
<style scoped>
/* Sección de filtros - diseño profesional y limpio */
.filter-section {
  background: #ffffff;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* Labels de formulario */
.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #2d3748;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Wrapper de inputs */
.input-wrapper {
  position: relative;
}

/* Selects personalizados - estilos simples */
.select-custom >>> .vs__dropdown-toggle {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-height: 42px;
  background: #ffffff;
}

.select-custom >>> .vs__dropdown-toggle:focus-within {
  border-color: #3b82f6;
  outline: none;
}

.select-custom >>> .vs__selected {
  color: #374151;
  font-weight: 500;
  font-size: 12px;
}

.select-custom >>> .vs__dropdown-menu {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Botón principal */
.btn-generate {
  width: 100%;
  min-height: 38px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn-generate:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Contenedor de reportes */
.report-container {
  margin-top: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-section {
    padding: 12px;
  }
  
  .form-label {
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .btn-generate {
    margin-top: 12px;
    font-size: 12px;
  }
}
</style>
