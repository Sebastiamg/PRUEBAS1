<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <div>Esta sección facilita la vinculación de usuarios con perfil de librería a sus correspondientes agrupaciones de contratos, que incluyen todos los pedidos asociados. Gracias a esta funcionalidad, los usuarios con perfil de librería pueden acceder fácilmente a sus agrupaciones de contratos, garantizando que puedan gestionar sus proformas de manera eficiente.</div>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="getAceptarInformacion()" type="relief">Cerrar</vs-button>
    </vs-col>
</vs-row>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {
            //showAgregarNuevo: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    mounted() {
        // let me = this;
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        getAceptarInformacion() {
            this.$emit('change', {
                verificacionemitinformacion: 2
            });
        },
    },
};
</script>
