<template>
    <div>
        <!--FILTROS-->
        <ul class="flex mt-2 py-2" style="flex-wrap:wrap;">
            <li v-if="( userAsesor == true || userFacturador || userRoot == true || userAdmin) ">
            <vs-radio v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="1"><span style="font-weight:bold;">{{ sumaPendientes }}</span> Pendientes</vs-radio>
            </li>
            <li v-if="( userAsesor == true || userFacturador || userRoot == true || userAdmin) ">
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="2"><span style="font-weight:bold;">{{ sumaAnulados }}</span> Rechazados</vs-radio>
            </li>
            <li v-if="( userFacturador || userAsesor ||  userRoot == true || userAdmin) ">
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="3"><span style="font-weight:bold;">{{ sumaAprobados }}</span> Aprobados por facturacion</vs-radio>
            </li>
            <li v-if="( userGerencia ||  userRoot == true || userAdmin) ">
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="4"><span style="font-weight:bold;">{{ sumaEvidencias }}</span> Cotización subidas</vs-radio>
            </li>
            <li v-if="( userGerencia || userAsesor ||  userRoot == true || userAdmin) ">
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="5"><span style="font-weight:bold;">{{ sumaAutorizados }}</span> Autorizados por gerencia</vs-radio>
            </li>
            <li v-if="( userGerencia || userAsesor == true || userAdmin == true || userRoot == true) ">
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="6"><span style="font-weight:bold;">{{ sumaEntregados }}</span> Entregados</vs-radio>
            </li>
            <li>
            <vs-radio v-model="filtro" @input="filtroTipo();" class="ml-2" vs-name="radios1tipo" vs-value="7"><span style="font-weight:bold;">{{ arregloObsequios.length }}</span> Ver todos</vs-radio>
            </li>
            <li v-if="filtro==3 && (usuario.id_group == 23 || usuario.id_group == 22 || userFacturador)" class="ml-5">
                <vs-input  icon-after="true" style="width: 250px;"  icon="search" placeholder="Buscar Institución" v-model="busquedaxcodigo" @input="filtrarPedidos()" />
            </li>
        </ul>
        <!--FIN FILTROS-->
        <vs-table max-items="10" stripe search pagination :data="tmpArregloObsequios">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: {{ tmpArregloObsequios.length }}</vs-chip>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Asesor</vs-th>
                <vs-th>Institución</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Evidencias</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].id}}<br>
                    </vs-td>
                    <vs-td>
                        <b>Asesor:</b>
                        <p>{{ tr.asesor }}</p>
                        <b>Cédula:</b>
                        <p>{{ tr.cedula }}</p>
                    </vs-td>
                    <vs-td>
                        <b>Institución:</b>
                        <p>{{ tr.nombreInstitucion }}</p>
                        <b>Ciudad:</b>
                        <p>{{ tr.ciudad }}</p>
                        <b>Período:</b>
                        <p>{{ tr.periodo }}</p>
                    </vs-td>
                    <vs-td>
                      <!-- <p>
                        {{ tr }}
                      </p> -->
                        <vs-chip v-if="tr.estado == 0" color="danger">Pedido imcompleto</vs-chip>
                        <vs-chip v-if="tr.estado == 1" color="warning">Pendiente</vs-chip>
                        <vs-chip v-if="tr.estado == 2" color="danger">Rechazado</vs-chip>
                        <vs-chip v-if="tr.estado == 3" color="primary">Aprobado por facturación</vs-chip>
                        <vs-chip v-if="tr.estado == 4" color="dark">Cotización subida</vs-chip>
                        <vs-chip v-if="tr.estado == 5" color="success">Autorizado por gerencia</vs-chip>
                        <vs-chip v-if="tr.estado == 6" color="success">Entregado</vs-chip><br><br>

                        <p v-if="tr.estado > 2"><b>Aprobado por:</b> {{ tr.facturador }}</p>
                        <p v-if="tr.estado == 2"><b>Rechazado por:</b> {{ tr.facturador }}</p>
                        <b v-if="tr.total_gastado > 0">Total Gastado diferente a este pedido:</b>
                        <p v-if="tr.total_gastado > 0">${{ tr.total_gastado }}</p>
                        <div class="flex" v-if="tr.estado > 2">
                            <p><b>Valor de obsequios máximo:</b><span class="text-success font-bold"> ${{ tr.valor_obsequios }}</span> </p>
                        </div>
                        <div class="flexs" v-if="tr.estado > 2">
                            <p><b>Valor obsequios del pedido:</b><span class="text-success font-bold"> ${{ tr.valor_total || 0 }}</span> </p>
                            <p><b>Disponible:</b><span class="text-success font-bold"> ${{ ((tr.valor_obsequios - tr.valor_total) - tr.total_gastado).toFixed(2)   }}</span> </p>
                        </div>
                        <p><b>Fecha creación:</b> {{ tr.created_at }}</p>
                        <p v-if="tr.estado > 2"><b>Facturador aprueba:</b> {{ tr.fecha_facturador_aprueba }}</p>
                        <p v-if="tr.estado > 4"><b>Gerencia autoriza:</b> {{ tr.fecha_gerencia_aprueba }}</p>
                        <p v-if="tr.estado == 6"><b>Asesor sube evidencia entrega:</b> {{ tr.fecha_asesor_sube_evidencia_entrega }}</p>
                    </vs-td>
                    <!--EVICENCIAS-->
                    <vs-td>
                        <p v-if="!tr.foto_solicitud">
                            <b class="text-danger"> Solicitud de obsequios: No subida</b>
                        </p>
                        <p v-else class="imagen" @click="tipoDocumento ='solicitud';documento=tr.foto_solicitud;openDocument(tr)">
                            <b> Solicitud de obsequios
                                <!--PDF-->
                                <ion-icon v-if="tr.foto_solicitud.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                <!--IMAGE-->
                                <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                            </b>
                        </p>
                        <p class="imagen" @click="tipoDocumento ='cotizacion';documento=tr.foto_cotizacion;popupDocumento = true;estadoPhoto=2;" v-if="tr.foto_cotizacion">
                            <b> Cotización <ion-icon style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon></b>
                        </p>
                        <p class="imagen" @click="tipoDocumento ='factura';documento=tr.foto_factura;popupDocumento = true;estadoPhoto=3;" v-if="tr.foto_factura">
                            <b> Factura <ion-icon style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon></b>
                        </p>
                        <p class="imagen" @click="tipoDocumento ='entrega';pedido=tr;documento=tr.foto_entrega;popupDocumento = true;estadoPhoto=5" v-if="tr.foto_entrega">
                            <b> Entrega <ion-icon style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon></b>
                        </p>
                        <p class="imagen" @click="tipoDocumento ='evidencia_gerencia';documento=tr.foto_envidencia_gerencia;popupDocumento = true;estadoPhoto=4;" v-if="tr.foto_envidencia_gerencia">
                            <b> Aprobación gerencia <ion-icon style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon></b>
                        </p>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;">
                            <!--EDITAR - DETALLE-->
                            <vx-tooltip style="display: inline-block;" :text="usuario.id_group == '11' ? 'Editar pedido' : 'Ver pedido'" position="top" color="primary">
                                <vs-button class="modal-default-button" @click="editarPedido(tr);" size="small" color="success" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                            </vx-tooltip> &nbsp;
                            <!--APROBAR-->
                            <!--VER OBSERVACION FACTURADOR-->
                            <vx-tooltip style="display: inline-block;" text="Ver observación facturador" position="top" color="primary">
                                <vs-button v-if="tr.observacion_facturador != null && !userGerencia" class="modal-default-button" @click="pedido=tr;popupObservacion=true;" size="small" color="dark" type="filled" icon-pack="feather" icon="icon-message-circle"> </vs-button>
                            </vx-tooltip> &nbsp;
                            <!--ELIMINAR PEDIDO-->
                            <vx-tooltip style="display: inline-block;" text="Eliminar pedido" position="top" color="primary">
                                <vs-button class="modal-default-button" v-if="(tr.estado == 1 || tr.estado == 0) && usuario.id_group == 11" @click="pedido = tr; openConfirmarEliminar(tr)" size="small" color="danger" type="filled" icon-pack="feather" icon="icon-trash"> </vs-button>
                            </vx-tooltip> &nbsp;
                            <!--ASESOR SUBE SOLICITUD DE OBSEQUIOS-->
                            <vx-tooltip style="display: inline-block;" text="Subir foto de solicitud de obsequios" position="top" color="primary">
                                <vs-button class="modal-default-button" v-if="tr.foto_solicitud == null && ( userAsesor == true || userRoot || userAdmin) " @click="pedido = tr;popupSolicitud = true;" size="small" color="primary" type="filled" icon-pack="feather" icon="icon-camera">Subir solicitud de obsequios </vs-button>
                            </vx-tooltip> &nbsp;
                            <!--APROBAR PEDIDO GERENCIA-->
                            <vx-tooltip style="display: inline-block;" text="Autorizar pedido" position="top" color="primary">
                                <vs-button class="modal-default-button" v-if="tr.estado == 4 && (userGerencia == true || usuario.id_group == 1) " @click="pedido = tr;openAutorizar()" size="small" color="primary" type="filled" icon-pack="feather" icon="icon-check">Autorizar </vs-button>
                            </vx-tooltip> &nbsp;
                            <!--SUBIR EVIDENCIAS-->
                            <vx-tooltip style="display: inline-block;" text="Subir cotizacion y factura" position="top" color="primary">
                                <vs-button class="modal-default-button" v-if="tr.estado == 3 && ( usuario.id_group == 1 ) " @click="pedido = tr;popupAsignarValor = true;" size="small" color="primary" type="filled" icon-pack="feather" icon="icon-dollar-sign">Asignar valor </vs-button>
                            </vx-tooltip> &nbsp;
                            <!--ASESOR SUBE EVIDENCIA ENTREGA-->
                            <vx-tooltip style="display: inline-block;" text="Subir evidencia entrega de obsequios" position="top" color="primary">
                                <vs-button class="modal-default-button" v-if="tr.estado == 5 && ( userAsesor == true )  " @click="pedido = tr;popupSubirEntrega = true;" size="small" color="primary" type="filled" icon-pack="feather" icon="icon-camera">Subir evidencia entrega </vs-button>
                            </vx-tooltip> &nbsp;
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--MODALES-->
        <!--MODAL PARA VER OBSERVACION DEL FACTURADOR-->
        <vs-popup classContent="popup-example" title="Ver comentario facturador" :active.sync="popupObservacion">
            <p class="font-bold text-warning text-2xl">Comentario facturador:</p>
            <vs-divider style="margin-top: -2px;"></vs-divider>
            <p class="">{{ pedido.observacion_facturador }}</p>
        </vs-popup>
        <!--MODAL SUBIR SOLICITUD DE OBSEQUIOS-->
           <vs-popup classContent="popup-example" title="Solicitud" :active.sync="popupSolicitud">
            <p class="font-bold text-warning text-2xl text-center">Evidencia de solicitud de obsequios</p>
            <vs-divider>SUBA FOTO DE EVIDENCIA DE SOLICITUD DE OBSEQUIOS</vs-divider>
            <UploadFileGerenciaVue :pedido="pedido" titlebtn="Subir solicitud" tipoDocumento = 'solicitud' campo_file="foto_solicitud" campo_fecha="fecha_creacion_pedido" estado="1" @recharge="recharge"/>
        </vs-popup>
        <!--MODAL GERENCIA AUTORIZA-->
        <vs-popup classContent="popup-example" title="Autorizar" :active.sync="popupAutorizar">
            <p class="font-bold text-warning text-2xl text-center">Autorizo el pedido de obsequio:</p>
            <vs-divider></vs-divider>
            <div class="flex justify-center">
                <vs-button class="mb-2" icon="check" @click="gerenciaAutoriza()">Si, deseo autorizar</vs-button>
                <vs-button color="warning" class="ml-2 mb-2"  type="border"  @click="popupAutorizar = false;">Cancelar</vs-button>
            </div>
        </vs-popup>
        <!--MODAL ADMIN AUTORIZA-->
        <vs-popup classContent="popup-example" title="Autorizar" :active.sync="popupAdminAutoriza">
            <p class="font-bold text-warning text-2xl text-center">Autorizo el pedido de obsequio:</p>
            <vs-divider>SUBA LA FOTO DE AUTORIZACIÓN DE GERENCIA</vs-divider>
            <div class="flex justify-center">
                <vs-chip color="success" style="font-size:23px;padding:5px;">Valor máximo de obsequios ${{ pedido.valor_obsequios }}</vs-chip>
            </div>
            <br>
            <UploadFileGerenciaVue :pedido="pedido" titlebtn="Autorizar" tipoDocumento = 'evidencia_gerencia' campo_file="foto_envidencia_gerencia" campo_fecha="fecha_gerencia_aprueba" estado="5" @recharge="recharge"/>
        </vs-popup>
        <!--MODAL ASIGNAR VALOR-->
        <vs-popup classContent="popup-example" title="Asignar valor a pedido de obsequio" :active.sync="popupAsignarValor">
            <p class="font-bold text-primary text-2xl text-center" style="opacity:0.8;">Asignar valor al pedido de obsequio:</p>
            <div>
                <vs-divider>SUBA FOTO DE LA COTIZACIÓN</vs-divider>
                <UploadFileVue sinBtn="1" :pedido="pedido" @cotizacion="Getcotizacion"  tipoDocumento = 'cotizacion' campo_file="foto_cotizacion" campo_fecha="fecha_administrador_sube_cotizacion" estado="4" @recharge="recharge"/>
            </div>
            <div>
                <vs-divider>SUBA FOTO DE LA FACTURA</vs-divider>
                <UploadFileVue sinBtn="1"  :pedido="pedido" @factura="GetFactura"  tipoDocumento = 'factura' campo_file="foto_factura" campo_fecha="fecha_administrador_sube_cotizacion" estado="4" @recharge="recharge"/>
            </div>
            <div class="flex justify-center">
                <vs-chip color="success" style="font-size:23px;padding:5px;">Valor máximo de obsequios ${{ pedido.valor_obsequios }}</vs-chip>
            </div>
            <vx-input-group class="mb-base mt-5">
                <template slot="prepend">
                <div class="prepend-text bg-success">
                    <span>Ingrese el valor ( inc.Iva ) $</span>
                </div>
                </template>
                <vs-input v-model="valorAsignar" />
            </vx-input-group>
            <div class="flex" style="justify-content: center;" >
                <vs-button color="primary" @click="subirDocumento()" class="mt-2" type="gradient">Asignar valor</vs-button>
            </div>
        </vs-popup>
        <!--MODAL SUBIR ENTREGA-->
        <vs-popup classContent="popup-example" title="Evidencia de entrega" :active.sync="popupSubirEntrega">
            <p class="font-bold text-warning text-2xl text-center">Evidencia de entrega de obsequios</p>
            <vs-divider>SUBA FOTO DE EVIDENCIA DE ENTREGA DE OBSEQUIOS</vs-divider>
            <UploadFileGerenciaVue :pedido="pedido" titlebtn="Subir evidencia" tipoDocumento = 'entrega' campo_file="foto_entrega" campo_fecha="fecha_asesor_sube_evidencia_entrega" estado="6" @recharge="recharge"/>
        </vs-popup>
        <!--MODAL PARA MOSTRAR DOCUMENTO-->
        <vs-popup class="holamundo" :title="'Documento: '+tipoDocumento" fullscreen :active.sync="popupDocumento">
            <div>
                <vx-tooltip style="display: inline-block;" text="Subir evidencia entrega de obsequios" position="top" color="primary">
                    <vs-button class="modal-default-button" v-if="estadoPhoto == 5 && ( userAsesor == true )  " @click="popupDocumento = false;popupSubirEntrega = true;" size="small" color="primary" type="filled" icon-pack="feather" icon="icon-camera">Subir evidencia entrega </vs-button>
                </vx-tooltip> &nbsp;
            </div>
            <br><br>
            <div class="flex" style="justify-content: center;">
                <image-zoom
                    :regular="$data_url+'archivos/obsequios/'+tipoDocumento+'/'+documento"
                    :zoom-amount="3"
                    :click-zoom="true"
                    click-message="De click para aumentar"
                    img-class="img-fluid"
                    >
                </image-zoom>
            </div>
        </vs-popup>
    </div>
