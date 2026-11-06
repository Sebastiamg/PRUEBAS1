<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditarPorcentaje(); verificarcrear_actualizar = 'create'">Agregar Nuevo Porcentaje</vs-button>
        <!-- <vs-button color="dark" type="border" icon="info" @click="getInformacionPorcentaje()" style="float: right" title="Información">Información</vs-button> -->
    </div>
    <vs-row>
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
                                <template slot="prepend">
                                    <div class="prepend-text bg-primary" style="height: 38px;">
                                        <span>Búsqueda</span>
                                    </div>
                                </template>
                                <!-- Mostrar el input cuando se selecciona el radio button con valor 0 -->
                                <vs-input v-if="tipo == 0" class="w-full" @keyup.enter="getPorcentajeParametro()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="parametrobusqueda" />
                                <v-select v-else-if="tipo == 1" :options="UsuariosLibrerias" :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" label="datosbusqueda" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getPorcentajeParametro()" />
                                <v-select v-else-if="tipo == 2" :options="ContratoAgrupacion" :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" label="datoscontagrupados" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getPorcentajeParametro()" />
                            </vx-input-group>
                            <!-- /currency -->
                        </div>
                        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                            <ul class="flex mt-2">
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="0" @input="busqueda = 'codigoagrupado'; limpiar()">Código</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="1" @input="busqueda = 'nombreusuario'; limpiar()">Usuario</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="2" @input="busqueda = 'infocontratoagrupado'; limpiar()">Contrato Agrupado</vs-radio>
                                </li>
                            </ul>
                        </div>
                        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                            <vs-button v-if="tipo == 0" color="primary" style="height: 38px;" @click="getPorcentajeParametro()" type="filled">Buscar</vs-button>
                        </div>
                    </div>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditarPorcentaje()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Porcentajes" no-data-text="No hay registros de retenciones">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ Porcentajes.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="100">
                Código
            </vs-th>
            <vs-th width="200">
                Nombre
            </vs-th>
            <vs-th width="200">
                Valor
            </vs-th>
            <vs-th width="350">
                Fechas y Estado
            </vs-th>
            <vs-th width="100">
                Acciones
            </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].arp_id">
                    {{ data[indextr].arp_id }}
                </vs-td>
                <vs-td>
                    {{ tr.arp_nombre }}
                </vs-td>
                <vs-td>
                    {{ tr.arp_valor }}
                </vs-td>
                <vs-td>
                    <small><b>Fecha Creación:</b> {{tr.created_at}}</small>
                    <br>
                    <small><b>Fecha Modificación:</b> {{tr.updated_at}}</small>
                    <br>
                    <vs-chip v-if="tr.arp_estado == 1" color="success">Activo</vs-chip>
                    <vs-chip v-else-if="tr.arp_estado == 0" color="danger">Inactivo</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].arp_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <vs-dropdown-item>
                                <vs-button v-if="tr.arp_estado == 1" color="#28C76F" type="line" class="w-full" @click="getNuevoEditarPorcentaje(tr); verificarcrear_actualizar='update'; tabPorcentaje=tr">Editar</vs-button>
                                <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getPreguntaEliminar(tr);tabPorcentaje=tr">Eliminar</vs-button>
                                <vs-button v-if="tr.arp_estado == 1" color="#EA5455" type="line" class="w-full" @click="popup_desactivar_activar_Porcentaje(tr);">Desactivar Porcentaje</vs-button>
                                <vs-button v-if="tr.arp_estado == 0" color="#28C76F" type="line" class="w-full" @click="popup_desactivar_activar_Porcentaje(tr);">Activar Porcentaje</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="informacionformhijo" @close="getPorcentaje();" :title="verificarcrear_actualizar === 'create' ? 'Registrar nuevo porcentaje' : `Actualizar porcentaje: ${tabPorcentaje.arp_id || ''}`" :active.sync="popupGuardarEditarPorcentaje">
        <Nuevo_Edit_Porcentaje v-if="popupGuardarEditarPorcentaje" :verificarcrear_actualizar="verificarcrear_actualizar" :tabPorcentaje="tabPorcentaje" @change="changeHandleNuevoEditarPorcentaje" />
    </vs-popup>
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" @close="getPorcentaje();" :title="`¿Confirma que desea eliminar el porcentaje: ${tabPorcentaje.arp_id} ?`" :active.sync="popupActivoEliminarPorcentaje">
        <Eliminar_Porcentaje v-if="popupActivoEliminarPorcentaje" :tabPorcentaje="tabPorcentaje" @change="changeHandleEliminarPorcentaje" />
    </vs-popup>
    <!-- SECCION ACTIVAR/DESACTIVAR -->
    <vs-popup class="desactivar" @close="getPorcentaje();" :title="tabPorcentaje.arp_estado === 1 
            ? `Desactivar el porcentaje: ${tabPorcentaje.arp_id || ''}`
            : tabPorcentaje.arp_estado === 0
            ? `Activar el porcentaje: ${tabPorcentaje.arp_id || ''}`
            : tabPorcentaje.arp_estado != 1 && tabPorcentaje.arp_estado != 0
            ? `Estado no controlado para: ${tabPorcentaje.arp_id || ''}`
            : 'Porcentaje'" :active.sync="popupActivoDesactivarPorcentaje">
        <ActivarDesactivar_Porcentaje v-if="popupActivoDesactivarPorcentaje" :tabPorcentaje="tabPorcentaje" @change="changeHandleActivar_DesactivarPorcentaje" />
    </vs-popup>
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacionPorcentaje">
        <Informacion_Porcentaje v-if="popupInformacionPorcentaje" :userRoot="userRoot" :popupInformacionPorcentaje="popupInformacionPorcentaje" @change="changeHandleInformacionPorcentaje" />
    </vs-popup>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
