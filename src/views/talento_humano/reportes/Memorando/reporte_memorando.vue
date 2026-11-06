<template>
  <div>
    <!-- Botones de acción -->
    <div style="display:flex; justify-content:center; margin: 16px 0; gap: 12px; flex-direction: column; align-items: center;">
        <vs-alert v-if="reporteListo && encabezado.tme_estado != '2' && encabezado.tme_estado != '0'" color="warning" active="true" style="max-width: 600px; text-align: center; margin-bottom: 10px;">
            <p><strong>¡Atención!</strong> Al hacer clic en "Imprimir / Descargar PDF", este memorando pasará a estado <b>Impreso</b> y ya no podrá ser editado.</p>
        </vs-alert>
        <div style="display:flex; justify-content:center; gap: 12px;">
            <vs-button
                v-if="encabezado.tme_estado != '0'"
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
                v-if="encabezado.tme_estado == '0'"
                color="dark"
                type="line"
                icon-pack="feather"
                icon="icon-printer"
                :disabled="!reporteListo"
                @click="imprimirAnulado()"
            >
                Imprimir Memorando Anulado
            </vs-button>
            <vs-button color="danger" type="line" @click="getCancelar()">Cerrar</vs-button>
        </div>
    </div>

    <!-- ══ CONTENIDO IMPRIMIBLE ══ -->
    <div id="seccionImprimir2" v-if="reporteListo">

      <!-- LOGO (fuera del contenido editable, siempre se imprime) -->
      <!-- <table width="100%" style="margin-bottom:20px; border-collapse:collapse;">
        <tr>
          <td width="160" valign="middle" style="border:none; padding:0;">
            <img v-if="logoBase64" :src="logoBase64" alt="Logo"
              style="max-width:150px; max-height:70px; object-fit:contain;" />
            <div v-else style="color:#00738b; font-weight:bold; font-size:20px;">GRUPO CALMED</div>
          </td>
        </tr>
      </table> -->

      <!-- INFO MEMO (Fijo, no editable) -->
      <!-- <div style="font-size:12px; margin-bottom:10px; line-height:1.8;">
          <div style="font-weight:bold; font-size:13px;">
              Memorando Nro. <strong>{{ encabezado.tme_numero_memo }}</strong>
          </div>
      </div> -->

      <!-- CONTENIDO LIBRE (HTML guardado por el usuario) -->
      <div class="memo-contenido-libre" v-html="contenidoFormateado"></div>

    </div>

    <div v-else style="text-align:center; padding:60px; color:#aaa;">
      <p>Cargando datos del memorando...</p>
    </div>
  </div>
</template>

<script>
import imprimirMixin from "@/mixins/Imprimir_CK_EDITOR_ConEncabezadoMix.js";

