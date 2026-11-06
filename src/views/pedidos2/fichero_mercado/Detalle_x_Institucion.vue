<template>
<div :class="['px-6 py-8 min-h-screen transition-colors duration-300', themeMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800']">
    <!-- 🏫 Periodo Escolar al inicio, centrado y elegante -->
    <div class="w-full mb-6 flex justify-center">
        <div class="inline-flex items-center px-6 py-3 rounded-xl shadow-lg border transition-all duration-300" :class="themeMode
      ? 'bg-indigo-800 border-indigo-600 '
      : 'bg-indigo-500 border-indigo-400 '">
            <ion-icon name="calendar-outline" class="mr-2 text-2xl"></ion-icon>
            <span class="text-lg font-bold tracking-wide">
                Periodo Escolar:
                <span class="ml-1 font-semibold">
                    {{ (periodoSeleccionado && periodoSeleccionado.descripcion_periodoescolar) || 'Sin periodo asignado' }}
                </span>
            </span>
        </div>
    </div>
    <!-- Sección Unificada de Institución y Fichero -->
    <div>
        <!-- Header con Información de Institución y Acciones -->
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div class="flex items-center space-x-3">
                <ion-icon name="business-outline" class="text-2xl text-primary"></ion-icon>
                <div>
                    <h2 class="text-2xl font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                        {{ institucionSeleccionada.nombreInstitucion }}
                    </h2>
                    <p class="text-sm transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">ID: {{ institucionSeleccionada.idInstitucion }}</p>
                </div>
            </div>

            <!-- Botones de Acciones -->
            <div class="flex flex-wrap gap-3 mt-4 md:mt-0 justify-center md:justify-end" align="center">
                <!-- Solo Ver Fichero si ya existe -->
                <template v-if="tieneficheroExistente && Fichero_Array.length > 0">
                    <vs-button @click="Visualizar_Fichero()" color="primary" type="filled" icon-pack="feather" icon="icon-eye" class="px-4 py-2 font-medium">
                        Ver Fichero
                    </vs-button>
                </template>
            </div>
        </div>

        <!-- Detalles de la Institución -->
        <h3 class="text-lg font-medium mb-4 transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">Detalles de la Institución</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Columna Izquierda -->
            <div class="space-y-3">
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Nombre:</strong> {{ institucionSeleccionada.nombreInstitucion }}</p>
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Provincia:</strong> {{ institucionSeleccionada.nombreprovincia || 'No especificada' }}</p>
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Ciudad:</strong> {{ institucionSeleccionada.nombre_ciudad || 'No especificada' }}</p>
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Parroquia:</strong> {{ institucionSeleccionada.parr_nombre || 'No especificada' }}</p>
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Dirección:</strong> {{ institucionSeleccionada.direccionInstitucion || 'No especificada' }}</p>
                <p v-if="institucionSeleccionada.email || institucionSeleccionada.correo">
                    <strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Email:</strong> {{ institucionSeleccionada.email || institucionSeleccionada.correo }}
                </p>
            </div>
            <!-- Columna Derecha -->
            <div class="space-y-3">
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">ID Institución:</strong> {{ institucionSeleccionada.idInstitucion }}</p>
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">RUC:</strong> {{ institucionSeleccionada.ruc || 'No especificado' }}</p>
                <p><strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Estado:</strong> {{ institucionSeleccionada.estado_idEstado == 1 ? 'Activo' : 'Inactivo' }}</p>
                <p v-if="institucionSeleccionada.telefonoInstitucion || institucionSeleccionada.telefono">
                    <strong :class="themeMode ? 'text-gray-300' : 'text-gray-600'">Teléfono:</strong> {{ institucionSeleccionada.telefonoInstitucion || institucionSeleccionada.telefono }}
                </p>
            </div>
        </div>

        <!-- Sección de Fichero de Mercado (integrada y mejorada) -->
        <div class="flex items-center mb-4">
            <ion-icon name="document-outline" class="text-xl text-primary mr-2"></ion-icon>
            <h3 class="text-lg font-medium transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">Información del Fichero de Mercado</h3>
        </div>

        <div v-if="tieneficheroExistente && Fichero_Array.length > 0" :class="['p-6 rounded-lg border transition-colors duration-300', themeMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200']">
            <!-- 🧾 Sección de Datos Generales -->
            <h4 class="text-lg font-semibold mb-4 transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">Datos del Fichero</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Columna Izquierda: ID y Estado -->
                <div class="space-y-4">
                    <!-- ID -->
                    <div :class="['flex items-center space-x-3 p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                        <ion-icon name="id-card-outline" class="text-lg text-blue-500"></ion-icon>
                        <div>
                            <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">FM ID</p>
                            <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">{{ Fichero_Array[0].fm_id }}</p>
                        </div>
                    </div>
                    <!-- Estado -->
                    <div :class="['flex items-center space-x-3 p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                        <ion-icon name="toggle-outline" class="text-lg text-green-500"></ion-icon>
                        <div>
                            <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Estado</p>
                            <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                {{
                                    Fichero_Array.length > 0
                                        ? (Fichero_Array[0].fm_estado == 1 ? 'Creado/Activo'
                                          : Fichero_Array[0].fm_estado == 2 ? 'Enviado para aprobación'
                                          : Fichero_Array[0].fm_estado == 0 ? 'Inactivo'
                                          : Fichero_Array[0].fm_estado == 3 ? 'Aprobado'
                                          : Fichero_Array[0].fm_estado == 4 ? 'Devuelto'
                                          : 'Estado desconocido')
                                        : 'No hay fichero'
                                }}
                            </p>
                            <!-- ⚠️ Mensaje adicional si el estado es 3 -->
                            <div v-if="Fichero_Array.length > 0 && Fichero_Array[0].fm_estado == 2">
                                <p v-if="userRoot" class="text-yellow-600 text-sm mt-1 items-center gap-1">
                                    ⚠️ Debe aprobar o devolver el fichero en la sección <b>'Ver Fichero'</b>.
                                </p>
                                <p v-if="userAsesor" class="text-yellow-600 text-sm mt-1 items-center gap-1">
                                    ⏳ En proceso de aprobación.
                                </p>
                            </div>
                            <div v-if="Fichero_Array.length > 0 && Fichero_Array[0].fm_estado == 3" class="text-green-600 text-sm mt-1 items-center gap-1">
                                ✅ Esta institución se encuentra habilitada para realizar su pedido, pero puede devolver el fichero al asesor en la sección <b>'Ver Fichero'</b> para que pueda corregirlo.
                            </div>
                            <div v-if="Fichero_Array.length > 0 && Fichero_Array[0].fm_estado == 1" class="text-green-600 text-sm mt-1 items-center gap-1">
                                📤 Por favor, revise que toda la información esté completa y luego <b>envíe el fichero para aprobación</b> en la sección <b>'Ver Fichero'</b>.
                            </div>
                            <div v-if="Fichero_Array.length > 0 && Fichero_Array[0].fm_estado == 4" class="text-green-600 text-sm mt-1 items-center gap-1">
                                ⚠️ Por favor, revise que toda la información esté corregida y luego envíe el fichero para <b>aprobación</b> en la sección <b>'Ver Fichero'</b>.
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Columna Derecha: Observaciones -->
                <div class="space-y-4">
                    <div :class="['p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                        <p class="text-sm font-medium uppercase tracking-wide mb-2 transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Observaciones</p>
                        <p class="transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">{{ Fichero_Array[0].fm_observacion || 'Sin observaciones' }}</p>
                    </div>
                </div>
            </div>

            <!-- 🕓 Sección de Fechas y Usuarios -->
            <h4 class="text-lg font-semibold mt-8 mb-4 transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">Fechas y Usuarios</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Fecha de Creación -->
                <div :class="['flex items-center space-x-3 p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                    <ion-icon name="calendar-outline" class="text-lg text-purple-500"></ion-icon>
                    <div>
                        <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Fecha de Creación</p>
                        <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">{{ Fichero_Array[0].created_at }}</p>
                        <p class="text-sm transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">{{ Fichero_Array[0].usercreated_nombres }} {{ Fichero_Array[0].usercreated_apellidos }}</p>
                    </div>
                </div>

                <!-- Última Actualización -->
                <div :class="['flex items-center space-x-3 p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                    <ion-icon name="refresh-outline" class="text-lg text-orange-500"></ion-icon>
                    <div>
                        <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Última Actualización</p>
                        <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">{{ Fichero_Array[0].updated_at }}</p>
                        <p class="text-sm transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">{{ Fichero_Array[0].user_edit_nombres }} {{ Fichero_Array[0].user_edit_apellidos }}</p>
                    </div>
                </div>
            </div>

            <!-- 🧭 Sección de Seguimiento -->
            <h4 v-if="Fichero_Array[0].fm_estado == 2 || Fichero_Array[0].fm_estado == 3 || Fichero_Array[0].fm_estado == 4" class="text-lg font-semibold mt-8 mb-4 transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">Seguimiento del Fichero</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Enviado para Aprobación -->
                <div v-if="Fichero_Array[0].fm_estado >= 2" :class="['flex items-center space-x-3 p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                    <ion-icon name="send-outline" class="text-lg text-blue-500"></ion-icon>
                    <div>
                        <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Enviado para Aprobación</p>
                        <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                            {{ Fichero_Array[0].user_envia_nombres || '---' }} {{ Fichero_Array[0].user_envia_apellidos || '' }}
                        </p>
                        <p class="text-sm transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">Fecha: {{ Fichero_Array[0].fecha_envio_aprobacion || '---' }}</p>
                    </div>
                </div>

                <!-- Aprobación -->
                <div v-if="Fichero_Array[0].fm_estado == 3" :class="['flex items-center space-x-3 p-3 rounded-md shadow-sm border transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                    <ion-icon name="checkmark-done-outline" class="text-lg text-green-500"></ion-icon>
                    <div>
                        <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Aprobado por</p>
                        <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                            {{ Fichero_Array[0].user_aprobacion_nombres || '---' }} {{ Fichero_Array[0].user_aprobacion_apellidos || '' }}
                        </p>
                        <p class="text-sm transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">Fecha: {{ Fichero_Array[0].fecha_aprobacion || '---' }}</p>
                    </div>
                </div>

                <!-- Rechazo -->
                <div v-if="Fichero_Array[0].fm_estado == 4" :class="['flex flex-col space-y-2 p-4 rounded-md border shadow-sm transition-colors duration-300',themeMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100']">
                    <div class="flex items-center space-x-3">
                        <ion-icon name="close-circle-outline" class="text-2xl text-red-500"></ion-icon>
                        <div>
                            <p class="text-sm font-medium uppercase tracking-wide transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                                Devuelto por
                            </p>
                            <p class="text-lg font-semibold transition-colors duration-300" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                {{ Fichero_Array[0].user_rechazo_nombres || '---' }}
                                {{ Fichero_Array[0].user_rechazo_apellidos || '' }}
                            </p>
                            <p class="text-sm transition-colors duration-300" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">
                                Fecha: {{ Fichero_Array[0].fecha_rechazo || '---' }}
                            </p>
                        </div>
                    </div>
                    <!-- Observación / Comentario del rechazo -->
                    <div class="pl-9 border-l-4 mt-3 transition-colors duration-300" :class="themeMode ? 'border-red-600' : 'border-red-500'">
                        <p class="text-sm font-semibold mb-1 transition-colors duration-300" :class="themeMode ? 'text-red-400' : 'text-red-600'">
                            Observación:
                        </p>
                        <p class="text-sm italic transition-colors duration-300" :class="themeMode ? 'text-gray-300' : 'text-gray-700'">
                            "{{ Fichero_Array[0].comentario_rechazo || 'Sin comentario registrado.' }}"
                        </p>
                    </div>

                </div>

            </div>
        </div>

        <!-- Mensaje cuando no hay fichero -->
        <div v-else :class="['p-6 rounded-lg border text-center transition-colors duration-300', themeMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-500']">
            <p class="text-lg font-medium">{{ 'Aún no se ha creado o registrado un fichero de mercado.' }}</p>
            <p class="text-sm mt-2">{{ 'Puedes crear uno nuevo usando el botón "Crear Fichero de Mercado".' }}</p>
        </div>
    </div>

    <!-- Popups (Dark Mode aplicado) -->
    <vs-popup class="informacionformhijo" fullscreen @close="cerrarPopupFicheroMercadoVisualizar()" title="Visualización Fichero" :active.sync="popupFicheroMercadoVisualizar">
        <Visualizar_FicheroMercado v-if="popupFicheroMercadoVisualizar" :periodoSeleccionado="periodoSeleccionado" :institucion_Enviar="institucionSeleccionada" :Fichero_Array="Fichero_Array" @change="changeHandleFicheroMercadoVisualizar" />
    </vs-popup>
