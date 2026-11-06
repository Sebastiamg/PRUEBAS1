<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <div class="flex">
                    <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Vendedor</vs-button>
                </div>
                <br/>
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card>
                    <div style="">
                        <vs-input class="w-full" @keyup.enter="getVendedorParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxcodigo"/>
                    </div>
                    <div style="">
                        <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li>
                            <li style="margin:10px 20px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='iniciales'">Iniciales</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"  @input="busqueda='nombres'">Nombres</vs-radio>
                            </li>
                            <li>
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getVendedorParametro();" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
        <vs-table max-items="10" pagination search :data="Vendedores">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Vendedores.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Código Vendedor
                </vs-th>
                <vs-th colspan="2">
                    Información Vendedor
                </vs-th>
                <vs-th>
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].venDCodigo">
                        {{ data[indextr].venDCodigo }}
                    </vs-td>
                    <vs-td>
                        <small>Ciudad: {{tr.ciuCodigoNavigation.ciuNombre}} </small><br>
                        <small>Apellidos: {{tr.venDApellidos}}</small><br>
                        <small>Nombres: {{tr.venDNombres}}</small><br>
                        <small>Direccion: {{tr.venDDireccion}}</small><br>
                    </vs-td>
                    <vs-td>
                        <small>Teléfono: {{tr.venDTelefono}}</small><br>
                        <small>Email: {{tr.venDEmail}}</small><br>
                        <small>Cédula: {{tr.venDCi}}</small><br>
                        <small>Secuencial Vendedor: {{tr.venDSecuencial}}</small><br>
                    </vs-td>
                    <vs-td :data="data[indextr].venDCodigo">
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditar(tr)"></vs-button>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="crear" title="Registro nuevo vendedor" :active.sync="popupActivoGuardar">
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Vendedor</b></vs-col>
                <!-- {{ tabVendedor }} -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Codigo Vendedor *" placeholder="Codigo Vendedor" class="w-full" icon="mode_edit" v-model="tabVendedor.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">        
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 12px">&nbsp;Ciudad *</font><br>
                            <v-select :options="Ciudades" :reduce="Ciudades => Ciudades.ciuCodigo" label="ciuNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabVendedor.ciuCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Apellidos " placeholder="Apellidos" class="w-full" icon="mode_edit" v-model="tabVendedor.venDApellidos" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombres " placeholder="Nombres" class="w-full" icon="mode_edit" v-model="tabVendedor.venDNombres" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Direccion " placeholder="Direccion" class="w-full" icon="mode_edit" v-model="tabVendedor.venDDireccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Teléfono " placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabVendedor.venDTelefono" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email " placeholder="Email" class="w-full" icon="mode_edit" v-model="tabVendedor.venDEmail" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Cédula " placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabVendedor.venDCi" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Secuencial Vendedor *" type="number" placeholder="Secuencial Vendedor" class="w-full" icon="mode_edit" v-model="tabVendedor.venDSecuencial" />
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
        <vs-popup class="editar" :title="`Edición vendedor: ${tabVendedor.venDCodigo}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabVendedor }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Vendedor</b></vs-col>
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabVendedor.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 11.5px">&nbsp;Ciudad *</font><br>
                            <v-select :options="Ciudades" :reduce="Ciudades => Ciudades.ciuCodigo" label="ciuNombre" class="w-full h-100 RegistroCafe" placeholder="--Seleccione--" v-model="tabVendedor.ciuCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Apellidos " placeholder="Apellidos" class="w-full" icon="mode_edit" v-model="tabVendedor.venDApellidos" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombres " placeholder="Nombres" class="w-full" icon="mode_edit" v-model="tabVendedor.venDNombres" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Dirección " placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabVendedor.venDDireccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Teléfono " placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabVendedor.venDTelefono" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email " placeholder="Email" class="w-full" icon="mode_edit" v-model="tabVendedor.venDEmail" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Cédula " placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabVendedor.venDCi" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Secuencial Vendedor *" type="number" placeholder="Secuencial Vendedor" class="w-full" icon="mode_edit" v-model="tabVendedor.venDSecuencial" />
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
import vSelect from 'vue-select';
export default {
    data() {
        return{
            Vendedores: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            tabVendedor: {
                venDCodigo: '',
                ciuCodigo: '',
                venDApellidos: '',
                venDNombres: '',
                venDDireccion: '',
                venDTelefono: '',
                venDEmail: '',
                venDCi: '',
                venDSecuencial: '',
            },
            venDCodigo: 0,
            Ciudades: [],
            busquedaxcodigo: "",
            valorBusqueda:"0",
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getVendedor();
    },
    methods: {
        getVendedor() {
            let me = this;
            // axios.get(this.$apifacturacion_url + 'f_Vendedor')
            this.$http.get(this.$server_url+'Get_Vendedor')
            .then(res => {
            //let resultado = res.data.vendedores.filter(v => v.venDCodigo !== 0);
            //this.Vendedores = resultado;
            this.Ciudades = res.data.ciudades;
            console.log(this.ciudades);
            //console.log(this.Vendedores);
            })
            .catch(err => {
            console.log(err)
            })
        },
        getVendedorParametro() {
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
            this.$http.get(this.$server_url+'Get_Vendedorxbusquedayrazonbusqueda?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            //axios.get(this.$apifacturacion_url + 'f_Vendedor/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            .then(function (res) {
                // me.tmpVenta = res.data;
                // let resultado = res.data.filter(c => c.cliCi !== 0);
                me.Vendedores = res.data;

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
                me.Vendedores = [];
                me.$vs.loading.close()
                } else {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                }
            })
        },
        // getVendedor() {
        // axios.get('https://localhost:7252/api/Vendedor')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.Vendedores = resultado;
        //     console.log(this.Vendedores);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabVendedor.venDCodigo = ''
            this.tabVendedor.ciuCodigo = ''
            this.tabVendedor.venDApellidos = null
            this.tabVendedor.venDNombres = ''
            this.tabVendedor.venDDireccion = ''
            this.tabVendedor.venDTelefono = ''
            this.tabVendedor.venDEmail = null
            this.tabVendedor.venDCi = null
            this.tabVendedor.venDSecuencial = ''
        },
        guardarnuevo() {
        let me = this;
        let resultado = me.Vendedores.filter(v => v.venDCodigo == this.tabVendedor.venDCodigo);
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
            if (this.tabVendedor.venDCodigo === '' || this.tabVendedor.venDCodigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Vendedor antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabVendedor.ciuCodigo === '' || this.tabVendedor.ciuCodigo === null) {
                me.$vs.notify({
                    text: 'Seleccione la ciudad antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabVendedor.venDSecuencial === '' || this.tabVendedor.venDSecuencial === null) {
                me.$vs.notify({
                    text: 'Escriba un secuencial antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "venDCodigo": this.tabVendedor.venDCodigo,
                "ciuCodigo": this.tabVendedor.ciuCodigo,
                "venDApellidos": this.tabVendedor.venDApellidos,
                "venDNombres": this.tabVendedor.venDNombres,
                "venDDireccion": this.tabVendedor.venDDireccion,
                "venDTelefono": this.tabVendedor.venDTelefono,
                "venDEmail": this.tabVendedor.venDEmail,
                "venDCi": this.tabVendedor.venDCi,
                "venDSecuencial": parseInt(this.tabVendedor.venDSecuencial)
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
        this.$http.post(this.$server_url+'Post_VendedorCrear', datos)
            .then(res => {
                this.getVendedor();
                this.getVendedorParametro();
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Vendedor guardado con exito',
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
                    text: 'Vendedor no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getEditar(tr) { 
        this.popupActivoEditar = true
        this.tabVendedor.venDCodigo = tr.venDCodigo
        this.tabVendedor.ciuCodigo = tr.ciuCodigo
        this.tabVendedor.venDApellidos = tr.venDApellidos
        this.tabVendedor.venDNombres = tr.venDNombres
        this.tabVendedor.venDDireccion = tr.venDDireccion
        this.tabVendedor.venDTelefono = tr.venDTelefono
        this.tabVendedor.venDEmail = tr.venDEmail
        this.tabVendedor.venDSecuencial = tr.venDSecuencial
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        if (this.tabVendedor.venDCodigo === '' || this.tabVendedor.venDCodigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Vendedor antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabVendedor.ciuCodigo === '' || this.tabVendedor.ciuCodigo === null) {
                me.$vs.notify({
                    text: 'Seleccione la ciudad antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabVendedor.venDSecuencial === '' || this.tabVendedor.venDSecuencial === null) {
                me.$vs.notify({
                    text: 'Escriba un secuencial antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "venDCodigo": this.tabVendedor.venDCodigo,
                "ciuCodigo": this.tabVendedor.ciuCodigo,
                "venDApellidos": this.tabVendedor.venDApellidos,
                "venDNombres": this.tabVendedor.venDNombres,
                "venDDireccion": this.tabVendedor.venDDireccion,
                "venDTelefono": this.tabVendedor.venDTelefono,
                "venDEmail": this.tabVendedor.venDEmail,
                "venDCi": this.tabVendedor.venDCi,
                "venDSecuencial": parseInt(this.tabVendedor.venDSecuencial)
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Vendedor/' + this.tabVendedor.venDCodigo, datos)
        this.$http.post(this.$server_url+'Post_VendedorEditar', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getVendedor();
                this.getVendedorParametro();
                me.$vs.notify({
                    text: 'Vendedor editado con exito',
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
                    text: 'Vendedor no se pudo editar',
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
    //     let url = "https://localhost:7252/api/Vendedor";
    //     axios.get(url).then((response) => this.Vendedores = response.data);
    //     // fetch("https://localhost:7252/api/Vendedor/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Vendedores = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>