<template>
  <div>
    <div class="flex">
      <vs-button color="success" @click="exportar" class="mb-4 p-2 mr-5"><i class="fa-solid fa-file-excel"></i> Exportar</vs-button>
      <vs-checkbox v-model="soloErrores" class="mb-2">Mostrar solo combos con error</vs-checkbox>
    </div>

    <vs-table max-items="10" stripe search pagination :data="filtradoDetalle">
      <template slot="header">
        <vs-chip  color="primary">Cantidad: <b> {{ arrayDetalle.length }}</b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th>Combo</vs-th>
        <vs-th>Combos items</vs-th>
        <vs-th>Códigos</vs-th>
        <vs-th>Mensaje</vs-th>
      </template>
      <template slot-scope="{data}">
      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
        <vs-td>
          {{ comboLibro }}<br>
          <b>Códigos del combo:</b>
          <p>{{ codigos_combos }}</p>
        </vs-td>
        <vs-td>
          {{data[indextr].codigo_combo}}<br>
          <b>Cantidad:</b>
          <p :style="tr.cantidad !== codigosPorCombo ? 'color: red; font-weight: bold;' : ''">{{ tr.cantidad }} / {{ codigosPorCombo }}</p>
        </vs-td>
        <vs-td>
          <b>Combo etiqueta:</b>
          <p>{{ tr.etiqueta }}</p>
          <br>
          <vs-divider></vs-divider>
          <div v-for="(item, index) in data[indextr].hijos" :key="index">
            {{item.codigo}} -
            <span v-if="item.contrato">{{item.contrato}}</span>
            <span v-else>Sin contrato</span>
            <br><br>
          </div>
        </vs-td>
        <vs-td>
          <span v-if="tr.cantidad !== codigosPorCombo">Faltan códigos</span>
        </vs-td>
      </vs-tr>
      </template>
    </vs-table>
  </div>
</template>
<script>
import Codigosmix from "@/mixins/Codigosmix";
export default{
  mixins: [Codigosmix],
  data(){
    return{
      arrayDetalle:[],
      soloErrores: false
    }
  },
  computed: {
    filtradoDetalle() {
      if (this.soloErrores) {
        return this.arrayDetalle.filter(tr => tr.cantidad !== this.codigosPorCombo);
      }
      return this.arrayDetalle;
    }
  },
  mounted(){
    this.getDetalle();
  },
  props:{
    periodo_id:{
      type: Number,
      default: 0,
    },
    comboLibro:{
      type: String,
      default: ''
    },
    codigos_combos:{
      type:String,
      default: ''
    },
    codigosPorCombo:{
      type:Number,
      default: 0
    }
  },
  methods:{
    getDetalle() {
      let me = this;
      me.$vs.loading();
      var  nuevarutaxperiodo = `metodosGetCodigos?getReporteCombosDespachadosXCombo=1&periodo=${me.periodo_id}&combo=${me.comboLibro}`;
      this.$http.get(this.$server_url + nuevarutaxperiodo)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayDetalle = res.data;
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
    },
    exportar() {
      let me = this;
      // Preparar datos para exportar
      let codeExport = JSON.parse(JSON.stringify(me.arrayDetalle)).map(item => {
        return {
          combo: me.comboLibro,
          codigo_combo: item.codigo_combo,
          combo_etiqueta: item.etiqueta,
          cantidad: item.cantidad + ' / ' + me.codigosPorCombo,
          codigos: (item.hijos || []).map(h => h.codigo).join(', '),
          mensaje: item.cantidad !== me.codigosPorCombo ? 'Faltan combos' : ''
        };
      });
      let nameFile = 'Detalle_Combo_' + me.comboLibro;
      let headers = ['Combo','Combo etiqueta','Cantidad','Códigos','Mensaje'];
      let fieldKeys = ['combo','combo_etiqueta','cantidad','codigos','mensaje'];
      if (typeof me.m_exportTodo === 'function') {
        me.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else if (me.$parent && typeof me.$parent.m_exportTodo === 'function') {
        me.$parent.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else {
        me.$vs.notify({ text: 'Función de exportación no disponible', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
      }
    }
  }
}
</script>
