<template>
  <div>
    <div>
      <vx-tooltip style="display: inline-block;" text="Actualizar pedidos" position="top" color="primary">
        <vs-button class="ml-1" @click="getPedidosGerencia();"><i class="fa-solid fa-rotate-left"></i></vs-button>
      </vx-tooltip>
      <div v-if="listaPendientes.length > 0" style="margin-top: -8px;">
        <!-- BUSCADOR MEJORADO -->
        <vx-card class="mb-4">
          <div class="vx-row">
            <!-- Campo de búsqueda -->
            <div class="vx-col w-full md:w-2/3">
              <vs-input v-model="searchQuery" icon="search" placeholder="Buscar por asesor, escuela o período..."
                class="w-full" />
            </div>

            <!-- Selector de campo específico - Ahora con v-select -->
            <div class="vx-col w-full md:w-1/3">
              <v-select v-model="searchField" :options="opcionesBusqueda" :reduce="opcion => opcion.value" label="text"
                placeholder="Filtrar por..." class="w-full">
              </v-select>
            </div>
          </div>

          <!-- Filtro rápido por tipo (opcional) -->
          <div class="vx-row mt-4">
            <div class="vx-col w-full">
              <vs-radio v-model="filterType" vs-value="all" class="mr-4">
                Todos
              </vs-radio>
              <vs-radio v-model="filterType" vs-value="0" class="mr-4">
                Anticipos
              </vs-radio>
              <vs-radio v-model="filterType" vs-value="1" class="mr-4">
                Convenios
              </vs-radio>
              <vs-radio v-model="filterType" vs-value="2" class="mr-4">
                Comisiones
              </vs-radio>
              <vs-radio v-model="filterType" vs-value="3">
                Obsequios
              </vs-radio>
            </div>
          </div>
        </vx-card>

        <!-- LISTA FILTRADA -->
        <vx-card class="mt-4 mb-4" v-for="(item, index) in filteredPendientes" :key="index">
          <div class="vx-row mr-1">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <div>
                <p v-if="usuario.cedula == 'sgerencia'">#{{ item.pedido_id }}</p>
                <!--ANTICIPO-->
                <div v-if="item.TipoPendiente == 0">
                  <div v-if="item.convenio_anios > 0">
                    <vs-chip color="success">Convenio: {{ item.convenio_anios }} años</vs-chip>
                  </div>
                  <vs-chip color="warning">
                    Anticipo
                  </vs-chip>
                  <br><br>
                  <div>
                    <span>Asesor solicita más <b>anticipo</b></span>
                    <h2 class="mt-1"><small> $</small> {{ item.anticipo_solicitud_for_gerencia }} </h2>
                  </div>
                  <!--SOLICITADO POR EL FACTURADOR EL ANTICIPO PARA QUE APRUEBE-->
                  <div class="flex">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled"
                      @click="ObjectSelected = item; cantidadAprobar = item.anticipo_solicitud_for_gerencia; popupSolicitud = true;">Aprobar</vs-button>
                    <vs-button color="danger" type="border" class="p-2"
                      @click="confirma_aprueba(item, op = 1)">Rechazar</vs-button>
                  </div>
                </div>
                <!--CONVENIO-->
                <div v-if="item.TipoPendiente == 1">
                  <div>
                    <vs-chip color="success">Convenio: {{ item.convenio_anios }} años</vs-chip>
                  </div>
                  <br><br>
                  <div>
                    <span>Asesor solicita más anticipo para el <b>convenio</b></span>
                    <h2 class="mt-1"><small> $</small> {{ item.valor_sugerido }} </h2>
                  </div>
                  <!--SOLICITADO POR GERENCIA  EL ANTICIPO PARA QUE APRUEBE-->
                  <div class="flex">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled"
                      @click="ObjectSelected = item; cantidadAprobar = item.valor_sugerido; popupAprobarConvenio = true;convenioEstado=3;">Aprobar
                    </vs-button>
                    <vs-button color="danger" type="border" class="p-2"
                      @click="ObjectSelected = item; cantidadAprobar = item.valor_sugerido; popupAprobarConvenio = true;convenioEstado=2;comentarioRechazoConvenio=''">Rechazar
                    </vs-button>
                  </div>
                </div>
                <!--COMISION-->
                <div v-if="item.TipoPendiente == 2">
                  <div>
                    <span>Asesor solicita más <b>comisión</b> para la escuela</span>
                    <h2 class="mt-1"><small> </small> {{ item.cantidad_solicitada }} %</h2>
                  </div>
                  <!--SOLICITADO POR GERENCIA EL ANTICIPO PARA QUE APRUEBE-->
                  <div class="flex">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled"
                      @click="tituloModal = 'Solicitud de más comisión'; changeAprobar(item, 1, item.cantidad_solicitada)">Aprobar</vs-button>
                    <vs-button color="danger" type="border" class="p-2"
                      @click="tituloModal = 'Solicitud de más comisión'; changeAprobar(item, 3, 40)">Rechazar
                    </vs-button>
                  </div>
                </div>
                <!--obsequios-->
                <div v-if="item.TipoPendiente == 3">
                  <div>
                    <span>Asesor solicita descuento de <b>obsequios</b> </span>
                    <h2 class="mt-1"><small> </small> {{ item.porcentaje_descuento }} %</h2>
                  </div>
                  <!--SOLICITADO POR GERENCIA EL ANTICIPO PARA QUE APRUEBE-->
                  <div class="flex">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled"
                      @click="tituloModal = 'Solicitud solicitud de descuento de obsequios'; tipoObsequio = 1; changeAprobar(item, null)">Aprobar</vs-button>
                    <vs-button color="danger" type="border" class="p-2"
                      @click="ObjectSelected = item; confirmRechazarPedidoObsequios();">Rechazar</vs-button>
                  </div>
                  <div>
                    <vs-divider>Observación asesor</vs-divider>
                    <div class="flex items-center pb-3">
                      {{ item.observacion }}
                    </div>
                    <vs-divider></vs-divider>
                  </div>
                </div>
                <!--AUTORIZACION CONVENIO CIERRE-->
                <div v-if="item.TipoPendiente == 4">
                  <div>
                    <p>Autorizar valor convenio global <b>${{ item.anticipo_global - item.deuda_convenio }}</b></p>
                    <p style="opacity:0.8;">Autorizar nuevo convenio por <b>cierre</b> </p>
                  </div>
                  <div class="flex mt-3">
                    <vs-button color="success" class="mr-2 p-2" icon="check" type="filled"
                      @click="tituloModal = 'Autorizar convenio'; changeAprobarParametros(item, item.anticipo_global - item.deuda_convenio, 1)">Autorizar</vs-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <!--INFORMACION-->
              <b>Asesor:</b>
              <p> {{ item.nombres }} {{ item.apellidos }} </p>
              <b class="mt-1">Institución:</b>
              <p>{{ item.nombreInstitucion }}</p>
              <b>Ciudad:</b>
              <p>{{ item.nombre_ciudad }}</p>
              <b>Período:</b>
              <p>{{ item.periodo }}</p>
              <b>Fecha solicitud:</b>
              <p> {{ item.fechaCreacionPedido }}</p>
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <!--DETALLE-->
              <vs-divider v-if="item.TipoPendiente != 3">Detalle </vs-divider>
              <vs-divider v-if="item.TipoPendiente == 3">Detalles</vs-divider>
              <!--obsequios-->
              <div v-if="item.TipoPendiente == 3" class="justify-center">
                <div class="w-full">
                  <div class="flex justify-center mb-4">
                    <b class="mr-2">Cant. Libros Obsequios: </b> {{ item.cantidadlibrosObsequios }} <br>
                  </div>
                  <div class="flex justify-center">
                    <vs-button color="success" @click="ObjectSelected = item; popupMostrarLibrosObsequios = true;"
                      style="margin-left: -5px;" type="border"><i class="fa-solid fa-book-open"></i> Ver libros
                      Obsequios</vs-button>
                  </div>
                </div>
                <div class="w-full">
                  <div class="flex justify-center my-4">
                    <b>Cantidad Libros del Contrato:</b>
                  </div>
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr v-for="(valor, serieArea) in item.totalesPorArea" :key="serieArea">
                        <td style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Serie {{ serieArea
                        }}:</td>
                        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;">{{ valor.total }}
                        </td>
                        <td style="text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">
                          <vs-button type="flat" size="small" @click="abrirPopup(serieArea, valor.areas)"><i
                              class="fa-solid fa-eye"></i> Ver libros</vs-button>
                        </td>
                      </tr>
                    </table>
                    <vs-popup :title="'Detalles de la serie ' + serieSeleccionada" :active.sync="popupActivo">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr v-for="(area, index) in areasSeleccionadas" :key="index">
                          <td style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">{{ area.area }}:
                          </td>
                          <td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;">{{ area.valor }}
                          </td>
                        </tr>
                      </table>
                    </vs-popup>
                  </div>
                  <div>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;"><b>TOTAL LIBROS:</b>
                        </td>
                        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;"> {{
                          calcularTotalLibros(item) }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <!--AUTORIZACION CONVENIO CIERRE-->
              <div v-else-if="item.TipoPendiente == 4">
                <vs-list-header title="Datos Convenio Cerrado:"></vs-list-header>
                <b>Valor global:</b>
                <p>{{ item.valor_global }}</p>
                <b>Valor total convenio Pagado:</b>
                <p>{{ item.valor_convenio_pagado }}</p>
                <b>Deuda que queda del convenio:</b>
                <p>{{ item.deuda_convenio }}</p>
                <div v-if="item.otrosValores.length > 0">
                  <b>Años convenio</b>
                  <p>{{ item.otrosValores[0].convenio_anios }}</p>
                </div>
                <vs-list-header color="success" title="Datos Nuevo Convenio:"></vs-list-header>
                <b>Valor global:</b>
                <p>{{ item.anticipo_global }}</p>
                <b>Valor convenio final global (valor global nuevo - la deuda):</b>
                <p>{{ item.anticipo_global - item.deuda_convenio }}</p>
                <b>Años convenio</b>
                <p>{{ item.anios_convenioNuevo }}</p>
              </div>
              <div v-if="item.TipoPendiente != 3 && item.TipoPendiente != 4">
                <vs-button color="success" @click="ObjectSelected = item; popupMostraValoresAnteriores = true;"
                  style="margin-left: -5px;" type="flat">Ver venta anteriores</vs-button>
                <ul class="features">
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor"
                          d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Comisión:</strong> {{ item.descuento }}%</span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor"
                          d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Venta series básicas:</strong> ${{ filtrarDecimal(item.total_series_basicas) }}</span>
                  </li>
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor"
                          d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>Venta bruta:</strong> ${{ filtrarDecimal(item.TotalVentaReal) }}</span>
                  </li>
                </ul>
              </div>
              <!--OBSERVACION ASESOR-->
              <div v-if="item.observacion && item.TipoPendiente != 3">
                <vs-divider>Observación asesor</vs-divider>
                <div class="">
                  {{ item.observacion }}
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
      <vx-card v-else>
        <p>No hay solicitudes pendientes</p>
      </vx-card>
      <!--MODALES-->
      <!--MODAL PARA VER LOS COMENTARIOS DE LA SOLICITUD-->
      <vs-popup class="holamundo" title="Solicitud" :active.sync="popupSolicitud">
        <!--anticipo-->
        <div v-if="ObjectSelected.TipoPendiente == 0">
          <p><b>Anticipo Solicitado:</b> {{ ObjectSelected.anticipo_solicitud_for_gerencia }}</p>
          <p><b>Observación:</b> {{ ObjectSelected.anticipo_solicitud_observacion }}</p>
        </div>
        <vs-divider></vs-divider>
        <div>
          <vx-input-group class="mb-base">
            <template slot="prepend">
              <div class="prepend-text bg-primary">
                <span>Aprobar valor de:</span>
              </div>
            </template>
            <vs-input v-model="cantidadAprobar" type="number" placeholder="Ingrese el valor a aprobar" />
          </vx-input-group>
        </div>
        <div class="flex justify-center">
          <vs-button color="success" v-if="ObjectSelected.TipoPendiente == 0"
            @click="f_aprobar_pago(datoAprobar = ObjectSelected, datoAprobar.op = 0)" type="gradient">Aprobar
            anticipo</vs-button>
        </div>
      </vs-popup>
      <!--MODAL PARA APROBAR CONVENIO-->
      <vs-popup class="holamundo" title="Aprobar Convenio" :active.sync="popupAprobarConvenio">
        <!--convenio-->
        <div>
          <p><b>Convenio Solicitado:</b> {{ ObjectSelected.valor_sugerido }}</p>
          <p><b>Observación:</b> {{ ObjectSelected.observacion_sugerido }}</p>
        </div>
        <vs-divider></vs-divider>
        <div v-if="convenioEstado == 3">
          <vx-input-group class="mb-base">
            <template slot="prepend">
              <div class="prepend-text bg-primary">
                <span>Aprobar valor de:</span>
              </div>
            </template>
            <vs-input v-model="cantidadAprobar" type="number" placeholder="Ingrese el valor a aprobar" />
          </vx-input-group>
        </div>
        <!--obsevacion-->
        <vx-input-group class="mb-base" v-if="convenioEstado == 2">
          <template slot="prepend">
            <div class="prepend-text bg-primary">
              <span>Comentario</span>
            </div>
          </template>
          <vs-input v-model="comentarioRechazoConvenio" type="text" placeholder="Comentario por qué se rechaza" />
        </vx-input-group>
        <div class="flex justify-center">
          <div>
            <vs-button color="success"
              v-if="convenioEstado == 3"
              @click="f_aprobarConvenio()"
              type="gradient">Aprobar Convenio
            </vs-button>
            <vs-button color="danger"
              v-if="convenioEstado == 2"
              @click="f_aprobarConvenio()"
              type="gradient">Rechazar Convenio
            </vs-button>
          </div>
        </div>
      </vs-popup>
      <!--MODALES-->
      <!--MODAL PARA APROBAR COMISION-->
      <vs-popup class="holamundo" :title="tituloModal" :active.sync="popupAprobar">
        <div v-if="popupAprobar">
          <p v-if="ObjectSelected.TipoPendiente == 2"><b>Anticipo Solicitado:</b> {{ ObjectSelected.cantidad_solicitada
          }} %
          </p>
          <p v-if="ObjectSelected.TipoPendiente == 3"><b>Obsequios Solicitado:</b> Porcentaje de descuento {{
            ObjectSelected.porcentaje_descuento }}%</p>
          <div v-if="ObjectSelected.TipoPendiente == 4">
            <p><b>Valor global actual:</b> {{ ObjectSelected.anticipo_global }}</p>
            <p><b>Deuda del cierre de convenio:</b> {{ ObjectSelected.deuda_convenio }}</p>
            <p><b>Valor convenio final:</b> {{ ObjectSelected.anticipo_global - ObjectSelected.deuda_convenio }}</p>
          </div>
          <p class="mt-2"><b>Observación:</b> {{ ObjectSelected.observacion }}</p>
          <vs-divider></vs-divider>
          <div>
            <vx-input-group class="mb-base" v-if="datosGuardar.estado == 1">
              <template slot="prepend">
                <div class="prepend-text bg-primary">
                  <span>Aprobar valor de:</span>
                </div>
              </template>
              <vs-input v-model="datosGuardar.cantidadAprobar" type="number"
                placeholder="Ingrese el porcentaje a aprobar" />
            </vx-input-group>
            <!--anular comision-->
            <vx-input-group class="mb-base" v-if="datosGuardar.estado == 3 && ObjectSelected.TipoPendiente == 2">
              <template slot="prepend">
                <div class="prepend-text bg-primary">
                  <span>Anular comision a %:</span>
                </div>
              </template>
              <vs-input v-model="datosGuardar.cantidadAprobar" type="number"
                placeholder="Ingrese el porcentaje a aprobar" />
            </vx-input-group>
            <!--obsevacion-->
            <vx-input-group class="mb-base" v-if="ObjectSelected.TipoPendiente != 3">
              <template slot="prepend">
                <div class="prepend-text bg-primary">
                  <span>Observación</span>
                </div>
              </template>
              <vs-input v-model="datosGuardar.observacion" type="text" placeholder="Observación" />
            </vx-input-group>
          </div>
          <!--comision-->
          <div class="flex justify-center mt-5" v-if="ObjectSelected.TipoPendiente == 2">
            <vs-button v-if="datosGuardar.estado == 1" color="success" @click="aprobarComision()"
              type="gradient">Aprobar
              Comisión</vs-button>
            <vs-button v-if="datosGuardar.estado == 3" color="danger" @click="aprobarComision()"
              type="gradient">Rechazar
              Comisión</vs-button>
          </div>
          <!--obsequios-->
          <div v-if="ObjectSelected.TipoPendiente == 3">
            <div class="vx-row">
              <div class="vx-col w-full  flex justify-center">
                <ul class="flex">
                  <li>
                    <vs-radio v-model="tipoObsequio" class="mr-5" vs-name="radios1tipoObsequio" vs-value="0">Descuento
                      por
                      institución <b>{{ ObjectSelected.procentaje_institucion }}%</b></vs-radio>
                  </li>
                  <li>
                    <vs-radio v-model="tipoObsequio" vs-name="radios1tipoObsequio" vs-value="1">Descuento
                      100%</vs-radio>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex justify-center mt-5">
              <vs-button color="success" @click="aceptarLibrosObsequios()" type="gradient">Aprobar descuento
                obsequio</vs-button>
            </div>
          </div>
          <!--AUTORIZACION CONVENIO CIERRE-->
          <div class="flex justify-center mt-5" v-if="ObjectSelected.TipoPendiente == 4">
            <vs-button color="success" @click="aprobarComision()" type="gradient">Autorizar</vs-button>
          </div>
        </div>
      </vs-popup>
      <!--MODAL VALORES ANTERIORES-->
      <vs-popup class="holamundo" title="Valores anteriores" :active.sync="popupMostraValoresAnteriores">
        <anticiposAnteriosVue v-if="popupMostraValoresAnteriores" :tmpPedidos="ObjectSelected" />
      </vs-popup>
      <!--MOSTRAR LIBROS DE OBSEQUIO-->
      <vs-popup class="holamundo" title="Ver libros a realizar el descuento" :active.sync="popupMostrarLibrosObsequios">
        <TableObsequiosAprobarVue v-if="popupMostrarLibrosObsequios" :pedidoIdObsequio="ObjectSelected.id" />
      </vs-popup>
    </div>
  </div>
