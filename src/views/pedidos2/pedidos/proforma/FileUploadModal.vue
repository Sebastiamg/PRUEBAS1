<template>
<vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
    <div align="center">
        <img class="mt-2" src="https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/cargandopdf2.gif" />
    </div>
</vs-popup>
</template>

<script>
export default {
    // Puedes activar o desactivar el modal de carga mediante una propiedad de datos
    data() {
        return {
            popupCarga: false,
        };
    },
    mounted() {
        // Activar el modal de carga cuando la página se carga
        this.popupCarga = true;

        // Desactiva el modal de carga después de tres segundos
        setTimeout(() => {
            this.popupCarga = false;
        }, 3000);

        // Emitir un evento para notificar que la acción ha terminado después de cinco segundos
        setTimeout(() => {
            this.$emit('change', true);
        }, 5000);
    },
};
</script>
