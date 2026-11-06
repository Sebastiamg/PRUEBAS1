<!-- =========================================================================================
    File Name: i18n.vue
    Description: I18n demo
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div>

    <vs-popup title="Errores en excel de becas" :active.sync="modalErrores" style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
         <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
                <b>Cédula</b>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <b>Valor</b>
            </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in errores">
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.cedula"> {{item.cedula}} </span>
              </div>
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.cedula"> {{item.valor}} </span>
              </div>
          </div>
        </div>
       </div>
    </vs-popup>


    <vs-popup title="Cédulas no encontradas" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()"  style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(235,147,25); background: linear-gradient(90deg, rgba(235,147,25,1) 28%, rgba(255,166,0,1) 100%); color: white; border-radius: 5px; padding: 10px;">
        <div class="vx-row"> 
          <div class="vx-col w-full" align="center"> 
           <b>Cédulas a las que no se aplicaron becas</b>
          </div> 
        </div> 
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in cedulas_no_encontradas">
          <div class="vx-row">
              <div class="vx-col w-full" align="center"> <span> {{item}} </span> </div>
          </div>
        </div>
       </div>
    </vs-popup>



    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estas becas?</h4>
      </div>
      
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarBecas()"> Confirmar </vs-button>
      </div>

    </vs-popup>


    <div class="mb-6" align="center">
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
        <!-- {{tableData}} -->
        <vs-alert v-if="tableData.length > 0" class="mb-3" color="warning" icon-pack="feather" icon="icon-alert-triangle">
            <span>Excel cargado exitosamente. ¿Está seguro de procesar estas becas?</span>
        </vs-alert>

        <div class="vx-row mb-3" v-if="tableData.length > 0 && tableData.length <= 1500 ">
            <div class="vx-col sm:w-1/2 w-full">
              <vs-button class="mb-2" color="dark" type="filled" @click="openConfirm(0)"> Beca/Descuento solo a matrícula </vs-button>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
              <vs-button class="mb-2" color="dark" type="filled" @click="openConfirm(1)"> Beca/Descuento solo a pensiones </vs-button>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
              <vs-button class="mb-2" color="dark" type="filled" @click="openConfirm(2)"> Beca/Descuento a matrícula y pensiones </vs-button>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
              <vs-button class="mb-2" color="dark" type="filled" @click="openConfirm(3)"> Beca/Descuento a valores pendientes anteriores </vs-button>
            </div>
        </div>
        <div class="vx-row mb-3" v-else>
          <div class="vx-col w-full">
              <vs-button class="mb-2" color="danger" type="border"> Para un correcto procesamiento de las becas, no ingrese más de 1500 registros en una sola carga. </vs-button>
            </div>
        </div>

    </div>

    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="10" search :data="tableData">
        <template slot="header">
          <h4>Becas para procesar</h4>
        </template>

        <template slot="thead">
          <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
              {{ col }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import ImportExcel from './import_excel.vue'

export default {
  components: {
    ImportExcel
  },
  data () {
    return {
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      errores: [],
      modalErrores: false,
      modalConfirm: false,
      tipo_selected: '',
      modalCedulas: false,
      cedulas_no_encontradas: [],
    }
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.header = header
      this.tableData = results
      this.sheetName = meta.sheetName
    },
    procesarBecas(){
        let me = this
        
        me.$vs.loading()
        let json_becas = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_becas', json_becas);
        formData.append('id_usuario', me.usuario.idusuario);
        formData.append('tipo', me.tipo_selected);
        this.$http.post(this.$server_url+'procesar_becas', formData)
        .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Becas/descuentos procesados exitosamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            
            if( res.data.length > 0 ){
              me.modalConfirm = false
              me.cedulas_no_encontradas = res.data
              me.modalCedulas = true
            }else{
              setTimeout(function() {location.reload()}, 1000);
            }
        })
        .catch(function (error) {
            me.$vs.notify({
            text:'Verifique que la información se haya guardado correctamente.',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
            me.$vs.loading.close()
            // setTimeout(function() {location.reload()}, 1000);
        })
    },
    openConfirm(tipo) {

      let me = this
      me.tipo_selected = tipo
      if( !me.tableData[0].cedula || !me.tableData[0].valor ){
          me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
      }

      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.cedula || isNaN(value.valor) ){
          me.errores.push(value)
        }
      })

      if( me.errores.length > 0 ){
        me.modalErrores = true
      }else{
        me.modalConfirm = true
      }
    },
    recargar(){
      location.reload()
    }

  }
}
</script>
