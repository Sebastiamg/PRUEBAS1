<template>
<vx-card fixed-height="true">
    <vs-divider>Seleccione el metodo de edición a usar</vs-divider>
    <div>
        <div style="display: inline-flex; margin: 0px 3px 0px 3px">
            <table align="center">
                <tr>
                    <td>
                        <ul class="flex mt-2">
                            <li>
                                <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="0" @change="radbuttonxSeleccion();">Edición por selección(Textos-Guías)</vs-radio>
                            </li>
                            <li>
                                <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="1" @change="radbuttonxGrupos();">Edición por grupos(Textos-Guías)</vs-radio>
                            </li>
                            <li>
                                <vs-radio v-model="tipo" class="ml-2" vs-name="radios1tipo" vs-value="2" @change="radbuttonxCombos();">Edición de combos</vs-radio>
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <vs-row v-if="tipo == 0">
        <vs-divider>Búsqueda y selección de producto(s)</vs-divider>
        <!-- {{ arrayConfiguration }} -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <div>
                <table align="center">
                    <tr>
                        <td width="1000">
                            <!-- <v-select style="width: 100%;" placeholder="--Buscar y seleccionar--" multiple :closeOnSelect="false" v-model="pro_codigo" label="pro_nombre" class="mb-4" :options="productosDisponibles" :reduce="(Productos) => Productos.pro_codigo" :dir="$vs.rtl ? 'rtl' : 'ltr'" /> -->
                            <v-select style="width: 100%;" placeholder="--Buscar y seleccionar--" multiple :closeOnSelect="false" v-model="pro_codigo" label="nombreCompleto" class="mb-4" :options="productosDisponibles" :reduce="(productosDisponibles) => productosDisponibles.pro_codigo" :dir="$vs.rtl ? 'rtl' : 'ltr'" :key="'select-productos-' + tipo" />
                        </td>
                        <td width="150">
                            <vs-button @click="AgregarItemsTabla();" color="success" type="relief">Agregar a la tabla</vs-button>&emsp;
                        </td>
                    </tr>
                </table>
            </div>
        </vs-col>
    </vs-row>
    <vs-row v-if="tipo == 1">
        <vs-divider>Edición por grupos</vs-divider>
        <!-- {{ arrayConfiguration }} -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <div>
                <table align="center">
                    <tr>
                        <td width="500">
                            <font style="font-size: 11.5px">&nbsp;Serie (Obligatorio)</font><br>
                            <v-select :options="SeriesArray" :reduce="SeriesArray => SeriesArray.id_serie" label="nombre_serie" class="w-full h-100" placeholder="--Seleccione una serie--" v-model="tabSeleccionbusqueda.serieSeleccionada" @input="metodoEjecucionSerie()" />
                        </td>
                        <td width="500">
                            <div v-if="tabSeleccionbusqueda.serieSeleccionada">
                                <font style="font-size: 11.5px">&nbsp;Área (Opcional)</font><br>
                                <v-select :options="AreasxSerieArray" :reduce="AreasxSerieArray => AreasxSerieArray.idarea" label="nombrearea" class="w-full h-100" placeholder="--Seleccione un area--" v-model="tabSeleccionbusqueda.areaSeleccionada" @input="metodoEjecucionArea()" />
                            </div>
                        </td>
                    </tr>
                </table>
                <table align="center" v-if="tabSeleccionbusqueda.serieSeleccionada">
                    <tr>
                        <td>
                            <ul class="flex mt-2">
                                <li>
                                    <vs-radio v-model="tipoproducto" class="ml-2" vs-name="radios1tipoproducto" vs-value="1" @change="AgregarItemsTabla2()">Textos y Guías</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipoproducto" class="ml-2" vs-name="radios1tipoproducto" vs-value="2" @change="AgregarItemsTabla2()">Solo Textos</vs-radio>
                                </li>
                                <li>
                                    <vs-radio v-model="tipoproducto" class="ml-2" vs-name="radios1tipoproducto" vs-value="3" @change="AgregarItemsTabla2()">Solo Guías</vs-radio>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
            </div>
        </vs-col>
    </vs-row>
    <vs-row v-if="tipo == 2">
        <vs-divider>Edición por combos</vs-divider>
        <vs-col vs-w="12" class="mb-3">
            <vs-alert color="warning" icon style="min-height: auto; white-space: normal; line-height: 1.6;">
                <template #title>
                    📦 Actualización de stock en combos
                </template>
                Al modificar el stock de un combo, se realizarán los siguientes ajustes automáticos:
                <ul style="margin-top: 8px; padding-left: 20px;">
                    <li>
                        ➕ <b>Si el stock a ingresar es mayor</b> al actual:
                        <ul style="padding-left: 18px; margin-top: 4px;">
                            <li>Se <b>aumentará</b> el stock del combo.</li>
                            <li>Se <b>descontarán</b> unidades de los códigos asociados.</li>
                        </ul>
                    </li>
                    <li style="margin-top: 10px;">
                        ➖ <b>Si el stock a ingresar es menor</b> al actual:
                        <ul style="padding-left: 18px; margin-top: 4px;">
                            <li>Se <b>reducirá</b> el stock del combo.</li>
                            <li>Se <b>aumentarán</b> unidades a los códigos asociados.</li>
                        </ul>
                    </li>
                </ul>
                <p style="margin-top: 12px;">
                    <b>Ejemplos:</b><br>
                    <span style="margin-left: 10px;">📌 <b>Caso 1:</b> Stock actual = <b>100</b>, stock nuevo = <b>150</b> → Se <b>agregan 50</b> al combo y se <b>restan 50</b> a los códigos asociados.</span><br>
                    <span style="margin-left: 10px;">📌 <b>Caso 2:</b> Stock actual = <b>100</b>, stock nuevo = <b>80</b> → Se <b>restan 20</b> al combo y se <b>agregan 20</b> a los códigos asociados.</span>
                </p>
            </vs-alert>
        </vs-col>
        <!-- {{ arrayConfiguration }} -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <div>
                <table align="center">
                    <tr>
                        <td width="1000">
                            <div>
                                <font style="font-size: 11.5px">&nbsp;Área (Opcional)</font><br>
                                <v-select :options="AreasxSerieCombosArray" :reduce="AreasxSerieCombosArray => AreasxSerieCombosArray.idarea" label="nombrearea" class="w-full h-100" placeholder="--Seleccione un area--" v-model="tabSeleccionbusqueda.areaSeleccionada" @input="metodoEjecucionArea()" />
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </vs-col>
    </vs-row>
    <!-- {{ DatosAcumuladosStockMasivo }} -->
    <vs-row v-if="DatosAcumuladosStockMasivo.length > 0" class="mb-5">
        <vs-col vs-w="12" vs-type="flex" vs-justify="end" vs-align="center" class="pr-4">
            <vs-button color="danger" type="relief" icon="warning" size="large" @click="confirmarReset()" class="shadow-lg px-5 py-3 font-semibold tracking-wide" style="min-width: 240px;">
                <b>Poner en cero los stock's de {{ DatosAcumuladosStockMasivo.length }} productos.</b>
            </vs-button>
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <!-- {{ DatosAcumuladosStockMasivo }} -->
            <vs-divider>Cantidad de producto/s a modificar: {{ DatosAcumuladosStockMasivo.length }}</vs-divider>
            <vs-table search :data="DatosAcumuladosStockMasivo" :max-items="DatosAcumuladosStockMasivo.length" no-data-text="Aún no se ha agregado ningún producto">
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
                        <vs-td><span><b style="font-size: 13px;">{{ tr.pro_codigo }}</b></span></vs-td>
                        <vs-td align="left">
                            <div>
                                <span><b style="font-size: 13px;">{{ tr.pro_nombre }}</b></span>
                            </div>
                            <div v-if="tr.iniciales_con_nombres" style="margin-top: 6px;">
                                <div style="font-size: 12px; color: #555;">
                                    <b style="color: #333;">📦 Códigos asociados:</b>
                                    <ul style="padding-left: 16px; margin: 4px 0 0 0;">
                                        <li v-for="(item, i) in separarIniciales(tr.iniciales_con_nombres)" :key="i" style="margin-left: 4px; list-style-type: none;">
                                            <template v-if="item.tipo === 'plus'">+ {{ item.valor }}</template>
                                            <template v-else>– {{ item.valor }}</template>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </vs-td>
                        <vs-td align="center" style="cursor: pointer;">
                            <vs-tooltip text="No se incluye el valor reservado en proformas." position="bottom" color="primary">
                                <template>‎</template>
                                <span><b style="font-size: 13px;">
                                        {{ tr.pro_reservar }}
                                    </b></span>
                            </vs-tooltip>
                        </vs-td>
                        <!-- <vs-td align="center">
                            <vs-tooltip text="Máx. 5 dígitos" position="bottom" color="primary">
                                <template>‎</template>
                                <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_stock" @blur="EstablecerDefaultVacio(tr, 'pro_stock')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                            </vs-tooltip>
                        </vs-td> -->
                        <vs-td align="center">
                            <vs-tooltip text="Máx. 5 dígitos" position="bottom" color="primary">
                                <template>‎</template>
                                <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_stockCalmed" @blur="EstablecerDefaultVacio(tr, 'pro_stockCalmed')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                            </vs-tooltip>
                        </vs-td>
                        <!-- <vs-td align="center">
                            <vs-tooltip :text="[2,14,15,16,17].includes(tr.gru_pro_codigo) ? 'No disponible para GUÍAS' : 'Máx. 5 dígitos'" position="bottom" color="primary">
                                <template>‎</template>
                                <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_deposito" :disabled="[2,14,15,16,17].includes(tr.gru_pro_codigo)" @blur="EstablecerDefaultVacio(tr, 'pro_deposito')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
                            </vs-tooltip>
                        </vs-td>
                        <vs-td align="center">
                            <vs-tooltip :text="[2,14,15,16,17].includes(tr.gru_pro_codigo) ? 'No disponible para GUÍAS' : 'Máx. 5 dígitos'" position="bottom" color="primary">
                                <template>‎</template>
                                <vs-input class="w-full hacer-click" placeholder="Cantidad" min="0" v-model="tr.pro_depositoCalmed" :disabled="[2,14,15,16,17].includes(tr.gru_pro_codigo)" @blur="EstablecerDefaultVacio(tr, 'pro_depositoCalmed')" @input="actualizarProReservar(tr)" @keypress="validateInput($event, tr)" @paste="validatePaste" maxlength="5" />
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
    <br><br>
    <vs-col v-if="DatosAcumuladosStockMasivo.length > 0" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardareditarStockMasivo()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
    <!-- Seccion dialog confirmacion de reseteo de stock -->
    <vs-prompt :active.sync="activePromptConfirmReset" :title="tituloPromptConfirmReset" color="warning" width="650px" accept-text="Sí, estoy de acuerdo" cancel-text="Cancelar" @accept="onAcceptConfirmReset">
        <div v-html="mensajePromptConfirmReset"></div>
    </vs-prompt>
    <!-- Seccion dialog verificacion de stock en cero -->
    <vs-prompt :title="tituloPrompt" :color="promptColor" :active.sync="activePromptError" class="ocultar-cancel" width="600px" accept-text="Entendido" @accept="onPromptAccept" cancel-text="">
        <div v-html="mensajePrompt"></div>
        <template #button-cancel>
            <!-- No renderizamos nada → botón desaparece -->
        </template>
    </vs-prompt>
    <!-- Seccion popup de errroes -->
    <vs-popup class="informacionformhijodehijo" title="Stock's insuficientes" :active.sync="popupActivoErrorStock">
        <ErroresStock v-if="popupActivoErrorStock" :erroresStock_Lista="erroresStock_Lista" @change="changeHandleErrorStock" />
    </vs-popup>
    <!-- Seccion popup de pro_reservar_no_negativo -->
    <vs-popup class="informacionformhijodehijo" title="Stock General insuficiente" :active.sync="popupActivoPro_reservar_negativo" @close="refrescarTablaStockMasivo();">
        <Pro_reservar_errores v-if="popupActivoPro_reservar_negativo" :lista_pro_reservar_negativos="lista_pro_reservar_negativos" @change="changeHandlePro_reservar_negativo" />
    </vs-popup>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";

