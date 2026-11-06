<template>
<div>
    <vx-card>
        <vs-tabs>
            <vs-tab label="Lista">
                <ListaVideoTutoriales />
            </vs-tab>
            <vs-tab label="Show">
                <ViewTutoriales />
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
import vSelect from 'vue-select';
import ListaVideoTutoriales from './listaVideoTutoriales.vue';
import ViewTutoriales from './viewTutoriales.vue';
export default {
    components: {
        "v-select": vSelect,
        ListaVideoTutoriales,
        ViewTutoriales
    },
    data() {
        return {}
    },
    mounted() {
        let me = this;
    },
    methods: {},
}
</script>
