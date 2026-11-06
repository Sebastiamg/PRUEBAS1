<template>
<vx-card fixed-height="true" class="ae-card">
    <!-- ══ SELECCIÓN DE DEPARTAMENTO (solo creación) ══ -->
    <div v-if="verificarcrear_actualizar === 'create'">
        <div class="section-header">
            <span class="section-icon">🏢</span>
            <span>Departamento</span>
        </div>
        <div class="form-row">
            <div class="form-col half">
                <label class="field-label">
                    Departamento emisor
                    <span class="req">*</span>
                </label>
                <v-select v-model="departamentoSeleccionado" :options="departamentos" :reduce="(d) => d" label="label" placeholder="-- Seleccione departamento --" class="w-full mt-1 pv-vselect" @input="onDepartamentoChange" />
            </div>
            <div class="form-col half" v-if="previewNumeroActa">
                <label class="field-label">Número de Acta (preview)</label>
                <div class="numero-acta-preview">
                    <span class="numero-acta-badge">{{ previewNumeroActa }}</span>
                    <small class="numero-acta-hint">Se confirmará al guardar</small>
                </div>
            </div>
        </div>
    </div>

    <!-- ══ N° ACTA en edición (solo lectura) ══ -->
    <div v-if="verificarcrear_actualizar === 'update'" class="numero-acta-edit-bar">
        <span class="numero-acta-label">N° ACTA:</span>
        <span class="numero-acta-value">{{ nuevoarray.tae_numero_acta }}</span>
    </div>

    <!-- ══ FORMULARIO PRINCIPAL ══ -->
    <div v-if="mostrarFormulario">
        <!-- ── CARDS: Entregado / Recibido (se llenan primero) ── -->
        <div class="section-header" style="margin-top: 24px">
            <span class="section-icon">�</span>
            <span>Personas Involucradas</span>
        </div>

        <div class="personas-grid">
            <!-- ENTREGADO POR -->
            <div class="persona-card">
                <div class="persona-card-header entregado">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    Entregado por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">
                        Usuario
                        <span class="req">*</span>
                    </label>
                    <v-select v-model="nuevoarray.tae_entregado_id" :options="listaUsuarios" :reduce="(u) => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" @input="onEntregadoChange" />
                    <label class="field-label mt-2">Cargo</label>
                    <input type="text" v-model="nuevoarray.tae_entregado_cargo" placeholder="Cargo de quien entrega..." class="text-input" />
                </div>
            </div>

            <!-- RECIBIDO POR -->
            <div class="persona-card">
                <div class="persona-card-header recibido">
                    <svg viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Recibido por
                </div>
                <div class="persona-card-body">
                    <label class="field-label">
                        Usuario
                        <span class="req">*</span>
                    </label>
                    <v-select v-model="nuevoarray.tae_recibido_id" :options="listaUsuarios" :reduce="(u) => u.idusuario" label="nombre_completo" placeholder="-- Seleccione --" class="w-full mt-1 pv-vselect" @input="onRecibidoChange" />
                    <label class="field-label mt-2">Cargo</label>
                    <input type="text" v-model="nuevoarray.tae_recibido_cargo" placeholder="Cargo de quien recibe..." class="text-input" />
                </div>
            </div>
        </div>

        <!-- ── DOCUMENTO ESTILO ACTA (solo fecha, el resto se llena solo) ── -->
        <div class="section-header" style="margin-top: 24px">
            <span class="section-icon">📋</span>
            <span>Vista Previa del Acta</span>
        </div>

        <div class="acta-prose-card">
            <div class="acta-prose-line">
                <span class="acta-text">En la ciudad de Quito, a los</span>
                <div class="acta-field-inline" style="flex: 0 0 200px">
                    <flat-pickr v-model="nuevoarray.tae_fecha" :config="configFecha" placeholder="Seleccione fecha" class="acta-underline-input text-center" />
                    <!-- <label class="acta-field-hint">Fecha del acta</label> -->
                </div>
                <span class="acta-text">, comparecen por una parte</span>
                <div class="acta-field-inline" style="flex: 2; min-width: 180px">
                    <span class="acta-filled-value">
                        {{ nuevoarray.tae_entregado_por || '[ Seleccionar en Involucrados ]' }}
                    </span>
                    <!-- <label class="acta-field-hint">Entregado por</label> -->
                </div>
                <span class="acta-text">, en calidad de quien entrega, y por otra</span>
                <div class="acta-field-inline" style="flex: 2; min-width: 180px">
                    <span class="acta-filled-value">
                        {{ nuevoarray.tae_recibido_por || '[ Seleccionar en Involucrados ]' }}
                    </span>
                    <!-- <label class="acta-field-hint">Recibido por</label> -->
                </div>
                <span class="acta-text">, en calidad de quien recibe, dejando constancia de la entrega–recepción de lo siguiente:</span>
            </div>
        </div>

        <!-- ══ TABLA DE DETALLES ══ -->
        <div class="section-header" style="margin-top: 28px">
            <span class="section-icon">📦</span>
            <span>Detalle de Entrega</span>
        </div>

        <div style="margin-bottom: 12px">
            <button class="btn-add-row" @click="addDetalleRow">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Agregar Fila
            </button>
        </div>

        <div class="table-wrapper">
            <table class="detail-table">
                <thead>
                    <tr>
                        <th style="width: 50px">ITEM</th>
                        <th>DETALLE</th>
                        <th>OBSERVACIONES</th>
                        <th style="width: 60px">ACCIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in nuevoarray.detalles" :key="index">
                        <td class="item-num">{{ index + 1 }}</td>
                        <td>
                            <textarea v-model="row.tad_detalle" placeholder="Descripción del ítem..." class="auto-textarea table-textarea" rows="1" @input="autoResize($event)"></textarea>
                        </td>
                        <td>
                            <textarea v-model="row.tad_observacion" placeholder="Observaciones..." class="auto-textarea table-textarea" rows="1" @input="autoResize($event)"></textarea>
                        </td>
                        <td align="center">
                            <button class="btn-delete-row" @click="removeDetalleRow(index)" title="Eliminar fila">
                                <svg viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="nuevoarray.detalles.length === 0">
                        <td colspan="4" class="table-empty">Sin ítems. Haga clic en "Agregar Fila" para comenzar.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ══ ACCIONES ══ -->
        <div class="actions-bar">
            <button class="btn-guardar" @click="guardar()">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                Guardar
            </button>
            <button class="btn-cancelar" @click="getCancelar()">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Cancelar
            </button>
        </div>
    </div>

    <!-- ══ ESTADO DE ESPERA (creación sin departamento) ══ -->
    <div v-else-if="verificarcrear_actualizar === 'create'" class="waiting-selection-card">
        <div class="waiting-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="waiting-svg">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        </div>
        <h3 class="waiting-title">Seleccione un departamento</h3>
        <p class="waiting-text">
            Primero seleccione el
            <b>departamento emisor</b>
            para continuar con el registro del acta. El número de acta se generará automáticamente al guardar.
        </p>
        <button class="btn-cancelar" style="margin-top: 8px" @click="getCancelar()">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px">
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
} from 'vuex'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import {
    Spanish
} from 'flatpickr/dist/l10n/es.js'

