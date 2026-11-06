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
        <div>
          <b>Filtro:</b>
          <ul class="flex mt-2">
              <li class="modelx">
                  <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="0">Con contratos</vs-radio>
              </li>
              <!-- <li class="ml-2">
              <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="1">Sin contrato</vs-radio>
              </li>
              <li class="ml-2">
              <vs-radio v-model="tipo" @input="renderType()" vs-name="radios1tipo" vs-value="2">Todos</vs-radio>
              </li> -->
              <li style="list-style: none;">
                  <vs-checkbox v-model="checkList" style="margin-left: 10px;" @input="renderType()">Mostrar todo los asesores</vs-checkbox>
              </li>
          </ul>
          <vs-divider
            v-if="desdePrincipal == 0"
            :style="{ display: disabledFechas ? 'none' : 'block' }"
          >
            Region
          </vs-divider>
          <div class="flex justify-center" v-if="desdePrincipal == 0"  :style="{ display: disabledFechas ? 'none' : 'block' }">
            <ul class="flex">
              <li>
                <vs-radio v-model="region" @input="getPeriodos();TmparregloVenta=[];" vs-name="radios1region" vs-value="2" class="mr-3">Costa</vs-radio>
              </li>
              <li>
                <vs-radio v-model="region" @input="getPeriodos();TmparregloVenta=[];" vs-name="radios1region" vs-value="1">Sierra</vs-radio>
              </li>
            </ul>
          </div>
          <br>
          <div class="vx-row">
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <p> <ion-icon name="contract-outline"></ion-icon>Período anterior</p>
              <v-select :options="arregloPeriodos" @input="TmparregloVenta=[];" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelectAnterior" />
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <p> <ion-icon name="contract-outline"></ion-icon>Período despues</p>
              <v-select :options="arregloPeriodos" @input="TmparregloVenta=[];" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelectDespues" />
            </div>
          </div>
          <div class="flex justify-center">
            <vs-button color="primary" @click="getValoresVenta()" type="border" icon="save">Generar reporte</vs-button>
            <br>
          </div>
        </div>
        <div v-if="TmparregloVenta.length > 0 && periodoSelectAnterior && periodoSelectDespues" class="mt-5">
            <div class="mt-2 flex">
                <vs-button color="success" @click="ExportToExcel('xlsx')" type="border"><i class="fa-solid fa-file-excel"></i>  Exportar</vs-button>
                <vs-button color="warning" v-if="userRoot" class="ml-3" @click="abrirModalSeleccion('normales')" type="border">  Detalle Codigos no Regalados</vs-button>
                <vs-button color="warning" v-if="userRoot" class="ml-3" @click="abrirModalSeleccion('regalados')" type="border">  Detalle Regalados</vs-button>
            </div>
            <p class="mt-2">Cantidad :{{ TmparregloVenta.length }}</p>
            <div class="table-container">
                <table width="100%" border="1"  cellspacing="0" cellpadding="0" id="miTabla" class="mt-4 sticky-table">
                <thead>
                <tr>
                  <th colspan="1" rowspan="2" style="width: 150px;" class="rotar"><b>VENDEDOR</b></th>
                  <th colspan="1" v-if="desdePrincipal == 0" rowspan="2" style="width: 150px;" class="rotar"><b>PERIODO ANTERIOR</b></th>
                  <th colspan="2" v-if="desdePrincipal == 0" class="rotar"><b>VENTAS REALES  {{ periodoSelectAnterior.periodoescolar }} </b></th>
                  <th colspan="5" v-if="desdePrincipal == 0" class="rotar"><b>REGALADOS ANTERIOR {{ periodoSelectAnterior.periodoescolar }} </b></th>
                  <th colspan="1" v-if="desdePrincipal == 0" class="rotar"><b>CUPONES ANTERIOR {{ periodoSelectAnterior.periodoescolar }} </b></th>
                  <th colspan="1" v-if="desdePrincipal == 0" rowspan="2" style="width: 150px;" class="rotar"><b>PERIODO DESPUES</b></th>
                  <th colspan="2" class="rotar"><b>VENTA SEGUN PROMOCION   {{ periodoSelectDespues.periodoescolar }} </b></th>
                  <th colspan="5" class="rotar"><b>REGALADOS DESPUES {{ periodoSelectDespues.periodoescolar }} </b></th>
                  <th colspan="1" class="rotar"><b>CUPONES DESPUES {{ periodoSelectDespues.periodoescolar }} </b></th>
                  <th rowspan="2" v-if="desdePrincipal == 0">VARIACION VENTAS BRUTAS POR TEMPORADA</th>
                  <th rowspan="2" v-if="desdePrincipal == 0">% DE VARIACION EN  RELACION AL PRESUPUESTO</th>
                </tr>
                <tr>
                  <th v-if="desdePrincipal == 0">VENTA BRUTA</th>
                  <th v-if="desdePrincipal == 0">VENTA NETA</th>
                  <th v-if="desdePrincipal == 0">CANT. CON DOC.</th>
                  <th v-if="desdePrincipal == 0">VALOR CON DOC.</th>
                  <th v-if="desdePrincipal == 0">CANT. SIN DOC.</th>
                  <th v-if="desdePrincipal == 0">VALOR SIN DOC.</th>
                  <th v-if="desdePrincipal == 0">CANT. EXCLUIDOS</th>
                  <th v-if="desdePrincipal == 0">TOTAL CUPONES</th>
                  <th>VENTA BRUTA</th>
                  <th>VENTA NETA</th>
                  <th>CANT. CON DOC.</th>
                  <th>VALOR CON DOC.</th>
                  <th>CANT. SIN DOC.</th>
                  <th>VALOR SIN DOC.</th>
                  <th>CANT. EXCLUIDOS</th>
                  <th>TOTAL CUPONES</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(tr,key) in TmparregloVenta" :key="key">
                    <td>
                      {{ tr.id_asesor }}
                        <vs-button color="success" @click="removeItemFromArr(TmparregloVenta,tr)"  type="flat" icon-pack="feather" icon="icon-x"></vs-button>
                        <p>{{ tr.asesor.toUpperCase() }}</p>
                        <p>{{ tr.iniciales}}</p>
                    </td>
                    <td v-if="desdePrincipal == 0">
                      {{ periodoSelectAnterior.periodoescolar }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        ${{ filtrarDecimal(tr.VentaBAnterior) }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        ${{ filtrarDecimal(tr.ventaNAnterior) }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        {{ tr.regaladosAnterior && tr.regaladosAnterior.cantidad_con_documentos ? tr.regaladosAnterior.cantidad_con_documentos : 0 }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        ${{ tr.regaladosAnterior && tr.regaladosAnterior.valor_total_con_descuento ? filtrarDecimal(parseFloat(tr.regaladosAnterior.valor_total_con_descuento)) : '0.00' }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        {{ tr.regaladosAnterior && tr.regaladosAnterior.cantidad_sin_documentos ? tr.regaladosAnterior.cantidad_sin_documentos : 0 }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        ${{ tr.regaladosAnterior && tr.regaladosAnterior.valor_sin_documentos ? filtrarDecimal(parseFloat(tr.regaladosAnterior.valor_sin_documentos)) : '0.00' }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        {{ tr.regaladosAnterior && tr.regaladosAnterior.cantidad_excluidos ? tr.regaladosAnterior.cantidad_excluidos : 0 }}
                    </td>
                    <td v-if="desdePrincipal == 0">
                        ${{ tr.cuponesAnterior && tr.cuponesAnterior.total_descuento ? filtrarDecimal(parseFloat(tr.cuponesAnterior.total_descuento)) : '0.00' }}
                    </td>
                    <vs-td v-if="desdePrincipal == 0">
                      {{ periodoSelectDespues.periodoescolar }}
                    </vs-td>
                    <td>
                        <p v-if="tr.ventaBrutaActual == 0">$0</p>
                        <p v-else>${{ filtrarDecimal(tr.ventaBrutaActual) }}</p>
                    </td>
                    <td>
                        <p v-if="tr.ven_neta_actual == 0">$0</p>
                        <p v-else>${{ filtrarDecimal(tr.ven_neta_actual) }}</p>
                    </td>
                    <td>
                        {{ tr.regaladosDespues && tr.regaladosDespues.cantidad_con_documentos ? tr.regaladosDespues.cantidad_con_documentos : 0 }}
                    </td>
                    <td>
                        ${{ tr.regaladosDespues && tr.regaladosDespues.valor_total_con_descuento ? filtrarDecimal(parseFloat(tr.regaladosDespues.valor_total_con_descuento)) : '0.00' }}
                    </td>
                    <td>
                        {{ tr.regaladosDespues && tr.regaladosDespues.cantidad_sin_documentos ? tr.regaladosDespues.cantidad_sin_documentos : 0 }}
                    </td>
                    <td>
                        ${{ tr.regaladosDespues && tr.regaladosDespues.valor_sin_documentos ? filtrarDecimal(parseFloat(tr.regaladosDespues.valor_sin_documentos)) : '0.00' }}
                    </td>
                    <td>
                        {{ tr.regaladosDespues && tr.regaladosDespues.cantidad_excluidos ? tr.regaladosDespues.cantidad_excluidos : 0 }}
                    </td>
                    <td>
                        ${{ tr.cuponesDespues && tr.cuponesDespues.total_descuento ? filtrarDecimal(parseFloat(tr.cuponesDespues.total_descuento)) : '0.00' }}
                    </td>
                    <td v-if="desdePrincipal == 0">${{ filtrarDecimal(tr.VariacionVentaBruta) }}</td>
                    <td v-if="desdePrincipal == 0">{{ tr.PorcentajeVariacionPresupuesto }} <b style="display: none;">.</b>%</td>
                </tr>
                <tr>
                    <td><b>TOTAL</b></td>
                    <td v-if="desdePrincipal == 0"></td>
                    <td v-if="desdePrincipal == 0"><b>${{ sumaVentaBrutaAnterior }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>${{ sumaNetaAnterior }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>{{ sumaCantidadConDocumentos }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>${{ sumaValorConDocumentos }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>{{ sumaCantidadSinDocumentos }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>${{ sumaValorSinDocumentos }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>{{ sumaCantidadExcluidosAnterior }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>${{ sumaCuponesAnterior }}</b></td>
                    <td v-if="desdePrincipal == 0"></td>
                    <td><b>${{ sumaVentaBrutaActual }}</b></td>
                    <td><b>${{ sumaVentaNetaActual }}</b></td>
                    <td><b>{{ sumaCantidadConDocumentosDespues }}</b></td>
                    <td><b>${{ sumaValorConDocumentosDespues }}</b></td>
                    <td><b>{{ sumaCantidadSinDocumentosDespues }}</b></td>
                    <td><b>${{ sumaValorSinDocumentosDespues }}</b></td>
                    <td><b>{{ sumaCantidadExcluidosDespues }}</b></td>
                    <td><b>${{ sumaCuponesDespues }}</b></td>
                    <td v-if="desdePrincipal == 0"><b>${{ sumaVariacionVentaBruta }}</b></td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        <br><br><br><br>
      </div>
      <!-- Modal de selección de período -->
      <vs-popup classContent="popup-example" title="Elija el período" :active.sync="popupElegirPeriodo">
        <div class="p-3">
          <p>Seleccione el período que desea visualizar:</p>
          <div class="flex mt-3 justify-center">
            <vs-button color="primary" class="mr-2" @click="abrirReporte('anterior')">Período anterior</vs-button>
            <vs-button color="success" @click="abrirReporte('despues')">Período después</vs-button>
          </div>
        </div>
      </vs-popup>
      <!-- Modal codigos normales -->
      <vs-popup fullscreen title="Detalle codigos no regalados" :active.sync="popupMostrarCodigosNormales">
        <div v-if="popupMostrarCodigosNormales">
          <ReporteVentaVendedorDetallalleNormalesVue :periodoSelectAnterior="periodoSeleccionado"/>
        </div>
      </vs-popup>

      <!-- Modal regalados -->
      <vs-popup fullscreen title="Detalle regalados" :active.sync="popupMostrarDetalleRegalados">
        <div v-if="popupMostrarDetalleRegalados">
          <ReporteVentaVendedorDetallalleRegaladosVue :periodoSelectAnterior="periodoSeleccionado"/>
        </div>
      </vs-popup>
      <!--modales-->
      <!-- <vs-popup classContent="popup-example" class="informacionformPadre" fullscreen title="Detalle regalados" :active.sync="popupMostrarDetalleRegalados">
        <div v-if="popupMostrarDetalleRegalados">
          <ReporteVentaVendedorDetallalleRegaladosVue :periodoSelectAnterior="periodoSelectAnterior"/>
        </div>
      </vs-popup> -->
      <!--modal codigos normales-->
      <!-- <vs-popup classContent="popup-example" class="informacionformPadre" fullscreen title="Detalle codigos no regalados" :active.sync="popupMostrarCodigosNormales">
        <div v-if="popupMostrarCodigosNormales">
          <ReporteVentaVendedorDetallalleNormalesVue :periodoSelectAnterior="periodoSelectAnterior"/>
        </div>
      </vs-popup> -->
    </div>
</template>
<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select'
import moment from "moment";
import * as XLSX from 'xlsx';
const ReporteVentaVendedorDetallalleRegaladosVue = () => import('./ReporteVentaVendedorDetallalleRegalados.vue')
const ReporteVentaVendedorDetallalleNormalesVue = () => import('./ReporteVentaVendedorDetallalleNormales.vue')
export default{
  components:{
    vSelect,
    ReporteVentaVendedorDetallalleRegaladosVue,
    ReporteVentaVendedorDetallalleNormalesVue
  },
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
            tipoDetalle:'', // normales | regalados
            periodoSeleccionado:null,
        }
    },
    mounted(){
        let me = this;
        me.year = moment().format('YYYY')
        // me.getValoresVenta()
        me.getPeriodos()

    },
    computed:{
        ...mapState(['userRoot']),

        sumaVentaBrutaAnterior(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.VentaBAnterior)
                let total = datos.reduce((a, b) => a + (b["VentaBAnterior"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaNetaAnterior(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.ventaNAnterior)
                let total = datos.reduce((a, b) => a + (b["ventaNAnterior"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaVentaBrutaActual(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.ventaBrutaActual)
                let total = datos.reduce((a, b) => a + (b["ventaBrutaActual"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){

                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaVentaNetaActual(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.ven_neta_actual)
                let total = datos.reduce((a, b) => a + (b["ven_neta_actual"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaVariacionVentaBruta(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let datos = me.TmparregloVenta.filter(p => p.VariacionVentaBruta)
                let total = datos.reduce((a, b) => a + (b["VariacionVentaBruta"] || 0), 0);
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
        },
        sumaCantidadConDocumentos(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosAnterior && tr.regaladosAnterior.cantidad_con_documentos){
                        total += parseInt(tr.regaladosAnterior.cantidad_con_documentos);
                    }
                });
                return total;
            }
            return 0;
        },
        sumaValorConDocumentos(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosAnterior && tr.regaladosAnterior.valor_total_con_descuento){
                        total += parseFloat(tr.regaladosAnterior.valor_total_con_descuento);
                    }
                });
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
            return 0;
        },
        sumaCantidadSinDocumentos(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosAnterior && tr.regaladosAnterior.cantidad_sin_documentos){
                        total += parseInt(tr.regaladosAnterior.cantidad_sin_documentos);
                    }
                });
                return total;
            }
            return 0;
        },
        sumaValorSinDocumentos(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosAnterior && tr.regaladosAnterior.valor_sin_documentos){
                        total += parseFloat(tr.regaladosAnterior.valor_sin_documentos);
                    }
                });
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
            return 0;
        },
        sumaCantidadConDocumentosDespues(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosDespues && tr.regaladosDespues.cantidad_con_documentos){
                        total += parseInt(tr.regaladosDespues.cantidad_con_documentos);
                    }
                });
                return total;
            }
            return 0;
        },
        sumaValorConDocumentosDespues(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosDespues && tr.regaladosDespues.valor_total_con_descuento){
                        total += parseFloat(tr.regaladosDespues.valor_total_con_descuento);
                    }
                });
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
            return 0;
        },
        sumaCantidadSinDocumentosDespues(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosDespues && tr.regaladosDespues.cantidad_sin_documentos){
                        total += parseInt(tr.regaladosDespues.cantidad_sin_documentos);
                    }
                });
                return total;
            }
            return 0;
        },
        sumaValorSinDocumentosDespues(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosDespues && tr.regaladosDespues.valor_sin_documentos){
                        total += parseFloat(tr.regaladosDespues.valor_sin_documentos);
                    }
                });
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
            return 0;
        },
        sumaCuponesAnterior(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.cuponesAnterior && tr.cuponesAnterior.total_descuento){
                        total += parseFloat(tr.cuponesAnterior.total_descuento);
                    }
                });
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
            return 0;
        },
        sumaCuponesDespues(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.cuponesDespues && tr.cuponesDespues.total_descuento){
                        total += parseFloat(tr.cuponesDespues.total_descuento);
                    }
                });
                var transformar = 0
                if(total == 0 || total == "0"){
                }else{
                    transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                }
                return transformar
            }
            return 0;
        },
        sumaCantidadExcluidosAnterior(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosAnterior && tr.regaladosAnterior.cantidad_excluidos){
                        total += parseInt(tr.regaladosAnterior.cantidad_excluidos);
                    }
                });
                return total;
            }
            return 0;
        },
        sumaCantidadExcluidosDespues(){
            let me = this;
            if(me.TmparregloVenta.length > 0){
                let total = 0;
                me.TmparregloVenta.forEach(tr => {
                    if(tr.regaladosDespues && tr.regaladosDespues.cantidad_excluidos){
                        total += parseInt(tr.regaladosDespues.cantidad_excluidos);
                    }
                });
                return total;
            }
            return 0;
        },
    },
    props:{
      periodoSelect:{
        type:Number,
        default:0
      },
      desdePrincipal:{
        type:Number,
        default:0
      },
      desdeFacturador:{
        type:Number,
        default:0
      }
    },
    methods:{
      abrirModalSeleccion(tipo){
        this.tipoDetalle = tipo
        this.popupElegirPeriodo = true
      },
       abrirReporte(periodo){
        // cerrar modal de selección
        this.popupElegirPeriodo = false
        // setear período según selección
        this.periodoSeleccionado = (periodo === 'anterior')
          ? this.periodoSelectAnterior
          : this.periodoSelectDespues
        // abrir popup correspondiente
        if(this.tipoDetalle === 'normales'){
          this.popupMostrarCodigosNormales = true
        }else if(this.tipoDetalle === 'regalados'){
          this.popupMostrarDetalleRegalados = true
        }
      },
      removeItemFromArr (arr, item) {
          let me = this;
          const i = arr.indexOf(item)
          arr.splice(i, 1)
      },
        getPeriodos(){
            let me = this
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                let datos = res.data
                if(me.desdePrincipal == 1 || me.desdeFacturador == 1){
                  me.arregloPeriodos = datos
                  me.disabledFechas = true
                  me.periodoSelectAnterior = me.arregloPeriodos.filter(p => p.idperiodoescolar == me.periodoSelect)[0]
                  me.periodoSelectDespues  = me.arregloPeriodos.filter(p => p.idperiodoescolar == me.periodoSelect)[0]
                  me.getValoresVenta()
                }else{
                  me.arregloPeriodos = datos.filter(p => p.region_idregion == me.region)
                }

                // si desdeFacturador es 1 buscar la region_idregion del periodoSelect y setear la region y los periodos seleccionados
                 if(me.desdeFacturador == 1){
                    let periodoSeleccionado = me.arregloPeriodos.filter(p => p.idperiodoescolar == me.periodoSelect)[0]
                    if(periodoSeleccionado){
                        me.region = periodoSeleccionado.region_idregion
                    }
                 }

            })
            .catch(function (error) {
            })
        },
        filtrarDecimal(numero){
            let me = this
            const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            return transformar
        },
        getValoresVenta() {
            let me = this;
            me.arregloVenta = []
            me.TmparregloVenta = []
            let msj = ""
            if(me.periodoSelectAnterior == "" || me.periodoSelectAnterior == null || me.periodoSelectAnterior == undefined){
                msj = 'Seleccione un período anterior por favor'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return
            }
            if(me.periodoSelectDespues == "" || me.periodoSelectDespues == null || me.periodoSelectDespues == undefined){
                msj = 'Seleccione un período despues por favor'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return
            }
            me.$vs.loading()
            var url = 'pruebatest?periodo_idUno='+me.periodoSelectAnterior.idperiodoescolar+'&periodo_idDos='+me.periodoSelectDespues.idperiodoescolar+'&codigoC='+me.periodoSelectAnterior.codigo_contrato+'&codigoC2='+me.periodoSelectDespues.codigo_contrato
            this.$http.get(this.$server_url+url)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        let msj = res.data.message
                        me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                        return
                    }
                    var arregloPredatos = []
                    var datos = []
                    datos = res.data
                    datos.forEach(element => {
                        var cal = new Object();
                        cal.id_asesor          = element.id_asesor
                        cal.asesor             = element.asesor
                        cal.iniciales          = element.iniciales
                        cal.cedula             = element.cedula
                        cal.regaladosAnterior  = element.regaladosAnterior
                        cal.regaladosDespues   = element.regaladosDespues
                        cal.cuponesAnterior    = element.cuponesAnterior
                        cal.cuponesDespues     = element.cuponesDespues
                        let arrayContratos     = element.ContratosDespues.contratos
                        let arraySinContratos  = element.ContratosDespues.sin_contratos[0]
                        let arrayAnterior      = element.ContratosAnterior
                        //venta actual contratos
                        cal.ConCVentaBruta     = arrayContratos.reduce((a, b) => parseFloat(a) + parseFloat((b["VEN_VALOR"] || 0)), 0);
                        cal.ConCVentaNeta      = arrayContratos.reduce((a, b) => parseFloat(a) + parseFloat((b["ven_neta"] || 0)), 0);
                        //venta actual sin contratos
                        cal.SinCVentaBruta     = parseFloat(arraySinContratos.ventaBrutaActual)
                        cal.SinCVentaNeta      = parseFloat(arraySinContratos.ven_neta_actual)
                        //venta anterior
                        cal.VentaBAnterior     = arrayAnterior.reduce((a, b) => parseFloat(a) + parseFloat((b["VEN_VALOR"] || 0)), 0);
                        cal.ventaNAnterior     = arrayAnterior.reduce((a, b) => parseFloat(a) + parseFloat((b["ven_neta"] || 0)), 0);
                        arregloPredatos.push(cal)
                    });
                    me.arregloVenta = arregloPredatos
                    me.renderType()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        renderType(){
            let me = this;
            me.TmparregloVenta = []
            let preDatos = []
            preDatos     = me.arregloVenta
            var arregloPreFinal = []
            //segundos calculos
            preDatos.forEach(element => {
                var cal = new Object();
                cal.id_asesor               = element.id_asesor
                cal.asesor                  = element.asesor
                cal.iniciales               = element.iniciales
                cal.cedula                  = element.cedula
                cal.regaladosAnterior       = element.regaladosAnterior
                cal.regaladosDespues        = element.regaladosDespues
                cal.cuponesAnterior         = element.cuponesAnterior
                cal.cuponesDespues          = element.cuponesDespues
                //venta actual contratos
                cal.ConCVentaBruta          = element.ConCVentaBruta
                cal.ConCVentaNeta           = element.ConCVentaNeta
                //venta actual sin contratos
                cal.SinCVentaBruta          = element.SinCVentaBruta
                cal.SinCVentaNeta           = element.SinCVentaNeta
                //venta anterior
                cal.VentaBAnterior          = element.VentaBAnterior
                cal.ventaNAnterior          = element.ventaNAnterior
                //VENTA QUE SE MOSTRARA EN EL FRONT
                //con contratos
                var preVentaBActual         = 0
                if(me.tipo == 0){
                    cal.ventaBrutaActual    = element.ConCVentaBruta
                    cal.ven_neta_actual     = element.ConCVentaNeta
                    preVentaBActual         = element.ConCVentaBruta
                }
                //sin contratos
                if(me.tipo == 1){
                    cal.ventaBrutaActual    = element.SinCVentaBruta
                    cal.ven_neta_actual     = element.SinCVentaNeta
                    preVentaBActual         = element.SinCVentaBruta
                }
                //todos(bruta con contrato y sin contrato)
                if(me.tipo == 2){
                    cal.ventaBrutaActual    = parseFloat(element.ConCVentaBruta) + parseFloat(element.SinCVentaBruta )
                    cal.ven_neta_actual     = parseFloat(element.ConCVentaNeta)  + parseFloat(element.SinCVentaNeta )
                    preVentaBActual         = parseFloat(element.ConCVentaBruta) + parseFloat(element.SinCVentaBruta )
                }
                //VARIACION VENTAS BRUTAS => venta actual bruta - venta bruta anterior
                cal.VariacionVentaBruta     = preVentaBActual - element.VentaBAnterior
                let restaVentasBrutas       = preVentaBActual - element.VentaBAnterior
                //validar division para cero
                var prePorcentajeVariaciacionPresupuesto = 0;
                if((element.VentaBAnterior == 0)){
                    prePorcentajeVariaciacionPresupuesto = 0
                }else{
                    prePorcentajeVariaciacionPresupuesto = restaVentasBrutas / element.VentaBAnterior
                }
                //PORCENTAJE EN RELACION AL PRESUPUESTO => ( (venta actual bruta - venta bruta anterior)/venta actual bruta ) *100
                cal.PorcentajeVariacionPresupuesto = ((prePorcentajeVariaciacionPresupuesto) * 100).toFixed(0)
                arregloPreFinal.push(cal)
            });
            //me.TmparregloVenta = arregloPreFinal
             //FILTRO
             //si checkList es true se mostrara todo los asesores
             if(me.checkList){
                me.TmparregloVenta = arregloPreFinal
            }else{
              // si checkList es false se mostrara solo los asesores que tengan ventas
                me.TmparregloVenta = arregloPreFinal.filter(p => (p.preVentaBActual > 0 || p.VentaBAnterior > 0))
            }

            // Ordenar por vendedor (asesor) alfabéticamente
            me.TmparregloVenta.sort((a, b) => {
                if (a.asesor && b.asesor) {
                    return a.asesor.toLowerCase().localeCompare(b.asesor.toLowerCase());
                }
                return 0;
            });
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        },
        //metodo par descargar el excel
        ExportToExcel(type, fn, dl) {
          var elt = document.getElementById('miTabla');
          var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
          return dl ?
              XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
              XLSX.writeFile(wb, fn || ('ReporteVendedores.' + (type || 'xlsx')));
        },
    }
}
</script>
<style scoped>
.tabla1 {
  table-layout: fixed;
  width: 95%;
  border-collapse: collapse;
  border: none;
  margin-left: 15px;
}
.encabezado ,td,th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
}

/* Estilos para header fijo */
.table-container {
    max-height: 70vh;
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
    font-size: 10px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    line-height: 1.2;
}

.sticky-table td {
    padding: 4px 2px;
    font-size: 9px;
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
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
