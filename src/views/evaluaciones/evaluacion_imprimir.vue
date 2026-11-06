<template>
    <div class="vx-row p-8">
        <!------BARRA SUPERIOR-------->
        <div class="oculto-impresion flex" style="justify-content: end;width: 98%;">
            <vs-button v-if="usuario.id_group === 6" color="primary" type="border" class="ml-4" @click="$router.go(-1)"><b>← Volver</b></vs-button>
        </div>
        <div class="vx-col w-full mt-2" style="font-size: 18px;">
            <div v-if="evaluaciones[0]===undefined">No existe evaluación</div>
            <div style="border-radius: 7px; background-color: white; padding: 25px;">
                <!-- SI HAY CALIFICACION -->
                <div v-if="nombresImprimir">
                    <div style="display: flex; align-items: center; gap: 15px; padding: 10px; justify-content: center;">
                        <img :src="$data_url+'archivos/instituciones_logos/'+logo_institucion" style="width: 80px; height: 80px; object-fit: cover;" />
                        <b style="font-size: 1.5rem; color: #333; font-family: 'Arial', sans-serif;">{{nombre_institucion}}</b>
                    </div>
                    <div class="vx-row mt-0" style="font-size: 1.1rem; line-height: 1.6; color: #333;">
                        <div class="vx-col w-full" align="justify">
                            <b>Asignatura: </b>{{evaluaciones[0].nombreasignatura}}<br>
                            <b>Estudiante: </b>{{nombresImprimir}}<br>
                            <b>Calificación: </b>{{calificacionImprimir}}<br>
                            <b>Fecha: </b>{{evaluaciones[0].fecha_fin}}<br>
                            <div v-if="evaluaciones[0].nombre_evaluacion"><b>Nombre Evaluación: </b> {{evaluaciones[0].nombre_evaluacion}}<br></div>
                            <div v-if="evaluaciones[0].descripcion"><b>Descripción: </b> {{evaluaciones[0].descripcion}}<br></div>
                            <div v-if="usuario.id_group === 6 && previsualizar_eval != 1"><b>Grupo: </b>{{estudianteSelected.grupo}}<br></div>
                        </div>
                    </div>
                </div>

                <!-- SI NO HAY CALIFICACION -->
                <div v-else>
                    <div style="display: flex; align-items: center; gap: 15px; padding: 10px; justify-content: center;">
                        <img :src="$data_url+'archivos/instituciones_logos/'+logo_institucion" style="width: 80px; height: 80px; object-fit: cover;" />
                        <b style="font-size: 1.5rem; color: #333; font-family: 'Arial', sans-serif;">{{nombre_institucion}}</b>
                    </div>
                    <div class="vx-row mt-0" style="font-size: 1.1rem; line-height: 1.6; color: #333;">
                        <div class="vx-col w-full" align="justify">
                            <b>Asignatura: </b>{{evaluaciones[0].nombreasignatura}}<br>
                            <b>Nombre: </b><br>
                            <b>Curso: </b><br>
                            <b>Fecha: </b><br>
                        </div>
                    </div>
                </div>

                <div class="w-full oculto-impresion">
                    <ul v-if="previsualizar_eval==1 && usuario.id_group===6" align="center" class="mt-2 mb-0" style="border: 1px solid #D5D5D5; border-radius: 5px; height: 50px;">
                        <vs-radio v-for="(grupos_g, key) in evaluaciones[0].grupos_evaluacion" :key="key" v-model="radios1" v-bind:vs-value="grupos_g" class="m-3" @input="verPreguntasEvaluacionGrupos()">
                            Grupo {{grupos_g}}
                        </vs-radio>
                        <vs-button v-if="usuario.id_group === 6"  color="primary" class="ml-6" style="display: inline-block;" @click="verPreguntasEvaluacionGrupos()"><ion-icon name="shuffle-outline"></ion-icon> Nueva combinación</vs-button>
                        <vs-button color="warning" class="ml-6" style="display: inline-block;" @click="imprimirEval()">Generar reporte</vs-button>
                        <vs-button v-if="usuario.id_group === 4" color="primary" type="border" class="ml-4" @click="$router.push('/estudiante/evaluaciones')"><b>← Volver</b></vs-button>
                        <vs-button v-else color="primary" type="border" class="ml-4" @click="$router.go(-1)"><b>← Volver</b></vs-button>
                    </ul>
                    <ul align="center" class="mt-2 mb-0" v-else>
                        <vs-button color="warning" class="ml-6" style="display: inline-block;" @click="imprimirEval()">Imprimir</vs-button>
                        <vs-button v-if="usuario.id_group === 4" color="primary" type="border" class="ml-4" @click="$router.push('/estudiante/evaluaciones')"><b>← Volver</b></vs-button>
                        <vs-button v-else color="primary" type="border" class="ml-4" @click="$router.go(-1)"><b>← Volver</b></vs-button>
                    </ul>
                </div>
            </div>
            <!-------INICIO SECCION RESPONDER---------->
            <div class="mt-5 mb-6" style="border-radius: 7px; background-color: white; padding: 25px;">
                <div class="w-full" align="center" v-if="volverActivo===true && previsualizar_eval!=1">
                    <div class="mb-2">Esta evaluación aún no ha sido resuelta.</div>
                </div>
                <div class="text-center" v-else>
                    <div cols="12" v-for="(item, index) in preguntas.items" :key="index" v-bind:id="'contenPreg'+(index+1)" style="display: block;" class="mb-4">
                        <div class="mb-5" style="font-size: 20px;" align="center">
                            <vs-divider v-if="index>0" />
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
                                        <li v-if="imprimirRespuesta">
                                            <vs-checkbox disabled="true" class="mb-4" v-model="opcionesSelec" v-bind:vs-value="itemop.id_opcion_pregunta">
                                                <span v-html="renderLatex(itemop.opcion)"></span>
                                                <img style="border-radius: 5px;" v-if="itemop.img_opcion" v-bind:src="$data_url+'archivos/img/img_preguntas/'+itemop.img_opcion" class="img-responsive altura" width="300px">
                                                <b v-if="itemop.tipo===1" style="color: #43D59B; font-size: 20px;" class="ml-2">✓</b>
                                            </vs-checkbox>
                                        </li>
                                        <li v-else>
                                            <vs-checkbox disabled="true" class="mb-4" v-model="opcionesSelec" v-bind:vs-value="itemop.id_opcion_pregunta">
                                                <span v-html="renderLatex(itemop.opcion)"></span>
                                                <img style="border-radius: 5px;" v-if="itemop.img_opcion" v-bind:src="$data_url+'archivos/img/img_preguntas/'+itemop.img_opcion" class="img-responsive altura" width="300px">
                                            </vs-checkbox>
                                        </li>
                                    </div>
                                </div>
                                <!-----PREGUNTAS ESCRITAS---->
                                <div v-if="item.id_tipo_pregunta===2 || item.id_tipo_pregunta===6">
                                    <div v-for="(itemop, index1) in item.opciones" :key="index1">
                                        <textarea disabled="true" v-bind:placeholder="item.respuesta" class="w-full respAbierta inputRespuesta" />
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
                        <vs-pagination class="mt-6 oculto-impresion" color="success" v-if="iniciarActivo===true" :total="preguntas.items.length" v-model="currentx" @input="verPreguntaSelec(currentx-1)"></vs-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script>
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
            inicioImpresion: 0,
            nombresImprimir: '',
            calificacionImprimir: 0,
            nombre_institucion: '',
            //LOGO DE LA INSTITUCION
            logo_institucion: '',
            imprimirRespuesta: false,
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
        this.nombresImprimir = localStorage.getItem("nombresImprimir");
        this.calificacionImprimir = localStorage.getItem("calificacionImprimir");

    },
    mounted() {
        this.datosInicio(this.id_evalRevisar, this.previsualizar_eval)
        this.getInstitucion()
        let TipoImpresion = localStorage.getItem('TipoImpresion')
        if(TipoImpresion == 1){
            this.imprimirRespuesta = true
        }
    },
    methods: {
        renderLatex,
        getInstitucion(){
            let me = this
            me.$http.get(me.$server_url+'institucion/' + me.usuario.institucion_idInstitucion)
            .then(function (res) {
                me.nombre_institucion = res.data.nombreInstitucion || '';
                me.logo_institucion = res.data.imgenInstitucion || '';
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        datosInicio(id_evalRevisar, previsualizar_eval) {
            let me = this;
            console.log("pre",previsualizar_eval)
            let formData = new FormData();
            formData.append('codigo', localStorage.codigo);
            formData.append('evaluacion', id_evalRevisar);
            me.$http.post(me.$server_url+'estudiantesEvalCurso', formData)
            .then(function (response) {
                if (response.data[0] === undefined) {
                    console.log("uno")
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
                        grupo: response.data[0].grupo
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
            me.$http.post(me.$server_url+`verifRespEvaluacion`, formData).then(res => {
                if (res.data === 0) {
                    me.volverActivo = true
                } else {
                    me.volverActivo = false
                    me.calificacionObtenida = (res.data[0].calificacion).toFixed(2)
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
                me.verbtniniciar = false;
            }
            me.$vs.loading.close()
        },
        verPreguntaSelec(index) {
            let me = this
            for (let i = (me.preguntas.items.length + 1); i <= (me.respuestasEscritas.length + me.preguntas.items.length); i++) {
                document.getElementById("contenPregEscr" + i).style.display = "block";
            }

            for (let j = 1; j <= me.preguntas.items.length; j++) {
                document.getElementById("contenPreg" + j).style.display = "block";
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
            } else {
                estudiante = me.estudianteSelected.id
            }

            if( estudiante===undefined ){
                console.log('no existen estudiantes');
            }else{
                let formData = new FormData();
                let grupoevalImprimir = localStorage.getItem("grupoevalImprimir");
                let estudianteEvalImprimir = localStorage.getItem("estudianteEvalImprimir");
                formData.append('grupo', grupoevalImprimir);
                formData.append('evaluacion', me.id_evalRevisar);
                formData.append('estudiante', estudianteEvalImprimir);
                me.$vs.loading()
                me.$http.post(me.$server_url+'pregEvaluacionEstudiante', formData)
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
            me.preguntas = []
            let formData = new FormData();
            formData.append('grupo', me.radios1);
            formData.append('evaluacion', me.id_evalRevisar);
            me.$http.post(me.$server_url+`pregEvaluacionGrupo`, formData).then(res => {
                if (res.data.length === 0) {
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
                console.log('asdadasdasdasd');
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
            me.$http.post(me.$server_url+`modificarEvaluacion`, formData).then(res => {
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
            let me = this;
            if(me.nombresImprimir){
            }else{
                document.title = me.evaluaciones[0].nombreasignatura
            }
            //var ficha = document.getElementById('seccionImprimir');
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

@media print{
    .oculto-impresion *{
        display: none !important;
    }
}
</style>
