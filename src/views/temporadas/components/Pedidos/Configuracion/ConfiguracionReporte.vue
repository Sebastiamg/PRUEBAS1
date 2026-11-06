<template>
  <div>
    <div>
      <vs-divider>Configuración Reporte</vs-divider>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Mostrar Anticipo/Deuda</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="flex">
            <li>
              <vs-radio v-model="showReporte.permiso_anticipo_deuda" class="mr-2" vs-name="radios1permiso_anticipo_deuda" vs-value="1">Si</vs-radio>
            </li>
            <li>
              <vs-radio v-model="showReporte.permiso_anticipo_deuda" vs-name="radios1permiso_anticipo_deuda" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Mostrar Convenio</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="flex">
            <li>
              <vs-radio v-model="showReporte.permiso_convenio" class="mr-2" vs-name="radios1permiso_convenio" vs-value="1">Si</vs-radio>
            </li>
            <li>
              <vs-radio v-model="showReporte.permiso_convenio" vs-name="radios1permiso_convenio" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Mostrar Cobro Venta Directa</span>
          <p style="font-size: 11px;">(Va aparecer en el reporte siempre y cuando este marcado cobro porcentaje escuela y descontar) </p>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="flex">
            <li>
              <vs-radio v-model="showReporte.permiso_cobro_venta_directa" class="mr-2" vs-name="radios1permiso_cobro_venta_directa" vs-value="1">Si</vs-radio>
            </li>
            <li>
              <vs-radio v-model="showReporte.permiso_cobro_venta_directa" vs-name="radios1permiso_cobro_venta_directa" vs-value="0">No</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
          <vs-button class="mr-3 mb-2" icon="save" @click="updateValorLiquidacion()" icon-after>Guardar</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
    mapState
} from "vuex";
export default{
  data(){
    return{
      showReporte:{
        permiso_anticipo_deuda:0,
        permiso_convenio:0,
        permiso_cobro_venta_directa:0,
      }
    }
  },
  computed: {
      ...mapState(["auth", 'userRoot', 'userAsesor', 'groupFacturador']),
  },
  props:{
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  mounted(){
    let me = this
    me.getVerificacion()
  },
  methods:{
    getVerificacion() {
      this.arregloVerificacion = [];
      this.$vs.loading();

      this.$http.get(this.$server_url + 'getVerificacionXId/' + this.VerificacionSelect.id)
        .then(res => {
          this.$vs.loading.close();

          // Verificar si res.data está disponible y es un array con al menos un elemento
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            this.showReporte = {
              permiso_anticipo_deuda: res.data[0].permiso_anticipo_deuda,
              permiso_convenio: res.data[0].permiso_convenio,
              permiso_cobro_venta_directa: res.data[0].permiso_cobro_venta_directa,
            };
          } else {
            // Si no hay datos, se muestra una notificación
            this.$vs.notify({
              text: "No se encontraron datos.",
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              time: 3000,
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.$vs.loading.close();
          this.$vs.notify({
            text: err.message || "Error al cargar la verificación.",
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            time: 3000,
          });
        });
    },
    updateValorLiquidacion(){
      let me = this;
      let formData = new FormData();
      formData.append('actualizarTresCampo', 'yes')
      formData.append('verificacion_id',    me.VerificacionSelect.id);
      formData.append('campo',              'permiso_anticipo_deuda');
      formData.append('valor',              me.showReporte.permiso_anticipo_deuda);
      formData.append('campo2',             'permiso_convenio')
      formData.append('valor2',             me.showReporte.permiso_convenio)
      formData.append('campo3',             'permiso_cobro_venta_directa')
      formData.append('valor3',             me.showReporte.permiso_cobro_venta_directa)
      this.$http.post(this.$server_url+'updateVerificacion', formData)
      .then(res => {
        let datos = {
          "tipo"                            :7,
          "sendpermiso_cobro_venta_directa":  me.showReporte.permiso_cobro_venta_directa
        }
        me.$emit('recharge',datos)
        me.$vs.notify({
          text: 'Se guardo correctamente',
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      })
    },
  }
}
</script>
