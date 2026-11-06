<template>
  <div>
    <vx-card>
      <vs-button color="primary" type="border" @click="$router.go(-1)">← Regresar</vs-button>
      <form-wizard color="rgba(var(--vs-primary), 1)" style="margin-top: -15px;" :title="null" :subtitle="null" :finishButtonText="txt_finalizar" @on-complete="formSubmitted">
        <tab-content title="Generación pedido" class="mb-5" :before-change="getSeries">
          <formpedidos ref="formpedidos"/>
        </tab-content>
        <!-- tab 2 content -->
        <tab-content title="Libros" class="mb-5" :after-change="getPedidos">
          <formlibros ref="formlibros" :tmpPedidos="tmpPedidos" :selectifanticipo="pedido.ifanticipo" :anticipoAprobado="(pedido.anticipo_aprobado == pedido.deuda) ? pedido.anticipo_aprobado : pedido.anticipo_aprobado - pedido.deuda" @changePedido="getChangePedido" />
          <div class="vx-col lg:w-full md:w-full sm:w-full mb-base">
            <!--CONVENIO-->
            <!-- <li style="list-style: none;" v-if="tmpPedidos.convenio_origen == 0 && usuario.id_group != 11 && pedido.convenio_anios < 1">
              <label for="">Registar convenio fuera de plataforma</label>
              <vs-switch class="mt-1" v-model="checkFueraPlataforma"/>
            </li> -->
            <br>
            <div class="flex">
              <div>
                <vx-input-group class="mb-base">
                  <template slot="prepend">
                    <div class="prepend-text bg-primary">
                      <span class="">Convenio años</span>
                    </div>
                  </template>
                  <vs-input v-model="pedido.convenio_anios" :disabled="tmpPedidos.pedidos_convenios_id > 0" type="number"  placeholder="Mayor a 2 años" />
                </vx-input-group>
              </div>
              <div>
                <p class="text-success text-convenio" v-if="pedido.convenio_anios > 1" style="margin-top: 5px;margin-left: 20px;">Con convenio</p>
                <p class="text-warning text-convenio" v-else style="margin-top: 5px;margin-left: 20px;">Sin convenio</p>
              </div>
            </div>
            <!--Convenio global-->
            <!-- <ConvenioVue :convenio_anios="pedido.convenio_anios"  v-if="pedido.convenio_anios > 1 || tmpPedidos.convenio_origen > 0 || checkFueraPlataforma" :pedido="tmpPedidos" @recharge="get_datos_pedido()"/> -->
            <!--ANTICIPO SUGERIDO-->
            <div>
              <li style="list-style: none;">
                <vs-checkbox :disabled="((usuario.id_group == 11 || userRoot || userFacturador) && (pedido.deuda == 0 || pedido.deuda == null )) ? false : true " v-model="pedido.ifanticipo" @input="verDocumentosAnteriores()">Solicitar anticipo</vs-checkbox>
              </li>
              <div>
                <p class="text-danger font-bold mt-2 ml-2">Anticipo Sugerido </p>
                <vs-input type="number" disabled v-model="pedido.anticipo" class="mt-1" />
              </div>
            </div>
            <!--ANTICIPO APROBADO-->
            <div style="width: 100%!important;" v-if="pedido.ifanticipo">
              <pedidos_evidencia_aprobacionVue :tmpPedidos="tmpPedidos" :tmpFiles="tmpFiles" @chAnticipoAprobado="changeAnticipoA" class="mt-3"/>
            </div>
            <!--DEUDA-->
            <div class="flex" style="flex-wrap: wrap;">
              <div class="flex deuda" style="flex-wrap: wrap;flex-direction: column;width: 29%;">
                <div>
                  <p class="font-bold mt-2">Deuda</p>
                  <vs-input type="number" :disabled="disableFacturador" v-model="pedido.deuda"  class="w-full mt-1" />
                </div>
                <div class="">
                  <p class="font-bold mt-2">Período deuda</p>
                  <vs-input type="text" :disabled="disableFacturador" placeholder="Ejem. Costa 2022" v-model="pedido.periodo_deuda"  class="w-full mt-1" />
                </div>
              </div>
              <div class="flex" style="flex-direction: row;justify-content: left;width:40%;margin-top: 30px;">
                <vs-button class="ml-5" style="max-height: 35px;" color="dark" v-if="usuario.id_group == 22 || usuario.id_group == 23" icon="save" @click="guardarPedido2()" type="gradient">Guardar</vs-button>
              </div>
            </div>
          </div>
          <vs-divider>
            <div class="flex">
              <p>Documentos</p>
            </div>
          </vs-divider>
          <div class="flex" style="width: 100%;justify-content: space-between;flex-wrap: wrap;">
            <!--====UPLOAD CEDULA===-->
            <div style="width: 40%;" class="contenedor-file" v-if="pedido.ifanticipo > 0">
              <p style="text-align: center;margin-left: -10px;"><i class="fa-solid fa-cloud"></i> Foto de la copia de la cédula imagen/pdf (Máximo 5 MB)</p>
              <div class="box-input" v-show="attachmentArray.length == 0 && verImg == false">
                <div class=" box upload-container">
                    <input type="file" name="file10" id="file10" class="file10" v-on:change="uploadFiles" />
                </div>
                <br>
              </div>
              <!--IMAGEN DE LA BASE-->
              <div class="box-input" v-if="attachmentArray.length == 0 && verImg == true">
                <div class="flex" style="justify-content: center;">
                  <div class="flex" style="flex-direction: column;">
                    <img id="img1" v-if="img_opcion_old.substr(-3) == 'pdf'"  @click="verArchivo(0)" width="200" class="img-responsive mb-2 ml-1 cursor-pointer" src="@/assets/images/file-icons/pdf.png" style="border-radius: 5px;margin: 0 auto;">
                    <img id="img1" v-else width="200" @click="verImagen(0)" class="img-responsive mb-2 ml-1 cursor-pointer"  v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old" style="border-radius: 5px;margin: 0 auto;">
                    <small class="mt-1 ml-2 text-center">{{ img_opcion_old }}</small>
                  </div>
                  <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                    <vs-button radius type="line" v-if="disableAsesor == false" @click="verImg = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </vx-tooltip>
                  </div>
              </div>
              <!--ARRAY IMAGENES-->
              <div class="flex mt-1" style="margin-top: -10px;" v-if="attachmentArray.length > 0" >
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                    <div class="flex" style="flex-direction: column;">
                      <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                      <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                      <small class="mt-1 ml-2 text-center">{{ tr.name }}</small>
                    </div>
                    <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                      <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr,0)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                    </vx-tooltip>
                  </div>
              </div>
            </div>
            <!--=====UPLOAD RUC===-->
            <div style="width: 40%;" class="contenedor-file" v-if="pedido.ifanticipo > 0">
              <p style="text-align: center;margin-left: -10px;"><i class="fa-solid fa-cloud"></i> Archivo del RUC imagen/pdf (Máximo 5 MB)</p>
              <br>
              <div class="box-input" v-show="attachmentArray_ruc.length == 0 && verImg_ruc == false">
                <div class=" box upload-container">
                  <input type="file" name="file11" id="file11" class="file11" v-on:change="uploadFilesRUC" />
                </div>
                <br>
              </div>
              <!--IMAGEN DE LA BASE-->
              <div class="box-input" v-if="attachmentArray_ruc.length == 0 && verImg_ruc == true">
                <div class="flex" style="justify-content: center;">
                  <div class="flex" style="flex-direction: column;">
                    <img id="img1" v-if="img_opcion_old_ruc.substr(-3) == 'pdf'"  @click="verArchivo(1)" width="200" class="img-responsive mb-2 ml-1 cursor-pointer" src="@/assets/images/file-icons/pdf.png" style="border-radius: 5px;margin: 0 auto;">
                    <img id="img1" v-else width="200" @click="verImagen(1)" class="img-responsive mb-2 ml-1 cursor-pointer"  v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc" style="border-radius: 5px;margin: 0 auto;">
                    <small class="mt-1 ml-2 text-center">{{ img_opcion_old_ruc }}</small>
                  </div>
                  <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                    <vs-button radius type="line" v-if="disableAsesor == false" @click="verImg_ruc = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </vx-tooltip>
                  </div>
              </div>
              <!--ARRAY IMAGENES-->
              <div class="flex mt-1" style="margin-top: -10px;" v-if="attachmentArray_ruc.length > 0" >
                <div class="flex" v-for="(tr,key) in attachmentArray_ruc" :key="key" style="margin: 0 auto;">
                    <div class="flex" style="flex-direction: column;">
                      <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                      <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                        <small class="mt-1 ml-2">{{ tr.name }}</small>
                    </div>
                    <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                      <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray_ruc,tr,1)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                    </vx-tooltip>
                  </div>
              </div>
            </div>
          </div>
          <!--BOTONES PARA GUADAR/CARGAR DOCUMENTOS-->
          <div class="vx-row" v-if="(userRoot || userFacturador || usuario.idusuario == tmpPedidos.id_asesor) && tmpPedidos.ifanticipo == 1 && tmpPedidos.estado !=2 ">
            <div class="vx-col sm:w-2/3 w-full mt-2 ml-3 flex">
              <vs-button @click="cargarTodosDocumentos()" class="mr-3 mb-2" icon-pack="feather" icon="icon-corner-down-left">Cargar Documentos</vs-button>
              <vs-button @click="subirDocumentosDespuesContrato()" v-if="tmpPedidos.contrato_generado != null" color="warning" type="border" icon-pack="feather" icon="icon-file-text" class="mb-2">Guardar documentos</vs-button>
            </div>
          </div>
          <!--FIN BOTONES PARA GUARDAR/CARGAR DOCUMENTOS-->
          <!--VISTA OBSERVACION-->
          <div style="width: 100%;" class="mt-5">
            <vs-textarea :disabled="disableAsesorFacturador" counter="500" style="width:100%;" height="200px"  label="Observación" :counter-danger.sync="counterDanger" v-model="pedido.observacion" />
          </div>
          <div class="flex"  :disabled="tmpPedidos.ifagregado_anticipo_aprobado == 0 ? false:true">
            <div v-if="disableAsesor == false">
              <b>Facturador puede visualizar:</b>
              <ul class="flex mt-2" >
                <li>
                  <vs-radio v-model="tmpPedidos.facturacion_vee" @input="guardarEstadoVer()" vs-name="radios1facturacion_vee" vs-value="1">Si</vs-radio>
                </li>
                <li>
                  <vs-radio v-model="tmpPedidos.facturacion_vee" @input="guardarEstadoVer()" class="ml-3" vs-name="radios1facturacion_vee" vs-value="0">No</vs-radio>
                </li>
              </ul>
            </div>
            <div v-if="userRoot || userFacturador">
              <vs-button class="ml-2 p-2" style="margin-top:-5px;" @click="campo='observacion';actualizarPedido(pedido.observacion)" color="primary" icon-pack="feather" type="border" icon="icon-message-square">Actualizar observación</vs-button>
            </div>
          </div>
          <!--VISTA COMENTARIO-->
          <div class="vx-col w-full mt-6 flex flex-grap gap-12 justify-center items-center" align="center">
              <vs-button color="success"  type="gradient" @click="input_comentario = ''; ver_comentarios(); popupComentarios = true">Ver comentarios <b>{{ cant_sms }}</b></vs-button>
              <!-- <vs-avatar size="large"  color="success" badge-color="warning" :badge="cant_sms" icon-pack="feather" icon="icon-message-square" @click="input_comentario = ''; ver_comentarios(); popupComentarios = true"> -->
          </div>
          <!--FIN VISTA COMENTARIO-->
          <!--VISTA VALORES ANTICIPOS ANTERIORES-->
          <div v-if="verAnticipos">
            <anticiposAnteriosVue :tmpPedidos="tmpPedidos" :arregloIdsCoincidencias = "arregloIdsCoincidencias" :region="pedido.region_idregion" :anticipoAprobado="pedido.anticipo_aprobado" @sendDeuda="changeAnticipo"/>
          </div>
          <!--FIN VISTA VALORES ANTICIPOS ANTERIORES-->
          <!--POPUP COMENTARIOS-->
          <vs-popup fullscreen title="Comentarios" :active.sync="popupComentarios">
            <div class="w-full" align="center">
              <vs-textarea v-model="input_comentario" class="w-ful mb-3" />
              <vs-button type="line" color="success" @click="guardar_comentario">Enviar</vs-button>
            </div>
            <vs-divider></vs-divider>
            <vs-list>
              <div :key="index" v-for="(item, index) in comentarios">
                <vs-list-header :title="item.nombres + ' ' + item.apellidos"></vs-list-header>
                <vs-list-item :subtitle="item.comentario">
                  <span style="font-size: 12px;" class="m-2"> {{item.created_at}} </span>
                </vs-list-item>
              </div>
            </vs-list>
          </vs-popup>
          <!--FIN POPUP COMENTARIOS-->
          <!--VER CEDULA-->
          <vs-popup class="holamundo" fullscreen  title="Mostrar foto de evidencia" :active.sync="popupImagen">
            <!-- <img style="border-radius: 5px;" v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old"> -->
            <image-zoom
              :regular="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old"
              :zoom-amount="3"
              :click-zoom="true"
              click-message="De click para aumentar"
              img-class="img-fluid"
              >
            </image-zoom>
          </vs-popup>
          <!--VER RUC-->
          <vs-popup class="holamundo" fullscreen  title="Mostrar File RUC" :active.sync="popupRuc">
            <image-zoom
              :regular="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc"
              :zoom-amount="3"
              :click-zoom="true"
              click-message="De click para aumentar"
              img-class="img-fluid"
              >
            </image-zoom>
            <!-- <img style="border-radius: 5px;" v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc"> -->
          </vs-popup>
        </tab-content>
      </form-wizard>
      <!--MODALES-->
      <!--MODAL PARA AGREGAR DOCUMENTOS ANTERIORES-->
      <vs-popup classContent="popup-example" fullscreen title="Documentos Anteriores" :active.sync="popupMostrarDocumentosAnteriores">
        <documentosAnterioresVue :tmpPedidos="tmpPedidos" v-if="popupMostrarDocumentosAnteriores" :arregloDocumentosAnteriores="arregloDocumentosAnteriores" @rechargeDocumentos="rechargeDocumentos"/>
      </vs-popup>
    </vx-card>
  </div>
