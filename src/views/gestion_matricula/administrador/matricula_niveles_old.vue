<template>
    <div>

        <div v-if="listadoPensiones == true">
            <div v-if="asignarPensiones == false">
                <vs-button type="relief"  @click="asignarPensiones = true" icon="attach_money">Asignar Pensiones</vs-button>


            

                <div v-if="PeriodosInstitucion.length >0 ">
                    <br/><br/>
                    <vs-table max-items="10" search pagination :data="PeriodosInstitucion" style="margin-top:-40px">
                        <template slot="thead">
                            
                            <vs-th>Institucion</vs-th>
                            <vs-th>Periodo</vs-th>
                            <vs-th>Fecha inicio pensión</vs-th>
                            <vs-th>Acción</vs-th>
                        
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                
                                <vs-td>
                                    {{data[indextr].nombreInstitucion}}<br>
                                    
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].periodo}}<br>
                                </vs-td>

                                <vs-td>
                                    {{data[indextr].fecha_inicio_pension}}<br>
                                </vs-td>
                        
                                <vs-td>
                                    <vx-tooltip style="display: inline-block;" text="Detalle de las pensiones" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="primary" @click="verValoresPensiones(tr)" type="filled" icon-pack="feather" icon="icon-bookmark">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;

                                    <vx-tooltip style="display: inline-block;" text="Estudiante Matricula" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="warning" @click="GestionarAlumnos(tr)" type="filled" icon-pack="feather" icon="icon-bookmark">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;

                                     <!-- <vx-tooltip style="display: inline-block;" text="Estudiantes Legales" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="dark" @click="EstudiantesLegales(tr)" type="filled" icon-pack="feather" icon="icon-bookmark">
                                        </vs-button>
                                    </vx-tooltip> &nbsp; -->

                                </vs-td>
                                
                            </vs-tr>
                        </template>
                    </vs-table>   
                </div>
                <div v-else class="p-3">
                    <p> No existe niveles asignados a un periodos  aun. </p>
                </div>

            </div>
        </div>
            

        <!--PARA ASIGNAR O EDITAR LOS VALORES DE LAS PENSIONES  -->
        <div v-if="asignarPensiones == true">
            <!--Boton para regresar-->
            <vs-button color="warning" @click="asignarPensiones = false"  type="filled" icon="arrow_back"></vs-button>
         
            <br/><br/>
            <vs-alert active="true" color="success">
            <p style="font-weight:400;"><i class="fa fa-exclamation" aria-hidden="true"></i>  Seleccione los niveles que  utiliza su institución</p>    

            
            </vs-alert>

            <br/>

            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                    <div style="display:flex;flex-direction:column;width:100%;">
                        <div style="width:100%">
                            <p style="text-align:left;">Institución</p>   
                        </div>

                    <div style="width:100%">
                            <vs-input  disabled v-model="nivel.nombreInstitucion" style="width:95%;"/>    
                        </div>
                    </div>
                </vs-col>

                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                    <div style="display:flex;flex-direction:column;width:100%;">
                        <div style="width:100%">
                            <p style="text-align:left;">Fecha del inicio del pago de la pensión</p>   
                        </div>

                    <div style="width:100%">
                  
                            <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha inicio pensión" class="m-1" style="width: 95%;margin-top:50px;" />  
                        </div>
                    </div>
                </vs-col>
            </vs-row>

            <br/>

            <vs-divider color="warning">Nivel inicial</vs-divider>
                <vs-row>
                    <div style="display:flex;width:100%;">
                        <div style="width:40%;">
                            <p>Nivel inicial</p>
                        </div>

                        <div style="width:60%;">
                            <vs-radio v-model="ver_nivel_inicial" vs-name="nivelinicial" vs-value="1" style="margin-left:5px;">Si </vs-radio>
                            <vs-radio v-model="ver_nivel_inicial" vs-name="nivelinicial" style="margin-left:5px" vs-value="0">No </vs-radio>   
                        </div>
                    </div>
                </vs-row>

                <vs-row  v-if="ver_nivel_inicial == '1'">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                
                        <vs-collapse style="width:100%;">
                                <vs-collapse-item>
                                    <div slot="header">
                                        <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span>  Valores  de pensiones para Educación Inicial</span> </p>
                                    
                                    </div>

                                    <div>
                                        <vs-list>
                                            <vs-list-header></vs-list-header>
                                            <div>
                                                <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                    <div style="width:50%">
                                                        <vs-list-item :title="niveles[0].nombrenivel"></vs-list-item>
                                                    </div>

                                                    <div style="width:50%">
                                                    
                                                        <vs-input  placeholder="Cantidad pensión" v-model="nivelPrecio.inicial1" class="precios"/>
                                                    </div> 
                                                </div>   
                                            </div>   

                                            <div>
                                                <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                    <div style="width:50%">
                                                        <vs-list-item :title="niveles[1].nombrenivel"></vs-list-item>
                                                    </div>

                                                    <div style="width:50%">
                                                    
                                                        <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.inicial2" class="precios"/>
                                                    </div> 
                                                </div>   
                                            </div>   
                                        
                                        </vs-list>
                                    </div> 
                                </vs-collapse-item>
                                    
                            </vs-collapse>
                    </vs-col>
                </vs-row>
            <vs-divider color="primary">Educación Básica</vs-divider>
                <vs-row>
                    <div style="display:flex;width:100%;">
                        <div style="width:40%;">
                            <p>Educación Básica</p>
                        </div>

                        <div style="width:60%;">
                            <vs-radio v-model="ver_nivel_basica" vs-name="nivelbasico" vs-value="1" style="margin-left:5px;">Si </vs-radio>
                            <vs-radio v-model="ver_nivel_basica" vs-name="nivelbasico" style="margin-left:5px" vs-value="0">No </vs-radio>   
                        </div>
                    </div>
                </vs-row>

                <vs-row  v-if="ver_nivel_basica == '1'">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                
                        <vs-collapse style="width:100%;">
                            <vs-collapse-item>
                                <div slot="header">
                                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span>  Valores  de pensiones para Educación Básica</span> </p>
                                    
                                </div>

                                <div>
                                    <vs-list>
                                        <vs-list-header></vs-list-header>
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[2].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.primero" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   

                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[3].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.segundo" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   
                                        
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[4].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.tercero" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>  

                                                    <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[5].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.cuarto" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   
                                        
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[6].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.quinto" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>  
                                        
                                                    <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[7].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.sexto" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   
                                        
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[8].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.septimo" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>  
                                        

                                    </vs-list>
                                </div> 
                            </vs-collapse-item>
                                
                        </vs-collapse>
                    </vs-col>
                </vs-row>

            <vs-divider color="danger">Educación Secundaria</vs-divider>
                <vs-row>
                    <div style="display:flex;width:100%;">
                        <div style="width:40%;">
                            <p>Educación Secundaria</p>
                        </div>

                        <div style="width:60%;">
                            <vs-radio v-model="ver_nivel_secundaria" vs-name="nivelsecundaria" vs-value="1" style="margin-left:5px;">Si </vs-radio>
                            <vs-radio v-model="ver_nivel_secundaria" vs-name="nivelsecundaria" style="margin-left:5px" vs-value="0">No </vs-radio>   
                        </div>
                    </div>
                </vs-row>

                <vs-row  v-if="ver_nivel_secundaria == '1'">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                
                        <vs-collapse style="width:100%;">
                            <vs-collapse-item>
                                <div slot="header">
                                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span>  Valores  de pensiones para Educación Secundaria</span> </p>
                                    
                                </div>
                                
                                <div>
                                    <vs-list>
                                        <vs-list-header></vs-list-header>
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[9].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.octavo" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   

                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[10].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.noveno" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   
                                        
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[11].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.decimo" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>                                       

                                    </vs-list>
                                </div> 
                            </vs-collapse-item>
                                
                        </vs-collapse>
                    </vs-col>
                </vs-row>
                
            <vs-divider color="success">Educación Superior</vs-divider>

                <vs-row>
                    <div style="display:flex;width:100%;">
                        <div style="width:40%;">
                            <p>Educación Superior</p>
                        </div>

                        <div style="width:60%;">
                            <vs-radio v-model="ver_nivel_superior" vs-name="nivelsuperior" vs-value="1" style="margin-left:5px;">Si </vs-radio>
                            <vs-radio v-model="ver_nivel_superior" vs-name="nivelsuperior" style="margin-left:5px" vs-value="0">No </vs-radio>   
                        </div>
                    </div>
                </vs-row>

                <vs-row  v-if="ver_nivel_superior == '1'">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                
                        <vs-collapse style="width:100%;">
                            <vs-collapse-item>
                                <div slot="header">
                                    <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span>  Valores  de pensiones para Educación Superior</span> </p>
                                    
                                </div>
                                
                                <div>
                                    <vs-list>
                                        <vs-list-header></vs-list-header>
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[12].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.primero_bgu" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   

                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[13].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.segundo_bgu" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>   
                                        
                                        <div>
                                            <div style="display:flex;margin:10px;padding:10px;width: 100%;">
                                                <div style="width:50%">
                                                        <vs-list-item :title="niveles[14].nombrenivel"></vs-list-item>
                                                </div>

                                                <div style="width:50%">
                                                    
                                                    <vs-input  placeholder="Cantidad pensión"  v-model="nivelPrecio.tercero_bgu" class="precios"/>
                                                </div> 
                                            </div>   
                                        </div>                                       

                                    </vs-list>
                                </div> 
                            </vs-collapse-item>
                                
                        </vs-collapse>
                    </vs-col>
                </vs-row>
                
                <br/>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="guardarNiveles()" type="relief">Generar valores de Pensiones</vs-button>
                </vs-col>
            </vs-row>

        </div>


        <!--MODALES -->
        <!---MODAL PARA VER LOS VALORES DE LAS PENSIONES-->
        <vs-popup class="holamundo" fullscreen  title="Valores de pensiones por nivel" :active.sync="popupValoresPensiones">
               
            <br/>
            <div v-if="valoresPensiones.length >0 ">
      
                <vs-table max-items="10" search pagination :data="valoresPensiones" style="margin-top:-40px">
                    <template slot="thead">
                        
                        <vs-th>Periodo</vs-th>
                        <vs-th>Nivel</vs-th>
                        <vs-th>Valor Pensión</vs-th>
                        <vs-th>Accion</vs-th>
                  
                       
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            
                            <vs-td>
                                {{data[indextr].periodo}}<br>
                                
                            </vs-td>
                            <vs-td>
                                {{data[indextr].nombrenivel}}<br>
                            </vs-td>

                            <vs-td>
                                {{data[indextr].valor}}<br>
                            </vs-td>

                            <vs-td>
                                <vs-button color="primary"  icon="add_circle"  @click="asignarParelos(tr)" type="relief">Asignar Paralelos</vs-button>
                            </vs-td>
                     
                            
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe valores de pensiones asignados</p>
            </div>

         </vs-popup>

        <!--MODAL PARA ASIGNAR PARALELOS-->


         <vs-popup title="Asignar paralelos" :active.sync="popupAsignarParalelos">
             
            <!--Boton para regresar-->
            <vs-button color="warning" @click="popupAsignarParalelos = false;  popupValoresPensiones= true;"  type="filled" icon="arrow_back"></vs-button>
            <br/>
            <div class="vx-row">
                          
                    <div class="vx-col sm:w-full">
                        <div v-for="(item, index) in arregloParalelosAsignados" :key="index" class="m-1 p-1 asig-select text-dark">
                        
                           Paralelo {{item.descripcion}} &nbsp; &nbsp;
                            
                            <vs-button @click="eliminarParalelo(item)" style="display:inline;margin-left:5px;" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                        </div>
                    </div>
            </div>
            <vs-list>
                
                <vs-list-item v-for="(item,$index) in arregloParalelos" :key="$index" :title="'Paralelo '+item.descripcion">
                    <template slot="avatar">
                        <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                    </template>

                    <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="success" @click="guardarParalelos(item)">Asignar Paralelo</vs-button>

                </vs-list-item>
            </vs-list>
        </vs-popup>

  

          

    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'

