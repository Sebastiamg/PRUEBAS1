<template>
<div>

    <iframe v-if="vista_libro==='todo'" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url_actividad"></iframe>

    <iframe v-else-if="vista_libro==='por_unidad_guia'" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro_guia/'+url_guiaweb+'/?init='+pag_inicio_guia+'&final='+pag_fin_guia+'&idasignatura='+idasignatura+'&idusuario='+idusuario+'&url='+url+'&periodo_id='+periodo_id+'&valUnidad='+valUnidad"></iframe>

    <iframe v-else id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url+'/?init='+pag_inicio+'&final='+pag_fin+'&idasignatura='+idasignatura+'&idusuario='+idusuario+'&url='+url+'&periodo_id='+periodo_id+'&valUnidad='+valUnidad"></iframe>

    <!-- <vs-button color="danger" @click="salir()" style="margin-top: 50px; margin-right: 8px; float:right" class="mb-3 text-right" >Salir</vs-button> -->
</div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            url_guiaweb: '',
            url_actividad: '',
            pag_inicio: 1,
            pag_fin: 1,
            pag_inicio_guia: 1,
            pag_fin_guia: 1,
            vista_libro: '',
            usuario:[],
            idasignatura:'',
            idusuario:'',
            url:'',
            periodo_id:'',

        }
    },
    methods: {
        salir(){
            if(this.usuario.id_group == 16){
                this.$router.push('/colegios/docente/libro/desgloselibro');
            }else{
                this.$router.push('/docente/libro/desgloselibro');
            }

        }
    },
    mounted() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.idasignatura = localStorage.idasignatura
        this.idusuario    = me.usuario.idusuario
        this.url          = localStorage.url
        this.url_guiaweb     = localStorage.url_guiaweb
        this.periodo_id   = localStorage.periodo_id
        this.vista_libro = localStorage.vistalibro
        this.pag_inicio = localStorage.pag_inicio
        this.pag_fin = localStorage.pag_fin
        this.pag_inicio_guia = localStorage.pag_inicio_guia
        this.pag_fin_guia = localStorage.pag_fin_guia
        this.url = localStorage.getItem('url')
        this.url_actividad = localStorage.getItem('url_actividad')
        this.valUnidad      = localStorage.valUnidad
        // console.log($data_url+'archivos/upload/libro/'+this.url+'/index.php?init='+this.pag_inicio+'&final='+this.pag_fin)
    },
}
</script>
