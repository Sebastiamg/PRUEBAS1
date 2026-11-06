<template>
    <div>
        <vs-table multiple v-model="codigoSelected" stripe pagination max-items="25" search :data="estudiantes">
            <template slot="header">
                <div style="display:flex;">
                    <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;"
                        @click="activePrompt = true;">
                        Exportar
                    </vs-button>
                    <vs-chip color="success" style="font-size:12px;">
                        Total estudiantes: {{ estudiantes.length }}
                    </vs-chip>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="student">Estudiante</vs-th>
                <vs-th sort-key="nombres">Institución</vs-th>
                <vs-th sort-key="contrato">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].student">
                        <p style="font-weight:bold;">Estudiante:</p>
                        {{ data[indextr].student }}
                        <p style="font-weight:bold;">Usuario:</p>
                        <span>{{ data[indextr].name_usuario }}</span><br />
                        <p style="font-weight:bold;">Cédula:</p>
                        <span>{{ data[indextr].cedula }}</span><br />
                    </vs-td>
                    <vs-td :data="data[indextr].nombreInstitucion">
                        <p style="font-weight:bold;">Institución:</p>
                        <p style="font-size:12px;letter-spacing:1px;">{{ data[indextr].nombreInstitucion }}</p>
                        <p style="font-weight:bold;">Ciudad:</p>
                        <span>
                            {{ data[indextr].ciudad }}<br />
                        </span>
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <vs-button color="warning" icon="info" @click="openConfirm(tr);" type="border">No es mi
                                estudiante</vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--MODAL PARA EXPORTAR A EXCEL-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
            accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        </vs-prompt>
    </div>
</template>

<script>
export default {
    data() {
        return {
            idusuario: 0,
            estudiantes: [],
            //variables para el export a excel
            activePrompt: false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables para el export a excel

        }
    },
    props: {
        setCurso: {
            type: String,
            default: ""
        },

    },
    mounted() {
        let me = this;
        me.getCursos()
    },
    methods: {
        //para obtener el listado de los estudiantes
        getCursos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'cursosEstudiante?curso=' + me.setCurso)
                .then(function (res) {
                    me.estudiantes = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        openConfirm(tr) {
            let me = this;
            me.idusuario = tr.idusuario
            // console.log(me.setCurso)
            localStorage.codigo = me.setCurso
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro/a de quitar el estudiante del curso',
                accept: this.quitarEstudiante
            })
        },
        //para bloquear el estudiante
        //eliminar a un estudiante de un curso
        quitarEstudiante() {
            let me = this;
            me.$vs.loading();
            let formData = new FormData();
            formData.append('idusuario', me.idusuario);
            formData.append('codigo', localStorage.codigo);
            this.$http.post(this.$server_url + "quitarEstudianteDeCurso", formData)
                .then(function (response) {
                    console.log(response.data)
                    me.$vs.notify({
                        color: 'success',
                        title: 'Correcto',
                        text: 'Estudiante eliminado del curso actual',
                        time: 5000
                    })
                    me.$vs.loading.close()
                    me.getCursos();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        color: 'danger',
                        title: 'Error',
                        text: error
                    });
                    me.$vs.loading.close()
                })

            // this.$http.get(this.$server_url+'cursosEstudiante?bloquear=yes&idusuario='+me.idusuario)
            //     .then(function (res) {
            //         me.$vs.loading.close()
            //         me.getCursos();
            //     })
            //     .catch(function (error) {
            //         console.log(error + ' error');
            //         me.$vs.loading.close()

            //     })
        },
        //METODOS PARA EXCEL
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['Estudiante', 'Cedula', 'institucion', 'ciudad'];
            let headerVal = ['student', 'cedula', 'nombreInstitucion', 'ciudad'];
            let codigoSelectedMayus = this.codigoSelected
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
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
    }
}
</script>
