<template>
  <div class="mt-5">
    <!-- Header con información de verificación -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fa-solid fa-clipboard-check text-blue-600"></i>
            Verificación {{ sendVerificacion.num_verificacion }}
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            <i class="fa-solid fa-calendar-days"></i>
            Fecha de verificación: <span class="font-semibold">{{ sendVerificacion.fecha_fin }}</span>
          </p>
        </div>
      </div>
    </div>

    <vs-alert class="mt-3" color="warning">
      <template #icon>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </template>
      <p class="text-center">
        Aquí están todos los códigos individuales que fueron liquidados en la
        <b>verificación {{ sendVerificacion.num_verificacion }}</b>
      </p>
    </vs-alert>

    <!-- Filtros por estado con diseño mejorado -->
    <div style="background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; padding: 20px; margin-top: 20px; border: 1px solid #e5e7eb;">
      <div class="flex items-center mb-4">
        <div style="background-color: #dbeafe; border-radius: 8px; padding: 8px; margin-right: 12px;">
          <i class="fa-solid fa-filter text-blue-600 text-lg"></i>
        </div>
        <h3 style="font-weight: bold; color: #1f2937; font-size: 1.125rem;">Filtrar por estado</h3>
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
          @click="filtroEstado = 'en_verificacion'"
          :style="filtroEstado === 'en_verificacion' ? 'border: 2px solid #10b981; background-color: #f0fdf4;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverVerif = true"
          @mouseleave="hoverVerif = false"
          :class="{'shadow-md': hoverVerif || filtroEstado === 'en_verificacion'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="en_verificacion" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-check text-green-600 mr-2"></i>
                En verificación
              </span>
              <span class="ml-2" style="background-color: #10b981; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadEnVerificacion }}
              </span>
            </div>
          </vs-radio>
        </div>

        <div
          @click="filtroEstado = 'no_verificacion'"
          :style="filtroEstado === 'no_verificacion' ? 'border: 2px solid #ef4444; background-color: #fef2f2;' : 'border: 2px solid #e5e7eb;'"
          style="border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;"
          @mouseenter="hoverNoVerif = true"
          @mouseleave="hoverNoVerif = false"
          :class="{'shadow-md': hoverNoVerif || filtroEstado === 'no_verificacion'}"
        >
          <vs-radio v-model="filtroEstado" vs-name="filtroEstado" vs-value="no_verificacion" class="w-full">
            <div class="flex items-center justify-between w-full">
              <span style="font-weight: 500; color: #374151;">
                <i class="fa-solid fa-x text-red-600 mr-2"></i>
                No en verificación
              </span>
              <span class="ml-2" style="background-color: #ef4444; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px;">
                {{ cantidadNoVerificacion }}
              </span>
            </div>
          </vs-radio>
        </div>
      </div>
    </div>

    <!-- Botones de acción con mejor diseño -->
    <div class="flex flex-wrap gap-3 mt-5">
      <vs-button
        class="px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
        @click="f_getData"
        color="primary"
      >
        <i class="fa-solid fa-arrow-rotate-right mr-2"></i>
        Recargar datos
      </vs-button>
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
            Combo/Paquete
          </vs-th>
          <vs-th class="font-bold">
            <i class="fa-solid fa-circle-check mr-1"></i>
            Estado
          </vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" class="hover:bg-gray-50">
            <vs-td>
              <div class="py-2">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Código</span>
                  <p class="text-sm font-medium text-gray-900">{{ tr.codigo }}</p>
                </div>
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Nombre</span>
                  <p class="text-sm text-gray-800">{{ tr.nombrelibro }}</p>
                </div>
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Código liquidación</span>
                  <p class="text-sm text-gray-800">{{ tr.codigo_liquidacion }}</p>
                </div>
                <div v-if="tr.plus == 1" class="mb-2">
                  <span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-sm">
                    <i class="fa-solid fa-star mr-1"></i>
                    Plus
                  </span>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Liquidado como</span>
                  <p class="text-sm">
                    <span :class="tr.estado_liquidacion == 1 ? 'text-blue-700 font-semibold' : 'text-purple-700 font-semibold'">
                      {{ tr.estado_liquidacion == 1 ? 'Liquidado' : 'Regalado' }}
                    </span>
                  </p>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div class="py-2">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Documento de venta</span>
                  <p class="text-sm text-gray-800">{{ tr.documento_venta || 'No tiene' }}</p>
                </div>
                <div>
                  <span class="text-xs font-semibold text-gray-500 uppercase">Empresa</span>
                  <p class="text-sm text-gray-800">{{ tr.empresa_documento_descr || 'No tiene' }}</p>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <div class="py-2">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase">Paquete</span>
                  <p class="text-sm text-gray-800">{{ tr.codigo_paquete || 'No tiene' }}</p>
                </div>
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
                <div
                  v-if="tr.existe_en_codigoslibros == 1"
                  class="text-success inline-flex items-center px-3 py-2 bg-green-100 border border-green-300 text-green-800 rounded-lg font-semibold text-sm"
                >
                  <i class="fa-solid fa-check-circle mr-2"></i>
                  Aún en verificación
                </div>
                <div
                  v-if="tr.existe_en_codigoslibros == 0"
                  class="text-danger inline-flex items-center px-3 py-2 bg-red-100 border border-red-300 text-red-800 rounded-lg font-semibold text-sm"
                >
                  <i class="fa-solid fa-times-circle mr-2"></i>
                  No está en verificación
                </div>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
