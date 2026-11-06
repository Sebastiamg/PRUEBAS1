<template>
  <section class="gema-card gema-flujo">
    <header class="gema-card-head">
      <div class="gema-row">
        <span class="gema-h2">Su proceso en Gestion Estrategica</span>
        <span v-if="resumen.al_dia" class="gema-chip is-verde">al dia</span>
        <span v-else class="gema-chip is-ambar">
          {{ resumen.pendientes }} {{ resumen.pendientes === 1 ? 'paso pendiente' : 'pasos pendientes' }}
        </span>
      </div>

      <button class="gema-btn is-quiet is-sm" type="button" @click="colapsado = !colapsado">
        {{ colapsado ? 'Ver los pasos' : 'Ocultar' }}
      </button>
    </header>

    <!-- El siguiente paso, siempre visible: es lo unico que hay que decidir ahora -->
    <div v-if="siguiente" class="gema-flujo-siguiente">
      <div class="gema-flujo-sig-txt">
        <span class="gema-eyebrow">Siguiente</span>
        <span class="gema-flujo-sig-nombre">{{ siguiente.nombre }}</span>
        <span class="gema-faint gema-flujo-sig-detalle">{{ siguiente.detalle }}</span>
      </div>

      <router-link class="gema-btn is-primary" :to="{ name: siguiente.ruta }">
        Ir
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" /></svg>
      </router-link>
    </div>

    <div v-else-if="!cargando" class="gema-flujo-siguiente">
      <div class="gema-flujo-sig-txt">
        <span class="gema-eyebrow">Todo en orden</span>
        <span class="gema-flujo-sig-nombre">No tiene nada pendiente</span>
      </div>
    </div>

    <!-- La secuencia completa, agrupada por cada cuanto se hace -->
    <div v-if="!colapsado" class="gema-flujo-fases">
      <div v-if="cargando" class="gema-empty">Cargando su proceso...</div>

      <div v-for="fase in fases" v-else :key="fase.clave" class="gema-flujo-fase">
        <div class="gema-flujo-fase-cab">
          <span class="gema-flujo-fase-nombre">{{ fase.nombre }}</span>
          <span class="gema-faint gema-flujo-fase-cad">{{ fase.cadencia }}</span>
        </div>

        <ol class="gema-flujo-pasos">
          <li
            v-for="paso in fase.pasos"
            :key="paso.clave"
            class="gema-flujo-paso"
            :class="['es-' + paso.estado, { 'es-siguiente': siguiente && siguiente.clave === paso.clave }]"
          >
            <span class="gema-flujo-num">{{ paso.numero }}</span>

            <router-link class="gema-flujo-cuerpo" :to="{ name: paso.ruta }">
              <span class="gema-flujo-nombre">{{ paso.nombre }}</span>
              <span class="gema-flujo-desc">{{ paso.descripcion }}</span>
              <span class="gema-flujo-detalle">{{ paso.detalle }}</span>
            </router-link>

            <span class="gema-chip gema-flujo-estado" :class="claseEstado(paso.estado)">
              {{ etiquetaEstado(paso.estado) }}
            </span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * El asistente del inicio: que le toca hacer a esta persona y en que orden.
 *
 * Los pasos y su estado los calcula el backend (App\Services\Gema\GemaFlujo) con
 * datos reales, asi que la lista cambia sola conforme la persona avanza. Se agrupa
 * por cadencia (una vez / cada dia / cada semana / cada periodo) porque eso es lo
 * que de verdad ordena el trabajo.
 */
const ESTADOS = {
  listo:       { texto: 'hecho',      clase: 'is-verde' },
  pendiente:   { texto: 'pendiente',  clase: 'is-ambar' },
  bloqueado:   { texto: 'bloqueado',  clase: 'is-rojo' },
  informativo: { texto: 'consulta',   clase: 'is-gris' }
}

