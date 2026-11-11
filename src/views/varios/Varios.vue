<template>
  <div class="varios-page">
    <!-- ============ HEADER + NAV ============ -->
    <header class="varios-hero">
      <div class="varios-container varios-hero__inner">
        <div class="varios-hero__brand">
          <img
            src="@/assets/images/prolipa.png"
            alt="Prolipa"
            class="varios-hero__logo"
          />
        </div>

        <nav class="varios-nav">
          <button
            v-for="(item, i) in contenidos"
            :key="i"
            type="button"
            class="varios-nav__link"
            :class="{ 'varios-nav__link--cta': item.destacado }"
            @click="f_opciones(item)"
          >
            <feather-icon
              :icon="item.icono || 'FileTextIcon'"
              svg-classes="w-4 h-4 mr-1"
            />
            {{ item.nav || item.titulo }}
          </button>

          <button
            type="button"
            class="varios-nav__link"
            @click="scrollTo('tutorial')"
          >
            <feather-icon icon="PlayCircleIcon" svg-classes="w-4 h-4 mr-1" />
            Tutorial de ingreso
          </button>
        </nav>
      </div>
    </header>

    <!-- ============ ACCESO DIRECTO A PRECIOS ============ -->
    <section ref="destacado" class="varios-destacado" v-if="itemPrecios">
      <div class="varios-container varios-destacado__inner">
        <div class="varios-destacado__icon">
          <feather-icon icon="TagIcon" svg-classes="w-7 h-7" />
        </div>

        <div class="varios-destacado__copy">
          <span class="varios-destacado__eyebrow">Lo más consultado</span>
          <h1 class="varios-destacado__title">
            Precios y catálogo {{ anio }}
          </h1>
          <p class="varios-destacado__text">
            Nuestro catálogo completo con los valores vigentes de todos los
            textos, iguales a nivel nacional. Ábrelo aquí mismo, sin descargas ni
            registros.
          </p>
        </div>

        <div class="varios-destacado__actions">
          <vs-button
            color="primary"
            type="filled"
            icon-pack="feather"
            icon="icon-eye"
            class="varios-destacado__btn"
            @click="f_opciones(itemPrecios)"
          >
            Ver precios y catálogo
          </vs-button>
        </div>
      </div>
    </section>

    <!-- ============ RECURSOS ============ -->
    <section id="recursos" class="varios-section">
      <div class="varios-container">
        <div class="varios-heading">
          <span class="varios-heading__eyebrow">Material disponible</span>
          <h2 class="varios-heading__title">Todo lo que necesitas</h2>
          <p class="varios-heading__text">
            Catálogos y precios se abren aquí mismo; los puntos de venta, en el mapa.
          </p>
        </div>

        <div class="varios-grid">
          <article
            v-for="(item, index) in contenidos"
            :key="index"
            class="varios-card"
            :class="{ 'varios-card--destacada': item.destacado }"
            @click="f_opciones(item)"
          >
            <div class="varios-card__media">
              <img
                :src="imgEnlace(item.imagen)"
                :alt="item.titulo"
                class="varios-card__img"
              />
              <span class="varios-card__tag">
                <feather-icon
                  :icon="item.icono || 'FileTextIcon'"
                  svg-classes="w-4 h-4 mr-1"
                />
                {{ item.categoria || 'Recurso' }}
              </span>
            </div>

            <div class="varios-card__body">
              <h3 class="varios-card__title">{{ item.titulo }}</h3>
              <span class="varios-card__bar"></span>
              <p class="varios-card__text">{{ item.descripcion }}</p>

              <div class="varios-card__footer">
                <vs-button
                  color="primary"
                  :type="item.destacado ? 'filled' : 'border'"
                  icon-pack="feather"
                  :icon="item.modal ? 'icon-eye' : 'icon-map'"
                  icon-after
                  class="w-full"
                  @click.stop="f_opciones(item)"
                >
                  {{ item.modal ? 'Ver aquí' : 'Abrir mapa' }}
                </vs-button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ TUTORIAL ============ -->
    <section
      id="tutorial"
      class="varios-section varios-section--alt"
      v-if="popupOpenVideo"
    >
      <div class="varios-container">
        <div class="varios-heading">
          <span class="varios-heading__eyebrow">Paso a paso</span>
          <h2 class="varios-heading__title">Tutorial de ingreso</h2>
          <p class="varios-heading__text">
            ¿Ya tienes tu libro? Aprende a ingresar a la plataforma y activar tu
            código en menos de dos minutos.
          </p>
        </div>

        <div class="varios-video">
          <div class="varios-player">
            <div class="varios-player__chrome">
              <span class="varios-player__dot varios-player__dot--red"></span>
              <span class="varios-player__dot varios-player__dot--yellow"></span>
              <span class="varios-player__dot varios-player__dot--green"></span>
              <span class="varios-player__chrome-txt">
                <feather-icon icon="YoutubeIcon" svg-classes="w-4 h-4 mr-1" />
                Ingreso a la plataforma
              </span>
            </div>

            <div class="varios-player__frame">
              <!-- Portada: carga el video solo al hacer clic (más rápido) -->
              <button
                v-if="!videoActivo"
                type="button"
                class="varios-player__cover"
                @click="videoActivo = true"
              >
                <img
                  :src="'https://img.youtube.com/vi/' + youtube + '/hqdefault.jpg'"
                  alt="Ver tutorial de ingreso"
                  class="varios-player__thumb"
                />
                <span class="varios-player__play">
                  <feather-icon icon="PlayIcon" svg-classes="w-8 h-8" />
                </span>
                <span class="varios-player__label">Reproducir tutorial de ingreso</span>
              </button>

              <youtube
                v-else
                class="varios-player__video"
                :video-id="youtube"
                :player-vars="{ rel: 0, modestbranding: 1, autoplay: 1 }"
              ></youtube>
            </div>
          </div>

          <ol class="varios-steps">
            <li v-for="(paso, i) in pasos" :key="i" class="varios-steps__item">
              <span class="varios-steps__num">{{ i + 1 }}</span>
              <span class="varios-steps__txt">{{ paso }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer class="varios-footer">
      <div class="varios-container varios-footer__inner">
        <p class="varios-footer__text">
          © {{ anio }} Prolipa · Vanguardia en educación
        </p>
      </div>
    </footer>

    <!-- ============ BOTÓN FLOTANTE DE PRECIOS ============ -->
    <button
      v-if="itemPrecios && mostrarFab"
      type="button"
      class="varios-fab"
      @click="f_opciones(itemPrecios)"
    >
      <feather-icon icon="TagIcon" svg-classes="w-5 h-5" />
      <span class="varios-fab__txt">Ver precios</span>
    </button>

    <!-- ============ MODAL VISOR DE DOCUMENTOS ============ -->
    <vs-popup
      class="varios-popup"
      :title="documento.titulo"
      :active.sync="modalDocumento"
      fullscreen
    >
      <div class="varios-viewer">
        <div class="varios-viewer__bar">
          <span class="varios-viewer__hint">
            <feather-icon icon="InfoIcon" svg-classes="w-4 h-4 mr-1" />
            Si el documento no carga, ábrelo en una nueva pestaña.
          </span>
          <vs-button
            color="primary"
            type="border"
            size="small"
            icon-pack="feather"
            icon="icon-external-link"
            icon-after
            @click="abrirEnPestania(documento)"
          >
            Abrir en Drive
          </vs-button>
        </div>

        <iframe
          v-if="modalDocumento"
          :src="previewUrl(documento.url)"
          class="varios-viewer__frame"
          allow="autoplay"
          allowfullscreen
        ></iframe>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { getIdFromUrl } from 'vue-youtube'
import VueYoutube from 'vue-youtube'
// Antes: require('@/assets/images/enlaces/' + imagen), que en webpack incluia toda la carpeta.
import enlaceCatalogo2023 from '@/assets/images/enlaces/catalogo-2023.jpg'
import enlaceCosta from '@/assets/images/enlaces/costa.jpg'
import enlaceListaPrecios from '@/assets/images/enlaces/lista_precios.jpg'
import enlacePlanLector from '@/assets/images/enlaces/plan_lector.jpg'
import enlaceSierra from '@/assets/images/enlaces/sierra.jpg'
const IMAGENES_ENLACES = {
  'catalogo-2023.jpg': enlaceCatalogo2023,
  'costa.jpg': enlaceCosta,
  'lista_precios.jpg': enlaceListaPrecios,
  'plan_lector.jpg': enlacePlanLector,
  'sierra.jpg': enlaceSierra
}
Vue.use(VueYoutube)

export default {
  name: 'VariosPublico',
  data() {
    return {
      //https://plataforma.prolipadigital.com.ec/v/eyJpdiI6IkNCNkFjYU1B
      //tamaño de la imagen  200px ancho * 250px alto
      getLink: 'eyJpdiI6IkNCNkFjYU1B',
      pasos: [
        'Ingresa a la plataforma con tu correo electrónico como usuario.',
        'Usa como clave el número de cédula con el que te registraste.',
        'Activa tu libro digital con el código que viene en tu texto.',
      ],
      contenidos: [
        {
          titulo: 'Precios y catálogo',
          nav: 'Precios',
          descripcion:
            'Nuestro catálogo completo de productos con sus respectivos valores, los mismos que se mantienen a nivel nacional.',
          imagen: 'lista_precios.jpg',
          categoria: 'Precios y catálogo',
          icono: 'TagIcon',
          modal: true,
          destacado: true,
          url:
            'https://drive.google.com/file/d/1sD2D-6av5UqJFI76NTdrj7NpP7lN_g1X/view?usp=sharing',
        },
        // {
        //     'titulo': 'Catálogo Prolipa',
        //     'descripcion': 'Prolipa, como empresa editorial genuinamente ecuatoriana, se siente complacida en ofrecer esta nueva serie de textos innovadores de 2.o a 10.o grado de EGB y de 1.o a 3.o de BG.',
        //     'imagen': 'catalogo-2023.jpg',
        //     'url': 'https://drive.google.com/file/d/1_tyLIYV4y_fpMzlfgLQz9kUD0x_pb--l/view',
        // },
        // {
        //   titulo: 'Plan Lector',
        //   nav: 'Plan Lector',
        //   descripcion:
        //     'Nuestro catálogo de Plan Lector incluye obras de autores nacionales y extranjeros, clásicos imprescindibles y libros informativos alusivos a la naturaleza y a la ciencia, cuyos contenidos serán referentes de calidad y probidad académica.',
        //   imagen: 'plan_lector.jpg',
        //   categoria: 'Catálogo',
        //   icono: 'BookOpenIcon',
        //   modal: true,
        //   url: 'https://drive.google.com/file/d/11J6Ey0fMEuylbfNKqKFehzGnJoLzIkAJ/view',
        // },
        {
          titulo: 'Puntos de Venta - COSTA',
          nav: 'Ventas Costa',
          descripcion:
            'Ubique nuestros puntos de venta autorizados para el régimen COSTA',
          imagen: 'costa.jpg',
          categoria: 'Régimen Costa',
          icono: 'MapPinIcon',
          url:
            'https://www.google.com/maps/d/u/1/viewer?mid=1ybgPb-HcYjc94aVyzFrMPVkC6CEdOsNU&ll=-2.1637759379446173%2C-76.28945105579643&z=7',
        },
        {
          titulo: 'Puntos de Venta - SIERRA',
          nav: 'Ventas Sierra',
          descripcion:
            'Ubique nuestros puntos de venta autorizados para el régimen SIERRA',
          imagen: 'sierra.jpg',
          categoria: 'Régimen Sierra',
          icono: 'MapPinIcon',
          url:
            'https://www.google.com/maps/d/u/1/viewer?mid=1ODed56bLVrBfyw6_r2m5DaTXhlo7_KO6&ll=-1.834583742877697%2C-79.00607800000002&z=8',
        },
      ],
      youtube: '',
      popupOpenVideo: false,
      videoActivo: false,
      modalDocumento: false,
      documento: { titulo: '', url: '' },
      mostrarFab: false,
      observer: null,
      video: {
        video: '',
      },
      link: 'https://www.youtube.com/watch?v=gVtAOA8dhSU',
    }
  },
  computed: {
    anio() {
      return new Date().getFullYear()
    },
    // Recurso principal: el marcado como destacado (precios)
    itemPrecios() {
      return this.contenidos.find((c) => c.destacado) || null
    },
  },
  mounted() {
    let me = this
    let datos = me.$route.params.env
    if (datos == me.getLink) {
      me.openVideo(me.link)
      me.$nextTick(me.observarDestacado)
      // me.f_getPublicVarios()
      return
    } else {
      me.$router.push('/pages/error-404')
    }
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect()
  },
  methods: {
    imgEnlace(nombre) {
      return IMAGENES_ENLACES[nombre]
    },
    openVideo(tr) {
      let me = this
      me.video.video = tr
      me.popupOpenVideo = true
      const youtubeId = getIdFromUrl(tr)
      me.youtube = youtubeId
    },
    // El botón flotante aparece cuando el bloque de precios sale de pantalla.
    // Se usa IntersectionObserver porque el scroll ocurre en un contenedor
    // interno del layout, no en window.
    observarDestacado() {
      const el = this.$refs.destacado
      if (!el || typeof IntersectionObserver === 'undefined') return
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.mostrarFab = !entry.isIntersecting
        },
        { threshold: 0 }
      )
      this.observer.observe(el)
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    // Convierte un enlace de Google Drive en su versión embebible
    previewUrl(url) {
      if (!url) return ''
      const match = url.match(/\/file\/d\/([^/]+)/)
      return match
        ? 'https://drive.google.com/file/d/' + match[1] + '/preview'
        : url
    },
    abrirEnPestania(item) {
      if (item && item.url) window.open(item.url, '_blank')
    },
    f_getPublicVarios() {
      let me = this
      me.$vs.loading()
      this.$http
        .get(this.$server_url + 'getTodoVarios')
        .then((result) => {
          me.contenidos = result.data
          me.$vs.loading.close()
        })
        .catch(() => {
          me.$vs.loading.close()
        })
    },
    f_opciones(item) {
      if (item.modal) {
        this.documento = item
        this.modalDocumento = true
        return
      }
      window.open(item.url, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
$brand: #2a3c6d;
$brand-soft: #105a8e;
$ink: #1c2536;
$muted: #64748b;
$line: #e6ecf5;

.varios-page {
  background: #f6f8fc;
  min-height: 100vh;
  color: $ink;
}

.varios-container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ---------------- HEADER + NAV ---------------- */
.varios-hero {
  position: sticky;
  top: 0;
  z-index: 900;
  background: $brand;
  color: #fff;
  padding: 0.7rem 0;
  box-shadow: 0 6px 20px -14px rgba(42, 60, 109, 0.9);

  &__inner {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  &__brand {
    flex: 0 0 auto;
    background: #fff;
    border-radius: 10px;
    padding: 0.4rem 0.65rem;
    line-height: 0;
  }

  &__logo {
    height: 28px;
    width: auto;
    display: block;
  }
}

.varios-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-left: auto;

  &__link {
    display: inline-flex;
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 8px;
    padding: 0.45rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.82);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }

    &--cta {
      background: #fff;
      color: $brand;

      &:hover {
        background: #fff;
        color: $brand-soft;
      }
    }
  }
}

/* ---------------- BLOQUE DESTACADO DE PRECIOS ---------------- */
.varios-destacado {
  background: #fff;
  border-bottom: 1px solid $line;
  padding: 2rem 0;

  &__inner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  &__icon {
    flex: 0 0 auto;
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: rgba(42, 60, 109, 0.09);
    color: $brand;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__copy {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__eyebrow {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: $brand-soft;
    margin-bottom: 0.25rem;
  }

  &__title {
    font-size: 1.7rem;
    font-weight: 700;
    color: $ink;
    line-height: 1.2;
    margin: 0 0 0.3rem;
  }

  &__text {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.55;
    color: $muted;
    max-width: 560px;
  }

  &__actions {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  &__btn {
    white-space: nowrap;
  }
}

/* ---------------- SECCIONES ---------------- */
.varios-section {
  padding: 3rem 0;

  &--alt {
    background: #fff;
    border-top: 1px solid $line;
    border-bottom: 1px solid $line;
  }
}

.varios-heading {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 2.25rem;

  &__eyebrow {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: $brand;
    background: rgba(42, 60, 109, 0.09);
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    margin-bottom: 0.8rem;
  }

  &__title {
    font-size: 1.85rem;
    font-weight: 700;
    color: $ink;
    margin-bottom: 0.6rem;
    line-height: 1.25;
  }

  &__text {
    color: $muted;
    font-size: 0.95rem;
    line-height: 1.6;
  }
}

/* ---------------- VIDEO ---------------- */
.varios-video {
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 1.75rem;
  align-items: start;
}

.varios-player {
  border-radius: 14px;
  overflow: hidden;
  background: #10192e;
  box-shadow: 0 20px 45px -25px rgba(16, 25, 46, 0.65);

  &__chrome {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.9rem;
    background: #182545;
  }

  &__dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;

    &--red {
      background: #ff5f57;
    }
    &--yellow {
      background: #febc2e;
    }
    &--green {
      background: #28c840;
    }
  }

  &__chrome-txt {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: rgba(255, 255, 255, 0.65);
  }

  &__frame {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: #000;

    ::v-deep iframe,
    ::v-deep .varios-player__video {
      position: absolute !important;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      display: block;
      border: 0;
    }
  }

  &__cover {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    cursor: pointer;
    background: #000;
    overflow: hidden;

    &:hover .varios-player__thumb {
      transform: scale(1.05);
      opacity: 0.72;
    }

    &:hover .varios-player__play {
      transform: translate(-50%, -50%) scale(1.08);
    }
  }

  &__thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
    transition: transform 0.5s ease, opacity 0.3s ease;
  }

  &__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 66px;
    height: 66px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    color: $brand;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.6);
    transition: transform 0.25s ease;
  }

  &__label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  }
}

