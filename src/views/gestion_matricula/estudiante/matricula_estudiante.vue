<template>
    <div>
         <!--Actualizar Datos Del estudiante-->
      
         <div v-if="ifMatriculado == 1 && estudiante.update_datos == '0'">
                
                 <br/>
            <vs-row>
            
                <vs-alert active="true" color="warning">
                    <p style="font-weight:bold;"><i class="fa fa-exclamation" aria-hidden="true"></i> Actualize sus datos , representante legal y económico para proseguir con la reserva de la matrícula</p>    
                </vs-alert>

            </vs-row>

            <br/>

            <vs-row>
                <vs-card>
                    <vs-collapse>
                            <vs-collapse-item>
                                <div slot="header">
                                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Estudiante</span> </p>
                                </div> 

                                <div>
                                    <vs-row>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Nombres" disabled  v-model="estudiante.nombres" style="width:90%;" placeholder="Nombre"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Apellidos" disabled v-model="estudiante.apellidos" style="width:90%;" placeholder="Apellidos"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Email"  disabled v-model="estudiante.email" style="width:90%;" placeholder="Email"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Institución" disabled v-model="estudiante.nombreInstitucion" style="width:90%;" placeholder="Institución"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Curso actual" disabled v-model="estudiante.nombrenivel" style="width:90%;" placeholder="Curso actual"/>
                                        </vs-col>
                                
                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Curso próximo" disabled v-model="nivelactual" style="width:90%;" placeholder="Curso próximo"/>
                                        </vs-col>


                                    </vs-row>

                                    <br>        
                                </div>                 
                            </vs-collapse-item>      
                        </vs-collapse>
                </vs-card>

            </vs-row>

            <vs-row>
                <vs-card>
                        <vs-collapse>
                            <vs-collapse-item>
                                <div slot="header">
                                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Representante Económico</span> </p>
                                </div> 

                                <div>
                                    <vs-row>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Parentesco" disabled  v-model="estudiante.parentesco_rc" style="width:90%;" placeholder="Parentesco"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Nombres"   v-model="estudiante.nombres_rc" style="width:90%;" placeholder="Nombres"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Apellidos"  v-model="estudiante.apellidos_rc" style="width:90%;" placeholder="Apellidos"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Cédula" disabled v-model="estudiante.cedula_rc" style="width:90%;" placeholder="Cédula"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input type="number" label="Teléfono casa"  v-model="estudiante.telefono_casa_rc" style="width:90%;" placeholder="Teléfono casa"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input type="number" label="Teléfono celular"  v-model="estudiante.telefono_celular_rc" style="width:90%;" placeholder="Celular"/>
                                        </vs-col>

                                        
                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input  label="Dirección"  v-model="estudiante.direccion_rc" style="width:90%;" placeholder="Dirección"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Empresa"  v-model="estudiante.empresa_rc" style="width:90%;" placeholder="Empresa"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Profesión"  v-model="estudiante.profesion_rc" style="width:90%;" placeholder="Profesión"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Dirección trabajo"  v-model="estudiante.direccion_trabajo_rc" style="width:90%;" placeholder="Dirección trabajo"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Email"  v-model="estudiante.email_rc" style="width:90%;" placeholder="Email"/>
                                        </vs-col>
                                    </vs-row>
                                    <br/>

                                
                                </div>    
                                        
                            </vs-collapse-item>
                        </vs-collapse>
                </vs-card>  
            </vs-row>

            <vs-row>
                <vs-card>
                    <vs-collapse>

                            <vs-collapse-item>
                                <div slot="header">
                                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Representante legal</span> </p>
                                </div> 

                                <div>
                                    <vs-row>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Parentesco" disabled  v-model="estudiante.parentesco_rl" style="width:90%;" placeholder="Parentesco"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Nombres"   v-model="estudiante.nombres_rl" style="width:90%;" placeholder="Nombres"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Apellidos"  v-model="estudiante.apellidos_rl" style="width:90%;" placeholder="Apellidos"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Cédula" disabled v-model="estudiante.cedula_rl" style="width:90%;" placeholder="Cédula"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input type="number" label="Teléfono casa"  v-model="estudiante.telefono_casa_rl" style="width:90%;" placeholder="Teléfono casa"/>
                                        </vs-col>

                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input type="number" label="Teléfono celular"  v-model="estudiante.telefono_celular_rl" style="width:90%;" placeholder="Celular"/>
                                        </vs-col>

                                        
                                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input  label="Dirección"  v-model="estudiante.direccion_rl" style="width:90%;" placeholder="Dirección"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Empresa"  v-model="estudiante.empresa_rl" style="width:90%;" placeholder="Empresa"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Profesión"  v-model="estudiante.profesion_rl" style="width:90%;" placeholder="Profesión"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Dirección trabajo"  v-model="estudiante.direccion_trabajo_rl" style="width:90%;" placeholder="Dirección trabajo"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Email"  v-model="estudiante.email_rl" style="width:90%;" placeholder="Email"/>
                                        </vs-col>

                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                            <vs-input label="Email Institucional"  disabled v-model="estudiante.email_institucional_rl" style="width:90%;" placeholder="Email Institucional"/>
                                        </vs-col>
                                    </vs-row>
                                    <br/>

                                
                                </div>    
                                        
                            </vs-collapse-item>
                    
                        </vs-collapse>
                </vs-card>
            </vs-row>

            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="actualizarData()" id="btnUpdateDatos" type="gradient">Guardar datos</vs-button>
                </vs-col>
            </vs-row>   
        </div>

           <!--PARA CUANDO SE ENCUENTRA EN ESTADO  RESERVA-->
         <div v-if="ifMatriculado == '2'">
             <vs-card style="padding:20px;">
                 <vs-row>
                        <vs-alert active="true">
                            
                        <p style="color:#2A9FF6;"><i class="fa fa-exclamation" aria-hidden="true"></i> <span> Se ha creado una solicitud de reserva, espere a que se le legalizen su matrícula</span> </p> 
                    </vs-alert>
                </vs-row>
             </vs-card>
          

         </div>

        <!--PARA CUANDO SE ENCUENTRA EN ESTADO PRE RESERVA-->


        <div  v-if="ifMatriculado == '1'   && estudiante.update_datos == '1'">
                    
            <div>
                <vs-row>  
                    <vs-card>
                        
                        <div slot="header">
                            <p style="color:#2A9FF6;"><i class="fa fa-usd" aria-hidden="true"></i> <span> Solicitud de matrícula</span> </p>
                        </div> 

                        <div>
                                <br/>  <br/>    <br/>  <br/> 
                        


                                <div v-if="PagosPendientes == true">
                                        <vs-row>
                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                        <vs-alert title="Mensaje" color="danger" active="true">
                                        No puede reservar su matrícula por que tiene pagos pendientes de ${{  debeEstudiante  }}
                                        </vs-alert>
                                        </vs-col>
                                        </vs-row>
                                </div>

                                <div v-else>
                                    <vs-alert active="true">
                        
                                        <p style="color:#2A9FF6;"><i class="fa fa-exclamation" aria-hidden="true"></i> <span> Presione el botón  para solicitar una reserva de matrícula</span> </p> 
                                    </vs-alert>

                                    <vs-row>
                                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                            <!-- <vs-button @click="reservarMatricula()"  color="success" style="margin:50px 50px 0px 0px;" type="gradient">Aceptar   reserva</vs-button> -->
                                            <vs-button @click="solicitudReserva()"  color="success" style="margin:50px 50px 0px 0px;" type="gradient">Solicitud  de reserva</vs-button>

                                        </vs-col>
                                    </vs-row>
                                </div>
                                

                                
                        
                            <br/>
                        </div>    
                    </vs-card>  
                </vs-row>
            
                
            </div>
        </div>

      
          
        <!--Cuando este legalizado-->
       <div  v-if="ifMatriculado == '1'   && estudiante.update_datos == '3'">
            <vs-card>
                  <vs-alert active="true" color="success">
                        
                    <p style="color:#2fa564;"><i class="fa fa-exclamation" aria-hidden="true"></i> 
                        <span> Presione en botón  para aceptar solicitud de reserva, 
                        </span>
                     </p> 
                 </vs-alert>

                    <vs-row>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" style="padding:10px;">
                            <vs-button @click="reservarMatricula()"  color="success" style="margin:50px 50px 0px 0px;" type="gradient">Aceptar solicitud</vs-button>

                        </vs-col>
                    </vs-row>
            </vs-card>

        

        </div>

        <div  v-if="ifMatriculado == '1'  && estudiante.update_datos == '2'">
            <vs-card>
                <!--Boton para regresar-->
                <p>Listado de Pensiones</p>
                <br/>
                <pensionesCobrar/>
            </vs-card>
        
        </div>

               
        <!--SI SE CANCELA SU MATRICULA-->
        <div v-if="ifMatriculado == 3">

        
            <div >
                <vs-card>
                   <vs-alert title="Matriculación" active="true" color="danger">
                       Su matriculación se encuentra inactiva
                    </vs-alert>
                </vs-card>
                
            </div>

        </div>


          
     
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import vSelect from 'vue-select'
import pensionesCobrar from  './components/pensionesCobrar.vue'
import DataEstudiante from './components/DataEstudiante.vue'
export default {
    data() {
        return{
           popupImagen:false,
          estudiante:[],
            usuario:[],
            periodosAll:[],
            nivelactual:'',
            ordenactual:'',
            valoractual:'',
            fecha_inicio_pension:null,
            ifMatriculado:'',
            PagosPendientes:false,
            debeEstudiante:0,
            //para subir archivos,
            attachments:[],
            form: new FormData,
            errorImage:'no',
            tamanioError:"no",
            archivoName:'',
            urlImage:'',
          
        }
    },
     components: {
        'v-select': vSelect,
        pensionesCobrar,
        DataEstudiante,
                
     },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getPeriodoInstitucion();
        me.getDataEstudiante()
        $('#btnUpdateDatos').css('display', 'block');
    },
    methods:{
         
         //para cambiar de grupo al estudiante
     
        //para obtener la informacion del estudiante
        getDataEstudiante() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'estudiante/matricula?cedula='+me.usuario.cedula+'&institucion_id='+me.usuario.institucion_idInstitucion)
                .then(function (res) {
                    me.estudiante = res.data[0]

                    me.$vs.loading.close()

                   
                    me.getNivel();
                    me.getEstadoMatricula();
                    me.validarPagosPuntuales();

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        getNivel() {
            let me = this;
           
            let periodo = localStorage.getItem('periodo_id')
            let institucion = me.usuario.institucion_idInstitucion
            let nivel = parseInt(me.estudiante.orden)+1;
            this.$http.get(this.$server_url+'estudiante/matricula?NivelActual='+nivel+'&periodo_id='+periodo+'&institucion_id='+institucion)
                .then(function (res) {
                    if(me.estudiante.update_datos == 1 || me.estudiante.update_datos == 0){
                        if(res.data.message){
                                me.$vs.notify({
                                text: res.data.message,
                                color: 'warning',
                                time:8000,
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                            $('#btnUpdateDatos').css('display', 'none');
                            return false;
                        
                        }
                    }
                        
                     me.nivelactual = res.data[0].nombrenivel
                     me.ordenactual = res.data[0].orden
                     me.valoractual = res.data[0].valor
                     me.fecha_inicio_pension = res.data[0].fecha_inicio_pension
                     me.valor_matricula = res.data[0].matricula
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },
        //para traer el estado de la matricula
        
        getEstadoMatricula() {
            let me = this;
           
            let periodo = localStorage.getItem('periodo_id')
            let idusuario = me.usuario.idusuario
           
            this.$http.get(this.$server_url+'valores/pensiones?periodo_id='+periodo+'&idusuario='+idusuario)
                .then(function (res) {

                    if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                       
                    
                    }
                     me.ifMatriculado = res.data.buscarEstudianteReserva[0].estado_matricula
                    
        
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },

         actualizarData(){

            let me = this;
            
         
            me.estudiante.ordenactual = me.ordenactual;
            me.estudiante.valor = me.valoractual;
            me.estudiante.institucion = me.usuario.institucion_idInstitucion 
            me.estudiante.fecha_inicio_pension = me.fecha_inicio_pension
            me.estudiante.valor_matricula = me.valor_matricula
            me.estudiante.periodo = localStorage.getItem('periodo_id');
              
            me.$vs.loading()
            this.$http.post(this.$server_url+'updateEstudiante', me.estudiante)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getDataEstudiante()
                
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })

        
        },

      
        //ver pensiones
        verPensiones(tr){
            let me = this;
            localStorage.setItem('valor_periodo',tr.periodoescolar_idperiodoescolar)
            localStorage.setItem('valor_institucion',tr.institucion_idInstitucion)
            localStorage.setItem('valor_estudiante',me.estudiante.idusuario)
            
        },

        validarPagosPuntuales(){
            let me = this;
        
            this.$http.get(this.$server_url+'validarPagos?idusuario='+me.usuario.idusuario+'&nivel='+me.estudiante.orden)
                .then(function (res) {
               
                  if(res.data.status == "0"){
                     me.debeEstudiante = res.data.totalDebe[0].debe
                     me.PagosPendientes = true
                  }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                  

                })    
        },


        solicitudReserva(){
                let me = this;
          
            me.estudiante.ordenactual = me.ordenactual;
            me.estudiante.valor = me.valoractual;
            me.estudiante.institucion = me.usuario.institucion_idInstitucion 
            me.estudiante.fecha_inicio_pension = me.fecha_inicio_pension
            me.estudiante.valor_matricula = me.valor_matricula
            me.estudiante.periodo = localStorage.getItem('periodo_id');
            me.estudiante.reserva = "yes";
              
            me.$vs.loading()
            this.$http.post(this.$server_url+'updateEstudiante', me.estudiante)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getDataEstudiante()
                
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },


        reservarMatricula(){
            let me = this;
            me.$vs.loading();


            me.estudiante.ordenactual = me.ordenactual;
            me.estudiante.valor = me.valoractual;
            me.estudiante.institucion = me.usuario.institucion_idInstitucion 
            me.estudiante.fecha_inicio_pension = me.fecha_inicio_pension
            me.estudiante.valor_matricula = me.valor_matricula

        
            this.$http.get(this.$server_url+'LegalizarMatricula?idusuario='+me.usuario.idusuario+'&nivel='+me.estudiante.orden+'&nivelactual='+me.ordenactual+'&institucion='+me.usuario.institucion_idInstitucion)
                .then(function (res) {


                    me.$vs.loading.close()  

                      me.$vs.notify({
                        time:8000,
                        text: res.data.message,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getEstadoMatricula();
                    location.reload()
         


                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },



        getPeriodoInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'institucionTraerPeriodo?institucion_id='+me.usuario.institucion_idInstitucion)
                .then(function (res) { 
                    localStorage.setItem('periodo_id',res.data[0].periodo)  
                    localStorage.setItem('descripcion_periodo',res.data[0].descripcion)  
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },

        
        
           //  cambiarGrupoMatricula(grupo){
        //      let me = this;
             
      
        
        //     this.$http.get(this.$server_url+'cambiarEstadoMatricula?grupo='+grupo+'&idusuario='+me.usuario.idusuario)
        //         .then(function (res) {
                
        //             location.reload();
        //              me.$router.push('/')
        //             localStorage.clear();
            


        //         })
        //         .catch(function (error) {
        //             console.log(error + ' error');
                   

        //         })
        //  },
        
    },
    mounted(){
        let me = this;
     
       
        
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
  ;
  
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