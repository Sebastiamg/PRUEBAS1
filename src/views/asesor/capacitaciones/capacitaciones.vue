<template>
    <div>
        <vs-card v-if="usuario.id_group == '11'">
            <agendaCapacitaciones/>    
        </vs-card>
        
    </div>
</template>

<script>
import agendaCapacitaciones from '../componentes/agenda_asesor_capacitaciones.vue'

export default {
    data() {
       return{
           usuario:[]
       } 
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    components:{
        agendaCapacitaciones
    }
}
</script>