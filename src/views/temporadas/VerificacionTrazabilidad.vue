<template>
    <div>
        <vs-table max-items="10" search pagination :data="arregloTrazabilidad">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloTrazabilidad.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Datos</vs-th>
                <vs-th>Fecha solicitud verificación</vs-th>
                <vs-th>Fecha realiza verificación</vs-th>
                <vs-th>Fecha sube evidencia</vs-th>
                <vs-th>Estado</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Contrato</b>
                        <p>{{ tr.contrato }}</p>
                        <b>Institución</b>
                        <p>{{ tr.nombreInstitucion }}</p>
                        <b>Ciudad</b>
                        <p>{{ tr.ciudad }}</p>
                        <b>Asesor</b>
                        <p>{{ tr.asesor }}</p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].fecha_solicita_verificacion}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].fecha_realiza_verificacion}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].fecha_subir_evidencia}}
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="warning">Asesor solicita</vs-chip>
                        <vs-chip v-if="tr.estado == 2" color="success">Verificación Realizada </vs-chip>
                        <vs-chip v-if="tr.estado == 3" color="primary">Facturador subío evidencia </vs-chip>
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
            arregloTrazabilidad:[],
        }
    },
    props:{
        contratoPedido:{
            type:String,
            default:'',
        },
    },
    mounted(){
        let me = this;
        me.getTrazabilidad()
    },
    methods:{
        getTrazabilidad(){
            let me = this
            this.$http.get(this.$server_url+'getTrazabilidadVerificacion?contrato='+me.contratoPedido)
            .then(res => {
                me.arregloTrazabilidad = res.data
            })
        }
    }
}
</script>