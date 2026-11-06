<template>
  <div>
    <!-- <pre>{{ arrayEmpresas }}</pre> -->
    <b>Documento Bodega: {{ ObjectSelected.codigo_devolucion }}</b>
    <ul class="flex mt-5">
      <li class="mr-3">Seleccione la empresa:</li>
      <li class="mr-3">
        <vs-radio
          class="ml-5"
          v-model="empresaSelected"
          v-for="(item, key) in arrayEmpresas"
          :key="key"
          vs-name="radios1empresaSelected"
          :vs-value="item.id_empresa"
        >{{ item.descripcion_corta }}</vs-radio>
      </li>
    </ul>
    <vs-divider></vs-divider>

    <div v-if="!hayDocumentos">
      <p class="text-danger font-bold text-center text-2xl">Primero finalize para poder imprimir</p>
    </div>
    <div v-else>
      <div class="flex justify-center mt-5" v-if="hayDocumentos && ObjectSelected.estado == '2'">
        <vs-button @click="m_imprimirTodos('12px','Reporte','0px','')">
          <i class="fa-solid fa-print"></i> Imprimir
        </vs-button>
      </div>
    </div>

    <div id="seccionImprimir2" class="mt-5" v-if="empresaActual">
      <div>
        <h4 style="text-align: center;" v-if="empresaActual.ven_codigo">
          DEVOLUCIÓN {{ empresaActual.ven_codigo }}
        </h4>

        <table style="width: 100%; border-collapse: collapse; border: none;">
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Fecha:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">{{ ObjectSelected.created_at }}</p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Cliente:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                {{ ObjectSelected.institucion ? ObjectSelected.institucion.nombreInstitucion : 'Sin cliente' }}
              </p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Periodo:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">{{ ObjectSelected.periodo }}</p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Cantidad Cajas:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">{{ ObjectSelected.cantidadCajas }}</p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Cantidad Paquetes:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">{{ ObjectSelected.cantidadPaquetes }}</p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Usuario Creador:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                {{ ObjectSelected.usuario ? ObjectSelected.usuario.nombres + ' ' + ObjectSelected.usuario.apellidos : '' }}
              </p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;"><b>Documento Bodega:</b></p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">{{ ObjectSelected.codigo_devolucion }}</p>
            </td>
          </tr>
        </table>
        <br>
        <p><b>Total Codigos: {{ empresaActual.cantidad }}</b></p>
      </div>
      <br><br>
      <div class="vx-row">
        <div class="vx-col w-full" v-if="empresaActual.documentos && empresaActual.documentos.length > 0">
          <!-- Proceso nuevo: una tabla por factura_perseo -->
          <div v-for="(doc, idx) in empresaActual.documentos" :key="idx" class="mb-5">
            <!-- <p class="font-bold mb-1">Proforma: {{ doc.documento }} | Factura: {{ doc.factura_perseo }}</p> -->
            <TableDevolucionReutilizableVue
              :tableData="doc.arrayCodigos"
              :columnWidths="['10%','20%','5%','5%','10%','10%','10%','10%']"
              :titulo="'Libros ' + empresaActual.descripcion_corta + ' - ' + doc.documento + ' / ' + doc.factura_perseo"
              :headers="['Código','Libro','Cantidad','Descuento %','Precio','Subtotal','Total','Empresa','Observación código']"
              :fieldKeys="['codigo','nombrelibro','cantidad','ven_desc_por','precio','subtotal','total','descripcion_corta','observacion_codigo']"
              :subtotal="doc.subtotal"
              :total="doc.total"
              :ifTotales="Number(1)"
            />
          </div>
        </div>
        <div class="vx-col w-full" v-else-if="empresaActual.arrayCodigos && empresaActual.arrayCodigos.length > 0">
          <!-- Proceso anterior: una sola tabla por empresa -->
          <TableDevolucionReutilizableVue
            :tableData="empresaActual.arrayCodigos"
            :columnWidths="['10%','20%','5%','5%','10%','10%','10%','10%']"
            :titulo="'Libros ' + empresaActual.descripcion_corta"
            :headers="['Código','Libro','Cantidad','Descuento %','Precio','Subtotal','Total','Empresa','Observación código']"
            :fieldKeys="['codigo','nombrelibro','cantidad','ven_desc_por','precio','subtotal','total','descripcion_corta','observacion_codigo']"
            :subtotal="empresaActual.subtotal"
            :total="empresaActual.total"
            :ifTotales="Number(1)"
          />
        </div>
      </div>
      <br><br><br>
      <table style="width: 100%; border-collapse: collapse; border: none;">
        <tr style="border: none;">
          <td style="border: none; text-align: left; padding-left: 0px;">
            <p class="letra" style="font-size: 11px; margin: 0;"><b>Observaciones:</b></p>
            <p class="letra" style="font-size: 11px; margin: 0;">{{ ObjectSelected.observacion }}</p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import imprimirMixin from "@/mixins/Pedidosmix";
const TableDevolucionReutilizableVue = () => import("./TableDevolucionReutilizable.vue");
export default {
  mixins: [imprimirMixin],
  components: { TableDevolucionReutilizableVue },
  props: {
    ObjectSelected: { type: Object, default: () => ({}) },
    // arrayEmpresas ahora viene enriquecido con arrayCodigos, subtotal, total, cantidad, ven_codigo
    arrayEmpresas: { type: Array, default: () => [] },
  },
  data() {
    return {
      empresaSelected: null,
    };
  },
  computed: {
    empresaActual() {
      return this.arrayEmpresas.find(e => e.id_empresa === this.empresaSelected) || null;
    },
    hayDocumentos() {
      return this.arrayEmpresas.some(e => e.ven_codigo && e.ven_codigo !== '');
    },
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      let me = this;
      if (me.arrayEmpresas.length > 0) {
        me.empresaSelected = me.arrayEmpresas[0].id_empresa;
      }
      me.getDocumentosEmpresa();
    },
    getDocumentosEmpresa() {
      let me = this;
      const url = `devoluciones?getDocumentosFinalizados=1&idDocumentoPadre=${me.ObjectSelected.id}`;
      this.$http.get(this.$server_url + url)
        .then(function (res) {
          let datos = res.data;
          // Asignar ven_codigo dinámicamente a cada empresa
          me.arrayEmpresas.forEach(empresa => {
            let match = datos.find(d => d.id_empresa == empresa.id_empresa);
            empresa.ven_codigo = match ? match.ven_codigo : '';
          });
          if (datos.length === 0 || me.ObjectSelected.estado == '1') {
            me.$emit('changeFinished', me.arrayEmpresas);
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        });
    },
  },
};
</script>
