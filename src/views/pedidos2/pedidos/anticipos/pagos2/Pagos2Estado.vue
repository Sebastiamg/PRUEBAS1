<template>
  <div>
    <!--FORMULARIO INFORMACION PAGO-->
    <div>
      <div align="center" v-if="sendPedido.estadoPedido_Pagos == null"><b>Seleccione un estado y guarde.</b>
        <br><br>
      </div>
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <ul align="center" style="display: flex;">
            <li>
              <vs-radio vs-name="radios1" class="mr-3" vs-value="0" v-model="estadonuevo">Pagado</vs-radio>
            </li>
            <li>
              <vs-radio vs-name="radios1" class="mr-3" vs-value="1" v-model="estadonuevo">Pendiente</vs-radio>
            </li>
            <li>
              <vs-radio vs-name="radios1" class="mr-3" vs-value="2" v-model="estadonuevo">Deuda</vs-radio>
            </li>
          </ul>
        </vs-col>
      </vs-row>
      <div class="vx-row mt-5">
        <div class="vx-col w-full">
          <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
              <span>Estado deuda anterior</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
              <ul class="flex">
                <li>
                  <vs-radio v-model="deuda_anterior_estado" vs-name="radios1deuda_anterior_estado" vs-value="1">Pagado</vs-radio>
                </li>
                <li>
                  <vs-radio v-model="deuda_anterior_estado" class="ml-3" vs-name="radios1deuda_anterior_estado" vs-value="0">No pagado</vs-radio>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarEstadoPedido()" type="relief">Guardar</vs-button>&emsp;
      </vs-col>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
  components: {
    vSelect,
    flatPickr,
  },
  data() {
    return {
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:s',
        defaultDate: new Date()
      },
      tabestadoPedido: {
        estadoPedido_Pagos: null,
      },
      estadonuevo: '',
      popupBeneficiarios: false,
      estado_anterior: '',
      menu: 0,
      deuda_anterior_estado: 0,
    }
  },
  props: {
    sendPedido: {
      type: Object,
      default: function() {
        return {}
      }
    },
  },
  mounted() {
    let me = this;
    this.verificarseleccion()
    this.estado_anterior = this.sendPedido.estadoPedido_Pagos;
    this.deuda_anterior_estado = this.sendPedido.deuda_anterior_estado
  },
  methods: {
    verificarseleccion() {
      this.estadonuevo = this.sendPedido.estadoPedido_Pagos;
    },
    guardarEstadoPedido() {
      let me = this;
      let hes_contrato = this.sendPedido.contrato_generado;
      const usuariorespo = localStorage.getItem("usuario");
      const usuarioObjeto = JSON.parse(usuariorespo);
      // if (this.estadonuevo == "Ninguno" || this.estadonuevo == null) {
      //     me.$vs.notify({
      //         text: 'Ningun estado seleccionado',
      //         color: 'danger',
      //         iconPack: 'feather',
      //         icon: 'icon-alert-triangle'
      //     });
      //     return;
      // }
      let datos = {
        "id_pedido": this.sendPedido.id_pedido,
        "hes_estado_anterior": parseInt(this.estado_anterior),
        "estadoPedido_Pagos": parseInt(this.estadonuevo),
        "hes_contrato": hes_contrato,
        "user_created": usuarioObjeto.idusuario,
        "deuda_anterior_estado": this.deuda_anterior_estado
      }
      me.$vs.loading();
      //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
      this.$http.post(this.$server_url + 'PostEstadoPedido_modificar', datos)
        .then(res => {
          me.$vs.loading.close()
          // this.getTipoEmpaqueParametro();
          me.$vs.notify({
            text: 'Estado Pedido guardado con exito',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.$emit('change', true)
        })
        .catch(function() {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Estado Pedido no se pudo guardar',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-x'
          })
          me.$emit('change', true)
        })
    },
  }
}

</script>
