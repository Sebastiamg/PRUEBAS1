<template>
<div>
    <br><br>
    <vs-tabs>
        <vs-tab label="Información pedido">
            <div class="con-tab-ejemplo">
                <vx-card :title="sendPedido.id_pedido == 0 ? 'Crear Pedido' : 'Informacion Pedido #' + sendPedido.id_pedido">
                    <div class="vx-row">
                        <div class="vx-col md:w-4/5 w-full mb-3">
                            <div class="label_inputs">Institución</div>
                            <v-select :options="arrayInstituciones" :reduce="item => item.idInstitucion" label="nombre_institucion" v-model="pedido.institucion" class="w-full" @input="buscaPedidoGenerado(pedido.institucion)" :disabled="sendPedido.id_pedido != 0" />
                            <!-- Mensaje de advertencia elegante -->
                            <div class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded shadow-sm" v-if="permisoFichero == 1">
                                <p class="text-sm font-medium">
                                    ⚠ Atención: Solo las instituciones con fichero aprobado aparecerán en la lista. Los puntos de venta se mostrarán sin necesidad de fichero.
                                </p>
                            </div>
                        </div>

                        <div class="vx-col md:w-1/5 w-full mb-3">
                            <div class="label_inputs">Asesor</div>
                            <p style="font-weight: 500;" class="text-primary">{{ pedido.asesor }}</p>
                            <p v-if="userRoot">
                                <vs-button @click="f_modal_cambiar_asesor(pedido)">Cambiar asesor</vs-button>
                            </p>
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
                            <vs-input type="text" label="Ruc institución" v-model="pedido.ruc" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
                            <vs-input type="text" label="Dirección institución" v-model="pedido.direccionInstitucion" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
                            <div class="label_inputs">Nivel</div>
                            <v-select :options="arregloNivel" :reduce="arregloNivel => arregloNivel.id" label="label" v-model="pedido.nivel" class="w-full" />
                        </div>
                        <!--ESC PARTICULAR-->
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
                            <div class="label_inputs">Seleccione el sostenimiento:</div>
                            <v-select :options="tiposEscuelas" :reduce="tiposEscuelas => tiposEscuelas" v-model="pedido.tipo_descripcion" placeholder="Seleccione el tipo de escuela" :disabled="pedidoInstituciondescripcion && pedidoInstituciondescripcion !== '' && pedidoInstituciondescripcion !== 'null'" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
                            <vs-input type="number" label="Télefono institución" v-model="pedido.telefonoInstitucion" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                            <vs-input type="text" label="Período" disabled v-model="pedido.periodo" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                            <div class="label_inputs">Tipo de venta</div>
                            <v-select :options="tipos_venta" :reduce="tipos_venta => tipos_venta.id_tipo" label="tipo_venta" v-model="pedido.tipo_venta" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                            <div class="label_inputs">Fecha solicitud</div>
                            <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_envio" placeholder="Fecha solicitud" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                            <div class="label_inputs">Fecha entrega</div>
                            <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_entrega" placeholder="Fecha entrega" class="w-full" />
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                            <vs-input type="number" label="Comisión % (Maximo 40%)" @input="limitarNumero();" v-model="pedido.descuento" class="w-full" />
                            <div v-if="pedido.id_pedido > 0 && (userRoot || userAsesor || usuario.id_group == 23)">
                                <vs-button color="#D83A17" class="mt-3" size="small" @click="popupSolicitudComision = true;">%
                                    Solicitar más Comisión</vs-button>
                            </div>
                            <div v-else>
                                <span class="mt-1 text-warning">Si necesita más del <b>{{ maxNumero }}%</b> guarde primero</span>
                            </div>
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3" v-if="pedido.id_pedido > 0">
                            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 mt-2">
                                <div class="flex items-center mb-3">
                                    <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <h4 class="text-base font-bold text-blue-900">Último Pedido</h4>
                                </div>
                                <div v-if="ObjectUltimoPedido && ObjectUltimoPedido.length > 0" class="space-y-2">
                                    <div class="bg-white rounded-md p-2.5 border-l-3 border-l-blue-500">
                                        <p class="text-xs text-gray-500 mb-0.5">Contrato</p>
                                        <p class="text-sm font-semibold text-blue-700">{{ ObjectUltimoPedido[0].contrato_generado || 'N/A' }}</p>
                                    </div>
                                    <div class="bg-white rounded-md p-2.5 border-l-3 border-l-green-500">
                                        <p class="text-xs text-gray-500 mb-0.5">Comisión</p>
                                        <p class="text-sm font-semibold text-green-700">{{ ObjectUltimoPedido[0].descuento || '0' }}%</p>
                                    </div>
                                </div>
                                <div v-else class="bg-white rounded-md p-3 text-center">
                                    <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                    </svg>
                                    <p class="text-sm text-gray-500 font-medium">No se encontraron pedidos anteriores</p>
                                    <p class="text-xs text-gray-400 mt-1">con esta institución</p>
                                </div>
                            </div>
                        </div>
                        <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3" v-if="userRoot || userAsesor">
                            <small>Enviar a Facturador:</small>
                            <ul class="flex">
                                <li>
                                    <vs-radio v-model="pedido.facturacion_vee" class="mr-3" vs-name="radios1facturacion_vee" vs-value="0">No</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="pedido.facturacion_vee" vs-name="radios1facturacion_vee" vs-value="1">Si</vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--OBSERVACION-->
                    <div class="vx-row">
                        <div class="vx-col w-full mb-6">
                            <vs-textarea style="width:100%;" height="200px" label="Observación" v-model="pedido.observacion" />
                        </div>
                    </div>
                    <div style="width: 100%;" class="mt-5">
                    </div>
                    <div class="flex justify-center">
                        <vs-button color="warning" class="mr-2" type="border" icon-pack="feather" icon="icon-save" @click="guardarPedido">Guardar pedido</vs-button>
                        <vs-button color="success" v-if="pedido.id_pedido > 0" type="gradient" @click="input_comentario = ''; ver_comentarios(); popupComentarios = true">Ver comentarios</vs-button>
                    </div>
                    <!--MODALES-->
                    <!--POPUP COMENTARIOS-->
                    <vs-popup fullscreen title="Comentarios" :active.sync="popupComentarios">
                        <div class="w-full" align="center">
                            <vs-textarea v-model="input_comentario" class="w-ful mb-3" />
                            <vs-button type="line" color="success" @click="guardar_comentario">Enviar</vs-button>
                        </div>
                        <vs-divider></vs-divider>
                        <vs-list>
                            <div :key="index" v-for="(item, index) in comentarios">
                                <vs-list-header :title="item.nombres + ' ' + item.apellidos"></vs-list-header>
                                <vs-list-item :subtitle="item.comentario">
                                    <span style="font-size: 12px;" class="m-2"> {{ item.created_at }} </span>
                                </vs-list-item>
                            </div>
                        </vs-list>
                    </vs-popup>
                    <!--POPUP MAS COMISION-->
                    <vs-popup :title="'Solicitud de más comisión '" :active.sync="popupSolicitudComision">
                        <div v-if="popupSolicitudComision">
                            <ScreenComisionVue :pedido="Object(pedido)" :tipo="0" @rechargePedido="rechargePedido" />
                        </div>
                    </vs-popup>
                </vx-card>
            </div>
        </vs-tab>
    </vs-tabs>
    <!-- cambiar asesor SOLO ROOT -->
    <div>
        <vs-popup title="Cambio de asesor" :active.sync="modalAsesorCambio">
            <div v-if="!okCambiaAsesor">
                <v-select :options="asesores" :reduce="asesores => asesores" label="nombres" v-model="asesorActualizado" class="w-full"></v-select>
                <p class="mt-5 mb-5 mt-6 text-center">
                    <vs-button class="mr-4" @click="f_change_asesor()">Cambiar de asesorss</vs-button>
                    <vs-button class="mr-4" @click="f_cancelar()">Cancelar</vs-button>
                </p>
                <p class="mb-5 mt-5">&nbsp;</p>
            </div>
            <div v-if="okCambiaAsesor">
                <h3 class="text-center">Esta seguro de asignar este pedido a: <br> {{ asesorActualizado.nombres }}</h3>
                <p class="mt-5 mb-5 mt-6 text-center">
                    <vs-button color="success" class="mr-4" @click="f_btn_aceptar_cambio_asesor()">Si, estoy seguro</vs-button>
                    <vs-button class="mr-4" @click="f_cancelar()">Cancelar</vs-button>
                </p>

            </div>
        </vs-popup>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import axios from 'axios'
