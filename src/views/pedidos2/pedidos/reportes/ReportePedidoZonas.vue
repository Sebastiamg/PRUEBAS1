<template>
    <vx-card>
        <div>
            <p>Seleccione la zona:</p>
            <div class="flex"> 
                <v-select :options="arrayZonas" :reduce="zonas => zonas.idzona" label="zn_nombre" class="w-full" v-model="zonaSelected" @input="f_mostrarCodigos();"/>
                <vs-button class="ml-2" @click="f_mostrarCodigos();">Buscar</vs-button>
            </div>
        </div>
        
    </vx-card>
</template>
<script>
import vSelect from 'vue-select'
import Generalmix from '../../../../mixins/Generalmix';
export default{
    mixins: [Generalmix],
    components:{
        vSelect
    },
    data(){
        return{
            arrayZonas: [],
            zonaSelected: null,
            arrayInstituciones:[],
        }
    },
    async mounted(){
        await this.f_getZonas();
    },
    methods:{
        async f_getZonas() {
            try {
                const url = 'GetZona_todo';
                const response = await this.$http.get(this.$server_url+url);
                this.arrayZonas = response.data;
                console.log(response);
            } catch (error) {
                console.log(error);
            } finally {
            }
        },
        f_mostrarCodigos(){
            let me = this
            if(me.zonaSelected == "" || me.zonaSelected == null || me.zonaSelected == undefined){
                me.arrayInstituciones = [];
                me.m_message('Seleccione una zona','warning');
                return;
            }
            me.arrayInstituciones = me.zonaSelected.institucion
        },
    }
}
</script>