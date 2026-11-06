<template>
    <div class="mt-3">
        <p class="font-semibold text-2xl text-warning">{{ editar == 1?'Editar código':'Guardar código' }}</p>
        <p class="font-bold">Observación del cambio</p>
        <vs-input icon="icon-message-square" class="w-full mt-2" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
        <vs-divider></vs-divider>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-input class="w-full" icon="code" label="Codigo" v-model="codigo.codigo" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <p>Libro:</p>
                <v-select :options="libros" :reduce="libros => libros" @input="searchContador()" label="nombreasignatura" class="w-full" v-model="codigo.libro" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="person" label="Id usuario" v-model="codigo.idusuario" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="bookmark" label="Contrato" v-model="codigo.contrato" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="swap_horiz" label="Id Periodo" v-model="codigo.id_periodo" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6">
                <p class="ml-2">Estado liquidacion</p>
                <ul class="flex mt-2 ml-2">
                  <li>
                    <vs-radio v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="0">Liquidado</vs-radio>
                  </li>
                  <li>
                    <vs-radio v-model="codigo.estado_liquidacion" class="ml-3" vs-name="radiosestado_liquidacion" vs-value="1">Sin liquidar</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="2">Regalado</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="3">Devuelto</vs-radio>
                  </li>
                </ul>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <p class="ml-2">Bc_estado</p>
                <ul class="flex mt-2 ml-2">
                  <li>
                    <vs-radio v-model="codigo.bc_estado" vs-name="radiosEstado2bc_estado" vs-value="1">Sin leer</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.bc_estado" vs-name="radiosEstado2bc_estado" vs-value="2">Leido</vs-radio>
                  </li>
                </ul>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="swap_vert" label="Bc_Institucion" v-model="codigo.bc_institucion" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6">
                <vs-input class="w-full" icon="swap_vert" label="Bc_periodo" v-model="codigo.bc_periodo" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <p>Bc_fecha_ingreso</p>
                <flat-pickr :config="configdateTimePicker" v-model="codigo.bc_fecha_ingreso"  placeholder="Bc_fecha_ingreso" class="m-1" style="display: inline-block;width: 100%;" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6">
                <p class="ml-2">Venta estado</p>
                <ul class="flex mt-2 ml-2">
                  <li>
                    <vs-radio v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="0">Nada</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="1">Venta directa</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="2">Venta lista</vs-radio>
                  </li>
                </ul>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="swap_vert" label="venta_lista_institucion" v-model="codigo.venta_lista_institucion" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6">
                <vs-input type="number" class="w-full" icon="swap_vert" label="Contador" v-model="codigo.contador" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="filter" label="verif1" v-model="codigo.verif1" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6">
                <vs-input type="number" class="w-full" icon="filter" label="verif2" v-model="codigo.verif2" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="filter" label="verif3" v-model="codigo.verif3" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6">
                <vs-input type="number" class="w-full" icon="filter" label="verif4" v-model="codigo.verif4" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input class="w-full" icon="filter" label="verif5" v-model="codigo.verif5" />
            </div>
        </div>        
        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input class="w-full" icon="filter" label="Codigo unión" v-model="codigo.codigo_union" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <p class="ml-2">Regalado liquidado</p>
                <ul class="flex mt-2 ml-2">
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.liquidado_regalado" vs-name="radiosventa_liquidado_regalado" vs-value="0">Sin liquidar</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.liquidado_regalado" vs-name="radiosventa_liquidado_regalado" vs-value="1">Regalado liquidado</vs-radio>
                  </li>
                </ul>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <p class="ml-2">Prueba Diagnóstica</p>
                <ul class="flex mt-2">
                  <li>
                    <vs-radio class="" v-model="codigo.prueba_diagnostica" vs-name="radiosprueba_diagnostica" vs-value="0">Activación</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.prueba_diagnostica" vs-name="radiosprueba_diagnostica" vs-value="1">Diagnóstica</vs-radio>
                  </li>
                </ul>
          </div>
        </div>
        <div class="vx-row mt-3">
            <div class="vx-col w-full mb-6">
                <ul class="flex">
                  <li>
                    <vs-radio v-model="codigo.estado" vs-name="radiosEstado2" vs-value="0">Activo</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-3" v-model="codigo.estado" vs-name="radiosEstado2" vs-value="2">Bloqueado</vs-radio>
                  </li>
                </ul>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
            <vs-button class="mr-3 mb-2" @click="guardarCodigo();">Guardar</vs-button>
            </div>
        </div>
    </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
