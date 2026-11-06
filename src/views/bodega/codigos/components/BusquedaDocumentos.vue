<template>
<div class="vx-row">
    <div class="vx-col w-full">
        <!-- <vx-card title="Seleccione el período " class="mb-3">
            <small>Buscar periodo:</small>
            <v-select :options="arrayPeriodos" :reduce="periodo => periodo" label="periodoescolar" class="w-full" v-model="periodoSelect" />
        </vx-card> -->
        <vx-card fixed-height="true">
            <vs-row>
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <p>Ingrese una parte del documento a buscar</p>
                    <br>
                    <div class=" vx-row flex" style=" flex-wrap: wrap;">
                        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                            <vs-input vs-w="7" class="w-full" @keyup.enter="getVentaDespachadasxParametro()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="busquedaxcodigo" />
                        </div>
                        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                            <vs-button color="warning" type="filled" style="margin-left: 10px" @click="getVentaDespachadasxParametro()" icon="search"></vs-button>
                        </div>
                    </div>
                </vs-col>
            </vs-row>
            <vs-table max-items="10" pagination search :data="Ventas">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ Ventas.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="600"># Documento</vs-th>
                    <vs-th width="100">Empresa remitente</vs-th>
                    <vs-th width="900">Información documento </vs-th>
                    <vs-th width="400">Contratos</vs-th>
                    <vs-th width="400">Cantidad de Textos</vs-th>
                    <vs-th width="150">Estado</vs-th>
                    <vs-th width="200"> Acciones </vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].ven_codigo">
                            {{ data[indextr].ven_codigo }}
                            <br />Venta: <b v-if="tr.ven_tipo_inst=='V' || !tr.ven_tipo_inst">Directa</b>
                            <b v-else>Por Lista</b>
                            <br /><b>Facturador: </b>{{ tr.responsable }}
                            <span v-if="tr.ven_tipo_inst=='V' || !tr.ven_tipo_inst"><br><b>Asesor: </b>{{tr.asesor}}</span>
                            <span v-if="tr.ven_idproforma"><br /><b>Pre-Proforma: </b>{{ tr.ven_idproforma }}</span>
                        </vs-td>
                        <vs-td> {{ tr.nombre }} </vs-td>
                        <vs-td>
                            <b>Cliente:</b> <span v-if="tr.cliente"> {{ tr.cliente }} </span>
                            <span v-else> {{ tr.cliente1 }} </span><br />
                            <b>Institución:</b> <span> {{ tr.nombreInstitucion }} </span><br />
                            <b>Período escolar:</b><span>{{ tr.periodoescolar }}</span>
                            <p class="font-bold">Fecha:</p>
                            <span>{{ tr.ven_fecha }} </span>
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.contratos.length>0">
                                <div :key="k" v-for="(t, k) in tr.contratos">
                                    <p>{{ t.contrato_generado}}</p>
                                </div>
                            </div>
                            <div v-else> No existe contratos</div>
                        </vs-td>
                        <vs-td>
                            <span>{{ tr.cantidad_despacho }}</span><br />
                            <span class="text" v-if="tr.impresion === 0" color="Teal" style="color: aliceblue;background:Teal;">No Impresa</span>
                            <span class="text" v-else-if="tr.impresion === 1" color="primary" style="color: aliceblue;background:DodgerBlue;">Impresa</span>
                        </vs-td>
                        <vs-td>
                            <span v-if="tr.idPuntoventa"><b>Grupo:</b> {{ tr.idPuntoventa }} </span><br />
                            <vs-chip v-if="tr.est_ven_codigo === 1" color="LimeGreen">Despachado</vs-chip>
                            <vs-chip v-else-if="tr.est_ven_codigo === 2" color="warning" type="gradient">Pendiente</vs-chip>
                            <vs-chip v-else-if="tr.est_ven_codigo === 3" color="LightCoral">Anulada</vs-chip>
                            <vs-chip v-else-if="tr.est_ven_codigo === 12" color="Gold">Preparada</vs-chip>
                            <vs-chip v-else-if="tr.est_ven_codigo === 11" color="Orange">Pendiente Excluido</vs-chip>
                            <vs-chip v-else-if="tr.est_ven_codigo === 10" color="Violet">Aprobada</vs-chip>
                            <br><br>

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
                            <!--Documento origen-->
                            <div v-if="(tr.tipoDocumentoOrigen == 3 || tr.tipoDocumentoOrigen == 4) && tr.documentoOrigen">
                                <b>Documento origen:</b>
                                <p>{{ tr.documentoOrigen }}</p>
                            </div>
                        </vs-td>
                        <vs-td :data="data[indextr].ven_codigo">
                            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 250px" class="cursor">
                                    <vs-dropdown-item>
                                        <vs-button color="#28C76F" type="line" class="w-full" @click="factu= tr;getreporte(tr);">Imprimir</vs-button>
                                        <vs-button v-if="tr.est_ven_codigo == 1 || tr.est_ven_codigo == 10 || tr.est_ven_codigo == 11 || tr.est_ven_codigo == 12" color="Coral" type="line" class="w-full" @click="datadocumento= tr;RegresarAPendiente()">Regresar a pendiente</vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <vs-popup fullscreen :title="`${id}`" v-if="tdo==1&&id" :active.sync="popupImprimir">
                <facturaVue v-if="popupImprimir" :factu="factu" :id="id" @change="change" />
            </vs-popup>
            <vs-popup fullscreen :title="`${id}`" v-if="(tdo==2||tdo==3)&&id&&tip" :active.sync="popupImprime">
                <notaVue v-if="popupImprime" :factu="factu" :id="id" :tipo="tip" @change="change" />
            </vs-popup>
            <vs-popup fullscreen :title="`${id}`" v-if="tdo==4&&id" :active.sync="popupActa">
                <actaVue v-if="popupActa" :factu="factu" :id="id" @change="change" />
            </vs-popup>
            <vs-popup class="informacionformhijo" @close="getVentaDespachadasxParametro();" :title="`Regresar a Pendiente ${datadocumento.ven_codigo} - ${datadocumento.nombre}`" :active.sync="popupRegresarAPendiente">
                <RegresarAPendiente v-if="popupRegresarAPendiente" :datadocumento="datadocumento" @change="changeHandleRegresarAPendiente" />
            </vs-popup>
        </vx-card>
    </div>
