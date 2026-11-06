<template>
  <div>
    <div>
      <vs-table max-items="10" search pagination :data="arrayDatos">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayDatos.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>id</vs-th>
            <vs-th>Nombre</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].institucion_id}}<br>
                </vs-td>
                <vs-td>
                    {{data[indextr].nombreInstitucion}}<br>
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
    arrayDatos:{
      type: Array,
      default: function(){
        return []
      }
    }
  }
}
</script>
