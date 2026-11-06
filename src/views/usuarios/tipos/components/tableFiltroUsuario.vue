<template>
    <div>
        <div class="vx-row mt-5">
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 bg-gray-400 text-center">
                <div class="flex">
                    Filtro Usuario:
                    <ul class="leftx" style="display:flex;">
                        <li>
                        <vs-radio vs-name="radios1" class="ml-2" vs-value="0" v-model="valorBusqueda" @input="busqueda='email'">Email</vs-radio>
                        </li>
                        <li>
                        <vs-radio vs-name="radios1" class="ml-2" vs-value="1" v-model="valorBusqueda"  @input="busqueda='cedula'">Cedula</vs-radio>
                        </li>
                        <li>
                        <vs-radio vs-name="radios1" class="ml-2" vs-value="2" v-model="valorBusqueda"  @input="busqueda='usuario'">Usuario</vs-radio>
                        </li>
                    </ul>
                </div>
                <vx-input-group class="mb-base mt-4">
                    <template slot="prepend">
                        <div class="prepend-text bg-success">
                            <span>Búsqueda de usuario:</span>
                        </div>
                    </template>
                    <vs-input v-model="razonBusqueda" @keyup.enter="busquedaFiltroEstudiante()" />
                    <template slot="append">
                        <div class="append-text bg-primary cursor-pointer" @click="busquedaFiltroEstudiante()">
                            <span><i class="fa-solid fa-magnifying-glass"></i></span>
                        </div>
                    </template>
                </vx-input-group>
            </div>
            <div v-if="nombreDirector.length > 1" class="vx-col sm:w-full md:w-full lg:w-1/2 mt-2 px-2 bg-gray-500 text-center cursor-pointer" @click="eliminarInstitucionSeleccionada()">
                <small>Presione click en la <b>X</b> para quitar el usuario asignado</small>
              <vs-list-header class="institucion" style="margin-top: 20px;"  icon-pack="feather" icon="icon-x-circle" color="success" :title="'Usuario asignado: '+nombreDirector">
              </vs-list-header>
            </div>
        </div>
        <h1 id="errorPeriodo" class="activeP">No se puede asignar la institución, Tiene período inactivo</h1>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
                <vs-table max-items="3"  v-if="arregloUsuarios.length > 0" style="width: 100%;margin-top:-45px;" search pagination :data="arregloUsuarios">
                    <template slot="thead">
                        <vs-th style="width:40%;">Datos Personales</vs-th>
                        <vs-th style="width:10%;">Perfil</vs-th>
                        <vs-th style="width:20%;">Accion</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                            <vs-td>
                                {{ tr.idusuario }}
                                <br/>
                                Nombres:
                                <br>
                                <span style="font-weight:600;  " >
                                {{ tr.nombres }} {{ tr.apellidos }}<br>
                                </span>
                                usuario:
                                <br>
                                <span style="font-weight:600;  " >
                                {{ tr.name_usuario }}<br>
                                </span>
                                Clave:
                                <br>
                                <span style="font-weight:600;  " >
                                {{ tr.cedula }}<br>
                                </span>
                                Email:
                                <br>
                                <span style=" font-weight:600; " >
                                {{ tr.email }}<br>
                                </span>
                                Institucion:
                                <br>
                                <span  style="font-weight:600; ">
                                {{ tr.nombreInstitucion }}<br>
                                </span>
                                Cargo:
                                <br>
                                <span  style="font-weight:600; ">
                                {{ tr.cargo }}<br>
                                </span>
                                <template>
                                    <div v-if="tr.estado_idEstado == 1" style="margin-top:-10px">
                                        <vs-chip color="primary">
                                            <p>Activo</p>
                                        </vs-chip>
                                    </div>
                                    <div v-else>
                                        <vs-chip color="danger">
                                            <p>Desactivado</p>
                                        </vs-chip>
                                    </div>
                                </template>
                            </vs-td>
                            <vs-td>
                                {{ tr.perfil }}
                            </vs-td>
                            <vs-td>
                                <vs-button type="relief" @click="asignarDirector(tr)">SELECCIONAR</vs-button>
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
            arregloUsuarios:[],
            nombreDirector:'',
            idusuario:0,
            valorBusqueda:"2",
            busqueda:"usuario",
            razonBusqueda:"",
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))

    },
    props:{
      grupoEspecifico:{
        type:Number,
        default:0
      },
      grupo:{
        type:Number,
        default:0
      },
    },
    methods:{
        eliminarInstitucionSeleccionada(){
            let me = this;
            me.nombreDirector    = ""
            me.instituciones        = []
            me.institucion_id       = 0
            me.periodo_id           = 0
            //resetear id institucion
            let datos = {
                idusuario:0,
                nombres:""
            }
            me.$emit('changeDirector',datos)
        },
        busquedaFiltroEstudiante(){
            let me = this;
            me.arregloUsuarios = [];
            if(me.razonBusqueda.length < 5){
                me.$vs.notify({
                text:'Minimo 5 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading();
            if(me.usuario.id_group == 11){
                //PARA LOS ASESORES
                this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.busqueda+'&razonBusqueda='+me.razonBusqueda+'&asesor=yes')
                .then(function (res) {
                     me.$vs.loading.close()
                     if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        me.eliminarInstitucionSeleccionada()
                        return false;
                    }else{
                        me.arregloUsuarios = res.data
                        me.eliminarInstitucionSeleccionada()
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
            }else{
                //para los administradores
                this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.busqueda+'&razonBusqueda='+me.razonBusqueda)
                .then(function (res) {
                     me.$vs.loading.close()
                     if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        me.eliminarInstitucionSeleccionada()

                        return false;
                    }else{
                        let datos = res.data
                        //grupo especifico
                        if(me.grupoEspecifico == 1){
                          me.arregloUsuarios = datos.filter(p => p.id_group == me.grupo)
                        }else{
                          me.arregloUsuarios = datos.filter(p => p.id_group != 4 && p.id_group != 22 && p.id_group != 23)
                        }
                        if(me.arregloUsuarios.length == 0){
                            me.$vs.notify({
                            text: "No hay usuarios que coincidan",
                            color:'primary',
                            iconPack: 'feather',
                            icon:'icon-check'})
                        }
                         me.eliminarInstitucionSeleccionada()

                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
            }
        },
        asignarDirector(tr){
            let me = this;
            me.error = false
            me.nombreDirector       = tr.nombres + " "+ tr.apellidos
            me.idusuario            = tr.idusuario
            me.arregloUsuarios      = []
            //datos director
            let datos = {
                idusuario:      tr.idusuario,
                nombres :       tr.nombres + " "+ tr.apellidos,
                institucion_id: tr.institucion_idInstitucion,
                id_group:       tr.id_group
            }
            me.$emit('changeDirector',datos)
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
