<template>
  <div>
    <div>
      <!-- aa {{ arrayCodigos }} -->
      <vs-button @click="exportarExcel();" class="mt-2" v-if="arrayCodigos.length > 0" color="success"><i class="fa-solid fa-file-excel"></i> Exportar</vs-button>
      <vs-table max-items="10" search pagination :data="arrayCodigos">
        <!--ifpuntoVenta 0 =>  2 => COMBOS-->
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayCodigos.length }}</b></vs-chip>
            <div class="ml-3" v-if="ifpuntoVenta==0">
              <p class="text-success"><b>Valor total {{ titleCard.toUpperCase() }}: </b>$ {{ totalValores | filtrarDecimal }}</p>
            </div>
            <div class="ml-5" v-if="ifpuntoVenta==0">
              <p class="text-primary"><b>Cantidad de libros {{ titleCard.toUpperCase() }}: </b>{{ totalLibros | filtrarDecimal }}</p>
            </div>
            <!--punto de venta-->
            <div class="ml-3" v-if="ifpuntoVenta==1 || ifpuntoVenta==2 || ifpuntoVenta == 3">
              <p class="text-success"><b>Valor total: </b>$ {{ totalValores | filtrarDecimal }}</p>
            </div>
            <div class="ml-5" v-if="ifpuntoVenta==1 || ifpuntoVenta==2 || ifpuntoVenta == 3">
              <p class="text-primary"><b>Cantidad : </b>{{ totalLibros | filtrarDecimal }}</p>
            </div>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th v-if="ifpuntoVenta==2 || tipoCode == 'onlyCombos'">Códigos del combo</vs-th>
            <vs-th v-if="tipoCode == 'onlyCombos'">Cant. libros</vs-th>
            <vs-th>Código</vs-th>
            <vs-th>Cantidad</vs-th>
            <vs-th>Precio unit.</vs-th>
            <vs-th>Precio Total</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                 <span v-if="ifpuntoVenta == 4">GUIA</span> {{data[indextr].nombrelibro}}<br>
                </vs-td>
                <vs-td v-if="ifpuntoVenta==2 || tipoCode == 'onlyCombos'">
                  {{ tr.codigos_combos }}
                </vs-td>
                <vs-td v-if="tipoCode == 'onlyCombos'">
                  {{ tr.total_codigos }}
                </vs-td>
                <vs-td>
                  {{data[indextr].codigo}}<br>
                </vs-td>
                <vs-td>
                  {{ tr.cantidad }}
                </vs-td>
                <vs-td>
                  {{ tr.precio }}
              </vs-td>
              <vs-td>
                  {{ tr.precio_total | filtrarDecimal }}

            </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
import Codigosmix from '../../../../../mixins/Codigosmix';
export default {
  mixins: [Codigosmix],
  data() {
    return{

    }
  },
  props:{
    ifpuntoVenta:{
      type:Number,
      default:0
    },
    arrayCodigos:{
      type:Array,
      default:function(){
        return []
      }
    },
    arrayPuntosVenta:{
      type:Array,
      default:function(){
        return []
      }
    },
    tipoCode:{
      type:String,
      default:"activos"
    },
    titleCard:{
      type:String,
      default:"activos"
    },
    totalValores:{
      type:Number,
      default:0
    },
    totalLibros:{
      type:Number,
      default:0
    },
    nombreArchivo:{
      type:String,
      default:""
    },
    institucion_id:{
      type:Number,
      default:0
    },
    nombrePeriodo:{
      type:String,
      default:""
    }
  },
  methods:{
    exportarExcel(){
      let me = this
      const headerTitle = new Set();
      headerTitle.add("Libro");
      headerTitle.add("Código");
      headerTitle.add("Cantidad");
      headerTitle.add("Precio");
      headerTitle.add("Precio Total");

      const headerVal = new Set();
      headerVal.add("nombrelibro");
      headerVal.add("codigo");
      headerVal.add("cantidad");
      headerVal.add("precio");
      headerVal.add("precio_total");
      //exportar a excel
      let nombrearchivo = ""
      if(me.ifpuntoVenta == 0){
        nombrearchivo = me.nombrePeriodo+'_Codigos_'+me.titleCard
      }
      //obtener el nombre del punto de venta
      else if(me.ifpuntoVenta == 1){
        nombrearchivo = me.arrayPuntosVenta.find(x => x.institucion_id == me.institucion_id).nombreInstitucion
      }
      //combos
      else if(me.ifpuntoVenta == 2){
        nombrearchivo = me.nombrePeriodo+'_Codigos_Combos'
      }
      //codigos subidos por bodega - combos
      else if(me.ifpuntoVenta == 3){
        nombrearchivo = me.nombrePeriodo+'_Codigos_Final'
      }
      //GUIAS
      else if(me.ifpuntoVenta == 4){
        nombrearchivo = me.nombrePeriodo+'_GUIAS'
      }
      else{
        nombrearchivo = me.nombrePeriodo+me.nombreArchivo
      }
      me.m_exportTodo(headerTitle,headerVal,me.arrayCodigos,me.nombrePeriodo+nombrearchivo)
    },
  }
}
</script>
