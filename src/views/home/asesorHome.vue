<template>
    <div>
        <div style="display: none;">
            <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" @ChangecantidadMensajes = "changeCantidadMensajes"/>
        </div>
        <vx-card>
            <div class="vx-row">
              <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6" @click="$router.push('/verificaciones/notificaciones')">
                <vs-card actionable class="p-5 vx-card alto">
                    <div class="padre padreb">
                        <div class="hijo1 hijo1b">
                            <h3 style="">Evidencias</h3>
                        </div>
                        <div class="hijo2">
                            <img src="https://cdn-icons-png.flaticon.com/512/11522/11522659.png" @click="$router.push('/verificaciones/notificaciones')" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                            <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{ cantidadEvidenciasPending }}</p>
                        </div>
                    </div>
                </vs-card>
              </div>
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6" @click="popupNotificaciones = true;">
                    <vs-card actionable class="p-5 vx-card alto">
                        <div class="padre padreb">
                            <div class="hijo1 hijo1b">
                                <h3 style="">Comentarios - pedido</h3>
                            </div>
                            <div class="hijo2">
                                <img src="https://cdn-icons-png.flaticon.com/512/5602/5602848.png" @click="popupNotificaciones = true;"  style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                                <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{ cantidadMensajes }}</p>
                            </div>
                        </div>
                    </vs-card>
                </div>
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
                    <vs-card actionable class="p-5 vx-card alto">
                        <div class="padre padrea">
                            <div class="hijo1 hijo1a">
                                <h4 style="color:white;padding: 5px 0px;font-weight: 300;">Solicitudes de docentes</h4>
                            </div>
                            <div class="w-full p-2 bg-gray-400 text-center">
                            </div>
                            <div class="hijo2">
                                <img src="@/assets/images/home/asesorHome/forms.png" @click="verSolicitudFormulario()"  style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                                <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cantFormsSolicitudes}}</p>
                            </div>
                        </div>
                    </vs-card>
                </div>
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
                    <vs-card actionable class="p-5 vx-card alto">
                        <div class="padre padreb">
                            <div class="hijo1 hijo1b">
                                <h3 style="">Escuelas</h3>
                            </div>
                            <div class="hijo2">
                                <img src="@/assets/images/home/asesorHome/colegio.png" @click="irEscuelas()"  style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                                <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_escuelas}}</p>
                            </div>
                        </div>
                    </vs-card>
                </div>
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
                    <vs-card actionable class="p-5 vx-card alto">
                        <div class="padre padrec">
                            <div class="hijo1 hijo1c">
                                <h3 style="">Contratos</h3>
                            </div>
                            <div class="hijo2">
                                <img src="@/assets/images/home/docenteHome/exam.png" @click="irContratos()" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                                <!-- <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_contratos}}</p> -->
                            </div>
                        </div>
                    </vs-card>
                </div>
                <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
                    <vs-card actionable class="p-5 vx-card alto">
                        <div class="padre padrea">
                            <div class="hijo1 hijo1a">
                                <h3 style="">Planificaciones</h3>
                            </div>
                            <div class="hijo2">
                                <img src="@/assets/images/home/docenteHome/meeting.png" @click="irPlanificaciones()"  style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                                <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_planificaciones}}</p>
                            </div>
                        </div>
                    </vs-card>
                </div> -->
                <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
                    <vs-card actionable class="p-5 vx-card alto">
                        <div class="padre padrea">
                            <div class="hijo1 hijo1a">
                                <h3 style="">Tickets abiertos</h3>
                            </div>
                            <div class="hijo2">
                                <router-link to="/soporte/asesor">
                                    <img src="@/assets/images/home/docenteHome/boleto.png" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                                    <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cantTicketsAbiertos}}</p>
                                </router-link>
                            </div>
                        </div>
                    </vs-card>
                </div> -->
            </div>
        </vx-card>
        <vs-card>
            <seguimientoVue/>
        </vs-card>
        <br/>
        <vx-card>
            <div class="vx-row">
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base">
                    <vs-card actionable class="contenedor-perfil padreb">
                        <div class="hijo1 hijo1d">
                            <h3 style="">Datos del usuario</h3>
                        </div>
                        <div class="hijo2 contenido-perfil">
                            <div style="width:20%">
                               <img src="@/assets/images/home/docenteHome/teacher.png" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                            </div>
                           <div style="width:62%">
                                <p class="titulo-perfil">Nombres:     <span style="color:#000;opacity:0.7;">{{usuario.nombres}}</span></p>
                                <p class="titulo-perfil">Apellidos:   <span style="color:#000;opacity:0.7;">{{usuario.apellidos}}</span></p>
                                <p class="titulo-perfil">Email:       <span style="color:#000;opacity:0.7;">{{usuario.email}}</span></p>
                                <p class="titulo-perfil">Usuario:     <span style="color:#000;opacity:0.7;">{{usuario.name_usuario}}</span></p>
                                <p class="titulo-perfil">Institución:     <span style="color:#000;opacity:0.7;">{{nombreInstitucion}}</span></p>
                            </div>
                            <div style="width:18%">
                                <div>
                                    <vs-button color="success"  icon="account_circle" size="small" @click="irPerfil()"  type="relief">Perfil</vs-button>
                                </div>
                                <br/>
                                 <div>
                                    <vs-button color="danger" icon="close" size="small" @click="logout()"  type="relief">Salir</vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-card>
                </div>
                <div v-if="estadisticaVisitas > 0" class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base">
                    <reportePastelDocente/>
                </div>
            </div>
        </vx-card>
       <br/>
       <!--MODAL NOTIFICACION MENSAJES PEDIDOS-->
       <vs-popup classContent="popup-example" fullscreen title="Mensajes asesor - facturador" :active.sync="popupNotificaciones" @close="RecargarNotificaciones()">
            <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion"/>
        </vs-popup>
       <!--MODAL ASIGNACION ZONA-->
        <vs-popup class="crearZona"  fullscreen title="Asignación de Zonas" :active.sync="popupZonas" @close="handleClose" :class="{ 'hide-close': !showCloseButton }" @changeRecarge="changeRecarge" >
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Instituciones sin zonas</b></vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><span>Cantidad: <b> {{ zona_insts.length }}</b></span></vs-col>
            <vs-table max-items="10" pagination :data="zona_insts">
                <template slot="thead">
                    <vs-th width="100">
                        Código
                    </vs-th>
                    <vs-th width="500">
                        Información Institución-Zona
                    </vs-th>
                    <vs-th width="50"></vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].idInstitucion">
                            {{ data[indextr].idInstitucion }}
                        </vs-td>
                        <vs-td>
                            <small><b>Institución:</b> {{tr.nombreInstitucion}}</small><br>
                            <b style="color: red">Sin Zona</b><br>
                        </vs-td>
                        <vs-td>
                            <vs-button @click="popupActivo=true;getEditar(tr)">Agregar Zona</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
        <!-- SECCION EDITAR -->
        <vs-popup class="editar" :title="`Institución`" :active.sync="popupActivoEditar" @close="handleClose" :class="{ 'hide-close': !showCloseButton }" @changeRecarge="changeRecarge">
            <br>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <b>{{zona_insts.nombreInstitucion}}</b>
                </vs-col>
            <br>
            <vs-row>
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Zona</span>
                </div>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <v-select :options="zona" :reduce="zona => zona.idzona" label="zn_nombre" v-model="zona_insts.zona_id"></v-select>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="guardar()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </div>
