<template>
  <div class="w-full h-full rounded-lg cursor-pointer flex justify-center items-center bg-white shadow-md" @click="setArea(area)">
    <div class="w-full h-full rounded-lg">
      <div class="inset-0 flex justify-center items-center h-full px-4">
        <div class="text-2xl font-bold text-center">{{ area.nombrearea }}</div>
      </div>
    </div>
  </div>
</template>


<script>
export default ({
  props: {
    area: {
      type: Object,
      required: true,
    },
    setArea: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      divStyle: {
        background: this.getRandomGradient(),
      },
    }
  },
  methods: {
    getRandomColors() {
      const values = '0123456789ABCDEF';
      let color = '#';

      for (let i = 0; i < 6; i++) {
        color += values[Math.floor(Math.random() * 16)];
      }

      return color;
    },
    getRandomGradient() {
      const color1 = this.getRandomColors();
      const color2 = this.getRandomColors();

      const angle = Math.floor(Math.random() * 360);

      return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
    }
  },
  mounted() { },
})
</script>

<style scoped>
.h-60 {
  height: 15rem;
}

.filter {
  background: rgba(0, 0, 0, 0.3);
}
</style>
