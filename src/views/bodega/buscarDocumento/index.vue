<template>
  <div class="tabla-documento-venta">
    <!-- Buscador -->
    <div class="mb-4 flex justify-between items-center flex-wrap">
      <div class="w-full md:w-1/3">
        <vs-input
          v-model="filtroBusqueda"
          placeholder="Buscar por código o nombre..."
          icon-pack="feather"
          icon="icon-search"
          class="w-full"
          @input="filtrarTabla"
        >
          <template #icon-right v-if="filtroBusqueda">
            <feather-icon icon="XIcon" @click="limpiarFiltro" class="cursor-pointer"/>
          </template>
        </vs-input>
      </div>
      <div class="mt-2 md:mt-0">
        <span class="text-muted">
          Mostrando {{ detallesFiltrados.length }} de {{ detalles.length }} productos
        </span>
      </div>
    </div>

    <!-- Tabla de resultados -->
    <vs-table
      :data="detallesFiltrados"
      stripe
      hover
      :loading="cargando"
      max-height="500"
    >
      <template slot="header">
        <div class="flex justify-between items-center w-full">
          <h4 class="mb-0">Documento: {{ documentoVenta }}</h4>
          <vs-button
            color="success"
            type="gradient"
            size="small"
            icon-pack="feather"
            icon="icon-download"
            @click="exportarCSV"
            :disabled="!detalles.length"
          >
            Exportar
          </vs-button>
        </div>
      </template>

      <template slot="thead">
        <vs-th sort-key="pro_codigo">Código</vs-th>
        <vs-th sort-key="pro_nombre">Nombre del Libro</vs-th>
        <vs-th sort-key="det_ven_cantidad" class="text-center">Vendido</vs-th>
        <vs-th sort-key="det_ven_cantidad_despacho" class="text-center">Despachado</vs-th>
        <vs-th sort-key="pendiente" class="text-center">Pendiente</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr :key="index" v-for="(item, index) in data">
          <vs-td class="font-mono">
            <code class="text-primary">{{ item.pro_codigo }}</code>
          </vs-td>
          <vs-td>
            <span class="font-weight-bold">{{ item.pro_nombre }}</span>
          </vs-td>
          <vs-td class="text-center">
            <vs-chip color="primary" class="px-3">
              {{ formatNumber(item.det_ven_cantidad) }}
            </vs-chip>
          </vs-td>
          <vs-td class="text-center">
            <vs-chip color="success" class="px-3">
              {{ formatNumber(item.det_ven_cantidad_despacho) }}
            </vs-chip>
          </vs-td>
          <vs-td class="text-center">
            <vs-chip :color="getPendienteColor(item)" class="px-3">
              {{ formatNumber(calcularPendiente(item)) }}
            </vs-chip>
          </vs-td>
        </vs-tr>
      </template>

      <template slot="empty">
        <div class="text-center py-8" v-if="!cargando">
          <feather-icon icon="InboxIcon" size="48" class="text-muted"/>
          <p class="mt-2" v-if="!filtroBusqueda">
            No se encontraron productos para este documento
          </p>
          <p class="mt-2" v-else>
            No hay resultados para "{{ filtroBusqueda }}"
          </p>
        </div>
      </template>
    </vs-table>

    <!-- Resumen de totales -->
    <div class="mt-4" v-if="detalles.length > 0">
      <vs-card>
        <div class="flex justify-between items-center flex-wrap">
          <div>
            <feather-icon icon="PieChartIcon" class="mr-1"/>
            <strong>Resumen del Documento: {{ documentoVenta }}</strong>
          </div>
          <div class="mt-2 sm:mt-0">
            <span class="mr-4">
              <strong>Total Vendido:</strong> 
              <vs-chip color="primary" class="ml-1">{{ formatNumber(totalVendido) }}</vs-chip>
            </span>
            <span class="mr-4">
              <strong>Total Despachado:</strong> 
              <vs-chip color="success" class="ml-1">{{ formatNumber(totalDespachado) }}</vs-chip>
            </span>
            <span>
              <strong>Total Pendiente:</strong> 
              <vs-chip :color="totalPendiente > 0 ? 'warning' : 'dark'" class="ml-1">
                {{ formatNumber(totalPendiente) }}
              </vs-chip>
            </span>
          </div>
        </div>
      </vs-card>
    </div>

    <!-- Mensaje de error -->
    <vs-alert
      v-if="errorMessage"
      color="danger"
      title="Error"
      active="true"
      class="mt-4"
      @close="errorMessage = null"
    >
      <p>{{ errorMessage }}</p>
    </vs-alert>

    <!-- Loading overlay -->
    <vs-popup
      class="holamundo"
      title="Cargando..."
      :active.sync="cargandoPopup"
      :close-icon="false"
    >
      <div class="text-center">
        <!-- <vs-loading background-color="#fff" class="mb-4" /> -->
        <p>Cargando datos del documento...</p>
      </div>
    </vs-popup>
  </div>
</template>

