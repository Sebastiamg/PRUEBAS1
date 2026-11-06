<template>
  <div>
    <div>
      <vs-table max-items="10" search pagination :data="arregloLibros">
          <template slot="header">
          <span>Cantidad: {{ arregloLibros.length }}</span>
          </template>
          <template slot="thead">
              <vs-th>Libro</vs-th>
              <vs-th>Cant. unidades</vs-th>
          </template>
          <template slot-scope="{ data }">
              <vs-tr v-for="(item, index) in data" :key="index">
                <vs-td>
                {{ item.pro_nombre }}<br>
                </vs-td>
                <vs-td>
                    {{ item.p_libros_cantidad }}<br>
                </vs-td>
              </vs-tr>
          </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      arregloLibros:[]
    }
  },
  props:{
    pedidoIdObsequio:{
      type:Number,
      default:0
    }
  },
  mounted(){
    let me = this
    me.getLibros()
  },
  methods:{
    getLibros(){
      let me = this
      this.$vs.loading();
      this.$http.get(this.$server_url+'obtenerDatosDetalleLibros/'+me.pedidoIdObsequio)
      .then(res => {
          let datos = res.data
          me.arregloLibros = datos
          this.$vs.loading.close();
      })
    },
  }
}
</script>
