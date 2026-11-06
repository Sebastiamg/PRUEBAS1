<template>
  <div>
    <p class="mt-1"></p>
    <b class="mt-5" style="position: relative;top:8px;">{{ title }}</b>
    <vs-table :data="tableData" stripe pagination :max-items="maxItems" search no-data-text="No hay datos disponibles">
      <template slot="header">
        <vs-chip color="primary" class="mr-2">Cantidad {{ tableData.length }}</vs-chip>
        <vs-button color="success" v-if="ifexportar == 1" class="mb-2 p-3 ml-3" @click="exportar"><i class="fa-solid fa-download"></i> Exportar</vs-button>
      </template>
      <template slot="thead">
        <vs-th v-for="(header, index) in headers" :key="index" :sort-key="fieldKeys[index]">
          {{ header }}
        </vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <vs-td v-for="(key, index) in fieldKeys" :key="index">
            {{ row[key] }}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import Codigosmix from "@/mixins/Codigosmix";
export default {
  mixins: [Codigosmix],
  props: {
    title: {
      type: String,
      required: true
    },
    ifexportar: {
      type: Number,
      default: 0
    },
    nombrearchivo: {
      type: String,
      default: 'Reporte'
    },
    headers: {
      type: Array,
      required: true
    },
    fieldKeys: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    maxItems: {
      type: Number,
      default: 10
    },
    totales: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    exportar() {
      let me = this;
      me.m_exportTodo(me.headers, me.fieldKeys, me.tableData, me.nombrearchivo, me.totales);


      // Emitir evento hacia el padre
      this.$emit('reporte-exportado', {
        nombre: me.nombrearchivo,
        data: me.tableData
      });
    }
  }
}
</script>

<style scoped>
/* Agrega estilos si es necesario */
</style>
