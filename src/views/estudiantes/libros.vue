<template>
<div>
    <vs-popup title="Confirmar" :active.sync="popupConfirmQuitar">
        <div align="center">
            <p>¿Está seguro de eliminar este libro?</p><br>
            <vs-button color="danger" type="filled" @click="acceptAlertQuitar">Aceptar</vs-button>
        </div>
    </vs-popup>
    <vs-prompt title="Agregar libro" @cancel="idlibro=''" @accept="acceptAlert" @close="close" acceptText="Aceptar" cancelText="Cancelar" :active.sync="activePrompt">
        <div class="con-exemple-prompt">
            <vs-alert active="true" color="success">
                Ingresa el código que se encuentra en tu libro.
            </vs-alert>
            <br>
            <vs-input icon-after="true" @keydown.space="(event) => event.preventDefault()" class="mt-4 w-full" icon="code" label-placeholder="MLE3-KJVBXXXXXX-XXX" v-model="codigo" />
        </div>
    </vs-prompt>
    <vx-card class="">
      <vs-button
        @click="activePrompt = true"
        color="#046AE7"
        gradient-color-secondary="#2f8ef0"
        type="gradient"
        icon-pack="feather"
        icon="icon-plus-circle"
        style="border-radius: 10px; box-shadow: 0 6px 16px rgba(4, 106, 231, 0.3); font-weight: 600; letter-spacing: 0.3px;">
        Agregar Libros
      </vs-button>
      <br><br>
      <div class="vx-row" v-if="libros.length > 0">
          <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in libros" :key="$index">
              <vx-card class="text-center">
                  <div slot="no-body">
                      <img v-if="item.weblibro != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/portada.png'" alt="Card image cap">
                      <img v-else class="responsive card-img-top" v-bind:src="$data_url+'tareas/img/'+item.portada" alt="Card image cap">
                  </div>
                  <p class="font-bold">
                      {{item.nombrelibro}}
                  </p>
                  <small>
                      {{item.descripcionlibro}}
                  </small>
                  <div class="w-3/3 ml-auto mt-3">
                      <!-- <vs-button color="primary" class="w-full mb-2" type="border" icon-pack="feather" @click="datolibro(item)" icon="icon-book">Libro Web</vs-button> -->
                    <vs-button
                      color="primary"
                      class="w-full mb-2"
                      type="border"
                      icon-pack="feather"
                      @click="datolibro(item)"
                      icon="icon-book">
                      {{ item.nombrelibro.toLowerCase().startsWith('folleto') ? 'Folleto web' : 'Libro Web' }}
                    </vs-button>
                  </div>
              </vx-card>
          </div>
      </div>
      <div class="libros-empty-state" v-else-if="!cargandoLibros" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:30px 20px 40px;">
        <div class="libros-empty-ilustracion" style="width:100%; max-width:220px; margin:0 auto 14px;">
          <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; display:block;" role="img" aria-label="El código del libro está impreso en las primeras páginas">
            <ellipse cx="160" cy="178" rx="120" ry="9" fill="#e2e8f0" opacity="0.6"/>
            <rect x="152" y="38" width="16" height="140" fill="#bfdbfe" opacity="0.5"/>
            <g>
              <rect x="42" y="38" width="110" height="140" rx="6" fill="#ffffff" stroke="#bfdbfe" stroke-width="2"/>
              <rect x="54" y="50" width="86" height="24" rx="5" fill="#dbeafe" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 3"/>
              <text x="97" y="66" text-anchor="middle" font-family="Menlo, Consolas, monospace" font-size="10" fill="#1d4ed8" font-weight="700">MLE3-XXXXX</text>
              <line x1="54" y1="90" x2="128" y2="90" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="54" y1="104" x2="110" y2="104" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="54" y1="118" x2="128" y2="118" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="54" y1="132" x2="90" y2="132" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
            </g>
            <g>
              <rect x="168" y="38" width="110" height="140" rx="6" fill="#ffffff" stroke="#bfdbfe" stroke-width="2"/>
              <line x1="186" y1="60" x2="260" y2="60" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="186" y1="74" x2="248" y2="74" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="186" y1="88" x2="260" y2="88" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="186" y1="102" x2="230" y2="102" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="186" y1="130" x2="260" y2="130" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
              <line x1="186" y1="144" x2="240" y2="144" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
            </g>
            <path d="M97 30 C 75 14, 50 12, 40 22" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 4"/>
            <circle cx="37" cy="24" r="12" fill="#2563eb"/>
            <text x="37" y="28" text-anchor="middle" font-family="Arial" font-size="13" fill="#ffffff" font-weight="700">1</text>
          </svg>
        </div>
        <h3 style="margin:0 0 8px; font-size:1.1rem; font-weight:600; color:#1e293b;">Aún no tienes libros agregados</h3>
        <p style="max-width:420px; color:#64748b; font-size:0.9rem; line-height:1.5; margin:0;">
          Cada libro físico trae un código único impreso en sus <strong>primeras páginas</strong> (como en la imagen).
          Presiona el botón <strong>"Agregar Libros"</strong> de arriba e ingresa ese código para empezar a usarlo aquí.
        </p>
      </div>
    </vx-card>
    <vs-prompt
      @cancel="idlibro=''"
      title="Abrir Ticket"
      @accept="abrirTicket"
      @close="close"
      :active.sync="popupTicket">
        <div class="con-exemple-prompt">
            <vs-input class="inputx mb-3 w-full" disabled label="Estudiante" v-model="ticket.estudiante" />
            <vs-input class="inputx mb-3 w-full" disabled label="Institucion" v-model="ticket.nombreInstitucion" />
            <vs-input class="inputx mb-3 w-full" disabled label="Codigo" v-model="ticket.codigo" />
            <vs-input class="inputx mb-3 w-full" disabled label="Motivo" v-model="ticket.descripcion" />
            <vs-textarea counter="500" style="width:100%;" :counter-danger.sync="counterDanger" label="Mensaje (Opcional)" v-model="ticket.observacion" />
        </div>
    </vs-prompt>
