<template>
    <div>
        <vs-card>
            <div v-if="bloqueados.length >0 ">
                <br/>   <br/>
                <vs-table max-items="10" search pagination :data="bloqueados" style="margin-top:-40px">
                    <template slot="thead">
                        <vs-th>Usuario</vs-th>
                        <vs-th>Codigo</vs-th>
                        <vs-th>Observacion</vs-th>
                        <vs-th>Periodo</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{data[indextr].nombres}} <br>
                                <p>{{ data[indextr].nombreInstitucion}}</p>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].codigo_libro}}<br> 
                            </vs-td>
                            <vs-td>
                                {{data[indextr].observacion}}<br>  
                            </vs-td>
                            <vs-td>
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe codigos bloqueados aun. </p>
            </div>
        </vs-card>
    </div>
</template>

<script>
export default {
    data() {
       return{
           bloqueados:[],
       } 
    },
    created(){
        let me = this;
        me.getCodigosBloqueados();
    },
    methods:{
        //para obtener el listado de los codigos bloqueados
        getCodigosBloqueados() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'codigosBloqueados')
                .then(function (res) {
                    me.bloqueados = res.data
               
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