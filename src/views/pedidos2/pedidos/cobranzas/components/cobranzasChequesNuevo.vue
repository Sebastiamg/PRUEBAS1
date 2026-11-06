<template>
<div class="m-2 cheques-nuevo-wrap">
    <vs-divider>Seccion Cheques</vs-divider>

    <div class="flex justify-start mb-2" v-if="AdminFacturador">
        <vs-button color="primary" @click="abrirRegistroCheque">Registro cheque</vs-button>
    </div>

    <vs-table stripe search max-items="10" pagination :data="cheques" no-data-text="No hay datos disponibles">
        <template slot="header">
            <vs-chip color="primary" class="mr-2">Cantidad {{ cheques.length > 0 ? cheques.length : '0' }}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Cheque N°</vs-th>
            <vs-th>Valor</vs-th>
            <vs-th>Detalle</vs-th>
            <vs-th>Estado</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>{{ tr.chq_numero }}</vs-td>
                <vs-td>$ {{ tr.chq_valor | filtrarDecimal }}</vs-td>
                <vs-td>
                    <div><b>Tipo: {{ tr.chq_tipo === 0 ? 'Garantia' : tr.chq_tipo === 1 ? 'Posfechado' : 'N/A' }}</b></div>
                    <div><b>Cuenta Cheque: {{ tr.chq_cuenta }}</b></div>
                    <div v-if="tr.chq_tipo === 1"><b style="color: red;">Fecha cobro del cheque: {{ tr.chq_fecha_cobro }}</b></div>
                    <div><b>Fecha Creacion:</b> {{ tr.created_at }}</div>
                    <div><b>{{ tr.chq_nombrebanco }}</b></div>
                    <div><b>Referencia: {{ tr.chq_referenca }}</b></div>
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.chq_estado == 0" color="warning">
                        <span>Pendiente</span>
                    </vs-chip>
                    <vs-chip v-if="tr.chq_estado == 1" color="success">
                        <span>Cobrado</span>
                    </vs-chip>
                    <vs-chip v-if="tr.chq_estado == 2" color="danger">
                        <span>Devuelto</span>
                    </vs-chip>
                    <vs-chip v-if="tr.chq_estado == 3" color="primary">
                        <span>Protestado</span>
                    </vs-chip>
                </vs-td>
                <vs-td>
                    <div class="acciones-cheque">
                        <vs-button
                            v-if="tr.chq_estado !== 2 && tr.chq_estado !== 1"
                            size="small"
                            color="success"
                            type="relief"
                            @click="abrirCobroCheque(tr)"
                        >
                            Cobrar
                        </vs-button>
                        <vs-button
                            v-if="(tr.chq_tipo == 1 || tr.chq_tipo == 0) && tr.chq_estado == 0"
                            size="small"
                            color="danger"
                            type="relief"
                            @click="cambioEstadoCheque(tr.chq_id, 2)"
                        >
                            Devolver
                        </vs-button>
                    </div>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>

    <vs-popup v-if="popupCobroCheque" title="Abono Cheque" :active.sync="popupCobroCheque" class="popup-cobranza-estandar">
        <div class="mb-3 text-center">
            <b style="font-size: 13px">Cobro Cheque N° {{ chequeSeleccionado && chequeSeleccionado.chq_numero ? chequeSeleccionado.chq_numero : '' }}</b>
        </div>

        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Temporada:</span>
                <vs-input class="w-full" :value="periodoSelect && periodoSelect.codigo_contrato ? periodoSelect.codigo_contrato : ''" disabled />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>N° Cuenta:</span>
                <vs-input class="w-full" v-model="tabCobroCheque.numeroCuenta" disabled />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>N° Cheque:</span>
                <vs-input class="w-full" v-model="tabCobroCheque.numeroCheque" disabled />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Valor Cheque:</span>
                <vs-input class="w-full" v-model="tabCobroCheque.valor" disabled />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Fecha de cobro:</span>
                <vs-input class="w-full" type="date" v-model="tabCobroCheque.fechaCobro" />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>En la Cuenta:</span>
                <v-select
                    :options="cuentas"
                    :reduce="item => item.cue_pag_codigo"
                    label="cue_pag_nombre"
                    class="w-full"
                    placeholder="--Seleccione Cuenta--"
                    v-model="tabCobroCheque.cuenta"
                />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Destino:</span>
                <div>
                    <vs-radio v-model="tabCobroCheque.notasOfactura" class="mr-4" vs-name="radiosDestinoCheque" vs-value="0" disabled>Facturas</vs-radio>
                    <vs-radio v-model="tabCobroCheque.notasOfactura" vs-name="radiosDestinoCheque" vs-value="1">Notas</vs-radio>
                </div>
            </div>
            <div class="vx-col w-full mb-3">
                <div class="font-bold mb-2">Distribución del cobro</div>
                <div class="cheque-distribucion-head">
                    <span>Documento</span>
                    <span>Valor</span>
                    <span>Ya abonado</span>
                    <span>Disponible</span>
                    <span>Abono</span>
                </div>
                <div v-if="documentosCobroChequeNuevo.length > 0" class="cheque-distribucion-body">
                    <div v-for="(doc, indexDoc) in documentosCobroChequeNuevo" :key="doc.ven_codigo || indexDoc" class="cheque-distribucion-row" :class="{ 'cheque-distribucion-row-disabled': Number(doc.saldo_disponible) <= 0 }">
                        <span class="font-bold text-primary">{{ doc.ven_codigo }}</span>
                        <span>$ {{ Number(doc.ven_valor).toFixed(2) }}</span>
                        <span>$ {{ Number(doc.ven_valor_abono).toFixed(2) }}</span>
                        <span>$ {{ Number(doc.saldo_disponible).toFixed(2) }}</span>
                        <vs-input type="number" class="cheque-input-mini" v-model="doc.abono_manual" min="0" :max="doc.saldo_disponible" :disabled="Number(doc.saldo_disponible) <= 0" @input="validarDistribucionCheque(indexDoc)" />
                    </div>
                </div>
                <div v-else class="text-sm text-gray-600">
                    No hay notas disponibles para distribuir el cheque.
                </div>
                <div class="cheque-distribucion-footer">
                    <span>Total distribuido: <b>${{ totalDistribuidoCobroChequeNuevo | filtrarDecimal }}</b></span>
                    <span>Saldo pendiente: <b>${{ saldoPendienteCobroChequeNuevo | filtrarDecimal }}</b></span>
                </div>
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Documento Abono #:</span>
                <vs-input class="w-full" :disabled="tabCobroCheque.notasOfactura === ''" v-model="tabCobroCheque.documento" @blur="agregarDocumentoAConcepto" />
            </div>
            <!-- <div class="vx-col w-full mb-3">
                <span>Concepto del Abono:</span>
                <vs-textarea class="w-full" v-model="tabCobroCheque.concepto" :readonly="!tabCobroCheque.documento" />
            </div> -->
        </div>

        <div class="flex mt-3 justify-end" style="gap:8px;">
            <vs-button color="success" type="filled" @click="guardarCobroCheque">Guardar</vs-button>
            <vs-button color="danger" type="border" @click="popupCobroCheque = false">Cancelar</vs-button>
        </div>
    </vs-popup>

    <vs-popup title="Registro de cheque" :active.sync="popupRegistroCheque" class="popup-cobranza-estandar">
        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Banco:</span>
                <v-select
                    :options="bancos"
                    :reduce="item => item"
                    label="ban_nombre"
                    class="w-full"
                    placeholder="--Seleccione banco--"
                    v-model="formCheque.bancoObj"
                    @input="setBancoNombre"
                />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Tipo:</span>
                <v-select
                    :options="tipoChequeOptions"
                    :reduce="item => item.value"
                    label="label"
                    class="w-full"
                    placeholder="--Seleccione tipo--"
                    v-model="formCheque.chq_tipo"
                />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Numero cheque:</span>
                <vs-input class="w-full" v-model="formCheque.chq_numero" />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Valor:</span>
                <vs-input class="w-full" v-model="formCheque.chq_valor" />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Cuenta cheque:</span>
                <vs-input class="w-full" v-model="formCheque.chq_cuenta" />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3">
                <span>Referencia:</span>
                <vs-input class="w-full" v-model="formCheque.chq_referenca" />
            </div>
            <div class="vx-col w-full md:w-1/2 mb-3" v-if="formCheque.chq_tipo == 1">
                <span>Fecha cobro:</span>
                <vs-input class="w-full" type="date" v-model="formCheque.chq_fecha_cobro" />
            </div>
        </div>

        <div class="flex justify-center mt-4" style="gap:10px;">
            <vs-button color="success" type="filled" @click="guardarCheque">Guardar</vs-button>
            <vs-button color="danger" type="border" @click="popupRegistroCheque = false">Cancelar</vs-button>
        </div>
    </vs-popup>
