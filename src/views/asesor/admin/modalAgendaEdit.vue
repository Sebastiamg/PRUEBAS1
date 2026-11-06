<template>
    <vs-popup class="popup-planificacion" :title="(modoEdicionLocal ? 'Editar' : 'Nueva') + ' Planificación'"
        :active.sync="modalVisible" @close="cerrarModal">
        <div v-if="planificacionInterna || !modoEdicionLocal" class="popup-body">

            <!-- INSTITUCIÓN -->
            <div class="form-section">
                <label class="section-title">Institución *</label>

                <div v-if="!formulario.institucion_id && !formulario.institucion_id_temporal">
                    <!-- Botones de tipo de institución -->
                    <div class="inst-buttons">
                        <vs-button @click="tipoInstitucion = 'normal'"
                            :color="tipoInstitucion === 'normal' ? 'primary' : 'dark'"
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
                            placeholder="Buscar institución (mín. 5 caracteres)..."
                            @keyup.enter="buscarInstituciones" />
                        <vs-button @click="buscarInstituciones" color="primary" size="small" style="margin-top:8px;">
                            Buscar
                        </vs-button>
                    </div>

                    <!-- Acciones para temporales -->
                    <div v-if="tipoInstitucion === 'temporal'" class="temporal-actions">
                        <vs-button @click="abrirModalTemporal" color="success" type="border" size="small"
                            style="width:100%;">
                            + Nueva Temporal
                        </vs-button>
                        <vs-button @click="cargarTemporales" color="primary" type="border" size="small"
                            style="width:100%;">
                            Mis Temporales
                        </vs-button>
                    </div>

                    <!-- Resultados de búsqueda -->
                    <div v-if="instituciones.length > 0" class="instituciones-list">
                        <div class="list-header">
                            <span>{{ instituciones.length }} instituciones encontradas</span>
                            <button @click="limpiarInstitucion" class="btn-remove">×</button>
                        </div>
                        <div v-for="inst in instituciones" :key="inst.id" @click="seleccionarInstitucion(inst)"
                            class="institucion-item">
                            <div class="inst-nombre">{{ inst.nombre }}</div>
                            <div class="inst-ciudad" v-if="inst.ciudad">{{ inst.ciudad }}</div>
                        </div>
                    </div>
                </div>

                <!-- Institución seleccionada -->
                <div v-else class="institucion-seleccionada">
                    <div class="selected-card">
                        <div class="selected-info">
                            <span class="selected-label">Institución:</span>
                            <span class="selected-name">{{ formulario.nombre_institucion }}</span>
                            <span class="selected-type"
                                v-if="formulario.estado_institucion_temporal === 1">(Temporal)</span>
                        </div>
                        <button @click="limpiarInstitucion" class="btn-remove"
                            v-if="!planificacionFinalizada">×</button>
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
                <textarea v-model="formulario.descripcion"
                    placeholder="Observaciones adicionales de la visita (opcional)" class="form-textarea"
                    rows="3"></textarea>
            </div>

            <!-- FECHA / HORA -->
            <div class="form-row">
                <div class="form-section half">
                    <label class="section-title">Fecha *</label>
                    <input type="date" v-model="formulario.fecha" class="form-input"
                        :readonly="planificacionFinalizada || esRegistrada" />
                </div>
                <div class="form-section half">
                    <label class="section-title">Hora *</label>
                    <input type="time" v-model="formulario.hora" class="form-input"
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
                        <input type="checkbox" v-model="opciones[op.key]"
                            :disabled="planificacionFinalizada || esRegistrada" />
                        <span>{{ op.nombre }}</span>
                    </label>
                </div>

                <div v-if="opciones.otraEditorial" class="editorial-input">
                    <label class="section-title">Nombre de la Editorial *</label>
                    <input type="text" v-model="opciones.editorial" class="form-input"
                        placeholder="Escriba la editorial" :readonly="planificacionFinalizada || esRegistrada" />
                </div>
            </div>
            <!-- SECCIÓN DE UBICACIÓN DEL ASESOR -->
            <div v-if="planificacionInterna && (latitudInicio || latitudFin)" class="ubicacion-section">

                <div v-if="formulario.id && (latitudInicio || latitudFin)" class="ubicacion-section">
                    <vs-divider color="primary">📍 Ubicación del Asesor</vs-divider>

                    <!-- Ubicación de Inicio -->
                    <div v-if="latitudInicio && longitudInicio" class="mb-4">
                        <div class="ubicacion-titulo">
                            <i class="fa fa-play-circle text-green-500"></i>
                            <h4>Inicio de Visita</h4>
                            <span class="badge" :class="getUbicacionInicioClase()">
                                {{ getUbicacionInicioTexto() }}
                            </span>
                        </div>

                        <div class="mapa-container">
                            <iframe
                                :src="`https://maps.google.com/maps?q=${latitudInicio},${longitudInicio}&z=16&output=embed`"
                                width="100%" height="250" frameborder="0" style="border:0;" allowfullscreen=""
                                loading="lazy">
                            </iframe>
                        </div>

                        <div class="coordenadas-info">
                            <p><i class="fa fa-map-marker"></i> <strong>Latitud:</strong> <span>{{ latitudInicio
                                    }}</span>
                            </p>
                            <p><i class="fa fa-map-marker"></i> <strong>Longitud:</strong> <span>{{ longitudInicio
                                    }}</span>
                            </p>
                            <p v-if="fechaCapturaLongitud"><i class="fa fa-calendar"></i> <strong>Fecha/Hora:</strong>
                                <span>{{ formatearFechaHora(fechaCapturaLongitud) }}</span>
                            </p>
                        </div>

                        <div class="acciones-mapa">
                            <vs-button size="small" color="primary" type="border" icon="open_in_new"
                                @click="verEnGoogleMaps(latitudInicio, longitudInicio)">
                                Ver en Google Maps
                            </vs-button>
                        </div>

                        <!-- Comparación de distancia con la institución -->
                        <div v-if="planificacion.latitud_institucion && planificacion.longitud_institucion"
                            class="comparacion-ubicacion" :class="getComparacionInicioClase()">
                            <i :class="getComparacionInicioIcono()"></i>
                            {{ getComparacionInicioTexto() }}
                        </div>
                    </div>

                    <!-- Ubicación de Fin -->
                    <div v-if="latitudFin && longitudFin" class="mt-4">
                        <div class="ubicacion-titulo">
                            <i class="fa fa-stop-circle text-red-500"></i>
                            <h4>Fin de Visita</h4>
                            <span class="badge" :class="getUbicacionFinClase()">
                                {{ getUbicacionFinTexto() }}
                            </span>
                        </div>

                        <div class="mapa-container">
                            <iframe
                                :src="`https://maps.google.com/maps?q=${latitudFin},${longitudFin}&z=16&output=embed`"
                                width="100%" height="250" frameborder="0" style="border:0;" allowfullscreen=""
                                loading="lazy">
                            </iframe>
                        </div>

                        <div class="coordenadas-info">
                            <p><i class="fa fa-map-marker"></i> <strong>Latitud:</strong> <span>{{ latitudFin }}</span>
                            </p>
                            <p><i class="fa fa-map-marker"></i> <strong>Longitud:</strong> <span>{{ longitudFin
                                    }}</span>
                            </p>
                            <p v-if="fechaCapturaLongitudFin"><i class="fa fa-calendar"></i>
                                <strong>Fecha/Hora:</strong>
                                <span>{{ formatearFechaHora(fechaCapturaLongitudFin) }}</span>
                            </p>
                        </div>

                        <div class="acciones-mapa">
                            <vs-button size="small" color="primary" type="border" icon="open_in_new"
                                @click="verEnGoogleMaps(latitudFin, longitudFin)">
                                Ver en Google Maps
                            </vs-button>
                        </div>

                        <!-- Comparación de distancia con la institución -->
                        <div v-if="planificacion.latitud_institucion && planificacion.longitud_institucion"
                            class="comparacion-ubicacion" :class="getComparacionFinClase()">
                            <i :class="getComparacionFinIcono()"></i>
                            {{ getComparacionFinTexto() }}
                        </div>

                        <!-- Calcular tiempo entre inicio y fin -->
                        <div v-if="fechaCapturaLongitud && fechaCapturaLongitudFin" class="distancia-info">
                            <i class="fa fa-hourglass-half"></i>
                            <span>Tiempo de visita: {{ calcularTiempoVisita() }}</span>
                        </div>
                        <!-- Switch para Sello -->
                        <!-- Sello con Radio Buttons -->
                        <div class="sello-info">
                            <label style="display: flex; flex-direction: column; gap: 8px; margin: 10px 0;">
                                <span style="font-weight: 500;">
                                    <i class="fa fa-stamp"></i> ¿Tiene sello?:
                                </span>

                                <div style="display: flex; gap: 20px; align-items: center;">
                                    <label style="display: flex; align-items: center; gap: 5px;">
                                        <input type="radio" v-model="selloValue" :value="1">
                                        <span style="color: green;">✅ Con sello</span>
                                    </label>

                                    <label style="display: flex; align-items: center; gap: 5px;">
                                        <input type="radio" v-model="selloValue" :value="0">
                                        <span style="color: red;">❌ Sin sello</span>
                                    </label>

                                    <label style="display: flex; align-items: center; gap: 5px;">
                                        <input type="radio" v-model="selloValue" :value="null">
                                        <span style="color: gray;">⚪ No definido</span>
                                    </label>
                                </div>

                                <div style="font-size: 12px; margin-top: 5px;">
                                    <span v-if="selloValue === 1" style="color: green;">✓ Con sello</span>
                                    <span v-else-if="selloValue === 0" style="color: red;">✗ Sin sello</span>
                                    <span v-else style="color: gray;">◉ No definido (null)</span>
                                </div>
                            </label>
                        </div>

                        <!-- Switch para Finalizar Visita -->
                        <div class="finalizar-info" style="margin: 15px 0;">
                            <label style="display: flex; align-items: center; gap: 10px;">
                                <i class="fa fa-flag-checkered"></i>
                                <span style="font-weight: 500;">Finalizar Visita:</span>

                                <vs-switch v-model="finalizarSwitch" :color="finalizarSwitch ? 'success' : 'danger'">
                                    <template #on>
                                        ✅ Sí - Finalizar
                                    </template>
                                    <template #off>
                                        ⏸️ No
                                    </template>
                                </vs-switch>

                            </label>
                        </div>

                        <!-- Input para Observación Admin -->
                        <div class="observacion-admin-info">
                            <label style="display: flex; flex-direction: column; gap: 5px; margin: 10px 0;">
                                <span style="font-weight: 500;">
                                    <i class="fa fa-comment"></i> Observación Administrador:
                                </span>
                                <textarea v-model="observacionAdmin" rows="3" cols="50"
                                    placeholder="Ingrese observación del administrador..."
                                    style="padding: 8px; border-radius: 4px; border: 1px solid #ddd; font-family: inherit;">
        </textarea>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BOTONES -->
            <div class="form-actions">
                <vs-button @click="guardar" color="success" type="gradient" block>
                    {{ modoEdicionLocal ? 'Actualizar' : 'Guardar' }}
                </vs-button>
                <vs-button @click="cerrarModal" color="danger" type="border" block>
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
                    <input type="text" v-model="institucionTemporal.nombre"
                        placeholder="Ingrese el nombre de la institución" class="form-input" />
                </div>

                <div class="form-section">
                    <label class="section-title">Región *</label>
                    <select v-model="institucionTemporal.region" @change="cargarPeriodosTemporales" class="form-input">
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
import { PlanificacionesService } from '../planificaciones_agenda/planificacionesService.js'

