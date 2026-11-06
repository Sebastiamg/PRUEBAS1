<template>
    <div>
      <div v-if="menu == 1">
        <ScrenSolicitudAnticipoVue :ObjectPedido="sendPedido" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" @rechargePedido="$emit('rechargePedido',true)"/>
      </div>
    </div>
</template>
<script>
  import {
    mapState
} from "vuex";
import PagosRepository from "../../../../repositories/PagoRepository";
const ScrenSolicitudAnticipoVue = () => import('./solicitudAnticipo/ScreenSolicitudAnticipo.vue')
export default{
    components:{
        ScrenSolicitudAnticipoVue
    },
    data(){
        return{
            menu:0,
        }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    mounted(){
      let me = this
      me.sendPedido = me.ObjectPedido
      me.generateAnticipoDeuda()
      if(me.groupFacturador){
      }else{
        me.menu = 1 ;
      }
    },
    watch:{
      ObjectPedido(results){
        let me = this
        me.sendPedido = me.ObjectPedido
      }
    },
    methods:{
      generateAnticipoDeuda(){
        let me = this;
        PagosRepository.generateAnticiposDeuda(me.ObjectPedido.id_pedido).then(r => {  me.menu = 1 ;})
      },
    }
}
</script>
