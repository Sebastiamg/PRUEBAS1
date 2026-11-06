<template>
  <vx-card>
    <div>
      <div class="menu">
        <button
          v-if="userRoot"
          class="menu-btn"
          :class="{ active: menu === 0 }"
          @click="menu = 0">Asignar Libros de combos
        </button>
        <button
          class="menu-btn"
          :class="{ active: menu === 2 }"
          @click="menu = 2">Asignar Pre facturas</button>
        <!--boton para asignar plus-->
        <button
          class="menu-btn"
          :class="{ active: menu === 3 }"
          @click="menu = 3">
          Asignar Plus
        </button>
      </div>
      <!-- <div v-else>
        <p class="text-center text-2xl text-warning"> Asignar Plus</p>
      </div> -->
      <!--components-->
      <div v-if="menu == 0" class="mt-5">
        <ComboImportAsignacion/>
      </div>
      <div v-if="menu == 2" class="mt-5">
        <CodigosPrefacturasImportVue/>
      </div>
      <div v-if="menu == 3" class="mt-5">
        <PlusImportAddVue/>
      </div>
    </div>
  </vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
// Importar los componentes
const ComboImportAsignacion       = () => import('./components/asignacion/ComboImportAsignacion.vue');
const CodigosPrefacturasImportVue     = () => import('@/views/codigos/prefacturas/CodigosPrefacturasImport.vue');
const PlusImportAddVue                = () => import('../components/plus/PlusImportAdd.vue')
export default {
  name: 'ScreenCombos',
  components: {
    ComboImportAsignacion,
    CodigosPrefacturasImportVue,
    PlusImportAddVue,
  },
  data() {
    return {
      menu: 0,
      title: 'Asignación de combos',
    };
  },
  mounted() {
    if(!this.userRoot){
      this.menu = 3;
    }
  },
  computed: {
    ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
  },
  methods: {},
};
</script>

<style scoped>

/* Menú de navegación */
.menu {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding: 10px 0;
  border-radius: 8px;
}

/* Estilo de los botones del menú */
.menu-btn {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: rgb(81, 131, 224);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Botón activo */
.menu-btn.active {
  background-color: #1a5185;
  transform: scale(1.1);
}

/* Hover de los botones */
.menu-btn:hover {
  background-color: #0b5499;
}

/* Estilo de la sección de contenido */
.content {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Agregar un poco de espacio entre los componentes */
.content > * {
  max-width: 800px;
  width: 100%;
  padding: 20px;
}

/* Componente base */
h2 {
  color: #333;
}

p {
  font-size: 16px;
  color: #666;
}
</style>
