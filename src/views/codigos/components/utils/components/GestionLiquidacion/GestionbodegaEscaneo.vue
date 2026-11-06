<template>
  <vs-popup title="Seleccionar Sesión de Escaneo" :active.sync="activePopup" @close="cerrar">
    <div class="escaneo-modal-container">
      <div class="escaneo-header">
        <i class="fa fa-barcode"></i>
        <div>
          <h3>Sesiones de escaneo</h3>
          <p>Seleccione una sesión para continuar con la importación</p>
        </div>
      </div>

      <!-- Banner: documento completamente despachado -->
      <div v-if="documentoCompleto" class="banner-completo">
        <div class="banner-completo-icon"><i class="fa fa-check-circle"></i></div>
        <div class="banner-completo-text">
          <strong>Documento subido en su totalidad</strong>
          <span>Todos los ítems han sido despachados. Puede iniciar el proceso de empaque.</span>
        </div>
      </div>

      <!-- Filtros por estado -->
      <div class="filtros-estado">
        <div class="radio-group">
          <label class="radio-option" :class="{ 'active': filtroEstado === 2 }">
            <input type="radio" v-model="filtroEstado" :value="2" name="filtroEstado">
            <span class="radio-label"><i class="fa fa-check-circle"></i> Finalizadas</span>
            <span class="badge badge-success">{{ contarPorEstado(2) }}</span>
          </label>
          <label class="radio-option" :class="{ 'active': filtroEstado === 1 }">
            <input type="radio" v-model="filtroEstado" :value="1" name="filtroEstado">
            <span class="radio-label"><i class="fa fa-clock-o"></i> Proceso de escaneo</span>
            <span class="badge badge-warning">{{ contarPorEstado(1) }}</span>
          </label>
          <label class="radio-option" :class="{ 'active': filtroEstado === 3 }">
            <input type="radio" v-model="filtroEstado" :value="3" name="filtroEstado">
            <span class="radio-label"><i class="fa fa-times-circle"></i> Cerradas</span>
            <span class="badge badge-danger">{{ contarPorEstado(3) }}</span>
          </label>
        </div>
      </div>

      <div class="hint-solo-finalizadas">
        <i class="fa fa-info-circle"></i>
        Solo las sesiones <strong>finalizadas</strong> pueden ser confirmadas.
      </div>

      <div v-if="sesionesFiltradas.length === 0" class="no-sesiones">
        <i class="fa fa-exclamation-triangle"></i>
        <p>No hay sesiones de escaneo activas</p>
      </div>

      <div v-else class="sesiones-grid">
        <div
          v-for="sesion in sesionesFiltradas"
          :key="sesion.id"
          class="sesion-card"
          :class="{
            'selected': escaneoSelected === sesion.id,
            'no-seleccionable': documentoCompleto
          }"
          @click="!documentoCompleto && seleccionarSesion(sesion)">
          <div class="sesion-header">
            <div class="sesion-icon"><i class="fa fa-user-circle"></i></div>
            <div class="sesion-info">
              <span class="usuario-nombre">{{ sesion.nombreUsuario }}</span>
              <span class="sesion-meta">
                #{{ sesion.id }} &nbsp;·&nbsp;
                {{ formatearFecha(sesion.fecha_inicio) }} &nbsp;·&nbsp;
                <b>{{ sesion.codigos_subidos }}</b> códigos
              </span>
            </div>
            <span :class="['estado-badge', estadoClass(sesion.estado)]">{{ sesion.estadoEscaneo }}</span>
            <i v-if="escaneoSelected === sesion.id" class="fa fa-check-circle check-icon"></i>
          </div>
          <div v-if="sesion.observaciones" class="sesion-obs">
            <i class="fa fa-comment-o"></i> {{ sesion.observaciones }}
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="acciones-modal justify-center">
        <!-- Documento completo: botón empaque con confirm, no requiere selección -->
        <vs-button
          v-if="documentoCompleto"
          @click="showConfirmEmpaque = true"
          color="success"
          type="filled">
          <i class="fa fa-box"></i>
          Iniciar proceso de empaque
        </vs-button>
        <!-- Normal: confirmar sesión -->
        <vs-button
          v-else
          @click="confirmarSeleccion"
          color="primary"
          type="filled"
          :disabled="!escaneoSelectedFinalizada">
          <i class="fa fa-check"></i>
          Confirmar Sesión
        </vs-button>
        <vs-button @click="cerrar" color="danger" type="border">Cancelar</vs-button>
      </div>
    </div>

    <!-- Popup de confirmación de empaque (z-index superior) -->
    <vs-popup
      title="Iniciar proceso de empaque"
      :active.sync="showConfirmEmpaque"
      class="confirm-empaque-popup">
      <div class="confirm-empaque-body">
        <div class="confirm-empaque-icon"><i class="fa fa-box"></i></div>
        <p class="confirm-empaque-text">
          El documento ha sido subido en su totalidad.<br>
          ¿Desea iniciar el proceso de empaque ahora?
        </p>
        <div class="confirm-empaque-actions">
          <vs-button color="success" type="filled" @click="ejecutarEmpaque">
            <i class="fa fa-check"></i> Sí, iniciar empaque
          </vs-button>
          <vs-button color="dark" type="border" @click="showConfirmEmpaque = false">
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </vs-popup>
</template>

