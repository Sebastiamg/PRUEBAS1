<template>
  <div>
    <div v-if="tickets.length > 0">
      <br>
      <p style="font-size:14px;">Cantidad: <span style="color:coral;font-weight:bold;">{{ cantTickets }}</span></p>
      <br />
      <vs-table max-items="10" search pagination :data="tickets" style="margin-top:-40px">
        <template slot="thead">
          <vs-th>Ticket #</vs-th>
          <vs-th>Datos</vs-th>
          <!-- <vs-th>Asunto</vs-th>
          <vs-th>Codigo</vs-th>
          <vs-th>Hora ultimo mensaje</vs-th> -->
          <vs-th>Usuario</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              # {{ data[indextr].ticket_id }}<br>
              <p>{{ tr.fecha_ticket }}</p>
            </vs-td>
            <vs-td>
              <vs-td>
                <div>
                  <div v-if="tr.codigo == '0'">
                  </div>
                  <div v-else>
                    <b>{{ data[indextr].codigo }}</b>
                  </div>
                  <div v-if="tr.ultima_hora">
                    <small>Last message: </small> {{ tr.ultima_hora }}
                  </div>
                </div>
                <div>
                  {{ data[indextr].descripcion }}<br>
                  <p v-if="tr.datos_ticket > 0" @click="verDetalles(tr)" class="cursor-pointer mt-1">
                    <vs-chip transparent color="primary">Ver detalles</vs-chip>
                  </p>
                </div>
                <p>{{ data[indextr].rol }}</p>
              </vs-td>
            </vs-td>
            <vs-td>
              <p style="color:coral;font-size:12px;letter-spacing:1px;">Nombre: <span
                  style="color:#2A9FF6;letter-spacing:0px;">{{ tr.usuario }}</span></p>
              <p style="color:coral;font-size:12px;letter-spacing:1px;">Cedula: <span
                  style="color:#2A9FF6;letter-spacing:0px;">{{ tr.cedula }}</span></p>
              <p style="color:coral;font-size:12px;letter-spacing:1px;">Email: <span
                  style="color:#2A9FF6;letter-spacing:0px;">{{ tr.email }}</span></p>
              <p style="color:coral;font-size:12px;letter-spacing:1px;">Institucion: <span
                  style="color:#2A9FF6;letter-spacing:0px;">{{ tr.nombreInstitucion }}</span></p>
            </vs-td>
            <vs-td>
              <div style="display:flex;">

                <vx-tooltip style="display: inline-block;" text="Detalles" position="top" color="primary">                
                  <vs-button class="modal-default-button mr-1" size="small" color="primary"
                    @click="abrirModalConCodigo(tr.codigo)" type="filled" icon-pack="feather" icon="icon-search">
                  </vs-button>
                </vx-tooltip>
                <vx-tooltip style="display: inline-block;" text="Seguimiento del ticket" position="top" color="primary">
                  <vs-button class="modal-default-button" size="small" color="success"
                    @click="SeguimientoTicket(tr); YaviMensaje(tr.ticket_id, tr.cantidad)" type="filled"
                    icon-pack="feather" icon="icon-edit"> </vs-button>
                </vx-tooltip> &nbsp;
                <vx-tooltip style="display: inline-block;" text="Cerrar ticket" position="top" color="primary">
                  <vs-button class="modal-default-button" size="small" @click="openConfirm(tr.ticket_id)" color="danger"
                    type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                </vx-tooltip> &nbsp;
                <div>
                  <vs-button v-if="tr.cantidad_tickets_admin < tr.cantidad" class="modal-default-button"
                    style="cursor-pointer:none;display: inline-block;" size="small" color="warning" type="flat"
                    icon-pack="feather" icon="icon-bell">
                  </vs-button>
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
    <!--Modales-->
    <!--Modal para Seguimiento del ticket -->
    <vs-popup class="holamundo" fullscreen title="Historial de mensajes del ticket"
      :active.sync="popupSeguimientoTicket">
      <div>
        <vx-card class="mb-3">
          <h2 style="text-align:center;font-weight:500;">Ticket #{{ ticket_data.ticket_id }}</h2>
          <h4 class="mt-3 text-center">{{ ticket_data.descripcion }}</h4>
          <p class="text-center"> {{ ticket_data.fecha_ticket }} </p>
          <h3 class="mt-3 text-center">
            {{ ticket_data.codigo }}
          </h3>
        </vx-card>
        <vx-card>
          <div v-if="ticket_data.estado == '1'">
            <div>
              <!-- <div slot="header">
                <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Responder</span> </p>
              </div> -->
              <div>
                <vs-row>
                  <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                    <vs-input label="Nombre" disabled v-model="ticket_data.usuario" style="width:90%;"
                      placeholder="Nombre" />
                  </vs-col>
                  <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                    <vs-input label="Email" disabled v-model="ticket_data.email" style="width:90%;"
                      placeholder="Email" />
                  </vs-col>
                </vs-row>
                <br>
                <vs-row>
                  <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-textarea counter="500" style="width:95%;" rows="4" label="Mensaje"
                      :counter-danger.sync="counterDanger" v-model="respuesta" />
                  </vs-col>
                </vs-row>
                <vs-row>
                  <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="respuestaTicket()" type="gradient">Responder</vs-button>
                    <vs-button @click="respuestaTicketCerrar()" v-if="usuario.id_group == 1" color="dark" class="ml-2"
                      type="gradient"><i class="fa-solid fa-circle-xmark"></i> Responder y cerrar</vs-button>
                  </vs-col>
                </vs-row>
                <vs-row>
                  <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-6">
                    <div class="flex flex-wrap justify-center">
                      <div v-for="resp in respuestas_rapidas" :key='resp.id' class="m-2">
                        <vs-button type="border" @click="f_get_resp(resp)">{{ resp.key }}</vs-button>
                      </div>
                    </div>
                  </vs-col>
                </vs-row>
              </div>

            </div>
          </div>
          <div v-else>
            <p style="color:coral;">No se puede Responder un ticket cerrado</p>
          </div>
        </vx-card>
        <br>
        <div v-if="ticketSeguimiento.length > 0">
          <div :key="indextr" v-for="(tr, indextr) in ticketSeguimiento">
            <!--REPSPUESTA-->
            <vs-card>
              <vs-row>
                <vs-col vs-type="flex" vs-justify="space-between" vs-align="center" vs-w="12">
                  <div>
                    <p style="color:#9CC5E5;margin-left:10px;" v-if="ticketAyuda == 'no'"><i class="fa fa-user"
                        aria-hidden="true"> <span style="margin-left:3px;">{{ tr.usuario }}</span> </i></p>
                    <vs-chip v-if="tr.group_id == '1'" style="margin:10px 10px;" transparent color="primary">
                      Soporte
                    </vs-chip>
                    <vs-chip v-else style="margin:10px 10px;" transparent color="danger">
                      {{ tr.rol }}
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
      </div>
    </vs-popup>
    <!--Modal para ver el codigo-->
    <vs-popup class="holamundo" fullscreen title="Detalle del código" :active.sync="popupVerCodigo">
      <vs-card>
        <gestionCodigosLista :arregloCodigos="arregloInfoCodigo" />
      </vs-card>
    </vs-popup>
    <!-- Modal que contiene el componente hijo -->
    <vs-popup title="Información del Código" :active.sync="mostrarModal" @close="cerrarModal">
      <codigo-libro-info :codigo="codigoSeleccionado" />
    </vs-popup>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import gestionCodigosLista from '../codigos/components/utils/gestionCodigosLista.vue';
