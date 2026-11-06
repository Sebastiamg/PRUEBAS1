<template>
<div class="vx-row">
    <!------BARRA SUPERIOR-------->
    <div class="vx-col sm:w-3/4 w-full" style="font-size: 18px;">
        <div v-if="evaluaciones[0]===undefined">No existe evaluación</div>
        <vx-card v-else v-bind:title="evaluaciones[0].nombreasignatura" title-color="primary">
          <div class="vx-row mt-0">
            <div class="vx-col w-full" align="justify">
              <b>Inicia: </b> {{evaluaciones[0].fecha_inicio}} - <b>finaliza: </b> {{evaluaciones[0].fecha_fin}}<br>
              <b>Duración: </b> <span> {{evaluaciones[0].duracion}} minutos </span><br>
              <div v-if="evaluaciones[0].nombre_evaluacion"><b>Nombre Evaluación: </b> {{evaluaciones[0].nombre_evaluacion}}<br></div>
              <div v-if="evaluaciones[0].descripcion"><b>Descripción: </b> {{evaluaciones[0].descripcion}}<br></div>
              <div v-if="usuario.id_group===6 && previsualizar_eval!=1"><b>Grupo: </b> {{estudianteSelected.grupo}} <br></div>
            </div>
          </div>
          <ul v-if="previsualizar_eval==1 && usuario.id_group===6" align="center" class="mt-2 mb-0" style="border: 1px solid #D5D5D5; border-radius: 5px;">
            <vs-radio v-for="(grupos_g, key) in evaluaciones[0].grupos_evaluacion" :key="key" v-model="radios1" v-bind:vs-value="grupos_g" class="m-3" @input="verPreguntasEvaluacionGrupos()">
              Grupo {{grupos_g}}
            </vs-radio>
          </ul>
        </vx-card>
        <!-------INICIO SECCION RESPONDER---------->
        <vx-card class="mt-5 mb-6" id="seccionImprimir">
          <div class="w-full" align="center" v-if="volverActivo===true && previsualizar_eval!=1">
              <div class="mb-2">Esta evaluación aún no ha sido resuelta.</div>
          </div>
          <div class="text-center" v-else>
          <div cols="12" v-for="(item, index) in preguntas.items" :key="index" v-bind:id="'contenPreg'+(index+1)" style="display: none;" class="mb-4">
            <div class="mb-5" style="font-size: 20px;" align="center">
                <vs-divider v-if="index>0 && vertodo===true" />
                <div align="right">
                    <b>{{item.puntaje}}</b> / {{item.puntaje_pregunta}} pts<br>
                    {{item.nombre_tipo}}
                </div>
                <div align="left">
                    <b>{{ index+1 }}) <span v-html="renderLatex(item.descripcion)"></span></b> <br>
                </div>
                <img style="border-radius: 5px;" v-if="item.img_pregunta" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_pregunta" class="img-responsive mt-2 altura" min-width="350px" width="450px">
            </div>
            <ol type="a">
              <div align="left" style="font-size: 18px;">
                <!-----PREGUNTAS SELECCION---->
                <div v-if="item.id_tipo_pregunta===1 || item.id_tipo_pregunta===5 || item.id_tipo_pregunta===3">
                    <div v-for="(itemop, index) in item.opciones" :key="index">
                        <li>
                            <vs-checkbox disabled="true" class="mb-4" v-model="opcionesSelec" v-bind:vs-value="itemop.id_opcion_pregunta">
                                <span v-html="renderLatex(itemop.opcion)"></span>
                                <img style="border-radius: 5px;" v-if="itemop.img_opcion" v-bind:src="$data_url+'archivos/img/img_preguntas/'+itemop.img_opcion" class="img-responsive altura" width="300px">
                                <b v-if="itemop.tipo===1" style="color: #43D59B; font-size: 20px;" class="ml-2">✓</b>
                            </vs-checkbox>
                        </li>
                    </div>
                </div>
                  <!-----PREGUNTAS ESCRITAS---->
                <div v-if="item.id_tipo_pregunta===2 || item.id_tipo_pregunta===6">
                            <div align="right" class="mb-3" v-if="usuario.id_group != 4 && previsualizar_eval!=1">
                                <vs-input type="number" v-model="calificacionManual" style="display: inline-block; width: 80px;" />
                                <vs-button v-if="calificacionManual>=0 && calificacionManual<=item.puntaje_pregunta" style="display: inline-block; width: 80px; padding-left: 12px;" @click="calificarManual(item.puntaje, item.id_respuesta_pregunta)">calificar</vs-button>
                                <vs-button v-else disabled style="display: inline-block; width: 80px; padding-left: 12px;">calificar</vs-button>
                            </div>

                            <div v-for="(itemop, index1) in item.opciones" :key="index1">
                                <textarea disabled="true" v-bind:placeholder="item.respuesta" class="w-full respAbierta inputRespuesta" />
                                Respuesta correcta: <span v-html="renderLatex(itemop.opcion)"></span>
                    </div>
                    <div v-if="item.opciones.length <= 0">
                        <textarea disabled="true" v-bind:placeholder="item.respuesta" class="w-full respAbierta inputRespuesta" />
                    </div>
                </div>
              </div>
            </ol>
          </div>
        <div v-if="preguntas.items===undefined"></div>
        <div v-else>
          <vs-pagination class="mt-6" style="display:none;" color="success" v-if="iniciarActivo===true" :total="preguntas.items.length" v-model="currentx" @input="verPreguntaSelec(currentx-1)"></vs-pagination>
        </div>
        </div>
    </vx-card>
