<template>
  <div>
    <!-- TABS PARA CÓDIGOS INDIVIDUALES Y DETALLE DE VENTA -->
    <vs-tabs :color="'#5b3cc4'" class="mb-4">
      <vs-tab label="Códigos Individuales" icon-pack="feather" icon="icon-list" @click="activeTab = 0">
      </vs-tab>
      <vs-tab label="Detalle de Venta" icon-pack="feather" icon="icon-shopping-bag" @click="activeTab = 1">
      </vs-tab>
    </vs-tabs>

    <!-- TAB 0: CÓDIGOS INDIVIDUALES -->
    <div v-if="activeTab === 0">
    <!-- Filtros por estado con diseño mejorado -->
    <div style="background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; padding: 20px; margin-top: 20px; border: 1px solid #e5e7eb;">
      <div class="flex items-center mb-4">
        <div style="background-color: #dbeafe; border-radius: 8px; padding: 8px; margin-right: 12px;">
          <i class="fa-solid fa-filter text-blue-600 text-lg"></i>
        </div>
        <h3 style="font-weight: bold; color: #1f2937; font-size: 1.125rem;">Filtrar por estado de liquidación</h3>
      </div>

      <div class="flex flex-wrap" style="gap: 12px;">
        <div
          @click="filtroEstado = 'todos'"
          :style="filtroEstado === 'todos' ? 'border: 2px solid #3b82f6; background-color: #eff6ff;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverTodos = true"
          @mouseleave="hoverTodos = false"
          :class="{'shadow-md': hoverTodos || filtroEstado === 'todos'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="todos" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-list mr-2"></i>
                Todos
              </span>
              <span class="ml-2" style="background-color: #4b5563; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadTodos }}
              </span>
            </div>
          </vs-radio>
        </div>

        <div
          @click="filtroEstado = 'normal'"
          :style="filtroEstado === 'normal' ? 'border: 2px solid #10b981; background-color: #f0fdf4;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverNormal = true"
          @mouseleave="hoverNormal = false"
          :class="{'shadow-md': hoverNormal || filtroEstado === 'normal'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="normal" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-check-circle text-green-600 mr-2"></i>
                Liquidados
              </span>
              <span class="ml-2" style="background-color: #10b981; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadNormal }}
              </span>
            </div>
          </vs-radio>
        </div>

        <div
          @click="filtroEstado = 'regalado'"
          :style="filtroEstado === 'regalado' ? 'border: 2px solid #f59e0b; background-color: #fffbeb;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverRegalado = true"
          @mouseleave="hoverRegalado = false"
          :class="{'shadow-md': hoverRegalado || filtroEstado === 'regalado'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="regalado" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-gift text-orange-600 mr-2"></i>
                Liquidado Regalado
              </span>
              <span class="ml-2" style="background-color: #f59e0b; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadRegalado }}
              </span>
            </div>
          </vs-radio>
        </div>

        <div
        v-if="cantidadOtro > 0"
          @click="filtroEstado = 'otro'"
          :style="filtroEstado === 'otro' ? 'border: 2px solid #ef4444; background-color: #fef2f2;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverOtro = true"
          @mouseleave="hoverOtro = false"
          :class="{'shadow-md': hoverOtro || filtroEstado === 'otro'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="otro" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-times-circle text-red-600 mr-2"></i>
                Otro
              </span>
              <span class="ml-2" style="background-color: #ef4444; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadOtro }}
              </span>
            </div>
          </vs-radio>
        </div>

        <div
          @click="filtroEstado = 'combos'"
          :style="filtroEstado === 'combos' ? 'border: 2px solid #8b5cf6; background-color: #f5f3ff;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverCombos = true"
          @mouseleave="hoverCombos = false"
          :class="{'shadow-md': hoverCombos || filtroEstado === 'combos'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="combos" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-boxes-stacked text-purple-600 mr-2"></i>
                Solo combos
              </span>
              <span class="ml-2" style="background-color: #8b5cf6; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadCombos }}
              </span>
            </div>
          </vs-radio>
        </div>

        <div
          @click="filtroEstado = 'individuales'"
          :style="filtroEstado === 'individuales' ? 'border: 2px solid #06b6d4; background-color: #ecfeff;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverIndividuales = true"
          @mouseleave="hoverIndividuales = false"
          :class="{'shadow-md': hoverIndividuales || filtroEstado === 'individuales'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="individuales" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-book text-cyan-600 mr-2"></i>
                Sin combos
              </span>
              <span class="ml-2" style="background-color: #06b6d4; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadIndividuales }}
              </span>
            </div>
          </vs-radio>
        </div>
      </div>
    </div>

    <!-- Botón de exportar -->
    <div class="flex flex-wrap gap-3 mt-5">
      <vs-button
        class="px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
        @click="exportarExcel"
        color="success"
      >
        <i class="fa-solid fa-file-excel mr-2"></i>
        Exportar a Excel
      </vs-button>
    </div>

    <!-- Tabla de datos con estilo mejorado -->
    <div class="mt-5 bg-white rounded-xl shadow-md overflow-hidden">
      <vs-table max-items="10" stripe search pagination :data="dataFiltrada">
        <template slot="header">
          <div class="flex items-center gap-2 p-2">
            <vs-chip color="primary" class="font-semibold">
              <i class="fa-solid fa-list mr-1"></i>
              Registros: <b>{{ dataFiltrada.length }}</b>
            </vs-chip>
          </div>
        </template>
        <template slot="thead">
          <vs-th class="font-bold">
            <i class="fa-solid fa-book mr-1"></i>
            Libro
          </vs-th>
          <vs-th class="font-bold">
            <i class="fa-solid fa-file-invoice mr-1"></i>
            Documento
          </vs-th>
          <vs-th class="font-bold">
            <i class="fa-solid fa-box mr-1"></i>
            Combo
          </vs-th>
          <vs-th class="font-bold">
            <i class="fa-solid fa-building mr-1"></i>
            Instituciones
          </vs-th>
          <vs-th class="font-bold">
            <i class="fa-solid fa-circle-check mr-1"></i>
            Estado en verificación
          </vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="hover:bg-gray-50">
            <vs-td>
              <div class="py-2">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Código</span>
                  <p class="text-sm font-medium text-gray-900">{{ tr.codigo_libro }}</p>
                </div>
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Nombre</span>
                  <p class="text-sm text-gray-800">{{ tr.nombre_libro }}</p>
                </div>
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Código liquidación</span>
                  <p class="text-sm text-gray-800">{{ tr.codigo }}</p>
                </div>
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Tipo de venta</span>
                  <p class="text-sm text-gray-800">{{ tr.tipo_venta == 2 ? 'Venta lista' : 'Venta directa' }}</p>
                </div>
                <div v-if="tr.plus == 1" class="mb-2">
                  <span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-sm">
                    <i class="fa-solid fa-star mr-1"></i>
                    Plus
                  </span>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div class="py-2">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Documento de venta</span>
                  <p class="text-sm text-gray-800">{{ tr.codigo_proforma || 'No tiene' }}</p>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Empresa</span>
                  <p class="text-sm text-gray-800">{{ tr.descripcion_empresa || 'No tiene' }}</p>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div class="py-2">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Combo</span>
                  <p class="text-sm text-gray-800">{{ tr.combo || 'No tiene' }}</p>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Combo Etiqueta</span>
                  <p class="text-sm text-gray-800">{{ tr.codigo_combo || 'No tiene' }}</p>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div class="py-2">
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Institución que se liquido</span>
                  <p class="text-sm text-gray-800">{{ tr.nombre_institucion_bc || 'No tiene' }}</p>
                </div>
              </div>
              <div class="py-2">
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Institucion despacho (venta_lista_institucion)</span>
                  <p class="text-sm text-gray-800">{{ tr.nombre_institucion_venta || 'No tiene' }}</p>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div class="py-2">
                <div
                  v-if="tr.estado_liquidacion == 2"
                  class="text-warning inline-flex items-center px-3 py-2 bg-green-100 border border-green-300 text-green-800 rounded-lg font-semibold text-sm"
                >
                  <i class="fa-solid fa-gift mr-2"></i>
                  Codigo liquidado como regalado
                </div>
                <div
                  v-else-if="tr.estado_liquidacion == 0"
                  class="text-success inline-flex items-center px-3 py-2 bg-red-100 border border-red-300 text-red-800 rounded-lg font-semibold text-sm"
                >
                  <i class="fa-solid fa-check-circle mr-2"></i>
                  Codigo liquidado
                </div>
                <div
                  v-else
                  class="text-danger inline-flex items-center px-3 py-2 bg-red-100 border border-red-300 text-red-800 rounded-lg font-semibold text-sm"
                >
                  <i class="fa-solid fa-times-circle mr-2"></i>
                  otro
                </div>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    </div>

    <!-- TAB 1: DETALLE DE VENTA -->
    <div v-if="activeTab === 1">
      <RevisionVentaVue
        :pedido="pedidoData"
        :showAgrupado="'1'"
      />
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import Generalmix from '../../../mixins/Generalmix';
const RevisionVentaVue = () => import('@/views/codigos/components/utils/RevisionVenta.vue');

