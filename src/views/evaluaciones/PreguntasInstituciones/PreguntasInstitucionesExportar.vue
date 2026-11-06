<template>
  <div>
    <!-- Botón para imprimir -->
    <vs-button color="primary" type="relief" @click="ExportToDoc">imprimir</vs-button>
    <div id="MainHTML" class="mt-3" v-if="preguntas.length > 0">
      <!-- <div v-for="(tr, index) in preguntas" :key="index">
        <h2 class="p-2">UNIDAD {{ tr.unidad }} | TEMA: {{ tr.nombre_tema.toUpperCase() }}</h2> -->
        <vs-table stripe :data="preguntas" no-data-text="No hay preguntas de este tema">
          <template slot="thead">
            <vs-th sort-key="pregunta">Pregunta</vs-th>
          </template>
          <template slot-scope="{ data }">
            <vs-tr v-for="(pregunta, indextr) in data" :key="indextr">
              <vs-td :data="pregunta.descripcion">
                <p><b>Unidad:</b> {{ pregunta.unidad }}</p>
                <p><b>Tema:</b> {{ pregunta.nombre_tema }}</p>
                <b>{{ indextr + 1 }}. {{ pregunta.descripcion }}</b><br>
                <p><b>Tipo:</b> {{ pregunta.nombre_tipo }}</p>
                <img v-if="pregunta.img_pregunta && pregunta.img_pregunta !== 'null'"
                     :src="$data_url + 'archivos/img/img_preguntas/' + pregunta.img_pregunta"
                     class="img-responsive" width="50" height="50" style="border-radius: 5px;">
                <div slot="header">
                  Opciones
                </div>
                <div class="mb-5" v-for="(item, indexitem) in pregunta.opciones" :key="indexitem">
                  <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo === 1">Respuesta correcta<br></div>
                  <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                  <div style="width: 100%">{{ item.opcion }}<br></div>
                  <div style="width: 100%">
                    <img v-if="item.img_opcion && item.img_opcion !== 'null'"
                        :src="$data_url + 'archivos/img/img_preguntas/' + item.img_opcion"
                        class="img-responsive" style="border-radius: 5px;" width="50" height="50">
                  </div>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      <!-- </div> -->
    </div>



  </div>
</template>

<script>
import Codigosmix from '@/mixins/Codigosmix'
export default {
  mixins:[Codigosmix],
  data() {
    return {
    };
  },
  props: {
    preguntas: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nombreAsignatura:{
      type: String,
      default: function() {
        return '';
      }
    },
    nombreInstitucion:{
      type: String,
      default: function() {
        return '';
      }
    },
  },
  mounted() {
    this.exportar()
  },
  methods: {
    exportar() {
      let me = this;
      // Mostrar el loading inmediatamente
      me.$vs.loading();

      // Retardo para dar tiempo a que el loading se vea
      setTimeout(() => {
        // Llamar a la función de exportación
        me.m_ExportToDoc(me.nombreAsignatura + ' - ' + me.nombreInstitucion);

        // Después de que se completa la exportación, deshabilitar el loading
        me.$vs.loading.close();

      }, 300); // Retardo de 300ms, ajusta este valor si es necesario
    },

  }
};
</script>

<style scoped>
/* Estilos para el modal */
.loading-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  text-align: center;
}

.spinner {
  border: 8px solid #f3f3f3; /* Gris claro */
  border-top: 8px solid #3498db; /* Azul */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
