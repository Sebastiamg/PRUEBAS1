<template>
    <div>
        <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
            <div class=" box upload-container"> 
                <input type="file" name="file7" id="file7" class="file7" v-on:change="uploadFiles" />
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
        <div class="flex" style="margin-top: -10px;">
            <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;"> 
                <div class="flex" style="flex-direction: column;">
                    <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                    <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                    <small class="mt-1 ml-2">{{ tr.name }}</small>
                </div>
                <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
            </div>
        </div>
        <div class="flex" style="justify-content: center;">
            <vs-button color="success" @click="subirDocumento()" class="mt-2" type="gradient">{{ titlebtn }}</vs-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
	export default{
        data(){
            return{
                attachmentArray:[],
                tipoFile:'',
                ifSaveImagen:false,
            }
        },
        props:{
            pedido:{
                type:Object,
                default:{},
            },
            titlebtn:{
                type:String,
                default:'',
            },
            campo_fecha:{
                type:String,
                default:'fecha_subir_cheque',
            },
            estado:{
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
            },
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
        },
        methods:{
            removeItemFromArr (arr, item) {
                let me = this;
                const i = arr.indexOf(item)
                arr.splice(i, 1)
                document.getElementById("fileAutoriza").value = ''
            },
            uploadFiles(e){
                let me = this;
                me.attachmentArray = []
                // var archivo = document.getElementById("fileAutoriza").files[0];
                me.tipoFile  = ""
                var archivo = e.target.files[0];
                if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg"){
                    me.tipoFile = "img"
                } 
                else{
                    me.tipoFile = "other"
                }
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
                    }
                }
            },
            subirDocumento(){
                let me = this;
                if(me.ifSaveImagen == false){
                    if(me.attachmentArray.length == 0){
                        me.$vs.notify({
                            text: "Suba un una imagen de "+me.tipoDocumento +" por favor",
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                }
                // if(me.tipoFile == 'other'){
                //     me.$vs.notify({
                //         text: "Solo puede subir imagenes png, jpg o pdf por favor",
                //         color: 'warning',
                //         iconPack: 'feather',
                //         icon: 'icon-alert-triangle'
                //     })
                //     return
                // }
                //files
                let imgsEnviar = []
                let formData = new FormData();
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
                formData.append('campo_fecha',   me.campo_fecha)
                formData.append('campo_file',    me.campo_file)
                formData.append('id_pedido',     me.pedido.id)
                formData.append('estado',        me.estado)
                formData.append('tipoDocumento', me.tipoDocumento)
                formData.append('imgOld',        me.imgOld)
                const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                me.$vs.loading()
                axios.post(this.$data_url + 'api/changeEstadoObsequio', formData, config)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:"Se guardo correctamente",
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    me.$emit('recharge',true)
                    document.getElementById("fileAutoriza").value = '';
                    me.attachmentArray                     = []
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