</template>
<script>
import Vue from 'vue';
import imageZoom from 'vue-image-zoomer';
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import formpedidos from './form_pedido.vue'
import formlibros from './form_libros.vue'
import axios from 'axios'
import pedidos_evidencia_aprobacionVue from './components/pedidos_evidencia_aprobacion.vue';
import anticiposAnteriosVue from './components/milton/anticiposAnterios.vue';
import ConvenioVue from './components/convenio/Convenio.vue';
import documentosAnterioresVue from './components/documentosAnteriores/documentosAnteriores.vue';
export default {
    components:{
      FormWizard,
      TabContent,
      'v-select': vSelect,
      formpedidos,
      formlibros,
      anticiposAnteriosVue,
      pedidos_evidencia_aprobacionVue,
      imageZoom,
      ConvenioVue,
      documentosAnterioresVue,
    },
    data: () => ({
      usuario: [],
      id_pedido: '',
      txt_finalizar: 'Finalizar',
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
        pendiente_liquidar:0,
        convenio_anios:'',
        anticipo_aprobado:0,
        contrato_generado:'',
        ifanticipo:false,
        ifagregado_anticipo_aprobado:0,
        deuda:0,
        periodo_deuda:'',
        region_idregion:0,
        historicoEstado:0,
        estado:0,

      },
      tmpPedidos:[],
      porcentaje_descuento_series_basicas:0,
      counterDanger: false,
      //variables para images
      src_imagen_opcion:'',
      img_opcion_old:'',
      verImg:false,
      popupImagen:false,
      errorImage:'no',
      tamanioError:'no',
      //fin variables para images
      //variables para ruc
      src_imagen_opcion_ruc:'',
      img_opcion_old_ruc:'',
      verImg_ruc:false,
      popupRuc:false,
      errorImage_ruc:'no',
      tamanioError_ruc:'no',
      //fin variables para ruc
      disableAsesor:false,
      disableFacturador:false,
      disableAsesorFacturador:false,
      //comentarios
      comentarios: [],
      input_comentario: '',
      popupComentarios: false,
      cant_sms: 0,
      //fin variables comentarios
      //variables de coincidencias
      arregloIdsCoincidencias:[],
      verAnticipos:false,
      userRoot:false,
      //variable subir imagen
      attachmentArray:[],
      attachmentArray_ruc:[],
      tmpFiles:[],
      checkFueraPlataforma:false,
      //variables para documentos anteriores
      arregloDocumentosAnteriores:[],
      popupMostrarDocumentosAnteriores:false,
      //fin variables para documentos anteriores
      //modificarAnticipoAprobado => 0 =NO; 1 SI;
      modificarAnticipoAprobado:0,
      userFacturador:false,
      campo:'',
    }),
    mounted() {
      let me = this;
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      if(me.usuario.id_group == 23) me.userFacturador = true
      me.getUserRoot(me.usuario);
      if( this.usuario.id_group == 22 || this.usuario.id_group == 23 ){
        this.txt_finalizar = 'Generar contrato'
      }
      if( this.$route.params.pedido == 0 ){
        localStorage.id_pedido = ''
      }else{
        localStorage.id_pedido = this.$route.params.pedido
        me.updateDocumentos()
      }
    },
    methods: {
      changeAnticipoA(e){
        let me = this
        if(e.tipo == 'guardarAnticipo'){
          me.pedido.ifagregado_anticipo_aprobado = 1
          me.pedido.anticipo_aprobado = e.value
          //si modifica el facturador o admin el anticipo aprobado lo guardare en un historico
          me.modificarAnticipoAprobado = e.modificarAnticipoAprobado
          me.guardarPedido2()
          return
        }
        if(e.tipo == 'guardarAnticipoContrato'){
          me.pedido.anticipo_aprobado = e.value
          me.saveAnticipoContrato()
        }
        if(e.tipo == 'guardar'){
          me.get_datos_pedido()
          return
        }
      },
      getUserRoot(dato) {
        let me = this;
        this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
          .then((result) => {
            if (result.data.length > 0) {
              me.userRoot = true;
            }
            if(this.usuario.id_group == 11 || this.usuario.id_group == 23 || this.userRoot){
              this.disableAsesorFacturador = false
            }else{
              this.disableAsesorFacturador = true
            }
            if(this.usuario.id_group == 11 || this.userRoot == true){
              this.disableAsesor = false
              this.disableFacturador = true
            }else{
              this.disableAsesor = true
              this.disableFacturador = false
            }
          })
          .catch((err) => {
              console.log(err)
          })
      },
      //metodo para actualizar la deuda en el anticipo
      changeAnticipo(e){
        let me = this
        me.pedido.ifanticipo                   = true
        me.pedido.deuda                        = Math.abs(e.setDeuda)
        // me.pedido.anticipo_aprobado            = Math.abs(e.setDeuda)
        me.pedido.periodo_deuda                = "Deuda período "+ e.periodo
        me.pedido.ifagregado_anticipo_aprobado = 1
        me.guardarDeuda()
      },
      guardarDeuda(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',                    me.pedido.id_pedido);
        formData.append('ifanticipo',                   1);
        formData.append('deuda',                        me.pedido.deuda)
        // formData.append('anticipo_aprobado',            me.pedido.anticipo_aprobado)
        formData.append('periodo_deuda',                me.pedido.periodo_deuda)
        // formData.append('ifagregado_anticipo_aprobado', 1)
        this.$http.post(this.$server_url+'guardarPedidoDeuda', formData)
        .then(function (res) {

        })
        .catch(function (error) {})
      },
      //fin metodos para las deudas anteriores
      getChangePedido(e){
        let me = this
        me.pedido.anticipo           = e.anticipo
        me.pedido.pendiente_liquidar = e.liquidar
        if(me.pedido.deuda > 0){
          me.pedido.ifanticipo = true
        }
      },
      formSubmitted() {
        let me = this;
        if( this.usuario.id_group == 22 || this.usuario.id_group == 23 ){
          this.generarContrato()
        }else{
          me.guardarPedido()
        }
      },
      generarContrato(){
        this.$vs.dialog({
          type: 'confirm',
          color: 'warning',
          title: `Confirmar`,
          text: '¿Está seguro de guardar el contrato para este pedido?',
          accept: this.confirmGenerarContrato
        })
      },
      async confirmGenerarContrato(){
        let me = this
        if( localStorage.getItem('contrato_generado') != '' && localStorage.getItem('contrato_generado') != 'null' && localStorage.getItem('contrato_generado') != null ){
          me.$vs.notify({ time: 8000, text: 'Este pedido ya tiene un contrato generado: ' + localStorage.getItem('contrato_generado') , color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        me.$vs.loading()
        await me.$http.get(me.$server_url+'generar_contrato_pedido/'+localStorage.id_pedido+'/'+me.usuario.idusuario)
        .then(res => {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({ time: 8000, text: res.data.message , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          if( res.data.error ){
            me.$vs.notify({ time: 8000, text: res.data.error , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          localStorage.setItem("contrato_generado", res.data.form_data.veN_CODIGO) //contrato generado
          me.guardar_beneficiarios_milton(res.data.form_data.veN_CODIGO)
        })
        .catch(err => {
          me.$vs.notify({ time: 4000, text: 'Error al generar el contrato.' , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
          console.log(err);
          me.$vs.loading.close();
        })
      },
      async guardar_beneficiarios_milton(cod_contrato){
        let me = this
        me.$vs.loading();
        let formData = new FormData();
        formData.append('id_pedido', localStorage.id_pedido);
        formData.append('cod_contrato', cod_contrato);
        await this.$http.post(this.$server_url + 'save_beneficiarios_db_milton', formData)
        .then(res => {
          console.log(res.data)
          me.$vs.loading.close();
          me.$vs.notify({ time: 8000, text: 'Contato generado: ' + cod_contrato , color: 'success', iconPack: 'feather', icon: 'icon-check' })
        })
        .catch(err => {
          me.$vs.notify({ time: 6000, text: 'Error al guardar beneficiarios en base de milton' , color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
          console.log(err);
          me.$vs.loading.close();
        })
      },
      get_datos_pedido(){
        let me = this
        this.$http.get(this.$server_url+'get_datos_pedido/'+localStorage.id_pedido)
        .then(res => {
          let datos = res.data.pedido[0]
          me.tmpPedidos = res.data.pedido[0]
          me.tmpFiles   = res.data.files
          me.pedido.id_periodo = datos.id_periodo
          me.pedido.estado    = datos.estado
          me.pedido.id_pedido = datos.id_pedido
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
          //CEDULA
          me.img_opcion_old                 = datos.imagen
          //RUC
          me.img_opcion_old_ruc             = datos.doc_ruc
          me.pedido.contrato_generado       = datos.contrato_generado
          me.porcentaje_descuento_series_basicas = datos.porcentaje_descuento
          me.pedido.porcentaje_anticipo     = datos.porcentaje_anticipo
          me.pedido.convenio_anios          = datos.convenio_anios
          me.pedido.anticipo_aprobado       = datos.anticipo_aprobado
          me.pedido.ifagregado_anticipo_aprobado   = datos.ifagregado_anticipo_aprobado
          me.pedido.deuda                   = datos.deuda
          me.pedido.periodo_deuda           = datos.periodo_deuda
          me.pedido.region_idregion         = datos.region_idregion
          me.pedido.historicoEstado         = datos.historicoEstado
          //datos institucion
          me.pedido.telefonoInstitucion     = datos.telefonoInstitucion
          me.pedido.direccionInstitucion    = datos.direccionInstitucion
          me.pedido.ruc                     = datos.ruc
          me.pedido.nivel                   = datos.nivel
          me.pedido.tipo_descripcion        = datos.tipo_descripcion
          me.getIdsMilton(datos)
          //fin datos institucion
          //SETEAR CEDULA
          if(me.img_opcion_old == null || me.img_opcion_old == "" || me.img_opcion_old == "null"){
            me.verImg = false;
          }else{
            me.verImg = true;
          }
          //SETEAR RUC
          if(me.img_opcion_old_ruc == null || me.img_opcion_old_ruc == "" || me.img_opcion_old_ruc == "null"){
            me.verImg_ruc = false;
          }else{
            me.verImg_ruc = true;
          }
          //FIN SETEAR
          if(datos.ifanticipo == 1){
            me.pedido.ifanticipo = true
          }
          if(datos.ifanticipo == 0){
            me.pedido.ifanticipo = false
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      getIdsMilton(tr){
        let me = this
        var preCoincicias2 = ''
        var preArreglo = []
        if(tr.codigo_mitlon_coincidencias == "null" || tr.codigo_mitlon_coincidencias == null || tr.codigo_mitlon_coincidencias == ""){
        }else{
          let transforWords = tr.codigo_mitlon_coincidencias
          preCoincicias2 = transforWords.split(",")
        }
        //si no coincidencias en campo codigo milton coincidenias
        if(preCoincicias2 == ""){
        }else{
          preArreglo.push(preCoincicias2)
        }
        //setear array
        me.arregloIdsCoincidencias = preArreglo.flat()
        //no agregar ids duplicados
        let resolve = me.arregloIdsCoincidencias.filter( p => p == tr.codigo_institucion_milton )
        if(resolve.length == 0){
          me.arregloIdsCoincidencias.push(tr.codigo_institucion_milton)
        }
        me.verAnticipos = true
      },
      verImagen(archivo){
        let me = this;
        //cedula
        if(archivo == 0) { me.popupImagen = true }
        else             { me.popupRuc = true }
      },
      verArchivo(tip){
        let me = this;
        var url
        //tipo = 0 cedula ; 1 = ruc
        if(tip == 0){
          url = this.$data_url+'archivos/pedidos/img/img_cedula/'+me.img_opcion_old
        }else{
          url = this.$data_url+'archivos/pedidos/img/img_cedula/'+me.img_opcion_old_ruc
        }
        window.open(url)
      },
      uploadFiles(e){
        let me = this;
        me.attachmentArray    = []
        me.verImg             = false
        me.src_imagen_opcion  = ' ';
        me.errorImage = 'no'
        me.tamanioError="no"
        let validar = e.target.files[0].type;
        let tamanio = e.target.files[0].size;
        if(tamanio > 5000000){
          me.tamanioError="yes"
          me.$vs.notify({
          text:'El tamaño de la imagen excede 5MB',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg' || validar == 'application/pdf'){
          me.errorImage = 'no'
        }else{
          me.errorImage = 'yes'
          me.$vs.notify({
          text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg/pdf',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //var archivo = document.getElementById("file1").files[0];
        var archivo = e.target.files[0];
        me.tipoFile  = ""
        if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile = "img"
        else me.tipoFile = "other"
        var reader = new FileReader();
        if (me) {
          reader.readAsDataURL(archivo );
          reader.onloadend = function () {
            var cal = new Object();
            cal.file = archivo
            cal.img  = reader.result
            cal.tipo = me.tipoFile
            cal.name = archivo.name
            me.attachmentArray.push(cal)
          }
        }
      },
      uploadFilesRUC(e){
        let me = this;
        me.attachmentArray_ruc    = []
        me.verImg_ruc             = false
        me.src_imagen_opcion_ruc  = ' ';
        me.errorImage_ruc         = 'no'
        me.tamanioError_ruc       = "no"
        let validar = e.target.files[0].type;
        let tamanio = e.target.files[0].size;
        if(tamanio > 5000000){
          me.tamanioError_ruc     = "yes"
          me.$vs.notify({
          text:'El tamaño de la imagen excede 5MB',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg' || validar == 'application/pdf'){
          me.errorImage_ruc = 'no'
        }else{
          me.errorImage_ruc = 'yes'
          me.$vs.notify({
          text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg/pdf',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //var archivo = document.getElementById("file1").files[0];
        var archivo = e.target.files[0];
        me.tipoFile_ruc  = ""
        if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile_ruc = "img"
        else me.tipoFile_ruc = "other"
        var reader = new FileReader();
        if (me) {
          reader.readAsDataURL(archivo );
          reader.onloadend = function () {
            var cal = new Object();
            cal.file = archivo
            cal.img  = reader.result
            cal.tipo = me.tipoFile_ruc
            cal.name = archivo.name
            me.attachmentArray_ruc.push(cal)
          }
        }
      },
      removeItemFromArr (arr, item,archivo) {
        //cedula
        if(archivo == 0){
          this.verImg = false
          document.getElementById("file10").value = '';
        }else{
          this.verImg_ruc = false
          document.getElementById("file11").value = '';
        }
        const i = arr.indexOf(item)
        arr.splice(i, 1)
      },
      //guadar el estado para el facturador pueda ver o no
      guardarEstadoVer(){
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
        if(me.pedido.contrato_generado == null || me.pedido.contrato_generado == "null" || me.pedido.contrato_generado == ""){
        }else{
          if(me.usuario.id_group == 11 || me.usuario.id_group == 22){
            me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'El pedido ya tiene el contrato ' + me.pedido.contrato_generado +" No puede realizar cambios"
            })
            return false;
          }
        }
        let formData = new FormData();
        me.$vs.loading()
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('facturacion_vee',      me.tmpPedidos.facturacion_vee)
        me.$vs.loading();
        this.$http.post(this.$server_url+'saveEstadoFacturador', formData)
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
          }
          me.$vs.notify({
          text:'Se cambio de estado correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.get_datos_pedido()
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      },
      //GUADAR EL ANTICIPO DESPUES DEL CONTRATO
      saveAnticipoContrato(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('anticipo_aprobado',    me.pedido.anticipo_aprobado)
        formData.append('contrato',             me.pedido.contrato_generado)
        formData.append('user_created',         me.usuario.idusuario)
        formData.append('id_group',             me.usuario.id_group)
        me.$vs.loading()
        this.$http.post(this.$server_url+'guardarAnticipoAprobadoContrato', formData)
        .then(res => {
          me.$vs.loading.close()
          me.get_datos_pedido()
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch((e)=>{
          me.$vs.loading.close()
        })
      },
      guardarPedido2(){
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
        if(me.pedido.contrato_generado == null || me.pedido.contrato_generado == "null" || me.pedido.contrato_generado == ""){
        }else{
          if(me.usuario.id_group == 11 || me.usuario.id_group == 22){
            me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'El pedido ya tiene el contrato ' + me.pedido.contrato_generado +" No puede realizar cambios"
            })
            return false;
          }
        }
        //validacion convenio
        if( me.pedido.convenio_anios > 10 || me.pedido.convenio_anios == 1){
          me.$vs.notify({ text: 'El numero de convenio no es correcto, No puede ser menor a 2 ni mayor a  10.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle',time:4000 })
          return
        }
        //actualizar fecha creacion pedido
        if(me.pedido.id_pedido > 0 && me.usuario.id_group == 11){
          me.UpdateFechaCreacionPedido(me.pedido.id_pedido)
        }
        let formData = new FormData();
        me.$vs.loading()
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('tipo_venta',           me.pedido.tipo_venta.id_tipo);
        formData.append('tipo_venta_descr',     me.pedido.tipo_venta.tipo_venta);
        formData.append('fecha_envio',          me.pedido.fecha_envio);
        formData.append('fecha_entrega',        me.pedido.fecha_entrega);
        formData.append('institucion',          me.pedido.institucion.id_institucion);
        formData.append('periodo',              me.pedido.id_periodo);
        formData.append('descuento',            me.pedido.descuento);
        formData.append('anticipo',             me.pedido.anticipo);
        formData.append('id_asesor',            me.pedido.asesor.idusuario);
        formData.append('id_usuario_verif',     me.usuario.idusuario);
        formData.append('observacion',          me.pedido.observacion);
        formData.append('deuda',                me.pedido.deuda)
        formData.append('periodo_deuda',        me.pedido.periodo_deuda)
        let ianticipo = 0
        if(me.pedido.ifanticipo) {
          ianticipo = 1
        }
        else{
          ianticipo = 0
        }
        formData.append('ifanticipo',           ianticipo);
        formData.append('porcentaje_anticipo',  me.porcentaje_descuento_series_basicas);
        formData.append('anticipo_aprobado',    me.pedido.anticipo_aprobado)
        formData.append('pendiente_liquidar',   me.pedido.pendiente_liquidar);
        formData.append('convenio_anios',       me.pedido.convenio_anios)
        formData.append('ifagregado_anticipo_aprobado', me.pedido.ifagregado_anticipo_aprobado)
        if(me.pedido.ifagregado_anticipo_aprobado == 3 || me.pedido.ifagregado_anticipo_aprobado == 4){
          formData.append('anticipoModificadoPorGerencia',       'yes')
        }
        formData.append('facturacion_vee',      me.tmpPedidos.facturacion_vee)
        //para actualizar la institucion
        formData.append('ruc',                  me.pedido.ruc);
        formData.append('direccionInstitucion', me.pedido.direccionInstitucion);
        formData.append('nivel',                me.pedido.nivel);
        formData.append('tipo_descripcion',     me.pedido.tipo_descripcion);
        formData.append('telefonoInstitucion',  me.pedido.telefonoInstitucion);
        //modificarAnticipoAprobado = 1 => si modifica el aprobado; 0 no modifica
        formData.append('modificarAnticipoAprobado',me.modificarAnticipoAprobado)
        formData.append('user_created',         me.usuario.idusuario)
        formData.append('id_group',             me.usuario.id_group)
        //fin para actualizar la institucion
        me.$vs.loading();
        this.$http.post(this.$server_url+'pedidos', formData)
        // axios.post(this.$data_url+'api/guardarPedido',formData)
        .then(res => {
          me.$vs.loading.close();
          me.modificarAnticipoAprobado = 0
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          if( res.data.error ){
            alert(res.data.error)
            return
          }else{
          }
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.get_datos_pedido()
          // if(me.usuario.id_group == 11){
          //   window.location.href = "/pedidos/"+me.pedido.id_pedido;
          // }else{
          //   window.location.href = "/pedidos/administrador/"+me.pedido.id_pedido;
          // }
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
        if(me.pedido.contrato_generado == null || me.pedido.contrato_generado == "null" || me.pedido.contrato_generado == ""){
        }else{
          if(me.usuario.id_group == 11){
              me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'El pedido ya tiene el contrato ' + me.pedido.contrato_generado +" No puede realizar cambios"
              })
            return false;
          }
        }
        if( me.pedido.direccionInstitucion == '' || me.pedido.ruc == '' || me.pedido.tipo_descripcion == '' || me.pedido.telefonoInstitucion == ''){
          me.$vs.notify({ text: 'Llene todos los campos antes de guardar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        //validacion convenio
        if( me.pedido.convenio_anios > 10 || me.pedido.convenio_anios == 1){
          me.$vs.notify({ text: 'El numero de convenio no es correcto, No puede ser menor a 2 ni mayor a  10.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle',time:4000 })
          return
        }
        if(me.pedido.observacion == "" || me.pedido.observacion == null || me.pedido.observacion == undefined){
        }else{
          if(me.pedido.observacion.length > 500){
            me.$vs.notify({ text: 'Máximo 500 caracteres.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle',time:4000 })
            return
          }
        }
        var fileImgPreg = ""
        var fileImgPreg_ruc = ""
        if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
          if(me.verImg == false){
            //subir la foto de la cedula de anticipo
            if(me.attachmentArray.length == 0){
              me.$vs.notify({
                text: "Suba la foto de la cédula para evidencia del anticipo",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          if(me.verImg_ruc == false){
            //subir la archivo para el RUC
            if(me.attachmentArray_ruc.length == 0){
              me.$vs.notify({
                text: "Suba el archivo del ruc por favor",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          //VALIDACION CEDULA
          if(me.tamanioError == 'yes'){
            me.$vs.notify({
            text:'El tamaño de la imagen de la cedula excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage == 'yes'){
            me.$vs.notify({
            text:'El formato de la imagen de la cedula solo se acepta jpg/png/jpeg',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          //VALIDACION RUC
          if(me.tamanioError_ruc == 'yes'){
            me.$vs.notify({
            text:'El tamaño del archivo del ruc excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage_ruc == 'yes'){
            me.$vs.notify({
            text:'El formato del archivo del ruc solo se acepta jpg/png/jpeg/',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
        }
        //CEDULA
        if(document.getElementById("file10") != null){
          fileImgPreg     = document.getElementById("file10").files[0];
        }
        if(document.getElementById("file11") != null){
          fileImgPreg_ruc = document.getElementById("file11").files[0];
        }
        //RUC
        //actualizar fecha creacion pedido
        if(me.pedido.id_pedido > 0 && me.usuario.id_group == 11){
          me.UpdateFechaCreacionPedido(me.pedido.id_pedido)
        }
        let formData = new FormData();
        me.$vs.loading()
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('tipo_venta',           me.pedido.tipo_venta.id_tipo);
        formData.append('tipo_venta_descr',     me.pedido.tipo_venta.tipo_venta);
        formData.append('fecha_envio',          me.pedido.fecha_envio);
        formData.append('fecha_entrega',        me.pedido.fecha_entrega);
        formData.append('institucion',          me.pedido.institucion.id_institucion);
        formData.append('periodo',              me.pedido.id_periodo);
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
        //para actualizar la institucion
        formData.append('ruc',                  me.pedido.ruc);
        formData.append('direccionInstitucion', me.pedido.direccionInstitucion);
        formData.append('nivel',                me.pedido.nivel);
        formData.append('tipo_descripcion',     me.pedido.tipo_descripcion);
        formData.append('telefonoInstitucion',  me.pedido.telefonoInstitucion);
        let ianticipo = 0
        if(me.pedido.ifanticipo) {
          ianticipo = 1
        }
        else{
          ianticipo = 0
        }
        formData.append('ifanticipo',           ianticipo);
        formData.append('porcentaje_anticipo',  me.porcentaje_descuento_series_basicas);
        formData.append('anticipo_aprobado',    me.pedido.anticipo_aprobado)
        formData.append('pendiente_liquidar',   me.pedido.pendiente_liquidar);
        formData.append('convenio_anios',       me.pedido.convenio_anios)
        formData.append('ifagregado_anticipo_aprobado', me.pedido.ifagregado_anticipo_aprobado)
        //fin para actualizar la institucion
        me.$vs.loading();
        axios.post(this.$data_url+'api/guardarPedido',formData)
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
            me.src_imagen_opcion     = '';
            me.src_imagen_opcion_ruc = "";
            if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
              document.getElementById("file10").value = '';
              document.getElementById("file11").value = '';
            }

          }
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          if(me.usuario.id_group == 11){
            let ruta = "/listado_pedidos_asesor/" +localStorage.id_periodo_selected+"/"+localStorage.descripcion_periodo
            me.$router.push(ruta)
          }else{
            window.location.href = "/pedidos/administrador/"+me.pedido.id_pedido;
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
      //===METODOS PARA ACTUALIZAR DOCUMENTOS ANTERIORES=====
      updateDocumentos(){
        let me = this;
        this.$http.get(this.$server_url+'updateDocumentoAnterior/'+localStorage.id_pedido+'/'+'0')
          .then(function (res) {
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      //===FIN METODOS PARA ACTUALIZAR DOCUMENTOS ANTERIORES====
      getSeries(){
        let me = this;
        this.id_pedido = localStorage.id_pedido
        if( this.id_pedido == '' ){
          return new Promise((resolve, reject) => {
            reject('Guarde el pedido antes de continuar')
            this.$vs.notify({ text: 'Guarde el pedido antes de continuar', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
          })
        }
        return new Promise((resolve, reject) => {
          this.$http.get(this.$server_url+'getBeneficiariosXPedido/'+localStorage.id_pedido)
          .then(result => {
            if (result.data.length > 0) {
              resolve(true)
            } else {
              reject("Guarde un beneficiario para continuar");
              this.$vs.notify({ text: 'Guarde un beneficiario para continuar', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
            }
          })
        })
      },
      getPedidos: function() {
      this.id_pedido = localStorage.id_pedido
        return new Promise((resolve, reject) => {
          this.$refs.formpedidos.get_datos_pedido();
          this.get_datos_pedido()
          resolve(true)
        })
      },

      //METODOS PARA COMENTARIOS
      ver_comentarios(){
        let me = this
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_comentarios_pedido/'+localStorage.id_pedido)
        .then(res => {
          me.comentarios = res.data
          me.cant_sms = res.data.length
          me.$vs.loading.close();
        })
        .catch(err => {
          me.$vs.loading.close();
        })
      },
      guardar_comentario(){
        let me = this
        let formData = new FormData();
        formData.append('id_pedido',  localStorage.id_pedido);
        formData.append('comentario', me.input_comentario);
        formData.append('id_usuario', me.usuario.idusuario);
        formData.append('id_group',   me.usuario.id_group)
        me.$vs.loading();
        this.$http.post(this.$server_url+'guardar_comentario', formData)
        .then(res => {
          me.input_comentario = ''
          me.ver_comentarios()
          me.$vs.loading.close();
        })
        .catch(err => {
          console.log(err)
            me.$vs.loading.close();
        })
      },
      //===METODOS DOCUMENTOS ANTERIORES========
      rechargeDocumentos(e){
        let me = this;
        //0 => only recharge; 1 => recharge and load pedido
        if(e == 0){
          me.popupMostrarDocumentosAnteriores = false;
        }
        if(e == 1){
          me.popupMostrarDocumentosAnteriores = false;
          me.get_datos_pedido()
          me.updateDocumentos()
          setTimeout(function(){
            me.pedido.ifanticipo = true
          }, 2000);
        }
      },
      verDocumentosAnteriores(){
        let me = this
        let mensaje = ""
        if(me.pedido.ifanticipo){
          mensaje = "activar anticipo"
        }else{
          mensaje = "desactivar anticipo"
        }
        if(me.userFacturador || me.userRoot){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo cambiar',
            cancelText:'Cancelar',
            text: `Estas seguro de ${mensaje} .`,
            accept:this.acceptCambiarAnticipo
          })
          return
        }
        if(me.pedido.ifanticipo){
          me.cargarTodosDocumentos()
        }
      },
      cargarTodosDocumentos(){
        let me = this;
        me.$vs.loading()
          this.$http.get(this.$server_url+'getTraerDocumentoDocente/'+me.tmpPedidos.id_pedido)
          .then(function (res) {
            me.$vs.loading.close()
            let datos = res.data
            me.arregloDocumentosAnteriores       = datos.filter(p => p.id_periodo != me.tmpPedidos.id_periodo)
            me.popupMostrarDocumentosAnteriores  = true;
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },
      acceptCambiarAnticipo(){
        let me = this;
        me.campo = 'ifanticipo'
        let valor = 0
        if(me.pedido.ifanticipo){
          valor = 1
        }else{
          valor = 0
        }
        me.actualizarPedido(valor)
      },
      //===FIN METODOS DOCUMENTOS ANTERIORES====
      //===METODOS SUBIR DOCUMENTOS DESPUES DEL CONTRATO===
      subirDocumentosDespuesContrato(){
        let me = this
        if(me.tmpPedidos.estado == 2){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'No se puede modificar el pedido anulado',
            time:5000,
            })
          return false
        }
        var fileImgPreg = ""
        var fileImgPreg_ruc = ""
        if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
          if(me.verImg == false){
            //subir la foto de la cedula de anticipo
            if(me.attachmentArray.length == 0){
              me.$vs.notify({
                text: "Suba la foto de la cédula para evidencia del anticipo",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          if(me.verImg_ruc == false){
            //subir el archivo para el RUC
            if(me.attachmentArray_ruc.length == 0){
              me.$vs.notify({
                text: "Suba el archivo del ruc por favor",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
          }
          //VALIDACION CEDULA
          if(me.tamanioError == 'yes'){
            me.$vs.notify({
            text:'El tamaño de la imagen de la cedula excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage == 'yes'){
            me.$vs.notify({
            text:'El formato de la imagen de la cedula solo se acepta jpg/png/jpeg/pdf',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          //VALIDACION RUC
          if(me.tamanioError_ruc == 'yes'){
            me.$vs.notify({
            text:'El tamaño del archivo del ruc excede 5MB',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.errorImage_ruc == 'yes'){
            me.$vs.notify({
            text:'El formato del archivo del ruc solo se acepta jpg/png/jpeg/pdf',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
        }
        //CEDULA
        if(document.getElementById("file10") != null){
          fileImgPreg     = document.getElementById("file10").files[0];
        }
        //RUC
        if(document.getElementById("file11") != null){
          fileImgPreg_ruc = document.getElementById("file11").files[0];
        }
        let formData = new FormData();
        me.actualizarPedidoSinValor("documentos Imagenes")
        me.$vs.loading()
        formData.append('id_pedido',            me.pedido.id_pedido);
        //cedula
        formData.append('imagen',               fileImgPreg);
        formData.append('img_opcion_old',       me.img_opcion_old)
        //ruc
        formData.append('doc_ruc',              fileImgPreg_ruc);
        formData.append('img_opcion_old_ruc',   me.img_opcion_old_ruc)
        //fin para actualizar la institucion
        me.$vs.loading();
        axios.post(this.$data_url+'api/guardarDocumentosDespuesContrato',formData)
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
            me.src_imagen_opcion     = '';
            me.src_imagen_opcion_ruc = "";
            if(me.pedido.anticipo > 0 && me.usuario.id_group == 11){
              document.getElementById("file10").value = '';
              document.getElementById("file11").value = '';
            }
          }
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.getPedidos()
          me.updateDocumentos()
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      },
      actualizarPedidoSinValor(campo){
          let me = this;
          let formData = new FormData();
          //noCambios cuando no voy a actualizar nada solo voy a poner en el historico que hubo cambio en el convenio
          formData.append('noCambios',  "yes")
          formData.append('campo',      campo)
          formData.append('id_pedido',  me.pedido.id_pedido);
          formData.append('valor',      "");
          formData.append('user_created',me.usuario.idusuario)
          this.$http.post(this.$server_url+'actualizarPedido', formData)
          .then(function (res) {
          })
          .catch(function (error) {})
        },
      //===FIN METODOS PARA SUBIR DOCUMENTOS DESPUES DEL CONTRATO====
      //===METODOS ROOT========
      actualizarPedido(valor){
        let me = this;
        let formData = new FormData();
        formData.append('actualizarCampo','yes')
        formData.append('campo',      me.campo)
        formData.append('id_pedido',  me.pedido.id_pedido);
        formData.append('valor',      valor);
        formData.append('user_created',me.usuario.idusuario)
        this.$http.post(this.$server_url+'actualizarPedido', formData)
        .then(function (res) {
          me.$vs.notify({
            text: res.data.message,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.get_datos_pedido()
        })
        .catch(function (error) {})
      },
      //===FIN METODOS ROOT====
  },
}
</script>
<style scoped>
  @media(max-width: 540px) {
    .text-convenio{
      display: none;
    }
  }
  @media(max-width: 414px) {
    .text-anticipoA{
      width: 100%!important;
    }
    .btnGuardar{
      margin: 0 auto;
      margin-top: -20px;
    }
    .text-convenio{
      display: none;
    }
    .text-observacion{
      width: 100%!important;
      margin-top: -30px!important;
    }

    .text-imagen{
      margin-top: 10px;
      width: 100%!important;
    }
  }
  @media(max-width: 414px) {
    .deuda{
      width: 100%!important;
    }
  }
  @media(max-width: 1280px) {
    .contenedor-file{
      width: 80%!important;
      margin: 0 auto;
    }
  }
  @media(max-width: 540px) {
    .contenedor-file{
      width: 100%!important;
    }
    .upload-container input{
      padding:100px 0px 100px 77px!important;
      font-size: 12px!important;
    }
  }
  @media(max-width: 414px) {
    .contenedor-file{
      width: 100%!important;
    }
    .upload-container input{
      padding:100px 0px 100px 17px!important;
      font-size: 8px!important;
    }
  }
  @media(max-width: 375px) {
    .upload-container input{
      padding:100px 0px 100px 17px!important;
      font-size: 8px!important;
    }
    .text-convenio{
      display: none;
    }
    .text-observacion{
      width: 100%!important;
      margin-top: -30px!important;
    }
    .text-imagen{
      margin-top: 10px;
      width: 100%!important;
    }
    .text-anticipoA{
      width: 100%!important;
    }
    .btnGuardar{
      margin: 0 auto;
      margin-top: -10px;
    }
  }
  /*Estilos para subir foto */
  .upload-container{
      position:relative}
    .upload-container input{
      border:1px solid #92b0b3;
      background:#217bc5;
      outline:2px dashed #92b0b3;
      outline-offset:-10px;
      padding:100px 0px 100px 130px;
      width:100%;
      color:white;
    }
    .upload-container input:hover{
      background:#2c78cf}
    .upload-container:before{
      position:absolute;
      bottom:50px;
      left:26%;
      font-size: 13px;
      content:" Seleccione una archivo o arrastrelo ";
      color:#f1f9fa;
      font-weight:900;
    }
    input[type=file]::file-selector-button {
      margin-right: 10px;
      border: none;
      background: #000;
      padding: 10px 20px;
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      transition: background .2s ease-in-out;
    }
  input[type=file]::file-selector-button:hover {
    background: #0d45a5;
  }
</style>
