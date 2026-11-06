<template>
<div class="p-4">
    <vx-card>
        <span>hola</span>
        <span>{{curso}}</span>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import card from './card.vue'
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    props: {
        curso: Object
    },
    created() {

    },
}
</script>
