<template>
  <div>
    <b>Detalle del combo:</b>
    <p>{{ ObjectedSelectedCombo.nombrelibro }} || <b> código:</b> {{ ObjectedSelectedCombo.pro_codigo }}</p>
    <b>Libros del combo:</b>
    <p>{{ ObjectedSelectedCombo.codigos_combos }}</p>
    <b>Documento</b>
    <p>{{ ObjectedSelectedCombo.documento }}</p>
    <b>Empresa:</b>
    <p>{{ ObjectedSelectedCombo.empresa }}</p>
    <br>
    <!-- Botones de exportar/importar -->
    <div class="mb-4">
      <vs-button
        @click="exportarExcel"
        color="success"
        type="filled"
        class="mr-2">
       <i class="fa-solid fa-download"></i> Exportar Excel
      </vs-button>
    </div>

    <vs-table max-items="10" stripe search pagination :data="arrayEtiquetasCombo">
      <template slot="header">
          <vs-chip color="primary">Cantidad: <b> {{ arrayEtiquetasCombo.length }}</b></vs-chip>
      </template>
      <template slot="thead">
          <vs-th>Combo etiqueta:</vs-th>
          <vs-th>Códigos</vs-th>
          <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{data[indextr].codigo_combo}}<br>
            <b>Combo libro:</b>
            <p>{{ ObjectedSelectedCombo.pro_codigo }}</p>
          </vs-td>
          <vs-td>
            <vs-table max-items="5" pagination :data="data[indextr].codigos">
              <template slot="header">
                <vs-chip color="dark">Cantidad: <b> {{ data[indextr].codigos.length }}</b></vs-chip>
              </template>
              <template slot="thead">
                <vs-th>Libro</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(item, indextr) in data">
                  <vs-td>
                    <b>Nombre:</b>
                    <p>{{ item.nombrelibro }}</p>
                    <b>Código liquidación:</b>
                    <p>{{ item.pro_codigo }}</p>
                    <b>Código libro:</b>
                    <p>{{ item.codigo }}</p>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-td>
          <vs-td>
            <!--boton para quitar -->
            <vs-button v-if="ObjectedSelectedCombo.estado == 0 && ObjectedSelectedCombo.combo_cantidad_devuelta == 0" @click="ObjectSelectedCodigo = tr;popupConfirmQuitar = true" color="danger" class="text-white">Quitar del documento de devolución</vs-button>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--modales-->
    <vs-popup classContent="popup-example" class="popupHijo2" title="Confirmar quitar código" :active.sync="popupConfirmQuitar" :close-on-click-overlay="false">
      <div v-if="popupConfirmQuitar">
        <h3 class="text-lg mb-4">¿Estás seguro de quitar los {{ ObjectSelectedCodigo.codigos.length }} códigos del combo etiqueta <b>{{ ObjectSelectedCodigo.codigo_combo }}</b> del documento de devolución?</h3>
        <div class="">
          <vs-input class="w-full" v-model="observacion_quitar" label="Observación para quitar los códigos" placeholder="Ingrese una observación" />
        </div>
        <div class="flex justify-center mt-5">
          <vs-button color="primary" class="text-white mr-5" @click="f_quitarCodigo()">Si, deseo quitar</vs-button>
          <vs-button color="warning" class="mr-2 text-white" @click="popupConfirmQuitar = false">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import Generalmix from '../../../../../mixins/Generalmix';
 import XLSX from 'xlsx';
