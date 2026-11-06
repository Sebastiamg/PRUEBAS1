<template>
<div>
    <div class="w-full flex flex-wrap gap-10 items-center text-xl justify-end">
        <!-- <vs-radio color="warning" v-model="tipo_form" vs-value="textos" vs-name="tipo_textos" @input="activar_tipo()">Textos</vs-radio> -->
        <vs-radio color="warning" v-model="tipo_form" vs-value="guias" vs-name="tipo_guias" @input="activar_tipo()">Guías</vs-radio>
    </div>
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
                                        <b style="font-size: 12px;">Total Guías</b>
                                    </td>
                                    <td class="input_totales" width="150" align="center">
                                        <!-- Mostrar la suma total para esta serie -->
                                        {{ item.totalPvnCantidad }}
                                    </td>
                                    <!-- <td style="font-size: 12px;"><b>TOTAL USD</b></td>
                          <td class="input_totales" width="150" align="center">
                            ${{ item.totalPvpUsd }}
                          </td> -->
                                </tr>
                            </table>
                        </td>
                        <td width="1000"><b>{{item.nombre_serie.toUpperCase()}}</b></td>
                    </tr>
                </table>
            </div>
            <div class="w-full" style="overflow-x:auto;">
                <table class="table_pedidos">
                    <thead class="text-center">
                        <th style="width: 100px;"><b>Áreas</b></th>
                        <th :colspan="item.areas[0].libros.length + 1"><b>Niveles</b></th>
                        <!-- +1 for the Niveles header itself -->
                    </thead>
                    <tr class="text-center" align="center" v-for="(tr, indextr) in item.areas" :key="tr.idarea">
                        <td style="background-color: #046AE7;color:white;"><b>{{tr.nombrearea}}</b></td>
                        <td align="left">
                            <div v-for="(libro, libroIndex) in tr.libros" :key="libroIndex" style="display: inline-flex">
                                <table style="width: 150px; border: 1px solid #000; margin: 0.5px">
                                    <tr>
                                        <td align="center" style="border: transparent">
                                            <!-- <div style="font-size: 11px; color: #666;">{{ libro.pro_codigo }}</div> -->
                                            <div align="center"><span><b>[{{ libro.pro_codigo }}]</b></span></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="border: transparent">
                                            <div v-if="tr.idarea != 69"><b>{{ libro.year }}</b></div>
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
                                                    <vs-input style="display: inline-flex;" class="w-full" v-model="libro.pvn_cantidad" @keypress="validarkey_pvn_cantidad($event, libro)" @paste="validarnopegar($event)" @blur="(pedido.estado_entrega == 0) ? blur_pvn_cantidad(libro, item, tr.idarea) : null" :readonly="pedido.estado_entrega != 0" maxlength="4" />
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
    <div class="w-full text-center">
        <b class="text-warning ml-5">
            CANTIDAD DE UNIDADES DE GUIAS TOTAL : <div style="display: inline-block;">{{ calculos.totalGuias }} </div><br>
        </b>
    </div>
</div>
</template>


