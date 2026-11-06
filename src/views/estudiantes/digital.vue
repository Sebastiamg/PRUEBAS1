<template>
<div>
    <!-- <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'/upload/libro/'+url+'?id_grupo='+usuario.id_group"></iframe> -->
    <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+url+'/?init='+pag_inicio+'&final='+pag_fin+'&id_group='+usuario.id_group+'&idasignatura='+idasignatura+'&idusuario='+idusuario+'&url='+url+'&periodo_id='+periodo_id"></iframe>

    <!-- <vs-button color="danger" @click="salir()" class="mt-3 mb-3" type="relief">Salir</vs-button> -->
</div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            puerto: 0,
            usuario:[],
            idasignatura:'',
            idusuario:'',
            periodo_id:'',
        }
    },
    methods: {
        salir(){
            this.$router.push('/estudiante/libros');
        }
    },
    created() {
        this.pag_inicio = localStorage.pag_inicio
        this.pag_fin = localStorage.pag_fin
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        let me = this;
        this.idasignatura = localStorage.idasignatura
        this.idusuario    = me.usuario.idusuario
        this.periodo_id   = localStorage.periodo_id
        this.url = localStorage.getItem('url')
        this.puerto = localStorage.getItem('puerto')
        console.log(this.puerto)
    },
}
</script>
