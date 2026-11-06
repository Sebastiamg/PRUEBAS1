<template>
  <div>
    <vs-alert class="mt-2">
      <p>Registre los detalles de pago asociados a este convenio. Cada detalle incluye un valor y una descripción.</p>
    </vs-alert>

    <!-- Resumen de Totales Simple -->
    <div class="resumen-totales mt-3">
      <div class="total-item">
        <span class="total-label">Anticipo Global:</span>
        <span class="total-valor">${{ anticipo_global|filtrarDecimal2 }}</span>
      </div>
      <div class="total-item total-cerrados">
        <span class="total-label">Pagos Cerrados:</span>
        <span class="total-valor">${{ totalCerrados|filtrarDecimal2 }}</span>
      </div>
      <div class="total-item total-abiertos" v-if="totalAbiertos > 0">
        <span class="total-label">Pagos Abiertos:</span>
        <span class="total-valor">${{ totalAbiertos|filtrarDecimal2 }}</span>
      </div>
    </div>

    <!-- Alerta si excede el anticipo -->
    <vs-alert v-if="totalCerrados > anticipo_global" color="danger" class="mt-3">
      <template #icon>
        <i class="fas fa-exclamation-triangle"></i>
      </template>
      <b>¡Atención!</b> El total de detalles cerrados (${{ totalCerrados|filtrarDecimal2 }}) supera el anticipo global del convenio (${{ anticipo_global|filtrarDecimal2 }}) por <b>${{ (totalCerrados - anticipo_global)|filtrarDecimal2 }}</b>
    </vs-alert>
    <!-- Radio buttons para filtrar activos/eliminados -->
    <div class="flex items-center gap-4 mt-4 mb-2" v-if="userRoot">
      <vs-radio v-model="estadoDetalles" vs-name="estadoDetalles" :vs-value="1" @input="f_getDetalles()">Activos</vs-radio>
      <vs-radio v-model="estadoDetalles" vs-name="estadoDetalles" :vs-value="0" @input="f_getDetalles()">Inactivos</vs-radio>
    </div>

    <div class="mt-5" v-if="groupFacturador || userRoot">
      <vs-button icon="add" class="mb-2 p-3" v-if="estadoDetalles == 1" @click="f_limpiar(); title='Agregar detalle'; popupAdd=true;">Crear</vs-button>
    </div>

    <vs-table max-items="5" stripe search pagination :data="arrayDetalles">
      <template slot="header">
        <vs-chip color="primary">Cantidad: <b> {{ arrayDetalles.length }}</b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th>Valor</vs-th>
        <vs-th>Descripción</vs-th>
        <vs-th v-if="groupFacturador || userRoot">Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            <!-- Total destacado -->
            <div class="mb-2">
              <b>Total:</b> <span class="text-primary" style="font-size: 18px; font-weight: 700;">${{ Number(tr.total).toFixed(2) }}</span>
            </div>

            <!-- Desglose -->
            <p><b>Subtotal:</b> ${{ Number(tr.subtotal).toFixed(2) }}</p>
            <p><b>IVA:</b> ${{ Number(tr.iva_valor).toFixed(2) }}</p>
            <p><b>Retención:</b> ${{ Number(tr.retencion).toFixed(2) }}</p>

            <vs-divider class="my-2"></vs-divider>

            <div v-if="tr.documento_dni" class="mt-2">
              <b>RUC:</b>
              <p>{{ tr.documento_dni }}</p>
            </div>
            <div v-if="tr.razon_social" class="mt-2">
              <b>Razón Social:</b>
              <p>{{ tr.razon_social }}</p>
            </div>
            <div v-if="tr.forma_pago_nombre" class="mt-2">
              <b>Forma de Pago:</b>
              <p>{{ tr.forma_pago_nombre }}</p>
            </div>
            <div v-if="tr.num_factura" class="mt-2">
              <b>Número de Factura:</b>
              <p>{{ tr.num_factura }}</p>
            </div>
            <div v-if="tr.fecha_emision_factura" class="mt-2">
              <b>Fecha Emisión Factura:</b>
              <p>{{ tr.fecha_emision_factura }}</p>
            </div>
            <div v-if="tr.fecha_pago_factura" class="mt-2">
              <b>Fecha Pago Factura:</b>
              <p>{{ tr.fecha_pago_factura }}</p>
            </div>
            <div v-if="tr.fecha_proximo_pago" class="mt-2">
              <b>Fecha Próximo Pago:</b>
              <p>{{ tr.fecha_proximo_pago }}</p>
            </div>
            <b>Fecha creación:</b>
            <p>{{ tr.created_at }}</p>
            <b>Creador:</b>
            <p>{{ tr.usuario_creador }}</p>
            <div v-if="tr.usuario_editor" class="mt-2">
              <b>Último Editor:</b>
              <p>{{ tr.usuario_editor }}</p>
            </div>
            <div v-if="tr.estado == 1 && tr.usuario_cierre_nombre" class="mt-3 p-2 bg-green-50 rounded border-l-4 border-green-500">
              <b class="text-success">Cerrado por:</b>
              <p>{{ tr.usuario_cierre_nombre }}</p>
              <b v-if="tr.fecha_proceso">Fecha:</b>
              <p v-if="tr.fecha_proceso">{{ tr.fecha_proceso }}</p>
            </div>
            <div v-if="tr.estado == 2 && tr.usuario_abre_nombre" class="mt-3 p-2 bg-red-50 rounded border-l-4 border-red-500">
              <b class="text-danger">Reabierto por:</b>
              <p>{{ tr.usuario_abre_nombre }}</p>
              <b v-if="tr.fecha_proceso">Fecha:</b>
              <p v-if="tr.fecha_proceso">{{ tr.fecha_proceso }}</p>
            </div>
            <div class="mt-3">
              <b>Estado:</b> <br>
              <vs-chip :color="tr.estado == 1 ? 'success' : 'danger'" class="ml-2">
                {{ tr.estado == 1 ? 'Cerrado' : 'Abierto' }}
              </vs-chip>
            </div>
          </vs-td>
          <vs-td>
            {{ data[indextr].descripcion }}
          </vs-td>
          <vs-td align="center" v-if="groupFacturador || userRoot">
            <!-- Solo mostrar botones de acción si son detalles activos -->
            <vs-dropdown vs-custom-content vs-trigger-click v-if="estadoDetalles == 1">
              <button
                class="menu-trigger-btn"
                :class="{ active: selectedRow && selectedRow.id_pedido_pago_detalle === tr.id_pedido_pago_detalle }"
                title="Acciones"
              >⋮</button>

              <vs-dropdown-menu style="width: 280px; z-index: 53002;" class="dropdown-convenio-detalle">
                <div class="dropdown-header">
                  <span class="dropdown-titulo">Acciones</span>
                  <span class="dropdown-codigo">Detalle #{{ tr.id_pedido_pago_detalle }}</span>
                </div>

                <vs-dropdown-item v-if="tr.estado == 2">
                  <button class="dropdown-item dropdown-item--cerrar" @click="detalleSelected=tr; confirmCerrarDetalle(tr)">
                    <span class="dropdown-item-icono"><i class="feather icon-check"></i></span>
                    <span class="dropdown-item-texto">
                      <strong>Cerrar Detalle</strong>
                      <small>Marcar como cerrado</small>
                    </span>
                  </button>
                </vs-dropdown-item>

                <vs-dropdown-item v-if="tr.estado == 2">
                  <button class="dropdown-item dropdown-item--editar" @click="detalleSelected=tr; f_preEditar()">
                    <span class="dropdown-item-icono"><i class="feather icon-edit"></i></span>
                    <span class="dropdown-item-texto">
                      <strong>Editar</strong>
                      <small>Modificar detalle</small>
                    </span>
                  </button>
                </vs-dropdown-item>

                <vs-dropdown-item v-if="tr.estado == 2">
                  <button class="dropdown-item dropdown-item--eliminar" @click="detalleSelected=tr; popupConfirmDelete=true">
                    <span class="dropdown-item-icono"><i class="feather icon-x-square"></i></span>
                    <span class="dropdown-item-texto">
                      <strong>Eliminar</strong>
                      <small>Eliminar detalle</small>
                    </span>
                  </button>
                </vs-dropdown-item>

                <vs-dropdown-item v-if="tr.estado == 1">
                  <button class="dropdown-item dropdown-item--reabrir" @click="detalleSelected=tr; confirmReabrirDetalle(tr)">
                    <span class="dropdown-item-icono"><i class="feather icon-settings"></i></span>
                    <span class="dropdown-item-texto">
                      <strong>Reabrir Detalle</strong>
                      <small>Volver a estado abierto</small>
                    </span>
                  </button>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>

            <!-- Mensaje informativo para detalles eliminados -->
            <div v-if="estadoDetalles == 0" class="text-center">
              <div v-if="tr.fecha_eliminar" class="mt-2">
                <b class="text-danger text-sm">Fecha eliminación:</b>
                <p class="text-sm">{{ tr.fecha_eliminar }}</p>
              </div>
              <div v-if="tr.user_eliminar_nombre" class="mt-2">
                <b class="text-danger text-sm">Eliminado por:</b>
                <p class="text-sm">{{ tr.user_eliminar_nombre }}</p>
              </div>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <!-- Modal crear/editar -->
    <vs-popup classContent="popup-example" fullscreen :title="title+' '+contrato_generado" :active.sync="popupAdd" class="informacionformhijo3">
      <div v-if="popupAdd">
        <div class="flex flex-wrap -mx-2">
          <!-- Tipo de identificación -->
          <div class="w-full px-2 mb-3" v-if="!editar">
            <ul class="flex" style="flex-wrap: wrap;">
              <li class="mr-5">Identificación:</li>
              <li class="mr-3">
                <vs-radio v-model="datos.tipo_identificacion" @input="f_limpiarUsuario" vs-name="radios1" vs-value="RUC">RUC</vs-radio>
              </li>
            </ul>
            <div class="mt-3">
              <busquedaRucVue @f_changeUsuario="f_changeUsuario" @f_limpiarUsuario="f_limpiarUsuario" @f_setearNuevoUser="f_setearNuevoUser"/>
            </div>
          </div>

          <!-- Documento (RUC) -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>RUC:</small>
            <vs-input v-model="datos.documento_dni" class="w-full"></vs-input>
          </div>

          <!-- Razón Social -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Razón Social:</small>
            <vs-input v-model="datos.razon_social" class="w-full"></vs-input>
          </div>

          <!-- Forma de Pago -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Forma de Pago: <span class="text-danger">*</span></small>
            <v-select
              :options="arrayFormasPago"
              :reduce="fp => fp"
              label="tip_pag_nombre"
              placeholder="--Seleccione--"
              class="w-full"
              v-model="datos.forma_pago"
            />
          </div>

          <!-- Subtotal -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Subtotal: <span class="text-danger">*</span></small>
            <vs-input v-model="datos.subtotal" @input="calcularTotal" class="w-full"></vs-input>
          </div>

          <!-- IVA -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>IVA (Ejemplo $150.00):</small>
            <vs-input v-model="datos.iva_valor" @input="calcularTotal" class="w-full"></vs-input>
          </div>

          <!-- Retención -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Retención:</small>
            <vs-input v-model="datos.retencion" @input="calcularTotal" class="w-full"></vs-input>
          </div>

          <!-- Total (calculado) -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Total: <span class="text-danger">*</span></small>
            <vs-input v-model="datos.total" class="w-full"></vs-input>
          </div>

          <!-- Número de Factura -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Número de Factura:</small>
            <vs-input
              v-model="datos.num_factura"
              maxlength="9"
              @keypress="validarSoloNumeros"
              @input="validarNumFactura"
              class="w-full"
            ></vs-input>
          </div>

          <!-- Fecha Emisión Factura -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Fecha Emisión Factura:</small>
            <vs-input type="date" v-model="datos.fecha_emision_factura" class="w-full"></vs-input>
          </div>

          <!-- Fecha Pago Factura -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Fecha Pago Factura:</small>
            <vs-input type="date" v-model="datos.fecha_pago_factura" class="w-full"></vs-input>
          </div>

          <!-- Fecha Próximo Pago -->
          <div class="w-full md:w-1/2 px-2 mt-3">
            <small>Fecha Próximo Pago:</small>
            <vs-input type="date" v-model="datos.fecha_proximo_pago" class="w-full"></vs-input>
          </div>

          <!-- Descripción -->
          <div class="w-full px-2 mt-3">
            <small>Observación:</small>
            <vs-textarea counter="500" :counter-danger.sync="counterDanger" height="200px" label="Observación" v-model="datos.descripcion" />
          </div>
        </div>
        <div class="flex justify-center mt-5">
          <vs-button @click="f_guardarDetalle()" class="m-2" icon="check">Guardar</vs-button>
          <vs-button @click="popupAdd=false" type="border" color="warning" class="m-2" icon="close">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- Modal confirmar eliminar -->
    <vs-popup classContent="popup-example" title="Eliminar" :active.sync="popupConfirmDelete" class="informacionformhijo3">
      <div v-if="popupConfirmDelete">
        <p class="text-center font-bold text-2xl">¿Estás seguro de eliminar?</p>
        <div class="flex justify-center mt-5">
          <vs-button @click="f_eliminarDetalle()" class="m-2" icon="check">Sí, deseo eliminar</vs-button>
          <vs-button @click="popupConfirmDelete=false" type="border" color="warning" class="m-2" icon="close">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import vSelect from 'vue-select'

