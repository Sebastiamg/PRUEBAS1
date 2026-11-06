<template>
  <div>
    <vs-alert>
      <p class="text-center">Convenios aprobados y pendientes de aprobación</p>
    </vs-alert>
    <br>
    <div>
      <!-- Controles arriba de la tabla -->
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
        <!-- Botón exportar -->
        <vs-button @click="f_exportar" color="success" class="p-2">
          <i class="fa-solid fa-file-arrow-down"></i> Exportar
        </vs-button>

        <!-- Radios para filtrar por estado -->
        <ul style="display:flex; align-items:center; gap:10px; list-style:none; margin:0; padding:0;">
          <li>
            <vs-radio v-model="radioEstado" vs-name="radioEstado" vs-value="todos">
              Todos <span style="font-size:12px; color:#888;">({{ totalTodos }})</span>
            </vs-radio>
          </li>
          <li>
            <vs-radio v-model="radioEstado" vs-name="radioEstado" vs-value="aprobados">
              Aprobados <span style="font-size:12px; color:#888;">({{ totalAprobados }})</span>
            </vs-radio>
          </li>
          <li>
            <vs-radio v-model="radioEstado" vs-name="radioEstado" vs-value="pendientes">
              Pendientes <span style="font-size:12px; color:#888;">({{ totalPendientes }})</span>
            </vs-radio>
          </li>
        </ul>
      </div>

      <!-- Tabla de datos -->
      <vs-table max-items="10" stripe search pagination :data="arrayReporte">
        <template slot="header">
          <div style="display:flex; gap:15px; flex-wrap:wrap;">
            <vs-chip color="primary">Cantidad registros: <b>{{ arrayReporte.length }}</b></vs-chip>
            <vs-chip color="success">Total anticipos: <b>{{ totalAnticipos | currency }}</b></vs-chip>
          </div>
        </template>

        <template slot="thead">
          <vs-th>Institución</vs-th>
          <vs-th sort-key="anticipo_global">Anticipo global</vs-th>
          <vs-th sort-key="convenio_anios">Convenio (años)</vs-th>
          <vs-th>Estado</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <!-- Columna 1 -->
            <vs-td>
              <b>Institución</b>
              <p>{{ tr.nombreInstitucion }}</p>
              <b>
                Contrato:
              </b>
              <p>{{ tr.contrato_generado || '---' }}</p>
              <b>Período:</b>
              <p>{{ tr.periodo }}</p>
              <b>Observación:</b>
              <p>{{ tr.observacion || '---' }}</p>
            </vs-td>

            <!-- Columna 2 -->
            <vs-td>
              <b>Anticipo global:</b>
              <p>{{ tr.anticipo_global | currency }}</p>
            </vs-td>

            <!-- Columna 3 -->
            <vs-td>
              <b>Años:</b>
              <p>{{ tr.convenio_anios }}</p>
            </vs-td>

            <!-- Columna 4 -->
            <vs-td>
              <b>Estado:</b>
              <p v-if="tr.convenio_aprobado == 0" style="background-color:#EDDCC5;padding:5px;margin-top:5px;">
                Pendiente de aprobar
              </p>
              <p v-else style="background-color:#C5EDD0;padding:5px;margin-top:5px;">
                Aprobado
              </p>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
import Generalmix from "../../../../mixins/Generalmix";
import Codigosmix from "@/mixins/Codigosmix";

export default {
  mixins: [Generalmix, Codigosmix],
  props: {
    periodo_id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      arrayReporte: [],
      arrayOriginal: [],
      nombrePeriodo: "",
      radioEstado: "todos",
    };
  },
  mounted() {
    this.f_getReporte();
  },
  methods: {
    // Obtener datos
    f_getReporte() {
      let me = this;
      let url = `pedigo_Pagos?getConveniosAprobadosNoAprobados=1&idPeriodo=${this.periodo_id}`;
      me.$vs.loading();
      this.$http
        .get(this.$server_url + url)
        .then(function (res) {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.m_message(res.data.message, "danger");
            return;
          }
          me.arrayOriginal = res.data;
          me.arrayReporte = res.data;
          if (me.arrayReporte.length == 0) {
            me.m_message("No se encontraron datos", "warning");
          } else {
            me.nombrePeriodo = me.arrayReporte[0].periodo;
          }
        })
        .catch(function (error) {
          me.$vs.loading.close();
          console.log(error + " error");
          me.m_message("Hubo un error al obtener el reporte", "danger");
        });
    },

    // Exportar datos
    f_exportar() {
      let me = this;
      const headers = [
        "Institución",
        "Período",
        "Anticipo global",
        "Convenio (años)",
        "Observación",
        "Estado",
      ];
      const fieldKeys = [
        "nombreInstitucion",
        "periodo",
        "anticipo_global",
        "convenio_anios",
        "observacion",
        "estadoTexto", // 👈 Estado traducido
      ];

      // Crear copia con estado en texto
      const dataExport = me.arrayReporte.map((item) => {
        return {
          ...item,
          estadoTexto: item.convenio_aprobado == 0 ? "Pendiente de aprobar" : "Aprobado",
        };
      });

      const nombreArchivo = `Reporte_Convenios_${
        me.nombrePeriodo || me.periodo_id || "Periodo"
      }.xlsx`;

      me.m_exportTodo(headers, fieldKeys, dataExport, nombreArchivo);
    },
  },
  watch: {
    // Cambiar filtro de estado
    radioEstado(newVal) {
      if (newVal == "todos") {
        this.arrayReporte = this.arrayOriginal;
      } else if (newVal == "aprobados") {
        this.arrayReporte = this.arrayOriginal.filter((item) => item.convenio_aprobado != 0);
      } else if (newVal == "pendientes") {
        this.arrayReporte = this.arrayOriginal.filter((item) => item.convenio_aprobado == 0);
      }
    },
  },
  computed: {
    // Totales dinámicos
    totalTodos() {
      return this.arrayOriginal.length;
    },
    totalAprobados() {
      return this.arrayOriginal.filter((item) => item.convenio_aprobado != 0).length;
    },
    totalPendientes() {
      return this.arrayOriginal.filter((item) => item.convenio_aprobado == 0).length;
    },
    // 👇 Nuevo: total anticipos sumando anticipo_global
    totalAnticipos() {
      return this.arrayReporte.reduce((sum, item) => sum + Number(item.anticipo_global || 0), 0);
    },
  },
  filters: {
    currency(value) {
      if (!value) return "0.00";
      return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
};
</script>
