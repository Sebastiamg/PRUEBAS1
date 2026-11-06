<template>
    <div>
     <vs-row v-if="listado == true">
    
        <p @click="muestraCrear = true; listado = false;" style="cursor:pointer">
            <vs-chip color="primary" style="cursor:pointer"  class="mt-2">
                <vs-avatar icon="edit"  @click="popupAgregarSeguimiento = true;"/>
                Agregar  Muestra
            </vs-chip>
        </p> 
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-col w-full mt-5">
                 Seleccione una institucion para filtrar el listado:
                 <v-select :options="escuelas" @input="filtrarInstitucion()" :reduce="escuelas => escuelas" label="label" class="w-full" v-model="institucion_filtrar" />
            </div>
        </vs-col>
       
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
             <vs-table stripe :data="visitas" search pagination max-items="10" style="width: 100%;">
                <template slot="header">
                
                    <vs-list>
                        <vs-list-header title="Información"></vs-list-header>
                        <vs-list-item title="Institución" :subtitle="institucion"></vs-list-item>
                        <vs-list-item title="Período" :subtitle="periodo"></vs-list-item>
                    </vs-list>             
                </template>
                <template slot="thead">
                    <vs-th>
                    Muestra
                    </vs-th>
                    <vs-th>
                    Fecha Entrega
                    </vs-th>      
                    <vs-th>
                    Observación
                    </vs-th>
                    <vs-th>
                    Devolución
                    </vs-th>
                    <vs-th>
                    Comentario Devolución
                    </vs-th>
                    <vs-th>
                    Acciones
                    </vs-th>

                </template>
            
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                        <vs-td :data="data[indextr].num_visita" width="12%">
                            <vs-chip color="primary">
                            Muestra Nº {{data[indextr].num_muestra}}
                            </vs-chip>
                           
                        </vs-td>
                        <vs-td :data="data[indextr].fecha_entrega" width="20%">
                            Solicitante:
                            <br>        
                            <span style="font-weight:600;  " >
                            {{ tr.persona_solicita }}<br>
                            </span>
                            Fecha Entrega:
                            <br>        
                            <span style="font-weight:600;  " >
                            {{ tr.fecha_entrega }}<br>
                            </span>
                            <vx-tooltip style="display: inline-block;" text="Ver evidencia" position="top" color="primary">
                                <a :href="$data_url+'archivos/'+'seguimiento/'+'muestra/'+tr.foto_evidencia"  style="display:inline-block;margin-left:-20px;" target="_blank" rel="noopener noreferrer">
                                    <i class="fa fa-camera ml-5" aria-hidden="true"></i>
                                    Evidencia
                                </a>
                            </vx-tooltip> &nbsp;        
                                <br>

                        </vs-td>

                        <vs-td height="30%" width="20%">
                            <div class="overflow-y-auto h-24">
                                {{tr.observacion}}
                            </div>
                        </vs-td>
                        <vs-td>
                            Fecha Devolucion:
                            <br> 
                                
                            <span style="font-weight:600;" >
                            {{ tr.fecha_devolucion }}<br>
                            </span>
                            <vx-tooltip style="display: inline-block;" text="Ver evidencia" position="top" color="primary" v-if="tr.foto_devolucion !=null">
                                <a :href="$server_url+'archivos/'+'seguimiento/'+'muestra/'+tr.foto_devolucion"  style="display:inline-block;margin-left:-20px;" target="_blank" rel="noopener noreferrer">
                                    <i class="fa fa-camera ml-5" aria-hidden="true"></i>
                                    Evidencia
                                </a>
                            </vx-tooltip> &nbsp;        
                                <br>
                        </vs-td>
                             <vs-td height="30%" width="20%">
                            <div class="overflow-y-auto h-24">
                                {{tr.comentario_devolucion}}
                            </div>
                        </vs-td>
                        <vs-td>
                            <div>
                                <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                    <vs-button radius color="success" @click="openModalEdit(tr);update = true" type="line" icon="edit"></vs-button>
                                </vx-tooltip> &nbsp; 
                                <vx-tooltip style="display: inline-block;" text="Añadir devolucion" position="top" color="primary">
                                    <vs-button radius color="warning" @click="openModalDevolucion(tr)" type="line" icon="swap_horiz"></vs-button>
                                </vx-tooltip> &nbsp; 
                            </div>
                           
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
    </vs-row>

    <!--CREAR-->
    <div v-if="muestraCrear == true">
        <vs-button radius color="success" @click="listado = true;tipoMuestra = false; muestraCrear = false;muestraEditar=false;" type="gradient" icon="reply"></vs-button>
        <muestraCrearVue tipoMuestra="Crear"/>
    </div>    

      <!--EDITAR-->
    <div v-if="muestraEditar == true">
        <vs-button radius color="success" @click="listado = true;muestraCrear = false;muestraEditar = false; getVisitas() " type="gradient" icon="reply"></vs-button>
        <muestraCrearVue 
        tipoMuestra="Editar"
        :observacion= "envioDatos.observacion"
        :id = "envioDatos.id"
        :nombreInstitucion = "envioDatos.nombreInstitucion"
        :fecha_entrega = "envioDatos.fecha_entrega"
        :solicitante = "envioDatos.solicitante"
        :foto_evidencia = "envioDatos.foto_evidencia"

        />
    </div>  

    <!--MODAL PARA AGREGAR DEVOLUCION-->

    <vs-popup
      
      background-color="rgba(255,255,255,.6)"
      title="Agregar devolución" :active.sync="popupDevolucion">
        <vs-tabs>
            <vs-tab label="Información devolucion">
                <div class="con-tab-ejemplo">
                    <vs-row>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                             <flat-pickr :config="configdateTimePicker" v-model="devolucion.fecha_devolucion" placeholder="Fecha de devolución" 
                             class="m-1" style="display: inline-block;width: 100%;"
                              />
                        </vs-col>
                    </vs-row>
                    <vs-row class="mt-5">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                            <div v-if="devolucion.foto_devolucion == '' || devolucion.foto_devolucion == null">
                                <p>Sin foto todavia</p>
                            </div>
                            <div v-else style="box-shadow:5px 4px 20px #ccc;">
                                <img style="width: 100%;border-radius:10px; 20px 30px"  :src="$data_url+'archivos/'+'seguimiento/'+'muestra/'+devolucion.foto_devolucion">
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-5">
                            <label class="form-block-input" style="position: relative;right:15px;">
                                <input type="file" class="upload-file form-file-span"  hidden @change="fieldEdit" />
                                <span class="form-file-span"><i class="fa fa-cloud-upload"   aria-hidden="true"></i> Selecciona un archivo</span>
                            </label>  
                            <br>
                        </vs-col>
                         <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-5">
                            <p  class="ml-5 mt-5" style="color:#ccc;font-weight:500">Seleccionado {{archivoName}}</p>    
                        </vs-col>
                        <vs-row class="mt-2">
                            <p class="ml-2">Observación</p>
                            <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <vs-textarea counter="500" style="width:100%;" label="Comentario" :counter-danger.sync="counterDanger" v-model="devolucion.comentario_devolucion" />
                            </vs-col>
                        </vs-row>
                        <vs-row>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <vs-button @click="ActualizarEvidencia()" class="mt-5 ml-5" color="success" type="gradient">Actualizar evidencia</vs-button>
                            </vs-col>
                        </vs-row>    
                    </vs-row>
                </div>
            </vs-tab>
            <vs-tab label="Valores devolucion">
                <div class="con-tab-ejemplo">
                    <muestraDetalle :id="devolucion.id"/>
                </div>
            </vs-tab>
        </vs-tabs>
    </vs-popup>
  
   
    </div>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import muestraCrearVue from './components/muestraCrear.vue';
