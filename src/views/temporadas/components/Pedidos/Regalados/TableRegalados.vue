<template>
  <div>
    <div>
      <p class="mt-5">>>Códigos Regalados</p>
      <vs-table max-items="10" search pagination :data="arregloRegalados" class="mt-4">
        <template slot="header">
          <vs-chip>Cantidad {{ arregloRegalados.length }}</vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Libro</vs-th>
          <vs-th>Código Liquidación</vs-th>
          <vs-th>Cantidad</vs-th>
          <vs-th>Precio</vs-th>
          <vs-th>Valor</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
                {{data[indextr].nombre_libro}}<br>
                <div v-if="tr.plus">
                  <b>PLUS</b>
                </div>
            </vs-td>
            <vs-td>
                {{data[indextr].codigo}}<br>
            </vs-td>
            <vs-td>
                {{tr.cantidad}}
            </vs-td>
            <vs-td>
            {{tr.precio}}
            </vs-td>
            <vs-td>
            ${{ filtrarDecimal(tr.cantidad * tr.precio) }}
            </vs-td>
            <vs-td>
                <vs-button color="success" type="relief" @click="verCodigos(tr)" icon="code">Ver códigos</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{

    }
  },
  props:{
    arregloRegalados:{
      type:Array,
      default:function(){
        return []
      }
    },
  },
  methods:{
    verCodigos(tr){
      let me = this;
      let datos = {
        tipo:3,
        data:tr
      }
      me.$emit('recharge',datos)
    },
    filtrarDecimal(numero){
      let me = this
      if(numero == 0){
        return numero
      }else{
        const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return transformar
      }
    },
  }
}
</script>
