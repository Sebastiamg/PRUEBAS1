<template>
  <div>
    <!-- Barra: fecha de referencia y resumen global -->
    <div class="gema-toolbar">
      <div class="gema-field gema-tab-fecha">
        <input v-model="fecha" class="gema-input" type="date" @change="cargar" />
      </div>

      <div class="gema-btn-group">
        <button class="gema-btn is-sm" type="button" @click="moverMes(-1)">Mes anterior</button>
        <button class="gema-btn is-sm" type="button" @click="hoy">Hoy</button>
        <button class="gema-btn is-sm" type="button" @click="moverMes(1)">Mes siguiente</button>
      </div>

      <div class="gema-toolbar-sep"></div>

      <div class="gema-btn-group">
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'tarjetas' }" type="button" @click="vista = 'tarjetas'">
          Tarjetas
        </button>
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'tabla' }" type="button" @click="vista = 'tabla'">
          Tabla
        </button>
      </div>

      <div class="gema-spacer"></div>

      <div v-if="global" class="gema-tab-global">
        <span class="gema-eyebrow">Cumplimiento</span>
        <span class="gema-num gema-tab-global-val">
          {{ global.cumplimiento === null ? '—' : global.cumplimiento + '%' }}
        </span>
        <span class="gema-tab-global-detalle">
          <span><span class="gema-dot is-verde"></span>{{ global.verde }}</span>
          <span><span class="gema-dot is-ambar"></span>{{ global.ambar }}</span>
          <span><span class="gema-dot is-rojo"></span>{{ global.rojo }}</span>
          <span><span class="gema-dot is-gris"></span>{{ global.gris }}</span>
        </span>
      </div>
    </div>

    <div v-if="cargando" class="gema-card gema-empty">Cargando tablero...</div>

    <!-- =========================== TARJETAS =========================== -->
    <div v-else-if="vista === 'tarjetas'" class="gema-tab-pilares">
      <section v-for="pilar in pilares" :key="pilar.pilar_id" class="gema-tab-pilar">
        <header class="gema-tab-pilar-head">
          <span class="gema-tab-pilar-marca" :style="{ background: pilar.color }"></span>
          <span class="gema-h2">{{ pilar.nombre }}</span>
          <span class="gema-faint gema-tab-pilar-conteo">{{ pilar.kpis.length }} KPIs</span>
          <div class="gema-spacer"></div>
          <span class="gema-chip" :class="'is-' + peorSemaforo(pilar)">
            {{ pilar.resumen.cumplimiento === null ? 'sin datos' : pilar.resumen.cumplimiento + '%' }}
          </span>
        </header>

        <div class="gema-tab-grid">
          <article
            v-for="k in pilar.kpis"
            :key="k.kpi_id"
            class="gema-tab-kpi"
            :class="'sem-' + k.semaforo"
            tabindex="0"
            @click="abrir(k)"
            @keyup.enter="abrir(k)"
          >
            <div class="gema-tab-kpi-top">
              <span class="gema-tab-kpi-nombre">{{ k.nombre }}</span>
              <span v-if="k.es_consolidado" class="gema-chip gema-tab-kpi-badge" title="Se calcula con otros KPIs">Σ</span>
            </div>

            <div class="gema-tab-kpi-mid">
              <gema-indicador
                :valor="k.valor ? k.valor.valor_indicador : null"
                :unidad="k.unidad_medida"
                :semaforo="k.semaforo"
                :con-punto="false"
                class="gema-tab-kpi-valor"
              />
              <gema-tendencia :serie="k.historico" class="gema-tab-kpi-tend" />
            </div>

            <div class="gema-tab-kpi-pie">
              <span class="gema-tab-kpi-target">{{ k.target_legible }}</span>
              <span class="gema-tab-kpi-freq">{{ k.frecuencia }} · {{ k.periodo ? k.periodo.etiqueta : '—' }}</span>
            </div>

            <div v-if="k.accountable" class="gema-tab-kpi-acc">{{ k.accountable }}</div>
          </article>
        </div>
      </section>
    </div>

    <!-- ============================ TABLA ============================ -->
    <div v-else class="gema-table-wrap">
      <div class="gema-table-scroll">
        <table class="gema-table">
          <thead>
            <tr>
              <th style="width: 92px">Pilar</th>
              <th>KPI</th>
              <th style="width: 100px">Frecuencia</th>
              <th style="width: 84px">Periodo</th>
              <th class="is-num" style="width: 110px">Indicador</th>
              <th style="width: 170px">Target</th>
              <th style="width: 84px">Tendencia</th>
              <th style="width: 160px">Responsable</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="pilar in pilares">
              <tr v-for="k in pilar.kpis" :key="k.kpi_id" @click="abrir(k)">
                <td>
                  <span class="gema-chip" :style="{ color: pilar.color }">{{ pilar.nombre }}</span>
                </td>
                <td>
                  {{ k.nombre }}
                  <span v-if="k.es_consolidado" class="gema-faint" title="Consolidado">Σ</span>
                </td>
                <td class="gema-faint">{{ k.frecuencia }}</td>
                <td class="gema-faint gema-num">{{ k.periodo ? k.periodo.etiqueta : '—' }}</td>
                <td class="is-num">
                  <gema-indicador
                    :valor="k.valor ? k.valor.valor_indicador : null"
                    :unidad="k.unidad_medida"
                    :semaforo="k.semaforo"
                  />
                </td>
                <td class="gema-faint">{{ k.target_legible }}</td>
                <td :class="'gema-sem-' + k.semaforo"><gema-tendencia :serie="k.historico" /></td>
                <td class="gema-faint">{{ k.accountable || '—' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================= PANEL DE DETALLE ========================= -->
    <gema-panel
      :abierto="!!seleccionado"
      :titulo="seleccionado ? seleccionado.nombre : ''"
      :subtitulo="seleccionado ? seleccionado.pilar + ' · ' + (seleccionado.meta || '') : ''"
      ancho
      @cerrar="seleccionado = null"
    >
      <template v-if="seleccionado">
        <div class="gema-tab-det-cab" :class="'sem-' + seleccionado.semaforo">
          <gema-indicador
            :valor="seleccionado.valor ? seleccionado.valor.valor_indicador : null"
            :unidad="seleccionado.unidad_medida"
            :semaforo="seleccionado.semaforo"
            :con-punto="false"
            class="gema-tab-det-valor"
          />
          <div class="gema-tab-det-cab-info">
            <span class="gema-eyebrow">Target</span>
            <span>{{ seleccionado.target_legible }}</span>
          </div>
        </div>

        <dl class="gema-kv">
          <dt>Periodo</dt>
          <dd>{{ seleccionado.periodo ? seleccionado.periodo.etiqueta : '—' }} ({{ seleccionado.frecuencia }})</dd>

          <dt>Estado</dt>
          <dd>{{ seleccionado.estado_captura }}</dd>

          <dt>Responsable</dt>
          <dd>{{ seleccionado.accountable || 'Sin asignar' }}</dd>

          <template v-if="seleccionado.valor && seleccionado.valor.numerador !== null">
            <dt>Calculo</dt>
            <dd class="gema-num">
              {{ seleccionado.valor.numerador }} / {{ seleccionado.valor.denominador }}
            </dd>
          </template>

          <template v-if="seleccionado.valor && seleccionado.valor.valor_plan !== null">
            <dt>Plan</dt>
            <dd class="gema-num">{{ seleccionado.valor.valor_plan }}</dd>
          </template>
        </dl>

        <div v-if="seleccionado.formula_texto">
          <span class="gema-eyebrow">Formula de calculo</span>
          <p class="gema-tab-det-formula">{{ seleccionado.formula_texto }}</p>
        </div>

        <!-- Desglose de un consolidado -->
        <div v-if="seleccionado.desglose && seleccionado.desglose.length">
          <span class="gema-eyebrow">De donde sale el numero</span>
          <div class="gema-table-wrap gema-tab-det-tabla">
            <table class="gema-table">
              <thead>
                <tr>
                  <th>KPI componente</th>
                  <th class="is-num" style="width: 90px">Aporte</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in seleccionado.desglose" :key="c.kpi_id">
                  <td>{{ c.nombre }}</td>
                  <td class="is-num">
                    <span v-if="c.falta" class="gema-chip is-gris">falta</span>
                    <span v-else class="gema-num">{{ c.indicador }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="seleccionado.desglose.some(c => c.falta)" class="gema-alert is-warn gema-tab-det-aviso">
            Mientras falte el dato validado de algun componente, este KPI no muestra indicador.
          </p>
        </div>

        <!-- Historico -->
        <div v-if="seleccionado.historico && seleccionado.historico.length">
          <span class="gema-eyebrow">Ultimos periodos</span>
          <div class="gema-table-wrap gema-tab-det-tabla">
            <table class="gema-table">
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th class="is-num" style="width: 110px">Indicador</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(h, i) in [...seleccionado.historico].reverse()" :key="i">
                  <td class="gema-num">{{ h.etiqueta }}</td>
                  <td class="is-num">
                    <gema-indicador
                      :valor="h.valor_indicador"
                      :unidad="seleccionado.unidad_medida"
                      :semaforo="h.semaforo"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="seleccionado = null">Cerrar</button>
        <router-link
          v-if="seleccionado && sesion.puede('kpi_captura') && !seleccionado.es_consolidado"
          class="gema-btn is-primary"
          :to="{ name: 'gema-kpis-captura', query: { kpi: seleccionado.kpi_id } }"
        >
          Capturar valor
        </router-link>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="tablero_n3" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaIndicador from './componentes/GemaIndicador.vue'
import GemaTendencia from './componentes/GemaTendencia.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

export default {
  name: 'GemaTableroN3',

  components: { GemaIndicador, GemaTendencia, GemaPanel, GemaSiguiente },

  data () {
    return {
      sesion,
      cargando: true,
      vista: localStorage.getItem('gema_tablero_vista') || 'tarjetas',
      fecha: new Date().toISOString().slice(0, 10),
      pilares: [],
      global: null,
      seleccionado: null
    }
  },

  watch: {
    vista (v) {
      localStorage.setItem('gema_tablero_vista', v)
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('tablero/gerencia', { fecha: this.fecha, historico: 6 })
        this.pilares = r.data.pilares
        this.global = r.data.resumen_global
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    hoy () {
      this.fecha = new Date().toISOString().slice(0, 10)
      this.cargar()
    },

    moverMes (delta) {
      const d = new Date(this.fecha + 'T12:00:00')
      d.setMonth(d.getMonth() + delta)
      this.fecha = d.toISOString().slice(0, 10)
      this.cargar()
    },

    /** El pilar se muestra con el peor semaforo de sus KPIs con dato. */
    peorSemaforo (pilar) {
      if (pilar.resumen.rojo > 0) return 'rojo'
      if (pilar.resumen.ambar > 0) return 'ambar'
      if (pilar.resumen.verde > 0) return 'verde'

      return 'gris'
    },

    abrir (kpi) {
      this.seleccionado = kpi
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-tab-fecha { min-width: 140px; }

.gema-tab-global {
  display: flex;
  align-items: center;
  gap: var(--gema-u2);
}

.gema-tab-global-val { font-size: var(--gema-fs-lg); font-weight: 600; }

.gema-tab-global-detalle {
  display: flex;
  gap: var(--gema-u2);
  font-size: var(--gema-fs-xs);
  color: var(--gema-text-3);

  span { display: inline-flex; align-items: center; gap: 3px; }
}

// --- Tarjetas --------------------------------------------------------------
.gema-tab-pilares { display: flex; flex-direction: column; gap: var(--gema-u3); }

.gema-tab-pilar {
  background: var(--gema-surface);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius-lg);
  overflow: hidden;
}

.gema-tab-pilar-head {
  display: flex;
  align-items: center;
  gap: var(--gema-u2);
  height: 34px;
  padding: 0 var(--gema-u3);
  border-bottom: 1px solid var(--gema-border);
  background: var(--gema-surface-2);
}

.gema-tab-pilar-marca { width: 3px; height: 14px; border-radius: 2px; flex: none; }
.gema-tab-pilar-conteo { font-size: var(--gema-fs-xs); }

.gema-tab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
}

// Cada KPI es una celda de una rejilla separada por lineas de 1px: densa y
// sin tarjetas flotantes que desperdicien espacio.
.gema-tab-kpi {
  padding: var(--gema-u2) var(--gema-u3) 7px;
  border-right: 1px solid var(--gema-border);
  border-bottom: 1px solid var(--gema-border);
  cursor: pointer;
  outline: none;

  &:hover, &:focus-visible { background: var(--gema-surface-2); }
  &:focus-visible { box-shadow: inset 0 0 0 2px var(--gema-accent); }

  &.sem-verde .gema-tab-kpi-tend { color: var(--gema-verde); }
  &.sem-ambar .gema-tab-kpi-tend { color: var(--gema-ambar); }
  &.sem-rojo  .gema-tab-kpi-tend { color: var(--gema-rojo); }
  &.sem-gris  .gema-tab-kpi-tend { color: var(--gema-gris); }
}

.gema-tab-kpi-top {
  display: flex;
  align-items: flex-start;
  gap: var(--gema-u);
  min-height: 32px;
}

.gema-tab-kpi-nombre {
  flex: 1 1 auto;
  font-size: var(--gema-fs-sm);
  font-weight: 500;
  line-height: 1.3;
  color: var(--gema-text);
}

.gema-tab-kpi-badge { flex: none; font-size: 10px; height: 16px; padding: 0 4px; }

.gema-tab-kpi-mid {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--gema-u2);
  margin: 2px 0 3px;
}

.gema-tab-kpi-valor ::v-deep .gema-ind-valor {
  font-size: var(--gema-fs-num);
  letter-spacing: -0.02em;
}

.gema-tab-kpi-tend { flex: none; margin-bottom: 3px; }

.gema-tab-kpi-pie {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gema-u2);
  font-size: var(--gema-fs-xs);
  color: var(--gema-text-3);
}

.gema-tab-kpi-target { color: var(--gema-text-2); }
.gema-tab-kpi-freq { flex: none; }

.gema-tab-kpi-acc {
  margin-top: 3px;
  font-size: var(--gema-fs-xs);
  color: var(--gema-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// --- Panel de detalle -------------------------------------------------------
.gema-tab-det-cab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gema-u3);
  padding: var(--gema-u3);
  background: var(--gema-surface-2);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
}

.gema-tab-det-valor ::v-deep .gema-ind-valor { font-size: 28px; letter-spacing: -0.02em; }

.gema-tab-det-cab-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: var(--gema-fs-sm);
  text-align: right;
}

.gema-tab-det-formula {
  margin: 3px 0 0;
  font-size: var(--gema-fs-sm);
  line-height: 1.45;
  color: var(--gema-text-2);
}

.gema-tab-det-tabla { margin-top: 3px; }
.gema-tab-det-aviso { margin-top: var(--gema-u2); }
</style>
