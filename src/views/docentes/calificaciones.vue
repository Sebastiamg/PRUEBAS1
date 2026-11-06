<template>
<div>
    <h4>Estudiantes</h4>
    <vs-table max-items="10" v-model="codigoSelected" search pagination :data="respuestas">
        <template slot="header">
            <vs-button color="success" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
        </template>
        <template slot="thead">
            <vs-th sort-key="nombres">Estudiante</vs-th>
            <!-- <vs-th sort-key="nombres">Cédula</vs-th>
            <vs-th sort-key="nombres">Estudiantes</vs-th> -->
            <template v-if="estudiantes.length != 0">
                <vs-th v-for="(item, $index) in respuestas[0].tareas" :key="$index">T{{$index}}</vs-th>
            </template>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="tr" class="w-1/3">
                    <div class="twitter-feed-header flex items-center">
                        <div class="con-vs-avatar m-0 35px" style="width: 35px; height: 35px; background: rgb(195, 195, 195);">
                            <div class="con-img vs-avatar--con-img"><img :src="$data_url+'archivos/perfil/'+tr.Avatar" alt=""></div>
                        </div>
                        <div class="leading-tight ml-3">
                            <p class="feed-author font-semibold">{{tr.Estudiante}}</p>
                            <span class="flex items-center">
                                <small>{{tr.Email}}</small>
                                <span class="ml-1 feather-icon select-none relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check h-3 w-3 bg-primary rounded-full text-white">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                            </span>
                            <span class="flex items-center">
                                <small>{{tr.Cedula}}</small>
                            </span>
                            <span class="flex items-center">
                                <vs-button type="relief" size="small" color="danger" @click="eliminar(tr.idusuario)">Eliminar</vs-button>
                            </span>
                        </div>
                    </div>
                </vs-td>
                <template v-for="(item, $indexs) in tr.tareas">
                    <vs-td :key="$indexs">
                        <span v-if="item">{{item}}</span>
                        <span v-else>0</span>
                    </vs-td>
                </template>
            </vs-tr>
        </template>
    </vs-table>
    <!----modal exportar--------->
    <vs-prompt title="Exportar Calificaciones" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-input v-model="fileName" placeholder="Nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
            <!--<span class="mr-4">Cell Auto Width:</span>
            <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
        </div>
    </vs-prompt>
    <!----fin modal exportar--------->
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        flatPickr
    },
    data: () => ({
        fileName: null,
        formats: ['xls', 'txt'],
        cellAutoWidth: true,
        selectedFormat: 'xls',
        respuestas: [],
        activePrompt: false,
        val: '',
        alumnos: [],
        codigoSelected: [],
        idusuario: '',
        estudiantes: [],
        grupo_usuario: '',
            idusuario: '',
            datoU: '',
    }),
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }
        this.getEstudiantes()
    },
    created() {},
    methods: {
        getEstudiantes() {
            let me = this;
            const calf = []
            var url = this.$server_url+"calificacion?codigo=" + localStorage.codigo;
            this.$http.get(url).then(function (response) {
                    me.respuestas = []
                    var respuesta = response.data;
                    me.estudiantes = response.data;
                    console.log(me.estudiantes);
                    if (response.data.length != 0) {
                        me.alumnos = response.data.items;
                        me.alumnos.forEach(element => {
                            var cal = new Object();
                            cal.idusuario = element.idusuario
                            cal.Avatar = element.foto_user
                            cal.Email = element.email
                            cal.Cedula = element.cedula
                            cal.Estudiante = element.nombres + " " + element.apellidos
                            cal.tareas = new Object();
                            for (let index = 0; index < element.total.length; index++) {
                                try {
                                    cal.tareas[index] = element.tareas[index].nota
                                    eval("cal.Tarea" + index + "=" + element.tareas[index].nota);
                                } catch (error) {
                                    cal.tareas[index] = 0
                                    eval("cal.Tarea" + index + "=" + 0);
                                }
                                // if(element.Tarea[index].nota){
                                // }else{
                                // }
                            }
                            me.respuestas.push(cal)
                        });
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        exportToExcel() {
            let headerTitle = ['Cedula', 'Estudiante'];
            let headerVal = ['Cedula', 'Estudiante'];

            for (let index = 0; index < this.alumnos[0].total.length; index++) {
                headerTitle.push("Tarea" + index)
                headerVal.push("Tarea" + index)
            }

            import('@/vendor/Export2Excel').then(excel => {
                const list = this.respuestas
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        eliminar(id) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            this.idusuario = id;
            console.log(this.idusuario);
            this.$vs.dialog({
                color: 'danger',
                title: `Eliminar estudiante`,
                text: 'Seguro desea eliminar?',
                acceptText:'Aceptar',
                accept: this.acceptAlert,
            })
        },
        acceptAlert() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.idusuario);
            formData.append('codigo', localStorage.codigo);
            this.$http.post(this.$server_url+"eliminarAlumno", formData)
                .then(function (response) {
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Estudiante eliminado'
                    })
                    me.getEstudiantes();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        color: 'danger',
                        title: 'Error',
                        text: error
                    })
                })
        },
    },
}
</script>
