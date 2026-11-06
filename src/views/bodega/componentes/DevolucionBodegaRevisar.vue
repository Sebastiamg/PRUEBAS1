<template>
  <div>
    <div class="flex justify-center" v-if="ObjectedSelected">
        <vs-button @click="popupConfirm=true;" v-if="ObjectedSelected.estado == 0">Devolver {{ arrayCodigosEncontrados.length }} códigos</vs-button>
    </div>
    <vs-table max-items="10" stripe search pagination :data="arrayCodigosEncontrados">
      <template slot="header">
          <vs-chip color="primary">Cantidad: <b> {{ arrayCodigosEncontrados.length }}</b></vs-chip>
      </template>
      <template slot="thead">
          <vs-th width="250">Código</vs-th>
          <vs-th>Datos</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{data[indextr].codigo}}<br>
            <b>Libro:</b>
            <p>{{ tr.nombrelibro }}</p>
            <b>Código:</b>
            <p>{{ data[indextr].codigo_liquidacion }}</p>
            <b>Estado:</b>
            <p v-if="tr.estado == 0">Activo</p>
            <p v-else>Bloqueado</p>
          </vs-td>
          <vs-td>
            <b>Factura:</b>
            <p>{{ data[indextr].factura || 'No tiene' }}</p>
            <b v-if="tr.plus">Plus:</b>
            <p v-if="tr.plus">{{ data[indextr].plus }}</p>
            <b>Estado codigo:</b>
            <p v-if="tr.estado_liquidacion == 1">Pendiente por liquidar</p>
            <p v-else-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 0">Regalado sin liquidar</p>
            <p v-else-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1">Regalado liquidado</p>
            <b>Combo del libro:</b>
            <p>{{ data[indextr].combo || 'No tiene' }}</p>
            <b v-if="tr.pro_nombre">Combo nombre:</b>
            <p v-if="tr.pro_nombre">{{ tr.pro_nombre }}</p>
            <b v-if="tr.pro_descripcion">Combo descripción:</b>
            <p v-if="tr.pro_descripcion">{{ tr.pro_descripcion }}</p>
            <b>Combo etiqueta</b>
            <p>{{ tr.codigo_combo || 'No tiene' }}</p>
            <b>Paquete:</b>
            <p>{{ data[indextr].codigo_paquete || 'No tiene' }}</p>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--modales-->
    <vs-popup title="Códigos" class="informacionformHijo" :active.sync="popupConfirm">
      <div>
        <p>¿Está seguro de devolver los códigos seleccionados?</p>
        <div class="flex justify-center mt-4">
          <vs-button color="primary" class="mr-3" @click="f_devolverCodigos">Sí, devolver</vs-button>
          <vs-button color="danger" @click="popupConfirm = false">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>

  </div>
</template>
<script>
import Generalmix from '../../../mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default{
  mixins: [Generalmix],
  components: {
    TableReutilizableVue
  },
  data(){
    return{
      arrayCodigosEncontrados: [],
      ObjectedSelected: null,
      popupImprimirPdf: false,
      estadoFiltro: 0, // 0: Creado, 1: Devueltos, 2: Finalizados, 3: Anulados
      popupConfirm:false,
      usuario:[],
      popupMostrarErrores:false,
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  props: {
    id_devolucion: {
      type: Number,
      required: true,
      default: 0
    },
  },
  async mounted(){
    await this.f_getDatosCodigos();
  },
  methods: {
    // Define your methods here
    async f_getDatosCodigos(){
      let me = this;
      me.$vs.loading();
      try {
        const response = await me.$http.get(me.$server_url+'devoluciones', {
          params: {
            'getDevolucionesCombosDesarmadosXId': 1,
            'id_devolucion': me.id_devolucion
          }
        });
        me.ObjectedSelected         = response.data;
        me.arrayCodigosEncontrados  = response.data.codigos;
        me.nombrePeriodo            = response.data.periodoescolar || '';
        me.nombreInstitucion        = response.data.nombreInstitucion || '';
        me.observacion              = response.data.observacion || '';
        me.usuarioCreador           = response.data.usuarioCreador || '';
        me.$vs.loading.close();
      } catch (error) {
        me.$vs.loading.close();
        console.error('Error al obtener los datos de códigos:', error);
        me.m_message('Error al obtener los datos de códigos', 'error');
      }
    },
    f_devolverCodigos() {
      let me = this;
      let formData = new FormData();
      formData.append('data_codigos',   JSON.stringify(me.arrayCodigosEncontrados));
      formData.append('id_devolucion',  me.id_devolucion);
      formData.append('institucion_id', me.ObjectedSelected.institucion_id);
      formData.append('periodo_id',     me.ObjectedSelected.periodo_id);
      formData.append('id_usuario',     me.usuario.idusuario);

      this.$http.post(this.$server_url + 'codigos/bodega/devolver', formData)
        .then(response => {
          me.$vs.loading.close();

          if (response.data.status == 0) {
            me.m_message(response.data.message || 'Error al devolver los códigos', 'error');
            return;
          }

          if (response.data.codigosNoCambiados.length > 0) {
            me.m_message('Algunos códigos no pudieron ser devueltos.', 'warning');
            return;
          }
          me.m_message('Códigos devueltos correctamente.', 'success');
          me.popupConfirm = false;

          //Usamos $nextTick para asegurar que el cambio al modal se procese antes del emit
          me.$nextTick(() => {
            let datos = {
              cambiados: response.data.cambiados,
              codigosNoCambiados: response.data.codigosNoCambiados
            };
            me.$emit('changeRevisados', datos);
          });
        })
        .catch(error => {
          me.$vs.loading.close();
          console.error('Error al devolver los códigos:', error);
          me.m_message('Error al devolver los códigos', 'error');
        });
    },
  }
}
</script>
<style scoped>
.informacionformHijo {
    z-index: 51002;
}
</style>
