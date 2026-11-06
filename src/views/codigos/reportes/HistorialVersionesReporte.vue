<template>
  <div>
    <!-- Botón para abrir el historial -->
    <vs-button color="primary" @click="abrirHistorial">
      📋 Ver historial de reportes
    </vs-button>

    <!-- Modal principal del historial -->
    <vs-popup style="z-index: 51001;"
      title="📋 Historial de versiones del reporte" 
      :active.sync="historialActivo" 
      max-width="900" 
      @close="resetHistorial"
    >
      <div class="p-4">
        <div class="mb-4 text-center">
          <p>
            TOTAL DE CÓDIGOS ACTUAL: <b>{{ totalActual }}</b>
          </p>
        </div>
        <vs-button 
          color="success" 
          @click="cargarVersiones" 
          class="mb-4"
          :loading="cargandoVersiones"
        >
          🔄 Cargar historial
        </vs-button>

        <vs-table :data="listaVersiones" stripe v-if="listaVersiones.length > 0">
          <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th>Versión</vs-th>
            <vs-th>Nombre Reporte</vs-th>
            <vs-th>Usuario</vs-th>
            <vs-th>Total Códigos</vs-th>
            <vs-th>Fecha Versión</vs-th>
            <vs-th>Acción</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr v-for="(item, index) in data" :key="index" :state="item.total_codigos !== totalActual ? 'danger' : ''">
              <vs-td>{{ index + 1 }}</vs-td>
              <vs-td>v{{ item.version }}</vs-td>
              <vs-td>{{ item.nombre_reporte || 'Sin nombre' }}</vs-td>
              <vs-td>{{ item.nombre_usuario || 'Sin usuario' }}</vs-td>
              <vs-td>{{ item.total_codigos }}</vs-td>
              <vs-td>{{ formatearFecha(item.created_at) }}</vs-td>
              <vs-td>
                <vs-button size="small" @click="verDetalleVersion(item)">
                  👁 Ver detalle
                </vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div v-else-if="!cargandoVersiones" class="text-center py-4">
          <p>No hay versiones disponibles. Haz clic en "Cargar historial" para obtener los datos.</p>
        </div>
      </div>
    </vs-popup>

    <!-- Modal para ver detalle de versión -->
    <vs-popup style="z-index: 51009;"
      :title="'Detalle de versión v' + (versionSeleccionada ? versionSeleccionada.version : '')" 
      :active.sync="popupDetalleActivo" 
      max-width="1000" fullscreen
    >
      <div v-if="versionSeleccionada && parsedJsonData.length" class="p-4">
        <div class="mb-4 text-center">
          <vs-button color="success" @click="descargarExcel" class="mr-2">
            📥 Descargar Excel
          </vs-button>
        </div>
        <!-- Tabla de diferencias -->
        <div v-if="diferenciasCodigos.length" class="mb-6">
          <h3 class="mb-2">Diferencias con la versión actual</h3>
          <div class="overflow-x-auto">
            <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; text-align: left; border-collapse: collapse;">
              <thead style="background-color: #ffe6e6;">
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;">Código Libro</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Código</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(diff, idx) in diferenciasCodigos" :key="idx">
                  <td style="border: 1px solid #ddd; padding: 8px;">{{ diff.codigo }}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">{{ diff.cod }}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <span :class="diff.estado === 'Nuevo' ? 'text-success' : 'text-danger'">
                      {{ diff.estado }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="mb-6 text-center">
          <p>No se encontraron diferencias con la versión actual.</p>
        </div>

        <!-- Tabla original -->
        <div class="overflow-x-auto">
          <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; text-align: left; border-collapse: collapse;">
            <thead style="background-color: #f5f5f5;">
              <tr>
                <th v-for="(header, index) in tableHeaders" :key="index" style="border: 1px solid #ddd; padding: 8px;">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in parsedJsonData" :key="idx">
                <td v-for="key in tableKeys" :key="key" style="border: 1px solid #ddd; padding: 8px;">
                  <span v-if="key === 'Códigos' && row[key]">
                    {{ row[key].length > 100 ? row[key].slice(0, 100) + '...' : row[key] }}
                    <vs-button v-if="row[key].length > 100" size="small" @click="showFullCodes(row[key])">
                      Ver todos los códigos
                    </vs-button>
                  </span>
                  <span v-else>
                    {{ row[key] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="p-4 text-center">
        <p>No hay datos para mostrar en esta versión.</p>
      </div>
      <div class="mb-4 text-center">
        <p>Datos actuales:</p>
        <pre>{{ datosActuales }}</pre> <!-- Para depuración -->
      </div>
    </vs-popup>

    <!-- Modal for full codes -->
    <vs-popup
      title="Códigos Completos"
      :active.sync="fullCodesPopupActive"
      max-width="800"
    >
      <div class="p-4">
        <vs-input
          v-model="searchCode"
          placeholder="Buscar código..."
          class="mb-4 w-full"
          @input="filterCodes"
        />
        <pre>{{ filteredCodes }}</pre>
        <vs-button color="primary" @click="copyCodes">Copiar Códigos</vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'HistorialVersionesReporte',
  props: {
    nombreReporte: {
      type: String,
      required: true
    },
    periodoId: {
      type: [String, Number],
      required: true
    },
    serieId: {
      type: [String, Number],
      required: true
    },
    datosActuales: {
      type: Array,
      default: () => []
    },
    totalActual: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      historialActivo: false,
      listaVersiones: [],
      versionSeleccionada: null,
      popupDetalleActivo: false,
      cargandoVersiones: false,
      fullCodesPopupActive: false,
      fullCodes: '',
      searchCode: '', // Término de búsqueda para códigos
      filteredCodes: '', // Códigos filtrados para mostrar
      codigosVersion: []
    }
  },
  computed: {
    parsedJsonData() {
      if (!this.versionSeleccionada || !this.versionSeleccionada.data) return [];
      try {
        return this.versionSeleccionada.data.map(item => ({
          'Código Libro': item.codigo_libro || 'Sin código',
          'Nombre Libro': item.nombre_libro || 'Sin nombre',
          'Cantidad': item.cantidad,
          'Total Códigos': item.total_codigos,
          'Códigos': item.codigos || 'Sin códigos'
        }));
      } catch (error) {
        console.error('Error processing data:', error);
        return [];
      }
    },
    tableHeaders() {
      if (this.parsedJsonData.length === 0) return [];
      return Object.keys(this.parsedJsonData[0]);
    },
    tableKeys() {
      return this.tableHeaders;
    },
    diferenciasCodigos() {
      const diferencias = [];

      // Procesar datos actuales
      const actualesMap = new Map();
      this.datosActuales.forEach(item => {
        if (item.codigo && item.Codigos) {
          const codigos = item.Codigos.split(',').map(c => c.trim()).filter(c => c);
          actualesMap.set(item.codigo, codigos);
        }
      });
      console.log('actualesMap:', actualesMap);

      // Procesar datos de la versión seleccionada
      const versionMap = new Map();
      this.codigosVersion.forEach(item => {
        if (item.codigo_libro && item.codigos) {
          const codigos = item.codigos.split(',').map(c => c.trim()).filter(c => c);
          versionMap.set(item.codigo_libro, codigos);
        }
      });
      console.log('versionMap:', versionMap);

      // Encontrar códigos nuevos (en datosActuales pero no en codigosVersion)
      actualesMap.forEach((codigos, codigo) => {
        const codigosVersion = versionMap.get(codigo) || [];
        codigos.forEach(cod => {
          if (!codigosVersion.includes(cod)) {
            diferencias.push({
              codigo,
              cod,
              estado: 'Nuevo'
            });
          }
        });
      });

      // Encontrar códigos eliminados (en codigosVersion pero no en datosActuales)
      versionMap.forEach((codigos, codigo) => {
        const codigosActuales = actualesMap.get(codigo) || [];
        codigos.forEach(cod => {
          if (!codigosActuales.includes(cod)) {
            diferencias.push({
              codigo,
              cod,
              estado: 'Eliminado'
            });
          }
        });
      });

      console.log('diferencias:', diferencias);
      return diferencias;
    }
  },
  methods: {
    abrirHistorial() {
      this.historialActivo = true;
    },
    
    async cargarVersiones() {
      if (!this.periodoId || !this.serieId) {
        this.$vs.notify({
          color: 'warning',
          title: 'Atención',
          text: 'Debe seleccionar período y serie antes de cargar el historial.'
        });
        return;
      }

      this.cargandoVersiones = true;
      try {
        const response = await this.$http.post(this.$server_url + 'listar-versiones-reporte', {
          nombre: this.nombreReporte,
          periodo_id: this.periodoId,
          serie_id: this.serieId
        });
        this.listaVersiones = Array.isArray(response.data) ? response.data : [];
        
        if (this.listaVersiones.length === 0) {
          this.$vs.notify({
            color: 'warning',
            title: 'Sin datos',
            text: 'No se encontraron versiones para este reporte.'
          });
        }
      } catch (error) {
        console.error('Error cargando versiones', error);
        this.listaVersiones = [];
        this.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'No se pudieron cargar las versiones del reporte.'
        });
      } finally {
        this.cargandoVersiones = false;
      }
    },
    
    async verDetalleVersion(version) {
      try {
        this.$vs.loading();
        
        const responseVersion = await this.$http.post(this.$server_url + 'obtener-detalle-version', {
          version_id: version.id
        });
        console.log('codigosVersion:', responseVersion.data.data);
        
        this.codigosVersion = Array.isArray(responseVersion.data.data) ? responseVersion.data.data : [];
        
        this.versionSeleccionada = {
          ...version,
          data: responseVersion.data.data
        };
        
        this.popupDetalleActivo = true;
      } catch (error) {
        console.error('Error obteniendo detalle de versión', error);
        this.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'No se pudo cargar el detalle de la versión.'
        });
      } finally {
        this.$vs.loading.close();
      }
    },
    
    showFullCodes(codes) {
      this.fullCodes = codes;
      this.searchCode = ''; // Reiniciar búsqueda
      this.filteredCodes = codes; // Mostrar todos los códigos inicialmente
      this.fullCodesPopupActive = true;
    },
    
    filterCodes() {
      if (!this.searchCode) {
        this.filteredCodes = this.fullCodes; // Mostrar todos si no hay búsqueda
        return;
      }
      const searchTerm = this.searchCode.toLowerCase().trim();
      const codesArray = this.fullCodes.split(',').map(c => c.trim());
      this.filteredCodes = codesArray
        .filter(code => code.toLowerCase().includes(searchTerm))
        .join(', ');
    },
    
    copyCodes() {
      const codesToCopy = this.searchCode ? this.filteredCodes : this.fullCodes;
      navigator.clipboard.writeText(codesToCopy).then(() => {
        this.$vs.notify({
          color: 'success',
          title: 'Copiado',
          text: 'Códigos copiados al portapapeles.'
        });
      }).catch(err => {
        console.error('Error copying codes:', err);
        this.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'No se pudieron copiar los códigos.'
        });
      });
    },
    
    descargarExcel() {
      if (!this.versionSeleccionada || !this.codigosVersion.length) {
        this.$vs.notify({
          color: 'warning',
          title: 'Atención',
          text: 'No hay datos para exportar.'
        });
        return;
      }

      const wb = XLSX.utils.book_new();

      // Crear un mapa para almacenar información por código libro
      const codigosMap = new Map();

      // Procesar datos de la versión seleccionada
      this.codigosVersion.forEach(item => {
        if (item.codigo_libro && item.codigos) {
          const codigos = item.codigos.split(',').map(c => c.trim()).filter(c => c);
          codigosMap.set(item.codigo_libro, {
            nombre_libro: item.nombre_libro || 'Sin nombre',
            cantidad: item.cantidad || 0,
            total_codigos: item.total_codigos || 0,
            codigos: codigos,
            codigosSinDiferencias: [],
            codigosConDiferencias: []
          });
        }
      });

      // Procesar datos actuales para encontrar códigos sin diferencias
      this.datosActuales.forEach(item => {
        if (item.codigo && item.Codigos) {
          const codigosActuales = item.Codigos.split(',').map(c => c.trim()).filter(c => c);
          const codigoLibro = item.codigo;
          if (!codigosMap.has(codigoLibro)) {
            codigosMap.set(codigoLibro, {
              nombre_libro: item.nombrelibro || 'Sin nombre',
              cantidad: item.cantidad || 0,
              total_codigos: codigosActuales.length,
              codigos: [],
              codigosSinDiferencias: [],
              codigosConDiferencias: []
            });
          }
          var libroData = codigosMap.get(codigoLibro);
          var codigosVersion = codigosMap.get(codigoLibro) && codigosMap.get(codigoLibro).codigos ? codigosMap.get(codigoLibro).codigos : [];
          // Códigos sin diferencias (presentes en ambos)
          libroData.codigosSinDiferencias = codigosActuales.filter(function(cod) {
            return codigosVersion.includes(cod);
          });
        }
      });

      // Procesar diferencias
      this.diferenciasCodigos.forEach(function(diff) {
        var libroData = codigosMap.get(diff.codigo);
        if (libroData) {
          libroData.codigosConDiferencias.push({
            codigo: diff.cod,
            estado: diff.estado
          });
        }
      });

      // Crear una pestaña por cada código libro
      codigosMap.forEach(function(data, codigoLibro) {
        // Preparar el encabezado
        var headerData = [
          ['Código Libro', codigoLibro],
          ['Nombre del Libro', data.nombre_libro],
          ['Cantidad', data.cantidad],
          ['Total Códigos sin Diferencias', data.codigosSinDiferencias.length],
          ['Total Códigos con Diferencias', data.codigosConDiferencias.length]
        ];

        // Preparar los datos de la tabla
        var maxRows = Math.max(data.codigosSinDiferencias.length, data.codigosConDiferencias.length);
        var tableData = [];
        for (var i = 0; i < maxRows; i++) {
          var sinDiferencia = data.codigosSinDiferencias[i] || '';
          var conDiferencia = data.codigosConDiferencias[i] ? 
            data.codigosConDiferencias[i].codigo + ' (' + data.codigosConDiferencias[i].estado + ')' : '';
          tableData.push([sinDiferencia, conDiferencia]);
        }

        // Crear la hoja
        var ws = XLSX.utils.aoa_to_sheet(headerData);
        XLSX.utils.sheet_add_aoa(ws, [['Códigos sin Diferencias', 'Códigos con Diferencias']], { origin: 'A7' });
        XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'A8' });

        // Ajustar ancho de columnas
        ws['!cols'] = [
          { wch: 30 }, // Códigos sin Diferencias
          { wch: 40 }  // Códigos con Diferencias
        ];

        // Agregar la hoja al libro
        var sheetName = codigoLibro.length > 31 ? codigoLibro.substring(0, 31) : codigoLibro; // Limitar longitud del nombre
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      // Exportar el archivo
      XLSX.writeFile(wb, 'Reporte_Diferencias_v' + this.versionSeleccionada.version + '.xlsx');
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    resetHistorial() {
      this.listaVersiones = []; // Borrar la lista de versiones
      this.versionSeleccionada = null; // Borrar la versión seleccionada
      this.popupDetalleActivo = false; // Cerrar el popup detalle
      // this.cargandoVersiones = false; // Desactivar el cargador
    }
  }
}
</script>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}

table {
  min-width: 100%;
}

.p-4 {
  padding: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.text-center {
  text-align: center;
}

pre {
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}
</style>