
import Vue from 'vue'
import axios from 'axios'
export default {
  data(){
      return{
      myVariable:10,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      fileName:null,
      selectedFormat: 'xlsx',
      cellAutoWidth: true,
      }
  },
  methods: {
    //historico hospital
    limpiarCache(){
      let me = this;
      this.$http.get(this.$server_url+'limpiarCache')
        .then(res => {
        })
        .catch(function(e){
          console.log(e)
        })
    },
    m_exportTodo(valores_headerTitle, valores_headerVal, arrayDatos, nombreArchivo, totales = [], columnWidths = null) {
      let headerTitle = [...valores_headerTitle];
      let headerVal = [...valores_headerVal];
      import('@/vendor/Export2Excel').then(excel => {
        let datos = [...arrayDatos];
        
        // Calcular totales si se especificaron columnas en totales
        let totalRow = {};
        if (totales.length > 0) {
          headerVal.forEach(key => {
            if (totales.includes(key)) {
              // Sumar los valores numéricos de la columna
              totalRow[key] = datos.reduce((sum, row) => {
                const value = parseFloat(row[key]) || 0;
                return sum + value;
              }, 0);
            } else {
              // Para columnas sin total, usar un string vacío o 'Total' en la primera columna
              totalRow[key] = key === headerVal[0] ? 'TOTALES' : '';
            }
          });
          // Agregar la fila de totales al final de los datos
          datos.push(totalRow);
        }

        const data = this.formatJson(headerVal, datos);
        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: nombreArchivo,
          autoWidth: columnWidths ? false : this.cellAutoWidth,
          columnWidths,
          bookType: this.selectedFormat
        });
        this.clearFields();
      });
    },
    m_ExportToDoc(fileName) {
      let me = this;
      let filename = fileName ;

      // Mostrar notificación inmediatamente al iniciar la acción
      this.$vs.notify({
        text: '¡Esperando... la descarga se ha iniciado!',
        color: 'info',
        iconPack: 'feather',
        icon: 'icon-clock'
      });

      // Usamos $nextTick para asegurarnos de que el DOM esté listo
      this.$nextTick(() => {
        var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var EndHtml = "</body></html>";
        // Completar el contenido con el HTML del elemento #MainHTML
        var html = HtmlHead + document.getElementById("MainHTML").innerHTML + EndHtml;
        // Crear el Blob
        var blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        filename = filename ? filename + '.doc' : 'documento.doc';

        // Crear el enlace para descargar el archivo
        var downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);

        new Promise((resolve, reject) => {
          if (navigator.msSaveOrOpenBlob) {
            // Para IE/Edge
            navigator.msSaveOrOpenBlob(blob, filename);
            resolve();
          } else {
            // Para otros navegadores
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.click();
            resolve();
          }
        })
        .then(() => {
          // Cerrar el loading y mostrar éxito
          this.$vs.loading.close()
          this.$vs.notify({
            text: 'La descarga se ha iniciado correctamente.',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
          this.$emit('changeSuccess', true);
        })
        .catch((error) => {
          // En caso de error
          me.$vs.loading.close()
          this.$vs.notify({
            text: 'Hubo un error al intentar descargar el archivo.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-x'
          });
          this.$emit('changeSuccess', false);
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xlsx'
    },
  },
};
