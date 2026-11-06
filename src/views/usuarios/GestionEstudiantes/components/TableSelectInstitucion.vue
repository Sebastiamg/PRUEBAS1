<template>
    <div>
        <div class="vx-row mt-5">
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 bg-gray-400 text-center">
                <vx-input-group class="mb-base">
                    <template slot="prepend">
                        <div class="prepend-text bg-primary">
                            <span>Búsqueda de Institución:</span>
                        </div>
                    </template>
                    <vs-input v-model="busquedaInstitucion" @keyup.enter="getInstitucion()" />
                    <template slot="append">
                        <div class="append-text bg-primary cursor-pointer" @click="getInstitucion()">
                            <span><i class="fa-solid fa-magnifying-glass"></i></span>
                        </div>
                    </template>
                </vx-input-group>
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2  px-2 bg-gray-500 text-center cursor-pointer" @click="eliminarInstitucionSeleccionada()">
                <vs-list-header v-if="nombreInstitucion" class="institucion" style="margin-top: -7px;"  icon-pack="feather" icon="icon-x-circle" color="success" :title="'Institucion asignada: '+nombreInstitucion">
                </vs-list-header>
            </div>
        </div>
        <h1 id="errorPeriodo" class="activeP">No se puede asignar la institución, Tiene período inactivo</h1>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
                <vs-table stripe max-items="5" v-if="instituciones.length > 0" style="width: 100%;" search pagination :data="instituciones">
                    <template slot="header">
                        <div class="vx-row">
                            <div class="vx-col w-full m-3">
                                Cantidad: {{instituciones.length}}
                            </div>
                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="idInstitucion">#</vs-th>
                        <vs-th sort-key="nombreInstitucion">Institución (asesor)</vs-th>
                        <vs-th sort-key="nombre">Localidad</vs-th>
                        <vs-th sort-key="nombre">Estado Periodo</vs-th>
                        <vs-th sort-key="nombre">Accion</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].idInstitucion ">
                                {{data[indextr].idInstitucion }}
                            </vs-td>
                            <vs-td :data="data[indextr].nombreInstitucion">
                                {{data[indextr].nombreInstitucion}}<br>
                                <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                                    <small> <i style="color:red;">No existe asesor </i></small><br>
                                </div>
                                <div v-else>
                                    <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
                                </div>
                                <small>{{data[indextr].fecha_registro}} </small>
                            </vs-td>
                            <vs-td :data="data[indextr].nombreregion">
                                {{data[indextr].nombreregion}} <br>
                                <small>{{data[indextr].ciudad}}</small>
                            </vs-td>
                            <vs-td>
                                <small class="" >{{ tr.periodo }}</small><br>
                                <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                                <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                            </vs-td>
                            <vs-td>
                                <vs-button type="relief" @click="asignarInstitucion(tr)">Asignar Institucion</vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
    </div>
