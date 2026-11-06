<template>
<vx-card title="Planificaciones">
    <vs-table max-items="10" search pagination :data="planificacion">
        <template slot="thead">
            <vs-th>Nombre</vs-th>
            <vs-th>Descripción</vs-th>
            <vs-th>Descarga</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].nombreplanificacion">
                    {{data[indextr].nombreplanificacion}}
                </vs-td>
                <vs-td :data="data[indextr].descripcionplanificacion">
                    {{data[indextr].descripcionplanificacion}}
                </vs-td>
                <vs-td :data="data[indextr].webplanificacion">
                    <a :href="$data_url+'archivos/upload/planificacion/'+data[indextr].webplanificacion" target="_blank" rel="noopener noreferrer">Descargar</a>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    data: () => ({
        planificacion: []
    }),
    mounted() {
        this.getAdmin();
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        getAdmin() {
            let me = this;
            this.$http.get(this.$server_url+'planificacion?idusuario='+me.usuario.idusuario)
                .then(function (response) {
                    me.planificacion = response.data;
                    console.log(me.planificacion);
                })
                .catch(function (error) {})
        }
    },
}
</script>
