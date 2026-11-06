<template>
    <!--Tabla para listar los contratos del asesor-->
<div>
    <vs-table max-items="10" search pagination :data="arregloAuditoria">
      <template slot="header">
        <h3>
          Listado de auditoria del modelo Institucion
        </h3>
      </template>
      <template slot="thead">
        <vs-th>
          User Modificador
        </vs-th>
        <vs-th>
          Perfil
        </vs-th>
        <vs-th>
          Accion
        </vs-th>
        <vs-th>
          Modelo
        </vs-th>
         <vs-th>
          id del registro modificado
        </vs-th>
        <vs-th>
          Val. anteriores
        </vs-th>

        <vs-th>
          Val. Nuevos
        </vs-th>

        <vs-th>
          Fecha de creacion
        </vs-th>

         <vs-th>
          Fecha de modificacion
        </vs-th>
        <!-- <vs-th>
            Eliminar
        </vs-th> -->

      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
          <template v-if="data[indextr].nombres">
              <vs-td :data="data[indextr].nombres">
                  {{data[indextr].nombres}}
              </vs-td>
          </template> 

         <template v-else>
              <vs-td>
               Sin usuario
            </vs-td>
         </template>      
          
         <template v-if="data[indextr].level">   
            <vs-td :data="data[indextr].level">
                {{data[indextr].level}}
            </vs-td>
         </template>

        <template v-else>
              <vs-td>
               Sin usuario
            </vs-td>
         </template> 

          <vs-td :data="data[indextr].event">
            {{data[indextr].event}}
          </vs-td>

          <vs-td :data="data[indextr].auditable_type">
            {{data[indextr].auditable_type}}
          </vs-td>

           <vs-td :data="data[indextr].auditable_id">
            {{data[indextr].auditable_id}}
          </vs-td>
          

         <vs-td :data="data[indextr].old_values">
            {{data[indextr].old_values}}
          </vs-td>

          <vs-td :data="data[indextr].new_values">
            {{data[indextr].new_values}}
          </vs-td>

          <vs-td :data="data[indextr].created_at">
            {{data[indextr].created_at}}
          </vs-td>
          <vs-td :data="data[indextr].updated_at">
              {{data[indextr].updated_at}}
          </vs-td>   

          <!-- <vs-td>
                <vs-button color="danger" size="small" type="filled" @click = "eliminarAuditoria(data[indextr].id)">
                    Eliminar
                </vs-button>
          </vs-td> -->

        </vs-tr>
      </template>
    </vs-table>
</div> 
</template>



<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'

export default ({
    data() {
        return{
           arregloAuditoria:[]
        }
        
    },
    methods:{

          //listar Auditorias
  	    listAuditorias()
        {
            let me = this;
            me.$vs.loading() 
            this.$http.get(this.$server_url+'audits')
            // axios.get(this.$server_url+'audits')
            .then(res => {
                this.arregloAuditoria = res.data.auditInstitucion;  
                me.$vs.loading.close()
                  
            })
            .catch(function (error) {
                	console.log(error)
            })
  

  	
  	     },
        //eliminar auditoria
        eliminarAuditoria(id){
            let me = this;
            let formData = new FormData();
            formData.append('id', id);
            
           
            me.$vs.loading()
            this.$http.post(this.$server_url+'audits/eliminar', formData)
            // axios.post(this.$server_url+'audits/eliminar', formData)
            .then(res => {
            
            me.listAuditorias();
            
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Auditoria  eliminada',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            })
        },
    

    },
    created() {
        //que aparezca el listado de auditorias al cargar
        this.listAuditorias();
    }
})
</script>

