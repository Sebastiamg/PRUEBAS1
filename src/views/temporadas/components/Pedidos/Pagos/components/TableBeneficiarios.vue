<template>
  <div>
    <div>
      <vs-table max-items="10" search pagination :data="arregloBeneficiarios">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arregloBeneficiarios.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Nombre</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <b>Nombres:</b>
                  <p>{{ tr.beneficiario }}</p>
                  <b>Documento Identidad</b>
                  <p>{{ tr.cedula }}</p>
                  <b>Email</b>
                  <p>{{ tr.correo }}</p>
                </vs-td>
                <vs-td>
                  <div style="display: flex;">
                    <div>
                      <vx-tooltip style="display: inline-block;" text="Utilizar beneficiario" position="top" color="primary">
                          <vs-button class="modal-default-button" size="small" color="success" @click="utilizarBeneficiario(tr)" type="filled" icon-pack="feather" icon="icon-check"> </vs-button>
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
    arregloBeneficiarios:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  methods:{
    utilizarBeneficiario(tr){
      let me = this;
      me.$emit('handleSelect',tr)
    },
  }
}
</script>
