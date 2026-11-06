<template>
    <div>
        <vs-card>
         
            <div class="header" v-if="pensionesVer == true">
                 <div v-if="valores.length >0 ">
                    <br/>  <br/>
                    <vs-table max-items="20" search pagination :data="valores" style="margin-top:-40px">
                        <template slot="thead">
                            
                            <vs-th>Cuota</vs-th>
                            <vs-th>Valor cuota</vs-th>
                            <vs-th>Valor pendiente</vs-th>
                            <vs-th>Fecha pago</vs-th>
                            <vs-th>Acción</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                
                                <vs-td>
                                   
                                    {{indextr +1 }}<br>
                                    
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].valor_cuota}}<br>
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].valor_pendiente}}<br>
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].fecha_a_pagar}}<br>
                                </vs-td>
                                <vs-td>
                                    
                                    <div v-if="tr.valor_pendiente == '0'">
                                        <vx-tooltip style="display: inline-block;" text="Pagado" position="top" color="warning">
                                            <vs-button class="modal-default-button" color="success" size="small" type="filled" icon-pack="feather" icon="icon-dollar-sign"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                    </div>

                                 
                                    <div v-else>
                                        <vx-tooltip style="display: inline-block;" text="Pago pendiente" position="top" color="primary">
                                            <vs-button class="modal-default-button" @click="vistaComprobante(tr,indextr,data)" color="primary" size="small" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                        </vx-tooltip> &nbsp;
                                    </div>
                                

                                    
                             

                                </vs-td>
                          
                                
                            </vs-tr>
                        </template>
                    </vs-table>   
                </div>
                
                <div v-else class="p-3">
                    <p> No existe valores para las pensiones aun. </p>
                </div>
            </div>

            <div v-if="pensionesVer == false">
                <!--Boton para regresar-->
                <br/>
                <vs-button color="primary" @click="pensionesVer= true;" size="small" type="filled" icon="arrow_back">Regresar</vs-button> 
                <br/>
                
                 <div>
                    <vs-row>  
                        <vs-card>
                            <vs-alert active="true">
                            
                                <p style="color:#2A9FF6;"><i class="fa fa-exclamation" aria-hidden="true"></i> <span> Suba una foto del comprobante del pago efecutado para legalizar la pensión ${{valor_cuota}}</span> </p> 
                            </vs-alert>
                            <div slot="header">
                                <p style="color:#2A9FF6;"><i class="fa fa-usd" aria-hidden="true"></i> <span> Validar pago de pensión</span> </p>
                            </div> 

                            <div>
                                <vs-row>
                                    <br/>     

                                   <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">

                                        <div style="display:flex;flex-direction: column;margin-top: 30px;">
                                            <div>
                                                <vs-chip color="warning" v-if="IfImagen == true">
                                                    comprobante actual
                                                </vs-chip>    
                                            </div>

                                             <div v-if="IfImagen == true">
                                                 <br/>
                                                   <img :src="$data_url+urlImage" width="150" @click="popupImagen =true" class="image1"/>
                                            </div>


                                        </div>
                                     

                                    </vs-col>  

                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">

                                        <label class="form-block-input">
                                            <input type="file" class="upload-file form-file-span" hidden @change="fieldChange" />
                                            
                                                <span class="form-file-span"><i class="fa fa-cloud-upload"   aria-hidden="true"></i> Selecciona un archivo</span>
                                        </label>
                                    </vs-col>   

                                   
                                    <vs-row style="margin-top:20px;">
                                        
                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                        <vs-textarea counter="100" style="width:95%;" label="Comentario" :counter-danger.sync="counterDanger" v-model="cuota.comentario" />
                                        </vs-col>
                                    </vs-row>

                                   <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                        <vs-button @click="guardarComprobate()"  color="success" style="margin:50px 50px 0px 0px;" type="gradient">Subir  Comprobante</vs-button>
                                    </vs-col>
                                </vs-row>
                                <br/>
                            </div>    
                        </vs-card>  
                    </vs-row>
                
                    
                </div>

            </div>
        </vs-card>
         <vs-popup class="holamundo"  title="Imagen del comprobante" :active.sync="popupImagen">
             <img :src="$data_url+urlImage" width="500"  class="image1"/>
          </vs-popup>

    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
      return{
          IfImagen:true,
          popupImagen:false,
          counterDanger: false,
          pensionesVer:true,
          valores:[],
          valor_cuota:'',
          idcouta:'',
         //para subir archivos,
            attachments:[],
            form: new FormData,
            errorImage:'no',
            tamanioError:"no",
            archivoName:'',
            cuota:{
                idcouta:'',
                comentario:'',
                fecha_a_pagar:'',
            },
            usuario:[],
            urlImage:'',
            ifMatriculado:'',
      }  
    },

    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getValoresPensiones();
        me.getEstadoMatricula();
    
    },

    methods:{

         //para cambiar de grupo al estudiante
         cambiarGrupoMatricula(grupo){
             let me = this;
        
            this.$http.get(this.$server_url+'cambiarEstadoMatricula?grupo='+grupo+'&idusuario='+me.usuario.idusuario)
                .then(function (res) {
                
                    location.reload();
                     me.$router.push('/')
                    
                    localStorage.clear();
               

                })
                .catch(function (error) {
                    console.log(error + ' error');
                   

                })
         },

        getEstadoMatricula() {
            let me = this;
           
            let periodo = localStorage.getItem('periodo_id')
            let idusuario = me.usuario.idusuario
           
            this.$http.get(this.$server_url+'valores/pensiones?periodo_id='+periodo+'&idusuario='+idusuario)
                .then(function (res) {

                   
                     me.ifMatriculado = res.data.buscarEstudianteReserva[0].estado_matricula

                    if(me.usuario.id_group == 4){

                        if(me.ifMatriculado == '2'){
                        me.cambiarGrupoMatricula(14)
                        }
                        if(me.ifMatriculado == '3'){
                            me.cambiarGrupoMatricula(14)
                        }
                     }

                      if(me.usuario.id_group == 14){

                        if(me.ifMatriculado == '1'){
                            me.cambiarGrupoMatricula(4)
                         }
                      }
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },

        vistaComprobante(tr,id,data){
            return false;
            let me = this;
           
            if(tr.url == null){
                me.IfImagen = false;
            }else{
                let image = tr.url
                me.urlImage = image.slice(1)
                me.IfImagen = true;
            }
         
           
            let valor_anterior = id -1
            let valor=  data[valor_anterior].valor_pendiente
            if(valor == 0){
              
            
                me.valor_cuota = tr.valor_cuota
                me.pensionesVer = false;
                me.cuota.idcouta = tr.id_cuotas_id
                me.cuota.fecha_a_pagar = tr.fecha_a_pagar
               
            }else{
                 me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Aun no esta habilitada para pagar esta cuota'
                    })
                return false;
            }
          
            
        },
          //para obtener los valores de las pensiones del estudiante
        getValoresPensiones() {
            let me = this;
            me.$vs.loading();



            let periodo_id = localStorage.getItem("periodo_id")
        
            this.$http.get(this.$server_url+'valores/pensiones?idusuario='+me.usuario.idusuario+'&periodo_id='+periodo_id)
                .then(function (res) {
                    me.valores = res.data.traerPensiones
               
                    me.$vs.loading.close()
                    
                    if(res.data.message){
                        me.$vs.notify({
                                text: res.data.message,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        return false;
                        }


                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },


         guardarComprobate(){
            let me = this;
        
           
      
        
              if(me.cuota.comentario.length >= 100){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El comentario no puede exceder los 100  caracteres'
                    })
                return false;
            }


            if(me.attachments.length == 0){
                 me.$vs.notify({
                    text:'Seleccione una imagen antes de enviar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})  
                    return false; 
            }

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
            let formData = new FormData();

            //Si se envia imagenes
            for(let i=0; i<this.attachments.length;i++){
                
                formData.append('periodo_id', localStorage.getItem('periodo_id')); 
                formData.append('descripcion_periodo',localStorage.getItem('descripcion_periodo'));
                formData.append('nombreInstitucion',localStorage.getItem("nombreInstitucion"));

                formData.append('idcouta', me.cuota.idcouta);
                formData.append('comentarioCuota', me.cuota.comentario); 
                formData.append('fecha_a_pagar',me.cuota.fecha_a_pagar);
                formData.append('archivo[]',this.attachments[i]);
                
 
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            document.querySelectorAll('.upload-file').value=[];
            me.$vs.loading()
            axios.post(this.$data_url+'api/guardarComprobantepension',formData, config)
            
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })

                    me.getValoresPensiones();
                    me.attachments = [];
                    me.archivoName='',
                    me.cuota.fecha_a_pagar = ""
                    me.cuota.comentario = ""
                    me.pensionesVer = true;
                
                  
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })


       
        },

        
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
                      localStorage.setItem('nameArchivo',this.attachments[0].name)
                      me.archivoName = localStorage.getItem("nameArchivo")
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

    }
}
</script>