export default {
    data() {
      return{
          colorx:'',
          listadoPensiones:true,
          estudianteSin:false,
          asignarPensiones:false,
          popupAsignarParalelos:false,
          popupGestionEstudiantes:false,
          niveles:[],
          nivel:{
              inicio:'',
              hasta:'',
              periodo_id:'',
              nombreInstitucion:'',
            
          },
        nivelesEditar:[],
        popupEditarNiveles:false,
        toDate: null,
        configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
        },
        item:{
            orden:'',
            
        },
        precio:[],
        //variables para valores de las pensiones
        ver_nivel_inicial:'1',
        ver_nivel_basica:'1',
        ver_nivel_secundaria:'1',
        ver_nivel_superior:'1',
        nivelPrecio:{
            inicial1:'',
            inicial2:'',
            primero:'',
            segundo:'',
            tercero:'',
            cuarto:'',
            quinto:'',
            sexto:'',
            septimo:'',
            octavo:'',
            noveno:'',
            decimo:'',
            primero_bgu:'',
            segundo_bgu:'',
            tercero_bgu:'',
        },
        institucion:[],
        PeriodosInstitucion:[],
        valoresPensiones:[],
        popupValoresPensiones:false,

        //VARIABLES PARA LOS PARALELOS
        p_a:'1',
        p_b:'1',
        p_c:'1',
        p_d:'0',
        paralelo:{
            nivelInstitucion_id:'',
            nivel_id:'',
            institucion_id:'',
            periodo_id:'',
        },
        arregloParalelos:[],
        arregloParalelosAsignados:[],
     

        //FIN VARIABLES PARA LOS PARALELOS  
      }  
    },
    components: {
        'v-select': vSelect,
        flatPickr,
     },
     created(){
         let me = this;
         me.getNivel();
         me.institucion = JSON.parse(localStorage.getItem("institucion"))
       
        
     },
     mounted(){
        let me = this;
        me.getPeriodoInstitucion();
        me.nivelPeriodoInstitucion();
     },
    methods:{
         cerrar(){
             let me = this;
             me.popupValoresPensiones = true;
             me.popupAsignarParalelos = false;
         },
          getNivel() {
            let me = this;
           
            this.$http.get(this.$server_url+'estudiante/matricula?todoNiveles=yes')
                .then(function (res) {
                    me.niveles = res.data

                })
                .catch(function (error) {
                    console.log(error + ' error');  

                })
        },

        getPeriodoInstitucion() {
            let me = this;
           
          
            this.$http.get(this.$server_url+'institucionTraerPeriodo?institucion_id='+me.institucion.idInstitucion)
                .then(function (res) {
                    me.nivel.periodo_id = res.data[0].periodo
                    localStorage.setItem('periodo_id',res.data[0].periodo)
                    me.nivel.institucion_id = me.institucion.idInstitucion
                    me.nivel.nombreInstitucion = me.institucion.nombreInstitucion

                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },
        //para traer los periodos y niveles
        nivelPeriodoInstitucion() {
            let me = this;
           
            this.$http.get(this.$server_url+'nivelPeriodoInstitucion?institucion_id='+me.institucion.idInstitucion)
                .then(function (res) {
                    me.PeriodosInstitucion = res.data

                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },
        //para ver los valores de las pensiones del periodo de la institucion
        verValoresPensiones(tr){
            let me = this;
             this.$http.get(this.$server_url+'nivelPeriodoInstitucion?institucion_id='+tr.institucion_id+'&periodo_id='+tr.periodo_id+'&valoresPensiones=yes')
                .then(function (res) {
                    me.valoresPensiones = res.data
                    me.popupValoresPensiones= true;
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },

        //traer paralelos 
    
        traerParalelos(){
            let me = this;
             this.$http.get(this.$server_url+'nivelPeriodoInstitucion?paralelos=yes')
                .then(function (res) {
                    me.arregloParalelos = res.data
                   
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },

        //traer paralelos  asignados
    
        traerParalelosAsignados(nivelInstitucion_id){
            let me = this;
             this.$http.get(this.$server_url+'nivelPeriodoInstitucion?paraleloAsignado=yes'+'&nivelInstitucion_id='+nivelInstitucion_id)
                .then(function (res) {
                    me.arregloParalelosAsignados = res.data
                   
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },
        

        

        //para asignar paralelos
        asignarParelos(tr){
            let me = this;

            me.traerParalelos();
            localStorage.setItem('nivelInstitucion_id',tr.nivelInstitucion_id)
            me.traerParalelosAsignados(tr.nivelInstitucion_id)
            me.popupValoresPensiones = false;
            me.popupAsignarParalelos = true;

            me.paralelo.nivelInstitucion_id = tr.nivelInstitucion_id
            me.paralelo.nivel_id = tr.nivel_id
            me.paralelo.institucion_id = tr.institucion_id
            me.paralelo.periodo_id = tr.periodo_id

        },

        //Gestion de asignacion de paralelos
        GestionarAlumnos(tr){
            let me = this;
            me.estudianteSin  = true;
            me.listadoPensiones = false;
        },
   

        guardarParalelos(item){
            let me = this;

            let formData = new FormData();
            formData.append('institucion_id',me.paralelo.institucion_id)
            formData.append('periodo_id',me.paralelo.periodo_id )
            formData.append('nivel_id',me.paralelo.nivel_id)
            formData.append('nivelInstitucion_id',me.paralelo.nivelInstitucion_id)

            formData.append('paralelo',item.paralelo_id)
        

            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarParalelos', formData)
                .then(function (res) {
                    me.$vs.loading.close() 
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })

                    me.traerParalelosAsignados(localStorage.getItem("nivelInstitucion_id"))
                    
   
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },

        eliminarParalelo(item){
             let me = this;
           
            me.$vs.loading();
            this.$http.get(this.$server_url + "eliminarParalelo/" + item.cursos_paralelos_id)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: item.descripcion + ' eliminada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.traerParalelosAsignados(localStorage.getItem("nivelInstitucion_id"))
                  
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        obtenerNiveles(){

            let me = this;
           
            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarInformacionNiveles', me.nivel)
                .then(function (res) {
                    me.$vs.loading.close() 
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.verValoresPensiones()
                    me.nivelesEditar = res.data
                    me.popupEditarNiveles = true
   
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })

        
        },

        guardarNiveles(){
            let me = this;

            if(me.toDate == "" || me.toDate == null  ){
                 me.$vs.notify({
                        text: "Ingrese una fecha de inicio de pension",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                return false;
            }
            let formData = new FormData();
            formData.append('institucion_id',me.institucion.idInstitucion)
            formData.append('periodo_id',localStorage.getItem("periodo_id"))
            formData.append('fecha_inicio_pension',me.toDate)
            //========EDUCACION INICIAL=====
            if(me.ver_nivel_inicial == '1'){
                formData.append('inicial',     "yes");
                //inicial1
                formData.append('ordenInicial1',     me.niveles[0].orden);
                formData.append('precio_inicial1', me.nivelPrecio.inicial1);
                //inicial2
                formData.append('ordenInicial2',     me.niveles[1].orden);
                formData.append('precio_inicial2', me.nivelPrecio.inicial2);
                
            }

            //========EDUCACION BASICA=====
            if(me.ver_nivel_basica == '1'){
                formData.append('basica',     "yes");
                 //primero
                formData.append('orden_primero',     me.niveles[2].orden);
                formData.append('precio_primero', me.nivelPrecio.primero);
                //segundo
                formData.append('orden_segundo',     me.niveles[3].orden);
                formData.append('precio_segundo', me.nivelPrecio.segundo);
                //tercero
                formData.append('orden_tercero',     me.niveles[4].orden);
                formData.append('precio_tercero', me.nivelPrecio.tercero);
                //cuarto
                formData.append('orden_cuarto',     me.niveles[5].orden);
                formData.append('precio_cuarto', me.nivelPrecio.cuarto);
                //quinto
                formData.append('orden_quinto',     me.niveles[6].orden);
                formData.append('precio_quinto', me.nivelPrecio.quinto);
                //sexto
                formData.append('orden_sexto',     me.niveles[7].orden);
                formData.append('precio_sexto', me.nivelPrecio.sexto);
                //septimo
                formData.append('orden_septimo',     me.niveles[8].orden);
                formData.append('precio_septimo', me.nivelPrecio.septimo);
              
            }

            //========EDUCACION SECUNDARIA=====
            if(me.ver_nivel_secundaria == '1'){
                formData.append('secundaria',     "yes");
                 //primero
                formData.append('orden_octavo',     me.niveles[9].orden);
                formData.append('precio_octavo', me.nivelPrecio.octavo);
                //segundo
                formData.append('orden_noveno',     me.niveles[10].orden);
                formData.append('precio_noveno', me.nivelPrecio.noveno);
                //tercero
                formData.append('orden_decimo',     me.niveles[11].orden);
                formData.append('precio_decimo', me.nivelPrecio.decimo);
        
            }
    
        //========EDUCACION SUPERIOR=====
            if(me.ver_nivel_superior == '1'){
                formData.append('superior',     "yes");
                 //primero
                formData.append('orden_primero_bgu',     me.niveles[12].orden);
                formData.append('precio_primero_bgu', me.nivelPrecio.primero_bgu);
                //segundo
                formData.append('orden_segundo_bgu',     me.niveles[13].orden);
                formData.append('precio_segundo_bgu', me.nivelPrecio.segundo_bgu);
                //tercero
                formData.append('orden_tercero_bgu',     me.niveles[14].orden);
                formData.append('precio_tercero_bgu', me.nivelPrecio.tercero_bgu);
            }
        
            formData.append('guardar', "yes");

            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarInformacionNiveles', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                     me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    if(res.data.status  == "1"){
                        location.reload();
                    }
                    me.nivelPeriodoInstitucion();    
                    me.limpiar();
                    me.asignarPensiones = false;

                 
                 
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },

        limpiar(){
            let me = this;
            me.toDate = null;
            me.nivelPrecio.inicial1 = null;
            me.nivelPrecio.inicial2 = null;
            me.nivelPrecio.primero = null;
            me.nivelPrecio.segundo = null;
            me.nivelPrecio.tercero = null;
            me.nivelPrecio.cuarto = null;
            me.nivelPrecio.quinto = null;
            me.nivelPrecio.sexto = null;
            e.nivelPrecio.septimo = null;
            me.nivelPrecio.octavo = null;
            me.nivelPrecio.noveno = null;
            me.nivelPrecio.decimo = null;
            me.nivelPrecio.primero_bgu = null;
            me.nivelPrecio.segundo_bgu = null;
            me.nivelPrecio.tercero_bgu = null;
        },
    }
}
</script>