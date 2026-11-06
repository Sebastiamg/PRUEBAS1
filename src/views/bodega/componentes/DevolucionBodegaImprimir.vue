<template>
  <div>
    <div>
      <div class="flex justify-center" v-if="ObjectedSelected">
        <vs-button class="mr-5" @click="m_imprimirTodos('12px', 'Combos desarmados - ' + ObjectedSelected.codigo_devolucion ,'0px','')">Imprimir</vs-button>
        <vs-button color="success" v-if="ObjectedSelected.estado == 1" @click="popupConfirm=true;">Finalizar</vs-button>
      </div>
      <br><br>
      <div id="seccionImprimir2">
        <p style="text-align: center; font-weight: bold; margin-bottom: 10px;">{{nombreEmpresaActual}}</p>
        <h1 style="font-weight: bold;text-align: center;">Combos Desarmados</h1>
        <p style="text-align: center;font-weight: 400;margin-top: 10px;">{{ ObjectedSelected ? ObjectedSelected.codigo_devolucion : '' }}</p>
        <br>
        <table style="width: 100%; border-collapse: collapse; border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: left; padding-left: 0px;">
                  <p class="letra" style="font-size: 11px; margin: 0;">
                      <b>Fecha:</b>
                  </p>
              </td>
              <td style="border: none; text-align: left; padding-left: 0px;">
                  <p class="letra" style="font-size: 11px; margin: 0;">
                      {{ fecha_actual }}
                  </p>
              </td>
            </tr>
             <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Institución de devolución:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ nombreInstitucion }}
                    </p>
                </td>
            </tr>
            <tr style="border: none;">
              <td style="border: none; text-align: left; padding-left: 0px;">
                  <p class="letra" style="font-size: 11px; margin: 0;">
                      <b>Periodo devolución:</b>
                  </p>
              </td>
              <td style="border: none; text-align: left; padding-left: 0px;">
                  <p class="letra" style="font-size: 11px; margin: 0;">
                      {{ nombrePeriodo }}
                  </p>
              </td>
            </tr>
            <!--usuario impresion-->
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Usuario Impresión:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <span v-if="usuario">{{ usuarioCreador }}</span>
                        <span v-else style="color: red;">Usuario no disponible</span>
                    </p>
                </td>
            </tr>
        </table>
        <p class="mt-5"><b>Total códigos (Normales + Regalados): </b> {{ arrayCodigosNormales.reduce((acc, el) => acc + Number(el.cantidad), 0) + arrayCodigosRegalados.reduce((acc, el) => acc + Number(el.cantidad), 0) }}</p>
       <!--Codigos Normales-->
        <TableReutilizablePrintVue
          v-if="arrayCodigosNormales.length > 0"
          :title="'Códigos Normales'"
          :headers="tienePrecioEspecial ? ['Combo','Código','Libro','Cantidad','Descuento %','Precio','Precio Especial','Subtotal','Total','Empresa'] : ['Código','Libro','Cantidad','Descuento %','Precio','Subtotal','Total','Empresa']"
          :fieldKeys="tienePrecioEspecial ? ['combo_nombre','codigo_liquidacion','nombrelibro','cantidad','descuento','precio','precio_especial','subtotal_especial','total_especial','nombre_empresa'] : ['codigo_liquidacion','nombrelibro','cantidad','descuento','precio','subtotal','total','nombre_empresa']"
          :tableData="arrayCodigosNormales"
        />

        <br><br><br>

        <!--Codigos Regalados-->
        <TableReutilizablePrintVue
          v-if="arrayCodigosRegalados.length > 0"
          :title="'Códigos Regalados'"
          :headers="tienePrecioEspecial ? ['Combo','Código','Libro','Cantidad','Descuento %','Precio','Precio Especial','Subtotal','Total','Empresa'] : ['Código','Libro','Cantidad','Descuento %','Precio','Subtotal','Total','Empresa']"
          :fieldKeys="tienePrecioEspecial ? ['combo_nombre','codigo_liquidacion','nombrelibro','cantidad','descuento','precio','precio_especial','subtotal_especial','total_especial','nombre_empresa'] : ['codigo_liquidacion','nombrelibro','cantidad','descuento','precio','subtotal','total','nombre_empresa']"
          :tableData="arrayCodigosRegalados"
        />


        <br><br>
        <p><b>Observación:</b> {{ observacion }}</p>
      </div>
    </div>
       <!--modales-->
    <vs-popup title="Códigos" class="informacionformHijo" :active.sync="popupConfirm">
      <div>
        <p>¿Está seguro de finalizar el documento?</p>
        <div class="flex justify-center mt-4">
          <vs-button color="primary" class="mr-3" @click="f_finalizarDocumento">Sí, deseo finalizar</vs-button>
          <vs-button color="danger" @click="popupConfirm = false">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import Generalmix from "../../../mixins/Generalmix";
