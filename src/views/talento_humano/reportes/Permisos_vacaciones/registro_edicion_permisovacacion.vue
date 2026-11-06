<template>
<vx-card fixed-height="true" class="pv-card">

    <!-- ══════════════════════════════════════════
       ENCABEZADO
  ══════════════════════════════════════════ -->
    <!-- <div class="section-header">
    <span class="section-icon">📋</span>
    <span>Encabezado</span>
  </div> -->

    <!-- Info banners -->
    <!-- <div class="info-banners" style="margin-bottom: 20px;">
        <div class="info-banner danger">
            <span class="info-banner-icon">⚠️</span>
            <div>
                <strong>IMPORTANTE:</strong> Una vez guardada la solicitud, debe ser <b>impresa y entregada</b> a Talento Humano con las firmas correspondientes <b>antes de salir</b> al permiso o vacaciones.
            </div>
        </div>
    </div> -->

    <!-- TIPO SOLICITUD -->
    <div class="form-row">
        <div class="form-col full">
            <label class="field-label">Tipo de Solicitud</label>
            <div class="radio-group">
                <label :class="['radio-card', nuevoarray.tpe_tipo_solicitud === '0' ? 'active' : '']">
                    <input type="radio" v-model="nuevoarray.tpe_tipo_solicitud" value="0" />
                    <span class="radio-icon">🕐</span>
                    <span>Permiso</span>
                </label>
                <label :class="['radio-card', nuevoarray.tpe_tipo_solicitud === '1' ? 'active' : '']">
                    <input type="radio" v-model="nuevoarray.tpe_tipo_solicitud" value="1" />
                    <span class="radio-icon">🏖️</span>
                    <span>Vacación</span>
                </label>
            </div>
        </div>
    </div>

    <!-- SUBTIPO (solo permiso) -->
    <div class="form-row" v-if="nuevoarray.tpe_tipo_solicitud === '0'">
        <div class="form-col half">
            <label class="field-label">Causa del Permiso</label>
            <div class="custom-select-wrapper" ref="selectWrapper">
                <div :class="['custom-select-trigger', selectOpen ? 'open' : '']" @click="toggleSelect">
                    <span v-if="selectedSubtipoLabel" class="trigger-value">
                        <span v-if="isEspecial(nuevoarray.tpe_subtipo_permiso)" class="badge-especial">✦</span>
                        {{ selectedSubtipoLabel }}
                    </span>
                    <span v-else class="trigger-placeholder">Seleccione una causa...</span>
                    <svg class="trigger-arrow" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div v-if="selectOpen" class="custom-select-dropdown">
                    <div class="dropdown-search">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="search-icon">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                        <input v-model="searchSubtipo" placeholder="Buscar causa..." class="dropdown-search-input" @click.stop ref="searchInput" />
                    </div>
                    <div class="dropdown-group" v-if="filteredSimples.length">
                        <div class="group-label">PERMISOS SIMPLES</div>
                        <div v-for="opt in filteredSimples" :key="opt.value" :class="['dropdown-item', nuevoarray.tpe_subtipo_permiso == opt.value ? 'selected' : '']" @click="selectSubtipo(opt.value)">
                            {{ opt.label }}
                        </div>
                    </div>
                    <div class="dropdown-group" v-if="filteredEspeciales.length">
                        <div class="group-label especial">PERMISOS ESPECIALES <span>✦</span></div>
                        <div v-for="opt in filteredEspeciales" :key="opt.value" :class="['dropdown-item', nuevoarray.tpe_subtipo_permiso == opt.value ? 'selected' : '']" @click="selectSubtipo(opt.value)">
                            {{ opt.label }}
                        </div>
                    </div>
                    <div v-if="!filteredSimples.length && !filteredEspeciales.length" class="dropdown-empty">
                        Sin resultados
                    </div>
                </div>
            </div>
        </div>

        <!-- CAUSA OTRO -->
        <div class="form-col half" v-if="nuevoarray.tpe_subtipo_permiso == '5'">
            <label class="field-label">Especifique otra causa</label>
            <textarea v-model="nuevoarray.tpe_p_causa_otro" placeholder="Escriba la causa..." class="auto-textarea" @input="autoResize($event)"></textarea>
        </div>
    </div>

    <!-- OBSERVACIONES GENERALES se mueve dentro de cada sección de detalle -->

    <div v-if="nuevoarray.tpe_tipo_solicitud == '1' || nuevoarray.tpe_subtipo_permiso">
        <!-- ══════════════════════════════════════════
         DETALLE
    ══════════════════════════════════════════ -->
        <div class="section-header" style="margin-top:28px;">
            <span>Detalle</span>
        </div>

        <!-- VACACIÓN: formulario completo -->
        <div v-if="nuevoarray.tpe_tipo_solicitud === '1' && nuevoarray.detalles.length > 0" class="vac-form-card">
            <!-- Fila 1: Nombre y días -->
            <div class="vac-prose-line">
                <span class="vac-text">Autorizamos al Sr.(a)</span>
                <div class="vac-field-inline" style="flex:2; min-width:200px;">
                    <input type="text" :value="nombreSolicitante" placeholder="Seleccione un solicitante para llenar..." class="vac-underline-input" readonly />
                    <!-- <label class="vac-field-hint">Nombre del empleado (Auto)</label> -->
                </div>
                <span class="vac-text">, para que haga uso de sus vacaciones de</span>
                <vx-tooltip text="Seleccione Fecha Inicio y Fin">
                    <div class="vac-field-inline" style="flex:0 0 150px;">
                        <input type="number" v-model="nuevoarray.tpe_p_v_total_dias" placeholder="0" readonly class="vac-underline-input text-center" style="width:150px; color: #2563eb; font-weight: 800;" />
                        <label class="vac-field-hint" style="color: #2563eb;">Cálculo automático</label>
                    </div>
                </vx-tooltip>
                <span class="vac-text">días que tiene derecho, de acuerdo a las disposiciones del Código de Trabajo.</span>
            </div>

            <!-- Fila 2: Fechas -->
            <div class="vac-prose-line">
                <span class="vac-text">Desde</span>
                <div class="vac-field-inline" style="flex:0 0 180px;">
                    <flat-pickr v-model="nuevoarray.detalles[0].tpd_v_fecha_desde" :config="configFecha" placeholder="Fecha inicio" class="vac-underline-input text-center" @on-change="calcularDiasVacaciones" />
                    <!-- <label class="vac-field-hint">Fecha inicio</label> -->
                </div>
                <span class="vac-text">hasta</span>
                <div class="vac-field-inline" style="flex:0 0 180px;">
                    <flat-pickr v-model="nuevoarray.detalles[0].tpd_v_fecha_hasta" :config="configFecha" placeholder="Fecha fin" class="vac-underline-input text-center" @on-change="calcularDiasVacaciones" />
                    <!-- <label class="vac-field-hint">Fecha fin</label> -->
                </div>
                <span class="vac-text">.</span>
            </div>

            <!-- Fila 3: Período -->
            <div class="vac-prose-line">
                <span class="vac-text">Estas vacaciones se aplican al período de trabajo:</span>
                <div class="vac-field-inline" style="flex:0 0 180px;">
                    <input type="text" v-model="nuevoarray.detalles[0].tpd_v_periodo" placeholder="Ej. 2024-2025" maxlength="40" class="vac-underline-input text-center" />
                    <!-- <label class="vac-field-hint">Período</label> -->
                </div>
            </div>

            <!-- Fila 4: Saldo -->
            <div class="vac-prose-line">
                <span class="vac-text">Saldo de vacaciones pendientes:</span>
                <div class="vac-field-inline" style="flex:0 0 120px;">
                    <input type="number" v-model="nuevoarray.detalles[0].tpd_v_saldo_pendiente" placeholder="Días" min="0" class="vac-underline-input text-center" />
                    <!-- <label class="vac-field-hint">Días pendientes</label> -->
                </div>
            </div>

            <!-- Fila 5: Observaciones -->
            <div class="vac-obs-section">
                <label class="vac-obs-label">OBSERVACIONES:</label>
                <textarea v-model="nuevoarray.tpe_p_v_obs_general" placeholder="Detalle cualquier observación..." class="auto-textarea vac-obs-textarea" @input="autoResize($event)"></textarea>
            </div>
        </div>

        <!-- CARGO A VACACIONES: chips de fechas -->
        <div v-else-if="nuevoarray.tpe_tipo_solicitud == '0' && nuevoarray.tpe_subtipo_permiso == '2'">
            <div class="form-row" style="align-items:flex-end;">
                <div class="form-col" style="flex:0 0 auto;">
                    <label class="field-label">Agregar fecha</label>
                    <flat-pickr v-model="nuevaFechaCargo" :config="configFecha" placeholder="Seleccione fecha" class="date-input" style="width:200px;" />
                </div>
                <div class="form-col" style="flex:0 0 auto; padding-bottom:4px;">
                    <button class="btn-add-fecha" @click="addFechaCargo">
                        <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                        Añadir
                    </button>
                </div>
            </div>
            <div class="chips-container">
                <div v-for="(f, i) in nuevoarray.detalles" :key="i" class="chip">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:13px;height:13px;opacity:.6;">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                    <span>{{ formatFecha(f.tpd_p_fecha) }}</span>
                    <span class="chip-remove" @click="removeFechaCargo(i)">×</span>
                </div>
                <span v-if="nuevoarray.detalles.length === 0" class="chips-empty">Sin fechas agregadas</span>
            </div>
            <!-- TOTAL AUTOMÁTICO -->
            <div class="cargo-total-bar">
                <span class="cargo-total-label">TOTAL DÍAS CARGO:</span>
                <span class="cargo-total-value">{{ nuevoarray.detalles.length }}</span>
                <span class="cargo-total-unit">{{ nuevoarray.detalles.length === 1 ? 'día' : 'días' }}</span>
            </div>
        </div>

        <!-- PERMISO NORMAL / OTRO / INSTITUCIONAL: tabla -->
        <div v-else-if="nuevoarray.tpe_tipo_solicitud == '0' && (nuevoarray.tpe_subtipo_permiso == '0' || nuevoarray.tpe_subtipo_permiso == '1' || nuevoarray.tpe_subtipo_permiso == '3' || nuevoarray.tpe_subtipo_permiso == '4' || nuevoarray.tpe_subtipo_permiso == '5')">
            <div style="margin-bottom:12px;">
                <button class="btn-add-row" @click="addDetalleRow">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                    Agregar Fila
                </button>
            </div>
            <div class="table-wrapper">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Día</th>
                            <th>Hora Salida</th>
                            <th>Hora Entrada</th>
                            <th v-if="nuevoarray.tpe_subtipo_permiso == '3'">Actividad</th>
                            <th style="width:60px;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in nuevoarray.detalles" :key="index">
                            <td>
                                <flat-pickr v-model="row.tpd_p_fecha" :config="configFecha" placeholder="Fecha" class="table-input" @on-change="updateDia(index)" />
                            </td>
                            <td>
                                <span :class="['dia-badge', getDiaBadgeClass(row.diaTexto)]">{{ row.diaTexto || '—' }}</span>
                            </td>
                            <td>
                                <input type="time" class="table-input" v-model="row.tpd_p_hora_salida" />
                            </td>
                            <td>
                                <input type="time" class="table-input" v-model="row.tpd_p_hora_entrada" />
                            </td>
                            <td v-if="nuevoarray.tpe_subtipo_permiso == '3'">
                                <textarea v-model="row.tpd_p_actividad" placeholder="Actividad..." class="auto-textarea table-textarea" rows="1" @input="autoResize($event)"></textarea>
                            </td>
                            <td align="center">
                                <button class="btn-delete-row" @click="removeDetalleRow(index)" title="Eliminar fila">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="nuevoarray.detalles.length === 0">
                            <td :colspan="nuevoarray.tpe_subtipo_permiso === '4' ? 6 : 5" class="table-empty">
                                Sin filas. Haga clic en "Agregar Fila" para comenzar.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- OBSERVACIONES GENERALES -->
            <div class="form-row" style="margin-top:16px;">
                <div class="form-col full">
                    <label class="field-label">Observaciones generales</label>
                    <textarea v-model="nuevoarray.tpe_p_v_obs_general" placeholder="Observaciones..." class="auto-textarea" @input="autoResize($event)"></textarea>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════
       PERSONAS (Solicitado / Autorizado / Registrado)
  ══════════════════════════════════════════ -->
        <div class="section-header" style="margin-top:28px;">
            <span class="section-icon">👥</span>
            <span>Personas Involucradas</span>
        </div>

        <div class="personas-grid">
            <!-- SOLICITADO POR -->
            <div class="persona-card">
                <div class="persona-card-header solicitado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
                    Solicitado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">Usuario</label>
                    <v-select ref="tpe_solicitado_por" v-model="nuevoarray.tpe_solicitado_por" :options="listaUsuarios" :reduce="u => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" :class="classvalidar_tpe_solicitado_por" :disabled="isRouteTalentoHumano" />
                    <label class="field-label mt-2">Departamento</label>
                    <v-select ref="tpe_solicitado_departamento" v-model="nuevoarray.tpe_solicitado_departamento" :options="departamentos" :reduce="d => d.value" label="label" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" :class="classvalidar_tpe_solicitado_departamento" />
                </div>
            </div>

            <!-- AUTORIZADO POR -->
            <div class="persona-card">
                <div class="persona-card-header autorizado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                    Autorizado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">Usuario</label>
                    <v-select ref="tpe_autorizado_por" v-model="nuevoarray.tpe_autorizado_por" :options="listaJefes" :reduce="u => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" :class="classvalidar_tpe_autorizado_por" />
                    <label class="field-label mt-2">Departamento</label>
                    <v-select ref="tpe_autorizado_departamento" v-model="nuevoarray.tpe_autorizado_departamento" :options="departamentos" :reduce="d => d.value" label="label" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" :class="classvalidar_tpe_autorizado_departamento" />
                </div>
            </div>

            <!-- REGISTRADO POR -->
            <div class="persona-card">
                <div class="persona-card-header registrado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    Registrado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">Usuario</label>
                    <v-select ref="tpe_registrado_por" v-model="nuevoarray.tpe_registrado_por" :options="listaUsuarios" :reduce="u => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" :class="classvalidar_tpe_registrado_por" :disabled="isRouteTalentoHumano" />
                    <label class="field-label mt-2">Departamento</label>
                    <v-select ref="tpe_registrado_departamento" v-model="nuevoarray.tpe_registrado_departamento" :options="departamentos" :reduce="d => d.value" label="label" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" :class="classvalidar_tpe_registrado_departamento" :disabled="isRouteTalentoHumano" />
                </div>
            </div>
        </div>
    </div>

    <!-- ESTADO DE ESPERA: Cuando no se ha seleccionado causa -->
    <div v-else class="waiting-selection-card">
        <div class="waiting-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="waiting-svg">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        </div>
        <h3 class="waiting-title">Esperando selección</h3>
        <p class="waiting-text">Por favor, seleccione una <b>causa del permiso</b> arriba para cargar el formulario y el formato de detalle correspondiente.</p>
    </div>

    <!-- ══════════════════════════════════════════
       ACCIONES
  ══════════════════════════════════════════ -->
    <div class="actions-bar">
        <button class="btn-guardar" @click="guardar()">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px;">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
            </svg>
            Guardar
        </button>
        <button class="btn-cancelar" @click="getCancelar()">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px;">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Cancelar
        </button>
    </div>

