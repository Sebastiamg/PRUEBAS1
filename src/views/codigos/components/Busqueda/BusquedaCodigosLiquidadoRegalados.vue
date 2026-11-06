<template>
    <div>
      <vx-card>
        <div class="vx-row">
          <div class="vx-col w-1/2">
            <span class="font-semibold">Seleccione la región</span>
            <ul class="flex mt-2" style="flex-wrap: wrap;">
              <li class="mr-4">
                <label class="radio-label">
                  <input type="radio" v-model.number="tipoRegion" :value="1" @change="actualizarPeriodos" class="radio-input">
                  <span class="radio-text">Sierra</span>
                </label>
              </li>
              <li class="mr-4">
                <label class="radio-label">
                  <input type="radio" v-model.number="tipoRegion" :value="2" @change="actualizarPeriodos" class="radio-input">
                  <span class="radio-text">Costa</span>
                </label>
              </li>
            </ul>
          </div>
          <div class="vx-col w-1/2">
            <span>Seleccione el período</span>
            <v-select
              :options="arrayPeriodos"
              :reduce="periodo => periodo.idperiodoescolar"
              label="periodoescolar"
              class="w-full mt-2"
              v-model="periodoSelected"
              @input="filtrarInstituciones();"
            />
          </div>
        </div>
        <!--instituciones-->
        <div class="vx-row mt-5">
            <div class="vx-col w-full">
                <span>Seleccione la institución (Debe seleccionar un período para filtrar las instituciones)</span>
                <div class="flex">
                    <v-select
                    :options="arrayInstituciones"
                    :reduce="institucion => institucion.idInstitucion"
                    label="nombreInstitucion"
                    class="w-full mt-2"
                    v-model="institucionSelected"
                    @input="filtrarReporte()"
                    />
                    <!--boton para filtar-->
                    <vs-button color="primary" @click="filtrarReporte()" class="ml-2 mb-2 mt-2" type="filled">
                        Filtrar
                    </vs-button>
                </div>
            </div>
        </div>
        <!--tabla de reportes-->
        <div class="vx-row mt-5">
            <div class="vx-col w-full">
                <div>
                    <!--total codigos sumar liquidados y regalados-->
                    <p>Total codigos liquidados: {{ cantidadCodigosLiquidados }}</p>
                    <p>Total codigos regalados: {{ cantidadCodigosRegalados }}</p>
                    <vs-divider></vs-divider>
                    <div v-if="regaladosReporteNuevo == 1">
                      <p>Total codigos regalados 100%: {{ cantidadCodigosRegalados100p }}</p>
                      <p>Total codigos regalados otros descuentos: {{ cantidadCodigosRegaladosOtrosDesc }}</p>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="mb-4">
                    <span class="font-semibold">Mostrar Tabla:</span>
                    <ul class="flex mt-2" style="flex-wrap: wrap;">
                        <li class="mr-4">
                            <label class="radio-label">
                                <input type="radio" v-model.number="tipoTabla" :value="0" class="radio-input">
                                <span class="radio-text">Individual</span>
                            </label>
                        </li>
                        <li class="mr-4">
                            <label class="radio-label">
                                <input type="radio" v-model.number="tipoTabla" :value="1" class="radio-input">
                                <span class="radio-text">Agrupado</span>
                            </label>
                        </li>
                    </ul>
                </div>
                <div v-if="tipoTabla == 0">
                    <vs-table max-items="10" search pagination :data="arrayReporteIndividual">
                        <template slot="header">
                            <vs-chip color="primary">Cantidad: <b> {{ arrayReporteIndividual.length }}</b></vs-chip>
                            <vs-button color="success" class="mb-2 p-3 ml-3" @click="exportar"><i class="fa-solid fa-download"></i> Exportar</vs-button>
                        </template>
                        <template slot="thead">
                            <vs-th>Código</vs-th>
                            <vs-th>codigo liquidación</vs-th>
                            <vs-th>Estado codigo</vs-th>
                            <vs-th>Plus</vs-th>
                            <vs-th>Liquidado Devuelto</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].codigo_libro}}<br>
                                    <b>Libro:</b>
                                    <p>{{ tr.nombrelibro }}</p>
                                    <b v-if="tr.combo">Combo:</b>
                                    <p v-if="tr.combo">{{ tr.combo }}</p>
                                    <b v-if="tr.codigo_combo">Combo Generado:</b>
                                    <p v-if="tr.codigo_combo">{{ tr.codigo_combo }}</p>
                                    <b v-if="tr.codigo_proforma">Documento:</b>
                                    <p v-if="tr.codigo_proforma">{{ tr.codigo_proforma }}</p>
                                    <b v-if="tr.proforma_empresa">Empresa documento:</b>
                                    <p>{{ tr.descripcion_empresa || 'Sin empresa' }}</p>
                                </vs-td>
                                <vs-td>
                                    {{data[indextr].codigo}}<br>
                                </vs-td>
                                <vs-td>
                                    <!--liquidado-->
                                    <div v-if="tr.estado_liquidacion == 0" style="background-color: #cefac7;padding: 10px;border-radius: 10px;">
                                       <p>{{ tr.estado_codigo }}</p>
                                    </div>
                                    <div v-if="tr.estado_liquidacion == 2" style="background-color: #faedc7;padding: 10px;border-radius: 10px;">
                                        <p>{{ tr.estado_codigo }}</p>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <p>{{ tr.plus }}</p>
                                </vs-td>
                                <vs-td>
                                  {{ tr.quitar_de_reporteTexto }}
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-if="tipoTabla == 1">
                  <TableReutilizableVue
                        v-if="regaladosReporteNuevo == 0"
                        :title="'Agrupados'"
                        :ifexportar="Number(1)"
                        :nombrearchivo="nombrearchivo"
                        :headers="['Libro','Código','Liquidados','Regalados Escuela','Regalos 100%']"
                        :fieldKeys="['libro','codigo_liquidacion','liquidados','regalados','regalados_100p']"
                        :tableData="arrayReporte"
                    />
                    <TableReutilizableVue
                        v-if="regaladosReporteNuevo == 1"
                        :title="'Agrupados'"
                        :ifexportar="Number(1)"
                        :nombrearchivo="nombrearchivo"
                        :headers="['Libro','Código','Cantidad']"
                        :fieldKeys="['libro','codigo_liquidacion','cantidad']"
                        :tableData="arrayReporte"
                    />
                </div>
            </div>
        </div>
        <br><br><br><br><br><br><br><br><br><br>
      </vx-card>
    </div>
  </template>

  <script>
    import vSelect from 'vue-select'
    import PeriodoRepository from '@/repositories/PeriodoRepository'
    import Generalmix from '../../../../mixins/Generalmix';
    import Codigosmix from "@/mixins/Codigosmix";
    const TableReutilizableVue              = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
    export default {
        mixins: [Generalmix, Codigosmix],
        components: {
            vSelect,
            TableReutilizableVue,
        },
        data() {
            return {
                arrayPeriodos: [],
                todosLosPeriodos: [],
                arrayInstituciones: [],
                arrayReporte: [],
                arrayReporteIndividual: [],
                arrayCombos: [],
                periodoSelected: '',
                institucionSelected: '',
                tipoRegion: 1,
                nombrearchivo:'',
                cantidadCodigosLiquidados:0,
                cantidadCodigosRegalados:0,
                cantidadCodigosRegalados100p: 0,
                cantidadCodigosRegaladosOtrosDesc: 0,
                tipoTabla:0,
                headers:[],
                fieldKeys:[],
                idPedido:0,
                arrayRegalados:[],
                regaladosReporteNuevo: 0,
                dataTodoIndividuales: [],
            }
        },
        async mounted() {
            await this.obtenerPeriodos();
        },
        methods: {
            async obtenerPeriodos() {
                try {
                    // Solo consultar si no tiene datos en caché
                    if (this.todosLosPeriodos.length === 0) {
                        const response = await PeriodoRepository.getPeriodos();
                        this.todosLosPeriodos = response.data;
                    }
                    this.filtrarPeriodos();
                } catch (error) {
                    console.error('Error obteniendo periodos:', error);
                }
            },
            filtrarPeriodos() {
                this.arrayPeriodos = this.todosLosPeriodos.filter(p => p.region_idregion == this.tipoRegion);
            },
            actualizarPeriodos() {
                this.periodoSelected            = '';
                this.institucionSelected        = '';
                this.arrayPeriodos              = [];
                this.arrayInstituciones         = [];
                this.arrayReporte               = [];
                this.arrayReporteIndividual     = [];
                this.cantidadCodigosLiquidados  = 0;
                this.cantidadCodigosRegalados   = 0;
                this.tipoTabla                  = 0;
                // Solo filtrar, sin consultar al servidor
                this.filtrarPeriodos();
            },
            async filtrarInstituciones() {
                let me = this;
                me.institucionSelected = '';
                me.arrayReporte                 = [];
                me.arrayReporteIndividual       = [];
                me.arrayCombos                  = [];
                me.nombrearchivo                = '';
                me.cantidadCodigosLiquidados    = 0;
                me.cantidadCodigosRegalados     = 0;
                try {
                  if(me.periodoSelected == "" || me.periodoSelected == null || me.periodoSelected == undefined){
                      me.arrayInstituciones = [];
                      me.$vs.notify({
                          title: 'Advertencia',
                          text: 'Debe seleccionar un período para cargar las instituciones',
                          color: 'warning',
                          position: 'top-right',
                      });
                  }
                    me.$vs.loading()
                    const response = await this.$http.get(`${this.$server_url}institucion?listaInstitucionesActivaXRegion=yes&periodo=${this.periodoSelected}`);
                    this.arrayInstituciones = response.data;
                } catch (error) {
                    console.log('Error al filtrar instituciones:', error);
                }
                finally{
                    me.$vs.loading.close()
                }
            },

            async filtrarReporte(){
                let me                          = this;
                me.arrayReporte                 = [];
                me.arrayReporteIndividual       = [];
                me.arrayCombos                  = [];
                me.nombrearchivo                = '';
                me.cantidadCodigosLiquidados    = 0;
                me.cantidadCodigosRegalados     = 0;
                if(me.periodoSelected == "" || me.periodoSelected == null || me.periodoSelected == undefined){
                    me.m_message('Debe seleccionar un periodo','danger')
                    return false;
                }
                me.regaladosReporteNuevo = me.arrayPeriodos.find(p => p.idperiodoescolar == me.periodoSelected).regaladosReporteNuevo;
                if(me.institucionSelected == "" || me.institucionSelected == null || me.institucionSelected == undefined){
                    me.m_message('Debe seleccionar una institución','danger')
                    return false;
                }
                try{
                    me.$vs.loading()
                    const url = `n_verificacion?getAllCodigosXContrato_new=1&periodo_id=${this.periodoSelected}&institucion_id=${this.institucionSelected}&porInstitucion=1&sinPrecio=1`
                    const response = await this.$http.get(this.$server_url+url);
                    if(response.data.status == 0){
                        me.m_message(response.data.mensaje,'danger')
                        return false;
                    }
                    if(response.data.length == 0){
                        me.m_message('No se encontro códigos para el período seleccionado','warning')
                        return false;
                    }
                    me.idPedido                 = response.data[0].id_pedido;
                    me.contratoEscuela          = response.data[0].contrato;
                    me.arrayReporteIndividual   = response.data.filter(p =>
                        (p.quitar_de_reporte != '1') &&
                        // (p.combo == null || p.combo == '') &&
                        // (p.codigo_combo == null || p.codigo_combo == '') &&
                        (p.tipo_codigo == '0') &&
                        (p.estado_liquidacion == '0' || p.estado_liquidacion == '2')
                    );
                    //se obtiene los combos
                    me.arrayCombos = response.data.filter(p => p.tipo_codigo == '1')

                    if(me.arrayReporteIndividual.length == 0){
                        me.m_message('No se encontro códigos para el período seleccionado','warning')
                        return false;
                    }
                    me.nombrearchivo = 'Reporte_'+this.arrayPeriodos.find(x => x.idperiodoescolar == this.periodoSelected).periodoescolar+'-'+this.arrayInstituciones.find(x => x.idInstitucion == this.institucionSelected).nombreInstitucion

                    //ordenar por nombrelibro el arrayReporteIndividual
                    me.arrayReporteIndividual.sort((a, b) => a.nombrelibro.localeCompare(b.nombrelibro));
                    //estado_liquidacion = 0 => liquidado , 2 => regalado
                    me.arrayReporteIndividual = me.arrayReporteIndividual.map(p => {
                        if (p.estado_liquidacion == '0') {
                            p.estado_codigo = 'Liquidado';
                        }
                        if (p.estado_liquidacion == '2') {
                            p.estado_codigo = 'Regalado';
                        }
                        //plus si es 0 => es no y 1 => es si
                        if(p.plus == 0){
                            p.plus = '';
                        }else{
                            p.plus = 'Si';
                        }
                        //plus si es 0 => es no y 1 => es si
                        if(p.quitar_de_reporte == 1){
                            p.quitar_de_reporteTexto = 'Si';
                        }else{
                            p.quitar_de_reporteTexto = '';
                        }
                        return p;
                    });
                    // despues de sierra 2024 para obtener agrupar por actas los codigos regalados
                    if (me.regaladosReporteNuevo == 1) {
                      me.f_agruparCodigosNuevo(me.arrayReporteIndividual)
                    }else{
                      //agregar actas obsequios si no es sierra 2024
                      me.f_agruparCodigos(me.arrayReporteIndividual)
                    }
                }
                catch(error){
                    console.log('Error al filtrar reportes:', error);
                    me.m_message('Ocurrio un error al filtrar los reportes','danger')
                }
                finally{
                    me.$vs.loading.close()
                }
            },
            f_agruparCodigos(datos){
              let me = this
              let predatos = datos.filter(p =>
                  (p.quitar_de_reporte != '1') &&
                  ((p.combo == null || p.combo == '') || (p.codigo_combo == null || p.codigo_combo == '')) &&
                  (p.tipo_codigo == '0') &&
                  (p.estado_liquidacion == '0' || p.estado_liquidacion == '2')
              );
              me.dataTodoIndividuales = datos.filter(p =>
                  (p.quitar_de_reporte != '1') &&
                  (p.tipo_codigo == '0') &&
                  (p.estado_liquidacion == '0' || p.estado_liquidacion == '2')
              );
              if(predatos.length == 0){
                  me.m_message('No se encontro códigos para el período seleccionado','warning')
                  return false;
              }

              //sumar la cantidad de codigos liquidados y regalados con reduce
              me.cantidadCodigosLiquidados = me.dataTodoIndividuales.filter(p => p.estado_liquidacion == '0').length;
              me.cantidadCodigosRegalados  = me.dataTodoIndividuales.filter(p => p.estado_liquidacion == '2').length;
              predatos.forEach(item => {
                  const libro                       = item.nombrelibro;
                  const codigo_liquidacion          = item.codigo;
                  //contar cuantos liquidadosy regalados por libro
                  const liquidados                  = predatos.filter(p => p.nombrelibro == libro && p.estado_liquidacion == '0').length;
                  const regalados                   = predatos.filter(p => p.nombrelibro == libro && p.estado_liquidacion == '2').length;
                  const regalados_100p              = 0;
                  // Busca si ya existe un objeto con el mismo libro en groupedData
                  const existingGroup = me.arrayReporte.find(group => group.libro === libro);
                  // Si no existe, crea un nuevo objeto y agrégalo a groupedData
                  if (!existingGroup) {
                      me.arrayReporte.push({ libro, codigo_liquidacion,  cantidad: 1, liquidados, regalados, regalados_100p });
                  } else {
                      // Si existe, incrementa la cantidad en el objeto existente
                      existingGroup.cantidad++;
                  }
              });
              let predatosCombos = []
              //formatear combos
              me.arrayCombos.forEach(item => {
                  const libro                       = item.nombrelibro;
                  const codigo_liquidacion          = item.codigo;
                  const liquidados                  = item.cantidad_items;
                  const regalados                   = 0;
                  const regalados_100p              = 0;
                  // Busca si ya existe un objeto con el mismo libro en groupedData
                  const existingGroup = predatosCombos.find(group => group.libro === libro);
                  // Si no existe, crea un nuevo objeto y agrégalo a groupedData
                  if (!existingGroup) {
                      predatosCombos.push({ libro, codigo_liquidacion, liquidados, regalados, regalados_100p });
                  }else{
                  }
              });

              //unir codigos agrupados con combos y obsequios 100%
              me.arrayReporte = [
              ...me.arrayReporte,
              ...predatosCombos,
              ].sort((a, b) => a.libro.localeCompare(b.libro));
            },
            f_agruparCodigosNuevo(datos){
              let me = this
              let predatos = datos.filter(p =>
                (p.quitar_de_reporte != '1') &&
                ((p.combo == null || p.combo == '') || (p.codigo_combo == null || p.codigo_combo == '')) &&
                (p.tipo_codigo == '0') &&
                (p.estado_liquidacion == '0' || p.estado_liquidacion == '2')
              );

              me.dataTodoIndividuales = datos.filter(p =>
                  (p.quitar_de_reporte != '1') &&
                  (p.tipo_codigo == '0') &&
                  (p.estado_liquidacion == '0' || p.estado_liquidacion == '2')
              );
              if(predatos.length == 0 && this.arrayCombos.length == 0){
                me.m_message('No se encontro códigos para el período seleccionado','warning')
                return false;
              }

              //sumar la cantidad de codigos liquidados y regalados con reduce
              me.cantidadCodigosLiquidados         = me.dataTodoIndividuales.filter(p => p.estado_liquidacion == '0').length;
              me.cantidadCodigosRegalados          = me.dataTodoIndividuales.filter(p => p.estado_liquidacion == '2').length;
              me.cantidadCodigosRegalados100p      = me.dataTodoIndividuales.filter(p => p.estado_liquidacion == '2' && p.descuento == 100).length;
              me.cantidadCodigosRegaladosOtrosDesc = me.dataTodoIndividuales.filter(p => p.estado_liquidacion == '2' && p.descuento != 100).length;

              //liquidados
              let preLiquidados = predatos.filter(p => p.estado_liquidacion == '0');
              preLiquidados.forEach(item => {
                const libro                       = item.nombrelibro;
                const codigo_liquidacion          = item.codigo;
                // Busca si ya existe un objeto con el mismo libro en groupedData
                const existingGroup = me.arrayReporte.find(group => group.libro === libro);
                // Si no existe, crea un nuevo objeto y agrégalo a groupedData
                if (!existingGroup) {
                    me.arrayReporte.push({ libro, codigo_liquidacion,  cantidad: 1});
                } else {
                    // Si existe, incrementa la cantidad en el objeto existente
                    existingGroup.cantidad++;
                }
              });

              // regalados
              let preRegalados = predatos.filter(p => p.estado_liquidacion == '2');
              preRegalados.forEach(item => {
                // Verifica si el descuento es nulo, undefined o vacío
                const descuento = item.descuento ? item.descuento + "%" : "sin acta de %";
                const libro = item.nombrelibro + " - " + descuento;
                const codigo_liquidacion = item.codigo;

                // Busca si ya existe un objeto con el mismo libro en groupedData
                const existingGroup = me.arrayReporte.find(group => group.libro === libro);

                if (!existingGroup) {
                  me.arrayReporte.push({ libro, codigo_liquidacion, cantidad: 1 });
                } else {
                  existingGroup.cantidad++;
                }
              });
              let predatosCombos = []
              //formatear combos
              me.arrayCombos.forEach(item => {

                const idtipodoc = item.idtipodoc || 0;
                let libro = ""; // <- declarar aquí

                if (idtipodoc == 2 || idtipodoc == 4) {
                  const descuentoTexto = item.descuento ? item.descuento + "%" : "sin acta de %";
                  libro = item.nombrelibro + " - " + descuentoTexto;
                } else {
                  libro = item.nombrelibro;
                }

                const codigo_liquidacion = item.codigo;
                const cantidad = item.cantidad_items;

                // Busca si ya existe
                const existingGroup = predatosCombos.find(group => group.libro === libro);

                if (!existingGroup) {
                  predatosCombos.push({ libro, codigo_liquidacion, cantidad });
                }

              });


              //unir codigos agrupados con combos y obsequios 100%
              me.arrayReporte = [
              ...me.arrayReporte,
              ...predatosCombos,
              ].sort((a, b) => a.libro.localeCompare(b.libro));
            },
            exportar(){
                let me = this
                me.headers = ['Código','Codigo de liquidacion','Libro','Estado de liquidacion','Plus','Liquidado Devuelto','Combo','Combo Generado','Documento','Empresa Documento']
                me.fieldKeys = ['codigo_libro','codigo','nombrelibro','estado_codigo','plus','quitar_de_reporteTexto','combo','codigo_combo','codigo_proforma','descripcion_empresa']
                me.m_exportTodo(me.headers,me.fieldKeys,me.arrayReporteIndividual,me.nombrearchivo)
            },
        },
    }
  </script>

  <style scoped>
  .radio-label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 2px solid #e2e8f0;
    background-color: #ffffff;
  }

  .radio-label:hover {
    border-color: #7367f0;
    background-color: #f8f7ff;
  }

  .radio-input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e0;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    margin-right: 8px;
    transition: all 0.3s ease;
  }

  .radio-input:hover {
    border-color: #7367f0;
  }

  .radio-input:checked {
    border-color: #7367f0;
    background-color: #7367f0;
  }

  .radio-input:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ffffff;
  }

  .radio-label:has(.radio-input:checked) {
    border-color: #7367f0;
    background-color: #f8f7ff;
  }

  .radio-text {
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;
    user-select: none;
  }

  .radio-label:has(.radio-input:checked) .radio-text {
    color: #7367f0;
  }
  </style>
