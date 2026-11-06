<template>
<div class="mt-5 p-4">
    <!-- Filtros de selección -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Empresa -->
        <div>
            <label class="block font-semibold mb-1">Empresa: *</label>
            <v-select :options="listaEmpresas" :reduce="item => item.id" label="nombre" class="w-full" placeholder="--Seleccione--" v-model="empresa" @input="onEmpresaChange" />
            <span v-if="!empresa" class="text-red-500 text-sm">Seleccione la empresa.</span>
        </div>

        <!-- Asesor -->
        <div>
            <label class="block font-semibold mb-1">Asesor: *</label>
            <v-select :options="arrayAsesorConTodos" :reduce="item => item.id_asesor" label="asesor" class="w-full" placeholder="--Seleccione--" v-model="SelectAsesor" @input="validarSeleccion" :disabled="!empresa" />
            <span v-if="!SelectAsesor && empresa" class="text-red-500 text-sm">Seleccione un asesor.</span>
        </div>
    </div>

    <vs-divider></vs-divider>

    <div class="mb-2">Filtrar por tipo de venta:</div>

    <!-- Filtros de tipo de venta -->
    <div class="flex flex-wrap gap-4 items-center mb-6">
        <!-- Venta Directa -->
        <div>
            <vx-tooltip v-if="!tieneVentaDirecta" :text="SelectAsesor === 'todos' ? 'No hay ventas directas para estos asesores' : 'No hay ventas directas para este asesor'">
                <vs-checkbox v-model="filtroVentaDirecta" :disabled="!tieneVentaDirecta" @change="filtrarResultados" class="vs-checkbox-custom">
                    Venta Directa
                </vs-checkbox>
            </vx-tooltip>
            <template v-else>
                <vs-checkbox v-model="filtroVentaDirecta" @change="filtrarResultados" class="vs-checkbox-custom">
                    Venta Directa
                </vs-checkbox>
            </template>
        </div>

        <!-- Venta por Lista -->
        <div>
            <vx-tooltip v-if="!tieneVentaLista" :text="SelectAsesor === 'todos' ? 'No hay ventas por lista para estos asesores' : 'No hay ventas por lista para este asesor'">
                <vs-checkbox v-model="filtroVentaLista" :disabled="!tieneVentaLista" @change="filtrarResultados" class="vs-checkbox-custom">
                    Venta por Lista
                </vs-checkbox>
            </vx-tooltip>
            <template v-else>
                <vs-checkbox v-model="filtroVentaLista" @change="filtrarResultados" class="vs-checkbox-custom">
                    Venta por Lista
                </vs-checkbox>
            </template>
        </div>
    </div>

    <div v-if="SelectAsesor === 'todos' && arrayAsesor.length" class="mb-6 flex justify-end">
        <vs-button color="success" type="border" icon="file_download" @click="exportarExcelPorAsesores">
            Exportar Excel por asesor
        </vs-button>
    </div>

    <!-- Total de Libros -->
    <div class="bg-gray-50 border border-gray-300 rounded-md p-5 text-center">
        <h2 class="text-xl font-semibold mb-2">Total de Libros</h2>
        <p class="text-2xl font-bold">{{ totalLibros }}</p>
    </div>
    <!-- Totales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8 text-gray-800">



        <!-- Valores Brutos -->
        <div class="bg-gray-50 border border-gray-300 rounded-md p-5">
            <h2 class="text-lg font-semibold mb-4">Valores Brutos</h2>
            <div class="flex flex-col sm:flex-row justify-between text-lg">
                <div class="text-center sm:text-left">
                    <p class="text-gray-600 text-center">Total</p>
                    <p class="font-semibold text-gray-900 text-center">${{ formatNumber(total) }}</p>
                </div>
                <div class="text-center sm:text-left mt-4 sm:mt-0">
                    <p class="text-gray-600 text-center">Total con Devolución</p>
                    <p class="font-semibold text-gray-900 text-center">${{ formatNumber(totalConDevolucion) }}</p>
                </div>
            </div>
        </div>

        <!-- Valores Netos -->
        <div class="bg-gray-50 border border-gray-300 rounded-md p-5">
            <h2 class="text-lg font-semibold mb-4 ">Valores Netos</h2>
            <div class="flex flex-col sm:flex-row justify-between text-lg">
                <div class="text-center sm:text-left">
                    <p class="text-gray-600 text-center">Total Neto</p>
                    <p class="font-semibold text-gray-900 text-center">${{ formatNumber(totalNeto) }}</p>
                </div>
                <div class="text-center sm:text-left mt-4 sm:mt-0">
                    <p class="text-gray-600 text-center">Total Neto con Devolución</p>
                    <p class="font-semibold text-gray-900 text-center">${{ formatNumber(totalNetoConDevolucion) }}</p>
                </div>
            </div>
        </div>

    </div>






    <!-- Tabla o mensaje de vacío -->
    <div>
        <div v-if="resultadosFiltrados.length === 0" class="text-center text-gray-500 mt-4">
            No se encontraron resultados para los filtros seleccionados.
        </div>
        <TableReutilizableVue v-else :title="`Despacho X Asesor ${asesor}`"
        :headers="['Código', 'Nombre', 'Documento', 'Empresa','Cantidad Venta','Cantidad Devolución','Cantidad Total', 'Precio Unit.', 'Total', 'Total - Devolución']"
        :fieldKeys="['pro_codigo', 'pro_nombre', 'ven_codigo', 'empresa','det_ven_cantidad','cantidadDevuelta','cantidadReal', 'det_ven_valor_u', 'precio', 'precioDevolucion']" :ifexportar="1" :tableData="resultadosFiltrados" :nombrearchivo="`Despacho_X_Asesor_${asesor}`"
         :totales="['det_ven_cantidad','cantidadDevuelta','cantidadReal', 'det_ven_valor_u', 'precio', 'precioDevolucion']"/>

    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
