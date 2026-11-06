<template>
<div>
    <div class="vx-row mb-6">
        <div class="vx-col flex flex-wrap items-center w-full">
          <vs-button color="primary" type="border" size="small" class="p-3 mr-3" @click="$router.go(-1)"><b>← Volver</b></vs-button>
          <h3> Seccion: {{tmpForo.seccion}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Curso: {{tmpForo.nombre}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Aula: {{tmpForo.aula}} </h3>
        </div>

        <div class="vx-col w-full" v-if="forosXcurso.length>0">
        
            <vx-card class="p-2 mt-4" v-for="(item,$index) in forosXcurso" :key="$index">
                <div class="w-full">
                    <h5><span v-html="item.descripcion.substring(0,250)+'...'"></span></h5>
                </div>
                <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w-full">
                        <p>Inicio: {{fechaLarga(item.fecha_inicio)}} </p>
                        <p>Finaliza: {{fechaLarga(item.fecha_final)}} </p>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full text-right">
                        <vs-button type="gradient" color="success" @click="respuestasForo(item.id_foro)"> Visualizar </vs-button>
                    </div>
                </div>
            </vx-card>

        </div>
        <div v-else class="vx-col w-full">
            <vx-card>
                <h4> Su profesor no ha incluido ningún foro.</h4>
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
            foro: {
                descripcion: ""
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'm-d-Y H:i'
            },
            tmpForo: '',
            forosXcurso: [],
        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
        this.tmpForo = JSON.parse(localStorage.getItem("curso_foro"));
    },
    mounted() {
        this.getForos();
    },
    methods: {
        getForos() {
            let me = this;
            this.$http.get(this.$server_url+'foros_curso/'+me.tmpForo.codigo)
                .then(function (response) {
                    console.log(response.data)
                    me.forosXcurso = response.data;
                })
                .catch(function (error) {});
        },
        respuestasForo(id_foro) {
            localStorage.setItem('idForo', id_foro)
            this.$router.push('/estudiante/respuestas');
        },
    },
};
</script>
