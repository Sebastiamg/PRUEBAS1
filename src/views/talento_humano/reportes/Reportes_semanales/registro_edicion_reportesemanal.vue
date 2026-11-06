https://prolipa-my.sharepoint.com/:x:/g/personal/sebastian_naranjo_prolipa_ec/IQB3_qXDxS18TplAwObeVGGvAQ9Ryxm-crUSjgMEsCHvUGU<template>
    <vx-card fixed-height="true" class="rs-card">

        <!-- ══════════════════════════════════════════
       DETALLE DEL REPORTE
  ══════════════════════════════════════════ -->
        <div class="section-header">
            <span class="section-icon">📋</span>
            <span>Detalle del Reporte</span>
        </div>

        <!-- Info banners / Rules Panel -->
        <div class="rules-panel">
            <div class="rules-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="rules-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Lineamientos del Reporte
            </div>
            <div class="rules-grid">
                <div class="rule-item">
                    <span class="rule-bullet"></span>
                    <p><strong>Presentación:</strong> Corte el día 22. Entrega física el <b>23</b> (o primer día hábil).
                        No se reciben antes.</p>
                </div>
                <div class="rule-item">
                    <span class="rule-bullet"></span>
                    <p><strong>Suplementarias (L-V):</strong> Mañana (06:00 a 08:30). Tarde (desde 17:30 <b>solo si</b>
                        la salida es ≥ 18:00).</p>
                </div>
                <div class="rule-item">
                    <span class="rule-bullet"></span>
                    <p><strong>Extraordinarias:</strong> Fines de semana/feriados (se descuenta 1h de almuerzo al
                        cumplir 8h). L-V de 24:00 a 06:00.</p>
                </div>
                <div class="rule-item">
                    <span class="rule-bullet"></span>
                    <p><strong>Zona Muerta:</strong> L-V de 17:30 a 18:00 no suma si la salida ocurre en ese lapso.</p>
                </div>

            </div>
        </div>

        <!-- Botón agregar -->
        <div style="margin-bottom:14px;">
            <button class="btn-add-row" @click="addDetalleRow">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                    <path fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd" />
                </svg>
                Agregar Registro
            </button>
        </div>

        <!-- Tabla de detalle -->
        <div class="table-wrapper">
            <table class="detail-table">
                <thead>
                    <tr>
                        <th style="width:40px; text-align:center;">#</th>
                        <th style="min-width:130px;">Fecha</th>
                        <th style="min-width:100px;">Día</th>
                        <th style="min-width:110px;">Hora Entrada</th>
                        <th style="min-width:110px;">Hora Salida</th>
                        <th style="min-width:80px;">Feriado</th>
                        <!-- <th style="min-width:80px;">H Continuo</th> -->
                        <th style="min-width:140px;">Modo Cálculo</th>
                        <th style="min-width:120px;">H. Suplementarias</th>
                        <th style="min-width:120px;">H. Extraordinarias</th>
                        <th style="min-width:220px;">Actividades</th>
                        <th style="min-width:60px;">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in nuevoarray.detalles" :key="index">
                        <td style="text-align:center; font-weight:bold;">{{ index + 1 }}</td>
                        <td>
                            <input type="date" class="table-input" v-model="row.trd_fecha"
                                @change="calculateRow(index)" />
                        </td>
                        <td>
                            <span :class="['dia-badge', getDiaBadgeClass(row.diaTexto)]">{{ row.diaTexto || '—'
                                }}</span>
                        </td>
                        <td>
                            <input type="time" class="table-input" v-model="row.trd_hora_entrada"
                                @change="calculateRow(index)" />
                        </td>
                        <td>
                            <input type="time" class="table-input" v-model="row.trd_hora_salida"
                                @change="calculateRow(index)" />
                        </td>
                        <td style="text-align:center;">
                            <label class="toggle-feriado" :class="{ active: row.trd_es_feriado }">
                                <input type="checkbox" v-model="row.trd_es_feriado" @change="calculateRow(index)"
                                    style="display:none;" />
                                <span>{{ row.trd_es_feriado ? 'Sí' : 'No' }}</span>
                            </label>
                        </td>
                        <!-- <td style="text-align:center;">
                            <label class="toggle-continuo" :class="{
                                active: row.trd_es_continuo && !isWeekendOrHoliday(row),
                                disabled: isWeekendOrHoliday(row)
                            }">
                                <input type="checkbox" v-model="row.trd_es_continuo" @change="calculateRow(index)"
                                    :disabled="isWeekendOrHoliday(row)" style="display:none;" />
                                <span>{{ getContinuoDisplayText(row) }}</span>
                            </label>
                        </td> -->
                        <td style="text-align:center;">
                            <select v-model="row.trd_modo_calculo" @change="calculateRow(index)"
                                class="modo-calculo-select" :disabled="isWeekendOrHoliday(row)">
                                <option value="normal">Normal (desde 17:30)</option>
                                <option value="zona_muerta">Zona muerta (desde 18:00)</option>
                                <option value="horario_especial">Horario especial (horas reales)</option>
                            </select>
                        </td>
                        <td style="text-align:center;">
                            <span class="horas-badge suple">{{ row.trd_horas_suplementarias_str }}</span>
                        </td>
                        <td style="text-align:center;">
                            <span class="horas-badge extra">{{ row.trd_horas_extraordinarias_str }}</span>
                        </td>
                        <td>
                            <textarea v-model="row.trd_actividades" placeholder="Escriba actividades..."
                                class="auto-textarea table-textarea" rows="1" @input="autoResize($event)"></textarea>
                        </td>
                        <td style="text-align:center;">
                            <button class="btn-delete-row" @click="removeDetalleRow(index)" title="Eliminar fila">
                                <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                                    <path fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="nuevoarray.detalles.length === 0">
                        <td colspan="11" class="table-empty">Sin registros. Haga clic en "Agregar Registro" para
                            comenzar.</td>
                    </tr>
                    <!-- Fila de totales -->
                    <tr v-if="nuevoarray.detalles.length > 0" class="totals-row">
                        <td colspan="7"
                            style="text-align:right; font-weight:700; font-size:12px; letter-spacing:.04em; color:#64748b; text-transform:uppercase; padding-right:16px;">
                            Total horas:
                        </td>
                        <td style="text-align:center;">
                            <span class="horas-badge suple total">{{
                                minutesToExcelTime(nuevoarray.tre_total_horas_suplementarias) }}</span>
                        </td>
                        <td style="text-align:center;">
                            <span class="horas-badge extra total">{{
                                minutesToExcelTime(nuevoarray.tre_total_horas_extraordinarias) }}</span>
                        </td>
                        <td colspan="2"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ══════════════════════════════════════════
       PERSONAS INVOLUCRADAS
  ══════════════════════════════════════════ -->
        <div class="section-header" style="margin-top:18px;">
            <span class="section-icon">👥</span>
            <span>Personas Involucradas</span>
        </div>

        <div class="personas-grid">
            <!-- SOLICITADO POR -->
            <div class="persona-card">
                <div class="persona-card-header solicitado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd" />
                    </svg>
                    Solicitado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">Usuario <span class="req">*</span></label>
                    <v-select ref="tre_solicitado_por" v-model="nuevoarray.tre_solicitado_por_ids"
                        :options="listaUsuarios" :reduce="u => u.idusuario" label="nombre_completo"
                        placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect"
                        :class="classvalidar_tre_solicitado_por" :disabled="isRouteTalentoHumano" />
                    <label class="field-label mt-2">Departamento</label>
                    <v-select ref="tre_solicitado_departamento" v-model="nuevoarray.tre_solicitado_departamento"
                        :options="departamentos" :reduce="d => d.value" label="label" placeholder="-- Seleccione --"
                        class="w-full mt-1 pv-vselect" :class="classvalidar_tre_solicitado_departamento" />
                </div>
            </div>

            <!-- AUTORIZADO POR -->
            <div class="persona-card">
                <div class="persona-card-header autorizado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path fill-rule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    Autorizado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">Usuario</label>
                    <v-select ref="tre_autorizado_por" v-model="nuevoarray.tre_autorizado_por" :options="listaJefes"
                        :reduce="u => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --"
                        class="w-full mt-1 pv-vselect" :class="classvalidar_tre_autorizado_por" />
                    <label class="field-label mt-2">Departamento</label>
                    <v-select ref="tre_autorizado_departamento" v-model="nuevoarray.tre_autorizado_departamento"
                        :options="departamentos" :reduce="d => d.value" label="label" placeholder="-- Seleccione --"
                        class="w-full mt-1 pv-vselect" :class="classvalidar_tre_autorizado_departamento" />
                </div>
            </div>

            <!-- APROBADO POR -->
            <div class="persona-card">
                <div class="persona-card-header aprobado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    Aprobado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">Usuario</label>
                    <v-select ref="tre_aprobado_por" v-model="nuevoarray.tre_aprobado_por" :options="listaUsuarios"
                        :reduce="u => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --"
                        class="w-full mt-1 pv-vselect" :class="classvalidar_tre_aprobado_por"
                        :disabled="isRouteTalentoHumano" />
                    <label class="field-label mt-2">Departamento</label>
                    <v-select ref="tre_aprobado_departamento" v-model="nuevoarray.tre_aprobado_departamento"
                        :options="departamentos" :reduce="d => d.value" label="label" placeholder="-- Seleccione --"
                        class="w-full mt-1 pv-vselect" :class="classvalidar_tre_aprobado_departamento"
                        :disabled="isRouteTalentoHumano" />
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════
       ACCIONES
  ══════════════════════════════════════════ -->
        <div class="actions-bar">
            <button class="btn-guardar" @click="guardarnuevoeditar_Reporte()">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px;">
                    <path
                        d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                Guardar Reporte
            </button>
            <button class="btn-cancelar" @click="getCancelar()">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px;">
                    <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
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

