<template>
  <div>
    <div>
      <vx-card
        title="Agregar Libro"
        >
        <ul class="flex">
          <li class="mr-5">
            Filtro de libros:
          </li>
          <li class="mr-2">
            <vs-radio v-model="tipo" vs-name="radios1tipo" vs-value="0">Libro de Verificación</vs-radio>
          </li>
          <li class="mr-2">
            <vs-radio v-model="tipo" vs-name="radios1tipo" vs-value="1">Todos los libros</vs-radio>
          </li>
        </ul>
        <div class="vx-row mb-6 mt-5">
          <div class="vx-col w-full" v-if="tipo == 0">
            <span>Seleccione el libro:</span>
            <v-select :options="DetalleVerificacion" :reduce="DetalleVerificacion => DetalleVerificacion" label="nombre_libro" class="w-full" @input="setValorLibro()" v-model="libro.libroSelect" />
          </div>
          <div class="vx-col w-full" v-if="tipo == 1">
            <span>Seleccione el libro:</span>
            <v-select :options="arrayTodosLibros" :reduce="arrayTodosLibros => arrayTodosLibros" label="nombre_libro" class="w-full" @input="setValorLibro()" v-model="libro.libroSelect" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Detalle" v-model="libro.descripcion" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Cantidad" v-model="libro.cantidad" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-dollar-sign" icon-no-border label="Precio" v-model="libro.precio" />
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full">
            <vs-button class="mr-3 mb-2" icon="book" @click="createBookDiscount()" color="success">Agregar descuento libro</vs-button>
          </div>
        </div>
      </vx-card>
    </div>

  </div>
</template>
<script>
import VerificacionRepository from '@/repositories/VerificacionRepository'
import vSelect from 'vue-select'
export default {
  components:{
    vSelect,
  },
  data() {
    return{
      libro:{
        libroSelect:'',
        cantidad:'',
        descripcion:'',
        precio:'',
      },
      tipo:0,
      arrayTodosLibros:[],
      mixinIdInicioFormatoNewData: null,
    }
  },
  props:{
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    DetalleVerificacion:{
      type:Array,
      default:function(){
        return []
      }
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    id:{
      type: Number,
      default:0
    },
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
    this.getTodosLibros()
  },
  methods:{
    getTodosLibros(){
      let me = this
      me.arrayTodosLibros = []
      // Acceder a la key 'pid' desde localStorage
      let pid = localStorage.getItem('pid');
        
      // Definir la rutaxperiodo en base al valor de pid
      let rutaxperiodo = '';
      if (pid <= me.mixinIdInicioFormatoNewData) {
          rutaxperiodo = me.$server_url+`pedidos2/pedidos?getLibrosFormato=yes&periodo_id=${me.datosInstitucion.id_periodo}`;
      } else if(pid > me.mixinIdInicioFormatoNewData) {
          rutaxperiodo = me.$server_url+`pedidos2/pedidos?getLibrosFormato_new=yes&periodo_id=${me.datosInstitucion.id_periodo}`;
      }
      me.$http.get(rutaxperiodo)
      .then(function (res) {
        me.arrayTodosLibros = res.data
      })
    },
    createBookDiscount(){
      let me = this;
      const { libroSelect } = me.libro
      if(libroSelect == null || libroSelect == "" || libroSelect == undefined){
        me.$vs.notify({
        text:'Seleccione un libro por favor',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      const {idInstitucion, id_periodo, contrato }         = me.datosInstitucion
      const { num_verificacion } = me.VerificacionSelect
      const { idusuario }        = me.usuario
      let formData = new FormData();
      formData.append('descuento_id',           me.id)
      formData.append('codigo_liquidacion',     me.libro.libroSelect.codigo)
      formData.append('nombrelibro',            me.libro.libroSelect.nombre_libro)
      formData.append('cantidad',               me.libro.cantidad)
      formData.append('precio',                 me.libro.precio)
      formData.append('descripcion',            me.libro.descripcion)
      formData.append('institucion_id',         idInstitucion)
      formData.append('periodo_id',             id_periodo)
      formData.append('contrato',               contrato);
      formData.append('num_verificacion',       num_verificacion);
      formData.append('user_created',           idusuario);
      formData.append('verificacion_id',        me.VerificacionSelect.id)
      formData.append('addBookForDiscount',    'yes')
      me.$vs.loading()
      this.$http.post(this.$server_url+'verificacionesDescuentos', formData)
      .then(res => {
        VerificacionRepository.actualizarValorVerificacion(me.VerificacionSelect.id).then( r => { } )
        me.limpiar()
        me.$emit('changeReturn',1)
      })
      .catch((e) =>{
        me.$vs.loading.close()
      })
    },
    setValorLibro(){
      let me = this
      const { libroSelect } = me.libro
      if(libroSelect == null || libroSelect == "" || libroSelect == undefined){
        return
      }
      me.libro.precio = me.libro.libroSelect.precio
    },
    limpiar(){
      let me = this
      me.libro = {
        libroSelect:'',
        cantidad:'',
        descripcion:'',
        precio:'',
      }
    },
  }
}
</script>