export default {
    name: 'PlanificacionFormModal',

    props: {
        visible: {
            type: Boolean,
            default: false
        },
        planificacion: {
            type: Object,
            default: null
        },
        usuario: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            modalVisible: this.visible,
            modoEdicionLocal: false,
            latitudInicio: null,
            longitudInicio: null,
            latitudFin: null,
            longitudFin: null,
            fechaCapturaLongitud: null,
            fechaCapturaLongitudFin: null,
            distanciaInicio: null,
            distanciaFin: null,
            formulario: {
                id: null,
                titulo: '',
                descripcion: '',
                fecha: '',
                hora: '',
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
            planificacionInterna: null,
            selloValue: null, // null = no definido, true = con sello, false = sin sello
            observacionAdmin: '',
            esFinalizar: false,
            selloSwitch: null, // Puede ser null, true o false
            finalizarSwitch: false

        }
    },

    watch: {
        planificacion: {
            handler(val) {
                if (val && val.id) {
                    console.log('Planificación recibida en modal:', val)
                    console.log('Valor de sello desde backend:', val.sello)

                    // 👇 USAR selloValue (1, 0, null)
                    this.selloValue = val.sello === 1 ? 1 : (val.sello === 0 ? 0 : null)
                    this.observacionAdmin = val.observacionAdmin || ''
                    this.finalizarSwitch = val.estado === 4  // Si estado es 4, el switch debe estar en true
                    this.cargarPlanificacion()
                }
            },
            deep: true,
            immediate: true
        },
        visible: function (val) {
            this.modalVisible = val
            if (val && this.planificacion) {
                this.planificacionInterna = this.planificacion
                // 👇 USAR selloValue
                this.selloValue = this.planificacion.sello === 1 ? 1 : (this.planificacion.sello === 0 ? 0 : null)
                this.observacionAdmin = this.planificacion.observacionAdmin || ''
                this.cargarPlanificacion()
            } else if (val) {
                this.resetForm()
            } else {
                this.planificacionInterna = null
                this.selloValue = null
                this.finalizarSwitch = val.estado === 4  // Si estado es 4, el switch debe estar en true

                this.observacionAdmin = ''
            }
        }
    },

    computed: {
        planificacionFinalizada: function () {
            // if (!this.formulario.id) return false
            return this.formulario.estadoNumerico == 4
        },
        esRegistrada: function () {
            if (!this.formulario.id) return false
            return Number(this.formulario.estadoNumerico) === 1
        },
        planificacionesService() {
            return PlanificacionesService
        }
    },

    mounted() {
        this.cargarCiudades()
    },
    methods: {
        // ========== MÉTODOS DEL SERVICIO ==========
        getEstadoTexto(estado) {
            return PlanificacionesService.getEstadoTexto(estado)
        },

        getEstadoClase(estado) {
            return PlanificacionesService.getEstadoClase(estado)
        },

        getEstadoIcono(estado) {
            return PlanificacionesService.getEstadoIcono(estado)
        },

        getBadgeClase(estado) {
            return PlanificacionesService.getBadgeClase(estado)
        },
        cargarPlanificacion() {
            const plan = this.planificacion

            if (plan && plan.id) {
                this.modoEdicionLocal = true
            } else {
                this.modoEdicionLocal = false
                return
            }

            this.formulario = {
                id: plan.id || null,
                titulo: plan.title || plan.titulo || '',
                descripcion: plan.url || plan.descripcion || plan.observacionAsesor || '',
                fecha: plan.startDate ? plan.startDate.split(' ')[0] : (plan.fecha || ''),
                hora: plan.hora_inicio || plan.hora || '',
                institucion_id: plan.institucion_id || null,
                institucion_id_temporal: plan.institucion_id_temporal || null,
                nombre_institucion: plan.institucion || plan.nombre_institucion_temporal || '',
                estado_institucion_temporal: plan.estado_institucion_temporal || (plan.institucion_id_temporal ? 1 : 0),
                periodo_id: plan.periodo_id || null,
                estadoNumerico: parseInt(plan.estado) || plan.estadoNumerico || 0
            }

            // ⭐ Cargar coordenadas de ubicación (asegurar que existen en data)
            this.latitudInicio = plan.latitud_inicio || plan.latitud || null
            this.longitudInicio = plan.longitud_inicio || plan.longitud || null
            this.latitudFin = plan.latitud_fin || null
            this.longitudFin = plan.longitud_fin || null
            this.fechaCapturaLongitud = plan.fecha_captura_longitud || null
            this.fechaCapturaLongitudFin = plan.fecha_captura_longitud_fin || null

            // ⭐ Calcular distancias si hay coordenadas de institución
            if (this.latitudInicio && this.longitudInicio && plan.latitud_institucion && plan.longitud_institucion) {
                this.distanciaInicio = this.calcularDistanciaMetros(
                    this.latitudInicio, this.longitudInicio,
                    plan.latitud_institucion, plan.longitud_institucion
                )
            } else {
                this.distanciaInicio = null
            }

            if (this.latitudFin && this.longitudFin && plan.latitud_institucion && plan.longitud_institucion) {
                this.distanciaFin = this.calcularDistanciaMetros(
                    this.latitudFin, this.longitudFin,
                    plan.latitud_institucion, plan.longitud_institucion
                )
            } else {
                this.distanciaFin = null
            }

            // Cargar opciones
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

            this.institucionSeleccionada = !!(this.formulario.institucion_id || this.formulario.institucion_id_temporal || this.formulario.nombre_institucion)

            // ⭐ Forzar actualización de la interfaz
            this.$forceUpdate()
        },

        resetForm() {
            const ahora = new Date()
            this.modoEdicionLocal = false
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

        async buscarInstituciones() {
            if (this.busquedaInstitucion.length < 5) {
                this.$vs.notify({ title: 'Validación', text: 'Debe escribir al menos 5 caracteres para buscar', color: 'warning' })
                return
            }

            this.$vs.loading({ text: 'Buscando instituciones...' })

            try {
                const url = this.$server_url + 'listaInsitucionAsesor?busqueda=' + this.busquedaInstitucion + '&todasInstituciones=yes'
                const response = await this.$http.get(url)

                if (response.data.length > 0) {
                    this.instituciones = response.data.map(inst => ({
                        id: inst.idInstitucion,
                        nombre: inst.nombreInstitucion,
                        ciudad: inst.ciudad || 'Sin ciudad',
                        nombre_asesor: inst.nombre_asesor ? `${inst.nombre_asesor} ${inst.apellido_asesor || ''}` : 'Sin asesor',
                        tipo: 'normal'
                    }))
                } else {
                    this.instituciones = []
                    this.$vs.notify({ title: 'Información', text: 'No se encontraron instituciones', color: 'primary' })
                }
            } catch (error) {
                console.error('Error:', error)
                this.$vs.notify({ title: 'Error', text: 'Error al buscar instituciones', color: 'danger' })
            } finally {
                this.$vs.loading.close()
            }
        },

        async cargarTemporales() {
            this.$vs.loading({ text: 'Cargando instituciones temporales...' })

            try {
                const usuarioId = this.usuario.idusuario || this.usuario.id
                const url = this.$server_url + 'listaInsitucionAsesor?temporales=yes&asesor_id=' + usuarioId
                const response = await this.$http.get(url)

                if (response.data.length > 0) {
                    this.instituciones = response.data.map(inst => ({
                        id: inst.institucion_temporal_id,
                        nombre: inst.nombreInstitucion || inst.nombre_institucion || 'Sin nombre',
                        ciudad: inst.ciudad || 'Sin ciudad',
                        periodo_id: inst.periodo_id,
                        tipo: 'temporal'
                    }))
                } else {
                    this.instituciones = []
                    this.$vs.notify({ title: 'Información', text: 'No tiene instituciones temporales creadas', color: 'primary' })
                }
            } catch (error) {
                console.error('Error:', error)
                this.$vs.notify({ title: 'Error', text: 'Error al cargar instituciones temporales', color: 'danger' })
            } finally {
                this.$vs.loading.close()
            }
        },

        seleccionarInstitucion(inst) {
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

            this.$vs.notify({ title: 'Éxito', text: 'Institución seleccionada correctamente', color: 'success' })
        },

        limpiarInstitucion() {
            this.formulario.institucion_id = null
            this.formulario.institucion_id_temporal = null
            this.formulario.estado_institucion_temporal = 0
            this.formulario.nombre_institucion = ''
            this.formulario.periodo_id = null
            this.institucionSeleccionada = false
            this.instituciones = []
            this.busquedaInstitucion = ''
        },

        abrirModalTemporal() {
            this.institucionTemporal = {
                nombre: '',
                ciudad: null,
                region: '2',
                periodo: null
            }
            this.cargarPeriodosTemporales()
            this.mostrarFormularioTemporal = true
        },

        cerrarModalTemporal() {
            this.mostrarFormularioTemporal = false
        },

        async cargarCiudades() {
            try {
                const response = await this.$http.get(this.$server_url + 'ciudad')
                this.arregloCiudades = response.data
            } catch (error) {
                console.error('Error cargando ciudades:', error)
            }
        },

        async cargarPeriodosTemporales() {
            try {
                const response = await this.$http.get(this.$server_url + 'get_periodos_pedidos')
                this.arregloPeriodos = response.data
                    .filter(p => p.estado == 1 && p.region_idregion == this.institucionTemporal.region)
                    .map(p => ({ id: p.idperiodoescolar, nombre: p.periodoescolar }))
            } catch (error) {
                console.error('Error cargando periodos:', error)
            }
        },

        async crearInstitucionTemporal() {
            if (!this.institucionTemporal.nombre || this.institucionTemporal.nombre.trim() === '') {
                this.$vs.notify({ title: 'Validación', text: 'El nombre es obligatorio', color: 'warning' })
                return
            }
            if (!this.institucionTemporal.ciudad) {
                this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar una ciudad', color: 'warning' })
                return
            }
            if (!this.institucionTemporal.periodo) {
                this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar un período', color: 'warning' })
                return
            }

            this.$vs.loading({ text: 'Creando institución temporal...' })

            try {
                const formData = new FormData()
                formData.append('nombre_institucion', this.institucionTemporal.nombre)
                formData.append('ciudad', this.institucionTemporal.ciudad.nombre)
                formData.append('region', this.institucionTemporal.region)
                formData.append('periodo', this.institucionTemporal.periodo)
                formData.append('asesor_id', this.usuario.idusuario || this.usuario.id)

                const response = await this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)

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

        guardar() {
            if (this.formulario.estadoNumerico === 4) {
                this.$vs.notify({
                    title: 'Aviso',
                    text: 'No se puede modificar una visita finalizada',
                    color: 'warning'
                });
                this.modalVisible = false;
                this.$emit('close');  // 👈 Agregar esta línea

                return;
            }
            if (!this.validarFormulario()) return

            const formData = new FormData()

            // Obtener el ID del usuario actual
            const usuarioId = (this.usuario && this.usuario.idusuario) ? this.usuario.idusuario :
                (this.usuario && this.usuario.id) ? this.usuario.id : ''

            if (this.modoEdicionLocal) {
                if (!this.formulario.id) {
                    this.$vs.notify({ title: 'Error', text: 'No se puede actualizar: ID de planificación no encontrado', color: 'danger' })
                    return
                }
                formData.append('usuario_editor', usuarioId)
                formData.append('_method', 'PUT')
            }

            // Agregar sello (puede ser 1, 0 o null)
            if (this.selloValue !== null) {
                formData.append('sello', this.selloValue)
            } else {
                formData.append('sello', '') // Enviar vacío para que quede null en BD
            }

            // Agregar observación admin
            formData.append('observacionAdmin', this.observacionAdmin || '')

            // Agregar demás campos
            formData.append('title', this.formulario.titulo)
            formData.append('startDate', this.formulario.fecha)
            formData.append('hora_inicio', this.formulario.hora)
            formData.append('hora_fin', this.formulario.hora)
            formData.append('endDate', this.formulario.fecha)
            formData.append('url', this.formulario.descripcion || '')
            formData.append('usuario_creador', usuarioId)

            // CONTROL DE ESTADO: Si finalizarSwitch es true, estado = 4
            if (this.finalizarSwitch) {
                formData.append('estado', 4)  // Finalizada
                formData.append('usuario_finaliza', usuarioId)
                console.log('✅ Finalizando visita - Estado: 4, Usuario finaliza:', usuarioId)
            } else {
                // Conserva el estado actual
                formData.append('estado', this.formulario.estadoNumerico || 0)
                console.log('✅ Guardando visita - Conserva estado:', this.formulario.estadoNumerico || 0)
            }

            const opcionesSinEditorial = { ...this.opciones }
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

            this.$emit('guardar_en_visitasAdmin', {
                formData: formData,
                id: this.modoEdicionLocal ? this.formulario.id : null
            })

            // Resetear flags
            this.finalizarSwitch = false
            this.modalVisible = false
        },

        validarFormulario() {
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

            const opcionesSeleccionadas = Object.keys(this.opciones).some(key => key !== 'editorial' && this.opciones[key] === true)
            if (!opcionesSeleccionadas) {
                this.$vs.notify({ title: 'Validación', text: 'Debe seleccionar al menos una opción', color: 'warning' })
                return false
            }

            if (this.opciones.otraEditorial && (!this.opciones.editorial || this.opciones.editorial.trim() === '')) {
                this.$vs.notify({ title: 'Validación', text: 'Debe escribir el nombre de la editorial', color: 'warning' })
                return false
            }

            return true
        },
        calcularDistanciaMetros(lat1, lon1, lat2, lon2) {
            if (!lat1 || !lon1 || !lat2 || !lon2) return null

            const R = 6371000 // Radio de la Tierra en metros
            const phi1 = lat1 * Math.PI / 180
            const phi2 = lat2 * Math.PI / 180
            const deltaPhi = (lat2 - lat1) * Math.PI / 180
            const deltaLambda = (lon2 - lon1) * Math.PI / 180

            const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

            return Math.round(R * c)
        },

        formatearDistancia(metros) {
            if (!metros) return 'No disponible'
            if (metros >= 1000) return `${(metros / 1000).toFixed(2)} km`
            return `${metros} m`
        },

        formatearFechaHora(fecha) {
            if (!fecha) return 'No disponible'
            const date = new Date(fecha)
            return date.toLocaleString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        },

        verEnGoogleMaps(lat, lng) {
            if (lat && lng) {
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
            }
        },

        cerrarModal() {
            this.modalVisible = false
            this.planificacionInterna = null
            this.latitudInicio = null
            this.longitudInicio = null
            this.latitudFin = null
            this.longitudFin = null
            this.fechaCapturaLongitud = null
            this.fechaCapturaLongitudFin = null
            this.$emit('close')
        },

        getUbicacionInicioTexto() {
            if (!this.latitudInicio || !this.longitudInicio) return 'Sin registro'
            const plan = this.planificacion || {}
            if (plan.latitud_institucion && plan.longitud_institucion) {
                const distancia = this.calcularDistanciaMetros(
                    this.latitudInicio, this.longitudInicio,
                    plan.latitud_institucion, plan.longitud_institucion
                )
                if (distancia !== null && distancia <= 200) return 'En sitio'
                return 'Fuera de sitio'
            }
            return 'No validado'
        },

        getUbicacionInicioTexto() {
            if (!this.latitudInicio || !this.longitudInicio) return 'Sin registro'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return 'No validado'
            if (plan.latitud_institucion && plan.longitud_institucion) {
                const distancia = this.calcularDistanciaMetros(
                    this.latitudInicio, this.longitudInicio,
                    plan.latitud_institucion, plan.longitud_institucion
                )
                if (distancia !== null && distancia <= 200) return 'En sitio'
                return 'Fuera de sitio'
            }
            return 'No validado'
        },

        getUbicacionInicioClase() {
            if (!this.latitudInicio || !this.longitudInicio) return 'badge-secondary'
            const texto = this.getUbicacionInicioTexto()
            if (texto === 'En sitio') return 'badge-success'
            if (texto === 'Fuera de sitio') return 'badge-danger'
            return 'badge-warning'
        },

        getUbicacionFinTexto() {
            if (!this.latitudFin || !this.longitudFin) return 'Sin registro'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return 'No validado'
            if (plan.latitud_institucion && plan.longitud_institucion) {
                const distancia = this.calcularDistanciaMetros(
                    this.latitudFin, this.longitudFin,
                    plan.latitud_institucion, plan.longitud_institucion
                )
                if (distancia !== null && distancia <= 200) return 'En sitio'
                return 'Fuera de sitio'
            }
            return 'No validado'
        },

        getUbicacionFinClase() {
            if (!this.latitudFin || !this.longitudFin) return 'badge-secondary'
            const texto = this.getUbicacionFinTexto()
            if (texto === 'En sitio') return 'badge-success'
            if (texto === 'Fuera de sitio') return 'badge-danger'
            return 'badge-warning'
        },

        getComparacionInicioTexto() {
            if (!this.latitudInicio || !this.longitudInicio) return '📍 Sin coordenadas de inicio registradas'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return '📍 Información no disponible'
            if (!plan.latitud_institucion || !plan.longitud_institucion) {
                return '🏫 Institución sin coordenadas registradas'
            }
            const distancia = this.calcularDistanciaMetros(
                this.latitudInicio, this.longitudInicio,
                plan.latitud_institucion, plan.longitud_institucion
            )
            if (distancia !== null && distancia <= 200) return `✅ En sitio - Distancia: ${this.formatearDistancia(distancia)}`
            return `❌ Fuera de sitio - Distancia: ${this.formatearDistancia(distancia)}`
        },

        getComparacionInicioClase() {
            if (!this.latitudInicio || !this.longitudInicio) return 'sin-coordenadas'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return 'sin-coordenadas'
            if (!plan.latitud_institucion || !plan.longitud_institucion) return 'sin-coordenadas'
            const distancia = this.calcularDistanciaMetros(
                this.latitudInicio, this.longitudInicio,
                plan.latitud_institucion, plan.longitud_institucion
            )
            return (distancia !== null && distancia <= 200) ? 'en-sitio' : 'fuera-sitio'
        },

        getComparacionInicioIcono() {
            if (!this.latitudInicio || !this.longitudInicio) return 'fa fa-clock-o mr-2'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return 'fa fa-question-circle mr-2'
            if (!plan.latitud_institucion || !plan.longitud_institucion) return 'fa fa-building mr-2'
            const distancia = this.calcularDistanciaMetros(
                this.latitudInicio, this.longitudInicio,
                plan.latitud_institucion, plan.longitud_institucion
            )
            return (distancia !== null && distancia <= 200) ? 'fa fa-check-circle mr-2' : 'fa fa-exclamation-triangle mr-2'
        },

        getComparacionFinTexto() {
            if (!this.latitudFin || !this.longitudFin) return '📍 Sin coordenadas de fin registradas'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return '📍 Información no disponible'
            if (!plan.latitud_institucion || !plan.longitud_institucion) {
                return '🏫 Institución sin coordenadas registradas'
            }
            const distancia = this.calcularDistanciaMetros(
                this.latitudFin, this.longitudFin,
                plan.latitud_institucion, plan.longitud_institucion
            )
            if (distancia !== null && distancia <= 200) return `✅ En sitio - Distancia: ${this.formatearDistancia(distancia)}`
            return `❌ Fuera de sitio - Distancia: ${this.formatearDistancia(distancia)}`
        },

        getComparacionFinClase() {
            if (!this.latitudFin || !this.longitudFin) return 'sin-coordenadas'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return 'sin-coordenadas'
            if (!plan.latitud_institucion || !plan.longitud_institucion) return 'sin-coordenadas'
            const distancia = this.calcularDistanciaMetros(
                this.latitudFin, this.longitudFin,
                plan.latitud_institucion, plan.longitud_institucion
            )
            return (distancia !== null && distancia <= 200) ? 'en-sitio' : 'fuera-sitio'
        },

        getComparacionFinIcono() {
            if (!this.latitudFin || !this.longitudFin) return 'fa fa-clock-o mr-2'
            const plan = this.planificacionInterna || this.planificacion || {}
            if (!plan) return 'fa fa-question-circle mr-2'
            if (!plan.latitud_institucion || !plan.longitud_institucion) return 'fa fa-building mr-2'
            const distancia = this.calcularDistanciaMetros(
                this.latitudFin, this.longitudFin,
                plan.latitud_institucion, plan.longitud_institucion
            )
            return (distancia !== null && distancia <= 200) ? 'fa fa-check-circle mr-2' : 'fa fa-exclamation-triangle mr-2'
        },

        calcularTiempoVisita() {
            if (!this.fechaCapturaLongitud || !this.fechaCapturaLongitudFin) return 'No disponible'
            const inicio = new Date(this.fechaCapturaLongitud)
            const fin = new Date(this.fechaCapturaLongitudFin)
            const diffMs = fin - inicio
            if (diffMs <= 0) return 'Tiempo no válido'
            const horas = Math.floor(diffMs / (1000 * 60 * 60))
            const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
            if (horas > 0) return `${horas}h ${minutos}m`
            return `${minutos} minutos`
        },

    }
}
</script>
<style scoped>
/* Estilos para el modal de planificación */
.popup-planificacion>>>.vs-popup {
    max-width: 800px;
    width: 90%;
    border-radius: 16px;
}

.popup-planificacion>>>.vs-popup .vs-popup__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 16px 20px;
}

.popup-planificacion>>>.vs-popup .vs-popup__title {
    color: white;
    font-weight: 600;
}

.popup-planificacion>>>.vs-popup .vs-popup__close {
    color: white;
}

.popup-planificacion>>>.vs-popup .vs-popup__close:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
}

