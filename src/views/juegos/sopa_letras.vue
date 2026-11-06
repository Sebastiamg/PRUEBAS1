<template>
<div class="mt-8">
    <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="width: 100%; height: 700px;" v-bind:src="$data_url+'archivos/upload/juegos/sopaLetrasTemplate/index.html?id_juego='+this.id_juego+'&usuario='+this.idusuario+'&codigo_curso='+this.codigo_curso"></iframe>
</div>
</template>

<script>
export default {
    data() {
        return {
            usuario: '',
            id_juego: '',
            idusuario: '',
            codigo_curso: '',
            tmpcodigo_curso: '',
        }
    },
    methods: {

    },
    mounted() {
        let me = this
        me.$http.get(this.$server_url+'pregunta_opciones/' + me.id_juego)
        .then(res => {
            
        })

        this.id_juego = this.$route.params.id
        // this.codigo_curso = this.$route.params.codigo
        this.tmpcodigo_curso = JSON.parse(localStorage.getItem('curso_juego'));
        this.codigo_curso = this.tmpcodigo_curso.codigo
        console.log( this.codigo_curso )
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.idusuario = this.usuario.idusuario
    },
}
</script>