</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    Spanish
} from 'flatpickr/dist/l10n/es.js';

export default {
    components: {
        "v-select": vSelect,
        flatPickr
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: ''
        },
        tab_Permiso: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            diasSemana: ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"],
            listaUsuarios: [],
            listaJefes: [],
            departamentos: [],
            isRouteTalentoHumano: false,
            isLoaded: false,
            nuevaFechaCargo: '',
            selectOpen: false,
            searchSubtipo: '',
            configFecha: {
                altInput: true,
                altFormat: 'Y-F-d',
                dateFormat: 'Y-m-d',
                locale: Spanish,
                allowInput: false,
            },
            // Grupos del select
            opcionesSimples: [{
                    value: '0',
                    label: 'Calamidad Doméstica'
                },
                {
                    value: '1',
                    label: 'Citas Médicas'
                },
                {
                    value: '4',
                    label: 'Asuntos Personales'
                },
                {
                    value: '5',
                    label: 'Otro'
                },
            ],
            opcionesEspeciales: [{
                    value: '2',
                    label: 'Cargo a vacaciones'
                },
                {
                    value: '3',
                    label: 'Permiso Institucional'
                },
            ],
            nuevoarray: {
                tpe_id: 0,
                tpe_tipo_solicitud: '0',
                tpe_subtipo_permiso: '0',
                tpe_p_causa_otro: '',
                tpe_p_v_total_dias: null,
                tpe_p_v_obs_general: '',
                tpe_solicitado_por: null,
                tpe_solicitado_departamento: null,
                tpe_autorizado_por: null,
                tpe_autorizado_departamento: null,
                tpe_registrado_por: null,
                tpe_registrado_departamento: null,
                created_by: '',
                updated_by: '',
                detalles: [],
            },
            classvalidar_tpe_solicitado_por: '',
            classvalidar_tpe_solicitado_departamento: '',
            classvalidar_tpe_autorizado_por: '',
            classvalidar_tpe_autorizado_departamento: '',
            classvalidar_tpe_registrado_por: '',
            classvalidar_tpe_registrado_departamento: '',
        };
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        allOpciones() {
            return [...this.opcionesSimples, ...this.opcionesEspeciales];
        },
        selectedSubtipoLabel() {
            const val = this.nuevoarray.tpe_subtipo_permiso;
            const found = this.allOpciones.find(o => o.value == val);
            return found ? found.label : '';
        },
        filteredSimples() {
            const q = this.searchSubtipo.toLowerCase();
            return this.opcionesSimples.filter(o => o.label.toLowerCase().includes(q));
        },
        filteredEspeciales() {
            const q = this.searchSubtipo.toLowerCase();
            return this.opcionesEspeciales.filter(o => o.label.toLowerCase().includes(q));
        },
        nombreSolicitante() {
            const found = this.listaUsuarios.find(u => u.idusuario == this.nuevoarray.tpe_solicitado_por);
            return found ? `${found.nombres} ${found.apellidos}` : '';
        },
    },
    watch: {
        'nuevoarray.tpe_tipo_solicitud'(val) {
            if (!this.isLoaded) return;
            // Limpiar campos del encabezado al cambiar tipo
            this.nuevoarray.tpe_subtipo_permiso = null;
            this.nuevoarray.tpe_p_causa_otro = '';
            this.nuevoarray.tpe_p_v_obs_general = '';
            this.nuevoarray.tpe_p_v_total_dias = null;
            this.nuevoarray.detalles = [];
            if (val === '1') {
                this.nuevoarray.detalles = [this.emptyVacacionRow()];
            } else this.addDetalleRow();
        },
        'nuevoarray.tpe_solicitado_por'(val) {
            if (!this.isLoaded) return;
        },
        'nuevoarray.tpe_subtipo_permiso'(val, oldVal) {
            if (!this.isLoaded) return;

            // Si cambia entre tipos simples (0, 1, 4, 5), no resetear detalles ya que son compatibles
            const simples = ['0', '1', '4', '5'];
            if (simples.includes(val) && simples.includes(oldVal)) return;

            this.nuevoarray.detalles = [];
            if (val != '2') this.addDetalleRow();
        },
    },
    mounted() {
        let user = {};
        try {
            const userPlatform = JSON.parse(localStorage.getItem('usuario'));
            const userProlipa = JSON.parse(localStorage.getItem('userProlipa'));
            let currentPath = this.$route.path;
            if (currentPath.includes('/reportes_talento_humano')) {
                user = userPlatform || {};
                this.isRouteTalentoHumano = false;
            } else if (currentPath.includes('/talento-humano/reportes')) {
                user = userProlipa || {};
                this.isRouteTalentoHumano = true;
            } else {
                user = userPlatform || userProlipa || {};
                this.isRouteTalentoHumano = false;
            }
        } catch (error) {}
        this.getUsuariosGrupo36();
        this.getJefesArea();
        this.getDepartamentosActivos();
        document.addEventListener('click', this.handleOutsideClick);

        if (this.verificarcrear_actualizar === 'create') {
            this.nuevoarray = {
                tpe_id: 0,
                tpe_tipo_solicitud: '0',
                tpe_subtipo_permiso: null,
                tpe_p_causa_otro: '',
                tpe_p_v_total_dias: null,
                tpe_p_v_obs_general: '',
                tpe_solicitado_por: null,
                tpe_solicitado_departamento: null,
                tpe_autorizado_por: null,
                tpe_autorizado_departamento: null,
                tpe_registrado_por: 94960,
                tpe_registrado_departamento: 4,
                created_by: user.idusuario,
                updated_by: user.idusuario,
                detalles: [this.emptyDetalleRow()],
            };

            let currentPath = this.$route.path;
            if (currentPath.includes('/reportes_talento_humano')) {
                this.nuevoarray.tpe_solicitado_por = null;
            } else if (currentPath.includes('/talento-humano/reportes')) {
                this.nuevoarray.tpe_solicitado_por = user.idusuario;
            } else {
                this.nuevoarray.tpe_solicitado_por = null;
            }

            this.isLoaded = true;
        } else if (this.verificarcrear_actualizar === 'update') {
            const t = this.tab_Permiso;
            this.nuevoarray.tpe_id = t.tpe_id;
            this.nuevoarray.tpe_tipo_solicitud = String(t.tpe_tipo_solicitud || '0');
            this.nuevoarray.tpe_subtipo_permiso = String(t.tpe_subtipo_permiso || '0');
            this.nuevoarray.tpe_p_causa_otro = t.tpe_p_causa_otro || '';
            this.nuevoarray.tpe_p_v_total_dias = t.tpe_p_v_total_dias || null;
            this.nuevoarray.tpe_p_v_obs_general = t.tpe_p_v_obs_general || '';
            this.nuevoarray.tpe_solicitado_por = t.tpe_solicitado_por ? Number(t.tpe_solicitado_por) : null;
            this.nuevoarray.tpe_solicitado_departamento = t.tpe_solicitado_departamento ? Number(t.tpe_solicitado_departamento) : null;
            this.nuevoarray.tpe_autorizado_por = t.tpe_autorizado_por ? Number(t.tpe_autorizado_por) : null;
            this.nuevoarray.tpe_autorizado_departamento = t.tpe_autorizado_departamento ? Number(t.tpe_autorizado_departamento) : null;
            this.nuevoarray.tpe_registrado_por = t.tpe_registrado_por ? Number(t.tpe_registrado_por) : null;
            this.nuevoarray.tpe_registrado_departamento = t.tpe_registrado_departamento ? Number(t.tpe_registrado_departamento) : null;
            this.nuevoarray.updated_by = user.idusuario;
            this.getDetalles();
            // isLoaded se activará dentro de getDetalles para asegurar que todo esté listo
        } else {
            this.isLoaded = true;
        }
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
    },
    updated() {
        this.$nextTick(() => {
            document.querySelectorAll('textarea').forEach(el => {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            });
        });
    },
    methods: {
        // ── Select personalizado ──────────────────────────────
        toggleSelect() {
            this.selectOpen = !this.selectOpen;
            if (this.selectOpen) {
                this.searchSubtipo = '';
                this.$nextTick(() => {
                    if (this.$refs.searchInput) this.$refs.searchInput.focus();
                });
            }
        },
        selectSubtipo(val) {
            this.nuevoarray.tpe_subtipo_permiso = String(val);
            this.selectOpen = false;
            this.searchSubtipo = '';
        },
        handleOutsideClick(e) {
            if (this.$refs.selectWrapper && !this.$refs.selectWrapper.contains(e.target)) {
                this.selectOpen = false;
            }
        },
        isEspecial(val) {
            return this.opcionesEspeciales.some(o => o.value === val);
        },
        // ── Día badge ────────────────────────────────────────
        getDiaBadgeClass(dia) {
            if (!dia) return '';
            if (dia === 'SÁBADO' || dia === 'DOMINGO') return 'weekend';
            return 'weekday';
        },
        // ── API ──────────────────────────────────────────────
        getUsuariosGrupo36() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_UsuariosGrupo36')
                .then(res => {
                    this.listaUsuarios = res.data;
                }).catch(err => console.log(err));
        },
        getJefesArea() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_JefesArea')
                .then(res => {
                    this.listaJefes = res.data;
                }).catch(err => console.log(err));
        },
        getDepartamentosActivos() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_DepartamentosActivos')
                .then(res => {
                    this.departamentos = res.data;
                }).catch(err => console.log(err));
        },
        getDetalles() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos?action=Get_DetallePermiso&tpe_id=' + me.nuevoarray.tpe_id)
                .then(res => {
                    const tipo = me.nuevoarray.tpe_tipo_solicitud;
                    const sub = me.nuevoarray.tpe_subtipo_permiso;
                    me.nuevoarray.detalles = res.data.map(d => {
                        if (tipo === '1') return {
                            ...me.emptyVacacionRow(),
                            ...d
                        };
                        // Para todos los permisos (incluyendo institucional sub === '3')
                        return {
                            tpd_p_fecha: d.tpd_p_fecha || '',
                            diaTexto: d.tpd_p_fecha ? me.diasSemana[new Date(d.tpd_p_fecha + 'T00:00:00').getDay()] : '',
                            tpd_p_hora_salida: d.tpd_p_hora_salida ? d.tpd_p_hora_salida.substring(0, 5) : '',
                            tpd_p_hora_entrada: d.tpd_p_hora_entrada ? d.tpd_p_hora_entrada.substring(0, 5) : '',
                            tpd_p_actividad: d.tpd_p_actividad || '',
                            tpd_v_observaciones: d.tpd_v_observaciones || '',
                        };
                    });
                    me.$vs.loading.close();
                    // Importante: activar isLoaded después de cargar los detalles
                    me.$nextTick(() => {
                        me.isLoaded = true;
                    });
                    me.$nextTick(() => {
                        document.querySelectorAll('textarea').forEach(el => {
                            el.style.height = 'auto';
                            el.style.height = el.scrollHeight + 'px';
                        });
                    });
                }).catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        // ── Helpers filas ────────────────────────────────────
        emptyDetalleRow() {
            return {
                tpd_p_fecha: '',
                diaTexto: '',
                tpd_p_hora_salida: '',
                tpd_p_hora_entrada: '',
                tpd_p_actividad: ''
            };
        },
        emptyVacacionRow() {
            return {
                tpd_v_fecha_desde: '',
                tpd_v_fecha_hasta: '',
                tpd_v_periodo: '',
                tpd_v_saldo_pendiente: null,
            };
        },
        calcularDiasVacaciones() {
            if (!this.nuevoarray.detalles[0]) return;
            const d = this.nuevoarray.detalles[0];
            if (d.tpd_v_fecha_desde && d.tpd_v_fecha_hasta) {
                const f1 = new Date(d.tpd_v_fecha_desde + 'T00:00:00');
                const f2 = new Date(d.tpd_v_fecha_hasta + 'T00:00:00');
                const diff = f2.getTime() - f1.getTime();
                if (diff >= 0) {
                    const dias = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
                    this.nuevoarray.tpe_p_v_total_dias = dias;
                } else {
                    this.nuevoarray.tpe_p_v_total_dias = 0;
                    this.$vs.notify({
                        text: 'La fecha hasta debe ser mayor a la fecha desde',
                        color: 'warning'
                    });
                }
            }
        },
        addDetalleRow() {
            this.nuevoarray.detalles.push(this.emptyDetalleRow());
        },
        removeDetalleRow(i) {
            this.nuevoarray.detalles.splice(i, 1);
        },
        addFechaCargo() {
            if (!this.nuevaFechaCargo) return;
            if (this.nuevoarray.detalles.find(d => d.tpd_p_fecha === this.nuevaFechaCargo)) {
                this.$vs.notify({
                    text: 'Fecha ya agregada',
                    color: 'warning'
                });
                return;
            }
            this.nuevoarray.detalles.push({
                tpd_p_fecha: this.nuevaFechaCargo
            });
            this.nuevoarray.detalles.sort((a, b) => a.tpd_p_fecha.localeCompare(b.tpd_p_fecha));
            this.nuevaFechaCargo = '';
            this.nuevoarray.tpe_p_v_total_dias = this.nuevoarray.detalles.length;
        },
        removeFechaCargo(i) {
            this.nuevoarray.detalles.splice(i, 1);
            this.nuevoarray.tpe_p_v_total_dias = this.nuevoarray.detalles.length;
        },
        updateDia(index) {
            const row = this.nuevoarray.detalles[index];
            row.diaTexto = row.tpd_p_fecha ? this.diasSemana[new Date(row.tpd_p_fecha + 'T00:00:00').getDay()] : '';
        },
        autoResize(event) {
            const el = event.target;
            setTimeout(() => {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            }, 10);
        },
        formatFecha(fecha) {
            if (!fecha) return '';
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const [anio, mes, dia] = fecha.split('-');
            if (!anio || !mes || !dia) return fecha;
            return `${anio}-${meses[parseInt(mes, 10) - 1]}-${dia}`;
        },
        // ── Guardar ──────────────────────────────────────────
        guardar() {
            let me = this;
            if (!me.nuevoarray.tpe_solicitado_por) {
                me.validateField('tpe_solicitado_por', 'classvalidar_tpe_solicitado_por', 'Seleccione el solicitante');
                return;
            }
            if (!me.nuevoarray.tpe_solicitado_departamento) {
                me.validateField('tpe_solicitado_departamento', 'classvalidar_tpe_solicitado_departamento', 'Seleccione el departamento (Solicitado por)');
                return;
            }
            if (!me.nuevoarray.tpe_autorizado_por) {
                me.validateField('tpe_autorizado_por', 'classvalidar_tpe_autorizado_por', 'Seleccione el usuario (Autorizado por)');
                return;
            }
            if (!me.nuevoarray.tpe_autorizado_departamento) {
                me.validateField('tpe_autorizado_departamento', 'classvalidar_tpe_autorizado_departamento', 'Seleccione el departamento (Autorizado por)');
                return;
            }
            if (!me.nuevoarray.tpe_registrado_por) {
                me.validateField('tpe_registrado_por', 'classvalidar_tpe_registrado_por', 'Seleccione el usuario (Registrado por)');
                return;
            }
            if (!me.nuevoarray.tpe_registrado_departamento) {
                me.validateField('tpe_registrado_departamento', 'classvalidar_tpe_registrado_departamento', 'Seleccione el departamento (Registrado por)');
                return;
            }
            if (me.nuevoarray.tpe_tipo_solicitud == '0' && !me.nuevoarray.tpe_subtipo_permiso) {
                me.$vs.notify({
                    text: 'Seleccione la causa del permiso',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            const datos = {
                action: 'Post_Registrar_modificar_Permiso',
                tpe_id: me.verificarcrear_actualizar === 'update' ? me.nuevoarray.tpe_id : null,
                tpe_tipo_solicitud: me.nuevoarray.tpe_tipo_solicitud,
                tpe_subtipo_permiso: me.nuevoarray.tpe_subtipo_permiso,
                tpe_p_causa_otro: me.nuevoarray.tpe_p_causa_otro,
                tpe_p_v_total_dias: me.nuevoarray.tpe_p_v_total_dias,
                tpe_p_v_obs_general: me.nuevoarray.tpe_p_v_obs_general,
                tpe_solicitado_por: me.nuevoarray.tpe_solicitado_por,
                tpe_solicitado_departamento: me.nuevoarray.tpe_solicitado_departamento,
                tpe_autorizado_por: me.nuevoarray.tpe_autorizado_por,
                tpe_autorizado_departamento: me.nuevoarray.tpe_autorizado_departamento,
                tpe_registrado_por: me.nuevoarray.tpe_registrado_por,
                tpe_registrado_departamento: me.nuevoarray.tpe_registrado_departamento,
                created_by: me.nuevoarray.created_by,
                updated_by: me.nuevoarray.updated_by,
                detalles: me.nuevoarray.detalles,
            };
            me.$vs.loading();
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_Permisos', datos)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    } else {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }
                }).catch(() => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                });
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
        validateField(refName, classVar, message) {
            let me = this;
            me[classVar] = 'stylevalidarinput';
            me.$nextTick(() => {
                const el = me.$refs[refName];
                if (el) {
                    // Desplazamiento
                    el.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Foco en el input interno
                    const input = el.$el.querySelector('input');
                    if (input) input.focus();
                    // Abrir el select si es v-select
                    if (el.hasOwnProperty('open')) el.open = true;
                }
            });
            me.$vs.notify({
                text: message,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 5000
            });
            setTimeout(() => {
                me[classVar] = '';
            }, 1500);
        },
    },
};
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────────── */
.pv-card {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    color: #1e293b;
}

