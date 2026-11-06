<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <vs-button v-if="grupo_usuario==6" @click="$router.go(-1);" color="dark" type="border">Volver</vs-button> &nbsp; -->
        <vs-button v-if="grupo_usuario==1" class="m-1" @click="crearAdaptacion()" color="success">Agregar</vs-button>
        <vs-table max-items="20" search pagination :data="adaptaciones" style="margin-top:-20px" class="stripe">
            <template slot="header">
                <p>Total de adaptaciones curriculares registradas: <b>{{adaptaciones.length}}</b> </p>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Asignatura</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td width="40%">
                        {{data[indextr].nombre}} <br>
                        <small>{{data[indextr].descripcion}}</small>
                    </vs-td>
                    <vs-td>
                         {{tr.nombreasignatura}} <br>
                        <label v-if="grupo_usuario == 1">
                            <p class="text-danger" v-if="data[indextr].unidad1[0] == undefined"> Sin Unidad 1</p>
                            <p class="text-danger" v-if="data[indextr].unidad2[0] == undefined"> Sin Unidad 2</p>
                            <p class="text-danger" v-if="data[indextr].unidad3[0] == undefined"> Sin Unidad 3</p>
                            <p class="text-danger" v-if="data[indextr].unidad4[0] == undefined"> Sin Unidad 4</p>
                            <p class="text-danger" v-if="data[indextr].unidad5[0] == undefined"> Sin Unidad 5</p>
                            <p class="text-danger" v-if="data[indextr].unidad6[0] == undefined"> Sin Unidad 6</p>
                        </label>
                    </vs-td>
                    <vs-td>
                        <small v-if="data[indextr].estado" class="text-success"> Publicado</small>
                        <small v-else class="text-danger">Inactivo</small><br>
                        <small> Actualizada: {{data[indextr].updated_at | fecha}} </small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="editar contenido" position="top" color="success">
                            <vs-button @click="editarAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                        </vx-tooltip>
                        <div v-if="usuario.id_group == 16">
                            <vx-tooltip v-if="adaptacion.ver == '1'" style="display: inline-block;" text="ver contenido" position="top" color="primary">
                                <vs-button @click="verAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else>
                            <vx-tooltip style="display: inline-block;" text="ver contenido" position="top" color="primary">
                                <vs-button @click="verAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                            </vx-tooltip>
                        </div>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="eliminar contenido" position="top" color="danger">
                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</div>
</template>