import Generalmix from '../../mixins/Generalmix';
import * as XLSX from 'xlsx';

export default {
  mixins: [Generalmix],
  data() {
    return {
      arrayData: [],
      filtroEstado: 'todos',
      hoverTodos: false,
      hoverVerif: false,
      hoverNoVerif: false
    }
  },
  props: {
    sendVerificacion: {
      type: Object,
      required: true
    },
  },
  computed: {
    dataFiltrada() {
      if (this.filtroEstado === 'todos') {
        return this.arrayData;
      } else if (this.filtroEstado === 'en_verificacion') {
        return this.arrayData.filter(item => item.existe_en_codigoslibros == 1);
      } else if (this.filtroEstado === 'no_verificacion') {
        return this.arrayData.filter(item => item.existe_en_codigoslibros == 0);
      }
      return this.arrayData;
    },
    cantidadTodos() {
      return this.arrayData.length;
    },
    cantidadEnVerificacion() {
      return this.arrayData.filter(item => item.existe_en_codigoslibros == 1).length;
    },
    cantidadNoVerificacion() {
      return this.arrayData.filter(item => item.existe_en_codigoslibros == 0).length;
    }
  },
  mounted() {
    this.f_getData();
  },
  methods: {
    f_getData() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + `metodosGetVerificaciones?getVerificacionesHistorico=1&contrato=${me.sendVerificacion.contrato}&verificacion_id=${me.sendVerificacion.id}`)
        .then(function (res) {
          me.arrayData = res.data;
          if (me.arrayData.length == 0) {
            me.m_message('No se encontraron códigos individuales liquidados en esta verificación', 'warning');
          }
          me.$vs.loading.close();
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
          me.m_message('Error al obtener los códigos individuales', 'error');
        });
    },
    exportarExcel() {
      try {
        const datosExcel = this.dataFiltrada.map(item => ({
          'codigo': item.codigo,
          'Nombre Libro': item.nombrelibro,
          'Código Liquidación': item.codigo_liquidacion,
          'Plus': item.plus == 1 ? 'Sí' : 'No',
          'Liquidado como código': item.estado_liquidacion == 1 ? 'Liquidado' : 'Regalado',
          'Documento Venta': item.documento_venta || 'No tiene',
          'Empresa Documento': item.empresa_documento_descr || 'No tiene',
          'Paquete': item.codigo_paquete || 'No tiene',
          'Combo': item.combo || 'No tiene',
          'Combo Etiqueta': item.codigo_combo || 'No tiene',
          'Estado en Verificación': item.existe_en_codigoslibros == 1 ? 'Aún en verificación' : 'No está en verificación'
        }));

        const ws = XLSX.utils.json_to_sheet(datosExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Códigos');

        const nombreArchivo = `Verificacion_${this.sendVerificacion.num_verificacion}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

        this.m_message('Archivo Excel generado exitosamente', 'success');
      } catch (error) {
        console.error('Error al exportar:', error);
        this.m_message('Error al generar el archivo Excel', 'error');
      }
    }
  }
}
</script>
