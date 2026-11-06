<template>
  <div>
     <div class="bg-success-gradient text-white py-3">
       <h1 class="text-center text-2xl font-bold text-white">Se han cambiado {{ porcentaje }} códigos </h1>
     </div>
    <div class="vx-row">
      <div class="vx-col w-1/2" v-if="arrayLibrosNoExistenEnNota.length > 0">
        <TableReutilizableVue
          :title="'Libros que no existen en la nota'"
          :headers="['Código','Nota','Cantidad']"
          :fieldKeys="['codigo_liquidacion','codigo_proforma','cantidad']"
          :tableData="arrayLibrosNoExistenEnNota"
        />
      </div>
      <div class="vx-col w-1/2" v-if="arrayCodigosInsuficientesNotas.length > 0">
        <TableReutilizableVue
          :title="'Libros que no hay suficientes libros en la nota'"
          :headers="['Código','Nota','Cantidad disponbile','cantidad a cambiar']"
          :fieldKeys="['codigo_liquidacion','codigo_proforma','cantidadLibrosNotas','cantidad']"
          :tableData="arrayCodigosInsuficientesNotas"
        />
      </div>
      <div class="vx-col w-1/2" v-if="arrayCodigosProblemas.length > 0">
        <TableReutilizableVue
          :title="'Códigos que no se pudieron agregar la pre factura'"
          :headers="['codigo','Mensaje']"
          :fieldKeys="['codigo','mensaje']"
          :tableData="arrayCodigosProblemas"
        />
      </div>
    </div>
  </div>
</template>
<script>
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue');
export default {
  components:{
    TableReutilizableVue
  },
  data(){
    return{

    }
  },
  props:{
    porcentaje:{
      type:Number,
      default:0
    },
    arrayLibrosNoExistenEnNota:{
      type:Array,
      default: function () {
        return []
      }
    },
    arrayCodigosInsuficientesNotas:{
      type:Array,
      default: function () {
        return []
      }
    },
    arrayCodigosProblemas:{
      type:Array,
      default: function () {
        return []
      }
    },
  }
}
</script>
