<template>
  <div>
    <vx-card title="Copiar Preguntas:" title-color="#6728CE">
      <ul class="flex">
        <li class="mr-5">Mover a:</li>
        <li>
          <vs-radio v-model="tipoEvaluacion" @input="titleConfirmacion='Estás seguro de asignar estas preguntas a la evaluación seleccionada?';areaSelect='';asignaturaSelectedSalle='';chckAsignatura=false;arrayPreguntas=[];countPreguntas=0;" class="mr-3" vs-name="radios1tipoEvaluacion" vs-value="0">Evaluaciones Prolipa</vs-radio>
        </li>
        <li>
          <vs-radio v-model="tipoEvaluacion" @input="titleConfirmacion='Estás seguro de asignar estas preguntas a la evaluación salle?';chckAsignatura=true;areaSelect='';asignaturaSelectedSalle='';arrayPreguntas=[];countPreguntas=0;" vs-name="radios1tipoEvaluacion" vs-value="1">Evaluaciones Salle</vs-radio>
        </li>
      </ul>
      <vs-divider></vs-divider>
      <!-- Your HTML code here -->
      <div>
        <div class="vx-row">
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <small>Copiar Desde:</small>
            <div class="flex">
              <v-select :options="arrayInstituciones" @input="contarPreguntas()" :reduce="arrayInstituciones => arrayInstituciones" label="nombreinstitucion" class="w-full" v-model="institucion1Select" />
              <vx-tooltip style="display: inline-block;" text="Recargar preguntas" position="top" color="primary">
                <vs-button class="ml-2" @click="contarPreguntas();"><i class="fa-solid fa-rotate-right"></i></vs-button>
              </vx-tooltip>
            </div>
          </div>
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6 flex">
            <ul class="mt-3" v-if="tipoEvaluacion == 0">
              <li>
                <vs-checkbox style="margin-top: 20px;" @input="checkAsignatura()" v-model="chckAsignatura">Por asignaturas</vs-checkbox>
              </li>
            </ul>
            <div :class="tipoEvaluacion == 0 ? 'vx-col w-1/2' : 'vx-col w-full'" v-if="chckAsignatura">
              <div class="ml-3">
                <small>Asignatura</small>
                <v-select class="mb-2"
                  v-model="asignaturaSelected"
                  :options="asignaturas"
                  :reduce="asignaturas => asignaturas.idasignatura"
                  @input="contarPreguntas()" />
              </div>
            </div>
          </div>
          <!--EVALUACIONES PROLIPA-->
          <div class="vx-col w-full mb-6" v-if="tipoEvaluacion == 0">
            <small>Copiar a:</small>
            <div class="flex">
              <v-select :options="arrayInstituciones"  :reduce="arrayInstituciones => arrayInstituciones" label="nombreinstitucion" class="w-full" v-model="institucion2Select" />
              <vs-button icon="edit" class="ml-2" @click="openConfirm();">Copiar</vs-button>
            </div>
          </div>
          <!--EVALUACIONES SALLE-->
          <div class="vx-col w-full mb-6" v-if="tipoEvaluacion == 1">
            <!--movimientro a evaluaciones salle-->
            <div class="vx-row mb-6 ">
              <div class="vx-col sm:w-1/3 w-full mt-5">
                  Filtro por Evaluación período
                  <v-select :options="arregloPeriodos" @input="getAreas()" :reduce="arregloPeriodos => arregloPeriodos.id" label="nombre" class="w-full" v-model="periodoSelect" />
              </div>
              <!------------FILTROS BUSQUEDA PREGUNTAS-------------------->
              <div class="vx-col sm:w-1/3 w-full mt-5">
                Área
                <v-select :options="arregloAreas" :reduce="arregloAreas => arregloAreas.id_area" label="nombre_area" v-model="areaSelect" @input="getAsignaturasFiltro();"></v-select>
              </div>
              <div class="vx-col sm:w-1/3 w-full mt-5">
                Asignaturas
                <v-select :options="arregloAsignaturas" :reduce="arregloAsignaturas => arregloAsignaturas.id_asignatura" label="nombre_asignatura" v-model="asignaturaSelectedSalle" ></v-select>
              </div>
              <!------------FIN FILTROS BUSQUEDA PREGUNTAS------------------->
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full mt-5">
                <vs-button icon="edit" class="" @click="openConfirm();">Copiar preguntas</vs-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="countPreguntas > 0" class="mt-3">
          <vs-alert color="success" title="Preguntas a ser copiadas" active="true">
              <p class="text-center">(?)<b> {{ countPreguntas }}</b> Preguntas encontradas</p>
          </vs-alert>
        </div>
        <br><br><br><br><br><br>
       </div>
    </vx-card>
    <!--modales-->
    <vs-popup title="Resultado de la copia" :active.sync="popopMostrarResultados">
      <div v-if="popopMostrarResultados">
        <vs-list>
          <vs-list-header title="Resultados"></vs-list-header>
          <vs-list-item title="Preguntas Ingresadas">
            <p>{{ preguntasIngresadas }}</p>
          </vs-list-item>
          <vs-list-item title="Preguntas que ya existen">
            <p>{{ preguntasYaIngresadas.length }}</p>
          </vs-list-item>
        </vs-list>
        <!--boton de aceptar-->
        <div class="flex justify-center">
          <vs-button color="rgb(11, 189, 135)" @click="popopMostrarResultados = false;" type="border" icon="check">Aceptar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import vSelect from 'vue-select'
