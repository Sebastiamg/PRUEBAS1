<template>
    <div>
    <vs-card>
        <div class="mb-4">
            <div style="width:100%;" align="center">
                <div class="row">
                    <table>
                        <tr style="width:100%;">
                            <td><span style="font-size: 15px;"><b style="color: red">Elija la base en la que desea buscar la factura</b></span></td>
                        </tr>
                        <tr>
                            <td align="center">
                                <vs-switch color="success" class="mr-2 position: relative" style="max-width: 100%;" v-model="chkControlRadio">
                                    <span slot="on"><b style="font-size: 13px;">Habilitado</b></span>
                                    <span slot="off"><b style="font-size: 13px;">Deshabilitado</b></span>
                                </vs-switch>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <ul class="centerx" style="display:flex;">
                                    <li style="margin:10px 20px 0px 0px;">
                                        <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='iniciales'" :disabled="radioButtonsDisabled"><b style="font-size: 16px;">10.10.1.4</b></vs-radio>
                                    </li>
                                    <li style="margin:10px 10px 0px 0px;">
                                        <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"  @input="busqueda='nombres'" :disabled="radioButtonsDisabled"><b style="font-size: 16px;">10.10.1.1</b></vs-radio>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>   
            <div style="width:100%;display:block;">
                <div class="row">
                    <table>
                        <tr style="width:80%;">
                            <td><span style="font-size: 15px;">Ingrese el número de factura</span></td>
                        </tr>
                        <tr style="width:80%;">
                            <td><vs-input icon="search" style="width:100%;" placeholder="Número factura" v-model="busquedaxfactura" /></td>
                            <td><vs-button icon="search" class="ml-2" @click="getFacturas()" type="relief"></vs-button></td>
                        </tr>
                    </table>
                </div>
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
        <b>Factura</b>
        <vs-table max-items="10" pagination search :data="Facturas">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ Facturas.length }}</b></vs-chip>
            </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th style="width:20%;">
                    # Factura
                </vs-th>
                <vs-th style="width:60%;">
                    Información Factura
                </vs-th>
                <vs-th style="width:20%;">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].venCodigo">
                        {{ data[indextr].venCodigo }}
                    </vs-td>
                    <vs-td width="200">
                        <small><b>Tipo de venta:</b> {{tr.tipVenNombre}} </small><br>
                        <small><b>Observación:</b> {{tr.detVenCantidad}}</small><br>
                        <small><b>Valor venta:</b> {{tr.venValor}} </small><br>
                        <small><b>Remisión:</b> {{tr.venRemision}}</small><br>
                        <small><b>Fecha Remisión:</b> {{tr.venFechRemision}}</small><br>
                    </vs-td>
                    <vs-td align="center">
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Editar" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="getPreguntaEditarFactura(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`¿Confirma que desea limpiar los campos de Remisión y Fecha remisión de la factura: ${venCodigo}?`" :active.sync="popupActivoEditarFactura">
                <!-- <div align="center" style="font-size: 40px"><b>{{ cliInsCodigo }}</b></div>  -->
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="Facturavaciarcampos()" type="relief">Aceptar</vs-button>
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
            Facturas: [],
            popupActivoEditarFactura: false,
            venCodigo: 0,
            busquedaxfactura: "",
            valorBusqueda:"0",
            chkControlRadio:false,
            radioButtonsDisabled: true // Control de habilitación/deshabilitación
        }
    },
    watch: {
        chkControlRadio: function (newVal) {
            let me = this;
            if (newVal) {
                // Este código se ejecuta cuando chkControlRadio se activa (true)
                me.radioButtonsDisabled = false; // Deshabilitar los radio buttons
                me.busquedaxfactura = '';
                me.Facturas = [];
            }
            me.radioButtonsDisabled = !newVal; // Habilitar o deshabilitar los radio buttons
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        //this.getProductocompleto();
        // this.getFacturas();
    },
    methods: {
        controlRadiobutton(){
            let me = this;
            this.chkControlRadio = false;
            //this.radioButtonsDisabled = false; // Deshabilitar los radio buttons
        },
        getFacturas() {
            //DETALLE_VENTA
            let me = this;
            console.log("valor de la busqueda en radio button",me.valorBusqueda);
            if(me.busquedaxfactura.length == null){
                me.$vs.notify({
                text:'Debe ingresar un número de factura',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading();
            //axios.get(this.$apifacturacion_url + 'f_Venta?codcontrato='+me.busquedaxfactura+'&periodo='+me.busqueda)
            if(this.valorBusqueda == 0){
                console.log("entro en 10.10.1.4");
                this.controlRadiobutton();
                this.$http.get(this.$server_url+'Get_Ventaxfacturabase10_10_1_4?ven_codigo='+me.busquedaxfactura)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    me.Facturas = res.data.ventaxvencodigo;
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
            }
            else if(this.valorBusqueda == 1){
                console.log("entro en 10.10.1.1");
                this.controlRadiobutton();
                this.$http.get(this.$server_url+'Get_Ventaxfacturabase10_10_1_1?ven_codigo='+me.busquedaxfactura)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    me.Facturas = res.data.ventaxvencodigo;
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
            }
        },
        //*
        //DETALLE VENTA
        //*
        // getFacturas() {
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
        getPreguntaEditarFactura(tr) {
            this.popupActivoEditarFactura = true
            this.venCodigo = tr.venCodigo
            this.
            console.log(tr);
            //console.log(this.detVerId);
        },

        Facturavaciarcampos() {
            let me = this;
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_ClienteInstitucion/DeleteClienteInstitucion?id=' + this.det_ver_id)
            if (this.valorBusqueda == 0) {
                this.$http.post(this.$server_url+'Post_EditarVentaxFactura10_10_1_4?ven_codigo=' + this.venCodigo)
                .then(data => {
                    me.$vs.loading.close();
                    this.getFacturas();
                    me.$vs.notify({
                        text: 'Registro limpiado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEditarFactura = false;
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
            }
            else if(this.valorBusqueda == 1){
                this.$http.post(this.$server_url+'Post_EditarVentaxFactura10_10_1_1?ven_codigo=' + this.venCodigo)
                .then(data => {
                    me.$vs.loading.close();
                    this.getFacturas();
                    me.$vs.notify({
                        text: 'Registro limpiado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEditarFactura = false;
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
            }
        },
        
        getCancelar() {
            this.popupActivoEditarFactura = false;
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