<template>
<vx-card fixed-height="true">
    <div v-if="menu == 0">
        <vs-row vs-justify="flex-start">
            <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                <p>Búsqueda por filtros</p>
                <br />
                <vs-card class="seccionmostrartodo">
                    <div>
                        <!-- <div v-if="valorBusqueda == '2'">
                                    <vs-row style="margin: 0px 0px 20px 0px">
                                        <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                            <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                                <font style="font-size: 11.5px">&nbsp;Temporada:</font><br />
                                                <v-select :value="selected" :options="temporada" :reduce="temporada => temporada.codigo_contrato" label="periodoescolar" class="w-full" v-model="codtemporada" placeholder="-Seleccione-" />
                                            </vs-col>
                                        </vs-row>                                    
                                    </vs-row>
                                </div> -->
                        <div v-if="valorBusqueda == '3'">
                            <vs-input class="w-full" @keyup.enter="getOrdenParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar orden de trabajo por código" v-model="busquedaxorden" />
                        </div>
                    </div>
                    <div>
                        <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
                            <li class="modelx"></li>

                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda = 'pendiente'; getOrdenParametro()">Pendientes</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="busqueda = 'finalizado'; getOrdenParametro()">Finalizado</vs-radio>
                            </li>
                            <!-- <li style="margin: 10px 10px 0px 0px">
                                        <vs-radio vs-name="radios3" vs-value="2" v-model="valorBusqueda"
                                            @input="busqueda = 'temporada'" @change="limpiar">Temporada</vs-radio>
                                    </li> -->
                            <li style="margin: 10px 10px 0px 0px">
                                <vs-radio vs-name="radios4" vs-value="3" v-model="valorBusqueda" @input="busqueda = 'orden'" @change="limpiar">Código</vs-radio>
                            </li>
                            <li>
                                <vs-button color="warning" type="filled" style="margin-left: 10px" @click="getOrdenParametro()" icon="search"></vs-button>
                            </li>
                        </ul>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
        <vs-table stripe max-items="20" search pagination :data="Ordentrabajo" no-data-text="No hay datos disponibles">
            <template slot="header">
                <vs-chip color="primary">Cantidad: <b> {{ Ordentrabajo.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Orden de trabajo</vs-th>
                <vs-th>Información orden de trabajo</vs-th>
                <vs-th>Observación</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th> Acciones </vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr v-for="(tr, indextr) in data" :key="indextr">
                    <vs-td width="300">
                        <span><b>Código:</b> {{ tr.or_codigo }}</span><br>
                        <span><b>Fecha Creación:</b> {{ tr.or_fecha }}</span>
                    </vs-td>
                    <vs-td width="320">
                        <span><b>Empresa: </b>{{ tr.nombreEmpresa }}</span><br>
                        <span><b>Proveedor: </b>{{ tr.prov_nombre }}</span><br>
                        <span><b>Usuario Creador: </b>{{ tr.nombres }} {{ tr.apellidos }} ({{ tr.usu_codigo }})</span><br>
                    </vs-td>
                    <vs-td width="400">
                        <div style="max-height: 150px; overflow-y: auto; white-space: pre-line;">
                            {{ tr.or_observacion }}
                        </div>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.or_estado == 1">
                            <vs-chip color="warning" transparent>Pendiente</vs-chip>
                        </div>
                        <div v-if="tr.or_estado == 2">
                            <vs-chip color="success" transparent>Finalizado</vs-chip>
                        </div>
                    </vs-td>
                    <vs-td>
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button color="#FAB818" type="line" class="w-full" @click="arregloComprasOrdenTrabajo=tr; verDetalles(tr);">
                                        Ver detalles
                                    </vs-button>
                                    <vs-button color="#8F4897" type="line" class="w-full" @click="arregloComprasOrdenTrabajo=tr;getVisualiza(tr);">
                                        Ver Compras
                                    </vs-button>
                                    <vs-button v-if="tr.or_estado == 1" color="#046AE7" type="line" class="w-full" @click="arregloComprasOrdenTrabajo=tr;NuevaCompra(tr);">
                                        Nueva compra
                                    </vs-button>
                                    <vs-button v-if="tr.or_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo = true;popup_desactivar_activar_orden(tr);">
                                        Finalizar orden
                                    </vs-button>
                                    <vs-button v-if="tr.or_estado == 2" color="#FAB818" type="line" class="w-full" @click="popupActivo = true;popup_desactivar_activar_orden(tr);">
                                        Pasar a pendiente orden
                                    </vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- Parte de finalizar Orden de trabajo-->
        <vs-popup class="desactivar" :title="tabOrdenCompraTrabajo.estado === 2 ? `Poner pendiente la orden de trabajo: ${tabOrdenCompraTrabajo.codigo}` : `Finalizar la orden de trabajo: ${tabOrdenCompraTrabajo.codigo}`" :active.sync="popupActivoDesactivar">
            <vs-row vs-type="flex" vs-justify="center">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                    <vs-button @click="desactivar_activar_orden()" type="relief">Aceptar</vs-button>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                    <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
    </div>
    <div v-if="menu != 0">
        <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
    </div>
    <div v-if="menu == 1">
        <allComprasOrdenTrabajo :arregloComprasOrdenTrabajo="arregloComprasOrdenTrabajo" />
    </div>
    <div v-if="menu == 2">
        <detalleComprasOrdenTrabajo :arregloComprasOrdenTrabajo="arregloComprasOrdenTrabajo" />
    </div>
    <div v-if="menu == 3">
        <addComprasOrdenTrabajo :arregloComprasOrdenTrabajo="arregloComprasOrdenTrabajo" @guardadoExitoso="retornarACompraOrdenTrabajo" />
    </div>
</vx-card>
</template>

    
<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
const allComprasOrdenTrabajo = () => import('./components/allComprasOrdenTrabajo.vue')
const detalleComprasOrdenTrabajo = () => import('./components/detalleComprasOrdenTrabajo.vue')
const addComprasOrdenTrabajo = () => import('./components/addComprasOrdenTrabajo.vue')
export default {
    components: {
        "v-select": vSelect,
        allComprasOrdenTrabajo,
        detalleComprasOrdenTrabajo,
        addComprasOrdenTrabajo,
    },
    data() {
        return {
            menu: 0,
            arregloComprasOrdenTrabajo: {},
            com_codigo: "",
            Ordentrabajo: [],
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            changeValues: false,
            tabOrdenCompraTrabajo: {
                codigo: "",
                fecha: "",
                prov_codigo: "",
                observacion: "",
                factura: "",
                valor: "",
                iva: "",
                descuento: "",
                observacion: "",
                estado: "",
            },
            datosOrden: [],
            valorBusqueda: 0,
            //filtro temporada
            selected: null,
            temporada: [],
            codtemporada: "",
            busquedaxorden: "",

        };
    },
    computed: {},
    mounted() {
        this.valorBusqueda = 0;
        this.busqueda = 'pendiente';
        this.getPeriodos();
        this.getOrdenParametro();
    },
    methods: {
        getPeriodos() {
            this.$http.get(this.$server_url + 'get_periodos_pedidos')
                .then(res => {
                    let datos = res.data;
                    if (datos.length === 0) {
                        this.temporada = [];
                        return;
                    }

                    let years = [2019, 2018, 2017, 2016];
                    let regions = ['Costa', 'Sierra'];

                    years.forEach(year => {
                        regions.forEach(region => {
                            let datosAdd = {
                                periodoescolar: region + ' ' + year,
                                codigo_contrato: region[0] + year.toString().slice(-2)
                            };
                            datos.push(datosAdd);
                        });
                    });

                    this.temporada = datos.filter(item => !/prueba|test|demo/i.test(item.periodoescolar) && item.codigo_contrato !== null);
                })
                .catch(error => {
                    this.$vs.loading.close();
                });
        },
        retornarACompraOrdenTrabajo() {
            this.menu = 0;
            this.getOrdenParametro();
        },
        filterKey(e) {
            const key = e.key;
            if (key === "," || key === "-" || key === "e" || key === "+")
                return e.preventDefault();
        },
        getOrdenParametro() {
            let url;
            if (this.busqueda === "temporada") {
                if (this.codtemporada) {
                    url = `${this.$server_url}GetOrden_xfiltro?busqueda=${this.busqueda}&razonbusqueda=${this.codtemporada}`;
                } else {
                    this.$vs.notify({
                        text: "Falta la selección temporada para esta búsqueda",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                    return;
                }
            } else if (this.busqueda === "orden") {
                if (this.busquedaxorden) {
                    url = `${this.$server_url}GetOrden_xfiltro?busqueda=${this.busqueda}&razonbusqueda=${this.busquedaxorden}`;
                } else {
                    this.$vs.notify({
                        text: "Falta Orden de trabajo para esta búsqueda",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                    return;
                }

            } else {
                url = `${this.$server_url}GetOrden_xfiltro?busqueda=${this.busqueda}`;
            }

            this.$vs.loading();
            this.$http.get(url)
                .then(res => {
                    this.Ordentrabajo = res.data;
                    if (this.Ordentrabajo.length === 0) {
                        this.$vs.notify({
                            text: "No hay órden de trabajo para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        this.Ordentrabajo = [];
                    } else if (res.data.message) {
                        this.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-user",
                        });
                    }
                    this.$vs.loading.close();
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        this.$vs.notify({
                            text: "No hay órden de trabajo para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        this.Ordentrabajo = [];
                    } else {
                        console.log(error + " error");
                    }
                    this.$vs.loading.close();
                });
        },
        getVisualiza(tr) {
            let me = this;
            this.menu = 1;
        },

        NuevaCompra(tr) {
            let me = this;
            this.menu = 3;
        },
        verDetalles(tr) {
            let me = this;
            this.menu = 2;
        },
        editar() {
            let me = this;
            if (!me.tabCompraOrden.factura || !me.tabCompraOrden.valor || !me.tabCompraOrden.observacion) {
                me.$vs.notify({
                    text: "Escriba los datos antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (me.datosOrden.length == 0) {
                me.$vs.notify({
                    text: "Agregue los detalles antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            let datos = {
                com_codigo: me.id,
                com_factura: me.tabCompraOrden.factura,
                com_valor: me.tabCompraOrden.valor,
                com_iva: me.tabCompraOrden.iva,
                com_descuento: me.tabCompraOrden.descuento,
                com_observacion: me.tabCompraOrden.observacion,

            };
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "PostCompraOrden_Registrar_modificar", datos)
                .then((res) => {
                    me.edit();
                    me.$vs.loading.close();
                    this.popupedit = false;
                    me.Ordentrabajo = [];
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Compra Orden de trabajo no se pudo EDITAR",
                        color: "danger",
                        k: "feather",
                        icon: "icon-x",
                    });
                });
        },
        popup_desactivar_activar_orden(tr) {
            this.popupActivoDesactivar = true;
            this.tabOrdenCompraTrabajo.codigo = tr.or_codigo;
            this.tabOrdenCompraTrabajo.estado = tr.or_estado;
        },
        desactivar_activar_orden() {
            let me = this;
            let valornuevo = me.tabOrdenCompraTrabajo.estado;
            if (valornuevo == 1) {
                valornuevo = 2;
                let datos = {
                    or_codigo: me.tabOrdenCompraTrabajo.codigo,
                    or_estado: valornuevo,
                };
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Desactivar_Orden", datos)
                    .then((res) => {
                        me.$vs.loading.close();
                        me.Ordentrabajo = [];
                        me.$vs.notify({
                            text: "Orden Finalizada",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.getCancelar();
                    })
                    .catch((error) => {
                        console.log(error);
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo finalizar la orden",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            } else if (valornuevo == 2) {
                valornuevo = 1;
                let datos = {
                    or_codigo: me.tabOrdenCompraTrabajo.codigo,
                    or_estado: valornuevo,
                };
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Desactivar_Orden", datos)
                    .then((res) => {
                        me.$vs.loading.close();
                        me.Ordentrabajo = [];
                        me.$vs.notify({
                            text: "Orden Pendiente",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.getCancelar();
                    })
                    .catch((error) => {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo poner en pendiente la orden",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            }
        },
        getCancelar() {
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
        },
        limpiar() {
            this.codtemporada = "";
            this.busquedaxorden = "";
        }
    },
};
</script>
