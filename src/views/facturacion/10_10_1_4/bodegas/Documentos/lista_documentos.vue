<template>
<div class="vx-row">
    <div class="vx-col w-full">
        <vx-card fixed-height="true">
            <div v-if="menu == 0">
                <vs-row>
                    <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                        <br>
                        <div class="seccionmostrartodo">
                            <div>
                                <vs-input v-if="valorBusqueda === '5'" class="w-full" @keyup.enter="getVentaDespachadasxParametro()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar por documento / cliente" v-model="busquedaxcodigo" />
                            </div>
                            <!--boton de recargar-->
                            <div class="w-full" v-if="valorBusqueda !== '5'">
                                <vs-button color="primary" radius style="position: relative;top:-5px;" type="filled" icon="refresh" @click="verificarseleccion();"></vs-button>
                            </div>
                            <div v-if="valorBusqueda == 0  && valorBusqueda != '5'" class="mt-1">
                              <ul class="centerx">
                                <li>
                                  <vs-checkbox v-model="sinFecha" @input="verificarseleccion()">Sin fitro de fecha</vs-checkbox>
                                </li>
                              </ul>
                            </div>
                            <!--FILTRO MES Y AñO-->
                            <div  v-if="valorBusqueda != '5'">
                                <div class="flex" style="flex-wrap: wrap;width: 100%;" v-if="!sinFecha">
                                    <!--meses-->
                                    <div style="width: 45%;" class="m-1">
                                        <small>Filtrar por mes:</small>
                                        <v-select @input="verificarseleccion();" :options="months" :reduce="months => months.value" label="name" class="w-full" v-model="mesSelect" />
                                    </div>
                                    <!--años-->
                                    <div style="width: 45%;" class="m-1">
                                        <small>Filtrar por año:</small>
                                        <v-select @input="contadorExcluidos=0;Ventas=[];" :options="years" :reduce="years => years" label="name" class="w-full" v-model="yearSelect" />
                                    </div>
                                </div>
                                <!--boton filtrar-->
                                <div class="flex">
                                    <vs-button color="primary" class="mt-3" type="border" icon="search" @click="verificarseleccion();">Filtrar</vs-button>
                                </div>
                            </div>
                            <div class="mt-2">
                                <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px;flex-wrap:wrap;">
                                    <li class="modelx"></li>
                                    <li style="margin: 10px 10px 0px 0px">
                                        <vs-radio vs-name="radios2valorBusqueda" vs-value="0" v-model="valorBusqueda" @change="sinFecha=true;verificarseleccion();">Pendientes</vs-radio>
                                    </li>
                                    <li style="margin: 10px 20px 0px 0px">
                                        <vs-radio vs-name="radios2valorBusqueda" vs-value="4" v-model="valorBusqueda" @change="sinFecha=false;verificarseleccion();">Despachados por bodega</vs-radio>
                                    </li>
                                    <li style="margin: 10px 10px 0px 0px">
                                        <vs-radio vs-name="radios2valorBusqueda" vs-value="1" v-model="valorBusqueda" @change="sinFecha=false;verificarseleccion();"><b class="text-danger">{{ contadorExcluidos }}</b> Pendientes Excluidos</vs-radio>
                                    </li>
                                    <!-- <li style="margin: 10px 10px 0px 0px">
                                        <vs-radio vs-name="radios2valorBusqueda" vs-value="2" v-model="valorBusqueda" @change="verificarseleccion()">Preparados</vs-radio>
                                    </li> -->
                                    <li style="margin: 10px 10px 0px 0px">
                                        <vs-radio vs-name="radios2valorBusqueda" vs-value="3" v-model="valorBusqueda" @change="verificarseleccion()">Empacadas</vs-radio>
                                    </li>

                                    <li style="margin: 10px 20px 0px 0px">
                                        <vs-radio vs-name="radios2valorBusqueda" vs-value="5" v-model="valorBusqueda" @change="verificarseleccion()">Todos</vs-radio>
                                    </li>
                                    <li>
                                        <vs-button v-if="valorBusqueda == '5'" color="warning" type="filled" style="margin-left: 10px" @click="getVentaDespachadasxParametro()" icon="search"></vs-button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </vs-col>
                </vs-row>
                <vs-table max-items="10" stripe pagination search :data="Ventas" no-data-text="No hay datos disponibles">
                    <template slot="header">
                        <vs-chip color="primary">Cantidad: <b> {{ Ventas.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th width="600"># Documento</vs-th>
                        <vs-th width="900">Información documentos</vs-th>
                        <vs-th width="200">Cantidad de Textos</vs-th>
                        <vs-th width="300">Estado</vs-th>
                        <vs-th width="200"> Acciones </vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].ven_codigo">
                                <b>Empresa Remitente:</b>
                                <p>{{  tr.nombre }} </p>
                                <b :style="{ color: tr.ven_p_libros_obsequios && tr.porcentaje_descuento < 100 ? 'red' : (tr.ven_p_libros_obsequios && tr.porcentaje_descuento == 100 ? 'blue' : '') }">
                                    {{ tr.ven_p_libros_obsequios && tr.porcentaje_descuento < 100 ? 'HIJOS DOCENTES' : tr.ven_p_libros_obsequios && tr.porcentaje_descuento == 100 ? 'ACTAS-OBSEQUIOS-100%' : '' }}
                                </b><br>
                                {{ data[indextr].ven_codigo }}
                                <br />Venta: <b v-if="tr.ven_tipo_inst=='V' || !tr.ven_tipo_inst">Directa</b>
                                <b v-else>Por Lista</b>
                                <br /><b>Facturador: </b>{{ tr.responsable }}
                                <span v-if="tr.ven_tipo_inst=='V' || !tr.ven_tipo_inst"><br><b>Asesor: </b>{{tr.asesor}}</span>
                                <span v-if="tr.ven_idproforma"><br /><b>Pre-Proforma: </b>{{ tr.ven_idproforma }}</span>
                                <!--contratos-->
                                <!-- <b>Contratos:</b>
                                <div v-if="tr.contratos.length>0">
                                    <div :key="k" v-for="(t, k) in tr.contratos">
                                        <p>{{ t.contrato_generado}}</p>
                                    </div>
                                </div>
                                <div v-else> No existe contratos</div> -->
                                <!--Reempacado-->
                                <div v-if="tr.empacado.length > 0">
                                    <br>
                                    <b>Empacado codigo:</b>
                                    <p>{{ tr.empacado[0].remi_codigo }}</p>
                                    <b>Fecha empacado:</b>
                                    <p>{{ tr.empacado[0].remi_fecha_inicio }}</p>
                                    <p><b>Empaques: </b>{{ tr.empacado[0].cantidad }}</p>
                                    <p><b>Unidades Empacadas: </b>{{ tr.empacado[0].libros }}</p>
                                    <div class="mt-1">
                                        <p style="background-color: #fce3e2;padding: 10px;font-weight: bold;" v-if="tr.empacado[0].remi_estado == 1">Empacado en proceso</p>
                                        <p style="background-color: aquamarine;padding: 10px;font-weight: bold;" v-else-if="tr.empacado[0].remi_estado == 2">Empacado finalizado</p>
                                    </div>
                                </div>
                            </vs-td>
                            <vs-td>
                                <b>Cliente:</b> <span v-if="tr.cliente"> {{ tr.cliente }} </span><br />
                                <!-- <span v-else> {{ tr.cliente1 }} </span><br /> -->
                                <b>Institución:</b> <span> {{ tr.nombreInstitucion }} </span><br />
                                <b>Período escolar:</b><span> {{ tr.periodoescolar }}</span>
                                <p class="font-bold">Fecha:</p>
                                <span>{{ tr.ven_fecha }} </span><br>
                                <div v-if="tr.est_ven_codigo == 1">
                                    <b v-if="tr.fecha_proceso_despacho">Fecha despachado:</b>
                                    <p v-if="tr.fecha_proceso_despacho">{{ tr.fecha_proceso_despacho }}</p>
                                </div>
                            </vs-td>
                            <vs-td>
                                <span>{{ tr.cantidad_despacho }}</span><br/>
                                <!-- <span class="text" v-if="tr.impresion === 0" color="Teal" style="color: aliceblue;background:Teal;">No Impresa</span> -->
                                <span class="text" v-if="tr.impresion === 1" color="primary" style="color: aliceblue;background:DodgerBlue;">Impresa</span>
                            </vs-td>
                            <vs-td>
                                <span v-if="tr.idPuntoventa"><b>Grupo:</b> {{ tr.idPuntoventa }} </span><br />
                                <vs-chip v-if="tr.est_ven_codigo == 1" color="LimeGreen">Despachado</vs-chip>
                                <vs-chip v-else-if="tr.est_ven_codigo == 2" color="warning" type="gradient">Pendiente</vs-chip>
                                <vs-chip v-else-if="tr.est_ven_codigo == 3" color="LightCoral">Anulada</vs-chip>
                                <vs-chip v-else-if="tr.est_ven_codigo == 12" color="Gold" style="color: black;">Preparada</vs-chip>
                                <vs-chip v-else-if="tr.est_ven_codigo == 11" color="Orange">Pendiente Excluido</vs-chip>
                                <vs-chip v-else-if="tr.est_ven_codigo == 10" color="Violet">Empacada</vs-chip>
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
                                <!--observacionRegresarAPendiente-->
                                <div v-if="tr.observacionRegresarAPendiente">
                                    <p class="font-bold text-danger"><i class="fa-solid fa-circle-exclamation"></i> Observación de despacho:</p>
                                    <p>{{ tr.observacionRegresarAPendiente }}</p>
                                </div>
                            </vs-td>
                            <vs-td :data="data[indextr].ven_codigo">
                                <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                    <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                    <vs-dropdown-menu style="width: 250px" class="cursor">
                                        <vs-dropdown-item v-if="tr.est_ven_codigo != 10">
                                            <!--IMPRIMIR-->
                                            <vs-button color="#28C76F"  type="line" class="w-full" @click="factu= tr;getDocumentos(tr.ven_codigo, tr.id_empresa);">Imprimir</vs-button>
                                            <!--EMPACAR 2=> PENDIENTE; -->
                                            <vs-button v-if="tr.est_ven_codigo == 1" color="primary" type="line" class="w-full" @click="ObjectedSelected=tr;f_empaca(tr)">Empacar</vs-button>
                                            <!--EDITAR  | est_ven_codigo : 9=> empacado  est_ven_codigo => 11 = excluidos-->
                                            <div class="flex justify-center" v-if="tr.est_ven_codigo == 11">
                                                <vs-button color="danger"  @click="ObjectedSelected=tr; f_editarExcluidos();" type="line" class="w-full"><i class="fa-solid fa-pen-to-square"></i> Empacar excluidos / Editar</vs-button>
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.est_ven_codigo == 2">
                                            <vs-button  color="#1eaed1" type="line" class="w-full" @click="ObjectedSelected= tr;popupDespachar=true;">Despachar</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.est_ven_codigo == 1" >
                                            <vs-button color="Coral" type="line" class="w-full" @click="ObjectedSelected= tr;popupRegresarAPendiente=true;">Regresar a pendiente</vs-button>
                                        </vs-dropdown-item>
                                        <!--empacado-->
                                        <vs-dropdown-item v-if="tr.est_ven_codigo == 10 && tr.empacado.length > 0">
                                            <vs-button v-if="tr.empacado[0].remi_estado == 1" color="success" type="line" class="w-full" @click="ObjectedSelected=tr.empacado[0];onlyVisualizar=0;popupAbrirIngresarGuia=true;">Ingresar Guía </vs-button>
                                            <vs-button v-if="tr.empacado[0].remi_estado == 2" color="dark" type="line" @click="ObjectedSelected=tr.empacado[0];onlyVisualizar=1;popupAbrirIngresarGuia=true;" class="w-full"> Ver Guia</vs-button>
                                            <vs-button v-if="tr.empacado[0].remi_estado == 2" color="success" type="line" @click="ObjectedSelected=tr;realizarReporteHojaDiaria();" class="w-full"> Ver Hoja Diaria</vs-button>
                                            <vs-button color="Coral" type="line" class="w-full" @click="ObjectedSelected=tr;openConfirmAnularEmpacado(tr)">Anular Empacado</vs-button>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <!--CREAR EMPAQUE-->
            <div v-if="menu == 1">
                <vs-button type="line" class="mt-2" @click="menu = 0;">← Regresar</vs-button>
                <EmpacarCrearVue :opcion="opcion" :ObjectedDocument="ObjectedSelected" :id="id" @changen="changen" />
            </div>
            <!--modales-->
            <!--modal para imprimir factura-->
            <vs-popup fullscreen :title="`${id}`" v-if="tdo==1&&id" :active.sync="popupImprimir">
                <facturaVue v-if="popupImprimir" :factu="factu" :id="id" @change="change" />
            </vs-popup>
            <vs-popup fullscreen :title="`${id}`" v-if="(tdo==2||tdo==3)&&id&&tip" :active.sync="popupImprime">
                <notaVue v-if="popupImprime" :factu="factu" :id="id" :tipo="tip" @change="change" />
            </vs-popup>
            <vs-popup fullscreen :title="`${id}`" v-if="tdo==4&&id" :active.sync="popupActa">
                <actaVue v-if="popupActa" :factu="factu" :id="id" @change="change" />
            </vs-popup>
            <!-- DOCUMENTO IMPRESION -->
            <vs-popup fullscreen v-if="popupDocumento" :title="'Detalle:'" :active.sync="popupDocumento" class="popopPadre">
                <div v-if="popupDocumento">
                    <documentoVenta :DocumentoVenta="DocumentoVenta[0]" @change="change" :DocumentoDetalleVenta="DocumentoDetalleVenta" />
                </div>
            </vs-popup>
        </vx-card>
        <!--modal para despachar-->
        <vs-popup class="despachar" :title="`Confirmar Despacho`" :active.sync="popupDespachar">
          <div v-if="popupDespachar">
            <p class="text-2xl text-center">¿Está seguro de despachar la venta <b>{{ ObjectedSelected.ven_codigo }}</b>?</p>
          </div>
          <br>
          <div class="flex justify-center mt-1">
            <vs-button class="mr-5" @click="f_despachar(); popupDespachar=false" type="relief">Aceptar</vs-button>
            <vs-button @click="popupDespachar=false" color="warning" type="relief">Cancelar</vs-button>
          </div>
        </vs-popup>
        <!--modal para mover a pendiente-->
        <vs-popup class="informacionformhijo" :title="`Regresar a Pendiente`" :active.sync="popupRegresarAPendiente">
            <div v-if="popupRegresarAPendiente">
                <p class="text-center">Regresar a pendiente documento: <b>{{ ObjectedSelected.ven_codigo }}</b></p>
                <br>
                <RegresarAPendiente :datadocumento="ObjectedSelected" @change="changePendiente" />
            </div>
        </vs-popup>
        <!--MODAL PARA EDITAR EMPACADO-->
        <vs-popup fullscreen  :active.sync="popupAbrirEmpacadoEditar" title="Editar" class="popopPadre">
            <div v-if="popupAbrirEmpacadoEditar">
                <EmpacarEditVue :ObjectedDocument="ObjectedDocument" :id="ObjectedSelected.ven_codigo" @cerrar="change" />
            </div>
        </vs-popup>
        <!--MODAL PARA INGRESAR GUIA-->
        <vs-popup
            :active.sync="popupAbrirIngresarGuia"
            title="Ingresar Guía"
            class="popopPadre"
            :fullscreen="Number(onlyVisualizar) === 1"
            >
            <p v-if="ObjectedSelected.remi_guia_remision"><b>Guia de remision</b>: {{ ObjectedSelected.remi_guia_remision }}</p>
            <div v-if="popupAbrirIngresarGuia">
                <EmpacadoIngresoGuiaVue
                :ObjectedSelected="ObjectedSelected"
                @changeGuia="changeGuia"
                :onlyVisualizar="onlyVisualizar"
                />
            </div>
        </vs-popup>
        <!--MODAL PARA MOSTRAR HOJA DIARIA-->
        <vs-popup fullscreen v-if="popupReporteDespachoCALMED" :active.sync="popupReporteDespachoCALMED" class="popopPadre" title="Reporte">
            <div v-if="popupReporteDespachoCALMED">
                <vs-row class=" border rounded-md">
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <div class="flex justify-center">
                            <b class="mr-3">Reporte con guias de remision </b>
                            <vs-switch color="success" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="conguia">
                                <span slot="on">SI</span>
                                <span slot="off">NO</span>
                            </vs-switch>
                        </div>
                    </vs-col>
                </vs-row>
                <br>
                <div align="center" class="mb-3">
                    <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
                    <vs-button @click="m_imprimirTodos('12px',`reporte_${ObjectedDocument.remi_num_factura}_diarioDespacho'}`,'0px','')">Imprimir</vs-button>
                </div>
                <br>
                <vx-card id="seccionImprimir2">
                    <exportDespachoCALMEDVue :datos="ObjectedDocument" :conguia="conguia" />
                </vx-card>
            </div>
        </vs-popup>
    </div>
</div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import Generalmix from "../../../../../mixins/Generalmix";
import imprimirMixin from "@/mixins/Pedidosmix";
const EmpacarCrearVue       = () => import('@/views/home/bodega/components/Empacar/EmpacarCrear.vue');
const facturaVue            = () => import('@/views/pedidos2/pedidos/proforma/factura.vue');
const notaVue               = () => import('@/views/pedidos2/pedidos/proforma/nota.vue');
const documentoVenta        = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
const actaVue               = () => import('@/views/pedidos2/pedidos/libros/librosObsequios/components/actaVuepdf.vue');
const RegresarAPendiente    = () => import("@/views/bodega/codigos/components/Regresar_A_Pendiente.vue");
const EmpacarEditVue        = () => import('@/views/home/bodega/components/Empacar/Empacaredit.vue');
const EmpacadoIngresoGuiaVue = () => import("./EmpacadoIngresoGuia.vue");
const exportDespachoCALMEDVue = () => import('@/views/facturacion/10_10_1_4/bodegas/Reportes/exportDespachoCALMED')
export default {
    mixins: [Generalmix,imprimirMixin],
    components: {
        "v-select": vSelect,
        EmpacarCrearVue,
        facturaVue,
        notaVue,
        actaVue,
        documentoVenta,
        RegresarAPendiente,
        EmpacarEditVue,
        EmpacadoIngresoGuiaVue,
        exportDespachoCALMEDVue,
    },
    data() {
        return {
            usuario:[],
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
            contadorpendientes: 0,
            menu: 0,
            datos: [],
            id: '',
            tdo: '',
            tip: '',
            factu: [],
            popupDocumento: false,
            ObjectedSelected:'',
            popupDespachar:false,
            popupRegresarAPendiente:false,
            popupAbrirEmpacadoEditar:false,
            ObjectedDocument:'',
            contadorExcluidos:0,
            months: [
                { name: 'Enero', value: 1 },
                { name: 'Febrero', value: 2 },
                { name: 'Marzo', value: 3 },
                { name: 'Abril', value: 4 },
                { name: 'Mayo', value: 5 },
                { name: 'Junio', value: 6 },
                { name: 'Julio', value: 7 },
                { name: 'Agosto', value: 8 },
                { name: 'Septiembre', value: 9 },
                { name: 'Octubre', value: 10 },
                { name: 'Noviembre', value: 11 },
                { name: 'Diciembre', value: 12 }
            ],
            years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i), // Últimos 10 años
            // Año actual por defecto
            yearSelect: new Date().getFullYear(),

            // Mes actual por defecto
            mesSelect: new Date().getMonth() + 1,
            //variables para empacada
            popupAbrirIngresarGuia:false,
            popupReporteDespachoCALMED:false,
            onlyVisualizar:0,
            conguia: false,
            ObjectedDocument:'',
            //fin variables para empacada
            sinFecha:true,
        };
    },

    mounted() {
        let me = this
        this.menu = 0;
        me.verificarseleccion();
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        changePendiente(e){
            let me = this
            if (e.verificacionemitsaveandedit == 1) {
                me.popupRegresarAPendiente = false;
                this.verificarseleccion();
            } else if (e.verificacionemitsaveandedit == 2) {
                me.popupRegresarAPendiente = false;
            } else {
            }
        },
        f_despachar() {
            let me = this;
            let datos = {
                ven_codigo: this.ObjectedSelected.ven_codigo,
                est_ven_codigo: 1,
                id_empresa: this.ObjectedSelected.id_empresa,
                user_despacha:this.usuario.idusuario
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
                        this.verificarseleccion();
                        return
                    }
                    this.verificarseleccion();
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
        change(e) {
            let me = this
            this.popupAbrirEmpacadoEditar = false
            if (e == true) {
                this.tdo = 0;
                this.verificarseleccion();
            }
        },
        changen(e) {
            if (e == true) {
                this.menu = 0;
                this.verificarseleccion();
            }
        },
        f_empaca(tr) {
            //si es pre factura y tiene un doc_intercambio seguir con el proceso
            if(tr.idtipodoc == 1){}
            else{
                //si doc_intercambio no es null mostrar no se puede empacar
                if (tr.doc_intercambio) {
                    this.$vs.notify({
                    text: "Este documento esta movido no es posible empacar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-x",
                    });
                    return;
                }
            }

            this.id = tr.ven_codigo;
            if (tr.est_ven_codigo == 2 || tr.est_ven_codigo == 12 || tr.est_ven_codigo == 10 || tr.est_ven_codigo == 1) {
                this.menu = 1;
                this.opcion = 0;
                //est_ven_codigo ; 1 = despachado ; 2 => pendiente; 10 => Empacado; 11 => Excluir; 12 => preparado;  1 => aprobado finalizado o despachado
            } else if (tr.est_ven_codigo == 11) {
                this.menu = 1;
                this.opcion = 1;
            }
        },
        f_editarExcluidos(){
            let me = this;
            this.$http.get(this.$server_url+`empaqueBodega?pendientes=1&individual=${this.ObjectedSelected.ven_codigo}`)
            .then(function (res) {
               if(res.data.length == 0){
                   me.m_message("No se encontraron empaques pendientes excluidos para este documento","warning","icon-alert-triangle")
                   return
               }
               me.ObjectedDocument = res.data[0]
               me.popupAbrirEmpacadoEditar = true
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        verificarseleccion() {
            let me = this;
            this.Ventas = [];
            this.popupRegresarAPendiente = false;
            this.contadorExcluidos = 0;
            this.Ventas = [];
            if(!this.sinFecha){
              //validacion mes
              if(me.mesSelect == "" || me.mesSelect == "" || me.mesSelect == undefined){
                  me.m_message("Debe seleccionar un mes","warning","icon-alert-triangle")
                  return
              }
              //validacion mes
              if(me.mesSelect < 1 || me.mesSelect > 12){
                  me.m_message("Ingrese un mes valido","warning","icon-alert-triangle")
                  return
              }
              //validacion año
              if(me.yearSelect < 1900 || me.yearSelect > new Date().getFullYear()){
                  me.m_message("Ingrese un año valido","warning","icon-alert-triangle")
                  return
              }
              //validacion año
              if(me.yearSelect == "" || me.yearSelect == "" || me.yearSelect == undefined){
                  me.m_message("Debe seleccionar un año","warning","icon-alert-triangle")
                  return
              }
            }

                //pendientes
            if (this.valorBusqueda === '0') {
                this.getVentasPendientes(0);
                //excluidos
            } else if (this.valorBusqueda === '1') {
                this.getVentasPendientes(1);
            } else if (this.valorBusqueda === '2') {
                this.getVentasPendientes(2);
            } else if (this.valorBusqueda === '3') {
                this.getVentasPendientes(3);
            }
            //despachados
            else if (this.valorBusqueda === '4') {
                this.getVentasPendientes(4);
            }
            //excluidos contador
            this.getContadorExcluidos()
        },
        getContadorExcluidos(){
            let me = this;
            this.contadorExcluidos = 0;
            this.$http.get(this.$server_url + `GetVentasPendientes?op=1&contarArray=1&anio=${me.yearSelect}&mes=${me.mesSelect}`)
            .then(res => {
                this.contadorExcluidos = res.data;
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'No se pudo obtener el contador de excluidos',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getVentasPendientes(op) {
            let me = this;
            this.contadorpendientes = 1;
            this.busquedaxcodigo    = '';
            let url = ''
            if(me.sinFecha == false){
              url = `GetVentasPendientes?op=${op}&anio=${me.yearSelect}&mes=${me.mesSelect}`
            }
            if(me.sinFecha){
              url = `GetVentasPendientes?op=${op}&sinfecha=1`
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + url)
                .then(res => {
                    this.Ventas = res.data;
                    me.$vs.loading.close()
                    if (me.Ventas.length == 0) {
                        me.$vs.notify({
                            text: 'No hay ventas pendientes por despachar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'No se pudo obtener los documentos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getVentaDespachadasxParametro() {
            let me = this;
            if (me.busquedaxcodigo.length < 2) {
                me.$vs.notify({
                    text: "Minimo 2 caracteres de busqueda",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return false;
            }
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetVentasDespachadasxParametro?opcion=0&parte_documento=" + me.busquedaxcodigo)
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
                        me.getUserBodega();
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
        //METODOS PARA EL EMPACADO
        openConfirmAnularEmpacado() {
            let me = this;
            let datoEmpacado = me.ObjectedSelected.empacado
            if(datoEmpacado.length == 0){
                me.m_message("No hay documentos empacados","warning","icon-alert-triangle")
                return
            }
            console.log("datoEmpacado",me.ObjectedSelected)
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Anular Empaque`,
                text: '¿Está seguro de anular el empaque #' + datoEmpacado[0].remi_codigo + '?'+' Al hacerlo se regresara a pendientes de despacho',
                accept: this.f_anularEmpacado,
                acceptText: 'Si, deseo anular el empacado',
                cancelText: 'Cancelar',
            })
        },
        f_anularEmpacado() {
            let me = this;
            let datoEmpacado                    = me.ObjectedSelected.empacado
            let formData = new FormData();
            formData.append('id',               datoEmpacado[0].id_remision);
            formData.append('remi_idempresa',   me.ObjectedSelected.id_empresa);
            formData.append('anulaEmpaque',     '1');
            formData.append('factura',          me.ObjectedSelected.ven_codigo);
            formData.append('user_created',     me.usuario.idusuario);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'empaqueBodega', formData)
            .then(res => {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                    return
                }
                me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                this.verificarseleccion();
            })
            .catch(e => {
                console.log("error",e)
                me.$vs.loading.close();
                me.$vs.notify({
                    text: 'No se pudo anular el empaque',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            });
        },
        changeGuia(e){
            let me = this
            if(e == false){
                me.popupAbrirIngresarGuia = false
            }else{
                me.popupAbrirIngresarGuia = false
                //ejecutar despues de 1 segundo
                setTimeout(function(){
                    me.verificarseleccion();
                },1000)
            }
        },
        realizarReporteHojaDiaria(){
            let me = this;
            this.$http.get(this.$server_url+`GetRemisionCALMED_FECHA?op=1&individual=${this.ObjectedSelected.ven_codigo}`)
            .then(function (res) {
               if(res.data.length == 0){
                   me.m_message("No se encontraron empaques pendientes excluidos para este documento","warning","icon-alert-triangle")
                   return
               }
               me.ObjectedDocument = res.data
               me.popupReporteDespachoCALMED = true;
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
    },
};
</script>
<style>
.text {
  z-index: 9;
  background: var(--bg);
  color: var(--color);
  font-size:11px;
  padding: 1.5px;
  border-radius: 1px;
  height: fit-content;
  cursor: pointer;
  box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.15);
}
.popopPadre {
    z-index: 51008;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}
</style>