import muestraDetalle from './components/muestraDetalle.vue'
export default {
    data() {
       return{
            counterDanger: false,
           devolucion:{
               fecha_devolucion:null,
               foto_devolucion:'',
               id:0,
               comentario_devolucion:'',
               foto_devolucion:'',
           },
           configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
           listado:true,
           muestraCrear:false,
           muestraEditar:false,
           counterDanger: false,
           visitas:[],
           institucion:'',
           institucion_id:'',
           periodo:'',
           periodo_id:'',
           usuario:[],
         
            envioDatos:{
                id:'',
                fecha_entrega:null,
                observacion:'',
                solicitante:'',
                nombreInstitucion:'',
                foto_evidencia:'',
            },
            id:0,
            update:false,
            title:'',
            titleFechaGenera:'',
            isAdmin:'',
            asesorDesdeAdmin:'',
            institucion_filtrar:'',
            escuelas:[], 
            popupDevolucion:false,
            errorImage:'',
            tamanioError:'',
            archivoName:'',

       } 
    },
  
      components:{
        flatPickr,
        muestraCrearVue,
        vSelect,
        muestraDetalle,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.isAdmin = localStorage.getItem("adminSeguimiento")
        me.getEscuelas()
        me.title = "Genera"+" " +"Muestra"
        me.titleFechaGenera = "Fecha entrega"+ " " + "Muestra"
  
    }, 
    methods:{
    
        //cantidad de escuelas del asesor
        async getVisitas() {
            let me = this;
            if(me.isAdmin == "yes"){
            
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id") 
            }else{
                me.asesorDesdeAdmin = me.usuario.idusuario
            }
            
            this.$http.get(this.$server_url+'asesor/seguimiento?institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id+'&asesor_id='+me.asesorDesdeAdmin+'&muestra=yes')
                .then(function (response) {
               
                    me.visitas = response.data
                })
                .catch(function (error) {
                    
                })
        },

        //cantidad de escuelas del asesor
        async getEscuelas() {
            let me = this;
            this.$http.get(this.$server_url+'escuelasAsesor?cedula=' + me.usuario.cedula+'&individual=yes'+'&porRegiones=yes'+'&asesor_id='+me.usuario.idusuario)

            // this.$http.get(this.$server_url+'escuelasAsesor?asesor_id=' + me.usuario.idusuario+'&individual=yes'+'&porRegiones=yes')
                .then(function (response) {
                    let datos = response.data.instituciones
                    me.escuelas = datos    

                })
                .catch(function (error) {       
                })
        },

    

        filtrarInstitucion(){
 
            let me = this
            me.visitas = []
            localStorage.setItem('institucion_seguimiento_id',me.institucion_filtrar.id)
            localStorage.setItem('institucion_seguimiento_nombre',me.institucion_filtrar.label)
            localStorage.setItem('institucion_seguimiento_periodo_id',me.institucion_filtrar.id_periodo)
            localStorage.setItem('institucion_seguimiento_periodo',me.institucion_filtrar.periodo)
            me.institucion = localStorage.getItem("institucion_seguimiento_nombre")
            me.institucion_id = localStorage.getItem("institucion_seguimiento_id")
            me.periodo = localStorage.getItem("institucion_seguimiento_periodo")
            me.periodo_id = localStorage.getItem("institucion_seguimiento_periodo_id")
            me.getVisitas()
        },

        openModalEdit(tr){
            let me = this;
            me.envioDatos.id = tr.muestra_id 
            me.envioDatos.observacion = tr.observacion
            me.envioDatos.solicitante = tr.persona_solicita
            me.envioDatos.nombreInstitucion =  localStorage.getItem("institucion_seguimiento_nombre")
            me.envioDatos.fecha_entrega = tr.fecha_entrega
            me.envioDatos.foto_evidencia = tr.foto_evidencia
            me.muestraEditar = true
            me.listado = false
          
        },

        openModalDevolucion(tr){
            let me = this;
            me.popupDevolucion = true
            me.devolucion.fecha_devolucion = tr.fecha_devolucion
            me.devolucion.foto_devolucion = tr.foto_devolucion
            me.devolucion.fecha_entrega = tr.fecha_entrega
            me.devolucion.foto_devolucion = tr.foto_devolucion
            me.devolucion.id = tr.muestra_id
            if(tr.comentario_devolucion == "null"){
                me.devolucion.comentario_devolucion = ""
            }else{
                me.devolucion.comentario_devolucion = tr.comentario_devolucion
            }
           

        },
      
        limpiar(){
            let  me = this;
            me.seguimiento.observacion = ""
            me.Fgenerar = null

        },
         fieldEdit(e){
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
        
         ActualizarEvidencia(){
            let me = this;
       

            if(me.devolucion.fecha_devolucion == null || me.devolucion.fecha_devolucion == "" || me.devolucion.fecha_devolucion == undefined){
                 me.$vs.notify({
                  text:'Debe agregar una fecha de devolución',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false;
            }

            if(me.devolucion.fecha_devolucion <  me.devolucion.fecha_entrega){
                 me.$vs.notify({
                  text:'La fecha de devolución no puede ser menor a la fecha de entrega',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false;
            }

          
            // if(me.attachments==  || me.devolucion.foto_devolucion == null ){
            //     if(me.attachments == undefined){
            //         me.$vs.notify({
            //         text:'Seleccione una imagen antes de enviar',
            //         color:'warning',
            //         iconPack: 'feather',
            //         icon:'icon-check'})  
            //         return false; 
            //     }
            // }
         
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
            if(me.attachments == undefined){

            }else{
                for(let i=0; i<this.attachments.length;i++){
                    if(me.attachments.length == 0){
                    }else{
                    formData.append('enviarArchivo','yes');
                    formData.append('archivo[]',this.attachments[i]);
                    }
                }
            }


            
            formData.append('id',                   me.devolucion.id);
            formData.append('fecha_devolucion',     me.devolucion.fecha_devolucion);
            formData.append('comentario_devolucion',     me.devolucion.comentario_devolucion);
            formData.append('devolucion', "yes");

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            document.querySelectorAll('.upload-file').value=[];
            me.$vs.loading()
            axios.post(this.$data_url+'api/EditarDetalle',formData, config)
        
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.popupDevolucion =false;
                    me.getVisitas();
                    me.attachments = [];
                    me.archivoName='';
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
    }
}
</script>

<style scoped>
/* Formato de etiqueta */
.titulo {
    background: #4CB8C4;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #3CD3AD, #4CB8C4);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #3CD3AD, #4CB8C4);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: white;
    letter-spacing: 1px;

}

.image1 {
    filter: drop-shadow(0 0 5px coral);
    border-radius: 20px;
    cursor: pointer;
    opacity: 0.7;
}

.image1:hover {
    opacity: 1
}

.form-block-input {

    display: flex;
    max-width: 400px;
    overflow: hidden;
    font-size: 0.9em;
    color: #777;
    margin-left: 50px;
    border: 1px #25a solid;

    padding: 0;
    border-radius: 3px;
    border: none;
}

/* Ocultar campo tipo file */
input[type="file"].form-file {
    display: none;
}

/* Botón para seleccionar archivos */
button.form-file-button {
    vertical-align: middle;
    color: #fff;
    background: #24A6F6;
    margin: 0;
    border: 0;
    width: 50px;
    padding: 2px 8px;
    transform: scaleX(-1);
    /* Invertir botón horizontalmente */
}

/* Lista de archivos */
span.form-file-span {
    flex: 1;
    display: inline-block;
    text-align: left;
    padding: 4px 10px;
    background: #24A6F6;
    color: #fff;
    padding: 10px;
    border-radius: 5px 15px;
    cursor: pointer;
    font-size: 20px;

}

/* Arhchivos en lista */
span.form-files {
    display: inline-block;
    color: #555;
    background: #ccf;

    margin: 2px 8px 2px 0;
    padding: 2px 5px;
    white-space: nowrap;
    border-radius: 3px;
}

/* Quitar margen horizontal al último elemento en la lista */
span.form-block-span:last-child {
    margin: 2px 0;
}
</style>
