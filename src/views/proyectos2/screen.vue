<template>
<div>
    <!-- <vs-progress :height="8" :percent="porcentaje" color="primary"></vs-progress>
    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/> -->
    <vs-button @click="agregar">Agregar</vs-button>
    <proyectos></proyectos>
</div>
</template>

<script>
import proyectos from "./tabla.vue";
import nuevo from './nuevo.vue'
export default {
    props:{
        estado:Boolean
    },
    components: {
        proyectos,
        nuevo
    },
    data: function () {
        return {
            estado : true,
            porcentaje:0,
            file: {},
            dropzoneOptions: {
                url: 'https://foro.prolipadigital.com.ec/upload/',
                thumbnailWidth: 150,
                maxFilesize: 0.5,
            }
        }
    },
    mounted() {
        this.estado = this.estado;
    },
    methods: {
        agregar(){
            this.$router.push('/proyecto/nuevo');
        },
        postFile(){
            console.log("Eviando...")
        },
        handleFileUpload() {
            let me = this;
            const config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    me.porcentaje = percentCompleted;
                    console.log(percentCompleted)
                }
            };
            formData.append('files', this.file);
            this.file = this.$refs.file.files[0];
            let formData = new FormData();
            axios.post("https://foro.prolipadigital.com.ec/upload", formData, config)
                .then(function (response) {
                    me.$refs.file = '';
                    console.log(response.data)
                })
        },
    },
}
</script>
