<template>
  <div>
    <div v-if="windowWidth < 992 && usuario.id_group == 12">
      <vs-dropdown vs-custom-content vs-trigger-click>
        <vs-button type="filled" class="a-icon">
          <p v-for="(item,key) in arregloPeriodos" :key="key">
            <span v-if="item.id == periodoSelect"><span class="ml-1">{{ item.nombre }}</span></span>
          </p>
          <vs-icon class="" icon="expand_more"></vs-icon>
        </vs-button>
        <vs-dropdown-menu class="loginx">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-dropdown-item style="width:200px; margin-top: 5px;" @click="periodoSelect = item.id;changeEvaluacionPeriodo();">
                <span class="feather icon icon-check"></span> {{ item.nombre }}
            </vs-dropdown-item>
          </div>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>
    <div v-if="windowWidth < 992 && usuario.id_group == 13">
      <vs-dropdown vs-custom-content vs-trigger-click>
        <vs-button type="filled" class="a-icon">
          <p v-for="(item,key) in arregloPeriodos" :key="key">
            <span v-if="item.id == periodoSelect"><span class="ml-1">{{ item.nombre }}</span></span>
          </p>
          <!-- <vs-icon class="" icon="expand_more"></vs-icon> -->
        </vs-button>
        <!-- <vs-dropdown-menu class="loginx">
          <div v-for="(item,key) in arregloPeriodos" :key="key">
            <vs-dropdown-item style="width:200px; margin-top: 5px;" @click="periodoSelect = item.id;changeEvaluacionPeriodo();">
                <span class="feather icon icon-check"></span> {{ item.nombre }}
            </vs-dropdown-item>
          </div>
        </vs-dropdown-menu> -->
      </vs-dropdown>
    </div>
    <div v-if="windowWidth >= 992">
      <div v-if="usuario.id_group == 13">
          <vx-card v-if="errorPeriodoEvaluacion == false">
            <p class="text-success font-bold"><ion-icon name="star-outline" style="position: relative;top:1px;"></ion-icon> Periodo Evaluación: {{ nombrePeriodoEvaluacion }}</p>
          </vx-card>
          <vs-alert active="true" color="warning" v-else>
            No hay un período activo configurado
          </vs-alert>
      </div>
      <div v-if="usuario.id_group == 12" class="flex mt-5 ml-3" style="width: 500px;border-radius:10px;background: #f2f2f2;">
        <div style="width: 40%;">
          <p class="mt-2 ml-1 text-success"> <ion-icon name="contract-outline"></ion-icon> Período Evaluación </p>
        </div>
        <div style="width: 60%;">
          <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.id" @input="changeEvaluacionPeriodo()" label="nombre" class="w-full" v-model="periodoSelect" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
  data(){
    return{
      usuario:[],
      arregloPeriodos:[],
      periodoSelect:'',
      nombrePeriodoEvaluacion:'',
      errorPeriodoEvaluacion:false,
    }
  },
  components:{
    vSelect,
  },
  props:{
    mobil:{
      type:Number,
      default:0
    },
  },
  mounted(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    if(me.usuario.id_group == 12 || me.usuario.id_group == 13 || me.usuario.id_group == 6){
      me.getPeriodosEvaluacion().then(() => {
        // Verificar si ya existe una selección en localStorage
        const periodoStorageId = localStorage.getItem('EvaluacionSelectSalle')
        if(periodoStorageId){
          // Si existe en localStorage, usar ese valor
          me.periodoSelect = parseInt(periodoStorageId)

          // Buscar el nombre del periodo en el array
          const periodoEncontrado = me.arregloPeriodos.find(p => p.id == me.periodoSelect)
          if(periodoEncontrado){
            me.nombrePeriodoEvaluacion = periodoEncontrado.nombre
          }
        } else {
          // Si NO existe en localStorage, consultar al backend
          me.getEvaluacionDocente()
        }
      })
    }
  },
  computed:{
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods:{

    getPeriodosEvaluacion() {
      let me = this;
      me.errorPeriodoEvaluacion = false;
      return this.$http.get(this.$server_url+'salle/periodos?byInstitucion='+me.usuario.institucion_idInstitucion)
        .then(function (response) {
          me.arregloPeriodos = response.data;
        })
        .catch(function (error) {
        })
    },
    getEvaluacionDocente(){
      let me = this;
      let url = `salle/metodosGetSalle?action=GET_EVALUACION_ACTIVA&institucion_id=${me.usuario.institucion_idInstitucion}`
      this.$http.get(this.$server_url+url)
        .then(function (res) {
          if(res.data.status == 0){
            console.log("no hay periodo activo")
            //si es usuario 12 y hay periodos, selecciono el primero
            if((me.usuario.id_group == 12 || me.usuario.id_group == 13 || me.usuario.id_group == 1) && me.arregloPeriodos.length > 0){
              me.periodoSelect = me.arregloPeriodos[0].id
              me.nombrePeriodoEvaluacion = me.arregloPeriodos[0].nombre
              localStorage.setItem('EvaluacionSelectSalle', me.periodoSelect)
              localStorage.setItem('Salletipo_institucion_id', me.arregloPeriodos[0].tipo_institucion_id)
              localStorage.setItem('EvaluacionSelectSalleNombre', me.arregloPeriodos[0].nombre)
              me.errorPeriodoEvaluacion = false
            } else {
              me.periodoSelect            = null
              me.nombrePeriodoEvaluacion  = null
              me.errorPeriodoEvaluacion   = true
            }
          }else{
            console.log("si hay periodo activo")
            me.nombrePeriodoEvaluacion = res.data.data.nombreEvaluacionActiva
            me.periodoSelect            = res.data.data.idEvaluacionActiva
            localStorage.setItem('EvaluacionSelectSalle',res.data.data.idEvaluacionActiva)
            localStorage.setItem('Salletipo_institucion_id',res.data.data.tipo_institucion_id)
            localStorage.setItem('EvaluacionSelectSalleNombre', res.data.data.nombreEvaluacionActiva)
          }
        })
        .catch(function (error) {
        })
    },
    changeEvaluacionPeriodo(){
      let me = this;
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        localStorage.removeItem('EvaluacionSelectSalle')
        localStorage.removeItem('Salletipo_institucion_id')
        localStorage.removeItem('EvaluacionSelectSalleNombre')
        location.reload()
        return
      }
      localStorage.setItem('EvaluacionSelectSalle',me.periodoSelect)
      let periodoSeleccionado = me.arregloPeriodos.find(p => p.id == me.periodoSelect)
      localStorage.setItem('Salletipo_institucion_id',periodoSeleccionado.tipo_institucion_id)
      localStorage.setItem('EvaluacionSelectSalleNombre', periodoSeleccionado.nombre)
      location.reload()
    },
  }
}
</script>

