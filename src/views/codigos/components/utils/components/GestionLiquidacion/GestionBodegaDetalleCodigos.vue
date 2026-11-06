<template>
  <vs-popup title="Detalle de códigos" :active.sync="isActive" fullscreen>
    <div class="detalle-codigos-container">

      <!-- Resumen + controles -->
      <div class="detalle-toolbar">
        <div class="detalle-resumen">
          <div class="resumen-chip total"><i class="fa fa-list"></i> Total: <strong>{{ codigos.length }}</strong></div>
          <div class="resumen-chip despachado"><i class="fa fa-check-circle"></i> Despachados: <strong>{{ despachados }}</strong></div>
          <div class="resumen-chip pendiente"><i class="fa fa-clock-o"></i> Pendientes: <strong>{{ codigos.length - despachados }}</strong></div>
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

      <!-- Tabla -->
      <vs-table stripe :data="codigosFiltrados" search pagination :max-items="20" style="width:100%;">
        <template slot="thead">
          <vs-th sort-key="codigo">Código activación</vs-th>
          <vs-th sort-key="codigo_union">Código diagnóstico</vs-th>
          <vs-th sort-key="nombrelibro">Libro</vs-th>
          <vs-th sort-key="codigo_paquete">Paquete</vs-th>
          <vs-th class="text-center">Estado</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr v-for="(tr, i) in data" :key="i" :class="tr.institucionPuntoVenta ? 'fila-despachada' : ''">
            <vs-td><span class="codigo-text">{{ tr.codigo }}</span></vs-td>
            <vs-td><span class="codigo-text muted">{{ tr.codigo_union || '—' }}</span></vs-td>
            <vs-td><small>{{ tr.nombrelibro }}</small></vs-td>
            <vs-td>
              <span v-if="tr.codigo_paquete" class="badge-paquete">{{ tr.codigo_paquete }}</span>
              <span v-else class="muted">—</span>
            </vs-td>
            <vs-td class="text-center">
              <vs-chip v-if="tr.institucionPuntoVenta" color="success"><i class="fa fa-check mr-1"></i> Despachado</vs-chip>
              <vs-chip v-else color="warning"><i class="fa fa-clock-o mr-1"></i> Pendiente</vs-chip>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>

    </div>
  </vs-popup>
</template>

<script>
import Codigosmix from '@/mixins/Codigosmix'
export default {
  name: 'GestionBodegaDetalleCodigos',
  mixins: [Codigosmix],
  props: {
    active: { type: Boolean, required: true },
    codigos: { type: Array, default: () => [] }
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
      return this.codigos.filter(c => c.institucionPuntoVenta).length
    },
    codigosFiltrados() {
      if (this.filtro === 'despachados') return this.codigos.filter(c => c.institucionPuntoVenta)
      if (this.filtro === 'pendientes')  return this.codigos.filter(c => !c.institucionPuntoVenta)
      return this.codigos
    }
  },
  methods: {
    exportarExcel() {
      const headers   = ['Código Activación', 'Código Diagnóstico', 'Libro', 'Paquete', 'Estado']
      const fieldKeys = ['codigo', 'codigo_union', 'nombrelibro', 'codigo_paquete', 'estado_label']
      const datos = this.codigosFiltrados.map(c => ({
        codigo:        c.codigo,
        codigo_union:  c.codigo_union || '',
        nombrelibro:   c.nombrelibro,
        codigo_paquete: c.codigo_paquete || '',
        estado_label:  c.institucionPuntoVenta ? 'Despachado' : 'Pendiente'
      }))
      this.m_exportTodo(headers, fieldKeys, datos, `codigos_${this.filtro}`)
    }
  }
}
</script>

<style scoped>
.detalle-codigos-container { padding: 16px; }
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
.codigo-text { font-family: monospace; font-size: 12px; font-weight: 600; }
.muted { color: #999; font-size: 12px; }
.badge-paquete { background: #ede7f6; color: #4527a0; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.fila-despachada { background: #f1f8e9 !important; }
.mr-1 { margin-right: 4px; }
.text-center { text-align: center; }
</style>
