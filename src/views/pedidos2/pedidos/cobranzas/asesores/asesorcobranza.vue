<template>
<div>
    <div class="flex justify-center" style="flex-wrap: wrap;margin-top: -10px;">
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-warning mb-4" style="background: rgba(var(--vs-warning),0.15);">
                    <feather-icon icon="PercentIcon" svgClasses="h-8 w-7" class="ml-1 text-warning" />
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-warning">%{{ descuento_porcentaje}}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-warning">DESCUENTO</span></div>
        </div>
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                    <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M951.87 253.86c0-82.18-110.05-144.14-256-144.14s-256 61.96-256 144.14c0 0.73 0.16 1.42 0.18 2.14h-0.18v109.71h73.14v-9.06c45.77 25.81 109.81 41.33 182.86 41.33 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98h-73.12v73.14h73.12c67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0 28.27-72.93 71-182.86 71l-25.89 0.12c-15.91 0.14-31.32 0.29-46.34-0.11l-1.79 73.11c8.04 0.2 16.18 0.27 24.48 0.27 7.93 0 16-0.05 24.2-0.12l25.34-0.12c67.44 0 127.02-13.35 171.81-35.69 6.97 7.23 11.04 14.41 11.04 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c67.44 0 127.01-13.35 171.81-35.69 6.98 7.22 11.05 14.4 11.05 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c145.95 0 256-61.96 256-144.14 0-0.68-0.09-1.45-0.11-2.14h0.11V256h-0.18c0.03-0.72 0.2-1.42 0.2-2.14z m-438.86 0c0-28.27 72.93-71 182.86-71s182.86 42.73 182.86 71c0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98z" fill="#0F1F3C" />
                        <path d="M330.15 365.71c-145.95 0-256 61.96-256 144.14 0 0.73 0.16 1.42 0.18 2.14h-0.18v256c0 82.18 110.05 144.14 256 144.14s256-61.96 256-144.14V512h-0.18c0.02-0.72 0.18-1.42 0.18-2.14 0-82.18-110.05-144.15-256-144.15zM147.29 638.93c0-6.32 4.13-13.45 11.08-20.62 44.79 22.33 104.36 35.67 171.78 35.67 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.72-182.86-70.97z m182.86-200.07c109.93 0 182.86 42.73 182.86 71 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98c0-28.27 72.93-71 182.86-71z m0 400.14c-109.93 0-182.86-42.73-182.86-71 0-6.29 4.17-13.43 11.11-20.6 44.79 22.32 104.34 35.66 171.75 35.66 67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0.01 28.26-72.92 70.99-182.85 70.99z" fill="#0F1F3C" /></svg>
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-primary">${{ totalVentaBruta | filtrarDecimal }}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-primary">TOTAL VENTA BRUTA</span></div>
        </div>
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-success mb-4" style="background: rgba(var(--vs-success),0.15);">
                    <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M951.87 253.86c0-82.18-110.05-144.14-256-144.14s-256 61.96-256 144.14c0 0.73 0.16 1.42 0.18 2.14h-0.18v109.71h73.14v-9.06c45.77 25.81 109.81 41.33 182.86 41.33 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98h-73.12v73.14h73.12c67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0 28.27-72.93 71-182.86 71l-25.89 0.12c-15.91 0.14-31.32 0.29-46.34-0.11l-1.79 73.11c8.04 0.2 16.18 0.27 24.48 0.27 7.93 0 16-0.05 24.2-0.12l25.34-0.12c67.44 0 127.02-13.35 171.81-35.69 6.97 7.23 11.04 14.41 11.04 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c67.44 0 127.01-13.35 171.81-35.69 6.98 7.22 11.05 14.4 11.05 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c145.95 0 256-61.96 256-144.14 0-0.68-0.09-1.45-0.11-2.14h0.11V256h-0.18c0.03-0.72 0.2-1.42 0.2-2.14z m-438.86 0c0-28.27 72.93-71 182.86-71s182.86 42.73 182.86 71c0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98z" fill="#0F1F3C" />
                        <path d="M330.15 365.71c-145.95 0-256 61.96-256 144.14 0 0.73 0.16 1.42 0.18 2.14h-0.18v256c0 82.18 110.05 144.14 256 144.14s256-61.96 256-144.14V512h-0.18c0.02-0.72 0.18-1.42 0.18-2.14 0-82.18-110.05-144.15-256-144.15zM147.29 638.93c0-6.32 4.13-13.45 11.08-20.62 44.79 22.33 104.36 35.67 171.78 35.67 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.72-182.86-70.97z m182.86-200.07c109.93 0 182.86 42.73 182.86 71 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98c0-28.27 72.93-71 182.86-71z m0 400.14c-109.93 0-182.86-42.73-182.86-71 0-6.29 4.17-13.43 11.11-20.6 44.79 22.32 104.34 35.66 171.75 35.66 67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0.01 28.26-72.92 70.99-182.85 70.99z" fill="#0F1F3C" /></svg>
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-success">${{ totalVenta | filtrarDecimal }}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-success">TOTAL VENTA NETA</span></div>
        </div>
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-danger mb-4" style="background: rgba(var(--vs-danger),0.15);">
                    <feather-icon icon="DollarSignIcon" svgClasses="h-8 w-7" class="ml-1 text-danger" />
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-danger" style="opacity:0.7;">${{ totalCobrado | filtrarDecimal }}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-danger">TOTAL COBRADO ABONOS</span></div>
        </div>
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-dark mb-4" style="background: rgba(var(--vs-dark),0.15);">
                    <feather-icon icon="DollarSignIcon" svgClasses="h-8 w-7" class="ml-1 text-dark" />
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-dark" style="opacity:0.7;">${{ (totalVenta - totalCobrado) | filtrarDecimal }}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-dark">V.NETA - T.COBRADO</span></div>
        </div>
    </div>
    <div>
        <TableReutilizableVue :title="'Documentos de Venta'" :maxItems="10" :headers="['Documento #', 'Ruc', 'Subtotal', '% Desc.', 'Valor desc.','Total']" :fieldKeys="['ven_codigo', 'ruc_cliente', 'ven_subtotal', 'descuento_porcentaje', 'valor_desvuento', 'ven_valor']" :tableData="arregloTabla" />
    </div>
    <div class="flex justify-center" style="flex-wrap: wrap;margin-top: -10px;">
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-dark mb-4" style="background: rgba(var(--vs-danger),0.15);">
                    <feather-icon icon="PieChartIcon" svgClasses="h-8 w-7" class="ml-1 text-danger" />
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-danger">${{ totalDevolucionesFacturas + totalDevolucionesNotas | filtrarDecimal }}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-danger">TOTAL DEVOLUCION </span></div>
        </div>
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-warning mb-4" style="background: rgba(var(--vs-warning),0.15);">
                    <feather-icon icon="MinusCircleIcon" svgClasses="h-8 w-7" class="ml-1 text-warning" />
                </span>
            </div>
            <div class="flex justify-center">
                <h3 class="mb-1 font-bold text-warning">${{ (totalVenta - totalCobrado) - (totalDevolucionesFacturas + totalDevolucionesNotas) | filtrarDecimal }}</h3>
            </div>
            <div class="ml-4"><span class="font-bold text-warning">TOTAL DEVOLUCION - (V.NETA - T.COBRADO)</span></div>
        </div>
    </div>
    <div v-if="devoluciones_all.length>0">
        <!-- <TableReutilizableVue :title="'Devoluciones'" :maxItems="10" :headers="['Dev. #', 'Doc. #', 'Subtotal', '% Desc.','Total']" :fieldKeys="['codigo_devolucion', 'documento', 'total_precio', 'descuento', 'total_descuento']" :tableData="devoluciones_all" /> -->
        <p class="mt-1"></p>
        <b class="mt-5" style="position: relative;top:8px;">Devoluciones</b>
        <vs-table :data="devoluciones_all" pagination search no-data-text="No hay datos disponibles" :max-items="devoluciones_all.length">
            <template slot="header">
                <vs-chip color="primary">Cantidad: <b> {{ devoluciones_all.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th sort-key="codigo_devolucion"> Dev. # </vs-th>
                <vs-th> Doc. # </vs-th>
                <vs-th sort-key="total_precio"> Subtotal </vs-th>
                <vs-th> % Desc. </vs-th>
                <vs-th> Total </vs-th>
                <!-- <vs-th> Codigos X documento venta </vs-th> -->
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{ tr.codigo_devolucion }} </vs-td>
                    <vs-td>
                        <b>{{ tr.documento }}</b>
                        <div>
                            <table class="table-auto border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th style="padding: 0;">CODIGO</th>
                                        <!-- <th style="padding: 0;">CANT. VENTA</th> -->
                                        <th style="padding: 0;">CANT. DEV.</th>
                                        <th style="padding: 0;">P. UNI.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(detalle, index) in tr.detalles" :key="index">
                                        <td style="padding: 0;"><b>{{ detalle.pro_codigo }}</b></td>
                                        <!-- <td style="padding: 0;">{{ detalle.det_ven_cantidad }}</td> -->
                                        <td style="padding: 0;">{{ detalle.det_ven_dev }}</td>
                                        <td style="padding: 0;">{{ detalle.det_ven_valor_u }}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </vs-td>
                    <vs-td> {{ tr.total_precio }} </vs-td>
                    <vs-td> {{ tr.descuento }} </vs-td>
                    <vs-td> {{ tr.total_descuento }} </vs-td>
                    <!-- <vs-td>
                        <b>Cantidad de codigos: {{ tr.codigos.length }}</b>
                        <div class="overflow-y-auto h-24 ">
                            <span v-for="(codigo, index) in tr.codigos" :key="index" class="flex">
                                <p>{{ codigo.codigo }}</p> - <p>{{ codigo.codigo_union }}</p><br>
                            </span>
                        </div>
                    </vs-td> -->
                </vs-tr>
            </template>
        </vs-table>
    </div>
</div>
</template>

<script>
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';

export default {
    components: {
        TableReutilizableVue,
        'v-select': vSelect,
    },
    data() {
        return {
            usuario: [],
            pedido: [],
            arregloBusqueda: [],
            arregloTabla: [],
            arreglonotas: [],
            arreglofacturas: [],
            totalVentaBruta: 0,
            totalCobrado: 0,
            totalVenta: 0,
            descuento_porcentaje: 0,
            devoluciones_all: [],
            devolucionesFacturas: [],
            devolucionesNotas: [],
            totalDevolucionesFacturas: 0,
            totalDevolucionesNotas: 0,
        }
    },
    props: {
        sendPedido: {
            type: [Object, String],
            default: function () {
                return {}
            }
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor']),
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.pedido = me.sendPedido;
        me.getValoresVentasyCobranza();
    },
    methods: {
        getValoresVentasyCobranza() {
            let me = this;
            this.$vs.loading();
            this.$http
                .get(this.$server_url + "getSalesAndPayments?institucion=" + me.pedido.id_institucion + "&periodo=" + me.pedido.id_periodo)
                .then((res) => {
                    this.arregloBusqueda = res.data;
                    this.totalCobrado = this.arregloBusqueda['total_abono'];
                    this.totalVentaBruta = this.arregloBusqueda['total_ventaBruta'];
                    this.totalVenta = this.arregloBusqueda['total_venta'];
                    this.descuento_porcentaje = this.arregloBusqueda['porcentaje_descuento'];

                    this.arregloTabla = this.arregloBusqueda['documentos']; // Corrección aquí
                    me.arreglofacturas = this.arregloTabla.filter(item => item.idtipodoc === 1);
                    me.arreglonotas = this.arregloTabla.filter(item => item.idtipodoc === 4 || item.idtipodoc === 3 || item.idtipodoc === 2);
                    this.$vs.loading.close();

                    setTimeout(function () {
                        me.$vs.loading();
                        me.traerDevoluciones(me.arreglonotas, me.arreglofacturas);
                    }, 500);

                })
                .catch((error) => {
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
        async traerDevoluciones(notas, facturas) {
            let me = this;
            me.devolucionesFacturas = [];
            me.devolucionesNotas = [];

            // Función para obtener detalles de devolución
            const obtenerDetallesDevolucion = async (documento) => {
                try {
                    const res = await me.$http.get(`${me.$server_url}obtenerDetallesDevolucion?documento=${documento}`);
                    return res.data.length > 0 ? res.data : []; // Devuelve el array de devoluciones
                } catch (error) {
                    console.error('Error obteniendo detalles de devolución:', error);
                    return []; // Devuelve un array vacío si hay un error
                }
            };

            // Iniciar loading
            me.$vs.loading();

            // Función genérica para procesar facturas o notas
            const procesarDevoluciones = async (documentos, tipo) => {
                const devoluciones = await Promise.all(documentos.map(async (documento) => {
                    const detalles = await obtenerDetallesDevolucion(documento.ven_codigo);
                    return detalles.map(devolucion => ({
                        codigo_devolucion: devolucion.codigo_devolucion,
                        id_cliente: devolucion.id_cliente,
                        total_precio: devolucion.total_precio,
                        nombreInstitucion: devolucion.nombreInstitucion,
                        descuento: devolucion.descuento,
                        total_descuento: devolucion.ValorConDescuento,
                        documento: devolucion.documento,
                        codigos: devolucion.codigos,
                        detalles: devolucion.detalleVenta,
                    }));
                }));

                // Aplanar el array de devoluciones y asignarlo a la propiedad correspondiente
                const devolucionesAplanadas = devoluciones.flat();
                if (tipo === 'facturas') {
                    me.devolucionesFacturas = devolucionesAplanadas;
                } else if (tipo === 'notas') {
                    me.devolucionesNotas = devolucionesAplanadas;
                }
            };

            try {
                // Ejecutar ambas funciones en paralelo
                await Promise.all([
                    procesarDevoluciones(facturas, 'facturas'),
                    procesarDevoluciones(notas, 'notas')
                ]);

                // Calcular los totales por separado para facturas y notas
                me.totalDevolucionesFacturas = me.devolucionesFacturas.reduce((total, devolucion) => total + devolucion.total_descuento, 0);
                me.totalDevolucionesNotas = me.devolucionesNotas.reduce((total, devolucion) => total + devolucion.total_descuento, 0);

                // Combinar todas las devoluciones
                me.devoluciones_all = [...me.devolucionesFacturas, ...me.devolucionesNotas];

                // Verificar si el número de devoluciones coincide
                if ((me.devolucionesFacturas.length + me.devolucionesNotas.length) === me.devoluciones_all.length) {
                    me.cargoDevoluciones = true;
                } else {
                    console.error('No hay coincidencias en los datos de devoluciones');
                }
            } catch (error) {
                console.error('Error procesando las devoluciones:', error);
            } finally {
                // Cerrar el loading al finalizar
                me.$vs.loading.close();
            }
        },
    }
}
</script>
