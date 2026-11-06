<template>
    <div>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-card>
                    <div style="display:flex;margin-left:20px;">
                        <div>
                            <vs-input icon="search" placeholder="Buscar Contrato" v-model ="contrato"/>
                        </div>
                        <div>
                            <vs-button radius color="primary" @click="getInformacionLiquidacion()" type="border" style="margin-left:10px;" icon="search"></vs-button>
                        </div>  
                    </div>
                </vs-card>
            </vs-col>
        </vs-row>

        
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
                <vs-alert active="true">
                           <vs-list-item title="Primer paso" subtitle ="Si ya existe codigos a donde desea transpasar Cree una nueva verificacion"></vs-list-item>
                            <vs-list-item title="Segundo paso" subtitle="Pase los codigos a la nueva verificacion creada"></vs-list-item>
                           <vs-list-item title="Tercer paso" subtitle="Vaya a la verificacion anterior y mueva a la verificacion deseada"></vs-list-item>
                </vs-alert>
            </vs-col>
        </vs-row>
     
        <vs-row class="mt-5">
            
            <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="6">
                <vs-card>
                    <div class="header">
                       <p>Verificacion anterior</p>
                    </div>
                     <vs-table max-items="10" v-if="liquidacionAnterior.length > 0" search pagination :data="liquidacionAnterior">
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
                                        <vx-tooltip style="display: inline-block;" text="transpasar liquidacion" position="top" color="warning">
                                            <vs-button radius color="warning" type="line" icon-pack="feather" @click="modalTranspasar(tr,0)" icon="icon-bookmark"></vs-button>
                                        </vx-tooltip>
                                    </vs-td>      
                                </vs-tr>
                            </template>
                    </vs-table> 
                </vs-card>
            </vs-col>
              <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="6">
                <vs-card>
                    <div class="header">
                        <div style="display:flex;">
                            <p>Verificacion nueva</p>
                            <vs-button class="ml-5" color="success" style="border-radius:20px;margin-top:-8px;" @click="confirmAgregarVerificacion()" icon="add" type="line">Crear verificacion</vs-button>
                        </div>
                    
                    </div>
                     <vs-table max-items="10" v-if="liquidacionNueva.length > 0" search pagination :data="liquidacionNueva">
                     
                         
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
                                    <vx-tooltip style="display: inline-block;" text="transpasar liquidacion" position="top" color="warning">
                                        <vs-button radius color="warning" type="line" icon-pack="feather" @click="modalTranspasar(tr,1)" icon="icon-bookmark"></vs-button>
                                    </vx-tooltip>
                                </vs-td>      
                            </vs-tr>
                        </template>
                    </vs-table> 
                </vs-card>
            </vs-col>
          
        </vs-row>
        <!--MODALES-->
        
            <vs-popup 
            background-color="rgba(255,255,255,.6)"
            :title="titulo" :active.sync="popupTranspasar" fullscreen>
                <vs-card>
                    <div class="header">
                      <p>SELECCIONE LA VERIFICACION A TRANSPASAR</p>
                    </div>
                    <vs-table v-if="liquidacionNueva.length > 0" max-items="10" search pagination :data="liquidacionNueva">
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
                                        <vs-button type="relief" @click="modalSeleccionar(tr)">Enviar codigos</vs-button>
                                    </vs-td>      
                                </vs-tr>
                            </template>
                    </vs-table> 
                    <vs-divider>LIQUIDACION A TRANSPASAR</vs-divider>
                    <vs-table max-items="10" search pagination :data="dataTranspaso">
                        <template slot="header">
                            <p>Cantidad <span>{{dataTranspaso.length}}</span></p>
                        </template>
                        <template slot="thead">
                            <vs-th>num. verificacion</vs-th>
                            <vs-th>Contrato</vs-th>
                            <vs-th>codigo</vs-th>
                            <vs-th>Cantidad</vs-th>
                            <vs-th>Libro</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                
                                <vs-td>
                                    {{data[indextr].verificacion_id}}<br>
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].contrato}}<br>
                                </vs-td>
                                <vs-td>
                                    {{tr.codigo}}
                                </vs-td>
                                    <vs-td>
                                    {{tr.cantidad}}
                                </vs-td>
                                <vs-td>
                                    {{ tr.nombre_libro }}
                                </vs-td>     
                            </vs-tr>
                        </template>
                </vs-table> 
                </vs-card>
            </vs-popup>
    </div>
</template>

<script>

