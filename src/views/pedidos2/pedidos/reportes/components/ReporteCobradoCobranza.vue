<template>
  <div>
    <!-- Título -->
    <h1 class="mt-5">Reporte Cobrado Cobranza de {{ nombrePeriodo }}</h1>
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
      <!-- Botones en la misma fila -->
      <div class="flex gap-3 mb-4">
        <!-- Botón para cargar reporte -->
        <vs-button @click="f_getCobros" class="p-2" color="primary" icon="refresh">
          Cargar Reporte
        </vs-button>
        
        <!-- Botón para exportar a Excel -->
        <vs-button @click="exportar" class="p-2" color="success" icon-pack="fa" icon="fa-file-excel">
          Exportar Excel
        </vs-button>
      </div>

      <!-- Cards de totales -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
        <!-- Total Cobros -->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Total Cobros</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            {{ arrayCobros.length }}
          </p>
        </div>
        
        <!-- Total Valor Documentos -->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Total Valor Documentos</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            ${{ formatNumber(totalValorDocumentos) }}
          </p>
        </div>

        <!-- Total Facturas -->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Total Facturas</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            ${{ formatNumber(totalFacturas) }}
          </p>
        </div>

        <!-- Total Notas -->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">Total Notas</h3>
          <p class="text-4xl font-bold text-gray-800 mt-2">
            ${{ formatNumber(totalNotas) }}
          </p>
        </div>
      </div>

      <!-- Tabla -->
      <div v-if="showTable">
        <vs-table max-items="10" stripe search pagination :data="arrayCobros" class="mt-4">
          <template slot="header">
            <vs-chip color="primary">Cantidad: <b>{{ arrayCobros.length }}</b></vs-chip>
          </template>

          <template slot="thead">
            <vs-th>Abono</vs-th>
            <vs-th>Cliente</vs-th>
            <vs-th>Institución</vs-th>
            <vs-th>Concepto</vs-th>
            <vs-th>Valor Documento</vs-th>
            <vs-th>Fechas</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <div><b>ID:</b> {{ tr.abono_id }}</div>
                <div><b>Cuenta N°:</b> {{ tr.cue_pag_numero }}</div>
                <div><b>Cuenta:</b> {{ tr.cue_pag_nombre }}</div>
                <div class="mt-2">
                  <vs-chip 
                    :color="getTipoColor(tr.abono_tipo)" 
                    class="text-xs">
                    {{ tr.tipo_descripcion }}
                  </vs-chip>
                </div>
              </vs-td>
              <vs-td>{{ tr.cliente }}</vs-td>
              <vs-td>
                <span :title="tr.institucion" class="truncate-text">
                  {{ tr.institucion }}
                </span>
              </vs-td>
              <vs-td>
                <span :title="tr.abono_concepto" class="truncate-text">
                  {{ tr.abono_concepto }}
                </span>
              </vs-td>
              <vs-td>{{ tr.valor_documento | filtrarDecimal }}</vs-td>
              <vs-td>
                <div><b>Fecha creación:</b> {{ formatDate(tr.created_at) }} {{ formatTime(tr.created_at) }}</div>
                <div><b>Fecha abono:</b> {{ formatDate(tr.abono_fecha) }}</div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
  </div>
</template>

<script>
import Generalmix from '@/mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
export default {
  mixins: [Codigosmix,Generalmix],
  data() {
    return {
      arrayCobros: [],
      showTable: false,
    };
  },
  props: {
    periodo_id: {
      type: Number,
      default: 0
    },
    nombrePeriodo: {
      type: String,
      default: ""
    }
  },
  computed: {
    // Total de valor documentos
    totalValorDocumentos() {
      return this.arrayCobros.reduce((acc, item) => {
        return acc + (parseFloat(item.valor_documento) || 0);
      }, 0);
    },
    // Total de facturas
    totalFacturas() {
      return this.arrayCobros.reduce((acc, item) => {
        return acc + (parseFloat(item.abono_facturas) || 0);
      }, 0);
    },
    // Total de notas
    totalNotas() {
      return this.arrayCobros.reduce((acc, item) => {
        return acc + (parseFloat(item.abono_notas) || 0);
      }, 0);
    }
  },
//   mounted() {
//     this.f_getCobros();
//   },
  methods: {
    f_getCobros() {
      let me = this;
      this.arrayCobros = [];
      
      if (!this.periodo_id) {
        me.m_message("No hay periodo seleccionado", "danger");
        return;
      }

      me.$vs.loading();
      
      this.$http.get(this.$server_url + `pedidos2/pedidos?getCobroCobranzas=1&periodo_id=${this.periodo_id}`)
        .then(function (res) {
          me.$vs.loading.close();
          
          if (res.data.length === 0) {
            me.m_message("No se encontraron cobros", "warning");
          }
          
          me.arrayCobros = res.data;
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
          me.m_message('Error al cargar datos', 'danger');
        });
    },
    
    formatNumber(valor) {
      return Number(valor).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    
    formatDate(fecha) {
      if (!fecha) return 'N/A';
      const date = new Date(fecha);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    
    formatTime(fecha) {
      if (!fecha) return 'N/A';
      const date = new Date(fecha);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    
    getTipoColor(abono_tipo) {
      const colores = {
        0: 'primary',      // Depósito - Azul
        1: 'success',      // Transferencia - Verde
        2: 'warning',      // Cheque - Amarillo
        3: 'danger',       // Retención - Rojo
        4: 'dark'          // Cruce - Oscuro
      };
      return colores[abono_tipo] || 'primary';
    },
    
    exportar() {
      let me = this;
      
      if (me.arrayCobros.length === 0) {
        me.m_message('No hay datos para exportar', 'warning');
        return;
      }
      
      // Preparar datos para exportar
      let dataExport = me.arrayCobros.map((item) => ({
        abono_id: item.abono_id || '',
        cue_pag_numero: item.cue_pag_numero || '',
        cue_pag_nombre: item.cue_pag_nombre || '',
        cliente: item.cliente || '',
        institucion: item.institucion || '',
        abono_concepto: item.abono_concepto || '',
        tipo_descripcion: item.tipo_descripcion || '',
        valor_documento: item.valor_documento || 0,
        abono_fecha: me.formatDate(item.abono_fecha),
        fecha_creacion: `${me.formatDate(item.created_at)} ${me.formatTime(item.created_at)}`,
      }));
      
      let nameFile = `reporte_cobrado_cobranza_${me.nombrePeriodo}`;
      
      let headers = [
        'ID Abono',
        'Cuenta Pago Número',
        'Cuenta Pago Nombre',
        'Cliente',
        'Institución',
        'Concepto',
        'Tipo',
        'Valor Documento',
        'Fecha Abono',
        'Fecha Creación'
      ];
      
      let fieldKeys = [
        'abono_id',
        'cue_pag_numero',
        'cue_pag_nombre',
        'cliente',
        'institucion',
        'abono_concepto',
        'tipo_descripcion',
        'valor_documento',
        'abono_fecha',
        'fecha_creacion'
      ];
      
      if (typeof me.m_exportTodo === 'function') {
        me.m_exportTodo(headers, fieldKeys, dataExport, nameFile);
      } else if (me.$parent && typeof me.$parent.m_exportTodo === 'function') {
        me.$parent.m_exportTodo(headers, fieldKeys, dataExport, nameFile);
      } else {
        me.$vs.notify({
          text: 'Función de exportación no disponible',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
      }
    }
  }
};
</script>

<style scoped>
.truncate-text {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>