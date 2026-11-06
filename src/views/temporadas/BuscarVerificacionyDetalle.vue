<template>
    <div>
    <vs-card>
        <div align="center" style="font-size: 15px;"><b style="color: red">Un Detalle Venta tiene varios Detalle Verificaciones.</b></div>
        <div align="center" style="font-size: 15px;"><b style="color: red">La suma de las cantidades de todos los "Detalle Verificaciones" debe ser el total de cantidades del "Detalle Venta".</b></div>
        <div class="flex mb-4">
            <div style="width:65%;display:flex;">
                <table>
                    <tr style="width:80%;">
                        <td><span style="font-size: 15px;">Ingrese el contrato</span></td>
                        <td><font style="font-size: 15px">&nbsp;Seleccione el código del libro</font><br></td>
                    </tr>
                    <tr style="width:80%;">
                        <td><vs-input icon="search" style="width:100%;" placeholder="Contrato" v-model="busquedaxcontrato" /></td>
                        <td><v-select :options="Producto" :reduce="Producto => Producto.proCodigo" label="proCodigo" style="font-size: 14px" class="w-full h-100" placeholder="--Seleccione--" v-model="busquedaxcodigolibro" /></td>
                        <td><vs-button icon="search" class="ml-2" @click="getDetallesVentayVerificacion()" type="relief"></vs-button></td>
                    </tr>
                </table>
                <!-- <div style="width:50%;margin-left:10px;">
                    Elija un período
                    <vs-select class="w-full" v-model="busqueda">
                        <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item, index) in options1" />
                    </vs-select>
                </div> -->
            </div>
        </div>
    </vs-card>
    <vx-card fixed-height="true">
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <b>Detalle Venta</b>
        <vs-table max-items="10" pagination search :data="DetalleVenta">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ DetalleVenta.length }}</b></vs-chip>
            </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th style="width:20%;">
                    Id
                </vs-th>
                <vs-th style="width:60%;">
                    Información Detalle Venta
                </vs-th>
                <vs-th style="width:20%;">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].detVenCodigo">
                        {{ data[indextr].detVenCodigo }}
                    </vs-td>
                    <vs-td width="200">
                        <small><b>Contrato:</b> {{tr.venCodigo}} </small><br>
                        <small><b>Codigo Producto:</b> {{tr.proCodigo}}</small><br>
                        <small><b>Cantidad:</b> {{tr.detVenCantidad}}</small><br>
                        <small><b>Valor U:</b> {{tr.detVenValorU}} </small><br>
                        <small><b>Iva:</b> {{tr.detVenIva}}</small><br>
                        <small><b>Descontar:</b> 
                            <template v-if="data[indextr].detVenDescontar == 1">
                                Si
                            </template>
                            <template v-else-if="data[indextr].detVenDescontar == 0">
                                No
                            </template>
                        </small><br>
                        <small><b>Inicio:</b> 
                            <template v-if="data[indextr].detVenInicio == 1">
                                Si
                            </template>
                            <template v-else-if="data[indextr].detVenInicio == 0">
                                No
                            </template>
                        </small><br>
                        <small><b>Cantidad Real:</b> {{tr.detVenCantidadReal}}</small><br>
                    </vs-td>
                    <vs-td align="center">
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Editar" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="getEditarDventa(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`Edición Detalle Venta: ${tabDventa.venCodigo}`" :active.sync="popupActivoEditarDVENTA">
            <vs-row>
                <!-- {{ tabVenta }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Detalle Venta</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Cantidad Real *" placeholder="Cantidad Real" class="w-full" icon="mode_edit" v-model="tabDventa.detVenCantidadReal" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editarDVenta()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </vx-card>
    <vs-divider></vs-divider>
    <vx-card fixed-height="true">
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <b>Detalle Verificación</b>
        <vs-table max-items="10" pagination search :data="DetalleVerificacion">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ DetalleVerificacion.length }}</b></vs-chip>
            </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th style="width:20%;">
                    Id
                </vs-th>
                <vs-th style="width:60%;">
                    Información Detalle Verificación
                </vs-th>
                <vs-th style="width:20%;">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].detVerId">
                        {{ data[indextr].detVerId }}
                    </vs-td>
                    <vs-td width="200">
                        <small><b>Contrato:</b> {{tr.venCodigo}} </small><br>
                        <small><b>Codigo Producto:</b> {{tr.proCodigo}}</small><br>
                        <small><b>Cantidad:</b> {{tr.detVerCantidad}}</small><br>
                        <small><b># Verificacion:</b> {{tr.detVerVerificacion}}</small><br>
                        <small><b>Fecha:</b> {{tr.detVerFecha}}</small><br>
                    </vs-td>
                    <vs-td align="center">
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Editar" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="getEditarDverificacion(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Ver Detalles Venta y Documentos liquidación" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminarDVerificacion(tr)"></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`Edición Detalle Verificación: ${tabDVerificacion.venCodigo}`" :active.sync="popupActivoEditarDVERIFICACION">
            <vs-row>
                <!-- {{ tabVenta }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Detalle Verificación</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Cantidad *" placeholder="Cantidad" class="w-full" icon="mode_edit" v-model="tabDVerificacion.detVerCantidad" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editarDverificacion()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${venCodigo}?`" :active.sync="popupActivoEliminarDVERIFICACION">
                <!-- <div align="center" style="font-size: 40px"><b>{{ cliInsCodigo }}</b></div>  -->
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminarDverificacion()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </vx-card>
</div>
    </template>
    <style scoped>
    .hidden {
        display: none;
    }
    </style>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
export default {
    data() {
        return{
            DetalleVenta: [],
            DetalleVerificacion: [],     
            Producto: [],       
            popupActivoEditarDVENTA: false,
            popupActivoEditarDVERIFICACION: false,
            popupActivoEliminarDVERIFICACION: false,
            tabDventa: {
                venCodigo: '',
                proCodigo: '',
                detVenCodigo: '',
                detVenCantidadReal: '',
            },
            tabDVerificacion: {
                venCodigo: '',
                proCodigo: '',
                detVerId: '',
                detVerVerificacion: '',
                detVerCantidad: '',
            },
            detVenCodigo: 0,
            detVerId: 0,
            busquedaxcontrato: "",
            busquedaxcodigolibro: "",
            detVenCantidadRealAnterior: "",
            detVerCantidadAnterior: "",
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getProductocompleto();
        // this.getDetallesVentayVerificacion();
    },
    methods: {
        // getDetallesVentayVerificacion() {
        //     let me = this;
        //     axios.get(this.$apifacturacion_url + 'Venta')
        //     .then(res => {
        //     let resultado = res.data.venta.filter(v => v.venCodigo !== 0);
        //     this.Ventas = resultado;
        //     this.EstadoVenta = res.data.estadoventa;
        //     console.log(this.Ventas);
        //     console.log(this.EstadoVenta);
        //     })
        //     .catch(err => {
        //     console.log(err)
        //     })
        // },
        getDetallesVentayVerificacion() {
            //DETALLE_VENTA
            this.detVenCantidadRealAnterior = "";
            let me = this;
            if(me.busquedaxcontrato.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda en el contrato',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.busquedaxcodigolibro.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda en el código del libro',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading();
            //axios.get(this.$apifacturacion_url + 'f_Venta?codcontrato='+me.busquedaxcontrato+'&periodo='+me.busqueda)
            this.$http.get(this.$server_url+'Get_DVentaxvencodigoyprocodigo?ven_codigo='+me.busquedaxcontrato+'&pro_codigo='+me.busquedaxcodigolibro)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.DetalleVenta = res.data.detalle_venta;
                // me.filtroRegion();
                me.$vs.loading.close();
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
                console.log(error + ' error');
                me.$vs.loading.close()
            })
            me.$vs.loading();
            //DETALLE_VERIFICACION
            this.$http.get(this.$server_url+'Get_DVerificacionxvencodigoyprocodigo?ven_codigo='+me.busquedaxcontrato+'&pro_codigo='+me.busquedaxcodigolibro)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.DetalleVerificacion = res.data.getxvencodigoyprocodigo;
                // me.filtroRegion();
                me.$vs.loading.close();
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
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        getProductocompleto() {
            let me = this;
            this.$http.get(this.$server_url+'Get_Productocompleto')
            //axios.get(this.$apifacturacion_url + 'f_Producto')
            .then(res => {
            //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
            //this.Productos = resultado;
            this.Producto = res.data;
            // console.log(this.Productos);
            // console.log(this.Grupos);
            })
            .catch(err => {
            console.log(err)
            })
        },
        //*
        //DETALLE VENTA
        //*
        // getDetallesVentayVerificacion() {
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
        getEditarDventa(tr) {
        this.popupActivoEditarDVENTA = true
        this.tabDventa.detVenCodigo = tr.detVenCodigo
        this.tabDventa.venCodigo = tr.venCodigo
        this.tabDventa.proCodigo = tr.proCodigo
        this.tabDventa.detVenCantidadReal = tr.detVenCantidadReal
        this.detVenCantidadRealAnterior = tr.detVenCantidadReal
        // this.$router.push('/prueba/editar/' + this.id);
        //console.log(this.tabDventa.detVenCodigo);
        console.log(tr);
        console.log(this.detVenCantidadRealAnterior)
        // this.$params.id;
        },
        editarDVenta() {
        let me = this;
        let datos  = {
                "detVenCodigo": this.tabDventa.detVenCodigo,
                "venCodigo": this.tabDventa.venCodigo,
                "proCodigo": this.tabDventa.proCodigo,
                "detVenCantidadReal": this.tabDventa.detVenCantidadReal,
                "detVenCantidadRealAnterior": this.detVenCantidadRealAnterior,
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Venta', datos)
        this.$http.post(this.$server_url+'Post_EditarDetalleVentaxdet_ven_codigo?det_ven_codigo='+me.tabDventa.detVenCodigo, datos)
            .then(res => {
                me.$vs.loading.close()
                this.getDetallesVentayVerificacion();
                me.$vs.notify({
                    text: 'Venta editada con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditarDVENTA = false;
                this.popupActivoEditarDVERIFICACION = false;
                this.popupActivoEliminarDVERIFICACION = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Detalle de Venta no se pudo modificar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        //*
        //DETALLE VERIFICACION
        //*
        getEditarDverificacion(tr) {
        this.popupActivoEditarDVERIFICACION = true
        this.tabDVerificacion.detVerId = tr.detVerId
        this.tabDVerificacion.venCodigo = tr.venCodigo
        this.tabDVerificacion.proCodigo = tr.proCodigo
        this.tabDVerificacion.detVerVerificacion = tr.detVerVerificacion
        this.tabDVerificacion.detVerCantidad = tr.detVerCantidad
        this.detVerCantidadAnterior = tr.detVerCantidad
        // this.$router.push('/prueba/editar/' + this.id);
        console.log(tr);
        console.log(this.detVerCantidadAnterior);
        //console.log(tabDVerificacion.detVerId);
        // this.$params.id;
        },
        editarDverificacion() {
        let me = this;
        let datos  = {
                "detVerId": this.tabDVerificacion.detVerId,
                "venCodigo": this.tabDVerificacion.venCodigo,
                "proCodigo": this.tabDVerificacion.proCodigo,
                "detVerVerificacion": this.tabDVerificacion.detVerVerificacion,
                "detVerCantidad": this.tabDVerificacion.detVerCantidad,
                "detVerCantidadAnterior": this.detVerCantidadAnterior,
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Venta', datos)
        this.$http.post(this.$server_url+'Post_EditarDetalleVerificacionxdet_ver_id?det_ver_id='+me.tabDVerificacion.detVerId, datos)
            .then(res => {
                me.$vs.loading.close()
                this.getDetallesVentayVerificacion();
                me.$vs.notify({
                    text: 'Venta editada con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                
                this.popupActivoEditarDVENTA = false;
                this.popupActivoEditarDVERIFICACION = false;
                this.popupActivoEliminarDVERIFICACION = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Detalle de Verificación no se pudo modificar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },

        getPreguntaEliminarDVerificacion(tr) {
            this.popupActivoEliminarDVERIFICACION = true
            this.detVerId = tr.detVerId
            this.venCodigo = tr.venCodigo
            this.proCodigo = tr.proCodigo
            this.detVerVerificacion = tr.detVerVerificacion
            this.detVerCantidad = tr.detVerCantidad
            this.detVerCantidadAnterior = tr.detVerCantidad
            console.log(tr);
            console.log(this.detVerCantidad);
            //console.log(this.detVerId);
        },

        getEliminarDverificacion() {
            let me = this;
            let datos  = {
                "detVerId": this.detVerId,
                "venCodigo": this.venCodigo,
                "detVerVerificacion": this.detVerVerificacion,
                "proCodigo": this.proCodigo,
                "detVerCantidad": this.detVerCantidad,
                "detVerCantidadAnterior": this.detVerCantidadAnterior,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_ClienteInstitucion/DeleteClienteInstitucion?id=' + this.det_ver_id)
            this.$http.post(this.$server_url+'Post_DeleteDetalleVerificacionxdet_ver_id?det_ver_id=' + this.detVerId, datos)
            .then(data => {
                me.$vs.loading.close();
                this.getDetallesVentayVerificacion();
                me.$vs.notify({
                    text: 'Registro eliminado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditarDVENTA = false;
                this.popupActivoEditarDVERIFICACION = false;
                this.popupActivoEliminarDVERIFICACION = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Registro no se pudo eliminar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        
        getCancelar() {
            this.popupActivoEditarDVENTA = false;
            this.popupActivoEditarDVERIFICACION = false;
            this.popupActivoEliminarDVERIFICACION = false;
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