<template>
  <div v-if="usuario.id_group == 22 || usuario.id_group == 23 || usuario.id_group == 1 || usuario.id_group == 26">
    <vx-card title="Filtro para mostrar las facturas para enviar a perseo" title-color="primary">
      <div class="vx-row">
        <div class="vx-col w-1/2">
          <!--fecha inicio-->
          <label class="block text-sm text-gray-600">Fecha Inicio</label>
          <flat-pickr v-model="fechaInicio" :config="config" class="w-full"></flat-pickr>
        </div>
        <div class="vx-col w-1/2">
          <!--fecha fin-->
          <label class="block text-sm text-gray-600">Fecha Fin</label>
          <div class="flex">
            <flat-pickr v-model="fechaFin" :config="config" class="w-full"></flat-pickr>
            <!--boton para filtrar-->
            <vs-button class="ml-4" @click="f_filtroFechasFacturas();">Filtrar</vs-button>
          </div>
        </div>
      </div>
    </vx-card>
    <!--facturas-->
    <vx-card title="Facturas" class="mt-3" title-color="success">
      <div v-if="arrayFacturas.length == 0">
        <!--no hay facturas-->
        <p>No se encontraron facturas</p>
      </div>
      <div v-else>
        <div>
          <ul class="flex">
            <li>
              <vs-radio v-model="filter" class="mr-2" @input="f_filtroFacturas();" vs-name="radios1filter" vs-value="0">Todos <b>{{ totalFacturas }}</b></vs-radio>
            </li>
            <li>
              <vs-radio v-model="filter" class="mr-2" @input="f_filtroFacturas();" vs-name="radios1filter" vs-value="1">Pendientes <b>{{ pendientesEnviarPerseo }}</b></vs-radio>
            </li>
            <li>
              <vs-radio v-model="filter"              @input="f_filtroFacturas();" vs-name="radios1" vs-value="2">Enviados a perseo <b>{{ enviadosPerseo }}</b></vs-radio>
            </li>
          </ul>
        </div>
        <vs-table max-items="10" stripe search pagination :data="tmpArrayFacturas">
          <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ tmpArrayFacturas.length }}</b></vs-chip>
          </template>
          <template slot="thead">
            <vs-th>Factura</vs-th>
            <vs-th>Cliente</vs-th>
            <vs-th>Cantidad</vs-th>
            <vs-th>Monto</vs-th>
            <vs-th>Fecha</vs-th>
            <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <b>{{data[indextr].code}}</b><br><br>
                  <div>
                  </div>
                  <div v-if="tr.estadoPerseo == 1">
                    <p class="text-success"><i class="fa-solid fa-check"></i> Enviado a perseo</p>
                    <b>Factura Secuencia Perseo:</b>
                    <p>{{ tr.facturas_secuencia_perseo}}</p>
                    <b>Fecha enviado a Perseo:</b>
                    <p>{{ tr.fecha_envio_perseo }}</p>
                    <b>usuario que envio a perseo</b>
                    <p>{{tr.user_editor}}</p>
                    <br>
                  </div>
                  <div v-else class="mt-5">
                    <p><i class="fa-solid fa-triangle-exclamation"></i> No enviado a perseo</p>
                  </div>
                  <br>
                  <b>Empresa:</b>
                  <p class="">
                    {{ arrayEmpresas.find(x => x.id == tr.id_empresa).name }}
                  </p>
                </vs-td>
                <vs-td>
                  {{data[indextr].cliente}}<br>
                  <b>Cédula:</b>
                  <p>{{ tr.cedula }}</p>
                </vs-td>
                <vs-td>
                  {{ tr.contador }}
                </vs-td>
                <vs-td>
                  {{ tr.total.toFixed(2) }}
                </vs-td>
                <vs-td>
                  {{ tr.created_at }}
                </vs-td>
                <vs-td>
                  <vs-button class="my-2" v-if="tr.estadoPerseo == 0" @click="cleanCliente();empresaSelected=tr.id_empresa;ObjectSelected=tr;confirmEnviarPerseo(tr);"><i class="fa-brands fa-discord"></i> Enviar a perseo</vs-button>
                  <vs-button class="my-2 ml-3" color="warning" @click="ObjectSelected=tr;f_VerDetalles()" type="border"><i class="fa-solid fa-circle-info"></i> Detalles</vs-button>
                </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
    </vx-card>
    <!--MODALES-->
    <!--MODAL VER DETALLES DE FACTURA-->
    <vs-popup classContent="popup-example" title="Detalles" :active.sync="popupVerDetalles">
      <div v-if="popupVerDetalles">
        <div class="vx-row">
          <div class="vx-col w-full">
            <span><b>Empresa:</b></span>
            <p>  {{ arrayEmpresas.find(x => x.id == empresaSelected).name }}</p>
          </div>
        </div>
        <b>Factura:</b>
        <p>{{ ObjectSelected.code }}</p>
        <b>Sub total</b>
        <p>{{ subtotalDetalle.toFixed(2) }}</p>
        <b>Descuento:</b>
        <p>{{ totalDescuento.toFixed(2) }}</p>
        <b>Total:</b>
        <p>{{ ObjectSelected.total.toFixed(2) }}</p>
        <vs-table max-items="10" search pagination :data="arrayDetalles">
          <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayDetalles.length }}</b></vs-chip>
          </template>
          <template slot="thead">
            <vs-th>Cantidad</vs-th>
            <vs-th>Producto</vs-th>
            <vs-th>Precio</vs-th>
            <vs-th>Descuento</vs-th>
            <vs-th>Precio Total</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{data[indextr].q}}<br>
                </vs-td>
                <vs-td>
                  {{data[indextr].name}}<br>
                </vs-td>
                <vs-td>
                  {{ tr.price_in }}
                </vs-td>
                <vs-td>
                  {{ tr.discount }}%
                </vs-td>
                <vs-td>
                  {{ tr.valorDescuento   }}
                </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
    </vs-popup>
    <!--MODAL PARA CONFIRM ENVIAR A PERSEO-->
    <vs-popup classContent="popup-example" :title="'Enviar a perseo Factura: '+ObjectSelected.code" :active.sync="popupConfirmPerseo">
      <div v-if="popupConfirmPerseo">
        <div class="vx-row">
          <div class="vx-col w-full">
            <span><b>Empresa:</b></span>
            <p>  {{ arrayEmpresas.find(x => x.id == empresaSelected).name }}</p>
          </div>
          <div class="vx-col w-full mt-5" v-if="empresaSelected">
            <SolinfaClienteVue :empresa="empresaSelected" :ObjectSelected="ObjectSelected" @ChangeSendDatosCliente="ChangeSendDatosCliente"/>
          </div>
          <div class="vx-col w-full mb-6 mt-3">
            <div v-if="datosCliente.clientesid">
              <vs-alert color="success" @click="cleanCliente();" class="w-full cursor-pointer" icon-pack="feather" icon="icon-x">
                <p class="text-center mt-2">Seleccionado: <b>{{  datosCliente.razonsocial }}</b></p>
                <!-- <p class="text-center mt-2">Cédula: {{ datosCliente.identificacion }}</p> -->
              </vs-alert>
            </div>
            <div v-else>
              <vs-alert color="danger" class="w-full"><p class="text-center">!Cliente no encontrado en perseo</p></vs-alert>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-6" v-if="datosCliente.clientesid">
          <vs-button @click="enviarPerseo()" color="success">Enviar a Perseo</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
