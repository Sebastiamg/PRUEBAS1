<template>
  <div>
    <div
      v-if="imagenInsitucion == null || imagenInsitucion == ''"
      class="nombreInstitucion"
      style="display:flex; align-items:center; justify-content:center; gap:10px; min-height:44px; padding:8px 20px; border-radius:10px; background:linear-gradient(120deg, #046AE7 0%, #2f8ef0 100%); box-shadow:0 4px 12px rgba(4, 106, 231, 0.2);"
    >
      <i class="fa fa-graduation-cap institucion-icono" aria-hidden="true" style="color:#ffffff; font-size:16px; opacity:0.9;"></i>
      <p class="institucion-nombre" style="color:#ffffff; font-weight:600; letter-spacing:0.5px; text-align:center; margin:0; font-size:14px;">{{ nombreInstitucion }}</p>
    </div>

    <div
      v-else
      class="nombreInstitucion"
      style="display:flex; align-items:center; justify-content:center; gap:10px; min-height:44px; padding:6px 20px; border-radius:10px; background:linear-gradient(120deg, #046AE7 0%, #2f8ef0 100%); box-shadow:0 4px 12px rgba(4, 106, 231, 0.2); flex-wrap:wrap;"
    >
      <div class="institucion-texto" style="display:flex; align-items:center; gap:10px;">
        <i class="fa fa-graduation-cap institucion-icono" aria-hidden="true" style="color:#ffffff; font-size:16px; opacity:0.9;"></i>
        <p class="institucion-nombre" style="color:#ffffff; font-weight:600; letter-spacing:0.5px; text-align:center; margin:0; font-size:14px;">{{ nombreInstitucion }}</p>
      </div>
      <div class="institucion-logo-wrap" style="display:flex; align-items:center; background:#ffffff; border-radius:7px; padding:3px;">
        <img
          class="institucion-logo"
          style="height:32px; min-height:32px; border-radius:5px; display:block;"
          :src="dataUrl + 'archivos/' + 'instituciones_logos/' + imagenInsitucion"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstitutionBanner',
  props: {
    nombreInstitucion: {
      type: String,
      required: true
    },
    imagenInsitucion: {
      type: String,
      default: ''
    },
    dataUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.nombreInstitucion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 90px;
  padding: 16px 24px;
  border-radius: 14px;
  background: linear-gradient(120deg, #046AE7 0%, #2f8ef0 100%);
  box-shadow: 0 10px 25px rgba(4, 106, 231, 0.25);
}

.institucion-texto {
  display: flex;
  align-items: center;
  gap: 14px;
}

.institucion-icono {
  color: #ffffff;
  font-size: 26px;
  opacity: 0.9;
}

.institucion-nombre {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  margin: 0;
  font-size: 19px;
}

.institucion-logo-wrap {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 10px;
  padding: 4px;
}

.institucion-logo {
  height: 52px;
  min-height: 52px;
  border-radius: 8px;
  display: block;
}

@media (max-width: 576px) {
  .nombreInstitucion {
    flex-direction: column;
    gap: 10px;
    padding: 16px;
  }

  .institucion-nombre {
    font-size: 16px;
  }
}
</style>
