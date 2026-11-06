<template>
    <div>
        <vs-row vs-justify="center">
            <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-card>
                <div slot="header">
                    <h3>
                    Subir Material<span style="font-size:10px;color:#f2f2f2;">Al selecionar el  numero de material debe llenarlo</span>

                    </h3>
                    <br>
                    <div class="">
                       
                        <div>
                            <div class="principal">

                                    <div class="grupo" v-if="docente =='yes'">
                                      
                                    </div>
                                     <div class="grupo" v-else>
                                        <div class="vx-col w-full mt-5">
                                          
                                            Libro:
                                            <v-select @input="filtrarUnidades()"  :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full" v-model="libro.libro" />
                                        </div>
                                    </div>

                                  
                                     
                            </div>  
                            <!-- {{inputs2}} -->
                            <!--Unidades y temas-->
                            <div class="principal2" v-for="(input,k) in inputs2" :key="k">

                            
                                <div class="grupo">
                                    <div class="vx-col w-full mt-5">

                                        (Unidad)Filtrar Temas:
                                        <v-select @input="filtrarTemas(k)" :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2" label="unidad" class="w-full" v-model="input.unidad" />
                                    </div>
                                </div>
                                
                                <div class="grupo">
                                    <div class="vx-col w-full mt-5">
                                    
                                    Seleccione  Temas:
                                        <v-select multiple :options="arregloTraerTemas" id="temas" :reduce="arregloTraerTemas => arregloTraerTemas" label="nombre_tema" class="w-full" v-model="input.temas" />
                                    </div>

                                </div>
                                <div class="grupo">
                                    <vs-button color="danger"  style="margin:10px;" size="small" type="filled" @click="remove2(k)" v-show="k || ( !k && inputs2.length > 1)">-</vs-button>
                                    <vs-button color="primary"   size="small" type="filled" @click="add2(k)" v-show="k == inputs2.length-1">+</vs-button>
                                
                                </div>  
                                <br>                   
                        
                            </div>
                                    
                                <vs-divider color="warning">Archivos</vs-divider>

                                
                                <br>
                                    <vs-button  @click="borrartodo()" style="margin-left: 10px;" size="small" color="danger" type="filled">
                                        x todo
                                </vs-button>
                                <br>
                                <br>
                                <ul>
                                    <li>Los archivos que se subiran</li>
                                    <li v-for="(item,k) in attachments" :key="k">{{item.name}}</li>
                                </ul>  

                          <!---INPUTS DE ARCHIVOS-->        
                            <div class="principal" v-for="(input,k) in inputs" :key="k">
                                
                                <div class="grupo">
                                    <div class="vx-col w-full mt-5">

                                        Nombre archivo:
                                        <vs-input label-placeholder="Nombre archivo" v-model="input.name" />
                                     </div>
                                </div>

                                <div class="grupo">
                                        <div class="vx-col w-full mt-5">

                                            Archivo:
                                        
                                            <input type="file" class="upload-file" style="margin-top:20px;"  @change="fieldChange" />
                                        </div>
                                
                                </div>
                                <div class="grupo">
                                    <vs-button color="danger"  style="margin:10px;" size="small" type="filled" v-if="k>0" @click="remove(k)"  v-show="k == inputs.length-1">-</vs-button>
                                    <vs-button color="primary"   size="small" type="filled" @click="add(k)" v-show="k == inputs.length-1">+</vs-button>
                                
                                    
                                
                                </div>  
                                <br>                   
                            </div>    

                            <br>
                            <br>
                                <vs-button @click="uploadFile();" id="save1" color="primary" type="filled">Guardar Cambios</vs-button>

                        </div>   
                      
                    
                    </div>
                </div>
                </vs-card>
            </vs-col>
      </vs-row>
      <br>
  
      
    </div>   
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    data(){
        return{
            //para ver si es docente
            docente:'',
            //para usar en los demas materiales
            librousable:'',
          
            // para el select de libros
            arregloLibros:[],
            //para el select de unidades
            arregloTraeUnidades:[],
            arregloTraeUnidades2:[],
            //para el select de temas
            arregloTraerTemas:[], 
            
            libro:{
                libro:'',
                unidad:[],
                tema:'',
        
            
            }, 
             libro2:{
                libro:'',
                unidad:[],
                tema:'',
        
            
            },   
            
            //para los inputs
            inputs: [{
                name: '',
            
            }],
            //para los inputs unidades-temas
            inputs2:[{
                unidad:'',
                temas:'',
            }],
            error:"",
           
       
                //para subir archivos,
            attachments:[],
            dataarchivos:[],
            form: new FormData,
            form2: new FormData,

           
        }
    },
    components: {
    'v-select': vSelect,
            
    },
    methods:{
         add () {
        this.inputs.push({
            name: '',
           
        })
        },
       

        remove (index) {
        this.attachments.splice(index,1)
        this.inputs.splice(index, 1)
        },

          add2 () {
            this.inputs2.push({
                unidad: '',
                temas: ''
            })
            console.log(this.inputs)
            },

            remove2 (index) {
            
            this.inputs2.splice(index, 1)
            },
    
          //para subir archivos
        fieldChange(e){
              //  let archivo = this.archivo1;
              // this.dataarchivos.push(archivo);
                console.log(e.target.files);
                let selectedFiles=e.target.files;
                if(!selectedFiles.length){
                    return false;
                }
                for(let i=0;i<selectedFiles.length;i++){
                    this.attachments.push(selectedFiles[i]);
                }
                
                console.log(this.attachments);
        },

        borrartodo(){
            this.attachments.splice(0,20)
            this.inputs = [{name:""}];
            
        },
           
    
         //para guardar
        uploadFile(){
              let me  = this;
           

                for(let i=0; i<this.inputs2.length;i++){
                    
                    this.form.append('unidadestemas[]',JSON.stringify(this.inputs2[i]));
                    // this.form.append('temas[]',JSON.stringify(this.inputs2[i].temas));
                    // for(let j=0; j<this.inputs2[i].temas.length;j++){
                    //      this.form.append('temas[]',this.inputs2[i].temas[j].id);
                    // }
                    

                     
                }
             //}  

                for(let i=0; i<this.attachments.length;i++){
                    this.form.append('archivo[]',this.attachments[i]);
                 
                    if(this.docente == "yes"){
                        this.form.append('id_libro',localStorage.getItem("idlibro"));
                        this.form.append('id_asignatura',localStorage.getItem("idasignatura"));
                    }else{
                        this.form.append('id_asignatura',me.libro.libro.asignatura_idasignatura);
                        this.form.append('id_libro',me.libro.libro.idlibro);
                    }
                    
                    this.form.append('nombre_archivo[]',me.inputs[i].name);


                }
               
              
            //    console.log("hola",this.form2);
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                document.querySelectorAll('.upload-file').value=[];
                me.$vs.loading()
                axios.post(this.$data_url+'api/cargarmaterial',this.form, config).then(response=>{
                    
                
                   // me.$vs.loading.close()
                  
                    console.log(response.data);
                    
                  if(response.data.status =="0"){
                      me.$vs.notify({
                      text: 'No se pudo ingresar la informacion',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                    this.form = "";
                    me.libro.libro = "";
                    me.borrartodo()
                    me.inputs2 = []
                    // window.location.reload();

                  }

                   if(response.data.status =="1"){
                      me.$vs.notify({
                      text: 'Se guardo correctamente',
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                    this.$router.go(-1);

                  }
                })
                    .catch(response=>{
                        //error
                    });

        },

      
      

        
          //lista de libros para usar en el select
        listalibros(){
            let me = this
        this.$http.get(this.$server_url+`libroserie`).then(res => {
                    me.arregloLibros = res.data.libroslista;
                    // console.log(me.arregloLibros);
                                    
                    })
                    .catch(function (error) {
                    console.log(error)
                    })

        
        },
        //filtro para filtrar unidad por libro
        filtrarUnidades(){
            
               let me = this;
            
              
                const formData = new FormData();
                
                if(me.docente == "yes"){
                     formData.append('idlibro', localStorage.getItem('idlibro'));
                }else{
                    this.inputs2 = [{unidad:"",temas:""}];
            
                     if( me.libro.libro.idlibro === undefined ){
                        me.$vs.notify({
                            text:'Seleccione una libro antes de filtrar por unidades',
                            color:'warning',
                            iconPack: 'feather',
                            icon:'icon-check'})
                        return;
                    }

                
                
                    me.arregloTraeUnidades2 = [];
                    
                    me.$vs.loading()

                    formData.append('idlibro', me.libro.libro.idlibro);
                }
                
                   

                this.$http.post(this.$server_url+'traerunidades', formData).then(res => {
                   
                    me.arregloTraeUnidades2 = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          },

          //para filtrar los temas por unidad y que se muestre en el select
          filtrarTemas(index){
            let me = this;
                
            this.inputs2[index].temas="";
            // console.log(this.inputs2);
            console.log(this.inputs2[index].unidad.id_unidad_libro);
            let repeticion = this.inputs2[index].unidad.id_unidad_libro;
            let contador =1;
            if(this.inputs2.length >= 2){
               for(let i =0; i<this.inputs2.length; i++){
                   console.log("hola mundo")
                   if(this.inputs2[i].unidad.id_unidad_libro === repeticion){
                       contador++;
                       if(contador>2){
                           alert("ya se eligio esa unidad seleccione otra");
                           this.inputs2[index].unidad="";
                           return false;
                       }
                   }

                 
                   
               }
            }
            
         


                if( me.inputs2[index].unidad.id_unidad_libro === undefined ){
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
                formData.append('id_unidad_libro', me.inputs2[index].unidad.id_unidad_libro);
                   

                this.$http.post(this.$server_url+'traertemas', formData).then(res => {
                    me.arregloTraerTemas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })  
          },

      
    },
    created(){
        this.docente = localStorage.getItem("docente");
        this.listalibros();
      
      
 
  
  },
  mounted(){
      if(this.docente =="yes"){
            this.filtrarUnidades();
      }
 
  }
}
</script>

<style scoped>
.principal{
    /* background:red; */
    display: flex;
    
    flex-wrap: wrap;
}
.principal2{
    /* background:red; */
    display: flex;
    width:100%;
    flex-wrap: wrap;
}
.grupo{
    /* background: green; */
    width: 45%;
    margin:5px 20px;
}
</style>
