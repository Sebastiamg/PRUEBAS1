<template>
    <div>
       <vs-card>
            <vs-tabs :color="colorx">
                <vs-tab label="Visitas" icon="event" @click="colorx = '#ECAF2B'">
                    <visitas tipo="1" valor="Visita"/>
                </vs-tab>
                <!-- <vs-tab label="Capacitaciones" icon="groups" @click="colorx = '#FFA500'">
                    <visitas tipo="2" valor="Capacitación"/>
                </vs-tab> -->
                <!-- <vs-tab label="Presentaciones" icon="dashboard" @click="colorx = '#21C4D1'">
                    <visitas tipo="3" valor="Presentación"/>
                </vs-tab>
                <vs-tab label="Muestras" icon="collections" @click="colorx = '#E6DA24'">
                    <muestrasVue/>
                </vs-tab>
                <vs-tab label="Pedidos - Contratos" icon="receipt" @click="colorx = '#0000FF'">
                </vs-tab> -->
            </vs-tabs>
       </vs-card>



    </div>
</template>

<script>
import visitas from './components/visitasAdmin.vue'
import muestrasVue from './components/muestras.vue'
export default {
    data() {
      return{
          colorx:"#60E029",
          popupAgregarSeguimiento:false,
      }
    },
    components:{
        visitas,
        muestrasVue
    }
}
</script>
