<template>
  <vx-card>
    <div v-for="(item,key) in arregloTransabilidad" :key="key">
      <p class="text-success font-bold">Alcance # {{ item.id }}</p>
      <p class="mt-1">
        <vs-chip color="dark">Total ${{ item.venta_bruta }}</vs-chip>
      </p>
      <p class="mt-1">
        <vs-chip v-if="item.estado_alcance == 0" color="warning">Abierto</vs-chip>
        <vs-chip v-if="item.estado_alcance == 1" color="success">Aprobado</vs-chip>
        <vs-chip v-if="item.estado_alcance == 2" color="danger">Rechazado</vs-chip>
      </p>
      <br><br>
      <ul class="mb-1">
        <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
            <span class="flex items-center">
                <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                <span class="font-semibold">Creación de alcance</span>
            </span>
            <span>{{ item.fecha_creacion}}</span>
        </li>
        <li class="flex justify-between py-3 px-6 border d-theme-border-grey-light border-solid border-r-0 border-l-0 border-b-0">
          <span class="flex items-center">
              <span class="inline-block h-3 w-3 rounded-full mr-2 bg-success"></span>
              <span class="font-semibold">Aprobacion de alcance</span>
          </span>
          <span>{{ item.fecha_aprobacion}} </span>
      </li>
      </ul>
    </div>
  </vx-card>
</template>
<script>
import {
    mapState
} from "vuex";
export default{
    data(){
        return{
            arregloTransabilidad:[],
            pedido:'',
        }
    },
    computed: {
      ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador','asesorSelectedPedido']),
    },
    mounted(){
        let me = this;
        me.pedido = me.ObjectPedido
        me.getTransabilidad()
    },
    methods:{
        getTransabilidad(){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'trazabilidadAlcance/'+me.pedido.id_pedido)
                .then(function (res) {
                    me.arregloTransabilidad = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        }
    }

}
</script>
