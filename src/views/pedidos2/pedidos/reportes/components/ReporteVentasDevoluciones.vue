<template>
  <div>
    <!-- Título -->
    <h1 class="mt-5">Reporte devoluciones de {{ nombrePeriodo }}</h1>
    <br />

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

    <div class="mt-4">
      <!-- Botón para cargar reporte -->
      <vs-button @click="f_getReporte" class="p-2" color="primary" icon="refresh">
        Cargar Reporte
      </vs-button>

       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-5">
        <!--total regalados-->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Total Devoluciones</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            ${{ formatNumber(totalSoloDevueltoGlobal) }}
          </p>
        </div>
         <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Cantidad Facturado</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
           {{ formatNumber(totalCantidadFacturadaGlobal) }}
          </p>
        </div>
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Cantidad Devoluciones</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
           {{ formatNumber(totalCantidadDevueltaGlobal) }}
          </p>
        </div>
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Porcentaje Devolución</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            {{ porcentajeDevolucionGeneralGlobal }}%
          </p>
        </div>
      </div>
      <div v-if="showTable">
        <!-- Tabla de Instituciones -->
        <vs-table max-items="10" search pagination :data="arrayReporte" class="mt-4">
          <template slot="header">
            <vs-chip color="primary">Cantidad: <b>{{ arrayReporte.length }}</b></vs-chip>
          </template>

          <template slot="thead">
            <vs-th>ID</vs-th>
            <vs-th>Nombre de Institución</vs-th>
            <vs-th>Cantidad Venta</vs-th>
            <vs-th>Cantidad Devolución</vs-th>
            <vs-th>Porcentaje devolución%</vs-th>
            <vs-th>Cantidad Total</vs-th>
            <vs-th>Total</vs-th>
            <vs-th sort-key="totalSoloDevuelto">Total solo devuelto</vs-th>
            <vs-th>Total - devolución</vs-th>
            <vs-th>Acciones</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{ tr.idInstitucion }}</vs-td>
              <vs-td>{{ tr.nombreInstitucion }}</vs-td>
              <vs-td>{{ tr.det_ven_cantidad }}</vs-td>
              <vs-td>{{ tr.det_ven_dev }}</vs-td>
              <vs-td>{{ tr.porcentajeDevuelto }}%</vs-td>
              <vs-td>{{ tr.cantidadReal }}</vs-td>
              <vs-td>{{ tr.totalFacturado | filtrarDecimal }}</vs-td>
              <vs-td>{{ tr.totalSoloDevuelto | filtrarDecimal }}</vs-td>
              <vs-td>{{ tr.totalFacturadoMenosDevuelto | filtrarDecimal }}</vs-td>
              <vs-td>
                <div style="display: flex;">
                  <vx-tooltip text="Ver detalle" position="top" color="primary">
                    <vs-button
                      size="small"
                      color="primary"
                      type="filled"
                      icon-pack="feather"
                      icon="icon-eye"
                      @click="ObjectSelected=tr;verDetalle(tr)"
                    >Mostrar devolución</vs-button>
                  </vx-tooltip>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <!-- Popup detalle -->
      <vs-popup classContent="popup-example" fullscreen class="informacionformHijo" title="Mostrar detalle" :active.sync="popupMostrarDetalle">
        <div v-if="popupMostrarDetalle">
          <!-- Totales Detalle -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6 font-semibold text-lg">
            <div>Total Libros: {{ totalLibros }}</div>
            <div>Total: ${{ formatNumber(total) }}</div>
            <div>Total con Devolución: ${{ formatNumber(totalConDevolucion) }}</div>
            <div>Total Cantidad Facturada: {{ totalCantidadFacturada }}</div>
            <div>Total Cantidad - Devuelta: {{ totalCantidadDevuelta }}</div>
            <div>Porcentaje Devolución: {{ porcentajeDevolucionGeneral }}%</div>
          </div>

          <!-- Tabla Detalle -->
          <TableReutilizableVue :title="`Despacho X Institución ${ObjectSelected.nombreInstitucion}`"
            :headers="['Codigo', 'Nombre', 'Documento', 'Empresa','Cantidad Venta','Cantidad Devolución','Porcentaje devolución%','Cantidad Total', 'Precio. Unit.', 'Total', 'Total - devolución']"
            :fieldKeys="['pro_codigo', 'pro_nombre', 'ven_codigo', 'empresa','det_ven_cantidad','cantidadDevuelta','porcentajeDevuelto','cantidadReal', 'det_ven_valor_u', 'precio', 'precioDevolucion']"
            :ifexportar="1" :tableData="arrayDetalle"
            :nombrearchivo="`Despacho X Institución ${ObjectSelected.nombreInstitucion}`"
            :totales="['det_ven_cantidad','cantidadDevuelta','porcentajeDevuelto','cantidadReal', 'det_ven_valor_u', 'precio', 'precioDevolucion']"/>
        </div>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import Generalmix from '../../../../../mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
  mixins: [Generalmix],
  components: { TableReutilizableVue },
  data() {
    return {
      showTable: false,
      arrayReporte: [],
      popupMostrarDetalle: false,
      ObjectSelected: {},
      arrayDetalle: [],
    };
  },
  props: {
    periodo_id: { type: Number, required: true },
    nombrePeriodo: { type: String, required: true }
  },
  computed: {
    // Totales globales
    totalLibrosGlobal() {
      return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.cantidadReal) || 0), 0);
    },
    totalGlobal() {
      return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.totalFacturado) || 0), 0);
    },
    totalConDevolucionGlobal() {
      return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.totalFacturadoMenosDevuelto) || 0), 0);
    },
    totalCantidadFacturadaGlobal() {
      return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.det_ven_cantidad) || 0), 0);
    },
    totalSoloDevueltoGlobal() {
      return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.totalSoloDevuelto) || 0), 0);
    },
    totalCantidadDevueltaGlobal() {
      return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.det_ven_dev) || 0), 0);
    },
    porcentajeDevolucionGeneralGlobal() {
      return this.totalCantidadFacturadaGlobal > 0
        ? ((this.totalCantidadDevueltaGlobal / this.totalCantidadFacturadaGlobal) * 100).toFixed(2)
        : 0;
    },

    // Totales del detalle
    totalLibros() {
      return this.arrayDetalle.reduce((acc, item) => acc + (parseFloat(item.cantidadReal) || 0), 0);
    },
    total() {
      return this.arrayDetalle.reduce((acc, item) => acc + (parseFloat(item.precio) || 0), 0);
    },
    totalConDevolucion() {
      return this.arrayDetalle.reduce((acc, item) => acc + (parseFloat(item.precioDevolucion) || 0), 0);
    },
    totalCantidadFacturada() {
      return this.arrayDetalle.reduce((acc, item) => acc + (parseFloat(item.det_ven_cantidad) || 0), 0);
    },
    totalCantidadDevuelta() {
      return this.arrayDetalle.reduce((acc, item) => acc + (parseFloat(item.cantidadDevuelta) || 0), 0);
    },
    porcentajeDevolucionGeneral() {
      return this.totalCantidadFacturada > 0
        ? ((this.totalCantidadDevuelta / this.totalCantidadFacturada) * 100).toFixed(2)
        : 0;
    }
  },
  methods: {
    f_getReporte() {
      let me = this;
      me.$vs.loading();
      var url = `despachos?busquedaInstitucionPeriodoTodas=yes&periodo=${this.periodo_id}`;
      this.$http.get(this.$server_url + url)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayReporte = res.data.map(item => {
            const det_ven_cantidad = parseFloat(item.det_ven_cantidad) || 0
            const det_ven_dev = parseFloat(item.det_ven_dev) || 0
            const porcentajeDevuelto = det_ven_cantidad > 0
              ? ((det_ven_dev / det_ven_cantidad) * 100).toFixed(2)
              : 0
            return { ...item, det_ven_cantidad, det_ven_dev, porcentajeDevuelto }
          })
          if (me.arrayReporte.length === 0) {
            me.m_message('No se encontraron datos', 'warning');
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
          me.m_message('Error al cargar datos', 'danger');
        });
    },
    verDetalle(item) {
      let url = `despachos?XinstitucionTodo=yes&periodo=${this.periodo_id}&institucion=${item.idInstitucion}`
      this.$http.get(this.$server_url + url).then((res) => {
        this.arrayDetalle = res.data.map(item => {
          const det_ven_cantidad = parseFloat(item.det_ven_cantidad) || 0
          const cantidadDevuelta = parseFloat(item.cantidadDevuelta) || 0
          const porcentajeDevuelto = det_ven_cantidad > 0
            ? ((cantidadDevuelta / det_ven_cantidad) * 100).toFixed(2)
            : 0
          return {
            ...item,
            empresa: item.id_empresa == 1 || item.id_empresa == 6 ? 'Prolipa' : 'Calmed',
            cantidadReal: parseFloat(item.cantidadReal) || 0,
            det_ven_cantidad,
            cantidadDevuelta,
            precio: parseFloat(item.precio) || 0,
            precioDevolucion: parseFloat(item.precioDevolucion) || 0,
            total: (item.det_ven_valor_u * (det_ven_cantidad - item.det_ven_dev)).toFixed(2),
            porcentajeDevuelto,
          }
        })
        this.popupMostrarDetalle = true
      }).catch((err) => {
        console.error(err)
        this.m_message('Error al cargar datos', 'danger')
      })
    },
    formatNumber(valor) {
      return Number(valor).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
  }
};
</script>