import vSelect from "vue-select";
const ErroresStock = () => import("@/views/facturacion/10_10_1_4/orden_pedido/ediciones_stock_masiva/Stocks_Insuficientes_Informacion.vue");
const Pro_reservar_errores = () => import("@/views/facturacion/10_10_1_4/orden_pedido/ediciones_stock_masiva/Pro_reservar_no_negativo.vue");
export default {
    data() {
        return {
            productosFiltrados: [],
            Productos: [],
            SeriesArray: [],
            AreasxSerieArray: [],
            AreasxSerieCombosArray: [],
            DatosAcumuladosStockMasivo: [],
            productosDisponibles: [],
            pro_codigo: [],
            ProductosOriginales: [],
            ProductosxSerie_Area_Array: [],
            tipo: 0,
            tipoproducto: 1,
            tabSeleccionbusqueda: {
                serieSeleccionada: "",
                areaSeleccionada: "",
            },
            isrunLoading_metodoEjecucionSerie: false,
            isrunLoading_metodoEjecucionArea: false,
            usuariolocal: '',
            series_Temporal: [],
            idSerieCombos: '',
            erroresStock_Lista: [],
            lista_pro_reservar_negativos: [],
            popupActivoErrorStock: false,
            popupActivoPro_reservar_negativo: false,
            activePromptError: false,
            tituloPrompt: "",
            mensajePrompt: "",
            promptColor: "primary",
            activePromptConfirmReset: false,
            tituloPromptConfirmReset: '',
            mensajePromptConfirmReset: '',
            isrunLoading_metodoEjecucionGlobal: false
        };
    },
    components: {
        "v-select": vSelect,
        ErroresStock,
        Pro_reservar_errores,
    },
    mounted() {
        this.metodoCargaInicial();
    },
    methods: {
        async metodoCargaInicial() {
            let me = this;

            try {
                me.isrunLoading_metodoEjecucionGlobal = true;
                me.$vs.loading();
                // Ejecutar tareas en orden (esperar cada una)
                await me.getTodasSeries();
                await me.getProductosParaStocks();
                await me.getSeries();
                // Cargar usuario
                const usuariorespo = localStorage.getItem("usuario");
                me.usuariolocal = JSON.parse(usuariorespo);
                me.isrunLoading_metodoEjecucionGlobal = false;
                me.$vs.loading.close();

            } catch (error) {
                console.error("Error en carga inicial:", error);
                me.$vs.notify({
                    title: "Error",
                    text: "Error al cargar los datos iniciales.",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-circle"
                });
                me.isrunLoading_metodoEjecucionGlobal = false;
                me.$vs.loading.close();
            }
        },
        separarIniciales(texto) {
            const partes = []
            texto.split(/([,+])/).forEach((val, index, arr) => {
                if (val === ',' || val === '+') return // ignorar el separador
                const anterior = arr[index - 1]
                partes.push({
                    valor: val.trim(),
                    tipo: anterior === '+' ? 'plus' : 'coma',
                })
            })
            return partes
        },
        radbuttonxSeleccion() {
            let me = this;
            me.changeLimpiar();
            me.getProductosParaStocks();
        },
        radbuttonxGrupos() {
            let me = this;
            me.changeLimpiar();
        },
        radbuttonxCombos() {
            let me = this;
            me.changeLimpiar();
            me.metodoEjecucionSerie();
        },
        changeLimpiar() {
            let me = this;
            me.pro_codigo = [];
            me.DatosAcumuladosStockMasivo = [];
            me.tabSeleccionbusqueda = {
                serieSeleccionada: "",
                areaSeleccionada: "",
            };
        },
        async metodoEjecucionSerie() {
            let me = this;
            if (me.tipo == 1 && me.tabSeleccionbusqueda.serieSeleccionada) {
                try {
                    me.isrunLoading_metodoEjecucionSerie = true;
                    me.$vs.loading();
                    me.tabSeleccionbusqueda.areaSeleccionada = "";
                    await me.getAreasxSerie();
                    await me.AgregarItemsTabla2();
                    me.isrunLoading_metodoEjecucionSerie = false
                    me.$vs.loading.close();
                } catch (error) {
                    console.error('Error en metodoEjecucionSerie:', error);
                    me.$vs.loading.close();
                }
            } else if (me.tipo == 2) {
                try {
                    me.isrunLoading_metodoEjecucionSerie = true;
                    me.$vs.loading();
                    me.tabSeleccionbusqueda.areaSeleccionada = "";
                    await me.getAreasxSerieCombo();
                    await me.AgregarItemsTabla2();
                    me.isrunLoading_metodoEjecucionSerie = false
                    me.$vs.loading.close();
                } catch (error) {
                    console.error('Error en metodoEjecucionSerie:', error);
                    me.$vs.loading.close();
                }
            } else {
                me.DatosAcumuladosStockMasivo = [];
            }
        },
        async metodoEjecucionArea() {
            let me = this;
            if (me.tipo == 1) {
                try {
                    me.isrunLoading_metodoEjecucionArea = true;
                    me.$vs.loading();
                    await me.AgregarItemsTabla2();
                    me.isrunLoading_metodoEjecucionArea = false
                    me.$vs.loading.close();
                } catch (error) {
                    console.error('Error en metodoEjecucionArea:', error);
                    me.$vs.loading.close();
                }
            } else if (me.tipo == 2) {
                try {
                    me.isrunLoading_metodoEjecucionArea = true;
                    me.$vs.loading();
                    await me.AgregarItemsTabla2();
                    me.isrunLoading_metodoEjecucionArea = false
                    me.$vs.loading.close();
                } catch (error) {
                    console.error('Error en metodoEjecucionArea:', error);
                    me.$vs.loading.close();
                }
            } else {
                console.log("RADIO BUTTON NO CONTROLADO");
            }
        },
        getSeries() {
            let me = this;
            return new Promise((resolve, reject) => {
                if (me.isrunLoading_metodoEjecucionGlobal == false) {
                    me.$vs.loading();
                }

                this.$http.get(this.$server_url + 'getSeries_EdicionStock')
                    .then(function (res) {
                        me.SeriesArray = res.data.map(serie => ({
                            ...serie,
                            nombre_serie: me.ConvertiraTitleCase(serie.nombre_serie)
                        }));
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        reject("getSeries", error);
                    });
            });
        },
        async getAreasxSerie() {
            let me = this;
            if (me.isrunLoading_metodoEjecucionSerie == false) {
                me.$vs.loading();
            }
            return new Promise((resolve, reject) => {
                me.$http.get(me.$server_url + 'GetSacarAreasxSerieProducto', {
                        params: {
                            id_serie: me.tabSeleccionbusqueda.serieSeleccionada,
                        }
                    })
                    .then(function (res) {
                        me.AreasxSerieArray = res.data
                        resolve();
                        if (me.isrunLoading_metodoEjecucionSerie == false) {
                            me.$vs.loading.close()
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        if (me.isrunLoading_metodoEjecucionSerie == false) {
                            me.$vs.loading.close()
                        }
                        reject("getAreasxSerie", error);
                    })
            });
        },
        async getAreasxSerieCombo() {
            let me = this;
            if (me.isrunLoading_metodoEjecucionSerie == false) {
                me.$vs.loading();
            }
            return new Promise((resolve, reject) => {
                me.$http.get(me.$server_url + 'GetSacarAreasxSerieComboProducto', {
                        params: {
                            id_serie: me.idSerieCombos,
                        }
                    })
                    .then(function (res) {
                        me.AreasxSerieCombosArray = res.data
                        resolve();
                        if (me.isrunLoading_metodoEjecucionSerie == false) {
                            me.$vs.loading.close()
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        if (me.isrunLoading_metodoEjecucionSerie == false) {
                            me.$vs.loading.close()
                        }
                        reject(error);
                    })
            });
        },
        EstablecerDefaultVacio(tr, field) {
            if (!tr[field] || tr[field] === '') {
                tr[field] = 0; // Asignar valor 0 si está vacío
            }
        },
        ConvertiraTitleCase(text) {
            if (!text) return ''; // Manejar texto vacío o nulo
            return text
                .toLowerCase()
                .replace(/(^|\s)\S/g, char => char.toUpperCase()); // Convierte la primera letra de cada palabra
        },
        getTodasSeries() {
            let me = this;
            return new Promise((resolve, reject) => {
                if (me.isrunLoading_metodoEjecucionGlobal == false) {
                    me.$vs.loading();
                }
                this.$http.get(this.$server_url + 'series')
                    .then(res => {
                        // Guardar los productos originales
                        this.series_Temporal = res.data;
                        // Asignar el id a idSerieCombos o null si no existe
                        let serieCombos = this.series_Temporal.find(serie => serie.nombre_serie === "Combos");
                        this.idSerieCombos = serieCombos ? serieCombos.id_serie : null;
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        resolve();
                    })
                    .catch(err => {
                        console.log(err);
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        reject("getTodasSeries", error);
                    });
            });
        },
        getProductosParaStocks() {
            let me = this;
            return new Promise((resolve, reject) => {
                if (me.isrunLoading_metodoEjecucionGlobal == false) {
                    me.$vs.loading();
                }

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
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        resolve();
                    })
                    .catch(err => {
                        console.log(err);
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        reject("getProductosParaStocks", error);
                    });
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
                            sumainicial: suma, // Se agrega la suma calculada al objeto
                            valornuevosumado: suma,
                            calculoaplicara_pro_reservar: 0,
                            pro_reservar_anterior: pro_reservar_anterior,
                            pro_stock_anterior: pro_stock_anterior,
                            pro_stockCalmed_anterior: pro_stockCalmed_anterior,
                            pro_deposito_anterior: pro_deposito_anterior,
                            pro_depositoCalmed_anterior: pro_depositoCalmed_anterior
                        });
                        // console.log(me.DatosAcumuladosStockMasivo, "dataj");
                    }
                }
                // console.log(me.DatosAcumuladosStockMasivo, "data nuewwwwww");
            });
            // Limpiar selección después de agregar y actualizar productos disponibles
            me.pro_codigo = []; // Limpiar v-model del select
            me.actualizarProductosDisponibles();
        },
        async AgregarItemsTabla2() {
            let me = this;
            let datosaenviar = {}; // Definir fuera del if
            // console.log(me.tabSeleccionbusqueda.serieSeleccionada, "222", me.tabSeleccionbusqueda.areaSeleccionada, "valores")
            return new Promise((resolve, reject) => {
                if (me.tipo == 1) {
                    datosaenviar = {
                        "id_serie": me.tabSeleccionbusqueda.serieSeleccionada,
                        "idarea": me.tabSeleccionbusqueda.areaSeleccionada,
                        "tipo_producto": me.tipoproducto,
                        "tipo": me.tipo
                    }
                } else if (me.tipo == 2) {
                    datosaenviar = {
                        "id_serie": me.idSerieCombos,
                        "idarea": me.tabSeleccionbusqueda.areaSeleccionada,
                        "tipo_producto": 4, //Solo Textos
                        "tipo": me.tipo
                    }
                }
                if (me.isrunLoading_metodoEjecucionSerie == false) {
                    me.$vs.loading();
                }
                me.$http.get(me.$server_url + 'GetObtenerProductosxSerieoArea', {
                        params: datosaenviar
                    })
                    .then(function (res) {
                        if (res.data.error) { // Si la API devuelve un error en la respuesta
                            me.DatosAcumuladosStockMasivo = [];
                            me.$vs.notify({
                                text: 'No se encontraron productos',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle',
                                time: 7000
                            });
                            return resolve();
                        }
                        me.DatosAcumuladosStockMasivo = res.data;
                        me.DatosAcumuladosStockMasivo.forEach(producto => {
                            let suma = (producto.pro_stock || 0) +
                                (producto.pro_stockCalmed || 0) +
                                (producto.pro_deposito || 0) +
                                (producto.pro_depositoCalmed || 0);

                            // Asignar la suma a la variable sumainicial
                            producto.sumainicial = suma;
                            producto.valornuevosumado = suma;
                            producto.calculoaplicara_pro_reservar = 0;
                            producto.pro_reservar_anterior = producto.pro_reservar || 0;
                            producto.pro_stock_anterior = producto.pro_stock || 0;
                            producto.pro_stockCalmed_anterior = producto.pro_stockCalmed || 0;
                            producto.pro_deposito_anterior = producto.pro_deposito || 0;
                            producto.pro_depositoCalmed_anterior = producto.pro_depositoCalmed || 0;
                        });
                        // console.log(me.DatosAcumuladosStockMasivo, "ediciondegrupos");
                        if (me.isrunLoading_metodoEjecucionSerie == false) {
                            me.$vs.loading.close()
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        console.log(error, ' error');
                        if (!me.isrunLoading_metodoEjecucionSerie) {
                            me.$vs.loading.close();
                        }

                        if (error.response && error.response.status === 404) { // Si la API responde con un 404
                            me.DatosAcumuladosStockMasivo = [];
                            me.$vs.notify({
                                text: 'No se encontraron productos',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle',
                                time: 7000
                            });
                            return resolve();
                        }

                        reject("AgregarItemsTabla2", error);
                    });
            });
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
        // Método para actualizar `pro_reservar` automáticamente
        actualizarProReservar(tr) {
            // console.log(tr,"trrrrrrrr");
            // Calcula la suma y asigna el resultado a `pro_reservar`
            tr.valornuevosumado = (Number(tr.pro_stock) || 0) +
                (Number(tr.pro_stockCalmed) || 0) +
                (Number(tr.pro_deposito) || 0) +
                (Number(tr.pro_depositoCalmed) || 0);

            tr.calculoaplicara_pro_reservar = tr.valornuevosumado - tr.sumainicial;
            tr.pro_reservar = tr.pro_reservar_anterior + tr.calculoaplicara_pro_reservar;
        },
        guardareditarStockMasivo() {
            let me = this;
            let datosParaGuardar = {};
            let periodo_id = localStorage.getItem('periodo_id');
            // console.log(me.DatosAcumuladosStockMasivo, "datos compeltos final");
            if (me.tipo == 0 || me.tipo == 1) {
                // Si me.tipo es 0 o 1, usar la estructura base
                datosParaGuardar = {
                    DatosAcumuladosStockMasivo: me.DatosAcumuladosStockMasivo,
                    user_created: me.usuariolocal.idusuario,
                };
            } else if (me.tipo == 2) {
                // Si me.tipo es 2, añadir campos extra
                datosParaGuardar = {
                    DatosAcumuladosStockMasivo: me.DatosAcumuladosStockMasivo,
                    user_created: me.usuariolocal.idusuario,
                    EdicionCombos: 'yes',
                    periodo_id: periodo_id,
                    user_iniciales: me.usuariolocal.iniciales,
                    // Aquí puedes seguir agregando más campos extra
                };
            }
            // console.log(datosParaGuardar, "ffffffffffffffffffff");
            // return
            me.$vs.loading();
            me.$http.post(me.$server_url + 'GuardarDatosEdicionStockMasiva', datosParaGuardar)
                .then(res => {
                    // me.obtenerDetalleMovimientoVenta();
                    // console.log("Respuesta completa:", res.data);
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 7000,
                        })
                        this.$emit('change', {
                            verificaredicionmasivaactualizar: 1
                        });
                    } else if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 7000,
                        })
                        this.$emit('change', {
                            verificaredicionmasivaactualizar: 1
                        });
                    } else if (res.data.status == 3) {
                        me.erroresStock_Lista = res.data;
                        me.popupActivoErrorStock = true;
                        // console.log('Capturo estado 3');
                    } else if (res.data.status == 5) {
                        // console.log('Capturo estado 5');
                        me.lista_pro_reservar_negativos = res.data.errores;
                        me.popupActivoPro_reservar_negativo = true;
                    }
                })
                .catch(error => {
                    console.error('Error al guardar los datos:', error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'No se puede guardar, complete la información de los productos añadidos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000,
                    })
                    return
                });
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
        changeHandlePro_reservar_negativo(e) {
            let me = this;
            if (e.verificacionemitdeerrorpro_reservar == 2) {
                me.popupActivoPro_reservar_negativo = false;
                me.refrescarTablaStockMasivo();
                console.log("Emit recibido por cancelar.")
            } else if (e.verificacionemitdeerrorpro_reservar == 1) {
                me.popupActivoPro_reservar_negativo = false;
                me.refrescarTablaStockMasivo();
            }
        },
        getCancelar() {
            this.$emit('change', {
                verificaredicionmasivaactualizar: 2
            });
        },
        async refrescarTablaStockMasivo() {
            this.$vs.loading();
            // Guardar productos actuales
            let codigosEnTabla = this.DatosAcumuladosStockMasivo.map(p => p.pro_codigo);
            if (this.tipo == 0) {
                await this.getProductosParaStocks();
                // Reconstruir tabla con datos nuevos
                this.pro_codigo = codigosEnTabla;
                this.DatosAcumuladosStockMasivo = [];
                this.AgregarItemsTabla();
            } else if (this.tipo == 1 || this.tipo == 2) {
                await this.AgregarItemsTabla2();
                // ✅ Filtrar SOLO los que el usuario dejó en la tabla
                this.DatosAcumuladosStockMasivo =
                    this.DatosAcumuladosStockMasivo.filter(p =>
                        codigosEnTabla.includes(p.pro_codigo)
                    );
            }
            this.$vs.loading.close();
        },
        async VerificarYResetear() {
            // ✅ Solo llamas al método común
            await this.refrescarTablaStockMasivo();
            let errores = [];
            let correctos = [];
            // 1️⃣ Verificación de stocks
            this.DatosAcumuladosStockMasivo.forEach(tr => {
                const suma =
                    (tr.pro_stock || 0) +
                    (tr.pro_stockCalmed || 0) +
                    (tr.pro_deposito || 0) +
                    (tr.pro_depositoCalmed || 0);
                if (suma !== (tr.pro_reservar || 0)) {
                    errores.push(tr.pro_codigo);
                } else {
                    correctos.push(tr);
                }
            });
            // 2️⃣ Cuando hay errores
            if (errores.length > 0) {
                // Resetear solo correctos
                correctos.forEach(tr => {
                    tr.pro_stock = 0;
                    tr.pro_stockCalmed = 0;
                    tr.pro_deposito = 0;
                    tr.pro_depositoCalmed = 0;
                    tr.pro_reservar = 0;
                    tr.valornuevosumado = 0;
                });
                const listaErrores = errores.map(e => `➡️ ${e}`).join("<br>");
                this.tituloPrompt = '⚠️ Inconsistencias detectadas';
                this.promptColor = 'warning';
                this.mensajePrompt =
                    `Los siguientes productos tienen inconsistencias, el Stock General NO coincide con la suma de los 4 stocks:<br><br>` +
                    `${listaErrores}<br><br>` +
                    `⚠ Los productos inconsistentes NO fueron asignados a 0.<br>` +
                    `✔ Los productos restantes SÍ se asignaron a 0.<br><br>` +
                    `Debe dar click en Guardar para aplicar los cambios.`;

                this.activePromptError = true;
                return;
            }
            // 3️⃣ Si NO hay errores → resetear todo
            this.DatosAcumuladosStockMasivo.forEach(tr => {
                tr.pro_stock = 0;
                tr.pro_stockCalmed = 0;
                tr.pro_deposito = 0;
                tr.pro_depositoCalmed = 0;
                tr.pro_reservar = 0;
                tr.valornuevosumado = 0;
            });
            // 4️⃣ Prompt de ÉXITO
            this.tituloPrompt = '✅ Verificación exitosa';
            this.promptColor = 'success';
            // 4️⃣ Prompt de ÉXITO
            this.mensajePrompt =
                `Todos los productos pasaron la verificación correctamente.<br><br>` +
                `✔ Todos los valores fueron reseteados a 0.<br><br>` +
                `<b>Para aplicar los cambios debe dar click en Guardar.</b>`;
            this.activePromptError = true;
        },
        onPromptAccept() {
            this.activePromptError = false;
            this.$vs.notify({
                color: "success",
                title: "Aceptado",
                text: "Tiene que guardar para que se apliquen los cambios.",
                time: 7000,
            });
        },
        confirmarReset() {
            if (!this.DatosAcumuladosStockMasivo.length) return;
            this.tituloPromptConfirmReset = '⚠️ Confirmar reseteo de stocks';
            this.mensajePromptConfirmReset = `
              <b>ATENCIÓN</b><br><br>
              Está a punto de colocar en <b>CERO</b> todos los valores de stock
              de los <b>${this.DatosAcumuladosStockMasivo.length} productos</b> listados:<br><br>
              ▸ Facturas Prolipa<br>
              ▸ Facturas Calmed<br>
              ▸ Notas Prolipa<br>
              ▸ Notas Calmed<br>
              ▸ Stock General<br><br>
              ❗ <b>Esta acción solo modifica los valores en pantalla.</b><br>
              ❌ <b>Los cambios NO se guardarán automáticamente.</b><br><br>
              ✅ Para aplicar definitivamente los cambios deberá presionar
              el botón <b>Guardar</b>.
          `;
            this.activePromptConfirmReset = true;
        },
        onAcceptConfirmReset() {
            this.activePromptConfirmReset = false;
            this.VerificarYResetear();
        },
    },
};
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
}
</style><style>
/* OCULTA EL BOTÓN CANCELAR SI NO TIENE TEXTO */
.vs-dialog-cancel-button:has(.vs-button-text:empty) {
    display: none !important;
}

/* CENTRA EL BOTÓN "ENTENDIDO" */
.vs-dialog__buttons {
    justify-content: center !important;
}
</style>
