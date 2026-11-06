<template>
  <vx-card
  >
    <p v-if="pedido.contrato_generado" class="font-semibold" style="opacity: 0.4;">{{ pedido.contrato_generado }}</p>
    <div  class="flex" style="flex-wrap: wrap;margin-top: -10px;" >
      <template>
        <!--TOTAL ALCANCE-->
        <div class="p-6 pb-0" v-if="arregloAlcance.length > 0">
          <div class="flex justify-center">
              <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                <svg fill="#000000" width="28px" height="28px" viewBox="0 0 24 24" id="up-direction-circle" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><path id="secondary" d="M12,3a9,9,0,1,0,9,9A9,9,0,0,0,12,3Zm2,9v5H10V12H8l3.18-4.61a1,1,0,0,1,1.64,0L16,12Z" style="fill: rgb(44, 169, 188); stroke-width: 2;"></path><path id="primary" d="M14,12v5H10V12H8l3.18-4.61a1,1,0,0,1,1.64,0L16,12ZM12,3a9,9,0,1,0,9,9A9,9,0,0,0,12,3Z" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></svg>
              </span>
          </div>
          <div class="flex justify-center">
            <h2 class="mb-1 font-bold text-warning" style="opacity:0.7;">${{ totalAlcance | filtrarDecimal }}</h2>
          </div>
          <div class="ml-4"><span class="">Total Alcances</span></div>
        </div>
        <!--TOTAL VENTA BRUTA-->
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                  <feather-icon icon="ShoppingCartIcon"  svgClasses="h-8 w-7" class="ml-1" />
                </span>
            </div>
            <div class="flex justify-center">
                <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ totalVentaBruta | filtrarDecimal }}</h2>
            </div>
            <div class="ml-4"><span class="">Total Venta Bruta</span></div>
        </div>
        <!--COMISION ESCUELA-->
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                  <feather-icon icon="PercentIcon"  svgClasses="h-8 w6" class="ml-1" />
                </span>
            </div>
            <div class="flex justify-center">
                <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">{{ pedido.descuento }}%</h2>
            </div>
            <div class="truncate"><span class="">Comisión Escuela</span></div>
        </div>
        <!--=======VALORES VENTA REAL O NETA======-->
        <div class="p-6 pb-0" v-if="pedido.contrato_generado">
          <div class="flex justify-center">
            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
              <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M951.87 253.86c0-82.18-110.05-144.14-256-144.14s-256 61.96-256 144.14c0 0.73 0.16 1.42 0.18 2.14h-0.18v109.71h73.14v-9.06c45.77 25.81 109.81 41.33 182.86 41.33 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98h-73.12v73.14h73.12c67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0 28.27-72.93 71-182.86 71l-25.89 0.12c-15.91 0.14-31.32 0.29-46.34-0.11l-1.79 73.11c8.04 0.2 16.18 0.27 24.48 0.27 7.93 0 16-0.05 24.2-0.12l25.34-0.12c67.44 0 127.02-13.35 171.81-35.69 6.97 7.23 11.04 14.41 11.04 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c67.44 0 127.01-13.35 171.81-35.69 6.98 7.22 11.05 14.4 11.05 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c145.95 0 256-61.96 256-144.14 0-0.68-0.09-1.45-0.11-2.14h0.11V256h-0.18c0.03-0.72 0.2-1.42 0.2-2.14z m-438.86 0c0-28.27 72.93-71 182.86-71s182.86 42.73 182.86 71c0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98z" fill="#0F1F3C" /><path d="M330.15 365.71c-145.95 0-256 61.96-256 144.14 0 0.73 0.16 1.42 0.18 2.14h-0.18v256c0 82.18 110.05 144.14 256 144.14s256-61.96 256-144.14V512h-0.18c0.02-0.72 0.18-1.42 0.18-2.14 0-82.18-110.05-144.15-256-144.15zM147.29 638.93c0-6.32 4.13-13.45 11.08-20.62 44.79 22.33 104.36 35.67 171.78 35.67 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.72-182.86-70.97z m182.86-200.07c109.93 0 182.86 42.73 182.86 71 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98c0-28.27 72.93-71 182.86-71z m0 400.14c-109.93 0-182.86-42.73-182.86-71 0-6.29 4.17-13.43 11.11-20.6 44.79 22.32 104.34 35.66 171.75 35.66 67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0.01 28.26-72.92 70.99-182.85 70.99z" fill="#0F1F3C" /></svg>
            </span>
          </div>
          <div class="flex justify-center">
              <h2 class="mb-1 font-bold text-success">${{ pedido.ven_neta | filtrarDecimal }}</h2>
          </div>
          <div class="truncate"><span class="ml-5 text-success">VENTA NETA</span></div>
        </div>
      </template>
    </div>
    <div v-if="tipo == 3">
      <vs-alert title="Advertencia" color="danger" active="true">
        <p>Los valores de comisiones para los beneficiarios no es la correcta</p>
      </vs-alert>
    </div>
  </vx-card>
