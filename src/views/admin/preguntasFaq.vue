<template>
    <div>
        <vs-card>
        
          <vs-button color="dark" style="margin:10px;" @click="update=false;popupAddPregunta=true;limpiar();" type="filled">Crear Pregunta</vs-button>

           <div v-if="preguntasFaq.length >0 ">
              <br>
                <vs-table max-items="10" search pagination :data="preguntasFaq" style="margin-top:-40px">
                    <template slot="thead">
                        
                        <vs-th>Pregunta</vs-th>
                        <vs-th>Descripcion</vs-th>
                        <vs-th>Video</vs-th>
                        <vs-th>Imagen</vs-th>
                        <vs-th>Accion</vs-th>
                       
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            
                            <vs-td>
                               
                                {{data[indextr].pregunta}}<br>
                                
                            </vs-td>
                            <vs-td>
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                            <vs-td>
                                <a :href="data[indextr].video" target="_blank">{{data[indextr].video}}</a><br>
                            </vs-td>

                            <vs-td>
                                <div v-if="tr.url == null"> 
                                    
                                </div>
                                <div v-else> 
                                    <img width="100" :src="$server_url+'preguntas_frecuentes/'+tr.url"/>
                                </div>
                                
                                <br>
                            </vs-td>


                            <vs-td>
                                <div style="display:flex;">
                                  
                                    <vx-tooltip style="display: inline-block;" text="Editar Faq" position="top" color="primary">
                                        <vs-button size="small" class="modal-default-button" color="warning" @click="update=true;openModalEditar(data[indextr])"  type="filled" icon-pack="feather" icon="icon-edit">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;

                                    <vx-tooltip style="display:inline-block" color="danger" text="Desactivar Pregunta">
                                        <vs-button style="display:inline-block" v-if="data[indextr].estado_pregunta == '1'" color="danger" type="filled" icon-pack="feather" icon="icon-x-circle" @click="ConfirmCambiadoEstadoCodigo(data[indextr], 0)" size="small"></vs-button>
                                    </vx-tooltip>
                                
                                    <vx-tooltip style="display:inline-block" color="primary" text="Activar Pregunta">
                                        <vs-button style="display:inline-block" v-if="data[indextr].estado_pregunta == '0'" color="success" type="filled" icon-pack="feather" icon="icon-check" @click="ConfirmCambiadoEstadoCodigo(data[indextr], 1)" size="small"></vs-button>
                                    </vx-tooltip> 

                                </div>
                            </vs-td>
                           
                            
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe preguntas frecuentes aun. </p>
            </div>
        </vs-card>
        <!--PARA LOS MODALES -->
        <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Pregunta" :active.sync="popupAddPregunta">
                
                <vs-input class="inputx mb-3 w-full" label="Pregunta" v-model="pregunta.descripcion" />
     
                <vs-input class="inputx mb-3 w-full" label="Link video" v-model="pregunta.video" />
    
                    <!-- <p v-html="image" class="foro-detalle p-5"></p> -->
                <vs-divider color="warning">Respuesta</vs-divider>
                 <vs-textarea counter="300" :counter-danger.sync="counterDanger" style="width:100%;" label="Descripcion" v-model="pregunta.respuesta" />

                <!-- <vs-input class="inputx mb-3 w-full" label="Descripcion" v-model="pregunta.respuesta" /> -->
                 Imagen:                    
                <input type="file" class="upload-file" style="margin-top:20px;"  @change="fieldChange" />
                 
                 <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarPregunta()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>

          <!-- Modal Editar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Pregunta" :active.sync="popupEditPregunta">

                <vs-input class="inputx mb-3 w-full" label="Pregunta" v-model="pregunta.descripcion" />
                <!-- <vs-input class="inputx mb-3 w-full" label="Descripcion" v-model="pregunta.respuesta" /> -->
                <vs-textarea counter="300" :counter-danger.sync="counterDanger" style="width:100%;" label="Descripcion" v-model="pregunta.respuesta" />
                <vs-input class="inputx mb-3 w-full" label="Link video" v-model="pregunta.video" />
                <div v-if="pregunta.url == null"> 
                                
                </div>
                <div v-else> 
                    <p style="font-size:12px;">Imagen actual</p>
                    <img width="100" style="margin-top:10px;" :src="$server_url+'preguntas_frecuentes/'+pregunta.url"/>
                </div>

                 <vs-input class="inputx mb-3 w-full" disabled label="Nombre imagen actual" v-model="pregunta.archivo" />
                Cambiar imagen:                    
                <input type="file" class="upload-file" style="margin-top:20px;"  @change="fieldChange" />
                <br><br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarPregunta()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return{
            counterDanger: false,
            update:false,
            popupAddPregunta:false,
            popupEditPregunta:false,
            preguntasFaq:[],
            itemEstado:[],
            estadoPregunta:'',
            pregunta:{
                descripcion:'',
                respuesta:'',
                archivo:'',
                url:'',
                video:'',
            },
            preguntasfaq_id:0,
            //para subir archivos,
            attachments:[],
            form: new FormData,
            errorImage:'no',
            tamanioError:"no",
        }
    },
    created(){
        let me = this;
        me.preguntasfaq();
    },
    methods:{
        //para subir archivos
        fieldChange(e){
            let me = this;
                me.errorImage = 'no'
                me.tamanioError="no"
                this.attachments = [];
                let selectedFiles=e.target.files;
                let validar = e.target.files[0].type;

                let tamanio = e.target.files[0].size;
                
                if(tamanio > 1000000){
                    me.tamanioError="yes"
                    me.$vs.notify({
                        text:'El tamaño de la imagen excede 1MB',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})  
                        return false;  
                }
                
            
                if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg'){
                    for(let i=0;i<selectedFiles.length;i++){

                      this.attachments.push(selectedFiles[i]);
                     }
                     me.errorImage = 'no'
                }else{
                  me.errorImage = 'yes'
                  me.$vs.notify({
                    text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return false;
                  
                
                }
            
               
        },

         //traer las preguntas frecuentes
        async preguntasfaq(){
            let me = this;
            await this.$http.get(this.$server_url+"preguntasfaq?todo=yes")
            .then(function (response) {
                me.preguntasFaq = response.data
            })
            .catch(function (error) {
                console.log(error)
            });

            
        },
        ConfirmCambiadoEstadoCodigo(item,estado){
                let me = this;
                me.itemEstado = item;
                me.estadoPregunta = estado;
               
                this.$vs.dialog({
                    type:'confirm',
                    color: 'danger',
                    title: `Confirm`,
                    text:  'Esta seguro de cambiar el estado de la Pregunta?',
                    accept:this.ActivarModalEstadoPregunta
                })
        },
        ActivarModalEstadoPregunta(){
            let me = this;
            let formData = new FormData();
            formData.append("preguntasfaq_id", me.itemEstado.preguntasfaq_id);
            formData.append("estado", me.estadoPregunta);

                me.$vs.loading()
                this.$http.post(this.$server_url+'cambioEstadoPregunta', formData)
                .then(res => {
                    // console.log(res.data)

                    if(res.data.message){
                         me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        return false;
                    }
                    me.preguntasfaq();
                    me.$vs.loading.close()
                    me.$vs.notify({
                            text: "Se cambio de estado correctamente",
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check'
                    })
                    
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error)
                });
        },

         //para guardar las preguntas

         guardarPregunta(){
        
            let me = this;
         
            if(me.tamanioError == 'yes'){
                me.$vs.notify({
                    text:'El tamaño de la imagen excede 1MB',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})  
                    return false;  
            }
           
            if(me.errorImage == 'yes'){
                me.$vs.notify({
                    text:'El formato de la imagen solo se acepta jpg/png/jpeg',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})  
                    return false;      
            }     
            

        
            if(me.pregunta.descripcion.length < 5 || me.pregunta.respuesta.length < 5){
                me.$vs.notify({
                text:'Minimo 5 caracteres un campo se encuentra',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})  
                return false;      
            }

              if(me.pregunta.descripcion.length >= 300){
                me.$vs.notify({
                text:'Maximo 300 caracteres para la Pregunta',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})  
                return false;      
            }

              if(me.pregunta.respuesta.length >= 300){
                me.$vs.notify({
                text:'Maximo 300 caracteres para la descripcion',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})  
                return false;      
            }

                let formData = new FormData();
                //Si no se envia imagenes
                if(me.attachments.length == 0){
                      //Si no envia imagenes y se quiere editar
                    if(me.update){
                        formData.append('sinimagen', "yes");
                        formData.append('preguntasfaq_id', me.preguntasfaq_id);
                        formData.append('pregunta', me.pregunta.descripcion);

                        if(me.pregunta.video == null){
                           
                        }else{
                                if(me.pregunta.video.length > 10){

                                    formData.append('video', me.pregunta.video);  
                                }
                                else{
                                    formData.append('video', me.pregunta.video);
                                }

                        }
                            
                        
                        formData.append('respuesta', me.pregunta.respuesta);
                    }
                      //Si  no envia imagenes y se quiere guardar
                    else{
                        formData.append('sinimagen', "yes");
                        formData.append('pregunta', me.pregunta.descripcion);

                        if(me.pregunta.video == null){
                           
                        }else{
                         
                                if(me.pregunta.video.length > 10){

                                    // var obtenerFrame = me.pregunta.video.replace('watch?v=','embed/');
                                  
                                    formData.append('video', me.pregunta.video);  

                                }
                                else{
                                    formData.append('video', me.pregunta.video);
                                }

                        }
                      
                        formData.append('respuesta', me.pregunta.respuesta); 
                    }
                }else{
                    //Si se envia imagenes
                    for(let i=0; i<this.attachments.length;i++){
                        
                        //Si se envia imagenes y se quiere editar
                        if(me.update){
                            formData.append('preguntasfaq_id', me.preguntasfaq_id);
                            formData.append('pregunta', me.pregunta.descripcion);
                            formData.append('respuesta', me.pregunta.respuesta);

                            
                                if(me.pregunta.video == null){
                           
                                }else{
                                        if(me.pregunta.video.length > 10){

                                            formData.append('video', me.pregunta.video);  

                                        }
                                        else{
                                            formData.append('video', me.pregunta.video);
                                        }

                                }
                            formData.append('archivo[]',this.attachments[i]);
                        }
                          //Si se envia imagenes y se quiere guardar
                        else{
                            formData.append('pregunta', me.pregunta.descripcion);
                            formData.append('respuesta', me.pregunta.respuesta); 

                            if(me.pregunta.video.length > 10){
                         
                            formData.append('video', me.pregunta.video);  

                            }else{

                                formData.append('video', me.pregunta.video);
                            }
                            formData.append('archivo[]',this.attachments[i]);
                        
                        }
                     }
                }

          
           
         
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            document.querySelectorAll('.upload-file').value=[];
            me.$vs.loading()
            this.$http.post(this.$server_url+'preguntasfaq', formData,config)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.preguntasfaq()
                    me.popupAddPregunta=false,
                    me.popupEditPregunta=false,
                    // me.update = false;
                    me.limpiar()
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        //para editar los campos
        openModalEditar(data={}){
            let me = this;
            me.attachments = [];
            document.querySelectorAll('.upload-file').value=[];
            me.popupEditPregunta = true;
            //llenar la data en los campos
            me.preguntasfaq_id = data.preguntasfaq_id;
            me.pregunta.descripcion = data.pregunta;  
            me.pregunta.respuesta = data.descripcion;
            me.pregunta.archivo = data.archivo;
            me.pregunta.url = data.url;
            me.pregunta.video = data.video
 
        },
        limpiar(){
            let me = this;
            me.pregunta.descripcion = "";
            me.pregunta.respuesta = "";
            me.pregunta.archivo = "";
            me.pregunta.url = "";
            me.pregunta.video = "";
            me.attachments = [];
        }

    }
}
</script>