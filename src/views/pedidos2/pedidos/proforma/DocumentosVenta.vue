<template>
<div>
    <!--MENU-->
    <vs-divider>Documentos:</vs-divider>
    <div class="flex" style="flex-wrap:wrap;">
        <ul class="flex">
            <li>
                <vs-radio v-model="tipodoc" v-if="desdePendientes == 0" vs-name="radiostipo" vs-value="0">Todas</vs-radio>
            </li>
            <li>
                <vs-radio v-model="tipodoc" class="ml-2" vs-name="radiostipo" vs-value="1">Pre Facturas</vs-radio>
            </li>
            <li>
                <vs-radio v-model="tipodoc" v-if="desdePendientes == 0" class="ml-2" vs-name="radiostipo" vs-value="2">Notas </vs-radio>
            </li>
        </ul>
    </div>
    <vx-card :title="titleDocumento">
        <div>
            <div class="vx-row">
                <div class="caja1 vx-col w-full  mb-6">
                    <vs-table max-items="10" stripe pagination search :data="facturas">
                        <template slot="header">
                            <vs-col vs-type="flex" vs-w="auto" class="mt-2 m-3">
                                <vs-chip color="primary">Cantidad: <b>{{ facturas.length }} </b></vs-chip>
                                <vs-button type="border" style="border-radius: 40%;" color="primary" class="ml-5 mr-4" @click="getfacturas();" icon="refresh" />
                                <ul class="flex" v-if="desdePendientes == 1">
                                    <li class="mt-1 mr-3">
                                        <vs-checkbox @input="filtroTipo" v-model="checkEnviadasPerseo"> Mostrar enviadas a perseo</vs-checkbox>
                                    </li>
                                    <li class="mt-1 mr-3" v-if="checkEnviadasPerseo">
                                        <vs-checkbox @input="filtroTipo" v-model="checkAnuladasPerseo"> Mostrar <b>{{ noAnuladosPerseo }}</b> anuladas pendientes</vs-checkbox>
                                    </li>
                                    <li class="mr-3" v-if="checkAnuladasPerseo">
                                        <p class="font-bold" style="font-size: 18px;">|</p>
                                    </li>
                                    <li v-if="checkAnuladasPerseo" class="mt-2 mr-3">
                                        <vs-radio v-model="tipoPerseoAnular" color="warning" @input="filtroTipo" vs-name="radios1tipoPerseoAnular" vs-value="0"><b>{{ noAnuladosPerseo }}</b> Pendientes por anular en perseo</vs-radio>
                                    </li>
                                    <li v-if="checkAnuladasPerseo" class="mt-2">
                                        <vs-radio v-model="tipoPerseoAnular" color="warning" @input="filtroTipo" vs-name="radios1tipoPerseoAnular" vs-value="1"><b>{{ sumarAnuladasPerseo }}</b> Anuladas en perseo</vs-radio>
                                    </li>
                                </ul>
                            </vs-col>
                        </template>
                        <template slot="thead">
                            <vs-th> Id </vs-th>
                            <vs-th> Datos </vs-th>
                            <vs-th> Referencia</vs-th>
                            <vs-th>Libro</vs-th>
                            <vs-th> Estado</vs-th>
                            <vs-th> Acciones </vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{ tr.ven_codigo }}<br><br>
                                    <b>Grupo id:</b>
                                    <p>{{ tr.idPuntoventa }}</p>
                                </vs-td>
                                <vs-td>
                                    <b>Empresa:</b>
                                    <p>{{ tr.empresa }}</p>
                                    <b>Cliente:</b>
                                    <p>{{ tr.cliente }}</p>
                                    <b>Cliente RUC:</b>
                                    <p>{{ tr.ruc_cliente }}</p>
                                    <br>
                                    <b>Punto de venta:</b>
                                    <p>{{tr.nombreInstitucion}}</p>
                                    <b>Punto de venta RUC:</b>
                                    <p>{{ tr.rucPuntoVenta }}</p>
                                </vs-td>
                                <vs-td> {{ tr.ven_idproforma }}
                                    <br>
                                    <b>Responsable:</b>
                                    <p>{{ tr.responsable }}</p><br>
                                    <span v-if="tr.ven_tipo_inst=='V'"><b>Asesor:</b> {{tr.asesor}}</span><br>
                                    <b>Fecha creación:</b>
                                    <p>{{ tr.ven_fecha }}</p>
                                    <div v-if="tr.est_ven_codigo == 1">
                                      <b v-if="tr.fecha_proceso_despacho">Fecha despachado:</b>
                                      <p v-if="tr.fecha_proceso_despacho">{{ tr.fecha_proceso_despacho }}</p>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <b>Cantidad de ítems:</b>
                                    <p>{{ tr.item  }}</p>
                                    <b>Cantidad de libros:</b>
                                    <p>{{ tr.libros  }}</p>
                                    <b>Valor:</b>
                                    <p>${{ tr.ven_valor  }}</p>
                                    <b>Porcentaje:</b> {{ tr.ven_desc_por}}%
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.estadoPerseo == 1">
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #0000ff" v-if="tr.estadoPerseo == 1 && tr.idtipodoc==1" color="primary">Enviado a perseo</div>
                                        <b>Proforma perseo:</b>
                                        <p>{{ tr.proformas_codigo}}</p>
                                        <b>Fecha enviado a perseo:</b>
                                        <p>{{ tr.fecha_envio_perseo }}</p>
                                        <div v-if="tr.est_ven_codigo == 3">
                                            <b>Anulado en perseo:</b>
                                            <p v-if="tr.anuladoEnPerseo == 1">Si</p>
                                            <p v-if="tr.anuladoEnPerseo == 0">No</p>
                                        </div>
                                        <br>

                                    </div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #ff0000" v-if="tr.est_ven_codigo === 3" color="danger">Anulado</div>
                                    <div v-if="tr.usuario_anulado">
                                        <b>Anulado por:</b>
                                        <p>{{ tr.usuario_anulado }}</p>
                                    </div>
                                    <div v-if="tr.fecha_anulacion">
                                        <b>Fecha de anulado:</b>
                                        <p>{{ tr.fecha_anulacion }}</p>
                                    </div>
                                    <div v-if="tr.observacionAnulacion">
                                        <b>Observación anulado:</b>
                                        <p>{{ tr.observacionAnulacion }}</p>
                                    </div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #23BF23" v-if="tr.est_ven_codigo === 1" color="#23BF23">Despachado</div>
                                    <div v-if="tr.est_ven_codigo === 2">
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: DarkOrange" color="DarkOrange">Pendiente de despacho</div>
                                        <br><br>
                                        <!-- <vs-button v-if="tr.estadoPerseo == 0 && tr.idtipodoc==1 && tr.est_ven_codigo != 3" color="dark" type="border" class="p-3" @click="ObjectSelected=tr;confirmEnviarPerseo(tr)"><i class="fa-brands fa-discord"></i> Enviar a perseo </vs-button> -->
                                    </div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #00BFBF" v-if="tr.est_ven_codigo === 4" color="#00BFBF">Liquidado</div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #D86161" v-if="tr.est_ven_codigo === 5" color="#D86161">Deuda</div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #009999" v-if="tr.est_ven_codigo === 6" color="#009999">Cargado</div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #FF7C26" v-if="tr.est_ven_codigo === 7" color="#FF7C26">Por depositar</div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #D800D8" v-if="tr.est_ven_codigo === 8" color="#D800D8">Sin cuenta</div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #FF2626" v-if="tr.est_ven_codigo === 9" color="#FF2626">Error cuenta</div>
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #AF7AC5" v-if="tr.est_ven_codigo === 10" color="#AF7AC5">Empacado</div>
                                    <!--ANULADO EN PERSEO-->
                                    <div v-if="tr.est_ven_codigo === 3 && tr.estadoPerseo === 1" class="mt-5">
                                        <div @click="ObjectSelected=tr;openConfirmAnularPerseo(tr);" style="padding:5px; border-radius:5px; color:black; font-size:10px;text-align:center; font-weight:bold;border:5px solid #AF7AC5;cursor:pointer;" v-if="tr.anuladoEnPerseo == 0" color="danger"><i class="fa-solid fa-triangle-exclamation"></i> Marcar como anulado en Perseo</div>
                                        <br>
                                    </div>

                                    <!--INTERCAMBIO-->
                                    <div v-if="tr.doc_intercambio" class="mt-5">
                                        <b class="text-danger">{{tr.idtipodoc == 1? 'Prefactura movida':'Nota movida'}}:</b>
                                        <p>{{ tr.doc_intercambio }}</p>
                                        <b>Responsable:</b>
                                        <p>{{ tr.user_intercambio }}</p>
                                        <b>Fecha de movimiento:</b>
                                        <p>{{ tr.fecha_intercambio }}</p>
                                        <b v-if="tr.observacion_intercambio">Observación de movimiento:</b>
                                        <p v-if="tr.observacion_intercambio">{{ tr.observacion_intercambio }}</p>
                                    </div>
                                    <!--observacionRegresarAPendiente-->
                                    <div v-if="tr.observacionRegresarAPendiente">
                                        <p class="font-bold text-danger"><i class="fa-solid fa-circle-exclamation"></i> Observación de despacho:</p>
                                        <p>{{ tr.observacionRegresarAPendiente }}</p>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <vs-dropdown vs-custom-content vs-trigger-click>
                                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                        <vs-dropdown-menu style="width: 320px;" class="cursor">
                                            <vs-dropdown-item v-if="tr.est_ven_codigo == 2 && tr.doc_intercambio==null">
                                                <vs-button color="grey" type="line" class="w-full" @click="openPopup(tr)">Cambiar Lugar Despacho</vs-button>
                                            </vs-dropdown-item>
                                            <vs-dropdown-item>
                                                <vs-button color="#28C76F" type="line" class="w-full" @click="factu= tr;getDocumentos(tr.ven_codigo, tr.id_empresa)">Generar pdf </vs-button>
                                            </vs-dropdown-item>
                                            <!-- <vs-dropdown-item v-if="tr.idtipodoc==3||tr.idtipodoc==4">
                                              METODO ANTIGUO DE IMPRESION  <vs-button color="DarkOrchid" type="line" class="w-full" @click="factu= tr;tip=1;getreporte(tr);">Generar pdf</vs-button>
                                          </vs-dropdown-item> -->
                                            <vs-dropdown-item v-if="tr.idtipodoc==3||tr.idtipodoc==4">
                                                <vs-button color="DarkOrchid" type="line" class="w-full" @click="factu= tr;tip=2;getreporte(tr);">Imprimir sin formato</vs-button>
                                            </vs-dropdown-item>
                                            <!-- <vs-dropdown-item v-if="tr.idtipodoc==1">
                                              METODO ANTIGUO DE IMPRESION <vs-button color="DarkOrchid" type="line" class="w-full" @click="factu= tr;getreporte(tr);">Generar pdf </vs-button>
                                          </vs-dropdown-item> -->
                                            <vs-dropdown-item v-if="userRoot &&tr.est_ven_codigo != 3 && !tr.doc_intercambio">
                                                <vs-button color="Coral" type="line" class="w-full" @click="popup_anu(tr)">Anular</vs-button>
                                            </vs-dropdown-item>
                                            <vs-dropdown-item v-if="!userRoot &&tr.est_ven_codigo == 2 && !tr.doc_intercambio">
                                                <vs-button color="Coral" type="line" class="w-full" @click="popup_anu(tr)">Anular</vs-button>
                                            </vs-dropdown-item>
                                            <vs-dropdown-item v-if="tr.est_ven_codigo == 2&&usuario.id_group==1&& tr.doc_intercambio==null">
                                                <vs-button color="success" type="line" class="w-full" @click="ObjectSelected = tr;popup_des(tr)">Despachar</vs-button>
                                            </vs-dropdown-item>
                                            <!--mover a prefactura-->
                                            <vs-dropdown-item v-if="tr.idtipodoc!=1&&tr.est_ven_codigo != 3&&!tr.doc_intercambio&&groupFacturador&&!tr.doc_intercambio">
                                                <vs-button color="#d5a518" type="line" class="w-full" @click="ObjectSelected=tr;openModalMoverNotas(tr);">Mover a Pre Factura</vs-button>
                                            </vs-dropdown-item>
                                            <!--actualizar porcentaje-->
                                            <vs-dropdown-item v-if="userRoot && tr.doc_intercambio==null">
                                                <vs-button color="primary" type="line" class="w-full" @click="tr_data = tr;Actualizar_Porcentaje()">Actualizar porcentaje</vs-button>
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </div>
        </div>
        <vs-popup fullscreen v-if="isPopupOpen" :active.sync="isPopupOpen" :title="'Editar Documento: ' + editData.documentoVenta" class="p-6">
            <!-- <vs-popup v-if="isPopupOpen" :active.sync="isPopupOpen" :title="'Editar Documento: ' + editData.documentoVenta" class="bg-white rounded-lg p-6 shadow-lg"> -->
            <template #header>
                <h4 class="text-lg font-semibold text-gray-800 mb-4">Editar Datos</h4>
            </template>
            <template #default>
                <div class="flex flex-col space-y-4">
                    <vs-divider>Datos a Originales del Docuemnto</vs-divider>
                    <div class="mb-3">
                        <!-- <vs-input v-model="editDataOriginal.id_institucion" label="Institucion Del Documento #" disabled class="w-full"></vs-input> -->
                        <vs-input v-model="editDataOriginal.nombreInstitucion" label="Nombre Institución Del Documento" disabled class="w-full"></vs-input>
                    </div>
                    <vs-divider>Datos a Cambiar en el Docuemnto</vs-divider>
                    <div class="my-3">
                        <!-- <vs-input v-model="editData.id_institucion" label="Institucion a cambiar#" class="w-full" readonly></vs-input> -->
                        <vs-input v-model="editData.nombreInstitucion" label="Nombre Institución a cambiar" class="w-full" readonly></vs-input>
                    </div>
                </div>
                <div class="my-5">
                    <DatosDespachoVue ref="clientePerseoRef" :empresa="String(editData.empresa)" :editData="editData" :id_periodo="setPuntos.id_periodo" @enviarDatosDespacho="enviarDatosDespacho" />
                </div>
                <div class="flex justify-center mt-6 space-x-4">
                    <vs-button class="btn btn-success" @click="saveInfoEdit">Guardar</vs-button>
                    <vs-button @click="isPopupOpen = false;" class="btn btn-danger">Cancelar</vs-button>
                </div>
            </template>
        </vs-popup>
        <vs-popup fullscreen :title="`${factura.id}`" v-if="tdo==1&&factura.id" :active.sync="popupImprimir">
            <facturaVue v-if="popupImprimir" :factu="factu" :id="factura.id" @change="change" />
        </vs-popup>
        <!-- <div v-if="tdo==1&&factura.id">
              <facturaVue style="display:none;" :factu="factu" :id="factura.id" @change="change"/>
          </div> -->
        <vs-popup fullscreen :title="`${factura.id}`" v-if="(tdo==2||tdo==3)&&factura.id&&tip" :active.sync="popupImprime">
            <notaVue v-if="popupImprime" :factu="factu" :id="factura.id" :tipo="tip" @change="change" />
        </vs-popup>
        <!-- <div v-if="(tdo==2||tdo==3)&&factura.id&&tip">
              <notaVue style="display:none;" :factu="factu" :id="factura.id" :tipo="tip" @change="change"/>
          </div> -->
    </vx-card>
    <!-- anulacion del documento -->
    <vs-popup class="Anular" :title="`¿Confirma que desea anular documento de venta Nº : ${factura.id}?`" :active.sync="popupAnular">
        <div>
            <!--observacion anulacion input-->
            <vs-input v-model="observacionAnulacion" class="w-full mt-4" label="Comentario(Obligatorio)" />
        </div>
        <br>
        <div class="flex justify-center mt-1">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="anular(); popupAnular=false" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="popupAnular=false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </div>
    </vs-popup>
    <vs-popup class="despachar" :title="`¿Confirma que desea depachar documento de venta Nº : ${factura.id}?`" :active.sync="popupDespachar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="despachar(); popupDespachar=false" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="popupDespachar=false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!--modal para mover notas-->
    <vs-popup classContent="popup-example" title="Mover nota" :active.sync="popupMoverNotas">
        <div v-if="popupMoverNotas">
            <b>Cliente:</b>
            <p>{{ObjectSelected.nombreInstitucion}}</p>

            <MoverNotasReceptorVue class="mt-1" @openConfirmMove="openConfirmMove" :periodo_id="ObjectSelected.periodo_id" :ObjectSelected="ObjectSelected" />
        </div>
    </vs-popup>
    <!-- SECCION ACTUALIZACION PORCENTAJE -->
    <vs-popup class="informacionformhijo" @close="getfacturas()" :title="`Actualizar porcentaje del documento: ${tr_data.ven_codigo}`" :active.sync="popupActualizarPorcentaje">
        <ActualizaPorcentajeComponent v-if="popupActualizarPorcentaje" :tr_data="tr_data" @change="changeHandleActualizar_Porcentaje" />
    </vs-popup>
    <vs-popup fullscreen :active.sync="popupDocumento" v-if="popupDocumento" :title="'Detalle:'+factu.ven_codigo">
        <documentoVenta :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta" />
    </vs-popup>
