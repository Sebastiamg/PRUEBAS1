<template>
    <v-select
        :options="instituciones"
        label="nombreInstitucion"
        :reduce="i => i.idInstitucion"
        :value="value"
        @input="val => $emit('input', val)"
        @search="buscar"
        :filterable="false"
        :placeholder="placeholder"
        :loading="cargando"
    >
        <template #option="{ nombreInstitucion, ciudad }">
            {{ nombreInstitucion }} <span style="color:#9ca3af"> — {{ ciudad }}</span>
        </template>
        <template #selected-option="{ nombreInstitucion, ciudad }">
            {{ nombreInstitucion }} — {{ ciudad }}
        </template>
        <template #no-options="{ search }">
            <span v-if="search.length < 3" class="text-gray-400 text-sm">
                Escribe al menos 3 caracteres...
            </span>
            <span v-else class="text-gray-400 text-sm">
                No se encontraron instituciones
            </span>
        </template>
    </v-select>
</template>

<script>
import vSelect from 'vue-select'

export default {
    name: 'InstitucionSearch',
    components: { 'v-select': vSelect },

    props: {
        value: { default: null },
        placeholder: { type: String, default: 'Buscar institución...' },
        todas: { type: Number, default: 1 }  // 1 = todas, 0 = solo activas
    },

    data() {
        return {
            instituciones: [],
            cargando: false,
            timer: null
        }
    },

    methods: {
        buscar(search) {
            if (!search || search.length < 3) return

            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.cargando = true
                this.$http.get(
                    this.$server_url + 'listaInsitucion?busqueda=' + search + '&todas=' + this.todas
                )
                .then(res => {
                    this.instituciones = res.data
                    this.cargando = false
                })
                .catch(() => { this.cargando = false })
            }, 350) // debounce 350ms
        }
    }
}
</script>
