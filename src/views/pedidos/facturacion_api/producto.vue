<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card>
                    <div style="">
                        <vs-input class="w-full" @keyup.enter="getProductoParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxcodigo"/>
                    </div>
                    <div style="">
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
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getProductoParametro();" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <vs-table max-items="10" pagination search :data="Productos">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Productos.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Id
                </vs-th>
                <vs-th colspan="2">
                    Información Producto
                </vs-th>
                <vs-th>
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].proCodigo">
                        {{ data[indextr].proCodigo }}
                    </vs-td>
                    <vs-td>
                        <small><b>Grupo:</b> {{tr.gruProCodigoNavigation.gruProNombre}} </small><br>
                        <small><b>Nombres:</b> {{tr.proNombre}}</small><br>
                        <small><b>Descripción:</b> {{tr.proDescripcion}}</small><br>
                        <small><b>Iva:</b> 
                            <template v-if="data[indextr].proIva == true">
                            Si
                            </template>
                            <template v-else-if="data[indextr].proIva == false">
                                No
                            </template>
                            <template v-else-if="data[indextr].proIva == null">
                                Vacio
                            </template>    
                        </small><br>
                        <small><b>Valor:</b> {{tr.proValor}}</small><br>
                    </vs-td>
                    <vs-td>
                        <small><b>Descuento:</b> {{tr.proDescuento}}</small><br>
                        <small><b>Stock:</b> {{tr.proStock}}</small><br>
                        <small><b>Costo:</b> {{tr.proCosto}}</small><br>
                        <small><b>Peso:</b> {{tr.proPeso}}</small><br>
                    </vs-td>
                    <vs-td :data="data[indextr].proCodigo">
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditar(tr)"></vs-button>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`Edición producto: ${tabProducto.proCodigo}`" :active.sync="popupActivoEditar">
            <vs-row>
                {{ tabProducto }}
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Vendedor</b></vs-col>
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabProducto.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 11.5px">&nbsp;Grupo</font><br>
                            <v-select :options="Grupos" :reduce="Grupos => Grupos.gruProCodigo" label="gruProNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gruProCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.proNombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Descripción " placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabProducto.proDescripcion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <!-- <vs-input label="Iva *" type="number" placeholder="Iva" class="w-full" icon="mode_edit" v-model="tabProducto.proIva" /> -->
                            <vs-select label="Iva" class="w-full" v-model="tabProducto.proIva">
                                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="item,index in options1" />
                            </vs-select>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Valor " type="number" placeholder="Valor" class="w-full" icon="mode_edit" v-model="tabProducto.proValor" @keypress="validarValor" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 11.5px; display: inline-flex;">&nbsp;Descuento * &emsp; Formato: 0.00</font><br>
                            <vs-input type="number" id="pro-descuento-input" placeholder="Descuento" class="w-full" icon="mode_edit" v-model="tabProducto.proDescuento" @keypress="validarDescuento" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Stock " type="number" placeholder="Stock" class="w-full" icon="mode_edit" v-model="tabProducto.proStock" @keypress="validarStock" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Costo " type="number" placeholder="Costo" class="w-full" icon="mode_edit" v-model="tabProducto.proCosto" @keypress="validarCosto" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Peso " type="number" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabProducto.proPeso" @keypress="validarPeso"/>
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
            options1: [
                { text: '--Seleccione--', value: null },
                { text: 'Si', value: true },
                { text: 'No', value: false },
            ],
            Productos: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            tabProducto: {
                proCodigo: '',
                gruProCodigo: '',
                proNombre: '',
                proDescripcion: '',
                proIva: '',
                proValor: '',
                proDescuento: '',
                proStock: '',
                proCosto: '',
                proPeso: ''
            },
            proCodigo: 0,
            Grupos: [],
            busquedaxcodigo: "",
            valorBusqueda:"0",
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getProducto();
    },
    methods: {
        validarDescuento() {
            const descuento = this.tabProducto.proDescuento;
            if (/^\d/.test(descuento)) { // si comienza con un dígito
             if (!/^\d{0,1}(\.\d{1,5})?$/.test(descuento)) {
                this.tabProducto.proDescuento = '';
                }
            } else if (/^[,.e]/.test(descuento)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(descuento)) {
                this.tabProducto.proDescuento = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proDescuento = '';
            }
        },
        validarValor() {
            const valor = this.tabProducto.proValor;
            if (/^\d/.test(valor)) { // si comienza con un dígito
             if (!/^\d{0,18}(\.\d{1,5})?$/.test(valor)) {
                this.tabProducto.proValor = '';
                }
            } else if (/^[,.e]/.test(valor)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(valor)) {
                this.tabProducto.proValor = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proValor = '';
            }
        },
        validarStock() {
            let stock = this.tabProducto.proStock;
            if (!/^\d+$/.test(stock) || isNaN(stock)) {
                this.tabProducto.proStock = '';
            }
        },
        validarCosto() {
            const costo = this.tabProducto.proCosto;
            if (/^\d/.test(costo)) { // si comienza con un dígito
             if (!/^\d{0,18}(\.\d{1,5})?$/.test(costo)) {
                this.tabProducto.proCosto = '';
                }
            } else if (/^[,.e]/.test(costo)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(costo)) {
                this.tabProducto.proCosto = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proCosto = '';
            }
        },
        validarPeso() {
            const peso = this.tabProducto.proPeso;
            if (/^\d/.test(peso)) { // si comienza con un dígito
             if (!/^\d{0,15}(\.\d{1,5})?$/.test(peso)) {
                this.tabProducto.proPeso = '';
                }
            } else if (/^[,.e]/.test(peso)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(peso)) {
                this.tabProducto.proPeso = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proPeso = '';
            }
        },
        getProducto() {
            let me = this;
            this.$http.get(this.$server_url+'Get_Producto')
            //axios.get(this.$apifacturacion_url + 'f_Producto')
            .then(res => {
            //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
            //this.Productos = resultado;
            this.Grupos = res.data.grupos;
            // console.log(this.Productos);
            // console.log(this.Grupos);
            })
            .catch(err => {
            console.log(err)
            })
        },
        getProductoParametro() {
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
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            this.$http.get(this.$server_url+'Get_Productoxbusquedayrazonbusqueda?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            .then(function (res) {
                // me.tmpVenta = res.data;
                // let resultado = res.data.filter(c => c.cliCi !== 0);
                me.Productos = res.data;
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
                        text: 'No hay productos para esta búsqueda',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                me.Productos = [];
                me.$vs.loading.close()
                } else {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                }
            })
        },
        // getProducto() {
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
        this.tabProducto.proCodigo = tr.proCodigo
        this.tabProducto.gruProCodigo = tr.gruProCodigo
        this.tabProducto.proNombre = tr.proNombre
        this.tabProducto.proDescripcion = tr.proDescripcion
        this.tabProducto.proIva = tr.proIva
        this.tabProducto.proValor = tr.proValor
        this.tabProducto.proDescuento = tr.proDescuento
        this.tabProducto.proStock = tr.proStock
        this.tabProducto.proCosto = tr.proCosto
        this.tabProducto.proPeso = tr.proPeso
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        if (this.tabProducto.proCodigo === '' || this.tabProducto.proCodigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Vendedor antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProducto.gruProCodigo === '' || this.tabProducto.gruProCodigo === null) {
                me.$vs.notify({
                    text: 'Seleccione un grupo antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "proCodigo": this.tabProducto.proCodigo,
                "gruProCodigo": this.tabProducto.gruProCodigo,
                "proNombre": this.tabProducto.proNombre,
                "proDescripcion": this.tabProducto.proDescripcion,
                "proIva": this.tabProducto.proIva,
                "proValor": parseFloat(this.tabProducto.proValor),
                "proDescuento": parseFloat(this.tabProducto.proDescuento),
                "proStock": parseInt(this.tabProducto.proStock),
                "proCosto": parseFloat(this.tabProducto.proCosto),
                "proPeso": parseFloat(this.tabProducto.proPeso)
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
        this.$http.post(this.$server_url+'Post_ProductoEditar', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getProductoParametro();
                me.$vs.notify({
                    text: 'Producto editado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(error => {
                if (error.response && error.response.status === 500) {
                    me.$vs.notify({
                        text: 'Revise los campos Valor, Descuento que esten en el formato correcto',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                console.log('Cambie el valor del prodescuento a uno válido');
                me.$vs.loading.close()
                } else {
                console.log(error);
                me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Producto no se pudo editar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
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