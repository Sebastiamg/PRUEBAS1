<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-btn-group">
        <button class="gema-btn is-sm" :class="{ 'is-active': nivel === '' }" type="button" @click="nivel = ''">Todos</button>
        <button class="gema-btn is-sm" :class="{ 'is-active': nivel === 'N3' }" type="button" @click="nivel = 'N3'">N3 Gerencia</button>
        <button class="gema-btn is-sm" :class="{ 'is-active': nivel === 'N2' }" type="button" @click="nivel = 'N2'">N2 Unidades</button>
      </div>

      <div class="gema-toolbar-sep"></div>

      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar KPI..." />
      </div>

      <select v-model="pilarFiltro" class="gema-select gema-kpi-filtro">
        <option :value="null">Todos los pilares</option>
        <option v-for="p in opciones.pilares" :key="p.pilar_id" :value="p.pilar_id">{{ p.nombre }}</option>
      </select>

      <select v-model="tdpFiltro" class="gema-select gema-kpi-filtro">
        <option :value="null">Todas las unidades</option>
        <option v-for="d in opciones.departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_nombre }}</option>
      </select>

      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivos</span>
      </label>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nuevo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo KPI
      </button>
    </div>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="orden"
      texto-vacio="No hay KPIs con esos filtros"
    >
      <template #default="{ filas }">
        <tr v-for="k in filas" :key="k.kpi_id" :class="{ 'is-inactive': !k.estado }">
          <td>
            <span class="gema-chip" :class="k.nivel === 'N3' ? 'is-accent' : ''">{{ k.nivel }}</span>
          </td>
          <td class="gema-faint">{{ k.departamento ? k.departamento.tdp_iniciales : 'GG' }}</td>
          <td class="is-wrap">
            <span>{{ k.nombre }}</span>
            <span v-if="k.componentes_count" class="gema-chip gema-kpi-sigma" title="Consolidado">
              Σ {{ k.componentes_count }}
            </span>
          </td>
          <td>
            <span class="gema-row">
              <span class="gema-kpi-marca" :style="{ background: k.pilar ? k.pilar.color : 'transparent' }"></span>
              <span class="gema-faint">{{ k.pilar ? k.pilar.nombre : '—' }}</span>
            </span>
          </td>
          <td class="gema-faint">{{ k.frecuencia ? k.frecuencia.nombre : '—' }}</td>
          <td class="gema-faint">{{ k.unidad_medida ? k.unidad_medida.nombre : '—' }}</td>
          <td>{{ k.target_legible }}</td>
          <td class="gema-faint gema-kpi-acc">
            {{ k.accountable ? k.accountable.nombres + ' ' + k.accountable.apellidos : 'Sin asignar' }}
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button
                v-if="esConsolidado(k) && puedeEditar"
                class="gema-btn is-sm is-icon"
                type="button"
                title="Editar componentes"
                @click="abrirComponentes(k)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              </button>
              <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editar(k)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                </svg>
              </button>
              <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminar(k)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <!-- ========================= PANEL KPI ========================= -->
    <gema-panel
      :abierto="panel"
      :titulo="form.kpi_id ? 'Editar KPI' : 'Nuevo KPI'"
      :subtitulo="form.kpi_id ? form.nombre : ''"
      modo="modal"
      tamano="lg"
      @cerrar="panel = false"
    >
      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Nivel *</label>
          <select v-model="form.nivel" class="gema-select">
            <option value="N3">N3 — Gerencia General</option>
            <option value="N2">N2 — Unidad</option>
          </select>
        </div>

        <div class="gema-field">
          <label class="gema-label">Unidad {{ form.nivel === 'N2' ? '*' : '' }}</label>
          <select v-model.number="form.tdp_id" class="gema-select" :disabled="form.nivel === 'N3'">
            <option :value="null">{{ form.nivel === 'N3' ? 'Gerencia General' : 'Seleccione...' }}</option>
            <option v-for="d in opciones.departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_nombre }}</option>
          </select>
          <span v-if="errores.tdp_id" class="gema-error-text">{{ errores.tdp_id }}</span>
        </div>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre del KPI *</label>
        <input v-model.trim="form.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Pilar *</label>
          <select v-model.number="form.pilar_id" class="gema-select" @change="alCambiarPilar">
            <option :value="null" disabled>Seleccione...</option>
            <option v-for="p in opciones.pilares" :key="p.pilar_id" :value="p.pilar_id">{{ p.nombre }}</option>
          </select>
          <span v-if="errores.pilar_id" class="gema-error-text">{{ errores.pilar_id }}</span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Meta</label>
          <select v-model.number="form.meta_id" class="gema-select" :disabled="!form.pilar_id">
            <option :value="null">Sin meta</option>
            <option v-for="m in metasDelPilar" :key="m.meta_id" :value="m.meta_id">{{ recortar(m.nombre) }}</option>
          </select>
        </div>
      </div>

      <div class="gema-field">
        <label class="gema-label">Objetivo</label>
        <select v-model.number="form.objetivo_id" class="gema-select" :disabled="!form.pilar_id">
          <option :value="null">Sin objetivo</option>
          <option v-for="o in objetivosDelPilar" :key="o.objetivo_id" :value="o.objetivo_id">
            {{ recortar(o.descripcion) }}
          </option>
        </select>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Frecuencia *</label>
          <select v-model.number="form.frecuencia_id" class="gema-select">
            <option :value="null" disabled>Seleccione...</option>
            <option v-for="f in catalogos.frecuencias" :key="f.frecuencia_id" :value="f.frecuencia_id">
              {{ f.nombre }}
            </option>
          </select>
          <span v-if="errores.frecuencia_id" class="gema-error-text">{{ errores.frecuencia_id }}</span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Unidad de medida *</label>
          <select v-model.number="form.unidad_medida_id" class="gema-select">
            <option :value="null" disabled>Seleccione...</option>
            <option v-for="u in catalogos.unidades_medida" :key="u.unidad_medida_id" :value="u.unidad_medida_id">
              {{ u.nombre }}
            </option>
          </select>
          <span v-if="errores.unidad_medida_id" class="gema-error-text">{{ errores.unidad_medida_id }}</span>
        </div>
      </div>

      <!-- Target: el operador decide que campos hacen falta -->
      <fieldset class="gema-kpi-bloque">
        <legend class="gema-eyebrow">Target</legend>

        <div class="gema-grid-2">
          <div class="gema-field">
            <label class="gema-label">Operador *</label>
            <select v-model.number="form.operador_target_id" class="gema-select">
              <option :value="null" disabled>Seleccione...</option>
              <option v-for="o in catalogos.operadores_target" :key="o.operador_target_id" :value="o.operador_target_id">
                {{ o.simbolo }} — {{ o.nombre }}
              </option>
            </select>
          </div>

          <div class="gema-field">
            <label class="gema-label">
              {{ operadorEs('rango') ? 'Limite inferior' : 'Valor' }}
              {{ operadorEs('referencia') ? '' : '*' }}
            </label>
            <input
              v-model.number="form.target_valor"
              class="gema-input"
              :class="{ 'is-error': errores.target_valor }"
              type="number"
              step="any"
              :disabled="operadorEs('referencia')"
            />
            <span v-if="errores.target_valor" class="gema-error-text">{{ errores.target_valor }}</span>
          </div>
        </div>

        <div v-if="operadorEs('rango')" class="gema-field">
          <label class="gema-label">Limite superior *</label>
          <input
            v-model.number="form.target_valor_2"
            class="gema-input"
            :class="{ 'is-error': errores.target_valor_2 }"
            type="number"
            step="any"
          />
          <span v-if="errores.target_valor_2" class="gema-error-text">{{ errores.target_valor_2 }}</span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Target en palabras</label>
          <input
            v-model.trim="form.target_texto"
            class="gema-input"
            type="text"
            placeholder='Ej: ">= Presupuesto de Ventas" o ">= 2,0 al final del 2026"'
          />
          <span class="gema-faint gema-kpi-pista">
            Es lo que se muestra en el tablero. Si se deja vacio se arma con el operador y el valor.
          </span>
        </div>

        <p v-if="unidadEsPorcentaje" class="gema-alert">
          La unidad es porcentaje: escriba el target como fraccion (0,9 para 90%).
        </p>

        <p v-if="operadorEs('referencia')" class="gema-alert is-warn">
          Con este operador el indicador se compara contra el <strong>plan</strong> que
          se capture en cada periodo, no contra un numero fijo.
        </p>
      </fieldset>

      <!-- Formula -->
      <fieldset class="gema-kpi-bloque">
        <legend class="gema-eyebrow">Calculo</legend>

        <div class="gema-grid-2">
          <div class="gema-field">
            <label class="gema-label">Formula *</label>
            <select v-model.number="form.formula_id" class="gema-select" @change="ajustarTipoIngreso">
              <option :value="null" disabled>Seleccione...</option>
              <option v-for="f in catalogos.formulas" :key="f.formula_id" :value="f.formula_id">{{ f.nombre }}</option>
            </select>
          </div>

          <div class="gema-field">
            <label class="gema-label">Tipo de ingreso *</label>
            <select v-model="form.tipo_ingreso" class="gema-select" :disabled="formulaEsConsolidada">
              <option value="manual">Manual</option>
              <option value="calculado">Calculado desde actividades</option>
              <option value="consolidado">Consolidado</option>
            </select>
          </div>
        </div>

        <div class="gema-field">
          <label class="gema-label">Formula en palabras</label>
          <textarea
            v-model.trim="form.formula_texto"
            class="gema-textarea"
            rows="2"
            placeholder="Ej: Capacitaciones realizadas / Capacitaciones planeadas (del mes)"
          ></textarea>
        </div>

        <p v-if="formulaEsConsolidada" class="gema-alert is-warn">
          Es un KPI consolidado: no se captura a mano. Despues de guardarlo, defina
          sus componentes con el boton de la lista.
        </p>
      </fieldset>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Responsable (accountable)</label>
          <select v-model.number="form.accountable_idusuario" class="gema-select">
            <option :value="null">Sin asignar</option>
            <option v-for="a in opciones.accountables" :key="a.idusuario" :value="a.idusuario">
              {{ a.nombre_completo }}
            </option>
          </select>
        </div>

        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="form.orden" class="gema-input" type="number" min="0" />
        </div>
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

    <!-- ===================== PANEL COMPONENTES ===================== -->
    <gema-panel
      :abierto="panelComp"
      titulo="Componentes del KPI consolidado"
      :subtitulo="kpiComp ? kpiComp.nombre : ''"
      modo="modal"
      tamano="lg"
      @cerrar="panelComp = false"
    >
      <p class="gema-alert">
        {{ textoOperacion }} Cada componente aporta su indicador
        <strong>validado</strong> del periodo. Si falta el dato de alguno, este KPI
        no muestra indicador.
      </p>

      <div v-if="componentes.length" class="gema-table-wrap">
        <table class="gema-table">
          <thead>
            <tr>
              <th>KPI componente</th>
              <th style="width: 60px">Nivel</th>
              <th v-if="operacionPromedio" class="is-num" style="width: 80px">Peso</th>
              <th class="is-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in componentes" :key="c.kpi_hijo_id">
              <td class="is-wrap">{{ c.nombre }}</td>
              <td class="gema-faint">{{ c.nivel }}</td>
              <td v-if="operacionPromedio" class="is-num">
                <input v-model.number="c.peso" class="gema-input gema-kpi-peso" type="number" min="0" step="any" />
              </td>
              <td class="is-actions">
                <button class="gema-btn is-sm is-icon is-danger" type="button" title="Quitar" @click="componentes.splice(i, 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="gema-empty">
        <div class="gema-empty-title">Sin componentes</div>
        Agregue los KPIs que alimentan este indicador.
      </div>

      <div class="gema-field">
        <label class="gema-label">Agregar componente</label>
        <select class="gema-select" @change="agregarComponente($event)">
          <option value="">Seleccione un KPI...</option>
          <option v-for="c in candidatosDisponibles" :key="c.kpi_id" :value="c.kpi_id">
            [{{ c.nivel }}{{ c.departamento ? ' ' + c.departamento.tdp_iniciales : '' }}] {{ c.nombre }}
          </option>
        </select>
        <span class="gema-faint gema-kpi-pista">
          Solo se listan KPIs que no son consolidados, para no anidar agregaciones.
        </span>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelComp = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarComponentes">
          {{ guardando ? 'Guardando...' : 'Guardar composicion' }}
        </button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="param_kpis" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