export default {
    data() {
       return{
            usuario:[],
            libros:[],
            codigo:{
                codigo:'',
                libro:'',
                idusuario:0,
                contrato:'',
                id_periodo:'',
                estado_liquidacion:1,
                bc_estado:1,
                bc_institucion:0,
                bc_periodo:0,
                venta_estado:0,
                venta_lista_institucion:0,
                contador:1,
                estado:0,
                verif1:'',
                verif2:'',
                verif3:'',
                verif4:'',
                verif5:'',
                bc_fecha_ingreso: null,
                codigo_union:'',
                liquidado_regalado:0,
                prueba_diagnostica:0,
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            observacion:'',
       }
    },
    created(){
        let me = this;
        me.getLibros();
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted(){
        let me = this;
        if(me.editar == 1){
            me.codigo = me.codigosEdit
            me.codigo.libro =
            {
                nombre_serie:me.codigosEdit.serie,
                nombre:me.codigosEdit.book,
                year: me.codigosEdit.anio,
                idLibro:me.codigosEdit.libro_idlibro,
                nombreasignatura: me.codigosEdit.serie + " - "+ me.codigosEdit.book
            }

        }
    },
    props:{
        codigosEdit:{
            type:Array,
            default:[],
        },
        editar:{
            type:Number,
            default:0,
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr,
    },
    methods:{
        //para obtener el listado de Tipos de Area
        getLibros() {
        let me = this;
        this.$http.get(this.$server_url+'traerSeries')
            .then(function (res) {
                me.libros = res.data
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        searchContador(){
            let me = this;
            this.$http.get(this.$server_url+'contadorCodigo?libro='+me.codigo.libro.idLibro)
            .then(function (res) {
                me.codigo.contador = res.data.contador
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        guardarCodigo(){
          let me = this;
          //VALIDACION
          if(me.codigo.codigo.trim() == ""){
            me.$vs.notify({
            text:'Debe ingresar un codigo',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.codigo.libro == undefined || me.codigo.libro == "" || me.codigo.libro == null){
            me.$vs.notify({
            text:'Debe seleccionar un libro',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          if(me.observacion == "" || me.observacion == undefined || me.observacion == null){
            me.$vs.notify({
            text:'Debe ingresar una observación',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          //FIN VALIDACION
          let formData = new FormData();
          me.$vs.loading()
          formData.append('comentario',             me.observacion)
          formData.append('codigo',                 me.codigo.codigo)
          formData.append('serie',                  me.codigo.libro.nombre_serie)
          formData.append('libro',                  me.codigo.libro.nombre)
          formData.append('anio',                   me.codigo.libro.year)
          formData.append('libro_idlibro',          me.codigo.libro.idLibro)
          formData.append('idusuario',              me.codigo.idusuario)
          formData.append('estado',                 me.codigo.estado)
          formData.append('contrato',               me.codigo.contrato)
          formData.append('id_periodo',             me.codigo.id_periodo)
          formData.append('verif1',                 me.codigo.verif1 == 'null' ? '':me.codigo.verif1 )
          formData.append('verif2',                 me.codigo.verif2 == 'null' ? '':me.codigo.verif2 )
          formData.append('verif3',                 me.codigo.verif3 == 'null' ? '':me.codigo.verif3 )
          formData.append('verif4',                 me.codigo.verif4 == 'null' ? '':me.codigo.verif4 )
          formData.append('verif5',                 me.codigo.verif5 == 'null' ? '':me.codigo.verif5 )
          formData.append('estado_liquidacion',     me.codigo.estado_liquidacion)
          formData.append('bc_estado',              me.codigo.bc_estado)
          formData.append('bc_institucion',         me.codigo.bc_institucion)
          formData.append('bc_periodo',             me.codigo.bc_periodo)
          formData.append('editar',                 me.editar)
          //auditoria
          formData.append('institucion_id',         me.usuario.institucion_idInstitucion)
          formData.append('periodo_id',             localStorage.periodo_id)
          formData.append('user_created',           me.usuario.idusuario)
          formData.append('old_values',             JSON.stringify(me.codigosEdit))
          if(me.codigo.bc_fecha_ingreso == "" || me.codigo.bc_fecha_ingreso == undefined || me.codigo.bc_fecha_ingreso == null){

          }else{
            formData.append('bc_fecha_ingreso',     me.codigo.bc_fecha_ingreso)
          }
          formData.append('venta_estado',           me.codigo.venta_estado)
          formData.append('venta_estado',           me.codigo.venta_estado)
          formData.append('venta_lista_institucion',me.codigo.venta_lista_institucion)
          formData.append('contador',               me.codigo.contador)
          formData.append('codigo_union',           me.codigo.codigo_union)
          formData.append('liquidado_regalado',     me.codigo.liquidado_regalado)
          formData.append('prueba_diagnostica',     me.codigo.prueba_diagnostica)
          this.$http.post(this.$server_url+'gestionCodigos', formData)
              .then(function (res) {
                  me.$vs.loading.close()
                  if(res.data.status == '3'){
                      me.$vs.notify({
                      text: res.data.message,
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                    })
                    return
                  }
                  if(res.data.status == '1'){
                    me.$emit('code',me.codigo.codigo)
                    me.$emit('regresar',false)
                    me.limpiar();
                  }
                  me.$vs.notify({
                      text: res.data.message,
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })


              })
              .catch(function (error) {me.$vs.loading.close()})
        },
        limpiar(){
            let me = this
            me.codigo.codigo= ''
            me.codigo.libro=''
            me.codigo.idusuario=0
            me.codigo.contrato=''
            me.codigo.id_periodo=''
            me.codigo.estado_liquidacion=1
            me.codigo.bc_estado=1
            me.codigo.bc_institucion=0
            me.codigo.bc_periodo=0
            me.codigo.venta_estado=0
            me.codigo.venta_lista_institucion=0
            me.codigo.contador=1
            me.codigo.estado=0
            me.codigo.verif1=''
            me.codigo.verif2=''
            me.codigo.verif3=''
            me.codigo.verif4=''
            me.codigo.verif5=''
            me.codigo.bc_fecha_ingreso= null
            me.codigo.codigo_union = ""
            me.liquidado_regalado=0
            me.prueba_diagnostica=0
        },
    },
}
</script>
