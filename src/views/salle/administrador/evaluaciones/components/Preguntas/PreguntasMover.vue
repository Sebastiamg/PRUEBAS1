<template>
  <div>
    <!-- Información de origen de las preguntas -->
    <vs-alert color="primary" class="mb-6" icon="info">
      <div class="font-bold text-lg mb-2">Moviendo preguntas desde:</div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <span class="font-semibold">Período:</span> {{ periodoOrigenNombre }}
        </div>
        <div class="vx-col sm:w-1/3 w-full">
          <span class="font-semibold">Área:</span> {{ areaOrigenNombre }}
        </div>
        <div class="vx-col sm:w-1/3 w-full">
          <span class="font-semibold">Asignatura:</span> {{ asignaturaOrigenNombre }}
        </div>
      </div>
    </vs-alert>
    <vs-divider>Seleccione el destino</vs-divider>
    <div class="vx-row mb-6" v-if="userRoot">
      <div class="vx-col w-full">
        <p>Tipo Evaluación:</p>
        <v-select :options="arrayTiposInstituciones" @input="periodoSelect=''; getAllPeriodosEvaluacion()" :reduce="arrayTiposInstituciones => arrayTiposInstituciones.id" label="descripcion" class="w-full" v-model="tipoEvaluacionSelected" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <p>Período Evaluación:</p>
        <v-select :options="arrayPeriodos" @input="getAreas()" :reduce="arrayPeriodos => arrayPeriodos.id" label="nombre" class="w-full" v-model="periodoSelect" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <p>Área:</p>
        <v-select :options="arregloAreas" :reduce="arregloAreas => arregloAreas" label="nombre_area" v-model="areaSelect" @input="getAsignaturasFiltro()"></v-select>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <p>Asignatura:</p>
        <v-select :options="arregloAsignaturas" :reduce="arregloAsignaturas => arregloAsignaturas.id_asignatura" label="nombre_asignatura" v-model="asignaturaSelect"></v-select>
      </div>
    </div>
    <div class="flex justify-center mb-6" v-if="userRoot">
      <ul class="flex">
        <li class="modelx mr-2">
          Permitir duplicar preguntas
        </li>
        <li>
          <vs-radio v-model="duplicate" class="mr-2" vs-name="radios1duplicate" vs-value="1">Si</vs-radio>
        </li>
        <li>
          <vs-radio v-model="duplicate"  vs-name="radios1duplicate" vs-value="0">No</vs-radio>
        </li>
      </ul>
    </div>
    <div class="flex justify-center mb-6">
      <vs-button class="mr-3 mb-2" icon="check" @click="moverPreguntas()">Mover preguntas</vs-button>
      <vs-button color="warning" type="border" icon="close" class="mb-2" @click="$emit('changeRecharge',1)">Cancelar</vs-button>
    </div>
    <!--TABLE PREGUNTAS-->
    <vs-divider>Preguntas a ser movidas</vs-divider>
    <PreguntasTableVue :pregSelected="pregSelected" @changeMove="moverPreguntasInactivas"/>
    <!--MODALES-->
  </div>