<style scoped>
/* Formato de etiqueta */

.image1{
 filter: drop-shadow(0 0 5px coral);
 border-radius: 20px;
 cursor: pointer;
 opacity: 0.7;
}
.image1:hover{
 opacity:1
}
.form-block-input {
    
  display:flex;
  max-width:450px;
  overflow:hidden;
  font-size:0.9em;
  color:#777;

  border:1px #25a solid;
  margin:30px 40px 2px  2px;
  padding:0;
  border-radius:3px;
  border: none;
}
/* Ocultar campo tipo file */
input[type="file"].form-file {
  display:none;
}
/* Botón para seleccionar archivos */
button.form-file-button {
  vertical-align:middle;
  color:#fff;
  background:#24A6F6;
  margin:0;
  border:0;
  width: 50px;
  padding:2px 8px;
  transform:scaleX(-1); /* Invertir botón horizontalmente */
}
/* Lista de archivos */
span.form-file-span {
  flex:1;
  display:inline-block;
  text-align:left;
  padding:4px 10px;
  background: #24A6F6;
  color:#fff;
  padding: 10px;
   border-radius:5px 15px;
   cursor: pointer;
   font-size: 20px;
  
}
/* Arhchivos en lista */
span.form-files {
  display:inline-block;
  color:#555;
  background:#ccf;
  
  margin:2px 8px 2px 0;
  padding:2px 5px;
  white-space:nowrap;
  border-radius:3px;
}
/* Quitar margen horizontal al último elemento en la lista */
span.form-block-span:last-child {
  margin:2px 0;
}
</style>