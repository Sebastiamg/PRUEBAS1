<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_Institucion_Autoridades(); verificarcrear_actualizar = 'create'">Agregar Nuevo Cargo</vs-button>
        <!-- <vs-button color="dark" type="border" icon="info" @click="getInformacion_Institucion_Autoridades()" style="float: right" title="Información">Información</vs-button> -->
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
                                <vs-input v-if="tipo == 0" class="w-full" @keyup.enter="getParametro_Institucion_Autoridades()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="parametrobusqueda" />
                                <v-select v-else-if="tipo == 1" :options="UsuariosLibrerias" :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" label="datosbusqueda" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getParametro_Institucion_Autoridades()" />
                                <v-select v-else-if="tipo == 2" :options="ContratoAgrupacion" :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" label="datoscontagrupados" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getParametro_Institucion_Autoridades()" />
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
                            <vs-button v-if="tipo == 0" color="primary" style="height: 38px;" @click="getParametro_Institucion_Autoridades()" type="filled">Buscar</vs-button>
                        </div>
                    </div>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditar_Institucion_Autoridades()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Array_Institucion_Autoridades" no-data-text="No hay registros de cargos de Autoridades">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ Array_Institucion_Autoridades.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="100">
                Código
            </vs-th>
            <vs-th colspan="1" width="500">
                Nombre Cargo
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
                <vs-td :data="data[indextr].ina_id">
                    {{ data[indextr].ina_id }}
                </vs-td>
                <vs-td>
                    {{tr.ina_nombre}}
                </vs-td>
                <vs-td>
                    <small><b>Creación:</b><br> {{tr.created_at}} ({{ tr.name_user_created }})</small>
                    <br>
                    <small><b>Modificación:</b><br> {{tr.updated_at}} ({{ tr.name_user_edit }})</small>
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.ina_estado == '1'" color="success">Activo</vs-chip>
                    <vs-chip v-else-if="tr.ina_estado == '0'" color="danger">Inactivo</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].ina_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <vs-dropdown-item>
                                <vs-button v-if="tr.ina_estado == '1'" color="#28C76F" type="line" class="w-full" @click="getNuevoEditar_Institucion_Autoridades(tr); verificarcrear_actualizar='update'; tab_Institucion_Autoridades=tr">Editar</vs-button>
                                <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getPreguntaEliminar(tr);tab_Institucion_Autoridades=tr">Eliminar</vs-button>
                                <vs-button :color="tr.ina_estado == '1' ? '#EA5455' : '#28C76F'" type="line" class="w-full" @click="popup_desactivar_activar_Institucion_Autoridades(tr)">
                                    {{ tr.ina_estado == '1' ? 'Inactivar Cargo' : 'Activar Cargo' }}
                                </vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="registroagrupacion" @close="getConteo_Institucion_Autoridades();" :title="verificarcrear_actualizar === 'create' ? 'Crear nuevo cargo de autoridades' : `Actualizar cargo: ${tab_Institucion_Autoridades.ina_nombre || ''}`" :active.sync="popupGuardarEditar_Institucion_Autoridades">
        <Nuevo_Edit_Institucion_Autoridades v-if="popupGuardarEditar_Institucion_Autoridades" :verificarcrear_actualizar="verificarcrear_actualizar" :tab_Institucion_Autoridades="tab_Institucion_Autoridades" @change="changeHandleNuevoEditar_Institucion_Autoridades" />
    </vs-popup>
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" @close="getConteo_Institucion_Autoridades();" :title="`¿Confirma que desea eliminar el cargo: ${tab_Institucion_Autoridades.ina_nombre} ?`" :active.sync="popupActivoEliminar_Institucion_Autoridades">
        <Eliminar_Institucion_Autoridades v-if="popupActivoEliminar_Institucion_Autoridades" :tab_Institucion_Autoridades="tab_Institucion_Autoridades" @change="changeHandleEliminar_Institucion_Autoridades" />
    </vs-popup>
    <!-- SECCION ACTIVAR/DESACTIVAR -->
    <vs-popup class="desactivar" @close="getConteo_Institucion_Autoridades();" :title="tab_Institucion_Autoridades.ina_estado === '1'
            ? `¿Inactivar el cargo: ${tab_Institucion_Autoridades.ina_nombre || ''}?`
            : tab_Institucion_Autoridades.ina_estado === '0'
            ? `¿Activar el cargo: ${tab_Institucion_Autoridades.ina_nombre || ''}?`
            : tab_Institucion_Autoridades.ina_estado != '1' && tab_Institucion_Autoridades.ina_estado != '0'
            ? `Estado no controlado para: ${tab_Institucion_Autoridades.ina_nombre || ''}`
            : 'Cargo'" :active.sync="popupActivoDesactivar_Institucion_Autoridades">
        <ActivarDesactivar_Institucion_Autoridades v-if="popupActivoDesactivar_Institucion_Autoridades" :tab_Institucion_Autoridades="tab_Institucion_Autoridades" @change="changeHandleActivar_Desactivar_Institucion_Autoridades" />
    </vs-popup>
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacion_Institucion_Autoridades">
        <Informacion_Institucion_Autoridades v-if="popupInformacion_Institucion_Autoridades" :userRoot="userRoot" :popupInformacion_Institucion_Autoridades="popupInformacion_Institucion_Autoridades" @change="changeHandleInformacion_Institucion_Autoridades" />
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
const Nuevo_Edit_Institucion_Autoridades = () => import('@/views/talento_humano/configuracion/cargos_prolipa/registro_edicion_cargosprolipa.vue')
const Eliminar_Institucion_Autoridades = () => import('@/views/talento_humano/configuracion/cargos_prolipa/eliminar_cargosprolipa.vue')
const ActivarDesactivar_Institucion_Autoridades = () => import('@/views/talento_humano/configuracion/cargos_prolipa/activar_desactivar_cargosprolipa.vue')
const Informacion_Institucion_Autoridades = () => import('@/views/talento_humano/configuracion/cargos_prolipa/informacion_cargosprolipa.vue')
export default {
    data() {
        return {
            Verificacionconteo: '',
            Array_Institucion_Autoridades: [],
            Cont_sinfiltro_Institucion_Autoridades: [],
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            popupGuardarEditar_Institucion_Autoridades: false,
            popupActivoEliminar_Institucion_Autoridades: false,
            popupActivoDesactivar_Institucion_Autoridades: false,
            popupInformacion_Institucion_Autoridades: false,
            ina_id: 0,
            parametrobusqueda: "",
            busqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 90000,
            verificarcrear_actualizar: '',
            tab_Institucion_Autoridades: {},
            tipo: '0',
        }
    },
    components: {
        'v-select': vSelect,
        Nuevo_Edit_Institucion_Autoridades,
        Eliminar_Institucion_Autoridades,
        ActivarDesactivar_Institucion_Autoridades,
        Informacion_Institucion_Autoridades
    },
    mounted() {
        this.getConteo_Institucion_Autoridades();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        limpiar() {
            this.parametrobusqueda = '';
            this.Array_Institucion_Autoridades = [];
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        getConteo_Institucion_Autoridades() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_Institucion_AutoridadesContador',
                conteo: me.registrosmaximos
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Institucion_Autoridades', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    me.Verificacionconteo = res.data.mensaje;
                    me.conteoregistros = res.data.conteo;
                    // console.log(me.Verificacionconteo, "conteofianljeyson", me.conteoregistros)
                    if (me.Verificacionconteo == 'data_menor') {
                        me.Array_Institucion_Autoridades = [];
                        me.get_Institucion_Autoridades();
                        // console.log("entro aqui");
                    } else if (me.Verificacionconteo == 'data_igual') {
                        me.Array_Institucion_Autoridades = [];
                        //Se manda la funcion apra que en los nuevos registros
                        // me.getregduplicados();
                        me.getParametro_Institucion_Autoridades();
                        // console.log("entro ACA");
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay ningun cargo para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_Institucion_Autoridades = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        get_Institucion_Autoridades() {
            let me = this;
            me.$vs.loading()
            let parametrosxfiltro = {
                action: 'Get_Cargos_Prolipa'
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Institucion_Autoridades', {
                    params: parametrosxfiltro
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Array_Institucion_Autoridades = res.data;
                    this.Cont_sinfiltro_Institucion_Autoridades = res.data;
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
                action: 'Get_Cargos_Prolipa'
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Institucion_Autoridades', {
                    params: parametrosxfiltro
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Cont_sinfiltro_Institucion_Autoridades = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getParametro_Institucion_Autoridades() {
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
                action: 'Get_Institucion_Autoridades_xfiltro',
                busqueda: me.busqueda,
                razonbusqueda: me.parametrobusqueda
            };
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.parametrobusqueda)
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Institucion_Autoridades', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.Array_Institucion_Autoridades = res.data;
                    if (me.Array_Institucion_Autoridades.length === 0) {
                        me.$vs.notify({
                            text: 'No hay ningun cargo para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_Institucion_Autoridades = [];
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
                            text: 'No hay ningun cargo para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Array_Institucion_Autoridades = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevoEditar_Institucion_Autoridades() {
            this.popupGuardarEditar_Institucion_Autoridades = true;
        },
        getPreguntaEliminar() {
            this.popupActivoEliminar_Institucion_Autoridades = true;
        },
        popup_desactivar_activar_Institucion_Autoridades(tr) {
            this.tab_Institucion_Autoridades = tr;
            this.popupActivoDesactivar_Institucion_Autoridades = true;
        },
        getInformacion_Institucion_Autoridades() {
            this.popupInformacion_Institucion_Autoridades = true;
        },
        changeHandleNuevoEditar_Institucion_Autoridades(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditar_Institucion_Autoridades = false;
                this.getConteo_Institucion_Autoridades();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditar_Institucion_Autoridades = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEliminar_Institucion_Autoridades(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemiteliminar == 1) {
                console.log("Emit recibido por eliminado.");
                me.popupActivoEliminar_Institucion_Autoridades = false;
                this.getConteo_Institucion_Autoridades();
            } else if (e.verificacionemiteliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoEliminar_Institucion_Autoridades = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleActivar_Desactivar_Institucion_Autoridades(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitdesactivar == 1) {
                console.log("Emit recibido por activado/desactivado.");
                me.popupActivoDesactivar_Institucion_Autoridades = false;
                this.getConteo_Institucion_Autoridades();
            } else if (e.verificacionemitdesactivar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoDesactivar_Institucion_Autoridades = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleInformacion_Institucion_Autoridades(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitinformacion == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupInformacion_Institucion_Autoridades = false;
                this.getConteo_Institucion_Autoridades();
            } else if (e.verificacionemitinformacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupInformacion_Institucion_Autoridades = false;
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
