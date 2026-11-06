<template>
    <div>
        pensiones
    </div>
</template>


<script>
export default {
    data() {
        return{
            cursos:[],
        }
    },
    methods:{
         
        //para obtener el listado de los cursos de la institucion
        getCursosInstitucion() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'cursosInstitucion')
                .then(function (res) {
                    me.cursos = res.data.area
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
    }
}
</script>