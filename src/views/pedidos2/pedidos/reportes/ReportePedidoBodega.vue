<template>
<vx-card>
    <div class="flex flex-wrap my-5 gap-4">
        <vs-button color="dark" @click="ifpuntoVenta = 0; getCodes(1)" type="line" :type="ifpuntoVenta === 0 ? 'gradient filled' : 'line'" aria-label="Ver reporte bodega">
            Reporte de Bodega
        </vs-button>

        <vs-button color="dark" @click="ifpuntoVenta = 1; arrayCodigos=[];getPuntosVentaDespacho()" type="line" :type="ifpuntoVenta === 1 ? 'gradient filled' : 'line'" aria-label="Ver reporte por punto de venta">
            Reporte por Punto de Venta
        </vs-button>

        <vs-button color="dark" @click="ifpuntoVenta = 2; arrayCodigos=[]" type="line" :type="ifpuntoVenta === 2 ? 'gradient filled' : 'line'" aria-label="Ver despachos por asesor">
            Despachos por Asesor
        </vs-button>
    </div>

    <div class="mt-2" v-if="ifpuntoVenta == 0">
        <p class="bg-pink-100 text-brown-700 font-semibold text-2xl text-center">
            Códigos subidos por bodega no se cuentan los devueltos
        </p>
    </div>

    <div v-if="ifpuntoVenta === 1">
        <vs-alert class="mt-2 h-20">
            <p>Códigos activos por liquidarse y liquidados, códigos regalados y bloqueados que no estén devueltos</p>
        </vs-alert>
        <div class="mt-5">
          <ul class="flex">
            <li class="radio-item">
              <input type="radio" v-model="tipoVenta" @input="totalLibros=[];tmpArrayCodigos=[];arrayCodigos=[];" @change="totalLibros=[];tmpArrayCodigos=[];arrayCodigos=[];institucion_id='';limpiarCache();getPuntosVentaDespacho();" name="radios1tipoVenta" value="1" id="directa">
              <label for="directa">Directa</label>
            </li>
            <li class="radio-item">
              <input type="radio" v-model="tipoVenta" @input="totalLibros=[];tmpArrayCodigos=[];arrayCodigos=[];" @change="totalLibros=[];tmpArrayCodigos=[];arrayCodigos=[];institucion_id='';limpiarCache();getPuntosVentaDespacho();" name="radios1tipoVenta" value="2" id="lista">
              <label for="lista">Lista</label>
            </li>
          </ul>
        </div>
        <small class="mt-3 block">{{ tipoVenta == '1' ? 'Institucion Directa' : 'Institucion Lista' }}:</small>
        <v-select @input="getCodes();" :options="arrayPuntosVenta" :reduce="arrayPuntosVenta => arrayPuntosVenta.institucion_id" label="nombreInstitucion" class="w-full mt-2" v-model="institucion_id" />
    </div>
    <div class="mt-5">
        <ul class="flex flex-wrap">
           <li v-if="ifpuntoVenta === 0" class="mr-4">
                <vs-radio v-model="tipoCode" vs-name="radios1" @input="titleCard = 'activos'; getCodes(1);" vs-value="activos">Códigos Activos Todos Individuales</vs-radio>
            </li>
            <li v-if="ifpuntoVenta === 0" class="mr-4">
                <vs-radio v-model="tipoCode" vs-name="radios1" @input="titleCard = 'activos sin combos'; getCodes(1);" vs-value="activosNoCombos">Códigos Activos <b>Sin combos</b></vs-radio>
            </li>
              <li v-if="ifpuntoVenta === 0" class="mr-4">
                <vs-radio v-model="tipoCode" vs-name="radios1" @input="titleCard = 'activos solo combos'; getCodes(1);" vs-value="onlyCombos">Códigos Activos <b>Solo combos</b></vs-radio>
            </li>
            <li v-if="ifpuntoVenta === 0" class="mr-4">
                <vs-radio v-model="tipoCode" vs-name="radios1" @input="titleCard = 'regalados'; getCodes(1);" vs-value="regalados">Códigos Regalados</vs-radio>
            </li>
            <li v-if="ifpuntoVenta === 0" class="mr-4">
                <vs-radio v-model="tipoCode" vs-name="radios1" @input="titleCard = 'bloqueados'; getCodes(1);" vs-value="bloqueados">Códigos Bloqueados</vs-radio>
            </li>
        </ul>
    </div>
    <!--REPORTE BODEGA-->
    <div v-if="ifpuntoVenta === 0">
        <div v-if="arrayCodigos.length > 0">
            <TablaReportePedidoBodegaVue :arrayPuntosVenta="arrayPuntosVenta" :nombrePeriodo="nombrePeriodo" :arrayCodigos="arrayCodigos" :ifpuntoVenta="Number(ifpuntoVenta)" :titleCard="String(titleCard)" :tipoCode="String(tipoCode)" :totalValores="totalValores" :totalLibros="totalLibros" />
        </div>
        <div v-else>
            <p class="text-center font-bold">No se encontraron códigos subidos por bodega</p>
        </div>
        <vs-divider></vs-divider>
    </div>
    <!--REPORTE POR PUNTO DE VENTA-->
     <div v-if="ifpuntoVenta === 1">
        <div v-if="arrayCodigos.length > 0">
            <TablaReportePedidoBodegaVue :arrayPuntosVenta="arrayPuntosVenta" :institucion_id="institucion_id" :nombrePeriodo="nombrePeriodo" :arrayCodigos="arrayCodigos" :ifpuntoVenta="Number(ifpuntoVenta)" :titleCard="String(titleCard)" :tipoCode="String(tipoCode)" :totalValores="totalValores" :totalLibros="totalLibros" />
        </div>
        <div v-else>
            <p class="text-center font-bold">No se encontraron códigos subidos por bodega</p>
        </div>
        <vs-divider></vs-divider>
    </div>

    <!-- <div v-if="ifpuntoVenta === 0" class="mt-4">
        <p class="bg-yellow-100 text-brown-600 text-2xl font-semibold text-center p-2">Facturación (Notas y Pre facturas - devolución)</p>
        <div>
          <p class="font-medium">Valor Notas y Pre Facturas incluidos combos: {{ facturacion.valorTotal | filtrarDecimal }}</p>
          <br>
        </div>
        <div class="mt-1">
          <ul class="flex">
            <li class="mr-2">
              <vs-radio v-model="tipoReporte" @input="getCodesCombo();" vs-name="radios1conCombos" vs-value="0">Todo</vs-radio>
            </li>
            <li class="mr-2">
              <vs-radio v-model="tipoReporte" @input="getCodesCombo();" vs-name="radios1conCombos" vs-value="1">Sin combos</vs-radio>
            </li>
              <li class="mr-2">
              <vs-radio v-model="tipoReporte" @input="getCodesCombo();" vs-name="radios1conCombos" vs-value="2">Solo combos</vs-radio>
            </li>
          </ul>
        </div>
        <TablaReportePedidoBodegaVue class="mt-3" :arrayPuntosVenta="arrayPuntosVenta" :nombrePeriodo="nombrePeriodo" :arrayCodigos="arrayVenta" :ifpuntoVenta="Number(2)" :tipoCode="String(titleCard)" :totalValores="totalValoresCombos" :totalLibros="totalLibrosCombos" />
    </div> -->

    <div v-if="ifpuntoVenta === 2">
        <ReporteFacturacionAsesoresVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :ifExterno="Number(1)" />
    </div>

    <div v-if="ifpuntoVenta === 3">
        <ReporteFacturadoXAsesores :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :ifExterno="Number(1)" />
    </div>

    <br><br>
