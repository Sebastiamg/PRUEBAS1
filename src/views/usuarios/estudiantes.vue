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
            <vs-th>Estudiante</vs-th>
            <vs-th>Email</vs-th>
            <vs-th>Estado</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="tr.nombres">
                    {{tr.nombres}}
                    {{tr.apellidos}}<br>
                    <i>{{tr.cedula}}</i>
                </vs-td>
                <vs-td :data="tr.name_usuario">
                    Usuario: {{tr.name_usuario}}<br>
                    Email: {{tr.email}}
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
                        <vx-tooltip style="display: inline-block;" text="Editar estudiante" position="top" color="primary">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="primary" @click="getEditar(tr)"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Libros del estudiante" position="top" color="warning">
                            <vs-button size="small" icon-pack="feather" icon="icon-book" class="mr-2 mb-1" color="warning" type="border" @click="librosEstudiante(tr)"></vs-button>
                        </vx-tooltip>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="openEliminar(tr.idusuario)"></vs-button> -->
                    </div>
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
        id: ''
    }),
    mounted() {
        localStorage.removeItem('student_select');
        this.getAdmin();
    },
    methods: {
        async getAdmin() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'docente?grupo=4')
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
        librosEstudiante(item) {
            let me = this;
            // console.log(this.$route.path)
            localStorage.setItem('student_select', JSON.stringify(item))
            if (this.$route.path == '/usuarios') {
                me.$router.push('/usuarios/librosEstudiante');
            } else {
                me.$router.push('/director/institucion/listaLibrosEstudiante');
            }
        }
    },
}
</script>
