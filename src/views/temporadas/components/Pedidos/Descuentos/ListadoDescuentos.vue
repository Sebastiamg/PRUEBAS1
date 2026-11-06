<template>
  <div>
      <div>
        <vs-table max-items="10" search pagination :data="arregloDescuentos">
          <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arregloDescuentos.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Descuento</vs-th>
              <vs-th>Total Personalizado</vs-th>
              <vs-th>Estado</vs-th>
              <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <b>Nombre descuento:</b>
                    <p class="text-danger" v-if="tr.nombre_descuento == null || tr.nombre_descuento == 'null'">No existe el nombre de descuento</p>
                    <p v-else>{{data[indextr].nombre_descuento}}</p>
                    <b>Fecha creación:</b>
                    <p>{{ tr.created_at | fecha }}</p>
                    <b>Usuario creador:</b>
                    <p>{{ tr.creador }}</p>
                    <b>Tipo Descuento:</b>
                    <p class="mt-1" v-if="tr.tipo == 0"><vs-chip color="warning">% Descuento libro Regalado</vs-chip></p>
                    <p class="mt-1" v-if="tr.tipo == 1"><vs-chip color="primary">% Descuento libro</vs-chip></p><br><br>
                    <b>Descontar a:</b>
                    <p class="mt-1" v-if="tr.restar == 0"><vs-chip>Comisión</vs-chip></p>
                    <p class="mt-1" v-if="tr.restar == 1"><vs-chip>Venta</vs-chip></p><br>
                  </vs-td>
                  <vs-td>
                      {{data[indextr].total_descuento}}<br>
                  </vs-td>
                  <vs-td>
                      <vs-chip v-if="tr.estado == 1" color="success">Activo</vs-chip>
                      <vs-chip v-else color="danger">Inactivo</vs-chip>
                  </vs-td>
                  <vs-td>
                      <div style="display: flex;">
                          <div>
                            <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                <vs-button class="modal-default-button" size="small" color="success" @click="openModalEditar(tr)" type="filled" icon-pack="feather" icon="icon-edit"> Editar</vs-button>
                            </vx-tooltip> &nbsp;
                            <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="primary">
                              <vs-button class="modal-default-button" size="small" color="danger" @click="openDelete(tr)" type="filled" icon-pack="feather" icon="icon-x">Eliminar </vs-button>
                            </vx-tooltip> &nbsp;
                          </div>
                      </div>
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
  </div>
</template>
<script>
export default{
  data(){
    return{

    }
  },
  props:{
    arregloDescuentos:{
      type:Array,
      default:function(){
        return []
      },
    }
  },
  methods: {
    openModalEditar(tr){
      let me = this;
      me.$emit('changeEditHandle',tr)
    },
    openDelete(tr){
      let me = this;
      me.$emit('changeDeleteHandle',tr)
    }
  },
}
</script>
