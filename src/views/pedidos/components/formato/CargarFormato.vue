<template>
  <div>
      <vx-card v-if="arregloPeriodos.length > 0">
        <p class="text-primary font-bold text-center" style="font-size: 17px;">
            Cargar datos para el período {{ periodoSelect.periodoescolar }}
        </p>
        <p class="text-warning font-bold text-center mt-2" style="opacity: 0.8;">Seleccione el periodo que desea cargar los valores</p>
        <div class="w-full mt-2">
            <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" placeholder="--Seleccione--" label="periodoescolar" class="w-full" v-model="periodoAnteriorSelect" />
        </div>
        <div class="mt-3" v-if="periodoAnteriorSelect">
            <vs-alert style="word-spacing: 2px;opacity:0.8;">
                <p style="font-size:12px;word-spacing: 5px;letter-spacing:1px;">
                    Los valores del período <b>{{ periodoAnteriorSelect.periodoescolar }}</b>, serán cargados en el periodo <b>{{ periodoSelect.periodoescolar }}</b>
                </p>
            </vs-alert>
        </div>
        <div class="flex mt-5 justify-center" v-if="periodoAnteriorSelect">
            <vs-button color="dark" @click="verificacion_Guardar()" class="p-3" icon="check" type="border">Si, deseo cargar los valores</vs-button>
            <vs-button color="warning" class="p-3 ml-2" @click="$emit('rechargeFormato',true)" type="border" icon="reply">Cancelar</vs-button>
        </div>
        <br><br><br>
    </vx-card>
    <div v-if="arregloPeriodos.length <= 0" align="center">
        <b>No hay datos de otros períodos con este formato. Es necesario ingresar manualmente los valores de cada texto para este nuevo período.</b>
        <vs-button color="warning" class="p-3 ml-2" @click="$emit('rechargeFormato',true)" type="border" icon="reply">Aceptar</vs-button>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
  data(){
    return{
      arregloPeriodos:[],
      periodoAnteriorSelect:'',
      mixinIdInicioFormatoNewData: null,
    }
  },
  props:{
    periodoSelect:{
      type:Object,
      default:{}
    },
  },
  components:{
    vSelect,
  },
  mounted(){
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
    if (me.periodoSelect.idperiodoescolar <= me.mixinIdInicioFormatoNewData) {
        me.cargarPeriodosConFormato();
    } else if (me.periodoSelect.idperiodoescolar > me.mixinIdInicioFormatoNewData) {
        me.cargarPeriodosConFormatoNew();
    }
  },
  methods:{
    cargarPeriodosConFormato(){
      let me = this
      me.$vs.loading()
      this.$http.get(this.$server_url+'cargarPeriodoFormatoPedidos')
        .then(function (res) {
          me.arregloPeriodos = res.data
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    cargarPeriodosConFormatoNew() {
        let me = this
        me.$vs.loading()
        const datosParaGuardar = {
            periodoActual: me.periodoSelect.idperiodoescolar,
        };
        this.$http.get(this.$server_url + 'cargarPeriodoFormatoPedidosNew', {
                params: datosParaGuardar
            })
            .then(function (res) {
                me.arregloPeriodos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
    },
    verificacion_Guardar() {
        let me = this;
        if (this.periodoSelect.idperiodoescolar <= me.mixinIdInicioFormatoNewData) {
            console.log("entro1valor");
            this.cargarValores();
        } else if (this.periodoSelect.idperiodoescolar > me.mixinIdInicioFormatoNewData) {
            console.log("entro2valor");
            this.cargarValores_New();
        }
    },
    cargarValores(){
      let me = this
      if(me.periodoAnteriorSelect == null || me.periodoAnteriorSelect == "" || me.periodoAnteriorSelect == undefined){
        me.$vs.notify({
        text:'Seleccione un periodo para cargar',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData();
      formData.append('periodoAnterior',me.periodoAnteriorSelect.id_periodo);
      formData.append('periodoTranspaso',me.periodoSelect.idperiodoescolar);
      me.$vs.loading()
      this.$http.post(this.$server_url+'traspasarFormatoPedidos', formData)
      .then(res => {
      me.$vs.loading.close()
      me.$vs.notify({
        text:res.data.message,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
      me.$emit('rechargeFormato',true)
    },
    cargarValores_New() {
        let me = this
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        console.log(me.periodoAnteriorSelect.idperiodoescolar, me.periodoSelect.idperiodoescolar, "dossssssss");
        if (me.periodoAnteriorSelect == null || me.periodoAnteriorSelect == "" || me.periodoAnteriorSelect == undefined) {
            me.$vs.notify({
                text: 'Seleccione un periodo para cargar',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
            })
            return
        }
        let formData = new FormData();
        formData.append('periodoAnterior', me.periodoAnteriorSelect.idperiodoescolar);
        formData.append('periodoTranspaso', me.periodoSelect.idperiodoescolar);
        formData.append('user_editor', usuarioObjeto.idusuario);
        me.$vs.loading()
        this.$http.post(this.$server_url + 'traspasarFormatoPedidos_New', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
            })
        me.$emit('rechargeFormato', true)
    },
  }
}
</script>
