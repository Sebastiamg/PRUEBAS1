<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Grupo Producto</vs-button>
        </vs-row>
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <vs-table max-items="10" pagination search :data="GrupoProductos">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ GrupoProductos.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th width="200">
                    Id
                </vs-th>
                <vs-th colspan="1" width="400">
                    Nombre
                </vs-th>
                <vs-th width="150">Estado</vs-th>
                <vs-th width="200">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].gru_pro_codigo">
                        {{ data[indextr].gru_pro_codigo }}
                    </vs-td>
                    <vs-td>
                        <!-- {{ tr }} -->
                        {{tr.gru_pro_nombre}} <br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.gru_pro_estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].gru_pro_codigo">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.gru_pro_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                    <vs-button v-if="tr.gru_pro_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_producto(tr)">Desactivar grupo producto</vs-button>
                                    <vs-button v-if="tr.gru_pro_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_producto(tr)">Activar grupo producto</vs-button>
                                    <!-- <vs-button color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button> -->
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- SECCION REGISTRO -->
        <vs-popup class="crear" title="Registro nuevo grupo de producto" :active.sync="popupActivoGuardar">
            <vs-row>
                <!-- {{ tabGrupoProducto }} -->
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabGrupoProducto.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre de grupo de producto " placeholder="Nombre de grupo de producto" class="w-full" icon="mode_edit" v-model="tabGrupoProducto.gru_pro_nombre" />
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
        <vs-popup class="editar" :title="`Edición producto: ${tabGrupoProducto.gru_pro_codigo}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabGrupoProducto }} -->
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabGrupoProducto.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre de grupo de producto " placeholder="Nombre de grupo de producto" class="w-full" icon="mode_edit" v-model="tabGrupoProducto.gru_pro_nombre" />
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
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${gru_pro_codigo}?`" :active.sync="popupActivoEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del grupo de producto: ${tabGrupoProducto.gru_pro_nombre}?`" :active.sync="popupActivoDesactivar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="desactivar_activar_producto()" type="relief">Aceptar</vs-button>
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
            GrupoProductos: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabGrupoProducto: {
                gru_pro_codigo: '',
                gru_pro_nombre: '',
                gru_pro_estado: '',
            },
            gru_pro_codigo: 0,
            Producto_sinfiltro: [],
            Producto_inactivos: [],
            busquedaxcodigo: "",
            valorBusqueda:"0",
            checkBox_mostrarinactivos:false,
            //showAgregarNuevo: false,
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getGrupoProducto();
    },
    methods: {
        getGrupoProducto() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetGrupoProducto_todo')
            //axios.get(this.$apifacturacion_url + 'f_Producto')
            .then(res => {
            //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
            //this.Productos = resultado;
            this.GrupoProductos = res.data;
            me.$vs.loading.close()
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close()
            })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabGrupoProducto.gru_pro_codigo = ''
            this.tabGrupoProducto.gru_pro_nombre = ''
            this.tabGrupoProducto.gru_pro_estado = ''
        },
        guardarnuevo() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        //VALIDACION DE CAMPOS NULOS Y VACIOS
        if (this.tabGrupoProducto.gru_pro_nombre === '' || this.tabGrupoProducto.gru_pro_nombre === null) {
            me.$vs.notify({
                text: 'Escriba el nombre del grupo del producto antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            return;
        }
        let datos  = {
            "gru_pro_nombre": this.tabGrupoProducto.gru_pro_nombre,
            "user_created": usuarioObjeto.idusuario,
        }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
        this.$http.post(this.$server_url+'PostGrupoProducto_Registrar_modificar', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getGrupoProducto();
                me.$vs.notify({
                    text: 'Grupo Producto guardado con exito',
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
                    text: 'Grupo Producto no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        // getGrupoProducto() {
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
        this.tabGrupoProducto.gru_pro_codigo = tr.gru_pro_codigo
        this.tabGrupoProducto.gru_pro_nombre = tr.gru_pro_nombre
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        if (this.tabGrupoProducto.gru_pro_nombre === '' || this.tabGrupoProducto.gru_pro_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre del grupo del producto antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "gru_pro_codigo": this.tabGrupoProducto.gru_pro_codigo,
                "gru_pro_nombre": this.tabGrupoProducto.gru_pro_nombre,
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
        this.$http.post(this.$server_url+'PostGrupoProducto_Registrar_modificar', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getGrupoProducto();
                me.$vs.notify({
                    text: 'Grupo Producto editado con exito',
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
                    text: 'Grupo Producto no se pudo editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        popup_desactivar_activar_producto(tr) {
            this.popupActivoDesactivar = true
            this.gru_pro_codigo = tr.gru_pro_codigo
            this.tabGrupoProducto.gru_pro_nombre = tr.gru_pro_nombre
            this.tabGrupoProducto.gru_pro_estado = tr.gru_pro_estado
        },
        desactivar_activar_producto() {
        let me = this;
        let valornuevo = this.tabGrupoProducto.gru_pro_estado;
        console.log(valornuevo+'valornuevoeatdoprocutp'+this.gru_pro_codigo);
        if(valornuevo == 1){
            valornuevo = 0;
            let datos  = {
                "gru_pro_codigo": this.gru_pro_codigo,
                "gru_pro_estado": valornuevo,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url+'Desactivar_GrupoProducto', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getGrupoProducto();
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
                "gru_pro_codigo": this.gru_pro_codigo,
                "gru_pro_estado": valornuevo,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url+'Desactivar_GrupoProducto', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getGrupoProducto();
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
            this.pro_codigo = tr.pro_codigo
        },

        getEliminar() {
            let me = this;
            let datos  = {
                "pro_codigo": this.pro_codigo,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_producto", datos)
                .then(data => {
                    me.$vs.loading.close()
                    this.getGrupoProducto();
                    this.getProductoParametro();
                    me.$vs.notify({
                        text: 'Producto eliminado con exito',
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
                        text: 'Producto no se pudo eliminar',
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