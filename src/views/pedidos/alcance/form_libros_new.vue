<template>
<div>
    <div class="w-full flex flex-wrap gap-10 items-center text-xl justify-end">
        <vs-radio color="warning" v-model="tipo_form" vs-value="textos" vs-name="tipo_textos" @input="activar_tipo()">Textos</vs-radio>
        <!-- <vs-radio color="warning" v-model="tipo_form" vs-value="guias" vs-name="tipo_guias" @input="activar_tipo()">Guías</vs-radio> -->
    </div>
    <!-- {{Arrayalcance}} -->
    <vs-collapse>
        <vs-collapse-item v-for="(item, index) in series" :key="item.id_serie">
            <div slot="header" class="text-center">
                <br>
                <table>
                    <tr>
                        <td width="1000" v-if="item.totalPvnCantidad > 0">
                            <table>
                                <tr>
                                    <td>
                                        <b style="font-size: 12px;">Total Textos</b>
                                    </td>
                                    <td class="input_totales" width="150" align="center">
                                        <!-- Mostrar la suma total para esta serie -->
                                        {{ item.totalPvnCantidad }}
                                    </td>
                                    <td style="font-size: 12px;"><b>Subtotal usd</b></td>
                                    <td class="input_totales" width="150" align="center">
                                        ${{ item.totalPvpUsd.toFixed(2) }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td width="1000"><b>{{item.nombre_serie.toUpperCase()}}</b></td>
                    </tr>
                </table>
            </div>
            <div v-if="item.id_serie == 19" class="px-4 py-2" style="max-width: 680px; margin: 0 auto;">
              <!-- Radio buttons para el modo de búsqueda -->
              <div style="display: flex; gap: 20px; margin-bottom: 10px; user-select: none;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 500; color: #2c7be5;">
                  <input type="radio" v-model="modo_busqueda_combo" value="combo" @change="limpiarBusqueda" style="accent-color: #2c7be5;">
                  🔍 Buscar por Combo
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 500; color: #28a745;">
                  <input type="radio" v-model="modo_busqueda_combo" value="individual" @change="limpiarBusqueda" style="accent-color: #28a745;">
                  📖 Buscar por Libro Individual
                </label>
              </div>

              <!-- Modo: Búsqueda por Combo -->
              <template v-if="modo_busqueda_combo === 'combo'">
                <div data-combo-select-ref>
                  <v-select @input="handleSearchChange" style="width: 100%;" placeholder="--Buscar y seleccionar--" v-model="codigos_combo_buscar" label="nombreCompleto" class="mb-4" :options="productos_Libros_Series" :reduce="(productos_Libros_Series) => productos_Libros_Series.codigo_liquidacion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #2c7be5; font-size: 14px; font-weight: 500; font-style: normal; user-select: none;">
                    <i class="fas fa-info-circle" aria-hidden="true" style="font-size: 16px;"></i>
                    <span>Selecciona un combo para buscar. El sistema resaltará y te llevará a la coincidencia.</span>
                </div>
                <div v-if="searchNotFound" style="color: red; font-weight: bold; padding: 10px; border: 1px solid red; border-radius: 5px; background: #fff5f5; margin-bottom: 10px;">
                    No se encontraron resultados en el listado para esta búsqueda.
                </div>
                <!-- Barra sticky combo: ir al filtro -->
                <div v-if="codigos_combo_buscar" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; background: linear-gradient(135deg,#1a56db,#2c7be5); border-radius: 14px; padding: 10px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 6px 24px rgba(44,123,229,0.5); user-select: none;">
                  <span style="font-weight: 600; color: #fff; font-size: 13px; flex: 0 0 220px; width: 220px; white-space: normal; word-break: break-word; line-height: 1.2; max-height: 40px; overflow-y: auto; overflow-x: hidden; display: block; padding-right: 4px;">
                    🔍 {{ (productos_Libros_Series.find(p => p.codigo_liquidacion === codigos_combo_buscar) || {}).nombre || codigos_combo_buscar }}
                  </span>
                  <button @click="irAlFiltroCombo" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 5px 14px; cursor: pointer; font-size: 13px; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.35)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    ✏️ Seleccionar otro combo
                  </button>
                  <button @click="limpiarBusqueda" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,80,80,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ✖
                  </button>
                </div>
              </template>

              <!-- Modo: Búsqueda por Libro Individual -->
              <template v-if="modo_busqueda_combo === 'individual'">
                <div data-individual-select-ref>
                  <v-select @input="handleIndividualSearchChange" style="width: 100%;" placeholder="--Buscar por libro/s individual/es--" multiple :closeOnSelect="false" v-model="codigos_libro_individual_buscar" label="nombreCompleto" class="mb-4" :options="productos_Libros_Individuales" :reduce="(p) => p.codigo_liquidacion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #2c7be5; font-size: 14px; font-weight: 500; user-select: none;">
                    <i class="fas fa-info-circle" aria-hidden="true" style="font-size: 16px;"></i>
                    <span>Selecciona uno o varios libros individuales para encontrar los combos que los contengan.</span>
                </div>
                <!-- Barra sticky de navegación -->
                <div v-if="codigos_libro_individual_buscar.length > 0 && searchResultsIndividual.length > 0"
                     style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; background: linear-gradient(135deg,#1a56db,#2c7be5); border-radius: 14px; padding: 10px 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 6px 24px rgba(44,123,229,0.5); user-select: none;">
                  <button @click="navegarResultado(-1)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 4px 12px; cursor: pointer; font-size: 16px;">&#9664;</button>
                  <span style="font-weight: 600; color: #fff; font-size: 13px;">
                    Resultado {{ currentIndividualResultIndex + 1 }} de {{ searchResultsIndividual.length }}
                  </span>
                  <button @click="navegarResultado(1)" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 4px 12px; cursor: pointer; font-size: 16px;">&#9654;</button>
                  <button @click="irAlFiltroIndividual" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px; padding: 5px 14px; cursor: pointer; font-size: 13px; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.35)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    ✏️ Añadir/quitar texto/s al filtro
                  </button>
                  <button @click="limpiarBusqueda" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,80,80,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ✖
                  </button>
                </div>
                <div v-if="codigos_libro_individual_buscar.length > 0 && searchResultsIndividual.length === 0" style="color: red; font-weight: bold; padding: 10px; border: 1px solid red; border-radius: 5px; background: #fff5f5; margin-bottom: 10px;">
                    No se encontraron combos con esos libros.
                </div>
              </template>
            </div>
            <div class="w-full" style="overflow-x:auto;">
                <table class="table_pedidos">
                    <thead class="text-center">
                        <th style="width: 100px;"><b>Áreas</b></th>
                        <th :colspan="item.areas[0].libros.length + 1"><b>Niveles</b></th>
                        <!-- +1 for the Niveles header itself -->
                    </thead>
                    <!-- Mostrar TODAS las ÁREAS y LIBROS (sin ocultar al buscar) -->
                    <tr class="text-center" align="center" v-for="(tr, indextr) in item.areas" :key="tr.idarea">
                        <td :class="{'resaltado-area': isAreaMatchingSearch(tr)}" style="background-color: #046AE7;color:white;"><b>{{tr.nombrearea}}</b></td>
                        <td align="left">
                            <div v-for="(libro, libroIndex) in tr.libros" :key="libroIndex" style="display: inline-flex;">
                                <table style="width: 150px; border: 1px solid #000; margin: 0.5px" :class="{'libro-resaltado': isLibroMatchingSearch(libro, tr), 'libro-resaltado-individual': isLibroMatchingIndividual(libro)}">
                                    <tr>
                                        <td align="center" style="border: transparent">
                                            <div v-if="tr.idarea != 69">
                                                <p class="font-bold">[{{ libro.pro_codigo }}]</p>
                                                <b>{{ libro.year }}</b>
                                                <div v-if="item.id_serie == 19 && libro.pro_codigos_desglose && libro.pro_codigos_desglose.length > 0">
                                                    <div style="float: right;">
                                                        <vx-tooltip :text="libro.descripcionlibro" position="top" color="primary">
                                                            <i class="fas fa-info-circle" style="font-size: 13px; color: #2196f3; cursor: pointer;"></i>
                                                        </vx-tooltip>
                                                    </div>
                                                    <div style="padding: 0px; text-align: center;">
                                                        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; padding: 2px 4px;">
                                                            <vx-tooltip v-for="(combo, idx) in libro.pro_codigos_desglose" :key="idx" :text="libro.pro_codigos_desglose_regalados && libro.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion) ? combo.nombrelibro + ' (REGALO)' : combo.nombrelibro" position="top" :color="libro.pro_codigos_desglose_regalados && libro.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion) ? 'success' : 'primary'">
                                                                <span :style="libro.pro_codigos_desglose_regalados && libro.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion) ? 'font-size: 11px; padding: 2px 6px; border-radius: 10px; border: 1px solid #28c76f; color: #28c76f; background-color: rgba(40, 199, 111, 0.15); white-space: nowrap; cursor: pointer; line-height: 1.2; font-weight: bold;' : 'font-size: 11px; padding: 2px 6px; border-radius: 10px; border: 1px solid #ccc; color: #333; background-color: transparent; white-space: nowrap; cursor: pointer; line-height: 1.2;'">
                                                                    <i v-if="libro.pro_codigos_desglose_regalados && libro.pro_codigos_desglose_regalados.some(r => r.codigo_liquidacion === combo.codigo_liquidacion)" class="fas fa-gift" style="margin-right: 3px;"></i>
                                                                    {{ combo.codigo_liquidacion }}
                                                                </span>
                                                            </vx-tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="min-height: 50px" v-else-if="tr.idarea == 69">{{ libro.nombrelibro }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="border: transparent">
                                            <div><b>PVP:</b> {{ libro.pfn_pvp }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="border: transparent">
                                            <div style="width: 90px;">
                                                <vs-tooltip text="Cantidad" position="top" :color="tr.pfn_estado ? 'warning' : 'primary'">
                                                    <template>‎</template>
                                                    <!-- <vs-input style="display: inline-flex;" class="w-full" v-model="libro.pvn_cantidad" @keypress="validarkey_pvn_cantidad($event, libro)" @paste="validarnopegar($event)" @blur="(userFacturador || userAdminFacturador) ? null : blur_pvn_cantidad(libro)" :readonly="userFacturador || userAdminFacturador" maxlength="4" /> -->
                                                    <vs-input style="display: inline-flex;" class="w-full" v-model="libro.pvn_cantidad" @keypress="validarkey_pvn_cantidad($event, libro)" @paste="validarnopegar($event)" @blur="blur_pvn_cantidad(libro)" maxlength="4" :class="{ 'cantidad-positiva': libro.pvn_cantidad > 0 }" />
                                                </vs-tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </vs-collapse-item>
    </vs-collapse>
    <div class="w-full text-right">
        {{tmpPedido[0]}}
        <b>
            CANTIDAD DE UNIDADES DE LIBROS TOTAL : <div style="width: 120px; display: inline-block;">{{calculos.cantidadtotal_libros}} </div><br>
            VENTA BRUTA : <div style="width: 120px; display: inline-block;">{{calculos.pvptotal_libros.toFixed(2)}} </div><br>
            <!-- {{porcentaje_descuento}}% COMISION: <div style="width: 120px; display: inline-block;">{{((total_usd*porcentaje_descuento)/100).toFixed(2) }} </div><br> -->
            <!-- TOTAL : <div style="width: 120px; display: inline-block;">{{(total_usd - ((total_usd*porcentaje_descuento)/100)).toFixed(2)}} </div> -->
            VENTA BRUTA SERIES BÁSICAS : <div style="width: 120px; display: inline-block;">{{ calculos.suma_seriesBasicas.toFixed(2) }} </div><br>
            MULTIPLICACION PORCENTAJE CONFG : <div style="width: 120px; display: inline-block;">{{ calculos.multiplicacionPConfigurado.toFixed(2) }} </div><br>
            CALCULO AUTORIZADO : <div style="width: 120px; display: inline-block;">{{ calculos.RestaAutorizada.toFixed(2) }} </div><br>
            {{porcentaje_descuento}}% COMISION CALCULO AUTORIZADO: <div style="width: 120px; display: inline-block;">{{ calculos.resultadoComisionAsesor.toFixed(2) }} </div><br>
            <!-- ANTICIPO <div style="width: 120px; display: inline-block;">{{ Math.abs(anticipoAprobado)  }} </div><br> -->
            ANTICIPO SUGERIDO<div style="width: 120px; display: inline-block;">{{ Math.abs(calculos.anticipo_calculado)  }} </div><br>
            PENDIENTE POR LIQUIDAR <div style="width: 120px; display: inline-block;">{{ calculos.pendienteLiquidar.toFixed(2) }} </div><br>
        </b>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    FormWizard,
    TabContent
} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import axios from 'axios'
export default {
    components: {
        FormWizard,
        TabContent,
        flatPickr,
        'v-select': vSelect,
    },
    data: () => ({
        tmpPedido: [],
        usuario: [],
        series: [],
        calculos: {
            cantidadtotal_libros: 0,
            pvptotal_libros: 0,
            suma_seriesBasicas: 0,
            multiplicacionPConfigurado: 0,
            RestaAutorizada: 0,
            resultadoComisionAsesor: 0,
            anticipo_calculado: 0,
            pendienteLiquidar: 0,
        },
        series_plan_lector: [],
        tipo_form: 'textos',
        id_periodo: '',
        id_pedido: '',
        total_usd: 0,
        total_unidades: 0,
        total_unidades_guias: 0,
        porcentaje_descuento: 0,
        porcentaje_descuento_series_basicas: 0,
        //variables para observacion y anticipo
        disableAsesor: false,
        pedido: {
            id_pedido: 0,
            periodo: '',
            tipo_venta: '',
            fecha_envio: '',
            fecha_entrega: '',
            institucion: '',
            asesor: '',
            descuento: '',
            anticipo: '',
            ifanticipo: 0,
            observacion: '',
            ruc: '',
            direccionInstitucion: '',
            nivel: '',
            tipo_descripcion: '',
            telefonoInstitucion: '',
            id_periodo: ''
        },
        //fin variables para  observacion y anticipo
        suma_bruta_series_b: 0,
        arregloSeriesBasicas: [],
        pendienteLiquidar: 0,
        anticipo_aprobado: 0,
        contrato_generado: '',
        multiplicacionPConfigurado: 0,
        RestaAutorizada: 0,
        resultadoComisionAsesor: 0,
        estado_alcance: 0,
        isrunLoading_metodoInicial: false,
        isrunLoading_blur_pvn_cantidad: false,
        codigos_combo_buscar: null,
        productos_Libros_Series: [],
        searchNotFound: false,
        modo_busqueda_combo: 'combo',
        codigos_libro_individual_buscar: [],
        productos_Libros_Individuales: [],
        searchResultsIndividual: [],
        currentIndividualResultIndex: 0,
        areaLibroMap: {},
        //variables de series basicas
    }),
    props: {
        selectifanticipo: {
            type: Boolean,
            default: false
        },
        anticipoAprobado: {
            type: Number,
            default: 0,
        },
        Arrayalcance: {
            type: [Array, Object], // Permite tanto un Array como un Object
            default: () => [] // Valor por defecto es un array vacío
        },
        sendPedido: {
            type: Object,
            default: '',
            required: true
        },
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'userFacturador', 'userAdminFacturador']),
    },
    mounted() {
        let me = this
        this.id_periodo = me.sendPedido.id_periodo
        this.id_pedido = me.Arrayalcance.id_pedido
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.usuario_id = this.usuario.idusuario
        me.estado_alcance = me.Arrayalcance.estado_alcance
        this.metodoInicial();

    },
    methods: {
        async metodoInicial() {
            let me = this;
            try {
                me.$vs.loading();
                me.isrunLoading_metodoInicial = true;
                await me.getAreasBasicas();
                await me.getSeries();
                await me.get_val_pedido();
                await me.calcularTotalPvnCantidad();
                // await me.calcularCantidadTotalLibros();
                // await me.calcularPVPTotalLibros();
                await me.calculosGenerales();
                await me.guardarTotalPedido();
                me.isrunLoading_metodoInicial = false;
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoInicial:', error);
                me.$vs.loading.close();
            }
        },
        async blur_pvn_cantidad(libro) {
            let me = this;
            // console.log(libro, "ejcutcion");
            if (libro.pvn_cantidad === libro.pvn_cantidad_original) {
                console.log("No hay cambios");
                return;
            }
            try {
                console.log("El valor ha cambiado");
                // Solo mostrar el loading si no está activo
                if (!me.isrunLoading_blur_pvn_cantidad) {
                    me.isrunLoading_blur_pvn_cantidad = true;
                    me.$vs.loading();
                }
                await me.setearencero_pvn_cantidad(libro);
                await me.guardarCantidad_PedidosValNew(libro);
                // await me.getSeries();
                await me.get_val_pedido();
                await me.calcularTotalPvnCantidad();
                // await me.calcularCantidadTotalLibros();
                // await me.calcularPVPTotalLibros();
                await me.calculosGenerales();
                await me.guardarTotalPedido();
                // Actualizar el valor original
                libro.pvn_cantidad_original = libro.pvn_cantidad; // Actualizar el valor original
            } catch (error) {
                console.error('Error en blur_pvn_cantidad:', error);
            } finally {
                // Cerrar loading solo si no hay otra ejecución en proceso
                me.isrunLoading_blur_pvn_cantidad = false;
                me.$vs.loading.close();
            }

        },
        async setearencero_pvn_cantidad(libro) {
            return new Promise((resolve, reject) => {
                // Convertir a número entero y eliminar ceros a la izquierda
                libro.pvn_cantidad = libro.pvn_cantidad ? parseInt(libro.pvn_cantidad, 10) : 0;
                resolve();
            });
        },
        async calcularTotalPvnCantidad() {
            return new Promise((resolve, reject) => {
                if (!Array.isArray(this.series)) {
                    console.error("`this.series` no es un array:", this.series);
                    return reject("`this.series` no es un array");
                }
                let cantidadtotalLibros = 0;
                let pvptotalLibros = 0;
                this.series.forEach(serie => {
                    let totalPvnCantidad = 0;
                    let totalPvpUsd = 0;
                    if (Array.isArray(serie.areas)) {
                        serie.areas.forEach(area => {
                            if (Array.isArray(area.libros)) {
                                area.libros.forEach(libro => {
                                    // Convertir a número antes de sumar
                                    totalPvnCantidad += +libro.pvn_cantidad || 0;
                                    const totalPvpUsdLibro = parseFloat(
                                        (libro.pfn_pvp * (+libro.pvn_cantidad || 0)).toFixed(2)
                                    );
                                    this.$set(libro, 'totalPvpUsdLibro', totalPvpUsdLibro);
                                    totalPvpUsd += totalPvpUsdLibro;
                                });
                            }
                        });
                    }
                    this.$set(serie, 'totalPvnCantidad', totalPvnCantidad);
                    this.$set(serie, 'totalPvpUsd', totalPvpUsd);
                    cantidadtotalLibros += totalPvnCantidad;
                    pvptotalLibros += totalPvpUsd;
                });
                this.calculos.cantidadtotal_libros = cantidadtotalLibros;
                this.calculos.pvptotal_libros = parseFloat(pvptotalLibros.toFixed(2));
                resolve();
            });
        },
        // async calcularCantidadTotalLibros() {
        //     return new Promise((resolve, reject) => {
        //         this.calculos.cantidadtotal_libros = this.series.reduce((total, serie) => {
        //             return total + serie.totalPvnCantidad;
        //         }, 0);
        //         resolve();
        //     });
        // },
        // async calcularPVPTotalLibros() {
        //     return new Promise((resolve, reject) => {
        //         this.calculos.pvptotal_libros = parseFloat(
        //             this.series.reduce((total, serie) => {
        //                 return total + serie.totalPvpUsd;
        //             }, 0).toFixed(2)
        //         );
        //         resolve();
        //     });
        // },
        async calculosGenerales() {
            // Extraer los nombres de serie basica
            let me = this;
            return new Promise((resolve, reject) => {
                // console.log(me.arregloSeriesBasicas, "arreglosbasioca");
                const nombresSeriesBasicas = me.arregloSeriesBasicas.map(item => item.nombre_serie);
                // console.log(nombresSeriesBasicas, "nombre extraidos");
                // Filtrar las series cuyo nombre coincide exactamente con los nombres en me.arregloSeriesBasicas
                const seriesFiltradas = me.series.filter(serie =>
                    nombresSeriesBasicas.some(nombreSerieBasica => nombreSerieBasica === serie.nombre_serie)
                );

                // Sumar los valores de totalPvpUsd de las series filtradas
                const totalSumado = parseFloat(seriesFiltradas.reduce((total, serie) => {
                    return total + serie.totalPvpUsd;
                }, 0).toFixed(2));

                me.calculos.suma_seriesBasicas = totalSumado;
                me.calculos.multiplicacionPConfigurado = parseFloat(((me.calculos.suma_seriesBasicas * me.porcentaje_descuento_series_basicas) / 100).toFixed(2));
                me.calculos.RestaAutorizada = parseFloat(((me.calculos.suma_seriesBasicas) - (me.calculos.multiplicacionPConfigurado)).toFixed(2));
                me.calculos.resultadoComisionAsesor = parseFloat(((me.calculos.RestaAutorizada * me.porcentaje_descuento) / 100).toFixed(2));
                me.calculos.anticipo_calculado = parseFloat(((me.calculos.resultadoComisionAsesor * 50) / 100).toFixed(2));
                // me.calculos.pendienteLiquidar = parseFloat(me.calculos.resultadoComisionAsesor - Math.abs(me.anticipoAprobado));
                me.calculos.pendienteLiquidar = parseFloat(me.calculos.resultadoComisionAsesor - Math.abs(me.calculos.anticipo_calculado));
                resolve();
            });
        },
        async getSeries() {
            let me = this;
            return new Promise((resolve, reject) => {
                if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                    me.$vs.loading();
                }
                this.$http.get(this.$server_url + 'series_formato_periodo_new/' + me.id_periodo + '/' + me.id_pedido + '/' + me.Arrayalcance.id)
                    .then(res => {
                        me.series = Object.values(res.data);
                        // Establecer pvn_cantidad_original en cada libro
                        me.series.forEach(serie => {
                            serie.areas.forEach(area => {
                                area.libros.forEach(libro => {
                                    libro.pvn_cantidad_original = libro.pvn_cantidad; // Guardar valor inicial
                                });
                            });
                        });
                        me.armarProductosLibrosSeries();
                        me.armarProductosLibrosIndividuales();
                        if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                            me.$vs.loading.close();
                        }
                        resolve();
                    })
                    .catch(error => {
                        // ⚠️ Capturar el error y mostrar en notify
                        let mensaje = 'Error inesperado';
                        if (error.response && error.response.data && error.response.data.message) {
                            mensaje = error.response.data.message;
                        } else if (error.message) {
                            mensaje = error.message;
                        }
                        me.$vs.notify({
                            text: mensaje,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 9000
                        });
                        if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                            me.$vs.loading.close();
                        }
                        reject(error);
                    });
            });
        },
        validarkey_pvn_cantidad(event, libro) {
            let numentero = libro.pvn_cantidad;
            // Verificar si la tecla presionada es un número.
            if (!/\d/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Validar el formato del número
            // if (!/^\d{0,5}(\.\d{0,3})?$/.test(numentero)) {
            //     libro.pvn_cantidad = '';
            //     console.log("reset");
            // }
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        restringirTab(event) {
            if (event.key === 'Tab') {
                event.preventDefault(); // Previene el cambio de foco con la tecla Tab
                console.log("Tecla Tab restringida");
            }
        },
        async getAreasBasicas() {
            let me = this;
            return new Promise((resolve, reject) => {
                this.$http.get(this.$server_url + 'getSeriesBasicas/' + me.id_periodo)
                    .then(res => {
                        me.arregloSeriesBasicas = res.data.filter(p => p.serie_basica == 1)
                        resolve();
                    })
            });
        },
        async get_val_pedido() {
            let me = this
            return new Promise((resolve, reject) => {
                if (!me.id_pedido) {
                    return
                }
                if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                    me.$vs.loading()
                }
                this.$http.get(this.$server_url + 'get_val_pedido_alcance_new/' + me.id_pedido + '/' + me.Arrayalcance.id)
                    .then(res => {
                        if (res.data.length <= 0) {
                            // console.log(res.data, "datarecibidaaaaaaaaaa1");
                            me.tmpPedido = 0;
                            me.porcentaje_descuento = 0;
                            me.porcentaje_descuento_series_basicas = 0;
                            me.contrato_generado = 0;
                            if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                                me.$vs.loading.close()
                            }
                        } else if (res.data.length > 0) {
                            // console.log(res.data, "datarecibidaaaaaaaaaa2");
                            me.tmpPedido = res.data[0]
                            me.porcentaje_descuento = res.data[0].descuento
                            me.porcentaje_descuento_series_basicas = res.data[0].porcentaje_descuento
                            me.contrato_generado = res.data[0].contrato_generado
                            if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                                me.$vs.loading.close()
                            }
                        }
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                        me.$vs.loading.close()
                    })
            })
        },
        async guardarCantidad_PedidosValNew(libro) {
            let me = this;
            return new Promise((resolve, reject) => {
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                // Busca el proveedor con el prov_id específico

                let datos = {
                    "idlibro": libro.idlibro,
                    "totalPvpUsdLibro": libro.totalPvpUsdLibro,
                    "pvn_cantidad": libro.pvn_cantidad,
                    "pvn_tipo": me.Arrayalcance.id,
                    "id_pedido": me.id_pedido
                }
                // console.log(datos, "datosssssss")
                // return;
                // return;
                if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                    me.$vs.loading()
                }
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'PostRegistrar_modificar_pedidos_alcanceNew', datos)
                    .then(res => {
                        // this.getMaterialcubiertaParametro();
                        if (res.data.status == "0") {
                            me.$vs.notify({
                                text: res.data.message, // Mensaje para el estado "0"
                                color: 'warning', // Color de advertencia para errores o situaciones especiales
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                        } else if (res.data.status == "1") {
                            me.$vs.notify({
                                text: res.data.message, // Mensaje para el estado "1"
                                color: 'success', // Color de éxito para confirmaciones
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                            me.$vs.loading.close()
                        }
                        resolve();
                    })
                    .catch(function () {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Registro no se pudo actualizar.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        reject(error);
                    })
            });
        },
        async guardarTotalPedido() {
            let me = this;
            return new Promise((resolve, reject) => {
                let total_usd_format = me.total_usd.toFixed(2)
                let formData = new FormData();
                formData.append('id', me.Arrayalcance.id)
                formData.append('id_periodo', me.id_periodo);
                formData.append('id_pedido', me.id_pedido);
                formData.append('venta_bruta', me.calculos.pvptotal_libros);
                formData.append('total_unidades', me.calculos.cantidadtotal_libros);
                formData.append('pendiente_liquidar', me.calculos.pendienteLiquidar);
                this.$http.post(this.$server_url + 'guardarValorAlcance', formData)
                    .then(function (res) {
                        if (res.data.status == 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        reject(error);
                    })
            });
        },

        armarProductosLibrosSeries() {
            let me = this;
            me.productos_Libros_Series = [];
            me.areaLibroMap = {};
            let comboMap = new Map();
            
            // Buscar la serie 19 (Combos)
            let serieCombos = null;
            if (Array.isArray(me.series)) {
                serieCombos = me.series.find(s => s.id_serie == 19);
            }

            if (serieCombos && serieCombos.areas) {
                serieCombos.areas.forEach(area => {
                    const areaKey = 'AREA_' + area.idarea;
                    me.areaLibroMap[areaKey] = new Set();

                    // Agregar entrada del área (grupo)
                    me.productos_Libros_Series.push({
                        codigo_liquidacion: areaKey,
                        nombre: area.nombrearea,
                        ifcombo: 2,
                        nombreCompleto: `📁 ${area.nombrearea}`
                    });

                    area.libros.forEach(libro => {
                        if (libro.pro_codigo) {
                            // Clave compuesta idarea__pro_codigo para identificar exactamente qué instancia
                            const compositeKey = String(area.idarea) + '__' + libro.pro_codigo;
                            me.productos_Libros_Series.push({
                                codigo_liquidacion: compositeKey,
                                nombre: libro.nombrelibro,
                                ifcombo: 1,
                                nombreCompleto: `   ${libro.nombrelibro} [${libro.pro_codigo}]`
                            });
                            me.areaLibroMap[areaKey].add(libro.pro_codigo);
                        }
                    });
                });
            }
            // No ordenamos: mantenemos el orden area → combos del area
        },
        limpiarBusqueda() {
            this.codigos_combo_buscar = null;
            this.codigos_libro_individual_buscar = [];
            this.searchResultsIndividual = [];
            this.currentIndividualResultIndex = 0;
            this.searchNotFound = false;
        },
        irAlFiltroCombo() {
            const el = document.querySelector('[data-combo-select-ref]');
            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({ top: rect.top + scrollTop - 120, behavior: 'smooth' });
                setTimeout(() => {
                    const vsInput = el.querySelector('input');
                    if (vsInput) vsInput.focus();
                }, 450);
            }
        },
        irAlFiltroIndividual() {
            const el = document.querySelector('[data-individual-select-ref]');
            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                window.scrollTo({ top: rect.top + scrollTop - 120, behavior: 'smooth' });
                setTimeout(() => {
                    const vsInput = el.querySelector('input');
                    if (vsInput) vsInput.focus();
                }, 450);
            }
        },
        isAreaMatchingSearch(tr) {
            if (!this.codigos_combo_buscar || typeof this.codigos_combo_buscar !== 'string') return false;
            return this.codigos_combo_buscar === 'AREA_' + tr.idarea;
        },
        isLibroMatchingSearch(libro, tr) {
            if (!this.codigos_combo_buscar || typeof this.codigos_combo_buscar !== 'string') {
                return false;
            }
            if (this.codigos_combo_buscar.startsWith('AREA_')) {
                return false;
            }
            // Clave compuesta: idarea__pro_codigo
            const parts = this.codigos_combo_buscar.split('__');
            if (parts.length === 2 && tr) {
                const [selectedAreaId, selectedProCodigo] = parts;
                return String(tr.idarea) === selectedAreaId && libro.pro_codigo === selectedProCodigo;
            }
            return this.codigos_combo_buscar === libro.pro_codigo;
        },
        handleSearchChange() {
            this.$nextTick(() => {
                if (!this.codigos_combo_buscar) {
                    this.searchNotFound = false;
                    return;
                }
                setTimeout(() => {
                    // Si es búsqueda por área, scroll al área resaltada
                    const isArea = typeof this.codigos_combo_buscar === 'string' && this.codigos_combo_buscar.startsWith('AREA_');
                    const selector = isArea ? '.resaltado-area' : '.libro-resaltado';
                    let matchedElements = document.querySelectorAll(selector);
                    if (matchedElements.length > 0) {
                        this.searchNotFound = false;
                        matchedElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        this.searchNotFound = true;
                    }
                }, 100);
            });
        },
        isLibroMatchingIndividual(libro) {
            if (!this.codigos_libro_individual_buscar || !this.codigos_libro_individual_buscar.length) {
                return false;
            }
            if (!libro.pro_codigos_desglose || !libro.pro_codigos_desglose.length) {
                return false;
            }
            const codigosDelCombo = libro.pro_codigos_desglose.map(c => c.codigo_liquidacion);
            return this.codigos_libro_individual_buscar.every(cod => codigosDelCombo.includes(cod));
        },
        handleIndividualSearchChange() {
            this.$nextTick(() => {
                if (!this.codigos_libro_individual_buscar || !this.codigos_libro_individual_buscar.length) {
                    this.searchResultsIndividual = [];
                    this.currentIndividualResultIndex = 0;
                    return;
                }
                setTimeout(() => {
                    let matchedElements = document.querySelectorAll('.libro-resaltado-individual');
                    this.searchResultsIndividual = Array.from(matchedElements);
                    this.currentIndividualResultIndex = 0;
                    if (this.searchResultsIndividual.length > 0) {
                        this.searchResultsIndividual[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            });
        },
        navegarResultado(direccion) {
            if (!this.searchResultsIndividual.length) return;
            this.currentIndividualResultIndex = (this.currentIndividualResultIndex + direccion + this.searchResultsIndividual.length) % this.searchResultsIndividual.length;
            this.searchResultsIndividual[this.currentIndividualResultIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        armarProductosLibrosIndividuales() {
            let me = this;
            me.productos_Libros_Individuales = [];
            me.$http.get(me.$server_url + 'Todo_Libros_Individuales_pedido_alcance_formatoprecio')
                .then(res => {
                    // La API ya filtra solo NO combos y ya trae nombreCompleto concatenado
                    me.productos_Libros_Individuales = res.data;
                })
                .catch(err => {
                    console.error('Error cargando libros individuales:', err);
                });
        },
    },
}
</script>

<style scoped>
table.table_pedidos tr:hover {
    background-color: #E6E6E6;
    border: 2px solid #7C7C7C;
    color: black !important;
}

table.table_pedidos th {
    border: 1px solid rgb(227, 227, 227);
    height: 25px;
}

table.table_pedidos {
    width: 100%;
    border-collapse: collapse;
}

.input_totales {
    background-color: #E6E6E6;
    color: #000000 !important;
    font-weight: bold;
}

.input_pvp {
    background-color: #046AE7;
    color: #fff !important;
    border-radius: 0%;
    width: 100%;
    height: 100%;
}

.test {
    color: white !important;
    background-color: #6B97F5;
}

.test:hover,
.guiaEstilo:hover {
    color: black;
}

.guiaEstilo {
    /* color:white!important;
          background-color: #E2B832; */
}

.test2 {
    background-color: #C4D333;
}

.con-vs-tooltip>.vs-con-input-label>.vs-con-input>.vs-inputx {
    text-align: center !important;
    content: justify !important;
}

.cantidad-positiva {
  background-color: #e6f4ea !important;  /* verde claro elegante */
  border: 1px solid #046AE7 !important;  /* borde verde elegante */
  box-shadow: 0px 0px 4px 1px #08356b; /* sombra sutil para resaltar */
  border-radius: 6px;
  transition: 0.3s ease-in-out;
}
.libro-resaltado {
    border: 3px solid #28c76f !important;
    background-color: #e8f9ee;
    box-shadow: 0px 0px 10px rgba(40, 199, 111, 0.5);
    transform: scale(1.02);
    transition: all 0.3s ease;
}
.resaltado-area {
    background-color: #FFD700 !important;
    color: #333 !important;
    outline: 3px solid #FF8C00;
    box-shadow: 0px 0px 12px rgba(255, 165, 0, 0.7);
    transition: all 0.3s ease;
}
.libro-resaltado-individual {
    border: 3px solid #28a745 !important;
    background-color: #d4edda;
    box-shadow: 0px 0px 12px rgba(40, 167, 69, 0.6);
    transform: scale(1.03);
    transition: all 0.3s ease;
}
</style>
