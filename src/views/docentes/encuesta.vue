<template>
<div class="vx-row w-full p-6">

    <!------BARRA SUPERIOR-------->
    <div class="vx-col sm:w-3/4 w-full" style="font-size: 18px;">
        <vx-card title-color="primary">
            <div class="vx-row">
                <div class="vx-col w-full" align="justify" v-if="data_seminario">

                    <div class="w-full text-center mb-6">
                        <b><h4 style="color: #3C87FE;">Encuesta de satisfacción sobre la capacitación</h4></b>
                    </div>

                    <div class="w-full text-justify">
                        
                        <b>Fecha: </b> {{fechaLarga(data_seminario.fecha_fin)}}<br>
                        <b>Seminario: </b> <span> {{data_seminario.descripcion}} </span><br><br>
                        
                        Estimado docente, la editorial Prolipa desea conocer el nivel de satisfacción de la capacitación recibida. Lo invitamos a completar esta encuesta, para luego descargar el certificado digital. <br><br>

                        Califique del 1 al 5 los siguientes aspectos acerca del desempeño del capacitador, siendo 1 completamente en desacuerdo y 5 completamente de acuerdo.
                    </div>



                </div>
            </div>
        </vx-card>

        <!-------INICIO SECCION RESPONDER---------->
        <vx-card class="mt-5 mb-6">
            
            <div v-for="(itemP, indexP) in preguntas" :key="indexP" class="w-full mb-2">
                <div :id="'content_preg'+(indexP+1)" class="w-full pt-3 px-6" style="vertical-align: top;">
                    <div class="mt-2" style="font-size: 17px; min-height: 50px;" align="justify"> 
                        <b> {{indexP+1}}) {{itemP.nombre_pregunta}}</b> 
                    </div>

                    <span></span>

                    <div v-if="itemP.tipo_pregunta == 1 || itemP.tipo_pregunta == 2" class="mb-base w-full" style="font-size: 15px;" align="center">
                        <!-- <vs-slider :min="1" :max="5" color="rgb(45, 208, 129)" v-model="resp_tipo_range[itemP.id_pregunta]"/> -->
                        <!-- <vs-radio v-for="(itemO, indexO) in 5" :key="indexO" v-model="resp_tipo_radio[itemP.id_pregunta]" :vs-value="indexO+1" class="m-6"> {{indexO+1}} </vs-radio> -->

                        <div v-for="(itemO, indexO) in 5" :key="indexO" style="width: 80px; display: inline-block;">
                            <input type="radio" :id="itemP.id_pregunta+'_'+indexO" :name="'preg_'+itemP.id_pregunta" v-model="resp_tipo_radio[itemP.id_pregunta]" :value="indexO+1" style="width: 20px; height: 20px;">
                            <label :for="itemP.id_pregunta+'_'+indexO" style="font-size: 18px;"> {{indexO+1}} </label>
                        </div>
                    </div>

                    <div v-if="itemP.tipo_pregunta == 4" class="mb-base w-full" style="font-size: 15px;" align="center">

                        <!-- <vs-radio v-for="(itemO, indexO) in opciones_sn" :key="indexO" v-model="resp_tipo_radio[itemP.id_pregunta]" :vs-value="opciones_sn[indexO]" class="m-6"> {{opciones_sn[indexO]}} </vs-radio> -->

                        <div v-for="(itemO, indexO) in opciones_sn" :key="indexO" style="width: 80px; display: inline-block;">
                            <input type="radio" :id="itemP.id_pregunta+'_'+indexO" :name="'preg_'+itemP.id_pregunta" v-model="resp_tipo_radio[itemP.id_pregunta]" :value="opciones_sn[indexO]" style="width: 20px; height: 20px;">
                            <label :for="itemP.id_pregunta+'_'+indexO" style="font-size: 18px;"> {{opciones_sn[indexO]}} </label>
                        </div>

                    </div>

                    <div v-if="itemP.tipo_pregunta == 3" class="mb-base w-full" style="font-size: 15px;" align="center">
                        <vs-textarea v-model="resp_tipo_text[itemP.id_pregunta]" />
                    </div>

                    <vs-divider v-if="ver_todo==true"></vs-divider>
                </div>
            </div>

            <vs-pagination :total="preguntas.length" v-model="current_preg" @input="paginacion()"></vs-pagination>

            <!-- resp_tipo_radio: {{resp_tipo_radio}} -->

        </vx-card>


        <vx-card class="w-full">
            Agradecemos sus valiosos comentarios. Para cualquier duda, por favor póngase en contacto con nuestro servicio de atención al cliente: <span style="color: #3C87FE;">soporte@prolipa.com.ec</span>
        </vx-card>

    </div>
    <!-- fin responder preguntas -->


    <!-- SECCION TIEMPO, FINALIZAR -->
    <div class="vx-col sm:w-1/4 w-full">
    <vx-card>
        <div align="center">
            
            <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" style="max-width: 200px; border-radius: 5px;" class="mb-base"><br>

            <vs-button color="dark" type="gradient" class="mb-base" style="width: 180px;" @click="openConfirmEnviar">Enviar encuesta</vs-button><br>

            <vs-button color="warning" type="border" class="mb-base" style="width: 180px;" @click="todasPreguntas()">Ver todo</vs-button> <br>

            <vs-button color="success" type="border" class="mb-base" style="width: 180px;" @click="$router.go(-1)">Volver</vs-button>

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
            preguntas: [],
            current_preg: 1,
            resp_tipo_range: {},
            resp_tipo_radio: {},
            opciones_sn: ['SI', 'NO'],
            resp_tipo_text: {},
            respuestas_enviar: [],
            usuario: [],
            ver_todo: false,
            revision_activa: false
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
                me.preguntas = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        paginacion(){
            let me = this;
            me.ver_todo = false
            for( let i=1; i<=me.preguntas.length; i++ ){
                $('#content_preg'+i).css('display', 'none')
            }
            $('#content_preg'+me.current_preg).css('display', 'block')
        },
        todasPreguntas(){
            let me = this;
            me.ver_todo = true
            for( let i=1; i<=me.preguntas.length; i++ ){
                $('#content_preg'+i).css('display', 'block')
            }
        },
        openConfirmEnviar(){
            let me = this

            let cant_resp = 0
            $.each(me.resp_tipo_radio,function(key, value){
                cant_resp++
            });
            $.each(me.resp_tipo_text,function(key, value){
                cant_resp++
            });

                console.log("preguntas",me.preguntas)
            console.log("catnpreguntas",me.cant_resp)
           

            if( me.preguntas.length != cant_resp ){
                me.$vs.notify({
                    text: 'Por favor responda todas las preguntas antes de finalizar la encuesta.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-warning'
                })

            }else{
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirmar`,
                    text: '¿Está seguro de enviar la encuesta?',
                    accept: this.enviarEncuesta
                })
            }

        },
        enviarEncuesta(){
            let me = this
            var respuestas_user = new Array();
            // respuestas_user.push(me.resp_tipo_range);
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
                    me.$router.push('/docente/seminarios')
                }, 1000);
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        cargar(index){
            let me = this
            alert(me.resp_tipo_radio[index])
        }
    },
}
</script>


<style>
</style>