export default {
  mixins: [Generalmix],
  components: {
    RevisionVentaVue
  },
  data() {
    return {
      arrayData: [],
      filtroEstado: 'todos',
      hoverTodos: false,
      hoverNormal: false,
      hoverRegalado: false,
      hoverOtro: false,
      hoverCombos: false,
      hoverIndividuales: false,
      activeTab: 0
    }
  },
  props: {
    arrayTodo: {
      type: Array,
      default: () => []
    },
    VerificacionSelect: {
      type: Object,
      default: function() {
        return {}
      }
    },
    institucionData: {
      type: Object,
      default: function() {
        return {
          nombreInstitucion: '',
          idInstitucion: null,
          periodoDescripcion: '',
          periodo_id: null
        }
      }
    }
  },
  computed: {
    pedidoData() {
      return {
        nombreInstitucion: this.institucionData.nombreInstitucion || '',
        idInstitucion: this.institucionData.idInstitucion || null,
        periodo: this.institucionData.periodoDescripcion || '',
        periodo_id: this.institucionData.periodo_id || null
      };
    },
    dataFiltrada() {
      if (this.filtroEstado === 'todos') {
        return this.arrayData;
      } else if (this.filtroEstado === 'normal') {
        return this.arrayData.filter(item => item.estado_liquidacion == 0);
      } else if (this.filtroEstado === 'regalado') {
        return this.arrayData.filter(item => item.estado_liquidacion == 2);
      } else if (this.filtroEstado === 'otro') {
        return this.arrayData.filter(item => item.estado_liquidacion != 0 && item.estado_liquidacion != 2);
      } else if (this.filtroEstado === 'combos') {
        return this.arrayData.filter(item => item.combo && item.combo !== 'No tiene');
      } else if (this.filtroEstado === 'individuales') {
        return this.arrayData.filter(item => !item.combo || item.combo === 'No tiene');
      }
      return this.arrayData;
    },
    cantidadTodos() {
      return this.arrayData.length;
    },
    cantidadNormal() {
      return this.arrayData.filter(item => item.estado_liquidacion == 0).length;
    },
    cantidadRegalado() {
      return this.arrayData.filter(item => item.estado_liquidacion == 2).length;
    },
    cantidadOtro() {
      return this.arrayData.filter(item => item.estado_liquidacion != 0 && item.estado_liquidacion != 2).length;
    },
    cantidadCombos() {
      return this.arrayData.filter(item => item.combo && item.combo !== 'No tiene').length;
    },
    cantidadIndividuales() {
      return this.arrayData.filter(item => !item.combo || item.combo === 'No tiene').length;
    }
  },
  mounted() {
    let me = this
    me.f_setearCampos()
  },
  methods: {
    f_setearCampos() {
      let me = this
      me.arrayData = JSON.parse(JSON.stringify(me.arrayTodo))
    },
    exportarExcel() {
      try {
        const datosExcel = this.dataFiltrada.map(item => ({
          'codigo': item.codigo_libro,
          'Nombre Libro': item.nombre_libro,
          'Código Liquidación': item.codigo,
          'Tipo de Venta': item.tipo_venta == 2 ? 'Venta lista' : 'Venta directa',
          'Plus': item.plus == 1 ? 'Sí' : 'No',
          'Documento de Venta': item.codigo_proforma || 'No tiene',
          'Empresa': item.descripcion_empresa || 'No tiene',
          'Combo': item.combo || 'No tiene',
          'Combo Etiqueta': item.codigo_combo || 'No tiene',
          'Institución que se liquidó': item.nombre_institucion_bc || 'No tiene',
          'Institución despacho (venta_lista_institucion)': item.nombre_institucion_venta || 'No tiene',
          'Liquidado como': item.estado_liquidacion == 0 ? 'Liquidado' : item.estado_liquidacion == 2 ? 'Regalado' : 'Otro'
        }));

        const ws = XLSX.utils.json_to_sheet(datosExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Códigos Liquidados');

        const nombreArchivo = `Codigos_Liquidados_${this.VerificacionSelect.contrato}_verificacion_${this.VerificacionSelect.num_verificacion}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

        this.m_message('Archivo Excel generado exitosamente', 'success');

        this.$vs.notification({
          title: 'Éxito',
          text: 'Archivo Excel generado exitosamente',
          color: 'success'
        });
      } catch (error) {
        console.error('Error al exportar:', error);

        this.m_message('Error al generar el archivo Excel', 'error');

        this.$vs.notification({
          title: 'Error',
          text: 'Error al generar el archivo Excel',
          color: 'danger'
        });
      }
    }
  }
}
</script>