<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import axios from 'axios'
export default {
    components: {
        flatPickr,
        'v-select': vSelect,
    },
    data: () => ({
        usuario: [],
        series: [],
        series_plan_lector: [],
        tipo_form: 'guias',
        id_periodo: '',
        total_usd: 0,
        total_unidades: 0,
        total_unidades_guias: 0,
        porcentaje_descuento: 0,
        porcentaje_descuento_series_basicas: 0,
        calculos: {
            cantidadtotal_libros: 0,
            pvptotal_libros: 0,
            suma_seriesBasicas: 0,
            multiplicacionPConfigurado: 0,
            RestaAutorizada: 0,
            resultadoComisionAsesor: 0,
            anticipo_calculado: 0,
            pendienteLiquidar: 0,
            totalGuias: 0,
        },
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
            id_periodo: '',
            estado_entrega: 0,
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
        //variables de series basicas
        userEditor: 0,
        isrunLoading_metodoInicial: false,
        isrunLoading_blur_pvn_cantidad: false,
        pvn_tipo: 0,
    }),
    props: {
        id_pedido: {
            type: Number,
            default: 0,
            required: true
        }
    },
    mounted() {
        this.id_periodo = localStorage.id_periodo_selected
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.usuario_id = this.usuario.idusuario
        this.metodoInicial();
        if (this.usuario.id_group == 11) {
            this.disableAsesor = false
        } else {
            this.disableAsesor = true
        }
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
        async blur_pvn_cantidad(libro, item, tr) {
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
                await me.guardarCantidad_PedidosValNew(libro, item, tr);
                //   await me.getSeries();
                await me.get_val_pedido();
                await me.calcularTotalPvnCantidad();
                //   await me.calcularCantidadTotalLibros();
                //   await me.calcularPVPTotalLibros();
                await me.calculosGenerales();
                await me.guardarTotalPedido();
                // Actualizar el valor original
                libro.pvn_cantidad_original = libro.pvn_cantidad;
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
        validarkey_pvn_cantidad(event, libro) {
            let numentero = libro.pvn_cantidad;
            // Verificar si la tecla presionada es un número.
            if (!/\d/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Validar el formato del número
            // if (!/^\d{0,5}(\.\d{0,3})?$/.test(numentero)) {
            //   libro.pvn_cantidad = '';
            //   console.log("reset");
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
                this.calculos.totalGuias = cantidadtotalLibros;
                this.calculos.pvptotal_libros = parseFloat(pvptotalLibros.toFixed(2));
                resolve();
            });
        },
        // async calcularCantidadTotalLibros() {
        //     return new Promise((resolve, reject) => {
        //         this.calculos.totalGuias = this.series.reduce((total, serie) => {
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
                me.calculos.pendienteLiquidar = parseFloat(me.calculos.resultadoComisionAsesor - Math.abs(me.anticipoAprobado));
                resolve();
            });
        },
        async getSeries() {
            let me = this;
            return new Promise((resolve, reject) => {
                if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                    me.$vs.loading();
                }
                this.$http.get(this.$server_url + 'series_formato_periodo_new_guias/' + me.id_periodo + '/' + me.id_pedido + '/' + me.pvn_tipo)
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
                        if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                            me.$vs.loading.close();
                        }
                        resolve();
                    });
            });
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
                this.$http.get(this.$server_url + 'get_val_pedido_new/' + me.id_pedido)
                    .then(res => {
                        if (res.data.length <= 0) {
                            me.porcentaje_descuento = 0;
                            me.porcentaje_descuento_series_basicas = 0;
                            me.contrato_generado = 0;
                            if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                                me.$vs.loading.close()
                            }
                        } else if (res.data.length > 0) {
                            me.porcentaje_descuento = res.data[0].descuento
                            me.porcentaje_descuento_series_basicas = res.data[0].porcentaje_descuento
                            me.contrato_generado = res.data[0].contrato_generado
                            me.pedido.estado_entrega = res.data[0].estado_entrega
                            if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                                me.$vs.loading.close()
                            }
                            // console.log(me.pedido.estado_entrega, "res.ataaaendcotnrado");
                        }
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                        me.$vs.loading.close()
                    })
            })
        },
        async guardarCantidad_PedidosValNew(libro, item, tr) {
            let me = this;
            let idlibro_final = '';
            let idplanlector_final = '';
            let idarea_final = '';
            return new Promise((resolve, reject) => {
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                // Busca el proveedor con el prov_id específico
                if (item.id_serie == 6) {
                    idlibro_final = 0;
                    idplanlector_final = libro.idlibro;
                    idarea_final = libro.idlibro;
                } else if (item.id_serie != 6) {
                    idlibro_final = libro.year;
                    idplanlector_final = 0;
                    idarea_final = tr;
                }
                // console.log(libro, item, tr, "data de libros");
                let datos = {
                    "idlibro": libro.idlibro,
                    "valor": parseInt(libro.pvn_cantidad),
                    "pvn_cantidad": parseInt(libro.pvn_cantidad),
                    "pvn_tipo": me.pvn_tipo,
                    "id_pedido": me.id_pedido,
                    "guias": 'yes',
                    "id_serie": item.id_serie,
                    "id_area": idarea_final,
                    "plan_lector": idplanlector_final,
                    "libro": idlibro_final,
                }
                // console.log(datos, "datosssssss")
                // return;
                console.log(libro.pvn_cantidad, "ggggg");
                if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                    me.$vs.loading()
                }
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'PostRegistrar_modificar_pedidosNew', datos)
                    .then(res => {
                        // this.getMaterialcubiertaParametro();
                        if (res.data.status == "0") {
                            me.$vs.notify({
                                text: res.data.message, // Mensaje para el estado "0"
                                color: 'warning', // Color de advertencia para errores o situaciones especiales
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                time: 8000
                            });
                            libro.pvn_cantidad = 0;
                        } else if (res.data.status == "1") {
                            me.$vs.notify({
                                text: res.data.message, // Mensaje para el estado "1"
                                color: 'success', // Color de éxito para confirmaciones
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 8000
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
            let me = this
            // console.log(me.id_pedido, me.calculos.pvptotal_libros, me.calculos.cantidadtotal_libros, me.calculos.suma_seriesBasicas,
            //     me.calculos.anticipo_calculado, "hoaaaaaaaaa");
            // return;
            return new Promise((resolve, reject) => {
                me.$http.get(me.$server_url + 'guardar_total_pedido_new/' + me.id_pedido + '/0/0/' + me.calculos.totalGuias + '/0/0')
                    .then(res => {
                        me.$emit('rechargePedido', true);
                        resolve();
                        // console.log('total actualizado: ' + total_usd_format)
                    })
                    .catch(err => {
                        reject(err);
                        me.$vs.loading.close()
                    })
            })
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
    /*color: #2559AD !important;
        background-color: #BCF3AE;*/
}

.test2 {
    background-color: #C4D333;
}

.con-vs-tooltip>.vs-con-input-label>.vs-con-input>.vs-inputx {
    text-align: center !important;
    content: justify !important;
}
</style>
