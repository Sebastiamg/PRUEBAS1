<template>
  <vx-card>
    <div class="tareas-container">
        <!-- Header simple -->
        <div class="table-header-simple">
            <!-- <h3>Tareas Pendientes</h3> -->
            <span class="task-counter-simple">{{ listaTareas.length }} tareas</span>
        </div>

        <vs-table
            max-items="15"
            search
            pagination
            :data="listaTareas"
            class="tabla-simple"
        >
            <!-- <template slot="header">
                <h4>Lista de Tareas</h4>
            </template> -->

            <template slot="thead">
                <vs-th sort-key="nombre" class="th-tarea">
                    Tarea
                </vs-th>
                <vs-th sort-key="fecha_inicio" class="th-fechas">
                    Fechas
                </vs-th>
                <vs-th class="text-center th-acciones">
                    Acciones
                </vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr
                    :key="indextr"
                    v-for="(tr, indextr) in data"
                    :class="getRowClass(data[indextr])"
                    class="tabla-row"
                >
                    <!-- Columna Tarea mejorada -->
                    <vs-td :data="data[indextr].nombre" class="td-tarea">
                        <div class="tarea-content">
                            <!-- Nombre del archivo con icono -->
                            <div class="tarea-header">
                                <div class="flex items-center">
                                    <div class="file-indicator" :class="hasAttachment(data[indextr]) ? 'has-file' : 'no-file'">
                                        <feather-icon
                                            :icon="hasAttachment(data[indextr]) ? 'PaperclipIcon' : 'FileTextIcon'"
                                            svgClasses="w-4 h-4"
                                        ></feather-icon>
                                    </div>
                                    <div class="archivo-info">
                                        <div>
                                            <span class="etiqueta">Archivo:</span>
                                            <span class="archivo-nombre">
                                                {{ data[indextr].nombre || 'No hay archivos subidos' }}
                                            </span>
                                        </div>
                                        <!-- Link de descarga integrado -->
                                        <a
                                            v-if="hasAttachment(data[indextr])"
                                            :href="$data_url+'tareas/'+data[indextr].url"
                                            target="_blank"
                                            class="download-link-inline"
                                        >
                                            <feather-icon icon="DownloadIcon" svgClasses="w-3 h-3 mr-1"></feather-icon>
                                            Descargar
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Descripción simple -->
                            <div class="descripcion-simple">
                                <span class="etiqueta">Descripción:</span>
                                {{ data[indextr].descripcion || 'Sin descripción' }}
                            </div>
                        </div>
                    </vs-td>

                    <!-- Columna Fechas mejorada -->
                    <vs-td :data="data[indextr].fecha_inicio" class="td-fechas">
                        <div class="fechas-content">
                            <div class="fecha-item fecha-inicio">
                                <feather-icon icon="PlayIcon" svgClasses="w-3 h-3 mr-1 text-green-500"></feather-icon>
                                <span class="fecha-label">Inicio:</span>
                                <span class="fecha-valor">{{ formatDate(data[indextr].fecha_inicio) }}</span>
                            </div>
                            <div class="fecha-item fecha-entrega">
                                <feather-icon icon="FlagIcon" svgClasses="w-3 h-3 mr-1 text-red-500"></feather-icon>
                                <span class="fecha-label">Entrega:</span>
                                <span class="fecha-valor" :class="getDateClass(data[indextr].fecha_final)">
                                    {{ formatDate(data[indextr].fecha_final) }}
                                </span>
                            </div>
                        </div>
                    </vs-td>

                    <!-- Columna Acciones mejorada -->
                    <vs-td :data="tr.idtarea" class="text-center td-acciones">
                        <div class="acciones-content">
                            <vs-button
                                color="primary"
                                type="filled"
                                size="small"
                                @click="realizar(tr)"
                                class="btn-enviar"
                            >
                                <feather-icon icon="SendIcon" svgClasses="w-4 h-4 mr-1"></feather-icon>
                                Enviar
                            </vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
  </vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Datepicker from 'vuejs-datepicker';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        Datepicker,
        flatPickr
    },
    data() {
        return {
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            datei: null,
            datef: null,
            activePrompt: false,
            activePrompt2: false,
            listaTareas: [],
            listaContenido: [],
            usuario: [],
            tarea: {},
            idcurso: ''
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.idcurso = localStorage.getItem('idcurso')
    },
    mounted() {
        this.getTareas();
    },
    methods: {
        getTareas(id) {
            let me = this;
            console.log('pendientes')
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"tareaEstudiantePendiente?idcurso=" + me.idcurso + "&idusuario=" + me.usuario.idusuario;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    //console.log(respuesta);
                    me.listaTareas = response.data || [];
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.listaTareas = [];
                    me.$vs.loading.close()
                });
        },
        realizar(item){
            console.log(item)
            localStorage.idtarea = item.idtarea;
            localStorage.nombre = item.nombre;
            localStorage.url = item.url;
            localStorage.descripcion = item.descripcion;
            localStorage.fecha_inicio = item.fecha_inicio;
            localStorage.fecha_final = item.fecha_final;
            this.$router.push('/estudiante/tarea');
        },
        foro(item){
            localStorage.idtarea = item.idtarea;
            localStorage.nombre = item.nombre;
            localStorage.url = item.url;
            localStorage.descripcion = item.descripcion;
            localStorage.fecha_inicio = item.fecha_inicio;
            localStorage.fecha_final = item.fecha_final;
            this.$router.push('/estudiante/foro');
        },
        // Métodos auxiliares para mejorar la tabla
        hasAttachment(tarea) {
            return tarea && tarea.url && tarea.url.trim() !== '';
        },
        truncateText(text, maxLength) {
            if (!text) return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },
        formatDate(dateString) {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            } catch (error) {
                return dateString;
            }
        },
        getRowClass(tarea) {
            const now = new Date();
            const endDate = new Date(tarea.fecha_final);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) return 'row-urgent';
            if (diffDays <= 3) return 'row-warning';
            return 'row-normal';
        },
        getPriorityClass(tarea) {
            const now = new Date();
            const endDate = new Date(tarea.fecha_final);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) return 'priority-high';
            if (diffDays <= 3) return 'priority-medium';
            return 'priority-low';
        },
        getPriorityText(tarea) {
            const now = new Date();
            const endDate = new Date(tarea.fecha_final);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 0) return 'Vencida';
            if (diffDays <= 1) return 'Urgente';
            if (diffDays <= 3) return 'Próxima';
            return 'Normal';
        },
        getDateClass(dateString) {
            const now = new Date();
            const endDate = new Date(dateString);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) return 'fecha-urgente';
            if (diffDays <= 3) return 'fecha-advertencia';
            return 'fecha-normal';
        },
        getTimeRemaining(dateString) {
            if (!dateString) return 'Sin fecha';

            const now = new Date();
            const endDate = new Date(dateString);
            const diffMs = endDate - now;

            if (diffMs <= 0) return 'Vencida';

            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

            if (diffDays >= 1) {
                return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
            } else {
                return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
            }
        },
        getTimeClass(tarea) {
            const now = new Date();
            const endDate = new Date(tarea.fecha_final);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) return 'tiempo-urgente';
            if (diffDays <= 3) return 'tiempo-advertencia';
            return 'tiempo-normal';
        },
        getProgressClass(tarea) {
            const now = new Date();
            const endDate = new Date(tarea.fecha_final);
            const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) return 'progress-red';
            if (diffDays <= 3) return 'progress-yellow';
            return 'progress-green';
        },
        getProgressWidth(tarea) {
            if (!tarea.fecha_inicio || !tarea.fecha_final) return 0;

            const now = new Date();
            const start = new Date(tarea.fecha_inicio);
            const end = new Date(tarea.fecha_final);

            const totalTime = end - start;
            const elapsedTime = now - start;

            if (elapsedTime <= 0) return 0;
            if (elapsedTime >= totalTime) return 100;

            return Math.round((elapsedTime / totalTime) * 100);
        }
    },
}
</script>

