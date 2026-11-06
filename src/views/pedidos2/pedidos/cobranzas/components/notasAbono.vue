<template>
<div>
    <div v-if="menu != 0">
        <vs-button color="primary" type="filled" @click="menu = 0;">◄ Regresar</vs-button>
    </div>
    <div v-if="menu == 0">
        <vs-table max-items="10" stripe pagination :data="arregloAbonoNotas">
            <template slot="thead">
                <vs-th>Información Abono</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Fecha Abono:</b> {{ tr.abono_fecha }} <br>
                        <b>Valor Abono:</b> ${{ tr.abono_notas }} <br>
                        <b>Tipo:</b> {{ tr.abono_tipo == 0 ? 'Deposito': tr.abono_tipo == 1 ? 'Transferencia': tr.abono_tipo == 2 ? 'Cheque': ' Retencion' }} <br>
                        <b>Documento:</b> {{ tr.abono_documento }} <br>
                        <b>👤Creado por:</b> {{ tr.usuario_creador }} <br>
                        <b v-if="tr.usuario_actualizador">👤Actualizado por:</b> {{ tr.usuario_actualizador }} <br>
                    </vs-td>
                    <vs-td align="center">
                        <div v-if="tr.abono_estado == 1">
                            <div>
                                <vs-chip color="danger">Abono Anulado</vs-chip>
                            </div>
                        </div>
                        <div v-else style="display: flex; flex-wrap: wrap;">
                            <div class="m-1" v-if="tr.abono_tipo !== 2">
                                <vs-button v-if="tr.estadoPerseo == 0 && userRoot || AdminFacturador" color="success" type="relief" icon="edit" title="Editar" @click="irEditar(tr);">Editar</vs-button>
                            </div>
                            <div class="m-1" v-if="tr.abono_tipo !== 2">
                                <vs-button v-if="tr.estadoPerseo == 0 && userRoot || AdminFacturador" color="warning" type="relief" icon-pack="feather" icon="icon-x" title="Anular" @click="abono_id='';AnularAbono(tr);">Anular</vs-button>
                            </div>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <div v-if="menu == 1">
        <div>
            <vs-row vs-justify="center" vs-align="center">
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <h3 style="text-align: center;">Editar Abono</h3>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.5px">Fecha Abono</font><br>
                                <flat-pickr :config="configdateTimePicker" v-model="datosEditar.abono_fecha" placeholder="Fecha de Abono" style="display: inline-block;width: 100%" class="mb-6" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.5px">Destino:</font><br>
                                <vs-radio v-model="datosEditar.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1">Notas</vs-radio>
                                <vs-radio v-model="datosEditar.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="0">Facturas</vs-radio>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input v-model="datosEditar.abono_notas" label="Valor Abono" type="number" class="w-full " />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.5px">Tipo</font><br>
                                <v-select :options="tipoOpciones" :reduce="tipoOpciones => tipoOpciones.value" label="label" class="w-full h-100 mb-6" placeholder="--Seleccione--" v-model="datosEditar.abono_tipo" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.5px">Cuenta:</font><br>
                                <v-select :options="Cuentas" :reduce="Cuentas => Cuentas.cue_pag_codigo" label="cue_pag_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="datosEditar.abono_cuenta" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input v-model="datosEditar.abono_documento" label="Documento" class="w-full mb-6" />
                            </vs-col>
                        </vs-row>
                    </vs-col>

                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <font style="font-size: 11.5px">Concepto</font><br>
                                <vs-textarea class="inputx w-full mb-6" v-model="datosEditar.abono_concepto" placeholder="concepto" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <br>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-5">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="6">
                                <vs-button type="relief" color="success" @click="guardarCambios">Guardar Cambios</vs-button>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-col>
            </vs-row>
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
            tipoOpciones: [{
                    label: 'Depósito',
                    value: 0
                },
                {
                    label: 'Transferencia',
                    value: 1
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
        guardarCambios() {
            let me = this;
            this.$vs.loading(); // Inicia el loading

            let formData = new FormData();
            formData.append("abono_id", me.datosEditar.abono_id);
            formData.append("abono_fecha", me.datosEditar.abono_fecha);
            formData.append("abono_notas", me.datosEditar.abono_notas);
            formData.append("notasOfactura", me.datosEditar.notasOfactura);
            formData.append("abono_tipo", me.datosEditar.abono_tipo);
            formData.append("abono_documento", me.datosEditar.abono_documento);
            formData.append("abono_concepto", me.datosEditar.abono_concepto);
            formData.append("abono_cuenta", me.datosEditar.abono_cuenta);
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
                    console.error('Error al anular abono:', error);
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

</style>

    
<style scoped>
.popophijo {
    z-index: 51003;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}
</style>
