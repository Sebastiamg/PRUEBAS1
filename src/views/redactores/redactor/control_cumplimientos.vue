<template>
<div>

<vs-popup title="Registro de actividades" :active.sync="popupActividades">
  <div class="p-3 vx-row">
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Actividades
      <v-select :options="actividades" :reduce="actividades => actividades" label="nombre" v-model="actividad_selected" 
      @input="
      areas_activa = actividad_selected.area_activa == 1 ? false : true; 
      libro_activo = actividad_selected.libro_activo == 1 ? false : true; 
      unidad_activo = actividad_selected.unidad_activo == 1 ? false : true; 
      periodo_activo = actividad_selected.periodo_activo == 1 ? false : true; 
      get_areas()"/>
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Serie
      <v-select :options="series" :reduce="series => series" label="nombre_serie" v-model="serie_selected" @input="get_libros_cumplimiento(serie_selected.id_serie)" />
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Áreas
      <v-select :options="areas" :reduce="areas => areas" label="nombrearea" v-model="area_selected" :disabled="areas_activa" />
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Libro
      <v-select :options="libros" :reduce="libros => libros" label="nombrelibro" v-model="libro_selected" :disabled="libro_activo" />
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Unidad
      <v-select :options="[1,2,3,4,5,6,7,8,9,10]" v-model="unidad_selected" :disabled="unidad_activo" class="w-full" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Periodo
      <v-select :options="periodos" :reduce="periodos => periodos" label="descripcion" v-model="periodo_selected" :disabled="periodo_activo" />
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Fecha
      <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_registro" />
    </div>
    <div class="vx-col sm:w-1/2 w-full sm:mb-2">
      Cantidad
      <vs-input v-model="cantidad" type="number" class="w-full" />
    </div>
    <div class="vx-col w-full sm:mb-2">
      Detalle actividades realizadas
      <vs-textarea type="text" class="w-full" v-model="observacion"></vs-textarea>
    </div>
    <div class="vx-col w-full pt-3" align="center">
      <vs-button class="w-full" type="gradient" @click="guardar_cumplimiento">Guardar</vs-button>
    </div>
  </div>
</vs-popup>

<vs-tabs alignment="fixed">

  <vs-tab label="Control" v-if="usuario.idusuario != 64960" class="pt-6">

    <vx-card style="min-height: 600px;">
      <div class="w-full text-center flex flex-wrap gap-8 items-center justify-center text-lg mb-5">
        <vs-button @click=" actividad_selected=[]; serie_selected=[]; area_selected=[]; libro_selected=[]; periodo_selected=[]; unidad_selected=''; fecha_registro=''; cantidad=0; observacion=''; popupActividades=true" class="py-2 px-3" color="dark" type="gradient">Registrar actividades</vs-button>
        <p class="text-left">Estadísticas de cumplimiento del</p>
        <flat-pickr :config="configdateTimePicker" v-model="fecha_inicio" />
        <p>al</p>
        <flat-pickr :config="configdateTimePicker" v-model="fecha_fin" />
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
  </vs-tab>


  <vs-tab label="Reporte" v-if="usuario.idusuario == 14818 || usuario.idusuario == 3762 || usuario.idusuario == 64960" class="pt-6">
      <gestion-cumplimiento></gestion-cumplimiento>
  </vs-tab>

</vs-tabs>



</div>
</template>

<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'
import gestionCumplimiento from '../admin/control_cumplimientos.vue'

export default {
    components:{
      vSelect,
      flatPickr,
      gestionCumplimiento
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
    }),
    mounted() {
        let date = new Date()
        this.fecha_inicio = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD')
        this.fecha_fin = moment(date, 'DD/MM/YYYY HH:mm:ss').add(7, 'days').format('YYYY-MM-DD')

        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        // this.get_cumplimiento_redactor_normal()
        // this.get_cumplimiento_redactor_edicion()
        this.get_actividades()
        this.get_series_cumplimiento()
        this.get_periodos_cumplimiento()
    },
    methods: {
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
      guardar_cumplimiento(){
        let me = this
        
        let area = 0
        if( me.actividad_selected ){
          if( me.fecha_registro == '' || me.cantidad == ''){
            me.$vs.notify({ text: 'Complete los campos obligatorios', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          if( me.actividad_selected.categoria != 'edicion' ){
            if( !me.actividad_selected ){
              me.$vs.notify({ text: 'Seleccione una área', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
              return
            }else{
              area = me.area_selected.idarea
            }
          }
          if( me.serie_selected.id_serie === undefined ){
            me.$vs.notify({ text: 'Seleccione una serie', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
              return
          }
        }else{
          me.$vs.notify({ text: 'Seleccione una actividad', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }

        let observacion = me.observacion == '' ? 'Sin comentarios' : me.observacion
        
        let id_libro = me.libro_selected.idLibro
        if( me.libro_selected.idLibro === undefined ){
          id_libro = 0
        }
        let id_periodo = me.periodo_selected.idperiodoescolar
        if( me.periodo_selected.idperiodoescolar === undefined ){
          id_periodo = 0
        }
        let unidad = me.unidad_selected
        if( me.unidad_selected == '' ){
          unidad = 0
        }

        let formData = new FormData();
        formData.append('id_actividad', me.actividad_selected.id_actividades)
        formData.append('id_area',      area)
        formData.append('id_serie',     me.serie_selected.id_serie)
        formData.append('id_libro',     id_libro)
        formData.append('unidad',       unidad)
        formData.append('id_periodo',   id_periodo)
        formData.append('fecha',        me.fecha_registro)
        formData.append('cantidad',     me.cantidad)
        formData.append('observacion',  observacion)
        formData.append('id_usuario',   me.usuario.idusuario)

        me.$vs.loading();

        this.$http.post(this.$server_url + 'cumplimientos', formData)
        .then(res => {
            me.popupActividades = false
            // me.get_cumplimiento_redactor_normal()
            // me.get_cumplimiento_redactor_edicion()
            me.actividad_selected = ''; me.area_selected = ''; me.fecha_registro = ''; me.cantidad = ''; me.observacion = '';
            me.$vs.loading.close();
            me.$vs.notify({ text: 'Guardado exitosamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
        })
        .catch(err => { 
          me.$vs.notify({ text: 'Complete los campos obligatorios', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          me.$vs.loading.close()
        })

      },
      get_cumplimiento_redactor_normal(){
        let me = this
        if( me.serie_filtro.id_serie === undefined ){
          me.$vs.notify({ text: 'Seleccione una serie', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        
        let id_libro = me.libro_filtro == null || me.libro_filtro == '' ? 0 : me.libro_filtro.idLibro
        let unidad = me.unidad_filtro === null || me.unidad_filtro == '' ? 0 : me.unidad_filtro
        
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_cumplimiento_redactor_normal/'+me.fecha_inicio +'/'+ me.fecha_fin +'/'+ me.usuario.idusuario+'/'+me.serie_filtro.id_serie+'/'+me.actividad_filtro.id_actividades+'/'+id_libro+'/'+unidad)
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
        let unidad = me.unidad_filtro === null || me.unidad_filtro == '' ? 0 : me.unidad_filtro
        
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_cumplimiento_redactor_edicion/'+me.fecha_inicio +'/'+ me.fecha_fin +'/'+ me.usuario.idusuario+'/'+me.serie_filtro.id_serie+'/'+me.actividad_filtro.id_actividades+'/'+id_libro+'/'+unidad)
        .then(res => {
            me.estadisticas_edicion = res.data
            me.$vs.loading.close();
        })
      },

    },
}
</script>