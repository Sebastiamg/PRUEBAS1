<template>
<div>
    <vs-popup title="Línea de Producto" :active.sync="modalEditar">
        <div class="vx-row m-2">
            <div class="vx-col w-full mb-4" align="left">
                <div style="font-size: 12px;">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="linea.nombre" maxlength="200" placeholder="Nombre de la línea" />
            </div>
            <div class="vx-col w-full mb-4">
                <vs-switch color="success" v-model="linea.estado">
                    <span slot="on">Activo</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div>
            <div class="vx-col w-full">
                <vs-button style="display:inline" class="m-2 mb-2" type="filled" @click="guardarLinea()">Guardar</vs-button>
                <vs-button style="display:inline" class="m-2 mb-2" type="filled" color="warning" @click="cerrarModal()">Cancelar</vs-button>
            </div>
        </div>
    </vs-popup>

    <vx-card>
        <div class="vx-row mt-4">
            <div class="vx-col w-full mb-3" align="left">
                <vs-button color="primary" icon-pack="feather" icon="icon-plus" @click="agregarLinea()">Agregar línea</vs-button>
            </div>
            <div class="vx-col w-full" align="left">
                <vs-chip>Cantidad: {{ lineas.length }}</vs-chip>
                <vs-table stripe pagination max-items="20" search :data="lineas">
                    <template slot="thead">
                        <vs-th>ID</vs-th>
                        <vs-th>Nombre</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td width="10%">
                                {{ data[indextr].id }}
                            </vs-td>
                            <vs-td width="50%">
                                {{ data[indextr].nombre }}
                            </vs-td>
                            <vs-td width="20%">
                                <vs-chip v-if="data[indextr].estado == 1" color="success">Activo</vs-chip>
                                <vs-chip v-else color="danger">Inactivo</vs-chip>
                            </vs-td>
                            <vs-td width="20%">
                                <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                    <vs-button size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-edit" @click="editarLinea(data[indextr])"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                    <vs-button size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-trash" color="danger" @click="confirmarEliminar(data[indextr])"></vs-button>
                                </vx-tooltip>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default {
    data() {
        return {
            usuario: [],
            lineas: [],
            linea: {
                id: '',
                nombre: '',
                estado: true
            },
            modalEditar: false,
            tituloModal: ''
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
        me.cargarLineas();
    },
    methods: {
        cargarLineas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'lineas-productos/all')
                .then(res => {
                    me.lineas = res.data;
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$f_notificacion('Error al cargar las líneas de productos', 'danger', 'icon-alert-triangle', 5000);
                });
        },
        agregarLinea() {
            let me = this;
            me.linea = {
                id: '',
                nombre: '',
                estado: true
            };
            me.tituloModal = "Agregar Línea de Producto";
            me.modalEditar = true;
        },
        editarLinea(item) {
            let me = this;
            me.linea = {
                id: item.id,
                nombre: item.nombre,
                estado: item.estado == 1 ? true : false
            };
            me.tituloModal = "Editar Línea de Producto";
            me.modalEditar = true;
        },
        guardarLinea() {
            let me = this;
            
            if (!me.linea.nombre || me.linea.nombre.trim() == '') {
                me.$f_notificacion('Complete el campo nombre', 'warning', 'icon-alert-triangle', 5000);
                return;
            }

            me.$vs.loading();

            let formData = new FormData();
            if (me.linea.id && me.linea.id != '') {
                formData.append('id', me.linea.id);
                formData.append('user_edited', me.usuario.idusuario);
            } else {
                formData.append('user_created', me.usuario.idusuario);
            }
            formData.append('nombre', me.linea.nombre);
            formData.append('estado', me.linea.estado ? 1 : 0);

            this.$http.post(this.$server_url + 'lineas-productos/save', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.ok === false) {
                        me.$f_notificacion(res.data.message, 'danger', 'icon-alert-triangle', 5000);
                        return;
                    }
                    me.modalEditar = false;
                    me.$f_notificacion(res.data.message, 'success', 'icon-check', 5000);
                    me.cargarLineas();
                })
                .catch(error => {
                    me.$vs.loading.close();
                    let msg = 'Error al guardar';
                    if (error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    me.$f_notificacion(msg, 'danger', 'icon-alert-triangle', 5000);
                });
        },
        confirmarEliminar(item) {
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Seguro desea eliminar (desactivar) esta línea de producto?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: function() {
                    me.eliminarLinea(item.id);
                }
            });
        },
        eliminarLinea(id) {
            let me = this;
            me.$vs.loading();
            this.$http.post(this.$server_url + 'lineas-productos/delete/' + id)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.ok === false) {
                        me.$f_notificacion(res.data.message, 'danger', 'icon-alert-triangle', 5000);
                        return;
                    }
                    me.$f_notificacion(res.data.message, 'success', 'icon-check', 5000);
                    me.cargarLineas();
                })
                .catch(error => {
                    me.$vs.loading.close();
                    let msg = 'Error al eliminar';
                    if (error.response && error.response.data && error.response.data.message) {
                        msg = error.response.data.message;
                    }
                    me.$f_notificacion(msg, 'danger', 'icon-alert-triangle', 5000);
                });
        },
        cerrarModal() {
            let me = this;
            me.modalEditar = false;
        }
    }
}
</script>

<style scoped>
</style>
