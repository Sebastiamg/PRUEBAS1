<template>
<vs-table search :data="data">
    <template slot="thead">
        <vs-th sort-key="nombre">Nombre</vs-th>
        <vs-th sort-key="descripcion">Descripción</vs-th>
    </template>
    <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="tr.nombre">
                {{ tr.nombre }}
            </vs-td>
            <vs-td :data="tr.descripcion">
                {{ tr.descripcion }}
            </vs-td>
        </vs-tr>
    </template>
</vs-table>
</template>

<script>
export default {
    data() {
        return {
            data: [],
            asignaturas: []
        }
    },
    created() {
        this.asignaturas();
    },
    mounted() {
        this.proyectos();
    },
    methods: {
        asignaturas(){
            let me = this;
            this.$http.get($data_url+'asignaturas')
            .then(function (response) {
                me.asignaturas = response.data
            })
            .catch(function (error) {
            })
        },
        proyectos() {
            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/proyectos')
                .then(function (response) {
                    me.data = response.data;
                })
                .catch(function (error) {})
        }
    },
}
</script>
