<template>
  <div>
    <!-- <p><b>Institucion:</b> {{ pedido.nombreInstitucion  }}</p> -->
    <br>
    <vs-tabs :color="'#F5B041'">
      <vs-tab label="Detalle de venta" icon-pack="feather" icon="icon-shopping-bag" @click="menu = 0;">
      </vs-tab>
      <vs-tab v-if="showAgrupado == '1'" label="Agrupado de venta" icon-pack="feather" icon="icon-aperture" @click="menu = 1;">
      </vs-tab>
      <!--historico-->
      <vs-tab label="Historico" icon-pack="feather" icon="icon-clock" @click="menu = 2;">
      </vs-tab>
    </vs-tabs>
    <div v-if="menu == 0">
      <vs-card>
        <ul class="flex">
          <li>
            <vs-radio v-model="rtipoVenta" @input="verTipoVenta()" vs-name="rradios1" vs-value="0">Todo: <b>{{ sumaTotal }}</b></vs-radio>
          </li>
          <li>
            <vs-radio v-model="rtipoVenta" @input="verTipoVenta()" class="ml-2" vs-name="rradios1" vs-value="1">Venta directa: <b>{{ SumaVentaDirecta }}</b></vs-radio>
          </li>
          <li>
            <vs-radio v-model="rtipoVenta" @input="verTipoVenta()" class="ml-2" vs-name="rradios1" vs-value="2">Venta lista: <b>{{ SumaVentaLista }}</b></vs-radio>
          </li>
        </ul>
        <vs-button v-if="rtipoVenta == 1" @click="cambiarALeidos()" class="mt-1" color="primary" type="border">Pasar a liquidar {{ totalAleer.length }} códigos</vs-button>
        <vs-button v-if="rtipoVenta == 2 && userRoot" @click="cambiarALeidos()" class="mt-1" color="primary" type="border">Pasar a liquidar {{ totalAleer.length }} códigos</vs-button>
      </vs-card>
      <vx-card title="Documentos">
        <div v-if="arrayDocumentos.length > 0">
          <p>Total items documentos: {{ totalItemsDocumentos }}</p>
          <TableReutilizableVue
            :title="'Documentos'"
            :headers="['Documento','Empresa','Cantidad']"
            :fieldKeys="['codigo_proforma','empresa','cantidad_codigos']"
            :tableData="arrayDocumentos"
            :maxItems="Number(5)"
          />
        </div>
        <div v-else>
          <vs-alert color="warning" style="height: 80px;">
            <p class="text-2xl font-bold text-center">No hay documentos para esta institución</p>
          </vs-alert>
        </div>
      </vx-card>
      <vx-card>
        <div class="flex" style="flex-wrap:wrap;">
          <vs-list-header class="mr-5" :title="'Total enviados: '    + SumaEnviados "></vs-list-header>
          <!-- <vs-list-header class="mr-5" :title="'Total devueltos: '   + SumaCodigosDevolucion "></vs-list-header> -->
          <vs-list-header class="mr-5" :title="'Total regalados: '   + sumaCodigosRegalados "></vs-list-header>
          <vs-list-header class="mr-5" :title="'Total Bloqueados: '  + sumaCodigosBloqueados "></vs-list-header>
          <vs-list-header class="mr-5" :title="'Total Liquidados: '  + sumarCodigosLiquidados "></vs-list-header>
          <vs-list-header class="mr-5" :title="'Total: '             + (SumaEnviados - SumaCodigosDevolucion) "></vs-list-header>
          <vs-list-header class="mr-5" :title="'Total leídos: '      + sumarCodigosLeidos "></vs-list-header>
          <vs-list-header class="mr-5" :title="'Total no leídos: '   + sumarCodigosNoleidos "></vs-list-header>
        </div>

      </vx-card>
      <div class="header mt-3">
        <vs-row v-if="codigosPerdidos">
          <vs-col vs-type="flex" vs-justify="center" class="mt-3" vs-align="center" vs-w="12">
            <vs-alert active="true">
              Se cambio {{ porcentaje }} códigos a leído
            </vs-alert>
          </vs-col>
          <vs-col vs-type="flex" v-if="codigosNoCambiados.length > 0" vs-justify="center" vs-align="center" vs-w="12">
            <vs-list>
              <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
              </vs-list-item>
            </vs-list>
          </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vs-card v-if="codigosLeidos.length > 0">
            <vs-collapse accordion >
              <vs-collapse-item class="mt-2">
                <div slot="header">
                  Códigos que no se leyeron <ion-icon style="font-size:18px;position: relative;top:5px;" name="arrow-down-circle-outline"></ion-icon>
                </div>
              <gestionCodigosListaVue :arregloCodigos="codigosLeidos"/>
              </vs-collapse-item>
            </vs-collapse>
          </vs-card>
        </vs-row>
        <vs-divider></vs-divider>
      </div>
      <gestionCodigosListaVue :arregloCodigos="tmpinformacion"/>
    </div>
    <!--AGRUPADO-->
    <div v-if="menu == 1">
      <vs-alert color="primary">
        <p>! Códigos activos cargados por bodega, no se incluyen los códigos devueltos y/o bloqueados.</p>
      </vs-alert>
      <ul class="mt-5">
        <li>
          <vs-checkbox v-model="checkBloqueados" @input="filterAgrupado();">Incluir Bloqueados</vs-checkbox>
        </li>
      </ul>
      <RevisionVentaAgrupadoVue :groupedData="groupedData" :pedido="pedido"/>
    </div>
    <!--historico-->
    <div v-if="menu == 2">
      <HistoricoCodigosVue :ObjectedSelected="pedido" />
    </div>
  </div>
