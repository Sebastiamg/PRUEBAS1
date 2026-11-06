<template>
<div>
    <div v-if="submenu.plista == true">
        <div class="vx-col sm:w-full" v-if="usuario.id_group === 1">
            <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-plus" @click="submenu.plista=false;submenu.pnuevo=true;submenu.peditar=false">Agregar planificación</vs-button>
        </div>
        <list v-on:item="menu" @changeBookSelect="changeBookSelect" :libroSelecionado="libroSelecionado"></list>
    </div>
    <div v-if="submenu.pnuevo == true">
        <div class="vx-col sm:w-full">
            <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="submenu.plista=true;submenu.pnuevo=false;submenu.peditar=false">Regresar</vs-button>
        </div>
        <nueva v-on:item="menu"></nueva>
    </div>
    <div v-if="submenu.peditar == true">
        <div class="vx-col sm:w-full">
            <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="submenu.plista=true;submenu.pnuevo=false;submenu.peditar=false">Regresar</vs-button>
        </div>
        <editar v-on:item="menu" :planificacion="planificacion"></editar>
    </div>
</div>
</template>

<script>
import list from './list2.vue'
import nueva from './nuevo.vue'
import editar from './editar.vue'
export default {
    components: {
        list,
        nueva,
        editar
    },
    data() {
        return {
            submenu: {
                plista: true,
                pnuevo: false,
                peditar: false
            },
            planificacion: {},
            libroSelecionado:0,
            usuario:[],
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    methods: {
      changeBookSelect(e){
        let me = this;
        me.libroSelecionado = e
      },
      menu(item) {
          this.submenu = item.menu
          this.planificacion = item.planificacion
      }
    },
}
</script>
