<template>
<div class="vx-row">
    <div class="vx-col w-full">
        <vx-card fixed-height="true">
            <!-- Buscador -->
            <vs-row>
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <p>Ingrese una parte del documento a buscar</p>
                    <br>
                    <div class="vx-row flex" style="flex-wrap: wrap;">
                        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                            <vs-input
                                vs-w="7"
                                class="w-full"
                                @keyup.enter="getVentaDespachadasxParametro()"
                                icon-after="true"
                                style="margin: 0px 0px 20px 0px"
                                icon="search"
                                placeholder="Buscar documento..."
                                v-model="busquedaxcodigo"
                            />
                        </div>
                        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                            <vs-button color="warning" type="filled" style="margin-left: 10px" @click="getVentaDespachadasxParametro()" icon="search"></vs-button>
                        </div>
                        <div v-if="!contabilidad" class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 ">
                          <vs-checkbox v-model="buscarTodosPeriodos"color="primary">
                            Buscar en TODOS los períodos
                          </vs-checkbox>
                        </div>
                    </div>
                </vs-col>
            </vs-row>

            <!-- Tabla de resultados -->
            <vs-table v-if="Ventas && Ventas.length > 0" max-items="10" pagination search :data="Ventas" stripe>
                <template v-slot:header>
                    <vs-chip color="primary">Cantidad: <b>{{ Ventas.length }}</b></vs-chip>
                </template>

                <template v-slot:thead>
                    <vs-th width="220"># Documento</vs-th>
                    <vs-th>Información</vs-th>
                    <vs-th width="160">Detalles</vs-th>
                    <vs-th width="200">Estado</vs-th>
                    <vs-th width="210">Acciones</vs-th>
                </template>

                <template v-slot:default="{ data }">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">

                        <!-- Columna: Documento -->
                        <vs-td :data="tr.ven_codigo">
                            <div class="font-mono font-bold text-primary text-sm">{{ tr.ven_codigo }}</div>
                            <div v-if="tr.idtipodoc == 16 || tr.idtipodoc == 17" class="mt-1">
                                <span class="estado-badge" style="background:#EA5455;">
                                    {{ tr.idtipodoc == 16 ? 'Nota Crédito' : 'Nota Crédito Interna' }}
                                </span>
                            </div>
                            <div class="mt-1">
                                <span class="estado-badge" style="background:#046AE7;">
                                    {{ tr.ven_tipo_inst === 'V' || !tr.ven_tipo_inst ? 'Venta Directa' : 'Venta Por Lista' }}
                                </span>
                            </div>
                            <div class="mt-2 text-xs text-gray-600">
                                <div><b>Facturador:</b> {{ tr.responsable }}</div>
                                <div v-if="tr.ven_tipo_inst === 'V' || !tr.ven_tipo_inst"><b>Asesor:</b> {{ tr.asesor }}</div>
                                <div v-if="tr.ven_idproforma"><b>Pre-Proforma:</b> {{ tr.ven_idproforma }}</div>
                                <div><b>Empresa:</b> {{ tr.nombre }}</div>
                            </div>
                        </vs-td>

                        <!-- Columna: Información -->
                        <vs-td>
                            <div class="text-xs">
                                <div class="mb-1"><b>Cliente:</b> {{ tr.cliente || 'No disponible' }}</div>
                                <div class="mb-1"><b>CI/RUC:</b> {{ tr.cedula }}</div>
                                <div class="mb-1"><b>Despacho:</b> {{ tr.nombreInstitucion }}</div>
                                <div class="mb-1"><b>Período:</b> {{ tr.periodoescolar }}</div>
                                <div class="mb-1"><b>Fecha:</b> {{ tr.ven_fecha }}</div>
                            </div>
                            <!-- Intercambio -->
                            <div v-if="tr.doc_intercambio" class="mt-2 p-2 bg-red-50 rounded text-xs border-l-2 border-red-400">
                                <b class="text-danger">{{ tr.idtipodoc == 1 ? 'Prefactura movida' : 'Nota movida' }}:</b>
                                <p>{{ tr.doc_intercambio }}</p>
                                <p><b>Responsable:</b> {{ tr.user_intercambio }}</p>
                                <p><b>Fecha:</b> {{ tr.fecha_intercambio }}</p>
                                <p v-if="tr.observacion_intercambio"><b>Obs.:</b> {{ tr.observacion_intercambio }}</p>
                            </div>
                            <div v-if="tr.observacionRegresarAPendiente" class="mt-2 p-2 bg-yellow-50 rounded text-xs border-l-2 border-yellow-400">
                                <p class="font-bold text-danger">Observación de despacho:</p>
                                <p>{{ tr.observacionRegresarAPendiente }}</p>
                            </div>
                        </vs-td>

                        <!-- Columna: Detalles -->
                        <vs-td>
                            <div class="text-xs">
                                <div class="mb-2">
                                    <span class="estado-badge" style="background:#6b7280;">
                                        {{ tr.cantidad_despacho }} libros
                                    </span>
                                </div>
                                <div class="mb-2">
                                    <span v-if="tr.impresion === 0" class="estado-badge" style="background: Teal;">No Impresa</span>
                                    <span v-else-if="tr.impresion === 1" class="estado-badge" style="background: DodgerBlue;">Impresa</span>
                                </div>
                                <div v-if="tr.idPuntoventa" class="text-xs text-gray-500">
                                    <b>Grupo:</b> {{ tr.idPuntoventa }}
                                </div>
                                <!-- Pedido Perseo -->
                                <div v-if="tr.pedido_codigo" class="mt-2 p-1 bg-gray-100 rounded text-xs">
                                    <span class="text-gray-500 font-bold">Datos Perseo:</span><br>
                                    <span class="text-gray-500 font-bold">Estado:</span>
                                    <span v-if="tr.estadoPerseo === 1 && tr.est_ven_codigo !== 3" class="estado-badge ml-1" style="background:#28C76F;">Enviado</span>
                                    <span v-if="tr.estadoPerseo === 1 && tr.est_ven_codigo === 3" class="estado-badge ml-1" style="background:#EA5455;">Envio y no válido</span> <br/>
                                    <span v-if="tr.pedido_codigo" class="text-gray-500 font-bold">Pedido:</span><br>
                                    <span v-if="tr.pedido_codigo" class="font-mono ml-1">{{ tr.pedido_codigo }}</span><br>
                                    <span v-if="tr.factura_perseo" class="text-gray-500 font-bold">Factura:</span><br>
                                    <span v-if="tr.factura_perseo" class="font-mono ml-1">{{ tr.factura_perseo }}</span><br>
                                    <span v-if="tr.factura_perseo" class="text-gray-500 font-bold">Nota de credito:</span><br>
                                    <span v-if="tr.factura_perseo" class="font-mono ml-1">{{ tr.nota_credito }}</span>
                                </div>
                            </div>
                        </vs-td>

                        <!-- Columna: Estado -->
                        <vs-td>
                            <div class="text-xs">
                                <div v-if="tr.est_ven_codigo === 1" class="estado-badge mb-1" style="background:#23BF23;">Despachado</div>
                                <div v-if="tr.est_ven_codigo === 2" class="estado-badge mb-1" style="background:DarkOrange;">Pendiente de despacho</div>
                                <div v-if="tr.est_ven_codigo === 3" class="estado-badge mb-1" style="background:#ff0000;">Anulado</div>
                                <div v-if="tr.est_ven_codigo === 4" class="estado-badge mb-1" style="background:#00BFBF;">En Proceso de Despach</div>

                                <!-- Info anulación -->
                                <div v-if="tr.est_ven_codigo === 3 && tr.usuario_anulado" class="mt-2 p-1 bg-red-50 rounded border-l-2 border-red-400">
                                    <div><b>Anulado por:</b> {{ tr.usuario_anulado }}</div>
                                    <div v-if="tr.fecha_anulacion"><b>Fecha:</b> {{ tr.fecha_anulacion }}</div>
                                    <vs-button
                                        v-if="tr.observacionAnulacion"
                                        color="danger"
                                        size="small"
                                        type="border"
                                        class="mt-1"
                                        @click="mostrarMotivoAnulacion(tr.observacionAnulacion)"
                                    >Ver motivo</vs-button>
                                </div>
                            </div>
                        </vs-td>

                        <!-- Columna: Acciones -->
                        <vs-td :data="tr.ven_codigo">
                            <div class="acciones-col">
                                <!-- Ver PDF -->
                                <vs-button
                                    color="primary"
                                    size="small"
                                    type="border"
                                    @click="verPDF(tr)"
                                >
                                    <i class="far fa-file-pdf mr-1"></i> Ver PDF
                                </vs-button>

                                <!-- Despachar (solo root, solo estado 2) -->
                                <vs-button
                                    v-if="userRoot && tr.est_ven_codigo === 2"
                                    color="#1eaed1"
                                    size="small"
                                    type="border"
                                    @click="ObjectedSelected = tr; popupDespachar = true;"
                                >
                                    <i class="fas fa-truck mr-1"></i> Despachar
                                </vs-button>

                                <!-- Regresar a Pendiente (solo root) -->
                                <vs-button
                                    v-if="userRoot && (tr.est_ven_codigo === 1 || tr.est_ven_codigo === 10 || tr.est_ven_codigo === 11 || tr.est_ven_codigo === 12)"
                                    color="warning"
                                    size="small"
                                    type="border"
                                    @click="ObjectedSelected = tr; popupRegresarAPendiente = true;"
                                >
                                    <i class="fas fa-undo mr-1"></i> Regresar
                                </vs-button>

                                <!-- Anular -->
                                <vs-button
                                    v-if="puedeAnularVenta(tr)"
                                    color="danger"
                                    size="small"
                                    type="border"
                                    @click="prepararAnular(tr)"
                                >
                                    <i class="fas fa-ban mr-1"></i> Anular
                                </vs-button>

                                <!-- Enviar a Perseo -->
                                <vs-button
                                    v-if="(tr.est_ven_codigo === 2 && tr.estadoPerseo !== 1 && (tr.idtipodoc == 1 || tr.idtipodoc == 2)) || userRoot"
                                    color="warning"
                                    size="small"
                                    type="filled"
                                    @click="enviarAPerseo(tr)"
                                >
                                    <i class="fas fa-share mr-1"></i> Enviar a Perseo
                                </vs-button>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>

            <!-- Sin resultados -->
            <div v-if="!Ventas || Ventas.length === 0" class="text-center py-10 text-gray-400">
                <i class="fas fa-search" style="font-size: 40px;"></i>
                <p class="mt-3">Realiza una búsqueda para ver documentos</p>
            </div>

            <!-- Popup PDF con ReporteVentasPDF -->
            <vs-popup
                fullscreen
                :title="ventaSeleccionada ? `Documento ${ventaSeleccionada.ven_codigo}` : 'PDF'"
                :active.sync="popupPDF"
            >
                <ReporteVentasPDF
                    v-if="popupPDF && ventaSeleccionada"
                    :venta="ventaSeleccionada"
                    @estadoCambiado="getVentaDespachadasxParametro"
                />
            </vs-popup>

            <!-- Popup Despachar -->
            <vs-popup title="Confirmar Despacho" :active.sync="popupDespachar">
                <div v-if="popupDespachar" class="text-center p-4">
                    <p class="text-xl mb-4">¿Está seguro de despachar la venta <b>{{ ObjectedSelected.ven_codigo }}</b>?</p>
                    <div class="flex justify-center gap-3 mt-4">
                        <vs-button @click="f_despachar()" type="relief">Aceptar</vs-button>
                        <vs-button @click="popupDespachar = false" color="warning" type="relief">Cancelar</vs-button>
                    </div>
                </div>
            </vs-popup>

            <!-- Popup Regresar a Pendiente -->
            <vs-popup title="Regresar a Pendiente" :active.sync="popupRegresarAPendiente">
                <div v-if="popupRegresarAPendiente">
                    <p class="text-center mb-3">Regresar a pendiente: <b>{{ ObjectedSelected.ven_codigo }}</b></p>
                    <RegresarAPendiente :datadocumento="ObjectedSelected" @change="changePendiente" />
                </div>
            </vs-popup>

            <!-- Popup Anular -->
            <vs-popup title="Anular Documento" :active.sync="popupAnular">
                <div v-if="popupAnular && ventaAnular" class="p-4">
                    <div class="text-center mb-4">
                        <div style="width:60px;height:60px;background:linear-gradient(135deg,#ff6b6b,#ee5a6f);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                            <i class="fas fa-exclamation-triangle" style="color:white;font-size:28px;"></i>
                        </div>
                        <h4 class="font-bold text-xl">Anular Documento de Venta</h4>
                    </div>
                    <div class="p-3 rounded mb-4" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
                        <div class="flex justify-between mb-2">
                            <span class="text-sm opacity-90">Código:</span>
                            <span class="font-bold">{{ ventaAnular.ven_codigo }}</span>
                        </div>
                        <div class="flex justify-between mb-2" v-if="ventaAnular.pedido_codigo">
                            <span class="text-sm opacity-90">Pedido Perseo:</span>
                            <span class="font-mono font-bold">{{ ventaAnular.pedido_codigo }}</span>
                        </div>
                    </div>
                    <div class="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-4 text-sm text-yellow-800">
                        <i class="fas fa-info-circle mr-2"></i>
                        Esta acción cambiará el estado del documento a <b>Anulado</b>.
                        <span v-if="ventaAnular.estadoPerseo === 1">El pedido de Perseo quedará marcado como no válido.</span>
                    </div>
                    <div class="mb-4">
                        <label class="block font-semibold text-sm mb-2">
                            <i class="fas fa-comment-alt mr-1 text-primary"></i>
                            Motivo de Anulación (Obligatorio)
                        </label>
                        <textarea
                            v-model="observacionAnulacion"
                            class="w-full border-2 border-gray-200 rounded p-3 text-sm"
                            placeholder="Describa el motivo por el cual está anulando este documento..."
                            rows="4"
                            style="resize:vertical;"
                        ></textarea>
                    </div>
                    <div class="flex justify-center gap-3">
                        <vs-button color="danger" type="filled" @click="confirmarAnular()">
                            <i class="fas fa-ban mr-2"></i> Confirmar Anulación
                        </vs-button>
                        <vs-button color="dark" type="border" @click="popupAnular = false">
                            <i class="fas fa-times mr-2"></i> Cancelar
                        </vs-button>
                    </div>
                </div>
            </vs-popup>

            <!-- Popup Ver Motivo Anulación -->
            <vs-popup title="Motivo de Anulación" :active.sync="popupMotivoAnulacion">
                <div class="p-4">
                    <div class="p-3 border-l-4 border-red-400 rounded bg-white text-sm text-gray-700" style="white-space:pre-wrap;">
                        {{ motivoAnulacionSeleccionado }}
                    </div>
                    <div class="flex justify-end mt-4">
                        <vs-button color="danger" type="filled" @click="popupMotivoAnulacion = false">Cerrar</vs-button>
                    </div>
                </div>
            </vs-popup>
        </vx-card>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
