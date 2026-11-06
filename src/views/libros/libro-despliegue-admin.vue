<template>
<div>

    <iframe v-if="vista_libro==='todo'" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url_actividad"></iframe>

    <iframe v-else id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url+'/?init='+pag_inicio+'&final='+pag_fin"></iframe>

    <vs-button color="danger" @click="$router.push('/unidadesTemas')" style="margin-top: 50px; margin-right: 8px; float:right" class="mb-3 text-right" >Salir</vs-button>
</div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            url_actividad: '',
            pag_inicio: 1,
            pag_fin: 1,
            vista_libro: '',
        }
    },
    methods: {
        salir(){
            this.$router.push('/unidadesTemas');
        }
    },
    mounted() {
        this.vista_libro = localStorage.vistalibro
        this.pag_inicio = localStorage.pag_inicio
        this.pag_fin = localStorage.pag_fin
        this.url = localStorage.getItem('url')
        this.url_actividad = localStorage.getItem('url_actividad')
        // console.log($data_url+'archivos/upload/libro/'+this.url+'/?init='+this.pag_inicio+'&final='+this.pag_fin)
    },
}
</script>
