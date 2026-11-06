<template>
    <div>
      <!-- <p><b>Documento de devolucion:</b> {{ ObjectSelected.codigo_devolucion }}</p> -->
      <vs-alert class="mt-2">
        <p>Solo las marcadas como <b>revisado</b> van a pasar como <b>devuelto</b> y solo esos códigos marcados podrá el <b>facturador</b> ver</p>
      </vs-alert>
      <vs-alert color="warning" class="mt-3" style="height: 100px;" v-if="ObjectSelected.importacion_con_combos == 1">
        <p>
          * Su documento de devolución es por combos. En la <b>pestaña de combos tiene que presionar Aceptar combos automaticos </b> al hacerlo va a aumentar
          el stock

        </p>
        <p> * Posterior a ello tiene que marcar como revisado los códigos de la pestaña Revisión</p>
      </vs-alert>
      <br>
        <div v-if="menu == 0">
          <!--clientes-->
            <nav class="breadcrumbs mt-3" style="display:flex;flex-wrap:wrap">
              <span v-for="(menu, index) in arrayCodigosEncontrados"  :key="index" :class="['breadcrumbs__item',  {'activeBtn': filtro === menu.id_cliente, 'customBackground': filtro === menu.id_cliente}]" @click="cambiarFiltro(menu)">
                {{ menu.data.length }}
                {{ menu.nombreInstitucion }}
              </span>
            </nav>
            <div class="flex justify-center mt-5" v-if="ObjectSelected.estado == 0 || ObjectSelected.estado == 1">
                <vs-button @click="f_confirm()" class="text-white"><i class="fa-solid fa-check-to-slot text-white"></i> Marcar como revisado {{ sumarCodigosRevisar }} códigos</vs-button>
            </div>
            <div v-else>
                <vs-alert color="success" class="mt-2">
                    <p class="text-center">Esta devolución ya fue finalizada</p>
                </vs-alert>
            </div>
            <!-- <div v-if="ObjectSelected.estado == 0 || ObjectSelected.estado == 1">
              <span>Obervaciones:</span>
              <vs-input v-model="observacion" placeholder="Observaciones" class="mt-2 w-full" />
            </div> -->
            <!--FILTROS-->
            <div class="mt-5">
              <ul style="display:flex;flex-wrap: wrap;">
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{ sumaTotal }}</span> Todos</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="1"><span class="font-bold">{{ sumarCodigosLiquidados }}</span> Liquidados</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="2"><span class="font-bold">{{ sumaCodigosRegaladosActa }}</span> Regalados / Actas sin liquidar</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span class="font-bold">{{ sumaCodigosRegaladosLiquidadosActa }}</span> Regalados / Actas liquidados</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="4"><span class="font-bold">{{ sumaCodigosRegalados }}</span> Regalados sin liquidar</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="5"><span class="font-bold">{{ sumaCodigosRegaladosLiquidados }}</span> Regalados liquidados</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="6"><span class="font-bold">{{ SumaCodigosCreados }}</span> Creados</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="7"><span class="font-bold">{{ SumaCodigosDevolucion }}</span> Devueltos</vs-radio>
                </li>
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="8"><span class="font-bold">{{ sumarCodigosGuias }}</span> GUIAS</vs-radio>
                </li>
                <!--combos-->
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="9"><span class="font-bold">{{ sumarCodigosCombos }}</span> Códigos con combo</vs-radio>
                </li>
                <!--plus-->
                <li class="m-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="10"><span class="font-bold">{{ sumarCodigosPlus }}</span> Plus</vs-radio>
                </li>
              </ul>
            </div>
            <div>
              <vs-table max-items="10" stripe search pagination :data="tmpArrayCodes">
                  <template slot="header">
                      <vs-chip  color="primary">Cantidad: <b class="text-white"> {{ tmpArrayCodes.length }}</b></vs-chip>
                  </template>
                  <template slot="thead">
                      <vs-th>Código</vs-th>
                      <vs-th>Documento</vs-th>
                      <vs-th>Devolver</vs-th>
                  </template>
                  <template slot-scope="{data}">
                      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                          <vs-td>
                            <!--plus-->
                            <div v-if="tr.plus == '1'" class="my-3">
                              <p><b style="background-color:#000 ;padding: 10px;color:white;border-radius: 5px;">Plus</b>
                              </p>
                            </div>
                            <b>Código</b>
                            <p>{{data[indextr].codigo}}</p>
                            <b>Libro:</b>
                            <p>{{ data[indextr].nombrelibro }}</p>
                            <b>Código Liquidación:</b>
                            <p>{{ data[indextr].pro_codigo }}</p>
                            <div v-if="tr.combo">
                              <b>Combo:</b>
                              <p style="background-color: #e6eb83; color: rgb(0, 0, 0);">{{ tr.combo }}</p>
                            </div>
                            <div v-if="tr.codigo_combo">
                              <b>Combo Generado:</b>
                              <p style="background-color: #ebc386; color: rgb(0, 0, 0);">{{ tr.codigo_combo }}</p>
                            </div>
                            <!--codigo_paquete-->
                            <div v-if="tr.codigo_paquete">
                              <b>Paquete:</b>
                              <p>{{ tr.codigo_paquete }}</p>
                            </div>

                            <span v-if="tr.documento_estado_liquidacion == 0" class="mt-2 font-semibold">Liquidado</span>
                            <span v-if="tr.documento_estado_liquidacion == 3" class="mt-2 font-semibold">Devuelto</span>
                            <span v-if="tr.documento_estado_liquidacion == 4" class="mt-2 font-semibold">GUIA</span>

                            <span v-if="tr.documento_estado_liquidacion == 2 && tr.documento_regalado_liquidado == 0 && tr.estado_codigo == '0'" class="mt-2 font-semibold">Regalado sin liquidar</span>
                            <span v-if="tr.documento_estado_liquidacion == 2 && tr.documento_regalado_liquidado == 1 && tr.estado_codigo == '0'" class="mt-2 font-semibold">Regalado Liquidado</span>
                            <span v-if="tr.documento_estado_liquidacion == 2 && tr.documento_regalado_liquidado == 0 && tr.estado_codigo == '2'" class="mt-2 font-semibold">Acta regalada sin liquidar</span>
                            <span v-if="tr.documento_estado_liquidacion == 2 && tr.documento_regalado_liquidado == 1 && tr.estado_codigo == '2'" class="mt-2 font-semibold">Acta regalada Liquidada</span>

                          </vs-td>
                          <vs-td>
                            <!--factura-->
                            <div v-if="tr.factura">
                              <b>Factura:</b>
                              <p>{{ tr.factura }}</p>
                            </div>
                            <!--documento-->
                            <div v-if="tr.documento">
                              <b>Documento:</b>
                              <p>{{ tr.documento }}</p>
                            </div>
                            <b>Período que se Empaqueto:</b>
                            <p>{{ tr.periodoescolar }}</p>
                            <b>Empresa:</b>
                            <p v-if="tr.descripcion_corta == null">No hay empresa </p>
                            <p v-else>{{tr.descripcion_corta}}</p>
                            <b>Cliente:</b>
                            <p v-if="tr.nombreInstitucion == null">No hay cliente </p>
                            <p v-else>{{tr.nombreInstitucion}}</p>
                          </vs-td>
                          <vs-td>
                            <span v-if="tr.estado == 1 || tr.estado == 2 ">
                                <vs-chip v-if="tr.estado == 1" color="primary">Revisado</vs-chip>
                                <vs-chip v-if="tr.estado == 2" color="success">Finalizado</vs-chip>
                            </span>
                            <span v-else class="mt-2">
                            <!--usar switch-->
                            <vs-switch v-if="tr.documento_devolucion == tr.codigo_devolucion && tr.estado_liquidacion != '3'" v-model="tr.devolverCheck" @input="changeDevolver(tr)">
                                <span slot="on" class="text-white">Si</span>
                                <span slot="off">No</span>
                            </vs-switch>
                            </span>
                            <br><br>
                            <p v-if="tr.estado_liquidacion == '3'">Código ya se devolvio</p>
                            <p>
                              <!--si documento_devolucion es diferente de codigo_devolucion mostrar codigo ya se activo o se limpio -->
                              <span v-if="tr.documento_devolucion != tr.codigo_devolucion" class="mt-2 font-semibold text-dark">Código ya se activo o se limpio</span>
                            </p>
                            <!--boton para quitar del documento devolucion-->
                            <p v-if="tr.estado == 0 && tr.combo == null">
                              <vs-button @click="ObjectSelectedCodigo = tr;popupConfirmQuitar = true" color="danger" class="text-white">Quitar del documento de devolución</vs-button>
                            </p>
                          </vs-td>
                      </vs-tr>
                  </template>
              </vs-table>
            </div>
        </div>
       <div v-if="menu == 1">
        <ConfirmEliminarVue otroValor="1" :title="'Estás seguro de marcar como revisado? '+sumarCodigosRevisar+' códigos'" subtitle="Si, deseo marcar como revisado" @changeConfirm="changeConfirm"/>
       </div>
       <!--modales-->
      <vs-popup classContent="popup-example" class="popupHijo" title="Confirmar quitar código" :active.sync="popupConfirmQuitar" :close-on-click-overlay="false">
        <div v-if="popupConfirmQuitar">
          <h3 class="text-lg mb-4">¿Estás seguro de quitar el codigo <b>{{ ObjectSelectedCodigo.codigo }}</b> del documento de devolución?</h3>
          <div class="">
            <vs-input class="w-full" v-model="observacion_quitar" label="Observación para quitar el código" placeholder="Ingrese una observación" />
          </div>
          <div class="flex justify-center mt-5">
            <vs-button color="primary" class="text-white mr-5" @click="f_quitarCodigo()">Si, deseo quitar</vs-button>
            <vs-button color="warning" class="mr-2 text-white" @click="popupConfirmQuitar = false">Cancelar</vs-button>
          </div>
        </div>

      </vs-popup>
    </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
