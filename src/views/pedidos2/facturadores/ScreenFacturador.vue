<template>
    <div>
        <vs-table search :data="facturadores">
          <template slot="header">
            <h5>Facturadores</h5>
          </template>
          <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="facturador">Facturador</vs-th>
            <vs-th >Asesores</vs-th>
            <vs-th style="width: 350px;">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td> {{ tr.idusuario }} </vs-td>
              <vs-td :data="tr.facturador"> {{ tr.facturador }} </vs-td>
              <vs-td>
                <div :key="index_as" v-for="(tr_as, index_as) in tr.asesores"> <b>-</b> {{tr_as.asesor.toUpperCase()}} </div>
              </vs-td>
              <vs-td align="center">
                <vs-button color="primary" type="gradient" size="small" class="m-1 p-2" @click="editar_facturador(tr)">Editar facturador</vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <!--MODALES-->
        <vs-popup title="Asesores del facturador seleccionado" :active.sync="popupFacturador">
            <div class="flex flex-wrap gap-6">
            <vs-switch  color="dark" class="text-xl p-0" style="width: 45%;" :key="index" v-for="(item, index) in asesores_facturador" v-model="item.asignado" @input="asignar_asesor(item)">
                <span slot="on">{{item.asesor.toUpperCase()}}</span>
                <span slot="off">{{item.asesor.toUpperCase()}}</span>
            </vs-switch>
            </div>
        </vs-popup>
    </div>
</template>
<script>
export default{
    data(){
        return{
            facturadores:[],
            facturador_selected:'',
            asesores_facturador:[],
            popupFacturador:false,
        }
    },
    mounted(){
        let me = this
        me.get_facturadores()
    },
    methods:{
        get_facturadores(){
        let me = this
        this.$http.get(this.$server_url+'get_facturadores_pedido')
        .then(res => {
            me.facturadores = res.data
        })
      },
      editar_facturador(item){
        let me = this
        me.facturador_selected = item.idusuario
        this.$http.get(this.$server_url+'get_asesores_factuador/'+item.idusuario)
        .then(res => {
            me.asesores_facturador = res.data
            me.popupFacturador = true
        })
      },
      asignar_asesor(item){
        let me = this
        me.$vs.loading()
        this.$http.get(this.$server_url+'asignar_asesor_fact/'+me.facturador_selected+'/'+item.idusuario+'/'+item.asignado)
        .then(res => {
            me.get_facturadores()
            me.$vs.loading.close()
        })
      },
    }
}
</script>
