                    
<template>
<div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-5/5 w-full">
            <vs-button v-if="respuestas.length == 0" type="gradient" color="success" class="w-full mt-6" @click="popupActive = true;">Crear foro</vs-button>
            <vs-popup fullscreen title="Crear foro" title-color="primary" :active.sync="popupActive">
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/2 w-full">
                        <b>Fecha de inicio</b>
                        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_inicio" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <b>Fecha de final</b>
                        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_final" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                        <b>Estado</b>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <vs-switch v-model="estado">
                            <span slot="true">On</span>
                            <span slot="false">Off</span>
                        </vs-switch>
                    </div>
                </div>
                <div class="w-full">
                    <b>Agrege contenido a su foro</b>
                </div>
                <div class="vx-col mt-4 w-full">
                    <quill-editor class="w-full h-25" style="height:250px" v-model="descripcion"></quill-editor>
                </div>
                <br>
                <div class="vx-row mt-6">
                    <div class="vx-col mt-8 sm:w-2/3 w-full ml-auto">
                        <vs-button class="mr-3 mb-2" @click="guardar">Guardar</vs-button>
                        <vs-button color="danger" type="border" @click="popupActive = false" class="mb-2">Cancelar</vs-button>
                    </div>
                </div>
            </vs-popup>
            <vs-popup fullscreen title="Editar foro" title-color="primary" :active.sync="popupEditar">
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/2 w-full">
                        <b>Fecha de inicio</b>
                        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="e_fecha_inicio" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <b>Fecha de final</b>
                        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="e_fecha_final" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                        <b>Estado</b>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <vs-switch v-model="e_estado">
                            <span slot="true">On</span>
                            <span slot="false">Off</span>
                        </vs-switch>
                    </div>
                </div>
                <div class="w-full">
                    <b>Agregue contenido a su foro</b>
                </div>
                <div class="vx-col mt-4 w-full">
                    <quill-editor class="w-full h-25" style="height:250px" v-model="e_descripcion"></quill-editor>
                </div>
                <br>
                <div class="vx-row mt-6">
                    <div class="vx-col mt-8 sm:w-2/3 w-full ml-auto">
                        <vs-button class="mr-3 mb-2" @click="guardarEditado">Guardar</vs-button>
                        <vs-button color="danger" type="border" @click="popupEditar = false" class="mb-2">Cancelar</vs-button>
                    </div>
                </div>
            </vs-popup>
            <template v-if="respuestas != []">
                <vx-card class="p-2 mt-4" v-for="(item,$index) in respuestas" :key="$index">
                    <div class="vx-row mb-6 text-center bg-dark">
                        <div class="vx-col sm:w-1/3 w-full">
                            <label class="text-white">Inicio del foro</label> <br>
                            <flat-pickr class="text-center text-white" :config="configdateTimePicker" :disabled="true" v-model="item.fecha_inicio" />
                        </div>
                        <div class="vx-col sm:w-1/3 text-center w-full">
                            <br>
                            <span v-if="item.estado == true" class="text-success">Activo</span>
                            <span v-else class="text-danger">Inactivo</span>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full">
                            <label class="text-white">Finalización del foro</label> <br>
                            <flat-pickr class="text-center text-white" :config="configdateTimePicker" :disabled="true" v-model="item.fecha_final" />
                        </div>
                    </div>
                    <quill-editor :disabled="true" v-model="item.descripcion" :options="editorOption"></quill-editor>
                    <!-- <star-rating class="float-right" :show-rating="false" :rating="'4'" :star-size="20" read-only /> -->
                    <vs-button type="relief" color="warning" class="w-full mt-6" @click="editar(item)"><b>Editar</b></vs-button>
                </vx-card>
            </template>
            <vx-card class="p-2 mt-4" v-for="(item,$indexs) in estudiantes" :key="$indexs+'a'">
                <div class="twitter-feed-header flex items-center">
                    <div class="con-vs-avatar m-0 35px" style="width: 35px; height: 35px; background: rgb(195, 195, 195);">
                        <div class="con-img vs-avatar--con-img"><img :src="'https://foro.prolipadigital.com.ec/perfil/'+item.avatar" alt=""></div>
                    </div>
                    <div class="leading-tight ml-3">
                        <p class="feed-author font-semibold">{{item.nombres}} {{item.apellidos}}</p><span class="flex items-center"><small>{{getDate(item.updatedAt)}}</small><span class="ml-1 feather-icon select-none relative"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check h-3 w-3 bg-primary rounded-full text-white">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg></span></span>
                    </div>
                </div>
                <quill-editor :disabled="true" v-model="item.respuesta" :options="editorOption"></quill-editor>
                <div class="px-2">
                    <div class="flex -mx-2">
                        <div class="w-2/5 px-2">
                            <div class="bg-grid-color-secondary h-12"></div>
                        </div>
                        <div class="w-2/5 px-2">
                            <div class="bg-grid-color h-12"></div>
                        </div>
                        <div class="w-1/5 px-2">
                            <div class="bg-grid-color-secondary h-12">
                                Nota
                                <star-rating v-model="item.nota" :active-on-click="false" :star-size="30" @rating-selected="calificar(item._id,item.nota)"></star-rating>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
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
        StarRating,
        quillEditor,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            popupActive: false,
            popupEditar: false,
            usuario: [],
            fecha_inicio: "",
            fecha_final: "",
            descripcion: "",
            estado: true,
            e_fecha_inicio: "",
            e_fecha_final: "",
            e_descripcion: "",
            e_estado: true,
            idtarea: "",
            editorOption: {
                theme: "bubble",
            },
            respuestas: [],
            estudiantes: [],
            foro
                : {
                descripcion: ""
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'm-d-Y H:i'
            }
        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
        console.log(this.usuario)
    },
    mounted() {
        this.getForo();
    },
    methods: {
        showCurrentRating: function (rating) {
            this.currentRating = (rating === 0) ? this.currentSelectedRating : "Click to select " + rating + " stars"
        },
        setCurrentSelectedRating: function (rating) {
            this.currentSelectedRating = "You have Selected: " + rating + " stars";
        },
        getDate(date) {
            var d = new Date(date);
            var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
                d.getHours() + ":" + d.getMinutes();
            return datestring;
        },
        getForo() {
            let me = this;
            axios
                .get("https://foro.prolipadigital.com.ec/foros?idtarea=" + localStorage.idtarea)
                .then(function (response) {
                    me.respuestas = response.data;
                    me.getEstudiantesRespuestas(me.respuestas[0]._id);
                })
                .catch(function (error) {});
        },
        getEstudiantesRespuestas(id) {
            let me = this;
            axios
                .get("https://foro.prolipadigital.com.ec/respuestas?idforo=" + id)
                .then(function (response) {
                    me.estudiantes = response.data;
                    console.log(me.estudiantes);
                })
                .catch(function (error) {});
        },
        guardar() {
            let me = this;
            axios
                .post("https://foro.prolipadigital.com.ec/foros", {
                    descripcion: me.descripcion,
                    fecha_inicio: me.fecha_inicio,
                    fecha_final: me.fecha_final,
                    estado: me.estado,
                    idusuario: me.usuario.idusuario,
                    nombres: me.usuario.nombres,
                    apellidos: me.usuario.apellidos,
                    email: me.usuario.email,
                    foto_user: me.usuario.foto_user,
                    idtarea: localStorage.idtarea

                })
                .then(function (response) {
                    me.foro = {};
                    me.getForo();
                    me.popupActive = false;
                })
                .catch(function (error) {});
        },
        guardarEditado() {
            let me = this;
            let formData = new FormData();
            axios
                .put("https://foro.prolipadigital.com.ec/foros/" + me.foro.id, {
                    descripcion: me.e_descripcion,
                    fecha_inicio: me.e_fecha_inicio,
                    fecha_final: me.e_fecha_final,
                    estado: me.e_estado,
                    idusuario: me.usuario.idusuario,
                    nombres: me.usuario.nombres,
                    apellidos: me.usuario.apellidos,
                    email: me.usuario.email,
                    foto_user: me.usuario.foto_user,
                    idtarea: localStorage.idtarea
                })
                .then(function (response) {
                    me.foro = {};
                    me.getForo();
                    me.popupEditar = false;
                })
                .catch(function (error) {});
        },

        editar(foro) {
            let me = this;
            me.popupEditar = true;
            me.foro = foro;
            me.e_descripcion = foro.descripcion
            me.e_fecha_inicio = foro.fecha_inicio
            me.e_fecha_final = foro.fecha_final
            me.e_estado = foro.estado
        },

        guardarRespuesta() {
            let me = this;

            axios
                .post(
                    "https://foro.prolipadigital.com.ec/respuestas", {
                        respuesta: "aaaaaaaaaaaaa",
                        idusuario: "1234",
                        nombres: "aa",
                        apellidos: "bb",
                        emial: "123@gmail.com",
                        avatar: "sdfsd.pngf",
                        idforo: "5fa3570d66f7da7d356a8cb5"
                    }
                )
                .then(function (response) {
                    me.popupActive = false;
                    me.respuestas = "";
                    me.link = "";
                    me.youtube = "";
                    me.getForos();
                })
                .catch(function (error) {});
        },
        
        calificar(id, nota) {
            let me = this;
            axios.put("https://foro.prolipadigital.com.ec/respuestas/" + id, {
                    nota: nota
                })
                .then(function (response) {
                    me.getForo();
                })
                .catch(function (error) {})
        }
    },
};
</script>
