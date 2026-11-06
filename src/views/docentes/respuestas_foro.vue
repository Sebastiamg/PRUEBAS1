<template>
<div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-5/5 w-full">
            <template>
                <vx-card class="p-2">
                    <div class="vx-row mb-6 text-center">
                        <div class="vx-col sm:w-full">
                            <div style="background-color: #E5F3FE; border-radius: 5px; padding: 7px; color: #0A74CF;">
                                <b>{{foro.tema}}</b>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/4 w-full">
                            Fecha inicio:
                        </div>
                        <div class="vx-col sm:w-3/4 w-full">
                            {{fechaLarga(foro.fecha_inicio)}}
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/4 w-full">
                            Fecha fin:
                        </div>
                        <div class="vx-col sm:w-3/4 w-full">
                            {{fechaLarga(foro.fecha_final)}}
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/4 w-full">
                            Ver comentarios:
                        </div>
                        <div class="vx-col sm:w-3/4 w-full">
                            <span v-if="ver_coments">Todos los estudiantes pueden visualizar los comentarios de sus compañeros </span>
                            <span v-if="!ver_coments">Ningún estudiante puede ver los comentarios de sus compañeros </span>
                        </div>
                    </div>
                    <quill-editor :disabled="true" class="foro-detalle" v-model="foro.descripcion" :options="editorOption"></quill-editor>
                    
                </vx-card>
            </template>


            <vx-card class="p-2 mt-4" v-for="(item,$indexs) in respuestas" :key="$indexs+'a'">
                <div class="twitter-feed-header flex items-center">
                    <div class="con-vs-avatar m-0 35px" style="width: 35px; height: 35px; background: rgb(195, 195, 195);">
                        <div class="con-img vs-avatar--con-img"><img :src="'/img/avatar-s-17.4a7d2722.jpg'" alt=""></div>
                    </div>
                    <div class="leading-tight ml-3">
                        <p class="feed-author font-semibold">{{item.nombres}} {{item.apellidos}}</p><span class="flex items-center"><small>{{fechaCorta(item.created_at)}}</small><span class="ml-1 feather-icon select-none relative"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check h-3 w-3 bg-primary rounded-full text-white">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg></span></span>
                    </div>
                </div>
                <quill-editor :disabled="true" v-model="item.respuesta" :options="editorOption"></quill-editor>
                <div class="px-2">
                    <div class="">
                        <div class="sm:w-1/5 px-2 w:full">
                            <div class="bg-grid-color-secondary h-12">
                                Puntaje:
                                <star-rating v-model="item.nota" :active-on-click="false" :star-size="30" @rating-selected="calificar(item,item.nota)"></star-rating>
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
import moment from "moment";
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
            foro: [],
            respuestas: [],
            foro: {
                descripcion: ""
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'M-D-Y H:i'
            },
            ver_coments: '',

        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted() {
        this.getForo();
    },
    methods: {
        getForo() {
            let me = this;
            this.$http.get(this.$server_url+'foros/'+ localStorage.idForo)
                .then(function (response) {
                    me.foro = response.data[0];
                    me.ver_coments = me.foro.ver_comentarios;
                    me.getEstudiantesRespuestas(me.foro.id_foro);
                })
                .catch(function (error) {});
        },
        getEstudiantesRespuestas(id) {
            let me = this;
            me.$vs.loading()
            
            this.$http.get(this.$server_url+'get_respuestas_foro/'+ id)
            .then(function (response) {
                me.respuestas = response.data
                me.$vs.loading.close()
            })
            .catch(function (error) { me.$vs.loading.close() });
        },

        calificar(item, nota) {
            let me = this;

            let formData = new FormData();
            formData.append('id', item.id);
            formData.append('nota', nota);

            this.$http.post(this.$server_url+'guardar_nota_foro', formData)
                .then(function (response) {
                    me.getEstudiantesRespuestas(item.id_foro);
                    me.$vs.notify({
                        text: 'Calificación actualizada al estudiante ' + item.nombres + ' ' + item.apellidos,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {})
        },

    },
};
</script>

<style lang="css">
.foro-detalle {
    border: 1px solid #ccc;
    border-radius: 10px;

}
</style>