</template>

<script>
const anticiposAnteriosVue = () => import('../../pedidos/components/milton/anticiposAnterios.vue')
const TableObsequiosAprobarVue = () => import('./obsequios/TableObsequiosAprobar.vue')
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import moment from "moment";
export default {
  components: {
    anticiposAnteriosVue,
    TableObsequiosAprobarVue,
    vSelect,
  },
  data() {
    return {
      usuario: [],
      listaPendientes: [],
      datoAprobar: '',
      op: '',
      popupSolicitud: false,
      popupAprobarConvenio: false,
      popupMostraValoresAnteriores: false,
      cantidadAprobar: 0,
      ObjectSelected: {
        id: 0,
        cantidad_solicitada: 0,
        observacion: '',
      },
      datosGuardar: {
        estado: 0,
        cantidadAprobar: 0,
        observacion: '',
      },
      popupAprobar: false,
      tituloModal: '',
      //variables para obsequios
      popupMostrarLibrosObsequios: false,
      tipoObsequio: "0",
      //fin variables para obsequios

      popupActivo: false,
      serieSeleccionada: '',
      areasSeleccionadas: [],
      searchQuery: '',
      searchField: 'all', // 'all', 'asesor', 'escuela', 'periodo'
      filterType: 'all',
      opcionesBusqueda: [
        { value: 'all', text: 'Todos los campos' },
        { value: 'asesor', text: 'Asesor' },
        { value: 'escuela', text: 'Escuela' },
        { value: 'periodo', text: 'Período' }
      ],
      convenioEstado:'', // 3 => aprobar, 2 => rechazar
      comentarioRechazoConvenio:''
    }
  },
  computed: {
    filteredPendientes() {
      let filtered = this.listaPendientes;

      // 1. Filtrado por tipo de pendiente
      if (this.filterType !== 'all') {
        // Si es tipo 1 (Convenios), también incluir tipo 4 (Convenios cerrados)
        if (this.filterType == 1) {
          filtered = filtered.filter(item => item.TipoPendiente == 1 || item.TipoPendiente == 4);
        } else {
          filtered = filtered.filter(item => item.TipoPendiente == this.filterType);
        }
      }

      // 2. Filtrado por búsqueda
      if (this.searchQuery.trim() === '') {
        return filtered;
      }

      const query = this.searchQuery.toLowerCase();
      return filtered.filter(item => {
        // Buscar en el campo específico seleccionado
        switch (this.searchField) {
          case 'asesor':
            return (item.nombres + ' ' + item.apellidos).toLowerCase().includes(query);
          case 'escuela':
            return item.nombreInstitucion.toLowerCase().includes(query);
          case 'periodo':
            return item.periodo.toLowerCase().includes(query);
          default: // 'all' - buscar en todos los campos
            return (
              (item.nombres + ' ' + item.apellidos).toLowerCase().includes(query) ||
              item.nombreInstitucion.toLowerCase().includes(query) ||
              item.periodo.toLowerCase().includes(query)
            );
        }
      });
    }
  },
  mounted() {
    let me = this;
    me.getPedidosGerencia();
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  methods: {
    abrirPopup(serieArea, areas) {
      this.serieSeleccionada = serieArea;
      this.areasSeleccionadas = areas;
      this.popupActivo = true;
    },
    calcularTotalLibros(item) {
      return Object.values(item.totalesPorArea).reduce((acc, curr) => acc + curr.total, 0);
    },
    filtrarDecimal(numero) {
      let me = this
      if (numero == 0 || numero == null) {
        return numero
      } else {
        const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return transformar
      }
    },
    changeAprobar(e, estado, cantidad) {
      let me = this
      me.ObjectSelected = e
      me.datosGuardar.cantidadAprobar = cantidad
      me.datosGuardar.estado = estado
      me.popupAprobar = true
      me.tipoObsequio = 1
    },
    changeAprobarParametros(e, cantidad, estado) {
      let me = this
      me.ObjectSelected = e
      me.datosGuardar.cantidadAprobar = cantidad
      me.datosGuardar.estado = estado
      me.popupAprobar = true
    },
    getPedidosGerencia() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'listaPedidosGerencia')
        .then((res) => {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            return
          }
          me.listaPendientes = res.data
          if (me.listaPendientes.length > 0) {
            //si existe la propiedad otrosValores convertir a JSON.parse
            me.listaPendientes.forEach((item) => {
              if (item.otrosValores) {
                item.otrosValores = JSON.parse(item.otrosValores)
              }
            })
          }

        }).catch((err) => {
          console.log(err)
          me.$vs.loading.close();
        });
    },
    confirma_aprueba(item, tipo) {
      let me = this;
      me.datoAprobar = item;
      me.datoAprobar.op = tipo
      me.$vs.dialog({
        type: 'confirm',
        color: tipo == 0 ? 'success' : 'danger',
        title: 'Confirmar',
        text: tipo == 0 ? '¿Aprobar pago?' : 'Rechazar pago?',
        acceptText: 'Aceptar',
        cancelText: 'Cancelar',
        accept: me.f_aprobar_pago
      })
    },
    f_aprobar_pago() {
      let me = this;
      let msj, color;
      me.datoAprobar.cantidadAprobar = me.cantidadAprobar
      me.datoAprobar.user_created = me.usuario.idusuario
      me.datoAprobar.id_group = me.usuario.id_group
      me.datoAprobar.anticipo_aprobado = me.cantidadAprobar
      me.datoAprobar.id_pedido = me.ObjectSelected.pedido_id
      me.$vs.loading();
      this.$http.post(this.$server_url + 'aprobarPedidoGerencia', me.datoAprobar)
        .then((result) => {
          msj = me.datoAprobar.op == 0 ? 'Pago aprobado correctamente.' : 'Pago rechazado';
          color = me.datoAprobar.op == 0 ? 'success' : 'danger';
          me.f_notificaciones(msj, color, 'icon-alert-triangle')
          me.getPedidosGerencia();
          me.popupSolicitud = false
          me.$vs.loading.close();
        }).catch((err) => {
          console.log(err)
          me.$vs.loading.close();
        });
    },
    f_aprobarConvenio() {
      let me = this;
      let formData = new FormData();
      formData.append('updateCamposDatos', 'yes')
      formData.append('tresCampos', 'yes')
      // rechazar convenio
      if(me.convenioEstado == 2){
        formData.append('campo1', 'convenio_aprobado');
        formData.append('campo2', 'comentario_rechazo');
        formData.append('campo3', 'valor_aprobado_gerencia');
        formData.append('valor1', me.convenioEstado)
        formData.append('valor2', me.comentarioRechazoConvenio);
        formData.append('valor3', 0);
      }
      // aprobar convenio
      else{
        formData.append('campo1', 'anticipo_global');
        formData.append('campo2', 'convenio_aprobado');
        formData.append('campo3', 'valor_aprobado_gerencia');
        formData.append('valor1', me.cantidadAprobar)
        formData.append('valor2', me.convenioEstado)
        formData.append('valor3', me.cantidadAprobar)
      }
      formData.append('convenio_gerencia','1')
      formData.append('user_created', me.usuario.idusuario)
      formData.append('id', me.ObjectSelected.idConvenio);
      formData.append('idConvenio', me.ObjectSelected.idConvenio)

      this.$http.post(this.$server_url + 'convenio', formData)
        .then(res => {
          me.$vs.notify({
            text: 'Se guardo correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.getPedidosGerencia();
          me.popupAprobarConvenio = false
        })
        .catch((e) => {
          // me.$vs.loading.close()
        })
    },
    //COMISION
    aprobarComision() {
      let me = this
      if (me.datosGuardar.cantidadAprobar > 0) {
        const { idusuario, id_group } = me.usuario
        let formData = new FormData()
        formData.append('id', me.ObjectSelected.id)
        formData.append('cantidad_finalizada', me.datosGuardar.cantidadAprobar)
        formData.append('aprobarSolicitud', 1)
        formData.append('id_pedido', me.ObjectSelected.id_pedido)
        formData.append('estado', me.datosGuardar.estado)
        formData.append('observacion_finaliza', me.datosGuardar.observacion)
        formData.append('id_grupo_finaliza', id_group)
        formData.append('user_finaliza', idusuario)
        me.$vs.loading()
        me.$http.post(me.$server_url + 'pedidos_gerencia', formData)
          .then(function (res) {
            me.$vs.loading.close()
            if (res.data.status == 0) {
              me.$vs.notify({
                title: 'Error',
                text: res.data.message,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              })
              return
            }
            me.getPedidosGerencia()
            me.popupAprobar = false
            me.$vs.notify({
              title: 'Exito',
              text: 'Se ha aprobado la comisión',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            //limpiar
            me.datosGuardar.observacion = ''
            me.datosGuardar.cantidadAprobar = 0
            me.ObjectSelected.id = 0
          })
          .catch(function (error) {
            me.$vs.loading.close()
            console.log(error + ' error');
          })
      } else {
        me.$vs.notify({
          title: 'Error',
          text: 'Ingrese un valor mayor a 0',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      }
    },
    //obsequios
    confirmRechazarPedidoObsequios() {
      let me = this;
      me.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirmar',
        text: '¿Estas seguro de rechazar pedido de obsequios?',
        acceptText: 'Aceptar',
        cancelText: 'Cancelar',
        accept: me.CambiarEstadoPedidoLibrosObsequios
      })
    },
    CambiarEstadoPedidoLibrosObsequios() {
      let me = this;
      let formData = new FormData();
      formData.append('id', this.ObjectSelected.id);
      formData.append('estado_libros_obsequios', 2);
      me.$vs.loading();
      this.$http.post(this.$server_url + 'changeEstadoPedidoLibrosObsequios', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          me.$vs.notify({
            text: res.data.message,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.getPedidosGerencia()
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    aceptarLibrosObsequios() {
      let me = this;
      const usuariorespo = localStorage.getItem("usuario");
      const usuarioObjeto = JSON.parse(usuariorespo);
      let porcentajeDescuento;
      if (this.tipoObsequio == 0) {
        porcentajeDescuento = this.ObjectSelected.procentaje_institucion;
      } else if (this.tipoObsequio == 1) {
        porcentajeDescuento = this.ObjectSelected.porcentaje_descuento;
      }
      let formData = new FormData();
      formData.append('id_pedidoLibrosObsequios', me.ObjectSelected.id);
      formData.append('contrato', me.ObjectSelected.contrato_generado);
      formData.append('id_pedido', me.ObjectSelected.id_pedido);
      formData.append('descuento', porcentajeDescuento);
      formData.append('user_created', me.usuario.idusuario);
      formData.append('usuario_aprobador', me.usuario.id_group);
      formData.append('usuario_aprobacion_id', usuarioObjeto.idusuario);
      formData.append('usuario_aprobacion', usuarioObjeto.nombres + ' ' + usuarioObjeto.apellidos);
      me.$vs.loading();
      this.$http.post(this.$server_url + 'AceptarLibrosObsequios', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          me.$vs.notify({
            text: 'Se guardo correctamente',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.getPedidosGerencia()
          me.popupAprobar = false
        })
        .catch(function (error) { me.$vs.loading.close(); me.popupGerenciaAceptar = false; })
    },
    f_notificaciones(msj, color, icono) {
      let me = this;
      me.$vs.notify({
        text: msj,
        color: color,
        iconPack: 'feather',
        icon: icono
      })
      return;
    }
  },
}
</script>
<style scoped>
.features {
  display: flex;
  flex-direction: column;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.features li+* {
  margin-top: 0.75rem;
}

.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

.features .icon svg {
  width: 14px;
  height: 14px;
}

.features+* {
  margin-top: 1.25rem;
}
</style>
