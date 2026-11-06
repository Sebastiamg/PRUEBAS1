<template>
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab label="Importacion de codigos" v-if="userRoot" @click="menu = 0;">
                <vx-card title="Importación de Estudiantes y códigos">
                    <ImportCodigosEstudiantesVue class="mt-3" v-if="menu == 0"/>
                </vx-card>
            </vs-tab>
            <vs-tab label="Importacion de cursos" v-if="userRoot" @click="menu =1;">
                <vx-card title="Importación de cursos">
                    <EstudianteImportCursosVue class="mt-3" v-if="menu == 1"/>
                </vx-card>
            </vs-tab>
            <vs-tab label="Importacion de registro" @click="menu =2;">
                <vx-card title="Importación de registro de Estudiantes - Docentes - Docentes Evaluación">
                    <EstudianteImportacionRegistroVue class="mt-3" v-if="menu == 2"/>
                </vx-card>
            </vs-tab>
        </vs-tabs>
    </div>
</template>

<script>
  import {
        mapState
  } from "vuex";
const ImportCodigosEstudiantesVue   = () => import('./ImportCodigosEstudiantes.vue')
const EstudianteImportCursosVue     = () => import('./EstudianteImportCursos.vue')
const EstudianteImportacionRegistroVue = () => import('./EstudianteImportacionRegistro.vue');
export default {
    components: {
        ImportCodigosEstudiantesVue,
        EstudianteImportCursosVue,
        EstudianteImportacionRegistroVue
    },
    name: 'ScreenImportacion',
    data() {
        return {
            menu:0,
            // Your component's data properties here
        };
    },
    computed: {
            ...mapState(['userRoot', 'userAsesor']),
      },
    methods: {
        // Your component's methods here
    },
    mounted() {
        // Code to run when the component is mounted
        if(this.userAsesor){
            this.menu = 2
        }
    },
};
</script>

<style scoped>
/* Your component's scoped styles here */
</style>