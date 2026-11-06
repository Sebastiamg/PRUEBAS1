<template>
<div>
    <div class="con-tab-ejemplo">
      <vs-button color="primary" v-if="permisoRoot" icon-pack="feather" icon="icon-plus" @click="abrirModalCrear()" type="filled">
          Crear Tipo de Institución
      </vs-button>
        <div v-if="tiposInstitucion.length > 0">
            <vs-table max-items="10" search pagination :data="tiposInstitucion">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b>{{ tiposInstitucion.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="400">Descripción</vs-th>
                    <vs-th width="150">Fecha Creación</vs-th>
                    <vs-th width="150">Última Actualización</vs-th>
                    <vs-th width="150">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                          #{{ tr.id }}
                            {{ data[indextr].descripcion }}
                        </vs-td>
                        <vs-td>
                            {{ formatDate(data[indextr].created_at) }}
                        </vs-td>
                        <vs-td>
                            {{ formatDate(data[indextr].updated_at) }}
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Editar tipo de institución" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success"
                                                 @click="openModalEditar(data[indextr])"
                                                 type="filled" icon-pack="feather" icon="icon-edit">
                                        </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Eliminar tipo de institución" position="top" color="danger">
                                        <vs-button class="modal-default-button" size="small" color="danger"
                                                 @click="openConfirm(data[indextr].id)"
                                                 type="filled" icon-pack="feather" icon="icon-trash-2">
                                        </vs-button>
                                    </vx-tooltip>
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else class="p-3">
            <p>No existen tipos de institución aún.</p>
        </div>
    </div>

    <!-- Modal Agregar -->
    <div class="demo-alignment">
        <vs-popup classContent="popup-example" title="Agregar Tipo de Institución" :active.sync="popupAddTipo">
            <vs-input
                class="inputx mb-3 w-full"
                label="Descripción"
                placeholder="Ingrese la descripción del tipo de institución"
                v-model="tipoInstitucion.descripcion"
            />
            <vs-button color="success" class="w-full mb-3" @click="guardarTipoInstitucion()" type="gradient">
                Guardar
            </vs-button>
        </vs-popup>
    </div>

    <!-- Modal Editar -->
    <div class="demo-alignment">
        <vs-popup classContent="popup-example" title="Editar Tipo de Institución" :active.sync="popupEditTipo">
            <vs-input
                class="inputx mb-3 w-full"
                label="Descripción"
                placeholder="Ingrese la descripción del tipo de institución"
                v-model="tipoInstitucion.descripcion"
            />
            <vs-button color="success" class="w-full mb-3" @click="guardarTipoInstitucion()" type="gradient">
                Actualizar
            </vs-button>
        </vs-popup>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default {
    data() {
        return {
            tiposInstitucion: [],
            popupAddTipo: false,
            popupEditTipo: false,
            update: false,
            id: 0,
            tipoInstitucion: {
                descripcion: ''
            },
            permisoRoot: true, // Ajustar según tu sistema de permisos
            usuario: []
        }
    },
    methods: {
        // Obtener todos los tipos de institución
        obtenerTiposInstitucion() {
            let me = this;
            me.$vs.loading();

            this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
                .then(function (res) {
                    if (res.data.status == 1) {
                        me.tiposInstitucion = res.data.data;
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Error al cargar los tipos de institución',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.notify({
                        text: 'Error de conexión al cargar los tipos de institución',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.$vs.loading.close();
                });
        },

        // Guardar o actualizar tipo de institución
        guardarTipoInstitucion() {
            let me = this;

            // Validación
            if (me.tipoInstitucion.descripcion.trim() === '') {
                this.$vs.notify({
                    text: 'La descripción es requerida',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            me.$vs.loading();

            let formData = new FormData();
            formData.append('descripcion', me.tipoInstitucion.descripcion);
            formData.append('action', 'Post_GuardarTipoInstitucion');
            if (me.update) {
                formData.append('id', me.id);
                formData.append('user_edited', me.usuario.idusuario || null);
            } else {
                formData.append('user_created', me.usuario.idusuario || null);
            }

            this.$http.post(this.$server_url + 'metodosPostInstitucion', formData)
                .then(function (res) {
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.obtenerTiposInstitucion();
                        me.popupAddTipo = false;
                        me.popupEditTipo = false;
                        me.limpiar();
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Error al guardar el tipo de institución',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.notify({
                        text: 'Error de conexión al guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.$vs.loading.close();
                });
        },

        // Eliminar tipo de institución
        eliminarTipoInstitucion() {
            let me = this;
            me.$vs.loading();

            let formData = new FormData();
            formData.append('id', me.id);
            formData.append('action', 'Delete_TipoInstitucion');

            this.$http.post(this.$server_url + 'metodosPostInstitucion', formData)
                .then(function (res) {
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message || 'Tipo de institución eliminado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.obtenerTiposInstitucion();
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Error al eliminar el tipo de institución',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error);

                    // Verificar si el error tiene la estructura específica
                    let errorMessage = 'Error de conexión al eliminar';
                    if (error.response && error.response.data &&
                        error.response.data.status === 0 &&
                        error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }

                    me.$vs.notify({
                        text: errorMessage,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.$vs.loading.close();
                });
        },

        // Abrir modal de confirmación para eliminar
        openConfirm(id) {
            this.id = id;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmación',
                text: '¿Estás seguro de eliminar este tipo de institución?',
                accept: this.eliminarTipoInstitucion,
                acceptText: "Aceptar",
                cancelText: "Cancelar",
            });
        },

        // Abrir modal de creación
        abrirModalCrear() {
            let me = this;
            me.limpiar();
            me.popupAddTipo = true;
        },

        // Abrir modal de edición
        openModalEditar(data = {}) {
            let me = this;
            me.update = true;
            me.id = data.id;
            me.tipoInstitucion.descripcion = data.descripcion;
            me.popupEditTipo = true;
        },

        // Limpiar campos
        limpiar() {
            let me = this;
            me.tipoInstitucion.descripcion = "";
            me.update = false;
            me.id = 0;
        },

        // Formatear fecha
        formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
    },

    mounted() {
        this.obtenerTiposInstitucion();
    },

    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    }
}
</script>

<style scoped>
.con-tab-ejemplo {
    padding: 20px;
}

.popup-example {
    padding: 20px;
}

.inputx {
    margin-bottom: 15px;
}

.w-full {
    width: 100%;
}

.mb-3 {
    margin-bottom: 1rem;
}

.p-3 {
    padding: 1rem;
}
</style>
