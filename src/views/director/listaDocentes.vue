<template>
<div class="vx-col md:w-full w-full mb-base">
    <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
    <vx-card>
        <vs-tabs alignment="fixed">
            <vs-tab :label="'Docentes ( '+usuarios.length+' )'">
                <lista tipoUser="docente" :usuarios="usuarios" :institucion="institucion" v-if="submenu.plista == true" v-on:estado="menu"></lista>
                <info-docente v-if="submenu.peditar == true" :usuario="usuario" v-on:estado="menu"></info-docente>
                <add-usuario v-if="submenu.pnuevo == true" v-on:estado="menu" :institucion="institucion"></add-usuario>
                <contenido v-if="submenu.pcontenido == true" :datoU="usuario" v-on:estado="menu"></contenido>
            </vs-tab>
            <vs-tab @click="getCodigosEstudiantes()" :label="'Estudiantes ( '+estudiantes.length+' )'">
                <lista tipoUser="estudiante" :arregloCodigosEstudiantes="arregloCodigosEstudiantes" :usuarios="estudiantes" :institucion="institucion" v-if="submenu.plista == true" v-on:estado="menu"></lista>
                <add-usuario v-if="submenu.pnuevo == true" v-on:estado="menu" :institucion="institucion"></add-usuario>
                <info-docente v-if="submenu.peditar == true" :usuario="usuario" v-on:estado="menu"></info-docente>
            </vs-tab>
            <vs-tab label="Datos institución">
                <div class="m-5 mb-base">
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                        </div>
                        <!-- {{institucion.idInstitucion}} -->
                        <div class="vx-col sm:w-1/3 w-full">
                            <vs-avatar v-if="institucion.imgenInstitucion != ''" class="mx-auto my-6 block" size="100px" :src="$data_url+'archivos/instituciones_logos/'+institucion.imgenInstitucion" />
                            <!-- <vs-avatar v-else class="mx-auto my-6 block" size="100px" src="https://foro.prolipadigital.com.ec/uploads/icono_institucion_6e40e174fa.jpg" /> -->
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Cambiar logo institución</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <input type="file" id="file" class="w-full" icon-pack="feather" icon="icon-image" icon-no-border @change="obtenerImagen" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" />
                            <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                            <p class="text-danger"> {{msj}} </p>
                            <div class="v-row text-left" v-if="porcentaje > 0">
                                <vs-progress style="height:25px" :percent="porcentaje" color="success"> {{porcentaje}}% </vs-progress>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Nombre institución</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <vs-input class="w-full" icon-pack="feather" icon="icon-home" icon-no-border v-model="institucion.nombreInstitucion" />
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Dirección</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="institucion.direccionInstitucion" />
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Teléfono</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <vs-input type="tel" class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="institucion.telefonoInstitucion" />
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Región</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <ul class="demo-alignment">
                                <li>
                                    <vs-radio @input="getCiudad()" v-model="institucion.region_idregion" vs-value="2">Costa</vs-radio>
                                </li>
                                <li>
                                    <vs-radio @input="getCiudad()" v-model="institucion.region_idregion" vs-value="1">Sierra</vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Ciudad</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <v-select :options="ciudad" :reduce="ciudad => ciudad.idciudad" label="nombre" v-model="institucion.ciudad_id"></v-select>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col sm:w-1/3 w-full">
                            <span>Actualizado</span>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <p v-if="institucion.updated_at != null"> {{fechaLarga(institucion.updated_at)}} </p>
                            <p v-else class="text-danger">Pendiente</p>
                        </div>
                    </div>

                    <div class="vx-row mb-base">
                        <div class="vx-col sm:w-2/3 w-full ml-auto">
                            <vs-button class="mr-3 mb-2" @click="guardar()">Guardar cambios</vs-button>
                            <vs-button color="warning" type="border" class="mb-2" @click="$router.go(-1)">Cancelar</vs-button>
                        </div>
                    </div>
                </div>
            </vs-tab>
             <vs-tab label="Visitas">
                <visitasUsers />
             </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>
