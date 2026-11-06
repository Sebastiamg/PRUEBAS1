<template>
    <div>
        <vs-tabs>
            <vs-tab label="Libros solicitados por asesor">
                <InformacionGeneral :periodoSelect="Number(periodoConsulta)" />
            </vs-tab>
            <vs-tab label="Contratos por asesor X meses">
                <InformacionGeneralNew :periodoSelect="Number(periodoConsulta)" :periodo="periodoSelect" />
            </vs-tab>
            <vs-tab label="Conteo libros pedidos">
                <div>
                    <!-- <div v-if="tipoComponenteMostrar == 1"> -->
                    <ReportePedidosTotalLibrosxPeriodoVue  :periodoConsulta="Number(periodoConsulta)"/>
                </div>
                <!-- <div v-if="tipoComponenteMostrar == 2">
                    <totalLibrosXPeriodo :periodoConsulta="Number(periodoConsulta)" />
                </div> -->
            </vs-tab>
            <vs-tab label="Proyección pedidos">
              <ReporteVentasPorAsesorLiquidadosVue :periodoSelect="Number(periodoConsulta)"  />
                <!-- <ReporteVentaVendedor2Vue :periodoSelect="Number(periodoConsulta)" :desdePrincipal="Number(1)"/> -->
                <br><br><br><br><br><br><br><br><br><br>
            </vs-tab>
        </vs-tabs>
    </div>
</template>

<script>
import InformacionGeneral from './InformacionGeneral.vue';
import InformacionGeneralNew from './InformacionGeneralXMeses.vue';
const totalLibrosXPeriodo = () => import('./totalLibrosXPeriodo.vue');
const ReportePedidosTotalLibrosxPeriodoVue = () => import('../reportes/reportePedidos/ReportePedidosTotalLibrosxPeriodo.vue')
// const ReporteVentaVendedor2Vue = () => import('../../../pedidos/gerencia/reportes/ReporteVentaVendedor2.vue');
const ReporteVentasPorAsesorLiquidadosVue = () => import('../reportes/components/ReporteVentasPorAsesorLiquidados.vue');
export default {
    data() {
        return {
            periodoConsulta: 0,
            mixinIdInicioFormatoNewData:null,
            tipoComponenteMostrar:0,
        };
    },
    components: {
        InformacionGeneral,
        totalLibrosXPeriodo,
        ReportePedidosTotalLibrosxPeriodoVue,
        InformacionGeneralNew,
        ReporteVentasPorAsesorLiquidadosVue
    },
    props:{
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    created(){
        let me = this
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
    },
    mounted() {
        let me = this;
        me.periodoConsulta = Number(localStorage.getItem("pid")); //enviar el periodo de consulta
        me.startComponent()
    },
    methods: {
        startComponent(){
            let me = this
            if(me.periodoConsulta <= me.mixinIdInicioFormatoNewData){
                me.tipoComponenteMostrar = 1
            }else if(me.periodoConsulta > me.mixinIdInicioFormatoNewData){
                me.tipoComponenteMostrar = 2
            }
        }
    }
};
</script>
