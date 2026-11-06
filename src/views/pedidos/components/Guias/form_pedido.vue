<template>
<div>
  <vs-chip class="mt-5 ml-4" v-if="pedido.estado_entrega == 0"><b>ESTADO:</b> <span class="ml-1">PEDIDO NO ENTREGADO AUN</span></vs-chip>
  <vs-chip class="mt-5 ml-4" color="primary" v-if="pedido.estado_entrega == 1"><b>ESTADO:</b> <span class="ml-1">PEDIDO APROBADO(FACTURADOR)</span></vs-chip>
  <vs-chip class="mt-5 ml-4" color="success" v-if="pedido.estado_entrega == 2"><b>ESTADO:</b> <span class="ml-1">PEDIDO ENTREGADO(BODEGA)</span></vs-chip>
  <br><br>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-1/5 w-full mb-3" style="margin-left: 30px;">
        <div class="label_inputs">Asesor</div>
        <p style="font-weight: 500;" class="text-primary">{{pedido.asesor.nombres}}</p>
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Periodo</div>
        <v-select disabled :options="periodos" :reduce="periodos => periodos" label="periodoescolar" v-model="pedido.periodo" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Fecha envío</div>
        <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_envio" placeholder="Fecha envío" class="w-full" />
      </div>
      <div class="vx-col lg:w-full md:w-full sm:w-full mb-3">
        <vs-textarea class="mt-2" counter="500" label="Observaciones" placeholder="Indique la, Ciudad, dirección en donde desea recibir su pedido" :counter-danger.sync="counterDanger" v-model="pedido.observacion" />
      </div>
      <!--Facturador puede ver (solo visible para asesores)-->
      <div class="vx-col w-full" v-if="userRoot || userAsesor">
        <ul class="flex">
          <li class="mr-5">
            Facturador vee:
          </li>
          <li class="mr-2">
            <vs-radio v-model="pedido.facturacion_vee" vs-name="radios1facturacion_vee" vs-value="1">Si</vs-radio>
          </li>
          <li class="mr-2">
            <vs-radio v-model="pedido.facturacion_vee" vs-name="radios1facturacion_vee" vs-value="0">No</vs-radio>
          </li>
        </ul>
      </div>
      <div class="vx-col w-full  flex flex-grap gap-12 justify-center items-center" align="center">
        <vs-button color="warning" type="border" icon-pack="feather" icon="icon-save" v-if="pedido.estado_entrega == 0" @click="guardarPedido">Guardar pedido</vs-button>
      </div>
    </div>
