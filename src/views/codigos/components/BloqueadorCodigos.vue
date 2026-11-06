<template>
  <div>
    <vs-tabs alignment="fixed">
      <vs-tab label="Gestión Bodega" @click="menu = 0;">
        <div>

        </div>
      </vs-tab>
      <vs-tab label="Gestión Regalados" @click="menu = 1;">
        <div>

        </div>
      </vs-tab>
      <vs-tab label="Activar Códigos" @click="menu = 2;">
        <div>

        </div>
      </vs-tab>
      <vs-tab label="Reportes" @click="menu = 3;">
        <div>

        </div>
      </vs-tab>
    </vs-tabs>
    <!--COMPONENTES-->
    <div
     v-if="menu == 0"
      title="Gestión Bodega"
      >
        <!--MENU-->
        <nav class="breadcrumbs mt-3">
          <span class="breadcrumbs__item btnMenu activeBtn Gestionmenu0 cursor-pointer" @click="filtro = 0;estadoMenu();limpiarCache();">Gestión Bodega</span>
          <span class="breadcrumbs__item btnMenu   Gestionmenu1 cursor-pointer"         @click="filtro = 1;estadoMenu();limpiarCache();">Búsqueda de Documentos</span>
        </nav>
        <br><br>
        <!--COMPONENTES-->
        <div>
          <div v-if="filtro == 0">
            <GestionBodegaVue/>
          </div>
          <div v-if="filtro == 1">
            <GestionBusquedaFacturaVue/>
          </div>
        </div>
    </div>
    <vx-card
     v-if="menu == 1"
      title="Gestión Regalados"
      >
        <div>
          <ImportSoloCodigosVue/>
        </div>
    </vx-card>
    <div v-if="menu == 2">
      <ImportActivarDevolucionVue/>
    </div>
    <!--reportes-->
    <div v-if="menu == 3">
      <ScreenBodegaReportesVue/>
    </div>
  </div>
</template>
<script>
import GestionBodegaVue from '@/views/codigos/components/utils/components/GestionLiquidacion/GestionBodega'
import Codigosmix from "@/mixins/Codigosmix";
const GestionBusquedaFacturaVue   = () => import('./utils/components/GestionLiquidacion/GestionBusquedaFactura.vue');
const ImportSoloCodigosVue        = () => import('./CodigosRegalados/ImportSoloCodigos.vue');
const ImportActivarDevolucionVue  = () => import('./ImportActivarDevolucion.vue')
const ScreenBodegaReportesVue     = () => import('../reportes/ScreenBodegaReportes.vue')
export default{
  components:{
    GestionBodegaVue,
    GestionBusquedaFacturaVue,
    ImportSoloCodigosVue,
    ImportActivarDevolucionVue,
    ScreenBodegaReportesVue
  },
  mixins: [Codigosmix],
  data(){
    return{
      filtro:0,
      menu:0,
    }
  },
  methods:{
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelectGestionBodega',me.filtro)
      var divs = document.querySelectorAll(".btnMenu");
      for (var i = 0; i < divs.length; i++) {
        divs[i].classList.remove("activeBtn");
      }
      const container = document.querySelector(".Gestionmenu"+me.filtro);
      container.classList.add("activeBtn");
    },
  }
}
</script>
<style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #000;
color:white;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
