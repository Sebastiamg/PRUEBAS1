<template>
<div>
    <div v-if="menu!=0">
        <vs-button @click="menu=0;mandarRecargaListado()" type="flat" color="primary">
            <i class="fa-solid fa-arrow-left"></i> Volver al listado
        </vs-button>
    </div>
    <div v-if="menu == 0">
        <vs-table :data="uniqueData" no-data-text="No hay datos disponibles" style="width: 100%">
            <template v-slot:thead>
                <vs-th>Código Agrupado</vs-th>
                <vs-th>Periodo</vs-th>
                <vs-th width="300">Solicitud</vs-th>
            </template>
            <template v-slot="{ data }">
                <vs-tr v-for="(item, index) in data" :key="index">
                    <vs-td>{{ item.ca_codigo_agrupado }}</vs-td>
                    <vs-td>{{ item.descripcion }}</vs-td>
                    <vs-td>
                        <vs-button @click="selectedInfo = item; menu = 1;" type="filled" color="primary">
                            Ingresar
                        </vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <div v-if="menu==1">
        <ScreenSolicitud :info="selectedInfo" v-if="menu==1" />
    </div>
</div>
</template>

<script>
import ScreenSolicitud from "./ScreenSolicitud.vue";

export default {
    components: {
        ScreenSolicitud
    },
    props: {
        info: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            solicitudScreen: false,
            selectedInfo: null,
            menu: 0,

        };
    },
    computed: {
        uniqueData() {
            if (!this.info.length) return [];

            // Agrupar los datos por id_periodo
            const grouped = this.info.reduce((acc, item) => {
                const { id_periodo, ca_codigo_agrupado, descripcion } = item;

                if (!acc[id_periodo]) {
                    acc[id_periodo] = [];
                }

                // Solo agregamos el primer item que aparece para ese periodo
                if (!acc[id_periodo].some(group => group.ca_codigo_agrupado === ca_codigo_agrupado)) {
                    acc[id_periodo].push(item);
                }

                return acc;
            }, {});

            // Ahora, solo seleccionamos el primer item de cada periodo
            const firstGroupByPeriod = Object.values(grouped).map(periodGroup => periodGroup[0]);

            return firstGroupByPeriod; // Devuelve todos los primeros elementos de cada periodo
        }
    },
    methods: {
        mandarRecargaListado() {
            this.$emit('recharge');
        }
    }

};
</script>