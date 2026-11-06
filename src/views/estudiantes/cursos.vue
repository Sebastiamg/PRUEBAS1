<template>
<div id="knowledge-base-category-page">
    <vs-popup title="Seleccione su institución" :active.sync="popupActive">
        <p class="mb-6">Por favor seleccione la institución a la que pertenece antes de continuar.</p>
        Ciudad:
        <v-select class="w-full mb-6" :options="ciudades" v-model="ciudad" @input="verInstCiudad()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        Institución:
        <v-select class="w-full mb-6" :options="instituciones" v-model="institucion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        <vs-button class="w-full mt-4 mb-1" @click="asignarInstitucion()" color="success" type="filled">Guardar</vs-button>
    </vs-popup>
    <vs-button @click="activePrompt = true" color="dark" type="relief">Agregar Curso</vs-button>
    <vs-prompt title="Agregar Codigo" @cancel="idlibro=''" @accept="acceptAlert" @close="close" acceptText="Aceptar" cancelText="Cancelar" :active.sync="activePrompt">
      <div class="con-exemple-prompt">
        <vs-alert active="true" color="success">
            Ingresa el código del curso.
        </vs-alert>
        <br>
        <vs-input icon-after="true" class="mt-4 w-full" icon="code" label-placeholder="eJz0xExx" v-model="codigo" />
      </div>
    </vs-prompt>
    <div class="vx-row mt-4 match-height">
        <div class="vx-col w-full sm:w-1/2 md:w-1/3 mb-base" v-for="(section,index) in cursos" :key="index">
          <vx-card :title="section.cursos.nombre" :style="pendientesPorCurso[section.cursos.idcurso] > 0 ? 'border:2px solid #fbbf24; border-radius:8px;' : ''">
              <div v-if="pendientesPorCurso[section.cursos.idcurso] > 0" style="display:flex; align-items:center; gap:6px; background:#fffbeb; border:1px solid #fde68a; color:#92400e; font-size:12px; font-weight:600; padding:6px 10px; border-radius:999px; width:fit-content; margin-bottom:10px;">
                <vs-icon icon="assignment_late" size="14px" color="#d97706"></vs-icon>
                {{ pendientesPorCurso[section.cursos.idcurso] }} tarea{{ pendientesPorCurso[section.cursos.idcurso] == 1 ? '' : 's' }} pendiente{{ pendientesPorCurso[section.cursos.idcurso] == 1 ? '' : 's' }}
              </div>
              <p class="text-center">
                  <img src="@/assets/images/pages/graphic-1.png" alt="graphic" width="100" class="mx-auto">
              </p>
              <vs-list>
                  <vs-list-item v-if="section.docente.length > 0" icon-pack="feather" icon="icon-check" title="Docente" :subtitle="section.docente[0].docente"></vs-list-item>
                  <vs-list-item icon-pack="feather" icon="icon-check" title="Área" :subtitle="section.cursos.seccion"></vs-list-item>
                  <vs-list-item icon-pack="feather" icon="icon-check" title="Paralelo" :subtitle="section.cursos.aula"></vs-list-item>
                  <vs-list-item icon-pack="feather" icon="icon-check" title="Código" :subtitle="section.cursos.codigo"></vs-list-item>
                  <vs-list-item icon-pack="feather" icon="icon-check" title="Actualizado" :subtitle="section.cursos.updated_at"></vs-list-item>
              </vs-list>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <vs-button @click="getIfNecesidadEducativa(section.cursos.codigo);showModal = true; tmpSeccion= section.cursos;abrirCurso(section.cursos);" color="primary" type="border">Ver contenido</vs-button>
                <vs-button v-if="pendientesPorCurso[section.cursos.idcurso] > 0" @click="verClase(section.cursos)" color="#d97706" type="filled" icon-pack="feather" icon="icon-alert-circle">Ver tareas pendientes</vs-button>
              </div>
          </vx-card>
        </div>
    </div>
    <!-- <button id="show-modal" @click="showModal = true">Show Modal</button> -->
    <!-- use the modal component, pass in the prop -->
    <div v-if="showModal" @close="showModal = false">
        <transition name="modal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">

                        <div class="modal-header">
                            <slot name="header">
                                <b>¿Qué contenido desea visualizar?</b>
                            </slot>
                        </div>

                        <div class="modal-body">
                            <slot name="body">
                                <div class="text-center">
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="verClase(tmpSeccion)">
                                        <p><img :src="$data_url+'archivos/upload/iconos/estudiante-curso/tareas.png'" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Mis tareas</b> </p>
                                    </div>
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="verProyectos(tmpSeccion)">
                                        <p><img :src="$data_url+'archivos/upload/iconos/estudiante-curso/proyectos.png'" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Proyectos</b> </p>
                                    </div>
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="verForo(tmpSeccion)">
                                        <p><img :src="$data_url+'archivos/upload/iconos/estudiante-curso/foro.png'" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Foros</b> </p>
                                    </div>
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="verMaterial(tmpSeccion)">
                                        <p><img :src="$data_url+'archivos/upload/iconos/estudiante-curso/material.png'" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Material de apoyo</b> </p>
                                    </div>
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="verEvaluaciones(tmpSeccion)">
                                        <p><img :src="$data_url+'archivos/upload/iconos/estudiante-curso/evaluacion.png'" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Evaluaciones</b> </p>
                                    </div>
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="verJuegos(tmpSeccion)">
                                        <p><img :src="$data_url+'archivos/upload/iconos/estudiante-curso/juegos.png'" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Zona de diversión</b> </p>
                                    </div>
                                    <div class="m-3 p-2 btn-opciones" type="border" @click="$router.push('/estudiante/fichas')">
                                        <p><img src="@/assets/images/libro/ficha.png" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Fichas</b> </p>
                                    </div>
                                    <div v-if="simulador > 0" class="m-3 p-2 btn-opciones" type="border" @click="$router.push('/simulador/estudiante')">
                                        <p><img src="@/assets/images/glosario/simulacion.png" width="100" height="110px" alt="" srcset=""></p>
                                        <p><b>Simulador</b> </p>
                                    </div>
                                    <div  v-if="ifHaveNecesidad" class="m-3 p-2 btn-opciones" @click="$router.push('/estudiante/necesidades-educativas')" type="border">
                                      <p><img src="@/assets/images/home/docenteHome/neet.png" width="100" height="110px" alt="" srcset=""></p>
                                      <p><b>Necesidades Educativas</b> </p>
                                  </div>
                                </div>
                            </slot>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                                <vs-button style="margin-top:-5px" class="modal-default-button" color="danger" @click="showModal = false">
                                    Cerrar
                                </vs-button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import historicomix from '../../mixins/historicomix'
