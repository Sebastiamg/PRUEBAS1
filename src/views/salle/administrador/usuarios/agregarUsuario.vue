<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <h5 class="m-3"> {{titulo}} </h5>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <vs-input class="w-full" type="text" label="Nombre" icon-pack="feather" icon="icon-user" maxlength="70" icon-no-border v-model="usuarioSalle.nombres" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <vs-input class="w-full" label="Apellido" icon-pack="feather" icon="icon-user" maxlength="70" icon-no-border v-model="usuarioSalle.apellidos" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <vs-input class="w-full " type="text" label="Cédula / password" icon-pack="feather" icon="icon-code" maxlength="13" icon-no-border v-model="usuarioSalle.cedula" />
                <span class="text-danger text-sm">{{ errors.cedula }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <vs-input class="w-full" type="email" label="Email" icon-pack="feather" icon="icon-at-sign" maxlength="70" icon-no-border v-model="usuarioSalle.email" />
                <span class="text-danger text-sm">{{ errors.email }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <vs-input class="w-full " type="tel" label="Teléfono" icon-pack="feather" icon="icon-hash" maxlength="20" icon-no-border v-model="usuarioSalle.telefono" />
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <span>Perfil</span>
                <v-select icon-pack="feather" icon="icon-home" :options="selectSalle" :reduce="selectSalle => selectSalle" label="nombre" v-model="perfil" placeholder="Seleccione..."></v-select>
            </div>
            <div class="vx-col sm:w-2/3 w-full mb-4">
                <span>Institución</span>
                <v-select icon-pack="feather" icon="icon-home" :options="instituciones" :reduce="instituciones => instituciones" label="institucion_ciudad" v-model="institucionSelect" placeholder="Seleccione..."></v-select>
            </div>
            <div class="vx-col w-full mb-4">
                <vs-button class="m-2" color="primary" type="border" @click="registrar();">{{txt_boton}}</vs-button>
                <vs-button class="m-2" color="danger" type="border" @click="volver(1);">Cancelar</vs-button>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuarioSalle: {
                'idusuario': '',
                'cedula': '',
                'nombres': '',
                'apellidos': '',
                'email': '',
                'telefono': '',
                'estado': '1',
            },
            perfil: {
                'id': '',
                'nombre': ''
            },
            institucionSelect: {
                'idInstitucion': '',
                'institucion_ciudad': ''
            },
            selectSalle: [{
                    'id': 12,
                    'nombre': 'Administrador Salle'
                },
                {
                    'id': 13,
                    'nombre': 'Docente Salle'
                },
                {
                    'id': 6,
                    'nombre': 'Docente Prolipa',
                }
            ],
            errors: {
                'email': '',
                'cedula': ''
            },
            instituciones: [],
            titulo: '',
            miusuario: '',
            userEditar: '',
            txt_boton: '',
            mensajeTxt: '',
        }
    },
    props:{
        editar:{
            type:Number,
            default:0
        },
        user:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario;
        if (me.editar == 1) {
            me.titulo = 'Editar usuario';
            me.txt_boton = 'Editar';
            me.mensajeTxt = ' editado '
            me.userEditar =  me.user;
            me.usuarioSalle = me.userEditar;
            me.usuarioSalle.estado = me.userEditar.estado_idEstado
            me.perfil.id = me.userEditar.id_group
            if (me.perfil.id == 12) me.perfil.nombre = 'Administrador Salle'
            if (me.perfil.id == 13) me.perfil.nombre = 'Docente Salle'
            if (me.perfil.id == 6) me.perfil.nombre = 'Docente'

            // Mapear institución - diferentes estructuras para docentes vs administradores
            if (me.userEditar.idInstitucion && me.userEditar.nombreInstitucion) {
                // Estructura de docentes
                me.institucionSelect.idInstitucion = me.userEditar.idInstitucion
                me.institucionSelect.institucion_ciudad = me.userEditar.nombreInstitucion
            } else {
                // Estructura de administradores
                me.institucionSelect.idInstitucion = me.userEditar.institucion_idInstitucion
                me.institucionSelect.institucion_ciudad = me.userEditar.institucion_ciudad
            }
        } else {
            me.titulo = 'Nuevo usuario';
            me.txt_boton = 'Registrar';
            me.mensajeTxt = ' registrado '
        }

        me.getInstituciones();
    },
    methods: {
        getInstituciones() {
            let me = this;
            let idTipo = localStorage.getItem('Salletipo_institucion_id') || '';
            if(idTipo == "" || idTipo == null || idTipo == 'null'){
                me.$vs.notify({
                    text: 'No se pudo obtener el tipo de institución, por favor seleccione un período de evaluación',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            this.$http.get(this.$server_url+'institucionesSalle?tipo_institucion=' + idTipo)
                .then(res => {
                    // console.log(res.data)
                    me.instituciones = res.data
                })
                .catch(err => {
                    console.log(err)
                })
        },
        volver(tipo) {
            let me = this;
            me.$emit('recharge',tipo)
        },
        registrar() {
            let me = this;
            me.errors = {
                email: '',
                cedula: ''
            }
            if (me.usuarioSalle.nombres == '' || me.usuarioSalle.apellidos == '' || me.usuarioSalle.cedula == '' || me.usuarioSalle.email == '' || me.institucionSelect.idInstitucion == '' || me.perfil.id == '' || me.usuarioSalle.telefono == '' || me.usuarioSalle.nombres == null || me.usuarioSalle.apellidos == null || me.usuarioSalle.cedula == null || me.usuarioSalle.email == null || me.institucionSelect.idInstitucion == null || me.perfil.id == null) {
                me.$vs.notify({
                    text: 'Complete todos los campos',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.$vs.loading();
            let datas = new FormData();
            datas.append('idusuario', me.usuarioSalle.idusuario);
            datas.append('cedula', me.usuarioSalle.cedula);
            datas.append('nombre', me.usuarioSalle.nombres);
            datas.append('apellido', me.usuarioSalle.apellidos);
            datas.append('email', me.usuarioSalle.email);
            datas.append('telefono', me.usuarioSalle.telefono);
            datas.append('idInstitucion', me.institucionSelect.idInstitucion);
            datas.append('grupo', me.perfil.id);
            datas.append('estado', me.usuarioSalle.estado);
            datas.append('idcreadorusuario', me.miusuario.idusuario);
            this.$http.post(this.$server_url+'add_edit_user_salle', datas)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Docente ' + me.mensajeTxt + ' correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.volver(2);
                })
                .catch(err => {
                    if (err.response.status == 422) {
                        try {
                            me.errors.email = err.response.data.errors.email[0]
                        } catch (error) {
                            console.log('email bien')
                        }
                        try {
                            me.errors.cedula = err.response.data.errors.cedula[0]
                        } catch (error) {
                            console.log('cedula bien')
                        }
                    }
                    if (me.errors.email != '' || me.errors.cedula != '') {
                        me.$vs.notify({
                            text: me.errors.email + ' ' + me.errors.cedula,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.$vs.loading.close();
                })
        },

    }
}
</script>
