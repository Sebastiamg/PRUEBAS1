<template>
<vx-card fixed-height="true">
    <!-- SECCION REGISTRO -->
    <vs-row>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <font style="font-size: 11.5px">&nbsp;Seleccione el Proveedor</font><br>
            <v-select :options="Proveedores" :reduce="Proveedores => Proveedores.prov_codigo" label="prov_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="idmovimiento.prov_codigo" />
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col vs-lg="12">
            <font style="font-size: 11.5px">&nbsp;Detalle</font><br>
            <vs-textarea v-model="idmovimiento.observacion" rows="3" placeholder="Ingrese un detalle" class="w-full" />
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12" align="center">
            <font style="font-size: 11.5px">&nbsp;Tipo de Movimiento</font><br>
            <vs-radio :disabled="deshabilitarRadio" class="m-2" color="primary" v-model="tipoIngreso" vs-name="radiosTipo" vs-value="0">Ingreso</vs-radio>
            <vs-radio :disabled="deshabilitarRadio" class="m-2" color="danger" v-model="tipoIngreso" vs-name="radiosTipo" vs-value="1">Egreso</vs-radio>
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <span style="font-size: 15px; font-weight: bold">Nota:</span><br>
            <div v-if="tipoIngreso == 0">Las cantidades que se ingresen <b>aumentarán</b> el stock del/los producto(s).</div>
            <div v-if="tipoIngreso == 1">Las cantidades que se ingresen <b>disminuirán</b> el stock del/los producto(s).</div>
        </vs-col>
    </vs-row>
    <br>
    <vs-row>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <div align="center">
                <vs-button :color=btn_propiedades.btn_color @click="f_guardar_movimiento()"> {{ btn_propiedades.btn_txt }} </vs-button>
            </div>
        </vs-col>
    </vs-row>
    <vs-row v-if="CompletoIngreso">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Búsqueda y selección de producto(s)</vs-divider>
                <!-- {{ arrayConfiguration }} -->
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <div>
                        <table align="center">
                            <tr>
                                <td width="1000">
                                    <v-select style="width: 100%;" placeholder="--Buscar y seleccionar--" multiple :closeOnSelect="false" v-model="pro_codigo" label="nombreCompleto" class="mb-4" :options="productosDisponibles" :reduce="(productosDisponibles) => productosDisponibles.pro_codigo" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                                </td>
                                <td width="150">
                                    <vs-button @click="AgregarItemsTabla();" color="success" type="relief">Agregar a la tabla</vs-button>&emsp;
                                </td>
                            </tr>
                        </table>
                    </div>
                </vs-col>
            </vs-col>
        </vs-row>
        <!-- {{ DatosAcumuladosStockMasivo }} -->
        <vs-row>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Cantidad de producto/s a modificar: {{ DatosAcumuladosStockMasivo.length }}</vs-divider>
                <vs-table search :data="DatosAcumuladosStockMasivo" :max-items="DatosAcumuladosStockMasivo.length" no-data-text="Aún no se ha agregado ningún producto" class="table_pedidos">
                    <template slot="thead">
                        <vs-th width="100">Codigo</vs-th>
                        <vs-th width="700">Nombre</vs-th>
                        <vs-th width="250">Stock General</vs-th>
                        <!-- <vs-th width="350">Stock Facturas Prolipa</vs-th> -->
                        <vs-th width="350">Stock Facturas Calmed</vs-th>
                        <!-- <vs-th width="350">Stock Notas Prolipa</vs-th> -->
                        <!-- <vs-th width="350">Stock Notas Calmed</vs-th> -->
                        <vs-th width="200">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr v-for="(tr, k) in data" :key="k" height="100">
                            <vs-td>
                                <span><b style="font-size: 13px;">{{ tr.pro_codigo }}</b></span>
                            </vs-td>
                            <vs-td align="left">
                                <span><b style="font-size: 13px;">{{ tr.pro_nombre }}</b></span><br>
                            </vs-td>
                            <vs-td align="center">
                                <div class="stock-container">
                                    <!-- Stock Actual -->
                                    <div class="stock-item">
                                        <small class="label">Actual</small>
                                        <span class="value-base">{{ tr.pro_reservar_anterior }}</span>
                                    </div>
                                    <!-- Indicador de Variación -->
                                    <div class="variation-badge" v-if="tr.pro_reservar_nuevo > 0">
                                        <vs-icon :icon="tipoIngreso == 0 ? 'arrow_upward' : 'arrow_downward'" size="small" :color="tipoIngreso == 0 ? 'success' : 'warning'"></vs-icon>
                                        <span :class="tipoIngreso == 0 ? 'text-success' : 'text-warning'">
                                            {{ tipoIngreso == 0 ? '+' : '-' }}{{ tr.pro_reservar_nuevo }}
                                        </span>
                                    </div>
                                    <!-- Resultado Proyectado -->
                                    <div v-if="tr.pro_reservar_nuevo > 0">
                                        <vx-tooltip v-if="tr.pro_reservar < 0" text="No se admiten valores negativos en el total." position="bottom" color="danger">
                                            <div class="stock-item projected result-error bg-light-danger">
                                                <small class="label text-danger">Stock Proyectado</small>
                                                <div class="flex items-center justify-center">
                                                    <vs-icon icon="error_outline" color="danger" size="small" class="mr-1"></vs-icon>
                                                    <b class="value-total text-danger">{{ tr.pro_reservar }}</b>
                                                </div>
                                            </div>
                                        </vx-tooltip>
                                        <div v-else class="stock-item projected" :class="tipoIngreso == 0 ? 'bg-light-success' : 'bg-light-warning'">
                                            <small class="label">Stock Proyectado</small>
                                            <b class="value-total" :style="{color: tipoIngreso == 0 ? '#28C76F' : '#FF9F43'}">
                                                {{ tr.pro_reservar }}
                                            </b>
                                        </div>
                                    </div>
                                </div>
                                <!-- COMENTADO POR SEGURIDAD SEGUN SOLICITUD -->
                                <!-- 
                                <vs-tooltip text="Debe coincidir con Stock Facturas Calmed." position="top" color="primary">
                                    <template>‎</template>
                                    <span><b style="font-size: 13px;">{{ tr.pro_reservar }}</b></span>
                                </vs-tooltip>
                                <br>
                                <vs-tooltip :text="tipoIngreso == 0 ? 'Stock a aumentar' : 'Stock a disminuir'" position="bottom" color="primary">
                                    <template>‎</template>
                                    <span><b style="font-size: 13px;">{{ tr.pro_reservar_nuevo }}</b></span>
                                </vs-tooltip>
                                -->
                            </vs-td>
                            <!-- <vs-td align="center">
                                <vs-tooltip :text="tr.pro_stock < 0 ? 'No se admiten valores negativos.' : 'Stock actual'" position="right" :color="tr.pro_stock < 0 ? 'danger' : 'primary'">
                                    <template>‎</template>
                                    <b style="font-size: 13px; cursor: pointer; position: relative; padding-bottom: 2px;" :style="{color: tr.pro_stock < 0 ? '#D32F2F' : 'inherit', textShadow: tr.pro_stock < 0 ? '0px 2px 6px rgba(211, 47, 47, 0.5)' : 'none',}">{{ tr.pro_stock }}
                                        <span v-if="tr.pro_stock < 0" style="position: absolute;left: 0;bottom: 0;width: 100%;height: 2px;background: linear-gradient(to right, #D32F2F, transparent);border-radius: 2px;"></span>
                                    </b>
                                </vs-tooltip>
                                <vs-tooltip :text="tipoIngreso == 0 ? 'Stock a aumentar - Máx. 5 dígitos' : 'Stock a disminuir - Máx. 5 dígitos'" position="bottom" color="primary">
                                    <template>‎</template>
                                    <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_stock_nuevo" @blur="EstablecerDefaultVacio(tr, 'pro_stock_nuevo')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                                </vs-tooltip>
                            </vs-td> -->
                            <vs-td align="center">
                                <div class="calmed-container">
                                    <div class="calmed-header">
                                        <div class="calmed-actual">
                                            <small class="label">Actual Calmed</small>
                                            <b class="value-calmed">
                                                {{ tr.pro_stockCalmed_anterior }}
                                            </b>
                                        </div>
                                    </div>
                                    <div class="calmed-input-section">
                                        <vx-tooltip :text="tipoIngreso == 0 ? 'Stock a aumentar - Máx. 5 digitos' : 'Stock a disminuir - Máx. 5 digitos'" position="top" color="primary">
                                            <vs-input class="w-full custom-input-stock" placeholder="0" min="0" v-model="tr.pro_stockCalmed_nuevo" @blur="EstablecerDefaultVacio(tr, 'pro_stockCalmed_nuevo')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                                        </vx-tooltip>
                                    </div>
                                    <div class="calmed-footer" v-if="tr.pro_stockCalmed_nuevo > 0">
                                        <vx-tooltip v-if="tr.pro_stockCalmed < 0" text="No se admiten valores negativos." position="bottom" color="danger">
                                            <div class="calmed-result result-error">
                                                <small class="label text-danger">Stock Proyectado</small>
                                                <div class="flex items-center justify-center">
                                                    <vs-icon icon="warning" color="danger" size="small" class="mr-1"></vs-icon>
                                                    <b style="font-size: 16px;" class="text-danger">{{ tr.pro_stockCalmed }}</b>
                                                </div>
                                            </div>
                                        </vx-tooltip>
                                        <div v-else class="calmed-result" :class="tipoIngreso == 0 ? 'text-success' : 'text-warning'">
                                            <small class="label">Stock Proyectado</small>
                                            <b style="font-size: 14px;">{{ tr.pro_stockCalmed }}</b>
                                        </div>
                                    </div>
                                </div>

                                <!-- COMENTADO POR SEGURIDAD SEGUN SOLICITUD -->
                                <!-- 
                                <vs-tooltip :text="tr.pro_stockCalmed < 0 ? 'No se admiten valores negativos.' : 'Stock actual'" position="right" :color="tr.pro_stockCalmed < 0 ? 'danger' : 'primary'">
                                    <template>‎</template>
                                    <b style="font-size: 13px; cursor: pointer; position: relative; padding-bottom: 2px;" :style="{color: tr.pro_stockCalmed < 0 ? '#D32F2F' : 'inherit', textShadow: tr.pro_stockCalmed < 0 ? '0px 2px 6px rgba(211, 47, 47, 0.5)' : 'none',}">{{ tr.pro_stockCalmed }}
                                        <span v-if="tr.pro_stockCalmed < 0" style="position: absolute;left: 0;bottom: 0;width: 100%;height: 2px;background: linear-gradient(to right, #D32F2F, transparent);border-radius: 2px;"></span>
                                    </b>
                                </vs-tooltip>
                                <vs-tooltip :text="tipoIngreso == 0 ? 'Stock a aumentar - Máx. 5 dígitos' : 'Stock a disminuir - Máx. 5 dígitos'" position="bottom" color="primary">
                                    <template>‎</template>
                                    <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_stockCalmed_nuevo" @blur="EstablecerDefaultVacio(tr, 'pro_stockCalmed_nuevo')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                                </vs-tooltip>
                                -->
                            </vs-td>
                            <!-- <vs-td align="center">
                                <vs-tooltip :text="tr.pro_deposito < 0 ? 'No se admiten valores negativos.' : 'Stock actual'" position="right" :color="tr.pro_deposito < 0 ? 'danger' : 'primary'">
                                    <template>‎</template>
                                    <b style="font-size: 13px; cursor: pointer; position: relative; padding-bottom: 2px;" :style="{ color: tr.pro_deposito < 0 ? '#D32F2F' : 'inherit', textShadow: tr.pro_deposito < 0 ? '0px 2px 6px rgba(211, 47, 47, 0.5)' : 'none' }">
                                        {{ tr.pro_deposito }}
                                        <span v-if="tr.pro_deposito < 0" style="position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background: linear-gradient(to right, #D32F2F, transparent); border-radius: 2px;"></span>
                                    </b>
                                </vs-tooltip>
                                <vs-tooltip :text="[2,14,15,16,17].includes(tr.gru_pro_codigo) ? 'No disponible para GUÍAS' : (tipoIngreso == 0 ? 'Stock a aumentar - Máx. 5 dígitos' : 'Stock a disminuir - Máx. 5 dígitos')" position="bottom" color="primary">
                                    <template>‎</template>
                                    <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_deposito_nuevo" :disabled="[2,14,15,16,17].includes(tr.gru_pro_codigo)" @blur="EstablecerDefaultVacio(tr, 'pro_deposito_nuevo')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                                </vs-tooltip>
                            </vs-td> -->
                            <!-- <vs-td align="center">
                                <vs-tooltip :text="tr.pro_depositoCalmed < 0 ? 'No se admiten valores negativos.' : 'Stock actual'" position="right" :color="tr.pro_depositoCalmed < 0 ? 'danger' : 'primary'">
                                    <template>‎</template>

                                    <b style="font-size: 13px; cursor: pointer; position: relative; padding-bottom: 2px;" :style="{ color: tr.pro_depositoCalmed < 0 ? '#D32F2F' : 'inherit', textShadow: tr.pro_depositoCalmed < 0 ? '0px 2px 6px rgba(211, 47, 47, 0.5)' : 'none' }">
                                        {{ tr.pro_depositoCalmed }}
                                        <span v-if="tr.pro_depositoCalmed < 0" style="position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background: linear-gradient(to right, #D32F2F, transparent); border-radius: 2px;"></span>
                                    </b>
                                </vs-tooltip>
                                <vs-tooltip :text="[2,14,15,16,17].includes(tr.gru_pro_codigo) ? 'No disponible para GUÍAS' : (tipoIngreso == 0 ? 'Stock a aumentar - Máx. 5 dígitos' : 'Stock a disminuir - Máx. 5 dígitos')" position="bottom" color="primary">
                                    <template>‎</template>
                                    <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_depositoCalmed_nuevo" :disabled="[2,14,15,16,17].includes(tr.gru_pro_codigo)" @blur="EstablecerDefaultVacio(tr, 'pro_depositoCalmed_nuevo')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                                </vs-tooltip>
                            </vs-td> -->
                            <vs-td align="center">
                                <vs-button flat @click="eliminarRegistroDB(tr);" color="danger" type="relief" icon="delete">
                                    <span> Quitar</span>
                                </vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
    </vs-row>
    <br>
    <vs-col vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="DatosAcumuladosStockMasivo.length > 0">
        <div align="center">
            <div align="center" style="font-size: 20px; font-weight: bold;">
                Una vez de click en el botón "{{ tipoIngreso == 0 ? 'Finalizar Ingreso No Operativo' : 'Finalizar Egreso No Operativo' }}" no podrá volver a editar
                y los stock's de los productos {{ tipoIngreso == 0 ? 'incrementarán' : 'disminuirán' }} las cantidades correspondientemente.
            </div>
            <br>
            <vs-button @click="guardarConStock()" type="relief">
                {{ tipoIngreso == 0 ? 'Finalizar Ingreso No Operativo' : 'Finalizar Egreso No Operativo' }}
            </vs-button>&emsp;
        </div>
    </vs-col>
    <!-- Seccion popup de errroes -->
    <vs-popup class="informacionformhijodehijo" title="Stock's insuficientes" :active.sync="popupActivoErrorStock">
        <ErroresStock v-if="popupActivoErrorStock" :erroresStock_Lista="erroresStock_Lista" @change="changeHandleErrorStock" />
    </vs-popup>
