<template>
  <!-- Modal estado de escaneo -->
  <vs-popup title="Estado del Escaneo" :active.sync="isActive" fullscreen>
    <div class="estado-escaneo-container">
      <div v-if="escaneoFinalizado" class="escaneo-completado">
        <div class="icon-container success">
          <i class="fa-solid fa-check" style="font-size: 64px;"></i>
        </div>
        <h3 class="titulo-escaneo">¡Escaneo Finalizado!</h3>
        <p class="mensaje-escaneo">Se han escaneado todos los códigos del documento.</p>
        <!-- Documento de venta -->
        <div class="documento-venta-info" v-if="documentoVenta">
          <i class="fa fa-file-text-o"></i>
          <span><strong>Documento:</strong> {{ documentoVenta }}</span>
        </div>

        <!-- Tabla de información del documento -->
        <div class="tabla-documento-container" v-if="informacionDocumento.length > 0">
          <h4 class="titulo-tabla">Detalle del Documento</h4>
          <div class="table-responsive">
            <table class="tabla-documento">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Subido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in informacionDocumento" :key="index" :class="{'combo-row': item.ifcombo == 1}">
                  <td><strong>{{ item.pro_codigo }}</strong></td>
                  <td>
                    <div class="producto-info">
                      <p class="producto-nombre">{{ item.pro_nombre }}</p>
                      <p class="producto-desc" v-if="item.ifcombo == 1">{{ item.pro_descripcion }}</p>
                    </div>
                  </td>
                  <td>
                    <span v-if="item.ifcombo == 1" class="badge badge-combo">
                      <i class="fa fa-cubes"></i> Combo
                    </span>
                    <span v-else class="badge badge-individual">
                      <i class="fa fa-book"></i> Individual
                    </span>
                  </td>
                  <td class="text-center"><strong>{{ item.det_ven_cantidad }}</strong></td>
                  <td class="text-center">
                    <span :class="item.det_ven_cantidad_despacho >= item.det_ven_cantidad ? 'text-success' : 'text-warning'">
                      <strong>{{ item.det_ven_cantidad_despacho }}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else class="escaneo-incompleto">
        <div class="icon-container warning">
          <i class="fa fa-exclamation-triangle" style="font-size: 64px;"></i>
        </div>
        <h3 class="titulo-escaneo">Escaneo Incompleto</h3>
        <p class="mensaje-escaneo">Aún faltan códigos por escanear</p>
        <!-- Documento de venta -->
        <div class="documento-venta-info" v-if="documentoVenta">
          <i class="fa fa-file-text-o"></i>
          <span><strong>Documento:</strong> {{ documentoVenta }}</span>
        </div>

        <!-- Tabla de información del documento -->
        <div class="tabla-documento-container" v-if="informacionDocumento.length > 0">
          <h4 class="titulo-tabla">Detalle del Documento</h4>
          <div class="table-responsive">
            <table class="tabla-documento">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Subido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in informacionDocumento" :key="index" :class="{'combo-row': item.ifcombo == 1}">
                  <td><strong>{{ item.pro_codigo }}</strong></td>
                  <td>
                    <div class="producto-info">
                      <p class="producto-nombre">{{ item.pro_nombre }}</p>
                      <p class="producto-desc" v-if="item.ifcombo == 1">{{ item.pro_descripcion }}</p>
                    </div>
                  </td>
                  <td>
                    <span v-if="item.ifcombo == 1" class="badge badge-combo">
                      <i class="fa fa-cubes"></i> Combo
                    </span>
                    <span v-else class="badge badge-individual">
                      <i class="fa fa-book"></i> Individual
                    </span>
                  </td>
                  <td class="text-center"><strong>{{ item.det_ven_cantidad }}</strong></td>
                  <td class="text-center">
                    <span :class="item.det_ven_cantidad_despacho >= item.det_ven_cantidad ? 'text-success' : 'text-warning'">
                      <strong>{{ item.det_ven_cantidad_despacho }}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <p class="text-danger" v-if="mostrarMensajeProblemas"><i class="fa-solid fa-triangle-exclamation"></i> No se subieron algunos códigos debido a problemas.</p>
      </div>
      <div class="acciones-modal">
        <template v-if="escaneoFinalizado">
          <vs-button @click="handleDespachar" color="warning" type="filled" class="mr-2">
            <i class="fa fa-truck"></i> Iniciar proceso de empaque
          </vs-button>
          <vs-button @click="handleCerrar" color="dark" type="border">
            Cerrar
          </vs-button>
        </template>
        <template v-else>
          <vs-button @click="handleCerrar" color="primary" type="filled">
            Aceptar
          </vs-button>
        </template>
      </div>
    </div>
  </vs-popup>
