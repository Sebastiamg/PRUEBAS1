<template>
<vx-card fixed-height="true">
    <div>
        <div style="margin: 0px 3px 0px 3px">
            <table align="center">
                <tr>
                    <td>
                        <ul class="flex mt-2">
                            <li>
                                <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="0" @change="FiltrohistoricoGeneral();">Por fechas</vs-radio>
                            </li>
                            <li>
                                <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="1" @change="FiltrohistoricoGeneral();">Todo</vs-radio>
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
            <table align="center" v-if="tipo == 0">
                <tr>
                    <td>
                        Desde:
                    </td>
                    <td>
                        <flat-pickr :config="configdateTimePicker" v-model="fechainicio" placeholder="Fecha desde" class="w-full" @input="FiltrohistoricoGeneral()" />
                    </td>
                    <td>
                        Hasta:
                    </td>
                    <td>
                        <flat-pickr :config="configdateTimePicker" v-model="fechafin" placeholder="Fecha hasta" class="w-full" @input="FiltrohistoricoGeneral()" />
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <vs-divider>{{ resultadoFiltrado.length > 0 ? `Cantidad: ${resultadoFiltrado.length}` : 'Sin registros' }}</vs-divider>
    <vs-row v-if="(fechainicio != '' && fechafin != '') || tipo == 1">
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mb-5">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="3" vs-sm="6" vs-xs="8">
                    <vs-input v-model="busquedaHistorial" placeholder="Buscar código" @keyup.enter="filtrarHistorial()" class="w-full" />
                    <vs-button color="primary" @click="filtrarHistorial()">Buscar</vs-button>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <vs-row v-if="resultadoFiltrado.length > 0">
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-card class="mb-4" v-for="(tr, k) in resultadoFiltrado" :key="k" style="border: 1px solid #d1d5db; border-radius: 0.375rem; box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.05);">
                <div style="font-size: 12px;">
                    <strong>ID:</strong> {{ tr.psh_id }} |
                    <strong>Usuario Editor:</strong> {{ tr.nombreeditor }} |
                    <strong>Fecha:</strong> {{ tr.created_at }}
                    <br />
                    <strong>Tipo de actualización: </strong>
                    <span v-if="tr.psh_tipo == 0">Textos y Guías Edición Masiva</span>
                    <span v-else-if="tr.psh_tipo == 1">Combos Edición Masiva</span>
                    <span v-else-if="tr.psh_tipo == 2">Movimiento no Operativo - Ingreso</span>
                    <span v-else-if="tr.psh_tipo == 3">Movimiento no Operativo - Egreso</span>
                    <span v-else-if="tr.psh_tipo == 4">Generación de documento de venta</span>
                    <span v-else-if="tr.psh_tipo == 5">Pedido de Guías anuladas</span>
                    <span v-else-if="tr.psh_tipo == 6">Creación compra de orden de producción</span>
                    <span v-else-if="tr.psh_tipo == 7">Edición compra de orden de producción</span>
                    <span v-else-if="tr.psh_tipo == 8">Api Utilizada: Mover_Stock_SoloTxt_Todo_A_DepositoCALMED</span>
                    <span v-else-if="tr.psh_tipo == 9">Devolución de códigos por documentos</span>
                    <span v-else-if="tr.psh_tipo == 10">Igualar la venta ala proforma</span>
                    <span v-else-if="tr.psh_tipo == 11">Anulacion de pedido hijos docentes/obsequios</span>
                    <span v-else-if="tr.psh_tipo == 12">Devolución de códigos por Sueltos</span>
                    <span v-else-if="tr.psh_tipo == 13">Pedido de Guias</span>
                    <span v-else-if="tr.psh_tipo == 14">Devolución de Guias (Asesor)</span>
                    <span v-else-if="tr.psh_tipo == 15">Anulación de venta</span>
                    <span v-else>Tipo no controlado</span>
                    <div v-if="tr.psh_tipo == 4 || tr.psh_tipo == 15 || tr.psh_tipo == 11"><b>Documento de venta:</b> {{ tr.psh_id_ven_codigo }}</div>
                    <div v-if="tr.psh_tipo == 5"><b>ID Pedido:</b> {{ tr.id_pedido }}</div>
                    <div v-if="tr.psh_tipo == 10"><b>Proforma:</b> {{ tr.psh_proforma }}</div>
                    <div v-if="tr.psh_tipo == 11"><b>Venta:</b> {{ tr.psh_id_ven_codigo }}</div>
                    <div v-if="[6,7].includes(tr.psh_tipo) && tr.or_codigo">
                        <b>Código de Orden de producción:</b> {{ tr.or_codigo }}
                    </div>
                    <div v-if="[13].includes(tr.psh_tipo) && tr.id_pedido_guias">
                        <b>ID pedido guia:</b> {{ tr.id_pedido_guias }}
                    </div>
                </div>
                <div class="mt-2 mb-2 text-center">
                    <vs-chip color="primary" class="font-semibold">
                        <vs-icon icon="inventory_2" size="small" class="mr-1"></vs-icon>
                        {{ Object.keys(tr.psh_old_values || {}).length }}
                        producto{{ Object.keys(tr.psh_old_values || {}).length !== 1 ? 's' : '' }}
                        afectado{{ Object.keys(tr.psh_old_values || {}).length !== 1 ? 's' : '' }}
                    </vs-chip>
                </div>
                <vs-divider>Detalle de Cambios</vs-divider>
                <div style="max-height: 350px; overflow: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 500px;" class="estiloover">
                        <thead style="position: sticky; top: 0; background: white; z-index: 9; border-bottom: 1px solid #eee; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                            <tr>
                                <th style="width: 45%; text-align: left; padding: 8px; background: #f7f7f7; min-width: 200px;">Valores Anteriores</th>
                                <th style="width: 10%; text-align: left; padding: 8px; background: #f7f7f7; min-width: 100px;">Variación Stock</th>
                                <th style="width: 45%; text-align: left; padding: 8px; background: #f7f7f7; min-width: 200px;">Valores Actualizados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="width: 45%; vertical-align: top; padding: 8px;">
                                    <div v-for="(oldValue, proCodigo) in tr.psh_old_values" :key="proCodigo">
                                        <div><strong>{{ oldValue.pro_codigo }}:</strong></div>
                                        <div><span style="font-weight: 600;">Stock General:</span> {{ oldValue.pro_reservar }}</div>
                                        <div><span style="font-weight: 600;">Stock Facturas Prolipa:</span> {{ oldValue.pro_stock }}</div>
                                        <div><span style="font-weight: 600;">Stock Facturas Calmed:</span> {{ oldValue.pro_stockCalmed }}</div>
                                        <div><span style="font-weight: 600;">Stock Notas Prolipa:</span> {{ oldValue.pro_deposito }}</div>
                                        <div><span style="font-weight: 600;">Stock Notas Calmed:</span> {{ oldValue.pro_depositoCalmed }}</div>
                                        <hr />
                                    </div>
                                </td>
                                <td style="width: 10%; vertical-align: top; padding: 8px;">
                                    <div v-for="(oldValue, proCodigo) in tr.psh_old_values" :key="proCodigo + '_comp'">
                                        <div><strong>{{ oldValue.pro_codigo }}:</strong></div>
                                        <div v-html="mostrarFlecha(oldValue.pro_reservar, tr.psh_new_values[proCodigo] ? tr.psh_new_values[proCodigo].pro_reservar : null)"></div>
                                        <div v-html="mostrarFlecha(oldValue.pro_stock, tr.psh_new_values[proCodigo] ? tr.psh_new_values[proCodigo].pro_stock : null)"></div>
                                        <div v-html="mostrarFlecha(oldValue.pro_stockCalmed, tr.psh_new_values[proCodigo] ? tr.psh_new_values[proCodigo].pro_stockCalmed : null)"></div>
                                        <div v-html="mostrarFlecha(oldValue.pro_deposito, tr.psh_new_values[proCodigo] ? tr.psh_new_values[proCodigo].pro_deposito : null)"></div>
                                        <div v-html="mostrarFlecha(oldValue.pro_depositoCalmed, tr.psh_new_values[proCodigo] ? tr.psh_new_values[proCodigo].pro_depositoCalmed : null)"></div>
                                        <hr />
                                    </div>
                                </td>
                                <td style="width: 45%; vertical-align: top; padding: 8px;">
                                    <div v-for="(newValue, proCodigo) in tr.psh_new_values" :key="proCodigo">
                                        <div><strong>{{ newValue.pro_codigo }}:</strong></div>
                                        <div><span style="font-weight: 600;">Stock General:</span> {{ newValue.pro_reservar }}</div>
                                        <div><span style="font-weight: 600;">Stock Facturas Prolipa:</span> {{ newValue.pro_stock }}</div>
                                        <div><span style="font-weight: 600;">Stock Facturas Calmed:</span> {{ newValue.pro_stockCalmed }}</div>
                                        <div><span style="font-weight: 600;">Stock Notas Prolipa:</span> {{ newValue.pro_deposito }}</div>
                                        <div><span style="font-weight: 600;">Stock Notas Calmed:</span> {{ newValue.pro_depositoCalmed }}</div>
                                        <hr />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
