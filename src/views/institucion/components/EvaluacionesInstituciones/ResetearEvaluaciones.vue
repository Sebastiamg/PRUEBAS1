<template>
    <div>
        <p class="font-bold text-2xl">Estas seguro de resetear las evaluaciones de las asignaturas de la institucion?</p>
        <div class="flex justify-center mt-2">
            <vs-button @click="resetearEvaluacionesInstitucion" color="primary">Si, deseo resetear</vs-button>
        </div>
        <vs-table max-items="10" search pagination :data="arrayEvaluacionesInstitucion">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arrayEvaluacionesInstitucion.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Asignatura</vs-th>
                <vs-th>Codigo</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombreasignatura}}<br>
                        
                    </vs-td>
                    <vs-td>
                        {{data[indextr].codigo}}<br>
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
        arrayEvaluacionesInstitucion:{
            type:Array,
            default:()=>[]
        },
        institucionSelected:{
            type:Object,
            default:()=>{}
        }
    },
    methods:{
        resetearEvaluacionesInstitucion(){
            let me = this;
            let formData = new FormData();
            formData.append('intentosPermitidos',    me.institucionSelected.cantidad_cambio_ventana_evaluacion);
            formData.append('arrayEvaluaciones', JSON.stringify(me.arrayEvaluacionesInstitucion));
            this.$http.post(this.$server_url+'resetearIntentos', formData)
            .then(function(response){
                me.$emit('changeEvaluacion');
                me.$vs.notify({
                    title: 'Exito',
                    text: 'Se resetearon las evaluaciones de las asignaturas de la institucion',
                    color: 'success',
                    position: 'top-right'
                });
            })
            .catch(function(error){
                console.log(error);
                me.$vs.notify({
                    title: 'Error',
                    text: 'Ocurrio un error al resetear las evaluaciones de las asignaturas de la institucion',
                    color: 'danger',
                    position: 'top-right'
                });
            });
        }
    }
}
</script>
