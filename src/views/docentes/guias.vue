<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/2 xl:w-1/4 mt-3" v-for="(item,$index) in guia" :key="$index">
            <vx-card class="text-center mb-6">
                <div slot="no-body">
                    <img v-if="item.webguia != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/guia/'+item.webguia+'/portada.png'" alt="Card image cap">
                    <img v-else class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/guia/portada.png'" alt="Card image cap">
                </div>
                <div class="mt-4">
                    <p class="font-bold">
                        {{item.nombreguia}}
                    </p>
                    <small>
                        {{item.descripcionguia}}
                    </small>
                </div>
                <div class="mt-4">
                    <div class="w-3/3 mt-2 ml-auto">
                        <vs-button v-if="item.pdfsinguia!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfsinguia(item.pdfsinguia)" icon-after>Pdf sin guía</vs-button>
                    </div>
                    <div class="w-3/3 mt-2 ml-auto">
                        <vs-button v-if="item.pdfconguia!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfconguia(item.pdfconguia)" icon-after>Pdf con guía</vs-button>
                    </div>
                    <div class="w-3/3 mt-2 ml-auto">
                        <vs-button v-if="item.guiadidactica!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfguiadidactica(item.guiadidactica)" icon-after>Guía didáctica</vs-button>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idguia: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            guia: [],
            usuario: []
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this;
            this.$http.get(this.$server_url+'guia?idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.guia = response.data
                })
                .catch(function (error) {})
        },
        datoguia(url) {
            localStorage.url = url;
            this.$router.push('/docente/guia/digital');
        },
        datopdfsinguia(url) {
            localStorage.url = url;
            window.open('/docente/guia/pdfsinguia', '_blank');
        },
        datopdfconguia(url) {
            localStorage.url = url;
            window.open('/docente/guia/pdfconguia', '_blank');
        },
        datopdfguiadidactica(url) {
            localStorage.url = url;
            window.open('/docente/guia/pdfguiadidactica', '_blank');
        }
    },
}
</script>
