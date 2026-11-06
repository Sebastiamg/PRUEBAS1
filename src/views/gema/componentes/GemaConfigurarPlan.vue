<template>
 <div>
  <gema-panel :abierto="abierto" titulo="Configurar el plan" modo="modal" tamano="xl" @cerrar="cerrar">
    <p class="gema-alert">
      Defina el calendario y los equipos, cuantos ciclos usa este plan, cuanto
      rinde cada uno (plan real y plan motivador) y que libros entran. Al
      confirmar se arma el Gantt completo.
    </p>

    <p v-if="tareasExistentes" class="gema-alert is-warn">
      El plan ya tiene {{ tareasExistentes }} tareas. Confirmar reemplaza todo lo que hay por lo que se ve aqui.
    </p>

    <!-- ===================== 1. CALENDARIO Y EQUIPOS ===================== -->
    <section class="gema-cfg-panel">
      <span class="gema-eyebrow">Calendario y equipos</span>

      <div class="gema-cfg-grid">
        <div class="gema-field">
          <label class="gema-label">Fecha inicio *</label>
          <input v-model="calendario.fecha_inicio" class="gema-input" type="date" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Meta fecha fin</label>
          <input v-model="calendario.meta_fecha_fin" class="gema-input" type="date" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Personas Redaccion (total)</label>
          <input v-model.number="calendario.personas_red" class="gema-input" type="number" min="1" step="1" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Personas Diseno (total)</label>
          <input v-model.number="calendario.personas_dis" class="gema-input" type="number" min="1" step="1" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Libros en paralelo</label>
          <input v-model.number="calendario.libros_en_paralelo" class="gema-input" type="number" min="1" step="1" @input="paraleloManual = true" />
          <span class="gema-faint gema-cfg-pista">
            Cuantos LIBROS arrancan el mismo dia. Por defecto, todos los
            marcados a la vez ({{ librosSel.length || 1 }}) — baje el numero
            solo si no alcanza el equipo para producir todos al tiempo. Cada
            libro es una sola tarea continua por etapa (no una por unidad): el
            colaborador registra paginas del libro completo, sin importar en
            que unidad caigan.
          </span>
        </div>

        <label class="gema-row gema-cfg-checkbox">
          <input v-model="calendario.incluye_fines_semana" type="checkbox" />
          <span>Contar sabados y domingos como dias de trabajo</span>
        </label>
      </div>
    </section>

    <!-- ===================== 2. PRODUCTIVIDAD POR CICLO ===================== -->
    <section class="gema-cfg-panel">
      <span class="gema-eyebrow">Productividad por ciclo</span>
      <p class="gema-faint gema-cfg-pista">
        Cuantos ciclos usa este plan (no todos los libros necesitan los mismos:
        eso se ajusta por libro mas abajo), y cuantas paginas por dia rinde cada
        equipo en el <strong>Plan real</strong> (el que ve usted) y el
        <strong>Plan motivador</strong> (lo que le pide al colaborador,
        siempre mas exigente porque usted lo decide, no un porcentaje del
        sistema).
      </p>

      <div class="gema-row gema-cfg-ciclos-control">
        <label class="gema-label">Ciclos de este plan</label>
        <input v-model.number="cantidadCiclos" class="gema-input gema-cfg-mini" type="number" min="1" max="20" step="1" />
        <button class="gema-btn is-sm" type="button" :disabled="ajustandoCiclos || cantidadCiclos === ciclos.length" @click="cambiarCantidadCiclos">
          {{ ajustandoCiclos ? 'Ajustando...' : 'Aplicar' }}
        </button>
        <span class="gema-faint">Hoy: {{ ciclos.length }} ciclo(s)</span>
      </div>

      <div class="gema-btn-group gema-cfg-modo-tabs">
        <button
          v-for="modo in MODOS"
          :key="modo.clave"
          class="gema-btn is-sm"
          :class="{ 'is-active': modoActivo === modo.clave }"
          type="button"
          @click="modoActivo = modo.clave"
        >
          Plan {{ modo.clave }}
        </button>
      </div>

      <div class="gema-table-wrap gema-cfg-productividad">
        <table class="gema-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th v-for="c in ciclos" :key="c" class="is-num" style="width: 100px">{{ c }}</th>
              <th class="is-num" style="width: 90px">FINALIZ.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in areas" :key="a.clave">
              <td>
                <span class="gema-chip" :class="a.clave === 'redaccion' ? 'is-accent' : ''">{{ a.etiqueta }}</span>
              </td>
              <td v-for="c in ciclos" :key="a.clave + c" class="is-num">
                <input
                  v-if="etapaDe(a.clave, c)"
                  class="gema-input gema-cfg-mini is-num"
                  type="number"
                  step="1"
                  min="0"
                  :value="ppdDe(a.clave, c, modoActivo)"
                  @change="setPpd(a.clave, c, modoActivo, $event.target.value)"
                />
                <span v-else class="gema-faint">—</span>
              </td>
              <td class="is-num gema-cfg-finaliz">{{ finalizArea(a.clave, modoActivo) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <span v-if="!ciclos.length" class="gema-faint gema-cfg-pista">
        Este plan todavia no tiene ciclos. Ponga una cantidad arriba y de "Aplicar".
      </span>
    </section>

    <!-- ===================== 3. LIBROS A PRODUCIR ===================== -->
    <section class="gema-cfg-panel">
      <span class="gema-eyebrow">Libros a producir</span>
      <p class="gema-faint gema-cfg-pista">
        Marque todos los libros que entran en este plan (pueden ser 1 o 50), y
        cuantos ciclos necesita cada uno — un libro puede necesitar solo 1 ciclo
        y otro 6 o 7; el proceso de arriba trae los ciclos que hay disponibles.
      </p>

      <div v-if="libros.length" class="gema-row gema-cfg-libros-toolbar">
        <button class="gema-btn is-sm is-quiet" type="button" @click="seleccionarTodos">Seleccionar todos</button>
        <button class="gema-btn is-sm is-quiet" type="button" @click="librosSel = []">Ninguno</button>
        <div class="gema-spacer"></div>
        <span class="gema-faint">Ciclos para los marcados:</span>
        <input v-model.number="ciclosMasivo" class="gema-input gema-cfg-mini is-num" type="number" min="1" max="20" step="1" style="width: 70px" />
        <button class="gema-btn is-sm" type="button" :disabled="!librosSel.length" @click="aplicarCiclosAMarcados">Aplicar a marcados</button>
      </div>

      <div v-if="libros.length" class="gema-cfg-libros">
        <div v-for="g in librosPorMateria" :key="g.materia" class="gema-cfg-grupo">
          <div class="gema-cfg-grupo-cabecera">
            <label class="gema-row">
              <input type="checkbox" :checked="grupoCompleto(g)" @change="alternarGrupo(g, $event.target.checked)" />
              <strong>{{ g.materia }}</strong>
              <span class="gema-faint">({{ g.libros.length }})</span>
            </label>
          </div>

          <div class="gema-table-wrap">
            <table class="gema-table">
              <tbody>
                <tr v-for="l in g.libros" :key="l.libro_id" :class="{ 'is-selected': librosSel.includes(l.libro_id) }">
                  <td style="width: 34px">
                    <input type="checkbox" :checked="librosSel.includes(l.libro_id)" @change="alternarLibro(l.libro_id)" />
                  </td>
                  <td class="is-wrap">{{ l.nombre }}</td>
                  <td class="is-num gema-faint" style="width: 76px">{{ l.unidades ? l.unidades.length : 0 }} unid.</td>
                  <td class="is-num gema-faint" style="width: 84px">{{ l.paginas_total }} pag.</td>
                  <td class="is-num" style="width: 130px">
                    <label class="gema-row gema-cfg-ciclo-libro">
                      <span class="gema-faint">Ciclos</span>
                      <input
                        class="gema-input gema-cfg-mini is-num"
                        type="number"
                        min="1"
                        max="20"
                        step="1"
                        :value="cicloDeLibro(l)"
                        @change="setCicloLibro(l.libro_id, $event.target.value)"
                      />
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p v-else class="gema-faint gema-cfg-pista">
        Todavia no hay libros cargados. Vaya a "Libros y unidades" para crearlos
        (uno por uno o varios de una vez con la carga masiva) y vuelva aqui a
        marcarlos.
      </p>

      <!-- ---- Excepciones de productividad: la regla sigue siendo la de arriba,
           esto es solo para el libro puntual que de verdad rinde distinto. ---- -->
      <div v-if="librosSel.length" class="gema-cfg-excepciones">
        <div class="gema-row">
          <span class="gema-faint gema-cfg-pista">
            Por defecto TODOS los libros marcados usan el ritmo del equipo de
            arriba. Si uno en especial es mas lento (o mas rapido) que el
            resto, agreguelo aqui como excepcion — sin cambiar el ritmo
            general de los demas.
          </span>
          <div class="gema-spacer"></div>
          <button class="gema-btn is-sm is-quiet" type="button" @click="agregarExcepcion">
            + Ajustar un libro en especial
          </button>
        </div>

        <div v-if="excepciones.length" class="gema-row gema-cfg-excepciones-modo">
          <span class="gema-faint">Editando:</span>
          <div class="gema-btn-group">
            <button
              v-for="modo in MODOS"
              :key="modo.clave"
              class="gema-btn is-sm"
              :class="{ 'is-active': modoActivo === modo.clave }"
              type="button"
              @click="modoActivo = modo.clave"
            >
              Plan {{ modo.clave }}
            </button>
          </div>
        </div>

        <div v-for="(ex, i) in excepciones" :key="i" class="gema-cfg-excepcion">
          <div class="gema-row gema-cfg-excepcion-cabecera">
            <button class="gema-btn is-sm" type="button" @click="abrirExcepcionLibros(i)">
              {{ ex.libro_ids.length ? ex.libro_ids.length + ' libro(s) elegido(s)' : 'Elegir libro(s)...' }}
            </button>
            <span v-if="ex.libro_ids.length" class="gema-faint is-wrap">{{ resumenExcepcionLibros(ex) }}</span>
            <span v-if="ex.libro_ids.length" class="gema-faint">
              Casilla vacia = usa el ritmo general de arriba para ese ciclo.
            </span>
            <div class="gema-spacer"></div>
            <button class="gema-btn is-sm is-icon is-danger" type="button" title="Quitar excepcion" @click="quitarExcepcion(i)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div v-if="ex.libro_ids.length" class="gema-table-wrap gema-cfg-productividad">
            <table class="gema-table">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th v-for="c in ciclos" :key="c" class="is-num" style="width: 100px">{{ c }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in areas" :key="a.clave">
                  <td><span class="gema-chip" :class="a.clave === 'redaccion' ? 'is-accent' : ''">{{ a.etiqueta }}</span></td>
                  <td v-for="c in ciclos" :key="a.clave + c" class="is-num">
                    <input
                      v-if="etapaDe(a.clave, c)"
                      class="gema-input gema-cfg-mini is-num"
                      type="number"
                      step="1"
                      min="0"
                      :placeholder="ppdDe(a.clave, c, modoActivo) !== null ? String(ppdDe(a.clave, c, modoActivo)) : ''"
                      :value="ppdDeExcepcion(ex, a.clave, c, modoActivo)"
                      @change="setPpdExcepcion(ex, a.clave, c, modoActivo, $event.target.value)"
                    />
                    <span v-else class="gema-faint">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <template #pie>
      <button class="gema-btn" type="button" @click="cerrar">Cancelar</button>
      <button class="gema-btn is-primary" type="button" :disabled="!puedeConfirmar || generando" @click="confirmar">
        {{ generando ? 'Configurando...' : 'Configurar el plan' }}
      </button>
    </template>
  </gema-panel>

  <!-- ===================== PANEL: ELEGIR LIBROS DE LA EXCEPCION ===================== -->
  <gema-panel
    :abierto="excepcionEditando !== null"
    titulo="Elegir libro(s) para esta excepcion"
    subtitulo="Marque uno, varios, o toda una materia de una vez"
    tamano="md"
    @cerrar="excepcionEditando = null"
  >
    <div class="gema-cfg-excepcion-libros">
      <div v-for="g in librosSelPorMateria" :key="g.materia" class="gema-cfg-grupo">
        <div class="gema-cfg-grupo-cabecera">
          <label class="gema-row">
            <input
              type="checkbox"
              :checked="grupoCompletoEnSeleccion(g)"
              @change="alternarGrupoEnSeleccion(g, $event.target.checked)"
            />
            <strong>{{ g.materia }}</strong>
            <span class="gema-faint">({{ g.libros.length }})</span>
          </label>
        </div>
        <label v-for="l in g.libros" :key="l.libro_id" class="gema-row gema-cfg-excepcion-libro-opcion">
          <input type="checkbox" :value="l.libro_id" v-model="excepcionLibrosSeleccion" />
          <span>{{ l.nombre }}</span>
        </label>
      </div>
    </div>

    <template #pie>
      <button class="gema-btn" type="button" @click="excepcionEditando = null">Cancelar</button>
      <button class="gema-btn is-primary" type="button" @click="aplicarExcepcionLibros">
        Aplicar ({{ excepcionLibrosSeleccion.length }})
      </button>
    </template>
  </gema-panel>
 </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaPanel from './GemaPanel.vue'

const AREAS = [
  { clave: 'redaccion', etiqueta: 'Redaccion' },
  { clave: 'diseno', etiqueta: 'Diseno' }
]

const MODOS = [
  { clave: 'real', etiqueta: 'Real' },
  { clave: 'motivador', etiqueta: 'Motivador' }
]

export default {
  name: 'GemaConfigurarPlan',

  components: { GemaPanel },

  props: {
    abierto: { type: Boolean, default: false },
    planId: { type: Number, default: null },
    plan: { type: Object, default: null },
    proceso: { type: Object, default: null },
    libros: { type: Array, default: () => [] },
    /** Tareas ya generadas (vista Gantt del padre): se usan para precargar
     * productividad, personas y libros ya cargados cuando se vuelve a
     * configurar un plan, sin tener que volver a elegirlos. */
    tareasActuales: { type: Array, default: () => [] },
    tareasExistentes: { type: Number, default: 0 }
  },

  data () {
    return {
      calendario: this.calendarioVacio(),
      etapasLocal: [],
      cantidadCiclos: 3,
      ajustandoCiclos: false,
      modoActivo: 'real',
      productividad: {},
      librosSel: [],
      overridesLibroCiclos: {},
      excepciones: [],
      excepcionEditando: null,
      excepcionLibrosSeleccion: [],
      ciclosMasivo: 3,
      paraleloManual: false,
      generando: false,
      areas: AREAS,
      MODOS
    }
  },

  computed: {
    ciclos () {
      const vistos = new Set(this.etapasLocal.map((e) => e.ciclo).filter(Boolean))

      return Array.from(vistos).sort((a, b) => {
        const na = parseInt(String(a).replace(/\D/g, ''), 10) || 0
        const nb = parseInt(String(b).replace(/\D/g, ''), 10) || 0
        return na - nb
      })
    },

    librosPorMateria () {
      const grupos = {}

      this.libros.forEach((l) => {
        const materia = l.area || 'Sin materia'
        if (!grupos[materia]) grupos[materia] = []
        grupos[materia].push(l)
      })

      return Object.keys(grupos).sort().map((materia) => ({ materia, libros: grupos[materia] }))
    },

    /** Mismo agrupado de arriba, pero solo con los libros ya marcados — para el
     * selector de "excepciones", que si no, queda una lista plana de hasta 50
     * nombres sin como ubicarse. */
    librosSelPorMateria () {
      const grupos = {}

      this.libros
        .filter((l) => this.librosSel.includes(l.libro_id))
        .forEach((l) => {
          const materia = l.area || 'Sin materia'
          if (!grupos[materia]) grupos[materia] = []
          grupos[materia].push(l)
        })

      return Object.keys(grupos).sort().map((materia) => ({ materia, libros: grupos[materia] }))
    },

    puedeConfirmar () {
      return !!this.calendario.fecha_inicio && this.librosSel.length > 0
    }
  },

  watch: {
    abierto (v) {
      if (v) this.reiniciar()
    },

    librosSel (nuevo) {
      if (!this.paraleloManual) {
        this.calendario.libros_en_paralelo = Math.max(1, nuevo.length)
      }
    }
  },

  methods: {
    calendarioVacio () {
      return {
        fecha_inicio: new Date().toISOString().slice(0, 10),
        meta_fecha_fin: '',
        personas_red: 1,
        personas_dis: 1,
        libros_en_paralelo: 1,
        incluye_fines_semana: false
      }
    },

    num (v) {
      return (Number(v) || 0).toLocaleString('es-EC', { maximumFractionDigits: 2 })
    },

    reiniciar () {
      const p = this.plan || {}

      this.calendario = {
        fecha_inicio: p.fecha_inicio ? String(p.fecha_inicio).slice(0, 10) : new Date().toISOString().slice(0, 10),
        meta_fecha_fin: p.meta_fecha_fin ? String(p.meta_fecha_fin).slice(0, 10) : '',
        personas_red: 1,
        personas_dis: 1,
        libros_en_paralelo: p.libros_en_paralelo || 1,
        incluye_fines_semana: !!p.incluye_fines_semana
      }
      this.paraleloManual = !!(p.libros_en_paralelo && p.libros_en_paralelo > 1)
      this.etapasLocal = this.proceso && this.proceso.etapas ? [...this.proceso.etapas] : []
      this.cantidadCiclos = this.ciclos.length || 3
      this.ciclosMasivo = this.cantidadCiclos
      this.productividad = {}
      this.librosSel = []
      this.overridesLibroCiclos = {}
      this.excepciones = []
      this.excepcionEditando = null
      this.excepcionLibrosSeleccion = []
      this.modoActivo = 'real'

      // Si el plan ya se genero antes, se precarga lo que se uso la ultima vez
      // (libros, productividad y personas), para reconfigurar sin perder lo ya
      // ajustado ni tener que volver a elegir los mismos libros.
      if (this.tareasActuales && this.tareasActuales.length) {
        const idsLibros = new Set()

        this.tareasActuales.forEach((t) => {
          idsLibros.add(t.libro_id)

          if (t.etapa_id && t.paginas_por_dia_usada) {
            const actual = this.productividad[t.etapa_id] || {}
            if (actual.real === undefined) this.productividad[t.etapa_id] = { ...actual, real: t.paginas_por_dia_usada }
          }

          if (t.personas_asignadas) {
            if (t.area === 'redaccion') this.calendario.personas_red = t.personas_asignadas
            else if (t.area === 'diseno') this.calendario.personas_dis = t.personas_asignadas
          }
        })

        this.librosSel = Array.from(idsLibros)
        this.paraleloManual = true
      }
    },

    cerrar () {
      this.$emit('cerrar')
    },

    etapaDe (area, ciclo) {
      return this.etapasLocal.find((e) => e.area_responsable === area && e.ciclo === ciclo) || null
    },

    ppdDe (area, ciclo, modo) {
      const etapa = this.etapaDe(area, ciclo)
      if (!etapa) return null

      const ov = this.productividad[etapa.etapa_id] || {}

      if (ov[modo] !== undefined && ov[modo] !== null) return ov[modo]

      if (modo === 'motivador') return etapa.paginas_por_dia_motivador !== null && etapa.paginas_por_dia_motivador !== undefined
        ? etapa.paginas_por_dia_motivador
        : etapa.paginas_por_dia

      return etapa.paginas_por_dia
    },

    setPpd (area, ciclo, modo, valor) {
      const etapa = this.etapaDe(area, ciclo)
      if (!etapa) return

      const actual = this.productividad[etapa.etapa_id] || {}
      this.productividad = {
        ...this.productividad,
        [etapa.etapa_id]: { ...actual, [modo]: valor === '' ? null : Math.round(Number(valor)) }
      }
    },

    /** Rendimiento combinado del equipo: 1 / suma(1/pag_dia de cada ciclo). */
    finalizArea (area, modo) {
      const inversos = this.ciclos
        .map((c) => Number(this.ppdDe(area, c, modo)) || 0)
        .filter((v) => v > 0)
        .map((v) => 1 / v)

      if (!inversos.length) return '—'

      const total = inversos.reduce((s, v) => s + v, 0)
      return this.num(Math.round(1 / total))
    },

    /** Override de personas + productividad (real y motivador) de TODAS las etapas. */
    overridesEtapaPayload () {
      const salida = {}

      this.etapasLocal.forEach((etapa) => {
        const personas = etapa.area_responsable === 'redaccion' ? this.calendario.personas_red : this.calendario.personas_dis
        const ov = this.productividad[etapa.etapa_id] || {}

        salida[etapa.etapa_id] = {
          paginas_por_dia: ov.real !== undefined && ov.real !== null ? ov.real : etapa.paginas_por_dia,
          paginas_por_dia_motivador: ov.motivador !== undefined && ov.motivador !== null ? ov.motivador : etapa.paginas_por_dia_motivador,
          personas: personas || 1
        }
      })

      return salida
    },

    async cambiarCantidadCiclos () {
      if (!this.planId || this.cantidadCiclos === this.ciclos.length) return

      this.ajustandoCiclos = true

      try {
        const r = await api.post(`planes/${this.planId}/ciclos`, { cantidad: this.cantidadCiclos })
        this.etapasLocal = r.data.etapas
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
      } catch (e) {
        if (e.status === 409) {
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: 'Se perdera el avance',
            text: e.message,
            acceptText: 'Cambiar de todos modos',
            cancelText: 'Cancelar',
            accept: () => this.confirmarCambioCiclos()
          })
        } else {
          this.$vs.notify({ title: 'No se pudo ajustar', text: e.message, color: 'danger' })
        }
      } finally {
        this.ajustandoCiclos = false
      }
    },

    async confirmarCambioCiclos () {
      this.ajustandoCiclos = true

      try {
        const r = await api.post(`planes/${this.planId}/ciclos`, { cantidad: this.cantidadCiclos, confirmar_perdida: true })
        this.etapasLocal = r.data.etapas
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo ajustar', text: e.message, color: 'danger' })
      } finally {
        this.ajustandoCiclos = false
      }
    },

    // ------------------------------------------------------------- libros
    grupoCompleto (g) {
      return g.libros.every((l) => this.librosSel.includes(l.libro_id))
    },

    alternarGrupo (g, marcar) {
      const idsGrupo = g.libros.map((l) => l.libro_id)

      if (marcar) {
        this.librosSel = Array.from(new Set([...this.librosSel, ...idsGrupo]))
      } else {
        this.librosSel = this.librosSel.filter((id) => !idsGrupo.includes(id))
      }
    },

    alternarLibro (id) {
      const i = this.librosSel.indexOf(id)

      if (i === -1) this.librosSel.push(id)
      else this.librosSel.splice(i, 1)
    },

    seleccionarTodos () {
      this.librosSel = this.libros.map((l) => l.libro_id)
    },

    cicloDeLibro (libro) {
      const ov = this.overridesLibroCiclos[libro.libro_id]
      if (ov !== undefined && ov !== null) return ov

      return libro.factor_equivalencia ? Math.round(Number(libro.factor_equivalencia)) : 1
    },

    setCicloLibro (id, valor) {
      this.overridesLibroCiclos = { ...this.overridesLibroCiclos, [id]: valor === '' ? null : Number(valor) }
    },

    aplicarCiclosAMarcados () {
      const nuevo = { ...this.overridesLibroCiclos }
      this.librosSel.forEach((id) => { nuevo[id] = this.ciclosMasivo })
      this.overridesLibroCiclos = nuevo
    },

    // --------------------------------------------------- excepciones por libro
    agregarExcepcion () {
      this.excepciones.push({ libro_ids: [], productividad: {} })
    },

    quitarExcepcion (indice) {
      this.excepciones.splice(indice, 1)
    },

    /** Nombres de los libros de esta excepcion, resumidos si son muchos. */
    resumenExcepcionLibros (excepcion) {
      const nombres = excepcion.libro_ids
        .map((id) => {
          const libro = this.libros.find((l) => l.libro_id === id)
          return libro ? libro.nombre : null
        })
        .filter(Boolean)

      if (nombres.length <= 3) return nombres.join(', ')

      return nombres.slice(0, 2).join(', ') + ' y ' + (nombres.length - 2) + ' mas'
    },

    abrirExcepcionLibros (indice) {
      this.excepcionEditando = indice
      this.excepcionLibrosSeleccion = [...this.excepciones[indice].libro_ids]
    },

    aplicarExcepcionLibros () {
      this.excepciones[this.excepcionEditando].libro_ids = [...this.excepcionLibrosSeleccion]
      this.excepcionEditando = null
    },

    /** Si TODOS los libros de esa materia ya estan marcados en la seleccion temporal del picker. */
    grupoCompletoEnSeleccion (grupo) {
      return grupo.libros.every((l) => this.excepcionLibrosSeleccion.includes(l.libro_id))
    },

    alternarGrupoEnSeleccion (grupo, marcar) {
      const idsGrupo = grupo.libros.map((l) => l.libro_id)

      if (marcar) {
        this.excepcionLibrosSeleccion = Array.from(new Set([...this.excepcionLibrosSeleccion, ...idsGrupo]))
      } else {
        this.excepcionLibrosSeleccion = this.excepcionLibrosSeleccion.filter((id) => !idsGrupo.includes(id))
      }
    },

    /** Numero YA puesto en la excepcion (null = todavia hereda el de arriba, que se ve como placeholder). */
    ppdDeExcepcion (excepcion, area, ciclo, modo) {
      const etapa = this.etapaDe(area, ciclo)
      if (!etapa) return null

      const ov = excepcion.productividad[etapa.etapa_id] || {}
      return ov[modo] !== undefined ? ov[modo] : null
    },

    setPpdExcepcion (excepcion, area, ciclo, modo, valor) {
      const etapa = this.etapaDe(area, ciclo)
      if (!etapa) return

      const actual = excepcion.productividad[etapa.etapa_id] || {}
      this.$set(excepcion.productividad, etapa.etapa_id, {
        ...actual,
        [modo]: valor === '' ? null : Math.round(Number(valor))
      })
    },

    overridesLibroPayload () {
      const salida = {}
      this.librosSel.forEach((id) => {
        const libro = this.libros.find((l) => l.libro_id === id)
        if (libro) salida[id] = { ciclos: this.cicloDeLibro(libro) }
      })

      // Excepciones: solo entran las casillas que de verdad se llenaron (las
      // vacias heredan el ritmo general via overrides_etapa, no hace falta
      // mandarlas). La misma excepcion se aplica a TODOS los libros que haya
      // elegido — uno, varios, o una materia entera.
      this.excepciones.forEach((ex) => {
        const productividad = {}
        Object.keys(ex.productividad).forEach((etapaId) => {
          const ov = ex.productividad[etapaId] || {}
          const entrada = {}
          if (ov.real !== undefined && ov.real !== null) entrada.paginas_por_dia = ov.real
          if (ov.motivador !== undefined && ov.motivador !== null) entrada.paginas_por_dia_motivador = ov.motivador
          if (Object.keys(entrada).length) productividad[etapaId] = entrada
        })

        if (!Object.keys(productividad).length) return

        ex.libro_ids.forEach((id) => {
          if (!salida[id]) return
          salida[id] = { ...salida[id], productividad }
        })
      })

      return salida
    },

    /**
     * Configura el plan de punta a punta: guarda el calendario en el plan y
     * genera el Gantt con la productividad, personas y ciclos de esta pantalla.
     */
    async confirmar () {
      if (!this.puedeConfirmar) return

      this.generando = true
      const librosFinal = [...this.librosSel]
      const overridesLibro = this.overridesLibroPayload()

      try {
        await api.put(`planes/${this.planId}`, {
          nombre: this.plan.nombre,
          fecha_inicio: this.calendario.fecha_inicio,
          meta_fecha_fin: this.calendario.meta_fecha_fin || null,
          libros_en_paralelo: this.calendario.libros_en_paralelo || 1,
          incluye_fines_semana: this.calendario.incluye_fines_semana,
          observaciones: this.plan.observaciones
        })
      } catch (e) {
        this.generando = false
        this.$vs.notify({ title: 'No se pudo configurar', text: e.message, color: 'danger' })
        return
      }

      await this.generar(librosFinal, overridesLibro)
    },

    async generar (librosFinal, overridesLibro, confirmado) {
      this.generando = true

      try {
        const r = await api.post(`planes/${this.planId}/generar`, {
          libros: librosFinal,
          overrides_etapa: this.overridesEtapaPayload(),
          overrides_libro: overridesLibro,
          confirmar_perdida: confirmado || false
        })

        this.$vs.notify({ title: 'Plan configurado', text: r.message, color: 'success', time: 6000 })
        this.$emit('configurado')
      } catch (e) {
        // 409 = hay avance capturado y se pide confirmacion explicita.
        if (e.status === 409) {
          this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: 'Se perdera el avance',
            text: e.message,
            acceptText: 'Regenerar de todos modos',
            cancelText: 'Cancelar',
            accept: () => this.generar(librosFinal, overridesLibro, true)
          })
        } else {
          this.$vs.notify({ title: 'No se genero', text: e.message, color: 'danger' })
        }
      } finally {
        this.generando = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-cfg-panel {
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius-lg);
  background: var(--gema-surface-2);
  padding: var(--gema-u3);
  margin-bottom: var(--gema-u3);
}

.gema-cfg-pista { display: block; font-size: var(--gema-fs-xs); margin-bottom: var(--gema-u2); }

.gema-cfg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gema-u3);
  align-items: end;
}

