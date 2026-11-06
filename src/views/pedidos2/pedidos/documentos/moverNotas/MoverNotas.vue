<template>
  <div>
    <vx-card
      :title="'Mover Notas a Pre facturas o convertir a una nota a Pre Factura'"
      >
      <ul class="flex">
        <li class="mr-2">
            Seleccione la empresa:
        </li>
        <li class="mr-2">
            <vs-radio v-model="radioEmpresa" @input="start()" vs-name="radios1radioEmpresa" vs-value="1">Prolipa</vs-radio>
        </li>
        <li class=mr-2>
            <vs-radio v-model="radioEmpresa" @input="start()" vs-name="radios1radioEmpresa" vs-value="3">Calmed</vs-radio>
        </li>
      </ul>
    </vx-card>
    <vx-card class="mt-2" title="Listado de Notas">
      <vs-table max-items="10" stripe search pagination :data="arrayNotas">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayNotas.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Nota</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].ven_codigo}}<br>
                </vs-td>
                <vs-td>
                  <!--boton de mover notas-->
                  <vx-tooltip style="display: inline-block;" text="Mover notas a pre facturas" position="top" color="primary">
                    <vs-button class="modal-default-button" size="small" color="success" @click="ObjectSelected=tr;openModalMoverNotas(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> Cambiar a pre factura</vs-button>
                  </vx-tooltip>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </vx-card>
    <!--modal para mover notas-->
    <vs-popup classContent="popup-example" title="Mover nota" :active.sync="popupMoverNotas">
      <div v-if="popupMoverNotas">
        <MoverNotasReceptorVue @openConfirmMove="openConfirmMove" :periodo_id="periodo_id" :arrayPrefacturas="arrayPrefacturas" :ObjectSelected="ObjectSelected" />
      </div>
    </vs-popup>
  </div>
</template>
<script>
const MoverNotasReceptorVue = () => import('./MoverNotasReceptor')
import Generalmix from '@/mixins/Generalmix';
export default{
  mixins:[Generalmix],
  components:{
    MoverNotasReceptorVue
  },
  data(){
    return{
      radioEmpresa:1,
      arrayNotas:[],
      arrayPrefacturas:[],
      usuario:[],
      popupMoverNotas:false,
      ObjectSelected:'',
      observacion:"",
    }
  },
  props:{
    periodo_id:{
      type:Number,
      default:0
    },
    nombrePeriodo:{
      type:String,
      default:""
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    this.start()
  },
  methods:{
    openConfirmMove(e,datos){
      let me = this
      me.observacion = ""
      if(e == 0){
        me.observacion = datos.observacion
      }
      me.popupMoverNotas = false
      //confirm de estas seguro de mover a pre factura
      me.$vs.dialog({
        type: 'confirm',
        color: "danger",
        title: "Confirmación",
        text: `¿Está seguro de mover la nota ${me.ObjectSelected.ven_codigo} a una pre factura?`,
        acceptText: 'Aceptar',
        cancelText: 'Cancelar',
        accept: () => {
          this.moverNotaPrefactura(); // Asegúrate de que esta función esté definida en el contexto
        },
        cancel: () => {
          this.popupMoverNotas = true;
        }
      });
    },
    moverNotaPrefactura(){
      let me = this
      let formData = new FormData();
      formData.append('ven_codigo', me.ObjectSelected.ven_codigo);
      //id empresa
      formData.append('id_empresa', me.radioEmpresa);
      //id periodo
      formData.append('id_periodo', me.periodo_id);
      //id usuario
      formData.append('id_usuario', me.usuario.idusuario);
      //iniciales
      formData.append('iniciales', me.usuario.iniciales);
      //observacion
      formData.append('observacion', me.observacion);
      if(me.usuario.iniciales == '' || me.usuario.iniciales == null || me.usuario.iniciales == undefined || me.usuario.iniciales == 0) {
        me.m_message('Debe usuario no tiene iniciales','danger')
        return
      }
      me.$vs.loading()
      this.$http.post(this.$server_url+'notasMoverToPrefactura', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.m_message(res.data.message,'danger')
          return
        }
        me.$vs.notify({
          text: res.data.message,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.start()
        me.popupMoverNotas = false
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
        me.m_message('Error al mover nota a pre factura','danger')
      })
    },
    start(){
      this.getNotas()
      this.getPrefacturas()
    },
    getNotas(){
      let me = this
      me.arrayNotas = []
      var url = "";
      url = `GetNotas?notas=1&activas=1&periodo=${me.periodo_id}&empresa=${me.radioEmpresa}`
      me.$vs.loading()
      this.$http.get(this.$server_url+url)
      .then(response => {
        this.arrayNotas = response.data
      })
      .catch(function (error) {
        me.m_message('Error al obtener las notas','danger')
          console.log(error + ' error');
      })
      .finally(() => {
        me.$vs.loading.close()
      })
    },
    getPrefacturas(){
      let me = this
      me.arrayPrefacturas = []
      var url = "";
      url = `GetNotas?prefactura=1&activas=1&periodo=${me.periodo_id}&empresa=${me.radioEmpresa}`
      this.$http.get(this.$server_url+url)
      .then(response => {
        this.arrayPrefacturas = response.data
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    //para abrir el popup de mover notas
    openModalMoverNotas(data={}){
      let me = this;
      me.popupMoverNotas = true;

    },
  }
}
</script>