</div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import axios from 'axios'
import { mapState } from "vuex";
export default {
    components:{
      FormWizard,
      TabContent,
      flatPickr,
      'v-select': vSelect,
    },
    data: () => ({
      usuario:[],
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      periodos: [],
      instituciones: [],
      tipos_venta: [
        {id_tipo: 1, tipo_venta: 'Directa'},
        {id_tipo: 2, tipo_venta: 'Comisión o lista'},
      ],
      pedido:{
        id_pedido: 0,
        periodo: '',
        tipo_venta: '',
        fecha_envio: '',
        fecha_entrega: '',
        institucion: '',
        asesor: '',
        descuento: '',
        anticipo: '',
        observacion:'',
        ruc:'',
        direccionInstitucion:'',
        nivel:'',
        tipo_descripcion:'',
        telefonoInstitucion:'',
        porcentaje_anticipo:0,
        ifanticipo:0,
        pendiente_liquidar:0,
        convenio_anios:0,
        anticipo_aprobado:0,
        contrato_generado:'',
        estado_entrega:0,
        facturacion_vee:0,
      },
      cant_sms: 0,
      responsables: [],
      modalResponsable: false,
      id_pedido: '',
      cedula_asesor: '',
      disableAsesor:false,
      counterDanger: false,
      asesorSeleccionado: null,
    }),
    mounted() {
      let me = this
      this.usuario    = JSON.parse(localStorage.getItem('usuario'));
      this.id_pedido  = me.pedidoId
      this.pedido.periodo = {idperiodoescolar: localStorage.id_periodo_selected, periodoescolar: localStorage.nombre_periodo_selected}
      this.usuario_id = this.usuario.idusuario
      this.getPeriodos()
      
      //time out 1 segundos
      if(me.usuario.id_group == 11){
        me.disableAsesor = false
      }else{
        me.disableAsesor = true
      }
      
      if(this.id_pedido > 0){
        this.get_datos_pedido()
      } else {
        // Si es un nuevo pedido, esperar un momento para que el store se actualice
        this.$nextTick(() => {
          me.asignarAsesor();
          
          // Validar después de asignar
          if(!me.pedido.asesor || !me.pedido.asesor.idusuario) {
            console.error('No se pudo asignar el asesor');
            me.$vs.notify({ 
              text: 'Error: No se ha seleccionado un asesor para la guía', 
              color: 'danger', 
              iconPack: 'feather', 
              icon: 'icon-alert-triangle',
              time: 5000
            });
          }
        });
      }
    },
    watch:{
      id_pedido(results){
        let me = this
        if(results > 0){
          this.get_datos_pedido()
        }else{
          me.$nextTick(() => {
            me.asignarAsesor();
          });
        }
      },
      asesorPedidoSelected: {
        handler(newVal) {
          let me = this;
          console.log('asesorPedidoSelected changed:', newVal);
          if(newVal) {
            // Si es un nuevo pedido, actualizar el asesor inmediatamente
            if(me.id_pedido == 0) {
              me.$nextTick(() => {
                me.asignarAsesor();
              });
            }
          }
        },
        immediate: true
      }
    },
    props:{
      sendPedido:{
        type:Object,
        default:function(){
          return {}
        }
      },
      pedidoId:{
        type:Number,
        default:0,
      }
    },
    computed: {
      ...mapState(['asesorPedidoSelected','userRoot','userAsesor','userAdminFacturador','AdminFacturador','groupFacturador']),
    },
    methods: {
      asignarAsesor() {
        let me = this;
        // Si hay un asesor seleccionado del store (facturador seleccionó uno)
        if(me.asesorPedidoSelected && me.asesorPedidoSelected.idusuario) {
          me.pedido.asesor = {
            idusuario: me.asesorPedidoSelected.idusuario, 
            nombres: me.asesorPedidoSelected.nombres + ' ' + me.asesorPedidoSelected.apellidos
          };
          me.cedula_asesor = me.asesorPedidoSelected.cedula;
          console.log('Asesor asignado del store:', me.pedido.asesor);
          
          // Si es facturador creando una nueva guía, poner facturacion_vee en 1 por defecto
          if((me.userAdminFacturador || me.AdminFacturador)  && me.id_pedido == 0) {
            me.pedido.facturacion_vee = 1;
            console.log('Facturador creando guía: facturacion_vee = 1');
          }
        } 
        // Si no hay asesor seleccionado y el usuario es asesor, usar el usuario actual
        else if(me.usuario.id_group == 11) {
          me.pedido.asesor = {
            idusuario: me.usuario.idusuario, 
            nombres: me.usuario.nombres + ' ' + me.usuario.apellidos
          };
          me.cedula_asesor = me.usuario.cedula;
          console.log('Asesor asignado (usuario actual):', me.pedido.asesor);
          
          // Si es asesor creando su propia guía, también poner facturacion_vee en 1 por defecto
          if(me.id_pedido == 0) {
            me.pedido.facturacion_vee = 1;
            console.log('Asesor creando guía: facturacion_vee = 1');
          }
        }
        // Si no hay asesor seleccionado y el usuario NO es asesor
        else {
          // No mostrar error aquí, solo en el mounted si realmente no hay asesor
          console.warn('Esperando asesor del store...');
          me.pedido.asesor = null;
        }
      },
      getPeriodos(){
        let me = this
        this.$http.get(this.$server_url+'get_periodos_activos')
        .then(res => {
          me.periodos = res.data
        })
      },
      guardarPedido(){
        let me = this
        if( me.pedido.periodo == '' || me.pedido.asesor == ''){
          me.$vs.notify({ text: 'Llene todos los campos antes de guardar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        if(me.pedido.fecha_envio == "" || me.pedido.fecha_envio == null || me.pedido.fecha_envio == undefined){
          me.$vs.notify({ text: 'Seleccione la fecha de envío.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        
        // Verificar que el asesor tenga un ID válido
        if(!me.pedido.asesor.idusuario) {
          me.$vs.notify({ 
            text: 'Error: No se ha seleccionado un asesor válido.', 
            color: 'danger', 
            iconPack: 'feather', 
            icon: 'icon-alert-triangle' 
          });
          return;
        }
        
        let formData = new FormData();
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('fecha_envio',          me.pedido.fecha_envio);
        formData.append('periodo',              me.pedido.periodo.idperiodoescolar);
        formData.append('id_asesor',            me.pedido.asesor.idusuario);
        formData.append('id_usuario_verif',     me.usuario.idusuario);
        formData.append('observacion',          me.pedido.observacion);
        formData.append('facturacion_vee',      me.pedido.facturacion_vee);
        
        console.log('Guardando pedido con id_asesor:', me.pedido.asesor.idusuario);
        
        me.$vs.loading();
        this.$http.post(this.$server_url+'guardarPedidoGuias', formData)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'Se guardo correctamente'
          })
          me.id_pedido        = res.data.pedido.id_pedido
          me.pedido.id_pedido = res.data.pedido.id_pedido
          me.$emit('changeEdit',me.id_pedido)
          this.$store.dispatch('setGuia',res.data.pedido)
          
          // Limpiar el asesor seleccionado del store después de guardar
          this.$store.dispatch('setAsesorPedidoSelected', null);
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
          me.$vs.notify({ text: 'Error al guardar el pedido.', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle' })
        })
      },
      get_datos_pedido(){
        let me = this
        if(  me.id_pedido  == 0 ){
          me.asignarAsesor();
          return
        }
        this.$http.get(this.$server_url+'get_datos_pedido_guias/'+ me.id_pedido )
        .then(res => {
            me.pedido.id_pedido       = res.data[0].id_pedido
            me.pedido.fecha_envio     = res.data[0].fecha_envio
            me.pedido.asesor          = {idusuario: res.data[0].id_asesor, nombres: res.data[0].nombres+' '+res.data[0].apellidos}
            me.cedula_asesor          = res.data[0].cedula
            me.pedido.estado_entrega  = res.data[0].estado_entrega
            me.pedido.observacion     = res.data[0].observacion
            me.pedido.facturacion_vee = res.data[0].facturacion_vee
            //localStorage.setItem("institucion_selected_pedido", me.pedido.institucion.id_institucion)
            localStorage.setItem("id_asesor_pedido", me.pedido.asesor.idusuario)
        })
        .catch(err => {
          console.log(err)
        })
      },
      limpiar(){
        let me = this;
        me.pedido.ruc                   = ""
        me.pedido.direccionInstitucion  = ""
        me.pedido.nivel                 = ""
        me.pedido.tipo_descripcion      = ""
        me.pedido.telefonoInstitucion   = ""
      }
    },
}
</script>

<style>
.label_inputs{
  font-size: 12px;
  color: rgb(143, 143, 143);
  margin-top: 4px;
  padding-left: 4px;
}
</style>
