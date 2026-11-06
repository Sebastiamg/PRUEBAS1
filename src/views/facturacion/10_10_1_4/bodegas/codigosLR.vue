<template>
  <div>
    <vx-card title="Códigos Liquidados/Regalados Plan Lector">
      <!-- 🔹 Selección de temporada -->
      <vs-row style="margin-bottom: 20px">
        <vs-col vs-w="10" class="m-2">
          <span style="font-size: 11.5px">&nbsp;Temporada:</span><br />
          <v-select :options="temporada" :reduce="t => t.idperiodoescolar" label="periodoescolar" class="w-full"
            v-model="codtemporada" />
        </vs-col>
      </vs-row>

      <!-- 🔹 Filtros de fechas -->
      <vs-row vs-type="flex" vs-justify="center" vs-w="12" class="mt-2">
        <vs-col vs-w="4" class="px-2">
          <label style="font-size: 12px;">Fecha inicio:</label>
          <flat-pickr v-model="fecha_inicio" :config="configFechaInicio" placeholder="Seleccione fecha inicio"
            class="vs-inputx w-full" @on-change="validarFechas" />
        </vs-col>

        <vs-col vs-w="4" class="px-2">
          <label style="font-size: 12px;">Fecha fin:</label>
          <flat-pickr v-model="fecha_fin" :config="configFechaFin" placeholder="Seleccione fecha fin"
            class="vs-inputx w-full" @on-change="validarFechas" />
        </vs-col>

        <vs-col vs-w="2" class="px-2 flex items-end">
        </vs-col>
      </vs-row>

      <!-- 🔹 Botones -->
      <vs-row>
        <vs-col vs-w="12" class="px-2 flex items-end">
          <vs-button color="primary" type="filled" class="m-2" icon="search"
            @click="getCodigosPlanlectorLiquidadoRegalado">
            Buscar
          </vs-button>
          <span v-if="listaAgrupada.length > 0 || listaCodigos.length > 0">
            <vs-button :color="mostrarAgrupado ? 'warning' : 'primary'" class="m-2" @click="toggleAgrupado">
              <i v-if="mostrarAgrupado" class="fa-solid fa-layer-group"></i>
              <i v-else class="fa-solid fa-table-list"></i>
              {{ mostrarAgrupado ? 'Mostrar sueltos' : 'Agrupar por libro' }}
            </vs-button>

            <vs-button color="success" type="border" class="m-2" @click="generarExcel">
              <i class="fa-solid fa-file-arrow-down"></i>
              Exportar Excel
            </vs-button>
          </span>
        </vs-col>
      </vs-row>

      <!-- 🔹 Tarjetas resumen -->
      <div v-if="codtemporada" class="resumen-totales">
        <vs-row vs-type="flex" vs-lg="12" vs-sm="12" vs-xs="12" justify="center">
          <vs-col vs-type="flex" vs-align="center" vs-lg="3" vs-sm="6" vs-xs="12">
            <div class="resumen-card orange m-3">
              <p class="titulo">Códigos Liquidados</p>
              <h3 class="valor">{{ totalLiquidados }}</h3>
            </div>
          </vs-col>

          <vs-col vs-type="flex" vs-align="center" vs-lg="3" vs-sm="6" vs-xs="12">
            <div class="resumen-card blue m-3">
              <p class="titulo">Códigos Regalados</p>
              <h3 class="valor">{{ totalRegalados }}</h3>
            </div>
          </vs-col>

          <vs-col vs-type="flex" vs-align="center" vs-lg="3" vs-sm="6" vs-xs="12">
            <div class="resumen-card green m-3">
              <p class="titulo">Total</p>
              <h3 class="valor">{{ totalLiquidados + totalRegalados }}</h3>
            </div>
          </vs-col>
        </vs-row>
      </div>



      <!-- 🔹 Tabla -->
      <vs-table max-items="20" pagination search :data="mostrarAgrupado ? listaAgrupada : listaCodigos">
        <template slot="header" v-if="(mostrarAgrupado ? listaAgrupada.length : listaCodigos.length) > 0">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px">Vista:</span>
            <vs-chip v-if="mostrarAgrupado">Agrupado</vs-chip>
            <vs-chip v-else>Sueltos</vs-chip>
          </div>
        </template>

        <template slot="thead">
          <vs-th sort-key="venta_lista_institucion">Código Liquidación</vs-th>
          <vs-th sort-key="libro">Libro</vs-th>

          <vs-th v-if="!mostrarAgrupado" sort-key="codigo">Código</vs-th>
          <vs-th v-if="!mostrarAgrupado" sort-key="bc_estado">Estado Liq.</vs-th>
          <vs-th v-if="!mostrarAgrupado" sort-key="liquidado_regalado">Liq. Regalado</vs-th>
          <vs-th v-if="!mostrarAgrupado" sort-key="fecha_actualizacion">Fecha Actualización</vs-th>

          <vs-th v-if="mostrarAgrupado" sort-key="codigos_liquidados">Códigos Liquidados</vs-th>
          <vs-th v-if="mostrarAgrupado" sort-key="codigos_regalados">Códigos Regalados</vs-th>
          <vs-th v-if="mostrarAgrupado" sort-key="total_codigos">Total Códigos</vs-th>
        </template>


        <template slot-scope="{ data }">
          <vs-tr v-for="(tr, i) in data" :key="i">
            <vs-td>{{ tr.codigo_liquidacion }}</vs-td>
            <vs-td>{{ tr.nombre }}</vs-td>

            <vs-td v-if="!mostrarAgrupado">{{ tr.codigo }}</vs-td>
            <vs-td v-if="!mostrarAgrupado">{{ tr.estado_liquidacion == 0 ? "Liquidado" : "Regalado" }}</vs-td>
            <vs-td v-if="!mostrarAgrupado">{{ tr.liquidado_regalado_texto }}</vs-td>
            <vs-td v-if="!mostrarAgrupado">{{ formatFecha(tr.historico_updated_at) }}</vs-td>

            <vs-td v-if="mostrarAgrupado">{{ tr.codigos_liquidados }}</vs-td>
            <vs-td v-if="mostrarAgrupado">{{ tr.codigos_regalado }}</vs-td>
            <vs-td v-if="mostrarAgrupado">{{ (tr.codigos_liquidados || 0) + (tr.codigos_regalado || 0) +
              (tr.codigos_regalado_liquidado || 0) }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  components: { 'v-select': vSelect, flatPickr },
  data() {
    return {
      listaCodigos: [],
      temporada: [],
      codtemporada: '',
      totalLiquidados: 0,
      totalRegalados: 0,
      fecha_inicio: '',
      fecha_fin: '',
      mostrarAgrupado: false,
      arrayExcel: [],
      configFechaInicio: { dateFormat: 'Y-m-d', maxDate: null },
      configFechaFin: { dateFormat: 'Y-m-d', minDate: null },
      totalCodigos: 0,
    }
  },
  mounted() {
    this.getTemporada()
  },
  computed: {
    listaAgrupada() {
      const grouped = {}
      this.listaCodigos.forEach(c => {
        const key = c.libro_idlibro
        if (!grouped[key]) {
          grouped[key] = {
            libro_idlibro: c.libro_idlibro,
            codigo_liquidacion: c.codigo_liquidacion,
            nombre: c.nombre,
            codigos_liquidados: 0,
            codigos_regalado: 0,
            codigos_regalado_liquidado: 0
          }
        }
        const estado = parseInt(c.estado_liquidacion)
        const liqReg = parseInt(c.liquidado_regalado)
        if (estado === 0) grouped[key].codigos_liquidados++
        if (estado === 2 && liqReg === 0) grouped[key].codigos_regalado++
        if (estado === 2 && liqReg === 1) grouped[key].codigos_regalado_liquidado++
      })
      return Object.values(grouped)
    }
  },
  watch: {
    listaCodigos: 'calcularTotales',
    mostrarAgrupado: 'calcularTotales'
  },
  methods: {
    toggleAgrupado() {
      this.mostrarAgrupado = !this.mostrarAgrupado
      this.actualizarVista()
    },
    actualizarVista() {
      console.log('Vista:', this.mostrarAgrupado ? 'Agrupado' : 'Sueltos')
    },
    formatFecha(val) {
      if (!val) return ''
      const d = new Date(val)
      return isNaN(d) ? val : d.toISOString().slice(0, 19).replace('T', ' ')
    },
    validarFechas() {
      if (this.fecha_inicio && this.fecha_fin && this.fecha_inicio > this.fecha_fin) {
        this.$vs.notify({
          title: 'Rango inválido',
          text: 'La fecha de inicio no puede ser mayor que la fecha final.',
          color: 'warning'
        })
        this.fecha_fin = ''
      }
      this.configFechaInicio.maxDate = this.fecha_fin || null
      this.configFechaFin.minDate = this.fecha_inicio || null
    },
    getTemporada() {
      this.$http.get(this.$server_url + 'get_periodos_pedidos').then(res => {
        this.temporada = res.data.filter(t =>
          !/prueba|test|demo/i.test(t.periodoescolar)
        )
      })
    },
    getCodigosPlanlectorLiquidadoRegalado() {
      if (!this.codtemporada) {
        this.$vs.notify({ title: 'Seleccione una temporada', color: 'warning' })
        return
      }

      this.$vs.loading()
      let params = `?periodo=${this.codtemporada}`
      if (this.fecha_inicio) params += `&fecha_inicio=${this.fecha_inicio}`
      if (this.fecha_fin) params += `&fecha_fin=${this.fecha_fin}`

      this.$http.get(this.$server_url + 'getCodigosPlanlectorLiquidadoRegalado' + params)
        .then(res => {
          this.listaCodigos = res.data
          this.calcularTotales()
          this.$vs.loading.close()
        }).catch(() => this.$vs.loading.close())
    },
    calcularTotales() {
      if (this.mostrarAgrupado) {
        const g = this.listaAgrupada
        this.totalLiquidados = g.reduce((a, b) => a + (b.codigos_liquidados || 0), 0)
        this.totalRegalados = g.reduce((a, b) => a + ((b.codigos_regalado || 0) + (b.codigos_regalado_liquidado || 0)), 0)
        this.totalCodigos = this.totalLiquidados + this.totalRegalados;
      } else {
        this.totalLiquidados = this.listaCodigos.filter(i => i.estado_liquidacion == 0).length
        this.totalRegalados = this.listaCodigos.filter(i => i.estado_liquidacion == 2).length
        this.totalCodigos = this.totalLiquidados + this.totalRegalados;
      }
    },
    async generarExcel() {
      // Importar xlsx dinámicamente
      const XLSX = await import('xlsx')

      // Fecha actual en formato YYYY-MM-DD
      const hoy = new Date()
      const fechaActual = hoy.toISOString().split('T')[0] // 2025-10-23

      // --- Datos HOJA 1: Sueltos ---
      const sueltos = this.listaCodigos.map(i => ({
        'CÓDIGO LIQUIDACIÓN': i.codigo_liquidacion,
        'LIBRO': i.nombre,
        'CÓDIGO': i.codigo,
        'ESTADO LIQ.': i.estado_liquidacion == 0 ? 'Liquidado' : 'Regalado',
        'LIQ. REGALADO': i.liquidado_regalado == 0 ? 'Sin liquidar' : 'Liquidado',
        'FECHA ACTUALIZACIÓN': this.formatFecha(i.historico_updated_at)
      }))

      // Define headers explícitos (mantiene orden)
      const sueltosHeaders = [
        'CÓDIGO LIQUIDACIÓN',
        'LIBRO',
        'CÓDIGO',
        'ESTADO LIQ.',
        'LIQ. REGALADO',
        'FECHA ACTUALIZACIÓN'
      ]

      // --- Datos HOJA 2: Agrupados ---
      const agrupados = this.listaAgrupada.map(i => ({
        'CÓDIGO LIQUIDACIÓN': i.codigo_liquidacion,
        'LIBRO': i.nombre,
        'CÓDIGOS LIQUIDADOS': i.codigos_liquidados,
        'CÓDIGOS REGALADOS': (i.codigos_regalado || 0) + (i.codigos_regalado_liquidado || 0),
        'TOTAL CÓDIGOS': (i.codigos_liquidados || 0) + (i.codigos_regalado || 0) + (i.codigos_regalado_liquidado || 0)
      }))

      const agrupadosHeaders = [
        'CÓDIGO LIQUIDACIÓN',
        'LIBRO',
        'CÓDIGOS LIQUIDADOS',
        'CÓDIGOS REGALADOS',
        'TOTAL CÓDIGOS'
      ]

      // Crear libro y hojas vacías
      const wb = XLSX.utils.book_new()

      // --- Hoja 1: construir paso a paso para controlar filas ---
      const ws1 = {} // hoja vacía
      // Fecha en A1
      XLSX.utils.sheet_add_aoa(ws1, [[`Reporte generado el:`, fechaActual]], { origin: 'A1' })
      // Headers en A2
      XLSX.utils.sheet_add_aoa(ws1, [sueltosHeaders], { origin: 'A2' })
      // Datos desde A3. Usamos skipHeader: true porque ya pusimos los headers manualmente.
      if (sueltos.length > 0) {
        XLSX.utils.sheet_add_json(ws1, sueltos, { origin: 'A3', skipHeader: true, header: sueltosHeaders })
      }
      XLSX.utils.book_append_sheet(wb, ws1, 'Códigos Sueltos')

      // --- Hoja 2: misma lógica ---
      const ws2 = {}
      XLSX.utils.sheet_add_aoa(ws2, [[`Reporte generado el:`, fechaActual]], { origin: 'A1' })
      XLSX.utils.sheet_add_aoa(ws2, [agrupadosHeaders], { origin: 'A2' })
      if (agrupados.length > 0) {
        XLSX.utils.sheet_add_json(ws2, agrupados, { origin: 'A3', skipHeader: true, header: agrupadosHeaders })
      }
      XLSX.utils.book_append_sheet(wb, ws2, 'Códigos Agrupados')

      // Nombre del archivo con fecha actual
      const filename = `codigosPlanLector_${fechaActual}.xlsx`

      // Exportar
      XLSX.writeFile(wb, filename)

      this.$vs.notify({
        title: 'Exportación completada',
        text: `El archivo "${filename}" se generó correctamente.`,
        color: 'success',
      })
    },




  }
}
</script>

<style>
.resumen-card {
  background: #fff;
  border-radius: 10px;
  padding: 18px 25px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.resumen-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.resumen-card .titulo {
  font-weight: 600;
  font-size: 14px;
  margin: 0;
  color: #333;
  text-transform: uppercase;
}

.resumen-card .valor {
  font-size: 22px;
  font-weight: bold;
  color: #111;
  margin-top: 8px;
}

/* Bordes de color */
.orange {
  border-top: 3px solid #f7931a;
  border-bottom: 3px solid #f7931a;
}

.blue {
  border-top: 3px solid #1a73e8;
  border-bottom: 3px solid #1a73e8;
}

.green {
  border-top: 3px solid #34a853;
  border-bottom: 3px solid #34a853;
}
</style>
