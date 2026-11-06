<template>
  <div class="mt-4 contenedor-ventas">
    <vs-divider class="ventas-divider"></vs-divider>
    <div class="ventas-tabs-shell">
      <vs-tabs v-model="tabActivo" alignment="fixed" class="ventas-tabs" color="black">
      <vs-tab label="GESTIÓN" icon-pack="feather" icon="icon-briefcase">
        <listado-ventas-new
          ref="tabGestion"
          class="mt-3"
          @showPedido="showPedido"
          :periodoSelect="periodoSelect"
          :pedidos="pedidos"
          @changeRecarge="changeHandleRecarga"
          :userRoot="userRoot"
          :userAsesor="userAsesor"
          :groupFacturador="groupFacturador"
        />
      </vs-tab>
      <vs-tab label="RESUMEN DE PENDIENTES" icon-pack="feather" icon="icon-clock">
        <resumen-pendientes
          class="mt-3"
          :periodoSelect="periodoSelect"
          :pedidos="pedidos"
          :userRoot="userRoot"
          :userAsesor="userAsesor"
          :groupFacturador="groupFacturador"
          @ir-a-gestion="irAGestion"
        />
      </vs-tab>
      <vs-tab label="RESUMEN DE VENTAS" icon-pack="feather" icon="icon-clock">
        <div>
          <perseo_despachosVue/>
        </div>
      </vs-tab>
      <!-- <vs-tab label="RESUMEN POR LIBRO" icon-pack="feather" icon="icon-layers">
        <resumen-por-libro
          class="mt-3"
          :periodoSelect="periodoSelect"
          @ir-a-gestion="irAGestion"
        />
      </vs-tab> -->
      </vs-tabs>
    </div>
  </div>
</template>

<script>
import listadoVentasNew from './listado_ventas_new.vue'
import resumenPendientes from './resumen_pendientes.vue'
import perseo_despachosVue from '../../facturacion/10_10_1_4/bodegas/Documentos/perseo_despachos.vue';
// import resumenPorLibro from './resumen_por_libro.vue'

export default {
  name: 'ContenedorVentas',
  components: { listadoVentasNew, resumenPendientes, perseo_despachosVue },
  props: {
    periodoSelect:    { type: Object,  default: () => ({}) },
    pedidos:          { type: Array,   default: () => [] },
    userRoot:         { type: Boolean, default: false },
    userAsesor:       { type: Boolean, default: false },
    groupFacturador:  { type: Boolean, default: false }
  },
  data() {
    return {
      tabActivo: 0,   // 0 = GESTIÓN, 1 = RESUMEN PENDIENTES, 2 = RESUMEN POR LIBRO
    }
  },
  methods: {
    showPedido(e) { this.$emit('showPedido', e) },
    changeHandleRecarga() { this.$emit('changeRecarge') },

    /**
     * Se llama desde los componentes hijo mediante @ir-a-gestion.
     * Si es un totalizado: abre modo Venta Lista y selecciona el totalizado.
     * Si es venta directa: abre Gestión y pre-selecciona el contrato.
     */
    irAGestion(datos) {
      // datos puede ser string (antiguo) u objeto (nuevo)
      const contrato_generado = typeof datos === 'string' ? datos : datos.contrato_generado;
      const esTotalizado = typeof datos === 'object' ? datos.es_totalizado : false;
      const codigoTotalizado = typeof datos === 'object' ? datos.codigo_totalizado : null;

      // 1. Cambiar al tab GESTIÓN
      this.tabActivo = 0

      // 2. Esperar que el tab esté activo en el DOM y luego pre-seleccionar el pedido o totalizado
      this.$nextTick(() => {
        const gestion = this.$refs.tabGestion
        if (gestion) {
          if (esTotalizado && typeof gestion.preseleccionarTotalizado === 'function') {
            // Es un totalizado: ir a modo venta lista
            gestion.preseleccionarTotalizado(codigoTotalizado)
          } else if (typeof gestion.preseleccionarContrato === 'function') {
            // Es venta directa: modo normal
            gestion.preseleccionarContrato(contrato_generado)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.contenedor-ventas {
  --ventas-bg: #ffffff;
  --ventas-border: #e5e7eb;
  --ventas-tab-idle: #6b7280;
  --ventas-tab-active: #111827;
  --ventas-pill-bg: #f8fafc;
  --ventas-pill-active-bg: #f1f5f9;
}

.ventas-divider >>> .vs-divider {
  margin: 0 0 12px;
  border-top: 1px solid #eef2f7;
}

.ventas-tabs-shell {
  background: var(--ventas-bg);
  border: 1px solid var(--ventas-border);
  border-radius: 14px;
  box-shadow: 0 10px 28px -24px rgba(15, 23, 42, 0.45);
  padding: 8px;
}

.ventas-tabs >>> .vs-tabs--ul {
  display: flex;
  gap: 6px;
  box-shadow: none !important;
  border-bottom: none;
  margin-bottom: 8px;
  padding: 6px 2px 10px;
}

.ventas-tabs >>> .vs-tabs--btn {
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--ventas-tab-idle);
  padding: 10px 16px !important;
  background: var(--ventas-pill-bg);
  transition: all 0.2s ease;
}

.ventas-tabs >>> .vs-tabs--btn:hover {
  color: var(--ventas-tab-active);
  background: var(--ventas-pill-active-bg);
}

.ventas-tabs >>> .activeChild .vs-tabs--btn {
  color: var(--ventas-tab-active);
  background: var(--ventas-pill-active-bg);
  box-shadow: inset 0 0 0 1px #dbe3ee;
}

.ventas-tabs >>> .line-vs-tabs {
  display: none !important;
}

.ventas-tabs >>> .con-slot-tabs {
  padding: 0 4px 6px;
}
</style>


