<template>
  <div>
    <div>
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      ">
        <vs-button type="gradient" class="mb-2" @click="title = 'Devolución Códigos'; menu = 0;"
          :style="menu === 0 ? { backgroundColor: '#000' } : { backgroundColor: '#85c1e9' }">
          <i class="fa-solid fa-right-left"></i> Devolución
        </vs-button>
        <vs-button type="gradient" class="mb-2" @click="title = ' Devolución Combos sueltos'; menu = 1;"
          :style="menu === 1 ? { backgroundColor: '#000' } : { backgroundColor: '#85c1e9' }">
          <i class="fa-solid fa-right-left"></i> Devolución Combos sueltos
        </vs-button>
        <vs-button type="gradient" class="mb-2" @click="title = 'Devolver Códigos por documentos'; menu = 2;"
          :style="menu === 2 ? { backgroundColor: '#000' } : { backgroundColor: '#85c1e9' }">
          <i class="fa-solid fa-square-check"></i> Devolución documentos
        </vs-button>
      </div>
      <br>
      <vx-card :title="title">
        <!--components-->
        <div v-if="menu == 0">
          <div class="info-card mb-4">
            <div class="info-card-icon">
              <i class="fa-solid fa-info-circle"></i>
            </div>
            <div class="info-card-content">
              <h4 class="info-card-title">Información del proceso</h4>
              <p class="info-card-text">Devolución de códigos: no se generan documentos, tampoco se devuelve STOCK</p>
            </div>
          </div>
          <DevolucionBodegaSinDocumentosVue />
        </div>
        <!--Devolución Códigos-->
        <div v-if="menu == 1">
          <div class="info-card mb-4">
            <div class="info-card-icon">
              <i class="fa-solid fa-info-circle"></i>
            </div>
            <div class="info-card-content">
              <h4 class="info-card-title">Información del proceso</h4>
              <p class="info-card-text">Genera documentos de los códigos que fueron despachados por combos. Este proceso
                también genera los correspondientes documentos.</p>
            </div>
          </div>
          <ScreenDevolucionNormalVue />
        </div>
        <!--Devolver Códigos por documentos-->
        <div v-if="menu == 2">
          <div class="info-card mb-4">
            <div class="info-card-icon">
              <i class="fa-solid fa-info-circle"></i>
            </div>
            <div class="info-card-content">
              <h4 class="info-card-title">Información del proceso</h4>
              <p class="info-card-text">Devolución de combos con documentos. Este proceso también incluye la generación
                de los mismos.</p>
            </div>
          </div>
          <ImportLimpiarDataVue />
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
const ScreenDevolucionNormalVue = () => import('./ScreenDevolucionNormal.vue');
const ImportLimpiarDataVue = () => import('../../../codigos/components/ImportLimpiarData.vue');
const DevolucionBodegaSinDocumentosVue = () => import('./DevolucionBodegaSinDocumentos.vue')
export default {
  components: {
    ScreenDevolucionNormalVue,
    ImportLimpiarDataVue,
    DevolucionBodegaSinDocumentosVue
  },
  data() {
    return {
      menu: 0,
      title: 'Devolución Códigos'
    }
  },
}
</script>

<style scoped>
.info-card {
  display: flex;
  align-items: flex-start;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #0ea5e9;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.info-card-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.info-card-icon i {
  font-size: 20px;
  color: #ffffff;
}

.info-card-content {
  flex: 1;
}

.info-card-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.info-card-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
