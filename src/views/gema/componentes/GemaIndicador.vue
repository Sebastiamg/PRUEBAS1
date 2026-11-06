<template>
  <span class="gema-ind" :class="'gema-sem-' + semaforo">
    <span v-if="conPunto" class="gema-dot" :class="'is-' + semaforo"></span>
    <span class="gema-num gema-ind-valor">{{ texto }}</span>
    <span v-if="target" class="gema-ind-target">/ {{ target }}</span>
  </span>
</template>

<script>
/**
 * Muestra el indicador de un KPI con el formato que corresponde a su unidad de
 * medida, para que el mismo numero no se vea como "0.9" en un lado y "90%" en otro.
 *
 * Los KPIs de tipo porcentaje se guardan como fraccion (0,9) y se muestran como
 * 90%; los de dinero con separador de miles; el resto con sus decimales.
 */
export default {
  name: 'GemaIndicador',

  props: {
    valor: { type: Number, default: null },
    /** { tipo, simbolo, decimales } de gma_unidad_medida */
    unidad: { type: Object, default: null },
    semaforo: { type: String, default: 'gris' },
    target: { type: String, default: null },
    conPunto: { type: Boolean, default: true },
    vacio: { type: String, default: '—' }
  },

  computed: {
    texto () {
      if (this.valor === null || this.valor === undefined) return this.vacio

      return this.$options.formatear(this.valor, this.unidad)
    }
  },

  /** Expuesto como funcion estatica para reutilizarlo desde otras vistas. */
  formatear (valor, unidad) {
    const tipo = unidad ? unidad.tipo : 'numero'
    const decimales = unidad && unidad.decimales !== undefined ? unidad.decimales : 2

    if (tipo === 'porcentaje') {
      return `${(valor * 100).toLocaleString('es-EC', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      })}%`
    }

    if (tipo === 'moneda') {
      return `$ ${valor.toLocaleString('es-EC', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`
    }

    // Salvaguarda: si el valor no es entero pero la unidad esta configurada con
    // 0 decimales, se muestra 1 decimal. Sin esto una nota de 1,7 se veria como
    // "2" y pareceria cumplir un target de ">= 2,0".
    const maximos = (decimales === 0 && !Number.isInteger(valor)) ? 1 : decimales

    const numero = valor.toLocaleString('es-EC', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maximos
    })

    const simbolo = unidad && unidad.simbolo && tipo !== 'numero' ? ` ${unidad.simbolo}` : ''

    return numero + simbolo
  }
}
</script>

<style lang="scss" scoped>
.gema-ind {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  white-space: nowrap;
}

.gema-ind-valor { font-weight: 600; }
.gema-ind-target { font-size: var(--gema-fs-xs); color: var(--gema-text-3); font-weight: 400; }
.gema-dot { align-self: center; }
</style>
