<template>
  <div class="mt-5">
    <div v-if="desdePedido == 1" class="flex justify-start">
      <div v-if="setcobro_venta_directa == '0'">
        <p v-if="!userAsesor"  class="text-danger text-center">Cobro de venta directa no configurado <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span> </p>
      </div>
      <div v-if="setcobro_venta_directa == '1'">
        <p class="text-success text-center">Cobro venta directa 100%   <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span></p>
      </div>
      <div v-if="setcobro_venta_directa == '2'">
        <p class="text-success text-center">Cobro venta directa Comision %{{ sendPedido.descuento  }} de la escuela <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span></p>
      </div>
      <div v-if="setcobro_venta_directa == '3'">
        <p class="text-success text-center">% Descuento Personalizado</p>
      </div>
    </div>
    <div v-if="desdePedido == 1" class="mt-1">
      <p v-if="setPersonalizado == 1">Personalizado: Activado</p>
      <p v-if="setPersonalizado == 0">Personalizado: Desactivado</p>
    </div>
    <!--MENU-->
    <div class="flex mt-5">
      <!-- <vs-button color="primary" @click="menu = 0;" icon-pack="feather" icon="icon-gift" class="mr-2" type="border">Códigos regalados</vs-button> -->
      <vs-button color="success" v-if="!userAsesor"  @click="menu = 1" icon-pack="feather" icon="icon-settings" type="border">Configurar regalados</vs-button>
      <vs-button v-if="!userAsesor" @click="menu = 2;" class="ml-2" color="primary" type="border">Configurar Cobro de venta</vs-button>
      <vs-button v-if="!userAsesor" @click="menu = 3;" class="ml-2" color="dark" type="border">Cobro Personalizado</vs-button>
    </div>
    <!--COMPONENTES-->
    <!-- <div v-if="menu == 0">
      <TableRegaladosVue
      :arregloRegalados="arregloRegalados"
      @recharge="recharge"
      />
    </div> -->
    <div v-if="menu == 1">
      <TableConfigurarRegaladosVue
      :datosInstitucion="datosInstitucion"
      :VerificacionSelect="VerificacionSelect"
      :contrato="contrato"
      @recharge="recharge"
      />
    </div>
    <div v-if="menu == '2'">
      <ConfigurarCobroVentaVue
      :VerificacionSelect="VerificacionSelect"
      :sendPedido="sendPedido"
      :setcobro_venta_directa="setcobro_venta_directa"
      :settipoPago="settipoPago"
      :setcampoPersonalizado="setcampoPersonalizado"
      :datosInstitucion="datosInstitucion"
      @changeReturn="changeReturn"
      />
    </div>
    <!--COBRO PERSONALIZADO-->
    <div v-if="menu == 3" class="mt-4">
      <MenuDescuentosVue
      :VerificacionSelect="VerificacionSelect"
      :sendPedido="sendPedido"
      :setPersonalizado="setPersonalizado"
      :setcampoPersonalizado="setcampoPersonalizado"
      :datosInstitucion="datosInstitucion"
      :DetalleVerificacion="DetalleVerificacion"
      @changeReturnPersonalizado="changeReturnPersonalizado"
      />
    </div>
  </div>
</template>
<script>
import TableRegaladosVue from './TableRegalados.vue';
import TableConfigurarRegaladosVue from './TableConfigurarRegalados.vue';
import ConfigurarCobroVentaVue from '../ConfigurarCobroVenta.vue';
import MenuDescuentosVue from '@/views/temporadas/components/Pedidos/Descuentos/MenuDescuentos'
export default{
  components:{
    TableConfigurarRegaladosVue,
    TableRegaladosVue,
    ConfigurarCobroVentaVue,
    MenuDescuentosVue,
  },
  data(){
    return{
      menu:1,
      titleTipoPago:'',
    }
  },
  watch:{
    arregloRegalados(results){
      let me = this;
      me.arregloRegalados = results
    },
    setcobro_venta_directa(results){
      let me = this;
      me.setcobro_venta_directa = results
      me.setearWords()
    },
    settipoPago(results){
      let me = this
      me.settipoPago = results
      me.setearWords()
    },
    setPersonalizado(results){
      let me = this;
      me.setPersonalizado = results
      me.setearWords()
    }
  },
  props:{
    userFacturador:{
      type:Boolean,
      default:false
    },
    userRoot:{
      type:Boolean,
      default:false
    },
    userAsesor:{
      type:Boolean,
      default:false
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    arregloRegalados:{
      type:Array,
      default:[],
    },
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    desdePedido:{
      type:Number,
      default:0
    },
    setcobro_venta_directa:{
      type:Number,
      default:0
    },
    sendPedido:{
      type:Object,
      default:{}
    },
    settipoPago:{
      type:Number,
      default:0,
    },
    setPersonalizado:{
      type:Number,
      default:0
    },
    setcampoPersonalizado:{
      type:String,
      default:''
    },
    contrato:{
      type:String,
      default:''
    },
    DetalleVerificacion:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  mounted(){
    let me  =this;
    me.setearWords()
  },
  methods:{
    setearWords(){
      let me = this;
      if(me.settipoPago  == 0) me.titleTipoPago = "Tipo pago no configurado"
      if(me.settipoPago  == 1) me.titleTipoPago = "Cancelar Total"
      if(me.settipoPago  == 2) me.titleTipoPago = "Descontar"
      if(me.settipoPago  == 3) me.titleTipoPago = "Regalado"
    },
    recharge(e){
      let me = this;
      me.$emit('recharge',e)
    },
    changeReturn(e){
      let me = this;
      if(e == 1)  return me.menu = '1'
      else{
        me.menu = '1'
        let datos = {
          tipo:4,
          data:e
        }
        me.$emit('recharge',datos)
      }
    },
    changeReturnPersonalizado(e){
      let me = this
      me.menu = '3'
      let datos = {
        tipo:6,
        data:e
      }
      me.$emit('recharge',datos)
    },
  }
}
</script>