import { error } from 'jquery';
import CodigoLibroInfo from '../codigos/components/Busqueda/buscarCodigoEspecifico.vue'
export default {
  created() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
    me.getTicketsAbiertos();
    me.get_resp_rapidas();
  },
  components: {
    'v-select': vSelect,
    flatPickr,
    gestionCodigosLista,
    CodigoLibroInfo
  },
  data() {
    return {
      tickets: [],
      ticket_id: 0,
      cantTickets: '',
      popupSeguimientoTicket: false,
      //=====VARIABLES DE SEGUIMIENTO DEL TICKET=====
      usuario: [],
      respuesta: '',
      counterDanger: false,
      ticket_id: 0,
      asunto: '',
      ticketSeguimiento: [],
      usuario_ticket: '',
      email_ticket: '',
      estado_ticket: '',
      ticketAyuda: '',
      fromDate: null,
      toDate: null,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      arregloInfoCodigo: [],
      popupVerCodigo: false,
      ticket_codigo: '',
      respuestas_rapidas: [],
      ticket_data: {},
      mostrarModal: false,
      codigoSeleccionado: null
    }
  },
  methods: {
    //para obtener el listado de los tickets
    getTicketsAbiertos() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'ticket?tabierto=yes')
        .then(function (res) {
          // Validar que sea un array, si no, array vacío
          let datos = Array.isArray(res.data) ? res.data : [];

          // Filtrar según el grupo del usuario
          const isAdmin = me.usuario.id_group == '1' || me.usuario.id_group == '6';

          me.tickets = datos.filter(p => {
            if (isAdmin) {
              return p.ticket_asesor == '0';
            } else {
              return p.ticket_asesor == '1' && p.vendedorInstitucion == me.usuario.cedula;
            }
          });

          me.cantTickets = me.tickets.length;
          me.$vs.loading.close();
        })
        .catch(function (error) {
          console.error('Error al obtener tickets:', error);
          // Limpiar la tabla en caso de error
          me.tickets = [];
          me.cantTickets = 0;
          me.$vs.loading.close();
        });
    },
    //para dar seguimiento al ticket
    SeguimientoTicket(item) {
      let me = this;
      console.log(item)
      me.ticket_data = item;
      me.popupSeguimientoTicket = true;
      // me.ticket_id = ticket_id;
      // me.asunto = asunto;
      // me.usuario_ticket = usuario;
      // me.email_ticket = email;
      // me.ticket_codigo = codigo;
      me.ticketAyuda = "no";
      if (me.usuario.id_group == '1' || me.usuario.id_group == '11') {
        me.ticket_data.estado_ticket = item.estado
      } else {
        me.estadoTicket();
      }
      me.getTicketsRespuesta();
    },
    verDetalles(tr) {
      let me = this;
      me.arregloInfoCodigo = []
      me.$vs.loading();
      this.$http.get(this.$server_url + "getCodigos/" + tr.codigo)
        .then(function (res) {
          me.$vs.loading.close()
          me.arregloInfoCodigo = res.data
          me.popupVerCodigo = true
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    openConfirm(ticket_id) {
      let me = this;
      me.ticket_id = ticket_id;
      me.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: 'Estas seguro/a de cambiar de estado el ticket.',
        accept: me.cerrarTicket
      })
    },
    cerrarTicket() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + "ticket?estadoChange=yes&estado=0&ticket_id=" + me.ticket_id)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Ticket cambiado con exito',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.getTicketsAbiertos();
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    YaviMensaje(ticket_id, cantidad) {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + "ticket?yaviMensajeAdmin=yes&ticket_id=" + ticket_id + '&cantidad=' + cantidad)
        .then(function (res) {
          me.$vs.loading.close()
          me.getTicketsAbiertos();
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    //Metodos para el seguimiento del ticket
    //para obtener el listado de las respuestas de los  tickets
    getTicketsRespuesta() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'ticket?RespuestaTicketAbierto=yes&ticket_id=' + me.ticket_data.ticket_id)
        .then(function (res) {
          me.ticketSeguimiento = res.data
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()

        })
    },
    respuestaTicketCerrar() {
      let me = this;
      if (me.respuesta.length >= 500) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'El motivo del ticket debe tener un maximo de 500 caracteres'
        })
        return false;
      }
      if (me.respuesta.length < 1) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'El motivo del ticket debe tener al menos 2 caracteres.'
        })
        return false;
      }
      let formData = new FormData();
      formData.append('ticket_id', me.ticket_data.ticket_id);
      formData.append('descripcion', me.respuesta);
      formData.append('soporte', "yes");
      formData.append('usuario_id', me.usuario.idusuario);
      formData.append('group_id', me.usuario.id_group);
      formData.append('estado', 0)
      me.$vs.loading();
      this.$http.post(this.$server_url + 'ticket', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: res.data,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.respuesta = "";
          me.cerrarTicket2()
        })
        .catch(function (error) {
        })
        .finally(function () {
          me.$vs.loading.close()
        })
    },
    cerrarTicket2() {
      let me = this;
      this.$http.get(this.$server_url + "ticket?estadoChange=yes&estado=0&ticket_id=" + me.ticket_data.ticket_id)
        .then(function (res) {
          me.$vs.notify({
            text: 'Ticket cerrado con exito',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.getTicketsAbiertos();
          me.popupSeguimientoTicket = false;
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    respuestaTicket() {
      let me = this;
      if (me.respuesta.length >= 500) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'El motivo del ticket debe tener un maximo de 500 caracteres'
        })
        return false;
      }
      if (me.respuesta.length < 2) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'El motivo del ticket debe tener al menos 2 caracteres.'
        })
        return false;
      }
      let formData = new FormData();
      formData.append('ticket_id', me.ticket_data.ticket_id);
      formData.append('descripcion', me.respuesta);
      formData.append('soporte', "yes");
      formData.append('usuario_id', me.usuario.idusuario);
      formData.append('group_id', me.usuario.id_group);
      me.$vs.loading();
      this.$http.post(this.$server_url + 'ticket', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: res.data,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.respuesta = "";
          if (me.usuario.id_group == '1' || me.usuario.id_group == '11') {
            me.ticket_data.estado_ticket = 1
            // me.ticket_data.estado_ticket = localStorage.getItem("ticket_data.estado_ticket");
          } else {
            me.estadoTicket();
          }
          me.getTicketsRespuesta();
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
    },
    estadoTicket() {
      let me = this;
      this.$http.get(this.$server_url + 'ticket/' + me.usuario.idusuario)
        .then(function (res) {
          me.ticket_data.estado_ticket = res.data[0].estado
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    get_resp_rapidas() {
      let me = this;
      this.$http.get(this.$server_url + 'getRespRapida', { params: { action: 'activos' } })
        .then(function (res) {
          // console.log('resp-rapidas', res.data);
          me.respuestas_rapidas = res.data;
        })
        .catch((error) => {
          console.log(error)
        })
    },
    f_get_resp(item) {
      let me = this;
      me.respuesta = item.mensaje;
    },
    abrirModalConCodigo(codigo) {
      this.codigoSeleccionado = codigo
      this.mostrarModal = true
    },

    cerrarModal() {
      this.mostrarModal = false
      this.codigoSeleccionado = null // Borra la información al cerrar
    }
  },

}
</script>

<style>
.vs-popup--title {
  color: coral;
}
</style>
