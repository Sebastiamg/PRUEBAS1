<template>
    <div style="margin-top: -20px;">
        <vs-tabs alignment="fixed">
            <vs-tab label="Entregar guias a escuelas">
                <div>
                    <EntregaGuiasVue/>
                </div>
            </vs-tab>
            <vs-tab label="Listado de entregas escuelas">
                <div>
                    <ListadoEntregasVue/>
                </div>
            </vs-tab>
        </vs-tabs>
    </div>
</template>
<script>
import EntregaGuiasVue from './EntregaGuias.vue'
import ListadoEntregasVue from './ListadoEntregas.vue'
export default{
    data(){
        return{

        }
    },
    components:{
        EntregaGuiasVue,
        ListadoEntregasVue,    
    },
}
</script>