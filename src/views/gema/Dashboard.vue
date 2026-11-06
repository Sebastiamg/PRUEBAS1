<template>
  <div>
    <!-- El asistente: que le toca hacer ahora y en que orden -->
    <gema-flujo
      :fases="sesion.state.flujo.fases"
      :siguiente="sesion.state.flujo.siguiente"
      :resumen="sesion.state.flujo.resumen"
      :cargando="sesion.state.flujoCargando"
    />

    <!-- Tiles de resumen -->
    <div class="gema-tiles">
      <div
        v-for="tile in datos.tiles"
        :key="tile.clave"
        class="gema-tile"
        :class="{ 'is-alerta': tile.alerta }"
      >
        <div class="gema-tile-label">{{ tile.etiqueta }}</div>
        <div class="gema-tile-value">
          {{ tile.valor === null || tile.valor === undefined ? '—' : tile.valor }}<template v-if="tile.valor !== null && tile.sufijo">{{ tile.sufijo }}</template>
        </div>
        <div v-if="tile.nota" class="gema-tile-note">{{ tile.nota }}</div>
      </div>
    </div>

    <div class="gema-dash">
      <!-- ================== MIS KPIs ================== -->
      <section class="gema-card gema-dash-kpis">
        <div class="gema-card-head">
          <span class="gema-h2">Mis KPIs del periodo</span>
          <!-- Sin KPIs no se ofrece el boton: llevaba a una pantalla vacia. -->
          <router-link
            v-if="sesion.puede('kpi_captura') && datos.mis_kpis.length"
            :to="{ name: 'gema-kpis-captura' }"
            class="gema-btn is-sm"
          >
            Capturar valores
          </router-link>
        </div>

        <div v-if="cargando" class="gema-empty">Cargando...</div>

        <div v-else-if="!datos.mis_kpis.length" class="gema-empty">
          <div class="gema-empty-title">No tiene KPIs asignados</div>
          Aparecen aqui los KPIs de los que usted es responsable o los de su unidad.
        </div>

        <div v-else class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th>KPI</th>
                <th style="width: 54px">Unidad</th>
                <th style="width: 88px">Periodo</th>
                <th class="is-num" style="width: 110px">Indicador</th>
                <th style="width: 150px">Target</th>
                <th style="width: 108px">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in datos.mis_kpis" :key="k.kpi_id">
                <td>
                  <span class="gema-dash-nombre">{{ k.nombre }}</span>
                  <span v-if="k.pilar" class="gema-chip gema-dash-pilar">{{ k.pilar }}</span>
                </td>
                <td class="gema-faint">{{ k.unidad }}</td>
                <td class="gema-faint gema-num">{{ k.periodo ? k.periodo.etiqueta : '—' }}</td>
                <td class="is-num">
                  <gema-indicador
                    :valor="k.valor ? k.valor.valor_indicador : null"
                    :unidad="k.unidad_medida"
                    :semaforo="k.semaforo"
                  />
                </td>
                <td class="gema-faint gema-dash-target">{{ k.target_legible }}</td>
                <td>
                  <span class="gema-chip" :class="claseEstado(k.estado_captura)">
                    {{ etiquetaEstado(k.estado_captura) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ================== COLUMNA DERECHA ================== -->
      <div class="gema-dash-lado">
        <!-- Actividades de hoy -->
        <section class="gema-card">
          <div class="gema-card-head">
            <span class="gema-h2">Mis actividades de hoy</span>
            <router-link
              v-if="sesion.puede('actividades_registro')"
              :to="{ name: 'gema-actividades' }"
              class="gema-btn is-sm"
            >
              Registrar
            </router-link>
          </div>

          <div v-if="!datos.actividades_hoy.length" class="gema-empty gema-dash-empty-sm">
            <div class="gema-empty-title">Nada registrado hoy</div>
            <span v-if="datos.actividades_semana">{{ datos.actividades_semana }} esta semana</span>
          </div>

          <ul v-else class="gema-dash-act">
            <li v-for="a in datos.actividades_hoy" :key="a.actividad_id">
              <span class="gema-dot" :class="claseDotActividad(a.estado)"></span>
              <span class="gema-dash-act-tit">{{ a.titulo }}</span>
              <span class="gema-dash-act-meta">
                <template v-if="a.horas">{{ a.horas }} h</template>
                <template v-if="a.categoria"> · {{ a.categoria.nombre }}</template>
              </span>
            </li>
          </ul>

          <div v-if="datos.actividades_hoy.length" class="gema-table-foot">
            <span>{{ horasHoy }} h registradas hoy</span>
            <span>{{ datos.actividades_semana }} actividades esta semana</span>
          </div>
        </section>

        <!-- Resumen por pilar (solo para quien ve el tablero) -->
        <section v-if="datos.resumen_pilares" class="gema-card">
          <div class="gema-card-head">
            <span class="gema-h2">KPIs N3 por pilar</span>
            <router-link :to="{ name: 'gema-tablero-gerencia' }" class="gema-btn is-sm">Ver tablero</router-link>
          </div>

          <ul class="gema-dash-pilares">
            <li v-for="p in datos.resumen_pilares" :key="p.pilar_id">
              <div class="gema-dash-pilar-fila">
                <span class="gema-dash-pilar-nom">{{ p.nombre }}</span>
                <span class="gema-num gema-dash-pilar-val">
                  {{ p.resumen.cumplimiento === null ? 'sin datos' : p.resumen.cumplimiento + '%' }}
                </span>
              </div>
              <div class="gema-bar">
                <span
                  :class="claseBarra(p.resumen.cumplimiento)"
                  :style="{ width: (p.resumen.cumplimiento || 0) + '%' }"
                ></span>
              </div>
              <div class="gema-dash-pilar-detalle">
                <span><span class="gema-dot is-verde"></span> {{ p.resumen.verde }}</span>
                <span><span class="gema-dot is-ambar"></span> {{ p.resumen.ambar }}</span>
                <span><span class="gema-dot is-rojo"></span> {{ p.resumen.rojo }}</span>
                <span><span class="gema-dot is-gris"></span> {{ p.resumen.gris }}</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaIndicador from './componentes/GemaIndicador.vue'
import GemaFlujo from './componentes/GemaFlujo.vue'

const ESTADOS = {
  sin_capturar: { texto: 'Sin capturar', clase: 'is-gris' },
  borrador: { texto: 'Borrador', clase: '' },
  enviado: { texto: 'En validacion', clase: 'is-accent' },
  validado: { texto: 'Validado', clase: 'is-verde' },
  rechazado: { texto: 'Devuelto', clase: 'is-rojo' }
}

export default {
  name: 'GemaDashboard',

  components: { GemaIndicador, GemaFlujo },

  data () {
    return {
      sesion,
      cargando: true,
      datos: {
        tiles: [],
        mis_kpis: [],
        actividades_hoy: [],
        actividades_semana: 0,
        resumen_pilares: null
      }
    }
  },

  computed: {
    horasHoy () {
      return this.datos.actividades_hoy
        .reduce((total, a) => total + (Number(a.horas) || 0), 0)
        .toLocaleString('es-EC', { maximumFractionDigits: 2 })
    }
  },

  created () {
    this.cargar()
    // El proceso ya lo trae el layout; aqui solo se asegura de tenerlo.
    sesion.cargarFlujo()
  },

  methods: {
    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('dashboard')
        this.datos = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    etiquetaEstado (estado) {
      return (ESTADOS[estado] || {}).texto || estado
    },

    claseEstado (estado) {
      return (ESTADOS[estado] || {}).clase || ''
    },

    claseDotActividad (estado) {
      if (estado === 'validada') return 'is-verde'
      if (estado === 'rechazada') return 'is-rojo'

      return 'is-gris'
    },

    claseBarra (cumplimiento) {
      if (cumplimiento === null) return 'is-gris'
      if (cumplimiento >= 90) return 'is-verde'
      if (cumplimiento >= 60) return 'is-ambar'

      return 'is-rojo'
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-dash {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--gema-u3);
  align-items: start;
}

.gema-dash-lado { display: flex; flex-direction: column; gap: var(--gema-u3); }

.gema-dash-nombre { margin-right: var(--gema-u2); }
.gema-dash-pilar { font-weight: 500; }
.gema-dash-target { font-size: var(--gema-fs-sm); }
.gema-dash-empty-sm { padding: var(--gema-u4) var(--gema-u3); }

// --- Actividades de hoy ---------------------------------------------------
.gema-dash-act {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: baseline;
    gap: var(--gema-u2);
    padding: 6px var(--gema-u3);
    border-bottom: 1px solid var(--gema-border);
    font-size: var(--gema-fs);

    &:last-child { border-bottom: none; }
  }
}

.gema-dash-act-tit {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gema-dash-act-meta {
  flex: none;
  font-size: var(--gema-fs-xs);
  color: var(--gema-text-3);
}

// --- Resumen por pilar ----------------------------------------------------
.gema-dash-pilares {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    padding: var(--gema-u2) var(--gema-u3);
    border-bottom: 1px solid var(--gema-border);

    &:last-child { border-bottom: none; }
  }
}

.gema-dash-pilar-fila {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 5px;
}

.gema-dash-pilar-nom { font-size: var(--gema-fs-sm); font-weight: 600; }
.gema-dash-pilar-val { font-size: var(--gema-fs-sm); color: var(--gema-text-2); }

.gema-dash-pilar-detalle {
  display: flex;
  gap: var(--gema-u3);
  margin-top: 5px;
  font-size: var(--gema-fs-xs);
  color: var(--gema-text-3);

  span { display: inline-flex; align-items: center; gap: 4px; }
}

@media (max-width: 1080px) {
  .gema-dash { grid-template-columns: minmax(0, 1fr); }
}
</style>