</vx-card>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    Spanish
} from 'flatpickr/dist/l10n/es.js'
flatpickr.localize(Spanish)
export default {
    data() {
        return {
            HistoricoStockProducto: [],
            tipo: 0,
            fechainicio: '',
            fechafin: '',
            configdateTimePicker: {
                // enableTime: true,
                altInput: true,
                altFormat: 'Y-F-d', // Esto es lo que se ve: 2025-Mayo-02
                dateFormat: 'Y-m-d', // Esto es lo que se envía: 2025-05-02
                maxDate: new Date() // Esto bloquea fechas futuras
            },
            isExecuting: false,
            busquedaHistorial: '',
            resultadoFiltrado: [] // Aquí pondrás el resultado del filtro
        };
    },
    components: {
        flatPickr,
    },
    mounted() {
        let me = this;
        me.FiltrohistoricoGeneral();
    },
    methods: {
        FiltrohistoricoGeneral() {
            let me = this;
            me.busquedaHistorial = '';

            // Si ya está ejecutándose, no hacer nada
            if (me.isExecuting) {
                return;
            }

            // Marcar como en ejecución
            me.isExecuting = true;

            // console.log(me.tipo, "cual tipo es");

            if (me.tipo == 0) {
                me.resultadoFiltrado = [];

                if (me.fechainicio === '' && me.fechafin === '') {
                    me.$vs.notify({
                        color: 'warning',
                        title: 'Mensaje',
                        text: 'Seleccione la fecha desde y la fecha hasta.',
                        time: 5000,
                    });
                    // console.log("NO EXISTE NADA");
                } else if (me.fechainicio === '' && me.fechafin !== '') {
                    me.$vs.notify({
                        color: 'warning',
                        title: 'Mensaje',
                        text: 'Seleccione la fecha desde.',
                        time: 5000,
                    });
                    // console.log("EXISTE SOLO FIN");
                } else if (me.fechainicio !== '' && me.fechafin === '') {
                    me.$vs.notify({
                        color: 'warning',
                        title: 'Mensaje',
                        text: 'Seleccione la fecha hasta.',
                        time: 5000,
                    });
                    // console.log("EXISTE SOLO INICIO");
                } else if (me.fechainicio !== '' && me.fechafin !== '') {
                    let fechaInicio = new Date(me.fechainicio);
                    let fechaFin = new Date(me.fechafin);

                    if (fechaFin < fechaInicio) {
                        me.fechafin = '';
                        me.$vs.notify({
                            color: 'warning',
                            title: 'Mensaje',
                            text: 'La fecha hasta no puede ser menor que la fecha desde.',
                            time: 5000,
                        });
                        console.log("Fecha hasta es menor que la fecha desde");
                    } else {
                        // console.log("EXISTE TODO");
                        me.GetTodoHistoricoxFecha();
                    }
                }
            } else if (me.tipo == 1) {
                me.fechainicio = '';
                me.fechafin = '';
                me.resultadoFiltrado = [];
                me.GetTodoHistorico();
            }
            // Esperar 1.5 segundos antes de permitir que el método se ejecute de nuevo
            setTimeout(() => {
                me.isExecuting = false;
            }, 500); // 1500 milisegundos = 1.5 segundos
        },
        parseSafely(value) {
            if (value === null || typeof value !== 'string') return value;
            try {
                return JSON.parse(value);
            } catch (e) {
                console.warn('JSON inválido, se mantiene como string:', value);
                return value;
            }
        },

        parseProductoValues(item) {
            const oldValues = this.parseSafely(item.psh_old_values);
            const newValues = this.parseSafely(item.psh_new_values);

            // Normaliza tanto arrays como objetos con valores en formato string-JSON
            const normalizeValues = (val) => {
                if (Array.isArray(val)) {
                    // Formato: ["{\\"pro_codigo\\":\\"CERP\\",...}", ...]
                    // → convertir a objeto indexado por pro_codigo para que el template lo itere igual
                    const result = {};
                    val.forEach(str => {
                        try {
                            const parsed = typeof str === 'string' ? JSON.parse(str) : str;
                            if (parsed && parsed.pro_codigo) {
                                result[parsed.pro_codigo] = parsed;
                            }
                        } catch (e) {
                            console.warn('Error parseando inner array item:', str);
                        }
                    });
                    return result;
                } else if (val && typeof val === 'object') {
                    // Formato: {"CERP": "{\\"pro_codigo\\":\\"CERP\\",...}", ...}
                    // → parsear cada valor que sea string
                    const result = {};
                    Object.entries(val).forEach(([key, str]) => {
                        try {
                            result[key] = typeof str === 'string' ? JSON.parse(str) : str;
                        } catch (e) {
                            console.warn('Error parseando inner object value:', str);
                            result[key] = str;
                        }
                    });
                    return result;
                }
                return val;
            };

            item.psh_old_values = normalizeValues(oldValues);
            item.psh_new_values = normalizeValues(newValues);

            return item;
        },

        GetTodoHistoricoxFecha() {
            let me = this;
            me.$vs.loading();

            this.$http.get(this.$server_url + 'GetProductoStockHistoricoxFecha', {
                    params: {
                        fecha_created_desde: me.fechainicio,
                        fecha_created_hasta: me.fechafin
                    }
                })
                .then(res => {
                    // AQUÍ ESTÁ EL FIX: usar this.parseProductoValues
                    me.HistoricoStockProducto = res.data.map(item => me.parseProductoValues(item));
                    me.filtrarHistorial();
                })
                .catch(err => {
                    console.error('Error en GetTodoHistoricoxFecha:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo cargar el historial',
                        color: 'danger'
                    });
                })
                .finally(() => me.$vs.loading.close());
        },

        GetTodoHistorico() {
            let me = this;
            me.$vs.loading();

            this.$http.get(this.$server_url + 'GetProductoStockHistorico')
                .then(res => {
                    me.HistoricoStockProducto = res.data.map(item => me.parseProductoValues(item));
                    me.filtrarHistorial();
                })
                .catch(err => {
                    console.error('Error en GetTodoHistorico:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo cargar el historial',
                        color: 'danger'
                    });
                })
                .finally(() => me.$vs.loading.close());
        },
        getCancelar() {
            this.$emit('change', {
                verificaredicionmasivaactualizar: 2
            });
        },
        mostrarFlecha(oldVal, newVal) {
            if (newVal == null || oldVal == null) return '';
            if (newVal > oldVal) {
                return `<span style="color: green; font-weight: bold;">▲ +${(newVal - oldVal)}</span>`;
            } else if (newVal < oldVal) {
                return `<span style="color: red; font-weight: bold;">▼ -${(oldVal - newVal)}</span>`;
            } else {
                return `<span style="color: #5bc0de; font-weight: bold;">≡ 0</span>`;
            }
        },
        filtrarHistorial() {
            const texto = this.busquedaHistorial.trim().toLowerCase();
            if (!texto) {
                this.resultadoFiltrado = this.HistoricoStockProducto;
                return;
            }
            this.resultadoFiltrado = this.HistoricoStockProducto.filter(tr =>
                tr.psh_new_values &&
                Object.values(tr.psh_new_values).some(item =>
                    (item.pro_codigo && item.pro_codigo.toLowerCase().includes(texto)) ||
                    (item.pro_nombre && item.pro_nombre.toLowerCase().includes(texto))
                )
            );
        },
    },
};
</script>

<style>
@media (max-width: 600px) {
    .estiloover {
        overflow-x: auto;
    }
}

.flecha-up {
    color: green;
}

.flecha-down {
    color: red;
}
</style>
