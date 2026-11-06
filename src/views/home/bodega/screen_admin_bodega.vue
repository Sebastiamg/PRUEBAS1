<template>
<vx-card>
    <div>
        <vs-button class="m-2 py-2" type="relief" :class="{ active: selectedTab === 'Guias' }" @click="selectTab('Guias')" v-if="AdminBodega || userRoot">Guias Modulo anterior</vs-button>
        <vs-button class="m-2 py-2" type="relief" :class="{ active: selectedTab === 'Textos' }" @click="selectTab('Textos')" v-if="AdminBodega || userRoot">Textos</vs-button>
        <!-- <vs-button class="m-2 py-2" type="relief" :class="{ active: selectedTab === 'Notas' }" @click="selectTab('Notas')" v-if="AdminBodega || userRoot">Ventas Empacadas</vs-button> -->
        <vs-button class="m-2 py-2" type="relief" :class="{ active: selectedTab === 'Reporte' }" @click="selectTab('Reporte')" v-if="AdminBodega || userRoot">Reporte diario</vs-button>
        <!-- <vs-button class="m-2 py-2" type="relief" :class="{ active: selectedTab === 'Busqueda' }" @click="selectTab('Busqueda')" v-if="AdminBodega || userRoot">Busqueda Documentos de venta</vs-button> -->
        <vs-button class="m-2 py-2" type="relief" :class="{ active: selectedTab === 'PerseoDespachos' }" @click="selectTab('PerseoDespachos')" v-if="AdminBodega || userRoot">Despachos Perseo</vs-button>
    </div>
    <div v-if="selectedTab === 'Guias'">
        <guias v-if="AdminBodega || userRoot" />
    </div>
    <div v-else-if="selectedTab === 'Textos'">
        <textos v-if="AdminBodega || userRoot" />
    </div>
     <div v-else-if="selectedTab === 'PerseoDespachos'">
        <PerseoDespachos v-if="AdminBodega || userRoot" />
    </div>
    <!-- <div v-else-if="selectedTab === 'Notas'">
      <Notas v-if="AdminBodega || userRoot" />
  </div> -->
  <div v-else-if="selectedTab === 'Reporte'">
      <!-- <reportecalmed v-if="AdminBodega || userRoot" /> -->
      <perseo_despachos_hoja_rutaVue v-if="AdminBodega || userRoot" />
  </div>
  <!-- <div v-else-if="selectedTab === 'Busqueda'">
    <vs-card>
      <BusquedaDocumentosVue />
    </vs-card>
  </div> -->
</vx-card>
</template>


<script>
import {
    mapState
} from "vuex";
const guias                  = () => import("./components/guias.vue");
const textos                 = () => import("../../facturacion/10_10_1_4/bodegas/Documentos/lista_documentos.vue");
const Notas                  = () => import("./components/notas.vue");
// const reportecalmed          = () => import("../../facturacion/10_10_1_4/bodegas/reporte_diario_calmed.vue");
const PerseoDespachos        = () => import("../../facturacion/10_10_1_4/bodegas/Documentos/perseo_despachos.vue");
const perseo_despachos_hoja_rutaVue = () => import('../../facturacion/10_10_1_4/bodegas/Documentos/perseo_despachos_hoja_ruta.vue')
export default {
  components: {
      guias,
      textos,
      Notas,
    //   reportecalmed,
      PerseoDespachos,
      perseo_despachos_hoja_rutaVue,
    },
    data() {
        return {
            selectedTab: null,
            buttonStyle: {
                Guias: false,
                Textos: false,
                Notas: false,
                Reporte: false,
                PerseoDespachos: false,
                Busqueda: false
            }
        };
    },
    mounted() {
        const validador = parseInt(localStorage.getItem("desdeHome")) || null;
        const savedTab = localStorage.getItem("bodegaSelectedTab");

        // Limpiar el validador después de usarlo
        if (validador === 1) {
            this.selectedTab = 'Guias';
            localStorage.setItem("bodegaSelectedTab", 'Guias');
            localStorage.removeItem("desdeHome");
        } else if (validador === 2) {
            this.selectedTab = 'Textos';
            localStorage.setItem("bodegaSelectedTab", 'Textos');
            localStorage.removeItem("desdeHome");
        } else if (savedTab) {
            // Restaurar el tab guardado
            this.selectedTab = savedTab;
        } else {
            // Por defecto mostrar Guias
            this.selectedTab = 'Guias';
            localStorage.setItem("bodegaSelectedTab", 'Guias');
        }

        // Actualizar buttonStyle según el tab seleccionado
        for (let button in this.buttonStyle) {
            this.buttonStyle[button] = button === this.selectedTab;
        }
    },
    methods: {
        selectTab(tab) {
            this.selectedTab = tab;
            localStorage.setItem("bodegaSelectedTab", tab);
            for (let button in this.buttonStyle) {
                this.buttonStyle[button] = button === tab;
            }
        }
    },
    computed: {
        ...mapState(["AdminBodega", "userRoot"]),
    },

};
</script>


<style scoped>
.active {
    background-color: green;
    color: white;
    /* Cambia el color del texto para el botón activo según tu preferencia */
}
</style>