<script>
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
    data() {
        return {
            tmpAdaptaciones: [],
            adaptaciones: [],
            edita: '',
            usuario: '',
            grupo_usuario: '',
            id_asignaturaDocente: '',
               //====VARIABLES PARA RECURSOS EXTERNOS
            libro:{
                libroweb:'1',
                libro_con_guia:'1',
                guia_didactica:'1',
                unidades:'1',
            },
            curso:{
                ver:'1',
                agregar:'1',
                editar:'1',
                eliminar:'1',
            },
            cuaderno:{
                guia:'1',
                didactica:'1',
                web:'1',
            },
            planificacion:{
                descargar:'1',
                visualizar:'1',
            },
            //variables para recursos adicionales
            mijuego:{
                agregar:'1',
                editar:'1',
                eliminar:'1',
                ver:'1',
                asignar:'1',
            },
            juegoProlipa:{
                asignar:'1',
                ver:'1',
                previsualizar:'1',
            },
            materialDigital:{
                ver:'1',
                previsualizar:'1',
                asignar:'1',
            },
            materialpdf:{
                subir:'1',
                ver:'1',
                descargar:'1',
                asignar:'1',
            },
            propuesta:{
                ver:'1',
            },
            adaptacion:{
                ver:'1',
            },
            articulo:{
                lengua:'1',
                matematica:'1',
                naturales:'1',
                sociales:'1',
                ensenanza:'1',
            },
            documentom:{
                ver:'1',
            },
            permisosExternos:'',
          //fin de variables para recursos adicionales
          //FIN DE VARIABLES PARA RECURSOS EXTERNOS
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('editarA');
        localStorage.removeItem('contenidoAD');
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.id_asignaturaDocente = localStorage.getItem('idasignatura');
        me.grupo_usuario = me.usuario.id_group;
        me.getAdaptaciones();
        //PERMISOS EXTERNOS
        if(localStorage.status_permisos == "yes"){
            me.permisosExternos = JSON.parse(localStorage.permisosExternos)
            me.libro                    = me.permisosExternos.permisos_libros
            me.curso                    = me.permisosExternos.permisos_cursos
            me.cuaderno                 = me.permisosExternos.permisos_cuadernos
            me.planificacion            = me.permisosExternos.permisos_planificaciones
            //data de los recursos adicionales
            me.mijuego                  = me.permisosExternos.zona_diversion_mi_juego
            me.juegoProlipa             = me.permisosExternos.zona_diversion_juego_prolipa
            me.materialDigital          = me.permisosExternos.material_apoyo_digital
            me.materialpdf              = me.permisosExternos.material_apoyo_pdf
            me.propuesta                = me.permisosExternos.propuestas_metodologicas
            me.adaptacion               = me.permisosExternos.adaptaciones
            me.articulo                 = me.permisosExternos.articulos
            me.documentom               = me.permisosExternos.documentos_ministeriales
        }
        //FIN DE PERMISOS EXTERNOS
    },
    methods: {
        getAdaptaciones() {
              let me = this;
            me.$vs.loading()
            if (me.grupo_usuario == 1) { //todas las propuestas metodologicas, para los administradores
                this.$http.get(this.$server_url+'adaptaciones?admin=yes')
                    .then(res => {
                        me.$vs.loading.close()
                        let datos = res.data
                        for (let i = 0; i < datos.length; i++) {
                            //files
                            let fUnidad1   = []
                            let fUnidad2   = []
                            let fUnidad3   = []
                            let fUnidad4   = []
                            let fUnidad5   = []
                            let fUnidad6   = []
                            fUnidad1       =  datos[i].files.filter(p => p.unidad == 1)
                            fUnidad2       =  datos[i].files.filter(p => p.unidad == 2)
                            fUnidad3       =  datos[i].files.filter(p => p.unidad == 3)
                            fUnidad4       =  datos[i].files.filter(p => p.unidad == 4)
                            fUnidad5       =  datos[i].files.filter(p => p.unidad == 5)
                            fUnidad6       =  datos[i].files.filter(p => p.unidad == 6)
                            //guardar en arreglo
                            me.adaptaciones.push({
                                "id": datos[i].id,
                                "idusuario": datos[i].idusuario,
                                "responsable": datos[i].responsable,
                                "grupo_usuario": datos[i].grupo_usuario,
                                "nombre": datos[i].nombre,
                                "descripcion": datos[i].descripcion,
                                "nombreasignatura": datos[i].nombreasignatura,
                                "asignatura_id": datos[i].asignatura_id,
                                "estado": datos[i].estado,
                                "created_at": datos[i].created_at,
                                "updated_at": datos[i].updated_at,
                                "unidad1": fUnidad1,
                                "unidad2": fUnidad2,
                                "unidad3": fUnidad3,
                                "unidad4": fUnidad4,
                                "unidad5": fUnidad5,
                                "unidad6": fUnidad6,

                            })
                        }
                        console.log('rr',me.adaptaciones)
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
            if (me.grupo_usuario != 1) { //propuestas metodologicas ACTIVAS para los docentes
                this.$http.get(this.$server_url+'adaptaciones?docentes=yes')
                    .then(res => {
                         let datos = res.data
                        for (let i = 0; i < datos.length; i++) {
                            //files
                            let fUnidad1   = []
                            let fUnidad2   = []
                            let fUnidad3   = []
                            let fUnidad4   = []
                            let fUnidad5   = []
                            let fUnidad6   = []
                            fUnidad1       =  datos[i].files.filter(p => p.unidad == 1)
                            fUnidad2       =  datos[i].files.filter(p => p.unidad == 2)
                            fUnidad3       =  datos[i].files.filter(p => p.unidad == 3)
                            fUnidad4       =  datos[i].files.filter(p => p.unidad == 4)
                            fUnidad5       =  datos[i].files.filter(p => p.unidad == 5)
                            fUnidad6       =  datos[i].files.filter(p => p.unidad == 6)
                            //guardar en arreglo
                            me.tmpAdaptaciones.push({
                                "id": datos[i].id,
                                "idusuario": datos[i].idusuario,
                                "responsable": datos[i].responsable,
                                "grupo_usuario": datos[i].grupo_usuario,
                                "nombre": datos[i].nombre,
                                "descripcion": datos[i].descripcion,
                                "nombreasignatura": datos[i].nombreasignatura,
                                "asignatura_id": datos[i].asignatura_id,
                                "estado": datos[i].estado,
                                "created_at": datos[i].created_at,
                                "updated_at": datos[i].updated_at,
                                "unidad1": fUnidad1,
                                "unidad2": fUnidad2,
                                "unidad3": fUnidad3,
                                "unidad4": fUnidad4,
                                "unidad5": fUnidad5,
                                "unidad6": fUnidad6,

                            })
                        }
                        // me.tmpAdaptaciones = res.data
                        for (let index = 0; index < me.tmpAdaptaciones.length; index++) {
                            if (me.tmpAdaptaciones[index].asignatura_id == me.id_asignaturaDocente) {
                                me.adaptaciones.push(me.tmpAdaptaciones[index])
                            }
                        }
                        // console.log(me.tmpAdaptaciones, me.adaptaciones)
                        me.$vs.loading.close()

                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
        },
        crearAdaptacion() {
            let me = this;
            localStorage.editarA = 1
            me.$router.push('/adaptaciones2/nuevaA')
        },
        editarAdaptacion(item) {
            let me = this;
            localStorage.editarA = 2;
            localStorage.contenidoAD = JSON.stringify(item);
            me.$router.push('/adaptaciones2/nuevaA')
        },
        verAdaptacion(item) {
            let me = this;
            localStorage.editarA = 2;
            localStorage.contenidoAD = JSON.stringify(item);
            if (me.grupo_usuario == 1) {
                me.$router.push('/adaptacionesAdmin2/verA')
            }
            if (me.grupo_usuario == 6 || me.grupo_usuario == 9) {
                me.$router.push('/adaptaciones2/verA')
            }
            if (me.grupo_usuario == 16) {
                me.$router.push('/colegios/adaptaciones2/verA')
            }
            if (me.grupo_usuario == 10) {
                me.$router.push('/director/institucion/docentes/contenidos/libro/adaptaciones2/ver')
            }
        },
        openConfirmEliminar(item) {
            let me = this;
            me.eliminaAdap = item
            // console.log(item)
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este archivo?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarAdaptacion
            })
        },
        eliminarAdaptacion() {
            let me = this;
            //eliminar archivo
            if (me.eliminaAdap.unidad1[0] != undefined) {
                axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.unidad1[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Unidad 1, eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        console.log("No se elimina la unidad 1");
                    })
            }
            if (me.eliminaAdap.unidad2[0] != undefined) {
                axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.unidad2[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Unidad 2, eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        console.log("No se elimina la unidad 2");
                    })
            }
            if (me.eliminaAdap.unidad3[0] != undefined) {
                axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.unidad3[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Unidad 3, eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        console.log("No se elimina la unidad 3");
                    })
            }
            if (me.eliminaAdap.unidad4[0] != undefined) {
                axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.unidad4[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Unidad 4, eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        console.log("No se elimina la unidad 4");
                    })
            }
            if (me.eliminaAdap.unidad5[0] != undefined) {
                axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.unidad5[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Unidad 5, eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        console.log("No se elimina la unidad 5");
                    })
            }
            if (me.eliminaAdap.unidad6[0] != undefined) {
                axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.unidad6[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Unidad 6, eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        console.log("No se elimina la unidad 6");
                    })
            }
            me.adaptaciones =[]
            //eliminar adaptacion curricular
            axios.get(this.$data_url+'api/adaptacion/file/eliminar?id='+me.eliminaAdap.id+'&eliminaAdaptacion=yes')
                .then(res => {
                    me.$vs.notify({
                        text: 'Adaptación curricular eliminada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getAdaptaciones()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'No se eliminó la Adaptación curricular',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
    }
}
</script>

<style lang="css">
.text-danger {
    font-size: 11px;
}
</style>
