<template>
  <div>
    <div class="gema-toolbar">
      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivos</span>
      </label>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nuevo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Agregar día
      </button>
    </div>

    <p class="gema-alert gema-fer-ayuda">
      Registre aqui cualquier dia que no se trabaja — un feriado oficial, un
      puente, un cierre interno de la editorial — no solo el calendario civico.
      Ninguno de estos dias cuenta como laborable en <strong>ningun</strong> plan
      de produccion, ademas de sabados y domingos — ni siquiera si un plan
      especifico decide contar fines de semana. Al calcular fechas, el
      planificador los salta igual que un fin de semana, y aplica de inmediato
      a cualquier plan que se genere o regenere despues de guardarlo.
    </p>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="fecha"
      texto-vacio="No hay dias no laborables registrados"
    >
      <template #vacio>
        Agregue el primer dia no laborable del calendario.
      </template>

      <template #default="{ filas }">
        <tr v-for="f in filas" :key="f.feriado_id" :class="{ 'is-inactive': !f.estado }">
          <td class="gema-num">{{ fecha(f.fecha) }}</td>
          <td class="gema-faint">{{ diaSemana(f.fecha) }}</td>
          <td class="is-wrap">{{ f.nombre }}</td>
          <td>
            <span class="gema-chip" :class="f.estado ? 'is-verde' : 'is-gris'">
              {{ f.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editar(f)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                </svg>
              </button>
              <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminar(f)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>

      <template #pie>
        <span>{{ visibles.length }} dia(s) registrado(s)</span>
      </template>
    </gema-tabla>

    <!-- ============================= PANEL ============================= -->
    <gema-panel
      :abierto="panel"
      :titulo="form.feriado_id ? 'Editar día no laborable' : 'Agregar día no laborable'"
      @cerrar="panel = false"
    >
      <div class="gema-field">
        <label class="gema-label">Fecha *</label>
        <input v-model="form.fecha" class="gema-input" :class="{ 'is-error': errores.fecha }" type="date" />
        <span v-if="errores.fecha" class="gema-error-text">{{ errores.fecha }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="form.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" placeholder="Ej: Independencia de Quito, o Cierre interno" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <label class="gema-row">
        <input v-model="form.estado" type="checkbox" />
        <span>Activo</span>
      </label>

      <template #pie>
        <button class="gema-btn" type="button" @click="panel = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="param_feriados" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

export default {
  name: 'GemaFeriados',

  components: { GemaTabla, GemaPanel, GemaSiguiente },

  data () {
    return {
      cargando: true,
      guardando: false,
      verInactivos: false,
      feriados: [],
      panel: false,
      form: this.vacio(),
      errores: {},
      columnas: [
        { clave: 'fecha', titulo: 'Fecha', numerica: true, ancho: '110px' },
        { clave: 'dia_semana', titulo: 'Dia', ancho: '110px', ordenable: false },
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'estado', titulo: 'Estado', ancho: '90px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_feriados', 'crear') },
    puedeEditar () { return sesion.puede('param_feriados', 'editar') },
    puedeEliminar () { return sesion.puede('param_feriados', 'eliminar') },

    visibles () {
      return this.verInactivos ? this.feriados : this.feriados.filter((f) => f.estado)
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    vacio () {
      return { feriado_id: null, fecha: '', nombre: '', estado: true }
    },

    fecha (v) {
      if (!v) return '—'
      return String(v).slice(0, 10).split('-').reverse().join('/')
    },

    diaSemana (v) {
      if (!v) return '—'
      return DIAS[new Date(String(v).slice(0, 10) + 'T12:00:00').getDay()]
    },

    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('feriados')
        this.feriados = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    nuevo () {
      this.form = this.vacio()
      this.errores = {}
      this.panel = true
    },

    editar (feriado) {
      this.form = {
        feriado_id: feriado.feriado_id,
        fecha: String(feriado.fecha).slice(0, 10),
        nombre: feriado.nombre,
        estado: !!feriado.estado
      }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.feriado_id
          ? await api.put(`feriados/${this.form.feriado_id}`, this.form)
          : await api.post('feriados', this.form)

        this.panel = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        if (e.errores) {
          const errores = {}
          Object.keys(e.errores).forEach((c) => { errores[c] = e.errores[c][0] })
          this.errores = errores
        }
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    eliminar (feriado) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar dia no laborable',
        text: `Se eliminara "${feriado.nombre}" (${this.fecha(feriado.fecha)}). Los planes que ya se generaron con este dia afuera no se recalculan solos.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`feriados/${feriado.feriado_id}`)
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
.gema-fer-ayuda { margin: 0 0 var(--gema-u3); }
</style>
