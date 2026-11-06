<template>
  <div>
    <!-- Título -->
    <h1 class="mt-5">Reporte regalados por serie {{ nombrePeriodo }}</h1>
    <br />

    <!-- Botón Mostrar/Ocultar tabla -->
    <vs-button
      type="flat"
      class="p-2"
      icon-pack="fa"
      :icon="showTable ? 'fa-eye-slash' : 'fa-eye'"
      @click="showTable = !showTable;"
      color="primary"
      title="Mostrar/Ocultar tabla"
    ></vs-button>
    <!-- Selección de serie -->
    <div>
      <p>Seleccione la serie </p>
      <v-select
        :options="arraySeries"
        :reduce="arraySeries => arraySeries.id_serie"
        label="nombre_serie"
        placeholder="--Seleccione--"
        class="w-full"
        v-model="serieSelected"
        @input="arrayReporte=[];"
      />
      <!-- Cards Totales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-5">
        <!--total regalados-->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Total Regalados</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            {{ (totalNormales + totalQuitados) | filtrarDecimal }}
          </p>
        </div>
      </div>
      <br>
      <vs-button class="mt-3 p-2" @click="f_getReporte()">Generar Reporte</vs-button>
      <vs-button class="mt-3 ml-3 p-2" color="success" @click="f_exportar()" :disabled="arrayReporte.length === 0">
        <i class="fa-solid fa-file-arrow-down"></i> Exportar
      </vs-button>
       <!-- Tabla -->
      <div v-if="arrayReporte.length > 0 && showTable" class="mt-5">
        <h3>Regalados</h3>
        <vs-table max-items="10" search pagination :data="arrayReporte">
          <template slot="header">
            <vs-chip color="primary">
              Libros: <b>{{ arrayReporte.length }}</b> &nbsp;
            </vs-chip>
          </template>

          <template slot="thead">
            <vs-th>Código</vs-th>
            <vs-th>Nombre del libro</vs-th>
            <vs-th>Serie</vs-th>
            <vs-th sort-key="cantidad_normales">sin quitar del reporte</vs-th>
            <vs-th sort-key="cantidad_quitados">quitados del reporte</vs-th>
            <vs-th>Acciones</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{ data[indextr].codigo_liquidacion }}</vs-td>
              <vs-td>{{ data[indextr].nombrelibro }}</vs-td>
              <vs-td>{{ data[indextr].serie }}</vs-td>
              <vs-td>
                {{ tr.cantidad_normales }}
              </vs-td>
              <vs-td>
                {{ tr.cantidad_quitados }}
              </vs-td>
              <vs-td>
                <vs-button
                  type="filled"
                  icon-pack="fa"
                  icon="fa-eye"
                  class="p-2"
                  color="primary"
                  title="Ver códigos regalados"
                  @click="ObjectSelected=tr;f_mostrarDetalles(data[indextr])"
                >Ver detalles</vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
    <vs-popup classContent="popup-example" fullscreen class="informacionformHijo"
        title="Mostrar detalle" :active.sync="popupMostrarCodigos">

        <!-- Tabla reutilizable dentro del popup -->
        <div v-if="arrayCodigosDetalle.length > 0">

            <TableReutilizableVue
              :title="'Códigos individuales' +' del libro: ' + (ObjectSelected.nombrelibro || '')"
              :headers="['Código','Código Liquidación','Libro','Documento de venta','Empresa documento','Factura','Tipo de venta','Institucion bc institucion','Institucion venta lista ','Quitado del reporte','Combo','Combo etiqueta']"
              :fieldKeys="['codigo_libro','codigo_liquidacion','nombrelibro','codigo_proforma','proforma_empresa','factura','venta_estado','institucionBcInstitucion','institucionVentaListaInstitucion','quitar_de_reporte','combo','codigo_combo']"
              :ifexportar="1"
              :tableData="arrayCodigosDetalle"
              :nombrearchivo="'Codigos_Individuales_' + (ObjectSelected.institucion || '') + '_' + (nombrePeriodo || 'Periodo').replace(/ /g,'_')"
            />
          </div>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Generalmix from '../../../../../mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
import * as XLSX from 'xlsx';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
  name: 'ReporteVentasRegaladosVue',
  mixins: [Generalmix, Codigosmix],
  components: {
    vSelect,
    TableReutilizableVue
  },
  data() {
    return {
      showTable: false,
      arrayReporte: [], //
      serieSelected:'',
      arraySeries: [],
      ObjectSelected:'',
      arrayCodigosDetalle: [],
      popupMostrarCodigos: false
    }
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
    totalNormales() {
      return this.arrayReporte.reduce((acc, item) => acc + item.cantidad_normales, 0)
    },
    totalQuitados() {
      return this.arrayReporte.reduce((acc, item) => acc + item.cantidad_quitados, 0)
    }
  },
  mounted() {
    this.getSeries()
  },
  methods:{
    getSeries() {
      let me = this;
      // me.$vs.loading();
      this.$http.get(this.$server_url+'series')
      .then(function (res) {
          // me.$vs.loading.close()
          me.arraySeries = res.data.filter(item => item.ser_estado === 1)
          //agregar opcion todos
          me.arraySeries.unshift({ id_serie: 'todos', nombre_serie: 'Todos' })
      })
      .catch(function (error) {
          console.log(error + ' error');
          // me.$vs.loading.close()
      })
    },
    f_getReporte(){
      let me = this
      if(me.serieSelected == '' || me.serieSelected == null || me.serieSelected === undefined){
        this.$vs.notify({
          title: 'Atención',
          text: 'Debe seleccionar una serie',
          color: 'danger',
        })
        return
      }
      me.$vs.loading();
      var url = `metodosGetCodigos?getReporteCodigosRegaladosXSerie=1&periodo_id=${me.periodo_id}&id_serie=${me.serieSelected}&soloRegalados=1`
      this.$http.get(this.$server_url + url)
      .then(function (res) {
        me.$vs.loading.close()
        me.arrayReporte = res.data;
        if(me.arrayReporte.length===0){
            me.$vs.notify({
              title: 'Información',
              text: 'No se encontraron datos para el periodo y serie seleccionados',
              color: 'warning',
            })
          }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_mostrarDetalles(item) {
      let me = this;
      me.arrayCodigosDetalle = [];
      me.$vs.loading();
      var url = `metodosGetCodigos?getReporteCodigosRegaladosXSerieCodigos=1&periodo_id=${me.periodo_id}&id_serie=${me.serieSelected}&soloRegalados=1&libro_idReal=${item.libro_idReal}`
      this.$http.get(this.$server_url + url)
      .then(function (res) {
        me.$vs.loading.close()
        me.arrayCodigosDetalle = res.data;
        if(me.arrayCodigosDetalle.length===0){
          me.m_message('No se encontraron códigos para este libro', 'warning')
          return
        }
        me.popupMostrarCodigos = true;
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
        me.m_message('Error al cargar los códigos', 'danger')
      })
    },
    f_exportar() {
      // Exportar ambas tablas en un solo archivo Excel con dos hojas
      const ws1 = XLSX.utils.json_to_sheet(this.arrayReporte.map(item => ({
        'Nombre del libro': item.nombrelibro,
        'Serie': item.serie,
        'Cantidad': item.cantidad,
        'Regalados sin quitar del reporte': item.cantidad_normales,
        'Regalados quitados del reporte': item.cantidad_quitados
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'Regalados');
      const nombreArchivo = `Reporte_Regalados_${this.nombrePeriodo || 'Periodo'}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    }
  }
}
</script>