Vue.use(axios)
import {
    mapState
} from 'vuex'
export default {
  mixins: [historicomix],
    data() {
        return {
            showModal: false,
            popupActive: false,
            instituciones: [],
            ciudades: [],
            ciudad: '',
            institucion: '',
            curso: [],
            usuario: [],
            activePrompt: false,
            menuOpciones: false,
            isNavOpen: false,
            codigo: '',
            tmpSeccion: '',
            simulador:0,
            //variables para necesidad educativa
            ifHaveNecesidad:false,
            //fin variables para necesidad educativa
            pendientesPorCurso: {},
        }
    },
    computed: {
        ...mapState(['cursos'])
    },
    watch: {
        cursos(lista){
            this.cargarPendientesPorCurso(lista)
        }
    },
    created() {
        localStorage.removeItem('codigo');
        localStorage.removeItem('idcurso');
        localStorage.removeItem('curso_foro');
        localStorage.removeItem('curso_proyecto');
        localStorage.removeItem('curso_material');
        localStorage.removeItem('curso_juego');
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.menuOpciones = false;

    },
    methods: {

        //cuenta real de tareas pendientes por curso, con el mismo endpoint
        //que usa la pantalla de "Tareas Pendientes" (tareasp.vue), para que
        //el numero coincida con lo que el estudiante ve al entrar al curso
        cargarPendientesPorCurso(lista){
            let me = this
            if (!lista || lista.length == 0 || !me.usuario || !me.usuario.idusuario) return
            lista.forEach(function(section){
                let idcurso = section.cursos && section.cursos.idcurso
                if (!idcurso || me.pendientesPorCurso[idcurso] !== undefined) return
                me.$http.get(me.$server_url+'tareaEstudiantePendiente?idcurso='+idcurso+'&idusuario='+me.usuario.idusuario)
                    .then(function(res){
                        me.$set(me.pendientesPorCurso, idcurso, (res.data || []).length)
                    })
                    .catch(function(){
                        me.$set(me.pendientesPorCurso, idcurso, 0)
                    })
            })
        },
        abrirCurso(data){
            let me = this;
            localStorage.setItem('idasignatura',data.id_asignatura)
            localStorage.setItem('codigo_curso',data.codigo)
            localStorage.setItem('nombreasignatura',data.nombreasignatura)
            me.getSimuladoresEstudiante(data.codigo)
        },
        //simulador estudiante
         getSimuladoresEstudiante(codigo_curso) {
            let me = this;
            this.$http.get(this.$server_url+'simulador?estudiante=yes'+'&codigo_curso='+codigo_curso)
                .then(function (res) {
                    me.simulador = res.data.length;
                    console.log(me.simulador)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getCurso() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'estudianteCurso?idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.curso = response.data.items[0].cursos;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()

                })
        },
        verClase(clase) {
          let me = this
          localStorage.idcurso    = clase.idcurso;
          localStorage.codigo     = clase.codigo;
          this.$router.push('/estudiante/curso/virtual');
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
                me.$vs.loading()
                this.$http.post(this.$server_url+'addClase', formData)
                    .then(function (response) {
                        me.$vs.loading.close()

                        me.getCurso();

                        if(response.data.status =='1'){
                            me.$vs.notify({
                            text: response.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                            })


                            me.codigo = ''
                            window.location.reload();

                        }else{
                            me.$vs.notify({
                            text: response.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                            })


                            me.codigo = ''
                        }



                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            }

        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },
        verEvaluaciones(section) {
            localStorage.codigo = section.codigo;
            localStorage.idcurso = section.idcurso;
            this.$router.push(`/estudiante/evaluaciones`);
        },
        verForo(section) {
            let me = this;
            localStorage.curso_foro = JSON.stringify(section);
            me.$router.push(`/estudiante/foro`);
        },
        verProyectos(section) {
            let me = this;
            localStorage.curso_proyecto = JSON.stringify(section);
            me.$router.push(`/estudiante/proyectos2`);
        },
        verMaterial(section) {
            let me = this;
            console.log(section)
            localStorage.curso_material = JSON.stringify(section);
            me.$router.push(`/estudiante/material`);
        },
        verJuegos(section) {
            let me = this;
            // console.log(section)
            localStorage.curso_juego = JSON.stringify(section);
            me.$router.push(`/estudiante/zonadiversion`);
        },
        getInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'verificarInstitucion/' + me.usuario.idusuario)
                .then(function (response) {
                    if (response.data[0].institucion_idInstitucion === null) {
                        me.getCiudad();
                        me.popupActive = true
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getCiudad() {
            let me = this;
            this.$http.get(this.$server_url+'ciudades')
                .then(function (response) {
                    me.ciudades = response.data;
                })
                .catch(function (error) {})
        },
        verInstCiudad() {
            let me = this;
            this.$http.get(this.$server_url+'verInstitucionCiudad/' + me.ciudad.id)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
      asignarInstitucion() {
          let me = this;
          if (me.institucion === '' || me.institucion === null) {
              me.$vs.notify({
                  text: 'Seleccione una institución antes de guardar',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
              });
              return;
          }
          var formData = new FormData();
          formData.append("institucion", me.institucion.id);
          formData.append("usuario", me.usuario.idusuario);
          this.$http.post(this.$server_url+'asignarInstitucion', formData)
              .then(function (response) {
                  me.popupActive = false;
                  me.$vs.notify({
                      text: 'Institución guardada exitosamente',
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  });
              })
              .catch(function (error) {
                  console.log(error);
              })
      },
      //*********NECESIDADES EDUCATIVAS****
      getIfNecesidadEducativa(curso){
        let me = this
        this.$http.get(this.$server_url+'ifAsignadoCurso/'+curso)
          .then(function (res) {
            if(res.data.length > 0){
              me.ifHaveNecesidad = true
            }else{
              me.ifHaveNecesidad = false
            }
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
      },
    },
    components: {
        'v-select': vSelect
    },
    mounted() {
        this.$store.dispatch('getTareas')
        this.cargarPendientesPorCurso(this.cursos)
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
        this.getCurso();
        this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
        if (this.linkEvaluacion) {
            this.urlBack = window.location.href
            this.urlV = this.urlBack.split('/')
            this.urlOrigen = this.urlV[0] + '/' + this.urlV[1] + '/' + this.urlV[2]
            this.vectorLink = (this.linkEvaluacion).split('-')
            this.evaluacionUrl()
        }
        this.getInstitucion();
    }
}
</script>

<style lang="css">
.modal-mask {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 700px;
    z-index: 999;
    margin: 0px auto;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
    margin-top: 10px;
    color: #42b983;
}

.modal-body {
    margin: 5px 0;
}

.modal-default-button {
    float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.btn-opciones {
    display: inline-block;
    cursor: pointer;
    background-color: rgb(255, 252, 248);
    padding: 5px;
    border: solid 1px rgb(248, 240, 231);
    border-radius: 10px;
}

.btn-opciones:hover {
    background-color: rgb(248, 240, 231);
}
</style>
