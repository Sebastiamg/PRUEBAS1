<template>
    <div>
        <gestionCodigosListaVue :arregloCodigos="codigoSelected"/>
    </div>
</template>
<script>
import gestionCodigosListaVue from './gestionCodigosLista.vue';
export default{
    data(){
        return{

        }
    },
    components:{
        gestionCodigosListaVue,
    },
    props:{
        codigoSelected:{
            type:Array,
            default:[]
        }
    }
}
</script>