<style scoped>
/* Wrapper para agregar separación */
.periodo-evaluacion-wrapper {
  margin-top: 16px;
  margin-bottom: 16px;
}

/* Card mejorado - más compacto */
.periodo-card-modern {
  border-radius: 10px;
  transition: all 0.3s ease;
}

.periodo-card-modern ::v-deep .vx-card__body {
  padding: 8px 14px !important;
}

.periodo-card-modern:hover {
  box-shadow: 0 4px 20px rgba(115, 103, 240, 0.1);
}

/* Icono - compacto */
.icon-box {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: linear-gradient(135deg, #28c76f 0%, #48da89 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(40, 199, 111, 0.25);
}

.icon-calendar {
  font-size: 15px;
  color: white;
}

/* Label - más pequeño con line-height controlado */
.periodo-label {
  font-size: 12px;
  font-weight: 600;
  color: #6e6b7b;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  line-height: 1;
}

/* Controlar espaciado entre elementos */
.periodo-card-modern .flex.items-center {
  gap: 10px;
}

.periodo-card-modern .ml-3 {
  margin-left: 0 !important;
}

.periodo-card-modern .mr-3 {
  margin-right: 0 !important;
}

/* Contenedor del select más ancho */
.select-grow {
  flex: 1;
  max-width: 400px;
  min-width: 280px;
}

/* Select mejorado - muy compacto como producción */
.periodo-select ::v-deep .vs__dropdown-toggle {
  border: 1.5px solid #e8e8eb;
  border-radius: 6px;
  padding: 4px 8px;
  min-height: 30px;
  transition: all 0.3s ease;
  background: white;
}

.periodo-select ::v-deep .vs__dropdown-toggle:hover {
  border-color: #7367f0;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.1);
}

.periodo-select ::v-deep .vs--open .vs__dropdown-toggle {
  border-color: #7367f0;
  box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
}

.periodo-select ::v-deep .vs__selected {
  color: #2c2c2c;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.2;
  margin: 0;
  padding: 0;
}

.periodo-select ::v-deep .vs__search {
  margin: 0;
  padding: 0;
  line-height: 1.2;
}

.periodo-select ::v-deep .vs__search::placeholder {
  color: #b9b9c3;
}

.periodo-select ::v-deep .vs__open-indicator {
  fill: #7367f0;
  transition: transform 0.3s ease;
}

.periodo-select ::v-deep .vs--open .vs__open-indicator {
  transform: rotate(180deg);
}

/* Dropdown menu - SOLO ESTILOS ESTÉTICOS */
.periodo-select ::v-deep .vs__dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e8e8eb;
  margin-top: 4px;
}