</template>
<script>
export default{
    data(){
        return{
            usuario:[],
            instituciones:[],
            busquedaInstitucion:'',
            nombreInstitucion:'',
            institucion_id:0,
            periodo_id:0,
        }
    },
    props:{
        hacerValidacion:{
            type:Number,
            default:1
        },
        nombreInstitucionExterna:{
          type:String,
          default:''
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
      let me = this;
      if(me.nombreInstitucionExterna != ''){
        me.nombreInstitucion = me.nombreInstitucionExterna
      }
    },
    methods:{
        eliminarInstitucionSeleccionada(){
            let me = this;
            me.nombreInstitucion    = ""
            me.instituciones        = []
            me.institucion_id       = 0
            me.periodo_id           = 0
            //resetear id institucion
            let datos = {
                change:'institucion',
                value : me.institucion_id
            }
            me.$emit('change',datos)
            //resetear no existe periodo
               let datos2 = {
                change:'noPeriodo',
                value : me.error
            }
            me.$emit('change',datos2)
            //resetear periodo
            let datos3 = {
                change:'periodo',
                value : 0
            }
            me.$emit('change',datos3)
            //resetear periodo_id
            let datos4 = {
                change:'periodo_id',
                value : 0
            }
            me.$emit('change',datos4)
            //resetear nombre institucion
              let datos5 = {
                change:'nombreInstitucion',
                value : ''
            }
            me.$emit('change',datos5)
        },
        getInstitucion() {
          let me = this;
          var contentError = document.querySelector("#errorPeriodo")
          contentError.classList.add('activeP')
          contentError.classList.remove('errorP')
          me.instituciones = [];
          me.nombreInstitucion = "";
          me.institucion_id = 0;
          //no puede estar vacio
          if(me.busquedaInstitucion == ''){
            me.$vs.notify({
            text:'Debe ingresar una institución',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
          //quitar espacios con trim
          me.busquedaInstitucion = me.busquedaInstitucion.trim()
          if(me.busquedaInstitucion.length < 5){
              me.$vs.notify({
              text:'Minimo 5 caracteres de busqueda',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return false;
          }
          me.$vs.loading()
          var url = "";
          if(me.usuario.id_group == 1){
            url = this.$server_url + 'listaInsitucion?busqueda='+me.busquedaInstitucion
          }else{
            url = this.$server_url + 'listaInsitucion?asesor=yes&busqueda='+me.busquedaInstitucion+'&cedula='+me.usuario.cedula
          }
          this.$http.get(url)
            .then(function (res) {
                me.instituciones = res.data;
                me.$vs.loading.close()
                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                   })
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        asignarInstitucion(tr){
            let me = this;
            me.error = false
            var contentError = document.querySelector("#errorPeriodo")
            if(me.hacerValidacion  == 1) {
                if(tr.statusPeriodo == '0'){
                    contentError.classList.remove('activeP')
                    contentError.classList.add('errorP')
                    return
                }else{
                    contentError.classList.add('activeP')
                    contentError.classList.remove('errorP')
                }
            }
            console.log("dos",tr)
            me.nombreInstitucion    = tr.nombreInstitucion
            console.log("eee",me.nombreInstitucion)
            me.institucion_id       = tr.idInstitucion
            me.periodo_id           = tr.periodo_id
            me.periodoDescripcion   = tr.periodo
            me.ciudadDescripcion    = tr.ciudad
            me.instituciones        = []
            me.getPeriodo(tr.idInstitucion)
            //id de la institucion
            let datos = {
                change:'institucion',
                value : me.institucion_id
            }
            me.$emit('change',datos)
            //no existe periodo
            let datos2 = {
                change:'noPeriodo',
                value : me.error
            }
            me.$emit('change',datos2)
            //si tiene periodo activo
            let datos3 = {
                change:'periodo',
                value : tr.statusPeriodo
            }
            me.$emit('change',datos3)
            //id de la institucion
            let datos4 = {
                change:'periodo_id',
                value : me.periodo_id
            }
            me.$emit('change',datos4)
             //nombre de la institucion
             let datos5 = {
                change:'nombreInstitucion',
                value : me.nombreInstitucion
            }
            me.$emit('change',datos5)
        },
        getPeriodo(institucion_id) {
            let me = this;
            this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id='+institucion_id)
            .then(function (res) {
                if(res.data.length == 0){
                    me.$vs.notify({
                        text:'La institucion no tiene periodo',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'
                    })
                    me.error = true;
                    let datos2 = {
                        change:'noPeriodo',
                        value : me.error
                    }
                    me.$emit('change',datos2)
                    return false;
                }
                localStorage.setItem('periodoSeleccionado',res.data[0].periodo)
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
    }
}
</script>
<style scoped>
#errorPeriodo{
    transition: 1s ease;
}
.activeP{
    opacity: 0;
}
.errorP{
    opacity: 1;
    color: red;
}
</style>
