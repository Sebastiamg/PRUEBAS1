<template>
  <div>
    <div>
      <div class="flex justify-center mt-5">
        <vs-button @click="m_imprimirTodos('12px','Reporte' ,'0px','')"><i class="fa-solid fa-print"></i> Imprimir</vs-button>
      </div>
    </div>
    <div id="seccionImprimir2" class="mt-5">
      <div>

        <div >
          <h4 style="text-align: center;" >DEVOLUCIÓN {{ ObjectSelected.ven_codigo  }}</h4>
        </div>

        <table style="width: 100%; border-collapse: collapse; border: none;">
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Fecha:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.fecha_creacionPadre }}
                    </p>
                </td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Cliente:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.nombreInstitucion ? ObjectSelected.nombreInstitucion : 'Sin cliente' }}
                    </p>
                </td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Periodo:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.periodoescolar }}
                    </p>
                </td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Cantidad Cajas:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.cantidadCajas }}
                    </p>
                </td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Cantidad Paquetes:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.cantidadPaquetes }}
                    </p>
                </td>
            </tr>
            <!--usuario creador-->
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Usuario Creador:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.creadorPadre }}
                    </p>
                </td>
            </tr>
            <!--documento bodega-->
            <tr style="border: none;">
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        <b>Documento Bodega:</b>
                    </p>
                </td>
                <td style="border: none; text-align: left; padding-left: 0px;">
                    <p class="letra" style="font-size: 11px; margin: 0;">
                        {{ ObjectSelected.codigo_devolucion }}
                    </p>
                </td>
            </tr>
        </table>
        <br>
        <p><b>Total Codigos: {{ cantidadTotal }}</b></p>
      </div>
      <br><br>
      <div class="vx-row">
        <div class="vx-col w-full">
          <!-- Proceso nuevo: una tabla por documento_venta + factura_perseo -->
          <div v-if="procesoNuevo === 1 && arrayDetallesAgrupados.length > 0">
            <div v-for="(grupo, idx) in arrayDetallesAgrupados" :key="idx" class="mb-5">
              <TableDevolucionReutilizableVue
                :tableData="grupo.arrayCodigos"
                :columnWidths="['10%','20%','5%','5%','10%','10%','10%','10%']"
                :titulo="ObjectSelected.empresa + ' - ' + grupo.documento_venta + ' / ' + grupo.factura_perseo"
                :headers="['Código','Libro','Cantidad','Descuento %','Precio','Subtotal','Total','Empresa','Observación código']"
                :fieldKeys="['pro_codigo','nombrelibro','cantidad','descuento','precio','subtotal','total','empresa','observacion_codigo']"
                :subtotal="grupo.subtotal"
                :total="grupo.total"
                :ifTotales="Number(1)"
              />
            </div>
          </div>
          <!-- Proceso anterior: una sola tabla -->
          <div v-else-if="arrayCodigos.length > 0">
            <TableDevolucionReutilizableVue
            :tableData="arrayCodigos"
            :columnWidths="['10%','20%','5%','5%','10%','10%','10%','10%']"
            :titulo="ObjectSelected.empresa"
            :headers="['Código','Libro','Cantidad','Descuento %','Precio','Subtotal','Total','Empresa','Observación código']"
            :fieldKeys="['pro_codigo','nombrelibro','cantidad','descuento','precio','subtotal','total','empresa','observacion_codigo']"
            :subtotal="subtotal"
            :total="totalValor"
            :ifTotales="Number(1)"
            />
          </div>
        </div>

      </div>
      <br><br><br>
      <!--tabla para la observaciones-->
      <table style="width: 100%; border-collapse: collapse; border: none;">
        <tr style="border: none;">
          <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                  <b>Observaciones:</b>
              </p>
              <p class="letra" style="font-size: 11px; margin: 0;">
                {{ ObjectSelected.observacion }}
            </p>
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
  components:{
    TableDevolucionReutilizableVue
  },
  data() {
    return{
      subtotal:0,
      totalValor:0,
      cantidadTotal:0,
    }
  },
  props:{
    ObjectSelected:{
      type:Object,
      default:function(){
        return {}
      }
    },
    arrayCodigos:{
      type:Array,
      default:function(){
        return []
      }
    },
    procesoNuevo:{
      type:Number,
      default:0
    },
    arrayDetallesAgrupados:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  mounted(){
    let me = this
    me.start()
  },
  methods:{
    start(){
      let me = this
      if (me.procesoNuevo === 1 && me.arrayDetallesAgrupados.length > 0) {
        // Calcular totales desde los grupos
        me.subtotal     = me.arrayDetallesAgrupados.reduce((t, g) => t + parseFloat(g.subtotal || 0), 0);
        me.totalValor   = me.arrayDetallesAgrupados.reduce((t, g) => t + parseFloat(g.total    || 0), 0);
        me.cantidadTotal = me.arrayDetallesAgrupados.reduce((t, g) => t + parseFloat(g.cantidad || 0), 0);
      } else {
        me.subtotal      = me.arrayCodigos.reduce((total, item) => total + parseFloat(item.subtotal), 0);
        me.totalValor    = me.arrayCodigos.reduce((total, item) => total + parseFloat(item.total), 0);
        me.cantidadTotal = me.arrayCodigos.reduce((total, item) => total + parseFloat(item.cantidad), 0);
      }
    },

  }
}
</script>