import imprimirMixin from "@/mixins/Pedidosmix";
const TableReutilizablePrintVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizablePrint.vue')
import moment from 'moment';
export default{
  mixins: [imprimirMixin, Generalmix],
  components: {
    TableReutilizablePrintVue
  },
  data(){
    let usuarioLocal = localStorage.getItem('usuario');
    return{
      arrayCodigosEncontrados:[],
      arrayCodigosNormales:[],
      arrayCodigosRegalados:[],
      fecha_actual: moment().format('DD/MM/YYYY'),
      usuario: usuarioLocal ? JSON.parse(usuarioLocal) : null,
      nombrePeriodo: '',
      nombreInstitucion: '',
      observacion: '',
      usuarioCreador: '',
      popupConfirm: false,
      ObjectedSelected: null,
      nombreEmpresaActual: '',
      tienePrecioEspecial: false,

    }
  },
  props: {
    id_devolucion: {
      type: Number,
      required: true,
      default: 0
    },
  },

  async mounted(){
    await this.empresaActual()
    await this.f_getDatosCodigos();
  },
  methods:{
      async empresaActual() {
        await this.$http.get(this.$server_url + 'empresaActual')
        .then(res => {
            this.nombreEmpresaActual = res.data[0].descripcion_corta;
        })
        .catch(err => {
            console.log(err);
        });
      },
    async f_getDatosCodigos(){
      let me = this;
      me.$vs.loading();
      try {
        const response = await me.$http.get(me.$server_url+'devoluciones', {
          params: {
            'getDevolucionesCombosDesarmadosXId': 1,
            'id_devolucion': me.id_devolucion
          }
        });
        if (!response.data || response.data.length === 0) {
          me.$vs.loading.close();
          // Usar el método reutilizable de Generalmix para mostrar mensaje
          me.m_message('No existen datos de devolución.', 'warning');
          me.arrayCodigosEncontrados = [];
          me.nombrePeriodo = '';
          me.nombreInstitucion = '';
          me.observacion = '';
          me.usuarioCreador = '';
          return;
        }
        me.ObjectedSelected         = response.data;
        me.arrayCodigosEncontrados  = response.data.codigos;
        me.nombrePeriodo            = response.data.periodoescolar || '';
        me.nombreInstitucion        = response.data.nombreInstitucion || '';
        me.observacion              = response.data.observacion || '';
        me.usuarioCreador           = response.data.usuarioCreador || '';
        me.f_formatoCodigos();
        me.$vs.loading.close();
      } catch (error) {
        me.$vs.loading.close();
        console.error('Error al obtener los datos de códigos:', error);
      }
    },

    f_formatoCodigos() {
      // Verificar si existe algún precio especial
      this.tienePrecioEspecial = this.arrayCodigosEncontrados.some(item =>
        item.precio_especial && item.precio_especial !== item.precio
      );

      // Agrupar por codigo_liquidacion, nombrelibro, descuento y nombre_empresa
      const agrupados = {};

      this.arrayCodigosEncontrados.forEach(item => {
        // const key = `${item.codigo_liquidacion}|${item.nombrelibro}|${item.descuento}|${item.nombre_empresa}`;
        const comboKey = item.combo_nombre ? item.combo_nombre : 'SIN COMBO';
        const key = `${item.codigo_liquidacion}|${item.nombrelibro}|${item.descuento}|${item.nombre_empresa}|${comboKey}`;
        if (!agrupados[key]) {
          agrupados[key] = {
            codigo_liquidacion: item.codigo_liquidacion,
            nombrelibro: item.nombrelibro,
            precio: item.precio,
            precio_especial: item.precio_especial,
            descuento: item.descuento,
            nombre_empresa: item.nombre_empresa,
            normales: 0,
            regalados: 0,
            combo_nombre: comboKey
          };
        }

        if (String(item.estado_liquidacion) == '1' || item.estado_liquidacion == '0') {
          agrupados[key].normales++;
        } else if (String(item.estado_liquidacion) === '2') {
          agrupados[key].regalados++;
        }
      });

      // Función para calcular total con descuento
      const calcularTotal = (precio, cantidad, descuento) => {
        const subtotal = Number(precio || 0) * cantidad;
        const descuentoMonto = subtotal * (Number(descuento || 0) / 100);
        return (subtotal - descuentoMonto).toFixed(2);
      };

      // Agrupar normales
      this.arrayCodigosNormales = Object.values(agrupados)
        .filter(e => e.normales > 0)
        .map(e => {
          const precioFinal = e.precio_especial || e.precio;
          const subtotalOriginal = (Number(e.precio) || 0) * e.normales;
          const subtotalEspecial = (Number(precioFinal) || 0) * e.normales;

          return {
            combo_nombre: e.combo_nombre == 'SIN COMBO' ? '' : e.combo_nombre,
            codigo_liquidacion: e.codigo_liquidacion,
            nombrelibro: e.nombrelibro,
            nombre_empresa: e.nombre_empresa,
            cantidad: e.normales,
            descuento: e.descuento,
            precio: e.precio,
            precio_especial: e.precio_especial,
            // Si hay precio especial para este item, usar valores especiales, sino originales
            subtotal: e.precio_especial ? subtotalEspecial.toFixed(2) : subtotalOriginal.toFixed(2),
            subtotal_especial: subtotalEspecial.toFixed(2),
            total: e.precio_especial ? calcularTotal(precioFinal, e.normales, e.descuento) : calcularTotal(e.precio, e.normales, e.descuento),
            total_especial: calcularTotal(precioFinal, e.normales, e.descuento)
          };
        });

      // Agrupar regalados
      this.arrayCodigosRegalados = Object.values(agrupados)
        .filter(e => e.regalados > 0)
        .map(e => {
          const precioFinal = e.precio_especial || e.precio;
          const subtotalOriginal = (Number(e.precio) || 0) * e.regalados;
          const subtotalEspecial = (Number(precioFinal) || 0) * e.regalados;

          return {
            combo_nombre: e.combo_nombre == 'SIN COMBO' ? '' : e.combo_nombre,
            codigo_liquidacion: e.codigo_liquidacion,
            nombrelibro: e.nombrelibro,
            nombre_empresa: e.nombre_empresa,
            cantidad: e.regalados,
            descuento: e.descuento,
            precio: e.precio,
            precio_especial: e.precio_especial,
            // Si hay precio especial para este item, usar valores especiales, sino originales
            subtotal: e.precio_especial ? subtotalEspecial.toFixed(2) : subtotalOriginal.toFixed(2),
            subtotal_especial: subtotalEspecial.toFixed(2),
            total: e.precio_especial ? calcularTotal(precioFinal, e.regalados, e.descuento) : calcularTotal(e.precio, e.regalados, e.descuento),
            total_especial: calcularTotal(precioFinal, e.regalados, e.descuento)
          };
        });
    },

    f_finalizarDocumento() {
      let me = this;
      let formData = new FormData();
      formData.append('finalizarDevolucionSueltos', 1);
      formData.append('id_devolucion', me.id_devolucion);
      formData.append('id_usuario', me.usuario.idusuario);

      this.$http.post(this.$server_url + 'devoluciones', formData)
        .then(response => {
          me.$vs.loading.close();
          if (response.data.status == 0) {
            me.m_message(response.data.message || 'Error al finalizar la devolución', 'warning');
            return;
          }

          me.popupConfirm = false;

          // Esperamos a que el DOM procese el cambio
          me.$nextTick(() => {
            me.m_message('Devolución finalizada con éxito.', 'success');
            me.$emit('changeFinalizar', true);
          });
        })
        .catch(error => {
          me.$vs.loading.close();
          console.error('Error al finalizar la devolución:', error);
          me.m_message('Error al finalizar la devolución.', 'error');
        });
    },
  }
}
</script>
<style scoped>
.informacionformHijo {
    z-index: 51002;
}
</style>
