<template>
    <div>
       <vs-card>
            <vs-tabs :color="colorx" :value="valor">
                <vs-tab label="Planificación" icon="event" @click="colorx = '#ECAF2B';tipos='planificacion';irMenu();menu = 0;">
                    <menuVisitasVue  v-if="menu == 0"  tipo="planificacion"/>
                </vs-tab>
               <vs-tab label="Capacitaciones" icon="groups" @click="colorx = '#FFA500';tipos='capacitaciones';irMenu();menu = 1;">
                    <menuVisitasVue  v-if="menu == 1" tipo="capacitaciones"/>
                </vs-tab>
            </vs-tabs>
       </vs-card>
    </div>
</template>

<script>
const menuVisitasVue = () => import('./menuVisitas.vue')
export default {
    data() {
      return{
          menu:0,
          colorx:"#60E029",
          popupAgregarSeguimiento:false,
          tipos:'planificacion',
          valor:0,
      }
    },
    created(){
       let me = this;
       let tipoMenu = localStorage.getItem("tipo")

       if(tipoMenu == "capacitaciones"){
           me.valor = 2
       }
       if(tipoMenu == "visitas"){
           me.valor = 1
       }
       if(tipoMenu == "muestras"){
           me.valor = 3
       }if(tipoMenu == "planificacion"){
           me.valor = 0
       }

    },
    components:{
        menuVisitasVue
    },
    methods:{
        irMenu(){
            let me = this;
            localStorage.setItem('tipo',me.tipos)
        }
    }
}
</script>
