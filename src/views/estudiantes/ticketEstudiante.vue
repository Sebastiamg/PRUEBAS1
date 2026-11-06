<template>
    <div>

        <div v-if="tickets.length >0 ">
            <vs-table max-items="10" search pagination :data="tickets">
                <template slot="thead">
                    <vs-th>Asunto</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                        <vs-td>
                            <p style="font-weight:600; color:#1e293b; margin:0 0 4px;">{{ tr.descripcion }}</p>
                            <p style="margin:0; font-size:12px; color:#94a3b8;">Código: {{ tr.codigo }} &middot; {{ tr.fecha_ticket }}</p>
                        </vs-td>

                        <vs-td>
                            <span v-if="tr.estado == '1'" style="display:inline-block; padding:4px 12px; border-radius:999px; background:#fef3c7; color:#92400e; font-size:12px; font-weight:600; white-space:nowrap;">Abierto</span>
                            <span v-else style="display:inline-block; padding:4px 12px; border-radius:999px; background:#e2e8f0; color:#475569; font-size:12px; font-weight:600; white-space:nowrap;">Cerrada</span>
                        </vs-td>

                        <vs-td>
                            <div style="display:flex;">
                                <vx-tooltip style="display: inline-block;" text="Siguimiento del ticket" position="top" color="primary">
                                  <vs-button class="modal-default-button" size="small" color="success" @click="SeguimientoTicket(tr.ticket_id,tr.descripcion,tr.usuario,tr.email,tr.estado)" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                </vx-tooltip> &nbsp;


                                <vx-tooltip v-if="tr.estado =='1'" style="display: inline-block;"  text="Cerrar ticket" position="top" color="primary">
                                  <vs-button class="modal-default-button" @click="openConfirm(tr.ticket_id)" size="small" color="danger"  type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                </vx-tooltip> &nbsp;

                            </div>

                        </vs-td>


                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else style="text-align:center; padding:40px 10px; color:#94a3b8;">
            <vs-icon icon="mail" size="32px" color="#cbd5e1"></vs-icon>
            <p style="margin:8px 0 0;">No tienes tickets abiertos por ahora.</p>
         </div>
    </div>
</template>

<script>
export default {
    data() {
      return{
        tickets:[],
        usuario:[],
        ticket_id:'',
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
        }
    },
}
</script>
