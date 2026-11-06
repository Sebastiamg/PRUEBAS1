<template>
    <div>
        <vs-table stripe :data="arregloVerificaciones">
            <template slot="thead">
                <vs-th>Verificación #</vs-th>
                <vs-th>Fecha Verificación</vs-th>
                <vs-th>Liquidacion</vs-th>
                <!-- <vs-th>Abonado</vs-th>
                <vs-th>Pendiente</vs-th> -->
            </template>
            <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>{{ tr.num_verificacion }}</vs-td>
                <vs-td> {{tr.fecha_fin}} </vs-td>
                <vs-td>
                  <div v-if="tr.valor_liquidacion == null">
                      <p class="text-primary font-light">Descargue el
                        <feather-icon icon="FileTextIcon" class="inline-block mt-2" icon-color="success"
                        svgClasses="w-5 h-5" />
                        Reporte para actualizar la liquidación
                      </p>
                  </div>
                  <div v-else>
                    <div v-if="tr.valor_liquidacion == null">
                      0
                    </div>
                    <div v-else>
                      <p>{{ parseFloat(tr.valor_liquidacion).toFixed(2) }}</p><br>
                      <vs-chip color="danger" v-if="tr.estado_pago == 1">Deuda</vs-chip>
                    </div>
                  </div>
                </vs-td>
                <!-- <vs-td> {{ tr.abonado }} </vs-td>
                <vs-td>
                  <div v-if="tr.valor_liquidacion == null">
                      0
                  </div>
                  <div v-else>
                    <div v-if="tr.estado_pago == 1">
                      0
                    </div>
                    <div v-else>
                      {{ (tr.valor_liquidacion - tr.abonado).toFixed(2) }}
                    </div>
                  </div>
              </vs-td> -->
            </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
export default{
    data(){
        return{

        }
    },
    watch:{
        arregloVerificaciones(results){
            me.arregloVerificaciones = results
        }
    },
    props:{
        arregloVerificaciones:{
            type:Array,
            default:function(){
                return []
            }
        }
    }
}
</script>