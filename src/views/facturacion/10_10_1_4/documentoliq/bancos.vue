<template>
    <vx-card fixed-height="true">
        <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Banco</vs-button>
        <vs-table max-items="10" pagination search :data="Banco">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Banco.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th width="200">
                    #
                </vs-th>
                <vs-th width="500">
                    Información Banco
                </vs-th>
                <vs-th>Estado</vs-th>
                <vs-th width="100">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].ban_codigo">
                        {{ data[indextr].ban_codigo }}
                    </vs-td>
                    <vs-td>
                        <small><b>Nombre:</b> {{tr.ban_nombre}}</small><br>
                        <small><b>Direccion:</b> {{tr.ban_direccion}}</small><br>
                        <small><b>Telefono:</b> {{tr.ban_telefono}}</small><br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.ban_estado == 0" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].ban_codigo">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.ban_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                    <vs-button v-if="tr.ban_estado == 0" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button>
                                    <vs-button v-if="tr.ban_estado == 0" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_tdo(tr)">Desactivar Asignación</vs-button>
                                    <vs-button v-if="tr.ban_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_tdo(tr)">Activar Asignación</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" fullscreen title="Registro nuevo Banco" :active.sync="popupActivoGuardar">
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Banco </b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre del Banco" placeholder="BANCO" class="w-full" icon-pack="feather" icon="icon-codepen" v-model="tabBanco.ban_nombre"  @input="convertirAMayusculas()"/>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Dirección" placeholder="Dirección" class="w-full" icon-pack="feather" icon="icon-hash" v-model="tabBanco.ban_direccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="end" vs-align="end" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Telefono" type="number" placeholder="Telefono" class="w-full" icon-pack="feather" icon="icon-phone" v-model="tabBanco.ban_telefono"/>
                        </vs-col>
                    </vs-row>
                </vs-col>               
            </vs-row>
            <vs-row vs-justify="center" vs-align="center" class="my-5">                
                <vs-button color="success" type="relief" @click="agregarCuenta()">Agregar cuenta bancaria</vs-button>           
            </vs-row>
            <vs-row vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12" > 
                <vs-col vs-type="flex" vs-align="center" vs-lg="4" vs-sm="6" vs-xs="12" v-for="(tabCuentas, index) in tabCuentas" :key="index">
                    <vx-card fixed-height="true" class="m-3">
                        <vs-row>
                            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input label="Numero de Cuenta" type="number" placeholder="Numero de Cuenta" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pg_numero" />
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input label="Nombre Cuenta" placeholder="Nombre Cuenta" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_nombre"/>
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input label="Descripción" placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pg_descripcion" />
                                </vs-col>
                                <vs-col>
                                    <vs-row vs-justify="center" vs-align="center" class="mt-2">   
                                        <vs-button @click="eliminarCuenta(index)" color="danger" type="relief">Eliminar</vs-button>
                                    </vs-row>
                                </vs-col>
                            </vs-col>
                        </vs-row>
                    </vx-card> 
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!-- SECCION EDITAR -->
        <vs-popup class="editar" fullscreen :title="`Edición Banco: ${tabBanco.ban_codigo}`" :active.sync="popupActivoEditar">
            <vs-row>         
                <!-- {{ tabBanco }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Banco </b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre del Banco" placeholder="BANCO" class="w-full" icon-pack="feather" icon="icon-codepen" v-model="tabBanco.ban_nombre"  @input="convertirAMayusculas()"/>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Dirección" placeholder="Dirección" class="w-full" icon-pack="feather" icon="icon-hash" v-model="tabBanco.ban_direccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="end" vs-align="end" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Telefono" type="number" placeholder="Telefono" class="w-full" icon-pack="feather" icon="icon-phone" v-model="tabBanco.ban_telefono"/>
                        </vs-col>
                    </vs-row>
                </vs-col>               
            </vs-row>
            <vs-row vs-justify="center" vs-align="center" class="my-5">                
                <vs-button color="success" type="relief" @click="agregarCuenta()">Agregar cuenta bancaria</vs-button>           
            </vs-row>
            <vs-row vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12" > 
                <vs-col vs-type="flex" vs-align="center" vs-lg="4" vs-sm="6" vs-xs="12" v-for="(tabCuentas, index) in tabCuentas" :key="index">
                    <vx-card fixed-height="true" class="m-3">
                        <vs-row>
                            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input label="Numero de Cuenta" type="number" placeholder="Numero de Cuenta" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pg_numero" />
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input label="Nombre Cuenta" placeholder="Nombre Cuenta" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pag_nombre"/>
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-input label="Descripción" placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabCuentas.cue_pg_descripcion" />
                                </vs-col>
                                <vs-col>
                                    <vs-row vs-justify="center" vs-align="center" class="mt-2">   
                                        <vs-button @click="eliminarCuenta(index)" color="danger" type="relief">Eliminar</vs-button>
                                    </vs-row>
                                </vs-col>
                            </vs-col>
                        </vs-row>
                    </vx-card> 
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!-- SECCION ELIMINAR -->
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar Banco: ${ban_codigo}?`" :active.sync="popupActivoEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!-- SECCION DESACTIVAR -->
        <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del Banco: ${ban_codigo}?`" :active.sync="popupActivoDesactivar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="desactivar_activar_tipo_documento()" type="relief">Aceptar</vs-button>
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
        return{
            Banco: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabBanco: {
                ban_codigo: '',
                ban_nombre: '',
                ban_direccion: '',
                ban_telefono: '',
                ban_estado: '',
            },
            tabCuentas: [],
            // tabCuentas:{
            //     cue_pg_numero: '',
            //     cue_pg_descripcion: '',
            //     cue_pg_estado: '',
            // },
            ban_codigo: 0,
            Banco_inactivos: [],
            busquedaxnombre: "",
            busqueda:"",
            valor:"0",
            valorBusqueda:0,
            checkBox_mostraractivos:true,
            checkBox_mostrarinactivos:false,
            //showAgregarNuevo: false,
        }
    },
    watch: {
        valorBusqueda(newValue) {
            if (newValue === '0') {
                this.Banco = [];
            }else if (newValue === '1') {
                this.Banco = [];
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getBanco();
    },
    methods: {            
        // handleRadioInput(opcion) {
        //     // Vacía el array Banco cuando se selecciona la opción 'nombres'
        //     if (opcion === 'nombreInstitucion') {
        //         this.Banco = [];
        //     }
        //     else if(opcion === 'nombreAsesor'){
        //         this.Banco = [];
        //     }
        // },
        getBanco() {
            let me = this;
            this.checkBox_mostraractivos = true;
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetBanco_todo')
            .then(res => {
            this.Banco = res.data;
            me.$vs.loading.close()
            })
            .catch(err => {
            console.log(err)
            me.$vs.loading.close()
            })
        },
        convertirAMayusculas() {
            this.tabBanco.ban_nombre = this.tabBanco.ban_nombre.toUpperCase();
        },
        getBanco_activos(){
            let me = this;
            this.busquedaxnombre = '';
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetBanco_activo')
            .then(res => {
                this.Banco = res.data;
                if(me.Banco.length === 0){
                    me.$vs.notify({
                        text: 'No hay asignaciones activas',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.Banco = [];
                    me.$vs.loading.close()
                }else{
                    me.$vs.loading.close()
                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                    }   
                }
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close()
            })
        },
        getBanco_inactivos() {
            let me = this;
            this.busquedaxnombre = '';
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetBanco_Inactivo')
            .then(res => {
                this.Banco = res.data;
                if(me.Banco.length === 0){
                    me.$vs.notify({
                        text: 'No hay asignaciones inactivas',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.Banco = [];
                    me.$vs.loading.close()
                }else{
                    me.$vs.loading.close()
                    if(res.data.message){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                    }   
                }
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close()
            })
        },
        getBancoParametro() {
            let me = this;
            this.busqueda='nombre';
            if(me.busquedaxnombre.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            if(me.busquedaxnombre !== null && me.busquedaxnombre !== '' && me.busquedaxnombre !== 0){
                this.$http.get(this.$server_url+'GetBancoParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxnombre)
                // this.$http.get(this.$server_url+'GetAsignacionesParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaInstitucion)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.Banco = res.data;
                    if(me.Banco.length === 0){
                        me.$vs.notify({
                            text: 'No hay coincidencias en la búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Banco = [];
                        me.$vs.loading.close()
                    }else{
                        // me.filtroRegion();
                        me.$vs.loading.close()
                        if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                            })
                        }   
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay institución para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    me.Banco = [];
                    me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
            }else{
                this.$http.get(this.$server_url+'GetBancoParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.valorBusqueda)
                .then(function (res) {
                    me.Banco = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.Banco = [];
                    me.$vs.loading.close()
                })           
            }
            
        },
        agregarCuenta() {
            this.tabCuentas.push({ numero: '', nombre: '', descripcion: '' });
        },
        eliminarCuenta(index) {
            this.tabCuentas.splice(index, 1);
        },            
        //SECCION GUARDAR NUEVO Banco
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabBanco.ban_nombre = ''
            this.tabBanco.ban_direccion = ''
            this.tabBanco.ban_telefono = ''
            this.tabBanco.tdo_secuencial = ''
            this.tabBanco.tdo_letra = ''
            this.tabCuentas = []
        },
        guardarnuevo() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);  
            
            let cuentas = Array.isArray(this.tabCuentas) ? this.tabCuentas : [];

            let datos  = {
                "ban_nombre": this.tabBanco.ban_nombre,
                "ban_telefono": this.tabBanco.ban_telefono,
                "ban_direccion": this.tabBanco.ban_direccion,
                "cuentas": cuentas,
                "user_created": usuarioObjeto.idusuario,
            }
            me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url+'PostRegistrar_modificar_Banco', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getBanco();
                me.$vs.notify({
                    text: 'Banco guardado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoDesactivar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
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
            this.tabBanco.ban_codigo = tr.ban_codigo;
            this.tabBanco.ban_nombre = tr.ban_nombre;
            this.tabBanco.ban_direccion = tr.ban_direccion;
            this.tabBanco.ban_telefono = tr.ban_telefono;

            me.$vs.loading();

            this.$http.get(this.$server_url + 'GetCuentasXBanco?banco=' + tr.ban_codigo)
                .then(res => {
                    let datos = res.data;
                    this.tabCuentas = [];
                    datos.forEach(cuenta => {
                        let cuentaObj = {
                            cue_pg_numero: cuenta.cue_pag_numero,
                            cue_pag_nombre: cuenta.cue_pag_nombre,
                            cue_pg_descripcion: cuenta.cue_pag_descripcion
                        };
                        this.tabCuentas.push(cuentaObj);
                    });
                    this.popupActivoEditar = true;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (this.tabBanco.ban_nombre === '' || this.tabBanco.ban_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre del Banco antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabBanco.ban_direccion === '' || this.tabBanco.ban_direccion === null) {
                me.$vs.notify({
                    text: 'Escriba la direccion del Banco antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabBanco.ban_telefono === '' || this.tabBanco.ban_telefono === null) {
                me.$vs.notify({
                    text: 'Escriba la letra del Banco antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos  = {                
                "ban_codigo": this.tabBanco.ban_codigo,
                "ban_nombre": this.tabBanco.ban_nombre,
                "ban_telefono": this.tabBanco.ban_telefono,
                "ban_direccion": this.tabBanco.ban_direccion,
                "cuentas": this.tabCuentas
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
        this.$http.post(this.$server_url+'PostRegistrar_modificar_Banco', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getBanco();
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
            this.popupActivoDesactivar = true
            this.ban_codigo = tr.ban_codigo
            this.tabBanco.ban_estado = tr.ban_estado
        },
        desactivar_activar_tipo_documento() {
            let me = this;
            let valornuevo = this.tabBanco.ban_estado;
            //console.log(valornuevo+'valornuevoeatdoprocutp'+this.ban_codigo);
            if(valornuevo == 1){
                valornuevo = 0;
                let datos  = {
                    "ban_codigo": this.ban_codigo,
                    "ban_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url+'Desactivar_tipo_documento', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getBanco();
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
            }else if (valornuevo == 0){
                valornuevo = 1;
                let datos  = {
                    "ban_codigo": this.ban_codigo,
                    "ban_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url+'Desactivar_tipo_documento', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getBanco();
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
            }        
        },    
        getPreguntaEliminar(tr) {
            this.popupActivoEliminar = true
            this.ban_codigo = tr.ban_codigo
        },
        getEliminar() {
            let me = this;
            let datos  = {
                "ban_codigo": this.ban_codigo,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_tipo_documento", datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getBanco();
                    me.$vs.notify({
                        text: 'Se elimino la asignación correctamente',
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
                        text: 'No se pudo eliminar la asignación',
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