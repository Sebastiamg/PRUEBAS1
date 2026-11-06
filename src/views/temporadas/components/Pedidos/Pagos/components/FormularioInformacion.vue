<template>
  <div>
    <!--MENU-->
    <nav class="breadcrumbs mt-3">
      <span  class="cursor-pointer breadcrumbs__item btnMenu menu2"           @click="menu = 2;$emit('changeHandle',1)">◄ Volver a principal</span>
      <span  class="cursor-pointer breadcrumbs__item btnMenu menu0 activeBtn" @click="menu = 0;estadoMenu();">Registro información</span>
      <span  class="cursor-pointer breadcrumbs__item btnMenu menu1"           @click="menu = 1;estadoMenu();">Registro Evidencias</span>
    </nav>
    <br>
    <!--FIN MENU-->
    <!--REGISTRO INFORMACION-->
    <div v-if="menu == 0" class="mt-5">
      <div class="flex" style="flex-wrap: wrap;">
        <vs-button color="primary" class="m-2" @click="tipo = 0;setTitlePago()" type="border">Pago Factura</vs-button>
        <vs-button color="primary" class="m-2" @click="tipo = 1;setTitlePago()" type="border">Pago Depositos</vs-button>
        <vs-button color="primary" class="m-2" @click="tipo = 2;setTitlePago()" type="border">Pago Gif Card</vs-button>
        <vs-button color="primary" class="m-2" @click="tipo = 3;setTitlePago()" type="border">Pago Cheque</vs-button>
        <vs-button color="primary" class="m-2" @click="tipo = 4;setTitlePago()" type="border">Pago Distribuidor</vs-button>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <div class="flex" style="flex-direction: column;">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Nombres" v-model="sendPago.nombres" />
            <div>
              <span class="cursor-pointer ml-1" @click="popupBeneficiarios=true;">
                <ion-icon name="people-circle-outline" style="font-size:18px;transform: translateY(3px);"></ion-icon>
                <small class="text-primary" style="text-decoration: underline;">Mostrar Beneficiarios</small>
              </span>
            </div>
          </div>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Apellidos" v-model="sendPago.apellidos" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="RUC" v-model="sendPago.ruc" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-at-sign" icon-no-border label-placeholder="Email" v-model="sendPago.email" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Banco" v-model="sendPago.banco" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6">
          <small class="label_inputs">Tipo de cuenta</small>
          <v-select :options="['Ahorros','Corriente']" v-model="sendPago.tipo_cuenta" class="w-full" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="Número de Cuenta" v-model="sendPago.num_cuenta" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <br>
          <b>Tipo: Pago</b>
          <p v-if="tipo == 0">Pago Factura</p>
          <p v-if="tipo == 1">Pago Deposito</p>
          <p v-if="tipo == 2">Pago Gif card</p>
          <p v-if="tipo == 3">Pago Cheque</p>
          <p v-if="tipo == 4">Pago Distribuidor</p>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-full w-full mb-2 mt-2">
          <vs-textarea counter="500" style="width:100%;" height="100px"  label="Observación" :counter-danger.sync="counterDanger" v-model="sendPago.observacion" />
        </div>
      </div>
      <div class="flex justify-center mt-3">
        <vs-button class="mr-3 mb-2" style="color:white;!important" icon-pack="feather" icon="icon-user-check" @click="guardarInformacion()">Guardar Información Pago</vs-button>
      </div>
    </div>
    <!--FIN REGISTRO INFORMACION-->
    <!--VALORES PAGOS-->
    <div v-if="menu == 1">
      <vs-divider>Adjuntar Evidencias</vs-divider>
      <div v-if="sendPago.id == 0">
        <vs-alert color="warning" class="text-warning font-bold">!Llene la información de pago primero por favor</vs-alert>
      </div>
      <div v-else>
        <ListadoValoresVue :totalPorPagar="totalPorPagar" :sendPago="sendPago" :tipo="tipo" :usuario="usuario"/>
      </div>
    </div>
    <!--MODALES-->
    <vs-popup classContent="popup-example" title="Beneficiarios" :active.sync="popupBeneficiarios">
      <TableBeneficiariosVue v-if="popupBeneficiarios" :arregloBeneficiarios="arregloBeneficiarios" @handleSelect="handleSelect"/>
    </vs-popup>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import ListadoValoresVue from './ListadoValores.vue';
