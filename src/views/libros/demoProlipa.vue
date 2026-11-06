<template>
  <div class="demo-prolipa-container">
    <!-- Header -->
    <div class="header-section">
      <h1 class="main-title">Biblioteca Digital Prolipa</h1>
      <p class="subtitle">Explora nuestros libros digitales por fuerza militar</p>
    </div>

    <!-- Fuerza Aérea -->
    <div class="force-section">
      <div class="force-header">
        <h2 class="force-title">
          <i class="feather icon-zap"></i>
          Fuerza Aérea
        </h2>
        <div class="force-divider"></div>
      </div>
      <div class="books-grid">
        <div v-for="(libro, index) in arrayArea" :key="index" class="book-card" @click="abrirLibro(libro.link)">
          <div class="book-cover">
            <img v-bind:src="$data_url+'archivos/upload/libro/'+libro.weblibro+'/'+libro.portada" :alt="libro.nombre" class="cover-image" />
            <div class="book-overlay">
              <i class="feather icon-eye"></i>
              <span>Ver Demo</span>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ libro.nombre }}</h3>
            <div class="book-badge aerea">Fuerza Aérea</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fuerza Naval -->
    <div class="force-section">
      <div class="force-header">
        <h2 class="force-title">
          <i class="feather icon-anchor"></i>
          Fuerza Naval
        </h2>
        <div class="force-divider"></div>
      </div>
      <div class="books-grid">
        <div v-for="(libro, index) in arrayNaval" :key="index" class="book-card" @click="abrirLibro(libro.link)">
          <div class="book-cover">
            <img :src="getPortadaUrl(libro.weblibro, libro.portada)" :alt="libro.nombre" class="cover-image" />
            <div class="book-overlay">
              <i class="feather icon-eye"></i>
              <span>Ver Demo</span>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ libro.nombre }}</h3>
            <div class="book-badge naval">Fuerza Naval</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fuerza Terrestre -->
    <div class="force-section">
      <div class="force-header">
        <h2 class="force-title">
          <i class="feather icon-shield"></i>
          Fuerza Terrestre
        </h2>
        <div class="force-divider"></div>
      </div>
      <div class="books-grid">
        <div v-for="(libro, index) in arrayTerrestre" :key="index" class="book-card" @click="abrirLibro(libro.link)">
          <div class="book-cover">
            <img :src="getPortadaUrl(libro.weblibro, libro.portada)" :alt="libro.nombre" class="cover-image" />
            <div class="book-overlay">
              <i class="feather icon-eye"></i>
              <span>Ver Demo</span>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ libro.nombre }}</h3>
            <div class="book-badge terrestre">Fuerza Terrestre</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arrayArea: [
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Lengua3", portada: "portada.png", nombre: 'F Aérea Lengua 3', weblibro: 'FAE_Lengua3' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Lengua5", portada: "portada.png", nombre: 'F Aérea Lengua 5', weblibro: 'FAE_Lengua5' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Lengua9", portada: "portada.png", nombre: 'F Aérea Lengua 9', weblibro: 'FAE_Lengua9' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Naturales3", portada: "portada.png", nombre: 'F Aérea Naturales 3', weblibro: 'FAE_Naturales3' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Naturales5", portada: "portada.png", nombre: 'F Aérea Naturales 5', weblibro: 'FAE_Naturales5' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Naturales9", portada: "portada.png", nombre: 'F Aérea Naturales 9', weblibro: 'FAE_Naturales9' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_SOCIALES3", portada: "portada.png", nombre: 'F Aérea Sociales 3', weblibro: 'FAE_SOCIALES3' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_SOCIALES5", portada: "portada.png", nombre: 'F Aérea Sociales 5', weblibro: 'FAE_SOCIALES5' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_SOCIALES9", portada: "portada.png", nombre: 'F Aérea Sociales 9', weblibro: 'FAE_SOCIALES9' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Matematica3", portada: "portada.png", nombre: 'F Aérea Matemática 3', weblibro: 'FAE_Matematica3' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Matematica5", portada: "portada.png", nombre: 'F Aérea Matemática 5', weblibro: 'FAE_Matematica5' },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/FAE_Matematica9", portada: "portada.png", nombre: 'F Aérea Matemática 9', weblibro: 'FAE_Matematica9' },
      ],
      arrayNaval: [
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Lengua3", portada: "portada.png", nombre: "F Naval Lengua 3", weblibro: "NAVAL_Lengua3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Lengua5", portada: "portada.png", nombre: "F Naval Lengua 5", weblibro: "NAVAL_Lengua5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Lengua9", portada: "portada.png", nombre: "F Naval Lengua 9", weblibro: "NAVAL_Lengua9" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Sociales3", portada: "portada.png", nombre: "F Naval Sociales 3", weblibro: "NAVAL_Sociales3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Sociales5", portada: "portada.png", nombre: "F Naval Sociales 5", weblibro: "NAVAL_Sociales5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Sociales9", portada: "portada.png", nombre: "F Naval Sociales 9", weblibro: "NAVAL_Sociales9" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Naturales3", portada: "portada.png", nombre: "F Naval Naturales 3", weblibro: "NAVAL_Naturales3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Naturales5", portada: "portada.png", nombre: "F Naval Naturales 5", weblibro: "NAVAL_Naturales5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Naturales9", portada: "portada.png", nombre: "F Naval Naturales 9", weblibro: "NAVAL_Naturales9" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Matematica3", portada: "portada.png", nombre: "F Naval Matemáticas 3", weblibro: "NAVAL_Matematica3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Matematica5", portada: "portada.png", nombre: "F Naval Matemáticas 5", weblibro: "NAVAL_Matematica5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/NAVAL_Matematica9", portada: "portada.png", nombre: "F Naval Matemáticas 9", weblibro: "NAVAL_Matematica9" }
      ],
      arrayTerrestre: [
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Lengua3", portada: "portada.png", nombre: "F Terrestre Lengua 3", weblibro: "TERRESTRE_Lengua3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Lengua5", portada: "portada.png", nombre: "F Terrestre Lengua 5", weblibro: "TERRESTRE_Lengua5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Lengua9", portada: "portada.png", nombre: "F Terrestre Lengua 9", weblibro: "TERRESTRE_Lengua9" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Sociales3", portada: "portada.png", nombre: "F Terrestre Sociales 3", weblibro: "TERRESTRE_Sociales3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Sociales5", portada: "portada.png", nombre: "F Terrestre Sociales 5", weblibro: "TERRESTRE_Sociales5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Sociales9", portada: "portada.png", nombre: "F Terrestre Sociales 9", weblibro: "TERRESTRE_Sociales9" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Matematica3", portada: "portada.png", nombre: "F Terrestre Matemáticas 3", weblibro: "TERRESTRE_Matematica3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Matematica5", portada: "portada.png", nombre: "F Terrestre Matemáticas 5", weblibro: "TERRESTRE_Matematica5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Matematica9", portada: "portada.png", nombre: "F Terrestre Matemáticas 9", weblibro: "TERRESTRE_Matematica9" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Naturales3", portada: "portada.png", nombre: "F Terrestre Naturales 3", weblibro: "TERRESTRE_Naturales3" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Naturales5", portada: "portada.png", nombre: "F Terrestre Naturales 5", weblibro: "TERRESTRE_Naturales5" },
        { link: "https://plataforma.prolipadigital.com.ec/libro/demo/escuela/TERRESTRE_Naturales9", portada: "portada.png", nombre: "F Terrestre Naturales 9", weblibro: "TERRESTRE_Naturales9" }
      ],
    }
  },
  methods: {
    abrirLibro(link) {
      window.open(link, '_blank');
    },
    getPortadaUrl(weblibro, portada) {
      // Usando la misma estructura que en libros.vue
      return this.$data_url + 'archivos/upload/libro/' + weblibro + '/' + portada;
    }
  },
}
</script>

<style scoped>
.demo-prolipa-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0;
}

.force-section {
  margin-bottom: 4rem;
}

.force-header {
  margin-bottom: 2rem;
}

.force-title {
  font-size: 2rem;
  font-weight: 600;
  color: #34495e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.force-title i {
  font-size: 1.8rem;
}

.force-divider {
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 2px;
  width: 100px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.book-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .cover-image {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(52, 73, 94, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-weight: 600;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.book-overlay i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.book-info {
  padding: 1.5rem;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.book-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.book-badge.aerea {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
}

.book-badge.naval {
  background: linear-gradient(135deg, #00b894, #00a085);
  color: white;
}

.book-badge.terrestre {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-prolipa-container {
    padding: 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .force-title {
    font-size: 1.5rem;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>
