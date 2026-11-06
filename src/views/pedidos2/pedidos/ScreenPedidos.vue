<template>
    <div>
        <div v-if="ifvisual == 0">
            <ListadoPrincipalPedidosVue @showPedido="showPedido" :arregloPeriodos="arregloPeriodos" :submenu="submenu"/>
        </div>
        <div v-if="ifvisual != 0">
            <vs-button class="mb-2 p-2" @click="ifvisual = 0;$store.dispatch('setPuntos', []);" style="display: inline-block;" icon-pack="feather" icon="icon-chevron-left" color="primary">Volver a pedidos</vs-button>
        </div>
        <!--SUBMENU DE PEDIDOS-->
        <div v-if="ifvisual == 1">
            <br><br>
            <ScreenDetallePedidoVue/>
        </div>
        <!--Alcances-->
        <div v-if="ifvisual == 2">
            <menuAlcanceVue/>
        </div>
        <!--libros Obsequios-->
        <div v-if="ifvisual == 3">
            <listadolibrosObsequios/>
        </div>
    </div>
</template>
<script>
const ListadoPrincipalPedidosVue  = () => import('./ListadoPrincipalPedidos.vue')
const ScreenDetallePedidoVue      = () => import('./ScreenDetallePedido.vue')
const ScreenPuntoVentaVue         = () => import('./ScreenDetallePunto.vue')
const menuAlcanceVue              = () => import('../../pedidos/alcance/menuAlcance.vue')
const listadolibrosObsequios      = () => import('./libros/librosObsequios/librosObsequios.vue')
export default{
    components:{
        ListadoPrincipalPedidosVue,
        ScreenDetallePedidoVue,
        menuAlcanceVue,
        listadolibrosObsequios,
        ScreenPuntoVentaVue,
    },
    data(){
        return{
            ifvisual:0,
            submenu:0,
        }
    },
    props:{
        arregloPeriodos:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    methods:{
        showPedido(e,submenu=null){
          let me = this
          me.ifvisual = e
          me.submenu  = submenu
        }
    }
}
</script>
