<template>
  <div>
    <perseo-tabla-avanzada
      :datos="arrayBancosClientes"
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
      arrayBancosClientes: [],
      columnas: [
        {
          label: 'ID',
          field: 'bancocid',
          width: '80px',
          sortable: true,
          filtrable: true
        },
        {
          label: 'Banco Cliente',
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
      this.$http.post(this.$server_url + 'api/perseo/consultas/clientes_bancos_consulta', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.arrayBancosClientes = res.data.bancoc;
          if(me.arrayBancosClientes.length == 0){
            me.m_message('No se encontraron bancos de clientes','warning')
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
