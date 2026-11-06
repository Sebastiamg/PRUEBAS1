<template>
<div>
    <vs-tabs>
        <vs-tab label="Administrables">            
            <juegos_admin/>
        </vs-tab>
        <vs-tab label="Libres">
            <!-- <juegosLibres/> -->
            <!-- <vs-button color="dark" type="filled" @click="$router.push('/juegos_prolipa')">Crear juego</vs-button> -->
            <div class="vx-row">
                <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3">
                    <vx-card class="text-center">
                        <div style=" min-height: 350px;">
                            <div>
                                <img class="responsive card-img-top" src="https://cdn-icons-png.flaticon.com/512/4072/4072061.png" >
                            </div>
                            <p class="font-bold mt-3">Juego de cartas</p>
                            <p><small>Selecciona una carta y juega con tus amigos!</small></p>
                        </div>
                        <vs-divider></vs-divider>
                        <center>
                            <vx-tooltip style="display:inline-block" title="'Ver juego" color="success">
                                <vs-button style="display:inline-block" radius icon-pack="feather" icon="icon-eye" color="success" @click="verJuegoCartas(item)"> </vs-button> &nbsp;
                            </vx-tooltip>
                            <!-- <vx-tooltip style="display:inline-block" :title="'Editar '+ item.nombre_tipo_juego" color="warning">
                                <vs-button style="display:inline-block" radius icon-pack="feather" icon="icon-edit" color="warning" @click="editarTipoJuego(item)"> </vs-button>
                            </vx-tooltip> -->
                        </center>
                    </vx-card>
                </div>
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
        </vs-tab>
    </vs-tabs>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import juegosLibres from '../juegos/juegosLibres.vue'
import juegos_admin from '../juegos/JuegosProlipa.vue'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        juegos_admin,
        juegosLibres,
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
            usuario: [],
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
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
        getLibros() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http.get(this.$server_url+'juegos?idusuario='+me.usuario.idusuario)
                .then(function (response) {
                    me.juegos = response.data
                    console.log(me.juegos)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        verJuegoCartas(){
            let me = this;
            me.$router.push('/juegos/cartas')
        },
        datojuego(url) {
            localStorage.url_juego = url;
            console.log(url)
            this.$router.push('/docente/juego/digital');

        }
    },
}
</script>