.gema-cfg-checkbox { grid-column: 1 / -1; margin-top: var(--gema-u1); }

.gema-cfg-ciclos-control {
  align-items: center;
  gap: var(--gema-u2);
  margin-bottom: var(--gema-u2);

  .gema-label { margin: 0; }
}

.gema-cfg-modo { display: block; font-size: 10px; margin-top: 2px; }

.gema-cfg-libros-toolbar { align-items: center; margin-bottom: var(--gema-u2); }

.gema-cfg-libros { max-height: 320px; overflow-y: auto; margin-bottom: var(--gema-u2); }

.gema-cfg-grupo { margin-bottom: var(--gema-u2); }
.gema-cfg-grupo-cabecera { padding: var(--gema-u1) 0; }

.gema-cfg-ciclo-libro { justify-content: flex-end; gap: var(--gema-u1); }

.gema-cfg-productividad { max-height: 260px; overflow-y: auto; }
.gema-cfg-mini { height: 26px; width: 100%; }
.gema-cfg-mini-select { height: 26px; width: 260px; }
.gema-cfg-finaliz { font-weight: 600; }
.gema-cfg-modo-tabs { margin-bottom: var(--gema-u2); }
.gema-cfg-excepciones-modo { align-items: center; gap: var(--gema-u2); margin: var(--gema-u2) 0; }
// flex:1 (no una altura fija) para que ocupe el alto real que el panel le
// deje; min-height:0 es lo que permite que un hijo flex SI se achique y
// haga scroll en vez de forzar al panel a estirarse.
.gema-cfg-excepcion-libros { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.gema-cfg-excepcion-libro-opcion { padding: var(--gema-u) 0 var(--gema-u) var(--gema-u4); cursor: pointer; }

.gema-cfg-excepciones {
  margin-top: var(--gema-u3);
  padding-top: var(--gema-u3);
  border-top: 1px dashed var(--gema-border);
}

.gema-cfg-excepcion {
  margin-top: var(--gema-u2);
  padding: var(--gema-u2);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius-lg);
  background: var(--gema-surface);
}

.gema-cfg-excepcion-cabecera { align-items: center; margin-bottom: var(--gema-u2); }
</style>
