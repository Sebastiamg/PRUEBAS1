<template>
    <vx-card>
        <div v-if="confirmContrato">
            <p class="font-bold text-warning text-2xl">Estas seguro de generar el contrato {{ sendPedido.contrato }} en el pedido #{{ pedido.id_pedido }}</p>
            <div class="flex mt-2">
                <vs-button color="primary" type="filled" @click="guardar()">Si, deseo guardar</vs-button>
                <vs-button color="warning" @click="confirmContrato = false;" class="ml-2" type="border">Cancelar</vs-button>
            </div>
        </div>
        <div v-else>  
            <vs-chip transparent color="success"  v-if="pedido.ifanticipo == 1">Pedido tiene anticipo</vs-chip>
            <vs-chip transparent color="warning"  v-else>Pedido no tiene anticipo</vs-chip>
            <br><br>
            <div class="flex">
                <vs-button type="line" v-if="mostrar == false" @click="getContratos();" size="small">Mostrar contratos</vs-button>
                <vs-checkbox v-if="mostrar" v-model="mostrar">Ocultar contratos</vs-checkbox>
            </div>
            <vs-table max-items="5" search pagination :data="arregloContratos" v-if="mostrar">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arregloContratos.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Contrato</vs-th>
                    <vs-th>Institución</vs-th>
                    <vs-th>Pedido #</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                        <b>Contrato:</b>
                        <p>{{ tr.contrato }}</p>
                        <b>Anticipo:</b>
                        <p>{{ tr.anticipo_aprobado }}</p>
                        </vs-td>
                        <vs-td>
                            <b>Institución:</b>
                            <p>{{ tr.insNombre }}</p>
                            <b>Ciudad:</b>
                            <p>{{ tr.ciuNombre }}</p>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.id_pedido > 0" color="success">Pedido # {{ tr.id_pedido }}</vs-chip>
                            <vs-chip v-else color="danger">No tiene pedido</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vs-button color="primary" @click="seleccionarContrato(tr)" type="filled">Asignar contrato</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>   
            <vs-divider>Información</vs-divider>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Contrato</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" v-model="sendPedido.contrato" />
                </div>
            </div>
            <div class="vx-row mb-6" v-if="pedido.ifanticipo == 1">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Fecha aprobación gerencia</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <flat-pickr class="w-full" :config="configdateTimePicker" v-model="sendPedido.fecha_Gerencia" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Fecha generación contrato</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <flat-pickr class="w-full" :config="configdateTimePicker" v-model="sendPedido.fechaContrato" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <vs-button class="mr-3 mb-2" @click="openConfirm()">Guardar contrato</vs-button>
            </div>
        </div>
           
    </vx-card>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default{
    data(){
        return{
            arregloContratos:[],
            sendPedido:{
                contrato:'',
                fechaContrato:null,
                fecha_Gerencia:null,
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:ss'
            },
            mostrar:false,
            confirmContrato:false,
        }
    },
    components:{
        flatPickr,
    },
    props:{
        pedido:{
            type:Object,
            default:{
            }
        }
    },
    methods:{
        getContratos() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporteVentaIndividual?periodo_id='+me.pedido.id_periodo+'&idusuario='+me.pedido.id_asesor)
                .then(function (res) {
                   me.$vs.loading.close()
                   me.arregloContratos = res.data.contratos
                   me.mostrar          = true
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        seleccionarContrato(tr){
            let me = this;
            if(tr.id_pedido > 0){
                me.$vs.notify({
                text:'No se puede seleccionar este contrato por que ya tiene pedido',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.mostrar                  = false;
            me.sendPedido.contrato      = tr.contrato
            me.sendPedido.fechaContrato = tr.venFecha
        },
        openConfirm(){
            let me = this;
            if(me.sendPedido.contrato.trim() == ""){
                me.$vs.notify({
                text:'El campo contrato no puede quedar vacio',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.sendPedido.contrato.length < 10){
                me.$vs.notify({
                text:'El contrato no puede ser menor a 10 caracteres',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.sendPedido.fechaContrato == "" || me.sendPedido.fechaContrato == null || me.sendPedido.fechaContrato == undefined){
                me.$vs.notify({
                text:'La fecha del contrato no puede quedar vacia',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            //fecha de aprobacion gerencia
            if(me.pedido.ifanticipo == 1){
                if(me.sendPedido.fecha_Gerencia == "" || me.sendPedido.fecha_Gerencia == null || me.sendPedido.fecha_Gerencia == undefined){
                    me.$vs.notify({
                    text:'La fecha de aprobación de gerencia no puede quedar vacia',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
            }
            me.confirmContrato = true;
        },
        guardar(){
            let me = this;
            let formData = new FormData();
            formData.append('id_pedido',        me.pedido.id_pedido);
            formData.append('contrato',         me.sendPedido.contrato);
            formData.append('fechaContrato',    me.sendPedido.fechaContrato);
            formData.append('fecha_Gerencia',   me.sendPedido.fecha_Gerencia);
            formData.append('periodo_id',       me.pedido.id_periodo);
            formData.append('ciudad',           me.pedido.nombre_ciudad)
            formData.append('asesor_id',        me.pedido.id_asesor)
            me.$vs.loading()
            this.$http.post(this.$server_url+'generarContratoFacturacion', formData)
            .then(res => {
            me.$vs.loading.close()
            me.confirmContrato = false;
            if(res.data.status == 0){
                me.$vs.notify({
                text:res.data.message,
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$emit('changeContratoManual',true)
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
        },
        limpiar(){
            let me = this;
            me.sendPedido.contrato          = ""
            me.sendPedido.fechaContrato     = null
            me.sendPedido.fecha_Gerencia    = null
        }
    }

}
</script>