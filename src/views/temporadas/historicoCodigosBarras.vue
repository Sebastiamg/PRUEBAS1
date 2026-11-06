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
                    </div>
                    <div>
                        <br><br>
                            <vs-chip transparent color="danger" class="ml-5">
                              Cantidad Verificaciones:  <span style="font-weight: bold;margin-left: 4px;"> {{  contContrato }}</span>

                            </vs-chip>
                            <br/>
                            
                        <vs-table max-items="10" search pagination :data="InformacionLiquidacion" style="margin-top:-40px">
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
                                        <vx-tooltip style="display: inline-block;" text="Detalle de la verificación" position="top" color="warning">
                                            <vs-button radius color="warning" type="line" icon-pack="feather" @click="getDetallesVerificacion(tr)" icon="icon-bookmark"></vs-button>
                                        </vx-tooltip>
                                    </vs-td>      
                                </vs-tr>
                            </template>
                        </vs-table> 
                        <br><br> <br><br> 
                    </div>
                </vs-collapse-item>

           
             
            </vs-collapse>
        </vs-card>
        <!--MODALES-->
        <!--MODAL PARA DETALLES DE LA VERIFICACION -->
        <vs-popup
          :title="title" fullscreen :active.sync="popupDetalleVerificacion">
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
export default {
    data() {
      return{
          contrato:'',
          InformacionLiquidacion:[],
          DetalleVerificacion:[],
          ArregloVerCodigos:[],
          popupDetalleVerificacion:false,
          popupVerCodigos:false,
          title:'',
          title2:'',
          verificacion_id:0,
          contContrato:0,
      }  
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
    methods: {
        
        getInformacionLiquidacion() {
            let me = this;
            me.InformacionLiquidacion = [];
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
            this.$http.get(this.$server_url+'bc_verificacion?contrato='+me.contrato+'&informacion=yes')
                .then(function (res) {
                    
                    me.InformacionLiquidacion = res.data
                    me.contContrato = res.data.length
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

         VerCodigos(tr){
            let me  = this;  
            me.$vs.loading();
            me.title2 = "Códigos del libro "+tr.nombre_libro
            this.$http.get(this.$server_url+'bc_verificacion?contrato='+tr.contrato+'&verCodigos=yes&verificacion_id='+me.verificacion_id+'&libro_id='+tr.libro_id+'&num_verificacion='+tr.num_verificacion)
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
            me.verificacion_id = tr.id
            me.$vs.loading();
            me.title = "Verificacion N. "+tr.num_verificacion + " del contrato "+ tr.contrato
            this.$http.get(this.$server_url+'bc_verificacion?contrato='+tr.contrato+'&detalles=yes&verificacion_id='+tr.id)
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