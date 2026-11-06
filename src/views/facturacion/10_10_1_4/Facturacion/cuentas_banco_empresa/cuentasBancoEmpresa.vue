<template>
<vx-card fixed-height="true">
    <vs-row w="12">
        <vs-col offset="0" vs-lg="8" vs-sm="6" vs-xs="12">
            <vs-button type="border" color="success" class="mr-2" @click="getNuevo();">Agregar Nuevo Cuenta</vs-button>
        </vs-col>
        <vs-col offset="9" vs-lg="4" vs-sm="7" vs-xs="12">
            <font style="font-size: 11.5px">Filtro por banco: </font><br>
            <v-select :options="Banco" :reduce="Banco => Banco.bancoid" label="descripcion" class="w:1/2 h-100" placeholder="--Seleccione--" v-model="valorBanco" @input="filtrarCuentas(valorBanco)" />
        </vs-col>
    </vs-row>
    <div>
        <vs-row vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-col vs-type="flex" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12" v-for="(tr, index) in valorBanco ? tabCuentasFiltrados : Cuentas" :key="index">
                <vx-card fixed-height="true" class="m-3" :card-background="tr.cue_pag_estado === 1 ? '#e2e3e5' : '#FFFFFF'">
                    <template>
                        <div style="display: flex; float: right" v-if="tr.cue_pag_estado === 0">
                            <vx-tooltip text="Editar" v-if="tr.cue_pag_codigo !== 6 && tr.cue_pag_codigo !== 8 && tr.cue_pag_codigo !== 9">
                                <vs-button flat style="float: right;" @click="datosEditar=tr;getEditar(tr);" color="warning" type="relief" icon-pack="feather" icon="icon-edit"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Deshabilitar Cuenta" v-if="tr.cue_pag_codigo !== 6 && tr.cue_pag_codigo !== 8 && tr.cue_pag_codigo !== 9">
                                <vs-button flat style="float: right;" @click="popup_desactivar_activar_tdo(tr);" color="danger" type="relief" icon-pack="feather" icon="icon-slash"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Eliminar Cuenta" v-if="usuario.id_group == 1 && tr.cue_pag_codigo !== 6 && tr.cue_pag_codigo !== 8 && tr.cue_pag_codigo !== 9">
                                <vs-button flat style="float: right;" @click="getPreguntaEliminar(tr);" color="danger" type="relief" icon-pack="feather" icon="icon-trash"></vs-button>
                            </vx-tooltip>
                        </div>
                        <div style="display: flex; float: right" v-if="tr.cue_pag_estado === 1">
                            <vx-tooltip text="Habilitar Cuenta">
                                <vs-button flat style="float: right;" @click="popup_desactivar_activar_tdo(tr);" color="success" type="relief"><span><i class="feather icon-check-square mr-2"></i><i class="feather icon-credit-card"></i></span></vs-button>
                            </vx-tooltip>
                        </div>
                        <div style="text-align: center;">
                            <p v-if="Banco.find(b => b.bancoid == tr.ban_codigo)"><b>Banco {{ (Banco.find(b => b.bancoid == tr.ban_codigo)).descripcion }}</b></p>
                        </div>
                        <p v-if="tr.cue_pag_tipo_cuenta == 1"><b style="color: red">CTA. NOTAS</b></p>
                        <p><b>N° Cta:</b> {{ tr.cue_pag_numero }}</p>
                        <p><b>Cta. Nombre:</b> {{ tr.cue_pag_nombre }}</p>
                    </template>
                </vx-card>
            </vs-col>
        </vs-row>
    </div>
    <!-- SECCION REGISTRO -->
    <vs-popup class="crear" title="Registra nueva cuenta" :active.sync="popupActivoGuardar">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Cuenta Bancaria</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Banco: </font><br>
                        <v-select :options="Banco" :reduce="Banco => Banco.bancoid" label="descripcion" class="w-full h-100" placeholder="--Seleccione--" v-model="tabBancoCuenta.ban_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Numero de Cuenta: </font><br>
                        <vs-input class="w-full" icon="mode_edit" type="number" v-model="tabCuentas.cue_pag_numero" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Nombre Cuenta: </font><br>
                        <vs-input class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_nombre" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Descripción: </font><br>
                        <vs-input class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_descripcion" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px" class="mx-4">CUENTA DE NOTAS: </font>
                        <vs-switch class="w-1/6" color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="tabCuentas.cue_pag_tipo_cuenta">
                            <span slot="on">SI</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup class="editar" :title="`Edición cuenta N°: ${tabCuentas.cue_pag_numero}`" :active.sync="popupActivoEditar">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Cuenta Bancaria # {{ tabCuentas.cue_pag_codigo }}</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Banco: </font><br>
                        <v-select :options="Banco" :reduce="Banco => Banco.bancoid" label="descripcion" class="w-full h-100" placeholder="--Seleccione--" v-model="tabBancoCuenta.ban_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Numero de Cuenta: </font><br>
                        <vs-input type="number" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_numero" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Nombre Cuenta: </font><br>
                        <vs-input class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_nombre" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Descripción: </font><br>
                        <vs-input class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_descripcion" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px" class="mx-4">CUENTA DE NOTAS: </font>
                        <vs-switch class="w-1/6" color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="tabCuentas.cue_pag_tipo_cuenta">
                            <span slot="on">SI</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar Cuenta N°: ${tabCuentas.cue_pag_numero}?`" :active.sync="popupActivoEliminar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!-- SECCION DESACTIVAR -->
    <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado de la Cuenta N°: ${tabCuentas.cue_pag_numero}?`" :active.sync="popupActivoDesactivar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="desactivar_activar_cuenta()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
</vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
export default {
    data() {
        return {
            search: '',
            Banco: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            // tabBancoCuenta: [],
            Cuentas: [],
            tabBancoCuenta: {
                ban_codigo: '',
            },
            tabCuentas: {
                cue_pag_codigo: '',
                cue_pag_nombre: '',
                cue_pag_numero: '',
                cue_pag_descripcion: '',
                cue_pag_estado: '',
                cue_pag_tipo_cuenta: '',
            },
            ban_codigo: 0,
            Banco_inactivos: [],
            busquedaxnombre: "",
            busqueda: "",
            valor: "0",
            valorBusqueda: 0,
            checkBox_mostraractivos: true,
            checkBox_mostrarinactivos: false,
            valorBanco: null,
            tabCuentasFiltrados: [],
            usuario: '',
            datosEditar: [],
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.GetBanco_todo();
        this.getCuentas_todo();
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    methods: {
        filtrarCuentas(datos) {
            if (datos) {
                const tabCuentasArray = Object.values(this.Cuentas);
                this.tabCuentasFiltrados = tabCuentasArray.filter((tr) => {
                    return tr.ban_codigo === datos;
                });
            }

        },
        GetBanco_todo() {
            let me = this;
            this.$vs.loading();
            this.$http.post(this.$server_url + 'api/perseo/consultas/bancos_consulta')
                .then(res => {
                    me.Banco = res.data['banco'];
                    // console.log(me.Bancos)
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        getCuentas_todo() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'GetCuentasBanco')
                .then(res => {
                    let datos = res.data;
                    this.Cuentas = datos;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        //SECCION GUARDAR NUEVO BANCO
        getNuevo() {
            let me = this;
            this.popupActivoGuardar = true
            this.GetBanco_todo();
            me.tabBancoCuenta.ban_codigo = '';
            me.tabCuentas.cue_pag_numero = '';
            me.tabCuentas.cue_pag_nombre = '';
            me.tabCuentas.cue_pag_descripcion = '';
            me.tabCuentas.cue_pag_tipo_cuenta = 0;

        },
        guardarnuevo() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);

            let datos = {
                "ban_codigo": this.tabBancoCuenta.ban_codigo,
                "cue_pag_numero": this.tabCuentas.cue_pag_numero,
                "cue_pag_nombre": this.tabCuentas.cue_pag_nombre,
                "cue_pag_descripcion": this.tabCuentas.cue_pag_descripcion,
                "cue_pag_tipo_cuenta": this.tabCuentas.cue_pag_tipo_cuenta,
                "user_created": usuarioObjeto.idusuario,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + 'cuenta_registro', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getCuentas_todo();
                    me.$vs.notify({
                        text: 'Banco guardado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.getCancelar();
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'La Asignación no se pudo guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getEditar(tr) {
            let me = this;
            this.GetBanco_todo();
            me.tabBancoCuenta.ban_codigo = me.datosEditar.ban_codigo;
            me.tabCuentas.cue_pag_numero = me.datosEditar.cue_pag_numero;
            me.tabCuentas.cue_pag_nombre = me.datosEditar.cue_pag_nombre;
            me.tabCuentas.cue_pag_descripcion = me.datosEditar.cue_pag_descripcion;
            me.tabCuentas.cue_pag_codigo = me.datosEditar.cue_pag_codigo;
            me.tabCuentas.cue_pag_tipo_cuenta = me.datosEditar.cue_pag_tipo_cuenta;
            me.popupActivoEditar = true;
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let datos = {
                "cue_pag_codigo": this.tabCuentas.cue_pag_codigo,
                "ban_codigo": this.tabBancoCuenta.ban_codigo,
                "cue_pag_numero": this.tabCuentas.cue_pag_numero,
                "cue_pag_nombre": this.tabCuentas.cue_pag_nombre,
                "cue_pag_descripcion": this.tabCuentas.cue_pag_descripcion,
                "cue_pag_tipo_cuenta": this.tabCuentas.cue_pag_tipo_cuenta == true ? 1 : 0,
                'editar': 'yes',
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + 'cuenta_registro', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getCuentas_todo();
                    me.$vs.notify({
                        text: 'Banco editado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
                    me.datosEditar = [];
                })
                .catch(error => {
                    if (error.response && error.response.status === 500) {
                        me.$vs.notify({
                            text: 'Revise los campos que esten en el formato correcto',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.$vs.loading.close()
                    } else {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Banco no se pudo editar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
        },
        popup_desactivar_activar_tdo(tr) {
            this.tabCuentas.cue_pag_numero = tr.cue_pag_numero;
            this.tabCuentas.cue_pag_codigo = tr.cue_pag_codigo;
            this.tabCuentas.cue_pag_estado = tr.cue_pag_estado;
            this.popupActivoDesactivar = true;
        },
        desactivar_activar_cuenta() {
            let me = this;
            let valornuevo = this.tabCuentas.cue_pag_estado;
            if (valornuevo == 1) {
                valornuevo = 0;
                let datos = {
                    "cue_pag_codigo": this.tabCuentas.cue_pag_codigo,
                    "cue_pag_estado": valornuevo,
                }
                me.$vs.loading()
                this.$http.post(this.$server_url + 'desactivar_activar_cuenta', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        this.getCuentas_todo();
                        me.$vs.notify({
                            text: 'Cambio de estado exitoso',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popupActivoEditar = false;
                        this.popupActivoDesactivar = false;
                        this.popupActivoGuardar = false;
                        this.popupActivoEliminar = false;
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo realizar el cambio de estado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            } else if (valornuevo == 0) {
                valornuevo = 1;
                let datos = {
                    "cue_pag_codigo": this.tabCuentas.cue_pag_codigo,
                    "cue_pag_estado": valornuevo,
                }
                me.$vs.loading()
                this.$http.post(this.$server_url + 'desactivar_activar_cuenta', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        this.getCuentas_todo();
                        me.$vs.notify({
                            text: res.data.mensaje,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popupActivoEditar = false;
                        this.popupActivoDesactivar = false;
                        this.popupActivoGuardar = false;
                        this.popupActivoEliminar = false;
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: error.response.data.mensaje,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            }
        },
        getPreguntaEliminar(tr) {
            this.tabCuentas.cue_pag_numero = tr.cue_pag_numero;
            this.tabCuentas.cue_pag_codigo = tr.cue_pag_codigo;
            this.popupActivoEliminar = true
        },
        getEliminar() {
            let me = this;
            let datos = {
                "cue_pag_codigo": this.tabCuentas.cue_pag_codigo,
            }
            console.log(datos);
            me.$vs.loading()
            this.$http.post(this.$server_url + "eliminar_cuenta", datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getCuentas_todo();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
                })
                .catch(error => {
                    console.log(error);
                    me.$vs.loading.close()
                    me.$vs.notify({
                        // text: error.response.data.error,
                        text: 'No se pudo eliminar la cuenta',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
        },
    },
    // created(){
    //     let url = "https://localhost:7252/api/Vendedor";
    //     axios.get(url).then((response) => this.Vendedores = response.data);
    //     // fetch("https://localhost:7252/api/Vendedor/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Vendedores = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>