<template>
<div>
    <iframe v-if="vista_libro==='todo'" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url_actividad"></iframe>
    <iframe v-else id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url+'/?init='+pag_inicio+'&final='+pag_fin+'&idasignatura='+idasignatura"></iframe>
    <!-- <vs-button color="danger" @click="salir()" style="margin-top: 50px; margin-right: 8px; float:right" class="mb-3 text-right" >Salir</vs-button> -->
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
            idasignatura:'',
            url:'',
            usuariolibre: '',
            librofree: null

        }
    },
    methods: {
        salir(){
            if(this.librofree === null){
                this.$router.push('/demos');
            }
        }
    },
    mounted() {
        let me = this;
        this.idasignatura = 10
        // this.url          = 'FAE_Lengua3'
        this.vista_libro = localStorage.vistalibro
        // this.pag_inicio = 10
        // this.pag_fin = 18
        this.url = this.$route.params.libro;  // Aquí usamos el parametro de la URL
        this.pag_inicio = this.$route.params.paginaInicio
        this.pag_fin = this.$route.params.paginaFin

        this.url_actividad = localStorage.getItem('url_actividad')
        this.valUnidad      = localStorage.valUnidad
        // console.log($data_url+'archivos/upload/libro/'+this.url+'/index.php?init='+this.pag_inicio+'&final='+this.pag_fin)
    },
}
</script>