import Generalmix from "../../../../../mixins/Generalmix";
import * as XLSX from 'xlsx';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue');

export default {
    mixins: [Generalmix],
    components: {
        "v-select": vSelect,
        TableReutilizableVue
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0,
        },
        nombrePeriodo: {
            type: String,
            default: '',
        },
        periodoSelect: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            arrayAsesor: [],
            SelectAsesor: null,
            resultados: [],
            resultadosFiltrados: [],
            empresa: null,
            listaEmpresas: [],
            asesor: '',
            filtroVentaDirecta: false,
            filtroVentaLista: false,
            tieneVentaDirecta: false,
            tieneVentaLista: false,
            totalLibros: 0,
            total: 0,
            totalConDevolucion: 0,
            totalNeto: 0,
            totalNetoConDevolucion: 0,
        };
    },
    computed: {
        arrayAsesorConTodos() {
            return [
                { id_asesor: 'todos', asesor: 'TODOS LOS ASESORES' },
                ...this.arrayAsesor,
            ];
        },
    },
    mounted() {
        this.getEmpresas();
    },
    methods: {
        async getEmpresas() {
            try {
                this.$vs.loading();
                const res = await this.$http.get(this.$server_url + 'empresa');
                this.listaEmpresas = res.data.filter(emp => emp.id !== 2);
                this.empresa = 3; // Default company
                await this.getAsesores();
            } catch (err) {
                console.error('Error al cargar empresas:', err);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron cargar las empresas.',
                    color: 'danger',
                    position: 'top-right'
                });
            } finally {
                this.$vs.loading.close();
            }
        },
        async getAsesores() {
            if (!this.empresa || !this.periodo_id) {
                this.arrayAsesor = [];
                this.SelectAsesor = null;
                return;
            }
            if (this.empresa && this.periodo_id) {
                try {
                    this.$vs.loading();
                    const res = await this.$http.get(
                        `${this.$server_url}despachos?busquedaAsesorPeriodo=yes&periodo=${this.periodo_id}&empresa=${this.empresa}`
                    );
                    this.arrayAsesor = res.data;
                    if (this.arrayAsesor.length === 0) {
                        this.$vs.notify({
                            title: 'Sin asesores',
                            text: 'No se encontraron asesores para la empresa y período seleccionados.',
                            color: 'warning',
                            position: 'top-right'
                        });
                    }
                } catch (err) {
                    console.error('Error al cargar asesores:', err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No se pudieron cargar los asesores.',
                        color: 'danger',
                        position: 'top-right'
                    });
                } finally {
                    this.$vs.loading.close();
                }
            }
        },
        onEmpresaChange() {
            this.SelectAsesor = null;
            this.arrayAsesor = [];
            setTimeout(() => {
                this.limpiar();
                if (this.empresa) {
                    this.getAsesores();
                }
            }, 1000);
        },
        validarSeleccion() {
            if (this.empresa && this.SelectAsesor) {
                this.busquedaVentas();
            } else {
                this.limpiar();
            }
        },
        mapResultadoItem(item) {
            return {
                pro_codigo: item.pro_codigo || '',
                pro_nombre: item.pro_nombre || '',
                ven_codigo: item.ven_codigo || '',
                empresa: item.id_empresa == 1 || item.id_empresa == 6 ? 'Prolipa' : 'Calmed',
                cantidadReal: parseFloat(item.cantidadReal) || 0,
                cantidadDevuelta: parseFloat(item.cantidadDevuelta) || 0,
                det_ven_valor_u: parseFloat(item.det_ven_valor_u) || 0,
                precio: parseFloat(item.precio) || 0,
                precioDevolucion: parseFloat(item.precioDevolucion) || 0,
                tip_ven_codigo: parseInt(item.tip_ven_codigo, 10) || 0,
                det_ven_cantidad: parseFloat(item.det_ven_cantidad) || 0,
                valorNeto: parseFloat(item.valorNeto) || 0,
                precioDevolucionNeto: parseFloat(item.precioDevolucionNeto) || 0,
            };
        },
        obtenerFiltrosTipoVenta() {
            const filtros = [];
            if (this.filtroVentaDirecta) filtros.push(1);
            if (this.filtroVentaLista) filtros.push(2);
            return filtros;
        },
        calcularTotalesDesdeResultados(resultados) {
            return {
                totalLibros: resultados.reduce((sum, item) => sum + item.cantidadReal, 0),
                total: resultados.reduce((sum, item) => sum + item.precio, 0),
                totalConDevolucion: resultados.reduce((sum, item) => sum + item.precioDevolucion, 0),
                totalNeto: resultados.reduce((sum, item) => sum + Number(item.valorNeto), 0),
                totalNetoConDevolucion: resultados.reduce((sum, item) => sum + Number(item.precioDevolucionNeto), 0),
            };
        },
        obtenerNombreHoja(nombreAsesor, idAsesor, usedNames) {
            let base = String(nombreAsesor || 'Asesor')
                .replace(/[\\/*?:\[\]]/g, '')
                .trim()
                .substring(0, 25);
            if (!base) base = `Asesor_${idAsesor}`;
            let sheetName = base;
            let counter = 1;
            while (usedNames.has(sheetName)) {
                const suffix = `_${counter}`;
                sheetName = `${base.substring(0, 31 - suffix.length)}${suffix}`;
                counter++;
            }
            usedNames.add(sheetName);
            return sheetName;
        },
        mapDetalleParaExcel(row) {
            return {
                'Código': row.pro_codigo,
                'Nombre': row.pro_nombre,
                'Documento': row.ven_codigo,
                'Empresa': row.empresa,
                'Cantidad Venta': row.det_ven_cantidad,
                'Cantidad Devolución': row.cantidadDevuelta,
                'Cantidad Total': row.cantidadReal,
                'Precio Unit.': row.det_ven_valor_u,
                'Total': row.precio,
                'Total - Devolución': row.precioDevolucion,
            };
        },
        async exportarExcelPorAsesores() {
            if (!this.empresa || this.SelectAsesor !== 'todos' || !this.arrayAsesor.length) {
                return;
            }

            const filtros = this.obtenerFiltrosTipoVenta();
            if (filtros.length === 0) {
                this.$vs.notify({
                    title: 'Sin filtros',
                    text: 'Seleccione al menos un tipo de venta para exportar.',
                    color: 'warning',
                    position: 'top-right',
                });
                return;
            }

            try {
                this.$vs.loading();
                const resumenRows = [];
                const hojasDetalle = [];
                const usedSheetNames = new Set(['Resumen por asesor']);

                const promesas = this.arrayAsesor.map(asesor =>
                    this.$http
                        .get(`${this.$server_url}despachos?Xasesor=yes&periodo=${this.periodo_id}&empresa=${this.empresa}&asesor=${asesor.id_asesor}`)
                        .then(res => ({ asesor, data: res.data }))
                        .catch(err => {
                            console.error(`Error al cargar asesor ${asesor.asesor}:`, err);
                            return { asesor, data: [] };
                        })
                );

                const resultadosAsesores = await Promise.all(promesas);

                resultadosAsesores.forEach(({ asesor, data }) => {
                    const resultados = (Array.isArray(data) ? data : []).map(item => this.mapResultadoItem(item));
                    const filtrados = resultados.filter(item => filtros.includes(item.tip_ven_codigo));
                    const totales = this.calcularTotalesDesdeResultados(filtrados);

                    resumenRows.push({
                        Asesor: asesor.asesor,
                        'Total de Libros': totales.totalLibros,
                        'Total Bruto': totales.total,
                        'Total con Devolución': totales.totalConDevolucion,
                        'Total Neto': totales.totalNeto,
                        'Total Neto con Devolución': totales.totalNetoConDevolucion,
                    });

                    if (filtrados.length > 0) {
                        hojasDetalle.push({
                            name: this.obtenerNombreHoja(asesor.asesor, asesor.id_asesor, usedSheetNames),
                            rows: filtrados.map(row => this.mapDetalleParaExcel(row)),
                        });
                    }
                });

                if (resumenRows.length === 0) {
                    this.$vs.notify({
                        title: 'Sin datos',
                        text: 'No hay información para exportar con los filtros actuales.',
                        color: 'warning',
                        position: 'top-right',
                    });
                    return;
                }

                const totalesGenerales = this.calcularTotalesDesdeResultados(
                    resumenRows.map(row => ({
                        cantidadReal: row['Total de Libros'],
                        precio: row['Total Bruto'],
                        precioDevolucion: row['Total con Devolución'],
                        valorNeto: row['Total Neto'],
                        precioDevolucionNeto: row['Total Neto con Devolución'],
                    }))
                );

                resumenRows.push({
                    Asesor: 'TOTAL GENERAL',
                    'Total de Libros': totalesGenerales.totalLibros,
                    'Total Bruto': totalesGenerales.total,
                    'Total con Devolución': totalesGenerales.totalConDevolucion,
                    'Total Neto': totalesGenerales.totalNeto,
                    'Total Neto con Devolución': totalesGenerales.totalNetoConDevolucion,
                });

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumenRows), 'Resumen por asesor');
                hojasDetalle.forEach(hoja => {
                    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(hoja.rows), hoja.name);
                });

                const empresaObj = this.listaEmpresas.find(e => e.id === this.empresa);
                const empresaNombre = (empresaObj && empresaObj.nombre) ? empresaObj.nombre.replace(/\s+/g, '_') : this.empresa;
                const periodoNombre = (this.nombrePeriodo || `periodo_${this.periodo_id}`).replace(/\s+/g, '_');
                XLSX.writeFile(wb, `Despacho_X_Asesor_${periodoNombre}_${empresaNombre}.xlsx`);

                this.$vs.notify({
                    title: 'Exportación lista',
                    text: `Se exportaron ${hojasDetalle.length} hoja(s) de detalle y el resumen por asesor.`,
                    color: 'success',
                    position: 'top-right',
                });
            } catch (error) {
                console.error('Error en exportarExcelPorAsesores:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudo generar el archivo Excel.',
                    color: 'danger',
                    position: 'top-right',
                });
            } finally {
                this.$vs.loading.close();
            }
        },
        async busquedaVentas() {
            try {
                this.$vs.loading();
                const res = await this.$http.get(
                    `${this.$server_url}despachos?Xasesor=yes&periodo=${this.periodo_id}&empresa=${this.empresa}&asesor=${this.SelectAsesor}`
                );
                if (!res.data || !Array.isArray(res.data)) {
                    throw new Error('Respuesta inválida del servidor');
                }
                this.resultados = res.data.map(item => this.mapResultadoItem(item));
                console.log('Resultados:', this.resultados); // Debug
                console.log('Tipos de venta:', this.resultados.map(item => item.tip_ven_codigo)); // Debug
                if (this.SelectAsesor === 'todos') {
                    this.asesor = 'Todos los asesores';
                } else {
                    const asesorEncontrado = this.arrayAsesor.find(a => a.id_asesor === this.SelectAsesor);
                    this.asesor = asesorEncontrado ? asesorEncontrado.asesor : '';
                }
                this.filtrarTiposDisponibles();
                this.filtrarResultados();
            } catch (error) {
                console.error('Error en busquedaVentas:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron cargar las ventas.',
                    color: 'danger',
                    position: 'top-right'
                });
                this.limpiar();
            } finally {
                this.$vs.loading.close();
            }
        },
        filtrarTiposDisponibles() {
            this.tieneVentaDirecta = this.resultados.some(item => item.tip_ven_codigo === 1);
            this.tieneVentaLista = this.resultados.some(item => item.tip_ven_codigo === 2);
            this.filtroVentaDirecta = this.tieneVentaDirecta;
            this.filtroVentaLista = this.tieneVentaLista;
            console.log('Tiene Venta Directa:', this.tieneVentaDirecta, 'Tiene Venta Lista:', this.tieneVentaLista); // Debug
            if (!this.tieneVentaDirecta && !this.tieneVentaLista) {
                this.$vs.notify({
                    title: 'Sin datos',
                    text: this.SelectAsesor === 'todos'
                        ? 'No hay ventas directas ni por lista para los asesores.'
                        : 'No hay ventas directas ni por lista para este asesor.',
                    color: 'warning',
                    position: 'top-right'
                });
            }
        },
        filtrarResultados() {
            const filtros = this.obtenerFiltrosTipoVenta();
            if (filtros.length === 0) {
                this.resultadosFiltrados = [];
            } else {
                this.resultadosFiltrados = this.resultados.filter(item =>
                    filtros.includes(item.tip_ven_codigo)
                );
            }
            const totales = this.calcularTotalesDesdeResultados(this.resultadosFiltrados);
            this.totalLibros = totales.totalLibros;
            this.total = totales.total;
            this.totalConDevolucion = totales.totalConDevolucion;
            this.totalNeto = totales.totalNeto;
            this.totalNetoConDevolucion = totales.totalNetoConDevolucion;
            console.log('Totales:', {
                totalLibros: this.totalLibros,
                total: this.total,
                totalConDevolucion: this.totalConDevolucion,
                totalNeto: this.totalNeto,
                totalNetoConDevolucion: this.totalNetoConDevolucion
            }); // Debug
        },
        limpiar() {
            this.resultados = [];
            this.resultadosFiltrados = [];
            this.asesor = '';
            this.totalLibros = 0;
            this.total = 0;
            this.totalConDevolucion = 0;
            this.totalNeto = 0;
            this.totalNetoConDevolucion = 0;
            this.filtroVentaDirecta = false;
            this.filtroVentaLista = false;
            this.tieneVentaDirecta = false;
            this.tieneVentaLista = false;
        },
        formatNumber(value) {
            if (isNaN(value) || value === null || value === undefined) return '0.00';
            return Number(value).toLocaleString("es-EC", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }
};
</script>

<style scoped>
.vs-checkbox-custom {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 14px;
}
</style>
