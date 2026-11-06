<template>
<div>
  <vs-button icon="add" color="primary" @click="btnEditCiudad()" type="border">Agregar</vs-button>
    <vs-table max-items="40" search pagination :data="listaCiudad">
        <template slot="header">
            <span>Cantidad: {{ listaCiudad.length }} </span>
        </template>
        <template slot="thead">
            <vs-th sort-key="idciudad">id</vs-th>
            <vs-th sort-key="nombre">Ciudad</vs-th>
            <vs-th sort-key="provincia_idprovincia">Provincia</vs-th>
            <vs-th sort-key="id_ciudad_milton">Ciudad fact.</vs-th>
            <vs-th sort-key="id_provincia_milton">Provincia fact.</vs-th>
            <vs-th></vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].idciudad}}
                </vs-td>
                <vs-td>
                    {{data[indextr].nombre}}<br>
                </vs-td>
                <vs-td>
                    id: {{data[indextr].provincia_idprovincia}} -
                    {{data[indextr].nombreprovincia}}<br>
                </vs-td>
                <vs-td>
                    {{data[indextr].id_ciudad_milton}}<br>
                </vs-td>
                <vs-td>
                    {{data[indextr].id_provincia_milton}}<br>
                </vs-td>
                <vs-td>
                    <vs-button icon="edit" color="warning" @click="btnEditCiudad(tr)" />
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>

    <vs-popup :title="titulo" :active.sync="modalEdit" v-if="modalOk== 1" @close="closemodalEdit">
        <EditCiudad @ciudad_update="f_actualizada()" />
    </vs-popup>

</div>
</template>

<script>
import vSelect from 'vue-select';
import EditCiudad from './editCiudad.vue';
export default {
    components: {
        "v-select": vSelect,
        EditCiudad
    },
    data() {
        return {
            listaProvincias: [],
            listaCiudad: [],
            modalEdit: false,
            ciudad: '',
            modalOk: 0,
            titulo: '',
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('idCiudad');
        me.getCiudades();
    },
    methods: {
        getProvincias() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getProvincias')
                .then((result) => {
                    // console.log(result.data)
                    me.listaProvincias = result.data;
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        getCiudades() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getCiudadProvincia/0')
                .then((result) => {
                    // console.log(result.data)
                    me.listaCiudad = result.data;
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        btnEditCiudad(item) {
            let me = this;
            if (item == null) {
              me.titulo = 'Agregar ciudad';
              localStorage.setItem('idCiudad', 0)
            }else{
              me.titulo = 'Editar ciudad';
              localStorage.setItem('idCiudad', item.idciudad)
            }
            me.modalOk = 1;
            me.modalEdit = true;
        },
        closemodalEdit() {
            let me = this;
            me.modalOk = 0;
        },
        f_actualizada() {
            let me = this;
            me.modalOk = 0;
            me.modalEdit = false;
            me.getCiudades();
        },
    },
}
</script>
