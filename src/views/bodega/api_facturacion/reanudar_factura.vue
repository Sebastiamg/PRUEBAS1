<template>
    <div>
    <vs-card>
        <div class="mb-4">
            <div style="width:100%;display:block;">
                <div class="row">
                    <table>
                        <tr style="width:80%;">
                            <td><span style="font-size: 15px;">Ingrese el número de factura</span></td>
                        </tr>
                        <tr style="width:80%;">
                            <td><vs-input icon="search" style="width:100%;" placeholder="Número factura" v-model="busquedaxfactura" @keyup.enter="getFacturas()" /></td>
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
        <b>Factura/s Servidor 1</b>
        <vs-table max-items="10" pagination search :data="FacturasS4">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ FacturasS4.length }}</b></vs-chip>
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
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Limpiar Remisión y Fecha Remisión" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="getPreguntaEditarFacturaS4(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`¿Confirma que desea limpiar los campos de Remisión y Fecha remisión de la factura: ${venCodigo}?`" :active.sync="popupActivoEditarFacturaS4">
                <!-- <div align="center" style="font-size: 40px"><b>{{ cliInsCodigo }}</b></div>  -->
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="FacturavaciarcamposS4()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </vx-card>
    <vs-divider></vs-divider>
    <vx-card fixed-height="true">
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <b>Factura/s Servidor 2</b>
        <vs-table max-items="10" pagination search :data="FacturasS1">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ FacturasS1.length }}</b></vs-chip>
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
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Limpiar Remisión y Fecha Remisión" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="getPreguntaEditarFacturaS1(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`¿Confirma que desea limpiar los campos de Remisión y Fecha remisión de la factura: ${venCodigo}?`" :active.sync="popupActivoEditarFacturaS1">
                <!-- <div align="center" style="font-size: 40px"><b>{{ cliInsCodigo }}</b></div>  -->
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="FacturavaciarcamposS1()" type="relief">Aceptar</vs-button>
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
            FacturasS4: [],
            FacturasS1: [],
            popupActivoEditarFacturaS4: false,
            popupActivoEditarFacturaS1: false,
            venCodigo: 0,
            busquedaxfactura: null,
            chkControlRadio:false,
            radioButtonsDisabled: true // Control de habilitación/deshabilitación
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
        getFacturas() {
            //DETALLE_VENTA
            let me = this;
            me.FacturasS4 = [];
            me.FacturasS1 = [];
            if(me.busquedaxfactura == null){
                me.$vs.notify({
                text:'Debe ingresar un número de factura',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.getFacturasSERVER_10_10_1_4();
            me.getFacturasSERVER_10_10_1_1();
        },
        getFacturasSERVER_10_10_1_4(){
            let me = this;
            me.$vs.loading();
            //axios.get(this.$apifacturacion_url + 'f_Venta?codcontrato='+me.busquedaxfactura+'&periodo='+me.busqueda)
            this.$http.get(this.$server_url+'Get_Ventaxfacturabase10_10_1_4?ven_codigo='+me.busquedaxfactura)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.FacturasS4 = res.data.ventaxvencodigo || [];
                // me.filtroRegion();
                if(res.data.message){
                    me.$vs.notify({
                    text: "No se encontro registros",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                }
                me.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        getFacturasSERVER_10_10_1_1(){
            let me = this;
            this.$http.get(this.$server_url+'Get_Ventaxfacturabase10_10_1_1?ven_codigo='+me.busquedaxfactura)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.FacturasS1 = res.data.ventaxvencodigo || [];
                // me.filtroRegion();
                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                }
                me.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
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
        getPreguntaEditarFacturaS4(tr) {
            this.popupActivoEditarFacturaS4 = true
            this.venCodigo = tr.venCodigo
            console.log(tr);
            //console.log(this.detVerId);
        },
        FacturavaciarcamposS4() {
            let me = this;
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_ClienteInstitucion/DeleteClienteInstitucion?id=' + this.det_ver_id)
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
                this.popupActivoEditarFacturaS4 = false;
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
        getPreguntaEditarFacturaS1(tr) {
            this.popupActivoEditarFacturaS1 = true
            this.venCodigo = tr.venCodigo
            console.log(tr);
            //console.log(this.detVerId);
        },
        FacturavaciarcamposS1() {
            let me = this;
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_ClienteInstitucion/DeleteClienteInstitucion?id=' + this.det_ver_id)
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
                this.popupActivoEditarFacturaS1 = false;
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
            this.popupActivoEditarFacturaS1 = false;
            this.popupActivoEditarFacturaS4 = false;
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