</vx-card>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
const ErroresStock = () => import("@/views/facturacion/10_10_1_4/bodegas/Movimientos_Producto/Stocks_Insuficientes_Informacion_Movimiento.vue");
export default {
    data() {
        return {
            Proveedores: [],
            productosDisponibles: [],
            ProductosOriginales: [],
            Productos: [],
            pro_codigo: [],
            DatosAcumuladosStockMasivo: [],
            MovimientoProducto: [],
            datosSeleccionadoLibros: [],
            tipoIngreso: 0,
            deshabilitarRadio: false,
            popupActivoErrorStock: false,
            erroresStock_Lista: [],
        };
    },
    components: {
        "v-select": vSelect,
        ErroresStock,
    },
    props: {
        idmovimiento: {
            type: Object,
            default: function () {
                return {}
            }
        },
        CompletoIngreso: {
            type: String,
            default: '',
        },
        btn_propiedades: Object,
    },
    mounted() {
        this.btn_propiedades.accion_guardar == 2 ? this.deshabilitarRadio = true : this.deshabilitarRadio = false;
        // console.log(this.idmovimiento, "yeeeeeeeeeeeee");
        if (this.idmovimiento.fmp_estado == 0) {
            this.tipoIngreso = 0;
        } else if (this.idmovimiento.fmp_estado == 2) {
            this.tipoIngreso = 1;
        }
        this.getProveedores();
        this.getProductosParaStocks();
        if (this.btn_propiedades.accion_guardar === 2) {
            console.log("editando")
        }
    },
    methods: {
        getProveedores() {
            this.$vs.loading();
            this.$http.get(this.$server_url + 'Get_provedor')
                .then(res => {
                    this.Proveedores = res.data;
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    // this.$vs.loading.close();
                });
        },
        getProductosParaStocks() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'GetProductosSoloStocks')
                .then(res => {
                    // Guardar los productos originales
                    this.ProductosOriginales = res.data;
                    // Agregar una nueva propiedad `nombreCompleto` a cada producto
                    this.Productos = res.data.map(producto => ({
                        ...producto,
                        nombreCompleto: `${producto.pro_nombre} - (${producto.pro_codigo})`
                    }));
                    this.actualizarProductosDisponibles(); // Inicializar opciones en el select
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        actualizarProductosDisponibles() {
            let me = this;
            // Filtrar productos que no están en la tabla
            this.productosDisponibles = this.Productos.filter(
                prod => !this.DatosAcumuladosStockMasivo.some(
                    p => p.pro_codigo === prod.pro_codigo
                )
            );
        },
        eliminarRegistroDB(tr) {
            let me = this;
            // Eliminar el producto de la tabla
            this.DatosAcumuladosStockMasivo = this.DatosAcumuladosStockMasivo.filter(
                item => item.pro_codigo !== tr.pro_codigo
            );
            me.$vs.notify({
                text: 'Producto quitado de la tabla con éxito',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check',
            });
            // Actualizar los productos disponibles para incluir el producto eliminado
            this.actualizarProductosDisponibles();
        },
        AgregarItemsTabla() {
            let me = this;
            // Obtener productos seleccionados
            const productosSeleccionados = me.Productos.filter(prod =>
                me.pro_codigo.includes(prod.pro_codigo)
            );
            // console.log(productosSeleccionados, "pordutosss");
            if (productosSeleccionados.length == 0) {
                me.$vs.notify({
                    title: "Alerta",
                    text: "No se ha seleccionado ningún producto para añadir a la tabla.",
                    color: "danger",
                    position: "top-center",
                });
                return;
            }
            // Agregar productos seleccionados a la tabla
            productosSeleccionados.forEach(producto => {
                // Verificar si el producto ya está en la tabla
                if (!me.DatosAcumuladosStockMasivo.some(p => p.pro_codigo === producto.pro_codigo)) {
                    // Buscar los valores originales del producto en ProductosOriginales
                    let productoOriginal = me.ProductosOriginales.find(p => p.pro_codigo === producto.pro_codigo);
                    // console.log(productoOriginal, "porddddddd");
                    if (productoOriginal) {
                        // Sumar los valores de los campos pro_stock, pro_stockCalmed, pro_deposito y pro_depositoCalmed
                        let suma = (productoOriginal.pro_stock || 0) + (productoOriginal.pro_stockCalmed || 0) +
                            (productoOriginal.pro_deposito || 0) + (productoOriginal.pro_depositoCalmed || 0);
                        // Obtener el valor de pro_reservar si existe en el producto
                        let pro_reservar_anterior = producto.pro_reservar || 0; // Asigna 0 si no existe pro_reservar
                        let pro_stock_anterior = producto.pro_stock || 0; // Asigna 0 si no existe pro_stock
                        let pro_stockCalmed_anterior = producto.pro_stockCalmed || 0; // Asigna 0 si no existe pro_stockCalmed
                        let pro_deposito_anterior = producto.pro_deposito || 0; // Asigna 0 si no existe pro_deposito
                        let pro_depositoCalmed_anterior = producto.pro_depositoCalmed || 0; // Asigna 0 si no existe pro_depositoCalmed
                        // Agregar el producto con la suma calculada
                        me.DatosAcumuladosStockMasivo.push({
                            ...productoOriginal, // Se usa el valor original sin modificación
                            valornuevosumado: suma,
                            calculoaplicara_pro_reservar: 0,
                            pro_reservar_nuevo: 0,
                            pro_stock_nuevo: 0,
                            pro_stockCalmed_nuevo: 0,
                            pro_deposito_nuevo: 0,
                            pro_depositoCalmed_nuevo: 0,
                            pro_reservar_anterior: pro_reservar_anterior,
                            pro_stock_anterior: pro_stock_anterior,
                            pro_stockCalmed_anterior: pro_stockCalmed_anterior,
                            pro_deposito_anterior: pro_deposito_anterior,
                            pro_depositoCalmed_anterior: pro_depositoCalmed_anterior
                        });
                        console.log(me.DatosAcumuladosStockMasivo, "dataj");
                    }
                }
                // console.log(me.DatosAcumuladosStockMasivo, "data nuewwwwww");
            });
            // Limpiar selección después de agregar y actualizar productos disponibles
            me.pro_codigo = []; // Limpiar v-model del select
            me.actualizarProductosDisponibles();
        },
        EstablecerDefaultVacio(tr, field) {
            if (!tr[field] || tr[field] === '') {
                tr[field] = 0; // Asignar valor 0 si está vacío
            }
        },
        actualizarProReservar(tr) {
            let suma4stocks = (Number(tr.pro_stock_nuevo) || 0) +
                (Number(tr.pro_stockCalmed_nuevo) || 0) +
                (Number(tr.pro_deposito_nuevo) || 0) +
                (Number(tr.pro_depositoCalmed_nuevo) || 0);

            if (this.tipoIngreso == 0) {
                // Si tipoIngreso es 0, se suma
                tr.pro_reservar_nuevo = suma4stocks;
                tr.pro_reservar = parseInt(tr.pro_reservar_anterior) + parseInt(suma4stocks);
                tr.pro_stock = tr.pro_stock_nuevo ? parseInt(tr.pro_stock_anterior) + parseInt(tr.pro_stock_nuevo) : parseInt(tr.pro_stock_anterior);
                tr.pro_stockCalmed = tr.pro_stockCalmed_nuevo ? parseInt(tr.pro_stockCalmed_anterior) + parseInt(tr.pro_stockCalmed_nuevo) : parseInt(tr.pro_stockCalmed_anterior);
                tr.pro_deposito = tr.pro_deposito_nuevo ? parseInt(tr.pro_deposito_anterior) + parseInt(tr.pro_deposito_nuevo) : parseInt(tr.pro_deposito_anterior);
                tr.pro_depositoCalmed = tr.pro_depositoCalmed_nuevo ? parseInt(tr.pro_depositoCalmed_anterior) + parseInt(tr.pro_depositoCalmed_nuevo) : parseInt(tr.pro_depositoCalmed_anterior);
            } else if (this.tipoIngreso == 1) {
                // Si tipoIngreso es 1, se resta
                tr.pro_reservar_nuevo = suma4stocks;
                tr.pro_reservar = parseInt(tr.pro_reservar_anterior) - parseInt(suma4stocks);
                tr.pro_stock = tr.pro_stock_nuevo ? parseInt(tr.pro_stock_anterior) - parseInt(tr.pro_stock_nuevo) : parseInt(tr.pro_stock_anterior);
                tr.pro_stockCalmed = tr.pro_stockCalmed_nuevo ? parseInt(tr.pro_stockCalmed_anterior) - parseInt(tr.pro_stockCalmed_nuevo) : parseInt(tr.pro_stockCalmed_anterior);
                tr.pro_deposito = tr.pro_deposito_nuevo ? parseInt(tr.pro_deposito_anterior) - parseInt(tr.pro_deposito_nuevo) : parseInt(tr.pro_deposito_anterior);
                tr.pro_depositoCalmed = tr.pro_depositoCalmed_nuevo ? parseInt(tr.pro_depositoCalmed_anterior) - parseInt(tr.pro_depositoCalmed_nuevo) : parseInt(tr.pro_depositoCalmed_anterior);
            }
        },
        validateInput(event, tr) {
            const charCode = event.which ? event.which : event.keyCode;
            // Permitir solo números
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
            // Obtener el valor actual del input
            const currentValue = event.target.value;
            // Obtener el valor potencial si el nuevo carácter es agregado
            const newValue = parseInt(currentValue + String.fromCharCode(charCode));
        },
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');

            // Filtrar solo los números del texto pegado
            const numbersOnly = pastedText.replace(/[^\d]/g, '');

            // Insertar el texto filtrado en la posición del cursor
            document.execCommand("insertText", false, numbersOnly);

            // Prevenir la acción de pegar por defecto
            event.preventDefault();
        },
        guardarConStock() {
            let me = this;
            let datosParaGuardar = {};
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            // let periodo_id = localStorage.getItem('periodo_id');
            // console.log(me.DatosAcumuladosStockMasivo, "datos compeltos final");
            if (me.tipoIngreso == 0) {
                // Si me.tipoIngreso es 0, usar la estructura base
                datosParaGuardar = {
                    DatosAcumuladosStockMasivo: me.DatosAcumuladosStockMasivo,
                    tipoIngreso: me.tipoIngreso,
                    fmp_id: me.CompletoIngreso,
                    user_created: usuarioObjeto.idusuario,

                };
            } else if (me.tipoIngreso == 1) {
                // Si me.tipoIngreso es 1
                datosParaGuardar = {
                    DatosAcumuladosStockMasivo: me.DatosAcumuladosStockMasivo,
                    tipoIngreso: me.tipoIngreso,
                    fmp_id: me.CompletoIngreso,
                    user_created: usuarioObjeto.idusuario,
                };
            } else {
                console.log("tipoIngreso no controlado");
                return;
            }
            // console.log(datosParaGuardar, "ffffffffffffffffffff");
            // return
            this.$vs.loading();
            this.$http.post(this.$server_url + 'guardarDatosMovimientosProducto_Stock', datosParaGuardar)
                .then(res => {
                    this.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 7000,
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                        return
                    } else if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 7000,
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    } else if (res.data.status == 3) {
                        me.erroresStock_Lista = res.data;
                        me.popupActivoErrorStock = true;
                        // console.log('Capturo estado 3');
                    }

                })
                .catch(error => {
                    console.error('Error al guardar los datos:', error);
                    this.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error Interno, no puede guardar el Movimiento.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000,
                    })
                    return
                });
        },
        f_guardar_movimiento() {
            // console.log("entra a guardar movimiento", this.idmovimiento, 'tipo ingreso ',this.tipoIngreso);
            this.$emit('f_guardar', {
                idmovimiento: this.idmovimiento,
                tipoIngreso: this.tipoIngreso
            });
            this.$emit('actualizarBtnPropiedades', {
                accion_guardar: 2, // Cambiar a modo editar
                btn_txt: 'Editar',
                btn_color: 'warning',
            });
            this.deshabilitarRadio = true;
        },
        changeHandleErrorStock(e) {
            let me = this;
            if (e.verificacionemitdeerrorlistado == 2) {
                me.popupActivoErrorStock = false;
                console.log("Emit recibido por cancelar.")
            } else if (e.verificacionemitdeerrorlistado == 1) {
                me.popupActivoErrorStock = false;
            }
        },
    },
};
</script>

