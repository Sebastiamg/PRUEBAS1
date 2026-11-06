<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar libro..." />
      </div>

      <select v-model="serieFiltro" class="gema-select gema-lib-filtro">
        <option :value="null">Todas las series</option>
        <option v-for="s in opciones.series" :key="s.id_serie" :value="s.id_serie">{{ s.nombre_serie }}</option>
      </select>

      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivos</span>
      </label>
    </div>

    <p class="gema-alert gema-lib-ayuda">
      Estos son los libros de <strong>produccion</strong> de Gestion Estrategica. No son los libros de
      la plataforma: aqui se planifica, y un cambio no altera lo que ven los docentes
      ni el EVA. Se puede enlazar un libro real e importar sus unidades como punto de partida.
    </p>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="nombre"
      texto-vacio="No hay libros de produccion"
    >
      <template #vacio>
        Cree uno, o importe las unidades de un libro existente de la plataforma.
      </template>

      <template #default="{ filas }">
        <tr v-for="l in filas" :key="l.libro_id" :class="{ 'is-inactive': !l.estado }">
          <td class="is-wrap">
            {{ l.nombre }}
            <span v-if="l.idlibro_legacy" class="gema-chip gema-lib-enlace" title="Enlazado a un libro de la plataforma">
              enlazado
            </span>
          </td>
          <td class="gema-faint">{{ l.serie || l.serie_nombre || '—' }}</td>
          <td class="gema-faint">{{ l.area || l.area_nombre || '—' }}</td>
          <td class="gema-faint">{{ l.nivel || l.nivel_nombre || '—' }}</td>
          <td class="is-num gema-faint">{{ l.anio || '—' }}</td>
          <td class="is-num">{{ l.unidades.length }}</td>
          <td class="is-num">{{ l.paginas_total }}</td>
          <td class="is-num gema-faint">{{ l.factor_equivalencia }}</td>
          <td class="is-num gema-faint">{{ l.paginas_equivalentes }}</td>
          <td>
            <span class="gema-chip" :class="l.estado ? 'is-verde' : 'is-gris'">
              {{ l.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editar(l)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                </svg>
              </button>
              <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminar(l)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>

      <template #pie>
        <span>{{ totalPaginas }} paginas · {{ totalUnidades }} unidades en total</span>
      </template>
    </gema-tabla>

    <!-- ==================== REGISTRO DE LIBROS NUEVOS (en el mismo listado) ==================== -->
    <div v-if="puedeCrear" class="gema-card gema-lib-nuevos">
      <div class="gema-card-head">
        <span class="gema-h2">Agregar libros</span>
        <div class="gema-row">
          <button class="gema-btn is-sm" type="button" @click="descargarPlantillaLote">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></svg>
            Descargar plantilla Excel
          </button>
          <button class="gema-btn is-sm" type="button" @click="$refs.archivoLote.click()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21V9m0 0l-4 4m4-4l4 4M4 5h16" /></svg>
            Subir Excel
          </button>
          <input ref="archivoLote" type="file" accept=".xlsx,.xls" class="gema-lib-lote-input" @change="subirExcelLote" />
        </div>
      </div>

      <p class="gema-alert gema-lib-nuevos-ayuda">
        Escriba directo aqui: apenas llena una fila aparece otra debajo sola. Nada se
        crea hasta que le de "Guardar libros nuevos" — un solo guardado con todo lo
        que haya llenado. <strong>Iniciales</strong> y <strong>Cierre</strong> son
        las paginas antes de la Unidad 1 y despues de la ultima (portada/indice,
        glosario/anexos) — no cuentan como unidad, pero si suman al total.
      </p>
      <span v-if="errorExcelLote" class="gema-error-text gema-lib-nuevos-error">{{ errorExcelLote }}</span>

      <div class="gema-table-wrap gema-lib-lote">
        <table class="gema-table">
          <thead>
            <tr>
              <th style="min-width: 180px">Libro (nombre)</th>
              <th style="width: 120px">Serie</th>
              <th style="width: 120px">Area</th>
              <th style="width: 100px">Nivel</th>
              <th class="is-num" style="width: 64px">Año</th>
              <th class="is-num" style="width: 76px">Iniciales</th>
              <th class="is-num" style="width: 64px">Unid.</th>
              <th class="is-num" style="width: 84px">Pag./unid.</th>
              <th class="is-num" style="width: 64px">Cierre</th>
              <th class="is-num" style="width: 64px">Factor</th>
              <th class="is-num" style="width: 78px">Pag. total</th>
              <th class="is-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(f, i) in filasLote" :key="i">
              <td><input v-model.trim="f.nombre" class="gema-input gema-lote-mini" type="text" /></td>
              <td><input v-model.trim="f.serie" class="gema-input gema-lote-mini" type="text" list="gema-lib-series" /></td>
              <td><input v-model.trim="f.area" class="gema-input gema-lote-mini" type="text" list="gema-lib-areas" /></td>
              <td><input v-model.trim="f.nivel" class="gema-input gema-lote-mini" type="text" list="gema-lib-niveles" /></td>
              <td><input v-model.number="f.anio" class="gema-input gema-lote-mini is-num" type="number" min="2000" max="2100" /></td>
              <td><input v-model.number="f.paginas_iniciales" class="gema-input gema-lote-mini is-num" type="number" min="0" /></td>
              <td><input v-model.number="f.unidades" class="gema-input gema-lote-mini is-num" type="number" min="1" max="50" /></td>
              <td><input v-model.number="f.paginas_por_unidad" class="gema-input gema-lote-mini is-num" type="number" min="1" /></td>
              <td><input v-model.number="f.paginas_cierre" class="gema-input gema-lote-mini is-num" type="number" min="0" /></td>
              <td><input v-model.number="f.factor_equivalencia" class="gema-input gema-lote-mini is-num" type="number" step="0.5" min="1" max="10" /></td>
              <td class="is-num gema-faint">{{ paginasTotalLote(f) }}</td>
              <td class="is-actions">
                <button class="gema-btn is-sm is-icon is-danger" type="button" title="Quitar fila" @click="filasLote.splice(i, 1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="gema-row gema-lib-lote-acciones">
        <button class="gema-btn is-sm" type="button" @click="agregarFilaLote">Agregar fila</button>
        <div class="gema-spacer"></div>
        <span class="gema-muted">{{ filasLoteConDatos.length }} libro(s) por crear</span>
        <button class="gema-btn is-primary" type="button" :disabled="!filasLoteConDatos.length || guardandoLote" @click="guardarLote">
          {{ guardandoLote ? 'Guardando...' : 'Guardar libros nuevos' }}
        </button>
      </div>
    </div>

    <!-- ============================= PANEL ============================= -->
    <gema-panel
      :abierto="panel"
      titulo="Editar libro"
      :subtitulo="form.libro_id ? form.nombre : ''"
      modo="modal"
      tamano="lg"
      @cerrar="panel = false"
    >
      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="form.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <!-- Serie/Nivel/Area: texto libre con sugerencias del catalogo de la
           plataforma, sin obligar a que ya exista alli (puede ser una serie,
           nivel o area nueva). -->
      <div class="gema-grid-3">
        <div class="gema-field">
          <label class="gema-label">Serie</label>
          <input v-model.trim="form.serie" class="gema-input" type="text" list="gema-lib-series" placeholder="Ej: Sinapsis" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Nivel</label>
          <input v-model.trim="form.nivel" class="gema-input" type="text" list="gema-lib-niveles" placeholder="Ej: 5to Año" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Area</label>
          <input v-model.trim="form.area" class="gema-input" type="text" list="gema-lib-areas" placeholder="Ej: Lengua" />
        </div>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Año</label>
          <input v-model.number="form.anio" class="gema-input" type="number" min="2000" max="2100" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Factor de equivalencia</label>
          <input v-model.number="form.factor_equivalencia" class="gema-input" type="number" step="0.5" min="1" max="10" />
          <span class="gema-faint gema-lib-pista">
            3 = las tres pasadas del proceso (C1, C2, C3).
          </span>
        </div>
      </div>

      <div class="gema-field">
        <label class="gema-label">Paginas iniciales</label>
        <input v-model.number="form.paginas_iniciales" class="gema-input" type="number" min="0" />
        <span class="gema-faint gema-lib-pista">
          Antes de la Unidad 1 (portada, indice). No es una unidad, pero suma al total.
        </span>
      </div>

      <!-- Unidades -->
      <fieldset class="gema-lib-bloque">
        <legend class="gema-eyebrow">Unidades</legend>

        <div class="gema-row">
          <span class="gema-muted">{{ form.unidades.length }} unidades · {{ paginasForm }} paginas</span>
          <div class="gema-spacer"></div>
          <button class="gema-btn is-sm" type="button" @click="agregarUnidad">Agregar unidad</button>
          <button class="gema-btn is-sm" type="button" :disabled="!form.unidades.length" @click="repartir">
            Repartir paginas
          </button>
        </div>

        <div v-if="form.unidades.length" class="gema-table-wrap">
          <table class="gema-table">
            <thead>
              <tr>
                <th style="width: 76px">N.</th>
                <th>Nombre</th>
                <th class="is-num" style="width: 84px">Paginas</th>
                <th class="is-num" style="width: 76px">Desde</th>
                <th class="is-num" style="width: 76px">Hasta</th>
                <th class="is-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(u, i) in form.unidades" :key="i">
                <td><input v-model.number="u.numero" class="gema-input gema-lib-mini is-num" type="number" min="1" /></td>
                <td><input v-model.trim="u.nombre" class="gema-input gema-lib-mini" type="text" /></td>
                <td class="is-num"><input v-model.number="u.paginas" class="gema-input gema-lib-mini is-num" type="number" min="0" /></td>
                <td class="is-num"><input v-model.number="u.pag_inicio" class="gema-input gema-lib-mini is-num" type="number" min="0" /></td>
                <td class="is-num"><input v-model.number="u.pag_fin" class="gema-input gema-lib-mini is-num" type="number" min="0" /></td>
                <td class="is-actions">
                  <button class="gema-btn is-sm is-icon is-danger" type="button" @click="form.unidades.splice(i, 1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="gema-empty">
          Sin unidades el libro no se puede planificar: el Gantt trabaja por unidad.
        </div>

        <div class="gema-field">
          <label class="gema-label">Total de paginas del libro (para repartir)</label>
          <input v-model.number="totalRepartir" class="gema-input" type="number" min="0" placeholder="Ej: 274" />
        </div>
      </fieldset>

      <div class="gema-field">
        <label class="gema-label">Paginas de cierre</label>
        <input v-model.number="form.paginas_cierre" class="gema-input" type="number" min="0" />
        <span class="gema-faint gema-lib-pista">
          Despues de la ultima unidad (glosario, anexos). No es una unidad, pero suma al total.
        </span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Observaciones</label>
        <textarea v-model.trim="form.observaciones" class="gema-textarea" rows="2"></textarea>
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

    <!-- Sugerencias compartidas por el formulario individual y el registro nuevo -->
    <datalist id="gema-lib-series">
      <option v-for="s in opciones.series" :key="s.id_serie" :value="s.nombre_serie" />
    </datalist>
    <datalist id="gema-lib-niveles">
      <option v-for="n in opciones.niveles" :key="n.idnivel" :value="n.nombrenivel" />
    </datalist>
    <datalist id="gema-lib-areas">
      <option v-for="a in opciones.areas" :key="a.idarea" :value="a.nombrearea" />
    </datalist>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="param_libros" />
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

/**
 * Columnas de la carga masiva <-> encabezados del Excel. El mismo mapa arma la
 * plantilla para descargar y lee de vuelta el archivo que suban, para que lo que
 * ven en el Excel sea igual a lo que ven en la tabla de la pantalla.
 */
const CAMPOS_LOTE = [
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'serie', titulo: 'Serie' },
  { clave: 'area', titulo: 'Area' },
  { clave: 'nivel', titulo: 'Nivel / Grado' },
  { clave: 'anio', titulo: 'Año', numerico: true },
  { clave: 'paginas_iniciales', titulo: 'Paginas iniciales', numerico: true },
  { clave: 'unidades', titulo: 'Unidades', numerico: true },
  { clave: 'paginas_por_unidad', titulo: 'Paginas por unidad', numerico: true },
  { clave: 'paginas_cierre', titulo: 'Paginas de cierre', numerico: true },
  { clave: 'factor_equivalencia', titulo: 'Factor equivalencia', numerico: true }
]

export default {
  name: 'GemaLibros',

  components: { GemaTabla, GemaPanel, GemaSiguiente },

  data () {
    return {
      cargando: true,
      guardando: false,
      filtro: '',
      serieFiltro: null,
      verInactivos: false,
      libros: [],
      opciones: { series: [], areas: [], niveles: [], departamentos: [] },
      totalRepartir: null,
      panel: false,
      form: this.vacio(),
      errores: {},
      guardandoLote: false,
      filasLote: [this.filaLoteVacia()],
      errorExcelLote: '',
      columnas: [
        { clave: 'nombre', titulo: 'Libro' },
        { clave: 'serie_nombre', titulo: 'Serie', ancho: '120px' },
        { clave: 'area_nombre', titulo: 'Area', ancho: '120px' },
        { clave: 'nivel_nombre', titulo: 'Nivel', ancho: '100px' },
        { clave: 'anio', titulo: 'Año', numerica: true, ancho: '64px' },
        { clave: 'unidades', titulo: 'Unid.', numerica: true, ancho: '64px', valor: (l) => l.unidades.length },
        { clave: 'paginas_total', titulo: 'Paginas', numerica: true, ancho: '78px' },
        { clave: 'factor_equivalencia', titulo: 'Factor', numerica: true, ancho: '64px' },
        { clave: 'paginas_equivalentes', titulo: 'Pag. eq.', numerica: true, ancho: '78px' },
        { clave: 'estado', titulo: 'Estado', ancho: '86px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_libros', 'crear') },
    puedeEditar () { return sesion.puede('param_libros', 'editar') },
    puedeEliminar () { return sesion.puede('param_libros', 'eliminar') },

    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.libros.filter((l) => {
        if (!this.verInactivos && !l.estado) return false
        if (this.serieFiltro && l.serie_id !== this.serieFiltro) return false
        if (!texto) return true

        return l.nombre.toLowerCase().includes(texto)
      })
    },

    paginasForm () {
      return this.form.unidades.reduce((t, u) => t + (Number(u.paginas) || 0), 0)
    },

    totalPaginas () {
      return this.visibles.reduce((t, l) => t + (Number(l.paginas_total) || 0), 0).toLocaleString('es-EC')
    },

    totalUnidades () {
      return this.visibles.reduce((t, l) => t + l.unidades.length, 0)
    },

    /** Filas de "Agregar libros" que de verdad tienen algo — la ultima suele estar
     *  en blanco, esperando a que se empiece a llenar. */
    filasLoteConDatos () {
      return this.filasLote.filter((f) => this.filaLoteTieneDatos(f))
    }
  },

  created () {
    this.cargar()
  },

  watch: {
    /**
     * Apenas se empieza a llenar la ultima fila de la carga masiva, aparece sola
     * una fila nueva en blanco — no hay que acordarse de apretar "Agregar fila".
     */
    filasLote: {
      deep: true,
      handler () {
        const ultima = this.filasLote[this.filasLote.length - 1]

        if (ultima && this.filaLoteTieneDatos(ultima)) {
          this.filasLote.push(this.filaLoteVacia())
        }
      }
    }
  },

  methods: {
    vacio () {
      return {
        libro_id: null, nombre: '', serie: '', nivel: '', area: '',
        idlibro_legacy: null,
        anio: new Date().getFullYear(), factor_equivalencia: 3,
        paginas_iniciales: 0, paginas_cierre: 0, observaciones: '',
        estado: true, unidades: []
      }
    },

    async cargar () {
      this.cargando = true

      try {
        const [libros, opciones] = await Promise.all([
          api.get('libros'),
          api.get('libros/opciones')
        ])

        this.libros = libros.data
        this.opciones = opciones.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    agregarUnidad () {
      const siguiente = this.form.unidades.length
        ? Math.max(...this.form.unidades.map((u) => Number(u.numero) || 0)) + 1
        : 1

      this.form.unidades.push({ numero: siguiente, nombre: `Unidad ${siguiente}`, paginas: 0, pag_inicio: null, pag_fin: null })
    },

    /**
     * Reparte el total entre las unidades. El residuo se suma a las primeras, de
     * modo que la suma cuadre exactamente con el total escrito.
     */
    repartir () {
      const total = Number(this.totalRepartir) || 0
      const n = this.form.unidades.length

      if (!total || !n) {
        this.$vs.notify({ title: 'Falta el total', text: 'Escriba el total de paginas a repartir.', color: 'warning' })
        return
      }

      const base = Math.floor(total / n)
      let resto = total - (base * n)

      this.form.unidades.forEach((u, i) => {
        u.paginas = base + (resto > 0 ? 1 : 0)
        if (resto > 0) resto--

        // Rango de paginas continuo.
        const previa = this.form.unidades[i - 1]
        u.pag_inicio = previa ? (Number(previa.pag_fin) || 0) + 1 : 1
        u.pag_fin = u.pag_inicio + u.paginas - 1
      })
    },

    // ------------------------------------------------------------ registro nuevo
    filaLoteVacia () {
      return {
        area: '', nivel: '', nombre: '', serie: '',
        anio: new Date().getFullYear(), factor_equivalencia: 3,
        paginas_iniciales: 0, unidades: 6, paginas_por_unidad: null, paginas_cierre: 0
      }
    },

    /** Solo mira los campos que arrancan realmente vacios (los demas ya traen un default). */
    filaLoteTieneDatos (f) {
      return !!(f.area || f.nivel || f.nombre || f.serie || f.paginas_por_unidad)
    },

    /** Total en vivo, mientras se llena la fila (misma cuenta que ya usa el libro guardado). */
    paginasTotalLote (f) {
      const iniciales = Number(f.paginas_iniciales) || 0
      const unidades = Number(f.unidades) || 0
      const porUnidad = Number(f.paginas_por_unidad) || 0
      const cierre = Number(f.paginas_cierre) || 0

      return iniciales + (unidades * porUnidad) + cierre
    },

    agregarFilaLote () {
      this.filasLote.push(this.filaLoteVacia())
    },

    /** Plantilla en blanco con las mismas columnas de la tabla, para llenar en Excel. */
    descargarPlantillaLote () {
      const fila = {}
      CAMPOS_LOTE.forEach((c) => { fila[c.titulo] = '' })

      const hoja = XLSX.utils.json_to_sheet([fila])
      const libro = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(libro, hoja, 'Libros')
      XLSX.writeFile(libro, 'plantilla_libros_produccion.xlsx')
    },

    /** Lee el Excel subido y reemplaza la tabla con lo que traiga (una fila = un libro). */
    subirExcelLote (evento) {
      const archivo = evento.target.files && evento.target.files[0]
      this.errorExcelLote = ''
      if (!archivo) return

      const lector = new FileReader()

      lector.onload = (e) => {
        try {
          const libro = XLSX.read(new Uint8Array(e.target.result), { type: 'array' })
          const hoja = libro.Sheets[libro.SheetNames[0]]
          const filas = XLSX.utils.sheet_to_json(hoja, { defval: '' })

          const cargadas = filas
            .map((fila) => {
              const salida = {}
              CAMPOS_LOTE.forEach((c) => {
                const valor = fila[c.titulo]
                salida[c.clave] = c.numerico
                  ? (valor === '' || valor === null || valor === undefined ? null : Number(valor))
                  : String(valor || '').trim()
              })
              return salida
            })
            // Se descartan filas totalmente vacias (ej. la de ejemplo sin llenar).
            .filter((f) => f.nombre || f.area || f.paginas_total)

          if (!cargadas.length) {
            this.errorExcelLote = 'El Excel no trae filas con datos. Revise que uso la plantilla y lleno al menos el nombre.'
            return
          }

          this.filasLote = cargadas
          this.$vs.notify({ title: 'Cargado', text: `${cargadas.length} fila(s) leidas del Excel.`, color: 'success' })
        } catch (err) {
          this.errorExcelLote = 'No se pudo leer ese archivo. Verifique que sea el .xlsx de la plantilla.'
        } finally {
          evento.target.value = null
        }
      }

      lector.readAsArrayBuffer(archivo)
    },

    async guardarLote () {
      this.guardandoLote = true

      // Una fila sin nombre se completa sola con "Area Nivel" (el nombre es
      // obligatorio para guardar); asi no hace falta un boton aparte para eso.
      const libros = this.filasLoteConDatos.map((f) => ({
        ...f,
        nombre: f.nombre || [f.area, f.nivel].filter(Boolean).join(' ') || 'Libro sin nombre'
      }))

      try {
        const r = await api.post('libros/lote', { libros })
        this.filasLote = [this.filaLoteVacia()]
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success', time: 6000 })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger', time: 8000 })
      } finally {
        this.guardandoLote = false
      }
    },

    editar (libro) {
      this.form = {
        libro_id: libro.libro_id,
        nombre: libro.nombre,
        serie: libro.serie || '',
        nivel: libro.nivel || '',
        area: libro.area || '',
        idlibro_legacy: libro.idlibro_legacy,
        anio: libro.anio,
        factor_equivalencia: Number(libro.factor_equivalencia),
        paginas_iniciales: Number(libro.paginas_iniciales) || 0,
        paginas_cierre: Number(libro.paginas_cierre) || 0,
        observaciones: libro.observaciones || '',
        estado: !!libro.estado,
        unidades: libro.unidades.map((u) => ({
          numero: u.numero, nombre: u.nombre, paginas: u.paginas,
          pag_inicio: u.pag_inicio, pag_fin: u.pag_fin
        }))
      }

      this.totalRepartir = libro.paginas_total
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.libro_id
          ? await api.put(`libros/${this.form.libro_id}`, this.form)
          : await api.post('libros', this.form)

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

    eliminar (libro) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar libro',
        text: `Se eliminara "${libro.nombre}". Si esta en algun plan solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`libros/${libro.libro_id}`)
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
.gema-lib-filtro { width: 180px; }
.gema-inactivos { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-lib-ayuda { margin: 0 0 var(--gema-u3); }
.gema-lib-enlace { margin-left: var(--gema-u); font-size: 10px; height: 16px; padding: 0 4px; }
.gema-lib-pista { font-size: var(--gema-fs-xs); line-height: 1.4; }
.gema-lib-mini { height: 24px; }
.gema-lib-mini.is-num { text-align: right; }

.gema-lib-nuevos { margin-top: var(--gema-u3); padding-bottom: var(--gema-u3); }
.gema-lib-nuevos-ayuda { margin: var(--gema-u3) var(--gema-u3) var(--gema-u2); }
.gema-lib-nuevos-error { display: block; margin: 0 var(--gema-u3) var(--gema-u2); }

.gema-lib-lote { margin: 0 var(--gema-u3); width: auto; max-height: 55vh; overflow-y: auto; }
.gema-lote-mini { height: 26px; width: 100%; }
.gema-lote-mini.is-num { text-align: right; }
.gema-lib-lote-acciones { margin: var(--gema-u2) var(--gema-u3) 0; }
.gema-lib-lote-input { display: none; }

.gema-lib-bloque {
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