</template>
<script>
  import {
    mapState
} from "vuex";
export default{
  data(){
    return{
      arregloBeneficiarios:[],
      arregloPorcentajes:[],
      arregloAlcance:[],
      valorComision:0,
      tipo:0,
      totalAlcance:0,
      totalVentaBruta:0,
      ventaReal:0,
      comisionReal:0,
      valorComisionReal:0,
      totalRealContratos:0,
    }
  },
  props:{
    desdeVerificacion:{
      type:Number,
      default:0
    },
    pedido:{
      type:Object,
      default:function(){
        return {}
      },
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      },
    },
  },
  watch:{
    pedido(results){
      let me = this
      me.getAlcances()
      me.getValoresBeneficiarios()
    },
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
  },
  mounted(){
    let me = this;
    me.getAlcances()
    me.getValoresBeneficiarios()
    me.getTotalVentaRealContratos()
  },
  methods:{
    getTotalVentaRealContratos(){
      let me = this;
      me.totalRealContratos = 0
      const { id_asesor , id_periodo  } = me.pedido
      me.$http.get(this.$server_url+`pedigo_Pagos?getVentaRealXAsesor=1&idAsesor=${id_asesor}&idPeriodo=${id_periodo}`)
      .then(function (res) {
        let datos = res.data
        if(datos.length>0){
          datos.forEach(element => {
            me.totalRealContratos += element.TotalVentaReal
          });
        }
      })
    },
    getAlcances(){
      let me = this;
      me.arregloAlcance = []
      this.$http.get(this.$server_url+'getAlcancePedido?id_pedido='+me.pedido.id_pedido)
      .then(function (res) {
        let datos = res.data
        //estado alcance => 0 = abierto; 1 = cerrado; 2 = rechazado;
        if(datos.length > 0){
          let datos2 = datos.filter(p => p.estado_alcance == 1 && p.venta_bruta > 0)
          if(datos2.length > 0){
            datos2.forEach(element => {
              var cal             = new Object();
              cal.id              = element.id
              cal.id_periodo      = element.id_periodo
              cal.id_pedido       = element.id_pedido
              cal.venta_bruta     = element.venta_bruta
              cal.total_unidades  = element.total_unidades
              me.arregloAlcance.push(cal)
            });
            //sumar total alcance
            let getValoresAlcance = me.arregloAlcance.filter(p => p.venta_bruta)
            let total = getValoresAlcance.reduce((a, b) => a + (b["venta_bruta"] || 0), 0);
            me.totalAlcance      = total
          }
        }
        me.totalVentaBruta = me.pedido.TotalVentaReal
        me.valorComision = (me.totalVentaBruta * me.pedido.descuento) / 100
      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
      })
    },
    getValoresBeneficiarios(){
      let me = this;
      var url = ""
      //tipoUrl => 0 => VENTA REAL GENERAL; 1 => VENTA REAL POR VERIFICACION
      if(me.desdeVerificacion == '0') {
        url = this.$server_url+'getBeneficiarios/'+me.pedido.id_pedido+'/0/0'
      }else{
        url = this.$server_url+'getBeneficiarios/'+me.pedido.id_pedido+'/1/'+me.VerificacionSelect.id
      }
      this.$http.get(url)
        .then(function (res) {
          let datos = res.data
          if(datos.length>0){
            me.ventaReal          =  datos[0].ventaReal
            me.comisionReal       =  datos[0].comisionReal
            me.valorComisionReal  =  datos[0].valorComisionReal
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
  }
}
</script>
<style scoped>
.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}

</style>
