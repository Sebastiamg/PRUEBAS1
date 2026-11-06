<template>
    <div>
      <div v-if="menu == 0">
        <vs-card>
          <ul class="flex">
            <li>
              <vs-radio v-model="rtipoVenta" @input="verTipoVenta()" class="ml-2" vs-name="rradios1" vs-value="1">Venta directa: <b>{{ SumaVentaDirecta }}</b></vs-radio>
              <vs-radio v-model="rtipoVenta" @input="verTipoVenta()" class="ml-2" vs-name="rradios1" vs-value="2">Venta Lista: <b>{{ SumaVentaLista }}</b></vs-radio>
            </li>
          </ul>
          <div>
            <vs-alert color="danger" v-if="rtipoVenta == 1" style="height: 60px;"><p class="text-center">RECUERDE VERIFICAR QUE LAS DEVOLUCIONES YA HAYAN SIDO REALIZADAS EN BODEGA</p></vs-alert>
            <div class="vx-row mt-3">
                <div class="vx-col sm:w-2/3 w-full ml-auto" v-if="pedido.estado_verificacion == 0">
                  <vs-button class="mr-3 mb-2" @click="validarSolicitud();" v-if="rtipoVenta == 1 && SumaVentaDirecta > 0" ><ion-icon name="checkmark-outline"></ion-icon> Solicitar Verificación</vs-button>
                  <vs-button class="mr-3 mb-2" @click="validarSolicitud();" v-if="rtipoVenta == 2 && SumaVentaLista > 0" ><ion-icon name="checkmark-outline"></ion-icon> Solicitar Verificación</vs-button>
                  <!-- <vs-button class="mr-3 mb-2" @click="solicitarVerificacion()"><ion-icon name="checkmark-outline"></ion-icon> Solicitar Verificación</vs-button> -->
                    <vs-button color="warning" type="border" @click="$emit('ChangeRecarge',true)" class="mb-2">Cancelar</vs-button>
                </div>
                <div v-else class="vx-col sm:w-2/3 w-full ml-auto">
                    <p class="text-warning text-2xl">Ya existe una solicitud de verificación</p>
                </div>
            </div>
            </div>
        </vs-card>
        <vx-card>
          <vs-list-header :title="'Total enviados: '    + SumaEnviados "></vs-list-header>
          <vs-list-header :title="'Total devueltos: '   + SumaCodigosDevolucion "></vs-list-header>
          <vs-list-header :title="'Total regalados: '   + sumaCodigosRegalados "></vs-list-header>
          <vs-list-header :title="'Total Bloqueados: '  + sumaCodigosBloqueados "></vs-list-header>
          <vs-list-header :title="'Total Liquidados: '  + sumarCodigosLiquidados "></vs-list-header>
          <vs-list-header :title="'Total: '             + (SumaEnviados - SumaCodigosDevolucion) "></vs-list-header>
          <vs-list-header :title="'Total leídos: '      + sumarCodigosLeidos " title-color="warning"></vs-list-header>
          <vs-list-header :title="'Total no leídos: '   + sumarCodigosNoleidos "></vs-list-header>
        </vx-card>
        <div class="header mt-3">
          <vs-row v-if="codigosPerdidos">
            <vs-col vs-type="flex" vs-justify="center" class="mt-3" vs-align="center" vs-w="12">
              <vs-alert active="true">
                Se cambio {{ porcentaje }} códigos a leído
              </vs-alert>
            </vs-col>
            <vs-col vs-type="flex" v-if="codigosNoCambiados.length > 0" vs-justify="center" vs-align="center" vs-w="12">
              <vs-list>
                <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                  <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                </vs-list-item>
              </vs-list>
            </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
            <vs-card v-if="codigosLeidos.length > 0">
              <vs-collapse accordion >
                <vs-collapse-item class="mt-2">
                  <div slot="header">
                    Códigos que no se leyeron <ion-icon style="font-size:18px;position: relative;top:5px;" name="arrow-down-circle-outline"></ion-icon>
                  </div>
                <gestionCodigosListaVue :arregloCodigos="codigosLeidos"/>
                </vs-collapse-item>
              </vs-collapse>
            </vs-card>
          </vs-row>
          <vs-divider></vs-divider>
        </div>
        <gestionCodigosListaVue :arregloCodigos="tmpinformacion"/>
      </div>
      <!--CONFIRMACION-->
      <div v-if="menu == 1" class="text-center">
        <p><b class="font-semibold">Códigos ya leído: </b>{{sumarCodigosLeidos}}</p>
        <p><b class="font-semibold">Códigos a ser leídos:</b> {{sumarCodigosNoleidos }}</p>
        <p><b class="font-semibold">Códigos a ser liquidados:</b> {{ sumarCodigosLeidos + sumarCodigosNoleidos }}</p>
        <ConfirmEliminarVue @changeConfirm="changeConfirm" v-if="menu == 1" otroValor="1" class="mt-2" title="Estás seguro de Solicitar la verificacion" subtitle="Si, deseo Solicitar"/>
      </div>
    </div>
