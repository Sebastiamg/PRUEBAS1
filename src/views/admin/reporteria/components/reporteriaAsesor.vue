<template>
    <div>
        <vs-card>   
            <br/><br/>
            <vs-table max-items="10" search stripe pagination :data="vendedores" style="margin-top:-40px">
                <template slot="thead">
                    
                    <vs-th>Vendedor</vs-th>
                    <vs-th>Cédula</vs-th>
                    <vs-th>Instituciones</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        
                        <vs-td>
                      
                            {{data[indextr].vendedor}}<br>
                            
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cedula}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].escuelas}}<br>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip style="display: inline-block;" text="Ver Instituciones" position="top" color="primary">
                                <vs-button class="modal-default-button" style="border-radius: 20px;"  type="line" color="primary" @click="getInstitucionesVendedores(tr)"  icon-pack="feather" icon="icon-eye"> 

                                </vs-button>
                            </vx-tooltip> &nbsp;

                        </vs-td>
                    
                        
                    </vs-tr>
                </template>
            </vs-table>      
        </vs-card>

        <!--Modales-->
        
        <vs-popup
     
        :title="title" :active.sync="popupInstituciones">
        <br/><br/>
            <vs-table max-items="10" search stripe pagination :data="asesorInstituciones" style="margin-top:-40px">
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>Institución</vs-th>
                    <vs-th>Región</vs-th>
                   
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        
                        <vs-td>
                            {{indextr+1}}<br>
                        </vs-td>

                        <vs-td>
                           
                            {{data[indextr].nombreInstitucion}}<br>
                            
                        </vs-td>
                        <vs-td>
                            {{data[indextr].region}}<br>
                        </vs-td>
                     
                    
                        
                    </vs-tr>
                </template>
            </vs-table>        
        </vs-popup>
    </div>
</template>

<script>
export default {
    data() {
       return{
           title:'',
           vendedores:[],
           popupInstituciones:false,
           asesorInstituciones:[],
       } 
    },
    created(){
        let me = this;
        me.getVendedores()
    },
    methods:{
          //para obtener el listado de las vendedores
        getVendedores() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'reporteria?asesor=yes')
                .then(function (res) {
                    me.vendedores = res.data.vendedores
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

           //para obtener el listado de las instituciones de los vendedores
        getInstitucionesVendedores(tr) {
            let me = this;
            me.title = "Instituciones de "+tr.vendedor
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'reporteria?asesorInstituciones=yes&idusuario='+tr.usuario)
                .then(function (res) {
                    me.asesorInstituciones = res.data
                    me.popupInstituciones = true;
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