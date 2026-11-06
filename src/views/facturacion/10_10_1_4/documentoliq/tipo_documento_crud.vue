<template>
    <vx-card fixed-height="true">
        <!-- <vs-row vs-justify="flex-start">            
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">                
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card class="seccionmostrartodo">
                    <vs-row>                
                        <vs-input class="w" @keyup.enter="getTipoDocumentoParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxnombre"/>
                        <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getTipoDocumentoParametro();" icon="search"></vs-button>
                    </vs-row>
                    <vs-row>                
                        <ul  class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li> 
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda"  @input="busqueda='nombre'">Nombre</vs-radio>
                            </li>
                        </ul>  
                    </vs-row>                    
                </vs-card>
            </vs-col>
        </vs-row> -->
        <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Tipo Documento</vs-button>
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <vs-table max-items="10" pagination search :data="TipoDocumento">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ TipoDocumento.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th width="200">
                    Código
                </vs-th>
                <vs-th width="500">
                    Información Tipo Documento
                </vs-th>
                <vs-th>Estado</vs-th>
                <vs-th width="100">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].tdo_id">
                        {{ data[indextr].tdo_id }}
                    </vs-td>
                    <vs-td>
                        <!-- {{ tr }} -->
                        <small><b>Nombre:</b> {{tr.tdo_nombre}}</small><br>
                        <small><b>Secuencial Prolipa:</b> {{tr.tdo_secuencial_Prolipa}}</small><br>
                        <small><b>Secuencial Calmed:</b> {{tr.tdo_secuencial_calmed}}</small><br>
                        <small><b>Letra:</b> {{tr.tdo_letra}}</small><br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.tdo_estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].tdo_id">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.tdo_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                    <vs-button v-if="tr.tdo_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button>
                                    <vs-button v-if="tr.tdo_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_tdo(tr)">Desactivar Asignación</vs-button>
                                    <vs-button v-if="tr.tdo_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_tdo(tr)">Activar Asignación</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" title="Registro nuevo tipo documento" :active.sync="popupActivoGuardar">
            <vs-row>         
                <!-- {{ tabTipoDocumento }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Tipo Documento</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_nombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Secuencial Prolipa"  type="number" placeholder="Secuencial" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_secuencial_Prolipa" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Secuencial Calmed"  type="number" placeholder="Secuencial" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_secuencial_calmed" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row class="mb-5">         
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Letra" placeholder="Letra" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_letra" @input="convertirAMayusculas()"/>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row >         
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-textarea style="width:100%;" label="Descripcion" v-model="tabTipoDocumento.tdo_descripcion" />
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
        <vs-popup class="editar" :title="`Edición tipo documento: ${tabTipoDocumento.tdo_id}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabTipoDocumento }} -->             
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Tipo Documento</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_nombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <!-- {{ tabTipoDocumento.tdo_secuencial }} -->
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Secuencial Prolipa" type="number" placeholder="Secuencial" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_secuencial_Prolipa" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <!-- {{ tabTipoDocumento.tdo_secuencial }} -->
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Secuencial Calmed" type="number" placeholder="Secuencial" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_secuencial_calmed" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row class="mb-5"> 
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Letra" placeholder="Letra" class="w-full" icon="mode_edit" v-model="tabTipoDocumento.tdo_letra" @input="convertirAMayusculas()"/>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row>         
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-textarea style="width:100%;" label="Descripcion" v-model="tabTipoDocumento.tdo_descripcion" />
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
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar Tipo Documento: ${tdo_id}?`" :active.sync="popupActivoEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del Tipo Documento: ${tdo_id}?`" :active.sync="popupActivoDesactivar">
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
            options1: [
                { text: '--Seleccione--', value: null },
                { text: 'Si', value: true },
                { text: 'No', value: false },
            ],
            TipoDocumento: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabTipoDocumento: {
                tdo_id: '',
                tdo_nombre: '',
                tdo_secuencial_Prolipa: '',
                tdo_secuencial_calmed: '',
                tdo_letra: '',
                tdo_estado: '',
                tdo_descripcion: '',
                updated_at: ''
            },
            Instituciones:[],
            cantidad:[],
            Asesores:[],
            tdo_id: 0,
            TipoDocumentoes: [],
            TipoDocumento_inactivos: [],
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
                this.TipoDocumento = [];
            }else if (newValue === '1') {
                this.TipoDocumento = [];
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getTipoDocumento();
    },
    methods: {            
        handleRadioInput(opcion) {
            // Vacía el array TipoDocumento cuando se selecciona la opción 'nombres'
            if (opcion === 'nombreInstitucion') {
                this.TipoDocumento = [];
            }
            else if(opcion === 'nombreAsesor'){
                this.TipoDocumento = [];
            }
        },
        getTipoDocumento() {
            let me = this;
            this.checkBox_mostraractivos = true;
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetTipoDocumento_todo')
            .then(res => {
            this.TipoDocumento = res.data;
            me.$vs.loading.close()
            })
            .catch(err => {
            console.log(err)
            me.$vs.loading.close()
            })
        },
        convertirAMayusculas() {
            this.tabTipoDocumento.tdo_letra = this.tabTipoDocumento.tdo_letra.toUpperCase();
        },
        getTipoDocumento_activos(){
            let me = this;
            this.busquedaxnombre = '';
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetTipoDocumento_activo')
            .then(res => {
                this.TipoDocumento = res.data;
                if(me.TipoDocumento.length === 0){
                    me.$vs.notify({
                        text: 'No hay asignaciones activas',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.TipoDocumento = [];
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
        getTipoDocumento_inactivos() {
            let me = this;
            this.busquedaxnombre = '';
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetTipoDocumento_Inactivo')
            .then(res => {
                this.TipoDocumento = res.data;
                if(me.TipoDocumento.length === 0){
                    me.$vs.notify({
                        text: 'No hay asignaciones inactivas',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.TipoDocumento = [];
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
        getTipoDocumentoParametro() {
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
                this.$http.get(this.$server_url+'GetTipoDocumentoParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxnombre)
                // this.$http.get(this.$server_url+'GetAsignacionesParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaInstitucion)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.TipoDocumento = res.data;
                    if(me.TipoDocumento.length === 0){
                        me.$vs.notify({
                            text: 'No hay coincidencias en la búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.TipoDocumento = [];
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
                    me.TipoDocumento = [];
                    me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
            }else{
                this.$http.get(this.$server_url+'GetTipoDocumentoParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.valorBusqueda)
                .then(function (res) {
                    me.TipoDocumento = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.TipoDocumento = [];
                    me.$vs.loading.close()
                })           
            }
            
        },              
        //SECCION GUARDAR NUEVO TIPO DOCUMENTO
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabTipoDocumento.tdo_id = ''
            this.tabTipoDocumento.tdo_nombre = ''
            this.tabTipoDocumento.tdo_secuencial_Prolipa = ''
            this.tabTipoDocumento.tdo_secuencial_calmed = ''
            this.tabTipoDocumento.tdo_letra = ''
            this.tabTipoDocumento.tdo_descripcion = ''
        },
        guardarnuevo() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (this.tabTipoDocumento.tdo_nombre === '' || this.tabTipoDocumento.tdo_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre del Tipo Documento antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabTipoDocumento.tdo_secuencial_Prolipa === '' || this.tabTipoDocumento.tdo_secuencial_Prolipa === null) {
                me.$vs.notify({
                    text: 'Escriba el secuencial prolipa del Tipo Documento antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabTipoDocumento.tdo_secuencial_calmed === '' || this.tabTipoDocumento.tdo_secuencial_calmed === null) {
                me.$vs.notify({
                    text: 'Escriba el secuencial calmed del Tipo Documento antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabTipoDocumento.tdo_letra === '' || this.tabTipoDocumento.tdo_letra === null) {
                me.$vs.notify({
                    text: 'Escriba la letra del Tipo Documento antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            // // Verificar si ya existe un registro con el mismo código de asesor-institución
            // let resultado = me.TipoDocumento.find(v => v.tdo_nombre == this.tabTipoDocumento.tdo_nombre);
            // if (resultado) {
            //     me.$vs.notify({
            //         text: 'Ya existe un registro de este tipo documento',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     });
            //     return;
            // }
            // //VALIDACION DE CAMPOS NULOS Y VACIOS            
            // if (this.tabTipoDocumento.tdo_nombre === '' || this.tabTipoDocumento.tdo_nombre === null) {
            //     me.$vs.notify({
            //         text: 'Escriba el nombre del Tipo Documento antes de guardar',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     });
            //     return;
            // }
            // if (this.tabTipoDocumento.tdo_secuencial === '' || this.tabTipoDocumento.tdo_secuencial === null) {
            //     me.$vs.notify({
            //         text: 'Escriba el secuencial del Tipo Documento antes de guardar',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     });
            //     return;
            // }
            // if (this.tabTipoDocumento.tdo_letra === '' || this.tabTipoDocumento.tdo_letra === null) {
            //     me.$vs.notify({
            //         text: 'Escriba la letra del Tipo Documento antes de guardar',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     });
            //     return;
            // }
            let datos  = {
                "tdo_id": this.tabTipoDocumento.tdo_id,
                "tdo_nombre": this.tabTipoDocumento.tdo_nombre,
                "tdo_secuencial_Prolipa": this.tabTipoDocumento.tdo_secuencial_Prolipa,
                "tdo_secuencial_calmed": this.tabTipoDocumento.tdo_secuencial_calmed,
                "tdo_letra": this.tabTipoDocumento.tdo_letra,
                "tdo_estado": this.tabTipoDocumento.tdo_estado,
                "tdo_descripcion": this.tabTipoDocumento.tdo_descripcion,
                "user_created": usuarioObjeto.idusuario,
            }
            me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url+'PostRegistrar_modificar_tipo_documento', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getTipoDocumento();
                me.$vs.notify({
                    text: 'Tipo Documento guardado con exito',
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
        this.popupActivoEditar = true
        this.tabTipoDocumento.tdo_id = tr.tdo_id
        this.tabTipoDocumento.tdo_nombre = tr.tdo_nombre
        this.tabTipoDocumento.tdo_secuencial_Prolipa = tr.tdo_secuencial_Prolipa
        this.tabTipoDocumento.tdo_secuencial_calmed = tr.tdo_secuencial_calmed
        this.tabTipoDocumento.tdo_letra = tr.tdo_letra
        this.tabTipoDocumento.tdo_descripcion = tr.tdo_descripcion
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (this.tabTipoDocumento.idInstitucion === '' || this.tabTipoDocumento.tdo_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre del Tipo Documento antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabTipoDocumento.tdo_secuencial_Prolipa === '' || this.tabTipoDocumento.tdo_secuencial_Prolipa === null) {
                me.$vs.notify({
                    text: 'Escriba el secuencial prolipa del Tipo Documento antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabTipoDocumento.tdo_secuencial_calmed === '' || this.tabTipoDocumento.tdo_secuencial_calmed === null) {
                me.$vs.notify({
                    text: 'Escriba el secuencial calmed del Tipo Documento antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabTipoDocumento.tdo_letra === '' || this.tabTipoDocumento.tdo_letra === null) {
                me.$vs.notify({
                    text: 'Escriba la letra del Tipo Documento antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos  = {                
                "tdo_id": this.tabTipoDocumento.tdo_id,
                "tdo_nombre": this.tabTipoDocumento.tdo_nombre,
                "tdo_secuencial_Prolipa": this.tabTipoDocumento.tdo_secuencial_Prolipa,
                "tdo_secuencial_calmed": this.tabTipoDocumento.tdo_secuencial_calmed,
                "tdo_letra": this.tabTipoDocumento.tdo_letra,
                "tdo_descripcion": this.tabTipoDocumento.tdo_descripcion,
                //"user_created": usuarioObjeto.idusuario,
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
        this.$http.post(this.$server_url+'PostRegistrar_modificar_tipo_documento', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getTipoDocumento();
                me.$vs.notify({
                    text: 'Tipo Documento editado con exito',
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
                        text: 'Tipo Documento no se pudo editar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
            })
        },
        popup_desactivar_activar_tdo(tr) {
            this.popupActivoDesactivar = true
            this.tdo_id = tr.tdo_id
            this.tabTipoDocumento.tdo_estado = tr.tdo_estado
        },
        desactivar_activar_tipo_documento() {
            let me = this;
            let valornuevo = this.tabTipoDocumento.tdo_estado;
            //console.log(valornuevo+'valornuevoeatdoprocutp'+this.tdo_id);
            if(valornuevo == 1){
                valornuevo = 0;
                let datos  = {
                    "tdo_id": this.tdo_id,
                    "tdo_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url+'Desactivar_tipo_documento', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getTipoDocumento();
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
                    "tdo_id": this.tdo_id,
                    "tdo_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url+'Desactivar_tipo_documento', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getTipoDocumento();
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
            this.tdo_id = tr.tdo_id
        },
        getEliminar() {
            let me = this;
            let datos  = {
                "tdo_id": this.tdo_id,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_tipo_documento", datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getTipoDocumento();
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