</template>
<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select'
import PreguntasTableVue from './PreguntasTable.vue'
export default{
  props:{
    pregSelected:{
      type:Array,
      default:[]
    },
    areaOrigen:{
      type:Object,
      default:null
    },
    asignaturaOrigen:{
      type:Object,
      default:null
    },
    periodoOrigen:{
      type:[Number, String],
      default:''
    },
    arregloPeriodos:{
      type:Array,
      default:[]
    },
  },
  components:{
    vSelect,
    PreguntasTableVue,
  },
  computed: {
      ...mapState(['userRoot']),
      periodoOrigenNombre(){
        // Usar directamente el nombre del período de las preguntas seleccionadas
        if(this.pregSelected && this.pregSelected.length > 0 && this.pregSelected[0].pregunta) {
          return this.pregSelected[0].pregunta.periodo || 'No seleccionado'
        }
        // Fallback: buscar en arregloPeriodos solo si es necesario
        if(this.periodoOrigen && this.arregloPeriodos && this.arregloPeriodos.length > 0) {
          const periodo = this.arregloPeriodos.find(p => p.id == this.periodoOrigen)
          if(periodo) return periodo.nombre
        }
        return 'No seleccionado'
      },
      areaOrigenNombre(){
        // Usar directamente el nombre del área de las preguntas seleccionadas
        if(this.pregSelected && this.pregSelected.length > 0 && this.pregSelected[0].pregunta) {
          return this.pregSelected[0].pregunta.nombre_area || 'No seleccionada'
        }
        // Fallback
        return this.areaOrigen ? this.areaOrigen.nombre_area : 'No seleccionada'
      },
      asignaturaOrigenNombre(){
        // Usar directamente el nombre de la asignatura de las preguntas seleccionadas
        if(this.pregSelected && this.pregSelected.length > 0 && this.pregSelected[0].pregunta) {
          return this.pregSelected[0].pregunta.nombre_asignatura || 'No seleccionada'
        }
        // Fallback
        return this.asignaturaOrigen ? this.asignaturaOrigen.nombre_asignatura : 'No seleccionada'
      }
  },
  data(){
    return{
      usuario:[],
      arregloAsignaturas:[],
      arregloAreas:[],
      preguntasRender:[],
      PreguntasNoIngresadas:[],
      periodoSelect:'',
      areaSelect:'',
      asignaturaSelect:'',
      ingresadas:0,
      duplicate:0,
      arrayTiposInstituciones:[],
      tipoEvaluacionSelected:'',
      arrayPeriodos:[],
    }
  },
  created(){
    let me = this;
    me.usuario                = JSON.parse(localStorage.getItem("usuario"))
    let tipoInstitucion       = localStorage.getItem("Salletipo_institucion_id")
    me.tipoEvaluacionSelected = parseInt(tipoInstitucion)
    me.renderPreguntas()
  },
  mounted(){
    let me                    = this
    me.ingresadas             = 0
    me.PreguntasNoIngresadas  = []
    this.periodoSelect        = parseInt(localStorage.getItem("EvaluacionSelectSalle"))
    me.getTiposInstitucion()
    me.getAllPeriodosEvaluacion()
  },
  methods:{
    async getTiposInstitucion() {
      try {
        const response = await this.$http.get(
          this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion'
        )
        if (response.data.status === 1) {
          this.arrayTiposInstituciones = response.data.data
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
    async getAllPeriodosEvaluacion(){
      let me = this
      let url = `salle/periodos`
      try {
        const response = await this.$http.get(this.$server_url + url)
        this.arrayPeriodos = response.data.filter(p => p.tipo_institucion_id == this.tipoEvaluacionSelected)
        if(this.arrayPeriodos.length > 0){
          me.$vs.notify({
            text:'Se encontraron '+ this.arrayPeriodos.length + ' períodos de evaluación',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
          this.getAreas()
        }else{
          me.$vs.notify({
            text:'No se encontraron períodos de evaluación para el tipo de evaluación seleccionado',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
        }

      } catch (error) {
        console.error('Error al cargar períodos de evaluación:', error)
        this.$vs.notify({
          text: 'Error al cargar períodos de evaluación',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      }
    },

    renderPreguntas(){
      let me = this;
      me.preguntasRender = []
      me.pregSelected.forEach(element => {
        var cal = new Object()
        cal.nombre_asignatura   = element.pregunta.nombre_asignatura
        cal.id_pregunta         = element.pregunta.id_pregunta
        cal.id_tipo_pregunta    = element.pregunta.id_tipo_pregunta
        cal.descripcion         = element.pregunta.descripcion
        cal.img_pregunta        = element.pregunta.img_pregunta
        cal.puntaje_pregunta    = element.pregunta.puntaje_pregunta
        cal.estado              = element.pregunta.estado
        cal.n_evaluacion        = element.pregunta.n_evaluacion
        cal.id_area             = element.pregunta.id_area
        cal.periodo             = element.pregunta.periodo
        me.preguntasRender.push(cal)
      });
    },
    getAreas(){
      let me                 = this
      me.arregloAreas        = []
      me.arregloAsignaturas  = []
      me.areaSelect          = ""
      me.asignaturaSelect    = ""
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        me.$vs.notify({
        text:'Seleccione una Evaluación Período por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      this.$http.get(this.$server_url+'areas_salle')
      .then(res => {
        let datos = res.data
        if(datos.length > 0){
          me.arregloAreas = datos.filter(p => p.n_evaluacion == me.periodoSelect)
        }
      })
      .catch(function (error) {
          console.log(error);
      })
    },
    getAsignaturasFiltro(){
      let me = this
      me.asignaturaSelect  = ""
      this.$http.get(this.$server_url+'asignaturas_area_salle/' + me.areaSelect.id_area)
      .then(res => {
        me.arregloAsignaturas= res.data;
      })
      .catch(function (error) {
          console.log(error);
      })
    },
    moverPreguntas(){
      let me = this
      if(me.periodoSelect == null || me.periodoSelect == undefined || me.periodoSelect == ""){
        me.$vs.notify({
        text:'Seleccione una período de evaluación por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        })
        return
      }
      if(me.asignaturaSelect == null || me.asignaturaSelect == undefined || me.asignaturaSelect == ""){
        me.$vs.notify({
        text:'Seleccione una asignatura por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        })
        return
      }

      let formData = new FormData();
      formData.append('arrayPreguntas', JSON.stringify(me.preguntasRender));
      formData.append('n_evaluacion',   me.periodoSelect)
      formData.append('id_asignatura',  me.asignaturaSelect)
      formData.append('user_created',   me.usuario.idusuario)
      formData.append('duplicate',      me.duplicate)
      me.$vs.loading()
      this.$http.post(this.$server_url+'salle/MoverPreguntas', formData)
      .then(res => {
      me.$vs.loading.close()
      if(res.data.status == 0){
        me.$vs.notify({
        text:res.data.message,
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        })
        return
      }
      me.PreguntasNoIngresadas  = res.data.PreguntasNoIngresadas
      let msg                   = `Se movio ${res.data.preguntasIngresadas}  preguntas correctamente `
      me.$vs.notify({
        text:msg,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check',
        time:4000,
        })
        let datos = {
          "ingresadas" : res.data.preguntasIngresadas ,
          "PreguntasNoIngresadas":res.data.PreguntasNoIngresadas
        }
        me.$emit('changeMove',datos)
      })
    },
    moverPreguntasInactivas(e){
      me.$emit('changeMove',e)
    }
  }
}
</script>
