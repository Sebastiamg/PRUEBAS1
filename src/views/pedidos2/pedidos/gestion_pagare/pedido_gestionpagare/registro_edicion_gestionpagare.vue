<template>
<div class="pagare-form-container" :class="{ 'theme-dark': themeMode }">
    <!-- Soft Gray Header Banner -->
    <div class="pagare-header-banner mb-6">
        <div class="flex items-center justify-between flex-wrap">
            <div>
                <h2 class="title flex items-center">
                    <feather-icon icon="FileTextIcon" svgClasses="h-6 w-6 mr-2" style="color: #3182ce;" />
                    Configuración de Emisión de Pagaré
                </h2>
                <p class="subtitle text-gray-500 mt-1">Configure los parámetros para generar y descargar el pagaré de este pedido.</p>
            </div>
            <div class="flex items-center mt-2 sm:mt-0">
                <div class="badge-contrato mr-4">
                    <span class="label">CONTRATO</span>
                    <span class="value">{{ pedido.contrato_generado || 'Sin Contrato' }}</span>
                </div>
                <!-- <vs-button color="danger" type="filled" icon-pack="feather" icon="icon-x" @click="getCancelar">
                    Regresar
                </vs-button> -->
            </div>
        </div>
    </div>

    <!-- Pedido Details Overview Card -->
    <div class="vx-row mb-6">
        <div class="vx-col w-full">
            <vx-card class="detail-card">
                <div class="vx-row">
                    <div class="vx-col w-full sm:w-1/2 md:w-1/6 mb-4 sm:mb-0 detail-item">
                        <span class="detail-label">ID Pedido</span>
                        <h4 class="detail-value" style="color: #3182ce;">#{{ pedido.id_pedido }}</h4>
                    </div>
                    <div class="vx-col w-full sm:w-1/2 md:w-1/3 mb-4 sm:mb-0 detail-item">
                        <span class="detail-label">Institución</span>
                        <h5 class="detail-value text-dark" :title="pedido.nombreInstitucion" style="white-space: normal; word-break: break-word;">{{ pedido.nombreInstitucion || 'No asignada' }}</h5>
                    </div>
                    <div class="vx-col w-full sm:w-1/2 md:w-1/4 mb-4 sm:mb-0 detail-item">
                        <span class="detail-label">Anticipo Aprobado</span>
                        <h5 class="detail-value text-success">${{ pedido.anticipo_aprobado || 0 }}</h5>
                    </div>
                    <div class="vx-col w-full sm:w-1/2 md:w-1/4 detail-item">
                        <span class="detail-label">Convenio de Años</span>
                        <h5 class="detail-value text-warning">{{ pedido.convenio_anios || 0 }} años</h5>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>

    <!-- Main Logic: If conditions met -->
    <div v-if="canPrintPagare" class="vx-row">
        <!-- Input Form Section -->
        <div class="vx-col w-full lg:w-8/12 mb-6">
            <vx-card title="Detalles del Documento" title-color="primary">
                <div class="vx-row mb-6">
                    <!-- Beneficiario -->
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="form-label font-semibold">Beneficiario <span class="text-danger">*</span></label>
                        <v-select :options="arregloBeneficiarios" :reduce="arregloBeneficiarios => arregloBeneficiarios" label="beneficiarioComision" class="w-full mt-2 custom-select" placeholder="-- Seleccione el Beneficiario --" v-model="beneficiario" />
                    </div>
                    <!-- Empresa -->
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="form-label font-semibold">Empresa <span class="text-danger">*</span></label>
                        <v-select :options="arrayEmpresas" :reduce="arrayEmpresas => arrayEmpresas" label="descripcion_corta" class="w-full mt-2 custom-select" placeholder="-- Seleccione la Empresa --" v-model="empresaSelected" />
                    </div>
                </div>

                <div class="vx-row mb-6">
                    <!-- Año Final -->
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="form-label font-semibold">Año final para calcular días <span class="text-danger">*</span></label>
                        <v-select :options="arregloAniosAnteriores" :reduce="arregloAniosAnteriores => arregloAniosAnteriores" class="w-full mt-2 custom-select" placeholder="-- Seleccione el Año --" v-model="aniosAnteriorSelect" @input="validateAniosAnterior" />
                    </div>
                </div>

                <!-- Tipo de Pagaré (Selectable Custom Cards) -->
                <div class="mb-6">
                    <label class="form-label font-semibold">Tipo de pagaré (Obtener datos desde) <span class="text-danger">*</span></label>
                    <div class="pagare-type-grid mt-3">
                        <!-- Convenio Global Card -->
                        <div v-if="convenioGlobal.valor > 0" class="pagare-type-card" :class="{'active': ifTipoPago == 0}" @click="ifTipoPago = 0">
                            <div class="card-radio-circle"></div>
                            <div class="card-content">
                                <span class="card-label">Convenio Global</span>
                                <h4 class="card-value text-primary">${{ convenioGlobal.valor }}</h4>
                            </div>
                        </div>

                        <!-- Pago Convenio Card -->
                        <div v-if="pagoConvenio.valor > 0" class="pagare-type-card" :class="{'active': ifTipoPago == 1}" @click="ifTipoPago = 1">
                            <div class="card-radio-circle"></div>
                            <div class="card-content">
                                <span class="card-label">Pago Convenio Año Actual</span>
                                <h4 class="card-value text-success">${{ pagoConvenio.valor }}</h4>
                            </div>
                        </div>

                        <!-- Anticipo Pedido Card -->
                        <div v-if="anticipoPedido.valor > 0" class="pagare-type-card" :class="{'active': ifTipoPago == 2}" @click="ifTipoPago = 2">
                            <div class="card-radio-circle"></div>
                            <div class="card-content">
                                <span class="card-label">Anticipo del Pedido</span>
                                <h4 class="card-value text-warning">${{ anticipoPedido.valor }}</h4>
                            </div>
                        </div>
                    </div>
                    <div v-if="ifTipoPago === 100" class="text-danger mt-2 font-medium flex items-center">
                        <feather-icon icon="AlertCircleIcon" svgClasses="mr-1 inline-block h-4 w-4" />
                        Debe seleccionar una de las fuentes de financiamiento del pagaré.
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 flex justify-end">
                    <vs-button color="danger" type="filled" class="mr-4" @click="getCancelar">
                        Cancelar
                    </vs-button>
                    <vs-button class="btn-emit" color="#3182ce" type="filled" icon-pack="feather" icon="icon-save" @click="guardarYGenerarPagare" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar y Generar Pagaré' }}
                    </vs-button>
                </div>
            </vx-card>
        </div>

        <!-- Right Side Information Card -->
        <div class="vx-col w-full lg:w-4/12">
            <vx-card title="Requisitos de Emisión" title-color="warning">
                <p class="text-sm mb-4">Para emitir el pagaré del pedido, se requiere configurar todos los campos obligatorios del formulario.</p>

                <div class="checklist mt-4">
                    <div class="check-item flex items-center mb-3">
                        <vs-icon
                            :key="'formato-aprobado-' + formatoAprobado + '-' + cargandoFormato"
                            :icon="cargandoFormato ? 'hourglass_empty' : 'check_circle'"
                            :color="formatoAprobado ? 'success' : 'grey'"
                            class="mr-2"
                            size="20px"
                        ></vs-icon>
                        <span :class="{'text-success font-semibold': formatoAprobado}">
                            <template v-if="cargandoFormato">Verificando formato...</template>
                            <template v-else-if="formatoAprobado">Formato de Pagaré Aprobado <span class="text-xs text-gray-500 font-normal" v-if="nombrePeriodo">({{ nombrePeriodo }})</span></template>
                            <template v-else>Formato de Pagaré Aprobado</template>
                        </span>
                        <vs-chip v-if="!cargandoFormato && formatoAprobado === false" color="danger" class="ml-2" style="font-size:0.7rem;">Sin formato <span v-if="nombrePeriodo">({{ nombrePeriodo }})</span></vs-chip>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="beneficiario ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': beneficiario}">Beneficiario Seleccionado</span>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="empresaSelected ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': empresaSelected}">Empresa Seleccionada</span>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="aniosAnteriorSelect ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': aniosAnteriorSelect}">Año Final Configurado</span>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="ifTipoPago !== 100 ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': ifTipoPago !== 100}">Origen de Pago Seleccionado</span>
                    </div>
                </div>

                <!-- Monto a guardar (preview) -->
                <div v-if="ifTipoPago !== 100" class="mt-4 p-3 rounded-lg preview-monto-container">
                    <p class="text-xs text-gray-500 mb-1">Monto a registrar</p>
                    <h3 class="text-success font-bold text-xl">${{ montoSeleccionado }}</h3>
                </div>
            </vx-card>
        </div>
    </div>

    <!-- Error/Notice: If conditions not met -->
    <div v-else class="vx-row">
        <div class="vx-col w-full">
            <vx-card class="bg-danger-light text-center p-6 border-danger shadow-sm">
                <vs-avatar color="danger" icon-pack="feather" icon="icon-slash" size="70px" class="mb-4 mx-auto block shadow-md" />
                <h3 class="text-danger font-bold mb-2">Este pedido no cumple con las condiciones para generar un pagaré</h3>
                <p class="text-dark max-w-lg mx-auto mb-6 text-base">
                    Para que la impresión del pagaré esté habilitada, el pedido debe contar con un <b>anticipo aprobado</b> o un <b>convenio de años</b> configurado, tener su <b>código de contrato generado</b> en la plataforma y encontrarse en <b>estado activo (1)</b>.
                </p>
                <div class="vx-row max-w-md mx-auto text-left py-4 px-6 bg-white rounded-lg shadow-inner">
                    <div class="vx-col w-full flex items-center justify-between mb-2">
                        <span>Anticipo Aprobado o Convenio Años:</span>
                        <vs-chip :color="(pedido.anticipo_aprobado > 0 || pedido.convenio_anios > 0) ? 'success' : 'danger'">
                            {{ (pedido.anticipo_aprobado > 0 || pedido.convenio_anios > 0) ? 'Cumple' : 'No cumple' }}
                        </vs-chip>
                    </div>
                    <div class="vx-col w-full flex items-center justify-between mb-2">
                        <span>Contrato Generado:</span>
                        <vs-chip :color="pedido.contrato_generado != null ? 'success' : 'danger'">
                            {{ pedido.contrato_generado != null ? 'Generado' : 'Pendiente' }}
                        </vs-chip>
                    </div>
                    <div class="vx-col w-full flex items-center justify-between">
                        <span>Estado del Pedido (Activo):</span>
                        <vs-chip :color="pedido.estado == 1 ? 'success' : 'danger'">
                            {{ pedido.estado == 1 ? 'Activo' : 'Inactivo/Pendiente' }}
                        </vs-chip>
                    </div>
                </div>
                <div class="mt-8">
                    <vs-button color="danger" type="relief" @click="getCancelar">Regresar</vs-button>
                </div>
            </vx-card>
        </div>
    </div>

    <!-- Loader Modal -->
    <vs-popup class="custom-loader-popup informacionformhijo2" title="Generando Documento" :active.sync="popupCarga">
        <div class="text-center p-6">
            <p class="text-warning text-2xl font-bold bg-dark py-3 px-4 rounded flex items-center justify-center">
                <vs-icon icon="cloud_download" class="mr-2" size="28px"></vs-icon>
                <span>Espere mientras se descarga el archivo...</span>
            </p>
            <img class="mt-6 mx-auto animate-bounce" style="max-width: 150px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" alt="Cargando" />
        </div>
    </vs-popup>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';

