<template>
    <vx-card fixed-height="true">
        <vs-row vs-justify="flex-start">
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Búsqueda por filtros</p>
                <br>
                <vs-card>
                    <div style="">
                        <vs-input class="w-full" @keyup.enter="getClienteInstitucionParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Buscar" v-model="busquedaxcodigo"/>
                    </div>
                    <div style="">
                        <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda"  @input="busqueda='bclienteinsid'">Id</vs-radio>
                            </li>
                            <li style="margin:10px 20px 0px 0px;">
                                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="busqueda='bcedulacliente'">Cédula Cliente</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                                <vs-radio vs-name="radios3" vs-value="3" v-model="valorBusqueda"  @input="busqueda='binscodigo'">Id Institución</vs-radio>
                            </li>
                            <li>
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getClienteInstitucionParametro();" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Cliente</vs-button> -->
        <vs-table max-items="10" pagination search :data="CliIns">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ CliIns.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Id
                </vs-th>
                <vs-th colspan="2">
                    Información Cliente - Institución
                </vs-th>
                <vs-th>
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].cliInsCodigo">
                        {{ data[indextr].cliInsCodigo }}
                    </vs-td>
                    <vs-td>
                        <small><b>Id Institución:</b> {{tr.insCodigo}}</small><br>
                        <small><b>Institución:</b> {{tr.insCodigoNavigation.insNombre}}</small><br>
                        <small><b>Código Vendedor:</b> {{tr.venDCodigo}}</small><br>
                    </vs-td>
                    <vs-td>
                        <small><b>Cédula Cliente:</b> {{tr.cliCi}} </small><br>
                        <small><b>Nombres Cliente:</b> {{tr.cliCiNavigation.cliNombres}}</small><br>
                    </vs-td>
                    <vs-td :data="data[indextr].cliInsCodigo">
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditar(tr)"></vs-button> -->
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${cliInsCodigo}?`" :active.sync="popupActivoEliminar">
            <!-- <div align="center" style="font-size: 40px"><b>{{ cliInsCodigo }}</b></div>  -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
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
export default {
    data() {
        return{
            CliIns: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoEliminar: false,
            cliInsCodigo: 0,
            busquedaxcodigo: "",
            valorBusqueda:"0",
        }
    },
    mounted() {
        this.getCliente();
    },
    methods: {
        /*
        getCliente() {
            let me = this;
            //axios.get(this.$apifacturacion_url + 'f_ClienteInstitucion')
            this.$http.get(this.$server_url+'Get_Cliente_Institucion')
            .then(res => {
            let resultado = res.data.clienteinstitucion.filter(c => c.cliInsCodigo !== 0);
            this.CliIns = resultado;
            })
            .catch(err => {
            console.log(err)
            })
        },
        */
        getClienteInstitucionParametro() {
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
            //axios.get(this.$apifacturacion_url + 'f_ClienteInstitucion/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            this.$http.get(this.$server_url+'Get_ClienteInstitucionxbusquedayrazonbusqueda?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            .then(function (res) {
                // me.tmpVenta = res.data;
                // let resultado = res.data.filter(c => c.cliCi !== 0);
                me.CliIns = res.data;
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
                me.CliIns = []; // Asignar un arreglo vacío para vaciar la lista de registros
                me.$vs.loading.close()
                } else {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                }
            })
        },
        // getCliente() {
        // axios.get('https://localhost:7252/api/Cliente')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.CliIns = resultado;
        //     console.log(this.CliIns);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getPreguntaEliminar(tr) {
            this.cliInsCodigo = tr.cliInsCodigo
            this.popupActivoEliminar = true
            //console.log(this.caf_id);
        },
        getEliminar() {
            let me = this;
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_ClienteInstitucion/DeleteClienteInstitucion?id=' + this.cliInsCodigo)
            this.$http.post(this.$server_url+'Delete_Cliente_Institucion?id=' + this.cliInsCodigo)
            .then(data => {
                me.$vs.loading.close()
                this.getCliente();
                me.$vs.notify({
                    text: 'Registro eliminado con exito',
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
                    text: 'Registro no se pudo eliminar',
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
    //     axios.get(url).then((response) => this.CliIns = response.data);
    //     // fetch("https://localhost:7252/api/Cliente/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.CliIns = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>