const SolinfaClienteVue = () => import('./SolinfaCliente.vue');
import vSelect from 'vue-select'
export default {
  components: {
    flatPickr,
    SolinfaClienteVue,
    vSelect,
  },
  data() {
    return{
      usuario:[],
      fechaInicio: '',
      fechaFin: '',
      config: {
        enableTime: false,
        dateFormat: 'Y-m-d',
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          },
          months: {
            shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          },
        },
      },
      arrayFacturas:[],
      tmpArrayFacturas:[],
      arrayDetalles:[],
      filter:0,
      ObjectSelected:'',
      popupVerDetalles:false,
      subtotalDetalle:0,
      totalDescuento:0,
      popupConfirmPerseo:false,
      arrayEmpresas:[
        {
          id:1,
          name: 'GONZALEZ GUAMAN WELLINGTON MAURICIO',
          ruc: '1724529886001'
        },
        {
          id:2,
          name: 'COBACANGO TOAPANTA CESAR BAYARDO',
          ruc: '1726412537001'
        }
      ],
      empresaSelected:'',
      datosCliente:{
        razonsocial:'',
        identificacion:'',
        clientesid:0,
      },
    }
  },
  computed:{
    totalFacturas(){
      let me = this
      let total = 0
      total = me.arrayFacturas.length
      return total
    },
    pendientesEnviarPerseo(){
      let me = this
      let total = 0
      me.arrayFacturas.forEach((item) => {
        if(item.estadoPerseo == 0){
          total++
        }
      })
      return total
    },
    enviadosPerseo(){
      let me = this
      let total = 0
      me.arrayFacturas.forEach((item) => {
        if(item.estadoPerseo == 1){
          total++
        }
      })
      return total
    }
  },
  mounted(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  methods:{
    ChangeSendDatosCliente(e){
      let me = this
      me.datosCliente.razonsocial     = e.razonsocial
      me.datosCliente.identificacion  = e.identificacion
      me.datosCliente.clientesid      = e.clientesid
    },
    cleanCliente(){
      let me = this
      me.datosCliente = {
        razonsocial:'',
        identificacion:'',
        clientesid:0,
      }
    },
    f_filtroFechasFacturas(){
      let me = this
      if(me.fechaInicio == '' || me.fechaInicio == null || me.fechaInicio == undefined){
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar una fecha de inicio',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      if(me.fechaFin == '' || me.fechaFin == null || me.fechaFin == undefined){
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar una fecha de fin',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      //la fecha de inicio no puede ser mayor a la fecha de fin
      if(me.fechaInicio > me.fechaFin){
        me.$vs.notify({
          title: 'Error',
          text: 'La fecha de inicio no puede ser mayor a la fecha de fin',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      me.$vs.loading({color: 'primary'})
      this.$http.get(this.$server_url+'solinfa?filtroFechasFacturas=1&fechaInicio='+me.fechaInicio+'&fechaFin='+me.fechaFin)
      .then(function (res) {
        let datos = res.data
        if(datos.length > 0){
          datos.forEach(p => {
            let ruc_empresa = p.ruc_empresa
            if(ruc_empresa == '1724529886001') {
              p.id_empresa = 1
            }
            else if(ruc_empresa == '1726412537001') {
              p.id_empresa = 2
            }
            else{
              p.id_empresa = 0
            }
          })
        }
        me.arrayFacturas = datos
        me.tmpArrayFacturas = datos
        me.f_filtroFacturas()
        if(me.arrayFacturas.length == 0){
          me.$vs.notify({
            title: 'Error',
            text: 'No se encontraron facturas',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        }
        me.$vs.loading.close()
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
        me.$vs.notify({
          title: 'Error',
          text: 'Error al obtener las facturas',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    f_VerDetalles(){
      let me = this
      me.totalDescuento = 0
      me.subtotalDetalle = 0
      me.$vs.loading({color: 'primary'})
      this.$http.get(this.$server_url+'solinfa/'+me.ObjectSelected.id)
        .then(function (res) {
          me.arrayDetalles = res.data
          //multiplicar ((valorTotal * discount) / 100) - valorTotal
          me.arrayDetalles.forEach((item) => {
            me.subtotalDetalle += parseFloat(item.valorTotal)
            item.valorDescuento = (item.valorTotal - ((item.valorTotal * item.discount) / 100)).toFixed(2)
            let valores =  ((parseFloat(item.valorTotal) * parseFloat(item.discount)) / 100)
            me.totalDescuento = parseFloat(me.totalDescuento) + parseFloat(valores)
          })
          me.popupVerDetalles = true
          me.$vs.loading.close()
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
          me.$vs.notify({
            title: 'Error',
            text: 'Error al obtener los detalles de la factura',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        })
    },
    f_filtroFacturas(){
      let me = this
      //filter 0 => todas ; 1 => pendientes ; 2 => enviadas
      if(me.filter == 0){
        me.tmpArrayFacturas = me.arrayFacturas
      }
      if(me.filter == 1){
        me.tmpArrayFacturas = me.arrayFacturas.filter((item) => {
          return item.estadoPerseo == 0
        })
      }
      if(me.filter == 2){
        me.tmpArrayFacturas = me.arrayFacturas.filter((item) => {
          return item.estadoPerseo == 1
        })
      }
    },
    //METODOS DE PERSEO
    confirmEnviarPerseo(tr) {
      let me = this;
      this.ObjectSelected = tr;
      me.popupConfirmPerseo = true
    },
    enviarPerseo() {
      let me = this;
      //validar que la empresa este seleccionada
      if(me.empresaSelected == '' || me.empresaSelected == null || me.empresaSelected == undefined){
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar una empresa',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      //validar que el cliente este seleccionado
      if(me.datosCliente.clientesid == '' || me.datosCliente.clientesid == null || me.datosCliente.clientesid == undefined || me.datosCliente.clientesid == 0){
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar un cliente',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      let formData = new FormData();
      formData.append("ven_codigo", this.ObjectSelected.code);
      formData.append("cliente_id", me.datosCliente.clientesid);
      formData.append("empresa", this.empresaSelected);
      formData.append('user_editor',me.usuario.nombres + me.usuario.apellidos)
      // formData.append("tipo", 'perseo');
      me.$vs.loading();
      this.$http
      .post(this.$server_url + "api/perseo/facturacion/facturas_crear", formData)
      .then((res) => {
          if (res.data != null || res.data != undefined || res.data != 0) {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            return;
          }
          if (res.data.fault) {
            me.$vs.notify({
              text: "Ocurrio un error en el envío a Perseo",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            return;
          }
          me.f_filtroFechasFacturas();
          me.$vs.notify({
              text: "Envío a Perseo exitoso",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
          });
          me.popupConfirmPerseo = false
          me.cleanCliente()
        } else
        {
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Se produjo algún fallo en el envío a Perseo",
            color: "#F8C471",
            iconPack: "feather",
            icon: "icon-check",
          });
        }
      })
      .catch((error) => {
          console.log(error);
          me.$vs.loading.close();
          me.$vs.notify({
              text: "No se pudo enviar a Perseo",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
          });
      });
    },
    //FIN METODOS DE PERSEO
  }
}
</script>
