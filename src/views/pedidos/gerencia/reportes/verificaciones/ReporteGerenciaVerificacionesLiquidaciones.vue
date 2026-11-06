<template>
  <vx-card
   v-if="userRoot || userGerencia"
  >
    <div>
      <PeriodoReutilizableVue @changePeriodo="changePeriodo"/>
    </div>
    <div v-if="arrayEvidencias.length > 0" class="mt-5">
      <div class="flex">
        <vs-button color="primary" @click="getCantidadEvidencias()" type="border" style="margin-left:10px;" icon="refresh"></vs-button>
        <!--marcar como aprobado-->
        <vs-button color="success" class="ml-2" @click="openConfirmarMarcarNotificado()" type="border" style="margin-left:10px;">Marcar como aprobados {{ totalNotificaciones }} items</vs-button>
      </div>
      <div class="mt-5">
        <ul class="flex">
          <li class="mr-3">
            <p>Mostrar como:</p>
          </li>
          <li>
            <vs-radio v-model="tipoMostrar" class="mr-2" @input="f_filtroEvidencias()" vs-name="radios1tipoMostrar" vs-value="0"><b>{{ totalPendientes }}</b> Pendientes</vs-radio>
          </li>
          <li>
            <vs-radio v-model="tipoMostrar" @input="f_filtroEvidencias()" vs-name="radios1tipoMostrar" vs-value="1"><b>{{ totalAprobados }}</b> Aprobados</vs-radio>
          </li>
        </ul>
      </div>
      <vs-divider color="#f7e3d4"></vs-divider>
      <vs-table max-items="5" stripe search pagination :data="tmparrayEvidencias">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ tmparrayEvidencias.length }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Escuela</vs-th>
          <vs-th>Verificaciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{data[indextr].contrato}}<br><br>
                  {{data[indextr].nombreInstitucion}}<br>
                  <br>
                  <p><b>Asesor:</b> {{data[indextr].asesor}}</p>
                </vs-td>
                <vs-td>
                  <div class="container">
                    <div class="box box1">Total Pagos: {{tr.valor_ResultadoPagos }}  
                      <vx-tooltip style="display: inline-block;" text="Ver detalle de pagos" position="top" color="primary">
                        <i @click="ObjectSelected=tr;popupMostrarDetallesPagos=true;" class="fa-solid fa-circle-info ml-3"></i>
                      </vx-tooltip>
                    </div>
                    <div class="box box2">Total evidencias: {{ tr.valorLiquidaciones  }}</div>
                  </div>
                  <div class="flex justify-center my-2" v-if="tr.valor_aprobo_gerencia_verificacion > 0">
                    <p class="text-danger" v-if="tr.valor_aprobo_gerencia_verificacion != tr.valorLiquidaciones">Ultimo valor total evidencias aprobado: {{ tr.valor_aprobo_gerencia_verificacion | filtrarDecimal }}</p>
                  </div>
                  <vs-table :data="tr.verificaciones" stripe class="mt-2">
                    <template slot="thead">
                      <vs-th>
                        Verificación
                      </vs-th>
                      <vs-th>
                        Verificaciones
                      </vs-th>
                      <vs-th>
                        Acciones
                      </vs-th>
                    </template>

                    <template slot-scope="{data}">
                      <vs-tr :key="indextr2" v-for="(item, indextr2) in data" >
                        <vs-td >
                          <span v-if="userRoot">#{{ item.id }}<br></span>
                          <b>Num. Verificación:</b> {{ item.num_verificacion }}
                          <p @click="ObjectSelected=tr;popupMostrarDetallesPagos=true;" class="font-medium text-danger cursor-pointer" v-if="item.pagosPorCerrarse > 0">Existe {{ item.pagosPorCerrarse }} pagos por cerrarse</p>
                        </vs-td>
                        <vs-td>
                          <b class="font-medium">{{ item.num_verificacion == '1' ? 'Valor liquidado:' :'Liquidado en curso' }} </b>
                          <p>{{ item.valor_liquidacion | filtrarDecimal }}</p>
                          <br>
                          <p v-if="item.file_evidencia" class="imagen" @click="tipoDocumento ='evidencia';documento=item.file_evidencia;openDocument(item)">
                            <b class="font-medium"> Evidencia verificación
                              <!--PDF-->
                              <ion-icon v-if="item.file_evidencia.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                              <!--IMAGE-->
                              <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                            </b>
                          </p>
                          <p class="mt-2" v-if="item.file_evidencia" ><b class="font-medium">Fecha subida evidencia:</b> {{item.fecha_subir_evidencia}}</p>

                          <p v-if="item.file_factura" class="imagen" @click="tipoDocumento ='factura';documento=item.file_factura;openDocument(item)">
                              <b class="font-medium"> Factura
                                  <!--PDF-->
                                  <ion-icon v-if="item.file_factura.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                  <!--IMAGE-->
                                  <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                              </b>
                          </p>
                          <!--fecha_aprobacionGerencia-->
                          <p class="mt-2 font-medium" v-if="item.fecha_aprobacionGerencia"><b>Fecha aprobación Gerencia:</b> {{item.fecha_aprobacionGerencia}}</p>
                        </vs-td>
                        <vs-td>
                          <vs-switch v-model="item.temporalIfaprobadoGerencia" v-if="item.ifaprobadoGerencia == 0">
                            <span slot="on">APROBADO</span>
                            <span slot="off">PENDIENTE</span>
                          </vs-switch>
                          <!--aprobado-->
                          <span v-else>Aprobado</span>
                        </vs-td>
                      </vs-tr>
                    </template>
                  </vs-table>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
    <div v-else class="p-3 mt-5">
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
    <!--Detalles de pagos-->
    <vs-popup class="holamundo" :title="'Mostrar Detalles'" :active.sync="popupMostrarDetallesPagos">
      <div v-if="popupMostrarDetallesPagos">
        <ReporteGerenciaDetallesPagosVue :id_pedido="ObjectSelected.id_pedido" :ObjectSelected="ObjectSelected"/>
      </div>
    </vs-popup>
  </vx-card>
