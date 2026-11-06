<template>
<div>
    <div class="mi-clase-grid inline-grid m-2 cursor-pointer" v-for="(item, index) in listaVideos" :key="index" @click="f_ver_video(item)">
        <div class="m-2">
          <youtube :video-id="item.url" ref="youtube" ></youtube>

            <!-- <img src="https://mitiendanikken.com/images/playvideo.png" width="auto" height="150px" alt="" srcset=""> -->
            <h5 class="mt-4 text-center h-titulo"> {{ item.titulo.length >long_video ? item.titulo.substring(0,long_video) + '...' : item.titulo }}</h5>
        </div>
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
            long_video: 65,
            listaVideos: [{
                    'id': 1,
                    'titulo': 'video 1 de registro de pedidosdeo 1 de registro de pedidosideo 1 de registro de pedidosdeo 1 de registro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },
                {
                    'id': 2,
                    'titulo': 'registro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },
                {
                    'id': 2,
                    'titulo': 'registro de pedidos registro de pedido sregistro de pedidos registro de pedidosregistro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },
                {
                    'id': 2,
                    'titulo': 'registro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },
                {
                    'id': 2,
                    'titulo': 'registro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },
                {
                    'id': 2,
                    'titulo': 'registro de pedidosregistro de pedidosregistro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },
                {
                    'id': 2,
                    'titulo': 'registro de pedidos',
                    'link': 'https://youtu.be/Y-ygYgzYrjw'
                },

            ]
        }
    },
    mounted() {
        let me = this;
    },
    methods: {
        f_ver_video(item) {
            console.log(item)
        }
    },
}
</script>

<style lang="css" scoped>
.mi-clase-grid {
    border: solid 1px #ded6d6;
    column-gap: 50px;
}

.h-titulo {
    height: 50px;
    max-width: 300px;
}
</style>
