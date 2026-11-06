<template>
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab label="Búsqueda grupal">
                <RevisionCodigosVue class="mt-2"/>
            </vs-tab>
            <vs-tab label="Búsqueda individual">
                <seccionBuscarVue class="mt-2"/>
            </vs-tab>
            <!-- <vs-tab label="Historico">
                <historicoCodigosVue class="mt-2"/>
            </vs-tab> -->
        </vs-tabs>
    </div>
</template>
<script>
import seccionBuscarVue from '../codigos/components/seccionBuscar.vue'
import RevisionCodigosVue from '../codigos/components/RevisionCodigos.vue';
import historicoCodigosVue from '../codigos/components/historicoCodigos.vue';
export default{
    components:{
        RevisionCodigosVue,
        seccionBuscarVue,
        historicoCodigosVue,
    },
    data(){
        return{

        }
    }
}
</script>