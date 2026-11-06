<template>
    <div class='vx-col w-full mt-4'>
        <!-- institucionSelected {{ institucionSelected }} -->
        <vs-alert>Hay {{ listaDocentes.length }} docentes con asignaturas activas en periodo {{
          institucionSelected.periodo }}
        </vs-alert>

        <vs-button color="success" @click="exportarDocentes" icon class="mt-3">
        <i class="fa-solid fa-file-excel mr-1"></i> Exportar Excel
        </vs-button>
        <div class="mt-4 docentes-container">
            <div v-for="(docente, indextr) in listaDocentes" :key="indextr" class="docente-item">
                <!-- Cabecera del docente -->
                <div class="docente-header">
                    <p><small>{{ docente.idusuario }}</small></p>
                    <p>{{ docente.docente }}</p>
                    <p>{{ docente.cedula }}</p>
                    <p>
                        <b>Asignaturas: {{ docente.asignaturas.length }}</b>
                    </p>
                </div>

                <!-- Listado de asignaturas -->
                <div class="auto-grid">
                    <div v-for="(asignatura, indexAsig) in docente.asignaturas" :key="indexAsig"
                        class="d-inline align-center m-2 p-2 border-2 asig-select text-dark width-libro-select">
                        {{ asignatura.nombre }} <br><b>{{ institucionSelected.periodo }}</b>
                        <small>Actualizada:</small>
                        <small>({{ asignatura.updated_at }})</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import Codigosmix from "@/mixins/Codigosmix";
export default {
    mixins: [Codigosmix],
    props: {

        institucionSelected: {
            type: Object,
            default: () => { }
        }
    },
    components: {},
    data() {
        return {
            listaDocentes: [],
        };
    },
    created() { },
    mounted() {
        this.f_inicio();
    },
    methods: {
        f_inicio() {
            let me = this;
            me.$vs.loading()
            let formData = new FormData();
            formData.append('idInstitucion', this.institucionSelected.idInstitucion);
            formData.append('periodo_id', this.institucionSelected.periodo_id);
            this.$http.post(this.$server_url + 'docentes_x_institucion', formData)
                .then(function (res) {
                    me.listaDocentes = res.data
                    // console.log('listaDocentes', me.listaDocentes)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
                })

        },
        exportarDocentes() {
          let me = this;

          // Paso 1: Encontrar cuántas asignaturas tiene el docente con más materias
          let maxAsignaturas = Math.max(...me.listaDocentes.map(d => d.asignaturas.length));

          // Paso 2: Crear headers y fieldKeys dinámicos
          let headers = ['Docente', 'Cédula'];
          let fieldKeys = ['docente', 'cedula'];

          for (let i = 1; i <= maxAsignaturas; i++) {
            headers.push(`Asignatura ${i}`);
            fieldKeys.push(`asignatura_${i}`);
          }

          // Paso 3: Transformar la listaDocentes a un array plano
          let datosPlano = me.listaDocentes.map(docente => {
            let objPlano = {
              docente: docente.docente,
              cedula: docente.cedula,
            };

            docente.asignaturas.forEach((asig, idx) => {
              objPlano[`asignatura_${idx + 1}`] = asig.nombre;
            });

            return objPlano;
          });

          // Paso 4: Llamar al exportador
          let nameFile = 'Reporte_Docentes_' + (me.institucionSelected.nombreInstitucion+'_'+ me.institucionSelected.periodo || '');
          me.m_exportTodo(headers, fieldKeys, datosPlano, nameFile);
        }

    }
};
</script>

<style scoped>
.width-libro-select {
    display: flex;
    flex-flow: column nowrap;
    padding: 1rem;
    background-image: linear-gradient(to top, rgba(236, 239, 245, 0.5), rgba(223, 228, 236, 0.7));
    border: 1px solid #999;
    border-radius: 5px;
}

.auto-grid {
    display: -ms-grid;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    grid-gap: 1rem;
    /* background-image: linear-gradient(135deg, #D4FFCC 25%, #F2F2F2 25%, #F2F2F2 50%, #D4FFCC 50%, #D4FFCC 75%, #F2F2F2 75%, #F2F2F2 100%); */
    background-size: 50px 50px;
}

.docentes-container {
    width: 100%;
    margin-bottom: 30px;
}

.docente-item {
    margin-bottom: 30px;
    border: 1px solid #c5c3c3;
    border-radius: 8px;
    overflow: hidden;
}

.docente-header {
    padding: 15px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
}
</style>
