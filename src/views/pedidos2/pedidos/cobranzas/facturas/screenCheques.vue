<template>
<div>
    <div>
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-table stripe search max-items="10" pagination :data="Cheques" no-data-text="No hay datos disponibles">
                    <template slot="header">
                        <vs-chip color="primary" class="mr-2">Cantidad {{ Cheques.length >0? Cheques.length : '0' }}</vs-chip>
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
                            <vs-td>$ {{ tr.chq_valor| filtrarDecimal  }}</vs-td>
                            <vs-td>
                                <div><b>Tipo: {{ tr.chq_tipo === 0 ? 'Garantia': tr.chq_tipo === 1 ? 'Posfechado' : 'N/A'}}</b></div>
                                <div><b>Cuenta Cheque: {{ tr.chq_cuenta }}</b></div>
                                <div v-if="tr.chq_tipo === 1"><b style=" color: red;">Fecha cobro del cheque: {{tr.chq_fecha_cobro}}</b></div>
                                <div><b>Fecha Creacion:</b> {{ tr.created_at }}</div>
                                <div><b>{{ tr.chq_nombrebanco }}</b></div>
                                <div><b>Referencia: {{ tr.chq_referenca }}</b></div>
                            </vs-td>
                            <vs-td>
                                <vs-chip v-if="tr.chq_estado  == 0" color="warning">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-inbox" />
                                    <span>Pendiente</span>
                                </vs-chip>
                                <vs-chip v-if="tr.chq_estado  == 1" color="success">
                                    <vs-avatar color="success" icon-pack="feather" icon="icon-user-check" />
                                    <span>Cobrado</span>
                                </vs-chip>
                                <vs-chip v-if="tr.chq_estado  == 2" color="danger">
                                    <vs-avatar color="danger" icon-pack="feather" icon="icon-minus-square" />
                                    <span>Devuelto</span>
                                </vs-chip>
                                <vs-chip v-if="tr.chq_estado  == 3" color="primary">
                                    <vs-avatar color="primary" icon-pack="feather" icon="icon-info" />
                                    <span>Protestado</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td>
                                <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                    <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                    <vs-dropdown-menu style="width: 250px;" class="cursor">
                                        <vs-dropdown-item>
                                            <vs-button v-if="tr.chq_estado!==2 && tr.chq_estado !== 1" @click="ChequeTR=tr;CobrarCheque()" color="success" type="line" class="w-full">Cobrar</vs-button>
                                            <!-- <vs-button v-if="tr.chq_estado  !== 2" @click="ChequeTR=tr;CobrarCheque()" color="success" type="line" class="w-full">Cobrar</vs-button> -->
                                            <!-- <vs-button v-if="tr.chq_tipo === 1 && tr.chq_estado  === 1" @click="cambioEstadoCheque(tr.chq_id, 3)" color="danger" type="line" class="w-full">Protestar Cheque</vs-button> -->
                                            <vs-button v-if="(tr.chq_tipo==1 || tr.chq_tipo==0)&& tr.chq_estado!==3 && tr.chq_estado!==2 && tr.chq_estado !== 1 " @click="cambioEstadoCheque(tr.chq_id, 3)" color="primary" type="line" class="w-full">Protestar Cheque</vs-button>
                                            <vs-button v-if="(tr.chq_tipo==1 || tr.chq_tipo==0) && tr.chq_estado!==2 && tr.chq_estado == 0 && tr.chq_estado !== 1" @click="cambioEstadoCheque(tr.chq_id, 2)" color="danger" type="line" class="w-full">Devolver Cheque</vs-button>
                                            <vs-button v-if="(tr.chq_tipo==1 || tr.chq_tipo==0) && (tr.chq_estado==2 || tr.chq_estado==3 && tr.chq_estado !== 1)" @click="cambioEstadoCheque(tr.chq_id, 0)" color="#59287a" type="line" class="w-full">Poner Pendiente</vs-button>
                                            <vs-button v-if="usuario.id_group=1" @click="eliminarCheque(tr.chq_id)" color="danger" type="line" class="w-full">Eliminar</vs-button>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
    </div>
    <vs-popup v-if="cobrarVisible" title="Abono Cheque" :active.sync="cobrarVisible">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b style="font-size: 15px">Cobro Cheque N° {{ ChequeTR.chq_numero }}</b></vs-col>
        </vs-row>
        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Temporada:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabCobroCheque.temporada" placeholder="Numero Documento" disabled />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>N° Cuenta:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabCobroCheque.numeroCuenta" placeholder="Numero Documento" disabled />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>N° Cheque:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabCobroCheque.numeroCheque" placeholder="Numero Documento" disabled />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Valor Cheque:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabCobroCheque.valor" placeholder="Numero Documento" disabled />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Fecha de cobro:</div>
                        <flat-pickr :config="configdateTimePicker" v-model="tabCobroCheque.fechaCobro" placeholder="Fecha de cobro" style="display: inline-block;width: 100%" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">En la Cuenta:</font><br>
                        <v-select :options="Cuentas" :reduce="Cuentas => Cuentas.cue_pag_codigo" label="cue_pag_nombre" class="w-full h-100" placeholder="--Seleccione Cuenta--" v-model="tabCobroCheque.cuenta" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div class="mb-2">Destino:</div>
                            <!-- <vs-radio v-model="tabCobroCheque.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1" :disabled="totalNotas == 0" @change="resetearValor">Notas</vs-radio> -->
                            <!-- <vs-radio v-model="tabCobroCheque.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="0" :disabled="totalFacturas == 0">Facturas</vs-radio>
                                <vs-radio v-model="tabCobroCheque.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1" :disabled="totalNotas == 0">Notas</vs-radio> -->
                            <vs-radio v-model="tabCobroCheque.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="0">Facturas</vs-radio>
                            <vs-radio v-model="tabCobroCheque.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1">Notas</vs-radio>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>Documento Abono #:</div>
                            <vs-input type="text" class="inputx w-full mb-6" :disabled="!tabCobroCheque.notasOfactura" v-model="tabCobroCheque.documento" placeholder="Numero Documento" @click.native="seleccionTipo" @blur="agregarValorAlTextarea" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>Concepto del Abono:</div>
                            <!-- <vs-input type="text" class="inputx w-full mb-6" v-model="tabAbono.valor" placeholder="Valor" :disabled="!tabAbono.notasOfactura" @click.native="seleccionTipo" @keypress="validateInput" @paste="validatePaste" min="0" :max="tabAbono.notasOfactura == 0 ? (totalNotas - abonoNotas): (totalFacturas - abonoFacturas)" @input="validateQuantity()" /> -->
                            <div @mousedown="seleccionTipo2">
                                <vs-textarea class="inputx w-full mb-6" v-model="tabCobroCheque.concepto" placeholder="concepto" :readonly="!tabCobroCheque.documento" />
                            </div>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="m-3">
                <vs-button @click="guardarCobroCheque()" color="success" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="cobrarVisible=false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-row>
    </vs-popup>
    <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar cheque: ${chequeid}?`" :active.sync="popupActivoEliminar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
</div>
</template>

    
<script>
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component';

export default {
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    data() {
        return {
            ChequeTR: [],
            cobrarVisible: false,
            camporequerido: false,
            tabCobroCheque: {
                cuenta: '',
                temporada: '',
                numeroCuenta: '',
                numeroCheque: '',
                valor: '',
                fechaCobro: '',
                notasOfactura: '',
                documento: '',
                banco: '',
                concepto: '',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            Cuentas: [],
            empresa: '',
            nombreClienteCheque: '',
            chequeid: 0,
            popupActivoEliminar: false,
        };
    },
    props: {
        Cheques: {
            type: Array,
            default: []
        },
        permisosCheque: {
            type: Boolean,
            default: false
        },
        totalNotas: {
            type: Number,
            default: 0
        },
        totalFacturas: {
            type: Number,
            default: 0
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
        periodoPuntosOInstitucion: {
            type: Number,
            default: 0,
        },
        // institucionPuntosOInstitucion: {
        //     type: Number,
        //     default: 0,
        // },
        empresaCobranza: {
            type: [Object, Array],
            default: () => ({}),
        },
        datosCliente: {
            type: Array,
            default: [],
        },
        nombreCliente: {
            type: String,
            default: '',
        },
    },
    mounted() {
        let me = this;
        me.empresa = me.empresaCobranza;
        me.nombreClienteCheque = me.nombreCliente;
    },
    computed: {

    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    methods: {
        getEliminar() {
            let me = this;
            let datos = {
                "chequeid": this.chequeid,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "cheque_eliminar", datos)
                .then(res => {
                    me.$emit('chequeCobrado')
                    me.$vs.notify({
                        text: 'Se elimino la asignación correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEliminar = false;
                    me.$vs.loading.close()
                })
                .catch(error => {
                    console.log(error);
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'No se pudo eliminar la asignación',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        eliminarCheque(tr) {
            this.popupActivoEliminar = true
            this.chequeid = tr;
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        agregarValorAlTextarea() {
            if (this.tabCobroCheque.concepto) {
                this.tabCobroCheque.concepto += ' ' + this.tabCobroCheque.documento;
            } else {
                this.tabCobroCheque.concepto = this.tabCobroCheque.documento;
            }
        },
        seleccionTipo2() {
            let me = this;
            if (!this.tabCobroCheque.documento) {
                me.$vs.notify({
                    text: 'No a ingresado el documento de Cobro de cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.camporequerido = true;
                return;
            } else {
                me.camporequerido = false;
            }
        },
        seleccionTipo() {
            let me = this;
            if (!this.tabCobroCheque.notasOfactura) {
                me.$vs.notify({
                    text: 'No a selecionado el destino de Cobro de cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.camporequerido = true;
                return;
            } else {
                me.camporequerido = false;
            }
        },
        GetCuentasAll() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'GetCuentasAll')
                .then(res => {
                    me.Cuentas = res.data
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        CobrarCheque() {
            let me = this;
            me.cobrarVisible = true;
            me.tabCobroCheque.temporada = me.periodoSelect.codigo_contrato; //guardar el idperiodoescolar enves del periodoescolar
            me.tabCobroCheque.numeroCuenta = me.ChequeTR.chq_cuenta;
            me.tabCobroCheque.numeroCheque = me.ChequeTR.chq_numero;
            me.tabCobroCheque.valor = me.ChequeTR.chq_valor;
            me.tabCobroCheque.banco = me.ChequeTR.ban_codigo;
            me.tabCobroCheque.fechaCobro = new Date().toISOString().substr(0, 10);
            me.tabCobroCheque.notasOfactura = '';
            me.tabCobroCheque.cuenta = '';
            me.tabCobroCheque.documento = '';
            me.tabCobroCheque.concepto = 'CLIENTE: ' + me.nombreClienteCheque + ' ' + 'DOCUMENTO: ';
            me.GetCuentasAll();
        },
        guardarCobroCheque() {
            let me = this;
            if (me.tabCobroCheque.fechaCobro < me.ChequeTR.chq_fecha_cobro) {
                me.$vs.notify({
                    text: 'La fecha de cobro no puede ser menor a la fecha de cobro del cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabCobroCheque.cuenta) {
                me.$vs.notify({
                    text: 'No a seleccionado la cuenta destino del abono cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabCobroCheque.notasOfactura) {
                me.$vs.notify({
                    text: 'No a seleccionado el destino del abono cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabCobroCheque.documento) {
                me.$vs.notify({
                    text: 'No a ingresado el numero de documento del abono cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabCobroCheque.concepto.trim()) {
                me.$vs.notify({
                    text: 'No ha ingresado el concepto del abono cheque.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append("notasOfactura", me.tabCobroCheque.notasOfactura);
            formData.append("abono_fecha", me.tabCobroCheque.fechaCobro);
            formData.append("abono_tipo", 2);
            formData.append("abono_cuenta", me.tabCobroCheque.cuenta);
            formData.append("abono_documento", me.tabCobroCheque.documento);
            formData.append("abono_valor", me.tabCobroCheque.valor);
            formData.append("abono_cheque_numero", me.tabCobroCheque.numeroCheque);
            formData.append("abono_cheque_cuenta", me.tabCobroCheque.numeroCuenta);
            formData.append("abono_empresa", me.empresa.id);
            formData.append("abono_concepto", me.tabCobroCheque.concepto);
            formData.append("periodo", me.periodoPuntosOInstitucion);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('idClientePerseo', me.datosCliente[0].clientesid);
            formData.append('clienteCodigoPerseo', me.datosCliente[0].clientescodigo);
            formData.append('abono_cheque_banco', me.tabCobroCheque.banco);
            formData.append('abono_ruc_cliente', me.datosCliente[0].identificacion);
            formData.append('estado', 1);
            const formDataJson = Object.fromEntries(formData);
            console.log(JSON.stringify(formDataJson, null, 2));
            this.$http.post(this.$server_url + 'cobro_cheque_registro', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: 'Se guardó correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.cobrarVisible = false
                        me.$emit('chequeCobrado')
                        me.$vs.loading.close();
                    }
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: error.response.data.message,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                });
        },
        cambioEstadoCheque(datoCheque, estado) {
            let me = this;

            let datos = {
                cheque_id: datoCheque,
                estado: estado,
            }
            // console.log('datos XD',datos);
            this.$http.post(this.$server_url + 'estado_cheque', datos)
                .then(res => {
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.cobrarVisible = false
                        me.$emit('chequeCobrado')
                        me.$vs.loading.close();
                    }

                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: error.response.data.message,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                });
        },
    }
};
</script>
