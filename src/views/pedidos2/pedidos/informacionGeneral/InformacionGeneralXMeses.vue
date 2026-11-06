<template>
  <div class="mt-5">
    <div class="row">
      <input type="radio" @input="resetData" id="Directa" value="1" v-model="tipov"
        class="cursor-pointer radio-large" />
      <label for="Directa" class="cursor-pointer">Directa</label>

      <input type="radio" @input="resetData" id="Lista" value="2" v-model="tipov" class="cursor-pointer radio-large" />
      <label for="Lista" class="cursor-pointer">Por lista</label>

      <input type="radio" @input="resetData" id="Todo" value="3" v-model="tipov" class="cursor-pointer radio-large" />
      <label for="Todo" class="cursor-pointer">Todo</label>
    </div>
    <vx-card class="mt-2">
      <!-- Filtros -->
      <div class="vx-row">
        <!-- Asesor -->
        <div class="vx-col w-full sm:w-1/2 xl:w-1/3 mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-1">👤 Asesor:</label>
          <v-select :options="[{ id_asesor: 0, asesor: 'Todos los asesores' }, ...arrayAsesores]" :reduce="item => item"
            @input="getLibros" label="asesor" class="w-full" v-model="asesorSelected" />
        </div>

        <!-- Filtro por rango de meses -->
        <div class="vx-col w-full sm:w-1/2 xl:w-1/3 mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-1">📅 Rango de meses:</label>
          <div class="flex items-center gap-2">
            <datepicker v-model="filtroFechaInicio" :minimumView="'month'" :maximumView="'month'"
              :input-class="'datepicker-input'" placeholder="Mes inicio" class="w-full" />
            <span class="text-gray-600">a</span>
            <datepicker v-model="filtroFechaFin" :minimumView="'month'" :maximumView="'month'"
              :input-class="'datepicker-input'" placeholder="Mes fin" :disabled-dates="{ to: filtroFechaInicio }"
              class="w-full" />
          </div>
        </div>

        <!-- Botón Buscar -->
        <div class="vx-col w-full sm:w-full xl:w-1/3 mb-6 flex items-end justify-center">
          <vs-button class="ml-auto" @click="getLibros" icon="search">
            Buscar
          </vs-button>
        </div>
      </div>
      <div>
        <tr>
          <td style="padding-right: 10px;">
            <p>💰 Valor total:</p>
          </td>
          <td>
            <p>$ {{ totalValor | filtrarDecimal }}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-right: 10px;">
            <p>📚 Cantidad libros: </p>
          </td>
          <td>
            <p>{{ totalCantidad }}</p>
          </td>
        </tr>
      </div>
      <br>
      <!-- Fin Filtros -->
      <div class="flex">

      </div>
      <vs-table max-items="50" search stripe :data="tmpArrayReporte" id="miTabla" v-if="tmpArrayReporte.length > 0">
        <template slot="header">
          <vs-chip>Cantidad {{ tmpArrayReporte.length }}</vs-chip>
          <vs-button @click="ExportToExcel('xlsx')" class="btn btn-sm ml-2" icon-pack="feather" icon="icon-printer"
            color="success" type="border" v-if="tmpArrayReporte.length > 0">
            Exportar a Excel
          </vs-button>
        </template>
        <template slot="thead">
          <vs-th class="fixed-column" sort-key="fecha_inicio">Institución</vs-th>
          <vs-th class="" sort-key="fecha_inicio">Contratos</vs-th>
          <vs-th class="" v-for="(value, key) in tmpArrayReporte[0]" :key="key"
            v-if="key !== 'id_pedido' && key !== 'contrato_generado' && key !== 'nombreInstitucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'id_asesor' && key !== 'fecha_generacion_contrato'">
            {{ key.toUpperCase().replace('_', ' ') }}
          </vs-th>
        </template>
        <template slot-scope="{ data }">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td class="fixed-column">
              <div>
                #{{ tr.id_pedido }} <br>
                <b>Fecha Contrato:</b> <br>
                {{ tr.fecha_generacion_contrato }} <br>
                <div style="width: 200px;" class="flex flex-col gap-2">
                  <span class="flex font-bold">{{ tr.nombreInstitucion }}</span>
                </div>
                <div>
                  <span class="text-xs">{{ tr.ciudad }}</span>
                  <br>
                  <span class="text-xs">{{ tr.asesor }}</span>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div style="width: 200px;" class="flex flex-col gap-2">
                <span class="flex font-bold">{{ tr.contrato_generado }}</span>
              </div>
            </vs-td>
            <vs-td v-for="(value, key) in tr" :key="key"
              v-if="key !== 'id_pedido' && key !== 'contrato_generado' && key !== 'nombreInstitucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'id_asesor' && key !== 'fecha_generacion_contrato'">
              <span v-if="value > 0"
                style="background-color: #3FACB1;color:white;border-radius: 100%;padding: 10px; width: 30px !important; height: 30px !important;">
                {{ value }}
              </span>
              <span v-else></span>
            </vs-td>
          </vs-tr>
          <!-- Fila para el total -->
          <vs-tr>
            <td class="fixed-column"><b>TOTAL LIBROS</b></td>
            <td></td>
            <td v-for="(value, key) in arrayTotales" :key="key"><b>{{ value.cantidad }}</b></td>
          </vs-tr>
          <vs-tr>
            <td class="fixed-column"><b>PRECIO</b></td>
            <td></td>
            <td v-for="(value, key) in arrayTotales" :key="key"><b>{{ value.precio }}</b></td>
          </vs-tr>
          <vs-tr>
            <td class="fixed-column"><b>VALOR TOTAL</b></td>
            <td></td>
            <td v-for="(value, key) in arrayTotales" :key="key"><b>{{ value.total | filtrarDecimal }}</b></td>
          </vs-tr>
        </template>
      </vs-table>
      <br><br><br><br><br><br><br><br><br><br><br><br><br>
    </vx-card>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import Datepicker from 'vuejs-datepicker';
