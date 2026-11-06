<template>
    <div style=" padding:10px;border-radius:10px;">
        <div class="h-screen w-full x-row no-gutter   justify-center"  style="margin-left:20%;min-height: 850px;">
            <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4" style="min-height: 850px;">
                <vx-card title="Registro del Webinar"  style="margin-top: 20px; min-height: 850px;">
                    <div slot="no-body" class="full-page-bg-color-black">
                        <div class="vx-col sm:w-full md:w-full">
                            <div class="p-8 login-tabs-container">
                                <!-- tab 1 content -->
                                <div class="vx-row mb-6">
                                    <div class="vx-col sm:w-1/2 w-full">
                                    </div>
                                </div>        
                                <div class="vx-row mb-6"  v-if="registroEvaluacion==false">
                                    <div style="width: 97%;margin-left:15px;">
                                        <p style="color:red;font-size:10px;">{{cedulaVerificar}}</p>
                                        <vs-input class="w-full" label="Cédula"  @blur="validarDocumento();verificarExistenciaCedula()" icon-pack="feather" icon="icon-code" icon-no-border v-model="estudiante.cedula" />
                                        <span class="text-danger text-sm">{{ errors.cedula }}</span>
                                    </div>
                                </div> 
                                <div v-if="cedulaExiste == 0">
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
                                    <!-- tab 2 content -->
                                    <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                        <div class="vx-col w-full">
                                            <span>Región</span>
                                            <ul class="demo-alignment">
                                            
                                                <li>
                                                    <vs-radio @input="getInstitucion();institucionesTemporales();" v-model="idregion" vs-value="2">Costa</vs-radio>
                                                </li>
                                                <li>
                                                    <vs-radio @input="getInstitucion();institucionesTemporales();" v-model="idregion" vs-value="1">Sierra</vs-radio>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                        <div class="vx-col w-full">
                                            <span>Ciudad</span>
                                        
                                            <v-select :options="ciudad" @input="getInstitucion()" :reduce="ciudad => ciudad" label="nombre" v-model="idciudad"></v-select>
                                        </div>
                                    </div>
                                    <!-- tab 3 content -->
                                    <ul class="leftx" style="display:flex;">
                                        <li>
                                        <vs-radio v-model="estadoInstitucion" vs-name="radios1" @input="estado_institucion_temporal = 0;getSeminarios();"  vs-value="0">Institución</vs-radio>
                                        </li>
                                        <li>
                                        <vs-radio v-model="estadoInstitucion" style="margin-left:20px;" @input="estado_institucion_temporal = 1;getSeminarios();" vs-name="radios1" vs-value="1">Otra Institución</vs-radio>
                                        </li>    
                                    </ul>
                                    <br/>
                                    <template v-if="estadoInstitucion == '0'">
                                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                            <div class="vx-col sm:w-1/3 w-full">
                                                <span>Institución</span>
                                            </div>
                                            <div class="vx-col sm:w-2/3 w-full">
                                                <v-select :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="estudiante.idinstitucion"></v-select>
                                                <span class="text-danger text-sm">{{ errors.institucion }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                                            <div class="vx-col sm:w-1/3 w-full">
                                                <span>Institución Temporal</span>
                                            </div>
                                            <div class="vx-col sm:w-2/3 w-full">
                                                <v-select :options="institucionesTemporal" :reduce="institucionesTemporal => institucionesTemporal" label="nombreInstitucion" v-model="estudiante.institucion_temporal_id"></v-select>
                                                <vx-tooltip style="display: inline-block;" text="Verifique que su institucion conste antes de crear una nueva" position="top" color="primary">
                                                    <vs-button size="small" class="mt-2" @click="modalNuevaInstitucion()" type="relief">Añadir nueva institución
                                                    </vs-button>
                                                </vx-tooltip>
                                            </div>
                                        </div>
                                    </template>
                                </div> 
                                <vs-row vs-w="12">
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" >
                                       <ul class="flex">
                                            <li>
                                                <span>Seleccione</span>
                                            </li>
                                            <li>
                                            <vs-radio v-model="tipoWebinar" class="ml-2" @input="getSeminarios();" vs-name="radiosTipo" vs-value="1">Webinar</vs-radio>
                                            </li>
                                            <li>
                                            <vs-radio v-model="tipoWebinar" class="ml-2" @input="getSeminarios();" vs-name="radiosTipo" vs-value="2">Capacitación</vs-radio>
                                            </li>
                                        </ul>
                                    </vs-col>
                                    <br/>
                                </vs-row>
                                <vs-row vs-w="12" class="mt-2">
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                                        <v-select :options="seminarios" :reduce="seminarios => seminarios" label="webinar" class="w-full" v-model="estudiante.seminario" />
                                        <span class="text-danger text-sm">{{ errors.seminario }}</span>   
                                    </vs-col>
                                </vs-row>
                                <vs-button type="relief" @click="guardar(estudiante)" class="mt-5">Enviar</vs-button>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
         <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->
        <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución" :active.sync="popupAddNuevaInstitucion">
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="vx-col w-full mt-5">
                        Seleccione una ciudad:
                        <v-select :options="ciudad" disabled :reduce="ciudad => ciudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                    </div>
                </vs-col>
            </vs-row>
            <vs-row class="mt-3">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-input label="Escriba un nombre para la institución" class="w-full text-danger" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-3">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <ul class="leftx" style="display:flex;flex-direction: row;">
                        <li class="ml-2">
                            <vs-radio disabled v-model="temporalInstitucion.region" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                        </li>
                        <li class="ml-2">
                            <vs-radio disabled v-model="temporalInstitucion.region" vs-name="radios1" vs-value="2">Costa</vs-radio>
                        </li>
                    </ul>
                </vs-col>
            </vs-row>
            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="agregarInstitucionTemporal();error = false" type="gradient">Agregar Institución</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
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
        mensajeEnviar:'Enviar',
        cedulaExiste:0,
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
            institucion_temporal_id:'',
        },
        linkEvaluacion: '',
        vectorLink: '',
        registroEvaluacion: false,
        numero:'',
        validacionCedula:false,
        seminarios:[],
        tipoWebinar:'1',
        usuarioGet:[],
        seleccionadoInsitucion: false,
        institucionesTemporal:[],
        ciudadSelect: '',
        popupAddNuevaInstitucion: false,
        temporalInstitucion:{
            ciudad:'',
            region:'',
            nombre_institucion:'',
        },
        estado_institucion_temporal:0,
    }
  },

  mounted() {
        let me = this;
        // me.getSeminarios();
        this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
        if (this.linkEvaluacion != '' && this.linkEvaluacion != null) {
            this.registroEvaluacion = true
            this.vectorLink = (this.linkEvaluacion).split('-')
        }
        this.getCiudadSelect();
        this.getInstitucion();
        if (localStorage.tk != null) {
            this.$router.push('/home');
        } else {}
    },
        methods: {
        modalNuevaInstitucion(){
            let me = this;
            if(me.idciudad.nombre == "" || me.idciudad.nombre == null || me.idciudad.nombre == undefined){
                me.$vs.notify({
                text:'Seleccione una ciudad y una region para filtrar',
                color:'primary',
                time:4000,
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.popupAddNuevaInstitucion = true;
            me.temporalInstitucion.ciudad = {idciudad:me.idciudad.idciudad, nombre:me.idciudad.nombre};
            me.temporalInstitucion.region = me.idregion
        },
        verificarExistenciaCedula(){
            let me = this;
            me.mensajeEnviar = "Enviar";
            this.$http.get(this.$server_url+'verificarCedula?cedula=' + me.estudiante.cedula)
                .then(function (response) {
                    me.cedulaExiste = response.data.status;
                    if(me.cedulaExiste == 1){
                        me.$vs.notify({
                        text:'Su cedula ya existe inicie sesión',
                        color:'primary',
                        time:4000,
                        iconPack: 'feather',
                        icon:'icon-check'})
                        me.mensajeEnviar = "Iniciar sesión"
                    }
                })
                .catch(function (error) {})
        },
        formSubmitted() {
            alert("Form submitted!");
        },
        login(){
            let me = this;
            this.$http.get(this.$server_url+'verificarCedula?cedula=' + me.estudiante.cedula)
                .then(function (response) {
                    me.cedulaExiste = response.data.status;
                    if(me.cedulaExiste == 1){
                        localStorage.setItem('userWebinar', JSON.stringify(response.data.usuario));
                        me.$vs.notify({
                        text:'Usuario encontrado usted sera logeado',
                        color:'primary',
                        time:4000,
                        iconPack: 'feather',
                        icon:'icon-check'})
                        location.reload()
                    }
                     if(me.cedulaExiste == 0){
                          me.$vs.notify({
                            text:'Usuario no encontrado prosiga a registrarse',
                            color:'primary',
                            time:4000,
                            iconPack: 'feather',
                            icon:'icon-check'})
                     }
                })
                .catch(function (error) {})
        },
        guardar(item) { 
            let me = this
            if(me.cedulaExiste == 1){
                me.login();
                return false;
            } 
            if(me.estudiante.seminario == "" ||  me.estudiante.seminario == null  || me.estudiante.seminario == undefined ){
                me.$vs.notify({
                        text: 'Seleccione un seminario',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-user'
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
                if(me.estado_institucion_temporal == '0'){
                    formData.append('institucion', institucionID)
                }else{
                    formData.append('institucion_temporal_id', item.institucion_temporal_id.institucion_temporal_id)
                    formData.append('nombre_institucion_temporal',item.institucion_temporal_id.nombre_institucion)
                    formData.append('estado_institucion_temporal',me.estado_institucion_temporal)
                    formData.append('otraInstitucion','yes')
                }
                // formData.append('password', item.password)
                formData.append('seminario', item.seminario.id_seminario)
                this.$http.post(this.$server_url+"register", formData)
                    .then(function (response) {
                        console.log(response.data)
                        me.$vs.notify({
                            text: 'Webinar  asignado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                        let usuario = response.data.data
                        me.usuarioGet.push(usuario)
                        localStorage.setItem('userWebinar', JSON.stringify(me.usuarioGet));
                        location.reload();
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
                                        text: error.response.data.errors.seminario[0] ,
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
                                        text: error.response.data.errors.institucion_nombre[0] ,
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
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        institucionesTemporales(){
            let me = this;
            if(me.idregion == null || me.idregion == undefined){
                me.$vs.notify({
                    text: 'Seleccione una region',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time:4000
                })  
                return false
            }
            this.$http.get(this.$server_url+'institucionesTemporalesWebinar?region=' + me.idregion)
            .then(function (response) {
                me.institucionesTemporal = response.data;
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
                    this.$http.get(this.$server_url+'obtenerWebinars?capacitacionInstitucion=yes'+'&institucion_id='+me.estudiante.idinstitucion)
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
         agregarInstitucionTemporal() {
            let me = this;
            if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una institución por favor'
                })
                return false;
            }
            let formData = new FormData();
            formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
            formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
            formData.append('region', me.temporalInstitucion.region);
            formData.append('tipo', "1");
            me.$vs.loading()
            this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.institucionesTemporales()
                    me.popupAddNuevaInstitucion = false;
                    me.institucion_id_temporal = res.data.institucion_temporal_id
                    me.estado_institucion_temporal = 1;
                    me.$vs.notify({
                        text: "Se guardo correctamente, DE CLICK EN OTRA INSTITUCION Y SELECCIONE LA INSTITUCION QUE CREO",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:10000
                    })
                    
                })
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
    background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
}
</style>
