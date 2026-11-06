<template>
    <div>
        <vs-alert>
            <p class="text-center">No suba mas de 1500 temas en una sola carga</p>
        </vs-alert>
        <!--EXCEL-->
        <div>
            <importExcelVue :onSuccess="loadDataInTable"  class="mt-5" />
        </div>
        <!--BOTON IMPORTAR-->
        <div class="flex justify-center mt-5" v-if="tableData.length > 0">
            <vs-button color="primary" type="filled" icon="save" @click="openConfirm(0)">Importar {{ tableData.length }} temas</vs-button>
        </div>
        <!--PROGRESO-->
        <div v-if="porcentaje > 0" class="flex justify-center mt-5 py-3 font-bold" style="background-color: aquamarine;">
            Se importaron {{ porcentaje }} temas
        </div>
        <!--FORMATO DEL EXCEL-->
        <div class="mt-5">
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
                <vs-card>
                    <div class="header">
                    <p style="font-weight: bold;">Formato del archivo excel</p>
                    <table class="tabla">
                        <tr>
                            <th class="th1">nombre_tema</th>
                            <th class="th1">id_asignatura</th>
                            <th class="th1">unidad</th>
                            <!-- <th class="th1">id_unidad</th> -->
                            <th class="th1">destreza (Colocar cero si quiere dejar en vacio)</th>
                        </tr>
                        <tr>
                            <td class="td1">x</td>
                            <td class="td1">x</td>
                            <td class="td1">x</td>
                            <td class="td1">x</td>
                            <!-- <td class="td1">x</td> -->
                        </tr>
                    </table>
                    </div>
                </vs-card>
                </vs-col>
            </vs-row>
        </div>
        <!--FIN FORMATO DEL EXCEL-->
        <!--FIN EXCEL-->
        <!--TABLA MOSTRAR TEMAS DEL EXCEL-->
        <vx-card v-if="tableData.length && header.length">
            <vs-table stripe pagination :max-items="10" search :data="tableData">
                <template slot="header">
                <h4>Temas a subir {{tableData.length}}</h4>
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
        <!--FIN TABLA MOSTRAR TEMAS DEL EXCEL-->

        <!--MODALES-->
           <!--MODAL PARA CONFIRMAR-->
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div v-if="modalConfirm">
        <p class="text-center">Esta seguro de import de {{ tableData.length }} temas?</p>
        <div class="w-full" align="center">
          <vs-button class="mb-2 mt-5" color="danger" type="gradient" @click="f_importarProceso()"> Confirmar </vs-button>
        </div>
      </div>
    </vs-popup>
    </div>
</template>
<script>
import Generalmix from '../../../mixins/Generalmix';
import importExcelVue from '../../codigos/components/importExcel.vue';
export default{
    mixins: [Generalmix],
    components:{
        importExcelVue
    },
    data(){
        return{
            usuario: [],
            tableData: [],
            header: [],
            sheetName: '',
            modalConfirm:false,
            porcentaje:0,
        }
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods:{
        loadDataInTable ({ results, header, meta }) {
            let me          = this
            this.header     = header
            this.tableData  = results
            this.sheetName  = meta.sheetName
            this.porcentaje = 0
            me.f_validate()
        },
        f_validate() {
            let me = this
            // Volver a revisar que esté bien el formato del excel
            if (!me.tableData[0].nombre_tema || !me.tableData[0].id_asignatura || !me.tableData[0].unidad) {
                me.$vs.loading.close();
                me.$vs.notify({
                    text: 'Corrija el formato del excel y vuelva a intentar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.tableData = [];
                return;
            }

            // Validaciones de columnas vacías
            if (!me.validarColumna('nombre_tema', 'En su columna de nombre_tema existen nombre_tema vacíos, por favor revise el archivo')) return;
            if (!me.validarColumna('id_asignatura', 'En su columna de id_asignatura existen id_asignatura vacíos, por favor revise el archivo')) return;
            if (!me.validarColumna('unidad', 'En su columna de unidad existen unidades vacías, por favor revise el archivo')) return;
            // if (!validarColumna('id_unidad', 'En su columna de id_unidad existen id_unidad vacíos, por favor revise el archivo')) return;
            // if (!me.validarColumna('destreza', 'En su columna de destreza existen destrezas vacías, por favor revise el archivo')) return;

            // Validación para asegurarse de que los campos sean números enteros
            if (!me.validarEntero('id_asignatura', 'La columna id_asignatura debe contener solo números enteros, por favor revise el archivo')) return;
            if (!me.validarEntero('unidad', 'La columna unidad debe contener solo números enteros, por favor revise el archivo')) return;
            // if (!validarEntero('id_unidad', 'La columna id_unidad debe contener solo números enteros, por favor revise el archivo')) return;
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

        // Función para validar que una columna contenga solo números enteros
        validarEntero(columna, mensaje) {
            let me = this
            let validacion = me.tableData.filter(p => {
                return isNaN(p[columna]) || !Number.isInteger(parseFloat(p[columna]));
            });
            if (validacion.length > 0) {
                me.m_message(mensaje, 'warning');
                return false;
            }
            return true;
        },
        openConfirm() {
            let me = this
            if(me.tableData.length < 0){
               me.m_message('No hay temas por subir','warning')
               return
            }
            //si pasa los 1500
            if(me.tableData.length > 1500){
                me.m_message('No puedes subir mas de 1500 temas en una sola carga','warning')
                return
            }
            me.modalConfirm = true
        },
        f_importarProceso(){
            let me = this
            me.porcentaje = 0
            let formData = new FormData()
            formData.append('porImportacion',   1);
            formData.append('datos_array',      JSON.stringify(me.tableData))
            formData.append('idusuario',        me.usuario.idusuario)
            let url = 'tema'
            this.$http.post(this.$server_url+url, formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.m_message(res.data.message,'danger')
                    return
                }
                me.m_message('Proceso finalizado exitosamente','success')
                me.f_limpiar()
                me.modalConfirm = false
                me.porcentaje   = res.data.contador
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error + ' error');
                me.m_message('Ocurrio un error intentando subir los temas','danger')
            })
        },
        f_limpiar(){
            let me = this
            me.tableData = []
            me.sheetName = ''
            me.header    = []
        },
    }
}
</script>
<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {
  
  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #75c57c;
  border-radius: 5px;
  color:white;
  margin: 50px;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
 margin: 50px;
}
</style>