<template>
<div>
    

  <!--Tabla para listar los contratos del asesor-->
  <div>
    <vs-table max-items="5" search pagination :data="contratosarreglo">
      <template slot="header">
        <h3>
          Listado de sus contratos
        </h3>
      </template>
      <template slot="thead">
        <vs-th>
          contrato
        </vs-th>
        <vs-th>
          Año
        </vs-th>
        <vs-th>
          Ciudad
        </vs-th>
        <vs-th>
          Temporada
        </vs-th>
        <vs-th>
          Profesor
        </vs-th>

        <vs-th>
          Asesor
        </vs-th>

        <vs-th>
          Institucion
        </vs-th>

        
        <vs-th>
          Accion
        </vs-th>

      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
        
          <vs-td :data="data[indextr].contrato">
            {{data[indextr].contrato}}
          </vs-td>

          <vs-td :data="data[indextr].year">
            {{data[indextr].year}}
          </vs-td>

          <vs-td :data="data[indextr].ciudad">
            {{data[indextr].ciudad}}
          </vs-td>

          <vs-td :data="data[indextr].temporada">
            {{data[indextr].temporada}}
          </vs-td>

         <vs-td :data="data[indextr].temporal_nombre_docente">
            {{data[indextr].temporal_nombre_docente}}
          </vs-td>

          <vs-td :data="data[indextr].nombre_asesor">
            {{data[indextr].nombre_asesor}}
          </vs-td>

          <vs-td :data="data[indextr].temporal_institucion">
            {{data[indextr].temporal_institucion}}
          </vs-td>

          <vs-td>
              <vx-tooltip style="display: inline-block;" text="Editar Institucion" position="top" color="primary">
                <vs-button class="modal-default-button" color="success" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
              </vx-tooltip> &nbsp;

          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>  
    <!-- Modal Editar-->
      <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Institucion" :active.sync="popupEditInstitucion">
        
                Institucion:
              
                <v-select :options="instituciones" :reduce="instituciones => instituciones" label="label" class="w-full" v-model="asesor.institucion" />
                 <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarInstitucion()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
       </div>
</div>
    
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'

export default ({
    data() {
        return{
            asesorarreglo:[],
            cedula:'',
            contratosarreglo:[],
            //para la edicion
            popupEditInstitucion:false,
            
            asesor:{
              institucion:'',
              cedula_asesor:'',
              contrato:'',
            
            },
            instituciones:[],

        }
        
    },
    components: {
        'v-select': vSelect,
            
    },
    methods:{
        obtenerContratos(){
        let me = this;
        let formData = new FormData();

        formData.append('cedula',this.cedula);
    
       
        
             
            me.$vs.loading()
            this.$http.post(this.$server_url+'temporadas/asesor/contratos', formData)
            .then(res => {

             console.log(res)

         
            this.contratosarreglo = res.data;
          
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Listando contratos',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
        })  
        },
        //para realizar la edicion
         //para guardar las areas

         guardarInstitucion(){
        
            let me = this;

            if( me.asesor.institucion.id === undefined ){
                  me.$vs.notify({
                      text:'Seleccione una Institucion',
                      color:'warning',
                      iconPack: 'feather',
                      icon:'icon-check'})
                  return;
              }

            let formData = new FormData();
         
                formData.append('idInstitucion', me.asesor.institucion.id);
                formData.append('cedula_asesor', me.asesor.cedula_asesor);
                formData.append('nombre_institucion', me.asesor.institucion.label);
                formData.append('nombre_ciudad', me.asesor.institucion.nombre_ciudad);
                formData.append('contrato', me.asesor.contrato);
            this.$http.post(this.$server_url+'asesor-institucion', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.obtenerContratos()
                    
                    me.popupEditInstitucion=false,
                 
                    limpiar();
                  
                })
                .catch(function (error) {})

           

        },
        limpiar(){
          let me = this;
          me.asesor.institucion = "";

        },
        //para abrir el popup de edicion
       
        openModalEditar(data={}){
            let me = this;
           
            me.popupEditInstitucion = true;
            
            //llenar la data en los campos
            me.asesor.contrato = data.contrato;
            me.asesor.cedula_asesor = data.cedula_asesor;
            //  me.area.nombrearea = data.nombrearea;
             me.asesor.institucion = {id:data.idInstitucion, label:data.temporal_institucion};
 
        },
    },

    created() {
       let transformaraParse = JSON.parse(localStorage.getItem('usuario')); 
       this.asesorarreglo = transformaraParse;
       this.cedula = this.asesorarreglo.cedula;
      //traer las instituciones
      this.$http.get(this.$server_url+'institucionesResportes').then(res => {
            this.instituciones = res.data;
        })
    },

    mounted() {
      
    
 
   this.obtenerContratos();

   	
}
})
</script>
