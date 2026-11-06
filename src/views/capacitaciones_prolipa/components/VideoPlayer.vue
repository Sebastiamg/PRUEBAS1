<template>
  <div class="video-player">
    <!-- YouTube -->
    <div v-if="videoType === 'youtube'" class="video-container">
      <div v-if="loading" class="video-loader">
        <div class="spinner"></div>
        <p>Cargando video...</p>
      </div>
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="video-iframe"
        @load="onVideoLoad"
      ></iframe>
    </div>

    <!-- Vimeo -->
    <div v-else-if="videoType === 'vimeo'" class="video-container">
      <div v-if="loading" class="video-loader">
        <div class="spinner"></div>
        <p>Cargando video...</p>
      </div>
      <iframe
        :src="`https://player.vimeo.com/video/${videoId}`"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        class="video-iframe"
        @load="onVideoLoad"
      ></iframe>
    </div>

    <!-- Video HTML5 (MP4, etc.) -->
    <div v-else-if="videoType === 'direct'" class="video-container">
      <div v-if="loading" class="video-loader">
        <div class="spinner"></div>
        <p>Cargando video...</p>
      </div>
      <video 
        controls 
        class="video-element"
        @loadeddata="onVideoLoad"
      >
        <source :src="url" type="video/mp4">
        Tu navegador no soporta el tag de video.
      </video>
    </div>

    <!-- Enlace externo (fallback) -->
    <div v-else class="enlace-externo">
      <Icon name="video" size="3rem" />
      <p>Este video se abrirá en una nueva pestaña</p>
      <a :href="url" target="_blank" class="btn-abrir">
        <Icon name="external-link" /> Abrir Video
      </a>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.vue';

export default {
  name: 'VideoPlayer',
  components: {
    Icon
  },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true
    };
  },
  computed: {
    videoType() {
      const url = this.url.toLowerCase();
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube';
      }
      if (url.includes('vimeo.com')) {
        return 'vimeo';
      }
      if (url.match(/\.(mp4|webm|ogg)$/)) {
        return 'direct';
      }
      
      return 'external';
    },
    
    videoId() {
      const url = this.url;
      
      if (this.videoType === 'youtube') {
        // Extraer ID de YouTube
        let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
      }
      
      if (this.videoType === 'vimeo') {
        // Extraer ID de Vimeo
        let match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
      }
      
      return null;
    }
  },
  watch: {
    url() {
      this.loading = true;
    }
  },
  methods: {
    onVideoLoad() {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.video-player {
  width: 100%;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
  background-color: #000;
  border-radius: 12px;
}

.video-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
  z-index: 10;
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.video-loader p {
  margin-top: 16px;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  z-index: 5;
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  z-index: 5;
}

.enlace-externo {
  text-align: center;
  padding: 40px 20px;
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.enlace-externo p {
  color: #94a3b8;
  margin: 12px 0 16px 0;
}

.btn-abrir {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-abrir:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}
</style>
