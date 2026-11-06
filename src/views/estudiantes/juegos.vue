<template>
<div>
    <div class="vx-row">
        
    
        <!-- <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(recorrer,$k) in juegos" :key="$k"> -->
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
                        <vs-button color="primary" class="w-full" type="border" icon-pack="feather" @click="datojuego(item)" icon="icon-book">Juego Web</vs-button>
                    </div>
                </vx-card>
            </div>
        <!-- </div> -->
    </div>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
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
            miusuario:[],
            libros:[],
        }
    },
    created() {
        let me = this
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = this.usuario
    },
    mounted() {
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this;
        
            // this.$http.get(this.$server_url+'codigoslibros?idusuario=' + me.usuario.idusuario)
            //     .then(function (response) {
            //         me.libros = response.data
            //         console.log(me.libros);
            //         me.libros.forEach(element => {
            //             this.$http.get(this.$server_url+'estudiantejuegos?idasignatura=' + element.asignatura_idasignatura)
            //                 .then(function (response) {
            //                     response.data.forEach(element => {
            //                         me.juegos.push(element);
            //                     });
            //                 })
            //                 .catch(function (error) {})
            //         });
            //     })
            //     .catch(function (error) {})
                 me.$vs.loading();
               this.$http.get(this.$server_url+'codigoslibrosEstudiante?idusuario='+me.usuario.idusuario)
                .then(res => {
                 me.juegos = res.data
                  me.$vs.loading.close()
                
                })
                .catch(error => {
                    console.log(error)
                     me.$vs.loading.close()
                })

        },
        datojuego(url) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombreasignatura
            let h_recursotipo = 8; //8 = juego
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'abrir',
                'recurso_tipo': 'juego',
                'recurso_nombre': url.nombre,
                'recurso_detalle': 'abrir juego web',
            }
          
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.url = url.carpeta;
            // this.$router.push('/estudiante/juego/digital');
            window.open('/estudiante/juego/digital','_blank')
        }
    },
}
</script>
