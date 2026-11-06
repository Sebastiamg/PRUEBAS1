<template>
    <vx-card fixed-height="true">
        <!-- <vs-row vs-justify="flex-start">            
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Filtro de pedidos por período</p>
                <br>
                <vs-card class="seccionmostrartodo">
                    <div>
                        <div  vs-lg="12" vs-sm="12" vs-xs="12" align="left">                                                            
                                <div style="font-size: 12px; ">Instituciones: </div>
                                <v-select class="mb-4 w-full" placeholder="--Seleccione--" v-model="valorBusqueda" :options="Instituciones" label="nombreInstitucion" :reduce="Instituciones => Instituciones.nombreInstitucion" @input="getInstitucionParametro();" />
                        </div>
                        <div vs-lg="12" vs-sm="12" vs-xs="12" align="left">                                                            
                                <div style="font-size: 12px; ">Asesores: </div>
                                <v-select class="mb-4 w-full" placeholder="--Seleccione--" v-model="valorBusqueda2" :options="Asesores" label="NombreApellidoAsesor" :reduce="Asesores => Asesores.NombreApellidoAsesor" @input="getAsesorParametro();" />
                        </div>                        
                    </div>
                </vs-card>
            </vs-col>
        </vs-row> -->
        <vs-table max-items="10" pagination search :data="InstitucionAsignada" >
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ InstitucionAsignada.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th width="500">
                    Información Asignación
                </vs-th>
                <vs-th>Estado</vs-th>
                <vs-th width="100">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <small><b>Institucion:</b> {{tr.nombreInstitucion}}</small><br>
                        <small><b>Fecha Asignación:</b> {{tr.created_at}}</small><br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.asin_estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].asin_id">
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.asin_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Modificar Proforma</vs-button>                                   
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>        
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
            InstitucionAsignada: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabInstitucionAsignada: {
                asin_id: '',
                asin_idInstitucion: '',
                asin_idusuario: '',
                asin_estado: '',
                updated_at: ''
            },
            Instituciones:[],
            cantidad:[],
            Asesores:[],
            asin_id: 0,
            InstitucionAsignadaes: [],
            InstitucionAsignada_inactivos: [],
            busquedaxcodigo: "",
            busquedaInstitucion:"",
            valor:"0",
            valorBusqueda:"",
            valorBusqueda2:"",
            checkBox_mostraractivos:true,
            checkBox_mostrarinactivos:false,
            arregloPeriodos:[],
            //showAgregarNuevo: false,
        }
    },
    watch: {
        valorBusqueda(newValue) {
            if (newValue === '0') {
                this.InstitucionAsignada = [];
            }else if (newValue === '1') {
                this.InstitucionAsignada = [];
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {       
        this.getInstitucionAsignada();
        this.getInstituciones()
    },
    methods: {        
        handleRadioInput(opcion) {
            // Vacía el array InstitucionAsignada cuando se selecciona la opción 'nombres'
            if (opcion === 'nombreInstitucion') {
                this.InstitucionAsignada = [];
            }
            else if(opcion === 'nombreAsesor'){
                this.InstitucionAsignada = [];
            }
        },
        getInstitucionAsignada() {
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let me = this;
            this.datoUsuario = usuarioObjeto.idusuario
            this.checkBox_mostraractivos = true;
            me.$vs.loading()
            this.$http.get(this.$server_url+'GetAsignacion?datoUsuario='+me.datoUsuario)
            .then(res => {
            this.InstitucionAsignada = res.data;
            me.$vs.loading.close()
            })
            .catch(err => {
            console.log(err)
            me.$vs.loading.close()
            })
        },
        getInstitucionParametro(){
            let me = this;
            this.busqueda = 'institucion';
            me.$vs.loading()
            if(me.busqueda=='institucion' && me.valorBusqueda !== null && me.valorBusqueda !== '' && me.valorBusqueda !== 0){
                this.$http.get(this.$server_url+'GetInstitucionesParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.valorBusqueda)
                // this.$http.get(this.$server_url+'GetAsignacionesParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaInstitucion)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.AsesorInstitucion = res.data;
                    if(me.AsesorInstitucion.length === 0){
                        me.$vs.notify({
                            text: 'No hay coincidencias en la búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.AsesorInstitucion = [];
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
                    me.AsesorInstitucion = [];
                    me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
            }else{
                this.$http.get(this.$server_url+'GetInstitucionesParametro?busqueda='+me.busqueda+'&razonbusqueda='+me.valorBusqueda)
                .then(function (res) {
                    me.AsesorInstitucion = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.AsesorInstitucion = [];
                    me.$vs.loading.close()
                })           
            }
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
        },
        getPeriodos(){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                me.$vs.loading.close();
                let datos = res.data
                if(datos.length == 0){
                localStorage.removeItem('pid')
                localStorage.removeItem('pnombre')
                me.arregloPeriodos = []
                return
                }
                if( me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1 ){
                me.arregloPeriodos = datos.filter(p => p.pedido_facturacion == 1)
                }
                if( me.usuario.id_group == 17 || me.usuario.id_group == 27 ){
                me.arregloPeriodos = datos.filter(p => p.pedido_bodega == 1)
                }
                if( me.usuario.id_group == 11 || me.usuario.id_group == 11 ){
                me.arregloPeriodos = datos.filter(p => p.pedido_asesor == 1)
                }
                if(me.arregloPeriodos.length == 0){
                localStorage.removeItem('pid')
                localStorage.removeItem('pnombre')
                }
            })
            .catch(function (error) {
                me.$vs.loading.close();
            })
        },
    }
}
</script>