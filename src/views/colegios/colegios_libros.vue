<template>
<div>

<vs-tabs alignment="fixed">
  <vs-tab label="LIBROS PROLIPA" class="pt-8">
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
            <vx-card class="text-center" style="cursor: pointer; min-height: 350px;" @click="irDesgloseLibro(item)">
                <div slot="no-body">
                    <img v-if="item.weblibro != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/portada.png'" alt="Card image cap">
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
</vs-tabs>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
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
            permisosExternos:{
                "id": "",
                "nombreasignatura": "",
                "idasignatura": "",
                "area_idarea": "",
                "institucion_id": "",
                "asignatura_id": "",
                "permisos_acordeon": "",
                "permisos_libros": "",
                "permisos_cursos": "",
                "permisos_cuadernos": "",
                "permisos_planificaciones": "",
                "radicional_id": "",
                "zona_diversion_mi_juego": "",
                "zona_diversion_juego_prolipa": "",
                "material_apoyo_digital": "",
                "material_apoyo_pdf": "",
                "propuestas_metodologicas": "",
                "adaptaciones": "",
                "articulos": "",
                "documentos_ministeriales": "",
                "colegio_permiso_id": ""
            }
        }
    },

    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        let me = this
        this.series_libros_doc()
        if( localStorage.serie_selected ){
          this.verAreasSerie(localStorage.serie_selected)
          if( localStorage.area_selected ){
            this.verLibrosArea(localStorage.area_selected)
          }
        }
        localStorage.removeItem("tipo_asignatura");
        me.getPeriodoInstitucion()
    },
    methods: {
         //para obtener el perido atual
        getPeriodoInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'institucionTraerPeriodo?institucion_id='+me.usuario.institucion_idInstitucion)
                .then(function (res) {
                    me.periodo = res.data[0].periodo
                    localStorage.setItem('periodo_id',res.data[0].periodo)
                    localStorage.setItem('descripcion_periodo',res.data[0].descripcion)
                    localStorage.setItem('nombreInstitucion',res.data[0].nombreInstitucion)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        async series_libros_doc(){
          let me = this
          await this.$http.get(this.$server_url+'colegios_series_libros_doc/'+me.usuario.institucion_idInstitucion)
          .then(function (response) {
              me.series = response.data
          })
          .catch(function (error) {
          })
        },
        irDesgloseLibro(item){
            let me = this
            localStorage.datoUser = localStorage.getItem("usuario");
            localStorage.idlibro = item.idlibro
            localStorage.idasignatura = item.idasignatura
            localStorage.nombreasignatura = item.nombreasignatura
            localStorage.tipo_asignatura = "prolipa"; //asignaturas de prolipa
            me.$router.push('/colegios/docente/libro/desgloselibro')
            me.permisosDelibro(item.idasignatura);
        },
        permisosDelibro(asignatura_id){
            let me = this;
            this.$http.get(this.$server_url+"asignaturas_x_colegio_x_asignatura?institucion_id="+me.usuario.institucion_idInstitucion+'&asignatura_id='+asignatura_id)
            .then(function (res) {
               let datos = res.data[0]
               console.log('rr',datos)
                me.permisosExternos={
                "id": datos.id,
                "nombreasignatura": datos.nombreasignatura,
                "idasignatura": datos.idasignatura,
                "area_idarea": datos.area_idarea,
                "institucion_id": datos.institucion_id,
                "asignatura_id": datos.asignatura_id,
                "permisos_acordeon":JSON.parse(datos[i].permisos_acordeon),
                "permisos_libros": JSON.parse(datos.permisos_libros),
                "permisos_cursos": JSON.parse(datos.permisos_cursos),
                "permisos_cuadernos": JSON.parse(datos.permisos_cuadernos),
                "permisos_planificaciones": JSON.parse(datos.permisos_planificaciones),
                "radicional_id":datos.radicional_id,
                "zona_diversion_mi_juego": JSON.parse(datos.zona_diversion_mi_juego),
                "zona_diversion_juego_prolipa": JSON.parse(datos.zona_diversion_juego_prolipa),
                "material_apoyo_digital": JSON.parse(datos.material_apoyo_digital),
                "material_apoyo_pdf": JSON.parse(datos.material_apoyo_pdf),
                "propuestas_metodologicas": JSON.parse(datos.propuestas_metodologicas),
                "adaptaciones": JSON.parse(datos.adaptaciones),
                "articulos": JSON.parse(datos.articulos),
                "documentos_ministeriales": JSON.parse(datos.documentos_ministeriales),
                "colegio_permiso_id": datos.colegio_permiso_id
            }
               localStorage.setItem('permisosExternos',JSON.stringify(me.permisosExternos))
               localStorage.setItem('status_permisos','yes')
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
            await this.$http.get(this.$server_url+"colegios_ver_areas_serie/" + id_serie+'/'+me.usuario.institucion_idInstitucion)
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
          me.$vs.loading();
          await this.$http.get(this.$server_url+'colegios_get_libros_area/'+me.usuario.institucion_idInstitucion+'/'+id_area+'/'+localStorage.serie_selected)
          .then(function (response) {
              me.libros_area = response.data
              me.$vs.loading.close();
          })
        },
        async verLibrosSerie(id_serie){
          let me = this;
          me.$vs.loading();
          await this.$http.get(this.$server_url+'colegios_get_libros_serie/' +me.usuario.institucion_idInstitucion+'/'+id_serie)
          .then(function (response) {
              me.libros_area = response.data
              me.$vs.loading.close();
          })
        },
    },
}
</script>
