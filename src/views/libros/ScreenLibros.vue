<template>
    <div>
        <p class="text-primary font-semibold mt-3" style="font-size:19px;opacity:0.8;">Listado de libros</p>
        <p>!Para crear un libro debe asignar una asignatura - Un libro tiene un asignatura</p>
        <br>
        <div class="vx-row mb-6">
            <div class="vx-col xl:1/2 lg:w-1/2 md:w-1/2 sm:w-full">
                <!-- currency -->
                <vx-input-group class="mb-base" style="display:flex;flex-wrap: wrap;">
                    <template slot="prepend">
                    <div class="prepend-text bg-primary">
                        <span>Búsqueda</span>
                    </div>
                    </template>
                    <vs-input v-model="busqueda" @keyup.enter="LibrosBusqueda()"/>
                </vx-input-group>
                <!-- /currency -->
            </div>
            <div class="vx-col xl:1/2 lg:w-1/2 md:w-1/2 sm:w-full">
              <div class="flex" style="flex-wrap: wrap;">
                 <div class="ml-3">
                  <vs-button @click="LibrosBusqueda();">Buscar</vs-button>
                 </div>
              </div>
            </div>
        </div>
        <!--LISTADO-->
        <ListadoLibrosVue :arreglosLibros ="arreglosLibros" @recharge="recharge" @nuevoLibro="nuevoLibro"/>
    </div>
</template>
<script>
import ListadoLibrosVue from './libros.vue'
export default{
    data(){
        return{
            tipo:'0',
            busqueda:'',
            arreglosLibros:[],
        }
    },
    components:{
        ListadoLibrosVue,
    },
    methods:{
        recharge(e){
            let me = this;
            me.LibrosBusqueda()
        },
        nuevoLibro(e){
            let me      = this;
            me.busqueda = e
            me.LibrosBusqueda()
        },
        //para obtener el listado de las areas
        LibrosBusqueda() {
            let me = this;
            me.arreglosLibros = []
            if(me.busqueda == ""){
                me.$vs.notify({
                text:'El campo de búsqueda no pueda estar vacio',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.busqueda.length < 3){
                me.$vs.notify({
                text:'El campo de búsqueda tiene que ser mayor a 3 carácteres',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.loading();
            this.$http.get(this.$server_url + 'LibroBusqueda_new?tipo='+me.tipo+'&busqueda='+me.busqueda)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.length == 0){
                        me.$vs.notify({
                        text:'No se encontro resultados',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    }
                    me.arreglosLibros = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
    }
}
</script>
<style>
.busqueda{
    width:100%!important;
}
</style>