.periodo-select ::v-deep .vs__dropdown-option {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #5e5873;
  transition: all 0.2s ease;
}

.periodo-select ::v-deep .vs__dropdown-option--highlight {
  background: #7367f0;
  color: white !important;
}

.periodo-select ::v-deep .vs__dropdown-option--selected {
  background: rgba(115, 103, 240, 0.15) !important;
  color: #7367f0 !important;
  font-weight: 600;
}


/* Alert personalizada */
.custom-alert {
  border-radius: 12px;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.no-periodos-alert {
  margin-bottom: 0;
}

.no-periodos-alert .alert-content {
  padding: 4px 0;
}

/* Card readonly */
.readonly-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid rgba(40, 199, 111, 0.2);
  transition: all 0.3s ease;
}

.readonly-card:hover {
  box-shadow: 0 4px 20px rgba(40, 199, 111, 0.12);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper.success {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #28c76f 0%, #48da89 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(40, 199, 111, 0.25);
}

.card-icon {
  font-size: 22px;
  color: white;
}

.card-text {
  flex: 1;
}

.card-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6e6b7b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 18px;
  font-weight: 700;
  color: #28c76f;
  margin: 0;
}

/* Mobile */
.mobile-selector {
  margin-bottom: 16px;
}

.mobile-dropdown-btn {
  border-radius: 10px !important;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.15) !important;
}

.custom-dropdown-menu {
  border-radius: 10px;
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 280px !important;
  width: auto !important;
}

.custom-dropdown-item {
  padding: 14px 18px !important;
  transition: all 0.2s ease;
  font-size: 15px !important;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.custom-dropdown-item .item-text {
  font-size: 15px;
  line-height: 1.4;
}

.custom-dropdown-item:hover {
  background: rgba(115, 103, 240, 0.08);
}

.custom-dropdown-item.active-item {
  background: #7367f0;
  color: white;
  font-weight: 600;
}

.check-icon {
  font-size: 18px;
  color: #28c76f;
}

.custom-dropdown-item.active-item .check-icon {
  color: white;
}

.readonly-btn {
  opacity: 0.9;
}

.mobile-empty-alert {
  border-radius: 10px;
  margin-bottom: 16px;
}

.mobile-alert-content {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}

.mobile-alert-content i {
  font-size: 18px;
}

/* Modo oscuro */
.theme-dark .periodo-card-modern ::v-deep .vx-card__body {
  background: #283046;
}

.theme-dark .periodo-label {
  color: #b4b7bd;
}

.theme-dark .periodo-select ::v-deep .vs__dropdown-toggle {
  background: #283046;
  border-color: #3b4253;
}

.theme-dark .periodo-select ::v-deep .vs__selected {
  color: #d0d2d6;
}

.theme-dark .periodo-select ::v-deep .vs__dropdown-menu {
  background: #283046;
  border-color: #3b4253;
}

.theme-dark .periodo-select ::v-deep .vs__dropdown-option {
  color: #b4b7bd;
}

.theme-dark .periodo-select ::v-deep .vs__dropdown-option--highlight {
  background: #7367f0;
  color: white;
}

.theme-dark .readonly-card {
  background: linear-gradient(135deg, #1a3a2e 0%, #16302b 100%);
}
</style>