</div>
</template>

<script>
import PeriodoRepository from '@/repositories/PeriodoRepository';
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
const facturaVue = () => import('@/views/pedidos2/pedidos/proforma/factura.vue');
const notaVue = () => import('@/views/pedidos2/pedidos/proforma/nota.vue');
const actaVue = () => import('@/views/pedidos2/pedidos/libros/librosObsequios/components/actaVuepdf.vue');
const RegresarAPendiente = () => import("@/views/bodega/codigos/components/Regresar_A_Pendiente.vue");
export default {
    data() {
        return {
            Ventas: [],
            DetalleVenta: [],
            userVentas: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabVentas: {
                ven_codigo: "",
                bod_responsable: "",
                bod_nombre: "",
                bod_ubicacion: "",
                bod_estado: "",
                created_at: "",
                opcion: '',
            },
            ven_codigo: 0,
            valorBusqueda: "0",
            Bodega_inactivos: [],
            busquedaxcodigo: "",
            checkBox_mostrarinactivos: false,
            popupImprimir: false,
            popupImprime: false,
            popupActa: false,
            popupAnular: false,
            contadorpendientes: 0,
            menu: 0,
            datos: [],
            id: '',
            tdo: '',
            tip: '',
            factu: [],
            periodoSelect: null,
            arrayPeriodos: [],
            popupRegresarAPendiente: false,
            datadocumento: {},
        };
    },
    components: {
        "v-select": vSelect,
        facturaVue,
        notaVue,
        actaVue,
        RegresarAPendiente,
    },
    mounted() {
        this.Ventas = [];
        this.obtenerPeriodos();
    },
    props: {},
    methods: {
        obtenerPeriodos() {
            this.$vs.loading();
            PeriodoRepository.getPeriodos()
                .then(p => {
                    this.arrayPeriodos = p.data.filter(p => p.pedido_bodega == 1);
                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.m_message("Error al cargar los períodos", "error");
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
        change(e) {
            if (e == true) {
                this.tdo = 0;
            }
        },
        changen(e) {
            if (e == true) {

            }
        },
        getreporte(tr) {
            this.tdo = 0;
            this.id = tr.ven_codigo;
            if (tr.idtipodoc == 1) {
                this.tdo = 1;
                this.popupImprimir = true;
            }
            if (tr.idtipodoc == 2) {
                this.tdo = 4;
                this.popupActa = true;
            }
            if (tr.idtipodoc == 3) {
                this.tip = 1;
                this.tdo = 2;
                this.popupImprime = true;
            }
            if (tr.idtipodoc == 4) {
                this.tip = 1;
                this.tdo = 3;
                this.popupImprime = true;
            }
        },
        getVentaDespachadasxParametro() {
            let me = this;
            if (me.busquedaxcodigo.length < 4) {
                me.$vs.notify({
                    text: "Minimo 4 caracteres de busqueda",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return false;
            }
            // let id = me.periodoSelect.idperiodoescolar;
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetVentasDespachadasxParametro?opcion=2&parte_documento=" + me.busquedaxcodigo)
                .then(function (res) {
                    me.Ventas = res.data;
                    if (me.Ventas.length === 0) {
                        me.$vs.notify({
                            text: "No hay Ventas para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ventas = [];
                        me.$vs.loading.close();
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: "No hay Ventas para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ventas = [];
                        me.$vs.loading.close();
                    } else {
                        console.log(error + " error");
                        me.$vs.loading.close();
                    }
                });
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
        },
        RegresarAPendiente() {
            this.popupRegresarAPendiente = true;
        },
        changeHandleRegresarAPendiente(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupRegresarAPendiente = false;
                this.getVentaDespachadasxParametro();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupRegresarAPendiente = false;
                this.getVentaDespachadasxParametro();
            } else {
                console.log("Emit no recibido");
            }
        },
    },
};
</script>


<style>
.text {
    z-index: 9;
    background: var(--bg);
    color: var(--color);
    font-size: 11px;
    padding: 1.5px;
    border-radius: 1px;
    height: fit-content;
    cursor: pointer;
    box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.15);
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
