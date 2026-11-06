<template>
  <div>
    <div>
      <vx-card v-if="menu == 0"
      :title="'Agregar combos del cliente '+institucion_select"
      :subtitle="'Periodo: '+nombrePeriodo"
      >
        <br>
        <p class="mt-5 text-center font-bold">Combos asignados para devolver</p>
        <!--tabla de combos asignados-->
        <vs-table max-items="5" stripe search pagination :data="arrayCombosAsignados" class="">
          <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arrayCombosAsignados.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Combo</vs-th>
              <vs-th>Cantidad Facturada</vs-th>
              <vs-th>Devueltos en el documento de devolución</vs-th>
              <!-- <vs-th>Devolución Actual</vs-th> -->
              <vs-th>Cantidad Disponible a devolver</vs-th>
              <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                      {{data[indextr].pro_codigo}}<br>
                      <b>Pre factura:</b>
                      <p>{{data[indextr].documento}}</p>
                      <b>Empresa:</b>
                      <p>{{data[indextr].empresa}}</p>
                      <b>Libro:</b>
                      <p>{{data[indextr].nombrelibro}}</p>
                      <b>Libros del combo</b>
                      <p>{{tr.codigos_combos}}</p>
                  </vs-td>
                  <vs-td>
                    <p>{{ tr.det_ven_cantidad }}</p>
                  </vs-td>
                  <vs-td>
                    <b>total de combos:</b>
                    <!-- <p>{{  tr.det_ven_dev }}</p> -->
                    <p>{{ tr.combo_cantidad_devuelta }}</p>
                    <b>Total de libros:</b>
                    <p>{{  tr.totalLibrosCombosGeneral }}</p>
                  </vs-td>
                  <!-- <vs-td>
                    <b>total de combos:</b>
                    <p>{{  tr.combo_cantidad_devuelta }}</p>
                    <b>Total de libros:</b>
                    <p>{{  tr.totalLibrosCombosDevueltos }}</p>
                  </vs-td> -->
                  <vs-td>
                    <small><b>Cantidad a devolver:</b></small>
                    <vs-input  v-model="tr.combo_cantidad" disabled @input="f_validarInputCantidad(tr)" @blur="f_validarInputCantidad(tr);fvalidarCantidadBlur(tr);" class="w-full mt-2" type="number"/>
                    <p class="mt-3"> <b>Cantidad disponible en el documento de venta: </b> {{ tr.combo_cantidad_disponible }}</p>
                  </vs-td>
                  <vs-td>
                    <!--boton ver combos etiquetas-->
                    <vs-button @click="ObjectedSelectedCombo=tr;popupMostrarDetalle = true">
                      ℹ️ Ver combos etiquetas
                    </vs-button>
                    <!--boton de quitar-->
                    <!-- <vs-button color="danger" @click="f_eliminarCombo(tr)" v-if="tr.combo_cantidad_devuelta == 0">
                      <i class="fa-solid fa-trash"></i> Quitar
                    </vs-button> -->
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
        <div v-if="ObjectSelected.estado !=2">
          <!--boton para guardar combos-->
          <div v-if="ObjectSelected.combo_estado == 0 && ObjectSelected.importacion_con_combos == 1">
            <vs-button color="primary" class="w-full mt-5" icon="save" @click="openConfirmGuardar()">Aceptar combos</vs-button>
          </div>
          <div v-else>
            <vs-button color="primary" class="w-full mt-5" icon="save" @click="openConfirmGuardar()">Guardar combos</vs-button>
          </div>
        </div>
        <br><br><br><br><br><br><br><br><br><br>
      </vx-card>
      <vx-card v-if="menu == 1">
        <div class="flex justify-center">
          <vs-button @click="menu = 0">
            <i class="fa-solid fa-arrow-left"></i> Volver
          </vs-button>
        </div>
        <div class="flex justify-center">
          <vs-alert color="warning" class="mt-5">
            <template #title>
              <b>Atención: Devolución de Kits</b>
            </template>
            <p class="text-center">Se devolverá el stock a cada <b>libro individual del combo</b> debido a que ahora se maneja por <b>kits</b></p>
          </vs-alert>
        </div>
        <div class="flex justify-center">
          <vs-button color="danger" class="mt-5" @click="f_guardarTodosCombos()">
            <i class="fa-solid fa-edit"></i> Si deseo realizar la devolución de  {{ arrayCombosAsignados.filter(p => p.combo_cantidad > 0).length }} combos
          </vs-button>
        </div>
      </vx-card>
    </div>
    <!--modales-->
    <vs-popup classContent="popup-example" fullscreen title="Mostrar Detalle del combo" :active.sync="popupMostrarDetalle" class="popupHijo">
      <div v-if="popupMostrarDetalle">
        <DevolucionAgregarCombosDetalleVue
        :ObjectedSelectedCombo="ObjectedSelectedCombo"
        :ObjectSelected="ObjectSelected"
        @updateQuitarComboEtiqueta="updateQuitarComboEtiqueta"
        />
      </div>
    </vs-popup>
    <vs-popup classContent="popup-example" title="Errores en los combos" :active.sync="popupErroresCombos">

        <div v-if="popupErroresCombos">
            <TableReutilizableVue :title=" ' Combos con problemas al asignar ' "
             :headers="['Combo','Mensaje']"
             :fieldKeys="['combo','mensajeError']"
             :ifexportar="Number(1)"
             :tableData="arrayErroresCombos"
              />
        </div>

        <div class="flex justify-center mt-3">
            <vs-button @click="popupErroresCombos = false">Aceptar</vs-button>
        </div>
    </vs-popup>
  </div>
