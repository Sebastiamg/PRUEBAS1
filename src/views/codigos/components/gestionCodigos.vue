<template>
    <div>
        <vs-card v-if="nuevo">
            <vs-button radius color="success" type="gradient" @click="nuevo = false;" icon="reply"></vs-button>
            <gestionCodigosCrear @regresar="change" @code="changeCode" :codigosEdit="codigosEdit" :editar="editar"/>
        </vs-card>
        <vx-card
        v-else
        title="Filtro de busqueda de códigos"
        title-color="success"
        >
            <vs-row vs-justify="flex-start">
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <vs-button type="border" icon-pack="feather" icon="icon-code" @click="nuevo=true;editar=0;">
                        Agregar código
                    </vs-button>
                    <br/>
                    <p>Filtro de busqueda</p>
                    <br>
                    <vs-card>
                        <div style="">
                            <vs-input class="w-full" icon-after="true" @keyup.enter="filterCodes()" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Ingrese el criterio de busqueda"  v-model="razonBusqueda"/>
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
            <vs-divider></vs-divider>
            <gestionCodigosLista
            :arregloCodigos="arregloCodigos"
            btnEditar="1"
            btnEliminar="1"
            btnEstudiante="0"
            btnBloquear="0"
            @crud="changeHandle"/>
        </vx-card>
    </div>

</template>
<script>
import gestionCodigosCrear from './utils/gestionCodigosCrear.vue'
import gestionCodigosLista from './utils/gestionCodigosLista.vue'
export default {
    data() {
        return{
            usuario:[],
            id:0,
            razonBusqueda:'',
            arregloCodigos:[],
            codigosEdit:[],
            nuevo:false,
            editar:0,
             //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            //fin variables para el export a excel
        }

    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    components:{
        gestionCodigosCrear,
        gestionCodigosLista,
    },
    methods:{
        change(e){
            let me = this;
            me.nuevo = e
            me.filterCodes()
        },
        changeCode(e){
            let me = this;
            me.razonBusqueda = e
        },
        changeHandle(e){
            let me = this;
            if(e.eliminar == 1){
                me.openConfirm(e.id)
            }else{
                me.codigosEdit  = e.codigosEdit
                me.editar       = e.editar
                me.nuevo        = e.nuevo
            }
        },
        filterCodes(){
            let me = this;
            me.arregloCodigos = [];
            if(me.razonBusqueda.length < 4){
                me.$vs.notify({
                text:'Minimo 4 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }

            me.$vs.loading();
            this.$http.get(this.$server_url+'gestionCodigos?codigo='+me.razonBusqueda)
            .then(function (res) {
                me.$vs.loading.close()
                me.arregloCodigos =res.data
                if(res.data.status == '0'){
                    me.$vs.notify({
                    text:'No se encontro codigos',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return false;
                }

            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        openConfirm(codigo){
            let me = this;
            me.id = codigo
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro de eliminar este codigo de la base de datos?.',
                accept:this.eliminarCodigo
            })
        },
        eliminarCodigo(){
            let me = this;
            let formData = new FormData();
            formData.append('codigo',           me.id)
            formData.append('idusuario',        me.usuario.idusuario)
            formData.append('institucion_id',   me.usuario.institucion_idInstitucion)
            formData.append('periodo_id',       localStorage.periodo_id)
            this.$http.post(this.$server_url+'eliminarCode?codigo=',formData)
            .then(function (res) {
                me.$vs.loading.close()
                me.$vs.notify({
                text:res.data.message,
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check',
                time:4000,
            })
                if(res.data.status == '1'){
                    me.filterCodes()
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },

    }
}
</script>
