<template>
  <div>
    <div class="header">
      <span style="font-weight:bold;font-size: 20px;color:red;">Codigos que no se pudieron devolver</span>
    </div>
    <vs-table multiple v-model="codigoSelectedLocal" stripe pagination max-items="25" search :data="codigosConLiquidacion">
      <template slot="header" class="flex">
        <p>Cantidad: {{ codigosConLiquidacion.length }}</p>
        <vs-button color="warning" size="small" class="mt-3 ml-3" style="font-size: 16px;" @click="$emit('exportar')">Exportar</vs-button>
      </template>
      <template slot="thead">
        <vs-th sort-key="codigo">Código</vs-th>
        <vs-th sort-key="estudiante">Informacion</vs-th>
        <vs-th sort-key="estudiante">Mensaje</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].codigo">{{ tr.codigo }}</vs-td>
          <vs-td :data="data[indextr].barrasEstado">
            <p style="font-weight:bold;">institucion:</p>
            <span>{{tr.institucionBarra}}</span>
            <p style="font-weight:bold;">periodo:</p>
            <span>{{tr.periodo_barras}}</span>
            <p>
              <vs-chip color="success" v-if="tr.estado_liquidacion == '1'">Por liquidarse</vs-chip>
              <vs-chip color="warning" v-else-if="tr.estado_liquidacion == '2'">Regalado</vs-chip>
              <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '0'">Liquidado</vs-chip>
              <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '3'">DEVUELTO</vs-chip>
            </p>
          </vs-td>
          <vs-td>{{ tr.mensaje }}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
export default {
  name: 'DevolucionBodegaInformacion',
  props: {
    codigosConLiquidacion: {
      type: Array,
      required: true
    },
    codigoSelected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      codigoSelectedLocal: this.codigoSelected
    };
  },
  watch: {
    codigoSelectedLocal(newVal) {
      this.$emit('update:codigoSelected', newVal);
    },
    codigoSelected(newVal) {
      this.codigoSelectedLocal = newVal;
    }
  }
};
</script>
