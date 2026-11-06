<template>
    <vx-card 
    :title="'Pedidos Libros Hijos Docentes'"
    class="mt-3">
        <div v-if="menu == 0">
            <vs-table max-items="10" stripe search pagination :data="arregloLibrosObsequiosGerencia">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: {{ arregloLibrosObsequiosGerencia.length }}</vs-chip>
                    <vs-radio class="ml-2" v-if="usuario.id_group == 25" v-model="seleccion"
                    vs-value="gerencia1" @input="getLibrosObsequiosGerencia(6);">Por Aprobar</vs-radio>
                    <vs-radio class="ml-2" v-if="usuario.id_group == 25" v-model="seleccion"
                    vs-value="gerencia2" @input="getLibrosObsequiosGerencia(7);">Aprobados</vs-radio>
                    <vs-radio class="ml-2" v-if="usuario.id_group == 25" v-model="seleccion"
                        vs-value="todos" @input="getLibrosObsequiosGerencia(5);">Todos</vs-radio>
                </template>
                <template slot="thead">
                    <vs-th>Libros Hijos Docentes ID#</vs-th>
                    <vs-th>Detalle</vs-th>
                    <vs-th>Comentario</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td width="15%">
                            #{{data[indextr].id}}<br>
                            <small>{{ tr.contrato_generado }}</small>
                            <br>
                            <small>{{ tr.nombreInstitucion }}</small>
                            <br>
                            <small><b>Asesor Creador:</b></small>
                            <br>
                            <small>{{ tr.creador }}</small>
                        </vs-td>
                        <vs-td width="20%">
                            <small><b>Descuento:</b></small>
                            <p>{{data[indextr].porcentaje_descuento}}%</p>
                            <br>
                            <small><b>Total unidades:</b></small>
                            <p>{{data[indextr].total_unidades}}</p>
                        </vs-td>
                        <vs-td height="40%" width="40%">
                          <div class="overflow-y-auto h-24">
                             {{ tr.observacion_asesor }}
                          </div>
                        </vs-td>
                        <vs-td width="15%">
                            <div v-if="tr.estado_libros_obsequios == 0">
                                <vs-chip color="primary" transparent>Abierto</vs-chip>
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 4">
                                <vs-chip color="dark" transparent>Autorizado por Gerencia</vs-chip>
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 5">
                                <vs-chip color="primary" transparent>Aprobado por Facturador</vs-chip>
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 1">
                                <vs-chip color="success" transparent>Cerrado/aceptado</vs-chip>
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 2">
                                <vs-chip color="danger" transparent>Rechazado</vs-chip>
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 3 && usuario.id_group == 11">
                                <vs-chip color="warning" transparent>Enviado</vs-chip>
                            </div>
                            <div v-if="tr.estado_libros_obsequios == 3 && ( usuario.id_group == 22 ||  usuario.id_group == 23 ||  usuario.id_group == 25 )">
                                <vs-chip color="warning" transparent>Por Aprobar</vs-chip>
                            </div>
                        </vs-td>
                        <vs-td width="30%">
                          <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                              <div>
                                <vs-dropdown-item v-if="tr.estado_libros_obsequios == 3 && ( usuario.id_group == 22 ||  usuario.id_group == 23 ||  usuario.id_group == 25 )">
                                  <!--ACEPTAR ALCANCE-->
                                  <vs-button class="w-full" color="success" @click="librosObsequios=tr;openConfirmLibrosObsequios(tr)"  icon-pack="feather" icon="icon-check" type="line" > Aceptar pedido Libros Hijos Docentes </vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="tr.estado_libros_obsequios == 3 && ( usuario.id_group == 22 ||  usuario.id_group == 23 ||  usuario.id_group == 25 )">
                                  <!--RECHAZAR ALCANCE-->
                                  <vs-button  color="warning" type="line"  icon-pack="feather" icon="icon-x" @click="CambiarEstadoPedidoLibrosObsequios(tr,2)" class="w-full text-normal p-2">Rechazar pedido Libros Hijos Docentes</vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item>
                                  <!--RESUMEN LIBROS-->
                                  <vs-button color="primary" type="line"  icon-pack="feather" icon="icon-bookmark" class="w-full" @click="librosObsequios=tr;mostrarResumen(tr)">Resumen Libros Hijos Docentes</vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="tr.estado_libros_obsequios == 5">
                                    <!--REPORTE PDF-->
                                    <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer"
                                        class="w-full" @click="librosObsequios=tr;realizarReporte(1)">Acta
                                        Pdf</vs-button>
                                </vs-dropdown-item>
                                <!-- <vs-dropdown-item>
                                  <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" class="w-full" @click="librosObsequios=tr;realizarReporte(1)">Reporte Pdf</vs-button>
                                </vs-dropdown-item> -->
                              </div>
                            </vs-dropdown-menu>
                          </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>        
        <!--RESUMEN LIBROS-->
        <div v-if="menu == 2">
            <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
            <resumenLibrosObsequiosVue :librosObsequios="librosObsequios"/>
        </div>
        <!--REGISTRAR LIBROS
        <div v-if="menu == 3">
            <vs-button color="primary" type="border" @click="menu = 0;getLibrosObsequios(0)">← Regresar</vs-button>
            <screenPedidoLibrosObsequiosVue :librosObsequios="librosObsequios" class="mt-2" :sendPedido="sendPedido" :userRoot="Boolean(userRoot)"/>
        </div>-->  
        <!--REPORTE-->
        <div v-if="popupReportePedidoLibroObsequio">
          <exportLibrosObsequiosVueVue  style="display:none;" :tipoFile="tipoFile" :librosObsequios="librosObsequios" @change="changeHandle" />
        </div>
        <!--MODALES-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
          <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
          <img  class="mt-2"  style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png"/>
        </vs-popup>
         <!--ACEPTAR POR GERENCIA-->
         <vs-popup fullscreen class="holamundo" :title="'Aprobación Pedido ' + librosObsequios.id" :active.sync="popupGerenciaAceptar">            
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <p class="font-bold text-success font-bold mt-5">RESUMEN DE LOS LIBROS SELECCIONADOS EN EL PEDIDO LIBROS HIJOS DOCENTES ID #{{ librosObsequios.id }}</p>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <b class="text-danger">Porcentaje de descuento {{ porcentaje_descuento}}%</b>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-table max-items="10" search pagination :data="arregloLibros">
                <template slot="header">
                <span>Cantidad: {{ arregloLibros.length }}</span>
                </template>
                <template slot="thead">
                    <vs-th>Libro</vs-th>
                    <vs-th>Cant. unidades</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr v-for="(item, index) in data" :key="index">
                        <vs-td>
                        {{ item.pro_nombre }}<br>
                        </vs-td>
                        <vs-td>
                            {{ item.p_libros_cantidad }}<br>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>  
            <vs-row v-if="cambioPorcentaje">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-radio v-model="selectedOption" vs-value="institucion" class="mr-5">Descuento por institución</vs-radio>
                    <vs-radio v-model="selectedOption" vs-value="100%" class="ml-5">Descuento 100%</vs-radio>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-col v-if="selectedOption === 'institucion'" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6"
                    vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input label="Porcentaje de institución:" class="w-full" v-model="porcentajePedidoLibrosObsequios.institucionPorcentaje" readonly />
                    </vs-col>
                    </vs-row>
                    </vs-col>
                    <vs-col v-else-if="selectedOption === '100%'" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Porcentaje del 100%:" class="w-full" v-model="porcentajePedidoLibrosObsequios.procentaje100" readonly />
                        </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-col>      
            </vs-row>
            <br><br>
            <vs-row class="flex justify-center">
                <vs-button class="mr-5" color="success" @click="aceptarLibrosObsequios()" type="border" icon="save">Autorizar</vs-button>
                <vs-button class="mr-5 ml-5"color="primary" @click="toggleCambioPorcentaje" type="border" icon="save">Cambio de porcentaje</vs-button>
            </vs-row>
        </vs-popup>
    </vx-card>
