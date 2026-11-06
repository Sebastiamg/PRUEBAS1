<template>
    <div>
      <b>Documento Acta:</b>
      <p>{{ ObjectedSelected.ven_codigo }}</p>
      <div>
        <ul class="con-s" v-if="!verResumen && ObjectedSelected.estado_entrega != '3' && ifMostrarSwitchStock">
          <li class="flex">
            <label for="" class="font-bold mt-2">Aprobar sin stock</label>
            <vs-switch v-model="ifAprobarSinStock" @input="changeAprobar" class="mt-2 ml-2" color="primary"></vs-switch>
          </li>
        </ul>
      </div>
      <pre>
      </pre>
      <vs-table max-items="10" search pagination :data="arrayGuias">
        <template slot="header">
            <vs-chip color="primary" class="mr-2">
                Cantidad: <b>{{ arrayGuias.length }}</b>
            </vs-chip>
            <vs-checkbox v-model="filtroNegativo" label="" @input="filtroValores">Mostrar solo libros con falta de stock</vs-checkbox>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th>Stock actual bodega</vs-th>
            <vs-th>Cantidad solicitada</vs-th>
            <vs-th>Cantidad aprobada</vs-th>
            <vs-th>Cantidad pendiente</vs-th>
            <vs-th v-if="ObjectedSelected.estado_entrega == '3'">Cantidad autorizar</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr
                v-for="(tr, indextr) in data"
                :key="indextr" :state="getRowState(tr)">
                <vs-td>
                    {{tr.nombrelibro}}<br>
                    <p><b>Código: </b>{{ tr.codigoFact }}</p>
                </vs-td>
                <vs-td>
                    {{tr.stockAnterior}}<br>
                    <p v-if="tr.nuevoStock < 0" class="text-danger font-bold">Falta stock</p>
                </vs-td>
                <vs-td>
                    {{tr.valorNew}}<br>
                </vs-td>
                <vs-td>
                    <div v-if="ObjectedSelected.estado_entrega == '0'">
                        0
                    </div>
                    <div v-else>
                        {{ tr.valorNew - tr.cantidad_pendiente }}
                    </div>
                </vs-td>
                <vs-td>
                    {{ tr.cantidad_pendiente }}
                </vs-td>
                <vs-td v-if="ObjectedSelected.estado_entrega == '3'">
                    <vs-input  v-model="tr.cantidadAutorizar" @input="f_revisarCantidadAutorizar(tr)" @blur="f_blurCantidadAutorizar(tr)" type="number"  />
                    <p><b>Cantidad disponible:</b> {{ tr.cantidad_disponible }}</p>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <div class="flex justify-center" v-if="ObjectedSelected.estado_entrega == '3'">
        <!--BOTON PARA GUARDAR PENDIENTES-->
        <vs-button color="primary" icon="save" @click="f_guardarCantidadAutorizar()" class="mt-5">Aprobar {{ sumarAutorizados }} libros Pendientes</vs-button>
      </div>
    </div>
</template>

