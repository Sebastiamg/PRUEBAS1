<template>
    <div class="">
      <div>
        <nav class="breadcrumbs mt-3" style="display:flex;flex-wrap:wrap">
          <span v-for="(menu, index) in arrayCodigosEncontrados"  :key="index" :class="['breadcrumbs__item',  {'activeBtn': filtro === menu.institucion_id_select, 'customBackground': filtro === menu.institucion_id_select}]" @click="cambiarFiltro(menu)">
            {{ menu.data.length }}
            {{ menu.institucion_select }}
          </span>
        </nav>
        <br>
        <!--Mostrar tabla-->
        <div v-if="arrayMostrar.data">
         <!--error  varios periodo-->
            <div class="mt-2" style="" v-if="ifVariosPeriodos">
                <div class="" style="background:#fadbd8;padding:10px;border-radius: 3px;">
                    <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> Existe Varios Períodos</p>
                    <div v-if="ifIncorrectoInstitucion">
                        <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> Existe <b class="text-danger">{{ tmpArrayCodes.filter(p => p.incorrecto == 1).length }} </b>códigos con más de <b class="text-danger">1 Punto de Despacho</b></p>
                    </div>
                </div>
            </div>
       
            <!--SUBMENU-->
            <vs-tabs alignment="fixed" class="mt-4">
              <vs-tab label="Elegir codigos a asignar combos" @click="submenu = 0;">
               
              </vs-tab>
              <vs-tab label="Combos asignados" @click="submenu = 1;">
                <div>

                </div>
              </vs-tab>
            </vs-tabs>
            <!--SUBMENU-->
            <!--filtro-->
            <div v-if="submenu == 0 ">
               <!--COMBOS-->
               <div class="mt-1">
                  <p class="font-semibold">Seleccione el combo:</p>
                  <div class="flex">
                      <v-select :options="arrayCombos" :reduce="arrayCombos => arrayCombos" @input="f_searchCodigoForCombo()" label="combolibro" class="w-full" v-model="comboSelected" />
                      <div v-if="comboSelected">
                          <div class="ml-2">
                              <span><b>Cantidad libros:</b> {{ comboSelected.cantidad_combos }}</span>
                              <span class="ml-3" v-if="comboSelected.cantidad_combos > 0"><b>libros:</b> {{ comboSelected.codigos_combos }}</span>
                          </div>
                      </div>
                  </div>
                  <div v-if="comboSelected">
                      <div v-if="comboSelected.cantidad_combos > 0">
                          <p class="font-semibold">Ingrese la cantidad:</p>
                          <vs-input v-model="cantidadCombo" class="w-full mt-2" min="0" :max="contadorGrupos" type="number"></vs-input>
                          <p style="color:red;">Cantidad disponible: {{ contadorGrupos }}</p>
                          <vs-button color="primary" v-if="filtro > 0" type="filled" icon="add" @click="openConfirm()" class="mt-2 text-white">Agregar</vs-button>
                      </div>
                  </div>
                </div>
                <!--FIN COMBOS-->
              <div class="mt-5">
                <ul style="display:flex;flex-wrap: wrap;">
                <li class="m-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{ sumaTotal }}</span> Todos</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="1"><span class="font-bold">{{ sumarCodigosLiquidados }}</span> Liquidados</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="2"><span class="font-bold">{{ sumaCodigosRegalados }}</span> Regalados sin liquidar</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span class="font-bold">{{ sumaCodigosRegaladosLiquidados }}</span> Regalados liquidados</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="4"><span class="font-bold">{{ SumaCodigosDevolucion }}</span> Devueltos</vs-radio>
                </li>
                </ul>
              </div>
              <vs-table max-items="10" search stripe pagination :data="tmpArrayCodes">
                  <template slot="header">
                  <vs-chip  color="primary">Cantidad disponible:  {{ tmpArrayCodes.length }}</vs-chip>
                  <ul class="ml-2" v-if="sumaCodigosRegalados > 0">
                      <li>
                      <vs-checkbox @input="f_excluirRegalados()" v-model="checkIncluirRegalados">Incluir Regalados</vs-checkbox>
                      </li>
                  </ul>
                  <!-- <vs-button class="ml-5 mt-4 mb-4 mr-5 text-white" @click="openConfirm(arrayMostrar);"><i class="fa-solid fa-upload text-white"></i> CREAR COMBO DE {{ sumarCodigosDevolver }} CÓDIGOS</vs-button> -->
                  </template>
                  <template slot="thead">
                  <vs-th>Código</vs-th>
                  <vs-th>Institución</vs-th>
                  <vs-th>Período</vs-th>
                  <!-- <vs-th>Crear Documento</vs-th> -->
                  </template>
                  <template slot-scope="{data}">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td>
                          {{data[indextr].codigo}}<br>
                          <b>Código liquidacion</b>
                          <p>{{data[indextr].codigo_liquidacion}}</p>
                          <div v-if="tr.codigo_paquete" class="mt-2">
                          <p><b>Paquete:</b>
                              <span class="ml-2">{{tr.codigo_paquete}}</span>
                          </p>
                          </div>
                          <div v-if="tr.combo" class="mt-2">
                          <p><b>Combo:</b>
                              <span class="ml-2">{{tr.combo}}</span>
                          </p>
                          </div>
                          <p><b>Tipo de venta:</b>
                          <span class="ml-2" v-if="tr.venta_estado == 1">Venta directa</span>
                          <span class="ml-2" v-if="tr.venta_estado == 2">Venta lista</span>
                          </p>
                          <span v-if="tr.estado_liquidacion == 0" class="mt-2">Liquidado</span>
                          <span v-if="tr.estado_liquidacion == 3" class="mt-2">Devuelto</span>
                          <div v-if="tr.documento_devolucion" class="mt-2">
                          <b>Documento de devolucion</b>
                          <p>{{tr.documento_devolucion}}</p>
                          </div>
                          <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 0" class="mt-2">Regalado sin liquidar</span>
                          <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1" class="mt-2">Regalado Liquidado</span>
                      </vs-td>
                      <vs-td>
                      <div v-if="tr.institucionDirecta">
                          <b>Institución Venta directa:</b>
                          <p>{{data[indextr].institucionDirecta}}</p>
                      </div>
                      <div v-if="tr.institucionPuntoVenta">
                          <b>Institución Venta Lista:</b>
                          <p>{{data[indextr].institucionPuntoVenta}}</p>
                      </div>
                      <div v-if="tr.incorrecto == 1">
                          <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> 2 puntos de despachos encontrados</p>
                      </div>
                      </vs-td>
                      <vs-td>
                          {{data[indextr].periodoescolar}}<br>
                      </vs-td>
                      <!-- <vs-td>
                      <span v-if="tr.estado_liquidacion == 0 || tr.estado_liquidacion == 3 || tr.documento_devolucion != null || ( tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1)">
                      </span>
                      <span v-else class="mt-2">
                          <vs-switch v-model="tr.devolverCheck" @input="changeDevolver(tr)">
                          <span slot="on" class="text-white">Si</span>
                          <span slot="off">No</span>
                          </vs-switch>
                      </span>
                      </vs-td> -->
                  </vs-tr>
                  </template>
              </vs-table>
            </div>
            <div v-if="submenu == 1">
              <ComboSelectedVue :arrayCodes="arrayCodesCodeCombo" :arrayCombos="arrayCombos"/>
            </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import Generalmix from '../../../../mixins/Generalmix';
  import LibroRepository from '../../../../repositories/LibroRepository';
  const ComboSelectedVue = () => import('./ComboSelected.vue')
  import VSelect from 'vue-select';
  export default {
    mixins: [Generalmix],
    components:{
      vSelect: VSelect,
      ComboSelectedVue,
    },
    data() {
      return{
        arrayCodigosEncontrados: [],
        arrayCodigosNoEncontrados: [],
        arrayMostrar: [],
        filtro: 0,
        ifVariosPeriodos:false,
        arrayCodes:[],
        arrayCodesCodeCombo:[],
        tmpArrayCodes:[],
        codigoTipo:0,
        checkIncluirRegalados:false,
        ifIncorrectoInstitucion:false,
        //variables para combos
        arrayCombos:[],
        comboSelected:'',
        combosLibrosSelected:[],
        cantidadCombo:0,
        //fin variables para combos
        submenu:0,
        contadorGrupos:0,
        combo_temporal:[],
      }
    },
    props:{
      arregloCodigos:{
        type: [Array,Object],
        required: true,
        default: () => []
      },
      dLiquidado:{
        type: Number,
        required: true,
        default: 0
      }
    },
    watch:{
      arregloCodigos:{
        handler(val){
          let me = this;
          me.start()
          //ejecutar cambiarFiltro con el primer arreglo despues de 2 segundos
          setTimeout(() => {
            me.cambiarFiltro(me.arrayCodigosEncontrados[0])
          }, 1000);
        },
        deep:true
      },
      dLiquidado:{
        handler(val){
          let me = this;
          //ejecutar cambiarFiltro con el primer arreglo despues de 2 segundos
          setTimeout(() => {
          //si existe filtroDevolucion en localStorage cambiarFiltro con el valor de filtroDevolucion
          if(localStorage.getItem('filtroDevolucion')){
            me.filtro = localStorage.getItem('filtroDevolucion')
            let menu = me.arrayCodigosEncontrados.find(p => p.institucion_id_select == me.filtro)
            me.cambiarFiltro(menu)
          }else{
            me.cambiarFiltro(me.arrayCodigosEncontrados[0])
          }
        }, 1000);
        },
      }
    },
    mounted(){
      let me = this;
      me.start()
      me.getCombos()
      //ejecutar cambiarFiltro con el primer arreglo despues de 2 segundos
      setTimeout(() => {
        //si existe filtroDevolucion en localStorage cambiarFiltro con el valor de filtroDevolucion
        if(localStorage.getItem('filtroDevolucion')){
          me.filtro = localStorage.getItem('filtroDevolucion')
          let menu = me.arrayCodigosEncontrados.find(p => p.institucion_id_select == me.filtro)
          //si no existe el menu cambiarFiltro con el primer arreglo
          if(!menu){
            me.cambiarFiltro(me.arrayCodigosEncontrados[0])
          }else{
            me.cambiarFiltro(menu)
          }
        }else{
          me.cambiarFiltro(me.arrayCodigosEncontrados[0])
        }
      }, 1000);
    },
    computed:{
      sumarCodigosDevolver(){
        let me = this;
        let datos = me.tmpArrayCodes.filter(p => p.devolver == 1)
        let resultado = datos.length
        return resultado
      },
      sumaTotal(){
        let me = this;
        let total = me.tmpArrayCodes.length
        return total
      },
      sumarCodigosLiquidados(){
        let me = this;
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
        let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
        let resultado    = datos.length
        return resultado
      },
      sumaCodigosRegalados(){
        let me = this;
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
        let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
        let resultado    = datos.length
        return resultado
      },
      sumaCodigosRegaladosLiquidados(){
        let me = this;
        let datos        = me.arrayCodes.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
        let resultado    = datos.length
        return resultado
      },
      SumaCodigosDevolucion(){
        let me = this;
        let datos       = me.arrayCodes.filter(p => p.estado_liquidacion == '3');
        let resultado   = datos.length
        return resultado
      },
    },
    methods:{
      getCombos(){
        let me = this
        LibroRepository.getAllCombos().then(r => { this.arrayCombos = r.data });
      },
      f_searchCodigoForCombo(){
        let me = this
        if(me.comboSelected == "" || me.comboSelected == null || me.comboSelected == undefined) { return; }
        if(me.comboSelected.cantidad_combos == 0){
          me.m_message('El combo no tiene libros','warning')
          return
        }
        // Dividir codigos_combos por comas
        me.combosLibrosSelected = me.comboSelected.codigos_combos.split(',');
        me.f_buscarCodigos()
      },  
      //
      f_buscarCodigos() {
        let me = this;
        me.combo_temporal = [];
        let agrupaciones = [];
        let codigosInicial = me.tmpArrayCodes;
        me.cantidadCombo = 0;
        me.contadorGrupos = 0; // Contador de grupos encontrados
        let codigosPorGrupo = this.comboSelected.cantidad_combos; // Número de códigos por grupo

        console.log("libros", me.combosLibrosSelected);
        console.log("inicial", codigosInicial);

        // Crear un conjunto para verificar la presencia de los códigos requeridos
        const codigosRequeridos = new Set(me.combosLibrosSelected);
        
        // Agrupar coincidencias por grupo
        let grupos = {};
        
        // Recolectar coincidencias
        codigosInicial.forEach(item => {
            const codigo = item.codigo_liquidacion;
            if (codigosRequeridos.has(codigo)) {
                if (!grupos[codigo]) {
                    grupos[codigo] = [];
                }
                grupos[codigo].push(item);
            }
        });

        // Comprobar si se tienen todos los códigos necesarios
        while (true) {
            // Verificar si todos los códigos requeridos están presentes
            if ([...codigosRequeridos].every(codigo => grupos[codigo] && grupos[codigo].length > 0)) {
                // Crear un combo completo
                let comboCompleto = [];
                for (const codigo of codigosRequeridos) {
                    comboCompleto.push(grupos[codigo].pop()); // Agregar un código de cada grupo
                }
                me.combo_temporal.push(comboCompleto);
                me.contadorGrupos++; // Incrementar el contador de grupos encontrados
            } else {
                break; // Salir si no hay más grupos completos
            }
        }

        me.cantidadCombo = me.contadorGrupos;
        me.m_message("Se encontraron " + me.contadorGrupos + " combos", "success");
        console.log("Agrupaciones completas:", me.combo_temporal);
      },
      start(){
        let me = this;
        me.arrayCodigosEncontrados    = [];
        me.arrayCodigosNoEncontrados  = [];
        me.arrayCodigosEncontrados    = me.arregloCodigos.encontrados
        me.arrayCodigosNoEncontrados  = me.arregloCodigos.no_encontrados
      },
      openConfirm(e) {
        let me = this;
        
        if (me.cantidadCombo === 0) {
            me.m_message('No hay códigos para hacer combos de ' + me.comboSelected.codigo_liquidacion, 'warning');
            return;
        }
        
        // No puede ser menor de cero 
        if (me.cantidadCombo < 0) {
            me.m_message('No puede ser menor de cero', 'warning');
            return;
        }
        
        // No puede ser mayor a la cantidad de códigos disponibles
        if (me.cantidadCombo > me.contadorGrupos) {
            me.m_message('No puede ser mayor a la cantidad de códigos disponibles', 'warning');
            return;
        }

        let datos = me.combo_temporal;

        // Tomar solo la cantidad de elementos según cantidadCombo
        let datosFiltrados = datos.slice(0, me.cantidadCombo);
        
        if (datosFiltrados.length === 0) {
            me.m_message('No hay códigos para hacer combos', 'warning');
            return;
        }
        datosFiltrados = datosFiltrados.flat()
        console.log("test",datosFiltrados)
        console.log("comboSelect",me.comboSelected)
        let ObjectSend = {
            comboSelected:me.comboSelected,
            cantidadCombo: me.cantidadCombo,
            data: datosFiltrados
        };

        let enviar = [];
        enviar.push(ObjectSend);
        me.$emit('openConfirm', enviar);
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
      f_excluirRegalados(){
        let me = this
        me.tmpArrayCodes = []
        //si checkIncluirRegalados es true colocar devolver 1 a los liquidados sin regalar si es false 0
        if(me.checkIncluirRegalados){
          me.arrayCodes.forEach(element => {
            if(element.estado_liquidacion == '2' && element.liquidado_regalado == '0'){
              element.devolver = 1
              element.devolverCheck = true
            }
          });
        }else{
          me.arrayCodes.forEach(element => {
            if(element.estado_liquidacion == '2' && element.liquidado_regalado == '0'){
              element.devolver = 0
              element.devolverCheck = false
            }
          });
        }
        me.filtroTipo()
      },
      cambiarFiltro(menu) {
        let me                = this;
        me.ifVariosPeriodos   = false
        me.arrayMostrar       = [];
        me.arrayCodes         = [];
        me.tmpArrayCodes      = [];
        this.filtro           = menu.institucion_id_select;
        localStorage.setItem('filtroDevolucion', menu.institucion_id_select);
        me.arrayMostrar       = menu
        me.arrayCodes         = me.arrayMostrar.data
        me.arrayCodesCodeCombo = me.arrayMostrar.data.filter(p => p.combo != null)
        //agregar propiedad devolver:1 en arrayCodes
        me.arrayCodes.forEach(element => {
          //si dLiquidado es 1 osea que permiten los liquidados devolver solo estado_liquidacion a 3 
          if(me.dLiquidado == 1){
            if(element.estado_liquidacion == '3' || element.documento_devolucion != null){
              element.devolver        = 0
              element.devolverCheck   = false
            }else{
              element.devolver = 1
              element.devolverCheck   = true
            }
          }else{
            //si estado_liquidacion 0 y 3 colocar devolver 0 o regalado liquidado
            if(element.estado_liquidacion == '0' || element.estado_liquidacion == '3' || element.estado_liquidacion == '2' || element.documento_devolucion != null){
              element.devolver        = 0
              element.devolverCheck   = false
            }else{
              element.devolver        = 1
              element.devolverCheck   = true
            }
          }
        });
        // me.arrayCodes.forEach(element => {
        //    let bc_institucion           = element.bc_institucion
        //    let venta_lista_institucion  = element.venta_lista_institucion
        //    let institucion_id_select    = element.institucion_id_select
        //    //si bc_institucion es cero no hacer nada si no verificar si es igual a institucion_id_select
        //    if(bc_institucion > 0){
        //     if(bc_institucion != institucion_id_select){
        //       element.incorrecto = 1
        //     }else{
        //       element.incorrecto = 0
        //     }
        //    }else{
        //     element.incorrecto = 0
        //    }
        //    //si venta_lista_institucion es cero no hacer nada si no verificar si es igual a institucion_id_select
        //    if(venta_lista_institucion > 0){
        //     if(venta_lista_institucion != institucion_id_select){
        //       element.incorrecto = 1
        //     }else{
        //       element.incorrecto = 0
        //     }
        //    }else{
        //     element.incorrecto = 0
        //    }
        // });
        me.arrayCodes.forEach(element => {
          const { bc_institucion, venta_lista_institucion, institucion_id_select } = element;
  
          // Inicializamos incorrecto en 0
          element.incorrecto = 0;
  
          // Verificamos bc_institucion
          if (bc_institucion > 0 && bc_institucion !== institucion_id_select) {
              element.incorrecto = 1;
          }
  
          // Verificamos venta_lista_institucion
          if (venta_lista_institucion > 0 && venta_lista_institucion !== institucion_id_select) {
              element.incorrecto = 1;
          }
      });
        //si encuentra varios bc_periodo colocar ifVariosPeriodos = true
        me.arrayCodes.forEach(element => {
          let primerPeriodo = me.arrayCodes[0].bc_periodo
          //si encuentra otro diferente al primer periodo entonces ifVariosPeriodos = true
          if(primerPeriodo != element.bc_periodo){
            me.ifVariosPeriodos = true
          }        
        });
        //filter si encuentra un incorrecto ifIncorrectoInstitucion = true
        me.tmpArrayCodes = me.arrayCodes.filter(p => p.incorrecto == 1)
        if(me.tmpArrayCodes.length > 0){
          me.ifIncorrectoInstitucion = true
        }else{
          me.ifIncorrectoInstitucion = false
        }
        me.codigoTipo    = 0
        me.filtroTipo()
      },
      filtroTipo(){
        let me = this
        me.tmpArrayCodes = []
        if(me.codigoTipo == 0){
          me.tmpArrayCodes = me.arrayCodes
        }else if(me.codigoTipo == 1){
          let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
          me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion =='0')
        }
        else if(me.codigoTipo == 2){
          let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
          me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
        }
        else if(me.codigoTipo == 3){
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
        }
        else if(me.codigoTipo == 4){
          me.tmpArrayCodes = me.arrayCodes.filter(p => p.estado_liquidacion == '3')
        }
        //filtrar que tengo combo null
        me.tmpArrayCodes = me.tmpArrayCodes.filter(p => p.combo == null)
      },
    },
  
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
  
  </style>
  