</div>

<!------BARRA DERECHA-------->
<div class="vx-col sm:w-1/4 w-full">
    <vx-card>
        <div align="center" v-if="previsualizar_eval==1 && usuario.id_group===6">
            <vs-alert color="primary" title="Aviso" active="true" >
                Las respuestas no se muestran en el perfil del estudiante.
            </vs-alert>
        </div>

        <div align="center" v-if="previsualizar_eval!=1 && preguntasPendientesRevision.length>0">
            <vs-alert color="warning" title="Aviso" active="true" class="mb-4">
                Existen preguntas pendientes de revisión por el docente.
            </vs-alert>
            <div class="btn-group mb-6">
                <vs-button v-for="(itemrev, indexrev) in preguntasPendientesRevision" :key="indexrev" @click="vertodo=false; currentx=(preguntasPendientesRevision[indexrev]+1); verPreguntaSelec(preguntasPendientesRevision[indexrev]+1)" color="warning" type="border" class="m-1">
                    {{ preguntasPendientesRevision[indexrev]+1 }}
                </vs-button>
            </div>
        </div>
        <div v-if="evaluaciones[0]===undefined"></div>
        <div v-else>
        <div v-if="previsualizar_eval!=1" align="center">
            <vs-divider v-if="usuario.id_group === 6" class="mt-2"> Estudiante </vs-divider>
            <v-select v-if="usuario.id_group === 6" class="mb-6 w-full" @input="verEvalEstudiante()" v-model="estudianteSelected" :options="estudiantes" :value="estudianteSelected" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            <div v-if="estudianteSelected">
              <b>Cédula:</b>
              <div v-if="estudianteSelected.fecha_inicio_evaluacion">
                <p>{{ estudianteSelected.cedula }}</p>
                <b>Fecha inicio evaluación:</b>
                <p>{{ estudianteSelected.fecha_inicio_evaluacion }}</p>
                <b>Fecha finalización:</b>
                <p>{{ estudianteSelected.fecha_finalizar }}</p>
                <b>Dirección IP:</b>
                <p>{{ estudianteSelected.ip }}</p>
              </div>
              <!--boton para resetear-->
              <vs-button class="bg-dark mt-2" v-if="estudianteSelected && preguntas.items && usuario.id_group == 6" @click="confirmResetearEvaluacion()"><i class="fa-solid fa-arrow-right-arrow-left"></i> Resetear evaluación</vs-button>
            </div>
            <vs-divider class="mt-2"> Calificación </vs-divider>
            <div v-if="volverActivo===true">
                El estudiante seleccionado aún no ha realizado la evaluación.
                <div style="font-size: 50px; color: #2974FE;" class="mb-4">0<span style="font-size: 30px;"> / {{evaluaciones[0].puntos}}</span></div>
            </div>
            <div v-else>
                <div style="font-size: 50px; color: #2974FE;" class="mb-4">{{calificacionObtenida}}<span style="font-size: 30px;"> / {{evaluaciones[0].puntos}}</span></div>
            </div>
        </div>
        </div>

        <div align="center" v-if="volverActivo===false">
            <vs-divider> Preguntas </vs-divider>
            <div class="btn-group">
            <vs-button v-for="(item, index) in preguntas.items" :key="index" @click="vertodo=false; currentx=(index+1); verPreguntaSelec(index)" color="primary" type="border" class="m-1">
                {{ index+1 }}
                <!--<div v-if="preguntas.items[index].id_tipo_pregunta===2">pendiente</div>-->
            </vs-button>
            </div>
        </div>


        <div align="center">
            <vs-button v-if="volverActivo===false" color="dark" type="border" class="mt-6 m-1" @click="mostrarTodo()">Ver todo</vs-button>


            <vs-button v-if="volverActivo===false" color="warning" type="border" class="mt-6 m-1" @click="f_imprimirEvaluacion(0)">&nbsp;&nbsp;&nbsp;&nbsp;PDF&nbsp;&nbsp;&nbsp;&nbsp;</vs-button>

            <vs-button v-if="volverActivo===false && usuario.id_group != 4" color="primary" type="border" class="mt-6 m-1" @click="f_imprimirEvaluacion(1)">&nbsp;&nbsp;&nbsp;&nbsp;PDF con respuesta&nbsp;&nbsp;&nbsp;&nbsp;</vs-button>

            <vs-button v-if="usuario.id_group === 4" color="success" type="border" class="mt-6" @click="$router.push('/estudiante/evaluaciones')"><b>← Volver</b></vs-button>

            <vs-button v-else color="success" type="border" class="mt-6 m-1" @click="$router.push('/evaluaciones')"><b>← Volver</b></vs-button>
        </div>

    </vx-card>
    </div>

