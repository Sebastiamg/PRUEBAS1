<template>
  <div>
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
         <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
                <b>Código</b>
            </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in errores">
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.codigo"> {{item.codigo}} </span>
              </div>
          </div>
        </div>
       </div>
    </vs-popup>
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
        <h4>Está seguro de aplicar estos {{ tableData.length }} códigos?</h4>
        <p>
          <!--afectacion a la tabla codigo o tabla codigos_son-->
          <b v-if="ifPermitirCodigosSon == 1">
            <span class="text-danger">Esta asignación afectará a la tabla de devoluciones</span>
          </b>
          <b v-if="ifPermitirCodigosSon == 0">
            <span class="text-danger">Esta asignación afectará a la tabla de códigos</span>
          </b>
        </p>
        <div v-if="permitirRemplazarCombo == 1">
          <p><b>Permitir reemplazar combo del libro:</b> Si</p>
        </div>
        <div v-if="permitirRemplazarCombo == 0">
          <p><b>Permitir reemplazar combo del libro:</b> No</p>
        </div>
        <div v-if="permitirReemplazarEtiqueta== 1">
          <p><b>Permitir reemplazar etiqueta del libro:</b> Si</p>
        </div>
        <div v-if="permitirReemplazarEtiqueta== 0">
          <p><b>Permitir reemplazar etiqueta del libro:</b> No</p>
        </div>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div>
      <p class="mt-2">
        <b>Nota.</b> Esta importación trata de asignar combos a los códigos <b> (No ingrese mas de 1500 códigos - SOLO SUBIR CÓDIGOS INDIVIDUALES) </b>
      </p>
      <div  class="mt-5">
        <ul class="flex">
          <li class="mr-5">
            <vs-radio v-model="ifPermitirCodigosSon" vs-name="radios1ifPermitirCodigosSon" vs-value="0">Asignación a los tabla códigos</vs-radio>
          </li>
          <li class="mr-5" v-if="userRoot">
            <vs-radio v-model="ifPermitirCodigosSon" vs-name="radios1ifPermitirCodigosSon" vs-value="1">Asignación a la tabla de devoluciones <b>(Solo a los códigos de la tabla codigoslibros_son que este en estado creado)</b></vs-radio>
          </li>
        </ul>
      </div>
      <!---PERMISOS-->
      <div>
        <ul class="flex mt-5">
          <li>
            <label for="">Permitir reemplazar combo del libro</label>
            <vs-switch v-model="permitirRemplazarCombo"/>
          </li>
           <li class="ml-5">
            <label for="">Permitir reemplazar etiqueta del combo</label>
            <vs-switch v-model="permitirReemplazarEtiqueta"/>
          </li>
        </ul>
      </div>
      <div class="mb-6 mt-5" align="center">
         <!--Input para observacion-->
         <vs-input v-model="observacion" v-if="ifPermitirCodigosSon == 0" class="w-full mt-4" label="Comentario" />
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
                          <th class="th1">combo</th>
                          <th class="th1">combo_etiqueta</th>
                        </tr>
                        <tr>
                          <td class="td1">xxx</td>
                          <td class="td1">xxx</td>
                          <td class="td1">xxx</td>
                        </tr>
                    </table>
                  </div>
                </vs-card>
              </vs-col>
            </vs-row>
        </div>
        <!-- {{tableData}} -->
        <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
            <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
        </vs-alert>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 ">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)"> Importar códigos  </vs-button>
            </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-alert active="true">
                    Se asigno  {{ porcentaje }} códigos un combo
                </vs-alert>
            </vs-col>
        </vs-row>
      </div>
    </div>
    <div>
      <ul>
        <li v-if="CodigosNoEncontrados.length > 0">
          <vs-checkbox  v-model="checkMostrarCodigosNoEncontrados" class="mt-4" vs-label="Mostrar resultados" color="success" vs-type="border">
            Mostrar <b>{{ CodigosNoEncontrados.length }} </b> No encontrados en el archivo de excel
          </vs-checkbox>
        </li>
        <li v-if="codigosConProblemas.length > 0">
          <vs-checkbox  v-model="checkMostrarCodigosProblemas" class="mt-4" vs-label="Mostrar resultados" color="success" vs-type="border">
            Mostrar <b>{{ codigosConProblemas.length }} </b>
            <p v-if="ifPermitirCodigosSon == 0">códigos que no existen</p>
            <p v-if="ifPermitirCodigosSon == 1">códigos que no existen en la tabla devoluciones</p>
          </vs-checkbox>
        </li>
      </ul>
    </div>
    <div v-if="checkMostrarCodigosNoEncontrados && CodigosNoEncontrados.length > 0">
      <TableReutilizableVue
      :title="'Códigos no encontrados'"
      :headers="['Código']"
      :fieldKeys="['codigo']"
      :tableData="CodigosNoEncontrados"
      />
    </div>
    <div v-if="checkMostrarCodigosProblemas && codigosConProblemas.length > 0">
      <TableReutilizableVue
      :title="'Combos no existe'"
      :headers="['Código','Combo','Error']"
      :fieldKeys="['codigo','combo','error']"
      :ifexportar="Number(1)"
      :tableData="codigosConProblemas"
      />
    </div>
    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="10" search :data="tableData">
        <template slot="header">
          <h4>Códigos a subir {{tableData.length}}</h4>
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
    <!--MODALES-->
    <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupResultados">
      <div v-if="popupResultados">
          <p class="text-center"><b>Códigos asignados: </b>{{ porcentaje }}</p>
      </div>
      <vs-card>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="CodigosNoEncontrados.length > 0">
          <vs-list>
          <p>Cantidad <span>{{ CodigosNoEncontrados.length }}</span></p>
              <vs-list-header icon="supervisor_account" title="Códigos que no encontrados"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in CodigosNoEncontrados" icon="check" :title="tr.codigo" >
              </vs-list-item>
          </vs-list>
          </vs-col>
      </vs-card>
      <div class="flex justify-center mt-3">
          <vs-button @click="popupResultados = false">Aceptar</vs-button>
      </div>
  </vs-popup>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
