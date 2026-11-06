<template>
<div class="vx-col w-full mb-base">
    <vx-card slot="no-body" class="text-center bg-white-gradient greet-user">
        <feather-icon icon="AwardIcon" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow" svgClasses="h-8 w-8"></feather-icon>
        <h1 class="mb-6">
            {{institucion.nombreInstitucion}} 
        </h1>
        <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto ">
            <strong>hi</strong>
        </p>
    </vx-card>
</div>
</template>
<script>
export default {
    props:{
        institucion:Object
    },
    data() {
        return {
            
        }
    },
}
</script>
