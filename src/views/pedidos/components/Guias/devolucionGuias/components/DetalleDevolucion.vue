<template>
    <div>
        <div class="flex flex-wrap items-center gap-3 mb-4">
            <vs-chip color="primary">Cantidad: <b> {{ arregloDetalle.length }}</b></vs-chip>
            <vs-button @click="exportarExcel" color="success" type="filled" icon="file_download">Exportar Excel</vs-button>
        </div>

        <vs-table max-items="10" stripe search pagination :data="arregloDetalle">
                <template slot="thead">
                    <vs-th>Libro</vs-th>
                    <vs-th>Cantidad devuelta</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                          <b>Libro:</b>
                          <p>{{ tr.nombrelibro }}</p>
                          <b>Código:</b>
                          <p>{{ tr.pro_codigo }}</p>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cantidad_devuelta + tr.cantidad_devuelta_codigoslibros}}<br>
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

        }
    },
    props:{
        arregloDetalle:{
            type:Array,
            default:[]
        },
    },
    methods:{
        exportarExcel(){
            let me = this;
            if(me.arregloDetalle.length == 0){
                me.$vs.notify({
                    text:'No hay datos para exportar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-alert-circle'
                })
                return
            }

            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['Código', 'Libro', 'Cantidad Devuelta']
                const filterVal = ['pro_codigo', 'nombrelibro', 'cantidad_total']
                const list = me.arregloDetalle.map(item => ({
                    ...item,
                    cantidad_total: item.cantidad_devuelta + item.cantidad_devuelta_codigoslibros
                }))
                const data = me.formatJson(filterVal, list)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'Detalle_Devolución_' + new Date().getTime(),
                    autoWidth: true,
                    bookType: 'xlsx'
                })
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
    }
}
</script>