.varios-steps {
  list-style: none;
  margin: 0;
  padding: 1.35rem 1.5rem;
  background: #f6f8fc;
  border: 1px solid $line;
  border-radius: 14px;

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 0.75rem 0;

    & + & {
      border-top: 1px dashed $line;
    }
  }

  &__num {
    flex: 0 0 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(42, 60, 109, 0.1);
    color: $brand;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__txt {
    font-size: 0.9rem;
    line-height: 1.5;
    color: $muted;
  }
}

/* ---------------- GRID DE RECURSOS ---------------- */
.varios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.6rem;
}

.varios-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid $line;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(42, 60, 109, 0.32);
    box-shadow: 0 20px 40px -22px rgba(42, 60, 109, 0.45);

    .varios-card__img {
      transform: scale(1.06);
    }

    .varios-card__bar {
      width: 70px;
    }
  }

  &--destacada {
    border-color: rgba(42, 60, 109, 0.35);
    box-shadow: 0 14px 32px -22px rgba(42, 60, 109, 0.5);
  }

  &__media {
    position: relative;
    height: 180px;
    overflow: hidden;
    background: #eef3fa;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s ease;
  }

  &__tag {
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.72rem;
    font-weight: 600;
    color: $brand;
    background: rgba(255, 255, 255, 0.94);
    padding: 0.3rem 0.68rem;
    border-radius: 999px;
    box-shadow: 0 4px 12px -6px rgba(0, 0, 0, 0.4);
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 1.25rem;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 700;
    color: $ink;
    line-height: 1.35;
    margin: 0;
  }

  &__bar {
    display: block;
    width: 34px;
    height: 4px;
    border-radius: 4px;
    background: $brand-soft;
    margin: 0.65rem 0 0.85rem;
    transition: width 0.25s ease;
  }

  &__text {
    flex: 1 1 auto;
    font-size: 0.875rem;
    line-height: 1.6;
    color: $muted;
    margin: 0 0 1.15rem;
  }

  &__footer {
    margin-top: auto;
  }
}

