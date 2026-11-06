<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <div class="vx-row">
            <div class="vx-col w-full">
                <vs-button @click="valor=1" class="m-1" size="medium" color="primary" type="border">Introducción</vs-button>
                <vs-button @click="valor=2" class="m-1" size="medium" color="primary" type="border">Tareas</vs-button>
                <vs-button @click="valor=3" class="m-1" size="medium" color="primary" type="border">Proceso</vs-button>
                <vs-button @click="valor=4" class="m-1" size="medium" color="primary" type="border">Recursos</vs-button>
                <vs-button @click="valor=5" class="m-1" size="medium" color="primary" type="border">Evaluación</vs-button>
                <vs-button @click="valor=6" class="m-1" size="medium" color="primary" type="border">Conclusiones</vs-button>
                <vs-button @click="valor=7" class="m-1" size="medium" color="primary" type="border">Créditos</vs-button>
            </div>
        </div>
        <div class="vx-row m-3">
            <div v-if="valor == 1">
                <div class="vx-col w-full m-1">
                    <b>Introducción:</b> <br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="introduccion"></quill-editor>
                </div>
            </div>
            <div v-if="valor == 2">
                <div class="vx-col w-full m-1">
                    <b>Tareas:</b><br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="tareas"></quill-editor>
                </div>
            </div>
            <div v-if="valor == 3">
                <div class="vx-col w-full m-1">
                    <b>Proceso:</b><br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="proceso"></quill-editor>
                </div>
            </div>
            <div v-if="valor == 4">
                <div class="vx-col w-full m-1">
                    <b>Recursos:</b><br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="recursos"></quill-editor>
                </div>
            </div>
            <div v-if="valor == 5">
                <div class="vx-col w-full m-1">
                    <b>Evaluación:</b><br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="evaluacion"></quill-editor>
                </div>
            </div>
            <div v-if="valor == 6">
                <div class="vx-col w-full m-1">
                    <b>Conclusiones:</b><br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="conclusiones"></quill-editor>
                </div>
            </div>
            <div v-if="valor == 7">
                <div class="vx-col w-full m-1">
                    <b>Créditos:</b><br>
                </div>
                <div class="vx-col w-full m-1 mb-base">
                    <quill-editor class="w-full h-25 alto" v-model="creditos"></quill-editor>
                </div>
            </div>
            <div class="vx-col w-full m-1">
                <vs-button class="m-1" @click="guardarW()" size="medium" icon-pack="feather" icon="icon-save" color="success" type="gradient">Guardar</vs-button>
            </div>
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
export default {
    components: {
        StarRating,
        quillEditor,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            introduccion: '',
            tareas: '',
            proceso: '',
            recursos: '',
            evaluacion: '',
            conclusiones: '',
            creditos: '',
            proyecto: [],
            idWebQ: '',
            valor: 1,
        }
    },
    mounted() {
        this.idWebQ = (localStorage.getItem('wqid'));
    },
    methods: {
        guardarW() {
            let me = this;
            console.log(me.introduccion)
            axios.post('https://foro.prolipadigital.com.ec/proyecto-detalles', {
                    introduccion: "me.introduccion",
                    tareas: me.tareas,
                    proceso: me.proceso,
                    recursos: me.recursos,
                    evaluacion: me.evaluacion,
                    conclusiones: me.conclusiones,
                    creditos: me.creditos,
                    proyecto: me.idWebQ,
                    estado: true,
                })
                .then(res => {
                    me.$vs.notify({
                        text: 'Proyecto guardado ',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    // this.$router.push('/listaw');
                })
        }

    }
}
</script>

<style>
.alto {
    height: 360px;
    display: inline-block;
}
</style>
