<template>
<vx-card title="Alumnos">
    <vs-table max-items="10" search pagination :data="alumnos">
        <template slot="thead">
            <vs-th>Cédula</vs-th>
            <vs-th>Nombres</vs-th>
            <vs-th>Correo</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].cedula">
                    {{data[indextr].cedula}}
                </vs-td>
                <vs-td :data="data[indextr].nombres">
                    {{data[indextr].nombres}} {{data[indextr].apellidos}}
                </vs-td>
                <vs-td :data="data[indextr].email">
                    {{data[indextr].email}}
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
        respuestas: [],
        activePrompt: false,
        val: '',
        alumnos: [],
    }),
    mounted() {
        this.getEstudiantes()
    },
    created() {},
    methods: {
        getEstudiantes() {
            let me = this;
            var url = this.$server_url+"getEstudiantes?codigo=" + localStorage.codigo;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.alumnos = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
}
</script>
