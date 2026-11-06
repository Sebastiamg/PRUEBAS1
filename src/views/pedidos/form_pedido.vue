<template>
  <div>
    <div class="vx-row">
      <div class="vx-col md:w-4/5 w-full mb-3">
        <!-- {{ pedido.institucion }} -->
        <div class="label_inputs">Institución</div>
        <v-select :options="instituciones" :reduce="instituciones => instituciones" label="nombre_institucion" v-model="pedido.institucion" class="w-full" @input="buscaPedidoGenerado(pedido.institucion)" />
      </div>
      <div class="vx-col md:w-1/5 w-full mb-3">
        <div class="label_inputs">Asesor</div>
        <p style="font-weight: 500;" class="text-primary">{{pedido.asesor.nombres}}</p>
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
        <vs-input type="text" label="Ruc institución" v-model="pedido.ruc" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
        <vs-input type="text" label="Dirección institución" v-model="pedido.direccionInstitucion" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
        <div class="label_inputs">Nivel</div>
        <v-select :options="arregloNivel" :reduce="arregloNivel => arregloNivel.id" label="label" v-model="pedido.nivel" class="w-full" />
      </div>
      <!--ESC Particular-->
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
        <div class="label_inputs">Seleccione el tipo de escuela:</div>
        <v-select :options="tiposEscuelas" @input="pedido.tipo_descripcion = Eselect" :reduce="tiposEscuelas => tiposEscuelas" v-model="Eselect" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
        <vs-input type="text" label="Tipo institución(Ejem. Esc. Particular)" disabled placeholder="Ejem. Esc. Particulares" v-model="pedido.tipo_descripcion" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-base">
        <vs-input type="number" label="Télefono institución" v-model="pedido.telefonoInstitucion" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Periodo</div>
        <v-select disabled :options="periodos" :reduce="periodos => periodos" label="periodoescolar" v-model="pedido.periodo" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Tipo de venta</div>
        <v-select :options="tipos_venta" :reduce="tipos_venta => tipos_venta" label="tipo_venta" v-model="pedido.tipo_venta" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Fecha envío</div>
        <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_envio" placeholder="Fecha envío" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
        <div class="label_inputs">Fecha entrega</div>
        <flat-pickr :config="configdateTimePicker" v-model="pedido.fecha_entrega" placeholder="Fecha entrega" class="w-full" />
      </div>
      <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
          <vs-input type="number" label="Comisión %" v-model="pedido.descuento" class="w-full" />
      </div>
      <div class="vx-col w-full mt-6 flex flex-grap gap-12 justify-center items-center" align="center">
        <vs-button color="warning" type="border" icon-pack="feather" icon="icon-save" v-if="usuario.id_group != 22 && usuario.id_group != 23" @click="guardarPedido">Guardar pedido</vs-button>
      </div>
      <div class="vx-col w-full" v-if="id_pedido > 0 && tmpPedido.estado == 1" >
        <BeneficiariosPorcentajeVue class="mt-3" :ventaBruta="tmpPedido.total_venta" :comision="tmpPedido.descuento" :id_pedido="tmpPedido.id_pedido" :contrato_generado="tmpPedido.contrato_generado"/>
      </div>
      <div class="vx-col w-full" v-if="id_pedido > 0 && tmpPedido.id_pedido !=undefined" >
        <registrar-beneficiarios :pedido="tmpPedido"/>
      </div>
      <vs-divider class="vx-col mb-0"></vs-divider>
    </div>
  </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import registrarBeneficiarios from './registrar_beneficiarios.vue'
