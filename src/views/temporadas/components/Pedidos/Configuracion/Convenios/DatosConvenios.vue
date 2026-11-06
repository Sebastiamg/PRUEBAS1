<template>
  <div>
    <vs-table :data="arrayInformation" stripe  max-items="2" search pagination>
      <template slot="thead">
        <vs-th>#</vs-th>
        <vs-th>Datos</vs-th>
        <vs-th>Observación</vs-th>
        <vs-th>Valores</vs-th>
        <vs-th>Años</vs-th>
        <vs-th>Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{ tr.id }}</vs-td>
          <vs-td :data="tr.email">
            <b>Institución:</b>
            <p>{{ tr.nombreInstitucion }}</p>
            <b>Período:</b>
            <p>{{ tr.periodo }}</p>
            <b>Convenio se encuentra:</b>
            <p v-if="tr.convenio_aprobado == 0">creado / pendiente</p>
            <p v-if="tr.convenio_aprobado == 1" class="font-bold text-warning">Solicitado a gerencia ${{ tr.valor_sugerido }} </p>
            <p v-if="tr.convenio_aprobado == 2" class="text-danger">Rechazado por  gerencia ${{ tr.valor_sugerido }} </p>
            <p v-if="tr.convenio_aprobado == 3" class="font-bold text-success">Aprobado por gerencia ${{ tr.valor_aprobado_gerencia }} </p>
            <p v-if="tr.convenio_aprobado == 4" class="font-bold text-warning">Aprobado por facturador
              <span v-if="tr.user_aprueba">: {{ tr.user_aprueba }}</span>
            </p>
            <div v-if="tr.convenio_aprobado == 2 || tr.convenio_aprobado == 3 || tr.convenio_aprobado ==4">
              <div v-if="tr.convenio_aprobado == 3 || tr.convenio_aprobado ==4">
                <b>Fecha aprobación:</b>
                <p>{{ tr.fecha_aprobacion }}</p>
              </div>
              <div v-if="tr.convenio_aprobado == 2">
                <b>Fecha rechazo:</b>
                <p>{{ tr.fecha_aprobacion }}</p>
                <b v-if="tr.comentario_rechazo">Comentario gerencia:</b>
                <p v-if="tr.comentario_rechazo">{{ tr.comentario_rechazo }}</p>
              </div>
            </div>
            <div v-if="tr.estado == 2">
              <b>Cerrado por:</b>
              <p>{{ tr.usuario_cierre}}</p>
              <b v-if="tr.fecha_cierre">Fecha cierre:</b>
              <p v-if="tr.fecha_cierre">{{ tr.fecha_cierre }}</p>
              <b v-if="tr.comentario_cierre">Observación cierre:</b>
              <p v-if="tr.comentario_cierre">{{ tr.comentario_cierre }}</p>
            </div>
            <b>Estado convenio:</b>
            <div>
              <div v-if="tr.estado == 2">
                <vs-chip color="danger" v-if="tr.estado == 2">Cerrado</vs-chip>
              </div>
              <vs-chip color="warning" v-if="tr.estado == 1">En curso</vs-chip>
              <vs-chip color="success" v-if="tr.estado == 0">Finalizado</vs-chip>
            </div>

            <br><br>
            <div v-if="tr.usuario_creador">
              <b>Creado por:</b>
              <p>{{ tr.usuario_creador }}</p>
              <b>Fecha creación:</b>
              <p>{{ tr.created_at }}</p>
            </div>
            <!--AUTORIZACION-->
            <div v-if="tr.estado_solicitud_convenio_cerrado == 1">
              <b class="font-bold text-danger"><i class="fa-solid fa-flag"></i> POR AUTORIZAR GERENCIA POR CONVENIO CERRADO</b>
            </div>
            <div v-if="tr.estado_solicitud_convenio_cerrado == 2">
              <b>Valor global creado por:</b>
              <p> {{tr.valor_global_inicial}}</p>
              <b>Autorizado por:</b>
              <p>Gerencia</p>
              <!-- <b class="font-bold text-success"><i class="fa-solid fa-flag"></i> Convenio que fue cerrado Autorizado por gerencia por ${{tr.cantidad_finalizada}}</b> -->
            </div>
            <!--APROBACION POR FACTURADOR-->
            <div v-if="tr.estado_aprobado_convenio_cerrado == 1" class="mt-2">
              <b class="font-bold text-danger"><i class="fa-solid fa-triangle-exclamation"></i> POR APROBAR POR ADMIN FACTURADOR (Tiene que aprobar para que los facturadores puedan ver el pedido)</b>
              <vs-button @click="convenioSelect=tr;confirmAprobarConvenioCerrado();" v-if="userAdminFacturador || userRoot" color="danger" type="border" class="m-2"><i class="fa-solid fa-radiation"></i> Aprobar Convenio cerrado</vs-button>
            </div>
            <div v-if="tr.estado_aprobado_convenio_cerrado == 2" class="mt-2">
              <b>Aprobador por:</b>
              <p>Facturador Admin</p>
              <!-- <b class="font-bold text-success"><i class="fa-solid fa-flag"></i> Convenio que fue cerrado Aprobado por Facturador Admin</b> -->
            </div>
          </vs-td>
          <vs-td :data="tr.observacion">
            {{ tr.observacion }}
          </vs-td>
          <vs-td :data="tr.anticipo_global">
            <b>Anticipo Global:</b>
            <p>{{ tr.anticipo_global }}</p>
            <b>Total Detalles Pagos:</b>
            <p>{{ parseFloat(tr.total_detalles_pago).toFixed(2) }}</p>
            <div v-if="tr.cantidad_detalles_abiertos > 0" class="mt-2 p-2 bg-blue-50 rounded">
              <b class="text-primary">Detalles abiertos:</b>
              <p>{{ tr.cantidad_detalles_abiertos }} {{ tr.cantidad_detalles_abiertos == 1 ? 'detalle' : 'detalles' }}</p>
            </div>
            <div v-if="tr.estado == 2">
              <b>Valor convenio pagado pagado</b>
              <p>{{ tr.valor_convenio_pagado }}</p>
              <b>Deuda que termina el convenio</b>
              <p v-if="tr.deuda_convenio > 0" class="text-danger font-bold">{{ tr.deuda_convenio }}</p>
              <p v-else>{{ tr.deuda_convenio }}</p>
            </div>
          </vs-td>
          <vs-td :data="tr.convenio_anios">
            <p>Años: {{ tr.convenio_anios }}</p>
          </vs-td>
          <vs-td>
            <div class="flex flex-col gap-2">
              <vs-button  v-if="(tr.estado == 1 && tr.convenio_aprobado == 0 && userAsesor) || (tr.estado == 1 && groupFacturador)" class="w-full m-2 p-2" @click="f_editarConvenio(tr)" color="warning" type="gradient">📝 Editar</vs-button>
              <vs-button v-if="groupFacturador && tr.estado == 1 && tr.estado_solicitud_convenio_cerrado != 1" class="w-full m-2 p-2" @click="id=tr.doc_codigo;convenioSelect=tr;popupConfirmConvenioAprobado=true;" icon-pack="feather" icon="icon-check" color="success" type="gradient">{{ tr.convenio_aprobado == 0 ? 'Aprobar convenio' :'Solicitar mas convenio'}} </vs-button>
              <vs-button v-if="(groupFacturador || userRoot) && tr.estado == 1 && tr.estado_solicitud_convenio_cerrado != 1" class="w-full m-2 p-2" @click="convenioDetallesSelect=tr; popupDetallesConvenio=true;" icon-pack="feather" icon="icon-list" color="primary" type="gradient">Detalles de pago</vs-button>
              <!--BOTÓN GESTIÓN CONVENIO-->
              <vs-button class="w-full m-2 p-2" color="dark" v-if="groupFacturador && sendPedido.contrato_generado != null" @click="convenioGestionSelect=tr; popupGestionConvenio=true;" icon-pack="feather" icon="icon-bar-chart-2" type="gradient">Documentos del Convenio</vs-button>
              <vx-tooltip class="w-full m-2" v-else-if="groupFacturador" style="display: block;" text="Se necesita un contrato para acceder a esta opción" position="top" color="warning">
                <vs-button disabled class="w-full p-2" color="dark" icon-pack="feather" icon="icon-bar-chart-2" type="gradient">Documentos del Convenio</vs-button>
              </vx-tooltip>
              <vs-button class="w-full m-2 p-2" color="danger" v-if="groupFacturador && tr.estado == 1 && tr.estado_solicitud_convenio_cerrado != 1" @click="convenioSelect=tr;popupConfirmCerrarConvenio=true;">
                <i class="fa-regular fa-rectangle-xmark"></i>  <span class="ml-1"> Cerrar contrato</span>
              </vs-button>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--modales-->
    <!-- Modal detalles de pago del convenio -->
    <vs-popup class="informacionformhijo2" classContent="popup-detalles-convenio" fullscreen title="Detalles de pago del convenio" :active.sync="popupDetallesConvenio">
      <div v-show="popupDetallesConvenio && convenioDetallesSelect">
        <b>Contrato: {{ sendPedido.contrato_generado }}</b> <br>
        <b>Institución: {{ sendPedido.nombreInstitucion }}</b>
        <ConvenioDetallesVue
          v-if="convenioDetallesSelect"
          :id_convenio="convenioDetallesSelect.id"
          :anticipo_global="convenioDetallesSelect.anticipo_global"
          :formasPago="arrayFormasPago"
          :groupFacturador="groupFacturador"
          :userRoot="userRoot"
          :contrato_generado="sendPedido.contrato_generado"
          @detalleActualizado="handleDetalleActualizado"
        />
      </div>

    </vs-popup>

    <vs-popup class="informacionformhijo2" classContent="popup-example" title="Aprobar Convenio Global" :active.sync="popupConfirmConvenioAprobado">
      <AprobarAnticipoAprobadoVue v-if="popupConfirmConvenioAprobado" ifconvenio="1" :sendConvenio="convenioSelect" :sendPedido="sendPedido" :usuario="usuario" :userRoot="Boolean(userRoot)" @changeHandle="changeHandle"/>
    </vs-popup>

    <!-- Modal mejorado para cerrar convenio -->
    <vs-popup classContent="popup-cerrar-convenio" title="Cerrar Convenio" :active.sync="popupConfirmCerrarConvenio">
      <div class="modal-body-convenio" v-if="popupConfirmCerrarConvenio">
        <!-- Icono y título de advertencia -->
        <div class="text-center mb-6">
          <div class="warning-icon-container mb-4">
            <i class="fas fa-exclamation-triangle text-orange-500 text-4xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Confirmación de Cierre</h3>
          <p class="text-gray-600 text-sm">Esta acción cerrará permanentemente el convenio</p>
          <!-- Aviso de anulación de documentos -->
          <div class="mt-3 mx-auto max-w-sm flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-left">
            <i class="fas fa-file-times text-orange-500 mt-0.5 flex-shrink-0"></i>
            <p class="text-orange-700 text-xs leading-snug">
              <b>Importante:</b> Al cerrar el convenio, todos los reportes de convenio generados que se encuentren activos (Sin evidencia o Con evidencia) serán <b>anulados automáticamente</b>.
            </p>
          </div>
        </div>

        <!-- Formulario -->
        <div class="form-section">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-comment-alt mr-2 text-gray-500"></i>
              Observación del cierre *
            </label>
            <vs-input
              v-model="comentario_cierre"
              type="textarea"
              placeholder="Escriba el motivo o comentario para el cierre del convenio..."
              class="w-full"
              rows="4"
              :danger="comentarioError !== null"
            />
            <!-- Mensaje de validación -->
            <div v-if="comentarioError" class="validation-error mt-2">
              <i class="fas fa-exclamation-circle mr-1"></i>
              {{ comentarioError }}
            </div>
            <div v-else-if="comentario_cierre && comentario_cierre.trim().length > 0" class="validation-success mt-2">
              <i class="fas fa-check-circle mr-1"></i>
              Comentario válido ({{ comentario_cierre.trim().length }} caracteres)
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <vs-button
            @click="cerrarConvenio()"
            color="danger"
            type="gradient"
            class="confirm-btn"
            size="large"
            :disabled="!isComentarioValid"
          >
            <i class="fas fa-lock mr-2"></i>
            Cerrar Convenio
          </vs-button>
             <vs-button
            @click="popupConfirmCerrarConvenio=false"
            color="rgba(var(--vs-gray-2))"
            type="border"
            class="cancel-btn"
            size="large"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <vs-popup classContent="popup-example" title="Editar convenio" :active.sync="popupEditConvenio">
      <div v-if="popupEditConvenio">
        <div>
          <vs-input
            class="inputx mb-2 w-full"
            label="Convenio Global"
            placeholder="Convenio Global"
            v-model="convenioEdit.anticipo_global"
            @keypress="validarNumeroDecimal($event)"
            :disabled="convenioSelect.convenio_aprobado != 0"
          />
          <div v-if="convenioSelect.convenio_aprobado != 0" class="mb-3 text-warning text-sm flex items-center">
            <i class="fas fa-info-circle mr-2"></i>
            El valor del convenio global fue aprobado. Ingrese desde el botón "{{ convenioSelect.convenio_aprobado == 0 ? 'Aprobar convenio' : 'Solicitar más convenio' }}"
          </div>
          <vs-input
            class="inputx mb-3 w-full"
            type="number"
            label="Convenio años"
            placeholder="Convenio años"
            v-model="convenioEdit.convenio_anios"
            @keypress="validarNumeroEntero($event)"
            @input="limitarAnios($event)"
          />
          <vs-input
            class="inputx mb-3 w-full"
            label="Observación"
            placeholder="Observación"
            v-model="convenioEdit.observacion"
            @keypress="validarObservacion($event)"
          />
        </div>
        <div class="flex justify-center mt-5">
          <vs-button color="primary" class="mr-5" @click="f_postGuardar()" type="filled">✅ Si, deseo guardar</vs-button>
          <vs-button @click="popupEditConvenio = false" color="warning" type="border">⚠️ Cerrar</vs-button>
        </div>
      </div>
    </vs-popup>
    <!--POPUP GESTIÓN CONVENIO-->
    <vs-popup fullscreen title="Reportes Convenio" :active.sync="popupGestionConvenio" class="informacionformhijo2" style="padding: 5px;">
      <ListaGestionConvenioVue v-if="popupGestionConvenio" :pedido="sendPedido" :datosInstitucion="sendPedido" :id_pedido_convenio="convenioGestionSelect ? convenioGestionSelect.id : null" :estado_convenio="convenioGestionSelect ? convenioGestionSelect.estado : null" />
    </vs-popup>
  </div>
