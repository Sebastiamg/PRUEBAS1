<template>
  <div class="w-full h-full">
    <div v-if="contenidos.length === 0" class="mb-4">
      <span>
        Agrega los elementos que deberá contener el formato para guardar contenido relacionado al área de
        <span class="text-indigo-900 font-bold">{{ area.nombrearea }}</span>
      </span>
    </div>
    <div class="flex flex-col space-y-2">
      <div v-for="(contenido, index) in contenidos" :key="index" class="w-full p-2 my-2 rounded shadow">
        <div class="flex justify-between items-baseline">
          <span>{{ contenido.label === '' ? 'Aquí va el nombre del campo' : contenido.label }}</span>
          <vs-button type="border" color="danger" class="p-1 flex justify-center items-center"
            @click="removerContenido(index)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#EA5455" height="1em" viewBox="0 0 512 512">
              <path
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
            &nbsp;
            Remover
          </vs-button>
        </div>
        <vs-divider class="mb-6 bt-2" />
        <vs-input label-placeholder="Nombre del campo (label)" v-model="contenido.label" class="w-full" />
        <v-select class="w-full" label="name" :options="tipos" :reduce="tipos => tipos.type" v-model="contenido.tipo">
          <template #header>Tipo de campo</template>
        </v-select>
        <div v-if="contenido.tipo === 'menu de opciones'">
          <span class="font-bold">Agregar opciones <span class="text-xs text-gray font-light">(separar con
              ",")</span></span>
          <vs-input class="w-full" @input="agregarOpciones($event, contenido)"></vs-input>
          <vs-chip v-for="(opcion, index) in contenido.opciones" :key="index" closable class="my-4 mr-2"
            @click="removerOpciones(opcion, contenido)">
            <span class="text-black font-semibold">{{ opcion }}</span>
          </vs-chip>
        </div>
      </div>
    </div>
    <div @click="agregarContenido"
      class="w-full border border-gray-500 p-4 shadow dotted-border rounded flex justify-center space-x-4 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-4" height="1em" viewBox="0 0 512 512">
        <path
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
      </svg>
      Agregar elemento
    </div>
    <div class="flex justify-end mt-4">
      <vs-button type="border" @click="guardarFormato">Guardar</vs-button>
    </div>
  </div>
</template>

<script>
import InputModel from '@/models/InputModel';
import vSelect from 'vue-select';
export default ({
  components: {
    vSelect,
  },
  props: {
    area: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      contenidos: [],
      tipos: [
        {
          name: "Texto corto",
          type: "texto corto",
        },
        {
          name: "Menú de opciones",
          type: "menu de opciones",
        },
        {
          name: "Editor de texto",
          type: "editor de texto",
        }
      ]
    };
  },
  methods: {
    agregarContenido() {
      this.contenidos.push(
        new InputModel(
          'nombre del campo',
          'texto corto',
          [],
        )
      );
    },
    removerContenido(index) {
      this.contenidos.splice(index, 1); // Remover el elemento del arreglo
    },
    agregarOpciones(event, contenido) {
      const valorInput = event; // El valor del input está directamente en event
      if (valorInput.includes(',')) {
        const opciones = valorInput.split(',');
        contenido.opciones = [...contenido.opciones, ...opciones]; // Agregar opciones
        contenido.opciones = [...new Set(contenido.opciones)]; // Remover duplicados
        contenido.opciones = contenido.opciones.filter((o) => o !== ''); // Remover vacíos
      }
    },
    removerOpciones(opcion, contenido) {
      contenido.opciones = contenido.opciones.filter((o) => o !== opcion); // Remover la opción del arreglo
    },
    async guardarFormato() {
      const me = this;

      me.$vs.loading(); // Muestra el indicador de carga

      // Realiza una petición para guardar el formato del contenido
      await me.$http.post(`${me.$server_url}contenido/formato/${this.$props.area.idarea}/store`, {
        area: this.$props.area,
        contenidos: this.contenidos
      }).then((res) => {
        me.$vs.notify({
          title: 'Éxito',
          text: res.data.message,
          color: 'success',
          position: 'top-right',
        });
      }).catch((err) => {
        me.$vs.loading.close();
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close();
        location.reload();
      })
    },
    async obtenerFormato() {
      const me = this;

      me.$vs.loading(); // Muestra el indicador de carga

      // Realiza una petición para obtener el formato del contenido
      await me.$http.get(`${me.$server_url}contenidos/formatos?areaId=${me.$props.area.idarea}`).then((res) => {
        const data = res.data.data; // Asigna los datos obtenidos a la variable 'data'
        me.contenidos = JSON.parse(data.contenidoformato); // Parsea la cadena JSON a un objeto
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close(); // Cierra el indicador de carga
      });
    },
  },
  mounted() {
    this.obtenerFormato(); // Obtiene el formato del contenido
  }
})
</script>

<style>
.dotted-border {
  border: 1px dashed #ccc;
}

.dotted-border:hover {
  border: 1px dashed #000;
  cursor: pointer;
}
</style>
