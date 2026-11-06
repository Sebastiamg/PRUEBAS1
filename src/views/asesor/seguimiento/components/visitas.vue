<template>
    <div>
     <vs-row>
    
        <p @click="popupAgregarSeguimiento = true;update = false;" style="cursor:pointer" v-if="usuario.id_group == 1">
            <vs-chip color="primary" style="cursor:pointer"  class="mt-2">
                <vs-avatar icon="edit"  @click="popupAgregarSeguimiento = true;"/>
                Agregar {{valor}}
            </vs-chip>
        </p> 
       

        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
             <vs-table stripe :data="visitas" search pagination max-items="10" style="width: 100%;">
                <template slot="header">
                    
                    <vs-list>
                        <vs-list-header title="Información"></vs-list-header>
                        <vs-list-item title="Institución" :subtitle="institucion"></vs-list-item>
                        <vs-list-item title="Período" :subtitle="periodo"></vs-list-item>
                        <vs-list-item :title="valor +' ' + 'cantidad'" :subtitle="visitas.length"></vs-list-item>
                    </vs-list>

                </template>
                
                <template slot="thead">
                    <vs-th>
                    {{valor}}
                    </vs-th>
                    <vs-th>
                    Fecha Genera {{valor}}
                    </vs-th>
                    <vs-th>
                    Fecha {{valor}}
                    </vs-th>
                    <vs-th>
                    Observación
                    </vs-th>
                    <vs-th>
                    Estado
                    </vs-th>
                    <vs-th>
                    Acciones
                    </vs-th>

                </template>
            
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                        <vs-td :data="data[indextr].num_visita" width="20%">
                           
                            <vs-chip color="primary">
                            {{valor}} Nº {{data[indextr].num_visita}}
                            </vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].fecha_genera_visita" width="20%">
                            {{data[indextr].fecha_genera_visita}}
                        </vs-td>

                        <vs-td :data="data[indextr].fecha_que_visita" width="20%">
                            {{data[indextr].fecha_que_visita}}
                        </vs-td>

                        <vs-td height="30%" width="50%">
                            <div class="overflow-y-auto h-24">
                                {{tr.observacion}}
                               
                            </div>
                        </vs-td>
                        <vs-td>
                            <vs-chip :color="tr.estado == '0'?'success':'warning'">
                                {{ tr.estado == '0' ? 'Generada' :'Finalizada' }}
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                            <div style="display:flex;">
                                <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                    <vs-button radius color="success" @click="openModalEdit(tr);update = true" type="line" icon="edit"></vs-button>
                                </vx-tooltip> &nbsp;  
                                <vx-tooltip style="display: inline-block;" :text="'Eliminar '+valor" position="top" color="danger">
                                    <vs-button radius color="danger" @click="openConfirm(tr)" type="line" icon="delete"></vs-button>
                                </vx-tooltip> &nbsp;  
                            </div>
                         
             
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
    </vs-row>

    
    <!--MODALES-->
    <!--MODAL PARA AGREGAR SEGUIMIENTO-->
    <vs-popup
        :title="title" :active.sync="popupAgregarSeguimiento">

            <vs-row>
                <p class="ml-2">Fecha generar {{valor}}</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <flat-pickr :config="configdateTimePicker" v-model="Fgenerar"  :placeholder="titleFechaGenera" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">    
                <p class="ml-2">Observación</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            
                <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="generarSeguimiento()" type="gradient">Generar {{valor}}</vs-button>
                </vs-col>
            </vs-row>
        
    </vs-popup>

    <!--MODAL PARA Editar SEGUIMIENTO-->
    <vs-popup
         :title="title" :active.sync="popupEditarSeguimiento">

            <vs-row>
                <p class="ml-2">Fecha generar {{valor}}</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <flat-pickr :config="configdateTimePicker" v-model="Fgenerar"  :placeholder="titleFechaGenera" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
             <vs-row>
                <p class="ml-2">Fecha de la {{valor}}</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                   <flat-pickr :config="configdateTimePicker" v-model="Fvisita"  :placeholder="titleFechaVisita" class="m-1" style="display: inline-block;width: 100%;" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">    
                <p class="ml-2">Observación</p>
                <vs-col  class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="generarSeguimiento()" type="gradient">Generar {{valor}}</vs-button>
                </vs-col>
            </vs-row>
        
    </vs-popup>
       
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    data() {
       return{
           counterDanger: false,
           visitas:[],
           institucion:'',
           institucion_id:'',
           periodo:'',
           periodo_id:'',
           usuario:[],
           popupAgregarSeguimiento:false,
           popupEditarSeguimiento:false,
            Fgenerar: null,
            Fvisita: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            seguimiento:{
                observacion:''
            },
            id:0,
            update:false,
            title:'',
            titleFechaGenera:'',
            titleFechaVisita:'',
            isAdmin:'',
            asesorDesdeAdmin:'',
          

       } 
    },
    props:{
        tipo:{
            type:String,
            default:1
        },
        valor:{
            type:String,
            default:"Visita"
        }
    },
      components:{
        flatPickr,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.institucion = localStorage.getItem("institucion_seguimiento_nombre")
        me.institucion_id = localStorage.getItem("institucion_seguimiento_id")
        me.periodo = localStorage.getItem("institucion_seguimiento_periodo")
        me.periodo_id = localStorage.getItem("institucion_seguimiento_periodo_id")
        me.isAdmin = localStorage.getItem("adminSeguimiento")
        
        me.getVisitas()
        me.title = "Genera"+" " +me.valor
        me.titleFechaGenera = "Fecha generar"+ " " +me.valor
        me.titleFechaVisita = "Fecha visita" + " " +me.valor
    }, 
    methods:{
        //cantidad de escuelas del asesor
        async getVisitas() {
            let me = this;
            if(me.isAdmin == "yes"){
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id") 
            }else{
                me.asesorDesdeAdmin = me.usuario.idusuario
            }
            
            this.$http.get(this.$server_url+'asesor/seguimiento?institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id+'&asesor_id='+me.asesorDesdeAdmin)
                .then(function (response) {
                    let datos = response.data;
                    me.visitas = datos.filter(p => p.tipo_seguimiento == me.tipo) 
                })
                .catch(function (error) {
                    
                })
        },
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de Eliminar',
                accept:this.eliminar,
                acceptText:"Aceptar",
                cancelText:"Cancelar"
            })
        },        
     //para eliminar la area
         eliminar() {
              let me = this;
              let formData = new FormData();
              formData.append('id',me.id);
              this.$http.post(this.$server_url+'seguimiento-eliminar', formData)
              .then(res => {

                  me.id = 0
                   this.$vs.notify({
                        text:'Se elimno correctamente',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
            
            if(me.isAdmin == "yes"){
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id") 
            }else{
                me.asesorDesdeAdmin = me.usuario.idusuario
            }
            
            this.$http.get(this.$server_url+'asesor/seguimiento?institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id+'&asesor_id='+me.asesorDesdeAdmin)
                .then(function (response) {
                    let datos = response.data;
                    if(response.data.status == "0"){
                        me.visitas = []
                    }else{
                         me.visitas = datos.filter(p => p.tipo_seguimiento == me.tipo) 
                    }    
                })
                .catch(function (error) {
                    
                })
                 
              })
                .catch(function (error) {
                   
                })
        },

        openModalEdit(tr){
            let me = this;
            me.id = tr.id
            me.Fgenerar = tr.fecha_genera_visita
            me.Fvisita = tr.fecha_que_visita
            me.seguimiento.observacion = tr.observacion
            me.popupEditarSeguimiento  = true;
        },
        generarSeguimiento(){
            let me = this;
            if(me.seguimiento.observacion.length >= 500){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El observación debe tener un maximo de 500 caracteres'
                    })
                return false;
            }
            
            if(me.Fgenerar == null){
                me.$vs.notify({
                text: 'Debe escoger una fecha generar visita',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
            return false;
            }
            //validacion al editar
            if(me.update == true){
         
                if(me.Fgenerar > me.Fvisita){
                    me.$vs.notify({
                        text: 'La fecha de generar visita  no puede mayor  que la fecha de visita',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                       return false;
                }
            }

            
           let formData = new FormData();
            if(me.update = true){
              formData.append('id',    me.id);       
              formData.append('fecha_que_visita',    me.Fvisita);
              //solo si coloca la fecha de visita el estado cambiara a finalizdo
                 if(me.Fvisita == null){
                 }else{
                    formData.append('finalizar',    "yes")
                 }
            }
            formData.append('fecha_genera_visita',    me.Fgenerar);
            formData.append('observacion',            me.seguimiento.observacion);
            formData.append('institucion_id',         me.institucion_id);
            if(me.isAdmin == "yes"){
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id") 
                formData.append('usuario_editor',    me.usuario.idusuario);
                formData.append('admin',    "yes");
            }else{
                me.asesorDesdeAdmin = me.usuario.idusuario
            }
            
            formData.append('asesor_id',              me.asesorDesdeAdmin);
            formData.append('tipo_seguimiento',       me.tipo);
            formData.append('periodo_id',             me.periodo_id);
            
            me.$vs.loading();
            this.$http.post(this.$server_url+'guardarSeguimiento', formData)
                .then(function (res) {
                    
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                   me.popupAgregarSeguimiento = false;
                   me.popupEditarSeguimiento = false;
                   me.getVisitas();
                   me.limpiar()
                    
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
        limpiar(){
            let  me = this;
            me.seguimiento.observacion = ""
            me.Fgenerar = null

        }
    }
}
</script>