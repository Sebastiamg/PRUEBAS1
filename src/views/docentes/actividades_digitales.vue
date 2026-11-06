<template>
<div>

    <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="width: 100%; height: 700px;" v-bind:src="$data_url+'archivos/upload/libro/' + url"></iframe>

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
    created() {
        let param = this.$route.params.link
        this.url = param.replace(/²/gi, '/')

    },
    mounted() {
        
    },
}
</script>
