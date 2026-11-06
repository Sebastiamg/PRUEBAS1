<template lang="html">
    <vx-card>
        <div v-if="menu != 0">
            <vs-button type="line" class="mt-2" @click="getregresa();">← Regresar</vs-button>
        </div>
        <div class="vx-row" v-if="menu==0">
          <vs-alert color="danger" style="height: 80px;">
            <p class="font-bold"><i class="fa-solid fa-eye"></i> Antes de agrupar verifique que ya no haya devoluciones en bodega
              (Una vez agrupado ya no se podra devolver bodega)
            </p>
          </vs-alert>
          <br>
            <vs-row class="mt-5">
                <vs-col vs-justify="center" vs-align="center" vs-w="5" class="m-2">
                    <p>Seleccione la Empresa:</p>
                    <v-select :options="listaEmpresas" :reduce="(listaEmpresas) => listaEmpresas" label="nombre" class="w-full" value="id" placeholder="--Seleccione--" v-model="empresa" @input="getfactura()" />
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="6" class="m-2">
                    <small>Buscar por institución o cédula del cliente <small>(Presionar enter para buscar)</small>:</small>
                    <vs-input v-model="busqueda" @keypress.enter="getfactura()" class="w-full" placeholder="Institucion / Punto de venta / CI cliente" />
                </vs-col>
            </vs-row>
            <vs-row>
              <div class="vx-row mt-3">
                <p v-if="porcentajes.length>0" class="ml-5" style="font-size: 13px;"><i class="fa-solid fa-triangle-exclamation"></i> Se encontraron {{ porcentajes.length }} tipos de porcentajes <b>De click en el porcentaje de abajo en azul para mostrar</b></p>
              </div>
            </vs-row>
            <div class="vx-row flex ml-2" v-if="porcentajes.length>0">
                <div class="flex mt-2 justify-start" :key="k" v-for="(t, k) in porcentajes">
                  <div class="flex m-2" style="flex-direction: column;">
                    <span style="font-size:11px;">Descuento encontrado</span>
                    <vs-button :color="buttonColors[k]" @click="changeColor(k,t)" class="ml-2 mt-1 small">{{t }}%</vs-button>
                  </div>
                </div>
            </div>
            <vs-table style="width: 100%!important;"  multiple max-items="10" v-model="facturas" pagination search :data="Proformas" no-data-text="No hay datos disponibles">
                <template slot="header">
                    <vs-col vs-type="flex" vs-w="auto" class="mt-2 m-3">
                        <vs-chip class="mr-2" color="primary">Cantidad: <b>{{ Proformas.length }} </b></vs-chip>
                        <vs-button color="dark" v-if="facturas.length > 0" icon="check" @click="agrupar();" class="mr-2">Agregar {{ facturas.length }} Pedidos</vs-button>
                        <!-- <vs-button type="border" style="border-radius: 10%;" color="primary" class="mr-2" @click="getcofirmacionbuttonseleccionado();comprobar();" icon="refresh">Actualizar</vs-button> -->
                    </vs-col>
                </template>
                <template slot="thead">
                    <vs-th> Código Proforma </vs-th>
                    <vs-th> Empresa emitente </vs-th>
                    <vs-th> Id de referencias </vs-th>
                    <vs-th> Datos cliente </vs-th>
                    <vs-th> Cantidad de ítems</vs-th>
                    <vs-th> Cantidad de libros</vs-th>
                    <vs-th> Valor </vs-th>
                    <vs-th> Estado</vs-th>
                    <vs-th></vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :data="tr" v-for="(tr, indextr) in data" :key="indextr">
                        <vs-td>
                            <small>{{ tr.proformas_codigo }}</small>
                        </vs-td>
                        <vs-td>
                            <small>{{ tr.nombre }}</small>
                        </vs-td>
                        <vs-td>
                            <b>Pre-factura #: </b> <small>{{ tr.ven_codigo }}</small><br />
                            <b>Pre-proforma #: </b> <small>{{ tr.ven_idproforma}}</small><br>
                            <b>Dsct {{ tr.ven_desc_por}}% </b>
                        </vs-td>
                        <vs-td>
                            <b>Institución: </b> <small>{{ tr.nombreInstitucion}}</small><br />
                            <b>Dirección: </b> <small>{{ tr.direccionInstitucion}}</small><br />
                            <b>Cédula cliente: </b> <small>{{ tr.cedula }}</small><br />
                            <b>Nombre cliente: </b> <small>{{ tr.nombres }} {{tr.apellidos}}</small>
                        </vs-td>
                        <vs-td> {{ tr.item }} <br /> </vs-td>
                        <vs-td>
                            <b>Libros realizado proforma: </b><small>{{ tr.libros }}</small> <br />
                            <b>Libros devueltos: </b><small>{{ parseInt(tr.devuelto) }}</small><br />
                            <b>Libros a facturar: </b><small>{{ parseInt(tr.libros)-parseInt(tr.devuelto) }}</small>
                        </vs-td>
                        <vs-td> ${{ tr.ven_valor }} <br /> </vs-td>
                        <vs-td>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #ff0000" v-if="tr.est_ven_codigo === 3" color="danger">Anulado</div>
                            <div class="my-1" style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: black" v-if="tr.estadoPerseo == 1 && tr.idtipodoc==1" color="black">Proformado en perseo</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #23BF23" v-if="tr.est_ven_codigo === 1" color="#23BF23">Despachado</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: DarkOrange" color="DarkOrange">Pendiente</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #00BFBF" v-if="tr.est_ven_codigo === 4" color="#00BFBF">Liquidado</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #D86161" v-if="tr.est_ven_codigo === 5" color="#D86161">Deuda</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #009999" v-if="tr.est_ven_codigo === 6" color="#009999">Cargado</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #FF7C26" v-if="tr.est_ven_codigo === 7" color="#FF7C26">Por depositar</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #D800D8" v-if="tr.est_ven_codigo === 8" color="#D800D8">Sin cuenta</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #FF2626" v-if="tr.est_ven_codigo === 9" color="#FF2626">Error cuenta</div>
                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #AF7AC5" v-if="tr.est_ven_codigo === 10" color="#AF7AC5">Empacado</div>
                        </vs-td>
                        <vs-td>
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 320px;" class="cursor">
                                    <vs-dropdown-item v-if="tr.idtipodoc==1">
                                        <vs-button color="DarkOrchid" type="line" class="w-full" @click="factu= tr;getreporte(tr);">Generar pdf </vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>

                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <vs-popup fullscreen :title="`${id}`" v-if="tdo==1&&id" :active.sync="popupImprimir">
            <facturaVue v-if="popupImprimir" :factu="factu" :id="id" @change="change" />
        </vs-popup>
        <div v-if="menu==1&&popupagrupa">
            <vs-row vs-justify="center">
                <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <b>Lista de documentos a agrupar</b>
                    <ul>
                        <li v-for="(tr, index) in facturas" :key="index">
                            * {{ tr.proformas_codigo }} - <small>{{ tr.ven_codigo }}</small>
                        </li>
                    </ul>
                </vs-col>
            </vs-row>
            <br>
            <div v-if="libro">

                <vs-table class="mt-2" :data="libro" stripe :max-items="20" search>
                    <template slot="header">
                        <vs-chip color="primary">Cantidad: <b> {{ libro.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                        <vs-th>#</vs-th>
                        <vs-th>Codigo</vs-th>
                        <vs-th>Precio * Unidad</vs-th>
                        <vs-th>Cantidad pedida</vs-th>
                        <vs-th>Cantidad devuelta</vs-th>
                        <vs-th>Cantidad a facturar</vs-th>
                        <vs-th>Precio * Cantidad</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="k" v-for="(tr, k) in data">
                            <vs-td> {{k+1}} </vs-td>
                            <vs-td>
                                {{ tr.pro_codigo}}
                            </vs-td>
                            <vs-td> {{ tr.det_ven_valor_u }} </vs-td>
                            <vs-td>{{ tr.det_ven_cantidad }}</vs-td>
                            <vs-td>{{ tr.det_ven_dev }}</vs-td>
                            <vs-td>
                                {{ tr.cantidad=parseInt(tr.det_ven_cantidad)-parseInt(tr.det_ven_dev) }}
                            </vs-td>
                            <vs-td style="text-align: right;"> {{ tr.subtotal=(parseInt(tr.cantidad)* parseFloat(tr.det_ven_valor_u)).toFixed(2)}} </vs-td>
                        </vs-tr>
                        <vs-tr>
                            <vs-td colspan="5"> </vs-td>
                            <vs-td> <b>SUBTOTAL $</b></vs-td>
                            <vs-td style="text-align: right;"> <small><b> {{ subtotal }} </b></small></vs-td>
                        </vs-tr>
                        <vs-tr>
                            <vs-td colspan="5"> </vs-td>
                            <vs-td> <b>DESCUENTO {{ ven_desc_por1[0] }}% $</b></vs-td>
                            <vs-td style="text-align: right;"> <small><b> {{ descuento }} </b></small></vs-td>
                        </vs-tr>
                        <vs-tr>
                            <vs-td colspan="5"> </vs-td>
                            <vs-td> <b>(SUBTOTAL-DESCUENTO) $</b></vs-td>
                            <vs-td style="text-align: right;"> <small><b> {{ subtota }} </b></small></vs-td>
                        </vs-tr>
                        <vs-tr>
                            <vs-td colspan="5"> </vs-td>
                            <vs-td> <b>IVA $</b></vs-td>
                            <vs-td style="text-align: right;"> <small><b> {{ iva }} </b></small></vs-td>
                        </vs-tr>
                        <vs-tr>
                            <vs-td colspan="5"> </vs-td>
                            <vs-td> <b>TRANSPORTE $</b></vs-td>
                            <vs-td style="text-align: right;"> <small><b> {{ transporte }} </b></small></vs-td>
                        </vs-tr>
                        <vs-tr>
                            <vs-td colspan="5"> </vs-td>
                            <vs-td> <b>TOTAL $</b></vs-td>
                            <vs-td style="text-align: right;"> <b> {{ total }} </b></vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <br /><br />
            <div class="flex justify-center">
                <vs-button color="primary" @click="getGuardar()">Guardar</vs-button>
                <vs-button class="ml-4" color="warning" @click="getregresa();">Cancelar</vs-button>
            </div>
        </div>
    </vx-card>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    const facturaVue = () => import('./factura.vue');
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import vSelect from 'vue-select';
    import ListadoPerseo from "./ListadoPerseo.vue";
    export default {
        components: {
            flatPickr,
            'v-select': vSelect,
            facturaVue,
        },

        data: () => ({
            buttonColors: {},
            usuario: '',
            Proformas: [],
            Proforma: [],
            facturas: [],
            factu: [],
            perseo: '',
            pagado: '',
            transporte: '',
            busqueda: '',
            popupagrupa: false,
            popupImprimir: false,
            periodo: '',
            codigo: '',
            setMenu: '',
            libros: [],
            idSumas: {},
            libro: [],
            subtotal: '',
            descuento: '',
            subtota: '',
            iva: '',
            transporte: '',
            total: '',
            id: '',
            tdo: 0,
            menu: 0,
            empresa: '',
            ven_desc_por1: 0,
            porcentajes: [],
            porcentaje: '',
            listaEmpresas: [],

        }),
        mounted() {
            const usuariorespo = localStorage.getItem("usuario");
            this.periodo = localStorage.getItem("setMenu");
            this.usuario = JSON.parse(usuariorespo);
            this.groupid = this.usuario.id_group;
            let me = this
            if (me.usuario.id_group == 33) {
                this.setMenu = 3
            } else {
                this.setMenu = 1
            }
            me.menu = 0;
            me.getEmpresas();
        },
        methods: {
            getregresa() {
                this.menu = 0;
                this.facturas = '';
                this.busquedad = '';
                // this.empresa = '';
                // this.Proformas = '';
                // this.porcentajes = '';
                this.libros = [];
                this.idSumas = {};

            },
            async getcod(a) {
                let ne = [];
                let c, d, cod;
                let l;
                try {
                    const response = await this.$http.get(this.$server_url + "Get_CodVenta?letra=F&id=" + a);
                    if (a == 1) {
                        l = 'P';
                    } else if (a == 3) {
                        l = 'C';
                    }
                    ne = response.data;
                    c = ne[0];
                    d = ne[1];
                    cod = c + "-" + this.periodo + "-" + l + "-" + this.usuario.iniciales + "-" + d;
                    return cod;
                } catch (err) {
                    console.log(err);
                    throw err; // Propagate the error
                }
            },
            getEmpresas() {
                let me = this;
                me.listaEmpresas = [];
                this.$http.get(this.$server_url + 'empresa')
                    .then(res => {
                        me.listaEmpresas = res.data;
                        me.listaEmpresas = me.listaEmpresas.filter(empresa => empresa.id !== 2);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            },
            changeColor(index, value) {
              console.log("uno",index.value)
                Object.keys(this.buttonColors).forEach((key) => {
                    this.$set(this.buttonColors, key, 'primary');
                });
                // Alterna entre dos colores (puedes agregar más colores si lo deseas)
                this.$set(this.buttonColors, index, '#000');
                // Aquí puedes llamar al método filtro si también necesitas ejecutar esa lógica
                this.filtro(value);
            },
            filtro(porciento) {
                let me = this;
                me.facturas = [];
                me.Proformas = me.Proforma.filter(item => item.ven_desc_por == porciento);
                console.log('object', porciento);
                console.log('5', me.porcentaje);
            },
            getfactura() {
                let me = this;
                me.facturas = [];
                me.Proformas = [];
                me.porcentajes = [];
                if (!me.empresa) {
                    me.$vs.notify({
                        text: "Seleccione la empresa por favor!",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return;
                }
                console.log(me.busqueda.length, "valor");
                if (!me.busqueda.trim() || me.busqueda.trim().length < 5) {

                    me.$vs.notify({
                        text: "Ingrese al menos 5 letras para la busqueda por favor!",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return;
                }
                me.$vs.loading();
                const proformasxperiodo = localStorage.getItem('pid');
                me.$http.get(this.$server_url + 'GetPreFacturasxAgrupa?busqueda=' + me.busqueda + '&periodo=' + proformasxperiodo + '&empresa=' + me.empresa.id)
                    .then((res) => {
                        me.$vs.loading.close();
                        let dato = res.data;
                        me.Proforma = dato
                        me.porcentajes = [...new Set(this.Proforma.map(item => item.ven_desc_por))];
                        this.porcentajes.forEach((_, index) => {
                            this.$set(this.buttonColors, index, 'primary');
                        });
                        if (me.Proforma.length == 0) {
                            me.$vs.notify({
                                text: "No se encontraron resultados!",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            return
                        } else {
                            // me.busqueda = '';
                            // me.empresa = ''
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
            },
            change(e) {
                if (e == true) {
                    this.tdo = 0;
                }
            },
            getreporte(tr) {
                this.tdo = 0;
                this.id = tr.ven_codigo;
                if (tr.idtipodoc == 1) {
                    this.tdo = 1;
                    this.popupImprimir = true;
                }
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
            calculos() {
                let me = this;
                me.ven_desc_por1 = [...new Set(this.facturas.map(item => item.ven_desc_por))];
                let ven_desc_por = [...new Set(this.facturas.map(item => item.ven_desc_por))];
                let ven_iva_por = [...new Set(this.facturas.map(item => item.ven_iva_por))];
                this.subtotal = this.libro.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2);
                this.descuento = (parseFloat(this.subtotal) * (parseFloat(ven_desc_por)) / 100).toFixed(2);
                this.subtota = (this.subtotal - this.descuento).toFixed(2);
                this.iva = (this.subtota * ven_iva_por).toFixed(2);
                this.transporte = this.facturas.reduce((prev, curr) => prev + parseFloat(curr.ven_transporte), 0).toFixed(2);
                this.total = (parseFloat(this.subtotal) - parseFloat(this.descuento) + parseFloat(this.transporte) + parseFloat(this.iva)).toFixed(2);
                //convertir total en float
                this.total = parseFloat(this.total).toFixed(2);
            },
            async agrupar() {
                let me = this;
                me.libros = [];
                let busq = [...new Set(this.facturas.map(item => item.id_empresa))];
                me.popupagrupa = true;
                me.menu = 1;
                me.codigo = await me.getcod(busq);
                let estado = [];
                let dato = [];
                me.facturas.forEach(el => {
                    let dat;

                    dat = {
                            ven_codigo: el.ven_codigo,
                            profor: el.proformas_codigo,
                        },
                        estado.push(dat);
                    if (el.ven_codigo) {
                        this.$http.get(this.$server_url + 'Get_DFactura?ven_codigo=' + el.ven_codigo + '&idemp=' + el.id_empresa)
                            .then(res => {
                                let datos = res.data;
                                me.libros.push(datos);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }

                });
                if (me.libros) {
                    this.$vs.loading();
                    setTimeout(() => {
                        me.sumarValores();
                        me.calculos();
                        this.$vs.loading.close();
                    }, 5000)

                }
                me.perseo = estado;

            },
            sumarValores() {
                this.libro=[];
                this.idSumas = {};
                this.libros.forEach(subArray => {
                    subArray.forEach(obj => {
                        if (!this.idSumas[obj.pro_codigo]) {
                            // Si es la primera vez que se encuentra obj.pro_codigo, inicializar las propiedades
                            this.idSumas[obj.pro_codigo] = {
                                pro_codigo: obj.pro_codigo,
                                det_ven_cantidad: obj.det_ven_cantidad || 0,
                                det_ven_valor_u: obj.det_ven_valor_u || 0,
                                det_ven_dev: obj.det_ven_dev || 0
                            };
                        } else {
                            // Sumar los valores si ya existe obj.pro_codigo en idSumas
                            this.idSumas[obj.pro_codigo].det_ven_cantidad += obj.det_ven_cantidad || 0;
                            this.idSumas[obj.pro_codigo].det_ven_dev += obj.det_ven_dev || 0;
                        }
                    });
                });
                this.libro = Object.values(this.idSumas);
                setTimeout(() => {
                    this.calculos();
                }, 1000);
            },
            getGuardar() {
                let me = this;
                me.calculos();
                if (this.facturas.length == 0) {
                    me.$vs.notify({
                        text: "No se encontraron facturas para agrupar!",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return
                }
                let id_ins_depacho = this.facturas[0].institucion_id;
                let id_emp = [...new Set(this.facturas.map(item => item.id_empresa))];
                let clientesidPerseo = [...new Set(this.facturas.map(item => item.clientesidPerseo))];
                let ven_desc_por = [...new Set(this.facturas.map(item => item.ven_desc_por))];
                let ven_iva_por = [...new Set(this.facturas.map(item => item.ven_iva_por))];
                let periodo_id = [...new Set(this.facturas.map(item => item.periodo_id))];
                // let id_ins_depacho = [...new Set(this.facturas.map(item => item.id_ins_depacho))];
                let ven_cliente = [...new Set(this.facturas.map(item => item.ven_cliente))];
                me.pagado = this.facturas.reduce((prev, curr) => prev + parseFloat(curr.ven_pagado), 0).toFixed(2);
                me.devoluciones = this.facturas.reduce((prev, curr) => prev + parseFloat(curr.ven_devolucion), 0).toFixed(2);
                if (me.codigo != 0 || me.codigo != null) {
                    let formData = new FormData();
                    formData.append("data_detalle", JSON.stringify(me.libro));
                    formData.append("ven_codigo", me.codigo);
                    formData.append("id_empresa", id_emp);
                    formData.append("ven_desc_por", ven_desc_por);
                    formData.append("ven_iva_por", ven_iva_por);
                    formData.append("ven_descuento", me.descuento);
                    formData.append("ven_iva", me.iva);
                    formData.append("ven_transporte", me.transporte);
                    formData.append("ven_valor", me.total);
                    formData.append("ven_subtotal", me.subtotal);
                    formData.append("ven_devolucion", me.devoluciones);
                    formData.append("ven_pagado", me.pagado);
                    formData.append("id_ins_depacho", id_ins_depacho);
                    formData.append("periodo_id", periodo_id);
                    formData.append("ven_cliente", ven_cliente);
                    formData.append("clientesidPerseo", clientesidPerseo);
                    formData.append("ven_fecha", me.mostrarFechayhora());
                    formData.append("user_created", me.usuario.idusuario);
                    formData.append("data_ventas", JSON.stringify(me.perseo));
                    this.$http
                        .post(this.$server_url + "Postventa_factura", formData)
                        .then((res) => {
                            me.$vs.loading.close();
                            me.porcentajes = []
                            me.facturas = []
                            me.libro  = []
                            if (res.data.status == 2) {
                                me.$vs.notify({
                                    text: res.data.mensaje,
                                    color: "danger",
                                    iconPack: "feather",
                                    icon: "icon-x",
                                });
                                return;
                            }
                            if (res.data.status == 200) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: "success",
                                    iconPack: "feather",
                                    icon: "icon-check",
                                });
                                me.getregresa();
                            }
                            if (res.data.status == 500) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: "success",
                                    iconPack: "feather",
                                    icon: "icon-check",
                                });
                            }
                        })
                        .catch(function () {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                text: "Documento no se pudo guardar",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            return;
                        });
                }
                me.busqueda = '';
                me.Proformas = [];
                me.menu = 0;
                me.agrupar();
            },
        },
    }
    </script>