import * as XLSX from 'xlsx';
import { mapState } from 'vuex';
import PedidosRepository from '@/repositories/PedidosRepository';

export default {
  components: {
    vSelect,
    Datepicker
  },
  props: {
    periodoSelect: {
      type: Number,
      default: 0
    },
    periodo: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      tipov: 1,
      arrayReporte: [],
      tmpArrayReporte: [],
      arrayLibros: [],
      arrayTotales: [],
      arrayAsesores: [],
      arrayCiudades: [],
      asesorSelected: { id_asesor: 0, asesor: 'Todos los asesores' },
      filtroFechaInicio: null,
      filtroFechaFin: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      fileName: null,
      selectedFormat: 'xlsx',
      cellAutoWidth: true,
      mixinIdInicioFormatoNewData: null,
      totalValor: 0,
      totalCantidad: 0
    };
  },
  computed: {
    ...mapState(['auth', 'userRoot', 'susuario', 'ObjectPuntos', 'userAsesor'])
  },
  mounted() {
    this.getAsesores();
    const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
    if (mixinData) {
      const parsedData = JSON.parse(mixinData);
      this.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
      console.log('Valor de minimo:', this.mixinIdInicioFormatoNewData);
    } else {
      console.warn('No se encontraron datos en localStorage para mixin_IdInicioFormatoNew');
    }
  },
  methods: {
    resetData() {
      this.arrayReporte = [];
      this.tmpArrayReporte = [];
      this.totalCantidad = 0;
      this.totalValor = 0;
      this.getLibros();
    },
    getAsesores() {
      PedidosRepository.rep_getAsesores().then(r => {
        this.arrayAsesores = r.data;
      });
    },
    async getLibros() {
      if (!this.filtroFechaInicio || !this.filtroFechaFin) {
        this.showError('Seleccione un rango de meses');
        return;
      }

      this.arrayLibros = [];
      this.arrayReporte = [];
      this.tmpArrayReporte = [];
      this.totalValor = 0;
      this.totalCantidad = 0;

      const startDate = this.formatDate(this.filtroFechaInicio);
      const endDate = this.formatDate(this.filtroFechaFin);
      const id_asesor = this.asesorSelected.id_asesor;

      let url = '';
      if (this.periodoSelect <= this.mixinIdInicioFormatoNewData) {
        url = `pedidosNew/pedidos?getLibrosXInstitucionesAsesor=yes&id_periodo=${this.periodoSelect}&tipo_venta=${this.tipov}&id_asesor=${id_asesor}&fecha_inicio=${startDate}&fecha_fin=${endDate}`;
      } else {
        url = `pedidosNew/pedidos?getLibrosXInstitucionesAsesor_new=yes&id_periodo=${this.periodoSelect}&tipo_venta=${this.tipov}&id_asesor=${id_asesor}&fecha_inicio=${startDate}&fecha_fin=${endDate}`;
      }

      if (id_asesor === 0) {
        url = url.replace(`id_asesor=${id_asesor}`, 'id_asesor=all');
      }

      this.$vs.loading();
      try {
        const res = await this.$http.get(this.$server_url + url);
        this.$vs.loading.close();
        const datos = res.data;

        if (datos.length === 0) {
          this.$vs.notify({
            text: 'No se encontraron libros para los filtros seleccionados',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
          return;
        }

        this.totalValor = datos.reduce((acc, item) => acc + item.subtotal, 0);
        this.totalCantidad = datos.reduce((acc, item) => acc + item.valor, 0);

        const librosNormales = datos.filter(p => p.id_serie != 6);
        const libroPlanLector = datos.filter(p => p.id_serie == 6);
        const getNormalesOrdenado = this.ordenarLibros(librosNormales);
        const getPlanLectorOrdenado = this.ordenarLibros(libroPlanLector);
        this.arrayLibros = [...getNormalesOrdenado, ...getPlanLectorOrdenado];
        await this.getReporte();
      } catch (err) {
        this.$vs.loading.close();
        this.showError('Error al obtener los libros', err);
      }
    },
    async getReporte() {
      if (!this.arrayLibros.length) return;

      this.arrayReporte = [];
      this.tmpArrayReporte = [];
      this.arrayTotales = [];

      this.$vs.loading();
      let formData = new FormData();
      if (this.periodoSelect <= this.mixinIdInicioFormatoNewData) {
        formData.append('getValoresLibrosContratosInstitucionesAsesor', '1');
      } else {
        formData.append('getValoresLibrosContratosInstitucionesAsesor_new', '1');
      }
      formData.append('id_periodo', this.periodoSelect);
      formData.append('arrayLibros', JSON.stringify(this.arrayLibros));
      formData.append('tipo_venta', this.tipov);
      formData.append('id_asesor', this.asesorSelected.id_asesor);
      formData.append('fecha_inicio', this.formatDate(this.filtroFechaInicio));
      formData.append('fecha_fin', this.formatDate(this.filtroFechaFin));

      if (this.asesorSelected.id_asesor === 0) {
        formData.set('id_asesor', 'all');
      }

      try {
        const res = await this.$http.post(this.$server_url + `pedidosNew/pedidos`, formData);
        this.$vs.loading.close();
        const datos = res.data;

        if (datos.length === 0) {
          this.showError('No se encontraron datos');
          return;
        }

        const uniqueCities = [...new Set(datos.map(p => p.ciudad))].sort();
        this.arrayCiudades = uniqueCities;

        datos.forEach(element => {
          const cal = {
            id_pedido: element.id_pedido,
            contrato_generado: element.contrato_generado,
            nombreInstitucion: element.nombreInstitucion,
            asesor: element.asesor,
            id_asesor: element.id_asesor,
            ciudad: element.ciudad,
            fecha_generacion_contrato: element.fecha_generacion_contrato
          };
          element.librosFormato.forEach(book => {
            cal[book.codigo] = book.valor;
          });
          this.arrayReporte.push(cal);
          this.tmpArrayReporte.push(cal);
        });

        this.getTotales();
      } catch (err) {
        this.$vs.loading.close();
        this.showError('Error al obtener el reporte', err);
      }
    },
    getTotales() {
      this.arrayTotales = [];
      this.arrayLibros.forEach(element => {
        const propName = element.codigo;
        const suma = this.arrayReporte.reduce((total, obj) => total + (obj[propName] || 0), 0);
        const pretotal = suma * element.precio;
        this.arrayTotales.push({
          codigo: element.codigo,
          precio: element.precio,
          cantidad: suma,
          total: pretotal
        });
      });
    },
    getAsesorSummary() {
      const summary = {};
      this.tmpArrayReporte.forEach(item => {
        const asesor = item.asesor;
        if (!summary[asesor]) {
          summary[asesor] = { cantidad: 0, valor: 0 };
        }
        this.arrayLibros.forEach(libro => {
          const valor = item[libro.codigo] || 0;
          summary[asesor].cantidad += valor;
          summary[asesor].valor += valor * libro.precio;
        });
      });
      return Object.entries(summary).map(([asesor, data]) => ({
        Asesor: asesor,
        'Cantidad Libros': data.cantidad,
        'Valor Total': this.$options.filters.filtrarDecimal(data.valor)
      }));
    },
    ordenarLibros(datos) {
      return datos.sort((a, b) => {
        const nombreA = a.codigo.toLowerCase();
        const nombreB = b.codigo.toLowerCase();
        const numA = parseInt(nombreA.match(/\d+$/) || 0);
        const numB = parseInt(nombreB.match(/\d+$/) || 0);
        const baseA = nombreA.replace(/\d+$/, '');
        const baseB = nombreB.replace(/\d+$/, '');

        if (baseA < baseB) return -1;
        if (baseA > baseB) return 1;
        if (numA && !numB) return 1;
        if (!numA && numB) return -1;
        if (numA && numB) {
          if (numA < 10 && numB >= 10) return -1;
          if (numA >= 10 && numB < 10) return 1;
          return numA - numB;
        }
        return 0;
      });
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}-01`;
    },
    ExportToExcel(type) {
      // Guardar el scroll y el estado visual actual
      const scrollPosition = {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
      
      // Obtener la tabla y guardar su posición
      const tabla = document.getElementById('miTabla');
      const tablaParent = tabla ? tabla.parentElement : null;
      let originalOverflow = '';
      
      if (tablaParent) {
        originalOverflow = tablaParent.style.overflow;
        tablaParent.style.overflow = 'hidden';
      }
      
      // Deshabilitar temporalmente el sticky
      const fixedColumns = document.querySelectorAll('.fixed-column');
      fixedColumns.forEach(col => {
        col.style.position = 'relative';
      });
      
      const wb = XLSX.utils.book_new();

      // Main report sheet - Reorganizar el orden de las columnas
      const mainSheetData = this.tmpArrayReporte.map(item => {
        const row = {
          'Institución': item.nombreInstitucion,
          'Ciudad': item.ciudad,
          'Asesor': item.asesor,
          'Contrato': item.contrato_generado,
          'Fecha Contrato': item.fecha_generacion_contrato
        };
        
        // Agregar las columnas de libros en orden
        this.arrayLibros.forEach(libro => {
          row[libro.codigo] = item[libro.codigo] || 0;
        });
        
        return row;
      });
      
      const mainSheet = XLSX.utils.json_to_sheet(mainSheetData);
      XLSX.utils.book_append_sheet(wb, mainSheet, 'Reporte Principal');

      // Summary sheet by advisor
      const summaryData = this.getAsesorSummary();
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen por Asesor');

      // Append totals to main sheet
      const totals = [
        { 
          'Institución': 'TOTAL LIBROS',
          'Ciudad': '',
          'Asesor': '',
          'Contrato': '',
          'Fecha Contrato': ''
        },
        { 
          'Institución': 'PRECIO',
          'Ciudad': '',
          'Asesor': '',
          'Contrato': '',
          'Fecha Contrato': ''
        },
        { 
          'Institución': 'VALOR TOTAL',
          'Ciudad': '',
          'Asesor': '',
          'Contrato': '',
          'Fecha Contrato': ''
        }
      ];
      
      this.arrayTotales.forEach((total) => {
        totals[0][total.codigo] = total.cantidad;
        totals[1][total.codigo] = total.precio;
        totals[2][total.codigo] = this.$options.filters.filtrarDecimal(total.total);
      });
      
      XLSX.utils.sheet_add_json(mainSheet, totals, { skipHeader: true, origin: -1 });

      // Write the file
      XLSX.writeFile(wb, `Reporte_${this.asesorSelected.asesor || 'Todos'}_${this.periodo.periodoescolar}.${type}`);
      
      // Restaurar todo después de la exportación
      this.$nextTick(() => {
        // Restaurar el sticky
        fixedColumns.forEach(col => {
          col.style.position = 'sticky';
        });
        
        // Restaurar overflow
        if (tablaParent) {
          tablaParent.style.overflow = originalOverflow;
        }
        
        // Restaurar scroll
        window.scrollTo(scrollPosition.x, scrollPosition.y);
      });
    },
    exportData() {
      try {
        const arrayData = this.tmpArrayReporte.map(p => {
          const { id_pedido, id_asesor, fecha_generacion_contrato, ...rest } = p;
          return rest;
        });
        const data = arrayData[0];
        const valores_headerTitle = Object.keys(data);
        const valores_headerVal = Object.keys(data);
        this.exportTodoCodigos(valores_headerTitle, valores_headerVal, arrayData, this.asesorSelected.asesor || 'Todos');
      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
    },
    exportTodoCodigos(valores_headerTitle, valores_headerVal, arrayDatos, nombreArchivo) {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(valores_headerVal, arrayDatos);
        excel.export_json_to_excel({
          header: valores_headerTitle,
          data,
          filename: nombreArchivo,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat
        });
        this.clearFields();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    clearFields() {
      this.cellAutoWidth = true;
      this.selectedFormat = 'xlsx';
    },
    showError(msg, err = '') {
      this.$vs.notify({
        title: 'Error',
        text: msg,
        color: 'danger',
        iconPack: 'feather',
        icon: 'icon-alert-circle'
      });
      if (err) console.error(err);
    }
  }
};
</script>

<style>
.fixed-column {
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.radio-large {
  width: 20px;
  height: 20px;
  transform: scale(1);
  position: relative;
  top: 2px;
  margin: 5px;
}

.filter-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.datepicker-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.range-separator {
  font-size: 16px;
}

.custom-alert {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  height: auto;
}
</style>