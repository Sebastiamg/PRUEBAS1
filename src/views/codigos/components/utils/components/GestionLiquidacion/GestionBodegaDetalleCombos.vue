<template>
  <vs-popup title="Detalle de combos" :active.sync="isActive" fullscreen>
    <div class="detalle-combos-container">

      <!-- Resumen -->
      <div class="detalle-toolbar">
        <div class="detalle-resumen">
          <div class="resumen-chip total"><i class="fa fa-cubes"></i> Total combos: <strong>{{ combos.length }}</strong></div>
          <div class="resumen-chip despachado"><i class="fa fa-check-circle"></i> Despachados: <strong>{{ despachados }}</strong></div>
          <div class="resumen-chip pendiente"><i class="fa fa-clock-o"></i> Pendientes: <strong>{{ combos.length - despachados }}</strong></div>
        </div>
        <div class="detalle-acciones">
          <div class="filtro-radios">
            <label class="radio-opt"><input type="radio" v-model="filtro" value="todos" /> Todos</label>
            <label class="radio-opt"><input type="radio" v-model="filtro" value="despachados" /> Despachados</label>
            <label class="radio-opt"><input type="radio" v-model="filtro" value="pendientes" /> Pendientes</label>
          </div>
          <vs-button size="small" color="success" type="filled" @click="exportarExcel">
            <i class="fa fa-file-excel-o"></i> Exportar Excel
          </vs-button>
        </div>
      </div>

      <!-- Lista de combos -->
      <div v-for="(combo, idx) in combosFiltrados" :key="idx" class="combo-card" :class="combo.despachado ? 'combo-despachado' : 'combo-pendiente'">
        <div class="combo-header">
          <div class="combo-header-left">
            <i :class="combo.despachado ? 'fa fa-check-circle icon-ok' : 'fa fa-clock-o icon-warn'"></i>
            <div>
              <span class="combo-etiqueta">{{ combo.codigoCombo }}</span>
              <span v-if="combo.combo" class="combo-libro-badge ml-2">{{ combo.combo }}</span>
            </div>
          </div>
          <vs-chip :color="combo.despachado ? 'success' : 'warning'">
            {{ combo.despachado ? 'Despachado' : 'Pendiente' }}
          </vs-chip>
        </div>

        <!-- Hijos -->
        <div class="combo-hijos" v-if="combo.codigosHijos && combo.codigosHijos.length">
          <table class="tabla-hijos">
            <thead>
              <tr>
                <th>Código activación</th>
                <th>Código diagnóstico</th>
                <th>Libro (liquidación)</th>
                <th class="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(hijo, hidx) in combo.codigosHijos" :key="hidx"
                :class="hijo.institucionPuntoVenta ? 'hijo-despachado' : ''">
                <td><span class="codigo-text">{{ hijo.codigoActivacion }}</span></td>
                <td><span class="codigo-text muted">{{ hijo.codigoDiagnostico || '—' }}</span></td>
                <td><small>{{ hijo.codigo_liquidacion }}</small></td>
                <td class="text-center">
                  <vs-chip v-if="hijo.institucionPuntoVenta" color="success" size="small">
                    <i class="fa fa-check"></i> Despachado
                  </vs-chip>
                  <vs-chip v-else color="warning" size="small">
                    <i class="fa fa-clock-o"></i> Pendiente
                  </vs-chip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="combosFiltrados.length === 0" class="sin-datos">
        No hay combos para mostrar.
      </div>

    </div>
  </vs-popup>
</template>

