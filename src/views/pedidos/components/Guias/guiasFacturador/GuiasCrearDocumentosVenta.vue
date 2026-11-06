<template>
  <div class="documento-venta-container">
    <!-- Información del pedido -->
    <div class="info-pedido-card" v-if="ObjectSelected">
      <div class="info-header">
        <i class="fa-solid fa-file-invoice"></i>
        <h3>Información del Pedido de Guias</h3>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">Pedido#:</span>
          <span class="info-value">{{ ObjectSelected.id_pedido }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Período:</span>
          <span class="info-value">{{ ObjectSelected.periodo }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Asesor:</span>
          <span class="info-value">{{ ObjectSelected.responsable }}</span>
        </div>
      </div>
    </div>

    <!-- Tarjetas de información principal -->
    <div class="vx-row mt-4">
      <!-- Card Cliente con Búsqueda Integrada -->
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
        <div class="info-card">
          <div class="card-header cliente-header">
            <i class="fa-solid fa-user-tie"></i>
            <span>Información del Cliente</span>
          </div>
          <div class="card-body">
            <!-- Cliente seleccionado -->
            <div v-if="datosDespachoSelect.nombre" class="cliente-seleccionado">
              <div class="cliente-info">
                <div class="field-icon">
                  <i class="fa-solid fa-user-check"></i>
                </div>
                <div class="field-content">
                  <label class="field-label">Cliente Seleccionado</label>
                  <div class="field-value">
                    <span class="text-success">
                      <i class="fa-solid fa-check-circle"></i> {{ datosDespachoSelect.nombre }}
                    </span>
                    <small class="text-muted d-block">CI/RUC: {{ datosDespachoSelect.cedula }}</small>
                  </div>
                </div>
              </div>
              <vs-button @click="cambiarCliente()" color="primary" type="flat" size="small" style="margin-top: 10px;">
                <i class="fa-solid fa-repeat"></i> Cambiar Cliente
              </vs-button>
            </div>

            <!-- Búsqueda de cliente (cuando no hay seleccionado o está en modo búsqueda) -->
            <div v-if="!datosDespachoSelect.nombre || mostrarBusqueda" class="busqueda-cliente-compacto">
              <label class="search-label-compact">
                <i class="fa-solid fa-user-search"></i>
                Buscar Cliente en PERSEO
              </label>

              <!-- Empresa debe estar seleccionada -->
              <div v-if="!documentoVenta.empresa" class="alert-warning-compact">
                <i class="fa-solid fa-info-circle"></i>
                Primero seleccione una empresa
              </div>

              <template v-else>
                <!-- Opciones de búsqueda -->
                <div class="search-options-compact">
                  <label class="radio-option-compact">
                    <input type="radio" v-model="busqueda.tipoBusqueda" value="identificacion" />
                    <span>CI / RUC</span>
                  </label>
                  <label class="radio-option-compact">
                    <input type="radio" v-model="busqueda.tipoBusqueda" value="contenido" />
                    <span>Nombre / Razón Social</span>
                  </label>
                </div>

                <!-- Campo de búsqueda compacto -->
                <div class="search-input-compact">
                  <vs-input
                    v-model="busqueda.cedula"
                    @keypress.enter="searchClientePerseo()"
                    @input="busqueda.tipoBusqueda === 'identificacion' ? validateNumber() : null"
                    class="w-full"
                    :placeholder="busqueda.tipoBusqueda === 'identificacion'
                      ? 'Ingrese CI (10 dígitos) o RUC (13 dígitos)'
                      : 'Ingrese nombre (mínimo 3 caracteres)'"
                  >
                    <template #icon>
                      <i class="fa-solid fa-search"></i>
                    </template>
                  </vs-input>
                  <vs-button @click="searchClientePerseo()" color="primary" size="small" class="btn-buscar-compact">
                    <i class="fa-solid fa-search"></i> Buscar
                  </vs-button>
                </div>

                <small class="help-text-compact" :class="{'text-danger': !validarLongitudCliente()}">
                  {{ obtenerMensajeValidacionCliente() }}
                </small>

                <!-- Tabla de resultados compacta -->
                <div class="results-compact" v-if="arrayClientes.length > 0">
                  <vs-table max-items="5" search pagination stripe :data="arrayClientes">
                    <template slot="header">
                      <vs-chip color="primary" size="small">Resultados: <b>{{ arrayClientes.length }}</b></vs-chip>
                    </template>
                    <template slot="thead">
                      <vs-th>Nombre / Razón Social</vs-th>
                      <vs-th>Identificación</vs-th>
                      <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>{{ data[indextr].razonsocial }}</vs-td>
                        <vs-td>{{ data[indextr].identificacion }}</vs-td>
                        <vs-td>
                          <vs-button
                            @click="selectCliente(data[indextr])"
                            color="success"
                            type="filled"
                            size="small"
                            icon-pack="feather"
                            icon="icon-check"
                          >
                            Seleccionar
                          </vs-button>
                        </vs-td>
                      </vs-tr>
                    </template>
                  </vs-table>
                </div>

                <!-- Sin resultados -->
                <vs-alert v-if="busquedaRealizada && arrayClientes.length === 0" color="warning" class="mt-2">
                  <i class="fa-solid fa-exclamation-triangle"></i>
                  No se encontraron clientes.
                </vs-alert>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Empresa y Observación -->
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
        <div class="info-card">
          <div class="card-header empresa-header">
            <i class="fa-solid fa-building"></i>
            <span>Información del Documento</span>
          </div>
          <div class="card-body">
            <div class="alert alert-info mb-3" style="padding: 10px 15px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
              <i class="fa-solid fa-percent"></i>
              <strong>Descuento aplicado:</strong> {{ documentoVenta.porcentaje_descuento }}%
            </div>
            <div class="form-group-custom">
              <label class="label-custom">
                <i class="fa-solid fa-building"></i>
                Empresa <span class="required">*</span>
              </label>
              <v-select
                @input="onEmpresaSelected(); cleanCliente(); f_getResumen()"
                :options="listaEmpresas"
                :reduce="(listaEmpresas) => listaEmpresas"
                density="comfortable"
                label="nombre"
                class="w-full select-custom"
                value="id"
                placeholder="--Seleccione una empresa--"
                v-model="documentoVenta.empresa"
              />
              <span v-if="!documentoVenta.empresa" class="error-text">
                <i class="fa-solid fa-exclamation-triangle"></i> Seleccione la empresa
              </span>
            </div>

            <div class="vx-row mt-3">
              <!-- Campo Observación -->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 pr-2">
                <div class="form-group-custom">
                  <label class="label-custom">
                    <i class="fa-solid fa-comment-alt"></i>
                    Observación <span class="required">*</span>
                  </label>
                  <vs-textarea
                    placeholder="Ingrese la observación del documento..."
                    class="w-full textarea-custom"
                    v-model="documentoVenta.observacion"
                    rows="4"
                  />
                  <span v-if="!documentoVenta.observacion" class="error-text">
                    <i class="fa-solid fa-exclamation-triangle"></i> Ingrese una observación
                  </span>
                </div>
              </div>

              <!-- Campo Concepto Perseo -->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 pl-2">
                <div class="form-group-custom">
                  <label class="label-custom">
                    <i class="fa-solid fa-lightbulb"></i>
                    Concepto Perseo <span class="required">*</span>
                  </label>
                  <vs-textarea
                    placeholder="Ingrese el concepto para Perseo..."
                    class="w-full textarea-custom"
                    v-model="documentoVenta.ven_concepto_perseo"
                    rows="4"
                  />
                  <span v-if="!documentoVenta.ven_concepto_perseo" class="error-text">
                    <i class="fa-solid fa-exclamation-triangle"></i> Ingrese un concepto Perseo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando todos los items están completamente facturados -->
    <vs-alert v-if="arrayResumen.length > 0 && arrayResumenFiltrado.length === 0" color="success" class="mt-4">
      <i class="fa-solid fa-check-circle"></i>
      <strong>Pedido completamente facturado.</strong> Todos los items de este pedido ya han sido facturados en su totalidad.
    </vs-alert>

    <!--tabla para cantidad autorizada-->
    <vx-card v-if="arrayResumenFiltrado.length > 0">
      <div>
        <vs-chip color="primary">Cantidad: <b> {{ arrayResumenFiltrado.length }}</b></vs-chip>
        <vs-chip v-if="loadingStock" color="warning">
          <i class="fa-solid fa-spinner fa-spin"></i>
          Consultando Stock... ({{ progresoStock.actual }}/{{ progresoStock.total }})
        </vs-chip>
        <template v-else>
          <vs-chip color="success">
            <i class="fa-solid fa-check-circle"></i>
            Stock Actualizado
          </vs-chip>
          <vs-chip v-if="productosSinStock.length > 0" color="danger">
            <i class="fa-solid fa-triangle-exclamation"></i>
            {{ productosSinStock.length }} sin stock suficiente
          </vs-chip>
        </template>
      </div>
      <vs-table max-items="10" stripe search pagination :data="arrayResumenFiltrado">
        <template slot="header">

        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>            <vs-th>Stock Disponible</vs-th>            <vs-th>Cantidad solicitada</vs-th>
            <vs-th>Cantidad facturada</vs-th> <vs-th>Cantidad autorizar</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr
              :data="tr"
              :key="indextr"
              v-for="(tr, indextr) in data"
              :class="{ 'fila-sin-stock': tr.sinStock }"
            >
              <vs-td>
                <b>Nombre:</b>
                <p>{{tr.nombrelibro}}</p>
                <b>Código:</b>
                <p>{{tr.codigoFact}}</p>
              </vs-td>
              <vs-td>
                <div class="stock-cell">
                  <span
                    :class="{
                      'stock-ok':       !tr.sinStock && tr.stockPerseo !== null,
                      'stock-warn':      tr.sinStock && tr.stockPerseo > 0,
                      'stock-empty':     tr.stockPerseo === 0,
                      'stock-loading':   tr.stockPerseo === null
                    }"
                  >
                    <i v-if="tr.stockPerseo === null" class="fa-solid fa-spinner fa-spin"></i>
                    <i v-else-if="tr.stockPerseo === 0" class="fa-solid fa-ban"></i>
                    <i v-else-if="tr.sinStock" class="fa-solid fa-triangle-exclamation"></i>
                    <i v-else class="fa-solid fa-check"></i>
                    {{ tr.stockPerseo !== null ? tr.stockPerseo : 'Consultando...' }}
                  </span>
                  <small v-if="tr.sinStock && tr.stockPerseo > 0" class="stock-alerta">
                    Insuficiente para cubrir pendiente ({{ tr.cantidad_pendiente }})
                  </small>
                  <small v-if="tr.stockPerseo === 0" class="stock-alerta">
                    Sin stock disponible
                  </small>
                </div>
              </vs-td>
              <vs-td>
                {{tr.cantidad_solicitada}}
              </vs-td>
              <vs-td>
                {{ tr.cantidadAutorizada }}
              </vs-td>
              <vs-td>
                <vs-input
                  v-model.number="tr.cantidadAutorizar"
                  @input="clampCantidad(tr)"
                  type="number"
                  min="0"
                  :max="tr.maxAutorizable"
                  class="w-full"
                  :class="{ 'input-error': tr.cantidadAutorizar > tr.maxAutorizable || tr.cantidadAutorizar < 0 }"
                  :disabled="tr.maxAutorizable === 0"
                />
                <small v-if="tr.maxAutorizable === 0" class="error-text">
                  <i class="fa-solid fa-ban"></i> Sin stock disponible
                </small>
                <small v-else-if="tr.sinStock" class="warn-text">
                  <i class="fa-solid fa-triangle-exclamation"></i> Máx por stock: {{ tr.maxAutorizable }}
                </small>
              </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </vx-card>

    <!-- Botones de acción -->
    <div class="action-buttons">
      <vs-button
        @click="guardarDocumento()"
        type="relief"
        color="success"
        size="large"
        class="btn-action"
        :disabled="loadingStock"
      >
        <i v-if="loadingStock" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-save"></i>
        {{ loadingStock ? 'Cargando Stock...' : 'Generar Documento' }}
      </vs-button>
      <vs-button @click="cerrar()" type="relief" color="danger" size="large" class="btn-action">
        <i class="fa-solid fa-times"></i> Cancelar
      </vs-button>
    </div>

    <!-- Popup de Confirmación -->
    <vs-popup
      class="popup-confirm-documento"
      title="⚠️ Confirmar Generación de Documento"
      :active.sync="showConfirmPopup"
    >
      <div class="popup-content">
        <div class="popup-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <p class="popup-message">
          Se creará el documento de venta y se descontará el <strong>stock de la plataforma</strong>.
        </p>
        <p class="popup-question">¿Desea continuar?</p>
      </div>
      <div class="popup-actions">
        <vs-button
          @click="procesarDocumento()"
          type="relief"
          color="success"
          size="large"
          class="btn-popup"
        >
          <i class="fa-solid fa-check"></i> Sí, Generar
        </vs-button>
        <vs-button
          @click="showConfirmPopup = false"
          type="relief"
          color="danger"
          size="large"
          class="btn-popup"
        >
          <i class="fa-solid fa-times"></i> Cancelar
        </vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
  components: {
    vSelect,
  },
  props: {
    ObjectSelected: {
      type: Object,
      default: () => ({})
    },
    mixinIdInicioFormatoNewData: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      usuario: null,
      listaEmpresas: [],
      documentoVenta: {
        empresa: '',
        observacion: '',
        ven_concepto_perseo: '',
        cliente: '',
        porcentaje_descuento: 0,
      },
      datosDespachoSelect: {
        nombreInstitucion: '',
        ciudad: '',
        id_institucion: '',
        idusuario: '',
        nombre: '',
        cedula: '',
        datosInstitucion: [],
        clientesidPerseo: 0,
      },
      busqueda: {
        tipoBusqueda: 'identificacion',
        cedula: ''
      },
      arrayClientes: [],
      busquedaRealizada: false,
      mostrarBusqueda: false,
      arrayResumen: [],
      loadingStock: false,
      progresoStock: {
        actual: 0,
        total: 0
      },
      showConfirmPopup: false
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  mounted() {
    this.getEmpresas();
  },
  watch: {
    arrayResumen: {
      handler(newVal) {
        // Inicializar stockPerseo en cada item si no existe
        if (Array.isArray(newVal)) {
          newVal.forEach(item => {
            if (item.stockPerseo === undefined) {
              this.$set(item, 'stockPerseo',    null);
              this.$set(item, 'sinStock',       false);
              this.$set(item, 'maxAutorizable', item.cantidad_pendiente || 0);
            }
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    arrayResumenFiltrado() {
      // Filtrar solo items con cantidad pendiente > 0 (que aún no están completamente facturados)
      return this.arrayResumen.filter(item => {
        const pendiente = parseInt(item.cantidad_pendiente) || 0;
        return pendiente > 0;
      });
    },
    productosSinStock() {
      return this.arrayResumenFiltrado.filter(item => item.sinStock === true);
    },
  },
  methods: {
    f_getResumen(){
      let me = this;
      me.arrayResumen = []
      if(!me.documentoVenta.empresa){
        return
      }
      me.$vs.loading()
      var url = ""
      var url = this.$server_url+'guias?InformacionPedidoGuia=1&id_pedido='+me.ObjectSelected.id_pedido
      this.$http.get(url)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.status == 0){
            me.$vs.notify({
                text: res.data.message,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time:3000
            })
            return
        }
        me.arrayResumen = res.data
        // Inicializar propiedades reactivas en cada item
        me.arrayResumen.forEach(item => {
          me.$set(item, 'cantidadAutorizar', item.cantidad_pendiente || 0); // Inicializar con el máximo disponible
          me.$set(item, 'stockPerseo',       null);                        // null = aún consultando
          me.$set(item, 'sinStock',          false);                       // se actualiza al llegar stock
          me.$set(item, 'maxAutorizable',    item.cantidad_pendiente || 0); // por defecto = pendiente
        });

        // Consultar stock de Prolipa automáticamente después de cargar el resumen
        me.$nextTick(() => {
          me.f_getStockProlipa();
        });

      })
      .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
          me.$vs.notify({
              text: "Ocurrio un error al cargar los datos",
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
              time:3000
          })
      })
    },
    getEmpresas() {
      let me = this;
      me.listaEmpresas = [];
      me.$vs.loading();
      this.$http.get(this.$server_url + 'empresa')
        .then(res => {
          me.$vs.loading.close();
          me.listaEmpresas = res.data;
          // Filtrar empresa con id 2 si es necesario
          me.listaEmpresas = me.listaEmpresas.filter(empresa => empresa.id !== 2);
        })
        .catch(err => {
          me.$vs.loading.close();
          console.error(err);
          me.$vs.notify({
            text: "Error al cargar las empresas",
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 3000
          });
        });
    },

    onEmpresaSelected() {
      // Cuando se selecciona una empresa, asignar el porcentaje_acta_guias a porcentaje_descuento
      // Si no hay empresa seleccionada, resetear a 0
      if (this.documentoVenta.empresa) {
        this.documentoVenta.porcentaje_descuento = this.documentoVenta.empresa.porcentaje_acta_guias;
      } else {
        this.documentoVenta.porcentaje_descuento = 0;
      }

      // Resetear el stock de todos los items para que se vuelva a consultar
      // Esto mantiene el stock fresco cada vez que cambia de empresa
      if (this.arrayResumen && this.arrayResumen.length > 0) {
        this.arrayResumen.forEach(item => {
          this.$set(item, 'stockPerseo', null);
          this.$set(item, 'sinStock', false);
          this.$set(item, 'maxAutorizable', item.cantidad_pendiente || 0);
        });
      }
    },

    cleanCliente() {
      // Limpiar los datos del cliente cuando se cambia la empresa
      this.datosDespachoSelect = {
        nombreInstitucion: '',
        ciudad: '',
        id_institucion: '',
        idusuario: '',
        nombre: '',
        cedula: '',
        datosInstitucion: [],
        clientesidPerseo: 0,
      };
      this.arrayClientes = [];
      this.busquedaRealizada = false;
      this.busqueda.cedula = '';
      this.mostrarBusqueda = false;
    },

    cambiarCliente() {
      // Activar modo búsqueda y limpiar cliente actual
      this.mostrarBusqueda = true;
      this.datosDespachoSelect.nombre = '';
      this.datosDespachoSelect.cedula = '';
      this.datosDespachoSelect.clientesidPerseo = 0;
      this.arrayClientes = [];
      this.busquedaRealizada = false;
      this.busqueda.cedula = '';
    },

    validateNumber() {
      // Permitir solo números en la búsqueda por identificación
      this.busqueda.cedula = this.busqueda.cedula.replace(/[^0-9]/g, '');
    },

    validarLongitudCliente() {
      if (this.busqueda.tipoBusqueda === 'identificacion') {
        const length = this.busqueda.cedula.length;
        return length === 0 || length === 10 || length === 13;
      } else {
        return this.busqueda.cedula.length === 0 || this.busqueda.cedula.length >= 3;
      }
    },

    obtenerMensajeValidacionCliente() {
      if (this.busqueda.tipoBusqueda === 'identificacion') {
        return 'Ingrese 10 dígitos para cédula o 13 para RUC';
      } else {
        return 'Ingrese al menos 3 caracteres para buscar';
      }
    },

    searchClientePerseo() {
      let me = this;

      if (!me.validarLongitudCliente()) {
        me.$vs.notify({
          text: me.obtenerMensajeValidacionCliente(),
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      if (!me.busqueda.cedula) {
        me.$vs.notify({
          text: 'Por favor, ingrese un valor para buscar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      me.$vs.loading();
      me.arrayClientes = [];

      let formData = new FormData();

      // Enviar el parámetro correcto según el tipo de búsqueda seleccionado
      if (me.busqueda.tipoBusqueda === 'identificacion') {
        formData.append("identificacion", me.busqueda.cedula);
      } else {
        formData.append("contenido", me.busqueda.cedula);
      }

      formData.append("empresa", me.documentoVenta.empresa.id);

      me.$http.post(me.$server_url + "api/perseo/clientes/clientes_consulta", formData)
        .then(function(res) {
          me.$vs.loading.close();
          me.busquedaRealizada = true;

          if (!res.data) {
            me.$vs.notify({
              text: me.busqueda.tipoBusqueda === 'identificacion'
                ? 'No se encontró esta cédula o RUC en Perseo.'
                : 'No se encontró este nombre en Perseo.',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              time: 3000
            });
            return;
          }

          if (res.data.fault) {
            me.$vs.notify({
              text: res.data.fault.faultstring,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              time: 3000
            });
            return;
          }

          me.arrayClientes = res.data.clientes || [];

          if (me.arrayClientes.length === 0) {
            me.$vs.notify({
              title: 'Sin resultados',
              text: `No se encontraron clientes con ${me.busqueda.tipoBusqueda === 'identificacion' ? 'esa identificación' : 'ese nombre'} en Perseo`,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
              time: 3000
            });
          } else {
            me.$vs.notify({
              text: `Se encontraron ${me.arrayClientes.length} cliente(s)`,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check',
              time: 3000
            });
          }
        })
        .catch(function(error) {
          me.$vs.loading.close();
          console.error(error);
          me.$vs.notify({
            text: 'Error al buscar los datos en Perseo',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 3000
          });
        });
    },

    selectCliente(cliente) {
      let me = this;
      me.datosDespachoSelect.nombre = cliente.razonsocial;
      me.datosDespachoSelect.cedula = cliente.identificacion;
      me.datosDespachoSelect.clientesidPerseo = cliente.clientesid || 0;
      me.datosDespachoSelect.idusuario = cliente.clientesid || 0;
      me.datosDespachoSelect.email  = cliente.email;
      me.$vs.notify({
        text: `Cliente ${cliente.razonsocial} seleccionado`,
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check',
        time: 3000
      });

      // Limpiar resultados y ocultar búsqueda
      me.arrayClientes = [];
      me.busquedaRealizada = false;
      me.busqueda.cedula = '';
      me.mostrarBusqueda = false;
    },

    /**
     * Consulta el stock en Perseo para todos los items del arrayResumen
     * Envía en lotes de 10 para no saturar la API externa
     */
    // async f_getStockPerseo() {
    //   const me = this;

    //   // Filtrar items que aún no tienen stockPerseo asignado
    //   const itemsSinStock = me.arrayResumen.filter(item =>
    //     item.codigoFact && (item.stockPerseo === undefined || item.stockPerseo === null)
    //   );

    //   if (itemsSinStock.length === 0) {
    //     return; // Ya todos tienen stock asignado
    //   }

    //   if (!me.documentoVenta.empresa || !me.documentoVenta.empresa.id) {
    //     me.$vs.notify({
    //       text: 'No se ha seleccionado una empresa',
    //       color: 'danger',
    //       position: 'top-right'
    //     });
    //     return;
    //   }

    //   me.loadingStock = true;

    //   // Dividir en lotes de 10
    //   const BATCH_SIZE = 10;
    //   const batches = [];
    //   for (let i = 0; i < itemsSinStock.length; i += BATCH_SIZE) {
    //     batches.push(itemsSinStock.slice(i, i + BATCH_SIZE));
    //   }

    //   me.progresoStock.total = batches.length;
    //   me.progresoStock.actual = 0;

    //   console.log(`📡 Consultando stock Perseo: ${itemsSinStock.length} items en ${batches.length} lotes`);

    //   try {
    //     for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    //       const batch = batches[batchIndex];
    //       me.progresoStock.actual = batchIndex + 1;

    //       // Extraer los códigos de facturación del lote
    //       const codigosArray = batch.map(item => item.codigoFact);

    //       console.log(`📦 Lote ${batchIndex + 1}/${batches.length}:`, codigosArray);

    //       try {
    //         const response = await me.$http.post(
    //           `${me.$server_url}api/perseo/productos/productos_consulta_x_id`,
    //           {
    //             codigos: codigosArray,
    //             id_empresa: me.documentoVenta.empresa.id
    //           }
    //         );

    //         const productos = response.data.productos || [];

    //         // Mapear los resultados al arrayResumen
    //         productos.forEach(producto => {
    //           // Buscar el item en arrayResumen por codigoFact
    //           const itemEncontrado = me.arrayResumen.find(
    //             item => item.codigoFact === producto.productocodigo
    //           );

    //           if (itemEncontrado) {
    //             const stock = producto.existenciastotales || 0;
    //             me.$set(itemEncontrado, 'stockPerseo',     stock);
    //             // sinStock = true si el stock es menor a la cantidad pendiente
    //             const sinStock     = stock < itemEncontrado.cantidad_pendiente;
    //             const maxAuto      = sinStock ? stock : itemEncontrado.cantidad_pendiente;
    //             me.$set(itemEncontrado, 'sinStock',        sinStock);
    //             me.$set(itemEncontrado, 'maxAutorizable',  maxAuto);
    //             me.$set(itemEncontrado, 'cantidadAutorizar', maxAuto); // Actualizar cantidad con el máximo disponible
    //             console.log(`✅ ${producto.productocodigo}: stock=${stock}, sinStock=${sinStock}, max=${maxAuto}`);
    //           }
    //         });

    //         // Marcar con 0 los productos no encontrados en este batch
    //         batch.forEach(item => {
    //           const itemEncontrado = me.arrayResumen.find(
    //             i => i.codigoFact === item.codigoFact
    //           );
    //           // Si el item aún está en null (no fue actualizado), significa que no se encontró en Perseo
    //           if (itemEncontrado && (itemEncontrado.stockPerseo === null || itemEncontrado.stockPerseo === undefined)) {
    //             me.$set(itemEncontrado, 'stockPerseo',    0);
    //             me.$set(itemEncontrado, 'sinStock',       true);
    //             me.$set(itemEncontrado, 'maxAutorizable', 0);
    //             me.$set(itemEncontrado, 'cantidadAutorizar', 0); // Sin stock = cantidad autorizar 0
    //             console.log(`⚠️ ${item.codigoFact}: No encontrado en Perseo - stock=0`);
    //           }
    //         });

    //       } catch (error) {
    //         console.error(`❌ Error en lote ${batchIndex + 1}:`, error);
    //         // Marcar los items de este lote con error
    //         batch.forEach(item => {
    //           const itemEncontrado = me.arrayResumen.find(
    //             i => i.codigoFact === item.codigoFact
    //           );
    //           if (itemEncontrado && (itemEncontrado.stockPerseo === null || itemEncontrado.stockPerseo === undefined)) {
    //             me.$set(itemEncontrado, 'stockPerseo',    'Error');
    //             me.$set(itemEncontrado, 'sinStock',       true);
    //             me.$set(itemEncontrado, 'maxAutorizable', 0);
    //             me.$set(itemEncontrado, 'cantidadAutorizar', 0); // Error en stock = cantidad autorizar 0
    //           }
    //         });
    //       }

    //       // Pequeña pausa entre lotes para no saturar la API
    //       if (batchIndex < batches.length - 1) {
    //         await new Promise(resolve => setTimeout(resolve, 200));
    //       }
    //     }

    //     me.$vs.notify({
    //       text: `Stock de Perseo actualizado para ${itemsSinStock.length} producto(s)`,
    //       color: 'success',
    //       position: 'top-right'
    //     });

    //   } catch (error) {
    //     console.error('❌ Error general consultando stock Perseo:', error);
    //     me.$vs.notify({
    //       text: 'Error al consultar stock en Perseo',
    //       color: 'danger',
    //       position: 'top-right'
    //     });
    //   } finally {
    //     me.loadingStock = false;
    //   }
    // },

    /**
     * Consulta el stock en Prolipa para todos los items del arrayResumen
     * Consulta directamente la base de datos de Prolipa (tabla 1_4_cal_producto)
     * Campo usado: pro_stockCalmed (sin importar la empresa)
     * Envía en lotes de 20 para optimizar las consultas
     */
    async f_getStockProlipa() {
      const me = this;

      // Filtrar items que aún no tienen stockPerseo asignado
      const itemsSinStock = me.arrayResumen.filter(item =>
        item.codigoFact && (item.stockPerseo === undefined || item.stockPerseo === null)
      );

      if (itemsSinStock.length === 0) {
        return; // Ya todos tienen stock asignado
      }

      if (!me.documentoVenta.empresa || !me.documentoVenta.empresa.id) {
        me.$vs.notify({
          text: 'No se ha seleccionado una empresa',
          color: 'danger',
          position: 'top-right'
        });
        return;
      }

      me.loadingStock = true;

      // Dividir en lotes de 20 (consulta a BD local es más rápida que API externa)
      const BATCH_SIZE = 20;
      const batches = [];
      for (let i = 0; i < itemsSinStock.length; i += BATCH_SIZE) {
        batches.push(itemsSinStock.slice(i, i + BATCH_SIZE));
      }

      me.progresoStock.total = batches.length;
      me.progresoStock.actual = 0;

      console.log(`📡 Consultando stock Prolipa: ${itemsSinStock.length} items en ${batches.length} lotes`);

      try {
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          me.progresoStock.actual = batchIndex + 1;

          // Extraer los códigos de facturación del lote
          const codigosArray = batch.map(item => item.codigoFact);

          console.log(`📦 Lote ${batchIndex + 1}/${batches.length}:`, codigosArray);

          try {
            // Enviar datos usando FormData
            let formData = new FormData();
            formData.append('getStockProductosProlipa', 1);
            formData.append('codigos', JSON.stringify(codigosArray));

            const response = await me.$http.post(
              `${me.$server_url}guias`,
              formData
            );

            if (response.data.status !== '1') {
              console.error('❌ Error en respuesta:', response.data.message);
              throw new Error(response.data.message || 'Error al consultar stock');
            }

            const productos = response.data.data || [];

            // Mapear los resultados al arrayResumen
            productos.forEach(producto => {
              // Buscar el item en arrayResumen por codigoFact
              const itemEncontrado = me.arrayResumen.find(
                item => item.codigoFact === producto.pro_codigo
              );

              if (itemEncontrado && producto.disponible) {
                // Usar pro_stockCalmed como campo principal (sin importar la empresa)
                const stock = producto.pro_stockCalmed || 0;
                me.$set(itemEncontrado, 'stockPerseo', stock);
                // sinStock = true si el stock es menor a la cantidad pendiente
                const sinStock = stock < itemEncontrado.cantidad_pendiente;
                const maxAuto = sinStock ? stock : itemEncontrado.cantidad_pendiente;
                me.$set(itemEncontrado, 'sinStock', sinStock);
                me.$set(itemEncontrado, 'maxAutorizable', maxAuto);
                me.$set(itemEncontrado, 'cantidadAutorizar', maxAuto);
                console.log(`✅ ${producto.pro_codigo}: stock=${stock}, sinStock=${sinStock}, max=${maxAuto}`);
              } else if (itemEncontrado && !producto.disponible) {
                // Producto no encontrado en BD
                me.$set(itemEncontrado, 'stockPerseo', 0);
                me.$set(itemEncontrado, 'sinStock', true);
                me.$set(itemEncontrado, 'maxAutorizable', 0);
                me.$set(itemEncontrado, 'cantidadAutorizar', 0);
                console.log(`⚠️ ${producto.pro_codigo}: No encontrado en Prolipa - stock=0`);
              }
            });

            // Marcar con 0 los productos no encontrados en este batch
            batch.forEach(item => {
              const itemEncontrado = me.arrayResumen.find(
                i => i.codigoFact === item.codigoFact
              );
              // Si el item aún está en null (no fue actualizado), significa que no se encontró
              if (itemEncontrado && (itemEncontrado.stockPerseo === null || itemEncontrado.stockPerseo === undefined)) {
                me.$set(itemEncontrado, 'stockPerseo', 0);
                me.$set(itemEncontrado, 'sinStock', true);
                me.$set(itemEncontrado, 'maxAutorizable', 0);
                me.$set(itemEncontrado, 'cantidadAutorizar', 0);
                console.log(`⚠️ ${item.codigoFact}: No encontrado en respuesta - stock=0`);
              }
            });

          } catch (error) {
            console.error(`❌ Error en lote ${batchIndex + 1}:`, error);
            // Marcar los items de este lote con error
            batch.forEach(item => {
              const itemEncontrado = me.arrayResumen.find(
                i => i.codigoFact === item.codigoFact
              );
              if (itemEncontrado && (itemEncontrado.stockPerseo === null || itemEncontrado.stockPerseo === undefined)) {
                me.$set(itemEncontrado, 'stockPerseo', 'Error');
                me.$set(itemEncontrado, 'sinStock', true);
                me.$set(itemEncontrado, 'maxAutorizable', 0);
                me.$set(itemEncontrado, 'cantidadAutorizar', 0);
              }
            });
          }

          // Pequeña pausa entre lotes (opcional, ya que es BD local)
          if (batchIndex < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        me.$vs.notify({
          text: `Stock de Prolipa actualizado para ${itemsSinStock.length} producto(s)`,
          color: 'success',
          position: 'top-right'
        });

      } catch (error) {
        console.error('❌ Error general consultando stock Prolipa:', error);
        me.$vs.notify({
          text: 'Error al consultar stock en Prolipa',
          color: 'danger',
          position: 'top-right'
        });
      } finally {
        me.loadingStock = false;
      }
    },
    guardarDocumento() {
      let me = this;

      // Validar que no esté cargando stock
      if (me.loadingStock) {
        me.$vs.notify({
          text: "Por favor, espere a que termine de cargar el stock de todos los productos",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-clock',
          time: 3000
        });
        return;
      }

      // Validaciones antes de abrir el popup
      if (!me.documentoVenta.empresa) {
        me.$vs.notify({
          text: "Por favor, seleccione una empresa",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      if (!me.documentoVenta.observacion) {
        me.$vs.notify({
          text: "Por favor, ingrese una observación",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      if (!me.documentoVenta.ven_concepto_perseo) {
        me.$vs.notify({
          text: "Por favor, ingrese un concepto Perseo",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      if (!me.datosDespachoSelect.nombre) {
        me.$vs.notify({
          text: "Por favor, seleccione un cliente",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      // Mostrar popup de confirmación solo si todas las validaciones pasaron
      me.showConfirmPopup = true;
    },

    procesarDocumento() {
      let me = this;

      // Cerrar el popup de confirmación
      me.showConfirmPopup = false;

      // Validar usuario facturador
      if (!me.usuario || !me.usuario.iniciales) {
        me.$vs.notify({
          text: 'las iniciales del usuario facturador no está configurado',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 3000
        });
        return;
      }

      // Validar stock: ninguna cantidad puede superar el stock disponible en Perseo
      if (!me.loadingStock) {
        const sinStockItem = me.arrayResumenFiltrado.find(
          item => parseInt(item.cantidadAutorizar) > 0 &&
                  item.sinStock === true &&
                  parseInt(item.cantidadAutorizar) > (item.maxAutorizable || 0)
        );
        if (sinStockItem) {
          me.$vs.notify({
            text: `"${sinStockItem.nombrelibro}" no tiene stock suficiente. Stock disponible: ${sinStockItem.stockPerseo}`,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 5000
          });
          return;
        }
      }

      // Validar que ninguna cantidad supere cantidad_pendiente
      const itemInvalido = me.arrayResumenFiltrado.find(
        item => parseInt(item.cantidadAutorizar) > parseInt(item.cantidad_pendiente)
      );
      if (itemInvalido) {
        me.$vs.notify({
          text: `La cantidad autorizada de "${itemInvalido.nombrelibro}" supera la cantidad pendiente (${itemInvalido.cantidad_pendiente})`,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 4000
        });
        return;
      }

      // Array 1: Solo items con cantidadAutorizar > 0 (para crear detalles de venta)
      const guias_send = me.arrayResumenFiltrado
        .filter(item => parseInt(item.cantidadAutorizar) > 0)
        .map(item => ({
          codigoFact:        item.codigoFact,
          nombrelibro:       item.nombrelibro,
          cantidad_solicitada:item.cantidad_solicitada,
          cantidadAutorizar: parseInt(item.cantidadAutorizar),
        }));

      // Array 2: TODOS los items pendientes con información completa (para calcular estado del pedido)
      const guias_completas = me.arrayResumenFiltrado.map(item => ({
        codigoFact:         item.codigoFact,
        cantidad_solicitada: item.cantidad_solicitada,
        cantidadAutorizar:  parseInt(item.cantidadAutorizar) || 0,
        cantidad_pendiente: parseInt(item.cantidad_pendiente) || 0,
      }));

      if (guias_send.length === 0) {
        me.$vs.notify({
          text: 'Ingrese al menos una cantidad autorizada mayor a 0',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time: 3000
        });
        return;
      }

      let formData = new FormData();
      formData.append('GuiasGenerarDocumentoVenta', 1);
      formData.append('empresa_id',          me.documentoVenta.empresa.id);
      formData.append('id_pedido',           me.ObjectSelected.id_pedido);
      formData.append('id_periodo',          me.ObjectSelected.id_periodo);
      formData.append('usuario_fact',        me.usuario.idusuario);
      formData.append('codigo_usuario_fact', me.usuario.iniciales);
      formData.append('ven_observacion',     me.documentoVenta.observacion);
      formData.append('ven_concepto_perseo', me.documentoVenta.ven_concepto_perseo);
      formData.append('cliente_nombre',      me.datosDespachoSelect.nombre);
      formData.append('cliente_cedula',      me.datosDespachoSelect.cedula);
      formData.append('id_cliente_perseo',   me.datosDespachoSelect.clientesidPerseo);
      formData.append('email_cliente',       me.datosDespachoSelect.email);
      formData.append('porcentaje_descuento', me.documentoVenta.porcentaje_descuento);
      formData.append('guias_send',          JSON.stringify(guias_send));
      formData.append('guias_completas',     JSON.stringify(guias_completas));
      formData.append('codigo_contrato',     me.ObjectSelected.codigo_contrato || '');
      me.$vs.loading();
      me.$http.post(me.$server_url + 'guias', formData)
        .then(function(res) {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
              time: 5000
            });
            return;
          }
          me.$vs.notify({
            text: 'Documento de venta generado correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 3000
          });
          me.$emit('cerrar');
        })
        .catch(function(error) {
          me.$vs.loading.close();
          console.error(error);
          let errorMessage = 'Error al generar el documento de venta';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          me.$vs.notify({
            text: errorMessage,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 5000
          });
        });
    },

    clampCantidad(item) {
      const val     = parseInt(item.cantidadAutorizar);
      const maxReal = parseInt(item.maxAutorizable != null ? item.maxAutorizable : item.cantidad_pendiente);
      if (isNaN(val) || val < 0) {
        this.$set(item, 'cantidadAutorizar', 0);
      } else if (val > maxReal) {
        this.$set(item, 'cantidadAutorizar', maxReal);
      }
    },

    cerrar() {
      // Emitir evento para cerrar el popup
      this.$emit('cerrar');
    }
  }
}
</script>

<style scoped>
.documento-venta-container {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

/* Tarjeta de información del pedido */
.info-pedido-card {
  background: linear-gradient(135deg, #5b6b8a 0%, #3f4d66 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.info-header i {
  font-size: 24px;
}

.info-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.info-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 18px;
  font-weight: 600;
}

/* Tarjetas de información */
.info-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e8e8e8;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.card-header i {
  font-size: 18px;
}

.cliente-header {
  background: linear-gradient(135deg, #48a999 0%, #5dbfaf 100%);
}

.empresa-header {
  background: linear-gradient(135deg, #e67373 0%, #f28d8d 100%);
}

.card-body {
  padding: 20px;
}

/* Información de campos */
.field-info {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.field-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #5b9bd5 0%, #4a8bc2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.field-content {
  flex: 1;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.field-value {
  color: #48a999;
  font-weight: 600;
  font-size: 15px;
}

.field-value i {
  margin-right: 5px;
}

.field-value-empty {
  color: #e67373;
  font-size: 14px;
  font-style: italic;
  font-weight: 500;
}

.field-value-empty i {
  margin-right: 5px;
}

.text-success {
  color: #48a999;
}

.text-muted {
  color: #6b7280;
  font-size: 13px;
}

.d-block {
  display: block;
}

/* Formularios personalizados */
.form-group-custom {
  margin-bottom: 15px;
}

.label-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  font-size: 14px;
}

.label-custom i {
  color: #5b9bd5;
}

.required {
  color: #e67373;
  font-weight: bold;
}

.error-text {
  color: #e67373;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-weight: 500;
}

.error-text i {
  font-size: 12px;
}

.input-error :deep(input),
.input-error input {
  border-color: #e67373 !important;
  box-shadow: 0 0 0 2px rgba(230, 115, 115, 0.25) !important;
  background-color: rgba(230, 115, 115, 0.05) !important;
}

/* Fila completa en rojo suave cuando no hay stock */
.fila-sin-stock td {
  background-color: rgba(230, 115, 115, 0.07) !important;
}

/* Celda de stock */
.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-ok {
  color: #48a999;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-warn {
  color: #e6a817;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-empty {
  color: #e67373;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-loading {
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-alerta {
  color: #e67373;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
}

/* Texto de advertencia (amarillo) */
.warn-text {
  color: #e6a817;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-weight: 500;
}

.warn-text i {
  font-size: 12px;
}

/* Sección de selección */
.selection-section {
  background: white;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.section-header {
  background: linear-gradient(135deg, #7b83c7 0%, #8d95d9 100%);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.section-header i {
  font-size: 20px;
}

.section-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.section-content {
  padding: 20px;
}

/* Estilos de búsqueda */
.search-box {
  background: #fafbfc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
}

.search-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 15px;
  font-size: 15px;
}

.search-label i {
  color: #5b9bd5;
  font-size: 16px;
}

.search-options {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.radio-option input[type="radio"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.search-input-group {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.search-input-group .vs-input {
  flex: 1;
}

.search-btn {
  min-width: 120px;
  margin-top: 20px;
}

.help-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
}

.help-text.text-danger {
  color: #e67373;
  font-weight: 500;
}

.results-container {
  margin-top: 20px;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-action {
  min-width: 180px;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.18);
}

.btn-action i {
  margin-right: 8px;
}

/* Cliente seleccionado y búsqueda compacta */
.cliente-seleccionado {
  padding: 15px;
  background: #f8fffe;
  border-radius: 8px;
  border: 1px solid #c1e8e1;
}

.cliente-info {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 10px;
}

.busqueda-cliente-compacto {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.search-label-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  font-size: 14px;
}

.search-label-compact i {
  color: #5b9bd5;
  font-size: 16px;
}

.alert-warning-compact {
  background: #fef3cd;
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid #ffc107;
  color: #856404;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.search-options-compact {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
}

.radio-option-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.radio-option-compact input[type="radio"] {
  cursor: pointer;
  width: 15px;
  height: 15px;
}

.search-input-compact {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 8px;
}

.search-input-compact .vs-input {
  flex: 1;
}

.btn-buscar-compact {
  flex-shrink: 0;
}

.help-text-compact {
  display: block;
  margin-top: 5px;
  margin-bottom: 8px;
  font-size: 11px;
  color: #6c757d;
}

.help-text-compact.text-danger {
  color: #e67373;
  font-weight: 500;
}

.results-compact {
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.results-compact :deep(.vs-table) {
  font-size: 13px;
}

.results-compact :deep(.vs-table__td),
.results-compact :deep(.vs-table__th) {
  padding: 8px 10px;
}

/* Popup de Confirmación */
.popup-confirm-documento :deep(.vs-popup) {
  z-index: 70000 !important;
}

.popup-confirm-documento :deep(.vs-popup--background) {
  z-index: 69999 !important;
}

.popup-confirm-documento :deep(.vs-popup--content) {
  max-width: 500px;
  padding: 0;
}

.popup-confirm-documento :deep(.vs-popup--header) {
  background: linear-gradient(135deg, #e6a817 0%, #f5c542 100%);
  color: white;
  padding: 20px 25px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: none;
}

.popup-confirm-documento :deep(.vs-popup--close) {
  background: rgba(0, 0, 0, 0.1) !important;
  border-radius: 50% !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.popup-confirm-documento :deep(.vs-popup--close i) {
  color: #1f2937 !important;
  font-size: 20px !important;
}

.popup-confirm-documento :deep(.vs-popup--close:hover) {
  background: rgba(0, 0, 0, 0.2) !important;
}

.popup-content {
  padding: 30px 25px;
  text-align: center;
}

.popup-icon {
  width: 80px;
  height: 80px;
  background: rgba(230, 168, 23, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.popup-icon i {
  font-size: 40px;
  color: #e6a817;
}

.popup-message {
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 15px;
}

.popup-message strong {
  color: #e6a817;
  font-weight: 700;
}

.popup-question {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0;
}

.popup-actions {
  padding: 20px 25px 25px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-popup {
  min-width: 150px;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.btn-popup:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.18);
}

.btn-popup i {
  margin-right: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .documento-venta-container {
    padding: 10px;
  }

  .info-content {
    flex-direction: column;
    gap: 15px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }

  .info-header h3 {
    font-size: 16px;
  }

  .section-header h4 {
    font-size: 16px;
  }

  .search-options-compact {
    flex-direction: column;
    gap: 8px;
  }

  .search-input-compact {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-buscar-compact {
    width: 100%;
  }

  .popup-actions {
    flex-direction: column;
  }

  .btn-popup {
    width: 100%;
  }

  .popup-confirm-documento :deep(.vs-popup--content) {
    max-width: 90%;
  }
}
</style>