</div>
</template>

<script>
const Visualizar_FicheroMercado = () => import('@/views/pedidos2/fichero_mercado/Visualizar_Fichero.vue');
import PopupHistoryMixin from '@/mixins/PopupHistoryMixin'
import {
    mapState
} from "vuex";
export default {
    mixins: [PopupHistoryMixin],
    data() {
        return {
            tieneficheroExistente: false,
            popupFicheroMercadoVisualizar: false,
            institucionSeleccionada: {},
            Fichero_Array: [],
            isrunLoading_metodoEjecucionGlobalDetalle: false,
            isHistoryBack: false,
        };
    },
    props: {
        Info_Institucion: {
            type: Object,
            default: () => ({}),
        },
        periodoSeleccionado: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    components: {
        Visualizar_FicheroMercado
    },
    created() {
        this.registerPopupHistory('popupFicheroMercadoVisualizar');
    },
    mounted() {
        this.institucionSeleccionada = this.Info_Institucion;
        this.metodoEjecucionGlobalDetalle();
        // Escuchar el evento popstate para detectar navegación del navegador
        window.addEventListener('popstate', this.handlePopState);
    },
    beforeDestroy() {
        window.removeEventListener('popstate', this.handlePopState);
    },
    watch: {
        popupFicheroMercadoVisualizar(newVal) {
            if (!newVal) {
                console.log('🔴 popupFicheroMercadoVisualizar cerrado, ejecutando cleanup...');
                this.cerrarPopupFicheroMercadoVisualizar();
            }
        }
    },
    methods: {
        handlePopState(event) {
            this.isHistoryBack = true;
        },
        async metodoEjecucionGlobalDetalle() {
            let me = this;
            try {
                me.isrunLoading_metodoEjecucionGlobalDetalle = true;
                me.$vs.loading();
                await me.getVerificar_Existencia_Fichero();
                await me.cargarInformacionCompleta();
                me.isrunLoading_metodoEjecucionGlobalDetalle = false
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoEjecucionGlobal:', error);
                me.$vs.loading.close();
            }
        },
        getVerificar_Existencia_Fichero() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Verificar_GetFicheroSeleccionado_Existencia',
                    idInstitucion: this.institucionSeleccionada.idInstitucion,
                    periodo_id: this.periodoSeleccionado.idperiodoescolar
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        this.$vs.loading.close();
                        if (response.data && response.data.length > 0) {
                            this.Fichero_Array = response.data;
                            this.tieneficheroExistente = true;
                            resolve();
                        } else {
                            this.tieneficheroExistente = false;
                            resolve();
                        }
                    })
                    .catch(error => {
                        this.$vs.loading.close();
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getVerificar_Existencia_Fichero", error);
                    });
            });
        },
        // Cargar información completa de la institución
        async cargarInformacionCompleta() {
            let me = this;
            return new Promise((resolve, reject) => {
                me.$vs.loading();
                let idInstitucion = this.institucionSeleccionada.idInstitucion;
                // console.log('Cargando información completa de la institución:', idInstitucion);

                // Para método GET, usar parámetros en la URL
                let url = `traerInstitucionFichero?institucion_idInstitucion=${idInstitucion}`;

                this.$http.get(this.$server_url + url)
                    .then(response => {
                        // console.log('Información completa de la institución:', response.data);

                        if (response.data && response.data.length > 0) {
                            const institucionCompleta = response.data[0];

                            // Actualizar la institución seleccionada con toda la información
                            me.institucionSeleccionada = {
                                ...me.institucionSeleccionada,
                                ...institucionCompleta
                            };
                            resolve();
                            // console.log('✅ Institución actualizada con información completa:', me.institucionSeleccionada);
                            me.$vs.loading.close();
                        }
                    })
                    .catch(error => {
                        console.error('Error al cargar información completa:', error);
                        me.$vs.loading.close();
                        reject("cargarInformacionCompleta", error);
                        // No mostrar error al usuario, continuar con la información básica
                    });
            });
        },
        Visualizar_Fichero() {
            this.popupFicheroMercadoVisualizar = true
        },
        changeHandleFicheroMercadoVisualizar(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            me.metodoEjecucionGlobalDetalle();
            if (e.verificarficheromercadovisualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupFicheroMercadoVisualizar = false;
            } else if (e.verificarficheromercadovisualizar == 2) {
                console.log("Emit recibido por cancelar.");
                me.popupFicheroMercadoVisualizar = false;
            } else if (e.verificarficheromercadovisualizar == 3) {
                console.log("Emit recibido por aprobacion.");
                me.popupFicheroMercadoVisualizar = false;
            } else if (e.verificarficheromercadovisualizar == 4) {
                console.log("Emit recibido por devolución.");
                me.popupFicheroMercadoVisualizar = false;
            } else if (e.verificarficheromercadovisualizar == 5) {
                console.log("Emit recibido por enviado para aprobacion.");
                me.popupFicheroMercadoVisualizar = false;
            } else {
                console.log("Emit no recibido");
            }
        }
    }
};
</script>

