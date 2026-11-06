<template>
  <div>
    <perseo-tabla-avanzada
      :datos="arrayCategorias"
      :columnas="columnas"
      :seleccionable="false"
      :mostrar-acciones="false"
      :items-por-pagina-inicial="10"
    />
  </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
const PerseoTablaAvanzada = () => import('@/views/perseo/components/perseo_tabla_avanzada.vue');
export default {
  components: {
    PerseoTablaAvanzada
  },
  mixins: [Generalmix],
  data() {
    return {
      arrayCategorias: [],
      columnas: [
        {
          label: 'ID',
          field: 'productos_categoriasid',
          width: '80px',
          sortable: true,
          filtrable: true
        },
        {
          label: 'Nombre del Grupo',
          field: 'descripcion',
          sortable: true,
          filtrable: true
        }
      ]
    };
  },
  props:{
    id_empresa:{
      type:Number,
      default:1
    }
  },
  mounted(){
    this.f_listar()
  },
  methods:{
    f_listar(){
      let me = this;
      let formData = new FormData();
      formData.append('id_empresa', this.id_empresa)
      me.$vs.loading()
      this.$http.post(this.$server_url + 'api/perseo/productos/productos_categorias_consulta', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.arrayCategorias = res.data.categorias;
          if(me.arrayCategorias.length == 0){
            me.m_message('No se encontraron categorías de productos','warning')
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          me.m_message('Hubo problemas al traer los datos','error')
        })
    }
  }
}
</script>
