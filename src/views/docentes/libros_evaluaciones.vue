<template>
<div>

<vs-tabs alignment="fixed">

  <vs-tab label="LIBROS PROLIPA" class="pt-8" @click="menu=0;">
      <vx-card class="vx-row w-full mb-5">
        <div class="w-full px-3" align="center"> SERIES DE PROLIPA </div>

        <div class="demo-alignment px-5" align="center">
          <vs-button type="border" color="success" v-for="(item,$index) in series" :key="$index.id" @click="serie_selected=item.nombre_serie; verAreasSerie(item.id_serie);">
            <span style="text-transform: uppercase;">{{item.nombre_serie}}</span>
          </vs-button>
        </div>
      </vx-card>

      <div></div>
      <vx-card class="vx-row mb-5" v-if="areas_activo==1">
        <div class="w-full px-3" align="center"> ÁREAS DE LA SERIE SELECCIONADA ({{serie_selected.toUpperCase()}}) </div>

        <div class="demo-alignment px-5" align="center">
          <vs-button type="border" color="warning" v-for="(item, index) in areas" :key="index" @click="area_selected=(item.nombre.replace(new RegExp('[0-9]','g'), ''));verLibrosArea(item.iniciales)">
            <span style="text-transform: uppercase;">{{item.nombre.replace(new RegExp("[0-9]","g"), "")}}</span>
          </vs-button>
        </div>
      </vx-card>


      <vx-card class="vx-row mb-5">
        <div class="vx-row">
          <div class="w-full px-3 mb-3" align="center"> LIBROS DEL ÁREA SELECCIONADA ({{area_selected.toUpperCase()}})</div>
          <div class="vx-col sm:w-1/3 w-1/2 md:w-1/4 xl:w-1/4 mt-3 mn-3"  style="min-width: 220px;" v-for="(item,$index) in libros_area" :key="$index.id">
                <vx-card class="text-center" style="cursor: pointer; min-height: 350px;" @click="ir_cursos_libro_eval(item)">
                    <div slot="no-body">
                        <img v-if="item.weblibro != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/'+item.portada" alt="Card image cap">
                        <img v-else class="responsive card-img-top" v-bind:src="$data_url+'tareas/img/'+item.portada" alt="Card image cap">
                    </div>
                    <div class="mt-4">
                        <p class="font-bold"> {{item.nombrelibro}} </p>
                        <small> {{item.descripcionlibro}} </small>
                    </div>
                </vx-card>
            </div>
        </div>
      </vx-card>
  </vs-tab>
  <vs-tab label="MIS ASIGNATURAS" @click="menu=1;">
      <div class="vx-row mb-base">
          <!-- <div class="vx-col sm:w-1/3 w-1/5 md:w-1/5 mt-3" style="min-width: 220px;">
              <vx-card class="text-center" style="cursor: pointer; min-height: 340px;" @click="CrearAsignatura()">
                  <div class="mt-6"><br><br>
                      <p class="font-bold mb-5"> Crear asignatura </p>
                      <vs-avatar color="dark" size="large" icon-pack="feather" icon="icon-plus" />
                      <p class="mt-4"> <small> Puede crear asignaturas personalizadas. </small> </p>
                  </div>
              </vx-card>
          </div> -->
          <div class="vx-col sm:w-1/3 w-1/2 md:w-1/4 xl:w-1/4 mt-3"  style="min-width: 220px;" v-for="(item,$index) in asignaturas_docente" :key="$index.id">
              <vx-card class="text-center" style="cursor: pointer; min-height: 340px;">
                  <div slot="no-body" @click="irCursosAsigDocEval(item)">
                      <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/cursos.png'">
                  </div>
                  <div class="mt-4" @click="irCursosAsigDocEval(item)">
                      <p class="font-bold"> {{item.nombreasignatura}} </p>
                      <small> Asignatura creada por el docente </small>
                  </div>
                  <div class=" mt-2" align="center">
                      <vx-tooltip color="danger" text="Eliminar asignatura" style="display: inline-block;">
                          <vs-button radius color="danger" type="border" icon-pack="feather" icon="icon-trash" @click="eliminarAsignatura(); idasignatura_doc = item.idasignatura" class="m-2"></vs-button>
                      </vx-tooltip>
                  </div>
              </vx-card>
          </div>
      </div>
  </vs-tab>
  <vs-tab label="Reporte Evaluaciones" @click="menu=2;">
    <vx-card v-if="menu == 2" class="mt-5">
      <EvaluacionesReportesVue :docente="usuario"/>
    </vx-card>
  </vs-tab>