export default {
  name: 'GemaFlujoAsistente',

  props: {
    fases: { type: Array, default: () => [] },
    siguiente: { type: Object, default: null },
    resumen: { type: Object, default: () => ({ pendientes: 0, al_dia: true }) },
    cargando: { type: Boolean, default: false }
  },

  data () {
    return {
      // Se recuerda si el usuario prefiere verlo plegado.
      colapsado: localStorage.getItem('gema_flujo_colapsado') === '1'
    }
  },

  watch: {
    colapsado (v) {
      localStorage.setItem('gema_flujo_colapsado', v ? '1' : '0')
    }
  },

  methods: {
    etiquetaEstado (e) { return (ESTADOS[e] || {}).texto || e },
    claseEstado (e) { return (ESTADOS[e] || {}).clase || '' }
  }
}
</script>

<style lang="scss" scoped>
.gema-flujo { margin-bottom: var(--gema-u3); }

// --- El siguiente paso ------------------------------------------------------
.gema-flujo-siguiente {
  display: flex;
  align-items: center;
  gap: var(--gema-u3);
  padding: var(--gema-u3);
  background: var(--gema-accent-soft);
  border-bottom: 1px solid var(--gema-border);
}

.gema-flujo-sig-txt {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1 1 auto;
}

.gema-flujo-sig-nombre {
  font-size: var(--gema-fs-md);
  font-weight: 600;
  color: var(--gema-text);
}

.gema-flujo-sig-detalle { font-size: var(--gema-fs-sm); }

// --- Fases ------------------------------------------------------------------
.gema-flujo-fases { padding: var(--gema-u2) 0; }

.gema-flujo-fase { padding: var(--gema-u2) 0; }

.gema-flujo-fase-cab {
  display: flex;
  align-items: baseline;
  gap: var(--gema-u2);
  padding: 0 var(--gema-u3) var(--gema-u) ;
}

.gema-flujo-fase-nombre {
  font-size: var(--gema-fs-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gema-text-2);
}

.gema-flujo-fase-cad { font-size: var(--gema-fs-xs); }

// --- Pasos ------------------------------------------------------------------
.gema-flujo-pasos {
  list-style: none;
  margin: 0;
  padding: 0;
}

.gema-flujo-paso {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: start;
  gap: 0 var(--gema-u2);
  padding: 6px var(--gema-u3);
  border-left: 2px solid transparent;

  &:hover { background: var(--gema-surface-2); }

  // El paso que toca ahora se marca con el acento; los demas quedan neutros.
  &.es-siguiente {
    background: var(--gema-surface-2);
    border-left-color: var(--gema-accent);
  }

  &.es-listo .gema-flujo-nombre { color: var(--gema-text-2); }
  &.es-listo .gema-flujo-num { background: var(--gema-verde-soft); color: var(--gema-verde); border-color: transparent; }
  &.es-pendiente .gema-flujo-num { background: var(--gema-ambar-soft); color: var(--gema-ambar); border-color: transparent; }
  &.es-bloqueado .gema-flujo-num { background: var(--gema-rojo-soft); color: var(--gema-rojo); border-color: transparent; }
  &.es-informativo .gema-flujo-num { background: var(--gema-surface-3); color: var(--gema-text-3); border-color: transparent; }
  &.es-bloqueado .gema-flujo-cuerpo { opacity: 0.75; }
}

.gema-flujo-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  font-size: var(--gema-fs-xs);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  border: 1px solid var(--gema-border);
  border-radius: 50%;
  flex: none;
}

.gema-flujo-cuerpo {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  text-decoration: none;
  color: inherit;

  &:focus-visible { outline: 2px solid var(--gema-accent); outline-offset: 2px; border-radius: 3px; }
}

.gema-flujo-nombre {
  font-size: var(--gema-fs);
  font-weight: 500;
  color: var(--gema-text);
}

.gema-flujo-desc {
  font-size: var(--gema-fs-xs);
  line-height: 1.45;
  color: var(--gema-text-3);
}

.gema-flujo-detalle {
  font-size: var(--gema-fs-xs);
  color: var(--gema-text-2);
  margin-top: 1px;
}

.gema-flujo-estado { margin-top: 2px; flex: none; }

@media (max-width: 720px) {
  .gema-flujo-paso { grid-template-columns: 26px 1fr; }
  .gema-flujo-estado { grid-column: 2; justify-self: start; }
}
</style>
