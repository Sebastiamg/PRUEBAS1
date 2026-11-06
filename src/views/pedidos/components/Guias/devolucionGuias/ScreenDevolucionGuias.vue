<template>
    <div>
        <div v-if="menu == 1">
            <vs-button color="primary" type="border" style="margin-top: -20px;" @click="menu = 0">← Regresar</vs-button>
            <DevolucionBodegaVue v-if="menu == 1" :id="id" :periodo_id="periodo_id" @change="changeHandle" />
        </div>
        <div v-if="menu == 0">
            <vs-button class="btn_lg p-2" color="success"  @click="generarDevolucion()" type="line" icon-pack="feather" icon="icon-plus" icon-after>Solicitar Devolución</vs-button>
            <vs-table max-items="10" stripe search pagination :data="arregloDevoluciones">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arregloDevoluciones.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>Asesor</vs-th>
                    <vs-th>Cantidad a devolver</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                           {{data[indextr].id}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].asesor}}<br>
                        </vs-td>
                        <vs-td>
                            {{ tr.cantidad_devolver }}
                        </vs-td>
                        <vs-td>
                            <vs-chip color="warning" v-if="tr.estado == 0">Pendiente</vs-chip>
                            <vs-chip color="success" v-if="tr.estado == 1">Aprobado</vs-chip>
                            <vs-chip color="danger"  v-if="tr.estado == 2">Rechazado</vs-chip><br><br>
                            <div v-if="tr.estado == 1">
                                <p><b>Acta:</b> {{ tr.ven_codigo }}</p>
                                <p><b>Fecha de aprobación:</b> {{ tr.fecha_aprobacion }}</p>
                            </div>
                        </vs-td>
                        <vs-td>
                            <div class="flex" style="flex-direction: column;">
                                <!--EDITAR-->
                                <vx-tooltip style="display: inline-block;" text="Editar Devolución" position="top" color="primary">
                                    <vs-button class="modal-default-button" v-if="tr.estado == 0" @click="id = tr.id;menu = 1" size="small" color="dark" type="filled" icon-pack="feather" icon="icon-edit"> Editar Devolución</vs-button>
                                </vx-tooltip> &nbsp;
                                <!--DETALLE-->
                                <vx-tooltip style="display: inline-block;" text="Ver detalles" position="top" color="primary">
                                    <vs-button class="modal-default-button" style="margin-top: -10px;" size="small" color="primary" @click="getDetalles(tr)" type="filled" icon-pack="feather" icon="icon-file-minus"> Detalles</vs-button>
                                </vx-tooltip> &nbsp;
                                <!--ELIMINAR DEVOLUCION-->
                                <vx-tooltip style="display: inline-block;" text="Eliminar devolución de guias" position="top" color="dark">
                                    <vs-button class="modal-default-button" v-if="tr.estado == 0" style="margin-top: -10px;" size="small" color="warning" type="filled" icon-pack="feather" @click="devolucion =tr;openConfirmEliminar()" icon="icon-corner-down-left"> Eliminar Devolución</vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <!--MODALES-->
        <!--DETALLES-->
        <vs-popup class="holamundo" :title="'Detalles de la Devolución'" :active.sync="popupDetalles">
            <DetalleDevolucionVue v-if="popupDetalles" :arregloDetalle="arregloDetalle"/>
        </vs-popup>
    </div>
</template>
<script>
const DevolucionBodegaVue   = () => import('./DevolucionBodega.vue');
const DetalleDevolucionVue  = () => import('./components/DetalleDevolucion.vue');
export default{
    data(){
        return{
            periodo_id:0,
            usuario:[],
            arregloDevoluciones:[],
            arregloDetalle:[],
            devolucion:{},
            popupDetalles:false,
            menu:0,
            id:0,
        }
    },
    components:{
        DevolucionBodegaVue,
        DetalleDevolucionVue,
    },
    props:{
        periodoBodega:{
            type:Number,
            default:0,
        },
        periodoSelect:{
          type:Object,
          default:function(){
            return {}
          }
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
        if(me.usuario.id_group == 11){
            me.periodo_id = this.periodoSelect.idperiodoescolar
        }
        //bodega
        else{
            me.periodo_id = me.periodoBodega
        }
    },
    mounted(){
        let me = this;
        me.getListadoDevoluciones()
    },
    methods:{
        changeHandle(e){
            let me = this;
            me.menu = 0
            me.getListadoDevoluciones()
        },
        getListadoDevoluciones() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'guias?devolucion=yes&asesor_id='+me.usuario.idusuario+'&periodo_id='+me.periodo_id)
                .then(function (res) {
                    me.arregloDevoluciones = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text:'Error al cargar las devoluciones',
                        color:'danger',
                        iconPack: 'feather',
                        icon:'icon-alert-circle'
                    })
                })
        },
        getDetalles(tr) {
            let me = this;
            me.arregloDetalle = []
            me.$vs.loading();
            this.$http.get(this.$server_url+'guias?detalle=yes&id='+tr.id)
                .then(function (res) {
                    let datos = res.data
                    me.arregloDetalle = datos.filter(p => p.cantidad_devuelta > 0)
                    me.popupDetalles  = true
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        generarDevolucion(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'guias?validarGenerar=yes&asesor_id='+me.usuario.idusuario)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                        text:res.data.message,
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return
                    }
                    me.id = 0
                    me.menu = 1
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        openConfirmEliminar(){
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                cancelText:'cancelar',
                title: `Confirmar`,
                text: 'Esta seguro de eliminar la devolución?.',
                accept:this.eliminarDevolucion
            })
        },
        eliminarDevolucion(){
            let me = this;
            let formData = new FormData();
            formData.append('id',me.devolucion.id);
            me.$vs.loading()
            this.$http.post(this.$server_url+'eliminarDevolucionGuias', formData)
            .then(res => {
            me.getListadoDevoluciones();
            me.$vs.loading.close()
            me.$vs.notify({
                text:'devolución eliminado con exito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            me.devolucion = {}
        }
    }
}
</script>
