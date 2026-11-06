<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Material interior</vs-button>
            <!-- <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card>
                    <div>
                        <vs-input class="w-full" @keyup.enter="getMaterialinteriorParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxcodigo"/>
                    </div>
                    <div>
                        <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li>
                            <li style="margin:10px 20px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='codigopro'">Iniciales</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"  @input="busqueda='nombres'">Nombres</vs-radio>
                            </li>
                            <li>
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getMaterialinteriorParametro();" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col> -->
        </vs-row>
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <vs-table max-items="10" pagination search :data="Materialinterior_sinfiltro">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Materialinterior_sinfiltro.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th width="200">
                    Código
                </vs-th>
                <vs-th colspan="1" width="500">
                    Información Material interior
                </vs-th>
                <vs-th>Estado</vs-th>
                <vs-th width="100">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].mat_in_codigo">
                        {{ data[indextr].mat_in_codigo }}
                    </vs-td>
                    <vs-td>
                        <!-- {{ tr }} -->
                        <small><b>Nombre:</b> {{tr.mat_in_nombre}} </small><br>
                        <small><b>Gramaje:</b> {{tr.mat_in_gramaje}}</small><br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.mat_in_estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].mat_in_codigo">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.mat_in_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                    <!-- <vs-button color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button> -->
                                    <vs-button v-if="tr.mat_in_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_materialcubierta(tr)">Desactivar material interior</vs-button>
                                    <vs-button v-if="tr.mat_in_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_materialcubierta(tr)">Activar material interior</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" title="Registro nuevo material interior" :active.sync="popupActivoGuardar">
            <vs-row>
                <!-- {{ tabMaterialinterior }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Material interior</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Código del material interior " placeholder="Codigo" class="w-full" icon="mode_edit" v-model="tabMaterialinterior.mat_in_codigo" @input="convertirAMayusculas" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabMaterialinterior.mat_in_nombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="5">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Gramaje " placeholder="Gramaje" class="w-full" icon="mode_edit" v-model="tabMaterialinterior.mat_in_gramaje" @keypress="validarGramaje"/>
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
        <vs-popup class="editar" :title="`Edición material interior: ${tabMaterialinterior.mat_in_codigo}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabMaterialinterior }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Material cubierta</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabMaterialinterior.mat_in_nombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Gramaje " placeholder="Gramaje" class="w-full" icon="mode_edit" v-model="tabMaterialinterior.mat_in_gramaje" @keypress="validarGramaje" />
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
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${mat_in_codigo}?`" :active.sync="popupActivoEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del material interior: ${mat_in_codigo}?`" :active.sync="popupActivoDesactivar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="desactivar_activar_materialcubierta()" type="relief">Aceptar</vs-button>
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
            Materialinterior: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoEliminar: false,
            popupActivoDesactivar:  false,
            tabMaterialinterior: {
                mat_in_codigo: '',
                mat_in_nombre: '',
                mat_in_gramaje: '',
            },
            mat_in_codigo: 0,
            Materialinterior_sinfiltro: [],
            busquedaxcodigo: "",
            valorBusqueda:"0",
            //showAgregarNuevo: false,
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getMaterialinterior();
    },
    methods: {
        validarGramaje() {
            let gramaje = this.tabMaterialinterior.mat_in_gramaje;
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (gramaje.includes(',')) {
                gramaje = gramaje.replace(',', '.');
                this.tabMaterialinterior.mat_in_gramaje = gramaje;
            }
            // Validar el formato del número
            if (!/^\d{0,20}(\.\d{0,2})?$/.test(gramaje)) {
                this.tabMaterialinterior.mat_in_gramaje = '';
                console.log("reset");
            }
        },
        convertirAMayusculas() {
            // Convierte el valor a mayúsculas y actualiza el modelo
            this.tabMaterialinterior.mat_in_codigo = this.tabMaterialinterior.mat_in_codigo.toUpperCase();
        },
        getMaterialinterior() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'Get_Materialinterior')
            //axios.get(this.$apifacturacion_url + 'f_Producto')
            .then(res => {
            //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
            //this.Productos = resultado;
            this.Materialinterior_sinfiltro = res.data;
            me.$vs.loading.close()
            // console.log(this.Productos);
            // console.log(this.Grupos);
            })
            .catch(err => {
            console.log(err);
            me.$vs.loading.close()
            })
        },
        getMaterialinteriorParametro() {
            let me = this;
            //this.showAgregarNuevo = true;
            if(me.busquedaxcodigo.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            this.$http.get(this.$server_url+'Get_Material_interiorxFiltro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            .then(function (res) {
                me.Materialinterior = res.data;

                if(me.Materialinterior.length === 0){
                    me.$vs.notify({
                        text: 'No hay materiales interiores para esta búsqueda',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    me.Materialinterior = [];
                    me.$vs.loading.close()
                } else{
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
                        text: 'No hay material interior para esta búsqueda',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                me.Materialinterior = [];
                me.$vs.loading.close()
                } else {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                }
            })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabMaterialinterior.mat_in_codigo = ''
            this.tabMaterialinterior.mat_in_nombre = ''
            this.tabMaterialinterior.mat_in_gramaje = ''
        },
        guardarnuevo() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        let resultado = me.Materialinterior_sinfiltro.filter(v => v.mat_in_codigo == this.tabMaterialinterior.mat_in_codigo);
        if(resultado.length>0)
        {
            me.$vs.notify({
                text: 'Ya existe un registro con ese código de material interior',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            return;
        }
        //VALIDACION DE CAMPOS NULOS Y VACIOS
        if (this.tabMaterialinterior.mat_in_codigo === '' || this.tabMaterialinterior.mat_in_codigo === null) {
            me.$vs.notify({
                text: 'Escriba el código del Material interior antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            return;
        }
        let datos  = {
                "mat_in_codigo": this.tabMaterialinterior.mat_in_codigo,
                "mat_in_nombre": this.tabMaterialinterior.mat_in_nombre,
                "mat_in_gramaje": parseFloat(this.tabMaterialinterior.mat_in_gramaje),
                "user_created": usuarioObjeto.idusuario,
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
        this.$http.post(this.$server_url+'Post_Registrar_modificar_material_interior', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getMaterialinterior();
                me.$vs.notify({
                    text: 'Material interior guardado con exito',
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
                    text: 'Material interior no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        // getMaterialinterior() {
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
        getEditar(tr) {
        this.popupActivoEditar = true
        this.tabMaterialinterior.mat_in_codigo = tr.mat_in_codigo
        this.tabMaterialinterior.mat_in_nombre = tr.mat_in_nombre
        this.tabMaterialinterior.mat_in_gramaje = tr.mat_in_gramaje
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        me.$vs.loading()
        let datos  = {
                "mat_in_codigo": this.tabMaterialinterior.mat_in_codigo,
                "mat_in_nombre": this.tabMaterialinterior.mat_in_nombre,
                "mat_in_gramaje": parseFloat(this.tabMaterialinterior.mat_in_gramaje),
            }
        //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
        this.$http.post(this.$server_url+'Post_Registrar_modificar_material_interior', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getMaterialinterior();
                me.$vs.notify({
                    text: 'Material interior editado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(error => {
                console.log(error);
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Material interior no se pudo editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },

        getPreguntaEliminar(tr) {
            this.popupActivoEliminar = true
            this.mat_in_codigo = tr.mat_in_codigo
        },

        getEliminar() {
            let me = this;
            let datos  = {
                "mat_in_codigo": this.mat_in_codigo,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Post_Eliminar_material_interior", datos)
                .then(data => {
                    me.$vs.loading.close()
                    this.getMaterialinterior();
                    me.$vs.notify({
                        text: 'Material interior eliminado con exito',
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
                        text: 'Material interior no se pudo eliminar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },

        popup_desactivar_activar_materialcubierta(tr) {
            this.popupActivoDesactivar = true
            this.mat_in_codigo = tr.mat_in_codigo
            //this.tabMaterialinterior.mat_cub_nombre = tr.mat_cub_nombre
            this.tabMaterialinterior.mat_in_estado = tr.mat_in_estado
        },
        desactivar_activar_materialcubierta() {
        let me = this;
        let valornuevo = this.tabMaterialinterior.mat_in_estado;
        console.log(valornuevo+'valornuevoeatdoprocutp'+this.mat_in_codigo);
        if(valornuevo == 1){
            valornuevo = 0;
            let datos  = {
                "mat_in_codigo": this.mat_in_codigo,
                "mat_in_estado": valornuevo,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url+'Desactivar_Material_interior', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getMaterialinterior();
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
                "mat_in_codigo": this.mat_in_codigo,
                "mat_in_estado": valornuevo,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url+'Desactivar_Material_interior', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getMaterialinterior();
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