<template>
    <div>
        <vx-card
        :title="'Asignatura: '+nombreasignatura"
        title-color="success"
        >
            <div v-if="tipo !=0">
                <vs-button color="primary" type="border" @click="tipo = 0;">← Regresar</vs-button>
            </div>
            <div v-if="tipo == 0">
                <listadoFichaVue :listaDatos="listaDatos" @recharge="recharge" @changeEdit="changeEdit"/>
            </div>
            <div ><New v-if="tipo == 1" :ficha="ficha" @recharge="recharge" /></div>
        </vx-card>
    </div>
    </template>
    
    <script>
    import vSelect from 'vue-select';
    import New from '../new.vue';
    import listadoFichaVue from '../listadoFicha.vue';
    export default {
        components: {
            "v-select": vSelect,
            New,
            listadoFichaVue,
        },
        data() {
            return {
                listaDatos:[],
                tipo:0,
                ficha:{},
                nombreasignatura:'',
            }
        },
        mounted() {
            let me = this;
            me.nombreasignatura = localStorage.nombreasignatura
            me.f_getFichas()
        },
        methods: {
            recharge(e){
                let me = this;
                me.f_getFichas()
                me.tipo = 0
            },
            changeEdit(e){
                let me = this;
                me.ficha = {}
                me.ficha = e
                me.tipo  = 1
            },
            f_getFichas() {
                let me = this;
                // me.modalAdd = false;
                this.$http.get(this.$server_url + 'fichas')
                    .then(res => {
                        me.$vs.loading.close();
                        let id_asignatura = localStorage.idasignatura
                        let datos = res.data
                        me.listaDatos = datos.filter(p => p.id_asignatura == id_asignatura && p.estado == '1')
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close();
                    })
            },
        },
    }
    </script>
    