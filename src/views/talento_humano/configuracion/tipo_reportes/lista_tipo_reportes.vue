<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_TipoReportes(); verificarcrear_actualizar = 'create'">Agregar Nuevo tipo de reporte</vs-button>
        <vs-button color="dark" type="border" icon="info" @click="getInformacion_TipoReportes()" style="float: right" title="Información">Información</vs-button>
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
                                <vs-input v-if="tipo == 0" class="w-full" @keyup.enter="getParametro_TipoReportes()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="parametrobusqueda" />
                                <v-select v-else-if="tipo == 1" :options="UsuariosLibrerias" :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" label="datosbusqueda" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getParametro_TipoReportes()" />
                                <v-select v-else-if="tipo == 2" :options="ContratoAgrupacion" :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" label="datoscontagrupados" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getParametro_TipoReportes()" />
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
                            <vs-button v-if="tipo == 0" color="primary" style="height: 38px;" @click="getParametro_TipoReportes()" type="filled">Buscar</vs-button>
                        </div>
                    </div>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_TipoReportes()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Array_TipoReportes" no-data-text="No hay registros de TipoReportes">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ Array_TipoReportes.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="100">
                Código
            </vs-th>
            <vs-th colspan="1" width="500">
                Nombre tipo de reporte
            </vs-th>
            <vs-th colspan="1" width="400">
                Fechas y Usuarios
            </vs-th>
            <vs-th width="100">
                Estado
            </vs-th>
            <vs-th width="100">
                Acciones
            </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].ttr_id">
                    {{ data[indextr].ttr_id }}
                </vs-td>
                <vs-td>
                    {{tr.ttr_nombre}}
                </vs-td>
                <vs-td>
                    <small><b>Creación:</b><br> {{tr.created_at}} ({{ tr.name_created_by }})</small>
                    <br>
                    <small><b>Modificación:</b><br> {{tr.updated_at}} ({{ tr.name_updated_by }})</small>
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.ttr_estado == '1'" color="success">Activo</vs-chip>
                    <vs-chip v-else-if="tr.ttr_estado == '0'" color="danger">Inactivo</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].ttr_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <vs-dropdown-item>
                                <vs-button v-if="tr.ttr_estado == '1'" color="#28C76F" type="line" class="w-full" @click="getNuevoEditar_TipoReportes(tr); verificarcrear_actualizar='update'; tab_TipoReportes=tr">Editar</vs-button>
                                <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getPreguntaEliminar(tr);tab_TipoReportes=tr">Eliminar</vs-button>
                                <vs-button :color="tr.ttr_estado == '1' ? '#EA5455' : '#28C76F'" type="line" class="w-full" @click="popup_desactivar_activar_TipoReportes(tr)">
                                    {{ tr.ttr_estado == '1' ? 'Inactivar tipo de reporte' : 'Activar tipo de reporte' }}
                                </vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="registroagrupacion" @close="getConteo_TipoReportes();" :title="verificarcrear_actualizar === 'create' ? 'Crear nueva tipo de reporte' : `Actualizar tipo de reporte: ${tab_TipoReportes.ttr_nombre || ''}`" :active.sync="popupGuardarEditar_TipoReportes">
        <Nuevo_Edit_TipoReportes v-if="popupGuardarEditar_TipoReportes" :verificarcrear_actualizar="verificarcrear_actualizar" :tab_TipoReportes="tab_TipoReportes" @change="changeHandleNuevoEditar_TipoReportes" />
    </vs-popup>
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" @close="getConteo_TipoReportes();" :title="`¿Confirma que desea eliminar la tipo de reporte: ${tab_TipoReportes.ttr_nombre} ?`" :active.sync="popupActivoEliminar_TipoReportes">
        <Eliminar_TipoReportes v-if="popupActivoEliminar_TipoReportes" :tab_TipoReportes="tab_TipoReportes" @change="changeHandleEliminar_TipoReportes" />
    </vs-popup>
    <!-- SECCION ACTIVAR/DESACTIVAR -->
    <vs-popup class="desactivar" @close="getConteo_TipoReportes();" :title="tab_TipoReportes.ttr_estado === '1'
            ? `¿Inactivar la tipo de reporte: ${tab_TipoReportes.ttr_nombre || ''}?`
            : tab_TipoReportes.ttr_estado === '0'
            ? `¿Activar la tipo de reporte: ${tab_TipoReportes.ttr_nombre || ''}?`
            : tab_TipoReportes.ttr_estado != '1' && tab_TipoReportes.ttr_estado != '0'
            ? `Estado no controlado para: ${tab_TipoReportes.ttr_nombre || ''}`
            : 'tipo de reporte'" :active.sync="popupActivoDesactivar_TipoReportes">
        <ActivarDesactivar_TipoReportes v-if="popupActivoDesactivar_TipoReportes" :tab_TipoReportes="tab_TipoReportes" @change="changeHandleActivar_Desactivar_TipoReportes" />
    </vs-popup>
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacion_TipoReportes">
        <Informacion_TipoReportes v-if="popupInformacion_TipoReportes" :userRoot="userRoot" :popupInformacion_TipoReportes="popupInformacion_TipoReportes" @change="changeHandleInformacion_TipoReportes" />
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
const Nuevo_Edit_TipoReportes = () => import("@/views/talento_humano/configuracion/tipo_reportes/registro_edicion_tipo_reportes.vue");
const Eliminar_TipoReportes = () => import("@/views/talento_humano/configuracion/tipo_reportes/eliminar_tipo_reportes.vue");
const ActivarDesactivar_TipoReportes = () => import("@/views/talento_humano/configuracion/tipo_reportes/activar_desactivar_tipo_reportes.vue");
const Informacion_TipoReportes = () => import("@/views/talento_humano/configuracion/tipo_reportes/informacion_tipo_reportes.vue");
export default {
    data() {
        return {
            Verificacionconteo: '',
            Array_TipoReportes: [],
            Cont_sinfiltro_TipoReportes: [],
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            popupGuardarEditar_TipoReportes: false,
            popupActivoEliminar_TipoReportes: false,
            popupActivoDesactivar_TipoReportes: false,
            popupInformacion_TipoReportes: false,
            ttr_id: 0,
            parametrobusqueda: "",
            busqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 90000,
            verificarcrear_actualizar: '',
            tab_TipoReportes: {},
            tipo: '0',
        }
    },
    components: {
        'v-select': vSelect,
        Nuevo_Edit_TipoReportes,
        Eliminar_TipoReportes,
        ActivarDesactivar_TipoReportes,
        Informacion_TipoReportes
    },
    mounted() {
        this.getConteo_TipoReportes();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        limpiar() {
            this.parametrobusqueda = '';
            this.Array_TipoReportes = [];
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        getConteo_TipoReportes() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_TipoReportesContador',
                conteo: me.registrosmaximos
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_TipoReportes', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    me.Verificacionconteo = res.data.mensaje;
                    me.conteoregistros = res.data.conteo;
                    // console.log(me.Verificacionconteo, "conteofianljeyson", me.conteoregistros)
                    if (me.Verificacionconteo == 'data_menor') {
                        me.Array_TipoReportes = [];
                        me.get_TipoReportes();
                        // console.log("entro aqui");
                    } else if (me.Verificacionconteo == 'data_igual') {
                        me.Array_TipoReportes = [];
                        //Se manda la funcion apra que en los nuevos registros
                        // me.getregduplicados();
                        me.getParametro_TipoReportes();
                        // console.log("entro ACA");
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay ninguna tipo de reporte para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_TipoReportes = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        get_TipoReportes() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_TipoReportes'
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_TipoReportes', {
                    params: parametrosxfiltro
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Array_TipoReportes = res.data;
                    this.Cont_sinfiltro_TipoReportes = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getregduplicados() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_TipoReportes'
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_TipoReportes', {
                    params: parametrosxfiltro
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Cont_sinfiltro_TipoReportes = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getParametro_TipoReportes() {
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
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_TipoReportes_xfiltro',
                busqueda: me.busqueda,
                razonbusqueda: me.parametrobusqueda
            };
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.parametrobusqueda)
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_TipoReportes', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.Array_TipoReportes = res.data;
                    if (me.Array_TipoReportes.length === 0) {
                        me.$vs.notify({
                            text: 'No hay ninguna tipo de reporte para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_TipoReportes = [];
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
                            text: 'No hay ninguna tipo de reporte para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_TipoReportes = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevoEditar_TipoReportes() {
            this.popupGuardarEditar_TipoReportes = true;
        },
        getPreguntaEliminar() {
            this.popupActivoEliminar_TipoReportes = true;
        },
        popup_desactivar_activar_TipoReportes(tr) {
            this.tab_TipoReportes = tr;
            this.popupActivoDesactivar_TipoReportes = true;
        },
        getInformacion_TipoReportes() {
            this.popupInformacion_TipoReportes = true;
        },
        changeHandleNuevoEditar_TipoReportes(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditar_TipoReportes = false;
                this.getConteo_TipoReportes();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditar_TipoReportes = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEliminar_TipoReportes(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemiteliminar == 1) {
                console.log("Emit recibido por eliminado.");
                me.popupActivoEliminar_TipoReportes = false;
                this.getConteo_TipoReportes();
            } else if (e.verificacionemiteliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoEliminar_TipoReportes = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleActivar_Desactivar_TipoReportes(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitdesactivar == 1) {
                console.log("Emit recibido por activado/desactivado.");
                me.popupActivoDesactivar_TipoReportes = false;
                this.getConteo_TipoReportes();
            } else if (e.verificacionemitdesactivar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoDesactivar_TipoReportes = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleInformacion_TipoReportes(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitinformacion == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupInformacion_TipoReportes = false;
                this.getConteo_TipoReportes();
            } else if (e.verificacionemitinformacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupInformacion_TipoReportes = false;
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