/* ── Section header ───────────────────────────────────── */
.section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #64748b;
    padding: 10px 0 10px 4px;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 20px;
}

.section-icon {
    font-size: 16px;
}

/* ── Info banners ─────────────────────────────────────── */
.info-banners {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
    border-left: 4px solid;
}

.info-banner.danger {
    background: #fff1f2;
    border-color: #f43f5e;
    color: #9f1239;
}

.info-banner-icon {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
}

/* ── Form layout ──────────────────────────────────────── */
.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
}

.form-col {
    box-sizing: border-box;
}

.form-col.full {
    flex: 1 1 100%;
}

.form-col.half {
    flex: 1 1 calc(50% - 8px);
    min-width: 220px;
}

.form-col.quarter {
    flex: 1 1 calc(25% - 12px);
    min-width: 160px;
}

.field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    letter-spacing: .03em;
}

.mt-2 {
    margin-top: 12px;
}

/* ── Radio cards ──────────────────────────────────────── */
.radio-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.radio-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    background: #f8fafc;
    transition: all .2s;
    user-select: none;
}

.radio-card input[type="radio"] {
    display: none;
}

.radio-card:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
}

.radio-card.active {
    border-color: #6366f1;
    background: #eef2ff;
    color: #4338ca;
}

.radio-icon {
    font-size: 18px;
}

