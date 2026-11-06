<template>
    <div>
        <div>
            <p v-if="estadoHistorico == 4">Fecha de solicitud recibida</p>
            <p v-if="estadoHistorico == 5">Fecha de subida de cheque sin firmar</p>
            <p v-if="estadoHistorico == 6">Fecha de subida de cheque firmado</p>
            <flat-pickr :config="configdateTimePicker" v-model="fromDate"  placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
        </div>
        <vs-divider></vs-divider>
        <div v-if="estadoHistorico != 4">
            <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                <div class=" box upload-container"> 
                    <input type="file" name="file1" id="file1" v-on:change="uploadFiles()" />
                </div>
                <br>
            </div>
            <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                <div class="flex" style="justify-content: center;"> 
                    <div class="flex" style="flex-direction: column;">
                        <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/pedidos/pagare/'+imgOld" style="border-radius: 5px;margin: 0 auto;">
                        <small class="mt-1 ml-2">{{ imgOld }}</small>
                    </div>
                    <vs-button radius type="line" @click="ifSaveImagen = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div>
            <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;"> 
                    <div class="flex" style="flex-direction: column;">
                        <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                        <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                        <small class="mt-1 ml-2">{{ tr.name }}</small>
                    </div>
                    <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div>
        </div>
        <div class="flex" style="justify-content: center;">
            <vs-button color="success" v-if="estadoHistorico == 4" @click="subirDocumento()" class="mt-2" type="gradient">Guardar</vs-button>
            <vs-button color="success" v-else @click="subirDocumento()" class="mt-2" type="gradient">Subir evidencia</vs-button>
        </div>
    </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import axios from 'axios'
import moment from 'moment'
	export default{
        components:{
            'v-select': vSelect,
            flatPickr,
        },
        data(){
            return{
                attachmentArray:[],
                tipoFile:'',
                ifSaveImagen:false,
                fromDate:null,
                configdateTimePicker: {
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i:s'
                },
            }
        },
        props:{
            id_pedido:{
                type:Number,
                default:0,
            },
            campo_fecha:{
                type:String,
                default:'fecha_subir_cheque',
            },
            estadoHistorico:{
                type:Number,
                default:0
            },
            tipoDocumento:{
                type:String,
                default:'',
            },
            campo_file:{
                type:String,
                default:'evidencia_cheque',
            },
            imgOld:{
                type:String,
                default:'',
            }
        },
        watch:{
            imgOld(results){
                let me = this
                me.attachmentArray = []
                setTimeout(function() {
                    if(me.imgOld){
                        me.ifSaveImagen = true
                    }
                }, 1000); 
            }
        },
        mounted(){
            let me = this;
            me.attachmentArray = []
            me.fromDate = new Date();
        },
        methods:{
            removeItemFromArr (arr, item) {
                document.getElementById("file1").value = '';
                const i = arr.indexOf(item)
                arr.splice(i, 1)
            },
            uploadFiles(){
                let me = this;
                me.attachmentArray = []
                var archivo = document.getElementById("file1").files[0];
                me.tipoFile  = ""
                if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile = "img"
                else me.tipoFile = "other"
                var reader = new FileReader();
                if (me) {
                    reader.readAsDataURL(archivo );
                    reader.onloadend = function () {
                        var cal = new Object();
                        cal.file = archivo
                        cal.img  = reader.result
                        cal.tipo = me.tipoFile
                        cal.name = archivo.name
                        me.attachmentArray.push(cal)
                        //document.getElementById("img"+img).src = reader.result;
                    }
                }
            },
            subirDocumento(){
                let me = this;
                if(me.fromDate == null || me.fromDate == undefined || me.fromDate == ""){
                    me.$vs.notify({
                        text: "Seleccione una fecha por favor",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                //estadoHistorico  4 = recibidas;
                if(me.ifSaveImagen == false && me.estadoHistorico != 4){
                    if(me.attachmentArray.length == 0){
                        me.$vs.notify({
                            text: "Suba un una imagen del "+me.tipoDocumento +" por favor",
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                }
                if(me.tipoFile == 'other'){
                    me.$vs.notify({
                        text: "Solo puede subir imagenes png, jpg por favor",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                //files
                let imgsEnviar = []
                let formData = new FormData();
                if(me.estadoHistorico == 4){
                    formData.append('recibido',  'yes')
                }
                if(me.ifSaveImagen){
                    formData.append('NoCambios','yes')
                }else{
                    me.attachmentArray.forEach(element => {
                    imgsEnviar.push(element.file)
                    });
                    for(let i=0; i<this.attachmentArray.length;i++){
                        formData.append('archivos[]',              imgsEnviar[i]);
                    }    
                }
                formData.append('contabilidad',  'yes')
                formData.append('fromDateConta', me.fromDate)
                formData.append('campo_fecha',   me.campo_fecha)
                formData.append('campo_file',    me.campo_file)
                formData.append('id_pedido',     me.id_pedido)
                formData.append('estado',        me.estadoHistorico)
                formData.append('tipoDocumento', me.tipoDocumento)
                formData.append('imgOld',        me.imgOld)
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                me.$vs.loading()
                axios.post(this.$data_url + 'api/changeEstadoHistoricoPedido', formData, config)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:"Se guardo correctamente",
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    if(me.estadoHistorico != 4){
                        document.getElementById("file1").value = '';
                    }
                    me.attachmentArray                     = []
                    me.$emit('changeUpdate',true)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
        }
    }
		

</script>
<style scoped>
   .box-input{
   }
    .upload-container{
      position:relative}
      .upload-container input{
        border:1px solid #92b0b3;
        background:#217bc5;
        outline:2px dashed #92b0b3;
        outline-offset:-10px;
        padding:100px 0px 100px 130px;
        width:100%;
        color:white;
    }
      .upload-container input:hover{
        background:#2c78cf}
      .upload-container:before{
        position:absolute;
        bottom:50px;
        left:23%;
        content:" Seleccione un archivo o arrastre aqui ";
        color:#f1f9fa;
        font-weight:900
    }
      .upload-btn{
        margin-left:300px;
        padding:7px 20px}
</style>