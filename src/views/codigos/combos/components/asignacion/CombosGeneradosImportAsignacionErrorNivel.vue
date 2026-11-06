<template>
  <div>
    <div class="mb-4">
      <vs-button @click="exportarAExcel" color="success" icon="file_download" class="p-2">
        Exportar a Excel
      </vs-button>
    </div>
    <vs-table max-items="10" search pagination :data="arrayErroresNivel" stripe>
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ arrayErroresNivel.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Combo etiqueta</vs-th>
            <vs-th>Detalle de codigos</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].codigoCombo}}<br>
                </vs-td>
                <vs-td>
                  <div v-for="item in tr.codigosHijos" :key="item.year">
                    <b>Código Activación:</b> {{ item.codigoActivacion }}<br>
                    <b>Código Diagnóstico:</b> {{ item.codigoDiagnostico }}<br>
                    <b>Año:</b> {{ item.year }}<br>
                    <b>Nombre Libro:</b> {{ item.nombrelibro }}<br>
                    <br>
                  </div>
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

    }
  },
  props:{
    arrayErroresNivel:{
      type:Array,
      default:()=>[]
    }
  },
  methods: {
    exportarAExcel() {
      try {
        import('@/vendor/Export2Excel').then(excel => {
          // Importar XLSX para crear múltiples hojas
          import('xlsx').then(XLSX => {
            // Crear un nuevo libro de trabajo
            const workbook = { SheetNames: [], Sheets: {} };

            // 1. Crear hoja resumen de combos
            const resumenCombos = this.arrayErroresNivel.map((combo, index) => ({
              'Nº': index + 1,
              'Combo Etiqueta': combo.codigoCombo,
              'Total Códigos': combo.codigosHijos ? combo.codigosHijos.length : 0,
              'Hoja Detalle': `Detalle_${index + 1}`
            }));

            // Convertir datos de resumen a formato de matriz
            const headerResumen = ['Nº', 'Combo Etiqueta', 'Total Códigos', 'Hoja Detalle'];
            const dataResumen = [headerResumen];
            resumenCombos.forEach(row => {
              dataResumen.push([row['Nº'], row['Combo Etiqueta'], row['Total Códigos'], row['Hoja Detalle']]);
            });

            // Crear hoja de resumen
            const wsResumen = this.sheet_from_array_of_arrays(dataResumen);
            workbook.SheetNames.push('Resumen_Combos');
            workbook.Sheets['Resumen_Combos'] = wsResumen;

            // 2. Crear una hoja por cada combo con sus códigos hijos
            this.arrayErroresNivel.forEach((combo, index) => {
              if (combo.codigosHijos && combo.codigosHijos.length > 0) {
                const headerDetalle = ['Nº', 'Combo Etiqueta', 'Código Activación', 'Código Diagnóstico', 'Año', 'Nombre Libro'];
                const dataDetalle = [headerDetalle];

                combo.codigosHijos.forEach((hijo, indexHijo) => {
                  dataDetalle.push([
                    indexHijo + 1,
                    combo.codigoCombo,
                    hijo.codigoActivacion || '',
                    hijo.codigoDiagnostico || '',
                    hijo.year || '',
                    hijo.nombrelibro || ''
                  ]);
                });

                const wsDetalle = this.sheet_from_array_of_arrays(dataDetalle);

                // Nombre de la hoja limitado a 31 caracteres (límite de Excel)
                let nombreHoja = `Detalle_${index + 1}_${combo.codigoCombo}`;
                if (nombreHoja.length > 31) {
                  nombreHoja = `Detalle_${index + 1}`;
                }
                // Reemplazar caracteres no válidos para nombres de hojas
                nombreHoja = nombreHoja.replace(/[\\\/\?\*\[\]]/g, '_');

                workbook.SheetNames.push(nombreHoja);
                workbook.Sheets[nombreHoja] = wsDetalle;
              }
            });

            // 3. Generar y descargar el archivo
            const fecha = new Date();
            const fechaFormateada = fecha.toISOString().slice(0, 19).replace(/:/g, '-');
            const nombreArchivo = `Errores_Nivel_Combos_${fechaFormateada}`;

            // Escribir y descargar el archivo
            const wbout = XLSX.write(workbook, {
              bookType: 'xlsx',
              bookSST: false,
              type: 'binary'
            });

            const s2ab = (s) => {
              const buf = new ArrayBuffer(s.length);
              const view = new Uint8Array(buf);
              for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
              return buf;
            };

            // Usar file-saver para descargar
            const FileSaver = require('file-saver');
            FileSaver.saveAs(new Blob([s2ab(wbout)], {
              type: "application/octet-stream"
            }), `${nombreArchivo}.xlsx`);

            // Mostrar mensaje de éxito
            this.$vs.notify({
              title: 'Exportación exitosa',
              text: `El archivo Excel se ha generado correctamente con ${workbook.SheetNames.length} hojas`,
              color: 'success',
              icon: 'check_circle'
            });

          }).catch(error => {
            console.error('Error al cargar XLSX:', error);
            this.exportarSimple(); // Fallback a exportación simple
          });
        });

      } catch (error) {
        console.error('Error al exportar a Excel:', error);
        this.$vs.notify({
          title: 'Error en exportación',
          text: 'Hubo un problema al generar el archivo Excel',
          color: 'danger',
          icon: 'error'
        });
      }
    },

    // Método auxiliar para crear hojas desde matrices
    sheet_from_array_of_arrays(data) {
      const ws = {};
      const range = {
        s: { c: 10000000, r: 10000000 },
        e: { c: 0, r: 0 }
      };

      for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
          if (range.s.r > R) range.s.r = R;
          if (range.s.c > C) range.s.c = C;
          if (range.e.r < R) range.e.r = R;
          if (range.e.c < C) range.e.c = C;

          const cell = { v: data[R][C] };
          if (cell.v == null) continue;

          const cell_ref = this.encode_cell({ c: C, r: R });

          if (typeof cell.v === 'number') cell.t = 'n';
          else if (typeof cell.v === 'boolean') cell.t = 'b';
          else if (cell.v instanceof Date) {
            cell.t = 'n';
            cell.v = this.datenum(cell.v);
          } else cell.t = 's';

          ws[cell_ref] = cell;
        }
      }

      if (range.s.c < 10000000) {
        ws['!ref'] = this.encode_range(range);
      }

      return ws;
    },

    // Métodos auxiliares
    encode_cell(cell) {
      return String.fromCharCode(65 + cell.c) + (cell.r + 1);
    },

    encode_range(range) {
      return this.encode_cell(range.s) + ':' + this.encode_cell(range.e);
    },

    datenum(v) {
      const epoch = Date.parse(v);
      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    },

    // Método de respaldo para exportación simple
    exportarSimple() {
      import('@/vendor/Export2Excel').then(excel => {
        // Crear datos planos con todos los códigos
        const datosPlanos = [];
        this.arrayErroresNivel.forEach(combo => {
          if (combo.codigosHijos && combo.codigosHijos.length > 0) {
            combo.codigosHijos.forEach(hijo => {
              datosPlanos.push({
                'Combo Etiqueta': combo.codigoCombo,
                'Código Activación': hijo.codigoActivacion || '',
                'Código Diagnóstico': hijo.codigoDiagnostico || '',
                'Año': hijo.year || '',
                'Nombre Libro': hijo.nombrelibro || ''
              });
            });
          }
        });

        const headerTitle = ['Combo Etiqueta', 'Código Activación', 'Código Diagnóstico', 'Año', 'Nombre Libro'];
        const headerVal = ['Combo Etiqueta', 'Código Activación', 'Código Diagnóstico', 'Año', 'Nombre Libro'];

        const data = datosPlanos.map(row => headerVal.map(key => row[key]));

        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: 'Errores_Nivel_Combos_Simple',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    }
  }
}
</script>
