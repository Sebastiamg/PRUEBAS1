<template>
    <div>
        <br/>
            <ul class="leftx">
                <li class="modelx">
        
                </li>
                <div style="display:flex;">
                    <li style="margin-left:10px;">
                   
                        <vs-radio v-model="region" vs-name="radios1"  @input="obtenerPeriodos()" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li style="margin-left:10px;">
                        <vs-radio v-model="region" vs-name="radios1" @input="obtenerPeriodos()" vs-value="2">Costa</vs-radio>
                    </li>
                </div>
        
            
            </ul>
            <br/>

    
            <vs-row>
                <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="12">
                
                <div style="display:flex;width:100%">
                     <div style="width:70%;">   
                        <v-select :options="periodos" :reduce="periodos => periodos" label="descripcion" class="w-full" v-model="contratoPeriodo.periodo" />

                     </div>

                     <div style="width:20%;margin-left:10px;">
                         <vs-button color="warning"  @click="getContratos()"  type="filled" icon="search"></vs-button>
                     </div>
                 </div>
                </vs-col>
            </vs-row>
           

            <div v-if="contratos.length >0 ">
             <br/><br/>
                <vs-table max-items="10" search pagination :data="contratos" style="margin-top:-40px">
                     <template slot="thead">
                    <vs-th>
                        Contrato
                    </vs-th>

                    <vs-th>
                        docente
                    </vs-th>
                 
                    <vs-th>
                        Institucion
                    </vs-th>

                    <vs-th>
                        Cant. Verificaciones
                    </vs-th>

                
                    <vs-th>
                        Accion
                    </vs-th>

                  
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td >
                            {{data[indextr].contrato}}<br>
                          
                            <p>{{data[indextr].ciudad}} - {{data[indextr].year}}</p>
                            
                        </vs-td>

                        <vs-td >
                            {{data[indextr].temporal_cedula_docente}}<br>
                            {{data[indextr].temporal_nombre_docente}}
                        </vs-td>


                        <vs-td  >
                            {{data[indextr].temporal_institucion}}
                            <br/>
                            <span style="font-size:10px;font-weight:500;">{{tr.periodo}}</span>
                            <br/>
                            <template v-if="data[indextr].estado == '1'">
                               <vs-chip color="primary">
                                    Activo
                                </vs-chip>
                            </template>

                            <template v-else>
                                <vs-chip color="primary">
                                    Desactivado
                                </vs-chip>
                            </template>

                        </vs-td>

                        <vs-td>
                           
                            {{ tr.contContrato }}
                        </vs-td>

                      

                        <vs-td > 
                             <vx-tooltip style="display: inline-block;" text="ver verificaciones" position="top" color="primary">
                                    <vs-button class="modal-default-button" color="primary" @click="getInformacionLiquidacion(data[indextr])" type="filled" size="small" icon-pack="feather" icon="icon-bookmark"> </vs-button>
                                </vx-tooltip> &nbsp;
                            
                        </vs-td>

             

                    </vs-tr>
                </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe contratos asociados al asesor </p>
            </div>

            <!--Modales-->
              
            <vs-popup class="holamundo"  fullscreen title="Verificaciones del contrato" :active.sync="popupVerificaciones">
                <vs-table max-items="10" search pagination :data="InformacionLiquidacion">
                    <template slot="thead">
                        
                        <vs-th>Contrato</vs-th>
                        <vs-th>Num. Verificación.</vs-th>
                        <vs-th>Fecha inicio</vs-th>
                        <vs-th>Fecha fin</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Accion</vs-th>
                
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            
                            <vs-td>
                                {{data[indextr].contrato}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].num_verificacion}}<br>
                            </vs-td>
                            <vs-td>
                                {{tr.fecha_inicio}}
                            </vs-td>
                                <vs-td>
                                {{tr.fecha_fin}}
                            </vs-td>
                            <vs-td>
                                <vs-chip v-if="tr.estado == '1'" color="primary">
                                        Abierto
                                </vs-chip>
                                <vs-chip v-else color="warning">
                                        Cerrada
                                </vs-chip>
                            </vs-td>

                            <vs-td>
                                <div style="display:flex;" v-if="tr.estado == '0'">
                                    <vx-tooltip style="display: inline-block;" text="Detalle de la verificación" position="top" color="warning">
                                        <vs-button style="border-radius:20px;" color="warning" type="line" icon-pack="feather" @click="getDetallesVerificacion(tr)" icon="icon-bookmark">Detalle</vs-button>
                                    </vx-tooltip>

                                </div>
                                
                            </vs-td>      
                        </vs-tr>
                    </template>
                </vs-table> 
            </vs-popup>

            <!--MODAL PARA DETALLES DE LA VERIFICACION -->
            <vs-popup
            :title="title" fullscreen :active.sync="popupDetalleVerificacion">
                <vs-button radius color="success" @click="popupVerificaciones = true;" type="gradient" icon="reply"></vs-button>
                <vs-chip color="primary" style="font-size:12px;">
                Total Libros: {{sumaTotal}}
                </vs-chip>
                <vs-table max-items="10" search pagination :data="DetalleVerificacion" class="mt-4">
                    <template slot="thead">
                        <vs-th>Libro</vs-th>
                        <vs-th>Código Liquidación</vs-th>
                        <vs-th>Cantidad</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">   
                            <vs-td>   
                                {{data[indextr].nombre_libro}}<br>
                            </vs-td>
                            <vs-td>
                                {{data[indextr].codigo}}<br>
                            </vs-td>
                            <vs-td>
                                {{tr.cantidad}}
                            </vs-td>
                            <vs-td>
                            <vs-button color="success" type="relief" @click="VerCodigos(tr)" icon="code">Ver códigos</vs-button>
                            </vs-td>      
                        </vs-tr>
                    </template>
                </vs-table> 
            </vs-popup>
            <!--MODAL PARA VER LOS CODIGOS DE LA VERIFICACION -->
            <vs-popup
            :title="title2"  :active.sync="popupVerCodigos">
            <vs-button color="success" icon="arrow_back" @click="popupVerCodigos = false; popupDetalleVerificacion = true;" type="gradient"></vs-button>
                <vs-list >
                    <vs-list-header  title="Códigos del libro"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in ArregloVerCodigos" :title="tr.codigo">
                    </vs-list-item>
                </vs-list>
            </vs-popup>
    </div>
