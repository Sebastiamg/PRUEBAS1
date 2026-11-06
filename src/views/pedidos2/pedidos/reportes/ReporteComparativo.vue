<template>
  <div>
    <vs-popup title="lista de códigos" :active.sync="popupVerLibroIndividuales">
      <div>
       <TableReutilizableVue
       title="Detalle "
       :headers="['Código', 'factura', 'Documento','Empresa documento']"
       :fieldKeys="['codigo', 'factura', 'codigo_proforma','descripcion_corta']"
       :tableData="arrayCodigoIndividuales"
       />
      </div>
    </vs-popup>
    <p>Período: {{nombrePeriodo}}</p>
    <!--boton para recargar metodos-->
    <vs-button @click="limpiarCache();start()" color="primary" class="mb-4">Recargar</vs-button>
    <div>
      <!-- <div class="flex flex-wrap items-center justify-between">
        <h2 class="font-semibold text-lg text-primary">Puntos de Venta Despachados Bodega</h2>
      </div>
      <table-puntos-venta-vue :array-datos="arrayPuntosVenta"></table-puntos-venta-vue>
      <div class="flex flex-wrap items-center justify-between">
        <h2 class="font-semibold text-lg text-primary">Puntos de Venta Despachados Facturación</h2>
      </div> -->
      <!-- <table-puntos-venta-vue :array-datos="arrayPuntosVentaFacturacion"></table-puntos-venta-vue> -->
      <div class="flex flex-wrap items-center justify-between">
        <h2 class="font-semibold text-lg text-primary">Comparativo Puntos de venta</h2>
      </div>
      <vs-table max-items="10" search pagination :data="arrayComparativo">
        <template slot="header">
          <vs-chip color="primary">Cantidad: <b> {{ arrayComparativo.length }}</b></vs-chip>
          <vs-chip color="warning">No estan en Bodega: <b>{{ cuantosNoEstadBodega }}</b></vs-chip>
          <vs-chip color="warning">No estan en Facturación: <b>{{ cuantosNoEstanFacturacion }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>id</vs-th>
          <vs-th>Punto de Venta Bodega</vs-th>
          <vs-th>Punto de Venta Facturación</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{data[indextr].institucion_id}}<br>
            </vs-td>
            <vs-td>
              <div v-if="data[indextr].puntoVentaBodega == ''" class="text-danger">No coincide</div>
              <div v-else>{{data[indextr].puntoVentaBodega}}</div>
            </vs-td>
            <vs-td>
              <div v-if="data[indextr].puntoVentaFacturacion == ''" class="text-danger">No coincide</div>
              <div v-else>{{data[indextr].puntoVentaFacturacion}}</div>
            </vs-td>
            <vs-td>
              <vs-button @click="ObjectSelected=tr;f_verDetalle(tr)" color="primary" class="mb-4">Ver Detalle</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <!--modal para ver detalle-->
    <vs-popup classContent="popup-example" fullscreen :title="nombreInstitucionSeleccionado" :active.sync="popupVerDetalles">
      <div v-if="popupVerDetalles">
        <div class="flex" style="flex-wrap:wrap;">
          <div style="display:flex; flex-direction: column;border: 2px dashed  #5bcccc;padding: 18px;border-radius: 10px;" class="mr-5 mt-1">
            <span class="font-light">Valor Total Bodega: </span>
            <span class="font-bold text-primary" style="opacity:0.6;font-size:25px;">{{ totalValoresBodega | filtrarDecimal }}</span>
          </div>
          <div style="display:flex; flex-direction: column;border: 2px dashed  #5bcccc;padding: 18px;border-radius: 10px;" class="mr-5 mt-1">
            <span class="font-light">Valor Total Facturación: </span>
            <span class="text-success font-bold" style="opacity:0.8;font-size:25px;">{{ totalValoresFacturacion | filtrarDecimal }}</span>
          </div>

        </div>
        <vs-collapse>
          <vs-collapse-item>
            <div slot="header">
              Resumen de bodega y Facturación
            </div>
            <div>


              <vs-divider/>
              <div v-if="ifPuntoVentaBodega == 0" class="font-bold text-center">No hay datos de Bodega</div>
              <div v-else>
                <h3 class="font-semibold text-lg text-primary">Detalle de Bodega de {{ ObjectSelected.puntoVentaBodega }}</h3>
                <TablaReportePedidoBodegaVue class="mt-3" :nombrePeriodo="nombrePeriodo" :arrayCodigos="arrayCodigosBodega" :nombreArchivo="String('_Bodega')" :ifpuntoVenta="Number(3)"  :totalValores="totalValoresBodega" :totalLibros="totalLibrosBodega"/>
              </div>
              <vs-divider/>
              <div v-if="ifPuntoVentaFacturacion == 0" class="font-bold text-center">No hay datos de Facturación</div>
              <div v-else>
                <h3 class="font-semibold text-lg text-primary">Detalle de Facturación de {{ ObjectSelected.puntoVentaFacturacion }}</h3>
                <TablaReportePedidoBodegaVue class="mt-3" :nombrePeriodo="nombrePeriodo" :arrayCodigos="arrayCodigosFacturacion" :nombreArchivo="String('_Facturacion')" :ifpuntoVenta="Number(3)"  :totalValores="totalValoresFacturacion" :totalLibros="totalLibrosFacturacion"/>
              </div>
              <vs-divider/>
            </div>
          </vs-collapse-item>
         </vs-collapse>

        <!--combos-->
        <div class="mt-4">
          <p style="background:#fcf3cf;padding: 5px;color:#9a7d0a;" class="text-2xl font-semibold text-center">Códigos de combos</p>
          <div v-if="arrayCombos.length > 0">
            <TablaReportePedidoBodegaVue class="mt-3" :nombrePeriodo="nombrePeriodo" :arrayCodigos="arrayCombos" :ifpuntoVenta="Number(2)" :totalValores="totalValoresCombos" :totalLibros="totalLibrosCombos"/>
          </div>
          <div v-else class="font-bold text-center mt-3">No hay datos de Combos</div>
        </div>
        <vs-divider/>
        <div>
          <h1 class="font-semibold text-2xl text-primary ml-2"><i class="fa-solid fa-book"></i> Comparativo de Libros</h1>
          <div class="flex flex-wrap mt-2">
            <!-- Cantidad incorrectas -->
            <p class="text-red-600 text-2xl font-bold border border-gray-300 p-2">
              Cantidad Incorrectas: <b>{{ cantidadIncorrectasCompartivoLibros }}</b>
            </p>

            <!-- Total Precio Bodega -->
            <p class="ml-5 text-teal-400 text-2xl font-bold border border-gray-300 p-2">
              Total Precio Bodega: <b>{{ totalPrecioBodegaComparativaLibros | filtrarDecimal }}</b>
            </p>

            <!-- Total Precio Facturación -->
            <p class="ml-5 text-green-400 text-2xl font-bold border border-gray-300 p-2">
              Total Precio Facturación: <b>{{ totalPrecioFacturacionComparativaLibros | filtrarDecimal }}</b>
            </p>
          </div>
          <div class="flex mt-3">
            <div class="flex">
              <span class="mt-2">Mostrar incorrectas</span>
              <vs-checkbox class="ml-3" @input="filtrarIncorrectas()" v-model="permitirExportarSoloIncorrectos" label="Exportar solo incorrectos"></vs-checkbox>
            </div>
            <vs-button @click="exportarExcel();" class="mt-2 ml-2" v-if="arrayTemporalComparativo.length > 0" color="success"><i class="fa-solid fa-file-excel"></i> Exportar</vs-button>
          </div>
          <vs-table max-items="10" stripe search pagination :data="arrayTemporalComparativo">
            <template slot="header">
              <vs-chip color="primary">Cantidad: <b> {{ arrayTemporalComparativo.length }}</b></vs-chip>
              <vs-chip color="warning">No estan en Bodega: <b>{{ cuantosNoEstadBodegaCompartivoLibros }}</b></vs-chip>
              <vs-chip color="warning">No estan en Facturación: <b>{{ cuantosNoEstanFacturacionCompartivoLibros }}</b></vs-chip>
              <vs-chip color="warning">Total cantidad Bodega: <b>{{ totalcantidadBodegaComparativo | filtrarDecimal }}</b></vs-chip>
              <vs-chip color="warning">Total cantidad Facturación: <b>{{ totalcantidadFacturacionComparativo | filtrarDecimal }}</b></vs-chip>
            </template>
            <template slot="thead">
              <vs-th>Libro</vs-th>
              <vs-th>Código</vs-th>
              <vs-th>Cantidad Bodega</vs-th>
              <vs-th>Cantidad Facturación</vs-th>
              <vs-th>Precio Unt.</vs-th>
              <vs-th>P. Total Bodega</vs-th>
              <vs-th>P. Total Facturación</vs-th>
              <vs-th>Compartivo</vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{data[indextr].nombreLibro}}<br>
                </vs-td>
                <vs-td>
                  {{data[indextr].codigo}}<br>
                  <span @click="ObjectSelectedIndividual=tr;mostrarLibrosIndividuales(tr);" style="color:cornflowerblue;opacity:0.9;"><i class="fa-solid fa-eye"></i> Ver codigos</span>
                </vs-td>
                <vs-td>
                  {{ tr.cantidadBodega }}
                </vs-td>
                <vs-td>
                  <div v-if="arrayCombos.length > 0">
                    <b>Cantidad combos:</b>
                    <p>{{ tr.cantidadCombos }}</p>
                    <b>Sueltos:</b>
                    <p>{{tr.cantidadFacturacionIncial}}</p>
                    <b>total {{ tr.codigo }}:</b>
                    <p>{{ tr.cantidadFacturacion }}</p>
                  </div>
                  <div v-else>
                    {{ tr.cantidadFacturacion }}
                  </div>
                  <!-- {{data[indextr].cantidadFacturacion}}<br> -->
                </vs-td>
                <vs-td>
                  {{ tr.precio }}
                </vs-td>
                <vs-td>
                  {{ tr.precio_total_bodega }}
                </vs-td>
                <vs-td>
                  {{ tr.precio_total_facturacion }}
                </vs-td>
                <vs-td>
                  <div v-if="data[indextr].comparativo == 'Correcto'" class="text-success">Correcto</div>
                  <div v-else class="text-danger">Incorrecto</div>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </div>
    </vs-popup>

  </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