</template>

<script>
export default {
  name: 'GestionBodegaResultadoDocumento',
  props: {
    active: {
      type: Boolean,
      required: true
    },
    escaneoFinalizado: {
      type: Boolean,
      default: false
    },
    documentoVenta: {
      type: String,
      default: ''
    },
    informacionDocumento: {
      type: Array,
      default: () => []
    },
    mostrarMensajeProblemas: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive: {
      get() {
        return this.active
      },
      set(value) {
        this.$emit('update:active', value)
      }
    }
  },
  methods: {
    handleDespachar() {
      this.$emit('despachar')
    },
    handleCerrar() {
      this.$emit('cerrar')
    }
  }
}
</script>

<style scoped>
/* Estilos para el modal de estado de escaneo */
.estado-escaneo-container {
  padding: 30px 20px;
  text-align: center;
}

.escaneo-completado,
.escaneo-incompleto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.icon-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.icon-container.success {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
}

.icon-container.warning {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.3);
}

.titulo-escaneo {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 10px 0;
}

.mensaje-escaneo {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.acciones-modal {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.acciones-modal button {
  min-width: 150px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
}

/* Estilos para documento de venta */
.documento-venta-info {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px;
  border-radius: 8px;
  margin: 15px auto;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
  border-left: 4px solid #667eea;
}

.escaneo-completado .documento-venta-info {
  background: rgba(76, 175, 80, 0.15);
  border-left-color: #4caf50;
}

.escaneo-incompleto .documento-venta-info {
  background: rgba(255, 152, 0, 0.15);
  border-left-color: #ff9800;
}

.documento-venta-info i {
  font-size: 18px;
  color: #667eea;
}

.escaneo-completado .documento-venta-info i {
  color: #4caf50;
}

.escaneo-incompleto .documento-venta-info i {
  color: #ff9800;
}

.documento-venta-info span {
  font-size: 14px;
}

.documento-venta-info strong {
  font-weight: 700;
  margin-right: 5px;
}

.acciones-modal .mr-2 {
  margin-right: 10px;
}

/* Estilos para tabla de información del documento */
.tabla-documento-container {
  width: 100%;
  max-width: 900px;
  margin: 25px auto;
  text-align: left;
}

.titulo-tabla {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-left: 5px;
  border-left: 4px solid #667eea;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tabla-documento {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  font-size: 14px;
}

.tabla-documento thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tabla-documento thead th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-documento thead th:first-child {
  border-top-left-radius: 8px;
}

.tabla-documento thead th:last-child {
  border-top-right-radius: 8px;
}

.tabla-documento tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.tabla-documento tbody tr:hover {
  background-color: #f5f5f5;
}

.tabla-documento tbody tr:last-child {
  border-bottom: none;
}

.tabla-documento tbody td {
  padding: 12px 15px;
  vertical-align: middle;
}

.combo-row {
  background-color: #fff8e1 !important;
}

.combo-row:hover {
  background-color: #fff3cd !important;
}

.producto-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.producto-nombre {
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.producto-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
  font-style: italic;
  line-height: 1.3;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-combo {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.2);
}

.badge-individual {
  background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.text-center {
  text-align: center !important;
}

.text-success {
  color: #4caf50 !important;
  font-weight: 700;
}

.text-warning {
  color: #ff9800 !important;
  font-weight: 700;
}

.text-danger {
  color: #f44336 !important;
}
</style>