export default {
    components: {
        'v-select': vSelect,
        flatPickr
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: ''
        },
        tab_ActaEntrega: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            departamentos: [],
            departamentoSeleccionado: null,
            previewNumeroActa: '',
            listaUsuarios: [],
            configFecha: {
                altInput: true,
                altFormat: 'j \\de F \\de Y',
                dateFormat: 'Y-m-d',
                locale: Spanish,
                allowInput: false
            },
            nuevoarray: {
                tae_id: 0,
                tae_numero_acta: '',
                tae_fecha: '',
                // IDs para los selects
                tae_entregado_id: null,
                tae_recibido_id: null,
                // Nombres guardados (texto libre que va a BD)
                tae_entregado_por: '',
                tae_entregado_cargo: '',
                tae_recibido_por: '',
                tae_recibido_cargo: '',
                created_by: '',
                updated_by: '',
                detalles: []
            }
        }
    },
    computed: {
        ...mapState(['auth', 'userRoot', 'susuario']),
        // Mostrar formulario: en edición siempre; en creación solo si hay departamento
        mostrarFormulario() {
            if (this.verificarcrear_actualizar === 'update') return true
            return !!this.departamentoSeleccionado
        }
    },
    mounted() {
        let user = {};
        try {
            const userPlatform = JSON.parse(localStorage.getItem('usuario'));
            const userProlipa = JSON.parse(localStorage.getItem('userProlipa'));
            let currentPath = this.$route.path;
            if (currentPath.includes('/reportes_talento_humano')) {
                user = userPlatform || {};
            } else if (currentPath.includes('/talento-humano/reportes')) {
                user = userProlipa || {};
            } else {
                user = userPlatform || userProlipa || {};
            }
        } catch (error) {}
        this.getDepartamentosActivos()
        this.getUsuariosGrupo36()

        if (this.verificarcrear_actualizar === 'create') {
            this.nuevoarray.created_by = user.idusuario
            this.nuevoarray.updated_by = user.idusuario
            this.nuevoarray.detalles = [this.emptyDetalleRow()]
        } else if (this.verificarcrear_actualizar === 'update') {
            const t = this.tab_ActaEntrega
            this.nuevoarray.tae_id = t.tae_id
            this.nuevoarray.tae_numero_acta = t.tae_numero_acta || ''
            this.nuevoarray.tae_fecha = t.tae_fecha || ''
            this.nuevoarray.tae_entregado_id = t.tae_entregado_por || null
            this.nuevoarray.tae_entregado_por = t.tae_entregado_por_display || ''
            this.nuevoarray.tae_entregado_cargo = t.tae_entregado_cargo || ''
            this.nuevoarray.tae_recibido_id = t.tae_recibido_por || null
            this.nuevoarray.tae_recibido_por = t.tae_recibido_por_display || ''
            this.nuevoarray.tae_recibido_cargo = t.tae_recibido_cargo || ''
            this.nuevoarray.updated_by = user.idusuario
            // Intentar preseleccionar en el select si el nombre coincide con algún usuario
            // (se resuelve después de cargar la lista en getUsuariosGrupo36)
            this.getDetalles()
        }
    },
    updated() {
        this.$nextTick(() => {
            document.querySelectorAll('textarea').forEach((el) => {
                el.style.height = 'auto'
                el.style.height = el.scrollHeight + 'px'
            })
        })
    },
    methods: {
        // ── API ──────────────────────────────────────────────
        getDepartamentosActivos() {
            this.$http
                .get(this.$server_url + 'VerifcarMetodosGet_ActaEntrega?action=Get_DepartamentosActivos')
                .then((res) => {
                    this.departamentos = res.data
                })
                .catch((err) => console.log(err))
        },
        getUsuariosGrupo36() {
            this.$http
                .get(this.$server_url + 'VerifcarMetodosGet_ActaEntrega?action=Get_UsuariosGrupo36')
                .then((res) => {
                    this.listaUsuarios = res.data
                    // En edición: intentar preseleccionar por nombre guardado
                    if (this.verificarcrear_actualizar === 'update') {
                        const entregado = res.data.find((u) => u.idusuario === this.nuevoarray.tae_entregado_id)
                        if (entregado) this.nuevoarray.tae_entregado_por = entregado.nombres + ' ' + entregado.apellidos

                        const recibido = res.data.find((u) => u.idusuario === this.nuevoarray.tae_recibido_id)
                        if (recibido) this.nuevoarray.tae_recibido_por = recibido.nombres + ' ' + recibido.apellidos
                    }
                })
                .catch((err) => console.log(err))
        },
        getDetalles() {
            let me = this
            me.$vs.loading()
            this.$http
                .get(this.$server_url + 'VerifcarMetodosGet_ActaEntrega?action=Get_DetalleActaEntrega&tae_id=' + me.nuevoarray.tae_id)
                .then((res) => {
                    me.nuevoarray.detalles =
                        res.data.length > 0 ?
                        res.data.map((d) => ({
                            tad_detalle: d.tad_detalle || '',
                            tad_observacion: d.tad_observacion || ''
                        })) : [me.emptyDetalleRow()]
                    me.$vs.loading.close()
                    me.$nextTick(() => {
                        document.querySelectorAll('textarea').forEach((el) => {
                            el.style.height = 'auto'
                            el.style.height = el.scrollHeight + 'px'
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    me.$vs.loading.close()
                })
        },
        // ── Handlers select ──────────────────────────────────
        onDepartamentoChange(dpto) {
            if (!dpto) {
                this.previewNumeroActa = ''
                return
            }
            const anio = new Date().getFullYear()
            const secuencial = (dpto.tdp_secuencial_acta_entrega || 0) + 1
            this.previewNumeroActa = `GC-PL-AER-${dpto.tdp_iniciales}-${anio}-${secuencial}`
        },
        onEntregadoChange(id) {
            if (!id) {
                this.nuevoarray.tae_entregado_por = ''
                return
            }
            const u = this.listaUsuarios.find((x) => x.idusuario === id)
            if (u) this.nuevoarray.tae_entregado_por = u.nombres + ' ' + u.apellidos
        },
        onRecibidoChange(id) {
            if (!id) {
                this.nuevoarray.tae_recibido_por = ''
                return
            }
            const u = this.listaUsuarios.find((x) => x.idusuario === id)
            if (u) this.nuevoarray.tae_recibido_por = u.nombres + ' ' + u.apellidos
        },
        // ── Helpers filas ────────────────────────────────────
        emptyDetalleRow() {
            return {
                tad_detalle: '',
                tad_observacion: ''
            }
        },
        addDetalleRow() {
            this.nuevoarray.detalles.push(this.emptyDetalleRow())
        },
        removeDetalleRow(i) {
            this.nuevoarray.detalles.splice(i, 1)
        },
        autoResize(event) {
            const el = event.target
            setTimeout(() => {
                el.style.height = 'auto'
                el.style.height = el.scrollHeight + 'px'
            }, 10)
        },
        // ── Guardar ──────────────────────────────────────────
        guardar() {
            let me = this

            if (me.verificarcrear_actualizar === 'create' && !me.departamentoSeleccionado) {
                me.$vs.notify({
                    text: 'Seleccione el departamento',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (!me.nuevoarray.tae_fecha) {
                me.$vs.notify({
                    text: 'Ingrese la fecha del acta',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (!me.nuevoarray.tae_entregado_por) {
                me.$vs.notify({
                    text: 'Seleccione quien entrega',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (!me.nuevoarray.tae_recibido_por) {
                me.$vs.notify({
                    text: 'Seleccione quien recibe',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.nuevoarray.detalles.length === 0 || me.nuevoarray.detalles.every((d) => !d.tad_detalle.trim())) {
                me.$vs.notify({
                    text: 'Agregue al menos un ítem en el detalle',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            const datos = {
                action: 'Post_Registrar_modificar_ActaEntrega',
                tae_id: me.verificarcrear_actualizar === 'update' ? me.nuevoarray.tae_id : null,
                tdp_id: me.departamentoSeleccionado ? me.departamentoSeleccionado.value : null,
                tae_fecha: me.nuevoarray.tae_fecha,
                tae_entregado_por: me.nuevoarray.tae_entregado_id,
                tae_entregado_cargo: me.nuevoarray.tae_entregado_cargo,
                tae_recibido_por: me.nuevoarray.tae_recibido_id,
                tae_recibido_cargo: me.nuevoarray.tae_recibido_cargo,
                created_by: me.nuevoarray.created_by,
                updated_by: me.nuevoarray.updated_by,
                detalles: me.nuevoarray.detalles
            }

            me.$vs.loading()
            this.$http
                .post(this.$server_url + 'VerifcarMetodosPost_ActaEntrega', datos)
                .then((res) => {
                    me.$vs.loading.close()
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        })
                    } else {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
                .catch(() => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            })
        }
    }
}
</script>

<style scoped>
.ae-card {
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
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
    padding: 10px 0 10px 4px;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 20px;
}

.section-icon {
    font-size: 16px;
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

.form-col.half {
    flex: 1 1 calc(50% - 8px);
    min-width: 220px;
}

.field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    letter-spacing: 0.03em;
}

.req {
    color: #ef4444;
}

/* ── Número de acta (edición) ─────────────────────────── */
.numero-acta-edit-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    margin-bottom: 4px;
}

.numero-acta-label {
    font-size: 11px;
    font-weight: 800;
    color: #1d4ed8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.numero-acta-value {
    font-size: 16px;
    font-weight: 800;
    color: #1e40af;
}

/* ── Número de acta (preview creación) ───────────────── */
.numero-acta-preview {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 10px;
    margin-top: 6px;
}

.numero-acta-badge {
    font-size: 15px;
    font-weight: 800;
    color: #15803d;
    letter-spacing: 0.04em;
}

.numero-acta-hint {
    font-size: 10px;
    color: #64748b;
    font-style: italic;
}

/* ── Acta prose card ──────────────────────────────────── */
.acta-prose-card {
    background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 22px 26px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #1e293b;
}

.acta-prose-line {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 8px 12px;
    margin-bottom: 4px;
    line-height: 2;
}

.acta-text {
    font-size: 14px;
    color: #334155;
    white-space: nowrap;
    line-height: 2.2;
}

.acta-field-inline {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.acta-underline-input {
    border: none;
    border-bottom: 2px solid #6366f1;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #1e293b;
    font-weight: 600;
    padding: 2px 6px;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: inherit;
}

.acta-underline-input:focus {
    border-bottom-color: #4f46e5;
}

.acta-underline-input::placeholder {
    color: #94a3b8;
    font-weight: 400;
    font-size: 13px;
}

.text-center {
    text-align: center;
}

.acta-field-hint {
    font-size: 10px;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding-left: 6px;
}

/* Ajuste para v-select dentro del prose */
.acta-vselect {
    min-width: 200px;
}

/* Valor ya llenado en el prose (solo lectura visual) */
.acta-filled-value {
    display: inline-block;
    border-bottom: 2px solid #6366f1;
    padding: 2px 6px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    min-width: 120px;
    line-height: 1.8;
}

/* ── Personas grid ────────────────────────────────────── */
.personas-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

@media (max-width: 700px) {
    .personas-grid {
        grid-template-columns: 1fr;
    }
}

.persona-card {
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.persona-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-radius: 10px 10px 0 0;
}

.persona-card-header.entregado {
    background: #eff6ff;
    color: #1d4ed8;
}

.persona-card-header.recibido {
    background: #f0fdf4;
    color: #15803d;
}

.persona-card-body {
    padding: 14px 16px;
}

.text-input {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    box-sizing: border-box;
    color: #1e293b;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-top: 6px;
}

.text-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
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
    min-width: 500px;
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
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 2px solid #e2e8f0;
}

.detail-table td {
    padding: 10px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
}

.detail-table tbody tr:last-child td {
    border-bottom: none;
}

.detail-table tbody tr:hover {
    background: #fafbff;
}

.item-num {
    text-align: center;
    font-weight: 700;
    color: #94a3b8;
    font-size: 13px;
}

.table-empty {
    padding: 24px;
    color: #94a3b8;
    font-size: 13px;
    text-align: center;
}

/* ── Textarea ─────────────────────────────────────────── */
.auto-textarea {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    resize: none;
    overflow: hidden;
    min-height: 38px;
    font-size: 13px;
    padding: 8px 10px;
    box-sizing: border-box;
    font-family: inherit;
    color: #1e293b;
    transition: border-color 0.2s;
    line-height: 1.5;
}

.auto-textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.table-textarea {
    min-height: 36px;
}

/* ── Buttons ──────────────────────────────────────────── */
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
    transition: all 0.2s;
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
    transition: all 0.2s;
}

.btn-delete-row:hover {
    background: #fee2e2;
    border-color: #fca5a5;
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
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    transition: all 0.2s;
}

.btn-guardar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
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
    transition: all 0.2s;
}

.btn-cancelar:hover {
    background: #fff0f0;
    border-color: #fca5a5;
    transform: translateY(-2px);
}

/* ── Waiting state ────────────────────────────────────── */
.waiting-selection-card {
    margin-top: 32px;
    padding: 48px 20px;
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
    width: 60px;
    height: 60px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
}

.waiting-svg {
    width: 34px;
    height: 34px;
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
    max-width: 420px;
    line-height: 1.6;
    margin: 0;
}

.waiting-text b {
    color: #334155;
}
</style>