</vx-card>
</template>
<script>
import Codigosmix from '../../../../mixins/Codigosmix';
import Generalmix from '../../../../mixins/Generalmix';
const TablaReportePedidoBodegaVue   = () => import('./components/TablaReportePedidoBodega.vue');
const ReporteFacturacionAsesoresVue = () => import('./ReporteFacturacionAsesores.vue');
const ReporteFacturadoXAsesores     = () => import('./ReporteFacturadoXAsesores.vue');
import vSelect from 'vue-select'
export default {
  mixins: [Codigosmix,Generalmix],
  components:{
        TablaReportePedidoBodegaVue,
        ReporteFacturacionAsesoresVue,
        ReporteFacturadoXAsesores,
        vSelect,
  },
  data() {
  return{
      titleCard:'activos',
      tipoCode:"activos",
      arrayCodigos:[],
      tmpArrayCodigos:[],
      totalValores:0,
      totalLibros:0,
      ifpuntoVenta:0,
      institucion_id:'',
      usuario:[],
      arrayPuntosVenta:[],
      //combos
      arrayVenta:[],
      totalValoresCombos:0,
      totalLibrosCombos:0,
            //total codigos bodega - combos
      arrayLibrosCombo:[],
      totalValoresReales:0,
      totalLibrosReales:0,
      mixinIdInicioFormatoNewData: null,
      tipoVenta:2,
      tipoReporte:0,
      facturacion:{
        valorTotal:0,
      }
    }
  },
  props:{
    periodo_id:{
      type:Number,
      default:0
        },
    nombrePeriodo:{
      type:String,
      default:""
        }
    },
  created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
  mounted(){
        let me = this
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
        me.getCodes()
        //ejecutar despues de 1 segundo
        setTimeout(() => {
            me.getCodesCombo()
        }, 1000);
    },
  methods:{
    getPuntosVentaDespacho(){
      let me = this
      me.$vs.loading()
      this.$http.get(this.$server_url+`pedidos2/pedidos?getPuntosVentaDespachados=1&periodo=${me.periodo_id}&idusuario=${me.usuario.idusuario}&tipoVenta=${me.tipoVenta}`)
      .then(function (res) {
          me.arrayPuntosVenta = res.data.filter(p => p.institucion_id > 0)
          me.$vs.loading.close()
      })
      .catch(function (error) {
          me.$vs.loading.close()
          me.m_message("Error al cargar los datos","danger")
          console.log(error + ' error');
        })
        },
    getCodes(charge=0){
            let me = this
            me.arrayCodigos = []
            me.totalValores = 0
      me.totalLibros  = 0
      if(me.periodo_id == 0) { return []}
      if(me.ifpuntoVenta == 1){
        if(me.institucion_id == 0 || me.institucion_id == "" || me.institucion_id == null){ me.m_message("Seleccione un punto de venta","warning"); return }  }
          me.$vs.loading()
            let url = ""
            if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
                if(me.ifpuntoVenta == 0) { url = `metodosGetCodigos?reporteBodega=1&periodo=${me.periodo_id}&${me.tipoCode}=1` }
                        //por punto de venta activos regalados y bloqueados y puntoVenta
                if(me.ifpuntoVenta == 1) {
                  if(me.tipoVenta == 1){
                    url = `metodosGetCodigos?reporteBodega=1&periodo=${me.periodo_id}&ventaDirecta=${me.institucion_id}`
                  }else{
                    url = `metodosGetCodigos?reporteBodega=1&periodo=${me.periodo_id}&puntoVenta=${me.institucion_id}`
                  }
                 }
            }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
                if(me.ifpuntoVenta == 0) { url = `metodosGetCodigos?reporteBodega_new=1&periodo=${me.periodo_id}&${me.tipoCode}=1` }
                        //por punto de venta activos regalados y bloqueados y puntoVenta
                if(me.ifpuntoVenta == 1) { url = `metodosGetCodigos?reporteBodega_new=1&periodo=${me.periodo_id}&puntoVenta=${me.institucion_id}` }
            }
          this.$http.get(this.$server_url+url)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arrayCodigos = res.data
          if(me.arrayCodigos.length == 0) { me.m_message("No se encontraron datos","warning"); return }
                    //sumar en totalValores  el campo precio_total
                    me.totalValores = me.arrayCodigos.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
                    //sumar la cantidad
          me.totalLibros = me.arrayCodigos.reduce((acc,obj) => acc + obj.cantidad, 0 )
          if(charge == 1){
                        me.f_codigosReales()
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al cargar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    })
                    console.log(error + ' error');
                })
        },
    getCodesCombo(){
        let me = this
        me.arrayVenta        = []
            me.totalValoresCombos = 0
      me.totalLibrosCombos  = 0
      if(me.periodo_id == 0) { return []}
      if(me.ifpuntoVenta == 1){
        if(me.institucion_id == 0 || me.institucion_id == "" || me.institucion_id == null){ me.m_message("Seleccione un punto de venta","warning"); return }
            }
            me.$vs.loading()
            let url = ""
            // if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
            //     if(me.ifpuntoVenta == 0) { url = `metodosGetCodigos?reporteBodegaCombos=1&periodo=${me.periodo_id}&combos=1` }
            // }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
            //     if(me.ifpuntoVenta == 0) { url = `metodosGetCodigos?reporteBodegaCombos_new=1&periodo=${me.periodo_id}&combos=1` }
            // }
            url = `metodosGetCodigos?reporteVentaCodigos=1&periodo=${me.periodo_id}&tipoReporte=${me.tipoReporte}`
            //por punto de venta activos regalados y bloqueados y puntoVenta
            // if(me.ifpuntoVenta == 1) { url = `metodosGetCodigos?reporteBodega=1&periodo=${me.periodo_id}&puntoVenta=${me.institucion_id}` }
            this.$http.get(this.$server_url+url)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arrayVenta = res.data
                    if(me.arrayVenta.length == 0) { me.m_message("No se encontraron códigos de facturación","warning"); return }
                    //actualizar valor facturacion total
                    if(me.tipoReporte == 0){
                      me.facturacion.valorTotal = me.arrayVenta.reduce((acc,obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
                    }
                    //separar en un array la propiedad codigos_combos porque tiene comas
                    // Inicializa el array que va a almacenar todos los resultados
                    me.arrayLibrosCombo = [];
                    let preArrayCombos  = me.arrayVenta.filter(p => p.ifcombo == 1)
                    // Recorre cada objeto en arrayVenta
                    preArrayCombos.forEach((obj) => {
                        // Divide codigos_combos en un array de códigos
                        obj.codigos_separados = obj.codigos_combos.split(',');

                        // Genera el array de objetos con código y cantidad para cada código
                        const librosCombo = obj.codigos_separados.map((codigo) => {
                            return {
                                codigo: codigo,
                                cantidad: obj.cantidad
                            };
                        });
                        // Añade los resultados generados al array principal
                        me.arrayLibrosCombo.push(...librosCombo);

                    });
                    //sumar en totalValores  el campo precio_total
                    me.totalValoresCombos   = me.arrayVenta.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
                              //sumar la cantidad
                    me.totalLibrosCombos    = me.arrayVenta.reduce((acc,obj) => acc + (parseFloat(obj.cantidad) || 0), 0 )
                    //despues de 1 segundo
                    setTimeout(() => {
                        me.f_codigosReales()
                    }, 2000);
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al cargar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    })
                    console.log(error + ' error');
                })
        },
        f_codigosReales() {
            let me = this;
            // Hacer una clonación profunda de arrayCodigos
            me.tmpArrayCodigos = JSON.parse(JSON.stringify(me.arrayCodigos));
            // Buscar los códigos de combos en tmpArrayCodigos y restarlos
            me.arrayLibrosCombo.forEach((obj) => {
                let index = me.tmpArrayCodigos.findIndex(x => x.codigo == obj.codigo);
                if (index != -1) {
                    // Restar la cantidad de arrayLibrosCombo con la cantidad de tmpArrayCodigos
                    me.tmpArrayCodigos[index].cantidad -= obj.cantidad;
                }
            });
            //calculos
            me.totalValoresReales = 0
      me.totalLibrosReales  = 0
            //multiplicar la cantidad por el precio en precio_total
            // me.tmpArrayCodigos.forEach((obj) => {
            //   obj.precio_total = obj.cantidad * obj.precio_total
            // });
            me.tmpArrayCodigos.forEach((obj) => {
                if (obj.cantidad && obj.precio) {
                    obj.precio_total = (obj.cantidad * obj.precio).toFixed(2); //toFixed(2) para redondear a 2 decimales
                } else {
                    obj.precio_total = 0; // O manejar como prefieras
                }
            });
            //sumar en totalValores  el campo precio_total
            me.totalValoresReales = me.tmpArrayCodigos.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
            //sumar la cantidad
      me.totalLibrosReales  = me.tmpArrayCodigos.reduce((acc,obj) => acc + obj.cantidad, 0 )
        }
    }
}
</script>
<style scoped>
.flex {
  display: flex;
  gap: 1rem; /* Espaciado entre los elementos */
}

.radio-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;
}

/* Ocultar los radios nativos y usar etiquetas personalizadas */
.radio-item input[type="radio"] {
  display: none;
}

/* Estilos para las etiquetas que imitan los radios */
.radio-item label {
  position: relative;
  padding-left: 30px; /* Espacio para el círculo del radio */
  cursor: pointer;
  font-weight: 600;
  transition: color 0.3s ease;
}

/* Crear el círculo personalizado */
.radio-item label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #007bff;
  border-radius: 50%;
  background-color: #fff;
  transition: background-color 0.3s, border-color 0.3s;
}

/* Estilo cuando el radio está seleccionado */
.radio-item input[type="radio"]:checked + label::before {
  background-color: #007bff;
  border-color: #007bff;
}

/* Cambio de color en el texto del label cuando se selecciona */
.radio-item input[type="radio"]:checked + label {
  color: #007bff;
}

/* Estilos de hover y foco */
.radio-item label:hover {
  color: #0056b3;
}

.radio-item input[type="radio"]:focus + label::before {
  border-color: #0056b3;
}
</style>