import PedidosRepository from '../../../../../../repositories/PedidosRepository';
import TableBeneficiariosVue from './TableBeneficiarios.vue';
export default{
  components:{ vSelect, ListadoValoresVue,TableBeneficiariosVue },
  data(){
    return{
      sendPago:{
        id:0,
        nombres:'',
        apellidos:'',
        ruc:'',
        email:'',
        banco:'',
        tipo_cuenta:'',
        num_cuenta:'',
        observacion:'',
      },
      counterDanger: false,
      menu:0,
      //variables beneficiarios
      arregloBeneficiarios:[],
      popupBeneficiarios:false,
      //fin variables beneficiarios
    }
  },
  props:{
    usuario:{
    type:Object,
      default:function(){
        return {}
      }
    },
    contrato:{
      type:String,
      default:''
    },
    tipo:{
      type:Number,
      default:0
    },
    setverificacion_pago_id:{
      type:Number,
      default:0,
    },
    ObjectSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    totalPorPagar:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      },
    }
  },
  watch:{
    totalPorPagar(results){
      let me = this;
      me.totalPorPagar = results
    },
  },
  mounted(){
    let me = this;
    me.sendPago.id = me.setverificacion_pago_id
    //Editar
    if(me.sendPago.id > 0){
      me.fillData()
    }
    me.setTitlePago()
    me.getBeneficiarios()
  },
  methods:{
    getBeneficiarios(){
      let me = this;
      PedidosRepository.getBeneficiariosXPedido(me.sendPedido.id_pedido).then(r => this.arregloBeneficiarios = r.data  )
    },
    handleSelect(e){
      let me = this
      me.sendPago.nombres   = e.nombres
      me.sendPago.apellidos = e.apellidos
      me.sendPago.ruc       = e.cedula
      me.sendPago.email     = e.correo
      me.popupBeneficiarios = false
    },
    setTitlePago(){
      let me = this;
      if(me.tipo == 0) me.titlePago = 'Pago Factura'
      if(me.tipo == 1) me.titlePago = 'Pago Depositos'
      if(me.tipo == 2) me.titlePago = 'Pago Gif Card'
      if(me.tipo == 3) me.titlePago = 'Pago Cheque'
      if(me.tipo == 4) me.titlePago = 'Pago Distribuidor'
    },
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelectPago',me.menu)
      var divs = document.querySelectorAll(".btnMenu");
      for (var i = 0; i < divs.length; i++) {
          divs[i].classList.remove("activeBtn");
      }
      const container = document.querySelector(".menu"+me.menu);
      container.classList.add("activeBtn");
    },
    fillData(){
      let me = this;
      me.sendPago = {
        id:             me.setverificacion_pago_id,
        nombres:        me.ObjectSelect.nombres,
        apellidos:      me.ObjectSelect.apellidos,
        ruc:            me.ObjectSelect.ruc,
        email:          me.ObjectSelect.email,
        banco:          me.ObjectSelect.banco,
        tipo_cuenta:    me.ObjectSelect.tipo_cuenta,
        num_cuenta:     me.ObjectSelect.num_cuenta,
        observacion:    me.ObjectSelect.observacion
      }
    },
    guardarInformacion(){
      let me = this
      if(me.totalPorPagar == 0){
        me.$vs.notify({
          text: "No hay valores pendientes para crear un pago",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      const { nombres, apellidos, ruc, banco, tipo_cuenta ,num_cuenta } = me.sendPago
      if(nombres == "" || apellidos == "" || banco == "" || tipo_cuenta == "" || num_cuenta == ""){
        me.$vs.notify({
        text:'Los campos no puede quedar vacios',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData();
      formData.append('saveInfoPago',       'yes');
      formData.append('id',                 me.sendPago.id);
      formData.append('contrato',           me.contrato);
      formData.append('tipo_pago',          me.tipo);
      formData.append('user_created',       me.usuario.idusuario);
      formData.append('periodo_id',         localStorage.periodo_id);
      formData.append('nombres',            me.sendPago.nombres);
      formData.append('email',              me.sendPago.email)
      formData.append('apellidos',          me.sendPago.apellidos);
      formData.append('ruc',                me.sendPago.ruc);
      formData.append('banco',              me.sendPago.banco);
      formData.append('tipo_cuenta',        me.sendPago.tipo_cuenta);
      formData.append('num_cuenta',         me.sendPago.num_cuenta)
      formData.append('observacion',        me.sendPago.observacion)
      me.$vs.loading()
      this.$http.post(this.$server_url+'pedigo_Pagos', formData)
      .then(res => {
      me.$vs.loading.close()
      if(res.data.status == 0){
        me.$vs.notify({
        text:res.data.message,
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        time:5000
        })
        return
      }
      me.sendPago.id = res.data.verificacion_pago_id
      me.$vs.notify({
        text:'Se guardo con exito',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    }
  }
}
</script>
<style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: rgb(19, 46, 57);
color: white;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