/* ── Custom select ────────────────────────────────────── */
.custom-select-wrapper {
    position: relative;
}

.custom-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: border-color .2s, box-shadow .2s;
    min-height: 40px;
}

.custom-select-trigger:hover {
    border-color: #94a3b8;
}

.custom-select-trigger.open {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, .12);
}

.trigger-placeholder {
    color: #94a3b8;
}

.trigger-value {
    color: #1e293b;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}

.trigger-arrow {
    width: 18px;
    height: 18px;
    color: #94a3b8;
    transition: transform .2s;
    flex-shrink: 0;
}

.custom-select-trigger.open .trigger-arrow {
    transform: rotate(180deg);
}

.custom-select-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, .12);
    z-index: 9999;
    overflow: hidden;
    max-height: 320px;
    display: flex;
    flex-direction: column;
}

.dropdown-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
    background: #fafafa;
    flex-shrink: 0;
}

.search-icon {
    width: 16px;
    height: 16px;
    color: #94a3b8;
    flex-shrink: 0;
}

.dropdown-search-input {
    border: none;
    outline: none;
    font-size: 13px;
    color: #1e293b;
    background: transparent;
    width: 100%;
}

.dropdown-group {
    overflow-y: auto;
}

.group-label {
    padding: 8px 14px 4px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .1em;
    color: #0f172a;
    text-transform: uppercase;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
}