import axios from 'axios'
import BeneficiariosPorcentajeVue from './components/beneficiarios/BeneficiariosPorcentaje.vue';
export default {
    components:{
      FormWizard,
      TabContent,
      flatPickr,
      'v-select': vSelect,
      registrarBeneficiarios,
      BeneficiariosPorcentajeVue
    },
    data: () => ({
      usuario:[],
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      periodos: [],
      instituciones: [],
      asesores: [],
      tipos_venta: [
        {id_tipo: 1, tipo_venta: 'Directa'},
        {id_tipo: 2, tipo_venta: 'Comisión o lista'},
      ],
      Eselect:'',
      tiposEscuelas:[
      "Esc. Particular",
      "Esc. Fiscomisional",
      "Esc. Fiscal",
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
        ifagregado_anticipo_aprobado:0,
        estado:0,
      },
      tmpPedido:[],
      popupBeneficiario: false,
      responsables: [],
      beneficiarios: [],
      beneficiario: [],
      modalResponsable: false,
      id_pedido: '',
      cedula_asesor: '',
      disableAsesor:false,
      arregloNivel:[
        {
          id:1,
          label:'Educación General Básica'
        },
        {
          id:2,
          label:'Bachillerato General Unificado'
        },
      ],
      codigo_institucion_milton:'',
      img_opcion_old:'',
      img_opcion_old_ruc:'',
    }),
    mounted() {
      let me = this
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.id_pedido = this.$route.params.pedido
      this.getPeriodos()
      console.log(this.id_pedido)
      if( this.id_pedido ){
        localStorage.setItem("id_pedido", this.id_pedido);
      }
      // this.pedido.periodo = {idperiodoescolar: localStorage.id_periodo_selected, periodoescolar: localStorage.nombre_periodo_selected}
      this.usuario_id = this.usuario.idusuario

      // this.getAsesores()
      this.get_datos_pedido()
      if(me.usuario.id_group == 11){
        me.disableAsesor = false
      }else{
        me.disableAsesor = true
      }
    },
    methods: {
      getPeriodos(){
        let me = this
        this.$http.get(this.$server_url+'get_periodos_activos')
        .then(res => {
            me.periodos = res.data
            let prePeriodo = []
            prePeriodo = me.periodos.filter(p => p.idperiodoescolar == localStorage.id_periodo_selected)
            if(prePeriodo.length > 0) {  this.pedido.periodo = prePeriodo[0] }
        })
      },
      getInstituciones(){
        let me = this
        this.$http.get(this.$server_url+'get_instituciones_asesor/'+me.cedula_asesor)
        .then(res => {
            me.instituciones = res.data
        })
      },
      getAsesores(){
        let me = this
        this.$http.get(this.$server_url+'get_asesores')
        .then(res => {
          me.asesores = res.data
        })
      },
      buscaPedidoGenerado(tr){
        let me = this
        me.limpiar()
        localStorage.setItem("institucion_selected_pedido", me.pedido.institucion.id_institucion)
        localStorage.setItem("id_asesor_pedido", me.pedido.asesor.idusuario)
        me.pedido.ruc                   = tr.ruc
        me.pedido.direccionInstitucion  = tr.direccionInstitucion
        me.pedido.nivel                 = tr.nivel
        me.pedido.tipo_descripcion      = tr.tipo_descripcion
        me.pedido.telefonoInstitucion   = tr.telefonoInstitucion
        me.codigo_institucion_milton    = tr.codigo_institucion_milton
        return; // ahora s epermita varios pedidos para una misma institucion
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_pedido/'+me.usuario.idusuario+'/'+me.pedido.periodo.idperiodoescolar+'/'+me.pedido.institucion.id_institucion)
        .then(res => {
            if( res.data.length > 0 ){
                localStorage.setItem("id_pedido", res.data[0].id_pedido);

                me.pedido.id_pedido = res.data[0].id_pedido
                me.pedido.tipo_venta = {id_tipo: res.data[0].tipo_venta, tipo_venta: res.data[0].tipo_venta_descr}
                me.pedido.fecha_envio = res.data[0].fecha_envio
                me.pedido.fecha_entrega = res.data[0].fecha_entrega
                me.pedido.descuento = res.data[0].descuento
                me.pedido.anticipo = res.data[0].anticipo
                me.pedido.correo = res.data[0].correo
                me.pedido.comision = res.data[0].comision

                me.pedido.responsable = {idusuario: res.data[0].id_responsable, nombres_responsable: res.data[0].responsable}
                me.pedido.tipo_identificacion = res.data[0].tipo_identificacion
                me.pedido.num_identificacion = res.data[0].num_identificacion
                me.pedido.ciudad = {id: res.data[0].ciudad, label: res.data[0].nombre_ciudad}
                me.pedido.direccion = res.data[0].direccion
                me.pedido.banco = res.data[0].banco
                me.pedido.tipo_cuenta = res.data[0].tipo_cuenta
                me.pedido.num_cuenta = res.data[0].num_cuenta

                if( me.usuario.id_group == 11 ){
                  me.pedido.responsable = {idusuario: me.usuario.idusuario, nombres_responsable: me.usuario.nombres}
                }
                // console.log(me.pedido.responsable)
                // alert(me.pedido.responsable.nombres_responsable)

                me.ver_comentarios()
            }
            me.$vs.loading.close();
        })
        .catch(err => {
          console.log(err)
            me.$vs.loading.close();
        })

      },
      guardarPedido(){
        let me = this
        if(me.pedido.estado == 2){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'No se puede modificar el pedido anulado',
            time:5000,
            })
          return false
        }
        if(me.pedido.ruc == "" || me.pedido.ruc == "null"){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'El ruc no puede quedar vacio',
            time:5000,
            })
          return false
        }
        if(me.codigo_institucion_milton == '22507'){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'El id institución hay que cambiar informar a soporte por favor',
            time:5000,
            })
          return false
        }
        if(me.pedido.contrato_generado == null || me.pedido.contrato_generado == "null" || me.pedido.contrato_generado == ""){
        }else{
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'El pedido ya tiene el contrato ' + me.pedido.contrato_generado +" No puede realizar cambios"
            })
          return false;
        }
        if(me.pedido.nivel == null || me.pedido.nivel == "" || me.pedido.nivel == undefined){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'Seleccione un nivel por favor'
            })
          return false;
        }
        if( me.pedido.periodo == '' || me.pedido.tipo_venta == '' || me.pedido.fecha_envio == '' || me.pedido.fecha_entrega == '' || me.pedido.institucion == '' || me.pedido.asesor == '' || me.pedido.direccionInstitucion == '' || me.pedido.ruc == '' || me.pedido.tipo_descripcion == '' || me.pedido.telefonoInstitucion == ''){
          me.$vs.notify({ text: 'Llene todos los campos antes de guardar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        me.pedido.id_pedido = this.$route.params.pedido
        if( me.$route.params.pedido == '0' ){
          me.pedido.id_pedido = ''
        }
        //actualizar fecha creacion pedido
        if(me.pedido.id_pedido > 0 && me.usuario.id_group == 11){
          me.UpdateFechaCreacionPedido(me.pedido.id_pedido)
        }
        var fileImgPreg = ""
        var fileImgPreg_ruc = ""
        let formData = new FormData();
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('tipo_venta',           me.pedido.tipo_venta.id_tipo);
        formData.append('tipo_venta_descr',     me.pedido.tipo_venta.tipo_venta);
        formData.append('fecha_envio',          me.pedido.fecha_envio);
        formData.append('fecha_entrega',        me.pedido.fecha_entrega);
        formData.append('institucion',          me.pedido.institucion.id_institucion);
        formData.append('periodo',              me.pedido.periodo.idperiodoescolar);
        formData.append('descuento',            me.pedido.descuento);
        formData.append('anticipo',             me.pedido.anticipo);
        formData.append('id_asesor',            me.pedido.asesor.idusuario);
        formData.append('id_usuario_verif',     me.usuario.idusuario);
        formData.append('observacion',          me.pedido.observacion);
        //cedula
        formData.append('imagen',               fileImgPreg);
        formData.append('img_opcion_old',       me.img_opcion_old)
        //ruc
        formData.append('doc_ruc',              fileImgPreg_ruc);
        formData.append('img_opcion_old_ruc',   me.img_opcion_old_ruc)

        formData.append('ifanticipo',           me.pedido.ifanticipo);
        formData.append('porcentaje_anticipo',  me.pedido.porcentaje_anticipo);
        formData.append('pendiente_liquidar',   me.pedido.pendiente_liquidar);
        formData.append('convenio_anios',       me.pedido.convenio_anios)
        formData.append('anticipo_aprobado',    me.pedido.anticipo_aprobado)
        //para actualizar la institucion
        formData.append('ruc',                  me.pedido.ruc);
        formData.append('direccionInstitucion', me.pedido.direccionInstitucion);
        formData.append('nivel',                me.pedido.nivel);
        formData.append('tipo_descripcion',     me.pedido.tipo_descripcion);
        formData.append('telefonoInstitucion',  me.pedido.telefonoInstitucion);
        formData.append('ifagregado_anticipo_aprobado', me.pedido.ifagregado_anticipo_aprobado)
        //fin para actualizar la institucion
        me.$vs.loading();
        //axios.post(this.$data_url+'api/guardarPedido',formData)
        this.$http.post(this.$server_url+'pedidos', formData)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          if( res.data.error ){
            alert(res.data.error)
            return
          }else{
            me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'Se guardo correctamente'
            })
            me.pedido.id_pedido = res.data.pedido.id_pedido
            localStorage.setItem("id_pedido", res.data.pedido.id_pedido);
            me.guardarInstituciones(res.data.pedido.id_pedido)
            // me.buscaPedidoGenerado()
            //actualizar instituciones
          }
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      },
      UpdateFechaCreacionPedido(id_pedido) {
        let me = this;
        this.$http.get(this.$server_url+'UpdateFechaCreacionPedido/'+id_pedido)
          .then(function (res) {
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      get_datos_pedido(){
        let me = this
        if( localStorage.id_pedido == 0 ){
            me.pedido.asesor = {idusuario: me.usuario.idusuario, nombres: me.usuario.nombres+' '+me.usuario.apellidos}
            me.cedula_asesor = me.usuario.cedula
            me.getInstituciones()
          return
        }
        this.$http.get(this.$server_url+'get_datos_pedido/'+localStorage.id_pedido)
        .then(res => {
            me.tmpPedido = res.data.pedido[0]
            let datos = res.data.pedido[0]
            me.pedido.id_pedido = datos.id_pedido
            me.pedido.estado    = datos.estado
            me.pedido.tipo_venta = {id_tipo: datos.tipo_venta, tipo_venta: datos.tipo_venta_descr}
            me.pedido.fecha_envio = datos.fecha_envio
            me.pedido.fecha_entrega = datos.fecha_entrega
            me.pedido.descuento = datos.descuento
            me.pedido.anticipo = datos.anticipo
            me.pedido.correo = datos.correo
            me.pedido.observacion = datos.observacion
            me.pedido.institucion = {id_institucion: datos.idInstitucion, nombre_institucion: datos.nombreInstitucion}
            me.pedido.asesor = {idusuario: datos.id_asesor, nombres: datos.nombres+' '+datos.apellidos}
            me.cedula_asesor = datos.cedula
            me.img_opcion_old = datos.imagen
            me.img_opcion_old_ruc = datos.doc_ruc
            me.pedido.contrato_generado       = datos.contrato_generado
            me.pedido.ifanticipo              = datos.ifanticipo
            me.pedido.porcentaje_anticipo     = datos.porcentaje_anticipo
            me.pedido.pendiente_liquidar      = datos.pendiente_liquidar
            me.pedido.convenio_anios          = datos.convenio_anios
            me.pedido.anticipo_aprobado       = datos.anticipo_aprobado
            me.pedido.ifagregado_anticipo_aprobado   = datos.ifagregado_anticipo_aprobado
            //datos institucion
            me.pedido.telefonoInstitucion     = datos.telefonoInstitucion
            me.pedido.direccionInstitucion    = datos.direccionInstitucion
            me.pedido.ruc                     = datos.ruc
            me.pedido.nivel                   = datos.nivel
            if(me.pedido.tipo_descripcion == null || me.pedido.tipo_descripcion == undefined || me.pedido.tipo_descripcion == ""){
              me.pedido.tipo_descripcion = 'Esc. Particular'
            }else{
              me.pedido.tipo_descripcion        = datos.tipo_descripcion
            }
            localStorage.setItem("institucion_selected_pedido", me.pedido.institucion.id_institucion)
            localStorage.setItem("id_asesor_pedido", me.pedido.asesor.idusuario)
            me.getInstituciones()
        })
        .catch(err => {
          console.log(err)
        })
      },
      guardarInstituciones(id_pedido){
        let me = this
        window.location.href = "/pedidos/"+id_pedido;
        // this.$http.get(this.$server_url+'guardar_institucines_base_milton')
        // .then(res => {
        //   window.location.href = "/pedidos/"+id_pedido;
        // })
        // .catch(err => {
        // })
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