<style scoped>
/* Contenedor principal */
.tareas-container {
    padding: 20px;
    background: white;
}

/* Header simple */
.table-header-simple {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px 0;
    border-bottom: 1px solid #e5e7eb;
}

.table-header-simple h3 {
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin: 0;
}

.task-counter-simple {
    background: #f3f4f6;
    color: #6b7280;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

/* Tabla simple */
.tabla-simple {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

/* Headers de columnas */
.th-tarea { width: 50%; }
.th-fechas { width: 30%; }
.th-acciones { width: 20%; }

/* Filas de la tabla */
.tabla-row {
    border-bottom: 1px solid #f3f4f6;
}

.row-urgent {
    border-left: 3px solid #ef4444;
}

.row-warning {
    border-left: 3px solid #f59e0b;
}

.row-normal {
    border-left: 3px solid #10b981;
}

/* Columna Tarea */
.td-tarea {
    padding: 16px !important;
}

.tarea-content {
    max-width: 100%;
}

.tarea-header {
    margin-bottom: 10px;
}

.archivo-info {
    flex: 1;
    margin-left: 10px;
}

.archivo-nombre {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.etiqueta {
    font-weight: 600;
    color: #6b7280;
    margin-right: 8px;
}

.download-link-inline {
    display: inline-flex;
    align-items: center;
    color: #3b82f6;
    font-size: 11px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: rgba(59, 130, 246, 0.1);
}

.download-link-inline:hover {
    color: #1d4ed8;
    background-color: rgba(59, 130, 246, 0.2);
}

.descripcion-simple {
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
    margin-top: 8px;
    padding: 8px 0;
    border-top: 1px solid #f3f4f6;
    font-style: italic;
}

.file-indicator {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.file-indicator.has-file {
    background-color: #dbeafe;
    color: #2563eb;
    border: 1px solid #bfdbfe;
}

.file-indicator.no-file {
    background-color: #f9fafb;
    color: #6b7280;
    border: 1px solid #e5e7eb;
}

/* Columna Fechas */
.td-fechas {
    padding: 16px !important;
}

.fechas-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.fecha-item {
    display: flex;
    align-items: center;
    font-size: 12px;
}

.fecha-label {
    color: #6b7280;
    margin-right: 4px;
    font-weight: 500;
}

.fecha-valor {
    font-weight: 600;
    color: #111827;
}

.fecha-urgente {
    color: #dc2626 !important;
    font-weight: 700 !important;
}

.fecha-advertencia {
    color: #d97706 !important;
    font-weight: 600 !important;
}

.fecha-normal {
    color: #059669 !important;
}

/* Columna Acciones */
.td-acciones {
    padding: 16px !important;
}

.acciones-content {
    display: flex;
    justify-content: center;
}

.btn-enviar {
    transition: all 0.3s ease;
    font-weight: 600;
    border-radius: 8px;
}

.btn-enviar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Animaciones */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

/* Utilidades */
.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.mb-4 {
    margin-bottom: 16px;
}

.ml-3 {
    margin-left: 12px;
}

.mr-1 {
    margin-right: 4px;
}

.mr-2 {
    margin-right: 8px;
}

.mr-3 {
    margin-right: 12px;
}

.w-3 {
    width: 12px;
}

.w-4 {
    width: 16px;
}

.w-5 {
    width: 20px;
}

.w-6 {
    width: 24px;
}

.h-3 {
    height: 12px;
}

.h-4 {
    height: 16px;
}

.h-5 {
    height: 20px;
}

.h-6 {
    height: 24px;
}

.text-center {
    text-align: center;
}

.text-green-500 {
    color: #10b981;
}

.text-red-500 {
    color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
    .tareas-container {
        padding: 10px;
    }

    .table-header {
        padding: 15px;
    }

    .title-gradient {
        font-size: 20px;
    }

    .tarea-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .fechas-content {
        gap: 4px;
    }

    .th-tarea { width: 55%; }
    .th-fechas { width: 30%; }
    .th-acciones { width: 15%; }
}

@media (max-width: 640px) {
    .btn-enviar {
        padding: 8px 12px;
        font-size: 12px;
    }
}
</style>
