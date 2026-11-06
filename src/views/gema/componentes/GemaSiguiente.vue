<template>
  <nav v-if="paso" class="gema-sig" aria-label="Navegacion del proceso">
    <router-link v-if="anterior" class="gema-btn is-quiet is-sm gema-sig-atras" :to="{ name: anterior.ruta }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6" /></svg>
      {{ anterior.nombre }}
    </router-link>

    <div class="gema-sig-centro">
      <span class="gema-faint gema-sig-pos">Paso {{ paso.numero }} de {{ total }}</span>
      <span class="gema-sig-fase">{{ fase }}</span>
    </div>

    <router-link v-if="siguiente" class="gema-btn is-primary is-sm gema-sig-adelante" :to="{ name: siguiente.ruta }">
      <span class="gema-sig-etiqueta">Siguiente:</span> {{ siguiente.nombre }}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" /></svg>
    </router-link>

    <router-link v-else class="gema-btn is-sm gema-sig-adelante" :to="{ name: 'gema-dashboard' }">
      Volver al inicio
    </router-link>
  </nav>
</template>

<script>
/**
 * Barra de continuidad al pie de una pantalla del proceso.
 *
 * Le dice a la persona en que paso va y cual sigue, para que no tenga que volver al
 * menu y adivinar. La secuencia es la misma que calcula el backend, asi que esta
 * barra y el asistente del inicio nunca se contradicen.
 *
 * Se pinta sola: recibe la seccion actual y busca su lugar en el flujo. Si la
 * pantalla no forma parte del flujo de esa persona, no se muestra nada.
 */
import sesion from '@/services/gema/gemaSesion'

export default {
  name: 'GemaSiguiente',

  props: {
    /** Codigo de seccion de la pantalla actual, ej: 'kpi_captura'. */
    seccion: { type: String, required: true }
  },

  computed: {
    // El proceso vive en la sesion: se pide una vez y lo comparten el menu, el
    // asistente del inicio y esta barra. Antes cada pantalla lo pedia por su
    // cuenta, doce veces, y los numeros podian no coincidir.
    pasos () {
      return sesion.pasos()
    },

    indice () {
      return this.pasos.findIndex((p) => p.seccion === this.seccion)
    },

    paso () {
      return this.indice >= 0 ? this.pasos[this.indice] : null
    },

    anterior () {
      return this.indice > 0 ? this.pasos[this.indice - 1] : null
    },

    siguiente () {
      return this.indice >= 0 && this.indice < this.pasos.length - 1
        ? this.pasos[this.indice + 1]
        : null
    },

    total () {
      return this.pasos.length
    },

    fase () {
      return this.paso ? this.paso.faseNombre : ''
    }
  },

  created () {
    // Si el layout todavia no lo trajo (entrada directa por URL), se pide aqui.
    sesion.cargarFlujo()
  }
}
</script>

<style lang="scss" scoped>
.gema-sig {
  display: flex;
  align-items: center;
  gap: var(--gema-u3);
  margin-top: var(--gema-u3);
  padding: var(--gema-u2) var(--gema-u3);
  background: var(--gema-surface);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius-lg);
}

.gema-sig-atras { flex: 0 0 auto; max-width: 30%; overflow: hidden; }

.gema-sig-centro {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  min-width: 0;
  text-align: center;
}

.gema-sig-pos {
  font-size: var(--gema-fs-xs);
  font-variant-numeric: tabular-nums;
}

.gema-sig-fase {
  font-size: var(--gema-fs-xs);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--gema-text-3);
}

.gema-sig-adelante {
  flex: 0 0 auto;
  max-width: 45%;
  overflow: hidden;
  text-decoration: none;
}

.gema-sig-etiqueta { font-weight: 400; opacity: 0.85; }

@media (max-width: 720px) {
  .gema-sig { flex-wrap: wrap; }
  .gema-sig-centro { order: -1; flex-basis: 100%; align-items: flex-start; text-align: left; }
  .gema-sig-atras, .gema-sig-adelante { max-width: none; }
  .gema-sig-etiqueta { display: none; }
}
</style>
