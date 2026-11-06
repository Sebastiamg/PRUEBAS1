<template>
    <div>
      <div v-if="confirmacion">
        <p class="bg-warning text-white p-2">!Estas seguro de entregar el pedido?</p>
        <div class="flex mt-4">
          <vs-button color="success" @click="entregarPedido();confirmacion=false;" type="filled">Si, entregar pedido</vs-button>
          <vs-button color="primary" class="ml-2" @click="confirmacion = false;" type="border">Cancelar</vs-button>
        </div>
      </div>
      <div v-else>
      <vs-table max-items="20" search pagination :data="arregloLibros">
          <template slot="header">
            <span>Cantidad: {{arregloLibros.length}}</span>
          </template>
          <template slot="thead">
              <vs-th>Libro</vs-th>
              <vs-th>Cant. unidades</vs-th>
              <vs-th>Precio unitario</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    {{data[indextr].nombrelibro}}<br>
                  </vs-td>
                  <vs-td>
                      {{data[indextr].valor}}<br>
                  </vs-td>
                  <vs-td>
                    {{tr.precio}}
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>
      <vs-list style="margin-top: -40px;">
        <vs-list-header icon="supervisor_account" title="Datos"></vs-list-header>
        <vs-list-item icon="check" title="Tipo de venta">
          <vs-chip color="primary"><span class="font-bold ml-2"> {{pedido.tipo_venta_descr.toUpperCase()}}</span></vs-chip>
        </vs-list-item>
        <vs-list-item icon="check" title="Institución" :subtitle="pedido.nombreInstitucion">
          <small>Periodo: {{pedido.periodoescolar}}</small>
        </vs-list-item>
        <vs-list-item icon="check" title="Asesor" :subtitle="pedido.responsable"></vs-list-item>
        <vs-list-item icon="check" title="Fecha de envio" :subtitle="pedido.fecha_envio.substring(0,10)"></vs-list-item>
        <vs-list-item icon="check" title="Fecha de entrega" :subtitle="pedido.fecha_entrega.substring(0,10)"></vs-list-item>
        <vs-list-item icon="check" title="Total venta" :subtitle="pedido.total_venta"></vs-list-item>
        <vs-list-item icon="check" title="Total de unidades" :subtitle="pedido.total_unidades"></vs-list-item>
      </vs-list>
        <div class="vx-row">
          <div class="w-full p-2 bg-gray-400 text-center" v-if="pedido.estado_entrega == 0">
            <vs-button color="success" icon="save" class="w-full" v-if="usuario.id_group == 27 && (onlyVer == 0)"  @click="confirmacion = true;" type="gradient">Entregar pedido</vs-button>
          </div>

        </div>
      </div>
    </div>
    </template>
    <script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import vSelect from 'vue-select';
    import registrar_beneficiariosVue from '../../pedidos/registrar_beneficiarios.vue';
    export default {
        components:{
          FormWizard,
          TabContent,
          flatPickr,
          'v-select': vSelect,
          registrar_beneficiariosVue,
        },
        data: () => ({
          confirmacion:false,
          usuario:[],
          arregloLibros:[],
          mensaje:'',
          mixinIdInicioFormatoNewData: null,
        }),
        props:{
          id_pedido:{
            type:Number,
            default:0
          },
          id_periodo:{
            type:Number,
            default:0
          },
          pedido:{
            type:Object,
            default:{}
          },
          onlyVer:{
            type:Number,
            default:1,
          }
        },
        created(){
          let me = this;
          me.usuario = JSON.parse(localStorage.getItem("usuario"))
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
          me.getLibros()
          me.mensaje = 'Se entrego correctamente el pedido #'+me.pedido.id_pedido+' de '+me.pedido.nombreInstitucion
        },
        methods: {
          getLibros(){
            let me = this
            me.arregloLibros = []
            let nuevarutaxperiodo = '';
            if(me.id_periodo <= me.mixinIdInicioFormatoNewData){
            nuevarutaxperiodo = 'get_val_pedidoInfoTodo/';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance/'+me.alcance.id_pedido+'/'+me.alcance.id);
            }else if(me.id_periodo > me.mixinIdInicioFormatoNewData){
            nuevarutaxperiodo = 'get_val_pedidoInfoTodo_new/';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance_new/'+me.alcance.id_pedido+'/'+me.alcance.id);
            }
            this.$http.get(this.$server_url+nuevarutaxperiodo+me.id_pedido)
            .then(res => {
              let datos = res.data
              if(datos.length > 0){
                let datos2 = datos.filter(p => p.valor > 0)
                //setear ARRAY
                let preSetear = []
                datos2.forEach(element => {
                  var cal = new Object();
                  cal.idlibro     = element.idlibro
                  cal.nombrelibro = element.nombrelibro
                  cal.valor       = element.valor
                  cal.precio      = element.precio
                  preSetear.push(cal)
                });
                //Generate unique array
                var preTemplate = []
                datos2.forEach(element => {
                  var cal = new Object();
                  cal.idlibro     = element.idlibro
                  cal.nombrelibro = element.nombrelibro
                  cal.precio      = element.precio
                  preTemplate.push(cal)
                });
                //CLEAR REPEAT
                //quitar duplicados
                let hash = {};
                var preArrayUnico = []
                let resultado = preTemplate.filter(o => hash[o.nombrelibro] ? false : hash[o.nombrelibro] = true);
                preArrayUnico  = resultado
                //////
                //SUMAR VALORES PEDIDO + ALCANCES
                const sumarValores = preSetear.reduce((acc,valor) =>{
                  if(acc[valor.idlibro]){
                    acc[valor.idlibro] += valor.valor
                  }else{
                    acc[valor.idlibro] = valor.valor
                  }
                  return acc
                },{})
                //PASAR AL AREGLO UNICO LOS VALORES SUMADOS POR  LIBRO
                const result = preArrayUnico.map((obj) => {
                    obj["valor"] = sumarValores[obj.idlibro];
                    return obj;
                });
                me.arregloLibros = result
              }
            })
          },
          entregarPedido(){
            let me = this
            let formData = new FormData();
            formData.append('estado',               '2')
            formData.append('entregaPedidoBodega',  'yes')
            formData.append('id_pedido',            me.id_pedido);
            me.$vs.loading();
            this.$http.post(this.$server_url+'entregarPedido', formData)
            .then(res => {
              me.$vs.notify({
                text: me.mensaje,
                color: 'primary',
                time:8000,
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              this.$emit('changeRecarge',true)
            })
            .catch(err => {
              console.log(err)
                me.$vs.loading.close();
            })
          },
        },
    }
    </script>

    <style>
    .label_inputs{
      font-size: 12px;
      color: rgb(143, 143, 143);
      margin-top: 4px;
      padding-left: 4px;
    }
    </style>
