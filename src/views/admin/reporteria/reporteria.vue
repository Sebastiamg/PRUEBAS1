<template>
    <div>
       
        <vs-tabs alignment="center">
            <vs-tab label="Reporte Asesores">
                <div>
                    <reporteriaAsesorVue/>
                </div>
            </vs-tab>
            <vs-tab label="Reporte Instituciones">
                <div>
                    <reporteriaInstitucionVue/>
                </div>
            </vs-tab>
            <vs-tab label="Reporte General">
                <div>
                    <ReporteGeneral/>
                </div>
            </vs-tab>
       
        </vs-tabs>

    </div>
</template>


<script>
import ReporteGeneral from '@/views/admin/usuarioPeriodos/usuarioPeriodos.vue'
import reporteriaAsesorVue from './components/reporteriaAsesor.vue'
import reporteriaInstitucionVue  from './components/reporteriaInstitucion.vue'
export default{
    components:{
        ReporteGeneral,
        reporteriaAsesorVue,
        reporteriaInstitucionVue
    },
    mounted(){
      
    },
    data(){
        return{
           
        }
    },
    methods:{
       
    }
}
</script>