</template>
<script>
  import {
    mapState
} from "vuex";
const AprobarAnticipoAprobadoVue = () => import('../../../../../pedidos2/pedidos/anticipos/pagos2/components/AprobarAnticipoAprobado.vue')
const ConvenioDetallesVue        = () => import('./ConvenioDetalles.vue')
const ListaGestionConvenioVue     = () => import('@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/lista_gestionconvenio.vue')
export default {
  components:{
      AprobarAnticipoAprobadoVue,
      ConvenioDetallesVue,
      ListaGestionConvenioVue,
    },
  data(){
    return{
      convenioSelect:'',
      popupConfirmConvenioAprobado:false,
      comentario_cierre:'',
      popupConfirmCerrarConvenio:false,
      popupEditConvenio:false,
      popupDetallesConvenio: false,
      popupGestionConvenio: false,
      convenioDetallesSelect: null,
      convenioGestionSelect: null,
      arrayFormasPago: [],
      convenioEdit:{
        anticipo_global:'',
        convenio_anios:'',
        observacion:''
      }
    }
  },
  props:{
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    idConvenio:{
      type:Number,
      default:0,
    },
    arrayInformation:{
      type:Array,
      default:function(){
        return []
      }
    },
    groupFacturador:{
      type:Boolean,
      default:false
    },
    userRoot:{
      type:Boolean,
      default:false
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  watch:{
    arrayInformation(results){
      this.arrayInformation = results
    },
    popupConfirmCerrarConvenio(newValue) {
      // Limpiar el comentario cuando se cierre el modal
      if (!newValue) {
        this.comentario_cierre = ''
      }
    }
  },
  mounted() {
    this.f_getFormasPago()
  },
  computed:{
    ...mapState(['userAdminFacturador','userAsesor']),
    isComentarioValid() {
      return this.comentario_cierre &&
             this.comentario_cierre.trim().length >= 5
    },
    comentarioError() {
      if (!this.comentario_cierre || this.comentario_cierre.trim() === '') {
        return 'El comentario es obligatorio'
      }
      if (this.comentario_cierre.trim().length < 5) {
        return 'Mínimo 5 caracteres requeridos'
      }
      return null
    }
  },
  methods:{
    f_getFormasPago() {
      let me = this
      me.$http.get(me.$server_url + `convenio?getFormasPago=1`)
        .then(function (res) {
          if (!res.data) return
          me.arrayFormasPago = res.data
        })
        .catch(function (error) {
          console.log('Error al cargar formas de pago:', error)
        })
    },
    f_editarConvenio(tr){
      let me = this;
      me.convenioSelect               = tr;
      me.convenioEdit.anticipo_global = me.convenioSelect.anticipo_global;
      me.convenioEdit.convenio_anios  = me.convenioSelect.convenio_anios;
      me.convenioEdit.observacion     = me.convenioSelect.observacion;
      me.popupEditConvenio            = true;
    },
    // Métodos de validación para keypress
    validarNumeroDecimal(event) {
      // Permite números, punto decimal, y teclas de control
      const char = String.fromCharCode(event.which);
      const regex = /[0-9.]/;
      const value = event.target.value;

      // No permitir múltiples puntos decimales
      if (char === '.' && value.includes('.')) {
        event.preventDefault();
        return;
      }

      // Solo permitir números y punto decimal
      if (!regex.test(char) && !this.isControlKey(event)) {
        event.preventDefault();
      }
    },
    validarNumeroEntero(event) {
      // Solo permite números enteros y teclas de control
      const char = String.fromCharCode(event.which);
      const regex = /[0-9]/;

      if (!regex.test(char) && !this.isControlKey(event)) {
        event.preventDefault();
      }
    },
    validarObservacion(event) {
      // Prevenir solo espacios en blanco al inicio
      const char = String.fromCharCode(event.which);
      const value = event.target.value;

      // Si el campo está vacío y se intenta escribir un espacio, lo previene
      if (value.length === 0 && char === ' ') {
        event.preventDefault();
      }
    },
    limitarAnios(event) {
      // Limitar entre 2 y 15 años
      let value = parseInt(event.target.value);
      if (value > 15) {
        this.convenioEdit.convenio_anios = 15;
      } else if (value < 0) {
        this.convenioEdit.convenio_anios = '';
      }
    },
    isControlKey(event) {
      // Permitir teclas de control como backspace, delete, tab, etc.
      return event.which === 8 || // backspace
             event.which === 9 || // tab
             event.which === 46 || // delete
             (event.which >= 37 && event.which <= 40); // arrow keys
    },
    f_postGuardar(){
      let me = this;
      me.convenioEdit.observacion = (me.convenioEdit.observacion || '').trim();
     // Validación de anticipo global - solo números y decimales
      const anticipoGlobal = parseFloat(me.convenioEdit.anticipo_global);
      if (isNaN(anticipoGlobal) || anticipoGlobal < 0) {
        me.$vs.notify({
          text: 'El anticipo global debe ser un número válido mayor o igual a 0',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      // Validación de convenio años - máximo 15 años, nada de negativos
      const convenioAnios = parseInt(me.convenioEdit.convenio_anios);
      if (isNaN(convenioAnios) || convenioAnios < 2 || convenioAnios > 15) {
        me.$vs.notify({
          text: 'Los años del convenio deben ser un número entre 2 y 15 años',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      let formData = new FormData();
      formData.append('editarConvenio', '1');
      formData.append('user_created', me.usuario.idusuario);
      formData.append('observacion', me.convenioEdit.observacion.trim()); // Quitar espacios
      formData.append('idConvenio', me.convenioSelect.id);
      formData.append('anticipo_global', anticipoGlobal.toString());
      formData.append('convenio_anios', convenioAnios.toString());
      me.$vs.loading()
      this.$http.post(this.$server_url + 'convenio', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.loading.close()
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          time:7000,
          icon:'icon-check'})
          return
        }else{
          me.$vs.loading.close()
          // me.$vs.notify({
          //   text:'Se guardo con éxito',
          //   color:'success',
          //   iconPack: 'feather',
          //   icon:'icon-check'})
            me.popupEditConvenio = false;
            // next tick hasta cerrar el modal
            this.$nextTick(() => {
              me.$emit('changeRecharge',3)
            })
        }
      })
    },
    changeHandle(e){
      let me = this
      if(e == 0) { me.popupConfirmConvenioAprobado = false; }
      if(e == 1) { me.popupConfirmConvenioAprobado = false;  me.$emit('changeRecharge',1) }
    },
    cerrarConvenio(){
      let me = this

      // Validación del comentario de cierre
      if (!me.comentario_cierre || me.comentario_cierre.trim() === '') {
        me.$vs.notify({
          text: 'Debe escribir un comentario para el cierre del convenio',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      if (me.comentario_cierre.trim().length < 5) {
        me.$vs.notify({
          text: 'El comentario debe tener al menos 5 caracteres',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      let formData = new FormData();
      formData.append('cerrarConvenio',   '1')
      formData.append('idConvenio',        me.convenioSelect.id);
      formData.append('user_created',      me.usuario.idusuario);
      formData.append('contrato',          me.sendPedido.contrato_generado)
      formData.append('id_pedido',         me.sendPedido.id_pedido)
      formData.append('comentario_cierre', me.comentario_cierre.trim())
      me.$vs.loading()
      this.$http.post(this.$server_url+'convenio', formData)
      .then(res => {
      me.$vs.loading.close()
      if(res.data.status == 0){
        me.$vs.notify({
        text:res.data.message,
        color:'danger',
        iconPack: 'feather',
        time:4000,
        icon:'icon-check'})
        return
      }
      me.$vs.notify({
        text:res.data.message,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})

        // Limpiar el comentario y cerrar el modal después del éxito
        me.comentario_cierre = ''
        me.popupConfirmCerrarConvenio = false
      })
      me.$emit('changeRecharge',4)
    },
    confirmAprobarConvenioCerrado(){
      let me = this
      me.$vs.dialog({
        type: 'confirm',
        color: 'success',
        title: 'Aprobar convenio cerrado',
        text: '¿Está seguro que desea aprobar el convenio cerrado?',
        acceptText: 'Aceptar',
        cancelText:'Cancelar',
        accept: me.aprobarConvenioCerrado,
        cancel: false
      })
    },
    aprobarConvenioCerrado(){
      let me = this
      let formData = new FormData();
      formData.append('aprobarConvenioCerrado',   '1')
      formData.append('idConvenio',               me.convenioSelect.id);
      formData.append('user_created',             me.usuario.idusuario);
      formData.append('contrato',                 me.sendPedido.contrato_generado)
      formData.append('id_pedido',                me.sendPedido.id_pedido)
      me.$vs.loading()
      this.$http.post(this.$server_url+'convenio', formData)
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
      me.$emit('changeRecharge',4)
    },
    handleDetalleActualizado() {
      // Propagar evento hacia el padre para recargar el listado
      this.$emit('changeRecharge', 3)
    }
    //fin metodos para cerrar convenio
  }
}
</script>

<style scoped>
/* Estilos para el modal de cerrar convenio */
::v-deep .popup-cerrar-convenio {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 100% !important;
  min-width: 500px;
}

::v-deep .popup-cerrar-convenio .vs-popup {
  width: 100% !important;
}

::v-deep .popup-cerrar-convenio .vs-popup__content {
  width: 100% !important;
  max-width: 600px !important;
}

.modal-body-convenio {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.warning-icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(251, 146, 60, 0.3);
}

.form-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.form-section label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

::v-deep .form-section .vs-input {
  width: 100% !important;
}

::v-deep .form-section .vs-input__input {
  border-radius: 6px;
  border: 2px solid #e5e7eb;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;
}

::v-deep .form-section .vs-input__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  min-width: 140px;
  height: 44px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .cancel-btn {
  background: white;
  border: 2px solid #d1d5db;
  color: #6b7280;
}

::v-deep .cancel-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

::v-deep .confirm-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

::v-deep .confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
}

::v-deep .confirm-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Animaciones */
.modal-body-convenio {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.warning-icon-container {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Estilos para validación */
.validation-error {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.validation-success {
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

::v-deep .vs-input--danger .vs-input__input {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

/* Responsive */
@media (max-width: 640px) {
  ::v-deep .popup-cerrar-convenio {
    min-width: auto;
    width: 95vw !important;
    max-width: 95vw !important;
  }

  .modal-body-convenio {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .cancel-btn, .confirm-btn {
    width: 100%;
  }
}

.informacionformhijo2 {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
