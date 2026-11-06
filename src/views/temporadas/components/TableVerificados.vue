<template>
  <div>
    <div v-if="arrayErroresValidacionCombos && arrayErroresValidacionCombos.length > 0" style="background:#fff3cd;color:#856404;padding:8px 16px;border-radius:6px;border:1px solid #ffeeba;margin-top:20px;">
      <b><i class="fa-solid fa-triangle-exclamation"></i> Hay combos con error</b>
    </div>
    <div v-if="desdePedido == 1" class="flex justify-start mt-5">
      <div v-if="setcobro_venta_directa == '0'">
        <p v-if="!userAsesor"  class="text-danger text-center">Cobro de venta directa no configurado <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span> </p>
      </div>
      <div v-if="setcobro_venta_directa == '1'">
        <p class="text-success text-center">Cobro venta directa 100%   <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span></p>
      </div>
      <div v-if="setcobro_venta_directa == '2'">
        <p class="text-success text-center">Cobro venta directa Comision %{{ sendPedido.descuento  }} de la escuela <span class="font-bold">(Tipo Pago: {{ titleTipoPago }})  </span></p>
      </div>
      <div v-if="setcobro_venta_directa == '3'">
        <p class="text-success text-center">% Descuento Personalizado</p>
      </div>
    </div>
    <div>
      <!--button de exportar-->
      <vs-button @click="exportarExcel" v-if="filtro == 1 || filtro == 2" class="mt-5" color="primary" icon="file_download">Exportar a Excel</vs-button>
    </div>
    <ul class="flex mt-5">
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="0">Todo <b>{{ sumaTodos }}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="1">Venta directa <b>{{ sumaVentaDirecta }}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="2">Venta lista <b>{{ sumaVentaLista}}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="3">Regalados <b>{{ sumaRegalados }}</b></vs-radio>
      </li>
      <li>
        <vs-radio v-model="filtro" @input="filtroCodigos();" class="mr-3" vs-name="radios1filtro" vs-value="4">Combos <b>{{ sumaCombos }}</b></vs-radio>
      </li>
    </ul>
    <div>
    <div>
      <vs-button color="success" class="p-2 mt-2" @click="popupMostrarCodigosIndividuales = true"><i class="fa-solid fa-cloud-arrow-down"></i> Códigos individuales</vs-button>
    </div>
      <vs-table max-items="10" search pagination :data="tmpCodigos" class="" stripe>
        <template slot="header">
          <vs-chip>Cantidad de filas: {{ tmpCodigos.length }}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th>Código Liquidación</vs-th>
            <vs-th>Cantidad</vs-th>
            <vs-th>Precio</vs-th>
            <vs-th>Valor</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].nombre_libro}}<br>
                    <div v-if="tr.plus">
                        <b>PLUS</b>
                    </div>
                </vs-td>
                <vs-td>
                    {{data[indextr].codigo}}<br>
                </vs-td>
                <vs-td>
                    {{tr.cantidad}}
                    <!-- <p><b v-if="tr.ifErrorCombo == 1" class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Faltan códigos en el combo</b></p> -->
                    <div v-if="tr.errorAgrupadoCombos && tr.errorAgrupadoCombos.length > 0" style="max-height:150px;overflow-y:auto;margin-top:4px;">
                      <div v-for="(err, idx) in tr.errorAgrupadoCombos" :key="idx" style="padding:2px 0;">
                        <span class="text-danger"><i class="fa-solid fa-circle-exclamation"></i> {{ err.error }}</span>
                        <br>
                        <small><b>Combo:</b> {{ err.codigoCombo }} | <b>Codigos:</b> {{ err.codigos_combos }}</small>
                        <vs-divider></vs-divider>
                      </div>
                    </div>
                </vs-td>
                <vs-td>
                {{tr.precio}}
                </vs-td>
                <vs-td>
                ${{ tr.valor | filtrarDecimal }}
                </vs-td>
                <vs-td>
                    <vs-button color="success" type="relief" @click="menu=0;ObjectSelected=tr;CodigoSelect=[];verCodigos(tr)" icon="code">Ver códigos</vs-button>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
    <!-- SECCION REGISTRO -->
    <vs-popup class="informacionformhijodehijo" fullscreen title="Ver codigos" @close="popupMostrarCodigos = false;arrayCombosHijos = [];" :active.sync="popupMostrarCodigos">
        <div v-if="popupMostrarCodigos">
          <b>Libro: {{ ObjectSelected.nombre_libro }}</b>
          <!--ACCIONES QUITAR CODIGOS-->
          <div class="flex justify-center mt-5">
            <vs-button color="danger" v-if="CodigoSelect.length > 0" @click="menu = 1;" type="border" icon-pack="feather" icon="icon-alert-triangle">Quitar <b>{{ CodigoSelect.length }} combos</b> de la verificación</vs-button>
          </div>
          <!--TABLA-->
          <div v-if="menu == 0">
            <vs-table max-items="5" stripe search pagination :data="arrayCombosHijos" multiple v-model="CodigoSelect">
              <template slot="header">
                  <vs-chip  color="primary">Cantidad: <b> {{ arrayCombosHijos.length }}</b></vs-chip>
              </template>
              <template slot="thead">
                  <vs-th>Combo</vs-th>
                  <vs-th>Combos items</vs-th>
                  <vs-th>Códigos</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                       {{ ObjectSelected.codigo_libro }}<br>
                       <b>Códigos del combo:</b>
                       <p>{{ ObjectSelected.codigos_combos }}</p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].codigo_combo}}<br>
                        <b>Cantidad:</b>
                        <p :style="tr.cantidad !== ObjectSelected.cantidad_combos ? 'color: red; font-weight: bold;' : ''">{{ tr.cantidad }} / {{ ObjectSelected.cantidad_combos }}</p>
                    </vs-td>
                    <vs-td>
                        <div v-for="(item, index) in data[indextr].codigosHijos" :key="index">
                            <b>Codigo:</b>
                            <p>{{ item.codigo_libro }}</p>
                            <b>Documento venta:</b>
                            <p>{{ item.codigo_proforma }}</p>
                            <b>Empresa Documento:</b>
                            <p>{{ item.descripcion_empresa || 'Sin empresa' }}</p>
                            <vs-divider></vs-divider>
                        </div>
                    </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
          <!--CONFIRMACION QUITAR CODIGOS-->
          <div v-if="menu == 1">
            <br>
            <small>Escriba una observación (Obligatorio)</small>
            <vs-input icon="icon-message-square" class="w-full mt-5" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
            <p class="mt-4"></p>
            <!--100 => codigos a devolver; 0 => cambiar a codigos normales; 1 => cambiar a codigos liquidados-->
            <ConfirmEliminarVue class="mt-5" @changeConfirm="eliminarCodigo" otroValor="1" :title="'Estás seguro de quitar '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo quitar"/>
          </div>
        </div>
    </vs-popup>
    <vs-popup class="informacionformhijodehijo" fullscreen :title="'Codigos individuales '+datosInstitucion.contrato" :active.sync="popupMostrarCodigosIndividuales">
      <div v-if="popupMostrarCodigosIndividuales">
        <TableVerificadosCodigosIndividualesVue 
          :arrayTodo="arrayTodo" 
          :VerificacionSelect="VerificacionSelect"
          :institucionData="{
            nombreInstitucion: datosInstitucion.nombreInstitucion,
            idInstitucion: datosInstitucion.idInstitucion,
            periodoDescripcion: datosInstitucion.periodo,
            periodo_id: datosInstitucion.id_periodo
          }"
        />
      </div>
    </vs-popup>

  </div>
