<template>
  <div>
    <div style="display:flex; justify-content:center; margin: 16px 0; gap: 12px; flex-direction: column; align-items: center;">
        <vs-alert v-if="reporteListo && encabezado.tae_estado != '2' && encabezado.tae_estado != '0'" color="warning" active="true" style="max-width: 600px; text-align: center; margin-bottom: 10px;">
            <p><strong>¡Atención!</strong> Al hacer clic en "Imprimir / Descargar PDF", esta acta pasará a estado <b>Impreso</b> y ya no podrá ser editada.</p>
        </vs-alert>
        <div style="display:flex; justify-content:center; gap: 12px;">
            <vs-button
                v-if="encabezado.tae_estado != '0'"
                color="dark"
                type="line"
                icon-pack="feather"
                icon="icon-printer"
                :disabled="!reporteListo"
                @click="confirmarImpresion()"
            >
                Imprimir / Descargar PDF
            </vs-button>
            <vs-button
                v-if="encabezado.tae_estado == '0'"
                color="dark"
                type="line"
                icon-pack="feather"
                icon="icon-printer"
                :disabled="!reporteListo"
                @click="imprimirAnulado()"
            >
                Imprimir Acta Anulada
            </vs-button>
            <vs-button color="danger" type="line" @click="getCancelar()">Cerrar</vs-button>
        </div>
    </div>

    <div id="seccionImprimir2" v-if="reporteListo">

      <!-- ══ ENCABEZADO ══ -->
      <table width="100%" style="margin-bottom:14px; border-collapse:collapse;">
        <tr>
          <td width="160" valign="middle" style="border:none; padding:0;">
            <img v-if="logoBase64" :src="logoBase64" alt="Logo"
              style="max-width:150px; max-height:70px; object-fit:contain;" />
          </td>

          <td valign="middle" style="border:none; text-align:center; padding:0;">
            <div style="font-size:17px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
              Acta de Entrega – Recepción
            </div>

            <div
              style="margin-top:6px; font-size:11px; font-weight:bold; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:6px 10px; display:inline-block;">
              {{ encabezado.tae_numero_acta }}
            </div>
          </td>

          <td width="160" valign="middle" style="border:none; padding:0;">
          </td>
        </tr>
      </table>

      <!-- ══ TEXTO INTRODUCTORIO ══ -->
      <div style="font-size:12px; text-align:justify; margin-bottom:16px; line-height:1.8;">
        En la ciudad de Quito, a los
        <strong>{{ formatFechaLarga(encabezado.tae_fecha) }}</strong>,
        comparecen por una parte
        <strong>{{ encabezado.tae_entregado_por_display }}</strong>,
        <!-- <span v-if="encabezado.tae_entregado_cargo">, en calidad de <strong>{{ encabezado.tae_entregado_cargo }}</strong></span> -->
        en calidad de quien entrega, y por otra
        <strong>{{ encabezado.tae_recibido_por_display }}</strong>,
        <!-- <span v-if="encabezado.tae_recibido_cargo">, en calidad de <strong>{{ encabezado.tae_recibido_cargo }}</strong></span> -->
        en calidad de quien recibe, dejando constancia de la entrega–recepción de lo siguiente:
      </div>

      <!-- ══ TABLA DE DETALLES ══ -->
      <table border="1" width="100%" style="border-collapse:collapse; font-size:11px; margin-bottom:16px;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:6px 8px; width:50px; text-align:center;">ITEM</th>
            <th style="padding:6px 8px;">DETALLE</th>
            <th style="padding:6px 8px; width:35%;">OBSERVACIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in detalles" :key="i">
            <td style="padding:5px 8px; text-align:center; font-weight:bold;">{{ i + 1 }}</td>
            <td style="padding:5px 8px; white-space:pre-wrap;">{{ d.tad_detalle }}</td>
            <td style="padding:5px 8px; white-space:pre-wrap;">{{ d.tad_observacion }}</td>
          </tr>
          <tr v-if="detalles.length === 0">
            <td colspan="3" style="padding:10px; text-align:center; color:#aaa;">Sin ítems registrados</td>
          </tr>
        </tbody>
      </table>

      <!-- ══ DECLARACIÓN ══ -->
      <div style="font-size:11px; text-align:justify; margin-bottom:24px; line-height:1.7;">
        El receptor declara haber recibido a entera satisfacción el detalle antes señalado, obligándose a su
        correcta utilización, custodia y devolución cuando le sea requerida en caso de ser necesario,
        conforme a las disposiciones internas aplicables.
      </div>

      <div style="font-size:11px; margin-bottom:30px;">Para constancia, firman:</div>
 
      <!-- ══ FIRMAS: Estructura unificada para alineación perfecta y evitar saltos de página ══ -->
      <div style="page-break-inside: avoid; margin-top: 20px;">
          <table width="100%" style="border-collapse:collapse; border:1px solid #ccc;">
            <!-- TITULOS -->
            <tr style="background:#f0f0f0; font-weight:bold; font-size:11px;">
              <td width="50%" style="text-align:center; padding:6px; border:1px solid #ccc;">ENTREGADO POR:</td>
              <td width="50%" style="text-align:center; padding:6px; border:1px solid #ccc;">RECIBIDO POR:</td>
            </tr>
            <!-- ESPACIO FIRMA -->
            <tr>
              <td style="height:55px; border:1px solid #ccc;"></td>
              <td style="height:55px; border:1px solid #ccc;"></td>
            </tr>
            <!-- NOMBRES -->
            <tr style="font-size:12px; font-weight:bold;">
              <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                {{ encabezado.tae_entregado_por_display }}
              </td>
              <td style="text-align:center; padding:6px; border:1px solid #ccc; vertical-align:middle;">
                {{ encabezado.tae_recibido_por_display }}
              </td>
            </tr>
            <!-- CARGOS -->
            <tr style="font-size:11px; font-weight:bold;">
              <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                <span v-if="encabezado.tae_entregado_cargo">CARGO: {{ encabezado.tae_entregado_cargo }}</span>
              </td>
              <td style="text-align:center; padding:5px; border:1px solid #ccc;">
                <span v-if="encabezado.tae_recibido_cargo">CARGO: {{ encabezado.tae_recibido_cargo }}</span>
              </td>
            </tr>
          </table>
      </div>

    </div>

    <div v-else style="text-align:center; padding:60px; color:#aaa;">
      <p>Cargando datos del acta...</p>
    </div>
  </div>
