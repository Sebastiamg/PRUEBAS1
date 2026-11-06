
<template>
  <div>

    <vs-popup title="Códigos no encontrados" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()"  style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(235,147,25); background: linear-gradient(90deg, rgba(235,147,25,1) 28%, rgba(255,166,0,1) 100%); color: white; border-radius: 5px; padding: 10px;">
        <div class="vx-row"> 
          <div class="vx-col w-full" align="center"> 
           <b>Codigos a las que no se aplicaron correctamente</b>
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
        <h4>Está seguro de aplicar estas códigos?</h4>
      </div>
      
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>

    </vs-popup>
    <div class="mb-6" align="center">
          <div class="vx-col w-full">
          <p style="color:#EC4518;">
         <i class="fa fa-file" aria-hidden="true"></i>  Eliminación de Códigos de la BD de Bodega códigos mediante importación <span style="font-weight: bold;">(no ingrese más de 2000 registros en una sola carga.)</span>
          </p>
        </div>
        <br/>
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
      <div>
          <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
              <vs-card>
                <div class="header">
                  <p style="font-weight: bold;">Formato del archivo excel</p>
                  <table class="tabla">
                      <tr>
                        <th class="th1">codigo</th>
                      </tr>
                      <tr>
                        <td class="td1">xxx</td>
                      </tr>
                  </table>
                </div>
              </vs-card>
            </vs-col>
          </vs-row>
      </div>
       
        <vs-alert v-if="tableData.length > 0" color="danger" class="mb-3 mt-2"  icon-pack="feather" icon="icon-alert-triangle">
            <span>Excel cargado exitosamente. ¿Está seguro de eliminar estos códigos?</span><br>
        </vs-alert>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 2000 " class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
               <vs-button class="mb-2" color="danger"  type="relief" @click="openConfirm(0)"> Eliminar códigos </vs-button>
            </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-alert active="true">
                    Se eliminarón {{ porcentaje }} códigos
                </vs-alert>
            </vs-col>
         
        </vs-row>     
        <vs-row v-if="codigosPerdidos == true">
            <vs-card>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron eliminar"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                    </vs-list-item>
                </vs-list>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ codigoNoExiste.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
                    <vs-list-item :key="s" v-for="(tr, s) in codigoNoExiste" icon="check" :title="tr.codigo" >
                    </vs-list-item>
                </vs-list>
            </vs-col>
          </vs-card>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vs-card>
            <div class="header">
                <span style="font-weight:bold;">Codigos que tiene libro</span>
            </div>
            <vs-table stripe pagination max-items="25" search :data="codigosConLibro">
              <template slot="header" class="flex">
                  <p>Cantidad: {{codigosConLibro.length }}</p>
              </template>
              <template slot="thead">
                  <vs-th sort-key="codigo">Código</vs-th>
              </template>
              <template slot-scope="{data}">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].codigo">
                      <p style="font-weight:bold;">Código:</p>
                      {{ data[indextr].codigo }}
                    </vs-td>
                  </vs-tr>
              </template>
            </vs-table>
          </vs-card>   
        </vs-row>
    </div>

    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="10" search :data="tableData">
        <template slot="header">
          <h4>Códigos a eliminar {{tableData.length}}</h4>
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
      codigosPerdidos:false,
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      modalConfirm: false,
      modalErrores: false,
      errores: [],
      tipo_selected: '',
      cedulas_no_encontradas: [],
      modalCedulas: false,
      codigosNoCambiados:[],
      codigoNoExiste:[],
      codigosConLibro:[],
      porcentaje:0,
    }
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.header = header
      this.tableData = results
      this.sheetName = meta.sheetName
    },
    procesarPagos(){
        let me = this
        me.$vs.loading()
        let json_pagos = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_codigos', json_pagos);
        formData.append('id_usuario', me.usuario.idusuario);
        formData.append('tipo', me.tipo_selected);
        this.$http.post(this.$server_url+'bodega/codigos/eliminar', formData)
        .then(res => {
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.modalConfirm = false
          me.tableData = []
          me.codigosPerdidos = true
          me.codigosConLibro = res.data.codigosConLibro
          me.codigosNoCambiados = res.data.codigosNoCambiados
          me.codigoNoExiste = res.data.codigoNoExiste
          me.porcentaje  = res.data.eliminados
          // me.codigosSinBarra = res.data.codigosSinBarra 
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
      if( !me.tableData[0].codigo){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.codigo){
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

<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {
  
  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #F17F76;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
