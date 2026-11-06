<template>
<div>
    <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/pdfsinguia/'+url"></iframe>
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
        this.url = localStorage.getItem('url')
        console.log(localStorage.getItem('url'))
    },
}
</script>
