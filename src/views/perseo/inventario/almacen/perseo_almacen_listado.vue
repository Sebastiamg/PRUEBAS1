<template>
  <div>
    <perseo-tabla-avanzada
      :datos="arrayDatos"
      :columnas="columnas"
      :seleccionable="false"
      :mostrar-acciones="false"
      :items-por-pagina-inicial="10"
      @seleccion-cambiada="handleSeleccion"
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
      arrayDatos: [],
      columnas: [
        {
          label: 'ID',
          field: 'almacenesid',
          width: '80px',
          sortable: true,
          filtrable: true
        },
        {
          label: 'Almacén',
          field: 'descripcion',
          sortable: true,
          filtrable: true
        }
      ]
    };
  },
  props: {
    id_empresa: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    this.f_listar();
  },
  methods: {
    f_listar() {
      let me = this;
      let formData = new FormData();
      formData.append('id_empresa', this.id_empresa);
      me.$vs.loading();
      this.$http.post(this.$server_url + 'api/perseo/consultas/almacenes_consulta', formData)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayDatos = res.data.almacenes;
          if (me.arrayDatos.length == 0) {
            me.m_message('No se encontraron almacenes', 'warning');
          }
        })
        .catch(function (error) {
          me.$vs.loading.close();
          me.m_message('Hubo problemas al traer los datos', 'error');
        });
    },
    handleSeleccion(filasSeleccionadas) {
      console.log('Filas seleccionadas:', filasSeleccionadas);
      // Aquí puedes manejar la selección
    }
  }
}
</script>

<style lang="scss" scoped>
.acciones-btns {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-accion {
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  
  i {
    pointer-events: none;
  }
  
  &.btn-editar {
    background: #ffc107;
    color: white;
    
    &:hover {
      background: #e0a800;
      transform: translateY(-2px);
    }
  }
  
  &.btn-ver {
    background: #17a2b8;
    color: white;
    
    &:hover {
      background: #138496;
      transform: translateY(-2px);
    }
  }
  
  &.btn-eliminar {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-2px);
    }
  }
}
</style>
