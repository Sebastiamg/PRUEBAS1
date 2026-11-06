<template>
<vx-card>
    <div>
        <p class="text-primary text-2xl font-medium">Lista de usuarios total</p>
        <vs-divider></vs-divider>
        <div class="m-2 mb-4">
            <small>Seleccione un perfil: </small>
            <v-select :options="listaPerfiles" label="level" class="w-full" v-model="perfilSelect" @input="f_get_Usuarios(perfilSelect)" />
        </div>
        <vs-table multiple stripe v-model="codigoSelected" pagination max-items="25" search :data="arregloFacturadores">
            <template slot="header">
                <div style="display:flex;">
                    <vs-chip color="success" style="font-size:12px;">
                        Total: {{arregloFacturadores.length}}
                    </vs-chip>
                    <vs-button color="warning" type="line" icon="description" size="small" class="mr-5 ml-3" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="asesor">#</vs-th>
                <vs-th sort-key="asesor">Usuario</vs-th>
                <vs-th sort-key="grupo">Grupo</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].id">
                        {{data[indextr].idusuario}}
                    </vs-td>
                    <vs-td :data="data[indextr].Nombres">
                        <!-- <span class="font-bold">Nombres:</span> -->
                        <p>{{data[indextr].usuario}}</p>
                        <span class="font-bold">Usuario:</span>
                        <p>{{data[indextr].name_usuario}}</p>
                        <span class="font-bold">Clave:</span>
                        <p>{{data[indextr].cedula}}</p>
                    </vs-td>
                    <vs-td :data="data[indextr].grupo">
                        <vs-chip color="warning" v-if="data[indextr].capacitador == 1">
                            Capacitador
                        </vs-chip> <br /><br />
                        <vs-chip color="success">
                            {{data[indextr].grupo}}
                        </vs-chip> <br /><br />
                        <span :class="data[indextr].estado_idEstado == 1 ? 'text-dark' : 'text-danger' ">
                            {{data[indextr].nombreestado}}
                        </span>
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                                <vs-button type="line" size="small" icon-pack="feather" icon="icon-edit" color="warning" @click="getEdit(tr)"></vs-button>
                            </vx-tooltip>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <!--MODAL PARA EXPORTAR A EXCEL-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancel="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
        </div>
    </vs-prompt>
    <!--Modal de Editar-->
    <vs-popup class="editpop" title="Editar" :active.sync="popupActivo" fullscreen>
        <editarUsuarioVue v-if="popupActivo" @saveChange="changeHandleEditar" :usuarios="usuarios" :instituciones="instituciones" />
    </vs-popup>
</vx-card>
</template>

<script>
import vSelect from 'vue-select';
import editarUsuarioVue from './components/editarUsuario.vue';
export default {
    data() {
        return {
            usuarios: {},
            arregloFacturadores: [],
            //para el reporte excel
            fileName: null,
            activePrompt: false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables para exportar
            cedula: 0,
            lookInstituciones: false,
            instituciones: [],
            popupActivo: false,
            listaPerfiles: [],
            perfilSelect: '',
            listaTodosUsuarios: [],
        }
    },
    components: {
        editarUsuarioVue,
        'v-select': vSelect,
    },
    props: {
        periodo_idSierra: {
            type: Number,
            default: 0,
        },
        periodo_idCosta: {
            type: Number,
            default: 0,
        },
    },
    created() {
        let me = this;
        me.$http.get(me.$server_url + 'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
    },
    mounted() {
        let me = this;
        me.f_getPerfiles();
    },
    methods: {
        changeHandleEditar() {
            let me = this;
            me.f_get_Usuarios()
            // me.popupActivo = false
        },
        //editar
        getEdit(data = {}) {
            let me = this;
            console.log(data)
            me.usuarios = data
            setTimeout(() => {
                this.popupActivo = true;
            }, 200);
        },
        verInstituciones(tr) {
            let me = this;
            me.cedula = tr.cedula;
            me.lookInstituciones = true;
        },
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['Nombres','Apellidos','Usuario', 'Cedula', 'Email','Grupo', 'Estado'];
            let headerVal = ['nombres','apellidos','name_usuario','cedula','email', 'grupo', 'nombreestado'];
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
        f_getPerfiles() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerPerfiles')
                .then(function (res) {
                    console.log(res.data)
                    me.listaPerfiles = res.data
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                })
        },
        f_get_Usuarios() {
            let me = this;
            if(me.perfilSelect == null || me.perfilSelect == "" || me.perfilSelect == undefined ){
                me.$vs.notify({
                text:'Seleccione un perfil por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.loading();
            me.popupActivo = false;
            this.$http.get(this.$server_url + 'getUsuariosPorRol/' + me.perfilSelect.id)
                .then(function (res) {
                    console.log(res.data)
                    me.arregloFacturadores = res.data
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                })
        }
    }
}
</script>
