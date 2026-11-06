<template>
<div>
    <iframe 
        id="simulador_iframe" 
        frameborder="0" 
        allowfullscreen="true" 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" 
        v-bind:src="urlCompleta">
    </iframe>
</div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            urlCompleta: ''
        }
    },
    methods: {
        construirUrl() {
            // Obtener la URL del localStorage
            this.url = localStorage.getItem('simulador_url');
            
            if (!this.url) {
                console.error('No se encontró la URL del simulador');
                return;
            }

            // Construir la URL completa
            // Si la URL ya tiene http:// o https://, usarla directamente
            if (this.url.startsWith('http://') || this.url.startsWith('https://')) {
                this.urlCompleta = this.url;
            } else {
                // Si no, construir la ruta con el servidor de archivos
                this.urlCompleta = this.$data_url + 'archivos/upload/simuladores/' + this.url;
            }

            console.log('URL del simulador:', this.urlCompleta);
        }
    },
    mounted() {
        this.construirUrl();
    },
}
</script>

<style scoped>
/* Asegurar que el iframe ocupe toda la pantalla */
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}
</style>