</template>
<script>
import Generalmix from '../../../mixins/Generalmix';
import Combomix from '../../../mixins/Combomix';
import * as XLSX from 'xlsx';
const ConfirmEliminarVue = () => import('../../configuracion/Reutilizable/ConfirmEliminar.vue');
const TableVerificadosCodigosIndividualesVue = () => import('./TableVerificadosCodigosIndividuales.vue');
export default{
  mixins:[Generalmix, Combomix],
  components:{
    ConfirmEliminarVue,
    TableVerificadosCodigosIndividualesVue,
  },
  data(){
    return{
      usuario:[],
      userAsesor:false,
      titleTipoPago:'',
      tmpCodigos:[],
      filtro:0,
      ObjectSelected:'',
      arrayCombosHijos:[],
      popupMostrarCodigos: false,
      CodigoSelect: [],
      arrayHijosBuscarCombos: [],
      arregloFormatoSend: [],
      arrayAgrupadosCombos: [],
      arrayErroresValidacionCombos: [],
      popupMostrarCodigosIndividuales: false,
      menu:0,
      observacion:'',
    }
  },
  props:{
      verTipo:{
          type:Number,
          default:2
      },
      desdePedido:{
          type:Number,
          default:0
      },
      sendPedido:{
          type:Object,
          default:{}
      },
      setcobro_venta_directa:{
        type:Number,
        default:0
      },
      settipoPago:{
        type:Number,
        default:0,
      },
      datosInstitucion:{
        type:Object,
        default:function(){
          return {}
        }
      },
      arrayCodigosVerificacion:{
        type:Array,
        default:function(){
          return []
        }
      },
      arrayCombos:{
        type:Array,
        default:function(){
          return []
        }
      },
      VerificacionSelect:{
        type:Object,
        default:function(){
          return {}
        }
      },
      arrayTodo:{
        type:Array,
        default:function(){
          return []
        }
      },

    },
    watch:{
      setcobro_venta_directa(results){
        let me = this;
        me.setcobro_venta_directa = results
        me.setearWords()
      },
      settipoPago(results){
        let me = this
        me.settipoPago = results
        me.setearWords()
      },
      arrayCodigosVerificacion(results){
        let me = this
        me.arrayCodigosVerificacion = results
        me.filtroCodigos()
      }
    },
    created(){
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
      let me  =this
      console.log("usuario", me.usuario)
      if(me.usuario.id_group == 11) me.userAsesor = true
      me.filtroCodigos()
      me.setearWords()
    },
  computed:{
      //sumar la cantidad de todos los codigos
      sumaTodos() {
        let me = this;
        let resultado = 0;
        let sumaIndividuales = me.arrayCodigosVerificacion.length
        let sumaCombos       = me.arrayCombos.length
        resultado            = sumaIndividuales + sumaCombos
        return resultado;
      },
      //suma los que tiene venta directa
      sumaVentaDirecta(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.filter(x => x.venta_estado == '1' && x.estado_liquidacion == '0').length
        return resultado
      },
      //suma los que tiene venta lista
      sumaVentaLista(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.filter(x => x.venta_estado == '2' && x.estado_liquidacion == '0').length
        return resultado
      },
      //suma los que tiene regalados
      sumaRegalados(){
        let me        = this;
        let resultado = 0
        resultado = me.arrayCodigosVerificacion.filter(x => x.estado_liquidacion == 2).length
        return resultado
      },
      //sumar combos
      sumaCombos(){
        let me = this
        let resultado = this
        resultado     = me.arrayCombos.length
        return resultado
      }
    },
    methods:{
      setearWords(){
        let me = this;
        if(me.settipoPago  == 0) me.titleTipoPago = "Tipo pago no configurado"
        if(me.settipoPago  == 1) me.titleTipoPago = "Cancelar Total"
        if(me.settipoPago  == 2) me.titleTipoPago = "Descontar"
        if(me.settipoPago  == 3) me.titleTipoPago = "Regalado"
      },
      verCodigos(tr){
        let me = this;
        me.arrayCombosHijos = []
        if(tr.tipo_codigo == '1'){
          me.f_traerCodigosCombos(tr)
          return
        }
        let datos = {
          tipo:me.verTipo,
          filtro:me.filtro,
          data:tr
        }
        localStorage.setItem('objetoProducto',JSON.stringify(me.ObjectSelected))
        me.$emit('recharge',datos)
      },
      f_traerCodigosCombos(tr){
        let me = this;
        tr.hijos.forEach(element => {
          var cal = new Object()
          let getCodigosHijos       = me.arrayTodo.filter(p => p.codigo_combo == element.codigo_combo && p.combo == this.ObjectSelected.codigo_libro && p.tipo_codigo == '0')
          cal.codigo_combo          = element.codigo_combo;
          cal.cantidad              = element.cantidad;
          cal.codigosHijos          = getCodigosHijos
          me.arrayCombosHijos.push(cal)
        });
        me.popupMostrarCodigos = true;
      },
      filtroCodigos(){
        let me = this;
        me.tmpCodigos = []
        me.arrayHijosBuscarCombos = []
        me.arregloFormatoSend = []
        me.arrayAgrupadosCombos = []
        let datos     = []
        if(me.filtro == 0) datos = me.arrayCodigosVerificacion
        if(me.filtro == 1) datos = me.arrayCodigosVerificacion.filter(x => x.venta_estado == 1 && x.estado_liquidacion == 0)
        if(me.filtro == 2) datos = me.arrayCodigosVerificacion.filter(x => x.venta_estado == 2 && x.estado_liquidacion == 0)
        if(me.filtro == 3) datos = me.arrayCodigosVerificacion.filter(x => x.estado_liquidacion == 2)
        if(me.filtro == 4) datos = []
        //agrupar
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          const plus            = item.plus;
          const tipo_codigo     = item.tipo_codigo;
          const combo           = item.combo;
          const codigo_combo    = item.codigo_combo;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.tmpCodigos.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.tmpCodigos.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro ,cantidad: 1, plus ,tipo_codigo, combo, codigo_combo });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
        me.tmpCodigos.map((item) => {
          item.valor        = item.precio * item.cantidad
        });
        //mostrar en filtro todos y combos
        if(me.filtro == 0 || me.filtro == 4){
          //unir arrayCombos  a tmpCodigos
          me.tmpCodigos = [...me.tmpCodigos,...me.arrayCombos]
        }
        // asegurar que todos tengan errorAgrupadoCombos como array
        me.tmpCodigos.forEach(item => {
          if (!Array.isArray(item.errorAgrupadoCombos)) item.errorAgrupadoCombos = [];
        });
        // Validar errores en combos
        me.tmpCodigos.forEach(item => {
          if (item.tipo_codigo === 1 && Array.isArray(item.hijos) && item.hijos.length > 0) {
            const cantidadCombos = item.cantidad_combos;
            const hayError = item.hijos.some(hijo => hijo.cantidad !== cantidadCombos);
            item.ifErrorCombo = hayError ? 1 : 0;
          } else {
            item.ifErrorCombo = 0; // No es combo o no aplica
          }
        });
        // traer los hijos de los combos etiquetas
        let TodosCombos = me.tmpCodigos.filter(p => p.tipo_codigo === 1);
        me.arrayHijosBuscarCombos = TodosCombos.flatMap(obj => obj.hijos || []);
        if(me.arrayHijosBuscarCombos.length > 0){
          me.f_busquedaLibrosCombo()
        }
      },
      f_busquedaLibrosCombo(){
        let me = this
        let formData = new FormData()
        let codigosSolo = me.arrayHijosBuscarCombos.map(item => ({
          codigo: item.codigo_combo
        }));
        formData.append('data_codigos',             JSON.stringify(codigosSolo));
        formData.append('getPrevisualizarPaquetes', '1')
        formData.append('mostrarCombos',            '1')
        formData.append('agrupadoCombos',           '1')
        formData.append('mostrarSoloCodigos',       '1')
        formData.append('contrato',                 me.datosInstitucion.contrato)
         me.$http.post(me.$server_url+'metodosPostCodigos', formData)
        .then(res => {
          if(res.data.status == 0){
            me.m_message(res.data.message)
            return
          }
          let  arrayCodigosCombos = me.tmpCodigos.filter(p => p.tipo_codigo == 1)
          if(arrayCodigosCombos.length == 0) return
          let comboAgrupados = res.data.arrayAgrupadosCombos || [];
          const resultado = me.m_validateComboHijos(comboAgrupados, me.tmpCodigos.filter(p => p.tipo_codigo == 1),me.datosInstitucion.contrato);
          me.arrayErroresValidacionCombos = resultado.arrayErroresValidacionCombos;
          console.log("arrayErroresValidacionCombos", me.arrayErroresValidacionCombos)
          me.arrayAgrupadosCombos = resultado.arrayAgrupadosCombos;
          //si hay errores en combos agregar al tmpCodigos como propiedad errorAgrupadoCombos
          if (me.arrayErroresValidacionCombos.length > 0) {
            me.tmpCodigos.forEach(item => {
              item.errorAgrupadoCombos = me.arrayErroresValidacionCombos.filter(error => error.combo === item.codigo) || [];
            });
            console.log("tmpCodigos con errores", me.tmpCodigos)
              me.$forceUpdate();
          }

        })
        .catch(error => {
          console.log(error)
          me.$vs.loading.close()
          me.m_message("Ocurrio un error al agrupar los codigos"+error,'danger')
        })
      },
      //metodos para quitar combos
      eliminarCodigo(valor){
        let me = this
        if(valor == 0) { this.menu = 0; return }
        me.MandarToLiquidadoDevuelto()
      },
      MandarToLiquidadoDevuelto(){
        let me = this
        if(me.observacion == '' || me.observacion == null || me.observacion == undefined){
          me.$vs.loading.close()
          me.$vs.notify({ text:'Ingrese un comentario.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
        }
        // quitar trim
        me.observacion = me.observacion.trim()
        if(me.observacion.length < 5){
          me.$vs.loading.close()
          me.$vs.notify({ text:'El comentario debe tener al menos 5 caracteres.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
        }
        me.filtroLibro                                = me.CodigoSelect[0]
        let mensaje                                   = ""
        mensaje = "Devolucion Liquidacion_por_combo_";
        let arraySend = []
        //obtener los codigosHijos para enviar
        me.CodigoSelect.forEach(element => {
          arraySend.push(element.codigosHijos)
        });
        //colocar un flat para unir todos los codigos hijos
        arraySend = arraySend.flat()
        if(arraySend.length == 0){
          me.$vs.notify({ text:'No hay códigos seleccionados.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
        }
        let arrayFormatoSend = []
        arraySend.forEach(item => {
          let obj = {
            codigo: item.codigo_libro,
            contrato: item.contrato,
            verificacion :item.verificacion,
          }
          arrayFormatoSend.push(obj)
        });
        let formData = new FormData()
        formData.append('arrayCodigos',               JSON.stringify(arrayFormatoSend))
        formData.append('observacion',                mensaje+me.observacion)
        formData.append('id_usuario',                 me.usuario.idusuario)
        formData.append('periodo_id',                 me.sendPedido.id_periodo)
        formData.append('institucion_id',             me.sendPedido.id_institucion)
        formData.append('byCombo',                    1)
        formData.append('mandarDevueltoRegalado',     1)
        me.$http.post(me.$server_url+'procesosFacturador', formData)
        .then(function (res) {
          if(res.data.status == 0){
            me.$vs.notify({
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          let titleMensaje = ""
          titleMensaje = `Se han quitado ${res.data.cambiados} códigos de verificación`;
          me.$vs.notify({
            text: titleMensaje,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.menu         = 0
          me.CodigoSelect = []
          me.popupMostrarCodigos = false
          me.arrayCombosHijos = []
          me.observacion  = ''
          let datos = {
            tipo: 8,
          }
          me.$emit('recharge',datos)
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.notify({
            text: 'Error al quitar códigos de verificación',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
      },
      //METODOS PARA EXPORTAR a EXCEL
      exportarExcel(){
        let me = this;
        let data = []
        let datos = me.tmpCodigos
        datos.forEach(item => {
          data.push({
            'PRODUCTO': item.codigo,
            'NOMBRE': item.nombre_libro,
            'CANT. VERIF.': item.cantidad,
            'VAL. UNIT.': item.precio,
            'VALOR': item.valor
          })
        });
        me.exportarExcelData(data)
      },
      exportarExcelData(data) {
        let me = this;
        let TypeVenta = ""
        if(me.filtro == 1) { TypeVenta = "Venta Directa" }
        if(me.filtro == 2) { TypeVenta = "Venta Lista" }
        let nombreArchivo = "Verificacion "+me.datosInstitucion.contrato+TypeVenta+".xlsx"
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
        XLSX.writeFile(wb, nombreArchivo);
      },
    }
}
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