const reporte_gestionpagare = () => import('@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/reporte_gestionpagare.vue');

export default {
    data() {
        return {
            id_beneficiario_pedido: 0,
            beneficiario: '',
            arregloBeneficiarios: [],
            arrayEmpresas: [],
            empresaSelected: '',
            arregloAniosAnteriores: [],
            anioEmpieza: null,
            aniosAnteriorSelect: null,
            numeroPagare: '',
            ifTipoPago: 100, // 100 = default no seleccionado
            popupReportePagare: false,
            popupCarga: false,
            pgc_id_guardado: null,
            contrato: '',
            guardando: false,
            pagoConvenio: {
                valor: 0,
                estado: 0
            },
            anticipoPedido: {
                valor: 0,
                estado: 0
            },
            convenioGlobal: {
                valor: 0,
                estado: 0
            },
            tipo: 4, // Pagaré
            // Verificación de formato aprobado
            formatoAprobado: null,  // null = sin verificar, true = existe, false = no existe
            cargandoFormato: false,
            nombrePeriodo: '',
        }
    },
    props: {
        datosInstitucion: {
            type: Object,
            default: function () {
                return {}
            }
        },
        pedido: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    components: {
        'v-select': vSelect,
        reporte_gestionpagare
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        canPrintPagare() {
            let me = this;
            if (!me.pedido) return false;
            const hasAnticipoOrConvenio = (Number(me.pedido.anticipo_aprobado) > 0 || Number(me.pedido.convenio_anios) > 0);
            const hasContrato = me.pedido.contrato_generado != null && String(me.pedido.contrato_generado).trim() !== '';
            const isActive = Number(me.pedido.estado) === 1;
            return hasAnticipoOrConvenio && hasContrato && isActive;
        },
        montoSeleccionado() {
            if (this.ifTipoPago === 0) return this.convenioGlobal.valor;
            if (this.ifTipoPago === 1) return this.pagoConvenio.valor;
            if (this.ifTipoPago === 2) return this.anticipoPedido.valor;
            return 0;
        }
    },
    mounted() {
        let me = this;
        me.contrato = me.pedido.contrato_generado || me.pedido.contrato || '';
        me.anioEmpieza = new Date().getFullYear();

        if (me.canPrintPagare) {
            me.$vs.loading();
            Promise.all([
                me.getAniosAnteriores(),
                me.getBeneficiarios(me.pedido.id_pedido),
                me.getEmpresas(),
                me.getDatosPedido(),
                me.getConvenioGlobal(),
                me.getAnticipoPedido()
            ]).finally(() => {
                me.$vs.loading.close();
            });
            me.verificarFormatoAprobado();
        }
    },
    methods: {
        // ─── Obtiene el idusuario desde localStorage ──────────────────
        getIdUsuarioLocal() {
            try {
                const raw = localStorage.getItem('usuario');
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return parsed.idusuario || null;
            } catch (e) {
                return null;
            }
        },

        verificarFormatoAprobado() {
            let me = this;
            me.cargandoFormato = true;
            me.formatoAprobado = null;
            me.nombrePeriodo = '';

            me.$http.get(me.$server_url + 'VerifcarMetodosGet_Pagare_Pedido', {
                params: {
                    action: 'Get_VerificarFormatoAprobado',
                    id_pedido: me.pedido.id_pedido
                }
            })
            .then(res => {
                me.formatoAprobado = res.data.formato_aprobado === true;
                me.nombrePeriodo = res.data.periodoescolar || '';
            })
            .catch(() => {
                me.formatoAprobado = false;
                me.nombrePeriodo = '';
            })
            .finally(() => {
                me.cargandoFormato = false;
            });
        },

        validateAniosAnterior() {
            if (this.aniosAnteriorSelect && this.anioEmpieza && Number(this.aniosAnteriorSelect) < Number(this.anioEmpieza)) {
                this.$vs.notify({
                    text: 'El año final debe ser mayor al de comienzo.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x',
                    time: '5000'
                });
                this.aniosAnteriorSelect = null;
            }
        },

        getAniosAnteriores() {
            let me = this;
            me.arregloAniosAnteriores = [];
            var fechaActual = new Date();
            var añoActual = fechaActual.getFullYear();
            me.anioEmpieza = añoActual;
            var ultimosCincoAñosAnteriores = [];
            var proximosCincoAños = [];
            for (var i = 1; i <= 10; i++) {
                ultimosCincoAñosAnteriores.push(añoActual - i);
            }
            for (var i = 0; i <= 10; i++) {
                proximosCincoAños.push(añoActual + i);
            }
            var todosLosAños = [...ultimosCincoAñosAnteriores, ...proximosCincoAños];
            todosLosAños.sort(function (a, b) {
                return a - b;
            });
            me.arregloAniosAnteriores = todosLosAños;
        },

        getDatosPedido() {
            let me = this;
            return this.$http.get(this.$server_url + `getConvenio?pedido=${me.pedido.id_pedido}`)
                .then(res => {
                    let datos = res.data;
                    if (datos.length > 0) {
                        me.pagoConvenio.valor = datos[0].doc_valor;
                        me.pagoConvenio.estado = datos[0].estado;
                    } else {
                        me.pagoConvenio.valor = 0;
                        me.pagoConvenio.estado = 0;
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                });
        },

        getConvenioGlobal() {
            let me = this;
            return this.$http.get(this.$server_url + `getConvenioGlobalActivo?institucion=${me.pedido.id_institucion}`)
                .then(res => {
                    let datos = res.data;
                    if (datos.length > 0) {
                        me.convenioGlobal.valor = datos[0].anticipo_global;
                        me.convenioGlobal.estado = 1;
                    } else {
                        me.convenioGlobal.valor = 0;
                        me.convenioGlobal.estado = 1;
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                });
        },

        getAnticipoPedido() {
            let me = this;
            return this.$http.get(this.$server_url + `getAnticipoPedido?pedido=${me.pedido.id_pedido}`)
                .then(res => {
                    let datos = res.data;
                    if (datos.length > 0) {
                        me.anticipoPedido.valor = datos[0].doc_valor;
                        me.anticipoPedido.estado = datos[0].estado;
                    } else {
                        me.anticipoPedido.valor = 0;
                        me.anticipoPedido.estado = 0;
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                });
        },

        getBeneficiarios(pedido) {
            let me = this;
            me.arregloBeneficiarios = [];
            me.beneficiario = '';
            return this.$http.get(this.$server_url + 'get_beneficiarios_pedidos/' + pedido)
                .then(res => {
                    me.arregloBeneficiarios = res.data;
                });
        },

        getEmpresas() {
            let me = this;
            me.arrayEmpresas = [];
            me.empresaSelected = '';
            return this.$http.get(this.$server_url + 'empresa/')
                .then(res => {
                    me.arrayEmpresas = res.data;
                });
        },

        // ─── Validaciones del formulario ──────────────────────────────
        validarFormulario() {
            let me = this;
            if (me.formatoAprobado === false) {
                me.$vs.notify({
                    text: 'No existe un Formato de Pagaré aprobado para el período ' + (me.nombrePeriodo ? '\'' + me.nombrePeriodo + '\'' : 'de este pedido') + '.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (!me.beneficiario) {
                me.$vs.notify({
                    text: 'Seleccione un beneficiario por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (me.aniosAnteriorSelect == null || me.aniosAnteriorSelect === '') {
                me.$vs.notify({
                    text: 'Seleccione un año final a calcular por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (!me.empresaSelected) {
                me.$vs.notify({
                    text: 'Seleccione una empresa por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (me.ifTipoPago === 100) {
                me.$vs.notify({
                    text: 'Debe seleccionar un tipo de pagaré',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (me.ifTipoPago === 0 && me.convenioGlobal.valor == 0) {
                me.$vs.notify({
                    text: 'El convenio global no tiene valor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            return true;
        },

        // ─── Guarda en BD y luego genera el PDF ──────────────────────
        guardarYGenerarPagare() {
            let me = this;
            if (!me.validarFormulario()) return;

            me.guardando = true;
            me.$vs.loading();

            const idusuario = me.getIdUsuarioLocal();
            const monto = me.montoSeleccionado;
            // pgc_tipo_pagare: '0' Convenio Global, '1' Pago Convenio, '2' Anticipo
            const tipoPagare = String(me.ifTipoPago);

            const payload = {
                action: 'Post_Registrar_Pagare_Pedido',
                id_beneficiario_pedido: me.beneficiario.id_beneficiario_pedido,
                id_pedido: me.pedido.id_pedido,
                empresa_id: me.empresaSelected.id,
                letra_empresa: me.empresaSelected.letra_empresa,
                contrato_generado: me.pedido.contrato_generado,
                pgc_monto: monto,
                pgc_anio: me.aniosAnteriorSelect,
                pgc_tipo_pagare: tipoPagare,
                idusuario: idusuario,
            };

            me.$http.post(me.$server_url + 'VerifcarMetodosPost_Pagare_Pedido', payload)
                .then(res => {
                    const data = res.data;
                    if (data.status === 1) {
                        // Éxito: actualizar variable de numero de pagaré y lanzar PDF
                        me.numeroPagare = data.pgc_codigo || '';
                        me.id_beneficiario_pedido = me.beneficiario.id_beneficiario_pedido;

                        // Notifica al padre del guardado exitoso y pasa el id para abrir reporte inmediatamente en el padre
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1,
                            pgc_id: data.pgc_id,
                            pgc_anio: me.aniosAnteriorSelect
                        });
                    } else {
                        me.$vs.notify({
                            title: 'Error al registrar',
                            text: data.message || 'No se pudo guardar el pagaré.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 6000
                        });
                    }
                })
                .catch(err => {
                    const msg = (err.response && err.response.data && err.response.data.message) ?
                        err.response.data.message :
                        'Error de conexión al guardar el pagaré.';
                    me.$vs.notify({
                        title: 'Error',
                        text: msg,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000
                    });
                })
                .finally(() => {
                    me.$vs.loading.close();
                    me.guardando = false;
                });
        },

        changeHandle(e) {
            let me = this;
            me.popupReportePagare = false;
            me.pgc_id_guardado = null;
            // Notify parent: guardado + impreso exitosamente
            me.$emit('change', {
                verificacionemitsaveandedit: 1
            });
        },

        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        }
    }
}
</script>

<style scoped>
.pagare-form-container {
    padding: 1.5rem;
    font-family: 'Outfit', 'Inter', sans-serif;
    background-color: #f3f4f6;
    border-radius: 16px;
    min-height: 100%;
}

.pagare-header-banner {
    background: #ffffff !important;
    border: 1px solid #e2e8f0;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.pagare-header-banner .title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2d3748;
}

.pagare-header-banner .subtitle {
    font-size: 0.9rem;
    color: #718096;
}

.badge-contrato {
    border: 1px solid #e2e8f0;
    background: #fff;
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    text-align: right;
}

.badge-contrato .label {
    display: block;
    font-size: 0.65rem;
    color: #718096;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.badge-contrato .value {
    display: block;
    font-size: 0.95rem;
    color: #2d3748;
    font-weight: 700;
}

.detail-card {
    background: #ffffff !important;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.detail-item {
    border-right: 1px solid #f3f3f3;
    padding-left: 1.5rem;
}

.detail-item:last-child {
    border-right: none;
}

.detail-label {
    font-size: 0.8rem;
    color: #a0aec0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 0.25rem;
}

.detail-value {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
}

.form-label {
    color: #4a5568;
    font-size: 0.9rem;
}

.custom-select>>>.vs__dropdown-toggle {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 2px 0;
    transition: all 0.3s ease;
}

.custom-select>>>.vs__dropdown-toggle:hover {
    border-color: #cbd5e0;
}

.custom-select>>>.vs__selected {
    color: #2d3748;
    font-weight: 500;
}

.pagare-type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.pagare-type-card {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    background: #fff;
}

.pagare-type-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e0;
}

.pagare-type-card.active {
    border-color: #3182ce;
    background: rgba(49, 130, 206, 0.03);
    box-shadow: 0 4px 15px rgba(49, 130, 206, 0.1);
}

.card-radio-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #cbd5e0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.pagare-type-card.active .card-radio-circle {
    border-color: #3182ce;
    background: #3182ce;
}

.pagare-type-card.active .card-radio-circle::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
}

.card-content {
    display: flex;
    flex-direction: column;
}

.card-label {
    font-size: 0.8rem;
    color: #718096;
    font-weight: 500;
}

.card-value {
    font-size: 1.3rem;
    font-weight: 700;
    margin-top: 2px;
}

.checklist .check-item {
    font-size: 0.95rem;
    color: #4a5568;
}

.btn-emit {
    padding: 0.75rem 2rem !important;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 8px !important;
    transition: all 0.3s ease;
}

.btn-emit:hover {
    box-shadow: 0 6px 20px rgba(49, 130, 206, 0.3) !important;
    transform: translateY(-1px);
}

.bg-danger-light {
    background-color: rgba(234, 84, 85, 0.05);
}

.border-danger {
    border: 1px solid rgba(234, 84, 85, 0.2) !important;
    border-radius: 12px;
}

.custom-loader-popup>>>.vs-popup {
    border-radius: 16px;
    max-width: 450px;
}

.bg-dark {
    background-color: #2d3748;
}

/* Dark mode styles for register/edit */
.pagare-form-container.theme-dark {
    background-color: transparent;
    color: #cbd5e1;
}

.theme-dark .pagare-header-banner {
    background: rgba(15, 23, 42, 0.4) !important;
    border-color: #334155;
}

.theme-dark .pagare-header-banner .title {
    color: #f1f5f9;
}

.theme-dark .pagare-header-banner .subtitle {
    color: #94a3b8;
}

.theme-dark .badge-contrato {
    background: rgba(15, 23, 42, 0.5);
    border-color: #334155;
}

.theme-dark .badge-contrato .value {
    color: #f1f5f9;
}

.theme-dark .badge-contrato .label {
    color: #94a3b8;
}

.theme-dark .detail-card {
    background: #1e293b !important;
    border-color: #334155;
}

.theme-dark .detail-item {
    border-right-color: #334155;
}

.theme-dark .detail-label {
    color: #94a3b8;
}

.theme-dark .detail-value.text-dark {
    color: #cbd5e1 !important;
}

.theme-dark .form-label {
    color: #cbd5e1;
}

/* v-select in dark mode */
.theme-dark .custom-select >>> .vs__dropdown-toggle {
    border-color: #334155 !important;
    background-color: rgba(15, 23, 42, 0.6) !important;
}
.theme-dark .custom-select >>> .vs__selected {
    color: #f1f5f9 !important;
}
.theme-dark .custom-select >>> .vs__search {
    color: #f1f5f9 !important;
}
.theme-dark .custom-select >>> .vs__dropdown-menu {
    background-color: #1e293b !important;
    color: #cbd5e1 !important;
    border-color: #334155 !important;
}
.theme-dark .custom-select >>> .vs__dropdown-option {
    color: #cbd5e1 !important;
}
.theme-dark .custom-select >>> .vs__dropdown-option--highlight {
    background: #7367f0 !important;
    color: #fff !important;
}

/* Pagare type card in dark mode */
.theme-dark .pagare-type-card {
    background: #1e293b;
    border-color: #334155;
}
.theme-dark .pagare-type-card:hover {
    border-color: #4a5568;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.theme-dark .pagare-type-card.active {
    border-color: #7367f0;
    background: rgba(115, 103, 240, 0.05);
    box-shadow: 0 4px 15px rgba(115, 103, 240, 0.15);
}
.theme-dark .card-radio-circle {
    border-color: #4a5568;
}
.theme-dark .pagare-type-card.active .card-radio-circle {
    border-color: #7367f0;
    background: #7367f0;
}
.theme-dark .card-label {
    color: #94a3b8;
}
.theme-dark .checklist .check-item {
    color: #cbd5e1;
}

/* Preview monto */
.preview-monto-container {
    background: #f0fff4;
    border: 1px solid #c6f6d5;
}
.theme-dark .preview-monto-container {
    background: rgba(40, 199, 111, 0.08);
    border-color: rgba(40, 199, 111, 0.2);
}

/* White bg panel inside callout in dark mode */
.theme-dark .bg-white {
    background-color: rgba(15, 23, 42, 0.5) !important;
}
.theme-dark .text-dark {
    color: #cbd5e1 !important;
}
.theme-dark .vx-card {
    background-color: #1e293b !important;
    color: #cbd5e1 !important;
}
.theme-dark .vx-card >>> .vx-card__title h4 {
    color: #f1f5f9 !important;
}

</style>