<script>
import vSelect from 'vue-select'
import lista from './lista.vue'
import infoDocente from '../usuarios/info_docente.vue'
import addUsuario from '../usuarios/addusuario.vue'
import contenido from './contenidosDocente.vue'
import niveles from '../gestion_matricula/administrador/matricula_niveles.vue'
import visitasUsers from './visitasUsers.vue'
export default {
    components: {
        contenido,
        lista,
        infoDocente,
        addUsuario,
        'v-select': vSelect,
        niveles,
        visitasUsers
    },
    data() {
        return {
            usuarios: [],
            estudiantes: [],
            institucion: '',
            ciudad: [],
            usuario: {},
            idciudad: '',
            bytes: 1048576,
            limiteMegas: 1,
            porcentaje: '',
            pesoArchivo: '',
            muyPesado: '',
            msj: '',
            submenu: {
                plista: true,
                pnuevo: false,
                peditar: false,
                pcontenido: false
            },
            arregloCodigosEstudiantes:[],
        }
    },
    mounted() {
        let me = this;
        me.institucion = JSON.parse(localStorage.getItem('institucion'))
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.getUsuariosTipo();
        me.getCiudad();
    },
    methods: {
        menu(item) {
            let me = this;
            this.submenu = item
            this.usuario = item.usuario
            me.getUsuariosTipo()
            me.getCodigosEstudiantes()
        },
        getUsuariosTipo() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'docentesInstitucion/' + me.institucion.idInstitucion)
                .then(function (response) {
                    me.usuarios = response.data
                    me.$vs.loading.close()
                    // console.log(me.usuarios)
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
                })
            this.$http.get(this.$server_url + 'estudiantesXInstitucion/' + me.institucion.idInstitucion)
                .then(function (response) {
                    me.estudiantes = response.data
                    me.$vs.loading.close()
                    // console.log(me.usuarios)
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        getCodigosEstudiantes() {
            let me = this;
            var datos = localStorage.periodo_id + '*' + me.institucion.idInstitucion;
            this.$http.get(this.$server_url + 'getEstudianteCodigos/'+datos)
                .then(function (response) {
                    me.arregloCodigosEstudiantes = response.data;
                })
                .catch(function (error) {})
        },
        getCiudad() {
            let me = this;
            this.$http.get(this.$server_url + 'ciudad')
                .then(function (response) {
                    me.ciudad = response.data;
                    // console.log(me.ciudad)
                })
                .catch(function (error) {})
        },
        obtenerImagen(e) {
            let me = this;
            me.file = e.target.files[0];
            // console.log(me.file)
            me.muyPesado = false;
            me.pesoArchivo = (me.file.size / me.bytes).toFixed(2);
            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
                me.msj = 'El archivo que intenta, pesa ' + me.pesoArchivo + ' mb. y excede el peso permitido, favor verifique';
            }
        },
        guardar() {
            let me = this
            if (me.muyPesado) {
                me.$vs.notify({
                    text: 'El archivo es muy pesado, favor verifique',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('archivo', me.file);
            formData.append('ideditor', me.usuario.idusuario);
            formData.append('nombreInstitucion', me.institucion.nombreInstitucion);
            formData.append('direccionInstitucion', me.institucion.direccionInstitucion);
            formData.append('telefonoInstitucion', me.institucion.telefonoInstitucion);
            formData.append('institucion_idInstitucion', me.institucion.idInstitucion);
            formData.append('region_idregion', me.institucion.region_idregion);
            formData.append('ciudad_id', me.institucion.ciudad_id);
           this.$http.post(this.$data_url + 'api/guardarLogoInstitucion', formData)
                .then(function (response) {
                    me.institucion.imgenInstitucion = response.data.imgenInstitucion
                    me.institucion.updated_at = response.data.updated_at
                    me.file = '';
                    localStorage.institucion = JSON.stringify(response.data)
                    window.$("#file").val('');
                    me.$vs.notify({
                        text: 'Datos actualizados',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        volver() {
            let me = this;
            me.$router.go(-1)

        }
    }
}
</script>
