<template>
<div>
    <div class="con-tab-ejemplo">
        <div v-if="areas.length > 0 ">
            <vs-button color="dark" v-if="permisoRoot" @click="limpiar();popupAddTema=true;" type="filled">Crear Area</vs-button>
            <vs-table max-items="10" search pagination :data="areas">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ areas.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="250">Nombre</vs-th>
                    <vs-th width="150">Tipo de area</vs-th>
                    <vs-th width="100">Estado</vs-th>
                    <vs-th width="380">Permisos</vs-th>
                    <vs-th width="100">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombrearea}}<br>

                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombretipoarea}}<br>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.estado == 1" color="success">Activo</vs-chip>
                            <vs-chip v-else color="danger">Inactivo</vs-chip>
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.estado == 1">
                                <vx-tooltip text="Permite que el área sea visible en el modulo de asignación de libros a los docentes" position="top" color="primary">
                                    <vs-chip :color="tr.permiso_visible_asignacion_libros == 1 ? 'success' : 'warning'" style="height: 100%; font-size: 11px; cursor: default;" transparent icon-pack="feather" :icon="tr.permiso_visible_asignacion_libros == 1 ? 'icon-check' : 'icon-x'">
                                        Visible en Asignación de Libros:&nbsp; <b>{{ tr.permiso_visible_asignacion_libros == 1 ? 'Sí' : 'No' }}</b>
                                    </vs-chip>
                                </vx-tooltip>
                                <vx-tooltip text="Permite que el área sea visible en el módulo de temas" position="top" color="primary">
                                    <vs-chip :color="tr.permiso_visible_temas_capacitacion == 1 ? 'success' : 'warning'" style="height: 100%; font-size: 11px; cursor: default; margin-top: 4px;" transparent icon-pack="feather" :icon="tr.permiso_visible_temas_capacitacion == 1 ? 'icon-check' : 'icon-x'">
                                        Visible en capacitaciones Temas:&nbsp; <b>{{ tr.permiso_visible_temas_capacitacion == 1 ? 'Sí' : 'No' }}</b>
                                    </vs-chip>
                                </vx-tooltip>
                            </div>
                            <div v-else-if="tr.estado == 0">
                                <vx-tooltip text="Debe activar el área para poder asignar permisos" position="top" color="warning">
                                    <vs-chip color="danger" style="height: 100%; font-size: 11px; cursor: default;" transparent icon-pack="feather" icon="icon-alert-triangle">
                                        Área inactiva – Sin permisos disponibles
                                    </vs-chip>
                                </vx-tooltip>
                            </div>
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                    <vx-tooltip style="display: inline-block;" text="Editar area" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="success" @click="update=true;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                    </vx-tooltip> &nbsp;
                                </div>
                                <div>
                                    <vx-tooltip v-if="tr.estado == 1" style="display: inline-block;" text="Desactivar area" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="danger" @click="openConfirm(data[indextr].idarea,0)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="tr.estado == 0" style="display: inline-block;" text="Activar area" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="primary" @click="openConfirm(data[indextr].idarea,1)" type="filled" icon-pack="feather" icon="icon-check"> </vs-button>
                                    </vx-tooltip>
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else class="p-3">
            <p> No existe areas aun. </p>
        </div>
    </div>
    <!--PARA LOS MODALES -->
    <!-- Modal Agregar-->
    <div class="demo-alignment">
        <vs-popup classContent="popup-example" title="Agregar Area" :active.sync="popupAddTema">
            <vs-input class="inputx mb-3 w-full" label="Nombre Area" placeholder="Nombre Area" v-model="area.nombrearea" />
            <div class="mb-4">
                Tipo Area:
                <v-select :options="tipos" :reduce="tipos => tipos" label="nombretipoarea" placeholder="--Seleccione--" class="w-full" v-model="area.tipo" />
            </div>
            <!-- PERMISOS -->
            <div class="permiso-card">
                <h4 class="permiso-title">Permisos del Área</h4>
                <!-- Permiso: Asignación de Libros -->
                <div class="permiso-item">
                    <div>
                        <p class="permiso-label">Visible en Asignación de Libros para Docentes</p>
                        <p class="permiso-desc">Permite que el área sea visible en el modulo de asignación de libros a los docentes.</p>
                    </div>
                    <vs-switch color="success" v-model="area.permiso_visible_asignacion_libros">
                        <span slot="on">Sí</span>
                        <span slot="off">No</span>
                    </vs-switch>
                </div>
                <!-- Permiso: Visible en Temas -->
                <div class="permiso-item">
                    <div>
                        <p class="permiso-label">Visible en Módulo de capacitaciones de Temas</p>
                        <p class="permiso-desc">Permite que el área sea visible en el módulo de temas.</p>
                    </div>
                    <div class="permiso-radio-group">
                        <vs-radio v-model="area.permiso_visible_temas_capacitacion" vs-value="1" color="success">Sí</vs-radio>
                        <vs-radio v-model="area.permiso_visible_temas_capacitacion" vs-value="0" color="danger">No</vs-radio>
                    </div>
                </div>
            </div>
            <vs-button color="success" class="w-full mb-3" @click="guardarArea()" type="gradient">Guardar</vs-button>
        </vs-popup>
    </div>
    <!-- Modal Editar-->
    <div class="demo-alignment">
        <vs-popup classContent="popup-example" title="Editar Área" :active.sync="popupEditArea">
            <vs-input class="inputx mb-3 w-full" label="Nombre Área" placeholder="Nombre Area" v-model="area.nombrearea" />
            <div class="mb-4">
                <label class="block mb-1 font-semibold">Tipo Área:</label>
                <v-select :options="tipos" :reduce="tipos => tipos" label="nombretipoarea" placeholder="--Seleccione--" class="w-full" v-model="area.tipo" />
            </div>
            <!-- {{ area  }} -->
            <!-- PERMISOS -->
            <div class="permiso-card" v-if="area.estado == 1">
                <h4 class="permiso-title">Permisos del Área</h4>
                <!-- Permiso: Asignación de Libros -->
                <div class="permiso-item">
                    <div>
                        <p class="permiso-label">Visible en Asignación de Libros para Docentes</p>
                        <p class="permiso-desc">Permite que el área sea visible en el modulo de asignación de libros a los docentes.</p>
                    </div>
                    <vs-switch color="success" v-model="area.permiso_visible_asignacion_libros">
                        <span slot="on">Sí</span>
                        <span slot="off">No</span>
                    </vs-switch>
                </div>
                <!-- Permiso: Visible en Temas -->
                <div class="permiso-item">
                    <div>
                        <p class="permiso-label">Visible en Módulo de capacitaciones de Temas</p>
                        <p class="permiso-desc">Permite que el área sea visible en el módulo de capacitaciones de temas.</p>
                    </div>
                    <div class="permiso-radio-group">
                        <vs-radio v-model="area.permiso_visible_temas_capacitacion" vs-value="1" color="success">Sí</vs-radio>
                        <vs-radio v-model="area.permiso_visible_temas_capacitacion" vs-value="0" color="danger">No</vs-radio>
                    </div>
                </div>
            </div>
            <!-- Si el área está inactiva -->
            <div v-else-if="area.estado == 0" class="permiso-card desactivado">
                <p class="permiso-desc" style="color: #ff5252; font-weight: 500;">
                    ⚠️ Para configurar los permisos, primero debe activar esta área.
                </p>
            </div>
            <vs-button color="success" class="w-full mb-3" @click="guardarArea()" type="gradient">
                Actualizar
            </vs-button>
        </vs-popup>

    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import LibroRepository from '../../repositories/LibroRepository';
