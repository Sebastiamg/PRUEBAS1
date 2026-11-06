<template>
<div>
    <div>
        <vx-card fixed-height="true">
            <vs-row>
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12" v-if="busquedaxfecha"></vs-col>
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <p>Filtro para el reporte</p>
                    <br />
                    <vs-card>
                        <div>
                            <div v-if="valorBusqueda == '1'">
                                <vs-row style="margin: 0px 0px 20px 0px">
                                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                            <font style="font-size: 11.5px">&nbsp;Fecha:</font><br />
                                            <flat-pickr :config="configdateTimePicker" v-model="busquedaxfecha" @input="getmetodoconfirmacioninactivos()" :placeholder="titleFecha" class="m-1" style="display: inline-block;width: 100%;" />
                                        </vs-col>
                                    </vs-row>
                                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                            <font style="font-size: 11.5px">&nbsp;Responsable:</font><br />
                                            <v-select :options="choferes" :reduce="choferes => choferes.cedula" label="responsable" class="w-full h-100" placeholder="--Seleccione--" v-model="trans_codigo" @input="getmetodoconfirmacioninactivos()" />
                                        </vs-col>
                                    </vs-row>
                                </vs-row>
                            </div>
                            <div v-if="valorBusqueda == '0'">
                                <vs-row style="margin: 0px 0px 20px 0px">
                                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                            <font style="font-size: 11.5px">&nbsp;Fecha:</font><br />
                                            <flat-pickr :config="configdateTimePicker" v-model="busquedaxfecha2" @input="getmetodoconfirmacioninactivos()" :placeholder="titleFecha" class="m-1" style="display: inline-block;width: 100%;" />
                                        </vs-col>
                                    </vs-row>
                                </vs-row>
                            </div>
                        </div>
                        <div>
                            <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
                                <li class="modelx"></li>
                                <li style="margin: 10px 10px 0px 0px">
                                    <vs-radio vs-name="radios1" vs-value="2" v-model="valorBusqueda" @input="RadioVerificas()">Todo fecha actual</vs-radio>
                                </li>
                                <li style="margin: 10px 10px 0px 0px">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="RadioVerificas()">Fecha</vs-radio>
                                </li>
                                <li style="margin: 10px 10px 0px 0px">
                                    <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="RadioVerificas()">Fecha y Responsable</vs-radio>
                                </li>
                            </ul>
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
            <vs-row class=" border rounded-md">
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <div class="flex justify-center">
                        <b>Reporte con guias de remision</b>
                        <vs-switch color="success" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="conguia">
                            <span slot="on">SI</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                    </div>
                    <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" class="w-full" @click="realizarReporte()">Generar Reporte Pdf</vs-button>
                </vs-col>
            </vs-row>
            <vs-table multiple stripe v-model="codigoSelected" max-items="25" pagination search :data="Remision">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ Remision.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="100"> Ids </vs-th>
                    <vs-th width="600"> Información de Remisión </vs-th>
                    <vs-th width="300"> Información Empaque </vs-th>
                    <vs-th width="600"> Información del Transportista</vs-th>
                    <vs-th width="150"> Acciones</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].remi_codigo">
                            <b>Empacado codigo</b>
                            <p>{{ data[indextr].remi_codigo }}</p>
                            <br /><b>Referencia: </b>{{ tr.remi_num_factura }}
                            <!--EXCLUIDOS-->
                            <div v-if="tr.est_ven_codigo == 11" style="background-color: antiquewhite;">
                                <b >Documento con libros excluidos</b>
                            </div>
                        </vs-td>
                        <vs-td>
                            <small><b>Empresa:</b> {{ tr.descripcion_corta }}</small><br />
                            <small><b>Cliente:</b> {{ tr.remi_destinatario }}</small><br />
                            <small><b>Destino:</b> {{ tr.ciudad }} - {{ tr.remi_direccion }}</small><br />
                            <small><b>N° Guía:</b> {{ tr.remi_guia_remision }}</small><br />
                            <small><b>Observación:</b> {{ tr.remi_obs }}</small><br />
                        </vs-td>
                        <vs-td>
                            <table style="width: 80%;">
                                <tr>
                                    <th>Tipo de Caja</th>
                                    <th>Cantidad</th>
                                </tr>
                                <tr>
                                    <td><b>Cajas pequeñas:</b></td>
                                    <td>{{ tr.remi_rollo }}</td>
                                </tr>
                                <tr>
                                    <td><b>Cajas grandes:</b></td>
                                    <td>{{ tr.remi_carton }}</td>
                                </tr>
                                <tr>
                                    <td><b>Sobres:</b></td>
                                    <td>{{ tr.remi_funda }}</td>
                                </tr>
                                <tr>
                                    <td><b>Paquetes:</b></td>
                                    <td>{{ tr.remi_paquete }}</td>
                                </tr>
                            </table>
                        </vs-td>
                        <vs-td>
                            <small><b>Empresa de transporte:</b><br> {{ tr.trans_nombre }}</small><br />
                            <small>
                                <table style="mix-blend-mode: multiply;">
                                    <tr>
                                        <td>
                                            <b>Flete al cobro:</b>
                                        </td>
                                        <td>
                                            <vs-chip v-if="tr.remi_flete == 1" color="success">Si</vs-chip>
                                            <vs-chip v-else color="danger">No</vs-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Pagado:</b>
                                        </td>
                                        <td>
                                            <vs-chip v-if="tr.remi_pagado == 1" color="success">Si</vs-chip>
                                            <vs-chip v-else color="danger">No</vs-chip>
                                        </td>
                                    </tr>
                                </table>
                            </small>
                        </vs-td>
                        <vs-td>
                            <div>
                                <!-- <div>
                                    <div class="flex justify-center">
                                        <vs-button color="danger"  @click="dataEdit=tr;id=tr.remi_num_factura;goEdit(tr)" class="mb-4 flex"><i class="fa-solid fa-pen-to-square"></i> Editar</vs-button>
                                    </div>
                                </div> -->
                                <div v-if="(tr.trans_codigo!=15 && tr.trans_codigo!=47)&&tr.remi_estado==2" class="flex justify-center mb-4">
                                    <vs-button v-if="tr.trans_codigo!=15 && tr.trans_codigo!=47&&tr.remi_estado==2" color="warning" @click="goInsertGuia(tr,1)"> Editar Guía</vs-button>
                                </div>
                                <div v-if="(tr.trans_codigo!=15 && tr.trans_codigo!=47)&&tr.remi_estado==2" class="mb-4">
                                    <vs-button color="dark"  @click="goInsertGuia(tr,0)" class="mb-4 flex"><i class="fa-regular fa-eye"></i> Ver Guia</vs-button>
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <!--MODALES-->
            <!--MODAL PARA EDITAR-->
            <vs-popup fullscreen v-if="popupReporteDespachoedit" :active.sync="popupReporteDespachoedit" title="Editar" class="popopPadre">
                <EmpacarEditVue :ObjectedDocument="dataEdit" :id="id" @cerrar="cerrar" />
            </vs-popup>
            <!--REPORTE-->
            <vs-popup fullscreen v-if="popupReporteDespachoCALMED" :active.sync="popupReporteDespachoCALMED" class="popopPadre" title="Reporte">
                <div align="center" class="mb-3">
                    <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
                    <vs-button @click="m_imprimirTodos('12px',`reporte_${busquedaxfecha?busquedaxfecha:busquedaxfecha2?busquedaxfecha2:fechaActual?fechaActual:'diarioDespacho'}`,'0px','')">Imprimir</vs-button>
                </div>
                <vx-card id="seccionImprimir2">
                    <exportDespachoCALMEDVue :datos="codigoSelected" :conguia="conguia" />
                </vx-card>
            </vs-popup>
            <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
                <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
                <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
            </vs-popup>
            <vs-popup :title="`Despachar empaque #  ${idempaque}`" :active.sync="popupdes">
                <vs-row vs-justify="center">
                    <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <b>Documentos empacados: </b>
                        <span> {{ facturas }} </span>
                    </vs-col>
                </vs-row>
                <br />
                <vs-row vs-justify="center">
                    <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12" class="m-2">
                        <vs-input type="text" class="w-full" v-model="guiaremision" placeholder="Escribe..." label="Ingrese el número de guía de remisión:" />
                    </vs-col>
                </vs-row>
                <div class="vx-row">
                    <div class="vx-col w-full mb-6">
                        <p class="ml-2">Respaldo:</p>
                        <p class="mt-1"></p>
                        <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                            <div class=" box upload-container">
                                <input type="file" ref="fileInput" name="fileEmpresa" id="fileEmpresa" v-on:change="uploadFiles()" />
                            </div>
                            <br>
                        </div>
                        <!--BASE-->
                        <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                            <div class="flex" style="justify-content: center;">
                                <div class="flex" style="flex-direction: column;">
                                    <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/remision/guias/'+imgOld" style="border-radius: 5px;margin: 0 auto;">
                                    <small class="mt-1 ml-2">{{ imgOld }}</small>
                                </div>
                                <vs-button radius type="line" @click="ifSaveImagen = false;" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                            </div>
                        </div>
                        <!--LOCAL-->
                        <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                            <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                                <div class="flex" style="flex-direction: column;">
                                    <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                                    <img v-else style="width: 200px;" src="@/assets/images/file-icons/doc.png" />
                                    <small class="mt-1 ml-2">{{ tr.name }}</small>
                                </div>
                                <vs-button radius type="line" @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">

                    <vs-button @click="finalizar()" type="relief" color="green">Guardar</vs-button>&emsp;
                    <vs-button @click="popupdes=false" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-popup>
            <vs-popup fullscreen :title="'Guia de Remision #' + guiaremision" :active.sync="popupImg">
                <div class="vx-row">
                    <div class="vx-col w-full mb-6">
                        <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen">
                            <div class="flex" style="justify-content: center;">
                                <div class="flex" style="flex-direction: column;">
                                    <image-zoom :regular="$data_url+'archivos/remision/guias/'+imgOld" :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid">
                                    </image-zoom>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vs-popup>
        </vx-card>
    </div>
