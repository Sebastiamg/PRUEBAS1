<template>
    <div>
        <vs-tabs alignment="fixed">
            <vs-tab label="Solicitudes Verificaciones" @click="menu=0">
                <div>

                </div>
            </vs-tab>
            <vs-tab label="Aprobacion Gerencia Solicitudes Verificaciones" @click="menu=1" v-if="userRoot || userGerencia">
                <div>

                </div>
            </vs-tab>
        </vs-tabs>
        <!--components-->
        <div v-if="menu==0">
            <HistoricoSolicitudVerificaciones/>
        </div>
        <div v-if="menu==1">
            <ReporteGerenciaVerificacionesLiquidacionesVue/>
        </div>
    </div>
</template>
<script>
import {
    mapState
} from "vuex";
const HistoricoSolicitudVerificaciones              = () => import('../../temporadas/HistoricoSolicitudVerificaciones.vue')
const ReporteGerenciaVerificacionesLiquidacionesVue = () => import('@/views/pedidos/gerencia/reportes/verificaciones/ReporteGerenciaVerificacionesLiquidaciones.vue')
export default{
    components:{
        HistoricoSolicitudVerificaciones,
        ReporteGerenciaVerificacionesLiquidacionesVue
    },
    data(){
        return{
            menu:0,
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userGerencia', 'userAsesor', 'groupFacturador']),
    },
}
</script>