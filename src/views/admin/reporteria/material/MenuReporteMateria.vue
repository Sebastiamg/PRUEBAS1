<template>
    <div>
        <vs-tabs align="fixed">
            <vs-tab label="Tareas y Archivos" @click="menu = 0">
                <div class="con-tab-ejemplo">
                    <TareasArchivosVue v-if="menu === 0"/>
                </div>
            </vs-tab>
            <vs-tab label="Reporte Tareas" @click="menu = 1">
                <div class="con-tab-ejemplo">
                    <ReporteTareasVue v-if="menu === 1"/>
                </div>
            </vs-tab>
            <vs-tab label="Historico actividades" @click="menu = 2">
                <div class="con-tab-ejemplo">
                    <historicoActividadesVue v-if="menu === 2"/>
                </div>
            </vs-tab>

        </vs-tabs>
    </div>
</template>
<script>
const ReporteTareasVue        = () => import('./ReporteTareas.vue');
const historicoActividadesVue = () => import('../../../actividades/historicoActividades.vue');
const TareasArchivosVue       = () => import('./TareasArchivos.vue');
export default{
    components:{
        historicoActividadesVue,
        ReporteTareasVue,
        TareasArchivosVue
    },
    data(){
        return{
          menu:0
        }
    }
}
</script>
