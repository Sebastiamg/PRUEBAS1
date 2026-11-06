<template>
  <div>
    <p class="text-center font-bold text-2xl text-success"><i class="fa-solid fa-print"></i> Reporte de pedidos - Guias</p>
    <div class="mt-1">
      <vx-card>
        <p>Seleccione el libro</p>
        <div class="flex">
          <v-select :options="arrayBooks" @input="f_getReporteLibrosGuias();" :reduce="arrayBooks => arrayBooks.codigo_liquidacion" label="codigolibro" class="w-full mt-2" v-model="libroSelected" />
          <vs-button class="ml-2" style="margin-top: 2px;" @click="f_getReporteLibrosGuias();">Buscar</vs-button>
        </div>
      </vx-card>
      <vx-card class="mt-5">
        <vs-button @click="exportarExcel();" class="mt-2" v-if="arrayLibrosPedidos.length > 0" color="success"><i class="fa-solid fa-file-excel"></i> Exportar</vs-button>
        <!-- <p class="bg-uno title-uno"><i class="fa-solid fa-cart-shopping"></i>Reporte</p> -->
        <vs-table max-items="10" stripe search pagination :data="arrayLibrosPedidos">
          <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arrayLibrosPedidos.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>#</vs-th>
              <vs-th>Asesor</vs-th>
              <vs-th>Guias</vs-th>
              <vs-th>Escuelas</vs-th>
              <vs-th></vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{tr.id_asesor}}
                </vs-td>
                  <vs-td>
                      {{data[indextr].asesor}}<br>
                  </vs-td>
                  <vs-td>
                     <div v-if="tr.guias.length > 0">
                        <b>{{ tr.guias[0].valor }}</b>
                     </div>
                      <div v-else>
                          <p>No se encontraron guias</p>
                      </div>
                  </vs-td>
                  <vs-td>
                    <b>{{tr.totalLibrosConPedido }}</b>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.pedidos.length > 0">
                      <!--cantidad de escuelas con length mayor a cero-->
                      <!-- <p class="text-primary">Escuelas: {{ tr.pedidos.length }}</p> -->
                      <!-- <p>Escuelas que han pedido el libro {{tr.totalLibrosConPedido }}</p> -->
                      <vs-collapse>
                        <vs-collapse-item icon-arrow="label">
                          <div slot="header">
                            <i class="fa-regular fa-circle-check"></i> Ver escuelas
                          </div>
                          <p class="text-primary">Escuelas: {{ tr.pedidos.length }}</p>
                           <br><br>
                           <table>
                            <tr>
                              <th>Nombre</th>
                              <!-- <th>Libros</th> -->
                            </tr>
                            <tr v-for="(item,key) in tr.pedidos" :key="key">
                              <td>{{ item.nombreInstitucion }}</td>
                              <!-- <td> -->
                                <!-- {{ item.librosEscuela }} -->
                                  <!-- <div v-if="item.librosEscuela.length > 0">
                                    <p>si</p>
                                  </div>
                                  <div v-else>
                                    <p>no</p>
                                  </div> -->
                              <!-- </td> -->
                            </tr>
                          </table>
                        </vs-collapse-item>

                       </vs-collapse>

                    </div>
                    <div v-else>
                        <p>No se encontraron guias de ese libro en pedidos de escuelas </p>
                    </div>
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </vx-card>
      <!-- <vx-card class="mt-5" v-if="asesorSelect">
        <p class="bg-uno title-uno"><i class="fa-solid fa-cart-shopping"></i> Pedidos del asesor</p>
      </vx-card> -->
      <!-- <vx-card class="mt-5" v-if="asesorSelect">
        <p class="bg-uno title-uno"><i class="fa-solid fa-book"></i> Guias del asesor</p>
        <div class="mt-5">
          <p>Seleccione el período</p>
          <v-select :options="arrayPeriodos" @input="f_getGuias();" :reduce="arrayPeriodos => arrayPeriodos" label="periodoescolar" class="w-full mt-2" v-model="periodoSelect" />
        </div>
        <br>
        <div v-if="arrayGuias.length > 0">
          <TablaReportePedidoBodegaVue class="mt-3" :nombrePeriodo="periodoSelect.periodoescolar" :arrayCodigos="arrayGuias" :ifpuntoVenta="Number(4)" :tipoCode="String('')" :totalValores="totalValoresGuias" :totalLibros="totalLibrosGuias"/>
        </div>
        <div v-else>
          <p class="mt-3 font-bold text-center">No hay guias para mostrar</p>
        </div>
      </vx-card> -->
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import LibroRepository from '../../../../../repositories/LibroRepository';
import PedidosRepository from '../../../../../repositories/PedidosRepository';
import PeriodoRepository from '../../../../../repositories/PeriodoRepository';
import Generalmix from '../../../../../mixins/Generalmix';
const TablaReportePedidoBodegaVue = () => import('./TablaReportePedidoBodega.vue');
import Codigosmix from '../../../../../mixins/Codigosmix';
export default {
  mixins: [Generalmix,Codigosmix],
  components: {
    vSelect,
    TablaReportePedidoBodegaVue
  },
  data() {
    return{
      arrayAsesores:[],
      arrayPeriodos:[],
      arrayGuias:[],
      arrayLibrosPedidos:[],
      asesorSelect:'',
      periodoSelect:'',
      totalValoresGuias:0,
      totalLibrosGuias:0,
      arrayBooks:[],
      libroSelected:'',
      mixinIdInicioFormatoNewData: null,
    }
  },
  mounted() {
    let me = this;
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
    me.getBooks();
    me.obtenerPeriodos()
      .then(() => {
        me.periodoSelect = me.arrayPeriodos.filter(p => p.idperiodoescolar == me.periodo_id)[0];
      })
      .catch(error => {
        console.error("Error al obtener periodos:", error);
      });
  },
  props:{
    periodo_id:{
      type:Number,
      default:0
    },
    nombrePeriodo:{
      type:String,
      default:''
    }
  },
  methods:{
    exportarExcel(){
      let me = this
      const headerTitle = new Set();
      headerTitle.add("Asesor");
      headerTitle.add("Guias");
      headerTitle.add("Escuelas");

      const headerVal = new Set();
      headerVal.add("asesor");
      headerVal.add("totalguias");
      headerVal.add("totalLibrosConPedido");
      //exportar a excel
      let nombrearchivo = ""
      nombrearchivo ="_reporte_guias_escuelas"
      me.m_exportTodo(headerTitle,headerVal,me.arrayLibrosPedidos,me.nombrePeriodo+nombrearchivo)
    },
    getBooks() {  LibroRepository.getAllBooks().then(r => { this.arrayBooks = r.data }); },
    // getAsesores(){
    //   let me = this
    //   PedidosRepository.rep_getAsesores().then(r => { me.arrayAsesores = r.data } )
    // },
    obtenerPeriodos() {
      let me = this;
      return PeriodoRepository.getPeriodos().then(p => {
        me.arrayPeriodos = p.data;
      });
    },
    f_getReporteLibrosGuias(){
      let me = this
      me.arrayLibrosPedidos = []
      if(me.libroSelected == "" || me.libroSelected == null || me.libroSelected == undefined) { me.m_message("Seleccione el libro","warning"); return }

      // Usar siempre el método unificado _new que soporta ambos periodos automáticamente
      let url = `metodosGetCodigos?getReporteLibrosAsesores_new=1&periodo=${me.periodo_id}&codigo=${me.libroSelected}`

      me.$vs.loading()
      this.$http.get(this.$server_url+url)
      .then(function (res) {
        me.$vs.loading.close()
        me.arrayLibrosPedidos = res.data
        if(me.arrayLibrosPedidos.length == 0) { me.m_message("No se encontraron libros","warning"); return }
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
    }
    // f_librosPedidos(){
    //   let me = this
    //   me.arrayLibrosPedidos = []
    //   if(me.asesorSelect == "" || me.asesorSelect == null || me.periodo_id == "" || me.periodo_id == null) { me.m_message("Seleccione el asesor y el periodo","warning"); return }
    //   let url = `pedidos2/pedidos?geAllLibrosxAsesorEscuelas=1&asesor_id=${me.asesorSelect}&periodo_id=${me.periodo_id}`
    //   me.$vs.loading()
    //   this.$http.get(this.$server_url+url)
    //   .then(function (res) {
    //     me.$vs.loading.close()
    //     me.arrayLibrosPedidos = res.data
    //     // if(me.arrayGuias.length == 0) { me.m_message("No se encontraron libros","warning"); return }
    //     // //separar en un array la propiedad codigos_combos porque tiene comas
    //     // // Inicializa el array que va a almacenar todos los resultados
    //     // me.totalValoresGuias   = me.arrayGuias.reduce((acc, obj) => acc + (parseFloat(obj.precio) || 0), 0);
    //     // //sumar la cantidad
    //     // me.totalLibrosGuias    = me.arrayGuias.reduce((acc,obj) => acc + (parseFloat(obj.valor) || 0), 0 )
    //   })
    //   .catch(function (error) {
    //     me.$vs.loading.close()
    //     me.$vs.notify({
    //       title: 'Error',
    //       text: 'Error al cargar los datos de libros',
    //       color: 'danger',
    //       iconPack: 'feather',
    //       icon: 'icon-alert-circle'
    //     })
    //       console.log(error + ' error');
    //   })
    // },
    // f_getGuias(){
    //   let me = this
    //   me.arrayGuias = []
    //   me.totalValoresGuias = 0
    //   me.totalLibrosGuias  = 0
    //   if(me.asesorSelect == "" || me.asesorSelect == null || me.periodoSelect == "" || me.periodoSelect == null) { me.m_message("Seleccione el asesor y el periodo","warning"); return }
    //   let url = `pedidos2/pedidos?geAllGuiasxAsesor=1&asesor_id=${me.asesorSelect}&periodo_id=${me.periodoSelect.idperiodoescolar}`
    //   me.$vs.loading()
    //   this.$http.get(this.$server_url+url)
    //   .then(function (res) {
    //     me.$vs.loading.close()
    //     me.arrayGuias = res.data
    //     if(me.arrayGuias.length == 0) { me.m_message("No se encontraron guias","warning"); return }
    //     //separar en un array la propiedad codigos_combos porque tiene comas
    //     // Inicializa el array que va a almacenar todos los resultados
    //     me.totalValoresGuias   = me.arrayGuias.reduce((acc, obj) => acc + (parseFloat(obj.precio) || 0), 0);
    //     //sumar la cantidad
    //     me.totalLibrosGuias    = me.arrayGuias.reduce((acc,obj) => acc + (parseFloat(obj.valor) || 0), 0 )
    //   })
    //   .catch(function (error) {
    //     me.$vs.loading.close()
    //     me.$vs.notify({
    //       title: 'Error',
    //       text: 'Error al cargar los datos de guias',
    //       color: 'danger',
    //       iconPack: 'feather',
    //       icon: 'icon-alert-circle'
    //     })
    //       console.log(error + ' error');
    //   })
    // },
  }
}
</script>
<style scoped>
.bg-uno{
  background-color: #ebedef;
}
.title-uno{
  border:2px solid #d5dbdb;
  padding: 15px;
  border-radius: 10px;
}
</style>
