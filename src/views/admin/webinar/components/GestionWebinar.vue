<template>
    <div>
   
        <div style="display:flex;justify-content: center;padding: 10px 10px 20px 10px;">
            <div>
                <vs-button type="relief" icon="settings" @click="estadoWebinar = 'registro';tipoWebinar = '1';getSeminarios();">Registro eventos </vs-button>
            </div>
            <div style="margin-left:20px;">
                 <vs-button color="success" type="relief" icon="calendar_today"  @click="estadoWebinar = 'mantenimiento';menu()">Mis eventos</vs-button>
            </div>    
        </div>
    
        <!--VISTA DE REGISTRO DE WEBINAR-->
        <div  v-if="estadoWebinar == 'registro'" style="display: flex;width: 100%;justify-content: center;">               
            <vx-card title="Registro del evento" style="margin-top: 20px;width: 80%;">
                <div slot="no-body" class="full-page-bg-color-black">
                    <div class="vx-col sm:w-full md:w-full">
                        <div class="p-8 login-tabs-container">
                            <vs-alert active="true" >
                                Desea  participar en otro evento, por favor seleccione de la lista inferior
                            </vs-alert>
                                <br/>                                         
                            <div class="vx-row mb-6"  v-if="registroEvaluacion==false">
                                <div style="width: 97%;margin-left:15px;margin-top:10px;">
                                    <p style="color:red;font-size:10px;">{{cedulaVerificar}}</p>
                                    <vs-input class="w-full" style="padding-bottom: 10px;" label="Cédula" disabled icon-pack="feather" icon="icon-code" icon-no-border v-model="estudiante.cedula" />  
                                    <span class="text-success text-sm" style="margin-top:20px;font-weight: 600;">Usuario : {{ user[0].nombres }} {{ user[0].apellidos }}</span>
                                </div>
                            </div> 
                            <div v-if="registroEvaluacion==false">
                                <vs-row>
                                    <vs-col  vs-type="flex" vs-justify="left" vs-align="center" vs-w="12">
                                        <span>Seleccione el webinar</span>
                                        <ul class="flex">
                                            <li>
                                            <vs-radio v-model="tipoWebinar" class="ml-2" @input="getSeminarios();" vs-name="radiosTipo" vs-value="1">Webinar</vs-radio>
                                            </li>
                                            <li>
                                            <vs-radio v-model="tipoWebinar" class="ml-2" @input="getSeminarios();" vs-name="radiosTipo" vs-value="2">Capacitación</vs-radio>
                                            </li>
                                        </ul>
                                    </vs-col>
                                </vs-row>
                                <br/>
                                <vs-row>
                                    <vs-col  vs-type="flex" vs-justify="left" vs-align="center" vs-w="12">
                                            <v-select :options="seminarios" :reduce="seminarios => seminarios" label="webinar" class="w-full" v-model="estudiante.seminario" />
                                        <span class="text-danger text-sm">{{ errors.seminario }}</span>
                                    </vs-col>
                                </vs-row>
                            </div>
                                <br/><br/><br/><br/>
                                <br/><br/><br/><br/> 
                            <vs-button type="relief" @click="guardar(estudiante)">Enviar</vs-button> 
                        </div>
                    </div>
                </div>
            </vx-card>     
        </div>
        <!--VISTA DE REGISTRO DE MIS WEBINARS -->
        <div v-if="estadoWebinar == 'mantenimiento'">  
            <vx-card class="w-full">
                <vs-table stripe pagination max-items="5" search :data="mis_seminarios">
                    <template slot="header">
                        <vs-chip color="primary">Cantidad: {{mis_seminarios.length}}</vs-chip>
                        <ul class="flex ml-3">
                            <li>
                            <vs-radio v-model="tipoWebinar"  @input="getMisSeminarios()" vs-name="radioMisEventos" vs-value="1">Mis webinars</vs-radio>
                            </li>
                            <li>
                            <vs-radio v-model="tipoWebinar" @input="getMisSeminarios()" class="ml-2" vs-name="radioMisEventos" vs-value="2">Mis capacitaciones</vs-radio>
                            </li> 
                        </ul>
                    </template>
                    <template slot="thead">
                        <vs-th style="width: 60px;">#</vs-th>
                        <vs-th sort-key="nombre">{{ tituloTipo }}</vs-th>               
                        <vs-th>Link reunión</vs-th>
                        <vs-th>Asistencia</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>                          
                            {{indextr+1}} 
                            </vs-td>
                        <vs-td> {{tr.nombre}} <br> {{tr.descripcion}} <br> ({{ tr.institucionFinal }}) </vs-td>               
                        <vs-td>
                            <a :href="tr.link_reunion" target="_blank"> {{tr.link_reunion}}
                            </a>
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.asistencia == '1'">
                                <vs-chip color="success">
                                    asistió
                                </vs-chip>                          
                            </div>
                            <div v-else>
                                <vs-chip color="danger">
                                    No asistió
                                </vs-chip>
                            </div>
                        </vs-td>
                        <vs-td align="center">
                            <div style="display:flex;">                         
                                <div v-if="tr.asistencia == '0'">
                                    <div v-if="tr.asistencia_activa == '1'">
                                        <vx-tooltip v-if="tr.respuestas == null" style="display: inline-block;"  text="Registrar asistencia" position="top" color="primary">
                                            <vs-button size="large" radius icon-pack="feather" icon="icon-thumbs-up"  @click="openConfirm(tr)" color="success" type="line"></vs-button>
                                        </vx-tooltip>
                                    </div>
                                </div>                          
                                <div v-if="tr.asistencia == '1'">                                
                                    <vx-tooltip v-if="tr.respuestas == null" style="display: inline-block;" text="Responder encuesta" position="top" color="primary">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-file-text" @click="irEncuesta(tr)" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                </div>
                                <vx-tooltip v-if="tr.respuestas == null" style="display: inline-block;" text="Ir al seminario." position="top" color="success">
                                    <vs-button size="large" radius icon-pack="feather" icon="icon-video" @click="irSeminario(tr)" color="success" type="line"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip v-if="tr.respuestas" style="display: inline-block;" text="Descargar certificado" position="top" color="warning">
                                    <vs-button size="large" radius icon-pack="feather" icon="icon-printer" @click="descargarCertificado(tr)" color="warning" type="line"></vs-button>
                                </vx-tooltip>
                            </div>                           
                        </vs-td>
                    </vs-tr>
                    </template>
                </vs-table>
            </vx-card>
        </div>
    </div>   