</div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
import VueRouter from 'vue-router'
import { renderLatex } from '@/utils/renderLatex'
import 'mathlive/mathlive-static.css'
import 'mathlive/mathlive-fonts.css'
import 'katex/dist/katex.min.css'
var respondidas = [];
var x = null;
export default {
    data() {
        return {
            preguntas: [],
            pregunta: {
                descripcion: '',
                id_tema: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: '',
                img_pregunta: '',
                img_respuesta: '',
                img_opcion1: '',
                img_opcion2: '',
                img_opcion3: ''
            },
            evaluaciones: [],
            evaluacion: {
                nombre: '',
                asignatura: '',
                descripcion: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: '',
                duracion: '',
                nombre_evaluacion: ''
            },
            usuario: [],
            estudiante: null,
            nombre_estudiante: null,
            apellido_estudiante: null,
            opcionesSelec: [],
            activeConfirm: false,
            urlOrigen: '',
            iniciarActivo: true,
            currentx: 1,
            volverActivo: false,
            verbtniniciar: true,
            calificacion: 0,
            id_evalRevisar: '',
            estudianteSelected: '',
            estudiantes: [],
            puntaje: '',
            previsualizar_eval: 1,
            grupo_selected: '',
            radios1: 1,
            respuestasEstudiante: [],
            calificacionObtenida: '',
            respuestasEscritas: [],
            interarResEscr: 0,
            grupo: '',
            vertodo: false,
            calificacionManual: 0,
            grupoSelectedVal: 1,
            preguntasPendientesRevision: [],
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr
    },
    created() {
        this.id_evalRevisar = localStorage.getItem("id_evalRevisar");
        this.previsualizar_eval = localStorage.getItem("previsualizar_eval");
        this.$vs.loading()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        var url = location.pathname.split('/');
        var urlBack = window.location.href
        var urlV = urlBack.split('/')
        this.urlOrigen = urlV[0] + '/' + urlV[1] + '/' + urlV[2] + '/estudiante/evaluaciones'
    },
    mounted() {
        this.datosInicio(this.id_evalRevisar, this.previsualizar_eval)
    },
    methods: {
        renderLatex,
        f_imprimirEvaluacion(TipoImpresion){
            let me = this
            localStorage.setItem('TipoImpresion',TipoImpresion)
            me.$router.push('/evaluacion_imprimir')
        },
      confirmResetearEvaluacion(){
        let me = this
        me.$vs.dialog({
            type: 'confirm',
            color: 'warning',
            title: 'Resetear evaluación',
            text: '¿Está seguro que desea resetear la evaluación' + ' del estudiante '+me.estudianteSelected.label+'?',
            acceptText: 'Aceptar',
            accept: () => {
                me.resetearEvaluacion()
            }
        })
      },
      resetearEvaluacion(){
        let me = this
        let formData = new FormData();
        formData.append('id_estudiante', me.estudianteSelected.id);
        formData.append('id_evaluacion',me.id_evalRevisar)
        me.$vs.loading()
        me.$http.post(me.$server_url+'resetearEvaluacion',formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
                text: 'Ocurrio algun error',
                color: 'danger',
                iconPack: 'feather'
            })
            return
          }
          me.verEvalEstudiante()
          me.datosInicio(me.id_evalRevisar, me.previsualizar_eval)
          me.calificacionObtenida = '',
          me.$vs.notify({
                text: 'Evaluación reseteada correctamente',
                color: 'success',
                iconPack: 'feather'
            })

        })
        .catch(function (error) {
          console.log(error)
            me.$vs.loading.close()
            me.$vs.notify({
                text: 'Error al resetear la evaluación',
                color: 'danger',
                iconPack: 'feather'
            })
        })

      },
      datosInicio(id_evalRevisar, previsualizar_eval) {
          let me = this;
          let formData = new FormData();
          formData.append('codigo', localStorage.codigo);
          formData.append('evaluacion', id_evalRevisar);

          me.$http.post(this.$server_url+'estudiantesEvalCurso', formData)
              .then(function (response) {
                  if (response.data[0] === undefined) {
                      if( me.previsualizar_eval!=1 ){
                          me.$vs.notify({
                              text: 'Ningun estudiante ha realizado esta evaluación.',
                              color: 'warning',
                              iconPack: 'feather'
                          })
                      }
                      me.$vs.loading.close()
                  } else {
                      me.estudiantes = response.data;
                      me.estudianteSelected = {
                          id: response.data[0].id,
                          label: response.data[0].label,
                          grupo: response.data[0].grupo,
                          cedula: response.data[0].cedula,
                          fecha_inicio_evaluacion: response.data[0].fecha_inicio_evaluacion,
                          fecha_finalizar: response.data[0].fecha_finalizar,
                          ip: response.data[0].ip
                      }
                      me.grupoSelectedVal = response.data[0].grupo
                      me.nombre_estudiante = response.data[0].label;
                  }

                  me.$http.get(me.$server_url+'evaluacionEstudiante/' + id_evalRevisar)
                      .then(function (response) {
                          if (response.data.length > 0) {
                              me.evaluaciones = response.data

                              me.$http.get(me.$server_url+'getRespuestas/' + id_evalRevisar)
                              .then(function (response) {
                                  var pregOpcion = response.data.items;
                                  if (pregOpcion === undefined) {
                                      me.$vs.notify({
                                          text: 'Esta evaluación aun no tiene preguntas asignadas',
                                          color: 'warning',
                                          iconPack: 'feather'
                                      })
                                      me.$vs.loading.close()
                                      return
                                  }

                                  if (previsualizar_eval == 1) {
                                      me.verPreguntasEvaluacionGrupos();
                                      me.iniciar();
                                  } else {

                                      me.verEvalEstudiante();
                                      me.iniciar();
                                  }
                              })
                              .catch(function (error) {
                                  console.log(error);
                              })
                          } else {
                              alert('No existen preguntas para esta evaluación');
                              //window.location.href = this.urlOrigen;
                          }
                      })
                      .catch(function (error) {
                          console.log(error);
                      })
              })
              .catch(function (error) {
                  console.log(error);
              })



      },
        getEvaluacion(item) {
            let me = this
            var formData = new FormData();
            if (me.usuario.id_group === 4) {
                formData.append('estudiante', me.usuario.idusuario);
            } else {
                formData.append('estudiante', me.estudianteSelected.id);
            }
            formData.append('evaluacion', me.id_evalRevisar);
            me.$http.post(this.$server_url+`verifRespEvaluacion`, formData).then(res => {
                if (res.data === 0) {
                    me.volverActivo = true
                } else {
                    me.volverActivo = false
                    me.calificacionObtenida = (res.data[0].calificacion).toFixed(2)
                    localStorage.calificacionImprimir = me.calificacionObtenida +'/'+ me.evaluaciones[0].puntos
                }
                me.$vs.loading.close()
            })
        },
        iniciar() {
            let me = this
            if (me.preguntas.items === undefined) {
                console.log();
            } else {
                me.iniciarActivo = true;
                for (let j = 1; j <= me.preguntas.items.length; j++) {
                    document.getElementById("contenPreg" + j).style.display = "none";
                }
                me.verbtniniciar = false;
                document.getElementById("contenPreg1").style.display = "block"; ///muestra la primera pregunta
            }
            me.$vs.loading.close()
        },
        verPreguntaSelec(index) {
            let me = this
            for (let i = (me.preguntas.items.length + 1); i <= (me.respuestasEscritas.length + me.preguntas.items.length); i++) {
                document.getElementById("contenPregEscr" + i).style.display = "none";
            }

            for (let j = 1; j <= me.preguntas.items.length; j++) {
                document.getElementById("contenPreg" + j).style.display = "none";
            }
            try{
                document.getElementById("contenPreg" + (index + 1)).style.display = "block";
            }catch (error){

            }

        },
        verEvalEstudiante() {
            let me = this;
            if (me.estudianteSelected.grupo === undefined) {
                me.$vs.notify({
                    text: 'Ningún estudiante ha respondido esta evaluación todavía.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.grupo = me.estudianteSelected.grupo;
            var estudiante;
            if (me.usuario.id_group === 4) {
                me.grupo = localStorage.getItem("grupo_estudiante")
                estudiante = me.usuario.idusuario
                localStorage.nombresImprimir = me.usuario.nombres + ' ' + me.usuario.apellidos
            } else {
                estudiante = me.estudianteSelected.id
                localStorage.nombresImprimir = me.estudianteSelected.label
            }

            if( estudiante===undefined ){
                console.log('no existen estudiantes');
            }else{
                let formData = new FormData();
                localStorage.grupoevalImprimir = me.grupo
                localStorage.estudianteEvalImprimir = estudiante
                formData.append('grupo', me.grupo);
                formData.append('evaluacion', me.id_evalRevisar);
                formData.append('estudiante', estudiante);
                me.$vs.loading()
                me.$http.post(this.$server_url+'pregEvaluacionEstudiante', formData)
                .then(function (response) {
                    if (response.data.length === 0) {
                        me.preguntasPendientesRevision=[];
                        me.preguntas=[];
                        me.calificacionObtenida=0;
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'El estudiante seleccionado no ha resuelto la evaluación',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.preguntasPendientesRevision=[];
                        me.calificacionObtenida = '';
                        me.preguntas = response.data;
                        me.getEvaluacion(me.id_evalRevisar);
                        me.currentx = 1;

                        var resps = []
                        var respString = []
                        for (var i = 0; i < response.data.items.length; i++) {
                            respString = (response.data.items[i].respuesta).split(',')
                            for (var j = 0; j < respString.length; j++) {
                                resps.push(parseInt(respString[j]))
                            }
                            respString = []
                        }
                        me.opcionesSelec = resps;


                        for (var i = 0; i < response.data.items.length; i++) {
                            if( response.data.items[i].id_tipo_pregunta === 6 || response.data.items[i].id_tipo_pregunta === 2 ){
                                me.preguntasPendientesRevision.push(i)
                            }
                        }

                        me.$vs.loading.close()
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            }

        },
        verPreguntasEvaluacionGrupos() {
            let me = this
            let formData = new FormData();
            formData.append('grupo', me.radios1);
            formData.append('evaluacion', me.id_evalRevisar);
            me.$http.post(this.$server_url+`pregEvaluacionGrupo`, formData).then(res => {
                if (res.data.length === 0) {
                    // me.volverActivo=true
                    me.$vs.loading.close()
                } else {
                    me.preguntas = res.data;
                    me.currentx = 1;
                }
            })
        },
        mostrarTodo() {
            let me = this
            me.vertodo = true;
            if (me.preguntas.items === undefined) {
                console.log();
            } else {
                for (let j = 1; j <= me.preguntas.items.length; j++) {
                    document.getElementById("contenPreg" + j).style.display = "block";
                }
            }

            for (let j = (me.preguntas.items.length + 1); j <= (me.respuestasEscritas.length + me.preguntas.items.length); j++) {
                document.getElementById("contenPregEscr" + j).style.display = "block";
            }

        },
        calificarManual(puntaje, id_respuesta) {
            let me = this
            me.calificacionObtenida = (parseFloat(me.calificacionManual) + (parseFloat(me.calificacionObtenida) - parseFloat(puntaje))).toFixed(2);
            me.preguntasPendientesRevision=[]
            let formData = new FormData();
            formData.append('estudiante', me.estudianteSelected.id);
            formData.append('calificacion', me.calificacionObtenida);
            formData.append('evaluacion', me.id_evalRevisar);
            formData.append('puntaje', me.calificacionManual);
            formData.append('id_respuesta', id_respuesta);

            me.$http.post(this.$server_url+`modificarEvaluacion`, formData).then(res => {
                me.verEvalEstudiante()
                me.$vs.notify({
                    text: 'Calificación guardada correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
            })
            me.calificacionManual = 0;
        },
        imprimirEval(){
            let me = this
            me.mostrarTodo()
            var ficha = document.getElementById('seccionImprimir');
            window.print();
            /*var ficha = document.getElementById('seccionImprimir');
            var ventimp = window.open(' ', 'popimpr');
            ventimp.document.write( ficha.innerHTML );
            ventimp.document.close();
            ventimp.print( );
            ventimp.close();*/
        }
    }
}
</script>

<style>
.inputRespuesta {
    height: 80px;
    border-radius: 5px;
    border: 1px solid #d5d5d5;
    font-size: 18px;
    padding: 5px 10px 5px 10px;
    resize: vertical;
}

.altura{
    max-height: 350px;
}
</style>