/* ---------------- BOTÓN FLOTANTE ---------------- */
.varios-fab {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 950;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.15rem;
  border: 0;
  border-radius: 999px;
  background: $brand;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 14px 30px -12px rgba(42, 60, 109, 0.85);
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: $brand-soft;
  }
}

/* ---------------- MODAL VISOR ---------------- */
.varios-popup {
  ::v-deep .vs-popup--header {
    background: $brand;
  }

  ::v-deep .vs-popup--title h3 {
    color: #fff;
    font-weight: 600;
    font-size: 1.05rem;
  }

  ::v-deep .vs-popup--close {
    background: #fff !important;
    color: $brand;
  }

  ::v-deep .vs-popup--content {
    padding: 0;
    height: calc(100% - 50px);
    overflow: hidden;
  }
}

.varios-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 60vh;
  background: #f6f8fc;

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.7rem 1rem;
    background: #fff;
    border-bottom: 1px solid $line;
  }

  &__hint {
    display: inline-flex;
    align-items: center;
    font-size: 0.8rem;
    color: $muted;
  }

  &__frame {
    flex: 1 1 auto;
    width: 100%;
    min-height: 55vh;
    border: 0;
    display: block;
    background: #eef1f7;
  }
}

/* ---------------- FOOTER ---------------- */
.varios-footer {
  background: $brand;
  padding: 1.35rem 0;
  color: rgba(255, 255, 255, 0.75);

  &__inner {
    text-align: center;
  }

  &__text {
    margin: 0;
    font-size: 0.82rem;
  }
}

/* ---------------- RESPONSIVE ---------------- */
@media screen and (max-width: 991px) {
  .varios-video {
    grid-template-columns: 1fr;
  }

  .varios-destacado__inner {
    flex-wrap: wrap;
  }

  .varios-destacado__actions {
    flex: 1 1 100%;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}

@media screen and (max-width: 767px) {
  .varios-hero {
    padding: 0.6rem 0;

    &__inner {
      flex-wrap: wrap;
      gap: 0.6rem;
    }
  }

  .varios-nav {
    flex: 1 1 100%;
    margin-left: 0;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.15rem;

    &__link {
      flex: 0 0 auto;
      font-size: 0.8rem;
      padding: 0.4rem 0.6rem;
    }
  }

  .varios-destacado {
    padding: 1.5rem 0;

    &__icon {
      display: none;
    }

    &__title {
      font-size: 1.35rem;
    }
  }

  .varios-heading__title {
    font-size: 1.45rem;
  }

  .varios-section {
    padding: 2.25rem 0;
  }

  .varios-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .varios-fab__txt {
    display: none;
  }

  .varios-fab {
    padding: 0.9rem;
  }
}
</style>
