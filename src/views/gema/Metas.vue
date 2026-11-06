<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar meta..." />
      </div>

      <select v-model="pilarFiltro" class="gema-select gema-meta-filtro">
        <option :value="null">Todos los pilares</option>
        <option v-for="p in pilares" :key="p.pilar_id" :value="p.pilar_id">{{ p.nombre }}</option>
      </select>

      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivas</span>
      </label>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nueva">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nueva meta
      </button>
    </div>

    <gema-tabla
      :columnas="columnas"
      :filas="metasVisibles"
      :cargando="cargando"
      orden-inicial="pilar_nombre"
      texto-vacio="No hay metas registradas"
    >
      <template #default="{ filas }">
        <tr v-for="m in filas" :key="m.meta_id" :class="{ 'is-inactive': !m.estado }">
          <td>
            <span class="gema-row">
              <span class="gema-meta-marca" :style="{ background: m.pilar ? m.pilar.color : 'transparent' }"></span>
              <span>{{ m.pilar ? m.pilar.nombre : '—' }}</span>
            </span>
          </td>
          <td class="is-wrap">{{ m.nombre }}</td>
          <td class="is-wrap gema-faint gema-meta-obj">{{ m.objetivo ? m.objetivo.descripcion : '—' }}</td>
          <td class="is-num">{{ m.kpis_count }}</td>
          <td class="is-num gema-faint">{{ m.orden }}</td>
          <td>
            <span class="gema-chip" :class="m.estado ? 'is-verde' : 'is-gris'">
              {{ m.estado ? 'Activa' : 'Inactiva' }}
            </span>
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editar(m)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                </svg>
              </button>
              <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminar(m)">
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
      :titulo="form.meta_id ? 'Editar meta' : 'Nueva meta'"
      @cerrar="panel = false"
    >
      <div class="gema-field">
        <label class="gema-label">Pilar *</label>
        <select v-model.number="form.pilar_id" class="gema-select" @change="form.objetivo_id = null">
          <option :value="null" disabled>Seleccione...</option>
          <option v-for="p in pilares" :key="p.pilar_id" :value="p.pilar_id">{{ p.nombre }}</option>
        </select>
        <span v-if="errores.pilar_id" class="gema-error-text">{{ errores.pilar_id }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Objetivo</label>
        <select v-model.number="form.objetivo_id" class="gema-select" :disabled="!form.pilar_id">
          <option :value="null">Sin objetivo</option>
          <option v-for="o in objetivosDelPilar" :key="o.objetivo_id" :value="o.objetivo_id">
            {{ recortar(o.descripcion) }}
          </option>
        </select>
        <span v-if="errores.objetivo_id" class="gema-error-text">{{ errores.objetivo_id }}</span>
        <span v-else-if="form.pilar_id && !objetivosDelPilar.length" class="gema-faint gema-meta-pista">
          Ese pilar no tiene objetivos activos.
        </span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre de la meta *</label>
        <textarea
          v-model.trim="form.nombre"
          class="gema-textarea"
          :class="{ 'is-error': errores.nombre }"
          rows="3"
          placeholder="Ej: Productividad, maximizada"
        ></textarea>
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="form.descripcion" class="gema-textarea" rows="2"></textarea>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="form.orden" class="gema-input" type="number" min="0" />
        </div>

        <label class="gema-row gema-check-abajo">
          <input v-model="form.estado" type="checkbox" />
          <span>Activa</span>
        </label>
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
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'

export default {
  name: 'GemaMetas',

  components: { GemaTabla, GemaPanel },

  data () {
    return {
      cargando: true,
      guardando: false,
      filtro: '',
      pilarFiltro: null,
      verInactivos: false,
      metas: [],
      pilares: [],
      objetivos: [],
      panel: false,
      form: this.vacia(),
      errores: {},
      columnas: [
        { clave: 'pilar_nombre', titulo: 'Pilar', ancho: '150px', valor: (m) => (m.pilar ? m.pilar.nombre : '') },
        { clave: 'nombre', titulo: 'Meta' },
        { clave: 'objetivo', titulo: 'Objetivo', ancho: '30%', valor: (m) => (m.objetivo ? m.objetivo.descripcion : '') },
        { clave: 'kpis_count', titulo: 'KPIs', numerica: true, ancho: '64px' },
        { clave: 'orden', titulo: 'Orden', numerica: true, ancho: '64px' },
        { clave: 'estado', titulo: 'Estado', ancho: '86px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_metas', 'crear') },
    puedeEditar () { return sesion.puede('param_metas', 'editar') },
    puedeEliminar () { return sesion.puede('param_metas', 'eliminar') },

    metasVisibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.metas.filter((m) => {
        if (!this.verInactivos && !m.estado) return false
        if (this.pilarFiltro && m.pilar_id !== this.pilarFiltro) return false
        if (!texto) return true

        return m.nombre.toLowerCase().includes(texto)
      })
    },

    objetivosDelPilar () {
      return this.objetivos.filter((o) => o.pilar_id === this.form.pilar_id && o.estado)
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    vacia () {
      return { meta_id: null, pilar_id: null, objetivo_id: null, nombre: '', descripcion: '', orden: null, estado: true }
    },

    recortar (texto) {
      const limpio = String(texto || '')

      return limpio.length > 90 ? `${limpio.slice(0, 90)}...` : limpio
    },

    async cargar () {
      this.cargando = true

      try {
        const [metas, pilares, objetivos] = await Promise.all([
          api.get('parametrizacion/metas'),
          api.get('parametrizacion/pilares'),
          api.get('parametrizacion/objetivos')
        ])

        this.metas = metas.data
        this.pilares = pilares.data.filter((p) => p.estado)
        this.objetivos = objetivos.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    nueva () {
      this.form = this.vacia()
      this.form.pilar_id = this.pilarFiltro
      this.errores = {}
      this.panel = true
    },

    editar (meta) {
      this.form = {
        meta_id: meta.meta_id,
        pilar_id: meta.pilar_id,
        objetivo_id: meta.objetivo_id,
        nombre: meta.nombre,
        descripcion: meta.descripcion,
        orden: meta.orden,
        estado: !!meta.estado
      }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.meta_id
          ? await api.put(`parametrizacion/metas/${this.form.meta_id}`, this.form)
          : await api.post('parametrizacion/metas', this.form)

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

    eliminar (meta) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar meta',
        text: `Se eliminara "${meta.nombre}". Si tiene KPIs asociados solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`parametrizacion/metas/${meta.meta_id}`)
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
.gema-meta-filtro { width: 170px; }
.gema-inactivos { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-meta-marca { width: 3px; height: 13px; border-radius: 2px; flex: none; }
.gema-meta-obj { font-size: var(--gema-fs-sm); }
.gema-meta-pista { font-size: var(--gema-fs-xs); }
.gema-check-abajo { align-self: end; height: 30px; }
</style>
