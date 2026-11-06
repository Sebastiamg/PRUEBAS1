<template>
  <div>
    <vs-table max-items="10" search pagination :data="arregloStorage">
      <template slot="header">
          <vs-chip  color="primary">Cantidad: <b> {{ arregloStorage.length }}</b></vs-chip>
          <p @click="exportToExcel()" class="ml-2 cursor-pointer"><vs-chip color="success" transparent><ion-icon name="download-outline" style="font-size: 20px;position: relative;top:-3px;"></ion-icon> Exportar</vs-chip></p>
      </template>
      <template slot="thead">
        <vs-th>Libro</vs-th>
        <vs-th>Código</vs-th>
        <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{data[indextr].codigo}}<br>
          </vs-td>
          <vs-td>
            {{data[indextr].libro}}<br>
          </vs-td>
          <vs-td>
            <vx-tooltip style="display:inline-block" color="warning" text="Eliminar del storage">
              <vs-button color="warning" type="line" radius icon-pack="feather" icon="icon-x" @click="$emit('changeDeleteStorage',tr)" size="large"></vs-button>
            </vx-tooltip>
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
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
    }
  },
  props:{
    arregloStorage:{
      type:Array,
      default:[]
    }
  },
  methods:{
    //para limipiar los campos del excel
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    //metodo par descargar el excel
    exportToExcel() {
      let headerTitle = ['Código','Libro'];
      let headerVal = ['codigo','libro'];
      let codigoSelectedMayus = this.arregloStorage
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
          filename: 'ArchivoCodigos',
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
