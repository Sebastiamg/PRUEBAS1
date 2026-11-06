<template>
  <div class="p-6">
    <h2 class="mb-2">Pedidos por Institución (prueba API)</h2>
    <p class="mb-4 text-gray-600">
      Período seleccionado:
      <strong>{{ periodoApi.periodoescolar || periodoDescripcion }}</strong>
    </p>

    <div class="flex items-end gap-4 mb-6">
      <div class="filtro-group">
        <label class="block mb-1 font-semibold">Período Escolar</label>
        <v-select
          v-model="periodo_seleccionado"
          :options="periodos"
          placeholder="Seleccionar período"
          label="descripcion"
          :reduce="p => p.idperiodoescolar"
          class="w-64"
          @input="onPeriodoChange"
        >
          <template #no-options>No se encontraron períodos</template>
        </v-select>
      </div>
      <vs-button icon="search" @click="cargarDatos">Buscar</vs-button>
    </div>

    <p v-if="cargando">Cargando...</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
    <p v-else-if="resultados.length === 0 && buscado">Sin resultados para este período.</p>

    <div v-if="!cargando && !error && resultados.length > 0" class="mb-4 flex flex-wrap gap-2">
      <span class="inline-block bg-primary text-white px-3 py-1 rounded font-semibold">
        Escuelas: {{ totalEscuelas }}
      </span>
      <span class="inline-block bg-success text-white px-3 py-1 rounded font-semibold">
        Directa: {{ totalDirecta }}
      </span>
      <span class="inline-block bg-warning text-white px-3 py-1 rounded font-semibold">
        Lista: {{ totalLista }}
      </span>
      <span v-if="totalMixta > 0" class="inline-block bg-dark text-white px-3 py-1 rounded font-semibold">
        Directa y Lista: {{ totalMixta }}
      </span>
    </div>

    <div v-for="inst in resultados" :key="inst.idInstitucion" class="mb-6 border rounded p-4">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <h3 class="font-bold text-lg m-0">{{ inst.nombreInstitucion }}</h3>
        <span
          v-if="inst.tipoVenta"
          class="text-xs px-2 py-1 rounded font-semibold"
          :class="badgeTipoVenta(inst.tipoVenta)"
        >
          {{ inst.tipoVenta }}
        </span>
      </div>
      <p class="text-sm text-gray-600 mb-3">
        ID: {{ inst.idInstitucion }} · Libros: {{ inst.libros.length }}
        <span v-if="inst.id_pedido"> · Pedido: #{{ inst.id_pedido }}</span>
      </p>

      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left p-2">ID Pedido</th>
            <th class="text-left p-2">Código</th>
            <th class="text-left p-2">Libro</th>
            <th class="text-left p-2">Serie</th>
            <th class="text-right p-2">Precio</th>
            <th class="text-right p-2">Pedido</th>
            <th class="text-center p-2">Combo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="libro in inst.libros" :key="inst.idInstitucion + '-' + libro.codigo_liquidacion" class="border-b">
            <td class="p-2">#{{ libro.id_pedido || inst.id_pedido }}</td>
            <td class="p-2">{{ libro.codigo_liquidacion }}</td>
            <td class="p-2">
              <div>{{ libro.nombrelibro }}</div>
              <small v-if="libro.combo === 'si' && libro.pro_descripcion" class="text-gray-500">{{ libro.pro_descripcion }}</small>
            </td>
            <td class="p-2">{{ libro.nombre_serie || '-' }}</td>
            <td class="p-2 text-right">{{ libro.precio }}</td>
            <td class="p-2 text-right font-semibold">{{ libro.pedido }}</td>
            <td class="p-2 text-center">{{ libro.combo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'prueba3',
  components: { 'v-select': vSelect },
  data() {
    return {
      periodos: [],
      periodo_seleccionado: null,
      resultados: [],
      periodoApi: {},
      cargando: false,
      buscado: false,
      error: null,
      mixinIdInicioFormatoNewData: 26,
    }
  },
  computed: {
    periodoDescripcion() {
      if (!this.periodo_seleccionado) return 'Sin seleccionar'
      const p = this.periodos.find(x => x.idperiodoescolar === this.periodo_seleccionado)
      return p
        ? (p.descripcion || p.periodoescolar || 'Período ' + this.periodo_seleccionado)
        : 'Sin seleccionar'
    },
    totalEscuelas() {
      return this.resultados.length
    },
    totalDirecta() {
      return this.resultados.filter(i => i.tipoVenta === 'Directa').length
    },
    totalLista() {
      return this.resultados.filter(i => i.tipoVenta === 'Lista').length
    },
    totalMixta() {
      return 0
    },
  },
  mounted() {
    this.cargarConfigFormato()
    this.getPeriodos().then(() => {
      if (this.periodo_seleccionado) {
        this.cargarDatos()
      }
    })
  },
  methods: {
    badgeTipoVenta(tipo) {
      if (tipo === 'Directa') return 'bg-success text-white'
      if (tipo === 'Lista') return 'bg-warning text-white'
      return 'bg-dark text-white'
    },
    getPeriodos() {
      const url = (this.$server_url || 'http://localhost:8000/') + 'periodo'
      return this.$http.get(url)
        .then(res => {
          const list = Array.isArray(res.data) ? res.data : (res.data.data || [])
          this.periodos = list

          const defaultPeriod = list.find(p =>
            p.idperiodoescolar === 27 ||
            (p.descripcion && p.descripcion.toLowerCase().includes('sierra 2025'))
          )

          if (defaultPeriod) {
            this.periodo_seleccionado = defaultPeriod.idperiodoescolar
          } else if (list.length > 0) {
            const active = list.find(p => p.estado == 1 || p.estado === '1')
            this.periodo_seleccionado = active ? active.idperiodoescolar : list[0].idperiodoescolar
          }
        })
        .catch(err => {
          console.error('Error al cargar períodos:', err)
        })
    },
    onPeriodoChange(val) {
      if (!val) {
        this.resultados = []
        this.buscado = false
        return
      }
      this.cargarDatos()
    },
    cargarConfigFormato() {
      const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew')
      if (mixinData) {
        const parsed = JSON.parse(mixinData)
        if (Array.isArray(parsed) && parsed.length) {
          this.mixinIdInicioFormatoNewData = parsed[0].minimo
        }
      }
    },
    cargarDatos() {
      if (!this.periodo_seleccionado) {
        this.error = 'Selecciona un período'
        return
      }

      const nuevo = this.periodo_seleccionado > this.mixinIdInicioFormatoNewData ? 1 : 0
      const url = `xlibroTodosPorInstitucion?periodo=${this.periodo_seleccionado}&nuevo=${nuevo}`

      this.cargando = true
      this.error = null
      this.buscado = true

      this.$http.get(this.$server_url + url)
        .then(res => {
          if (res.data && res.data.status === '0') {
            this.error = res.data.message
            this.resultados = []
            this.periodoApi = {}
            return
          }
          this.periodoApi = {
            periodo_id: res.data.periodo_id,
            periodoescolar: res.data.periodoescolar,
          }
          this.resultados = res.data.escuelas || []
        })
        .catch(err => {
          console.error(err)
          this.error = 'Error al cargar los datos'
          this.resultados = []
          this.periodoApi = {}
        })
        .finally(() => {
          this.cargando = false
        })
    },
  },
}
</script>
