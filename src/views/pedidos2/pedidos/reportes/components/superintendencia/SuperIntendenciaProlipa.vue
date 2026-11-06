<template>
  <div class="p-6">
    <vx-card title="Datos de Venta - Prolipa" title-color="primary" class="shadow-lg">

      <!-- Controles y métricas resumidas -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-3">
          <vs-button color="primary" type="gradient" icon-pack="feather" icon="icon-refresh-cw" @click="getData">
            Actualizar Datos
          </vs-button>

          <vs-button color="success" type="filled" icon-pack="feather" icon="icon-download" @click="exportToExcel" :disabled="ventas.length === 0">
            Exportar a Excel
          </vs-button>
        </div>

        <div class="flex flex-wrap gap-3">
          <vs-chip color="primary" transparent>
            <span class="font-semibold">Documentos Totales:</span>&nbsp;<b>{{ totalVentas }}</b>
          </vs-chip>
          <vs-chip color="success" transparent>
            <span class="font-semibold">Valor Total:</span>&nbsp;<b>${{ formatCurrency(totalValor) }}</b>
          </vs-chip>
        </div>
      </div>

      <!-- Filtro por período + modo de vista -->
      <div class="mb-4 flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-64">
          <label class="vs-input--label font-semibold mb-2">Período Escolar:</label>
          <v-select
            v-model="periodo_seleccionado"
            :options="periodos"
            placeholder="Seleccionar período"
            label="descripcion"
            :reduce="p => p.idperiodoescolar"
            class="w-full"
            @input="getData"
          >
            <template #no-options>No se encontraron períodos</template>
          </v-select>
        </div>

        <!-- Selector de modo de vista -->
        <div class="flex-1 min-w-64">
          <label class="vs-input--label font-semibold mb-2">Modo de Visualización:</label>
          <div class="flex gap-2">
            <vs-button
              :color="modo_vista === 'contratos' ? 'primary' : 'dark'"
              :type="modo_vista === 'contratos' ? 'filled' : 'flat'"
              @click="modo_vista = 'contratos'"
              icon-pack="feather" icon="icon-file-text"
            >Por Documentos</vs-button>
            <vs-button
              :color="modo_vista === 'libros' ? 'success' : 'dark'"
              :type="modo_vista === 'libros' ? 'filled' : 'flat'"
              @click="modo_vista = 'libros'"
              icon-pack="feather" icon="icon-book"
            >Por Libros</vs-button>
            <vs-button
              :color="modo_vista === 'combos' ? 'warning' : 'dark'"
              :type="modo_vista === 'combos' ? 'filled' : 'flat'"
              @click="modo_vista = 'combos'"
              icon-pack="feather" icon="icon-package"
            >Por Combos</vs-button>
          </div>
        </div>
      </div>

      <!-- MODO 1: Tabla Por Documentos -->
      <div v-if="ventas.length > 0 && modo_vista === 'contratos'" class="overflow-x-auto">
        <vs-table max-items="10" search pagination :data="ventasFiltradas" class="master-table">
          <template slot="thead">
            <vs-th>Institución / Doc. Venta / Pedido / Ubicación</vs-th>
            <vs-th>Período</vs-th>
            <vs-th>Valor</vs-th>
            <vs-th>Fecha Envío</vs-th>

            <!-- Columnas dinámicas de niveles -->
            <vs-th v-for="nivel in niveles" :key="nivel" class="text-center font-bold text-xs bg-gray-200">
              {{ nivel }}
            </vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <div class="font-bold text-dark text-sm leading-tight mb-1">{{ tr.nombreInstitucion ? tr.nombreInstitucion.trim() : 'Sin Nombre' }}</div>

                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <span class="flex items-center">
                    <vs-icon icon="credit_card" size="14px" class="mr-1"></vs-icon>
                    RUC: {{ tr.ruc || 'N/A' }}
                  </span>
                  <span v-if="tr.telefonoInstitucion" class="flex items-center">
                    <vs-icon icon="phone" size="14px" class="mr-1"></vs-icon>
                    Tel: {{ tr.telefonoInstitucion }}
                  </span>
                  <span v-if="tr.email" class="flex items-center">
                    <vs-icon icon="mail" size="14px" class="mr-1"></vs-icon>
                    {{ tr.email }}
                  </span>
                  <span class="font-mono font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded text-xs border border-solid border-primary-light">
                    Doc. Venta: {{ tr.ven_codigo }}
                  </span>
                  <span v-if="tr.pedido_codigo" class="font-mono font-bold text-warning bg-warning-light px-1.5 py-0.5 rounded text-xs">
                    Pedido: {{ tr.pedido_codigo }}
                  </span>
                  <span v-if="tr.tipo_institucion" class="flex items-center">
                    <vs-icon :icon="tr.tipo_institucion === 'Punto de venta' ? 'store' : 'school'" size="14px" :class="tr.tipo_institucion === 'Punto de venta' ? 'text-warning' : 'text-success'" class="mr-1"></vs-icon>
                    <b :class="tr.tipo_institucion === 'Punto de venta' ? 'text-warning' : 'text-success'">{{ tr.tipo_institucion }}</b>
                  </span>
                </div>

                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2">
                  <vs-icon icon="place" size="14px" class="text-danger"></vs-icon>
                  <span class="font-semibold text-dark">
                    {{ tr.nombre_ciudad || 'N/A' }}<span v-if="tr.parroquia_nombre"> - {{ tr.parroquia_nombre }}</span> ({{ tr.nombreprovincia || 'N/A' }})
                  </span>
                  <span v-if="tr.direccionInstitucion" class="italic text-gray-400">- {{ tr.direccionInstitucion }}</span>
                </div>
              </vs-td>

              <!-- Período Escolar -->
              <vs-td>
                <vs-chip color="success" transparent class="font-bold">
                  {{ tr.periodo_escolar || 'N/A' }}
                </vs-chip>
              </vs-td>

              <!-- Valor -->
              <vs-td>
                <span class="text-sm font-bold text-success">${{ formatCurrency(tr.ven_valor) }}</span>
              </vs-td>

              <!-- Fecha Envío -->
              <vs-td>
                <div class="text-xs font-medium">{{ formatDate(tr.fecha_envio_perseo) }}</div>
              </vs-td>

              <!-- Valores dinámicos por nivel -->
              <vs-td v-for="nivel in niveles" :key="nivel" class="text-center font-bold">
                <span :class="getValorNivel(tr, nivel) > 0 ? 'text-primary text-base font-black' : 'text-gray-300 font-light'">
                  {{ getValorNivel(tr, nivel) }}
                </span>
              </vs-td>

              <!-- Detalles Expandibles -->
              <template slot="expand">
                <div class="p-5 bg-detail-container rounded-lg shadow-inner w-full">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="font-bold text-primary flex items-center text-lg">
                      <vs-icon icon="assignment" class="mr-2" size="20px"></vs-icon>
                      Productos del Documento: <span class="font-mono text-dark ml-2 font-black">{{ tr.ven_codigo }}</span>
                    </h5>
                    <vs-chip color="primary" class="font-bold">
                      Items: {{ getDetallesFiltrados(tr.detalles).length }}
                    </vs-chip>
                  </div>

                  <div v-if="tr.detalles && tr.detalles.length > 0" class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="getDetallesFiltrados(tr.detalles)" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Código Producto</vs-th>
                        <vs-th>Descripción</vs-th>
                        <vs-th>Libro Prolipa</vs-th>
                        <vs-th>Nivel</vs-th>
                        <vs-th class="text-center">Cant. Solicitada</vs-th>
                        <vs-th class="text-center">Cant. Real</vs-th>
                        <vs-th>Precio Unit.</vs-th>
                        <vs-th>Valor Total</vs-th>
                      </template>
                      <template slot-scope="{data: details}">
                        <vs-tr :key="idx" v-for="(det, idx) in details" :class="det.desdeCombo === 1 ? 'row-segregado' : ''">
                          <vs-td>
                            <span class="font-mono text-xs font-bold px-2 py-1 rounded"
                                  :class="det.desdeCombo === 1 ? 'text-warning bg-warning-light' : 'text-primary bg-primary-light'">
                              {{ det.pro_codigo }}
                            </span>
                            <div v-if="det.desdeCombo === 1" class="mt-1">
                              <vs-chip color="warning" class="text-xs">
                                <vs-icon icon="call_split" size="10px" class="mr-1"></vs-icon>
                                Del combo: {{ det.combo_segregado_codigo }}
                              </vs-chip>
                            </div>
                          </vs-td>
                          <vs-td class="font-medium text-dark text-xs">{{ det.pro_nombre }}</vs-td>
                          <vs-td class="font-semibold text-primary text-xs">{{ det.nombre_libro_prolipa || 'No mapeado' }}</vs-td>
                          <vs-td>
                            <vs-chip v-if="det.nombrenivel" color="success" transparent class="font-bold">{{ det.nombrenivel }}</vs-chip>
                            <span v-else class="text-gray-400">-</span>
                          </vs-td>
                          <vs-td class="text-center font-bold">{{ det.det_ven_cantidad }}</vs-td>
                          <vs-td class="text-center font-bold text-warning">{{ det.det_ven_cantidad_real }}</vs-td>
                          <vs-td class="font-semibold text-dark">${{ formatCurrency(det.det_ven_valor_u) }}</vs-td>
                          <vs-td>
                            <span class="font-extrabold text-success">
                              ${{ formatCurrency(Number(det.det_ven_cantidad) * Number(det.det_ven_valor_u)) }}
                            </span>
                          </vs-td>
                        </vs-tr>
                      </template>
                    </vs-table>
                  </div>

                  <div v-else class="p-5 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    <vs-icon icon="info" size="30px" color="warning" class="mb-2"></vs-icon>
                    <p class="italic font-medium">No se registran productos asociados a este documento.</p>
                  </div>
                </div>
              </template>
            </vs-tr>

            <!-- Fila de Totales Generales -->
            <vs-tr class="total-row font-black">
              <vs-td><b>TOTAL GENERAL</b></vs-td>
              <vs-td class="text-center">-</vs-td>
              <vs-td class="text-success"><b>${{ formatCurrency(totalValor) }}</b></vs-td>
              <vs-td class="text-center">-</vs-td>
              <vs-td v-for="nivel in niveles" :key="'total-'+nivel" class="text-center text-primary text-base font-black">
                {{ getTotalNivel(nivel) }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <!-- MODO 2: Tabla Por Libros -->
      <div v-if="ventas.length > 0 && modo_vista === 'libros'" class="overflow-x-auto">
        <vs-table max-items="10" search pagination :data="datosPorLibro" class="master-table">
          <template slot="thead">
            <vs-th>Código / Producto / Nivel</vs-th>
            <vs-th class="text-center">Cant. Total</vs-th>
            <vs-th class="text-center">Cant. Real Total</vs-th>
            <vs-th>Precio Unit.</vs-th>
            <vs-th>Valor Total</vs-th>
            <vs-th class="text-center"># Documentos</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <div class="font-bold text-dark text-sm leading-tight mb-1">{{ tr.nombre_libro_prolipa || tr.pro_nombre }}</div>
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="font-mono font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded text-xs">{{ tr.pro_codigo }}</span>
                  <vs-chip v-if="tr.nombrenivel" color="success" transparent class="font-bold m-0 px-2 py-0.5 text-xs">{{ tr.nombrenivel }}</vs-chip>
                </div>
              </vs-td>
              <vs-td class="text-center"><span class="text-lg font-black text-primary">{{ tr.cantidad_total }}</span></vs-td>
              <vs-td class="text-center"><span class="text-lg font-black text-warning">{{ tr.cantidad_real_total }}</span></vs-td>
              <vs-td><span class="font-semibold text-dark">${{ formatCurrency(tr.valor_unitario) }}</span></vs-td>
              <vs-td><span class="text-base font-extrabold text-success">${{ formatCurrency(tr.valor_total) }}</span></vs-td>
              <vs-td class="text-center">
                <vs-chip color="primary" class="font-bold">{{ tr.contratos.length }} {{ tr.contratos.length === 1 ? 'documento' : 'documentos' }}</vs-chip>
              </vs-td>

              <template slot="expand">
                <div class="p-5 bg-detail-container rounded-lg shadow-inner w-full">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="font-bold text-success flex items-center text-lg">
                      <vs-icon icon="description" class="mr-2" size="20px"></vs-icon>
                      Documentos donde aparece: <span class="font-mono text-dark ml-2 font-black">{{ tr.pro_codigo }}</span>
                    </h5>
                    <vs-chip color="success" class="font-bold">{{ tr.contratos.length }} Documentos</vs-chip>
                  </div>
                  <div class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="tr.contratos" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Doc. Venta</vs-th>
                        <vs-th>Pedido</vs-th>
                        <vs-th>Institución</vs-th>
                        <vs-th>Período</vs-th>
                        <vs-th class="text-center">Cantidad</vs-th>
                        <vs-th class="text-center">Cant. Real</vs-th>
                        <vs-th>Precio Unit.</vs-th>
                        <vs-th>Subtotal</vs-th>
                        <vs-th>Fecha</vs-th>
                      </template>
                      <template slot-scope="{data: contratos}">
                        <vs-tr :key="idx" v-for="(contrato, idx) in contratos">
                          <vs-td><span class="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-1 rounded">{{ contrato.ven_codigo }}</span></vs-td>
                          <vs-td>
                            <span v-if="contrato.pedido_codigo" class="font-mono text-xs font-bold text-warning bg-warning-light px-2 py-1 rounded">{{ contrato.pedido_codigo }}</span>
                            <span v-else class="text-gray-400">-</span>
                          </vs-td>
                          <vs-td class="font-medium text-dark text-xs">{{ contrato.ins_nombre }}</vs-td>
                          <vs-td><vs-chip color="success" transparent class="font-bold">{{ contrato.periodo_escolar }}</vs-chip></vs-td>
                          <vs-td class="text-center font-bold">{{ contrato.cantidad }}</vs-td>
                          <vs-td class="text-center font-bold text-warning">{{ contrato.cantidad_real }}</vs-td>
                          <vs-td class="font-semibold text-dark">${{ formatCurrency(contrato.valor_unitario) }}</vs-td>
                          <vs-td><span class="font-extrabold text-success">${{ formatCurrency(contrato.subtotal) }}</span></vs-td>
                          <vs-td class="text-xs">{{ formatDate(contrato.ven_fecha) }}</vs-td>
                        </vs-tr>
                      </template>
                    </vs-table>
                  </div>
                </div>
              </template>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <!-- MODO 3: Tabla Por Combos -->
      <div v-if="ventas.length > 0 && modo_vista === 'combos'" class="overflow-x-auto">
        <vs-table max-items="10" search pagination :data="datosPorCombo" class="master-table">
          <template slot="thead">
            <vs-th>Código / Combo / Códigos Asociados</vs-th>
            <vs-th class="text-center">Cant. Total</vs-th>
            <vs-th class="text-center">Cant. Real Total</vs-th>
            <vs-th>Precio Unit.</vs-th>
            <vs-th>Valor Total</vs-th>
            <vs-th class="text-center"># Documentos</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <div class="font-bold text-dark text-sm leading-tight mb-1">{{ tr.nombre_libro_prolipa || tr.pro_nombre }}</div>
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="font-mono font-bold text-warning bg-warning-light px-1.5 py-0.5 rounded text-xs">{{ tr.pro_codigo }}</span>
                  <vs-chip v-if="tr.nombrenivel" color="success" transparent class="font-bold m-0 px-2 py-0.5 text-xs">{{ tr.nombrenivel }}</vs-chip>
                </div>
                <div v-if="tr.codigos_combos" class="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                  <span class="font-semibold">Códigos asociados:</span> {{ tr.codigos_combos }}
                </div>
              </vs-td>
              <vs-td class="text-center"><span class="text-lg font-black text-warning">{{ tr.cantidad_total }}</span></vs-td>
              <vs-td class="text-center"><span class="text-lg font-black text-danger">{{ tr.cantidad_real_total }}</span></vs-td>
              <vs-td><span class="font-semibold text-dark">${{ formatCurrency(tr.valor_unitario) }}</span></vs-td>
              <vs-td><span class="text-base font-extrabold text-success">${{ formatCurrency(tr.valor_total) }}</span></vs-td>
              <vs-td class="text-center">
                <vs-chip color="warning" class="font-bold">{{ tr.contratos.length }} {{ tr.contratos.length === 1 ? 'documento' : 'documentos' }}</vs-chip>
              </vs-td>

              <template slot="expand">
                <div class="p-5 bg-detail-container rounded-lg shadow-inner w-full">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="font-bold text-warning flex items-center text-lg">
                      <vs-icon icon="card_giftcard" class="mr-2" size="20px"></vs-icon>
                      Documentos del combo: <span class="font-mono text-dark ml-2 font-black">{{ tr.pro_codigo }}</span>
                    </h5>
                    <vs-chip color="warning" class="font-bold">{{ tr.contratos.length }} Documentos</vs-chip>
                  </div>
                  <div class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="tr.contratos" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Doc. Venta</vs-th>
                        <vs-th>Pedido</vs-th>
                        <vs-th>Institución</vs-th>
                        <vs-th>Período</vs-th>
                        <vs-th class="text-center">Cantidad</vs-th>
                        <vs-th class="text-center">Cant. Real</vs-th>
                        <vs-th>Precio Unit.</vs-th>
                        <vs-th>Subtotal</vs-th>
                        <vs-th>Fecha</vs-th>
                      </template>
                      <template slot-scope="{data: contratos}">
                        <vs-tr :key="idx" v-for="(contrato, idx) in contratos">
                          <vs-td><span class="font-mono text-xs font-bold text-warning bg-warning-light px-2 py-1 rounded">{{ contrato.ven_codigo }}</span></vs-td>
                          <vs-td>
                            <span v-if="contrato.pedido_codigo" class="font-mono text-xs font-bold text-warning bg-warning-light px-2 py-1 rounded">{{ contrato.pedido_codigo }}</span>
                            <span v-else class="text-gray-400">-</span>
                          </vs-td>
                          <vs-td class="font-medium text-dark text-xs">{{ contrato.ins_nombre }}</vs-td>
                          <vs-td><vs-chip color="success" transparent class="font-bold">{{ contrato.periodo_escolar }}</vs-chip></vs-td>
                          <vs-td class="text-center font-bold">{{ contrato.cantidad }}</vs-td>
                          <vs-td class="text-center font-bold text-warning">{{ contrato.cantidad_real }}</vs-td>
                          <vs-td class="font-semibold text-dark">${{ formatCurrency(contrato.valor_unitario) }}</vs-td>
                          <vs-td><span class="font-extrabold text-success">${{ formatCurrency(contrato.subtotal) }}</span></vs-td>
                          <vs-td class="text-xs">{{ formatDate(contrato.ven_fecha) }}</vs-td>
                        </vs-tr>
                      </template>
                    </vs-table>
                  </div>
                </div>
              </template>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <!-- Estado vacío -->
      <div v-if="ventas.length === 0" class="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <vs-icon icon="cloud_download" size="60px" color="primary" class="mb-4 animate-bounce"></vs-icon>
        <h4 class="text-gray-600 font-bold mb-2">No se han cargado datos</h4>
        <p class="text-gray-400 mb-5 max-w-md mx-auto">Selecciona un período y haz clic en "Actualizar Datos" para cargar la información de ventas Prolipa.</p>
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
      ventas: [],
      periodos: [],
      periodo_seleccionado: null,
      modo_vista: 'contratos'
    };
  },
  computed: {
    totalVentas() {
      return this.ventas.length;
    },
    totalValor() {
      return this.ventas.reduce((sum, item) => sum + (Number(item.ven_valor) || 0), 0);
    },
    ventasFiltradas() {
      return [...this.ventas].sort((a, b) => {
        const pA = a.periodo_escolar || '';
        const pB = b.periodo_escolar || '';
        if (pA !== pB) return pA.localeCompare(pB);
        const nA = a.nombreInstitucion ? a.nombreInstitucion.trim().toLowerCase() : '';
        const nB = b.nombreInstitucion ? b.nombreInstitucion.trim().toLowerCase() : '';
        return nA.localeCompare(nB);
      });
    },
    // Agrupar por libro (ifcombo = 0)
    datosPorLibro() {
      const libroMap = {};
      this.ventasFiltradas.forEach(venta => {
        if (!venta.detalles) return;
        venta.detalles.forEach(detalle => {
          if (detalle.ifcombo !== 0) return;
          const key = detalle.pro_codigo ? detalle.pro_codigo.toUpperCase() : '';
          if (!libroMap[key]) {
            libroMap[key] = {
              pro_codigo: key,
              pro_nombre: detalle.pro_nombre,
              nombre_libro_prolipa: detalle.nombre_libro_prolipa,
              nombrenivel: detalle.nombrenivel,
              cantidad_total: 0,
              cantidad_real_total: 0,
              valor_unitario: detalle.det_ven_valor_u,
              valor_total: 0,
              contratos: []
            };
          }
          libroMap[key].cantidad_total += Number(detalle.det_ven_cantidad) || 0;
          libroMap[key].cantidad_real_total += Number(detalle.det_ven_cantidad_real) || 0;
          libroMap[key].valor_total += (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0);
          libroMap[key].contratos.push({
            ven_codigo: venta.ven_codigo,
            pedido_codigo: venta.pedido_codigo,
            ins_nombre: venta.nombreInstitucion,
            periodo_escolar: venta.periodo_escolar,
            cantidad: detalle.det_ven_cantidad,
            cantidad_real: detalle.det_ven_cantidad_real,
            valor_unitario: detalle.det_ven_valor_u,
            subtotal: (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0),
            ven_fecha: venta.fecha_envio_perseo
          });
        });
      });
      return Object.values(libroMap).sort((a, b) => b.cantidad_total - a.cantidad_total);
    },
    // Agrupar por combo (ifcombo = 1)
    datosPorCombo() {
      const comboMap = {};
      this.ventasFiltradas.forEach(venta => {
        if (!venta.detalles) return;
        venta.detalles.forEach(detalle => {
          if (detalle.ifcombo !== 1) return;
          const key = detalle.pro_codigo ? detalle.pro_codigo.toUpperCase() : '';
          if (!comboMap[key]) {
            comboMap[key] = {
              pro_codigo: key,
              pro_nombre: detalle.pro_nombre,
              nombre_libro_prolipa: detalle.nombre_libro_prolipa,
              nombrenivel: detalle.nombrenivel,
              codigos_combos: detalle.codigos_combos,
              cantidad_total: 0,
              cantidad_real_total: 0,
              valor_unitario: detalle.det_ven_valor_u,
              valor_total: 0,
              contratos: []
            };
          }
          comboMap[key].cantidad_total += Number(detalle.det_ven_cantidad) || 0;
          comboMap[key].cantidad_real_total += Number(detalle.det_ven_cantidad_real) || 0;
          comboMap[key].valor_total += (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0);
          comboMap[key].contratos.push({
            ven_codigo: venta.ven_codigo,
            pedido_codigo: venta.pedido_codigo,
            ins_nombre: venta.nombreInstitucion,
            periodo_escolar: venta.periodo_escolar,
            cantidad: detalle.det_ven_cantidad,
            cantidad_real: detalle.det_ven_cantidad_real,
            valor_unitario: detalle.det_ven_valor_u,
            subtotal: (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0),
            ven_fecha: venta.fecha_envio_perseo
          });
        });
      });
      return Object.values(comboMap).sort((a, b) => b.cantidad_total - a.cantidad_total);
    },
    // Niveles únicos ordenados (excluyendo combos)
    niveles() {
      const list = new Set();
      this.ventas.forEach(v => {
        if (v.detalles) {
          v.detalles.forEach(d => {
            if (d.nombrenivel && d.ifcombo !== 1) {
              list.add(d.nombrenivel.trim());
            }
          });
        }
      });
      const arr = Array.from(list);
      const levelOrder = [
        'inicial 1','inicial i','inicial 2','inicial ii',
        '1er año','1er año básica','1er grado','1 grado',
        '2do año','2do año básica','2 grado',
        '3er año','3er año básica','3 grado',
        '4to año','4to año básica','4 grado',
        '5to año','5to año básica','5 grado',
        '6to año','6to año básica','6 grado',
        '7mo año','7mo año básica','7 grado',
        '8vo año','8vo año básica','8 grado',
        '9no año','9no año básica','9 grado',
        '10mo año','10mo año básica','10 grado',
        '1er bgu','1ero bgu','2do bgu','3er bgu','3ero bgu'
      ];
      return arr.sort((a, b) => {
        const idxA = levelOrder.indexOf(a.toLowerCase());
        const idxB = levelOrder.indexOf(b.toLowerCase());
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      });
    }
  },
  mounted() {
    this.getPeriodos().then(() => {
      this.getData();
    });
  },
  methods: {
    getDetallesFiltrados(detalles) {
      if (!detalles || !Array.isArray(detalles)) return [];
      return detalles.filter(d => parseInt(d.ifcombo) !== 1);
    },
    getPeriodos() {
      let me = this;
      const url = (me.$server_url || 'http://localhost:8000/') + 'periodo';
      return me.$http.get(url)
        .then(res => {
          let list = Array.isArray(res.data) ? res.data : (res.data.data || []);
          me.periodos = list;

          // Seleccionar Costa 2026 por defecto (id=29)
          const defaultPeriod = list.find(p =>
            p.idperiodoescolar === 29 ||
            (p.descripcion && p.descripcion.toLowerCase().includes('costa 2026')) ||
            (p.periodoescolar && p.periodoescolar.toLowerCase().includes('costa 2026'))
          );
          if (defaultPeriod) {
            me.periodo_seleccionado = defaultPeriod.idperiodoescolar;
          } else if (list.length > 0) {
            // Fallback: último período disponible
            me.periodo_seleccionado = list[list.length - 1].idperiodoescolar;
          }
        })
        .catch(err => {
          console.error('Error al cargar períodos:', err);
          // Fallback: usar id 29 directamente si falla la carga
          me.periodo_seleccionado = 29;
        });
    },
    getData() {
      let me = this;
      if (!me.periodo_seleccionado) return;

      me.$vs.loading({ title: 'Cargando datos Prolipa...', color: '#7367F0' });

      const url = (me.$server_url || 'http://localhost:8000/') +
        'migracion_iluminar/migracion?action=Get_Data_Prolipa&periodo_id=' + me.periodo_seleccionado;

      me.$http.get(url)
        .then(res => {
          let rawData = [];
          if (res.data && Array.isArray(res.data)) {
            rawData = res.data;
          } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            rawData = res.data.data;
          }
          me.ventas = rawData;
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Sincronización Exitosa',
            text: `Se cargaron ${me.ventas.length} registros de Prolipa.`,
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
            text: 'No se pudo obtener la información de Prolipa.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        });
    },
    getValorNivel(venta, nivel) {
      if (!venta.detalles) return 0;
      return venta.detalles
        .filter(d => d.nombrenivel && d.nombrenivel.trim() === nivel && d.ifcombo !== 1)
        .reduce((sum, d) => {
          const cant = (d.det_ven_cantidad_real !== undefined && d.det_ven_cantidad_real !== null)
            ? Number(d.det_ven_cantidad_real)
            : Number(d.det_ven_cantidad || 0);
          return sum + cant;
        }, 0);
    },
    getTotalNivel(nivel) {
      return this.ventas.reduce((sum, v) => sum + this.getValorNivel(v, nivel), 0);
    },
    exportToExcel() {
      let me = this;
      if (me.ventas.length === 0) {
        me.$vs.notify({ title: 'Atención', text: 'No hay datos para exportar.', color: 'warning' });
        return;
      }
      me.$vs.loading({ title: 'Generando Excel...', color: '#7367F0' });

      setTimeout(() => {
        try {
          const workbook = XLSX.utils.book_new();

          const crearDatosHoja = (ventasParaHoja) => {
            const rows = ventasParaHoja.map(v => {
              const row = {
                'Periodo escolar': v.periodo_escolar || 'N/A',
                'Institución': v.nombreInstitucion ? v.nombreInstitucion.trim() : 'Sin Nombre',
                'RUC': v.ruc || 'N/A',
                'Teléfono': v.telefonoInstitucion || 'N/A',
                'Provincia': v.nombreprovincia || 'N/A',
                'Ciudad': v.nombre_ciudad || 'N/A',
                'Parroquia': v.parroquia_nombre || 'N/A',
                'Dirección': v.direccionInstitucion || 'Sin dirección',
                'Email': v.email || 'N/A',
                'Doc. Venta': v.ven_codigo,
                'N° Pedido': v.pedido_codigo || 'N/A',
                'Valor Neto ($)': Number(v.ven_valor) || 0,
                'Fecha Envío': me.formatDate(v.fecha_envio_perseo),
                'Tipo de Escuela': v.tipo_institucion || 'N/A'
              };

              let totalUnidades = 0;
              me.niveles.forEach(nivel => {
                const valorNivel = me.getValorNivel(v, nivel);
                row[nivel] = valorNivel;
                totalUnidades += valorNivel;
              });
              row['Total textos escolares comercializados (unidades)'] = totalUnidades;
              return row;
            });

            const totalValorHoja = ventasParaHoja.reduce((sum, v) => sum + (Number(v.ven_valor) || 0), 0);
            const totalsRow = {
              'Periodo escolar': 'TOTAL', 'Institución': '', 'RUC': '', 'Teléfono': '',
              'Provincia': '', 'Ciudad': '', 'Parroquia': '', 'Dirección': '', 'Email': '',
              'Doc. Venta': '', 'N° Pedido': '', 'Valor Neto ($)': totalValorHoja,
              'Fecha Envío': '', 'Tipo de Escuela': ''
            };

            let totalGeneralUnidades = 0;
            me.niveles.forEach(nivel => {
              const totalNivel = ventasParaHoja.reduce((sum, v) => sum + me.getValorNivel(v, nivel), 0);
              totalsRow[nivel] = totalNivel;
              totalGeneralUnidades += totalNivel;
            });
            totalsRow['Total textos escolares comercializados (unidades)'] = totalGeneralUnidades;
            rows.push(totalsRow);
            return rows;
          };

          // Hoja: Todos
          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(crearDatosHoja(me.ventas)), 'Todos');

          // Hojas por período único presente en los datos
          const periodosUnicos = [...new Set(me.ventas.map(v => v.periodo_escolar).filter(Boolean))];
          periodosUnicos.forEach(p => {
            const ventasPeriodo = me.ventas.filter(v => v.periodo_escolar === p);
            if (ventasPeriodo.length > 0) {
              const sheetName = p.substring(0, 31).replace(/[\\*?:/[\]]/g, '');
              XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(crearDatosHoja(ventasPeriodo)), sheetName);
            }
          });

          XLSX.writeFile(workbook, 'Resumen_Ventas_Prolipa.xlsx');
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
    },
    formatCurrency(value) {
      if (value === undefined || value === null) return '0.00';
      return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      try { return dateStr.split(' ')[0] || dateStr; } catch (e) { return dateStr; }
    }
  }
};
</script>

<style scoped>
.master-table { margin-top: 1.5rem; }
.bg-detail-container { background-color: #f6f8fb; border-left: 4px solid #7367f0; }
.detail-table { background-color: #ffffff !important; }
.bg-primary-light { background-color: rgba(115, 103, 240, 0.1); }
.bg-warning-light { background-color: rgba(255, 159, 67, 0.1); }
.text-primary { color: #7367f0; }
.font-mono { font-family: 'Consolas', 'Courier New', Courier, monospace; }
.animate-bounce { animation: bounce 2s infinite; }
.total-row { background-color: #eaecef !important; border-top: 3px double #7367f0; }
.font-black { font-weight: 900; }
.row-segregado { background-color: rgba(255, 159, 67, 0.05) !important; border-left: 3px solid #ff9f43 !important; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0,0,0.2,1); }
}
</style>
