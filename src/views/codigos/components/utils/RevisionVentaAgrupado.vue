<template>
  <div>
    <vs-table max-items="20" search pagination :data="groupedData">
        <template slot="header">
          <vs-chip  color="primary">Cantidad: <b> {{ groupedData.length }}</b></vs-chip>
          <vs-chip  color="success" class="ml-2">Total códigos: <b> {{ sumaTotal }}</b></vs-chip>
          <span @click="exportToExcel()" class="bg-warning ml-3" style="color:white; padding:10px;border-radius:10px;cursor: pointer;" >
            <i class="fa-solid fa-print"></i>
            Exportar

          </span>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th>Venta directa </vs-th>
            <vs-th>Venta lista</vs-th>
            <vs-th>Total</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{data[indextr].libro}} | {{  tr.codigo_liquidacion }}<br>
            </vs-td>
            <vs-td>
              {{ tr.ventaDirecta }}
            </vs-td>
            <vs-td>
              {{ tr.ventaLista }}
            </vs-td>
            <vs-td>
              {{data[indextr].cantidad}}<br>
            </vs-td>
          </vs-tr>
        </template>
    </vs-table>
  </div>
</template>
<script>

export default{
  data(){
    return{
      //VARIABLES PARA EXPORTAR A EXCEL
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      fileName:'',
      selectedFormat: 'xlsx',
      cellAutoWidth: true,
      activePrompt: false,
      //FIN VARIABLES PARA EXPORTAR A EXCEL
    }
  },
  computed:{
    sumaTotal(){
      let me = this;
      if(me.groupedData.length >0){
        let datos = me.groupedData.filter(p => p.cantidad)
        let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
        return total
      }
    },
  },
  // watch:{
  //   groupedData(results){
  //     let me = this
  //     me.groupedData = results
  //     me.ordenar()
  //   }
  // },
  props:{
    groupedData:{
      type:Array,
      default:[]
    },
    pedido:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  mounted(){
    let me = this
    me.ordenar()
    me.fileName = 'Reporte de codigos agrupados_' + me.pedido.nombreInstitucion+'_'+me.pedido.periodo
  },
  methods:{
    ordenar(){
      let me = this;
      if(me.groupedData.length > 0)
      this.groupedData.sort((a, b) => {
          if (a.libro < b.libro) {
            return -1;
          }
          if (a.libro > b.libro) {
            return 1;
          }
          return 0;
        });
    },
    //para limipiar los campos del excel
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    //metodo par descargar el excel
    exportToExcel() {
      let headerTitle = ['Libro','Venta directa','Venta lista','Cantidad Total'];
      let headerVal = [ 'libro','ventaDirecta','ventaLista','cantidad'];
      let codigoSelectedMayus = this.groupedData
      for (var i = 0; i < codigoSelectedMayus.length; i++) {
        for (var key in codigoSelectedMayus[i]) {
            if (typeof codigoSelectedMayus[i][key] == "string") {
                codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
            }
        }
    }
    import('@/vendor/Export2Excel').then(excel => {
        const list = codigoSelectedMayus
        const data = this.formatJson(headerVal, list)
        excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileName,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
        })
        this.clearFields()
      })
    },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
      },
  }
}
</script>
