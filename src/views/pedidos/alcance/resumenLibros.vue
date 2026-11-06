<template>
    <div>
        <p class="font-bold text-success font-bold mt-5">RESUMEN DE LOS LIBROS SELECCIONADOS EN EL ALCANCE ID #{{ alcance.id }}</p>
        <vs-table max-items="20" search pagination :data="arregloLibros">
            <template slot="header">
              <span>Cantidad: {{arregloLibros.length}}</span>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Cant. unidades</vs-th>
                <vs-th>Precio unitario</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].valor}}<br>
                    </vs-td>
                    <vs-td>
                      {{tr.precio}}
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
            mixinIdInicioFormatoNewData: null,
        }
    },
    props:{
        alcance:{
            type:Object,
            default:{},
        }
    },
    mounted(){
        let me = this;
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');            
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
        if(me.alcance.id_periodo <= me.mixinIdInicioFormatoNewData){
            me.getLibros();
        }else if(me.alcance.id_periodo > me.mixinIdInicioFormatoNewData){
            me.getLibros_new();
        }
    },
    methods:{
        getLibros(){
            let me = this
            this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance/'+me.alcance.id_pedido+'/'+me.alcance.id)
            .then(res => {
                let datos = res.data
                me.arregloLibros = datos.filter(p => p.valor > 0)
            })
        },
        getLibros_new(){
            let me = this
            this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance_new/'+me.alcance.id_pedido+'/'+me.alcance.id)
            .then(res => {
                let datos = res.data
                me.arregloLibros = datos.filter(p => p.valor > 0)
            })
        },
    }
}
</script>