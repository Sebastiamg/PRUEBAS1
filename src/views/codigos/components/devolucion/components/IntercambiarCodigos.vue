<template>
  <div>
    <div class="p-4">
      <h3 class="mb-4">Generar documento de venta de <b>codigos sueltos</b> - Documento: {{ header.codigo_devolucion }}</h3>

      <!-- Documentos Generados -->
      <div v-if="arrayDocumentosGenerados.length > 0" class="documentos-generados mb-4">
        <h4 class="titulo-documentos">Documentos Generados:</h4>
        <div class="lista-documentos">
          <span v-for="(doc, index) in arrayDocumentosGenerados" :key="index" class="documento-badge">
            {{ doc.ven_codigo }}
          </span>
        </div>
      </div>

      <div class="filters-container mb-4">
        <div class="filter-item">
          <label>Tipo de documento destino</label>
          <div class="select-wrapper">
            <v-select v-model="selectedTipo" :options="tipos" label="label" placeholder="--Seleccione--" />
          </div>
        </div>

        <div class="filter-item">
          <label>Empresa documento destino</label>
          <div class="select-wrapper">
            <v-select v-model="selectedEmpresa" :options="empresas" label="nombre" placeholder="--Seleccione empresa--" @input="filtrarPorEmpresa" />
          </div>
        </div>

        <div class="filter-item">
          <label>Cliente Perseo</label>
          <div class="select-wrapper">
            <v-select v-model="selectedClientePerseo" :options="clientesPerseo" label="nombre" placeholder="--Seleccione cliente--" @input="filtrarPorCliente" />
          </div>
        </div>

        <div class="filter-item">
          <label>Tipo de venta</label>
          <div class="select-wrapper">
            <v-select v-model="selectedTipoVenta" :options="tiposVenta" label="nombre" placeholder="--Seleccione tipo--" />
          </div>
        </div>

        <div class="filter-item">
          <label>Porcentaje de descuento (%)</label>
          <vs-input
            v-model.number="porcentajeDescuento"
            type="number"
            min="0"
            max="100"
            @input="validarPorcentaje"
            placeholder="0 - 100"
            class="w-full"
          />
          <span v-if="errorPorcentaje" class="text-danger text-xs">
            El porcentaje debe estar entre 0 y 100
          </span>
        </div>

        <div class="filter-item">
          <label>Observación del intercambio <span class="text-danger">*</span></label>
          <vs-input
            v-model.trim="observacionIntercambio"
            type="textarea"
            placeholder="Escriba la observación del intercambio (mínimo 3 caracteres)"
            class="w-full"
            :class="{'input-error': errorObservacion}"
          />
          <span v-if="errorObservacion" class="text-danger text-xs">
            {{ errorObservacion }}
          </span>
        </div>
      </div>
      <!-- Contador de selección -->
      <div class="seleccion-info mb-3">
        <span class="seleccion-badge">
          <i class="fas fa-check-circle"></i>
          Seleccionados: <strong>{{ selected.length }}</strong> item{{ selected.length !== 1 ? 's' : '' }}
        </span>
        <span class="libros-badge">
          <i class="fas fa-book"></i>
          Total libros: <strong>{{ totalLibrosAMover }}</strong>
        </span>
      </div>
      <vs-table :data="gruposFiltrados" v-model="selected" multiple pagination max-items="10" stripe search>
        <template slot="header">
          <vs-chip>Cantidad: {{ gruposFiltrados.length }}</vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Documento</vs-th>
          <vs-th>Empresa</vs-th>
          <vs-th>Libro</vs-th>
          <vs-th>Código libro</vs-th>
          <vs-th>Cantidad</vs-th>
          <vs-th>Cantidad a mover</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ tr.documento || '-' }} <br>
              <b>Cliente perseo:</b>
              <p>{{ tr.clientePerseo || 'Sin cliente' }}</p>
              <b>Documento identidad:</b>
              <p>{{ tr.ruc_cliente || 'Sin documento' }}</p>
            </vs-td>
            <vs-td>{{ descripcionEmpresa(tr.id_empresa) }}</vs-td>
            <vs-td>{{ tr.nombrelibro || '-' }}</vs-td>
            <vs-td>{{ tr.pro_codigo }}</vs-td>
            <vs-td>{{ tr.cantidad }}</vs-td>
            <vs-td>
              <vs-input
                v-model.number="tr.cantidadMover"
                type="number"
                min="1"
                :max="tr.cantidad"
                @input="validarCantidad(tr)"
                @blur="clampCantidad(tr)"
                :class="{'input-error': tr.cantidadMover > tr.cantidad}"
              />
              <span v-if="tr.cantidadMover > tr.cantidad" class="text-danger text-xs">
                Máximo: {{ tr.cantidad }}
              </span>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>

      <div class="mt-4 flex justify-center">
        <div>
          <vs-button color="primary" @click="mostrarPreview" :disabled="!hasSelected">Mover seleccionados</vs-button>
        </div>
        <div class="ml-5">
          <vs-button color="dark" @click="$emit('close')"><i class="fas fa-times"></i> Cerrar</vs-button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación con preview -->
    <vs-popup class="popup-preview" title="Confirmar generación de documentos" :active.sync="showPreview">
      <div class="preview-container">
        <vs-alert color="primary" class="mb-3">
          <p class="text-center font-bold">Revise los datos antes de generar</p>
        </vs-alert>

        <div class="info-section mb-3">
          <p class="info-label">Documento origen:</p>
          <p class="info-value">{{ header.codigo_devolucion }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Tipo de documento destino:</p>
          <p class="info-value">{{ selectedTipo ? selectedTipo.tdo_nombre : '-' }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Empresa destino:</p>
          <p class="info-value">{{ selectedEmpresa ? selectedEmpresa.nombre : '-' }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Tipo de venta:</p>
          <p class="info-value">{{ selectedTipoVenta ? selectedTipoVenta.nombre : '-' }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Porcentaje de descuento:</p>
          <p class="info-value">{{ porcentajeDescuento }}%</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Cliente Perseo seleccionado:</p>
          <p class="info-value">{{ selectedClientePerseo ? selectedClientePerseo.nombre : 'Todos' }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Total de items:</p>
          <p class="info-value">{{ selected.length }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Total libros a mover:</p>
          <p class="info-value">{{ totalLibrosAMover }}</p>
        </div>

        <div class="info-section mb-3">
          <p class="info-label">Observación del intercambio:</p>
          <p class="info-value">{{ observacionIntercambio || '(Ninguna)' }}</p>
        </div>

        <div class="detail-section">
          <p class="section-title">Detalle de productos:</p>
          <div class="table-responsive">
            <table class="preview-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre del Libro</th>
                  <th>Empresa</th>
                  <th>Documento</th>
                  <th>Cliente Perseo</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in selected" :key="idx">
                  <td>{{ item.pro_codigo }}</td>
                  <td>{{ item.nombrelibro || '-' }}</td>
                  <td>{{ descripcionEmpresa(item.id_empresa) }}</td>
                  <td>{{ item.documento || '-' }}</td>
                  <td>{{ item.clientePerseo || 'Sin cliente' }}</td>
                  <td class="text-center"><strong>{{ item.cantidadMover }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="buttons-section mt-4">
          <vs-button color="success" class="mr-2" @click="confirmarGeneracion">
            <i class="fa-solid fa-check mr-1"></i> Generar Documento
          </vs-button>
          <vs-button color="primary" class="mr-2" @click="exportarExcel">
            <i class="fa-solid fa-file-excel mr-1"></i> Exportar a Excel
          </vs-button>
          <vs-button color="danger" @click="showPreview = false">
            <i class="fa-solid fa-times mr-1"></i> Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select'
export default {
  components: { 'v-select': vSelect },
  props: { header: { type: Object, required: true } },
  data() {
    return {
      grupos: [],
      tipos: [],
      selectedTipo: null,
      selectedEmpresa: null,
      empresas: [],
      loading: false,
      selected: [], // Array de elementos seleccionados (v-model del vs-table)
      showPreview: false, // Controla el popup de confirmación

      // Nuevos campos
      clientesPerseo: [],
      selectedClientePerseo: null,
      tiposVenta: [
        { id: 1, nombre: 'Venta Directa' },
        { id: 2, nombre: 'Venta Lista' }
      ],
      selectedTipoVenta: null,
      porcentajeDescuento: 0,
      errorPorcentaje: false,
      arrayDocumentosGenerados: [],
      observacionIntercambio: '',
      errorObservacion: ''
    };
  },
  mounted() {
    this.getEmpresas();
    this.fetchGrupos();
    this.fetchTipos();
    this.f_traerDocumentosGenerados();
  },
  computed: {
    hasSelected() {
      return this.selected.length > 0;
    },
    totalLibrosAMover() {
      return this.selected.reduce((sum, item) => sum + (Number(item.cantidadMover) || 0), 0);
    },
    // Filtrar grupos por cliente de Perseo seleccionado
    gruposFiltrados() {
      // Debe tener tanto empresa como cliente seleccionado para mostrar datos
      if (!this.selectedEmpresa || !this.selectedClientePerseo) {
        return []; // Sin alguno de los dos = tabla vacía
      }

      // Filtrar por empresa Y cliente Perseo (por ven_cliente)
      return this.grupos.filter(g =>
        g.id_empresa === this.selectedEmpresa.id_empresa &&
        g.ven_cliente === this.selectedClientePerseo.id
      );
    }
  },
  watch: {
    observacionIntercambio() {
      // Limpiar error cuando el usuario escribe
      if (this.errorObservacion) {
        this.errorObservacion = '';
      }
    }
  },
  methods: {
    f_traerDocumentosGenerados(){
      let url = `devoluciones?documentoVentasIntercambios=1&id_devolucion=${this.header.id}`;
      this.$http.get(this.$server_url + url)
      .then(res => {
        this.arrayDocumentosGenerados = res.data.data;
      })
    },
    getEmpresas(){
      let me = this;
      let url = this.$server_url + 'empresa2';
      this.$http.get(url).then(function (response) {
        me.empresas = response.data.map(function(emp) {
          return {
            id_empresa: emp.id,
            nombre: emp.descripcion_corta
          };
        });
      }).catch(function (error) {
        console.log(error);
      });
    },
    descripcionEmpresa(id) {
      if (id === null || id === 0) return 'Sin empresa';
      const empresa = this.empresas.find(function(e) { return e.id_empresa === id; });
      return empresa ? empresa.nombre : id;
    },
    async fetchGrupos() {
      try {
        const url = `${this.$server_url}devoluciones?getCodigosxDocumentoDevolucion=1&id_documento=${this.header.id}&agrupar_por_documento=1`;
        const res = await this.$http.get(url);
        // map and add cantidadMover default
        this.grupos = res.data.map(r => ({ ...r, cantidadMover: 1 }));
        this.selected = []; // Limpiar selección al recargar

        // Extraer clientes de Perseo únicos por ven_cliente
        const clientesMap = new Map();
        this.grupos.forEach(g => {
          if (g.ven_cliente && g.clientePerseo) {
            clientesMap.set(g.ven_cliente, g.clientePerseo);
          }
        });
        this.clientesPerseo = Array.from(clientesMap, ([id, nombre]) => ({ id, nombre }));

        // Seleccionar el primer cliente de Perseo por defecto
        if (this.clientesPerseo.length > 0) {
          this.selectedClientePerseo = this.clientesPerseo[0];
        }
      } catch (e) {
        console.error(e);
        this.$vs.notify({ text: 'Error cargando grupos', color: 'danger' });
      }
    },
    async fetchTipos() {
      try {
        const res = await this.$http.get(this.$server_url + 'GetTipoDocumento_todo');
        // Usar la misma forma que en otras vistas (v-select espera objetos completos con 'label')
        this.tipos = res.data.filter(t => t.tdo_estado == 1 && [1, 2, 3, 4].includes(t.tdo_id)).map(t => ({ tdo_id: t.tdo_id, tdo_nombre: t.tdo_nombre, label: t.tdo_nombre }));
      } catch (e) {
        console.error(e);
      }
    },

    validarCantidad(r) {
      // Convertir a número si es string
      r.cantidadMover = Number(r.cantidadMover) || 0;

      // Si es menor a 1, establecer en 1
      if (r.cantidadMover < 1) {
        r.cantidadMover = 1;
      }

      // Si es mayor a la cantidad disponible, limitar al máximo
      if (r.cantidadMover > r.cantidad) {
        r.cantidadMover = r.cantidad;
      }
    },

    clampCantidad(r) {
      if (!r.cantidadMover || r.cantidadMover < 1) r.cantidadMover = 1;
      if (r.cantidadMover > r.cantidad) r.cantidadMover = r.cantidad;
    },

    // Filtrar grupos cuando se selecciona un cliente de Perseo
    filtrarPorCliente() {
      // Limpiar selección al cambiar de cliente o al limpiar el select
      this.selected = [];
      this.observacionIntercambio = '';
      // Forzar actualización de la vista
      this.$forceUpdate();
    },

    // Filtrar grupos cuando se selecciona una empresa
    filtrarPorEmpresa() {
      // Limpiar selección al cambiar de empresa o al limpiar el select
      this.selected = [];
      this.observacionIntercambio = '';
      // Forzar actualización de la vista
      this.$forceUpdate();
    },

    // Validar que el porcentaje esté entre 0 y 100
    validarPorcentaje() {
      this.errorPorcentaje = false;

      if (this.porcentajeDescuento < 0) {
        this.porcentajeDescuento = 0;
        this.errorPorcentaje = true;
      }

      if (this.porcentajeDescuento > 100) {
        this.porcentajeDescuento = 100;
        this.errorPorcentaje = true;
      }
    },

    // Mostrar preview antes de confirmar
    mostrarPreview() {
      if (!this.selectedTipo) {
        this.$vs.notify({ text: 'Seleccione tipo de documento destino', color: 'warning' });
        return;
      }

      if (!this.selectedEmpresa) {
        this.$vs.notify({ text: 'Seleccione la empresa destino', color: 'warning' });
        return;
      }

      if (!this.selected || this.selected.length === 0) {
        this.$vs.notify({ text: 'No hay filas seleccionadas', color: 'warning' });
        return;
      }

      // Validar observación del intercambio
      const observacionTrim = this.observacionIntercambio.trim();
      if (!observacionTrim) {
        this.errorObservacion = 'La observación es obligatoria';
        this.$vs.notify({ text: 'La observación es obligatoria', color: 'warning' });
        return;
      }

      if (observacionTrim.length < 3) {
        this.errorObservacion = 'La observación debe tener mínimo 3 caracteres';
        this.$vs.notify({ text: 'La observación debe tener mínimo 3 caracteres', color: 'warning' });
        return;
      }

      this.errorObservacion = '';
      this.showPreview = true;
    },

    // Confirmar y generar el documento
    async confirmarGeneracion() {
      this.showPreview = false;
      await this.moverSeleccionados();
    },

    // mover todos los seleccionados en un solo request
    async moverSeleccionados() {
      if (!this.selectedTipo) {
        this.$vs.notify({ text: 'Seleccione tipo de documento destino', color: 'warning' });
        return;
      }

      if (!this.selectedEmpresa) {
        this.$vs.notify({ text: 'Seleccione la empresa destino', color: 'warning' });
        return;
      }

      if (!this.selectedTipoVenta) {
        this.$vs.notify({ text: 'Seleccione el tipo de venta', color: 'warning' });
        return;
      }

      if (!this.selected || this.selected.length === 0) {
        this.$vs.notify({ text: 'No hay filas seleccionadas', color: 'warning' });
        return;
      }

      const payload = this.selected.map(i => ({
        documento: i.documento || '',
        id_empresa: i.id_empresa || 0,
        pro_codigo: i.pro_codigo,
        id_cliente: i.id_cliente || 0,
        cantidad: Number(i.cantidadMover),
        det_ven_valor_u: i.det_ven_valor_u || 0
      }));

      // Validar cantidades antes de enviar
      for (const it of payload) {
        if (it.cantidad < 1) {
          this.$vs.notify({ text: `La cantidad para ${it.pro_codigo} debe ser al menos 1`, color: 'warning' });
          return;
        }
        const found = this.grupos.find(g =>
          g.pro_codigo === it.pro_codigo &&
          (g.documento || '') === (it.documento || '') &&
          g.id_empresa === it.id_empresa
        );
        if (found && it.cantidad > found.cantidad) {
          this.$vs.notify({
            text: `La cantidad a mover (${it.cantidad}) para ${it.pro_codigo} no puede ser mayor a la disponible (${found.cantidad})`,
            color: 'danger'
          });
          return;
        }
      }

      try {
        this.$vs.loading();
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const form = new FormData();
        form.append('intercambiarCodigosDocumento', 1);
        form.append('id_documento_origen', this.header.id);
        form.append('codigo_devolucion', this.header.codigo_devolucion);
        form.append('tdo_id', this.selectedTipo.tdo_id || this.selectedTipo);
        form.append('id_empresa', this.selectedEmpresa.id_empresa);
        form.append('id_usuario', usuario.idusuario);
        form.append('iniciales', usuario.iniciales || '');
        form.append('detalle_venta', JSON.stringify(payload));
        form.append('periodo_id', this.header.periodo_id);
        form.append('tipo_venta', this.selectedTipoVenta.id);
        form.append('porcentaje_descuento', this.porcentajeDescuento);
        form.append('id_cliente_perseo', this.selectedClientePerseo.id);
        form.append('observacion_intercambio', this.observacionIntercambio.trim());
        const res = await this.$http.post(this.$server_url + 'devoluciones', form);
        if (res.data.status === 0) {
          this.$vs.notify({ text: res.data.message || 'Error', color: 'danger' });
        } else {
          this.$vs.notify({ text: res.data.message || 'Genero nuevo documento '+res.data.ven_codigo, color: 'success' ,time:7000 });
          await this.fetchGrupos();
          await this.f_traerDocumentosGenerados();
          this.$emit('moved');
        }
      } catch (e) {
        console.error(e);
        this.$vs.notify({ text: 'Error moviendo códigos', color: 'danger' });
      } finally {
        this.$vs.loading.close();
      }
    },

    exportarExcel() {
      try {
        // Crear el contenido HTML de la tabla
        let html = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="utf-8">
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #007bff; color: white; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>Intercambio de Códigos</h2>
            <p><strong>Documento origen:</strong> ${this.header.codigo_devolucion}</p>
            <p><strong>Tipo de documento destino:</strong> ${this.selectedTipo ? this.selectedTipo.tdo_nombre : '-'}</p>
            <p><strong>Empresa destino:</strong> ${this.selectedEmpresa ? this.selectedEmpresa.nombre : '-'}</p>
            <p><strong>Tipo de venta:</strong> ${this.selectedTipoVenta ? this.selectedTipoVenta.nombre : '-'}</p>
            <p><strong>Porcentaje de descuento:</strong> ${this.porcentajeDescuento}%</p>
            <p><strong>Cliente Perseo:</strong> ${this.selectedClientePerseo ? this.selectedClientePerseo.nombre : 'Todos'}</p>
            <p><strong>Total de items:</strong> ${this.selected.length}</p>
            <p><strong>Total libros a mover:</strong> ${this.totalLibrosAMover}</p>
            <br>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre del Libro</th>
                  <th>Empresa</th>
                  <th>Documento</th>
                  <th>Cliente Perseo</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
        `;

        this.selected.forEach(item => {
          html += `
            <tr>
              <td>${item.pro_codigo}</td>
              <td>${item.nombrelibro || '-'}</td>
              <td>${this.descripcionEmpresa(item.id_empresa)}</td>
              <td>${item.documento || '-'}</td>
              <td>${item.clientePerseo || 'Sin cliente'}</td>
              <td style="text-align: center;">${item.cantidadMover}</td>
            </tr>
          `;
        });

        html += `
              </tbody>
            </table>
          </body>
          </html>
        `;

        // Crear el blob y descargar
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fecha = new Date().toISOString().split('T')[0];
        link.download = `intercambio_codigos_${this.header.codigo_devolucion}_${fecha}.xls`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.$vs.notify({
          text: 'Archivo Excel exportado correctamente',
          color: 'success'
        });
      } catch (e) {
        console.error(e);
        this.$vs.notify({
          text: 'Error al exportar a Excel',
          color: 'danger'
        });
      }
    }
  }
};
</script>

<style scoped>
.p-4{padding:1rem}
.mb-4{margin-bottom:1rem}
.mt-4{margin-top:1rem}
.flex{display:flex}
.justify-between{justify-content:space-between}
.items-center{align-items:center}

/* Contenedor de filtros en fila */
.filters-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.filter-item .w-full {
  width: 100%;
}

.select-wrapper {
  width: 100%;
  max-width: 400px;
}

/* Responsive: en móvil cada filtro ocupa toda la fila */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
    min-width: 100%;
  }

  .select-wrapper {
    max-width: 100%;
  }
}

.input-error >>> input {
  border-color: #ff4757 !important;
  background-color: #fff5f5 !important;
}

.text-danger {
  color: #ff4757;
}

.text-xs {
  font-size: 0.75rem;
  display: block;
  margin-top: 2px;
}

/* Popup de preview con z-index alto */
.popup-preview  {
  z-index: 51009 !important;
}



.preview-container {
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.info-section {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.detail-section {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.section-title {
  font-weight: 700;
  color: #333;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #007bff;
}

.table-responsive {
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.preview-table thead {
  background: #007bff;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.preview-table th,
.preview-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.preview-table tbody tr:hover {
  background-color: #f8f9fa;
}

.preview-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.buttons-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}

.font-bold {
  font-weight: 700;
}

/* Documentos Generados */
.documentos-generados {
  background: #e8f5e9;
  border: 2px solid #4caf50;
  border-radius: 8px;
  padding: 1rem;
}

.titulo-documentos {
  font-weight: 600;
  color: #2e7d32;
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.lista-documentos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.documento-badge {
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Contador de selección */
.seleccion-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.seleccion-badge {
  background: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.seleccion-badge i {
  font-size: 1rem;
}

.seleccion-badge strong {
  font-size: 1.1rem;
}

.libros-badge {
  background: #FF9800;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.libros-badge i {
  font-size: 1rem;
}

.libros-badge strong {
  font-size: 1.1rem;
}

/* Estilos para textarea */
.filter-item >>> .vs-textarea {
  min-height: 80px;
  resize: vertical;
}

.text-danger {
  color: #ff4757;
}
</style>
