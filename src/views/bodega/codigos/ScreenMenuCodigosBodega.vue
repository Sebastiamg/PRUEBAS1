<template>
  <div>
    <div v-if="groupBodega">
      <vs-tabs alignment="center">
        <vs-tab label="Gestión Bodega" @click="menu = 0;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Revisión"        @click="menu = 1;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Devoluciones"    @click="menu = 2;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Paquetes"        @click="menu = 3;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Combos" v-if="AdminBodega" @click="menu = 8">
          <div>

        </div>
        </vs-tab>
        <vs-tab label="Asignaciones"        @click="menu = 4;" v-if="AdminBodega">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Crear Eliminar" v-if="AdminBodega" @click="menu = 5;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Reemplazo de codigos" v-if="AdminBodega" @click="menu = 6;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Busqueda de Documentos" v-if="AdminBodega" @click="menu = 7;">

        </vs-tab>
      </vs-tabs>
      <!--***components****-->
      <!--gestion bodega-->
      <div v-if="menu == 0"><BloqueadorCodigosVue/></div>
      <!--revision-->
      <div v-if="menu == 1"><MenuRevisionVue/></div>
      <!--devoluciones-->
      <div v-if="menu == 2"><BodegaMenuDevolucionVue/></div>
      <!--paquetes-->
      <div v-if="menu == 3"><MenuPaquetesVue/></div>
      <!--combos-->
      <div v-if="menu == 4"><ScreenCombosVue/></div>
      <!--crear eliminar-->
      <div v-if="menu == 5"><ScreenCreaEliminaCodigosBodegaVue/></div>
      <!--Remplazo de codigos-->
      <div v-if="menu == 6"><codigosbloqueadosPaquetes/></div>
      <!--Busqueda de Documentos-->
      <div v-if="menu == 7"><BuscadorPrefacturas/></div>
      <!--combos-->
      <div v-if="menu == 8"><MenuCombosVue/></div>
    </div>
  </div>
</template>
<script>
  import {
    mapState
} from "vuex";
const BloqueadorCodigosVue                = () => import("../../codigos/components/BloqueadorCodigos.vue");
const MenuRevisionVue                     = () => import("../MenuRevision.vue");
const BodegaMenuDevolucionVue             = () => import("./components/BodegaMenuDevolucion.vue");
const MenuPaquetesVue                     = () => import("../../codigos/paquetes/MenuPaquetes.vue");
const ScreenCreaEliminaCodigosBodegaVue   = () => import("./ScreenCreaEliminaCodigosBodega.vue");
const codigosbloqueadosPaquetes           = () => import("../../codigos/codigosBloqueadosPaquete.vue");
const ScreenCombosVue                     = () => import('../../codigos/combos/ScreenCombos.vue')
const BuscadorPrefacturas                 = () => import("./components/BusquedaDocumentos.vue");
const MenuCombosVue                       = () => import("@/views/codigos/combos/MenuCombos.vue");

export default {
  components: {
    BloqueadorCodigosVue,
    MenuRevisionVue,
    BodegaMenuDevolucionVue,
    MenuPaquetesVue,
    ScreenCreaEliminaCodigosBodegaVue,
    codigosbloqueadosPaquetes,
    ScreenCombosVue,
    BuscadorPrefacturas,
    MenuCombosVue,
  },
  data() {
    return{
      menu:0
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','groupBodega','userAsesor','AdminBodega']),
  },
}
</script>