const ConfirmEliminarVue  = () => import('../../../configuracion/Reutilizable/ConfirmEliminar.vue');
export default{
    mixins:[Generalmix],
    components:{
        ConfirmEliminarVue
    },
    data(){
      return{
        usuario:[],
        arrayCodigosEncontrados:[],
        arrayCodes:[],
        tmpArrayCodes:[],
        arrayMostrar:[],
        menu:0,
        codigoTipo:0,
        empresaSelected:'',
        filtro: 0,
        observacion:'',
        ObjectSelectedCodigo:'',
        popupConfirmQuitar:false,
        observacion_quitar:''
      }
    },
    props:{
      arrayCodigos:{
        type:Array,
        default:function(){
            return []
        }
      },
      dLiquidado:{
        type:Number,
        default:0
      },
      ObjectSelected:{
        type:Object,
        default:function(){
            return {}
        }
      },
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    async mounted() {
      let me = this;
      await me.f_ejecutarFuncionesStart();
    },
    computed:{
        sumarCodigosRevisar(){
            let me = this;
            let datos = me.tmpArrayCodes.filter(p => p.devolver == 1)
            let resultado = datos.length
            return resultado
        },
        sumaTotal(){
            let me = this;
            let total = me.arrayCodes.length
            return total
        },
        sumarCodigosLiquidados(){
            let me = this;
            let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '1' ||  p.estado_codigo == '0' ||  p.estado_codigo == '' || p.estado_codigo == null);
            let datos        = primerFiltro.filter(p => p.documento_estado_liquidacion =='0')
            let resultado    = datos.length
            return resultado
        },

        sumaCodigosRegaladosActa(){
          let me = this;
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '2');
          let datos        = primerFiltro.filter(p => p.documento_estado_liquidacion =='2' && p.documento_regalado_liquidado == '0')
          let resultado    = datos.length
          return resultado
        },
        sumaCodigosRegaladosLiquidadosActa(){
          let me = this;
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '2');
          let datos        = primerFiltro.filter(p => p.documento_estado_liquidacion =='2' && p.documento_regalado_liquidado == '1')
          let resultado    = datos.length
          return resultado
        },
        sumaCodigosRegalados(){
          let me = this;
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '1' ||  p.estado_codigo == '0' ||  p.estado_codigo == '' || p.estado_codigo == null);
          let datos        = primerFiltro.filter(p => p.documento_estado_liquidacion =='2' && p.documento_regalado_liquidado == '0')
          let resultado    = datos.length
          return resultado
        },
        sumaCodigosRegaladosLiquidados(){
          let me = this;
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '1' ||  p.estado_codigo == '0' ||  p.estado_codigo == '' || p.estado_codigo == null);
          let datos        = primerFiltro.filter(p => p.documento_estado_liquidacion =='2' && p.documento_regalado_liquidado == '1')
          let resultado    = datos.length
          return resultado
        },
        SumaCodigosCreados(){
            let me = this;
            let datos       = me.arrayCodes.filter(p => p.estado == '0');
            let resultado   = datos.length
            return resultado
        },
        SumaCodigosDevolucion(){
            let me = this;
            let datos       = me.arrayCodes.filter(p => p.estado != '0');
            let resultado   = datos.length
            return resultado
        },
        sumarCodigosGuias(){
          let me = this;
          //estado_liquidacion 4 es guias
          let datos = me.arrayCodes.filter(p => p.documento_estado_liquidacion == '4')
          let resultado = datos.length
          return resultado
        },
        sumarCodigosCombos(){
          let me = this;
          let datos = me.arrayCodes.filter(p => p.combo != null)
          let resultado = datos.length
          return resultado
        },
        sumarCodigosPlus(){
          let me = this;
          let datos = me.arrayCodes.filter(p => p.plus == '1')
          let resultado = datos.length
          return resultado
        }
    },
    methods:{
      async f_ejecutarFuncionesStart(){
        let me = this;
        me.observacion = me.ObjectSelected.observacion
        // Ejecutar la función start y esperar su completación
        await me.start();

        // Ejecutar la función startMenu y esperar su completación
        await me.startMenu();

        // Aquí puedes agregar más lógica si es necesario, por ejemplo, esperar un poco más
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Puedes añadir la lógica adicional que necesites después de que ambas funciones se hayan completado
      },
      async start() {
        let me = this;
        me.arrayCodigosEncontrados   = [];
        // Simulando una operación asincrónica (por ejemplo, una llamada a API)
        await new Promise((resolve) => {
          // Puedes reemplazar esto con una llamada real
          setTimeout(() => {
            me.arrayCodigosEncontrados = []
            let datos = me.arrayCodigos

            if (datos.length > 0) {
              me.arrayCodigosEncontrados = datos
            }
            // Resolver la promesa
            resolve();
          }, 1000); // Simula un retraso de 1 segundo
        });
      },
      async startMenu() {
        let me = this
        if (localStorage.getItem('filtroDevolucion')) {
          me.filtro = localStorage.getItem('filtroDevolucion');
          let menu = me.arrayCodigosEncontrados.find(p => p.id_cliente == me.filtro);
          if (!menu) {
            me.cambiarFiltro(me.arrayCodigosEncontrados[0]);
          } else {
            me.cambiarFiltro(menu);
          }
        } else {
          me.cambiarFiltro(me.arrayCodigosEncontrados[0]);
        }
      },
      f_empresaSeleccionada() {
        let me = this;
        localStorage.setItem('filtroEmpresaSeleccionada', me.empresaSelected);
      },
      f_confirm(){
          let me = this
          if(me.ObjectSelected.importacion_con_combos == 1){
            if(me.ObjectSelected.combo_estado == 0){
              // me.m_message('Debe aceptar los combos generados antes de marcar como revisado','warning')
              // return
              //validar que los combos generados esten aceptados
              me.f_validateCombosAceptados();
            }else{
              me.menu = 1
            }
          }else{
            me.menu = 1
          }
      },
      f_validateCombosAceptados(){
        let me = this
        let url = `devoluciones/${ me.ObjectSelected.id }`
        me.$http.get(this.$server_url + url)
        .then(function (res) {
          if(res.data.status == 0){
            me.m_message('Error al devolver los combos','danger')
            return
          }
          if(res.data.combo_estado == 0){
            me.m_message('Debe aceptar los combos generados antes de marcar como revisado','warning')
            return
          }else{
            me.menu = 1
          }
        })
        .catch(function (error) {
          me.m_message('Error al devolver los combos','danger')
        });
      },
      changeConfirm(e){
          let me = this;
          //cancelar
          if(e == 0) { me.menu = 0  }
          //asignar
          if(e == 1) { me.f_realizarRevisado(); }
      },
      f_realizarRevisado(){
          let me = this
          let datos = me.tmpArrayCodes.filter(p => p.devolver == 1)
          if(datos.length == 0){
              me.m_message('No hay códigos para devolver','warning')
              return
          }
          let sendEnviar = []
          datos.forEach(p => {
            var cal               = new Object();
            cal.codigo            = p.codigo
            cal.id_cliente        = p.id_cliente
            cal.id_periodo        = p.id_periodo
            cal.tipo_importacion  = p.tipo_importacion
            cal.combo             = p.combo
            cal.codigo_liquidacion = p.pro_codigo
            sendEnviar.push(cal)
          })

          let formData = new FormData()
          formData.append('id_devolucion', me.ObjectSelected.id)
          formData.append('id_usuario',    me.usuario.idusuario)
          formData.append('codigo_ven',    me.ObjectSelected.codigo_devolucion)
          formData.append('observacion',   'Devolver_'+me.ObjectSelected.observacion)
          formData.append('tipo_importacion',me.ObjectSelected.tipo_importacion)
          formData.append('data_codigos',  JSON.stringify(sendEnviar))
          let url = ""
          url = 'codigos/bodega/devolver/version2'
          me.$vs.loading()
          this.$http.post(this.$server_url+url, formData)
          .then(res => {
              me.$vs.loading.close()
              if(res.data.status == 0){
                  me.m_message(res.data.message,'danger')
                  return
              }
              me.menu = 0
              me.$vs.notify({
              text:'Se reviso correctamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
              me.$emit('updateDevolucion',res.data)
          })
          .catch(error => {
              me.$vs.loading.close()
              me.m_message('Error al marcar como revisado','danger')
          })
      },
      cambiarFiltro(menu){
          let me                      = this
          me.arrayMostrar             = [];
          me.arrayCodes               = [];
          this.filtro                 = menu.id_cliente;
          localStorage.setItem('filtroDevolucion', menu.id_cliente);
          me.arrayMostrar             = menu
          me.arrayCodes               = menu.data
          me.arrayCodes.forEach(element => {
            //si dLiquidado es 1 osea que permiten los liquidados devolver solo estado_liquidacion a 3
            // if(me.dLiquidado == 1){
            //   if(element.estado_liquidacion == '3'){
            //       element.devolver        = 0
            //       element.devolverCheck   = false
            //   }else{
            //       element.devolver        = 1
            //       element.devolverCheck   = true
            //   }
            // }else{
            //si estado_liquidacion 0 y 3 colocar devolver 0 o regalado liquidado
            //if(element.estado_liquidacion == '0' || element.estado_liquidacion == '3' || element.estado_liquidacion == '2'){
            if(element.estado_liquidacion == '3' || element.codigo_devolucion != element.documento_devolucion || element.estado != 0){
                element.devolver        = 0
                element.devolverCheck   = false
            }else{
                element.devolver        = 1
                element.devolverCheck   = true
            }
            //}
        });
        me.filtroTipo()
      },
      changeDevolver(tr){
          let me = this
          me.tmpArrayCodes = []
          //cambiar  si devolver es 1 a 0 si es 0 a 1 del tmpArrayCodes
          let index = me.arrayCodes.findIndex(p => p.codigo == tr.codigo)
          if(me.arrayCodes[index].devolver == 1){
              me.arrayCodes[index].devolver = 0
              me.arrayCodes[index].devolverCheck = false
          }else{
              me.arrayCodes[index].devolver = 1
              me.arrayCodes[index].devolverCheck = true
          }
          me.filtroTipo()
      },
      filtroTipo(){
        let me = this
        me.tmpArrayCodes = []
        if (me.codigoTipo == 0) {
          me.tmpArrayCodes = me.arrayCodes
        }
        //liquidados
        else if (me.codigoTipo == 1) {
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '1' || p.estado_codigo == '0' || p.estado_codigo == '' || p.estado_codigo == null);
          me.tmpArrayCodes = primerFiltro.filter(p => p.documento_estado_liquidacion == '0')
        }
        //acta regalados
        else if (me.codigoTipo == 2) {
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '2');
          me.tmpArrayCodes = primerFiltro.filter(p => p.documento_estado_liquidacion == '2' && p.documento_regalado_liquidado == '0')
        }
        //acta regalado liquidados
        else if (me.codigoTipo == 3) {
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '2');
          me.tmpArrayCodes = primerFiltro.filter(p => p.documento_estado_liquidacion == '2' && p.documento_regalado_liquidado == '1')
        }
        //regalado sin liquidar
        else if (me.codigoTipo == 4) {
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '1' ||  p.estado_codigo == '0' ||  p.estado_codigo == '' || p.estado_codigo == null);
          me.tmpArrayCodes = primerFiltro.filter(p => p.documento_estado_liquidacion == '2' && p.documento_regalado_liquidado == '0')
        }
        //regalado liquidado
        else if (me.codigoTipo == 5) {
          let primerFiltro = me.arrayCodes.filter(p => p.estado_codigo == '1' ||  p.estado_codigo == '0' ||  p.estado_codigo == '' || p.estado_codigo == null);
          me.tmpArrayCodes = primerFiltro.filter(p => p.documento_estado_liquidacion == '2' && p.documento_regalado_liquidado == '1')
        }
        //creados
        else if (me.codigoTipo == 6) {
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.estado == '0')
        }
        //devueltos
        else if (me.codigoTipo == 7) {
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.estado != '0')
        }
        //GUIAS
        else if (me.codigoTipo == 8) {
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.documento_estado_liquidacion == '4')
        }
        //combos
        else if (me.codigoTipo == 9) {
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.combo != null)
        }
        //plus
        else if (me.codigoTipo == 10) {
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.plus == '1')
        }
      },
      f_quitarCodigo(){
        let me = this;
        // quitar espacios en blanco al inicio y final
        me.observacion_quitar = me.observacion_quitar.trim();
        if(me.observacion_quitar == '' || me.observacion_quitar == null){
          me.m_message('Debe ingresar una observación para quitar el código','warning')
          return
        }
        let formData = new FormData();
        formData.append('quitarCodigoDocumentoDevolucion', 1);
        formData.append('codigo', me.ObjectSelectedCodigo.codigo);
        formData.append('id_devolucion', me.ObjectSelected.id);
        formData.append('id_usuario', this.usuario.idusuario);
        formData.append('observacion_quitar','Quitar_codigo_doc_dev_' + me.observacion_quitar);
        me.$vs.loading()
        this.$http.post(this.$server_url + 'devoluciones', formData)
        .then(res => {
          if(res.data.status == 0){
            me.$vs.loading.close()
            me.m_message(res.data.message,'danger')
            return
          }
          me.$vs.loading.close()
          me.m_message('Código quitado del documento de devolución','success')
          me.popupConfirmQuitar = false
          // Esperar al siguiente ciclo para asegurar que el popup ya se cerró
          me.$nextTick(() => {
            me.$emit('updateQuitarCodigos', true);
          });
        })
        .catch(error => {
          me.$vs.loading.close()
          me.m_message('Error al quitar el código del documento de devolución','danger')
        })
      },
    }
}
</script>
<style scoped>
* {
  color: black;
}

/* MENU */
.activeBtn {
  color: white !important;
}

.customBackground {
  background-color: var(--fondo, #101b22); /* Uso de variable CSS para el color de fondo */
}

/** ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
  outline: none;
  padding: 0.75em 0.75em 0.75em 1.25em;
  position: relative;
  text-decoration: none;
  transition: background 0.2s linear;
  color: black;
  cursor: pointer;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
  background: #adaaa8;
  color: #000;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
  background: #1cbeb3;
  color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
  background: white;
  bottom: 0;
  clip-path: polygon(50% 50%, -50% -50%, 0 100%);
  content: "";
  left: 100%;
  position: absolute;
  top: 0;
  transition: background 0.2s linear;
  width: 1em;
  z-index: 1;
}

.breadcrumbs__item:before {
  background: #cbd2d9;
  margin-left: 1px;
}

.breadcrumbs__item:last-child {
  border-right: none;
}

.breadcrumbs__item.is-active {
  background: #edf1f5;
}
.popupHijo{
  z-index: 51002;
}
</style>