</vs-tabs>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
const EvaluacionesReportesVue = () => import('../evaluaciones/reportes/EvaluacionesReportes.vue');
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        EvaluacionesReportesVue,
    },
    data() {
        return {
            menu:0,
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idlibro: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
            usuario: [],
            asignaturas_docente: [],
            variable_ejemplo: [],
            idasignatura_doc: '',
            series: [],
            areas: [],
            libros_area: [],
            colores: ['#E74C3C', '#8E44AD', '#3498DB', '#16A085', '#F7DC6F', '#E67E22', '#5D6D7E', '#273746'],
            serie_selected: '',
            area_selected: '',
            areas_activo: 1,
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        this.series_libros_doc()

        if( localStorage.serie_selected ){
          this.verAreasSerie(localStorage.serie_selected)
          if( localStorage.area_selected ){
            this.verLibrosArea(localStorage.area_selected)
          }
        }

        localStorage.removeItem("tipo_asignatura");
        this.getAsignaturasDocente()
    },
    methods: {
        async series_libros_doc(){
          let me = this
          await this.$http.get(this.$server_url+'series_libros_doc/' + me.usuario.idusuario)
          .then(function (response) {
              me.series = response.data
          })
          .catch(function (error) {
          })
        },
        CrearAsignatura(){
            localStorage.setItem('idcurso', '');
            this.$router.push('/docente/curso/nuevo')
        },
        async getLibros() {
            let me = this;
            // me.$vs.loading();
            this.$http.get(this.$server_url+'libros?idusuario=' + me.usuario.idusuario+'&periodo_id='+localStorage.periodo_id)
                .then(function (response) {
                    me.libros = response.data
                    // me.$vs.loading.close();
                })
                .catch(function (error) {
                    // me.$vs.loading.close();
                })
        },
        async getAsignaturasDocente() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'asignaturas_crea_docente/' + me.usuario.idusuario)
                .then(function (response) {
                    me.asignaturas_docente = response.data
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        ir_cursos_libro_eval(item){
            let me = this
            localStorage.datoUser = localStorage.getItem("usuario");
            localStorage.idlibro = item.idlibro
            localStorage.nombrelibro = item.nombrelibro
            localStorage.idasignatura = item.idasignatura
            localStorage.nombreasignatura = item.nombreasignatura
            localStorage.tipo_asignatura = "prolipa"; //asignaturas de prolipa
            me.$router.push('/cursos_libro_evaluacion')
        },
        irCursosAsigDocEval(item){
            let me = this
            localStorage.idasignatura = item.idasignatura
            localStorage.nombreasignatura = item.nombreasignatura
            localStorage.tipo_asignatura = "docente";  //asignaturas creadas por el docente
            me.$router.push('/cursos_asig_doc_evaluacion')
        },
        eliminarAsignatura(){
            this.$vs.dialog({
                color: 'danger',
                title: `Eliminar asignatura`,
                text: 'Está seguro de eliminar esta asignatura?',
                accept: this.acceptAlert,
            })
        },
        acceptAlert() {
            let me = this;
            this.$http.get(this.$server_url+"deshabilitarasignatura/" + me.idasignatura_doc)
                .then(function (response) {
                    me.getAsignaturasDocente()
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Asignatura eliminada'
                    })
                    me.getCurso();
                })
                .catch(function (error) {

                })
        },
        async verAreasSerie(id_serie){
          let me = this
          localStorage.serie_selected = id_serie
          me.$vs.loading();
          // console.log('asdasd')
          if( id_serie == 6 ){
            me.area_selected = 'PLAN LECTOR'
            me.areas_activo = 0
            me.verLibrosSerie(id_serie)
          }else{
            me.areas_activo = 1
            await this.$http.get(this.$server_url+"ver_areas_serie/" + id_serie+'/'+me.usuario.idusuario)
            .then(function (res) {
                me.areas = res.data
                me.libros_area = []
                me.$vs.loading.close();
            })
          }
        },
        async verLibrosArea(id_area){
          let me = this;

          localStorage.area_selected = id_area
          let region                 = localStorage.region
          me.$vs.loading();
          await this.$http.get(this.$server_url+'get_libros_area/' + me.usuario.idusuario+'/'+id_area+'/'+localStorage.serie_selected+'/'+region+'/'+localStorage.periodo_id)
          .then(function (response) {
              me.libros_area = response.data
              me.$vs.loading.close();
          })
        },
        async verLibrosSerie(id_serie){
          let me = this;
          let region                 = localStorage.region
          me.$vs.loading();
          await this.$http.get(this.$server_url+'get_libros_serie/' + me.usuario.idusuario+'/'+id_serie+'/'+region+'/'+localStorage.periodo_id)
          .then(function (response) {
              me.libros_area = response.data
              me.$vs.loading.close();
          })
        },
    },
}
</script>
