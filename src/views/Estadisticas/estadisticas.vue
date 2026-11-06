<template>
<div>
    <div class="w-full p-2">
        <vs-card class="p-2">
            <h1>{{institucion.nombreInstitucion}}</h1>
            <p>Teléf. {{institucion.telefonoInstitucion}}</p>
            <span>{{institucion.direccionInstitucion}}</span>
        </vs-card>
    </div>
    <div class="">
        <vs-tabs alignment="fixed">
            <vs-tab label="Reporte de Contenidos">
                <contenidos></contenidos>
            </vs-tab>
            <vs-tab label="Reporte de Docentes">
                <docentes></docentes>
            </vs-tab>
            <!-- <vs-tab label="Reporte de ">
                <div></div>
            </vs-tab>
            <vs-tab label="Reporte de ">
                <div></div>
            </vs-tab> -->
        </vs-tabs>
    </div>
</div>
</template>

<script>
import docentes from "./docentes.vue";
import contenidos from "./contenidos.vue";
export default {
    data() {
        return {
            institucion:[]
        }
    },
    components: {
        docentes,
        contenidos
    },
    created() {
        this.institucion = JSON.parse(localStorage.getItem("institucion"));
    },
}
</script>

