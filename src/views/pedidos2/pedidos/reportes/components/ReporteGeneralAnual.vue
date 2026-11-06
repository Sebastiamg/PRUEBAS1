<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <span>Reporte correspondiente al año: {{ anio }}</span>
      <div class="switch-container">
        <vs-switch v-model="mostrarDetalles" @change="toggleVista">
          <template #off>General por año</template>
          <template #on>Detallado por temporada</template>
        </vs-switch>
      </div>
    </div>
    <!-- Botones de exportación -->
    <div class="flex justify-end mb-4">
      <vs-button @click="exportarExcel" color="success" type="border" class="mr-3">
        Exportar Excel
      </vs-button>
      <vs-button @click="exportarPDF" color="primary" type="border">
        Exportar PDF
      </vs-button>
    </div>

    <!-- Loading personalizado cuando se está cargando -->
    <div v-if="loading" class="loading-reporte-container">
      <div class="vs-con-loading__container loading-reporte">
        <div class="vs-loading vs-loading--material">
          <div class="vs-loading__load"></div>
          <div class="vs-loading__load"></div>
          <div class="vs-loading__load"></div>
          <div class="vs-loading__load"></div>
        </div>
      </div>
      <p class="loading-text">Cargando datos...</p>
    </div>

    <div v-else id="seccionImprimir2">
      <!-- Vista Detallada (Sierra y Costa) -->
      <div v-if="mostrarDetalles">
        <div v-for="region in datosReporte.detalle" :key="region.periodo">
          <table id="tablaReporte" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th colspan="3" style="text-align: center; font-weight: bold; font-size: 16px;">
                  DETALLE DE VENTAS Y CUENTAS POR COBRAR - {{ region.periodo }}
                </th>
              </tr>
              <tr>
                <th style="border: 1px solid #ffff; padding: 8px; text-align: left;"></th>
                <th style="border: 1px solid #ffff; padding: 8px; text-align: right;">US$</th>
                <th style="border: 1px solid #ffff; padding: 8px; text-align: right;">UNIDADES</th>
              </tr>
              <tr>
                <th style="border: 1px solid #ffff; padding: 8px; text-align: left;">TEMPORADA</th>
                <th style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ region.periodo }}</th>
                <th style="border: 1px solid #ffff; padding: 8px; text-align: center;"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px;">LIBROS DESPACHADOS DE ACUERDO A CONTRATO (VENTA BRUTA)</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.venta_bruta) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ region.totales.totalcantidad_ventasBrutas }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px;">DEVOLUCIONES DE LIBROS DESPACHADOS (VENTA BRUTA)</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.total_dev_bruta) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ region.totales.totalcantidad_devoluciones }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">LIBROS VENDIDOS NETO</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ formatearNumero(region.totales.total_general_bruto_devoluciones) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ region.totales.cantidad_bruta_devoluciones }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px;">DEVOLUCIONES DE LIBROS NETO</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.total_dev_neta) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">VENTA NETA</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ formatearNumero(region.totales.venta_neta) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; padding-left: 24px;">- Cobros Prolipa</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.totalCobradoProlipa) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; padding-left: 24px;">- Cobros Calmed</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.totalCobradoCalmed) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; padding-left: 24px;">- Anticipos entregados</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.totalPagado) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">ANTICIPOS ENTREGADOS Y COBROS POSTERIORES</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ formatearNumero(calcularAnticiposYCobros(region.totales)) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">SALDO POR COBRAR</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">
                  <div style="display: inline-block; text-align: right;">
                    <div style="border-bottom: 1px solid #000000; margin-bottom: 5px;"></div>
                    <div style="padding: 0 5px 0 10px;">{{ formatearNumero(calcularSaldoPorCobrarRegion(region.totales)) }}</div>
                    <div style="border-bottom: 1px solid #000000; margin-top: 5px; margin-bottom: 5px;"></div>
                    <div style="border-bottom: 1px solid #000000;"></div>
                  </div>
                </td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px;">FACTURADO ENVIADO A PERSEO Y SRI</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(region.totales.totalPerseo) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ region.totales.totalCantidadPerseo }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ffff; padding: 8px;">PENDIENTE DE FACTURAR</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(calcularPendienteFacturarRegion(region.totales)) }}</td>
                <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vista Total -->
      <div v-else>
        <table id="tablaReporte" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th colspan="3" style="text-align: center; font-weight: bold; font-size: 16px;">
                DETALLE DE VENTAS Y CUENTAS POR COBRAR
              </th>
            </tr>
            <tr>
              <th style="border: 1px solid #ffff; padding: 8px; text-align: left;"></th>
              <th style="border: 1px solid #ffff; padding: 8px; text-align: right;">US$</th>
              <th style="border: 1px solid #ffff; padding: 8px; text-align: right;">UNIDADES</th>
            </tr>
            <tr>
              <th style="border: 1px solid #ffff; padding: 8px; text-align: left;">TEMPORADA</th>
              <th style="border: 1px solid #ffff; padding: 8px; text-align: right;">COSTA / SIERRA</th>
              <th style="border: 1px solid #ffff; padding: 8px; text-align: center;"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px;">LIBROS DESPACHADOS DE ACUERDO A CONTRATO (VENTA BRUTA)</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.venta_bruta) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ datosReporte.total.totalcantidad_ventasBrutas }}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px;">DEVOLUCIONES DE LIBROS DESPACHADOS (VENTA BRUTA)</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.total_dev_bruta) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ datosReporte.total.totalcantidad_devoluciones }}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">LIBROS VENDIDOS NETO</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ formatearNumero(datosReporte.total.total_general_bruto_devoluciones) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ datosReporte.total.cantidad_bruta_devoluciones }}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px;">DEVOLUCIONES DE LIBROS NETO</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.total_dev_neta) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">VENTA NETA</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ formatearNumero(datosReporte.total.venta_neta) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; padding-left: 24px;">- Cobros Prolipa</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.totalCobradoProlipa) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; padding-left: 24px;">- Cobros Calmed</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.totalCobradoCalmed) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
            
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; padding-left: 24px;">- Anticipos entregados</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.totalPagado) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">ANTICIPOS ENTREGADOS Y COBROS POSTERIORES</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right; font-weight: bold;">{{ formatearNumero(calcularAnticiposYCobros(datosReporte.total)) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px; font-weight: bold;">SALDO POR COBRAR</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">
                <div style="display: inline-block; text-align: right;">
                  <div style="border-bottom: 1px solid #000000; margin-bottom: 5px;"></div>
                  <div style="padding: 0 5px 0 10px;">{{ formatearNumero(calcularSaldoPorCobrar()) }}</div>
                  <div style="border-bottom: 1px solid #000000; margin-top: 5px; margin-bottom: 5px;"></div>
                  <div style="border-bottom: 1px solid #000000;"></div>
                </div>
              </td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px;">FACTURADO ENVIADO A PERSEO Y SRI</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(datosReporte.total.totalPerseo) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ datosReporte.total.totalCantidadPerseo }}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ffff; padding: 8px;">PENDIENTE DE FACTURAR</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;">{{ formatearNumero(calcularPendienteFacturar()) }}</td>
              <td style="border: 1px solid #ffff; padding: 8px; text-align: right;"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import imprimirMixin from '../../../../../mixins/Pedidosmix'

