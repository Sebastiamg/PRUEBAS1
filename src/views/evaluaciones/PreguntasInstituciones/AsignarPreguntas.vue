<template>
  <vx-card class='vx-col w-full mt-4'>
    <ul class="flex">
      <li class="mr-5">Mover a evaluación:</li>
      <li>
        <vs-radio v-model="tipoEvaluacion" @input="titleConfirmacion='Estás seguro de asignar estas preguntas a la evaluación seleccionada?'" class="mr-3" vs-name="radios1tipoEvaluacion" vs-value="0">Evaluaciones Prolipa</vs-radio>
      </li>
      <li>
        <vs-radio v-model="tipoEvaluacion" @input="titleConfirmacion='Estás seguro de asignar estas preguntas a la evaluación salle?'" vs-name="radios1tipoEvaluacion" vs-value="1">Evaluaciones Salle</vs-radio>
      </li>
    </ul>
    <div class="vx-row mb-5 mt-4">
        <div class="vx-col sm:w-1/2 w-full">
            Seleccionar asignatura:
            <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="filtrarPreguntas()" />
        </div>
    </div>
    <div>
      <TablaPreguntasVue :arrayPreguntas="arrayPreguntas" @changeAsignar="changeAsignar"/>
    </div>
    <!--MODLALES-->
    <!--MODLAL PARA ASIGNAR A INSTITUCION-->
    <vs-popup classContent="popup-example" title="Preguntas que seras asignadas" :active.sync="popupAsignar" fullscreen ref="modalPregunta">
      <div v-if="popupAsignar">
        <p class="text-center font-bold text-2xl" v-if="tipoEvaluacion == 0">Movimiento a evaluaciones Prolipa</p>
        <p class="text-center font-bold text-2xl" v-if="tipoEvaluacion == 1">Movimiento a evaluaciones Salle</p>
        <br>
        <!--asignatura a mover-->
        <div>
          <p>Mover preguntas de la asignatura: <b>{{ asignaturaSelected.label }}</b></p>
        </div>
        <!--movimientro a evaluaciones prolipa-->
        <div class="vx-row mb-6" v-if="tipoEvaluacion == 0">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Seleccione la institución</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="arrayInstituciones" :reduce="arrayInstituciones => arrayInstituciones.idinstitucion" label="nombreinstitucion" class="w-full" v-model="institucionSelected" />
          </div>
        </div>
        <!--movimientro a evaluaciones salle-->
        <div class="vx-row mb-6 " v-if="tipoEvaluacion == 1">
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
        <div class="flex justify-center">
          <vs-button color="rgb(11, 189, 135)" v-if="institucionSelected || ( areaSelect && asignaturaSelectedSalle )" @click="popupConfirm=true;" type="border" icon="check">Asignar preguntas a la institución</vs-button>
        </div>
        <vs-divider>{{arrayPreguntasSelected.length}} Preguntas que seras asignadas (?)</vs-divider>
        <TablaPreguntasVue v-if="popupAsignar" btnAsignar="0" :arrayPreguntas="arrayPreguntasSelected" :isMultipleEnabled="Boolean(false)"/>
      </div>
       <!--POPOP DE CONFIRMACION-->
       <vs-popup title="Confirmación" :active.sync="popupConfirm">
          <ConfirmEliminarVue otroValor="1" :title="titleConfirmacion" subtitle="Si, deseo asignar" @changeConfirm="changeConfirm"/>
        </vs-popup>
    </vs-popup>
    <!--MODAL PARA MOSTRAR PREGUNTAS QUE NO SE ASIGNARON-->
    <vs-popup classContent="popup-example" title="preguntas ya asignadas con anterioridad" :active.sync="popupNoAsignadas" fullscreen>
      <TablaPreguntasVue v-if="popupNoAsignadas" :arrayPreguntas="arrayNoIngresadas" :isMultipleEnabled="Boolean(false)"/>
    </vs-popup>
  </vx-card>
  </template>

  <script>
  import vSelect from 'vue-select'
  const TablaPreguntasVue   = () => import('./TablaPreguntas.vue')
  const ConfirmEliminarVue  = () => import('../../configuracion/Reutilizable/ConfirmEliminar.vue');
  export default {
      components: {
        'v-select': vSelect,
        TablaPreguntasVue,
        ConfirmEliminarVue
      },
      data() {
          return {
              asignaturaSelected: '',
              asignatura: {
                  id: '',
                  label: ''
              },
              arrayPreguntas: [],
              arrayPreguntasSelected: [],
              pregSelected: '',
              show: false,
              usuario:[],
              popupAsignar:false,
              institucionSelected:'',
              popupConfirm:false,
              popupNoAsignadas:false,
              tipoEvaluacion:0,
              //variables para mover preguntas de salle
              arregloPeriodos:[],
              periodoSelect:'',
              areaSelect:'',
              asignaturaSelectedSalle:'',
              arregloAreas:[],
              arregloAsignaturas:[],
              titleConfirmacion:'Estás seguro de asignar estas preguntas a la institución?',
          };
      },
      props: {
        arrayInstituciones: {
          type: Array,
          default: () => []
        },
        asignaturas: {
          type: Array,
          default: () => []
        }
      },
      created() {
          let me = this;
          me.usuario = JSON.parse(localStorage.getItem("usuario"))
      },
      mounted() {
        let me = this;
        me.getPeriodosEvaluacion()
      },
      methods: {
        changeConfirm(e){
          let me = this;
          //cancelar
          if(e == 0) { me.popupConfirm = false;  }
          //asignar
          if(e == 1) { me.asignarPreguntas(); }
        },
        asignarPreguntas(){
          let me = this;
          me.arrayNoIngresadas = []
          // evaluacion prolipa
          if(me.tipoEvaluacion == 0){
            if(me.institucionSelected == null || me.institucionSelected == ''){
              me.$vs.notify({
                title: 'Error',
                text: 'Debe seleccionar una institución',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
              })
              return
            }
          }
          // evaluacion salle
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
          }//fin evaluacion salle
          me.$vs.loading()
          const formData = new FormData();
          if(me.tipoEvaluacion == 0){
            formData.append('institucion_id', me.institucionSelected);
          }
          if(me.tipoEvaluacion == 1){
            formData.append('n_evaluacion',   me.periodoSelect)
            formData.append('id_asignatura',  me.asignaturaSelectedSalle)
            formData.append('preguntafromProlipa',1)
          }
          formData.append('user_created',   me.usuario.idusuario);
          formData.append('arrayPreguntas', JSON.stringify(me.arrayPreguntasSelected));
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
            //si no se asignaron preguntas
            me.popupAsignar = false
            me.popupConfirm = false
            me.$refs.modalPregunta.pregSelected = []
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
                time:6000
              })
            }
            //preguntas que no se asignaron que estan ingresada
            if(res.data.preguntasYaIngresadas.length > 0){
              me.checkPreguntasIngresadas(res.data.preguntasYaIngresadas)
            }
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
        checkPreguntasIngresadas(preguntas){
          let me = this;
          me.arrayNoIngresadas = preguntas
          me.popupNoAsignadas = true
        },

        changeAsignar(e,datos){
          this.arrayPreguntasSelected = datos
          this.popupAsignar           = true
        },
        filtrarPreguntas() {
          let me = this;
          me.arrayPreguntas = []
          if (me.asignaturaSelected == null || me.asignaturaSelected == '') {
              me.$vs.notify({
                  title: 'Error',
                  text: 'Debe seleccionar una asignatura',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
              })
              return
          }
          me.$vs.loading()
          const formData = new FormData();
          formData.append('asignatura', me.asignaturaSelected.id);
          formData.append('idusuario',  me.usuario.idusuario);
          this.$http.post(this.$server_url + 'temas_preguntas_respuestas', formData)
          .then(res => {
            me.$vs.loading.close()
            me.arrayPreguntas = res.data
              //si esta vacio el array mostrar un alert
              if(me.arrayPreguntas.length == 0){
                  me.$vs.notify({
                      title: 'Error',
                      text: 'No hay preguntas para esta asignatura',
                      iconPack: 'feather',
                      icon: 'icon-alert-circle',
                      color: 'danger'
                  })
              }
          })
            .catch(function (error) {
              console.log(error);
              me.$vs.loading.close()
              me.$vs.notify({
                title: 'Error',
                text: 'Error al cargar las preguntas',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
              })
          })
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
        },
      }
  };
  </script>
