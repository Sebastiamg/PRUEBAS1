<template>
<vx-card fixed-height="true">
    <div>
        <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditarContUserAgrupacion(); verificarcrear_actualizar = 'create'">Agregar Nueva Agrupación</vs-button>
        <vs-button color="dark" type="border" icon="info" @click="getInformacionContUserAgrupacion()" style="float: right" title="Información">Información</vs-button>
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
                                <vs-input v-if="tipo == 0" class="w-full" @keyup.enter="getContUserAgrupacionParametro()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="parametrobusqueda" />
                                <v-select v-else-if="tipo == 1" :options="UsuariosLibrerias" :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" label="datosbusqueda" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getContUserAgrupacionParametro()" />
                                <v-select v-else-if="tipo == 2" :options="ContratoAgrupacion" :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" label="datoscontagrupados" style="font-size: 14px; min-width: 290px; max-width: 400px;" class="h-100-styles" placeholder="--Seleccione--" v-model="parametrobusqueda" @input="getContUserAgrupacionParametro()" />
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
                            <vs-button v-if="tipo == 0" color="primary" style="height: 38px;" @click="getContUserAgrupacionParametro()" type="filled">Buscar</vs-button>
                        </div>
                    </div>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevoEditarContUserAgrupacion()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="ContUserAgrupados">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ ContUserAgrupados.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="100">
                Código
            </vs-th>
            <vs-th colspan="1" width="500">
                Información del Usuario
            </vs-th>
            <vs-th colspan="1" width="500">
                Información del Agrupado
            </vs-th>
            <vs-th colspan="1" width="200">
                Fechas
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
                <vs-td :data="data[indextr].fcu_id">
                    {{ data[indextr].fcu_id }}
                </vs-td>
                <vs-td>
                    <small><b>Nombre:</b> {{tr.usuariolibreria}}</small>
                    <br>
                    <small><b>Cédula:</b> {{tr.cedula}}</small>
                </vs-td>
                <vs-td>
                    <small><b>Código:</b> {{tr.ca_codigo_agrupado}}</small>
                    <br>
                    <small><b>Nombre:</b> {{tr.ca_descripcion}}</small>
                </vs-td>
                <vs-td>
                    <small><b>Fecha Creación:</b><br> {{tr.created_at}}</small>
                    <br>
                    <small><b>Fecha Modificación:</b><br> {{tr.updated_at}}</small>
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.fcu_estado == 1" color="success">Activo</vs-chip>
                    <vs-chip v-else-if="tr.fcu_estado == 0" color="danger">Inactivo</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].fcu_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <vs-dropdown-item>
                                <vs-button v-if="tr.fcu_estado == 1" color="#28C76F" type="line" class="w-full" @click="getNuevoEditarContUserAgrupacion(tr); verificarcrear_actualizar='update'; tabContUserAgrupacion=tr">Editar</vs-button>
                                <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="getPreguntaEliminar(tr);tabContUserAgrupacion=tr">Eliminar</vs-button>
                                <vs-button v-if="tr.fcu_estado == 1" color="#EA5455" type="line" class="w-full" @click="popup_desactivar_activar_ContUserAgrupacion(tr);">Desactivar Agrupación</vs-button>
                                <vs-button v-if="tr.fcu_estado == 0" color="#28C76F" type="line" class="w-full" @click="popup_desactivar_activar_ContUserAgrupacion(tr);">Activar Agrupación</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="registroagrupacion" @close="getContUserAgrupacionConteo();" :title="verificarcrear_actualizar === 'create' ? 'Crear nueva agrupación' : `Actualizar agrupado: ${tabContUserAgrupacion.fcu_id || ''}`" :active.sync="popupGuardarEditarContUserAgrupacion">
      <Nuevo_Edit_ContUserAgrupacion v-if="popupGuardarEditarContUserAgrupacion"  :sendPuntos="sendPuntos" :desdeAgrupado="desdeAgrupado" :verificarcrear_actualizar="verificarcrear_actualizar" :tabContUserAgrupacion="tabContUserAgrupacion" @change="changeHandleNuevoEditarAgrupacion" />
    </vs-popup>
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" @close="getContUserAgrupacionConteo();" :title="`¿Confirma que desea eliminar el registro: ${tabContUserAgrupacion.fcu_id} ?`" :active.sync="popupActivoEliminarContUserAgrupacion">
        <Eliminar_ContUserAgrupacion v-if="popupActivoEliminarContUserAgrupacion" :tabContUserAgrupacion="tabContUserAgrupacion" @change="changeHandleEliminarAgrupacion" />
    </vs-popup>
    <!-- SECCION ACTIVAR/DESACTIVAR -->
    <vs-popup class="desactivar" @close="getContUserAgrupacionConteo();" :title="tabContUserAgrupacion.fcu_estado === 1
            ? `Desactivar la agrupación: ${tabContUserAgrupacion.fcu_id || ''}`
            : tabContUserAgrupacion.fcu_estado === 0
            ? `Activar la agrupación: ${tabContUserAgrupacion.fcu_id || ''}`
            : tabContUserAgrupacion.fcu_estado != 1 && tabContUserAgrupacion.fcu_estado != 0
            ? `Estado no controlado para: ${tabContUserAgrupacion.fcu_id || ''}`
            : 'Agrupación'" :active.sync="popupActivoDesactivarContUserAgrupacion">
        <ActivarDesactivar_ContUserAgrupacion v-if="popupActivoDesactivarContUserAgrupacion" :tabContUserAgrupacion="tabContUserAgrupacion" @change="changeHandleActivar_DesactivarAgrupacion" />
    </vs-popup>
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacion" title="Información" :active.sync="popupInformacionContUserAgrupacion">
        <Informacion_ContUserAgrupacion v-if="popupInformacionContUserAgrupacion" @change="changeHandleInformacionAgrupacion" />
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
const Nuevo_Edit_ContUserAgrupacion = () => import("@/views/facturacion/10_10_1_4/Facturacion/Contrato_Usuario_Agrupado/registro_edicion_agrupados.vue");
const Eliminar_ContUserAgrupacion = () => import("@/views/facturacion/10_10_1_4/Facturacion/Contrato_Usuario_Agrupado/eliminar_agrupados.vue");
const ActivarDesactivar_ContUserAgrupacion = () => import("@/views/facturacion/10_10_1_4/Facturacion/Contrato_Usuario_Agrupado/activar_desactivar_agrupados.vue");
const Informacion_ContUserAgrupacion = () => import("@/views/facturacion/10_10_1_4/Facturacion/Contrato_Usuario_Agrupado/informacion_agrupados.vue");
export default {
    data() {
        return {
            Verificacionconteo: '',
            ContUserAgrupados: [],
            ContUserAgrupacion_sinfiltro: [],
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            popupGuardarEditarContUserAgrupacion: false,
            popupActivoEditarContUserAgrupacion: false,
            popupActivoEliminarContUserAgrupacion: false,
            popupActivoDesactivarContUserAgrupacion: false,
            popupInformacionContUserAgrupacion: false,
            fcu_id: 0,
            parametrobusqueda: "",
            busqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 100,
            verificarcrear_actualizar: 0,
            tabContUserAgrupacion: {},
            tipo: '0',
        }
    },
    components: {
        'v-select': vSelect,
        Nuevo_Edit_ContUserAgrupacion,
        Eliminar_ContUserAgrupacion,
        ActivarDesactivar_ContUserAgrupacion,
        Informacion_ContUserAgrupacion
    },
    mounted() {
      this.getContUserAgrupacionConteo();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    props:{
      desdeAgrupado:{
        type:Number,
        default:0
      },
      sendPuntos:{
        type:[Object,String],
        default:function(){
          return {}
        }
      }
    },
    methods: {
        limpiar() {
            this.parametrobusqueda = '';
            this.ContUserAgrupados = [];
        },
        getUsuariosLibrerias() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetUsuarios_PerfilLibrerias')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.UsuariosLibrerias = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getContratoAgrupado() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Contratosagrupados_Completo')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContratoAgrupacion = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        getContUserAgrupacionConteo() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Contrato_UsuarioContador?conteo=' + me.registrosmaximos)
                .then(function (res) {
                    me.Verificacionconteo = res.data.mensaje;
                    me.conteoregistros = res.data.conteo;
                    console.log(me.Verificacionconteo, "conteofianljeyson", me.conteoregistros)
                    if (me.Verificacionconteo == 'data_menor') {
                        me.ContUserAgrupados = [];
                        me.getContUserAgrupados();
                        // console.log("entro aqui");
                    } else if (me.Verificacionconteo == 'data_igual') {
                        me.ContUserAgrupados = [];
                        //Se manda la funcion apra que en los nuevos registros
                        // me.getContUserAgrupados_regduplicados();
                        me.getUsuariosLibrerias();
                        me.getContratoAgrupado();
                        me.getContUserAgrupacionParametro();
                        // console.log("entro ACA");
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay Tipo Empaque para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.ContUserAgrupados = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        getContUserAgrupados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Contrato_Usuario')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    //si es desdeAgrupado es 1 filtrar  el ca_codigo_agrupado
                    let datos = []
                    if(me.desdeAgrupado == 1){
                      datos = res.data.filter(c => c.ca_codigo_agrupado == me.sendPuntos.ca_codigo_agrupado);
                    }else{
                      datos                           = res.data;
                    }
                    this.ContUserAgrupados            = datos;
                    this.ContUserAgrupacion_sinfiltro = datos;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getContUserAgrupados_regduplicados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Contrato_Usuario')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContUserAgrupacion_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getContUserAgrupacionParametro() {
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
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.parametrobusqueda)
            this.$http.get(this.$server_url + 'GetContrato_Usuario_xfiltro?busqueda=' + me.busqueda + '&razonbusqueda=' + me.parametrobusqueda)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.ContUserAgrupados = res.data;
                    if (me.ContUserAgrupados.length === 0) {
                        me.$vs.notify({
                            text: 'No hay Agrupados para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.ContUserAgrupados = [];
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
                            text: 'No hay Agrupados para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.ContUserAgrupados = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevoEditarContUserAgrupacion() {
            this.popupGuardarEditarContUserAgrupacion = true;
        },
        getPreguntaEliminar() {
            this.popupActivoEliminarContUserAgrupacion = true;
        },
        popup_desactivar_activar_ContUserAgrupacion(tr) {
            this.tabContUserAgrupacion = tr;
            this.popupActivoDesactivarContUserAgrupacion = true;
        },
        getInformacionContUserAgrupacion() {
            this.popupInformacionContUserAgrupacion = true;
        },
        changeHandleNuevoEditarAgrupacion(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarContUserAgrupacion = false;
                this.getContUserAgrupacionConteo();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarContUserAgrupacion = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEliminarAgrupacion(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemiteliminar == 1) {
                console.log("Emit recibido por eliminado.");
                me.popupActivoEliminarContUserAgrupacion = false;
                this.getContUserAgrupacionConteo();
            } else if (e.verificacionemiteliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoEliminarContUserAgrupacion = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleActivar_DesactivarAgrupacion(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitdesactivar == 1) {
                console.log("Emit recibido por activado/desactivado.");
                me.popupActivoDesactivarContUserAgrupacion = false;
                this.getContUserAgrupacionConteo();
            } else if (e.verificacionemitdesactivar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoDesactivarContUserAgrupacion = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleInformacionAgrupacion(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitinformacion == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupInformacionContUserAgrupacion = false;
                this.getContUserAgrupacionConteo();
            } else if (e.verificacionemitinformacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupInformacionContUserAgrupacion = false;
            } else {
                console.log("Emit no recibido");
            }
        },
    },
}
</script>