export default {
    components: {
        "v-select": vSelect
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: ''
        },
        tab_Reporte: {
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
            nuevoarray: {
                tre_id: 0,
                tre_solicitado_por_ids: null,
                tre_solicitado_departamento: null,
                tre_autorizado_por: null,
                tre_autorizado_departamento: null,
                tre_aprobado_por: null,
                tre_aprobado_departamento: null,
                tre_total_horas_suplementarias: 0,
                tre_total_horas_extraordinarias: 0,
                created_by: '',
                updated_by: '',
                detalles: [],
            },
            isRouteTalentoHumano: false,
            classvalidar_tre_solicitado_por: '',
            classvalidar_tre_solicitado_departamento: '',
            classvalidar_tre_autorizado_por: '',
            classvalidar_tre_autorizado_departamento: '',
            classvalidar_tre_aprobado_por: '',
            classvalidar_tre_aprobado_departamento: '',
        };
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
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
        } catch (error) { }
        this.getUsuariosGrupo36();
        this.getJefesArea();
        this.getDepartamentosActivos();

        if (this.verificarcrear_actualizar === 'create') {
            this.nuevoarray.created_by = user.idusuario;
            this.nuevoarray.updated_by = user.idusuario;
            // Valores por defecto: Aprobado por Talento Humano
            this.nuevoarray.tre_aprobado_por = 94960;
            this.nuevoarray.tre_aprobado_departamento = 4;

            let currentPath = this.$route.path;
            if (currentPath.includes('/reportes_talento_humano')) {
                this.nuevoarray.tre_solicitado_por_ids = null;
            } else if (currentPath.includes('/talento-humano/reportes')) {
                this.nuevoarray.tre_solicitado_por_ids = user.idusuario;
            } else {
                this.nuevoarray.tre_solicitado_por_ids = null;
            }

            this.addDetalleRow();
        } else if (this.verificarcrear_actualizar === 'update') {
            const t = this.tab_Reporte;
            this.nuevoarray.tre_id = t.tre_id;
            this.nuevoarray.tre_total_horas_suplementarias = t.tre_total_horas_suplementarias;
            this.nuevoarray.tre_total_horas_extraordinarias = t.tre_total_horas_extraordinarias;
            this.nuevoarray.updated_by = user.idusuario;

            try {
                const parsed = JSON.parse(t.tre_solicitado_por);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.nuevoarray.tre_solicitado_por_ids = parsed[0];
                } else {
                    this.nuevoarray.tre_solicitado_por_ids = null;
                }
            } catch (e) {
                this.nuevoarray.tre_solicitado_por_ids = null;
            }

            this.nuevoarray.tre_autorizado_por = t.tre_autorizado_por ? Number(t.tre_autorizado_por) : null;
            this.nuevoarray.tre_aprobado_por = t.tre_aprobado_por ? Number(t.tre_aprobado_por) : null;
            this.nuevoarray.tre_solicitado_departamento = t.tre_solicitado_departamento ? Number(t.tre_solicitado_departamento) : null;
            this.nuevoarray.tre_autorizado_departamento = t.tre_autorizado_departamento ? Number(t.tre_autorizado_departamento) : null;
            this.nuevoarray.tre_aprobado_departamento = t.tre_aprobado_departamento ? Number(t.tre_aprobado_departamento) : null;

            this.getDetalles();
        }
        if (this.nuevoarray.detalles.length > 0) {
            this.nuevoarray.detalles.forEach(row => {
                if (!row.trd_modo_calculo) {
                    this.$set(row, 'trd_modo_calculo', 'normal');
                }
                if (row.trd_es_continuo === undefined) {
                    this.$set(row, 'trd_es_continuo', true);
                }
            });
        }
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
        // ── API ──────────────────────────────────────────────
        getUsuariosGrupo36() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_UsuariosGrupo36')
                .then(res => {
                    this.listaUsuarios = res.data;
                })
                .catch(err => console.log(err));
        },
        getJefesArea() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_JefesArea')
                .then(res => {
                    this.listaJefes = res.data;
                })
                .catch(err => console.log(err));
        },
        getDepartamentosActivos() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_DepartamentosActivos')
                .then(res => {
                    this.departamentos = res.data;
                })
                .catch(err => console.log(err));
        },
        // ── Cálculo de horas ─────────────────────────────────
        timeToMinutes(t) {
            if (!t) return 0;
            const parts = t.split(':');
            if (parts.length < 2) return 0;
            return Number(parts[0]) * 60 + Number(parts[1]);
        },
        minutesToExcelTime(min) {
            if (!min || min <= 0) return '0:00';
            const h = Math.floor(min / 60);
            const m = min % 60;
            return `${h}:${m.toString().padStart(2, '0')}`;
        },
        getDetalles() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales?action=Get_DetalleReporteSemanal&tre_id=' + me.nuevoarray.tre_id)
                .then(res => {
                    me.nuevoarray.detalles = res.data.map(d => {
                        // Convertir horas correctamente
                        const supleMin = me.timeToMinutes(d.trd_horas_suplementarias);
                        const extraMin = me.timeToMinutes(d.trd_horas_extraordinarias);

                        return {
                            trd_fecha: d.trd_fecha,
                            diaTexto: d.trd_fecha ? me.diasSemana[new Date(d.trd_fecha + 'T00:00:00').getDay()] : '',
                            trd_hora_entrada: d.trd_hora_entrada ? d.trd_hora_entrada.substring(0, 5) : '',
                            trd_hora_salida: d.trd_hora_salida ? d.trd_hora_salida.substring(0, 5) : '',
                            trd_es_feriado: d.trd_es_feriado == '1',
                            trd_es_continuo: d.trd_es_continuo == '1',
                            trd_modo_calculo: d.trd_modo_calculo || 'normal',  // ← Una sola vez
                            trd_actividades: d.trd_actividades,
                            supleMin: supleMin,
                            extraMin: extraMin,
                            trd_horas_suplementarias_str: me.minutesToExcelTime(supleMin),
                            trd_horas_extraordinarias_str: me.minutesToExcelTime(extraMin),
                        };
                    });
                    me.calculateTotals();
                    me.$vs.loading.close();
                    me.$nextTick(() => {
                        document.querySelectorAll('textarea').forEach(el => {
                            el.style.height = 'auto';
                            el.style.height = el.scrollHeight + 'px';
                        });
                    });
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },

        addDetalleRow() {
            this.nuevoarray.detalles.push({
                trd_fecha: '',
                diaTexto: '',
                trd_hora_entrada: '',
                trd_hora_salida: '',
                trd_es_feriado: false,
                trd_es_continuo: true,
                trd_modo_calculo: 'normal',
                supleMin: 0,
                extraMin: 0,
                trd_horas_suplementarias_str: '0:00',
                trd_horas_extraordinarias_str: '0:00',
                trd_actividades: '',
            });
        },

        removeDetalleRow(index) {
            this.nuevoarray.detalles.splice(index, 1);
            this.calculateTotals();
        },
        autoResize(event) {
            const el = event.target;
            setTimeout(() => {
                if (el && el.tagName === 'TEXTAREA') {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                }
            }, 10);
        },

        getDiaBadgeClass(dia) {
            if (!dia) return '';
            return (dia === 'SÁBADO' || dia === 'DOMINGO') ? 'weekend' : 'weekday';
        },

        calculateRow(index) {
            const row = this.nuevoarray.detalles[index];

            if (!row.trd_fecha) {
                row.diaTexto = '';
            } else {
                row.diaTexto = this.diasSemana[new Date(row.trd_fecha + 'T00:00:00').getDay()];
            }

            if (!row.trd_hora_entrada || !row.trd_hora_salida) {
                row.supleMin = 0;
                row.extraMin = 0;
                row.trd_horas_suplementarias_str = '0:00';
                row.trd_horas_extraordinarias_str = '0:00';
                this.calculateTotals();
                return;
            }

            let D5 = this.timeToMinutes(row.trd_hora_entrada);
            let E5 = row.trd_hora_salida === '00:00' ? 1440 : this.timeToMinutes(row.trd_hora_salida);

            // Manejar cruce de medianoche
            if (E5 < D5) {
                E5 += 1440;
            }

            const fecha = new Date(row.trd_fecha + 'T00:00:00');
            const numDia = fecha.getDay();
            const esLV = numDia >= 1 && numDia <= 5;
            const treatAsWeekend = !esLV || row.trd_es_feriado;

            let supleMin = 0;
            let extraMin = 0;

            // Obtener modo de cálculo
            const modo = row.trd_modo_calculo || 'normal';

            // ═══════════════════════════════════════════════════════════
            // HORARIO ESPECIAL: Diferencia directa entrada - salida
            // ═══════════════════════════════════════════════════════════
            if (modo === 'horario_especial') {
                const horasTrabajadas = E5 - D5;

                if (treatAsWeekend) {
                    // Fin de semana o feriado: todo es extraordinario
                    extraMin = horasTrabajadas;
                } else {
                    // Día laborable: todo es suplementario
                    supleMin = horasTrabajadas;
                }

                // Aplicar descuento de almuerzo si aplica (fines de semana/feriados)
                if (treatAsWeekend && extraMin >= 480) {
                    extraMin -= 60;
                }

                row.supleMin = Math.max(0, Math.round(supleMin));
                row.extraMin = Math.max(0, Math.round(extraMin));
                row.trd_horas_suplementarias_str = this.minutesToExcelTime(supleMin);
                row.trd_horas_extraordinarias_str = this.minutesToExcelTime(extraMin);
                this.calculateTotals();
                return;  // ← Importante: salir aquí
            }

            // ═══════════════════════════════════════════════════════════
            // MODO NORMAL o ZONA MUERTA: Cálculo detallado por rangos
            // ═══════════════════════════════════════════════════════════
            const HORA_FIN_NOCTURNA = 360;    // 06:00
            const HORA_FIN_MATUTINO = 510;    // 08:30
            const HORA_INICIO_VESPERTINO = 1050; // 17:30
            const HORA_INICIO_ZONA_MUERTA = 1080; // 18:00

            const calcularSegmento = (inicio, fin) => {
                if (inicio >= fin) return;

                if (treatAsWeekend) {
                    // Fin de semana o feriado: todo es extraordinario
                    extraMin += (fin - inicio);
                    return;
                }

                // Horas nocturnas (00:00 - 06:00) - EXTRAORDINARIAS
                if (inicio < HORA_FIN_NOCTURNA) {
                    const finNocturno = Math.min(fin, HORA_FIN_NOCTURNA);
                    if (finNocturno > inicio) {
                        extraMin += (finNocturno - inicio);
                        inicio = finNocturno;
                    }
                }

                if (inicio >= fin) return;

                // Horas matutinas (06:00 - 08:30) - SUPLEMENTARIAS
                if (inicio < HORA_FIN_MATUTINO) {
                    const finMatutino = Math.min(fin, HORA_FIN_MATUTINO);
                    if (finMatutino > inicio) {
                        supleMin += (finMatutino - inicio);
                        inicio = finMatutino;
                    }
                }

                if (inicio >= fin) return;

                // Horario normal (08:30 - 17:30) - NO SE CONTABILIZA
                if (inicio < HORA_INICIO_VESPERTINO) {
                    inicio = Math.min(fin, HORA_INICIO_VESPERTINO);
                }

                if (inicio >= fin) return;

                // Horas vespertinas (después de 17:30) - según modo (normal o zona_muerta)
                let inicioVespertino = HORA_INICIO_VESPERTINO;

                if (modo === 'zona_muerta') {
                    inicioVespertino = HORA_INICIO_ZONA_MUERTA;
                }

                if (fin > inicioVespertino) {
                    const inicioReal = Math.max(inicio, inicioVespertino);
                    if (fin > inicioReal) {
                        supleMin += (fin - inicioReal);
                    }
                }
            };

            const HORA_FIN_DIA = 1440;
            if (E5 > HORA_FIN_DIA) {
                calcularSegmento(D5, HORA_FIN_DIA);
                calcularSegmento(0, E5 - HORA_FIN_DIA);
            } else {
                calcularSegmento(D5, E5);
            }

            // Descuento de almuerzo para fines de semana/feriados
            if (treatAsWeekend && extraMin >= 480) {
                extraMin -= 60;
            }

            row.supleMin = Math.max(0, Math.round(supleMin));
            row.extraMin = Math.max(0, Math.round(extraMin));
            row.trd_horas_suplementarias_str = this.minutesToExcelTime(supleMin);
            row.trd_horas_extraordinarias_str = this.minutesToExcelTime(extraMin);

            this.calculateTotals();
        },
        calculateTotals() {
            let sumSuple = 0,
                sumExtra = 0;
            this.nuevoarray.detalles.forEach(r => {
                sumSuple += r.supleMin || 0;
                sumExtra += r.extraMin || 0;
            });
            this.nuevoarray.tre_total_horas_suplementarias = sumSuple;
            this.nuevoarray.tre_total_horas_extraordinarias = sumExtra;
        },
        // ── Guardar ──────────────────────────────────────────
        guardarnuevoeditar_Reporte() {
            let me = this;
            me.calculateTotals();

            // --- VALIDACIONES DE PERSONAS INVOLUCRADAS ---
            if (!me.nuevoarray.tre_solicitado_por_ids) {
                me.validateField('tre_solicitado_por', 'classvalidar_tre_solicitado_por', 'Seleccione el usuario (Solicitado por)');
                return;
            }
            if (!me.nuevoarray.tre_solicitado_departamento) {
                me.validateField('tre_solicitado_departamento', 'classvalidar_tre_solicitado_departamento', 'Seleccione el departamento (Solicitado por)');
                return;
            }
            if (!me.nuevoarray.tre_autorizado_por) {
                me.validateField('tre_autorizado_por', 'classvalidar_tre_autorizado_por', 'Seleccione el usuario (Autorizado por)');
                return;
            }
            if (!me.nuevoarray.tre_autorizado_departamento) {
                me.validateField('tre_autorizado_departamento', 'classvalidar_tre_autorizado_departamento', 'Seleccione el departamento (Autorizado por)');
                return;
            }
            if (!me.nuevoarray.tre_aprobado_por) {
                me.validateField('tre_aprobado_por', 'classvalidar_tre_aprobado_por', 'Seleccione el usuario (Aprobado por)');
                return;
            }
            if (!me.nuevoarray.tre_aprobado_departamento) {
                me.validateField('tre_aprobado_departamento', 'classvalidar_tre_aprobado_departamento', 'Seleccione el departamento (Aprobado por)');
                return;
            }

            // --- VALIDACIÓN DE DETALLES ---
            if (me.nuevoarray.detalles.length === 0) {
                me.$vs.notify({ text: 'Debe agregar al menos un registro en la tabla de actividades', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }

            const payloadDetalles = me.nuevoarray.detalles.map(d => ({
                trd_fecha: d.trd_fecha,
                trd_hora_entrada: d.trd_hora_entrada,
                trd_hora_salida: d.trd_hora_salida,
                trd_es_feriado: d.trd_es_feriado ? '1' : '0',
                trd_es_continuo: d.trd_es_continuo ? '1' : '0',
                trd_modo_calculo: d.trd_modo_calculo || 'normal',  // ← AGREGAR ESTA LÍNEA
                trd_horas_suplementarias: me.minutesToExcelTime(d.supleMin) + ':00',
                trd_horas_extraordinarias: me.minutesToExcelTime(d.extraMin) + ':00',
                trd_actividades: d.trd_actividades,
            }));

            const datos = {
                action: 'Post_Registrar_modificar_ReportesSemanales',
                tre_id: me.verificarcrear_actualizar === 'update' ? me.nuevoarray.tre_id : null,
                tre_solicitado_por: JSON.stringify(me.nuevoarray.tre_solicitado_por_ids ? [me.nuevoarray.tre_solicitado_por_ids] : []),
                tre_solicitado_departamento: me.nuevoarray.tre_solicitado_departamento,
                tre_autorizado_por: me.nuevoarray.tre_autorizado_por,
                tre_autorizado_departamento: me.nuevoarray.tre_autorizado_departamento,
                tre_aprobado_por: me.nuevoarray.tre_aprobado_por,
                tre_aprobado_departamento: me.nuevoarray.tre_aprobado_departamento,
                tre_total_horas_suplementarias: me.nuevoarray.tre_total_horas_suplementarias,
                tre_total_horas_extraordinarias: me.nuevoarray.tre_total_horas_extraordinarias,
                created_by: me.nuevoarray.created_by,
                updated_by: me.nuevoarray.updated_by,
                detalles: payloadDetalles,
            };

            me.$vs.loading();
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_ReportesSemanales', datos)
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
                })
                .catch(() => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Ocurrió un error al guardar',
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
        isWeekendOrHoliday(row) {
            if (!row.trd_fecha) return false;
            const fecha = new Date(row.trd_fecha + 'T00:00:00');
            const numDia = fecha.getDay();
            const esFinSemana = numDia === 0 || numDia === 6; // Domingo o Sábado
            return esFinSemana || row.trd_es_feriado;
        },
        getContinuoDisplayText(row) {
            // Si es fin de semana o feriado, siempre mostrar "No"
            if (this.isWeekendOrHoliday(row)) {
                return 'No';
            }
            // Si no, mostrar el valor real
            return row.trd_es_continuo ? 'Sí' : 'No';
        },
    },
};
</script>

<style scoped>
.rs-card {
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

/* ── Personas grid ────────────────────────────────────── */
.personas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
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

.persona-card-header.aprobado {
    background: #faf5ff;
    color: #7c3aed;
}

.persona-card-body {
    padding: 14px 16px;
}

.field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    letter-spacing: .03em;
}

.req {
    color: #ef4444;
}

.mt-2 {
    margin-top: 12px;
}

/* ── Rules Panel ──────────────────────────────────────── */
.rules-panel {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
}

.rules-header {
    background: #f1f5f9;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: .04em;
}

.rules-icon {
    width: 16px;
    height: 16px;
    color: #3b82f6;
}

.rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;
    padding: 14px 16px;
}

