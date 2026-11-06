<template>
    <div>
        <div v-for="(item,key) in arregloVerificaciones" :key="key">
          <ScreenRellenarPagosVue
          :cantidadVerificaciones="arregloVerificaciones.length"
          :VerificacionSelect="item"
          :sendPedido="ObjectSelected"
          :contrato="ObjectSelected.contrato_generado"
          @changeHandleUpdatePayments="getListadoPagos"
          />
        </div>
        <!--Actualizar pagos-->
        <div v-if="updatePagos" >
            <Pagos2BannerVue :ifGlobal="Number(1)" style="display: none;" :sendPedido="ObjectSelected"  :usuario="usuario" :arregloPagos="arregloPagos" @f_terminarActualizacionPagos="f_terminarActualizacionPagos"/>
        </div>
    </div>
</template>
<script>
const ScreenRellenarPagosVue = () => import('../../../../temporadas/components/Pedidos/Pagos/components/Verificacion/ScreenRellenarPagos.vue')
const Pagos2BannerVue        = () => import('./components/Pagos2Banner.vue')
export default{
    components:{
        ScreenRellenarPagosVue,
        Pagos2BannerVue,
    },
    data(){
        return{
            arregloVerificaciones:[],
            arregloPagos:[],
            updatePagos:false,
            usuario:[],
        }
    },
    mounted(){
        let me = this
        me.usuario  = JSON.parse(localStorage.getItem("usuario"))
        me.getVerificaciones()
    },
    props:{
        ObjectSelected:{
            type:Object,
            default:{
                function(){
                    return{

                    }
                }
            }
        }
    },
    methods:{
        getVerificaciones(){
            let me = this
            this.$http.get(this.$server_url+`n_verificacion?getVerificacionXcontrato=yes&contrato=${ me.ObjectSelected.contrato_generado }`)
            .then(function (res) {
            let datos = res.data.filter(p => p.estado == 0)
                if(datos.length > 0){
                    me.arregloVerificaciones = datos.sort((a, b) => a.id - b.id);
                }else{
                    me.$vs.notify({
                    text:'No hay verificaciones para actualizar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-triangle'
                    })
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        getListadoPagos(){
            let me = this;
            me.arregloPagos     = []
            const { id_institucion, id_periodo, contrato_generado:contrato } = me.ObjectSelected
            var url = ""
            if(contrato == "" || contrato == null || contrato == undefined) {
                url = this.$server_url + `pedigo_Pagos?ListadoListaPagosSinContrato=yes&institucion_id=${ id_institucion }&periodo_id=${ id_periodo }`
            }else{
                url = this.$server_url + `pedigo_Pagos?ListadoListaPagos=yes&contrato=${ contrato }`
            }
            this.$http.get(url)
                .then(function (res) {
                me.arregloPagos     = res.data.filter(p => p.tipo_pago_id != 3)
                me.updatePagos = true
                })
                .catch(function (error) {
                me.$vs.loading.close()
                console.log(error + ' error');
                })
        },
        f_terminarActualizacionPagos(){
            let me = this
            console.log("entoroo")
            me.updatePagos = true
            me.$emit('f_terminarActualizacionPagos',true)
        },
    }
}
</script>