</div>
</template>


<script>
// Importa tu modal de carga
import {
    mapState
} from "vuex";
import Generalmix from "../../../../mixins/Generalmix";
const facturaVue = () => import('./factura.vue');
const notaVue = () => import('./nota.vue');
const DatosDespachoVue = () => import('@/views/pedidos2/pedidos/proforma/components/DatosDespachoInst.vue')
const MoverNotasReceptorVue = () => import('../documentos/moverNotas/MoverNotasReceptor.vue')
const ActualizaPorcentajeComponent = () => import('@/views/pedidos2/pedidos/proforma/components/DocumentoVenta_ActualizarPorcentaje.vue')
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
export default {
    mixins: [Generalmix],
    components: {
        facturaVue,
        notaVue,
        DatosDespachoVue,
        MoverNotasReceptorVue,
        ActualizaPorcentajeComponent,
        documentoVenta,
    },

    data: () => ({
        tdo: '',
        tip: '',
        tipodoc: 0,
        setMenu: '',
        setPuntos: '',
        documentos: [],
        facturas: [],
        usuario: [],
        deta: [],
        factu: [],
        factura: {
            tipo: '',
            img: '',
            id: '',
            estado: '',
            institucion: '',
            empresa: '',
            cliente: '',
            fecha: '',
            telefono: '',
            ruc: '',
            direcccion: '',
            user: '',
            correo: '',
            proforma: '',
            observacion: '',
            descuento: '',
            subtotal: '',
            iva: '',
            descontar: '',
            transporte: '',
            total: '',
        },
        popupDespachar: false,
        popupAnular: false,
        popupImprimir: false,
        popupImprime: false,
        titleDocumento: '',
        checkEnviadasPerseo: false,
        checkAnuladasPerseo: false,
        tipoPerseoAnular: 0,
        ObjectSelected: '',
        isPopupOpen: false,
        editData: {
            id_institucion: '',
            nombreInstitucion: '',
            cliente: '',
            documentoVenta: '',
            documentoProforma: '',
            empresa: 0,
        },
        editDataOriginal: [],
        soloInstitucion: true,
        //variables para mover notas
        popupMoverNotas: false,
        observacionMover: "",
        //fin variables para mover notas,
        observacionAnulacion: '',
        popupActualizarPorcentaje: false,
        tr_data: [],
        //imprimir
        DocumentoDetalleVenta: [],
        DocumentoVenta: [],
        popupDocumento: false,

    }),
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'ObjectPuntos', 'userAsesor', 'groupFacturador']),
        sumarAnuladasPerseo() {
            return this.documentos.filter(p => p.est_ven_codigo == 3 && p.estadoPerseo == 1 && p.anuladoEnPerseo == 1).length
        },
        noAnuladosPerseo() {
            return this.documentos.filter(p => p.est_ven_codigo === 3 && p.estadoPerseo == 1 && p.anuladoEnPerseo == 0).length
        },
    },
    watch: {
        tipodoc(newValue, oldValue) {
            // Aquí puedes ejecutar la función que deseas cuando tipodoc cambie
            this.filtroTipo();
        },
    },
    props: {
        desdePendientes: {
            type: Number,
            default: 0
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if (this.usuario.id_group == 33) {
            this.setMenu = 3
        } else {
            this.setMenu = 1
        }
        if (this.setMenu == 1) {
            if (this.desdePendientes == 1) {
                this.setPuntos = {
                    id_periodo: this.periodoSelect.idperiodoescolar
                };
            } else {
                this.setPuntos = this.ObjectPuntos;
            }
        }
        if (me.desdePendientes == 1) {
            me.tipodoc = 1
            me.titleDocumento = ""
        } else {
            this.tipodoc = 0;
            me.titleDocumento = me.desdePendientes == '0' ? ' ' : 'Informacion #' + me.setPuntos.ca_codigo_agrupado
        }
        this.getfacturas();

    },
    methods: {
        getDocumentos(documentos, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos + '&empresa=' + empresa)
                .then((res) => {
                    me.DocumentoVenta = res.data;
                    if (me.DocumentoVenta.length > 0) {
                        let codigo = me.DocumentoVenta[0].ven_codigo;
                        let empresa = me.DocumentoVenta[0].empresa_id;
                        this.getDocumentosDetalles(codigo, empresa);
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Documento no encontrado.',
                            type: 'error',
                        });
                    }

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        getDocumentosDetalles(codigo, empresa) {
            let me = this;
            // console.log(codigo, empresa,'dsdsadsaddsa');
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
                .then((res) => {
                    this.DocumentoDetalleVenta = res.data;
                    if (this.DocumentoDetalleVenta.length > 0) {
                        this.popupDocumento = true;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Detalle Documento no encontrado.',
                            type: 'error',
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los detalles de los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        Actualizar_Porcentaje() {
            let me = this;
            me.popupActualizarPorcentaje = true;
        },
        changeHandleActualizar_Porcentaje(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificaractualizacionporcentaje == 1) {
                console.log("Emit recibido por guardado.");
                me.popupActualizarPorcentaje = false;
                this.getfacturas();
            } else if (e.verificaractualizacionporcentaje == 2) {
                console.log("Emit recibido por cerrar.");
                this.getfacturas();
                me.popupActualizarPorcentaje = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        saveInfoEdit() {

            let me = this;
            if (!me.editData.id_institucion) {
                me.$vs.notify({
                    text: 'No se cambio correctamente la institución.',
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-x",
                });
                return;
            }
            if (me.editData.id_institucion === me.editDataOriginal.id_institucion) {
                me.$vs.notify({
                    text: 'La institución a cambiar es la misma, no se realizará ninguna actualización.',
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-x",
                });
                return;
            }
            console.log("aa", me.editData)
            const dataToUpdate = {
                documentoVenta: me.editData.documentoVenta,
                id_institucion: me.editData.id_institucion,
                documentoProforma: me.editData.documentoProforma,
                id_empresa: me.editData.empresa,
            };
            me.$vs.loading();
            this.$http.post(this.$server_url + 'updateDocument', dataToUpdate)
                .then(response => {
                    if (response.data.success) {
                        console.log('');
                        me.$vs.notify({
                            text: 'Información actualizada correctamente',
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.isPopupOpen = false;
                        this.getfacturas();

                    } else {
                        console.error(response.data.message);
                    }

                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al actualizar la información:', error);
                });
        },
        enviarDatosDespacho(e) {
            let me = this
            // console.log(e);
            let cambioDatos = e;
            if (!cambioDatos.id_institucion && !cambioDatos.nombreInstitucion) {
                me.editData.id_institucion = me.editDataOriginal.id_institucion
                me.editData.nombreInstitucion = me.editDataOriginal.nombreInstitucion
            } else if (cambioDatos.id_institucion && !cambioDatos.nombreInstitucion) {
                me.editData.id_institucion = me.editDataOriginal.id_institucion
                me.editData.nombreInstitucion = me.editDataOriginal.nombreInstitucion
            } else if (!cambioDatos.id_institucion && cambioDatos.nombreInstitucion) {
                me.editData.id_institucion = me.editDataOriginal.id_institucion
                me.editData.nombreInstitucion = me.editDataOriginal.nombreInstitucion
            } else {
                me.editData.id_institucion = cambioDatos.id_institucion
                me.editData.nombreInstitucion = cambioDatos.nombreInstitucion
            }
            console.log('datos cambiados en el emit', me.editData);
        },
        change(e) {
            if (e == true) {
                this.tdo = 0;
            }
        },
        getreporte(tr) {
            this.tdo = 0;
            this.factura.id = tr.ven_codigo;
            if (tr.idtipodoc == 1) {
                this.tdo = 1;
                this.popupImprimir = true;
            }
            if (tr.idtipodoc == 3 || tr.idtipodoc == 4) {
                if (this.tip == 1) {
                    this.tdo = 2;
                    this.popupImprime = true;
                }
                if (this.tip == 2) {
                    this.tdo = 3;
                    this.popupImprime = true;
                }
            }
        },
        getfacturas() {
            let me = this;
            let buscar = 0;

            me.$vs.loading();
            if (me.setMenu == 1) {
                buscar = me.setPuntos.ca_codigo_agrupado;
            }
            let url = ""
            if (me.desdePendientes == 1) {
                url = "GetFacturasTodas?periodo=" + me.setPuntos.id_periodo
            } else {
                me.idtipodoc = 0
                url = "GetFacturasX?prof_id=" + buscar + '&periodo=' + me.setPuntos.id_periodo
            }
            this.$http
                .get(this.$server_url + url)
                .then((response) => {
                    me.documentos = response.data;
                    me.filtroTipo();
                    me.tdo = 0;
                    if (me.facturas.length === 0) {
                        me.$vs.notify({
                            text: "No existen facturas registradas",
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.cont = 1;
                    }
                    me.$vs.loading.close();
                })
                .catch((error) => {
                    console.error(error);
                    me.$vs.loading.close();
                });
        },
        filtroTipo() {
            let me = this;
            me.tdo = 0;
            me.facturas = []
            //TIPO documento=============
            //todas
            if (me.tipodoc == 0) {
                let datos = me.documentos;
                me.facturas = datos;
            } else
                //Facturas
                if (me.tipodoc == 1) {
                    if (me.desdePendientes == 1) {
                        let datos = []
                        if (me.checkEnviadasPerseo) {
                            datos = me.documentos.filter(p => p.idtipodoc == 1 && p.estadoPerseo == 1);
                        } else {
                            datos = me.documentos.filter(p => p.idtipodoc == 1 && p.estadoPerseo == 0 && p.est_ven_codigo != 3);
                            me.checkAnuladasPerseo = false;
                        }
                        //mostrar anuladas si el checkAnuladasPerseo es true
                        if (me.checkAnuladasPerseo) {
                            datos = datos.filter(p => p.idtipodoc == 1 && p.est_ven_codigo === 3 && p.anuladoEnPerseo == me.tipoPerseoAnular);
                        }
                        me.facturas = datos;
                    } else {
                        let datos = me.documentos.filter(p => p.idtipodoc == 1);
                        me.facturas = datos;
                    }
                } else
                    //Notas
                    if (me.tipodoc == 2) {
                        let datos = me.documentos.filter(p => p.idtipodoc == 3 || p.idtipodoc == 4);
                        me.facturas = datos;
                    } else {

                    }
        },
        startLoading() {
            this.popupcarga = true;
        },
        changeHandle(e) {
            let me = this;
            me.popupcarga = false;
        },
        openPopup(tr) {
            console.log(tr);
            this.isPopupOpen = true;
            this.editData = {
                nombreInstitucion: tr.nombreInstitucion,
                cliente: tr.cliente,
                documentoVenta: tr.ven_codigo,
                documentoProforma: tr.ven_idproforma,
                empresa: tr.id_empresa,
                id_institucion: tr.institucion_id,
            };
            this.editDataOriginal = {
                nombreInstitucion: tr.nombreInstitucion,
                cliente: tr.cliente,
                documentoVenta: tr.ven_codigo,
                documentoProforma: tr.ven_idproforma,
                empresa: tr.id_empresa,
                id_institucion: tr.institucion_id,
            };
        },
        popup_anu(tr) {
            if (tr.est_ven_codigo != 2) {
                //solo si es root podra anular
                if (this.userRoot) {} else {
                    this.$vs.notify({
                        text: "No se permite anular un documento que ya no este pendiente de despacho",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                    return
                }
            }
            this.deta = [];
            this.popupAnular = true;
            this.factura.id = tr.ven_codigo;
            this.factura.empresa = tr.id_empresa;
            this.factura.estado = tr.est_ven_codigo;
            this.factura.tipo = tr.idtipodoc;
            this.factura.proforma = tr.ven_idproforma;
            this.data(tr.ven_codigo, tr.id_empresa);
        },
        async data(a, b) {
            await this.$http.get(this.$server_url + 'Get_DFactura?ven_codigo=' + a + '&idemp=' + b)
                .then(res => {
                    this.deta = res.data;
                    this.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
        anular() {
            let me = this;
            //validar que anular no sea vacio
            if (this.observacionAnulacion == '') {
                me.$vs.notify({
                    text: 'Debe escribir un comentario',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 3000
                })
                me.popupAnular = true
                return
            }
            let formData = new FormData();
            let valornuevo = this.factura.estado;
            if (valornuevo !== 3 && this.deta.length > 0) {
                valornuevo = 3;
                formData.append("dat", JSON.stringify(this.deta));
                formData.append("ven_codigo", this.factura.id);
                formData.append("est_ven_codigo", valornuevo);
                formData.append("tipodoc", this.factura.tipo);
                formData.append("empresa", this.factura.empresa);
                formData.append("proforma", this.factura.proforma);
                formData.append('id_usuario', this.usuario.idusuario);
                formData.append("tipo", 'anular');
                formData.append('observacionAnulacion', this.observacionAnulacion)
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Desactivar_venta", formData)
                    .then((res) => {
                        this.$vs.loading.close();
                        if(res.data.status == 0){
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle',
                                time:3000
                            })
                            this.getfacturas();
                            return;
                        }
                        if (res.status === 200) {
                            this.getfacturas();
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (res.status === 500) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        this.observacionAnulacion = ''
                        this.popupAnular = false;
                    })
                    .catch((error) => {
                        console.log(error);
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo anular",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            } else {
                me.$vs.notify({
                    text: "No se pudo anular",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-x",
                });
            }
        },
        popup_des(tr) {
            this.popupDespachar = true;
            this.factura.id = tr.ven_codigo;
            this.factura.estado = tr.est_ven_codigo;
        },
        despachar() {
            let me = this;
            let datos = {
                ven_codigo: this.factura.id,
                est_ven_codigo: 1,
                id_empresa: this.ObjectSelected.id_empresa,
                user_despacha: this.usuario.idusuario
            };
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "Desactivar_venta", datos)
                .then((res) => {
                    me.$vs.loading.close();
                     if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time:3000
                        })
                        this.getfacturas();
                        return
                    }
                    this.getfacturas();
                    me.$vs.notify({
                        text: "Despacho exitoso",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    this.popupDespachar = false;
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "No se pudo despachar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });

        },
        //METODOS DE PERSEO
        confirmEnviarPerseo(tr) {
            this.ObjectSelected = tr;
            this.$vs.dialog({
                type: 'confirm',
                color: 'dark',
                title: 'Enviar a Perseo',
                text: `¿Está seguro de enviar la pre factura ${tr.ven_codigo} a Perseo?`,
                acceptText: 'Aceptar',
                accept: this.enviarPerseo,
                cancelText: 'Cancelar',
                cancel: false
            })
        },
        enviarPerseo() {
            let me = this;
            let formData = new FormData();
            formData.append("ven_codigo", this.ObjectSelected.ven_codigo);
            //id_empresa
            formData.append("id_empresa", this.ObjectSelected.id_empresa)
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "api/perseo/transaccion/proformas_crear", formData)
                .then((res) => {
                    if (res.data != null || res.data != undefined || res.data != 0) {
                        me.$vs.loading.close();
                        if (res.data.status == 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            return;
                        }
                        if (res.data.fault) {
                            me.$vs.notify({
                                text: "Ocurrio un error en el envío a Perseo",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            return;
                        }
                        me.getfacturas();
                        me.$vs.notify({
                            text: "Envío a Perseo exitoso",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    } else {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "Se produjo algún fallo en el envío a Perseo",
                            color: "#F8C471",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "No se pudo enviar a Perseo",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        openConfirmAnularPerseo(tr) {
            let me = this
            this.$vs.dialog({
                type: 'confirm',
                color: 'dark',
                title: 'Enviar a Perseo',
                text: `¿Está seguro de marcar como anulado en perseo la pre factura ${tr.ven_codigo} ?`,
                acceptText: 'Aceptar',
                accept: this.f_marcarWithAnulado,
                cancelText: 'Cancelar',
                cancel: false
            })
        },
        f_marcarWithAnulado() {
            let me = this
            let formData = new FormData();
            formData.append("ven_codigo", this.ObjectSelected.ven_codigo);
            //id_empresa
            formData.append("id_empresa", this.ObjectSelected.id_empresa)
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "marcarComoAnuladoPerseoPrefactura", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        return;
                    }
                    me.getfacturas();
                    me.$vs.notify({
                        text: res.data.message,
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "No se pudo marcar como anulado en perseo",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        //FIN METODOS DE PERSEO
        //METODOS PARA MOVER NOTAS A PRE FACTURA
        openModalMoverNotas() {
            let me = this;
            me.popupMoverNotas = true;
        },
        openConfirmMove(e, datos) {
            let me = this
            me.observacionMover = ""
            if (e == 0) {
                me.observacionMover = datos.observacion
            }
            me.popupMoverNotas = false
            //confirm de estas seguro de mover a pre factura
            me.$vs.dialog({
                type: 'confirm',
                color: "danger",
                title: "Confirmación",
                text: `¿Está seguro de mover la nota ${me.ObjectSelected.ven_codigo} a una pre factura?`,
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: () => {
                    this.moverNotaPrefactura(); // Asegúrate de que esta función esté definida en el contexto
                },
                cancel: () => {
                    this.popupMoverNotas = true;
                }
            });
        },
        moverNotaPrefactura() {
            let me = this
            let formData = new FormData();
            formData.append('ven_codigo', me.ObjectSelected.ven_codigo);
            //id empresa
            formData.append('id_empresa', me.ObjectSelected.id_empresa);
            //id periodo
            formData.append('id_periodo', me.ObjectSelected.periodo_id);
            //id usuario
            formData.append('id_usuario', me.usuario.idusuario);
            //iniciales
            formData.append('iniciales', me.usuario.iniciales);
            //observacion
            formData.append('observacion', me.observacionMover);
            if (me.usuario.iniciales == '' || me.usuario.iniciales == null || me.usuario.iniciales == undefined || me.usuario.iniciales == 0) {
                me.m_message('Debe usuario no tiene iniciales', 'danger')
                return
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + 'notasMoverToPrefactura', formData)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.m_message(res.data.message, 'danger')
                        return
                    }
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    //recargar
                    me.getfacturas();
                    me.popupMoverNotas = false
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                    me.m_message('Error al mover nota a pre factura', 'danger')
                })
        },
    }
}
</script>
