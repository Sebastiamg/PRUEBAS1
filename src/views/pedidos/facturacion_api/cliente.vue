<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <div class="flex">
                    <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Cliente</vs-button>
                </div>
                <br/>
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card>
                    <div style="">
                        <vs-input class="w-full" @keyup.enter="getCliente()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxcodigo"/>
                    </div>
                    <div style="">
                        <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li>
                            <li style="margin:10px 20px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='cedula'">Cédula</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"  @input="busqueda='nombres'">Nombres</vs-radio>
                            </li>
                            <li>
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getCliente();" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
        <vs-table max-items="10" pagination search :data="Clientes">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ Clientes.length }}</b></vs-chip>
            </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Cédula
                </vs-th>
                <vs-th>
                    Información cliente
                </vs-th>
                <vs-th>
                    Información Crèdito
                </vs-th>
                <vs-th>
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].cliCi">
                        {{ data[indextr].cliCi }}
                    </vs-td>
                    <vs-td>
                        <small><b>Apellidos:</b> {{tr.cliApellidos}} </small><br>
                        <small><b>Nombres:</b> {{tr.cliNombres}}</small><br>
                        <small><b>Alias:</b> {{tr.cliAlias}}</small><br>
                        <small><b>Direccion:</b> {{tr.cliDireccion}}</small><br>
                        <small><b>Teléfono:</b> {{tr.cliTelefono}} - {{tr.cliCelular}}</small><br>
                        <small><b>Email:</b> {{tr.cliEmail}}</small><br>
                        <small><b>Fecha Nacimiento:</b> {{tr.cliFechaNacimiento}}</small><br>
                        <small><b>Codigo Vendedor:</b> {{tr.venDCodigo}}</small><br>
                        <small><b>Tìtulo:</b> {{tr.cliTitulo}}</small><br>
                    </vs-td>
                    <vs-td>
                        <small><b>Crédito:</b> {{tr.cliCredito}} </small><br>
                        <small><b>Plazo:</b> {{tr.cliPlazo}}</small><br>
                    </vs-td>
                    <vs-td :data="data[indextr].id">
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditar(tr)"></vs-button>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="crear" title="Registro nuevo cliente" :active.sync="popupActivoGuardar">
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Cliente</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabCliente.cliCi" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Apellidos " placeholder="Apellidos" class="w-full" icon="mode_edit" v-model="tabCliente.cliApellidos" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombres *" placeholder="Nombres" class="w-full" icon="mode_edit" v-model="tabCliente.cliNombres" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Dirección " placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabCliente.cliDireccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Teléfono " placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabCliente.cliTelefono" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email " placeholder="Email" class="w-full" icon="mode_edit" v-model="tabCliente.cliEmail" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Alias " placeholder="Alias" class="w-full" icon="mode_edit" v-model="tabCliente.cliAlias" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Celular " placeholder="Celular" class="w-full" icon="mode_edit" v-model="tabCliente.cliCelular" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Fecha Nacimiento " type="date" class="w-full" icon="mode_edit" v-model="tabCliente.cliFechaNacimiento" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Código Vendedor " placeholder="Código Vendedor" class="w-full" icon="mode_edit" v-model="tabCliente.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Título " placeholder="Título" class="w-full" icon="mode_edit" v-model="tabCliente.cliTitulo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Crédito</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Crédito " type="number" placeholder="Crédito" class="w-full" icon="mode_edit" v-model="tabCliente.cliCredito" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Plazo " type="number" placeholder="Plazo" class="w-full" icon="mode_edit" v-model="tabCliente.cliPlazo" />
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
        <vs-popup class="editar" :title="`Edición cliente: ${tabCliente.cliCi}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabCliente }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Cliente </b></vs-col>
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabCliente.cliCi" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Apellidos " placeholder="Apellidos" class="w-full" icon="mode_edit" v-model="tabCliente.cliApellidos" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombres *" placeholder="Nombres" class="w-full" icon="mode_edit" v-model="tabCliente.cliNombres" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Dirección " placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabCliente.cliDireccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Teléfono " placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabCliente.cliTelefono" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email " placeholder="Email" class="w-full" icon="mode_edit" v-model="tabCliente.cliEmail" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Alias " placeholder="Alias" class="w-full" icon="mode_edit" v-model="tabCliente.cliAlias" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Celular " placeholder="Celular" class="w-full" icon="mode_edit" v-model="tabCliente.cliCelular" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <!-- <flat-pickr v-model="tabregistro.user_fecha_registro" :config="configdateTimePicker"></flat-pickr> -->
                            <vs-input label="Fecha Nacimiento " type="date" class="w-full" icon="mode_edit" v-model="tabCliente.cliFechaNacimiento" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Código Vendedor " placeholder="Código Vendedor" class="w-full" icon="mode_edit" v-model="tabCliente.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Título " placeholder="Título" class="w-full" icon="mode_edit" v-model="tabCliente.cliTitulo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Crédito</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Crédito " type="number" placeholder="Crédito" class="w-full" icon="mode_edit" v-model="tabCliente.cliCredito" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Plazo " type="number" placeholder="Plazo" class="w-full" icon="mode_edit" v-model="tabCliente.cliPlazo" />
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
    </vx-card>
    </template>
