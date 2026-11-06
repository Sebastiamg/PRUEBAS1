<template>
  <div>
    <div class="gema-toolbar">
      <label class="gema-row gema-av-check">
        <input v-model="incluirFinalizadas" type="checkbox" @change="cargar" />
        <span class="gema-muted">Ver tambien las finalizadas</span>
      </label>

      <div class="gema-spacer"></div>
      <input v-model="fecha" class="gema-input gema-av-fecha" type="date" :max="hoy" @change="actualizar" />
      <button class="gema-btn is-sm" type="button" @click="actualizar">Actualizar</button>
    </div>

    <div class="gema-tiles">
      <div class="gema-tile">
        <div class="gema-tile-label">Tareas asignadas</div>
        <div class="gema-tile-value">{{ resumen.tareas || 0 }}</div>
        <div class="gema-tile-note">en planes publicados</div>
      </div>
      <div class="gema-tile">
        <div class="gema-tile-label">Deberia llevar hoy</div>
        <div class="gema-tile-value">{{ num(resumen.paginas_plan_dtd) }}</div>
        <div class="gema-tile-note">de {{ num(resumen.paginas_plan) }} paginas del plan</div>
      </div>
      <div class="gema-tile">
        <div class="gema-tile-label">Llevo</div>
        <div class="gema-tile-value">{{ num(resumen.paginas_real) }}</div>
        <div class="gema-tile-note">{{ num(resumen.horas_real) }} horas registradas</div>
      </div>
      <div class="gema-tile" :class="{ 'is-alerta': resumen.cumplimiento_dtd !== null && resumen.cumplimiento_dtd < 100 }">
        <div class="gema-tile-label">Mi cumplimiento</div>
        <div class="gema-tile-value">
          {{ resumen.cumplimiento_dtd === null ? '—' : resumen.cumplimiento_dtd + '%' }}
        </div>
        <div class="gema-tile-note">
          {{ mensajeCumplimiento }}
        </div>
      </div>
    </div>

    <p class="gema-alert gema-av-ayuda">
      Para registrar lo que produjo, use <strong>+ Registrar actividad</strong> en
      <strong>Otras actividades</strong> y vinculela al libro/etapa — no hace falta
      hacerlo dos veces.
    </p>

    <!-- Mi plan de hoy: el rango especifico de paginas de cada libro, no solo el acumulado -->
    <div v-if="cargandoDiario" class="gema-card gema-empty">Calculando el dia...</div>

    <template v-else>
      <section class="gema-card gema-mp-tabla">
        <div class="gema-card-head"><span class="gema-h2">Plan de produccion — hoy</span></div>
        <div v-if="!diario.filas_plan.length" class="gema-faint gema-mp-vacio">Hoy no tiene rango de paginas planificado en ningun libro.</div>
        <div v-else class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th>Area</th><th>Grado</th><th class="is-wrap">Libro</th><th style="width: 50px">Etapa</th>
                <th class="is-num" style="width: 110px">Pag. inicial-final</th>
                <th class="is-num" style="width: 80px"># paginas</th>
                <th>Unidad(es)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in diario.filas_plan" :key="'p' + f.plan_tarea_id">
                <td class="gema-faint">{{ f.area || '—' }}</td>
                <td class="gema-faint">{{ f.grado || '—' }}</td>
                <td class="is-wrap">{{ f.libro }}</td>
                <td><span class="gema-chip">{{ f.etapa }}</span></td>
                <td class="is-num gema-num">{{ f.desde }}–{{ f.hasta }}</td>
                <td class="is-num">{{ num(f.paginas) }}</td>
                <td class="gema-faint">{{ f.unidades.join(', ') || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="gema-card gema-mp-tabla">
        <div class="gema-card-head"><span class="gema-h2">Real de produccion — hoy</span></div>
        <div v-if="!diario.filas_real.length" class="gema-faint gema-mp-vacio">Todavia no registra avance hoy.</div>
        <div v-else class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th>Area</th><th>Grado</th><th class="is-wrap">Libro</th><th style="width: 50px">Etapa</th>
                <th class="is-num" style="width: 110px">Pag. inicial-final</th>
                <th class="is-num" style="width: 80px"># paginas</th>
                <th>Unidad(es)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in diario.filas_real" :key="'r' + f.plan_tarea_id">
                <td class="gema-faint">{{ f.area || '—' }}</td>
                <td class="gema-faint">{{ f.grado || '—' }}</td>
                <td class="is-wrap">{{ f.libro }}</td>
                <td><span class="gema-chip">{{ f.etapa }}</span></td>
                <td class="is-num gema-num">{{ f.desde }}–{{ f.hasta }}</td>
                <td class="is-num"><b>{{ num(f.paginas) }}</b></td>
                <td class="gema-faint">{{ f.unidades.join(', ') || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <gema-tabla
      :columnas="columnas"
      :filas="tareas"
      :cargando="cargando"
      orden-inicial="fecha_inicio"
      texto-vacio="No tiene tareas de produccion asignadas"
    >
      <template #vacio>
        Aparecen aqui las etapas que le asignen en un plan publicado.
      </template>

      <template #default="{ filas }">
        <tr v-for="t in filas" :key="t.plan_tarea_id">
          <td class="is-wrap">
            {{ t.libro }}
            <span v-if="t.tramo_actual" class="gema-faint gema-av-unidad">va en {{ t.tramo_actual }}</span>
          </td>
          <td>
            <span class="gema-chip is-accent">{{ t.etapa }}</span>
          </td>
          <td class="gema-faint gema-num">{{ fmt(t.fecha_inicio) }} — {{ fmt(t.fecha_fin) }}</td>
          <td class="is-num">{{ num(t.paginas_plan) }}</td>
          <td class="is-num gema-faint">{{ num(t.paginas_plan_dtd) }}</td>
          <td class="is-num">
            <span :class="'gema-sem-' + t.semaforo" class="gema-av-real">{{ num(t.paginas_real) }}</span>
          </td>
          <td>
            <div class="gema-av-barra">
              <div class="gema-bar">
                <span
                  :class="'is-' + t.semaforo"
                  :style="{ width: Math.min(100, t.paginas_plan > 0 ? (t.paginas_real / t.paginas_plan) * 100 : 0) + '%' }"
                ></span>
              </div>
              <span class="gema-faint gema-av-pct">
                {{ t.paginas_plan > 0 ? Math.round((t.paginas_real / t.paginas_plan) * 100) : 0 }}%
              </span>
            </div>
          </td>
          <td>
            <span class="gema-row">
              <span class="gema-dot" :class="'is-' + t.semaforo"></span>
              <span v-if="t.justificada" class="gema-chip is-ambar">justificado</span>
              <span v-else class="gema-faint gema-av-estado">{{ t.estado }}</span>
            </span>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <!-- Mi historico dia a dia -->
    <section class="gema-card gema-mp-tabla">
      <div class="gema-card-head">
        <span class="gema-h2">Mi historico</span>
        <span class="gema-faint">Ultimos {{ historico.dias.length }} dias laborables (esquiva fines de semana y feriados)</span>
      </div>
      <div v-if="!historico.dias.length" class="gema-faint gema-mp-vacio">Sin datos todavia.</div>
      <div v-else class="gema-table-scroll">
        <table class="gema-table gema-mp-historico">
          <thead>
            <tr>
              <th style="width: 80px">Ciclo</th>
              <th v-for="d in historico.dias" :key="d.fecha" class="is-num" style="width: 96px">{{ fmt(d.fecha) }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="c in historico.ciclos">
              <tr :key="c + '-plan'">
                <td>{{ c }} <span class="gema-faint">plan</span></td>
                <td v-for="d in historico.dias" :key="d.fecha + '-plan'" class="is-num gema-faint">{{ num(d.ciclos[c].plan) }}</td>
              </tr>
              <tr :key="c + '-real'">
                <td>{{ c }} <span class="gema-faint">real</span></td>
                <td
                  v-for="d in historico.dias"
                  :key="d.fecha + '-real'"
                  class="is-num"
                  :class="d.ciclos[c].plan > 0 && d.ciclos[c].real < d.ciclos[c].plan ? 'gema-sem-rojo' : 'gema-sem-verde'"
                >
                  <b>{{ num(d.ciclos[c].real) }}</b>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaTabla from './componentes/GemaTabla.vue'

/**
 * "Mi avance" (produccion) ya no tiene su propio boton de registrar: se
 * registra desde "Otras actividades" (+ Registrar actividad, vinculada al
 * libro/etapa) — esa pantalla ya escribe al mismo avance de la tarea
 * (ver GemaActividadController::sincronizarAvancePlan), asi que tener dos
 * botones para lo mismo solo confundia. Este componente quedo puramente de
 * consulta: tiles, plan/real de hoy, la tabla de tareas y el historico.
 */
export default {
  name: 'GemaMiAvance',

  components: { GemaTabla },

  data () {
    const hoy = new Date().toISOString().slice(0, 10)

    return {
      hoy,
      cargando: true,
      fecha: hoy,
      incluirFinalizadas: false,
      tareas: [],
      resumen: {},
      cargandoDiario: true,
      diario: { filas_plan: [], filas_real: [], resumen: {}, horas: { colaboradores: [], promedio: 0 } },
      historico: { dias: [], ciclos: [] },
      columnas: [
        { clave: 'libro', titulo: 'Libro y unidad' },
        { clave: 'etapa', titulo: 'Etapa', ancho: '90px' },
        { clave: 'fecha_inicio', titulo: 'Ventana', ancho: '170px' },
        { clave: 'paginas_plan', titulo: 'Plan', numerica: true, ancho: '70px' },
        { clave: 'paginas_plan_dtd', titulo: 'A hoy', numerica: true, ancho: '74px' },
        { clave: 'paginas_real', titulo: 'Llevo', numerica: true, ancho: '74px' },
        { clave: 'avance', titulo: 'Avance', ancho: '130px', ordenable: false },
        { clave: 'semaforo', titulo: 'Estado', ancho: '120px' }
      ]
    }
  },

  computed: {
    mensajeCumplimiento () {
      const c = this.resumen.cumplimiento_dtd

      if (c === null || c === undefined) return 'sin plan a la fecha'
      if (c >= 100) return 'va al dia o adelantado'
      if (c >= 90) return 'va justo, ajuste el ritmo'

      return 'va atrasado frente al plan'
    }
  },

  created () {
    this.cargar()
    this.cargarDiario()
  },

  methods: {
    actualizar () {
      this.cargar()
      this.cargarDiario()
    },

    num (v) {
      return (Number(v) || 0).toLocaleString('es-EC', { maximumFractionDigits: 2 })
    },

    fmt (v) {
      if (!v) return '—'

      return String(v).slice(0, 10).split('-').reverse().join('/')
    },

    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('planes/mis-tareas', {
          fecha: this.fecha,
          incluir_finalizadas: this.incluirFinalizadas ? 1 : undefined
        })

        this.tareas = r.data
        this.resumen = r.resumen || {}
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    /**
     * Mi "plan de hoy" (rango especifico de paginas por libro, no solo el
     * acumulado) y mi historico dia a dia — la misma vista que usa el jefe en
     * Seguimiento del equipo, pero forzada a mis propias tareas.
     */
    async cargarDiario () {
      this.cargandoDiario = true

      try {
        const [diario, historico] = await Promise.all([
          api.get('planes/mi-control-diario', { fecha: this.fecha }),
          api.get('planes/mi-control-diario/historico', { fecha: this.fecha, dias: 15 })
        ])

        this.diario = diario.data
        this.historico = historico.data
      } catch (e) {
        // Informativo: si falla, la tabla de arriba sigue mostrando igual.
      } finally {
        this.cargandoDiario = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-av-fecha { width: 132px; }
.gema-av-check { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-av-ayuda { margin: 0 0 var(--gema-u3); }
.gema-av-unidad { font-size: var(--gema-fs-xs); margin-left: var(--gema-u); }
.gema-av-real { font-weight: 600; }
.gema-av-estado { font-size: var(--gema-fs-xs); }

.gema-av-barra {
  display: flex;
  align-items: center;
  gap: var(--gema-u2);

  .gema-bar { flex: 1 1 auto; min-width: 60px; }
}

.gema-mp-tabla { margin-bottom: var(--gema-u3); }
.gema-mp-vacio { padding: var(--gema-u3); }
.gema-mp-historico th:first-child { position: sticky; left: 0; z-index: 3; }
.gema-mp-historico td:first-child { position: sticky; left: 0; background: var(--gema-surface-2); }

.gema-av-pct { font-size: var(--gema-fs-xs); min-width: 32px; text-align: right; }
</style>