.group-label.especial {
    color: #7c3aed;
    background: #faf5ff;
}

.dropdown-item {
    padding: 10px 16px;
    font-size: 14px;
    color: #334155;
    cursor: pointer;
    transition: background .15s;
}

.dropdown-item:hover {
    background: #f1f5f9;
}

.dropdown-item.selected {
    background: #eef2ff;
    color: #4338ca;
    font-weight: 600;
}

.especial-item {
    font-weight: 600;
    color: #5b21b6;
}

.especial-item:hover {
    background: #f5f3ff;
}

.especial-item.selected {
    background: #ede9fe;
}

.item-star {
    color: #7c3aed;
    margin-right: 4px;
}

.badge-especial {
    color: #7c3aed;
    font-size: 12px;
}

.dropdown-empty {
    padding: 16px;
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
}

/* ── Textarea auto-resize ─────────────────────────────── */
.auto-textarea {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    resize: none;
    overflow: hidden;
    min-height: 60px;
    font-size: 13px;
    padding: 10px 12px;
    box-sizing: border-box;
    font-family: inherit;
    color: #1e293b;
    transition: border-color .2s, box-shadow .2s;
    line-height: 1.5;
}

.auto-textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, .12);
}

.table-textarea {
    min-height: 36px;
}

/* ── Date input ───────────────────────────────────────── */
.date-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    box-sizing: border-box;
    color: #1e293b;
    font-family: inherit;
    transition: border-color .2s, box-shadow .2s;
}