</template>
<script>
import gestionCodigosListaVue from '../../../codigos/components/utils/gestionCodigosLista'
const ConfirmEliminarVue =  () => import('../../../configuracion/Reutilizable/ConfirmEliminar')
// import io from "socket.io-client";
export default{
  components:{
    gestionCodigosListaVue,
    ConfirmEliminarVue,
  },
  data(){
      return{
          usuario:[],
          rtipoVenta:1,
          informacion:[],
          tmpinformacion:[],
          codigosNoCambiados:[],
          codigosPerdidos:false,
          porcentaje:0,
          // socket: io(process.env.socket),
          menu:0,
      }
  },
  props:{
      pedido:{
          type:Object,
          default:{}
      },
  },
  computed:{
      sumaTotal(){
      let me = this;
      let total = me.informacion.length
      return total
      },
      SumaVentaDirecta(){
      let me = this;
      let datos       = me.informacion.filter(p => p.venta_estado == '1')
      let resultado   = datos.length
      return resultado
      },
      SumaVentaLista(){
      let me = this;
      let datos       = me.informacion.filter(p => p.venta_estado == '2')
      let resultado   = datos.length
      return resultado
      },
      SumaEnviados(){
      let me = this;
      //venta directa
      let datos       = me.informacion.filter(p => p.venta_estado == '1')
      let totalVD   = datos.length
      let datos2       = me.informacion.filter(p => p.venta_estado == '2')
      //venta lista
      let totalVL   = datos2.length
      let resultado = totalVD + totalVL
      return resultado
      },
      SumaCodigosDevolucion(){
      let me = this;
      let datos       = me.informacion.filter(p => p.estado_liquidacion == '3');
      let resultado   = datos.length
      return resultado
      },
      sumaCodigosRegalados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2')
      let resultado    = datos.length
      return resultado
      },
      sumaCodigosBloqueados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado_liquidacion != '3');
      let datos         = primerFiltro.filter(p => p.estado == '2')
      let resultado     = datos.length
      return resultado
      },
      sumarCodigosLiquidados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
      let resultado    = datos.length
      return resultado
      },
      sumarCodigosLeidos(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos        = primerFiltro.filter(p => p.bc_estado =='2')
      let resultado    = datos.length
      return resultado
      },
      sumarCodigosNoleidos(){
      let me = this;
      me.arreglocodigosALeidos = []
      let primerFiltro          = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos                 = primerFiltro.filter(p => p.bc_estado =='1')
      me.arreglocodigosALeidos  = datos
      let resultado             = datos.length
      return resultado
      }
  },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.getTipoVenta()
    },
    methods:{
      validarSolicitud(){
        let me = this
        this.$http.get(this.$server_url+'getAlcancePedido?id_pedido='+me.pedido.id_pedido)
        .then(function (res) {
          let datos = res.data
          if(datos.length > 0){
            let getAlcancesAbiertos = datos.filter(p => p.estado_alcance == 0).length
            console.log("test",getAlcancesAbiertos)
            if(getAlcancesAbiertos > 0){
              me.$vs.notify({
                text:'No se puede solicitar verificación, hay alcances abiertos',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
              return false
            }
            me.menu = 1;
          }
          me.menu = 1;
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      changeConfirm(e){
        if(e == 1){
          this.solicitarVerificacion()
        }else{
          this.menu  = 0
        }
      },
        getTipoVenta(tr) {
        let me = this;
        me.informacion = []
        me.tmpinformacion = []
        me.nombreInstitucion    = me.pedido.nombreInstitucion
        me.institucion_id       = me.pedido.id_institucion
        me.periodoDescripcion   = me.pedido.periodo
        me.periodo_id           = me.pedido.id_periodo
        me.titulo = 'Detalle de venta de ' + me.pedido.nombreInstitucion
        me.$vs.loading();
        this.$http.get(this.$server_url+'getTipoVenta?institucion_id='+me.pedido.id_institucion+'&periodo_id='+me.pedido.id_periodo)
            .then(function (res) {
            me.informacion = res.data.tipoVenta
            let datos = me.informacion
            if(me.rtipoVenta == 0){
                me.tmpinformacion = datos
                me.popupTipoVenta = true
                me.$vs.loading.close()
                return
            }
            me.tmpinformacion = datos.filter(p => p.venta_estado == me.rtipoVenta)
            me.popupTipoVenta = true
            me.$vs.loading.close()
            })
            .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
            })
        },
        verTipoVenta(){
          let me = this;
          me.tmpinformacion   = []
          let datos           = me.informacion
          if(me.rtipoVenta == 0){
            me.tmpinformacion = datos
            return
          }
          me.tmpinformacion = datos.filter(p => p.venta_estado == me.rtipoVenta)
        },
        solicitarVerificacion(){
            let me = this
            if(me.pedido.id_institucion  <  1){
                me.$vs.notify({
                text:'Seleccione una institucion',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.pedido.id_periodo == null || me.pedido.id_periodo  == 0 || me.pedido.id_periodo == undefined || me.pedido.id_periodo  == ""){
                me.$vs.notify({
                text:'Seleccione una período',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.informacion.length == 0){
                me.$vs.notify({
                text:'No hay códigos por leer ',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            //setear valores
            let datoFilter = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado == 1) && (p.venta_estado == 1 || p.venta_estado == 2));
            if(datoFilter.length == 0){
              //si no hay codigos por leer voy a solicitar la verificacion siempre y cuando exista un código leido
              if(me.sumarCodigosLeidos == 0){
                me.$vs.notify({
                text:'No hay códigos por leer ',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
              }
              me.generarSolicitudVerificacion();
              return;
            }
            var sendEnviar = []
            datoFilter.forEach(element => {
                var cal = new Object();
                cal.codigo = element.codigo
                sendEnviar.push(cal)
            });
            me.$vs.loading()
            let json_codigos = JSON.stringify(sendEnviar)
            let formData = new FormData();
            formData.append('data_codigos', json_codigos);
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('periodo_id', me.pedido.id_periodo);
            formData.append('institucion_id',me.pedido.id_institucion)
            formData.append('nombreInstitucion',me.pedido.nombreInstitucion)
            formData.append('nombrePeriodo',me.pedido.periodo)
            formData.append('venta_estado',me.rtipoVenta)
            formData.append('id_group', 11)
            // this.$http.post(this.$server_url+'codigos/leidos/venta_directa', formData)
            this.$http.post(this.$server_url+'codigos/importar', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return false
                }
                me.codigosPerdidos    = true
                me.codigosLeidos      = res.data.codigosLeidos
                me.codigosNoCambiados = res.data.codigosNoCambiados
                me.codigoNoExiste     = res.data.codigoNoExiste
                me.porcentaje         = res.data.cambiados
                if(me.codigosNoCambiados.length > 0){
                  //mensaje de error
                  me.$vs.notify({
                  text:'Hubo problemas para solicitar la verificación',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-alert-triangle'})
                  return
                }
                me.generarSolicitudVerificacion()
                return
            })
            .catch(function (error) {
                me.$vs.notify({
                text:'Verifique que la información se haya guardado correctamente.',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
                me.$vs.loading.close()
            })
        },
        generarSolicitudVerificacion(){
            let me = this
            let formData = new FormData();
            formData.append('contrato',me.pedido.contrato_generado);
            formData.append('user_created',me.usuario.idusuario)
            me.$vs.loading()
            this.$http.post(this.$server_url+'solicitarVerificacion', formData)
            .then(res => {
            me.$vs.loading.close()
            if(res.data.status == 0){
                me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return
            }
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.notify({
                    text:'Verifique que la información se haya guardado correctamente.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-triangle'})
                me.$vs.loading.close()
            })
            let datos = {
                id_asesor:  me.usuario.idusuario,
                emisor:     me.usuario.idusuario,
                grupo:      me.usuario.id_group,
                tipo:       "verificaciones"
            }
            me.pedido.estado_verificacion = 1
            // me.sendSocket(datos)
            me.$emit('ChangeRecarge',true)
            me.getTipoVenta()
        },
        // sendSocket(datos){
        //     try {
        //     this.socket.emit("enviar", datos);
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
    }
}
</script>
