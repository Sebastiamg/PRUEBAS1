<template>
  <vx-card class="mt-2" v-if="userGerencia">
    <div>
      <div>
        <ul class="flex">
          <li>
            <vs-radio v-model="tipo" @input="getSolicitudesComision();" vs-name="radios1tipo" class="mr-3" vs-value="0">Pendientes</vs-radio>
          </li>
          <li>
            <vs-radio v-model="tipo" @input="getSolicitudesComision();" vs-name="radios1tipo" class="mr-3" vs-value="1">Aprobadas</vs-radio>
          </li>
          <li>
            <vs-radio v-model="tipo" @input="getSolicitudesComision();" vs-name="radios1tipo" vs-value="3">Rechazadas</vs-radio>
          </li>
        </ul>
      </div>
      <div v-if="arraySolicitudes.length > 0">
        <ComisionListadoVue :testado="tipo" :pendientes="1" :arraySolicitudes="arraySolicitudes" :desdegerencia="1" @changeAprobar="changeAprobar"/>
      </div>
      <div v-else>
        <div class="flex justify-center items-center h-64">
          <h1 class="text-2xl text-gray-500">No hay solicitudes {{ tipo == 0 ? 'Pendientes' : tipo == 1 ? 'Aprobadas' : 'Rechazadas' }}</h1>
        </div>
      </div>
    </div>

    <!--MODALES-->
    <!--MODAL PARA APROBAR-->
    <vs-popup class="holamundo" title="Solicitud de más comisión" :active.sync="popupAprobar">
      <div v-if="popupAprobar">
        <p><b>Anticipo Solicitado:</b> {{  ObjectSelected.cantidad_solicitada }} %</p>
        <p><b>Observación:</b>         {{  ObjectSelected.observacion }}</p>
        <vs-divider></vs-divider>
        <div>
          <vx-input-group class="mb-base" v-if="estado == 1">
            <template slot="prepend">
            <div class="prepend-text bg-primary">
                <span>Aprobar valor de:</span>
            </div>
            </template>
            <vs-input v-model="cantidadAprobar" type="number" placeholder="Ingrese el porcentaje a aprobar" />
          </vx-input-group>
          <!--obsevacion-->
          <vx-input-group class="mb-base">
            <template slot="prepend">
            <div class="prepend-text bg-primary">
                <span>Observación</span>
            </div>
            </template>
            <vs-input v-model="observacion" type="text" placeholder="Observación" />
          </vx-input-group>
        </div>
        <div class="flex justify-center mt-5">
          <vs-button v-if="estado == 1" color="success" @click="f_aprobar_pago(1)" type="gradient">Aprobar Comisión</vs-button>
          <vs-button v-if="estado == 3" color="danger"  @click="f_aprobar_pago(3)" type="gradient">Rechazar Comisión</vs-button>
        </div>
      </div>
    </vs-popup>
  </vx-card>
</template>
<script>
  import {
    mapState
} from "vuex";
const ComisionListadoVue = () => import('@/views/pedidos2/pedidos/comision/ComisionListado.vue')
export default {
  components:{
    ComisionListadoVue,
  },
  data() {
    return{
      usuario:[],
      arraySolicitudes:[],
      popupAprobar:false,
      ObjectSelected:'',
      cantidadAprobar:0,
      observacion:'',
      tipo:0,
      estado:0
    }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    let me = this
    me.getSolicitudesComision()
  },
  computed:{
    ...mapState(['userRoot','userGerencia']),
  },
  methods:{
    getSolicitudesComision(){
      let me = this
      me.$vs.loading()
      this.$http.get(this.$server_url+`pedidos_gerencia?solicitudesPendientesAll=1&tipo=0&estado=${me.tipo}`)
      .then(function (res) {
        me.$vs.loading.close()
        me.arraySolicitudes = res.data
      })
      .catch(function (error) {
        me.$vs.loading.close()
          console.log(error + ' error');
      })
    },
    changeAprobar(e,estado){
      let me              = this
      me.estado           = estado
      me.ObjectSelected   = e
      me.cantidadAprobar  = e.cantidad_solicitada
      me.popupAprobar     = true
    },
    f_aprobar_pago(){
      let me = this
      if(me.cantidadAprobar > 0){
        const { idusuario, id_group } = me.usuario
        let formData = new FormData()
        formData.append('id',                    me.ObjectSelected.id)
        //rechazar
        if(me.estado == 3)                       { formData.append('cantidad_finalizada',   "") }
        //aprobar
        else{                                     formData.append('cantidad_finalizada',  me.cantidadAprobar) }
        formData.append('aprobarSolicitud',      1)
        formData.append('id_pedido',              me.ObjectSelected.id_pedido)
        formData.append('estado',                 me.estado)
        formData.append('observacion_finaliza',   me.observacion)
        formData.append('id_grupo_finaliza',      id_group)
        formData.append('user_finaliza',          idusuario)
        me.$vs.loading()
        me.$http.post(me.$server_url+'pedidos_gerencia',formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
              title: 'Error',
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            })
            return
          }
          me.getSolicitudesComision()
          me.popupAprobar = false
          me.$vs.notify({
            title: 'Exito',
            text: 'Se ha aprobado la comisión',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          //limpiar
          me.observacion = ''
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
      }else{
        me.$vs.notify({
          title: 'Error',
          text: 'Ingrese un valor mayor a 0',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      }
    }
  }
}
</script>