.date-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, .12);
}

/* ── Chips ────────────────────────────────────────────── */
.chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-height: 52px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    margin-top: 4px;
}

.chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #dbeafe;
    border: 1px solid #bae6fd;
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 13px;
    color: #1e40af;
    font-weight: 500;
}

.chip-remove {
    color: #ef4444;
    cursor: pointer;
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
    margin-left: 2px;
    transition: color .15s;
}

.chip-remove:hover {
    color: #b91c1c;
}

.chips-empty {
    color: #94a3b8;
    font-size: 13px;
    align-self: center;
}

/* ── Buttons ──────────────────────────────────────────── */
.btn-add-fecha {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    background: #6366f1;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s, transform .1s;
}

.btn-add-fecha:hover {
    background: #4f46e5;
    transform: translateY(-1px);
}

.btn-add-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #f0fdf4;
    color: #16a34a;
    border: 1.5px solid #bbf7d0;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
}

.btn-add-row:hover {
    background: #dcfce7;
    border-color: #86efac;
}

.btn-delete-row {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #fff0f0;
    color: #ef4444;
    border: 1.5px solid #fecaca;
    border-radius: 8px;
    cursor: pointer;
    transition: all .2s;
}

.btn-delete-row:hover {
    background: #fee2e2;
    border-color: #fca5a5;
}

