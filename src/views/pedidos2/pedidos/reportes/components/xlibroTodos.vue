<template>
<div class="mt-5">
    <vs-alert style="height: 150px;">
        <p>* Pedido: Se muestran los pedidos con contratos, incluyendo los alcances.</p>
        <p>* Documentos Venta: muestra un resumen por libro de las prefacturas, notas y actas, restando las devoluciones correspondientes.</p>
        <p>* Despachado Bodega: muestra TODOS los códigos individuales físicos (liquidados, sin liquidar, regalados).</p>
        <p>* Pedido Hijos Docentes: muestra la suma global de pedidos de obsequios (hijos y docentes) aprobados y pendientes.</p>
    </vs-alert>
    <div>
      <p class="mt-2"><b>Total despachos bodega:</b> {{ totalDespachadosBodega }}</p>
    </div>
    <div class="flex justify-center mt-5">
        <b>TIPO DE VENTA:</b>
        <ul class="flex justify-center">
            <li class="radio-item mx-5">
                <input type="radio" v-model="tipoVenta" @change="titleVenta='directa';handleVentaChange();" name="radios1tipoVenta" value="1" id="directa">
                <label for="directa">Directa</label>
            </li>
            <li class="radio-item mx-5">
                <input type="radio" v-model="tipoVenta" @change="titleVenta='lista';handleVentaChange();" name="radios1tipoVenta" value="2" id="lista">
                <label for="lista">Lista</label>
            </li>
            <li class="radio-item mx-5">
                <input type="radio" v-model="tipoVenta" @change="titleVenta='Todo';handleVentaChange();" name="radios1tipoVenta" value="3" id="todo">
                <label for="todo">todo</label>
            </li>
            <!-- Switch para mostrar/ocultar filtros para todos los tipos de venta -->
            <li v-if="tipoVenta" class="switch-container mx-5">
                <label class="switch-label">
                    <input
                        type="checkbox"
                        v-model="showFilters"
                        class="switch-input"
                    >
                    <span class="switch-slider"></span>
                    <span class="switch-text">{{ showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros' }}</span>
                </label>
            </li>
            <li v-if="tipoVenta">
              <vs-button icon="search" class="p-2" @click="getXlibro()">Buscar</vs-button>
            </li>
            <li v-if="tipoVenta && resultados.length > 0">
              <vs-button icon="file_download" color="success" class="p-2 ml-2" @click="activePrompt = true">Exportar</vs-button>
            </li>
        </ul>
    </div>

    <!-- Panel de selección de tipos de institución (visible cuando showFilters es true) -->
    <div v-if="tipoVenta && showFilters" class="filter-panel">
        <div class="filter-header">
            <div class="filter-title-section">
                <div class="filter-icon-wrapper">
                    <i class="fas fa-filter"></i>
                </div>
                <div>
                    <h3 class="filter-title">Configuración de Filtros</h3>
                    <p class="filter-subtitle">Tipos de Institución</p>
                </div>
            </div>
            <div class="filter-actions">
                <button
                    @click="selectAllInstitutions()"
                    class="btn-action btn-select"
                >
                    <i class="fas fa-check-double"></i>
                    <span>Seleccionar Todo</span>
                </button>
                <button
                    @click="unselectAllInstitutions()"
                    class="btn-action btn-unselect"
                >
                    <i class="fas fa-times-circle"></i>
                    <span>Deseleccionar Todo</span>
                </button>
            </div>
        </div>

        <div class="filter-content">
            <div class="filter-info">
                <div class="info-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="info-text">
                    <p><strong>Instrucciones:</strong> Marca los tipos de instituciones que deseas <strong>incluir</strong> en el reporte.</p>
                    <p class="info-note">Por defecto todas están marcadas (incluidas). <strong>Debes seleccionar al menos una institución.</strong> Estos filtros afectarán únicamente a la columna "Despacho Bodega".</p>
                </div>
            </div>

            <div class="institutions-grid">
                <div
                    v-for="institucion in arrayTipoInstituciones"
                    :key="institucion.id"
                    class="institution-card"
                >
                    <label :for="`institucion_${institucion.id}`" class="institution-label">
                        <input
                            type="checkbox"
                            :id="`institucion_${institucion.id}`"
                            :value="institucion.id"
                            v-model="tiposInstitucionIncluir"
                            class="institution-checkbox"
                        >
                        <div class="checkbox-custom">
                            <i class="fas fa-check checkbox-icon"></i>
                        </div>
                        <span class="institution-name">{{ institucion.descripcion }}</span>
                    </label>
                </div>
            </div>

            <div v-if="tiposInstitucionIncluir.length > 0" class="exclusions-summary">
                <p class="exclusions-text">
                    <i class="fas fa-check-circle exclusions-icon" style="color: #10b981;"></i>
                    <strong>Incluidos en el reporte:</strong> {{ getIncludedInstitutionsNames() }}
                </p>
            </div>
        </div>
    </div>

    <div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        <!-- Card Pedido -->
        <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 class="text-gray-600 font-semibold">Total Pedido</h3>
          <p class="text-2xl font-bold text-blue-600">
            {{ currency.format(totalPedidoValor) }}
          </p>
          <p class="text-sm text-gray-500">Cantidad Total: {{ totalPedido }}</p>
          <div class="flex gap-4 mt-2 text-xs">
            <span class="text-gray-600">📚 Individuales: {{ totalPedidoIndividuales }}</span>
            <span class="text-purple-600">📦 Combos: {{ totalPedidoCombos }}</span>
          </div>
        </div>

        <!-- Card Pedido Hijos Docentes -->
        <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 class="text-gray-600 font-semibold">Pedido Hijos Docentes</h3>
          <p class="text-2xl font-bold text-orange-600">
            {{ currency.format(totalPedidoHijosDocentesValor) }}
          </p>
          <p class="text-sm text-gray-500">Cantidad Total: {{ totalPedidoHijosDocentes }}</p>
          <div class="flex gap-4 mt-2 text-xs">
            <span class="text-gray-600">📚 Individuales: {{ totalPedidoHijosDocentesIndividuales }}</span>
            <span class="text-purple-600">📦 Combos: {{ totalPedidoHijosDocentesCombos }}</span>
          </div>
        </div>

        <!-- Card Documentos Venta -->
        <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 class="text-gray-600 font-semibold">Total Documentos Venta</h3>
          <p class="text-2xl font-bold text-green-600">
            {{ currency.format(totalDocumentosVentaValor) }}
          </p>
          <p class="text-sm text-gray-500">Cantidad Total: {{ totalDocumentosVenta }}</p>
          <div class="flex gap-4 mt-2 text-xs">
            <span class="text-gray-600">📚 Individuales: {{ totalDocumentosVentaIndividuales }}</span>
            <span class="text-purple-600">📦 Combos: {{ totalDocumentosVentaCombos }}</span>
          </div>
        </div>

        <!-- Card Despacho Bodega -->
        <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 class="text-gray-600 font-semibold">Total Despacho Bodega</h3>
          <p class="text-2xl font-bold text-red-600">
            {{ currency.format(totalDespachoBodegaValor) }}
          </p>
          <p class="text-sm text-gray-500">Cantidad Total: {{ totalDespachoBodega }}</p>
          <div class="flex gap-4 mt-2 text-xs">
            <span class="text-gray-600">📚 Individuales: {{ totalDespachoBodegaIndividuales }}</span>
            <span class="text-purple-600">📦 Combos: {{ totalDespachoBodegaCombos }}</span>
            <span class="text-orange-500">🔄 En Combo: {{ totalDespachoBodegaConCombos }}</span>
          </div>
        </div>
      </div>

      <!-- Filtros de tipo de producto (Individuales/Combos) -->
      <div v-if="resultados.length > 0" class="flex justify-center mb-4">
          <div class="filter-tipo-producto">
              <b class="mr-4">MOSTRAR:</b>
              <label class="checkbox-item mx-3">
                  <input type="checkbox" v-model="mostrarIndividuales" @change="aplicarFiltroTipoProducto" id="checkIndividuales">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-label">Individuales</span>
              </label>
              <label class="checkbox-item mx-3">
                  <input type="checkbox" v-model="mostrarCombos" @change="aplicarFiltroTipoProducto" id="checkCombos">
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-label">Combos</span>
              </label>
          </div>
      </div>

      <vs-table max-items="10" search pagination :data="resultadosFiltrados">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ resultadosFiltrados.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Codigo</vs-th>
            <vs-th>Nombre</vs-th>
            <vs-th sort-key="pedido">Pedido</vs-th>
            <vs-th sort-key="pedidoHijosDocentes">Pedido Hijos Docentes</vs-th>
            <vs-th sort-key="documentoVenta">Documentos Venta</vs-th>
            <!-- <vs-th>Enviado a Perseo</vs-th> -->
            <vs-th sort-key="despachoBodega">Despacho Bodega</vs-th>
            <vs-th sort-key="despachadoConCombos">Desp. en Combo</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  #{{  tr.idLibro }}<br>
                    {{data[indextr].codigo_liquidacion}}<br>

                </vs-td>
                <vs-td>
                    {{data[indextr].nombrelibro}}<br>
                    <b>Precio:</b>
                    <p>{{ tr.precio }}</p>
                    <b>Serie:</b>
                    <p>{{ tr.nombre_serie }}</p>
                    <!-- Mostrar descripción solo si es combo -->
                    <template v-if="tr.ifcombo == 1">
                        <b>Descripción:</b>
                        <p>{{ tr.pro_descripcion || 'Sin descripción' }}</p>
                        <b>Libros del combo:</b>
                        <p>{{ tr.codigos_combos || 'Sin códigos' }}</p>
                        <b>Libros regalados:</b>
                        <p>{{ tr.codigos_combos_regalado || 'Sin libros regalados' }}</p>
                    </template>
                </vs-td>

                <vs-td>
                    {{ tr.pedido }}
                </vs-td>
                <vs-td>
                    {{ tr.pedidoHijosDocentes }}
                </vs-td>
                <vs-td>
                  {{ tr.documentoVenta }}
                </vs-td>
                <!-- <vs-td>
                  {{ tr.perseo }}
                </vs-td> -->
                <vs-td>
                  {{ tr.despachoBodega }}
                </vs-td>
                <vs-td>
                  <span :class="tr.despachadoConCombos > 0 ? 'text-orange-500 font-semibold' : 'text-gray-400'">{{ tr.despachadoConCombos || 0 }}</span>
                </vs-td>
                <vs-td>
                  <!--boton ver codigos-->
                  <vx-tooltip 
                    :text="tr.ifcombo == 0 ? 'Ver códigos individuales (no incluye combos)' : 'Ver códigos que conforman este combo'" 
                    position="top" 
                    color="primary"
                  >
                    <vs-button 
                      class="p-2" 
                      @click="f_mostrarCodigos(tr)"
                    >
                      <i class="fa-regular fa-address-book"></i> Ver Códigos
                    </vs-button>
                  </vx-tooltip>
                  
                  <!-- Botón para ver TODOS los códigos (individuales + en combos) -->
                  <!-- Solo mostrar si ifcombo = 0 (libros individuales que pueden estar en combos) -->
                  <vx-tooltip 
                    v-if="tr.ifcombo == 0"
                    text="Ver todos los códigos (individuales + incluye los que están dentro de combos)" 
                    position="top" 
                    color="primary"
                  >
                    <vs-button 
                      class="p-2 mt-1" 
                      color="success" 
                      @click="f_mostrarTodosCodigos(tr)"
                    >
                      <i class="fa-solid fa-list"></i> Ver Todos
                    </vs-button>
                  </vx-tooltip>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>

    <!--MODAL PARA EXPORTAR A EXCEL-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearExportFields" @accept="exportToExcel" accept-text="Exportar" @close="clearExportFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="primary" icon-pack="feather" icon="icon-info">
            <span>Se exportarán <b>{{ resultados.length }}</b> registros del reporte de despacho por libro.</span>
        </vs-alert>
        <vs-input v-model="fileName" :placeholder="`Nombre del archivo: ${generateDefaultFileName()}`" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" placeholder="Seleccione el formato" />
    </vs-prompt>
    <!--MODAL PARA MOSTAR EL DETALLE-->
    <vs-popup classContent="popup-example" fullscreen title="Detalle de Códigos Despachados" :active.sync="popupMostrarDetalle">
      <div v-if="popupMostrarDetalle">
        <TableReutilizableVue
          :title="`Códigos Despachados - ${selectedLibroDetalle.nombrelibro || 'Libro'} | Total Códigos: ${totalCodigosDetalle}`"
          :headers="headersDetalle"
          :fieldKeys="fieldKeysDetalle"
          :tableData="arrayDetalle"
          :maxItems="15"
          :ifexportar="1"
          :nombrearchivo="`Codigos_Despachados_${selectedLibroDetalle.codigo_liquidacion || 'Libro'}_${nombrePeriodo}`"
        />
      </div>
    </vs-popup>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
import Generalmix from "../../../../../mixins/Generalmix";
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    mixins: [Generalmix],
    components: {
        "v-select": vSelect,
        TableReutilizableVue
    },
    computed: {
      // Computed para filtrar resultados por tipo de producto
      resultadosFiltrados() {
        if (!this.mostrarIndividuales && !this.mostrarCombos) {
          // Si ambos están desmarcados, mostrar todo
          return this.resultados;
        }
        
        return this.resultados.filter(item => {
          if (this.mostrarIndividuales && this.mostrarCombos) {
            return true; // Mostrar todos
          }
          if (this.mostrarIndividuales && item.ifcombo == 0) {
            return true; // Solo individuales
          }
          if (this.mostrarCombos && item.ifcombo == 1) {
            return true; // Solo combos
          }
          return false;
        });
      },
      totalPedido() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + parseFloat(item.pedido || 0), 0);
      },
      totalPedidoIndividuales() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 0).reduce((acc, item) => acc + parseFloat(item.pedido || 0), 0);
      },
      totalPedidoCombos() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 1).reduce((acc, item) => acc + parseFloat(item.pedido || 0), 0);
      },
      totalDocumentosVenta() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + parseFloat(item.documentoVenta || 0), 0);
      },
      totalDocumentosVentaIndividuales() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 0).reduce((acc, item) => acc + parseFloat(item.documentoVenta || 0), 0);
      },
      totalDocumentosVentaCombos() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 1).reduce((acc, item) => acc + parseFloat(item.documentoVenta || 0), 0);
      },
      totalDespachoBodega() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + parseFloat(item.despachoBodega || 0), 0);
      },
      totalDespachoBodegaIndividuales() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 0).reduce((acc, item) => acc + parseFloat(item.despachoBodega || 0), 0);
      },
      totalDespachoBodegaCombos() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 1).reduce((acc, item) => acc + parseFloat(item.despachoBodega || 0), 0);
      },
      totalDespachoBodegaConCombos() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 0).reduce((acc, item) => acc + parseFloat(item.despachadoConCombos || 0), 0);
      },
      // 💲 Totales en dinero
      totalPedidoValor() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + (parseFloat(item.pedido || 0) * parseFloat(item.precio || 0)), 0);
      },
      totalDocumentosVentaValor() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + (parseFloat(item.documentoVenta || 0) * parseFloat(item.precio || 0)), 0);
      },
      totalDespachoBodegaValor() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + (parseFloat(item.despachoBodega || 0) * parseFloat(item.precio || 0)), 0);
      },
      // 🎁 Totales Pedido Hijos Docentes
      totalPedidoHijosDocentes() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + parseFloat(item.pedidoHijosDocentes || 0), 0);
      },
      totalPedidoHijosDocentesIndividuales() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 0).reduce((acc, item) => acc + parseFloat(item.pedidoHijosDocentes || 0), 0);
      },
      totalPedidoHijosDocentesCombos() {
        return this.resultadosFiltrados.filter(item => item.ifcombo == 1).reduce((acc, item) => acc + parseFloat(item.pedidoHijosDocentes || 0), 0);
      },
      totalPedidoHijosDocentesValor() {
        return this.resultadosFiltrados.reduce((acc, item) => acc + (parseFloat(item.pedidoHijosDocentes || 0) * parseFloat(item.precio || 0)), 0);
      },
      // 👉 Formateo de moneda
      currency() {
        return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
      },
      // 📊 Total de códigos en el detalle (suma de total_libros)
      totalCodigosDetalle() {
        if (!this.arrayDetalle || this.arrayDetalle.length === 0) return 0;
        return this.arrayDetalle.reduce((acc, item) => {
          const total = parseInt(item.total_libros || 0);
          return acc + total;
        }, 0);
      }
    },
    data() {
        return {
            //radios
            tipoVenta: null,
            //datos libros
            arrayLibros: [],
            SelectLibro: null,
            resultados: [],
            totalLibros: 0,
            libro: '',
            ValorTotal: 0,
            titleVenta:'directa',
            mixinIdInicioFormatoNewData: null,
            totalDespachadosBodega: 0,
            arrayTipoInstituciones:[],
            popupMostrarDetalle:false,
            arrayDetalle:[],
            selectedLibroDetalle: {}, // Para almacenar información del libro seleccionado
            // Configuración para la tabla de detalle
            headersDetalle: [
                'Código Proforma',
                 'Total Libros',
                'Nombre Libro',
                'Códigos'
            ],
            fieldKeysDetalle: [
                'codigo_proforma',
                'total_libros',
                'nombrelibro',
                'codigos'
            ],
            tiposInstitucionIncluir: [], // Array para almacenar los IDs de instituciones a incluir (checkeadas)
            showFilters: false, // Controla si se muestran los filtros
            // Variables para filtrar por tipo de producto
            mostrarIndividuales: true, // Por defecto mostrar individuales
            mostrarCombos: true, // Por defecto mostrar combos
            // Variables para exportar
            activePrompt: false,
            fileName: '',
            selectedFormat: 'xlsx',
            formats: ['xlsx', 'xls', 'csv']
        };
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0,
        },
        nombrePeriodo: {
            type: String,
            default: '',
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
      let me = this;
      const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
      if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
      } else {
          console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
      }
      this.getTipoInstitucion();
      // Inicializar nombre de archivo por defecto
      const libroText = this.libro || 'Todos';
      this.fileName = `Despacho X Libro ${libroText}_Venta ${this.titleVenta}_${this.nombrePeriodo}`;
    },
    watch: {
        // Detectar cambios en las instituciones a incluir y limpiar resultados
        tiposInstitucionIncluir: {
            handler(newVal, oldVal) {
                // Solo limpiar si ya hay resultados y hay un cambio real
                if (this.resultados.length > 0 && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    this.clearResults();
                }
            },
            deep: true
        },
        // Actualizar nombre de archivo cuando cambian los valores
        titleVenta() {
            this.updateFileName();
        },
        nombrePeriodo() {
            this.updateFileName();
        },
        libro() {
            this.updateFileName();
        }
    },
    methods: {
        aplicarFiltroTipoProducto() {
            // Validar que al menos uno esté seleccionado
            if (!this.mostrarIndividuales && !this.mostrarCombos) {
                this.$vs.notify({
                    title: 'Advertencia',
                    text: 'Debe seleccionar al menos un tipo de producto',
                    color: 'warning',
                    icon: 'info'
                });
                // Reactivar ambos si intenta desmarca todo
                this.mostrarIndividuales = true;
                this.mostrarCombos = true;
            }
        },
        getTipoInstitucion(){
          let me = this;
          this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
          .then(function (res) {
             me.arrayTipoInstituciones = res.data.data;
             // Marcar todos los checkboxes por defecto
             me.tiposInstitucionIncluir = me.arrayTipoInstituciones.map(inst => inst.id);
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
        },
        handleVentaChange() {
            // Cuando se cambia el tipo de venta, resetear filtros y ejecutar búsqueda
            this.showFilters = false; // Ocultar filtros por defecto
            this.getXlibro(); // Ejecutar búsqueda automáticamente
        },
        selectAllInstitutions() {
            // Seleccionar todas las instituciones para incluir
            this.tiposInstitucionIncluir = this.arrayTipoInstituciones.map(inst => inst.id);
            // Limpiar resultados para evitar confusión
            this.clearResults();
            // Ejecutar búsqueda automáticamente después de seleccionar todo
            if (this.tipoVenta) {
                this.getXlibro();
            }
        },
        unselectAllInstitutions() {
            // Deseleccionar todas las instituciones
            this.tiposInstitucionIncluir = [];
            // Limpiar resultados para evitar confusión
            this.clearResults();

            // Mostrar advertencia sobre la necesidad de seleccionar al menos una institución
            this.$vs.notify({
                title: 'Advertencia',
                text: 'Recuerda seleccionar al menos un tipo de institución antes de buscar',
                color: 'warning',
                icon: 'info'
            });
        },
        clearResults() {
            // Limpiar resultados y totales cuando cambian los filtros
            this.resultados = [];
            this.totalDespachadosBodega = 0;

            // Mostrar mensaje informativo
            if (this.tipoVenta) {
                this.$vs.notify({
                    title: 'Filtros Modificados',
                    text: 'Presiona "Buscar" para actualizar los resultados con los nuevos filtros',
                    color: 'primary',
                    icon: 'info'
                });
            }
        },
        updateFileName() {
            const libroText = this.libro || 'Todos';
            this.fileName = `Despacho X Libro ${libroText}_Venta ${this.titleVenta}_${this.nombrePeriodo}`;
        },
        getIncludedInstitutionsNames() {
            // Obtener los nombres de las instituciones incluidas (marcadas)
            return this.arrayTipoInstituciones
                .filter(inst => this.tiposInstitucionIncluir.includes(inst.id))
                .map(inst => inst.descripcion)
                .join(', ');
        },
        getXlibro() {
            let me = this;
            me.totalDespachadosBodega = 0;
            if (me.tipoVenta == null) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe seleccionar TIPO DE VENTA',
                    color: 'danger'
                })
                return
            }

            // Validar que al menos un tipo de institución esté seleccionado
            if (me.tiposInstitucionIncluir.length === 0) {
                me.$vs.notify({
                    title: 'Error de Validación',
                    text: 'Debe seleccionar al menos un tipo de institución para generar el reporte',
                    color: 'danger',
                    icon: 'warning'
                });
                return;
            }

            me.$vs.loading();
            var  nuevarutaxperiodo = ""
            if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
              // Construir URL con parámetros adicionales para tipos de institución
              let baseUrl = `despachos?XlibroTodos=yes&periodo=${me.periodo_id}&tipoVenta=${me.tipoVenta}&nuevo=0`;

              // Aplicar filtro de instituciones para todos los tipos de venta
              let tiposIncluir = me.tiposInstitucionIncluir;
              baseUrl += `&tipoInstitucionIncluir=${tiposIncluir.join(',')}`;

              nuevarutaxperiodo = baseUrl;
            } else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
              // Construir URL con parámetros adicionales para tipos de institución
              let baseUrl = `despachos?XlibroTodos=yes&periodo=${me.periodo_id}&tipoVenta=${me.tipoVenta}&nuevo=1`;

              // Aplicar filtro de instituciones para todos los tipos de venta
              let tiposIncluir = me.tiposInstitucionIncluir;
              baseUrl += `&tipoInstitucionIncluir=${tiposIncluir.join(',')}`;

              nuevarutaxperiodo = baseUrl;
            }
            // Llamar al endpoint principal y al endpoint de hijos docentes
            Promise.all([
                me.$http.get(me.$server_url + nuevarutaxperiodo),
                me.$http.get(me.$server_url + `obtener_detalle_hijos_docentes_global?periodo=${me.periodo_id}`)
            ])
            .then(function ([resDespachos, resHijosDocentes]) {
                me.resultados = resDespachos.data;
                
                // Combinar datos de hijos docentes con resultados principales
                if (resHijosDocentes.data.status === 200 && resHijosDocentes.data.data) {
                    const hijosDocentesMap = {};
                    
                    // Crear mapa de código_liquidacion -> cantidad
                    resHijosDocentes.data.data.forEach(item => {
                        hijosDocentesMap[item.codigo_liquidacion] = item.pedidoHijosDocentes || 0;
                    });
                    
                    // Agregar pedidoHijosDocentes a cada resultado
                    me.resultados = me.resultados.map(item => ({
                        ...item,
                        pedidoHijosDocentes: hijosDocentesMap[item.codigo_liquidacion] || 0
                    }));
                }
                
                me.$vs.loading.close();
                me.totalDespachadosBodega = me.resultados.reduce(
                    (acc, item) => acc + parseFloat(item.despachoBodega || 0),
                    0
                );
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close();
                me.$vs.notify({
                    title: 'Error',
                    text: 'Error al cargar los datos',
                    color: 'danger'
                });
            })
        },
        limpiar() {
            this.SelectLibro = null
            this.resultados = []
            this.tipoVenta = null
            this.totalLibros = 0
            this.ValorTotal = 0
            this.libro = ''
            this.tiposInstitucionIncluir = this.arrayTipoInstituciones.map(inst => inst.id) // Marcar todas las instituciones por defecto
            this.showFilters = false // Resetear el estado de los filtros a oculto
        },
        exportToExcel() {
            let me = this;

            // Validar que hay datos para exportar
            if (!me.resultadosFiltrados || me.resultadosFiltrados.length === 0) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'No hay datos para exportar',
                    color: 'danger'
                });
                return;
            }

            // Validar nombre de archivo
            if (!me.fileName.trim()) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe ingresar un nombre para el archivo',
                    color: 'danger'
                });
                return;
            }

            // Crear nombre de archivo según el formato solicitado
            const libroText = me.libro || 'Todos';
            let nombrearchivo = `Despacho X Libro ${libroText}_Venta ${me.titleVenta}_${me.nombrePeriodo}`;
            if (me.fileName.trim()) {
                nombrearchivo = me.fileName.trim();
            }

            let headerTitle = [
                'Código',
                'Serie',
                'Nombre del Libro',
                'Precio',
                'Pedido',
                'Pedido Hijos Docentes',
                'Documentos Venta',
                // 'Enviado a Perseo',
                'Despacho Bodega'
            ];

            let headerVal = [
                'codigo_liquidacion',
                'nombre_serie',
                'nombrelibro',
                'precio',
                'pedido',
                'pedidoHijosDocentes',
                'documentoVenta',
                // 'perseo',
                'despachoBodega'
            ];

            me.$vs.loading();

            import('@/vendor/Export2Excel').then(excel => {
                const data = me.formatJson(headerVal, me.resultadosFiltrados);
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: nombrearchivo,
                    autoWidth: true,
                    bookType: me.selectedFormat
                });

                me.clearExportFields();
                me.$vs.loading.close();

                me.$vs.notify({
                    title: 'Éxito',
                    text: 'Archivo exportado correctamente',
                    color: 'success'
                });
            }).catch(error => {
                console.error('Error en la exportación a Excel:', error);
                me.$vs.loading.close();
                me.$vs.notify({
                    title: 'Error',
                    text: 'Error al exportar el archivo',
                    color: 'danger'
                });
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j];
            }));
        },
        clearExportFields() {
            const libroText = this.libro || 'Todos';
            this.fileName = `Despacho X Libro ${libroText}_Venta ${this.titleVenta}_${this.nombrePeriodo}`;
            this.selectedFormat = 'xlsx';
            this.activePrompt = false;
        },
        generateDefaultFileName() {
            const libroText = this.libro || 'Todos';
            return `Despacho X Libro ${libroText}_Venta ${this.titleVenta}_${this.nombrePeriodo}`;
        },
        f_mostrarCodigos(item) {
          let me = this;
          me.arrayDetalle = [];
          me.selectedLibroDetalle = item; // Guardar información del libro seleccionado

          // Construir URL con filtros de instituciones
          let tiposIncluir = me.tiposInstitucionIncluir;
          // Agregar parámetro ifcombo para diferenciar entre libros individuales y combos
          let url = `despachos?codigosDespachadosXLibro=1&periodo=${this.periodo_id}&codigo_liquidacion=${item.codigo_liquidacion}&tipoInstitucionIncluir=${tiposIncluir.join(',')}&ifcombo=${item.ifcombo || 0}`;

          this.$http.get(this.$server_url + url)
          .then(function (res) {
            if(res.data.status == 0){
              me.$vs.notify({
                text: res.data.message,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
              return;
            }
            me.arrayDetalle = res.data;
            
            // Configurar headers dinámicamente según si es combo o no
            if (item.ifcombo == 1) {
              // Headers para combos
              me.headersDetalle = [
                'Código Proforma',
                'Nombre Combo',
                'Código Combo',
                'Códigos en Combo',
                'Total Libros en Combo',
                'Total Combos'
              ];
              me.fieldKeysDetalle = [
                'codigo_proforma',
                'nombrelibro',
                'codigo_combo',
                'codigos',
                'total_libros_en_combo',
                'total_combos'
              ];
            } else {
              // Headers para libros individuales
              me.headersDetalle = [
                'Código Proforma',
                'Total Libros',
                'Nombre Libro',
                'Códigos'
              ];
              me.fieldKeysDetalle = [
                'codigo_proforma',
                'total_libros',
                'nombrelibro',
                'codigos'
              ];
            }
            
            me.popupMostrarDetalle = true;
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
        },
        f_mostrarTodosCodigos(item) {
          let me = this;
          me.arrayDetalle = [];
          me.selectedLibroDetalle = item; // Guardar información del libro seleccionado

          // Construir URL con filtros de instituciones y parámetro verTodos
          let tiposIncluir = me.tiposInstitucionIncluir;
          let url = `despachos?codigosDespachadosXLibro=1&periodo=${this.periodo_id}&codigo_liquidacion=${item.codigo_liquidacion}&tipoInstitucionIncluir=${tiposIncluir.join(',')}&verTodos=1`;

          this.$http.get(this.$server_url + url)
          .then(function (res) {
            if(res.data.status == 0){
              me.$vs.notify({
                text: res.data.message,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
              return;
            }
            me.arrayDetalle = res.data;
            
            // Headers para ver todos los códigos (individuales + combos)
            me.headersDetalle = [
              'Código Proforma',
              'Total Libros',
              'Nombre Libro',
              'Tipo',
              'Código Combo',
              'Códigos'
            ];
            me.fieldKeysDetalle = [
              'codigo_proforma',
              'total_libros',
              'nombrelibro',
              'tipo',
              'codigo_combo',
              'codigos'
            ];
            
            me.popupMostrarDetalle = true;
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
        }
    }
}
</script>

<style scoped>
.flex {
    display: flex;
    gap: 1rem;
    /* Espaciado entre los elementos */
}

.radio-item {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
}

/* Ocultar los radios nativos y usar etiquetas personalizadas */
.radio-item input[type="radio"] {
    display: none;
}

/* Estilos para las etiquetas que imitan los radios */
.radio-item label {
    position: relative;
    padding-left: 30px;
    /* Espacio para el círculo del radio */
    cursor: pointer;
    font-weight: 600;
    transition: color 0.3s ease;
}

/* Crear el círculo personalizado */
.radio-item label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: 2px solid #007bff;
    border-radius: 50%;
    background-color: #fff;
    transition: background-color 0.3s, border-color 0.3s;
}

/* Estilo cuando el radio está seleccionado */
.radio-item input[type="radio"]:checked+label::before {
    background-color: #007bff;
    border-color: #007bff;
}

/* Cambio de color en el texto del label cuando se selecciona */
.radio-item input[type="radio"]:checked+label {
    color: #007bff;
}

/* Estilos de hover y foco */
.radio-item label:hover {
    color: #0056b3;
}

.radio-item input[type="radio"]:focus+label::before {
    border-color: #0056b3;
}

/* Estilos para el switch de filtros */
.switch-container {
    display: flex;
    align-items: center;
}

.switch-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-weight: 600;
    color: #333;
    transition: color 0.3s ease;
}

.switch-input {
    display: none;
}

.switch-slider {
    position: relative;
    width: 50px;
    height: 24px;
    background-color: #cbd5e0;
    border-radius: 24px;
    transition: background-color 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-slider::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-input:checked + .switch-slider {
    background-color: #3b82f6;
}

.switch-input:checked + .switch-slider::before {
    transform: translateX(26px);
}

.switch-text {
    font-size: 14px;
    user-select: none;
    transition: color 0.3s ease;
}

.switch-label:hover .switch-text {
    color: #3b82f6;
}

.switch-input:checked + .switch-slider + .switch-text {
    color: #3b82f6;
}

/* Estilos para el panel de filtros */
.filter-panel {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    margin-top: 24px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.filter-header {
    background: linear-gradient(135deg, #475569 0%, #64748b 100%);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
}

.filter-title-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.filter-icon-wrapper {
    background: rgba(59, 130, 246, 0.2);
    border: 2px solid rgba(59, 130, 246, 0.3);
    border-radius: 8px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-icon-wrapper i {
    font-size: 16px;
    color: #3b82f6;
}

.filter-title {
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin: 0 0 2px 0;
    letter-spacing: -0.025em;
}

.filter-subtitle {
    font-size: 13px;
    color: #cbd5e1;
    margin: 0;
    font-weight: 500;
}

.filter-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn-action {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.btn-action::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.btn-action:hover::before {
    left: 100%;
}

.btn-select {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-color: #2563eb;
}

.btn-select:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.btn-unselect {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    border-color: #ea580c;
}

.btn-unselect:hover {
    background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(234, 88, 12, 0.3);
}

.filter-content {
    padding: 20px;
}

.filter-info {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
}

.info-icon {
    background: #3b82f6;
    color: white;
    border-radius: 6px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
}

.info-text p {
    margin: 0 0 8px 0;
    color: #1e40af;
    font-size: 14px;
    line-height: 1.5;
}

.info-note {
    font-size: 13px !important;
    color: #64748b !important;
    font-style: italic;
}

.institutions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
    margin-bottom: 20px;
}

.institution-card {
    background: white;
    border: 1px solid #f1f5f9;
    border-radius: 6px;
    transition: all 0.3s ease;
    overflow: hidden;
}

.institution-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.institution-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
}

.institution-checkbox {
    display: none;
}

.checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.checkbox-icon {
    color: white;
    font-size: 10px;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
}

.institution-checkbox:checked + .checkbox-custom {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-color: #dc2626;
}

.institution-checkbox:checked + .checkbox-custom .checkbox-icon {
    opacity: 1;
    transform: scale(1);
}

.institution-card:has(.institution-checkbox:checked) {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-color: #ef4444;
}

.institution-name {
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    transition: color 0.3s ease;
    line-height: 1.3;
}

.institution-card:has(.institution-checkbox:checked) .institution-name {
    color: #dc2626;
}

.exclusions-summary {
    margin-top: 12px;
}

.exclusions-text {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 6px;
    padding: 8px 12px;
    margin: 0;
    font-size: 13px;
    color: #92400e;
    display: flex;
    align-items: center;
    gap: 8px;
}

.exclusions-icon {
    color: #f59e0b;
    flex-shrink: 0;
}

/* Iconos Font Awesome para compatibilidad */
.fas {
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
    .filter-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
        padding: 12px 16px;
    }

    .filter-actions {
        width: 100%;
        justify-content: flex-start;
    }

    .filter-content {
        padding: 16px;
    }

    .institutions-grid {
        grid-template-columns: 1fr;
    }

    .filter-info {
        flex-direction: column;
        text-align: center;
    }
}

/* Estilos para el modal de exportar */
.export-options .vs-input-primary {
    margin-bottom: 16px;
}

.export-options .vs-select {
    margin-bottom: 16px;
}

.export-options .vs-alert {
    margin-bottom: 16px;
    border-radius: 8px;
}

/* Estilos para filtros de tipo de producto (Individuales/Combos) */
.filter-tipo-producto {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.checkbox-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    position: relative;
}

.checkbox-item input[type="checkbox"] {
    display: none;
}

.checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e1;
    border-radius: 4px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
}

.checkbox-custom::after {
    content: '✓';
    color: white;
    font-size: 14px;
    font-weight: bold;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
}

.checkbox-item input[type="checkbox"]:checked + .checkbox-custom {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-color: #2563eb;
}

.checkbox-item input[type="checkbox"]:checked + .checkbox-custom::after {
    opacity: 1;
    transform: scale(1);
}

.checkbox-label {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    transition: color 0.3s ease;
}

.checkbox-item:hover .checkbox-label {
    color: #3b82f6;
}

.checkbox-item:hover .checkbox-custom {
    border-color: #3b82f6;
}
</style>

