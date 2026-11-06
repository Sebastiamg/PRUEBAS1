<template>
<div>
    <!-- <vx-card ref="filterCard" title="Filtros" class="user-list-filters mb-8" actionButtons @refresh="resetColFilters" @remove="resetColFilters"> -->
    <vx-card ref="filterCard" title="Filtros" class="user-list-filters mb-8">
      <div class="vx-row">
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Role</label>
          <!-- <v-select :options="roleOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="roleFilter" class="mb-4 md:mb-0" /> -->
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Status</label>
          <!-- <v-select :options="statusOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="statusFilter" class="mb-4 md:mb-0" /> -->
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Verified</label>
          <!-- <v-select :options="isVerifiedOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="isVerifiedFilter" class="mb-4 sm:mb-0" /> -->
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Department</label>
          <!-- <v-select :options="departmentOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="departmentFilter" /> -->
        </div>
      </div>
    </vx-card>

    <vx-card>
        <vs-table stripe max-items="10" search pagination :data="admin">
            <template slot="header">
                <vs-button color="primary" type="border" @click="addNewData" icon-pack="feather" icon="icon-plus">Agregar</vs-button>
            </template>
            <template slot="thead">
                <vs-th>Cédula</vs-th>
                <vs-th>Nombres</vs-th>
                <vs-th>Usuario</vs-th>
                <vs-th>Correo</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.cedula">
                        {{tr.cedula}}
                    </vs-td>
                    <vs-td :data="tr.nombres">
                        {{tr.nombres}} {{tr.apellidos}}
                    </vs-td>
                    <vs-td :data="tr.name_usuario">
                        {{tr.name_usuario}}
                    </vs-td>
                    <vs-td :data="tr.email">
                        {{tr.email}}
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
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    data: () => ({
        admin: []
    }),
    mounted() {
        this.getAdmin();
    },
    methods: {
        async getAdmin() {
            let me = this;
            this.$http.get(this.$server_url+'usuarios')
                .then(function (response) {
                    me.admin = response.data;
                    console.log(me.admin);
                })
                .catch(function (error) {})
        },
        getEditar(idarea) {
            this.$router.push('/home/areas/editar/' + idarea);
            console.log(idarea);
        },
        getEliminar(idarea) {
            let me = this;
            this.$http.delete(this.$server_url+"admin/" + idarea)
                .then(function (response) {
                    me.getAdmin();
                })
                .catch(function (error) {})
        }
    },
}
</script>
