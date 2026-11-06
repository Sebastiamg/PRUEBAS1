<template>
<div class="abonos-nuevo-container p-3">
    <div v-if="menu != 0" class="mb-4">
        <vs-button color="primary" type="border" icon-pack="feather" icon="icon-arrow-left" @click="menu = 0;">Volver a la lista</vs-button>
    </div>

    <!-- MAIN LIST -->
    <div v-if="menu == 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5">
        <h2 class="text-lg font-bold mb-4 text-gray-800">Historial de Abonos (Notas)</h2>
        
        <vs-table max-items="10" search pagination :data="arregloAbonoNotas" class="custom-table-nuevo">
            <template slot="thead">
                <vs-th>Detalles del Abono</vs-th>
                <vs-th>Monto</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <div class="flex flex-col gap-1">
                            <span class="text-gray-900 font-semibold">{{ tr.abono_fecha }}</span>
                            <span class="text-xs text-gray-500 uppercase tracking-wide">
                                {{ tr.abono_tipo == 0 ? 'Deposito': tr.abono_tipo == 1 ? 'Transferencia': tr.abono_tipo == 2 ? 'Cheque': 'Retencion' }} 
                                <strong v-if="tr.abono_documento" class="text-gray-700">#{{ tr.abono_documento }}</strong>
                            </span>
                            <span class="text-xs text-gray-500 uppercase tracking-wide">
                                CUENTA: <strong v-if="tr.abono_documento" class="text-gray-700">{{ tr.cue_pag_nombre }}  </strong>                              
                            </span>
                            <span class="text-xs text-gray-400 mt-1">👤 Creado por: {{ tr.usuario_creador }}</span>
                        </div>
                    </vs-td>
                    
                    <vs-td>
                        <span class="text-lg font-bold text-emerald-600">${{ Number(tr.abono_notas).toFixed(2) }}</span>
                    </vs-td>

                    <vs-td>
                        <vs-chip v-if="tr.abono_estado == 1" color="danger" transparent>Anulado</vs-chip>
                        <vs-chip v-else color="success" transparent>Activo</vs-chip>
                    </vs-td>

                    <vs-td align="center">
                        <div v-if="tr.abono_estado != 1" class="flex gap-2 justify-center">
                            <vs-button v-if="tr.estadoPerseo == 0 && (userRoot || AdminFacturador)" 
                                color="primary" type="border" icon-pack="feather" icon="icon-edit-2" size="small"
                                @click="irEditar(tr);" title="Modificar este abono">Editar</vs-button>
                            
                            <vs-button v-if="tr.estadoPerseo == 0 && (userRoot || AdminFacturador)" 
                                color="danger" type="border" icon-pack="feather" icon="icon-trash-2" size="small"
                                @click="abono_id='';AnularAbono(tr);" title="Anular este abono">Anular</vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>

    <!-- EDIT FORM -->
    <div v-if="menu == 1" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5 max-w-4xl mx-auto">
        <h3 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Editar Abono</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Fecha Abono</label>
                <flat-pickr :config="configdateTimePicker" v-model="datosEditar.abono_fecha" placeholder="Fecha de Abono" class="w-full border rounded p-2 text-gray-700 focus:outline-none focus:border-primary" :disabled="esChequeEnEdicion" />
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Destino</label>
                <div class="flex items-center gap-4 mt-2">
                    <vs-radio v-model="datosEditar.notasOfactura" vs-name="radiosNotas" vs-value="1">Notas</vs-radio>
                    <vs-radio v-model="datosEditar.notasOfactura" vs-name="radiosNotas" vs-value="0" disabled>Facturas</vs-radio>
                </div>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Valor Abono</label>
                <vs-input v-model="datosEditar.abono_notas" type="number" class="w-full" :disabled="esChequeEnEdicion" />
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Tipo de Abono</label>
                <v-select :options="tipoOpciones" :reduce="tipoOpciones => tipoOpciones.value" label="label" placeholder="--Seleccione--" v-model="datosEditar.abono_tipo" class="w-full" :disabled="esChequeEnEdicion" />
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Cuenta destino</label>
                <v-select :options="Cuentas" :reduce="Cuentas => Cuentas.cue_pag_codigo" label="cue_pag_nombre" placeholder="--Seleccione--" v-model="datosEditar.abono_cuenta" class="w-full" />
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Documento / Comprobante</label>
                <vs-input v-model="datosEditar.abono_documento" class="w-full" />
            </div>

            <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-600 mb-2">Concepto / Observación</label>
                <vs-textarea v-model="datosEditar.abono_concepto" class="w-full" />
            </div>

            <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-600 mb-2">Distribución por documento</label>
                <div class="abono-edit-distribucion-head">
                    <span class="font-semibold">Total distribuido: ${{ Number(totalDistribuidoEditarAbono).toFixed(2) }}</span>
                    <span class="font-semibold">Valor abono: ${{ Number(datosEditar.abono_notas ? datosEditar.abono_notas : 0).toFixed(2) }}</span>
                </div>
                <div v-if="esChequeEnEdicion" class="abono-edit-nota-cheque">
                    En cheques solo puedes ajustar la distribución por documento. La fecha, el valor y el tipo permanecen fijos.
                </div>
                <div v-if="documentosAbonoEditarNuevo.length > 0" class="abono-edit-distribucion-body">
                    <div v-for="(doc, indexDoc) in documentosAbonoEditarNuevo" :key="doc.ven_codigo || indexDoc" class="abono-edit-distribucion-row" :class="{ 'abono-edit-distribucion-row-disabled': Number(doc.saldo_disponible) <= 0 }">
                        <span>{{ doc.ven_codigo }}</span>
                        <span>$ {{ Number(doc.saldo_disponible).toFixed(2) }}</span>
                        <vs-input type="number" class="abono-edit-input-mini" v-model="doc.abono_manual" min="0" :max="doc.saldo_disponible" :disabled="Number(doc.saldo_disponible) <= 0" @input="validarDistribucionEditar(indexDoc)" />
                    </div>
                </div>
                <div v-else class="abono-edit-empty">No hay documentos disponibles para distribución.</div>
            </div>
        </div>

        <div class="mt-6 flex justify-end gap-2 border-t pt-3">
            <vs-button color="danger" type="border" @click="menu = 0">Cancelar</vs-button>
            <vs-button color="success" type="filled" @click="guardarCambios">Guardar Cambios</vs-button>
        </div>
    </div>
    <div v-if="menu == 2">

    </div>
    <vs-popup v-if="promptVisible" title="Abonos Eliminación" :active.sync="promptVisible" class="popophijo">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;">
                <b style="font-size: 15px">Confirmar Eliminación De Abono</b>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    ¿Estás seguro que deseas eliminar el abono con ID {{ abono_id.abono_id }}?
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="eliminarAbono(abono_id)" color="danger" type="relief">Aceptar</vs-button>
                    <vs-button @click="cancelarEliminarAbono()" color="success" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-col>
        </vs-row>
    </vs-popup>
    <vs-popup v-if="Anularpopup" title="Abonos Anulacion" :active.sync="Anularpopup" class="popophijo">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;">
                <b style="font-size: 15px">Confirmar La Anulación del abono</b>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    ¿Estás seguro que deseas anular el abono N°{{ abono_id.abono_id }}?
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="Anular(abono_id)" color="danger" type="relief" class="mr-4">Aceptar</vs-button>
                    <vs-button @click="Anularpopup=false" color="success" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-col>
        </vs-row>
    </vs-popup>
