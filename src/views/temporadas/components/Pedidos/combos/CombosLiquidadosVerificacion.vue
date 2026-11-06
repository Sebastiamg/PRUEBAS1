<template>
  <div>
    <div class="flex mb-4">
      <vs-button color="success" @click="exportar" class="mr-4 mt-5">
        <i class="fa-solid fa-file-excel"></i> Exportar
      </vs-button>
    </div>
    <vs-table max-items="10" stripe search pagination :data="arrayCodigosLiquidados">
      <template slot="header">
        <vs-chip color="primary" class="mr-5">Cantidad: <b> {{ arrayCodigosLiquidados.length }}</b></vs-chip>
        <vs-chip color="warning" class="mr-5">Total códigos liquidados: <b>{{ totalCodigosLiquidados }}</b></vs-chip>
        <vs-chip color="success" class="mr-5">Códigos liquidados en otras escuelas: <b>{{ cantidadCodigosLiquidadosOtrasEscuelas }}</b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th>Combo etiqueta</vs-th>
        <vs-th>Códigos del combo</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{data[indextr].combo_etiqueta}}<br>
            <div class="mt-3">
              <!--boton para no mostrar combo-->
              <vs-button color="danger" @click="ObjectSelected=tr;popupConfirm=true"><i class="fa-solid fa-square-xmark"></i> No mostrar combo</vs-button>
            </div>
          </vs-td>
          <vs-td>
            <div v-for="(detalle, indexDetalle) in data[indextr].detalles" :key="indexDetalle">
              <b>Código</b>
              <p>{{ detalle.codigo }}</p>
              <b>Combo:</b>
              <p>{{ detalle.combo }}</p>
              <b v-if="detalle.contrato_liquidada">Contrato que fue liquidado:</b>
              <p v-if="detalle.contrato_liquidada">{{ detalle.contrato_liquidada }}</p>
              <b v-if="detalle.nombre_lista">Institución despacho:</b>
              <p v-if="detalle.nombre_lista">{{ detalle.nombre_lista }}</p>
              <b v-if="detalle.nombreInstitucion">Institución a liquidar:</b>
              <p v-if="detalle.nombreInstitucion">{{ detalle.nombreInstitucion }}</p>
              <b v-if="detalle.fecha_verificacion">Fecha verificación:</b>
              <p v-if="detalle.fecha_verificacion">{{ detalle.fecha_verificacion }}</p>
              <vs-divider></vs-divider>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--modales-->
    <vs-popup classContent="popup-example" class="informacionformSubHijo" title="Confirmación" :active.sync="popupConfirm">
      <div v-if="popupConfirm">
        <p>Estas seguro de <b>no mostrar este combo? {{ ObjectSelected.combo_etiqueta }}</b></p>
        <div class="flex justify-center mt-4">
          <vs-button color="primary" @click="ocultarCombo(ObjectSelected)">Confirmar</vs-button>
          <vs-button color="danger" type="border" class="ml-5" @click="popupConfirm = false">Cancelar</vs-button>

        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import Codigosmix from "@/mixins/Codigosmix";
import Generalmix from "../../../../../mixins/Generalmix";
export default {
  mixins: [Codigosmix, Generalmix],
  data() {
    return {
      usuario:[],
      arrayCodigosLiquidados: [],
      ObjectSelected: {},
      popupConfirm: false, // Controla la visibilidad del popup de confirmación
    };
  },
  props: {
    contrato: {
      type: String,
      required: true,
    },
  },
  computed: {
    cantidadCodigosLiquidadosOtrasEscuelas() {
      let contador = 0;
      this.arrayCodigosLiquidados.forEach((combo) => {
        if (combo.detalles && Array.isArray(combo.detalles)) {
          combo.detalles.forEach((detalle) => {
            if (detalle.verificacion_id && detalle.verificacion_id > 0) {
              contador++;
            }
          });
        }
      });
      return contador;
    },
    totalCodigosLiquidados() {
      let total = 0;
      this.arrayCodigosLiquidados.forEach((combo) => {
        if (combo.detalles && Array.isArray(combo.detalles)) {
          total += combo.detalles.length;
        }
      });
      return total;
    },
  },
  mounted() {
    this.f_obtenerCodigosLiquidados();
  },
  methods: {
    f_obtenerCodigosLiquidados() {
      // Lógica para obtener los códigos liquidados
      let me = this;
      me.$vs.loading();
      var url = `metodosGetVerificaciones?getCombosLiquidadosAnteriores=1&contrato=${this.contrato}`;
      this.$http.get(this.$server_url + url)
        .then((res) => {
          me.$vs.loading.close();
          this.arrayCodigosLiquidados = res.data;
        })
        .catch((error) => {
          me.$vs.loading.close();
          console.log(error + " error");
        });
    },
    ocultarCombo(){
      let me = this;
      let formData = new FormData();
      formData.append('ocultarCodigosCombosLiquidados', '1');
      formData.append('id', me.ObjectSelected.id);
      formData.append('user_oculta', me.usuario.idusuario)
      me.$vs.loading()
      this.$http.post(this.$server_url + 'metodosPostVerificaciones', formData)
      .then(res => {
        me.$vs.loading.close();
        me.popupConfirm = false; // Cerrar popup después de ocultar combo
        me.m_message('Combo ocultado correctamente', 'success');
        me.f_obtenerCodigosLiquidados(); // Volver a cargar los códigos liquidados
      })
      .catch(error => {
        me.$vs.loading.close();
        me.m_message('Error al ocultar combo', 'danger');
        console.log(error + " error");
      });
    },
    exportar() {
      let me = this;
      // Preparar datos para exportar todos los códigos liquidados con más información
      let codeExport = [];
      me.arrayCodigosLiquidados.forEach((combo) => {
        if (combo.detalles && Array.isArray(combo.detalles)) {
          combo.detalles.forEach((detalle) => {
            codeExport.push({
              combo_etiqueta: combo.combo_etiqueta || "",
              codigo: detalle.codigo || "",
              combo: detalle.combo || "",
              escuela_a_liquidar: detalle.nombreInstitucion || "",
              escuela_despacho: detalle.nombre_lista || "",
              contrato_liquidado: detalle.contrato_liquidada || "",
              fecha_verificacion: detalle.fecha_verificacion || "",
            });
          });
        }
      });
      let nameFile = "codigos_combos_liquidado_contrato";
      let headers = [
        "Combo etiqueta",
        "Código",
        "Combo",
        "Escuela",
        "Escuela a liquidar",
        "Escuela despacho",
        "Contrato liquidado",
        "Fecha de verificación",
      ];
      let fieldKeys = [
        "combo_etiqueta",
        "codigo",
        "combo",
        "escuela",
        "escuela_a_liquidar",
        "escuela_despacho",
        "contrato_liquidado",
        "fecha_verificacion",
      ];
      if (typeof me.m_exportTodo === "function") {
        me.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else if (me.$parent && typeof me.$parent.m_exportTodo === "function") {
        me.$parent.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else {
        me.$vs.notify({
          text: "Función de exportación no disponible",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
      }
    },
  },
};
</script>
<style scoped>
.informacionformSubHijo{
  z-index: 51005;
}
</style>