import PedidosRepository from "../../../../repositories/PedidosRepository";
const ScreenComisionVue = () => import('../comision/ScreenComision.vue');
const DatosFactura = () => import('./datosFactura/facturadatos.vue');
export default {
    components: {
        flatPickr,
        'v-select': vSelect,
        ScreenComisionVue,
        DatosFactura,
    },
    data: () => ({
        usuario: [],
        pedido: {
            id_pedido: 0,
            institucion: '',
            asesor: '',
            ruc: '',
            direccionInstitucion: '',
            nivel: '',
            tipo_descripcion: '',
            telefonoInstitucion: '',
            periodo: '',
            idperiodo: '',
            tipo_venta: '',
            fecha_envio: '',
            fecha_entrega: '',
            descuento: '',
            estado: 0,
            contrato_generado: '',
            id_asesor: 0,
            facturacion_vee: 0,
            observacion: '',
        },
        arrayInstituciones: [],
        arrayPuntosVenta: [],
        arrayPeriodos: [],
        arregloNivel: [{
                id: 1,
                label: 'Educación General Básica'
            },
            {
                id: 2,
                label: 'Bachillerato General Unificado'
            },
        ],
        tiposEscuelas: [
            "Esc. Particular",
            "Esc. Fiscomisional",
            "Esc. Fiscal",
            "Esc. Laico",
            "Esc. Religioso"
        ],
        tipos_venta: [{
                id_tipo: 1,
                tipo_venta: 'Directa'
            },
            {
                id_tipo: 2,
                tipo_venta: 'Comisión o lista'
            },
        ],
        configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d',
        },
        sendPedido: '',
        // counterDanger: false,
        //variables de comentarios
        comentarios: [],
        popupComentarios: false,
        input_comentario: '',
        //fin variables de comentarios
        maxNumero: 40,
        popupSolicitudComision: false,
        ifdespachoInstitucion: false,
        disabledCheckDepacho: false,
        asesorSelected: '',
        asesores: [],
        modalAsesorCambio: false,
        asesorActualizado: {},
        pedidoActualAsesor: 0,
        okCambiaAsesor: false,
        ObjectUltimoPedido: [],
        objectPeriodoSelect: {},
        pedidoInstituciondescripcion: '',
    }),
    mounted() {
        let me = this
        this.getPeriodoData()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if (me.asesorSelectedPedido) {
            me.asesorSelected = me.asesorSelectedPedido
        } else {
            me.asesorSelected = this.usuario
        }
        this.getPuntosVenta()
        this.setDatos()
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador', 'asesorSelectedPedido','permisoFichero','userFacturador','userAdminFacturador']),
    },
    watch: {
        ObjectPedido(results) {
            let me = this
            me.sendPedido = me.ObjectPedido
        },
    },
    methods: {
        getPeriodoData() {
            let me = this;
            this.$http.get(this.$server_url + 'periodo/' + localStorage.getItem('pid'))
                .then(function (res) {
                   me.objectPeriodoSelect = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        limitarNumero() {
            if (this.pedido.descuento > this.maxNumero) {
                this.pedido.descuento = this.maxNumero;
            }
        },
        setDatos() {
            let me = this;
            me.sendPedido = me.ObjectPedido
            //crear
            if (me.sendPedido.id_pedido == 0) {
                me.getInstituciones(me.asesorSelected.cedula)
                me.limpiar()
            }
            //editar
            else {
              me.getInstituciones(me.sendPedido.cedula_asesor)
              me.pedido = {
                  id_pedido: me.sendPedido.id_pedido,
                  estado: me.sendPedido.estado,
                  institucion: me.sendPedido.id_institucion,
                  asesor: me.sendPedido.responsable,
                  ruc: me.sendPedido.ruc,
                  direccionInstitucion: me.sendPedido.direccionInstitucion,
                  nivel: me.sendPedido.nivel,
                  tipo_descripcion: me.sendPedido.tipo_descripcion,
                  telefonoInstitucion: me.sendPedido.telefonoInstitucion,
                  periodo: me.sendPedido.periodo,
                  idperiodo: me.sendPedido.id_periodo,
                  tipo_venta: me.sendPedido.tipo_venta,
                  fecha_envio: me.sendPedido.fecha_envio,
                  fecha_entrega: me.sendPedido.fecha_entrega,
                  descuento: me.sendPedido.descuento,
                  contrato_generado: me.sendPedido.contrato_generado,
                  id_asesor: me.sendPedido.id_asesor,
                  facturacion_vee: me.sendPedido.facturacion_vee,
                  observacion: me.sendPedido.observacion,
              }
              //buscar ultimo pedido
              me.f_getUltimoPedido()
            }
        },
        f_getUltimoPedido(){
          let  me = this
          this.$http.get(this.$server_url + `metodosGetPedidos?getComisionAnteriores=1&id_institucion=${me.sendPedido.id_institucion}&id_pedido=${me.sendPedido.id_pedido}`)
          .then(res => {
              me.ObjectUltimoPedido = res.data
          })
        },
        getInstituciones(cedula) {
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url + 'get_instituciones_asesor/' + cedula)
                .then(res => {
                    me.arrayInstituciones  = res.data.filter(p => p.region_idregion == me.objectPeriodoSelect.region_idregion);
                    me.get_instituciones_asesorXId();
                    if (me.sendPedido.id_pedido == 0) {
                      // si no tiene permiso para ver fichero aprobado, no filtrar
                      if(me.permisoFichero == 0){
                        me.$vs.loading.close();
                        return
                      }
                     me.getVerificar_Aprobacion_Fichero();
                    }else{
                      me.$vs.loading.close();
                    }
                })
        },
        get_instituciones_asesorXId() {
            let me = this
            if (me.sendPedido.id_pedido == 0) {
                return
            }
            this.$http.get(this.$server_url + 'get_instituciones_asesorXId/' + me.sendPedido.id_institucion)
                .then(res => {
                    let data = res.data
                    if (data.length > 0) {
                        let datos = data[0]
                        //agrega datos a arrayInstituciones con el spread
                        me.arrayInstituciones = [...me.arrayInstituciones, datos]
                    }
                })
        },
        async getVerificar_Aprobacion_Fichero() {
            return new Promise((resolve, reject) => {
                const ids = this.arrayInstituciones.map(inst => inst.idInstitucion);
                const pidValue = localStorage.getItem('pid');

                let enviardata = {
                    action: 'Verificar_getVerificar_Aprobacion_Fichero',
                    idTodas_Institucion_Asesor: ids,
                    periodo_id: pidValue
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        this.$vs.loading.close();

                        if (response.data && response.data.length > 0) {
                            const aprobadoIds = response.data
                                .filter(r => r.punto_venta == 1 || r.existe_fichero_aprobado)
                                .map(r => Number(r.idInstitucion)); // Asegurarse de que son números

                            this.arrayInstituciones = this.arrayInstituciones.filter(inst =>
                                aprobadoIds.includes(Number(inst.idInstitucion)) // también convertir a número
                            );
                        }
                        resolve();
                    })
                    .catch(error => {
                        this.$vs.loading.close();
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject(error);
                    });
            });
        },
        getPuntosVenta() {
            let me = this
            this.$http.get(this.$server_url + 'Get_PuntosV')
                .then(res => {
                    me.arrayPuntosVenta = res.data
                })
        },
        guardarPedido() {
            let me = this
            if (me.sendPedido.estado == 2) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'No se puede modificar el pedido anulado',
                    time: 5000,
                })
                return false
            }
            if (me.pedido.ruc == "" || me.pedido.ruc == "null") {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'El ruc no puede quedar vacio',
                    time: 5000,
                })
                return false
            }
            if (me.pedido.descuento < 0 || me.pedido.descuento == "") {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'La comisión debe ser mayor a 0',
                    time: 5000,
                })
                return false;
            }

            if (me.userRoot || (me.sendPedido.permitir_editar_despues_contrato == 1 && me.sendPedido.ca_codigo_agrupado == null)) {

            } else {
                if (me.pedido.contrato_generado == null || me.pedido.contrato_generado == "null" || me.pedido.contrato_generado == "") {} else {
                    me.$vs.notify({
                        color: 'warning',
                        title: 'Mensaje',
                        text: 'El pedido ya tiene el contrato ' + me.pedido.contrato_generado + " No puede realizar cambios"
                    })
                    return false;
                }
            }

            if (me.pedido.nivel == null || me.pedido.nivel == "" || me.pedido.nivel == undefined) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'Seleccione un nivel por favor'
                })
                return false;
            }
            if (me.pedido.idperiodo == '' || me.pedido.tipo_venta == '' || me.pedido.fecha_envio == '' || me.pedido.fecha_entrega == '' || me.pedido.institucion == '' || me.pedido.direccionInstitucion == '' || me.pedido.ruc == '' || me.pedido.tipo_descripcion == '' || me.pedido.telefonoInstitucion == '') {
                me.$vs.notify({
                    text: 'Llene todos los campos antes de guardar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let formData = new FormData();
            formData.append('informacionPedido', 'yes');
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('tipo_venta', me.pedido.tipo_venta);
            formData.append('tipo_venta_descr', me.pedido.tipo_venta == 1 ? 'Venta directa' : 'Comisión o lista');
            formData.append('fecha_envio', me.pedido.fecha_envio);
            formData.append('fecha_entrega', me.pedido.fecha_entrega);
            formData.append('institucion', me.pedido.institucion);
            formData.append('periodo', me.pedido.idperiodo);
            formData.append('descuento', me.pedido.descuento);
            formData.append('id_asesor', me.pedido.id_asesor);
            formData.append('facturacion_vee', me.pedido.facturacion_vee);
            formData.append('observacion', me.pedido.observacion);
            //para actualizar la institucion
            formData.append('ruc', me.pedido.ruc);
            formData.append('direccionInstitucion', me.pedido.direccionInstitucion);
            formData.append('nivel', me.pedido.nivel);
            formData.append('tipo_descripcion', me.pedido.tipo_descripcion);
            formData.append('telefonoInstitucion', me.pedido.telefonoInstitucion);
            formData.append('id_group', me.usuario.id_group);
            //fin para actualizar la institucion
            me.$vs.loading();
            //axios.post(this.$data_url+'api/guardarPedido',formData)
            this.$http.post(this.$server_url + 'pedidos', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 8000
                        })
                        return
                    }
                    if (res.data.error) {
                        alert(res.data.error)
                        return
                    } else {
                        me.$vs.notify({
                            color: 'primary',
                            title: 'Mensaje',
                            text: 'Se guardo correctamente'
                        })
                        me.rechargePedido(res.data.pedido.id_pedido)

                    }
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        rechargePedido(id_pedido) {
            let me = this
            PedidosRepository.getPedidoXID(id_pedido).then(r => {
                this.$store.dispatch('setPedido', r.data[0]);
                this.setDatos();
            })
        },
        buscaPedidoGenerado(tr) {
            let me = this
            //limpiar
            me.pedido.ruc = ""
            me.pedido.direccionInstitucion = ""
            me.pedido.nivel = ""
            me.pedido.tipo_descripcion = ""
            me.pedido.telefonoInstitucion = ""
            me.pedidoInstituciondescripcion = ""
            if (me.pedido.institucion == null || me.pedido.institucion == "" || me.pedido.institucion == undefined) {
                me.$vs.notify({
                    text: 'Seleccione una institución por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            //proceso
            let setValores = me.arrayInstituciones.filter(p => p.idInstitucion == me.pedido.institucion)[0]
            me.pedido.ruc = setValores.ruc
            me.pedido.direccionInstitucion = setValores.direccionInstitucion
            me.pedido.nivel = setValores.nivel
            me.pedido.tipo_descripcion = setValores.tipo_descripcion
            me.pedidoInstituciondescripcion = setValores.tipo_descripcion
            me.pedido.telefonoInstitucion = setValores.telefonoInstitucion
            localStorage.setItem("institucion_selected_pedido", me.pedido.institucion)
            localStorage.setItem("id_asesor_pedido", me.pedido.id_asesor)
        },
        //METODOS PARA COMENTARIOS
        ver_comentarios() {
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url + 'get_comentarios_pedido/' + me.pedido.id_pedido)
                .then(res => {
                    me.comentarios = res.data
                    // me.cant_sms = res.data.length
                    me.$vs.loading.close();
                })
                .catch(err => {
                    me.$vs.loading.close();
                })
        },
        guardar_comentario() {
            let me = this
            let formData = new FormData();
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('comentario', me.input_comentario);
            formData.append('id_usuario', me.asesorSelected.idusuario);
            formData.append('id_group', me.asesorSelected.id_group)
            me.$vs.loading();
            this.$http.post(this.$server_url + 'guardar_comentario', formData)
                .then(res => {
                    me.input_comentario = ''
                    me.ver_comentarios()
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        limpiar() {
            let me = this;
            me.pedido = {
                id_pedido: 0,
                estado: 0,
                institucion: '',
                asesor: me.asesorSelected.nombres + " " + me.asesorSelected.apellidos,
                ruc: '',
                direccionInstitucion: '',
                nivel: '',
                tipo_descripcion: '',
                telefonoInstitucion: '',
                periodo: me.sendPedido.periodo,
                idperiodo: me.sendPedido.id_periodo,
                tipo_venta: '',
                fecha_envio: '',
                fecha_entrega: '',
                descuento: '',
                contrato_generado: '',
                id_asesor: me.asesorSelected.idusuario,
                facturacion_vee: (me.userFacturador || me.userAdminFacturador) ? 1 : 0,
                observacion: '',
            }
            me.pedidoInstituciondescripcion = '';
        },
        f_modal_cambiar_asesor(pedido) {
            let me = this;
            // console.log('f_modal_cambiar_asesor', pedido)
            me.modalAsesorCambio = true;
            // me.pedidoActualAsesor = [];
            // me.asesores = [];
            me.pedidoActualAsesor = pedido;
            me.okCambiaAsesor = false;
            me.getAsesores();
        },
        getAsesores() {
            let me = this
            this.$http.get(this.$server_url + 'get_asesor')
                .then(res => {
                    me.asesores = res.data;
                    // console.log('me.asesores', me.asesores)
                })
        },
        f_cancelar() {
            let me = this
            me.modalAsesorCambio = false;
        },
        f_change_asesor() {
            let me = this
            if (me.asesorActualizado.idusuario === me.pedidoActualAsesor.id_asesor) {
                me.$vs.notify({
                    text: 'Estás seleccionando el mismo asesor, no se puede realizar el cambio.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-icon-triangle'
                })
                return
            }
            me.okCambiaAsesor = true;
        },
        f_btn_aceptar_cambio_asesor() {
            let me = this;
            let FomrData1 = new FormData();
            FomrData1.append('id_pedido', me.pedidoActualAsesor.id_pedido);
            FomrData1.append('id_asesor', me.asesorActualizado.idusuario);
            this.$http.post(this.$server_url + 'change_asesor_en_pedido', FomrData1)
                .then(res => {
                    // console.log(res.data);
                    me.$vs.notify({
                        text: 'Asesor actualizado correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    // 🔄 Actualiza el objeto del pedido con el nuevo asesor
                    me.pedido.id_asesor = me.asesorActualizado.idusuario;
                    me.pedido.asesor = me.asesorActualizado.nombres;

                    me.okCambiaAsesor = false;
                    me.modalAsesorCambio = false;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    me.$vs.notify({
                        text: 'Error al actualizar el asesor.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                })
        }
    },
}
</script>

<style>
.label_inputs {
    font-size: 12px;
    color: rgb(143, 143, 143);
    margin-top: 4px;
    padding-left: 4px;
}
</style>
