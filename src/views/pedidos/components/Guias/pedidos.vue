<template>
  <div>
    <vx-card title="Detalle Pedido - Guia" title-color="success">
      <div v-if="id_pedido != undefined">
        <formpedidos ref="formpedidos" :sendPedido="ObjetoGuia" :pedidoId="ObjetoGuia.id_pedido" @changeEdit="changeEdit"/>
      </div>
      <vs-divider>Valores de las guias</vs-divider>
      <div v-if="id_pedido > 0 && periodoSelect.idperiodoescolar <= mixinIdInicioFormatoNewData">
        <formlibros ref="formlibros" :id_pedido="id_pedido"/>
      </div>
      <div v-else-if="id_pedido > 0 && periodoSelect.idperiodoescolar > mixinIdInicioFormatoNewData">
        <!-- Hola -->
        <formlibros_new ref="formlibros_new" :id_pedido="id_pedido"/>
      </div>
    </vx-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
import vSelect from 'vue-select';
const formpedidos = () => import('./form_pedido.vue')
const formlibros  = () => import('./form_libros.vue')
const formlibros_new  = () => import('./form_libros_new.vue')
import axios from 'axios'
export default {
    components:{
      'v-select': vSelect,
      formpedidos,
      formlibros,
      formlibros_new,
    },
    props:{
      ObjetoGuia:{
        type:Object,
        default:function(){
          return {}
        }
      },
      periodoSelect:{
        type:Object,
        default:function(){
          return {}
        }
      },
    },
    data: () => ({
      usuario: [],
      id_pedido: 0,
      id_pedido2: 0,
      sendPedido:'',
      mixinIdInicioFormatoNewData: null,
    }),
    computed: {
      ...mapState(["auth", "userRoot", "susuario", "groupFacturador", "groupBodega","userAsesor","ObjectGuia"]),
    },
    watch:{
      ObjetoGuia(results){
        this.id_pedido = results.id_pedido
        this.sendPedido = results
      },
      id_pedido(results){
        this.id_pedido = results
      }
    },
    mounted() {
      let me = this
      // Verifica si los datos existen en localStorage
      const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');            
      if (mixinData) {
      // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
      const parsedData = JSON.parse(mixinData);
      me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
      console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
      } else {
          console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
      }
      // FIN Verificación si los datos existen en localStorage
      this.usuario   = JSON.parse(localStorage.getItem('usuario'));
      me.sendPedido  = me.ObjetoGuia
      this.id_pedido = me.sendPedido.id_pedido
    },
    methods: {
      changeEdit(e){
        let me = this
        me.id_pedido = e
      }
    },
}
</script>