</div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            counterDanger: false,
            datosEstudiante:[],
            ticket:{
                nombreInstitucion:'',
                estudiante:'',
                usuario:'',
                institucion:'',
                codigo:'',
                descripcion:'',
                observacion:'',
                cedula:'',
            },
            popupTicket:false,
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
            planlector: [],
            usuario: [],
            codigo: '',
            isNavOpen: false,
            idLibroSelec: null,
            popupConfirmQuitar: false,
            codigoLibroSelec: '',
            miusuario: '',
            cargandoLibros: true,

        }
    },
    watch:{
      codigo(results){
        if(results !=""){
          this.codigo = results.replace(/\s/g, "");
        }
      }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.miusuario = this.usuario
    },
    mounted() {
        localStorage.removeItem('pag_inicio');
        localStorage.removeItem('pag_fin');
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
        this.getLibros()
    },
    methods: {
        async abrirTicket(){
            let me = this;
             if(me.ticket.codigo.length >= 25){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El codigo no puede superar los 25 caracteres.'
                    })
                return false;
            }
            if(me.ticket.observacion.length >= 500){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo no puede superar los 500 caracteres.'
                    })
                return false;
            }
            let formData = new FormData();
            formData.append('cedula',               me.ticket.cedula);
            formData.append('codigo',               me.ticket.codigo);
            formData.append('institucion_id',       me.ticket.institucion);
            formData.append('usuario_id',           me.ticket.usuario);
            formData.append('group_id',             "4");
            formData.append('descripcion',          me.ticket.descripcion);
            formData.append('observacion',          me.ticket.observacion);
            formData.append('nombreInstitucion',    me.ticket.nombreInstitucion);
            formData.append('ticket_asesor',        0)
            this.$http.post(this.$server_url+'ticket', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupTicket=false;
                    me.ticket.observacion = "";
                    me.ticket.cedula = "";
                    me.ticket.codigo = "";
                    me.ticket.institucion = "";
                    me.ticket.usuario = "";
                    me.ticket.descripcion = "";
                })
                .catch(function (error) {})
        },
        async getLibros() {
            let me = this;
            me.$vs.loading()
            let region  = localStorage.region
            this.$http.get(this.$server_url+'codigos_libros_estudiante/' + me.usuario.idusuario+'/'+me.usuario.institucion_idInstitucion+'/'+localStorage.periodo_id+'/'+region+'/4')
                .then(function (response) {
                    me.libros = response.data.libros
                    me.cargandoLibros = false
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.cargandoLibros = false
                    me.$vs.loading.close()
                })
        },
        datoplanlector(url) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombreplanlector
            let h_recursotipo = 1; //1 = libro
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'plan lector',
                'recurso_nombre': url.descripcionplanlector,
                'recurso_detalle': '',
            }
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.url = url.webplanlector;
            this.$router.push('/estudiante/libros/planlector');
        },
        datolibro(url) {
            let me = this;
            localStorage.url = url.weblibro;
            localStorage.puerto = url.puerto;
            localStorage.idasignatura = url.asignatura_idasignatura
            me.$vs.loading()
            let region  = localStorage.region
            this.$http.get(this.$server_url+'menu_unidades_libros/' + url.idlibro+'/'+region)
                .then(function (response) {
                    me.unidadesLibro = response.data
                    console.log(me.unidadesLibro)
                    for (let index = 0; index < me.unidadesLibro.length; index++) {
                        if (index == 0) {
                            localStorage.pag_inicio = me.unidadesLibro[index].pag_inicio
                        }
                        localStorage.pag_fin = me.unidadesLibro[index].pag_fin
                    }
                    let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                    let h_idusuario = me.miusuario.idusuario;
                    let h_idgrupo = me.miusuario.id_group;
                    let h_idasignatura = url.idasignatura
                    let h_nombreasignatura = url.nombreasignatura
                    let h_recursotipo = 1; //1 = libro
                    let datoHistorico = {
                        'user_nombre': me.miusuario.nombres,
                        'user_apellido': me.miusuario.apellidos,
                        'user_email': me.miusuario.email,
                        'user_cedula': me.miusuario.cedula,
                        'recurso_accion': 'ver',
                        'recurso_tipo': 'libro',
                        'recurso_nombre': url.nombrelibro,
                        'recurso_detalle': '',
                    }
                    me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
                    me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                    me.$vs.loading.close()
                    let route = me.$router.resolve({path: '/estudiante/libro/digital'});
                    window.open(route.href, '_blank');
                })
        },
        openConfirmQuitarLibro(item) {
            this.idLibroSelec = item.idlibro;
            this.codigoLibroSelec = item.codigo;
            this.popupConfirmQuitar = true;
        },
        acceptAlertQuitar() {
            let me = this;
            me.popupConfirmQuitar = false;
            let formData = new FormData();
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('codigo', me.codigoLibroSelec);
            formData.append('idlibro', me.idLibroSelec);
            this.$http.post(this.$server_url+'quitarlibroestudiante', formData)
                .then(function (response) {
                    me.idLibroSelec = null;
                    me.getLibros();
                    me.$vs.notify({
                        color: 'success',
                        title: 'Eliminado',
                        text: 'Libro Eliminado Correctamente'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        acceptAlert() {
          let me = this;
          let formData = new FormData();
          if (!me.codigo) {
            me.$vs.notify({
                color: 'warning',
                title: 'Ingrese un código',
            })
          } else {
            formData.append('codigo', me.codigo);
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('id_periodo', localStorage.periodo_id);
            formData.append('id_institucion', me.usuario.institucion_idInstitucion);
            this.$http.post(this.$server_url+'codigoslibros', formData)
              .then(function (response) {
                if(response.data.status == 5){
                  me.$vs.notify({
                      text: response.data.message,
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle',
                      time:6000
                  })
                  return
                }
                if (response.data.status == 0) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'danger',
                      title: 'Error',
                      text: 'El código ingresado, ya está en uso.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                    //Para abrir un ticket
                    me.ticket.codigo = response.data.codigo;
                    me.ticket.usuario = response.data.usuario;
                    me.ticket.institucion = response.data.institucion;
                    me.ticket.descripcion = "El código ingresado, ya está en uso.";
                    me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                    me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                    me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                    me.popupTicket = true;
                  }
                  else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
                if (response.data.status == 1) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'success',
                      title: 'Guardado',
                      text: 'Libro Agregado'
                  })
                }
                if (response.data.status == 2) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'warning',
                      title: 'Error',
                      text: 'El código ingresado, no existe.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                      //Para abrir un ticket
                      me.ticket.codigo = response.data.codigo;
                      me.ticket.usuario = response.data.usuario;
                      me.ticket.institucion = response.data.institucion;
                      me.ticket.descripcion = "El código ingresado, no existe";
                      me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                      me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                      me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                      me.popupTicket = true;
                  }
                  else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
                if (response.data.status == 4) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'warning',
                      title: 'Error',
                      text: 'El código ingresado, ha sido devuelto.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                      //Para abrir un ticket
                      me.ticket.codigo = response.data.codigo;
                      me.ticket.usuario = response.data.usuario;
                      me.ticket.institucion = response.data.institucion;
                      me.ticket.descripcion = "El código ingresado, ha sido devuelto";
                      me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                      me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                      me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                      me.popupTicket = true;
                  }else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
                if (response.data.status == 3) {
                  me.getLibros();
                  me.codigo = ''
                  me.$vs.notify({
                      color: 'warning',
                      title: 'Error',
                      text: 'El código ingresado, se encuentra bloqueado.'
                  })
                  if(response.data.realizarTicket == 'ok'){
                      //Para abrir un ticket
                      me.ticket.codigo = response.data.codigo;
                      me.ticket.usuario = response.data.usuario;
                      me.ticket.institucion = response.data.institucion;
                      me.ticket.descripcion = "El código ingresado, se encuentra bloqueado";
                      me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                      me.ticket.estudiante = response.data.datosEstudiante[0].estudiante;
                      me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                      me.popupTicket = true;
                  }else{
                      me.$vs.notify({
                      color: 'primary',
                      title: 'Mensaje',
                      text: 'Tiene un ticket abierto.'
                      })
                  }
                }
              })
              .catch(function (error) {})
            }
        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },
    },
}
</script>
<style scoped>
.libros-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px 40px;
}

.libros-empty-ilustracion {
  width: 100%;
  max-width: 320px;
  margin-bottom: 10px;
}

.libros-empty-ilustracion svg {
  width: 100%;
  height: auto;
}

.libros-empty-state h3 {
  margin: 10px 0 8px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
}

.libros-empty-state p {
  max-width: 460px;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
}
</style>
