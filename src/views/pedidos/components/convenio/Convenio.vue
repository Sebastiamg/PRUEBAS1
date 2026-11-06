<template>
    <div>
        <vs-divider v-if="usuario.id_group != 11">Convenio general por {{ convenio.anios }} años</vs-divider>
        <div class="vx-row" v-if="usuario.id_group == 11 && convenio.id > 0">
            <vs-divider>Convenio general por {{ convenio.anios }} años</vs-divider>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-2">
            <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-dollar-sign" icon-no-border label="Cantidad de anticipo global" v-model="convenio.anticipo_global" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-2">
              <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-message-square" icon-no-border label="Observación" v-model="convenio.observacion" />
            </div>
        </div>
        <!--FUERA DE PLATAFORMA-->
        <div class="vx-row" v-if="usuario.id_group != 11  && (pedido.convenio_origen == 0 || pedido.convenio_hijo_receptor_fuera == pedido.id_pedido) && convenio_anios < 1">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
                <vs-input class="w-full" type="number" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-calendar" icon-no-border label="Convenio de años" v-model="aniosFuera" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
                Seleccione el período origen del convenio:
                <v-select @input="setearContratos()" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" :options="arregloPeriodos"  :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodoFuera" />
            </div>
        </div>
        <div class="vx-row" v-if="usuario.id_group != 11">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
                <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido || pedido.convenio_hijo_receptor_fuera == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-dollar-sign" icon-no-border label="Cantidad de anticipo global" v-model="convenio.anticipo_global" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
                <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido || pedido.convenio_hijo_receptor_fuera == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-message-square" icon-no-border label="Observación" v-model="convenio.observacion" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
            </div>
        </div>
        <vs-divider v-if="usuario.id_group != 11  && (pedido.convenio_origen == 0 || pedido.convenio_hijo_receptor_fuera == pedido.id_pedido) && convenio_anios < 1">Contratos despues del convenio</vs-divider>
        <div class="vx-row" v-if="usuario.id_group != 11">
            <div v-if="cantidadContratos > 0" class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-2">
                <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Contrato Inicial" v-model="contratoFuera" />
            </div>
            <div v-if="cantidadContratos > 1" class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-2">
                <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Contrato Segundo" v-model="contratodespuesUno" />
            </div>
            <div v-if="cantidadContratos > 2" class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-2">
                <vs-input class="w-full" :disabled="pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido ? false: true" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Contrato Tercero" v-model="contratodespuesDos" />
            </div>
        </div>
        <div>
            <vs-button type="gradient" style="margin-top: 23px;" v-if="(pedido.convenio_origen == 0 || pedido.convenio_origen == pedido.id_pedido || pedido.convenio_hijo_receptor_fuera == pedido.id_pedido) && (usuario.id_group == 22 || usuario.id_group == 23 || userRoot)" icon="save" class="p-2 " @click="saveGlobal()">Guardar convenio</vs-button>
        </div>
        <!--HJOS CONVENIO-->
        <hijosConveniosVue :arregloHijosConvenio="arregloHijosConvenio" :convenio="convenio"/>
        <br>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import hijosConveniosVue from './hijosConvenios.vue';