<style scoped>
.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */

    /* Prevenir gestos de navegación horizontal (swipe) */
    overscroll-behavior-x: none;
    touch-action: pan-y pinch-zoom;
}

.hide-close .vs-popup--close {
    display: none;
}

/* Prevenir gestos de navegación en el contenido del popup */
.hide-close ::v-deep * {
    overscroll-behavior-x: none;
}

.custom-popup-close {
    position: absolute;
    top: 8px;
    right: 10px;
    width: 35px;
    /* ancho del botón */
    height: 35px;
    /* alto del botón */
    background: #FFFFFF;
    /* fondo blanco */
    border: 1px solid #999;
    /* borde tipo plomo, grosor visible */
    border-radius: 10px;
    /* completamente redondo */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    /* sombra ligera */
    transition: all 0.2s;
    color: #333;
    /* color de la X */
}

.custom-popup-close:hover {
    background: #f0f0f0;
    /* fondo al pasar el mouse */
    border-color: #666;
    /* borde más oscuro al hover */
    color: #000;
    /* X más visible */
}

/* Responsive */
@media (max-width: 768px) {
    .custom-popup-close {
        width: 35px;
        height: 35px;
        font-size: 20px;
        top: 8px;
        right: 8px;
    }
}

@media (max-width: 480px) {
    .custom-popup-close {
        width: 30px;
        height: 30px;
        font-size: 18px;
        top: 6px;
        right: 6px;
    }
}
</style>
