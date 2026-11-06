<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-btn-group">
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'procesos' }" type="button" @click="vista = 'procesos'">
          Procesos
        </button>
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'motivos' }" type="button" @click="cambiarAMotivos">
          Motivos de desvio
        </button>
      </div>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear && vista === 'procesos'" class="gema-btn is-primary" type="button" @click="nuevoProceso">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo proceso
      </button>
      <button v-if="puedeCrear && vista === 'motivos'" class="gema-btn is-primary" type="button" @click="nuevoMotivo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo motivo
      </button>
    </div>

    <!-- ===================== PROCESOS ===================== -->
    <template v-if="vista === 'procesos'">
      <p class="gema-alert gema-pro-ayuda">
        Un proceso define por que etapas pasa cada unidad de un libro. La duracion de
        cada etapa sale de su productividad: <strong>dias = paginas de la unidad /
        paginas por dia</strong>. El desfase es cuanto despues del inicio de la etapa
        anterior arranca ella; con desfase menor a la duracion previa, las etapas se
        traslapan, como en el diagrama del Excel.
      </p>

      <div v-if="cargando" class="gema-card gema-empty">Cargando...</div>

      <section v-for="p in procesos" :key="p.proceso_id" class="gema-card gema-pro-card" :class="{ 'is-off': !p.estado }">
        <header class="gema-card-head">
          <div class="gema-row">
            <span class="gema-h2">{{ p.nombre }}</span>
            <span v-if="p.es_predeterminado" class="gema-chip is-accent">predeterminado</span>
            <span v-if="!p.estado" class="gema-chip is-gris">inactivo</span>
            <span class="gema-faint gema-pro-meta">
              {{ p.etapas.length }} etapas · {{ p.dias_referencia }} dias para una unidad de {{ p.paginas_referencia }} pag ·
              {{ p.planes_count }} plan(es)
            </span>
          </div>

          <div class="gema-row">
            <button v-if="puedeEditar" class="gema-btn is-sm" type="button" @click="abrirEtapas(p)">Editar etapas</button>
            <button v-if="puedeCrear" class="gema-btn is-sm" type="button" @click="abrirDuplicar(p)">Duplicar</button>
            <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editarProceso(p)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4L20 8l-4-4L4 16v4z" /></svg>
            </button>
            <button v-if="puedeEliminar && !p.es_predeterminado" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminarProceso(p)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
            </button>
          </div>
        </header>

        <p v-if="p.descripcion" class="gema-pro-desc">{{ p.descripcion }}</p>

        <div class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th style="width: 44px">#</th>
                <th style="width: 70px">Codigo</th>
                <th>Etapa</th>
                <th style="width: 110px">Area</th>
                <th style="width: 90px">Unidad</th>
                <th style="width: 62px">Ciclo</th>
                <th class="is-num" style="width: 100px">Pag./dia (real)</th>
                <th class="is-num" style="width: 100px">Pag./dia (motivador)</th>
                <th class="is-num" style="width: 76px">Personas</th>
                <th class="is-num" style="width: 84px">Dias fijos</th>
                <th class="is-num" style="width: 84px">Desfase</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in p.etapas" :key="e.etapa_id">
                <td class="gema-faint">{{ e.orden }}</td>
                <td><span class="gema-chip" :class="e.area_responsable === 'redaccion' ? 'is-accent' : ''">{{ e.codigo }}</span></td>
                <td>{{ e.nombre }}</td>
                <td class="gema-faint">{{ e.area_responsable }}</td>
                <td class="gema-faint">{{ e.departamento ? e.departamento.tdp_iniciales : '—' }}</td>
                <td class="gema-faint">{{ e.ciclo }}</td>
                <td class="is-num">{{ e.paginas_por_dia === null ? '—' : num(e.paginas_por_dia, 0) }}</td>
                <td class="is-num gema-faint">{{ e.paginas_por_dia_motivador === null || e.paginas_por_dia_motivador === undefined ? 'igual al real' : num(e.paginas_por_dia_motivador, 0) }}</td>
                <td class="is-num gema-faint">{{ e.personas || 1 }}</td>
                <td class="is-num gema-faint">{{ e.dias_fijos === null ? '—' : num(e.dias_fijos) }}</td>
                <td class="is-num gema-faint">{{ num(e.dias_desfase) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <!-- ===================== MOTIVOS ===================== -->
    <template v-else>
      <p class="gema-alert gema-pro-ayuda">
        Son las razones con las que un jefe justifica un retraso. Las marcadas como
        <strong>imputables</strong> significan que el desvio si cuenta contra el colaborador.
      </p>

      <gema-tabla
        :columnas="columnasMotivos"
        :filas="motivos"
        :cargando="cargando"
        orden-inicial="orden"
        texto-vacio="No hay motivos registrados"
      >
        <template #default="{ filas }">
          <tr v-for="m in filas" :key="m.motivo_id" :class="{ 'is-inactive': !m.estado }">
            <td class="gema-pro-codigo">{{ m.codigo }}</td>
            <td>{{ m.nombre }}</td>
            <td class="is-wrap gema-faint">{{ m.descripcion || '—' }}</td>
            <td>
              <span class="gema-chip" :class="m.imputable ? 'is-rojo' : 'is-verde'">
                {{ m.imputable ? 'Si cuenta' : 'No cuenta' }}
              </span>
            </td>
            <td class="is-num gema-faint">{{ m.orden }}</td>
            <td>
              <span class="gema-chip" :class="m.estado ? 'is-verde' : 'is-gris'">{{ m.estado ? 'Activo' : 'Inactivo' }}</span>
            </td>
            <td class="is-actions">
              <div class="gema-row gema-row-actions">
                <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editarMotivo(m)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4L20 8l-4-4L4 16v4z" /></svg>
                </button>
                <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminarMotivo(m)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </gema-tabla>
    </template>

    <!-- ===================== PANEL: PROCESO ===================== -->
    <gema-panel
      :abierto="panelProceso"
      :titulo="formProceso.proceso_id ? 'Editar proceso' : 'Nuevo proceso'"
      @cerrar="panelProceso = false"
    >
      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="formProceso.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="formProceso.descripcion" class="gema-textarea" rows="3"></textarea>
      </div>

      <label class="gema-row">
        <input v-model="formProceso.estado" type="checkbox" />
        <span>Activo</span>
      </label>

      <p v-if="!formProceso.proceso_id" class="gema-alert">
        Despues de crearlo, use "Editar etapas" para definir el flujo.
      </p>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelProceso = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarProceso">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: ETAPAS ===================== -->
    <gema-panel
      :abierto="panelEtapas"
      titulo="Etapas del proceso"
      :subtitulo="procesoSel ? procesoSel.nombre : ''"
      modo="modal"
      tamano="xl"
      @cerrar="panelEtapas = false"
    >
      <p class="gema-alert">
        El orden de la lista es el orden del flujo. Cada etapa necesita
        <strong>paginas por dia</strong> o <strong>dias fijos</strong> para poder
        calcular su duracion.
      </p>

      <p v-if="procesoSel && procesoSel.planes_count" class="gema-alert is-warn">
        Este proceso ya se uso en {{ procesoSel.planes_count }} plan(es). Si tiene
        tareas planificadas no se podra cambiar: duplique el proceso en su lugar.
      </p>

      <div v-if="etapas.length" class="gema-table-wrap">
        <table class="gema-table">
          <thead>
            <tr>
              <th style="width: 34px"></th>
              <th style="width: 86px">Codigo</th>
              <th style="min-width: 200px">Nombre</th>
              <th style="width: 132px">Area</th>
              <th style="width: 108px">Unidad</th>
              <th style="width: 84px">Ciclo</th>
              <th class="is-num" style="width: 100px">Pag./dia real</th>
              <th class="is-num" style="width: 100px">Pag./dia motivador</th>
              <th class="is-num" style="width: 84px">Personas</th>
              <th class="is-num" style="width: 96px">Dias fijos</th>
              <th class="is-num" style="width: 96px">Desfase</th>
              <th class="is-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, i) in etapas" :key="i">
              <td>
                <div class="gema-pro-orden">
                  <button class="gema-pro-flecha" type="button" :disabled="i === 0" title="Subir" @click="mover(i, -1)">▲</button>
                  <button class="gema-pro-flecha" type="button" :disabled="i === etapas.length - 1" title="Bajar" @click="mover(i, 1)">▼</button>
                </div>
              </td>
              <td><input v-model.trim="e.codigo" class="gema-input gema-pro-mini" type="text" maxlength="20" /></td>
              <td><input v-model.trim="e.nombre" class="gema-input gema-pro-mini gema-pro-nombre" type="text" /></td>
              <td>
                <select v-model="e.area_responsable" class="gema-select gema-pro-mini">
                  <option v-for="a in opciones.areas_responsables" :key="a.valor" :value="a.valor">{{ a.nombre }}</option>
                </select>
              </td>
              <td>
                <select v-model.number="e.tdp_id" class="gema-select gema-pro-mini">
                  <option :value="null">—</option>
                  <option v-for="d in opciones.departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_iniciales }}</option>
                </select>
              </td>
              <td>
                <input
                  v-model.trim="e.ciclo"
                  class="gema-input gema-pro-mini"
                  type="text"
                  maxlength="10"
                  list="gema-pro-ciclos"
                  placeholder="C1"
                />
              </td>
              <td class="is-num"><input v-model.number="e.paginas_por_dia" class="gema-input gema-pro-mini is-num" type="number" step="1" min="0" /></td>
              <td class="is-num">
                <input
                  v-model.number="e.paginas_por_dia_motivador"
                  class="gema-input gema-pro-mini is-num"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="= real"
                />
              </td>
              <td class="is-num"><input v-model.number="e.personas" class="gema-input gema-pro-mini is-num" type="number" step="1" min="1" /></td>
              <td class="is-num"><input v-model.number="e.dias_fijos" class="gema-input gema-pro-mini is-num" type="number" step="0.5" min="0" /></td>
              <td class="is-num"><input v-model.number="e.dias_desfase" class="gema-input gema-pro-mini is-num" type="number" step="0.5" min="0" /></td>
              <td class="is-actions">
                <button class="gema-btn is-sm is-icon is-danger" type="button" @click="etapas.splice(i, 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="gema-empty">Sin etapas el proceso no se puede usar para planificar.</div>

      <datalist id="gema-pro-ciclos">
        <option v-for="c in opciones.ciclos" :key="c" :value="c" />
      </datalist>

      <div class="gema-row">
        <button class="gema-btn is-sm" type="button" @click="agregarEtapa">Agregar etapa</button>
        <div class="gema-spacer"></div>
        <span class="gema-faint">
          Una unidad de 45,67 pag tardaria {{ diasSimulados }} dias con este flujo
        </span>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelEtapas = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="!etapas.length || guardando" @click="guardarEtapas">
          {{ guardando ? 'Guardando...' : 'Guardar etapas' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: DUPLICAR ===================== -->
    <gema-panel :abierto="panelDuplicar" titulo="Duplicar proceso" @cerrar="panelDuplicar = false">
      <p class="gema-alert">
        Se copian todas las etapas a un proceso nuevo. Sirve para variar el flujo sin
        tocar el original ni los planes que lo usan.
      </p>

      <div class="gema-field">
        <label class="gema-label">Nombre del nuevo proceso *</label>
        <input v-model.trim="nombreDuplicado" class="gema-input" type="text" />
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelDuplicar = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="!nombreDuplicado || guardando" @click="duplicar">
          {{ guardando ? 'Duplicando...' : 'Duplicar' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: MOTIVO ===================== -->
    <gema-panel
      :abierto="panelMotivo"
      :titulo="formMotivo.motivo_id ? 'Editar motivo' : 'Nuevo motivo'"
      @cerrar="panelMotivo = false"
    >
      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Codigo *</label>
          <input v-model.trim="formMotivo.codigo" class="gema-input" :class="{ 'is-error': errores.codigo }" type="text" />
          <span v-if="errores.codigo" class="gema-error-text">{{ errores.codigo }}</span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="formMotivo.orden" class="gema-input" type="number" min="0" />
        </div>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="formMotivo.nombre" class="gema-input" type="text" />
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="formMotivo.descripcion" class="gema-textarea" rows="2"></textarea>
      </div>

      <label class="gema-row">
        <input v-model="formMotivo.imputable" type="checkbox" />
        <span>El desvio si cuenta contra el colaborador</span>
      </label>

      <label class="gema-row">
        <input v-model="formMotivo.estado" type="checkbox" />
        <span>Activo</span>
      </label>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelMotivo = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarMotivo">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="param_procesos" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

export default {
  name: 'GemaProcesos',

  components: { GemaTabla, GemaPanel, GemaSiguiente },

  data () {
    return {
      vista: 'procesos',
      cargando: true,
      guardando: false,
      procesos: [],
      motivos: [],
      opciones: { departamentos: [], areas_responsables: [], ciclos: [] },
      panelProceso: false,
      panelEtapas: false,
      panelDuplicar: false,
      panelMotivo: false,
      procesoSel: null,
      etapas: [],
      nombreDuplicado: '',
      formProceso: { proceso_id: null, nombre: '', descripcion: '', estado: true },
      formMotivo: this.motivoVacio(),
      errores: {},
      columnasMotivos: [
        { clave: 'codigo', titulo: 'Codigo', ancho: '160px' },
        { clave: 'nombre', titulo: 'Motivo', ancho: '260px' },
        { clave: 'descripcion', titulo: 'Descripcion' },
        { clave: 'imputable', titulo: 'Cuenta', ancho: '110px' },
        { clave: 'orden', titulo: 'Orden', numerica: true, ancho: '64px' },
        { clave: 'estado', titulo: 'Estado', ancho: '86px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_procesos', 'crear') },
    puedeEditar () { return sesion.puede('param_procesos', 'editar') },
    puedeEliminar () { return sesion.puede('param_procesos', 'eliminar') },

    /** Simulacion en vivo: cuanto tardaria una unidad tipica con las etapas del panel. */
    diasSimulados () {
      const paginas = 45.67
      let total = 0

      this.etapas.forEach((e) => {
        if (e.dias_fijos > 0) {
          total += Number(e.dias_fijos)
        } else if (e.paginas_por_dia > 0) {
          total += Math.max(0.5, paginas / Number(e.paginas_por_dia))
        }
      })

      return Math.round(total * 100) / 100
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    motivoVacio () {
      return { motivo_id: null, codigo: '', nombre: '', descripcion: '', imputable: false, orden: null, estado: true }
    },

    num (v, dec = 2) {
      return (Number(v) || 0).toLocaleString('es-EC', { maximumFractionDigits: dec })
    },

    async cargar () {
      this.cargando = true

      try {
        const [procesos, opciones] = await Promise.all([
          api.get('procesos'),
          api.get('procesos/opciones')
        ])

        this.procesos = procesos.data
        this.opciones = opciones.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    async cambiarAMotivos () {
      this.vista = 'motivos'
      this.cargando = true

      try {
        const r = await api.get('procesos/motivos')
        this.motivos = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    // --------------------------------------------------------------- proceso
    nuevoProceso () {
      this.formProceso = { proceso_id: null, nombre: '', descripcion: '', estado: true }
      this.errores = {}
      this.panelProceso = true
    },

    editarProceso (p) {
      this.formProceso = {
        proceso_id: p.proceso_id,
        nombre: p.nombre,
        descripcion: p.descripcion || '',
        estado: !!p.estado
      }
      this.errores = {}
      this.panelProceso = true
    },

    async guardarProceso () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.formProceso.proceso_id
          ? await api.put(`procesos/${this.formProceso.proceso_id}`, this.formProceso)
          : await api.post('procesos', this.formProceso)

        this.panelProceso = false
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

    eliminarProceso (p) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar proceso',
        text: `Se eliminara "${p.nombre}". Si algun plan lo usa solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`procesos/${p.proceso_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    },

    // ---------------------------------------------------------------- etapas
    abrirEtapas (p) {
      this.procesoSel = p
      this.etapas = p.etapas.map((e) => ({
        codigo: e.codigo,
        nombre: e.nombre,
        area_responsable: e.area_responsable,
        tdp_id: e.tdp_id,
        ciclo: e.ciclo,
        paginas_por_dia: e.paginas_por_dia === null ? null : Number(e.paginas_por_dia),
        paginas_por_dia_motivador: e.paginas_por_dia_motivador === null || e.paginas_por_dia_motivador === undefined ? null : Number(e.paginas_por_dia_motivador),
        personas: e.personas ? Number(e.personas) : 1,
        dias_fijos: e.dias_fijos === null ? null : Number(e.dias_fijos),
        dias_desfase: Number(e.dias_desfase)
      }))
      this.panelEtapas = true
    },

    agregarEtapa () {
      const n = this.etapas.length + 1

      this.etapas.push({
        codigo: 'E' + n,
        nombre: 'Etapa ' + n,
        area_responsable: 'redaccion',
        tdp_id: null,
        ciclo: 'C1',
        paginas_por_dia: 10,
        paginas_por_dia_motivador: null,
        personas: 1,
        dias_fijos: null,
        dias_desfase: 0
      })
    },

    mover (i, delta) {
      const destino = i + delta

      if (destino < 0 || destino >= this.etapas.length) return

      const copia = this.etapas.slice()
      const [fila] = copia.splice(i, 1)
      copia.splice(destino, 0, fila)
      this.etapas = copia
    },

    async guardarEtapas () {
      this.guardando = true

      try {
        const r = await api.put(`procesos/${this.procesoSel.proceso_id}/etapas`, { etapas: this.etapas })
        this.panelEtapas = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger', time: 8000 })
      } finally {
        this.guardando = false
      }
    },

    abrirDuplicar (p) {
      this.procesoSel = p
      this.nombreDuplicado = `${p.nombre} (copia)`
      this.panelDuplicar = true
    },

    async duplicar () {
      this.guardando = true

      try {
        const r = await api.post(`procesos/${this.procesoSel.proceso_id}/duplicar`, { nombre: this.nombreDuplicado })
        this.panelDuplicar = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo duplicar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    // ---------------------------------------------------------------- motivo
    nuevoMotivo () {
      this.formMotivo = this.motivoVacio()
      this.errores = {}
      this.panelMotivo = true
    },

    editarMotivo (m) {
      this.formMotivo = {
        motivo_id: m.motivo_id,
        codigo: m.codigo,
        nombre: m.nombre,
        descripcion: m.descripcion || '',
        imputable: !!m.imputable,
        orden: m.orden,
        estado: !!m.estado
      }
      this.errores = {}
      this.panelMotivo = true
    },

    async guardarMotivo () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.formMotivo.motivo_id
          ? await api.put(`procesos/motivos/${this.formMotivo.motivo_id}`, this.formMotivo)
          : await api.post('procesos/motivos', this.formMotivo)

        this.panelMotivo = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cambiarAMotivos()
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

    eliminarMotivo (m) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar motivo',
        text: `Se eliminara "${m.nombre}". Si se uso en alguna justificacion solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`procesos/motivos/${m.motivo_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cambiarAMotivos()
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
.gema-pro-ayuda { margin: 0 0 var(--gema-u3); }
.gema-pro-card { margin-bottom: var(--gema-u3); }
.gema-card.is-off { opacity: 0.65; }
.gema-pro-meta { font-size: var(--gema-fs-xs); }
.gema-pro-codigo { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: var(--gema-fs-sm); color: var(--gema-text-2); }
.gema-pro-mini { height: 26px; }
.gema-pro-mini.is-num { text-align: right; }
.gema-pro-nombre { min-width: 180px; }

.gema-pro-desc {
  margin: 0;
  padding: var(--gema-u2) var(--gema-u3);
  font-size: var(--gema-fs-sm);
  line-height: 1.45;
  color: var(--gema-text-2);
  border-bottom: 1px solid var(--gema-border);
}

.gema-pro-orden { display: flex; flex-direction: column; gap: 1px; }

.gema-pro-flecha {
  height: 11px;
  line-height: 11px;
  padding: 0 3px;
  font-size: 8px;
  color: var(--gema-text-3);
  background: none;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) { color: var(--gema-accent-text); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}
</style>
