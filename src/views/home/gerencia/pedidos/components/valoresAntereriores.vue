<template>
  <div>
    <ul class="mb-1" v-if="arregloMostrar.length > 0">
        <li v-for="(item,key) in arregloMostrar" :key="key" >
            <span>
                <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                <span class="font-semibold">
                    {{ item.periodo }}
                </span><br>
                <p>Contrato: <b>{{ item.contrato }}</b></p>
                <p>Venta bruta: <b>{{ item.ven_valor }}</b></p>
                <p>Comisión   <b>{{ item.ven_descuento }} % </b></p>
                <!-- <p>{{ item.ven_descuento }} % venta bruta: <b>{{ item.valorComision.toFixed(2) }}</b></p>  -->
                <p>Anticipo: <b>{{ item.anticipo.toFixed(2) }}</b></p>
                <p>Liquidación:
                    <b v-if="item.liquidacion < 0" class="text-danger">{{ item.liquidacion }}</b>
                    <b v-else>{{ item.liquidacion }}</b>
                </p>
            </span>
            <vs-divider></vs-divider>
        </li>
    </ul>
    <div v-else>
        <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
            No existe valores anteriores
        </vs-alert>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      arregloMostrar:[],
    }
  },
  props:{
    arregloValores:{
      type:Array,
      default:[]
    },
  },
  mounted(){
    let me = this;
    if(me.arregloValores.length > 0){
      me.renderValores(me.arregloValores)
    }
  },
  methods:{
    renderValores(tr){
      let me = this;
      var agruparPeriodos = []
      var datosSeteados   = []
      tr.forEach(element => {
          var cal     = new Object();
          cal.periodo = element.periodo
          agruparPeriodos.push(cal)
      });
      //QUITAR ARRAYS DUPLICADOS
      let hash = {};
      let resultado = agruparPeriodos.filter(o => hash[o.periodo] ? false : hash[o.periodo] = true);
      datosSeteados  = resultado
      //ingresar valores en el periodo
      datosSeteados.map(p => {
          p["valores"]    = tr.filter(s => s.periodo == p.periodo)
          return p
      });
      let ArregloOrdenar = []
      //separar los anticipos y liquidacion
      datosSeteados.forEach(element => {
          var cal = new Object();
          cal.periodo         = element.periodo
          cal.contrato        = element.valores[0].ven_codigo
          cal.ven_valor       = element.valores[0].venValor
          cal.ven_descuento   = element.valores[0].venDescuento
          cal.anticipos       = element.valores.filter(p => p.doc_ci == "ANT")
          cal.liquidados      = element.valores.filter(p => p.doc_ci == "LIQ")
          ArregloOrdenar.push(cal)
      });
      let mostrarValores=[]
      ArregloOrdenar.forEach(element => {
          var cal = new Object();
          cal.periodo         = element.periodo
          cal.contrato        = element.contrato
          cal.ven_valor       = element.ven_valor
          cal.ven_descuento   = element.ven_descuento
          let array           = element.anticipos
          let array2          = element.liquidados
          cal.anticipo    = array.reduce((a, b) => parseFloat(a) + parseFloat((b["doc_valor"] || 0)), 0);
          cal.liquidacion = array2.reduce((a, b) => parseFloat(a) + parseFloat((b["doc_valor"] || 0)), 0);
          mostrarValores.push(cal)
      });
      //ORDENAR LOS PERIODOS
      me.arregloMostrar  = mostrarValores.sort((a, b) => {
      if (a.periodo < b.periodo) {
          return 1;
      }
      if (a.periodo > b.periodo) {
          return -1;
      }
      return 0;
      });
    },
  }
}
</script>
