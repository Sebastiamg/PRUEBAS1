<template>
<!--TABLA-->
<div>
    <div>
        <vs-row>
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Filtros para agrupados</p>
                <br />
                <vs-card>
                    <div>
                        <div v-if="valorBusqueda_RadioB == '1'">
                            <vs-row>
                                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                    <vs-col vs-justify="center" vs-align="center" vs-w="6" class="m-2">
                                        <font style="font-size: 11.5px">&nbsp;Estados Proformas:</font><br />
                                        <v-select style="font-size: 12px;" :options="arrayEstadosProforma" :reduce="arrayEstadosProforma => arrayEstadosProforma.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="valorBusqueda_SelectProforma" @input="FiltroAgrupados()" ref="valorBusqueda_SelectProforma" :class="classvalidar_valorBusqueda_SelectProforma" />
                                    </vs-col>
                                </vs-row>
                            </vs-row>
                        </div>
                        <div v-if="valorBusqueda_RadioB == '2'">
                            <vs-row>
                                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                    <vs-col vs-justify="center" vs-align="center" vs-w="6" class="m-2">
                                        <font style="font-size: 11.5px">&nbsp;Estados Documentos de Venta:</font><br />
                                        <v-select style="font-size: 12px;" :options="arrayEstadosDocumentoVenta" :reduce="arrayEstadosDocumentoVenta => arrayEstadosDocumentoVenta.est_ven_codigo" label="est_ven_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="valorBusqueda_SelectDocumentoVenta" @input="FiltroAgrupados()" ref="valorBusqueda_SelectDocumentoVenta" :class="classvalidar_valorBusqueda_SelectDocumentoVenta" />
                                    </vs-col>
                                </vs-row>
                            </vs-row>
                        </div>
                    </div>
                    <div>
                        <ul class="flex"  style="display: flex; margin: 0px 0px 0px 20px; flex-wrap: wrap;">
                            <li class="modelx"></li>
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda_RadioB" @change="FiltroAgrupados()">Todos</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios1" vs-value="3" v-model="valorBusqueda_RadioB" @change="FiltroAgrupados()">Sin proformas</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios1" vs-value="4" v-model="valorBusqueda_RadioB" @change="FiltroAgrupados()">Sin documentos de venta</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda_RadioB" @change="FiltroAgrupados()">Estados de proformas</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios1" vs-value="2" v-model="valorBusqueda_RadioB" @change="FiltroAgrupados()">Estados de documentos de venta</vs-radio>
                            </li>
                        </ul>
                    </div>
                    <div align="center">
                        <div v-if="valorBusqueda_RadioB == 1 && textoEstadoSeleccionado_proforma != ''" style="font-size: 14px; font-weight: bold; font-style: italic;">
                            Se mostrarán los agrupados con al menos una proforma en estado: <b style="color: red;">'{{ textoEstadoSeleccionado_proforma }}'.</b>
                        </div>
                        <div v-if="valorBusqueda_RadioB == 2 && textoEstadoSeleccionado_documento != ''" style="font-size: 14px; font-weight: bold; font-style: italic;">
                            Se mostrarán los agrupados con al menos un documento de venta en estado: <b style="color: red;">'{{ textoEstadoSeleccionado_documento }}'.</b>
                        </div>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
    <vs-table max-items="20" search stripe :data="puntosFiltrados" pagination no-data-text="No hay datos disponibles" :key="TablaAgrupados">
            <template slot="header">
                <div class="flex items-center">
                    <span class="ml-1 font-bold">Filtrar:</span>
                    <label class="ml-3 flex items-center">
                        <vs-radio v-model="agrupadoFiltro" vs-name="agrupadoFiltro" vs-value="todos" @input="filtrarAgrupados">Todos</vs-radio>
                        <span class="ml-1">({{ puntosOriginal.length }})</span>
                    </label>
                    <label class="ml-3 flex items-center">
                        <vs-radio v-model="agrupadoFiltro" vs-name="agrupadoFiltro" vs-value="activos" @input="filtrarAgrupados">Activos</vs-radio>
                        <span class="ml-1">({{ puntosOriginal.filter(p => p.ca_estado == 1).length }})</span>
                    </label>
                    <label class="ml-3 flex items-center">
                        <vs-radio v-model="agrupadoFiltro" vs-name="agrupadoFiltro" vs-value="inactivos" @input="filtrarAgrupados">Inactivos</vs-radio>
                        <span class="ml-1">({{ puntosOriginal.filter(p => p.ca_estado == 0).length }})</span>
                    </label>
                </div>
                <vs-dropdown v-if="preproformasList.length>0">
                    <vs-button class="btn-drop" type="line" color="danger">Solicitudes pendientes: {{preproformasList.length}}</vs-button>
                    <vs-dropdown-menu>
                        <vs-dropdown-item v-for="(tr,soli) in preproformasList" :key="tr" style="width: 150px;">
                            <vs-button type="flat" @click="handlePreproformaClick(soli)">{{ preproformasList[soli] }}</vs-button>
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </template>
            <template slot="thead">
                <!-- <vs-th>#</vs-th> -->
                <vs-th width="30%">Detalle Grupo</vs-th>
                <!-- <vs-th width="15%">Contratos </vs-th> -->
                <vs-th width="60%">Documentos</vs-th>
                <vs-th width="10%">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <h4>{{ tr.ca_codigo_agrupado }}</h4><br>
                        <b>Estado:</b>
                        <p v-if="tr.ca_estado == 1">Activo</p>
                        <p v-if="tr.ca_estado == 0" class="text-danger font-medium">Inactivo</p>
                        <b>Descripción:</b>
                        <p>{{ tr.ca_descripcion }}</p>
                        <b>Tipo:</b>
                        <p v-if="tr.ca_tipo_pedido == 1">Venta directa</p>
                        <p v-if="tr.ca_tipo_pedido == 2">Venta Lista</p><br>
                        <span>{{ tr.ca_descripcion }} </span><br>
                        <span><b>Fecha creación:</b> {{ tr.datoAgrupado[0].created_at }}</span><br>
                        <b>Puntos o Instituciones Proformados:</b>
                        <div class="overflow-y-auto h-24">
                            <ul v-for="(item,key2) in tr.Instituciones" :key="key2">
                                <li class="my-2">
                                    <!-- <i class="fa-regular fa-pen-to-square"></i>  -->
                                    <span class="ml-2">{{item.nombreInstitucion}}</span>
                                </li>
                            </ul>
                        </div>
                    </vs-td>
                    <vs-td height="70%" width="100%">
                        <b><span>Cantidad Contratos: </span>{{ tr.pedidos.length }}</b><br />
                        <div class="flex">
                            <div class="overflow-y-auto" style="max-height: 50px;">
                                <div>
                                    <ul v-for="(item,key2) in tr.pedidos" :key="key2">
                                        <li>{{item.contrato_generado}} <span class="ml-3">( {{item.asesor}} )</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div style="width: 5%;">
                                <!-- Botón único para ver todos los contratos -->
                                <vs-button class="vs-button--small" type="line" @click="showAllContractsInfo(tr.pedidos)" style="padding: 2px 5px; font-size: 10px; margin-left: 5px;">Ver mas</vs-button>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <b v-if="tr.preproformas.length>0"><span>Cantidad Pre-Proformas: </span>{{ tr.preproformas.length }}</b><br />
                        <b v-if="tr.documentos.length>0"><span>Cantidad Documentos: </span>{{ tr.documentos.length }}</b><br />
                        <div class="w-full">
                            <table class="w-full">
                                <tr width="100%">
                                    <td width="50%" v-if="tr.preproformas.length>0">
                                        <b>Pre-Proformas</b><br>
                                        <div class="overflow-y-auto" style="max-height: 200px;">
                                            <ul v-for="(item,key2) in tr.preproformas" :key="key2">
                                                <table width="100%">
                                                    <tr>
                                                        <td style="padding: 3px;" width="55%">
                                                            <li style="font-size: 13px;">{{item.prof_id}}</li>
                                                        </td>
                                                        <td style="padding: 3px;" width="1%">=</td>
                                                        <td style="padding: 3px;" width="44%">
                                                            <vs-chip v-if="item.prof_estado == 0" color="Red">Anulado</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == 1" color="DarkOrange">Pendiente</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == 2" color="MediumSeaGreen">Finalizado</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == 3" color="SlateBlue">Aprobado</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == 4" color="#AD4497">Preaprobado</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == 5" color="#AD4497">Aceptado</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == 6" color="#e34b19">Aprobado con pendiente</vs-chip>
                                                            <vs-chip v-if="item.prof_estado == null" color="#808080">Sin estado</vs-chip>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </ul>
                                        </div>
                                    </td>
                                    <td width="50%" v-if="tr.documentos.length>0">
                                        <b>Documentos</b> <br>
                                        <div class="overflow-y-auto" style="max-height: 200px;">
                                            <ul v-for="(item2,key3) in tr.documentos" :key="key3">
                                                <table width="100%">
                                                    <tr>
                                                        <td style="padding: 3px;" width="55%">
                                                            <li style="font-size: 13px;">{{item2.ven_codigo}}</li>
                                                        </td>
                                                        <td style="padding: 3px;" width="1%">=</td>
                                                        <td style="padding: 3px;" width="44%">
                                                            <vs-chip v-if="item2.est_ven_codigo == 1" color="#23BF23">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 2" color="DarkOrange">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 3" color="danger">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 4" color="#00BFBF">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 5" color="#D86161">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 6" color="#009999">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 7" color="#FF7C26">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 8" color="#D800D8">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 9" color="#FF2626">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 10" color="#8E44AD">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 11" color="#5D6D7E">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 12" color="#2874A6">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 13" color="#1ABC9C">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 14" color="#D35400">{{item2.est_ven_nombre}}</vs-chip>
                                                            <vs-chip v-if="item2.est_ven_codigo == 15" color="#C0392B">{{item2.est_ven_nombre}}</vs-chip>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </vs-td>
                    <vs-td align="center">
                        <vs-alert color="danger" icon="warning" v-if="tr.aprobacionPendientes">
                            <b>Agrupado con Pendientes.</b>
                        </vs-alert><br>
                        <!--ver-->
                        <vs-button color="#de923b" type="border" class="w-full" @click="ver_pedido(tr)">Ventas</vs-button>
                        <!--boton desactivar-->
                        <vs-button color="#c0392b" type="border" v-if="tr.pedidos.length == 0 && tr.ca_estado == 1" class="w-full mt-3" @click="confirmarAnular(tr)"><i class="fa-solid fa-circle-xmark"></i> Anular</vs-button>
                        <!--boton activar-->
                        <vs-button color="#2ecc71" type="border" v-if="tr.ca_estado == 0" class="w-full mt-2" @click="confirmarActivar(tr)"><i class="fa-solid fa-circle-check"></i> Activar</vs-button>
                        <vs-button color="#3243c2" v-if="tr.ruc_ci.length>0 && usuario.id_group == 1" type="flat" class="w-full mt-2" @click="entrarGruias(tr.ruc_ci)">Ver Guias Remision</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <!--modales-->
    <vs-popup classContent="popup-example" title="Datos Factura" :active.sync="popupActivoEditar" fullscreen>
        <div v-if="popupActivoEditar">
            <FacturacionInformacionInstitucionVue :institucion_id="ObjectSelected.id_ins_depacho" @changeSaveInformacion="getpuntos" />
        </div>
    </vs-popup>
    <!-- Modal para mostrar información completa de todos los contratos -->
    <vs-popup title="Información Completa de los Contratos" :active.sync="isAllContractsInfoVisible">
        <div v-if="allContractsInfo && allContractsInfo.length > 0">
            <div v-for="(contract, index) in allContractsInfo" :key="index">
                <p><strong>Contrato Generado:</strong> {{ contract.contrato_generado }}</p>
                <p><strong>Asesor:</strong> {{ contract.asesor }}</p>
                <p><strong>Nombre Institución:</strong> {{ contract.nombreInstitucion }}</p>
                <p><strong>Ciudad:</strong> {{ contract.ciudad }}</p>
                <p><strong>RUC:</strong> {{ contract.ruc }}</p>
                <p><strong>Descuento:</strong> {{ contract.descuento }}%</p>
                <vs-divider></vs-divider>
            </div>
        </div>
        <div v-else>
            <p>No hay contratos disponibles.</p>
        </div>
    </vs-popup>
    <!--modal guias remision-->
    <vs-popup title="Guias de Remision" :active.sync="popupRemision" fullscreen>
        <div v-if="popupRemision">
            <GruiasRemisionVue v-if="popupRemision" :guias_remision_rucs="guias_remision_rucs" :periodoSelect="periodoSelect"/>
        </div>
    </vs-popup>
