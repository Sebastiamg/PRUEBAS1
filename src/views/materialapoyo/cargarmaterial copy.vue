<template>
  <div>

     	<!--- MODAL PARA AGREGAR -->
    <div class="centerx">
      <vs-button @click="popupActivo2=true;update = false; openModal();" color="primary" type="filled">Agregar</vs-button>
      <br>
      <br>
      <br>
      <vs-popup classContent="popup-example"  :title="titleModal" :active.sync="popupActivo2">


     {{dataarchivos}}
      <div class="vx-col w-full mt-5">

          Libro:
          <v-select @input="filtrarUnidades()"  :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full" v-model="libro.libro" />
      </div>
      
        <br>

       <div class="vx-col w-full mt-5">

          Unidad:
          <v-select @input="filtrarTemas()" :options="arregloTraeUnidades" :reduce="arregloTraeUnidades => arregloTraeUnidades" label="unidad" class="w-full" v-model="libro.unidad" />
      </div>

       
       <div class="vx-col w-full mt-5">
          Temas:
          <v-select :options="arregloTraerTemas" :reduce="arregloTraerTemas => arregloTraerTemas" label="nombre_tema" class="w-full" v-model="libro.tema" />
      </div>

         <div class="vx-col w-full mt-5">
          <label>Nombre archivo 1</label>
          
          <vs-input class="inputx w-full" placeholder="nombre" v-model="archivo1"/>
        </div>

         <div class="vx-col w-full mt-5">
          <label>archivo</label>
          <vs-input class="inputx w-full"  id="upload-file" type="file"  @change="fieldChange"/>
        </div>

       

        <div class="vx-col w-full mt-5">
          <label>Nombre archivo 2</label>
          <vs-input class="inputx w-full" placeholder="nombre" v-model="archivo2"/>
        </div>

        

         <!-- <div class="vx-col w-full mt-5">
          <label>archivo</label>
          <vs-input class="inputx w-full"  id="upload-file" type="file"  @change="fieldChange2"/>
        </div>
         -->

  
        <br>
        <vs-button @click="uploadFile();" color="primary" type="filled">Guardar Cambios</vs-button>
    
      </vs-popup>
    </div>
    <!--FIn del Modal para agregar libro serie-->
    
    <!--Tabla del listado de libros series-->
    <div>
      <vs-table max-items="8" search pagination :data="arreglomaterial">
        <template slot="header">
          <h3>
            Mantenimiento de Cargar material
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
          <vs-th>
            Nombre archivo
          </vs-th>
          <vs-th>
            archivo
          </vs-th>
         
          <vs-th>
            Estado
          </vs-th>
          <vs-th>
            Accion
          </vs-th>
        </template>




        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
         
            <vs-td :data="data[indextr].nombrelibro">
              {{data[indextr].nombrelibro}}
            </vs-td>

            <vs-td :data="data[indextr].unidad">
              {{data[indextr].unidad}} : {{data[indextr].nombre_unidad}}
            </vs-td>

            <vs-td :data="data[indextr].nombre_tema">
              {{data[indextr].nombre_tema}}
            </vs-td>

            <vs-td :data="data[indextr].nombre_archivo">
              {{data[indextr].nombre_archivo}}
            </vs-td>
            <vs-td :data="data[indextr].archivo">
              {{data[indextr].archivo}}
            </vs-td>
           

          
            <vs-td >
              <template v-if="data[indextr].estado =='1'">
                <p>Activado</p>
              </template>
              <template v-else>
                <p>Desactivado</p>
              </template>
            </vs-td>
          
            <!-- <vs-td> -->
              <!-- {{ data[indextr] }} -->
              <!-- <vs-button color="warning" size="small" type="filled" @click = "update = true; openModal(data[indextr]);">
              Editar"
              </vs-button>
            </vs-td> -->

            <vs-td>
                <template v-if="data[indextr].estado == '1'">
                  <vs-button color="danger" size="small" type="filled" @click = "desactivar(data[indextr].id)">
                  Desact.
                  </vs-button>
            
                </template>

                <template v-else>
                  <vs-button color="success" size="small" type="filled" @click = "activar(data[indextr].id)">
                  Activar
                  </vs-button>
                  
                </template>
            </vs-td>

          </vs-tr>
        </template>
      </vs-table>
    </div>  
  </div>
</template>
<script>

import axios from 'axios'
import vSelect from 'vue-select'

