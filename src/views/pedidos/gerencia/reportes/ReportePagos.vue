<template>

  <div>

    <h1>Detalle de Pagos (con contratos)</h1>

    <br>

    <vs-button type="flat" class="p-2" icon-pack="fa" :icon="showTable ? 'fa-eye-slash' : 'fa-eye'"

      @click="showTable = !showTable"

      color="primary"

      title="Mostrar/Ocultar tabla">

    </vs-button>

    <br>

    <div>

      <vs-button @click="getReporte" class="p-2" color="primary" icon="refresh">

        Cargar Reporte

      </vs-button>

      <div>

        <div class="vx-row mt-3">

          <div class="vx-col w-full mb-6" v-if="tieneDatos">

            <p class="rp-total-general text-center text-lg text-gray-600 mb-4">
              Cerrados y pendientes por cerrar o registrar: <b class="text-gray-900">{{ totalGeneral | filtrarDecimal }}</b>
            </p>

            <div class="rp-cards-layout">

              <!-- Pagos cerrados (sin deuda anterior) -->
              <div class="rp-card-cerrados">
                <h3 class="rp-card-cerrados__label">Pagos cerrados</h3>
                <p class="rp-card-cerrados__val">{{ totalPagos | filtrarDecimal }}</p>
              </div>

              <!-- Deudas anteriores cerradas -->
              <div class="rp-card-cerrados rp-card-cerrados--deuda">
                <h3 class="rp-card-cerrados__label">Deuda Anterior cerrada</h3>
                <p class="rp-card-cerrados__val">{{ totalDeudaAnteriorCerrada | filtrarDecimal }}</p>
              </div>

              <!-- Columna derecha: pendientes + desglose -->
              <div class="rp-card-derecha">
                <div class="kpi-pending-row">
                  <div class="kpi-pending-row__left">
                    <i class="fa-solid fa-hourglass-half kpi-pending-row__ico"></i>
                    <div>
                      <vx-tooltip text="Saldos pendientes de anticipos, liquidaciones, convenios y otros que aún no están cerrados o falta registrar por completo." position="top">
                        <span class="kpi-pending-row__label">Pagos Pendientes de Cerrar <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></span>
                      </vx-tooltip>
                      <p class="kpi-pending-row__hint">Al cerrarse o registrarse → pasan a Pagos cerrados</p>
                    </div>
                  </div>
                  <span class="kpi-pending-row__val" :class="totalSaldosPendientes > 0 ? 'kpi-pending-row__val--alert' : ''">
                    {{ totalSaldosPendientes | filtrarDecimal }}
                  </span>
                </div>

                <div class="pp-dashboard-hero__breakdown">
                  <div class="pp-breakdown-item pp-breakdown-item--pagos">
                    <div class="pp-breakdown-item__icon">
                      <i class="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div class="pp-breakdown-item__content">
                      <span class="pp-breakdown-item__label">Total Saldos pendientes de Anticipos/Liquidaciones/Otras Deudas</span>
                      <span class="pp-breakdown-item__val">$ {{ totalPagosPendientesPorCerrar | filtrarDecimal }}</span>
                      <span class="pp-breakdown-item__sub">
                        Sin cerrar: {{ totalPagosTipoSinCerrar | filtrarDecimal }} · Falta registrar: {{ totalPagosTipoFaltaRegistrar | filtrarDecimal }}
                      </span>
                    </div>
                  </div>
                  <div class="pp-breakdown-item pp-breakdown-item--convenio">
                    <div class="pp-breakdown-item__icon">
                      <i class="fa-solid fa-handshake"></i>
                    </div>
                    <div class="pp-breakdown-item__content">
                      <span class="pp-breakdown-item__label">Total Saldos pendientes del convenio</span>
                      <span class="pp-breakdown-item__val">$ {{ totalConvenioPendientesPorCerrar | filtrarDecimal }}</span>
                      <span class="pp-breakdown-item__sub">
                        Sin cerrar: {{ totalConvenioSinCerrar | filtrarDecimal }} · Falta registrar: {{ totalConvenioFaltaRegistrar | filtrarDecimal }}
                      </span>
                    </div>
                  </div>
                  <div class="pp-breakdown-item pp-breakdown-item--deuda">
                    <div class="pp-breakdown-item__icon">
                      <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div class="pp-breakdown-item__content">
                      <span class="pp-breakdown-item__label">Total Deuda Anterior pendiente de cerrar</span>
                      <span class="pp-breakdown-item__val">$ {{ totalDeudaAnteriorPendiente | filtrarDecimal }}</span>
                      <span class="pp-breakdown-item__sub">
                        Sin cerrar: {{ totalDeudaAnteriorSinCerrar | filtrarDecimal }} · Falta registrar: {{ totalDeudaAnteriorFaltaRegistrar | filtrarDecimal }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>



          <div class="vx-col w-full" v-if="tieneDatos && showTable">

            <table class="table-auto border-collapse border border-gray-300 w-full text-base rp-tabla">

              <thead>

                <tr class="bg-gray-100 text-center font-semibold text-gray-700">

                  <th class="border border-gray-300 px-4 py-2 text-lg">Cerrados</th>

                  <th class="border border-gray-300 px-4 py-2 text-lg">Sin cerrar</th>

                  <th class="border border-gray-300 px-4 py-2 text-lg">Falta registrar</th>

                  <th class="border border-gray-300 px-4 py-2 text-lg">Totales</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td class="border border-gray-300 px-4 py-2 align-top text-lg">

                    <div v-for="fila in filasReporte" :key="'c-' + fila.key" class="rp-fila">

                      <b class="text-lg">{{ fila.label }}:</b>

                      <p class="text-lg">{{ datosReport[fila.cerrado] | filtrarDecimal }}</p>

                    </div>

                  </td>



                  <td class="border border-gray-300 px-4 py-2 align-top text-lg">

                    <div v-for="fila in filasReporte" :key="'s-' + fila.key" class="rp-fila">

                      <b class="text-lg">{{ fila.label }}:</b>

                      <p class="text-lg">{{ datosReport[fila.sinCerrar] | filtrarDecimal }}</p>

                    </div>

                  </td>



                  <td class="border border-gray-300 px-4 py-2 align-top text-lg">

                    <div v-for="fila in filasReporte" :key="'f-' + fila.key" class="rp-fila">

                      <b class="text-lg">{{ fila.label }}:</b>

                      <p class="text-lg">{{ datosReport[fila.faltaRegistrar] | filtrarDecimal }}</p>

                    </div>

                  </td>



                  <td class="border border-gray-300 px-4 py-2 align-top font-semibold text-lg">

                    <div v-for="fila in filasReporte" :key="'t-' + fila.key" class="rp-fila">

                      <b class="text-lg">{{ fila.label }}:</b>

                      <p class="text-lg">{{ totalFila(fila) | filtrarDecimal }}</p>

                    </div>

                  </td>

                </tr>

              </tbody>

            </table>

            <div class="flex justify-center mt-4">

              <vs-button class="p-2" color="dark" @click="popupMostrarDetalles=true;">

                <i class="fa-solid fa-file-lines"></i> Detalles pagos

              </vs-button>

            </div>

          </div>

        </div>

      </div>

    </div>



    <vs-popup classContent="popup-example" fullscreen title="Detalle pagos" :active.sync="popupMostrarDetalles">

      <div v-if="popupMostrarDetalles">

        <ReportePagosDetalleVue :periodo_id="periodo_id"/>

      </div>

    </vs-popup>

  </div>

</template>



<script>

const ReportePagosDetalleVue = () => import('./ReportePagosDetalle.vue');



const FILAS_REPORTE = [

  {

    key: 'anticipos',

    label: 'Total Anticipos',

    cerrado: 'totalAnticipos',

    sinCerrar: 'totalAnticiposSinCerrar',

    faltaRegistrar: 'totalAnticiposFaltaRegistrar',

  },

  {

    key: 'liquidaciones',

    label: 'Total Liquidaciones',

    cerrado: 'totalLiquidaciones',

    sinCerrar: 'totalLiquidacionesSinCerrar',

    faltaRegistrar: 'totalLiquidacionesFaltaRegistrar',

  },

  {

    key: 'deuda',

    label: 'Total Deuda Anterior',

    cerrado: 'totalDeudaAnterior',

    sinCerrar: 'totalDeudaAnteriorSinCerrar',

    faltaRegistrar: 'totalDeudaAnteriorFaltaRegistrar',

  },

  {

    key: 'otros',

    label: 'Total Otros Valores',

    cerrado: 'totalOtrosValores',

    sinCerrar: 'totalOtrosValoresSinCerrar',

    faltaRegistrar: 'totalOtrosValoresFaltaRegistrar',

  },

  {

    key: 'convenio',

    label: 'Total Convenio',

    cerrado: 'totalConvenio',

    sinCerrar: 'totalConvenioSinCerrar',

    faltaRegistrar: 'totalConvenioFaltaRegistrar',

  },

  {

    key: 'anticipoPedido',

    label: 'Total Anticipo Pedido',

    cerrado: 'totalAnticipoAprobado',

    sinCerrar: 'totalAnticipoAprobadoSinCerrar',

    faltaRegistrar: 'totalAnticipoAprobadoFaltaRegistrar',

  },

];



const CAMPOS_INICIALES = FILAS_REPORTE.reduce((acc, fila) => {

  acc[fila.cerrado] = 0;

  acc[fila.sinCerrar] = 0;

  acc[fila.faltaRegistrar] = 0;

  return acc;

}, {});



export default {

  components: {

    ReportePagosDetalleVue

  },

  data() {

    return {

      datosReport: { ...CAMPOS_INICIALES },

      totalPagos: 0,
      totalDeudaAnteriorCerrada: 0,
      totalDeudaAnteriorPendienteResumen: 0,

      totalPagosSinCerrar: 0,

      totalPagosFaltaRegistrar: 0,

      totalPagosXPagarResumen: 0,

      totalConvenioXPagarResumen: 0,

      totalXPagarResumen: 0,

      popupMostrarDetalles: false,

      showTable: true,

      filasReporte: FILAS_REPORTE,

    }

  },

  computed: {

    totalGeneral() {

      return Math.round((this.totalPagos + this.totalDeudaAnteriorCerrada + this.totalSaldosPendientes) * 100) / 100;

    },

    filaDeudaAnterior() {

      return this.filasReporte.find((fila) => fila.key === 'deuda');

    },

    filasPagosTipo() {

      return this.filasReporte.filter((fila) => fila.key !== 'convenio' && fila.key !== 'deuda');

    },

    filaConvenio() {

      return this.filasReporte.find((fila) => fila.key === 'convenio');

    },

    totalPagosPendientesPorCerrar() {

      return this.totalPagosXPagarResumen;

    },

    totalConvenioPendientesPorCerrar() {

      return this.totalConvenioXPagarResumen;

    },

    totalPagosTipoSinCerrar() {

      return Math.round(this.filasPagosTipo.reduce((acc, fila) => {

        return acc + (parseFloat(this.datosReport[fila.sinCerrar]) || 0);

      }, 0) * 100) / 100;

    },

    totalPagosTipoFaltaRegistrar() {

      return Math.round(this.filasPagosTipo.reduce((acc, fila) => {

        return acc + (parseFloat(this.datosReport[fila.faltaRegistrar]) || 0);

      }, 0) * 100) / 100;

    },

    totalConvenioSinCerrar() {

      if (!this.filaConvenio) return 0;

      return parseFloat(this.datosReport[this.filaConvenio.sinCerrar]) || 0;

    },

    totalConvenioFaltaRegistrar() {

      if (!this.filaConvenio) return 0;

      return parseFloat(this.datosReport[this.filaConvenio.faltaRegistrar]) || 0;

    },

    totalDeudaAnteriorSinCerrar() {

      if (!this.filaDeudaAnterior) return 0;

      return parseFloat(this.datosReport[this.filaDeudaAnterior.sinCerrar]) || 0;

    },

    totalDeudaAnteriorFaltaRegistrar() {

      if (!this.filaDeudaAnterior) return 0;

      return parseFloat(this.datosReport[this.filaDeudaAnterior.faltaRegistrar]) || 0;

    },

    totalDeudaAnteriorPendiente() {

      if (this.totalDeudaAnteriorPendienteResumen > 0) {

        return this.totalDeudaAnteriorPendienteResumen;

      }

      return Math.round((this.totalDeudaAnteriorSinCerrar + this.totalDeudaAnteriorFaltaRegistrar) * 100) / 100;

    },

    totalSaldosPendientes() {

      return Math.round((this.totalPagosPendientesPorCerrar + this.totalConvenioPendientesPorCerrar + this.totalDeudaAnteriorPendiente) * 100) / 100;

    },

    tieneDatos() {

      return this.totalGeneral > 0;

    },

  },

  props: {

    periodo_id: {

      type: Number,

      default: 0

    },

  },

  methods: {

    totalFila(fila) {

      const cerrado = parseFloat(this.datosReport[fila.cerrado]) || 0;

      const sinCerrar = parseFloat(this.datosReport[fila.sinCerrar]) || 0;

      const faltaRegistrar = parseFloat(this.datosReport[fila.faltaRegistrar]) || 0;

      return Math.round((cerrado + sinCerrar + faltaRegistrar) * 100) / 100;

    },

    acumularTotales(datos) {

      let cerradosComision = 0;

      let cerradosDeuda = 0;

      let sinCerrar = 0;

      let faltaRegistrar = 0;



      this.filasReporte.forEach((fila) => {

        const cerrado = parseFloat(datos[fila.cerrado]) || 0;

        if (fila.key === 'deuda') {

          cerradosDeuda += cerrado;

        } else {

          cerradosComision += cerrado;

        }

        sinCerrar += parseFloat(datos[fila.sinCerrar]) || 0;

        faltaRegistrar += parseFloat(datos[fila.faltaRegistrar]) || 0;

      });



      this.totalPagos = Math.round(cerradosComision * 100) / 100;

      this.totalDeudaAnteriorCerrada = Math.round(cerradosDeuda * 100) / 100;

      this.totalPagosSinCerrar = Math.round(sinCerrar * 100) / 100;

      this.totalPagosFaltaRegistrar = Math.round(faltaRegistrar * 100) / 100;

    },

    f_deudaAnteriorPendienteCerrar(item) {

      if (item.deuda_anterior_pendiente_cerrar != null && item.deuda_anterior_pendiente_cerrar !== '') {

        return parseFloat(item.deuda_anterior_pendiente_cerrar) || 0;

      }

      const sinCerrar = parseFloat(item.totalDeudaAnteriorSinCerrar || 0) || 0;

      const faltaRegistrar = parseFloat(item.totalDeudaAnteriorFaltaRegistrar || 0) || 0;

      return Math.round((sinCerrar + faltaRegistrar) * 100) / 100;

    },

    f_pagosXPagarComision(item) {

      if (item.pagos_x_pagar_comision != null && item.pagos_x_pagar_comision !== '') {

        return parseFloat(item.pagos_x_pagar_comision) || 0;

      }

      const pagosXPagar = parseFloat(item.pagos_x_pagar || 0) || 0;

      return Math.max(0, Math.round((pagosXPagar - this.f_deudaAnteriorPendienteCerrar(item)) * 100) / 100);

    },

    f_convenioXPagar(item) {

      return parseFloat(item.convenio_x_pagar || 0) || 0;

    },

    getReporte() {

      const me = this;

      me.$vs.loading();

      this.$http.get(this.$server_url + `metodosGetVentas?GetReportePedidosPagos=1&periodo=${me.periodo_id}`)

        .then(function (res) {

          me.$vs.loading.close();

          if (res.data.status === 0 || !Array.isArray(res.data) || res.data.length === 0) {

            me.$vs.notify({

              text: 'No se encontraron datos',

              color: 'warning',

              iconPack: 'feather',

              icon: 'icon-check'

            });

            return;

          }



          const datos = { ...CAMPOS_INICIALES };

          let pagosXPagarComision = 0;

          let convenioXPagar = 0;

          let deudaAnteriorPendiente = 0;



          res.data.forEach((item) => {

            pagosXPagarComision += me.f_pagosXPagarComision(item);

            convenioXPagar += me.f_convenioXPagar(item);

            deudaAnteriorPendiente += me.f_deudaAnteriorPendienteCerrar(item);

            me.filasReporte.forEach((fila) => {

              datos[fila.cerrado] += parseFloat(item[fila.cerrado]) || 0;

              datos[fila.sinCerrar] += parseFloat(item[fila.sinCerrar]) || 0;

              datos[fila.faltaRegistrar] += parseFloat(item[fila.faltaRegistrar]) || 0;

            });

          });



          Object.keys(datos).forEach((key) => {

            datos[key] = Math.round(datos[key] * 100) / 100;

          });



          me.datosReport = datos;

          me.totalPagosXPagarResumen = Math.round(pagosXPagarComision * 100) / 100;

          me.totalConvenioXPagarResumen = Math.round(convenioXPagar * 100) / 100;

          me.totalDeudaAnteriorPendienteResumen = Math.round(deudaAnteriorPendiente * 100) / 100;

          me.totalXPagarResumen = Math.round((pagosXPagarComision + convenioXPagar + deudaAnteriorPendiente) * 100) / 100;

          me.acumularTotales(datos);



          if (!me.tieneDatos) {

            me.$vs.notify({

              text: 'No se encontraron datos de pagos',

              color: 'warning',

              iconPack: 'feather',

              icon: 'icon-check'

            });

          }

        })

        .catch(function (error) {

          me.$vs.loading.close();

          console.log(error + ' error');

          me.$vs.notify({

            text: 'Error al cargar datos',

            color: 'danger',

            iconPack: 'feather',

            icon: 'icon-alert-circle'

          });

        });

    }

  }

}

</script>



<style scoped>

.rp-total-general b {
  font-size: 1.15rem;
}

.rp-cards-layout {
  display: grid;
  grid-template-columns: 200px 200px 1fr;
  gap: 16px;
  align-items: stretch;
}

.rp-card-cerrados {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.rp-card-cerrados__label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.rp-card-cerrados__val {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 8px 0 0;
}

.rp-card-cerrados--deuda {
  border-color: #ddd6fe;
  background: linear-gradient(180deg, #faf5ff 0%, #ffffff 60%);
}

.rp-card-cerrados--deuda .rp-card-cerrados__val {
  color: #6d28d9;
}

.rp-card-derecha {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.pp-dashboard-hero__breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pp-breakdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
}

.pp-breakdown-item__icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.pp-breakdown-item--pagos .pp-breakdown-item__icon {
  color: #0284c7;
  background: #e0f2fe;
}

.pp-breakdown-item--convenio .pp-breakdown-item__icon {
  color: #059669;
  background: #d1fae5;
}

.pp-breakdown-item--deuda .pp-breakdown-item__icon {
  color: #7c3aed;
  background: #ede9fe;
}

.pp-breakdown-item__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pp-breakdown-item__label {
  font-size: 11px;
  color: #64748b;
  line-height: 1.3;
}

.pp-breakdown-item__val {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.pp-breakdown-item__sub {
  font-size: 10px;
  color: #94a3b8;
}

.kpi-pending-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  background: #fafafa;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 12px 14px;
}

.kpi-pending-row__left {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.kpi-pending-row__ico {
  color: #9ca3af;
  font-size: 14px;
  margin-top: 2px;
  flex-shrink: 0;
}

.kpi-pending-row__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  cursor: help;
}

.kpi-card__info-ico {
  font-size: 9px;
  color: #9ca3af;
  margin-left: 2px;
}

.kpi-pending-row__hint {
  font-size: 9px;
  color: #9ca3af;
  margin: 2px 0 0;
  font-style: italic;
}

.kpi-pending-row__val {
  font-size: clamp(1.25rem, 1.6vw, 1.75rem);
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.01em;
  text-align: right;
  flex-shrink: 0;
  white-space: nowrap;
}

.kpi-pending-row__val--alert {
  color: #111827;
}

@media (max-width: 900px) {
  .rp-cards-layout {
    grid-template-columns: 1fr;
  }
}

.rp-fila {

  margin-bottom: 10px;

}

.rp-fila:last-child {

  margin-bottom: 0;

}

.rp-tabla td p {

  margin: 0 0 4px;

}

</style>


