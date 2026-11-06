<template>
  <div class="p-6">
    <vx-card title="Datos de Venta - Milton" title-color="primary" class="shadow-lg">
      
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
            <span class="font-semibold">Ventas Totales:</span>&nbsp;<b>{{ totalVentas }}</b>
          </vs-chip>
          <vs-chip color="success" transparent>
            <span class="font-semibold">Valor Total:</span>&nbsp;<b>${{ formatCurrency(totalValor) }}</b>
          </vs-chip>
          <!-- <vs-chip color="warning" transparent>
            <span class="font-semibold">Descuento Promedio:</span>&nbsp;<b>{{ avgDescuento }}%</b>
          </vs-chip> -->
        </div>
      </div>

      <!-- Filtro por período -->
      <div class="mb-4 flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-64">
          <label class="vs-input--label font-semibold mb-2">Filtrar por Período Escolar:</label>
          <v-select
            v-model="filtro_periodo"
            :options="periodos_opciones"
            placeholder="Seleccionar período"
            label="text"
            :reduce="periodo => periodo.value"
            class="w-full"
          >
            <template #no-options>
              No se encontraron períodos
            </template>
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
              icon-pack="feather"
              icon="icon-file-text"
            >
              Por Documentos
            </vs-button>
            <vs-button 
              :color="modo_vista === 'libros' ? 'success' : 'dark'" 
              :type="modo_vista === 'libros' ? 'filled' : 'flat'"
              @click="modo_vista = 'libros'"
              icon-pack="feather"
              icon="icon-book"
            >
              Por Libros
            </vs-button>
            <vs-button 
              :color="modo_vista === 'combos' ? 'warning' : 'dark'" 
              :type="modo_vista === 'combos' ? 'filled' : 'flat'"
              @click="modo_vista = 'combos'"
              icon-pack="feather"
              icon="icon-package"
            >
              Por Combos
            </vs-button>
          </div>
        </div>
      </div>

      <!-- Tabla Principal (Padre) con columnas dinámicas por nivel -->
      <div v-if="ventas.length > 0 && modo_vista === 'contratos'" class="overflow-x-auto">
        <vs-table max-items="10" search pagination :data="ventasFiltradas" class="master-table">
          <template slot="thead">
            <vs-th>Institución / Documento / Ubicación</vs-th>
            <vs-th>Período</vs-th>
            <vs-th>Valor</vs-th>
            <!-- <vs-th>Descuento</vs-th> -->
            <vs-th>Fecha</vs-th>
            
            <!-- Columnas dinámicas de niveles -->
            <vs-th v-for="nivel in niveles" :key="nivel" class="text-center font-bold text-xs bg-gray-200">
              {{ nivel }}
            </vs-th>
          </template>

          <template slot-scope="{data}">
            <!-- Filas de datos -->
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <!-- Nombre, Info de la Institución, Documento y Ubicación en una sola celda -->
              <vs-td>
                <div class="font-bold text-dark text-sm leading-tight mb-1">{{ tr.ins_nombre ? tr.ins_nombre.trim() : 'Sin Nombre' }}</div>
                
                <!-- RUC, Correo y Código de Venta -->
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <span class="flex items-center">
                    <vs-icon icon="credit_card" size="14px" class="mr-1"></vs-icon>
                    RUC: {{ tr.ins_ruc || 'N/A' }}
                  </span>
                  <span v-if="tr.ins_telefono" class="flex items-center">
                    <vs-icon icon="phone" size="14px" class="mr-1"></vs-icon>
                    Tel: {{ tr.ins_telefono }}
                  </span>
                  <span v-if="tr.ins_mail" class="flex items-center">
                    <vs-icon icon="mail" size="14px" class="mr-1"></vs-icon>
                    {{ tr.ins_mail }}
                  </span>
                  <span class="font-mono font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded text-xs border border-solid border-primary-light">
                    Documento: {{ tr.ven_codigo }}
                  </span>
                  <span v-if="tr.tipo_institucion" class="flex items-center">
                    <vs-icon :icon="tr.tipo_institucion === 'Punto de venta' ? 'store' : 'school'" size="14px" :class="tr.tipo_institucion === 'Punto de venta' ? 'text-warning' : 'text-success'" class="mr-1"></vs-icon>
                    <b :class="tr.tipo_institucion === 'Punto de venta' ? 'text-warning' : 'text-success'">{{ tr.tipo_institucion }}</b>
                  </span>
                </div>

                <!-- Ubicación y dirección -->
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2">
                  <vs-icon icon="place" size="14px" class="text-danger"></vs-icon>
                  <span class="font-semibold text-dark">{{ tr.CIU_NOMBRE || 'N/A' }} - {{ tr.parroquia_nombre || '' }} ({{ tr.provi_nombre || 'N/A' }})</span>
                  <span v-if="tr.ins_direccion" class="italic text-gray-400">- {{ tr.ins_direccion }}</span>
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

              <!-- Descuento -->
              <!-- <vs-td>
                <span class="font-bold">{{ tr.ven_descuento }}%</span>
              </vs-td> -->

              <!-- Fecha -->
              <vs-td>
                <div class="text-xs font-medium">{{ formatDate(tr.ven_fecha) }}</div>
              </vs-td>

              <!-- Valores dinámicos por nivel -->
              <vs-td v-for="nivel in niveles" :key="nivel" class="text-center font-bold">
                <span :class="getValorNivel(tr, nivel) > 0 ? 'text-primary text-base font-black' : 'text-gray-300 font-light'">
                  {{ getValorNivel(tr, nivel) }}
                </span>
              </vs-td>

              <!-- Detalles del Hijo (Slot Expandible tradicional) -->
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

                  <!-- Tabla de Detalles (Hijo) -->
                  <div v-if="tr.detalles && tr.detalles.length > 0" class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="getDetallesFiltrados(tr.detalles)" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Código Producto</vs-th>
                        <vs-th>Descripción del Producto</vs-th>
                        <vs-th>Libro Prolipa</vs-th>
                        <vs-th>Nivel</vs-th>
                        <vs-th class="text-center">Cant. Solicitada</vs-th>
                        <vs-th class="text-center">Cant. Entregada (Real)</vs-th>
                        <vs-th>Precio Unitario</vs-th>
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
                          <vs-td class="font-medium text-dark text-xs">
                            {{ det.pro_nombre }}
                          </vs-td>
                          <vs-td class="font-semibold text-primary text-xs">
                            {{ det.nombre_libro_prolipa || 'No mapeado' }}
                          </vs-td>
                          <vs-td>
                            <vs-chip v-if="det.nombrenivel" color="success" transparent class="font-bold">
                              {{ det.nombrenivel }}
                            </vs-chip>
                            <span v-else class="text-gray-400">-</span>
                          </vs-td>
                          <vs-td class="text-center font-bold">
                            {{ det.det_ven_cantidad }}
                          </vs-td>
                          <vs-td class="text-center font-bold text-warning">
                            {{ det.det_ven_cantidad_real }}
                          </vs-td>
                          <vs-td class="font-semibold text-dark">
                            ${{ formatCurrency(det.det_ven_valor_u) }}
                          </vs-td>
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
                    <p class="italic font-medium">No se registran productos asociados a esta venta en Milton.</p>
                  </div>
                </div>
              </template>
            </vs-tr>

            <!-- Fila de Totales Generales (Footer de Tabla) -->
            <vs-tr class="total-row font-black">
              <vs-td><b>TOTAL GENERAL</b></vs-td>
              <vs-td class="text-center">-</vs-td>
              <vs-td class="text-success"><b>${{ formatCurrency(totalValor) }}</b></vs-td>
              <vs-td class="text-center">-</vs-td>
              <vs-td class="text-center">-</vs-td>
              
              <!-- Totales por nivel -->
              <vs-td v-for="nivel in niveles" :key="'total-'+nivel" class="text-center text-primary text-base font-black">
                {{ getTotalNivel(nivel) }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <!-- MODO 2: Tabla Por Libros (Producto → Contratos) -->
      <div v-if="ventas.length > 0 && modo_vista === 'libros'" class="overflow-x-auto">
        <vs-table max-items="10" search pagination :data="datosPorLibro" class="master-table">
          <template slot="thead">
            <vs-th>Código / Producto / Nivel</vs-th>
            <vs-th class="text-center">Cant. Total</vs-th>
            <vs-th class="text-center">Cant. Real Total</vs-th>
            <vs-th>Precio Unit.</vs-th>
            <vs-th>Valor Total</vs-th>
            <vs-th class="text-center"># Contratos</vs-th>
          </template>

          <template slot-scope="{data}">
            <!-- Filas de datos por libro -->
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <!-- Información del Libro -->
              <vs-td>
                <div class="font-bold text-dark text-sm leading-tight mb-1">
                  {{ tr.nombre_libro_prolipa || tr.pro_nombre }}
                </div>
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="font-mono font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded text-xs">
                    {{ tr.pro_codigo }}
                  </span>
                  <vs-chip v-if="tr.nombrenivel" color="success" transparent class="font-bold m-0 px-2 py-0.5 text-xs">
                    {{ tr.nombrenivel }}
                  </vs-chip>
                </div>
              </vs-td>

              <!-- Cantidad Total -->
              <vs-td class="text-center">
                <span class="text-lg font-black text-primary">{{ tr.cantidad_total }}</span>
              </vs-td>

              <!-- Cantidad Real Total -->
              <vs-td class="text-center">
                <span class="text-lg font-black text-warning">{{ tr.cantidad_real_total }}</span>
              </vs-td>

              <!-- Precio Unitario -->
              <vs-td>
                <span class="font-semibold text-dark">${{ formatCurrency(tr.valor_unitario) }}</span>
              </vs-td>

              <!-- Valor Total -->
              <vs-td>
                <span class="text-base font-extrabold text-success">${{ formatCurrency(tr.valor_total) }}</span>
              </vs-td>

              <!-- Número de Contratos -->
              <vs-td class="text-center">
                <vs-chip color="primary" class="font-bold">
                  {{ tr.contratos.length }} {{ tr.contratos.length === 1 ? 'contrato' : 'contratos' }}
                </vs-chip>
              </vs-td>

              <!-- Detalles expandibles: Lista de Contratos -->
              <template slot="expand">
                <div class="p-5 bg-detail-container rounded-lg shadow-inner w-full">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="font-bold text-success flex items-center text-lg">
                      <vs-icon icon="description" class="mr-2" size="20px"></vs-icon>
                      Contratos donde aparece: <span class="font-mono text-dark ml-2 font-black">{{ tr.pro_codigo }}</span>
                    </h5>
                    <vs-chip color="success" class="font-bold">
                      {{ tr.contratos.length }} Contratos
                    </vs-chip>
                  </div>

                  <!-- Tabla de Contratos -->
                  <div class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="tr.contratos" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Código Contrato</vs-th>
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
                          <vs-td>
                            <span class="font-mono text-xs font-bold text-primary bg-primary-light px-2 py-1 rounded">
                              {{ contrato.ven_codigo }}
                            </span>
                          </vs-td>
                          <vs-td class="font-medium text-dark text-xs">
                            {{ contrato.ins_nombre }}
                          </vs-td>
                          <vs-td>
                            <vs-chip color="success" transparent class="font-bold">
                              {{ contrato.periodo_escolar }}
                            </vs-chip>
                          </vs-td>
                          <vs-td class="text-center font-bold">
                            {{ contrato.cantidad }}
                          </vs-td>
                          <vs-td class="text-center font-bold text-warning">
                            {{ contrato.cantidad_real }}
                          </vs-td>
                          <vs-td class="font-semibold text-dark">
                            ${{ formatCurrency(contrato.valor_unitario) }}
                          </vs-td>
                          <vs-td>
                            <span class="font-extrabold text-success">
                              ${{ formatCurrency(contrato.subtotal) }}
                            </span>
                          </vs-td>
                          <vs-td class="text-xs">
                            {{ formatDate(contrato.ven_fecha) }}
                          </vs-td>
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

      <!-- MODO 3: Tabla Por Combos (Combos → Contratos) -->
      <div v-if="ventas.length > 0 && modo_vista === 'combos'" class="overflow-x-auto">
        <vs-table max-items="10" search pagination :data="datosPorCombo" class="master-table">
          <template slot="thead">
            <vs-th>Código / Combo / Códigos Asociados</vs-th>
            <vs-th class="text-center">Cant. Total</vs-th>
            <vs-th class="text-center">Cant. Real Total</vs-th>
            <vs-th>Precio Unit.</vs-th>
            <vs-th>Valor Total</vs-th>
            <vs-th class="text-center"># Contratos</vs-th>
          </template>

          <template slot-scope="{data}">
            <!-- Filas de datos por combo -->
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <!-- Información del Combo -->
              <vs-td>
                <div class="font-bold text-dark text-sm leading-tight mb-1">
                  {{ tr.nombre_libro_prolipa || tr.pro_nombre }}
                </div>
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="font-mono font-bold text-warning bg-warning-light px-1.5 py-0.5 rounded text-xs">
                    {{ tr.pro_codigo }}
                  </span>
                  <vs-chip v-if="tr.nombrenivel" color="success" transparent class="font-bold m-0 px-2 py-0.5 text-xs">
                    {{ tr.nombrenivel }}
                  </vs-chip>
                </div>
                <!-- Códigos del combo -->
                <div v-if="tr.codigos_combos" class="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                  <span class="font-semibold">Códigos asociados:</span> {{ tr.codigos_combos }}
                </div>
              </vs-td>

              <!-- Cantidad Total -->
              <vs-td class="text-center">
                <span class="text-lg font-black text-warning">{{ tr.cantidad_total }}</span>
              </vs-td>

              <!-- Cantidad Real Total -->
              <vs-td class="text-center">
                <span class="text-lg font-black text-danger">{{ tr.cantidad_real_total }}</span>
              </vs-td>

              <!-- Precio Unitario -->
              <vs-td>
                <span class="font-semibold text-dark">${{ formatCurrency(tr.valor_unitario) }}</span>
              </vs-td>

              <!-- Valor Total -->
              <vs-td>
                <span class="text-base font-extrabold text-success">${{ formatCurrency(tr.valor_total) }}</span>
              </vs-td>

              <!-- Número de Contratos -->
              <vs-td class="text-center">
                <vs-chip color="warning" class="font-bold">
                  {{ tr.contratos.length }} {{ tr.contratos.length === 1 ? 'contrato' : 'contratos' }}
                </vs-chip>
              </vs-td>

              <!-- Detalles expandibles: Lista de Contratos -->
              <template slot="expand">
                <div class="p-5 bg-detail-container rounded-lg shadow-inner w-full">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="font-bold text-warning flex items-center text-lg">
                      <vs-icon icon="card_giftcard" class="mr-2" size="20px"></vs-icon>
                      Contratos donde aparece el combo: <span class="font-mono text-dark ml-2 font-black">{{ tr.pro_codigo }}</span>
                    </h5>
                    <vs-chip color="warning" class="font-bold">
                      {{ tr.contratos.length }} Contratos
                    </vs-chip>
                  </div>

                  <!-- Tabla de Contratos -->
                  <div class="border border-solid border-gray-200 rounded-lg overflow-hidden bg-white">
                    <vs-table :data="tr.contratos" class="detail-table" striped>
                      <template slot="thead">
                        <vs-th>Código Contrato</vs-th>
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
                          <vs-td>
                            <span class="font-mono text-xs font-bold text-warning bg-warning-light px-2 py-1 rounded">
                              {{ contrato.ven_codigo }}
                            </span>
                          </vs-td>
                          <vs-td class="font-medium text-dark text-xs">
                            {{ contrato.ins_nombre }}
                          </vs-td>
                          <vs-td>
                            <vs-chip color="success" transparent class="font-bold">
                              {{ contrato.periodo_escolar }}
                            </vs-chip>
                          </vs-td>
                          <vs-td class="text-center font-bold">
                            {{ contrato.cantidad }}
                          </vs-td>
                          <vs-td class="text-center font-bold text-warning">
                            {{ contrato.cantidad_real }}
                          </vs-td>
                          <vs-td class="font-semibold text-dark">
                            ${{ formatCurrency(contrato.valor_unitario) }}
                          </vs-td>
                          <vs-td>
                            <span class="font-extrabold text-success">
                              ${{ formatCurrency(contrato.subtotal) }}
                            </span>
                          </vs-td>
                          <vs-td class="text-xs">
                            {{ formatDate(contrato.ven_fecha) }}
                          </vs-td>
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

      <!-- Estado de carga o sin datos -->
      <div v-if="ventas.length === 0" class="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <vs-icon icon="cloud_download" size="60px" color="primary" class="mb-4 animate-bounce"></vs-icon>
        <h4 class="text-gray-600 font-bold mb-2">No se han cargado datos</h4>
        <p class="text-gray-400 mb-5 max-w-md mx-auto">Haz clic en el botón a continuación para sincronizar y traer la información de venta directamente desde la base de datos de Milton.</p>
        <!-- <vs-button color="primary" type="gradient" icon-pack="feather" icon="icon-refresh-cw" @click="getData">
          Cargar Datos Milton
        </vs-button> -->
      </div>
    </vx-card>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  components: {
    'v-select': vSelect
  },
  data() {
    return {
      ventas: [],
      filtro_periodo: 'todos', // Filtro de período
      modo_vista: 'contratos', // 'contratos', 'libros' o 'combos'
      periodos_opciones: [
        { value: 'todos', text: 'Todos los períodos' },
        { value: '2022-2023', text: '2022-2023' },
        { value: '2023-2024', text: '2023-2024' },
        { value: '2024-2025', text: '2024-2025' }
      ]
    };
  },
  computed: {
    totalVentas() {
      return this.ventas.length;
    },
    totalValor() {
      return this.ventas.reduce((sum, item) => sum + (Number(item.ven_valor) || 0), 0);
    },
    // avgDescuento() {
    //   if (this.ventas.length === 0) return 0;
    //   const totalDesc = this.ventas.reduce((sum, item) => sum + (Number(item.ven_descuento) || 0), 0);
    //   return (totalDesc / this.ventas.length).toFixed(1);
    // },
    // Filtrar ventas según el período seleccionado y ordenar por período (2022 primero) e institución
    ventasFiltradas() {
      let filtered = [];
      if (this.filtro_periodo === 'todos') {
        filtered = [...this.ventas];
      } else {
        filtered = this.ventas.filter(v => v.periodo_escolar === this.filtro_periodo);
      }
      
      return filtered.sort((a, b) => {
        const pA = a.periodo_escolar || '';
        const pB = b.periodo_escolar || '';
        
        if (pA !== pB) {
          return pA.localeCompare(pB);
        }
        
        const nameA = a.ins_nombre ? a.ins_nombre.trim().toLowerCase() : '';
        const nameB = b.ins_nombre ? b.ins_nombre.trim().toLowerCase() : '';
        return nameA.localeCompare(nameB);
      });
    },
    // Agrupar datos por libro (para modo "Por Libros") - SOLO ifcombo = 0
    datosPorLibro() {
      const libroMap = {};
      
      this.ventasFiltradas.forEach(venta => {
        if (!venta.detalles) return;
        
        venta.detalles.forEach(detalle => {
          // FILTRAR SOLO LIBROS NORMALES (ifcombo = 0)
          if (detalle.ifcombo !== 0) return;
          
          // Normalizar el código a mayúsculas para agrupar correctamente (case insensitive)
          const key = detalle.pro_codigo ? detalle.pro_codigo.toUpperCase() : '';
          
          if (!libroMap[key]) {
            libroMap[key] = {
              pro_codigo: detalle.pro_codigo ? detalle.pro_codigo.toUpperCase() : '',
              pro_nombre: detalle.pro_nombre,
              nombre_libro_prolipa: detalle.nombre_libro_prolipa,
              nombrenivel: detalle.nombrenivel,
              cantidad_total: 0,
              cantidad_real_total: 0,
              valor_unitario: detalle.det_ven_valor_u,
              valor_total: 0,
              contratos: [] // Lista de contratos donde aparece este libro
            };
          }
          
          // Sumar cantidades
          libroMap[key].cantidad_total += Number(detalle.det_ven_cantidad) || 0;
          libroMap[key].cantidad_real_total += Number(detalle.det_ven_cantidad_real) || 0;
          libroMap[key].valor_total += (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0);
          
          // Agregar información del contrato
          libroMap[key].contratos.push({
            ven_codigo: venta.ven_codigo,
            ins_nombre: venta.ins_nombre,
            periodo_escolar: venta.periodo_escolar,
            cantidad: detalle.det_ven_cantidad,
            cantidad_real: detalle.det_ven_cantidad_real,
            valor_unitario: detalle.det_ven_valor_u,
            subtotal: (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0),
            ven_fecha: venta.ven_fecha
          });
        });
      });
      
      // Convertir a array y ordenar por cantidad total descendente
      return Object.values(libroMap).sort((a, b) => b.cantidad_total - a.cantidad_total);
    },
    // Agrupar datos por combo (para modo "Por Combos") - SOLO ifcombo = 1
    datosPorCombo() {
      const comboMap = {};
      
      this.ventasFiltradas.forEach(venta => {
        if (!venta.detalles) return;
        
        venta.detalles.forEach(detalle => {
          // FILTRAR SOLO COMBOS (ifcombo = 1)
          if (detalle.ifcombo !== 1) return;
          
          // Normalizar el código a mayúsculas para agrupar correctamente (case insensitive)
          const key = detalle.pro_codigo ? detalle.pro_codigo.toUpperCase() : '';
          
          if (!comboMap[key]) {
            comboMap[key] = {
              pro_codigo: detalle.pro_codigo ? detalle.pro_codigo.toUpperCase() : '',
              pro_nombre: detalle.pro_nombre,
              nombre_libro_prolipa: detalle.nombre_libro_prolipa,
              nombrenivel: detalle.nombrenivel,
              codigos_combos: detalle.codigos_combos, // Códigos asociados al combo
              cantidad_total: 0,
              cantidad_real_total: 0,
              valor_unitario: detalle.det_ven_valor_u,
              valor_total: 0,
              contratos: [] // Lista de contratos donde aparece este combo
            };
          }
          
          // Sumar cantidades
          comboMap[key].cantidad_total += Number(detalle.det_ven_cantidad) || 0;
          comboMap[key].cantidad_real_total += Number(detalle.det_ven_cantidad_real) || 0;
          comboMap[key].valor_total += (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0);
          
          // Agregar información del contrato
          comboMap[key].contratos.push({
            ven_codigo: venta.ven_codigo,
            ins_nombre: venta.ins_nombre,
            periodo_escolar: venta.periodo_escolar,
            cantidad: detalle.det_ven_cantidad,
            cantidad_real: detalle.det_ven_cantidad_real,
            valor_unitario: detalle.det_ven_valor_u,
            subtotal: (Number(detalle.det_ven_cantidad) || 0) * (Number(detalle.det_ven_valor_u) || 0),
            ven_fecha: venta.ven_fecha
          });
        });
      });
      
      // Convertir a array y ordenar por cantidad total descendente
      return Object.values(comboMap).sort((a, b) => b.cantidad_total - a.cantidad_total);
    },
    // Obtener todos los niveles educativos únicos presentes en los datos
    niveles() {
      const list = new Set();
      this.ventas.forEach(v => {
        if (v.detalles) {
          v.detalles.forEach(d => {
            // Solo considerar niveles de items que NO sean combos (ifcombo !== 1)
            if (d.nombrenivel && d.ifcombo !== 1) {
              list.add(d.nombrenivel.trim());
            }
          });
        }
      });
      
      const arrayNiveles = Array.from(list);
      
      // Orden lógico del sistema educativo
      const levelOrder = [
        'inicial 1', 'inicial i',
        'inicial 2', 'inicial ii',
        '1er año', '1er año básica', '1er grado', '1 grado', '1er año b',
        '2do año', '2do año básica', '2 grado', '2do grado',
        '3er año', '3er año básica', '3 grado', '3er grado',
        '4to año', '4to año básica', '4 grado', '4to grado',
        '5to año', '5to año básica', '5 grado', '5to grado',
        '6to año', '6to año básica', '6 grado', '6to grado',
        '7mo año', '7mo año básica', '7 grado', '7mo grado',
        '8vo año', '8vo año básica', '8 grado', '8vo grado',
        '9no año', '9no año básica', '9 grado', '9no grado',
        '10mo año', '10mo año básica', '10 grado', '10mo grado',
        '1er bgu', '1ero bgu',
        '2do bgu',
        '3er bgu', '3ero bgu'
      ];
      
      return arrayNiveles.sort((a, b) => {
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
    this.getData();
  },
  methods: {
    getDetallesFiltrados(detalles) {
      if (!detalles || !Array.isArray(detalles)) return [];
      // Siempre ocultar combos, mostrar solo libros individuales
      return detalles.filter(d => {
        const esCombo = parseInt(d.ifcombo) === 1;
        return !esCombo;
      });
    },
    getData() {
      let me = this;
      me.$vs.loading({
        title: 'Cargando datos desde Milton...',
        color: '#7367F0'
      });
      const url = (me.$server_url || 'http://localhost:8000/') + 'migracion_iluminar/migracion?action=Get_Data_Milton';
      me.$http.get(url)
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            me.ventas = res.data;
          } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
            me.ventas = res.data.data;
          } else {
            me.ventas = [];
          }
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Sincronización Exitosa',
            text: `Se cargaron ${me.ventas.length} registros de venta.`,
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
            text: 'No se pudo obtener la información de Milton.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        });
    },
    // Suma de cantidades del documento que corresponden a un nivel
    getValorNivel(venta, nivel) {
      if (!venta.detalles) return 0;
      return venta.detalles
        // Excluir combos (ifcombo = 1) porque ya están segregados en items únicos
        .filter(d => d.nombrenivel && d.nombrenivel.trim() === nivel && d.ifcombo !== 1)
        .reduce((sum, d) => {
          const cant = (d.det_ven_cantidad_real !== undefined && d.det_ven_cantidad_real !== null)
            ? Number(d.det_ven_cantidad_real)
            : Number(d.det_ven_cantidad || 0);
          return sum + cant;
        }, 0);
    },
    // Sumar el total general de todas las ventas para un nivel particular
    getTotalNivel(nivel) {
      return this.ventas.reduce((sum, v) => sum + this.getValorNivel(v, nivel), 0);
    },
    // Exportación dinámica a Excel con múltiples hojas por período
    exportToExcel() {
      let me = this;
      if (me.ventas.length === 0) {
        me.$vs.notify({
          title: 'Atención',
          text: 'No hay datos para exportar.',
          color: 'warning'
        });
        return;
      }

      // Mostrar loading
      me.$vs.loading({
        title: 'Generando Excel...',
        text: 'Creando hojas por período, por favor espera...',
        color: '#7367F0'
      });

      // Usar setTimeout para no bloquear la UI
      setTimeout(() => {
        try {
          const workbook = XLSX.utils.book_new();

          // Función helper para crear datos de una hoja
          const crearDatosHoja = (ventasParaHoja) => {
            // Ordenar las ventas por período ascendente y luego por institución
            const ventasOrdenadas = [...ventasParaHoja].sort((a, b) => {
              const pA = a.periodo_escolar || '';
              const pB = b.periodo_escolar || '';
              
              if (pA !== pB) {
                return pA.localeCompare(pB);
              }
              
              const nameA = a.ins_nombre ? a.ins_nombre.trim().toLowerCase() : '';
              const nameB = b.ins_nombre ? b.ins_nombre.trim().toLowerCase() : '';
              return nameA.localeCompare(nameB);
            });
            
            const dataToExport = ventasOrdenadas.map(v => {
              const row = {
                'Periodo escolar': v.periodo_escolar || 'N/A',
                'Institución': v.ins_nombre ? v.ins_nombre.trim() : 'Sin Nombre',
                'RUC / Identificación': v.ins_ruc || 'N/A',
                'Teléfono': v.ins_telefono || 'N/A',
                'Provincia': v.provi_nombre || 'N/A',
                'Ciudad': v.CIU_NOMBRE || 'N/A',
                'Parroquia': v.parroquia_nombre || 'N/A',
                'Dirección': v.ins_direccion || 'Sin dirección',
                'Correo Electrónico': v.ins_mail || 'N/A',
                'Código de Venta': v.ven_codigo,
                'Valor Neto ($)': Number(v.ven_valor) || 0,
                // 'Descuento (%)': Number(v.ven_descuento) || 0,
                'Fecha Venta': me.formatDate(v.ven_fecha),
                'Tipo de Escuela': v.tipo_institucion || 'N/A'
              };

              // Rellenar las columnas de nivel dinámicas y calcular el total de unidades
              let totalUnidades = 0;
              me.niveles.forEach(nivel => {
                const valorNivel = me.getValorNivel(v, nivel);
                row[nivel] = valorNivel;
                totalUnidades += valorNivel;
              });

              // Agregar columna de total de unidades
              row['Total textos escolares comercializados (unidades)'] = totalUnidades;

              return row;
            });

            // Calcular totales para esta hoja
            const totalValorHoja = ventasParaHoja.reduce((sum, v) => sum + (Number(v.ven_valor) || 0), 0);
            
            const totalsRow = {
              'Periodo escolar': 'TOTAL',
              'Institución': '',
              'RUC / Identificación': '',
              'Teléfono': '',
              'Provincia': '',
              'Ciudad': '',
              'Parroquia': '',
              'Dirección': '',
              'Correo Electrónico': '',
              'Código de Venta': '',
              'Valor Neto ($)': totalValorHoja,
              // 'Descuento (%)': '',
              'Fecha Venta': '',
              'Tipo de Escuela': ''
            };
            
            // Totales por nivel para esta hoja y sumar total general de unidades
            let totalGeneralUnidades = 0;
            me.niveles.forEach(nivel => {
              const totalNivel = ventasParaHoja.reduce((sum, v) => sum + me.getValorNivel(v, nivel), 0);
              totalsRow[nivel] = totalNivel;
              totalGeneralUnidades += totalNivel;
            });
            
            // Agregar total general de unidades
            totalsRow['Total textos escolares comercializados (unidades)'] = totalGeneralUnidades;
            
            dataToExport.push(totalsRow);
            return dataToExport;
          };

          // HOJA 1: TODOS LOS DATOS
          const todosDatos = crearDatosHoja(me.ventas);
          const worksheet1 = XLSX.utils.json_to_sheet(todosDatos);
          XLSX.utils.book_append_sheet(workbook, worksheet1, 'Todos');

          // HOJA 2: PERÍODO 2022-2023
          const ventas2022 = me.ventas.filter(v => v.periodo_escolar === '2022-2023');
          if (ventas2022.length > 0) {
            const datos2022 = crearDatosHoja(ventas2022);
            const worksheet2 = XLSX.utils.json_to_sheet(datos2022);
            XLSX.utils.book_append_sheet(workbook, worksheet2, '2022-2023');
          }

          // HOJA 3: PERÍODO 2023-2024
          const ventas2023 = me.ventas.filter(v => v.periodo_escolar === '2023-2024');
          if (ventas2023.length > 0) {
            const datos2023 = crearDatosHoja(ventas2023);
            const worksheet3 = XLSX.utils.json_to_sheet(datos2023);
            XLSX.utils.book_append_sheet(workbook, worksheet3, '2023-2024');
          }

          // HOJA 4: PERÍODO 2024-2025
          const ventas2024 = me.ventas.filter(v => v.periodo_escolar === '2024-2025');
          if (ventas2024.length > 0) {
            const datos2024 = crearDatosHoja(ventas2024);
            const worksheet4 = XLSX.utils.json_to_sheet(datos2024);
            XLSX.utils.book_append_sheet(workbook, worksheet4, '2024-2025');
          }

          // Escribir y descargar el archivo
          XLSX.writeFile(workbook, 'Resumen_Ventas_Milton_Por_Periodos.xlsx');
          
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Exportación Exitosa',
            text: 'Se ha descargado el reporte de Excel con múltiples hojas.',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-download'
          });
        } catch (err) {
          console.error(err);
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error de Exportación',
            text: 'Ocurrió un error al generar el archivo Excel: ' + err.message,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        }
      }, 100);
    },
    getPeriodoEscolar(codigo) {
      if (!codigo) return 'N/A';
      const parts = codigo.split('-');
      if (parts.length >= 2) {
        const section = parts[1]; // e.g. "S23", "C22", "CS22"
        const match = section.match(/\d{2}$/);
        if (match) {
          const year = match[0];
          if (year === '22') return '2022-2023';
          if (year === '23') return '2023-2024';
          if (year === '24') return '2024-2025';
          if (year === '25') return '2025-2026';
          const fullYear = 2000 + parseInt(year);
          return `${fullYear}-${fullYear + 1}`;
        }
      }
      if (codigo.includes('22')) return '2022-2023';
      if (codigo.includes('23')) return '2023-2024';
      if (codigo.includes('24')) return '2024-2025';
      if (codigo.includes('25')) return '2025-2026';
      return 'N/A';
    },
    formatCurrency(value) {
      if (value === undefined || value === null) return '0.00';
      const num = Number(value);
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      try {
        const parts = dateStr.split(' ');
        return parts[0] || dateStr;
      } catch (e) {
        return dateStr;
      }
    }
  }
};
</script>

<style scoped>
.master-table {
  margin-top: 1.5rem;
}

.bg-detail-container {
  background-color: #f6f8fb;
  border-left: 4px solid #7367f0;
}

.detail-table {
  background-color: #ffffff !important;
}

.bg-primary-light {
  background-color: rgba(115, 103, 240, 0.1);
}

.bg-warning-light {
  background-color: rgba(255, 159, 67, 0.1);
}

.text-primary {
  color: #7367f0;
}

.font-mono {
  font-family: 'Consolas', 'Courier New', Courier, monospace;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.total-row {
  background-color: #eaecef !important;
  border-top: 3px double #7367f0;
}

.font-black {
  font-weight: 900;
}

.row-segregado {
  background-color: rgba(255, 159, 67, 0.05) !important;
  border-left: 3px solid #ff9f43 !important;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>