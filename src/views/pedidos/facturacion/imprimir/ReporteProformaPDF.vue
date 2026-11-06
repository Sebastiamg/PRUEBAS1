<template>
    <div>
        <!-- Botones de acción -->
        <div align="center" class="no-print mb-4">
            <vs-button v-if="AdminBodega" @click="imprimir();m_imprimirTodos('12px',Venta.ven_codigo)" icon="print" color="primary" v-show="Venta.est_ven_codigo == 3">
                Imprimir (Documento Anulado)
            </vs-button>
            <vs-button v-else @click="m_imprimirTodos('12px',Venta.ven_codigo)" icon="print" color="success" v-show="Venta.est_ven_codigo != 3">
                Imprimir
            </vs-button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="loading-spinner mb-4">
                <div class="spinner"></div>
            </div>
            <p class="text-gray-600 text-lg">Cargando detalles del documento...</p>
        </div>

        <!-- Contenido del PDF -->
        <div v-else id="seccionImprimir2" class="contenido-impresion">
            <!-- TIPO DOCUMENTO 1: Pre Factura -->
            <div v-if="Venta.idtipodoc == 1" style="width: 100%;">
                <vx-card style="width: 100%; padding: 8px; box-sizing: border-box;">
                    <!-- Título de la empresa -->
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 12px;">{{nombreEmpresaActual}}</p>

                    <!-- Información de la venta -->
                    <table style="width: 100%; font-size: 10px;">
                        <thead>
                            <tr>
                                <!-- <td style="text-align: left; vertical-align: middle; padding: 5px;">
                                    <span v-if="Venta.id_empresa == 3 || Venta.id_empresa == 4">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 70px;">
                                    </span>
                                    <span v-if="Venta.id_empresa == 1 || Venta.id_empresa == 5">
                                        <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 100px;">
                                    </span>
                                </td> -->

                                <td colspan="5" style="text-align: center; vertical-align: middle; padding: 5px;">
                                    <div style="display: flex; flex-direction: column; align-items: center;">
                                        <b style="font-size: 11px;">COMPROBANTE DE TRANSACCIÓN: {{Venta.ven_codigo}}</b>
                                        <span v-if="Venta.ven_tipo_inst=='V'" style="margin-top: 4px; font-size: 9px;">Directa</span>
                                        <span v-else style="margin-top: 4px; font-size: 9px;">Por Lista</span>
                                    </div>
                                    <div class="vx-row" v-if="Venta.ven_codigo && groupBodega">
                                        <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-3">
                                            <barcodeReutilizableVue :barcodeValue="Venta.ven_codigo" :width="0.6" :height="15" :barcodeId="'barcode-factura'" />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td></td>
                                <td></td>
                                <td><b>Pedido: </b></td>
                                <td>{{Venta.pedido_codigo}}</td>
                            </tr>

                            <!-- Información del cliente y la venta -->
                            <tr>
                                <td v-if="Venta.ven_tipo_inst=='V'"><b>Institución: </b></td>
                                <td v-if="Venta.ven_tipo_inst=='L'"><b>Librería: </b></td>
                                <td colspan="4">{{Venta.institucion_nombre}}</td>
                            </tr>
                            <tr>
                                <td><b>Cliente: </b></td>
                                <td>{{Venta.cliente_nombre}}</td>
                                <td></td>
                                <td><b>RUC: </b></td>
                                <td>{{Venta.institucion_ruc}}</td>
                            </tr>
                            <tr>
                                <td><b>Fecha: </b></td>
                                <td>{{formatearFecha(Venta.ven_fecha)}}</td>
                                <td></td>
                                <td><b>Correo: </b></td>
                                <td>{{Venta.cliente_email}}</td>
                            </tr>
                            <tr>
                                <td><b>Dirección: </b></td>
                                <td>{{Venta.institucion_direccion}}</td>
                                <td width="30"></td>
                                <td><b>Teléfono: </b></td>
                                <td>{{Venta.institucion_telefono}}</td>
                            </tr>

                            <!-- Información de Pre-Proforma y responsable -->
                            <tr>
                                <template v-if="Venta.prof_id && groupBodega">
                                    <td><b>Pre-Proforma: </b></td>
                                    <td style="display: flex; flex-direction: column; align-items: center;">
                                        <span>{{Venta.prof_id}}</span>
                                        <barcodeReutilizableVue :barcodeValue="Venta.prof_id" :width="0.6" :height="15" :barcodeId="'barcode-proforma'" />
                                    </td>
                                </template>
                                <td></td>
                                <td><b>Facturado por: </b></td>
                                <td>{{Venta.creado_por}}</td>
                            </tr>
                        </thead>
                    </table>

                    <!-- Detalle de los productos de la venta -->
                    <table class="table tabla2 mi-clase-de-tabla" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 8px; font-size: 9px;">
                        <thead align="center">
                            <tr>
                                <th width="20" style="padding: 2px;">Código</th>
                                <th width="60" style="padding: 2px;">Cantidad</th>
                                <th width="250" style="padding: 2px;">Descripción</th>
                                <th width="80" style="padding: 2px;">Valor Unitario</th>
                                <th width="80" style="padding: 2px;">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                                <td style="padding: 1px;"><b>{{ detalle.pro_codigo }}</b></td>
                                <td align="center" style="padding: 1px;">{{ detalle.det_ven_cantidad }}</td>
                                <td style="padding: 1px;">{{ detalle.descripcion }}</td>
                                <td align="center" style="padding: 1px;">{{ parseFloat(detalle.det_ven_valor_u).toFixed(2) }}</td>
                                <td style="text-align: right; padding: 1px;">{{ (parseFloat(detalle.det_ven_cantidad) * parseFloat(detalle.det_ven_valor_u)).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Resumen de valores -->
                    <table class="table tabla2 mi-clase-de-tabla" style="font-size: 9px; border-collapse: collapse; border: none; text-align: start; margin-top: 8px;">
                        <tbody>
                            <tr>
                                <td colspan="4" rowspan="6" align="left" width="300" style="padding: 3px;">
                                    <div>
                                        <b>Observación:</b> {{Venta.ven_observacion || 'Sin observaciones'}}<br />
                                        <b>Nota: </b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO
                                    </div>
                                </td>
                                <td style="padding: 1px;"><b>Subtotal $:</b></td>
                                <td style="text-align: right; padding: 1px;" width="80"><b>{{ calcularSubtotal() }}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Descuento {{ parseInt(calcularPorcentajeDescuento()) }} % $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ calcularDescuento() }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Subtotal - Descuento $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ calcularSubtotalConDescuento() }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>IVA $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>0.00</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>Transporte $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ parseFloat(Venta.ven_transporte || 0).toFixed(2) }}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 1px;"><b>TOTAL $:</b></td>
                                <td style="text-align: right; padding: 1px;">
                                    <b>{{ calcularTotal() }}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </vx-card>
            </div>

            <!-- TIPO DOCUMENTO 2: Acta de Entrega -->
            <div v-if="Venta.idtipodoc == 2" style="width: 100%;">
                <vx-card style="width: 100%; padding: 8px;">
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 12px;">{{nombreEmpresaActual}}</p>
                    <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 14px; margin: 2px 0;">
                        PROMOCIÓN DE VENTAS</h5>
                    <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 14px; margin: 2px 0;">
                        ACTA DE ENTREGA</h5>
                    <h5 class="text-center font-bold mt-1" style="float:right; margin-right: 25px; text-align: center; font-weight: bold; font-size: 12px;">
                        {{ Venta.ven_codigo }}</h5>
                    <p class="letra" style="padding: 0px 30px 0px 0px; font-size: 9px; margin: 0; margin-left: 20px;">
                        <b>Fecha:</b> {{ formatearFecha(Venta.ven_fecha) }}
                    </p>
                    <br>
                    <table style="border: none; text-align: start; border-collapse: collapse; width:80%; margin-left: 20px; font-size: 9px;">
                        <tr style="border: none;">
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 9px; margin: 0;">
                                    <b>INSTITUCIÓN BENEFICIADA:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;" colspan="2">
                                <p style="font-size: 9px; margin: 0;">
                                    {{ Venta.institucion_nombre }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 9px; margin: 0;">
                                    <b>CLIENTE:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;" colspan="2">
                                <p style="font-size: 9px; margin: 0;">
                                    {{ Venta.cliente_nombre }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 9px; margin: 0;">
                                    <b>CI:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;">
                                <p style="font-size: 9px; margin: 0;">
                                    {{ Venta.cliente_cedula || Venta.institucion_ruc }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 9px; margin: 0;">
                                    <b>Correo:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;">
                                <p style="font-size: 9px; margin: 0;">
                                    {{ Venta.cliente_email }}
                                </p>
                            </td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 9px; margin: 0;">
                                    <b>Teléfono:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;">
                                <p style="font-size: 9px; margin: 0;">
                                    {{ Venta.cliente_telefono }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 9px; margin: 0;">
                                    <b>Dirección:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;">
                                <p style="font-size: 9px; margin: 0;">
                                    {{ Venta.institucion_direccion }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                        </tr>
                    </table>
                    <br>
                    <p style="padding: 0px 30px 0px 0px; font-size: 9px; margin: 0; margin-left: 20px;">
                        Con esta fecha, se procede a la suscripción de la presente Acta de
                        Entrega - Recepción de los productos que se otorgan en calidad de
                        <b>OBSEQUIOS SIN COSTO</b>, como parte de la PROMOCIÓN DE VENTAS.
                    </p>
                    <br>
                    <table style="table-layout: fixed; width: 90%; border-collapse: collapse; border: none; font-size: 9px; margin-top: 8px; margin-left: 25px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; padding: 2px; text-align: center;">CÓDIGO</th>
                                <th style="border: 1px solid black; padding: 2px; text-align: center;">CANTIDAD</th>
                                <th style="border: 1px solid black; padding: 2px; text-align: center;">DESCRIPCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                                <td style="border: 1px solid black; padding: 2px; text-align: center;">{{ detalle.pro_codigo }}</td>
                                <td style="border: 1px solid black; padding: 2px; text-align: center;">{{ detalle.det_ven_cantidad }}</td>
                                <td style="border: 1px solid black; padding: 2px;">{{ detalle.descripcion }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <p style="padding: 0px 30px 0px 0px; font-size: 9px; margin: 0; margin-left: 20px; margin-top: 8px;">
                        <b>OBSERVACIÓN :</b> {{ Venta.ven_observacion || 'Sin observaciones' }}
                    </p>
                    <br>
                    <div>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                            <tr>
                                <td style="text-align: center; padding: 10px; font-size: 9px;">
                                    _____________________<br>
                                    <b>FIRMA CLIENTE</b>
                                </td>
                                <td style="text-align: center; padding: 10px; font-size: 9px;">
                                    _____________________<br>
                                    <b>FIRMA AUTORIZADA</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <br>
                    <p style="padding: 0px 30px 0px 0px; font-size: 9px; margin: 0; margin-left: 20px; margin-top: 8px;">
                        <b>Elaborado por:</b> {{ Venta.usuario_nombre }}
                    </p>
                </vx-card>
            </div>

            <!-- TIPO DOCUMENTO 3 y 4: Notas de Crédito/Débito -->
            <div v-if="Venta.idtipodoc == 3 || Venta.idtipodoc == 4" style="width: 100%;">
                <vx-card style="width: 100%; padding: 8px;">
                    <p style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 12px;">{{nombreEmpresaActual}}</p>
                    <p style="text-align: center; font-weight: bold; margin-top: 5px; font-size: 11px;">
                        {{ Venta.idtipodoc == 3 ? 'NOTA DE CRÉDITO' : 'NOTA DE DÉBITO' }}
                    </p>
                    <p style="text-align: center; font-weight: bold; font-size: 11px;">
                        {{ Venta.ven_codigo }}
                    </p>

                    <table style="width: 100%; margin-top: 8px; font-size: 9px;">
                        <tr>
                            <td style="padding: 1px;"><b>Institución:</b></td>
                            <td style="padding: 1px;">{{ Venta.institucion_nombre }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px;"><b>Cliente:</b></td>
                            <td style="padding: 1px;">{{ Venta.cliente_nombre }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px;"><b>RUC:</b></td>
                            <td style="padding: 1px;">{{ Venta.institucion_ruc }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 1px;"><b>Fecha:</b></td>
                            <td style="padding: 1px;">{{ formatearFecha(Venta.ven_fecha) }}</td>
                        </tr>
                    </table>

                    <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 8px; font-size: 9px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid black; padding: 2px;">Código</th>
                                <th style="border: 1px solid black; padding: 2px;">Cantidad</th>
                                <th style="border: 1px solid black; padding: 2px;">Descripción</th>
                                <th style="border: 1px solid black; padding: 2px;">Valor Unit.</th>
                                <th style="border: 1px solid black; padding: 2px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detalle, k) in DetalleVenta" :key="k">
                                <td style="border: 1px solid black; padding: 2px;">{{ detalle.pro_codigo }}</td>
                                <td style="border: 1px solid black; padding: 2px; text-align: center;">{{ detalle.det_ven_cantidad }}</td>
                                <td style="border: 1px solid black; padding: 2px;">{{ detalle.descripcion }}</td>
                                <td style="border: 1px solid black; padding: 2px; text-align: right;">{{ parseFloat(detalle.det_ven_valor_u).toFixed(2) }}</td>
                                <td style="border: 1px solid black; padding: 2px; text-align: right;">{{ (parseFloat(detalle.det_ven_cantidad) * parseFloat(detalle.det_ven_valor_u)).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="tabla1" style="width: 100%; border-collapse: collapse; border: none; text-align: start; margin-top: 8px; font-size: 9px;">
                        <tbody>
                            <tr>
                                <td colspan="3"></td>
                                <td style="padding: 1px;"><b>Subtotal $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularSubtotal() }}</b></td>
                            </tr>
                            <tr>
                                <td colspan="3"></td>
                                <td style="padding: 1px;"><b>Descuento $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularDescuento() }}</b></td>
                            </tr>
                            <tr>
                                <td colspan="3"></td>
                                <td style="padding: 1px;"><b>IVA $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>0.00</b></td>
                            </tr>
                            <tr>
                                <td colspan="3"></td>
                                <td style="padding: 1px;"><b>TOTAL $:</b></td>
                                <td style="text-align: right; padding: 1px;"><b>{{ calcularTotal() }}</b></td>
                            </tr>
                        </tbody>
                    </table>

                    <p style="margin-top: 8px; font-size: 9px;"><b>Observación:</b> {{ Venta.ven_observacion || 'Sin observaciones' }}</p>
                </vx-card>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import imprimirMixin from "@/mixins/Pedidosmix";
const barcodeReutilizableVue = () => import('@/views/pedidos2/pedidos/proforma/barcodeReutilizable.vue');

export default {
    mixins: [imprimirMixin],
    computed: {
        ...mapState(["AdminBodega", 'groupFacturador', 'groupBodega']),
    },
    components: {
        barcodeReutilizableVue,
    },
    props: {
        venta: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            Venta: {},
            DetalleVenta: [],
            nombreEmpresaActual: ''
        }
    },
    mounted() {
        this.getEmpresaActual();
        this.getDetallesVenta();
    },
    methods: {
        async getEmpresaActual() {
            try {
                const res = await this.$http.get(this.$server_url + 'empresaActual');
                this.nombreEmpresaActual = res.data[0].descripcion_corta;
            } catch (err) {
                console.error('Error al cargar empresa actual:', err);
            }
        },

        getDetallesVenta() {
            let me = this;
            me.loading = true;

            // Asignar la venta recibida
            me.Venta = { ...me.venta };

            // Obtener los detalles de la venta usando la ruta correcta
            const url = `${me.$server_url}devoluciones?CargarDocumentosDetalles=yes&codigo=${me.venta.ven_codigo}&empresa=${me.venta.id_empresa}`;

            me.$http.get(url)
            .then(res => {
                me.loading = false;
                console.log('Detalles de venta:', res.data);
                me.DetalleVenta = res.data.map(item => ({
                    pro_codigo: item.pro_codigo,
                    descripcion: item.pro_nombre || item.nombre_libro || item.nombre || item.descripcion || '',
                    det_ven_cantidad: item.det_ven_cantidad,
                    det_ven_valor_u: item.det_ven_valor_u,
                    id_serie: item.id_serie || null
                }));
            })
            .catch((e) => {
                me.loading = false;
                console.error('Error al cargar detalles:', e);
                me.$vs.notify({
                    text: 'Error al cargar los detalles de la venta',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },

        calcularSubtotal() {
            const subtotal = this.DetalleVenta.reduce((total, item) => {
                return total + (parseFloat(item.det_ven_cantidad) * parseFloat(item.det_ven_valor_u));
            }, 0);
            return subtotal.toFixed(2);
        },

        calcularDescuento() {
            // Calcular el descuento basado en el porcentaje
            const subtotal = parseFloat(this.calcularSubtotal());
            const porcentaje = parseFloat(this.Venta.ven_desc_por || 0);
            const descuento = (subtotal * porcentaje) / 100;
            return descuento.toFixed(2);
        },

        calcularPorcentajeDescuento() {
            return parseFloat(this.Venta.ven_desc_por || 0).toFixed(2);
        },

        calcularSubtotalConDescuento() {
            const subtotal = parseFloat(this.calcularSubtotal());
            const descuento = parseFloat(this.calcularDescuento());
            return (subtotal - descuento).toFixed(2);
        },

        calcularIVA() {
            // IVA siempre 0 como solicitaste
            return '0.00';
        },

        calcularTotal() {
            const subtotalConDesc = parseFloat(this.calcularSubtotalConDescuento());
            const transporte = parseFloat(this.Venta.ven_transporte || 0);
            const total = subtotalConDesc + transporte;
            return total.toFixed(2);
        },

        formatearFecha(fecha) {
            if (!fecha) return '-';
            const date = new Date(fecha);
            return date.toLocaleDateString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }) + ' ' + date.toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        imprimir() {
            // Registrar impresión en el servidor (solo para AdminBodega)
            let formData = new FormData();
            formData.append("ven_codigo", this.Venta.ven_codigo);
            formData.append("id_empresa", this.Venta.id_empresa);

            this.$http.post(this.$server_url + "imprimirDVenta", formData)
                .then((res) => {
                    if (res.data.status == '0') {
                        this.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error al registrar impresión:', error);
                });
        },

        cerrar() {
            this.$emit('cerrar');
        }
    }
}
</script>

<style>
/* Estilos globales para impresión - CORREGIDOS */
@media print {
    @page {
        margin: 0.5cm;
        size: A4;
    }

    /* Ocultar elementos que no se deben imprimir */
    .no-print {
        display: none !important;
    }

    /* Mostrar solo el contenido de impresión */
    body * {
        visibility: hidden;
    }

    #seccionImprimir2,
    #seccionImprimir2 * {
        visibility: visible;
    }

    #seccionImprimir2 {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: white !important;
        box-shadow: none !important;
        border: none !important;
    }

    /* Quitar estilos de visualización al imprimir */
    .contenido-impresion {
        background-color: white !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
    }

    /* Asegurar que no haya cards o bordes */
    * {
        box-shadow: none !important;
        border-radius: 0 !important;
    }

    body {
        background-color: white !important;
    }

    /* Evitar saltos de página innecesarios - LÍNEA PROBLEMÁTICA ELIMINADA */
    table, tr, td, th {
        page-break-inside: avoid;
    }

    /* Mantener las tablas juntas */
    .tabla1, .tabla2 {
        page-break-inside: avoid;
    }
}
</style>

<style scoped>
/* Estilos para visualización en pantalla - COMPACTOS */
.contenido-impresion {
    background-color: white;
    padding: 8px;
    margin: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.tabla1,
.tabla2 {
    table-layout: auto;
    width: 95%;
    border-collapse: collapse;
    margin: 8px auto;
    font-size: 9px;
}

.tabla1 td,
.tabla2 td {
    padding: 1px;
    box-sizing: border-box;
}

.table-cell {
    border: 1px solid black;
}

/* Reducir fuentes en general */
table {
    font-size: 9px;
}

th {
    font-size: 9px;
    padding: 2px;
}

td {
    font-size: 9px;
    padding: 1px;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