</div>
</template>


<script>
import {
    FormWizard,
    TabContent
} from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from "vue-select";
const DatosFacturaVue = () => import('../pedidos2/pedidos/institucion/datosFactura/facturadatos.vue');
const FacturacionInformacionInstitucionVue = () => import('../pedidos2/pedidos/proforma/components/FacturacionInformacionInstitucion.vue');
const GruiasRemisionVue = () => import('@/views/bodega/guias_remision/guias_remision_list.vue');
export default {
    components: {
        "v-select": vSelect,
        flatPickr,
        DatosFacturaVue,
        FormWizard,
        TabContent,
        FacturacionInformacionInstitucionVue,
        GruiasRemisionVue
    },
    data() {
        return {
            tes: 0,
            responsables: '',
            filtroCedula: '',
            filtrocedula: '',
            ifCrearBeneficiario: false,
            dato: [],
            usuario: [],
            puntos: [],
            preproformasList: [],
            puntosDeVenta: {
                id: '',
                email: '',
                nombreDespacho: '',
                ruc: '',
                telefono: '',
            },
            popupActivoEditar: false,
            ObjectSelected: '',
            //modal contratos
            isAllContractsInfoVisible: false, // Controla la visibilidad del popup
            allContractsInfo: [], // Aquí almacenamos la información de todos los contratos
            valorBusqueda_RadioB: 0,
            arrayEstadosProforma: [{
                    text: 'Anulado',
                    value: 0
                },
                {
                    text: 'Pendiente',
                    value: 1
                },
                {
                    text: 'Finalizado',
                    value: 2
                },
                {
                    text: 'Aprobado',
                    value: 3
                },
                {
                    text: 'PreAprobado',
                    value: 4
                },
                {
                    text: 'Aceptado',
                    value: 5
                },
                {
                    text: 'Aprobado con pendiente',
                    value: 6
                },
                {
                    text: 'Sin estado',
                    value: 7
                },
            ],
            valorBusqueda_SelectProforma: null,
            valorBusqueda_SelectDocumentoVenta: null,
            classvalidar_valorBusqueda_SelectProforma: '',
            classvalidar_valorBusqueda_SelectDocumentoVenta: '',
            puntosOriginal: [],
            arrayEstadosDocumentoVenta: [],
            TablaAgrupados: '',
            textoEstadoSeleccionado_proforma: "",
            textoEstadoSeleccionado_documento: "",

            //Guias de Remision
            guias_remision_rucs:[],
            popupRemision:false,

            //aprobacion de pendientes
            aprobacionPendientes: false,
            agrupadoFiltro: 'activos',
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.id_periodo = me.periodoSelect.idperiodoescolar
        me.nombre_periodo = me.periodoSelect.periodoescolar
        localStorage.nombre_periodoPuntos = me.nombre_periodo
    },
    mounted() {
        let me = this;
        me.getpuntos();
        me.Get_Estados_Venta();
        if (me.usuario.id_group == 22) me.userFacturador = true
        if (me.usuario.id_group == 23) me.userAdminFacturador = true
        if (me.usuario.id_group == 27) me.userBodega = true

    },
    props: {
        periodoSelect: {
            type: Object,
            default: {},
        },
    },
    computed: {
        puntosFiltrados() {
            console.log("Filtrando puntosOriginal",this.puntosOriginal)
            let base = Array.isArray(this.puntosOriginal) ? this.puntosOriginal : [];
            console.log("agrupadoFiltro", this.agrupadoFiltro)
            if (this.agrupadoFiltro == 'todos') {
                return [...base];
            } else if (this.agrupadoFiltro == 'activos') {
                return base.filter(p => p.ca_estado == 1);
            } else if (this.agrupadoFiltro == 'inactivos') {
                return base.filter(p => p.ca_estado == 0);
            }
            return [...base];
        }
    },
    methods: {
        filtrarAgrupados() {
            // Si el filtro queda vacío, forzar 'todos'
            if (!this.agrupadoFiltro) {
                this.agrupadoFiltro = 'activos';
            }
            this.TablaAgrupados = Date.now();
        },
        // Método para activar agrupado
        activarPedido(tr) {
            let me = this;
            let formData = new FormData();
            formData.append('cambiarEstadoAgrupado',1)
            formData.append('ca_id', tr.ca_id);
            formData.append('estado', 1);
            formData.append('user_edited', me.usuario.idusuario);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
                .then(res => {
                    me.getpuntos();
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Agrupado activado con éxito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                })
                .catch(error => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'No se pudo activar el agrupado',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },
        confirmarActivar(tr) {
            this.ObjectSelected = tr;
            this.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: 'Confirmar Activación',
                text: '¿Está seguro que desea activar este agrupado?',
                acceptText: 'Sí, activar',
                cancelText: 'Cancelar',
                accept: () => {
                    this.activarPedido(tr);
                }
            });
        },
        // Método para desactivar/anular agrupado
        desactivarPedido(tr) {
            let me = this;
            let formData = new FormData();
            formData.append('cambiarEstadoAgrupado',1)
            formData.append('ca_id', tr.ca_id);
            formData.append('estado', 0);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
                .then(res => {
                    me.getpuntos();
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Agrupado anulado con éxito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                })
                .catch(error => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'No se pudo anular el agrupado',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },
        //GUIAS REMISION
        entrarGruias(ruc){
            let me = this
            me.guias_remision_rucs = ruc
            me.popupRemision = true
        },
        confirmarAnular(tr) {
            this.ObjectSelected = tr;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar Anulación',
                text: '¿Está seguro que desea anular este agrupado? Esta acción no se puede deshacer.',
                acceptText: 'Sí, anular',
                cancelText: 'Cancelar',
                accept: () => {
                    this.desactivarPedido(tr);
                }
            });
        },
        handlePreproformaClick(soli) {
            // Obtener el valor del botón que se hizo clic
            const selectedPreproforma = this.preproformasList[soli];

            // Comparar con el código de agrupado
            const matchingPoint = this.puntos.find(tr => tr.ca_codigo_agrupado === selectedPreproforma);

            if (matchingPoint) {
                // Si hay una coincidencia, ejecutamos la acción
                this.ver_pedido(matchingPoint);
            } else {
                console.log('No hay coincidencia para:', selectedPreproforma);
            }
        },
        // Método que se llama cuando se hace clic en "Ver Información Completa"
        showAllContractsInfo(pedidos) {
            // Asignamos toda la información de los contratos de tr.pedidos
            this.allContractsInfo = pedidos.map(contract => ({
                contrato_generado: contract.contrato_generado,
                asesor: contract.asesor,
                nombreInstitucion: contract.nombreInstitucion,
                ciudad: contract.ciudad,
                ruc: contract.ruc,
                descuento: contract.descuento
            }));

            // Mostrar el modal
            this.isAllContractsInfoVisible = true;
        },
        f_editarInstitucion(item) {
            this.popupActivoEditar = true;
            this.ObjectSelected = item;
        },
        ver_pedido(item) {
            let me = this;
            console.log(item);

            // Validar si alguna proforma tiene estado 6 o 1
            const hasPendingProformas = item.preproformas.some(proforma => proforma.prof_estado === 6 || proforma.prof_estado === 1);
            console.log(hasPendingProformas);
            if (hasPendingProformas) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: 'Notificación',
                    text: 'Existen proformas pendientes. Por favor revisar.',
                    acceptText: 'Continuar',
                    cancelText: '',
                    accept: () => {
                        // Continuar con el resto del método si el usuario acepta
                        this.$store.dispatch('setpuntos', item);
                        me.$emit('showWindow', 1);
                    }
                });
            } else {
                // Si no hay proformas con estado 6 o 1, ejecutar directamente
                this.$store.dispatch('setpuntos', item);
                me.$emit('showWindow', 1);
            }
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (!me.puntosDeVenta.ruc) {
                me.$vs.notify({
                    text: 'Falta Ruc',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.puntosDeVenta.telefono) {
                me.$vs.notify({
                    text: 'Falta Telefono',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.puntosDeVenta.email) {
                me.$vs.notify({
                    text: 'Falta Email',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append('idInstitucion', me.puntosDeVenta.id);
            formData.append('ruc', me.puntosDeVenta.ruc);
            formData.append('telefonoInstitucion', me.puntosDeVenta.telefono);
            formData.append('email', me.puntosDeVenta.email);
            formData.append('direccionInstitucion', me.puntosDeVenta.direccion);
            me.$vs.loading()
            this.$http.post(this.$server_url + "editarInstitucionDespacho", formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Guardado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEditar = false;
                })
                .catch(error => {
                    if (error.response && error.response.status === 500) {
                        me.$vs.notify({
                            text: 'Revise los campos que esten en el formato correcto',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.$vs.loading.close()
                        this.popupActivoEditar = false;
                    } else {
                        me.$vs.loading.close()
                        this.popupActivoEditar = false;
                        me.$vs.notify({
                            text: 'No se pudo editar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
        },
        getpuntos() {
            let me = this;
            me.puntos = [];
            me.preproformasList = [];
            me.$vs.loading();
            me.$http.get(me.$server_url + "pedidos2/pedidos?getInstitucionesDespacho=1&id_periodo=" + me.periodoSelect.idperiodoescolar)
                .then(function (res) {
                    let arr = Array.isArray(res.data) ? res.data : [];
                    if (arr.length == 0) {
                        me.puntosOriginal = [];
                        me.puntos = [];
                        me.$vs.notify({
                            text: 'No hay puntos de venta asignados para despachos en este período.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        me.$vs.loading.close();
                        return;
                    }
                    arr.forEach(item => {
                        // Verificar preproformas con prof_id o emp_id nulos
                        const tienePreproformasNull = item.preproformas.some(preproforma =>
                            (preproforma.prof_id === null || preproforma.emp_id === null) && preproforma.prof_estado != "0"
                        );
                        if (tienePreproformasNull) {
                            me.preproformasList.push(item.ca_codigo_agrupado);
                        }
                        // Verificar preproformas pendientes (estado 6 o 1)
                        const tienePendientes = item.preproformas.some(preproforma =>
                            preproforma.prof_estado == 6 || preproforma.prof_estado == 1
                        );
                        if (tienePendientes) {
                            item.aprobacionPendientes = true;
                        }
                    });
                    me.puntosOriginal = [...arr];
                    me.filtrarAgrupados();
                    me.$vs.loading.close();
                });
        },
        FiltroAgrupados() {
            let me = this;
            //Seccion Filtro para mensaje
            // Buscar el texto correspondiente al valor seleccionado_proforma de proformas
            let seleccionado_proforma = me.arrayEstadosProforma.find(estado => estado.value == me.valorBusqueda_SelectProforma);
            me.textoEstadoSeleccionado_proforma = seleccionado_proforma ? seleccionado_proforma.text : '';
            // Buscar el texto correspondiente al valor seleccionado_documento de documentos
            let seleccionado_documento = me.arrayEstadosDocumentoVenta.find(estado => estado.est_ven_codigo == me.valorBusqueda_SelectDocumentoVenta);
            me.textoEstadoSeleccionado_documento = seleccionado_documento ? seleccionado_documento.est_ven_nombre : '';
            // Si se seleccionó el valor Todos en el radio button, restaurar sin filtros
            if (me.valorBusqueda_RadioB == 0) {
                me.valorBusqueda_SelectProforma = null;
                me.valorBusqueda_SelectDocumentoVenta = null;
                me.puntos = [...me.puntosOriginal]; // Restaurar sin filtros
            } else if (me.valorBusqueda_RadioB == 1) {
                me.valorBusqueda_SelectDocumentoVenta = null;
                if (me.valorBusqueda_SelectProforma == null) {
                    me.puntos = [];
                    me.validarcampo_valorBusqueda_SelectProforma();
                } else {
                    const estadoMap = {
                        0: 0,
                        1: 1,
                        2: 2,
                        3: 3,
                        4: 4,
                        5: 5,
                        6: 6,
                        7: null
                    };
                    // Si el valor existe en el mapa, filtrar de acuerdo al estado
                    const estado = estadoMap[me.valorBusqueda_SelectProforma];
                    if (estado !== undefined) {
                        me.puntos = me.puntosOriginal.filter(punto =>
                            punto.preproformas.some(proforma => proforma.prof_estado == estado)
                        );
                    }
                }
            } else if (me.valorBusqueda_RadioB == 2) {
                me.valorBusqueda_SelectProforma = null;
                if (me.valorBusqueda_SelectDocumentoVenta == null) {
                    me.puntos = [];
                    me.validarcampo_valorBusqueda_SelectDocumentoVenta();
                } else {
                    me.puntos = me.puntosOriginal.filter(punto =>
                        punto.documentos.some(proforma => proforma.est_ven_codigo == me.valorBusqueda_SelectDocumentoVenta)
                    );
                }
            } else if (me.valorBusqueda_RadioB == 3) {
                me.puntos = [];
                me.valorBusqueda_SelectProforma = null;
                me.valorBusqueda_SelectDocumentoVenta = null;
                me.puntos = me.puntosOriginal.filter(punto => punto.preproformas.length == 0);
            } else if (me.valorBusqueda_RadioB == 4) {
                me.puntos = [];
                me.valorBusqueda_SelectProforma = null;
                me.valorBusqueda_SelectDocumentoVenta = null;
                me.puntos = me.puntosOriginal.filter(punto => punto.documentos.length == 0);
            }
            // Reiniciar la paginación a la primera página
            me.TablaAgrupados = Date.now();
            // console.log(me.valorBusqueda_RadioB, "radio");
            // console.log(me.valorBusqueda_SelectProforma, "prof");
            // console.log(me.puntos, "Filtrado");
        },
        validarcampo_valorBusqueda_SelectProforma() {
            let me = this;
            const focus_valorBusqueda_SelectProforma = me.$refs.valorBusqueda_SelectProforma.$el.querySelector('input');
            focus_valorBusqueda_SelectProforma.focus();
            me.classvalidar_valorBusqueda_SelectProforma = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Seleccione un estado de proforma para filtrar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            })
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_valorBusqueda_SelectProforma = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarcampo_valorBusqueda_SelectDocumentoVenta() {
            let me = this;
            const focus_valorBusqueda_SelectDocumentoVenta = me.$refs.valorBusqueda_SelectDocumentoVenta.$el.querySelector('input');
            focus_valorBusqueda_SelectDocumentoVenta.focus();
            me.classvalidar_valorBusqueda_SelectDocumentoVenta = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Seleccione un estado de documentos de venta para filtrar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            })
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_valorBusqueda_SelectDocumentoVenta = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        Get_Estados_Venta() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'Get_Estado_Venta')
                .then(function (res) {
                    me.arrayEstadosDocumentoVenta = res.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
    }
}
</script>


<style lang="scss" scoped>
.header-sidebar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;

    h4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        >button {
            margin-left: 10px;
        }
    }
}

.active {
    font-weight: bold;
    color: #269CE3;
    background-color: #F0F5F9;
    padding: 2px 0px;
    border-radius: 5px;
}

.menutitle {
    font-weight: bold;
    font-size: 17px;
}

.submenu {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
}

.submenutitle {
    padding: 5px 0px;
    margin-top: 8px;
    cursor: pointer;
    transition: 0.2s ease-in all;
    font-size: 12px;
}

.submenutitle:hover {
    text-decoration: underline;
    color: #41A7E5;
}

.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.2s;
}

@keyframes fadeInOpacity {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0.7;
    }

    100% {
        opacity: 1;
    }
}

.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
