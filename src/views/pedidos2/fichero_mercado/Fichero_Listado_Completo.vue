<template>
<vx-card fixed-height="true">
    <div v-if="VISTA_ActivoAbrirDetalle_Fichero">
        <vs-button color="primary" type="border" @click="cerrarDetalle">← Volver a lista</vs-button>
        <Detalle_x_Institucion :Info_Institucion="institucionSeleccionada" :periodoSeleccionado="userAsesor ? periodoSeleccionado : periodo_de_Root" />
    </div>
    <div v-else>
        <div class="menu-filtros-compact shadow-md rounded-lg p-3" :class="{ 'night-menu-filtros': themeMode }">
            <!-- 🔹 ENCABEZADO -->
            <div class="header-sidebar flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h4 class="flex items-center gap-2 font-semibold text-base" :class="{ 'text-primary': !themeMode, 'text-white': themeMode }">
                    <ion-icon name="funnel-outline" style="font-size: 20px;"></ion-icon>
                    Filtros
                </h4>
                <div class="flex gap-2 w-full sm:w-auto">
                    <vs-button size="small" type="relief" color="primary" @click="Traer_Instituciones_Fichero_Verificacion()">
                        <ion-icon name="refresh-outline"></ion-icon> Recargar
                    </vs-button>

                    <vs-button v-if="userRoot || userAdministrador" size="small" color="success" @click="Accion_ExportarExcel()">
                        <ion-icon name="download-outline"></ion-icon> Exportar Excel ({{ totalGeneral }})
                    </vs-button>
                </div>
            </div>
            <!-- {{ periodoSeleccionado }} -->
            <!-- 🔹 FILTROS EN BOTONES COMPACTOS -->
            <div class="filtros-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                <div class="filtro-card-compact" :class="{ activo: filtroActivo === 'todos', 'night-filtro-card': themeMode }" @click="seleccionarFiltro('todos')">
                    <ion-icon name="apps-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Todos</span>
                    <span class="filtro-count-compact">{{ totalGeneral }}</span>
                </div>
                <div class="filtro-card-compact" :class="{ activo: filtroActivo === 'creados', 'night-filtro-card': themeMode }" @click="seleccionarFiltro('creados')">
                    <ion-icon name="create-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Creados</span>
                    <span class="filtro-count-compact">{{ totalCreados }}</span>
                </div>
                <div class="filtro-card-compact" :class="{ activo: filtroActivo === 'enviado_para_aprobacion', 'night-filtro-card': themeMode }" @click="seleccionarFiltro('enviado_para_aprobacion')">
                    <ion-icon name="send-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Enviados para aprobación</span>
                    <span class="filtro-count-compact">{{ totalEnviadoParaAprobacion }}</span>
                </div>
                <div class="filtro-card-compact" :class="{ activo: filtroActivo === 'aprobados', 'night-filtro-card': themeMode }" @click="seleccionarFiltro('aprobados')">
                    <ion-icon name="checkmark-circle-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Aprobados</span>
                    <span class="filtro-count-compact">{{ totalAprobados }}</span>
                </div>
                <div class="filtro-card-compact" :class="{ activo: filtroActivo === 'devueltos', 'night-filtro-card': themeMode }" @click="seleccionarFiltro('devueltos')">
                    <ion-icon name="return-down-back-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Devueltos</span>
                    <span class="filtro-count-compact">{{ totalDevueltos }}</span>
                </div>
                <!-- 🔹 Caso para usuarios root -->
                <vx-tooltip v-if="userRoot" text="Esta opción es solo para usuarios asesores">
                    <div class="filtro-card-compact" :class="{ 'night-filtro-card': themeMode, 'bloqueado': userRoot }" style="cursor: not-allowed; opacity: 0.6;">
                        <ion-icon name="hourglass-outline" class="filtro-icon-compact"></ion-icon>
                        <span class="filtro-label-compact">Instituciones sin fichero</span>
                        <span class="filtro-count-compact">{{ totalSinRegistro }}</span>
                    </div>
                </vx-tooltip>
                <!-- 🔹 Caso normal (usuarios no root) -->
                <div v-else class="filtro-card-compact" :class="{ activo: filtroActivo === 'sinRegistro', 'night-filtro-card': themeMode }" @click="seleccionarFiltro('sinRegistro')">
                    <ion-icon name="hourglass-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Instituciones sin fichero</span>
                    <span class="filtro-count-compact">{{ totalSinRegistro }}</span>
                </div>
                <!-- Nuevo -->
                <!-- <div v-if="userRoot || userAdministrador" class="filtro-card-compact filtro-exportar" :class="{ 'night-filtro-card': themeMode }" @click="Accion_ExportarExcel()">
                    <ion-icon name="download-outline" class="filtro-icon-compact"></ion-icon>
                    <span class="filtro-label-compact">Exportar Excel</span>
                    <span class="filtro-count-compact">{{ totalGeneral }} Registros</span>
                </div> -->
            </div>
        </div>
        <!-- {{ periodoSeleccionado }}
        {{ FicheroMercado }} -->
        <!-- Solo visible para root -->
        <!-- Solo visible para root -->
        <!-- <div v-if="userRoot" class="mt-4 max-w-sm">
            <label class="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Filtrar por período escolar
            </label>
            <v-select v-model="periodoFiltroSeleccionado" :options="periodosUnicos" label="descripcion_periodoescolar" placeholder="Selecciona un período escolar" clearable @input="seleccionarPeriodo" class="shadow-sm rounded-lg" />
        </div> -->
        <ExportarExcel v-if="userRoot" ref="exportarExcelRef" />
        <vs-table max-items="10" pagination search :data="getFicheroMercadoFiltrado()" no-data-text="No hay datos disponibles" :key="filtroActivo">
            <template slot="header">
                <vs-chip color="primary">
                    Cantidad: <b>{{ getFicheroMercadoFiltrado().length }}</b>
                </vs-chip>
            </template>
            <template slot="thead">
                <vs-th width="50">Código Fichero</vs-th>
                <vs-th colspan="1" width="300">Información Institución</vs-th>
                <vs-th colspan="1" width="500">Información Fichero</vs-th>
                <vs-th colspan="1" width="500">Seguimiento</vs-th>
                <vs-th width="100">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>{{ tr.fm_id }}</vs-td>
                    <vs-td>
                        <small><b>Nombre Institución:</b> {{ tr.nombreInstitucion }}</small><br>
                        <small><b>Provincia:</b> {{ tr.nombreprovincia }}</small><br>
                        <small><b>Ciudad:</b> {{ tr.nombre_ciudad }}</small><br>
                        <small><b>Parroquia:</b> {{ tr.parr_nombre }}</small><br>
                        <small><b>Asesor:</b> {{ tr.usuario_asesor }}</small><br>
                    </vs-td>
                    <vs-td>
                        <!-- Observación general -->
                        <small v-if="tr.fm_estado > 0">
                            <b>Observación:</b> {{ tr.fm_observacion || 'No hay observación' }}
                        </small><br>
                        <small v-if="['2','3','4'].includes(tr.fm_estado)">
                            <b>Pedido asociado al fichero:</b>
                            <!-- SIN pedido -->
                            <span v-if="!tr.id_pedido" class="text-gray-500">
                                Este fichero aún no ha generado ningún pedido
                            </span>
                            <!-- CON pedido anulado -->
                            <span v-else-if="tr.estado_pedido == 2" class="text-yellow-600">
                                Este fichero generó un pedido y se encuentra anulado
                            </span>
                            <!-- CON pedido activo -->
                            <span v-else class="text-green-600">
                                Este fichero generó un pedido y se encuentra activo
                            </span>
                            <br>
                        </small>
                        <!-- Estado visual -->
                        <div v-if="tr.fm_estado == null" class="chip chip-dark">
                            Sin Fichero
                        </div>
                        <div v-else-if="tr.fm_estado == '1'" class="chip chip-primary">
                            Creado/Activo
                        </div>
                        <div v-else-if="tr.fm_estado == '2'" class="chip chip-warning">
                            Pendiente de aprobación
                        </div>
                        <div v-else-if="tr.fm_estado == '3'" class="chip chip-success">
                            Aprobado
                        </div>
                        <div v-else-if="tr.fm_estado == '4'" class="chip chip-danger">
                            Devuelto
                        </div>
                        <!-- Mensaje para estado 'Creado' -->
                        <div v-if="tr.fm_estado == '1'" class="mt-2 p-3 bg-blue-50 text-blue-800 border-l-4 border-blue-500 rounded-md shadow-md">
                            📤 Por favor, revise que toda la información esté completa y luego <b>envíe el fichero para aprobación</b>.
                        </div>
                        <!-- Mensajes independientes según usuario -->
                        <div v-if="tr.fm_estado == '2'">
                            <!-- Para asesor -->
                            <div v-if="!userRoot && userAsesor" class="mt-2 p-3 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 rounded-md shadow-md">
                                ⏳ <b>En proceso de aprobación.</b>
                            </div>
                            <!-- Para root -->
                            <div v-else-if="userRoot" class="mt-2 p-3 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 rounded-md shadow-md">
                                ⚠️ <b>Debe aprobar o devolver el fichero.</b>
                            </div>
                        </div>
                        <!-- Mensaje elegante independiente para aprobado -->
                        <div v-if="tr.fm_estado == '3'">
                            <!-- Para asesor -->
                            <div v-if="!userRoot && userAsesor" class="mt-2 p-3 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 rounded-md shadow-md">
                                ✅ Esta institución se encuentra habilitada para realizar su pedido.
                            </div>
                            <!-- Para root -->
                            <div v-else-if="userRoot" class="mt-2 p-3 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 rounded-md shadow-md">
                                ✅ Esta institución se encuentra habilitada para realizar su pedido, pero puede devolver el fichero al asesor para que pueda corregirlo.
                            </div>
                        </div>
                        <!-- Mensaje elegante independiente para devuelto -->
                        <div v-if="tr.fm_estado == '4'">
                            <!-- Para asesor -->
                            <div v-if="!userRoot && userAsesor" class="mt-2 p-3 bg-red-50 text-red-800 border-l-4 border-red-500 rounded-md shadow-md">
                                ↩️ <b>Fichero devuelto.</b> Por favor, realice las correcciones necesarias y <b>envíe nuevamente para aprobación</b>.
                            </div>
                            <!-- Para root -->
                            <div v-else-if="userRoot" class="mt-2 p-3 bg-red-50 text-red-800 border-l-4 border-red-500 rounded-md shadow-md">
                                ↩️ <b>Fichero devuelto.</b> El asesor ha sido notificado para realizar las correcciones y enviar nuevamente.
                            </div>
                        </div>
                        <!-- Observación de devolución -->
                        <small v-if="tr.fm_estado == '4' && tr.comentario_rechazo" class="text-danger text-sm block mt-1">
                            📝 <b>Observación de la devolución:</b> {{ tr.comentario_rechazo }}
                        </small>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.fm_estado > 0 && tr.descripcion_periodoescolar" class="mb-2 px-3 py-2 bg-gray-50 text-gray-800 border-l-4 border-blue-500 rounded-md" style="font-size: 13px;">
                            <b class="text-blue-700">📚 Periodo Escolar: </b>
                            <span class="font-semibold text-blue-900">{{ tr.descripcion_periodoescolar }}</span>
                        </div>
                        <!-- Fechas reales -->
                        <div v-if="tr.fm_estado !== null && tr.fm_estado > 0">
                            <div v-if="tr.created_at !== '-'"><small><b>Creación:</b><br> {{ tr.created_at }} - ({{ tr.usercreated_nombres }} {{ tr.usercreated_apellidos }})</small></div>
                            <div v-if="tr.updated_at !== '-'"><small><b>Modificación:</b><br> {{ tr.updated_at }} - ({{ tr.user_edit_nombres }} {{ tr.user_edit_apellidos }})</small></div>
                            <div v-if="(tr.fm_estado == '2' || tr.fm_estado == '3' || tr.fm_estado == '4') && tr.fecha_envio_aprobacion !== '-'">
                                <small><b>Envío para aprobación:</b><br> {{ tr.fecha_envio_aprobacion }} - ({{ tr.user_envia_nombres }} {{ tr.user_envia_apellidos }})</small>
                            </div>
                            <div v-if="tr.fm_estado == '3' && tr.fecha_aprobacion !== '-'">
                                <small><b>Aprobación:</b><br> {{ tr.fecha_aprobacion }} - ({{ tr.user_aprobacion_nombres }} {{ tr.user_aprobacion_apellidos }})</small>
                            </div>
                            <div v-if="tr.fm_estado == '4' && tr.fecha_rechazo !== '-'">
                                <small><b>Devolución:</b><br> {{ tr.fecha_rechazo }} - ({{ tr.user_rechazo_nombres }} {{ tr.user_rechazo_apellidos }})</small>
                            </div>
                        </div>
                        <!-- Mensaje cuando no hay fechas -->
                        <div v-else>
                            <span style="color: gray; font-style: italic;">Sin fechas disponibles.</span>
                        </div>
                    </vs-td>
                    <vs-td :data="tr.fm_id">
                        <!-- 🔹 Dropdown único -->
                        <!-- <vs-dropdown v-if="tr.fm_estado != 3 && !(tr.fm_estado == 2 && !userRoot)" vs-custom-content vs-trigger-click title="Opciones"> -->
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <!-- Ver fichero -->
                                <vs-dropdown-item v-if="tr.fm_estado != null">
                                    <vs-button color="primary" type="line" class="w-full" icon-pack="feather" icon="icon-eye" @click="Visualizar_Fichero(tr)">
                                        Visualizar Fichero
                                    </vs-button>
                                </vs-dropdown-item>
                                <!-- Crear Fichero (no tiene fm_id todavía) -->
                                <vs-dropdown-item v-if="tr.fm_id == null">
                                    <vs-button color="success" type="line" class="w-full" icon-pack="feather" icon="icon-plus-circle" @click="Abrir_CrearFichero(tr)">
                                        Crear Fichero de Mercado
                                    </vs-button>
                                </vs-dropdown-item>
                                <!-- Editar Fichero (tiene fm_id y estado 1 o 4) -->
                                <vs-dropdown-item v-if="tr.fm_id != null && ((userRoot) || (userAsesor && tr.fm_estado == '1') || (userAsesor && tr.fm_estado == '4'))">
                                    <vs-button color="warning" type="line" class="w-full" icon-pack="feather" icon="icon-edit" @click="Abrir_EditarFichero(tr)">
                                        Editar Fichero
                                    </vs-button>
                                </vs-dropdown-item>
                                <!-- Abrir sección del fichero -->
                                <!-- <vs-dropdown-item v-if="tr.fm_estado == null || tr.fm_estado == '1' || tr.fm_estado == '4' || tr.fm_estado == '2' || userRoot">
                                    <vs-button color="#28C76F" type="line" class="w-full" @click="popup_aprobar_AbrirDetalle_Fichero(tr)">
                                        Abrir sección del fichero
                                    </vs-button>
                                    <div class="text-sm text-gray-700 mt-1">
                                        ⚠️ En esta sección puede <strong>registrar, editar, visualizar y enviar para aprobación</strong> los datos del fichero.
                                    </div>
                                </vs-dropdown-item> -->
                                <vs-dropdown-item v-if="tr.fm_estado == '2' && userRoot">
                                    <vs-button color="success" type="line" class="w-full" icon-pack="feather" icon="icon-check-circle" @click="popup_aprobar_FicheroMercado(tr)">
                                        Aprobar Fichero
                                    </vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="tr.fm_estado == '1' || tr.fm_estado == '4'">
                                    <vs-button color="success" type="line" class="w-full" icon-pack="feather" icon="icon-send" @click="EnviarParaAprobacion(tr)">
                                        Enviar para Aprobación
                                    </vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="(tr.fm_estado == '2' || tr.fm_estado == '3') && userRoot">
                                    <vs-button color="danger" type="line" class="w-full" icon-pack="feather" icon="icon-corner-up-left" @click="popup_rechazar_FicheroMercado(tr)">
                                        Devolver Fichero
                                    </vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="(userRoot) || (userAsesor && tr.fm_estado == '1')">
                                    <vs-button color="danger" type="line" class="w-full" icon-pack="feather" icon="icon-trash-2" @click="Eliminar_Fichero(tr)">
                                        Eliminar Fichero
                                    </vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION VISUALIZACION -->
        <vs-popup class="informacionformhijo" fullscreen @close="cerrarPopupFicheroMercadoVisualizar()" :title="Fichero_Array.length > 0 ? 'Visualización Fichero - ' + Fichero_Array[0].nombreInstitucion + '(' + Fichero_Array[0].descripcion_periodoescolar + ')' : 'Visualización Fichero'" :active.sync="popupFicheroMercadoVisualizar">
            <Visualizar_FicheroMercado v-if="popupFicheroMercadoVisualizar" :periodoSeleccionado="userAsesor ? periodoSeleccionado : periodo_de_Root" :institucion_Enviar="institucion_Enviar" :Fichero_Array="Fichero_Array" @change="changeHandleFicheroMercadoVisualizar" />
        </vs-popup>
        <!-- SECCION APROBACION -->
        <vs-popup class="informacionformhijo" :title="Fichero_Array.length > 0 ? 'Aprobar Fichero - ' + Fichero_Array[0].nombreInstitucion + ' (' + Fichero_Array[0].descripcion_periodoescolar + ')' : 'Aprobar Fichero Mercado'" :active.sync="popupActivoAprobacion_Fichero">
            <Aprobacion_FicheroMercado v-if="popupActivoAprobacion_Fichero" :tabFicheroMercado="tabFicheroMercado" @change="changeHandleAprobar_FicheroMercado" />
        </vs-popup>
        <!-- SECCION RECHAZO -->
        <vs-popup class="informacionformhijo" :title="Fichero_Array.length > 0 ? 'Devolver Fichero - ' + Fichero_Array[0].nombreInstitucion + ' (' + Fichero_Array[0].descripcion_periodoescolar + ')' : 'Devolver Fichero Mercado'" :active.sync="popupActivoRechazar_Fichero">
            <Rechazar_FicheroMercado v-if="popupActivoRechazar_Fichero" :tabFicheroMercado="tabFicheroMercado" @change="changeHandleRechazar_FicheroMercado" />
        </vs-popup>
        <!-- SECCION ENVIAR A APROBACION -->
        <vs-popup class="informacionformhijo" :title="Fichero_Array.length > 0 ? 'Enviar para aprobación - ' + Fichero_Array[0].nombreInstitucion + ' (' + Fichero_Array[0].descripcion_periodoescolar + ')' : 'Enviar para aprobación'" :active.sync="popupFicheroMercadoEnviar_Aprobacion">
            <Enviar_para_aprobacion v-if="popupFicheroMercadoEnviar_Aprobacion" :tabFicheroMercado="tabFicheroMercado" @change="changeHandleFicheroMercadoEnviar_Aprobacion" />
        </vs-popup>
        <!-- SECCION ELIMINAR -->
        <vs-popup class="informacionformhijo" :title="Fichero_Array.length > 0 ? 'Eliminar Fichero - ' + Fichero_Array[0].nombreInstitucion + ' (' + Fichero_Array[0].descripcion_periodoescolar + ')' : 'Eliminar Fichero Mercado'" :active.sync="popupActivo_EliminarFichero">
            <Eliminar_FicheroMercado v-if="popupActivo_EliminarFichero" :Fichero_Array="Fichero_Array" @change="changeHandleEliminar_FicheroMercado" />
        </vs-popup>
        <!-- SECCION FORMAS DE CREACION -->
        <vs-popup class="informacionformhijo hide-close" fullscreen :title="'¿Cómo deseas crear tu Fichero para: ' + institucion_Enviar.nombreInstitucion + '?'" :active.sync="popupFormasCreacion">
            <button @click="cerrarFormasCreacionManual()" class="custom-popup-close">✕</button>
            <Formas_CreacionFichero v-if="popupFormasCreacion" :institucion_Enviar="institucion_Enviar" :periodoSeleccionado="userAsesor ? periodoSeleccionado : periodo_de_Root" @change="changeHandleFormasCreacion" />
        </vs-popup>
        <!-- SECCION CREAR/EDITAR FICHERO -->
        <vs-popup class="informacionformhijo hide-close" fullscreen title="Fichero de Mercado" :active.sync="popupFicheroMercado">
            <button @click="cerrarPopupCrearEditar(true)" class="custom-popup-close">✕</button>
            <Crear_EditarFichero v-if="popupFicheroMercado" :verificarcrear_actualizar="verificarcrear_actualizar" :institucion_Enviar="institucion_Enviar" :periodoSeleccionado="userAsesor ? periodoSeleccionado : periodo_de_Root" :Fichero_Array="Fichero_Array" @change="changeHandleCrearEditar_FicheroMercado" />
        </vs-popup>
        <!-- OVERLAY DE CREACION -->
        <div v-if="overlayFichero" class="loading-overlay">
            <div class="loading-content">
                <vs-progress indeterminate color="primary"></vs-progress>
                <p class="loading-text mt-4 text-center font-semibold text-lg" :class="themeMode ? 'text-white' : 'text-gray-800'">
                    Generando fichero de mercado...<br>
                    <span class="text-sm font-normal text-gray-500 mt-2 block">Este proceso puede tomar unos segundos.</span>
                </p>
            </div>
        </div>
    </div>
