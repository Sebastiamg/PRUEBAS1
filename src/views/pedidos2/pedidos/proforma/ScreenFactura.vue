<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-full">
            <p>Empresa:*</p>
            <v-select :options="listaEmpresas" disabled :reduce="(listaEmpresas) => listaEmpresas.id" density="comfortable" label="nombre" class="w-full" value="id" placeholder="--Seleccione--" v-model="factura.empresa" />
        </div>
    </div>
    <br>
    <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
            <vs-row vs-type="flex" vs-justify="start" vs-w="6">
                <FacturaClienteVue :idProforma="factu.prof_id" />
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <p class="m-2">Tipo de establecimiento: *</p>
                    <vs-radio class="m-2" v-model="tipoE" vs-name="radios4tipo" vs-value="L">Librería <b>(L)</b></vs-radio>
                    <vs-radio class="m-2" v-model="tipoE" vs-name="radios4tipo" vs-value="V">Vendedor <b>(V)</b></vs-radio>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <p>Tipo documento: *</p>
                    <v-select :options="tipos" :reduce="(tipos) => tipos" density="comfortable" label="tdo_nombre" class="w-full" value="tdo_letra" placeholder="--Seleccione--" v-model="factura.tipo" required @input="verificar();calculos();validar_select_documento_stock();" />
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <b>Tipo venta:</b>
                    <p v-if="tipoE == 'V'">Venta directa</p>
                    <p v-if="tipoE == 'L'">Venta Lista</p>
                    <!-- <v-select :options="tipo" :reduce="(tipo) => tipo.tip_ven_codigo" :disabled="disabledVenta"  density="comfortable" label="tip_ven_nombre" class="w-full" value="tip_ven_codigo" placeholder="--Seleccione--" v-model="factura.tipos" required @input="calculos();" /> -->
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <p><b>Observación: </b> {{ factura.observacion }} </p>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2" v-if="verificar_stockinsuficiente == true">
                    <div class="flex">
                        <b for="checkbox">¿Activar todo el stock disponible?</b>
                        <input type="checkbox" style="width:50px;" v-model="check_activar_todo_stock" @input="validar_suma_todos_los_stock()" />
                    </div>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2" v-if="factura.tipo">
                    <div class="flex">
                        <b for="checkbox">Permitir Facturar con stock mínimo</b>
                        <input type="checkbox" style="width:50px;" v-model="stactiva" id="checkbox" @input="validarcheck_activar_stock_minimo()" />
                    </div>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <br>
    <vs-row>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center">
            <b>Detalle Factura</b>
        </vs-col>

        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inpu.length }}</vs-divider>
            <div class="vx-row">
                <vs-table class="table users table-hover" :data="inpu" style="width: 100%!important;">
                    <template slot="thead">
                        <vs-th width="100"> # </vs-th>
                        <vs-th width="300">Producto</vs-th>
                        <vs-th width="150" v-if="factura.tipo"> Stock </vs-th>
                        <vs-th width="150"> Cantidad autorizado </vs-th>
                        <vs-th width="150" v-if="factura.tipo"> Cantidad a facturar </vs-th>
                        <vs-th width="250"> Valor Unitario</vs-th>
                        <vs-th width="250"> Subtotal</vs-th>

                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr v-for="(input, k) in inpu" :key="k" style="text-size-adjust: 9px;">
                            <vs-td><br /><b>{{ k + 1 }}</b></vs-td>
                            <vs-td>{{ input.pro_codigo }} {{ input.nombre }}<br><span v-if="input.id_serie == 19"><b>Descripción combo:</b><br>
                                    {{ input.id_serie == 19 ?  input.descripcion : '' }}</span>
                                <div v-if="stactiva">
                                    <div style="font-size:12px;background-color: #FADBD8; padding:5px;" v-if="parseInt(input.det_prof_cantidad) > parseInt(input.stock)">Generar documento con la cantidad disponible.</div>
                                </div>
                                <div v-else>
                                    <div style="font-size:12px;background-color: #FCF3CF;padding:5px;" v-if="parseInt(input.det_prof_cantidad) > parseInt(input.stock - stock)"> Cantidad autorizada supera la configuración de stock mínimo. Activa el Stock Mínimo para registrar este artículo.</div>
                                </div>
                            </vs-td>
                            <vs-td v-if="factura.tipo">{{ input.stock }}</vs-td>
                            <vs-td>{{ input.det_prof_cantidad }}</vs-td>
                            <vs-td v-if="factura.tipo">
                                <div v-if="stactiva==true">
                                    <span v-if="input.det_prof_cantidad <= input.stock">
                                        {{ input.cantidad =input.det_prof_cantidad  }}
                                    </span>
                                    <span v-else>
                                        <span v-if="input.stock<0">{{input.cantidad = 0}}</span>
                                        <span v-else>{{input.cantidad = input.stock}}</span>
                                    </span>
                                </div>
                                <div v-else>
                                    <span v-if="input.det_prof_cantidad <= (input.stock - stock)">
                                        {{ input.cantidad=input.det_prof_cantidad }}
                                    </span>
                                    <span v-else>
                                        {{ input.cantidad=0 }}
                                    </span>
                                </div>
                            </vs-td>
                            <vs-td>{{ input.det_prof_valor_u }}</vs-td>
                            <vs-td>
                                <div v-if="input.cantidad">
                                    <p>{{ input.subtotal=(input.det_prof_valor_u * input.cantidad).toFixed(2) }}</p>
                                </div>
                                <div v-else>
                                    {{ input.subtotal=0 }}
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <!--calculos-->
            <vs-col v-if="factura.tipo" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="8">
                    <vs-col vs-justify="center" vs-align="center" vs-w="6" class="m-2">
                        <vs-input label="Transporte:*" class="w-full m-1" type="number" @input="validateTransporte();calculos();" @blur="validateTransporteBlur();calculos();" v-model="factura.transporte" required />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-w="4">
                    <vs-col vs-justify="center" vs-w="11" class="m-1">
                        <table class="table" style="width: 62%!important;">
                            <tr>
                                <td colspan="6"></td>
                                <td></td>
                                <td colspan="3"> <b style="color: blue;" width="300">Subtotal $:</b></td>
                                <td style="text-align: right;">
                                    <!-- <b>{{ factura.subtotal=(inpu.reduce((prev, curr) => prev +
                                                      parseFloat(curr.subtotal),
                                                      0)).toFixed(2)}}</b> -->
                                    <b>{{ factura.subtotal }} </b>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td colspan="5"></td>
                                <td colspan="3"> <b style="color: blue;">Descuento {{ factura.desc }}% $:</b></td>
                                <td style="text-align: right;">
                                    <!-- <b>{{ factura.des=(factura.subtotal * (factura.desc / 100)).toFixed(2) }}</b> -->
                                    <b>{{ factura.des }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td colspan="5"></td>
                                <td colspan="3"> <b style="color: blue;">Subtotal-Descuento $</b></td>
                                <td style="text-align: right;">
                                    <!-- <b>{{ (factura.subtotal - factura.des).toFixed(2) }}</b> -->
                                    <b>{{ factura.subtotalDesc }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7"> </td>
                                <td colspan="3"> <b style="color: blue;">IVA $:</b></td>
                                <td style="text-align: right;">
                                    <!-- <b>{{ factura.iva=((factura.subtotal - factura.des) * (factura.iv / 100)).toFixed(2) }}</b> -->
                                    <b>{{ factura.iva }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7"> </td>
                                <td colspan="3"> <b style="color: blue;">Transporte $:</b></td>
                                <td style="text-align: right;">
                                    <b>{{ parseFloat(factura.transporte).toFixed(2) }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7"> </td>
                                <td colspan="3"> <b style="color: blueviolet;">TOTAL $:</b></td>
                                <td style="text-align: right;">
                                    <!-- <b style="color: blueviolet;">{{ factura.total=(parseFloat(factura.subtotal - factura.des) + parseFloat(factura.iva) + parseFloat(factura.transporte)).toFixed(2) }}</b> -->
                                    <b style="color: blueviolet;">{{ factura.total }}</b>
                                </td>
                            </tr>
                        </table>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-col>
    </vs-row>
    <br /><br />
    <vs-col vs-type="flex" v-if="factura.tipo" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="metodoGuardar();" type="relief" color="green">Guardar</vs-button>&emsp;
        <vs-button @click="cerrar();" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <vs-popup class="popophijo" title="Documentos relacionados" :active.sync="popupvalidacion">
        <p class="text-danger text-2xl"><b class="ml-2">Los siguientes documentos están relacionados con la proforma.</b></p>
        <vs-table max-items="10" :data="documentosVenta">
            <template slot="thead">
                <vs-th>Documento #</vs-th>
                <vs-th>Proforma relacionada #</vs-th>
                <vs-th>Fecha</vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{ tr.ven_codigo }} </vs-td>
                    <vs-td> {{ tr.ven_idproforma }} </vs-td>
                    <vs-td> {{ tr.ven_fecha }} </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-3">
            <vs-button @click="popupvalidacion=false;" color="primary" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
</div>
</template>


<script>
import {
    mapState
} from "vuex";

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import FacturacionRepository from "../../../../repositories/FacturacionRepository";
import PedidosRepository from "../../../../repositories/PedidosRepository";
const FacturaClienteVue = () => import('./components/FacturaCliente.vue');
export default {
    components: {
        flatPickr,
        'v-select': vSelect,
        FacturaClienteVue,
    },
    data: () => ({
        popupvalidacion: false,
        documentosVenta: [],
        id: '',
        inputs: [],
        stoc: [],
        input: [],
        pro: [],
        puntos: [],
        detalle: [],
        sucursal: [],
        user: "",
        cont: 0,
        hijo: 0,
        tipod: 0,
        tipoc: 0,
        tipoi: '',
        tipoE: 'L',
        informacion: '',
        usuario: [],
        inpu: [],
        Eselect: '',
        Proforma: [],
        Proformas: [],
        facturas: [],
        notas: [],
        ventas: [],
        factura: {
            img: "",
            id: "",
            empresas: "",
            empresa: '',
            despacho: '',
            tipo: "",
            tipos: "",
            puntov: '',
            ruc: "",
            cliente: "",
            correo: "",
            direcccion: "",
            telefóno: "",
            transporte: "",
            observacion: "",
            desc: '',
            des: '',
            iva: '',
            iv: '',
            com: '',
            total: '',
            ven_cliente: '',
            subtotal: 0,
            subtotalDesc: 0,
        },
        clienteperseo: '',
        stactiva: false,
        stock: 0,
        facturar: "",
        factu: '',
        sendPedido: '',
        datosa: [],
        datosaa: [],
        detas: [],
        edit: [],
        edita: [],
        editan: [],
        instit: [],
        options: [],
        idusuarioresp: "",
        tamanoSubarray: 18,
        subarrays: [],
        option: [],
        tipo: [],
        tipos: [],
        configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d'
        },
        proforma: {
            id: "",
            cod: '',
        },
        insti: {
            id: '',
            nombre: '',
            ruc: '',
            telefono: '',
            correo: '',
            direccion: '',
            dat: '',
        },
        cod: '',
        verifica: '',
        popupeditar: false,
        popupfact: false,
        setMenu: 0,
        setPuntos: '',
        userCurrent: [],
        disabledVenta: false,
        check_activar_todo_stock: false,
        verificar_stockinsuficiente: false,
    }),
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'ObjectPuntos', 'userAsesor']),
    },
    props: {
        fact: {
            type: [Object, String],
            default: () => {}
        },
        listaEmpresas: {
            type: Array,
            default: () => []
        }
    },

    mounted() {
        let me = this
        this.userCurrent = JSON.parse(localStorage.getItem("usuario"))
        if (me.userCurrent.id_group == 33) {
            this.setMenu = 3
        } else {
            this.setMenu = 1
        }
        this.factu = this.fact;
        //ingreso por pedidos
        if (this.setMenu == 0) {
            this.sendPedido = this.ObjectPedido;
            this.getfacturar(this.factu);
            this.factura.puntov = this.sendPedido.id_institucion
        }
        //Ingreso de puntos de venta
        if (this.setMenu == 1) {
            this.setPuntos = this.ObjectPuntos;
            this.getfacturar(this.fact);
            this.factura.puntov = this.factu.id_ins_depacho
            // me.factura.tipos = me.tipo.filter(p => p.tip_ven_codigo == this.setPuntos.ca_tipo_pedido)[0]
            if (this.setPuntos.ca_tipo_pedido == 1) {
                me.tipoE = 'V'
                me.disabledVenta = true
            } else {
                me.tipoE = 'L'
            }
        }
        this.calculos();
    },
    methods: {
        calculos() {
            let me = this
            setTimeout(() => {
                me.factura.subtotal = (me.inpu.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0)).toFixed(2)
                me.factura.des = (me.factura.subtotal * (me.factura.desc / 100)).toFixed(2)
                me.factura.subtotalDesc = (me.factura.subtotal - me.factura.des).toFixed(2)
                me.factura.iva = ((me.factura.subtotal - me.factura.des) * (me.factura.iv / 100)).toFixed(2)
                me.factura.total = (parseFloat(me.factura.subtotal - me.factura.des) + parseFloat(me.factura.iva) + parseFloat(me.factura.transporte)).toFixed(2)
            }, 2000);

        },
        validateTransporte() {
            //si factura.transporte es menor a 0 coloco 0
            if (this.factura.transporte < 0) {
                this.factura.transporte = 0
            }
        },
        validateTransporteBlur() {
            //si factura.transporte es vacio coloco 0
            if (this.factura.transporte == '') {
                this.factura.transporte = 0
            }
        },
        changeHandled() {
            this.popupfact = false;
            this.$store.dispatch('setCerrarFactura', true);
            // this.popupfact=false;
            //this.$emit('changeHandled',true)
        },
        async verificar() {
            let me = this;
            if (me.factura.tipo.tdo_id == "" || me.factura.tipo.tdo_id == null || me.factura.tipo.tdo_id == undefined) {
                await this.$http
                    .get(this.$server_url + "Get_DatosFactura?prof_id=" + me.factu.prof_id + '&empresa=' + this.factura.empresa)
                    .then((res) => {
                        this.inpu = res.data;
                        if (this.inpu.length > 0) {
                            this.inpu = this.inpu.filter(p => {
                                if ((p.det_prof_cantidad - p.cant) === 0) {
                                    return false; // No incluir este elemento en el nuevo array
                                } else if (p.det_prof_cantidad !== p.cant && p.det_prof_cantidad !== 0) {
                                    p.det_prof_cantidad = parseInt(p.det_prof_cantidad) - parseInt(p.cant);
                                }
                                return true; // Incluir este elemento en el nuevo array
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                if (this.inpu.length == 0) {
                    this.$emit('changeHandled', true);
                    changeHandled
                }
            } else if (me.factura.tipo.tdo_id == 1) {
                if (me.factura.empresa == 1 || me.factura.empresa == 5 || me.factura.empresa == 6) {
                    me.inpu.forEach(po => {
                        po.stock = po.facturas_prolipa;
                    });
                } else if (me.factura.empresa == 3 || me.factura.empresa == 4) {
                    me.inpu.forEach(po => {
                        po.stock = po.facturas_calmed;
                    });
                }
            } else {
                if (me.factura.empresa == 1 || me.factura.empresa == 5 || me.factura.empresa == 6) {
                    me.inpu.forEach(el => {
                        el.stock = el.bodega_prolipa;
                    });
                } else if (me.factura.empresa == 3 || me.factura.empresa == 4) {
                    me.inpu.forEach(el => {
                        el.stock = el.bodega_calmed;
                    });
                }
            }

            me.getmin();
        },
        async getmin() {
            let a;
            this.stock = 0;
            if ((this.factura.empresa == 1 || this.factura.empresa == 5 || this.factura.empresa == 6) && (this.factura.tipo.tdo_id == 3 || this.factura.tipo.tdo_id == 4)) {
                a = '4';
            } else if ((this.factura.empresa == 1 || this.factura.empresa == 5 || this.factura.empresa == 6) && this.factura.tipo.tdo_id == 1) {
                a = '2';
            }
            if ((this.factura.empresa == 3 || this.factura.empresa == 4) && (this.factura.tipo.tdo_id == 3 || this.factura.tipo.tdo_id == 4)) {
                a = '5';
            } else if ((this.factura.empresa == 3 || this.factura.empresa == 4) && this.factura.tipo.tdo_id == 1) {
                a = '3';
            }
            await this.$http.get(this.$server_url + 'Get_MinStock?nombre=' + a)
                .then(res => {
                    this.stock = res.data;
                })
                .catch(err => {
                    console.log(err)
                });
        },
        dividirArray() {
            this.subarrays = [];
            for (let i = 0; i < this.inpu.length; i += this.tamanoSubarray) {
                this.subarrays.push(this.inpu.slice(i, i + this.tamanoSubarray));
            }
        },
        async getfacturar(tr) {
            let me = this;
            me.doc();
            me.tipoVenta();
            // me.getmin();
            me.tipod = 0;
            me.institucion = '';
            me.proforma.id = tr.prof_id;
            me.proforma.cod = tr.id;
            me.factura.empresas = tr.nombre;
            me.factura.empresa = tr.emp_id;
            me.factura.tipo = "";
            me.factura.com = tr.prof_com;
            me.factura.desc = tr.pro_des_por;
            me.factura.iv = tr.prof_iva_por;
            me.factura.tipos = "";
            me.factura.puntov = "";
            me.factura.sucursalv = '';
            me.factura.despacho = '',
                me.factura.ven_cliente = tr.ven_cliente;
            me.factura.observacion = tr.prof_observacion;
            me.clienteperseo = tr.clientesidPerseo;
            if (this.setMenu == 0) {
                this.$http.get(this.$server_url + 'Get_InstituV?id_insti=' + this.sendPedido.id_institucion)
                    .then(res => {
                        this.instit = res.data;
                        this.tipoi = this.instit[0].punto_venta;

                    })
                    .catch(err => {
                        console.log(err);
                    });
                me.factura.ruc = me.sendPedido.ruc;

                me.factura.institucion = me.sendPedido.nombreInstitucion;
                me.factura.correo = me.sendPedido.correo;
                me.factura.direcccion = me.sendPedido.direccionInstitucion;
                me.factura.telefono = me.sendPedido.telefonoInstitucion;
            }

            me.factura.fecha = me.mostrarFechayhora();
            me.factura.transporte = 0;
            me.popupfact = true;
            me.$vs.loading();
            await this.$http
                .get(this.$server_url + "Get_DatosFactura?prof_id=" + tr.id + '&empresa=' + this.factura.empresa)
                .then((res) => {
                    this.inpu = res.data;
                    if (this.inpu.length > 0) {
                        this.inpu = this.inpu.filter(p => {
                            if ((p.det_prof_cantidad - p.cant) === 0) {
                                return false; // No incluir este elemento en el nuevo array
                            } else if (p.det_prof_cantidad !== p.cant && p.det_prof_cantidad !== 0) {
                                p.det_prof_cantidad = parseInt(p.det_prof_cantidad) - parseInt(p.cant);
                            }
                            return true; // Incluir este elemento en el nuevo array
                        });
                        console.log(this.inpu);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            if (this.inpu.length == 0) {
                this.$emit('changeHandled', true);
            }
            me.$vs.loading.close();
        },
        mostrarFechayhora: function () {
            const date = new Date();
            const formatear =
                date.getFullYear() +
                "-" +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + date.getDate()).slice(-2) +
                " " +
                ("0" + date.getHours()).slice(-2) +
                ":" +
                ("0" + date.getMinutes()).slice(-2) +
                ":" +
                ("0" + date.getSeconds()).slice(-2);

            return formatear;
        },
        cerrar() {
            let me = this;
            me.popupfact = false;
            me.$emit("change", true);
        },
        async getVerificacionDVenta(id) {
            let nuevo = [{
                venta: 0,
                proforma: 0
            }]
            console.log(id);
            return new Promise((resolve, reject) => {
                this.$http
                    .get(this.$server_url + "VerificacionDVentaProforma?id=" + id)
                    .then((res) => {
                        nuevo = res.data;
                        console.log(nuevo);
                        if (nuevo.detallesCoinciden === false) {
                            this.verifica = 1;
                            this.documentosVenta = nuevo.ventas;
                        } else {
                            this.verifica = 0;
                            this.documentosVenta = nuevo.ventas;
                            this.$vs.notify({
                                text: 'La proforma ya finalizo.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        async metodoGuardar() {
            let me = this
            if (me.stactiva == false) {
                let errorStock = false
                //validar si parseInt(input.det_prof_cantidad) > parseInt(input.stock - stock) del array inpu mostrar un mensaje de alerta
                me.inpu.forEach(p => {
                    console.log("ee", p.det_prof_cantidad, p.stock)
                    if (parseInt(p.det_prof_cantidad) > parseInt(p.stock - me.stock)) {
                        errorStock = true
                    }
                });
                if (errorStock == true) {
                    me.$vs.notify({
                        text: "No se puede registrar un item con cantidad mayor a la disponible en el stock",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                    return
                }
            }
            if (me.stactiva) {
                let preValidacionStock = me.inpu.filter(p => p.cantidad > 0)
                if (preValidacionStock.length == 0) {
                    me.$vs.notify({
                        text: "No hay stock disponible para registrar el item",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                    return
                }
            }
            try {
                me.$vs.loading()
                await this.getVerificacionDVenta(this.proforma.cod);
                await this.getcov();
                await this.guardarnuevo();
            } catch (error) {
                console.error('Error en metodo_asincrono:', error);
            }
        },
        async guardarnuevo() {
            let me = this;
            let con2 = [];
            let suma = '';
            try {
                const res = await this.$http.get(this.$server_url + 'Verificarventa?prof_id=' + me.proforma.id);
                const con = res.data;
                me.inpu.forEach(al => {
                    if (con.length > 0) {
                        con.forEach(el => {
                            if (el.pro_codigo === al.pro_codigo) {
                                al.venta = el.venta + al.cant;
                                al.proforma = el.proforma
                            }
                        });
                        if (al.proforma === al.venta) {
                            con2.push(0);
                        } else {
                            con2.push(1);
                        }
                    } else {
                        if (al.cantidad == al.det_prof_cantidad) {
                            con2.push(0);
                        } else {
                            con2.push(1);
                        }
                    }
                });
                suma = con2.reduce((acc, val) => acc + val, 0);
            } catch (err) {
                console.log(err);
            }
            return new Promise((resolve, reject) => {
                if (this.verifica === 0) {
                    this.$vs.notify({
                        text: 'La proforma ya tiene su documento de venta',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    me.$vs.loading.close()
                    me.$emit('changeHandled', true);
                    this.popupvalidacion = true;
                } else {
                    let cont = 0;
                    me.$vs.loading()
                    //si tipod es vacio o nulo
                    if (me.factura.ven_cliente == 0 || me.factura.ven_cliente == null || me.factura.ven_cliente == undefined || me.factura.ven_cliente == "") {
                        me.$vs.notify({
                            text: "Seleccione el cliente",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    if (me.factura.empresa == 0 || me.factura.empresa == null || me.factura.empresa == undefined || me.factura.empresa == "") {
                        me.$vs.notify({
                            text: "Seleccione la empresa",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    if (me.factura.tipo == 0 || me.factura.tipo == null) {
                        me.$vs.notify({
                            text: "Seleccione el tipo de documento",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    if (me.inpu.length == 0) {
                        me.$vs.notify({
                            text: "Agregue los detalles antes de guardar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                        return;
                    }
                    me.inpu.forEach(el => {
                        if (el.det_prof_cantidad == el.cantidad) {
                            cont = cont + 1;
                        }
                        if (el.cant > 0) {
                            if (el.det_prof_cantidad == (el.cantidad + el.cant)) {
                                cont = cont + 1;;
                            }
                        }
                    });
                    const usuariorespo = localStorage.getItem("usuario");
                    const usuarioObjeto = JSON.parse(usuariorespo);
                    me.idusuarioresp = usuarioObjeto.idusuario;
                    let iniusuario = usuarioObjeto.iniciales
                    console.log(cont);
                    console.log(me.inpu.length);
                    me.inpu = me.inpu.filter(p => p.cantidad > 0)
                    if (me.inpu.length == 0) {
                        if (me.stactiva) {
                            me.$vs.notify({
                                text: "No tiene items active el stock es insuficiente",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            return;
                        } else {
                            me.$vs.notify({
                                text: "No tiene items active la opcion de Stock minimo",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            return;
                        }
                    }
                    let formData = new FormData();
                    let c, d, e, f;
                    f = me.factura.subtotal;
                    c = me.factura.des;
                    e = me.factura.iva;
                    d = me.factura.total;
                    if (me.cod != 0 || me.cod != null) {
                        formData.append("data_detalleventa", JSON.stringify(me.inpu));
                        formData.append("ven_codigo", me.cod);
                        formData.append("tip_ven_codigo", me.tipoE == 'V' ? 1 : 2);
                        formData.append("est_ven_codigo", 2);
                        formData.append("ven_tipo_inst", me.tipoE);
                        formData.append("ven_subtotal", f);
                        formData.append("ven_valor", d);
                        formData.append("ven_com_porcentaje", me.factura.com);
                        formData.append("ven_iva_por", me.factura.iv);
                        formData.append("ven_iva", e);
                        formData.append("ven_desc_por", me.factura.desc);
                        formData.append("ven_descuento", c);
                        formData.append("ven_fecha", me.mostrarFechayhora());
                        formData.append("ven_idproforma", me.proforma.id);
                        formData.append("id", me.proforma.cod);
                        formData.append("ven_transporte", me.factura.transporte);
                        formData.append("setMenu", me.setMenu);
                        formData.append("periodo_id", me.setPuntos.id_periodo);
                        formData.append("user_created", me.idusuarioresp);
                        formData.append("id_empresa", me.factura.empresa);
                        formData.append("institucion_id", me.factura.puntov);
                        formData.append('iniciales', me.userCurrent.iniciales)
                        formData.append("letra", me.factura.tipo.tdo_letra);
                        formData.append('codigo_contrato', me.setPuntos.codigo_contrato)
                        formData.append("l", me.factura.tipo.tdo_id);
                        formData.append("ven_cliente", me.factura.ven_cliente);
                        formData.append('tipod', me.tipod);
                        formData.append('idProforma', me.proforma.cod)
                        formData.append('user_creator_doc', usuarioObjeto.idusuario)
                        if (suma == 0) {
                            formData.append("prof_estado", 2);
                        } else {
                            formData.append("prof_estado", 6);
                        }
                        this.$http
                            .post(this.$server_url + "Postventa_Registra", formData)
                            .then((res) => {
                                me.$vs.loading.close();
                                if (res.data.status == 0) {
                                    me.$vs.notify({
                                        text: res.data.mensaje,
                                        color: "danger",
                                        iconPack: "feather",
                                        icon: "icon-x",
                                    });
                                    return;
                                }
                                if (res.data) {
                                    me.$vs.notify({
                                        text: "Venta con detalles se ha guardado con exito",
                                        color: "success",
                                        iconPack: "feather",
                                        icon: "icon-check",
                                    });
                                }
                                me.$emit('changeHandled', true);
                                resolve();
                            })
                            .catch(function () {
                                me.$vs.loading.close();
                                me.$emit('changeHandled', true);
                                reject('Venta con detalles no se pudo guardar');
                                me.$vs.notify({
                                    text: "Venta con detalles no se pudo guardar",
                                    color: "danger",
                                    iconPack: "feather",
                                    icon: "icon-x",
                                });
                            });
                    }
                }
            });
        },
        revisionVenta() {
            let me = this
            this.$http.get(this.$server_url + `finalizarDocumento/${me.proforma.cod}`)
                .then(function (res) {})
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        async getcov() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let iniusuario = usuarioObjeto.iniciales
            me.idusuarioresp = usuarioObjeto.idusuario;
            me.user = usuarioObjeto.nombres + " " + usuarioObjeto.apellidos;
            let ne = [];
            let c, d;
            try {
                const response = await this.$http.get(this.$server_url + "Get_CodVenta?letra=" + me.factura.tipo.tdo_letra + '&id=' + me.factura.empresa);
                ne = response.data;
                c = ne[0];
                d = ne[1];
                let le = '';
                if (me.factura.empresa === 1) {
                    le = 'P';
                } else if (me.factura.empresa === 3) {
                    le = 'C';
                } else if (me.factura.empresa === 5) {
                    le = 'P26';
                } else if (me.factura.empresa === 4) {
                    le = 'GC26';
                }
                if (me.setMenu == 0) {
                    if (me.factura.tipo.tdo_id == 3 || me.factura.tipo.tdo_id == 4) {
                        me.cod = "N-" + le + "-" + this.sendPedido.codigo_contrato + "-" + iniusuario + "-" + c + parseInt(d);
                    } else {
                        me.cod = c + "-" + le + "-" + this.sendPedido.codigo_contrato + "-" + iniusuario + "-" + d;
                    }
                }
                if (me.setMenu == 1) {
                    if (me.factura.tipo.tdo_id == 3 || me.factura.tipo.tdo_id == 4) {
                        me.cod = "N-" + le + "-" + this.setPuntos.codigo_contrato + "-" + iniusuario + "-" + c + parseInt(d);
                    } else {
                        me.cod = c + "-" + le + "-" + this.setPuntos.codigo_contrato + "-" + iniusuario + "-" + d;
                    }
                }
            } catch (err) {
                console.log(err);
                throw err; // Propagate the error
            }
        },
        doc() {
            let me = this;
            this.$http
                .get(this.$server_url + "Get_tdocu")
                .then((res) => {
                    me.tipos = res.data;

                })
                .catch((err) => {
                    console.log(err);
                });
        },
        tipoVenta() {
            let me = this;
            this.$http
                .get(this.$server_url + "Get_tipoVenta")
                .then((res) => {
                    me.tipo = res.data;
                    // me.factura.tipos = me.tipo.filter(p => p.tip_ven_codigo == this.setPuntos.ca_tipo_pedido)[0]
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async getcodi() {
            let me = this;
            let ne, cod;
            try {
                const response = await this.$http.get(this.$server_url + "codigoAgrupacion?letra=AG");
                ne = response.data;
                if (ne != 0 || ne != null || ne != undefined) {
                    cod = 'AG-' + ne;
                } else {

                }
                console.log(cod);
                return cod;
            } catch (err) {
                console.log(err);
                throw err; // Propagate the error
            }
        },
        validar_suma_todos_los_stock() {
            let me = this;
            if (me.check_activar_todo_stock == false) {
                me.check_activar_todo_stock = true
                console.log(me.check_activar_todo_stock, "cambia a true");
                me.inpu.forEach(po => {
                    po.stock = (po.facturas_prolipa || 0) + (po.facturas_calmed || 0) + (po.bodega_prolipa || 0) + (po.bodega_calmed || 0);
                });
                me.calculos();
            } else if (me.check_activar_todo_stock == true) {
                me.check_activar_todo_stock = false
                console.log(me.check_activar_todo_stock, "cambia a false");
                me.verificar();
                me.calculos();
            }
        },
        validar_select_documento_stock() {
            this.verificar_stockinsuficiente = this.inpu.some(input =>
                parseInt(input.det_prof_cantidad) > parseInt(input.stock)
            );
            this.limpiarchecks();
        },
        validarcheck_activar_stock_minimo() {
            let me = this;
            // this.check_activar_todo_stock = false;
            if (me.stactiva == false) {
                me.stactiva = true
            } else if (me.stactiva == true) {
                me.stactiva = false
            }
            if (me.check_activar_todo_stock == false) {
                this.verificar();
            }
            this.calculos();
        },
        limpiarchecks() {
            let me = this;
            me.check_activar_todo_stock = false;
            me.stactiva = false;
        }
    },
}
</script>


<style scoped>
.popophijo {
    z-index: 51003;
    position: fixed;
}
</style>
