<template>
<div fixed-height="true">
    <br>
    <vs-row vs-justify="flex-start">
        <vs-button type="border" color="success" class="mr-2" @click="verificarIniciales()">Nuevo Movimiento No Operativo</vs-button>
        <vs-col type="flex" v-if="conteoregistros>registrosmaximos" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <p>Búsqueda por filtros</p>
            <br />
            <vs-card class="seccionmostrartodo">
                <div>
                    <br>
                    <div class="vx-row mb-1">
                        <div style="display: inline-block; margin: 0px 3px 0px 3px;">
                            <!-- currency -->
                            <vx-input-group class="mb-base" style="display:flex;flex-wrap: wrap;">
                                <template slot="prepend" v-if="tipo != 1">
                                    <div class="prepend-text bg-primary" style="height: 38px;">
                                        <span>Búsqueda</span>
                                    </div>
                                </template>
                                <!-- Mostrar el input cuando se selecciona el radio button con valor 0 -->
                                <vs-input v-if="tipo == 0" class="w-full" @keyup.enter="getMovimientoProductoParametro()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px;" icon="search" placeholder="Buscar" v-model="parametrobusqueda" />
                                <!-- <v-select v-else-if="tipo == 1" :options="arregloMovimientoxPeriodo" :reduce="arregloMovimientoxPeriodo => arregloMovimientoxPeriodo.idperiodoescolar" label="periodoescolar" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getMovimientoProductoParametro()" /> -->
                                <v-select v-else-if="tipo == 2" :options="options1" :reduce="options1 => options1.value" label="text" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getMovimientoProductoParametro()" />
                            </vx-input-group>
                            <!-- /currency -->
                        </div>
                        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                            <vs-button v-if="tipo == 0" color="primary" style="height: 38px;" @click="getMovimientoProductoParametro()" type="filled">Buscar</vs-button>
                        </div>
                        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                            <ul class="flex mt-2">
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="0" @input="busqueda = 'codigomovimiento'; limpiar()">Código</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="2" @input="busqueda = 'TipoMovimiento'; limpiar()">Tipo Movimiento</vs-radio>
                                </li>
                                <!-- <li>
                                        <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="1" @input="limpiar(); getMovimientoProductoConteo()">Todo</vs-radio>
                                    </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <vs-table max-items="10" pagination search :data="MovimientoProducto" no-data-text="No hay datos disponibles">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ MovimientoProducto.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th width="200"> Código </vs-th>
            <vs-th width="400"> Información Movimiento</vs-th>
            <!-- <vs-th width="300"> Información Productos</vs-th> -->
            <vs-th width="150"> Estado </vs-th>
            <!-- <vs-th width="400">Guía</vs-th> -->
            <vs-th width="200"> Acciones </vs-th>
        </template>
        <template slot-scope="{ data }">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].fmp_id">
                    {{ data[indextr].fmp_id }}
                </vs-td>
                <vs-td>
                    <small><b>Periodo escolar:</b> {{tr.periodoescolar}}</small>
                    <br>
                    <small><b>Usuario Creador:</b> {{tr.nombreusuario}}</small>
                    <br>
                    <small><b>Fecha Creación:</b> {{tr.dcreatedmov}}</small>
                    <br>
                    <small><b>Fecha Modificación:</b> {{tr.dupdatedmov}}</small>
                </vs-td>
                <!-- <vs-td>
                    <div v-if="tr.fmp_estado != 4">
                        <small><b>Cantidad Total:</b> {{tr.fmp_cantidad_total}}</small>
                        <br>
                    </div>
                    <small><b>Items:</b> {{tr.fmp_items}}</small>
                </vs-td> -->
                <vs-td>
                    <vs-chip v-if="tr.fmp_estado == 0" color="primary">Ingreso Activo</vs-chip>
                    <vs-chip v-else-if="tr.fmp_estado == 1" color="success">Ingreso Finalizado</vs-chip>
                    <vs-chip v-else-if="tr.fmp_estado == 2" color="primary">Egreso Activo</vs-chip>
                    <vs-chip v-else-if="tr.fmp_estado == 3" color="success">Egreso Finalizado</vs-chip>
                    <vs-chip v-else-if="tr.fmp_estado == 4" color="success">Generado por edición de Combos</vs-chip>
                    <vs-chip v-else color="danger">Estado no definido</vs-chip>
                    <br />
                </vs-td>
                <!-- <vs-td> {{ tr.trans_guia_remision }} <br /> </vs-td> -->
                <vs-td :data="data[indextr].fmp_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px" class="cursor">
                            <vs-dropdown-item>
                                <vs-button v-if="tr.fmp_estado == 0 || tr.fmp_estado == 2" color="#28C76F" type="line" class="w-full" @click="idmovimiento = tr;getEditar(tr);">Editar</vs-button>
                                <vs-button v-if="tr.fmp_estado == 1 || tr.fmp_estado == 3 || tr.fmp_estado == 4" color="#28C76F" type="line" class="w-full" @click="idmovimiento = tr;getEditarObservacion(tr);">Editar Observación</vs-button>
                                <vs-button v-if="tr.fmp_estado == 1" color="dark" type="line" icon-pack="feather" icon="icon-eye" class="w-full" @click="idmovimiento=tr;verificacionIngresoEgreso=1;popupDocumentoIngresoNO = true">PDF Ingreso</vs-button>
                                <vs-button v-if="tr.fmp_estado == 3" color="dark" type="line" icon-pack="feather" icon="icon-eye" class="w-full" @click="idmovimiento=tr;verificacionIngresoEgreso=2;popupDocumentoIngresoNO = true">PDF Egreso</vs-button>
                                <vs-button v-if="tr.fmp_estado == 4" color="dark" type="line" icon-pack="feather" icon="icon-eye" class="w-full" @click="idmovimiento=tr;verificacionIngresoEgreso=3;popupDocumentoComboNO = true">PDF Combos</vs-button>
                                <!-- <vs-button v-if="tr.fmp_estado == 1" color="#28C76F" type="line" class="w-full" @click="idmovimiento = tr; getGenerarEgreso(tr);">Generar Egreso</vs-button> -->
                                <vs-button v-if="tr.fmp_estado == 0 || tr.fmp_estado == 2" color="#EA5455" type="line" class="w-full" @click="getPreguntaEliminarMovimientoNO(tr); idmovimiento = tr;">Eliminar</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="informacionformhijo" @close="getMovimientoProductoParametro();" fullscreen :title="`Movimiento No Operativo: ${this.CompletoIngreso}`" :active.sync="popupNewIngresoNO">
        <NuevoIngresoNO v-if="popupNewIngresoNO" :btn_propiedades="btn_propiedades" :CompletoIngreso="CompletoIngreso" :SecuencialIngreso="SecuencialIngreso" @change="changeHandleNuevoMovimiento" @f_guardar="f_guardar" @actualizarBtnPropiedades="actualizarBtn" />
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup class="informacionformhijo" @close="getMovimientoProductoParametro();" fullscreen :title="idmovimiento.fmp_estado === 0 ? `Editar Ingreso No Operativo: ${this.CompletoIngreso}` : `Editar Egreso No Operativo: ${this.CompletoIngreso}`" :active.sync="popupNewEditarNO">
        <NuevoIngresoNO v-if="popupNewEditarNO" :btn_propiedades="btn_propiedades" :CompletoIngreso="CompletoIngreso" :idmovimiento="idmovimiento" @change="changeHandleEditarMovimiento" @f_guardar="f_guardar" />
    </vs-popup>
    <!-- SECCION EDITAR OBSERVACIÓN -->
    <vs-popup class="holamundo2" @close="getMovimientoProductoParametro();" :title="`Editar Observación del Movimiento: ${this.CompletoIngreso}`" :active.sync="popupNewEditarObservacionNO">
        <ObservacionMovimientoNO v-if="popupNewEditarObservacionNO" :btn_propiedades="btn_propiedades" :CompletoIngreso="CompletoIngreso" :idmovimiento="idmovimiento" @change="changeHandleEditarObservacionMovimiento" />
    </vs-popup>
    <!-- SECCION INGRESO GENERAR PDF INGRESO Y EGRESO -->
    <vs-popup fullscreen class="holamundo2" @close="getMovimientoProductoParametro();" :title="`Documento No Operativo Generado: ${idmovimiento.fmp_id}`" :active.sync="popupDocumentoIngresoNO">
        <DocumentoIngresoNO v-if="popupDocumentoIngresoNO" :CompletoIngreso="CompletoIngreso" :idmovimiento="idmovimiento" :verificacionIngresoEgreso="verificacionIngresoEgreso" @change="changeHandleGenerarDocumentoIngreso" />
    </vs-popup>
    <!-- SECCION INGRESO GENERAR PDF COMBOS -->
    <vs-popup fullscreen class="holamundo2" @close="getMovimientoProductoParametro();" :title="`Generar Documento Combos: ${idmovimiento.fmp_id}`" :active.sync="popupDocumentoComboNO">
        <DocumentoComboNO v-if="popupDocumentoComboNO" :CompletoIngreso="CompletoIngreso" :idmovimiento="idmovimiento" :verificacionIngresoEgreso="verificacionIngresoEgreso" @change="changeHandleGenerarDocumentoCombos" />
    </vs-popup>
    <!-- SECCION INGRESO GENERAR PDF -->
    <vs-popup class="holamundo2" @close="getMovimientoProductoParametro();" fullscreen :title="`Generar Egreso No Operativo: ${this.CompletoIngreso2}`" :active.sync="popupNewGenerarEgresoNO">
        <GenerarEgresoNO v-if="popupNewGenerarEgresoNO" :CompletoIngreso2="CompletoIngreso2" :SecuenciaEgreso="SecuenciaEgreso" :idmovimiento="idmovimiento" @change="changeHandleEgresoNO" />
    </vs-popup>
    <!-- SECCION ELIMINAR MOVIMIENTO -->
    <vs-popup class="holamundo2" @close="getMovimientoProductoParametro();" :title="`Eliminar Movimiento: ${this.idmovimiento.fmp_id}`" :active.sync="popupActivoEliminarMovimientoNO">
        <eliminarMovimientoNO v-if="popupActivoEliminarMovimientoNO" :CompletoIngreso="CompletoIngreso" :SecuencialIngreso="SecuencialIngreso" :idmovimiento="idmovimiento" @change="changeHandleEliminarNO" />
    </vs-popup>
