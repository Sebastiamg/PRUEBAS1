<template>
    <vx-card fixed-height="true">
        <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
        <div style="width:65%;display:flex;">
            <div style="width:80%;">
            Búsque una parte del contrato
            <!-- <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getVenta()"  v-model="busquedaxcodigo"/> -->
            <vs-input icon="search" style="width:100%;" placeholder="Search" v-model="busquedaxcodigo" />
            </div>
            <div style="width:50%;margin-left:10px;">
                Elija un período
                <vs-select class="w-full" v-model="busqueda">
                    <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item, index) in options1" />
                </vs-select>
            </div>
            <div style="width:20%;margin-left:10px;">
                <vs-button radius color="warning" @click="getVenta()" type="filled" icon="search"></vs-button>
            </div>
        </div>
        <vs-table max-items="10" pagination search :data="Ventas">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Ventas.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Código Venta
                </vs-th>
                <vs-th colspan="2">
                    Información Venta
                </vs-th>
                <vs-th style="width:20%;">
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].venCodigo">
                        {{ data[indextr].venCodigo }}
                    </vs-td>
                    <vs-td width="200">
                        <small><b>Codigo Usuario:</b> {{tr.usuCodigo}} </small><br>
                        <small><b>Codigo Vendedor:</b> {{tr.venDCodigo}}</small><br>
                        <small><b>Cliente Institución:</b> {{tr.cliInsCodigo}}</small><br>
                        <small><b>Tipo Venta:</b> 
                            <template v-if="data[indextr].tipVenCodigo == 1">
                                Directa
                            </template>
                            <template v-else-if="data[indextr].tipVenCodigo == 2">
                                Comisión
                            </template>
                            <template v-else-if="data[indextr].tipVenCodigo == 3">
                                Comision en libros
                            </template>
                            <template v-else-if="data[indextr].tipVenCodigo == 4">
                                Operativa
                            </template>
                            <template v-else-if="data[indextr].tipVenCodigo == 5">
                                Consignación
                            </template>
                        </small><br>
                        <small><b>Venta Estado:</b> {{tr.estVenNombre}} </small><br>
                        <small><b>Observación:</b> {{tr.venObservacion}}</small><br>
                        <small><b>Cheque:</b> {{tr.venCheq}}</small><br>
                        <small><b>Comisión:</b> {{tr.venComision}}</small><br>
                        <small><b>Valor:</b> {{tr.venValor}}</small><br>
                        <small><b>Pagado:</b> {{tr.venPagado}}</small><br>
                        <small><b>Anticipo:</b> {{tr.venAnticipo}}</small><br>
                        <small><b>Obsequios:</b> {{tr.venConObsequios}}</small><br>
                        <small><b>Observación Final:</b> {{tr.venConObsFinal}}</small><br>
                        <small><b>Porcentaje Comisión:</b> {{tr.venComPorcentaje}}</small><br>
                    </vs-td>
                    <vs-td>
                        <small><b>Iva:</b> {{tr.venIva}}</small><br>
                        <small><b>Descuento:</b> {{tr.venDescuento}}</small><br>
                        <small><b>Fecha:</b> {{tr.venFecha}}</small><br>
                        <small><b>Convertido:</b> {{tr.venConvertido}}</small><br>
                        <small><b>Transporte:</b> {{tr.venTransporte}}</small><br>
                        <small><b>Estado Transporte:</b> {{tr.venEstadoTransporte}}</small><br>
                        <small><b>Firmado:</b> {{tr.venFirmado}}</small><br>
                        <small><b>Temporada:</b> {{tr.venTemporada}}</small><br>
                        <small><b>Numero CUEN:</b> {{tr.cuenNumero}}</small><br>
                        <small><b>Devolución:</b> {{tr.venDevolucion}}</small><br>
                        <small><b>Remisión:</b> {{tr.venRemision}}</small><br>
                        <small><b>Fecha Remisión:</b> {{tr.venFechRemision}}</small><br>
                        <small><b>Sucursal:</b> {{tr.sucursal}}</small><br>
                    </vs-td>
                    <vs-td align="center">
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Editar" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="getEditar(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                        <vx-tooltip style="display: inline-block;margin:5px;" text="Ver Detalles Venta y Documentos liquidación" position="top" color="warning">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-bookmark" @click="verDetallexContrato(tr)" color="primary" ></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="editar" :title="`Edición Venta: ${tabVenta.venCodigo}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabVenta }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Venta</b></vs-col>
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Cédula *" placeholder="Cédula" class="w-full" icon="mode_edit" v-model="tabVenta.venDCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6" v-bind:class="{ 'hidden': !mostrarInput }">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <vs-input label="Descripción *" placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabVenta.venObservacion" :disabled="inputDisabled" />
                        </vs-col>
                    </vs-row>
                </vs-col> -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="6">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 11.5px">&nbsp;Estado Venta</font><br>
                            <v-select :options="EstadoVenta" :reduce="EstadoVenta => EstadoVenta.estVenCodigo" label="estVenNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabVenta.estVenCodigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!-- DETALLE POR VEN_CODIGO -->
        <vs-popup  :title="`Detalles de venta y documentos liquidación del contrato: ${tabVenta.venCodigo}`" :active.sync="popupDetalleVenta" fullscreen>
            <div>
                
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-table max-items="10" search pagination :data="detalleVenta">
                            <template slot="header">
                                <vs-chip color="primary">
                                    Cantidad de detalles: {{ detalleVenta.length }}
                                </vs-chip>
                            </template>
                            <template slot="thead">
                                <vs-th width="5%">
                                Id
                                </vs-th>
                                <vs-th width="13%">
                                Codigo Venta
                                </vs-th>
                                <vs-th>
                                Codigo Producto - Nombre
                                </vs-th>
                                <vs-th>
                                Cantidad
                                </vs-th>
                                <vs-th>
                                Valor
                                </vs-th>
                                <vs-th>
                                Iva
                                </vs-th>
                                <vs-th>
                                Descontar
                                </vs-th>
                                <vs-th>
                                Inicio
                                </vs-th>
                                <vs-th>
                                Cantidad Real
                                </vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                                    <vs-td>
                                        {{tr.detVenCodigo}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.venCodigo}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.proCodigo}} - {{tr.proNombre}}<br><br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.detVenCantidad}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.detVenValorU}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.detVenIva}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.detVenDescontar}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.detVenInicio}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.detVenCantidadReal}}<br>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-col>
                </vs-row>   
            </div>
            <div>
                <vs-table max-items="10" search pagination :data="documentoVenta">
                    <template slot="header">
                        <vs-chip color="primary">
                            Cantidad de documentos: {{ documentoVenta.length }}
                        </vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th>
                            Id
                        </vs-th>
                        <vs-th width="13%">
                            Código Venta
                        </vs-th>
                        <vs-th>
                            Valor
                        </vs-th>
                        <vs-th>
                            Número
                        </vs-th>
                        <vs-th>
                            Nombre
                        </vs-th>
                        <vs-th>
                            DocCi
                        </vs-th>
                        <vs-th>
                            Cuenta
                        </vs-th>
                        <vs-th>
                            Institución
                        </vs-th>
                        <vs-th>
                            Tipo
                        </vs-th>
                        <vs-th>
                            Observación
                        </vs-th>
                        <vs-th>
                            Fecha
                        </vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                            <vs-td>
                                {{tr.docCodigo}}
                            </vs-td>
                            <vs-td>
                                {{tr.venCodigo}}
                            </vs-td>
                            <vs-td>
                                {{tr.docValor}}
                            </vs-td>
                            <vs-td>
                                {{tr.docNumero}}
                            </vs-td>
                            <vs-td>
                                {{tr.docNombre}}
                            </vs-td>
                            <vs-td>
                                {{tr.docCi}}
                            </vs-td>
                            <vs-td>
                                {{tr.docCuenta}}
                            </vs-td>
                            <vs-td>
                                {{tr.docInstitucion}}
                            </vs-td>
                            <vs-td>
                                {{tr.docTipo}}
                            </vs-td>
                            <vs-td>
                                {{tr.docObservacion}}
                            </vs-td>
                            <vs-td>
                                {{tr.docFecha}}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vs-popup>
        <!-- FIN -->
        <!-- DOCUMENTO LIQUIDACION POR VEN_CODIGO -->
        <!-- <vs-popup  title="Documentos liquidación del contrato" :active.sync="popupDocumentoLiquidacion">
            <div>
                <vs-table max-items="10" search pagination :data="DocumentoLiq">
                    <template slot="header">
                        <vs-chip color="primary">
                            Cantidad de documentos: {{ DocumentoLiq.length }}
                        </vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th width="10%">
                        Código Documento
                        </vs-th>
                        <vs-th width="50%" colspan="2">
                        Información Documento liquidación
                        </vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                            <vs-td :data="data[indextr].docCodigo">
                            {{data[indextr].docCodigo}}
                            </vs-td>
                            <vs-td width="50%">
                                <small><b>Código Detalle:</b> {{tr.docValor}}</small><br>
                                <small><b>Código Venta:</b> {{tr.docNumero}}</small><br>
                                <small><b>Producto Código:</b> {{tr.docNombre}}</small><br>
                                <small><b>Producto Nombre:</b> {{tr.docCi}}</small><br>
                                <small><b>Cantidad:</b> {{tr.docCuenta}}</small><br>
                            </vs-td>
                            <vs-td width="50%">
                                <small><b>Valor:</b> {{tr.docInstitucion}}</small><br>
                                <small><b>Iva:</b> {{tr.docTipo}}</small><br>
                                <small><b>Descontar:</b> {{tr.docObservacion}}</small><br>
                                <small><b>Inicio:</b> {{tr.venCodigo}}</small><br>
                                <small><b>Cantidad Real:</b> {{tr.docFecha}}</small><br>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vs-popup> -->
        <!-- FIN -->
    </vx-card>
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
            Ventas: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupDetalleVenta: false,
            popupDocumentoLiquidacion: false,
            tabVenta: {
                venCodigo: '',
                usuCodigo: '',
                venDCodigo: '',
                estVenNombre: '',
                tipVenNombre: '',
                cliInsCodigo: '',
                tipVenCodigo: '',
                estVenCodigo: '',
                venObservacion: '',
                venCheq: '',
                venComision: '',
                venValor: '',
                venPagado: '',
                venAnticipo: '',
                venConObsequios: '',
                venConObsFinal: '',
                venComPorcentaje: '',
                venIva: '',
                venDescuento: '',
                venFecha: '',
                venConvertido: '',
                venTransporte: '',
                venEstadoTransporte: '',
                venFirmado: '',
                venTemporada: '',
                cuenNumero: '',
                venDevolucion: '',
                venRemision: '',
                venFechRemision: '',
                sucursal: ''
            },
            venCodigo: 0,
            EstadoVenta: [],
            mostrarInput: false,
            inputDisabled: true,
            busquedaxcodigo: "",
            detalleVenta: [],
            documentoVenta: [],
            DocumentoLiq: [],
            busqueda: 0 || null,
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        // this.getVenta();
    },
    methods: {
        // getVenta() {
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
        getVenta() {
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
            //axios.get(this.$apifacturacion_url + 'f_Venta?codcontrato='+me.busquedaxcodigo+'&periodo='+me.busqueda)
            this.$http.get(this.$server_url+'Get_Ventaxcontrato?codcontrato='+me.busquedaxcodigo+'&periodo='+me.busqueda)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.Ventas = res.data.datos;
                me.EstadoVenta = res.data.estadoventa;
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
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        // getVenta() {
        // axios.get('https://localhost:7252/api/Vendedor')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.Vendedores = resultado;
        //     console.log(this.Vendedores);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getEditar(tr) {
        this.popupActivoEditar = true
        this.tabVenta.venCodigo = tr.venCodigo
        this.tabVenta.usuCodigo = tr.usuCodigo
        this.tabVenta.venDCodigo = tr.venDCodigo
        this.tabVenta.cliInsCodigo = tr.cliInsCodigo
        this.tabVenta.tipVenCodigo = tr.tipVenCodigo
        this.tabVenta.estVenCodigo = tr.estVenCodigo
        this.tabVenta.venObservacion = tr.venObservacion
        this.tabVenta.venCheq = tr.venCheq
        this.tabVenta.venComision = tr.venComision
        this.tabVenta.venValor = tr.venValor
        this.tabVenta.venPagado = tr.venPagado
        this.tabVenta.venAnticipo = tr.venAnticipo
        this.tabVenta.venConObsequios = tr.venConObsequios
        this.tabVenta.venConObsFinal = tr.venConObsFinal
        this.tabVenta.venComPorcentaje = tr.venComPorcentaje
        this.tabVenta.venIva = tr.venIva
        this.tabVenta.venDescuento = tr.venDescuento
        this.tabVenta.venFecha = tr.venFecha
        this.tabVenta.proPeso = tr.proPeso
        this.tabVenta.venTransporte = tr.venTransporte
        this.tabVenta.venEstadoTransporte = tr.venEstadoTransporte
        this.tabVenta.venFirmado = tr.venFirmado
        this.tabVenta.venTemporada = tr.venTemporada
        this.tabVenta.cuenNumero = tr.cuenNumero
        this.tabVenta.venDevolucion = tr.venDevolucion
        this.tabVenta.venRemision = tr.venRemision
        this.tabVenta.venFechRemision = tr.venFechRemision
        this.tabVenta.sucursal = tr.sucursal
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        let datos  = {
                "venCodigo": this.tabVenta.venCodigo,
                "usuCodigo": this.tabVenta.usuCodigo,
                "venDCodigo": this.tabVenta.venDCodigo,
                "cliInsCodigo": this.tabVenta.cliInsCodigo,
                "tipVenCodigo": this.tabVenta.tipVenCodigo,
                "estVenCodigo": this.tabVenta.estVenCodigo,
                "venObservacion": this.tabVenta.venObservacion,
                "venCheq": this.tabVenta.venCheq,
                "venComision": this.tabVenta.venComision,
                "venValor": this.tabVenta.venValor,
                "venPagado": this.tabVenta.venPagado,
                "venAnticipo": this.tabVenta.venAnticipo,
                "venConObsequios": this.tabVenta.venConObsequios,
                "venConObsFinal": this.tabVenta.venConObsFinal,
                "venComPorcentaje": this.tabVenta.venComPorcentaje,
                "venIva": this.tabVenta.venIva,
                "venDescuento": this.tabVenta.venDescuento,
                "venFecha": this.tabVenta.venFecha,
                "venConvertido": this.tabVenta.venConvertido,
                "venTransporte": this.tabVenta.venTransporte,
                "venEstadoTransporte": this.tabVenta.venEstadoTransporte,
                "venFirmado": this.tabVenta.venFirmado,
                "venTemporada": this.tabVenta.venTemporada,
                "cuenNumero": this.tabVenta.cuenNumero,
                "venDevolucion": this.tabVenta.venDevolucion,
                "venRemision": this.tabVenta.venRemision,
                "venFechRemision": this.tabVenta.venFechRemision,
                "sucursal": this.tabVenta.sucursal
            }
        me.$vs.loading()
        //axios.post(this.$apifacturacion_url + 'f_Venta', datos)
        this.$http.post(this.$server_url+'Post_VentaEditarestado', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getVenta();
                me.$vs.notify({
                    text: 'Venta editada con exito',
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
                    text: 'Venta no se pudo guardar',
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
        //
        verDetallexContrato(tr) {
            // let detalles = this.Ventas.find(v => v.venCodigo === venCodigo);
            // this.detalleVenta = detalles.contadorDetalles.concat(detalles.contadordocumento);
            this.tabVenta.venCodigo = tr.venCodigo
            let detalles = this.Ventas.find(v => v.venCodigo === this.tabVenta.venCodigo);
            this.detalleVenta = detalles.contadorDetalles;
            this.documentoVenta = detalles.contadordocumento;
            this.popupDetalleVenta = true;
            // this.$vs.popup('detalle-venta-popup');
        },
        // CONTADOR SOLO PARA DETALLES
        // verDetallexContrato(venCodigo) {
        //     let detalles = this.Ventas.find(v => v.venCodigo === venCodigo);
        //     // let detalles = this.Ventas.find(v => v.venCodigo === venCodigo);
        //     this.detalleVenta = detalles.contadorDetalles;
        //     this.popupDetalleVenta = true;
        //     // this.$vs.popup('detalle-venta-popup');
        // },
        // DETALLE POR PARAMETRO
        // verDetallexContrato(venCodigo){
        //     let me = this;
        //     me.$vs.loading();
        //     axios.get(this.$apifacturacion_url+'Venta?codcontrato='+venCodigo)
        //     .then(function (res) {
        //         me.$vs.loading.close()
        //         // me.cantidad_libros = res.data.cantidad_libros;
        //         me.detalleVenta = res.data.datos.contadorDetalles;
        //         me.popupDetalleVenta = true;
        //         if(res.data.message){
        //             me.$vs.notify({
        //             text: res.data.message,
        //             color: 'success',
        //             iconPack: 'feather',
        //             icon: 'icon-user'
        //             })
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error + ' error');
        //         me.$vs.loading.close()
        //     })
        // },
        // DOCUMENTO POR PARAMETRO
        // verDocumentoliqxContrato(venCodigo){
        //     let me = this;
        //     me.$vs.loading();
        //     axios.get(this.$apifacturacion_url+'Documentoliq?codcontrato='+venCodigo)
        //     .then(function (res) {
        //         me.$vs.loading.close()
        //         // me.cantidad_libros = res.data.cantidad_libros;
        //         me.DocumentoLiq = res.data.documento_liq;
        //         me.popupDocumentoLiquidacion = true;
        //         if(res.data.message){
        //             me.$vs.notify({
        //             text: res.data.message,
        //             color: 'success',
        //             iconPack: 'feather',
        //             icon: 'icon-user'
        //             })
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error + ' error');
        //         me.$vs.loading.close()
        //     })
        // },
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