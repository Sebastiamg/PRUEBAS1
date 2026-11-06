<template>
<div class="vx-row w-full p-6">
    <!-- {{secciones}} -->

    <!------BARRA SUPERIOR-------->
    <div class="vx-col sm:w-3/4 w-full" style="font-size: 18px;">
        <vx-card :title="'Encuesta ' + data_seminario.nombre" title-color="primary">
            <div class="vx-row">
                <div class="vx-col w-full" align="justify" v-if="data_seminario">
                    <b>Docente: </b> {{usuario.nombres +' '+ usuario.apellidos}} <br>
                    <b>Inicia: </b> {{data_seminario.fecha_inicio}} - <b>finaliza: </b> {{data_seminario.fecha_fin}}<br>
                    <b>Seminario: </b> <span> {{data_seminario.descripcion}} </span><br>
                </div>
            </div>
        </vx-card>

        <!-------INICIO SECCION RESPONDER---------->
        <vx-card class="mt-5 mb-6">

            <vs-collapse type="margin">
            <vs-collapse-item v-for="(itemS, indexS) in secciones" :key="indexS">
                <div slot="header"> Sección - {{itemS[0][0].nombre_seccion}} </div>
                <div v-for="(itemP, indexP) in itemS[0]" :key="indexP" class="w-full mb-2">
                <div :id="itemS[0][0].seccion_pregunta+'_P'+(indexP+1)" class="w-full pt-3 px-6" style="vertical-align: top;">
                    <div class="mt-2" style="font-size: 17px; min-height: 50px;" align="justify"> 
                        <b>{{itemP.nombre_pregunta}}</b> 
                    </div>

                    <div v-if="itemP.tipo_pregunta == 1 || itemP.tipo_pregunta == 2" class="mb-base w-full" style="font-size: 15px;" align="center">
                        <vs-slider :min="1" :max="5" color="rgb(45, 208, 129)" v-model="resp_tipo_range[itemP.id_pregunta]"/>
                    </div>

                    <div v-if="itemP.tipo_pregunta == 4" class="mb-base w-full" style="font-size: 15px;" align="center">
                        <vs-radio v-model="resp_tipo_radio[itemP.id_pregunta]" vs-value="SI" class="m-6"> SI </vs-radio>
                        <vs-radio v-model="resp_tipo_radio[itemP.id_pregunta]" vs-value="NO" class="m-6"> NO </vs-radio>
                    </div>

                    <div v-if="itemP.tipo_pregunta == 3" class="mb-base w-full" style="font-size: 15px;" align="center">
                        <vs-textarea v-model="resp_tipo_text[itemP.id_pregunta]" />
                    </div>
                </div>
                
                <vs-pagination :total="itemS[0].length" v-model="current_preg[indexS]" @input="paginacion(indexS, itemS[0].length, itemS[0][0].seccion_pregunta)"></vs-pagination>

                </div>
            </vs-collapse-item>
            </vs-collapse>
        </vx-card>


        <!-- resp_tipo_range: {{resp_tipo_range}} <br><br>
        resp_tipo_radio: {{resp_tipo_radio}} <br><br>
        resp_tipo_text: {{resp_tipo_text}} <br><br> -->


        <!-- <vs-divider> {{respuestas_enviar}} </vs-divider> -->
    </div>
    <!-- fin responder preguntas -->


    <!-- SECCION TIEMPO, FINALIZAR -->
    <div class="vx-col sm:w-1/4 w-full">
    <vx-card>
        <div align="center">
            <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" style="max-width: 200px; border-radius: 5px;" class="mb-base">

            <vs-button color="dark" type="gradient" class="mb-base" @click="openConfirmEnviar">Enviar encuesta</vs-button>

            <br>

            <vs-button color="success" type="border" class="mb-base" @click="$router.go(-1)">Volver</vs-button>

        </div>
    </vx-card>
    </div>


</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            data_seminario: [],
            popupSeminario: false,
            secciones: [],
            current_preg: [],
            resp_tipo_range: {},
            resp_tipo_radio: {},
            resp_tipo_text: {},
            respuestas_enviar: [],
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.data_seminario = JSON.parse(localStorage.getItem('data_seminario'))
        this.getEncuestaSeminario()
    },
    methods: {
        getEncuestaSeminario() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'get_preguntas_seminario')
            .then(function (res) {
                me.secciones = res.data.items
                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        paginacion(index, tam, seccion){
            let me = this;
            console.log()
            for( let i=1; i<=tam; i++ ){
                $('#'+seccion+'_P'+i).css('display', 'none')
            }
            $('#'+seccion+'_P'+me.current_preg[index]).css('display', 'block')
        },
        openConfirmEnviar(){
            this.$vs.dialog({
                type: 'confirm',
                color: 'primary',
                title: `Confirmar`,
                text: '¿Está seguro de enviar la encuesta?',
                accept: this.enviarEncuesta
            })
        },
        enviarEncuesta(){
            let me = this
            var respuestas_user = new Array();
            respuestas_user.push(me.resp_tipo_range);
            respuestas_user.push(me.resp_tipo_radio);
            respuestas_user.push(me.resp_tipo_text);

            me.respuestas_enviar = JSON.stringify(respuestas_user)

            const bodyFormData = new FormData();
            bodyFormData.append('respuestas', me.respuestas_enviar);
            bodyFormData.append('id_usuario', me.usuario.idusuario);
            bodyFormData.append('id_seminario', me.data_seminario.id_seminario);

            me.$vs.loading()
            this.$http.post(this.$server_url+'save_encuesta', bodyFormData)
            .then(function (res) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Encuesta registrada correctamente. Ya puede descargar su certificado.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })

                setTimeout(function(){ 
                    this.$router.pus('/docente/seminarios')
                }, 2000);
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })

        }
    },
}
</script>