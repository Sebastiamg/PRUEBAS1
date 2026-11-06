<template>
  <svg
    v-if="puntos.length > 1"
    class="gema-tend"
    :viewBox="`0 0 ${ancho} ${alto}`"
    preserveAspectRatio="none"
    role="img"
    :aria-label="`Tendencia de los ultimos ${puntos.length} periodos`"
  >
    <polyline :points="linea" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
    <circle :cx="ultimo.x" :cy="ultimo.y" r="2" fill="currentColor" />
  </svg>

  <span v-else class="gema-tend-vacio gema-faint">sin historico</span>
</template>

<script>
/**
 * Linea de tendencia minima: solo la forma de los ultimos periodos. Sin ejes,
 * sin rejilla y sin relleno, para que quepa dentro de una fila de 34px sin
 * competir con el numero.
 *
 * Hereda el color por `currentColor`, asi la tarjeta la tine segun su semaforo.
 */
export default {
  name: 'GemaTendencia',

  props: {
    /** [{ valor_indicador, etiqueta }] en orden cronologico */
    serie: { type: Array, default: () => [] },
    ancho: { type: Number, default: 72 },
    alto: { type: Number, default: 20 }
  },

  computed: {
    valores () {
      return this.serie
        .map((p) => (typeof p === 'number' ? p : p.valor_indicador))
        .filter((v) => v !== null && v !== undefined)
        .map(Number)
    },

    puntos () {
      const vals = this.valores
      if (vals.length < 2) return []

      const min = Math.min(...vals)
      const max = Math.max(...vals)
      // Serie plana: se dibuja en el medio en lugar de dividir por cero.
      const rango = max - min || 1
      const paso = this.ancho / (vals.length - 1)
      const margen = 2

      return vals.map((v, i) => ({
        x: +(i * paso).toFixed(2),
        y: +(this.alto - margen - ((v - min) / rango) * (this.alto - margen * 2)).toFixed(2)
      }))
    },

    linea () {
      return this.puntos.map((p) => `${p.x},${p.y}`).join(' ')
    },

    ultimo () {
      return this.puntos[this.puntos.length - 1] || { x: 0, y: 0 }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-tend { width: 72px; height: 20px; display: block; overflow: visible; }
.gema-tend-vacio { font-size: var(--gema-fs-xs); }
</style>
