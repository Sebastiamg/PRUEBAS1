<template>
    <div>
        <vs-card>
            <vs-collapse accordion >
                <vs-collapse-item>
                <div slot="header">
                    Informacion Liquidación
                </div>
                    <div style="display:flex;margin-left:20px;">
                        <div>
                                <vs-input icon="search" placeholder="Buscar Contrato" v-model ="contrato"/>
                        </div>
                        <div>
                            <vs-button radius color="primary" @click="getInformacionLiquidacion()" type="border" style="margin-left:10px;" icon="search"></vs-button>
                        </div>
                        <div id="codeLost" style="display:none;">
                             <vx-tooltip style="display: inline-block;margin-left:20px;" text="Existe codigos perdidos" position="top" color="primary">
                                <vs-button class="m-1" icon-pack="feather" @click="popupCodigosPerdidos=true;" icon="icon-bell" color="danger" size="small" type="filled">
                                </vs-button>
                            </vx-tooltip>
                        </div> 
                         <div id="codeMove" style="display:none;"> 
                             <vx-tooltip style="display: inline-block;margin-left:20px;" text="codigos movidos a otro contrato" position="top" color="primary">
                                <vs-button class="m-1" icon-pack="feather" @click="popupCodigosMovidos=true;" icon="icon-bell" color="warning" size="small" type="filled">
                                </vs-button>
                            </vx-tooltip>
                        </div>   
                    </div>
                    <div>
                        <br><br>
                            <vs-chip transparent color="danger" >
                              Cantidad Verificaciones:  <span style="font-weight: bold;margin-left: 4px;"> {{  contContrato }}</span>

                            </vs-chip>
                            <br/>



                        
                        <vs-table max-items="10" search pagination :data="InformacionLiquidacion" style="margin-top:-40px">
                            <template slot="thead">
                                
                                <vs-th>Contrato</vs-th>
                                <vs-th>Codigo Liq.</vs-th>
                                <vs-th>Cantidad</vs-th>
                                <vs-th>Desface</vs-th>
                                <vs-th>Num. Verificacion</vs-th>
                                <vs-th>Accion</vs-th>
                        
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    
                                    <vs-td>
                                        {{data[indextr].contrato}}<br>
                                   
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].codigo}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.cantidad}}
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].desface}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].verificacion_id}}<br>
                                    </vs-td>

                                    <vs-td>
                                        <vx-tooltip style="display: inline-block;" text="Historial Codigos" position="top" color="warning">
                                            <vs-button class="m-1" icon-pack="feather" @click="getHistoricoLiquidacion(tr.contrato,tr.codigo)" icon="icon-bookmark" color="warning" size="small" type="filled">
                                            </vs-button>
                                        </vx-tooltip>
                                    </vs-td>
                    
                                
                                    
                                </vs-tr>
                            </template>
                        </vs-table> 
                        <br><br> <br><br> 
                    </div>
                </vs-collapse-item>

                <vs-collapse-item>
                <div slot="header">
                    Verificacion Contrato
                </div>
                     <vs-table max-items="10" search pagination :data="informacionFechasLiquidacion" style="margin-top:-40px">
                            <template slot="thead">
                                
                                <vs-th>Contrato</vs-th>
                                <vs-th>Num. Verificacion</vs-th>
                                <vs-th>Fecha Inicio.</vs-th>
                                <vs-th>Fecha Fin</vs-th>
                             
                        
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
                                        {{data[indextr].fecha_inicio}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{tr.fecha_fin}}
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table> 
                </vs-collapse-item>
             
            </vs-collapse>
        </vs-card>
       
       <!--Modales-->
       <!--Modal historial liquidacion-->
           
            <vs-popup class="holamundo"  title="Historial codigos" fullscreen :active.sync="popupActivo">
                <vs-card>
                
                    <vs-table max-items="10" search pagination :data="historicoLiquidacion" style="margin-top:-40px">
                        <template slot="thead">
                            
                            <vs-th>Contrato</vs-th>
                            <vs-th>Codigo</vs-th>
                            <vs-th>Cod. Liquidac.</vs-th>
                            <vs-th>V1</vs-th>
                            <vs-th>V2</vs-th>
                            <vs-th>V3</vs-th>
                            <vs-th>V4</vs-th>
                            <vs-th>V5</vs-th>
                            <vs-th>V6</vs-th>
                            <vs-th>V7</vs-th>
                            <vs-th>V8</vs-th>
                            <vs-th>V9</vs-th>
                            <vs-th>V10</vs-th>
                    
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                
                                <vs-td>
                                    {{data[indextr].contrato}}<br>
                                    
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].codigo}}<br>
                                </vs-td>
                                <vs-td>
                                    {{tr.codigo_liquidacion}}
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.verif1 >0"> 
                                        <vx-tooltip style="display: inline-block;" text="Ver contrato del codigo" position="top" color="warning">
                                            <vs-button class="m-1" icon-pack="feather" @click="VerContrato(tr.verif1)" icon="icon-check" color="success" size="small" type="filled">
                                            </vs-button>
                                         </vx-tooltip>
                                    </div>   
                                   
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.verif2 >0"> 
                                        <vx-tooltip style="display: inline-block;" text="Ver contrato del codigo" position="top" color="warning">
                                            <vs-button class="m-1" icon-pack="feather" @click="VerContrato(tr.verif2)" icon="icon-check" color="success" size="small" type="filled">
                                            </vs-button>
                                        </vx-tooltip>
                                    </div>
                                   
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.verif3 >0"> 
                                        <vx-tooltip style="display: inline-block;" text="Ver contrato del codigo" position="top" color="warning">
                                            <vs-button class="m-1" icon-pack="feather" @click="VerContrato(tr.verif3)" icon="icon-check" color="success" size="small" type="filled">
                                            </vs-button>
                                        </vx-tooltip>
                                    </div>
                                  
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.verif4 >0"> 
                                        <vx-tooltip style="display: inline-block;" text="Ver contrato del codigo" position="top" color="warning">
                                            <vs-button class="m-1" icon-pack="feather" @click="VerContrato(tr.verif4)" icon="icon-check" color="success" size="small" type="filled">
                                            </vs-button>
                                        </vx-tooltip>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.verif5 >0"> 
                                        <vx-tooltip style="display: inline-block;" text="Ver contrato del codigo" position="top" color="warning">
                                            <vs-button class="m-1" icon-pack="feather" @click="VerContrato(tr.verif5)" icon="icon-check" color="success" size="small" type="filled">
                                            </vs-button>
                                        </vx-tooltip>
                                    </div>
                                </vs-td>                                                            
                            </vs-tr>
                        </template>
                    </vs-table>  
                    
                </vs-card>
            </vs-popup>

            <!-- MODAL CODIGOS PERDIDOS-->
            <vs-popup class="holamundo"  fullscreen title="Informacion de codigos perdidos relacionados a este contrato" :active.sync="popupCodigosPerdidos">
                <div>
                    <vs-table max-items="5" search pagination :data="codigosPerdidos">
                       
                        <template slot="thead">
                            
                            <vs-th>Contrato Anterior</vs-th>
                            <vs-th>Contrato Actual</vs-th>
                            <vs-th>Codigo</vs-th>
                            <vs-th>Estudiante</vs-th>
                            <vs-th>Motivo</vs-th>
                           
                          
                        
                       
                          
                    
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                
                                <vs-td>
                                  
                                    {{data[indextr].contrato_anterior}}<br>
                                    
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].contrato_actual}}<br>
                                </vs-td>
                                <vs-td>
                                    {{tr.codigo_libro}}
                                </vs-td>
                                <vs-td>
                                    <p>{{tr.nombres}} {{tr.apellidos}}</p>
                                    <span>{{tr.cedula}}</span>
                                </vs-td>
                                <vs-td>
                                    {{tr.observacion}}
                                    <div v-if="tr.verificacion_columna == null">
                                       
                                    </div>
                                    <div v-else>
                                         <p>Columna afectada : <span style="font-weight:bold;">{{tr.verificacion_columna}}</span></p>
                                    </div>
                                </vs-td>
                                           
                            </vs-tr>
                        </template>
                    </vs-table>  
                </div>
            </vs-popup>

            <!-- MODAL CODIGOS MOVIDOS-->
            <vs-popup class="holamundo"  fullscreen title="Informacion de codigos movidos a otro contrato" :active.sync="popupCodigosMovidos">
                <div>
                    <vs-table max-items="5" search pagination :data="codigosMovidos">
                       
                        <template slot="thead">
                            
                            <vs-th>Movido desde</vs-th>
                            <vs-th>al contrato</vs-th>
                            <vs-th>Codigo</vs-th>
                            <vs-th>Estudiante</vs-th>
                            <vs-th>Motivo</vs-th>
                          
                    
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                
                                <vs-td>
                                  
                                    {{data[indextr].contrato_anterior}}<br>
                                    
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].contrato_actual}}<br>
                                </vs-td>
                                <vs-td>
                                    {{tr.codigo_libro}}
                                </vs-td>
                                <vs-td>
                                    <p>{{tr.nombres}} {{tr.apellidos}}</p>
                                    <span>{{tr.cedula}}</span>
                                </vs-td>
                                <vs-td>
                                    {{tr.observacion}}
                                    <div v-if="tr.verificacion_columna == null">
                                       
                                    </div>
                                    <div v-else>
                                         <p>Columna afectada : <span style="font-weight:bold;">{{tr.verificacion_columna}}</span></p>
                                    </div>
                                </vs-td>
                                           
                            </vs-tr>
                        </template>
                    </vs-table>  
                </div>
            </vs-popup>


            <!-- MODAL CONTRATO CODIGO-->
         

            <vs-prompt
                title="Contrato del codigo"
                @cancel="close"
                @close="close"
                @accept="close"
                :active.sync="popupContratoCodigo"
            >
                <div>
                  
                    {{ ContratoCodigo.contrato }}    
                   
                </div>
            </vs-prompt>
    </div>