export default {
  mixins: [imprimirMixin],
  props: {
    periodo_id: {
      type: Number,
      required: true
    },
    nombrePeriodo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      datosReporte: {},
      anio: 0,
      mostrarDetalles: true // Por default, mostrar vista detallada
    }
  },
  mounted() {
    this.cargarDatos()
  },
  methods: {
    cargarDatos() {
      this.loading = true
      this.$http.get(this.$server_url + `metodosGetVentas?reporteGeneralAnual=1&periodo=${this.periodo_id}`)
        .then((response) => {
          this.loading = false
          this.datosReporte = response.data
          this.anio = response.data.anio
          // Asegurar que los totales Prolipa/Calmed estén calculados sumando las temporadas
          this.calcularTotalesCobrado()
        })
        .catch((error) => {
          this.loading = false
          console.error('Error:', error)
          this.$vs.notify({
            title: 'Error',
            text: 'Error al cargar los datos',
            color: 'danger'
          })
        })
    },
    
    formatearNumero(valor) {
      if (!valor) return '0.00'
      return parseFloat(valor).toLocaleString('es-EC', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    
    calcularSaldoPorCobrar() {
      if (!this.datosReporte.total) return 0
      // Saldo = venta_neta - (Cobros Prolipa + Cobros Calmed + Anticipos entregados)
      return this.datosReporte.total.venta_neta - this.calcularAnticiposYCobros(this.datosReporte.total)
    },
    
    calcularPendienteFacturar() {
      if (!this.datosReporte.total) return 0
      return this.datosReporte.total.venta_neta - this.datosReporte.total.totalPerseo
    },
    
    calcularSaldoPorCobrarRegion(totales) {
      if (!totales) return 0
      // Saldo por región = venta_neta - (Cobros Prolipa + Cobros Calmed + Anticipos entregados)
      return totales.venta_neta - this.calcularAnticiposYCobros(totales)
    },
    
    calcularPendienteFacturarRegion(totales) {
      if (!totales) return 0
      return totales.venta_neta - totales.totalPerseo
    },

    calcularAnticiposYCobros(totales) {
      // Suma robusta de totalCobradoProlipa + totalCobradoCalmed + totalPagado (maneja strings y nulls)
      if (!totales) return 0
      const p = Number(totales.totalCobradoProlipa)
      const c = Number(totales.totalCobradoCalmed)
      const a = Number(totales.totalPagado)
      const sp = isNaN(p) ? 0 : p
      const sc = isNaN(c) ? 0 : c
      const sa = isNaN(a) ? 0 : a
      return sp + sc + sa
    },
    
    calcularTotalesCobrado() {
      // Sumar totalCobradoProlipa y totalCobradoCalmed desde detalle (por temporadas)
      if (!this.datosReporte || !Array.isArray(this.datosReporte.detalle)) return

      let sumaProlipa = 0
      let sumaCalmed = 0

      this.datosReporte.detalle.forEach((region) => {
        if (region && region.totales) {
          const p = Number(region.totales.totalCobradoProlipa)
          const c = Number(region.totales.totalCobradoCalmed)
          sumaProlipa += isNaN(p) ? 0 : p
          sumaCalmed += isNaN(c) ? 0 : c
        }
      })

      // Asegurar objeto total
      if (!this.datosReporte.total) this.datosReporte.total = {}

      // Asignar los totales calculados (usar la suma siempre para que el "General por año" refleje la suma de temporadas)
      this.datosReporte.total.totalCobradoProlipa = sumaProlipa
      this.datosReporte.total.totalCobradoCalmed = sumaCalmed

      // También actualizar totalCobrado si quieres que sea la suma explícita
      this.datosReporte.total.totalCobrado = Number(sumaProlipa + sumaCalmed)
    },
    
    toggleVista() {
      // Método para manejar el cambio de vista
      // No se necesita lógica adicional aquí, el v-model maneja el cambio
    },
    
    exportarExcel() {
      const wb = XLSX.utils.book_new()
      
      if (this.mostrarDetalles) {
        // Exportar dos hojas para Sierra y Costa
        this.datosReporte.detalle.forEach((region, index) => {
          const data = [
            [`Reporte correspondiente al año: ${this.anio}`, '', ''],
            [`DETALLE DE VENTAS Y CUENTAS POR COBRAR - ${region.periodo}`, '', ''],
            ['', '', ''],
            ['', 'US$', 'UNIDADES'],
            ['TEMPORADA', region.periodo, ''],
            [
              'LIBROS DESPACHADOS DE ACUERDO A CONTRATO (VENTA BRUTA)',
              region.totales.venta_bruta || 0,
              region.totales.totalcantidad_ventasBrutas || 0
            ],
            [
              'DEVOLUCIONES DE LIBROS DESPACHADOS (VENTA BRUTA)',
              region.totales.total_dev_bruta || 0,
              region.totales.totalcantidad_devoluciones || 0
            ],
            [
              'LIBROS VENDIDOS NETO',
              region.totales.total_general_bruto_devoluciones || 0,
              region.totales.cantidad_bruta_devoluciones || 0
            ],
            [
              'DEVOLUCIONES DE LIBROS NETO',
              region.totales.total_dev_neta || 0,
              ''
            ],
            [
              'VENTA NETA',
              region.totales.venta_neta || 0,
              ''
            ],
            [
              ' - Prolipa',
              region.totales.totalCobradoProlipa || 0,
              ''
            ],
            [
              ' - Calmed',
              region.totales.totalCobradoCalmed || 0,
              ''
            ],
            [
              ' - Anticipos entregados',
              region.totales.totalPagado || 0,
              ''
            ],
            [
              'ANTICIPOS ENTREGADOS Y COBROS POSTERIORES',
              this.calcularAnticiposYCobros(region.totales) || 0,
              ''
            ],
            ['', '', ''],
            [
              'SALDO POR COBRAR',
              this.calcularSaldoPorCobrarRegion(region.totales) || 0,
              ''
            ],
            ['', '', ''],
            ['', '', ''],
            [
              'FACTURADO ENVIADO A PERSEO Y SRI',
              region.totales.totalPerseo || 0,
              region.totales.totalCantidadPerseo || 0
            ],
            [
              'PENDIENTE DE FACTURAR',
              this.calcularPendienteFacturarRegion(region.totales) || 0,
              ''
            ]
          ]

          const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true })
          ws['!cols'] = [{ wch: 50 }, { wch: 20 }, { wch: 15 }]
          ws['!rows'] = [
            { hpt: 20 }, { hpt: 20 }, { hpt: 10 }, { hpt: 15 }, { hpt: 15 },
            { hpt: 15 }, { hpt: 15 }, { hpt: 15 }, { hpt: 15 }, { hpt: 15 },
            { hpt: 15 }, { hpt: 10 }, { hpt: 15 }, { hpt: 10 }, { hpt: 10 },
            { hpt: 15 }, { hpt: 15 }
          ]
          ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }
          ]

          const boldRows = [1, 7, 9, 12]
          const rightAlignColumns = ['B', 'C']
            for (let row = 0; row < data.length; row++) {
              for (let col = 0; col < 3; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
                if (!ws[cellAddress]) continue
                ws[cellAddress].s = ws[cellAddress].s || {}
                if (boldRows.includes(row)) ws[cellAddress].s.font = { bold: true }
                if (rightAlignColumns.includes(XLSX.utils.encode_col(col))) {
                  ws[cellAddress].s.alignment = { horizontal: 'right' }
                } else {
                  ws[cellAddress].s.alignment = { horizontal: 'left' }
                }
                // Formatear como número si el valor puede convertirse a número
                if (col > 0 && ws[cellAddress].v !== '') {
                  const num = Number(ws[cellAddress].v)
                  if (!isNaN(num)) {
                    ws[cellAddress].t = 'n'
                    ws[cellAddress].v = num
                    ws[cellAddress].s.numFmt = '#,##0.00'
                  }
                }
                if (row === 11) ws[cellAddress].s.border = { bottom: { style: 'thin', color: { rgb: '000000' } } }
                if (row === 12 && col === 1) ws[cellAddress].s.border = { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'double', color: { rgb: '000000' } } }
                if (row === 13 && col === 1) ws[cellAddress].s.border = { bottom: { style: 'thin', color: { rgb: '000000' } } }
                if (row === 14 && col === 1) ws[cellAddress].s.border = { bottom: { style: 'thin', color: { rgb: '000000' } } }
              }
            }

          XLSX.utils.book_append_sheet(wb, ws, `${region.periodo}`)
        })
      } else {
        // Exportar una sola hoja para totales
        const data = [
          [`Reporte correspondiente al año: ${this.anio}`, '', ''],
          ['DETALLE DE VENTAS Y CUENTAS POR COBRAR', '', ''],
          ['', '', ''],
          ['', 'US$', 'UNIDADES'],
          ['TEMPORADA', 'COSTA / SIERRA', ''],
          [
            'LIBROS DESPACHADOS DE ACUERDO A CONTRATO (VENTA BRUTA)',
            this.datosReporte.total.venta_bruta || 0,
            this.datosReporte.total.totalcantidad_ventasBrutas || 0
          ],
          [
            'DEVOLUCIONES DE LIBROS DESPACHADOS (VENTA BRUTA)',
            this.datosReporte.total.total_dev_bruta || 0,
            this.datosReporte.total.totalcantidad_devoluciones || 0
          ],
          [
            'LIBROS VENDIDOS NETO',
            this.datosReporte.total.total_general_bruto_devoluciones || 0,
            this.datosReporte.total.cantidad_bruta_devoluciones || 0
          ],
          [
            'DEVOLUCIONES DE LIBROS NETO',
            this.datosReporte.total.total_dev_neta || 0,
            ''
          ],
          [
            'VENTA NETA',
            this.datosReporte.total.venta_neta || 0,
            ''
          ],
          [
            'ANTICIPOS ENTREGADOS Y COBROS POSTERIORES',
            this.calcularAnticiposYCobros(this.datosReporte.total) || 0,
            ''
          ],
          [
            ' - Prolipa',
            this.datosReporte.total.totalCobradoProlipa || 0,
            ''
          ],
          [
            ' - Calmed',
            this.datosReporte.total.totalCobradoCalmed || 0,
            ''
          ],
          ['', '', ''],
          [
            'SALDO POR COBRAR',
            this.calcularSaldoPorCobrar() || 0,
            ''
          ],
          ['', '', ''],
          ['', '', ''],
          [
            'FACTURADO ENVIADO A PERSEO Y SRI',
            this.datosReporte.total.totalPerseo || 0,
            this.datosReporte.total.totalCantidadPerseo || 0
          ],
          [
            'PENDIENTE DE FACTURAR',
            this.calcularPendienteFacturar() || 0,
            ''
          ]
        ]

        const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true })
        ws['!cols'] = [{ wch: 50 }, { wch: 20 }, { wch: 15 }]
        ws['!rows'] = [
          { hpt: 20 }, { hpt: 20 }, { hpt: 10 }, { hpt: 15 }, { hpt: 15 },
          { hpt: 15 }, { hpt: 15 }, { hpt: 15 }, { hpt: 15 }, { hpt: 15 },
          { hpt: 15 }, { hpt: 10 }, { hpt: 15 }, { hpt: 10 }, { hpt: 10 },
          { hpt: 15 }, { hpt: 15 }
        ]
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }
        ]

        const boldRows = [1, 7, 9, 12]
        const rightAlignColumns = ['B', 'C']
        for (let row = 0; row < data.length; row++) {
          for (let col = 0; col < 3; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
            if (!ws[cellAddress]) continue
            ws[cellAddress].s = ws[cellAddress].s || {}
            if (boldRows.includes(row)) ws[cellAddress].s.font = { bold: true }
            if (rightAlignColumns.includes(XLSX.utils.encode_col(col))) {
              ws[cellAddress].s.alignment = { horizontal: 'right' }
            } else {
              ws[cellAddress].s.alignment = { horizontal: 'left' }
            }
            // Formatear como número si el valor puede convertirse a número
            if (col > 0 && ws[cellAddress].v !== '') {
              const num = Number(ws[cellAddress].v)
              if (!isNaN(num)) {
                ws[cellAddress].t = 'n'
                ws[cellAddress].v = num
                ws[cellAddress].s.numFmt = '#,##0.00'
              }
            }
            if (row === 11) ws[cellAddress].s.border = { bottom: { style: 'thin', color: { rgb: '000000' } } }
            if (row === 12 && col === 1) ws[cellAddress].s.border = { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'double', color: { rgb: '000000' } } }
            if (row === 13 && col === 1) ws[cellAddress].s.border = { bottom: { style: 'thin', color: { rgb: '000000' } } }
            if (row === 14 && col === 1) ws[cellAddress].s.border = { bottom: { style: 'thin', color: { rgb: '000000' } } }
          }
        }

        XLSX.utils.book_append_sheet(wb, ws, `Reporte General Anual ${this.anio}`)
      }

      XLSX.writeFile(wb, `reporte_general_anual_${this.anio}.xlsx`)
    },
    
    exportarPDF() {
      this.m_imprimirTodos('12px', `reporte_anual_${this.anio}`)
    }
  }
}
</script>

