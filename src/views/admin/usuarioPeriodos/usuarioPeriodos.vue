<template>
    <div>

        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-card style="padding:5px;">
                    <vs-alert active="true" color="warning">
                   
                        <p style="margin-top:3px;" > 
                            <span style="margin-left:5px;">   
                                <i class="fa fa-globe" style="font-weight: bold;" aria-hidden="true"></i> 
                                Detalle  total de usuarios
                             </span>
                        </p>
                    </vs-alert>
                </vs-card>
                
            </vs-col>
        </vs-row>
        
        <vs-row style="margin-top:20px;" vs-justify="space-between">
            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="5" vs-xs="12" vs-sm="12">
               <vs-card>
                   <div class="header">
                    <p>Periodos activos</p>
                   </div>

                        <vs-list style="font-size:13px;">
                            <vs-list-header title="Total Estudiantes"></vs-list-header>

                            <div :key="indextr" v-for="(tr, indextr) in estudiantes">
                                <div style="display:flex;">
                                    <div style="width: 50%;"> 
                                        <p>Periodo: {{tr.nombre_periodo}}</p>
                                    </div>
                                    <div style="width: 50%;"> 
                                          <p>Total Estudiantes: {{tr.cantidad}}</p>
                                    </div>

                                </div>
                                
                              
                            </div>
                        
                        </vs-list>

                        <vs-list style="font-size:13px;">
                            <vs-list-header title="Total Docentes"></vs-list-header>

                            <div :key="indextr" v-for="(tr, indextr) in docentes">

                                  <div style="display:flex;">
                                    <div style="width: 50%;"> 
                                        <p>Periodo: {{tr.nombre_periodo}}</p>
                                    </div>
                                    <div style="width: 50%;"> 
                                          <p>Total Docentes: {{tr.cantidad}}</p>
                                    </div>

                                </div>
                            </div>
                           
                        </vs-list>
                   <div>
                   
                   </div>
               </vs-card>

            </vs-col>

            <vs-col  vs-type="flex"  vs-justify="center" vs-align="center" vs-w="6" vs-xs="12" vs-sm="12" >
                <vs-card>
                   <div class="header">
                        Periodos Inactivos
                        <span v-if="filtro == true"><i class="fa fa-chevron-circle-left" @click="filtro = false;" style="cursor:pointer;margin-left:5px;color:red;" aria-hidden="true"></i></span>
                   </div>

                    <div v-if="filtro == false">
                        
                          <vs-row>
                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <p>Seleccione el período sierra</p>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" style="margin-top:10px;">
                                <v-select :options="periodosSierra" :reduce="periodosSierra => periodosSierra" label="periodoescolar" class="w-full" v-model="datos.periodoSierra" />
                            </vs-col>

                        </vs-row>

                        <vs-row>
                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" style="margin-top:5px;"> 
                                <p>Seleccione el período costa</p>
                            </vs-col>

                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" style="margin-top:10px;">
                                <v-select :options="periodosCosta" :reduce="periodosCosta => periodosCosta" label="periodoescolar" class="w-full" v-model="datos.periodoCosta" />
                            </vs-col>

                        
                        </vs-row>

                        <vs-row style="margin-top: 10px;">
                            <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <vs-button color="primary" type="border" @click="filtrarPorPeriodo()">Filtrar</vs-button>
                            </vs-col>
                        </vs-row>


                    </div>
                      

                    
                    <div v-if="filtro == true">

                        <vs-list style="font-size:13px;">
                            <vs-list-header title="Total Estudiantes"></vs-list-header>

                            <div>
                               
                                <div style="display:flex;"  v-if="InactivoEstudiantesSierra.cantidad  >0">
                                    <div style="width: 50%;" > 
                                        <p>Periodo: {{InactivoEstudiantesSierra.nombre_periodo}}</p>
                                    </div>
                                    <div style="width: 50%;"> 
                                        <p>Total Estudiantes: {{InactivoEstudiantesSierra.cantidad}}</p>
                                    </div>

                                </div>

                                <div style="display:flex;" v-if="InactivoEstudiantesCosta.cantidad  >0">
                                    <div style="width: 50%;"> 
                                        <p>Periodo: {{InactivoEstudiantesCosta.nombre_periodo}}</p>
                                    </div>
                                    <div style="width: 50%;"> 
                                        <p>Total Estudiantes: {{InactivoEstudiantesCosta.cantidad}}</p>
                                    </div>

                                </div>
                                

                            
                            </div>
                        
                        </vs-list>

                        <vs-list style="font-size:13px;"> 
                            <vs-list-header title="Total Docentes"></vs-list-header>

                            <div>

                                <div style="display:flex;" v-if="InactivoDocentesSierra.cantidad  >0">
                                    <div style="width: 50%;"> 
                                        <p>Periodo: {{InactivoDocentesSierra.nombre_periodo}}</p>
                                    </div>
                                    <div style="width: 50%;"> 
                                        <p>Total Docentes: {{InactivoDocentesSierra.cantidad}}</p>
                                    </div>

                                </div>

                             
                                <div style="display:flex;" v-if="InactivoDocentesCosta.cantidad  >0" >
                                    <div style="width: 50%;"> 
                                        <p>Periodo: {{InactivoDocentesCosta.nombre_periodo}}</p>
                                    </div>
                                    <div style="width: 50%;"> 
                                        <p>Total Docentes: {{InactivoDocentesCosta.cantidad}}</p>
                                    </div>

                                </div>
                            </div>
                        
                        </vs-list>
                           

                    </div>

                  


               </vs-card>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import vSelect from 'vue-select'
