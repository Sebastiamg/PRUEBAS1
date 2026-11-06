<template>
    <div>
        <vs-table max-items="10" search pagination :data="arrayComparativoPaquetes">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arrayComparativoPaquetes.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Paquete</vs-th>
                <vs-th>Cantidad de códigos</vs-th>
                <vs-th>Cantidad devuelta</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].paquete}}<br>
                    </vs-td>
                    <vs-td>{{ tr.cantidadCodigos }}</vs-td>
                    <vs-td>{{ tr.devueltos }}</vs-td>
                    <vs-td>
                        <!--mostrar los codigos-->
                        <vs-button color="#af7ac5" class="mb-2" @click="ObjectSelected = data[indextr];f_mostrarCodigos(tr)" >Mostrar códigos</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup classContent="popup-example" title="Mostrar códigos" :active.sync="popupMostrarCodigos">
            <div v-if="popupMostrarCodigos"> 
                <TableReutilizableVue
                :title="'Códigos del paquete'  + ObjectSelected.paquete"
                :headers="['Código','Estado','Documento Devolución']"
                :fieldKeys="['codigo','devuelto','documento_devolucion']"
                :tableData="arrayCodigos"
                />
            </div>
        </vs-popup> 
    </div>
</template>
<script>
const TableReutilizableVue        = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    components:{
        TableReutilizableVue
    },
    data(){
        return{
            popupMostrarCodigos:false,
            arrayCodigos:[],
            ObjectSelected:{},
        }
    },
    props:{
        arrayComparativoPaquetes:{
            type:Array,
            required:true
        },
        tipoLetra:{
            type:String,
            default:'Paquete'
        }
    },
    methods:{
        f_mostrarCodigos(tr){
            this.arrayCodigos           = tr.codigos
            this.popupMostrarCodigos    = true
            //del arrayCodigos si tiene el estado_liquidacion = 3 colocar propiedad devuelto='devuelto'
            this.arrayCodigos.forEach(codigo => {
                if(codigo.estado_liquidacion == 3){
                    codigo.devuelto = 'devuelto'
                }else{
                    codigo.devuelto = 'Sin devolver'
                }
            })
        }
    },
}
</script>