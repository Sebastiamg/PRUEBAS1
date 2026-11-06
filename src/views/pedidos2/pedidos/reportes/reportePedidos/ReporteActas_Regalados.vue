<template>
<vx-card title="📚 Regalados por Periodo">
    <!-- Mensaje informativo -->
    <vs-alert color="warning" icon="info" class="mb-4">
        Solo se mostrarán los documentos que tengan al menos un libro con <b>diferencia &lt;&gt; 0</b>.
    </vs-alert>
    <!-- Input de búsqueda -->
    <p class="mb-4 text-sm text-gray-500">
        Filtra por código de documento, nombre o código de libro.
    </p>

    <vs-input v-model="busquedaHistorial" placeholder="🔍 Buscar código de documento, nombre o código de libro" class="w-full mb-6" icon="search" @input="aplicarFiltroVisual()" clearable />

    <!-- Cargando datos -->
    <div v-if="loadingCargarDatos" class="text-center mt-8">
        <vs-alert color="primary" icon="update">
            Cargando datos, por favor espere...
        </vs-alert>
    </div>

    <!-- Total de Documentos -->
    <div v-if="!loadingCargarDatos && documentosAgrupadosFiltrados.length" class="mt-4">
        <vs-chip color="primary">
            Total de Documentos: {{ documentosAgrupadosFiltrados.length }}
        </vs-chip>
    </div>

    <br>

    <!-- Lista de documentos como collapse -->
    <vs-collapse v-if="!loadingCargarDatos && documentosAgrupadosFiltrados.length">
        <vs-collapse-item v-for="(grupo, index) in documentosAgrupadosFiltrados" :key="index" class="mb-4 rounded-md border-gray-300 shadow-sm" :style="{ overflow: 'hidden' }" style="box-shadow: 0 0px 4px 2px rgba(0, 0, 0, 0.15);">
            <!-- Encabezado personalizado -->
            <div slot="header" class="flex justify-between items-center w-full px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-700 rounded-t-md border-b border-gray-300">
                <div class="flex items-center text-blue-600">
                    <i class="fas fa-file-alt mr-2"></i>
                    Documento:
                </div>
                <div class="text-gray-900 font-bold truncate max-w-xs">
                    {{ grupo.codigo_proforma }}
                </div>
                <vs-chip color="success" class="ml-4">
                    Libros: {{ grupo.libros.length }}
                </vs-chip>
            </div>

            <!-- Tabla de libros -->
            <div class="overflow-auto bg-white rounded-b-md border-t border-gray-300">
                <table class="min-w-full text-sm text-left text-gray-700">
                    <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th class="px-4 py-3">
                                <vx-tooltip text="Nombre del libro y su código de liquidación" position="top">
                                    Libro
                                </vx-tooltip>
                            </th>
                            <th class="px-4 py-3">
                                <vx-tooltip text="Códigos Despachados (De los documentos de venta)" position="top">
                                    Despachados
                                </vx-tooltip>
                            </th>
                            <!-- <th class="px-4 py-3">
                                <vx-tooltip text="Códigos regalados leídos" position="top">
                                    Leídos
                                </vx-tooltip>
                            </th> -->
                            <th class="px-4 py-3">
                                <vx-tooltip text="Códigos Liquidados" position="top">
                                    Liquidados
                                </vx-tooltip>
                            </th>
                            <th class="px-4 py-3">
                                <vx-tooltip text="Códigos devueltos" position="top">
                                    Devueltos
                                </vx-tooltip>
                            </th>
                            <th class="px-4 py-3">
                                <vx-tooltip text="Despachados - (Liquidados + Devueltos)" position="top">
                                    Diferencia
                                </vx-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(libro, idx) in grupo.libros" :key="idx" class="border-t hover:bg-gray-50 transition">
                            <td class="px-4 py-2">
                                {{ libro.nombre }} ({{ libro.codigo_liquidacion }})
                                <br>
                                <div class="mt-1">
                                    <span v-if="libro.combo !== null" class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                                        📦 Parte del Combo: {{ libro.combo }}
                                    </span>
                                </div>
                            </td>
                            <!-- <td class="px-4 py-2">{{ libro.cantidad_despachados }}</td> -->
                            <td class="px-4 py-2">{{ libro.det_ven_cantidad }}</td>
                            <!-- <td class="px-4 py-2">{{ libro.cantidad_leidos }}</td> -->
                            <td class="px-4 py-2">{{ libro.cantidad_liquidados }}</td>
                            <td class="px-4 py-2">{{ libro.cantidad_devueltos_total }}</td>
                            <td class="px-4 py-2" :class="{ 'text-red-500 font-bold': libro.diferencia_codigos > 0 }">
                                {{ libro.diferencia_codigos }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </vs-collapse-item>
    </vs-collapse>

    <!-- Sin resultados -->
    <div v-else-if="!loadingCargarDatos" class="text-center mt-8">
        <vs-alert color="warning" icon="info">
            No se encontraron resultados para el filtro aplicado o el periodo seleccionado.
        </vs-alert>
    </div>
</vx-card>
</template>

<script>
export default {
    data() {
        return {
            busquedaHistorial: '',
            Array_Regalado_NoLiquidado_Temporada: [],
            Array_Regalado_Leido_Temporada: [],
            Array_Regalado_Liquidado_Temporada: [],
            Array_Regalado_Devuelto_Temporada: [],
            Array_Regalado_DevueltoyLiquidado_Temporada: [],
            Array_Regalado_DevueltosAgrupados: [],
            Array_documentosAgrupados_SemiFinal: [],
            Array_documentosAgrupados_Final: [],
            loadingCargarDatos: false,
            documentosAgrupados: [],
            documentosAgrupadosFiltrados: []
        };
    },
    props: {
        PeriodoSelect: {
            type: Number,
            default: 0
        },
        nombrePeriodo: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.cargarDatos();
    },
    methods: {
        async cargarDatos() {
            const me = this;
            try {
                this.loadingCargarDatos = true;
                me.$vs.loading();
                // Llamas varios métodos que sean async y retornen promesas
                await me.GetRegalados_NoLiquidados();
                await me.GetRegalados_Leidos();
                await me.GetRegalados_Liquidados();
                await me.GetRegalados_Devueltos();
                await me.GetRegalado_DevueltoyLiquidado();
                await me.AgruparDevueltosEnBackend();
                await me.AgruparLeidos_Liquidados_DevueltosEnBackend();
                // await me.Metodo_Agregar_Nombres_ConsultaSemiFinalRegalados();
                await me.Metodo_Agregar_F_DetalleVenta_ConsultaFinalRegalados();
                await me.aplicarFiltroVisual();
            } catch (error) {
                console.error('Error en cargarDatos:', error);
            } finally {
                me.$vs.loading.close();
                this.loadingCargarDatos = false;
            }
        },
        async GetRegalados_NoLiquidados() {
            const me = this;
            const parametros = {
                PeriodoSelect: me.PeriodoSelect
            };
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'Regalado_NoLiquidado_Temporada', parametros)
                    .then((res) => {
                        resolve();
                        me.Array_Regalado_NoLiquidado_Temporada = res.data.data;
                    })
                    .catch((error) => {
                        reject("error en GetRegalados_NoLiquidados", error);
                        console.error('Error en la solicitud:', error);
                    });
            });
        },
        async GetRegalados_Leidos() {
            const me = this;
            const parametros = {
                PeriodoSelect: me.PeriodoSelect
            };
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'Regalado_Leido_Temporada', parametros)
                    .then((res) => {
                        resolve();
                        me.Array_Regalado_Leido_Temporada = res.data.data;
                    })
                    .catch((error) => {
                        reject("error en GetRegalados_NoLiquidados", error);
                        console.error('Error en la solicitud:', error);
                    });
            });
        },
        async GetRegalados_Liquidados() {
            const me = this;
            const parametros = {
                PeriodoSelect: me.PeriodoSelect
            };
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'Regalado_Liquidado_Temporada', parametros)
                    .then((res) => {
                        resolve();
                        me.Array_Regalado_Liquidado_Temporada = res.data.data;
                    })
                    .catch((error) => {
                        reject("error en GetRegalados_Liquidados", error);
                        console.error('Error en la solicitud:', error);
                    });
            });
        },
        async GetRegalados_Devueltos() {
            const me = this;
            const parametros = {
                PeriodoSelect: me.PeriodoSelect
            };
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'Regalado_Devuelto_Temporada', parametros)
                    .then((res) => {
                        resolve();
                        me.Array_Regalado_Devuelto_Temporada = res.data.data;
                    })
                    .catch((error) => {
                        reject("error en GetRegalados_Devueltos", error);
                        console.error('Error en la solicitud:', error);
                    });
            });
        },
        async GetRegalado_DevueltoyLiquidado() {
            const me = this;
            const parametros = {
                PeriodoSelect: me.PeriodoSelect
            };
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'Regalado_DevueltoyLiquidado_Temporada', parametros)
                    .then((res) => {
                        resolve();
                        me.Array_Regalado_DevueltoyLiquidado_Temporada = res.data.data;
                    })
                    .catch((error) => {
                        reject("error en GetRegalado_DevueltoyLiquidado", error);
                        console.error('Error en la solicitud:', error);
                    });
            });
        },
        async AgruparDevueltosEnBackend() {
            const me = this;
            const parametros = {
                devueltos: me.Array_Regalado_Devuelto_Temporada,
                devueltos_liquidados: me.Array_Regalado_DevueltoyLiquidado_Temporada
            };
            try {
                const res = await this.$http.post(this.$server_url + 'Agrupar_Regalados_Devueltos_Temporada', parametros);
                me.Array_Regalado_DevueltosAgrupados = res.data.data;
            } catch (error) {
                console.error('Error al AgruparDevueltosEnBackend:', error);
            }
        },
        async AgruparLeidos_Liquidados_DevueltosEnBackend() {
            const me = this;
            const parametros = {
                no_liquidados: me.Array_Regalado_NoLiquidado_Temporada,
                leidos: me.Array_Regalado_Leido_Temporada,
                liquidados: me.Array_Regalado_Liquidado_Temporada,
                devueltos: me.Array_Regalado_DevueltosAgrupados
            };
            try {
                const res = await this.$http.post(this.$server_url + 'Agrupar_Regalados_Temporada', parametros);
                me.documentosAgrupados = res.data.data;
            } catch (error) {
                console.error('Error al AgruparLeidos_Liquidados_DevueltosEnBackend:', error);
            }
        },
        // async Metodo_Agregar_Nombres_ConsultaSemiFinalRegalados() {
        //     const me = this;
        //     const parametros = {
        //         documentos_agrupados: me.documentosAgrupados,
        //     };
        //     try {
        //         const res = await this.$http.post(this.$server_url + 'Agregar_Nombres_ConsultaFinalRegalados', parametros);
        //         me.Array_documentosAgrupados_SemiFinal = res.data.data;
        //         console.log(me.Array_documentosAgrupados_SemiFinal, "fgfg");
        //     } catch (error) {
        //         console.error('Error al Metodo_Agregar_Nombres_ConsultaSemiFinalRegalados:', error);
        //     }
        // },
        async Metodo_Agregar_F_DetalleVenta_ConsultaFinalRegalados() {
            const me = this;
            const parametros = {
                documentos_con_cod_y_nombre: me.documentosAgrupados,
            };
            try {
                const res = await this.$http.post(this.$server_url + 'Agregar_F_DetalleVenta_ConsultaFinalRegalados', parametros);
                const procesado = res.data.data
                    .map(documento => {
                        // calcular diferencia por libro
                        const librosConDiferencia = (documento.libros || []).map(libro => {
                                const det_ven_cantidad = Number(libro.det_ven_cantidad) || 0;
                                const liquidados = Number(libro.cantidad_liquidados) || 0;
                                const devueltos = Number(libro.cantidad_devueltos_total) || 0;
                                return {
                                    ...libro,
                                    diferencia_codigos: det_ven_cantidad - (liquidados + devueltos)
                                };
                            })
                            // filtrar los que no interesan (según tu código actual)
                            .filter(libro => libro.diferencia_codigos !== 0)
                            // Codigo para ordenar: 1) por combo (no nulos primero), 2) por codigo_liquidacion asc
                            .sort((a, b) => {
                                // 1) combo: consideramos "tiene combo" > "no tiene combo"
                                const aHasCombo = a.combo !== null && a.combo !== undefined && a.combo !== '';
                                const bHasCombo = b.combo !== null && b.combo !== undefined && b.combo !== '';
                                if (aHasCombo && !bHasCombo) return -1; // a antes que b
                                if (!aHasCombo && bHasCombo) return 1; // b antes que a

                                // si ambos tienen combo o ambos no tienen, orden por el valor de combo (si aplica)
                                if (aHasCombo && bHasCombo) {
                                    const comboA = String(a.combo);
                                    const comboB = String(b.combo);
                                    if (comboA < comboB) return -1;
                                    if (comboA > comboB) return 1;
                                }
                                // 2) por codigo_liquidacion (alfabético asc, nulls al final)
                                const codA = a.codigo_liquidacion || '';
                                const codB = b.codigo_liquidacion || '';
                                if (codA < codB) return -1;
                                if (codA > codB) return 1;
                                return 0;
                            });

                        return {
                            ...documento,
                            libros: librosConDiferencia
                        };
                    })
                    // eliminar documentos que quedaron sin libros (comportamiento actual)
                    .filter(documento => (documento.libros || []).length > 0);

                me.Array_documentosAgrupados_Final = procesado;
                me.documentosAgrupadosFiltrados = procesado;
                // console.log(me.Array_documentosAgrupados_Final, "procesado (ordenado por combo y codigo)");
            } catch (error) {
                console.error('Error al Metodo_Agregar_F_DetalleVenta_ConsultaFinalRegalados:', error);
            }
        },
        async aplicarFiltroVisual() {
            const filtro = this.busquedaHistorial.trim().toLowerCase();
            if (!filtro) {
                this.documentosAgrupadosFiltrados = this.Array_documentosAgrupados_Final;
                return;
            }
            this.documentosAgrupadosFiltrados = this.Array_documentosAgrupados_Final.filter((grupo) => {
                // 1. Verificar si el código de proforma coincide
                const coincideCodigoProforma = grupo.codigo_proforma.toLowerCase().includes(filtro);
                // 2. Verificar si alguno de los libros coincide por nombre o código_liquidacion
                const algunLibroCoincide = grupo.libros.some((libro) => {
                    return (
                        libro.nombre.toLowerCase().includes(filtro) ||
                        libro.codigo_liquidacion.toLowerCase().includes(filtro)
                    );
                });
                // 3. Si coincide el grupo o algún libro, mostrar TODO el grupo
                return coincideCodigoProforma || algunLibroCoincide;
            });
        },

        getCancelar() {
            this.$emit('change', {
                verificaredicionmasivaactualizar: 2
            });
        }
    }
};
</script>
