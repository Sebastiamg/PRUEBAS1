<template>
<div>
    <vs-table max-items="20" search pagination :data="listaTutoriales">
        <template slot="header">
            <span>Cantidad: {{ listaTutoriales.length }} </span>
        </template>
        <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th>nombre</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{indextr}}<br>
                </vs-td>
                <vs-td>
                    {{data[indextr].nombre}}<br>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
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
            listaTutoriales: [],
        }
    },
    mounted() {
        let me = this;
    },
    methods: {},
}
</script>
