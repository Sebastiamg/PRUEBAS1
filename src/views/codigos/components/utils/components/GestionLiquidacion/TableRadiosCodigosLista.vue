<template>
  <div>
    <div class="mt-5">
      <ul style="display:flex;flex-wrap: wrap;">
        <li class="m-2">
        <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{sumaTotal}}</span> Todos</vs-radio>
        </li>
        <li class="m-2">
        <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="2"><span style="font-weight:bold;">{{sumaCodigosBloqueados}}</span> Códigos bloqueados</vs-radio>
        </li>
        <li class="m-2">
        <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{sumaCodigosRegalados}}</span> Regalados sin liquidar</vs-radio>
        </li>
        <li class="m-2">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span style="font-weight:bold;">{{sumarCodigosNoleidos}}</span> Códigos sin leer </vs-radio>
        </li>
        <li class="m-2">
        <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="5"><span style="font-weight:bold;">{{sumarCodigosLiquidados}}</span><span :style="sumarCodigosLiquidados > 0 ? 'color:red':''"> Códigos Liquidados </span> </vs-radio>
        </li>
        <li class="m-2">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="6"><span style="font-weight:bold;">{{sumaCodigosRegaladosLiquidados}}</span><span :style="sumaCodigosRegaladosLiquidados > 0 ? 'color:red':''"> Regalados Liquidados </span> </vs-radio>
        </li>
        <li class="m-2">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="8"><span style="font-weight:bold;">{{SumaCodigosDevolucion}}</span> Códigos devueltos</vs-radio>
        </li>
        <li class="m-2">
        <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="7"><span style="font-weight:bold;">{{sumarCodigosporLiquidarse}}</span><span :style="sumarCodigosporLiquidarse > 0 ? 'color:red':''"> Códigos a liquidarse (leidos) </span> </vs-radio>
        </li>
        <li class="m-2">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="9"><span style="font-weight:bold;">{{sumarCodigosVentaDirecta}}</span> Venta directa</vs-radio>
        </li>
        <li class="m-2">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="10"><span style="font-weight:bold;">{{sumarCodigosVentaLista}}</span> Venta lista</vs-radio>
        </li>
        <li class="m-2">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="11"><span style="font-weight:bold;">{{ sumarCodigosGuia }}</span> Guía</vs-radio>
        </li>
        <li class="m-2" v-if="ifErrorProforma == 1">
          <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="12"><span style="font-weight:bold;">{{ sumarErroresProforma }}</span> <b class="text-danger font-bold"> Errores</b></vs-radio>
        </li>
      </ul>
    </div>
    <div>
      <gestionCodigosListaVue :arregloCodigos="tmparregloCodigos" :openModal="openModal"/>
    </div>
  </div>
</template>
<script>
import gestionCodigosListaVue from '@/views/codigos/components/utils/gestionCodigosLista'
export default{
  components:{
    gestionCodigosListaVue,
  },
  data(){
    return{
      tmparregloCodigos:[],
      codigoTipo:'0',
    }
  },
  props:{
    arregloCodigos:{
      type:Array,
      default:function(){
        return []
      }
    },
    openModal:{
      type:Number,
      default:0,
    },
    ifErrorProforma:{
      type:Number,
      default:0,
    }
  },
  computed:{
    sumaTotal(){
      let me = this;
      let total = me.arregloCodigos.length
      return total
    },
    SumaCodigosDevolucion(){
      let me = this;
      let datos       = me.arregloCodigos.filter(p => p.estado_liquidacion == '3');
      let resultado   = datos.length
      return resultado
    },
    sumaCodigosRegalados(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosRegaladosLiquidados(){
      let me = this;
      let datos        = me.arregloCodigos.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosBloqueados(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => p.estado_liquidacion != '3');
      let datos         = primerFiltro.filter(p => p.estado == '2')
      let resultado     = datos.length
      return resultado
    },
    sumarCodigosActivos(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosLiquidados(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosporLiquidarse(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado =='2'));
      let datos        = primerFiltro
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosLeidos(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos        = primerFiltro.filter(p => p.bc_estado =='2')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosNoleidos(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos        = primerFiltro.filter(p => p.bc_estado =='1')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosVentaDirecta(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 1));
      let resultado    = primerFiltro.length
      return resultado
    },
    sumarCodigosVentaLista(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 2));
      let resultado    = primerFiltro.length
      return resultado
    },
    sumarCodigosGuia(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.estado_liquidacion == '4'));
      let resultado    = primerFiltro.length
      return resultado
    },
    sumarErroresProforma(){
      let me = this;
      let primerFiltro = me.arregloCodigos.filter(p => (p.errorProforma == '1'));
      let resultado    = primerFiltro.length
      return resultado
    },
  },
  mounted() {
    let me = this;
    me.filtroTipo()
  },
  methods: {
    filtroTipo(){
      let me = this;
      me.tmparregloCodigos = []
      let datos = me.arregloCodigos
      //para ver los codigos activos
      // if(me.codigoTipo == 1){
      //     let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      //     me.tmparregloCodigos = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
      //     return
      // }
      //para ver los codigos bloqueados
      if(me.codigoTipo == 2){
          let primerFiltro = datos.filter(p => p.estado_liquidacion != '3');
          me.tmparregloCodigos = primerFiltro.filter(p => p.estado =='2')
          return
      }
      //para ver lso codigos sin ler
      if(me.codigoTipo == 3){
          let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
          me.tmparregloCodigos = primerFiltro.filter(p => p.bc_estado =='1')
          return
      }
      //para ver los codigos regalados
      if(me.codigoTipo == 4){
          let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
          me.tmparregloCodigos = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
          return
      }
      //para ver los codigos liquidados
      if(me.codigoTipo == 5){
          let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
          me.tmparregloCodigos = primerFiltro.filter(p => p.estado_liquidacion =='0')
          return
      }
      //para ver los codigos regalados liquidados
      if(me.codigoTipo == 6){
          me.tmparregloCodigos = datos.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
          return
      }
      //para ver los codigos por liquidarse
      if(me.codigoTipo == 7){
          let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado ==2));
          me.tmparregloCodigos = primerFiltro
          return
      }
      //para ver los codigos devueltos
      if(me.codigoTipo == 8){
        let primerFiltro = datos.filter(p => p.estado_liquidacion == '3');
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver los codigos venta directa
      if(me.codigoTipo == 9){
        let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 1));
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver los codigos venta lista
      if(me.codigoTipo == 10){
        let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 2));
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver los codigos GUIA
      if(me.codigoTipo == 11){
        let primerFiltro = datos.filter(p => p.estado_liquidacion == '4');
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver los codigos error proforma
      if(me.codigoTipo == 12){
        let primerFiltro = datos.filter(p => p.errorProforma == '1');
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver todos los codigos
      else{
        me.tmparregloCodigos = datos
      }
    },
  },
}
</script>