export default {
    data() {
       return{
           contrato:'',
           liquidacionAnterior:[],
           liquidacionNueva:[],
           dataTranspaso:[],
           popupTranspasar:false,
           titulo:'',
           usuario:[],
       } 
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    methods:{
        getInformacionLiquidacion() {
            let me = this;
            me.liquidacionAnterior = [];
            me.liquidacionNueva = [];
            if(me.contrato == ""){
                me.$vs.notify({
                        text: "Ingrese un contrato por favor",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                return false;
            }
            localStorage.setItem('contrato',me.contrato)
            me.$vs.loading();
            this.$http.get(this.$server_url+'changeLiquidacion?contrato='+me.contrato)
                .then(function (res) {
                    let datos = res.data
                    me.liquidacionAnterior = datos.filter(p => p.nuevo == '0')
                    me.liquidacionNueva   = datos.filter(p => p.nuevo == '1')
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
         modalTranspasar(tr,nuevo){
             let me = this
             if(tr.estado == 1){
                me.$vs.notify({
                    text: "No se puede transpasar una verificacion abierta",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                })
                return false
             }
              this.$http.get(this.$server_url+'changeLiquidacion?contrato='+me.contrato+'&datosTranspasar=yes'+'&num_verificacion='+tr.num_verificacion+'&nuevo='+nuevo)
                .then(function (res) {
                    me.dataTranspaso = res.data
                })
            .catch(function (error) {
                console.log(error + ' error');
            })
            localStorage.setItem('num_verificacion_anterior',tr.num_verificacion)
            localStorage.setItem('id_verificacion_anterior',tr.id)
            localStorage.setItem('contrato',tr.contrato)
            localStorage.setItem('nuevo',nuevo)
            me.titulo ='Transpasar verificacion numero '+tr.num_verificacion +' del contrato '+tr.contrato
            me.popupTranspasar = true
         },
         modalSeleccionar(tr){
            let me = this;
            this.$http.get(this.$server_url+'changeLiquidacion?contrato='+me.contrato+'&datosTranspasar=yes'+'&num_verificacion='+tr.num_verificacion+'&nuevo=1')
                .then(function (res) {
                    let datos = res.data.length
                    localStorage.setItem('validaDatos',datos)         
                     
                })
            .catch(function (error) {
                console.log(error + ' error');
            })

             if(tr.estado == 1){
                me.$vs.notify({
                    text: "No se puede transpasar una verificacion abierta",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                })
                return false
             }

               localStorage.setItem('num_verificacion_nueva',tr.num_verificacion)
                localStorage.setItem('id_verificacion_nuevo',tr.id)
                me.popupTranspasar = false
                this.$vs.dialog({
                    type:'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    text: 'Esta seguro de tranpasar esta liquidacion',
                    accept:this.changeLiquidacion,
                    cancel:this.cancelar
                })
         

           
         },
         cancelar(){
           let me = this;
           me.popupTranspasar = true  
         },

         confirmAgregarVerificacion(){
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
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro de crear una verificacion para este contrato',
                accept:this.CrearVerificacion,
                
            })
         },

         CrearVerificacion(){
              let me = this;
            let formData = new FormData();
            formData.append('contrato',localStorage.contrato);
              me.$vs.loading()
              this.$http.post(this.$server_url+'crearVerificacion', formData)
              .then(res => {
                me.dataTranspaso = []
                me.$vs.loading.close()
                me.getInformacionLiquidacion()
                me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
              })
               .catch(function (error) {
                 me.$vs.loading.close()
                console.log(error + ' error');
            })
         },

        changeLiquidacion(){
            let me = this;
            let datos = localStorage.validaDatos
            if(datos > 0){
                    me.$vs.notify({
                    text: "No se puede transpasar por que la verificacion tiene datos",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                })
                return false
            }
            let formData = new FormData();
            formData.append('contrato',localStorage.contrato);
            formData.append('num_verificacion_anterior',localStorage.num_verificacion_anterior);
            formData.append('num_verificacion_nueva',localStorage.num_verificacion_nueva);
            formData.append('id_verificacion_anterior',localStorage.id_verificacion_anterior);
            formData.append('id_verificacion_nuevo',localStorage.id_verificacion_nuevo); 
            formData.append('nuevo',localStorage.nuevo);   
            formData.append('usuario_editor',me.usuario.idusuario);
              me.$vs.loading()
              this.$http.post(this.$server_url+'guardarChangeLiquidacion', formData)
              .then(res => {
                  
                me.popupTranspasar = false
                me.dataTranspaso = []
                me.$vs.loading.close()
                me.getInformacionLiquidacion()
                me.$vs.notify({
                text:'Se transpaso correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
              })
               .catch(function (error) {
                 me.$vs.loading.close()
                console.log(error + ' error');
                })
        }
    },

}
</script>