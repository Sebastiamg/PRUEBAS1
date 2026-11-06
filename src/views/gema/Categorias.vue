<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar categoria..." />
      </div>

      <select v-model="tdpFiltro" class="gema-select gema-cat-filtro">
        <option :value="null">Todas las unidades</option>
        <option v-for="d in opciones.departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_nombre }}</option>
      </select>

      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivas</span>
      </label>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nueva">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nueva categoria
      </button>
    </div>

    <p class="gema-alert gema-cat-ayuda">
      Las categorias clasifican las actividades diarias de cada unidad. Si se enlazan
      a un KPI, las horas y cantidades registradas alimentan ese indicador.
    </p>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="unidad"
      texto-vacio="No hay categorias registradas"
    >
      <template #default="{ filas }">
        <tr v-for="c in filas" :key="c.categoria_id" :class="{ 'is-inactive': !c.estado }">
          <td class="gema-faint">{{ c.departamento ? c.departamento.tdp_nombre : '—' }}</td>
          <td>
            <span class="gema-row">
              <span class="gema-cat-color" :style="{ background: c.color }"></span>
              <span>{{ c.nombre }}</span>
            </span>
          </td>
          <td class="is-wrap gema-faint gema-cat-desc">{{ c.descripcion || '—' }}</td>
          <td class="gema-faint">{{ c.kpi ? c.kpi.nombre : '—' }}</td>
          <td>
            <span v-if="c.pide_referencia" class="gema-chip">Libro/pag.</span>
            <span v-if="c.pide_horas" class="gema-chip">Horas</span>
          </td>
          <td class="is-num">{{ c.actividades_count }}</td>
          <td>
            <span class="gema-chip" :class="c.estado ? 'is-verde' : 'is-gris'">
              {{ c.estado ? 'Activa' : 'Inactiva' }}
            </span>
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editar(c)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                </svg>
              </button>
              <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminar(c)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <gema-panel
      :abierto="panel"
      :titulo="form.categoria_id ? 'Editar categoria' : 'Nueva categoria'"
      @cerrar="panel = false"
    >
      <div class="gema-field">
        <label class="gema-label">Unidad *</label>
        <select v-model.number="form.tdp_id" class="gema-select">
          <option :value="null" disabled>Seleccione...</option>
          <option v-for="d in opciones.departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_nombre }}</option>
        </select>
        <span v-if="errores.tdp_id" class="gema-error-text">{{ errores.tdp_id }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="form.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="form.descripcion" class="gema-textarea" rows="2"></textarea>
      </div>

      <div class="gema-field">
        <label class="gema-label">KPI que alimenta</label>
        <select v-model.number="form.kpi_id" class="gema-select">
          <option :value="null">Ninguno</option>
          <option v-for="k in kpisDeLaUnidad" :key="k.kpi_id" :value="k.kpi_id">
            [{{ k.nivel }}] {{ k.nombre }}
          </option>
        </select>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Color</label>
          <div class="gema-row">
            <input v-model="form.color" class="gema-color" type="color" />
            <input v-model.trim="form.color" class="gema-input" type="text" maxlength="7" />
          </div>
        </div>

        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="form.orden" class="gema-input" type="number" min="0" />
        </div>
      </div>

      <label class="gema-row">
        <input v-model="form.pide_referencia" type="checkbox" />
        <span>Pedir libro y pagina al registrar</span>
      </label>
      <span class="gema-faint gema-cat-pista">
        Cuando el colaborador registre una actividad de esta categoria, el formulario
        le pedira ademas a que libro y que pagina(s) corresponde — para categorias
        de produccion (redactar, diseñar), donde importa a que libro se le dedico el
        tiempo.
      </span>

      <label class="gema-row">
        <input v-model="form.pide_horas" type="checkbox" />
        <span>Pedir horas hombre</span>
      </label>
      <span class="gema-faint gema-cat-pista">
        El formulario le pedira cuantas horas dedico. Esas horas alimentan los KPIs
        de productividad de la unidad; desactivelo solo si esta categoria no debe
        contar como tiempo productivo medible.
      </span>

      <label class="gema-row">
        <input v-model="form.estado" type="checkbox" />
        <span>Activa</span>
      </label>
      <span class="gema-faint gema-cat-pista">
        Inactiva deja de aparecer para registrar actividades nuevas, pero conserva
        el historico ya registrado con ella.
      </span>

      <template #pie>
        <button class="gema-btn" type="button" @click="panel = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="param_categorias" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

export default {
  name: 'GemaCategorias',

  components: { GemaTabla, GemaPanel, GemaSiguiente },

  data () {
    return {
      cargando: true,
      guardando: false,
      filtro: '',
      tdpFiltro: null,
      verInactivos: false,
      categorias: [],
      opciones: { departamentos: [], kpis: [] },
      panel: false,
      form: this.vacia(),
      errores: {},
      columnas: [
        { clave: 'unidad', titulo: 'Unidad', ancho: '160px', valor: (c) => (c.departamento ? c.departamento.tdp_nombre : '') },
        { clave: 'nombre', titulo: 'Categoria', ancho: '200px' },
        { clave: 'descripcion', titulo: 'Descripcion' },
        { clave: 'kpi', titulo: 'KPI enlazado', ancho: '210px', valor: (c) => (c.kpi ? c.kpi.nombre : '') },
        { clave: 'pide', titulo: 'Pide', ancho: '130px', ordenable: false },
        { clave: 'actividades_count', titulo: 'Regs.', numerica: true, ancho: '70px' },
        { clave: 'estado', titulo: 'Estado', ancho: '86px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_categorias', 'crear') },
    puedeEditar () { return sesion.puede('param_categorias', 'editar') },
    puedeEliminar () { return sesion.puede('param_categorias', 'eliminar') },

    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.categorias.filter((c) => {
        if (!this.verInactivos && !c.estado) return false
        if (this.tdpFiltro && c.tdp_id !== this.tdpFiltro) return false
        if (!texto) return true

        return c.nombre.toLowerCase().includes(texto)
      })
    },

    /** Solo KPIs de la misma unidad o de gerencia: enlazar otros no tiene sentido. */
    kpisDeLaUnidad () {
      return this.opciones.kpis.filter((k) => k.tdp_id === this.form.tdp_id || k.tdp_id === null)
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    vacia () {
      return {
        categoria_id: null,
        tdp_id: null,
        nombre: '',
        descripcion: '',
        color: '#4b5563',
        kpi_id: null,
        pide_referencia: false,
        pide_horas: true,
        orden: null,
        estado: true
      }
    },

    async cargar () {
      this.cargando = true

      try {
        const [categorias, opciones] = await Promise.all([
          api.get('categorias'),
          api.get('actividades/opciones')
        ])

        this.categorias = categorias.data
        this.opciones = opciones.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    nueva () {
      this.form = this.vacia()
      // Si el jefe solo administra una unidad, el desplegable de opciones ya
      // viene con esa unica opcion: se preselecciona para no dejarla en blanco.
      this.form.tdp_id = this.opciones.departamentos.length === 1
        ? this.opciones.departamentos[0].tdp_id
        : this.tdpFiltro
      this.errores = {}
      this.panel = true
    },

    editar (categoria) {
      this.form = {
        categoria_id: categoria.categoria_id,
        tdp_id: categoria.tdp_id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        color: categoria.color,
        kpi_id: categoria.kpi_id,
        pide_referencia: !!categoria.pide_referencia,
        pide_horas: !!categoria.pide_horas,
        orden: categoria.orden,
        estado: !!categoria.estado
      }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.categoria_id
          ? await api.put(`categorias/${this.form.categoria_id}`, this.form)
          : await api.post('categorias', this.form)

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

    eliminar (categoria) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar categoria',
        text: `Se eliminara "${categoria.nombre}". Si tiene actividades registradas solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`categorias/${categoria.categoria_id}`)
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
.gema-cat-filtro { width: 176px; }
.gema-inactivos { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-cat-ayuda { margin: 0 0 var(--gema-u3); }
.gema-cat-desc { font-size: var(--gema-fs-sm); }
.gema-cat-pista { display: block; margin: -4px 0 var(--gema-u2) 22px; font-size: var(--gema-fs-xs); line-height: 1.4; }
.gema-cat-color { width: 10px; height: 10px; border-radius: 2px; flex: none; }

.gema-color {
  width: 30px;
  height: 30px;
  padding: 2px;
  background: var(--gema-surface);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
  cursor: pointer;
  flex: none;
}
</style>
