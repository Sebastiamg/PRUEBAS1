<template>
    <div>
        <vs-card>
            <vs-tabs :color="colorx">
                <!-- <vs-tab label="Acortador de links" v-if="usuario.id_group == 1" icon-pack="feather" icon="icon-link" @click="colorx = '#2468D0'">
                  <listadoAcortador/>
                </vs-tab> -->
                <vs-tab label="Tickets Abiertos" icon-pack="feather" icon="icon-book-open" @click="colorx = '#3ACA14'">
                  <ticketAbierto/>
                </vs-tab>
                <vs-tab label="Tickets Cerrados" icon-pack="feather"  icon="icon-x-square" @click="colorx = '#FFA500'">
                  <ticketCerrado/>
                </vs-tab>
                <vs-tab label="Crear link acortados" v-if="usuario.id_group == 1" icon-pack="feather" icon="icon-link" @click="colorx = '#2468D0'">
                  <ScreenAcortadorVue/>
                </vs-tab>
                <vs-tab label="Preguntas Frecuentes" v-if="usuario.id_group == 1" icon-pack="feather"  icon="icon-x-square" @click="colorx = '#5440f0'">
                  <PreguntasFrecuentesVue/>
                </vs-tab>
                <!-- <vs-tab label="Video tutoriales" v-if="usuario.id_group == 1" icon-pack="feather"  icon="icon-youtube" @click="colorx = '#E05042'">
                  <MenuTutorialVue/>
                </vs-tab> -->
            </vs-tabs>
        </vs-card>

    </div>
</template>


<script>
import recursosVue from '../admin/historico/recursos.vue'
import ticketAbierto from './ticket.vue'
import ticketCerrado from './ticketCerrado.vue'
import PreguntasFrecuentesVue from '../admin/preguntasFaq.vue'
import configuracionVue from '../admin/configuracion/configuracion.vue'
import listadoAcortador from '../admin/acortador/listadoAcortador.vue'
import MenuTutorialVue from './tutoriales/MenuTutorial.vue'
const ScreenAcortadorVue = () => import('../admin/acortador/ScreenAcortador.vue')
export default {

    data(){
        return{
            colorx: '#8B0000',
            usuario:[],
            permisoRoot:false,
        }
    },
    methods:{
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
                .then(function (res) {
                    if(res.data.status == '1'){
                        me.permisoRoot = true
                    }else{
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
      let me  = this;
      me.getUserRoot()
    },
    components:{
        ticketAbierto,
        ticketCerrado,
        configuracionVue,
        PreguntasFrecuentesVue,
        recursosVue,
        listadoAcortador,
        MenuTutorialVue,
        ScreenAcortadorVue
    }
}
</script>