</template>


<script>
import $ from 'jquery'
export default {
    data() {
        return{
            popupActivo:false,
            popupContratoCodigo:false,
            historicoLiquidacion:[],
            InformacionLiquidacion:[],
            informacionFechasLiquidacion:[],
            contrato:"",
            popupCodigosPerdidos:false,
            popupCodigosMovidos:false,
            codigosPerdidos:[],
            ContratoCodigo:[],
            codigosMovidos:[],
            contContrato:0,
        }
    },
    created(){
        let me = this;
        
    },
    methods:{

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

            getInformacionLiquidacion() {
              
                let me = this;
                me.InformacionLiquidacion = [];
                $('#codeLost').css('display', 'none');
                $('#codeMove').css('display', 'none');
                if(me.contrato == ""){
                    me.$vs.notify({
                            text: "Ingrese un contrato por favor",
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                    return false;
                }
                me.$vs.loading();
      
        
                this.$http.get(this.$server_url+'verificacion?contrato='+me.contrato+'&informacion=yes')
                    .then(function (res) {

                        me.InformacionLiquidacion = res.data
                        me.contContrato = res.data[0].contContrato
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

                //para buscar los codigos perdidos relacionados a este contrato
                 this.$http.get(this.$server_url+'liquidacion/codigosperdidos/'+me.contrato)
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
                 this.$http.get(this.$server_url+'liquidacion/codigosmovidos/'+me.contrato)
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
                 this.$http.get(this.$server_url+'verificacion?contrato='+me.contrato+'&fechasVerificacion=yes')
                .then(function (res) {

                    me.informacionFechasLiquidacion = res.data
               
                })
                .catch(function (error) {
                    console.log(error + ' error');
                 
                })
         },   
            
           
        //para obtener el listado historial de las liquidaciones
        getHistoricoLiquidacion(contrato,codigo) {

            let me = this;
            if(me.contrato == ""){
                  me.$vs.notify({
                        text: "Ingrese un contrato por favor",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                return false;
            }
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'verificacion?contrato='+contrato+'&codigo='+codigo)
                .then(function (res) {

                    me.historicoLiquidacion = res.data
                    me.popupActivo = true;
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
    }
}
</script>