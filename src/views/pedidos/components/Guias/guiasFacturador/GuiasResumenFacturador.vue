<template>
  <div>
    <vs-button class="mt-5" @click="handleCrearDocumento" :disabled="todoAutorizado"><i class="fa-solid fa-plus"></i> Crear documento de venta</vs-button>

    <div class="mt-3 mb-3">
      <vs-checkbox v-model="mostrarSoloFaltantes">Mostrar solo faltantes de autorizar</vs-checkbox>
    </div>

    <!-- Mensaje informativo sobre items en amarillo -->
    <vs-alert v-if="hayItemsPendientes" color="warning" class="mb-3 alert-suave" style="margin-top: 15px;">
      <template #icon>
        <i class="fa-solid fa-circle-info"></i>
      </template>
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fa-solid fa-triangle-exclamation" style="color: #ff9800; font-size: 20px;"></i>
        <span>
          <strong>Items en amarillo:</strong> Existen items pendientes por crear documento de venta.
          La cantidad autorizada aún no coincide con la cantidad solicitada.
        </span>
      </div>
    </vs-alert>

      <vs-table max-items="10" search pagination :data="arrayResumenFiltrado">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ arrayResumenFiltrado.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th>Cantidad Pedida</vs-th>
            <vs-th>Cantidad Autorizada</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr
              :data="tr"
              :key="indextr"
              v-for="(tr, indextr) in data"
              :class="{'fila-diferente': esDiferente(tr)}"
            >
              <vs-td>
                <b>Nombre:</b>
                <p>{{tr.nombrelibro}}</p>
                <b>Código:</b>
                <p>{{tr.codigoFact}}</p>
              </vs-td>
              <vs-td>
                {{tr.cantidad_solicitada}}
              </vs-td>
              <vs-td>
                {{tr.cantidadAutorizada}}
              </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <vs-popup class="popupHijo" fullscreen title="Crear Documento de Venta" :active.sync="popupAgregarDocumento">
        <div v-if="popupAgregarDocumento">
          <GuiasCrearDocumentosVentaVue
            :ObjectSelected="ObjectSelected"
            :mixinIdInicioFormatoNewData="mixinIdInicioFormatoNewData"
            @cerrar="popupAgregarDocumento = false; f_getResumen()"
          />
        </div>
      </vs-popup>
  </div>
</template>
<script>
const GuiasCrearDocumentosVentaVue = () => import('./GuiasCrearDocumentosVenta.vue')
export default{
  components: {
    GuiasCrearDocumentosVentaVue
  },
  data(){
    return{
      arrayResumen: [],
      popupAgregarDocumento: false,
      todoAutorizado: false,
      mostrarSoloFaltantes: false,
    }
  },
  props: {
    ObjectSelected: {
      type: Object,
      default: () => ({})
    },
    mixinIdInicioFormatoNewData: {
      type: [Number, String],
      default: null
    }
  },
  mounted() {
    this.f_getResumen();
  },
  computed: {
    arrayResumenFiltrado() {
      if (this.mostrarSoloFaltantes) {
        return this.arrayResumen.filter(item => this.esDiferente(item));
      }
      return this.arrayResumen;
    },
    hayItemsPendientes() {
      // Verifica si hay algún item con cantidades diferentes (pendiente de autorizar)
      return this.arrayResumen.some(item => this.esDiferente(item));
    }
  },
  methods:{
    f_getResumen(){
      let me = this;
      me.arrayResumen = []
      me.$vs.loading()
      var url = ""
      var url = this.$server_url+'guias?InformacionPedidoGuia=1&id_pedido='+me.ObjectSelected.id_pedido
      this.$http.get(url)
      .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
              me.$vs.notify({
                  text: res.data.message,
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle',
                  time:3000
              })
              return
          }
          me.arrayResumen = res.data
          me.f_verificarTodoAutorizado()

        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
            me.$vs.notify({
                text: "Ocurrio un error al cargar los datos",
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time:3000
            })
        })
      },
      f_verificarTodoAutorizado(){
        let me = this;
        if(me.arrayResumen.length === 0){
          me.todoAutorizado = false;
          return;
        }

        const todoAutorizado = me.arrayResumen.every(item => {
          return parseInt(item.cantidad_solicitada) === parseInt(item.cantidadAutorizada);
        });

        me.todoAutorizado = todoAutorizado;

        if(todoAutorizado){
          me.$vs.notify({
            text: "Ya todo está facturado - Todos los items están autorizados",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check-circle',
            time: 3000
          })
        }
      },
      handleCrearDocumento(){
        let me = this;
        if(me.todoAutorizado){
          me.$vs.notify({
            text: "Ya todo está facturado - No hay items pendientes de autorizar",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            time: 3000
          })
          return;
        }
        me.popupAgregarDocumento = true;
      },
      esDiferente(item) {
        return parseInt(item.cantidad_solicitada) !== parseInt(item.cantidadAutorizada);
      }
  }
}
</script>
<style scoped>
  .popupHijo {
    z-index: 52000 !important;
  }

  /* Alerta con colores más suaves */
  .alert-suave {
    background-color: #fffbf0 !important;
    border-left: 4px solid #ffb74d !important;
    height: 80px;
  }

  /* Filas con color amarillo más suave y profesional */
  .fila-diferente {
    background-color: #fff8e1 !important;
  }

  .fila-diferente:hover {
    background-color: #fff3d1 !important;
  }
</style>