</template>
<script>
import Generalmix from '../../../../../mixins/Generalmix';
const DevolucionAgregarCombosDetalleVue = () => import('./DevolucionAgregarCombosDetalle.vue');
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
import vSelect from 'vue-select'
export default {
  mixins:[Generalmix],
  components: {
    vSelect,
    DevolucionAgregarCombosDetalleVue,
    TableReutilizableVue
  },
  data() {
    return{
      usuario:[],
      arrayPrefacturas:[],
      proforma:{
        empresa:'',
        proforma:''
      },
      arrayCombos:[],
      arrayCombosAsignados:[],
      comboSelected:'',
      cantidadAdd:0,
      menu:0,
      ObjectedSelectedCombo:null,
      popupMostrarDetalle:false,
      arrayErroresCombos:[],
      popupErroresCombos:false,
    }
  },
  props:{
    ObjectSelected:{
      type: Object,
      required: true,
      default: () => {}
    },
    institucion_id_select:{
      type: Number,
      required: true,
      default: 0
    },
    institucion_select:{
      type: String,
      required: true,
      default: ''
    },
    periodoSelected:{
      type:Number,
      required: true,
      default: 0
    },
    nombrePeriodo:{
      type:String,
      required: true,
      default: ''
    }
  },
  created(){
    let me = this
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    let me = this
    me.generateCombos()
  },
  methods:{
    updateQuitarComboEtiqueta(){
      let me = this
      me.popupMostrarDetalle = false
      me.generateCombos()
    },
    generateCombos(){
      let me = this
      me.arrayErroresCombos = []
      let url = `devoluciones?generateCombos=1&id_devolucion=${ me.ObjectSelected.id }`
      this.$http.get(this.$server_url + url)
      .then(function (res) {
        //si ya finalizo la devolucion no permitir generar combos
        if(res.data.status == 2){
          me.f_getListadoCombosAsignados()
          return;
        }
        if(res.data.noDisponibles.length > 0){
          me.arrayErroresCombos = res.data.noDisponibles
          me.popupErroresCombos = true
        }
        if(res.data.status == 0){
          me.m_message(res.data.message,'warning')
          return false;
        }
        me.f_getListadoCombosAsignados()
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    openConfirmGuardar(){
      let me = this;
      ///debe exitir al menos un valor combo_cantidad > 0 de mi arrayCombosAsignados
      if(me.arrayCombosAsignados.filter(p => p.combo_cantidad > 0).length == 0){
        me.$vs.notify({
        text:'Debe seleccionar al menos un valor de combos a devolver',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      //tr.combo_cantidad > tr.combo_cantidad_disponible
      //validar que la combo_cantidad no puede ser mayor a combo_cantidad_disponible
      const existeError = me.arrayCombosAsignados.some(p => {
        if (p.combo_cantidad > p.combo_cantidad_disponible) {
          me.m_message('La cantidad de combos a devolver no puede ser mayor a la cantidad disponible', 'danger');
          return true; // Detiene la iteración
        }
        return false;
      });

      if (!existeError) {
        me.menu = 1;
      }
    },
    f_guardarTodosCombos(){
      let me = this;
      //api post
      let formatData  = new FormData();
      formatData.append('guardarDevolucionCombos',    1);
      formatData.append('id_devolucion',              me.ObjectSelected.id);
      formatData.append('id_usuario',                 me.usuario.idusuario);
      //arrayCombos
      //solo enviar combos con combo_cantidad > 0
      let sendEnviarCombos = me.arrayCombosAsignados.filter(p => p.combo_cantidad > 0)
      formatData.append('arrayCombos',                JSON.stringify(sendEnviarCombos));
      this.$http.post(this.$server_url+'devoluciones',formatData)
      .then(function (res) {
        if(res.data.status == 0){
          me.m_message(res.data.message,'warning')
          return false;
        }
        me.ObjectSelected.combo_estado = 1
        me.m_message('Se devolvieron los combos correctamente','success')
        me.f_getListadoCombosAsignados()
        me.menu = 0
        me.$emit('changeRecharge',true)
      })
      .catch(function (error) {
          me.m_message('Error al devolver los combos','danger')
          console.log(error + ' error');
      })
    },
    f_guardarCombosAsignados(){
      let me = this;
      //solo puede ser numeros
      if(isNaN(me.cantidadAdd)){
        me.m_message('La cantidad solo puede ser numeros','warning')
        return false;
      }
      if(me.comboSelected.pro_codigo == "" || me.comboSelected.pro_codigo == null || me.comboSelected.pro_codigo == undefined){
        me.m_message('Debe seleccionar una combo por favor','warning')
        return false;
      }
      let formatData  = new FormData();
      formatData.append('guardarComboDocumento',  1);
      formatData.append('id_devolucion',          me.ObjectSelected.id);
      formatData.append('pro_codigo',             me.comboSelected.pro_codigo);
      formatData.append('cantidad',               me.cantidadAdd);
      formatData.append('id_cliente',             me.ObjectSelected.id_cliente);
      formatData.append('id_empresa',             me.comboSelected.id_empresa);
      formatData.append('documento',              me.comboSelected.ven_codigo);
      formatData.append('id_periodo',             me.periodoSelected);
      formatData.append('id_libro',               me.comboSelected.idLibro);
      formatData.append('precio',                 me.comboSelected.det_ven_valor_u);
      this.$http.post(this.$server_url+'devoluciones',formatData)
      .then(function (res) {
        if(res.data.status == 0){
          me.m_message(res.data.message,'warning')
          return false;
        }
        me.f_getListadoCombosAsignados()
        me.m_message('Se guardaron los combos asignados','success')

      })
      .catch(function (error) {
          me.m_message('Error al guardar combos asignados','danger')
          console.log(error + ' error');
      })
    },
    f_eliminarCombo(tr){
      let me = this;
      //api post
      let formatData  = new FormData();
      formatData.append('eliminarItemDevolucion',  1);
      formatData.append('id_documento',           tr.codigoslibros_devolucion_id);
      formatData.append('id_documento_son',       tr.id);
      me.$http.post(this.$server_url+'metodosEliminarDevolucion',formatData)
      .then(function (res) {
        if(res.data.status == 0){
          me.m_message(res.data.message,'warning')
          return false;
        }
        me.f_getListadoCombosAsignados()
        me.m_message('Se eliminaron el combos ','success')
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_traerCombos(){
      let me = this;
      if(me.proforma.empresa == "" || me.proforma.empresa == null || me.proforma.empresa == undefined){
        me.m_message('Debe seleccionar una empresa por favor','warning')
        return false;
      }
      if(me.proforma.proforma == "" || me.proforma.proforma == null || me.proforma.proforma == undefined){
        me.m_message('Debe seleccionar una pre factura por favor','warning')
        return false;
      }
      var url = `devoluciones?getDetalleVentaXPrefactura=1&ven_codigo=${ me.proforma.proforma }&empresa=${ me.proforma.empresa }&institucion=${me.institucion_id_select}`
      this.$http.get(this.$server_url+url)
      .then(function (res) {
        let datos = res.data.filter(p => p.ifcombo == 1)
        if(datos.length == 0){
          me.m_message('No hay  se encontro combos en la pre factura '+me.proforma.proforma+' de la institucion '+me.institucion_select,'warning')
          return false
        }
        me.arrayCombos = datos
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_getListadoCombosAsignados(){
      let me = this;
      var url = `devoluciones?getCodigosCombosDocumentoDevolucion=1&id_documento=${me.ObjectSelected.id}`
      this.$http.get(this.$server_url+url)
      .then(function (res) {
        me.arrayCombosAsignados = res.data
        //lo dispoible restando lo facturado - lo devuelto
        me.arrayCombosAsignados.forEach(p => {
          p.combo_cantidad_disponible = p.det_ven_cantidad - p.det_ven_dev
          //split de codigos_combos para obtener la cantidad de cada combo
          let totalLibros =  p.codigos_combos.split(',')
          p.totalLibros = totalLibros.length
        })
        //multiplicar combo_cantidad_devuelta * totalLibros
        me.arrayCombosAsignados.forEach(p => {
          p.totalLibrosCombosDevueltos = p.combo_cantidad_devuelta * p.totalLibros
          // p.totalLibrosCombosGeneral   = p.det_ven_dev * p.totalLibros
          p.totalLibrosCombosGeneral   = p.combo_cantidad_devuelta * p.totalLibros
        })
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_validarInputCantidad(tr){
      let me = this;
      if(isNaN(tr.combo_cantidad)){
        me.m_message('La cantidad solo puede ser numeros','warning')
        return false;
      }
      //si es mayor a la cantidad disponible
      if(tr.combo_cantidad > tr.combo_cantidad_disponible){
        me.m_message('La cantidad no puede ser mayor a la cantidad disponible','warning')
        tr.combo_cantidad = tr.combo_cantidad_disponible
        return false;
      }
      //si es menor a cero
      if(tr.combo_cantidad < 0){
        me.m_message('La cantidad no puede ser menor a cero','warning')
        tr.combo_cantidad = 0
        return false;
      }
    },
    fvalidarCantidadBlur(tr){
      let me = this;
      //si deja vacio colocar cero
      if(tr.combo_cantidad == "" || tr.combo_cantidad == null || tr.combo_cantidad == undefined){
        tr.combo_cantidad = 0
      }
    },
  }
}
</script>
<style scoped>
.popupHijo{
  z-index: 51002;
}
</style>
