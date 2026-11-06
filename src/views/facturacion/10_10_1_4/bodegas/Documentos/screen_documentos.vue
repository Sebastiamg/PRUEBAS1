<template>
    <div>
      <vx-card>
        <vs-tabs>
          <vs-tab label="Lista de documentos">
              <listado_documentos />
          </vs-tab>
          <!-- <vs-tab label="Notas">
              <documentos_notas />
          </vs-tab> -->
        </vs-tabs>
      </vx-card>
    </div>
  </template>
<script>
import listado_documentos from './lista_documentos.vue';
// import documentos_notas from './notas.vue';


export default {
    data() {
        return {};
    },
    mounted() {},
    methods: {},
    components: {
        listado_documentos,
        // documentos_notas,
    }
}
</script>
