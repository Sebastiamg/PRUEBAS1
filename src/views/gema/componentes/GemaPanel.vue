<template>
  <transition name="gema-panel-fade">
    <div v-if="abierto" class="gema-panel-host" :class="'modo-' + modo">
      <div class="gema-panel-mask" @click="$emit('cerrar')"></div>

      <section
        class="gema-panel"
        :class="[{ 'is-wide': ancho }, 'tam-' + tamano]"
        role="dialog"
        aria-modal="true"
      >
        <header class="gema-panel-head">
          <div>
            <span class="gema-h2">{{ titulo }}</span>
            <div v-if="subtitulo" class="gema-faint gema-panel-sub">{{ subtitulo }}</div>
          </div>
          <button class="gema-btn is-quiet is-icon" type="button" title="Cerrar" @click="$emit('cerrar')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div class="gema-panel-body">
          <slot />
        </div>

        <footer v-if="$slots.pie" class="gema-panel-foot">
          <slot name="pie" />
        </footer>
      </section>
    </div>
  </transition>
</template>

<script>
/**
 * Contenedor de dialogos de GEMA, en dos modos:
 *
 *   lateral (por defecto)  Panel a la derecha. Para consultar un detalle sin
 *                          perder de vista la tabla de fondo.
 *   modal                  Dialogo centrado y ancho. Para los formularios con
 *                          muchos campos o con tablas dentro (etapas de un
 *                          proceso, unidades de un libro, definicion de un KPI),
 *                          que en una columna estrecha quedan ilegibles.
 *
 * `tamano` controla el ancho del modal: md 720px, lg 940px, xl 1180px.
 */
export default {
  name: 'GemaPanel',

  props: {
    abierto: { type: Boolean, default: false },
    titulo: { type: String, default: '' },
    subtitulo: { type: String, default: '' },
    /** Solo aplica en modo lateral: ensancha el panel de 420 a 640px. */
    ancho: { type: Boolean, default: false },
    modo: {
      type: String,
      default: 'lateral',
      validator: (v) => ['lateral', 'modal'].includes(v)
    },
    tamano: {
      type: String,
      default: 'lg',
      validator: (v) => ['md', 'lg', 'xl'].includes(v)
    }
  },

  watch: {
    abierto (valor) {
      // Se bloquea el scroll del fondo mientras el dialogo esta abierto.
      document.body.style.overflow = valor ? 'hidden' : ''
    }
  },

  beforeDestroy () {
    document.body.style.overflow = ''
  },

  created () {
    this.cerrarConEscape = (e) => {
      if (e.key === 'Escape' && this.abierto) this.$emit('cerrar')
    }

    window.addEventListener('keydown', this.cerrarConEscape)
  },

  destroyed () {
    window.removeEventListener('keydown', this.cerrarConEscape)
  }
}
</script>

<style lang="scss" scoped>
.gema-panel-sub { font-size: var(--gema-fs-xs); margin-top: 1px; }

// La transicion va sobre .gema-panel-host, que es la capa fija a pantalla
// completa (ver _base.scss). Tiene una caja real y pintada, asi que el
// transitionend siempre llega y <transition> desmonta el dialogo al cerrarlo.
.gema-panel-fade-enter-active,
.gema-panel-fade-leave-active {
  transition: opacity 0.14s ease;

  ::v-deep .gema-panel { transition: transform 0.16s ease; }
}

.gema-panel-fade-enter,
.gema-panel-fade-leave-to {
  opacity: 0;

  ::v-deep .gema-panel { transform: translateX(16px); }
}

// En modo modal el dialogo entra hacia arriba, no desde el costado.
.modo-modal.gema-panel-fade-enter ::v-deep .gema-panel,
.modo-modal.gema-panel-fade-leave-to ::v-deep .gema-panel {
  transform: translateY(10px);
}
</style>
