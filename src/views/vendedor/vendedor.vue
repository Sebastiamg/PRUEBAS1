<template>
<vx-card title="Vendedores">
    <vs-table max-items="10" search pagination :data="vendedor">
        <template slot="thead">
            <vs-th>Cedula</vs-th>
            <vs-th>Nombres</vs-th>
            <vs-th>Apellidos</vs-th>
            <vs-th>Usuario</vs-th>
            <vs-th>Correo</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].cedula">
                    {{data[indextr].cedula}}
                </vs-td>
                <vs-td :data="data[indextr].nombres">
                    {{data[indextr].nombres}}
                </vs-td>
                <vs-td :data="data[indextr].apellidos">
                    {{data[indextr].apellidos}}
                </vs-td>
                <vs-td :data="data[indextr].name_usuario">
                    {{data[indextr].name_usuario}}
                </vs-td>
                <vs-td :data="data[indextr].email">
                    {{data[indextr].email}}
                </vs-td>
                <vs-td :data="tr.idInstitucion">
                    <div class="flex">
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-info" class="mr-2" color="primary" @click="getInformacion(tr)"></vs-button>
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="getEditar(tr)"></vs-button>
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="getEliminar(tr)"></vs-button>
                    </div>
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
        vendedor: []
    }),
    mounted() {
        this.getAdmin();
    },
    methods: {
        getAdmin() {
            let me = this;
            this.$http.get(this.$server_url+'vendedor')
                .then(function (response) {
                    me.vendedor = response.data;
                    console.log(me.vendedor);
                })
                .catch(function (error) {})
        },
        getEditar(idarea) {
            this.$router.push('/home/areas/editar/' + idarea);
            console.log(idarea);
        },
        getEliminar(idarea) {
            let me = this;
            this.$http.delete(this.$server_url+"vendedor/" + idarea)
                .then(function (response) {
                    me.getAdmin();
                })
                .catch(function (error) {})
        }
    },
}
</script>