</template>
<script>
import {
    mapState
} from "vuex";
import imageZoom from 'vue-image-zoomer';
const PeriodoReutilizableVue          = () => import('../../../../codigos/reportes/PeriodoReutilizable.vue')
const ReporteGerenciaDetallesPagosVue = () => import('./ReporteGerenciaDetallesPagos.vue')
export default{
  components:{
    imageZoom,
    PeriodoReutilizableVue,
    ReporteGerenciaDetallesPagosVue,
  },
  data(){
    return{
      usuario:[],
      arrayEvidencias:[],
      tmparrayEvidencias:[],
      tipoDocumento:'',
      documento:'',
      popupDocumento:false,
      arrayPeriodos:[],
      periodoSelected: '',
      tipoRegion: '1',
      tipoMostrar:0,
      popupMostrarDetallesPagos:false,
      ObjectSelected:'',
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  computed:{
    ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador','userGerencia']),
    totalNotificaciones() {
      let me = this;
      let total = 0;

      if (me.tipoMostrar == 0) {
        total = me.tmparrayEvidencias
          .flatMap(element => element.verificaciones || []) // Extrae todas las verificaciones
          .filter(verif => verif.temporalIfaprobadoGerencia == 1) // Filtra las aprobadas
          .length; // Obtiene el total de las verificaciones aprobadas
      }

      return total;
    },
    totalPendientes(){
      let me = this;
      let total = 0;
        total = me.arrayEvidencias
        .filter(p => p.ifaprobadoGerenciaPadre == 0)
        .length;
      return total;
    },
    totalAprobados(){
      let me = this;
      let total = 0;
      total = me.arrayEvidencias
        .filter(p => p.ifaprobadoGerenciaPadre == 1)
        .length;
      return total;
    },
  },
  mounted(){
  },
  methods:{
    changePeriodo(periodo, periodos, tipoRegion){
      let me = this;
      this.arrayReporte    = [];
      this.periodoSelected = periodo
      this.arrayPeriodos   = periodos
      this.tipoRegion      = tipoRegion
      me.getCantidadEvidencias()
    },
    getCantidadEvidencias(){
      let me = this;
      me.arrayEvidencias = []
      me.$vs.loading();
      var url = ''
      if(me.userRoot || me.userGerencia){
        url = `metodosGetVerificaciones?getVerificaciones=1&id_periodo=${me.periodoSelected}&sinSolicitud=1&conValores=1`
      }else{
        return
      }
      me.$http.get(me.$server_url+url)
      .then(function (res) {
          me.$vs.loading.close()
          me.arrayEvidencias = res.data
          me.f_filtroEvidencias()
      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
      })
    },
    f_filtroEvidencias() {
      let me = this;
      try {
          me.tmparrayEvidencias = [];
          me.tmparrayEvidencias = me.arrayEvidencias.filter(p => p.ifaprobadoGerenciaPadre == me.tipoMostrar);
          
          if (me.tipoMostrar == 1) {
              me.tmparrayEvidencias.sort((a, b) => {
                  // Si alguna de las fechas está en null, asigna una fecha muy antigua
                  const fechaA = a.fecha_aprobado_general ? new Date(a.fecha_aprobado_general) : new Date(0); // Fecha más antigua posible
                  const fechaB = b.fecha_aprobado_general ? new Date(b.fecha_aprobado_general) : new Date(0); // Fecha más antigua posible

                  return fechaB - fechaA;
              });
          }
      } catch (error) {
          console.error("Error en f_filtroEvidencias:", error);
      }
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
    openConfirmarMarcarNotificado(){
      let me = this;
      let sendEnviar = me.tmparrayEvidencias
        .flatMap(p => p.verificaciones || []) // Extrae todas las verificaciones
        .filter(verif => verif.temporalIfaprobadoGerencia == 1); // Filtra solo las aprobadas
      if(sendEnviar.length == 0){
        me.$vs.notify({
          text: 'No hay elementos marcados como notificados',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-user'
        })
        return
      }
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirmar`,
        text: `Estás seguro que quieres marcar como aprobados ${me.totalNotificaciones} items?`,
        acceptText: 'Si, deseo marcar como aprobados',
        cancelText: 'Cancelar',
        accept: function(){
            me.marcarNotificado()
        },
      })
    },
    marcarNotificado(){
      let me = this;
      let sendEnviar = me.tmparrayEvidencias
        .flatMap(p => p.verificaciones || []) // Extrae todas las verificaciones
        .filter(verif => verif.temporalIfaprobadoGerencia == 1); // Filtra solo las aprobadas
      let formData = new FormData();
      formData.append('guardarNotificacionVerificacion',1);
      formData.append('ifaprobadoGerencia', 1);
      formData.append('data_verificacion',              JSON.stringify(sendEnviar));
      formData.append('user_created', this.usuario.idusuario);
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
<style scope>

.container {
  display: grid;
  grid-template-columns: 50% 50%;
  margin: 0;
  border-radius: 5px;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
}
.box1 { background-color: rgb(173, 230, 197); }
.box2 { background-color: rgb(240, 213, 165); }
</style>
