<template>
    <vx-card>
      <h1 style="text-align:center;font-weight:500;">Ticket #{{ticket_id}} - {{asunto}}</h1>
      <br><br>
      <vx-card>
          <div v-if="estado_ticket == '1'">
              <vs-collapse>
                  <vs-collapse-item>
                      <div slot="header">
                          <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Responder</span> </p>
                      </div>
                      <div>
                          <vs-row>
                              <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                  <vs-input label="Nombre" disabled v-model="usuario_ticket" style="width:90%;" placeholder="Nombre"/>
                              </vs-col>
                              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                  <vs-input label="Email" disabled v-model="email_ticket" style="width:90%;" placeholder="Email"/>
                              </vs-col>
                          </vs-row>
                          <br>
                          <vs-row>
                              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                              <vs-textarea counter="500" style="width:95%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="respuesta" />
                              </vs-col>
                          </vs-row>
                          <vs-row>
                              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                  <vs-button @click="respuestaTicket()" type="gradient">Responder</vs-button>
                              </vs-col>
                          </vs-row>
                      </div>
                  </vs-collapse-item>
              </vs-collapse>
            </div>
          <div v-else>
              <p style="color:coral;">No se puede Responder un ticket cerrado</p>
          </div>
      </vx-card>
      <br>
      <div v-if="tickets.length >0">
          <div :key="indextr" v-for="(tr, indextr) in tickets">
          <!--REPSPUESTA-->
              <vs-card>
                  <vs-row>
                      <vs-col vs-type="flex" vs-justify="space-between" vs-align="center" vs-w="12">
                          <div>
                              <p style="color:#9CC5E5;margin-left:10px;" v-if="ticketAyuda == 'no'"><i class="fa fa-user" aria-hidden="true"> <span style="margin-left:3px;">{{tr.usuario}}</span> </i></p>
                              <vs-chip v-if="tr.group_id == '1'" style="margin:10px 10px;" transparent color="primary">
                                  Soporte
                              </vs-chip>
                              <vs-chip v-else style="margin:10px 10px;" transparent color="danger">
                                  {{tr.rol}}
                              </vs-chip>
                          </div>
                          <div>
                              {{ tr.fecha }}
                          </div>
                      </vs-col>
                  </vs-row>
                  <vs-divider position="left">
                  </vs-divider>
                  <vs-row>
                      <div>
                          <p>
                          {{ tr.descripcion }}
                          </p>
                      </div>
                  </vs-row>
              </vs-card>
          </div>
      </div>
      <div v-else>
          <vs-card>
                <p style="color:coral;">No hay respuestas para mostrar</p>
          </vs-card>
      </div>
    </vx-card>
</template>
<script>
export default {
data() {
    return{
        usuario:[],
        respuesta: '',
        counterDanger: false,
        ticket_id:0,
        asunto:'',
        tickets:[],
        usuario_ticket:'',
        email_ticket:'',
        estado_ticket:'',
        ticketAyuda:'',
    }
},
  methods: {
        //para obtener el listado de las respuestas de los  tickets
        getTicketsRespuesta() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'ticket?RespuestaTicketAbierto=yes&ticket_id='+me.ticket_id)
                .then(function (res) {
                    me.tickets = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        respuestaTicket(){
          let me = this;
            if(me.respuesta.length >= 500){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo del ticket debe tener un maximo de 500 caracteres'
                    })
                return false;
            }
             if(me.respuesta.length < 2){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El motivo del ticket debe tener al menos 2 caracteres.'
                    })
                return false;
            }
            let formData = new FormData();
            formData.append('ticket_id',      me.ticket_id);
            formData.append('descripcion',    me.respuesta);
            formData.append('soporte'         ,"yes");
            formData.append('usuario_id',     me.usuario.idusuario);
            formData.append('group_id',       me.usuario.id_group);
            me.$vs.loading();
            this.$http.post(this.$server_url+'ticket', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.respuesta = "";
                    if(me.usuario.id_group == '1'){
                        me.estado_ticket = localStorage.getItem("estado_ticket");
                    }else{
                        me.estadoTicket();
                    }
                    me.getTicketsRespuesta();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        estadoTicket(){
            let me = this;
            this.$http.get(this.$server_url+`getInfoTicket/${me.ticket_id}`)
             .then(function (res) {
              if(res.data.length == 0){
                  return false;
              }
              me.estado_ticket = res.data[0].estado
              })
              .catch(function (error) {
                  console.log(error + ' error');
              })
        }
  },
  created () {
      let me =this;
      me.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.ticket_id = localStorage.getItem("ticket_id");
      me.asunto = localStorage.getItem("asunto");
      me.usuario_ticket = localStorage.getItem("usuario_ticket");
      me.email_ticket = localStorage.getItem("email_ticket");
      me.ticketAyuda = localStorage.getItem("ticketAyuda");
      if(me.usuario.id_group == '1'){
          me.estado_ticket = localStorage.getItem("estado_ticket");
      }else{
          me.estadoTicket();
      }
      me.getTicketsRespuesta();
  },
}
</script>
