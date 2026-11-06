<template>
  <div>
      <div>
        <div class="flex">
          <vs-chip color="primary">Cantidad: <b> {{ arrayCodigos.length }}</b></vs-chip>
          <vs-button class="ml-5" @click="exportToExcel" color="success" type="filled" icon-pack="feather" icon="icon-download">Exportar Excel</vs-button>
        </div>
        <vs-table max-items="10" stripe search pagination :data="arrayCodigos">
          <template slot="header">

          </template>
          <template slot="thead">
            <vs-th>Código</vs-th>
            <vs-th>Documentos:</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                 <vs-td>
                  <b>Código</b>
                  <p>{{ tr.codigo }}</p>
                  <b>Libro:</b>
                  <p>{{ tr.nombrelibro }}</p>
                  <b>Código Liquidación:</b>
                  <p>{{ tr.pro_codigo }}</p>
                  <b v-if="tr.combo">Combo:</b>
                  <p v-if="tr.combo">{{ tr.combo }}</p>
                  <b v-if="tr.codigo_combo">Combo Etiqueta:</b>
                  <p v-if="tr.codigo_combo">{{ tr.codigo_combo }}</p>
                  <b v-if="tr.codigo_paquete">Paquete:</b>
                  <p v-if="tr.codigo_paquete">{{ tr.codigo_paquete }}</p>
                 </vs-td>
                 <vs-td>
                  <b>Factura:</b>
                  <p>{{ tr.factura }}</p>
                  <b>Documento:</b>
                  <p>{{ tr.documento }}</p>
                  <b>Empresa Documento:</b>
                  <p>{{ tr.descripcion_empresa }}</p>
                  <b>Estado en Documento de devolución:</b>
                  <p>{{ tr.estadoCodigoDoc }}</p>
                 </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
  </div>
</template>
<script>
import { export_json_to_excel } from '@/vendor/Export2Excel'
  const TableReutilizableVue                = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
  components: {
    TableReutilizableVue,
  },
  data () {
    return {
      arrayCodigos:[],
    }
  },
  props:{
    ObjectSelected:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  created(){

  },
  mounted() {
    let me = this
    me.getCodigos()
  },

  methods: {
    async getCodigos(){
      let me = this
      me.arrayCodigos = []
      try {
          const url = `devoluciones?getCodigosDevolucionTodos=1&idDevolucion=${me.ObjectSelected.id}`;
          me.$vs.loading({color: 'primary',height: '6px'})
          const response = await me.$http.get(this.$server_url + url);
          me.$vs.loading.close()
          me.arrayCodigos = response.data;
          //filtrar la propiedad codigo si es null no mostrarla quitar los elementos con codigo null
          me.arrayCodigos = me.arrayCodigos.filter(item => item.codigo != null);
      } catch (e) {
          console.error("Error fetching codes:", e);
      }
    },
    exportToExcel(){
      let me = this
      const header = [
        'Código',
        'Libro',
        'Código Liquidación',
        'Combo',
        'Combo Etiqueta',
        'Paquete',
        'Factura',
        'Documento',
        'Empresa Documento',
        'Estado en Documento de devolución'
      ]
      const data = me.arrayCodigos.map(item => [
        item.codigo || '',
        item.nombrelibro || '',
        item.pro_codigo || '',
        item.combo || '',
        item.codigo_combo || '',
        item.codigo_paquete || '',
        item.factura || '',
        item.documento || '',
        item.descripcion_empresa || '',
        item.estadoCodigoDoc || ''
      ])
      export_json_to_excel({
        header: header,
        data: data,
        filename: `Codigos_Devolucion_${me.ObjectSelected.id}_${new Date().getTime()}`,
        autoWidth: true,
        bookType: 'xlsx'
      })
    }
  }
}
</script>