const busquedaRucVue    = () => import('../../../../../pedidos/busquedaRuc.vue')

export default {
  name: 'ConvenioDetalles',
  components: {
    'v-select': vSelect,
    busquedaRucVue,
  },
  data() {
    return {
      usuario: [],
      arrayDetalles: [],
      arrayFormasPago: [],
      popupAdd: false,
      popupConfirmDelete: false,
      id: 0,
      datos: {
        tipo_identificacion: 'RUC',
        documento_dni: '',
        razon_social: '',
        forma_pago: null,
        subtotal: 0,
        iva_valor: 0,
        retencion: 0,
        total: 0,
        descripcion: '',
        estado: 2, // Por defecto abierto (2)
        num_factura: '',
        fecha_emision_factura: null,
        fecha_pago_factura: null,
        fecha_proximo_pago: null,
      },
      detalleSelected: '',
      title: 'Agregar detalle',
      counterDanger: false,
      ifCrearBeneficiario: false,
      estadoDetalles: 1, // 1 = Activos (estado 1 y 2), 0 = Eliminados (estado 0)
    }
  },
  props: {
    id_convenio: {
      type: Number,
      default: 0
    },
    groupFacturador: {
      type: Boolean,
      default: false
    },
    userRoot: {
      type: Boolean,
      default: false
    },
    anticipo_global: {
      type: Number,
      default: 0
    },
    formasPago: {
      type: Array,
      default: function() {
        return []
      }
    },
    contrato_generado:{
      type:String,
      default:''
    }
  },
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
    // Solo cargar formas de pago si no vienen por prop
    if (this.formasPago && this.formasPago.length > 0) {
      this.arrayFormasPago = this.formasPago
    } else {
      this.f_getFormasPago()
    }
  },
  watch: {
    id_convenio: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal > 0) {
          this.f_getDetalles()
        }
      }
    }
  },
  computed: {
    totalValor() {
      return this.arrayDetalles.reduce((sum, item) => sum + Number(item.total), 0)
    },
    totalCerrados() {
      return this.arrayDetalles
        .filter(item => item.estado == 1)
        .reduce((sum, item) => sum + Number(item.total), 0)
    },
    totalAbiertos() {
      return this.arrayDetalles
        .filter(item => item.estado == 2)
        .reduce((sum, item) => sum + Number(item.total), 0)
    },
  },
  methods: {
    validarSoloNumeros(event) {
      // Solo permite números del 0 al 9, bloquea todo lo demás
      const charCode = event.which ? event.which : event.keyCode
      if (charCode < 48 || charCode > 57) {
        event.preventDefault()
        return false
      }
      return true
    },
    validarNumFactura() {
      // Solo permitir números enteros del 0-9
      if (this.datos.num_factura) {
        this.datos.num_factura = this.datos.num_factura.replace(/[^0-9]/g, '')
      }
    },
    limpiarValorNumerico(valor) {
      // Elimina todo lo que no sea número o punto decimal
      let limpio = String(valor).replace(/[^0-9.]/g, '')
      // Evita múltiples puntos
      const partes = limpio.split('.')
      if (partes.length > 2) {
        limpio = partes[0] + '.' + partes.slice(1).join('')
      }
      // Limitar a máximo 6 dígitos antes del punto decimal
      if (limpio.includes('.')) {
        const [entero, decimal] = limpio.split('.')
        if (entero.length > 6) {
          limpio = entero.substring(0, 6) + '.' + decimal
        }
      } else {
        if (limpio.length > 6) {
          limpio = limpio.substring(0, 6)
        }
      }
      // Permitir campo vacío, no forzar a '0'
      return limpio
    },
    calcularTotal() {
      // Limpiar valores numéricos
      this.datos.subtotal = this.limpiarValorNumerico(this.datos.subtotal)
      this.datos.iva_valor = this.limpiarValorNumerico(this.datos.iva_valor)
      this.datos.retencion = this.limpiarValorNumerico(this.datos.retencion)

      // Calcular total: subtotal + iva - retención
      const subtotal = parseFloat(this.datos.subtotal) || 0
      const iva = parseFloat(this.datos.iva_valor) || 0
      const retencion = parseFloat(this.datos.retencion) || 0
      this.datos.total = (subtotal + iva + retencion).toFixed(2)
    },
    f_changeUsuario(e) {
      let me = this
      let dataUser = e.user
      if (dataUser) {
        me.ifCrearBeneficiario = false
        me.datos.documento_dni = dataUser.cedula
        me.datos.razon_social = `${dataUser.nombres} ${dataUser.apellidos}`
      } else {
        me.ifCrearBeneficiario = true
      }
    },
    f_limpiarUsuario() {
      let me = this
      me.ifCrearBeneficiario = false
      me.datos.documento_dni = ''
      me.datos.razon_social = ''
    },
    f_setearNuevoUser(e) {
      let me = this
      me.ifCrearBeneficiario = false
      me.datos.documento_dni = e.documento
      me.datos.razon_social = `${e.nombres} ${e.apellidos}`
    },
    f_getDetalles() {
      let me = this
      me.arrayDetalles = []
      // Filtrar por estado según el radio seleccionado
      // estadoDetalles = 1 -> traer estado 1 y 2 (activos)
      // estadoDetalles = 0 -> traer estado 0 (eliminados)
      const estadoParam = me.estadoDetalles == 1 ? 'activos' : 'eliminados'
      me.$http.get(me.$server_url + `convenio?getDetallesConvenio=1&id_convenio=${me.id_convenio}&estadoDetalles=${estadoParam}`)
        .then(function (res) {
          if (!res.data || res.data.status == 0) return
          me.arrayDetalles = res.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    f_getFormasPago() {
      let me = this
      me.$http.get(me.$server_url + `convenio?getFormasPago=1`)
        .then(function (res) {
          if (!res.data) return
          me.arrayFormasPago = res.data
          console.log('Formas de pago cargadas:', me.arrayFormasPago)
        })
        .catch(function (error) {
          console.log('Error al cargar formas de pago:', error)
        })
    },
    f_preEditar() {
      let me = this
      me.id                       = me.detalleSelected.id_pedido_pago_detalle
      me.datos.tipo_identificacion = 'RUC'
      me.datos.documento_dni      = me.detalleSelected.documento_dni
      me.datos.razon_social       = me.detalleSelected.razon_social
      me.datos.subtotal           = me.detalleSelected.subtotal
      me.datos.iva_valor          = me.detalleSelected.iva_valor
      me.datos.retencion          = me.detalleSelected.retencion
      me.datos.total              = me.detalleSelected.total
      me.datos.descripcion        = me.detalleSelected.descripcion
      me.datos.estado             = me.detalleSelected.estado
      me.datos.forma_pago         = me.arrayFormasPago.find(fp => fp.tip_pag_codigo == me.detalleSelected.forma_pago_id) || null
      me.datos.num_factura        = me.detalleSelected.num_factura
      me.datos.fecha_emision_factura = me.detalleSelected.fecha_emision_factura ? me.detalleSelected.fecha_emision_factura.split(' ')[0] : null
      me.datos.fecha_pago_factura = me.detalleSelected.fecha_pago_factura ? me.detalleSelected.fecha_pago_factura.split(' ')[0] : null
      me.datos.fecha_proximo_pago = me.detalleSelected.fecha_proximo_pago ? me.detalleSelected.fecha_proximo_pago.split(' ')[0] : null
      me.title                    = 'Editar detalle'
      me.popupAdd                 = true
    },
    f_guardarDetalle() {
      let me = this
      if (!me.datos.forma_pago) {
        me.$vs.notify({ text: 'Debe seleccionar una forma de pago', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return
      }
      if (Number(me.datos.subtotal) <= 0) {
        me.$vs.notify({ text: 'El subtotal debe ser mayor a 0', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return
      }
      if (Number(me.datos.total) <= 0) {
        me.$vs.notify({ text: 'El total debe ser mayor a 0', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return
      }
      // Validación de fechas
      if (me.datos.fecha_emision_factura && me.datos.fecha_pago_factura) {
        const fechaEmision = new Date(me.datos.fecha_emision_factura)
        const fechaPago = new Date(me.datos.fecha_pago_factura)
        if (fechaEmision > fechaPago) {
          me.$vs.notify({ text: 'La fecha de emisión de factura no puede ser mayor a la fecha de pago', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
      }
      me.datos.descripcion = (me.datos.descripcion || '').trim()
      if (me.datos.descripcion.length > 500) {
        me.$vs.notify({ text: 'La descripción no puede tener más de 500 caracteres', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return
      }
      let formData = new FormData()
      formData.append('saveDetallePago', 1)
      formData.append('id',                  me.id)
      formData.append('id_usuario',          me.usuario.idusuario)
      formData.append('id_convenio',         me.id_convenio)
      formData.append('tipo_identificacion', me.datos.tipo_identificacion)
      formData.append('documento_dni',       me.datos.documento_dni || '')
      formData.append('razon_social',        me.datos.razon_social)
      formData.append('subtotal',            me.datos.subtotal)
      formData.append('iva_valor',           me.datos.iva_valor)
      formData.append('retencion',           me.datos.retencion || 0)
      formData.append('total',               me.datos.total)
      formData.append('descripcion',         me.datos.descripcion)
      formData.append('estado',              me.datos.estado)
      formData.append('forma_pago_id',       me.datos.forma_pago.tip_pag_codigo)
      formData.append('num_factura',         me.datos.num_factura || '')
      formData.append('fecha_emision_factura', me.datos.fecha_emision_factura || '')
      formData.append('fecha_pago_factura',  me.datos.fecha_pago_factura || '')
      formData.append('fecha_proximo_pago',  me.datos.fecha_proximo_pago || '')
      me.$http.post(me.$server_url + `pedigo_Pagos`, formData)
        .then(function (res) {
          if (res.data.status == 0) {
            me.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          me.popupAdd = false
          me.f_getDetalles()
          me.$vs.notify({ text: me.id > 0 ? 'Detalle actualizado con éxito' : 'Detalle creado con éxito', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          me.f_limpiar()
          // Emitir evento para refrescar datos del convenio en el padre
          me.$emit('detalleActualizado')
        })
        .catch(function (error) {
          me.popupAdd = false
          me.$vs.notify({ text: 'Error al guardar el detalle', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          console.log(error)
        })
    },
    f_eliminarDetalle() {
      let me = this
      let formData = new FormData()
      formData.append('eliminarDetallePago', 1)
      formData.append('id', me.detalleSelected.id_pedido_pago_detalle)
      formData.append('id_usuario', me.usuario.idusuario)
      me.$http.post(me.$server_url + `pedigo_Pagos`, formData)
        .then(function (res) {
          if (res.data.status == 0) {
            me.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
            return
          }
          me.popupConfirmDelete = false
          me.f_getDetalles()
          me.$vs.notify({ text: 'Detalle eliminado con éxito', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          // Emitir evento para refrescar datos del convenio en el padre
          me.$emit('detalleActualizado')
        })
        .catch(function (error) {
          me.popupConfirmDelete = false
          me.$vs.notify({ text: 'Error al eliminar el detalle', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          console.log(error)
        })
    },
    f_limpiar() {
      this.id = 0
      this.datos.tipo_identificacion = 'RUC'
      this.datos.documento_dni = ''
      this.datos.razon_social = ''
      this.datos.subtotal = 0
      this.datos.iva_valor = 0
      this.datos.retencion = 0
      this.datos.total = 0
      this.datos.descripcion = ''
      this.datos.estado = 2 // Reset a abierto (2)
      this.datos.forma_pago = null
      this.datos.num_factura = ''
      this.datos.fecha_emision_factura = null
      this.datos.fecha_pago_factura = null
      this.datos.fecha_proximo_pago = null
      this.ifCrearBeneficiario = false
    },
    // ── Cerrar/Reabrir Detalle ──────────────────────────────────────
    confirmCerrarDetalle(tr) {
      let me = this
      this.$vs.dialog({
        type: 'confirm',
        color: 'success',
        title: `Confirmar`,
        acceptText: 'Sí, deseo cerrar el detalle',
        cancelText: 'Cancelar',
        text: '¿Estás seguro de cerrar este detalle de pago?',
        accept: this.cerrarDetalle
      })
    },
    cerrarDetalle() {
      let me = this
      let formData = new FormData()
      formData.append('cerrarDetallePago', 1)
      formData.append('id', me.detalleSelected.id_pedido_pago_detalle)
      formData.append('id_usuario', me.usuario.idusuario)
      me.$vs.loading()
      me.$http.post(me.$server_url + `pedigo_Pagos`, formData)
        .then(function (res) {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle', time: 5000 })
            return
          }
          me.$vs.notify({ text: 'Detalle cerrado correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          me.f_getDetalles()
          // Emitir evento para refrescar datos del convenio en el padre
          me.$emit('detalleActualizado')
        })
        .catch(function () { me.$vs.loading.close() })
    },
    confirmReabrirDetalle(tr) {
      let me = this
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: `Confirmar`,
        acceptText: 'Sí, deseo reabrir el detalle',
        cancelText: 'Cancelar',
        text: '¿Estás seguro de reabrir este detalle de pago?',
        accept: this.reabrirDetalle
      })
    },
    reabrirDetalle() {
      let me = this
      let formData = new FormData()
      formData.append('reabrirDetallePago', 1)
      formData.append('id', me.detalleSelected.id_pedido_pago_detalle)
      formData.append('id_usuario', me.usuario.idusuario)
      me.$vs.loading()
      me.$http.post(me.$server_url + `pedigo_Pagos`, formData)
        .then(function (res) {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle', time: 5000 })
            return
          }
          me.$vs.notify({ text: 'Detalle reabierto correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          me.f_getDetalles()
          // Emitir evento para refrescar datos del convenio en el padre
          me.$emit('detalleActualizado')
        })
        .catch(function () { me.$vs.loading.close() })
    },
  },
}
</script>

<style scoped>
.informacionformhijo3 {
  z-index: 51003;
}

/* ═══════════════════════════════════════════════════
   RESUMEN DE TOTALES SIMPLE
═══════════════════════════════════════════════════ */
.resumen-totales {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 12px 16px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.total-item + .total-item {
  border-top: 1px solid #e9ecef;
  margin-top: 6px;
  padding-top: 6px;
}

.total-label {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.total-valor {
  font-size: 16px;
  font-weight: 700;
  color: #212529;
}

.total-cerrados .total-valor {
  color: #28a745;
}

.total-abiertos .total-valor {
  color: #dc3545;
}

/* ═══════════════════════════════════════════════════
   BOTÓN DISPARADOR  ⋮
═══════════════════════════════════════════════════ */
.menu-trigger-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #dde1e7;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  line-height: 1;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  user-select: none;
  flex-shrink: 0;
}
.menu-trigger-btn:hover,
.menu-trigger-btn.active {
  border-color: #6c63ff;
  background: #f3f1ff;
  box-shadow: 0 2px 10px rgba(108, 99, 255, 0.2);
  color: #6c63ff;
}

/* ═══════════════════════════════════════════════════
   DROPDOWN MENU STYLES
═══════════════════════════════════════════════════ */
::v-deep .dropdown-convenio-detalle {
  z-index: 53002 !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10) !important;
  border: 1px solid rgba(0,0,0,0.07) !important;
  padding: 0 !important;
}

.dropdown-header {
  display: flex;
  flex-direction: column;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-titulo {
  font-weight: 700;
  font-size: 12px;
  color: #1a1a2e;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.dropdown-codigo {
  font-size: 10px;
  color: #888;
  font-family: monospace;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

::v-deep .dropdown-convenio-detalle .vs-dropdown--item {
  padding: 4px 8px !important;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  text-align: left;
  transition: background 0.15s, transform 0.1s;
}
.dropdown-item:hover { transform: translateX(2px); }
.dropdown-item:active { transform: scale(0.98); }

.dropdown-item-icono {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.dropdown-item-texto {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.dropdown-item-texto strong { font-size: 13px; font-weight: 600; line-height: 1.2; }
.dropdown-item-texto small { font-size: 10.5px; opacity: 0.7; }

/* Cerrar — verde */
.dropdown-item--cerrar:hover { background: #e8f8f0; }
.dropdown-item--cerrar .dropdown-item-icono { background: #e0f5ea; color: #1a8a50; }
.dropdown-item--cerrar .dropdown-item-texto strong { color: #1a7a45; }
.dropdown-item--cerrar .dropdown-item-texto small { color: #2ecc71; }

/* Editar — naranja */
.dropdown-item--editar:hover { background: #fff3e0; }
.dropdown-item--editar .dropdown-item-icono { background: #ffecd0; color: #d35400; }
.dropdown-item--editar .dropdown-item-texto strong { color: #c0490a; }
.dropdown-item--editar .dropdown-item-texto small { color: #e67e22; }

/* Eliminar — rojo */
.dropdown-item--eliminar:hover { background: #fdecea; }
.dropdown-item--eliminar .dropdown-item-icono { background: #fde8e6; color: #c0392b; }
.dropdown-item--eliminar .dropdown-item-texto strong { color: #b03025; }
.dropdown-item--eliminar .dropdown-item-texto small { color: #e74c3c; }

/* Reabrir — azul */
.dropdown-item--reabrir:hover { background: #eff6ff; }
.dropdown-item--reabrir .dropdown-item-icono { background: #dbeafe; color: #0055cc; }
.dropdown-item--reabrir .dropdown-item-texto strong { color: #0055cc; }
.dropdown-item--reabrir .dropdown-item-texto small { color: #3b82f6; }
</style>