<style scoped>
.loading-reporte-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

.loading-reporte {
  margin-bottom: 20px;
}

.loading-text {
  color: #7f8c8d;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.vs-loading--material {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.vs-loading--material .vs-loading__load {
  width: 12px;
  height: 12px;
  background: #3498db;
  border-radius: 50%;
  animation: vs-loading-material 1.4s infinite ease-in-out both;
}

.vs-loading--material .vs-loading__load:nth-child(1) {
  animation-delay: -0.32s;
}

.vs-loading--material .vs-loading__load:nth-child(2) {
  animation-delay: -0.16s;
}

.vs-loading--material .vs-loading__load:nth-child(3) {
  animation-delay: 0s;
}

.vs-loading--material .vs-loading__load:nth-child(4) {
  animation-delay: 0.16s;
}

@keyframes vs-loading-material {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.switch-container {
  max-width: 250px; /* Adjust this value as needed */
  min-width: 150px; /* Ensure the switch doesn't shrink too much */
  flex-shrink: 0; /* Prevent the switch from shrinking in the flex layout */
}

.vs-switch {
  width: 100%; /* Make the switch take the full width of its container */
}

/* Optional: Adjust text size or padding for better appearance */
.vs-switch .vs-switch__text {
  font-size: 14px; /* Adjust font size if needed */
  padding: 0 10px; /* Add padding to the switch labels */
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .switch-container {
    max-width: 200px; /* Smaller width for mobile */
  }
}
</style>