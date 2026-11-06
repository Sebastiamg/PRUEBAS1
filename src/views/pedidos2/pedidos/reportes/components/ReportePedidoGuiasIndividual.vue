<template>
    <div>
        <div>
            <!-- Aquí puedes mostrar el reporte -->
            <div v-if="arrayReporte.length > 0">
                <TableReutilizableVue
                :title="nombre_periodo"
                :ifexportar="Number(1)"
                :headers="['Guia','codigo','cantidad solicitada','cantidad devuelta','cantidad que tiene el asesor']"
                :fieldKeys="['nombrelibro','pro_codigo','cantidadPedidaActual','cantidad_devuelta_total','stockAsesor']"
                :tableData="arrayReporte"
                />
            </div>
            <div v-else>
                <p class="text-center mt-5">⚠️ No hay guias pedidas en el periodo seleccionado.</p>
            </div>
        </div>
    </div>
</template>

<script>
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    components:{
        TableReutilizableVue
    },
    data() {
        return {
            arrayReporte: [] // Inicializa arrayReporte aquí
        }
    },
    props: {
        id_asesor: {
            type: Number,
            required: true
        },
        id_periodo: {
            type: Number,
            required: true
        },
        nombre_periodo:{
            type: String,
            required: true
        }
    },
    async mounted() {
        await this.f_getReporte();
    },
    methods: {
        async f_getReporte() {
            try {
                this.$vs.loading();
                const url = `getStockProlipaDevolucion?asesor_id=${this.id_asesor}&periodo_id=${this.id_periodo}`;
                const response = await this.$http.get(this.$server_url + url);
                this.arrayReporte = response.data;
                if(this.arrayReporte.length === 0) {
                    this.$vs.notify({
                        title: 'Información',
                        text: 'No hay guias pedidas en el periodo seleccionado.',
                        color: 'warning',
                    });
                }
            } catch (error) {
                console.error(error);
                // Aquí puedes agregar un mensaje de error para el usuario
            } finally {
                this.$vs.loading.close();
            }
        }
    }
}
</script>
