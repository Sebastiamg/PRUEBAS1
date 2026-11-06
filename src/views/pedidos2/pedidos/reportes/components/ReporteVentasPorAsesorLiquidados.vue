<template>
  <div>
    <!-- Botón Mostrar/Ocultar tabla -->
    <vs-button
      type="flat"
      class="p-2"
      icon-pack="fa"
      :icon="showTable ? 'fa-eye-slash' : 'fa-eye'"
      @click="showTable = !showTable"
      color="primary"
      title="Mostrar/Ocultar tabla"
    ></vs-button>

    <div v-if="showTable">
      <!-- Filtros -->
      <div>
        <b>Filtro:</b>
        <ul class="flex mt-2">
          <li class="modelx">
            <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="0">
              Con contratos
            </vs-radio>
          </li>
          <li style="list-style: none;">
            <vs-checkbox v-model="checkList" style="margin-left: 10px;" @input="renderType()">
              Mostrar todos los asesores
            </vs-checkbox>
          </li>
        </ul>

        <!-- Región -->
        <vs-divider
          v-if="desdePrincipal == 0 && !disabledFechas"
        >Region</vs-divider>
        <div
          class="flex justify-center"
          v-if="desdePrincipal == 0 && !disabledFechas"
        >
          <ul class="flex">
            <li>
              <vs-radio v-model="region" @input="getPeriodos();TmparregloVenta=[];" vs-name="radios1region" vs-value="2" class="mr-3">Costa</vs-radio>
            </li>
            <li>
              <vs-radio v-model="region" @input="getPeriodos();TmparregloVenta=[];" vs-name="radios1region" vs-value="1">Sierra</vs-radio>
            </li>
          </ul>
        </div>

        <!-- Periodos -->
        <div class="vx-row mt-3">
          <div class="vx-col md:w-1/2 mb-6">
            <p><ion-icon name="contract-outline"></ion-icon>Período anterior</p>
            <v-select
              :options="arregloPeriodos"
              @input="TmparregloVenta=[]"
              :reduce="p => p"
              label="periodoescolar"
              class="w-full"
              v-model="periodoSelectAnterior"
            />
          </div>
          <div class="vx-col md:w-1/2 mb-6">
            <p><ion-icon name="contract-outline"></ion-icon>Período después</p>
            <v-select
              :options="arregloPeriodos"
              @input="TmparregloVenta=[]"
              :reduce="p => p"
              label="periodoescolar"
              class="w-full"
              v-model="periodoSelectDespues"
            />
          </div>
        </div>

        <div class="flex justify-center">
          <vs-button color="primary" @click="getValoresVenta()" type="border" icon="save">
            Generar reporte
          </vs-button>
        </div>
      </div>

      <!-- Tabla -->
      <div v-if="TmparregloVenta.length > 0 && periodoSelectAnterior && periodoSelectDespues" class="mt-5">
        <div class="mt-2 flex">
          <vs-button color="success" @click="ExportToExcel('xlsx')" type="border">
            <i class="fa-solid fa-file-excel"></i> Exportar
          </vs-button>
          <vs-button color="warning" class="ml-3" @click="abrirModalSeleccion('normales')" type="border">
            Detalle Códigos no Regalados
          </vs-button>
          <vs-button color="warning" class="ml-3" @click="abrirModalSeleccion('regalados')" type="border">
            Detalle Regalados
          </vs-button>
        </div>

        <p class="mt-2">Cantidad: {{ TmparregloVenta.length }}</p>

        <div class="table-container">
          <table id="miTabla" class="mt-4 sticky-table" border="1" cellspacing="0" cellpadding="0" width="100%">
            <thead>
              <tr>
                <th rowspan="2" class="rotar">VENDEDOR</th>
                <th colspan="2" class="rotar">
                  PEDIDOS {{ periodoSelectAnterior.periodoescolar }}
                </th>
                <th colspan="2" class="rotar th-liquidados">
                  LIQUIDADOS {{ periodoSelectAnterior.periodoescolar }}
                </th>
                <th colspan="2" class="rotar th-sin-codigos">
                  LIQUIDADOS SIN CÓDIGOS {{ periodoSelectAnterior.periodoescolar }}
                </th>
                 <th colspan="2" class="rotar">
                  PEDIDOS {{ periodoSelectDespues.periodoescolar }}
                </th>
                <th colspan="2" class="rotar th-liquidados">
                  LIQUIDADOS {{ periodoSelectDespues.periodoescolar }}
                </th>
                <th colspan="2" class="rotar th-sin-codigos">
                  LIQUIDADOS SIN CÓDIGOS {{ periodoSelectDespues.periodoescolar }}
                </th>
              </tr>
              <tr>
                <th>VENTA BRUTA</th>
                <th>VENTA NETA</th>
                <th>VENTA BRUTA</th>
                <th>VENTA NETA</th>
                <th>VENTA BRUTA</th>
                <th>VENTA NETA</th>
                <th>VENTA BRUTA</th>
                <th>VENTA NETA</th>
                <th>VENTA BRUTA</th>
                <th>VENTA NETA</th>
                <th>VENTA BRUTA</th>
                <th>VENTA NETA</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(tr, key) in TmparregloVenta" :key="key">
                <td>
                  {{ tr.id_asesor }}
                  <vs-button color="success" @click="removeItemFromArr(TmparregloVenta,tr)" type="flat" icon-pack="feather" icon="icon-x"></vs-button>
                  <p>{{ tr.asesor.toUpperCase() }}</p>
                  <p>{{ tr.iniciales }}</p>
                </td>
                <td>
                  <!--venta bruta pedido anterior-->
                  <p>${{ filtrarDecimal(tr.ventaBrutaPedidoAnterior) }}</p>
                </td>
                <td>
                  <!--venta neta pedido anterior-->
                  <p>${{ filtrarDecimal(tr.ventaNetaPedidoAnterior) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaBLiqAnterior) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaNLiqAnterior) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaBSinCodAnterior) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaNSinCodAnterior) }}</p>
                </td>
                <td>
                  <!--venta bruta pedido despues-->
                  <p>${{ filtrarDecimal(tr.ventaBrutaPedidoDespues) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaNetaPedidoDespues) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaBLiqDespues) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaNLiqDespues) }}</p>
                </td>
                <td>
                  <p>${{ filtrarDecimal(tr.ventaBSinCodDespues) }}</p>
                </td>
                <td>${{ filtrarDecimal(tr.ventaNSinCodDespues) }}</td>
              </tr>
              <tr>
                <td><b>TOTAL</b></td>
                <td><b>${{ sumarCampo('ventaBrutaPedidoAnterior') }}</b></td>
                <td><b>${{ sumarCampo('ventaNetaPedidoAnterior') }}</b></td>
                <td><b>${{ sumarCampo('ventaBLiqAnterior') }}</b></td>
                <td><b>${{ sumarCampo('ventaNLiqAnterior') }}</b></td>
                <td><b>${{ sumarCampo('ventaBSinCodAnterior') }}</b></td>
                <td><b>${{ sumarCampo('ventaNSinCodAnterior') }}</b></td>
                <td><b>${{ sumarCampo('ventaBrutaPedidoDespues') }}</b></td>
                <td><b>${{ sumarCampo('ventaNetaPedidoDespues') }}</b></td>
                <td><b>${{ sumarCampo('ventaBLiqDespues') }}</b></td>
                <td><b>${{ sumarCampo('ventaNLiqDespues') }}</b></td>
                <td><b>${{ sumarCampo('ventaBSinCodDespues') }}</b></td>
                <td><b>${{ sumarCampo('ventaNSinCodDespues') }}</b></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

    <!-- Modal de selección -->
    <vs-popup classContent="popup-example" title="Elija el período" :active.sync="popupElegirPeriodo">
      <div class="p-3">
        <p>Seleccione el período que desea visualizar:</p>
        <div class="flex mt-3 justify-center">
          <vs-button color="primary" class="mr-2" @click="abrirReporte('anterior')">Período anterior</vs-button>
          <vs-button color="success" @click="abrirReporte('despues')">Período después</vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- Modales detalle -->
    <vs-popup fullscreen title="Detalle códigos no regalados" :active.sync="popupMostrarCodigosNormales" class="informacionformPadre">
      <ReporteVentaVendedorDetallalleNormalesVue v-if="popupMostrarCodigosNormales" :periodoSelectAnterior="periodoSeleccionado"/>
    </vs-popup>

    <vs-popup fullscreen title="Detalle regalados" :active.sync="popupMostrarDetalleRegalados" class="informacionformPadre">
      <ReporteVentaVendedorDetallalleRegaladosVue v-if="popupMostrarDetalleRegalados" :periodoSelectAnterior="periodoSeleccionado"/>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import moment from "moment";
