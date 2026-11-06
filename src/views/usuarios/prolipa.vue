<template>
<vx-card>
    <div v-if="op_agregar==0">

        <vs-button type="border" icon-pack="feather" icon="icon-user-plus" @click="agrega_nuevo_user()">
            Agregar usuario
        </vs-button>
        <vs-table max-items="10" search pagination :data="docente">
            <template slot="header">
                Cantidad: {{docente.length}}
            </template>
            <template slot="thead">
                <vs-th>Nombres</vs-th>
                <vs-th>Correo</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.nombres">
                        {{tr.nombres}}
                        {{tr.apellidos}} <br>
                        <small><i>{{tr.cedula}}</i></small>
                    </vs-td>
                    <vs-td :data="tr.name_usuario">
                        <i>Usuario:</i> {{tr.name_usuario}}<br>
                        {{tr.email}} <br>
                        <small v-if="tr.id_group == 1" class="text-success">Admin</small>
                        <small v-if="tr.id_group == 5">Postventa</small>
                        <small v-if="tr.id_group == 9">Libros</small>
                        <small v-if="tr.id_group == 10" class="text-primary">Director</small>
                        <small v-if="tr.id_group == 11" class="text-warning">Asesor</small>
                    </vs-td>
                    <vs-td :data="tr.estado_idEstado">
                        <vs-chip v-if="tr.estado_idEstado == '1'" color="success">
                            Activo
                        </vs-chip>
                        <vs-chip v-if="tr.estado_idEstado == '2'" color="dark">
                            Bloqueado
                        </vs-chip>
                        <vs-chip v-if="tr.estado_idEstado == '4'" color="danger">
                            Eliminado
                        </vs-chip>
                        <vs-chip v-if="!tr.estado_idEstado" color="warning">
                            Sin estado
                        </vs-chip>
                    </vs-td>
                    <vs-td :data="tr.idInstitucion">
                        <div class="flex">
                            <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Asignar libros" position="top" color="success">
                                <vs-button style="display: inline-block;" size="small" icon-pack="feather" icon="icon-zap" color="success" type="border" @click="irAsignacion(tr)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                                <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="warning" @click="getEditar(tr)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip v-if="perfil_autorizado == 1" text="Asignar la institucion a este usuario" position="top" color="rgb(134, 4, 98)" style="display: inline-block;">
                                <vs-button type="border" size="small" icon-pack="feather" icon="icon-target" color="rgb(134, 4, 98)" @click="getDirector(tr)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visitas del usuario" position="top" color="primary">
                                <vs-button size="small" icon-pack="feather" icon="icon-globe" color="primary" @click="verVisitas(tr)"></vs-button>
                            </vx-tooltip>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <div v-if="op_agregar==1">
        <registro @escuchar="variableHijo"></registro>
    </div>
</vx-card>
</template>

<script>
import registro from './agrega_usuario.vue'
import axios from 'axios'
export default {
    components: {
        registro,
    },
    data: () => ({
        tmpDocente: [],
        docente: [],
        prueba: [],
        id: '',
        usuario: '',
        perfil_autorizado: '',
        op_agregar: 0,
        op_recibir: null,
        NumeroInsertadoPadre: 0,
        numeroEnviar: 0,
        id_eliminar: '',

    }),
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.perfil_autorizado = me.usuario.id_group;
        me.getAdmin();
    },
    methods: {
        variableHijo(valor) {
            let me = this;
            me.op_agregar = valor;
        },
        enviarHijo() {
            let me = this;
            me.numeroEnviar = me.NumeroInsertadoPadre;
        },
        async getAdmin() {
            let me = this;
            me.$vs.loading();
            me.docente = [];
            this.$http.get(this.$server_url + 'usuarios_grupos')
                .then(function (response) {
                    me.docente = response.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })

        },
        getEditar(usuario) {
            this.$emit('estado', {
                plista: false,
                pnuevo: false,
                peditar: true,
                usuario: usuario
            });
        },
        add_user() {
            this.$emit('estado', {
                plista: false,
                pnuevo: true,
                peditar: false,
                idusuario: ''
            });
        },
        openEliminar(item) {
            this.id = item
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este material?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: this.confirmEliminar
            })
        },
        confirmEliminar() {
            let me = this
            this.$http.post(this.$server_url + 'eliminarUsuario', {
                    idusuario: this.id
                })
                .then(res => {
                    me.$vs.notify({
                        text: 'Usuario eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getAdmin()
                })
                .catch(error => {

                })
        },
        irAsignacion(item) {
            let me = this;
            // console.log( item )
            localStorage.setItem('user_select', (JSON.stringify(item)));
            localStorage.setItem('show_inst', 'no'); //desde vista usuarios
            me.$router.push('/usuarios/asignaturasDocentes');
        },
        verVisitas(item) {
            let me = this;
            // console.log(item);
            localStorage.datoUser = JSON.stringify(item);
            me.$router.push('/admin/usuarios/visitas');

        },
        agrega_nuevo_user() {
            let me = this;
            me.op_agregar = 1;
            // me.$router.push('/usuarios/agregar');
        },
        getDirector(item) {
            let me = this;
            me.$vs.loading();
            axios.get('https://foro.prolipadigital.com.ec/director-instituciones?idusuario=' + item.idusuario + '&idinstitucion=' + item.institucion_idInstitucion)
                .then(res => {
                    // console.log(res.data)
                    if (res.data.length > 0) {
                        // me.$vs.notify({
                        //     text: 'Este usuario ya tiene una asignacion como director',
                        //     color: 'warning',
                        //     iconPack: 'feather',
                        //     icon: 'icon-alert-triangle'
                        // })
                        me.id_eliminar = res.data[0].id;
                        me.$vs.dialog({
                            color: 'danger',
                            title: `Eliminar`,
                            text: 'Este usuario ya tiene una institución asignada, desea eliminar esta asignación?',
                            acceptText: 'Aceptar',
                            accept: me.quitarDirector,
                        })

                        me.$vs.loading.close();
                    } else {
                        this.$http.get(this.$server_url + 'cambiarDirector/' + item.idusuario)
                            .then(function (response) {
                                // console.log(response.data)
                                me.$vs.notify({
                                    time: 8000,
                                    text: 'El usuario ' + item.nombres + ' ' + item.apellidos + ' ha sido cambiado a director.',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                })
                                me.getAdmin();
                                me.$vs.loading.close();
                            })
                            .catch(function (error) {
                                me.$vs.loading.close();
                            })
                        axios.post('https://foro.prolipadigital.com.ec/director-instituciones', {
                                'idusuario': item.idusuario,
                                'idinstitucion': item.institucion_idInstitucion,
                                'estado': true,
                            })
                            .then(res => {
                                // console.log(res.data)
                                me.$vs.notify({
                                    time: 8000,
                                    text: item.nombres + ' ' + item.apellidos + ' ha sido asignada la institucion como director',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                })
                            })
                            .catch(function (error) {
                                me.$vs.loading.close();
                            })
                    }
                })
        },
        quitarDirector() {
            let me = this;
            axios.delete('https://foro.prolipadigital.com.ec/director-instituciones/' + me.id_eliminar)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        time: 8000,
                        text: 'Este usuario ya no tiene ninguna institucion asignada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        }
    }
}
</script>
