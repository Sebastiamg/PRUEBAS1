<template>
    <div>
        <div v-if="plista == true">
            <vs-button @click="setNuevo">Agregar tarea</vs-button>
            <list v-on:tarea="recuperar" v-on:estado="menu"></list>
        </div>
        <div>
            <nueva-tarea v-if="pnuevo == true" v-on:estado="menu"></nueva-tarea>
        </div>
        <div>
            <editar v-if="peditar == true" :tarea="tr.tarea" v-on:estado="menu"></editar>
        </div>
        <div>
            <calificaciones v-if="pcalificar == true" :tarea="tr" v-on:estado="menu"></calificaciones>
        </div>
    </div>
</template>
<script>
import {
    mapState
} from 'vuex'
import list from './lista.vue'
import editar from './editar.vue'
import NuevaTarea from './nueva-tarea.vue'
import calificaciones from './calificaciones.vue'
export default {
    components:{
        list,
        editar,
        calificaciones,
        NuevaTarea,
    },
    data() {
        return {
            tr:{
            },
            plista: true,
            pnuevo: false,
            peditar: false,
            pcalificar: false,
        }
    },
    computed:{
        ...mapState(['usuario'])
    },
    methods: {
        setNuevo(){
            this.plista = false;
            this.pnuevo = true;
            this.peditar = false;
            this.pcalificar = false;
        },
        menu(item){
            this.plista = item.plista
            this.pnuevo = item.pnuevo
            this.peditar = item.peditar
            this.pcalificar = item.pcalificar
        },
        recuperar(item){
            this.tr = item;
        }
    },
}
</script>