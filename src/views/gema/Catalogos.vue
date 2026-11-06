<template>
  <div>
    <div class="gema-toolbar">
      <!-- Los cuatro catalogos comparten pantalla: se cambia con pestañas -->
      <div class="gema-btn-group">
        <button
          v-for="c in CATALOGOS"
          :key="c.tipo"
          class="gema-btn is-sm"
          :class="{ 'is-active': tipo === c.tipo }"
          type="button"
          @click="cambiar(c.tipo)"
        >
          {{ c.titulo }}
        </button>
      </div>

      <div class="gema-toolbar-sep"></div>

      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar..." />
      </div>

      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivos</span>
      </label>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nuevo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo
      </button>
    </div>

    <p class="gema-alert gema-cat-ayuda">{{ actual.ayuda }}</p>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="orden"
      :texto-vacio="`No hay ${actual.titulo.toLowerCase()} registradas`"
    >
      <template #default="{ filas }">
        <tr v-for="r in filas" :key="r[actual.llave]" :class="{ 'is-inactive': !r.estado }">
          <td class="gema-cat-codigo">{{ r.codigo }}</td>
          <td>{{ r.nombre }}</td>

          <!-- Columna especifica de cada catalogo -->
          <td v-if="tipo === 'frecuencias'">
            <span class="gema-chip">{{ r.tipo_periodo }}</span>
            <span v-if="r.nota" class="gema-faint gema-cat-nota">{{ r.nota }}</span>
          </td>
          <td v-else-if="tipo === 'unidades-medida'">
            <span class="gema-chip">{{ r.tipo }}</span>
            <span class="gema-faint gema-cat-nota">{{ r.simbolo }} · {{ r.decimales }} dec.</span>
          </td>
          <td v-else-if="tipo === 'operadores-target'">
            <span class="gema-num gema-cat-simbolo">{{ r.simbolo }}</span>
          </td>
          <td v-else class="is-wrap gema-faint gema-cat-nota">{{ r.descripcion }}</td>

          <td class="is-num">{{ r.kpis_count }}</td>
          <td class="is-num gema-faint">{{ r.orden }}</td>
          <td>
            <span class="gema-chip" :class="r.estado ? 'is-verde' : 'is-gris'">
              {{ r.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editar(r)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                </svg>
              </button>
              <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminar(r)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <!-- ============================= PANEL ============================= -->
    <gema-panel
      :abierto="panel"
      :titulo="(form[actual.llave] ? 'Editar ' : 'Nueva ') + actual.singular"
      @cerrar="panel = false"
    >
      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Codigo *</label>
          <input
            v-model.trim="form.codigo"
            class="gema-input"
            :class="{ 'is-error': errores.codigo }"
            type="text"
            :disabled="tipo === 'operadores-target' && !!form[actual.llave]"
          />
          <span v-if="errores.codigo" class="gema-error-text">{{ errores.codigo }}</span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="form.orden" class="gema-input" type="number" min="0" />
        </div>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="form.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <!-- ---------------- Frecuencia ---------------- -->
      <template v-if="tipo === 'frecuencias'">
        <div class="gema-grid-2">
          <div class="gema-field">
            <label class="gema-label">Tipo de periodo *</label>
            <select v-model="form.tipo_periodo" class="gema-select">
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal (ISO, lunes a domingo)</option>
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div class="gema-field">
            <label class="gema-label">Meses que abarca</label>
            <input v-model.number="form.meses_periodo" class="gema-input" type="number" min="0" max="12" />
          </div>
        </div>

        <div class="gema-field">
          <label class="gema-label">Nota</label>
          <input v-model.trim="form.nota" class="gema-input" type="text" placeholder="Ej: Fin de: Julio, Oct, Ene, Abr" />
        </div>
      </template>

      <!-- ---------------- Unidad de medida ---------------- -->
      <template v-else-if="tipo === 'unidades-medida'">
        <div class="gema-grid-2">
          <div class="gema-field">
            <label class="gema-label">Tipo *</label>
            <select v-model="form.tipo" class="gema-select">
              <option value="porcentaje">Porcentaje</option>
              <option value="numero">Numero</option>
              <option value="moneda">Dinero</option>
              <option value="puntaje">Puntaje</option>
              <option value="ratio">Razon (a / b)</option>
              <option value="dias">Dias</option>
            </select>
          </div>

          <div class="gema-field">
            <label class="gema-label">Simbolo</label>
            <input v-model.trim="form.simbolo" class="gema-input" type="text" maxlength="20" />
          </div>
        </div>

        <div class="gema-field">
          <label class="gema-label">Decimales</label>
          <input v-model.number="form.decimales" class="gema-input" type="number" min="0" max="6" />
        </div>

        <p class="gema-alert">
          Los indicadores de tipo <strong>porcentaje</strong> se guardan como fraccion
          (0,9) y se muestran como 90%.
        </p>
      </template>

      <!-- ---------------- Operador de target ---------------- -->
      <template v-else-if="tipo === 'operadores-target'">
        <div class="gema-field">
          <label class="gema-label">Simbolo *</label>
          <input v-model.trim="form.simbolo" class="gema-input" type="text" maxlength="12" />
        </div>

        <p class="gema-alert">
          El codigo determina la comparacion y no se puede cambiar en un operador
          existente. <strong>referencia</strong> compara contra el plan capturado
          en el periodo, para targets como "&gt;= Presupuesto".
        </p>
      </template>

      <!-- ---------------- Formula ---------------- -->
      <template v-else>
        <div class="gema-field">
          <label class="gema-label">Tipo de calculo *</label>
          <select v-model="form.tipo" class="gema-select">
            <option value="division">Division (numerador / denominador)</option>
            <option value="valor_directo">Valor directo</option>
            <option value="regla_de_3">Regla de 3 sobre puntaje maximo</option>
            <option value="escala">Escala de cumplimiento</option>
            <option value="producto_componentes">Producto de KPIs componentes</option>
            <option value="promedio_componentes">Promedio de KPIs componentes</option>
            <option value="minimo_componentes">Minimo de KPIs componentes</option>
          </select>
        </div>

        <div class="gema-field">
          <label class="gema-label">Descripcion</label>
          <textarea v-model.trim="form.descripcion" class="gema-textarea" rows="3"></textarea>
        </div>

        <p class="gema-alert is-warn">
          Los tres tipos de componentes son <strong>consolidados</strong>: su valor no
          se captura, se arma con los KPIs hijos que se definan en la pantalla de KPIs.
        </p>
      </template>

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
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'

const CATALOGOS = [
  {
    tipo: 'frecuencias',
    titulo: 'Frecuencias',
    singular: 'frecuencia',
    llave: 'frecuencia_id',
    columna: 'Periodo',
    ayuda: 'Cada cuanto se mide el KPI. El tipo de periodo es lo que usa el sistema para generar los periodos y agrupar los datos.'
  },
  {
    tipo: 'unidades-medida',
    titulo: 'Unidades de medida',
    singular: 'unidad de medida',
    llave: 'unidad_medida_id',
    columna: 'Formato',
    ayuda: 'En que se expresa el indicador: porcentaje, puntaje, unidades, dinero, dias de caja u horas hombre por pagina.'
  },
  {
    tipo: 'operadores-target',
    titulo: 'Operadores de target',
    singular: 'operador',
    llave: 'operador_target_id',
    columna: 'Simbolo',
    ayuda: 'Como se compara el indicador contra su target: mayor o igual, menor o igual, igual, entre dos valores, o contra el presupuesto del periodo.'
  },
  {
    tipo: 'formulas',
    titulo: 'Formulas de calculo',
    singular: 'formula',
    llave: 'formula_id',
    columna: 'Descripcion',
    ayuda: 'Como se obtiene el indicador a partir de lo capturado. El tipo de calculo es lo que ejecuta el motor de KPIs.'
  }
]

export default {
  name: 'GemaCatalogos',

  components: { GemaTabla, GemaPanel },

  data () {
    return {
      CATALOGOS,
      tipo: 'frecuencias',
      cargando: true,
      guardando: false,
      filtro: '',
      verInactivos: false,
      registros: [],
      panel: false,
      form: {},
      errores: {}
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_catalogos', 'crear') },
    puedeEditar () { return sesion.puede('param_catalogos', 'editar') },
    puedeEliminar () { return sesion.puede('param_catalogos', 'eliminar') },

    actual () {
      return CATALOGOS.find((c) => c.tipo === this.tipo)
    },

    columnas () {
      return [
        { clave: 'codigo', titulo: 'Codigo', ancho: '150px' },
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'extra', titulo: this.actual.columna, ordenable: false },
        { clave: 'kpis_count', titulo: 'KPIs', numerica: true, ancho: '64px' },
        { clave: 'orden', titulo: 'Orden', numerica: true, ancho: '64px' },
        { clave: 'estado', titulo: 'Estado', ancho: '86px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    },

    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.registros.filter((r) => {
        if (!this.verInactivos && !r.estado) return false
        if (!texto) return true

        return `${r.codigo} ${r.nombre}`.toLowerCase().includes(texto)
      })
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    cambiar (tipo) {
      this.tipo = tipo
      this.filtro = ''
      this.cargar()
    },

    async cargar () {
      this.cargando = true

      try {
        const r = await api.get(`catalogos/${this.tipo}`)
        this.registros = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    /** Valores por defecto de cada catalogo al crear. */
    vacio () {
      const base = { codigo: '', nombre: '', orden: null, estado: true }

      if (this.tipo === 'frecuencias') {
        return { ...base, tipo_periodo: 'mensual', meses_periodo: 1, nota: '' }
      }

      if (this.tipo === 'unidades-medida') {
        return { ...base, tipo: 'porcentaje', simbolo: '%', decimales: 2 }
      }

      if (this.tipo === 'operadores-target') {
        return { ...base, simbolo: '>=' }
      }

      return { ...base, tipo: 'division', descripcion: '' }
    },

    nuevo () {
      this.form = this.vacio()
      this.errores = {}
      this.panel = true
    },

    editar (registro) {
      this.form = { ...registro, estado: !!registro.estado }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      const id = this.form[this.actual.llave]

      try {
        const r = id
          ? await api.put(`catalogos/${this.tipo}/${id}`, this.form)
          : await api.post(`catalogos/${this.tipo}`, this.form)

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

    eliminar (registro) {
      const id = registro[this.actual.llave]

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Eliminar ${this.actual.singular}`,
        text: `Se eliminara "${registro.nombre}". Si algun KPI la usa, solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`catalogos/${this.tipo}/${id}`)
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
.gema-inactivos { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-cat-ayuda { margin: 0 0 var(--gema-u3); }
.gema-cat-codigo { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: var(--gema-fs-sm); color: var(--gema-text-2); }
.gema-cat-nota { font-size: var(--gema-fs-xs); margin-left: var(--gema-u); }
.gema-cat-simbolo { font-size: var(--gema-fs-md); font-weight: 600; }
</style>