export default {
    data() {
        return {
            areas: [],
            tipos: [],
            activeConfirm: false,
            popupEditArea: false,
            update: false,
            id: 0,
            idarea: 0,
            popupAddTema: false,
            area: {
                nombrearea: '',
                tipo: '',
                estado: 0,
                permiso_visible_asignacion_libros: false,
                permiso_visible_temas_capacitacion: '1',
            },
            estado: '',
            permisoRoot: false,
            usuario: [],
        }
    },
    components: {
        'v-select': vSelect,

    },
    methods: {
        obtenerAreas() {
            let me = this;
            me.$vs.loading()
            try {
                //para obtener el listado de las areas
                LibroRepository.getAreas().then(r => {
                    this.areas = r.data.area
                    me.$vs.loading.close()
                });
                //para obtener el listado de los tipos
                LibroRepository.getAreas().then(r => {
                    this.tipos = r.data.tipoArea
                    me.$vs.loading.close()
                });
            } catch (error) {
                console.log(error)
            } finally {
                me.$vs.loading.close()
            }
        },
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                .then(function (res) {
                    if (res.data.status == '1') {
                        me.permisoRoot = true
                    } else {
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        //para eliminar la area
        eliminarArea(idarea) {
            let me = this;
            let formData = new FormData();
            formData.append('idarea', me.idarea);
            formData.append('estado', me.estado);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'area-eliminar', formData)
                .then(res => {
                    me.obtenerAreas();
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Area eliminado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        //para abrir el popup de confimacion para eliminar
        openConfirm(idarea, estado) {
            this.idarea = idarea;
            this.estado = estado
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Estas seguro de cambiar de estado.',
                accept: this.eliminarArea
            })
        },
        //para guardar las areas
        guardarArea() {
            let me = this;
            let permisolibroasignacion = '';
            //datos que se obtienen de los inputs
            if (me.area.nombrearea.trim() === '') {
                this.$vs.notify({
                    text: 'Debe completar todos los campos antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            if (me.area.permiso_visible_asignacion_libros == true) {
                permisolibroasignacion = 1;
            } else if (me.area.permiso_visible_asignacion_libros == false) {
                permisolibroasignacion = 0;
            }
            me.$vs.loading()
            let formData = new FormData();
            if (me.update) {
                formData.append('idarea', me.id);
                formData.append('nombrearea', me.area.nombrearea);
                formData.append('idtipoarea', me.area.tipo.idtipoarea);
                formData.append('permiso_visible_asignacion_libros', permisolibroasignacion);
                formData.append('permiso_visible_temas_capacitacion', me.area.permiso_visible_temas_capacitacion);
            } else {
                formData.append('nombrearea', me.area.nombrearea);
                formData.append('idtipoarea', me.area.tipo.idtipoarea);
                formData.append('permiso_visible_asignacion_libros', permisolibroasignacion);
                formData.append('permiso_visible_temas_capacitacion', me.area.permiso_visible_temas_capacitacion);
            }
            this.$http.post(this.$server_url + 'areas', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.obtenerAreas()
                    me.popupAddTema = false
                    me.popupEditArea = false
                    me.update = false;
                    me.limpiar()

                })
                .catch(function (error) {})
        },
        //para editar los campos
        openModalEditar(data = {}) {
            let me = this;
            me.popupEditArea = true;
            //llenar la data en los campos
            me.id = data.idarea;
            me.area.nombrearea = data.nombrearea;
            me.area.tipo = {
                idtipoarea: data.tipoareas_idtipoarea,
                nombretipoarea: data.nombretipoarea,
            };
            me.area.permiso_visible_asignacion_libros = data.permiso_visible_asignacion_libros == 1 || data.permiso_visible_asignacion_libros === '1';
            me.area.permiso_visible_temas_capacitacion = data.permiso_visible_temas_capacitacion == 1 || data.permiso_visible_temas_capacitacion === '1' ? '1' : '0';
            me.area.estado = data.estado
        },
        //para limpiar los campos
        limpiar() {
            let me = this;
            me.area.nombrearea = "";
            me.area.tipo = "";
            me.area.permiso_visible_asignacion_libros = false;
            me.area.permiso_visible_temas_capacitacion = '1';
        },
    },
    mounted() {
        this.obtenerAreas()
    },
    created() {
        console.log("diseno2")
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getUserRoot()
    }
}
</script>

<style scoped>
.permiso-card {
    border: 1px solid #d1d5db;
    /* gris claro */
    border-radius: 12px;
    padding: 16px;
    background-color: #f9fafb;
    /* fondo suave */
    margin-bottom: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.permiso-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: #111827;
    text-align: center;
}

.permiso-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.permiso-label {
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.permiso-desc {
    font-size: 0.85rem;
    color: #4f545f;
    margin: 4px 0 0;
    font-weight: 500;
}

.permiso-radio-group {
    display: flex;
    gap: 16px;
    align-items: center;
}
</style>
