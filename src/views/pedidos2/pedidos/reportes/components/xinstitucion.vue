<template>
<div class="mt-5 p-4">
    <!-- Filtros de selección -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Empresa -->
        <div>
            <label class="block font-semibold mb-1">Empresa: *</label>
            <v-select :options="listaEmpresas" :reduce="item => item.id" label="nombre" class="w-full" placeholder="--Seleccione--" v-model="empresa"  @input="empresa ? getInstituciones() && validarSeleccion() : ''" />
            <span v-if="!empresa" class="text-red-500 text-sm">Seleccione la empresa.</span>
        </div>

        <!-- Institución -->
        <div>
            <label class="block font-semibold mb-1">Institución: *</label>
            <v-select :options="arrayInstituciones" :reduce="item => item.idInstitucion" label="nombreInstitucion" class="w-full" placeholder="--Seleccione--" v-model="SelectInstituciones" :multiple="true" @input="validarSeleccion" />
            <span v-if="SelectInstituciones.length === 0" class="text-red-500 text-sm">Seleccione al menos una institución.</span>
        </div>
    </div>

    <vs-divider></vs-divider>

    <div>Filtrar por tipo de venta:</div>

    <!-- Filtros de tipo de venta -->
    <div class="flex flex-wrap gap-4 items-center mb-6">
        <!-- Venta Directa -->
        <div>
            <vx-tooltip v-if="!tieneVentaDirecta" text="No hay ventas directas para estas instituciones">
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
            <vx-tooltip v-if="!tieneVentaLista" text="No hay ventas por lista para estas instituciones">
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

    <!-- Totales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6 font-semibold text-lg">
        <div>Total Libros: {{ totalLibros }}</div>
        <div>Total: ${{ formatNumber(total) }}</div>
        <div>Total con Devolución: ${{ formatNumber(totalConDevolucion) }}</div>
    </div>

    <!-- Tabla -->
    <div>
        <TableReutilizableVue :title="`Despacho X Institución ${institucion}`"
        :headers="['Codigo', 'Nombre', 'Documento', 'Empresa','Cantidad Venta','Cantidad Devolución','Cantidad Total', 'Precio. Unit.', 'Total', 'Total - devolución']"
        :fieldKeys="['pro_codigo', 'pro_nombre', 'ven_codigo', 'empresa','det_ven_cantidad','cantidadDevuelta','cantidadReal', 'det_ven_valor_u', 'precio', 'precioDevolucion']" :ifexportar="1" :tableData="resultadosFiltrados" :nombrearchivo="`Despacho X Institución ${institucion}`"
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
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue');

export default {
    mixins: [Generalmix],
    components: {
        "v-select": vSelect,
        TableReutilizableVue
    },
    data() {
        return {
            arrayInstituciones: [],
            SelectInstituciones: [],
            resultados: [],
            resultadosFiltrados: [],
            empresa: '',
            listaEmpresas: [],
            institucion: '',

            // Filtros
            filtroVentaDirecta: false,
            filtroVentaLista: false,
            tieneVentaDirecta: false,
            tieneVentaLista: false,

            // Totales
            totalLibros: 0,
            total: 0,
            totalConDevolucion: 0,
        };
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
    mounted() {
        this.getEmpresas();
    },
    methods: {
        getEmpresas() {
            this.listaEmpresas = [];
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    this.listaEmpresas = res.data.filter(emp => emp.id !== 2);
                    this.empresa = 3; // Valor por defecto
                    this.getInstituciones();
                })
                .catch(err => {
                    console.error(err);
                });
        },
        getInstituciones() {
            this.$vs.loading();
            this.$http.get(this.$server_url + 'despachos?busquedaInstitucionPeriodo=yes&periodo=' + this.periodo_id + '&empresa=' + this.empresa)
                .then(res => {
                    this.arrayInstituciones = res.data;
                    this.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    this.$vs.loading.close();
                });
        },
        validarSeleccion() {
            if (this.empresa && this.SelectInstituciones.length > 0) {
                this.busquedaVentas();
            } else {
                this.resultados = [];
                this.resultadosFiltrados = [];
                this.institucion = '';
                this.totalLibros = 0;
                this.total = 0;
                this.totalConDevolucion = 0;
                this.filtroVentaDirecta = false;
                this.filtroVentaLista = false;
                this.tieneVentaDirecta = false;
                this.tieneVentaLista = false;
            }
        },
        async busquedaVentas() {
            this.$vs.loading();

            try {
                const promesas = this.SelectInstituciones.map(institucion =>
                    this.$http.get(`${this.$server_url}despachos?Xinstitucion=yes&periodo=${this.periodo_id}&empresa=${this.empresa}&institucion=${institucion}`)
                );

                const respuestas = await Promise.all(promesas);

                this.resultados = respuestas.flatMap(res => res.data.map(item => ({
                    ...item,
                    empresa: item.id_empresa == 1 || item.id_empresa == 6 ? 'Prolipa' : 'Calmed',
                    cantidadReal: parseFloat(item.cantidadReal) || 0,
                    cantidadDevuelta: parseFloat(item.cantidadDevuelta) || 0,
                    precio: parseFloat(item.precio) || 0,
                    precioDevolucion: parseFloat(item.precioDevolucion) || 0,
                    total: (item.det_ven_valor_u * (item.det_ven_cantidad - item.det_ven_dev)).toFixed(2),
                    det_ven_cantidad: parseFloat(item.det_ven_cantidad) || 0,
                })));

                if (this.SelectInstituciones.length === 1) {
                    const institucion = this.arrayInstituciones.find(i => i.id_institucion === this.SelectInstituciones[0]);
                    this.institucion = institucion ? institucion.nombreInstitucion : '';
                } else {
                    this.institucion = 'VariasInstituciones';
                }

                this.filtrarTiposDisponibles();
                this.filtrarResultados();
            } catch (error) {
                console.error(error);
            } finally {
                this.$vs.loading.close();
            }
        },
        filtrarTiposDisponibles() {
            this.tieneVentaDirecta = this.resultados.some(item => item.tip_ven_codigo === 1);
            this.tieneVentaLista = this.resultados.some(item => item.tip_ven_codigo === 2);
            this.filtroVentaDirecta = this.tieneVentaDirecta;
            this.filtroVentaLista = this.tieneVentaLista;
        },
        filtrarResultados() {
            const filtros = [];
            if (this.filtroVentaDirecta) filtros.push(1);
            if (this.filtroVentaLista) filtros.push(2);

            this.resultadosFiltrados = filtros.length > 0 ?
                this.resultados.filter(item => filtros.includes(item.tip_ven_codigo)) :
                this.resultados;

            // Calcular totales seguros
            this.totalLibros = this.resultadosFiltrados.reduce((sum, item) => sum + (parseFloat(item.cantidadReal) || 0), 0);
            this.total = this.resultadosFiltrados.reduce((sum, item) => sum + (parseFloat(item.precio) || 0), 0);
            this.totalConDevolucion = this.resultadosFiltrados.reduce((sum, item) => sum + (parseFloat(item.precioDevolucion) || 0), 0);
        },
        formatNumber(value) {
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