<style scoped>
.table_pedidos {
    width: 100%;
    border-collapse: collapse;
}

.table_pedidos tr:hover {
    background-color: #f8f8f8 !important;
}

/* Estilos para contenedores de stock */
.stock-container, .calmed-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 8px 4px;
    min-width: 110px;
}

.stock-item, .calmed-actual {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
}

.label {
    font-size: 9px;
    text-transform: uppercase;
    color: #a0a0a0;
    font-weight: 600;
    margin-bottom: 2px;
}

.value-base {
    font-size: 14px;
    font-weight: 600;
    color: #4a4a4a;
}

.variation-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: bold;
}

.projected {
    border-radius: 6px;
    padding: 4px 10px;
    border: 1px dashed #ddd;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.value-total {
    font-size: 16px;
    font-weight: 800;
}

/* Estilos específicos para Calmed */
.calmed-header {
    margin-bottom: 5px;
}

.calmed-input-section {
    width: 100%;
    max-width: 90px;
}

.custom-input-stock :deep(.vs-input--input) {
    text-align: center;
    font-weight: bold;
    border: 1.5px solid #dcdcdc !important;
}

.custom-input-stock :deep(.vs-input--input:focus) {
    border-color: rgba(var(--vs-primary), 1) !important;
}

.calmed-footer {
    margin-top: 3px;
}

.calmed-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
}

.result-error {
    border: 2px solid #EA5455 !important;
    border-radius: 8px;
    padding: 4px 8px;
    background-color: #fff5f5;
    animation: pulse-danger 1.5s infinite alternate;
}

@keyframes pulse-danger {
    from { transform: scale(1); box-shadow: 0 0 5px rgba(234, 84, 85, 0.2); }
    to { transform: scale(1.02); box-shadow: 0 0 12px rgba(234, 84, 85, 0.5); }
}

/* Clases de utilidad */
.bg-light-success { background-color: #e8f9f0; border-color: #28C76F !important; }
.bg-light-warning { background-color: #fff9e6; border-color: #FF9F43 !important; }
.bg-light-danger { background-color: #fff1f1; border-color: #EA5455 !important; }
.text-success { color: #28C76F; }
.text-warning { color: #FF9F43; }
.text-danger { color: #EA5455; }
</style>
