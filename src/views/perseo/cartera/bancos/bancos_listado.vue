<template>
  <div>
    <perseo-tabla-avanzada
      :datos="arrayBancos"
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
      arrayBancos: [],
      columnas: [
        {
          label: 'ID',
          field: 'bancoid',
          width: '80px',
          sortable: true,
          filtrable: true
        },
        {
          label: 'Banco',
          field: 'descripcion',
          sortable: true,
          filtrable: true
        }
        // {
        //   label: 'Código Contable',
        //   field: 'codigocontable',
        //   sortable: true,
        //   filtrable: true
        // }
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
      this.$http.post(this.$server_url + 'api/perseo/consultas/bancos_consulta', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.arrayBancos = res.data.banco;
          if(me.arrayBancos.length == 0){
            me.m_message('No se encontraron bancos','warning')
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
