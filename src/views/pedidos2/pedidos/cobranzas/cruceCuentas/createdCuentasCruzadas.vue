<template>
  <div>
    <vs-row>
      <vs-row>
        <!-- Sección de información de la librería -->
        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="12"
          vs-sm="12"
          vs-xs="12"
        >
          <div class="my-4">
            <h4 class="text-center font-bold mb-3">
              Información de la Librería o Establecimiento
            </h4>
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
              <vs-col vs-justify="center" vs-align="center" vs-w="11">
                <div v-if="unicaLibOEsta.length !== 0">
                  <h5 class="font-medium mb-2">
                    {{ unicaLibOEsta.nombreInstitucion }}
                    <span style="color: gray"
                      >({{ tabCruces.establecimiento }})</span
                    >
                  </h5>
                  <p class="text-sm mt-2">
                    <vs-icon
                      icon-pack="feather"
                      icon="icon-map-pin"
                      size="19"
                      class="mr-2"
                    ></vs-icon
                    >{{ unicaLibOEsta.direccionInstitucion }} <br />
                    <vs-icon
                      icon-pack="feather"
                      icon="icon-phone"
                      size="19"
                      class="mr-2"
                    ></vs-icon
                    >{{ unicaLibOEsta.telefonoInstitucion }} <br />
                    <vs-icon
                      icon-pack="feather"
                      icon="icon-hash"
                      size="19"
                      class="mr-2"
                    ></vs-icon
                    >{{ tabCruces.ruc }}
                  </p>
                </div>
                <div v-else>
                  <div>Seleccione una librería</div>
                  <v-select
                    :options="libreria_establecimiento"
                    :reduce="
                      (libreria_establecimiento) =>
                        libreria_establecimiento.institucion_id
                    "
                    label="nombreInstitucion"
                    class="w-full"
                    placeholder="--Seleccione--"
                    v-model="tabCruces.establecimiento"
                    @input="AsignarLibreria"
                  />
                  <!-- <vs-alert color="#842993" title="ERROR" active="true">
                                    <span>El <b>{{ tabCruces.ruc }}</b> tiene mas de un librería o establecimiento. <b>NO SE REGISTRARÁ EL DOCUMENTO.</b></span>
                                </vs-alert> -->
                </div>
              </vs-col>
            </vs-row>
          </div>
        </vs-col>
      </vs-row>

      <vs-divider> Registro de Detalles de Cruce de cuentas </vs-divider>

      <vs-row class="my-3">
        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="6"
          vs-sm="12"
          vs-xs="12"
        >
          <!-- Campo Fecha -->
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-justify="center" vs-align="center" vs-w="10">
              <div>Fecha:</div>
              <flat-pickr
                :config="configdateTimePicker"
                v-model="tabCruces.fecha"
                placeholder="Fecha"
                style="width: 100%"
                :danger="errores.fecha"
                danger-text="Campo requerido"
              />
            </vs-col>
          </vs-row>
        </vs-col>

        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="6"
          vs-sm="12"
          vs-xs="12"
        >
          <!-- Campo Código Documento -->
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-justify="center" vs-align="center" vs-w="10">
              <div>Código Documento:</div>
              <div>
                <b>{{ tabCruces.numeroDocumento }}</b>
              </div>
              <!-- <vs-input class="inputx w-full mb-6" v-model="tabCruces.numeroDocumento" placeholder="Documento" readonly/> -->
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>

      <vs-row>
        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="6"
          vs-sm="12"
          vs-xs="12"
        >
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-justify="center" vs-align="center" vs-w="10">
              <div :class="{ 'border-danger': errores.notasOfactura }">
                <div class="mb-2 text-danger font-bold">CRUCE DESTINO:</div>
                <vs-radio
                  v-model="tabCruces.notasOfactura"
                  class="ml-2"
                  vs-name="radiosNotas"
                  vs-value="1"
                  >Notas</vs-radio
                >
                <vs-radio
                  v-model="tabCruces.notasOfactura"
                  class="ml-2"
                  vs-name="radiosNotas"
                  vs-value="0"
                  :disabled="usarComponenteNuevo"
                  >Pre-Facturas</vs-radio
                >
              </div>
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="6"
          vs-sm="12"
          vs-xs="12"
        >
          <!-- Campo Fecha -->
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-justify="center" vs-align="center" vs-w="10">
              <div>Referencia:</div>
              <vs-input
                class="inputx w-full mb-6"
                v-model="tabCruces.referencia"
                placeholder="Referencia"
                :danger="errores.referencia"
                danger-text="Campo requerido"
              />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>

      <vs-row vs-justify="end">
        <vs-button
          @click="agregarItem"
          type="relief"
          class="mr-4"
          icon-pack="feather"
          color="success"
          icon="icon-plus"
          >Agregar Detalle</vs-button
        >
      </vs-row>

      <vs-row>
        <table class="table-auto w-full mb-6">
          <thead>
            <tr>
              <th class="text-left py-2 px-4" width="10">#</th>
              <th class="text-left py-2 px-4" width="100">Cantidad</th>
              <th class="text-left py-2 px-4" width="400">Descripción</th>
              <th class="text-left py-2 px-4" width="100">Valor Unitario</th>
              <th class="text-left py-2 px-4" width="100">Valor Total</th>
              <th width="20"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detalle, index) in tabDetalles" :key="index">
              <td class="px-4">
                <b>{{ index + 1 }}</b>
              </td>
              <!-- Campo Cantidad -->
              <td class="px-4">
                <vs-input
                  type="number"
                  min="0"
                  class="inputx w-full"
                  v-model="detalle.cantidad"
                  placeholder="Cantidad"
                  @input="validarCantidad(detalle)"
                  @keypress="filtrarEntrada"
                  :danger="
                    errores.detalles[index] && errores.detalles[index].cantidad
                  "
                  danger-text="Campo requerido"
                />
              </td>
              <!-- Campo Descripción -->
              <td class="px-4">
                <vs-textarea
                  v-model="detalle.descripcion"
                  placeholder="Descripción"
                  class="w-full"
                  height="50px"
                  :class="{
                    'placeholder-danger':
                      errores.detalles[index] &&
                      errores.detalles[index].descripcion,
                  }"
                  :placeholder="
                    errores.detalles[index] &&
                    errores.detalles[index].descripcion
                      ? 'Campo requerido'
                      : 'Descripción'
                  "
                />
                <!-- <span v-if="errores.detalles[index] && errores.detalles[index].descripcion" class="text-danger" style="margin-top: -18px; position: absolute;">Campo requerido</span> -->
              </td>
              <!-- Campo Valor Unitario -->
              <td class="px-4">
                <vs-input
                  type="number"
                  step="0.01"
                  class="inputx w-full"
                  v-model="detalle.valorUnitario"
                  placeholder="Valor Unitario"
                  @input="validarCantidad(detalle)"
                  @keypress="filtrarEntradaValor"
                  :danger="
                    errores.detalles[index] &&
                    errores.detalles[index].valorUnitario
                  "
                  danger-text="Campo requerido"
                />
              </td>
              <!-- Campo Valor Total -->
              <td class="px-4">
                <vs-input
                  type="text"
                  class="inputx w-full"
                  :value="calcularTotalItem(index)"
                  readonly
                  placeholder="Valor Total"
                />
              </td>

              <td class="px-4">
                <vs-button
                  @click="eliminarItem(index)"
                  color="danger"
                  type="relief"
                  icon-pack="feather"
                  icon="icon-trash"
                  v-if="tabDetalles.length > 1"
                >
                </vs-button>
              </td>
            </tr>
          </tbody>
        </table>
      </vs-row>

      <vs-row>
        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="8"
          vs-sm="8"
          vs-xs="8"
        >
        </vs-col>
        <vs-col
          vs-justify="center"
          vs-align="center"
          vs-lg="4"
          vs-sm="4"
          vs-xs="4"
        >
          <!-- Tabla para mostrar los campos -->
          <table class="w-full">
            <tbody>
              <!-- Subtotal -->
              <tr>
                <td class="py-2">Subtotal:</td>
                <td class="py-2 text-right">
                  {{ calcularSubtotal.toFixed(2) }}
                </td>
              </tr>
              <!-- Descuento -->
              <tr>
                <td class="py-2">Descuento:</td>
                <td class="py-2 text-right">
                  <vs-input
                    type="number"
                    step="1"
                    class="inputx max-w-xs text-right inline-block w-1/2"
                    v-model="tabCruces.descuento"
                    @input="validarDescuento"
                    :danger="errores.descuento"
                    danger-text="Campo requerido"
                  />
                </td>
              </tr>
              <!-- Valor Descuento -->
              <tr>
                <td class="py-2">Valor Descuento:</td>
                <td class="py-2 text-right">
                  {{ cacularDescuento.toFixed(2) }}
                </td>
              </tr>
              <!-- Total -->
              <tr>
                <td class="py-2">Total:</td>
                <td class="py-2 text-right">{{ calcularTotal.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col
        vs-type="flex"
        vs-justify="center"
        vs-align="center"
        vs-w="12"
        class="mt-2"
      >
        <vs-button @click="guardarCruce()" type="relief">Guardar</vs-button
        >&emsp;
        <vs-button
          @click="Cerrar('cancelar-guardado')"
          color="danger"
          type="relief"
          >Cancelar</vs-button
        >
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
export default {
  components: {
    "v-select": vSelect,
    flatPickr,
  },
  data() {
    return {
      datosCliente: null,
      empresaCobranza: null,
      tabCruces: {
        fecha: "",
        numeroDocumento: "",
        establecimiento: "",
        direccion: "",
        telefono: "",
        descuento: 0,
        descuentoValor: 0,
        ruc: "",
        referencia: "",
        notasOfactura: "",
      },
      tabDetalles: [
        {
          cantidad: 0,
          descripcion: "",
          valorUnitario: 0,
          valorTotal: 0,
        },
      ],
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d",
        onChange: this.onDateChange,
      },
      libreria_establecimiento: [],
      unicaLibOEsta: [],
      usuario: [],
      seleccionNuevaInstitucion: false,
      errores: {
        fecha: false,
        numeroDocumento: false,
        referencia: false,
        descuento: false,
        ruc: false,
        establecimiento: false,
        detalles: [
          {
            cantidad: false,
            descripcion: false,
            valorUnitario: false,
          },
        ],
        descuento: false,
      },
    };
  },
  props: {
    datos: {
      type: Object,
      default: function () {
        return {};
      },
    },
    empresa: {
      type: Object,
      default: function () {
        return {};
      },
    },
    periodoSelect: {
      type: Object,
      default: function () {
        return {};
      },
    },
    usarComponenteNuevo: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.datosCliente = this.datos;
    this.empresaCobranza = this.empresa;
    if (me.usarComponenteNuevo) {
      me.tabCruces.notasOfactura = 1;
    }
  },
  mounted() {
    this.buscarLibreriaOestablecimiento();
    this.$vs.loading.close();
  },
  computed: {
    calcularSubtotal() {
      // Calcular el subtotal como la suma de todos los valores totales de los items
      return this.tabDetalles.reduce((total, detalle) => {
        return total + detalle.cantidad * detalle.valorUnitario;
      }, 0);
    },
    calcularTotal() {
      return this.calcularSubtotal - this.cacularDescuento;
    },
    cacularDescuento() {
      return (this.calcularSubtotal * this.tabCruces.descuento) / 100;
    },
  },
  methods: {
    onDateChange(selectedDates, dateStr, instance) {
      instance.close();
    },
    Cerrar(e) {
      let me = this;
      this.$emit("CerrarCrearcionCruce", e);
    },
    buscarLibreriaOestablecimiento() {
      let me = this;
      this.$vs.loading();
      this.$http
        .get(
          this.$server_url +
            "buscarLibreriaOestablecimiento?ruc=" +
            this.datosCliente.identificacion
        )
        .then((res) => {
          me.libreria_establecimiento = res.data;
          console.log(me.libreria_establecimiento.length);
          if (me.libreria_establecimiento.length == 1) {
            me.unicaLibOEsta = me.libreria_establecimiento[0];
            me.tabCruces.establecimiento = me.unicaLibOEsta.institucion_id;
            me.tabCruces.direccion = me.unicaLibOEsta.direccionInstitucion;
            me.tabCruces.telefono = me.unicaLibOEsta.telefonoInstitucion;
            me.tabCruces.ruc = this.datosCliente.identificacion;
            me.seleccionNuevaInstitucion = false;
            me.tabCruces.fecha = new Date().toISOString().substr(0, 10);
          } else {
            me.tabCruces.ruc = this.datosCliente.identificacion;
            me.tabCruces.fecha = new Date().toISOString().substr(0, 10);
            me.unicaLibOEsta = [];
            me.seleccionNuevaInstitucion = true;
          }
          this.getcod(me.empresaCobranza.id);
          this.$vs.loading.close();
        })
        .catch(function (error) {
          console.log(error + " error");
          me.$vs.loading.close();
        });
    },
    getcod(empresa) {
      let me = this;
      let letraEmpresa, url;

      // Determinar la letra de la empresa
      if (empresa === 1) {
        letraEmpresa = "P";
      } else if (empresa === 3) {
        letraEmpresa = "C";
      } else {
        letraEmpresa = "";
      }
      url = "getCodigoSecuencial?id=17&empresa=" + empresa;

      // Realizar la solicitud HTTP
      this.$http
        .get(this.$server_url + url)
        .then((response) => {
          if (response.data.status == 0) {
            this.Cerrar("errorCodigo");
          } else {
            const datos = response.data;

            const codigoBase = datos[0];
            const numeroBase = datos[1]; // Asegurar que sea un número
            const numeroSecuencial = parseInt(datos[1]); // Asegurar que sea un número
            // Determinar el prefijo del tipo de venta
            let prefijoVenta = "";

            // Generar el código base con los componentes
            let codigoBaseComponente = `${codigoBase}-${letraEmpresa}-${this.periodoSelect.codigo_contrato}-${this.usuario.iniciales}-${numeroBase}`;

            me.tabCruces.numeroDocumento = codigoBaseComponente;
          }
        })
        .catch((error) => {
          console.error("Error al obtener el código de venta:", error);
          this.Cerrar("errorCodigo");
        });
    },
    validarDescuento() {
      // Verificar si el valor es un número
      if (isNaN(this.tabCruces.descuento)) {
        this.tabCruces.descuento = 0; // Puedes elegir un valor predeterminado o mostrar un mensaje
        this.$vs.notify({
          title: "Error",
          text: "El descuento debe ser un número.",
          color: "error",
        });
        return;
      }

      // Asegurarse de que el número sea entero
      this.tabCruces.descuento = Math.floor(this.tabCruces.descuento);

      // Asegurarse de que el valor no sea negativo
      if (this.tabCruces.descuento < 0) {
        this.tabCruces.descuento = 0;
        this.$vs.notify({
          title: "Error",
          text: "El descuento no puede ser negativo.",
          color: "error",
        });
      }

      // Asegurarse de que el descuento no sea mayor que 100
      if (this.tabCruces.descuento > 100) {
        this.tabCruces.descuento = 100;
        this.$vs.notify({
          title: "Advertencia",
          text: "El descuento no puede ser mayor a 100.",
          color: "warning",
        });
      }
    },
    // Filtrar entradas no válidas
    filtrarEntrada(event) {
      const key = event.key;
      const regex = /[^0-9]/; // Permite solo números

      // Si la tecla presionada es un carácter no numérico, lo bloquea
      if (regex.test(key)) {
        event.preventDefault();
      }
    },
    // Filtrar entradas no válidas
    filtrarEntradaValor(event) {
      const key = event.key;
      const regex = /[^0-9.]/; // Permite números y el punto

      // Verifica si la tecla presionada es válida
      if (regex.test(key)) {
        event.preventDefault();
      }

      // Evita múltiples puntos en la entrada
      const input = event.target.value;
      if (key === "." && input.includes(".")) {
        event.preventDefault();
      }
    },
    validarCantidad(detalle) {
      // Asegurarse de que no sea un valor negativo
      if (detalle.cantidad < 0) {
        detalle.cantidad = 0;
      }
    },
    eliminarItem(index) {
      this.tabDetalles.splice(index, 1);
    },
    agregarItem() {
      this.tabDetalles.push({
        cantidad: 0,
        descripcion: "",
        valorUnitario: 0,
        valorTotal: 0,
      });
    },
    calcularTotalItem(index) {
      let detalle = this.tabDetalles[index];
      return detalle.cantidad * detalle.valorUnitario;
    },
    guardarCruce() {
      let me = this;
      if (me.usarComponenteNuevo) {
        me.tabCruces.notasOfactura = 1;
      }
      if (
        me.seleccionNuevaInstitucion == true &&
        !me.tabCruces.establecimiento
      ) {
        me.$vs.notify({
          title: "Error",
          text: "Debe seleccionar una librería o establecimiento.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }

      // Reiniciar los errores
      me.errores = {
        fecha: false,
        numeroDocumento: false,
        referencia: false,
        descuento: false,
        ruc: false,
        establecimiento: false,
        detalles: [],
        descuento: false,
      };

      // Función para verificar los campos y mostrar el mensaje de error
      const validarCampo = (campo, key, mensaje) => {
        if (
          campo === "" ||
          campo === null ||
          campo === undefined ||
          campo === 0 ||
          campo === "0"
        ) {
          this.errores[key] = true;
          this.$vs.notify({
            title: "Error",
            text: mensaje,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return false;
        }
        return true;
      };
      const validarCampoDescuento = (campo, key, mensaje) => {
        if (
          campo === "" ||
          campo === null ||
          campo === undefined ||
          campo < 0 ||
          campo < "0"
        ) {
          this.errores[key] = true;
          this.$vs.notify({
            title: "Error",
            text: mensaje,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return false;
        }
        return true;
      };
      const validarCampotipo = (campo, nombreCampo, mensaje) => {
        if (campo === null || campo === undefined || campo === "") {
          this.errores[nombreCampo] = true;
          this.$vs.notify({
            title: "Error",
            text: mensaje,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return false;
        }
        return true;
      };

      // Validación de campos antes de enviar el POST
      if (!validarCampo(me.tabCruces.fecha, "fecha", "Debe ingresar la fecha."))
        return;
      if (
        !validarCampotipo(
          me.tabCruces.notasOfactura,
          "notasOfactura",
          "Debe seleccionar el destino."
        )
      )
        return;
      if (
        !validarCampo(
          me.tabCruces.numeroDocumento,
          "numeroDocumento",
          "Debe ingresar el número de documento."
        )
      )
        return;
      if (
        !validarCampo(
          me.tabCruces.referencia,
          "referencia",
          "Debe ingresar la referencia."
        )
      )
        return;
      if (
        !validarCampo(
          me.tabCruces.ruc,
          "ruc",
          "Debe ingresar el RUC del cliente."
        )
      )
        return;
      if (
        !validarCampo(
          me.tabCruces.establecimiento,
          "establecimiento",
          "Debe ingresar el nombre del establecimiento."
        )
      )
        return;

      // Validación de los detalles de los productos o ítems
      if (me.tabDetalles.length === 0) {
        this.$vs.notify({
          title: "Error",
          text: "Debe agregar al menos un detalle.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
        return;
      }

      // for (let i = 0; i < me.tabDetalles.length; i++) {
      //     const item = me.tabDetalles[i];
      //     me.errores.detalles[i] = {
      //         cantidad: false,
      //         descripcion: false,
      //         valorUnitario: false
      //     };
      //     if (!validarCampo(item.cantidad, `detalles[${i}].cantidad`, `Debe ingresar la cantidad para el detalle ${i + 1}.`)) return;
      //     if (!validarCampo(item.descripcion, `detalles[${i}].descripcion`, `Debe ingresar la descripción para el detalle ${i + 1}.`)) return;
      //     if (!validarCampo(item.valorUnitario, `detalles[${i}].valorUnitario`, `Debe ingresar el valor unitario para el detalle ${i + 1}.`)) return;
      // }
      for (let i = 0; i < me.tabDetalles.length; i++) {
        const item = me.tabDetalles[i];

        // Inicializar el objeto de errores si no existe para el índice
        if (!me.errores.detalles[i]) {
          this.$set(me.errores.detalles, i, {
            cantidad: false,
            descripcion: false,
            valorUnitario: false,
          });
        }

        // Validar y establecer errores
        me.errores.detalles[i].cantidad = !item.cantidad || item.cantidad <= 0;
        me.errores.detalles[i].descripcion =
          !item.descripcion ||
          item.descripcion.trim() === "" ||
          item.descripcion.length == 0;
        me.errores.detalles[i].valorUnitario =
          !item.valorUnitario || item.valorUnitario <= 0;

        // Mostrar notificaciones si hay errores
        if (me.errores.detalles[i].cantidad) {
          this.$vs.notify({
            title: "Error",
            text: `Debe ingresar una cantidad válida para el detalle ${i + 1}.`,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return;
        }

        if (me.errores.detalles[i].descripcion) {
          this.$vs.notify({
            title: "Error",
            text: `Debe ingresar una descripción para el detalle ${i + 1}.`,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return;
        }

        if (me.errores.detalles[i].valorUnitario) {
          this.$vs.notify({
            title: "Error",
            text: `Debe ingresar un valor unitario válido para el detalle ${
              i + 1
            }.`,
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          return;
        }
      }
      if (
        !validarCampoDescuento(
          me.tabCruces.descuento,
          "descuento",
          "Debe ingresar el descuento."
        )
      )
        return;

      // Iniciar FormData para enviar los datos del formulario
      let formData = new FormData();

      // Agregar los datos principales
      formData.append("fecha", me.tabCruces.fecha);
      formData.append("numeroDocumento", me.tabCruces.numeroDocumento);
      formData.append("estado", 1);
      formData.append("descuento", me.tabCruces.descuento);

      // Crear un array para los detalles de los productos o ítems
      let detallesArray = [];

      me.tabDetalles.forEach((item, index) => {
        // Crear un objeto JSON con los datos de cada ítem
        let detalle = {
          cantidad: item.cantidad,
          descripcion: item.descripcion,
          valorUnitario: item.valorUnitario,
          valorTotal: me.calcularTotalItem(index), // Calcular el valor total
        };
        detallesArray.push(detalle); // Agregar el objeto al array
      });

      // Agregar el array de detalles como un JSON en el FormData
      formData.append("detalles", JSON.stringify(detallesArray));

      // Agregar los datos del cliente y establecimiento
      formData.append("ruc_cliente", me.tabCruces.ruc);
      formData.append("periodo", me.periodoSelect.idperiodoescolar);
      formData.append("empresa", me.empresa.id);
      formData.append("establecimiento", me.tabCruces.establecimiento);
      formData.append("subtotal", me.calcularSubtotal);
      formData.append("ValorDescuento", me.cacularDescuento);
      formData.append("ValorTOTAL", me.calcularTotal);
      formData.append("usuario", me.usuario.idusuario);
      formData.append("referencia", me.tabCruces.referencia);
      formData.append("tipo", me.tabCruces.notasOfactura);

      // Verificar los datos antes de enviarlos
      console.log("Datos del FormData:");
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.$vs.loading(); // Mostrar el cargador
      this.$http
        .post(me.$server_url + "cruce_registro", formData)
        .then((res) => {
          me.$vs.loading.close(); // Cerrar cargador
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: "danger",
              iconPack: "feather",
              icon: "icon-check",
            });
            me.Cerrar("error-guardado");
          } else {
            me.$vs.notify({
              text: "Se guardó correctamente",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            me.Cerrar("guardado");
          }
        })
        .catch((error) => {
          me.$vs.notify({
            text: "Error al guardar los datos",
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
          });
          me.$vs.loading.close(); // Cerrar el cargador en caso de error
        });
    },
  },
};
</script>

<style scoped>
/* Cambia el color del placeholder */
.placeholder-danger::placeholder {
  color: #eb0600 !important;
  /* Rojo */
  opacity: 1 !important;
  /* Asegura que sea visible */
}

/* Opcional: Cambia el borde también */
.placeholder-danger {
  border-color: #eb0600 !important;
}
.border-danger {
  border: 1px solid #eb0600 !important;
  border-radius: 20px;
  padding: 10px;
}
</style>
