<template>
<div>
    <!-- <vs-button color="primary" type="border" icon-pack="feather" @click="$router.go(-1)" icon="icon-arrow-left"><b>Volver</b></vs-button> -->
    <vx-card>
         <div class="vx-row">

            <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in juegos" :key="$index">
                <vx-card class="text-center" @click="crearJuego(item)" style="cursor: pointer; min-height: 430px;">
                    <div slot="no-body">
                        <img class="responsive card-img-top" v-bind:src="$data_url+'archivos/images/imagenes_juegos/portadas/' + item.imagen_juego">
                    </div>
                    <p class="font-bold">
                        {{item.nombre_tipo_juego}}
                    </p>
                    <small>
                        {{item.descripcion_tipo_juego}}
                    </small>
                </vx-card>
            </div>
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
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idjuego: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            juegos: [],
            juegosRecursosExternos:[],
            permisosExternos:[],
            getPermisoPonchado:'',
            getPermisoSopaLetras:'',
            getPermisoAdivinanza:'',
            usuario:'',
            grupo_usuario:'',
            asignatura_id:'',
        }
    },
    computed: {},
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.asignatura_id = localStorage.getItem("idasignatura")
        this.grupo_usuario = this.usuario.id_group;
        // this.idusuario = this.usuario.idusuario;
        // if (this.grupo_usuario == 10) { //director
        //     this.datoU = JSON.parse(localStorage.getItem('datoUser'))
        //     this.miusuario = this.datoU
        //     // console.log(this.datoU)
        //     // this.idusuario = this.datoU.idusuario;
        // }
        this.getJuegos()


    },
    methods: {
        async getJuegos() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'tipoJuegos')
                .then(function (response) {

                    me.juegos = response.data
                    me.$vs.loading.close()
                    //para recursos externos
                    if(me.getPermisoPonchado == '1' && me.getPermisoSopaLetras == '0' && me.getPermisoAdivinanza == '0'){
                        var datos = me.juegos.filter(p => p.id_tipo_juego == 1)
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }
                    if(me.getPermisoPonchado == '1' && me.getPermisoSopaLetras == '1' && me.getPermisoAdivinanza == '0'){
                        var datos = me.juegos.filter(p => p.id_tipo_juego == 1 || p.id_tipo_juego == 2)
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }
                    if(me.getPermisoPonchado == '1' && me.getPermisoSopaLetras == '0' && me.getPermisoAdivinanza == '1'){
                        var datos = me.juegos.filter(p => p.id_tipo_juego == 1 || p.id_tipo_juego == 3)
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }
                    if(me.getPermisoPonchado == '0' && me.getPermisoSopaLetras == '1' && me.getPermisoAdivinanza == '0'){
                        var datos = me.juegos.filter(p => p.id_tipo_juego == 2)
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }
                    if(me.getPermisoPonchado == '0' && me.getPermisoSopaLetras == '1' && me.getPermisoAdivinanza == '1'){
                        var datos = me.juegos.filter(p => p.id_tipo_juego == 2 || p.id_tipo_juego == 3)
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }
                    if(me.getPermisoPonchado == '0' && me.getPermisoSopaLetras == '0' && me.getPermisoAdivinanza == '1'){
                        var datos = me.juegos.filter(p => p.id_tipo_juego == 3)
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }else{
                        var datos = me.juegos
                        console.log('juegos',datos)
                        me.juegosRecursosExternos = datos
                        return;
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        crearJuego(item) {
            localStorage.id_tipo_juego = item.id_tipo_juego
            localStorage.nombre_tipo_juego = item.nombre_tipo_juego
            if (localStorage.getItem("tipo_asignatura") == "docente") {
                if (this.grupo_usuario == 10) {
                    this.$router.push('/director/institucion/docentes/contenidos/libro/zonadiversion/juegoDocente');
                }
                else {
                    this.$router.push('/docente/a_contenido_juego_docente');
                }
            }
            if (localStorage.getItem("tipo_asignatura") == "prolipa") {
                if (this.grupo_usuario == 10) {
                    this.$router.push('/director/institucion/docentes/contenidos/libro/zonadiversion/juegoDocente');
                }
                if (this.grupo_usuario == 16) {
                    this.$router.push('/colegios/docente/contenido_juego_docente');
                }
                 else {
                    this.$router.push('/docente/contenido_juego_docente');

                }
            }
        }
    },
}
</script>
