<template>
<div>
    <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="url"></iframe>

    <vs-button color="danger" @click="$router.push('/lista/materialapoyoAdmin')" style="margin-top: 50px; margin-right: 8px; float:left" class="mb-3 text-right" >Regresar</vs-button>

</div>
</template>

<script>
export default {
    data() {
        return {
            url: ''
        }
    },
    methods: {

    },
    mounted() {
        this.url = localStorage.getItem('materialApoyo')
        console.log(localStorage.getItem('materialApoyo'))
    },
}
</script>