<script>
import Generalmix from '../../../../mixins/Generalmix';
  export default {
    mixins: [Generalmix],
      data() {
          return {
              filtroNegativo: false, // Estado del filtro de stock negativo,
              ifAprobarSinStock:false,
              arrayGuias:[{
                id: 0,
                nombrelibro: "",
                stockAnterior: 0,
                valorNew: 0,
                nuevoStock: 0,
                codigoFact: "",
                codigo: "",
                cantidad_pendiente: 0,
                cantidadAutorizar: 0,
                cantidad_descontar: 0,
                cantidad_disponible: 0
              }],
              arraySend:[],
              arrayGuiasOrginal:[],
              ifMostrarSwitchStock:false,
          };
      },
      props: {
        arregloStock: {
              type: Array,
              default: () => [],
          },
          ObjectedSelected:{
            type: Object,
            default: () => {},
          },
          verResumen:{
            type: Boolean,
            default: false,
          }
      },
      computed: {
        sumarAutorizados(){
          let me = this
          let autorizados = 0
          autorizados = me.arrayGuiasOrginal.filter(item => item.cantidadAutorizar > 0).length
          return autorizados
        }
      },
      mounted(){
        let me = this
        me.comenzar();
      },
      methods:{
        comenzar(){
          let me = this
          me.ifMostrarSwitchStock = false
          me.$vs.loading()
          setTimeout(() => {
            me.arregloStock.forEach(item => {
              let preCantidadPendiente  = item.cantidad_pendiente
              let preStockAnterior      = item.stockAnterior
              let disponibleReal        = 0
              //si mi preStockAnterior es menor a 0 entonces el disponibleReal va a ser 0
              if(preStockAnterior <= 0){
                disponibleReal = 0
              }else{
                //si preStockAnterior es menor a preCantidadPendiente entonces el disponibleReal va a a ser preCantidadPendiente
                if(preStockAnterior <= preCantidadPendiente){
                  disponibleReal = preStockAnterior
                }else{
                  //de lo contratario voy a restar el preStockAnterior de la cantidad de stock disponible y colocar en Math.abs
                  disponibleReal = preCantidadPendiente
                }
              }

              //si el nuevoStock es menor a 0 colocar ifMostrarSwitchStock a true
              if(item.nuevoStock < 0){
                me.ifMostrarSwitchStock = true
              }
              var cal                 = new Object()
              cal.id                  = item.id
              cal.nombrelibro         = item.nombrelibro
              cal.stockAnterior       = item.stockAnterior
              cal.valorNew            = item.valorNew
              cal.nuevoStock          = item.nuevoStock
              cal.codigoFact          = item.codigoFact
              cal.codigo              = item.codigo
              cal.cantidad_pendiente  = item.cantidad_pendiente
              cal.cantidadAutorizar   = item.cantidadAutorizar
              cal.cantidad_descontar  = item.cantidad_descontar
              cal.cantidad_disponible = disponibleReal
              me.arrayGuias.push(cal)
            })
            me.arrayGuias = me.arrayGuias.filter(item => item.valorNew > 0)
            me.arrayGuiasOrginal = me.arrayGuias
            me.start()
            me.$vs.loading.close()

            },100)
        },
        filtroValores(){
          let me = this

          if(me.filtroNegativo){
            me.arrayGuias = me.arrayGuiasOrginal.filter(item => item.nuevoStock < 0)
          }else{
            me.arrayGuias = me.arrayGuiasOrginal
          }
        },
        getRowState(item) {
            let me = this;
            return item.cantidad_pendiente > 0 ? 'danger': 'none';
        },
        changeAprobar(){
          let me = this
          //si es ifAprobarSinStock = 1 entonces la propiedad cantidad_pendiente se usa para calcular el valor de nuevoStock
          me.arrayGuiasOrginal.forEach(item => {
            if(me.ifAprobarSinStock){
              item.cantidad_pendiente = item.cantidad_descontar
            }else{
              item.cantidad_pendiente = 0
            }
          })
          let sendEnviar = 0
          if(me.ifAprobarSinStock){
              sendEnviar = 1
          }else{
              sendEnviar = 0
          }
          me.$emit('changeAprobar',sendEnviar,me.arrayGuiasOrginal)
        },
        f_revisarCantidadAutorizar(item){
            let me = this
            if(item.cantidadAutorizar > item.cantidad_disponible){
                item.cantidadAutorizar = item.cantidad_disponible
            }
            if(item.cantidadAutorizar < 0){
                item.cantidadAutorizar = 0
            }
        },
        f_blurCantidadAutorizar(item){
            let me = this
            if(item.cantidadAutorizar > item.cantidad_disponible){
                item.cantidadAutorizar = item.cantidad_disponible
            }
            if(item.cantidadAutorizar <= 0){
                item.cantidadAutorizar = 0
            }
        },
        start(){
          let me = this
          me.$emit('changeAprobar',0,me.arrayGuias)
        },
        f_guardarCantidadAutorizar(){
          let me = this
          me.arraySend = me.arrayGuiasOrginal.filter(item => item.cantidadAutorizar > 0)
          if(me.arraySend.length == 0){
            me.m_message('Debe seleccionar al menos una guia','warning')
            return false
          }
          me.$emit('changeAprobarPendientes',me.arraySend)
        }
      }
  };
</script>
<style scoped>
  .row-danger {
    background-color: #eecbce; /* Rojo claro */
    color: #000; /* Texto rojo oscuro */
  }
</style>