import * as XLSX from 'xlsx';
const ReporteVentaVendedorDetallalleRegaladosVue = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaVendedorDetallalleRegalados.vue')
const ReporteVentaVendedorDetallalleNormalesVue = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaVendedorDetallalleNormales.vue')

export default {
  components: { vSelect, ReporteVentaVendedorDetallalleRegaladosVue, ReporteVentaVendedorDetallalleNormalesVue },
  props:{ periodoSelect:{type:Number,default:0}, desdePrincipal:{type:Number,default:0} },
  data(){
    return{
      TmparregloVenta:[],
      arregloVenta:[],
      arregloPeriodos:[],
      periodoSelectAnterior:'',
      periodoSelectDespues:'',
      checkList:false,
      year:'',
      tipo:0,
      region:2,
      disabledFechas:false,
      popupMostrarDetalleRegalados:false,
      popupMostrarCodigosNormales:false,
      showTable:true,
      popupElegirPeriodo:false,
      tipoDetalle:'',
      periodoSeleccionado:null,
    }
  },
  mounted(){
    this.year = moment().format('YYYY')
    this.getPeriodos()
  },
  methods:{
    normalizarContratos(contratos) {
      if (Array.isArray(contratos)) return contratos;
      if (contratos && Array.isArray(contratos.contratos)) return contratos.contratos;
      return [];
    },
    sumarPorEstadoBruta(contratos, estado) {
      return this.normalizarContratos(contratos).reduce((acc, item) => {
        if (item.estado_liquidacion !== estado) return acc;
        return acc + (parseFloat(item.VEN_VALOR) || 0);
      }, 0);
    },
    sumarPorEstadoNeta(contratos, estado) {
      return this.normalizarContratos(contratos).reduce((acc, item) => {
        if (item.estado_liquidacion !== estado) return acc;
        return acc + (parseFloat(item.ven_neta) || 0);
      }, 0);
    },
    mapearLiquidados(contratos) {
      return {
        liquidadoBruta: this.sumarPorEstadoBruta(contratos, 'LIQUIDADO'),
        liquidadoNeta: this.sumarPorEstadoNeta(contratos, 'LIQUIDADO'),
        sinCodigosBruta: this.sumarPorEstadoBruta(contratos, 'LIQUIDADO SIN CÓDIGOS'),
        sinCodigosNeta: this.sumarPorEstadoNeta(contratos, 'LIQUIDADO SIN CÓDIGOS'),
      };
    },
    filtrarDecimal(n){ return Number(n||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') },
    sumarCampo(campo){
      const total = this.TmparregloVenta.reduce((acc, el) => acc + (el[campo]||0), 0)
      return this.filtrarDecimal(total)
    },
    abrirModalSeleccion(tipo){ this.tipoDetalle = tipo; this.popupElegirPeriodo = true },
    abrirReporte(periodo){
      this.popupElegirPeriodo = false
      this.periodoSeleccionado = (periodo==='anterior') ? this.periodoSelectAnterior : this.periodoSelectDespues
      if(this.tipoDetalle==='normales') this.popupMostrarCodigosNormales=true
      if(this.tipoDetalle==='regalados') this.popupMostrarDetalleRegalados=true
    },
    removeItemFromArr(arr,item){ arr.splice(arr.indexOf(item),1) },
    getPeriodos(){
      this.$http.get(this.$server_url+'get_periodos_pedidos').then(res=>{
        const datos = res.data
        if(this.desdePrincipal==1){
          this.arregloPeriodos = datos
          this.disabledFechas = true
          this.periodoSelectAnterior = datos.find(p=>p.idperiodoescolar==this.periodoSelect)
          this.periodoSelectDespues  = datos.find(p=>p.idperiodoescolar==this.periodoSelect)
          this.getValoresVenta()
        }else{
          this.arregloPeriodos = datos.filter(p=>p.region_idregion==this.region)
        }
      })
    },
    getValoresVenta(){
      this.TmparregloVenta = []
      this.arregloVenta = []
      if(!this.periodoSelectAnterior){ return this.f_notificaciones('Seleccione un período anterior','warning','icon-alert-triangle') }
      if(!this.periodoSelectDespues){ return this.f_notificaciones('Seleccione un período después','warning','icon-alert-triangle') }
      this.$vs.loading()
      const url = `pruebatest?periodo_idUno=${this.periodoSelectAnterior.idperiodoescolar}&periodo_idDos=${this.periodoSelectDespues.idperiodoescolar}&codigoC=${this.periodoSelectAnterior.codigo_contrato}&codigoC2=${this.periodoSelectDespues.codigo_contrato}&ifRegalados=0`
      this.$http.get(this.$server_url+url).then(res=>{
        this.$vs.loading.close()
        if(res.data.status==0){ return this.f_notificaciones(res.data.message,'warning','icon-alert-triangle') }
        this.arregloVenta = res.data.map(e=>{
          const liqAnterior = this.mapearLiquidados(e.ContratosAnterior);
          const liqDespues = this.mapearLiquidados(e.ContratosDespues && e.ContratosDespues.contratos);

          return {
          id_asesor:e.id_asesor,
          asesor:e.asesor,
          iniciales:e.iniciales,
          cedula:e.cedula,
          ContratosAnterior: e.ContratosAnterior || [],
          ContratosDespues: e.ContratosDespues || { contratos: [] },

          ventaBLiqAnterior: liqAnterior.liquidadoBruta,
          ventaNLiqAnterior: liqAnterior.liquidadoNeta,
          ventaBSinCodAnterior: liqAnterior.sinCodigosBruta,
          ventaNSinCodAnterior: liqAnterior.sinCodigosNeta,

          ventaBLiqDespues: liqDespues.liquidadoBruta,
          ventaNLiqDespues: liqDespues.liquidadoNeta,
          ventaBSinCodDespues: liqDespues.sinCodigosBruta,
          ventaNSinCodDespues: liqDespues.sinCodigosNeta,

          ventaBrutaPedidoAnterior:e.datosVentaAnterior[0] ? e.datosVentaAnterior[0].ventaBrutaPedido : 0,
          ventaNetaPedidoAnterior:e.datosVentaAnterior[0] ? e.datosVentaAnterior[0].ven_netaPedido : 0,
          ventaBrutaPedidoDespues:e.datosVentaDespues[0] ? e.datosVentaDespues[0].ventaBrutaPedido : 0,
          ventaNetaPedidoDespues:e.datosVentaDespues[0] ? e.datosVentaDespues[0].ven_netaPedido : 0,
        }})
        this.renderType()
      }).catch(()=>this.$vs.loading.close())
    },
   renderType() {
    if (this.arregloVenta.length == 0) return;

    // Si está marcado "mostrar todos" entonces no filtro nada
    if (this.checkList) {
      this.TmparregloVenta = this.arregloVenta;
    } else {
      // Excluir los asesores que tengan todo en cero
      this.TmparregloVenta = this.arregloVenta.filter(e => {
        const total =
          (e.ventaBrutaPedidoAnterior || 0) +
          (e.ventaNetaPedidoAnterior || 0) +
          (e.ventaBLiqAnterior || 0) +
          (e.ventaNLiqAnterior || 0) +
          (e.ventaBSinCodAnterior || 0) +
          (e.ventaNSinCodAnterior || 0) +
          (e.ventaBrutaPedidoDespues || 0) +
          (e.ventaNetaPedidoDespues || 0) +
          (e.ventaBLiqDespues || 0) +
          (e.ventaNLiqDespues || 0) +
          (e.ventaBSinCodDespues || 0) +
          (e.ventaNSinCodDespues || 0);

        return total > 0;
      });
    }

    // Ordenar alfabéticamente
    this.TmparregloVenta.sort((a, b) =>
      (a.asesor || "").localeCompare(b.asesor || "")
    );

  },

    f_notificaciones(msj,color,icono){
      this.$vs.notify({ text:msj, color, iconPack:'feather', icon:icono })
    },
    ExportToExcel(type){
      const wb = XLSX.utils.table_to_book(document.getElementById('miTabla'), { sheet:"sheet1" })
      XLSX.writeFile(wb, `ReporteVendedores.${type||'xlsx'}`)
    }
  }
}
</script>
<style scoped>

.encabezado ,td,th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
}

/* Estilos para header fijo */
.table-container {
    max-height: 90vh; /* casi toda la altura */
    overflow-y: auto;
    overflow-x: auto;
    border: 1px solid #ddd;
    position: relative;
}

.sticky-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
}

