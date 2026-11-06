<!-- <template>
    <div>
        <vs-alert active="true" class="mt-3">
            <p class="text-center font-bold">Aqui los contratos sera enviados a la api de milton</p>
        </vs-alert>
        <vs-table max-items="10" search pagination :data="arregloContratos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloContratos.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Contrato</vs-th>
                <vs-th>Responsable</vs-th>
                <vs-th>Datos</vs-th>
                <vs-th>Tipo</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                         {{data[indextr].ven_codigo}}<br>
                        Verificador:
                        <b>{{  tr.verificador }}</b><br>
                        Institucion:
                        <b>{{ tr.nombreInstitucion }}</b><br>
                        Ciudad:
                        <b>{{ tr.nombre_ciudad }}</b><br>
                        Codigo institucion milton:
                        <b> {{ tr.codigo_institucion_milton }}</b><br>
                        <small class="text-danger" v-if="tr.codigo_institucion_milton == '22507'">hay que cambiar el codigo(duplicado) </small>
                    </vs-td>
                    <vs-td>
                        Asesor:
                        {{ tr.asesor }}<br>
                        Cedula:
                        <small>{{ tr.cedula }}</small><br>
                        Iniciales:
                        <small>{{ tr.iniciales }}</small>
                    </vs-td>
                    <vs-td>
                        anticipo aprobado:
                        <b>{{ tr.anticipo_aprobado }}</b>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.tipo == 1" color="primary">Guia</vs-chip>
                        <vs-chip v-else color="warning">Contrato</vs-chip>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;">
                            <div>
                                <vx-tooltip style="display: inline-block;" text="Editar area" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="success" @click="guardarBdMitlon(tr)" type="filled" icon-pack="feather" icon="icon-edit">Guardar en bd </vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
export default{
    data(){
        return{
            arregloContratos:[],
        }
    },
    mounted(){
        let me = this;
        me.getContratos()
    },
    methods:{
        getContratos(){
            let me = this
            this.$http.get(this.$server_url+'getContratosPedidos')
            .then(function (res) {
                me.arregloContratos = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        guardarBdMitlon(tr){
            let me = this
            if(tr.enviarMilton == 1){
                me.$vs.notify({
                text:'El contrato ya se envio a la base de milton',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(tr.id_usuario_verif == 0 || tr.id_usuario_verif == null || tr.id_usuario_verif == ""){
                me.$vs.notify({
                text:'El contrato no tiene usuario verificador',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            let formData = new FormData();
            formData.append('id_pedido',                    tr.id_pedido);
            formData.append('iniciales',                    tr.iniciales)
            formData.append('tipo_venta',                   tr.tipo_venta)
            formData.append('total_venta',                  tr.total_venta)
            formData.append('anticipo_aprobado',            tr.anticipo_aprobado)
            formData.append('num_cuenta',                   tr.num_cuenta)
            formData.append('region_idregion',              tr.region_idregion)
            formData.append('descuento',                    tr.descuento)
            formData.append('observacion',                  tr.observacion)
            formData.append('codigo_institucion_milton',    tr.codigo_institucion_milton)
            formData.append('cedula',                       tr.cedula)
            formData.append('id_responsable',               tr.id_responsable)
            formData.append('id_institucion',               tr.id_institucion)
            formData.append('id_asesor',                    tr.id_asesor)
            formData.append('asesor',                       tr.asesor)
            formData.append('codigo_contrato',              tr.codigo_contrato)
            formData.append('id_periodo',                   tr.id_periodo)
            formData.append('nombre_ciudad',                tr.nombre_ciudad)
            formData.append('nombreInstitucion',            tr.nombreInstitucion)
            formData.append('id_pedido',                    tr.id_pedido)
            var ruta = ""
            if(tr.tipo == 1){
              ruta =this.$server_url+'guardarGuiasBDMilton2'
              formData.append('ven_codigo',                 tr.ven_codigo);
            }else{
              ruta =this.$server_url+'guardarContratoBdMilton'
              formData.append('contrato_generado',          tr.contrato_generado);
            }
            me.$vs.loading()
            this.$http.post(ruta, formData)
            .then(res => {
            me.getContratos();
            me.$vs.loading.close()
            if(res.data.status == 0){
                me.$vs.notify({
                text:res.data.message,
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
            }
            me.$vs.notify({
                text:'Se guardo correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
        }
    }
}
</script> -->
