<template>
    <div>
        <vs-card>
            <div class="header">
                <p>Instituciones Activas</p>
            </div>  
            <br/><br/>
            <vs-table max-items="10" search stripe pagination :data="instituciones" style="margin-top:-40px">
                <template slot="thead">
                    
                    <vs-th>Institución</vs-th>
                    <vs-th>Período</vs-th>
                    <vs-th>Región</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        
                        <vs-td>
                            {{data[indextr].nombreInstitucion}}<br>    
                        </vs-td>
                        <vs-td>
                            {{data[indextr].periodoescolar}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].region}}<br>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip style="display: inline-block;" text="Ver Información" position="top" color="primary">
                                <vs-button class="modal-default-button" style="border-radius: 20px;" @click="getInformacionInstitucion(tr)" type="line" color="primary"   icon-pack="feather" icon="icon-eye"> 

                                </vs-button>
                            </vx-tooltip> &nbsp;

                        </vs-td>
                    
                        
                    </vs-tr>
                </template>
            </vs-table>      
        </vs-card>

        <!--Modales-->
        
        <vs-popup
     
        :title="title" :active.sync="popupInformacionInstitucion">
        <vs-list>
            <vs-list-header icon="supervisor_account" title="Información">
            </vs-list-header>

            <vs-list-item icon="check" title="Estudiantes" :subtitle="informacionInstitucion.estudiantes">
            </vs-list-item>
             <vs-list-item icon="check" title="Docentes" :subtitle="informacionInstitucion.docentes">
            </vs-list-item>
             <vs-list-item icon="check" title="Libros" :subtitle="informacionInstitucion.libros">
            </vs-list-item>
        </vs-list> 
           
           
        </vs-popup>

    </div>
</template>

<script>
export default {
    data() {
       return{
           instituciones:[],
           title:'',
           informacionInstitucion:[],
           popupInformacionInstitucion:false,
       } 
    },
    created(){
        let me = this;
        me.getInstitucionesActivas();
    },
    methods:{
        //para obtener el listado de las instituciones activas
        getInstitucionesActivas() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'reporteria?rinstitucion=yes')
                .then(function (res) {
                    me.instituciones = res.data
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

                   //para obtener el listado de las instituciones de los vendedores
        getInformacionInstitucion(tr) {
            let me = this;
            me.popupInformacionInstitucion = true;
            me.title = "Institución "+tr.nombreInstitucion
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'reporteria?InformacionInstitucion=yes&idInstitucion='+tr.idInstitucion+'&id_periodo='+tr.id_periodo)
                .then(function (res) {
                    me.informacionInstitucion = res.data.datos
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