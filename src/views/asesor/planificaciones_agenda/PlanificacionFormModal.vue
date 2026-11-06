<template>
  <vs-popup class="popup-planificacion" :title="(modoEdicion ? 'Editar' : 'Nueva') + ' Planificación'"
    :active.sync="modalVisible" @close="$emit('close')">
    <div class="popup-body">

      <!-- INSTITUCIÓN -->
      <div class="form-section">
        <label class="section-title">Institución *</label>

        <div v-if="!formulario.institucion_id && !formulario.institucion_id_temporal">
          <!-- Botones de tipo de institución -->
          <div class="inst-buttons">
            <vs-button @click="tipoInstitucion = 'normal'" :color="tipoInstitucion === 'normal' ? 'primary' : 'dark'"
              :type="tipoInstitucion === 'normal' ? 'filled' : 'flat'" size="small"
              class="inst-btn">Registradas</vs-button>
            <vs-button @click="tipoInstitucion = 'temporal'"
              :color="tipoInstitucion === 'temporal' ? 'primary' : 'dark'"
              :type="tipoInstitucion === 'temporal' ? 'filled' : 'flat'" size="small"
              class="inst-btn">Temporales</vs-button>
          </div>

          <!-- Búsqueda de instituciones registradas -->
          <div v-if="tipoInstitucion === 'normal'" class="search-box">
            <vs-input class="w-full" v-model="busquedaInstitucion"
              placeholder="Buscar institución (mín. 5 caracteres)..." @keyup.enter="buscarInstituciones" />
            <vs-button @click="buscarInstituciones" color="primary" size="small" style="margin-top:8px;">
              Buscar
            </vs-button>
          </div>

          <!-- ✅ RESULTADOS DE BÚSQUEDA - INSTITUCIONES NORMALES (esto ya existía, NO lo borres) -->
          <div v-if="instituciones.length > 0 && tipoInstitucion === 'normal'" class="instituciones-list">
            <div class="list-header">
              <span>{{ instituciones.length }} instituciones encontradas</span>
              <button @click="limpiarInstitucion" class="btn-remove"
                v-if="!planificacionFinalizada && !esRegistrada">×</button>
            </div>
            <div v-for="inst in instituciones" :key="inst.id" @click="seleccionarInstitucion(inst)"
              class="institucion-item">
              <div class="inst-nombre">{{ inst.nombre }}</div>
              <div class="inst-ciudad" v-if="inst.ciudad">{{ inst.ciudad }}</div>
            </div>
          </div>


          <!-- Instituciones temporales -->
          <div v-if="tipoInstitucion === 'temporal'">
            <!-- Acciones para temporales -->
            <div class="flex flex-col sm:flex-row gap-3 mt-2">
              <vs-button @click="abrirModalTemporal" color="success" type="border" size="small" class="w-full sm:w-1/2">
                + Nueva Temporal
              </vs-button>
              <vs-button @click="cargarTemporales" color="primary" type="border" size="small" class="w-full sm:w-1/2">
                Mis Temporales
              </vs-button>
            </div>

            <!-- Input de búsqueda para temporales (solo si hay más de 5) -->
            <div v-if="institucionesTemporales.length > 5" class="mt-3">
              <vs-input class="w-full" v-model="busquedaTemporal" placeholder="Buscar institución temporal..."
                @keyup.enter="filtrarTemporales" clearable />
            </div>

            <!-- Lista de instituciones temporales -->
            <div v-if="institucionesTemporalesFiltradas.length > 0" class="instituciones-list mt-2">
              <div class="list-header">
                <span>{{ institucionesTemporalesFiltradas.length }} instituciones temporales encontradas</span>
                <button @click="limpiarInstitucion" class="btn-remove"
                  v-if="!planificacionFinalizada && !esRegistrada">×</button>
              </div>
              <div v-for="inst in institucionesTemporalesFiltradas" :key="inst.id"
                @click="seleccionarInstitucionTemporal(inst)" class="institucion-item">
                <div class="inst-nombre">{{ inst.nombre }}</div>
                <div class="inst-ciudad" v-if="inst.ciudad">{{ inst.ciudad }}</div>
              </div>
            </div>

            <!-- Mensaje si no hay temporales -->
            <div v-else-if="institucionesTemporalesCargadas && institucionesTemporalesFiltradas.length === 0"
              class="text-center p-4 text-gray-500">
              No hay instituciones temporales disponibles
            </div>
          </div>
        </div>

        <!-- Institución seleccionada -->
        <div v-else class="institucion-seleccionada">
          <div class="selected-card">
            <div class="selected-info">
              <span class="selected-label">Institución:</span>
              <span class="selected-name">{{ formulario.nombre_institucion }}</span>
              <span class="selected-type" v-if="formulario.estado_institucion_temporal === 1">(Temporal)</span>
            </div>
            <button @click="limpiarInstitucion" class="btn-remove" v-if="!planificacionFinalizada">×</button>
          </div>
        </div>
      </div>

      <!-- TÍTULO -->
      <div class="form-section">
        <label class="section-title">Título *</label>
        <input type="text" v-model="formulario.titulo" placeholder="Título de la actividad" class="form-input"
          :readonly="planificacionFinalizada || esRegistrada" />
      </div>

      <!-- OBSERVACIONES -->
      <div class="form-section">
        <label class="section-title">Observaciones</label>
        <textarea v-model="formulario.descripcion" placeholder="Observaciones adicionales de la visita (opcional)"
          class="form-textarea" rows="3"></textarea>
      </div>

      <!-- FECHA / HORA -->
      <div class="form-row">
        <div class="form-section half">
          <label class="section-title">Fecha *</label>
          <input type="date" v-model="formulario.fecha" class="form-input" :min="fechaMinima"
            :readonly="planificacionFinalizada || esRegistrada" />
        </div>
        <div class="form-section half">
          <label class="section-title">Hora *</label>
          <input type="time" v-model="formulario.hora" class="form-input" :min="horaMinima"
            :readonly="planificacionFinalizada || esRegistrada" />
        </div>
      </div>

      <!-- OPCIONES DE ACTIVIDAD -->
      <div class="form-section">
        <label class="section-title">Opciones de Actividad</label>
        <p class="opciones-subtitulo">Selecciona al menos una opción</p>

        <div class="opciones-grid">
          <label v-for="op in opcionesList" :key="op.key" class="checkbox-label"
            :class="{ 'disabled': planificacionFinalizada || esRegistrada }">
            <input type="checkbox" v-model="opciones[op.key]" :disabled="planificacionFinalizada || esRegistrada" />
            <span>{{ op.nombre }}</span>
          </label>
        </div>

        <div v-if="opciones.otraEditorial" class="editorial-input">
          <label class="section-title">Nombre de la Editorial *</label>
          <input type="text" v-model="opciones.editorial" class="form-input" placeholder="Escriba la editorial"
            :readonly="planificacionFinalizada || esRegistrada" />
        </div>
      </div>

      <!-- BOTONES -->
      <div class="form-actions">
        <vs-button @click="guardar" color="success" type="gradient" block v-if="!planificacionFinalizada">
          {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
        </vs-button>
        <vs-button @click="$emit('close')" color="danger" type="border" block>
          Cancelar
        </vs-button>
      </div>
    </div>

    <!-- MODAL PARA CREAR INSTITUCIÓN TEMPORAL -->
    <vs-popup class="popup-temporal" title="Nueva Institución Temporal" :active.sync="mostrarFormularioTemporal"
      @close="cerrarModalTemporal">
      <div class="popup-body-temporal">
        <div class="form-section">
          <label class="section-title">Nombre de la Institución *</label>
          <input type="text" v-model="institucionTemporal.nombre" placeholder="Ingrese el nombre de la institución"
            class="form-input" />
        </div>

        <div class="form-section">
          <label class="section-title">Región *</label>
          <select v-model="institucionTemporal.region" @change="cargarPeriodos" class="form-input">
            <option value="1">Sierra</option>
            <option value="2">Costa</option>
          </select>
        </div>

        <div class="form-section">
          <label class="section-title">Ciudad *</label>
          <select v-model="institucionTemporal.ciudad" class="form-input">
            <option :value="null">Seleccione una ciudad</option>
            <option v-for="ciudad in arregloCiudades" :key="ciudad.idciudad" :value="ciudad">
              {{ ciudad.nombre }}
            </option>
          </select>
        </div>

        <div class="form-section">
          <label class="section-title">Período *</label>
          <select v-model="institucionTemporal.periodo" class="form-input">
            <option :value="null">Seleccione un período</option>
            <option v-for="periodo in arregloPeriodos" :key="periodo.id" :value="periodo.id">
              {{ periodo.nombre }}
            </option>
          </select>
        </div>

        <div class="form-actions">
          <vs-button @click="crearInstitucionTemporal" color="success" type="gradient" block>
            Guardar Institución
          </vs-button>
          <vs-button @click="cerrarModalTemporal" color="danger" type="border" block>
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </vs-popup>
</template>

<script>
import PlanificacionesService from './planificacionesService'

export default {
  name: 'PlanificacionFormModal',

  props: {
    planificacion: Object,
    visible: {
      type: Boolean,
      default: false
    },
    planificacionId: {
      type: [Number, String],
      default: null
    },
    usuario: {
      type: Object,
      default: () => ({})
    },
    modoEdicion: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const hoy = new Date()
    const fechaActual = hoy.toISOString().split('T')[0]
    const horaActual = hoy.toTimeString().slice(0, 5)
    return {
      modalVisible: this.visible,

      formulario: {
        id: null,
        titulo: '',
        descripcion: '',
        fecha: fechaActual, // 👈 Valor por defecto fecha actual
        hora: horaActual,   // 👈 Valor por defecto hora actual
        institucion_id: null,
        institucion_id_temporal: null,
        nombre_institucion: '',
        estado_institucion_temporal: 0,
        periodo_id: null,
        estadoNumerico: 0
      },

      tipoInstitucion: 'normal',
      busquedaInstitucion: '',
      instituciones: [],

      opciones: {
        presentacion: false,
        entrega_muestras: false,
        reunion: false,
        seguimiento: false,
        cierre: false,
        cobranza: false,
        post_venta: false,
        retiro_cartas: false,
        retiro_muestras: false,
        capacitacion: false,
        otraEditorial: false,
        editorial: ''
      },

      opcionesList: [
        { key: 'presentacion', nombre: 'Presentación' },
        { key: 'entrega_muestras', nombre: 'Entrega Muestras' },
        { key: 'reunion', nombre: 'Reunión' },
        { key: 'seguimiento', nombre: 'Seguimiento' },
        { key: 'cierre', nombre: 'Cierre' },
        { key: 'cobranza', nombre: 'Cobranza' },
        { key: 'post_venta', nombre: 'Post Venta' },
        { key: 'retiro_cartas', nombre: 'Retiro Cartas' },
        { key: 'retiro_muestras', nombre: 'Retiro Muestras' },
        { key: 'capacitacion', nombre: 'Capacitación' },
        { key: 'otraEditorial', nombre: 'Otra Editorial' }
      ],

      mostrarFormularioTemporal: false,
      institucionTemporal: {
        nombre: '',
        ciudad: null,
        region: '2',
        periodo: null
      },
      arregloCiudades: [],
      arregloPeriodos: [],
      institucionSeleccionada: false,
      fechaMinima: fechaActual,  // 👈 Para no permitir fechas anteriores
      horaMinima: '',            // 👈 Para control de hora (opcional)
      institucionesTemporales: [],
      institucionesTemporalesFiltradas: [],
      busquedaTemporal: '',
      institucionesTemporalesCargadas: false
    }
  },

  watch: {
    visible: function (val) {
      this.modalVisible = val
      if (val) {
        // Cuando se abre el modal, verificar si hay planificación para editar
        if (this.planificacion && this.planificacion.id) {
          // Tiene ID -> Es edición
          this.cargarPlanificacion()
        } else {
          // No tiene ID o es null -> Es nuevo registro
          this.resetForm()
        }
      }
    },

    modalVisible: function (val) {
      if (!val) {
        this.$emit('close')
      }
    },

    planificacion: {
      handler: function (newVal, oldVal) {
        // Solo actuar si el modal está visible y la planificación cambió
        if (this.visible && newVal) {
          // Verificar si realmente es una planificación válida para editar
          if (newVal.id) {
            // console.log('Watch planificacion detectado (edición):', newVal)
            this.cargarPlanificacion()
          } else if (!newVal.id && (!oldVal || oldVal.id)) {
            // Si la nueva planificación no tiene ID y la anterior sí, es un reset
            // console.log('Watch planificacion detectado (nuevo registro)')
            this.resetForm()
          }
        }
      },
      deep: true,
      immediate: false  // 👈 Cambiar a false para evitar ejecución automática al inicio
    },
    busquedaTemporal: function (val) {
      if (this.tipoInstitucion === 'temporal' && this.institucionesTemporales.length > 0) {
        if (!val || val.trim() === '') {
          this.institucionesTemporalesFiltradas = [...this.institucionesTemporales]
        } else {
          const busqueda = val.toLowerCase().trim()
          this.institucionesTemporalesFiltradas = this.institucionesTemporales.filter(inst =>
            inst.nombre.toLowerCase().includes(busqueda) ||
            (inst.ciudad && inst.ciudad.toLowerCase().includes(busqueda))
          )
        }
      }
    }
  },

  computed: {
    planificacionFinalizada: function () {
      // Si no hay planificación (nueva), no está finalizada
      if (!this.planificacion) return false

      // console.log('Planificación estado:', this.planificacion.estadoNumerico)
      if (this.planificacion.estadoNumerico == 4) {
        return true
      }

      return false
    },
    // ✅ NUEVO: Solo permite editar descripción
    esRegistrada: function () {
      if (!this.planificacion) return false
      return Number(this.planificacion.estadoNumerico) === 1
    }
  },
  mounted() {
    if (this.visible) {
      if (this.planificacion && this.planificacion.id) {
        this.cargarPlanificacion()
      } else {
        this.resetForm()
      }
    }
  },

  methods: {

    cargarPlanificacion: function () {
      var self = this
      var plan = this.planificacion
      var ahora = new Date()
      var fechaActual = ahora.toISOString().split('T')[0]
      var horaActual = ahora.toTimeString().slice(0, 5)

      // Determinar si es edición basado en el ID del plan
      if (plan && plan.id) {
        this.modoEdicion = true
        // console.log('✅ Modo edición: TRUE, ID:', plan.id)
      } else {
        this.modoEdicion = false
        // console.log('❌ Modo edición: FALSE')
        return
      }

      // ⭐ IMPORTANTE: Identificar si la institución es normal o temporal
      let institucionId = null
      let institucionIdTemporal = null
      let estadoInstitucionTemporal = 0
      let nombreInstitucion = ''

      // Verificar si viene institucion_id (institución normal)
      if (plan.institucion_id && plan.institucion_id !== null && plan.institucion_id !== 0) {
        institucionId = plan.institucion_id
        institucionIdTemporal = null
        estadoInstitucionTemporal = 0
        nombreInstitucion = plan.institucion || plan.nombre_institucion || plan.nombreInstitucion || ''
      }
      // Verificar si viene institucion_id_temporal
      else if (plan.institucion_id_temporal && plan.institucion_id_temporal !== null && plan.institucion_id_temporal !== 0) {
        institucionId = null
        institucionIdTemporal = plan.institucion_id_temporal
        estadoInstitucionTemporal = 1
        nombreInstitucion = plan.nombre_institucion_temporal || plan.institucion || plan.nombre_institucion || ''
      }
      // Si no hay IDs pero hay nombre (caso temporal sin ID)
      else if (plan.institucion && plan.institucion !== '') {
        nombreInstitucion = plan.institucion
        // Podría ser temporal sin ID asignado aún
        institucionIdTemporal = plan.institucion_id_temporal || null
        estadoInstitucionTemporal = plan.estado_institucion_temporal || 0
      }

      let fechaPlan = ''
      if (plan.startDate) {
        fechaPlan = plan.startDate.split(' ')[0]
      } else if (plan.fecha) {
        fechaPlan = plan.fecha
      }

      let horaPlan = plan.hora_inicio || plan.hora || ''

      this.formulario = {
        id: plan.id || null,
        titulo: plan.title || plan.titulo || '',
        descripcion: plan.url || plan.descripcion || plan.observacionAsesor || '',
        // fecha: plan.startDate ? plan.startDate.split(' ')[0] : (plan.fecha || ''),
        // hora: plan.hora_inicio || plan.hora || '',
        fecha: fechaPlan || fechaActual,        // 👈 Si no hay fecha, usa la actual
        hora: horaPlan || horaActual,           // 👈 Si no hay hora, usa la actual
        institucion_id: institucionId,
        institucion_id_temporal: institucionIdTemporal,
        nombre_institucion: nombreInstitucion,
        estado_institucion_temporal: estadoInstitucionTemporal,
        periodo_id: plan.periodo_id || null,
        estadoNumerico: parseInt(plan.estado) || plan.estadoNumerico || 0
      }

      // console.log('Formulario después mapear:', this.formulario)

      // Cargar opciones
      this.opciones = {
        presentacion: false,
        entrega_muestras: false,
        reunion: false,
        seguimiento: false,
        cierre: false,
        cobranza: false,
        post_venta: false,
        retiro_cartas: false,
        retiro_muestras: false,
        capacitacion: false,
        otraEditorial: false,
        editorial: ''
      }

      // Parsear opciones si vienen como string
      let opcionesObj = plan.opciones
      if (typeof opcionesObj === 'string') {
        try {
          opcionesObj = JSON.parse(opcionesObj)
        } catch (e) {
          console.error('Error parsing opciones:', e)
          opcionesObj = {}
        }
      }

      if (opcionesObj) {
        Object.assign(this.opciones, opcionesObj)
      }

      // Cargar editorial si existe
      if (plan.datosCompletos && plan.datosCompletos.otraEditorial) {
        this.opciones.editorial = plan.datosCompletos.otraEditorial
        this.opciones.otraEditorial = true
      }

      // ⭐ Marcar institución como seleccionada si hay ID o nombre
      if (this.formulario.institucion_id || this.formulario.institucion_id_temporal || this.formulario.nombre_institucion) {
        this.institucionSeleccionada = true

        if (this.formulario.institucion_id) {
          this.tipoInstitucion = 'normal'
        } else {
          this.tipoInstitucion = 'temporal'
        }
      }


    },

    // Método auxiliar para obtener el nombre de la institución
    obtenerNombreInstitucion: function (plan) {
      // Prioridades:
      // 1. nombre_institucion_temporal si existe
      if (plan.nombre_institucion_temporal && plan.nombre_institucion_temporal !== '') {
        return plan.nombre_institucion_temporal
      }
      // 2. institucion (nombre de la institución)
      if (plan.institucion && plan.institucion !== '') {
        return plan.institucion
      }
      // 3. asignado
      if (plan.asignado && plan.asignado !== '') {
        return plan.asignado
      }
      // 4. nombreInstitucion
      if (plan.nombreInstitucion && plan.nombreInstitucion !== '') {
        return plan.nombreInstitucion
      }
      // 5. nombre_institucion
      if (plan.nombre_institucion && plan.nombre_institucion !== '') {
        return plan.nombre_institucion
      }
      // 6. Por defecto
      return ''
    },

    // RESET PARA NUEVA PLANIFICACIÓN
    resetForm: function () {
      var ahora = new Date()

      this.formulario = {
        id: null,
        titulo: '',
        descripcion: '',
        fecha: ahora.toISOString().split('T')[0],
        hora: ahora.toTimeString().slice(0, 5),
        institucion_id: null,
        institucion_id_temporal: null,
        nombre_institucion: '',
        estado_institucion_temporal: 0,
        periodo_id: null,
        estadoNumerico: 0
      }

      this.opciones = {
        presentacion: false,
        entrega_muestras: false,
        reunion: false,
        seguimiento: false,
        cierre: false,
        cobranza: false,
        post_venta: false,
        retiro_cartas: false,
        retiro_muestras: false,
        capacitacion: false,
        otraEditorial: false,
        editorial: ''
      }

      this.instituciones = []
      this.busquedaInstitucion = ''
      this.tipoInstitucion = 'normal'
      this.institucionSeleccionada = false
    },

    // BUSCAR INSTITUCIONES REGISTRADAS
    buscarInstituciones: async function () {
      if (this.busquedaInstitucion.length < 5) {
        this.$vs.notify({
          title: 'Validación',
          text: 'Debe escribir al menos 5 caracteres para buscar',
          color: 'warning'
        })
        return
      }

      this.$vs.loading({ text: 'Buscando instituciones...' })

      try {
        var url = this.$server_url + 'listaInsitucionAsesor?busqueda=' + this.busquedaInstitucion + '&todasInstituciones=yes'
        var response = await this.$http.get(url)
        // console.log('Respuesta búsqueda instituciones:', response.data)
        if (response.data.length > 0) {
          this.instituciones = response.data.map(function (inst) {
            var nombreAsesor = ''
            if (inst.nombre_asesor) {
              nombreAsesor = inst.nombre_asesor
              if (inst.apellido_asesor) {
                nombreAsesor += ' ' + inst.apellido_asesor
              }
            }
            return {
              id: inst.idInstitucion,
              nombre: inst.nombreInstitucion,
              ciudad: inst.ciudad || 'Sin ciudad',
              nombre_asesor: nombreAsesor || 'Sin asesor',
              tipo: 'normal'
            }
          })
        } else {
          this.instituciones = []
          this.$vs.notify({
            title: 'Información',
            text: 'No se encontraron instituciones',
            color: 'primary'
          })
        }
      } catch (error) {
        console.error('Error:', error)
        this.$vs.notify({
          title: 'Error',
          text: 'Error al buscar instituciones',
          color: 'danger'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    // CARGAR INSTITUCIONES TEMPORALES
    cargarTemporales: async function () {
      this.$vs.loading({ text: 'Cargando instituciones temporales...' })

      try {
        var usuarioId = this.usuario.idusuario || this.usuario.id
        var url = this.$server_url + 'listaInsitucionAsesor?temporales=yes&asesor_id=' + usuarioId
        var response = await this.$http.get(url)

        if (response.data && response.data.length > 0) {
          // Mapear los datos a institucionesTemporales (no a instituciones)
          this.institucionesTemporales = response.data.map(function (inst) {
            return {
              id: inst.institucion_temporal_id,
              nombre: inst.nombreInstitucion || inst.nombre_institucion || 'Sin nombre',
              ciudad: inst.ciudad || 'Sin ciudad',
              periodo_id: inst.periodo_id,
              tipo: 'temporal'
            }
          })

          // Copiar a filtradas para mostrar todas inicialmente
          this.institucionesTemporalesFiltradas = [...this.institucionesTemporales]
          this.institucionesTemporalesCargadas = true

          // Mostrar notificación con el total encontrado
          this.$vs.notify({
            title: 'Información',
            text: `Se encontraron ${this.institucionesTemporales.length} instituciones temporales`,
            color: 'success',
            time: 3000
          })
        } else {
          this.institucionesTemporales = []
          this.institucionesTemporalesFiltradas = []
          this.institucionesTemporalesCargadas = true

          this.$vs.notify({
            title: 'Información',
            text: 'No tiene instituciones temporales creadas',
            color: 'primary'
          })
        }
      } catch (error) {
        console.error('Error:', error)
        this.institucionesTemporales = []
        this.institucionesTemporalesFiltradas = []

        this.$vs.notify({
          title: 'Error',
          text: 'Error al cargar instituciones temporales',
          color: 'danger'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    // SELECCIONAR INSTITUCIÓN
    seleccionarInstitucion: function (inst) {
      if (inst.tipo === 'normal') {
        this.formulario.institucion_id = inst.id
        this.formulario.institucion_id_temporal = null
        this.formulario.estado_institucion_temporal = 0
        this.formulario.nombre_institucion = inst.nombre
        this.formulario.periodo_id = null
      } else {
        this.formulario.institucion_id = null
        this.formulario.institucion_id_temporal = inst.id
        this.formulario.estado_institucion_temporal = 1
        this.formulario.nombre_institucion = inst.nombre
        this.formulario.periodo_id = inst.periodo_id || null
      }

      this.institucionSeleccionada = true
      this.instituciones = []
      this.busquedaInstitucion = ''

      this.$vs.notify({
        title: 'Éxito',
        text: 'Institución seleccionada correctamente',
        color: 'success'
      })
    },

    filtrarTemporales: function () {
      if (!this.busquedaTemporal.trim()) {
        this.institucionesTemporalesFiltradas = [...this.institucionesTemporales]
        return
      }

      const busqueda = this.busquedaTemporal.toLowerCase().trim()
      this.institucionesTemporalesFiltradas = this.institucionesTemporales.filter(inst =>
        inst.nombre.toLowerCase().includes(busqueda) ||
        (inst.ciudad && inst.ciudad.toLowerCase().includes(busqueda))
      )
    },

    seleccionarInstitucionTemporal: function (institucion) {
      this.formulario.institucion_id = null
      this.formulario.institucion_id_temporal = institucion.id
      this.formulario.nombre_institucion = institucion.nombre
      this.formulario.estado_institucion_temporal = 1
      this.formulario.periodo_id = institucion.periodo_id

      this.institucionSeleccionada = true
      this.institucionesTemporales = []
      this.institucionesTemporalesFiltradas = []
      this.busquedaTemporal = ''
    },

    // Modificar limpiarInstitucion para manejar temporales también
    limpiarInstitucion: function () {
      this.formulario.institucion_id = null
      this.formulario.institucion_id_temporal = null
      this.formulario.nombre_institucion = ''
      this.formulario.estado_institucion_temporal = 0
      this.institucionSeleccionada = false
      this.instituciones = []
      this.institucionesTemporales = []
      this.institucionesTemporalesFiltradas = []
      this.busquedaTemporal = ''
      this.busquedaInstitucion = ''
    },

    // MODAL TEMPORAL
    abrirModalTemporal: function () {
      this.institucionTemporal = {
        nombre: '',
        ciudad: null,
        region: '2',
        periodo: null
      }
      this.cargarPeriodos();
      this.cargarCiudades();
      this.mostrarFormularioTemporal = true
    },

    cerrarModalTemporal: function () {
      this.mostrarFormularioTemporal = false
    },

    // CARGAR CIUDADES
    cargarCiudades: async function () {
      try {
        var response = await this.$http.get(this.$server_url + 'ciudad')
        this.arregloCiudades = response.data
      } catch (error) {
        console.error('Error cargando ciudades:', error)
      }
    },

    // CARGAR PERÍODOS
    cargarPeriodos: async function () {
      try {
        var response = await this.$http.get(this.$server_url + 'get_periodos_pedidos')
        var self = this
        this.arregloPeriodos = response.data
          .filter(function (p) {
            return p.estado == 1 && p.region_idregion == self.institucionTemporal.region
          })
          .map(function (p) {
            return { id: p.idperiodoescolar, nombre: p.periodoescolar }
          })
      } catch (error) {
        console.error('Error cargando periodos:', error)
      }
    },

    // CREAR INSTITUCIÓN TEMPORAL
    crearInstitucionTemporal: async function () {
      if (!this.institucionTemporal.nombre || this.institucionTemporal.nombre.trim() === '') {
        this.$vs.notify({ title: 'Validación', text: 'El nombre es obligatorio', color: 'warning' })
        return
      }
      if (!this.institucionTemporal.ciudad) {
        this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar una ciudad', color: 'warning' })
        return
      }
      if (!this.institucionTemporal.periodo) {
        this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar un periodo', color: 'warning' })
        return
      }

      this.$vs.loading({ text: 'Creando institución temporal...' })

      try {
        var formData = new FormData()
        formData.append('nombre_institucion', this.institucionTemporal.nombre)
        formData.append('ciudad', this.institucionTemporal.ciudad.nombre)
        formData.append('region', this.institucionTemporal.region)
        formData.append('periodo', this.institucionTemporal.periodo)
        formData.append('asesor_id', this.usuario.idusuario || this.usuario.id)

        var response = await this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)

        if (response.data.status === 0) {
          this.$vs.notify({ title: 'Advertencia', text: response.data.message, color: 'warning' })
          return
        }

        this.formulario.institucion_id = null
        this.formulario.institucion_id_temporal = response.data.institucion_temporal_id
        this.formulario.estado_institucion_temporal = 1
        this.formulario.nombre_institucion = this.institucionTemporal.nombre
        this.formulario.periodo_id = response.data.periodo_id

        this.institucionSeleccionada = true
        this.cerrarModalTemporal()

        this.$vs.notify({ title: 'Éxito', text: 'Institución temporal creada exitosamente', color: 'success' })
      } catch (error) {
        console.error('Error:', error)
        this.$vs.notify({ title: 'Error', text: 'Error al crear institución temporal', color: 'danger' })
      } finally {
        this.$vs.loading.close()
      }
    },

    // GUARDAR PLANIFICACIÓN
    guardar: function () {
      if (!this.validarFormulario()) return

      var formData = new FormData()

      if (this.modoEdicion) {
        if (!this.formulario.id) {
          this.$vs.notify({
            title: 'Error',
            text: 'No se puede actualizar: ID de planificación no encontrado',
            color: 'danger'
          })
          return
        }
        formData.append('usuario_editor', (this.usuario && this.usuario.idusuario) ? this.usuario.idusuario : (this.usuario && this.usuario.id) ? this.usuario.id : '')
        formData.append('_method', 'PUT')
      }

      formData.append('title', this.formulario.titulo)
      formData.append('startDate', this.formulario.fecha)
      formData.append('hora_inicio', this.formulario.hora)
      formData.append('hora_fin', this.formulario.hora)
      formData.append('endDate', this.formulario.fecha)
      formData.append('url', this.formulario.descripcion || '')
      formData.append('usuario_creador', (this.usuario && this.usuario.idusuario) ? this.usuario.idusuario : (this.usuario && this.usuario.id) ? this.usuario.id : '')
      formData.append('estado', this.formulario.estadoNumerico || 0)

      // Opciones sin editorial
      var opcionesSinEditorial = Object.assign({}, this.opciones)
      delete opcionesSinEditorial.editorial
      formData.append('opciones', JSON.stringify(opcionesSinEditorial))

      if (this.opciones.otraEditorial && this.opciones.editorial) {
        formData.append('nombre_editorial', this.opciones.editorial)
      }

      if (this.formulario.institucion_id) {
        formData.append('institucion_id', this.formulario.institucion_id)
        formData.append('estado_institucion_temporal', '0')
      }
      if (this.formulario.institucion_id_temporal) {
        formData.append('institucion_id_temporal', this.formulario.institucion_id_temporal)
        formData.append('nombre_institucion_temporal', this.formulario.nombre_institucion)
        formData.append('estado_institucion_temporal', '1')
      }
      if (this.formulario.periodo_id) {
        formData.append('periodo_id', this.formulario.periodo_id)
      }

      this.$emit('save', {
        formData: formData,
        id: this.modoEdicion ? this.formulario.id : null
      })
      console.log('this.formulario.id:', this.formulario.id, this.modoEdicion)
      this.$emit('guardar_en_visitasAdmin', {
        formData: formData,
        id: this.modoEdicion ? this.formulario.id : null
      })
    },

    // VALIDAR FORMULARIO
    validarFormulario: function () {
      if (!this.formulario.institucion_id && !this.formulario.institucion_id_temporal) {
        this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar una institución', color: 'warning' })
        return false
      }
      if (!this.formulario.titulo || this.formulario.titulo.trim() === '') {
        this.$vs.notify({ title: 'Validación', text: 'El título es obligatorio', color: 'warning' })
        return false
      }
      if (!this.formulario.fecha || !this.formulario.hora) {
        this.$vs.notify({ title: 'Validación', text: 'Fecha y hora son obligatorias', color: 'warning' })
        return false
      }

      // Validar que al menos una opción esté seleccionada
      var self = this
      var opcionesSeleccionadas = Object.keys(this.opciones).some(function (key) {
        return key !== 'editorial' && self.opciones[key] === true
      })

      if (!opcionesSeleccionadas) {
        this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar al menos una opción', color: 'warning' })
        return false
      }

      if (this.opciones.otraEditorial && (!this.opciones.editorial || this.opciones.editorial.trim() === '')) {
        this.$vs.notify({ title: 'Validación', text: 'Debe escribir el nombre de la editorial', color: 'warning' })
        return false
      }

      return true
    }
  }
}
</script>

<style scoped>
.popup-body {
  padding: 0.5rem 0;
}

.form-section {
  margin-bottom: 1rem;
}

.section-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.375rem;
}

.opciones-subtitulo {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input:read-only,
.form-textarea:read-only {
  background: #f8fafc;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.half {
  flex: 1;
}

/* Botones de tipo institución */
.inst-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.inst-btn {
  flex: 1;
}

.search-box {
  margin-top: 0.5rem;
}

.temporal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Lista de instituciones */
.instituciones-list {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-top: 0.75rem;
  background: white;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.btn-close-list {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  line-height: 1;
}

.institucion-item {
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s;
}

.institucion-item:last-child {
  border-bottom: none;
}

.institucion-item:hover {
  background: #f0f9ff;
}

.inst-nombre {
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
}

.inst-ciudad {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.125rem;
}

/* Institución seleccionada */
.institucion-seleccionada {
  margin-top: 0.5rem;
}

.selected-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
}

.selected-info {
  display: flex;
  flex-direction: column;
}

.selected-label {
  font-size: 0.7rem;
  color: #059669;
  font-weight: 600;
  text-transform: uppercase;
}

.selected-name {
  font-weight: 600;
  color: #064e3b;
  font-size: 0.9rem;
}

.selected-type {
  font-size: 0.7rem;
  color: #047857;
}

.btn-remove {
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  background: white;
  color: #dc2626;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
}

.btn-remove:hover {
  background: #fecaca;
  transform: rotate(90deg);
}

/* Grid de opciones */
.opciones-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.checkbox-label:hover {
  border-color: #93c5fd;
  background: #f8fafc;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
}

.checkbox-label span {
  color: #334155;
  font-weight: 500;
}

.checkbox-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editorial-input {
  margin-top: 0.75rem;
}

/* Botones */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Popup temporal */
.popup-body-temporal {
  padding: 0.5rem 0;
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .opciones-grid {
    grid-template-columns: 1fr;
  }
}
</style>