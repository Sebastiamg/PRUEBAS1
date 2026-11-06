<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-btn-group">
        <button class="gema-btn is-sm" :class="{ 'is-active': nivel === '' }" type="button" @click="cambiarNivel('')">Todos</button>
        <button class="gema-btn is-sm" :class="{ 'is-active': nivel === 'N3' }" type="button" @click="cambiarNivel('N3')">N3</button>
        <button class="gema-btn is-sm" :class="{ 'is-active': nivel === 'N2' }" type="button" @click="cambiarNivel('N2')">N2</button>
      </div>

      <div class="gema-toolbar-sep"></div>

      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar KPI..." />
      </div>

      <div class="gema-btn-group">
        <button
          v-for="e in FILTROS_ESTADO"
          :key="e.valor"
          class="gema-btn is-sm"
          :class="{ 'is-active': estadoFiltro === e.valor }"
          type="button"
          @click="estadoFiltro = e.valor"
        >
          {{ e.texto }}
          <span v-if="conteo(e.valor)" class="gema-cap-conteo">{{ conteo(e.valor) }}</span>
        </button>
      </div>

      <div class="gema-spacer"></div>
      <button class="gema-btn is-sm" type="button" @click="cargar">Actualizar</button>
    </div>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      texto-vacio="No hay KPIs pendientes con esos filtros"
    >
      <template #default="{ filas }">
        <tr
          v-for="fila in filas"
          :key="fila.kpi.kpi_id"
          :class="{ 'is-selected': seleccion && seleccion.kpi.kpi_id === fila.kpi.kpi_id }"
          @click="abrir(fila)"
        >
          <td><span class="gema-chip" :class="fila.kpi.nivel === 'N3' ? 'is-accent' : ''">{{ fila.kpi.nivel }}</span></td>
          <td class="gema-faint">{{ fila.kpi.unidad }}</td>
          <td class="is-wrap">
            {{ fila.kpi.nombre }}
            <span v-if="fila.es_consolidado" class="gema-faint" title="Consolidado: no se captura">Σ</span>
          </td>
          <td class="gema-faint">{{ fila.kpi.frecuencia }}</td>
          <td class="gema-faint gema-num">{{ fila.periodo.etiqueta }}</td>
          <td class="is-num">
            <gema-indicador
              :valor="fila.valor ? fila.valor.valor_indicador : null"
              :unidad="fila.kpi.unidad_medida"
              :semaforo="fila.valor ? fila.valor.semaforo : 'gris'"
            />
          </td>
          <td class="gema-faint">{{ fila.kpi.target_legible }}</td>
          <td>
            <span class="gema-chip" :class="claseEstado(fila.estado)">{{ etiquetaEstado(fila.estado) }}</span>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <!-- ========================= PANEL DE CAPTURA ========================= -->
    <gema-panel
      :abierto="!!seleccion"
      :titulo="seleccion ? seleccion.kpi.nombre : ''"
      :subtitulo="seleccion ? seleccion.kpi.frecuencia + ' · ' + seleccion.periodo.etiqueta : ''"
      modo="modal"
      tamano="lg"
      @cerrar="cerrar"
    >
      <template v-if="seleccion">
        <!-- Consolidado: solo lectura + desglose -->
        <template v-if="seleccion.es_consolidado">
          <p class="gema-alert is-warn">
            Este KPI es consolidado: su valor se calcula con los KPIs que lo componen.
            No se captura a mano.
          </p>

          <div class="gema-cap-cab">
            <gema-indicador
              :valor="detalle.valor ? detalle.valor.valor_indicador : null"
              :unidad="seleccion.kpi.unidad_medida"
              :semaforo="detalle.valor ? detalle.valor.semaforo : 'gris'"
              :con-punto="false"
              class="gema-cap-valor"
            />
            <div class="gema-cap-cab-info">
              <span class="gema-eyebrow">Target</span>
              <span>{{ seleccion.kpi.target_legible }}</span>
            </div>
          </div>

          <div v-if="detalle.desglose && detalle.desglose.length">
            <span class="gema-eyebrow">Componentes</span>
            <div class="gema-table-wrap gema-cap-tabla">
              <table class="gema-table">
                <thead>
                  <tr><th>KPI</th><th class="is-num" style="width: 90px">Aporte</th></tr>
                </thead>
                <tbody>
                  <tr v-for="c in detalle.desglose" :key="c.kpi_id">
                    <td class="is-wrap">{{ c.nombre }}</td>
                    <td class="is-num">
                      <span v-if="c.falta" class="gema-chip is-gris">falta</span>
                      <span v-else class="gema-num">{{ c.indicador }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- Captura normal -->
        <template v-else>
          <p v-if="seleccion.kpi.formula_texto" class="gema-alert">
            {{ seleccion.kpi.formula_texto }}
          </p>

          <!-- Division: numerador y denominador -->
          <div v-if="tipoFormula === 'division'" class="gema-grid-2">
            <div class="gema-field">
              <label class="gema-label">Numerador (real) *</label>
              <input v-model.number="form.numerador" class="gema-input" type="number" step="any" />
            </div>
            <div class="gema-field">
              <label class="gema-label">Denominador (base) *</label>
              <input v-model.number="form.denominador" class="gema-input" type="number" step="any" />
            </div>
          </div>

          <!-- Valor directo / escala -->
          <div v-else-if="tipoFormula === 'valor_directo' || tipoFormula === 'escala'" class="gema-field">
            <label class="gema-label">Valor real *</label>
            <input v-model.number="form.valor_real" class="gema-input" type="number" step="any" />
          </div>

          <!-- Regla de 3: detalle por persona/concepto -->
          <template v-else-if="tipoFormula === 'regla_de_3'">
            <div class="gema-row">
              <span class="gema-eyebrow">Detalle de puntajes</span>
              <div class="gema-spacer"></div>
              <button class="gema-btn is-sm" type="button" @click="agregarDetalle">Agregar fila</button>
              <button v-if="detalle.candidatos_detalle && detalle.candidatos_detalle.length" class="gema-btn is-sm" type="button" @click="cargarEquipo">
                Cargar equipo
              </button>
            </div>

            <div v-if="form.detalles.length" class="gema-table-wrap">
              <table class="gema-table">
                <thead>
                  <tr>
                    <th>Colaborador / concepto</th>
                    <th class="is-num" style="width: 84px">Puntaje</th>
                    <th class="is-num" style="width: 84px">Maximo</th>
                    <th class="is-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(d, i) in form.detalles" :key="i">
                    <td>
                      <select v-if="d.idusuario" v-model.number="d.idusuario" class="gema-select gema-cap-mini">
                        <option v-for="c in detalle.candidatos_detalle" :key="c.idusuario" :value="c.idusuario">
                          {{ c.nombre_completo }}
                        </option>
                      </select>
                      <input v-else v-model.trim="d.etiqueta" class="gema-input gema-cap-mini" type="text" placeholder="Concepto" />
                    </td>
                    <td class="is-num"><input v-model.number="d.puntaje" class="gema-input gema-cap-mini is-num" type="number" step="any" /></td>
                    <td class="is-num"><input v-model.number="d.puntaje_maximo" class="gema-input gema-cap-mini is-num" type="number" step="any" /></td>
                    <td class="is-actions">
                      <button class="gema-btn is-sm is-icon is-danger" type="button" @click="form.detalles.splice(i, 1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6L6 18" /></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="gema-table-foot">
                <span>Suma {{ sumaPuntaje }} de {{ sumaMaximo }}</span>
                <span class="gema-num">{{ previsionReglaDe3 }}</span>
              </div>
            </div>

            <div v-else class="gema-empty">Agregue al menos una fila con puntaje y maximo.</div>
          </template>

          <!-- Plan: obligatorio cuando el target se compara contra el presupuesto -->
          <div v-if="seleccion.kpi.operador === 'referencia'" class="gema-field">
            <label class="gema-label">Plan / presupuesto del periodo *</label>
            <input v-model.number="form.valor_plan" class="gema-input" type="number" step="any" />
            <span class="gema-faint gema-cap-pista">
              El target de este KPI es "{{ seleccion.kpi.target_legible }}": se compara contra este numero.
            </span>
          </div>

          <div v-else class="gema-field">
            <label class="gema-label">Plan del periodo (opcional)</label>
            <input v-model.number="form.valor_plan" class="gema-input" type="number" step="any" />
          </div>

          <div class="gema-field">
            <label class="gema-label">Observacion</label>
            <textarea v-model.trim="form.observacion" class="gema-textarea" rows="2"></textarea>
          </div>

          <!-- Resultado actual -->
          <div v-if="detalle.valor" class="gema-cap-cab">
            <gema-indicador
              :valor="detalle.valor.valor_indicador"
              :unidad="seleccion.kpi.unidad_medida"
              :semaforo="detalle.valor.semaforo"
              :con-punto="false"
              class="gema-cap-valor"
            />
            <div class="gema-cap-cab-info">
              <span class="gema-eyebrow">Target</span>
              <span>{{ seleccion.kpi.target_legible }}</span>
              <span class="gema-chip" :class="claseEstado(detalle.valor.estado)">
                {{ etiquetaEstado(detalle.valor.estado) }}
              </span>
            </div>
          </div>

          <p v-if="detalle.valor && detalle.valor.estado === 'rechazado' && detalle.valor.observacion" class="gema-alert is-error">
            Devuelto: {{ detalle.valor.observacion }}
          </p>
        </template>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="cerrar">Cerrar</button>

        <template v-if="seleccion && !seleccion.es_consolidado">
          <button class="gema-btn" type="button" :disabled="guardando" @click="guardar(false)">
            {{ guardando ? 'Guardando...' : 'Guardar borrador' }}
          </button>
          <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardar(true)">
            Guardar y enviar
          </button>
        </template>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="kpi_captura" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaIndicador from './componentes/GemaIndicador.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

const ESTADOS = {
  sin_capturar: { texto: 'Sin capturar', clase: 'is-gris' },
  borrador: { texto: 'Borrador', clase: '' },
  enviado: { texto: 'En validacion', clase: 'is-accent' },
  validado: { texto: 'Validado', clase: 'is-verde' },
  rechazado: { texto: 'Devuelto', clase: 'is-rojo' }
}

const FILTROS_ESTADO = [
  { valor: '', texto: 'Todos' },
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'enviado', texto: 'En validacion' },
  { valor: 'validado', texto: 'Validados' }
]