const TablaPreguntasVue = () => import('./TablaPreguntas.vue')
export default {
  components: {
    TablaPreguntasVue,
    'v-select': vSelect,
  },
  data() {
    return{
      institucion1Select: '',
      institucion2Select: '',
      countPreguntas: 0,
      arrayPreguntas: [],
      usuario:[],
      preguntasYaIngresadas: [],
      preguntasIngresadas: 0,
      popopMostrarResultados: false,
      chckAsignatura: false,
      asignaturaSelected: '',
      //variables para mover preguntas de salle
      tipoEvaluacion:0,
      arregloPeriodos:[],
      periodoSelect:'',
      areaSelect:'',
      asignaturaSelectedSalle:'',
      arregloAreas:[],
      arregloAsignaturas:[],
      titleConfirmacion:'Estás seguro de asignar estas preguntas a la institución?',
      //fin variables para mover preguntas de salle
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  props:{
    arrayInstituciones: {
      type: Array,
      default: () => [],
    },
    asignaturas: {
      type: Array,
      default: () => [],
    },
  },
  mounted(){
    let me = this
    me.getPeriodosEvaluacion()
  },
  methods: {
    checkAsignatura(){
      let me = this
      me.countPreguntas     = 0;
      me.arrayPreguntas     = [];
      me.asignaturaSelected = '';
      me.contarPreguntas()
    },
    contarPreguntas(){
      let me = this
      me.arrayPreguntas     = [];
      //chckAsignatura false => contar preguntas sin asignaturas, true => contar preguntas por asignatura
      if(me.chckAsignatura){
        if(me.asignaturaSelected == '' || me.asignaturaSelected == undefined || me.asignaturaSelected == null){
          me.$vs.notify({
            title: 'Aviso',
            text: 'Debe seleccionar una asignatura',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
          me.countPreguntas = 0
          return
        }
      }
      me.countPreguntas = 0
      if(me.institucion1Select == '' || me.institucion1Select == undefined || me.institucion1Select == null){
        me.$vs.notify({
          title: 'Aviso',
          text: 'Debe seleccionar la institución de origen',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      me.$vs.loading()
      var url = ""
      if(me.chckAsignatura){
        url = `getCountQuestionsXasignatura?idinstitucion=${me.institucion1Select.idinstitucion}&id_asignatura=${me.asignaturaSelected}`
      }else{
        url = `getCountQuestions?idinstitucion=${me.institucion1Select.idinstitucion}`
      }
      me.$http.get(me.$server_url + url)
      .then(res => {
        me.countPreguntas           = res.data.length
        me.arrayPreguntas           = res.data
        if(me.countPreguntas == 0){
          me.$vs.notify({
            title: 'Alerta',
            text: 'No hay preguntas asignadas a esa institución',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        }
        me.$vs.loading.close()
      })
      .catch(err => {
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al obtener preguntas',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    openConfirm(){
      let me = this
      //si no hay preguntas
      if(me.countPreguntas == 0){
        me.$vs.notify({
          title: 'Aviso',
          text: 'No hay preguntas para copiar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      if(me.institucion1Select == '' || me.institucion1Select == undefined || me.institucion1Select == null){
        me.$vs.notify({
          title: 'Aviso',
          text: 'Debe seleccionar la institución de origen',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      //Evaluaciones prolipa
      if(me.tipoEvaluacion == 0){
        if(me.institucion2Select == '' || me.institucion2Select == undefined || me.institucion2Select == null){
          me.$vs.notify({
            title: 'Aviso',
            text: 'Debe seleccionar la institución de destino',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
          return
        }
        //si ambas son iguales
        if(me.institucion1Select == me.institucion2Select){
          me.$vs.notify({
            title: 'Error',
            text: 'Debe seleccionar instituciones diferentes',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
          return;
        }
      }
      // Evaluaciones salle
      if(me.tipoEvaluacion == 1){
        if(me.areaSelect == null || me.areaSelect == ''){
          me.$vs.notify({
            title: 'Error',
            text: 'Debe seleccionar una área',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
          return
        }
        if(me.asignaturaSelectedSalle == null || me.asignaturaSelectedSalle == ''){
          me.$vs.notify({
            title: 'Error',
            text: 'Debe seleccionar una asignatura',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
          return
        }
      }
      if(me.tipoEvaluacion == 0){
        me.$vs.dialog({
          title: 'Confirmación',
          text: `¿Desea copiar las ${me.countPreguntas} preguntas de la institución ${me.institucion1Select.nombreinstitucion} a la institución ${me.institucion2Select.nombreinstitucion}?`,
          acceptText: 'Aceptar',
          acceptColor: 'rgb(11, 189, 135)',
          acceptButtonAlign: 'center', // Center align the accept button
          accept:this.asignarPreguntas
        })
      }
      if(me.tipoEvaluacion == 1){
        me.$vs.dialog({
          title: 'Confirmación',
          text: `¿Desea copiar las ${me.countPreguntas} preguntas de la institución ${me.institucion1Select.nombreinstitucion} a la evaluacion de salle?`,
          acceptText: 'Aceptar',
          acceptColor: 'rgb(11, 189, 135)',
          acceptButtonAlign: 'center', // Center align the accept button
          accept:this.asignarPreguntas
        })
      }
    },
    asignarPreguntas(){
      let me = this;
      // me.arrayNoIngresadas = []
      me.preguntasYaIngresadas     = []
      me.preguntasIngresadas       = 0
      me.$vs.loading()
      const formData = new FormData();
      if(me.tipoEvaluacion == 0){
        formData.append('institucion_id', me.institucion2Select.idinstitucion);
      }
      if(me.tipoEvaluacion == 1){
        formData.append('n_evaluacion',   me.periodoSelect)
        formData.append('id_asignatura',  me.asignaturaSelectedSalle)
        formData.append('preguntafromProlipa',1)
      }
      formData.append('user_created',   me.usuario.idusuario);
      formData.append('arrayPreguntas', JSON.stringify(me.arrayPreguntas));
      var url = ''
      if(me.tipoEvaluacion == 0){
        url = this.$server_url + 'asignar_preguntas_institucion'
      }
      if(me.tipoEvaluacion == 1){
        url = this.$server_url + 'salle/MoverPreguntas'
      }
      this.$http.post(url, formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
            title: 'Error',
            text: res.data.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
          return
        }
        //si no se asignaron preguntas
        if(res.data.preguntasIngresadas == 0){
          me.$vs.notify({
            title: 'Error',
            text: 'Preguntas ya asignadas con anterioridad',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        }else{
          //si se asignaron preguntas
          me.$vs.notify({
            title: 'Exito',
            text: `${ res.data.preguntasIngresadas } Preguntas  asignadas correctamente`,
            iconPack: 'feather',
            icon: 'icon-check',
            color: 'success',
            time:8000
          })
        }
        me.preguntasYaIngresadas = res.data.preguntasYaIngresadas
        me.preguntasIngresadas   = res.data.preguntasIngresadas
        me.popopMostrarResultados = true
        if(me.tipoEvaluacion == 1){
          me.f_copiarArchivos()
        }
      })
      .catch(function (error) {
        console.log(error);
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Error al asignar las preguntas',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })
    },
    f_copiarArchivos(){
      let me = this;
      me.$http.get(me.$data_url+'api/' + 'copiarArchivosPreguntas')
      .then(res => {
        if(res.data.status == 0){
          me.$vs.notify({
            title: 'Error',
            text: res.data.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        }
      })
      .catch(function (response) {
        console.log(response);
        me.$vs.notify({
          title: 'Error',
          text: 'Ocurrió un error copiar los archivos',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      });
    },
    //METODOS PARA MOVER PREGUNTAS DE SALLE
    getPeriodosEvaluacion() {
      let me = this;
      this.$http.get(this.$server_url+'salle/periodos')
        .then(function (response) {
          me.arregloPeriodos = response.data;
          if(me.arregloPeriodos.length > 0){
            me.periodoSelect = me.arregloPeriodos[0].id
            me.getAreas()
          }
        })
        .catch(function (error) {
        })
    },
    getAreas(){
      let me                = this
      me.arregloAreas       = []
      me.arregloAsignaturas = []
      me.areaSelect         = ""
      me.asignaturaSelectedSalle = ""
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
      me.asignaturaSelectedSalle  = ""
      this.$http.get(this.$server_url+'asignaturas_area_salle/' + me.areaSelect)
      .then(res => {
        me.arregloAsignaturas = res.data;
      })
      .catch(function (error) {
          console.log(error);
      })
    }
  },
}
</script>

