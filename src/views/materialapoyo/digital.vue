<template>
<div>
    <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="url"></iframe>
    <vs-button color="danger" @click="$router.go(-1)" class="mt-3 mb-3" type="relief">Salir</vs-button>
</div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
        }
    },
    methods: {

    },
    mounted() {
        this.url = localStorage.getItem('url_material')
        console.log(localStorage.getItem('url_material'))
    },
}
</script>
