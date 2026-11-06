<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <vs-button @click="$router.go(-1);" color="dark" type="border">Volver</vs-button> &nbsp; -->

        <vs-button class="m-1" @click="crearPublicacion()" color="success">Agregar</vs-button>
        <vs-button class="m-1" @click="verPub()" color="warning">Ver artículos</vs-button>
        <vs-table max-items="10" search pagination :data="publicaciones" class="stripe">
            <template slot="header">
                <p>Total de articulos registrados: <b>{{publicaciones.length}}</b> </p>
            </template>
            <template slot="thead">
                <vs-th>Nombre</vs-th>
                <vs-th>Área</vs-th>
                <vs-th>Archivo</vs-th>
                <vs-th>Portada</vs-th>
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
                        {{data[indextr].asignatura.nombre}}
                    </vs-td>
                    <vs-td width="25%">
                        <span v-if="data[indextr].archivo[0] != undefined">
                            <span>
                                {{data[indextr].archivo[0].name}}
                            </span>
                        </span>
                        <span v-else class="text-danger"><i> Sin archivo</i></span> <br>
                        <span v-if="data[indextr].portada == undefined" class="text-danger" style="font-size:10px"><i> Sin portada</i></span>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].portada.name}}
                    </vs-td>
                    <vs-td>
                        <small v-if="data[indextr].estado" class="text-success"> Publicado</small>
                        <small v-else class="text-danger">Inactivo</small><br>
                        <small> {{data[indextr].updatedAt | fecha}} </small>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip style="display: inline-block;" text="editar publicación" position="top" color="success">
                            <vs-button @click="editaPub(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="eliminar publicaciòn" position="top" color="danger">
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
            publicaciones: '',
            eliminaWQ: '',
            usuario: [],
            grupo_usuario: '',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.grupo_usuario = me.usuario.id_group;
        me.getPublicaciones();
    },
    methods: {
        getPublicaciones() {
            let me = this;
            me.$vs.loading();
            axios.get('https://foro.prolipadigital.com.ec/publicaciones?_sort=updatedAt:DESC')
                .then(res => {
                    me.publicaciones = res.data;
                    // console.log(me.publicaciones)
                    me.$vs.loading.close();
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.log(error)
                })
        },
        crearPublicacion() {
            let me = this;
            me.$router.push('/publicacion');

        },
        editaPub(item) {
            localStorage.edita = true;
            localStorage.publicacion = JSON.stringify(item);
            this.$router.push('/publicacion');
        },
        openConfirmEliminar(item) {
            let me = this;
            me.eliminaWQ = item
            console.log(item)
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este artículo?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarWebQ
            })
        },
        eliminarWebQ() {
            let me = this;
            //eliminar archivo
            if (me.eliminaWQ.archivo[0] != undefined) {
                // console.log(me.eliminaWQ.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.archivo[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Archivo eliminado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        me.$vs.notify({
                            text: 'No se eliminó el archivo',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
            }
            if (me.eliminaWQ.portada != undefined) {
                // console.log(me.eliminaWQ.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.portada.id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Portada eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        me.$vs.notify({
                            text: 'No se eliminó la portada',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
            }

            //eliminar proyecto
            axios.delete('https://foro.prolipadigital.com.ec/publicaciones/' + me.eliminaWQ.id)
                .then(res => {
                    me.$vs.notify({
                        text: 'Artículo eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getPublicaciones()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'No se eliminó el artículo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        verPub() {
            let me = this
            if (me.grupo_usuario == 6) {
                me.$router.push('/vpublicaciones');
            }
            if (me.grupo_usuario == 1) {
                me.$router.push('/verpublicacionesAdmin');
            }
        },
    }
}
</script>
