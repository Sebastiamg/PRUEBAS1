<template>
  <div class="p-4">
    <h3 class="mb-4">Histórico de Códigos de Devolución</h3>

    <!-- Filtros -->
    <div class="filters-container mb-4">
      <div class="filter-item">
        <label>Buscar por código:</label>
        <vs-input
          v-model="busquedaCodigo"
          placeholder="Ej: SMCM3-0YTREB7XP3"
          class="w-full"
        />
      </div>

      <div class="filter-item">
        <label>Buscar por documento devolución:</label>
        <vs-input
          v-model="busquedaDocumento"
          placeholder="Ej: DEV-001"
          class="w-full"
        />
      </div>

      <div class="filter-item">
        <label>Buscar por cliente:</label>
        <vs-input
          v-model="busquedaCliente"
          placeholder="Ej: Instituto..."
          class="w-full"
        />
      </div>
    </div>

    <!-- Tabla de histórico -->
    <vs-table
      :data="historicoFiltrado"
      stripe
      pagination
      max-items="10"
      search
    >
      <template slot="header">
        <vs-chip color="primary">
          Total registros: <b>{{ historicoFiltrado.length }}</b>
        </vs-chip>
      </template>

      <template slot="thead">
        <vs-th>Código</vs-th>
        <vs-th>Documento Devolución</vs-th>
        <vs-th>Cliente</vs-th>
        <vs-th>Período</vs-th>
        <vs-th>Usuario Creador</vs-th>
        <vs-th>Observación</vs-th>
        <vs-th>Descripción</vs-th>
        <vs-th>Fecha Creación</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :data="tr" :key="idx" v-for="(tr, idx) in data">
          <vs-td>
            <span class="codigo-text">{{ tr.codigo }}</span> <br>
            <b>Libro:</b> {{ tr.nombrelibro || '-' }}
          </vs-td>
          <vs-td>
            <strong>{{ tr.codigo_devolucion || '-' }}</strong>
          </vs-td>
          <vs-td>
            <div>
              <p><strong>{{ tr.nombreInstitucion || 'Sin cliente' }}</strong></p>
              <p v-if="tr.idInstitucion" class="text-xs text-gray-600">
                #{{ tr.idInstitucion }}
              </p>
            </div>
          </vs-td>
          <vs-td>
            <p>{{ tr.periodoescolar || '-' }}</p>
          </vs-td>
          <vs-td>
            <div>
              <p>{{ tr.usuario_nombres || '-' }} {{ tr.usuario_apellidos || '' }}</p>
            </div>
          </vs-td>
          <vs-td>
            <div
              v-if="tr.observacion"
              class="observacion-text"
              @click="verObservacion(tr.observacion)"
            >
              {{ truncar(tr.observacion, 40) }}
              <vs-icon icon="info_outline" size="small" class="cursor-pointer"></vs-icon>
            </div>
            <span v-else class="text-gray-400">Sin observación</span>
          </vs-td>
          <vs-td>
            <div
              v-if="tr.descripcion"
              class="descripcion-text"
              @click="verDescripcion(tr.descripcion)"
            >
              {{ truncar(tr.descripcion, 40) }}
              <vs-icon icon="info_outline" size="small" class="cursor-pointer"></vs-icon>
            </div>
            <span v-else class="text-gray-400">Sin descripción</span>
          </vs-td>
          <vs-td>
            <p class="text-xs">{{ formatearFecha(tr.created_at) }}</p>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <!-- Modal para ver observación completa -->
    <vs-popup class="popup-historico-detalle" title="Observación Completa" :active.sync="mostrarModal">
      <div class="modal-content">
        <vs-textarea v-model="contenidoModal" disabled rows="8" />
      </div>
    </vs-popup>
  </div>
</template>

<script>
import Generalmix from '@/mixins/Generalmix';
import moment from 'moment';

export default {
  mixins: [Generalmix],
  props: {
    arrayHistorico: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      busquedaCodigo: '',
      busquedaDocumento: '',
      busquedaCliente: '',
      mostrarModal: false,
      contenidoModal: ''
    };
  },
  computed: {
    historicoFiltrado() {
      return this.arrayHistorico.filter(item => {
        const codigoMatch = !this.busquedaCodigo ||
          (item.codigo && item.codigo.toLowerCase().includes(this.busquedaCodigo.toLowerCase()));

        const documentoMatch = !this.busquedaDocumento ||
          (item.codigo_devolucion && item.codigo_devolucion.toLowerCase().includes(this.busquedaDocumento.toLowerCase()));

        const clienteMatch = !this.busquedaCliente ||
          (item.nombreInstitucion && item.nombreInstitucion.toLowerCase().includes(this.busquedaCliente.toLowerCase()));

        return codigoMatch && documentoMatch && clienteMatch;
      });
    }
  },
  methods: {
    truncar(texto, longitud) {
      if (!texto) return '';
      if (texto.length > longitud) {
        return texto.substring(0, longitud) + '...';
      }
      return texto;
    },
    formatearFecha(fecha) {
      if (!fecha) return '-';
      return moment(fecha).format('DD/MM/YYYY HH:mm');
    },
    verObservacion(observacion) {
      this.contenidoModal = observacion || '';
      this.mostrarModal = true;
    },
    verDescripcion(descripcion) {
      this.contenidoModal = descripcion || '';
      this.mostrarModal = true;
    }
  }
};
</script>

<style scoped>
.p-4 {
  padding: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.w-full {
  width: 100%;
}

/* Filtros */
.filters-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

/* Códigos texto */
.codigo-text {
  color: #2c6cb0;
  font-weight: 600;
  font-size: 0.85rem;
  font-family: monospace;
  border: 1px solid #2c6cb0;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
}

/* Textos interactivos */
.observacion-text,
.descripcion-text {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.3s ease;
}

.observacion-text:hover,
.descripcion-text:hover {
  color: #0056b3;
}

/* Texto gris */
.text-gray-400 {
  color: #999;
}

.text-gray-600 {
  color: #666;
}

.text-xs {
  font-size: 0.75rem;
}

/* Modal content */
.modal-content {
  padding: 1rem;
}

.modal-content >>> .vs-textarea {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
    min-width: 100%;
  }
}
</style>

<style>
/* Z-index alto para el popup interno */
.popup-historico-detalle .vs-popup {
  z-index: 999999 !important;
}
.popup-historico-detalle .vs-popup--background {
  z-index: 999998 !important;
}
</style>
