<template>
<div>
    <div>
        <vs-row justify="center">
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-card class="seccionmostrartodo">
                    <!-- Encabezado -->
                    <div class="items-center bg-primary text-white py-2 rounded-t-lg" align="center">
                        <span class="text-sm font-semibold">Búsqueda</span>
                    </div>
                    <!-- Selección de productos -->
                    <div class="estilo-borde">
                        <label class="texto-claro font-medium">Seleccione la temporada:</label>
                        <!-- <v-select :options="Periodos_Busqueda" :reduce="Periodos_Busqueda => Periodos_Busqueda.idperiodoescolar" label="periodoescolar" class="w-full h-100" placeholder="--Seleccione la temporada--" v-model="tabSeleccionbusqueda.periodoSeleccionado" @input="metodoEjecucion_Apis()" style="cursor: pointer; font-size: 12px;" /> -->
                        <v-select ref="selectTemporada" :options="Periodos_Busqueda" label="periodoescolar" class="w-full h-100" placeholder="--Seleccione la temporada--" v-model="tabSeleccionbusqueda.periodoSeleccionadoObj" @input="metodoEjecucion_Apis()" style="cursor: pointer; font-size: 12px;" />
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>
    </div>
    <!-- {{ busquedaEjecutada }} -->
    <div class="botones-reporte" v-if="ProductoReporte.length > 0">
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="m_imprimirTodos('12px', obtenerNombreArchivoDescarga(), '0px')">Descargar Reporte Pdf</vs-button>
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="ExportToExcel()">Descargar Reporte Excel</vs-button>
    </div>
    <vx-card v-if="busquedaEjecutada == false && busquedaEnEspera == false" class="p-6 text-center flex justify-center items-center" style="margin-top: 10px; min-height: 300px;">
        <div>
            <h3 class="text-lg font-semibold">Seleccione una temporada para ver los combos.</h3>
        </div>
    </vx-card>
    <vx-card v-else-if="busquedaEnEspera == true" class="p-6 text-center flex justify-center items-center" style="margin-top: 10px; min-height: 300px;">
        <div>
            <h3 class="text-lg font-semibold">Espere...</h3>
        </div>
    </vx-card>
    <vx-card v-else-if="busquedaEjecutada == true && Producto_Agrupado.length === 0 && busquedaEnEspera == false" class="p-6 text-center flex justify-center items-center" style="margin-top: 10px; min-height: 300px;">
        <div>
            <h3 class="text-lg font-semibold">
                No hay combos disponibles para esta temporada.
            </h3>
        </div>
    </vx-card>
    <vx-card v-else-if="busquedaEjecutada == true && Producto_Agrupado.length > 0 && ProductoReporte.length === 0 && busquedaEnEspera == false" class="p-6 text-center flex justify-center items-center" style="margin-top: 10px; min-height: 300px;">
        <div>
            <h3 class="text-lg font-semibold">
                Actualmente, todos los códigos de combos tienen stock o ya se encuentran en códigos libros.
            </h3>
        </div>
    </vx-card>
    <vx-card id="seccionImprimir2" v-else align="center">
        <table id="tablaResumen" style="margin-bottom: 20px; width: 100%; border-collapse: collapse;">
            <tr align="center">
                <td colspan="2">
                    <h5 class="text-center font-bold" style="font-weight: bold; font-size: 18px; text-transform: uppercase; margin-bottom: 8px;">
                        REPORTE DE COMBOS PARA LA TEMPORADA {{ tabSeleccionbusqueda.periodoSeleccionadoObj.descripcion }}
                    </h5>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 15px; font-weight: 600; text-align: center; border-radius: 6px; margin-top: 10px;">
                    <p style="font-size: 14px; color: #444; font-style: italic; margin-bottom: 10px;">
                        El listado muestra la cantidad total aprobada de combos, incluyendo pedidos con contrato y alcances aprobados.
                    </p>
                    ⚠️ <strong>Observación:</strong>
                    Se muestran únicamente los códigos que <em>tienen stock igual a 0 </em> <strong> y </strong> <em> no están presentes en los códigos libros.</em>
                    <br>
                    Códigos con stock disponible o que estén registrados en los códigos libros <strong>no aparecerán</strong> en este listado.
                </td>
            </tr>
            <tr align="center">
                <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Total Combos:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">{{ filteredProductoReporte.length }} Unidades</td>
            </tr>
        </table>
        <!-- Buscador -->
        <div class="buscador-container no-print" style="margin-bottom: 15px; text-align: right;">
            <input type="text" v-model="busqueda" placeholder="🔍 Buscar por código o nombre..." style="padding: 8px 14px; font-size: 14px; width: 260px; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06); transition: all 0.2s ease-in-out; outline: none;" @focus="(e) => e.target.style.borderColor = '#4a90e2'" @blur="(e) => e.target.style.borderColor = '#ddd'" />
        </div>
        <table width="100%" id="tablaProductos" style="border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; margin-top: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;">
            <thead>
                <tr style="background-color: #d3d3d3 !important; color: #000000 !important;">
                    <th style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Código</th>
                    <th style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Información Combo</th>
                    <th style="padding: 12px 15px; border: 1px solid #ddd; text-align: center;">Cantidad Solicitada por Asesor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredProductoReporte" :key="item.pro_codigo" :style="{ backgroundColor: '#fff', transition: 'background-color 0.2s' }" @mouseover="hoverRow($event, true)" @mouseleave="hoverRow($event, false)">
                    <!-- Código del combo -->
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{{ item.pro_codigo }}</td>
                    <!-- Nombre de la asignatura y códigos asociados -->
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                        <span><b style="font-size: 13px;">{{ item.nombreasignatura }}</b></span>
                        <!-- Lista de Códigos asociados debajo del nombre -->
                        <div v-if="item.pro_codigos_desglose && item.pro_codigos_desglose.length > 0" style="margin-top: 6px; text-align: left;">
                            <div style="font-size: 12px; color: #555;">
                                <b style="color: #333;">📦 Códigos asociados:</b>
                                <!-- Lista de los códigos asociados -->
                                <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 12px; color: #666;">
                                    <li v-for="(libro, i) in item.pro_codigos_desglose" :key="i" style="list-style-type: none;">
                                        <strong style="color: #333;">{{ libro.codigo_liquidacion }}</strong> – {{ libro.nombrelibro }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    <!-- Total valor -->
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{{ item.total_valor }}</td>
                    <!-- <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{{ item.pro_reservar }}</td> -->
                </tr>
            </tbody>
        </table>
    </vx-card>
</div>
</template>

<script>
import vSelect from "vue-select";
import imprimirMixin from "@/mixins/Pedidosmix.js";
import * as XLSX from 'xlsx';
import {
    showOverlay,
    hideOverlay
} from '@/mixins/overlayBlocker.js';
import FormatoNewmix from "@/mixins/FormatoNewmix";
export default {
    mixins: [imprimirMixin, FormatoNewmix],
    components: {
        "v-select": vSelect,
    },
    data() {
        return {
            Producto_Agrupado: [],
            Producto_Listado: [],
            ProductoReporte: [],
            Periodos_Busqueda: [],
            tabSeleccionbusqueda: {
                periodoSeleccionadoObj: null,
            },
            nombrearchivo_descarga: '',
            mixinIdInicioFormatoNewData: null,
            busqueda: '',
            busquedaEjecutada: false,
            busquedaEnEspera: false,
            isrunLoading_metodo_Ejecucion: false,
            mostrandoOverlayVerificacion: false,
            mensajeVerificacion: '',
        };
    },
    computed: {
        filteredProductoReporte() {
            if (!this.busqueda.trim()) {
                return this.ProductoReporte;
            }
            const busq = this.busqueda.trim().toLowerCase();
            return this.ProductoReporte.filter(item => {
                const coincideCodigo = item.pro_codigo && item.pro_codigo.toLowerCase().includes(busq);
                const coincideAsignatura = item.nombreasignatura && item.nombreasignatura.toLowerCase().includes(busq);
                // Verificar si algún libro dentro de pro_codigos_desglose coincide
                const coincideLibro = item.pro_codigos_desglose && Array.isArray(item.pro_codigos_desglose) ?
                    item.pro_codigos_desglose.some(libro =>
                        (libro.codigo_liquidacion && libro.codigo_liquidacion.toLowerCase().includes(busq)) ||
                        (libro.nombrelibro && libro.nombrelibro.toLowerCase().includes(busq))
                    ) :
                    false;
                return coincideCodigo || coincideAsignatura || coincideLibro;
            });
        }
    },
    mounted() {
        this.inicializarConMixin();
    },
    methods: {
        async inicializarConMixin() {
            let me = this;
            try {
                const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
                // Verificamos si ya existe en localStorage
                if (!mixinData) {
                    // Solo si NO existe, lo generamos
                    await me.mixin_FormatoNewId();
                }
                // Volvemos a intentar leer del localStorage después de ejecutarlo (o si ya existía)
                const mixinDataFinal = localStorage.getItem('mixin_IdInicioFormatoNew');
                if (mixinDataFinal) {
                    const parsedData = JSON.parse(mixinDataFinal);
                    me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
                    console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData);
                } else {
                    console.warn("No se encontraron datos válidos en localStorage para mixin_IdInicioFormatoNew");
                }
                // Continuar con lo demás
                me.getPeriodos_Busqueda();
            } catch (error) {
                console.error("Error al inicializar datos desde el mixin:", error);
            }
        },
        async metodoEjecucion_Apis() {
            let me = this;
            me.busquedaEnEspera = true;
            // Hacer focus en el input antes de ejecutar todo
            me.$nextTick(() => {
                const select = me.$refs.selectTemporada &&
                    me.$refs.selectTemporada.$el &&
                    me.$refs.selectTemporada.$el.querySelector('input');
                if (select) select.blur();
            });
            me.busquedaEjecutada = false;
            try {
                me.$vs.loading();
                me.isrunLoading_metodo_Ejecucion = true;
                await me.limpiar();
                await me.BTN_BuscarCombosxTemporada();
                await me.Añadir_listado_codigos_X_combo();
                me.$vs.loading.close();
                await me.Verificar_listado_codigos_X_combo();
            } catch (error) {
                console.error('Error en metodoEjecucion_Apis:', error);
            } finally {
                me.busquedaEnEspera = false;
                me.isrunLoading_metodo_Ejecucion = false;
                me.$vs.loading.close();
                // console.log("gggggggg", me.busquedaEjecutada);
                // console.log("gggggggg", me.Producto_Agrupado);
            }
        },
        obtenerNombreArchivoDescarga() {
            const obj = this.tabSeleccionbusqueda.periodoSeleccionadoObj;
            const base = 'Listado_CombosxTemporada_';
            if (obj && obj.descripcion && obj.descripcion.trim() !== '') {
                this.nombrearchivo_descarga = base + obj.descripcion.trim().replace(/\s+/g, '_');
                return base + obj.descripcion.trim().replace(/\s+/g, '_');
            }
            this.nombrearchivo_descarga = base + 'Sinperiodo';
            return base + 'Sinperiodo';
        },
        async limpiar() {
            return new Promise((resolve, reject) => {
                this.ProductoReporte = [];
                this.Producto_Agrupado = [];
                console.log('limpiar');
                resolve();
            });
        },
        getPeriodos_Busqueda() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'get_periodos_pedidos')
                .then(res => {
                    this.Periodos_Busqueda = res.data;
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        hoverRow(event, isHover) {
            event.currentTarget.style.backgroundColor = isHover ? '#f1f5ff' : '#fff';
        },
        BTN_BuscarCombosxTemporada() {
            let me = this;
            me.busquedaEjecutada = true;
            return new Promise((resolve, reject) => {
                const periodoObj = me.tabSeleccionbusqueda.periodoSeleccionadoObj;
                if (!periodoObj) {
                    me.$vs.notify({
                        title: 'Aviso',
                        text: 'Debe seleccionar una temporada.',
                        type: 'error'
                    });
                    me.busquedaEjecutada = false;
                    reject('Seleccione una temporada.');
                    return;
                }
                const periodoSeleccionado = periodoObj.idperiodoescolar;
                const descripcionPeriodo = periodoObj.periodoescolar; // o el campo que tenga la descripción
                let verificar_periodo_busqueda = '';
                if (periodoSeleccionado <= me.mixinIdInicioFormatoNewData) {
                    verificar_periodo_busqueda = 'es_menor_o_igual';
                } else {
                    verificar_periodo_busqueda = 'es_mayor';
                }
                const data_a_enviar = {
                    idperiodoescolar_selected: periodoSeleccionado,
                    verificar_periodo_busqueda
                };
                this.$http.get(this.$server_url + 'GetListaCombosXTemporada', {
                        params: data_a_enviar
                    })
                    .then(res => {
                        // Si el backend devuelve status 0
                        if (res.data.status === 0) {
                            me.$vs.notify({
                                title: 'Aviso',
                                text: res.data.mensaje || 'No hay pedidos ni alcances de combos para esta temporada.',
                                type: 'warning',
                                time: 6000
                            });
                            reject('Sin resultados 1');
                            return;
                        }
                        // Si el arreglo productos_final_agrupados está vacío
                        if (!res.data.productos_final_agrupados || res.data.productos_final_agrupados.length === 0) {
                            me.$vs.notify({
                                title: 'Aviso',
                                text: 'No hay pedidos ni alcances de combos para esta temporada.',
                                type: 'warning',
                                time: 6000
                            });
                            reject('Sin resultados 2');
                            return;
                        }
                        // Si todo está bien
                        console.log('Se ha obtenido los pedidos y alcances de una temporada, comenzara a añadir los codigos asociados.');
                        this.Producto_Agrupado = res.data.productos_final_agrupados;
                        resolve();
                    })
                    .catch(err => {
                        console.error(err);
                        let mensaje = 'Error al consultar los combos.';
                        if (err.response && err.response.status === 422) {
                            mensaje = 'Parámetros inválidos. Verifique los datos enviados.';
                        } else if (err.response && err.response.data && err.response.data.error) {
                            mensaje = err.response.data.error;
                        }
                        me.$vs.notify({
                            title: 'Error',
                            text: mensaje,
                            type: 'error'
                        });
                        reject(err);
                    });
                // Ejemplo de uso del texto seleccionado
                console.log('Periodo seleccionado:', descripcionPeriodo);
            });
        },
        async Añadir_listado_codigos_X_combo() {
            let me = this;
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'Recorrer_Listado_Combos_X_Temporada', this.Producto_Agrupado)
                    .then(res => {
                        this.Producto_Listado = res.data.productos_agrupados_mas_cod_desglose; // Ahora la API devuelve el arreglo procesado
                        console.log('Se ha añadido los codigos asociados, comenzará a verificar si tiene stock y luego en la tabla de codigos.');
                        resolve();
                    })
                    .catch(err => {
                        console.error(err);
                        let mensaje = 'Error al consultar los combos.';
                        if (err.response && err.response.status === 422) {
                            mensaje = 'Parámetros inválidos. Verifique los datos enviados.';
                        } else if (err.response && err.response.data && err.response.data.error) {
                            mensaje = err.response.data.error;
                        }
                        me.$vs.notify({
                            title: 'Error',
                            text: mensaje,
                            color: 'danger'
                        });
                        reject(err);
                    });
            });
        },
        async Verificar_listado_codigos_X_combo() {
            const me = this;
            const periodo = me.tabSeleccionbusqueda.periodoSeleccionadoObj.idperiodoescolar;
            const productosSinStock = [];
            const productosEnviados = [];

            showOverlay('🔍 Iniciando verificación de combos...');
            const total = me.Producto_Listado.length;
            for (let index = 0; index < total; index++) {
                const producto = me.Producto_Listado[index];
                // Mensaje de progreso
                const overlay = document.getElementById('global-overlay-blocker');
                if (overlay) {
                    const h3 = overlay.querySelector('h3');
                    if (h3) {
                        h3.textContent = `🔍 Verificando ${index + 1} de ${total} códigos de combos.`;
                    }
                }
                const payload = {
                    producto: producto,
                    periodo_escolar: periodo
                };
                try {
                    const res = await me.$http.post(me.$server_url + 'Verificar_Listado_Combos_X_Temporada', payload);
                    if (res.data) {
                        productosEnviados.push(res.data.producto_enviado_desde_front);
                        if (res.data.producto_sin_stock_sin_codigoslibros !== null) {
                            productosSinStock.push(res.data.producto_sin_stock_sin_codigoslibros);
                        }
                    }
                } catch (err) {
                    console.error('Error al procesar producto:', producto, err);
                    me.$vs.notify({
                        title: 'Error',
                        text: `Error al verificar el producto ${producto.pro_codigo || ''}`,
                        color: 'danger'
                    });
                }
            }
            me.ProductoReporte = productosSinStock;
            hideOverlay();
            me.$vs.notify({
                title: 'Verificación completa',
                text: `Se verificaron ${total} combos.`,
                color: 'success',
                time: 6000
            });
            console.log(me.ProductoReporte, "Productos sin stock ni códigos");
        },

        ExportToExcel() {
            const me = this;
            me.obtenerNombreArchivoDescarga();

            const descripcionPeriodo =
                me.tabSeleccionbusqueda &&
                me.tabSeleccionbusqueda.periodoSeleccionadoObj &&
                me.tabSeleccionbusqueda.periodoSeleccionadoObj.descripcion ?
                me.tabSeleccionbusqueda.periodoSeleccionadoObj.descripcion.toUpperCase() :
                '';

            const titulo = [
                ['REPORTE DE COMBOS POR TEMPORADA ' + descripcionPeriodo]
            ];

            const nota = [
                ['El listado muestra la cantidad total aprobada de combos, incluyendo pedidos con contrato y alcances aprobados.'],
                ['⚠️ OBSERVACIÓN: Se muestran únicamente los códigos que tienen stock igual a 0 y no están presentes en los códigos libros.'],
                ['Códigos con stock disponible o que estén registrados en los códigos libros no aparecerán en este listado.']
            ];

            const resumen = [
                ['Total Combos:', me.ProductoReporte.length + ' Unidades']
            ];

            const encabezados = ['Código', 'Información Combo', 'Cantidad Solicitada por Asesor'];

            const productosData = me.ProductoReporte.map(item => [
                item.pro_codigo,
                item.nombreasignatura +
                (item.pro_codigos_desglose && item.pro_codigos_desglose.length ?
                    '\n' + item.pro_codigos_desglose.map(libro => ` - ${libro.codigo_liquidacion}: ${libro.nombrelibro}`).join('\n') :
                    ''),
                item.total_valor
            ]);

            const dataFinal = [
                ...titulo,
                ...nota,
                [],
                ...resumen,
                [],
                encabezados,
                ...productosData
            ];

            const ws = XLSX.utils.aoa_to_sheet(dataFinal);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
            XLSX.writeFile(wb, me.nombrearchivo_descarga + '.xlsx');
        },

    },
};
</script>

<style scoped>
.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.estilo-borde {
    border: 2px solid #007bff;
    /* azul intenso */
    border-radius: 8px;
    padding: 16px;
    margin-top: 2px;
    /* background-color: #f0f8ff; */
    /* azul muy claro */
}

.texto-claro {
    color: #333;
    font-size: 14px;
}

.botones-reporte {
    display: flex;
    justify-content: center;
    gap: 1rem;
    /* espacio entre botones */
    flex-wrap: wrap;
    /* se adapta si el espacio es muy pequeño */
    margin-top: 1rem;
}

.botones-reporte .vs-button {
    flex: 0 0 48%;
    /* cada uno ocupa 48% del ancho con 2% de espacio en total */
}

.v-simple-table th,
.v-simple-table td {
    border: 1px solid #ddd;
}
</style>
