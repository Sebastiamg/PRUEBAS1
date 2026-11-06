<template>
  <div>
    <vs-tabs alignment="fixed" @click="menu = 0;">
      <vs-tab label="Reporte General">
        <div class="mt-3">
          <vs-alert color="primary">
            <p class="text-center">
              <i class="fa-solid fa-triangle-exclamation"></i> Estos cálculos se hacen de los pedidos que tienen contratos
            </p>
          </vs-alert>
          <!--si no envia el periodo debe elegir el periodo-->
          <div class="vx-row mt-5" v-if="sendPeriodo == 0">
            <div class="vx-col w-full">
              <span>Seleccione un período</span>
              <v-select :options="arregloPeriodos" @input="getDatosReporte();" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodoSelect" />
            </div>
          </div>
          <div v-else>
            <vs-button class="mt-5 p-2" @click="getDatosReporte();"><i class="fa-solid fa-rotate-right"></i> Cargar reporte</vs-button>
          </div>
          <div class="vx-row mt-5" v-if="datosReport">
            <!--con verificaciones-->
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <vx-card  title="Liquidados con contratos (Pedidos con contratos)" class="columna">
                <!-- <p class="font-bold text-2xl">Total: 5</p> -->
                <div class="vx-row mt-3">
                  <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                    <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                      <div class="p-4 bg-success">
                        <svg width="42px" height="38px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 14C2 10.2288 2 8.34315 3.17157 7.17157C4.34315 6 6.22876 6 10 6H14C17.7712 6 19.6569 6 20.8284 7.17157C22 8.34315 22 10.2288 22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14Z" stroke="#fff" stroke-width="2"/>
                          <path d="M16 6C16 4.11438 16 3.17157 15.4142 2.58579C14.8284 2 13.8856 2 12 2C10.1144 2 9.17157 2 8.58579 2.58579C8 3.17157 8 4.11438 8 6" stroke="#fff" stroke-width="2"/>
                          <path d="M12 17.3333C13.1046 17.3333 14 16.5871 14 15.6667C14 14.7462 13.1046 14 12 14C10.8954 14 10 13.2538 10 12.3333C10 11.4129 10.8954 10.6667 12 10.6667M12 17.3333C10.8954 17.3333 10 16.5871 10 15.6667M12 17.3333V18M12 10V10.6667M12 10.6667C13.1046 10.6667 14 11.4129 14 12.3333" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </div>
                      <div class="px-4 text-gray-700">
                          <h3 class="text-sm tracking-wider">Venta bruta</h3>
                          <p class="text-3xl">{{ datosReport.TotalVentaBruta | filtrarDecimal }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                    <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                      <div class="p-4 bg-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2">
                          </path>
                        </svg>
                      </div>
                      <div class="px-4 text-gray-700">
                          <h3 class="text-sm tracking-wider">Venta directa</h3>
                          <p class="text-3xl">{{ datosReport.TotalVentaDirecta | filtrarDecimal }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="vx-col w-full sm:w-full  md:w-full  lg:w-full  xl:w-full  mb-6 mt-3">
                    <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                      <div class="p-4 bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                          </path>
                        </svg>
                      </div>
                      <div class="px-4 text-gray-700">
                        <h3 class="text-sm tracking-wider">Venta lista</h3>
                        <p class="text-3xl">{{ datosReport.TotalVentaLista | filtrarDecimal}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </vx-card>
            </div>

            <!--pedidos con contratos-->
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <vx-card  title="Pedidos con contratos (incluido alcances)" class="columna">
                <div class="vx-row mt-3">
                  <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                    <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                      <div class="p-4 bg-success">
                        <svg width="42px" height="38px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 14C2 10.2288 2 8.34315 3.17157 7.17157C4.34315 6 6.22876 6 10 6H14C17.7712 6 19.6569 6 20.8284 7.17157C22 8.34315 22 10.2288 22 14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14Z" stroke="#fff" stroke-width="2"/>
                          <path d="M16 6C16 4.11438 16 3.17157 15.4142 2.58579C14.8284 2 13.8856 2 12 2C10.1144 2 9.17157 2 8.58579 2.58579C8 3.17157 8 4.11438 8 6" stroke="#fff" stroke-width="2"/>
                          <path d="M12 17.3333C13.1046 17.3333 14 16.5871 14 15.6667C14 14.7462 13.1046 14 12 14C10.8954 14 10 13.2538 10 12.3333C10 11.4129 10.8954 10.6667 12 10.6667M12 17.3333C10.8954 17.3333 10 16.5871 10 15.6667M12 17.3333V18M12 10V10.6667M12 10.6667C13.1046 10.6667 14 11.4129 14 12.3333" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </div>
                      <div class="px-4 text-gray-700">
                          <h3 class="text-sm tracking-wider">Venta total pedidos con contratos </h3>
                          <p class="text-3xl">{{ totalCombinado.TotalVentaPedidos | filtrarDecimal }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                    <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                      <div class="p-4 bg-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2">
                          </path>
                        </svg>
                      </div>
                      <div class="px-4 text-gray-700">
                          <h3 class="text-sm tracking-wider">Venta directa</h3>
                          <p class="text-3xl">{{ totalCombinado.TotalVentaPedidosVentaDirecta | filtrarDecimal }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="vx-col w-full sm:w-full  md:w-full  lg:w-full  xl:w-full  mb-6 mt-3">
                    <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                      <div class="p-4 bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                          </path>
                        </svg>
                      </div>
                      <div class="px-4 text-gray-700">
                        <h3 class="text-sm tracking-wider">Venta lista</h3>
                        <p class="text-3xl">{{ totalCombinado.TotalVentaPedidosVentaLista | filtrarDecimal}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </vx-card>
            </div>
          </div>
          <!--cobranza-->
          <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6">
            <ReporteCobranza :periodo_id="Number(periodoSelect)"/>
          </div>
        </div>
      </vs-tab>
      <vs-tab label="Reporte Vendedores" @click="menu = 1;">
        <div v-if="menu == 1">
          <ReporteVentaVendedor2Vue :periodoSelect="Number(periodoSelect)" :desdePrincipal="Number(1)"/>
        </div>
      </vs-tab>
      <vs-tab label="Reporte Contratos liquidados y no liquidados" @click="menu = 2;">
        <div v-if="menu == 2">
          <ReporteContratosLiquidadosNoLiquidadosVue :periodoSelect="Number(periodoSelect)"/>
        </div>
      </vs-tab>
    </vs-tabs>

  </div>
</template>
<script>
  import vSelect from 'vue-select'
  const ReporteCobranza           = () => import('./ReporteCobranza.vue')
  const ReporteVentaVendedor2Vue  = () => import('./ReporteVentaVendedor2.vue')
  const ReporteContratosLiquidadosNoLiquidadosVue = () => import('./ReporteContratosLiquidadosNoLiquidados.vue')
export default {
  components:{
    vSelect,
    ReporteCobranza,
    ReporteVentaVendedor2Vue,
    ReporteContratosLiquidadosNoLiquidadosVue
  },
  data() {
    return{
      datosReport:{},
      totalCombinado:{},
      periodoSelect:'',
      arregloPeriodos:[],
      menu:0,
    }
  },
  props:{
    periodo_id:{
      type:Number,
      default:0
    },
    sendPeriodo:{
      type:Number,
      default:1
    }
  },
  mounted(){
    let me = this
    //si no envia el periodo
    if(me.sendPeriodo == 0){
      me.getPeriodos()
    }else{
      me.periodoSelect = me.periodo_id
      // me.getDatosReporte()
    }
  },
  methods:{
    getPeriodos() {
      let me = this
      this.$http.get(this.$server_url + 'get_periodos_pedidos')
        .then(res => {
          let datos = res.data
          me.arregloPeriodos = datos
        })
        .catch(function (error) {
            me.$vs.loading.close();
        })
    },
    getDatosReporte() {
      let me = this;
      me.datosReport = ''
      if(me.periodoSelect == '' || me.periodoSelect == null || me.periodoSelect == undefined || me.periodoSelect == 0){
        me.$vs.notify({
          text:'Debe seleccionar un período',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
        return
      }
      me.$vs.loading({
        color: 'primary',
        type: 'circle',
        text: 'Cargando...'
      });
      this.$http.get(this.$server_url+`pedigo_Pagos?getVentaTotalListaDirecta=1&idPeriodo=${me.periodoSelect}`)
        .then(function (res) {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({
            text:'No se encontro datos',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
          }
          me.datosReport = res.data.ventas
          me.totalCombinado = res.data.totalCombinado
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
  }
}
</script>
<style scoped>
.custom-border-button {
  background-color: transparent;
  color: #5d6e70;
  border: none;
  border-bottom: 3px solid #5d6e70;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.3s, border-bottom-color 0.3s;
}

.custom-border-button:hover {
  color: #3b4b4d;
  border-bottom-color: #3b4b4d;
}

.custom-border-button:focus {
  outline: none;
}
</style>

