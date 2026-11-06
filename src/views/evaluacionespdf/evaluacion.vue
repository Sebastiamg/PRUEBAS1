<template>
<div>
    <vs-card>
        <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">
            <!-- GENERAL -->
            <vs-tab icon-pack="feather" icon="icon-file" :label="!isSmallerScreen ? 'Evaluaciones Diagnosticas' : ''">
                <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                    <diagnosticas/>
                </div>
            </vs-tab>
            <vs-tab icon-pack="feather" icon="icon-file" :label="!isSmallerScreen ? 'Evaluaciones Sumativas' : ''">
                <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
                    <sumativas/>
                </div>
            </vs-tab>
            <vs-tab icon-pack="feather" icon="icon-file" :label="!isSmallerScreen ? 'Evaluaciones Qumistrales' : ''">
                <div class="tab-social-links md:ml-4 md:mt-0 mt-4 ml-0">
                    <quimistrales/>
                </div>
            </vs-tab>
            <vs-tab icon-pack="feather" icon="icon-file" :label="!isSmallerScreen ? 'Evaluación Estandar' : ''">
                <div class="tab-text md:ml-4 md:mt-0 mt-4 ml-0">
                    <estandar/>
                </div>
            </vs-tab>
        </vs-tabs>
    </vs-card>
</div>
</template>

<script>
import diagnosticas from './diagnosticas.vue'
import sumativas from './sumativas.vue'
import formativas from './formativas.vue'
import quimistrales from './quimistrales.vue'
import estandar from './estandar.vue'

export default {
    components:{
        diagnosticas,
        sumativas,
        formativas,
        quimistrales,
        estandar,
    },
    data() {
        return {

        }
    },
    computed: {
        isSmallerScreen() {
            return this.$store.state.windowWidth < 768
        }
    },
    mounted() {

    },
    methods: {

    },
}
</script>
