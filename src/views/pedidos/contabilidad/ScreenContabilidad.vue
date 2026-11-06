<template>
    <div>
        <vs-tabs alignment="fixed">
            <!--TIPO  0 = pendientes; 1 = recibidas; 2 cheques firmados;-->
            <vs-tab label="Pendientes">
                <div>
                    <listadoPedidosContabilidadPendientesVue estado="2"/>
                </div>
            </vs-tab>
            <vs-tab label="Recibidas">
                <div>
                    <listadoPedidosContabilidadPendientesVue estado="4"/>
                </div>
            </vs-tab>
            <vs-tab label="Cheques">
                <div>
                    <listadoPedidosContabilidadPendientesVue estado="5"/>
                </div>
            </vs-tab>
            <vs-tab label="Cheques Entregados">
                <div>
                    <listadoPedidosContabilidadPendientesVue estado="6"/>
                </div>
            </vs-tab>
            <vs-tab label="Pagares a recibir">
                <div>
                    <listadoPedidosContabilidadPendientesVue estado="10"/>
                </div>
            </vs-tab>
            <vs-tab label="Pagares recibidos">
                <div>
                    <listadoPedidosContabilidadPendientesVue estado="11"/>
                </div>
            </vs-tab>
        </vs-tabs>
    </div>
</template>
<script>
import listadoPedidosContabilidadPendientesVue from './listadoPedidosContabilidad.vue';
export default{
    data(){
        return{

        }
    },
    components:{
        listadoPedidosContabilidadPendientesVue,       
    },
}
</script>