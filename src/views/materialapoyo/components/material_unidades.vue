<template>
    <div>
      
    <!--- MODAL PARA Editar -->
    <div class="centerx">
      
      <vs-popup classContent="popup-example"  title="Editar Unidad" :active.sync="popupActivo2">
     
      <div class="grupo">
          <div class="vx-col w-full mt-5">
           
              Seleccione  unidad: 
              <v-select  :options="arregloTraeUnidades" :reduce="arregloTraeUnidades => arregloTraeUnidades" label="unidad" class="w-full" v-model="material.unidad" />
          </div>
      </div>
      
        <br>

      {{id}}
        <br>
        <vs-button @click="editar();" color="primary" type="filled">Guardar Cambios</vs-button>
    
      </vs-popup>
    </div>
    <!--FIn del Modal para editar unidades-->
        <vs-table max-items="3" search pagination :data="infounidades">
          <template slot="header">
            <h3>
            Unidades
            </h3>
          </template>

          <template slot="thead">
            <vs-th>
              Libro
            </vs-th>
          
            <vs-th>
              unidad
            </vs-th>
        
                
            <vs-th colspan="2">
              Accion
            </vs-th>
          </template>




          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
              <vs-td :data="data[indextr].nombrelibro">
                {{data[indextr].nombrelibro}}
              </vs-td>
              <vs-td :data="data[indextr].unidad">
                {{data[indextr].unidad}}
              </vs-td>
              <vs-td>
                
                <vs-button color="primary" type="border" @click="openModal(data[indextr]);" icon="edit">
                </vs-button>
              </vs-td>
              <vs-td>
          
                <vs-button color="danger" type="border" icon="delete" @click = "eliminarUnidad(data[indextr].id ,data[indextr].id_material,data[indextr].id_unidad)">
                  <!-- id_material -->
                </vs-button>
              </vs-td>

          

            </vs-tr>
          </template>
        </vs-table>
    </div>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    data(){
        return{
            infounidades:[],
            infoarchivosid:0,
            //para obtener el id del libro
            infolibro:0,
            //para traer las unidades
            arregloTraeUnidades:[],
            //para el modal
            popupActivo2:false,
            id:0,
            material:{
              unidad:''
            }
        }
    },
    
    components: {
        'v-select': vSelect,
                
        },
    methods:{
        //para el listado de materiales unidades
         list(){
                let me = this;
                me.$vs.loading() 
                this.$http.get(this.$server_url+`materialunidades/`+this.infoarchivosid).then(res => {
                 this.infounidades = res.data;

                 me.$vs.loading.close();       
                  
                })
                .catch(function (error) {
                	console.log(error)
                })
  
       
        },

      //para abrir el modal y editar        
        openModal(data={}){
            this.filtrarUnidades();
            this.popupActivo2 = true;
           
            this.id  = data.id;
            this.material.unidad = {id_unidad_libro:data.id_unidad, unidad:data.unidad};
            // this.libro.nombre_serie = {id_serie:data.id_serie, pnombres:data.pnombres};
         
        
        },
      editar(){
          let me = this;
          let formData = new FormData();
          formData.append('id', me.id);
          formData.append('id_unidad', me.material.unidad.id_unidad_libro);
            
          me.$vs.loading()
          this.$http.post(this.$server_url+'materialunidadeseditar', formData)
          .then(res => {
              
              me.list();
              me.popupActivo2 = false
              me.$vs.loading.close()
              me.$vs.notify({
              text:'Unidad actualizada exitosamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
          })
      },
      //filtro para filtrar unidad por libro
        filtrarUnidades(){
               let me = this;
               
                
                me.$vs.loading()
                const formData = new FormData();
                    formData.append('idlibro', me.infolibro);
                   

                this.$http.post(this.$server_url+'traerunidades', formData).then(res => {
                    me.arregloTraeUnidades = res.data;
              
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          },

        //para eliminar la unidad
        eliminarUnidad(id,id_material,id_unidad){
            let me = this;
            let formData = new FormData();
            formData.append('id', id);
            formData.append('id_material', id_material);
            formData.append('id_unidad', id_unidad);

            
            me.$vs.loading()
            this.$http.post(this.$server_url+'materialunidadeseliminar', formData)
                .then(res => {
                    // me.$router.go(0)
                 
                    if(res.data.status =="0"){
                      me.$vs.notify({
                      text: 'No se puede eliminar unidades que tienen temas elimine los temas de esta unidad',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                    

                  }

                   if(res.data.status =="1"){
                      me.$vs.notify({
                      text: 'Se elimino correctamente',
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check'
                    })
                   
                    me.$vs.loading.close()
                    me.list();
                    // window.location.reload();

                  }
                })
        }
    },
     created() {
 
   
   
    let transformaraParse = JSON.parse(localStorage.getItem('infoarchivosid')); 
    //llenar el arreglo  de archivos 
    this.infoarchivosid = transformaraParse;
    //para obtener el id del libro
    let transformaraParse2 = JSON.parse(localStorage.getItem('infoarchivolibro')); 
    this.infolibro = transformaraParse2;
    this.list();
    //listado de unidades para el select
   

    },
    
}
</script>