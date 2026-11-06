<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-spacer"></div>
      <input v-model="desde" class="gema-input gema-act-fecha" type="date" @change="cargar" />
      <span class="gema-faint">a</span>
      <input v-model="hasta" class="gema-input gema-act-fecha" type="date" @change="cargar" />

      <div class="gema-btn-group">
        <button class="gema-btn is-sm" type="button" @click="rango('semana')">Esta semana</button>
        <button class="gema-btn is-sm" type="button" @click="rango('mes')">Este mes</button>
      </div>
    </div>

    <!-- ===================== RESUMEN: solo para ver, nada se registra aqui ===================== -->
    <template v-if="vista === 'resumen'">
      <div class="gema-tiles">
        <div class="gema-tile">
          <div class="gema-tile-label">Actividades</div>
          <div class="gema-tile-value">{{ resumen.total || 0 }}</div>
          <div class="gema-tile-note">del rango seleccionado</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Cantidad producida</div>
          <div class="gema-tile-value">{{ formatear(resumen.cantidad) }}</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Horas hombre</div>
          <div class="gema-tile-value">{{ formatear(resumen.horas) }}</div>
          <div class="gema-tile-note">alimentan los KPIs de productividad</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Validadas</div>
          <div class="gema-tile-value">{{ resumen.validadas || 0 }}</div>
          <div class="gema-tile-note">de {{ resumen.total || 0 }}</div>
        </div>
      </div>
    </template>

    <!-- ===================== REGISTRO: aqui se registra, nada mas ===================== -->
    <template v-else>
      <div class="gema-toolbar gema-act-subtoolbar">
        <select v-model="categoriaFiltro" class="gema-select gema-act-filtro">
          <option :value="null">Todas las categorias</option>
          <option v-for="c in categorias" :key="c.categoria_id" :value="c.categoria_id">{{ c.nombre }}</option>
        </select>

        <select v-model="estadoFiltro" class="gema-select gema-act-filtro">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="validada">Validadas</option>
          <option value="rechazada">Devueltas</option>
        </select>

        <div class="gema-spacer"></div>

        <button class="gema-btn is-primary" type="button" :disabled="!categorias.length" @click="nueva">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
          Registrar actividad
        </button>
      </div>

      <p v-if="!categorias.length && !cargando" class="gema-alert is-warn">
        No hay categorias habilitadas para su unidad. Pida al administrador que las
        configure antes de registrar actividades.
      </p>

      <gema-tabla
        :columnas="columnas"
        :filas="visibles"
        :cargando="cargando"
        orden-inicial="fecha"
        texto-vacio="No hay actividades en este rango"
      >
        <template #default="{ filas }">
          <tr v-for="a in filas" :key="a.actividad_id">
            <td class="gema-num gema-faint">{{ formatoFecha(a.fecha) }}</td>
            <td>
              <span class="gema-chip" :style="a.categoria ? { color: a.categoria.color } : null">
                {{ a.categoria ? a.categoria.nombre : '—' }}
              </span>
            </td>
            <td class="is-wrap">
              {{ a.titulo }}
              <span v-if="a.referencia_libro" class="gema-faint gema-act-ref">
                {{ a.referencia_libro }}<template v-if="a.referencia_pagina"> · pag. {{ a.referencia_pagina }}</template>
              </span>
            </td>
            <td class="is-num">{{ formatear(a.cantidad) }}</td>
            <td class="is-num">{{ a.horas === null ? '—' : formatear(a.horas) }}</td>
            <td>
              <span class="gema-chip" :class="claseEstado(a.estado)">{{ etiquetaEstado(a.estado) }}</span>
            </td>
            <td class="is-actions">
              <div class="gema-row gema-row-actions">
                <button
                  v-if="a.estado !== 'validada'"
                  class="gema-btn is-sm is-icon"
                  type="button"
                  title="Editar"
                  @click="editar(a)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                  </svg>
                </button>
                <button
                  v-if="a.estado !== 'validada'"
                  class="gema-btn is-sm is-icon is-danger"
                  type="button"
                  title="Eliminar"
                  @click="eliminar(a)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </gema-tabla>
    </template>

    <!-- ========================= PANEL ========================= -->
    <gema-panel
      :abierto="panel"
      :titulo="form.actividad_id ? 'Editar actividad' : 'Registrar actividad'"
      @cerrar="panel = false"
    >
      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Fecha *</label>
          <input v-model="form.fecha" class="gema-input" type="date" :max="hoy" />
          <span v-if="errores.fecha" class="gema-error-text">{{ errores.fecha }}</span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Categoria *</label>
          <select v-model.number="form.categoria_id" class="gema-select">
            <option :value="null" disabled>Seleccione...</option>
            <option v-for="c in categorias" :key="c.categoria_id" :value="c.categoria_id">{{ c.nombre }}</option>
          </select>
          <span v-if="errores.categoria_id" class="gema-error-text">{{ errores.categoria_id }}</span>
        </div>
      </div>

      <div class="gema-field">
        <label class="gema-label">Titulo *</label>
        <input v-model.trim="form.titulo" class="gema-input" :class="{ 'is-error': errores.titulo }" type="text" />
        <span v-if="errores.titulo" class="gema-error-text">{{ errores.titulo }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="form.descripcion" class="gema-textarea" rows="3"></textarea>
      </div>

      <!-- Referencia: solo en categorias que la piden (redaccion, diseño) -->
      <template v-if="categoriaActual && categoriaActual.pide_referencia">
        <div v-if="misTareasPlan.length" class="gema-field">
          <label class="gema-label">Vincular a una tarea de mi plan (opcional)</label>
          <select v-model.number="form.plan_tarea_id" class="gema-select" @change="alVincularTarea">
            <option :value="null">Sin vincular — solo texto libre abajo</option>
            <option v-for="t in misTareasPlan" :key="t.plan_tarea_id" :value="t.plan_tarea_id">
              {{ t.libro }} · {{ t.etapa }}
            </option>
          </select>
          <span class="gema-faint gema-act-pista">
            Si la vincula, esta cantidad y horas suman directo al avance de esa tarea
            en el plan de produccion — no hace falta registrarlo dos veces en "Mi avance".
          </span>
        </div>

        <div class="gema-grid-2">
          <div class="gema-field">
            <label class="gema-label">Libro / proyecto</label>
            <input v-model.trim="form.referencia_libro" class="gema-input" type="text" :disabled="!!form.plan_tarea_id" />
          </div>
          <div class="gema-field">
            <label class="gema-label">Pagina(s)</label>
            <input v-model.trim="form.referencia_pagina" class="gema-input" type="text" placeholder="Ej: 12-18" />
          </div>
        </div>
      </template>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Cantidad *</label>
          <input v-model.number="form.cantidad" class="gema-input" type="number" step="any" min="0" />
          <span class="gema-faint gema-act-pista">Paginas, renders, tramites... segun la categoria.</span>
        </div>

        <div v-if="!categoriaActual || categoriaActual.pide_horas" class="gema-field">
          <label class="gema-label">Horas hombre</label>
          <input v-model.number="form.horas" class="gema-input" type="number" step="0.25" min="0" max="24" />
          <span class="gema-faint gema-act-pista">
            Alimenta los KPIs de productividad. Se sugieren 8 (la jornada completa) — ajuste si trabajo menos.
          </span>
        </div>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panel = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'

const ESTADOS = {
  pendiente: { texto: 'Pendiente', clase: '' },
  en_revision: { texto: 'En revision', clase: 'is-accent' },
  validada: { texto: 'Validada', clase: 'is-verde' },
  rechazada: { texto: 'Devuelta', clase: 'is-rojo' }
}

export default {
  name: 'GemaMisActividades',

  components: { GemaTabla, GemaPanel },

  props: {
    /** 'resumen' (solo ver) o 'registro' (registrar actividad) — lo decide MiTrabajo.vue. */
    vista: { type: String, default: 'resumen' }
  },

  data () {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    return {
      cargando: true,
      guardando: false,
      desde: inicioMes.toISOString().slice(0, 10),
      hasta: hoy.toISOString().slice(0, 10),
      hoy: hoy.toISOString().slice(0, 10),
      categoriaFiltro: null,
      estadoFiltro: '',
      actividades: [],
      categorias: [],
      misTareasPlan: [],
      resumen: {},
      panel: false,
      form: this.vacia(),
      errores: {},
      columnas: [
        { clave: 'fecha', titulo: 'Fecha', ancho: '96px' },
        { clave: 'categoria', titulo: 'Categoria', ancho: '180px', valor: (a) => (a.categoria ? a.categoria.nombre : '') },
        { clave: 'titulo', titulo: 'Actividad' },
        { clave: 'cantidad', titulo: 'Cantidad', numerica: true, ancho: '86px' },
        { clave: 'horas', titulo: 'Horas', numerica: true, ancho: '74px' },
        { clave: 'estado', titulo: 'Estado', ancho: '96px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    visibles () {
      return this.actividades.filter((a) => {
        if (this.categoriaFiltro && a.categoria_id !== this.categoriaFiltro) return false
        if (this.estadoFiltro && a.estado !== this.estadoFiltro) return false

        return true
      })
    },

    categoriaActual () {
      return this.categorias.find((c) => c.categoria_id === this.form.categoria_id)
    }
  },

  watch: {
    // Si cambia a una categoria que no pide horas, se limpia — no se manda
    // un dato que ya no aplica (la sugerencia de 8 horas solo se pone una vez,
    // al abrir una actividad nueva, ver vacia()).
    categoriaActual (cat) {
      if (cat && !cat.pide_horas) {
        this.form.horas = null
      }
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    vacia () {
      return {
        actividad_id: null,
        fecha: new Date().toISOString().slice(0, 10),
        categoria_id: null,
        titulo: '',
        descripcion: '',
        referencia_libro: '',
        referencia_pagina: '',
        plan_tarea_id: null,
        cantidad: 1,
        // Sugerencia: la jornada completa (8h); se ajusta si trabajo menos.
        horas: 8
      }
    },

    formatear (valor) {
      const numero = Number(valor) || 0

      return numero.toLocaleString('es-EC', { maximumFractionDigits: 2 })
    },

    formatoFecha (fecha) {
      return String(fecha || '').slice(0, 10).split('-').reverse().join('/')
    },

    etiquetaEstado (estado) { return (ESTADOS[estado] || {}).texto || estado },
    claseEstado (estado) { return (ESTADOS[estado] || {}).clase || '' },

    rango (cual) {
      const hoy = new Date()

      if (cual === 'semana') {
        const dia = (hoy.getDay() + 6) % 7
        const lunes = new Date(hoy)
        lunes.setDate(hoy.getDate() - dia)
        this.desde = lunes.toISOString().slice(0, 10)
      } else {
        this.desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10)
      }

      this.hasta = hoy.toISOString().slice(0, 10)
      this.cargar()
    },

    async cargar () {
      this.cargando = true

      try {
        const [actividades, categorias, misTareas] = await Promise.all([
          api.get('actividades/mias', { desde: this.desde, hasta: this.hasta }),
          api.get('actividades/mis-categorias'),
          api.get('planes/mis-tareas').catch(() => ({ data: [] }))
        ])

        this.actividades = actividades.data
        this.resumen = actividades.resumen || {}
        this.categorias = categorias.data
        this.misTareasPlan = misTareas.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    /** Al elegir una tarea, se sugiere el libro para el texto libre (editable igual). */
    alVincularTarea () {
      const tarea = this.misTareasPlan.find((t) => t.plan_tarea_id === this.form.plan_tarea_id)

      if (tarea) {
        this.form.referencia_libro = tarea.libro
      }
    },

    nueva () {
      this.form = this.vacia()

      if (this.categorias.length === 1) {
        this.form.categoria_id = this.categorias[0].categoria_id
      }

      this.errores = {}
      this.panel = true
    },

    editar (actividad) {
      this.form = {
        actividad_id: actividad.actividad_id,
        fecha: String(actividad.fecha).slice(0, 10),
        categoria_id: actividad.categoria_id,
        titulo: actividad.titulo,
        descripcion: actividad.descripcion || '',
        referencia_libro: actividad.referencia_libro || '',
        referencia_pagina: actividad.referencia_pagina || '',
        plan_tarea_id: actividad.plan_tarea_id || null,
        cantidad: Number(actividad.cantidad),
        horas: actividad.horas === null ? null : Number(actividad.horas)
      }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.actividad_id
          ? await api.put(`actividades/${this.form.actividad_id}`, this.form)
          : await api.post('actividades', this.form)

        this.panel = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        if (e.errores) {
          const errores = {}
          Object.keys(e.errores).forEach((campo) => { errores[campo] = e.errores[campo][0] })
          this.errores = errores
        }
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    eliminar (actividad) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar actividad',
        text: `Se eliminara "${actividad.titulo}".`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`actividades/${actividad.actividad_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-act-fecha { width: 132px; }
.gema-act-filtro { width: 176px; }
.gema-act-subtoolbar { margin-bottom: var(--gema-u2); }
.gema-act-ref { font-size: var(--gema-fs-xs); margin-left: var(--gema-u); }
.gema-act-pista { font-size: var(--gema-fs-xs); line-height: 1.35; }
</style>
