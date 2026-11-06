<template>
<div>
    <div v-if="loadingRevision" class="revision-loading">
        Cargando revisiones...
    </div>

    <div v-if="menu == 0">
        <vx-card>
            <div>
                REVISIONES VERIFICACIONES
            </div>
            <div>
                <vs-table :data="datosRevisiones" stripe>
                    <template slot="thead">
                        <!-- Cabecera de la tabla -->
                        <vs-th>Periodo</vs-th>
                        <vs-th>Total Verificaciones Revisadas</vs-th>
                        <vs-th>Total Verificaciones No Revisadas</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>

                    <template slot-scope="{ data }">
                        <!-- Cuerpo de la tabla -->
                        <vs-tr v-for="(tr, index) in data" :key="index">
                            <vs-td>{{ tr.descripcion }}</vs-td>
                            <vs-td>{{ tr.totalVerificacionesRevisadas }}</vs-td>
                            <vs-td><b class="text-danger">{{ tr.totalVerificacionesNoRevisadas }}</b></vs-td>
                            <vs-td>
                                <vs-button @click="datosPeriodo=tr;menu=1;">Detalles</vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vx-card>
    </div>

    <div v-if="menu != 0 && tipo==0" class="my-4">
      <vs-button color="primary" type="filled" @click="menu = 0;getRevision()">◄ Regresar</vs-button>
    </div>

    <div v-if="menu == 1">
        <Revisiones v-if="menu == 1"  :datosPeriodo="datosPeriodo" @tieneTipo="tieneTipo" />
    </div>

</div>
</template>

<script>
import vSelect from 'vue-select'
import Revisiones from "./listadoRevisiones.vue";

export default {
    data() {
        return {
            datosRevisiones: [],
            menu: 0,
            tipo: 0,
            loadingRevision: false,

            //datos envio componente
            datosPeriodo:[],

        }
    },
    components: {
        'v-select': vSelect,
        Revisiones
    },
    created() {
        this.getRevision()
    },
    methods: {
        getRevision() {
            this.loadingRevision = true;
            this.$http.get(this.$server_url + 'metodosGetVerificaciones?getVerificacionesRevisionCount=1')
                .then(res => {
                    this.datosRevisiones = Object.values(res.data);
                    this.loadingRevision = false;
                })
                .catch(error => {
                    this.loadingRevision = false;
                });
        },
        tieneTipo(e){
            console.log(e);
            this.tipo = e;
        }
    }
}
</script>

<style scoped>
.revision-loading {
    padding: 12px 16px;
    color: #6b7280;
    font-weight: 600;
}
</style>
