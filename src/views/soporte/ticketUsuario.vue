<template>
    <div>
         
        <vs-button v-if="usuario.id_group == '6'" @click="ModalAbrirTicket()"  style="margin-left:10px;"  icon-pack="feather" icon="icon-bookmark" type="gradient">Abrir Ticket</vs-button>
     
        <br/>
        <vs-card>
           

            <div v-if="tickets.length >0 ">
                <br>
                <!-- <vs-button color="dark" @click="limpiar();popupAddTema=true;"   type="filled">Crear Area</vs-button> -->
                <vs-table max-items="10" search pagination :data="tickets" style="margin-top:-40px">
                    <template slot="thead">
                        
             
                        <vs-th>Asunto</vs-th>
                        <vs-th>Codigo</vs-th>
                        <vs-th>Hora ultimo mensaje</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            
                       
                            <vs-td>
           
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                            <vs-td>
                                <div v-if="tr.codigo == '0'">

                                </div>
                                <div v-else>
                                     {{data[indextr].codigo}}<br>
                                </div>
                            </vs-td>
                            <vs-td>
                                {{ tr.ultima_hora }}
                            </vs-td>
                        

                            <vs-td>
                                <div v-if="tr.estado == '1'">
                                    <p>Abierto</p>
                                </div>
                                <div v-else>
                                    <p>Cerrada</p>    
                                </div>
                            </vs-td>

                            <vs-td>
                                <div style="display:flex;">
                             
                           

                                    <vs-button color="success" size="small"  type="relief" @click="SeguimientoTicket(tr.ticket_id,tr.descripcion,tr.usuario,tr.email,tr.estado);;YaviMensaje(tr.ticket_id,tr.cantidad)">Ver Respuestas</vs-button>

                                <div v-if="usuario.id_group == '6'" style="margin-left:5px;">
                                    <vx-tooltip v-if="tr.estado =='1'" style="display: inline-block;"  text="Cerrar ticket" position="top" color="primary">
                                    <vs-button class="modal-default-button" @click="openConfirm(tr.ticket_id)" size="small" color="danger"  type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>

                                <div v-if="tr.cantidad_tickets_usuario < tr.cantidad">
                                    <i class="fa fa-bell"   style="color:red;font-size:20px;cursor-pointer:none; margin:5px 0px 0px 5px;" aria-hidden="true"></i>
                                </div>
                                    

                                </div>
                        
                            </vs-td>
                        
                            
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
            <div v-else class="p-3">
                <p> No existe tickets abiertos aun. </p>
            </div>
        </vs-card>

        <!--Modal-->
        <!--Modal para Abrir el ticket -->
           <vs-prompt
                @cancel="close"
                title="Abrir Ticket"
                @accept="abrirTicket"
                @close="close"
                :active.sync="popupTicket">
                <div class="con-exemple-prompt">
                    <vs-input class="inputx mb-3 w-full" disabled label="Docente" v-model="ticket.usuario" /> 
                    <vs-input class="inputx mb-3 w-full" disabled label="Institucion" v-model="ticket.nombreInstitucion" /> 
                    <vs-input class="inputx mb-3 w-full" label="Codigo (Opcional)" v-model="ticket.codigo" />
                    <vs-input class="inputx mb-3 w-full" label="Motivo del Ticket" v-model="ticket.descripcion" />
                    <vs-textarea counter="500" :counter-danger.sync="counterDanger" style="width:100%;" label="Mensaje (Opcional)" v-model="ticket.observacion" />
                   
    
                </div>
            </vs-prompt>
    </div>
</template>