</template>

<script>
import vSelect from 'vue-select'
export default {
    data() {
        return{
             usuario:[],
            contratos:[],
            periodo:'1',
            region:'1',
            periodos:[],
            contratoPeriodo:{
                periodo:'',
            },
            //=====VARIABLES PARA LA VERIFICACIONES====
            popupVerificaciones:false,
            popupActivo:false,
            popupContratoCodigo:false,
            historicoLiquidacion:[],
            InformacionLiquidacion:[],
            informacionFechasLiquidacion:[],
            contrato:"",
            popupDetalleVerificacion:false,
            popupVerCodigos:false,
            codigosPerdidos:[],
            ContratoCodigo:[],
            codigosMovidos:[],
            DetalleVerificacion:[],
            ArregloVerCodigos:[],
            popupDetalleVerificacion:false,
            popupVerCodigos:false,
            title:'',
            title2:'',
            verificacion_id:0,
            contContrato:0,
            popupChangeLiquidacion:false,

        }
    },
      components: {
        'v-select': vSelect,         
    },
     computed:{
        sumaTotal(){
            let me = this;
            if(me.DetalleVerificacion.length >0){
                let datos = me.DetalleVerificacion.filter(p => p.cantidad)
                let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
                return total
            }     
        },
    },
     created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
       
        me.obtenerPeriodos();
      
    },
    methods:{
      
             //cantidad de contratos del asesor
        async getContratos() {
            let me = this;
            if(me.contratoPeriodo.periodo == null || me.contratoPeriodo.periodo  == ''){
                   me.$vs.notify({
                  text:'Debe seleccionar un periodo para filtrar',
                  color:'primary',
                  iconPack: 'feather',
                  icon:'icon-check'})
            }
          
             me.$vs.loading();
            this.$http.get(this.$server_url+'contratosAsesor?idusuario=' + me.usuario.idusuario+'&idperiodoescolar='+me.contratoPeriodo.periodo.idperiodoescolar)
                .then(function (response) {
                    me.contratos = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },

        //para obtener los periodos
        obtenerPeriodos(){
            let me = this;
            me.contratos = [];
            me.$vs.loading();
            this.$http.get(this.$server_url+'contratosAsesor?periodoEstado=' + me.periodo+'&region='+me.region+'&traerPeriodos=yes')
                .then(function (response) {
                    me.periodos = response.data;
                     me.$vs.loading.close()
                })
                .catch(function (error) {
                     me.$vs.loading.close()
                })

        },

        //===============VERIFICACIONES================================
          //para ver el contrato del codigo
            VerContrato(verif){
                let me = this;
             
                 //para las fechas de las verificaciones
                 this.$http.get(this.$server_url+'verificacion?id='+verif)
                .then(function (res) {
                   
                    me.ContratoCodigo = res.data[0]
                    
                       if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                        return false;
                      }
                      me.popupCodigosPerdidos = false;
                      me.popupActivo = false;
                      me.popupContratoCodigo = true;

               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                 
                })
            },

              close(){
                  let me =this;
                  me.popupActivo = true;
                this.$vs.notify({
                    color:'danger',
                    title:'Cerrado',
                    text:'Has cerrado!'
                })
                },

            getInformacionLiquidacion(item) {
                let me = this;
                if(item.estado == 0){
                    me.$vs.notify({
                    text: 'El contrato esta inactivo no se puede abrir',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                    return false;      
                    
                }
                me.InformacionLiquidacion = [];
                me.informacionFechasLiquidacion = [];
                me.$vs.loading();
                this.$http.get(this.$server_url+'n_verificacion?contrato='+item.contrato+'&informacion=yes')
                    .then(function (res) {
                        me.InformacionLiquidacion = res.data
                        me.$vs.loading.close()
                        if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                            })
                            return false;      
                         }
                        me.popupVerificaciones = true;
                    })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })

                //para buscar los codigos perdidos relacionados a este contrato
                 this.$http.get(this.$server_url+'liquidacion/codigosperdidos/'+item.contrato)
                .then(function (res) {
                
                     me.codigosPerdidos = res.data.codigos
                   
                    if(res.data.status == '1'){
                        $('#codeLost').css('display', 'block');
                    }
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                 
                })

                //para buscar los codigos movidos a otro contrato
                    //para buscar los codigos perdidos relacionados a este contrato
                 this.$http.get(this.$server_url+'liquidacion/codigosmovidos/'+item.contrato)
                .then(function (res) {
                  
                     me.codigosMovidos = res.data.codigos
                   
                    if(res.data.status == '1'){
                        $('#codeMove').css('display', 'block');
                    }
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                 
                })

                //para las fechas de las verificaciones
                 this.$http.get(this.$server_url+'verificacion?contrato='+item.contrato+'&fechasVerificacion=yes')
                .then(function (res) {

                    me.informacionFechasLiquidacion = res.data
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                 
                })
            },
             VerCodigos(tr){
            let me  = this;  
            me.$vs.loading();
            me.title2 = "Códigos del libro "+tr.nombre_libro
            this.$http.get(this.$server_url+'n_verificacion?contrato='+tr.contrato+'&verCodigos=yes&verificacion_id='+me.verificacion_id+'&libro_id='+tr.libro_id+'&num_verificacion='+tr.verificacion_id)
            .then(function (res) {
                
                me.ArregloVerCodigos = res.data
                me.popupDetalleVerificacion = false;
                me.popupVerCodigos = true;
                me.$vs.loading.close()

                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                })
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
      
           
         },
         getDetallesVerificacion(tr){
            let me = this;
            me.popupVerificaciones = false;
            me.verificacion_id = tr.id
            me.$vs.loading();
            me.title = "Verificacion N. "+tr.num_verificacion + " del contrato "+ tr.contrato
            this.$http.get(this.$server_url+'n_verificacion?contrato='+tr.contrato+'&detalles=yes&verificacion_id='+tr.num_verificacion)
            .then(function (res) {
                me.DetalleVerificacion = res.data
                me.popupDetalleVerificacion = true
                me.$vs.loading.close()

                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                })
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
         }      
            
           
      
    },
}
</script>