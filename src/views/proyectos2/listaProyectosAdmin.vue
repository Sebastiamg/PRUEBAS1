<template>
<div class="vx-col md:w-full w-full mb-base">
    <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
    <vx-card>
        <vs-button @click="crearProyecto()" color="success">Agregar proyecto</vs-button>
        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab :label="'Mis proyectos'">
                    <vs-table max-items="20" stripe search pagination :data="proyectos_admin_prolipa">
                        <template slot="header">
                            <vs-chip color="primary">Cantidad: {{ proyectos_admin_prolipa.length }}</vs-chip>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                           <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <!-- mostrar solo los proyectos creados por el docente -->
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td width="40%">
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <vs-td width="25%">
                                    <span v-if="data[indextr].asignaturas.length > 0">
                                        <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].asignaturas" :key="indexpr">
                                            {{pr.nombreasignatura}}
                                        </vs-chip>
                                    </span>
                                    <span v-else class="text-danger"> Sin asignaturas </span>
                                </vs-td>
                                <vs-td width="20%">
                                    <small>
                                        Creado: {{data[indextr].created_at | fecha}}<br>
                                        Actualizado: {{data[indextr].updated_at | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="10%">
                                    <vx-tooltip style="display: inline-block;" text="editar webquest" position="top" color="success">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="visualizar webquest" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy=true)" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="eliminar webquest" position="top" color="danger" v-if="data[indextr].idusuario == usuario.idusuario || usuario.id_group == 1">
                                        <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab :label="'Proyectos Prolipa'">
                    <vs-table max-items="20" search pagination :data="proyectos_prolipa">
                        <template slot="header">
                            <vs-chip color="primary">Cantidad: {{ proyectos_prolipa.length }}</vs-chip>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                           <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <vs-td width="25%">
                                    <span v-if="data[indextr].asignaturas.length > 0">
                                        <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].asignaturas" :key="indexpr">
                                            {{pr.nombreasignatura}}
                                        </vs-chip>
                                    </span>
                                    <span v-else class="text-danger"> Sin asignaturas </span>
                                </vs-td>
                                <vs-td width="25%">
                                    <small>
                                        <span v-if="grupo_usuario == '1'"> Responsable: {{data[indextr].responsable}}<br> </span>
                                        Creado: {{data[indextr].created_at | fecha}}<br>
                                        Actualizado: {{data[indextr].updated_at | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <vx-tooltip v-if="usuario.id_group == 1" style="display: inline-block;" text="editar webquest" position="top" color="success">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="visualizar webquest" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy=true)" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>

                                    <label v-if="grupo_usuario == 1">
                                        <vx-tooltip style="display: inline-block;" text="eliminar webquest" position="top" color="danger" v-if="data[indextr].idusuario == usuario.idusuario || usuario.id_group == 1">
                                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                        </vx-tooltip>
                                    </label>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab :label="'Proyectos de docentes'" @click="getProyectosDocentes">
                    <vs-table max-items="20" search pagination :data="proyectos_todo_docentes">
                        <template slot="header">
                            <vs-chip color="primary">Cantidad: {{ proyectos_todo_docentes.length }}</vs-chip>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                           <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                               <vs-td width="25%">
                                    <span v-if="data[indextr].asignaturas.length > 0">
                                        <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].asignaturas" :key="indexpr">
                                            {{pr.nombreasignatura}}
                                        </vs-chip>
                                    </span>
                                    <span v-else class="text-danger"> Sin asignaturas </span>
                                </vs-td>
                                <vs-td width="25%">
                                    <small>
                                        Docente: {{data[indextr].responsable}}<br>
                                        Creado: {{data[indextr].created_at | fecha}}<br>
                                        Actualizado: {{data[indextr].updated_at | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <vx-tooltip v-if="usuario.id_group == 1" style="display: inline-block;" text="editar webquest" position="top" color="success">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="visualizar webquest" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy=false)" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                    <label v-if="grupo_usuario == 1">
                                        <vx-tooltip style="display: inline-block;" text="eliminar webquest" position="top" color="danger" v-if="usuario.id_group == 1">
                                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                        </vx-tooltip>
                                    </label> 
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
            </vs-tabs>
        </div>
    </vx-card>
</div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from "moment";
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
    // apollo: {
    //     proyectos: gql `query {
    //         proyectos { id nombre descripcion asignatura idusuario grupo_usuario archivo{id} archivodocente{id} createdAt updatedAt proyectos_asignaturas{ id datos idasignatura } } }`,
    // },
    data() {
        return {
            lista_proyectos: '',
            eliminaWQ: '',
            usuario: '',
            grupo:'1',
            grupo_usuario: '',
            proyectos_prolipa: [],
            proyectos_todo_docentes: [],
            proyectos_admin_prolipa: [],
            asignaturaDocente: '',
            tipoProy: '',
            proyectos: '',
            miusuario: '',
            filesEliminar: ['archivo', 'archivodocente', 'fileIntroduccion', 'fileTarea', 'fileProceso', 'fileRecurso', 'fileEvaluacion', 'fileConclusion']
        }
    },
    mounted() {
        localStorage.removeItem('webq')
        localStorage.removeItem('edita')
        localStorage.removeItem('tipoProyectoControl')
        this.asignaturaDocente = localStorage.getItem('idasignatura')
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.grupo_usuario = this.miusuario.id_group
        this.getProyectos();
    },
    methods: {
        getProyectos() {
            let me = this;
            me.proyectos_admin_prolipa = [];
            me.proyectos_prolipa = [];
            me.proyectos_todo_docentes = [];
            me.$vs.loading();
            this.$http.get(this.$server_url+'proyectos?grupo=1')
            .then(function (res) {
                me.$vs.loading.close()
                me.proyectos_prolipa = res.data
                let datos = res.data
                me.proyectos_admin_prolipa = datos.filter(p => p.idusuario == me.miusuario.idusuario)
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        getProyectosDocentes(){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'proyectos?grupo=6')
            .then(function (res) {
                me.$vs.loading.close()
                me.proyectos_todo_docentes = res.data;
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        crearProyecto() {
            this.$router.push('/agregarProyectoAdmin2');
        },
        editaWebQ(item) {
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            this.$router.push('/agregarProyectoAdmin2');
        },
        openConfirmEliminar(item) {
            let me = this;
            me.eliminaWQ = item
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este proyecto?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_eliminarWebQ
            })
        },
        f_eliminarWebQ() {
            let me = this;
            let cantidad = me.eliminaWQ.asignaturas.length;
            let conteo = 0;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.eliminaWQ.asignaturas[0].asignatura_id
            let h_nombreasignatura = me.eliminaWQ.asignaturas[0].nombreasignatura
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'eliminar',
                'recurso_tipo':'proyecto',
                'recurso_nombre': me.eliminaWQ.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            this.$http.post(this.$server_url+'proyectos/eliminar?id='+ me.eliminaWQ.id+'&eproyecto=yes')
                .then(res => {
                    me.$vs.notify({
                        text: 'Proyecto eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getProyectos()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'No se eliminó el proyecto',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        verWebQ(item) {
            let me = this;
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = item.asignaturas[0].asignatura_id
            let h_nombreasignatura = item.asignaturas[0].nombreasignatura
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo':'proyecto',
                'recurso_nombre': item.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            this.$router.push('/verProyectosAdmin2');
        },
        volver() {
            let me = this;
            this.$router.push('/proyectosAdmin2');
        }
    }
}
</script>

<style lang="css">
.descripcion {
    color: rgb(123, 159, 160);
}
</style>
