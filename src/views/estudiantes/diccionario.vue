<template>
<div>
    <vx-card class="text-center mb-4">
        <vs-input style="min-width: 300px; display: inline-block; text-align: center;" class="m-1" icon-pack="feather" icon="icon-word" icon-no-border placeholder="Palábra" v-model="palabra" />

        <vs-button icon-pack="feather" class="m-1" color="dark" style="display: inline-block;" icon="icon-search" @click="buscarSignificado()"></vs-button>

        <vs-button color="primary" :type="en_activo" style="float: right; padding-left: 5px; padding-right: 5px; display: inline-block;" @click="language='en'">EN</vs-button>
        <vs-button color="primary" :type="es_activo" style="float: right; padding-left: 5px; padding-right: 5px; display: inline-block;" @click="language='es'">ES</vs-button>
    </vx-card>

    <vx-card class="text-center">
        <div v-if="significado.length > 0">
            <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/4 w-full text-left"> <b>Palábra: </b> </div>
            <div class="vx-col sm:w-3/4 w-full text-justify">
                {{significado[0].word}}
            </div>
            </div>

            <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/4 w-full text-left"> <b>Definiciones: </b> </div>
            <div class="vx-col sm:w-3/4 w-full text-justify">
                <div :key="index" v-for="(item, index) in significado[0].meanings[0].definitions.slice(0, 5)" class="mb-4">
                    <b>-</b> {{item.definition}} <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ejemplo: {{item.example}}
                    <vs-divider></vs-divider>
                </div>
            </div>
            </div>

        </div>

        <div v-else>
            <h5>No se encontraron significados para la palabra buscada.</h5>
        </div>
    </vx-card>


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
            usuario: [],
            palabra: '',
            significado: [],
            language: 'es',
            es_activo: 'flat',
            en_activo: 'flat',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        // var options = {
        //     method: 'GET',
        //     url: 'https://wordsapiv1.p.rapidapi.com/words/hatchback/typeOf',
        //     headers: {
        //         'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        //         'x-rapidapi-key': 'f65ad9fa1dmsh7cc935d77b81b46p12aa5djsn7c15dd7d0e80'
        //     }
        // };

        // axios.request(options).then(function (response) {
        //     console.log('*****')
        //     console.log(response.data);
        //     console.log('*****')
        // }).catch(function (error) {
        //     console.error(error);
        // });
    },
    methods: {
        buscarSignificado(){
            let me = this
            me.significado = []
            axios.get('https://api.dictionaryapi.dev/api/v2/entries/'+me.language+'/' + me.palabra)
            .then((response) => {
                me.significado = response.data;
            })
            .catch((error) => { reject(error) })
        }
    },
}
</script>