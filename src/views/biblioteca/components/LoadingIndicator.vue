<!-- This is a loading indicator to show on top right of page -->
<template>
  <div v-if="loading" class="loading-indicator px-2">
    <svg class="animate-spin m-2 w-5 text-white" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="#fff" stroke-width="4"></circle>
      <path class="opacity-75" fill="#fff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span class="text-white font-extrabold">Buscando...</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss" scoped>
.loading-indicator {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background-color: #279EFF;
  opacity: 0.9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  /* Center content */
  margin: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
