<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/2 xl:w-1/4 mt-3" v-for="(item,$index) in cuadernos" :key="$index">
            <vx-card class="text-center mb-6">
                <div slot="no-body">
                    <img v-if="item.webcuaderno != '' " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/cuadernodigital/'+item.webcuaderno+'/portada.jpg'" alt="Card image cap">
                    <img v-else class="responsive card-img-top" v-bind:src="$data_url+'tareas/img/'+item.portada" alt="Card image cap">
                </div>
                <div class="mt-4">
                    <p class="font-bold">
                        {{item.nombrecuaderno}}
                    </p>
                    <small>
                        {{item.descripcioncuaderno}}
                    </small>
                </div>
                <div class="mt-4">
                    <div class="w-3/3 mt-2 ml-auto">
                        <vs-button v-if="item.pdfconguia!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfconguia(item.pdfconguia)" icon-after>Pdf con guía</vs-button>
                    </div>
                    <div class="w-3/3 mt-2 ml-auto">
                        <vs-button v-if="item.guiadidactica!== null" color="danger" class="w-full" type="border" icon-pack="feather" icon="icon-file-text " @click="datopdfguiadidactica(item.guiadidactica)" icon-after>Guía didáctica</vs-button>
                    </div>
                    <div class="w-3/3 mt-2 ml-auto mt-3">
                        <vs-button v-if="item.webcuaderno!== null" color="primary" class="w-full" type="border" icon-pack="feather" @click="datocuaderno(item.webcuaderno)" icon="icon-book">Cuaderno Web</vs-button>
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
            idcuaderno: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            cuadernos: [],
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
            this.$http.get(this.$server_url+'cuadernos?idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.cuadernos = response.data
                })
                .catch(function (error) {})
        },
        datocuaderno(url) {
            localStorage.url = url;
            this.$router.push('/docente/cuaderno/digital');
        },
        datopdfsinguia(url) {
            localStorage.url = url;
            window.open('/docente/cuaderno/pdfsinguia', '_blank');
        },
        datopdfconguia(url) {
            localStorage.url = url;
            window.open('/docente/cuaderno/pdfconguia', '_blank');
        },
        datopdfguiadidactica(url) {
            localStorage.url = url;
            window.open('/docente/cuaderno/pdfguiadidactica', '_blank');
        }
    },
}
</script>
