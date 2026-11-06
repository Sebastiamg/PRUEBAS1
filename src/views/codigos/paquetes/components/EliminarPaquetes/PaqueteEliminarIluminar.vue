<template>
  <div>
    <!-- Modal de errores de validación -->
    <vs-popup title="Errores en excel de paquetes" :active.sync="modalErrores" style="padding: 0% !important;">
      <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
        <div class="vx-row">
          <div class="vx-col w-full">
            <b>Código</b>
          </div>
          <div class="vx-col w-full">
            <b>Problema</b>
          </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in erroresValidacion">
          <div class="vx-row">
            <div class="vx-col w-full">
              <span>{{ item.codigo }}</span>
            </div>
            <div class="vx-col w-full">
              <span>{{ item.problema }}</span>
            </div>
          </div>
        </div>
      </div>
    </vs-popup>

    <!-- Modal de confirmación -->
    <vs-popup small title="Confirmación de eliminación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>¿Está seguro de eliminar estos {{ paquetesDisponibles.length }} paquetes?</h4>
        <p class="text-danger mt-2">Esta acción cambiará el estado a 0 (eliminado)</p>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="eliminarPaquetes()"> Confirmar Eliminación </vs-button>
      </div>
    </vs-popup>

    <vs-card>
      <div class="mb-6 mt-5" align="center">
        <div class="vx-col w-full">
          <p style="color:#D2B61A;">
            <i class="fa fa-file" aria-hidden="true"></i> Importar paquetes para eliminar (iluminar)
            <span style="font-weight: bold;">(máximo 1500 registros por carga)</span>
          </p>
          <p class="mt-2" style="color:#e74c3c; font-weight: bold;">
            * Los códigos deben tener el prefijo "PAQ-"
          </p>
        </div>
        <br/>
        <import-excel :onSuccess="loadDataInTable" class="mb-4" />

        <div>
          <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12">
              <vs-card>
                <div class="header">
                  <p style="font-weight: bold;">Formato del archivo excel</p>
                  <table class="tabla">
                    <tr>
                      <th class="th1">codigo</th>
                    </tr>
                    <tr>
                      <td class="td1">PAQ-XXXX</td>
                    </tr>
                  </table>
                </div>
              </vs-card>
            </vs-col>
          </vs-row>
        </div>

        <!-- Resultados de la validación -->
        <vs-row v-if="validacionRealizada" class="mt-5">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-card>
              <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                  <vs-card>
                    <p style="font-weight: bold; color: #27ae60;">Disponibles para eliminar</p>
                    <h2 class="text-success">{{ paquetesDisponibles.length }}</h2>
                  </vs-card>
                </div>
                <div class="vx-col w-full md:w-1/3">
                  <vs-card>
                    <p style="font-weight: bold; color: #e67e22;">Ya eliminados (estado 0)</p>
                    <h2 class="text-warning">{{ paquetesYaEliminados.length }}</h2>
                  </vs-card>
                </div>
                <div class="vx-col w-full md:w-1/3">
                  <vs-card>
                    <p style="font-weight: bold; color: #e74c3c;">No existen en Tabla de Paquetes a Eliminar</p>
                    <h2 class="text-danger">{{ paquetesNoExisten.length }}</h2>
                  </vs-card>
                </div>
              </div>
            </vs-card>
          </vs-col>
        </vs-row>

        <!-- Botón para eliminar -->
        <vs-row v-if="paquetesDisponibles.length > 0" class="mt-3">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-button class="mb-2" color="danger" type="gradient" @click="confirmarEliminacion()">
              Eliminar {{ paquetesDisponibles.length }} Paquetes
            </vs-button>
          </vs-col>
        </vs-row>
      </div>
    </vs-card>

     <!-- Layout en 2 columnas para Disponibles y No Existen -->
    <div v-if="paquetesDisponibles.length > 0 || paquetesNoExisten.length > 0" class="mt-5">
      <div class="vx-row">
        <!-- Paquetes disponibles para eliminar -->
        <div :class="paquetesNoExisten.length > 0 ? 'vx-col w-full lg:w-1/2' : 'vx-col w-full'">
          <vs-card v-if="paquetesDisponibles.length > 0">
            <TableReutilizableVue
              :title="'Paquetes disponibles para eliminar'"
              :headers="['Código Paquete', 'Estado']"
              :fieldKeys="['codigo', 'estadoDescripcion']"
              :tableData="paquetesDisponibles"
              :ifexportar="Number(1)"
              :exportFileName="'paquetes_disponibles_eliminar'"
            />
          </vs-card>
        </div>

        <!-- Paquetes que no existen -->
        <div :class="paquetesDisponibles.length > 0 ? 'vx-col w-full lg:w-1/2' : 'vx-col w-full'">
          <vs-card v-if="paquetesNoExisten.length > 0">
            <TableReutilizableVue
              :title="'Paquetes que NO existen en Tabla de Paquetes a Eliminar'"
              :headers="['Código Paquete']"
              :fieldKeys="['codigo']"
              :tableData="paquetesNoExisten"
              :ifexportar="Number(1)"
              :exportFileName="'paquetes_no_existen'"
            />
          </vs-card>
        </div>
      </div>
    </div>

    <!-- Tabla de códigos cargados del Excel -->
    <vx-card v-if="tableData.length && header.length" class="mt-5">
      <vs-table stripe pagination :max-items="10" search :data="tableData">
        <template slot="header">
          <h4>Códigos cargados: {{ tableData.length }}</h4>
        </template>
        <template slot="thead">
          <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
              {{ col }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>



    <!-- Tabla de paquetes ya eliminados -->
    <vs-row v-if="paquetesYaEliminados.length > 0" class="mt-5">
      <vs-card class="w-full">
        <TableReutilizableVue
          :title="'Paquetes ya eliminados (estado 0)'"
          :headers="['Código Paquete', 'Estado', 'Fecha Creación']"
          :fieldKeys="['codigo', 'estadoDescripcion', 'created_at']"
          :tableData="paquetesYaEliminados"
          :showExport="true"
          :exportFileName="'paquetes_ya_eliminados'"
        />
      </vs-card>
    </vs-row>
  </div>
</template>

<script>
import ImportExcel from '@/views/codigos/components/importExcel.vue'
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
  components: {
    ImportExcel,
    TableReutilizableVue
  },
  data() {
    return {
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      modalConfirm: false,
      modalErrores: false,
      erroresValidacion: [],
      validacionRealizada: false,
      paquetesDisponibles: [],
      paquetesYaEliminados: [],
      paquetesNoExisten: []
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  methods: {
    loadDataInTable({ results, header, meta }) {
      this.header = header
      this.tableData = results
      this.sheetName = meta.sheetName
      this.validacionRealizada = false
      this.paquetesDisponibles = []
      this.paquetesYaEliminados = []
      this.paquetesNoExisten = []

      // Validar automáticamente al cargar el archivo
      this.$nextTick(() => {
        this.validarPaquetes()
      })
    },

    validarPaquetes() {
      let me = this
      me.erroresValidacion = []

      // Validar que no exceda el límite
      if (me.tableData.length > 1500) {
        me.$vs.notify({
          text: 'No puede cargar más de 1500 registros',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      // Validar formato del excel
      if (!me.tableData[0] || !me.tableData[0].codigo) {
        me.$vs.notify({
          text: 'El formato del excel es incorrecto. Debe tener una columna "codigo"',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      // Validar que todos tengan PAQ- y no estén vacíos
      $.each(me.tableData, function(key, value) {
        if (!value.codigo || value.codigo.trim() === '') {
          me.erroresValidacion.push({
            codigo: 'Fila ' + (key + 2),
            problema: 'El código está vacío'
          })
        } else if (!value.codigo.toUpperCase().startsWith('PAQ-')) {
          me.erroresValidacion.push({
            codigo: value.codigo,
            problema: 'El código no tiene el prefijo PAQ-'
          })
        }
      })

      if (me.erroresValidacion.length > 0) {
        me.modalErrores = true
        return
      }

      // Si todo está bien, enviar a validar al backend
      me.$vs.loading()
      let json_codigos = JSON.stringify(me.tableData)
      let formData = new FormData()
      formData.append('data_codigos', json_codigos)

      this.$http.post(this.$server_url + 'paquetes/validarPaquetesParaEliminar', formData)
        .then(res => {
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

          me.validacionRealizada = true

          // Agregar estadoDescripcion a paquetesDisponibles
          me.paquetesDisponibles = res.data.disponibles.map(p => ({
            ...p,
            estadoDescripcion: p.estado == 1 ? 'Activo' : 'Eliminado'
          }))

          // Agregar estadoDescripcion a paquetesYaEliminados
          me.paquetesYaEliminados = res.data.yaEliminados.map(p => ({
            ...p,
            estadoDescripcion: p.estado == 1 ? 'Activo' : 'Eliminado'
          }))

          me.paquetesNoExisten = res.data.noExisten

          me.$vs.notify({
            text: 'Validación completada exitosamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        })
        .catch(function(error) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Error al validar los paquetes',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
    },

    confirmarEliminacion() {
      this.modalConfirm = true
    },

    eliminarPaquetes() {
      let me = this
      me.$vs.loading()

      let codigos = me.paquetesDisponibles.map(p => p.codigo)
      let formData = new FormData()
      formData.append('codigos', JSON.stringify(codigos))
      formData.append('user_eliminar', me.usuario.idusuario)

      this.$http.post(this.$server_url + 'paquetes/eliminarPaquetesMasivo', formData)
        .then(res => {
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
            text: `Se eliminaron ${res.data.eliminados} paquetes exitosamente`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })

          me.modalConfirm = false
          me.tableData = []
          me.validacionRealizada = false
          me.paquetesDisponibles = []
          me.paquetesYaEliminados = []
          me.paquetesNoExisten = []
        })
        .catch(function(error) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Error al eliminar los paquetes',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
    }
  }
}
</script>

<style scoped>
.tabla {
  border-collapse: collapse;
  width: 100%;
}

.th1, .td1 {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.th1 {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>
