<template>
    <div>
        <vs-divider>Anticipo aprobado</vs-divider>
        <div class="flex"  style="width: 100%;flex-wrap: wrap;">
            <div style="width: 30%;" class="uno">
                <p class="font-bold mt-2">Anticipo aprobado</p>
                <vs-input type="number" :disabled="disableFacturador" v-model="pedido.anticipo_aprobado" class="mt-1" style="width: 90%;" />
                <small v-if="tmpPedidos.ifagregado_anticipo_aprobado == 0">Anticipo aprobado no asignado</small>
                <small v-if="tmpPedidos.ifagregado_anticipo_aprobado == 1">Anticipo aprobado por facturador</small>
                <small v-if="tmpPedidos.ifagregado_anticipo_aprobado == 2" class="font-bold">!Anticipo solicitado a gerencia ${{ tmpPedidos.anticipo_solicitud_for_gerencia }}</small>
                <small v-if="tmpPedidos.ifagregado_anticipo_aprobado == 3"><b>ANTICIPO APROBADO POR GERENCIA <span class="text-success">$ {{ tmpPedidos.anticipo_aprobado_gerencia }}</span></b></small>
                <small v-if="tmpPedidos.ifagregado_anticipo_aprobado == 4" class="text-danger">Anticipo solicitado: rechazado</small>
                <small v-if="tmpPedidos.ifagregado_anticipo_aprobado == 5" class="text-success">Gerencia aprueba anticipo sugerido</small>
            </div>
            <div style="width: 40%;" class="dos"  v-if="disableAsesor">
                <!-- Upload  -->
                <div class="borde-unidad p-3">
                    <div style="font-size: 12px;" class="mb-2 mt-2">Archivo de evidencia de gerencia: </div>
                    <div class="m-1" v-if="getfileGerencia.length > 0">
                        <div class="m-1">
                            <p><b>Archivo actual:</b></p>
                            <p>{{ tmpFiles[0].archivo }}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(getfileGerencia[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                    <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(getfileGerencia[0])"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                    <div v-else>
                        <input  type="file" id="file1" ref="file1" v-on:change="cargarArchivo()" />
                        <div class="v-row text-left" v-if="porcentaje1>0">
                            <vs-progress style="height:25px" class="mt-2" :percent="porcentaje1" color="success">  {{porcentaje1}}%  </vs-progress>
                        </div>
                        <small class="text-danger" v-if="msjD1 != '' "> {{msjD1}} <br></small>
                        <small class="text-danger" v-if="msjD2 != '' "> {{msjD2}} <br></small>
                        <br>
                        <small>Tamaño máximo: {{limiteMegas}}mb.</small>
                    </div>
                </div>
            </div>
            <div style="width: 30%;" class="tres" v-if="disableAsesor">
                <div class="flex mt-5" style="flex-wrap: wrap;">
                    <div>
                    <vs-button  color="dark" class="p-2" v-if="usuario.id_group == 23 || userRoot" @click="guardarAnticipo()" icon="save" type="gradient">Guardar</vs-button>
                    </div>
                    <vx-tooltip style="display: inline-block;" text="Si el anticipo pedido por asesor es muy alto enviar a gerencia" position="top" color="primary">
                    <vs-button color="warning" v-if="usuario.id_group == 23 || userRoot" class="ml-2 p-2 boton2" icon-pack="feather" type="filled" @click="popupSolicitudAnticipo = true;" icon="icon-user-check">Enviar a gerencia</vs-button>
                    </vx-tooltip>
                </div>
            </div>
        </div>
        <vs-divider></vs-divider>
        <!--MODALES-->
        <!--POPUP PARA ENVIAR A GERENCIA LA SOLICITUD DE MAS ANTICIPO-->
        <vs-popup class="holamundo" title="Solicitud para aprobación de mayor anticipo" :active.sync="popupSolicitudAnticipo">
            <div class="vx-row mb-6">
                <div class="vx-col w-full">
                <vs-input class="w-full" icon-pack="feather" icon="icon-dollar-sign" icon-no-border label="Valor del anticipo solicitado" v-model="solicitud.valor" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col w-full">
                <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Observación(Opcional)" v-model="solicitud.observacion" />
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col w-full">
                <vs-button class="mr-3 mb-2" @click="solicitarAnticipo()">Solicitar</vs-button>
                <vs-button color="warning" @click="popupSolicitudAnticipo = false;" type="border" class="mb-2">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>
    </div>
</template>
<script>
import axios from "axios";
export default{
    data(){
        return{
            usuario:[],
            disableFacturador:false,
            disableAsesor:false,
            pedido:{
                anticipo_aprobado:''
            },
            //Variables para mas anticipo
            popupSolicitudAnticipo:false,
            solicitud:{
                id:0,
                valor:0,
                observacion:'',
                estado:0,
            },
            //fin variables para mas anticipo
            getfileGerencia:[],
            porcentaje1: 0,
            limiteMegas: 2, //permitir maximo de megas
            bytes: 2048576, //para calculo de megas
            pesoArchivo1: 0,
            muyPesado1: false,
            msjD1:'',
            msjD2:'',
            mensajePeso: 'El archivo que intenta cargar excede el peso permitido, favor verifique para continuar.',
            mensajeArchivo: 'El tipo de archivo que intenta enviar, no esta permitido, favor verifique',
            file_eliminar: '',
            userRoot:false,
        }
    },
    props:{
        tmpPedidos:{
            type:Object,
            default:{}
        },
        tmpFiles:{
            type:Array,
            default:[],
        }
    },
    watch:{
        tmpFiles(results){
            let me = this
            //file evidencia gerencia
            if(me.tmpFiles.length > 0){
                let datos = me.tmpFiles
                me.getfileGerencia = datos.filter(p => p.tipo == 3)
            }
        }
    },
    created(){
       // valorAprobado
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this
        me.solicitud.valor       =  me.tmpPedidos.anticipo_solicitud_for_gerencia
        me.solicitud.observacion =  me.tmpPedidos.anticipo_solicitud_observacion
        me.pedido.anticipo_aprobado = me.tmpPedidos.anticipo_aprobado
        if(this.usuario.id_group == 11 || this.usuario.id_group == 22){
            this.disableAsesor = false
            this.disableFacturador = true
        }else{
            this.disableAsesor = true
            this.disableFacturador = false
        }
        //file evidencia gerencia
        if(me.tmpFiles.length > 0){
            let datos = me.tmpFiles
            me.getfileGerencia = datos.filter(p => p.tipo == 3)
        }
        me.getUserRoot(me.usuario);
    },
    methods:{
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
            .then((result) => {
                if (result.data.length > 0) {
                me.userRoot = true;
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        guardarAnticipo(){
            let me  = this;
            var datos = {}
            if(me.tmpPedidos.contrato_generado == null || me.tmpPedidos.contrato_generado == "" || me.tmpPedidos.contrato_generado == "null" || me.tmpPedidos.contrato_generado == undefined || me.tmpPedidos.contrato_generado == 0){
                datos = {
                    tipo:'guardarAnticipo',
                    value: me.pedido.anticipo_aprobado,
                    modificarAnticipoAprobado:1,
                }
            }else{
                datos = {
                    tipo:'guardarAnticipoContrato',
                    value: me.pedido.anticipo_aprobado,
                    modificarAnticipoAprobado:1,
                }
            }
            me.$emit('chAnticipoAprobado',datos)
        },
        //METODOS PARA SOLICITIAR ANTICIPO
        solicitarAnticipo(){
            let me = this;
            if(me.tmpPedidos.estado == 2){
              me.$vs.notify({
                  color: 'warning',
                  title: 'Mensaje',
                  text: 'No se puede modificar el pedido anulado',
                  time:5000,
                  })
              return false
            }
            if(me.tmpPedidos.historicoEstado > 1){
              if(me.usuario.id_group == 23 || userRoot){

              }else{
                me.$vs.notify({
                text:'El pedido ya tiene contrato no puede ser editado',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
              }
            }
            if(me.solicitud.valor < 50){
              me.$vs.notify({
              text:'El valor no puede ser menor a 50',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return
            }
            let formData = new FormData();
            formData.append('id_pedido',           me.tmpPedidos.id_pedido);
            formData.append('anticipo_solicitado', me.solicitud.valor)
            formData.append('observacion',         me.solicitud.observacion)
            formData.append('estado',              2);
            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarSolicitudAnticipo', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                me.popupSolicitudAnticipo = false
                let datos = {
                    tipo:'guardar'
                }
                me.guardarPedido()
            })
        },
        guardarPedido(){
            let me = this
            let datos = {
                tipo:'guardar'
            }
            me.$emit('chAnticipoAprobado',datos)
        },
        cargarArchivo(){
            let me = this
            this.no_permitidoD = false;
            this.msjD1 = '';
            this.msjD2 = '';
            this.porcentaje1 = 0;
            this.pesoArchivo1 = 0;
            this.muyPesado1 = false;
            this.file1 = this.$refs.file1.files[0];
            // verificar tamaño de archivo
            this.pesoArchivo1 = (this.file1.size / this.bytes).toFixed(2);
            if (this.pesoArchivo1 > this.limiteMegas) {
                this.muyPesado1 = true;
                this.msjD1 = this.mensajePeso;
            }
            if (this.file1.type == 'application/x-msdownload') {
                this.no_permitidoD = true;
                this.msjD2 = this.mensajeArchivo;
            }
            me.subirArchivoEvidenciaGerencia()
        },
        subirArchivoEvidenciaGerencia() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file1);
            if (me.file1 != '') {
                me.$vs.loading()
                this.$http.post(this.$server_url+'upload/file', formData,{
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo1 > 0) {
                                me.porcentaje1 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.$vs.notify({
                            text: 'Archivo de evidencia de anticipo cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.uploadArchivo();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para el docente')
                        me.uploadArchivo();
                        me.$vs.loading.close()
                    })
            } else {
                me.uploadArchivo();
            }
        },
        uploadArchivo(){
            let me = this;
            let formData = new FormData();
            //FILES
            formData.append('fileEvidenciaGerente',    me.file1);
            formData.append('tipo',                    3);
            formData.append('id_pedido',               me.tmpPedidos.id_pedido);
            formData.append('user_created',            me.usuario.idusuario);
            axios.post(this.$data_url+'api/guardarFilePedido',formData)
                .then(function (res) {
                    me.guardarPedido()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error al guardar el archivo de evidencia ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        descargaArchivo(item) {
            let url2 = this.$data_url+'archivos/pedidos/img/aprobados/'+item.url
            window.open(url2)
        },
        openConfirmEliminar(item, tipo_elim) {
            let me = this;
            me.file_eliminar = item
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Este archivo será eliminado, para cargar el nuevo archivo.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarArchivo
            })
        },
        eliminarArchivo() {
            let me = this;
            // console.log(me.archivo)
            me.$vs.loading()
            axios.get(this.$data_url+'api/pedidos/file/eliminar?id='+me.file_eliminar.id)
                .then(function (res) {
                    me.porcentaje1 = 0;
                    me.pesoArchivo1 = 0;
                    me.getfileGerencia =''
                    me.file1 = '';
                    window.$("#file1").val('');
                    me.$vs.notify({
                        text: 'Archivo eliminado correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                    me.guardarPedido()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'No se eliminó el archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
        },
    }
}
</script>
<style scoped>
/*ESTILOS DE UPLOAD*/
.borde-unidad {
    width: 95%;
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
/**REPONSIVE */
@media(max-width: 912px) {
    .boton2{
        margin-top: 10px;
    }
}
@media(max-width: 820px) {
    .boton2{
        margin-top: 10px;
    }
}
@media(max-width: 768px) {
    .uno, .dos, .tres{
      width: 100%!important;

    }
    .boton2{
        margin-top: 0px;
    }
}
@media(max-width: 700px) {
    .uno, .dos, .tres{
      width: 100%!important;

    }
}
@media(max-width: 540px) {
    .uno, .dos, .tres{
      width: 100%!important;

    }
}
@media(max-width: 414px) {
    .uno, .dos, .tres{
      width: 100%!important;
    }
    .boton2{
        margin-top: 10px;
    }
}
@media(max-width: 375px) {
    .uno, .dos, .tres{
      width: 100%!important;

    }
    .boton2{
        margin-top: 10px;
    }
}
@media(max-width: 360px) {
    .uno, .dos, .tres{
      width: 100%!important;

    }
}

/* FIN ESTILOS DE UPLOAD */
</style>
