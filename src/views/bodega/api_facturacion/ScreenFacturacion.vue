<template>
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab label="Reanudar Factura">
                <seccionReanudarVue class="mt-2"/>
            </vs-tab>
        </vs-tabs>
    </div>
</template>
<script>
import seccionReanudarVue from './reanudar_factura.vue';
export default{
    components:{
        seccionReanudarVue
    },
    data(){
        return{

        }
    }
}
</script>