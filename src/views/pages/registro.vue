<template>
    <div class="h-screen flex w-full vx-row no-gutter items-center justify-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card title="Registro del Estudiante">
                <div slot="no-body" class="full-page-bg-color-black">
                    <div class="vx-col sm:w-full md:w-full">
                        <div class="p-8 login-tabs-container">
                            <form-wizard color="rgba(var(--vs-primary), 1)"  :title="null" :subtitle="null"  nextButtonText="Siguiente" backButtonText="Atras" finishButtonText="Enviar" @on-complete="guardar(estudiante)">
                                <tab-content title="Información del estudiante" class="mb-5" icon="feather icon-user">
                                    <!-- tab 1 content -->
                                    <div class="vx-row mb-6">
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <p style="color:red;font-size:10px;">{{cedulaVerificar}}</p>
                                               <vs-input class="w-full" label="Cédula"  @blur="validarDocumento()" icon-pack="feather" icon="icon-code" icon-no-border v-model="estudiante.cedula" />
                                            <span class="text-danger text-sm">{{ errors.cedula }}</span>
                                        </div>
                                    </div>

                                    <div class="vx-row mb-6">
                                        <div class="vx-col sm:w-1/2 w-full">
                                              <vs-input type="email" class="w-full" label="Correo" icon-pack="feather" icon="icon-mail" icon-no-border v-model="estudiante.email"/>
                                            <span class="text-danger text-sm">{{ errors.email }}</span>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input class="w-full" label="Teléfono" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="estudiante.telefono" />
                                        </div>
                                    </div>
                                    
                                    <div class="vx-row mb-6">
                                        <div class="vx-col sm:w-1/2 w-full">
                                        <vs-input class="w-full" label="Nombres" icon-pack="feather" icon="icon-user" icon-no-border v-model="estudiante.nombres" />
                                            <span class="text-danger text-sm">{{ errors.nombres }}</span>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input class="w-full" label="Apellidos" icon-pack="feather" icon="icon-user" icon-no-border v-model="estudiante.apellidos"/>
                                            <span class="text-danger text-sm">{{ errors.apellidos }}</span>
                                        </div>
                                    </div>
                                  
                                 
                                </tab-content>

                                <!-- tab 2 content -->
                                <tab-content title="Región" class="mb-5" icon="feather icon-map">
                                    <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                        <div class="vx-col w-full">
                                            <span>Región</span>
                                            <ul class="demo-alignment">
                                                <li>
                                                    <vs-radio @input="getInstitucion()" v-model="idregion" vs-value="2">Costa</vs-radio>
                                                </li>
                                                <li>
                                                    <vs-radio @input="getInstitucion()" v-model="idregion" vs-value="1">Sierra</vs-radio>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                        <div class="vx-col w-full">
                                            <span>Ciudad</span>
                                            <v-select :options="ciudad" @input="getInstitucion()" :reduce="ciudad => ciudad.idciudad" label="nombre" v-model="idciudad"></v-select>
                                        </div>
                                    </div>
                                </tab-content>

                                <!-- tab 3 content -->
                                <tab-content title="Institución" class="mb-5" icon="feather icon-home">
                                    <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                        <div class="vx-col sm:w-1/3 w-full">
                                            <span>Institución</span>
                                        </div>
                                        <div class="vx-col sm:w-2/3 w-full">
                                            <v-select :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="estudiante.idinstitucion"></v-select>
                                            <span class="text-danger text-sm">{{ errors.institucion }}</span>
                                        </div>
                                    </div>
                                    <div class="vx-row mb-4" v-if="registroEvaluacion==false">
                                        <div class="vx-col sm:w-1/3 w-full">
                                            <span>Paralelo</span>
                                        </div>
                                        <div class="vx-col sm:w-2/3 w-full">
                                       
                                           <v-select id="paralelo" :options="paralelos" :reduce="paralelos => paralelos" label="descripcion" class="w-full" v-model="estudiante.paralelo" />
                                            <div style="margin-top:10px;display: flex;">
                                                 <vs-radio v-model="p_otro" @input="cambiarParalelo(1)" vs-name="radios1" vs-value="paralelo">Paralelo</vs-radio>
                                                  <vs-radio v-model="p_otro" @input="cambiarParalelo(2)" style="margin-left:10px;" vs-name="radios1" vs-value="otro">Otro</vs-radio>
                                            </div>
                                            
                                            <!-- <vs-input class="w-full" v-model="estudiante.paralelo" /> -->
                                            <span class="text-danger text-sm">{{ errors.paralelo }}</span>
                                        </div>
                                    </div>
                                 
                                    <div class="vx-row mb-6" v-if="registroEvaluacion==false" style="margin-top:10px;">
                                        <div class="vx-col sm:w-1/3 w-full">
                                            <span>Grado</span>
                                        </div>
                                        <div class="vx-col sm:w-2/3 w-full">
                                       
                                            <v-select :options="cursos" :reduce="cursos => cursos" label="nombrenivel" class="w-full" v-model="estudiante.grado" />
                                            <!-- <vs-input min="0" type="text" class="w-full" v-model="estudiante.grado" /> -->
                                            <span class="text-danger text-sm">{{ errors.grado }}</span>
                                        </div>
                                    </div>
                                </tab-content>
                            </form-wizard>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>
