<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button>
    <vx-card>
        <div class="w-full">
            <h3>Titulo: {{contenido.tema}}</h3>
        </div>
        <div class="w-full">
            <p v-html="contenido.descripcion" class="foro-detalle p-5"></p>
        </div>
        <vs-button type="gradient" color="success" class="w-full mt-6" @click="verificarFecha(contenido)">Responder foro</vs-button>

    </vx-card>
    <vx-card class="mt-4">
        <div class="vx-col sm:w-1/1 w-full">
            <vs-popup fullscreen title="Responder foro" title-color="primary" :active.sync="popupActive">
                <div class="vx-col mt-4 w-full">
                    <quill-editor class="w-full h-25" style="height:250px" v-model="descripcion"></quill-editor>
                </div>
                <br>
                <div class="vx-row mt-6">
                    <div class="vx-col mt-8 sm:w-2/3 w-full ml-auto">
                        <vs-button class="mr-3 mb-2" @click="guardarRespuesta()">Guardar</vs-button>
                        <vs-button color="danger" type="border" @click="popupActive = false" class="mb-2">Cancelar</vs-button>
                    </div>
                </div>
            </vs-popup>
            <div class="vx-row mt-6">
                <div class="vx-col sm:w-1/2 w-full">
                    <h4>Respuestas:</h4>
                    <p>
                        <vs-chip color="primary" v-if="ver_coments">Todas las respuestas</vs-chip>
                        <vs-chip color="success" v-else>Mis respuestas</vs-chip>
                    </p>
                </div>
                <!-- <div class="vx-col sm:w-1/2 w-full">
                    <ul class="centerx" v-if="ver_coments">
                        <li>
                            <vs-radio color="success" v-model="radios2" @input="getRespuestas()" vs-value="1">Solo mis respuestas</vs-radio>
                        </li>
                        <li>
                            <vs-radio color="success" v-model="radios2" @input="getRespuestas()" vs-value="2">Todas las respuestas</vs-radio>
                        </li>
                    </ul>
                </div> -->
            </div>
            <vx-card class="p-2 mt-4" v-for="(item,$indexs) in respuestas" :key="$indexs+'a'">
                <div class="twitter-feed-header flex items-center">
                    <div class="con-vs-avatar m-0 35px" style="width: 35px; height: 35px; background: rgb(195, 195, 195);">
                        <div class="con-img vs-avatar--con-img"><img :src="'/img/avatar-s-17.4a7d2722.jpg'" alt=""></div>
                    </div>
                    <div class="leading-tight ml-3">
                        <p class="feed-author font-semibold">{{item.nombres}} {{item.apellidos}}</p>
                        <span class="flex items-center"><small>{{fechaCorta(item.updated_at)}}</small>
                            <span class="ml-1 feather-icon select-none relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check h-3 w-3 bg-primary rounded-full text-white">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </span>
                        </span>
                    </div>
                </div>
                <quill-editor :disabled="true" v-model="item.respuesta" :options="editorOption"></quill-editor>
                <div class="px-2" v-if="radios2==1">
                    <div class="flex -mx-2">
                        <div class="w-2/5 px-2">
                            <div class="bg-grid-color-secondary h-12"></div>
                        </div>
                        <div class="w-2/5 px-2">
                            <div class="bg-grid-color h-12"></div>
                        </div>
                        <div class="w-1/5 px-2">
                            <div class="bg-grid-color-secondary h-12">
                                Puntaje:
                                <star-rating v-model="item.nota" read-only :active-on-click="false" :star-size="30"></star-rating>
                            </div>
                        </div>

                    </div>
                </div>
            </vx-card>
        </div>
    </vx-card>
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
import moment from "moment";
import _color from '@/assets/utils/color.js';
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        StarRating,
        quillEditor,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            foroId: '',
            usuario: [],
            contenido: [],
            respuestasTotal: [],
            respuestas: [],
            estudiantes: [],
            foro: {
                descripcion: ""
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'm-d-Y H:i'
            },
            popupActive: false,
            descripcion: "",
            estado: true,
            e_fecha_inicio: "",
            e_fecha_final: "",
            e_descripcion: "",
            editorOption: {
                theme: "bubble",
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'm-d-Y H:i'
            },
            _id: '',
            ver_coments: '',
            radios2: 1, //primero ver solo respuestas del estudiante
            id_respuesta_selected: '',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.foroId = (localStorage.getItem('idForo'));
        me.getForo();
    },
    methods: {
        getForo() {
            let me = this;
            this.$http.get(this.$server_url+'get_respuestas_foro/' + me.foroId)
                .then(function (response) {
                    me.contenido = response.data[0];
                    me.ver_coments = me.contenido.ver_comentarios
                    console.log("xd",me.ver_coments)
                    me.getRespuestasTotal();
                })
                .catch(function (error) {});
        },
        getRespuestasTotal() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'get_respuestas_foro/' + me.foroId)
            .then(function (response) {
                me.respuestasTotal = response.data;
                me.$vs.loading.close()
                me.getRespuestas()
            })
            .catch(function (error) {
                // console.log('no se conecto abuscar respuestas del foro ' + error)
                me.$vs.loading.close()
            });
        },
        getRespuestas() {
            let me = this;
            me.respuestas = [];
            //var todas las respuestas
            if(me.ver_coments == 1){
                me.respuestas = me.respuestasTotal
            }else{
                me.respuestas = me.respuestasTotal.filter(p => p.id_usuario == me.usuario.idusuario)
            }
            console.log("res",me.respuestas)
            // if (me.radios2 == 1) {
            //     for (let index = 0; index < me.respuestasTotal.length; index++) {
            //         if (me.respuestasTotal[index].id_usuario == me.usuario.idusuario) {
            //             me.respuestas.push(me.respuestasTotal[index])
            //         }
            //     }
            // } else {
            //     me.respuestas = me.respuestasTotal;
            // }
        },

        guardarRespuesta() {
            let me = this;

            let formData = new FormData();
            formData.append('id', me.id_respuesta_selected);
            formData.append('id_foro', me.foroId);
            formData.append('respuesta', me.descripcion);
            formData.append('nota', 0);
            formData.append('estado', 1);
            formData.append('id_usuario', me.usuario.idusuario);

            this.$http.post(this.$server_url+'guardar_respuesta_foro', formData)
                .then(function (response) {
                    me.getRespuestasTotal();
                    me.popupActive = false;
                    me.descripcion = "";
                    me.$vs.notify({ text: 'Respuesta registrada correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                })
                .catch(function (error) { console.log(' No se guardó la respuesta ') });
        },
        verificarFecha(item) {
            let me = this;
            let hoy = new Date();
            let fin = new Date(item.fecha_final);

            // alert(hoy +' - '+ fin)
            if (hoy<fin) {
                me.popupActive = true;
            } else {
                me.$vs.notify({
                        text: 'Este foro ya ha caducado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
            }
        },
    }
}
</script>

<style lang="css">
.foro-detalle {
    border: 1px solid #ccc;
    border-radius: 10px;
}
</style>