import Generalmix from "../../../../../mixins/Generalmix";
import gestionCodigosListaVue from "../../../components/utils/gestionCodigosLista.vue";
import TableRadiosCodigosListaVue from "../../../components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue";
import vSelect from 'vue-select'
import ImportExcel from "../../../components/importExcel.vue";
const TableReutilizableVue              = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
  mixins:[Generalmix],
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosListaVue,
    TableRadiosCodigosListaVue,
    TableReutilizableVue,
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
      venta_estado:0,
      cedulas_no_encontradas: [],
      modalCedulas: false,
      codigosLeidos:[],
      codigosNoCambiados:[],
      porcentaje:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      nombrePeriodo:'',
      institucion_id:'',
      radioRegalado:'0',
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      CodigosNoEncontrados:[],
      checkMostrarCodigosNoEncontrados:false,
      popupResultados:false,
      codigosConProblemas:[],
      checkMostrarCodigosProblemas:false,
      ifPermitirCodigosSon:0,
      observacion:'',
      permitirReemplazarEtiqueta:false,
      permitirRemplazarCombo:false,
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','userAsesor']),
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos      = false
      this.header               = header
      this.tableData            = results
      this.sheetName            = meta.sheetName
      this.CodigosNoEncontrados = [ ]
      this.codigosConProblemas  = []
    },
    procesarPagos(){
        let me = this
        if(me.ifPermitirCodigosSon == 0){
          // trim a observacion
          me.observacion = me.observacion.trim()
          if(me.observacion == ''){
            me.m_message('Debe ingresar una observación','warning')
            me.modalConfirm = false
            return
          }
        }
        me.checkMostrarCodigosProblemas = false
        me.checkMostrarCodigosNoEncontrados = false
        me.$vs.loading()
        let sendEnviar  = me.tableData
        //convertir a mayusculas las columnas codigo y combo
        sendEnviar.forEach((obj) => {
          obj.codigo = obj.codigo.toUpperCase();
          obj.combo = obj.combo.toUpperCase();
          obj.combo_etiqueta = obj.combo_etiqueta.toUpperCase();
        });
        let json_pagos = JSON.stringify(sendEnviar)
        let formData = new FormData();
        formData.append('data_codigos',                     json_pagos);
        formData.append('id_usuario',                       me.usuario.idusuario);
        formData.append('periodo_id',                       localStorage.periodo_id);
        formData.append('permitirRemplazarCombo',           me.permitirRemplazarCombo ? 1 : 0);
        formData.append('permitirReemplazarEtiqueta',       me.permitirReemplazarEtiqueta ? 1 : 0);
        formData.append('observacion',                      me.observacion);
        if(me.ifPermitirCodigosSon == 1)                    { formData.append('AsignarComboCodigosLibrosSon',     '1'); }
        if(me.ifPermitirCodigosSon == 0)                    { formData.append('AsignarCombo',     '0'); }
        this.$http.post(this.$server_url+'combos', formData)
        .then(res => {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
          }
          me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.modalConfirm                     = false
          me.tableData                        = []
          me.codigosPerdidos                  = true
          me.checkMostrarCodigosNoEncontrados = true
          me.checkMostrarCodigosProblemas     = true
          me.CodigosNoEncontrados             = res.data.codigoNoExiste
          if (me.CodigosNoEncontrados.length > 0) {
            me.CodigosNoEncontrados           = me.CodigosNoEncontrados.map((codigo) => ({
              original: codigo,
              codigo: codigo.toUpperCase(),
            }));
          }
          me.codigosConProblemas             = res.data.codigosConProblemas
          me.porcentaje                      = res.data.cambiados
          me.popupResultados                 = true
        })
        .catch(function (error) {
          console.log(error)
          me.$vs.notify({
          text:'Verifique que la información se haya guardado correctamente.',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'})
          me.$vs.loading.close()
        })
    },
    openConfirm(tipo) {
      let me = this
      me.tipo_selected = tipo

      // Validar campos obligatorios
      const errores = me.tableData.filter(item =>
        !item.codigo || !item.combo || !item.combo_etiqueta
      )

      if (errores.length > 0) {
        me.$vs.loading.close()
        me.$vs.notify({
          text: 'Corrija el formato del Excel. Todos los campos (código, combo y etiqueta) son obligatorios.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      // Validar códigos que no deben empezar por "paq-" o "cmb"
      const contieneCodigosNoPermitidos = me.tableData.some(item => {
        const codigo = (item.codigo || '').toLowerCase()
        return codigo.startsWith('paq-') || codigo.startsWith('cmb')
      })

      if (contieneCodigosNoPermitidos) {
        me.$vs.notify({
          text: 'El archivo contiene códigos no permitidos (paquetes o combos). Suba solo códigos individuales.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 6000
        })
        me.tableData = []
        return
      }

      // Si todo está bien, validar por errores visibles en modal
      me.errores = me.tableData.filter(item => !item.codigo)

      if (me.errores.length > 0) {
        me.modalErrores = true
      } else {
        me.modalConfirm = true
      }
    },
    recargar(){
      location.reload()
    },
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
  background-color: #2D9ADA;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