export default {
  mixins: [imprimirMixin],
  props: {
    tab_Memo: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      logoBase64: null,
      contenidoFormato: '',
      encabezado: {},
      reporteListo: false,
    };
  },
  computed: {
    /**
     * Preprocesa el HTML guardado en CKEditor para evitar que las tablas
     * se corten en saltos de página al imprimir.
     * Se inyectan estilos inline directamente en cada <tr> y <table>
     * ya que los estilos @media print no siempre afectan contenido de v-html.
     */
    contenidoFormateado() {
      if (!this.contenidoFormato) return '';
      let html = this.contenidoFormato;
      // Inyectar page-break-inside:avoid en cada <tr>
      html = html.replace(/<tr(\s[^>]*)?>/gi, (match, attrs) => {
        const a = attrs || '';
        if (a.toLowerCase().includes('page-break-inside')) return match;
        if (a.includes('style=')) {
          return `<tr${a.replace(/style="/i, 'style="page-break-inside:avoid;break-inside:avoid;')}>`;
        }
        return `<tr${a} style="page-break-inside:avoid;break-inside:avoid;">`;
      });
      // Inyectar break-inside:avoid en cada <table>
      html = html.replace(/<table(\s[^>]*)?>/gi, (match, attrs) => {
        const a = attrs || '';
        if (a.toLowerCase().includes('break-inside')) return match;
        if (a.includes('style=')) {
          return `<table${a.replace(/style="/i, 'style="break-inside:avoid;')}>`;
        }
        return `<table${a} style="break-inside:avoid;">`;
      });
      // NOTA: @page NO se define aquí ya que Imprimir_CK_EDITOR_ConEncabezadoMix.js
      // controla todo el layout de la página (márgenes, cabecera y pie).
      const estilosImpresion = ``;
      return html + estilosImpresion;
    },
  },
  mounted() {
    Promise.all([
      this.cargarLogo(),
      this.cargarContenido(),
    ]).then(() => {
      this.encabezado = { ...this.tab_Memo };
      this.reporteListo = true;
    });
  },
  methods: {
    cargarLogo() {
      return this.$http.get(this.$server_url + 'VerifcarMetodosGet_Memo?action=Get_LogoEmpresa')
        .then(res => { this.logoBase64 = res.data.img_base64; })
        .catch(err => console.log(err));
    },
    cargarContenido() {
      return this.$http.get(this.$server_url + 'VerifcarMetodosGet_Memo?action=Get_DetalleMemo&tme_id=' + this.tab_Memo.tme_id)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.contenidoFormato = res.data[0].tmd_formatolibre || '';
          }
        })
        .catch(err => console.log(err));
    },
    getCancelar() { this.$emit('change', { verificacionemitimprimir: 2 }); },
    confirmarImpresion() {
      let me = this;
      if (me.encabezado.tme_estado == '2') {
        me.m_imprimirTH('11px', 'Memorando_HS_E', '', 'portrait');
        return;
      }
      this.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Confirmar Impresión',
        text: '¿Está seguro de imprimir este memorando? Una vez impreso, pasará a estado "Impreso" y no se podrá editar.',
        acceptText: 'Sí, Imprimir',
        cancelText: 'Cancelar',
        accept: me.ejecutarImpresion
      });
    },
    imprimirAnulado() {
      let me = this;
      me.m_imprimirTH('11px', 'Memorando_HS_E', 'ANULADO', 'portrait');
    },
    ejecutarImpresion() {
      let me = this;
      me.$vs.loading();
      me.$http.post(me.$server_url + 'VerifcarMetodosPost_Memo', {
          action: 'CambiarEstadoImpreso_Memo',
          tme_id: me.encabezado.tme_id
      })
      .then(res => {
        me.$vs.loading.close();
        if (res.data.status === 1) {
          me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
          me.encabezado.tme_estado = '2';
          me.m_imprimirTH('11px', 'Memorando_HS_E', '', 'portrait');
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

<style>
/*
 * Contenedor del contenido libre del memorando.
 * Resetea los estilos del tema Vuexy que pisan los atributos
 * inline generados por CKEditor (align, cellpadding, colores, etc.)
 */
.memo-contenido-libre {
    font-size: 12px;
    line-height: 1.8;
    color: #333;
}

/* Respetar align="center/left/right" en tablas */
.memo-contenido-libre table[align="center"] {
    margin-left: auto !important;
    margin-right: auto !important;
}
.memo-contenido-libre table[align="left"] {
    margin-left: 0 !important;
    margin-right: auto !important;
}
.memo-contenido-libre table[align="right"] {
    margin-left: auto !important;
    margin-right: 0 !important;
}

/* No forzar width:100% en tablas que tienen su propio width */
.memo-contenido-libre table {
    width: auto;
    border-collapse: collapse;
}
.memo-contenido-libre table[style*="width:100%"],
.memo-contenido-libre table[width="100%"] {
    width: 100% !important;
}

/* No pisar text-align de th/td */
.memo-contenido-libre th,
.memo-contenido-libre td {
    text-align: inherit;
    background-color: transparent;
    vertical-align: middle;
}

/* Respetar background-color inline en celdas */
.memo-contenido-libre td[style*="background"],
.memo-contenido-libre th[style*="background"] {
    background-color: revert;
}

/* Respetar white-space:nowrap */
.memo-contenido-libre td[style*="white-space:nowrap"],
.memo-contenido-libre th[style*="white-space:nowrap"] {
    white-space: nowrap !important;
}

/* ── Evitar corte de tablas al imprimir ───────────────── */
@media print {
    /*
     * Intenta mantener cada tabla entera en una sola página.
     * Si la tabla es más grande que la página, igualmente
     * saltará, pero solo entre filas (no a mitad de una fila).
     */
    .memo-contenido-libre table {
        page-break-inside: auto;
        break-inside: auto;
    }

    /* La FILA nunca se corta a mitad. Si no cabe, salta a la
       página siguiente completa. */
    .memo-contenido-libre tr {
        page-break-inside: avoid;
        break-inside: avoid;
    }

    /* Las celdas tampoco se cortan */
    .memo-contenido-libre td,
    .memo-contenido-libre th {
        page-break-inside: avoid;
        break-inside: avoid;
    }
}
</style>
