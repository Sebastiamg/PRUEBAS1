<template>
  <div>
    xddd
    <div v-if="submenu == 1">
      <ListaVerificacionesVue
      :userRoot="userRoot"
      :contrato="contrato"
      :arregloVerificaciones="arregloVerificaciones"
      :usuario="usuario"
      :totalLiquidacion="totalLiquidacion"
      :valor_comision="valor_comision"
      :totalPorPagar="totalPorPagar"
      :totalPagado="totalPagadoClientes"
      :totalPagadoProlipa="totalPagadoProlipa"
      :totalCobroVentaDirecta="totalCobroVentaDirecta"
      :TotalConvenio="TotalConvenio"
      :totalDescuento="totalDescuento"
      :sendPedido="sendPedido"
      :datosInstitucion="{idInstitucion:sendPedido.id_institucion,id_periodo:sendPedido.id_periodo,contrato:sendPedido.contrato_generado}"
      @rechargeValores="rechargeValores"
      />
    </div>
  </div>
</template>
<script>
  import {
      mapState
  } from "vuex";
import ListaVerificacionesVue from './ListaVerificaciones.vue';
import PagosRepository from '../../../../../repositories/PagoRepository';
export default{
  components:{
    ListaVerificacionesVue,
  },
  data(){
    return{
      usuario:[],
      activeItem: 0,
      type: 'Shadow',
      arregloVerificaciones:[],
      submenu:0,
      totalPorPagar:0,
      totalPagadoClientes:0,
      totalPagadoProlipa:0,
      PProlipaAumentar:0,
      PProlipaDisminuir:0,
      totalLiquidacion:0,
      valor_comision:0,
      totalCobroVentaDirecta:0,
      TotalConvenio:0,
      totalDescuento:0,
    }
  },
  props:{
    contrato:{
      type:String,
      default:""
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      },
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario']),
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.submenu = 0
    me.limpiar()
    me.generateAnticipoDeuda()
  },
  methods:{
    generateAnticipoDeuda(){
      let me = this;
      PagosRepository.generateAnticiposDeuda(me.contrato).then(r => { })
      me.getVerificaciones()
    },
    rechargeValores(){
      let me  = this
      me.limpiar()
      me.getVerificaciones()
    },
    updatePagosAnticiposDeuda(){
      let me = this;

    },
    getVerificaciones(){
      let me = this;
      me.totalPorPagar            = 0
      me.totalPagadoClientes      = 0
      me.totalPagadoProlipa       = 0
      me.PProlipaAumentar         = 0
      me.PProlipaDisminuir        = 0
      me.totalLiquidacion         = 0
      me.totalCobroVentaDirecta   = 0
      me.TotalConvenio            = 0
      me.totalDescuento           = 0
      me.valor_comision           = 0
      me.arregloVerificaciones    = []
      var url = ""
      if(me.contrato == "" || me.contrato == "null" || me.contrato == undefined) { url = this.$server_url+`n_verificacion?getDocumentosLiqSinContratos=yes&institucion_id=${ me.sendPedido.id_institucion }&periodo_id=${ me.sendPedido.id_periodo }`}
      else { url = this.$server_url+`n_verificacion?getVerificacionXcontrato=yes&contrato=${ me.contrato }` }
      this.$http.get(url)
        .then(function (res) {
          let datos = res.data.filter(p => p.estado == 0)
          if(datos.length > 0){
            me.arregloVerificaciones = datos.sort((a, b) => a.id - b.id);
            me.totalPagadoClientes   = parseFloat(res.data[0].Pcliente)
            me.totalPagadoProlipa    = Math.abs(parseFloat(res.data[0].PProlipaAumentar - res.data[0].PProlipaDisminuir))
            me.PProlipaAumentar      = res.data[0].PProlipaAumentar
            me.PProlipaDisminuir     = res.data[0].PProlipaDisminuir
            //let preSuma = me.arregloVerificaciones.filter(p => p.estado_pago == 2)
            let preSuma = me.arregloVerificaciones.filter(p => p.estado_pago == 2 || p.estado_pago == 1)
            if(preSuma.length > 0){
              preSuma.map(p =>{
                let preValorLiquidacion = p.valor_liquidacion
                if(preValorLiquidacion == null || preValorLiquidacion == "null" || preValorLiquidacion == "") { preValorLiquidacion = 0 }
                me.valor_comision         = me.valor_comision + parseFloat(p.valor_comision)
                me.totalCobroVentaDirecta = me.totalCobroVentaDirecta + parseFloat(p.totalCobroVentaDirecta)
                me.TotalConvenio          = me.TotalConvenio  + parseFloat(p.TotalConvenio)
                me.totalDescuento         = me.totalDescuento + parseFloat(p.totalDescuento)
              })
            }
            // me.totalLiquidacion =  me.valor_comision - (me.TotalConvenio + me.totalDescuento + me.totalCobroVentaDirecta)
            let preSumaDescontar = parseFloat(me.setearNumero(me.TotalConvenio)) + parseFloat(me.setearNumero(me.totalDescuento)) + parseFloat(me.setearNumero(me.totalCobroVentaDirecta))
            me.totalLiquidacion = me.valor_comision - (preSumaDescontar);
            //=========PROCESO============
            var preTotalLiquidacion = me.totalLiquidacion
            if(me.PProlipaAumentar > 0){
              preTotalLiquidacion = parseFloat(me.PProlipaAumentar) + parseFloat(preTotalLiquidacion)
              me.totalPorPagar = preTotalLiquidacion
              me.submenu = 1
              return
            }
           //si prolipa disminuir es menor a 0 resto al total pendiente
           if(me.PProlipaDisminuir > 0){
            preTotalLiquidacion =   preTotalLiquidacion - me.PProlipaDisminuir
            me.totalPorPagar = preTotalLiquidacion
            me.submenu = 1
            return
           }
           else{
            me.totalPorPagar = preTotalLiquidacion - me.totalPagadoClientes
            me.submenu = 1
            return
           }
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    limpiar(){
      let me                  = this;
      me.totalPorPagar        = 0
      me.totalPagadoClientes  = 0
      me.totalPagadoProlipa   = 0
      me.totalLiquidacion     = 0
    },
    setearNumero(numero){
      if(numero == 0 ||  numero == undefined || isNaN(numero) || numero == null){
        return 0
      }else{
        const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return transformar
      }
    },
  }
}
</script>
