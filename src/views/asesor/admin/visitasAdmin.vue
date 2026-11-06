<template>
    <div class="m-3">
        <div class="header-section">
            <div class="header-title">
                <div class="icon-wrapper">
                    <i class="fa fa-address-book"></i>
                </div>
                <div>
                    <h2 class="title-text">Gestión de Visitas</h2>
                    <p class="subtitle-text">Administración de visitas de asesores</p>
                </div>
            </div>
        </div>

        <div class="filtros mt-4 mb-6">
            <div class="select-asesores">
                <label for="filtro-asesor" class="block text-sm font-medium text-gray-700">Asesor</label>
                <v-select id="filtro-asesor" v-model="filtroAsesor" :options="asesores"
                    :reduce="asesor => asesor.idusuario" label="nombres" placeholder="Seleccione un asesor"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            <div class="filter-item">
                <label class="input-label">
                    <i class="fa fa-calendar mr-2"></i>
                    Rango de fechas
                </label>
                <div class="date-range">
                    <flat-pickr :config="configdateTimePicker2" @input="onFechaInicioChange"
                        v-model="filtroVisitaInicio" placeholder="Fecha Desde" class="date-input" />
                    <span class="date-separator">-</span>
                    <flat-pickr :config="configdateTimePicker2" @input="onFechaFinChange" v-model="filtroVisitaFin"
                        placeholder="Fecha Hasta" class="date-input" />
                    <vx-tooltip text="Limpiar fechas" position="top">
                        <vs-button radius color="danger" @click="limpiarFechas()" type="border" icon-pack="feather"
                            icon="icon-x" size="small">
                        </vs-button>
                    </vx-tooltip>
                    <vx-tooltip text="Este mes" position="top">
                        <vs-button radius color="primary" @click="seleccionarMesActual()" type="border"
                            icon-pack="feather" icon="icon-calendar" size="small">
                        </vs-button>
                    </vx-tooltip>
                </div>
            </div>
        </div>

        <div class="tabla-contenido">
            <div class="bg-white shadow rounded-lg p-6">
                <p class="text-gray-600 mb-4">Cantidad: {{ visitas ? visitas.length : 0 }}</p>

                <!-- Tabla cuando hay datos -->
                <vs-table v-if="visitas && visitas.length > 0" search :data="visitas" multiple pagination
                    max-items="100" class="w-full text-left" v-model="visitaSelected">
                    <template slot="header">
                        <div class="flex justify-between items-center w-full px-4 py-2">
                            <div class="flex gap-2">
                                <vs-button color="success" size="small" @click="exportarAExcel">
                                    <i class="fa fa-file-excel-o mr-1"></i>
                                    Exportar a Excel
                                </vs-button>
                            </div>
                        </div>
                    </template>

                    <template slot="thead">
                        <vs-th width="25%">Institución</vs-th>
                        <vs-th width="35%">Datos</vs-th>
                        <vs-th width="25%">Observaciones</vs-th>
                        <vs-th width="15%">Acciones</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="tr.institucion">
                                <div class="py-2">
                                    <p class="font-bold text-sm">#{{ tr.id }}</p>
                                    <p class="text-sm">{{ tr.title || 'Sin título' }}</p>
                                    <div class="flex items-center gap-1 mt-1">
                                        <vx-tooltip v-if="tr.tipo_institucion === 'Temporal'"
                                            text="Institución registrada temporalmente" position="top">
                                            <span
                                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xl">
                                                <i class="fa-solid fa-bookmark bg-red-100 text-red-800"></i>
                                            </span>
                                        </vx-tooltip>

                                        <span class="text-sm font-medium">{{ tr.institucion }}</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">
                                        Lat: {{ tr.latitud_institucion || 'N/A' }} | Lon: {{ tr.longitud_institucion ||
                                            'N/A' }}
                                    </p>
                                    <p class="text-sm mt-1">{{ tr.vendedor }}</p>
                                    <div class="mt-2">
                                        <span :class="getBadgeClase(tr.estado)"
                                            class="px-2 py-1 rounded text-xs inline-flex items-center gap-1">
                                            <i :class="getEstadoIcono(tr.estado)" class="fa"></i>
                                            {{ getEstadoTexto(tr.estado) }}
                                        </span>
                                    </div>
                                </div>
                            </vs-td>

                            <vs-td :data="tr.fecha">
                                <div class="py-2">
                                    <p class="text-sm"><strong>📅 Visita:</strong><br />{{ tr.fecha || 'No registrada'
                                    }}</p>

                                    <p v-if="tr.fecha_captura_longitud" class="text-primary mt-2 text-sm">
                                        <strong>▶️ Inicio visita:</strong><br />
                                        <span>{{ formatearFechaHora(tr.fecha_captura_longitud) }}</span>
                                    </p>

                                    <p v-if="tr.fecha_captura_longitud_fin" class="text-primary mt-2 text-sm">
                                        <strong>⏹️ Fin visita:</strong><br />
                                        <span>{{ formatearFechaHora(tr.fecha_captura_longitud_fin) }}</span>
                                    </p>

                                    <div v-if="tr.latitud_fin" class="mt-2">
                                        <strong class="text-sm">📍 Ubicación obtenida</strong>
                                    </div>

                                    <!-- COMPARACIÓN DE COORDENADAS -->
                                    <div class="comparacion mt-2">
                                        <!-- Verificar si la escuela tiene coordenadas -->
                                        <template
                                            v-if="!tr.latitud_institucion || !tr.longitud_institucion || (tr.latitud_institucion === 0 && tr.longitud_institucion === 0)">
                                            <div class="bg-gray-100 border border-gray-400 rounded-lg p-2">
                                                <div class="flex items-center gap-2">
                                                    <i class="fa fa-building text-gray-600"></i>
                                                    <strong class="text-gray-700">🏫 ESCUELA SIN COORDENADAS</strong>
                                                </div>

                                            </div>
                                        </template>

                                        <!-- Si la escuela tiene coordenadas, proceder con la validación -->
                                        <template v-else>
                                            <!-- Cuando hay inicio y fin registrados -->
                                            <template
                                                v-if="tr.latitud_inicio && tr.longitud_inicio && tr.latitud_fin && tr.longitud_fin">
                                                <!-- Calcular distancias -->
                                                <template
                                                    v-if="calcularDistanciaMetros(tr.latitud_inicio, tr.longitud_inicio, tr.latitud_institucion, tr.longitud_institucion) <= 200 ||
                                                        calcularDistanciaMetros(tr.latitud_fin, tr.longitud_fin, tr.latitud_institucion, tr.longitud_institucion) <= 200">
                                                    <div class="bg-green-100 border border-green-400 rounded-lg p-2">
                                                        <div class="flex items-center gap-2">
                                                            <i class="fa fa-check-circle text-green-600"></i>
                                                            <strong class="text-green-700">📍 EN SITIO</strong>
                                                        </div>
                                                        <p class="text-xs text-green-600 mt-1">
                                                            El asesor estuvo dentro del rango de tolerancia (≤200m)
                                                        </p>
                                                        <!-- Mostrar distancias específicas -->
                                                        <div class="text-xs text-green-600 mt-1">
                                                            <div
                                                                v-if="calcularDistanciaMetros(tr.latitud_inicio, tr.longitud_inicio, tr.latitud_institucion, tr.longitud_institucion) <= 200">
                                                                🟢 Inicio: a {{
                                                                    formatearDistancia(calcularDistanciaMetros(tr.latitud_inicio,
                                                                        tr.longitud_inicio, tr.latitud_institucion,
                                                                        tr.longitud_institucion)) }}
                                                            </div>
                                                            <div
                                                                v-if="calcularDistanciaMetros(tr.latitud_fin, tr.longitud_fin, tr.latitud_institucion, tr.longitud_institucion) <= 200">
                                                                🟢 Fin: a {{
                                                                    formatearDistancia(calcularDistanciaMetros(tr.latitud_fin,
                                                                        tr.longitud_fin, tr.latitud_institucion,
                                                                        tr.longitud_institucion)) }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- Fuera del rango de tolerancia -->
                                                <template v-else>
                                                    <div class="bg-red-100 border border-red-400 rounded-lg p-2">
                                                        <div class="flex items-center gap-2">
                                                            <i class="fa fa-exclamation-triangle text-red-600"></i>
                                                            <strong class="text-red-700">⚠️ FUERA DE SITIO</strong>
                                                        </div>
                                                        <p class="text-xs text-red-600 mt-1">
                                                            El asesor estuvo fuera del rango de tolerancia (>200m)
                                                        </p>
                                                        <!-- Mostrar distancias -->
                                                        <div class="text-xs text-red-600 mt-1">
                                                            <div>
                                                                📍 Inicio: a {{
                                                                    formatearDistancia(calcularDistanciaMetros(tr.latitud_inicio,
                                                                        tr.longitud_inicio, tr.latitud_institucion,
                                                                        tr.longitud_institucion)) }}
                                                            </div>
                                                            <div class="mt-1">
                                                                📍 Fin: a {{
                                                                    formatearDistancia(calcularDistanciaMetros(tr.latitud_fin,
                                                                        tr.longitud_fin, tr.latitud_institucion,
                                                                        tr.longitud_institucion)) }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </template>

                                            <!-- Solo inicio registrado -->
                                            <template v-else-if="tr.latitud_inicio && tr.longitud_inicio">
                                                <div class="bg-yellow-100 border border-yellow-400 rounded-lg p-2">
                                                    <div class="flex items-center gap-2">
                                                        <i class="fa fa-hourglass-half text-yellow-600"></i>
                                                        <strong class="text-yellow-700">⏳ INCOMPLETO</strong>
                                                    </div>
                                                    <p class="text-xs text-yellow-600 mt-1">
                                                        Solo se registró el inicio de la visita
                                                    </p>
                                                    <div class="text-xs text-yellow-600 mt-1">
                                                        📍 Inicio: a {{
                                                            formatearDistancia(calcularDistanciaMetros(tr.latitud_inicio,
                                                                tr.longitud_inicio, tr.latitud_institucion,
                                                                tr.longitud_institucion)) }}
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Sin coordenadas del asesor -->
                                            <template v-else>
                                                <div class="bg-gray-100 border border-gray-400 rounded-lg p-2">
                                                    <div class="flex items-center gap-2">
                                                        <i class="fa fa-clock-o text-gray-600"></i>
                                                        <strong class="text-gray-700">⏳ SIN REGISTRO</strong>
                                                    </div>
                                                    <p class="text-xs text-gray-600 mt-1">
                                                        No se han registrado coordenadas de ubicación del asesor
                                                    </p>
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                    <!-- FIN COMPARACIÓN DE COORDENADAS -->

                                    <div v-if="tr.fecha_captura_longitud && tr.fecha_captura_longitud_fin"
                                        class="text-success mt-2">
                                        <p class="text-sm"><strong>⏱️ Tiempo:</strong></p>
                                        <p class="text-sm">{{ calcularHorasTrabajadas(tr.fecha_captura_longitud,
                                            tr.fecha_captura_longitud_fin) }}</p>
                                    </div>

                                    <p v-if="tr.editor_nombre" class="mt-2 text-sm">
                                        <strong>✏️ Editado por:</strong><br />
                                        {{ tr.editor_nombre }}
                                    </p>

                                    <p v-if="tr.finalizador_nombre" class="mt-2 text-sm">
                                        <strong>🏁 Finalizado por:</strong><br />
                                        {{ tr.finalizador_nombre }}
                                    </p>
                                </div>
                            </vs-td>

                            <vs-td :data="tr.observacionAsesor">
                                <div>
                                    <i v-if="tr.sello == 1" class="fas fa-check-circle" style="color: green;"></i>
                                    <i v-if="tr.sello == 0" class="fas fa-times-circle" style="color: red;"></i>
                                    {{ getSelloText(tr.sello) }}
                                </div>
                                <div class="py-2">
                                    <p v-if="tr.observacionAsesor" class="text-sm">
                                        <strong>👤 Asesor:</strong><br />
                                        {{ tr.observacionAsesor }}
                                    </p>
                                    <p v-if="tr.observacionAdmin" class="mt-2 text-sm">
                                        <strong>🛡️ Admin:</strong><br />
                                        {{ tr.observacionAdmin }}
                                    </p>
                                    <p v-if="!tr.observacionAsesor && !tr.observacionAdmin"
                                        class="text-sm text-gray-500">
                                        Sin observaciones
                                    </p>
                                </div>
                            </vs-td>

                            <vs-td>
                                <div class="flex gap-2">
                                    <!-- <vx-tooltip text="Ver detalles" position="top">
                                        <vs-button radius color="primary" @click="verDetalle(tr.id)" type="border"
                                            icon-pack="feather" icon="icon-eye" size="small" />
                                    </vx-tooltip> -->

                                    <vx-tooltip text="Editar" position="top">
                                        <vs-button radius color="warning" @click="editarVisita(tr)" type="border"
                                            icon-pack="feather" icon="icon-edit" size="small" />
                                    </vx-tooltip>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>

                    <template slot="empty">
                        <div class="text-center py-8 text-gray-500">
                            No hay visitas para mostrar
                        </div>
                    </template>
                </vs-table>

            </div>
        </div>
        <div class="editar-modal">
            <template>
                <modalAgendaEdit :visible="mostrarModalEdicion" :planificacion="planificacionSeleccionada"
                    :usuario="usuarioActual" @close="cerrarModalEdicion"
                    @guardar_en_visitasAdmin="guardarPlanificacion" />
            </template>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { PlanificacionesService } from '../planificaciones_agenda/planificacionesService.js';
import * as XLSX from 'xlsx';
import modalAgendaEdit from './modalAgendaEdit.vue';
export default {
    name: 'VisitasAdmin',
    components: {
        vSelect,
        flatPickr,
        modalAgendaEdit
    },
    data() {
        return {
            visitas: [],
            visitasOriginales: [],
            asesores: [],
            filtroAsesor: null,
            filtroVisitaInicio: null,
            filtroVisitaFin: null,
            configdateTimePicker2: {
                locale: Spanish,
                enableTime: false,
                dateFormat: 'Y-m-d',
                allowInput: true
            },
            visitaSelected: [],
            cargandoVisitas: false,
            search: '',
            mostrarModalEdicion: false,
            planificacionSeleccionada: null,
            usuarioActual: {
                idusuario: null,
                id: null,
                nombres: '',
                apellidos: ''
            }
        };
    },
    mounted() {
        this.obtenerUsuarioActual();
        this.f_inicio();
        this.inicializarFechasMesActual(); // Inicializar fechas al cargar
    },
    watch: {
        filtroAsesor() {
            if (this.filtroAsesor) {
                this.cargarVisitasApi(); // Ejecuta API cuando cambia el asesor
            }
        }
    },
    computed: {
        visitasFiltradas() {
            if (!this.search || this.search === '') {
                return this.visitas;
            }

            const searchLower = this.search.toLowerCase();
            return this.visitas.filter(visita => {
                return (
                    (visita.title && visita.title.toLowerCase().includes(searchLower)) ||
                    (visita.institucion && visita.institucion.toLowerCase().includes(searchLower)) ||
                    (visita.vendedor && visita.vendedor.toLowerCase().includes(searchLower)) ||
                    (visita.fecha && visita.fecha.includes(searchLower))
                );
            });
        }
    },
    methods: {


        getEstadoTexto(estado) {
            return PlanificacionesService.getEstadoTexto(estado);
        },

        getEstadoClase(estado) {
            return PlanificacionesService.getEstadoClase(estado);
        },

        getEstadoIcono(estado) {
            return PlanificacionesService.getEstadoIcono(estado);
        },

        getBadgeClase(estado) {
            const clases = {
                0: 'bg-yellow-100 text-yellow-800',
                1: 'bg-blue-100 text-blue-800',
                2: 'bg-red-100 text-red-800',
                3: 'bg-gray-100 text-gray-800',
                4: 'bg-green-100 text-green-800'
            };
            return clases[estado] || 'bg-gray-100 text-gray-800';
        },

        // También puedes exponer las constantes si las necesitas
        getEstadosConstantes() {
            return PlanificacionesService.ESTADOS;
        },
        // ========== FIN MÉTODOS DEL SERVICIO ==========
        f_inicio() {
            this.get_Asesores();
        },

        // Inicializar fechas del 1 al último día del mes actual
        inicializarFechasMesActual() {
            const hoy = new Date();
            const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

            this.filtroVisitaInicio = this.formatearFecha(primerDia);
            this.filtroVisitaFin = this.formatearFecha(ultimoDia);
        },

        async get_Asesores() {
            this.$vs.loading();

            try {
                const res = await this.$http.get(`${this.$server_url}listaAsesores`);
                if (res && res.data) {
                    this.asesores = res.data;
                    if (this.asesores.length === 0) {
                        this.$f_notificacion('No se encontraron asesores', 'warning', 'icon-alert-triangle');
                    }
                } else {
                    throw new Error('Respuesta inválida del servidor');
                }
            } catch (error) {
                console.error('Error al cargar asesores:', error);
                let mensaje = 'Error al cargar los asesores';
                if (error.response) {
                    mensaje += `: ${error.response.status} - ${error.response.statusText}`;
                } else if (error.request) {
                    mensaje += ': No se pudo conectar con el servidor';
                }
                this.$f_notificacion(mensaje, 'danger', 'icon-alert-circle');
            } finally {
                this.$vs.loading.close();
            }
        },

        // Selecciona el mes actual completo
        seleccionarMesActual() {
            const hoy = new Date();
            const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

            this.filtroVisitaInicio = this.formatearFecha(primerDia);
            this.filtroVisitaFin = this.formatearFecha(ultimoDia);

            if (this.filtroAsesor) {
                this.cargarVisitasApi(); // Ejecuta API al cambiar el mes
            }
        },

        // Cuando cambia fecha inicio
        onFechaInicioChange() {
            if (this.filtroVisitaInicio && this.filtroVisitaFin && this.filtroAsesor) {
                this.cargarVisitasApi();
            } else if (this.filtroVisitaInicio && this.filtroAsesor) {
                // Solo tiene fecha inicio, cargar desde esa fecha hasta ahora
                this.cargarVisitasApi();
            }
        },

        // Cuando cambia fecha fin
        onFechaFinChange() {
            if (this.filtroVisitaInicio && this.filtroVisitaFin && this.filtroAsesor) {
                this.cargarVisitasApi();
            }
        },

        // Cargar visitas desde API
        async cargarVisitasApi() {
            if (!this.filtroAsesor) {
                this.$f_notificacion('Seleccione un asesor', 'warning');
                return;
            }

            this.$vs.loading();

            try {
                const payload = {
                    asesor_id: this.filtroAsesor,
                    fecha_inicio: this.filtroVisitaInicio || null,
                    fecha_fin: this.filtroVisitaFin || null
                };

                const res = await this.$http.post(`${this.$server_url}get_seguimiento_visitas`, payload);

                console.log('===== DATOS RECIBIDOS DEL BACKEND =====');
                console.log(res.data);
                // Mapear los datos con TODOS los campos necesarios para el modal
                this.visitasOriginales = res.data.map(item => {
                    // Parsear opciones
                    let opcionesObj = {};


                    try {
                        if (item.opciones && typeof item.opciones === 'string') {
                            opcionesObj = JSON.parse(item.opciones);
                        } else if (item.opciones && typeof item.opciones === 'object') {
                            opcionesObj = item.opciones;
                        }

                    } catch (e) {
                        console.error('Error parsing opciones:', e);
                    }

                    return {
                        // Campos básicos
                        id: item.id,
                        title: item.title || 'Sin título',
                        institucion: item.institucion,
                        vendedor: item.vendedor,
                        fecha: item.fecha,
                        estado: parseInt(item.estado) || 0,

                        // Coordenadas
                        fecha_captura_longitud: item.fecha_captura_longitud,
                        fecha_captura_longitud_fin: item.fecha_captura_longitud_fin,
                        latitud_inicio: item.latitud_inicio,
                        longitud_inicio: item.longitud_inicio,
                        latitud_fin: item.latitud_fin,
                        longitud_fin: item.longitud_fin,

                        // Observaciones
                        observacionAsesor: item.observacionAsesor,
                        observacionAdmin: item.observacionAdmin,

                        // Usuarios
                        creador_nombre: item.creador_nombre,
                        editor_nombre: item.editor_nombre,
                        finalizador_nombre: item.finalizador_nombre,

                        // Datos de institución
                        latitud_institucion: item.latitud_institucion,
                        longitud_institucion: item.longitud_institucion,
                        tipo_institucion: item.tipo_institucion,

                        // DATOS PARA EL MODAL DE EDICIÓN
                        startDate: item.startDate || item.fecha,
                        hora_inicio: item.hora_inicio,
                        hora_fin: item.hora_fin,
                        url: item.url || item.observacionAsesor || '',
                        institucion_id: item.institucion_id,
                        institucion_id_temporal: item.institucion_id_temporal,
                        nombre_institucion_temporal: item.nombre_institucion_temporal,
                        estado_institucion_temporal: item.estado_institucion_temporal || 0,
                        // periodo_id: item.periodo_id,
                        opciones: opcionesObj,
                        sello: item.sello
                    };
                });

                this.visitas = [...this.visitasOriginales];

                if (this.visitas.length === 0) {
                    this.$f_notificacion('No hay visitas para el período seleccionado', 'info');
                }

            } catch (error) {
                console.error('Error al cargar visitas:', error);
                this.$f_notificacion('Error al cargar las visitas', 'danger');
                this.visitas = [];
                this.visitasOriginales = [];
            } finally {
                this.$vs.loading.close();
            }
        },
        verDetalle(id) {
            console.log('Ver detalle:', id);
        },

        obtenerUsuarioActual() {
            // Obtener del store o localStorage
            const user = JSON.parse(localStorage.getItem('usuario') || '{}')
            this.usuarioActual = {
                idusuario: user.idusuario || user.id,
                id: user.idusuario || user.id,
                nombres: user.nombres || '',
                apellidos: user.apellidos || ''
            }
        },

        editarVisita(item) {
            console.log('Editar visita:', item.id, this.mostrarModalEdicion, this.planificacionSeleccionada)
            // Crear una copia profunda del objeto
            this.planificacionSeleccionada = JSON.parse(JSON.stringify(item))
            this.mostrarModalEdicion = true
        },
        cerrarModalEdicion() {
            this.mostrarModalEdicion = false
            this.planificacionSeleccionada = null
            // Recargar visitas después de cerrar el modal
            if (this.filtroAsesor) {
                this.cargarVisitasApi()
            }
        },

        // Método para guardar planificación (adaptado para VisitasAdmin)
        async guardarPlanificacion(data) {
            console.log('=== GUARDAR PLANIFICACIÓN ===')
            console.log('Datos recibidos del modal:', data.formData)
            console.log('ID:', data.id)

            // Asegurar que tenemos el usuario actual
            if (!this.usuarioActual || !this.usuarioActual.idusuario) {
                this.obtenerUsuarioActual()
            }

            // ✅ CORREGIDO: sin optional chaining
            const usuarioId = this.usuarioActual && (this.usuarioActual.idusuario || this.usuarioActual.id)

            if (!usuarioId) {
                this.$f_notificacion('No se pudo identificar al usuario', 'danger')
                return
            }

            this.$vs.loading({ text: 'Guardando...' })

            try {
                const formData = data.formData

                // Agregar usuario creador/editor según sea edición o nueva
                if (data.id) {
                    // Es edición
                    formData.append('usuario_editor', usuarioId)
                    formData.append('_method', 'PUT')
                } else {
                    // Es nueva
                    formData.append('usuario_creador', usuarioId)
                    formData.append('id_usuario', usuarioId)
                    formData.append('estado', '0')
                }

                // Determinar URL
                const url = data.id
                    ? `${this.$server_url}agenda-planificacion/${data.id}`
                    : `${this.$server_url}agenda-planificacion`

                console.log('URL:', url)
                console.log('Usuario ID:', usuarioId)

                const response = await this.$http.post(url, formData)

                console.log('Respuesta:', response.data)

                if (response.data.success || response.data.status === '1') {
                    this.$f_notificacion(
                        `Planificación ${data.id ? 'actualizada' : 'creada'} correctamente`,
                        'success'
                    )
                    // Cerrar modal
                    this.cerrarModalEdicion()
                    // Recargar la lista de visitas
                    if (this.filtroAsesor) {
                        await this.cargarVisitasApi()
                    }
                } else {
                    this.$f_notificacion(response.data.message || 'Error al guardar', 'danger')
                }

            } catch (error) {
                console.error('Error guardando planificación:', error)
                let mensaje = 'Error al guardar la planificación'
                if (error.response && error.response.data && error.response.data.message) {
                    mensaje = error.response.data.message
                }
                this.$f_notificacion(mensaje, 'danger')
            } finally {
                this.$vs.loading.close()
            }
        },


        // Limpiar filtros de fecha
        limpiarFechas() {
            this.filtroVisitaInicio = null;
            this.filtroVisitaFin = null;
            if (this.filtroAsesor) {
                this.cargarVisitasApi(); // Ejecutar API sin filtros de fecha
            }
        },

        // Formatear fecha para backend y el componente
        formatearFecha(fecha) {
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // Formatear fecha y hora
        formatearFechaHora(fecha) {
            if (!fecha) return '';
            // Si viene como "2026-05-26 00:00:00"
            return fecha;
        },
        // Calcular horas trabajadas
        calcularHorasTrabajadas(fechaInicio, fechaFin) {
            if (!fechaInicio || !fechaFin) return 'No disponible';

            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            const diffMs = fin - inicio;

            if (diffMs <= 0) return 'Tiempo no válido';

            const diffHoras = diffMs / (1000 * 60 * 60);
            const horas = Math.floor(diffHoras);
            const minutos = Math.floor((diffHoras - horas) * 60);

            if (horas > 0) {
                return `${horas} hora${horas !== 1 ? 's' : ''} y ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
            } else {
                return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
            }
        },
        /**
    * Convierte grados a radianes
    * @param {number} degrees - Grados
    * @returns {number} - Radianes
    */
        degreesToRadians(degrees) {
            return degrees * (Math.PI / 180);
        },
        /**
     * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
     * @param {number} lat1 - Latitud del punto 1
     * @param {number} lon1 - Longitud del punto 1
     * @param {number} lat2 - Latitud del punto 2
     * @param {number} lon2 - Longitud del punto 2
     * @returns {number} - Distancia en metros
     */
        calcularDistanciaMetros(lat1, lon1, lat2, lon2) {
            // Validar que todos los parámetros existan
            if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
            if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return Infinity;

            const R = 6371000; // Radio de la Tierra en metros
            const phi1 = this.degreesToRadians(parseFloat(lat1));
            const phi2 = this.degreesToRadians(parseFloat(lat2));
            const deltaPhi = this.degreesToRadians(parseFloat(lat2) - parseFloat(lat1));
            const deltaLambda = this.degreesToRadians(parseFloat(lon2) - parseFloat(lon1));

            const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distancia = R * c;

            return Math.round(distancia); // Redondear a metros
        },



        /**
         * Formatea la distancia en metros o kilómetros
         * @param {number} metros - Distancia en metros
         * @returns {string} - Distancia formateada (ej: "1.5 km" o "150 m")
         */
        formatearDistancia(metros) {
            if (metros === Infinity || !metros) return 'No disponible';

            if (metros >= 1000) {
                const km = (metros / 1000).toFixed(2);
                return `${km} km`;
            } else {
                return `${metros} m`;
            }
        },

        exportarAExcel() {
            // Usar las visitas filtradas (las que se muestran en la tabla)
            const datosAExportar = this.visitasFiltradas || this.visitas;

            if (!datosAExportar || datosAExportar.length === 0) {
                this.$f_notificacion('No hay datos para exportar', 'warning');
                return;
            }

            console.log('===== EXPORTANDO A EXCEL =====');
            console.log('Total de visitas a exportar:', datosAExportar.length);

            const datosExportar = datosAExportar.map(visita => {
                // Calcular diferencia de días
                const diferenciaDias = this.calcularDiferenciaDias(visita.startDate, visita.fecha_captura_longitud);

                // Calcular tiempo de visita
                const tiempoVisita = this.calcularHorasTrabajadas(visita.fecha_captura_longitud, visita.fecha_captura_longitud_fin);

                // Determinar ubicación
                const ubicacionEstado = this.getUbicacionEstado(visita);
                const ubicacionDetalle = this.getUbicacionDetalle(visita);

                // Determinar el texto del sello según el valor directo del backend
                // sello: null = no disponible, 0 = sin sello, 1 = con sello
                const selloTexto = this.getSelloText(visita.sello);

                return {
                    'Titulo': visita.title || 'Sin título',
                    'Tipo institución': visita.tipo_institucion || 'Sin tipo',
                    'Id': visita.institucion_id || 'N/A',
                    'Institución': visita.institucion || 'N/A',
                    // 'Periodo': visita.periodo || 'N/A',
                    'Asesor': visita.vendedor || 'N/A',
                    'Fecha Planificada': visita.fecha || 'N/A',
                    'Inicio Visita': visita.fecha_captura_longitud ? this.formatearFechaHoraCompleta(visita.fecha_captura_longitud) : 'No registrado',
                    'Fin Visita': visita.fecha_captura_longitud_fin ? this.formatearFechaHoraCompleta(visita.fecha_captura_longitud_fin) : 'No registrado',
                    'Dias Diferencia': diferenciaDias,
                    'Tiempo': tiempoVisita,
                    'Estado': this.getEstadoTexto(visita.estado),
                    'Ubicación': ubicacionEstado,
                    'Distancia': ubicacionDetalle,
                    'Creador': visita.creador_nombre || 'N/A',
                    'Finalizador': visita.finalizador_nombre || 'N/A',
                    'Sello': selloTexto,
                    'Obs. Asesor': visita.observacionAsesor || 'N/A',
                    'Obs. Admin': visita.observacionAdmin || 'N/A'
                };
            });

            // Crear la hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(datosExportar);

            // Ajustar el ancho de las columnas
            const columnWidths = [
                { wch: 30 }, // Título
                { wch: 15 }, // Tipo Institución
                { wch: 10 }, // Id Institución
                { wch: 35 }, // Institución
                // { wch: 15 }, // Periodo
                { wch: 30 }, // Asesor
                { wch: 18 }, // Fecha Planificada
                { wch: 20 }, // Inicio Visita
                { wch: 20 }, // Fin Visita
                { wch: 15 }, // Días Diferencia
                { wch: 12 }, // Tiempo
                { wch: 15 }, // Estado
                { wch: 15 }, // Ubicación (estado)
                { wch: 30 }, // Distancia (detalles)
                { wch: 30 }, // Creador
                { wch: 30 }, // Finalizador
                { wch: 15 }, // Sello
                { wch: 50 }, // Obs. Asesor
                { wch: 50 }  // Obs. Admin
            ];
            worksheet['!cols'] = columnWidths;

            // Aplicar formato a las cabeceras (negrita)
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const address = XLSX.utils.encode_cell({ r: 0, c: C });
                if (!worksheet[address]) continue;
                worksheet[address].s = {
                    font: { bold: true, sz: 12 },
                    fill: { fgColor: { rgb: "D3D3D3" } }
                };
            }

            // Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');

            // Generar nombre del archivo con fecha actual
            const fechaActual = new Date();
            const nombreArchivo = `Reporte_Visitas_${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}_${fechaActual.getHours().toString().padStart(2, '0')}${fechaActual.getMinutes().toString().padStart(2, '0')}.xlsx`;

            // Exportar el archivo
            XLSX.writeFile(workbook, nombreArchivo);

            this.$f_notificacion(`Exportación completada (${datosAExportar.length} registros)`, 'success');

            console.log('===== EXPORTACIÓN COMPLETADA =====');
            console.log('Archivo generado:', nombreArchivo);
            console.log('Total registros exportados:', datosAExportar.length);
        },
        /**
         * Calcula la diferencia de días entre fecha planificada y fecha de inicio
         */
        calcularDiferenciaDias(fechaPlanificada, fechaInicio) {
            if (!fechaPlanificada || !fechaInicio) return 'N/A';

            const planificada = new Date(fechaPlanificada);
            const inicio = new Date(fechaInicio);

            // Resetear horas para comparar solo fechas
            planificada.setHours(0, 0, 0, 0);
            inicio.setHours(0, 0, 0, 0);

            const diffTime = inicio - planificada;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            return diffDays;
        },

        /**
         * Calcula el tiempo transcurrido entre inicio y fin de visita
         */
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

        /**
         * Obtiene el texto de ubicación según las coordenadas
         */
        // Obtiene solo el estado de la ubicación
        getUbicacionEstado(visita) {
            // Verificar si la escuela tiene coordenadas
            const escuelaSinCoordenadas = !visita.latitud_institucion ||
                !visita.longitud_institucion ||
                (visita.latitud_institucion === 0 && visita.longitud_institucion === 0);

            if (escuelaSinCoordenadas) {
                return 'Escuela sin coordenadas';
            }

            // Verificar si hay coordenadas de inicio y fin
            if (!visita.latitud_inicio || !visita.longitud_inicio || !visita.latitud_fin || !visita.longitud_fin) {
                return 'Sin registro';
            }

            // Calcular distancias
            const distanciaInicio = this.calcularDistanciaMetros(
                visita.latitud_inicio, visita.longitud_inicio,
                visita.latitud_institucion, visita.longitud_institucion
            );
            const distanciaFin = this.calcularDistanciaMetros(
                visita.latitud_fin, visita.longitud_fin,
                visita.latitud_institucion, visita.longitud_institucion
            );

            if (distanciaInicio <= 200 || distanciaFin <= 200) {
                return 'En sitio';
            } else {
                return 'Fuera de sitio';
            }
        },

        // Obtiene solo los detalles de distancia
        getUbicacionDetalle(visita) {
            // Verificar si la escuela tiene coordenadas
            const escuelaSinCoordenadas = !visita.latitud_institucion ||
                !visita.longitud_institucion ||
                (visita.latitud_institucion === 0 && visita.longitud_institucion === 0);

            if (escuelaSinCoordenadas) {
                return '';
            }

            // Verificar si hay coordenadas de inicio y fin
            if (!visita.latitud_inicio || !visita.longitud_inicio || !visita.latitud_fin || !visita.longitud_fin) {
                return '';
            }

            // Calcular distancias
            const distanciaInicio = this.calcularDistanciaMetros(
                visita.latitud_inicio, visita.longitud_inicio,
                visita.latitud_institucion, visita.longitud_institucion
            );
            const distanciaFin = this.calcularDistanciaMetros(
                visita.latitud_fin, visita.longitud_fin,
                visita.latitud_institucion, visita.longitud_institucion
            );

            const detalles = [];
            if (distanciaInicio <= 200) {
                detalles.push(`Inicio: ${this.formatearDistancia(distanciaInicio)}`);
            }
            if (distanciaFin <= 200) {
                detalles.push(`Fin: ${this.formatearDistancia(distanciaFin)}`);
            }

            if (detalles.length > 0) {
                return detalles.join(', ');
            } else {
                return `Inicio: ${this.formatearDistancia(distanciaInicio)}, Fin: ${this.formatearDistancia(distanciaFin)}`;
            }
        },

        /**
         * Formatea fecha y hora completa
         */
        formatearFechaHoraCompleta(fecha) {
            if (!fecha) return 'No registrado';

            const date = new Date(fecha);
            const año = date.getFullYear();
            const mes = (date.getMonth() + 1).toString().padStart(2, '0');
            const dia = date.getDate().toString().padStart(2, '0');
            const horas = date.getHours().toString().padStart(2, '0');
            const minutos = date.getMinutes().toString().padStart(2, '0');
            const segundos = date.getSeconds().toString().padStart(2, '0');

            return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        },
        getSelloText(sello) {
            if (sello === null || sello === undefined) return '';
            if (sello == 0 || sello == '0') return 'Sin sello';
            if (sello == 1 || sello == '1') return 'Con sello';
            return '';
        }

    }
};
</script>

<style scoped>
.filtros {
    display: flex;
    gap: 20px;
    align-items: flex-end;
}

.select-asesores {
    flex: 1;
}

.filter-item {
    flex: 1;
}

.date-range {
    display: flex;
    gap: 10px;
    align-items: center;
}

.date-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
}

.date-separator {
    font-weight: bold;
}

.bg-yellow-100 {
    background-color: #fef3c7;
}

.text-yellow-800 {
    color: #92400e;
}

.bg-blue-100 {
    background-color: #dbeafe;
}

.text-blue-800 {
    color: #1e40af;
}

.bg-red-100 {
    background-color: #fee2e2;
}

.text-red-800 {
    color: #991b1b;
}

.bg-gray-100 {
    background-color: #f3f4f6;
}

.text-gray-800 {
    color: #1f2937;
}

.bg-green-100 {
    background-color: #d1fae5;
}

.text-green-800 {
    color: #065f46;
}

/* Header mejorado */
.header-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    margin: -20px -20px 30px -20px;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 20px;
}

.icon-wrapper {
    background: rgba(255, 255, 255, 0.2);
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    backdrop-filter: blur(10px);
}

.title-text {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    margin: 5px 0 0 0;
}
</style>