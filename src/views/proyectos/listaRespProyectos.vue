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
                        {{data[indextr].datos.user_nombres}} <br>
                        {{data[indextr].datos.user_apellidos}}
                    </vs-td>
                    <vs-td width="40%">
                        {{fechaLarga(data[indextr].updatedAt)}}
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
                <div v-if="respueta_pry.fileintroduccion != '' && respueta_pry.fileintroduccion !== null && respueta_pry.fileintroduccion !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileintroduccion.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileintroduccion[0].name.length < long_name_file"> {{respueta_pry.fileintroduccion[0].name}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileintroduccion[0].name.length > (long_name_file+4)">
                                    {{respueta_pry.fileintroduccion[0].name.substr(0,long_name_file)}} .... {{respueta_pry.fileintroduccion[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileintroduccion[0].name}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileintroduccion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileintroduccion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="introduccion"></p>
            </div>
            <div v-if="valor==2">
                <div v-if="respueta_pry.filetareas != '' && respueta_pry.filetareas !== null && respueta_pry.filetareas !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.filetareas.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.filetareas[0].name.length < long_name_file"> {{respueta_pry.filetareas[0].name}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.filetareas[0].name.length > (long_name_file+4)">
                                    {{respueta_pry.filetareas[0].name.substr(0,long_name_file)}} .... {{respueta_pry.filetareas[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.filetareas[0].name}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.filetareas[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.filetareas[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="tareas"></p>
            </div>
            <div v-if="valor==3">
                <div v-if="respueta_pry.fileproceso != '' && respueta_pry.fileproceso !== null && respueta_pry.fileproceso !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileproceso.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileproceso[0].name.length < long_name_file"> {{respueta_pry.fileproceso[0].name}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileproceso[0].name.length > (long_name_file+4)">
                                    {{respueta_pry.fileproceso[0].name.substr(0,long_name_file)}} .... {{respueta_pry.fileproceso[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileproceso[0].name}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileproceso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileproceso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="proceso"></p>
            </div>
            <div v-if="valor==4">
                <div v-if="respueta_pry.filerecursos != '' && respueta_pry.filerecursos !== null && respueta_pry.filerecursos !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.filerecursos.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.filerecursos[0].name.length < long_name_file"> {{respueta_pry.filerecursos[0].name}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.filerecursos[0].name.length > (long_name_file+4)">
                                    {{respueta_pry.filerecursos[0].name.substr(0,long_name_file)}} .... {{respueta_pry.filerecursos[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.filerecursos[0].name}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.filerecursos[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.filerecursos[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="recursos"></p>
            </div>
            <div v-if="valor==5">
                <div v-if="respueta_pry.filevaluacion != '' && respueta_pry.filevaluacion !== null && respueta_pry.filevaluacion !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.filevaluacion.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.filevaluacion[0].name.length < long_name_file"> {{respueta_pry.filevaluacion[0].name}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.filevaluacion[0].name.length > (long_name_file+4)">
                                    {{respueta_pry.filevaluacion[0].name.substr(0,long_name_file)}} .... {{respueta_pry.filevaluacion[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.filevaluacion[0].name}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.filevaluacion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.filevaluacion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
                <p class="caja-texto w-full" v-html="evaluacion"></p>
            </div>
            <div v-if="valor==6">
                <div v-if="respueta_pry.fileconclusiones != '' && respueta_pry.fileconclusiones !== null && respueta_pry.fileconclusiones !== undefined" class="m-1 borde-unidad">
                    <div v-if="respueta_pry.fileconclusiones.length >0" class="m-1">
                        <p><b>Archivo actual:</b></p>
                        <p>
                            <label v-if="respueta_pry.fileconclusiones[0].name.length < long_name_file"> {{respueta_pry.fileconclusiones[0].name}} </label>
                            <label v-else>
                                <span v-if="respueta_pry.fileconclusiones[0].name.length > (long_name_file+4)">
                                    {{respueta_pry.fileconclusiones[0].name.substr(0,long_name_file)}} .... {{respueta_pry.fileconclusiones[0].ext}}
                                </span>
                                <span v-else>
                                    {{respueta_pry.fileconclusiones[0].name}}
                                </span>
                            </label>
                        </p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileconclusiones[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileconclusiones[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
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
                'fileintroduccion': '',
                'fileintroduccion': '',
                'fileproceso': '',
                'filerecursos': '',
                'filevaluacion': '',
                'fileconclusiones': '',
            },
        }
    },
    mounted() {
        let me = this;
        me.itemProyecto = JSON.parse(localStorage.getItem('proyecto_curso'))
        me.respueta_pry = JSON.parse(localStorage.getItem('proyecto_curso'))
        // console.log(me.respueta_pry)
        me.proyectoNombre = me.itemProyecto.datos.nombre_proyecto
        me.verRespuestas();
    },
    methods: {
        verRespuestas() {
            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + me.itemProyecto.idproyecto + '&curso=' + me.itemProyecto.curso)
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
            // console.log(item)
            me.respueta_pry = item;
            me.tmpProyecto = item;
            me.est_nombre = item.datos.user_nombres
            me.est_apellido = item.datos.user_apellidos
            me.est_email = item.datos.user_email
            me.introduccion = item.introduccion;
            me.tareas = item.tareas;
            me.proceso = item.proceso;
            me.recursos = item.recursos;
            me.evaluacion = item.evaluacion;
            me.conclusiones = item.conclusiones;
            me.modalRespuesta = true;
        },
        abrirModalcalificar(item) {
            let me = this;
            me.msj = '';
            // console.log(item)
            me.id_calificar = item.id;
            me.calificacion = item.calificacion;
            me.comentario_profesor = item.comentario_profesor;
            me.est_nombre = item.datos.user_nombres
            me.est_apellido = item.datos.user_apellidos
            me.est_email = item.datos.user_email
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

            axios.put('https://foro.prolipadigital.com.ec/respuestas-proyectos/' + me.id_calificar, {
                    calificacion: me.calificacion,
                    comentario_profesor: me.comentario_profesor
                })
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
            if (item.mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src=https://foro.prolipadigital.com.ec' + item.url)
            } else if (item.mime = "application/pdf") {
                if (item.height != null && item.width != null) {
                    //si tiene alto y ancho, es una imagen
                    window.open('https://foro.prolipadigital.com.ec' + item.url);
                } else {
                    window.open('https://docs.google.com/viewer?url=https://foro.prolipadigital.com.ec' + item.url);
                }
            } else {
                this.$vs.notify({
                    text: 'El archivo no puede ser visualizado, por favor proceda con la descarga',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
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
            axios({
                    url: 'https://foro.prolipadigital.com.ec' + item.url,
                    method: 'GET',
                    responseType: 'blob',
                })
                .then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', item.name + item.ext);
                    document.body.appendChild(fileLink);

                    fileLink.click();
                    this.$vs.notify({
                        time: 6000,
                        text: 'El archivo se esta descargando',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.$vs.notify({
                        text: 'Error en la descarga del archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    this.$vs.loading.close();
                })
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
