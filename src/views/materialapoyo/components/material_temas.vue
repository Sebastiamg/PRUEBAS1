<template>
    <div>

      <!--- MODAL PARA Editar -->
    <div class="centerx">
      
      <vs-popup classContent="popup-example"  title="Editar Tema" :active.sync="popupActivo2">
     
      <div class="grupo">
          <div class="vx-col w-full mt-5">
           
              Seleccione  unidad: 
              <v-select  @input="filtrarTemas()"  :options="arregloTraeUnidades" :reduce="arregloTraeUnidades => arregloTraeUnidades" label="unidad" class="w-full" v-model="material.unidad" />
          </div>
      </div>
      <div class="grupo">
          <div class="vx-col w-full mt-5">
              Seleccione  Temas:
              <v-select  :options="arregloTraerTemas" :reduce="arregloTraerTemas => arregloTraerTemas" label="nombre_tema" class="w-full" v-model="material.tema" />
          </div>
      </div> 
      
        <br>

     
        <br>
        <vs-button @click="editar();" color="primary" type="filled">Guardar Cambios</vs-button>
      </vs-popup>
    </div>

      <vs-table max-items="3" search pagination :data="infotemas">
      
        <template slot="header">

          <h3>
           Temas
          </h3>
        </template>

        <template slot="thead">
       
          <vs-th>
            Libro
          </vs-th>
            <vs-th>
            Unidad
          </vs-th>
         
          <vs-th>
            Tema
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
            
            <vs-td :data="data[indextr].nombre_tema">
              {{data[indextr].nombre_tema}}
            </vs-td>
            <vs-td>
                <vs-button color="primary" type="border" @click="openModal(data[indextr]);" icon="edit">
                </vs-button>
            </vs-td>
            
            <vs-td>
        
              <vs-button color="danger" type="border" icon="delete" @click = "eliminarTema(data[indextr].id);">
              
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
            update:true,
            infotemas:[],
            infoarchivosid:0,
             //para obtener el id del libro
            infolibro:0,
            //para traer las unidades
            arregloTraeUnidades:[],
            arregloTraerTemas:[],
            //para el modal
            popupActivo2:false,
            id:0,
            material:{
              unidad:'',
              tema:''
            }
        }
    },
    components: {
    'v-select': vSelect,
            
    },
    methods:{

         list(){
                let me = this;
                me.$vs.loading() 
                this.$http.get(this.$server_url+`materialtemas/`+this.infoarchivosid).then(res => {
                 this.infotemas = res.data;

                 me.$vs.loading.close();       
                  
                })
                .catch(function (error) {
                	console.log(error)
                })
  
       
        },
        //para abrir el modal y editar        
        openModal(data={}){
            this.filtrarUnidades();
            this.filtrarTemas1();
            this.popupActivo2 = true;
           
            this.id  = data.id;
            this.material.tema = {id:data.id_tema, nombre_tema:data.nombre_tema};
  
         
        
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

         //para filtrar los temas por unidad y que se muestre en el select
          filtrarTemas1(){
              let me = this;
              const formData = new FormData();
              if(me.update ==false){
                if( me.material.unidad.id_unidad_libro === undefined ){
                    me.$vs.notify({
                        text:'Seleccione una libro antes de filtrar por temas',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }

                me.arregloTraerTemas = []
                
                me.$vs.loading()
                // const formData = new FormData();
                formData.append('id_unidad_libro', me.material.unidad.id_unidad_libro);
              }
                
                   

                this.$http.post(this.$server_url+'traertemas', formData).then(res => {
                    me.arregloTraerTemas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          },
        //para filtrar los temas por las unidades
            filtrarTemas(){
            let me = this;
              
                if( me.material.unidad.id_unidad_libro === undefined ){
                    me.$vs.notify({
                        text:'Seleccione una libro antes de filtrar por unidades',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
                me.arregloTraerTemas = []
                
                me.$vs.loading()
                const formData = new FormData();
                formData.append('id_unidad_libro', me.material.unidad.id_unidad_libro);
                   

                this.$http.post(this.$server_url+'traertemas', formData).then(res => {
                    me.arregloTraerTemas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          },
          editar(){
          let me = this;
          let formData = new FormData();
          formData.append('id', me.id);
          formData.append('id_tema', me.material.tema.id);
            
          me.$vs.loading()
          this.$http.post(this.$server_url+'materialtemaseditar', formData)
          .then(res => {
              
              me.list();
              me.popupActivo2 = false
              me.$vs.loading.close()
              me.$vs.notify({
              text:'Tema actualizado exitosamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
          })
      },
          //para eliminar el tema
        eliminarTema(id){
            let me = this;
            let formData = new FormData();
            formData.append('id', id);
            
            me.$vs.loading()
            this.$http.post(this.$server_url+'materialtemaseliminar', formData)
                .then(res => {
                    // me.$router.go(0)
                   
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Tema  eliminado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                     me.list();
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

    }
}
</script>