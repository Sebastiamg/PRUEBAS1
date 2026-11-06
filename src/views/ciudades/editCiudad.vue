<template>
<div>
    <div class="m-3 mt-0">
        <small>Provincia</small>
        <v-select :options="listaProvincias" :reduce="listaProvincias => listaProvincias.idprovincia" label="nombreprovincia" v-model="provinciaSelect" /> {{ provinciaSelect }}
    </div>
    <div class="m-3">
        <small>Ciudad</small>
        <vs-input v-model="ciudad.nombre" class="w-full" />
    </div>
    <div class="m-3">
        <small>Id provincia facturacion</small>
        <vs-input v-model="ciudad.id_provincia_milton" class="w-full" />
    </div>
    <div class="m-3">
        <small>Id ciudad facturacion</small>
        <vs-input v-model="ciudad.id_ciudad_milton" class="w-full" />
    </div>
    <div class="m-3">
        <vs-button color="warning" icon="save" @click="f_editarCiudad()">Editar</vs-button>
    </div>

</div>
</template>

<script>
import vSelect from 'vue-select';
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            idciudad: '',
            provinciaSelect: {},
            listaProvincias: [],
            ciudad: {},
        }
    },
    mounted() {
        let me = this;
        me.idciudad = localStorage.getItem('idCiudad');
        console.log('en el edit', me.idciudad)
        if (me.idciudad > 0) {
          me.getCiudad(me.idciudad);
        }
        me.getProvincias();
    },
    methods: {
        getCiudad(item) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getCiudadProvincia/' + item)
                .then((result) => {
                    console.log(result.data)
                    me.ciudad = result.data[0];
                    me.provinciaSelect = {
                        'idprovincia': result.data[0].idprovincia,
                        'nombreprovincia': result.data[0].nombreprovincia
                    }
                    console.log(me.provinciaSelect)
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        getProvincias() {
            let me = this;
            // me.$vs.loading();
            this.$http.get(this.$server_url + 'getProvincias')
                .then((result) => {
                    console.log(result.data)
                    me.listaProvincias = result.data;
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_editarCiudad() {
            let me = this;
            console.log(me.ciudad, me.provinciaSelect);
            me.ciudad.provincia_idprovincia = me.provinciaSelect
            me.$vs.loading();
            this.$http.post(this.$server_url + 'ciudad', me.ciudad)
                .then((result) => {
                    let msj = result.data.nombre + ' actualizado correctamente.';
                    me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                    me.$emit('ciudad_update', 'ok');
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        }
    },
}
</script>
