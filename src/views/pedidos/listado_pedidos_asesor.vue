<template>
  <div>
    <vx-card>
      <div style="margin-top: -35px;">
        <!--====MENU===-->
        <nav class="slidemenu">
          <!-- Item 1 -->
          <input type="radio" name="slideItem" id="slide-item-1" class="slide-toggle" checked/>
          <label for="slide-item-1" @click="tipo = 0;getPedidos()"><p class="icon"><i class="fa-sharp fa-solid fa-bookmark"></i></p><span>Guias</span></label>
          <!-- Item 2 -->
          <!-- <input type="radio" name="slideItem" id="slide-item-2" class="slide-toggle"/>
          <label for="slide-item-2" @click="tipo = 1;"><p class="icon"><i class="fa-regular fa-file"></i></p><span>Entregar guias</span></label> -->
          <!-- Item 3 -->
          <!-- <input type="radio" name="slideItem" id="slide-item-3" class="slide-toggle"/>
          <label for="slide-item-3" @click="tipo = 2; valor = 0; "><p class="icon"><i class="fa-solid fa-gift"></i></p><span>Obsequios</span></label> -->
          <!-- Item 4 -->
          <input type="radio" name="slideItem" id="slide-item-3" class="slide-toggle"/>
          <label for="slide-item-3" @click="tipo = 2; "><p class="icon"><i class="fa-solid fa-right-left"></i></p><span>Devolución guias</span></label>
          <!-- Item 5 -->
          <!-- <input type="radio" name="slideItem" id="slide-item-5" class="slide-toggle"/>
          <label for="slide-item-5" @click="tipo = 4;"><p class="icon"><i class="fa-solid fa-right-left"></i></p><span>Devolución guias</span></label> -->
          <div class="clear"></div>
          <!-- Bar -->
          <div class="slider">
            <div class="bar"></div>
          </div>
        </nav>
        <!--===FIN MENU===-->
      </div>
      <!--PEDIDOS TEXTOS -->
      <!--TABLA DE PEDIDOS DE GUIAS-->
      <div v-if="tipo == 0">
        <vs-button color="success" type="filled" icon-pack="feather" icon="icon-plus" icon-after @click="goToGuias()">Solicitar guia</vs-button>
        <vs-divider></vs-divider>
        <listado_guiasVue :pedidos="pedidos" :id_periodo="id_periodo" :nombre_periodo="nombre_periodo" @changeEditar="changeEditar" @showPedido="showPedido" @pedidoEliminado="f_recarga_pedidos()"/>
      </div>

      <!--VISTA ENTREGA GUIAS-->
      <div v-if="tipo == 1">
        <ScreenEntregaGuiasVue/>
      </div>
      <!--VISTA DEVOLUCION GUIAS-->
      <div v-if="tipo == 2">
        <ScreenDevolucionGuiasVue :periodoSelect="periodoSelect"/>
      </div>
    </vx-card>
  </div>
  </template>
  <script>
  import vSelect from 'vue-select';
  const listado_guiasVue          = () => import('./components/Guias/listado_guias.vue')
  const ScreenEntregaGuiasVue     = () => import('./components/Guias/entregaGuias/ScreenEntregaGuias.vue')
  const ScreenDevolucionGuiasVue  = () => import('./components/Guias/devolucionGuias/ScreenDevolucionGuias.vue')
  export default {
      components:{
        'v-select': vSelect,
        ScreenEntregaGuiasVue,
        ScreenDevolucionGuiasVue,
        listado_guiasVue
      },
      data: () => ({
        usuario: [],
        pedidos: [],
        pedido:{},
        id_periodo: '',
        nombre_periodo: '',
        tipo:0,
        tipoEstado:1,
        verContratos:false,
        //variables export
        mostrarReporte:false,
          popupCarga:false,
          activePrompt:false,
          id_beneficiario_pedido:0,
          beneficiario:'',
          pedidoEnviar:0,
          periodoEnviar:0,
          arregloBeneficiarios:[],
          //fin variables export
          //variables para historico
          popupUpload:false,
          popupVerCheque:false,
          popupVerPagare:false,
          //fin variables para historico
      }),
      props:{
        periodoSelect:{
          type:Object,
          default:function(){
            return {}
          }
        }
      },
      watch:{
        periodoSelect(results){
          this.id_periodo     = results.idperiodoescolar
          this.nombre_periodo = results.periodoescolar
          this.getPedidos()
        }
      },
      mounted() {
        this.id_periodo     = this.periodoSelect.idperiodoescolar
        this.nombre_periodo = this.periodoSelect.periodoescolar
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.getPedidos()
      },
      methods: {
        showPedido(e){
          this.$emit('showPedido',e)
        },
        changeValor(){
          let me = this;
          me.pedido = {}
        },
        changeHandle(e){
          let me = this;
          me.mostrarReporte  = false
          me.popupCarga      = false
        },
        goToGuias(){
          let me = this;
          localStorage.id_pedido = ''
          localStorage.setItem("id_periodo_selected",     this.id_periodo)
          localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
          let datos = {
          id_pedido:0,
          }
          this.$store.dispatch('setGuia',datos)
          this.$emit('showPedido',1,datos)
        },
        changeEditar(e){
          let me = this
          localStorage.setItem("id_periodo_selected",     this.id_periodo)
          localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
          this.$store.dispatch('setGuia',e)
          this.$emit('showPedido',1,e)
        },
        getPedidos(){
          let me = this
          me.pedidos = []
          me.popupUpload = false;
          me.$vs.loading();
          this.$http.get(this.$server_url+'get_pedidos_asesor/'+me.id_periodo+'/'+me.usuario.idusuario)
          .then(res => {
            me.$vs.loading.close();
            let datos = res.data
              me.pedidos = datos
          })
          .catch(function (error) {
            me.$vs.loading.close();
            console.log(error + ' error');
          })
        },
        generar_pedido(){
          localStorage.id_pedido = ''
          localStorage.setItem("id_periodo_selected", this.id_periodo)
          localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
          localStorage.setItem("pedido_desde_admin", 'inactivo')
          this.$router.push('/pedidos/0')
        },
        ver_pedido(item){
          let me = this;
          localStorage.setItem("id_periodo_selected", this.id_periodo)
          localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
          localStorage.setItem("contrato_generado", item.contrato_generado)
          localStorage.setItem("pedido_desde_admin", 'activo')
          if(me.tipo == 0)  this.$router.push('/pedidos/'+item.id_pedido)
          if(me.tipo == 1)  this.$router.push('/pedidos/guias/'+item.id_pedido)
        },
        f_recarga_pedidos(){
          let me = this
          me.getPedidos();
        },
        acceptAlert(){
          let me = this
          if(me.beneficiario == "" || me.beneficiario == null || me.beneficiario == undefined){
            me.$vs.notify({
            text:'Seleccione un beneficiario por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
          }
          me.id_beneficiario_pedido = me.beneficiario.id_beneficiario_pedido
          me.popupCarga                         = true
          me.mostrarReporte    = true
        },
        close(){
          this.$vs.notify({
            color:'danger',
            title:'Mensaje',
            text:'Has cancelado la generación del reporte!'
          })
        },
        //FIN METODOS EXPORTAR
      },
  }
  </script>

  <style scoped>
  .clear{
    clear: both;
  }
  .slide-toggle{
    display: none;
  }
  .slidemenu{
    font-family: arial, sans-serif;
    max-width: 600px;
    /* max-width: 80%; */
    margin: 50px auto;
    overflow: hidden;
  }
  .slidemenu label{
    width: 30%;
    /* width: 20%; */
    text-align: center;
    display: block;
    float: left;
    color: #333;
    opacity: 0.2;
  }
  .slidemenu label:hover{
    cursor: pointer;
    color: #666;
  }
  .slidemenu label span{
    display: block;
    padding: 10px;
  }
  .slidemenu label .icon{
    font-size: 20px;
    border: solid 2px #8BC7EC;
    text-align: center;
    height: 50px;
    width: 50px;
    display: block;
    margin: 0 auto;
    line-height: 50px;
    border-radius: 50%;
  }
  /*Bar Style*/
  .slider{
    width: 90%;
    /* width: 75%; */
    height: 5px;
    display: block;
    background: #ccc;
    margin-top: 10px;
    border-radius: 5px;
  }
  .slider .bar{
    width: 50%;
    /* width: 20%; */
    height: 5px;
    background: #1B79A5;
    border-radius: 5px;
  }
  /*Animations*/
  .slidemenu label, .slider .bar {
    transition: all 500ms ease-in-out;
    -webkit-transition: all 500ms ease-in-out;
    -moz-transition: all 500ms ease-in-out;
  }
  /*Toggle*/
  .slidemenu .slide-toggle:checked + label{
    opacity: 1;
  }

  .slidemenu #slide-item-1:checked ~ .slider .bar{ margin-left: 0; }
  /* .slidemenu #slide-item-2:checked ~ .slider .bar{ margin-left: 40%; } */
  .slidemenu #slide-item-3:checked ~ .slider .bar{ margin-left: 50%; }
  /* .slidemenu #slide-item-5:checked ~ .slider .bar{ margin-left: 75%; } */


  /* .slidemenu #slide-item-1:checked ~ .slider .bar{ margin-left: 0; }
  .slidemenu #slide-item-2:checked ~ .slider .bar{ margin-left: 20%; }
  .slidemenu #slide-item-3:checked ~ .slider .bar{ margin-left: 40%; }
  .slidemenu #slide-item-4:checked ~ .slider .bar{ margin-left: 60%; }
  .slidemenu #slide-item-5:checked ~ .slider .bar{ margin-left: 80%; } */
  /**REPONSIVE */
  @media only screen and (max-width: 600px) {
    .btn_resp {
      display: block !important;
    }
    .btn_lg {
      display: none !important;
    }
  }
  </style>
