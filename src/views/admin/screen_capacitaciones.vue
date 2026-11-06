<template>
<div>
    <vx-card>
        <vs-tabs>
            <vs-tab label="Agenda">
                <div class="con-tab-ejemplo">
                    <capacitacionesAgenda/>
                </div>
            </vs-tab>
            <vs-tab label="Temas de capacitación">
                <div class="con-tab-ejemplo">
                    <capacitaciones/>
                </div>
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
import vSelect from 'vue-select'
import capacitaciones from '../admin/capacitaciones.vue'
import capacitacionesAgenda from '../admin/capacitaciones_agenda.vue'
export default {
    components: {
        'v-select': vSelect,
        capacitaciones,
        capacitacionesAgenda,
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    },
}
</script>
