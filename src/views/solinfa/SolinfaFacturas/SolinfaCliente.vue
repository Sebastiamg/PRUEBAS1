<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <small>Cliente Cédula:</small>
        <div class="flex">
          <vs-input v-model="busqueda" disabled class="w-full" placeholder="Ingrese Cédula" />
          <!--boton buscar otro cliente-->
          <!-- <vs-button @click="searchClientePerseo()" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-search">Buscar</vs-button> -->
        </div>
      </div>
    </div>
    <!--TABLA-->
    <!--tablas-->
    <!-- <div class="vx-row mt-2">
      <div class="vx-col w-full">
        <vs-table max-items="10" search pagination :data="arrayClientes" v-if="arrayClientes.length > 0">
          <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayClientes.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Nombre</vs-th>
              <vs-th>Cédula</vs-th>
              <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    {{data[indextr].razonsocial}}<br>
                  </vs-td>
                  <vs-td>
                    {{data[indextr].identificacion}}<br>
                  </vs-td>
                  <vs-td>
                      <vs-button @click="ObjectClientSelected=tr;f_selectCliente(data[indextr]);" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
    </div> -->
  </div>
</template>
<script>

export default {
  data() {
    return{
      busqueda:'',
      arrayClientes:[],
      ObjectClientSelected:'',
    }
  },
  props:{
    empresa:{
      type:Number,
      default:0
    },
    ObjectSelected:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  mounted(){
    let me = this
    me.busqueda = me.ObjectSelected.cedula
    me.searchClientePerseo()
  },
  methods:{
    searchClientePerseo(){
      let me = this
      me.arrayClientes = []
      let formData = new FormData();
      formData.append("busqueda", me.busqueda);
      formData.append("empresa",  me.empresa);
      formData.append("ifSolinfa",1)
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "api/perseo/clientes/clientes_consulta", formData)
        .then((res) => {
          me.$vs.loading.close();
          if (res.data.fault) {
            this.$vs.notify({
              text: res.data.fault.faultstring,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-check'
            });
            return;
          }
          me.arrayClientes = res.data.clientes
          if(me.arrayClientes.length == 1){
            me.ObjectClientSelected = me.arrayClientes[0]
            me.f_selectCliente(me.arrayClientes[0])
          }
        })
        .catch((error) => {
            console.log(error);
            me.$vs.loading.close();
            me.$vs.notify({
                text: "Error al buscar los datos",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
            });
        });
    },
    f_selectCliente(tr){
      let me = this
      me.arrayClientes = []
      me.$emit('ChangeSendDatosCliente', tr)
    },
  }
}
</script>
