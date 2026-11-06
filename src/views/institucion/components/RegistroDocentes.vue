<template>
    <vx-card
    :title="'Registro de docentes de: '+sendInstitucion.nombreInstitucion "
    :subtitle="'Período: ' +sendInstitucion.periodo"
    title-color="primary"
    >
        <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
            <p>* Busque el docente por el número de cédula y asigne libros</p>
            <p class="mt-1">* Si no existe el docente creelo</p>
        </vs-alert>
        <br>
        <!-- Busqueda -->
        <vx-input-group class="mb-base mt-2">
            <template slot="prepend">
            <div class="prepend-text bg-primary">
                <span>Buscar cédula</span>
            </div>
            </template>
            <vs-input v-model="busqueda" @keyup.enter="getSearchDocente()" />
            <template slot="append">
            <div class="append-text bg-primary">
                <span class="cursor-pointer" @click="getSearchDocente()"><ion-icon style="position:relative;top:1px;" name="search-outline"></ion-icon> Buscar</span>
            </div>
            </template>
        </vx-input-group>
        <!-- /Fin busqueda -->
        <!--SELECCCIONAR DOCENTE-->
        <div class="w-full" v-if="arregloCedulas.length > 0">
            <vs-divider>Seleccione el docente</vs-divider>
            <vs-table max-items="5" search pagination :data="arregloCedulas">
                <template slot="thead">
                    <vs-th>Nombres</vs-th>
                    <vs-th>Perfil</vs-th>
                    <vs-th>Institución</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            <b>Nombres:</b>
                            <p>{{ data[indextr].nombres }} {{ data[indextr].apellidos }}</p>
                            <p class="mt-1"></p>
                            <b>Cédula:</b>
                            <p>{{ data[indextr].cedula }}</p>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].rol}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombreInstitucion}}<br>
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Asignar beneficiario" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success" type="filled" @click="selectedDocente(tr)" icon-pack="feather" icon="icon-check"> Seleccionar</vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <!-- <div v-if="arregloCedulas.length == 0"> -->
        <div>
            <!--FIN SELECCIONAR DOCENTE-->
            <!--FORMULARIO-->
            <vs-divider>Datos del docente</vs-divider>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="user.nombres" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="user.apellidos" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Cédula" v-model="user.cedula" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Email" v-model="user.email" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Teléfono" v-model="user.telefono" />
                </div>
            </div>
            <div class="vx-row mt-5 ml-1">
                <div class="flex">
                    <vs-button class="mr-3 mb-2" icon="save" @click="guardarUsuario()">Guardar docente</vs-button>
                </div>
            </div>
            <vs-divider>Seleccionar área</vs-divider>
            <!--FIN FORMULARIO-->
            <!--SELECCIONAR LIBROS-->
            <SeleccionarLibrosVue :institucion_id="institucion_id" :periodo_id="periodo_id" :docente_id="user.idusuario"/>
            <!--FIN SELECCIONAR LIBROS-->
        </div>
    </vx-card>
</template>
<script>
import SeleccionarLibrosVue from './Seleccionarlibros'
export default{
    data(){
        return {
            usuario:[],
            // institucion_id:'1113',
            periodo_id:'',
            busqueda:'',
            user:{
                idusuario:0,
                nombres:'',
                apellidos:'',
                cedula:'',
                email:'',
                telefono:'',
            },
            seleccionadas:[],
            arregloLibros:[],
            arregloCedulas:[],
        }
    },
    components:{
        SeleccionarLibrosVue,
    },
    props:{
        sendInstitucion:{
            type:Object,
            default:{}
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.institucion_id = me.sendInstitucion.idInstitucion
        me.periodo_id     = me.sendInstitucion.periodo_id
    },
    methods:{
        //Buscar x cedula
        getSearchDocente(){
            let me = this;
            me.arregloCedulas = []
            me.limpiar()
            if(me.busqueda.trim() == ""){
                this.$vs.notify({
                text:'El campo buscar no puede estar vacío',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return;
            }
            if(me.busqueda.length < 5){
                this.$vs.notify({
                text:'Minímo 5 carácteres',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return;
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+'registroDocente?busquedaUserXCedula=yes&cedula='+me.busqueda+'&institucion_id='+me.institucion_id)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.length == 0){
                    me.$vs.notify({ color: 'warning', title: 'Mensaje', text: 'No se encontro la cédula ' })
                    me.limpiar()
                    return
                }else{
                    me.arregloCedulas = res.data
                }
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error + ' error');
            })

        },
        //SELECCIONAR EL DOCENTE DEL LISTADO DE CEDULAS
        selectedDocente(datos){
            let me              = this
            if(datos.institucion_idInstitucion != me.institucion_id){
                me.$vs.notify({ color: 'warning', title: 'Mensaje', text: 'EL docente pertenece a otra institución ' })
                return
            }
            me.user.idusuario   = datos.idusuario
            me.user.cedula      = datos.cedula
            me.user.idusuario   = datos.idusuario
            me.user.nombres     = datos.nombres
            me.user.apellidos   = datos.apellidos
            me.user.email       = datos.email
            me.user.telefono    = datos.telefono
            me.arregloCedulas   = []
        },
        //libros del docente
        getSeleccionadas() {
            let me = this;
            me.$vs.loading();
            let data = new FormData();
            data.append('idusuario',  user.idusuario)
            data.append('periodo_id', localStorage.periodo_id)
            this.$http.post(this.$server_url + "asignaturas_x_docente_xPeriodo", data)
                .then(res => {
                    me.$vs.loading.close();
                    me.seleccionadas = res.data;
                })
                .catch(function(e){
                    me.$vs.loading.close();
                })
        },
        async guardarUsuario() {
            let me = this
             if( me.user.nombres == '' || me.user.apellidos == '' || me.user.email == '' || me.user.email == '' ){
                me.$vs.notify({ color: 'warning', title: 'Alerta', text: 'Complete todos los campos antes de guardar.' })
                return
            }
            me.$vs.loading();
            let formData = new FormData();
            formData.append('idusuario',        this.user.idusuario);
            formData.append('cedula',           this.user.cedula);
            formData.append('nombres',          this.user.nombres);
            formData.append('apellidos',        this.user.apellidos);
            formData.append('email',            this.user.email);
            formData.append('telefono',         this.user.telefono);
            formData.append('institucion_id',   me.institucion_id );
            formData.append('idcreadorusuario', this.usuario.idusuario);
            this.$http.post(this.$server_url+'guardarDocente', formData)
            .then(function (response) {
                me.$vs.loading.close();
                if(response.data.status == 0){
                    me.$vs.notify({ color: 'danger', title:'Error' , text: response.data.message, time:4000})
                    return
                }
                me.$vs.notify({ color: 'success', title: 'Éxito', text: 'Usuario registrado correctamente.' })
                if(me.user.idusuario == 0){
                    me.selectedDocente(response.data)
                }
            })
            .catch(function (error) {
              me.$vs.loading.close()
              if (error.response.status == 422) {
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.cedula[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.nombres[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.apellidos[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.email[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.password[0] })
                  } catch (error) {

                  }
              }

            })
        },
        limpiar(){
            let me = this
            me.user = {
                idusuario:0,
                nombres:'',
                apellidos:'',
                cedula:'',
                email:'',
                telefono:''
            };
        },
    }
}
</script>