@media (max-width: 768px) {
    .rules-grid {
        grid-template-columns: 1fr;
    }
}

.rule-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12.5px;
    line-height: 1.5;
    color: #334155;
}

.rule-item p {
    margin: 0;
}

.rule-item strong {
    color: #1e293b;
    font-weight: 700;
}

.rule-bullet {
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #8b5cf6;
    margin-top: 6px;
}

/* ── Buttons ──────────────────────────────────────────── */
.btn-add-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
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
    min-width: 900px;
    font-size: 13px;
}

.detail-table thead tr {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.detail-table th {
    padding: 12px 10px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 2px solid #e2e8f0;
}

.detail-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
}

.detail-table tbody tr:last-child td {
    border-bottom: none;
}

.detail-table tbody tr:hover {
    background: #fafbff;
}

.totals-row td {
    background: #f8fafc;
    border-top: 2px solid #e2e8f0;
    padding: 10px;
}

.table-empty {
    padding: 28px;
    color: #94a3b8;
    font-size: 13px;
    text-align: center;
}

.table-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 6px;
    padding: 7px 8px;
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

/* ── Toggle feriado ───────────────────────────────────── */
.toggle-feriado {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    transition: all .2s;
    background: #f1f5f9;
    color: #64748b;
    border: 1.5px solid #e2e8f0;
    user-select: none;
}