/* Header fijo - Primera fila */
.sticky-table thead tr:first-child th {
    position: sticky;
    top: 0;
    background: #e9ecef !important;
    z-index: 20;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 0 0 1px #adb5bd,
                inset 0 -1px 0 0 #6c757d;
    border: 1px solid #adb5bd !important;
    border-bottom: 1px solid #6c757d !important;
    height: 50px;
}

/* Header fijo - Segunda fila */
.sticky-table thead tr:nth-child(2) th {
    position: sticky;
    top: 50px;
    background: #f8f9fa !important;
    z-index: 19;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 0 0 1px #adb5bd,
                inset 0 -1px 0 0 #6c757d;
    border: 1px solid #adb5bd !important;
    border-bottom: 1px solid #6c757d !important;
    height: 40px;
}

/* Estilos adicionales para mejor visualización */
.sticky-table th {
    font-weight: bold;
    padding: 6px 3px;
   font-size: 14px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    line-height: 1.2;
}

.sticky-table td {
    padding: 4px 2px;
   font-size: 13px;
    text-align: center;
    border: 1px solid #dee2e6;
    vertical-align: middle;
}

/* Primera columna fija también */
.sticky-table td:first-child,
.sticky-table th:first-child {
    position: sticky;
    left: 0;
    background: #ffffff !important;
    z-index: 25;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.3);
    font-weight: bold;
    min-width: 120px;
}

/* Intersección de primera columna con headers */
.sticky-table thead tr:first-child th:first-child {
    z-index: 30;
    background: #e9ecef !important;
    border-right: 1px solid #6c757d !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 0 0 1px #adb5bd,
                inset 0 -1px 0 0 #6c757d,
                inset -1px 0 0 0 #6c757d;
}

.sticky-table thead tr:nth-child(2) th:first-child {
    z-index: 29;
    background: #f8f9fa !important;
    border-right: 1px solid #6c757d !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 0 0 1px #adb5bd,
                inset 0 -1px 0 0 #6c757d,
                inset -1px 0 0 0 #6c757d;
}
.informacionformPadre {
    z-index: 51001;
}

.th-liquidados {
    background: #dcfce7 !important;
    color: #166534;
}

.th-sin-codigos {
    background: #fef3c7 !important;
    color: #92400e;
}

.sticky-table thead tr:first-child th.th-liquidados,
.sticky-table thead tr:first-child th.th-sin-codigos {
    background: inherit !important;
}

.sticky-table thead tr:first-child th.th-liquidados {
    background: #dcfce7 !important;
}

.sticky-table thead tr:first-child th.th-sin-codigos {
    background: #fef3c7 !important;
}
</style>
