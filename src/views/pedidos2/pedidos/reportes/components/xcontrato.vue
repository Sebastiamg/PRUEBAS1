<template>
  <div>
    <!-- Selector de Asesor -->
    <v-select
      :options="asesoresConTodos"
      :reduce="item => item.id_asesor"
      label="nombre_asesor"
      class="w-full mb-4"
      placeholder="--Seleccione un asesor--"
      v-model="asesorSeleccionado"
    />

    <!-- Mensaje informativo para modo "Todos" -->
    <div v-if="asesorSeleccionado === 'todos'" class="info-message mb-4">
      <div class="alert alert-info">
        <strong>ℹ️ Modo "Todos los asesores" activado:</strong>
        <ul class="mb-0 mt-2">
          <li>Se muestran datos de todos los asesores del período</li>
          <li>Los filtros de fecha y tipo de venta están deshabilitados en este modo</li>
          <li>Se detectarán automáticamente códigos agrupados compartidos entre asesores</li>
        </ul>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-card">
        <label class="filter-label">📅 Filtrar por rango de meses</label>
        <div class="date-range">
          <datepicker
            v-model="filtroFechaInicio"
            :minimumView="'month'"
            :maximumView="'month'"
            :input-class="'datepicker-input'"
            placeholder="Mes inicio"
            :disabled="!asesorSeleccionado || asesorSeleccionado === 'todos'"
          />
          <span class="range-separator">a</span>
          <datepicker
            v-model="filtroFechaFin"
            :minimumView="'month'"
            :maximumView="'month'"
            :input-class="'datepicker-input'"
            placeholder="Mes fin"
            :disabled="!asesorSeleccionado || asesorSeleccionado === 'todos'"
          />
        </div>
      </div>

      <div class="filter-card">
        <label class="filter-label">🛒 Tipo de venta</label>
        <v-select
          style="background-color: #ffffff;"
          :options="['Venta Directa', 'Venta Lista']"
          placeholder="Filtrar tipo"
          v-model="filtroTipoVenta"
          clearable
          :disabled="!asesorSeleccionado || asesorSeleccionado === 'todos'"
        />
      </div>

      <div class="filter-card" style="align-self: center; text-align: center;">
        <vs-button color="success" @click="exportarExcel" icon :disabled="!asesorSeleccionado">
          📥 Exportar Excel
        </vs-button>
      </div>
    </div>

    <!-- Tabla por agrupado -->
    <vs-table :data="agrupadosFiltrados" stripe pagination max-items="10" v-if="asesorSeleccionado && asesorSeleccionado !== null">
      <template slot="thead">
        <vs-th>Información de pedidos</vs-th>
        <vs-th>Agrupado</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr v-for="(grupo, i) in data" :key="grupo.codigo">
          <!-- Tabla de pedidos -->
          <vs-td>
            <div style="max-height: 300px; overflow-y: auto;">
              <table class="tabla-pedidos" style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th width="50%">Pedido detalle</th>
                    <th width="25%">Total Liquidado</th>
                    <th width="25%">Total Liquidado - Comisiones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pedido, j) in grupo.pedidos" :key="j" >
                    <td>
                      <strong>Pedido N°:</strong> {{ pedido.id_pedido }}<br /> 
                      <strong>Periodo:</strong> {{ pedido.id_periodo }}<br />
                      <strong>Institución:</strong> {{ pedido.nombre_institucion }}<br />
                      <strong>Contrato:</strong> {{ pedido.contrato_generado }}<br />
                      <strong>Fecha generación contrato:</strong> {{ pedido.fecha_generacion_contrato }}<br />
                      <vs-button
                        v-if="hasObsequiosForPedido(pedido.id_pedido)"
                        color="danger" type="filled"
                        icon-pack="feather"
                        icon="icon-gift"
                        @click="abrirVentasObsequios(pedido.id_pedido, $event)"
                        class="mt-1"
                      >
                        Ver obsequios
                      </vs-button>
                    </td>
                    <td>
                      {{ pedido.TotalVentaReal }}
                    </td>
                    <td>
                      {{ (pedido.TotalVentaReal - (pedido.TotalVentaReal * pedido.descuento / 100)).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <vs-button 
              type="border" 
              color="primary" 
              icon-pack="feather" 
              icon="icon-search"
              @click="verCodigosContratos(grupo.pedidos, $event)"
              :loading="contratosCargando"
              style="margin-top: 8px; width: 100%;"
            >
              Ver Códigos
            </vs-button>
          </vs-td>

          <!-- Info agrupado -->
          <vs-td>
            <b class="text-primary">🔢 {{ grupo.codigo }}</b> <br />
            <b class="text-info">📋 {{ grupo.tipoVenta }}</b><br />
            <span class="text-muted">📝 {{ grupo.descripcion }}</span> <br />

            <!-- Mensaje de múltiples asesores -->
            <div v-if="grupo.multiplesAsesores && grupo.multiplesAsesores.length > 1" class="mt-2 p-2 bg-warning-light border-warning rounded">
              <div class="text-warning font-bold mb-1">
                ⚠️ Código compartido por múltiples asesores:
              </div>
              <div class="text-sm">
                <span v-for="(asesor, index) in grupo.multiplesAsesores" :key="index">
                  <strong>{{ asesor }}</strong>
                  <span v-if="index < grupo.multiplesAsesores.length - 1">, </span>
                </span>
              </div>
            </div>

            <!-- Mini tabla de totales de VENTAS -->
            <div class="mt-3">
              <h6 class="tabla-titulo">📦 TOTALES DE VENTAS</h6>
              <table class="tabla-totales">
                <thead>
                  <tr>
                    <th width="30%">Tipo</th>
                    <th width="35%">Venta Bruta</th>
                    <th width="35%">Venta Neta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="tipo-row">💰 Proformas</td>
                    <td class="bruta-row">{{ totalVentasBrutasPorCodigo(grupo.codigo) }}</td>
                    <td class="neta-row">{{ totalVentasPorCodigo(grupo.codigo) }}</td>
                  </tr>
                  <tr v-if="hasObsequiosForAgrupado(grupo.codigo)">
                    <td class="tipo-row">🎁 Obsequios</td>
                    <td class="bruta-row">{{ totalObsequiosBrutosPorCodigo(grupo.codigo) }}</td>
                    <td class="neta-row">{{ totalObsequiosPorCodigo(grupo.codigo) }}</td>
                  </tr>
                  <tr class="total-row">
                    <td class="tipo-row"><strong>📊 TOTAL VENTAS</strong></td>
                    <td class="bruta-row"><strong>{{ totalCombinadoBrutoPorCodigo(grupo.codigo) }}</strong></td>
                    <td class="neta-row"><strong>{{ totalCombinadoPorCodigo(grupo.codigo) }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Botón para ver ventas -->
            <vs-button type="border" icon @click="abrirVentas(grupo.codigo, $event)" style="margin-top: 8px; width: 100%;">
              Ver ventas
            </vs-button>

            <!-- Mini tabla de totales de CONTRATOS -->
            <div class="mt-3">
              <h6 class="tabla-titulo">📋 TOTALES DE CONTRATOS</h6>
              <table class="tabla-totales">
                <thead>
                  <tr>
                    <th width="30%">Tipo</th>
                    <th width="35%">Venta Bruta</th>
                    <th width="35%">Venta Neta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="tipo-row">🏦 Liquidaciones</td>
                    <td class="bruta-row">{{ totalLiquidacionesBrutasPorCodigo(grupo.codigo) }}</td>
                    <td class="neta-row">{{ totalLiquidacionesPorCodigo(grupo.codigo) }}</td>
                  </tr>
                  <tr class="total-row">
                    <td class="tipo-row"><strong>📊 TOTAL CONTRATOS</strong></td>
                    <td class="bruta-row"><strong>{{ totalLiquidacionesBrutasPorCodigo(grupo.codigo) }}</strong></td>
                    <td class="neta-row"><strong>{{ totalLiquidacionesPorCodigo(grupo.codigo) }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabla de COMPARACIÓN/DIFERENCIAS -->
            <div class="mt-3">
              <h6 class="tabla-titulo">⚖️ COMPARACIÓN VENTAS vs CONTRATOS</h6>
              <table class="tabla-totales tabla-comparacion">
                <thead>
                  <tr>
                    <th width="30%">Concepto</th>
                    <th width="35%">Diferencia Bruta</th>
                    <th width="35%">Diferencia Neta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="tipo-row">📊 Ventas - Contratos</td>
                    <td class="diferencia-row">{{ diferenciaBrutaPorCodigo(grupo.codigo) }}</td>
                    <td class="diferencia-row">{{ diferenciaNetaPorCodigo(grupo.codigo) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- TOTAL GENERAL (suma de ambas tablas) -->
            <!-- <div class="mt-3">
              <table class="tabla-totales tabla-general">
                <tbody>
                  <tr class="total-row">
                    <td class="tipo-row"><strong>🏷️ TOTAL GENERAL</strong></td>
                    <td class="bruta-row"><strong>{{ totalGeneralBrutoPorCodigo(grupo.codigo) }}</strong></td>
                    <td class="neta-row"><strong>{{ totalGeneralNetoPorCodigo(grupo.codigo) }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div> -->

            
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <!-- Popup de ventas -->
    <vs-popup
      v-model="popupVentasVisible"
      :anchor="popupAnchor"
      max-width="600"
      :title="`📦 Ventas del agrupado ${agrupadoActual}`"
      :active.sync="popupVentasVisible"
    >
      <div style="padding: 16px; max-width: 600px;">
        <p class="text-success font-bold mb-2">
          💰 Total ventas: {{ totalVentasMostradas }}
        </p>

        <vs-table :data="ventasMostradas" stripe v-if="ventasMostradas.length">
          <template slot="thead">
            <vs-th>Código venta</vs-th>
            <vs-th>Valor</vs-th>
          </template>
          <template slot-scope="{ data }">
            <vs-tr v-for="(venta, i) in data" :key="i">
              <vs-td>{{ venta.ven_codigo }}</vs-td>
              <vs-td>{{ formatMoneda(venta.ven_valor) }}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <div v-else>No hay ventas para este agrupado.</div>

        <vs-button color="primary" @click="popupVentasVisible = false" style="margin-top: 12px;">
          Cerrar
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup de ventas obsequios -->
    <vs-popup
      v-model="popupObsequiosVisible"
      :anchor="popupAnchor"
      max-width="600"
      :title="`🎁 Ventas de obsequios del pedido ${pedidoActual}`"
      :active.sync="popupObsequiosVisible"
    >
      <div style="padding: 16px; max-width: 600px;">
        <p class="text-success font-bold mb-2">
          💰 Total obsequios: {{ totalObsequiosMostrados }}
        </p>

        <vs-table :data="obsequiosMostrados" stripe v-if="obsequiosMostrados.length">
          <template slot="thead">
            <vs-th>Código venta</vs-th>
            <vs-th>Valor</vs-th>
          </template>
          <template slot-scope="{ data }">
            <vs-tr v-for="(venta, i) in data" :key="i">
              <vs-td>{{ venta.ven_codigo }}</vs-td>
              <vs-td>{{ formatMoneda(venta.ven_valor) }}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <div v-else>No hay ventas de obsequios para este pedido.</div>

        <vs-button color="primary" @click="popupObsequiosVisible = false" style="margin-top: 12px;">
          Cerrar
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup de códigos de contratos -->
    <vs-popup
      v-model="popupCodigosVisible"
      :anchor="popupAnchor"
      max-width="800"
      :title="`📋 Códigos de Contratos`"
      :active.sync="popupCodigosVisible"
    >
      <div style="padding: 16px; max-width: 800px;">
        <div v-if="contratosCargando" class="text-center">
          <div class="loading-container">
            <div class="vs-loading-container">
              <div class="vs-loading">
                <div class="vs-loading__load"></div>
              </div>
            </div>
            <p class="mt-2">Cargando códigos...</p>
          </div>
        </div>
        
        <div v-else>
          <p class="text-info font-bold mb-3">
            📊 Total códigos encontrados: {{ codigosMostrados.length }}
          </p>
          <p class="text-success font-bold mb-3" v-if="totalPfnPvp > 0">
            💰 Total PFN PVP: {{ formatMoneda(totalPfnPvp) }}
          </p>

          <vs-table :data="codigosMostrados" stripe v-if="codigosMostrados.length">
            <template slot="thead">
              <vs-th>Contrato</vs-th>
              <vs-th>Período</vs-th>
              <vs-th>Código</vs-th>
              <vs-th>PVP</vs-th>
              <vs-th>Tipo</vs-th>
            </template>
            <template slot-scope="{ data }">
              <vs-tr v-for="(codigo, i) in data" :key="i" :class="codigo.esRegalo ? 'row-regalo' : ''">
                <vs-td>{{ codigo.contrato }}</vs-td>
                <vs-td>{{ codigo.periodo }}</vs-td>
                <vs-td>{{ codigo.codigo }}</vs-td>
                <vs-td>{{ formatMoneda(codigo.pfn_pvp) }}</vs-td>
                <vs-td>
                  <vs-chip 
                    :color="codigo.esRegalo ? 'danger' : 'success'" 
                    :text="codigo.esRegalo ? 'white' : 'white'"
                  >
                    {{ codigo.esRegalo ? '🎁 REGALADO' : '✅ NORMAL' }}
                  </vs-chip>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
          <div v-else>No hay códigos para mostrar.</div>
        </div>

        <vs-button color="primary" @click="cerrarPopupCodigos" style="margin-top: 12px;">
          Cerrar
        </vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Datepicker from 'vuejs-datepicker';
import "vue-select/dist/vue-select.css";
import * as XLSX from 'xlsx';

export default {
  name: "xcontrato",
  components: {
    "v-select": vSelect,
    Datepicker,
  },
  props: {
    periodo_id: Number,
    nombrePeriodo: String,
    periodoSelect: Object,
  },
  data() {
    return {
      rawData: [],
      asesorSeleccionado: null,
      filtroFechaInicio: null,
      filtroFechaFin: null,
      filtroTipoVenta: '',
      popupVentasVisible: false,
      popupObsequiosVisible: false,
      popupCodigosVisible: false,
      popupAnchor: null,
      agrupadoActual: null,
      pedidoActual: null,
      ventasMostradas: [],
      obsequiosMostrados: [],
      codigosMostrados: [],
      contratosCargando: false,
      totalPfnPvp: 0,
    };
  },
  computed: {
    asesores() {
      return this.rawData.map(item => ({
        id_asesor: item.id_asesor,
        nombre_asesor: item.nombre_asesor,
      }));
    },
    asesoresConTodos() {
      const asesoresList = this.asesores;
      return [
        { id_asesor: 'todos', nombre_asesor: '📋 TODOS LOS ASESORES' },
        ...asesoresList
      ];
    },
    codigosCompartidos() {
      // Crear un mapa de códigos agrupados y los asesores que los tienen
      const codigoMap = {};
      
      this.rawData.forEach(asesor => {
        asesor.pedidos.forEach(pedido => {
          const codigo = pedido.ca_codigo_agrupado;
          if (!codigoMap[codigo]) {
            codigoMap[codigo] = [];
          }
          if (!codigoMap[codigo].some(a => a.id === asesor.id_asesor)) {
            codigoMap[codigo].push({
              id: asesor.id_asesor,
              nombre: asesor.nombre_asesor
            });
          }
        });
      });
      
      return codigoMap;
    },
    agrupadosFiltrados() {
      if (this.asesorSeleccionado === 'todos') {
        return this.obtenerAgrupadosTodos();
      } else {
        return this.obtenerAgrupadosAsesor();
      }
    },
    ventasPorAgrupado() {
      if (this.asesorSeleccionado === 'todos') {
        const ventasMap = {};
        const ventasYaProcesadas = new Set(); // Para evitar duplicados
        
        this.rawData.forEach(asesor => {
          if (asesor.ventasAgrupadas) {
            asesor.ventasAgrupadas.forEach(v => {
              // Evitar procesar la misma venta múltiples veces
              if (ventasYaProcesadas.has(v.ven_codigo)) {
                return;
              }
              ventasYaProcesadas.add(v.ven_codigo);

              const prof = asesor.proformas && asesor.proformas.find(pf => pf.prof_id === v.ven_idproforma);
              const codigo = prof ? prof.idPuntoventa : null;
              if (!codigo) return;

              if (!ventasMap[codigo]) ventasMap[codigo] = [];

              ventasMap[codigo].push({
                ven_codigo: v.ven_codigo,
                ven_valor: parseFloat(v.ven_valor || 0),
                ven_subtotal: parseFloat(v.ven_subtotal || 0),
              });
            });
          }
        });
        return ventasMap;
      } else {
        const asesor = this.rawData.find(a => a.id_asesor === this.asesorSeleccionado);
        if (!asesor) return {};

        const ventasMap = {};
        asesor.ventasAgrupadas.forEach(v => {
          const prof = asesor.proformas.find(pf => pf.prof_id === v.ven_idproforma);
          const codigo = prof ? prof.idPuntoventa : null;
          if (!codigo) return;

          if (!ventasMap[codigo]) ventasMap[codigo] = [];

          ventasMap[codigo].push({
            ven_codigo: v.ven_codigo,
            ven_valor: parseFloat(v.ven_valor || 0),
            ven_subtotal: parseFloat(v.ven_subtotal || 0),
          });
        });

        return ventasMap;
      }
    },
    obsequiosPorAgrupado() {
      if (this.asesorSeleccionado === 'todos') {
        const obsequiosMap = {};
        const obsequiosYaProcesados = new Set(); // Para evitar duplicados
        
        this.rawData.forEach(asesor => {
          if (asesor.ventasObsequioIndependientes) {
            asesor.ventasObsequioIndependientes.forEach(v => {
              // Evitar procesar el mismo obsequio múltiples veces
              if (obsequiosYaProcesados.has(v.ven_codigo)) {
                return;
              }
              obsequiosYaProcesados.add(v.ven_codigo);

              const pedido = asesor.pedidos && asesor.pedidos.find(p => p.id_pedido === v.id_pedido);
              const codigo = pedido ? pedido.ca_codigo_agrupado : null;
              if (!codigo) return;

              if (!obsequiosMap[codigo]) obsequiosMap[codigo] = [];

              obsequiosMap[codigo].push({
                ven_codigo: v.ven_codigo,
                ven_valor: parseFloat(v.ven_valor || 0),
                ven_subtotal: parseFloat(v.ven_subtotal || 0),
                id_pedido: v.id_pedido,
              });
            });
          }
        });
        return obsequiosMap;
      } else {
        const asesor = this.rawData.find(a => a.id_asesor === this.asesorSeleccionado);
        if (!asesor) return {};

        const obsequiosMap = {};
        asesor.ventasObsequioIndependientes.forEach(v => {
          const pedido = asesor.pedidos.find(p => p.id_pedido === v.id_pedido);
          const codigo = pedido ? pedido.ca_codigo_agrupado : null;
          if (!codigo) return;

          if (!obsequiosMap[codigo]) obsequiosMap[codigo] = [];

          obsequiosMap[codigo].push({
            ven_codigo: v.ven_codigo,
            ven_valor: parseFloat(v.ven_valor || 0),
            ven_subtotal: parseFloat(v.ven_subtotal || 0),
            id_pedido: v.id_pedido,
          });
        });

        return obsequiosMap;
      }
    },
    totalVentasMostradas() {
      return this.formatMoneda(
        this.ventasMostradas.reduce((sum, v) => sum + v.ven_valor, 0)
      );
    },
    totalObsequiosMostrados() {
      return this.formatMoneda(
        this.obsequiosMostrados.reduce((sum, v) => sum + v.ven_valor, 0)
      );
    },
    nombreAsesorSeleccionado() {
      if (this.asesorSeleccionado === 'todos') {
        return "TODOS_LOS_ASESORES";
      }
      const asesor = this.asesores.find(a => a.id_asesor === this.asesorSeleccionado);
      return asesor ? asesor.nombre_asesor : "SinAsesor";
    },
  },
  methods: {
    obtenerAgrupadosAsesor() {
      const asesor = this.rawData.find(a => a.id_asesor === this.asesorSeleccionado);
      if (!asesor) return [];

      const agrupados = {};

      asesor.pedidos.forEach(p => {
        const fecha = new Date(p.fecha_generacion_contrato);
        const mesAnio = fecha.getFullYear() * 100 + fecha.getMonth();

        let inicio = null;
        let fin = null;
        if (this.filtroFechaInicio) {
          inicio = this.filtroFechaInicio.getFullYear() * 100 + this.filtroFechaInicio.getMonth();
        }
        if (this.filtroFechaFin) {
          fin = this.filtroFechaFin.getFullYear() * 100 + this.filtroFechaFin.getMonth();
        }

        const coincideMes =
          !inicio && !fin
            ? true
            : inicio !== null && fin !== null
              ? mesAnio >= inicio && mesAnio <= fin
              : inicio !== null
                ? mesAnio >= inicio
                : fin !== null
                  ? mesAnio <= fin
                  : true;

        const tipoVenta = p.ca_tipo_pedido == '1' ? 'Venta Directa' : 'Venta Lista';
        const coincideTipo = !this.filtroTipoVenta || tipoVenta === this.filtroTipoVenta;

        if (!coincideMes || !coincideTipo) return;

        const codigo = p.ca_codigo_agrupado;
        const descripcion = p.ca_descripcion;

        if (!agrupados[codigo]) {
          agrupados[codigo] = {
            codigo,
            descripcion,
            tipoVenta,
            pedidos: [],
            multiplesAsesores: this.codigosCompartidos[codigo] && this.codigosCompartidos[codigo].map(a => a.nombre) || []
          };
        }

        agrupados[codigo].pedidos.push({
          id_pedido: p.id_pedido,
          contrato_generado: p.contrato_generado || "N/D",
          fecha_generacion_contrato: p.fecha_generacion_contrato || "N/D",
          nombre_institucion: p.nombre_institucion,
          TotalVentaReal: p.TotalVentaReal || "0.00",
          descuento: p.descuento || 0,
          id_periodo: p.id_periodo || "N/D",
        });
      });

      return Object.values(agrupados);
    },
    obtenerAgrupadosTodos() {
      const agrupados = {};

      this.rawData.forEach(asesor => {
        asesor.pedidos.forEach(p => {
          const fecha = new Date(p.fecha_generacion_contrato);
          const mesAnio = fecha.getFullYear() * 100 + fecha.getMonth();

          let inicio = null;
          let fin = null;
          if (this.filtroFechaInicio) {
            inicio = this.filtroFechaInicio.getFullYear() * 100 + this.filtroFechaInicio.getMonth();
          }
          if (this.filtroFechaFin) {
            fin = this.filtroFechaFin.getFullYear() * 100 + this.filtroFechaFin.getMonth();
          }

          const coincideMes =
            !inicio && !fin
              ? true
              : inicio !== null && fin !== null
                ? mesAnio >= inicio && mesAnio <= fin
                : inicio !== null
                  ? mesAnio >= inicio
                  : fin !== null
                    ? mesAnio <= fin
                    : true;

          const tipoVenta = p.ca_tipo_pedido == '1' ? 'Venta Directa' : 'Venta Lista';
          const coincideTipo = !this.filtroTipoVenta || tipoVenta === this.filtroTipoVenta;

          if (!coincideMes || !coincideTipo) return;

          const codigo = p.ca_codigo_agrupado;
          const descripcion = p.ca_descripcion;

          if (!agrupados[codigo]) {
            agrupados[codigo] = {
              codigo,
              descripcion,
              tipoVenta,
              pedidos: [],
              multiplesAsesores: this.codigosCompartidos[codigo] && this.codigosCompartidos[codigo].map(a => a.nombre) || []
            };
          }

          // Evitar duplicados de pedidos
          const yaExiste = agrupados[codigo].pedidos.some(pedido => pedido.id_pedido === p.id_pedido);
          if (!yaExiste) {
            agrupados[codigo].pedidos.push({
              id_pedido: p.id_pedido,
              contrato_generado: p.contrato_generado || "N/D",
              fecha_generacion_contrato: p.fecha_generacion_contrato || "N/D",
              nombre_institucion: p.nombre_institucion,
              TotalVentaReal: p.TotalVentaReal || "0.00",
              descuento: p.descuento || 0,
              id_periodo: p.id_periodo || "N/D",
            });
          }
        });
      });

      return Object.values(agrupados);
    },
    async getContratosDetalle() {
      this.$vs.loading();
      try {
        const { data } = await this.$http.get(`${this.$server_url}getDetallePorAsesor`, {
          params: { periodo_id: this.periodo_id },
        });
        this.rawData = data;
        this.$vs.loading.close();
      } catch (error) {
        console.error("Error al obtener datos:", error);
        this.$vs.notify({
          title: "Error",
          text: "No se pudieron obtener los datos.",
          color: "danger",
          position: "top-right",
        });
        this.$vs.loading.close();
      }
    },
    abrirVentas(codigoAgrupado, event) {
      this.agrupadoActual = codigoAgrupado;
      this.ventasMostradas = this.ventasPorAgrupado[codigoAgrupado] || [];
      this.popupAnchor = event.currentTarget;
      this.popupVentasVisible = true;
    },
    abrirVentasObsequios(idPedido, event) {
      this.pedidoActual = idPedido;
      
      if (this.asesorSeleccionado === 'todos') {
        // Buscar obsequios en todos los asesores, evitando duplicados
        const obsequiosTodos = [];
        const obsequiosYaProcesados = new Set();
        
        this.rawData.forEach(asesor => {
          if (asesor.ventasObsequioIndependientes) {
            const obsequiosAsesor = asesor.ventasObsequioIndependientes
              .filter(v => v.id_pedido === idPedido && !obsequiosYaProcesados.has(v.ven_codigo))
              .map(v => {
                obsequiosYaProcesados.add(v.ven_codigo);
                return {
                  ven_codigo: v.ven_codigo,
                  ven_valor: parseFloat(v.ven_valor || 0),
                };
              });
            obsequiosTodos.push(...obsequiosAsesor);
          }
        });
        this.obsequiosMostrados = obsequiosTodos;
      } else {
        const asesor = this.rawData.find(a => a.id_asesor === this.asesorSeleccionado);
        this.obsequiosMostrados = asesor.ventasObsequioIndependientes
          .filter(v => v.id_pedido === idPedido)
          .map(v => ({
            ven_codigo: v.ven_codigo,
            ven_valor: parseFloat(v.ven_valor || 0),
          }));
      }
      
      this.popupAnchor = event.currentTarget;
      this.popupObsequiosVisible = true;
    },
    async verCodigosContratos(pedidos, event) {
      this.contratosCargando = true;
      this.codigosMostrados = [];
      this.totalPfnPvp = 0;
      this.popupAnchor = event.currentTarget;
      this.popupCodigosVisible = true;

      try {
        // Extraer todos los contratos únicos de los pedidos con sus períodos
        const contratosConPeriodo = [];
        const contratosUnicos = new Set();
        
        pedidos.forEach(pedido => {
          const contrato = pedido.contrato_generado;
          const periodo = pedido.id_periodo;
          
          if (contrato && contrato !== 'N/D' && periodo && periodo !== 'N/D') {
            const key = `${contrato}_${periodo}`;
            if (!contratosUnicos.has(key)) {
              contratosUnicos.add(key);
              contratosConPeriodo.push({
                contrato: contrato,
                periodo: periodo
              });
            }
          }
        });
        
        if (contratosConPeriodo.length === 0) {
          this.$vs.notify({
            title: "Sin contratos",
            text: "No hay contratos válidos con período en esta fila.",
            color: "warning",
            position: "top-right",
          });
          this.contratosCargando = false;
          this.$vs.loading.close();
          return;
        }

        // Crear promesas para cada contrato con su período
        const promesasContratos = contratosConPeriodo.map(item => 
          this.$http.get(`${this.$server_url}codigosXcontrato`, {
            params: { 
              id_contrato: item.contrato,
              id_periodo: item.periodo
            }
          }).then(response => ({
            contrato: item.contrato,
            periodo: item.periodo,
            codigos: response.data || []
          })).catch(error => {
            console.error(`Error al obtener códigos del contrato ${item.contrato} período ${item.periodo}:`, error);
            return {
              contrato: item.contrato,
              periodo: item.periodo,
              codigos: []
            };
          })
        );

        // Ejecutar todas las promesas
        const resultados = await Promise.all(promesasContratos);
        
        // Procesar los resultados
        const todosLosCodigos = [];
        let sumaTotal = 0;
        
        resultados.forEach(resultado => {
          resultado.codigos.forEach(codigo => {
            // Determinar si es regalo según las condiciones
            const esRegalo = codigo.prueba_diagnostico == 0 && codigo.estado_liquidacion == 2;
            
            // Sumar pfn_pvp si existe
            const pfnPvp = parseFloat(codigo.pfn_pvp || 0);
            sumaTotal += pfnPvp;
            
            todosLosCodigos.push({
              contrato: resultado.contrato,
              periodo: resultado.periodo,
              codigo: codigo.codigo || codigo.cod_codigo || 'N/D',
              descripcion: codigo.descripcion || codigo.cod_descripcion || 'Sin descripción',
              esRegalo: esRegalo,
              tipoDetalle: esRegalo ? 'Regalo' : 'Normal',
              pfn_pvp: pfnPvp,
              prueba_diagnostico: codigo.prueba_diagnostico,
              estado_liquidacion: codigo.estado_liquidacion,
              // Agregar campos adicionales si existen
              ...codigo
            });
          });
        });

        this.codigosMostrados = todosLosCodigos;
        this.totalPfnPvp = sumaTotal;
        
        if (todosLosCodigos.length === 0) {
          this.$vs.notify({
            title: "Sin códigos",
            text: "No se encontraron códigos para los contratos de esta fila.",
            color: "warning",
            position: "top-right",
          });
        } else {
          this.$vs.notify({
            title: "Códigos cargados",
            text: `Se encontraron ${todosLosCodigos.length} códigos. Total PVP: ${this.formatMoneda(sumaTotal)}`,
            color: "success",
            position: "top-right",
          });
        }

      } catch (error) {
        console.error("Error al obtener códigos de contratos:", error);
        this.$vs.notify({
          title: "Error",
          text: "Error al obtener los códigos de los contratos.",
          color: "danger",
          position: "top-right",
        });
      } finally {
        this.contratosCargando = false;
      }
    },
    cerrarPopupCodigos() {
      this.popupCodigosVisible = false;
      this.codigosMostrados = []; // Limpiar datos cuando se cierra
      this.totalPfnPvp = 0; // Limpiar total
      this.contratosCargando = false;
    },
    hasObsequiosForPedido(idPedido) {
      if (this.asesorSeleccionado === 'todos') {
        return this.rawData.some(asesor => 
          asesor.ventasObsequioIndependientes && 
          asesor.ventasObsequioIndependientes.some(v => v.id_pedido === idPedido)
        );
      } else {
        const asesor = this.rawData.find(a => a.id_asesor === this.asesorSeleccionado);
        if (!asesor) return false;
        return asesor.ventasObsequioIndependientes && asesor.ventasObsequioIndependientes.some(v => v.id_pedido === idPedido);
      }
    },
    hasObsequiosForAgrupado(codigo) {
      return !!this.obsequiosPorAgrupado[codigo] && this.obsequiosPorAgrupado[codigo].length > 0;
    },
    totalVentasPorCodigo(codigo) {
      const ventas = this.ventasPorAgrupado[codigo] || [];
      return this.formatMoneda(ventas.reduce((sum, v) => sum + v.ven_valor, 0));
    },
    totalVentasBrutasPorCodigo(codigo) {
      const ventas = this.ventasPorAgrupado[codigo] || [];
      return this.formatMoneda(ventas.reduce((sum, v) => sum + v.ven_subtotal, 0));
    },
    totalLiquidacionesPorCodigo(codigo) {
      // Buscar todos los pedidos de este código agrupado
      const grupo = this.agrupadosFiltrados.find(g => g.codigo === codigo);
      if (!grupo) return this.formatMoneda(0);
      
      const totalLiquidaciones = grupo.pedidos.reduce((sum, pedido) => {
        const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
        const descuento = parseFloat(pedido.descuento) || 0;
        const liquidacion = totalVentaReal - (totalVentaReal * descuento / 100);
        return sum + liquidacion;
      }, 0);
      
      return this.formatMoneda(totalLiquidaciones);
    },
    totalLiquidacionesBrutasPorCodigo(codigo) {
      // Buscar todos los pedidos de este código agrupado - suma del TotalVentaReal sin descuento
      const grupo = this.agrupadosFiltrados.find(g => g.codigo === codigo);
      if (!grupo) return this.formatMoneda(0);
      
      const totalLiquidacionesBrutas = grupo.pedidos.reduce((sum, pedido) => {
        const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
        return sum + totalVentaReal;
      }, 0);
      
      return this.formatMoneda(totalLiquidacionesBrutas);
    },
    totalObsequiosBrutosPorCodigo(codigo) {
      // Para obsequios, el bruto es ven_subtotal y el neto es ven_valor
      const obsequios = this.obsequiosPorAgrupado[codigo] || [];
      return this.formatMoneda(obsequios.reduce((sum, v) => sum + v.ven_subtotal, 0));
    },
    totalCombinadoBrutoPorCodigo(codigo) {
      const ventasBrutas = this.ventasPorAgrupado[codigo] || [];
      const obsequiosBrutos = this.obsequiosPorAgrupado[codigo] || [];
      const totalVentasBrutas = ventasBrutas.reduce((sum, v) => sum + v.ven_subtotal, 0);
      const totalObsequiosBrutos = obsequiosBrutos.reduce((sum, v) => sum + v.ven_subtotal, 0);
      return this.formatMoneda(totalVentasBrutas + totalObsequiosBrutos);
    },
    totalGeneralBrutoPorCodigo(codigo) {
      // Suma de proformas brutas + obsequios brutos + liquidaciones brutas
      const ventasBrutas = this.ventasPorAgrupado[codigo] || [];
      const obsequiosBrutos = this.obsequiosPorAgrupado[codigo] || [];
      
      const totalVentasBrutas = ventasBrutas.reduce((sum, v) => sum + v.ven_subtotal, 0);
      const totalObsequiosBrutos = obsequiosBrutos.reduce((sum, v) => sum + v.ven_subtotal, 0);
      
      // Obtener liquidaciones brutas
      const grupo = this.agrupadosFiltrados.find(g => g.codigo === codigo);
      const totalLiquidacionesBrutas = grupo ? grupo.pedidos.reduce((sum, pedido) => {
        const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
        return sum + totalVentaReal;
      }, 0) : 0;
      
      return this.formatMoneda(totalVentasBrutas + totalObsequiosBrutos + totalLiquidacionesBrutas);
    },
    totalGeneralNetoPorCodigo(codigo) {
      // Suma de proformas netas + obsequios netos + liquidaciones netas
      const ventasNetas = this.ventasPorAgrupado[codigo] || [];
      const obsequiosNetos = this.obsequiosPorAgrupado[codigo] || [];
      
      const totalVentasNetas = ventasNetas.reduce((sum, v) => sum + v.ven_valor, 0);
      const totalObsequiosNetos = obsequiosNetos.reduce((sum, v) => sum + v.ven_valor, 0);
      
      // Obtener liquidaciones netas
      const grupo = this.agrupadosFiltrados.find(g => g.codigo === codigo);
      const totalLiquidacionesNetas = grupo ? grupo.pedidos.reduce((sum, pedido) => {
        const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
        const descuento = parseFloat(pedido.descuento) || 0;
        const liquidacion = totalVentaReal - (totalVentaReal * descuento / 100);
        return sum + liquidacion;
      }, 0) : 0;
      
      return this.formatMoneda(totalVentasNetas + totalObsequiosNetos + totalLiquidacionesNetas);
    },
    diferenciaBrutaPorCodigo(codigo) {
      // Calcular diferencia entre (Proformas + Obsequios) vs Liquidaciones en bruto
      const ventasBrutas = this.ventasPorAgrupado[codigo] || [];
      const obsequiosBrutos = this.obsequiosPorAgrupado[codigo] || [];
      
      const totalVentasBrutas = ventasBrutas.reduce((sum, v) => sum + v.ven_subtotal, 0);
      const totalObsequiosBrutos = obsequiosBrutos.reduce((sum, v) => sum + v.ven_subtotal, 0);
      const totalVentasYObsequiosBrutos = totalVentasBrutas + totalObsequiosBrutos;
      
      // Obtener liquidaciones brutas
      const grupo = this.agrupadosFiltrados.find(g => g.codigo === codigo);
      const totalLiquidacionesBrutas = grupo ? grupo.pedidos.reduce((sum, pedido) => {
        const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
        return sum + totalVentaReal;
      }, 0) : 0;
      
      const diferencia = totalVentasYObsequiosBrutos - totalLiquidacionesBrutas;
      return this.formatMonedaConSigno(diferencia);
    },
    diferenciaNetaPorCodigo(codigo) {
      // Calcular diferencia entre (Proformas + Obsequios) vs Liquidaciones en neto
      const ventasNetas = this.ventasPorAgrupado[codigo] || [];
      const obsequiosNetos = this.obsequiosPorAgrupado[codigo] || [];
      
      const totalVentasNetas = ventasNetas.reduce((sum, v) => sum + v.ven_valor, 0);
      const totalObsequiosNetos = obsequiosNetos.reduce((sum, v) => sum + v.ven_valor, 0);
      const totalVentasYObsequiosNetos = totalVentasNetas + totalObsequiosNetos;
      
      // Obtener liquidaciones netas
      const grupo = this.agrupadosFiltrados.find(g => g.codigo === codigo);
      const totalLiquidacionesNetas = grupo ? grupo.pedidos.reduce((sum, pedido) => {
        const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
        const descuento = parseFloat(pedido.descuento) || 0;
        const liquidacion = totalVentaReal - (totalVentaReal * descuento / 100);
        return sum + liquidacion;
      }, 0) : 0;
      
      const diferencia = totalVentasYObsequiosNetos - totalLiquidacionesNetas;
      return this.formatMonedaConSigno(diferencia);
    },
    totalObsequiosPorCodigo(codigo) {
      const obsequios = this.obsequiosPorAgrupado[codigo] || [];
      return this.formatMoneda(obsequios.reduce((sum, v) => sum + v.ven_valor, 0));
    },
    totalCombinadoPorCodigo(codigo) {
      const ventas = this.ventasPorAgrupado[codigo] || [];
      const obsequios = this.obsequiosPorAgrupado[codigo] || [];
      const totalVentas = ventas.reduce((sum, v) => sum + v.ven_valor, 0);
      const totalObsequios = obsequios.reduce((sum, v) => sum + v.ven_valor, 0);
      return this.formatMoneda(totalVentas + totalObsequios);
    },
    formatMoneda(valor) {
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
      }).format(valor);
    },
    formatMonedaConSigno(valor) {
      const formatted = new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
      }).format(Math.abs(valor));
      
      if (valor > 0) {
        return `+${formatted}`;
      } else if (valor < 0) {
        return `-${formatted}`;
      } else {
        return formatted;
      }
    },
    exportarExcel() {
      if (!this.asesorSeleccionado) {
        alert("Seleccione un asesor para exportar");
        return;
      }
      
      let nombreAsesor = this.nombreAsesorSeleccionado;
      if (this.asesorSeleccionado === 'todos') {
        nombreAsesor = "TODOS_LOS_ASESORES";
      } else {
        const asesor = this.asesores.find(a => a.id_asesor === this.asesorSeleccionado);
        if (!asesor) {
          alert("Asesor no válido");
          return;
        }
        nombreAsesor = asesor.nombre_asesor;
      }

      // 1. Hoja Pedidos por agrupado (detalle pedidos)
      const pedidosData = [];
      this.agrupadosFiltrados.forEach(grupo => {
        grupo.pedidos.forEach(pedido => {
          pedidosData.push({
            "Agrupado": grupo.codigo,
            "Descripción Agrupado": grupo.descripcion,
            "Tipo Venta": grupo.tipoVenta,
            "Múltiples Asesores": grupo.multiplesAsesores && grupo.multiplesAsesores.length > 1 ? grupo.multiplesAsesores.join(', ') : 'No',
            "Pedido N°": pedido.id_pedido,
            "Institución": pedido.nombre_institucion,
            "Contrato": pedido.contrato_generado,
            "Fecha generación contrato": pedido.fecha_generacion_contrato,
            "Total ventas Real": pedido.TotalVentaReal || "0.00",
            "Descuento (%)": pedido.descuento || 0,
            "Total con descuento": ( pedido.TotalVentaReal - (pedido.TotalVentaReal * pedido.descuento / 100)).toFixed(2) * 1 || "0.00",
          });
        });
      });

      // 2. Hoja Resumen agrupados
      const resumenData = this.agrupadosFiltrados.map(grupo => {
        const ventas = this.ventasPorAgrupado[grupo.codigo] || [];
        const obsequios = this.obsequiosPorAgrupado[grupo.codigo] || [];
        const totalVentasNetas = ventas.length > 0 ? ventas.reduce((sum, v) => sum + v.ven_valor, 0).toFixed(2) * 1 : 0;
        const totalVentasBrutas = ventas.length > 0 ? ventas.reduce((sum, v) => sum + v.ven_subtotal, 0).toFixed(2) * 1 : 0;
        const totalObsequiosNetos = obsequios.length > 0 ? obsequios.reduce((sum, v) => sum + v.ven_valor, 0).toFixed(2) * 1 : 0;
        const totalObsequiosBrutos = obsequios.length > 0 ? obsequios.reduce((sum, v) => sum + v.ven_subtotal, 0).toFixed(2) * 1 : 0;
        
        // Calcular total liquidaciones netas y brutas
        const totalLiquidacionesNetas = grupo.pedidos.reduce((sum, pedido) => {
          const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
          const descuento = parseFloat(pedido.descuento) || 0;
          const liquidacion = totalVentaReal - (totalVentaReal * descuento / 100);
          return sum + liquidacion;
        }, 0).toFixed(2) * 1;
        
        const totalLiquidacionesBrutas = grupo.pedidos.reduce((sum, pedido) => {
          const totalVentaReal = parseFloat(pedido.TotalVentaReal) || 0;
          return sum + totalVentaReal;
        }, 0).toFixed(2) * 1;
        
        const totalCombinadoNeto = (totalVentasNetas + totalObsequiosNetos).toFixed(2) * 1;
        const totalCombinadoBruto = (totalVentasBrutas + totalObsequiosBrutos).toFixed(2) * 1;
        
        // Calcular total general (proformas + obsequios + liquidaciones)
        const totalGeneralNeto = (totalVentasNetas + totalObsequiosNetos + totalLiquidacionesNetas).toFixed(2) * 1;
        const totalGeneralBruto = (totalVentasBrutas + totalObsequiosBrutos + totalLiquidacionesBrutas).toFixed(2) * 1;

        return {
          "Agrupado": grupo.codigo,
          "Descripción": grupo.descripcion,
          "Tipo Venta": grupo.tipoVenta,
          "Múltiples Asesores": grupo.multiplesAsesores && grupo.multiplesAsesores.length > 1 ? grupo.multiplesAsesores.join(', ') : 'No',
          // VENTAS
          "Proformas Netas": totalVentasNetas || "0.00",
          "Proformas Brutas": totalVentasBrutas || "0.00",
          "Obsequios Netos": totalObsequiosNetos || "0.00",
          "Obsequios Brutos": totalObsequiosBrutos || "0.00",
          "TOTAL VENTAS NETO": totalCombinadoNeto || "0.00",
          "TOTAL VENTAS BRUTO": totalCombinadoBruto || "0.00",
          // CONTRATOS
          "Liquidaciones Netas": totalLiquidacionesNetas || "0.00",
          "Liquidaciones Brutas": totalLiquidacionesBrutas || "0.00",
          // TOTAL GENERAL
          "TOTAL GENERAL NETO": totalGeneralNeto || "0.00",
          "TOTAL GENERAL BRUTO": totalGeneralBruto || "0.00",
        };
      });

      // 3. Hoja Ventas detalladas (ventas proformas por agrupado)
      const ventasData = [];
      for (const grupo of this.agrupadosFiltrados) {
        const ventas = this.ventasPorAgrupado[grupo.codigo] || [];
        ventas.forEach(v => {
          ventasData.push({
            "Agrupado": grupo.codigo,
            "Descripción Agrupado": grupo.descripcion,
            "Código Venta": v.ven_codigo,
            "Valor": (v.ven_valor.toFixed(2) * 1),
            "Tipo": "Proforma",
          });
        });
      }

      // 4. Hoja Ventas obsequios detalladas
      const obsequiosData = [];
      for (const grupo of this.agrupadosFiltrados) {
        const obsequios = this.obsequiosPorAgrupado[grupo.codigo] || [];
        obsequios.forEach(v => {
          obsequiosData.push({
            "Agrupado": grupo.codigo,
            "Descripción Agrupado": grupo.descripcion,
            "Código Venta": v.ven_codigo,
            "Valor": (v.ven_valor.toFixed(2) * 1),
            "Pedido N°": v.id_pedido,
            "Tipo": "Obsequio",
          });
        });
      }

      // Crear libro Excel y hojas
      const wb = XLSX.utils.book_new();

      // Hoja 1
      const wsPedidos = XLSX.utils.json_to_sheet(pedidosData);
      XLSX.utils.book_append_sheet(wb, wsPedidos, "Pedidos por agrupado");

      // Hoja 2
      const wsResumen = XLSX.utils.json_to_sheet(resumenData);
      XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen agrupados");

      // Hoja 3
      const wsVentas = XLSX.utils.json_to_sheet(ventasData);
      XLSX.utils.book_append_sheet(wb, wsVentas, "Ventas");

      // Hoja 4
      const wsObsequios = XLSX.utils.json_to_sheet(obsequiosData);
      XLSX.utils.book_append_sheet(wb, wsObsequios, "Ventas obsequios");

      // Generar nombre archivo
      const nombreArchivo = `reporte_x_contrato_${nombreAsesor.replace(/\s+/g, "_")}_${this.nombrePeriodo.replace(/\s+/g, "_")}.xlsx`;

      // Exportar
      XLSX.writeFile(wb, nombreArchivo);
    },
  },
  mounted() {
    this.getContratosDetalle();
  },
};
</script>

<style scoped>
.v-select {
  max-width: 400px;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-end;
}

.filter-card {
  background: #f7f9fb;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  min-width: 250px;
  flex: 1;
}

.filter-label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
}

.datepicker-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tabla-pedidos th,
.tabla-pedidos td {
  border-bottom: 1px solid #ccc;
  padding: 6px 8px;
  text-align: left;
}

.tabla-totales {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 0.9em;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.tabla-titulo {
  margin: 0 0 5px 0;
  padding: 5px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.tabla-general {
  border: 2px solid #28a745;
  background-color: #f8fff9;
}

.tabla-totales th {
  background-color: #f8f9fa;
  padding: 8px 10px;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  text-align: center;
  color: #495057;
}

.tabla-totales td {
  padding: 6px 10px;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
}

.tabla-totales .tipo-row {
  text-align: left !important;
  font-weight: 500;
}

.tabla-totales .bruta-row {
  color: #3498db;
  font-weight: 500;
}

.tabla-totales .neta-row {
  color: #2ecc71;
  font-weight: 500;
}

.tabla-totales .total-row {
  background-color: #f8f9fa;
  border-top: 2px solid #dee2e6;
}

.tabla-totales .total-row td {
  font-weight: 600;
}

/* Estilos para tabla de comparación */
.tabla-comparacion {
  border: 2px solid #f39c12;
  background-color: #fef9e7;
}

.tabla-comparacion th {
  background-color: #f39c12;
  color: white;
}

.diferencia-row {
  font-weight: 600;
  text-align: center;
}

/* Colorear según diferencia positiva/negativa */
.diferencia-row:has-text("+") {
  color: #27ae60;
  background-color: #d5f4e6;
}

.diferencia-row:has-text("-") {
  color: #e74c3c;
  background-color: #fadbd8;
}

.font-bold {
  font-weight: bold;
}
.text-success {
  color: #2ecc71;
}
.text-primary {
  color: #3498db;
}
.text-info {
  color: #00bcd4;
}
.text-muted {
  color: #7f8c8d;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-separator {
  font-weight: bold;
  font-size: 1.2em;
  user-select: none;
}

.vs__dropdown-menu {
  z-index: 51001;
}

/* Estilos para el mensaje de advertencia de múltiples asesores */
.bg-warning-light {
  background-color: #fff3cd;
}

.border-warning {
  border: 1px solid #ffc107;
}

.text-warning {
  color: #856404;
}

.rounded {
  border-radius: 0.375rem;
}

/* Estilos para el mensaje informativo */
.info-message .alert {
  padding: 1rem;
  border: 1px solid #bee5eb;
  background-color: #d1ecf1;
  color: #0c5460;
  border-radius: 0.375rem;
}

.info-message .alert ul {
  margin-left: 1.2rem;
}

.info-message .alert li {
  margin-bottom: 0.25rem;
}

/* Estilos para ancho 50/50 de las columnas */
.vs-table tbody tr td:first-child {
  width: 50% !important;
  max-width: 50%;
}

.vs-table tbody tr td:last-child {
  width: 50% !important;
  max-width: 50%;
}

.vs-table thead tr th:first-child {
  width: 50% !important;
}

.vs-table thead tr th:last-child {
  width: 50% !important;
}

/* Estilos para popup de códigos */
.row-regalo {
  background-color: #ffeef0 !important;
}

.row-regalo:hover {
  background-color: #ffe4e6 !important;
}

.loading-container {
  min-height: 100px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.vs-loading-container {
  position: relative;
  width: 40px;
  height: 40px;
}

.vs-loading {
  width: 100%;
  height: 100%;
  position: relative;
}

.vs-loading__load {
  width: 100%;
  height: 100%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>