<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
export default {
    data() {
        return{
            Clientes: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            tabCliente: {
                cliCi: '',
                cliApellidos: '',
                cliNombres: '',
                cliDireccion: '',
                cliTelefono: '',
                cliEmail: '',
                cliCredito: '',
                cliPlazo: '',
                cliAlias: '',
                cliCelular: '',
                cliFechaNacimiento: '',
                venDCodigo: '',
                cliTitulo: '',
            },
            busquedaxcodigo: "",
            cliCi: 0,
            valorBusqueda:"0",
        }
    },
    methods: {
        getCliente() {
            let me = this;
            if(me.busquedaxcodigo.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+'Get_Clientexbusquedayrazonbusqueda?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            .then(function (res) {
                // me.tmpVenta = res.data;
                // let resultado = res.data.filter(c => c.cliCi !== 0);
                me.Clientes = res.data;
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
            })
            .catch(function (error) {
                if (error.response && error.response.status === 404) {
                    me.$vs.notify({
                        text: 'No hay usuarios para esta búsqueda',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                me.$vs.loading.close()
                } else {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                }
            })
        },
        // getCliente() {
        //     let me = this;
        //     axios.get(this.$apifacturacion_url + 'f_Cliente')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliNombres !== 0);
        //     this.Clientes = resultado;
        //     })
        //     .catch(err => {
        //     console.log(err)
        //     })
        // },
        // getCliente() {
        // axios.get('https://localhost:7252/api/Cliente')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.Clientes = resultado;
        //     console.log(this.Clientes);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabCliente.cliCi = ''
            this.tabCliente.cliApellidos = ''
            this.tabCliente.cliNombres = null
            this.tabCliente.cliDireccion = ''
            this.tabCliente.cliTelefono = ''
            this.tabCliente.cliEmail = ''
            this.tabCliente.cliCredito = null
            this.tabCliente.cliPlazo = null
            this.tabCliente.cliAlias = ''
            this.tabCliente.cliCelular = ''
            this.tabCliente.cliFechaNacimiento = null
            this.tabCliente.venDCodigo = ''
            this.tabCliente.cliTitulo = ''
        },
        guardarnuevo() {
        let me = this;
        let resultado = me.Clientes.filter(v => v.cliCi == this.tabCliente.cliCi);
            if(resultado.length>0)
            {
                me.$vs.notify({
                        text: 'Ya existe un registro con ese código de vendedor',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
            }
        //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabCliente.cliCi === '' || this.tabCliente.cliCi === null) {
                me.$vs.notify({
                    text: 'Escriba la cédula antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabCliente.cliNombres === '' || this.tabCliente.cliNombres === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "cliCi": this.tabCliente.cliCi,
                "cliApellidos": this.tabCliente.cliApellidos,
                "cliNombres": this.tabCliente.cliNombres,
                "cliDireccion": this.tabCliente.cliDireccion,
                "cliTelefono": this.tabCliente.cliTelefono,
                "cliEmail": this.tabCliente.cliEmail,
                "cliCredito": parseInt(this.tabCliente.cliCredito),
                "cliPlazo": parseInt(this.tabCliente.cliPlazo),
                "cliAlias": this.tabCliente.cliAlias,
                "cliCelular": this.tabCliente.cliCelular,
                "cliFechaNacimiento": this.tabCliente.cliFechaNacimiento,
                "venDCodigo": this.tabCliente.venDCodigo,
                "cliTitulo": this.tabCliente.cliTitulo
            }
        me.$vs.loading()
        this.$http.post(this.$server_url+'Post_ClienteCrear', datos)
            .then(res => {
                this.getCliente();
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Cliente guardado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Cliente no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getEditar(tr) {
        this.popupActivoEditar = true
        this.tabCliente.cliCi = tr.cliCi
        this.tabCliente.cliApellidos = tr.cliApellidos
        this.tabCliente.cliNombres = tr.cliNombres
        this.tabCliente.cliDireccion = tr.cliDireccion
        this.tabCliente.cliTelefono = tr.cliTelefono
        this.tabCliente.cliEmail = tr.cliEmail
        this.tabCliente.cliCredito = tr.cliCredito
        this.tabCliente.cliPlazo = tr.cliPlazo
        this.tabCliente.cliAlias = tr.cliAlias
        this.tabCliente.cliCelular = tr.cliCelular
        this.tabCliente.cliFechaNacimiento = moment(tr.cliFechaNacimiento).format('YYYY-MM-DD')
        this.tabCliente.venDCodigo = tr.venDCodigo
        this.tabCliente.cliTitulo = tr.cliTitulo
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        if (this.tabCliente.cliNombres === '' || this.tabCliente.cliNombres === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "cliCi": this.tabCliente.cliCi,
                "cliApellidos": this.tabCliente.cliApellidos,
                "cliNombres": this.tabCliente.cliNombres,
                "cliDireccion": this.tabCliente.cliDireccion,
                "cliTelefono": this.tabCliente.cliTelefono,
                "cliEmail": this.tabCliente.cliEmail,
                "cliCredito": parseInt(this.tabCliente.cliCredito),
                "cliPlazo": parseInt(this.tabCliente.cliPlazo),
                "cliAlias": this.tabCliente.cliAlias,
                "cliCelular": this.tabCliente.cliCelular,
                "cliFechaNacimiento": this.tabCliente.cliFechaNacimiento,
                "venDCodigo": this.tabCliente.venDCodigo,
                "cliTitulo": this.tabCliente.cliTitulo
            }
        me.$vs.loading()
        this.$http.post(this.$server_url+'Post_ClienteEditar', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getCliente();
                me.$vs.notify({
                    text: 'Cliente editado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })

                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Cliente no se pudo editar',
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
        },
    },
    // created(){
    //     let url = "https://localhost:7252/api/Cliente";
    //     axios.get(url).then((response) => this.Clientes = response.data);
    //     // fetch("https://localhost:7252/api/Cliente/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Clientes = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>