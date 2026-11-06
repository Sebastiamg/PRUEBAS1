<template>
    <div>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <p class="font-bold text-success font-bold mt-5">RESUMEN DE LOS LIBROS SELECCIONADOS EN EL PEDIDO LIBROS HIJOS DOCENTES ID #{{ librosObsequios.id }}</p>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <b class="text-danger">Porcentaje de descuento {{ porcentaje_descuento}}%</b>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-table max-items="20" search pagination :data="arregloLibros">
            <template slot="header">
              <span>Cantidad: {{ arregloLibros.length }}</span>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Cant. unidades</vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr v-for="(item, index) in data" :key="index">
                    <vs-td>
                      {{ item.pro_nombre }}<br>
                    </vs-td>
                    <vs-td>
                        {{ item.p_libros_cantidad }}<br>
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
            arregloLibros:[],
            porcentaje_descuento:''
        }
    },
    props:{
        librosObsequios:{
            type:Object,
            default:{},
        }
    },
    mounted(){
        let me = this;
        me.getLibros()
    },
    methods:{
        getLibros(){
            let me = this
            this.$vs.loading();
            this.$http.get(this.$server_url+'obtenerDatosDetalleLibros/'+me.librosObsequios.id)
            .then(res => {
                let datos = res.data
                me.arregloLibros = datos
                me.porcentaje_descuento = me.arregloLibros[0].porcentaje_descuento
                this.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
    }
}
</script>