<template>

  <div class="reporte-wrapper">
    <!-- Encabezado Ejecutivo -->
    <div class="reporte-header">
      <div class="reporte-header-content">
        <div class="reporte-header-left">
          <div class="reporte-icon-wrapper">
            <span class="reporte-icon">📊</span>
          </div>
          <div>
            <h1 class="reporte-title">Reporte de Contratos y Pagos</h1>
            <p class="reporte-subtitle">Panel ejecutivo · Período seleccionado: <strong>{{ periodoDescripcion }}</strong></p>
          </div>
        </div>
      </div>
    </div>

    <vx-card class="reporte-card shadow-lg">

      <!-- Controles y Filtros -->
      <div class="filtros-bar">
        <div class="filtros-left">
          <!-- Selector de Período -->
          <div class="filtro-group">
            <label class="filtro-label">📅 Período Escolar</label>
            <v-select
              v-model="periodo_seleccionado"
              :options="periodos"
              placeholder="Seleccionar período"
              label="descripcion"
              :reduce="p => p.idperiodoescolar"
              class="filtro-select"
              @input="onPeriodoChange"
            >
              <template #no-options>No se encontraron períodos</template>
            </v-select>
          </div>

          <!-- Filtro por Tipo (solo en Modo Plano) -->
          <div v-if="modo_vista === 'plano'" class="filtro-group">
            <label class="filtro-label">🏷️ Filtrar por Tipo</label>
            <v-select
              multiple
              v-model="tipo_seleccionado"
              :options="tiposDisponibles"
              placeholder="Todos los tipos"
              class="filtro-select"
            />
          </div>

          <!-- Filtro por Tipo de Venta (ambos modos) -->
          <div class="filtro-group">
            <label class="filtro-label">🛒 Tipo de Venta</label>
            <v-select
              multiple
              v-model="tipo_venta_seleccionado"
              :options="tiposVentaDisponibles"
              placeholder="Todas las ventas"
              class="filtro-select"
            />
          </div>

          <div class="filtro-group">
            <label class="filtro-label">🔎 Buscar</label>
            <vs-input icon-no-border icon="search" placeholder="Contrato, escuela..." v-model="busqueda" class="filtro-input" />
          </div>
        </div>

        <div class="filtros-right">
          <vs-button color="primary" type="gradient" icon-pack="feather" icon="icon-refresh-cw" @click="getData" size="small">
            Actualizar
          </vs-button>
        </div>
      </div>

      <!-- KPIs Ejecutivos -->
      <div v-if="contratosRaw.length > 0" class="kpi-grid">
        <div class="kpi-card kpi-purple">
          <div class="kpi-icon">📋</div>
          <div class="kpi-body">
            <div class="kpi-label">Total Contratos</div>
            <div class="kpi-value">{{ totalContratos }}</div>
            <div class="kpi-sub">Período activo</div>
          </div>
        </div>

        <div class="kpi-card kpi-green">
          <div class="kpi-icon">💰</div>
          <div class="kpi-body">
            <div class="kpi-label">Venta Neta Total</div>
            <div class="kpi-value">${{ formatCurrency(totalVentaNeta) }}</div>
            <div class="kpi-sub">Bruto: ${{ formatCurrency(totalVentaBruta) }}</div>
          </div>
        </div>

        <div class="kpi-card kpi-orange">
          <div class="kpi-icon">🏦</div>
          <div class="kpi-body">
            <div class="kpi-label">Total Pagado</div>
            <div class="kpi-value">${{ formatCurrency(totalRecaudado) }}</div>
            <div class="kpi-sub">Todos los métodos de pago</div>
          </div>
        </div>

        <div class="kpi-card kpi-red">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-body">
            <div class="kpi-label">Total por Pagar</div>
            <div class="kpi-value">${{ formatCurrency(totalPorPagar) }}</div>
            <div class="kpi-sub">Saldo pendiente por pagar</div>
          </div>
        </div>
      </div>

      <!-- Selector de Modo de Vista y Acciones (colocado bajito, justo debajo de KPIs) -->
      <div v-if="contratosRaw.length > 0" class="vista-tabs-container">
        <div class="flex gap-3">
          <button
            class="vista-tab-btn tab-agrupado"
            :class="{ active: modo_vista === 'agrupado' }"
            @click="modo_vista = 'agrupado'"
          >
            📂 Vista Agrupada
          </button>
          <button
            class="vista-tab-btn tab-plano"
            :class="{ active: modo_vista === 'plano' }"
            @click="modo_vista = 'plano'"
          >
            📊 Vista Plana (Excel)
          </button>
        </div>

        <vs-button color="success" type="filled" icon-pack="feather" icon="icon-download" @click="exportToExcel" :disabled="contratosRaw.length === 0" class="btn-exec shadow-md">
          Exportar a Excel
        </vs-button>
      </div>

      <!-- MODO 1: TABLA AGRUPADA -->
      <div v-if="contratosRaw.length > 0 && modo_vista === 'agrupado'" class="overflow-x-auto">
        <vs-table max-items="10" pagination :data="contratosFiltrados" class="master-table">
          <template slot="thead">
            <vs-th>Contrato / Institución</vs-th>
            <vs-th>Asesor</vs-th>
            <vs-th>Venta Bruta</vs-th>
            <vs-th>Comisión</vs-th>
            <vs-th>Venta Neta</vs-th>
            <vs-th>Deuda Ant.</vs-th>
            <vs-th>Convenio</vs-th>
            <vs-th>Convenio Pend.</vs-th>
            <vs-th>Normal Pend.</vs-th>
            <vs-th>Total Pagado</vs-th>
            <vs-th>Por Pagar</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="tr.contrato" v-for="tr in data">
              <!-- Contrato y Escuela -->
              <vs-td>
                <div class="flex items-center flex-wrap gap-2 mb-1">
                  <span class="font-bold text-dark text-sm">{{ tr.contrato }}</span>
                  <span v-if="tr.tipo_venta" class="text-xxs px-2 py-0.5 rounded bg-primary-light text-primary font-bold uppercase" style="font-size: 9px; line-height: 1.2;">
                    {{ tr.tipo_venta }}
                  </span>
                  <span v-if="tr.estado_liquidacion" :class="getEstadoLiquidacionClass(tr.estado_liquidacion)" class="text-xxs px-2 py-0.5 rounded font-bold uppercase" style="font-size: 9px; line-height: 1.2;">
                    {{ tr.estado_liquidacion }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 font-medium leading-tight">{{ tr.escuela }}</div>
              </vs-td>

              <!-- Asesor -->
              <vs-td>
                <div class="text-xs font-semibold text-gray-600">{{ tr.asesor || 'Sin Asesor' }}</div>
              </vs-td>

              <!-- Venta Bruta -->
              <vs-td>
                <span class="text-xs font-bold text-gray-500">${{ formatCurrency(tr.venta_bruta) }}</span>
              </vs-td>

              <!-- Comisión -->
              <vs-td>
                <span class="text-xs font-bold text-warning">${{ formatCurrency(tr.comision_contrato) }}</span>
                <div v-if="tr.comision_porcentaje" class="text-xxs text-gray-400 font-medium">({{ tr.comision_porcentaje }}%)</div>
              </vs-td>

              <!-- Venta Neta -->
              <vs-td>
                <span class="text-sm font-bold text-primary">${{ formatCurrency(tr.venta_neta) }}</span>
              </vs-td>

              <!-- Deuda Anterior -->
              <vs-td>
                <span :class="tr.deuda_anterior > 0 ? 'text-danger font-bold' : 'text-gray-300'" class="text-xs">
                  ${{ formatCurrency(tr.deuda_anterior) }}
                </span>
              </vs-td>

              <!-- Convenio Global -->
              <vs-td>
                <div v-if="tr.convenio_global > 0">
                  <span class="text-xs font-bold text-dark">${{ formatCurrency(tr.convenio_global) }}</span>
                  <div class="text-xxs text-gray-400 italic">({{ tr.anio_convenio }} años)</div>
                </div>
                <span v-else class="text-gray-300">-</span>
              </vs-td>

              <!-- Convenio Pendiente -->
              <vs-td>
                <span :class="tr.pagos_convenio_pendiente > 0 ? 'text-warning font-bold' : 'text-gray-300'" class="text-xs">
                  ${{ formatCurrency(tr.pagos_convenio_pendiente) }}
                </span>
              </vs-td>

              <!-- Normal Pendiente -->
              <vs-td>
                <span :class="tr.pagos_normales_pendiente > 0 ? 'text-warning font-bold' : 'text-gray-300'" class="text-xs">
                  ${{ formatCurrency(tr.pagos_normales_pendiente) }}
                </span>
              </vs-td>

              <!-- Total Pagado -->
              <vs-td>
                <vs-chip color="success" transparent class="font-bold">
                  ${{ formatCurrency(tr.total_pagos) }}
                </vs-chip>
              </vs-td>

              <!-- Por Pagar -->
              <vs-td>
                <span :class="tr.total_por_pagar > 0 ? 'text-danger font-black text-sm' : 'text-success font-bold'" class="text-xs">
                  ${{ formatCurrency(tr.total_por_pagar) }}
                </span>
              </vs-td>

              <!-- Detalles Expandidos -->
              <template slot="expand">
                <div class="p-5 bg-detail-container rounded-lg shadow-inner w-full">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="font-bold text-primary flex items-center text-base">
                      <vs-icon icon="payment" class="mr-2" size="20px"></vs-icon>
                      Detalle de Pagos para el Contrato: <span class="font-mono text-dark ml-2 font-black">{{ tr.contrato }}</span>
                    </h5>
                    <div class="flex gap-2">
                      <!-- Mostrar chips solo si son mayores a 0 -->
                      <vs-chip v-if="tr.total_anticipos > 0" color="primary" class="font-bold text-xs">
                        Anticipos: ${{ formatCurrency(tr.total_anticipos) }}
                      </vs-chip>
                      <vs-chip v-if="tr.total_liquidaciones > 0" color="success" class="font-bold text-xs">
                        Liquidaciones: ${{ formatCurrency(tr.total_liquidaciones) }}
                      </vs-chip>
                      <vs-chip v-if="tr.total_convenios > 0" color="warning" class="font-bold text-xs">
                        Convenio: ${{ formatCurrency(tr.total_convenios) }}
                      </vs-chip>
                      <vs-chip v-if="tr.total_otros > 0" color="danger" class="font-bold text-xs">
                        Otros: ${{ formatCurrency(tr.total_otros) }}
                      </vs-chip>
                    </div>
                  </div>

                  <div v-if="tr.pagos.length > 0" class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="tr.pagos" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Tipo Pago</vs-th>
                        <vs-th>Beneficiario</vs-th>
                        <vs-th>Razón Social</vs-th>
                        <vs-th>DNI</vs-th>
                        <vs-th>Detalles Factura</vs-th>
                        <vs-th>Método Pago</vs-th>
                        <vs-th>Valores</vs-th>
                        <vs-th>Total Pagado</vs-th>
                        <vs-th>Estado / Fecha</vs-th>
                      </template>
                      <template slot-scope="{data: pagos}">
                        <vs-tr :key="idx" v-for="(pago, idx) in pagos">
                          <vs-td>
                            <vs-chip :color="getTipoPagoColor(pago.tipo)" class="text-xs uppercase font-bold">
                              {{ formatTipoPago(pago.tipo) }}
                            </vs-chip>
                          </vs-td>
                          <vs-td class="font-medium text-dark text-xs max-w-xs truncate">{{ pago.beneficiario }}</vs-td>
                          <vs-td class="text-xs max-w-xs truncate text-gray-500">{{ pago.razon_social || '-' }}</vs-td>
                          <vs-td class="font-mono text-xs">{{ pago.documento_dni || '-' }}</vs-td>
                          <vs-td>
                            <div v-if="pago.num_factura" class="text-xs font-mono font-bold text-primary">
                              Fact: {{ formatearNumeroFactura(pago.num_factura) }}
                            </div>
                            <div v-else class="text-gray-400 text-xs italic">Sin Factura</div>
                            <div v-if="pago.fecha_emision_factura" class="text-xxs text-gray-400">
                              Emis: {{ formatDate(pago.fecha_emision_factura) }}
                            </div>
                          </vs-td>
                          <vs-td class="text-xs font-medium">{{ pago.forma_pago || 'N/A' }}</vs-td>
                          <vs-td>
                            <div class="text-xxs text-gray-500">
                              Subt: ${{ formatCurrency(pago.subtotal) }}
                            </div>
                            <div class="text-xxs text-gray-500">
                              IVA: ${{ formatCurrency(pago.iva) }}
                            </div>
                            <div class="text-xxs text-gray-500">
                              Ret: ${{ formatCurrency(pago.retencion) }}
                            </div>
                          </vs-td>
                          <vs-td class="font-black text-success text-xs">
                            ${{ formatCurrency(pago.valor) }}
                          </vs-td>
                          <vs-td>
                            <div class="mb-1">
                              <vs-chip :color="pago.estado === 'Cerrado' ? 'success' : 'warning'" transparent class="text-xs font-bold">
                                {{ pago.estado }}
                              </vs-chip>
                            </div>
                            <div class="text-xxs text-gray-400 font-mono"><b>Proc:</b> {{ formatDate(pago.fecha_proceso) }}</div>
                            <div v-if="pago.fecha_emision_factura" class="text-xxs text-gray-400 font-mono"><b>Emis:</b> {{ formatDate(pago.fecha_emision_factura) }}</div>
                            <div v-if="pago.fecha_pago_factura" class="text-xxs text-gray-400 font-mono"><b>Pago:</b> {{ formatDate(pago.fecha_pago_factura) }}</div>
                          </vs-td>
                        </vs-tr>
                      </template>
                    </vs-table>
                  </div>
                  <div v-else class="p-5 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    <vs-icon icon="info" size="30px" color="warning" class="mb-2"></vs-icon>
                    <p class="italic font-medium">No se registran transacciones de pago asociadas a este contrato.</p>
                  </div>
                </div>
              </template>
            </vs-tr>

          </template>
        </vs-table>
      </div>

      <!-- MODO 2: TABLA PLANA (EXCEL FORMAT) -->
      <div v-if="contratosRaw.length > 0 && modo_vista === 'plano'">
        <!-- Contador y paginación info -->
        <div class="flex items-center justify-between flex-wrap gap-4 mb-3">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-xs text-gray-500 font-semibold">
              Mostrando <b>{{ planoFiltrado.length > 0 ? (paginaActual - 1) * itemsPorPagina + 1 : 0 }} - {{ Math.min(paginaActual * itemsPorPagina, planoFiltrado.length) }}</b> de <b>{{ planoFiltrado.length }}</b> registros
            </span>
            <!-- Selector de filas por página -->
            <div class="flex items-center gap-1 text-xs text-gray-500">
              <span>Filas por página:</span>
              <select v-model="itemsPorPagina" class="p-1 rounded border border-gray-300 text-xs font-semibold focus:outline-none" @change="paginaActual = 1" style="border-radius: 6px; padding: 2px 6px;">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </div>

          <!-- Controles de Paginación -->
          <div class="flex items-center gap-1">
            <vs-button 
              radius 
              color="primary" 
              type="flat" 
              icon-pack="feather" 
              icon="icon-chevron-left" 
              :disabled="paginaActual === 1" 
              @click="paginaActual--"
            />
            <span class="text-xs font-bold px-2 text-gray-700">Página {{ paginaActual }} de {{ totalPaginasPlano }}</span>
            <vs-button 
              radius 
              color="primary" 
              type="flat" 
              icon-pack="feather" 
              icon="icon-chevron-right" 
              :disabled="paginaActual >= totalPaginasPlano" 
              @click="paginaActual++"
            />
          </div>
        </div>

        <!-- Tabla nativa con scroll -->
        <div class="tabla-plana-wrapper">
          <table class="tabla-plana">
            <thead>
              <tr>
                <th class="col-contrato">Contrato</th>
                <th class="col-escuela">Escuela</th>
                <th class="col-asesor">Asesor</th>
                <th class="col-tipo">Tipo Venta</th>
                <th class="col-estado">Estado Contrato</th>
                <th class="col-tipo">Tipo</th>
                <th class="col-num text-right">Comisión %</th>
                <th class="col-num text-right">Subtotal</th>
                <th class="col-num text-right">IVA</th>
                <th class="col-num text-right">Retención</th>
                <th class="col-num text-right">Valor</th>
                <th class="col-medio">Forma Pago</th>
                <th class="col-benef">Beneficiario</th>
                <th class="col-fact">N° Factura</th>
                <th class="col-estado">Estado Pago</th>
                <th class="col-fecha">Fecha Proceso</th>
                <th class="col-fecha">Fecha Emisión</th>
                <th class="col-fecha">Fecha Pago</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tr, ind) in planoPaginado" :key="ind" :class="ind % 2 === 0 ? 'fila-par' : 'fila-impar'">
                <!-- Contrato -->
                <td class="col-contrato">
                  <span class="tag-contrato">{{ tr.contrato }}</span>
                </td>
                <!-- Escuela -->
                <td class="col-escuela text-xs">{{ tr.escuela }}</td>
                <!-- Asesor -->
                <td class="col-asesor text-xs text-gray-500">{{ tr.asesor || '-' }}</td>
                <!-- Tipo Venta -->
                <td class="col-tipo text-xs text-gray-500">{{ tr.tipo_venta || '-' }}</td>
                <!-- Estado Contrato -->
                <td class="col-estado">
                  <span v-if="tr.estado_liquidacion" :class="tr.estado_liquidacion === 'LIQUIDADO' ? 'badge-cerrado' : 'badge-abierto'" class="text-xs font-bold">
                    {{ tr.estado_liquidacion }}
                  </span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- Tipo -->
                <td class="col-tipo">
                  <span class="tag-tipo">{{ tr.tipo }}</span>
                </td>
                <!-- Comisión % -->
                <td class="col-num text-right text-xs">
                  <span v-if="tr.comision_porcentaje">{{ tr.comision_porcentaje }}%</span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- Subtotal -->
                <td class="col-num text-right text-xs">
                  <span v-if="parseFloat(tr.subtotal) > 0">${{ formatCurrency(tr.subtotal) }}</span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- IVA -->
                <td class="col-num text-right text-xs">
                  <span v-if="parseFloat(tr.iva) > 0">${{ formatCurrency(tr.iva) }}</span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- Retención -->
                <td class="col-num text-right text-xs text-danger">
                  <span v-if="parseFloat(tr.retencion) > 0">${{ formatCurrency(tr.retencion) }}</span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- Valor -->
                <td class="col-num text-right font-bold text-xs">
                  <span v-if="tr.tipo === 'anio_convenio'">{{ parseInt(tr.valor) || 0 }}</span>
                  <span v-else>${{ formatCurrency(tr.valor) }}</span>
                </td>
                <!-- Forma Pago -->
                <td class="col-medio text-xs">{{ tr.forma_pago || '-' }}</td>
                <!-- Beneficiario -->
                <td class="col-benef text-xs">
                  <span :title="tr.beneficiario">{{ tr.beneficiario || '-' }}</span>
                </td>
                <!-- N° Factura -->
                <td class="col-fact font-mono text-xs">{{ formatearNumeroFactura(tr.num_factura) || '-' }}</td>
                <!-- Estado -->
                <td class="col-estado">
                  <span v-if="tr.estado" :class="tr.estado === 'Cerrado' ? 'badge-cerrado' : 'badge-abierto'" class="text-xs font-bold">
                    {{ tr.estado }}
                  </span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- Fecha Proceso -->
                <td class="col-fecha font-mono text-xs">{{ formatDate(tr.fecha_proceso) }}</td>
                <!-- Fecha Emisión -->
                <td class="col-fecha font-mono text-xs">
                  <span v-if="tr.fecha_emision_factura">{{ formatDate(tr.fecha_emision_factura) }}</span>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <!-- Fecha Pago -->
                <td class="col-fecha font-mono text-xs">
                  <span v-if="tr.fecha_pago_factura">{{ formatDate(tr.fecha_pago_factura) }}</span>
                  <span v-else class="text-gray-300">-</span>
                </td>
              </tr>
              <!-- Sin datos -->
              <tr v-if="planoPaginado.length === 0">
                <td colspan="18" class="text-center py-10 text-gray-400 italic">No se encontraron registros con los filtros aplicados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="contratosRaw.length === 0" class="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <vs-icon icon="cloud_download" size="60px" color="primary" class="mb-4 animate-pulse-custom"></vs-icon>
        <h4 class="text-gray-600 font-bold mb-2">No se han cargado datos</h4>
        <p class="text-gray-400 mb-5 max-w-md mx-auto">Selecciona un período escolar para visualizar el reporte agrupado de contratos y pagos.</p>
      </div>
    </vx-card>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  components: { 'v-select': vSelect },
  data() {
    return {
      contratosRaw: [],
      periodos: [],
      periodo_seleccionado: null,
      busqueda: '',
      modo_vista: 'agrupado',
      tipo_seleccionado: [],
      tipo_venta_seleccionado: [],
      paginaActual: 1,
      itemsPorPagina: 20,
    };
  },
  computed: {
    periodoDescripcion() {
      if (!this.periodo_seleccionado) return 'Sin seleccionar';
      const p = this.periodos.find(x => x.idperiodoescolar === this.periodo_seleccionado);
      return p ? (p.descripcion || p.periodoescolar || 'Período ' + this.periodo_seleccionado) : 'Sin seleccionar';
    },
    tiposDisponibles() {
      const types = new Set();
      this.contratosRaw.forEach(item => {
        if (item.tipo) {
          types.add(item.tipo);
        }
      });
      return Array.from(types).sort();
    },
    tiposVentaDisponibles() {
      const types = new Set();
      this.contratosRaw.forEach(item => {
        if (item.tipo_venta) {
          types.add(item.tipo_venta);
        }
      });
      return Array.from(types).sort();
    },
    planoFiltrado() {
      let data = this.contratosRaw;

      // Filtro por tipo (múltiple)
      if (this.tipo_seleccionado && this.tipo_seleccionado.length > 0) {
        data = data.filter(item => this.tipo_seleccionado.includes(item.tipo));
      }

      // Filtro por tipo de venta (múltiple)
      if (this.tipo_venta_seleccionado && this.tipo_venta_seleccionado.length > 0) {
        data = data.filter(item => this.tipo_venta_seleccionado.includes(item.tipo_venta));
      }

      // Filtro por búsqueda general
      if (this.busqueda.trim()) {
        const q = this.busqueda.toLowerCase();
        data = data.filter(item =>
          (item.contrato && item.contrato.toLowerCase().includes(q)) ||
          (item.escuela && item.escuela.toLowerCase().includes(q)) ||
          (item.asesor && item.asesor.toLowerCase().includes(q)) ||
          (item.tipo && item.tipo.toLowerCase().includes(q)) ||
          (item.beneficiario && item.beneficiario.toLowerCase().includes(q))
        );
      }

      return data;
    },
    planoPaginado() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.planoFiltrado.slice(inicio, fin);
    },
    totalPaginasPlano() {
      return Math.ceil(this.planoFiltrado.length / this.itemsPorPagina) || 1;
    },
    contratosAgrupados() {
      const map = {};
      this.contratosRaw.forEach(item => {
        const code = item.contrato || 'SIN_CONTRATO';
        if (!map[code]) {
          map[code] = {
            contrato: code,
            escuela: item.escuela || 'Sin Escuela',
            asesor: item.asesor || 'Sin Asesor',
            tipo_venta: '',
            estado_liquidacion: '',
            comision_porcentaje: 0,
            venta_bruta: 0,
            comision_contrato: 0,
            venta_neta: 0,
            deuda_anterior: 0,
            convenio_global: 0,
            anio_convenio: 0,
            pagos_convenio_pendiente: 0,
            pagos_convenio_pagado: 0,
            pagos_normales_pendiente: 0,
            pagos_normales_pagado: 0,
            total_por_pagar: 0,
            pagos: [],
            total_pagos: 0,
            total_anticipos: 0,
            total_liquidaciones: 0,
            total_convenios: 0,
            total_otros: 0,
            saldo: 0
          };
        }

        const contract = map[code];
        const val = parseFloat(item.valor) || 0;

        if (item.tipo_venta) {
          contract.tipo_venta = item.tipo_venta;
        }
        if (item.estado_liquidacion) {
          contract.estado_liquidacion = item.estado_liquidacion;
        }
        if (item.comision_porcentaje !== undefined && item.comision_porcentaje !== null) {
          contract.comision_porcentaje = item.comision_porcentaje;
        }

        if (item.tipo === 'venta_bruta') {
          contract.venta_bruta = val;
        } else if (item.tipo === 'comision_contrato') {
          contract.comision_contrato = val;
        } else if (item.tipo === 'venta_neta') {
          contract.venta_neta = val;
        } else if (item.tipo === 'deuda_anterior') {
          contract.deuda_anterior = val;
        } else if (item.tipo === 'convenio_global') {
          contract.convenio_global = val;
        } else if (item.tipo === 'anio_convenio') {
          contract.anio_convenio = parseInt(item.valor) || 0;
        } else if (item.tipo === 'pagos_convenio_pendiente') {
          contract.pagos_convenio_pendiente = val;
        } else if (item.tipo === 'pagos_convenio_pagado') {
          contract.pagos_convenio_pagado = val;
        } else if (item.tipo === 'pagos_normales_pendiente') {
          contract.pagos_normales_pendiente = val;
        } else if (item.tipo === 'pagos_normales_pagado') {
          contract.pagos_normales_pagado = val;
        } else if (item.tipo === 'total_por_pagar') {
          contract.total_por_pagar = val;
        } else if (
          item.tipo === 'pago_anticipo' ||
          item.tipo === 'pago_liquidacion' ||
          item.tipo === 'pago_convenio' ||
          item.tipo === 'pago_otros_valores_cancelar'
        ) {
          contract.pagos.push(item);
          if (item.estado === 'Cerrado') {
            contract.total_pagos += val;
            if (item.tipo === 'pago_anticipo') {
              contract.total_anticipos += val;
            } else if (item.tipo === 'pago_liquidacion') {
              contract.total_liquidaciones += val;
            } else if (item.tipo === 'pago_convenio') {
              contract.total_convenios += val;
            } else if (item.tipo === 'pago_otros_valores_cancelar') {
              contract.total_otros += val;
            }
          }
        }
      });

      // Calcular saldo restante para cada contrato
      Object.values(map).forEach(c => {
        c.saldo = (c.venta_neta + c.deuda_anterior) - c.total_pagos;
      });

      return Object.values(map);
    },
    contratosFiltrados() {
      let list = this.contratosAgrupados;

      // Filtro por tipo de venta (agrupado)
      if (this.tipo_venta_seleccionado && this.tipo_venta_seleccionado.length > 0) {
        list = list.filter(c => this.tipo_venta_seleccionado.includes(c.tipo_venta));
      }

      if (!this.busqueda.trim()) return list;
      const q = this.busqueda.toLowerCase();
      return list.filter(c =>
        c.contrato.toLowerCase().includes(q) ||
        c.escuela.toLowerCase().includes(q) ||
        (c.asesor && c.asesor.toLowerCase().includes(q))
      );
    },

    // ── Fuente activa según el modo de vista ──────────────────────────────
    // En modo agrupado: usa los contratos filtrados (ya agrupados)
    // En modo plano:    reconstruye totales desde las filas filtradas del JSON
    kpiBase() {
      if (this.modo_vista === 'agrupado') {
        // Devuelve los contratos ya agrupados y filtrados
        return this.contratosFiltrados;
      }
      // Modo plano: agrupa las filas filtradas en contratos virtuales para los KPIs
      const map = {};
      this.planoFiltrado.forEach(item => {
        const key = item.contrato;
        if (!map[key]) {
          map[key] = {
            venta_bruta: 0, comision_contrato: 0, venta_neta: 0,
            deuda_anterior: 0, total_pagos: 0, total_por_pagar: 0, saldo: 0
          };
        }
        const val = parseFloat(item.valor) || 0;
        const tipo = item.tipo;
        if (tipo === 'venta_bruta')         map[key].venta_bruta        += val;
        else if (tipo === 'comision_contrato') map[key].comision_contrato += val;
        else if (tipo === 'venta_neta')     map[key].venta_neta          += val;
        else if (tipo === 'deuda_anterior') map[key].deuda_anterior       += val;
        else if (tipo === 'total_por_pagar') map[key].total_por_pagar     += val;
        else if (tipo && tipo.startsWith('pago_')) {
          if (item.estado === 'Cerrado') {
            map[key].total_pagos += val;
          }
        }
      });
      Object.values(map).forEach(c => { c.saldo = (c.venta_neta + c.deuda_anterior) - c.total_pagos; });
      return Object.values(map);
    },

    totalContratos() {
      return this.kpiBase.length;
    },
    totalVentaBruta() {
      return this.kpiBase.reduce((sum, c) => sum + c.venta_bruta, 0);
    },
    totalComision() {
      return this.kpiBase.reduce((sum, c) => sum + c.comision_contrato, 0);
    },
    totalVentaNeta() {
      return this.kpiBase.reduce((sum, c) => sum + c.venta_neta, 0);
    },
    totalDeudaAnterior() {
      return this.kpiBase.reduce((sum, c) => sum + c.deuda_anterior, 0);
    },
    totalConvenioGlobal() {
      return this.contratosAgrupados.reduce((sum, c) => sum + c.convenio_global, 0);
    },
    totalRecaudado() {
      return this.kpiBase.reduce((sum, c) => sum + c.total_pagos, 0);
    },
    totalSaldoPendiente() {
      return this.kpiBase.reduce((sum, c) => sum + c.saldo, 0);
    },
    totalPorPagar() {
      return this.kpiBase.reduce((sum, c) => sum + (c.total_por_pagar || 0), 0);
    }

  },
  watch: {
    planoFiltrado() {
      this.paginaActual = 1;
    }
  },
  mounted() {
    this.getPeriodos().then(() => {
      if (this.periodo_seleccionado) {
        this.getData();
      }
    });
  },
  methods: {
    getPeriodos() {
      let me = this;
      const url = (me.$server_url || 'http://localhost:8000/') + 'periodo';
      return me.$http.get(url)
        .then(res => {
          let list = Array.isArray(res.data) ? res.data : (res.data.data || []);
          me.periodos = list;

          // Seleccionar Sierra 2025 o el período con ID 27 por defecto
          const defaultPeriod = list.find(p =>
            p.idperiodoescolar === 27 ||
            (p.descripcion && p.descripcion.toLowerCase().includes('sierra 2025'))
          );
          if (defaultPeriod) {
            me.periodo_seleccionado = defaultPeriod.idperiodoescolar;
          } else if (list.length > 0) {
            const active = list.find(p => p.estado == 1 || p.estado === '1');
            me.periodo_seleccionado = active ? active.idperiodoescolar : list[0].idperiodoescolar;
          }
        })
        .catch(err => {
          console.error('Error al cargar períodos:', err);
        });
    },
    onPeriodoChange(val) {
      if (!val) {
        this.contratosRaw = [];
        return;
      }
      this.getData();
    },
    getData() {
      let me = this;
      if (!me.periodo_seleccionado) return;
      me.$vs.loading({ title: 'Cargando contratos y pagos...', color: '#7367F0' });

      const url = (me.$server_url || 'http://localhost:8000/') +
        'pedidos2/pedidos?getReporteAgrupado=1&periodo_id=' + me.periodo_seleccionado;

      me.$http.get(url)
        .then(res => {
          me.contratosRaw = Array.isArray(res.data) ? res.data : [];
          // Seleccionar todos los tipos de venta por defecto
          const tiposVenta = [...new Set(me.contratosRaw.map(i => i.tipo_venta).filter(Boolean))];
          me.tipo_venta_seleccionado = tiposVenta;
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Sincronización Exitosa',
            text: `Se cargaron ${me.contratosRaw.length} registros del reporte.`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        })
        .catch(err => {
          console.error(err);
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error de Sincronización',
            text: 'No se pudo obtener el reporte agrupado.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        });
    },
    formatCurrency(value) {
      if (value === undefined || value === null) return '0.00';
      return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatearNumeroFactura(num) {
      if (!num || num === '' || num === null || num === undefined) {
        return '';
      }
      return String(num).padStart(9, '0');
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      try { return dateStr.split(' ')[0] || dateStr; } catch (e) { return dateStr; }
    },
    formatTipoPago(tipo) {
      if (!tipo) return '';
      return tipo.replace('pago_', '').replace(/_/g, ' ');
    },
    getTipoPagoColor(tipo) {
      switch (tipo) {
        case 'pago_anticipo': return 'primary';
        case 'pago_liquidacion': return 'success';
        case 'pago_convenio': return 'warning';
        case 'pago_otros_valores_cancelar': return 'danger';
        default: return 'dark';
      }
    },
    getEstadoLiquidacionClass(estado) {
      if (!estado) return '';
      const est = estado.toUpperCase();
      if (est === 'LIQUIDADO') return 'bg-success-light text-success';
      return 'bg-warning-light text-warning';
    },
    exportToExcel() {
      let me = this;
      if (me.contratosRaw.length === 0) {
        me.$vs.notify({ title: 'Atención', text: 'No hay datos para exportar.', color: 'warning' });
        return;
      }
      me.$vs.loading({ title: 'Generando Excel...', color: '#7367F0' });

      setTimeout(() => {
        try {
          const workbook = XLSX.utils.book_new();

          // 1. Resumen de Contratos (Hoja Consolidada)
          const filtrados = me.contratosFiltrados;
          const resumenRows = filtrados.map(c => ({
            'Contrato': c.contrato,
            'Institución': c.escuela,
            'Asesor': c.asesor,
            'Tipo Venta': c.tipo_venta || '',
            'Estado Contrato': c.estado_liquidacion || '',
            'Venta Bruta ($)': c.venta_bruta,
            'Comisión ($)': c.comision_contrato,
            'Comisión (%)': c.comision_porcentaje ? c.comision_porcentaje + '%' : '',
            'Venta Neta ($)': c.venta_neta,
            'Deuda Anterior ($)': c.deuda_anterior,
            'Convenio Global ($)': c.convenio_global,
            'Años Convenio': c.anio_convenio || 0,
            'Convenio Pendiente ($)': c.pagos_convenio_pendiente,
            'Normal Pendiente ($)': c.pagos_normales_pendiente,
            'Anticipos ($)': c.total_anticipos,
            'Liquidaciones ($)': c.total_liquidaciones,
            'Convenios ($)': c.total_convenios,
            'Otros ($)': c.total_otros,
            'Total Pagado ($)': c.total_pagos,
            'Total por Pagar ($)': c.total_por_pagar
          }));

          resumenRows.push({
            'Contrato': 'TOTAL GENERAL',
            'Institución': '',
            'Asesor': '',
            'Tipo Venta': '',
            'Estado Contrato': '',
            'Venta Bruta ($)': filtrados.reduce((s, c) => s + c.venta_bruta, 0),
            'Comisión ($)': filtrados.reduce((s, c) => s + c.comision_contrato, 0),
            'Comisión (%)': '',
            'Venta Neta ($)': filtrados.reduce((s, c) => s + c.venta_neta, 0),
            'Deuda Anterior ($)': filtrados.reduce((s, c) => s + c.deuda_anterior, 0),
            'Convenio Global ($)': filtrados.reduce((s, c) => s + c.convenio_global, 0),
            'Años Convenio': '',
            'Convenio Pendiente ($)': filtrados.reduce((s, c) => s + c.pagos_convenio_pendiente, 0),
            'Normal Pendiente ($)': filtrados.reduce((s, c) => s + c.pagos_normales_pendiente, 0),
            'Anticipos ($)': filtrados.reduce((s, c) => s + c.total_anticipos, 0),
            'Liquidaciones ($)': filtrados.reduce((s, c) => s + c.total_liquidaciones, 0),
            'Convenios ($)': filtrados.reduce((s, c) => s + c.total_convenios, 0),
            'Otros ($)': filtrados.reduce((s, c) => s + c.total_otros, 0),
            'Total Pagado ($)': filtrados.reduce((s, c) => s + c.total_pagos, 0),
            'Total por Pagar ($)': filtrados.reduce((s, c) => s + c.total_por_pagar, 0)
          });

          // 2. Datos Planos (Hoja Plana tal como viene del JSON)
          const planoRows = me.planoFiltrado.map(tr => ({
            'contrato': tr.contrato,
            'escuela': tr.escuela,
            'asesor': tr.asesor,
            'tipo_venta': tr.tipo_venta || '',
            'estado_liquidacion': tr.estado_liquidacion || '',
            'tipo': tr.tipo,
            'comision_porcentaje': tr.comision_porcentaje ? tr.comision_porcentaje + '%' : '',
            'subtotal': parseFloat(tr.subtotal) > 0 ? parseFloat(tr.subtotal) : '',
            'iva': parseFloat(tr.iva) > 0 ? parseFloat(tr.iva) : '',
            'retencion': parseFloat(tr.retencion) > 0 ? parseFloat(tr.retencion) : '',
            'valor': tr.tipo === 'anio_convenio' ? (parseInt(tr.valor) || 0) : (parseFloat(tr.valor) || 0),
            'forma_pago': tr.forma_pago || '',
            'beneficiario': tr.beneficiario || '',
            'num_factura': tr.num_factura ? me.formatearNumeroFactura(tr.num_factura) : '',
            'estado': tr.estado || '',
            'fecha_proceso': tr.fecha_proceso || '',
            'fecha_emision_factura': tr.fecha_emision_factura || '',
            'fecha_pago_factura': tr.fecha_pago_factura || ''
          }));

          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(planoRows), 'Datos Planos (Excel)');
          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(resumenRows), 'Resumen Consolidado');

          XLSX.writeFile(workbook, 'Reporte_Contratos_Pagos.xlsx');
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Exportación Exitosa', text: 'Excel generado correctamente.',
            color: 'success', iconPack: 'feather', icon: 'icon-download'
          });
        } catch (err) {
          console.error(err);
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error de Exportación', text: 'Error al generar el Excel: ' + err.message,
            color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle'
          });
        }
      }, 100);
    }
  }
};
</script>