<script>
export default {
  name: 'CantidadCodigosDespachados',
  props: {
    documentoVenta: {
      type: String,
      required: true,
      validator: function(value) {
        return value && value.trim().length > 0
      }
    },
    apiUrl: {
      type: String,
  default: 'documentoDespachadoCantidades'  // ← Quita la barra al inicio
    }
  },
  data() {
    return {
      detalles: [],
      detallesOriginales: [],
      filtroBusqueda: '',
      cargando: false,
      cargandoPopup: false,
      errorMessage: null,
      refreshTimer: null
    }
  },
  computed: {
    detallesFiltrados() {
      if (!this.filtroBusqueda) {
        return this.detalles
      }
      const busqueda = this.filtroBusqueda.toLowerCase()
      return this.detalles.filter(item => {
        return item.pro_codigo.toLowerCase().includes(busqueda) ||
               item.pro_nombre.toLowerCase().includes(busqueda)
      })
    },
    totalVendido() {
      return this.detalles.reduce((total, item) => total + (item.det_ven_cantidad || 0), 0)
    },
    totalDespachado() {
      return this.detalles.reduce((total, item) => total + (item.det_ven_cantidad_despacho || 0), 0)
    },
    totalPendiente() {
      return this.detalles.reduce((total, item) => {
        const pendiente = (item.det_ven_cantidad || 0) - (item.det_ven_cantidad_despacho || 0)
        return total + pendiente
      }, 0)
    }
  },
  mounted() {
    this.cargarDatos()
  },
  watch: {
    documentoVenta: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          this.cargarDatos()
        }
      },
      immediate: false
    }
  },
  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },
  methods: {
    cargarDatos() {
      if (!this.documentoVenta || this.documentoVenta.trim() === '') {
        this.errorMessage = 'No se ha especificado un documento de venta'
        this.$emit('error', this.errorMessage)
        return
      }

      this.cargando = true
      this.cargandoPopup = true
      this.errorMessage = null

      // Usando this.$http como en tu ejemplo
    //   this.$http.get(this.$server_url + this.apiUrl, {
    //     params: {
    //       documento: this.documentoVenta
    //     }
    //   })
      this.$http.post(this.$server_url + this.apiUrl, {
            documento: this.documentoVenta
        })
      .then(response => {
        // Verificar la estructura de tu respuesta
        const data = response.data
        
        if (data.success || data.status === 'success') {
          // Ajusta según la estructura de tu respuesta
          const detallesData = data.data && data.data.detalles ? data.data.detalles : data.detalles
          
          this.detallesOriginales = detallesData || []
          this.detalles = [...this.detallesOriginales]
          
          this.$emit('datos-cargados', {
            documento: this.documentoVenta,
            detalles: this.detalles,
            totales: {
              vendido: this.totalVendido,
              despachado: this.totalDespachado,
              pendiente: this.totalPendiente
            }
          })

          // Mostrar notificación de éxito
          this.$vs.notify({
            title: 'Éxito',
            text: 'Documento ' + this.documentoVenta + ' cargado correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check-circle'
          })
        } else {
          const errorMsg = data.message || data.msg || 'Error al cargar los datos'
          this.errorMessage = errorMsg
          this.detalles = []
          this.detallesOriginales = []
          this.$emit('error', this.errorMessage)
          
          this.$vs.notify({
            title: 'Error',
            text: this.errorMessage,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        }
      })
      .catch(error => {
        console.error('Error en la petición:', error)
        
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            this.errorMessage = error.response.data.message
          } else if (error.response.data.errors) {
            const errores = Object.values(error.response.data.errors).flat()
            this.errorMessage = errores.join(', ')
          } else if (error.response.data.msg) {
            this.errorMessage = error.response.data.msg
          } else {
            this.errorMessage = 'Error al procesar la solicitud'
          }
        } else if (error.request) {
          this.errorMessage = 'No se recibió respuesta del servidor'
        } else {
          this.errorMessage = 'Error de conexión: ' + error.message
        }
        
        this.detalles = []
        this.detallesOriginales = []
        this.$emit('error', this.errorMessage)
        
        this.$vs.notify({
          title: 'Error',
          text: this.errorMessage,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
      .finally(() => {
        this.cargando = false
        setTimeout(() => {
          this.cargandoPopup = false
        }, 500)
      })
    },

    filtrarTabla() {
      this.$emit('filtro-aplicado', {
        filtro: this.filtroBusqueda,
        resultados: this.detallesFiltrados.length
      })
    },

    limpiarFiltro() {
      this.filtroBusqueda = ''
      this.filtrarTabla()
    },

    recargarDatos() {
      this.cargarDatos()
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '0'
      return value.toLocaleString('es-ES')
    },

    calcularPendiente(item) {
      return (item.det_ven_cantidad || 0) - (item.det_ven_cantidad_despacho || 0)
    },

    getPendienteColor(item) {
      const pendiente = this.calcularPendiente(item)
      if (pendiente === 0) return 'dark'
      if (pendiente < 10) return 'warning'
      return 'danger'
    },

    exportarCSV() {
      if (!this.detalles.length) {
        this.$vs.notify({
          title: 'Error',
          text: 'No hay datos para exportar',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }

      // Crear contenido CSV
      const headers = ['Código', 'Nombre del Libro', 'Vendido', 'Despachado', 'Pendiente']
      const rows = this.detalles.map(item => [
        item.pro_codigo,
        item.pro_nombre,
        item.det_ven_cantidad,
        item.det_ven_cantidad_despacho,
        this.calcularPendiente(item)
      ])

      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n')

      // Crear blob y descargar
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.href = url
      link.setAttribute('download', 'documento_' + this.documentoVenta + '_' + Date.now() + '.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      this.$emit('exportado', this.documentoVenta)
      
      this.$vs.notify({
        title: 'Éxito',
        text: 'Documento exportado correctamente',
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check-circle'
      })
    }
  }
}
</script>

<style scoped>
.tabla-documento-venta code {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85em;
}

.tabla-documento-venta .vs-table {
  border-radius: 8px;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}
</style>