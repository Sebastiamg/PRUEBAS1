<template>
<div class="vx-col md:w-full w-full mb-base">
    <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
    <vx-card>
        <label>Institución: </label>
        <h4> {{institucion.nombreInstitucion}} </h4>
        <div v-if="usuarios.length>0">
            <vs-table max-items="20" search pagination :data="usuarios">
                <template slot="header">
                    <div> Cantidad de usuarios: &nbsp; <b>{{ usuarios.length }}</b> </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="cedula">Cédula</vs-th>
                    <vs-th sort-key="nombres">Nombre</vs-th>
                    <vs-th sort-key="email">Usuario</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].idusuario}}<br>
                            {{data[indextr].cedula}}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombres}}
                            {{data[indextr].apellidos }}
                        </vs-td>
                        <vs-td>
                            <span v-if="tipo== 'docente'"><b><small>usuario:</small></b> {{data[indextr].name_usuario}}<br></span>
                            <small>email: </small> {{data[indextr].email}} 
                        </vs-td>
                        <vs-td>
                            <!-- <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Editar docente" position="top" color="primary">
                                <vs-button style="display: inline-block;" type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="primary" @click="getEditar(tr)"></vs-button>
                            </vx-tooltip> -->
                            <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Asignar libros" position="top" color="success">
                                <span v-if="tipo== 'docente' ">
                                    <vs-button size="small" icon-pack="feather" icon="icon-zap" class="mr-2" color="success" @click="irAsignacion(tr)"></vs-button>
                                </span>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visitas del usuario" position="top" color="primary">
                                <vs-button size="small" icon-pack="feather" icon="icon-globe" class="mr-2" color="primary" @click="verVisitas(tr)"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else class="m-4 p-5">
            No hay usuarios registrados en esta institución.
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
            usuarios: [],
            accesosDocentes: [],
            conteoDocentes: [{ 'idusuario': '', 'cantidad': 0 }],
            accesosEstudiantes: [],
            institucion: '',
            tipo: '',
            conteo: 0,
            usuario: '',
            perfil_autorizado: '',
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('datoUser')
        localStorage.removeItem('user_select')
        localStorage.removeItem('show_inst')
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.institucion = JSON.parse(localStorage.getItem('institucion'))
        me.tipo = localStorage.getItem('tipoUser');
        me.perfil_autorizado = me.usuario.id_group;
        console.log(me.tipo)
        me.getUsuariosTipo();
    },
    methods: {
        getUsuariosTipo() {
            let me = this;
            me.$vs.loading()
            if (me.tipo == 'docente') {
                this.$http.get(this.$server_url + 'docentes?idInstitucion=' + me.institucion.idInstitucion)
                    .then(function (response) {
                        me.usuarios = response.data
                        me.$vs.loading.close()
                        // console.log(me.usuarios)
                    })
                    .catch(function (error) {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
            if (me.tipo == 'estudiante') {
                this.$http.get(this.$server_url + 'estudiantesXInstitucion/' + me.institucion.idInstitucion)
                    .then(function (response) {
                        me.usuarios = response.data
                        me.$vs.loading.close()
                        // console.log(me.usuarios)
                    })
                    .catch(function (error) {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
        },
        verVisitas(item) {
            let me = this;
            // console.log(item);
            localStorage.datoUser = JSON.stringify(item);
            if (me.tipo == 'docente') {
                me.$router.push('/institucion/docentes/visitas');
            }
            if (me.tipo == 'estudiante') {
                me.$router.push('/institucion/estudiante/visitas');
            }
        },
        irAsignacion(item) {
            let me = this;
            // console.log( item )
            localStorage.setItem('user_select', (JSON.stringify(item)));
            localStorage.setItem('show_inst', 'si'); //desde vista docentes, mostrar institucion
            me.$router.push('/usuarios/asignaturasInstitucion');
        },

        volver() {
            let me = this;
            me.$router.go(-1)

        },
         getEditar(usuario) {
            this.$emit('estado', {
                plista: false,
                pnuevo: false,
                peditar: true,
                usuario: usuario
            });
        },
    }
}
</script>
