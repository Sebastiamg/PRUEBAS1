<template>
<div>
    <div v-if="verlibros == true" class="mt-3">
        <vs-button color="success" size="small" @click="verlibros = false;" icon="reply" type="relief">Regresar</vs-button>
        <listaLibrosEstudianteVue class="mt-2" :librosEstudiantes="librosEstudiantes"/>
    </div>
    <div v-if="verlibros == false">
        <div class="mt-5">Institución: </div>
        <h4> {{institucion.nombreInstitucion}} </h4>
        <div>
            <vs-table max-items="20" search pagination :data="usuarios">
                <template slot="header">
                    <vs-chip>Cantidad: {{ usuarios.length }}</vs-chip>
                    <vs-button class="mb-4 ml-2" color="dark" icon-pack="feather" icon="icon-user-plus" @click="addUsuario">Agregar</vs-button>
                    <vs-button v-if="tipoUser == 'estudiante'" @click="exportToExcel()" class="mb-4 ml-2" type="gradient"> Exportar Códigos estudiantes</vs-button>
                </template>
                <template slot="thead">
                    <vs-th sort-key="cedula">Cédula</vs-th>
                    <vs-th sort-key="nombres">Nombre</vs-th>
                    <vs-th sort-key="email">Usuario</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{tr.cedula}}
                        </vs-td>
                        <vs-td>
                            {{tr.nombres}}
                            {{tr.apellidos }}
                        </vs-td>
                        <vs-td>
                            <b><small>usuario:</small></b> {{tr.name_usuario}}<br>
                            <small>email: </small> {{tr.email}}
                        </vs-td>
                        <vs-td>
                            <vx-tooltip v-if="tr.id_group == 6" style="display: inline-block;" text="Detalles docente" position="top" color="success">
                                <vs-button size="small" icon-pack="feather" icon="icon-eye" class="mr-2 mb-1" color="success" type="gradient" @click="contenidosDocentes(tr)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip v-if="tr.id_group == 4" style="display: inline-block;" text="Libros del estudiante" position="top" color="primary">
                                <vs-button size="small" icon-pack="feather" icon="icon-book" class="mr-2 mb-1" color="primary" type="gradient" @click="librosEstudiante(tr)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="warning">
                                <vs-button size="small" icon-pack="feather" icon="icon-edit" class="mr-2" type="gradient" color="warning" @click="getEditar(tr)"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <!-- <div v-else class="m-4 p-5">
            No hay usuarios registrados en esta institución.
        </div> -->
    </div>
       
</div>
</template>
<script>
import listaLibrosEstudianteVue from './listaLibrosEstudiante.vue';
export default {
    props: {
        usuarios: Array,
        institucion: Object,
        arregloCodigosEstudiantes:{
            type:Array,
            default:[]
        },
        tipoUser:{
            type:String,
            default:''
        },
    },
    components:{
        listaLibrosEstudianteVue,
    },
    data() {
        return {
            verlibros:false,
            librosEstudiantes:[],
            //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            permisoRoot:false,
            //fin variables para el export a excel
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('student_select');
    },
    methods: {
        getEditar(usuario) {
            this.$emit('estado', {
                plista: false,
                pnuevo: false,
                peditar: true,
                pcontenido: false,
                usuario: usuario
            });
        },
        contenidosDocentes(usuario) {
            localStorage.setItem("datoUser", JSON.stringify(usuario));
            this.$emit('estado', {
                plista: false,
                pnuevo: false,
                peditar: false,
                pcontenido: true,
                usuario: usuario
            });
        },
        addUsuario() {
            this.$emit('estado', {
                plista: false,
                pnuevo: true,
                peditar: false,
                pcontenido: false,
            });
        },
        librosEstudiante(item){
            let me = this;
            console.log(item)
            me.verlibros = true;
            me.librosEstudiantes = item
            localStorage.setItem('student_select',JSON.stringify(item))
            // me.$router.push('/director/institucion/listaLibrosEstudiante');
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
            let headerTitle = ['Código','Estudiante','Libro'];
            let headerVal = ['codigo', 'estudiante','nombrelibro'];  
            let codigoSelectedMayus = this.arregloCodigosEstudiantes
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
                var nombrefile = ""
                if(this.openModal == 1){
                    nombrefile = this.fileName
                }else{
                    nombrefile = "Reporte de codigo"
                }
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: nombrefile,
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
    },
}
</script>
