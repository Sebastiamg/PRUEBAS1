<template>
    <div>
      <vs-tabs alignment="fixed" >
        <vs-tab label="Devolución por documento" @click="menu = 0">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Busqueda de documentos de devolución" @click="menu = 1">
          <div>

          </div>
         
        </vs-tab>
         <!--historico pre facturas devueltas-->
         <vs-tab label="Historico de facturas devueltas" v-if="userRoot || AdminBodega" @click="menu = 2">

        </vs-tab>
      </vs-tabs>
      <!--COMPONENTS-->
      <devolucion-documentos-vue            v-if="menu == 0" class="mt-2"></devolucion-documentos-vue>
      <devolucion-documentos-busqueda-vue   v-if="menu == 1" class="mt-2"></devolucion-documentos-busqueda-vue>
      <devolucion-historico-prefacturas-vue v-if="menu == 2" class="mt-2"></devolucion-historico-prefacturas-vue>
    </div>
</template>
<script>
const DevolucionDocumentosVue           = () => import('./devolucion/DevolucionDocumentos.vue')
const DevolucionDocumentosBusquedaVue   = () => import('./devolucion/DevolucionDocumentosBusqueda.vue')
const DevolucionHistoricoPrefacturasVue = () => import('./devolucion/DevolucionHistoricoPrefacturas.vue')
import {
    mapState
} from "vuex";
export default {
    components:{
        DevolucionDocumentosVue,
        DevolucionDocumentosBusquedaVue,
        DevolucionHistoricoPrefacturasVue
    },
    data(){
        return{
            menu:0
        }
    },
    computed: {
        ...mapState(['userRoot', 'AdminBodega']),
    },
    
}
</script>