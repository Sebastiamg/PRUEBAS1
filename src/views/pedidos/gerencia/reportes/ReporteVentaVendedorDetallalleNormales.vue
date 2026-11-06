<template>
  <div>
    <b>Período:</b>
    <span class="text-lg font-semibold text-gray-700"> {{ periodoSelectAnterior.periodoescolar || 'No seleccionado' }}</span>

    <div class="vx-card p-6">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Detalle de codigos normales por Vendedor con contratos</h2>
      </div>

      <!-- Cards de estadísticas principales para gerencia -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;" v-if="arrayDatosGeneral.length > 0">
        <!-- Total Regalados -->
        <div style="width: 24%; margin-right: 1%;">
          <div class="vx-card" style="background: linear-gradient(135deg, #e8f4fd 0%, #d1e7dd 100%); border: 1px solid #b6d7ff;">
            <div class="vx-card__body" style="padding: 20px; text-align: center;">
              <div style="color: #495057;">
                <h4 style="color: #6c757d; font-size: 12px; margin-bottom: 8px;">Códigos normales</h4>
                <h2 style="color: #212529; font-weight: bold; font-size: 24px; margin-bottom: 5px;">{{ formatNumber(arrayDatosGeneral[0].codigos_totales_regalados) }}</h2>
                <small style="color: #6c757d; font-size: 10px;">Total general</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Con Contratos -->
        <div style="width: 24%; margin-right: 1%;">
          <div class="vx-card" style="background: linear-gradient(135deg, #d1edcc 0%, #a3d977 100%); border: 1px solid #b8d4a8;">
            <div class="vx-card__body" style="padding: 20px; text-align: center;">
              <div style="color: #495057;">
                <h4 style="color: #2d5016; font-size: 12px; margin-bottom: 8px;">Con Contratos</h4>
                <h2 style="color: #1a2e05; font-weight: bold; font-size: 24px; margin-bottom: 5px;">{{ formatNumber(arrayDatosGeneral[0].codigos_con_contrato) }}</h2>
                <small style="color: #2d5016; font-size: 10px;">{{ calcularPorcentaje(arrayDatosGeneral[0].codigos_con_contrato, arrayDatosGeneral[0].codigos_totales_regalados) }}%</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin Contratos -->
        <div style="width: 24%; margin-right: 1%;">
          <div class="vx-card" style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 1px solid #f0d43a;">
            <div class="vx-card__body" style="padding: 20px; text-align: center;">
              <div style="color: #495057;">
                <h4 style="color: #856404; font-size: 12px; margin-bottom: 8px;">Sin Contratos</h4>
                <h2 style="color: #533f03; font-weight: bold; font-size: 24px; margin-bottom: 5px;">{{ formatNumber(arrayDatosGeneral[0].codigos_sin_contrato) }}</h2>
                <small style="color: #856404; font-size: 10px;">{{ calcularPorcentaje(arrayDatosGeneral[0].codigos_sin_contrato, arrayDatosGeneral[0].codigos_totales_regalados) }}%</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Quitados del Reporte -->
        <div style="width: 24%;">
          <div class="vx-card" style="background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%); border: 1px solid #e2a0a5;">
            <div class="vx-card__body" style="padding: 20px; text-align: center;">
              <div style="color: #495057;">
                <h4 style="color: #721c24; font-size: 12px; margin-bottom: 8px;">Quitados Reporte</h4>
                <h2 style="color: #491217; font-weight: bold; font-size: 24px; margin-bottom: 5px;">{{ formatNumber(arrayDatosGeneral[0].codigos_quitados_reporte) }}</h2>
                <small style="color: #721c24; font-size: 10px;">{{ calcularPorcentaje(arrayDatosGeneral[0].codigos_quitados_reporte, arrayDatosGeneral[0].codigos_totales_regalados) }}%</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards pequeños para documentos (hijos) -->
      <div style="display: flex; justify-content: center; margin-bottom: 20px; gap: 20px;" v-if="arrayDatosGeneral.length > 0">
        <!-- Con Documentos -->
        <div style="width: 200px;">
          <div class="vx-card" style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); border: 1px solid #a5d6a7;">
            <div class="vx-card__body" style="padding: 15px; text-align: center;">
              <div style="color: #495057;">
                <h5 style="color: #2e7d32; font-size: 11px; margin-bottom: 5px;">Con Documentos</h5>
                <h3 style="color: #1b5e20; font-weight: bold; font-size: 18px; margin-bottom: 3px;">{{ formatNumber(arrayDatosGeneral[0].codigos_con_documentos) }}</h3>
                <small style="color: #2e7d32; font-size: 9px;">De los con contrato</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin Documentos -->
        <div style="width: 200px;">
          <div class="vx-card" style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); border: 1px solid #ffcc02;">
            <div class="vx-card__body" style="padding: 15px; text-align: center;">
              <div style="color: #495057;">
                <h5 style="color: #f57f17; font-size: 11px; margin-bottom: 5px;">Sin Documentos</h5>
                <h3 style="color: #e65100; font-weight: bold; font-size: 18px; margin-bottom: 3px;">{{ formatNumber(arrayDatosGeneral[0].codigos_sin_documentos) }}</h3>
                <small style="color: #f57f17; font-size: 9px;">De los con contrato</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Menú de opciones (después de los cards) -->
      <div class="text-center mb-4" v-if="arrayDatosGeneral.length > 0">
        <vs-button
          :color="tipoSeleccionado === 'sin_documentos' ? 'primary' : 'dark'"
          :type="tipoSeleccionado === 'sin_documentos' ? 'filled' : 'flat'"
          @click="cambiarTipo('sin_documentos')"
          size="small"
          class="mr-2"
        >
          Sin Documentos
        </vs-button>

        <vs-button
          :color="tipoSeleccionado === 'con_documentos' ? 'primary' : 'dark'"
          :type="tipoSeleccionado === 'con_documentos' ? 'filled' : 'flat'"
          @click="cambiarTipo('con_documentos')"
          size="small"
          class="mr-2"
        >
          Con Documentos
        </vs-button>

        <vs-button
          :color="tipoSeleccionado === 'sin_contratos' ? 'primary' : 'dark'"
          :type="tipoSeleccionado === 'sin_contratos' ? 'filled' : 'flat'"
          @click="cambiarTipo('sin_contratos')"
          size="small"
          class="mr-2"
        >
          Sin Contratos
        </vs-button>

        <vs-button
          :color="tipoSeleccionado === 'excluidos' ? 'primary' : 'dark'"
          :type="tipoSeleccionado === 'excluidos' ? 'filled' : 'flat'"
          @click="cambiarTipo('excluidos')"
          size="small"
        >
          Excluidos
        </vs-button>
      </div>

    </div>
    <vs-divider>{{ tipoSeleccionado }}</vs-divider>

    <!-- Tabla de datos -->
    <div class="con-tab-ejemplo">
      <div v-if="arrayReporte.length > 0">
        <!--boton para exportar-->
        <vs-button @click="exportarReporte" size="small" class="mb-4">
          Exportar Reporte
        </vs-button>
        <vs-table max-items="15" search pagination :data="arrayReporte">
          <template slot="header">
            <!-- Estadísticas principales -->
            <div class="mb-4" v-if="arrayReporte.length > 0">
              <vs-chip color="primary">
                Cantidad registros: <b>{{ arrayReporte.length }}</b>
              </vs-chip>
              <vs-chip color="primary" class="ml-2">
                Cantidad códigos: <b>{{ totalCantidadCodigos }}</b>
              </vs-chip>
              <vs-chip color="success" class="ml-2">
                Total Monto: <b>${{ totalMonto }}</b>
              </vs-chip>
            </div>
          </template>
          <template slot="thead">
            <vs-th width="400" sort-key="institucion">Institución</vs-th>
            <vs-th width="150" sort-key="cantidad_codigos">Cantidad Códigos</vs-th>
            <vs-th width="150" sort-key="total_monto">Total Monto</vs-th>
            <vs-th width="150">Acciones</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <div class="text-sm">
                  # {{ tr.id_institucion }} <br>
                  <strong>{{ tr.institucion  || 'Sin institución' }}</strong>
                  <br>
                  <b>Tipo venta:</b>
                  <p v-if="tr.venta_estado == 2">Venta lista</p>
                  <p v-else>Venta directa</p>
                </div>
              </vs-td>

              <vs-td>
                <vs-chip color="primary" transparent>
                  {{ tr.cantidad_codigos }}
                </vs-chip>
              </vs-td>

              <vs-td>
                <vs-chip color="success" transparent>
                  <strong>${{ tr.total_monto }}</strong>
                </vs-chip>
              </vs-td>
              <vs-td>
                <!--boton para mostrar codigos-->
                <vs-button size="small" color="#007bff" type="border" @click="ObjectSelected=tr; f_mostrarCodigosXInstitucion();">
                  Ver libros
                </vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <div v-else class="p-6 text-center">
        <div v-if="!cargando" class="text-gray-500">
          <i class="feather-inbox text-4xl mb-4"></i>
          <p class="text-lg">No hay datos disponibles</p>
        </div>
        <div v-else class="text-gray-500">
          <vs-loading type="circles" color="primary"></vs-loading>
          <p class="mt-4">Cargando datos...</p>
        </div>
      </div>
    </div>
    <!-- Popup para mostrar códigos -->
    <vs-popup classContent="popup-example" fullscreen class="informacionformHijo" title="Mostrar detalle" :active.sync="popupMostrarCodigos">
       <div v-if="popupMostrarCodigos">
        <b>Institución:</b>
        <span class="text-lg font-semibold text-gray-700"> {{ ObjectSelected.institucion || 'No seleccionado' }}</span>
        <!-- Suma total de cantidades -->
        <div class="mb-4 p-3 bg-gray-100 rounded">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-700">Total Cantidad de Códigos:</span>
            <vs-chip color="primary" class="ml-2">
              <strong>{{ totalCantidadDetalle }}</strong>
            </vs-chip>
          </div>
        </div>

         <TableReutilizableVue
          :title="''"
          :headers="['Código','Libro','Factura','Cantidad']"
          :fieldKeys="['codigo_liquidacion','nombrelibro','factura','cantidad']"
          :ifexportar="Number(1)"
          :tableData="arrayDetalleLibrosRegalados"
          :nombrearchivo="'Detalle_Regalados_' + ObjectSelected.institucion + '_' + periodoSelectAnterior.periodoescolar.replace(/ /g, '_')"
        />
        <br>
        <!-- Tabla de Códigos Individuales -->
        <div v-if="arrayCodigosIndividuales.length > 0" class="mt-6">
          <h3 class="text-lg font-semibold mb-4">Códigos Individuales</h3>
          <TableReutilizableVue
            :title="''"
            :headers="['Código','Código Liquidación','Libro','Documento de venta','Empresa documento','Factura']"
            :fieldKeys="['codigo','codigo_liquidacion','nombrelibro','codigo_proforma','empresa_documento','factura']"
            :ifexportar="Number(1)"
            :tableData="arrayCodigosIndividuales"
            :nombrearchivo="'Codigos_Individuales_' + ObjectSelected.institucion + '_' + periodoSelectAnterior.periodoescolar.replace(/ /g, '_')"
          />
       </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
  mixins: [Generalmix,Codigosmix],
  name: 'ReporteVentaVendedorDetallalleRegalados',
  components: {
    TableReutilizableVue
  },
  data() {
    return {
      arrayDatosGeneral: [],
      arrayRegaladosSinDocumentos: [],
      arrayReporte: [],
      tipoSeleccionado: 'sin_documentos', // 'sin_documentos' o 'excluidos'
      cargando: false,
      ObjectSelected: {},
      popupMostrarCodigos: false,
      arrayDetalleLibrosRegalados:[],
      arrayCodigosIndividuales: []
    }
  },

  props: {
    periodoSelectAnterior: {
      type: Object,
      required: true
    }
  },

  computed: {
    totalMonto() {
      return this.arrayReporte.reduce((total, item) => {
        return total + parseFloat(item.total_monto || 0);
      }, 0).toFixed(2);
    },
    totalCantidadCodigos() {
      // El total sigue igual, pero el arrayReporte se ordena en los métodos de carga
      return this.arrayReporte.reduce((total, item) => {
        return total + parseInt(item.cantidad_codigos || 0);
      }, 0);
    },
    totalCantidadDetalle() {
      return this.arrayDetalleLibrosRegalados.reduce((total, item) => {
        return total + parseInt(item.cantidad || 0);
      }, 0);
    }
  },

  watch: {
    periodoSelectAnterior: {
      async handler(newVal) {
        if (newVal && newVal.idperiodoescolar) {
          await this.f_general();        // primero header
          await this.cargarDatosSegunTipo(); // luego tabla
        }
      },
      immediate: true
    }
  },


  methods: {
    f_mostrarCodigosXInstitucion(){
      let me = this
      me.arrayDetalleLibrosRegalados = []
      var url = ''
      console.log("objeto seleccionado",me.ObjectSelected)
      let SinInstitucion = 0
      if(me.ObjectSelected.id_institucion == '' || !me.ObjectSelected.id_institucion){
        SinInstitucion = 1
      }
      console.log("objeto seleccionado",me.ObjectSelected)
      if(me.tipoSeleccionado == 'sin_documentos'){
        url = `metodosGetVerificaciones?getReporteCodigosPorLibroInstitucion=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&documentos=0&quitar_reporte=0&venta_estado=${me.ObjectSelected.venta_estado}&normales=1&contratos=0&sin_institucion=${SinInstitucion}`
      }
      else if(me.tipoSeleccionado == 'con_documentos'){
        url = `metodosGetVerificaciones?getReporteCodigosPorLibroInstitucion=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&documentos=1&quitar_reporte=0&venta_estado=${me.ObjectSelected.venta_estado}&normales=1&contratos=0&sin_institucion=${SinInstitucion}`
      }
      else if(me.tipoSeleccionado == 'sin_contratos'){
        url = `metodosGetVerificaciones?getReporteCodigosPorLibroSinContratos=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&venta_estado=${me.ObjectSelected.venta_estado}&normales=1&sin_institucion=${SinInstitucion}`
      }
      else if(me.tipoSeleccionado == 'excluidos'){
        url = `metodosGetVerificaciones?getReporteCodigosPorLibroInstitucion=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&documentos=2&quitar_reporte=1&venta_estado=${me.ObjectSelected.venta_estado}&normales=1&contratos=1&sin_institucion=${SinInstitucion}`
      }
      me.$vs.loading();
      this.$http.get(this.$server_url + url)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayDetalleLibrosRegalados = res.data;
          me.popupMostrarCodigos = true;
          me.f_mostrarCodigosIndividuales();
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error',
            text: 'No se pudieron cargar los códigos detallados',
            color: 'danger'
          });
        });
    },
    f_mostrarCodigosIndividuales(){
      let me = this
      me.arrayCodigosIndividuales = []
      let SinInstitucion = 0
      if(me.ObjectSelected.id_institucion == '' || !me.ObjectSelected.id_institucion){
        SinInstitucion = 1
      }
      var url = ''
      if(me.tipoSeleccionado == 'sin_documentos'){
        url = `metodosGetVerificaciones?getCodigosIndividualesReporte=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&venta_estado=${me.ObjectSelected.venta_estado}&documentos=0&quitar_reporte=0&contratos=0&normales=1&sin_institucion=${SinInstitucion}`
      }
      else if(me.tipoSeleccionado == 'con_documentos'){
        url = `metodosGetVerificaciones?getCodigosIndividualesReporte=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&venta_estado=${me.ObjectSelected.venta_estado}&documentos=1&quitar_reporte=0&contratos=0&normales=1&sin_institucion=${SinInstitucion}`
      }
      else if(me.tipoSeleccionado == 'sin_contratos'){
        url = `metodosGetVerificaciones?getCodigosIndividualesReporte=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&venta_estado=${me.ObjectSelected.venta_estado}&documentos=2&quitar_reporte=0&contratos=0&normales=1&sin_institucion=${SinInstitucion}`
      }
      else if(me.tipoSeleccionado == 'excluidos'){
        url = `metodosGetVerificaciones?getCodigosIndividualesReporte=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&institucion=${me.ObjectSelected.id_institucion}&venta_estado=${me.ObjectSelected.venta_estado}&documentos=2&quitar_reporte=1&contratos=1&normales=1&sin_institucion=${SinInstitucion}`
      }
      else{return}
      me.$vs.loading();
      this.$http.get(this.$server_url + url)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayCodigosIndividuales = res.data;
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error',
            text: 'No se pudieron cargar los códigos detallados',
            color: 'danger'
          });
        });
    },
    formatNumber(num) {
      return new Intl.NumberFormat('es-ES').format(num);
    },

    calcularPorcentaje(valor, total) {
      if (!total || total === 0) return 0;
      return ((parseInt(valor) / parseInt(total)) * 100).toFixed(1);
    },

     async f_general() {
      let me = this;
      let url = `metodosGetVerificaciones?getReporteCodigosGeneral=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&normales=1`;

      try {
        me.$vs.loading();
        const res = await this.$http.get(this.$server_url + url);
        me.arrayDatosGeneral = res.data;
      } catch (error) {
        console.error(error + ' error');
      } finally {
        me.$vs.loading.close();
      }
    },
    cambiarTipo(tipo) {
      this.tipoSeleccionado = tipo;
      this.cargarDatosSegunTipo();
    },

     async cargarDatosSegunTipo() {
      if (this.tipoSeleccionado === 'sin_documentos') {
        await this.f_getTraerRegaladosSinDocumentos();
      }
      else if (this.tipoSeleccionado === 'con_documentos') {
        await this.f_getTraerRegaladosConDocumentos();
      }
      else if (this.tipoSeleccionado === 'sin_contratos') {
        await this.f_getTraerRegaladosSinContrato();
      } else {
        await this.f_getTraerRegaladosQuitadosReporte();
      }
    },

    async f_getTraerRegaladosSinDocumentos() {
      let me = this;
      me.arrayReporte = [];
      me.cargando = true;
      me.$vs.loading();

      const url = `metodosGetVerificaciones?getReporteCodigosSinDocumentos=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&normales=1&contratos=0&documento=0`;

      try {
        const res = await this.$http.get(this.$server_url + url);
        // Agrupar según la regla: 0/1 → 1 (directa), 2 → 2 (lista)
        const agrupados = res.data.reduce((acc, item) => {
          const tipoVenta = item.venta_estado == "2" ? 2 : 1; // normalizar
          const key = `${item.id_institucion}_${tipoVenta}`;

          if (!acc[key]) {
            acc[key] = {
              id_institucion: item.id_institucion,
              institucion: item.institucion,
              venta_estado: tipoVenta,
              cantidad_codigos: 0,
              total_monto: 0
            };
          }

          acc[key].cantidad_codigos += parseInt(item.cantidad_codigos || 0);
          acc[key].total_monto += parseFloat(item.total_monto || 0);

          return acc;
        }, {});

        // total monto a 2 decimales y mutiplicar x 1 para evitar -0
        for (const key in agrupados) {
          agrupados[key].total_monto = (agrupados[key].total_monto).toFixed(2) * 1;
        }

        me.arrayReporte = Object.values(agrupados)

        me.$vs.notify({
          title: 'Éxito',
          text: `Se cargaron ${me.arrayReporte.length} instituciones con regalados sin documentos`,
          color: 'success'
        });
      } catch (error) {
        console.error(error + ' error');
        me.$vs.notify({
          title: 'Error',
          text: 'No se pudieron cargar los regalados sin documentos',
          color: 'danger'
        });
      } finally {
        me.$vs.loading.close();
        me.cargando = false;
      }
    },

      async f_getTraerRegaladosConDocumentos() {
      let me = this;
      me.arrayReporte = [];
      me.cargando = true;
      me.$vs.loading();

      const url = `metodosGetVerificaciones?getReporteCodigosSinDocumentos=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&normales=1&contratos=0&documento=1`;

      try {
        const res = await this.$http.get(this.$server_url + url);
        // Agrupar según la regla: 0/1 → 1 (directa), 2 → 2 (lista)
        const agrupados = res.data.reduce((acc, item) => {
          const tipoVenta = item.venta_estado == "2" ? 2 : 1; // normalizar
          const key = `${item.id_institucion}_${tipoVenta}`;

          if (!acc[key]) {
            acc[key] = {
              id_institucion: item.id_institucion,
              institucion: item.institucion,
              venta_estado: tipoVenta,
              cantidad_codigos: 0,
              total_monto: 0
            };
          }

          acc[key].cantidad_codigos += parseInt(item.cantidad_codigos || 0);
          acc[key].total_monto += parseFloat(item.total_monto || 0);

          return acc;
        }, {});

        // total monto a 2 decimales y mutiplicar x 1 para evitar -0
        for (const key in agrupados) {
          agrupados[key].total_monto = (agrupados[key].total_monto).toFixed(2) * 1;
        }

        me.arrayReporte = Object.values(agrupados)

        me.$vs.notify({
          title: 'Éxito',
          text: `Se cargaron ${me.arrayReporte.length} instituciones con regalados sin documentos`,
          color: 'success'
        });
      } catch (error) {
        console.error(error + ' error');
        me.$vs.notify({
          title: 'Error',
          text: 'No se pudieron cargar los regalados sin documentos',
          color: 'danger'
        });
      } finally {
        me.$vs.loading.close();
        me.cargando = false;
      }
    },

    async f_getTraerRegaladosQuitadosReporte() {
      let me = this;
      me.arrayReporte = [];
      me.cargando = true;
      me.$vs.loading();

      const url = `metodosGetVerificaciones?getReporteCodigosQuitadosDelReporte=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&normales=1`;

      try {
        const res = await this.$http.get(this.$server_url + url);
        // Agrupar según la regla: 0/1 → 1 (directa), 2 → 2 (lista)
        const agrupados = res.data.reduce((acc, item) => {
          const tipoVenta = item.venta_estado == "2" ? 2 : 1; // normalizar
          const key = `${item.id_institucion}_${tipoVenta}`;

          if (!acc[key]) {
            acc[key] = {
              id_institucion: item.id_institucion,
              institucion: item.institucion,
              venta_estado: tipoVenta,
              cantidad_codigos: 0,
              total_monto: 0
            };
          }

          acc[key].cantidad_codigos += parseInt(item.cantidad_codigos || 0);
          acc[key].total_monto += parseFloat(item.total_monto || 0);

          return acc;
        }, {});

        // total monto a 2 decimales y mutiplicar x 1 para evitar -0
        for (const key in agrupados) {
          agrupados[key].total_monto = (agrupados[key].total_monto).toFixed(2) * 1;
        }

        me.arrayReporte = Object.values(agrupados)

        me.$vs.notify({
          title: 'Éxito',
          text: `Se cargaron ${me.arrayReporte.length} instituciones con regalados excluidos`,
          color: 'success'
        });
      } catch (error) {
        console.error(error + ' error');
        me.$vs.notify({
          title: 'Error',
          text: 'No se pudieron cargar los regalados excluidos',
          color: 'danger'
        });
      } finally {
        me.$vs.loading.close();
        me.cargando = false;
      }
    },

   async f_getTraerRegaladosSinContrato() {
      let me = this;
      me.arrayReporte = [];
      me.cargando = true;
      me.$vs.loading();

      const url = `metodosGetVerificaciones?getReporteCodigosSinContratos=1&id_periodo=${me.periodoSelectAnterior.idperiodoescolar}&normales=1`;

      try {
        const res = await this.$http.get(this.$server_url + url);

        // Agrupar según la regla: 0/1 → 1 (directa), 2 → 2 (lista)
        const agrupados = res.data.reduce((acc, item) => {
          const tipoVenta = item.venta_estado == "2" ? 2 : 1; // normalizar
          const key = `${item.id_institucion}_${tipoVenta}`;

          if (!acc[key]) {
            acc[key] = {
              id_institucion: item.id_institucion,
              institucion: item.institucion,
              venta_estado: tipoVenta,
              cantidad_codigos: 0,
              total_monto: 0
            };
          }

          acc[key].cantidad_codigos += parseInt(item.cantidad_codigos || 0);
          acc[key].total_monto += parseFloat(item.total_monto || 0);

          return acc;
        }, {});

        // total monto a 2 decimales y mutiplicar x 1 para evitar -0
        for (const key in agrupados) {
          agrupados[key].total_monto = (agrupados[key].total_monto).toFixed(2) * 1;
        }

        me.arrayReporte = Object.values(agrupados)

        me.$vs.notify({
          title: 'Éxito',
          text: `Se cargaron ${me.arrayReporte.length} instituciones con códigos normales`,
          color: 'success'
        });
      } catch (error) {
        console.error(error + ' error');
        me.$vs.notify({
          title: 'Error',
          text: 'No se pudieron cargar los códigos normales',
          color: 'danger'
        });
      } finally {
        me.$vs.loading.close();
        me.cargando = false;
      }
    },

    exportarReporte() {
      let me = this;
      // Definir los headers y campos a exportar
      const headers = ['Institución', 'Tipo Venta', 'Cantidad Códigos', 'Total Monto'];
      const fieldKeys = ['institucion', 'venta_estado', 'cantidad_codigos', 'total_monto'];
      // Mapear tipo de venta a texto
      const datosExportar = me.arrayReporte.map(item => ({
        ...item,
        venta_estado: item.venta_estado == 2 ? 'Venta lista' : 'Venta directa'
      }));
      // Nombre del archivo
      const nombreArchivo = `Reporte_Venta_Vendedor_Normales_${me.periodoSelectAnterior.periodoescolar.replace(/ /g, '_')}`;
      me.m_exportTodo(headers, fieldKeys, datosExportar, nombreArchivo);
    },

  }
}
</script>
<style scoped>
.informacionformHijo {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