<script>
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import Vue from 'vue'
    import axios from 'axios'
    import "vue-select/dist/vue-select.css";
    import vSelect from "vue-select";
    Vue.use(axios)
    Vue.component("v-select", vSelect);
    import $ from 'jquery'
    export default {
    data() {
        return {
            p_otro:'paralelo',
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
            paralelos:[],
            cursos:[],
        }
    },

    mounted() {
            this.linkEvaluacion = localStorage.getItem('evaluacionxLink')

            if (this.linkEvaluacion != '' && this.linkEvaluacion != null) {
                this.registroEvaluacion = true
                this.vectorLink = (this.linkEvaluacion).split('-')
            }
            this.infoRegistro()
            this.getCiudadSelect();
            this.getInstitucion();
            if (localStorage.tk != null) {
                this.$router.push('/home');
            } else {}
        },
        methods: {
            cambiarParalelo(estado){
                if(estado == 1){
                    $('#paralelo').css('display', 'block');
                }else{
                    $('#paralelo').css('display', 'none').css('margin-top','20px');
                }
            },
            //para obtener el listado de las areas
            infoRegistro() {
                let me = this;
                this.$http.get(this.$server_url+'infoRegistro')
                    .then(function (res) {
                        me.paralelos = res.data.paralelos
                        me.cursos = res.data.cursos  

                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        m

                    })
            },

            formSubmitted() {
                alert("Form submitted!");
            },

            guardar(item) {
                
                let me = this
                if(me.p_otro == 'paralelo'){
                    if(item.paralelo.paralelo_id == undefined || item.paralelo.paralelo_id == null || item.paralelo.paralelo_id == ""){
                        me.$vs.notify({
                                text: "Paralelo es obligatorio" ,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time:4000
                            }) 
                        return false;        
                    }

                }

                    
                if(item.grado.orden == undefined || item.grado.orden == null || item.grado.orden == "" ){
                    me.$vs.notify({
                            text: "Paralelo es obligatorio" ,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time:4000
                        })     
                    return false;   
                }
                
                if(me.validacionCedula){
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
                        let paraveloEval = item.paralelo.paralelo_id;
                        let gradoEval = item.grado.orden;
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
                        formData.append('institucion', institucionID)
                        // formData.append('password', item.password)
                        if(me.p_otro == 'paralelo'){
                            formData.append('paralelo',  item.paralelo.paralelo_id)     
                        }else{
                        formData.append('paralelo',  "otro")
                        }
                
                        formData.append('grado',  item.grado.orden)
                        me.$vs.loading();
                        this.$http.post(this.$server_url+"register", formData)
                            .then(function (response) {
                                me.$vs.loading.close()
                                // localStorage.tk = response.data.token
                                // localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                                me.$vs.notify({
                                    text: 'Usuario guardado',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-user'
                                })
                                me.$router.push('/');
                            })
                            .catch(function (error) {
                                me.$vs.loading.close()
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
                                                text: error.response.data.errors.nombres[0] ,
                                                color: 'warning',
                                                iconPack: 'feather',
                                                icon: 'icon-check',
                                                time:8000
                                        })  
                                        // me.errors.nombres = error.response.data.errors.nombres[0]
                                    } catch (error) {

                                    }
                                    try {
                                        me.$vs.notify({
                                                text: error.response.data.errors.apellidos[0] ,
                                                color: 'warning',
                                                iconPack: 'feather',
                                                icon: 'icon-check',
                                                time:8000
                                        })  
                                        // me.errors.apellidos = error.response.data.errors.apellidos[0]
                                    } catch (error) {

                                    }
                                    try {
                                        me.$vs.notify({
                                                text: error.response.data.errors.email[0] ,
                                                color: 'warning',
                                                iconPack: 'feather',
                                                icon: 'icon-check',
                                                time:8000
                                        })  
                                        // me.errors.email = error.response.data.errors.email[0]
                                    } catch (error) {

                                    }
                                    try {
                                        me.$vs.notify({
                                                text: error.response.data.errors.institucion[0] ,
                                                color: 'warning',
                                                iconPack: 'feather',
                                                icon: 'icon-check',
                                                time:8000
                                        })  
                                        // me.errors.institucion = error.response.data.errors.institucion[0]
                                    } catch (error) {

                                    }
                                    try {
                                        me.$vs.notify({
                                                text: error.response.data.errors.paralelo[0] ,
                                                color: 'warning',
                                                iconPack: 'feather',
                                                icon: 'icon-check',
                                                time:8000
                                        })  
                                        // me.errors.paralelo = error.response.data.errors.paralelo[0]
                                    } catch (error) {

                                    }
                                    // try {
                                    //     me.errors.password = error.response.data.errors.password[0]
                                    // } catch (error) {

                                // }
                                    try {
                                        me.$vs.notify({
                                                text: error.response.data.errors.grado[0] ,
                                                color: 'warning',
                                                iconPack: 'feather',
                                                icon: 'icon-check',
                                                time:8000
                                        })  
                                        // me.errors.grado = error.response.data.errors.grado[0]
                                    } catch (error) {

                                    }
                                }
                            })
                }else{
                    
                    me.$vs.notify({
                            text: 'La cedula es incorrecta',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time:4000
                    })  
                    me.cedulaVerificar = "Cedula Invalida";
                
                    return false;
                }
            
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
    }        


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