</template>
<script>
import seguimientoVue from '../asesor/seguimiento/seguimientoAsesor.vue'
import axios from 'axios'
import vSelect from 'vue-select'
import reportePastelDocente from './components/docente/docentePastel.vue'
import screenNotificacionVue from '../pedidos/notificaciones/screenNotificacion.vue'
export default {
    data() {
       return{
        usuario: [],
        nombreInstitucion:'',
        historicoDocenteArreglo:[],
        individuald:[],
        cant_escuelas:0,
        cant_contratos:0,
        estadisticaVisitas:0,
        periodo_idSierra:0,
        periodo_idCosta:0,
        //variables para notificaciones pedidos comentarios
        cantidadMensajes:0,
        popupNotificaciones: false,
        popupActivoEditar: false,
        cambiarNotificacion: false,
        showCloseButton: false,
        zona: [],
        popupZonas:false,
        zona_insts:{
            idInstitucion:'',
            nombreInstitucion:'',
            zona_id:''
        },
        //fin variables para notificaciones pedidos comentarios
        cantidadEvidenciasPending:0,
       }
    },
    components:{
        reportePastelDocente,
        seguimientoVue,
        screenNotificacionVue,
        vSelect
    },
    props:{
        cantFormsDocente:{
            type:Number,
            default:0,
        },
        cantFormsSolicitudes:{
            type:Number,
            default:0,
        },
        // cantTicketsAbiertos:{
        //     type:Number,
        //     default:0
        // },
    },
     methods: {
        getCantidadEvidencias(){
            let me = this;
            me.cantidadEvidenciasPending = 0
            me.$http.get(me.$server_url+`metodosGetVerificaciones?getVerificaciones=1&id_asesor=${ me.usuario.idusuario }&pendientesNot=1&soloLongitud=1`)
            .then(function (res) {
                me.cantidadEvidenciasPending = res.data
            })
        },
        RecargarNotificaciones(){
            let me = this;
            me.cambiarNotificacion = !me.cambiarNotificacion
        },
        changeCantidadMensajes(e){
            let me = this
            me.cantidadMensajes = e
        },
        //para ir a las solicitudes del formulario de registro de libros de los docentes
        verSolicitudFormulario(){
            let me = this;
            localStorage.setItem('formulario','todo')
            me.$router.push('/formulario/solicitudes')
        },
        handleClose() {
            let me = this;
            me.popupZonas = true
        },
        changeRecarge(e) {
            let me = this;
            me.popupZonas = false
        },
        cerrarAsignacion(){
            if(zona_insts.length > 0){
                me.popupZonas = false
            }
        },
        //actualizar idusuario en la isntituciona
        updateIdAsesorInstitucion(){
            let me = this;
            this.$http.get(this.$server_url+'actualizarIdusuarioInstitucion?cedula=' + me.usuario.cedula)
                .then(function (response) {
                })
                .catch(function (error) {
                })
        },
        guardar() {
            let me = this;
            me.$vs.loading();
            let formData = new FormData();
            formData.append('idInstitucion',    me.zona_insts.idInstitucion);
            formData.append('zona_id',          me.zona_insts.zona_id)
            this.$http.post(this.$server_url + "institucion_zona", formData)
            .then(res => {
                me.$vs.loading.close()
                this.getInstituciones();
                me.$vs.notify({
                    text: 'Guardado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupZonas = true;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'La Asignación no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })

        },
        //  getVisitas() {
        //     let me = this;
        //     axios.get('https://foro.prolipadigital.com.ec/historico-recursos?idusuario='+me.usuario.idusuario+'&idinstitucion=' + me.usuario.institucion_idInstitucion + '&idgrupo=11&_limit=-1')
        //         .then(res => {
        //             //para guardar en localstorage el historico de docentes
        //             this.individuald = res.data;
        //             this.estadisticaVisitas = res.data.length;
        //             localStorage.setItem("individuald", JSON.stringify(this.individuald));
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        // },
        //cantidad de escuelas del asesor
        async getEscuelas() {
            let me = this;
            this.$http.get(this.$server_url+'escuelasAsesor?cedula=' + me.usuario.cedula+'&sierra='+me.periodo_idSierra+'&costa='+me.periodo_idCosta)
                .then(function (response) {
                    me.cant_escuelas = response.data[0].cantidad_instituciones;
                })
                .catch(function (error) {
                })
        },
        async getInstituciones() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'institucionesAsesor?cedula=' + me.usuario.cedula)
                .then(function (response) {
                    me.zona_insts = response.data;
                    if (me.zona_insts.length <= 0) {
                        me.popupZonas = false; // Cerrar el popup si no hay elementos en me.zona_insts
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getEditar(tr) {
            this.popupActivoEditar = true
            this.popupZonas = false
            this.zona_insts.idInstitucion = tr.idInstitucion
            this.zona_insts.nombreInstitucion = tr.nombreInstitucion
        },
        getCancelar(){
            this.popupActivoEditar = false
            this.popupZonas = true
        },
        async getZonaSelect() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + "zonas")
            .then(function (response) {
                me.zona = response.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                    me.$vs.loading.close()
            })
        },
        //cantidad de contratos del asesor
        // async getContratos() {
        //     let me = this;
        //     this.$http.get(this.$server_url+'contratosAsesor?idusuario=' + me.usuario.idusuario+'&todo=yes')
        //         .then(function (response) {
        //             me.cant_contratos = response.data.length;
        //         })
        //         .catch(function (error) {
        //         })
        // },
        //ir a al vistas de contratos
        irContratos(){
            let me = this;
            me.$router.push('/contratos/asesor')
        },
        //ir a la vista de escuelas
        irEscuelas(){
            let me = this;
            me.$router.push('/escuelas/asesor')
        },
        //ur a ka vista de planificaciones
        irPlanificaciones(){
            let me = this;
            me.$router.push('/planificaciones')
        },
        //para ir al perfil
        irPerfil(){
            let me = this;
            me.$router.push('/perfil');
        },
        async logout() {
            await this.$store.dispatch('logout')
            this.$router.push('/');
        },
        getPeriodoSierra(){
            let me = this;
            this.$http.get(this.$server_url+'getPeriodoInvidivual?region=1')
                .then(function (res) {
                    me.periodo_idSierra = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getPeriodoCosta(){
            let me = this;
            this.$http.get(this.$server_url+'getPeriodoInvidivual?region=2')
                .then(function (res) {
                    me.periodo_idCosta = res.data
                    me.getEscuelas();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        }
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getPeriodoSierra();
        me.getPeriodoCosta();
    },
    mounted(){
        let me = this;
        me.$http.get(me.$server_url+'traerInstitucion?institucion_idInstitucion='+me.usuario.institucion_idInstitucion)
        .then(function (res) {
            me.nombreInstitucion = res.data[0].nombreInstitucion;
        })
        .catch(function (error) {
            console.log(error + ' error');
        });
        me.getCantidadEvidencias();
        me.getZonaSelect();
        me.updateIdAsesorInstitucion()
        me.getInstituciones();
    }
}
</script>

<style scoped>
.contenedor-perfil{
    width: 100%;
    border-radius: 20px 0px;
    padding: 0px;

}
.padre{
    width: 100%;

    display: flex;
    flex-direction: column;
    height: 175px;
    border: 1px solid none;
    border-radius: 10px;
    padding: 0px;

}
.padrea{
    box-shadow: 1px  3px 5px rgba(73, 128, 150, 0.6);
}
.padreb{
    box-shadow: 1px  3px 5px rgba(137, 182, 148, 0.6);
}
.padrec{
    box-shadow: 1px  3px 5px rgba(79, 134, 218, 0.6);
}
.hijo1{
    text-align: center;
    border-radius: 10px;
    width: 100%;

}
.hijo1a{
    background: #2193b0;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #6dd5ed, #2193b0);
    background: linear-gradient(to right, #6dd5ed, #2193b0);
}
.hijo1b{
   background: #FF416C;  /* fallback for old browsers */
   background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
   background: linear-gradient(to right, #FF4B2B, #FF416C);
}
.hijo1c{
    background: #11998e;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #38ef7d, #11998e);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
.hijo1d{
background: #56ab2f;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #a8e063, #56ab2f);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #a8e063, #56ab2f); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */



}
.hijo1 > h3{
    color: white;
    font-weight: 300;
    letter-spacing: 2px;
    padding: 5px;


}
.hijo2{
    margin-top: 10px;
    cursor:pointer;

    /* margin: auto; */

}

.contenido-perfil{
    display: flex;
    flex-wrap: wrap;
    padding: 15px;
    overflow: hidden;
}
.titulo-perfil{
    color:#2A9FF6;
    padding: 5px;
}
.crearZona .vs-popup .vs-popup--header .vs-icon {
  display: none;
}

</style>