<script>
import Codigosmix from '@/mixins/Codigosmix'
export default {
  name: 'GestionBodegaDetalleCombos',
  mixins: [Codigosmix],
  props: {
    active: { type: Boolean, required: true },
    combos: { type: Array, default: () => [] }
  },
  data() {
    return { filtro: 'todos' }
  },
  computed: {
    isActive: {
      get() { return this.active },
      set(v) { this.$emit('update:active', v) }
    },
    despachados() {
      return this.combos.filter(c => c.despachado).length
    },
    combosFiltrados() {
      if (this.filtro === 'despachados') return this.combos.filter(c => c.despachado)
      if (this.filtro === 'pendientes')  return this.combos.filter(c => !c.despachado)
      return this.combos
    }
  },
  methods: {
    exportarExcel() {
      const headers   = ['Combo Etiqueta', 'Combo Libro', 'Código Activación', 'Código Diagnóstico', 'Liquidación', 'Estado Combo', 'Estado Hijo']
      const fieldKeys = ['codigoCombo', 'combo', 'codigoActivacion', 'codigoDiagnostico', 'codigo_liquidacion', 'estadoCombo', 'estadoHijo']
      const datos = []
      this.combosFiltrados.forEach(combo => {
        if (combo.codigosHijos && combo.codigosHijos.length) {
          combo.codigosHijos.forEach(hijo => {
            datos.push({
              codigoCombo:        combo.codigoCombo,
              combo:              combo.combo || '',
              codigoActivacion:   hijo.codigoActivacion,
              codigoDiagnostico:  hijo.codigoDiagnostico || '',
              codigo_liquidacion: hijo.codigo_liquidacion,
              estadoCombo:        combo.despachado ? 'Despachado' : 'Pendiente',
              estadoHijo:         hijo.institucionPuntoVenta ? 'Despachado' : 'Pendiente'
            })
          })
        } else {
          datos.push({
            codigoCombo: combo.codigoCombo, combo: combo.combo || '',
            codigoActivacion: '', codigoDiagnostico: '', codigo_liquidacion: '',
            estadoCombo: combo.despachado ? 'Despachado' : 'Pendiente', estadoHijo: ''
          })
        }
      })
      this.m_exportTodo(headers, fieldKeys, datos, `combos_${this.filtro}`)
    }
  }
}
</script>

<style scoped>
.detalle-combos-container { padding: 16px; }
.detalle-toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.detalle-resumen { display: flex; gap: 10px; flex-wrap: wrap; }
.resumen-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; }
.resumen-chip.total      { background: #e3f2fd; color: #1565c0; }
.resumen-chip.despachado { background: #e8f5e9; color: #2e7d32; }
.resumen-chip.pendiente  { background: #fff3e0; color: #e65100; }
.detalle-acciones { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.filtro-radios { display: flex; gap: 14px; align-items: center; }
.radio-opt { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 500; color: #555; cursor: pointer; }
.radio-opt input[type="radio"] { accent-color: #667eea; width: 15px; height: 15px; cursor: pointer; }

.combo-card { border-radius: 10px; margin-bottom: 12px; overflow: hidden; border: 1px solid #e0e0e0; }
.combo-despachado { border-color: #a5d6a7; }
.combo-pendiente  { border-color: #ffe082; }

.combo-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #f8f9fa; }
.combo-despachado .combo-header { background: #f1f8e9; }
.combo-pendiente  .combo-header { background: #fffde7; }

.combo-header-left { display: flex; align-items: center; gap: 10px; }
.combo-etiqueta { font-family: monospace; font-weight: 700; font-size: 14px; color: #333; }
.combo-libro-badge { background: #ede7f6; color: #4527a0; padding: 2px 10px; border-radius: 10px; font-size: 12px; font-weight: 600; }

.icon-ok   { color: #4caf50; font-size: 18px; }
.icon-warn { color: #ff9800; font-size: 18px; }

.combo-hijos { padding: 0 8px 8px; }
.tabla-hijos { width: 100%; border-collapse: collapse; font-size: 12px; }
.tabla-hijos thead tr { background: #eeeeee; }
.tabla-hijos thead th { padding: 6px 10px; text-align: left; font-weight: 600; color: #555; }
.tabla-hijos tbody tr { border-bottom: 1px solid #f0f0f0; }
.tabla-hijos tbody tr:hover { background: #fafafa; }
.tabla-hijos tbody td { padding: 6px 10px; }
.hijo-despachado { background: #f9fbe7 !important; }

.codigo-text { font-family: monospace; font-size: 11px; font-weight: 600; }
.muted { color: #999; }
.text-center { text-align: center; }
.ml-2 { margin-left: 8px; }
.sin-datos { text-align: center; color: #999; padding: 40px; font-size: 14px; }
</style>