const TIPOS_CONSOLIDADOS = ['producto_componentes', 'promedio_componentes', 'minimo_componentes']

export default {
  name: 'GemaKpis',

  components: { GemaTabla, GemaPanel, GemaSiguiente },

  data () {
    return {
      cargando: true,
      guardando: false,
      nivel: '',
      filtro: '',
      pilarFiltro: null,
      tdpFiltro: null,
      verInactivos: false,
      kpis: [],
      catalogos: { frecuencias: [], unidades_medida: [], operadores_target: [], formulas: [] },
      opciones: { departamentos: [], accountables: [], candidatos_componente: [], pilares: [] },
      metas: [],
      objetivos: [],
      panel: false,
      panelComp: false,
      kpiComp: null,
      componentes: [],
      form: this.vacio(),
      errores: {},
      columnas: [
        { clave: 'nivel', titulo: 'Nivel', ancho: '62px' },
        { clave: 'unidad', titulo: 'Und.', ancho: '58px', valor: (k) => (k.departamento ? k.departamento.tdp_iniciales : 'GG') },
        { clave: 'nombre', titulo: 'KPI' },
        { clave: 'pilar', titulo: 'Pilar', ancho: '130px', valor: (k) => (k.pilar ? k.pilar.nombre : '') },
        { clave: 'frecuencia', titulo: 'Frecuencia', ancho: '100px', valor: (k) => (k.frecuencia ? k.frecuencia.nombre : '') },
        { clave: 'unidad_medida', titulo: 'Medida', ancho: '150px', valor: (k) => (k.unidad_medida ? k.unidad_medida.nombre : '') },
        { clave: 'target_legible', titulo: 'Target', ancho: '170px' },
        { clave: 'accountable', titulo: 'Responsable', ancho: '160px', valor: (k) => (k.accountable ? k.accountable.nombres : '') },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_kpis', 'crear') },
    puedeEditar () { return sesion.puede('param_kpis', 'editar') },
    puedeEliminar () { return sesion.puede('param_kpis', 'eliminar') },

    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.kpis.filter((k) => {
        if (!this.verInactivos && !k.estado) return false
        if (this.nivel && k.nivel !== this.nivel) return false
        if (this.pilarFiltro && k.pilar_id !== this.pilarFiltro) return false
        if (this.tdpFiltro && k.tdp_id !== this.tdpFiltro) return false
        if (!texto) return true

        return k.nombre.toLowerCase().includes(texto)
      })
    },

    metasDelPilar () {
      return this.metas.filter((m) => m.pilar_id === this.form.pilar_id && m.estado)
    },

    objetivosDelPilar () {
      return this.objetivos.filter((o) => o.pilar_id === this.form.pilar_id && o.estado)
    },

    formulaSeleccionada () {
      return this.catalogos.formulas.find((f) => f.formula_id === this.form.formula_id)
    },

    formulaEsConsolidada () {
      return !!(this.formulaSeleccionada && TIPOS_CONSOLIDADOS.includes(this.formulaSeleccionada.tipo))
    },

    unidadEsPorcentaje () {
      const u = this.catalogos.unidades_medida.find((x) => x.unidad_medida_id === this.form.unidad_medida_id)

      return !!(u && u.tipo === 'porcentaje')
    },

    operacionPromedio () {
      return !!(this.kpiComp && this.kpiComp.formula && this.kpiComp.formula.tipo === 'promedio_componentes')
    },

    textoOperacion () {
      const tipo = this.kpiComp && this.kpiComp.formula ? this.kpiComp.formula.tipo : ''

      if (tipo === 'producto_componentes') return 'El indicador es la multiplicacion de los componentes.'
      if (tipo === 'promedio_componentes') return 'El indicador es el promedio ponderado de los componentes.'
      if (tipo === 'minimo_componentes') return 'El indicador es el peor de los componentes.'

      return ''
    },

    candidatosDisponibles () {
      const usados = this.componentes.map((c) => c.kpi_hijo_id)
      const propio = this.kpiComp ? this.kpiComp.kpi_id : null

      return this.opciones.candidatos_componente.filter(
        (c) => c.kpi_id !== propio && !usados.includes(c.kpi_id)
      )
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    vacio () {
      return {
        kpi_id: null,
        nivel: 'N3',
        tdp_id: null,
        pilar_id: null,
        objetivo_id: null,
        meta_id: null,
        nombre: '',
        frecuencia_id: null,
        unidad_medida_id: null,
        operador_target_id: null,
        target_valor: null,
        target_valor_2: null,
        target_texto: '',
        formula_id: null,
        formula_texto: '',
        accountable_idusuario: null,
        tipo_ingreso: 'manual',
        orden: null,
        estado: true
      }
    },

    recortar (texto) {
      const limpio = String(texto || '')

      return limpio.length > 80 ? `${limpio.slice(0, 80)}...` : limpio
    },

    esConsolidado (kpi) {
      return !!(kpi.formula && TIPOS_CONSOLIDADOS.includes(kpi.formula.tipo))
    },

    operadorEs (codigo) {
      const o = this.catalogos.operadores_target.find((x) => x.operador_target_id === this.form.operador_target_id)

      return !!(o && o.codigo === codigo)
    },

    async cargar () {
      this.cargando = true

      try {
        const [kpis, catalogos, opciones, pilares, metas, objetivos] = await Promise.all([
          api.get('kpis'),
          api.get('catalogos/todos'),
          api.get('kpis/opciones'),
          api.get('parametrizacion/pilares'),
          api.get('parametrizacion/metas'),
          api.get('parametrizacion/objetivos')
        ])

        this.kpis = kpis.data
        this.catalogos = catalogos.data
        this.opciones = { ...opciones.data, pilares: pilares.data.filter((p) => p.estado) }
        this.metas = metas.data
        this.objetivos = objetivos.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    alCambiarPilar () {
      this.form.meta_id = null
      this.form.objetivo_id = null
    },

    /** Un consolidado siempre es tipo_ingreso consolidado; se sincroniza solo. */
    ajustarTipoIngreso () {
      if (this.formulaEsConsolidada) {
        this.form.tipo_ingreso = 'consolidado'
      } else if (this.form.tipo_ingreso === 'consolidado') {
        this.form.tipo_ingreso = 'manual'
      }
    },

    nuevo () {
      this.form = this.vacio()
      this.form.nivel = this.nivel === 'N2' ? 'N2' : 'N3'
      // Si el jefe solo administra una unidad, ya viene como unica opcion: se
      // preselecciona en vez de dejarla en "Seleccione...".
      this.form.tdp_id = this.form.nivel === 'N2'
        ? (this.opciones.departamentos.length === 1 ? this.opciones.departamentos[0].tdp_id : this.tdpFiltro)
        : null
      this.form.pilar_id = this.pilarFiltro
      this.errores = {}
      this.panel = true
    },

    editar (kpi) {
      this.form = {
        kpi_id: kpi.kpi_id,
        nivel: kpi.nivel,
        tdp_id: kpi.tdp_id,
        pilar_id: kpi.pilar_id,
        objetivo_id: kpi.objetivo_id,
        meta_id: kpi.meta_id,
        nombre: kpi.nombre,
        frecuencia_id: kpi.frecuencia_id,
        unidad_medida_id: kpi.unidad_medida_id,
        operador_target_id: kpi.operador_target_id,
        target_valor: kpi.target_valor,
        target_valor_2: kpi.target_valor_2,
        target_texto: kpi.target_texto || '',
        formula_id: kpi.formula_id,
        formula_texto: kpi.formula_texto || '',
        accountable_idusuario: kpi.accountable_idusuario,
        tipo_ingreso: kpi.tipo_ingreso,
        orden: kpi.orden,
        estado: !!kpi.estado
      }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.kpi_id
          ? await api.put(`kpis/${this.form.kpi_id}`, this.form)
          : await api.post('kpis', this.form)

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

    eliminar (kpi) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar KPI',
        text: `Se eliminara "${kpi.nombre}". Si tiene periodos con datos o es componente de un consolidado, solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`kpis/${kpi.kpi_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    },

    // ----------------------------------------------------------- componentes
    async abrirComponentes (kpi) {
      this.kpiComp = kpi
      this.componentes = []
      this.panelComp = true

      try {
        const r = await api.get(`kpis/${kpi.kpi_id}/componentes`)

        this.componentes = r.data.map((c) => ({
          kpi_hijo_id: c.kpi_hijo_id,
          nombre: c.hijo ? c.hijo.nombre : '(KPI eliminado)',
          nivel: c.hijo ? c.hijo.nivel : '',
          operacion: c.operacion,
          peso: Number(c.peso)
        }))
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      }
    },

    agregarComponente (evento) {
      const id = Number(evento.target.value)
      evento.target.value = ''

      if (!id) return

      const candidato = this.opciones.candidatos_componente.find((c) => c.kpi_id === id)
      if (!candidato) return

      this.componentes.push({
        kpi_hijo_id: candidato.kpi_id,
        nombre: candidato.nombre,
        nivel: candidato.nivel,
        peso: 1
      })
    },

    async guardarComponentes () {
      this.guardando = true

      try {
        const r = await api.put(`kpis/${this.kpiComp.kpi_id}/componentes`, {
          componentes: this.componentes.map((c) => ({
            kpi_hijo_id: c.kpi_hijo_id,
            peso: c.peso
          }))
        })

        this.panelComp = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
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
.gema-kpi-filtro { width: 158px; }
.gema-inactivos { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-kpi-marca { width: 3px; height: 13px; border-radius: 2px; flex: none; }
.gema-kpi-sigma { margin-left: var(--gema-u); font-size: 10px; height: 16px; padding: 0 4px; }
.gema-kpi-acc { font-size: var(--gema-fs-sm); }
.gema-kpi-pista { font-size: var(--gema-fs-xs); line-height: 1.4; }
.gema-kpi-peso { height: 24px; width: 66px; text-align: right; }

.gema-kpi-bloque {
  display: flex;
  flex-direction: column;
  gap: var(--gema-u3);
  margin: 0;
  padding: var(--gema-u3);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
  background: var(--gema-surface-2);

  legend { padding: 0 var(--gema-u); }
}
</style>