</template>
<script type="text/javascript">
</script>
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
  data() {
    return {
        estadoWebinar:'registro',
        user:[],
        cedulaExiste:1,
        estadoInstitucion:'0',
        documento:"",
        cedulaVerificar:"",
      firstName: "",
        email: "",
        // password: "",
        checkbox_remember_me: false,
        errors: {
            cedula: '',
            nombres: '',
            apellidos: '',
            email: '',
            // password: '',
            paralelo: '',
            grado: '',
        },
        ciudad: [],
        institucion: [],
        instituciones: [],
        idregion: '',
        idciudad: '',
        estudiante: {
            cedula: '',
            nombres: '',
            apellidos: '',
            email: '',
            idinstitucion: '',
            // password: '',
            paralelo: '',
            grado: '',
        },
        linkEvaluacion: '',
        vectorLink: '',
        registroEvaluacion: false,
        numero:'',
        validacionCedula:false,
        seminarios:[],
        //VARIABLES PARA MIS WEBINAR
        mis_seminarios: [],
        id_seminario: '',
        seminario_has_usuario_id:0,
        //VARIABLES PARA CAPACITACION
        tipoWebinar:'1',
        tituloTipo:'',
        estado_institucion_temporal:0,
    }
  },
  created(){
      let me = this;
       me.user = JSON.parse(localStorage.getItem("userWebinar"))
       me.estado_institucion_temporal = me.user[0].estado_institucion_temporal
       me.estudiante.cedula = me.user[0].cedula
       if(localStorage.getItem("estadoWebinar") == "mantenimiento"){
           me.estadoWebinar = "mantenimiento"
       }
       if(localStorage.getItem("tipoWebinar") == "2"){
           me.tipoWebinar = "2"
       }
        if(localStorage.getItem("tipoWebinar") == "1"){
           me.tipoWebinar = "1"
       }
  },
  mounted() {
        let me = this;
        me.getSeminarios();
        this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
        if (this.linkEvaluacion != '' && this.linkEvaluacion != null) {
            this.registroEvaluacion = true
            this.vectorLink = (this.linkEvaluacion).split('-')
        }
        this.getCiudadSelect();
        this.getInstitucion();
        this.getMisSeminarios()
        if (localStorage.tk != null) {
            this.$router.push('/home');
        } else {}
    },
    methods: {
        menu(){
            let me = this;
            if(me.estadoWebinar = "mantenimiento"){
                localStorage.setItem('estadoWebinar',me.estadoWebinar)
            }else{
                localStorage.setItem('estadoWebinar',me.estadoWebinar)
            }
        },
        formSubmitted() {
            alert("Form submitted!");
        },
        guardar(item) { 
            let me = this
            me.cedulaVerificar = "";
            let formData = new FormData();
            me.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                idinstitucion: '',
                // password: '',
                paralelo: '',
                grado: '',
            }
            let institucionID = item.idinstitucion;
            let paraveloEval = item.paralelo;
            let gradoEval = item.grado;
            if (me.registroEvaluacion === true) {
                institucionID = me.vectorLink[2]
                paraveloEval = '-'
                gradoEval = '-'
            }
            formData.append('cedula', item.cedula)
            formData.append('nombres', item.nombres)
            formData.append('apellidos', item.apellidos)
            formData.append('email', item.email)
            formData.append('name_usuario', item.email)
            formData.append('cedulaExiste', me.cedulaExiste)
            if(me.estadoInstitucion == '0'){
                formData.append('institucion', institucionID)
            }else{
                formData.append('institucion_nombre', item.institucion_nombre)
            }
            formData.append('seminario', item.seminario.id_seminario)
            this.$http.post(this.$server_url+"register", formData)
                .then(function (response) {
                    if(response.data.message){
                        me.$vs.notify({
                        text: response.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                        return false;
                    }
                    else{
                        me.$vs.notify({
                        text: 'Webinar  asignado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                        me.estadoWebinar = "mantenimiento"
                        me.getMisSeminarios();         
                    } 
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        try {
                                me.$vs.notify({
                                    text: error.response.data.errors.cedula[0] ,
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time:8000
                            })     
                            // me.errors.cedula = error.response.data.errors.cedula[0]
                        } catch (error) {

                        }
                        try {
                            me.$vs.notify({
                                text: error.response.data.errors.seminario[0] ,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time:8000
                            })  
                            // me.errors.institucion = error.response.data.errors.institucion[0]
                        } catch (error) {

                        }
                    }
                })
        },
        getInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url+"ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },

        getSeminarios() {
            let me = this;
            me.seminarios = []
            //para traer los webinars
            if(me.tipoWebinar == 1){
                me.$vs.loading()
                this.$http.get(this.$server_url+'obtenerWebinars')
                .then(function (res) {
                    me.$vs.loading.close()
                    me.seminarios = res.data
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            //para traer las capacitaciones
            }else{
                 if(me.estado_institucion_temporal == 1){
                    me.$vs.loading()
                    this.$http.get(this.$server_url+'obtenerWebinars?capacitaciones=yes')
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.seminarios = res.data
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
                }else{     
                    me.$vs.loading()
                    this.$http.get(this.$server_url+'obtenerWebinars?capacitacionInstitucion=yes'+'&institucion_id='+me.user[0].institucion_idInstitucion)
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.seminarios = res.data
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
                }
             
            } 

            
        },
        //VALIDACION CEDULA
        validarDocumento () {          
            let me = this;
            me.numero = me.estudiante.cedula;
            var suma = 0;      
            var residuo = 0;      
            var pri = false;      
            var pub = false;            
            var nat = false;      
            var numeroProvincias = 22;                  
            var modulo = 11;
            var d1 = null;
            var d2 = null;
            var d3 = null;
            var d4 = null;
            var d5 = null;
            var d6 = null;
            var d7 = null;
            var d8 = null;
            var d9 = null;
            var d10 = null;  
            
            var    p1 = null;
            var    p2 = null;
            var    p3 = null;
            var    p4 = null;
            var    p5 = null;
            var    p6 = null;
            var    p7 = null;
            var    p8 = null;
            var    p9 = null;   
            var digitoVerificador  = null;
            var suma    = null;
            var residuo = null;
            var modulo  = null;
            var pub     = null;
            var pri     = null;
            var nat     = null;
                        
            /* Verifico que el campo no contenga letras */                  
            var ok=1;
            let i =0;
            for (i=0; i<me.numero.length && ok==1 ; i++){
                var n = parseInt(this.numero.charAt(i));
                if (isNaN(n)) ok=0;
            }
            if (ok==0){
               
                 me.$vs.notify({
                        text: 'No puede ingresar caracteres a la cedula',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                 })     
                me.validacionCedula = false; 
                return false;
            }
                        
            if (me.numero.length < 10 ){         
                  me.$vs.notify({
                        text: 'La cedula ingresada no es válida',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                 })       
                me.validacionCedula = false;             
                return false;
            }

            me.cedulaVerificar = "";
            
            let provincia = null;
            /* Los primeros dos digitos corresponden al codigo de la provincia */
            provincia = me.numero.substr(0,2);      
            if (provincia < 1 || provincia > me.numeroProvincias){   
                  me.$vs.notify({
                        text: 'El código de la provincia (dos primeros dígitos) es inválido',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                 })         
                me.validacionCedula = false; 
                return false;       
            }

            /* Aqui almacenamos los digitos de la cedula en variables. */
            d1  = me.numero.substr(0,1);         
            d2  = me.numero.substr(1,1);         
            d3  = me.numero.substr(2,1);         
            d4  = me.numero.substr(3,1);         
            d5  = me.numero.substr(4,1);         
            d6  = me.numero.substr(5,1);         
            d7  = me.numero.substr(6,1);         
            d8  = me.numero.substr(7,1);         
            d9  = me.numero.substr(8,1);         
            d10 = me.numero.substr(9,1);                
                
            /* El tercer digito es: */                           
            /* 9 para sociedades privadas y extranjeros   */         
            /* 6 para sociedades publicas */         
            /* menor que 6 (0,1,2,3,4,5) para personas naturales */ 

            if (d3==7 || d3==8){   
                 me.$vs.notify({
                        text: 'El tercer dígito ingresado es inválido',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                 })         
                me.validacionCedula = false;                  
                return false;
            }         
                
            /* Solo para personas naturales (modulo 10) */         
            if (d3 < 6){           
                nat = true;            
                p1 = d1 * 2;  if (p1 >= 10) p1 -= 9;
                p2 = d2 * 1;  if (p2 >= 10) p2 -= 9;
                p3 = d3 * 2;  if (p3 >= 10) p3 -= 9;
                p4 = d4 * 1;  if (p4 >= 10) p4 -= 9;
                p5 = d5 * 2;  if (p5 >= 10) p5 -= 9;
                p6 = d6 * 1;  if (p6 >= 10) p6 -= 9; 
                p7 = d7 * 2;  if (p7 >= 10) p7 -= 9;
                p8 = d8 * 1;  if (p8 >= 10) p8 -= 9;
                p9 = d9 * 2;  if (p9 >= 10) p9 -= 9;             
                modulo = 10;
            }         

            /* Solo para sociedades publicas (modulo 11) */                  
            /* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
            else if(d3 == 6){           
                pub = true;             
                p1 = d1 * 3;
                p2 = d2 * 2;
                p3 = d3 * 7;
                p4 = d4 * 6;
                p5 = d5 * 5;
                p6 = d6 * 4;
                p7 = d7 * 3;
                p8 = d8 * 2;            
                p9 = 0;            
            }            
            /* Solo para entidades privadas (modulo 11) */         
            else if(d3 == 9) {           
                pri = true;                                   
                p1 = d1 * 4;
                p2 = d2 * 3;
                p3 = d3 * 2;
                p4 = d4 * 7;
                p5 = d5 * 6;
                p6 = d6 * 5;
                p7 = d7 * 4;
                p8 = d8 * 3;
                p9 = d9 * 2;            
            }
                        
            suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;                
            residuo = suma % modulo;                                         

            /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
            digitoVerificador = residuo==0 ? 0: modulo - residuo;                

            /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/                         
            if (pub==true){           
                if (digitoVerificador != d9){                   
                    me.$vs.notify({
                        text: 'El ruc de la empresa del sector público es incorrecto.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                    })         
                    
                    me.validacionCedula = false; 
                    return false;
                }                  
                /* El ruc de las empresas del sector publico terminan con 0001*/         
                if ( me.numero.substr(9,4) != '0001' ){      
                      me.$vs.notify({
                        text: 'El ruc de la empresa del sector público debe terminar con 0001.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                    })                
                    me.validacionCedula = false; 
                    return false;
                }
            }         
            else if(pri == true){         
                if (digitoVerificador != d10){    
                      me.$vs.notify({
                        text: 'El ruc de la empresa del sector privado es incorrecto.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                    })                         
                    me.validacionCedula = false;  
                    return false;
                }         
                if ( me.numero.substr(10,3) != '001' ){ 
                    me.$vs.notify({
                        text: 'El ruc de la empresa del sector privado debe terminar con 001',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                    })                       
                    
                    me.validacionCedula = false; 
                    return false;
                }
            }      
            else if(nat == true){         
                if (digitoVerificador != d10){  
                     me.$vs.notify({
                        text: 'El número de cédula de la persona natural es incorrecto.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                    })                           
                    
                    me.validacionCedula = false; 
                    return false;
                }         
                if (me.numero.length >10 && me.numero.substr(10,3) != '001' ){  
                     me.$vs.notify({
                        text: 'El ruc de la persona natural debe terminar con 001',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000
                    })                     
                    
                    me.validacionCedula = false; 
                    return false;
                 }
      }   
      me.validacionCedula = true;    
      return true;   
   } ,
   
//metodos para MIS WEBINAR
    getMisSeminarios() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'get_webinars?idusuario='+me.user[0].idusuario)
            .then(function (res) {
                me.$vs.loading.close()
                let datos = res.data
                if(me.tipoWebinar == 1){
                    localStorage.setItem('tipoWebinar','1')
                    me.tituloTipo = "Webinar"
                    me.mis_seminarios = datos.filter(p => p.tipo_webinar == "1")
                }else{
                    localStorage.setItem('tipoWebinar','2')
                    me.tituloTipo = "Capacitación"
                    me.mis_seminarios = datos.filter(p => p.tipo_webinar == "2")
                } 
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
         openConfirm(tr){
              let me = this;
                me.seminario_has_usuario_id = tr.seminario_has_usuario_id
                this.$vs.dialog({
                    acceptText:'Si, asistí a'+me.tituloTipo,
                    cancelText:'Cancelar',
                    type:'confirm',
                    color: 'warning',
                    title: `Tomar Asistencia`,
                    text: 'Estas seguro de registrar la asistencia?',
                    accept:this.RegistrarAsistencia
                })
            },

        RegistrarAsistencia(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'webinarAsistencia?seminario_has_usuario_id='+me.seminario_has_usuario_id)
                .then(function (res) {
                    me.estudiante = res.data[0]

                    me.$vs.loading.close()
                     if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.getMisSeminarios();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        irEncuesta(item){
            let me = this
            localStorage.data_seminario = JSON.stringify(item);
            localStorage.setItem('estadoWebinar','mantenimiento')
            me.$router.push('/webinar/encuesta')
        },
        irSeminario(item){
            let me = this
            // validar horario permitido con js, href _blank
            window.open(item.link_reunion, '_blank');
        },
        descargarCertificado(item){
            let me = this
            me.ContarCertificados(item.id_seminario,item.usuario_id)
            localStorage.data_seminario = JSON.stringify(item);
            window.open('/webinar/certificado', '_blank');
            // validar respuestas en respuestas_seminairos y permitir descarga con datos del docente y seminario seleccionado
        },

        ContarCertificados(webinar,usuario) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'sumarEncuestasDescargadas?seminario_id='+webinar+'&usuario_id='+usuario)
                .then(function (res) {
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
    },
    components: {
        FormWizard,
        TabContent
    }
}
</script>

<style lang="scss">
#page-login {
    height: 100vh;
    // background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
    background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
    // background-image: linear-gradient(to top, #dad4ec 0%, #dad4ec 1%, #f3e7e9 100%);
}
</style>
