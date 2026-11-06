<template>
  <div>
    <div>
      <vs-divider>Juegos Administrables</vs-divider>
      <vs-table v-if="arregloJuegosProlipa" stripe pagination max-items="25" search :data="arregloJuegosProlipa">
        <template slot="header">
          <vs-chip>Cantidad: {{ arregloJuegosProlipa.length }}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th sort-key="nombre_juego">Juegos Prolipa</vs-th>
            <vs-th sort-key="temas">Unidad - tema</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    <b>{{data[indextr].temas[0].nombreasignatura}}</b> <br>
                    <b>{{ data[indextr].nombre_juego.toUpperCase() }}</b><br>
                    <b>Tipo juego:</b> {{ data[indextr].nombre_tipo_juego }}<br>
                    <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                    <b>Puntos:</b> {{ data[indextr].puntos }}<br>
                    <b>Estado:</b> <span v-if="data[indextr].estado_juego === 1" style="color: green;"> ACTIVO </span>
                    <span v-else style="color: red;"> INACTIVO </span>
                </vs-td>
                <vs-td>
                    <div :data="item" :key="index" v-for="(item, index) in data[indextr].temas">
                        <div class="mb-4">Unidad {{item.unidad}} <br> {{item.nombre_tema}}</div>
                    </div>
                </vs-td>
                <vs-td :data="data[indextr].id" style="width: 260px;">
                    <vx-tooltip style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                        <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_juego = data[indextr];setDatos(tr); getCursosDocente();nombre_juego = tr.nombre_juego;id_tipo_juego=tr.id_tipo_juego" color="warning" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Ver calificaciones" position="top" color="primary">
                        <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="verTipoModal = false; data_juego = data[indextr];setDatos(tr); getCursosDocente()" color="primary" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Previsualizar juego" position="top" color="primary">
                        <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="previsualizarJuego(data[indextr])" color="primary" type="line"></vs-button>
                    </vx-tooltip>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <!--MODALES-->
      <vs-popup title="Seleccione un curso" :active.sync="modalCursosEnvioLink">
        <div v-if="modalCursosEnvioLink">
          <div v-if="crearCurso == '1'">
            <nuevoCursoVue :desdeModal="1" @changeReturn="changeReturn"/>
          </div>
          <div v-else>
            <vs-button color="primary" icon="add" @click="crearCurso = 1;" type="border">Crear Curso</vs-button>
            <br><br>
            <div v-if="cursosDocente.length == 0">
              <vs-alert color="warning"><p class="text-center">No hay cursos asignados</p></vs-alert>
            </div>
            <vs-list v-else>
              <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">
                  <template slot="avatar">
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                  </template>
                  <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="primary" @click="previsualizarJuegos(item)">Visualizar</vs-button>
                  <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="success" @click="asignarCurso(item)">Asignar juego</vs-button>
                  <vs-button v-if="verTipoModal===false" type="filled" target="_blank" style="font-size: 12px;" size="small" color="warning" @click="modalCursosEnvioLink=false; verCalificaciones(item)">Ver calificaciones</vs-button>
              </vs-list-item>
            </vs-list>
          </div>
        </div>
      </vs-popup>
    </div>
  </div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