</vx-card>
</template>

<!-- Ionicons -->

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';
import {
    data
} from "jquery";
const Visualizar_FicheroMercado = () => import('@/views/pedidos2/fichero_mercado/Visualizar_Fichero.vue');
const Detalle_x_Institucion = () => import('@/views/pedidos2/fichero_mercado/Detalle_x_Institucion.vue');
const ExportarExcel = () => import('@/views/pedidos2/fichero_mercado/ExportarExcel.vue');
const Aprobacion_FicheroMercado = () => import("@/views/pedidos2/fichero_mercado/Aprobar_Fichero_Mercado.vue");
const Rechazar_FicheroMercado = () => import("@/views/pedidos2/fichero_mercado/Rechazar_Fichero_Mercado.vue");
const Enviar_para_aprobacion = () => import('@/views/pedidos2/fichero_mercado/Enviar_para_aprobacion.vue');
const Eliminar_FicheroMercado = () => import('@/views/pedidos2/fichero_mercado/Eliminar_Fichero_Mercado.vue');
const Formas_CreacionFichero = () => import('@/views/pedidos2/fichero_mercado/Formas_CreacionFichero.vue');
const Crear_EditarFichero = () => import('@/views/pedidos2/fichero_mercado/Crear_Editar_Fichero.vue');
import PopupHistoryMixin from '@/mixins/PopupHistoryMixin'
export default {
    mixins: [PopupHistoryMixin],
    data() {
        return {
            FicheroMercado: [],
            popupFicheroMercadoVisualizar: false,
            tabFicheroMercado: {},
            institucion_Enviar: {},
            Fichero_Array: [],
            filtroActivo: 'todos',
            totalCreados: 0,
            totalAprobados: 0,
            totalEnviadoParaAprobacion: 0,
            totalSinRegistro: 0,
            totalDevueltos: 0,
            totalGeneral: 0,
            VISTA_ActivoAbrirDetalle_Fichero: false,
            institucionSeleccionada: null,
            periodo_de_Root: {},
            periodosUnicos: [],
            periodoFiltroSeleccionado: null, // para el select
            popupActivoAprobacion_Fichero: false,
            popupActivoRechazar_Fichero: false,
            popupFicheroMercadoEnviar_Aprobacion: false,
            popupActivo_EliminarFichero: false,
            popupFicheroMercado: false,
            popupFormasCreacion: false,
            forceClosePopupFichero: false,
            overlayFichero: false,
            verificarcrear_actualizar: '',
        }
    },
    components: {
        'v-select': vSelect,
        Visualizar_FicheroMercado,
        Detalle_x_Institucion,
        ExportarExcel,
        Aprobacion_FicheroMercado,
        Rechazar_FicheroMercado,
        Enviar_para_aprobacion,
        Eliminar_FicheroMercado,
        Formas_CreacionFichero,
        Crear_EditarFichero
    },
    created() {
        let me = this;
        me.registerPopupHistory('popupFicheroMercadoVisualizar');
        me.registerPopupHistory('popupActivoAprobacion_Fichero');
        me.registerPopupHistory('popupActivoRechazar_Fichero');
        me.registerPopupHistory('popupFicheroMercadoEnviar_Aprobacion');
        me.registerPopupHistory('popupActivo_EliminarFichero');
        me.registerPopupHistory('popupFormasCreacion');
        me.registerPopupHistory('popupFicheroMercado');
    },
    mounted() {
        this.Traer_Instituciones_Fichero_Verificacion();
    },
    props: {
        periodoSeleccionado: {
            type: Object,
            default: () => ({})
        },
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'userAdministrador']),
    },
    methods: {
        Traer_Instituciones_Fichero_Verificacion() {
            if (this.userRoot == true) {
                this.get_Fichero_Mercado_ListaCompletaRoot();
            } else if (this.userAsesor == true) {
                this.get_Fichero_Mercado_ListaCompletaAsesores();
            }
        },
        getFicheroMercadoFiltrado() {
            let filtrado = this.FicheroMercado;

            // Filtrar por estado (igual para todos)
            switch (this.filtroActivo) {
                case 'creados':
                    filtrado = filtrado.filter(f => f.fm_estado == '1');
                    break;
                case 'enviado_para_aprobacion':
                    filtrado = filtrado.filter(f => f.fm_estado == '2');
                    break;
                case 'aprobados':
                    filtrado = filtrado.filter(f => f.fm_estado == '3');
                    break;
                case 'sinRegistro':
                    filtrado = filtrado.filter(f => f.fm_estado === null);
                    break;
                case 'devueltos':
                    filtrado = filtrado.filter(f => f.fm_estado == '4');
                    break;
            }

            // Filtrar por periodo solo si es root
            if (this.userRoot && this.periodoFiltroSeleccionado) {
                filtrado = filtrado.filter(f => f.idperiodoescolar === this.periodoFiltroSeleccionado.idperiodoescolar);
            }

            return filtrado;
        },
        seleccionarFiltro(tipo) {
            this.filtroActivo = tipo
            // Aquí puedes ejecutar tu método de filtrado global
        },
        seleccionarPeriodo(periodo) {
            this.periodoFiltroSeleccionado = periodo;
            // Puedes recargar datos si es necesario
            // this.Traer_Instituciones_Fichero_Verificacion(); // si quieres filtrar en backend
        },
        recargarDatos() {
            this.$emit('recargarDatos')
        },
        Accion_ExportarExcel() {
            this.$refs.exportarExcelRef.iniciarExportacionExcel();
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        async get_Fichero_Mercado_ListaCompletaAsesores() {
            let me = this;
            let usuariorespo = localStorage.getItem("usuario");
            let usuariolocal = JSON.parse(usuariorespo);
            me.$vs.loading();

            let enviardata = {
                action: 'Busqueda_get_Fichero_Mercado_Todo_x_Insitucion_y_Asesor',
                idperiodoescolar: me.periodoSeleccionado.idperiodoescolar,
                asesor_id: usuariolocal.idusuario,
                regionperiodo: me.periodoSeleccionado.region_idregion
            };
            try {
                let response = await me.$http.get(me.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: enviardata
                });
                let datos = response.data;

                // Mapear para asegurar estructura consistente para tabla
                me.FicheroMercado = datos.map(item => {
                    return {
                        idInstitucion: item.idInstitucion,
                        nombreInstitucion: item.nombreInstitucion,
                        direccionInstitucion: item.direccionInstitucion,
                        nombreprovincia: item.nombreprovincia,
                        nombre_ciudad: item.nombre_ciudad,
                        parr_nombre: item.parr_nombre,
                        fm_id: item.fm_id || null,
                        fm_estado: item.fm_estado !== null ? item.fm_estado : null, // 0 -> Inactivo si no hay fichero
                        fm_observacion: item.fm_observacion || '',
                        created_at: item.created_at || '-',
                        updated_at: item.updated_at || '-',
                        fecha_envio_aprobacion: item.fecha_envio_aprobacion || '-',
                        fecha_aprobacion: item.fecha_aprobacion || '-',
                        fecha_rechazo: item.fecha_rechazo || '-',
                        usercreated_nombres: item.usercreated_nombres,
                        usercreated_apellidos: item.usercreated_apellidos,
                        user_edit_nombres: item.user_edit_nombres,
                        user_edit_apellidos: item.user_edit_apellidos,
                        user_envia_nombres: item.user_envia_nombres,
                        user_envia_apellidos: item.user_envia_apellidos,
                        user_aprobacion_nombres: item.user_aprobacion_nombres,
                        user_aprobacion_apellidos: item.user_aprobacion_apellidos,
                        user_rechazo_nombres: item.user_rechazo_nombres,
                        user_rechazo_apellidos: item.user_rechazo_apellidos,
                        usuario_asesor: item.usuario_asesor,
                        comentario_rechazo: item.comentario_rechazo,
                        descripcion_periodoescolar: item.descripcion_periodoescolar,
                        idperiodoescolar: item.idperiodoescolar,
                        id_pedido: item.id_pedido || null,
                        estado_pedido: item.estado_pedido || null
                    };
                });
                // 🔹 Periodos unicos
                if (this.userRoot) {
                    this.periodosUnicos = [];
                    let mapaPeriodos = new Map();
                    this.FicheroMercado.forEach(item => {
                        if (!mapaPeriodos.has(item.idperiodoescolar)) {
                            mapaPeriodos.set(item.idperiodoescolar, item.descripcion_periodoescolar);
                            this.periodosUnicos.push({
                                idperiodoescolar: item.idperiodoescolar,
                                descripcion_periodoescolar: item.descripcion_periodoescolar
                            });
                        }
                    });
                    // No asignamos ningún valor a periodoFiltroSeleccionado
                    // this.periodoFiltroSeleccionado = null; ya está en data
                }
                // 🔹 Totales para filtros
                me.totalGeneral = me.FicheroMercado.length;
                me.totalAprobados = me.FicheroMercado.filter(f => f.fm_estado == '3').length;
                me.totalEnviadoParaAprobacion = me.FicheroMercado.filter(f => f.fm_estado == '2').length;
                me.totalCreados = me.FicheroMercado.filter(f => f.fm_estado == '1').length;
                me.totalSinRegistro = me.FicheroMercado.filter(f => f.fm_estado === null).length;
                me.totalDevueltos = me.FicheroMercado.filter(f => f.fm_estado == '4').length;

                me.$vs.loading.close();
            } catch (error) {
                me.$vs.loading.close();
                console.error('Error al buscar el fichero de mercado:', error);
                me.$vs.notify({
                    title: 'Error',
                    text: 'Error al buscar los datos',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        async get_Fichero_Mercado_ListaCompletaRoot() {
            let me = this;
            let usuariorespo = localStorage.getItem("usuario");
            let usuariolocal = JSON.parse(usuariorespo);
            me.$vs.loading();

            let enviardata = {
                action: 'Busqueda_get_Fichero_Mercado_Todo_Instituciones_Root',
                // idperiodoescolar: me.periodoSeleccionado.idperiodoescolar,
                asesor_id: usuariolocal.idusuario
            };
            try {
                let response = await me.$http.get(me.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: enviardata
                });
                let datos = response.data;

                // Mapear para asegurar estructura consistente para tabla
                me.FicheroMercado = datos.map(item => {
                    return {
                        idInstitucion: item.idInstitucion,
                        nombreInstitucion: item.nombreInstitucion,
                        direccionInstitucion: item.direccionInstitucion,
                        nombreprovincia: item.nombreprovincia,
                        nombre_ciudad: item.nombre_ciudad,
                        parr_nombre: item.parr_nombre,
                        fm_id: item.fm_id || null,
                        fm_estado: item.fm_estado !== null ? item.fm_estado : null, // 0 -> Inactivo si no hay fichero
                        fm_observacion: item.fm_observacion || '',
                        created_at: item.created_at || '-',
                        updated_at: item.updated_at || '-',
                        fecha_envio_aprobacion: item.fecha_envio_aprobacion || '-',
                        fecha_aprobacion: item.fecha_aprobacion || '-',
                        fecha_rechazo: item.fecha_rechazo || '-',
                        usercreated_nombres: item.usercreated_nombres,
                        usercreated_apellidos: item.usercreated_apellidos,
                        user_edit_nombres: item.user_edit_nombres,
                        user_edit_apellidos: item.user_edit_apellidos,
                        user_envia_nombres: item.user_envia_nombres,
                        user_envia_apellidos: item.user_envia_apellidos,
                        user_aprobacion_nombres: item.user_aprobacion_nombres,
                        user_aprobacion_apellidos: item.user_aprobacion_apellidos,
                        user_rechazo_nombres: item.user_rechazo_nombres,
                        user_rechazo_apellidos: item.user_rechazo_apellidos,
                        usuario_asesor: item.usuario_asesor,
                        comentario_rechazo: item.comentario_rechazo,
                        descripcion_periodoescolar: item.descripcion_periodoescolar,
                        idperiodoescolar: item.idperiodoescolar,
                        id_pedido: item.id_pedido || null,
                        estado_pedido: item.estado_pedido || null
                    };
                });
                // 🔹 Periodos unicos
                if (this.userRoot) {
                    this.periodosUnicos = [];
                    let mapaPeriodos = new Map();
                    this.FicheroMercado.forEach(item => {
                        if (!mapaPeriodos.has(item.idperiodoescolar)) {
                            mapaPeriodos.set(item.idperiodoescolar, item.descripcion_periodoescolar);
                            this.periodosUnicos.push({
                                idperiodoescolar: item.idperiodoescolar,
                                descripcion_periodoescolar: item.descripcion_periodoescolar
                            });
                        }
                    });
                    // No asignamos ningún valor a periodoFiltroSeleccionado
                    // this.periodoFiltroSeleccionado = null; ya está en data
                }
                // 🔹 Totales para filtros
                me.totalGeneral = me.FicheroMercado.length;
                me.totalAprobados = me.FicheroMercado.filter(f => f.fm_estado == '3').length;
                me.totalEnviadoParaAprobacion = me.FicheroMercado.filter(f => f.fm_estado == '2').length;
                me.totalCreados = me.FicheroMercado.filter(f => f.fm_estado == '1').length;
                me.totalSinRegistro = me.FicheroMercado.filter(f => f.fm_estado === null).length;
                me.totalDevueltos = me.FicheroMercado.filter(f => f.fm_estado == '4').length;

                me.$vs.loading.close();
            } catch (error) {
                me.$vs.loading.close();
                console.error('Error al buscar el fichero de mercado:', error);
                me.$vs.notify({
                    title: 'Error',
                    text: 'Error al buscar los datos',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        Visualizar_Fichero(datafila) {
            this.Fichero_Array = [datafila];
            this.periodo_de_Root = datafila;
            this.institucion_Enviar = datafila;
            this.popupFicheroMercadoVisualizar = true
        },
        cerrarPopupFicheroMercadoVisualizar() {
            let me = this;
            me.popupFicheroMercadoVisualizar = false;
            me.Traer_Instituciones_Fichero_Verificacion();
        },
        changeHandleFicheroMercadoVisualizar(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            me.Traer_Instituciones_Fichero_Verificacion();
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
                console.log("Emit recibido por enviado para aprobación.");
                me.popupFicheroMercadoVisualizar = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        popup_aprobar_AbrirDetalle_Fichero(tr) {
            // console.log(tr, "ffffff");
            this.institucionSeleccionada = tr; // la fila seleccionada
            this.periodo_de_Root = tr;
            this.VISTA_ActivoAbrirDetalle_Fichero = true; // muestra el detalle
            this.$emit('change', {
                verificar_ListadoFicheroCompleto: 'bloquearSelect'
            });
        },
        cerrarDetalle() {
            this.VISTA_ActivoAbrirDetalle_Fichero = false; // vuelve a mostrar la tabla
            this.Traer_Instituciones_Fichero_Verificacion();
            this.$emit('change', {
                verificar_ListadoFicheroCompleto: 'desbloquearSelect'
            });
        },
        //APROBACION O RECHAZO FICHERO
        popup_aprobar_FicheroMercado(tr) {
            this.Fichero_Array = [tr];
            this.institucion_Enviar = tr;
            this.tabFicheroMercado = tr;
            this.popupActivoAprobacion_Fichero = true;
        },
        popup_rechazar_FicheroMercado(tr) {
            this.Fichero_Array = [tr];
            this.institucion_Enviar = tr;
            this.tabFicheroMercado = tr;
            this.popupActivoRechazar_Fichero = true;
        },
        EnviarParaAprobacion(tr) {
            this.Fichero_Array = [tr];
            this.institucion_Enviar = tr;
            this.tabFicheroMercado = tr;
            this.popupFicheroMercadoEnviar_Aprobacion = true;
        },
        Eliminar_Fichero(tr) {
            this.Fichero_Array = [tr];
            this.popupActivo_EliminarFichero = true;
        },
        Abrir_CrearFichero(tr) {
            this.forceClosePopupFichero = false;
            this.Fichero_Array = [tr];
            this.institucion_Enviar = tr;
            this.periodo_de_Root = tr;
            this.verificarcrear_actualizar = 'crear';
            this.popupFormasCreacion = true;
        },
        Abrir_EditarFichero(tr) {
            this.forceClosePopupFichero = false;
            this.Fichero_Array = [tr];
            this.institucion_Enviar = tr;
            this.periodo_de_Root = tr;
            this.verificarcrear_actualizar = 'editar';
            this.popupFicheroMercado = true;
        },
        cerrarFormasCreacionManual() {
            this.forceClosePopupFichero = true;
            this.popupFormasCreacion = false;
        },
        changeHandleFormasCreacion(e) {
            let me = this;
            if (e.tipo === 'crear_vacio') {
                me.forceClosePopupFichero = true; // temporalmente para permitir el cambio
                me.popupFormasCreacion = false;
                // Pequeño delay para que el watcher no bloquee la transición
                setTimeout(() => {
                    me.forceClosePopupFichero = false;
                    me.popupFicheroMercado = true;
                }, 100);
            } else if (e.tipo === 'fichero_copiado') {
                me.forceClosePopupFichero = true;
                me.popupFormasCreacion = false;
                me.mostrarMensajeGenerandoFichero();
                // Esperar a que la UI se actualice
                setTimeout(() => {
                    me.Traer_Instituciones_Fichero_Verificacion();
                    setTimeout(() => {
                        me.ocultarMensajeGenerandoFichero();
                        me.$vs.notify({
                            title: 'Éxito',
                            text: 'Fichero copiado y listado actualizado.',
                            color: 'success',
                            icon: 'check_circle',
                            time: 4000
                        });
                    }, 1000);
                }, 500);
            }
        },
        mostrarMensajeGenerandoFichero() {
            this.overlayFichero = true;
            document.body.style.overflow = 'hidden';
            if (this.$vs && this.$vs.loading) {
                this.$vs.loading({
                    container: '#app',
                    scale: 0.6
                });
            }
        },
        ocultarMensajeGenerandoFichero() {
            this.overlayFichero = false;
            document.body.style.overflow = '';
            if (this.$vs && this.$vs.loading) {
                this.$vs.loading.close('#app > .con-vs-loading');
            }
        },
        cerrarPopupCrearEditar(forzarCerrar = false) {
            if (forzarCerrar) {
                this.forceClosePopupFichero = true;
                this.popupFicheroMercado = false;
                this.Traer_Instituciones_Fichero_Verificacion();
            } else {
                this.popupFicheroMercado = true;
            }
        },
        changeHandleCrearEditar_FicheroMercado(e) {
            let me = this;
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.forceClosePopupFichero = true;
                me.popupFicheroMercado = false;
                me.Traer_Instituciones_Fichero_Verificacion();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.forceClosePopupFichero = true;
                me.popupFicheroMercado = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEliminar_FicheroMercado(e) {
            let me = this;
            if (e.verificarficheromercado_Eliminar == 1) {
                console.log("Emit recibido por eliminado.");
                me.popupActivo_EliminarFichero = false;
                me.Traer_Instituciones_Fichero_Verificacion();
            } else if (e.verificarficheromercado_Eliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivo_EliminarFichero = false;
            } else {
                console.log("Emit no recibido");
            }
        },

        changeHandleAprobar_FicheroMercado(e) {
            let me = this;
            if (e.verificarficheromercado_Aprobacion == 1) {
                console.log("Emit recibido por aprobado.");
                me.popupActivoAprobacion_Fichero = false;
                me.Traer_Instituciones_Fichero_Verificacion();
            } else if (e.verificarficheromercado_Aprobacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoAprobacion_Fichero = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleRechazar_FicheroMercado(e) {
            let me = this;
            if (e.verificarficheromercado_Rechazar == 1) {
                console.log("Emit recibido por devuelto.");
                me.popupActivoRechazar_Fichero = false;
                me.Traer_Instituciones_Fichero_Verificacion();
            } else if (e.verificarficheromercado_Rechazar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoRechazar_Fichero = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleFicheroMercadoEnviar_Aprobacion(e) {
            let me = this;
            if (e.verificarficheromercado_enviar_para_Aprobacion == 1) {
                console.log("Emit recibido por aprobado.");
                me.popupFicheroMercadoEnviar_Aprobacion = false;
                me.Traer_Instituciones_Fichero_Verificacion();
            } else if (e.verificarficheromercado_enviar_para_Aprobacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupFicheroMercadoEnviar_Aprobacion = false;
            } else {
                console.log("Emit no recibido");
            }
        },
    },
    watch: {
        popupFicheroMercado(newVal) {
            if (!newVal) {
                if (this._isHistoryBack) {
                    this.Traer_Instituciones_Fichero_Verificacion();
                } else if (!this.forceClosePopupFichero) {
                    this.popupFicheroMercado = true;
                }
            }
        },
        popupFormasCreacion(newVal) {
            if (!newVal) {
                if (this._isHistoryBack) {
                    // Cierre por botón atrás
                } else if (!this.forceClosePopupFichero) {
                    this.popupFormasCreacion = true;
                }
            }
        },
        popupActivoAprobacion_Fichero(newVal) {
            if (!newVal) {
                this.popupActivoAprobacion_Fichero = false;
            }
        },
        popupActivoRechazar_Fichero(newVal) {
            if (!newVal) {
                this.popupActivoRechazar_Fichero = false;
            }
        },
        popupFicheroMercadoEnviar_Aprobacion(newVal) {
            if (!newVal) {
                this.popupFicheroMercadoEnviar_Aprobacion = false;
            }
        },
        popupActivo_EliminarFichero(newVal) {
            if (!newVal) {
                this.popupActivo_EliminarFichero = false;
            }
        },
        popupFicheroMercadoVisualizar(newVal) {
            if (!newVal) {
                console.log('🔴 popupFicheroMercadoVisualizar cerrado, ejecutando cleanup...');
                this.cerrarPopupFicheroMercadoVisualizar();
            }
        }
    }
}
</script>

<style scoped>
.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.menu-filtros-compact {
    background: white;
    border-radius: 12px;
    border: 1px solid #e6e6e6;
    padding: 10px;
}

.filtros-grid {
    display: grid;
    gap: 8px;
}

.filtro-card-compact {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    border-radius: 10px;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #d1d5db;
    /* borde sutil */
    text-align: center;
    font-size: 12px;
}

.filtro-card-compact:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
    background: #eef6ff;
    border-color: #007bff;
    /* borde al hover */
}

.filtro-card-compact.activo {
    background: #007bff;
    color: white;
    border-color: #0056b3;
    /* borde más oscuro para activo */
    box-shadow: 0 3px 10px rgba(0, 123, 255, 0.2);
}

.filtro-icon-compact {
    font-size: 20px;
    margin-bottom: 4px;
}

.filtro-label-compact {
    font-weight: 500;
    font-size: 12px;
}

.filtro-count-compact {
    font-size: 10px;
    opacity: 0.85;
}

/*MODO NIGHT*/
/* Fondo general de menú en night */
.night-menu-filtros {
    background: #1A1F4D;
    /* mismo fondo night de la tabla */
    border-color: #262C49;
    /* borde consistente con sticky night */
}

/* Tarjetas de filtro en night */
.night-filtro-card {
    background: #262C49;
    /* fondo oscuro */
    color: #e0e0e0;
    /* texto legible */
    border: 1px solid #2a2f5a;
    /* borde sutil pero visible */
}

.night-filtro-card.activo {
    background: #3B49A1;
    /* azul night resaltado */
    color: white;
    border-color: #3B49A1;
}

.night-filtro-card:hover {
    background: #303A87;
    /* hover más oscuro / contraste */
    border-color: #3B49A1;
    box-shadow: 0 3px 8px rgba(59, 73, 161, 0.3);
}

.chip {
    display: inline-block;
    min-width: 60px;
    text-align: center;
    border-radius: 16px;
    padding: 4px 12px;
    font-weight: bold;
    font-size: 10px;
    margin-bottom: 4px;
    color: #fff;
    /* texto blanco por defecto */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: background 0.3s, transform 0.2s;
}

/* 🎨 Colores sutiles */
.chip-primary {
    background-color: #1F74FF;
    /* azul */
    color: #fff;
}

.chip-success {
    background-color: #46C93A;
    /* verde */
    color: #fff;
}

.chip-danger {
    background-color: #FF4757;
    /* rojo */
    color: #fff;
}

.chip-warning {
    background-color: #FFBA00;
    /* amarillo */
    color: #000;
}

.chip-dark {
    background-color: #1E1E1E;
    /* gris oscuro */
    color: #fff;
}

.filtro-exportar {
    background: #46C93A;
    /* verde */
    color: white !important;
    border: 1px solid #3ab030;
}

.filtro-exportar:hover {
    transform: translateY(-2px);
    background: #3ab030;
    border-color: #2e8f26;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.hide-close .vs-popup--close {
    display: none;
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

/* CARGA ESTILOS DE OVERLAY */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
}

.dark .loading-overlay {
    background-color: rgba(16, 22, 58, 0.9);
}

.loading-content {
    background: white;
    padding: 2.5rem 3rem;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    border: 1px solid #e2e8f0;
}

.dark .loading-content {
    background: #10163A;
    border-color: #2d3748;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
</style>
