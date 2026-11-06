<template>
  <div>
    <vs-alert>
        <p class="text-center">Pagos de tipo anticipos, liquidacion y otros valores a cancelar</p>
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
            <vs-radio v-model="radioEstado" vs-name="radioEstado" vs-value="cerrados">
              Cerrados <span style="font-size:12px; color:#888;">({{ totalCerrados }})</span>
            </vs-radio>
          </li>
          <li>
            <vs-radio v-model="radioEstado" vs-name="radioEstado" vs-value="pendientes">
              Pendiente por cerrar <span style="font-size:12px; color:#888;">({{ totalPendientes }})</span>
            </vs-radio>
          </li>
        </ul>
      </div>

      <!-- Tabla de datos -->
      <vs-table max-items="10" stripe search pagination :data="arrayReporte">
        <template slot="header">
          <div style="display:flex; gap:15px; flex-wrap:wrap;">
            <vs-chip color="primary">Cantidad registros: <b>{{ arrayReporte.length }}</b></vs-chip>
            <vs-chip color="success">Total pagos: <b>{{ totalPagos | currency }}</b></vs-chip>
          </div>
        </template>

        <template slot="thead">
          <vs-th>Institución</vs-th>
          <vs-th sort-key="doc_valor">Detalle</vs-th>
          <vs-th sort-key="tipo_pago">Tipo pago</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <!-- Columna 1 -->
            <vs-td>
              <b>Institución</b>
              <p>{{ tr.nombreInstitucion }}</p>
              <b>Contrato:</b>
              <p>{{ tr.contrato_generado }}</p>
              <b>Asesor:</b>
              <p>{{ tr.asesor }}</p>
              <b>Período:</b>
              <p>{{ tr.periodo }}</p>
            </vs-td>

            <!-- Columna 2 -->
            <vs-td>
              <b>Doc valor:</b>
              <p>{{ tr.doc_valor }}</p>
              <b>Estado pago:</b>
              <p v-if="tr.estado == 0" style="background-color:#EDDCC5;padding:5px;margin-top:5px;">
                Pendiente por cerrar
              </p>
              <p v-if="tr.estado == 1" style="background-color:#C5EDD0;padding:5px;margin-top:5px;">
                Cerrado
              </p>
              <b>Forma de pago:</b>
              <p>{{ tr.forma_pago }}</p>
              <b>Doc. Número:</b>
              <p>{{ tr.doc_numero }}</p>
              <b>Doc. Nombre:</b>
              <p>{{ tr.doc_nombre }} {{ tr.doc_apellidos }}</p>
              <b>Entidad Bancaria:</b>
              <p>{{ tr.entidad_bancaria }}</p>
              <b>Doc. Fecha:</b>
              <p>{{ tr.doc_fecha }}</p>
            </vs-td>

            <!-- Columna 3 -->
            <vs-td>
              <b>Tipo pago:</b>
              <p>{{ tr.tipoPago }}</p>

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
      let url = `pedigo_Pagos?getPagosCerradosNoCerrados=1&idPeriodo=${this.periodo_id}`;
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
        "Contrato",
        "Asesor",
        "Período",
        "Doc valor",
        "Forma de pago",
        "Doc. Número",
        "Doc. Nombre",
        "Doc. Apellidos",
        "Entidad Bancaria",
        "Doc. Fecha",
        "Tipo pago",
        "Estado pago",
      ];
      const fieldKeys = [
        "nombreInstitucion",
        "contrato_generado",
        "asesor",
        "periodo",
        "doc_valor",
        "forma_pago",
        "doc_numero",
        "doc_nombre",
        "doc_apellidos",
        "entidad_bancaria",
        "doc_fecha",
        "tipoPago",
        "estadoTexto", // 👈 Estado traducido
      ];

      // Crear copia con estado en texto
      const dataExport = me.arrayReporte.map((item) => {
        return {
          ...item,
          estadoTexto: item.estado == 0 ? "Pendiente por cerrar" : "Cerrado",
        };
      });

      const nombreArchivo = `Reporte_PagosDetalle_${
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
      } else if (newVal == "cerrados") {
        this.arrayReporte = this.arrayOriginal.filter((item) => item.estado == 1);
      } else if (newVal == "pendientes") {
        this.arrayReporte = this.arrayOriginal.filter((item) => item.estado == 0);
      }
    },
  },
  computed: {
    // Totales dinámicos
    totalTodos() {
      return this.arrayOriginal.length;
    },
    totalCerrados() {
      return this.arrayOriginal.filter((item) => item.estado == 1).length;
    },
    totalPendientes() {
      return this.arrayOriginal.filter((item) => item.estado == 0).length;
    },
    // 👇 Nuevo: total de pagos sumando doc_valor
    totalPagos() {
      return this.arrayReporte.reduce((sum, item) => sum + Number(item.doc_valor || 0), 0);
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