<style scoped>
/* ===== WRAPPER ===== */
.reporte-wrapper { padding: 1.5rem; background: #f4f6fb; min-height: 100vh; }

/* ===== HEADER EJECUTIVO ===== */
.reporte-header {
  background: linear-gradient(135deg, #1a1a3e 0%, #7367f0 60%, #9b59b6 100%);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(115, 103, 240, 0.35);
}
.reporte-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.reporte-header-left { display: flex; align-items: center; gap: 1rem; }
.reporte-icon-wrapper {
  background: rgba(255,255,255,0.18);
  border-radius: 12px;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reporte-icon { font-size: 1.8rem; }
.reporte-title { color: #fff; font-size: 1.4rem; font-weight: 900; margin: 0; letter-spacing: -0.3px; }
.reporte-subtitle { color: rgba(255,255,255,0.75); font-size: 0.82rem; margin: 0.2rem 0 0; }
.reporte-subtitle strong { color: #fff; }
.btn-exec { border-radius: 8px !important; font-weight: 700 !important; }

/* ===== CARD ===== */
.reporte-card { border-radius: 12px !important; border: none !important; overflow: hidden; }

/* ===== FILTROS BAR ===== */
.filtros-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e8ecf0;
  margin: -1.5rem -1.5rem 1.5rem;
}
.filtros-left { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 1rem; }
.filtros-right { display: flex; align-items: flex-end; }
.filtro-group { display: flex; flex-direction: column; gap: 4px; min-width: 180px; }
.filtro-label { font-size: 0.72rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
.filtro-select { min-width: 200px; }
.filtro-input { min-width: 200px; }

/* ===== KPI GRID ===== */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.kpi-card {
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}
.kpi-card::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  opacity: 0.08;
  background: #fff;
}
.kpi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.12); }
.kpi-purple { background: linear-gradient(135deg, #7367f0, #9d8df1); box-shadow: 0 4px 20px rgba(115,103,240,0.3); }
.kpi-green  { background: linear-gradient(135deg, #28c76f, #48da89); box-shadow: 0 4px 20px rgba(40,199,111,0.3); }
.kpi-orange { background: linear-gradient(135deg, #ff9f43, #ffb976); box-shadow: 0 4px 20px rgba(255,159,67,0.3); }
.kpi-red    { background: linear-gradient(135deg, #ea5455, #f08182); box-shadow: 0 4px 20px rgba(234,84,85,0.3); }
.kpi-icon { font-size: 2rem; flex-shrink: 0; }
.kpi-body { flex: 1; }
.kpi-label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.kpi-value { font-size: 1.5rem; font-weight: 900; color: #fff; line-height: 1.2; }
.kpi-sub { font-size: 0.7rem; color: rgba(255,255,255,0.7); margin-top: 2px; }

/* ===== TABLA ===== */
.master-table { margin-top: 0.5rem; }
.bg-detail-container { background-color: #f7f9fc; border-left: 4px solid #7367f0; }
.detail-table { background-color: #ffffff !important; }

/* ===== ESTADO VACÍO ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f9fafb, #eef0f5);
  border-radius: 12px;
  border: 2px dashed #d0d7de;
}
.empty-state h4 { font-size: 1.1rem; font-weight: 800; color: #374151; margin: 1rem 0 0.5rem; }
.empty-state p { color: #9ca3af; font-size: 0.875rem; max-width: 400px; text-align: center; }

/* ===== UTILIDADES ===== */
.text-primary { color: #7367f0; }
.text-success { color: #28c76f; }
.text-warning { color: #ff9f43; }
.text-danger  { color: #ea5455; }
.text-dark    { color: #1e1e1e; }
.text-xxs     { font-size: 0.65rem; }
.font-mono    { font-family: 'Consolas', 'Courier New', Courier, monospace; }
.font-black   { font-weight: 900; }
.bg-primary-light { background-color: rgba(115,103,240,0.08); }
.bg-success-light { background-color: rgba(40,199,111,0.08); }
.bg-warning-light { background-color: rgba(255,159,67,0.08); }
.bg-danger-light  { background-color: rgba(234,84,85,0.08); }
.border-primary { border:1px solid rgba(115,103,240,0.2); border-top:3px solid #7367f0; }
.border-success { border:1px solid rgba(40,199,111,0.2); border-top:3px solid #28c76f; }
.border-warning { border:1px solid rgba(255,159,67,0.2); border-top:3px solid #ff9f43; }
.border-danger  { border:1px solid rgba(234,84,85,0.2); border-top:3px solid #ea5455; }

@keyframes pulse-animation {
  0%   { transform: scale(1); opacity: 1; }
  50%  { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pulse-custom { animation: pulse-animation 2s infinite; }

/* ===== TABLA PLANA NATIVA ===== */
.tabla-plana-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.tabla-plana {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  font-size: 0.78rem;
}
.tabla-plana thead tr {
  background: linear-gradient(90deg, #7367f0, #9d8df1);
}
.tabla-plana thead th {
  color: #fff;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  white-space: nowrap;
  border: none;
  position: sticky;
  top: 0;
}
.tabla-plana tbody td {
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}
.fila-par { background: #ffffff; }
.fila-impar { background: #f8fafc; }
.tabla-plana tbody tr:hover { background: #ede8ff !important; transition: background 0.15s; }

/* Anchos de columnas */
.col-contrato { min-width: 160px; }
.col-escuela  { min-width: 220px; max-width: 260px; overflow: hidden; text-overflow: ellipsis; }
.col-asesor   { min-width: 180px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.col-tipo     { min-width: 160px; }
.col-num      { min-width: 100px; }
.col-medio    { min-width: 120px; }
.col-benef    { min-width: 200px; max-width: 240px; overflow: hidden; text-overflow: ellipsis; }
.col-fact     { min-width: 100px; }
.col-estado   { min-width: 90px; }
.col-fecha    { min-width: 120px; }

/* Tags */
.tag-contrato {
  font-family: 'Consolas', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(115,103,240,0.1);
  color: #7367f0;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(115,103,240,0.25);
  white-space: nowrap;
}
.tag-tipo {
  font-size: 0.68rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}
.badge-cerrado { color: #28c76f; }
.badge-abierto { color: #ff9f43; }

/* ===== CUSTOM VIEW SWITCHER TABS ===== */
.vista-tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  border-bottom: 2px solid #e8ecf0;
  padding-bottom: 10px;
}
.vista-tab-btn {
  padding: 10px 22px;
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  outline: none;
}
.vista-tab-btn:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
  color: #303133;
}
/* Agrupado activo: azul marino fuerte */
.vista-tab-btn.tab-agrupado.active {
  background-color: #102a43;
  color: #ffffff;
  border-color: #102a43;
  box-shadow: 0 4px 12px rgba(16, 42, 67, 0.25);
}
/* Plano activo: verde oscuro fuerte */
.vista-tab-btn.tab-plano.active {
  background-color: #145214;
  color: #ffffff;
  border-color: #145214;
  box-shadow: 0 4px 12px rgba(20, 82, 20, 0.25);
}
</style>