</template>
<script>
  import {
    mapState
} from "vuex";
import gestionCodigosListaVue from './gestionCodigosLista.vue';
import RevisionVentaAgrupadoVue from './RevisionVentaAgrupado.vue';
const HistoricoCodigosVue     = () => import('../../historico/HistoricoCodigos.vue')
const TableReutilizableVue    = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default{
  components:{
    gestionCodigosListaVue,
    RevisionVentaAgrupadoVue,
    HistoricoCodigosVue,
    TableReutilizableVue
  },
  data(){
    return{
      menu:0,
      informacion:[],
      tmpinformacion:[],
      codigosNoCambiados:[],
      arreglocodigosALeidos:[],
      arrayDocumentos:[],
      codigosPerdidos:false,
      porcentaje:0,
      rtipoVenta:0,
      periodo_id:0,
      periodoDescripcion:'',
      nombreInstitucion: "",
      institucion_id:0,
      totalAleer:0,
      groupedData:[],
      checkBloqueados:false,
      totalItemsDocumentos:0,
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    localStorage.removeItem('tit_archivo_excel');
    me.getTipoVenta()
  },

  props:{
    pedido:{
      type:Object,
      default:{}
    },
    showAgrupado:{
      type:String,
      default:0
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','userAsesor']),
    sumaTotal(){
      let me = this;
      let total = me.informacion.length
      return total
    },
    SumaVentaDirecta(){
      let me = this;
      let datos       = me.informacion.filter(p => p.venta_estado == '1')
      let resultado   = datos.length
      return resultado
    },
    SumaVentaLista(){
      let me = this;
      let datos       = me.informacion.filter(p => p.venta_estado == '2')
      let resultado   = datos.length
      return resultado
    },
    SumaEnviados(){
      let me = this;
      //venta directa
      let datos       = me.informacion.filter(p => p.venta_estado == '1')
      let totalVD   = datos.length
      let datos2       = me.informacion.filter(p => p.venta_estado == '2')
      //venta lista
      let totalVL   = datos2.length
      let resultado = totalVD + totalVL
      return resultado
    },
    SumaCodigosDevolucion(){
      let me = this;
      let datos       = me.informacion.filter(p => p.estado_liquidacion == '3');
      let resultado   = datos.length
      return resultado
    },
    sumaCodigosRegalados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosBloqueados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado_liquidacion != '3');
      let datos         = primerFiltro.filter(p => p.estado == '2')
      let resultado     = datos.length
      return resultado
    },
    sumarCodigosLiquidados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosLeidos(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos        = primerFiltro.filter(p => p.bc_estado =='2')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosNoleidos(){
      let me = this;
      let primerFiltro          = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos                 = primerFiltro.filter(p => p.bc_estado =='1')
      let resultado             = datos.length
      return resultado
    }
  },
  methods:{
    getTipoVenta() {
      let me = this;
      me.informacion = [];
      me.tmpinformacion = [];
      me.arrayDocumentos = []
      me.totalItemsDocumentos = 0
      me.nombreInstitucion = me.pedido.nombreInstitucion;
      me.institucion_id = me.pedido.idInstitucion;
      me.periodoDescripcion = me.pedido.periodo;
      me.periodo_id = me.pedido.periodo_id;
      me.titulo = 'Detalle de venta de ' + me.pedido.nombreInstitucion;
      localStorage.setItem('tit_archivo_excel', 'Despacho-codigos-' + me.pedido.nombreInstitucion)
      me.$vs.loading();

      this.$http.get(this.$server_url + 'getTipoVenta?institucion_id=' + me.pedido.idInstitucion + '&periodo_id=' + me.pedido.periodo_id)
        .then(function (res) {
          me.informacion = res.data.tipoVenta;
          me.arrayDocumentos = res.data.documentos
          me.totalItemsDocumentos = me.arrayDocumentos.reduce((acc, p) => acc + (p.cantidad_codigos || 0),0)
          let datos = res.data.tipoVenta.filter(p => p.estado_liquidacion != '3' && p.estado_liquidacion != '4' && p.estado != '2');

          // Objeto para almacenar los grupos
          me.groupedData = [];

          // Itera a través de los elementos del array
          datos.forEach(item => {
            const libro = item.libro;
            const ventaEstado = item.venta_estado;
            const codigo_liquidacion = item.codigo_liquidacion;

            // Busca si ya existe un objeto con el mismo libro en groupedData
            const existingGroup = me.groupedData.find(group => group.libro === libro);

            // Si no existe, crea un nuevo objeto con los campos para cantidad, venta_directa y lista
            if (!existingGroup) {
              let ventaDirecta = (ventaEstado == '1') ? 1 : 0; // Si venta_estado es 1 (directa), contar 1, sino 0
              let ventaLista = (ventaEstado == '2') ? 1 : 0; // Si venta_estado es 2 (lista), contar 1, sino 0

              me.groupedData.push({
                libro,
                cantidad: 1,
                ventaDirecta,  // Contador para venta directa
                ventaLista,     // Contador para lista
                codigo_liquidacion,
              });
            } else {
              // Si existe, incrementa la cantidad en el objeto existente
              existingGroup.cantidad++;
              // Incrementar los contadores correspondientes a venta_directa y venta_lista
              if (ventaEstado == '1') {
                existingGroup.ventaDirecta++;
              } else if (ventaEstado == '2') {
                existingGroup.ventaLista++;
              }
            }
          });

          // Aquí puedes realizar cualquier acción posterior con groupedData
          me.verTipoVenta();
          me.$vs.loading.close();
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
        });
    },
    filterAgrupado(){
      let me = this
      let datos = []
      if(me.checkBloqueados){
        datos = me.informacion.filter(p => p.estado_liquidacion != '3' && p.estado_liquidacion != '4')
      }else{
        datos = me.informacion.filter(p => p.estado_liquidacion != '3' && p.estado_liquidacion != '4' && p.estado != '2')
      }
      // Objeto para almacenar los grupos
      me.groupedData = [];
      // Itera a través de los elementos del array
      datos.forEach(item => {
        const libro = item.libro;
        const ventaEstado = item.venta_estado;
        const codigo_liquidacion = item.codigo_liquidacion;

        // Busca si ya existe un objeto con el mismo libro en groupedData
        const existingGroup = me.groupedData.find(group => group.libro === libro);

        // Si no existe, crea un nuevo objeto con los campos para cantidad, venta_directa y lista
        if (!existingGroup) {
          let ventaDirecta = (ventaEstado == '1') ? 1 : 0; // Si venta_estado es 1 (directa), contar 1, sino 0
          let ventaLista = (ventaEstado == '2') ? 1 : 0; // Si venta_estado es 2 (lista), contar 1, sino 0

          me.groupedData.push({
            libro,
            cantidad: 1,
            ventaDirecta,  // Contador para venta directa
            ventaLista,     // Contador para lista
            codigo_liquidacion,
          });
        } else {
          // Si existe, incrementa la cantidad en el objeto existente
          existingGroup.cantidad++;
          // Incrementar los contadores correspondientes a venta_directa y venta_lista
          if (ventaEstado == '1') {
            existingGroup.ventaDirecta++;
          } else if (ventaEstado == '2') {
            existingGroup.ventaLista++;
          }
        }
      });
    },
    verTipoVenta(){
      let me = this;
      me.tmpinformacion   = []
      let datos           = me.informacion
      if(me.rtipoVenta == 0){
        me.tmpinformacion = datos
        return
      }
      me.tmpinformacion = datos.filter(p => p.venta_estado == me.rtipoVenta)
      me.totalAleer     = me.tmpinformacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado == 1));
    },
    cambiarALeidos(){
      let me = this
      if(me.institucion_id  <  1){
        me.$vs.notify({
        text:'Seleccione una institucion',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.periodo_id == null || me.periodo_id == 0 || me.periodo_id == undefined || me.periodoDescripcion == ""){
        me.$vs.notify({
        text:'Seleccione una período',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.tmpinformacion.length == 0){
        me.$vs.notify({
        text:'No hay códigos por leer ',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      //setear valores
      let datoFilter = me.tmpinformacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado == 1));
      if(datoFilter.length == 0){
        me.$vs.notify({
        text:'No hay códigos por leer ',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      var sendEnviar = []
      me.tmpinformacion.forEach(element => {
        var cal = new Object();
        cal.codigo = element.codigo
        sendEnviar.push(cal)
      });
      me.$vs.loading()
      let json_codigos = JSON.stringify(sendEnviar)
      let formData = new FormData();
      formData.append('data_codigos',     json_codigos);
      formData.append('id_usuario',       me.usuario.idusuario);
      formData.append('periodo_id',       me.periodo_id);
      formData.append('institucion_id',   me.institucion_id)
      formData.append('nombreInstitucion',me.nombreInstitucion)
      formData.append('nombrePeriodo',    me.periodoDescripcion)
      formData.append('venta_estado',     me.rtipoVenta)
      // this.$http.post(this.$server_url+'codigos/leidos/venta_directa', formData)
      this.$http.post(this.$server_url+'codigos/importar', formData)
      .then(res => {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
          }
          me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.codigosPerdidos    = true
          me.codigosLeidos      = res.data.codigosLeidos
          me.codigosNoCambiados = res.data.codigosNoCambiados
          me.codigoNoExiste     = res.data.codigoNoExiste
          me.porcentaje         = res.data.cambiados
          me.getTipoVenta()
      })
      .catch(function (error) {
          me.$vs.notify({
          text:'Verifique que la información se haya guardado correctamente.',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'})
          me.$vs.loading.close()
      })
    },
  }
}
</script>