</template>

<script>
import imprimirMixin from "@/mixins/Pedidosmix.js";

export default {
  mixins: [imprimirMixin],
  props: {
    tab_ActaEntrega: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      logoBase64: null,
      detalles: [],
      encabezado: {},
      reporteListo: false,
      meses: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    };
  },
  mounted() {
    Promise.all([
      this.cargarLogo(),
      this.cargarDetalles(),
    ]).then(() => {
      this.encabezado = { ...this.tab_ActaEntrega };
      this.reporteListo = true;
    });
  },
  methods: {
    cargarLogo() {
      return this.$http.get(this.$server_url + 'VerifcarMetodosGet_ActaEntrega?action=Get_LogoEmpresa')
        .then(res => { this.logoBase64 = res.data.img_base64; })
        .catch(err => console.log(err));
    },
    cargarDetalles() {
      return this.$http.get(this.$server_url + 'VerifcarMetodosGet_ActaEntrega?action=Get_DetalleActaEntrega&tae_id=' + this.tab_ActaEntrega.tae_id)
        .then(res => { this.detalles = res.data; })
        .catch(err => console.log(err));
    },
    formatFechaLarga(fecha) {
      if (!fecha) return '___';
      const [anio, mes, dia] = fecha.split('-');
      if (!anio || !mes || !dia) return fecha;
      return `${parseInt(dia, 10)} de ${this.meses[parseInt(mes, 10) - 1]} de ${anio}`;
    },
    getCancelar() { this.$emit('change', { verificacionemitimprimir: 2 }); },
    confirmarImpresion() {
      let me = this;
      if (me.encabezado.tae_estado == '2') {
        me.m_imprimirTodos('11px', 'Acta_Entrega', '1px', '', 'portrait');
        return;
      }
      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: `Confirmar Impresión`,
        text: '¿Está seguro de imprimir esta acta? Una vez impresa, pasará a estado "Impresa" y no se podrá editar.',
        acceptText: 'Sí, Imprimir',
        cancelText: 'Cancelar',
        accept: me.ejecutarImpresion
      })
    },
    imprimirAnulado() {
      let me = this;
      me.m_imprimirTodos('11px', 'Acta_Entrega', '1px', 'ANULADO', 'portrait');
    },
    ejecutarImpresion() {
      let me = this;
      me.$vs.loading();

      let formData = new FormData();
      formData.append('action', 'CambiarEstadoImpreso_ActasEntrega');
      formData.append('tae_id', me.tab_ActaEntrega.tae_id);

      me.$http.post(me.$server_url + 'VerifcarMetodosPost_ActaEntrega', formData)
      .then(res => {
        me.$vs.loading.close();
        if (res.data.status === 1) {
          me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
          me.encabezado.tae_estado = '2';
          me.m_imprimirTodos('11px', 'Acta_Entrega', '1px', '', 'portrait');
          me.$emit('change', { verificacionemitimprimir: 1 });
        } else {
          me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-x' });
        }
      })
      .catch(err => {
        console.log(err);
        me.$vs.loading.close();
        me.$vs.notify({ text: 'Error al cambiar de estado', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
      });
    },
  },
};
</script>
<style scoped></style>