</template>
<script>
import axios from 'axios'
import UploadFileGerenciaVue from '../../admin/components/UploadFileGerencia'
import UploadFileVue from '../../admin/components/UploadFile'
import imageZoom from 'vue-image-zoomer';
export default{
    data(){
        return{
            usuario:[],
            pedido:{},
            popupObservacion:false,
            popupAutorizar:false,
            popupAdminAutoriza:false,
            popupAsignarValor:false,
            popupSubirEntrega:false,
            popupSolicitud:false,
            filtro:1,
            tmpArregloObsequios:[],
            userAdmin:false,
            userGerencia:false,
            userFacturador:false,
            userAsesor:false,
            //VARIABLES PARA MOSTRAR DOCUMENTOS
            popupDocumento:false,
            estadoPhoto:0,
            documento:'',
            //FIN VARIABLES PARA MOSTRAR DOCUMENTOS
            //VARIABLES PARA ASIGNAR VALOR
            valorAsignar:0,
            attachmentArrayCotizacion:[],
            attachmentArrayFactura:[],
            //FIN VARIABLES PARA ASIGNAR
            busquedaxcodigo:'',
        }
    },
    props:{
        periodo_id:{
            type:String,
            default:"",
        },
        arregloObsequios:{
            type:Array,
            default:[],
        },
        userRoot:{
          type:Boolean,
          default:false,
        },
        userAdmin:{
          type:Boolean,
          default:false,
        }
    },
    components:{
        UploadFileGerenciaVue,
        UploadFileVue,
        imageZoom,
    },
    watch:{
        arregloObsequios(results){
            let me = this
            me.tmpArregloObsequios = []
            if(results.length > 0){
                me.filtroTipo()
            }
        },
    },
    created(){
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
      me.tmpArregloObsequios = me.arregloObsequios
    },
    mounted(){
        let me = this;
        //FILTRO POR DEFECTO
        //gerencia -> mostrar directos pedidos aprobados
        if(me.usuario.id_group == 25) me.filtro = 4
        if(me.usuario.id_group == 1)  me.filtro = 3
        //FIN FILTRO POR DEFECTO
        //user admin
        if(me.usuario.id_group == 1)  me.userAdmin = true
        //user gerencia
        if(me.usuario.id_group == 25 ) me.userGerencia = true
        //user facturador
        if(me.usuario.id_group == 23 || me.usuario.id_group == 22) me.userFacturador = true
        //user asesor
        if(me.usuario.id_group == 11 ) me.userAsesor = true
    },
    computed:{
        sumaPendientes(){
            let me = this;
            var datos = ''
            if(me.usuario.id_group == 11 || me.userRoot || me.userAdmin){
                datos       = me.arregloObsequios.filter(p => ((p.estado == 0 || p.estado == 1)) );

            }else{
                datos       = me.arregloObsequios.filter(p => ((p.estado == 1)) );
            }
            let resultado   = datos.length
            return resultado
        },
        sumaAnulados(){
            let me = this;
            let datos       = me.arregloObsequios.filter(p => (p.estado == 2) );
            let resultado   = datos.length
            return resultado
        },
        sumaAprobados(){
            let me = this;
            let datos       = me.arregloObsequios.filter(p => (p.estado == 3) );
            let resultado   = datos.length
            return resultado
        },
        sumaEvidencias(){
            let me = this;
            let datos       = me.arregloObsequios.filter(p => (p.estado == 4) );
            let resultado   = datos.length
            return resultado
        },
        sumaAutorizados(){
            let me = this;
            let datos       = me.arregloObsequios.filter(p => (p.estado == 5) );
            let resultado   = datos.length
            return resultado
        },
        sumaEntregados(){
            let me = this;
            let datos       = me.arregloObsequios.filter(p => (p.estado == 6) );
            let resultado   = datos.length
            return resultado
        },
    },
    methods:{
        filtroTipo(dato){
            let me = this;
            me.tmpArregloObsequios = []
            //para ver los pedidos pendientes
                if(me.filtro == 1){
                    var datos = ''
                    if(me.usuario.id_group == 11 || me.usuario.id_group == 1){
                        datos       = me.arregloObsequios.filter(p => ((p.estado == 0 || p.estado == 1)) );
                    }else{
                        datos       = me.arregloObsequios.filter( p => (p.estado == 1) );
                    }
                me.tmpArregloObsequios      = datos
                return
            }
            //para ver los pedidos anulados
            if(me.filtro == 2){
                let datos                   = me.arregloObsequios.filter( p => (p.estado == 2) );
                me.tmpArregloObsequios      = datos
                return
            }

            if (me.usuario.id_group == 23 || me.usuario.id_group == 22 || me.userFacturador) {
                if (me.filtro == 3 && dato) {
                    let datos = me.arregloObsequios.filter(obsequio => {
                        return obsequio.estado == 3 && obsequio.nombreInstitucion.toString().toUpperCase().includes(dato.toUpperCase());
                    });
                    me.tmpArregloObsequios = datos;
                    return;
                }
            } else {
                if (me.filtro == 3) {
                    let datos = me.arregloObsequios.filter(p => p.estado == 3);
                    me.tmpArregloObsequios = datos;
                    return;
                }
            }

            //para ver las evidencias cotizaciones y factura
            if(me.filtro == 4){
                let datos                   = me.arregloObsequios.filter( p => (p.estado == 4) );
                me.tmpArregloObsequios      = datos
                return
            }
            //para ver los pedidos autorizados
            if(me.filtro == 5){
                let datos                   = me.arregloObsequios.filter( p => (p.estado == 5) );
                me.tmpArregloObsequios      = datos
                return
            }
            //para ver los pedidos entregados por el asesor
            if(me.filtro == 6){
                let datos                   = me.arregloObsequios.filter( p => (p.estado == 6) );
                me.tmpArregloObsequios      = datos
                return
            }
            //para ver todos los pedidos
            if(me.filtro == 7){
                me.tmpArregloObsequios      = me.arregloObsequios
                return
            }
        },
        filtrarPedidos() {
            this.tmpArregloObsequios = [];
            // console.log('entro al metodo')
            const busqueda = this.busquedaxcodigo.toUpperCase();
            // console.log('entro', busqueda)
            if (busqueda.length > 0 && this.filtro == 3) {
                // console.log('entro al metodo y ala validacion', busqueda)
                this.filtroTipo(busqueda);
            }else{
                // console.log('entro al else xD')
                this.filtroTipo(busqueda);
            }
        },
        openConfirmarEliminar(){
            this.$vs.dialog({
                type:'confirm',
                color: 'warning',
                acceptText:'Si deseo eliminar',
                cancelText:'Cancelar',
                title: `Confirmar`,
                text: 'Estás seguro de eliminar el pedido de obsequios?',
                accept:this.deleteOrder
            })
        },
        editarPedido(tr){
            let me = this;
            me.$emit('changeEdit',tr)
        },
        gerenciaAutoriza(){
            let me = this;
            me.popupAutorizar = false
            me.$emit('changeAutorizar',me.pedido)
        },
        deleteOrder(){
            let me = this;
            let formData = new FormData();
            formData.append('id',  me.pedido.id);
            me.$vs.loading()
            this.$http.post(this.$server_url+'obsequio_eliminar', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:4000
                    })
                    return
                }
                me.$emit('changeRecharge',true)
                me.$vs.notify({
                text:'Pedido de obsequios eliminado con exito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        recharge(){
            let me = this;
            me.popupAdminAutoriza = false
            me.popupSubirEntrega  = false
            me.popupSolicitud     = false
            me.$emit('changeRecharge',true)
        },
        openDocument(tr){
            let me = this;
            if(tr.foto_solicitud.substr(-3) == 'pdf'){
                let ruta = me.$data_url+'archivos/obsequios/'+me.tipoDocumento+'/'+me.documento
                window.open(ruta,'_blank')
                return
            }
            me.popupDocumento = true;
        },
        //METODOS GERENCIA
        openAutorizar(){
            let me = this;
            //gerencia autoriza
            if(me.usuario.id_group == 25){
                me.popupAutorizar       = true;
            }
            //Admin autoriza
            else{
                me.popupAdminAutoriza = true
            }
        },
        //METODOS PARA ASIGNAR VALOR
        Getcotizacion(e){
            let me = this;
            me.attachmentArrayCotizacion = e
        },
        GetFactura(e){
            let me = this;
            me.attachmentArrayFactura = e
        },
        subirDocumento(){
            let me = this;
            // if(me.valorAsignar > me.pedido.valor_obsequios){
            //     me.$vs.notify({
            //         text: "El valor del pedido no puede ser mayor a $"+me.pedido.valor_obsequios,
            //         color: 'warning',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle',
            //         time:4000,
            //     })
            //     return
            // }
            if(me.attachmentArrayCotizacion.length == 0){
                me.$vs.notify({
                    text: "Suba una imagen de la cotización por favor",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if(me.attachmentArrayFactura.length == 0){
                me.$vs.notify({
                    text: "Suba una imagen de la factura por favor",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if(me.valorAsignar < 0){
                me.$vs.notify({
                    text: "El valor no puede ser menor a 0",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            //files
            let imgsEnviarC = []
            let imgsEnviarF = []
            let formData = new FormData();
            //COTIZACION
            me.attachmentArrayCotizacion.forEach(element => {
            imgsEnviarC.push(element.file)
            });
            for(let i=0; i<this.attachmentArrayCotizacion.length;i++){
                formData.append('cotizacion[]',  imgsEnviarC[i]);
            }
            //FACTURA
            me.attachmentArrayFactura.forEach(element => {
            imgsEnviarF.push(element.file)
            });
            for(let i=0; i<this.attachmentArrayFactura.length;i++){
                formData.append('factura[]',  imgsEnviarF[i]);
            }
            formData.append('id',            me.pedido.id)
            formData.append('estado',        4)
            formData.append('valor_total',   me.valorAsignar)
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            me.$vs.loading()
            axios.post(this.$data_url + 'api/saveCotizacionFactura', formData, config)
            .then(function (res) {
                me.$vs.loading.close()
                me.$vs.notify({
                text:"Se guardo correctamente",
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                me.attachmentArrayCotizacion           = []
                me.attachmentArrayFactura              = []
                me.valorAsignar                        = 0
                me.popupAsignarValor                   = false
                me.recharge()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        //FIN METODOS PARA ASIGNAR VALOR
    },
}
</script>
<style scoped>
.imagen{
    cursor:pointer;
    opacity:0.8;
    transition: 1s ease all;
}
.imagen:hover{
    text-decoration: underline;
    color:#217bc5;
    text-shadow:2px 4px 2px #ccc;
}
</style>
