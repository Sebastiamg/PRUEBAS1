<template>
<div>
    <vx-card title="Usuarios conectados" class="mt-base">
        <!-- ACTION SLOT -->
        <template slot="actions">
            <b class="text-success">
                {{conectados.length}}
            </b>
        </template>
        <!-- FRIENDS LIST -->
        <ul class="friend-suggesions-list">
            <li class="friend-suggestion flex items-center mb-4" v-for="(item, index) in conectados" :key="index">
                <div class="mr-3">
                    <vs-button radius type="border" icon-pack="feather" icon="icon-user" />
                </div>
                <div class="leading-tight">
                    <p class="font-medium">{{ item.nombres }} {{ item.apellidos }}</p>
                    <p class="text-xs">{{ item.grupo }}</p>
                    <span class="text-xs">{{ item.fecha }}</span>
                </div>
            </li>
        </ul>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import io from 'socket.io-client';
Vue.use(axios)
export default {
    data: () => ({
        conectados: []
    }),
    mounted() {
        // this.socket.on('conectados', (users) => {
        //     this.conectados = users.users.reverse();
        // })
    },
    methods: {},
}
</script>
