<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>

        <vs-table max-items="20" search pagination :data="estudiantesProyectosRespuestas" style="margin-top:-20px">
            <template slot="header">
                <div> Proyecto: <b>{{proyectoNombre}} </b> </div>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Ultima actualización</vs-th>
                <vs-th>Calificación</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].estudiante}} <br>
                    </vs-td>
                    <vs-td width="40%">
                        {{fechaLarga(data[indextr].updated_at)}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].calificacion}}
                    </vs-td>
                    <vs-td>
                        <vx-tooltip style="display:inline" text="Ver proyecto enviado" position="top" color="success">
                            <vs-button style="display:inline" class="m-1" color="success" type="border" size="small" icon-pack="feather" icon="icon-eye" @click="respuesta(tr)">Ver proyecto</vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display:inline" text="Calificar proyecto" position="top" color="primary">
                            <vs-button style="display:inline" class="m-1" color="primary" type="border" size="small" icon-pack="feather" @click="abrirModalcalificar(tr)" icon="icon-feather">Calificar</vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>

    <vs-popup fullscreen title="Proyecto resuelto de:" :active.sync="modalRespuesta">
        <div class="vx-row">
            <div class="vx-col w-full">
                <b>Estudiante:</b> {{est_nombre}} {{est_apellido}} <br>
                <b>Email:</b> {{est_email}}
            </div>
            <div class="vx-col w-full">
                <vs-button @click="valor=1;" class="m-1" size="medium" color="primary" type="line">Introducción</vs-button>
                <vs-button @click="valor=2;" class="m-1" size="medium" color="primary" type="line">Tareas</vs-button>
                <vs-button @click="valor=3;" class="m-1" size="medium" color="primary" type="line">Proceso</vs-button>
                <vs-button @click="valor=4;" class="m-1" size="medium" color="primary" type="line">Recursos</vs-button>
                <vs-button @click="valor=5;" class="m-1" size="medium" color="primary" type="line">Evaluación</vs-button>
                <vs-button @click="valor=6;" class="m-1" size="medium" color="primary" type="line">Conclusiones</vs-button>
                <!-- <vs-button @click="valor=7;" class="m-1" size="medium" color="primary" type="line">Créditos</vs-button> -->
            </div>
        </div>
        <div class="vx-col w-full m-1 mb-base">
            <h4 class="w-full mb-4" v-if="valor==1">Introduccion:</h4>
            <h4 class="w-full mb-4" v-if="valor==2">Tareas:</h4>
            <h4 class="w-full mb-4" v-if="valor==3">Proceso:</h4>
            <h4 class="w-full mb-4" v-if="valor==4">Recursos:</h4>
            <h4 class="w-full mb-4" v-if="valor==5">Evaluación:</h4>
            <h4 class="w-full mb-4" v-if="valor==6">Conclusiones:</h4>
            <div v-if="valor==1">
            
                <div v-if="respueta_pry.fileIntroduccion != '' && respueta_pry.fileIntroduccion !== null && respueta_pry.fileIntroduccion !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileIntroduccion.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileIntroduccion[0].archivo.length < long_name_file"> {{respueta_pry.fileIntroduccion[0].archivo}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileIntroduccion[0].archivo.length > (long_name_file+4)">
                                    {{respueta_pry.fileIntroduccion[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileIntroduccion[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileIntroduccion[0].archivo}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="introduccion"></p>
            </div>
            <div v-if="valor==2">
                <div v-if="respueta_pry.fileTarea != '' && respueta_pry.fileTarea !== null && respueta_pry.fileTarea !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileTarea.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileTarea[0].archivo.length < long_name_file"> {{respueta_pry.fileTarea[0].archivo}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileTarea[0].archivo.length > (long_name_file+4)">
                                    {{respueta_pry.fileTarea[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileTarea[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileTarea[0].archivo}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileTarea[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileTarea[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="tareas"></p>
            </div>
            <div v-if="valor==3">
                <div v-if="respueta_pry.fileProceso != '' && respueta_pry.fileProceso !== null && respueta_pry.fileProceso !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileProceso.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileProceso[0].archivo.length < long_name_file"> {{respueta_pry.fileProceso[0].archivo}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileProceso[0].archivo.length > (long_name_file+4)">
                                    {{respueta_pry.fileProceso[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileProceso[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileProceso[0].archivo}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileProceso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileProceso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="proceso"></p>
            </div>
            <div v-if="valor==4">
                <div v-if="respueta_pry.fileRecurso != '' && respueta_pry.fileRecurso !== null && respueta_pry.fileRecurso !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileRecurso.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileRecurso[0].archivo.length < long_name_file"> {{respueta_pry.fileRecurso[0].archivo}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileRecurso[0].archivo.length > (long_name_file+4)">
                                    {{respueta_pry.fileRecurso[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileRecurso[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileRecurso[0].archivo}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="recursos"></p>
            </div>
            <div v-if="valor==5">
                <div v-if="respueta_pry.fileEvaluacion != '' && respueta_pry.fileEvaluacion !== null && respueta_pry.fileEvaluacion !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileEvaluacion.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileEvaluacion[0].archivo.length < long_name_file"> {{respueta_pry.fileEvaluacion[0].archivo}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileEvaluacion[0].archivo.length > (long_name_file+4)">
                                    {{respueta_pry.fileEvaluacion[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileEvaluacion[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileEvaluacion[0].archivo}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="evaluacion"></p>
            </div>
            <div v-if="valor==6">
                <div v-if="respueta_pry.fileConclusion != '' && respueta_pry.fileConclusion !== null && respueta_pry.fileConclusion !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileConclusion.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileConclusion[0].archivo.length < long_name_file"> {{respueta_pry.fileConclusion[0].archivo}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileConclusion[0].archivo.length > (long_name_file+4)">
                                    {{respueta_pry.fileConclusion[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileConclusion[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileConclusion[0].archivo}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="conclusiones"></p>
            </div>

        </div>
    </vs-popup>

    <vs-popup title="Calificar a:" :active.sync="modalCalificacion">
        <div class="con-exemple-prompt">
            <div class="vx-col w-full">
                <b>Estudiante:</b> {{est_nombre}} {{est_apellido}} <br>
                <b>Email:</b> {{est_email}}
            </div> <br>
            Ingrese un puntaje para el proyecto de su estudiante:<br>
            <span class="text-danger" style="font-size:12px" v-if="msj != ''"> {{msj}} </span>
            <vs-input placeholder="Calificación" type="number" min="0" max="100" v-model="calificacion" class="mt-4 mb-2 w-full" />
            Comentario o sugerencia:
            <vs-textarea placeholder="¿Desea agregar un comentario?" v-model="comentario_profesor" class="w-full" />
        </div>
        <vs-button style="display:inline" class="m-1" color="primary" type="border" @click="guardarCalificacion()">Guardar calificación</vs-button>
    </vs-popup>

</div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {
    quillEditor
} from "vue-quill-editor";
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import StarRating from "vue-star-rating";
import {
    getIdFromUrl
} from "vue-youtube";
import VueYoutube from "vue-youtube";
Vue.use(VueYoutube);
Vue.use(axios);
export default {
    components: {
        quillEditor,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            long_name_file: 30, //cantidad maxima de caracteres a mostrar en el nombre del archivo
            modalCalificacion: false,
            calificacion: '',
            comentario_profesor: '',
            estudiantesProyectosRespuestas: [],
            modalRespuesta: false,
            itemProyecto: '',
            tmpProyecto: '',
            valor: 1,
            introduccion: '',
            tareas: '',
            proceso: '',
            recursos: '',
            evaluacion: '',
            conclusiones: '',
            est_nombre: '',
            est_apellido: '',
            est_email: '',
            msj: '',
            id_calificar: '',
            proyectoNombre: '',
            respueta_pry: {
                'introduccion': '',
                'tareas': '',
                'proceso': '',
                'recursos': '',
                'evaluacion': '',
                'conclusiones': '',
                'fileIntroduccion': '',
                'fileTarea': '',
                'fileProceso': '',
                'fileRecurso': '',
                'fileEvaluacion': '',
                'fileConclusion': '',
            },
        }
    },
    mounted() {
        let me = this;
        me.itemProyecto = JSON.parse(localStorage.getItem('proyecto_curso'))
        me.respueta_pry = JSON.parse(localStorage.getItem('proyecto_curso'))
        // console.log(me.respueta_pry)
        me.proyectoNombre = me.itemProyecto.nombre
        me.verRespuestas();
    },
    methods: {
        verRespuestas() {
            let me = this;
            this.$http.get(this.$server_url+'proyectos?respuestas=yes&proyecto_id=' + me.itemProyecto.proyecto_id+'&curso_id='+ me.itemProyecto.curso)
            // axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + me.itemProyecto.idproyecto + '&curso=' + me.itemProyecto.curso)
                .then(function (response) {
                    me.estudiantesProyectosRespuestas = response.data
                    // console.log(me.estudiantesProyectosRespuestas);
                    // me.modalEstudiantes = true;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
        },
        
        respuesta(item) {
            let me = this;
            console.log(item)
            let getDatos = item
            let datos = item.files
            //files
            let fIntroduccion = []
            let fTarea        = []
            let fProceso      = []
            let fRecurso      = []
            let fEvaluacion   = []
            let fConclusion   = []
            fIntroduccion  =  datos.filter(p => p.tipo == 3)
            console.log('ff',fIntroduccion)
           
            fTarea         =  datos.filter(p => p.tipo == 4)
            fProceso       =  datos.filter(p => p.tipo == 5)
            fRecurso       =  datos.filter(p => p.tipo == 6)
            fEvaluacion    =  datos.filter(p => p.tipo == 7)
            fConclusion    =  datos.filter(p => p.tipo == 8)
            //descripcion
            me.respueta_pry.introduccion  = getDatos.introduccion
            me.respueta_pry.tareas = getDatos.tarea 
            me.respueta_pry.proceso = getDatos.proceso 
            me.respueta_pry.recursos = getDatos.recurso
            me.respueta_pry.evaluacion = getDatos.evaluacion
            me.respueta_pry.conclusiones = getDatos.conclusion 
            //FILES
            me.respueta_pry.fileIntroduccion  = fIntroduccion
            me.respueta_pry.fileTarea         = fTarea
            me.respueta_pry.fileProceso       = fProceso
            me.respueta_pry.fileRecurso       = fRecurso
            me.respueta_pry.fileEvaluacion    = fEvaluacion
            me.respueta_pry.fileConclusion    = fConclusion

            me.tmpProyecto = item;
            me.est_nombre = item.nombres
            me.est_apellido = item.apellidos
            me.est_email = item.email
            me.introduccion = item.introduccion;
            me.tareas = item.tarea;
            me.proceso = item.proceso;
            me.recursos = item.recurso;
            me.evaluacion = item.evaluacion;
            me.conclusiones = item.conclusion;
            me.modalRespuesta = true;
        },
        abrirModalcalificar(item) {
            let me = this;
            me.msj = '';
            // console.log(item)
            me.id_calificar = item.id;
            me.calificacion = item.calificacion;
            me.comentario_profesor = item.comentario_docente;
            me.est_nombre = item.nombres
            me.est_apellido = item.apellidos
            me.est_email = item.email
            me.modalCalificacion = true;
        },
        guardarCalificacion() {
            let me = this;
            me.msj = '';
            if (me.calificacion < 0) {
                me.msj = "Su puntaje no puede ser negativo, verifique por favor."
                // me.modalCalificacion = true;
                return
            }
            if (me.calificacion > 100) {
                me.msj = "Su puntaje esta es mayor a 100, verifique por favor."
                // me.modalCalificacion = true;
                return
            }
            me.$vs.loading()
            let formData = new FormData();
            formData.append('comentario_profesor', me.comentario_profesor)
            formData.append('calificacion',        me.calificacion)
            formData.append('guardarCalificacion', "yes")
            formData.append('id',                  me.id_calificar)
            this.$http.post(this.$server_url+'proyectos',formData)
            // axios.put('https://foro.prolipadigital.com.ec/respuestas-proyectos/' + me.id_calificar, {
            //         calificacion: me.calificacion,
            //         comentario_profesor: me.comentario_profesor
            //     })
                .then(function (response) {
                    me.modalCalificacion = false;
                    me.$vs.notify({
                        text: 'Calificación guardada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.verRespuestas();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
        },
        vaciar() {
            let me = this;
            me.nota = '';
            me.comentario = '';
        },
        notaValida() {
            return (this.nota.length > 0 && this.comentario.length >= 0)
        },
        visualizar(item) {
            // console.log(item)
            if (item.url.substr(-3) == "pdf" || item.url.substr(-3) == "png" || item.url.substr(-3) == "jpg" || item.url.substr(-3) == "PNG") {
                window.open(this.$data_url+'archivos/proyectos/' + item.url, '_blank');
            } else if ( item.url.substr(-3) == "doc" || item.url.substr(-3) == "ocx" || item.url.substr(-3) == "xls" || item.url.substr(-3) == "lsx" ) {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/proyectos/' + item.url, '_blank');
            }
            // if (item.mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            //     window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url + item.url)
            // } else if (item.mime = "application/pdf") {
            //     if (item.height != null && item.width != null) {
            //         //si tiene alto y ancho, es una imagen
            //         window.open(+this.$data_url + item.url);
            //     } else {
            //         window.open('https://docs.google.com/viewer?url='+this.$data_url + item.url);
            //     }
            // } else {
            //     this.$vs.notify({
            //         text: 'El archivo no puede ser visualizado, por favor proceda con la descarga',
            //         color: 'warning',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     })
            // }
        },
        descargaArchivo(item) {
            // console.log(item)
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            this.$vs.loading();
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let url2 = this.$data_url+'archivos/proyectos/'+item.url
            window.open(url2)

            // this.$vs.loading();
            // axios({
            //         url: this.$server_url+'proyectoImagen/' + item.url,
            //         method: 'GET',
            //         responseType: 'blob',
            //     })
            //     .then((response) => {
            //         var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            //         var fileLink = document.createElement('a');

            //         fileLink.href = fileURL;
            //         fileLink.setAttribute('download', item.archivo);
            //         // fileLink.setAttribute('download', item.archivo + item.ext);
            //         document.body.appendChild(fileLink);

            //         fileLink.click();
            //         this.$vs.notify({
            //             time: 6000,
            //             text: 'El archivo se esta descargando',
            //             color: 'success',
            //             iconPack: 'feather',
            //             icon: 'icon-check'
            //         })
            //         this.$vs.loading.close();
            //     })
            //     .catch(error => {
            //         this.$vs.notify({
            //             text: 'Error en la descarga del archivo',
            //             color: 'warning',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         })
            //         this.$vs.loading.close();
            //     })
        },
    }
}
</script>

<style lang="css">
.caja-texto {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 5px;
}

.vs-popup--close {
    display: block;
}

.borde-unidad {
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
</style>
