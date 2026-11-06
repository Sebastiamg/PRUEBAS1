<template>
    <div>
        <!-- Botón imprimir - solo mostrar si no viene desde ReporteVentasPDF o GuiasDocumentosVenta -->
        <div align="center" class="mb-3 no-print">
            <vs-button @click="handleImprimir" icon="print" color="primary" >
                Imprimir
            </vs-button>
        </div>
        <!-- Contenido a imprimir -->
        <vx-card id="seccionImprimir2" style="padding: 20px;">
            <!-- ENCABEZADO -->
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="width: 15%; text-align: left; padding: 10px; vertical-align: top;">
                        <img class="img-responsive mb-2 ml-1" v-bind:src="datosProp" style="display: flex; width: 100px;">
                    </td>
                    <td style="width: 60%; text-align: center; vertical-align: top; padding-top: 10px;">
                        <p style="font-weight: bold; font-size: 18px; margin: 0;">PROMOCIÓN DE VENTAS</p>
                        <p style="font-weight: bold; font-size: 18px; margin: 5px 0 0 0;">ACTA DE ENTREGA</p>
                        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 4px;">
                            <p style="font-weight: bold; font-size: 14px; margin: 0;">{{ venta.ven_codigo }}</p>
                            <div class="vx-row" v-if="venta.ven_codigo" style="margin-top: -4px;">
                                <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-3" style="padding-top: 0;">
                                    <barcodeReutilizableVue
                                        :barcodeValue="venta.ven_codigo"
                                        :width="0.6"
                                        :height="20"
                                        :barcodeId="'barcode-factura-guias'"
                                    />
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="width: 25%; text-align: center; vertical-align: top; padding: 66px 12px 0 5px;" v-if="venta.pedido_codigo">
                        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 0;">
                            <b style="font-size: 9px;">{{ venta.pedido_codigo }}</b>
                        </div>
                        <div class="vx-row" style="justify-content: center; margin-top: -2px;" v-if="venta.pedido_codigo">
                            <barcodeReutilizableVue
                                :barcodeValue="venta.pedido_codigo"
                                :width="0.7"
                                :height="20"
                                :barcodeId="'barcode-pedido-guias'"
                            />
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="font-size: 14px; text-align: left; padding-top: 10px;">
                        Quito, {{ mesd }}, {{ day }} de {{ mes }} del {{ year }}
                    </td>
                </tr>
            </table>

            <br>

            <!-- DATOS DEL CLIENTE -->
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">CLIENTE:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.cliente_nombre }}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">RUC / CI:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.ruc_cliente }}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">CORREO:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.cliente_email }}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">RESPONSABLE:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.facturador_nombre }}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">ASESOR:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.asesor }}</td>
                </tr>
                <!-- <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">PERÍODO:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.periodoescolar }}</td>
                </tr> -->
                <!-- <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">FECHA:</td>
                    <td style="width: 70%; text-align: left;">{{ venta.ven_fecha }}</td>
                </tr> -->
            </table>

            <br>

            <p style="font-size: 14px; text-align: justify;">
                Con esta fecha, se procede a la suscripción de la presente Acta de Entrega - Recepción de los productos que se otorgan en calidad de <b>OBSEQUIOS SIN COSTO</b>, como parte de la PROMOCIÓN DE VENTAS.
            </p>

            <br>

            <!-- TABLA DE DETALLE -->
            <div align="center">
                <table class="tabla2 mi-clase-de-tabla" align="center" style="border-collapse: collapse; font-size: 14px; width: 90%;">
                    <thead>
                        <tr>
                            <td width="200" style="text-align: center; border: 1px solid gray; padding: 6px;"><b>Código</b></td>
                            <td width="120" style="text-align: center; border: 1px solid gray; padding: 6px;"><b>Cantidad</b></td>
                            <td width="500" style="text-align: center; border: 1px solid gray; padding: 6px;"><b>Descripción</b></td>
                            <td v-if="!AdminBodega && !userBodegaNormal" width="150" style="text-align: center; border: 1px solid gray; padding: 6px;"><b>P. Unitario</b></td>
                            <td v-if="!AdminBodega && !userBodegaNormal" width="150" style="text-align: center; border: 1px solid gray; padding: 6px;"><b>Subtotal</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(det, key) in detalles" :key="key">
                            <td style="text-align: center; border: 1px solid gray; padding: 5px;">
                                {{ det.pro_codigo }}
                            </td>
                            <td style="text-align: center; border: 1px solid gray; padding: 5px;">
                                {{ det.det_ven_cantidad }}
                            </td>
                            <td style="text-align: left; border: 1px solid gray; padding: 5px;">
                                {{ det.nombre_producto || det.pro_codigo }}
                            </td>
                            <td v-if="!AdminBodega && !userBodegaNormal" style="text-align: center; border: 1px solid gray; padding: 5px;">
                                ${{ det.det_ven_valor_u }}
                            </td>
                            <td v-if="!AdminBodega && !userBodegaNormal" style="text-align: center; border: 1px solid gray; padding: 5px;">
                                ${{ (det.det_ven_cantidad * det.det_ven_valor_u).toFixed(2) }}
                            </td>
                        </tr>
                        <!-- Fila de total de libros para usuarios de bodega -->
                        <tr v-if="detalles.length > 0 && (AdminBodega || userBodegaNormal)">
                            <td style="text-align: center; border: 1px solid gray; padding: 5px; font-weight: bold; background-color: #f0f0f0;">
                                TOTAL
                            </td>
                            <td style="text-align: center; border: 1px solid gray; padding: 5px; font-weight: bold; background-color: #f0f0f0;">
                                {{ totalLibros }}
                            </td>
                            <td style="text-align: left; border: 1px solid gray; padding: 5px; background-color: #f0f0f0;">
                            </td>
                        </tr>
                        <!-- Fila de totales para usuarios no bodega -->
                        <tr v-if="detalles.length > 0 && !AdminBodega && !userBodegaNormal">
                            <td colspan="4" style="text-align: right; border: 1px solid gray; padding: 5px; font-weight: bold;">SUB TOTAL:</td>
                            <td style="text-align: center; border: 1px solid gray; padding: 5px; font-weight: bold;">
                                ${{ venta.ven_subtotal }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <br>

            <!-- RESUMEN -->
            <table style="width: 50%; border-collapse: collapse; font-size: 14px; margin-left: auto;" v-if="!userAsesor && !AdminBodega && !userBodegaNormal">
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 3px;">Total ítems:</td>
                    <td style="text-align: right; padding: 3px;">{{ venta.total_items }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 3px;">Total libros:</td>
                    <td style="text-align: right; padding: 3px;">{{ venta.total_libros }}</td>
                </tr>
                <tr v-if="venta.ven_desc_por > 0">
                    <td style="font-weight: bold; text-align: left; padding: 3px;">Descuento:</td>
                    <td style="text-align: right; padding: 3px;">{{ venta.ven_desc_por }}%</td>
                </tr>
                <tr>
                    <td style="font-weight: bold; text-align: left; padding: 3px; border-top: 2px solid #333;">TOTAL:</td>
                    <td style="text-align: right; padding: 3px; border-top: 2px solid #333; font-weight: bold;">
                        ${{ venta.ven_valor }}
                    </td>
                </tr>
            </table>

            <br><br>

            <!-- FIRMAS ANTERIORES - COMENTADO
            <table style="width: 100%; border-collapse: collapse; margin-top: 30px; text-align: center;" v-if="!userAsesor">
                <tr>
                    <td style="width: 50%; font-weight: bold;">ENTREGUÉ CONFORME</td>
                    <td style="width: 50%; font-weight: bold;">RECIBÍ CONFORME</td>
                </tr>
            </table>
            <table style="width: 100%; border-collapse: collapse; margin-top: 110px; text-align: center;" v-if="!userAsesor">
                <tr>
                    <td style="width: 50%; font-weight: bold;">PROLIPA CIA. LTDA</td>
                    <td style="width: 50%;">
                        <p>{{ venta.asesor ? venta.asesor.toUpperCase() : '' }}</p>
                        <p style="font-weight: bold;">VENDEDOR</p>
                    </td>
                </tr>
            </table>
            -->

            <div style="font-size: 10px; margin-top: 20px; text-align: left; color: #666;">
                <p>
                  <b>Observación Asesor:</b>
                  {{ venta.observacion_pedido && venta.observacion_pedido !== 'null' && venta.observacion_pedido.trim() !== ''
                    ? venta.observacion_pedido
                    : 'No hay observaciones' }}
                  </p>
                <p><b>Observación facturador:</b> {{ venta.ven_observacion || 'No hay observaciones' }}</p>
                <p><b>Por:</b> {{ venta.facturador_nombre }}</p>
            </div>

            <br><br>

            <!-- FIRMAS -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 80px; text-align: center;">
                <tr>
                    <td style="width: 50%; padding: 10px;">
                        <div style="border-top: 2px solid #333; display: inline-block; padding-top: 5px; min-width: 200px;">
                            <b>FIRMA CLIENTE</b>
                        </div>
                    </td>
                    <td style="width: 50%; padding: 10px;">
                        <div style="border-top: 2px solid #333; display: inline-block; padding-top: 5px; min-width: 200px;">
                            <b>FIRMA AUTORIZADA</b>
                        </div>
                    </td>
                </tr>
            </table>

        </vx-card>
    </div>
</template>

<script>
import {
    mapState
} from "vuex";
import moment from "moment";
import imprimirMixin from "@/mixins/Pedidosmix";
const barcodeReutilizableVue = () => import('@/views/pedidos2/pedidos/proforma/barcodeReutilizable.vue');

export default {
    mixins: [imprimirMixin],
    components: {
        barcodeReutilizableVue,
    },
    props: {
        objectedDocumentoVenta: {
            type: Object,
            default: () => ({})
        },
        modulo_despachos:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
            venta: {},
            detalles: [],
            day: '',
            mes: '',
            mesd: '',
            year: '',
            nombrearchivo: '',
            datosProp: '',
        };
    },
    created() {
        moment.locale('es');
        // Fecha actual para el documento
        this.day  = moment().format('DD');
        this.mes  = moment().format('MMMM');
        this.mesd = moment().format('dddd');
        this.year = moment().format('YYYY');
    },
    mounted() {
        this.cargarVenta();
    },
    computed: {
        ...mapState(['userRoot','userAsesor', 'groupFacturador','AdminBodega','userBodegaNormal']),
        totalLibros() {
            return this.detalles.reduce((sum, det) => sum + parseInt(det.det_ven_cantidad || 0), 0);
        }
    },
    methods: {
        async empresa(a) {
            await this.$http.get(this.$server_url + 'GetVuser?id=' + a)
                .then(res => {
                    this.datosProp = res.data;
                    this.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
        cargarVenta() {
            let me = this;
            if (!me.objectedDocumentoVenta.id_pedido_guia) return;
            me.$vs.loading();
            me.$http.get(me.$server_url + 'guias?listadoDocumentoVentaGuias=1&id_pedido=' + me.objectedDocumentoVenta.id_pedido_guia)
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        me.venta = res.data.find(v => v.ven_codigo === me.objectedDocumentoVenta.ven_codigo) || {};
                        me.nombrearchivo = (me.venta.ven_codigo || 'documento') + '.pdf';
                        // Cargar empresa y detalles
                        me.empresa(me.venta.id_empresa);
                        me.cargarDetalleVenta(me.venta.ven_codigo, me.venta.id_empresa);
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    console.error(err);
                    me.$vs.notify({
                        text: 'Error al cargar el documento de venta',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                });
        },
        cargarDetalleVenta(ven_codigo, id_empresa) {
            let me = this;
            me.$vs.loading();
            var url = `guias?CargarDocumentosDetallesGuias=1&ven_codigo=${ven_codigo}&id_empresa=${id_empresa}`;
            me.$http.get(me.$server_url + url)
                .then((res) => {
                    me.$vs.loading.close();
                    me.detalles = res.data;
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    console.error(err);
                    me.$vs.notify({
                        text: 'Error al cargar el detalle del documento',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                });
        },
        handleImprimir() {
           if(this.modulo_despachos == 0){
              this.m_imprimirTodos('12px', this.venta.ven_codigo);
           }else{
            if(this.AdminBodega || this.userBodegaNormal){
                // Si está en estado Pendiente (2), cambiar a En Proceso (4) antes de imprimir
                if (this.venta.est_ven_codigo == 2) {
                    this.cambiarAEnProceso();
                } else {
                    this.m_imprimirTodos('12px', this.venta.ven_codigo);
                }
            }else{
                // Usuarios que no son de bodega solo pueden imprimir sin cambiar estado
                this.m_imprimirTodos('12px', this.venta.ven_codigo);
            } 
           }
        },
        cambiarAEnProceso() {
            let me = this;
            me.$vs.loading();

            const datos = {
                ven_codigo: me.venta.ven_codigo,
                empresa: me.venta.id_empresa,
                usuario_id: JSON.parse(localStorage.getItem('usuario')).idusuario
            };

            this.$http.post(this.$server_url + 'api/perseo/ventas/marcar-impreso', datos)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data && res.data.status == 0) {
                        me.$f_notificacion(res.data.message ? res.data.message : 'No se pudo cambiar a En proceso', 'danger', 'icon-x');
                        return;
                    }
                    if (res.data && res.data.status == 3) {
                        me.$f_notificacion(res.data.message ? res.data.message : 'No se pudo cambiar a En proceso', 'warning', 'icon-x');
                    }

                    // Actualizar el estado local
                    me.venta.est_ven_codigo = 4;

                    me.$f_notificacion('Estado cambiado a En Proceso exitosamente', 'success', 'icon-check', 3000);

                    // Emitir evento para recargar el listado en el componente padre
                    me.$emit('estadoCambiado');
                    me.m_imprimirTodos('12px', me.venta.ven_codigo);
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    let mensaje = 'Error al cambiar a En proceso';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }
                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
    }
};
</script>

<style scoped>
.tabla2 {
    table-layout: auto;
    border-collapse: collapse;
    margin: 20px auto;
}

.tabla2 td {
    padding: 5px;
    box-sizing: border-box;
}

@media print {
    .mi-clase-de-tabla td {
        page-break-before: always;
    }
}
</style>