/* ── Table ────────────────────────────────────────────── */
.table-wrapper {
    overflow-x: auto;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
}

.detail-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 680px;
    font-size: 13px;
}

.detail-table thead tr {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.detail-table th {
    padding: 12px 14px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 2px solid #e2e8f0;
}

.detail-table td {
    padding: 10px 10px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    text-align: center;
}

.detail-table tbody tr:last-child td {
    border-bottom: none;
}

.detail-table tbody tr:hover {
    background: #fafbff;
}

.table-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 6px;
    padding: 7px 10px;
    font-size: 13px;
    box-sizing: border-box;
    color: #1e293b;
    font-family: inherit;
    transition: border-color .2s;
}

.table-input:focus {
    outline: none;
    border-color: #6366f1;
}

.table-empty {
    padding: 24px;
    color: #94a3b8;
    font-size: 13px;
    text-align: center;
}

/* ── Día badge ────────────────────────────────────────── */
.dia-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .04em;
}

.dia-badge.weekday {
    background: #eff6ff;
    color: #1d4ed8;
}

.dia-badge.weekend {
    background: #fef3c7;
    color: #b45309;
}

/* ── Personas grid ────────────────────────────────────── */
.personas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

@media (max-width: 900px) {
    .personas-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .personas-grid {
        grid-template-columns: 1fr;
    }
}

