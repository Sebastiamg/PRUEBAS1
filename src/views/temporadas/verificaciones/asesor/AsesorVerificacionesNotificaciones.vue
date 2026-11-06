<template>
  <vx-card>
    <div v-if="arrayEvidencias.length > 0">
      <div class="flex">
        <vs-button color="primary" @click="getCantidadEvidencias()" type="border" style="margin-left:10px;" icon="refresh"></vs-button>
        <!--marcar como notificado-->
        <vs-button color="success" class="ml-2" @click="marcarNotificado()" type="border" style="margin-left:10px;">Marcar como notificado {{ totalNotificaciones }} items</vs-button>
      </div>
      <vs-table max-items="5" stripe search pagination :data="arrayEvidencias">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayEvidencias.length }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Escuela</vs-th>
          <vs-th>Contrato</vs-th>
          <vs-th>Evidencias</vs-th>
          <vs-th >Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  #{{ tr.id }}
                  <br>
                  {{data[indextr].nombreInstitucion}}<br>
                  <b>Asesor:</b>
                  <p>{{data[indextr].asesor}}</p>
                </vs-td>
                <vs-td>
                    {{data[indextr].contrato}}<br>
                    <b>Num. verificación :</b>
                    <p>{{data[indextr].num_verificacion}}</p>
                    <b>Fecha solicitud: verificación</b>
                    <div v-if="tr.solicitudes.length > 0">
                        <p>{{tr.solicitudes[0].fecha_solicita_verificacion}}</p>
                        <!-- <b>Diferencia dias: </b>
                        <p>{{ tr.diferenciaDias }}</p> -->
                    </div>
                </vs-td>
                <vs-td>
                  <p v-if="tr.file_evidencia" class="imagen" @click="tipoDocumento ='evidencia';documento=tr.file_evidencia;openDocument(tr)">
                    <b> Evidencia verificación
                      <!--PDF-->
                      <ion-icon v-if="tr.file_evidencia.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                      <!--IMAGE-->
                      <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                    </b>
                  </p>
                  <p class="mt-2" v-if="tr.file_evidencia" >Fecha subida evidencia: {{tr.fecha_subir_evidencia}}</p>
                  <div v-if="tr.solicitudes.length > 0" class="mt-2">
                    <p> <b>Diferencia dias: </b> {{ tr.diferenciaDias }}</p>
                  </div>
                  <p v-if="tr.file_factura" class="imagen" @click="tipoDocumento ='factura';documento=tr.file_factura;openDocument(tr)">
                      <b> Factura
                          <!--PDF-->
                          <ion-icon v-if="tr.file_factura.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                          <!--IMAGE-->
                          <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                      </b>
                  </p>
                  <p class="mt-2" v-if="tr.file_factura" >Fecha subida factura: {{tr.fecha_subir_factura}}</p>
                </vs-td>
                <vs-td>
                  <vs-switch v-model="tr.ifnotificado">
                    <span slot="on">RECIBIDO</span>
                    <span slot="off">PENDIENTE</span>
                  </vs-switch>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
    <div v-else class="p-3">
      <p class="text-center font-bold text-2xl">No existe notificaciones de evidencias</p>
    </div>
    <!--MODAL PARA MOSTRAR DOCUMENTO-->
    <vs-popup class="holamundo" :title="'Documento: '+tipoDocumento" fullscreen :active.sync="popupDocumento">
      <div class="flex" style="justify-content: center;" v-if="popupDocumento">
          <image-zoom
              :regular="$data_url+'archivos/verificaciones/'+tipoDocumento+'/'+documento"
              :zoom-amount="3"
              :click-zoom="true"
              click-message="De click para aumentar"
              img-class="img-fluid"
              >
          </image-zoom>
      </div>
    </vs-popup>
  </vx-card>
</template>
<script>
import {
    mapState
} from "vuex";
import imageZoom from 'vue-image-zoomer';
export default{
  components:{
    imageZoom,
  },
  data(){
    return{
      usuario:[],
      arrayEvidencias:[],
      tipoDocumento:'',
      documento:'',
      popupDocumento:false,
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  computed:{
    ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    totalNotificaciones(){
      let me = this;
      let total = 0
      me.arrayEvidencias.forEach(element => {
        if(element.ifnotificado == 1){
          total++
        }
      })
      return total
    }
  },
  mounted(){
    this.getCantidadEvidencias()
  },
  methods:{
    getCantidadEvidencias(){
      let me = this;
      me.arrayEvidencias = []
      me.$vs.loading();
      var url = ''
      if(me.userRoot){
        url = `metodosGetVerificaciones?getVerificaciones=1&pendientesNot=1`
      }else{
        url = `metodosGetVerificaciones?getVerificaciones=1&id_asesor=${ me.usuario.idusuario }&pendientesNot=1`
      }
      me.$http.get(me.$server_url+url)
      .then(function (res) {
          me.$vs.loading.close()
          me.arrayEvidencias = res.data
          //const diferenciaDias = fechaFinal.diff(fechaInicio, 'days');
          //obtner la diferncia de dias entre la tr.solicitudes[0].fecha_solicita_verificacion y fecha_subir_evidencia
          me.arrayEvidencias.forEach(element => {
            let diferenciasDias = ''
            if(element.solicitudes.length > 0){
              let fechaInicio = new Date(element.solicitudes[0].fecha_solicita_verificacion)
              let fechaFinal = new Date(element.fecha_subir_evidencia)
              diferenciasDias = Math.round((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24))
            }
            element.diferenciaDias = diferenciasDias
          });
      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
      })
    },
    openDocument(tr){
      let me = this;
      if(me.documento.substr(-3) == 'pdf'){
          let ruta = me.$data_url+'archivos/verificaciones/'+me.tipoDocumento+'/'+me.documento
          window.open(ruta,'_blank')
          return
      }
      me.popupDocumento = true;
    },
    marcarNotificado(){
      let me = this;
      let sendEnviar = me.arrayEvidencias.filter(p => p.ifnotificado == 1)
      if(sendEnviar.length == 0){
        me.$vs.notify({
          text: 'No hay elementos marcados como notificados',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-user'
        })
        return
      }
      let formData = new FormData();
      formData.append('guardarNotificacionVerificacion',1);
      formData.append('ifnotificado', 1);
      formData.append('data_verificacion',              JSON.stringify(sendEnviar));
      me.$http.post(me.$server_url+'metodosPostVerificaciones', formData)
      .then(function (res) {
        if(res.data.status == 0){
          me.$vs.notify({
            text: res.data.message,
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-user'
          })
          return
        }
        me.$vs.notify({
          text: `${res.data.guardados} Elementos marcados como notificados`,
          color: 'success',
          iconPack: 'feather',
          time:7000,
          icon: 'icon-user'
        })
        me.getCantidadEvidencias()
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.notify({
          text: 'Error al marcar como notificado',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-user'
        })
      })
    },
  }
}
</script>