<script>
export default {
  name: 'GestionbodegaEscaneo',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    sesionesEscaneo: {
      type: Array,
      default: () => []
    },
    arrayInformacionDocumento: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activePopup: this.active,
      escaneoSelected: null,
      filtroEstado: 2,
      showConfirmEmpaque: false
    }
  },
  computed: {
    sesionesFiltradas() {
      return this.sesionesEscaneo.filter(sesion => sesion.estado === this.filtroEstado)
    },
    escaneoSelectedFinalizada() {
      if (!this.escaneoSelected) return false
      const sesion = this.sesionesEscaneo.find(s => s.id === this.escaneoSelected)
      return sesion && sesion.estado === 2
    },
    documentoCompleto() {
      if (!this.arrayInformacionDocumento || this.arrayInformacionDocumento.length === 0) return false
      return this.arrayInformacionDocumento.every(
        item => item.det_ven_cantidad > 0 && item.det_ven_cantidad === item.det_ven_cantidad_despacho
      )
    }
  },
  watch: {
    active(val) {
      this.activePopup = val
    },
    activePopup(val) {
      if (!val) {
        this.$emit('update:active', false)
      }
    }
  },
  methods: {
    seleccionarSesion(sesion) {
      this.escaneoSelected = sesion.id
    },
    confirmarEmpaque() {
      this.showConfirmEmpaque = true
    },
    ejecutarEmpaque() {
      this.showConfirmEmpaque = false
      const sesionId = this.escaneoSelected || (this.sesionesEscaneo.length > 0 ? this.sesionesEscaneo[0].id : null)
      const sesion = this.sesionesEscaneo.find(s => s.id === sesionId) || this.sesionesEscaneo[0]
      this.$emit('iniciar-empaque', { id: sesionId, sesion })
      this.cerrar()
    },
    confirmarSeleccion() {
      if (!this.escaneoSelected) {
        this.$vs.notify({
          text: 'Debe seleccionar una sesión',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      const sesionSeleccionada = this.sesionesEscaneo.find(s => s.id === this.escaneoSelected)

      if (sesionSeleccionada.estado === 1) {
        this.$vs.notify({
          text: 'Se encuentra pendiente',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      if (sesionSeleccionada.estado === 3) {
        this.$vs.notify({
          text: 'Ya fue cerrado ese escaneo',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-x-circle'
        })
        return
      }

      // Solo estado 2 (Finalizada) llega aquí
      this.$emit('sesion-seleccionada', {
        id: this.escaneoSelected,
        sesion: sesionSeleccionada
      })

      this.$vs.notify({
        text: `Sesión #${this.escaneoSelected} seleccionada`,
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check'
      })

      this.cerrar()
    },
    contarPorEstado(estado) {
      return this.sesionesEscaneo.filter(s => s.estado === estado).length
    },
    cerrar() {
      this.activePopup = false
      this.escaneoSelected = null
    },
    formatearFecha(fecha) {
      if (!fecha) return 'N/A'
      const date = new Date(fecha)
      return date.toLocaleString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    estadoClass(estado) {
      switch (estado) {
        case 2:
          return 'activo'
        case 3:
          return 'rojo'
        case 1:
        default:
          return 'pendiente'
      }
    }
  }
}
</script>

<style scoped>
.escaneo-modal-container {
  padding: 20px;
  max-width: 900px;
}

/* Header simple sin degradado */
.escaneo-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  margin-bottom: 16px;
}
.escaneo-header i { font-size: 28px; color: #475569; }
.escaneo-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }
.escaneo-header p { margin: 2px 0 0 0; font-size: 12px; color: #64748b; }

/* Banner documento completo */
.banner-completo {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 3px solid #16a34a;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 14px;
}
.banner-completo-icon { color: #16a34a; font-size: 18px; flex-shrink: 0; }
.banner-completo-text { display: flex; flex-direction: column; gap: 2px; }
.banner-completo-text strong { font-size: 13px; color: #15803d; font-weight: 700; }
.banner-completo-text span { font-size: 12px; color: #166534; }

/* Filtros */
.filtros-estado { margin-bottom: 12px; }
.radio-group { display: flex; gap: 8px; flex-wrap: wrap; }

.radio-option {
  flex: 1;
  min-width: 160px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.radio-option:hover { border-color: #94a3b8; }
.radio-option.active { border-color: #334155; background: #f8fafc; }
.radio-option input[type="radio"] { display: none; }

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.radio-label i { font-size: 14px; }
.radio-option.active .radio-label { color: #1e293b; }

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
}
.badge-success { background: #f0fdf4; color: #16a34a; }
.badge-warning { background: #fffbeb; color: #d97706; }
.badge-danger  { background: #fef2f2; color: #dc2626; }

/* Hint */
.hint-solo-finalizadas {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 7px 12px;
  margin-bottom: 12px;
}
.hint-solo-finalizadas i { font-size: 13px; flex-shrink: 0; color: #64748b; }
.hint-solo-finalizadas strong { color: #1e293b; font-weight: 700; }

/* Sin sesiones */
.no-sesiones { text-align: center; padding: 40px 20px; color: #94a3b8; }
.no-sesiones i { font-size: 36px; margin-bottom: 12px; display: block; }
.no-sesiones p { font-size: 14px; margin: 0; }

/* Grid sesiones */
.sesiones-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  max-height: 320px;
  overflow-y: auto;
  padding: 2px;
}

.sesion-card {
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.sesion-card:hover { border-color: #94a3b8; }
.sesion-card.selected { border-color: #334155; background: #f8fafc; }
.sesion-card.no-seleccionable { cursor: default; pointer-events: none; }

.sesion-header { display: flex; align-items: center; gap: 10px; }

.sesion-icon {
  width: 30px;
  height: 30px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  font-size: 15px;
  flex-shrink: 0;
}

.sesion-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.usuario-nombre { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sesion-meta { font-size: 11px; color: #64748b; }

.check-icon { color: #16a34a; font-size: 16px; flex-shrink: 0; }

.sesion-obs { margin-top: 4px; font-size: 11px; color: #64748b; font-style: italic; padding-left: 40px; }

.estado-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
  background: #f1f5f9;
  color: #475569;
}
.estado-badge.activo   { background: #f0fdf4; color: #15803d; }
.estado-badge.pendiente { background: #fffbeb; color: #b45309; }
.estado-badge.rojo     { background: #fef2f2; color: #b91c1c; }

/* Acciones */
.acciones-modal {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

/* Scrollbar */
.sesiones-grid::-webkit-scrollbar { width: 6px; }
.sesiones-grid::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.sesiones-grid::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.sesiones-grid::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* z-index popups */
::v-deep .vs-dialog-bg { z-index: 99998 !important; }
::v-deep .vs-dialog-danger, ::v-deep .vs-dialog-warning,
::v-deep .vs-dialog-success, ::v-deep .vs-dialog-primary { z-index: 99999 !important; }
::v-deep .confirm-empaque-popup .vs-popup--background { z-index: 99998 !important; }
::v-deep .confirm-empaque-popup .vs-popup { z-index: 99999 !important; }

/* Confirm empaque */
.confirm-empaque-body { padding: 10px 4px; text-align: center; }
.confirm-empaque-icon { font-size: 36px; color: #16a34a; margin-bottom: 10px; }
.confirm-empaque-text { font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 18px; }
.confirm-empaque-actions { display: flex; justify-content: center; gap: 10px; }

@media (max-width: 768px) {
  .acciones-modal { flex-direction: column; }
  .acciones-modal button { width: 100%; }
}
</style>
