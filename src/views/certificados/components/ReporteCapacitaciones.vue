<template>
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab label="Reporte individual">
                <div>
                    <ReporteCapacitacionIndividualVue :lista_asesores="lista_asesores" :periodos="periodos" :arregloCapacitadores="arregloCapacitadores"/>
                </div>
            </vs-tab>
            <vs-tab label="Reporte Grupal">
                <div>
                    <ReporteCapacitacionGrupalVue :lista_asesores="lista_asesores" :periodos="periodos" :arregloCapacitadores="arregloCapacitadores"/>
                </div>
            </vs-tab>
        </vs-tabs>    
    </div>
</template>
<script>
import ReporteCapacitacionIndividualVue from './ReporteCapacitacionIndividual.vue'
import ReporteCapacitacionGrupalVue from './ReporteCapacitacionGrupal.vue'
export default{
    data(){
        return{

        }
    },
    props:{
        lista_asesores:{
            type:Array,
            default:[],
        },
        periodos:{
            type:Array,
            default:[],
        },
        arregloCapacitadores:{
            type:Array,
            default:[],
        },
    },
    components:{
        ReporteCapacitacionIndividualVue,
        ReporteCapacitacionGrupalVue,
    },
}
</script>