export default {
    data() {
      return{
          filtro:false,
          periodosSierra:[],
          periodosCosta:[],
          periodo:'',
          docentes:[],
          estudiantes:[],
          InactivoDocentesCosta:[],
          InactivoEstudiantesCosta:[],
          InactivoDocentesSierra:[],
          InactivoEstudiantesSierra:[],
          datos:{
              region:'1',
              periodoSierra:'',
              periodoCosta:''
          }
       
      }  
    },

    components:{
        vSelect
    },
    created(){
        let me = this;
        me.getTotalUsuarios();
    },

    methods:{
         //para obtener el listado de los periodos
        getTotalUsuarios() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'UsuariosPeriodo')
                .then(function (res) {
                    me.docentes = res.data.docentes
                    me.estudiantes = res.data.estudiantes
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

          //para obtener el listado de los periodos
        getPeriodos() {
            let me = this;
            // me.InactivoEstudiantes = []
            // me.InactivoDocentes = []
            me.$vs.loading();
            this.$http.get(this.$server_url+'periodo?porEstados=yes')
                .then(function (res) {

                    me.periodosSierra = res.data.sierra
                    me.periodosCosta = res.data.costa
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        //para buscar por periodo 
        filtrarPorPeriodo(){
            
            let me = this;

            me.InactivoDocentesCosta = []
            me.InactivoEstudiantesCosta = []
            me.InactivoDocentesSierra = []
            me.InactivoEstudiantesSierra = []
            let formData = new FormData();

            //filtro por los 2 regiones
            if(me.datos.periodoSierra !== null && me.datos.periodoSierra !== "" && me.datos.periodoCosta !== null && me.datos.periodoCosta !== ""){
                let formData = new FormData();

                formData.append('periodoSierra',me.datos.periodoSierra.idperiodoescolar);
                 formData.append('periodoCosta',me.datos.periodoCosta.idperiodoescolar);
                 formData.append('todos',"yes");

                //sierra
                  me.$vs.loading()
                    this.$http.post(this.$server_url+'usuariosXperiodoSierra', formData)
                    .then(res => {
                        me.$vs.loading.close()   
                        if(res.data.message){
                            
                                me.$vs.notify({
                                text:res.data.message,
                                color:'warning',
                                iconPack: 'feather',
                                icon:'icon-check'})
                            return false;
                            
                        }else{
                         
                            me.InactivoDocentesSierra = res.data.docentes,
                            me.InactivoEstudiantesSierra = res.data.estudiantes,
                            me.filtro = true
                        }

                
                    })

                 //costa

                   me.$vs.loading()
                        this.$http.post(this.$server_url+'usuariosXperiodoCosta', formData)
                        .then(res => {
                            me.$vs.loading.close()   
                            if(res.data.message){
                                
                                    me.$vs.notify({
                                    text:res.data.message,
                                    color:'warning',
                                    iconPack: 'feather',
                                    icon:'icon-check'})
                             return false;
                            
                            }else{
                                me.InactivoDocentesCosta = res.data.docentes,
                                me.InactivoEstudiantesCosta = res.data.estudiantes,
                                me.filtro = true
                            }
                    
                        })


            }else{
                //para sierra 
                if(me.datos.periodoSierra !== null && me.datos.periodoSierra !== "" ){
                    formData.append('periodoSierra',me.datos.periodoSierra.idperiodoescolar);
             
                     me.$vs.loading()
                    this.$http.post(this.$server_url+'usuariosXperiodoSierra', formData)
                    .then(res => {
                        me.$vs.loading.close()   
                        if(res.data.message){
                            
                                me.$vs.notify({
                                text:res.data.message,
                                color:'warning',
                                iconPack: 'feather',
                                icon:'icon-check'})
                         return false;
                            
                         }else{
                            me.InactivoDocentesSierra = res.data.docentes,
                            me.InactivoEstudiantesSierra = res.data.estudiantes,
                            me.filtro = true
                         }
                    
                    })
                 }

                //para costa
                if(me.datos.periodoCosta !== null && me.datos.periodoCosta !== "" ){
                    formData.append('periodoCosta',me.datos.periodoCosta.idperiodoescolar);
                    formData.append('individual',"yes");

                     me.$vs.loading()
                        this.$http.post(this.$server_url+'usuariosXperiodoCosta', formData)
                        .then(res => {
                            me.$vs.loading.close()   
                            if(res.data.message){
                                
                                    me.$vs.notify({
                                    text:res.data.message,
                                    color:'warning',
                                    iconPack: 'feather',
                                    icon:'icon-check'})
                            return false;
                            
                            }else{
                                me.InactivoDocentesCosta = res.data.docentes,
                                me.InactivoEstudiantesCosta = res.data.estudiantes,
                                me.filtro = true
                            }
                    
                    
                        })
                }else{
                   
                }

            }

        
              
      
        
            // this.$http.get(this.$server_url+'UsuariosPeriodo?porPeriodo=yes&idperiodoescolar='+me.datos.periodo.idperiodoescolar)
            //     .then(function (res) {
            //         me.InactivoDocentes = res.data.docentes
            //         me.InactivoEstudiantes = res.data.estudiantes
               
            //         me.$vs.loading.close()

            //     })
            //     .catch(function (error) {
            //         console.log(error + ' error');
            //         me.$vs.loading.close()

            //     })
        },
    },
    mounted() {
        let me = this;
        me.getPeriodos();
    },
    
}
</script>