.persona-card {
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
    position: relative;
}

.persona-card:focus-within {
    z-index: 10;
}

.persona-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    border-radius: 10px 10px 0 0;
}

.persona-card-header.solicitado {
    background: #eff6ff;
    color: #1d4ed8;
}

.persona-card-header.autorizado {
    background: #f0fdf4;
    color: #15803d;
}

.persona-card-header.registrado {
    background: #faf5ff;
    color: #7c3aed;
}

.persona-card-body {
    padding: 14px 16px;
}

/* ── Actions bar ──────────────────────────────────────── */
.actions-bar {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 24px 0 8px;
    border-top: 1.5px solid #f1f5f9;
    margin-top: 8px;
}

.btn-guardar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(99, 102, 241, .35);
    transition: all .2s;
}

.btn-guardar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, .45);
}

.btn-cancelar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    background: #fff;
    color: #ef4444;
    border: 1.5px solid #fecaca;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
}

.btn-cancelar:hover {
    background: #fff0f0;
    border-color: #fca5a5;
    transform: translateY(-2px);
}

/* ── Vacácion form card ───────────────────────────────── */
.vac-form-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #fff 100%);
    border: 1.5px solid #bae6fd;
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 8px;
    line-height: 2.2;
    font-size: 15px;
    color: #1e293b;
}

.vac-prose-line {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 8px 12px;
    margin-bottom: 8px;
}

.vac-text {
    font-size: 15px;
    color: #334155;
    white-space: nowrap;
}

.vac-field-inline {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.vac-underline-input {
    border: none;
    border-bottom: 2px solid #0ea5e9;
    background: transparent;
    outline: none;
    font-size: 15px;
    color: #0c4a6e;
    font-weight: 600;
    padding: 2px 6px;
    width: 100%;
    box-sizing: border-box;
    text-align: inherit;
    transition: border-color .2s;
    font-family: inherit;
}

.vac-underline-input:focus {
    border-bottom-color: #6366f1;
}

.vac-underline-input::placeholder {
    color: #94a3b8;
    font-weight: 400;
    font-size: 13px;
}

.text-center {
    text-align: center;
}

.vac-field-hint {
    font-size: 10px;
    color: #64748b;
    font-weight: 600;
    letter-spacing: .04em;
    text-transform: uppercase;
    padding-left: 6px;
}

.vac-obs-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
    padding-top: 14px;
    border-top: 1px dashed #bae6fd;
}

.vac-obs-label {
    font-size: 11px;
    font-weight: 800;
    color: #0369a1;
    letter-spacing: .08em;
}

.vac-obs-textarea {
    background: #fff;
    border-color: #bae6fd;
}

/* ── Cargo total bar ─────────────────────────────────── */
.cargo-total-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    padding: 10px 18px;
    background: linear-gradient(90deg, #eff6ff 0%, #f8fafc 100%);
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    border-top: 2px dashed #93c5fd;
}

.cargo-total-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .06em;
    color: #1e40af;
    text-transform: uppercase;
}

/* ── Waiting state ────────────────────────────────────── */
.waiting-selection-card {
    margin-top: 32px;
    padding: 40px 20px;
    background: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.waiting-icon-wrapper {
    width: 56px;
    height: 56px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    margin-bottom: 4px;
}

.waiting-svg {
    width: 32px;
    height: 32px;
}

.waiting-title {
    font-size: 18px;
    font-weight: 700;
    color: #475569;
    margin: 0;
}

.waiting-text {
    font-size: 14px;
    color: #64748b;
    max-width: 400px;
    line-height: 1.5;
    margin: 0;
}

.waiting-text b {
    color: #334155;
}

.cargo-total-value {
    font-size: 28px;
    font-weight: 900;
    color: #2563eb;
    line-height: 1;
}

.cargo-total-unit {
    font-size: 14px;
    font-weight: 600;
    color: #3b82f6;
}

/* ── Highlight Error ──────────────────────────────────── */
@keyframes intense-error-shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
}

.stylevalidarinput {
    box-shadow: 0px 0px 2px 4px #ff0000 !important;
    border-radius: 5px;
    animation: intense-error-shake 0.4s ease-in-out;
}
</style>
