<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in juegos" :key="$index">
            <vx-card class="text-center">
                <div slot="no-body">
                    <img v-if="item.carpeta != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/juegos/'+item.carpeta+'/portada.jpg'" alt="Card image cap">
                </div>
                <p class="font-bold">
                    {{item.nombre}}
                </p>
                <small>
                    {{item.descripcionlibro}}
                </small>
                <div class="w-3/3 ml-auto mt-3">
                    <vs-button color="primary" class="w-full" type="border" icon-pack="feather" @click="datojuego(item.carpeta)" icon="icon-book">Juego Web</vs-button>
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
            idlibro: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            juegos: [],
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    mounted() {
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http.get(this.$server_url+'juegos?idusuario=')
                .then(function (response) {
                    me.juegos = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        datojuego(url) {
            localStorage.url = url;
            this.$router.push('/juego/digital');

        }
    },
}
</script>
