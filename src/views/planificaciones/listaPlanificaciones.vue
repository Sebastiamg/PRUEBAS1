<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup :title="titulo_modal" :active.sync="modalAgregar">
        <div class="vx-row m-2">
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas" />
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px;">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="planifica.nombreplanificacion" maxlength="300" placeholder="nombre" />
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px;">Descripcion </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="planifica.descripcionplanificacion" maxlength="350" placeholder="descripcion" />
            </div>
            <div class="vx-col w-full mb-base" align="left">
                <!-- <input type="file" class="inputx w-full mb-6" v-model="planifica.webplanificacion"/> -->
                <div v-if="file1 != '' "> Archivo actual: <br>
                    <p class="text-primary"> {{file1.name}} </p>
                    <vs-button @click="quitarArchivo(file1)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                    {{file1}}
                </div>

                <label v-else>
                    <div class="">Cargar archivo </div> <br>
                    <input class="w-full" ref="file1" id="file1" type="file" @change="cargaArchivo()" />
                    <!-- <vs-input type="text" class="inputx w-full mb-6" v-model="planifica.descripcionplanificacion" maxlength="350" placeholder="descripcion" /> -->
                    <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                    <p class="text-danger"> {{msj1}} </p>
                    <div class="v-row text-left" v-if="porcentaje1 > 0">
                        <vs-progress style="height:25px" :percent="porcentaje1" color="success"> {{porcentaje1}}% </vs-progress>
                    </div>
                </label>
            </div>
            <div class="vx-col w-full mb-base" align="left">
                <div style="font-size: 12px;">Estado </div>
                <vs-radio v-model="planifica.Estado_idEstado" class="m-2" vs-value="1">Activo</vs-radio>
                <vs-radio v-model="planifica.Estado_idEstado" class="m-2" color="danger" vs-value="0">Inactivo</vs-radio>
            </div>
            <div class="vx-col w-full">
                <vs-button style="display:inline" class="m-2 mb-2" type="filled" @click="guardarEdicion()"> {{txt_boton}} </vs-button>
            </div>
        </div>
    </vs-popup>
    <vx-card>
        <vs-table max-items="20" search pagination :data="lista">
            <template slot="header">
                <div class="vx-row">
                    <div class="vx-col sm:w-full">
                        <vs-button class="mb-4" color="primary" icon-pack="feather" icon="icon-plus" @click="abrirModalPlanifica();">Agregar planificación</vs-button>
                    </div>
                    <div class="vx-col sm:w-full">
                        Cantidad: {{lista.length}}
                    </div>
                </div>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th sort-key="nombreasignatura" width="40%">Asignatura</vs-th>
                <vs-th sort-key="nombreplanificacion">Planificacion</vs-th>
                <vs-th sort-key="nombre" width="10%">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{indextr+1}}
                    </vs-td>
                    <vs-td :data="tr.nombreasignatura">
                        {{tr.nombreasignatura}}
                    </vs-td>
                    <vs-td :data="tr.nombreplanificacion">
                        {{tr.nombreplanificacion}}<br>
                        <small>{{tr.descripcionplanificacion}}</small> <br>
                        <i class="text-primary cursor-pointer" @click="verPlanificacion(tr)"><u>{{tr.webplanificacion}}</u></i>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                            <vs-button type="border" size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-edit" @click="editaContenido(tr)"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="danger">
                            <vs-button type="border" size="small" style="display: inline-block;" class="p-2" icon-pack="feather" icon="icon-trash" color="danger" @click="confirmaeliminar(tr)"></vs-button>
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
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            lista: '',
            modalAgregar: false,
            titulo_modal: '',
            planifica: {
                'idplanificacion': '',
                'Estado_idEstado': '',
                'asignatura_idasignatura': '',
                'descripcionplanificacion': '',
                'nombreasignatura': '',
                'nombreplanificacion': '',
                'webplanificacion': '',
            },
            asignaturas: [],
            asignaturaSelect: {
                'idasignatura': '',
                'nombreasignatura': '',
            },
            limiteMegas: 5,
            bytes: 1048576,
            msjError: 'El peso del archivo excede el limite permitido, verifique antes de continuar',

            porcentaje1: '',
            pesoArchivo1: '',
            muyPesado1: '',
            msj1: '',
            file1: '',
            txt_boton: '',
        }
    },
    mounted() {
        let me = this;
        me.getPlanificacion();
        me.getAsignaturas();

    },
    methods: {
        cargaArchivo() {
            let me = this;
            me.msj1 = '';
            me.porcentaje1 = 0;
            me.pesoArchivo1 = 0;
            me.muyPesado1 = false;
            me.file1 = me.$refs.file1.files[0];
            // verificar tamaño de archivo
            me.pesoArchivo1 = (me.file1.size / me.bytes).toFixed(2);
            if (me.pesoArchivo1 > me.limiteMegas) {
                me.muyPesado1 = true;
                me.msj1 = me.msjError;
            }
        },
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url + 'asignaturasProlipa')
                .then(res => {
                    me.asignaturas = res.data
                    // console.log(res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getPlanificacion() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'planificacion_asignaturas')
                .then(res => {
                    // console.log(res.data)
                    me.lista = res.data;
                    me.$vs.loading.close();
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                })
        },
        verPlanificacion(web) {
            console.log(web)
            return
            window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/upload/planificacion/' + web, '_blank');
        },
        abrirModalPlanifica() {
            let me = this;
            me.titulo_modal = 'Agregar planificación:';
            me.txt_boton = 'Guardar';
            me.planifica = {
                'idplanificacion': '',
                'Estado_idEstado': '',
                'asignatura_idasignatura': '',
                'descripcionplanificacion': '',
                'nombreasignatura': '',
                'nombreplanificacion': '',
                'webplanificacion': '',
            };
            me.file1 = '';
            me.modalAgregar = true;
        },
        guardarEdicion() {
            let me = this;
            me.$vs.loading();
            if (me.muyPesado) {
                me.$vs.notify({
                    text: 'El archivo es muy pesado, favor verifique',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            console.log(me.file1)
            let formData = new FormData();
            formData.append('webplanificacion', me.file1);
            formData.append('Estado_idEstado', me.planifica.Estado_idEstado);
            formData.append('asignatura_idasignatura', me.asignaturaSelect.idasignatura);
            formData.append('descripcionplanificacion', me.planifica.descripcionplanificacion);
            formData.append('nombreplanificacion', me.planifica.nombreplanificacion);
            this.$http.post(this.$server_url + 'guarda_planificacion', formData)
                .then(res => {
                    console.log(res.data)
                    me.modalAgregar = false;
                    me.getPlanificacion();
                    me.$vs.loading.close();
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                })
        },
        editaContenido(item) {
            let me = this;
            me.file1 = item.webplanificacion;
            me.asignaturaSelect.asignatura_idasignatura = item.idasignatura
            me.asignaturaSelect.nombreasignatura = item.nombreasignatura
            me.titulo_modal = 'Editar planificación:';
            me.txt_boton = 'Editar';
            me.planifica = item;
            me.modalAgregar = true;
        },
        confirmaeliminar(item) {
            let me = this;
            me.id_eliminar = item.idplanificacion
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar esta planificacion?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminaPlanificacion
            })
        },
        eliminaPlanificacion() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'deletePlanificacion/'+me.id_eliminar)
                .then(res => {
                    console.log(res.data)
                    me.$vs.loading.close();
                    me.getPlanificacion();
                    me.$vs.loading.close();
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                    me.$vs.loading.close();
                })
        }
    }
}
</script>
