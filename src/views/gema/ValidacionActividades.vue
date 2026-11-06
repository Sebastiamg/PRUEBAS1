<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar colaborador o actividad..." />
      </div>

      <input v-model="desde" class="gema-input gema-val-fecha" type="date" @change="cargar" />
      <span class="gema-faint">a</span>
      <input v-model="hasta" class="gema-input gema-val-fecha" type="date" @change="cargar" />

      <div class="gema-toolbar-sep"></div>

      <label class="gema-row gema-val-check">
        <input type="checkbox" :checked="todoSeleccionado" @change="alternarTodo" />
        <span class="gema-muted">Seleccionar todo</span>
      </label>

      <div class="gema-spacer"></div>

      <span v-if="seleccionadas.length" class="gema-muted gema-val-cuenta">
        {{ seleccionadas.length }} seleccionadas
      </span>
      <button class="gema-btn is-primary" type="button" :disabled="!seleccionadas.length || procesando" @click="lote(true)">
        Validar seleccionadas
      </button>
      <button class="gema-btn is-danger" type="button" :disabled="!seleccionadas.length" @click="abrirRechazoLote">
        Devolver
      </button>
    </div>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="colaborador"
      texto-vacio="No hay actividades pendientes de validar"
    >
      <template #default="{ filas }">
        <tr v-for="a in filas" :key="a.actividad_id" :class="{ 'is-selected': seleccionadas.includes(a.actividad_id) }">
          <td>
            <input type="checkbox" :checked="seleccionadas.includes(a.actividad_id)" @change="alternar(a.actividad_id)" />
          </td>
          <td class="gema-num gema-faint">{{ formatoFecha(a.fecha) }}</td>
          <td class="gema-faint">{{ a.departamento ? a.departamento.tdp_iniciales : '—' }}</td>
          <td>{{ a.usuario ? a.usuario.nombres + ' ' + a.usuario.apellidos : '—' }}</td>
          <td>
            <span class="gema-chip" :style="a.categoria ? { color: a.categoria.color } : null">
              {{ a.categoria ? a.categoria.nombre : '—' }}
            </span>
          </td>
          <td class="is-wrap">
            {{ a.titulo }}
            <span v-if="a.referencia_libro" class="gema-faint gema-val-ref">
              {{ a.referencia_libro }}<template v-if="a.referencia_pagina"> · pag. {{ a.referencia_pagina }}</template>
            </span>
          </td>
          <td class="is-num">{{ formatear(a.cantidad) }}</td>
          <td class="is-num">{{ a.horas === null ? '—' : formatear(a.horas) }}</td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button class="gema-btn is-sm" type="button" @click="validarUna(a)">Validar</button>
              <button class="gema-btn is-sm is-danger" type="button" @click="abrirRechazoUna(a)">Devolver</button>
            </div>
          </td>
        </tr>
      </template>

      <template #pie>
        <span>{{ totalHoras }} horas · {{ totalCantidad }} de cantidad</span>
      </template>
    </gema-tabla>

    <!-- ========================= PANEL DE RECHAZO ========================= -->
    <gema-panel :abierto="panelRechazo" titulo="Devolver actividad" @cerrar="panelRechazo = false">
      <p class="gema-alert is-warn">
        {{ rechazoUna
          ? 'La actividad vuelve al colaborador para que la corrija.'
          : `Se devolveran ${seleccionadas.length} actividad(es) con el mismo motivo.` }}
      </p>

      <div class="gema-field">
        <label class="gema-label">Motivo *</label>
        <textarea v-model.trim="comentario" class="gema-textarea" rows="4" placeholder="Que hay que corregir"></textarea>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelRechazo = false">Cancelar</button>
        <button class="gema-btn is-danger" type="button" :disabled="!comentario || procesando" @click="confirmarRechazo">
          {{ procesando ? 'Enviando...' : 'Devolver' }}
        </button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="actividades_validacion" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

