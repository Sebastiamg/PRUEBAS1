<template>
  <div class="mt-2">
    <div>
      <nav class="breadcrumbs mt-3" v-if="!userAsesor">
        <span  class="breadcrumbs__item btnMenuConfiguracion activeBtn menuConfiguracion0 cursor-pointer"   @click="filtro = 0;estadoMenu();">Valores</span>
        <span  class="breadcrumbs__item btnMenuConfiguracion menuConfiguracion1 cursor-pointer"             @click="filtro = 1;estadoMenu();">Configuración Reporte</span>
      </nav>
      <!--Componentes-->
      <div class="mt-3">
        <div v-if="filtro == 0">
          <exportLiquidacionVue
          :VerificacionSelect="VerificacionSelect"
          :sumaTotalRegalados="sumaTotalRegalados"
          :sumaTotalVALOR="sumaTotalVALOR"
          :sumaTotalValorRegalados="Number(sumaTotalValorRegalados) || 0"
          :DetalleVerificacion="DetalleVerificacion"
          :totalCobroVenta="Number(totalCobroVenta) || 0"
          :sendPedido="sendPedido"
          :datosInstitucion="datosInstitucion"
          :desdeConfiguracion="1"
          />
        </div>
        <div v-if="filtro == 1">
          <ConfiguracionReporteVue
          :VerificacionSelect="VerificacionSelect"
          @recharge="recharge"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ConfiguracionReporteVue from '@/views/temporadas/components/Pedidos/Configuracion/ConfiguracionReporte'
import exportLiquidacionVue from '@/views/temporadas/components/exportLiquidacion'
export default{
  components:{
    ConfiguracionReporteVue,
    exportLiquidacionVue,
  },
  data(){
    return{
      filtro:0,
    }
  },
  props:{
    sumaTotalRegalados:{
      type:Number,
      default:0,
      validator(value){
        return value%1!==0
      }
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    //PROPS PARA DETALLE DE VALORES
    DetalleVerificacion:{
      type:Array,
      default:[]
    },
    sumaTotalVALOR:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    sumaTotalValorRegalados:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    totalCobroVenta:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    mostrarValores:{
      type:Array,
      default:[]
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    userAsesor:{
      type:Boolean,
      default:false,
    },
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  watch:{
    sumaTotalVALOR(results){
      let me = this
      me.sumaTotalVALOR = results
    },
    sumaTotalValorRegalados(results){
      let me = this
      me.sumaTotalValorRegalados = results
    },

  },
  methods:{
    recharge(e){
      let me  = this;
      me.$emit('recharge',e)
    },
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelectConfiguracion',me.filtro)
      var divs = document.querySelectorAll(".btnMenuConfiguracion");
      for (var i = 0; i < divs.length; i++) {
        divs[i].classList.remove("activeBtn");
      }
      const container = document.querySelector(".menuConfiguracion"+me.filtro);
      container.classList.add("activeBtn");
    },
  }
}
</script>
<style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #000;
color:white;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