const Nuevo_Edit_Porcentaje = () => import("@/views/facturacion/10_10_1_4/documentoliq/Cobranzas/Porcentaje/registro_edicion_porcentaje.vue");
const Eliminar_Porcentaje = () => import("@/views/facturacion/10_10_1_4/documentoliq/Cobranzas/Porcentaje/eliminar_porcentaje.vue");
const ActivarDesactivar_Porcentaje = () => import("@/views/facturacion/10_10_1_4/documentoliq/Cobranzas/Porcentaje/activar_desactivar_porcentaje.vue");
const Informacion_Porcentaje = () => import("@/views/facturacion/10_10_1_4/documentoliq/Cobranzas/Porcentaje/informacion_porcentaje.vue");
export default {
    data() {
        return {
            Verificacionconteo: '',
            Porcentajes: [],
            ContPorcentaje_sinfiltro: [],
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            popupGuardarEditarPorcentaje: false,
            popupActivoEliminarPorcentaje: false,
            popupActivoDesactivarPorcentaje: false,
            popupInformacionPorcentaje: false,
            arp_id: 0,
            parametrobusqueda: "",
            busqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 90000,
            verificarcrear_actualizar: 0,
            tabPorcentaje: {},
            tipo: '0',
        }
    },
    components: {
        'v-select': vSelect,
        Nuevo_Edit_Porcentaje,
        Eliminar_Porcentaje,
        ActivarDesactivar_Porcentaje,
        Informacion_Porcentaje
    },
    mounted() {
        this.getPorcentaje();
        // this.getPorcentaje();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        limpiar() {
            this.parametrobusqueda = '';
            this.Porcentajes = [];
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        getPorcentaje() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_PorcentajeContador', // Especifica la acción
                conteo: me.registrosmaximos,
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_AbonoRetencionPorcentaje', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    me.Verificacionconteo = res.data.mensaje;
                    me.conteoregistros = res.data.conteo;
                    // console.log(me.Verificacionconteo, "conteofianljeyson", me.conteoregistros)
                    if (me.Verificacionconteo == 'data_menor') {
                        me.Porcentajes = [];
                        me.getPorcentaje();
                        // console.log("entro aqui");
                    } else if (me.Verificacionconteo == 'data_igual') {
                        me.Porcentajes = [];
                        //Se manda la funcion apra que en los nuevos registros
                        // me.getPorcentaje_regduplicados();
                        me.getPorcentajeParametro();
                        // console.log("entro ACA");
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay Porcentajes para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Porcentajes = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        getPorcentaje() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'GetPorcentajeRetencionTodo', // Especifica la acción
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_AbonoRetencionPorcentaje', {
                    params: parametrosxfiltro
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Porcentajes = res.data;
                    this.ContPorcentaje_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getPorcentaje_regduplicados() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'GetPorcentajeRetencionTodo', // Especifica la acción
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_AbonoRetencionPorcentaje', {
                    params: parametrosxfiltro
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContPorcentaje_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getPorcentajeParametro() {
            let me = this;
            if (me.tipo == 0) {
                if (me.parametrobusqueda.trim().length < 1) {
                    me.$vs.notify({
                        text: 'Minimo 2 caracteres de busqueda',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
            }
            let parametrosxfiltro = {
                action: 'GetPorcentaje_xfiltro', // Especifica la acción
                busqueda: me.busqueda || '', // Valor o cadena vacía si no está definido
                razonbusqueda: me.parametrobusqueda || '' // Valor o cadena vacía si no está definido
            };
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.parametrobusqueda)
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_AbonoRetencionPorcentaje', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.Porcentajes = res.data;
                    if (me.Porcentajes.length === 0) {
                        me.$vs.notify({
                            text: 'No hay Porcentajes para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Porcentajes = [];
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
                            text: 'No hay Porcentajes para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Porcentajes = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevoEditarPorcentaje() {
            this.popupGuardarEditarPorcentaje = true;
        },
        getPreguntaEliminar() {
            this.popupActivoEliminarPorcentaje = true;
        },
        popup_desactivar_activar_Porcentaje(tr) {
            this.tabPorcentaje = tr;
            this.popupActivoDesactivarPorcentaje = true;
        },
        getInformacionPorcentaje() {
            this.popupInformacionPorcentaje = true;
        },
        changeHandleNuevoEditarPorcentaje(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarPorcentaje = false;
                this.getPorcentaje();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarPorcentaje = false;
                this.getPorcentaje();
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEliminarPorcentaje(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemiteliminar == 1) {
                console.log("Emit recibido por eliminado.");
                me.popupActivoEliminarPorcentaje = false;
                this.getPorcentaje();
            } else if (e.verificacionemiteliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoEliminarPorcentaje = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleActivar_DesactivarPorcentaje(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitdesactivar == 1) {
                console.log("Emit recibido por activado/desactivado.");
                me.popupActivoDesactivarPorcentaje = false;
                this.getPorcentaje();
            } else if (e.verificacionemitdesactivar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoDesactivarPorcentaje = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleInformacionPorcentaje(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitinformacion == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupInformacionPorcentaje = false;
                this.getPorcentaje();
            } else if (e.verificacionemitinformacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupInformacionPorcentaje = false;
            } else {
                console.log("Emit no recibido");
            }
        },
    },
}
</script>

<style scoped>
.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
