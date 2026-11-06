<template>
    <div>
        <div class="flex justify-center">
           <vs-button @click="m_imprimirTodos('8px','Reporte' ,'0px','')">Imprimir</vs-button>
        </div>
        <br>
        <div id="seccionImprimir2">
            <h4 style="text-align: center;">DEVOLUCIÓN {{ ObjectSelected.codigo_devolucion  }}</h4>
            <div>
                <table style="width: 100%; border-collapse: collapse; border: none;">
                    <tr style="border: none;">
                        <td style="border: none; text-align: left; padding-left: 0px;">
                            <p class="letra" style="font-size: 11px; margin: 0;">
                                <b>Fecha:</b>
                            </p>
                        </td>
                        <td style="border: none; text-align: left; padding-left: 0px;">
                            <p class="letra" style="font-size: 11px; margin: 0;">
                                {{ ObjectSelected.created_at }}
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
                                {{ ObjectSelected.institucion ? ObjectSelected.institucion.nombreInstitucion : 'Sin cliente' }}
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
                                {{ ObjectSelected.periodo }}
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
                                {{ ObjectSelected.usuario ? ObjectSelected.usuario.nombres + ' ' + ObjectSelected.usuario.apellidos : '' }}
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            <p class="font-bold">Total Codigos: {{ ObjectSelected.cantidadHijos }}</p>
            <!--Codigos Normales-->
            <TableDevolucionVue :tableData="arrayCodigos"                   v-if="arrayCodigos.length > 0"                  titulo="Normales" class="my-2"/>
            <!--Codigos Normales-->
            <TableDevolucionVue :tableData="arrayCodigosCombosRegalados"    v-if="arrayCodigosCombosRegalados.length > 0"   titulo="Combos Regalados" class="my-2"/>
            <!--Codigos Liquidados-->
            <!--Codigos Liquidados-->
            <TableDevolucionVue :tableData="arrayBodegaLiquidados"          v-if="arrayBodegaLiquidados.length > 0"         titulo="Liquidados" class="my-2"/>
            <!--Codigos Actas Regalados-->
            <TableDevolucionVue :tableData="arrayBodegaActasRegalados"      v-if="arrayBodegaActasRegalados.length > 0"     titulo="Actas Regaladas" class="my-2"/>
            <!--Codigos Actas Liquidados-->
            <TableDevolucionVue :tableData="arrayBodegaActasLiquidados"     v-if="arrayBodegaActasLiquidados.length > 0"    titulo="Actas Liquidadas" class="my-2"/>
            <!--Codigos Regalados-->
            <TableDevolucionVue :tableData="arrayBodegaRegalados"           v-if="arrayBodegaRegalados.length > 0"          titulo="Regalados" class="my-2"/>
            <!--Codigos Regalados Liquidados-->
            <TableDevolucionVue :tableData="arrayBodegaRegaladosLiquidados" v-if="arrayBodegaRegaladosLiquidados.length > 0" titulo="Regalados Liquidados" class="my-2"/>
            <!--Codigos Guias-->
            <TableDevolucionVue :tableData="arrayBodegaGuias"               v-if="arrayBodegaGuias.length > 0" titulo="Guias"/>
            <!--tabla para la observaciones-->
            <table style="width: 100%; border-collapse: collapse; border: none;" styel="margin-top: 50px;">
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
const TableDevolucionVue = () => import('./TableDevolucion.vue')
export default {
  components: { TableDevolucionVue },
    mixins: [imprimirMixin],
    data(){
        return{

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
      arrayCodigosExclude:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayCodigosCombosRegalados:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayBodegaLiquidados:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayBodegaActasRegalados:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayBodegaActasLiquidados:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayBodegaRegalados:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayBodegaRegaladosLiquidados:{
        type:Array,
        default:function(){
            return []
        }
      },
      arrayBodegaGuias:{
        type:Array,
        default:function(){
          return []
        },
      },
    },
    mounted(){
        let me = this
    },
}
</script>
<style scoped>
.letra {
    font-size: 15px;
}
