<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <vs-button v-if="grupo_usuario==6" @click="$router.go(-1);" color="dark" type="border">Volver</vs-button> &nbsp; -->
        <vs-button v-if="grupo_usuario==1" class="m-1" @click="crearAdaptacion()" color="success">Agregar</vs-button>
        <vs-table max-items="10" search pagination :data="adaptaciones" style="margin-top:-20px" class="stripe">
            <template slot="header">
                <p>Total de propuestas metodológicas registradas: <b>{{adaptaciones.length}}</b> </p>
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
                        {{data[indextr].asignatura.nombreasignatura}} <br>
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
                        <small> Actualizada: {{data[indextr].updatedAt | fecha}} </small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip v-if="grupo_usuario == 1" style="display: inline-block;" text="editar contenido" position="top" color="success">
                            <vs-button @click="editarAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="ver contenido" position="top" color="primary">
                            <vs-button @click="verAdaptacion(data[indextr])" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                        </vx-tooltip>
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
            adaptaciones: [],
            tmpAdaptaciones: [],
            edita: '',
            usuario: '',
            grupo_usuario: '',
            idasignatura: '',
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('editarA');
        localStorage.removeItem('contenidoAD');
        me.idasignatura = localStorage.getItem('idasignatura');
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.grupo_usuario = me.usuario.id_group;

        me.getPropuestas();
    },
    methods: {
        getPropuestas() {
            let me = this;
            me.$vs.loading()
            if (me.grupo_usuario == 1) { //todas las propuestas metodologicas, para los administradores
                axios.get('https://foro.prolipadigital.com.ec/propuesta-metodologicas?_sort=updatedAt:DESC')
                    .then(res => {
                        me.adaptaciones = res.data
                        // console.log(me.adaptaciones)
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
            if (me.grupo_usuario != 1) { //propuestas metodologicas ACTIVAS para los docentes
                axios.get('https://foro.prolipadigital.com.ec/propuesta-metodologicas?estado=true')
                    .then(res => {
                        me.tmpAdaptaciones = res.data
                        for (let index = 0; index < me.tmpAdaptaciones.length; index++) {
                            if (me.tmpAdaptaciones[index].asignatura.idasignatura == me.idasignatura) {
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
            me.$router.push('/nuevapropuesta')
        },
        editarAdaptacion(item) {
            let me = this;
            localStorage.editarA = 2;
            localStorage.contenidoAD = JSON.stringify(item);
            me.$router.push('/nuevapropuesta')
        },
        verAdaptacion(item) {
            let me = this;
            localStorage.editarA = 2;
            localStorage.contenidoAD = JSON.stringify(item);
            if (me.grupo_usuario == 1) {
                me.$router.push('/verpropuestaAdmin')
            }
            if (me.grupo_usuario == 6 || me.grupo_usuario == 9) {
                me.$router.push('/verpropuesta')
            }
            if (me.grupo_usuario == 10) {
                me.$router.push('/director/institucion/docentes/contenidos/libro/propuestas/ver')
            }
        },
        openConfirmEliminar(item) {
            let me = this;
            me.eliminaAdap = item
            console.log(item)
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
                // console.log(me.eliminaAdap.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaAdap.unidad1[0].id)
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
                // console.log(me.eliminaAdap.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaAdap.unidad2[0].id)
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
                // console.log(me.eliminaAdap.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaAdap.unidad3[0].id)
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
                // console.log(me.eliminaAdap.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaAdap.unidad4[0].id)
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
                // console.log(me.eliminaAdap.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaAdap.unidad5[0].id)
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
                // console.log(me.eliminaAdap.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaAdap.unidad6[0].id)
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

            //eliminar adaptaciopn curricular
            axios.delete('https://foro.prolipadigital.com.ec/propuesta-metodologicas/' + me.eliminaAdap.id)
                .then(res => {
                    me.$vs.notify({
                        text: 'Propuesta metodológica eliminada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getPropuestas()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'No se eliminó la propuesta metodológica',
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