export default {
  data:()=>({
      update:true,
      id:0,
      titleModal: '',
      // para el select de libros
      arregloLibros:[],
      //para el select de unidades
      arregloTraeUnidades:[],
       //para el select de temas
      arregloTraerTemas:[],
      //para subir archivos,
      attachments:[],
      dataarchivos:[],
      form: new FormData,
      //para los nombres de los  archivos
      archivo1:'',
      archivo2:'',
   /*Modal*/
     
    
      popupActivo2:false,
     
      //listado
    libros:[
    
    ],
     libro:{
        libro:'',
        unidad:'',
        tema:'',
        nombre_archivo:'',
        nombre_archivo2:'',
        nombre:'',
        archivo:'',
        

       
    },
  }),

    components: {
        'v-select': vSelect,
                
        },

  methods:{

    //lista de libros para usar en el select
      listalibros(){
        let me = this
       this.$http.get(this.$server_url+`libroserie`).then(res => {
                 me.arregloLibros = res.data.libroslista;
                console.log(me.arregloLibros);
                                
                })
                .catch(function (error) {
                  console.log(error)
                })

    
    },
    

    //listar
  	  list(){
      let me = this;
      me.$vs.loading() 
  		 this.$http.get(this.$server_url+`cargarmaterial`).then(res => {
                 this.arreglomaterial = res.data.material;
                 me.$vs.loading.close();       
                  
                })
                .catch(function (error) {
                	console.log(error)
                })
  

  	
  	},
    //desactivar el estado de la tabla

    desactivar(id){


              let me = this;
              let formData = new FormData();
                  formData.append('id',id );
                 
              me.$vs.loading()
              this.$http.post(this.$server_url+'cargarmaterial/desactivar', formData)
              .then(res => {
                  
                 me.list();
                  
                  me.$vs.loading.close()
                  me.$vs.notify({
                  text:'Estado material  actualizado',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })

    },

    activar(id){
    

            let me = this;
            let formData = new FormData();
            formData.append('id_libro_serie', id);
               
            me.$vs.loading()
            this.$http.post(this.$server_url+'cargarmaterial/activar', formData)
            .then(res => {
                
               me.list();
                me.popupAddTema = false
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Estado material actualizado  exitosamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })

    },
      //para guardar los nombres de archivo
     
       //para guardar los nombres de archivo
     
            agregar(){

           
                let me = this;
                let formData = new FormData();

                  if(me.update){
                     formData.append('id', me.id);
                  }
                    formData.append('idLibro', me.libro.nombrelibro.idlibro);
                    formData.append('id_serie', me.libro.nombre_serie.id_serie);
                    formData.append('iniciales', me.libro.iniciales);
                    formData.append('codigo_liquidacion', me.libro.codigo_liquidacion);
                    formData.append('nombre', me.libro.nombre);
                     formData.append('year', me.libro.year);
                    formData.append('version2', me.libro.version2);
                me.$vs.loading()
                this.$http.post(this.$server_url+'libroserie', formData)
                .then(res => {
                    
                   me.list();
                    me.popupAddTema = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Libro serie guardado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
            },


          openModal(data={}){
              this.listalibros();
              
             this.popupActivo2 = true;
              if(this.update){
                this.id  = data.id_libro_serie;
                this.titleModal = "Modificar Contacto";

                this.libro.nombrelibro = {idlibro:data.idlibro, nombrelibro:data.nombrelibro};
                this.libro.nombre_serie = {id_serie:data.id_serie, pnombres:data.pnombres};
                this.libro.iniciales = data.iniciales;
                this.libro.codigo_liquidacion = data.codigo_liquidacion;
                this.libro.nombre = data.nombre;
                this.libro.year = data.year;
                this.libro.version2 = data.version;




              }else{
                this.id = 0;
                 this.titleModal = "Crear Libro";

                 this.libro.nombrelibro = '';
                 this.libro.nombre_serie= '';
                 this.libro.iniciales= '';
                 this.libro.codigo_liquidacion = '';
                 this.libro.nombre = '';
                 this.libro.version2 = '';
              }
          },
        //para subir archivos
           fieldChange(e){
              //  let archivo = this.archivo1;
              // this.dataarchivos.push(archivo);

                let selectedFiles=e.target.files;
                if(!selectedFiles.length){
                    return false;
                }
                for(let i=0;i<selectedFiles.length;i++){
                    this.attachments.push(selectedFiles[i]);
                }
                console.log(this.attachments);
            },
            fieldChange2(e){
              let archivo2 = this.archivo2;
          this.dataarchivos.push(archivo2);

                let selectedFiles=e.target.files;
                if(!selectedFiles.length){
                    return false;
                }
                for(let i=0;i<selectedFiles.length;i++){
                    this.attachments.push(selectedFiles[i]);
                }
                console.log(this.attachments);
            },
            //para guardar
            uploadFile(){
              let me  = this;
                for(let i=0; i<this.attachments.length;i++){
                    this.form.append('archivo[]',this.attachments[i]);
                    this.form.append('id_libro',me.libro.libro.idlibro);
                    this.form.append('id_unidad',me.libro.unidad.id_unidad_libro);
                    this.form.append('id_tema',me.libro.tema.id);
                    this.form.append('nombre_archivo[]',me.dataarchivos[i]);


                }
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                document.getElementById('upload-file').value=[];
                 me.$vs.loading()
                axios.post(this.$data_url+'api/cargarmaterial',this.form,config).then(response=>{
                    //success
                    me.list();
                    me.$vs.loading.close()
                    me.$vs.notify({
                      text: 'Material  agregado',
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check'
                    })
                    console.log(response);
                })
                    .catch(response=>{
                        //error
                    });

            },

          filtrarUnidades(){
               let me = this;
              
                if( me.libro.libro.idlibro === undefined ){
                    me.$vs.notify({
                        text:'Seleccione una libro antes de filtrar por unidades',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }

           
              
                me.arregloTraeUnidades = []
                
                me.$vs.loading()
                const formData = new FormData();
                    formData.append('idlibro', me.libro.libro.idlibro);
                   

                this.$http.post(this.$server_url+'traerunidades', formData).then(res => {
                    me.arregloTraeUnidades = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          },
          //para filtrar los temas por unidad y que se muestre en el select
          filtrarTemas(){
            let me = this;
              
                if( me.libro.unidad.id_unidad_libro === undefined ){
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
                formData.append('id_unidad_libro', me.libro.unidad.id_unidad_libro);
                   

                this.$http.post(this.$server_url+'traertemas', formData).then(res => {
                    me.arregloTraerTemas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          }

    
  },

  created(){
  	this.list();
    this.listalibros();
 
  
  }
}
</script>



