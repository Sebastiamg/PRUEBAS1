<template>
  <div>
    <vs-table max-items="10" search pagination :data="arrayCombos">
      <template slot="header">
          <vs-chip  color="primary">Cantidad: <b> {{ arrayCombos.length }}</b></vs-chip>
      </template>
      <template slot="thead">
          <vs-th>Combo</vs-th>
          <vs-th>Problema</vs-th>
      </template>
      <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                  {{data[indextr].codigo}}<br>
              </vs-td>
              <vs-td>
                  {{data[indextr].problema}}<br>
              </vs-td>
          </vs-tr>
      </template>
  </vs-table>
  <vs-button color="success" type="filled" @click="exportExcel">Exportar a Excel</vs-button>
  </div>
</template>

<script>
import { export_json_to_excel } from '@/vendor/Export2Excel'

export default {
  data() {
    return {};
  },
  props: {
    arrayCombos: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  methods: {
    exportExcel() {
      const header = ['Combo', 'Problema'];
      const data = this.arrayCombos.map(item => [item.codigo, item.problema]);
      export_json_to_excel({
        header,
        data,
        filename: 'Combos',
      });
    }
  }
};
</script>