export default{
  mixins:[Generalmix],
  data(){
    return{
      usuario:[],
      arrayEtiquetasCombo:[],
      ObjectSelectedCodigo:null,
      popupConfirmQuitar:false,
      observacion_quitar:'',
    }
  },
  props:{
    ObjectedSelectedCombo:{
      type:Object,
      required:true
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    this.f_getEtiquetasCombo();
  },
  methods:{
    f_getEtiquetasCombo(){
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + `devoluciones?getCodigosComboEtiquetaDevolucionSon=1&id_devolucion=${this.ObjectedSelectedCombo.codigoslibros_devolucion_id}&combo=${this.ObjectedSelectedCombo.pro_codigo}&documento=${this.ObjectedSelectedCombo.documento}&id_empresa=${this.ObjectedSelectedCombo.id_empresa}`)
      .then(function (res) {
        me.$vs.loading.close();
        if(res.data.status == 0){
          me.m_message(res.data.message,'danger');
        }
        me.arrayEtiquetasCombo = res.data;

      })
      .catch(function (error) {
        me.$vs.loading.close();
          console.log(error + ' error');
          me.m_message('Error al obtener etiquetas de combo', 'danger');
      })
    },

    f_quitarCodigo(){
      let me = this;
      // quitar espacios en blanco al inicio y final
      me.observacion_quitar = me.observacion_quitar.trim();
      if(me.observacion_quitar == '' || me.observacion_quitar == null){
        me.m_message('Debe ingresar una observación para quitar el código','warning')
        return
      }
      let formData = new FormData();
      formData.append('quitarCodigoDocumentoDevolucionComboEtiqueta', 1);
      formData.append('id_devolucion',                  this.ObjectedSelectedCombo.codigoslibros_devolucion_id);
      formData.append('id_usuario',                     this.usuario.idusuario);
      formData.append('observacion_quitar',             'Quitar_codigo_doc_dev_' + me.observacion_quitar);
      formData.append('comboLibro',                     me.ObjectedSelectedCombo.pro_codigo)
      formData.append('combo_etiqueta',                 me.ObjectSelectedCodigo.codigo_combo)
      formData.append('documento',                      me.ObjectedSelectedCombo.documento)
      formData.append('id_empresa',                     me.ObjectedSelectedCombo.id_empresa)
      me.$vs.loading()
      this.$http.post(this.$server_url + 'devoluciones', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.loading.close()
          me.m_message(res.data.message,'danger')
          return
        }
        me.$vs.loading.close()
        me.m_message('Código quitado del documento de devolución','success')
        me.popupConfirmQuitar = false
        // Esperar al siguiente ciclo para asegurar que el popup ya se cerró
        me.$nextTick(() => {
          me.$emit('updateQuitarComboEtiqueta', true);
        });
      })
      .catch(error => {
        me.$vs.loading.close()
        me.m_message('Error al quitar el código del documento de devolución','danger')
      })
    },
    exportarExcel(){
      try {
        if (!this.arrayEtiquetasCombo || this.arrayEtiquetasCombo.length === 0) {
          this.m_message('No hay datos para exportar', 'warning');
          return;
        }

        // Crear un nuevo workbook
        const wb = XLSX.utils.book_new();

        // Crear una hoja resumen con información completa del combo padre
        const resumenData = [
          ['=== INFORMACIÓN DEL COMBO PADRE ==='],
          ['COMBO CÓDIGO:', this.ObjectedSelectedCombo.pro_codigo || 'N/A'],
          ['NOMBRE LIBRO:', this.ObjectedSelectedCombo.nombrelibro || 'N/A'],
          ['DOCUMENTO:', this.ObjectedSelectedCombo.documento || 'N/A'],
          ['EMPRESA:', this.ObjectedSelectedCombo.empresa || 'N/A'],
          ['ID EMPRESA:', this.ObjectedSelectedCombo.id_empresa || 'N/A'],
          ['CÓDIGOS COMBOS:', this.ObjectedSelectedCombo.codigos_combos || 'N/A'],
          ['ID DEVOLUCIÓN:', this.ObjectedSelectedCombo.codigoslibros_devolucion_id || 'N/A'],
          ['FECHA EXPORTACIÓN:', new Date().toLocaleString()],
          [''],
          ['=== RESUMEN DE COMBO ETIQUETAS ==='],
          ['TOTAL COMBO ETIQUETAS:', this.arrayEtiquetasCombo.length],
          [''],
          ['COMBO ETIQUETA', 'TOTAL CÓDIGOS', 'DESCRIPCIÓN']
        ];

        // Agregar resumen de cada combo etiqueta
        this.arrayEtiquetasCombo.forEach(combo => {
          resumenData.push([
            combo.codigo_combo || 'N/A',
            combo.codigos ? combo.codigos.length : 0,
            `Códigos del combo etiqueta ${combo.codigo_combo}`
          ]);
        });

        const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);

        // Configurar anchos de columna para la hoja resumen
        wsResumen['!cols'] = [
          { wch: 25 }, // Etiqueta
          { wch: 30 }, // Valor
          { wch: 25 }  // Descripción
        ];

        XLSX.utils.book_append_sheet(wb, wsResumen, "RESUMEN");

        // Crear una hoja para cada combo etiqueta
        this.arrayEtiquetasCombo.forEach((comboEtiqueta, index) => {
          const sheetData = [
            ['=== INFORMACIÓN DEL COMBO PADRE ==='],
            ['COMBO CÓDIGO:', this.ObjectedSelectedCombo.pro_codigo || 'N/A'],
            ['NOMBRE LIBRO:', this.ObjectedSelectedCombo.nombrelibro || 'N/A'],
            ['DOCUMENTO:', this.ObjectedSelectedCombo.documento || 'N/A'],
            ['EMPRESA:', this.ObjectedSelectedCombo.empresa || 'N/A'],
            ['ID EMPRESA:', this.ObjectedSelectedCombo.id_empresa || 'N/A'],
            [''],
            ['=== INFORMACIÓN DEL COMBO ETIQUETA ==='],
            ['COMBO ETIQUETA:', comboEtiqueta.codigo_combo || 'N/A'],
            ['TOTAL CÓDIGOS:', comboEtiqueta.codigos ? comboEtiqueta.codigos.length : 0],
            ['FECHA GENERACIÓN:', new Date().toLocaleString()],
            [''],
            ['=== DETALLE DE CÓDIGOS ==='],
            ['NOMBRE LIBRO', 'CÓDIGO LIQUIDACIÓN', 'CÓDIGO LIBRO', 'OBSERVACIONES']
          ];

          // Agregar los códigos de este combo etiqueta
          if (comboEtiqueta.codigos && comboEtiqueta.codigos.length > 0) {
            comboEtiqueta.codigos.forEach((codigo, idx) => {
              sheetData.push([
                codigo.nombrelibro || 'Sin nombre',
                codigo.pro_codigo || 'Sin código',
                codigo.codigo || 'Sin código libro',
                `Código ${idx + 1} del combo ${comboEtiqueta.codigo_combo}`
              ]);
            });
          } else {
            sheetData.push(['Sin códigos disponibles', '', '', 'Este combo etiqueta no tiene códigos asignados']);
          }

          const ws = XLSX.utils.aoa_to_sheet(sheetData);

          // Configurar el ancho de las columnas
          ws['!cols'] = [
            { wch: 35 }, // Nombre libro
            { wch: 20 }, // Código liquidación
            { wch: 18 }, // Código libro
            { wch: 40 }  // Observaciones
          ];

          // Limpiar el nombre de la hoja (remover caracteres especiales)
          let sheetName = comboEtiqueta.codigo_combo.toString();
          sheetName = sheetName.replace(/[\\\/\?\*\[\]]/g, '_');
          sheetName = sheetName.substring(0, 31); // Máximo 31 caracteres para Excel

          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });

        // Generar el archivo Excel con nombre más descriptivo
        const nombreArchivo = `${this.ObjectedSelectedCombo.pro_codigo || 'Combo'}_${this.ObjectedSelectedCombo.documento || 'Doc'}_${this.ObjectedSelectedCombo.empresa || 'Empresa'}`.replace(/[<>:"/\\|?*]/g, '_');
        const fileName = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        this.m_message('Excel exportado exitosamente con información completa del combo', 'success');

      } catch (error) {
        console.error('Error al exportar Excel:', error);
        this.m_message('Error al exportar Excel: ' + error.message, 'danger');
      }
    },

    importarExcel(event){
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.$vs.loading();
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Validar que el archivo tenga hojas
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              throw new Error('El archivo Excel no contiene hojas válidas');
            }

            // Buscar la hoja resumen para validar el combo padre
            const resumenSheet = workbook.Sheets['RESUMEN'];
            if (resumenSheet) {
              const resumenData = XLSX.utils.sheet_to_json(resumenSheet, { header: 1 });
              const comboPadreRow = resumenData.find(row => row[0] === 'COMBO CÓDIGO:');

              if (comboPadreRow && comboPadreRow[1] !== this.ObjectedSelectedCombo.pro_codigo) {
                throw new Error(`El combo padre del archivo (${comboPadreRow[1]}) no coincide con el actual (${this.ObjectedSelectedCombo.pro_codigo})`);
              }

              // Validar también el documento si existe
              const documentoRow = resumenData.find(row => row[0] === 'DOCUMENTO:');
              if (documentoRow && documentoRow[1] !== this.ObjectedSelectedCombo.documento) {
                this.m_message(`Advertencia: El documento del archivo (${documentoRow[1]}) no coincide con el actual (${this.ObjectedSelectedCombo.documento})`, 'warning');
              }
            }

            // Procesar cada hoja (excluyendo RESUMEN)
            const importedData = [];
            workbook.SheetNames.forEach(sheetName => {
              if (sheetName === 'RESUMEN') return;

              const worksheet = workbook.Sheets[sheetName];
              const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

              // Buscar el combo etiqueta en la hoja
              const comboEtiquetaRow = sheetData.find(row => row[0] === 'COMBO ETIQUETA:');
              if (!comboEtiquetaRow) return;

              const codigoCombo = comboEtiquetaRow[1];

              // Buscar la fila de encabezados
              const headerRowIndex = sheetData.findIndex(row =>
                row[0] === 'NOMBRE LIBRO' && row[1] === 'CÓDIGO LIQUIDACIÓN' && row[2] === 'CÓDIGO LIBRO'
              );

              if (headerRowIndex === -1) return;

              // Procesar los códigos
              const codigos = [];
              for (let i = headerRowIndex + 1; i < sheetData.length; i++) {
                const row = sheetData[i];
                if (row[0] && row[0] !== 'Sin códigos disponibles' && row[0] !== 'Sin nombre') {
                  codigos.push({
                    nombrelibro: row[0] || '',
                    pro_codigo: row[1] || '',
                    codigo: row[2] || ''
                  });
                }
              }

              importedData.push({
                codigo_combo: codigoCombo,
                codigos: codigos
              });
            });

            // Actualizar los datos del componente
            this.arrayEtiquetasCombo = importedData;
            this.$vs.loading.close();
            this.m_message(`Excel importado exitosamente. ${importedData.length} combo etiquetas procesadas.`, 'success');

          } catch (error) {
            this.$vs.loading.close();
            console.error('Error al procesar el archivo:', error);
            this.m_message('Error al procesar el archivo: ' + error.message, 'danger');
          }
        };

        reader.onerror = () => {
          this.$vs.loading.close();
          this.m_message('Error al leer el archivo', 'danger');
        };

        reader.readAsArrayBuffer(file);

      } catch (error) {
        this.$vs.loading.close();
        console.error('Error al importar Excel:', error);
        this.m_message('Error al importar Excel: ' + error.message, 'danger');
      }

      // Limpiar el input
      event.target.value = '';
    }
  }
}
</script>
<style scoped>
.popupHijo2{
   z-index: 51003;
}
</style>