export default {
  name: 'GemaValidacionActividades',

  components: { GemaTabla, GemaPanel, GemaSiguiente },

  data () {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    return {
      cargando: true,
      procesando: false,
      filtro: '',
      desde: inicioMes.toISOString().slice(0, 10),
      hasta: hoy.toISOString().slice(0, 10),
      actividades: [],
      seleccionadas: [],
      panelRechazo: false,
      rechazoUna: null,
      comentario: '',
      columnas: [
        { clave: 'sel', titulo: '', ancho: '32px', ordenable: false },
        { clave: 'fecha', titulo: 'Fecha', ancho: '96px' },
        { clave: 'unidad', titulo: 'Und.', ancho: '58px', valor: (a) => (a.departamento ? a.departamento.tdp_iniciales : '') },
        { clave: 'colaborador', titulo: 'Colaborador', ancho: '180px', valor: (a) => (a.usuario ? `${a.usuario.nombres} ${a.usuario.apellidos}` : '') },
        { clave: 'categoria', titulo: 'Categoria', ancho: '160px', valor: (a) => (a.categoria ? a.categoria.nombre : '') },
        { clave: 'titulo', titulo: 'Actividad' },
        { clave: 'cantidad', titulo: 'Cantidad', numerica: true, ancho: '86px' },
        { clave: 'horas', titulo: 'Horas', numerica: true, ancho: '74px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      if (!texto) return this.actividades

      return this.actividades.filter((a) => {
        const nombre = a.usuario ? `${a.usuario.nombres} ${a.usuario.apellidos}` : ''

        return `${nombre} ${a.titulo}`.toLowerCase().includes(texto)
      })
    },

    todoSeleccionado () {
      return this.visibles.length > 0 && this.seleccionadas.length === this.visibles.length
    },

    totalHoras () {
      return this.formatear(this.visibles.reduce((t, a) => t + (Number(a.horas) || 0), 0))
    },

    totalCantidad () {
      return this.formatear(this.visibles.reduce((t, a) => t + (Number(a.cantidad) || 0), 0))
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    formatear (valor) {
      return (Number(valor) || 0).toLocaleString('es-EC', { maximumFractionDigits: 2 })
    },

    formatoFecha (fecha) {
      return String(fecha || '').slice(0, 10).split('-').reverse().join('/')
    },

    async cargar () {
      this.cargando = true
      this.seleccionadas = []

      try {
        const r = await api.get('actividades/pendientes', { desde: this.desde, hasta: this.hasta })
        this.actividades = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    alternar (id) {
      const i = this.seleccionadas.indexOf(id)

      if (i === -1) {
        this.seleccionadas.push(id)
      } else {
        this.seleccionadas.splice(i, 1)
      }
    },

    alternarTodo () {
      this.seleccionadas = this.todoSeleccionado ? [] : this.visibles.map((a) => a.actividad_id)
    },

    validarUna (actividad) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: 'Validar actividad',
        text: `Se validara "${actividad.titulo}".`,
        acceptText: 'Validar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.post(`actividades/${actividad.actividad_id}/validar`)
            this.$vs.notify({ title: 'Validada', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    },

    abrirRechazoUna (actividad) {
      this.rechazoUna = actividad
      this.comentario = ''
      this.panelRechazo = true
    },

    abrirRechazoLote () {
      this.rechazoUna = null
      this.comentario = ''
      this.panelRechazo = true
    },

    async confirmarRechazo () {
      this.procesando = true

      try {
        const r = this.rechazoUna
          ? await api.post(`actividades/${this.rechazoUna.actividad_id}/rechazar`, { comentario: this.comentario })
          : await api.post('actividades/validar-lote', {
            actividades: this.seleccionadas,
            validado: false,
            comentario: this.comentario
          })

        this.panelRechazo = false
        this.$vs.notify({ title: 'Devuelto', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.procesando = false
      }
    },

    async lote (validado) {
      this.procesando = true

      try {
        const r = await api.post('actividades/validar-lote', {
          actividades: this.seleccionadas,
          validado
        })

        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.procesando = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-val-fecha { width: 132px; }
.gema-val-check { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-val-cuenta { font-size: var(--gema-fs-sm); }
.gema-val-ref { font-size: var(--gema-fs-xs); margin-left: var(--gema-u); }
</style>
