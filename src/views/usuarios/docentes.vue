<template>
<vx-card>
    <!-- <vs-button type="border" icon-pack="feather" icon="icon-user-plus" @click="add_user">
        Agregar usuario
    </vs-button> -->
    <vs-table max-items="20" search pagination :data="docente">
        <template slot="header">
            Cantidad: {{docente.length}}
        </template>
        <template slot="thead">
            <vs-th width="40%">Nombres</vs-th>
            <vs-th width="15%">Correos</vs-th>
            <vs-th width="10%">Estado</vs-th>
            <vs-th width="20%">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="tr.nombres">
                    {{tr.nombres}}
                    {{tr.apellidos}}<br>
                    <small>{{tr.cedula}}</small>
                </vs-td>
                <vs-td :data="tr.email">
                    <i>Usuario:</i> {{tr.name_usuario}}<br>
                    {{tr.email}}
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
                    <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Asignar libros" position="top" color="success">
                        <vs-button style="display: inline-block;" size="small" icon-pack="feather" icon="icon-zap" color="success" type="border" @click="irAsignacion(tr)"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Editar docente" position="top" color="primary">
                        <vs-button style="display: inline-block;" type="border" size="small" icon-pack="feather" icon="icon-edit" color="primary" @click="getEditar(tr)"></vs-button>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="openEliminar(tr.idusuario)"></vs-button> -->
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Visitas del usuario" position="top" color="primary">
                        <vs-button size="small" icon-pack="feather" icon="icon-globe" color="primary" @click="verVisitas(tr)"></vs-button>
                    </vx-tooltip>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</vx-card>
</template>

<script>
export default {   
    data: () => ({
        docente: [],
        prueba: [],
        id: '',
        usuario: '',
        perfil_autorizado: '',
        submenu: {
            plista: true,
            pnuevo: false,
            peditar: false,
            pcontenido: false
        },
    }),
    mounted() {
        let me = this;
        localStorage.removeItem('user_select')
        localStorage.removeItem('show_inst')
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.perfil_autorizado = me.usuario.id_group;
        me.getAdmin();
    },
    methods: {
        async getAdmin() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'docente?grupo=6')
                .then(function (response) {
                    me.docente = response.data;
                    me.$vs.loading.close();
                    // console.log(me.docente);
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
                pnuevo: false,
                peditar: true,
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
    },
}
</script>