import nuevoCursoVue from '../../../docentes/nuevo.vue';
export default {
  mixins: [historicoMixin],
  components:{
    nuevoCursoVue,
  },
  data(){
    return{
      usuario:[],
      grupo_usuario:'',
      verTipoModal: false,
      data_juego: [],
      cursosDocente: [],
      nombre_juego:'',
      modalCursosEnvioLink:false,
      crearCurso:0,
      url_juego: '',
      id_tipo_juego:0,
    }
  },
  props:{
    arregloJuegosProlipa:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  created(){
    let me            = this;
    me.usuario        = JSON.parse(localStorage.getItem("usuario"))
    me.grupo_usuario  = me.usuario.id_group;
  },
  methods:{
    changeReturn(e){
      let me = this
      if(e == 0) { me.crearCurso = 0; }
      if(e == 1) {
        me.getCursosDocente()
        me.crearCurso = 0;
      }
    },
    getCursosDocente() {
      let me = this
      let formData = new FormData();
      formData.append('id_usuario',     me.usuario.idusuario);
      formData.append('id_asignatura',  localStorage.idasignatura);
      formData.append('periodo_id',     localStorage.periodo_id);
      this.$http.post(this.$server_url + 'curso_libro_docente', formData)
          .then(function (res) {
              me.cursosDocente        = res.data
              me.modalCursosEnvioLink = true
          })
          .catch(function (error) {})
    },
    previsualizarJuegos(item) {
      let me = this
      let h_idinstitucion       = me.usuario.institucion_idInstitucion;
      let h_idusuario           = me.usuario.idusuario;
      let h_idgrupo             = me.usuario.id_group;
      let h_idasignatura        = localStorage.idasignatura
      let h_nombreasignatura    = localStorage.nombreasignatura
      let h_recursotipo         = 8; //8 = juego
      let datoHistorico         = {
          'user_nombre':        me.usuario.nombres,
          'user_apellido':      me.usuario.apellidos,
          'user_email':         me.usuario.email,
          'user_cedula':        me.usuario.cedula,
          'recurso_accion':     'ver',
          'recurso_tipo':       'juego',
          'recurso_nombre':     me.nombre_juego,
          'recurso_detalle':    'curso donde es visto el juego '+item.codigo,
          'tipo juego':         localStorage.nombre_tipo_juego
      }
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      me.setValor(me.id_tipo_juego)
      let ruta =  '/' + me.url_juego + '/' + me.data_juego.id_juego + '/' + item.codigo
      window.open(ruta, "_blank");
    },
    setDatos(item){
      localStorage.id_tipo_juego     = item.id_tipo_juego
      localStorage.nombre_tipo_juego = item.nombre_tipo_juego
      localStorage.tipo_juego_calif  = item.nombre_tipo_juego

    },
    previsualizarJuego(item) {
      let me = this
      localStorage.id_tipo_juego     = item.id_tipo_juego
      localStorage.nombre_tipo_juego = item.nombre_tipo_juego
      localStorage.tipo_juego_calif  = item.nombre_tipo_juego
      let h_idinstitucion     = me.usuario.institucion_idInstitucion;
      let h_idusuario         = me.usuario.idusuario;
      let h_idgrupo           = me.usuario.id_group;
      let h_idasignatura      = localStorage.idasignatura
      let h_nombreasignatura  = localStorage.nombreasignatura
      let h_recursotipo       = 8; //8 = juego
      let datoHistorico       = {
          'user_nombre':      me.usuario.nombres,
          'user_apellido':    me.usuario.apellidos,
          'user_email':       me.usuario.email,
          'user_cedula':      me.usuario.cedula,
          'recurso_accion':   'ver',
          'recurso_tipo':     'juego',
          'recurso_nombre':   me.nombre_juego,
          'recurso_detalle': 'curso donde es visto el juego '+localStorage.codigo,
          'tipo juego':       localStorage.nombre_tipo_juego
      }
      me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
      let url_juego = ''
      let id_tipo = parseInt(item.id_tipo_juego)
      console.log(item)
      // return
      switch (id_tipo) {
        case 1:
            url_juego = 'ponchado'
            break;
        case 2:
            url_juego = 'sopa_letras'
            break;
        case 3:
            url_juego = 'jugarSeleccionSimple'
            break;
        case 4:
            url_juego = 'jugarMillonario'
            break;
        case 6:
            url_juego = 'rompecabezas'
            break;
      }
      let ruta = '/' + url_juego + '/' + item.id_juego + '/previsualizar'
      window.open(ruta, "_blank");
    },
    setValor(tipoJuego){
      let me = this
      if(tipoJuego == 1) {  me.url_juego = 'ponchado'               }
      if(tipoJuego == 2) {  me.url_juego = 'sopa_letras'            }
      if(tipoJuego == 3) {  me.url_juego = 'jugarSeleccionSimple'   }
      if(tipoJuego == 4) {  me.url_juego = 'jugarMillonario'        }
      if(tipoJuego == 6) {  me.url_juego = 'rompecabezas'           }
    },
    asignarCurso(item) {
      let me = this;
      let formData = new FormData();
      formData.append('codigo_curso', item.codigo);
      formData.append('id_juego', me.data_juego.id_juego);
      this.$http.post(this.$server_url + 'asignar_cursos_juego', formData)
      .then(function (res) {
          me.$vs.notify({
              text: res.data.message,
              color: 'primary',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
          })
          if(res.data.status == 1){
              let h_idinstitucion     = me.usuario.institucion_idInstitucion;
              let h_idusuario         = me.usuario.idusuario;
              let h_idgrupo           = me.usuario.id_group;
              let h_idasignatura      = localStorage.idasignatura
              let h_nombreasignatura  = localStorage.nombreasignatura
              let h_recursotipo       = 8; //8 = juego
              let datoHistorico       = {
                  'user_nombre':      me.usuario.nombres,
                  'user_apellido':    me.usuario.apellidos,
                  'user_email':       me.usuario.email,
                  'user_cedula':      me.usuario.cedula,
                  'recurso_accion':   'asignar',
                  'recurso_tipo':     'juego',
                  'recurso_nombre':   me.nombre_juego,
                  'recurso_detalle':  'asignado al curso '+item.codigo,
                  'tipo juego':       localStorage.nombre_tipo_juego
              }
              me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
          }
            me.getCursosDocente()
      })
      .catch(function (error) {})
    },
    verCalificaciones(item) {
      let me = this
      localStorage.id_tipo_juego     = item.id_tipo_juego
      localStorage.codigo_calif         = item.codigo
      localStorage.nombre_curso_calif   = item.nombre
      localStorage.id_curso_calif       = me.data_juego.id_juego
      localStorage.nombre_juego_calif   = me.data_juego.nombre_juego
      window.open('/docente/juegos_curso', '_blank');
    },
  }
}
</script>
