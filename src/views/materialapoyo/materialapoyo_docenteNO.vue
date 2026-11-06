<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup size="large" title="Asignar material y temas_" :active.sync="modalTemas">
        <div class="vx-row m-5">
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px; ">Material de apoyo: </div>
                <v-select class="mb-4 w-full" v-model="materialSelect" :options="materiales" label="nombrematerial" :reduce="materiales => materiales" />
                <!-- {{materialSelect.idmaterial}} -->
            </div>
            <div class="vx-col md:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas.idasignatura" @input="cargaUnidades()" />
            </div>
            <div class="vx-col md:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Unidad: </div>
                <v-select class="mb-4 w-full" v-model="unidadesSelect" :options="unidades" label="nombre_unidad" :reduce="unidades => unidades.id" @input="getTemas();" />
            </div>
            <div class="vx-col w-full mb-base" align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <!-- {{temaSelect}} -->
                <v-select multiple class="mb-4 w-full" :closeOnSelect="false" v-model="temaSelect" :options="temas" label="nombre_tema" :reduce="temas => temas.id" />
            </div>

            <!-- <div class="vx-col md:w-1/3 w-full">
                <vs-switch vs-icon-on="check" color="success" v-model="estado_material" class="mt-2 w-full">
                    <span slot="on">Activo</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div> -->

            <div class="vx-col md:w-2/3 w-full" align="right">

                <vs-button v-if="op_editar==0" style="display:inline-block" @click="asignarMaterialAsignatura();" color="success" type="relief">Asignar TEMAS </vs-button> &nbsp;

                <vs-button v-if="op_editar==1" style="display:inline-block" @click="editarTemasMaterialAsignatura();" color="warning" type="relief">Editar TEMAS</vs-button>
            </div>
        </div>
    </vs-popup>



    <vx-card>
        <vs-button style="display:inline-block" @click="$router.go(-1);" color="dark" type="border"><b>← Volver</b></vs-button>

        <vs-tabs alignment="fixed" color="success mt-4">
            <vs-tab label="Material - asignaturas - temas">
                <div class="vx-col  w-full" align="left">
                <vs-divider> <b>{{material.length}} materiales asignados actualmente</b> </vs-divider>
                    <!-- {{material[0].temas}} -->
                    <div v-if="material.length > 0">
                        <vs-table stripe pagination max-items="30" search :data="material">
                            <template slot="header">
                                <vs-button @click="vaciarModal()" size="small" color="dark" type="filled" style="font-size: 13px;">Asignar material y temas </vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th style="max-width: 20px;">#</vs-th>
                                <vs-th>Material</vs-th>
                                <vs-th>Temas</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{indextr+1}}
                                    </vs-td>
                                    <vs-td width="30%">
                                       <b>Material:</b> {{ data[indextr].nombrematerial }}<br>
                                       <b>Libro:</b> {{ data[indextr].nombreasignatura }}
                                    </vs-td>
                                    <vs-td>
                                        <div v-if="data[indextr].temas[0].unidad">
                                            <b>Unidad {{data[indextr].temas[0].unidad}}</b>
                                            <div v-for="(item,$index) in data[indextr].temas" :key="$index">
                                                {{ item.nombre_tema }}
                                            </div>
                                        </div>
                                    </vs-td>
                                    <vs-td width="20%">
                                        <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                            <vs-button style="display: inline-block;" class="m-2 mb-2" icon-pack="feather" icon="icon-edit" type="border" size="small" @click="data_material=data[indextr]; op_editar = 1; dataFormularioEditar(data[indextr])"></vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                            <vs-button style="display: inline-block;" size="small" class="m-2 mb-2" icon-pack="feather" color="danger" icon="icon-trash" type="border" @click="data_material=data[indextr]; openConfirmEliminarMaterial(); op_eliminar=2"></vs-button>
                                        </vx-tooltip>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <vs-button @click="vaciarModal()" size="small" color="dark" type="filled" style="font-size: 13px;">Asignar material y temas </vs-button>
                    </div>
                </div>
            </vs-tab>
            <vs-tab label="Registrar material de apoyo">
                <vs-popup fullscreen title="Asignar material y temas" :active.sync="modalMaterial">
                    <div class="vx-row mt-4">
                        <div class="vx-col w-full" align="left">
                            <div style="font-size: 12px; ">Nombre: </div>
                            <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.nombrematerial" maxlength="100" placeholder="Nombre del material" />
                        </div>
                        <div class="vx-col w-full" align="left">
                            <div style="font-size: 12px; ">Descripcion: </div>
                            <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.descripcionmaterial" maxlength="200" placeholder="Descripción" />
                        </div>
                        <div class="vx-col w-full" align="left">
                            <div style="font-size: 12px; ">Nombre de la carpeta del archivo digital: </div>
                            <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.webmaterial" maxlength="200" placeholder="Archivo digital" />
                        </div>
                        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                            <div style="font-size: 12px; ">Nombre del archivo zip: </div>
                            <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.zipmaterial" maxlength="200" placeholder="Archivo zip" />
                        </div>
                        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                            <div style="font-size: 12px; ">Nombre de la portada: </div>
                            <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.imagenmaterial" maxlength="200" placeholder="portada.jpg / portada.png" />
                        </div>
                        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                            <div style="font-size: 12px; ">Estado: </div>
                            <v-select class="mb-4 w-full" v-model="materialAp.Estado_idEstado" :options="estados" label="nombreestado" :reduce="estados => estados.idEstado" />
                        </div>
                        <div class="vx-col w-full mb-base" align="left">
                            <vs-button v-if="edita==0" style="display:inline-block" @click="registrarMaterial();" color="success" type="relief">Registrar material </vs-button> &nbsp;
                            <vs-button v-if="edita==1" style="display:inline-block" @click="registrarMaterial(materialAp);" color="warning" type="relief">Editar material </vs-button> &nbsp;
                            <vs-button style="display:inline-block" @click="edita=0; vaciar();" color="danger" type="relief">Cancelar </vs-button> &nbsp;
                        </div>
                    </div>
                </vs-popup>
                <div class="vx-row m-2">
                    <vs-divider>
                        <b>{{materiales.length}} materiales registrados actualmente</b>
                    </vs-divider>
                    <div v-if="materiales.length > 0">
                        <vs-table stripe pagination max-items="20" width="100%" search :data="materiales">
                            <template slot="header">
                                <vs-button @click="modalAgregarMaterial()" size="small" color="dark" type="filled" style="font-size: 13px;">Agregar nuevo material</vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th>#</vs-th>
                                <vs-th>Nombre</vs-th>
                                <vs-th>Fechas</vs-th>
                                <vs-th>Estado</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{indextr+1}}
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].nombrematerial }}
                                    </vs-td>
                                    <vs-td>
                                        <small>Actualizado: {{ data[indextr].updated_at }}<br>
                                            Registrado: {{ data[indextr].created_at }}</small>
                                    </vs-td>
                                    <vs-td>
                                        <label v-if="data[indextr].Estado_idEstado == '1'" class="text-success">Activo</label>
                                        <label v-if="data[indextr].Estado_idEstado == '2'" class="text-danger">Inactivo</label>
                                    </vs-td>
                                    <vs-td>
                                        <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="warning">
                                            <vs-button style="display: inline-block;" size="small" class="m-2 mb-2" icon-pack="feather" color="warning" icon="icon-edit" type="border" @click="selectMaterial(data[indextr]); edita=1; modalMaterial=true;"></vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                            <vs-button style="display: inline-block;" size="small" class="m-2 mb-2" icon-pack="feather" color="danger" icon="icon-trash" type="border" @click="openConfirmEliminar(data[indextr]);op_eliminar=1; edita = 0"></vs-button>
                                        </vx-tooltip>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <vs-button @click="modalAgregarMaterial()" size="small" color="dark" type="filled" style="font-size: 13px;">Agregar nuevo material</vs-button>
                    </div>
                    
                </div>
            </vs-tab>

        </vs-tabs>

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
            modalMaterial: false,
            modalTemas: false,
            material: [],
            materialSelect: '',
            materiales: [],
            temas: [],
            temaSelect: [],
            asignaturas: [],
            asignaturaSelect: '',
            unidades: [{
                "id": 1,
                nombre_unidad: 'Unidad 1'
            }, {
                "id": 2,
                nombre_unidad: 'Unidad 2'
            }, {
                "id": 3,
                nombre_unidad: 'Unidad 3'
            }, {
                "id": 4,
                nombre_unidad: 'Unidad 4'
            }, {
                "id": 5,
                nombre_unidad: 'Unidad 5'
            }, {
                "id": 6,
                nombre_unidad: 'Unidad 6'
            }, {
                "id": 7,
                nombre_unidad: 'Unidad 7'
            }, {
                "id": 8,
                nombre_unidad: 'Unidad 8'
            }],
            unidadesSelect: {},
            n_material: '',
            materialAp: {
                'idmaterial': '',
                'nombrematerial': '',
                'descripcionmaterial': '',
                'zipmaterial': '',
                'webmaterial': '',
                'imagenmaterial': '',
                'exematerial': '',
                'Estado_idEstado': 1,
            },
            estados: [],
            op_eliminar: '',
            op_editar: 0,
            edita: 0,
            item_eliminar: '',
            data_material: [],
            id_material_editar: '',
            id_material_asignatura: '',
            estado_material: false,
        }
    },
    mounted() {
        let me = this;
        
        //asignatura que se obtiene en el docente
        // me.asignaturaSelect = {id: localStorage.idasignatura, label: localStorage.nombreasignatura}
        me.asignaturaSelect = localStorage.idasignatura
        me.getMaterialAsignaturas();
        me.getTodoMaterial();
        me.getTodoAsignaturas();
        me.getEstados();
    },
    methods: {
        getMaterialAsignaturas() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'temas_por_material')
                .then(res => {
                    me.material = res.data.items;
                    // console.log(me.material)
                    me.$vs.loading.close()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        cargaUnidades() {
            let me = this;
            me.temaSelect = [];
            // console.log("longitud unid ",me.unidadesSelect.length >0)
            if (me.unidadesSelect > 0) {
                me.getTemas();
            }
        },
        getTemas() {
            let me = this;
            if (me.unidadesSelect === "" || me.unidadesSelect === undefined || me.unidadesSelect === null) {
                me.$vs.notify({
                    text: 'Seleccione la unidad',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.asignaturaSelect === "" || me.asignaturaSelect === undefined || me.asignaturaSelect === null) {
                me.$vs.notify({
                    text: 'Seleccione la asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            
            let formData = new FormData();
            formData.append('unidad', me.unidadesSelect);
            formData.append('asignatura', me.asignaturaSelect);
            this.$http.post(this.$server_url+'temas_asignatura_material', formData)
                .then(res => {
                    me.temas = res.data;
                })
                .catch(error => {
                    console.log(error)
                })

        },
        getTodoMaterial() {
            let me = this;
            me.$vs.loading()
            me.op_eliminar = '';
            me.idmaterial
            this.$http.get(this.$server_url+'todo_material_apoyo')
                .then(res => {
                    me.materiales = res.data;
                    me.$vs.loading.close()
                    // console.log(me.material)
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        getTodoAsignaturas() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'todo_asignaturas')
                .then(res => {
                    me.asignaturas = res.data;
                    me.$vs.loading.close()
                    // console.log(me.material)
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        asignarMaterialAsignatura() {
            let me = this;

            if (me.materialSelect.idmaterial == undefined) {
                me.$vs.notify({
                    text: 'Seleccione el material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.asignaturaSelect == '') {
                me.$vs.notify({
                    text: 'Seleccione una asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            let formData = new FormData();
            formData.append('material_idmaterial', me.materialSelect.idmaterial);
            formData.append('asignatura_idasignatura', me.asignaturaSelect);
            this.$http.post(this.$server_url+'agregar_material_asignaturas', formData)
                .then(res => {
                    // console.log(res.data)
                    me.modalTemas = false
                    me.$vs.notify({
                        text: me.materialSelect.nombrematerial + ' asignado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    if (me.temaSelect.length > 0) {
                        let me = this;
                        // console.log(me.materialSelect.idmaterial, me.temaSelect)
                        let formData1 = new FormData();
                        formData1.append('id_material', me.materialSelect.idmaterial);
                        formData1.append('id_tema', me.temaSelect);
                        this.$http.post(this.$server_url+'temas_material', formData1)
                            .then(res => {
                                // console.log(res.data)
                                me.$vs.notify({
                                    text: 'Temas registrados en el material',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-triangle'
                                })
                                me.$vs.loading.close()
                                me.getMaterialAsignaturas();
                                me.modalTemas = false
                            })
                            .catch(error => {
                                console.log(error)
                                me.$vs.notify({
                                    text: 'fallooooo. ',
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-triangle'
                                })
                                me.$vs.loading.close()
                                me.vaciar();
                                me.getMaterialAsignaturas();
                                me.modalTemas = false
                            })
                    } else {
                        me.$vs.loading.close()
                        me.vaciar();
                        me.getMaterialAsignaturas();
                    }
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'El material no existe o ya esta asignado. ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.getMaterialAsignaturas();
                })

        },
        dataFormularioEditar(item){
            let me = this
            me.id_material_asignatura = item.id_material_asignatura
            me.materialSelect = {nombrematerial: item.nombrematerial, idmaterial: item.idmaterial}
            me.unidadesSelect = {id: item.temas[0].unidad, nombre_unidad: 'Unidad '+item.temas[0].unidad}
            me.asignaturaSelect = item.asignatura_idasignatura
            // me.estado_material = item.estado
            me.temaSelect = item.temas
            me.modalTemas = true
        },
        editarTemasMaterialAsignatura(){
            let me = this
            let formData = new FormData();
            formData.append('idmaterial', me.data_material.idmaterial);
            formData.append('idasignatura', me.data_material.asignatura_idasignatura);
            this.$http.post(this.$server_url+'borrar_temas_material', formData)
            .then(res => {
               let formData1 = new FormData();
                formData1.append('id_material', me.data_material.idmaterial);
                formData1.append('id_tema', me.temaSelect);
                this.$http.post(this.$server_url+'temas_material', formData1)
                    .then(res => {
                        // console.log(res.data)
                        me.$vs.notify({
                            text: 'Temas editados en el material',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        .catch(error => {
                            console.log(error)
                            me.$vs.notify({
                                text: 'falló. ',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                            me.$vs.loading.close()
                            me.vaciar();
                            me.getMaterialAsignaturas();
                            me.modalTemas = false
                        })
                })
                .catch(error => {
                    me.$vs.loading.close()
                })
            })
            .catch(error => {
                
            })
        },
        openConfirmEliminar(item) {
            let me = this;
            me.item_eliminar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar esta asignación?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarMaterial
            })
        },
        openConfirmEliminarMaterial(){
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este material?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.confirmEliminarMaterial
            })
        },
        confirmEliminarMaterial(){
            let me = this
            let formData = new FormData();
            formData.append('idmaterial', me.data_material.idmaterial);
            formData.append('idasignatura', me.data_material.asignatura_idasignatura);
            this.$http.post(this.$server_url+'borrar_temas_material', formData)
            .then(res => {
                this.$http.post(this.$server_url+'borrar_material_asig', formData)
                .then(res => {
                    me.getMaterialAsignaturas()
                    me.$vs.notify({
                        text: 'Material eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
            })
            .catch(error => {
                
            })
        },
        eliminarMaterial() {
            let me = this;
            // console.log(me.item_eliminar.temas)
            me.$vs.loading()
            if (me.op_eliminar == 2) {
                // console.log(me.item_eliminar)
                let formData = new FormData();
                formData.append('material_idmaterial', me.item_eliminar.idmaterial);
                formData.append('asignatura_idasignatura', me.item_eliminar.asignatura_idasignatura);
                formData.append('temas', me.item_eliminar.temas);
                this.$http.post(this.$server_url+'quitar_material_asignatura', formData)
                    .then(res => {
                        // console.log(res.data)
                        me.$vs.notify({
                            text: me.item_eliminar.nombrematerial + ' eliminado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close()
                        me.vaciar();
                        me.getMaterialAsignaturas();
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
            if (me.op_eliminar == 1) {
                let formData = new FormData();
                formData.append('idmaterial', me.item_eliminar.idmaterial);
                this.$http.post(this.$server_url+'eliminarMaterial', formData)
                    .then(res => {
                        // console.log(res.data)
                        me.$vs.notify({
                            text: me.item_eliminar.nombrematerial + ' eliminado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close()
                        me.getTodoMaterial();
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
        },
        getEstados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'material_estados')
                .then(res => {
                    me.estados = res.data;
                    me.$vs.loading.close()
                    // console.log(me.material)
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        registrarMaterial(item) {
            let me = this;
            // console.log(item)
            if (me.materialAp.nombrematerial == "" || me.materialAp.nombrematerial == undefined) {
                me.$vs.notify({
                    text: 'Ingrese el nombre del material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.materialAp.webmaterial == '' || me.materialAp.webmaterial == undefined) {
                me.$vs.notify({
                    text: 'Ingrese el nombre del archivo digital del material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.materialAp.imagenmaterial == '' || me.materialAp.imagenmaterial == undefined) {
                me.$vs.notify({
                    text: 'Escriba el nombre de la portada del material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            let formData = new FormData();
            if (me.materialAp.idmaterial > 0) {
                formData.append('idmaterial', me.materialAp.idmaterial);
            }
            formData.append('nombrematerial', me.materialAp.nombrematerial);
            formData.append('descripcionmaterial', me.materialAp.descripcionmaterial);
            formData.append('webmaterial', me.materialAp.webmaterial);
            formData.append('exematerial', me.materialAp.exematerial);
            formData.append('imagenmaterial', me.materialAp.imagenmaterial);
            formData.append('Estado_idEstado', me.materialAp.Estado_idEstado);
            formData.append('zipmaterial', me.materialAp.zipmaterial);
            this.$http.post(this.$server_url+'registrar_material', formData)
                .then(res => {
                    // console.log(res.data)
                    if (me.materialAp.idmaterial > 0) {
                        me.edita = 0;
                        me.$vs.notify({
                            text: me.materialAp.nombrematerial + 'editado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {

                        me.$vs.notify({
                            text: 'Material registrado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.modalMaterial = false;

                    me.$vs.loading.close()
                    me.vaciar();
                    me.getTodoMaterial();
                })
                .catch(error => {
                    me.$vs.loading.close();
                    me.getTodoMaterial();
                })
        },
        selectMaterial(item) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'showMaterial/' + item.idmaterial)
            .then(res => {
                me.materialAp = (res.data[0]);
                me.$vs.loading.close()
                // console.log(me.material)
            })
            .catch(error => {
                console.log(error)
                me.$vs.loading.close()
            })
        },
        vaciar() {
            let me = this;
            me.materialAp = {
                'idmaterial': '',
                'nombrematerial': '',
                'descripcionmaterial': '',
                'zipmaterial': '',
                'webmaterial': '',
                'imagenmaterial': '',
                'exematerial': '',
                'Estado_idEstado': 1,
            };
            me.materialSelect = '';
            me.temaSelec = 0;
            // me.asignaturaSelect = '';
            me.unidadesSelect = {};
            me.modalMaterial = false;

        },
        vaciarModal() {
            let me = this;
            me.materialSelect = '';
            // me.asignaturaSelect = '';
            me.unidadesSelect = '';
            me.temaSelect = 0;
            me.op_editar = 0;
            me.modalTemas = true;
        },
        pasarDatos(item) {
            let me = this;
            me.op_editar = 1;
            me.materialSelect = item.nombrematerial;
            me.asignaturaSelect = item.nombreasignatura;
            me.unidadesSelect = item.temas.length > 0 ? item.temas[0].id_unidad : '';
            me.temaSelect = item.temas;
            me.modalTemas = true;

            
        },
        modalAgregarMaterial() {
            let me = this;
            me.modalMaterial = true;
        }
    }
}
</script>
