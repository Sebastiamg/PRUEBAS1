<template>
  <div>
        <h1 class="mt-5">Reporte Despachos y Pagos</h1>
    <br>

    <!-- Botón ojito -->
    <vs-button
      type="flat"
      class="p-2"
      icon-pack="fa"
      :icon="showTable ? 'fa-eye-slash' : 'fa-eye'"
      @click="showTable = !showTable"
      color="primary"
      title="Mostrar/Ocultar tabla"
    />
    <div v-if="showTable">
      <div class="mt-3 flex flex-wrap items-center gap-3 md:gap-4">
        <!-- Botón cargar -->
        <vs-button @click="f_getReporte" class="p-2">
          <i class="fa-solid fa-rotate-right"></i> Cargar reporte
        </vs-button>

        <!-- Botón exportar -->
        <!-- <vs-button @click="f_exportar" color="success" class="p-2">
          <i class="fa-solid fa-file-arrow-down"></i> Exportar
        </vs-button> -->
      </div>
      <!-- Nuevo Card Totales -->
      <div v-if="arrayReporte.length > 0" class="mt-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Despachado Individual</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              ${{ totalDespachadoIndividual | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Despachado Combo</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              ${{ totalDespachadoCombo | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Despachado</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              ${{ (totalDespachadoIndividual + totalDespachadoCombo) | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Pagos</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              ${{ totalPagosConvenio | filtrarDecimal }}
            </p>
          </div>
        </div>
      </div>
      <!-- <p class="mt-5"><b>Facturado:</b> Venta bruta - devoluciones</p> -->
      <!-- <p class="mt-5"><b>Total Despachado Individual:</b> (bruta sin devoluciones)</p> -->
      <!-- <p class="mt-5"><b>Total Despachado Combo:</b> (Suma de todos los combos despachados sin devoluciones)</p> -->
      <!-- Tabla -->
      <!-- <vs-table max-items="10" search pagination :data="arrayReporte" stripe>
          <template slot="header">
              <vs-chip color="primary">Cantidad: <b> {{ arrayReporte.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Código</vs-th>
              <vs-th>Nombre</vs-th>
              <vs-th sort-key="pedido">Pedido</vs-th>
              <vs-th sort-key="documentoVenta">Facturado</vs-th>
              <vs-th sort-key="despachoBodega">Despacho Bodega</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{data[indextr].codigo_liquidacion}}<br>
                </vs-td>
                <vs-td>
                  {{data[indextr].nombrelibro}}<br>
                  <b>Precio:</b>
                  <p>{{ tr.precio }}</p>
                  <b>Serie:</b>
                  <p>{{ tr.nombre_serie }}</p>
                </vs-td>
                <vs-td>
                  ${{ tr.pedido}}<br>
                  <b>Cantidad:</b>
                  <p>{{ tr.total_cantidadPedido | filtrarDecimal }}</p>
                </vs-td>
                <vs-td>
                  ${{ tr.documentoVenta}}<br>
                  <b>Cantidad:</b>
                  <p>{{ tr.cantidad_facturada  |  filtrarDecimal }}</p>
                </vs-td>
                <vs-td>
                  <div v-if="tr.ifCombo == 0">
                    ${{ tr.despachoBodega}}<br>
                    <b>Cantidad:</b>
                    <p>{{ tr.cantidad_despachada  |  filtrarDecimal }}</p>
                  </div>
                  <div v-else>
                     ${{ tr.totalDespachadoBodegaCombo | filtrarDecimal }}<br>
                    <b>Cantidad:</b>
                    <p>{{ tr.cantidad_despachadaCombo | filtrarDecimal }}</p>
                  </div>
                </vs-td>
            </vs-tr>
          </template>
      </vs-table> -->
    </div>
  </div>
</template>
<script>
import Generalmix from '@/mixins/Generalmix.js';
import Codigosmix from "@/mixins/Codigosmix";
export default{
  mixins: [Generalmix, Codigosmix],
  data() {
    return {
      showTable: true,
      arrayReporte: [],
      arrayCombosDespachados: [],
      arrayDatosComision: [],
      totalDespachadoIndividual: 0,
      totalDespachadoIndividualNeto: 0,
    };
  },
  props: {
    periodo_id: {
      type: Number,
      required: true
    },
    nombrePeriodo: {
      type: String,
      required: true
    }
  },
  computed: {
    totalPedidos() {
      return this.arrayReporte.reduce((acc, i) => acc + (parseFloat(i.pedido) || 0), 0);
    },
    totalFacturado() {
      return this.arrayReporte.reduce((acc, i) => acc + (parseFloat(i.documentoVenta) || 0), 0);
    },
    totalDespachadoCombo() {
      return this.arrayCombosDespachados.reduce((acc, i) => acc + (parseFloat(i.totalDespachadoBodegaCombo) || 0), 0);
    },
    totalPagosConvenio() { return this.arrayDatosComision.reduce((acc,i)=>acc+(parseFloat(i.totalPagosConvenio)||0),0); },
  },
  methods:{
     f_datosComision() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + `metodosGetVentas?GetReportePedidosPagos=1&periodo=${this.periodo_id}`)
        .then(res => {
          me.$vs.loading.close();
          if (res.data.status == 0) this.m_message(res.data.message,'danger');
          else this.arrayDatosComision = res.data;
        }).catch(err => {
          me.$vs.loading.close();
          console.log(err);
          me.m_message('Error al obtener el reporte','danger');
        });
    },
    f_getReporte() {
      let me = this
      me.totalDespachadoIndividual = 0;
      me.totalDespachadoIndividualNeto = 0;
      let url = `metodosGetVentas?getDespachosDocumentosVentas=1&periodo=${this.periodo_id}&tipoVenta=3&tipoInstitucionIncluir=6,5,4,3,2,1`
      me.$vs.loading()
      this.$http.get(this.$server_url + url)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.m_message(res.data.message, 'danger')
          }
          me.arrayReporte = res.data || []
          if(me.arrayReporte.length == 0){
            me.m_message('No hay datos para mostrar', 'warning')
          }
          me.totalDespachadoIndividual = parseFloat(me.arrayReporte[0].total_precio) || 0;
          me.totalDespachadoIndividualNeto = parseFloat(me.arrayReporte[0].total_valor_neto) || 0;
          // Ahora traemos combos y fusionamos
          me.f_despachoCombo().then(() => {
            me.f_datosComision()
          })
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
          me.m_message('Error al obtener los datos', 'danger')
        })
    },
    f_despachoCombo() {
      let me = this;
      return new Promise((resolve, reject) => {
        let url = `metodosGetCodigos?getReporteCombosDespachadosSoloCombos=1&periodo=${this.periodo_id}&tipoInstitucionIncluir=6,5,4,3,2,1`
        me.$vs.loading();
        this.$http.get(this.$server_url + url)
          .then(function (res) {
            me.$vs.loading.close()
            if(res.data.status == 0){
              me.m_message(res.data.message, 'danger')
            }
            me.arrayCombosDespachados = res.data || []
            resolve()
          })
          .catch(function (error) {
            me.$vs.loading.close()
            console.log(error + ' error');
            me.m_message('Error al obtener los datos de combos despachados', 'danger')
            reject()
          })
      })
    },


    f_exportar() {
      // Definimos cabeceras
      const headers = [
        'Código',
        'Nombre del libro',
        'Precio',
        'Serie',
        'Pedido',
        'Cantidad Pedido',
        'Facturado',
        'Cantidad Facturada',
        'Despacho Bodega Individual',
        'Cantidad Despachada Individual',
        'Despacho Bodega Combo',
        'Cantidad Despachada Combo',
      ];

      // Definimos qué campos del arrayReporte vamos a exportar
      const fieldKeys = [
        'codigo_liquidacion',
        'nombrelibro',
        'precio',
        'nombre_serie',
        'pedido',
        'total_cantidadPedido',
        'documentoVenta',
        'cantidad_facturada',
        'despachoBodega',
        'cantidad_despachada',
        'totalDespachadoBodegaCombo',
        'cantidad_despachadaCombo',
      ];

      // multiplica *1 para convertir a número
      this.arrayReporte = this.arrayReporte.map(item => {
        return {
          ...item,
          precio: parseFloat(item.precio) || 0,
          pedido: parseFloat(item.pedido) || 0,
          total_cantidadPedido: parseFloat(item.total_cantidadPedido) || 0,
          documentoVenta: parseFloat(item.documentoVenta) || 0,
          cantidad_facturada: parseFloat(item.cantidad_facturada) || 0,
          despachoBodega: parseFloat(item.despachoBodega) || 0,
          cantidad_despachada: parseFloat(item.cantidad_despachada) || 0,
          totalDespachadoBodegaCombo: parseFloat(item.totalDespachadoBodegaCombo) || 0,
          cantidad_despachadaCombo: parseFloat(item.cantidad_despachadaCombo) || 0,
        };
      });

      // Nombre del archivo
      const nombreArchivo = `Reporte_PorLibro_${this.nombrePeriodo || 'Periodo'}.xlsx`;

      // Llamamos a tu helper del mixin
      this.m_exportTodo(headers, fieldKeys, this.arrayReporte, nombreArchivo);
    },
  }
}
</script>
