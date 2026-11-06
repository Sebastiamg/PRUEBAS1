<template>
    <div>
    <vs-card>
        <div class="flex mb-4">
            <div style="width:65%;display:flex;">
                <table>
                    <tr style="width:80%;">
                        <td><span style="font-size: 15px;">Ingrese el contrato</span></td>
                    </tr>
                    <tr style="width:80%;">
                        <td><vs-input icon="search" style="width:100%;" placeholder="Contrato" @keyup.enter="getDetallesVentayVerificacion()" v-model="busquedaxcontrato" /></td>
                        <td><vs-button icon="search" class="ml-2" @click="getDetallesVentayVerificacion()" type="relief"></vs-button></td>
                    </tr>
                </table>
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
                <vs-th>
                    Contrato
                </vs-th>
                <vs-th style="width:50%;">
                    Información Detalle Venta
                </vs-th>
                <vs-th style="width:20%;">
                    Estado
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].vencodigo">
                        {{ data[indextr].vencodigo }}
                    </vs-td>
                    <vs-td width="200">
                        <small><b>Codigo Producto:</b> {{tr.procodigo}}</small><br>
                        <small><b>Cantidad Anterior:</b> {{tr.cantidadanterior}}</small><br>
                        <small><b>Cantidad Actual:</b> {{tr.cantidadactual}} </small><br>
                        <small><b>Fecha de historico:</b> {{tr.created_at}} </small><br>
                    </vs-td>
                    <vs-td>
                        <template v-if="data[indextr].accion == 1">
                            Actualizado
                        </template>
                        <template v-else-if="data[indextr].accion == 2">
                            Eliminado
                        </template>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
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
                <vs-th>
                    Contrato
                </vs-th>
                <vs-th style="width:50%;">
                    Información Detalle Verificación
                </vs-th>
                <vs-th style="width:20%;">
                    Estado
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].vencodigo">
                        {{ data[indextr].vencodigo }}
                    </vs-td>
                    <vs-td width="200">
                        <small><b>Codigo Producto:</b> {{tr.procodigo}}</small><br>
                        <small><b># Verificacion:</b> {{tr.numverificacion}}</small><br>
                        <small><b>Cantidad Anterior:</b> {{tr.cantidadanterior}}</small><br>
                        <small><b>Cantidad Actual:</b> {{tr.cantidadactual}} </small><br>
                        <small><b>Fecha de historico:</b> {{tr.created_at}} </small><br>
                    </vs-td>
                    <vs-td>
                        <template v-if="data[indextr].accion == 1">
                            Actualizado
                        </template>
                        <template v-else-if="data[indextr].accion == 2">
                            Eliminado
                        </template>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
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
            options1: [
                { text: '--Seleccione--', value: 0 || null },
                { text: 'Contrato Costa 20', value: 'C-C20' },
                { text: 'Contrato Costa 21', value: 'C-C21' },
                { text: 'Contrato Costa 22', value: 'C-C22' },
                { text: 'Contrato Costa 23', value: 'C-C23' },
                { text: 'Contrato Sierra 20', value: 'C-S20' },
                { text: 'Contrato Sierra 21', value: 'C-S21' },
                { text: 'Contrato Sierra 22', value: 'C-S22' },
                { text: 'Contrato Sierra 23', value: 'C-S23' },
            ],
            DetalleVenta: [],
            DetalleVerificacion: [],            
            popupActivoEditarDVENTA: false,
            popupActivoEditarDVERIFICACION: false,
            popupActivoEliminarDVERIFICACION: false,
            tabDventa: {
                detVenCodigo: '',
                detVenCantidadReal: '',
            },
            tabDVerificacion: {
                detVerId: '',
                detVerCantidad: '',
            },
            detVenCodigo: 0,
            detVerId: 0,
            busquedaxcontrato: "",
            busquedaxcodigolibro: "",
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
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
            let me = this;
            if(me.busquedaxcontrato.length < 2){
                me.$vs.notify({
                text:'Minimo 2 caracteres de busqueda en el contrato',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Venta?codcontrato='+me.busquedaxcontrato+'&periodo='+me.busqueda)
            this.$http.get(this.$server_url+'dventaxvencodigo/'+me.busquedaxcontrato)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.DetalleVenta = res.data.DetalleVenta;
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
                me.$vs.loading.close();
                me.DetalleVenta = [];
                if(res.data.message){
                    me.$vs.notify({
                    text: 'No hay historico de detalles de venta para ese contrato',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                }
            })
            //HISTORICO DETALLE VERIFICACION
            this.$http.get(this.$server_url+'dverificacionxvencodigo/'+me.busquedaxcontrato)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.DetalleVerificacion = res.data.DetalleVerificacion;
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
                me.$vs.loading.close();
                me.DetalleVerificacion =[];
                if(res.data.message){
                    me.$vs.notify({
                    text: 'No hay historico de detalles de verificación para ese contrato',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                }
            })
        },
        //*
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