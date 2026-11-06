<template>
    <div>
        <vs-alert>
            <p class="text-center">No suba mas de 1500 unidades en una sola carga</p>
        </vs-alert>
        <!--EXCEL-->
        <div>
            <importExcelVue :onSuccess="loadDataInTable" class="mt-5" />
        </div>
        <!--BOTON IMPORTAR-->
        <div class="flex justify-center mt-5" v-if="tableData.length > 0">
            <vs-button color="primary" type="filled" icon="save" @click="openConfirm(0)">Importar {{ tableData.length }} unidades</vs-button>
        </div>
        <!--PROGRESO-->
        <div v-if="porcentaje > 0" class="flex justify-center mt-5 py-3 font-bold" style="background-color: aquamarine;">
            Se importaron {{ porcentaje }} unidades
        </div>
        <!--FORMATO DEL EXCEL-->
        <div class="mt-5">
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12">
                    <vs-card>
                        <div class="header">
                            <div class="flex items-center gap-3 mb-3">
                                <p style="font-weight: bold; margin: 0;">Formato del archivo excel</p>
                                <vs-button color="success" class="p-2" type="filled" @click="exportarFormato()">
                                    <i class="fas fa-download mr-1"></i> Descargar Formato
                                </vs-button>
                                <!--BOTON PARA MOSTRAR POPUP errores-->
                                <vs-button color="danger" v-if="arrayUnidadesYaExistentes.length > 0" class="p-2" type="filled" @click="popupMostrarErrores = true">
                                    <i class="fas fa-exclamation-triangle mr-1"></i> Mostrar Errores
                                </vs-button>
                            </div>
                            <table class="tabla">
                                <tr>
                                    <th class="th1">id_libro</th>
                                    <th class="th1">nombre_unidad</th>
                                    <th class="th1">unidad</th>
                                    <th class="th1">pag_inicio</th>
                                    <th class="th1">pag_fin</th>
                                    <th class="th1">txt_nombre_unidad</th>
                                </tr>
                                <tr>
                                    <td class="td1">x</td>
                                    <td class="td1">x</td>
                                    <td class="td1">x</td>
                                    <td class="td1">x</td>
                                    <td class="td1">x</td>
                                    <td class="td1">x</td>
                                </tr>
                            </table>
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
        </div>
        <!--FIN FORMATO DEL EXCEL-->
        <!--FIN EXCEL-->
        <!--TABLA MOSTRAR UNIDADES DEL EXCEL-->
        <vx-card v-if="tableData.length && header.length">
            <vs-table stripe pagination :max-items="10" search :data="tableData">
                <template slot="header">
                    <h4>Unidades a subir {{tableData.length}}</h4>
                </template>

                <template slot="thead">
                    <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
                            {{ col }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
        <!--FIN TABLA MOSTRAR UNIDADES DEL EXCEL-->

        <!--MODALES-->
        <!--MODAL PARA CONFIRMAR-->
        <vs-popup small title="Confirmación" :active.sync="modalConfirm">
            <div v-if="modalConfirm">
                <p class="text-center">Esta seguro de importar {{ tableData.length }} unidades?</p>
                <div class="w-full" align="center">
                    <vs-button class="mb-2 mt-5" color="danger" type="gradient" @click="f_importarProceso()"> Confirmar </vs-button>
                </div>
            </div>
        </vs-popup>
        <!--MODAL PARA MOSTRAR ERRORES-->
        <vs-popup large title="Unidades no importadas" :active.sync="popupMostrarErrores">
          <div v-if="popupMostrarErrores">
            <TableReutilizableVue
              title="Se encontraron errores"
              :ifexportar="1"
              nombrearchivo="Unidades_no_importadas"
              :headers="['id_libro', 'nombre_unidad', 'Mensaje']"
              :fieldKeys="['id_libro', 'nombre_unidad', 'message']"
              :tableData="arrayUnidadesYaExistentes"
              :maxItems="10"
            />

          </div>
        </vs-popup>
    </div>
</template>

<script>
import Generalmix from '../../../mixins/Generalmix';
import importExcelVue from '../../codigos/components/importExcel.vue';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
    mixins: [Generalmix],
    components: {
        importExcelVue,
        TableReutilizableVue
    },
    data() {
        return {
            usuario: [],
            tableData: [],
            header: [],
            sheetName: '',
            modalConfirm: false,
            porcentaje: 0,
            arrayUnidadesYaExistentes: [],
            popupMostrarErrores: false,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        loadDataInTable({ results, header, meta }) {
            let me = this
            this.header = header
            this.tableData = results
            this.sheetName = meta.sheetName
            this.porcentaje = 0
            this.arrayUnidadesYaExistentes = [];
            me.f_validate()
        },
        f_validate() {
            let me = this
            // Volver a revisar que esté bien el formato del excel - verificar que las columnas existan en el header
            const requiredColumns = ['id_libro', 'nombre_unidad', 'unidad', 'pag_inicio', 'pag_fin', 'txt_nombre_unidad'];
            const missingColumns = requiredColumns.filter(col => !me.header.includes(col));

            if (missingColumns.length > 0) {
                me.$vs.loading.close();
                me.$vs.notify({
                    text: `Faltan las siguientes columnas en el Excel: ${missingColumns.join(', ')}. Corrija el formato del excel y vuelva a intentar.`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time:6000,
                });
                me.tableData = [];
                return;
            }

            // Validaciones de columnas vacías
            if (!me.validarColumna('id_libro', 'En su columna de id_libro existen id_libro vacíos, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarColumna('nombre_unidad', 'En su columna de nombre_unidad existen nombre_unidad vacíos, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarColumna('unidad', 'En su columna de unidad existen unidades vacías, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarColumna('pag_inicio', 'En su columna de pag_inicio existen páginas de inicio vacías, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarColumna('pag_fin', 'En su columna de pag_fin existen páginas de fin vacías, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarColumna('txt_nombre_unidad', 'En su columna de txt_nombre_unidad existen txt_nombre_unidad vacíos, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }

            // Validación para asegurarse de que los campos sean números enteros positivos y no mayores a 1000
            if (!me.validarEnteroPositivo('id_libro', 'La columna id_libro debe contener solo números enteros positivos no mayores a 1000, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarEnteroPositivo('unidad', 'La columna unidad debe contener solo números enteros positivos no mayores a 1000, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarEnteroPositivo('pag_inicio', 'La columna pag_inicio debe contener solo números enteros positivos no mayores a 1000, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
            if (!me.validarEnteroPositivo('pag_fin', 'La columna pag_fin debe contener solo números enteros positivos no mayores a 1000, por favor revise el archivo')) {
                me.f_limpiar();
                return;
            }
        },

        // Función para validar que una columna no tenga valores vacíos
        validarColumna(columna, mensaje) {
            let me = this
            let validacion = me.tableData.filter(p => !columna in p || p[columna] === "");
            if (validacion.length > 0) {
                me.m_message(mensaje, 'warning');
                return false;
            }
            return true;
        },

        // Función para validar que una columna contenga solo números enteros positivos no mayores a 1000
        validarEnteroPositivo(columna, mensaje) {
            let me = this
            let validacion = me.tableData.filter(p => {
                const valor = parseFloat(p[columna]);
                return isNaN(valor) || !Number.isInteger(valor) || valor < 0 || valor > 1000;
            });
            if (validacion.length > 0) {
                me.m_message(mensaje, 'warning','icon-check',8000);
                return false;
            }
            return true;
        },
        openConfirm() {
            let me = this
            if (me.tableData.length < 0) {
                me.m_message('No hay unidades por subir', 'warning')
                return
            }
            //si pasa los 1500
            if (me.tableData.length > 1500) {
                me.m_message('No puedes subir mas de 1500 unidades en una sola carga', 'warning')
                return
            }
            me.modalConfirm = true
        },
        f_importarProceso() {
            let me = this
            me.porcentaje = 0
            me.$vs.loading()
            let formData = new FormData()
            formData.append('porImportacionUnidades', 1);
            formData.append('datos_array', JSON.stringify(me.tableData))
            formData.append('user_created', me.usuario.idusuario)
            let url = 'updateUnidades'
            this.$http.post(this.$server_url + url, formData)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.m_message(res.data.message, 'danger')
                        return
                    }
                    me.arrayUnidadesYaExistentes = res.data.unidades_ya_existentes || [];

                    me.f_limpiar()
                    me.modalConfirm = false
                    me.porcentaje = res.data.contador
                    if (me.arrayUnidadesYaExistentes.length > 0) {
                      me.m_message('Algunas unidades no se importaron','warning')
                      me.popupMostrarErrores = true
                    }else{
                      me.m_message('Proceso finalizado exitosamente', 'success')

                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                    me.m_message('Ocurrio un error intentando subir las unidades', 'danger')
                })
        },
        exportarFormato() {
            // Solo exportar las cabeceras sin datos
            import('../../../vendor/Export2Excel').then(excel => {
                excel.export_json_to_excel({
                    header: ['id_libro', 'nombre_unidad', 'unidad', 'pag_inicio', 'pag_fin', 'txt_nombre_unidad'],
                    data: [], // Array vacío para solo mostrar las cabeceras
                    filename: 'formato_importacion_unidades',
                    autoWidth: true,
                    bookType: 'xlsx'
                });
            }).catch(error => {
                console.error('Error al exportar formato:', error);
                this.$vs.notify({
                    text: 'Error al exportar el formato Excel',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },
        f_limpiar() {
            let me = this
            me.tableData = []
            me.sheetName = ''
            me.header = []
        },
    }
}
</script>

<style scoped>
.tabla {
    width: 100%;
    margin-top: 10px;
}

.tabla {
    border: 1px solid #D1E5F1;
    padding: 2px;
    border-radius: 5px;
}

.th1 {
    background-color: #75c57c;
    border-radius: 5px;
    color: white;
    margin: 50px;
}

.td1,
.th1 {
    padding: 10px;
    text-align: center;
    border: none;
    margin: 50px;
}
</style>
