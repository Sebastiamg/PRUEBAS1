<template>
    <div class="mt-5">
        <vs-tabs alignment="fixed">
            <vs-tab label="Revision estudiantes">
                <RevisionEstudiantes class="mt-3"/>
            </vs-tab>
            <vs-tab label="Actualización de estudiantes">
                <ActualizacionEstudiantes/>
            </vs-tab>
             <!--
            <vs-tab label="Contributors">
                <div></div>
            </vs-tab>
            <vs-tab label="Ecosystem">
                <div></div>
            </vs-tab> -->
        </vs-tabs>
    </div>
</template>
<script>
import RevisionEstudiantes from './components/RevisionEstudiantes.vue';
import ActualizacionEstudiantes from './components/ActualizacionEstudiantes.vue';
export default{
    components:{
        RevisionEstudiantes,
        ActualizacionEstudiantes,
    },
    data(){
        return{

        }
    }
}
</script>