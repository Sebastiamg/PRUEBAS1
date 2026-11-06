<template>
<div>

    <iframe v-if="link_caducado==false" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+data_link.split('4.3')[4]+'/?init='+data_link.split('4.3')[0]+'&final='+data_link.split('4.3')[1]"></iframe>

    <div v-else class="w-full p-12">
      <vx-card align="center" class=" p-12">
        <h1>Lo sentimos, este link a caducado.</h1>
      </vx-card>
    </div>

</div>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            data_link: '',
            link_caducado: false,
            enlace: '',
        }
    },
    methods: {
      validarCaducidad(){
        let me = this
        let date_actual = new Date()
        let fechaLocal = moment(date_actual, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          // alert(fechaLocal +' > '+ this.data_link.split('4.3')[3])
        if ( fechaLocal > this.data_link.split('4.3')[3] || fechaLocal < this.data_link.split('4.3')[2] ){
          me.link_caducado = true
        }
      }
    },
    mounted() {

        this.data_link = this.$route.params.data_link
        
        this.validarCaducidad()
    },
}
</script>
