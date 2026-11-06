<template>
  <div>
        <h1 class="mt-5">Reporte por libro</h1>
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
        <vs-button @click="f_exportar" color="success" class="p-2">
          <i class="fa-solid fa-file-arrow-down"></i> Exportar
        </vs-button>
      </div>
      <!-- Nuevo Card Totales -->
      <div v-if="arrayReporte.length > 0" class="mt-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Pedidos</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              {{ totalPedidos | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Facturado</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              {{ totalFacturado | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Despachado Individual</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              {{ totalDespachadoIndividual | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Despachado Combo</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              {{ totalDespachadoCombo | filtrarDecimal }}
            </p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Despachado</h3>
            <p class="text-4xl font-bold text-purple-600 mt-2">
              {{ (totalDespachadoIndividual + totalDespachadoCombo) | filtrarDecimal }}
            </p>
          </div>
        </div>
      </div>
      <p class="mt-5"><b>Facturado:</b> Venta bruta - devoluciones</p>
      <p class="mt-5"><b>Total Despachado Individual:</b> (bruta sin devoluciones)</p>
      <p class="mt-5"><b>Total Despachado Combo:</b> (Suma de todos los combos despachados sin devoluciones)</p>
      <!-- Tabla -->
      <vs-table max-items="10" search pagination :data="arrayReporte" stripe>
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
      </vs-table>
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
    totalDespachadoIndividual() {
      return this.arrayReporte.reduce((acc, i) => acc + (parseFloat(i.despachoBodega) || 0), 0);
    },
    totalDespachadoCombo() {
      return this.arrayReporte.reduce((acc, i) => acc + (parseFloat(i.totalDespachadoBodegaCombo) || 0), 0);
    },
  },
  methods:{
    f_getReporte() {
      let me = this
      let url = `metodosGetVentas?GetReportePorLibro=1&periodo=${this.periodo_id}&tipoVenta=3&tipoInstitucionIncluir=6,5,4,3,2,1`
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
          // Ahora traemos combos y fusionamos
          me.f_despachoCombo().then(() => {
            me.f_fusionarCombos()
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
        let url = `metodosGetCodigos?getReporteCombosDespachados=1&periodo=${this.periodo_id}&tipoInstitucionIncluir=6,5,4,3,2,1`
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
    f_fusionarCombos() {
      const final = [];

      // Primero recorremos el arrayReporte principal
      this.arrayReporte.forEach(libro => {
        // Buscamos combo correspondiente normalizando códigos
        const combo = this.arrayCombosDespachados.find(
          c => c.codigo_liquidacion.trim().toUpperCase() === libro.codigo_liquidacion.trim().toUpperCase()
        );

        final.push({
          ...libro,
          // Solo campos de combos
          cantidad_despachadaCombo: combo ? combo.cantidad_despachadaCombo : 0,
          totalDespachadoBodegaCombo: combo ? combo.totalDespachadoBodegaCombo : 0,
          codigos_combos: combo ? combo.codigos_combos : '',
          ifCombo: combo ? 1 : 0
        });
      });

      // Luego agregamos combos que no existen en arrayReporte
      this.arrayCombosDespachados.forEach(combo => {
        const existe = this.arrayReporte.some(
          libro => libro.codigo_liquidacion.trim().toUpperCase() === combo.codigo_liquidacion.trim().toUpperCase()
        );

        if (!existe) {
          final.push({
            codigo_liquidacion: combo.codigo_liquidacion,
            nombrelibro: combo.nombrelibro,
            nombre_serie: combo.nombre_serie,
            precio: combo.precio,
            total_cantidadPedido: 0,
            pedido: 0,
            cantidad_facturada: 0,
            documentoVenta: 0,
            cantidad_despachada: 0,
            despachoBodega: 0,
            // Solo campos de combo
            cantidad_despachadaCombo: combo.cantidad_despachadaCombo,
            totalDespachadoBodegaCombo: combo.totalDespachadoBodegaCombo,
            codigos_combos: combo.codigos_combos,
            ifCombo: 1
          });
        }
      });

      // Reemplazamos arrayReporte
      this.arrayReporte = final;
      console.log("Array fusionado:", this.arrayReporte);
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