export default {
  name: 'GemaCapturaValores',

  components: { GemaTabla, GemaPanel, GemaIndicador, GemaSiguiente },

  data () {
    return {
      FILTROS_ESTADO,
      cargando: true,
      guardando: false,
      nivel: '',
      filtro: '',
      estadoFiltro: 'pendiente',
      bandeja: [],
      seleccion: null,
      detalle: {},
      form: this.formVacio(),
      columnas: [
        { clave: 'nivel', titulo: 'Nivel', ancho: '62px', valor: (f) => f.kpi.nivel },
        { clave: 'unidad', titulo: 'Und.', ancho: '58px', valor: (f) => f.kpi.unidad },
        { clave: 'nombre', titulo: 'KPI', valor: (f) => f.kpi.nombre },
        { clave: 'frecuencia', titulo: 'Frecuencia', ancho: '100px', valor: (f) => f.kpi.frecuencia },
        { clave: 'periodo', titulo: 'Periodo', ancho: '86px', valor: (f) => f.periodo.etiqueta },
        { clave: 'indicador', titulo: 'Indicador', numerica: true, ancho: '112px', valor: (f) => (f.valor ? f.valor.valor_indicador : null) },
        { clave: 'target', titulo: 'Target', ancho: '160px', valor: (f) => f.kpi.target_legible },
        { clave: 'estado', titulo: 'Estado', ancho: '106px' }
      ]
    }
  },

  computed: {
    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.bandeja.filter((f) => {
        if (this.nivel && f.kpi.nivel !== this.nivel) return false
        if (!this.coincideEstado(f, this.estadoFiltro)) return false
        if (!texto) return true

        return f.kpi.nombre.toLowerCase().includes(texto)
      })
    },

    tipoFormula () {
      return this.seleccion && this.seleccion.kpi.formula ? this.seleccion.kpi.formula.tipo : 'valor_directo'
    },

    sumaPuntaje () {
      return this.form.detalles.reduce((t, d) => t + (Number(d.puntaje) || 0), 0)
    },

    sumaMaximo () {
      return this.form.detalles.reduce((t, d) => t + (Number(d.puntaje_maximo) || 0), 0)
    },

    /** Vista previa del indicador antes de guardar, para no capturar a ciegas. */
    previsionReglaDe3 () {
      if (!this.sumaMaximo) return 'sin calcular'

      const valor = this.sumaPuntaje / this.sumaMaximo
      const unidad = this.seleccion ? this.seleccion.kpi.unidad_medida : null

      return GemaIndicador.formatear(valor, unidad)
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    formVacio () {
      return { numerador: null, denominador: null, valor_plan: null, valor_real: null, observacion: '', detalles: [] }
    },

    coincideEstado (fila, filtro) {
      if (!filtro) return true
      if (filtro === 'pendiente') {
        return !fila.es_consolidado && ['sin_capturar', 'borrador', 'rechazado'].includes(fila.estado)
      }

      return fila.estado === filtro
    },

    conteo (filtro) {
      if (!filtro) return 0

      return this.bandeja.filter((f) => this.coincideEstado(f, filtro)).length
    },

    etiquetaEstado (estado) { return (ESTADOS[estado] || {}).texto || estado },
    claseEstado (estado) { return (ESTADOS[estado] || {}).clase || '' },

    cambiarNivel (nivel) {
      this.nivel = nivel
    },

    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('valores/bandeja')
        this.bandeja = r.data

        // Permite entrar directo a un KPI desde el tablero (?kpi=12).
        const idDirecto = Number(this.$route.query.kpi)

        if (idDirecto) {
          const fila = this.bandeja.find((f) => f.kpi.kpi_id === idDirecto)
          if (fila) this.abrir(fila)
        }
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    async abrir (fila) {
      this.seleccion = fila
      this.detalle = {}
      this.form = this.formVacio()

      try {
        const r = await api.get(`valores/${fila.kpi.kpi_id}/${fila.periodo.periodo_id}`)
        this.detalle = r.data

        if (r.data.valor) {
          this.form = {
            numerador: r.data.valor.numerador,
            denominador: r.data.valor.denominador,
            valor_plan: r.data.valor.valor_plan,
            valor_real: r.data.valor.valor_real,
            observacion: r.data.valor.observacion || '',
            detalles: (r.data.valor.detalles || []).map((d) => ({
              idusuario: d.idusuario,
              etiqueta: d.etiqueta,
              cantidad: d.cantidad,
              horas: d.horas,
              puntaje: d.puntaje,
              puntaje_maximo: d.puntaje_maximo
            }))
          }
        }
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      }
    },

    cerrar () {
      this.seleccion = null
      this.detalle = {}
    },

    agregarDetalle () {
      this.form.detalles.push({ idusuario: null, etiqueta: '', puntaje: null, puntaje_maximo: null })
    },

    /** Precarga una fila por cada colaborador de la unidad del KPI. */
    cargarEquipo () {
      const existentes = this.form.detalles.map((d) => d.idusuario).filter(Boolean)

      this.detalle.candidatos_detalle.forEach((c) => {
        if (existentes.includes(c.idusuario)) return

        this.form.detalles.push({
          idusuario: c.idusuario,
          etiqueta: null,
          puntaje: null,
          puntaje_maximo: null
        })
      })
    },

    async guardar (enviar) {
      this.guardando = true

      try {
        const cuerpo = {
          kpi_id: this.seleccion.kpi.kpi_id,
          periodo_id: this.seleccion.periodo.periodo_id,
          numerador: this.form.numerador,
          denominador: this.form.denominador,
          valor_plan: this.form.valor_plan,
          valor_real: this.form.valor_real,
          observacion: this.form.observacion
        }

        if (this.tipoFormula === 'regla_de_3') {
          cuerpo.detalles = this.form.detalles
        }

        const r = await api.post('valores', cuerpo)
        this.detalle.valor = r.data
        this.$vs.notify({ title: 'Guardado', text: r.message, color: 'success' })

        if (enviar) {
          if (r.data.valor_indicador === null) {
            this.$vs.notify({
              title: 'Falta informacion',
              text: 'No se puede enviar a validacion sin un indicador calculado.',
              color: 'warning'
            })
          } else {
            const env = await api.post(`valores/${r.data.kpi_valor_id}/enviar`)
            this.$vs.notify({ title: 'Enviado', text: env.message, color: 'success' })
            this.cerrar()
          }
        }

        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-cap-conteo {
  margin-left: 4px;
  padding: 0 4px;
  font-size: 10px;
  border-radius: 8px;
  background: var(--gema-surface-3);
  color: var(--gema-text-2);
}

.gema-cap-cab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gema-u3);
  padding: var(--gema-u3);
  background: var(--gema-surface-2);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
}

.gema-cap-valor ::v-deep .gema-ind-valor { font-size: 26px; letter-spacing: -0.02em; }

.gema-cap-cab-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  font-size: var(--gema-fs-sm);
  text-align: right;
}

.gema-cap-tabla { margin-top: 3px; }
.gema-cap-mini { height: 24px; }
.gema-cap-mini.is-num { text-align: right; }
.gema-cap-pista { font-size: var(--gema-fs-xs); line-height: 1.4; }
</style>