</div>
</template>

    
<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component';

export default {
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    data() {
        return {
            menu: 0,
            promptVisible: false,
            Anularpopup: false,
            ObjectSelected: '',
            usuario: [],
            Cuentas: [],
            datosEditar: {
                abono_id: '',
                abono_fecha: '',
                abono_notas: '',
                abono_tipo: '',
                abono_documento: '',
                abono_concepto: '',
                abono_cuenta: '',
                notasOfactura:'',
            },
            documentosAbonoEditarNuevo: [],
            tipoOpciones: [{
                    label: 'Depósito',
                    value: 0
                },
                {
                    label: 'Transferencia',
                    value: 1
                },
                {
                    label: 'Cheque',
                    value: 2
                },
            ],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            arregloAbonoNotas: [],
            datoperiodo: 0,
            datoempresa: 0,
            datocliente: '',
            abono_id: '',

        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        periodo: {
            type: Number,
            default: 0,
        },
        empresa: {
            type: Number,
            default: 0,
        },
        cliente: {
            type: [String, Number],
            default: 0,
        },
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'AdminFacturador']),
        totalDistribuidoEditarAbono() {
            let total = 0;
            for (let i = 0; i < this.documentosAbonoEditarNuevo.length; i++) {
                total += this.documentosAbonoEditarNuevo[i].abono_manual ? Number(this.documentosAbonoEditarNuevo[i].abono_manual) : 0;
            }
            return Number(total.toFixed(2));
        },
        esChequeEnEdicion() {
            return Number(this.datosEditar.abono_tipo) === 2;
        },
        abonoVentasEditarJson() {
            return this.documentosAbonoEditarNuevo.map(item => {
                return {
                    ven_codigo: item.ven_codigo,
                    abono_manual: item.abono_manual ? Number(item.abono_manual) : 0,
                    saldo_disponible: item.saldo_disponible ? Number(item.saldo_disponible) : 0,
                    ven_valor: item.ven_valor ? Number(item.ven_valor) : 0,
                    ven_valor_abono: item.ven_valor_abono ? Number(item.ven_valor_abono) : 0,
                };
            });
        },
    },
    mounted() {
        let me = this;
        me.datoperiodo = me.periodo;
        me.datoempresa = me.empresa;
        me.datocliente = me.cliente;
        me.obtenerAbonosFacturas('notas')
        me.GetCuentasAll();

    },
    methods: {
        GetCuentasAll() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'GetCuentasAll')
                .then(res => {
                    me.Cuentas = res.data.filter(cuentas => cuentas.cue_pag_estado != 1)
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        obtenerMapaDistribucionAnterior(abonoVentasRaw) {
            let mapa = {};
            if (!abonoVentasRaw) {
                return mapa;
            }

            let distribucion = [];
            if (typeof abonoVentasRaw === 'string') {
                try {
                    distribucion = JSON.parse(abonoVentasRaw);
                } catch (e) {
                    distribucion = [];
                }
            } else if (Array.isArray(abonoVentasRaw)) {
                distribucion = abonoVentasRaw;
            }

            if (!Array.isArray(distribucion)) {
                return mapa;
            }

            for (let i = 0; i < distribucion.length; i++) {
                let item = distribucion[i];
                let codigo = item && item.ven_codigo ? String(item.ven_codigo) : '';
                let valor = item && item.abono_manual ? Number(item.abono_manual) : 0;
                if (codigo && valor > 0) {
                    if (!mapa[codigo]) {
                        mapa[codigo] = 0;
                    }
                    mapa[codigo] += valor;
                }
            }

            return mapa;
        },
        cargarDocumentosParaEditar(tr) {
            let me = this;
            me.documentosAbonoEditarNuevo = [];
            let mapaAnterior = me.obtenerMapaDistribucionAnterior(tr.abono_ventas);
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_facturasNotasxParametro?periodo=' + me.datoperiodo + '&empresa=' + me.datoempresa + '&cliente=' + me.datocliente + '&reporte=0')
                .then(res => {
                    let docs = Array.isArray(res.data)
                        ? res.data.filter(doc => Number(doc.idtipodoc) === 3 || Number(doc.idtipodoc) === 4)
                        : [];
                    let codigosCargados = {};
                    me.documentosAbonoEditarNuevo = docs.map(doc => {
                        let codigo = doc && doc.ven_codigo ? String(doc.ven_codigo) : '';
                        let valor = doc && doc.ven_valor ? Number(doc.ven_valor) : 0;
                        let abonado = doc && doc.ven_valor_abono ? Number(doc.ven_valor_abono) : 0;
                        let asignadoAnterior = mapaAnterior[codigo] ? Number(mapaAnterior[codigo]) : 0;
                        let saldo = valor - abonado + asignadoAnterior;
                        if (saldo < 0) {
                            saldo = 0;
                        }
                        if (asignadoAnterior > saldo) {
                            asignadoAnterior = saldo;
                        }
                        codigosCargados[codigo] = true;
                        return {
                            ven_codigo: codigo,
                            ven_valor: valor,
                            ven_valor_abono: abonado,
                            saldo_disponible: Number(saldo.toFixed(2)),
                            abono_manual: Number(asignadoAnterior.toFixed(2)),
                        };
                    });

                    let codigosAnteriores = Object.keys(mapaAnterior);
                    for (let i = 0; i < codigosAnteriores.length; i++) {
                        let codigoAnterior = codigosAnteriores[i];
                        if (!codigosCargados[codigoAnterior]) {
                            let valorAnterior = Number(mapaAnterior[codigoAnterior]);
                            me.documentosAbonoEditarNuevo.push({
                                ven_codigo: codigoAnterior,
                                ven_valor: valorAnterior,
                                ven_valor_abono: 0,
                                saldo_disponible: Number(valorAnterior.toFixed(2)),
                                abono_manual: Number(valorAnterior.toFixed(2)),
                            });
                        }
                    }

                    this.$vs.loading.close();
                })
                .catch(() => {
                    this.$vs.loading.close();
                    me.$vs.notify({
                        text: 'No se pudieron cargar los documentos para la distribución.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                });
        },
        validarDistribucionEditar(indexDoc) {
            let item = this.documentosAbonoEditarNuevo[indexDoc];
            if (!item) {
                return;
            }
            let ingreso = item.abono_manual ? Number(item.abono_manual) : 0;
            let saldoDisponible = Number(item.saldo_disponible);
            if (ingreso < 0) {
                item.abono_manual = 0;
                return;
            }
            if (ingreso > saldoDisponible) {
                item.abono_manual = Number(saldoDisponible.toFixed(2));
            }
        },
        guardarCambios() {
            let me = this;

            if (!me.datosEditar.abono_notas || Number(me.datosEditar.abono_notas) <= 0) {
                me.$vs.notify({
                    text: 'El valor del abono debe ser mayor a 0.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            if (me.documentosAbonoEditarNuevo.length == 0) {
                me.$vs.notify({
                    text: 'No hay documentos para distribuir este abono.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            if (Number(me.totalDistribuidoEditarAbono) !== Number(me.datosEditar.abono_notas)) {
                me.$vs.notify({
                    text: 'La suma distribuida debe coincidir con el valor del abono.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            this.$vs.loading();

            let formData = new FormData();
            formData.append("abono_id", me.datosEditar.abono_id);
            formData.append("abono_fecha", me.datosEditar.abono_fecha);
            formData.append("abono_notas", me.datosEditar.abono_notas);
            formData.append("notasOfactura", me.datosEditar.notasOfactura);
            formData.append("abono_tipo", me.datosEditar.abono_tipo);
            formData.append("abono_documento", me.datosEditar.abono_documento);
            formData.append("abono_concepto", me.datosEditar.abono_concepto);
            formData.append("abono_cuenta", me.datosEditar.abono_cuenta);
            formData.append("abono_ventas", JSON.stringify(me.abonoVentasEditarJson));
            formData.append("abono_empresa", me.datoempresa);
            formData.append("periodo", me.datoperiodo);
            formData.append("abono_ruc_cliente", me.datocliente);
            formData.append('user_created', me.usuario.idusuario);
            this.$http.post(this.$server_url + 'modificarAbonoNotas', formData)
                .then(res => {
                    me.$vs.loading.close(); // Cierra el loading
                    if (res.data.status === 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    } else if (res.data.status === 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.menu = 0;
                        me.obtenerAbonosFacturas('notas')
                        me.$emit('actualizarTodo', true);
                    }
                })
                .catch(error => {
                    // me.$vs.loading.close(); // Cierra el loading en caso de error
                    // me.$vs.notify({
                    //     text: 'Error al guardar',
                    //     color: 'warning',
                    //     iconPack: 'feather',
                    //     icon: 'icon-alert-triangle'
                    // });
                });
        },
        irEditar(tr) {
            let me = this;
            me.datosEditar.abono_id = tr.abono_id;
            me.datosEditar.abono_fecha = tr.abono_fecha;
            me.datosEditar.abono_notas = tr.abono_notas;
            me.datosEditar.abono_tipo = tr.abono_tipo;
            me.datosEditar.abono_documento = tr.abono_documento;
            me.datosEditar.abono_cuenta = tr.abono_cuenta * 1;
            me.datosEditar.abono_concepto = tr.abono_concepto;
            me.datosEditar.notasOfactura = 1;
            me.cargarDocumentosParaEditar(tr);
            me.menu = 1
        },
        AnularAbono(tr) {
            let me = this;
            me.abono_id = tr;
            me.Anularpopup = true;
        },
        Anular(abono) {
            let me = this;
            this.$http.post(this.$server_url + 'anularAbono?', {
                    abono_id: abono.abono_id,
                    usuario: this.usuario.idusuario
                })
                .then(res => {
                    if (res.data.message) {
                        this.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    } else {
                        this.$vs.notify({
                            text: 'Abono anulado correctamente',
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    }
                    me.obtenerAbonosFacturas('facturas')
                    me.menu = 0;
                    me.Anularpopup = false;

                })
                .catch(error => {
                    this.$vs.notify({
                        text: 'Error al anular el abono',
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                });

        },
        obtenerAbonosFacturas(documento) {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerAbonos?periodo=' + me.datoperiodo + '&empresa=' + me.datoempresa + '&cliente=' + me.datocliente)
                .then(res => {
                    let datos = res.data;
                    me.arregloAbonoNotas = datos.abonos_con_notas
                        .map(abono => ({
                            ...abono,
                            created_at: new Date(abono.created_at).toLocaleString(),
                            updated_at: new Date(abono.updated_at).toLocaleString()
                        }))
                        .filter(abono => abono.abono_tipo !== 4);
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
    }
}
</script>

    
<style scoped>
.popophijo {
    z-index: 51003;
    position: fixed;
}

.abonos-nuevo-container {
    min-height: auto;
}

.custom-table-nuevo {
    width: 100%;
}

.custom-table-nuevo thead th {
    background: #f8fafc;
    color: #2c3e50;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10px;
    padding: 8px 10px;
    border-bottom: 1px solid #dde3ec;
    letter-spacing: 0.3px;
}

.custom-table-nuevo tbody td {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    color: #2c3e50;
}

.custom-table-nuevo tbody tr:hover {
    background: #f8fafc;
}

.abono-edit-distribucion-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border: 1px solid #dde3ec;
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 11px;
}

.abono-edit-distribucion-body {
    border: 1px solid #dde3ec;
    border-radius: 6px;
    max-height: 280px;
    overflow-y: auto;
}

.abono-edit-distribucion-row {
    display: grid;
    grid-template-columns: 1fr 1fr 140px;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 12px;
}

.abono-edit-distribucion-row:last-child {
    border-bottom: none;
}

.abono-edit-distribucion-row-disabled {
    opacity: 0.6;
    background: #f8fafc;
}

.abono-edit-input-mini {
    width: 100%;
    min-height: 32px;
    font-size: 12px;
}

.abono-edit-nota-cheque {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: 6px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 600;
    border-left: 4px solid #046AE7;
}

.abono-edit-empty {
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
    padding: 12px;
    color: #64748b;
    font-size: 12px;
    text-align: center;
    background: #f8fafc;
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

.popup-cobranza-estandar :deep(.vs-input),
.popup-cobranza-estandar :deep(.vs-textarea) {
    height: 32px !important;
    padding: 6px 10px !important;
    border: 1px solid #dde3ec !important;
    border-radius: 6px !important;
    font-size: 12px !important;
}

.popup-cobranza-estandar :deep(.vs-input:focus),
.popup-cobranza-estandar :deep(.vs-textarea:focus) {
    border-color: #046AE7 !important;
    box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.1);
}

.popup-cobranza-estandar :deep(.v-select .vs__control) {
    min-height: 32px !important;
    border: 1px solid #dde3ec !important;
    border-radius: 6px !important;
    font-size: 12px;
}

.popup-cobranza-estandar :deep(.v-select .vs__control:focus) {
    border-color: #046AE7 !important;
    box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.1);
}

.popup-cobranza-estandar :deep(label) {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
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

.popup-cobranza-estandar :deep(.con-vs-popup) {
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.popup-cobranza-estandar :deep(.vs-popup--content) {
    padding: 14px 16px;
}
</style>
