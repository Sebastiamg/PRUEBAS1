<template>
    <div>
        <div v-if="tipoMenu == 'planificacion'">
        <agendaAsesorVue/>
        </div>
        <div v-if="tipoMenu == 'capacitaciones'">
            <!-- <capacitacionesAgendaVue/> -->
            <capacitacionesAgendaVue1/>
        </div>
    </div>

</template>

<script>
import agendaAsesorVue from '@/views/asesor/planificaciones_agenda/Planificaciones_agenda_listado.vue'
// import agendaAsesorVue from '../componentes/agenda_asesor.vue'
// import capacitacionesAgendaVue from '../componentes/agenda_asesor_capacitaciones.vue'
import capacitacionesAgendaVue1 from '../capacitaciones/asesor_capacitacion.vue'
export default {
    components:{
        agendaAsesorVue,
        // capacitacionesAgendaVue,
        capacitacionesAgendaVue1,
    },
      props:{
        tipo:{
            type:String,
            default:'planificacion'
        },

    },
    created(){
        let me = this;

    },
    mounted(){
        let me = this;
        me.tipoMenu = localStorage.getItem("tipo")
        if(me.tipoMenu == null){
            me.tipoMenu = "planificacion"
        }


    },
    data() {
        return{
            tipoMenu:''
        }
    },
}
</script>