</template>
<script>
import {
    mapState
} from "vuex";
const resumenLibrosObsequiosVue = () => import('./resumenLibrosObsequiosGerencia.vue')
// const screenPedidoLibrosObsequiosGerenciaVue = () => import('./screenPedidoLibrosObsequios.vue')
const exportLibrosObsequiosVueVue = () => import('../components/exportLibrosObsequios.vue')
import PedidosRepository from "../../../../../../repositories/PedidosRepository";
export default{
    components:{
        resumenLibrosObsequiosVue,
        // screenPedidoLibrosObsequiosGerenciaVue,
        exportLibrosObsequiosVueVue,
    },
    data(){
        return{
            usuario:[],
            arregloLibros:[],
            arregloLibrosObsequios:[],
            arregloLibrosObsequiosGerencia:[],
            librosObsequios:{},
            pedido:{},
            menu:0,
            popupCarga:false,
            cambioPorcentaje:false,
            popupGerenciaAceptar:false,
            popupReportePedidoLibroObsequio:false,
            tipoFile:0,
            // sendPedido:'',
            selectedOption: '',
            porcentajePedidoLibrosObsequios:{
            institucionPorcentaje:0,
            procentaje100:100
            },
        }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
      sendPedido: {
        type: Object,
        default: {},
      }
    },
    mounted(){
        let me = this;
        me.sendPedido               = me.ObjectPedido
        me.pedido.id_pedido         = me.sendPedido.id_pedido
        // me.getLibrosObsequios(0)
        me.getLibrosObsequiosGerencia(0)  
    },
    methods:{
        toggleCambioPorcentaje() {
            this.cambioPorcentaje = !this.cambioPorcentaje; 
        },
        getLibrosObsequiosGerencia(tipo){
            let me = this;            
            me.$vs.loading();
            this.$http.get(this.$server_url+'getLibrosObsequiosGerencia')
            .then(function (res) {
                me.$vs.loading.close()
                // me.arregloLibrosObsequiosGerencia = res.data
                if (tipo == 0) {
                    let datos = res.data.filter(p => p.estado_libros_obsequios == 3 && p.porcentaje_descuento == 100)
                    me.arregloLibrosObsequiosGerencia = datos                    
                }
                if (tipo == 5) {
                    let datos = res.data.filter(p => (p.estado_libros_obsequios == 3 && p.porcentaje_descuento == 100) || p.estado_libros_obsequios == 4 || p.estado_libros_obsequios == 5)
                    me.arregloLibrosObsequiosGerencia = datos
                }
                if (tipo == 6) {
                    let datos = res.data.filter(p => p.estado_libros_obsequios == 3 && p.porcentaje_descuento == 100)
                    me.arregloLibrosObsequiosGerencia = datos
                }
                if (tipo == 7) {
                    let datos = res.data.filter(p => p.estado_libros_obsequios == 5 || p.estado_libros_obsequios == 4)
                    me.arregloLibrosObsequiosGerencia = datos
                } 
                // if (this.arregloLibrosObsequiosGerencia.porcentaje_descuento !== 100) {
                //     this.porcentajePedidoLibrosObsequios.institucionPorcentaje = this.arregloLibrosObsequiosGerencia.porcentaje_descuento;
                // } else {
                //     this.porcentajePedidoLibrosObsequios.procentaje100 = this.arregloLibrosObsequiosGerencia.porcentaje_descuento;
                // }                
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })  
        },
        getLibros(pedidoIdObsequio){
            let me = this
            this.$vs.loading();
            this.$http.get(this.$server_url+'obtenerDatosDetalleLibros/'+pedidoIdObsequio)
            .then(res => {
                let datos = res.data
                me.arregloLibros = datos
                me.porcentaje_descuento = me.arregloLibros[0].porcentaje_descuento
                this.$vs.loading.close();
            })
        },
        mostrarResumen(tr){
            let me = this;
            me.menu = 2
        },
        eliminarLibrosObsequios(){
            let me = this;
            let formData = new FormData();
            formData.append('id',           me.librosObsequios.id);
            formData.append('id_pedido',    me.pedido.id_pedido);
            me.$vs.loading();
            this.$http.post(this.$server_url+'eliminarPedidoLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se elimino correctamente el pedido libros obsequips',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getLibrosObsequios(0)
                    me.menu = 0
                })
                .catch(function (error) {  me.$vs.loading.close() })
        },
        async guardarValorPedidoLibrosObsequios(){
            let me = this
            let formData = new FormData();
            formData.append('id',                 0)
            formData.append('id_periodo',         me.sendPedido.id_periodo);
            formData.append('id_pedido',          me.pedido.id_pedido);
            formData.append('total_unidades',     0);
            formData.append('pendiente_liquidar', 0);
            this.$http.post(this.$server_url+'guardarValorPedidoLibrosObsequios', formData)
            .then(function (res) {
                if(res.data.status == 0){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time:7000,
                    })
                    return
                }
                me.$vs.notify({
                text: 'Se guardo correctamente',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
                me.getLibrosObsequiosGerencia()
            })
            .catch(function (error) {})
        },
        CambiarEstadoPedidoLibrosObsequios(tr,estado){
            let me = this;
            let formData = new FormData();
            formData.append('id',      tr.id);
            formData.append('estado_libros_obsequios', estado);
            me.$vs.loading();
            this.$http.post(this.$server_url+'changeEstadoPedidoLibrosObsequios', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                me.$vs.notify({
                    text: res.data.message,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
                }
                me.$vs.notify({
                text: res.data.message,
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
                me.getLibrosObsequiosGerencia()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        CambiarEstadoLibrosObsequios(tr,estado){
            let me = this;
            let formData = new FormData();
            formData.append('id',      tr.id);
            formData.append('estado_libros_obsequios', estado);
            me.$vs.loading();
            this.$http.post(this.$server_url+'CambiarEstadoLibrosObsequios', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                me.getLibrosObsequiosGerencia()
                me.menu = 0
                me.$vs.notify({
                text: res.data.message,
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmLibrosObsequios(tr){
            let me = this;
            me.popupGerenciaAceptar = true;
            let idPedidoObsequio = tr.id 
            let idPedido = tr.id_pedido
            me.getPorcentajeDescuetoInstitucion(idPedido)   
            me.getLibros(idPedidoObsequio);
            if (this.librosObsequios.porcentaje_descuento !== 100) {
                this.selectedOption = 'institucion';
                this.porcentajePedidoLibrosObsequios.institucionPorcentaje = this.librosObsequios.porcentaje_descuento;
            } else {
                this.selectedOption = '100%';
                this.porcentajePedidoLibrosObsequios.procentaje100 = this.librosObsequios.porcentaje_descuento;
            }
        },
        getPorcentajeDescuetoInstitucion(idPedido) {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'getDescuentoInstitucion/'+idPedido)
            .then(res => {
                this.porcentajePedidoLibrosObsequios.institucionPorcentaje = res.data[0].descuento;   
                this.$vs.loading.close();
            })
            .catch(error => {
                console.error('Error al obtener descuento:', error);
                this.$vs.loading.close();
            });
        },
        aceptarLibrosObsequios(){
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let porcentajeDescuento;
            if (this.selectedOption === 'institucion') {
                porcentajeDescuento = this.porcentajePedidoLibrosObsequios.institucionPorcentaje;
            } else if (this.selectedOption === '100%') {
                porcentajeDescuento = this.porcentajePedidoLibrosObsequios.procentaje100;
            }
            let formData = new FormData();
            formData.append('id_pedidoLibrosObsequios',   me.librosObsequios.id);
            formData.append('contrato',     me.librosObsequios.contrato_generado);
            formData.append('id_pedido',    me.librosObsequios.id_pedido);
            formData.append('descuento',   porcentajeDescuento);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('usuario_aprobador', me.usuario.id_group);
            formData.append('usuario_aprobacion_id', usuarioObjeto.idusuario);
            formData.append('usuario_aprobacion', usuarioObjeto.nombres + ' ' + usuarioObjeto.apellidos);
            me.$vs.loading();
            this.$http.post(this.$server_url+'AceptarLibrosObsequios', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                me.$vs.notify({
                    text: res.data.message,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
                }
                me.$vs.notify({
                text: 'Se guardo correctamente',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
                me.getLibrosObsequiosGerencia(0)
                me.popupGerenciaAceptar = false;
                //me.rechargePedido()
            })
            .catch(function (error) { me.$vs.loading.close(); me.popupGerenciaAceptar = false; })
        },
        rechargePedido(){
          let me = this
          PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => { this.$store.dispatch('setPedido',r.data[0]); })
        },
      realizarReporte(tipo){
        let me = this;
        me.tipoFile            = tipo
        me.popupCarga          = true
        me.popupReportePedidoLibroObsequio = true
      },
      changeHandle(e){
        let me = this;
        me.popupCarga             = false
        me.popupReportePedidoLibroObsequio    = false
      },
    }

}
</script>
