<template>
  <div class="gema-table-wrap">
    <div class="gema-table-scroll" :style="{ maxHeight: alturaMaxima }">
      <table class="gema-table">
        <thead>
          <tr>
            <th
              v-for="col in columnas"
              :key="col.clave"
              :class="[
                { 'is-num': col.numerica, 'is-actions': col.acciones, 'is-sortable': col.ordenable !== false && !col.acciones },
                col.clase
              ]"
              :style="col.ancho ? { width: col.ancho } : null"
              @click="ordenarPor(col)"
            >
              {{ col.titulo }}
              <span v-if="orden.clave === col.clave" class="gema-th-orden">{{ orden.asc ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="cargando">
            <td :colspan="columnas.length">
              <div class="gema-row gema-tabla-cargando">
                <span class="gema-spinner"></span>
                <span class="gema-faint">Cargando...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="!filasOrdenadas.length">
            <td :colspan="columnas.length">
              <div class="gema-empty">
                <div class="gema-empty-title">{{ textoVacio }}</div>
                <slot name="vacio" />
              </div>
            </td>
          </tr>

          <slot v-else :filas="filasOrdenadas" />
        </tbody>
      </table>
    </div>

    <div v-if="!cargando && filasOrdenadas.length" class="gema-table-foot">
      <span>{{ filasOrdenadas.length }} {{ filasOrdenadas.length === 1 ? 'registro' : 'registros' }}</span>
      <slot name="pie" />
    </div>
  </div>
</template>

<script>
/**
 * Tabla densa del modulo.
 *
 * Ordena en el cliente porque todas las pantallas de GEMA trabajan con listados
 * acotados (pilares, metas, KPIs, catalogos). El unico listado paginado en
 * servidor es la auditoria, que no usa este componente.
 *
 * El consumidor pinta las filas por el slot por defecto, que recibe `filas` ya
 * ordenadas; asi cada pantalla decide su propio formato de celda.
 */
export default {
  name: 'GemaTabla',

  props: {
    /**
     * [{ clave, titulo, numerica?, acciones?, ordenable?, ancho?, clase?, valor? }]
     * `valor` es una funcion (fila) => valor a usar al ordenar, cuando la clave
     * no es una propiedad directa de la fila.
     */
    columnas: { type: Array, required: true },
    filas: { type: Array, default: () => [] },
    cargando: { type: Boolean, default: false },
    textoVacio: { type: String, default: 'No hay registros' },
    ordenInicial: { type: String, default: null },
    alturaMaxima: { type: String, default: 'calc(100vh - 210px)' }
  },

  data () {
    return {
      orden: { clave: this.ordenInicial, asc: true }
    }
  },

  computed: {
    filasOrdenadas () {
      if (!this.orden.clave) return this.filas

      const col = this.columnas.find((c) => c.clave === this.orden.clave)
      const leer = col && col.valor ? col.valor : (fila) => fila[this.orden.clave]
      const factor = this.orden.asc ? 1 : -1

      // Copia: no se reordena el array del padre.
      return this.filas.slice().sort((a, b) => {
        const va = leer(a)
        const vb = leer(b)

        if (va === vb) return 0
        if (va === null || va === undefined) return 1
        if (vb === null || vb === undefined) return -1

        if (typeof va === 'number' && typeof vb === 'number') {
          return (va - vb) * factor
        }

        return String(va).localeCompare(String(vb), 'es', { numeric: true }) * factor
      })
    }
  },

  methods: {
    ordenarPor (col) {
      if (col.acciones || col.ordenable === false) return

      if (this.orden.clave === col.clave) {
        this.orden.asc = !this.orden.asc
      } else {
        this.orden = { clave: col.clave, asc: true }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-th-orden { margin-left: 3px; color: var(--gema-accent-text); }
.gema-tabla-cargando { padding: var(--gema-u4); justify-content: center; }
</style>
