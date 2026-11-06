<template lang="">
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab v-if="usuario.id_group == 1 || usuario.id_group == 11 " label="Banco de preguntas">
                <PreguntasComponent/>
            </vs-tab>
            <vs-tab v-if="usuario.id_group == 1" label="Exportar Banco de preguntas">
                <ExportarPreguntasVue/>
            </vs-tab>
            <!-- <vs-tab v-if="usuario.id_group == 1" label="Preguntas de diagnóstico">
                <ListadoPreguntasVue/>
            </vs-tab> -->
            <!-- <vs-tab v-if="usuario.id_group == 1 || usuario.id_group == 11  || usuario.id_group == 6" label="Resultado de diagnóstico">
                <ResultadoPreguntasVue/>
            </vs-tab> -->
            <vs-tab v-if="usuario.id_group == 1" label="Preguntas por Institución">
              <Preguntas_x_institucion/>
            </vs-tab>
            <vs-tab v-if="usuario.id_group == 1" label="Copiar preguntas entre asignaturas">
              <PreguntasMoverAsignaturas/>
            </vs-tab>
        </vs-tabs>
    </div>
</template>
<script>
import PreguntasComponent from '../../evaluaciones/PreguntasComponent.vue'
import ListadoPreguntasVue from './ListadoPreguntas.vue';
import ResultadoPreguntasVue from './ResultadoPreguntas.vue';
import ExportarPreguntasVue from '../../evaluaciones/ExportarPreguntas.vue';
import Preguntas_x_institucion from '../../evaluaciones/preguntas_x_institucion.vue'
import PreguntasMoverAsignaturas from '../../evaluaciones/PreguntasMoverAsignaturas/PreguntasMoverAsignaturas.vue';
export default{
    components:{
        ListadoPreguntasVue,
        PreguntasComponent,
        ResultadoPreguntasVue,
        ExportarPreguntasVue,
        Preguntas_x_institucion,
        PreguntasMoverAsignaturas
    },
    data(){
        return{
            usuario:[],
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
}
</script>