const TablePuntosVentaVue         = () => import('./components/TablePuntosVenta.vue');
const TablaReportePedidoBodegaVue = () => import('./components/TablaReportePedidoBodega.vue');
const TableReutilizableVue        = () => import('./components/TableReutilizable.vue');
export default {
  mixins: [Generalmix, Codigosmix],
  components:{
    TablePuntosVentaVue,
    TablaReportePedidoBodegaVue,
    TableReutilizableVue,
  },
  data() {
    return{
      periodo_id:0,
      nombrePeriodo:'',
      arrayPuntosVenta:[],
      arrayPuntosVentaFacturacion:[],
      arrayComparativo:[],
      usuario:{},
      cuantosNoEstadBodega:0,
      cuantosNoEstanFacturacion:0,
      popupVerDetalles: false,
      nombreInstitucionSeleccionado:'',
      ifPuntoVentaBodega: 0,
      ifPuntoVentaFacturacion: 0,
      ObjectSelected: '',
      arrayCodigosBodega: [],
      arrayCodigosFacturacion: [],
      totalValoresBodega: 0,
      totalLibrosBodega: 0,
      totalValoresFacturacion: 0,
      totalLibrosFacturacion: 0,
      arrayCompartivoLibros: [],
      cuantosNoEstadBodegaCompartivoLibros: 0,
      cuantosNoEstanFacturacionCompartivoLibros: 0,
      cantidadIncorrectasCompartivoLibros: 0,
      permitirExportarSoloIncorrectos: false,
      //combos
      arrayCombos: [],
      totalValoresCombos: 0,
      totalLibrosCombos: 0,
      arrayLibrosCombo: [],
      tmpArrayCodigos: [],
      arrayTemporalComparativo:[],
      totalPrecioBodegaComparativaLibros:0,
      totalPrecioFacturacionComparativaLibros:0,
      totalcantidadBodegaComparativo:0,
      totalcantidadFacturacionComparativo:0,
      //fin combos
      //variables para mostrar libros individuales
      popupVerLibroIndividuales:false,
      ObjectSelectedIndividual:'',
      arrayCodigoIndividuales:[],
      mixinIdInicioFormatoNewData: null,
      //fin variables para mostrar libros individuales
    }
  },
  created(){
    let me = this
    me.periodo_id     = localStorage.periodoIdSelect
    me.nombrePeriodo  = localStorage.periodoNombreSelect
  },
  mounted(){
    let me = this;
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
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
    this.start()
  },
  methods: {
    mostrarLibrosIndividuales(){
      let me = this
      me.popupVerLibroIndividuales = []
      me.$vs.loading()
      let url = `metodosGetCodigos?getCodigosIndividuales=1&periodo=${me.periodo_id}&activos=1&puntoVenta=${me.ObjectSelected.institucion_id}&libro=${me.ObjectSelectedIndividual.codigo}`
      this.$http.get(this.$server_url+url)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.m_message(res.data.message, 'warning')
          return
        }
        me.arrayCodigoIndividuales = res.data
        me.popupVerLibroIndividuales = true
      })
      .catch(function (error) {
        me.$vs.loading.close()
          console.log(error + ' error');
      })
    },
    f_verDetalle(tr) {
      let me = this;
      me.nombreInstitucionSeleccionado            = tr.puntoVentaBodega ? tr.puntoVentaBodega : tr.puntoVentaFacturacion;
      me.arrayCodigosBodega                       = [];
      me.arrayCodigosFacturacion                  = [];
      me.arrayTemporalComparativo                 = []
      me.tmpArrayCodigos                          = [];
      me.arrayCombos                              = [];
      me.arrayLibrosCombo                         = [];
      me.totalValoresBodega                       = 0;
      me.totalLibrosBodega                        = 0;
      me.totalValoresFacturacion                  = 0;
      me.totalLibrosFacturacion                   = 0;
      me.arrayCompartivoLibros
      me.cantidadIncorrectasCompartivoLibros      = 0;
      me.cuantosNoEstadBodegaCompartivoLibros     = 0;
      me.cuantosNoEstanFacturacionCompartivoLibros = 0;
      me.totalPrecioBodegaComparativaLibros       = 0;
      me.totalPrecioFacturacionComparativaLibros  = 0;
      me.totalcantidadBodegaComparativo           = 0;
      me.totalcantidadFacturacionComparativo      = 0;


      // Determinar si hay puntos de venta
      me.ifPuntoVentaBodega                       = tr.puntoVentaBodega ? 1 : 0;
      me.ifPuntoVentaFacturacion                  = tr.puntoVentaFacturacion ? 1 : 0;
      if (me.ifPuntoVentaBodega === 0 && me.ifPuntoVentaFacturacion === 0) {
        this.m_message("No se puede ver detalle, no hay datos.....", "warning");
        return;
      }
      this.m_message("Espere mientras se genera el reporte", "primary","icon-check","7000");
      me.$vs.loading();
      // Crear un array de promesas
      const promises = [];
      if (me.ifPuntoVentaBodega === 1) {
        promises.push(this.getCodesBodega());
      }
      if (me.ifPuntoVentaFacturacion === 1) {
        promises.push(this.getCodesFacturacion());
      }
      // Mostrar el loader al inicio
      // Procesar las promesas
      Promise.all(promises)
        .then(() => {
          // Si todo se completa exitosamente
          console.log("Códigos obtenidos exitosamente");
          //ejecutar despues de obtener los codigos con exito con un timeout de 5 segundos
          setTimeout(() => {
            me.f_realizarCompartivoLibros();
          }, 10000);
        })
        .catch((error) => {
          // Manejo de errores
          console.error("Ocurrió un error al obtener los códigos:", error);
        })
        .finally(() => {
          // Cerrar el loader en cualquier caso
          me.$vs.loading.close();
        });
    },
    f_realizarCompartivoLibros() {
      let me = this;
      me.arrayCompartivoLibros = [];
      me.cantidadIncorrectasCompartivoLibros = 0;
      me.cuantosNoEstadBodegaCompartivoLibros = 0;
      me.cuantosNoEstanFacturacionCompartivoLibros = 0;
      //si el array codigos de facturacion es vacio o cero set time out de 2 segundos
      if (me.arrayCodigosFacturacion.length == 0) {
        setTimeout(() => {
          me.f_calcularComparativosLibros();
          me.popupVerDetalles = true;
        }, 2000);
      }else{
        me.f_calcularComparativosLibros();
        me.popupVerDetalles = true;
      }
    },
    f_calcularComparativosLibros(){
      let me = this
      me.arrayCodigosBodega.forEach(element => {
        let codigoFacturacion = me.arrayCodigosFacturacion.find(item => item.codigo == element.codigo);
        console.log("Codigo Facturación:", codigoFacturacion);
        console.log("precio",element.precio)
        if (codigoFacturacion) {
          me.arrayCompartivoLibros.push({
            codigo: element.codigo,
            nombreLibro: element.nombrelibro,
            cantidadBodegaInicial:element.cantidad,
            cantidadBodega: element.cantidad,
            cantidadFacturacionIncial:codigoFacturacion.cantidad,
            cantidadFacturacion: codigoFacturacion.cantidad,
            precio:codigoFacturacion.precio,
            cantidadCombos:0,
          });
        } else {
          me.arrayCompartivoLibros.push({
            codigo: element.codigo,
            nombreLibro: element.nombrelibro,
            cantidadBodegaInicial:element.cantidad,
            cantidadBodega: element.cantidad,
            cantidadFacturacionIncial:0,
            cantidadFacturacion: 0,
            precio:element.precio,
            cantidadCombos:0,
          });
        }
      });
      let preCodigosFacturacion = me.arrayCodigosFacturacion.filter(p => p.ifcombo == 0);
      preCodigosFacturacion.forEach(element => {
        // Buscar si el código de facturación está en el array de códigos de bodega y que la propiedad ifcombo = 0
        let codigoBodega = me.arrayCodigosBodega.find(item => item.codigo == element.codigo);
        // let codigoBodega = me.arrayCodigosBodega.find(item => item.codigo == element.codigo);
        if (!codigoBodega) {
          me.arrayCompartivoLibros.push({
            codigo: element.codigo,
            nombreLibro: element.nombrelibro,
            cantidadBodega: 0,
            cantidadFacturacionIncial:element.cantidad,
            cantidadFacturacion: element.cantidad,
            precio:element.precio,
            cantidadCombos:0,
          });
        }
      });
      me.getCodesCombo();

    },
    getCodesCombo(){
      let me = this
      me.arrayCombos              = []
      me.totalValoresCombos       = 0
      me.totalLibrosCombos        = 0
      me.arrayTemporalComparativo = []
      me.tmpArrayCodigos          = []
      if(me.periodo_id == 0) { return []}
      me.$vs.loading()
      let url = ""
      if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
        url = `metodosGetCodigos?reporteBodegaCombos=1&periodo=${me.periodo_id}&puntoVentaCombo=${me.ObjectSelected.institucion_id}`
      }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
        url = `metodosGetCodigos?reporteBodegaCombos_new=1&periodo=${me.periodo_id}&puntoVentaCombo=${me.ObjectSelected.institucion_id}`
      }
      this.$http.get(this.$server_url+url)
        .then(function (res) {
          me.$vs.loading.close()
          me.arrayCombos = res.data
          if(me.arrayCombos.length == 0) { me.m_message("No se encontraron combos","warning");
          setTimeout(() => {
            me.f_codigosReales()
          }, 2000);
          return }
          //separar en un array la propiedad codigos_combos porque tiene comas
          // Inicializa el array que va a almacenar todos los resultados
          me.arrayLibrosCombo = [];

          // Recorre cada objeto en arrayCombos
          me.arrayCombos.forEach((obj) => {
            // Divide codigos_combos en un array de códigos
            obj.codigos_separados = obj.codigos_combos.split(',');

            // Genera el array de objetos con código y cantidad para cada código
            const librosCombo = obj.codigos_separados.map((codigo) => {
              let datoCodigo = {
                nombrelibro:'',
                precio:'',
                codigo: codigo,
                cantidad: obj.cantidad,
                cantidadCombos:0,
              }
              //buscar el codigo en arrayCodigosBodega si no existe buscar en arrayCodigosFacturacion y llenar el nombrelibro y precio
              let codigoBodega = me.arrayCodigosBodega.find(item => item.codigo == codigo);
              if(codigoBodega){
                datoCodigo.nombrelibro = codigoBodega.nombrelibro;
                datoCodigo.precio      = codigoBodega.precio;
              }else{
                let codigoFacturacion = me.arrayCodigosFacturacion.find(item => item.codigo == codigo);
                if(codigoFacturacion){
                  datoCodigo.nombrelibro = codigoFacturacion.nombrelibro;
                  datoCodigo.precio      = codigoFacturacion.precio;
                }
                else{
                  datoCodigo.nombrelibro = "No encontrado";
                  datoCodigo.precio      = 0;
                }
              }
              return datoCodigo;
            });
            // Añade los resultados generados al array principal
            me.arrayLibrosCombo.push(...librosCombo);

          });
          //sumar en totalValores  el campo precio_total
          me.totalValoresCombos   = me.arrayCombos.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
          //sumar la cantidad
          me.totalLibrosCombos    = me.arrayCombos.reduce((acc,obj) => acc + (parseFloat(obj.cantidad) || 0), 0 )
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
      me.arrayTemporalComparativo = [];
      me.totalPrecioBodegaComparativaLibros       = 0;
      me.totalPrecioFacturacionComparativaLibros  = 0;
      me.totalcantidadBodegaComparativo           = 0;
      me.totalcantidadFacturacionComparativo      = 0;
      // Hacer una clonación profunda de arrayCodigos
      me.tmpArrayCodigos = JSON.parse(JSON.stringify(me.arrayCompartivoLibros));
      // Buscar los códigos de combos en tmpArrayCodigos y restarlos
      // me.arrayLibrosCombo.forEach((obj) => {
      //   let index = me.tmpArrayCodigos.findIndex(x => x.codigo == obj.codigo);
      //   if (index != -1) {
      //     // Restar la cantidad de arrayLibrosCombo con la cantidad de tmpArrayCodigos
      //     // me.tmpArrayCodigos[index].cantidadBodega -= obj.cantidad;
      //     me.tmpArrayCodigos[index].cantidadBodega = Math.abs(me.tmpArrayCodigos[index].cantidadBodega - obj.cantidad);

      //   }
      // });
      // Buscar los códigos de combos en tmpArrayCodigos y resumar a facturacion a los sueltos
      console.log("combos",me.arrayLibrosCombo)
      me.arrayLibrosCombo.forEach((obj) => {
        let index = me.tmpArrayCodigos.findIndex(x => x.codigo == obj.codigo);
        if (index != -1) {
          // Sumar la cantidad de arrayLibrosCombo con la cantidad de tmpArrayCodigos
          //sumar con parseFloat para que no concatene
          me.tmpArrayCodigos[index].cantidadFacturacion = parseFloat(me.tmpArrayCodigos[index].cantidadFacturacion) + parseFloat(obj.cantidad);
          //cantidad combos
          me.tmpArrayCodigos[index].cantidadCombos      = obj.cantidad;
        //si no existe el codigo envio el obj en el tmpArrayCodigos lo creo
        }else{
          me.tmpArrayCodigos.push(obj)
        }
      });
      //multiplicar la cantidad por el precio en precio_total
      me.tmpArrayCodigos.forEach((obj) => {
        if (obj.cantidad && obj.precio) {
          obj.precio_total = (obj.cantidad * obj.precio).toFixed(2); //toFixed(2) para redondear a 2 decimales
        } else {
          obj.precio_total = 0; // O manejar como prefieras
        }
      });
      //multiplicar precio * cantidad bodega y cantidad facturacion en un campo precio_total bodega y precio_total facturacion
      me.tmpArrayCodigos.forEach((obj) => {
        if (obj.cantidadBodega && obj.precio) {
          obj.precio_total_bodega = (obj.cantidadBodega * obj.precio).toFixed(2); //toFixed(2) para redondear a 2 decimales
        } else {
          obj.precio_total_bodega = 0; // O manejar como prefieras
        }
      });
      me.tmpArrayCodigos.forEach((obj) => {
        if (obj.cantidadFacturacion && obj.precio) {
          obj.precio_total_facturacion = (obj.cantidadFacturacion * obj.precio).toFixed(2); //toFixed(2) para redondear a 2 decimales
        } else {
          obj.precio_total_facturacion = 0; // O manejar como prefieras
        }
      });
      me.arrayTemporalComparativo                  = me.tmpArrayCodigos
      //sumar totalPrecioBodegaComparativaLibros
      me.totalPrecioBodegaComparativaLibros       = me.tmpArrayCodigos.reduce((acc,obj) => acc + parseFloat(obj.precio_total_bodega), 0 )
      //sumar totalPrecioFacturacionComparativaLibros
      me.totalPrecioFacturacionComparativaLibros  = me.tmpArrayCodigos.reduce((acc,obj) => acc + parseFloat(obj.precio_total_facturacion), 0 )
      //totalcantidadBodegaComparativo
      me.totalcantidadBodegaComparativo           = me.tmpArrayCodigos.reduce((acc,obj) => acc + (parseFloat(obj.cantidadBodega) || 0), 0 )
      //totalcantidadFacturacionComparativo
      me.totalcantidadFacturacionComparativo      = me.tmpArrayCodigos.reduce((acc,obj) => acc + (parseFloat(obj.cantidadFacturacion) || 0), 0 )
      //fin calculos
      //si la cantidadBodega es igual a la cantidadFacturacion entonces el comparativo es correcto si no es incorrecto
      me.arrayTemporalComparativo.forEach(element => {
        if (element.cantidadBodega == element.cantidadFacturacion) {
          element.comparativo = "Correcto";
        } else {
          element.comparativo = "Incorrecto";
        }
      });
      //calcular cuantos no estan en bodega
      me.cuantosNoEstadBodegaCompartivoLibros       = me.arrayTemporalComparativo.filter(item => item.cantidadBodega == 0).length;
      //calcular cuantos no estan en facturacion
      me.cuantosNoEstanFacturacionCompartivoLibros  = me.arrayTemporalComparativo.filter(item => item.cantidadFacturacion == 0).length;
      //calcular cuantos incorrectos
      me.cantidadIncorrectasCompartivoLibros        = me.arrayTemporalComparativo.filter(item => item.comparativo == "Incorrecto").length;
    },
    filtrarIncorrectas(){
      //si permitirExportarSoloIncorrectos es true filtrar del array arrayTemporalComparativo las incorrectas si no mostrar todo
      let me = this
      if(me.permitirExportarSoloIncorrectos){
        me.arrayTemporalComparativo = me.tmpArrayCodigos.filter(item => item.comparativo == "Incorrecto");
      }else{
        me.arrayTemporalComparativo = me.tmpArrayCodigos;
      }
    },
    //=====================FIN DE METODOS DE COMPARACION LIBROS===============================
    getCodesBodega(charge=0){
      let me = this
      me.arrayCodigosBodega = []
      me.totalValoresBodega = 0
      me.totalLibrosBodega  = 0
      if(me.periodo_id == 0) { return []}
      me.$vs.loading()
      let url = ""
      if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
        url = `metodosGetCodigos?reporteBodega=1&periodo=${me.periodo_id}&puntoVentaActivos=${me.ObjectSelected.institucion_id}`
      }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
        url = `metodosGetCodigos?reporteBodega_new=1&periodo=${me.periodo_id}&puntoVentaActivos=${me.ObjectSelected.institucion_id}`
      }
      this.$http.get(this.$server_url+url)
        .then(function (res) {
          me.$vs.loading.close()
          me.arrayCodigosBodega = res.data
          if(me.arrayCodigosBodega.length == 0) { me.m_message("No se encontraron codigos de bodega","warning"); return }
          //sumar en totalValores  el campo precio_total
          me.totalValoresBodega = me.arrayCodigosBodega.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
          //sumar la cantidad
          me.totalLibrosBodega = me.arrayCodigosBodega.reduce((acc,obj) => acc + obj.cantidad, 0 )
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
    getCodesFacturacion(){
      let me = this
      me.arrayCodigosFacturacion = []
      me.totalValoresFacturacion = 0
      me.totalLibrosFacturacion  = 0
      if(me.periodo_id == 0) { return []}
      me.$vs.loading()
      let url = ""
      if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
        url = `metodosGetCodigos?reporteBodegaCombos=1&periodo=${me.periodo_id}&puntoVenta=${me.ObjectSelected.institucion_id}`
      }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
        url = `metodosGetCodigos?reporteBodegaCombos_new=1&periodo=${me.periodo_id}&puntoVenta=${me.ObjectSelected.institucion_id}`
      }
      this.$http.get(this.$server_url+url)
        .then(function (res) {
          me.$vs.loading.close()
          me.arrayCodigosFacturacion = res.data
          if(me.arrayCodigosFacturacion.length == 0) { me.m_message("No se encontraron codigos de facturación","warning"); return }
          //sumar en totalValores  el campo precio_total
          me.totalValoresFacturacion = me.arrayCodigosFacturacion.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);
          //sumar la cantidad
          me.totalLibrosFacturacion = me.arrayCodigosFacturacion.reduce((acc,obj) => acc + (parseFloat(obj.cantidad) || 0), 0 )
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
    ///=======METODOS DE PUNTOS DE VENTAS============
    async start() {
      try {
        await Promise.all([
          this.getPuntosVentaDespacho(),
          this.getpuntosVentaDespachadosFacturacion()
        ]);
        await this.f_realizarComparativo();
      } catch (error) {
        console.log("Error en una de las promesas:", error);
      }
    },

    async getpuntosVentaDespachadosFacturacion() {
      this.$vs.loading();
      try {
        const res = await this.$http.get(`${this.$server_url}pedidos2/pedidos?getpuntosVentaDespachadosFacturacion=1&periodo=${this.periodo_id}&idusuario=${this.usuario.idusuario}`);
        this.arrayPuntosVentaFacturacion = res.data;
      } catch (error) {
        this.m_message("Error al cargar los datos", "danger");
        console.log(error + ' error');
      } finally {
        this.$vs.loading.close();
      }
    },
    async getPuntosVentaDespacho() {
      this.$vs.loading();
      try {
        const res = await this.$http.get(`${this.$server_url}pedidos2/pedidos?getPuntosVentaDespachados=1&periodo=${this.periodo_id}&idusuario=${this.usuario.idusuario}&tipo_venta='2'`);
        this.arrayPuntosVenta = res.data;
        this.arrayPuntosVenta.sort((a, b) => (a.venta_lista_institucion > b.venta_lista_institucion) ? 1 : -1);
        this.arrayPuntosVenta.forEach(element => {
          element.institucion_id = element.venta_lista_institucion;
        });
      } catch (error) {
        this.m_message("Error al cargar los datos", "danger");
        console.log(error + ' error');
      } finally {
        this.$vs.loading.close();
      }
    },
    async f_realizarComparativo() {
      //del arrayPuntosVenta voy a recorrerlo y comparar con el arrayPuntosVentaFacturacion
      //si el arrayPuntosVentaFacturacion tiene el mismo id que el arrayPuntosVenta
      //entonces coloco la propiedad puntoVentaBodega y coloco el nombreInstitucion y coloco
      //la propiedad puntoVentaFacturacion y coloco el nombreInstitucion
      let me = this;
      me.arrayComparativo = [];
      me.arrayPuntosVenta.forEach(element => {
        let puntoVentaFacturacion = me.arrayPuntosVentaFacturacion.find(item => item.institucion_id == element.institucion_id);
        if (puntoVentaFacturacion) {
          //institucion_id
          element.institucion_id        = element.institucion_id;
          element.puntoVentaBodega      = puntoVentaFacturacion.nombreInstitucion;
          element.puntoVentaFacturacion = puntoVentaFacturacion.nombreInstitucion;
          me.arrayComparativo.push(element);
        }else{
          me.arrayComparativo.push({
            institucion_id: element.institucion_id,
            puntoVentaBodega: element.nombreInstitucion,
            puntoVentaFacturacion: ""
          });
        }
      });
      //los institucion_id que no estan en el arrayPuntosVentaFacturacion
      //los coloco en el arrayComparativo con puntoVentaBodega y puntoVentaFacturacion vacios
      me.arrayPuntosVentaFacturacion.forEach(element => {
        let puntoVentaBodega = me.arrayPuntosVenta.find(item => item.institucion_id == element.institucion_id);
        if (!puntoVentaBodega) {
          me.arrayComparativo.push({
            institucion_id: element.institucion_id,
            puntoVentaBodega: "",
            puntoVentaFacturacion: element.nombreInstitucion
          });
        }
      });
      //calcular cuantos no estan en bodega
      me.cuantosNoEstadBodega       = me.arrayComparativo.filter(item => item.puntoVentaBodega == "").length;
      //calcular cuantos no estan en facturacion
      me.cuantosNoEstanFacturacion  = me.arrayComparativo.filter(item => item.puntoVentaFacturacion == "").length;
      ///
    },
    exportarExcel(){
      let me = this
      let arrayExportar = []
      if(me.permitirExportarSoloIncorrectos){
        arrayExportar = me.tmpArrayCodigos.filter(item => item.comparativo == "Incorrecto");
      }else{
        arrayExportar = me.tmpArrayCodigos;
      }
      const headerTitle = new Set();
      headerTitle.add("Libro");
      headerTitle.add("Código");
      headerTitle.add("Cantidad Bodega");
      headerTitle.add("Cantidad Facturación");
      headerTitle.add("Precio unit.")
      headerTitle.add("P. Total Bodega")
      headerTitle.add("P. Total Facturación")
      headerTitle.add("Comparativo");
      const headerVal = new Set();
      headerVal.add("nombreLibro");
      headerVal.add("codigo");
      headerVal.add("cantidadBodega");
      headerVal.add("cantidadFacturacion");
      headerVal.add("precio");
      headerVal.add("precio_total_bodega");
      headerVal.add("precio_total_facturacion");
      headerVal.add("comparativo");
      //exportar a excel
      let nombrearchivo = ""
      //si el puntoVentaBodega es vacio entonces puntoVentaFacturacion
      if(me.ObjectSelected.puntoVentaBodega == ""){
        nombrearchivo = '_Comparativo_'+me.ObjectSelected.puntoVentaFacturacion
      }else{
        nombrearchivo = '_Comparativo_'+me.ObjectSelected.puntoVentaBodega
      }
      me.m_exportTodo(headerTitle,headerVal,arrayExportar,me.nombrePeriodo+nombrearchivo)
    },
  },

}
</script>
<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0; /* Opcional, para que ocupe todo el ancho */
  background-color: white; /* O el color que prefieras */
  z-index: 1000; /* Asegúrate de que esté por encima de otros elementos */
  padding: 1rem; /* Ajusta según sea necesario */
}
</style>
