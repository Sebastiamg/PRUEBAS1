<template>
  <div>
    <!-- Your component content here -->
    <vs-table stripe max-items="50" style="width: 100%;" search pagination :data="arrayInstituciones">
        <template slot="header">
        <div class="vx-row">
            <div class="vx-col w-full m-3">
                Cantidad: {{arrayInstituciones.length}}
            </div>
        </div>
        </template>
        <template slot="thead">
        <vs-th sort-key="idInstitucion">#</vs-th>
        <vs-th sort-key="nombreInstitucion">Institución (asesor)</vs-th>
        <vs-th sort-key="nombre">Localidad</vs-th>
        <vs-th sort-key="nombre">Periodo</vs-th>
        <vs-th sort-key="nombre">Accion</vs-th>
        </template>
        <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].idInstitucion ">
            {{data[indextr].idInstitucion }}
            </vs-td>
            <vs-td :data="data[indextr].nombreInstitucion">
            {{data[indextr].nombreInstitucion}}<br>
            <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                <small> <i style="color:red;">No existe asesor </i></small><br>
            </div>
            <div v-else>
                <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
            </div>
            <small>{{data[indextr].fecha_registro}} </small>
            </vs-td>
            <vs-td :data="data[indextr].nombreregion">
                {{data[indextr].nombreregion}} <br>
                <small>{{data[indextr].ciudad}}</small>
            </vs-td>
            <vs-td>
            <div v-if="tr.EstadoConfiguracion == 1">
                {{ tr.periodoNombreConfigurado }}
            </div>
            <div v-else>
                <small class="" >{{ tr.periodo }}</small><br>
                <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
            </div>
            </vs-td>
            <vs-td>
                <div class="flex">
                <vs-button type="relief" size="small" @click="asignarInstitucion(tr)">Asignar Institucion</vs-button>
                </div>
            </vs-td>
        </vs-tr>
        </template>
    </vs-table>
  </div>
</template>

<script>
export default {
    name: 'TableInstituciones',
    // Your component options here
    props: {
        arrayInstituciones: {
        type: Array,
        default: () => []
        }
    },
    methods: {
        asignarInstitucion(data){
            this.$emit('changeHandle', data)
        }
    }
}
</script>

<style scoped>
/* Your component styles here */
</style>
