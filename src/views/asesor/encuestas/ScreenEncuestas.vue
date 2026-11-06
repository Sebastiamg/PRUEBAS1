<template>
<div>
    <vs-tabs v-model="tabActivo" alignment="fixed">

        <vs-tab label="📋 Encuestas">
            <EncuestasProlipa />
        </vs-tab>

        <!-- <vs-tab label="📊 Estadísticas">
            <EncuestaEstadisticasGlobalesProlipa v-if="tabActivo === 1" />
        </vs-tab> -->

    </vs-tabs>
</div>
</template>

<script>
import EncuestasProlipa from './EncuestasProlipa.vue'
import EncuestaEstadisticasGlobalesProlipa from './EncuestaEstadisticasGlobalesProlipa.vue'

export default {
    components: { EncuestasProlipa, EncuestaEstadisticasGlobalesProlipa },
    data() {
        return { tabActivo: 0 }
    }
}
</script>