</div>
</template>

<script>
import Vue from "vue";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import axios from "axios";
import imageZoom from 'vue-image-zoomer';
import vSelect from "vue-select";
import EmpacarEditVue from '@/views/home/bodega/components/Empacar/Empacaredit.vue';
const exportDespachoCALMEDVue = () => import('@/views/facturacion/10_10_1_4/bodegas/Reportes/exportDespachoCALMED')
import imprimirMixin from "@/mixins/Pedidosmix";
export default {
    mixins: [imprimirMixin],
    components: {
        "v-select": vSelect,
        flatPickr,
        exportDespachoCALMEDVue,
        imageZoom,
        EmpacarEditVue,
    },
    data() {
        return {
            id: '',
            dataEdit: [],
            Remision: [],
            Transporte: [],
            codigoSelected: [],
            trans_codigo: '',
            busquedaxfecha: '',
            busquedaxfecha2: '',
            valorBusqueda: 0,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            flatpickrOptions: {
                locale: 'es',
                // Otras opciones de configuración...
            },
            //tipoFecha => 0 = fecha envio; 1 = fecha entrega
            tipoFecha: 0,
            titleFecha: 'Busque una fecha',
            popupReporteDespachoCALMED: false,
            popupReporteDespachoedit: false,
            popupCarga: false,
            contadorinactivos: 0,
            choferes: [],
            fechaActual: '',
            conguia: false,
            facturas: '',
            idremision: '',
            idempresa: '',
            idempaque: '',
            popupdes: false,
            attachmentArray: [],
            guiaremision: '',
            tipoFile: '',
            ifSaveImagen: false,
            imgOld: '',
            ifImagenBd: false,
            popupImg: false,

            isZoomed: false,
            zoomedImage: null,
        };
    },
    mounted() {
        this.valorBusqueda = 2;
        this.RadioVerificas();
        this.getchoferes();
        this.obtenerFechaActual();
    },
    methods: {
        RadioVerificas() {
            const me = this;
            const acciones = {
                '0': me.verificarseleccion,
                '1': me.verificarseleccion,
                '2': me.verificar
            };

            const accion = acciones[me.valorBusqueda];
            if (accion) {
                accion.call(me);
            }
        },
        verificar() {
            let me = this;
            this.Remision = [];
            this.codigoSelected = [];
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetRemisionCALMED_FECHA?op=1')
                .then(function (res) {
                    me.Remision = res.data;
                    if(res.data.status == 0){   
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        return
                    }
                    if (me.Remision.length === 0) {
                        me.$vs.notify({
                            text: 'No hay remisiones para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Remision = [];
                        me.$vs.loading.close()
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close()
                        if (res.data.message) {
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
                            text: 'No hay remisiones para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Remision = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        verificarseleccion() {
            let me = this;
            this.getmetodoconfirmacioninactivos();
            this.Remision = [];
            // this.busquedaxfecha = '';
            // this.busquedaxfecha2 = '';
            this.trans_codigo = '';
            this.codigoSelected = [];
        },
        getmetodoconfirmacioninactivos() {
            if (this.contadorinactivos === 0) {
                this.Realizarbusqueda();
            }
            // Configurar un temporizador para restablecer contadorinactivos después de 2 segundos
            setTimeout(() => {
                this.contadorinactivos = 0;
            }, 1000);
        },
        Realizarbusqueda() {
            let me = this;
            this.contadorinactivos = 1;
            if (me.valorBusqueda == 0 && (me.busquedaxfecha2 == 0 || me.busquedaxfecha2 == null)) {
                me.$vs.notify({
                    text: "Seleccione una Fecha",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return;
            }
            if (me.valorBusqueda == 1 && (me.busquedaxfecha == 0 || me.busquedaxfecha == null) && (me.trans_codigo != 0 || me.trans_codigo != null)) {
                me.$vs.notify({
                    text: "Seleccione una Fecha",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return;
            }
            if (me.valorBusqueda == 1 && (me.busquedaxfecha != 0 || me.busquedaxfecha != null) && (me.trans_codigo == 0 || me.trans_codigo == null)) {
                me.$vs.notify({
                    text: "Seleccione el transporte",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return;
            }
            if (me.valorBusqueda == 0 && (me.busquedaxfecha2 != 0 || me.busquedaxfecha2 != null)) {
                this.getRemisionxFecha();
            }
            if (me.valorBusqueda == 1 && (me.busquedaxfecha != 0 || me.busquedaxfecha != null) && (me.trans_codigo != 0 || me.trans_codigo != null)) {
                this.getRemisionxResponsableyFecha();
            }
        },
        getRemisionxFecha() {
            let me = this;
            this.Remision = [];
            this.codigoSelected = [];
            if (me.busquedaxfecha2.length < 2) {
                me.$vs.notify({
                    text: 'Minimo 2 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetRemisionCALMED_FECHA?op=0&fecha_filtro=' + me.busquedaxfecha2)
                .then(function (res) {
                    if(res.data.status == 0){   
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        return
                    }
                    me.Remision = res.data;
                    if (me.Remision.length === 0) {
                        me.$vs.notify({
                            text: 'No hay remisiones para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Remision = [];
                        me.$vs.loading.close()
                    } else {
                        me.$vs.loading.close()
                        if (res.data.message) {
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
                            text: 'No hay remisiones para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Remision = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        getRemisionxResponsableyFecha() {
            let me = this;
            this.Remision = [];
            this.codigoSelected = [];
            if (me.busquedaxfecha.length < 2) {
                me.$vs.notify({
                    text: 'Minimo 2 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetRemisionCALMED_FECHA?op=2&fecha_filtro=' + me.busquedaxfecha + '&cedula=' + me.trans_codigo)
                .then(function (res) {
                    if(res.data.status == 0){   
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        return
                    }
                    me.Remision = res.data;

                    if (me.Remision.length === 0) {
                        me.$vs.notify({
                            text: 'No hay remisiones para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Remision = [];
                        me.$vs.loading.close()
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close()
                        if (res.data.message) {
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
                            text: 'No hay remisiones para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Remision = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        async getchoferes() {
            try {
                const response = await this.$http.get(this.$server_url + "empaqueBodega?getchofer=1");
                this.choferes = response.data;
            } catch (err) {
                console.log(err);
                throw err; // Propagate the error
            }
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        eliminarArchivo(id) {
            let me = this;
            let formData = new FormData();
            formData.append('deleteRegistroArchivo', "yes");
            formData.append('archivoguia', 'yes');
            formData.append('id', id);
            me.$vs.loading();
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post(this.$data_url + 'api/eliminarValores', formData, config)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 5000
                        });
                        return;
                    }
                    me.$vs.notify({
                        text: "Se elimino correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                })
                .catch(error => {
                    me.$vs.loading.close();
                });
        },
        uploadFiles() {
            const archivo = document.getElementById("fileEmpresa").files[0];

            if (!archivo) {
                console.error("No se ha seleccionado ningun archivo");
                return;
            }

            const MAX_SIZE = 2 * 1024 * 1024; // 2MB en bytes
            if (archivo.size > MAX_SIZE) {
                alert("El archivo es demasiado pesado. El límite es 2MB.");
                document.getElementById("fileEmpresa").value = '';
                return;
            }

            this.tipoFile = ["image/png", "image/gif", "image/jpeg", "image/jpg"].includes(archivo.type) ? "img" : "other";

            const reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onloadend = () => {
                const cal = {
                    file: archivo,
                    img: reader.result,
                    tipo: this.tipoFile,
                    name: archivo.name
                };
                this.attachmentArray.push(cal);
                console.log(cal, "File processed successfully");
            };
        },
        finalizar() {
            let me = this;
            if (!this.guiaremision && !this.$refs.fileInput.value) {
                me.$vs.notify({
                    text: 'Ingrese el número de guia',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                return;
            }

            this.$http.get(`${this.$server_url}empaqueBodega?getventa=1&ven_codigo=${this.facturas}&id=${this.idempresa}`)
                .then(obtener => {
                    if (!obtener || obtener.length === 0) {
                        return;
                    }

                    let cantidad = obtener.cant;
                    let despacho = obtener.desp;
                    let estado = (cantidad === despacho) ? 1 : 0;

                    let formData = new FormData();
                    if (!me.ifSaveImagen && me.attachmentArray.length === 0 && me.ifImagenBd) {
                        formData.append('archivo', 'no');
                        formData.append('url', 'no');
                        me.eliminarArchivo(me.idremision);
                    }

                    formData.append('id', me.idremision);
                    formData.append('remi_idempresa', me.idempresa);
                    formData.append('despacharEmpaque', '1');
                    formData.append('remi_codigo', me.idempaque);
                    formData.append('guiaremision', me.guiaremision);
                    formData.append('op', 0);
                    formData.append('factura', me.facturas);
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
                            me.saveEvidencia(me.idremision);
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            me.popupdes = false;
                            me.RadioVerificas();
                        })
                        .catch(e => {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                text: 'No se pudo finalizar el empacado',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        });
                });
        },
        saveEvidencia(getId) {
            let me = this;
            let formData = new FormData();
            if (me.ifSaveImagen || me.attachmentArray.length === 0) {
                formData.append('noSendFiles', 'yes');
                this.$emit('change', true);
                return;
            }

            me.attachmentArray.forEach(element => {
                formData.append('archivos[]', element.file);
            });

            formData.append('id', getId);
            formData.append('saveArchivos', 'yes');
            formData.append('imgOld', me.imgOld);
            formData.append('archivoguia', 'yes');

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post(this.$data_url + 'api/guardarDatosPedido', formData, config)
                .then(res => {
                    this.$emit('change', true);
                })
                .catch(error => {});
        },
        removeItemFromArr(arr, item) {
            const i = arr.indexOf(item);
            if (i > -1) {
                arr.splice(i, 1);
            }
            document.getElementById("fileEmpresa").value = '';
        },
        goInsertGuia(tr,tipo) {
            this.attachmentArray = [];
            this.facturas = tr.remi_num_factura;
            this.idempresa = tr.remi_idempresa;
            this.idremision = tr.id;
            this.idempaque = tr.remi_codigo;
            this.guiaremision = tr.remi_guia_remision;

            if (!tr.archivo && !tr.url) {
                this.imgOld = '';
                this.ifSaveImagen = false;
            } else {
                if (tr.id) {
                    this.imgOld = tr.url;
                    this.ifSaveImagen = !!this.imgOld;
                    this.ifImagenBd = true;
                } else {
                    this.ifSaveImagen = false;
                }
            }
            if(tipo==1){
                this.popupdes = true;

            }else{
                this.popupImg = true;
            }
        },
        cerrar(e) {
            if (e === true) {
                this.popupReporteDespachoedit = false;
            } else {
                this.popupReporteDespachoedit = true;
            }
            this.RadioVerificas();
        },
        goEdit() {
            this.popupReporteDespachoedit = true;
        },
        obtenerFechaActual() {
            const fecha = new Date();
            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            this.fechaActual = `${anio}-${mes}-${dia}`;
        },
       
        getTransportes() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'Get_Transporte')
                .then(res => {
                    // console.log(res.data)
                    me.Transporte = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        realizarReporte() {
            let me = this;
            if (me.codigoSelected.length > 0) {
                me.popupReporteDespachoCALMED = true;
            } else {
                me.$vs.notify({
                    text: 'No hay selecciones para el reporte',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            }
        },
    },
};
</script>

<style scoped>
.popopPadre {
    z-index: 51008;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

.color1 {
    color: #2364B4;
    transition: 2 ease-in-out;
}

.color1:hover {
    background: #979c97 !important;
}


.upload-container {
    position: relative
}

.upload-container input {
    border: 1px solid #92b0b3;
    background: #217bc5;
    outline: 2px dashed #92b0b3;
    outline-offset: -10px;
    padding: 100px 0px 100px 130px;
    width: 100%;
    color: white;
}

.upload-container input:hover {
    background: #2c78cf
}

.upload-container:before {
    position: absolute;
    bottom: 50px;
    left: 23%;
    content: " Seleccione un archivo o arrastre aqui ";
    color: #f1f9fa;
    font-weight: 900
}

.upload-btn {
    margin-left: 300px;
    padding: 7px 20px
}

/*preview guia*/

.preview-img {
    max-width: 100%;
    /* Ajusta al tamaño del popup */
    height: auto;
}







.zoomed-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    z-index: 1000;
}

.zoomed-image {
    max-width: 90%;
    max-height: 90%;
}
</style>
