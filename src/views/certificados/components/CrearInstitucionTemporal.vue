<template>
    <div>
        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <ul class="leftx" style="display:flex;flex-direction: row;">
                    <li class="ml-2">
                        <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos2()" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li class="ml-2">
                        <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos2()" vs-name="radios1" vs-value="2">Costa</vs-radio>
                    </li>
                </ul>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <div class="vx-col w-full mt-5">
                    Seleccione una ciudad:
                    <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                </div>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <div class="vx-col w-full mt-5">
                    Seleccione un período:
                    <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="temporalInstitucion.periodo" />
                </div>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-input label="Escriba un nombre para la institución" class="w-full" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
            </vs-col>
        </vs-row>
        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button @click="agregarInstitucionTemporal()" type="gradient">Agregar Institución</vs-button>
            </vs-col>
        </vs-row>
    </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
    data(){
        return{
            arregloPeriodos:[],
            temporalInstitucion: {
                ciudad: '',
                nombreInstitucion: '',
                region: '2',
                periodo:'',
            },
        }
    },
    mounted(){
        let me = this;
        me.getPeriodos2()
    },
    components:{
        vSelect,
    },
    props:{
        arregloCiudad:{
            type:Array,
            default:[]
        }
    },
    methods:{
        getPeriodos2(){
            let me = this
            me.arregloPeriodos = []
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                let datos = res.data
                me.arregloPeriodos = datos.filter(p => p.estado == 1 && p.region_idregion == me.temporalInstitucion.region)
            })
            .catch(function (error) {
            })
        },
        agregarInstitucionTemporal() {
            let me = this;
            if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una institución por favor'
                })
                return false;
            }
            if(me.temporalInstitucion.periodo == null || me.temporalInstitucion.periodo == "" || me.temporalInstitucion.periodo == undefined ){
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe seleccionar un período por favor'
                    })
                return false;
            }
            let formData = new FormData();
            formData.append('nombre_institucion',   me.temporalInstitucion.nombre_institucion);
            formData.append('ciudad',               me.temporalInstitucion.ciudad.nombre);
            formData.append('region',               me.temporalInstitucion.region);
            formData.append('periodo',              me.temporalInstitucion.periodo);
            formData.append('asesor_id',            localStorage.planificacion_asesor_id);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
                .then(res => {
                    me.$vs.loading.close()
                    let datos                       = {
                        nombreInstitucion            : me.temporalInstitucion.nombre_institucion,
                        institucion_id_temporal      : res.data.institucion_temporal_id,
                        periodo_id_temporal          : res.data.periodo_id,
                        estado_institucion_temporal  : 1
                    }
                    this.$emit('changeInstitucionCreada',datos)
                    me.$vs.notify({
                        text: "Se guardo correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
    }
}
</script>