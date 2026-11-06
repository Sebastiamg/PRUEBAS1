<template>
<div>
    <div v-if="menu != 0">
        <vs-button color="primary" type="filled" @click="menu = 0;">◄ Regresar</vs-button>
    </div>
    <div v-if="menu == 0">
        <vs-table max-items="10" stripe pagination :data="arregloAbonoFacturas">
            <template slot="thead">
                <vs-th>Información Abono</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Fecha Abono:</b> {{ tr.abono_fecha }} <br>
                        <b>Valor Abono:</b> ${{ tr.abono_facturas }} <br>
                        <b>Tipo:</b> {{ tr.abono_tipo == 0 ? 'Deposito': tr.abono_tipo == 1 ? 'Transferencia': tr.abono_tipo == 2 ? 'Cheque': 'Retención' }} <br>
                        <b>Documento:</b> {{ tr.abono_documento }} <br>
                        <b>Cuenta Nombre:</b> {{ tr.cue_pag_nombre }} <br>
                        <b>Concepto:</b> {{ tr.abono_concepto }} <br>
                        <b>👤Creado por:</b> {{ tr.usuario_creador }} <br>
                        <b v-if="tr.usuario_actualizador">👤Actualizado por:</b> {{ tr.usuario_actualizador }} <br>
                        <b>Estado envío Perseo:</b>
                        <div v-if="tr.estadoPerseo == 0">
                            <vs-chip color="warning">No enviado a Perseo</vs-chip>
                        </div>
                        <div v-else>
                            <vs-chip color="success">Enviado a Perseo</vs-chip>
                        </div>
                    </vs-td>
                    <vs-td align="center">
                        <div v-if="tr.abono_estado == 1" >
                            <div>
                                <vs-chip color="danger">Abono Anulado</vs-chip>
                            </div>
                        </div>
                        <div v-if="tr.abono_estado == 0 && tr.estadoPerseo == 1" >
                            <div>
                                <p>Referencia cobro Perseo: <br> {{ tr.idPerseo }}</p>
                            </div>
                        </div>
                        <div v-if="tr.abono_estado == 0 && tr.estadoPerseo == 0" style="display: flex; flex-wrap: wrap;">
                            <!-- <div v-if="usuario.id_group == 1" class="m-1">
                                <vs-button v-if="tr.estadoPerseo == 0 && userRoot" @click="abono_id='';remover(tr);" color="danger" type="relief" icon="delete" title="Eliminar">Eliminar</vs-button>
                            </div> -->
                            <div class="m-1" v-if="tr.abono_tipo !== 2">
                                <vs-button v-if="tr.estadoPerseo == 0 && userRoot || AdminFacturador" color="success" type="relief" icon="edit" title="Editar" @click="irEditar(tr);">Editar</vs-button>
                            </div>
                            <div class="m-1" v-if="tr.abono_tipo !== 2">
                                <vs-button v-if="tr.estadoPerseo == 0 && userRoot || AdminFacturador" color="warning" type="relief"  icon-pack="feather" icon="icon-x" title="Anular" @click="abono_id='';AnularAbono(tr);">Anular</vs-button>
                            </div>                           
                            <!-- <vs-button v-if="tr.estadoPerseo == 0" @click="tipoAbono = 0; ObjectSelected = tr; openConfirmEnviarPerseo(tr, 1);" color="primary" type="relief" icon="send">Enviar a Perseo</vs-button> -->
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
                                <flat-pickr :config="configdateTimePicker" v-model="datosEditar.abono_fecha" placeholder="Fecha de Abono" style="display: inline-block;width: 100%" class="mb-6"/>
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
                                <vs-input v-model="datosEditar.abono_facturas" label="Valor Abono" type="number" class="w-full "/>
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
                                <vs-input v-model="datosEditar.abono_documento" label="Documento" class="w-full mb-6"/>
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
                                <!-- <vs-input v-model="datosEditar.abono_concepto" label="Concepto" class="w-full mb-6"/> -->
                                <font style="font-size: 11.5px">Concepto</font><br>
                                <vs-textarea class="inputx w-full mb-6" v-model="datosEditar.abono_concepto" placeholder="concepto"/>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <br>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
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
            dialogVisible: false,
            ObjectSelected: '',
            usuario: [],
            Cuentas: [],
            datosEditar: {
                abono_id: '',
                abono_fecha: '',
                abono_facturas: '',
                abono_tipo: '',
                abono_documento: '',
                abono_concepto: '',
                abono_cuenta:'',
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
                // {
                //     label: 'Cheque',
                //     value: 2
                // },
                // {
                //     label: 'Retención',
                //     value: 3
                // }
            ],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            arregloAbonoFacturas:[],
            datoperiodo: 0,
            datoempresa: 0,
            datocliente: '',
            abono_id:'',

        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },    
    props: {
        // arregloAbonoFacturas: {
        //     type: [Object, Array],
        //     default: () => ({}),
        // },
        periodo: {
            type: Number,
            default: 0,
        },
        empresa: {
            type: Number,
            default: 0,
        },
        cliente: {
            type: [String , Number],
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
        me.obtenerAbonosFacturas('facturas')
        me.GetCuentasAll();

    },
    methods: {
        GetCuentasAll(){
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
        openConfirmEnviarPerseo(abono, tipo) {
            console.log(abono);
            // this.$vs.notify({
            //     text: "Envio a perseo no listo",
            //     color: "danger",
            //     iconPack: "feather",
            //     icon: "icon-x",
            // });
            const formattedText = `¿Desea enviar a Perseo, el abono a ${abono.abono_empresa == 1 ? 'PROLIPA' : 'CALMED'} con el concepto de: ${abono.abono_concepto}? Por favor confirme su decisión.`
            this.$vs.dialog({
                title: 'Confirmación envio de ABONO a PERSEO',
                text: formattedText,
                acceptText: 'Enviar',
                cancelText: 'Cancelar',
                type: 'confirm',
                color: 'warning',
                accept: () => {
                    this.enviarPerseo(abono);
                },
                // cancel: () => {
                //     // this.$emit('update:popupAbonosFacturas', tipo === 1);
                //     // this.$emit('update:popupAbonosNotas', tipo === 0);
                // }
            });
        },
        enviarPerseo(abono) {
            let me = this;
            let formData = new FormData();
            formData.append("abono_id", this.ObjectSelected.abono_id);
            formData.append("usuarioCreador", `${this.usuario.nombres} ${this.usuario.apellidos}`);
            
            this.$vs.loading(); // Muestra el loader

            this.$http
                .post(this.$server_url + "api/perseo/transaccion/cobros_crear", formData)
                .then((res) => {

                    // Verifica si la respuesta tiene el campo `fault`
                    if (res.data && res.data[1] && res.data[1].cobros) {
                        // Respuesta exitosa
                        this.$vs.notify({
                            text: "Envío a Perseo exitoso",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.obtenerAbonosFacturas('facturas')
                        me.$emit('actualizarTodo', true);
                    } else {
                        // Si no hay `cobros` en la posición [1], entonces es un fallo
                        this.$vs.notify({
                            text: "Se produjo algún fallo en el envío a Perseo",
                            color: "#F8C471",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }
                    me.obtenerAbonosFacturas('facturas')
                    this.$vs.loading.close(); // Cierra el loader

                })
                .catch((error) => {
                    this.$vs.loading.close(); // Cierra el loader

                    // Maneja errores en la respuesta
                    if (error.response && error.response.data && error.response.data.fault && error.response.data.fault.detail) {
                        this.$vs.notify({
                            text: error.response.data.fault.detail,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    }
                });
        },
        remover(abono) {
            let me = this;
            me.abono_id = abono;
            me.promptVisible = true;
        },
        cancelarEliminarAbono() {
            let me = this;
            me.promptVisible = false;
        },
        eliminarAbono(abono) {
            this.$http.post(this.$server_url + 'eliminarAbono?', {
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
                            text: 'Abono eliminado correctamente',
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar abono:', error);
                    this.$vs.notify({
                        text: 'Error al eliminar el abono',
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                });
        },
        guardarCambios() {
            let me = this;
            this.$vs.loading();
            let formData = new FormData();
            formData.append("abono_id", me.datosEditar.abono_id);
            formData.append("abono_fecha", me.datosEditar.abono_fecha);
            formData.append("notasOfactura", me.datosEditar.notasOfactura);
            formData.append("abono_facturas", me.datosEditar.abono_facturas);
            formData.append("abono_tipo", me.datosEditar.abono_tipo);
            formData.append("abono_documento", me.datosEditar.abono_documento);
            formData.append("abono_concepto", me.datosEditar.abono_concepto);
            formData.append("abono_cuenta", me.datosEditar.abono_cuenta);
            formData.append('user_created', me.usuario.idusuario);
            this.$http.post(this.$server_url + 'modificarAbono', formData)
                .then(res => {
                            me.$vs.loading.close(); // Cierra el loading
                            if (res.data.status === 0) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-triangle'
                                });
                            } else  if (res.data.status === 1){
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'primary',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                                me.menu = 0;
                                me.obtenerAbonosFacturas('facturas')
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
            me.datosEditar.abono_facturas = tr.abono_facturas;
            me.datosEditar.abono_tipo = tr.abono_tipo;
            me.datosEditar.abono_documento = tr.abono_documento;
            me.datosEditar.abono_cuenta = tr.abono_cuenta*1;
            me.datosEditar.abono_concepto = tr.abono_concepto;
            me.datosEditar.notasOfactura = 0;
            me.menu = 1
        },
        AnularAbono(tr){
            let me = this;
            me.abono_id = tr;
            me.Anularpopup =true;
        },
        Anular(abono){
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
                    me.$emit('actualizarTodo', true);
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
            this.$http.get(this.$server_url + 'obtenerAbonos?periodo=' + me.datoperiodo +'&empresa='+me.datoempresa +'&cliente='+ me.datocliente)
                .then(res => {
                    let datos = res.data;
                    me.arregloAbonoFacturas = datos.abonos_con_facturas
                        .map(abono => ({
                            ...abono,
                            created_at: new Date(abono.created_at).toLocaleString(),
                            updated_at: new Date(abono.updated_at).toLocaleString()
                        }))
                        .filter(abono => abono.abono_tipo !== 4)
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
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

</style>