</div>
</template>

<script>
import vSelect from 'vue-select';
import { mapState } from 'vuex';

export default {
    name: 'CobranzasChequesNuevo',
    components: {
        'v-select': vSelect,
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {};
            }
        },
        empresaCobranza: {
            type: [Object, Array],
            default: function () {
                return {};
            }
        },
        datosCliente: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data() {
        return {
            cheques: [],
            bancos: [],
            cuentas: [],
            popupRegistroCheque: false,
            popupCobroCheque: false,
            chequeSeleccionado: null,
            tipoChequeOptions: [{
                    label: 'Garantia',
                    value: 0
                },
                {
                    label: 'Posfechado',
                    value: 1
                }
            ],
            formCheque: {
                bancoObj: null,
                chq_tipo: null,
                chq_valor: '',
                chq_cuenta: '',
                chq_referenca: '',
                chq_numero: '',
                chq_fecha_cobro: '',
                chq_nombrebanco: '',
            },
            tabCobroCheque: {
                cuenta: '',
                numeroCuenta: '',
                numeroCheque: '',
                valor: '',
                fechaCobro: '',
                notasOfactura: '1',
                documento: '',
                banco: '',
                concepto: '',
            },
            documentosCobroChequeNuevo: [],
        };
    },
    computed: {
        ...mapState(['AdminFacturador']),
        totalDistribuidoCobroChequeNuevo() {
            let total = 0;
            for (let i = 0; i < this.documentosCobroChequeNuevo.length; i++) {
                total += this.documentosCobroChequeNuevo[i].abono_manual ? Number(this.documentosCobroChequeNuevo[i].abono_manual) : 0;
            }
            return total;
        },
        saldoPendienteCobroChequeNuevo() {
            return Number(this.tabCobroCheque.valor) - Number(this.totalDistribuidoCobroChequeNuevo);
        }
    },
    watch: {
        datosCliente: {
            handler() {
                this.cargarCheques();
            },
            deep: true
        },
        empresaCobranza: {
            handler() {
                this.cargarCheques();
            },
            deep: true
        }
    },
    mounted() {
        this.cargarCheques();
    },
    methods: {
        getClienteBusqueda() {
            if (this.datosCliente && this.datosCliente.length > 0 && this.datosCliente[0].identificacion) {
                return this.datosCliente[0].identificacion;
            }
            return '';
        },
        getEmpresaBusqueda() {
            if (this.empresaCobranza && this.empresaCobranza.id) {
                return this.empresaCobranza.id;
            }
            return '';
        },
        cargarCheques() {
            let me = this;
            let cliente = me.getClienteBusqueda();
            let empresa = me.getEmpresaBusqueda();
            let periodo = me.periodoSelect && me.periodoSelect.idperiodoescolar ? me.periodoSelect.idperiodoescolar : '';

            if (!cliente || !empresa || !periodo) {
                me.cheques = [];
                return;
            }

            me.$vs.loading();
            this.$http.get(this.$server_url + 'GetCheque_todo?periodo=' + periodo + '&empresa=' + empresa + '&cliente=' + cliente)
                .then(res => {
                    me.cheques = res.data;
                    me.$vs.loading.close();
                })
                .catch(() => {
                    me.$vs.loading.close();
                    me.cheques = [];
                });
        },
        abrirRegistroCheque() {
            this.formCheque.bancoObj = null;
            this.formCheque.chq_tipo = null;
            this.formCheque.chq_valor = '';
            this.formCheque.chq_cuenta = '';
            this.formCheque.chq_referenca = this.periodoSelect && this.periodoSelect.codigo_contrato ? this.periodoSelect.codigo_contrato : '';
            this.formCheque.chq_numero = '';
            this.formCheque.chq_fecha_cobro = '';
            this.formCheque.chq_nombrebanco = '';
            this.popupRegistroCheque = true;
            this.cargarBancos();
        },
        cargarBancos() {
            let me = this;
            this.$http.get(this.$server_url + 'GetBanco_todo')
                .then(res => {
                    me.bancos = res.data;
                })
                .catch(() => {
                    me.bancos = [];
                });
        },
        setBancoNombre() {
            if (this.formCheque.bancoObj && this.formCheque.bancoObj.ban_nombre) {
                this.formCheque.chq_nombrebanco = this.formCheque.bancoObj.ban_nombre;
            }
        },
        guardarCheque() {
            let me = this;
            let cliente = me.getClienteBusqueda();
            let empresa = me.getEmpresaBusqueda();
            let periodo = me.periodoSelect && me.periodoSelect.idperiodoescolar ? me.periodoSelect.idperiodoescolar : '';

            if (!cliente || !empresa || !periodo) {
                me.$vs.notify({
                    text: 'No hay cliente, empresa o periodo para registrar cheque',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            if (!me.formCheque.bancoObj || me.formCheque.chq_tipo === null || !me.formCheque.chq_numero || !me.formCheque.chq_valor || !me.formCheque.chq_cuenta || !me.formCheque.chq_referenca) {
                me.$vs.notify({
                    text: 'Complete todos los campos obligatorios del cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            let usuario = JSON.parse(localStorage.getItem('usuario'));
            let datos = {
                ban_codigo: me.formCheque.bancoObj.ban_codigo,
                chq_tipo: me.formCheque.chq_tipo,
                chq_valor: me.formCheque.chq_valor,
                chq_fecha_cobro: me.formCheque.chq_fecha_cobro,
                chq_cuenta: me.formCheque.chq_cuenta,
                chq_referenca: me.formCheque.chq_referenca,
                chq_numero: me.formCheque.chq_numero,
                chq_periodo: periodo,
                chq_empresa: empresa,
                chq_cliente: cliente,
                chq_nombrebanco: me.formCheque.chq_nombrebanco,
                user_created: usuario && usuario.idusuario ? usuario.idusuario : 0,
            };

            me.$vs.loading();
            this.$http.post(this.$server_url + 'cheque_registro_nuevo', datos)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data && res.data.status == 1) {
                        me.popupRegistroCheque = false;
                        me.$vs.notify({
                            text: 'Cheque registrado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.cargarCheques();
                    } else {
                        me.$vs.notify({
                            text: res.data && res.data.message ? res.data.message : 'No se pudo registrar el cheque',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch(() => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al registrar cheque',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                });
        },
        abrirCobroCheque(cheque) {
            this.chequeSeleccionado = cheque;
            this.tabCobroCheque.cuenta = '';
            this.tabCobroCheque.numeroCuenta = cheque && cheque.chq_cuenta ? cheque.chq_cuenta : '';
            this.tabCobroCheque.numeroCheque = cheque && cheque.chq_numero ? cheque.chq_numero : '';
            this.tabCobroCheque.valor = cheque && cheque.chq_valor ? cheque.chq_valor : '';
            this.tabCobroCheque.fechaCobro = new Date().toISOString().substr(0, 10);
            this.tabCobroCheque.notasOfactura = '1';
            this.tabCobroCheque.documento = '';
            this.tabCobroCheque.banco = cheque && cheque.ban_codigo ? cheque.ban_codigo : '';
            this.tabCobroCheque.concepto = 'CLIENTE: ' + (this.datosCliente && this.datosCliente[0] && this.datosCliente[0].razonsocial ? this.datosCliente[0].razonsocial : '') + ' DOCUMENTO: ';
            this.popupCobroCheque = true;
            this.cargarCuentas();
            this.cargarDocumentosCobroChequeNuevo();
        },
        cargarDocumentosCobroChequeNuevo() {
            let me = this;
            let cliente = me.getClienteBusqueda();
            let periodo = me.periodoSelect && me.periodoSelect.idperiodoescolar ? me.periodoSelect.idperiodoescolar : '';
            let empresa = me.getEmpresaBusqueda();

            me.documentosCobroChequeNuevo = [];
            if (!cliente || !periodo || !empresa) {
                return;
            }

            this.$http.get(`${this.$server_url}get_facturasNotasxParametro?periodo=${periodo}&empresa=${empresa}&cliente=${cliente}&reporte=2`)
                .then(res => {
                    let datos = res.data || [];
                    me.documentosCobroChequeNuevo = datos
                        .filter(item => item.idtipodoc === 4 || item.idtipodoc === 3)
                        .map(item => {
                            let valor = item && item.ven_valor ? Number(item.ven_valor) : 0;
                            let abonado = item && item.ven_valor_abono ? Number(item.ven_valor_abono) : 0;
                            let saldo = valor - abonado;
                            if (saldo < 0) {
                                saldo = 0;
                            }
                            return {
                                ven_codigo: item.ven_codigo,
                                ven_valor: valor,
                                ven_valor_abono: abonado,
                                saldo_disponible: saldo,
                                abono_manual: 0,
                            };
                        });
                })
                .catch(() => {
                    me.documentosCobroChequeNuevo = [];
                });
        },
        validarDistribucionCheque(indexDoc) {
            let item = this.documentosCobroChequeNuevo[indexDoc];
            if (!item) {
                return;
            }
            let valor = item.abono_manual ? Number(item.abono_manual) : 0;
            let saldoDisponible = Number(item.saldo_disponible);
            if (valor < 0) {
                item.abono_manual = 0;
                return;
            }
            if (valor > saldoDisponible) {
                item.abono_manual = saldoDisponible;
            }
        },
        cargarCuentas() {
            let me = this;
            this.$http.get(this.$server_url + 'GetCuentasAll')
                .then(function(res) {
                    me.cuentas = res.data;
                })
                .catch(function() {
                    me.cuentas = [];
                });
        },
        agregarDocumentoAConcepto() {
            if (this.tabCobroCheque.documento) {
                this.tabCobroCheque.concepto = 'CLIENTE: ' + (this.datosCliente && this.datosCliente[0] && this.datosCliente[0].razonsocial ? this.datosCliente[0].razonsocial : '') + ' DOCUMENTO: ' + this.tabCobroCheque.documento;
            }
        },
        guardarCobroCheque() {
            let me = this;
            let cliente = me.getClienteBusqueda();
            let empresa = me.getEmpresaBusqueda();
            let periodo = me.periodoSelect && me.periodoSelect.idperiodoescolar ? me.periodoSelect.idperiodoescolar : '';
            let usuario = JSON.parse(localStorage.getItem('usuario'));

            if (!me.tabCobroCheque.cuenta) {
                me.$vs.notify({ text: 'Seleccione la cuenta destino del abono cheque', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (me.tabCobroCheque.notasOfactura === '') {
                me.$vs.notify({ text: 'Seleccione el destino del abono cheque', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (!me.tabCobroCheque.documento) {
                me.$vs.notify({ text: 'Ingrese el numero de documento del abono cheque', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (!me.tabCobroCheque.concepto || !me.tabCobroCheque.concepto.trim()) {
                me.$vs.notify({ text: 'Ingrese el concepto del abono cheque', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (Number(me.totalDistribuidoCobroChequeNuevo) !== Number(me.tabCobroCheque.valor)) {
                me.$vs.notify({ text: 'La suma distribuida debe coincidir con el valor del cheque', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }

            let formData = new FormData();
            formData.append('notasOfactura', me.tabCobroCheque.notasOfactura);
            formData.append('abono_fecha', me.tabCobroCheque.fechaCobro);
            formData.append('abono_tipo', 2);
            formData.append('abono_cuenta', me.tabCobroCheque.cuenta);
            formData.append('abono_documento', me.tabCobroCheque.documento);
            formData.append('abono_valor', me.tabCobroCheque.valor);
            formData.append('abono_cheque_numero', me.tabCobroCheque.numeroCheque);
            formData.append('abono_cheque_cuenta', me.tabCobroCheque.numeroCuenta);
            formData.append('abono_empresa', empresa);
            formData.append('abono_concepto', me.tabCobroCheque.concepto);
            formData.append('periodo', periodo);
            formData.append('user_created', usuario && usuario.idusuario ? usuario.idusuario : 0);
            formData.append('idClientePerseo', me.datosCliente && me.datosCliente[0] && me.datosCliente[0].clientesid ? me.datosCliente[0].clientesid : 0);
            formData.append('clienteCodigoPerseo', me.datosCliente && me.datosCliente[0] && me.datosCliente[0].clientescodigo ? me.datosCliente[0].clientescodigo : 0);
            formData.append('abono_cheque_banco', me.tabCobroCheque.banco);
            formData.append('abono_ruc_cliente', cliente);
            formData.append('estado', 1);
            formData.append('abono_ventas', JSON.stringify(me.documentosCobroChequeNuevo.map(item => ({
                ven_codigo: item.ven_codigo,
                ven_valor: item.ven_valor,
                ven_valor_abono: item.ven_valor_abono,
                abono_manual: item.abono_manual ? Number(item.abono_manual) : 0,
                saldo_disponible: item.saldo_disponible,
            }))));

            me.$vs.loading();
            this.$http.post(this.$server_url + 'cobro_cheque_registro_nuevo', formData)
                .then(function(res) {
                    me.$vs.loading.close();
                    if (res.data && res.data.status == 1) {
                        me.popupCobroCheque = false;
                        me.$vs.notify({ text: 'Se guardo correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' });
                        me.cargarCheques();
                        me.$emit('totalesActualizados');
                    } else {
                        me.$vs.notify({ text: res.data && res.data.message ? res.data.message : 'No se pudo registrar el cobro del cheque', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
                    }
                })
                .catch(function(error) {
                    me.$vs.loading.close();
                    me.$vs.notify({ text: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Error al cobrar cheque', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
                });
        },
        cambioEstadoCheque(chequeId, estado) {
            let me = this;
            let datos = {
                cheque_id: chequeId,
                estado: estado,
            };

            me.$vs.loading();
            this.$http.post(this.$server_url + 'estado_cheque', datos)
                .then(function(res) {
                    me.$vs.loading.close();
                    if (res.data && res.data.status == 1) {
                        me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
                        me.cargarCheques();
                        me.$emit('totalesActualizados');
                    } else {
                        me.$vs.notify({ text: res.data && res.data.message ? res.data.message : 'No se pudo actualizar el cheque', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                    }
                })
                .catch(function(error) {
                    me.$vs.loading.close();
                    me.$vs.notify({ text: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Error al actualizar el cheque', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
                });
        }
    }
}
</script>

<style scoped>
.acciones-cheque {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.cheques-nuevo-wrap :deep(.con-vs-table .vs-table--header) {
    padding-top: 8px;
    padding-bottom: 8px;
}

.cheques-nuevo-wrap :deep(.con-vs-table) {
    font-size: 12px;
}

.cheques-nuevo-wrap :deep(.con-vs-table .vs-table--thead th) {
    font-size: 10px;
    padding: 8px 10px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #2c3e50;
    font-weight: 700;
    background: #f8fafc;
    border-bottom: 1px solid #dde3ec;
}

.cheques-nuevo-wrap :deep(.con-vs-table .vs-table--tbody td) {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    color: #2c3e50;
}

.cheques-nuevo-wrap :deep(.con-vs-table .vs-table--tbody tr:hover) {
    background: #f8fafc;
}

.cheque-distribucion-row-disabled {
    opacity: 0.6;
    background: #f8fafc;
}

.cheque-distribucion-head {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    background: #f8fafc;
    padding: 7px 10px;
    border-radius: 6px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    align-items: center;
    border: 1px solid #dde3ec;
}

.cheque-distribucion-row {
    font-size: 12px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
}

.cheque-distribucion-row:last-child {
    border-bottom: none;
}

.cheque-distribucion-body {
    border: 1px solid #dde3ec;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
}

.cheque-distribucion-footer {
    padding: 12px;
    background: #f8fafc;
    border-top: 1px solid #dde3ec;
    border-radius: 0 0 6px 6px;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 12px;
}

.cheques-nuevo-wrap :deep(.vs-button) {
    min-height: 32px;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-transform: uppercase;
}


.cheques-nuevo-wrap :deep(.vs-popup--content) {
    padding: 16px 18px;
}

.popup-cobranza-estandar :deep(.con-vs-popup) {
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.popup-cobranza-estandar :deep(.vs-popup--content) {
    padding: 14px 16px;
}

.popup-cobranza-estandar :deep(.vs-button) {
    min-height: 32px !important;
    padding: 0.4rem 0.9rem !important;
    border-radius: 6px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: 0.2px !important;
    text-transform: uppercase;
}

.popup-cobranza-estandar :deep(.vs-table) {
    font-size: 12px;
}

.popup-cobranza-estandar :deep(.vs-table thead th) {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #2c3e50;
    font-weight: 700;
    background: #f8fafc;
    padding: 8px 10px;
    border-bottom: 1px solid #dde3ec;
}

.popup-cobranza-estandar :deep(.vs-table tbody td) {
    padding: 8px 10px;
    vertical-align: middle;
    border-bottom: 1px solid #f1f5f9;
}

.cheque-input-mini {
    min-height: 32px;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 12px;
}
</style>