.toggle-feriado.active {
    background: #fef3c7;
    color: #b45309;
    border-color: #fde68a;
}

/* ── Horas badge ──────────────────────────────────────── */
.horas-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .02em;
}

.horas-badge.suple {
    background: #fffbeb;
    color: #d97706;
}

.horas-badge.extra {
    background: #f0fdf4;
    color: #16a34a;
}

.horas-badge.total {
    font-size: 14px;
    padding: 5px 14px;
}

/* ── Textarea ─────────────────────────────────────────── */
.auto-textarea {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    resize: none;
    overflow: hidden;
    min-height: 36px;
    font-size: 13px;
    padding: 8px 10px;
    box-sizing: border-box;
    font-family: inherit;
    color: #1e293b;
    transition: border-color .2s;
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

/* ── Actions bar ──────────────────────────────────────── */
.actions-bar {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 24px 0 8px;
    border-top: 1.5px solid #f1f5f9;
    margin-top: 24px;
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

/* ── Highlight Error ──────────────────────────────────── */
@keyframes intense-error-shake {

    0%,
    100% {
        transform: translateX(0);
    }

    20%,
    60% {
        transform: translateX(-5px);
    }

    40%,
    80% {
        transform: translateX(5px);
    }
}

.stylevalidarinput {
    box-shadow: 0px 0px 2px 4px #ff0000 !important;
    border-radius: 5px;
    animation: intense-error-shake 0.4s ease-in-out;
}

/* Toggle para horario continuo */
.toggle-continuo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #e2e8f0;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    min-width: 50px;
    user-select: none;
}

.toggle-continuo.active {
    background-color: #4299e1;
    color: white;
    box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
}

.toggle-continuo:not(.active) {
    background-color: #cbd5e0;
    color: #4a5568;
}

/* Estado deshabilitado */
.toggle-continuo.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #a0aec0;
    color: #718096;
    pointer-events: none;
}

.toggle-continuo.disabled.active {
    background-color: #718096;
    color: #e2e8f0;
}

.modo-calculo-select {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e0;
    background-color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.modo-calculo-select:hover {
    border-color: #4299e1;
}

.modo-calculo-select:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}
</style>