</div>
</template>

    
<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
const NuevoIngresoNO = () => import('./movimiento_NO_producto_Ingreso')
const GenerarEgresoNO = () => import('./movimiento_NO_producto_Egreso')
const DocumentoIngresoNO = () => import('./Reportes/movimiento_NO_producto_IngresoGeneracionDocumento')
const DocumentoComboNO = () => import('./Reportes/movimiento_NO_producto_ComboGeneracionDocumento.vue')
const eliminarMovimientoNO = () => import('./movimiento_NO_producto_Eliminar.vue')
const ObservacionMovimientoNO = () => import('./movimiento_NO_producto_Observacion.vue')
export default {
    data() {
        return {
            options1: [{
                    text: '--Seleccione--',
                    value: null
                },
                {
                    text: 'Ingresos',
                    value: 0
                },
                {
                    text: 'Egresos',
                    value: 1
                },
                {
                    text: 'Combos',
                    value: 2
                },
            ],
            arregloLibros: [],
            MovimientoProducto: [],
            datosSeleccionadoLibros: [],
            infoPedido: {
                libro: '',
            },
            tipo: '0',
            busquedaxperiodo: "",
            busquedaxestadomovimiento: "",
            arregloMovimientoxPeriodo: [],
            SecuencialIngreso: "",
            SecuenciaEgreso: "",
            LetraIngreso: "",
            NombreIngreso: "",
            CompletoIngreso: "",
            CompletoIngreso2: "",
            PeriodoUser: "",
            popupNewIngresoNO: false,
            popupNewEditarNO: false,
            popupNewEditarObservacionNO: false,
            popupNewGenerarEgresoNO: false,
            popupDocumentoIngresoNO: false,
            popupDocumentoComboNO: false,
            popupActivoEliminarMovimientoNO: false,
            tabMovimientoProducto: {
                trans_nombre: "",
                trans_ruc: "",
                trans_direccion: "",
                trans_guia_remision: "",
            },
            parametrobusqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 0,
            idmovimiento: [],
            verificacionIngresoEgreso: 0,
            tipo_accion: 0, // 0 guardar, 1 editar
            prov_codigo: 0, //codigo proveedor
            btn_propiedades: {}, // propiedades del boton guardar o editar

        };
    },
    components: {
        "v-select": vSelect,
        NuevoIngresoNO,
        DocumentoIngresoNO,
        GenerarEgresoNO,
        eliminarMovimientoNO,
        DocumentoComboNO,
        ObservacionMovimientoNO,
    },
    mounted() {
        this.getMovimientoProductoConteo();
    },
    methods: {
        limpiar() {
            this.parametrobusqueda = '';
            this.MovimientoProducto = [];
        },
        getSecuencialIngresoxID_Parametro(datos) {
            let me = this;
            //ID DE INGRESO NO OPERATIVO
            let id_ingreso = datos.id_documento;
            me.$vs.loading();
            let msj_1 = "No hay ID Tipo Documento para esta búsqueda"
            this.$http.get(this.$server_url + "GetTipoDocumento_secuenciaxid?id_documento=" + id_ingreso)
                .then(function (res) {
                    me.SecuencialIngreso = res.data.tdo_secuencial_calmed;
                    me.LetraIngreso = res.data.tdo_letra;
                    me.NombreIngreso = res.data.tdo_nombre;
                    me.getPeriodoxID_Parametro();
                    if (me.SecuencialIngreso.length === 0) {
                        me.f_notificaciones(msj_1, 'danger')
                        me.SecuencialIngreso = [];
                    } else {
                        if (res.data.message) {
                            let msj = res.data.message
                            me.f_notificaciones(msj, 'success')
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.f_notificaciones(msj_1, 'danger')
                        me.Transportes = [];
                    } else {
                        console.log(error + " error");
                    }
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        getSecuencialEgresoxID_Parametro() {
            let me = this;
            //ID DE INGRESO NO OPERATIVO
            let id_ingreso = 7;
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetTipoDocumento_secuenciaxid?id_documento=" + id_ingreso)
                .then(function (res) {
                    me.SecuenciaEgreso = res.data.tdo_secuencial_calmed;
                    me.LetraIngreso = res.data.tdo_letra;
                    me.NombreIngreso = res.data.tdo_nombre;
                    me.getPeriodoxID_Parametro_Egreso();
                    if (me.SecuenciaEgreso.length === 0) {
                        me.f_notificaciones("No hay ID Tipo Documento para esta búsqueda", 'danger')
                        me.SecuenciaEgreso = [];
                        me.$vs.loading.close();
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.f_notificaciones(res.data.message, 'success')
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.f_notificaciones("No hay ID Tipo Documento para esta búsqueda", 'danger')
                        me.Transportes = [];
                    } else {
                        console.log(error + " error");
                    }
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        getMovimientoxPeriodo() {
            let me = this;
            this.$http.get(this.$server_url + 'periodo2')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    this.arregloMovimientoxPeriodo = res.data;
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getPeriodoxID_Parametro() {
            let me = this;
            //ID DE INGRESO NO OPERATIVO
            const periodolocal = localStorage.getItem("periodo_id");
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            // me.$vs.loading();
            this.$http.get(this.$server_url + "GetPeriodo_xID?idperiodorecibido=" + periodolocal)
                .then(function (res) {
                    me.PeriodoUser = res.data;
                    me.CompletoIngreso = me.LetraIngreso + "-" + me.PeriodoUser[0].codigo_contrato + "-" + usuarioObjeto.iniciales + "-" + me.SecuencialIngreso;
                    me.guardarnuevoIngreso_Producto_NO();
                    if (me.PeriodoUser.length === 0) {
                        me.f_notificaciones("El usuario no tiene periodo", 'danger')
                        me.PeriodoUser = [];
                    } else {
                        // me.filtroRegion();
                        if (res.data.message) {
                            me.f_notificaciones(res.data.message, 'success')
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.f_notificaciones("No hay Periodo para esta búsqueda", 'danger')
                        me.Transportes = [];
                    } else {
                        console.log(error + " error");
                    }
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        getPeriodoxID_Parametro_Egreso() {
            let me = this;
            //ID DE INGRESO NO OPERATIVO
            const periodolocal = localStorage.getItem("periodo_id");
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetPeriodo_xID?idperiodorecibido=" + periodolocal)
                .then(function (res) {
                    me.PeriodoUser = res.data;
                    me.CompletoIngreso2 = me.LetraIngreso + "-" + me.PeriodoUser[0].codigo_contrato + "-" + usuarioObjeto.iniciales + "-" + me.SecuenciaEgreso;
                    me.popupNewGenerarEgresoNO = true;
                    if (me.PeriodoUser.length === 0) {
                        let msj = "El usuario no tiene periodo";
                        me.f_notificaciones(msj, 'danger')
                        me.PeriodoUser = [];
                    } else {
                        me.guardarnuevoIngreso_Producto_NO();
                        if (res.data.message) {
                            me.f_notificaciones(res.data.message, 'success');
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.f_notificaciones("No hay Periodo para esta búsqueda", 'danger');
                        me.Transportes = [];
                    } else {
                        console.log(error + " error");
                    }
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        verificarIniciales() {
            this.CompletoIngreso = "";
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (!usuarioObjeto.iniciales) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: "Alerta",
                    // acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    text: 'Usuario sin iniciales, no puede generar ACTA. Comuniquese con el equipo de soporte.',
                    // accept: this.aceptarLibrosObsequios
                })
                return
            } else {
                this.getNuevo();
            }
        },
        getMovimientoProductoConteo() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Movimientos_NO_ProductoContador?conteo=' + me.registrosmaximos)
                .then(function (res) {
                    me.Verificacionconteo = res.data.mensaje;
                    me.conteoregistros = res.data.conteo;
                    // console.log(me.Verificacionconteo,"conteofianljeyson", me.conteoregistros)
                    me.MovimientoProducto = [];
                    // me.getMovimientoProducto();
                    // if (me.Verificacionconteo == 'data_menor') {
                    //     me.MovimientoProducto = [];
                    //     me.getMovimientoProducto();
                    //     // console.log("entro aqui");
                    // } else if (me.Verificacionconteo == 'data_igual') {
                    //     me.MovimientoProducto = [];
                    //     //Se manda la funcion apra que en los nuevos registros
                    //     me.getMovimientoProducto();
                    //     me.getMovimientoProducto_regduplicados();
                    //     me.getMovimientoxPeriodo();
                    //     me.getMovimientoProductoParametro();
                    //     // me.getMovimientoProductoParametro();
                    //     // console.log("entro ACA");
                    // }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.f_notificaciones('No hay Tipo Empaque para esta búsqueda', 'danger')
                        me.MovimientoProducto = [];
                    } else {
                        console.log(error + ' error');
                    }
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        getMovimientoProducto() {
            let me = this;
            this.$http.get(this.$server_url + 'Get_Movimientos_NO_Producto')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.MovimientoProducto = res.data;
                    this.MovimientoProducto_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getMovimientoProducto_regduplicados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Movimientos_NO_Producto')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.MovimientoProducto_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getMovimientoProductoParametro() {
            let me = this;
            //this.showAgregarNuevo = true;
            // console.log("leee");
            me.MovimientoProducto = [];
            if (me.busqueda == 'codigomovimiento' && me.parametrobusqueda.length < 2) {
                me.f_notificaciones('Minimo 2 caracteres de busqueda', 'danger')
                return false;
            }
            // console.log(me.parametrobusqueda,"anmtes de busqueda");
            if (me.parametrobusqueda === null || me.parametrobusqueda === '' || me.parametrobusqueda === 'undefined') {
                me.f_notificaciones('Realice una búsqueda', 'danger')
                return false;
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.parametrobusqueda)
            this.$http.get(this.$server_url + 'GetMovimientos_NO_Producto_xfiltro?busqueda=' + me.busqueda + '&razonbusqueda=' + me.parametrobusqueda)
                .then(function (res) {
                    // console.log(res.data);
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.MovimientoProducto = res.data;
                    if (me.MovimientoProducto.length === 0) {
                        me.f_notificaciones('No hay Movimientos para esta búsqueda', 'danger')
                        me.MovimientoProducto = [];
                    } else {
                        if (res.data.message) {
                            me.f_notificaciones(res.data.message, 'success')
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.f_notificaciones('No hay Tipo Empaque para esta búsqueda', 'danger')
                        me.MovimientoProducto = [];
                    } else {
                        console.log(error + ' error');
                    }
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        guardarnuevoIngreso_Producto_NO() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            const periodolocal = localStorage.getItem("periodo_id");
            if (this.prov_codigo == 0) {
                let msj = "Seleccione un proveedor"
                me.f_notificaciones(msj, 'danger')
                return;
            }
            let datos = {
                "fmp_id": me.CompletoIngreso,
                "id_periodo": periodolocal,
                "fmp_estado": 0,
                "user_created": usuarioObjeto.idusuario,
                "secuencialconteo": parseInt(me.SecuencialIngreso),
                "prov_codigo": this.prov_codigo,
                "tipo_ingreso": this.tipo_ingreso,
                "observacion": this.observacion,
            }
            me.$vs.loading();
            this.$http.post(this.$server_url + 'Post_Registrar_modificar_movimiento_producto', datos)
                .then(res => {
                    me.CompletoIngreso = res.data.fmp_id;
                    console.log('exitoooooooooooooooooo', res.data, me.CompletoIngreso)
                    let msj = 'Movimiento guardado con exito'
                    me.f_notificaciones(msj, 'success', 'icon-check')
                })
                .catch(function () {
                    let msj = 'Movimiento no se pudo guardar'
                    me.f_notificaciones(msj, 'danger')
                })
                .finally(() => {
                    me.$vs.loading.close();
                });
        },
        getNuevo() {
            this.CompletoIngreso = '';
            this.btn_propiedades = {
                accion_guardar: 1, //1 - guardar, 2 - editar
                btn_txt: 'Guardar',
                btn_color: 'primary',
            }
            this.popupNewIngresoNO = true;
            // this.getSecuencialIngresoxID_Parametro();
        },
        getEditar(tr) {
            this.btn_propiedades = {
                accion_guardar: 2, //1 - guardar, 2 - editar
                btn_txt: 'Editar',
                btn_color: 'warning',
            }
            this.CompletoIngreso = tr.fmp_id;
            this.popupNewEditarNO = true;
        },
        getEditarObservacion(tr) {
            this.CompletoIngreso = tr.fmp_id;
            this.popupNewEditarObservacionNO = true;
        },
        actualizarBtn(nuevasPropiedades) {
            // Actualiza las propiedades del botón en el padre
            this.btn_propiedades = nuevasPropiedades;
        },
        getGenerarEgreso() {
            this.getSecuencialEgresoxID_Parametro();
        },
        getPreguntaEliminarMovimientoNO(tr) {
            console.log(tr, "tr de eliminar");
            this.popupActivoEliminarMovimientoNO = true;
        },
        changeHandleGenerarDocumentoIngreso(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            console.log(e.verificacionemit); // Debería imprimir 1
            if (e.verificacionemit == 1) {
                me.popupDocumentoIngresoNO = false;
            } else if (e.verificacionemit) {
                console.log("Hola");
            }
        },
        changeHandleGenerarDocumentoCombos(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            console.log(e.verificacionemit); // Debería imprimir 1
            if (e.verificacionemit == 1) {
                me.popupDocumentoIngresoNO = false;
            } else if (e.verificacionemit) {
                console.log("Hola");
            }
        },
        changeHandleEgresoNO(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveegreso); // Debería imprimir 1
            if (e.verificacionemitsaveegreso == 1) {
                me.popupNewGenerarEgresoNO = false;
                this.getMovimientoProductoParametro();
            } else if (e.verificacionemitsaveegreso) {
                console.log("Hola");
            }
        },
        changeHandleEditarMovimiento(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                me.popupNewEditarNO = false;
                this.getMovimientoProductoParametro();
            } else if (e.verificacionemitsaveandedit) {
                console.log("Hola");
            }
        },
        changeHandleEditarObservacionMovimiento(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteditObservacion); // Debería imprimir 1
            if (e.verificacionemiteditObservacion == 1) {
                console.log("Emit Recibido por guardar");
                me.popupNewEditarObservacionNO = false;
                this.getMovimientoProductoParametro();
            } else if (e.verificacionemiteditObservacion == 2) {
                console.log("Emit Recibido por cancelar");
                me.popupNewEditarObservacionNO = false;
                this.getMovimientoProductoParametro();
            }
        },
        changeHandleNuevoMovimiento(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                me.popupNewIngresoNO = false;
                this.getMovimientoProductoParametro();
            } else if (e.verificacionemitsaveandedit) {
                console.log("Hola");
            }
        },
        changeHandleEliminarNO(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitdelete); // Debería imprimir 1
            if (e.verificacionemitdelete == 2) {
                // console.log("Viene del cancelar");
                //Viene del cancelar
                me.popupActivoEliminarMovimientoNO = false;
                // this.getMovimientoProductoParametro();
            } else if (e.verificacionemitdelete == 1) {
                //Viene del eliminar
                // console.log("Viene del eliminar");
                me.popupActivoEliminarMovimientoNO = false;
            }
            this.getMovimientoProductoParametro();
        },
        f_guardar(e) {
            // console.log('f_guardar',e)
            this.$vs.loading();
            this.tipo_ingreso = e.tipoIngreso == 0 ? 6 : 7; //6 = ingreso, 7= egreso
            this.prov_codigo = e.idmovimiento.prov_codigo;
            this.observacion = e.idmovimiento.observacion;
            let datos = {
                id_documento: this.tipo_ingreso,
                prov_codigo: e.idmovimiento.prov_codigo,
                observacion: e.idmovimiento.observacion,
            }
            if (this.CompletoIngreso != null & this.CompletoIngreso != "") {
                //si ya existe un movimiento no operativo, se envia a editar
                this.guardarnuevoIngreso_Producto_NO();
                return;
            } else {
                this.getSecuencialIngresoxID_Parametro(datos)
            }

        },
        f_notificaciones(msj, color, icono) {
            color == 'success' ? icono = "icon-check" : icono = "icon-x"
            this.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        }
    },
};
</script>

    
<style scoped>
.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