const ReporteVentasPDF = () => import('@/views/pedidos/facturacion/imprimir/ReporteVentasPDF.vue');
const RegresarAPendiente = () => import('@/views/bodega/codigos/components/Regresar_A_Pendiente.vue');

export default {
    components: {
        ReporteVentasPDF,
        RegresarAPendiente,
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {};
            }
        },
        contabilidad: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState(['auth', 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    data() {
        return {
            Ventas: [],
            busquedaxcodigo: '',
            usuario: null,
            buscarTodosPeriodos: this.contabilidad == true ? true : false,

            // PDF
            popupPDF: false,
            ventaSeleccionada: null,

            // Despachar
            popupDespachar: false,
            ObjectedSelected: '',

            // Regresar a pendiente
            popupRegresarAPendiente: false,

            // Anular
            popupAnular: false,
            ventaAnular: null,
            observacionAnulacion: '',

            // Motivo anulación
            popupMotivoAnulacion: false,
            motivoAnulacionSeleccionado: '',
        };
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        // ─── Buscar ───────────────────────────────────────────────
        getVentaDespachadasxParametro() {
            let me = this;
            me.Ventas = [];
            if (me.busquedaxcodigo.length < 4) {
                me.$vs.notify({
                    text: 'Mínimo 4 caracteres de búsqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                });
                return;
            }
            let id = me.buscarTodosPeriodos ? '' : (me.periodoSelect ? me.periodoSelect.idperiodoescolar : '');
            let url = me.$server_url + 'GetVentasDespachadasxParametro?opcion=' + (me.buscarTodosPeriodos ? 2 : 1) + '&parte_documento=' + me.busquedaxcodigo;
            if (id) {
                url += '&periodo=' + id;
            }
            me.$vs.loading();
            me.$http.get(url)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.Ventas = res.data || [];
                    if (me.Ventas.length === 0) {
                        me.$vs.notify({ text: 'No hay ventas para esta búsqueda', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.Ventas = [];
                    if (error.response && error.response.status !== 404) {
                        console.error(error);
                    }
                    me.$vs.notify({ text: 'No hay ventas para esta búsqueda', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                });
        },

        // ─── Ver PDF ──────────────────────────────────────────────
        verPDF(tr) {
            // Mapear campos del endpoint viejo al formato que espera ReporteVentasPDF
            this.ventaSeleccionada = {
                ven_codigo: tr.ven_codigo,
                id_empresa: tr.id_empresa,
                idtipodoc: tr.idtipodoc,
                est_ven_codigo: tr.est_ven_codigo,
                ven_tipo_inst: tr.ven_tipo_inst,
                ven_fecha: tr.ven_fecha,
                ven_observacion: tr.ven_observacion,
                ven_transporte: tr.ven_transporte || 0,
                ven_desc_por: tr.ven_desc_por,
                pedido_codigo: tr.pedido_codigo,
                prof_id: tr.ven_idproforma || tr.prof_id,
                creado_por: tr.responsable,
                nombre_facturador: tr.responsable,
                cliente_nombre: tr.cliente,
                cliente_email: tr.email || '',
                cliente_telefono: tr.telefono || '',
                institucion_nombre: tr.nombreInstitucion,
                institucion_ruc: tr.cedula,
                institucion_direccion: tr.direccion || '',
                institucion_telefono: tr.telefonoInst || '',
                cedula: tr.cedula,
                asesor_guia: tr.asesor || '',
                id_pedido_guia: tr.id_pedido_guia || null,
            };
            this.popupPDF = true;
        },

        // ─── Permisos ─────────────────────────────────────────────
        puedeAnularVenta(tr) {
            if (!tr) return false;
            if (tr.est_ven_codigo === 3) return false;
            if ((tr.est_ven_codigo === 4 || tr.est_ven_codigo === 1) && !this.userRoot) return false;
            return true;
        },

        // ─── Anular ───────────────────────────────────────────────
        prepararAnular(tr) {
            if ((tr.est_ven_codigo === 4 || tr.est_ven_codigo === 1) && !this.userRoot) {
                this.$vs.notify({ text: 'No puede anular documentos en proceso o despachados si no es root', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            this.ventaAnular = tr;
            this.observacionAnulacion = '';
            this.popupAnular = true;
        },

        confirmarAnular() {
            let me = this;
            if (!me.observacionAnulacion || me.observacionAnulacion.trim() === '') {
                me.$vs.notify({ text: 'Debe escribir un motivo de anulación', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle' });
                return;
            }
            me.$vs.loading();
            const payload = {
                ven_codigo: me.ventaAnular.ven_codigo,
                id_empresa: me.ventaAnular.id_empresa,
                id_usuario: me.usuario.idusuario,
                observacionAnulacion: me.observacionAnulacion,
            };
            me.$http.post(me.$server_url + 'api/perseo/ventas/anular', payload)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupAnular = false;
                    me.observacionAnulacion = '';
                    if (res.data.status == 200) {
                        me.$vs.notify({ title: 'Éxito', text: res.data.message || 'Venta anulada exitosamente', color: 'success', iconPack: 'feather', icon: 'icon-check' });
                        me.getVentaDespachadasxParametro();
                    } else {
                        me.$vs.notify({ title: 'Error', text: res.data.message || 'No se pudo anular', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle' });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error(err);
                    me.$vs.notify({ title: 'Error', text: 'Error al anular el documento', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle' });
                });
        },

        mostrarMotivoAnulacion(motivo) {
            this.motivoAnulacionSeleccionado = motivo;
            this.popupMotivoAnulacion = true;
        },

        // ─── Despachar ────────────────────────────────────────────
        f_despachar() {
            let me = this;
            me.$vs.loading();
            const datos = {
                ven_codigo: me.ObjectedSelected.ven_codigo,
                est_ven_codigo: 1,
                id_empresa: me.ObjectedSelected.id_empresa,
                user_despacha: me.usuario.idusuario,
            };
            me.$http.post(me.$server_url + 'Desactivar_venta', datos)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupDespachar = false;
                    if (res.data.status == 0) {
                        me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle', time: 3000 });
                    } else {
                        me.$vs.notify({ text: 'Despacho exitoso', color: 'success', iconPack: 'feather', icon: 'icon-check' });
                    }
                    me.getVentaDespachadasxParametro();
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.error(error);
                    me.$vs.notify({ text: 'No se pudo despachar', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                });
        },

        // ─── Regresar a Pendiente ─────────────────────────────────
        changePendiente(e) {
            if (e.verificacionemitsaveandedit == 1) {
                this.popupRegresarAPendiente = false;
                this.getVentaDespachadasxParametro();
            } else if (e.verificacionemitsaveandedit == 2) {
                this.popupRegresarAPendiente = false;
            }
        },

        // ─── Enviar a Perseo ──────────────────────────────────────
        enviarAPerseo(tr) {
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Enviar a Perseo',
                text: '¿Está seguro de enviar la venta ' + tr.ven_codigo + ' a Perseo?',
                accept: function () {
                    me.ejecutarEnvioPerseo(tr);
                }
            });
        },

        ejecutarEnvioPerseo(tr) {
            let me = this;
            me.$vs.loading({ text: 'Enviando a Perseo...' });
            me.$http.post(me.$server_url + 'api/perseo/ventas/enviar-perseo', {
                ven_codigo: tr.ven_codigo,
                id_empresa: tr.id_empresa,
            })
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 200) {
                        me.$vs.notify({ title: 'Éxito', text: res.data.message || 'Venta enviada a Perseo exitosamente', color: 'success', iconPack: 'feather', icon: 'icon-check', time: 6000 });
                        me.getVentaDespachadasxParametro();
                    } else {
                        me.$vs.notify({ title: 'Error', text: res.data.message || 'No se pudo enviar a Perseo', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle', time: 8000 });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    const msg = (err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Error al enviar a Perseo';
                    me.$vs.notify({ title: 'Error', text: msg, color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle', time: 10000 });
                });
        },
    },
};
</script>

<style scoped>
.acciones-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 180px;
}

.estado-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    color: white;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
}
</style>