/* Sección de ubicación */
.ubicacion-section {
    margin: 20px 0;
    padding: 16px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.ubicacion-titulo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
}

.ubicacion-titulo i {
    font-size: 20px;
}

.ubicacion-titulo h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.ubicacion-titulo .badge {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: 8px;
}

.ubicacion-titulo .badge-success {
    background: #10b981;
    color: white;
}

.ubicacion-titulo .badge-warning {
    background: #f59e0b;
    color: white;
}

.ubicacion-titulo .badge-danger {
    background: #ef4444;
    color: white;
}

.ubicacion-titulo .badge-secondary {
    background: #64748b;
    color: white;
}

.mapa-container {
    margin: 12px 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mapa-container iframe {
    width: 100%;
    height: 250px;
    display: block;
}

.coordenadas-info {
    margin-top: 12px;
    padding: 12px;
    background: white;
    border-radius: 8px;
}

.coordenadas-info p {
    margin: 4px 0;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.coordenadas-info p i {
    width: 20px;
    color: #64748b;
}

.coordenadas-info p strong {
    color: #334155;
    min-width: 60px;
}

.coordenadas-info p span {
    color: #475569;
    font-family: monospace;
}

.acciones-mapa {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    justify-content: center;
}

.acciones-mapa .vs-button {
    font-size: 12px;
}

.distancia-info {
    margin-top: 12px;
    padding: 10px;
    background: #e0f2fe;
    border-radius: 8px;
    text-align: center;
}

.distancia-info i {
    color: #0284c7;
    margin-right: 8px;
}

.distancia-info span {
    font-size: 13px;
    font-weight: 500;
    color: #0369a1;
}

/* Comparación de ubicación */
.comparacion-ubicacion {
    margin-top: 12px;
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
}

.comparacion-ubicacion.en-sitio {
    background: #d1fae5;
    border-left: 4px solid #10b981;
    color: #065f46;
}

.comparacion-ubicacion.fuera-sitio {
    background: #fee2e2;
    border-left: 4px solid #ef4444;
    color: #991b1b;
}

.comparacion-ubicacion.sin-coordenadas {
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    color: #92400e;
}

/* Botones de acción */
.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

.form-actions button {
    flex: 1;
}

.form-actions .btn-finalizar {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
}

.form-actions .btn-finalizar:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
}

/* Popup body */
.popup-body {
    padding: 0.5rem 0;
}

/* Formulario */
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

/* Popup temporal */
.popup-body-temporal {
    padding: 0.5rem 0;
}

/* Responsive */
@media (max-width: 480px) {
    .form-row {
        flex-direction: column;
        gap: 0;
    }

    .opciones-grid {
        grid-template-columns: 1fr;
    }

    .mapa-container iframe {
        height: 200px;
    }

    .coordenadas-info p {
        flex-wrap: wrap;
    }

    .form-actions {
        flex-direction: column;
        gap: 8px;
    }
}
</style>