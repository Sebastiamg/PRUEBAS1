<template>
    <vx-card>
        <div class="vx-row">
            <div class="mb-1">
                <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                    <ul class="flex mt-2">
                        <li>
                            <vs-radio v-model="estado_proforma" class="ml-2" vs-name="radios1tipo" vs-value="0" @input="menu=0;getcofirmacionbuttonseleccionado()">Pendientes</vs-radio>
                        </li>
                        <li>
                            <vs-radio v-model="estado_proforma" class="ml-2" vs-name="radios1tipo" vs-value="1" @input="menu=0;getcofirmacionbuttonseleccionado()">Aprobadas</vs-radio>
                        </li>
                        <li>
                            <vs-radio v-model="estado_proforma" class="ml-2" vs-name="radios1tipo" vs-value="2" @input="menu=0;getcofirmacionbuttonseleccionado()">Finalizadas</vs-radio>
                        </li>
                        <li>
                            <vs-radio v-model="estado_proforma" class="ml-2" vs-name="radios1tipo" vs-value="3" @input="menu=0;getcofirmacionbuttonseleccionado()">Anuladas</vs-radio>
                        </li>
                        <!-- <li>
                            <vs-radio v-model="estado_proforma" class="ml-2" vs-name="radios1tipo" vs-value="4" @input="getcofirmacionbuttonseleccionado()">Nuevas Solicitudes</vs-radio>
                        </li> -->
                        <!-- <li>
                          <vs-radio v-model="estado_proforma" class="ml-2" vs-name="radios1tipo" vs-value="5" @input="menu=1"><b class="text-danger">Pre Facturas pendientes enviar a: <b>PERSEO</b></b></vs-radio>
                      </li> -->
                    </ul>
                </div>
            </div>
            <!--pre proformas-->
            <div v-if="menu == 0">
              <vs-table max-items="10" pagination search :data="Proformas" no-data-text="No hay datos disponibles">
                <template slot="header">
                    <vs-col vs-type="flex" vs-w="auto" class="mt-2 m-3">
                        <vs-chip class="mr-2" color="primary">Cantidad: <b>{{ Proformas.length }} </b></vs-chip>
                        <vs-button type="border" style="border-radius: 10%;" color="primary" class="mr-2" @click="getcofirmacionbuttonseleccionado();comprobar();" icon="refresh">Actualizar</vs-button>
                    </vs-col>
                </template>
                <template slot="thead">
                    <vs-th width="100"> Código Proforma </vs-th>
                    <vs-th width="100"> Nombre Agrupado </vs-th>
                    <vs-th width="200"> Cantidad de ítems</vs-th>
                    <vs-th width="500"> Cantidad de libros</vs-th>
                    <vs-th width="500"> Precio</vs-th>
                    <vs-th width="500"> Empresa</vs-th>
                    <vs-th width="200"> Estado</vs-th>
                    <vs-th width="200"> Acciones </vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr v-for="(tr, indextr) in data" :key="indextr">
                        <vs-td>
                            {{ tr.prof_id }}
                        </vs-td>
                        <vs-td>
                            <b>{{tr.ca_codigo_agrupado}}</b><br/>
                            {{ tr.ca_descripcion }}
                        </vs-td>
                        <vs-td> {{ tr.item }} <br /> </vs-td>
                        <vs-td> {{ tr.libros }} <br /> </vs-td>
                        <vs-td> ${{ tr.prof_total }} <br /> </vs-td>
                        <vs-td> {{ tr.nombre }} <br /> </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.prof_estado == 0" color="Red">Anulado</vs-chip>
                            <vs-chip v-if="tr.prof_estado == 1" color="DarkOrange">Pendiente</vs-chip>
                            <vs-chip v-if="tr.prof_estado == 3" color="SlateBlue">Aprobado</vs-chip>
                            <vs-chip v-if="tr.prof_estado == 6" color="#e34b19">Aprobado con pendiente</vs-chip>
                            <vs-chip v-if="tr.prof_estado == 4" color="#AD4497">Preaprobado</vs-chip>
                            <vs-chip v-if="tr.prof_estado == 5" color="#AD4497">Aceptado</vs-chip>
                            <vs-chip v-if="tr.prof_estado == 2" color="MediumSeaGreen">Finalizado</vs-chip>
                            <small>{{tr.username}} {{tr.lastname}}</small>
                        </vs-td>
                        <vs-td>
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 320px;" class="cursor">
                                    <vs-dropdown-item v-if="tr.prof_estado === 3">
                                        <vs-button color="DarkGreen" type="line" class="w-full" @click="getfact(tr)">Crear documento de
                                            venta</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.prof_estado != 3 && tr.prof_estado != 0 && tr.prof_estado != 2">
                                        <vs-button color="DarkGreen" type="line" class="w-full" @click=" popup_ap(tr)">Aprobar</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.prof_estado != 0 && tr.prof_estado != 2 && tr.prof_estado != 5 && tr.prof_estado != 3">
                                        <vs-button color="DodgerBlue" type="line" class="w-full" @click="accionProforma = 1, ObjectEdit = tr; geteditar(tr)">Editar</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                        <vs-button color="SpringGreen" type="line" class="w-full" @click="getExcelx(tr); startLoading()">Exportar Excel</vs-button>

                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                        <vs-button color="DarkOrchid" type="line" class="w-full" @click="ObjectEdit = tr;getpdf(tr);">Imprimir pdf</vs-button>

                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.prof_estado != 0 && tr.prof_estado != 2">
                                        <vs-button color="Coral" type="line" class="w-full" @click="popup_p(tr)">Anular</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="tr.prof_estado != 0 && tr.prof_estado != 2 && groupid==1">
                                        <vs-button color="danger" type="line" class="w-full" @click="getPreguntaEliminar(tr)">Eliminar</vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
              </vs-table>
            </div>
        </div>
        <!--pre facturas-->
        <!-- <div v-if="menu == 1">
          <ScreenPrefacturasVue v-if="menu == 1" :periodoSelect="periodoSelect"/>
        </div> -->
        <vs-popup v-if="hijo == 1" fullscreen class="reporte" :title="`Reporte Proforma`" :active.sync="popupReportePdf">
            <reporte :ObjectEdit="ObjectEdit" :adato="datosa" :resumen="datosaa" :array="detalle" :PendienteProforma="PendienteProforma" @changeClosePdf="changeClosePdf" />
        </vs-popup>
        <!--MODALES-->
        <!--Eliminar Revision-->
        <vs-popup class="eliminar" :title="`Eliminación`" :active.sync="popupActivoEliminar">
            <p>
                ¿Confirma que desea eliminar la proforma #: {{ proforma.codigo }}?
            </p>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar(); popupActivoEliminar = false" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="popupActivoEliminar = false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!--Aprobar Revision-->
        <vs-popup class="aprobar" title="Confirmación" :active.sync="popupaprobar">
            <p>
                ¿Confirma que desea aprobar la proforma #: {{ proforma.codido }} para la venta?
            </p>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getaprobar(); popupaprobar = false" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="popupaprobar = false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <!--Anular Revision-->
        <vs-popup class="desactivar" :title="`Anulación`" :active.sync="popupActivoDesactivar">
            <center>
                <p>
                    ¿Confirma que desea anular la proforma #: {{ proforma.codigo }}?
                </p>
                <div class="flex justify-center mt-3">
                    <vs-button @click="anular(); popupActivoDesactivar = false" type="relief">Aceptar</vs-button>
                    <vs-button @click="popupActivoDesactivar = false" class="ml-5" color="danger" type="relief">Cancelar</vs-button>
                </div>
            </center>
        </vs-popup>
        <!--POPUP Registro revision de pedidos-->
        <vs-popup fullscreen :title="`Proforma `" :active.sync="popupproforma">
            <div v-if="popupproforma">
                <VistaVue :listaEmpresas="listaEmpresas" :setPuntos="setPuntos" :options="options" :option="option" :input="inputs" :sendPedido="sendPedido" :id="proforma.id" @change="changeClose" :accionProforma="accionProforma" />
            </div>
        </vs-popup>
        <!--POPUP generacion de documentos excel o pdf-->
        <div v-if="popupcarga">
            <FileUploadModal @change="changeHandle" />
        </div>
        <!--Edicion de proforma-->
        <vs-popup fullscreen :title="`Proforma N°  ${proforma.id}`" :active.sync="popupproformaedit">
            <div v-if="popupproformaedit">
                <VistaVue :listaEmpresas="listaEmpresas" :setPuntos="setPuntos" :options="options" :option="option" :inputs2="edit" :sendPedido="sendPedido" :id="proforma.id" @change="changeClose" :accionProforma="accionProforma" :ObjectEdit="ObjectEdit" :editan="editan" />
            </div>
        </vs-popup>
        <!-- datos de la factura -->
        <vs-popup fullscreen :title="`Referencia N°  ${proforma.id}`" :active.sync="popupfactura">
            <div v-if="popupfactura">
                <FacturaVue :fact="fact" @changeHandled="changeHandled" :listaEmpresas="listaEmpresas" @changeCliente="changeCliente" @change="changeDocumento" />
                <vs-popup class="editar" :title="`Edicion de datos`" :active.sync="popupeditar">
                    <vs-row>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                <vs-col vs-justify="center" vs-align="center" vs-w="11" class="m-1">
                                    <vs-input label="Nombre:" class="w-full" icon="error_outline" disabled v-model="insti.nombre" />

                                </vs-col>
                            </vs-row>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                    <vs-input label="Id Institución:" class="w-full" icon="error_outline" disabled v-model="insti.id" />
                                </vs-col>
                            </vs-row>
                            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                    <vs-input label="RUC:" class="w-full" icon="edit" v-model="insti.ruc" />
                                </vs-col>
                            </vs-row>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                    <vs-input label="Telefono: " class="w-full" icon="edit" v-model="insti.telefono" />
                                </vs-col>
                            </vs-row>
                            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                    <vs-input label="Correo:" class="w-full" icon="edit" v-model="insti.correo" />
                                </vs-col>
                            </vs-row>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">

                            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                <vs-col vs-justify="center" vs-align="center" vs-w="11" class="m-1">
                                    <vs-input label="Dirección: *" class="w-full" icon="edit" v-model="insti.direccion" />
                                    <span v-if="!insti.direccion" style="color: red; font-size: 11.5px;">Este campo es
                                        obligatorio</span>
                                </vs-col>
                            </vs-row>
                        </vs-col>
                    </vs-row>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="insti.dat == 0">
                        <vs-button @click="actualizainsti()" type="relief" color="green">Actualizar</vs-button>&emsp;
                        <vs-button @click="popupeditar = false" color="danger" type="relief">Cancelar</vs-button>
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="insti.dat == 1">
                        <vs-button @click="actualizasucur()" type="relief" color="green">Actualiza</vs-button>&emsp;
                        <vs-button @click="popupeditar = false" color="danger" type="relief">Cancelar</vs-button>
                    </vs-col>
                </vs-popup>
                <vs-popup class="editar" :title="`Agregar lugar de despacho`" :active.sync="popupsucursal">
                    <vs-row>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                <vs-col vs-justify="center" vs-align="center" vs-w="8" class="m-2">
                                    <p>Puntos de venta: *</p>
                                    <v-select :options="puntos" :reduce="(puntos) => puntos" density="comfortable" label="nombreInstitucion" class="w-full" value="idInstitucion" placeholder="--Seleccione--" @input="Validarsel()" v-model="factura.puntov" required />
                                </vs-col>
                                <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                                    <vs-button pill variant="info" class="w-full" color="rgb(59,222,200)" icon="edit" @click="getactuaInst(1); popupeditar = true; popupsucursal = false" v-if="factura.puntov">Editar</vs-button>
                                </vs-col>
                            </vs-row>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                <div class="custom-alert" v-if="factura.puntov && sucursal.length <= 0">
                                    No se encontraron sucursales disponibles en este momento. Por favor, contacta al soporte
                                    técnico
                                    para obtener ayuda.
                                </div>
                                <vs-col vs-justify="center" vs-align="center" vs-w="12" class="m-2" v-if="factura.puntov && sucursal.length > 0">
                                    <vs-table class="table users table-hover" :data="sucursal">
                                        <template slot="thead">
                                            <vs-th width="25"> # </vs-th>
                                            <vs-th width="150"> Nombre</vs-th>
                                            <vs-th width="300"> Dirección </vs-th>
                                            <vs-th width="200"> Acciones </vs-th>
                                        </template>
                                        <template slot-scope="{ data }">
                                            <vs-tr v-for="(tr, k) in sucursal" :key="k" style="text-size-adjust: 9px;">
                                                <vs-td><b>{{ k + 1 }}</b></vs-td>
                                                <vs-td>
                                                    <b>{{ tr.isuc_nombre }}</b>
                                                </vs-td>
                                                <vs-td><b>{{ tr.isuc_direccion }}</b></vs-td>
                                                <vs-td>
                                                    <vs-button type="line" class="w-full" color="#48C9B0" @click="geteditsucur(tr);">Editar</vs-button>
                                                    <vs-button type="line" class="w-full" color="#28B463" @click="selsucursal(tr);">Seleccione</vs-button>
                                                </vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </vs-col>
                            </vs-row>
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                <vs-col vs-justify="center" vs-align="center" vs-w="11" class="m-2">
                                    <p>{{ informacion }}</p>
                                </vs-col>
                            </vs-row>
                        </vs-col>
                    </vs-row>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                        <vs-button @click="Validarsel(); popupsucursal = false" type="relief" color="green">Seleccionar</vs-button>&emsp;
                        <vs-button @click="popupeditar = false" color="danger" type="relief">Cancelar</vs-button>
                    </vs-col>
                </vs-popup>
            </div>
        </vs-popup>
    </vx-card>
    </template>


    <script>
    import {
        mapState
    } from "vuex";

    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import vSelect from 'vue-select';
    const FileUploadModal = () => import('@/views/pedidos2/pedidos/proforma/FileUploadModal.vue') // Importa tu modal de carga
    import notaVue from './nota.vue';
    import ventaVue from './venta.vue';
    import VueHtml2pdf from 'vue-html2pdf';
    const VistaVue              = () => import("./VistaProforma.vue");
    const reporte               = () => import("./reportePro.vue");
    const FacturaVue            = () => import("./ScreenFactura.vue");
    const ScreenPrefacturasVue  = () => import('./components/prefacturas/ScreenPrefacturas.vue')
    export default {
        components: {
            flatPickr,
            reporte,
            VueHtml2pdf,
            'v-select': vSelect,
            notaVue,
            ventaVue,
            VistaVue,
            FileUploadModal,
            FacturaVue,
            ScreenPrefacturasVue,
        },

        data: () => ({
            id: '',
            fact: '',
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
            listaEmpresas: [],
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
                total: ''
            },
            stactiva: false,
            stock: '',
            facturar: "",
            proforma: {
                id: "",
                codigo: '',
                temporada: "",
                empresa: "",
                fecha: "",
                cliente: "",
                observacion: "",
                activa: '',
                tipo: '',
                tipos: "",
                estado: "",
                des: "",
                dec: "",
                iva: "",
                user: '',
                descuento: '',
                transporte: '',
                total: "",
                sub: '',
                tot: '',
                descu: '',
                subtotal: '',
            },
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
            insti: {
                id: '',
                nombre: '',
                ruc: '',
                telefono: '',
                correo: '',
                direccion: '',
                dat: '',
            },
            popupproformaedit: false,
            popupActivoEliminar: false,
            popupaprobar: false,
            popupActivoDesactivar: false,
            popupproforma: false,
            popupfactura: false,
            popupeditar: false,
            popupsucursal: false,
            popupcarga: false,
            popupReportePdf:false,
            accionProforma: 0,
            setMenu: 1,
            ObjectEdit: {},
            setPuntos: '',
            nombre_periodo: '',
            groupid: '',
            contador: '',
            popupChangeCliente: false,
            btnGenerarProforma: false,
            PendienteProforma: false,
            estado_proforma: 0,
            contadorbuttonsseleccionado: 0,
            menu:0,
        }),
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'ObjectPuntos', 'userAsesor', 'cerrarFactura','groupFacturador']),
        },
        mounted() {
          let me = this
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          if(me.usuario.id_group == 33){
            this.setMenu = 3
          }else{
            this.setMenu = 1
          }
            this.nombre_periodo = localStorage.getItem('nombre_periodoPuntos');
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            this.groupid = usuarioObjeto.id_group;
            //ingreso por pedidos
            // if (this.setMenu == 0) {
            //     this.sendPedido = this.ObjectPedido;
            //     this.id = this.sendPedido.id_pedido;
            //     this.usuario = JSON.parse(localStorage.getItem('usuario'));
            //     this.proforma.temporada = this.sendPedido.temporada;
            //     this.proforma.tipo = this.Proforma.tipo_venta;
            //     this.getproforma();
            //     this.comprobar();
            // }
            // //Ingreso de puntos de venta
            // if (this.setMenu == 1) {
            //     this.setPuntos = this.ObjectPuntos;
            //     this.id = this.setPuntos.ca_codigo_agrupado;
            //     this.usuario = JSON.parse(localStorage.getItem('usuario'));
            //     this.getproforma();
            //     this.comprobar();
            // }
            this.getcofirmacionbuttonseleccionado();
            this.getEmpresas();
        },
        watch: {
            Proformas(results) {
                let me = this
                if (results.length > 0) {
                    let datos = results.filter(p => p.prof_estado != 2 && p.prof_estado != 0)
                    if (datos.length > 0) {
                        me.btnGenerarProforma = false
                    } else {
                        me.btnGenerarProforma = true
                    }
                } else {
                    me.btnGenerarProforma = true
                }
            }
        },
        props:{
          periodoSelect:{
            type:Object,
            default:function(){
              return {}
            }
          }
        },
        methods: {
            changeCliente() {
                let me = this;
                me.popupChangeCliente = true;
            },
            startLoading() {
                this.popupcarga = true;
            },
            changeHandle(e) {
                let me = this;
                me.popupcarga = false;
            },
            changeHandled(e) {
                this.popupfactura = false;
                this.getproforma();
            },
            changeClose(e) {
                let me = this;
                if (e == true) {
                    if (me.accionProforma == 0) {
                        me.popupproforma = false;
                        me.getproforma();
                    }
                    if (me.accionProforma == 1) {
                        me.popupproformaedit = false;
                        me.getproforma();
                    }
                } else {
                    me.getproforma();
                }
            },
            changeDocumento() {
                let me = this;
                me.popupfactura = false;
            },
            getcofirmacionbuttonseleccionado() {
                // console.log(this.contadorbuttonsseleccionado, "cuantos");
                if (this.contadorbuttonsseleccionado === 0) {
                this.getproforma();
                }
                // Configurar un temporizador para restablecer contadorbuttonsseleccionado después de 2 segundos
                setTimeout(() => {
                this.contadorbuttonsseleccionado = 0;
                }, 1000);
            },
            getproforma() {
                let me = this;
                this.contadorbuttonsseleccionado = 1;
                me.$vs.loading();
                const proformasxperiodo = localStorage.getItem('pid');
                me.$http.get(this.$server_url + 'GetProformaGeneral?periodorecibido=' + proformasxperiodo + '&estadoproforma=' + me.estado_proforma)
                    .then((res) => {
                        this.Proformas = res.data;
                        if (this.Proformas.length == 0 && me.estado_proforma == 0) {
                            me.$vs.notify({
                                text: "No existen proformas pendientes.",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            me.$vs.loading.close();
                        }else if (this.Proformas.length == 0 && me.estado_proforma == 1) {
                            me.$vs.notify({
                                text: "No existen proformas aprobadas.",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            me.$vs.loading.close();
                        }else if (this.Proformas.length == 0 && me.estado_proforma == 2) {
                            me.$vs.notify({
                                text: "No existen proformas finalizadas.",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            me.$vs.loading.close();
                        }else if (this.Proformas.length == 0 && me.estado_proforma == 3) {
                            me.$vs.notify({
                                text: "No existen proformas anuladas.",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            me.$vs.loading.close();
                        }else if (this.Proformas.length == 0 && me.estado_proforma == 4) {
                            me.$vs.notify({
                                text: "No existen nuevas solicitudes.",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            me.$vs.loading.close();
                        } else {
                            me.Proformas.forEach(p => {
                                if (p.prof_estado === 0 || p.prof_estado === 2) {
                                    me.contador++;
                                }
                            });
                        }
                        me.$vs.loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
            },
            async venta(tipo) {
                let buscar = '';
                if (tipo == 0) {
                    buscar = this.sendPedido.id_pedido;
                }
                if (tipo == 1) {
                    buscar = this.setPuntos.ca_codigo_agrupado
                }
                await this.$http
                    .get(this.$server_url + "GetVentas?pedido_id=" + buscar + "&tipo=" + tipo)
                    .then((res) => {
                        this.ventas = res.data;
                        this.$vs.loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$vs.loading.close();
                    });
            },
            selsucursal(tr) {
                let me = this;
                if (tr.length == 0) {

                    me.$vs.notify({
                        text: "Seleccione..",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return false;
                } else {
                    me.informacion = me.factura.puntov.nombreInstitucion + " - " + tr.isuc_nombre + " - " + tr.isuc_ruc + " - Dirección: " + tr.isuc_direccion;
                    me.factura.sucursalv = tr.isuc_id;
                }
            },
            Validarsel() {
                let me = this;
                if (me.factura.puntov == null || me.factura.puntov == 0) {

                    me.$vs.notify({
                        text: "Seleccione..",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return false;
                } else {
                    me.informacion = me.factura.puntov.ruc + "  " + me.factura.puntov.nombreInstitucion + " " + me.factura.puntov.telefonoInstitucion +
                        " " + me.factura.puntov.email + " " + me.factura.puntov.direccionInstitucion;
                    me.sucursales(me.factura.puntov.idInstitucion);
                }
            },
            getsucursal() {
                this.factura.puntov = '';
                this.factura.sucursalv = '';
            },
            async getinfopedidoDespacho() {
                let me = this;
                await this.$http.get(this.$server_url + `pedidosDespacho?id_despacho=${me.setPuntos.ca_codigo_agrupado}&id_periodo=${me.setPuntos.id_periodo}`)
                    .then(res => {
                      this.inputs = res.data;
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            getactuaInst(a) {
                this.insti.dat = 0;
                if (a == 0) {
                    this.instit = [];
                    if (this.setMenu == 0) {
                        this.insti.id = this.sendPedido.id_institucion;
                    }
                    if (this.setMenu == 1) {
                        this.insti.id = this.setPuntos.ca_codigo_agrupado;
                    }
                    this.$http.get(this.$server_url + 'Get_InstituV?id_insti=' + this.insti.id)
                        .then(res => {
                            this.instit = res.data;
                            this.insti.nombre = this.instit[0].nombreInstitucion;
                            this.insti.ruc = this.instit[0].ruc;
                            this.insti.correo = this.instit[0].email;
                            this.insti.telefono = this.instit[0].telefonoInstitucion;
                            this.insti.direccion = this.instit[0].direccionInstitucion;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (a == 1) {
                    this.instit = [];
                    this.insti.id = this.factura.puntov.idInstitucion;
                    this.$http.get(this.$server_url + 'Get_InstituV?id_insti=' + this.insti.id)
                        .then(res => {
                            this.instit = res.data;
                            this.insti.nombre = this.instit[0].nombreInstitucion;
                            this.insti.ruc = this.instit[0].ruc;
                            this.insti.correo = this.instit[0].email;
                            this.insti.telefono = this.instit[0].telefonoInstitucion;
                            this.insti.direccion = this.instit[0].direccionInstitucion;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            geteditsucur(tr) {
                this.insti.dat = 1;
                this.instit = [];
                this.insti.id = tr.isuc_id;
                this.$http.get(this.$server_url + 'Get_sucur?id_insti=' + this.insti.id)
                    .then(res => {
                        this.instit = res.data;
                        this.insti.nombre = this.instit[0].isuc_nombre;
                        this.insti.ruc = this.instit[0].isuc_ruc;
                        this.insti.correo = this.instit[0].isuc_correo;
                        this.insti.telefono = this.instit[0].isuc_telefono;
                        this.insti.direccion = this.instit[0].isuc_direccion;
                        this.popupeditar = true;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            actualizainsti() {
                let datos = {
                    "idInstitucion": this.insti.id,
                    "ruc": this.insti.ruc,
                    "telefonoInstitucion": this.insti.telefono,
                    "direccionInstitucion": this.insti.direccion,
                    "email": this.insti.correo,
                }
                this.$vs.loading();
                this.$http.post(this.$server_url + 'PostProformaIntitu', datos)
                    .then(res => {
                        if (res.data != null || res.data != undefined || res.data != 0) {
                            this.$vs.loading.close();
                            this.popupeditar = false;
                            this.factura.ruc = this.insti.ruc;
                            this.factura.correo = this.insti.correo;
                            this.factura.direcccion = this.insti.direccion;
                            this.factura.telefóno = this.insti.telefono;

                            this.$vs.notify({
                                text: "Datos Institución se ha actualizado con exito",
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                        } else {
                            this.$vs.loading.close();
                            this.popupeditar = false;
                            this.$vs.notify({
                                text: "Datos Institución no se ha actualizado",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                        }
                    })
                    .catch(function () {
                        this.$vs.loading.close();
                        this.popupeditar = false;
                        this.$vs.notify({
                            text: 'Datos Institución no se ha actualizado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            },
            actualizasucur() {
                let datos = {
                    "isuc_id": this.insti.id,
                    "isuc_ruc": this.insti.ruc,
                    "isuc_telefono": this.insti.telefono,
                    "isuc_direccion": this.insti.direccion,
                    "isuc_correo": this.insti.correo,
                }
                this.$vs.loading();
                this.$http.post(this.$server_url + 'PostProformaSucursal', datos)
                    .then(res => {
                        if (res.data != null || res.data != undefined || res.data != 0) {
                            this.$vs.loading.close();
                            this.$vs.notify({
                                text: "Datos Sucursal se ha actualizado con exito",
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                        } else {
                            this.$vs.loading.close();
                            this.popupeditar = false;
                            this.$vs.notify({
                                text: "Datos Sucursal no se ha actualizado",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                        }
                    })
                    .catch(function () {
                        this.$vs.loading.close();
                        this.popupeditar = false;
                        this.$vs.notify({
                            text: 'Datos Sucursal no se ha actualizado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            },
            actualizasucursal() {
                let datos = {
                    "isuc_id": this.insti.id,
                    "isuc_ruc": this.insti.ruc,
                    "isuc_telefono": this.insti.telefono,
                    "isuc_direccion": this.insti.direccion,
                    "isuc_correo": this.insti.correo,
                }
                this.$vs.loading()
                this.$http.post(this.$server_url + 'PostProformaSucursal', datos)
                    .then(res => {
                        if (res.data != null || res.data != undefined || res.data != 0) {

                            this.$vs.notify({
                                text: "Datos sucursal se ha actualizado con exito",
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                        } else {
                            this.$vs.notify({
                                text: "Datos sucursal no se ha actualizado",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                        }
                        this.$vs.loading.close()
                    })
                    .catch(function () {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            text: 'Datos sucursal no se ha actualizado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            },
            async getDescuento() {
                //descuento
                let a = '6';
                let ne = [];
                let min, max, n;
                try {
                    const response = await this.$http.get(this.$server_url + 'Get_MinStock?nombre=' + a);
                    ne = response.data;
                    min = parseInt(ne[0]);
                    max = parseInt(ne[1]);
                    if (min <= max) {
                        this.option = [];
                        for (let i = min; i <= max; i++) {
                            n = 0;
                            n = i / 100;
                            this.option.push({
                                id: n,
                                value: i + '%'
                            });
                        }
                        this.option.push({
                            id: 0,
                            value: '0%'
                        });
                    }
                } catch (err) {
                    console.log(err);
                    throw err; // Propagate the error
                }
            },

            async sucursales(a) {
                this.sucursal = [];
                await this.$http.get(this.$server_url + 'Get_sucursalV?id_insti=' + a)
                    .then(res => {
                        this.sucursal = res.data;
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            changeClosePdf(e) {
                ;
                this.hijo = 0;
            },
            async getpdf(tr) {
                let me = this;
                me.datosa = [];
                me.datosaa = [];
                await this.$http.get(this.$server_url + 'GetProuser?pro_id=' + tr.prof_id)
                    .then(res => {
                        me.proforma.user = res.data;
                    })
                    .catch(err => {
                        me.$vs.loading.close();
                    });
                if (this.setMenu == 0) {
                    me.proforma.cliente = me.sendPedido.nombreInstitucion;
                    me.proforma.temporada = me.sendPedido.periodo;
                    me.proforma.observacion = tr.observacion + '-' + tr.prof_observacion;
                }
                if (this.setMenu == 1) {
                    me.proforma.cliente = this.setPuntos.nombreDespacho;
                    me.proforma.temporada = this.nombre_periodo;
                    me.proforma.observacion = tr.prof_observacion;
                }
                const nuevoDato = {
                    cliente:tr.cliente,
                    img: tr.img_base64,
                    prof_id: tr.prof_id,
                    temporada: me.proforma.temporada,
                    user: me.proforma.user,
                    fecha: tr.created_at,
                };
                me.datosa.push(nuevoDato);
                const ndato = {
                    cliente:tr.cliente,
                    iva: tr.prof_iva,
                    porcentaje: tr.pro_des_por,
                    descuento: tr.prof_descuento,
                    total: tr.prof_total,
                    transporte: 0,
                    observacion: me.proforma.observacion,
                    subtotal: (parseFloat(tr.prof_total) - parseFloat(tr.prof_iva) + parseFloat(tr.prof_descuento)),
                };
                me.datosaa.push(ndato);
                this.$http.get(this.$server_url + 'Get_DatosFactura?prof_id=' + tr.id)
                    .then(res => {
                        me.detalle = res.data;
                        me.hijo = 1;
                        if (tr.prof_estado === 1) {
                            me.PendienteProforma = true;
                        }
                        me.popupReportePdf=true;
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
            },
            exportToExcel() {
                let me = this
                let headerTitle = ""
                let headerVal = ""
                //INSTITUCION
                let TitleInstitucion = []
                TitleInstitucion.push("")
                TitleInstitucion.push("Proforma Nº:")
                TitleInstitucion.push(me.proforma.id)
                TitleInstitucion.push("")
                TitleInstitucion.push("")
                TitleInstitucion.push("")

                //ASESOR
                let TitleAsesor = []
                TitleAsesor.push("TEMPORADA:")
                TitleAsesor.push(me.proforma.temporada)
                TitleAsesor.push("ELABORADO POR:")
                TitleAsesor.push(me.proforma.user)
                TitleAsesor.push("")
                TitleAsesor.push("")
                //TEMPORADA - CONVENIO
                let TitleTemporada = []
                TitleTemporada.push("CLIENTE:")
                TitleTemporada.push(me.proforma.cliente)
                TitleTemporada.push("")
                TitleTemporada.push("")
                TitleTemporada.push("")
                TitleTemporada.push("")
                //FECHA REPORTE
                let TitleFecha = []
                TitleFecha.push("FECHA:")
                TitleFecha.push(me.proforma.fecha)
                TitleFecha.push("")
                TitleFecha.push("")
                TitleFecha.push("")
                TitleFecha.push("")
                let TitleEspacio = []
                TitleEspacio.push("")
                TitleEspacio.push("")
                TitleEspacio.push("")
                TitleEspacio.push("")
                TitleEspacio.push("")
                TitleEspacio.push("")
                //CODIGOS
                headerTitle = [
                    'CODIGO',
                    'SERIE',
                    'DETALLE',
                    'CANTIDAD',
                    'VALOR UNIDAD',
                    'VALOR TOTAL',
                ];
                headerVal = [
                    'pro_codigo',
                    'nombre_serie',
                    'nombre',
                    'det_prof_cantidad',
                    'det_prof_valor_u',
                    'subtotal',
                ];
                import('@/vendor/Export2Excel').then(excel => {
                    const data = this.formatJson(headerVal, this.detas)
                    let preData = data[0]
                    //SUBTOTAL
                    let DataVenta = []
                    DataVenta.push("OBSERVACIÓN:")
                    DataVenta.push(me.proforma.observacion)
                    DataVenta.push("")
                    DataVenta.push("")
                    DataVenta.push("SUBTOTAL:")
                    DataVenta.push(me.proforma.subtotal)
                    //DESCUENTO
                    let DataHijos = []
                    DataHijos.push("")
                    DataHijos.push("")
                    DataHijos.push("")
                    DataHijos.push("")
                    DataHijos.push("DESCUENTO:")
                    DataHijos.push(me.proforma.descuento)
                    //RESTA
                    let DataTotalVenta = []
                    DataTotalVenta.push("")
                    DataTotalVenta.push("")
                    DataTotalVenta.push("")
                    DataTotalVenta.push("")
                    DataTotalVenta.push("SUBTOTAL-DESCUENTO:")
                    DataTotalVenta.push(me.proforma.subtotal - me.proforma.descuento)
                    //IVA
                    let DataComision = []
                    DataComision.push("")
                    DataComision.push("")
                    DataComision.push("")
                    DataComision.push("")
                    DataComision.push("IVA:")
                    DataComision.push(me.proforma.iva)
                    //TRANSPORTE
                    let DataAnticipo = []
                    DataAnticipo.push("")
                    DataAnticipo.push("")
                    DataAnticipo.push("")
                    DataAnticipo.push("")
                    DataAnticipo.push("TRANSPORTE:")
                    DataAnticipo.push(me.proforma.transporte)
                    //TOTAL
                    let DataDeuda = []
                    DataDeuda.push("")
                    DataDeuda.push("")
                    DataDeuda.push("")
                    DataDeuda.push("")
                    DataDeuda.push("TOTAL:")
                    DataDeuda.push(me.proforma.total)
                    /**ENVIAR A ARRAY**/
                    var sendEnviar = []
                    sendEnviar.push(DataVenta)
                    sendEnviar.push(DataHijos)
                    sendEnviar.push(DataTotalVenta)
                    sendEnviar.push(DataComision)
                    sendEnviar.push(DataAnticipo)
                    sendEnviar.push(DataDeuda)

                    var data2 = [...sendEnviar]
                    excel.export_json_to_excel({
                        multiHeader: [TitleInstitucion, TitleAsesor,TitleTemporada, TitleFecha, TitleEspacio],
                        header: headerTitle,
                        data,
                        data2,
                        filename: this.nombrearchivo,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                    this.clearFields()
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    return v[j]
                }))
            },
            //limpiar campos para exportar de nuevo
            clearFields() {
                this.fileName = 'revision'
                this.cellAutoWidth = true
                this.selectedFormat = 'xlsx'
            },
            getExcelx(tr) {
                let me = this;
                me.proforma.id = tr.prof_id;
                if (this.setMenu == 0) {
                    me.proforma.cliente = me.sendPedido.nombreInstitucion;
                    me.proforma.temporada = me.sendPedido.periodo;
                }
                if (this.setMenu == 1) {
                    me.proforma.cliente = tr.cliente;
                    me.proforma.temporada = this.nombre_periodo;
                }
                this.$http.get(this.$server_url + 'GetProuser?pro_id=' + tr.prof_id)
                    .then(res => {
                        me.proforma.user = res.data;
                    })
                    .catch(err => {
                        me.$vs.loading.close();
                    });
                // me.proforma.user = tr.nombres + " " + tr.apellidos;
                me.proforma.fecha = tr.created_at;
                me.proforma.iva = parseFloat(tr.prof_iva);
                me.proforma.descuento = parseFloat(tr.prof_descuento);
                me.proforma.total = parseFloat(tr.prof_total);
                me.proforma.transporte = parseFloat(0);
                me.proforma.observacion = tr.prof_observacion;
                me.proforma.subtotal = parseFloat(tr.prof_total) - parseFloat(tr.prof_iva) + parseFloat(tr.prof_descuento);
                //me.proforma.subtotal= (parseFloat(tr.prof_total)-parseFloat(tr.prof_iva)+parseFloat(tr.prof_descuento)).toFixed(2);
                this.$http.get(this.$server_url + 'Get_DatosFactura?prof_id=' + tr.id)
                    .then(res => {
                        me.detas = res.data;
                        if (me.detas.length > 0) {
                            for (let i = 0; i < me.detas.length; i++) {
                                me.detas[i].subtotal = me.detas[i].det_prof_cantidad * me.detas[i].det_prof_valor_u;
                            }
                            //me.proforma.subtotal = me.detas.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0);
                            console.log(me.proforma.subtotal);
                            if (me.proforma.subtotal > 0) {
                                me.exportToExcel();
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        me.$vs.loading.close();
                    })
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
            async popup_p(tr) {
                this.edit = [];
                this.popupActivoDesactivar = true;
                this.proforma.id = tr.id;
                this.proforma.codigo = tr.prof_id;
                this.proforma.estado = tr.prof_estado;
                await this.datos(tr.id);
            },
            async popup_ap(tr) {
                this.edit = [];
                this.popupaprobar = true;
                this.proforma.id = tr.id;
                this.proforma.codigo = tr.prof_id;
                this.proforma.estado = tr.prof_estado;
                await this.datos(tr.id);
            },
            anular() {
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let idusuario = usuarioObjeto.idusuario;
                let formData = new FormData();
                let me = this;
                let valornuevo = this.proforma.estado;
                if (valornuevo !== 0 && me.edit.length > 0) {
                    valornuevo = 0;
                    formData.append("dat", JSON.stringify(me.edit));
                    formData.append("id", this.proforma.id);
                    formData.append("prof_estado", valornuevo);
                    formData.append("id_usua", idusuario);
                    formData.append("tipo", 'anular');
                    me.$vs.loading();
                    this.$http.post(this.$server_url + "Desactivar_Proforma", formData)
                        .then((res) => {
                            me.$vs.loading.close();
                            this.getproforma();
                            if (res.status === 200) {
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
                            this.popupActivoEditar = false;
                        })
                        .catch((error) => {
                            console.log(error);
                            me.$vs.loading.close();
                        });
                }

            },
            getaprobar() {
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let idusuario = usuarioObjeto.idusuario;
                let me = this;
                let formData = new FormData();
                let valornuevo = this.proforma.estado;
                if (valornuevo !== 3) {
                    valornuevo = 3;
                    formData.append("id", this.proforma.id);
                    formData.append("prof_estado", valornuevo);
                    formData.append("id_usua", idusuario);
                    me.$vs.loading();
                    this.$http
                        .post(this.$server_url + "Desactivar_Proforma", formData)
                        .then((res) => {
                            me.$vs.loading.close();
                            this.getproforma();
                            if (res.status === 200) {
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

                        })
                        .catch((error) => {
                            console.log(error);
                            me.$vs.loading.close();
                        });
                }
            },
            remove(index) {
                let me = this;
                let preId = 0;
                preId = this.inputs[index].id;
                if (preId > 0) {
                    let formData = new FormData();
                    formData.append("id", preId);

                    this.inputs.splice(index, 1);
                } else {
                    this.inputs.splice(index, 1);
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
            async comprobar() {
                this.inputs = [];
                this.ventas = [];
                await this.venta(this.setMenu);
                if (this.setMenu == 0) {
                    await this.getinfopedido();
                    let n = this.sendPedido.descuento / 100;
                    this.proforma.des = {
                        id: n,
                        value: this.sendPedido.descuento + '%'
                    };
                    this.proforma.dec = this.sendPedido.descuento;
                    this.proforma.empresa = "";
                    this.proforma.iva = "";
                    this.proforma.tipo = this.sendPedido.tipo_venta;
                    this.proforma.observacion = "";
                    this.proforma.activa = "";
                    this.proforma.temporada = this.sendPedido.periodo;
                }
                if (this.setMenu == 1) {
                    await this.getinfopedidoDespacho();
                    let n = 0 / 100;
                    this.proforma.des = {
                        id: n,
                        value: '0%'
                    };
                    this.proforma.dec = 0;
                    this.proforma.empresa = "";
                    this.proforma.iva = "";
                    this.proforma.tipo = '';
                    this.proforma.observacion = "";
                    this.proforma.activa = "";
                    this.proforma.temporada = '';
                }
                if (this.inputs.length !== 0 && this.ventas.length !== 0) {
                    let inputsToRemove = []; // Almacena los índices de los elementos a eliminar de this.inputs
                    let ventasToRemove = []; // Almacena los índices de los elementos a eliminar de this.ventas

                    this.inputs.forEach((input, i) => {
                        input.despacho = 0;
                        let shouldRemoveInput = false; // Variable para verificar si se debe eliminar el input

                        this.ventas.forEach((venta, j) => {
                            if (input.codigo_liquidacion === venta.pro_codigo) {
                                if (input.valor > venta.cantidad) {
                                    input.despacho = venta.cantidad;
                                } else {
                                    shouldRemoveInput = true; // No se debe eliminar el input
                                    ventasToRemove.push(j); // Agrega el índice de la venta a eliminar
                                }
                            }
                        });

                        if (shouldRemoveInput) {
                            inputsToRemove.push(i); // Agrega el índice del input a eliminar
                        }
                    });

                    // Elimina los elementos de los arrays this.inputs y this.ventas
                    inputsToRemove.reverse().forEach(index => {
                        this.inputs.splice(index, 1);
                    });

                    ventasToRemove.reverse().forEach(index => {
                        this.ventas.splice(index, 1);
                    });
                }
                // Si this.ventas está vacío pero this.inputs tiene elementos
                if ((this.inputs.length !== 0 && this.inputs.length !== undefined) && this.ventas.length === 0) {
                    // Itera sobre los elementos de this.inputs
                    this.inputs.forEach(input => {
                        // Establece despacho en 0
                        input.despacho = 0;
                    });
                }

            },
            async getnuevo() {
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let iniusuario = usuarioObjeto.iniciales;
                if (iniusuario == null || iniusuario == undefined || iniusuario == "") {
                    alert('Las iniciales del Usuario facturador son nulas y es necesario que no lo sean. Le pedimos que se ponga en contacto con nuestro equipo de soporte para recibir asistencia. ¡Gracias!');

                } else {
                    this.$vs.loading();
                    await this.comprobar();
                    if (this.inputs.length >= 0) {
                        this.inputs.forEach(p => {
                            p.cantidad = ''
                        });
                        this.stoc = this.inputs;
                        this.popupproforma = true;

                        this.getEmpresas(); // Llamar a la función para obtener las empresas
                        // this.getco(); // Llamar a la función para obtener el código de proforma
                        // await this.getIva();
                        await this.getDescuento();
                        this.$vs.loading.close();
                    } else {
                        this.$vs.loading.close();
                        this.notificacionError();
                    }
                }

            },
            notificacionError() {
                let me = this
                me.$vs.notify({
                    text: 'No se pueden generar nuevas proformas, ya que todas las cantidades de los ítems del pedido han sido facturadas.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })

            },
            async getinfopedido() {
                let me = this;
                await this.$http.get(this.$server_url + 'get_val_pedidoInfoTodoSuma/' + this.sendPedido.id_pedido)
                    .then(res => {
                        this.inputs = res.data;
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            async datos(a) {

                await this.$http.get(this.$server_url + 'Get_DatosFactura?prof_id=' + a)
                    .then(res => {
                        this.edit = res.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            data(a) {
                this.$http.get(this.$server_url + 'Get_DatosFactura?prof_id=' + a)
                    .then(res => {
                        this.editan = res.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            async geteditar(tr) {
              try{
                //vamos a enviar al vuesax a objectPuntos
                let valoresSend = {
                  codigo_contrato:tr.codigo_contrato,
                  id_periodo: tr.id_periodo,
                  ca_codigo_agrupado: tr.idPuntoventa,
                  ca_tipo_pedido:tr.ca_tipo_pedido
                }
                this.$store.dispatch('setpuntos', valoresSend)
                this.setPuntos = valoresSend;
                console.log("prubas",this.setPuntos)
                this.id = tr.idPuntoventa;
                this.inputs = [];
                this.edit = [];
                this.editan = [];
                this.$vs.loading();
                this.getEmpresas();
                // await this.getIva();
                await this.getDescuento();
                let me = this;
                me.accionProforma = 1;
                me.proforma.id = tr.prof_id;
                if (this.setMenu == 0) {
                  await this.getinfopedido();
                }
                if (this.setMenu == 1) {
                  this.getinfopedidoDespacho(tr);
                }
                await this.datos(tr.id);
                this.data(tr.id);
                await this.venta(this.setMenu);
                //ejecutar despues de 2 segundos
                setTimeout(() => {
                  console.log("uno", this.inputs)
                  console.log("dos", this.edit)
                  if (me.inputs.length != 0 && me.edit.length != 0) {
                    for (let i = 0; i < me.edit.length; i++) {
                      // Recorrer el segundo array
                      for (let j = 0; j < me.inputs.length; j++) {
                        if (me.edit[i].pro_codigo == me.inputs[j].codigo_liquidacion) {
                          me.edit[i].valor = me.inputs[j].valor;
                          me.edit[i].stock = me.inputs[j].stock;
                        }
                      }
                    }
                    if (me.edit.length != 0 && me.ventas.length != 0) {
                      for (let i = 0; i < me.edit.length; i++) {
                        for (let j = 0; j < me.ventas.length; j++) {
                          if (me.edit[i].pro_codigo == me.ventas[j].pro_codigo) {
                            if (me.edit[i].valor > me.ventas[j].cantidad) {
                              me.edit[i].despacho = me.ventas[j].cantidad;
                            }
                          }
                        }
                      }
                    }
                    if (this.edit.length != 0 && this.ventas.length == 0) {
                      for (let i = 0; i < this.edit.length; i++) {
                        this.edit[i].despacho = 0;
                      }
                    }
                    console.log("edit", this.edit)
                    me.$vs.loading.close();
                    me.popupproformaedit = true;
                  }
                }, 2000);

              }
              catch(err){
                console.log(err)
              }

            },
            verificar() {
                let me = this;
                if (me.factura.tipo.tdo_id == 1) {
                    me.inpu.forEach(po => {
                        po.stock = po.facturas;
                    });
                } else {
                    me.inpu.forEach(el => {
                        el.stock = el.bodega;
                    });
                }
            },
            async getfact(tr) {
                this.fact = tr;
                this.popupfactura = true;
                this.proforma.id = tr.id;
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

                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            async getPreguntaEliminar(tr) {
                this.popupActivoEliminar = true;
                this.proforma.id = tr.id;
                await this.datos(tr.id);
            },
            getEliminar() {
                let me = this;
                let formData = new FormData();
                formData.append("dat", JSON.stringify(me.edit));
                formData.append("id", this.proforma.id);
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Eliminar_Proforma", formData)
                    .then((res) => {
                        me.$vs.loading.close();
                        me.getproforma()
                        if (res.status === 200) {
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
                    })
                    .catch(function () {
                        me.$vs.loading.close();
                    });
            },
        },
    }
    </script>


    <style>
    .captcha {
        font-size: 9px !important;
    }

    .label_inputs {
        font-size: 12px;
        color: black;
        margin-top: 2px;
        padding-left: 2px;
    }

    .custom-alert {
        background-color: #FDEDEC;
        color: black;
        border: 2px solid #f5c6cb;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    @media print {
        .mi-clase-de-tabla td {
            page-break-before: always;
        }
    }

    .tabla1 {
        table-layout: auto;
        width: 90%;
        border-collapse: collapse;
        margin: 35px;
        margin-bottom: 20px;

    }

    .tabla2 {
        table-layout: auto;
        width: 90%;
        font-size: 11px;
        margin-left: 35px;
        margin-right: 35px;
    }

    .table-cell {
        border: 1px solid black;
        /* Define el borde de 1 píxel y sólido de color negro */
    }

    .row-highlighted {
        background-color: #FADBD8;
        /* Puedes cambiar esto por el color que desees */
    }
    </style>
