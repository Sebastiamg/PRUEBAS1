<template>
  <div class="w-screen h-screen px-6 py-2">
    <vs-row vs-justify="flex-start">
      <vs-col>
        <AreaContent :areas="areas" :selected-area="area" :searchAreas="searchArea" :clear="clearArea"
          :set-area="setArea" />
      </vs-col>
      <vs-col v-if="area">
        <Contenidos :area="area" />
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import AreaContent from "./content/Area/AreaContent.vue"
import Contenidos from "./content/Contenidos/Contenidos.vue";

export default {
  components: {
    AreaContent,
    Contenidos
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('usuario')); // Obtiene el usuario actual
  },
  data() {
    return {
      currentUser: null,
      buscarArea: '',
      area: null,
      areas: [],
    };
  },
  mounted() {
    const me = this; // Variable para almacenar el contexto actual
    const settArea = JSON.parse(localStorage.getItem('area')); // Obtiene el área seleccionada

    // Si no hay un área seleccionada, obtiene las áreas
    if (!settArea) {
      me.getAreas(); // Obtiene las áreas
    } else {
      // Si hay un área seleccionada, la asigna a la variable 'area' y la agrega al arreglo 'areas'
      this.areas.push(settArea);
      this.area = settArea;
    }
    this.checkRole(); // Verifica los permisos del usuario
  },
  methods: {
    clearArea() {
      localStorage.removeItem('area'); // Elimina el área seleccionada del almacenamiento local
      this.area = null; // Asigna 'null' a la variable 'area'
      this.getAreas(); // Obtiene las áreas
    },
    setArea(area) {
      localStorage.setItem('area', JSON.stringify(area)); // Almacena el área seleccionada en el almacenamiento local
      this.areas = []; // Asigna un arreglo vacío a la variable 'areas'
      this.area = area; // Asigna el área seleccionada a la variable 'area'
      this.areas = [area]; // Agrega el área seleccionada al arreglo 'areas'
    },
    async searchArea(area) {
      // Si el parámetro 'area' es una cadena vacía, obtiene las áreas
      if (area === '') {
        this.getAreas(); // Obtiene las áreas
        return;
      }
      this.areas = this.areas.filter((a) => a.nombrearea.toLowerCase().includes(area.toLowerCase())); // Filtra las áreas por el nombre
    },
    async getAreas() {
      this.$vs.loading(); // Muestra el indicador de carga

      // Realiza una petición para obtener las áreas
      this.$http.get(`${this.$server_url}biblioteca/areas`).then((res) => {
        this.areas = res.data.data; // Asigna los datos obtenidos a la variable 'areas'

        // Ordena las áreas por nombre
        this.areas.sort((a, b) => {
          if (a.nombrearea < b.nombrearea) {
            return -1;
          }
          if (a.nombrearea > b.nombrearea) {
            return 1;
          }
          return 0;
        });
      }).catch((err) => {
        this.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        this.$vs.loading.close(); // Cierra el indicador de carga
      });
    },
    checkRole() {
      const me = this; // Variable para almacenar el contexto actual
      me.$vs.loading(); // Muestra el indicador de carga

      // Realiza una petición para obtener los permisos del usuario actual
      me.$http.get(`${this.$server_url}permisos/${this.currentUser.idusuario}`).then((res) => {
        // Si el usuario no tiene permisos para acceder a esta sección, lo redirecciona a la página principal
        if (res.data.length === 0) {
          // Si el usuario no tiene permisos para acceder a esta sección, lo redirecciona a la página principal
          if (me.currentUser.id_group === 1 || me.currentUser.id_group === 29 || me.currentUser.id_group === 30) {
            return;
          } else {
            me.$vs.notify({
              title: 'Error',
              text: 'No tiene permisos para acceder a esta sección',
              color: 'danger',
              position: 'top-right',
            });
            me.$router.push('/');
          }
        } else {
          return;
        }
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
        me.$router.push('/');
      }).finally(() => {
        me.$vs.loading.close();
      });
    }
  },
};
</script>
