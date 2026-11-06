<template>
  <div>
  
    <vx-card style="min-height: 600px;">
      <div class="w-full text-center flex flex-wrap gap-8 items-center justify-center text-lg mb-5">
        <p class="text-left">Estadísticas de cumplimiento del</p>
        <flat-pickr :config="configdateTimePicker" v-model="fecha_inicio" />
        <p>al</p>
        <flat-pickr :config="configdateTimePicker" v-model="fecha_fin" />
        <p>del redactor</p>
        <v-select style="min-width: 350px;" :options="redactores" :reduce="redactores => redactores" label="nombre_redactor" v-model="redactor_selected" />
      </div>


      <div class="w-full vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          Actividad
          <v-select class="flex-1" :options="actividades" :reduce="actividades => actividades" label="nombre" v-model="actividad_filtro" @input="
          serie_filtro=[]; libro_filtro=[]; unidad_filtro=''; 
          libro_activo = actividad_filtro.libro_activo == 1 ? false : true; 
          unidad_activo = actividad_filtro.unidad_activo == 1 ? false : true;" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          Serie
          <v-select class="flex-1" :options="series" :reduce="series => series" label="nombre_serie" v-model="serie_filtro" @input="get_libros_cumplimiento(serie_filtro.id_serie)" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          Libro
          <v-select class="flex-1" :options="libros" :reduce="libros => libros" label="nombrelibro" v-model="libro_filtro" :disabled="libro_activo"/>
        </div>
        <div class="vx-col sm:w-1/4 w-full mb-2">
          Unidad
          <v-select class="flex-1" :options="[1,2,3,4,5,6,7,8,9,10]" v-model="unidad_filtro" :dir="$vs.rtl ? 'rtl' : 'ltr'" :disabled="unidad_activo"/>
        </div>
        <div class="vx-col sm:w-1/4 w-full mb-2 flex flex-wrap gap-4 items-end justify-center">
          <vx-tooltip text="Buscar con los filtros seleccionados" position="top">
            <vs-button radius icon="icon-search" icon-pack="feather" @click="get_cumplimiento_redactor_normal(); get_cumplimiento_redactor_edicion();"/>
          </vx-tooltip>
          <vx-tooltip text="Borrar filtros" position="top">
            <vs-button radius icon="icon-trash" icon-pack="feather" type="border" @click="actividad_filtro=''; serie_filtro=''; libro_filtro=''; unidad_filtro='';"/>
          </vx-tooltip>
        </div>
      </div>


      <div :key="index" v-for="(item, index) in estadisticas">
        <vs-divider class="mb-0" color="#7443FF" position="left">{{item.actividad}}</vs-divider>
        <div :key="index_ar" v-for="(item_ar, index_ar) in item.areas" class="px-5 flex flex-wrap gap-8 items-center justify-center">
          <vs-divider class="mb-0" border-style="dashed" position="center">{{item_ar.nombre_area}}</vs-divider>

          <div :key="index_av" v-for="(item_av, index_av) in item_ar.avances" class="flex-1 mb-4">
              <vx-tooltip :text="item_av.observacion_redactor" color="dark" position="bottom">
                <p> {{item_av.fecha}} - {{item_av.cant_avance}} / {{item_av.cant_diaria}}</p>
                <span v-if="item_av.nombrelibro">{{item_av.nombrelibro}}</span> <span v-if="item_av.periodoescolar"> - {{item_av.periodoescolar}}</span>
                <p v-if="item_av.unidad"> Unidad {{item_av.unidad}}</p>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) >= 75" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="success"></vs-progress>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) >= 50 && ((item_av.cant_avance*100)/item_av.cant_diaria) < 75" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="primary"></vs-progress>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) >= 25 && ((item_av.cant_avance*100)/item_av.cant_diaria) < 50" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="warning"></vs-progress>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) < 25" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="danger"></vs-progress>
              </vx-tooltip>
          </div>
        </div>
      </div>

      <div>
        <div :key="index" v-for="(item, index) in estadisticas_edicion">
          <vs-divider color="#7443FF" position="left">{{item.actividad}}</vs-divider>
            <div class="px-5 flex flex-wrap gap-8 items-center justify-center mb-base">
              <div :key="index_av" v-for="(item_av, index_av) in item.avances" class="flex-1">
                <vx-tooltip :text="item_av.observacion_redactor" color="dark" position="bottom">
                <p> {{item_av.fecha}} - {{item_av.cant_avance}} / {{item_av.cant_diaria}}</p>
                <span v-if="item_av.nombrelibro">{{item_av.nombrelibro}}</span> <span v-if="item_av.periodoescolar"> - {{item_av.periodoescolar}}</span>
                <p v-if="item_av.unidad"> Unidad {{item_av.unidad}}</p>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) >= 75" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="success"></vs-progress>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) >= 50 && ((item_av.cant_avance*100)/item_av.cant_diaria) < 75" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="primary"></vs-progress>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) >= 25 && ((item_av.cant_avance*100)/item_av.cant_diaria) < 50" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="warning"></vs-progress>
                <vs-progress v-if="((item_av.cant_avance*100)/item_av.cant_diaria) < 25" height="7" :percent="(item_av.cant_avance*100)/item_av.cant_diaria" color="danger"></vs-progress>
                </vx-tooltip>
              </div>
            </div>
        </div>
      </div>
    </vx-card>
    
  

  </div>
  </template>
  
  <script>
  import vSelect from 'vue-select'
  import flatPickr from 'vue-flatpickr-component'
  import 'flatpickr/dist/flatpickr.css'
  import moment from 'moment'
  
  export default {
      components:{
        vSelect,
        flatPickr
      },
      data: () => ({
        usuario: [],
        actividad_selected: [],
        actividades: [],
        area_selected: [],
        serie_selected: [],
        libro_selected: [],
        periodo_selected: [],
        serie_filtro: [],
        areas: [],
        format: "yyyy-MM-dd",
        fecha_registro: '',
        observacion: '',
        areas_activa: false,
        libro_activo: false,
        unidad_activo: false,
        periodo_activo: false,
        cantidad: 0,
        configdateTimePicker: {
            enableTime: false,
            dateFormat: 'Y-m-d'
        },
        fecha_inicio: '',
        fecha_fin: '',
        estadisticas: [],
        estadisticas_edicion: [],
        series: [],
        libros: [],
        periodos: [],
        unidad_selected: '',
        popupActividades: false,
        actividad_filtro: [],
        serie_filtro: [],
        libro_filtro: [],
        unidad_filtro: '',
        redactores: [],
        redactor_selected: [],
      }),
      mounted() {
          let date = new Date()
          this.fecha_inicio = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD')
          this.fecha_fin = moment(date, 'DD/MM/YYYY HH:mm:ss').add(7, 'days').format('YYYY-MM-DD')
  
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          // this.get_cumplimiento_redactor_normal()
          // this.get_cumplimiento_redactor_edicion()
          this.get_redactores()
          this.get_actividades()
          this.get_series_cumplimiento()
          this.get_periodos_cumplimiento()
      },
      methods: {
        get_redactores(){
          let me = this
          me.$vs.loading();
          this.$http.get(this.$server_url+'get_redactores')
          .then(res => {
              me.redactores = res.data
              me.redactor_selected = me.redactores[0]
              me.$vs.loading.close();
          })
        },
        get_actividades(){
          let me = this
          this.$http.get(this.$server_url+'get_actividades_cumplimiento')
          .then(res => {
              me.actividades = res.data
          })
        },
        get_areas(){
          let me = this
          this.$http.get(this.$server_url+'get_areas_cumplimiento/' + me.actividad_selected.id_actividades)
          .then(res => { me.areas = res.data })
        },
        get_series_cumplimiento(){
          let me = this
          this.$http.get(this.$server_url+'get_series_cumplimiento')
          .then(res => { me.series = res.data })
        },
        get_libros_cumplimiento(id_serie){
          let me = this
          this.$http.get(this.$server_url+'get_libros_cumplimiento/' + id_serie)
          .then(res => { me.libros = res.data })
        },
        get_periodos_cumplimiento(){
          let me = this
          this.$http.get(this.$server_url+'get_periodos_cumplimiento')
          .then(res => { me.periodos = res.data })
        },
        get_cumplimiento_redactor_normal(){
          let me = this
          if( me.serie_filtro.id_serie === undefined ){
            me.$vs.notify({ text: 'Seleccione una serie', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          
          let id_libro = me.libro_filtro == null || me.libro_filtro == '' ? 0 : me.libro_filtro.idLibro
          let unidad = me.unidad_filtro === undefined || me.unidad_filtro == '' ? 0 : me.unidad_filtro
          
          me.$vs.loading();
          this.$http.get(this.$server_url+'get_cumplimiento_redactor_normal/'+me.fecha_inicio +'/'+ me.fecha_fin +'/'+ me.redactor_selected.idusuario+'/'+me.serie_filtro.id_serie+'/'+me.actividad_filtro.id_actividades+'/'+id_libro+'/'+unidad)
          .then(res => {
              me.estadisticas = res.data
              me.$vs.loading.close();
          })
        },
        get_cumplimiento_redactor_edicion(){
          let me = this
  
          if( me.serie_filtro.id_serie === undefined ){
            me.$vs.notify({ text: 'Seleccione una serie', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
  
          let id_libro = me.libro_filtro == null || me.libro_filtro == '' ? 0 : me.libro_filtro.idLibro
          let unidad = me.unidad_filtro === undefined || me.unidad_filtro == '' ? 0 : me.unidad_filtro
          
          me.$vs.loading();
          this.$http.get(this.$server_url+'get_cumplimiento_redactor_edicion/'+me.fecha_inicio +'/'+ me.fecha_fin +'/'+ me.redactor_selected.idusuario+'/'+me.serie_filtro.id_serie+'/'+me.actividad_filtro.id_actividades+'/'+id_libro+'/'+unidad)
          .then(res => {
              me.estadisticas_edicion = res.data
              me.$vs.loading.close();
          })
        },
  
      },
  }
  </script>