<script>
export default {
    data() {
      return{
        counterDanger: false,
        popupTicket:false,
        tickets:[],
        usuario:[],
        ticket_id:'',
        ticket:{
            nombreInstitucion:'',
            usuario:'',
            institucion:'',
            codigo:'',
            descripcion:'',
            observacion:'',
            cedula:'',
            idusuario:'',
        },
        cantidadTicketNotificacion:'',
      }  
    },
      created () {
  
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.getTicketsAbiertos();
    },
    methods:{
      //para obtener el listado de los tickets
        getTicketsAbiertos() {
            let me = this;
            me.$vs.loading();
      
            this.$http.get(this.$server_url+'ticket/'+me.usuario.idusuario)
                .then(function (res) {
                    me.tickets = res.data
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })

               this.$http.get(this.$server_url+'ticket?cantidadTicketNotificacion=yes&id='+me.usuario.idusuario)
                .then(function (res) {
                    me.cantidadTicketNotificacion = res.data[0].cantidad
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })

                
        },
        //para dar seguimiento al ticket
        SeguimientoTicket(ticket_id,asunto,usuario,email,estado){
            let me = this;
           
            localStorage.setItem("ticket_id",ticket_id);
            localStorage.setItem("asunto",asunto);
            localStorage.setItem("usuario_ticket",usuario);
            localStorage.setItem("email_ticket",email);
            localStorage.setItem("estado_ticket",estado);
            localStorage.setItem("ticketAyuda","yes");
            me.$router.push('/usuario/ticket/abierto/');

        },

        openConfirm(ticket_id){
            let me =this;
          
            me.ticket_id = ticket_id;
            me.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Estas seguro/a de cambiar de estado el ticket.',
                accept:me.cerrarTicket
            })
      },
        cerrarTicket(){
           
             let me = this;
            me.$vs.loading();
      
            this.$http.get(this.$server_url+"ticket?estadoChange=yes&estado=0&ticket_id="+me.ticket_id)
                .then(function (res) {
                                   
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Ticket cambiado con exito',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})

                    me.getTicketsAbiertos();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
         YaviMensaje(ticket_id,cantidad){
              let me = this;
            me.$vs.loading();
      
            this.$http.get(this.$server_url+"ticket?yaviMensaje=yes&ticket_id="+ticket_id+'&cantidad='+cantidad)
                .then(function (res) {
                                   
                    me.$vs.loading.close()
                  
                    me.getTicketsAbiertos();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        ModalAbrirTicket(){
            let me = this;
             this.$http.get(this.$server_url+"ticket?informacionUsuario=yes&idusuario="+me.usuario.idusuario)
                .then(function (response) {

                     if(response.data.realizarTicket == 'ok'){
                                //Para abrir un ticket
                                me.ticket.idusuario = response.data.datosEstudiante[0].idusuario;
                                me.ticket.usuario = response.data.datosEstudiante[0].usuario;
                                me.ticket.institucion = response.data.datosEstudiante[0].idInstitucion;
                                me.ticket.nombreInstitucion = response.data.datosEstudiante[0].nombreInstitucion;
                                me.ticket.cedula = response.data.datosEstudiante[0].cedula;
                                me.popupTicket = true;         
                    }
                    else{
                        me.$vs.notify({
                        color: 'primary',
                        title: 'Mensaje',
                        text: 'Tiene un ticket abierto.'
                        })
                    }
                
                   ;
                })
                .catch(function (error) {
                    console.log(error + ' error');

                })
        },

           async abrirTicket(){
            
            let me = this;

             if(me.ticket.codigo.length >= 20){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El codigo no puede superar los 20 caracteres.'
                    })
                return false;
            }
             if(me.ticket.codigo.length >= 25){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El codigo no puede superar los 25 caracteres.'
                    })
                return false;
            }

            if(me.ticket.descripcion.length >= 200){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo no puede superar los 200 caracteres.'
                    })
                return false;
            }

              if(me.ticket.observacion.length >= 500){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'La descripcion del ticket debe tener máximo menos 500 caracteres.'
                    })
                return false;
            }

            if(me.ticket.descripcion.length < 5){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo del ticket debe tener al menos 5 caracteres.'
                    })
                return false;
            }

            let formData = new FormData();
          
                formData.append('cedula',         me.ticket.cedula);
                formData.append('institucion_id', me.ticket.institucion);
                formData.append('usuario_id',     me.ticket.idusuario);
                formData.append('group_id',       "6");
                formData.append('descripcion',    me.ticket.descripcion);
                formData.append('codigo',         me.ticket.codigo);
                formData.append('observacion',    me.ticket.observacion);
                formData.append('nombreInstitucion',me.ticket.nombreInstitucion);
    
            this.$http.post(this.$server_url+'ticket', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getTicketsAbiertos();
                    me.popupTicket=false;
                    me.ticket.observacion = "";
                    me.ticket.cedula = "";
                    me.ticket.institucion = "";
                    me.ticket.idusuario = "";
                    me.ticket.descripcion = "";
                    
                  
                })
                .catch(function (error) {})

        },

        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },

    },
}
</script>