export default{
    data(){
        return{
            temporadaActual:'23',
            usuario:[],
            arregloHijosConvenio:[],
            arregloPeriodos:[],
            contratoFuera:'',
            contratodespuesUno:'',
            contratodespuesDos:'',
            aniosFuera:'0',
            periodoFuera:'',
            convenio:{
                id:0,
                anticipo_global:'',
                observacion:'',
                anios:0,
                //pedido origen donde se origino el convenio
                id_pedidoOrigen:'',
            },
            userRoot:false,
            permisoConvenioOrigen:false,
            cantidadContratos:0,
        }
    },
    components:{
        hijosConveniosVue,
        vSelect,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },

    mounted(){
        let me = this;
        me.getUserRoot(me.usuario);
        me.getPeriodos()
        me.getConvenioInstitucion()
    },
    props:{
        pedido:{
            type:Object,
            default:{}
        },
        convenio_anios:{
          type:Number,
          default:0,
        },
    },
    watch:{
        pedido(results){
            let me = this;
            me.getConvenioInstitucion()
        }
    },
    methods:{
        setearContratos(){
            let me = this;
            var getTemporadaAnterior = this.arregloPeriodos.filter(p => p.idperiodoescolar == me.periodoFuera)
            var TemporadaAnterior    = getTemporadaAnterior[0].codigo_contrato.substring(1)
            me.cantidadContratos    = parseInt(me.temporadaActual) - parseInt(TemporadaAnterior)
        },
        getPeriodos(){
            let me = this
            me.arregloPeriodos = []
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                let datos = res.data
                me.arregloPeriodos = datos.filter(p => p.idperiodoescolar > 6 && p.idperiodoescolar !=20 && p.idperiodoescolar !=18  && p.idperiodoescolar !=17 && p.idperiodoescolar !=15  && p.idperiodoescolar !=14  && p.idperiodoescolar !=9 && p.idperiodoescolar !=8 && p.idperiodoescolar < 22)
            })
            .catch(function (error) {
            })
        },
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
            .then((result) => {
                if (result.data.length > 0) {
                me.userRoot = true;
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        getConvenioInstitucion(){
          let me = this;
          var url = ""
          if(me.pedido.convenio_origen > 0){
              url = this.$server_url+'convenio?getInformacionConvenio=yes&institucion_id='+localStorage.institucion_selected_pedido+'&id_pedido='+me.pedido.convenio_origen
          }else{
              url = this.$server_url+'convenio?getConvenioInstitucion=yes&institucion_id='+localStorage.institucion_selected_pedido
          }
          this.$http.get(url)
            .then(function (res) {
              if(res.data.status == 0){
                me.$vs.notify({
                text:res.data.message,
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
                return
              }
              if(res.data.length == 0){
                  me.convenio.anios = me.pedido.convenio_anios
                  return
              }
              var datos = []
              if(me.pedido.convenio_origen > 0){
                  datos                   = res.data.convenio[0]
                  me.arregloHijosConvenio = res.data.hijos_convenio
              }else{
                  datos                   = res.data[0]
              }
              me.convenio.id              = datos.id
              me.convenio.observacion     = datos.observacion
              me.convenio.anticipo_global = datos.anticipo_global
              me.convenio.anios           = datos.convenio_anios
              me.convenio.id_pedidoOrigen = datos.id_pedido
              //si es un convenio fuera de la plataforma
              if(me.pedido.convenio_hijo_receptor_fuera > 0){
                  me.aniosFuera           = datos.convenio_anios
                  me.periodoFuera         = datos.periodo_id
                  me.setearContratos()
                  if(me.cantidadContratos > 0){
                      me.contratoFuera = res.data.hijos_convenio[0].contrato
                  }
                  if(me.cantidadContratos > 1){
                      me.contratoFuera        = res.data.hijos_convenio[0].contrato
                      me.contratodespuesUno   = res.data.hijos_convenio[1].contrato
                  }
                  if(me.cantidadContratos > 2){
                      me.contratoFuera        = res.data.hijos_convenio[0].contrato
                      me.contratodespuesUno   = res.data.hijos_convenio[1].contrato
                      me.contratodespuesDos   = res.data.hijos_convenio[2].contrato
                  }
              }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        saveGlobal(){
            let me = this;
            let formData = new FormData();
            //convenio_origen -> 0 => convenio fuera de plataforma
            var periodoSend         = 0;
            var sendconvenioAnios   = 0;
            var convenioFuera       = 0;
            var sendIdPedido        = 0;
            var convenio_hijo_receptor_fuera = 0;
            if(( me.pedido.convenio_origen == 0 || me.pedido.convenio_hijo_receptor_fuera == me.pedido.id_pedido ) && (me.convenio_anios < 1) ){
              if(me.periodoFuera == null || me.periodoFuera == "" || me.periodoFuera == undefined ){
                  me.$vs.notify({
                  text:'Seleccione el período origen del convenio',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  return
              }
              if( me.aniosFuera < 2 ){
                  me.$vs.notify({
                  text:'El convenio no puede ser menor a 2 años',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  return
              }
              //VALIDACION SI LOS AñOS DE CONVENIO ES MENOR A AL PERIODO SELECCIONADO NO PASA
              if(me.aniosFuera <= me.cantidadContratos){
                  me.$vs.notify({
                  text:'El convenio no corresponde con el periodo seleccionado',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  return
              }
              //VALIDACION CONTRATOS
              if(me.cantidadContratos > 0){
                  if(me.contratoFuera == ""){
                      me.$vs.notify({
                      text:'Ingrese el contrato origen del convenio',
                      color:'warning',
                      iconPack: 'feather',
                      icon:'icon-check'})
                      return
                  }
              }
              if(me.cantidadContratos > 1){
                  if(me.contratoFuera == "" || me.contratodespuesUno == ""){
                      me.$vs.notify({
                      text:'Ingrese los contratos por favor',
                      color:'warning',
                      iconPack: 'feather',
                      icon:'icon-check'})
                      return
                  }
              }
              if(me.cantidadContratos > 2){
                  if(me.contratoFuera == "" || me.contratodespuesUno == "" || me.contratodespuesDos == ""){
                      me.$vs.notify({
                      text:'Ingrese los contratos por favor',
                      color:'warning',
                      iconPack: 'feather',
                      icon:'icon-check'})
                      return
                  }
              }
              //FIN VALIDACION CONTRATOS
              periodoSend         = me.periodoFuera
              sendconvenioAnios   = me.aniosFuera
              convenioFuera       = 1
              sendIdPedido        = 1
              convenio_hijo_receptor_fuera = me.pedido.id_pedido
            }else{
                periodoSend         = me.pedido.id_periodo
                sendconvenioAnios   = me.convenio_anios
                convenioFuera       = 0
                sendIdPedido        = me.pedido.id_pedido
                convenio_hijo_receptor_fuera = 0
                me.cantidadContratos = 0
            }
            if(me.convenio.anticipo_global < 0 || me.convenio.anticipo_global == "" || me.convenio.anticipo_global == null){
                me.$vs.notify({
                text:'El convenio global no puede ser menor a 0',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            //setear contratos
            var contratosSend  = ""
            if(me.cantidadContratos > 0){
                var contratosSend = this.contratoFuera
            }
            if(me.cantidadContratos > 1){
                var contratosSend = this.contratoFuera + '*' + this.contratodespuesUno;
            }
            if(me.cantidadContratos > 2){
                var contratosSend = this.contratoFuera + '*' + this.contratodespuesUno + '*' +this.contratodespuesDos;
            }
            me.actualizarPedido()
            formData.append('saveGlobal',       "yes");
            formData.append('id',               me.convenio.id);
            formData.append('anticipo_global',  me.convenio.anticipo_global);
            formData.append('convenio_anios',   sendconvenioAnios);
            formData.append('institucion_id',   me.pedido.idInstitucion);
            formData.append('periodo_id',       periodoSend);
            formData.append('id_pedido',        sendIdPedido);
            formData.append('tempid_pedido',    me.pedido.id_pedido);
            formData.append('user_created',     me.usuario.idusuario);
            formData.append('observacion',      me.convenio.observacion);
            formData.append('convenioFuera',    convenioFuera)
            formData.append('cantidadContratos',me.cantidadContratos)
            formData.append('contratosFuera',    contratosSend)
            formData.append('convenio_hijo_receptor_fuera',convenio_hijo_receptor_fuera)
            me.$vs.loading()
            this.$http.post(this.$server_url+'convenio', formData)
            .then(res => {
            me.getConvenioInstitucion();
            me.$vs.loading.close()
            this.$emit('recharge',true)
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
        },
        actualizarPedido(){
          let me = this;
          let formData = new FormData();
          //noCambios cuando no voy a actualizar nada solo voy a poner en el historico que hubo cambio en el convenio
          formData.append('noCambios',  "yes")
          formData.append('campo',      "convenio_anios")
          formData.append('id_pedido',  me.pedido.id_pedido);
          formData.append('valor',      "");
          formData.append('user_created',me.usuario.idusuario)
          this.$http.post(this.$server_url+'actualizarPedido', formData)
          .then(function (res) {
          })
          .catch(function (error) {})
        },
    }
}
</script>
