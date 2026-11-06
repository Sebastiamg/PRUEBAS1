<template>
  <vx-card class='vx-col w-full mt-4'>
    <section>
      <vs-button class="m-2 mb-2" color="success" type="gradient"
        @click="ObjectSelect = ''; id = 0; setSave();">Agregar
      </vs-button>
    </section>
    <section name="lista">
      <vs-table max-items="10" stripe search pagination :data="listaEmpresas">
        <template slot="thead">
          <vs-th>Id</vs-th>
          <vs-th>Nombre</vs-th>
          <vs-th>Direccion</vs-th>
          <vs-th>Email</vs-th>
          <vs-th>Secuencial</vs-th>
          <vs-th>% Acta/Guías</vs-th>
          <vs-th>Entorno Perseo</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{ tr.id }}
            </vs-td>
            <vs-td>
              <b>Nombre:</b>
              <p>{{ tr.nombre }}</p>
              <b>Descripción Corta</b>
              <p>{{ tr.descripcion_corta }}</p>
              <b>RUC:</b>
              <p>{{ tr.ruc }}</p>
              <b>Representante:</b>
              <p>{{ tr.representante }}</p>
              <p v-if="!tr.archivo">
                <b class="text-danger"> Logo: No subida </b>
              </p>
              <p v-else class="imagen cursor-pointer" @click="openDocument(tr)">
                <b> Logo:
                  <!--PDF-->
                  <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'"
                    style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                  <!--IMAGE-->
                  <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;"
                    name="camera-outline"></ion-icon>
                </b>
              </p>
              <b>Token Local:</b>
              <p>{{ tr.token_local }}</p>
              <b>Token producción:</b>
              <p>{{ tr.token_prod }}</p>
              <p class="mt-1"></p>
              <!-- <b>
                Base 64:
              </b> -->
              <p v-if="tr.img_base64">
                <!-- {{ truncateBase64(tr.img_base64) }}
                <vs-button v-if="tr.img_base64 && tr.img_base64.length > 50" size="small" color="primary" type="flat"
                  @click="openBase64Modal(tr)">
                  Ver más...
                </vs-button> -->
              </p>
              <p v-else class="text-muted text-danger">
                Base 64 No disponible
              </p>
            </vs-td>
            <vs-td>
              {{ tr.direccion }}<br>
              {{ tr.telefono }}
            </vs-td>
            <vs-td>
              {{ tr.email }}<br>
              <span v-if="tr.tipo == 0"> Matriz </span>
              <span v-if="tr.tipo == 1"> Sucursal </span>
            </vs-td>
            <vs-td>
              {{ tr.secuencial }}<br>
            </vs-td>
            <vs-td>
              {{ tr.porcentaje_acta_guias != null ? tr.porcentaje_acta_guias + '%' : '-' }}
            </vs-td>
            <vs-td>
              <div class="perseo-badge cursor-pointer"
                   :class="tr.perseo_enviroment == 1 ? 'badge-production' : 'badge-local'"
                   @click="ObjectSelect = tr; id = tr.id; setSave(tr);">
                <i :class="tr.perseo_enviroment == 1 ? 'fa-solid fa-cloud' : 'fa-solid fa-laptop-code'"></i>
                <span>{{ tr.perseo_enviroment == 1 ? 'Producción' : 'Local' }}</span>
              </div>
            </vs-td>
            <vs-td :data="tr.secuencia">
              <vs-button size="large" icon-pack="feather" icon="icon-edit" color="orange"
                @click="ObjectSelect = tr; id = tr.id; setSave(tr);"> </vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </section>
    <vs-popup classContent="popup-example" :title="id == 0 ? 'Guardar Empresa' : 'Editar Empresa'"
      :active.sync="popupEdit">
      <CrearEditarVue v-if="popupEdit" :ObjectSelect="ObjectSelect" :id="id" @f_creado="f_recarga"
        :data_conf="data_conf" />
    </vs-popup>

    <!-- Modal para cambiar Entorno de Perseo por Empresa -->
    <vs-popup title="Cambiar Entorno de Perseo" :active.sync="popupPerseoEmpresa">
      <div class="perseo-empresa-config" v-if="selectedEmpresaPerseo">
        <div class="empresa-header mb-4">
          <h4 class="text-center font-semibold">{{ selectedEmpresaPerseo.nombre }}</h4>
          <p class="text-center text-muted">{{ selectedEmpresaPerseo.ruc }}</p>
        </div>

        <div class="config-options mb-6">
          <div class="env-option-card mb-3" :class="{'active': perseoEnviromentEmpresa == 0}" @click="perseoEnviromentEmpresa = 0">
            <vs-radio v-model="perseoEnviromentEmpresa" vs-name="radiosPerseoEmpresa" :vs-value="0">
              <div class="flex items-center">
                <i class="fa-solid fa-laptop-code mr-3" style="font-size: 24px; color: #7367f0;"></i>
                <div>
                  <span class="font-semibold">Local</span>
                  <p class="text-muted text-sm">Entorno de desarrollo</p>
                </div>
              </div>
            </vs-radio>
          </div>
          <div class="env-option-card" :class="{'active': perseoEnviromentEmpresa == 1}" @click="perseoEnviromentEmpresa = 1">
            <vs-radio v-model="perseoEnviromentEmpresa" vs-name="radiosPerseoEmpresa" :vs-value="1">
              <div class="flex items-center">
                <i class="fa-solid fa-cloud mr-3" style="font-size: 24px; color: #28c76f;"></i>
                <div>
                  <span class="font-semibold">Producción</span>
                  <p class="text-muted text-sm">Entorno en vivo</p>
                </div>
              </div>
            </vs-radio>
          </div>
        </div>

        <div class="flex" style="justify-content: center;">
          <vs-button class="mr-3" color="primary" type="gradient" @click="savePerseoEmpresa()">
            <i class="fa-solid fa-save mr-1"></i> Guardar
          </vs-button>
          <vs-button color="danger" type="flat" @click="popupPerseoEmpresa = false">
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- Modal para mostrar Base64 e Imagen -->
    <div class="demo-alignment">
      <vs-popup title="Imagen y Base64" :active.sync="base64Modal">
        <div v-if="selectedEmpresa">
          <!-- Información de la empresa -->
          <div class="empresa-info mb-4">
            <h4 class="empresa-title">{{ selectedEmpresa.nombre }}</h4>
            <p class="empresa-subtitle">{{ selectedEmpresa.ruc }}</p>
          </div>

          <!-- Mostrar imagen si existe -->
          <div v-if="selectedEmpresa.img_base64 && !imageError" class="imagen-container mb-4">
            <div class="imagen-preview">
              <img :src="selectedEmpresa.img_base64" alt="Logo empresa" @error="imageError = true" />
            </div>
          </div>

          <!-- Error de imagen -->
          <div v-if="imageError" class="error-container mb-4">
            <vs-chip color="danger" icon-pack="feather" icon="icon-alert-triangle">
              Error al cargar la imagen. El formato base64 puede no ser válido.
            </vs-chip>
          </div>
          <!-- Código Base64 -->
          <div class="base64-container">
            <div class="base64-header">
              <h5 class="base64-title">Código Base64:</h5>
              <vs-button size="small" color="primary" type="flat" @click="copyToClipboard(selectedEmpresa.img_base64)">
                <i class="feather icon-copy"></i> Copiar
              </vs-button>
            </div>
            <div class="base64-content">
              <vs-textarea label="Código Base64 completo" :value="selectedEmpresa.img_base64" readonly rows="12" />
            </div>
          </div>
        </div>
      </vs-popup>
    </div>
  </vx-card>
</template>

<script>
const CrearEditarVue = () => import('./crear-editar.vue')
export default {
  components: {
    CrearEditarVue
  },
  data() {
    return {
      id: 0,
      listaEmpresas: [],
      popupEdit: false,
      popupPerseoEmpresa: false,
      selectedEmpresaPerseo: null,
      perseoEnviromentEmpresa: 0,
      base64Modal: false,
      selectedEmpresa: null,
      imageError: false,
      data_conf: {
        titulo_modal: '',
        color_boton: '',
      },
      ObjectSelect: ''
    };
  },
  created() { },
  mounted() {
    let me = this;
    me.getEmpresas();
  },
  methods: {
    openDocument(tr) {
      let me = this;
      let ruta = me.$data_url + 'archivos/facturacion/empresa/' + tr.url
      window.open(ruta, '_blank')
    },
    setSave(dato) {
      let me = this;
      me.data_conf = {
        titulo_modal: '',
        color_boton: '',
      }
      if (dato != null) {
        me.data_conf = {
          titulo_modal: "Editar empresa",
          color_boton: "orange",
          tipo: 0, //edita
        }

      } else {
        me.data_conf = {
          titulo_modal: "Agregar empresa",
          color_boton: "success",
          tipo: 1, //nuevo registro
        }
      }
      me.popupEdit = true;
    },
    getEmpresas() {
      let me = this;
      me.listaEmpresas = []
      me.$vs.loading();
      this.$http.get(this.$server_url + 'empresa')
        .then(res => {
          // console.log(res.data)
          me.listaEmpresas = res.data;
          me.$vs.loading.close();
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
    },
    f_recarga(e) {
      let me = this;
      console.log(e)
      me.popupEdit = false;
      if (e == 1) {
        me.getEmpresas();
      }
    },
    truncateBase64(base64String) {
      if (!base64String) return '';
      if (base64String.length <= 50) return base64String;
      return base64String.substring(0, 50) + '...';
    },
    openBase64Modal(empresa) {
      let me = this;
      me.selectedEmpresa = empresa;
      me.imageError = false;
      me.base64Modal = true;
    },
    copyToClipboard(text) {
      let me = this;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          me.$vs.notify({
            title: 'Copiado',
            text: 'Base64 copiado al portapapeles',
            color: 'success'
          });
        }).catch(() => {
          me.$vs.notify({
            title: 'Error',
            text: 'No se pudo copiar al portapapeles',
            color: 'danger'
          });
        });
      } else {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          me.$vs.notify({
            title: 'Copiado',
            text: 'Base64 copiado al portapapeles',
            color: 'success'
          });
        } catch (err) {
          me.$vs.notify({
            title: 'Error',
            text: 'No se pudo copiar al portapapeles',
            color: 'danger'
          });
        }
        document.body.removeChild(textArea);
      }
    },
    openPerseoConfigForEmpresa(empresa) {
      let me = this;
      me.selectedEmpresaPerseo = empresa;
      me.perseoEnviromentEmpresa = empresa.perseo_enviroment || 0;
      me.popupPerseoEmpresa = true;
    },
    savePerseoEmpresa() {
      let me = this;
      me.$vs.loading();
      me.$http.post(me.$server_url + 'empresa/updatePerseoEnviroment', {
        id: me.selectedEmpresaPerseo.id,
        perseo_enviroment: me.perseoEnviromentEmpresa
      })
        .then(res => {
          me.$vs.loading.close();
          if (res.data.status == "1" || res.data.success) {
            me.$vs.notify({
              title: 'Éxito',
              text: 'Entorno de Perseo actualizado correctamente',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            });
            me.selectedEmpresaPerseo.perseo_enviroment = me.perseoEnviromentEmpresa;
            me.popupPerseoEmpresa = false;
          } else {
            me.$vs.notify({
              title: 'Error',
              text: res.data.message || 'No se pudo actualizar',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            });
          }
        })
        .catch(err => {
          console.log(err);
          me.$vs.loading.close();
          me.$vs.notify({
            title: 'Error',
            text: 'Error al actualizar el entorno de Perseo',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
        });
    },
  }
};
</script>

<style scoped>
/* Información de la empresa */
.empresa-info {
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.empresa-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.empresa-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Contenedor de imagen */
.imagen-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.imagen-preview {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px;
  background-color: #f9fafb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  width: 100%;
}

.imagen-preview img {
  max-width: 100%;
  max-height: 150px;
  width: auto;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

/* Contenedor de error */
.error-container {
  text-align: center;
  padding: 16px;
  background-color: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

/* Contenedor Base64 */
.base64-container {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 16px;
  background-color: #f9fafb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.base64-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.base64-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* Estilos para vs-textarea */
.base64-textarea {
  width: 100%;
}

:deep(.base64-textarea .vs-textarea) {
  width: 100%;
}

:deep(.base64-textarea .vs-textarea textarea) {
  font-family: 'Courier New', monospace !important;
  font-size: 11px !important;
  line-height: 1.4 !important;
  min-height: 300px !important;
  height: 300px !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  overflow-wrap: break-word !important;
  resize: vertical !important;
}

/* Modal más grande */
:deep(.popup-base64-large) {
  max-width: 90vw !important;
  width: 800px !important;
}

:deep(.popup-base64-large .vs-popup) {
  max-width: 90vw !important;
  width: 800px !important;
}

/* Utilidades */
.mb-4 {
  margin-bottom: 1rem;
}

.text-muted {
  color: #6b7280;
  font-style: italic;
}

/* Estilos para configuración de Perseo */
.perseo-config-container {
  padding: 16px;
  min-width: 400px;
}

.config-description {
  text-align: center;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.config-options {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.font-semibold {
  font-weight: 600;
}

/* Estilos para badge de Entorno Perseo */
.perseo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.perseo-badge i {
  font-size: 14px;
}

.badge-local {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.badge-production {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(56, 239, 125, 0.4);
}

.perseo-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Estilos para modal de Perseo por Empresa */
.perseo-empresa-config {
  padding: 16px;
  min-width: 350px;
}

.empresa-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.env-option-card {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.env-option-card:hover {
  border-color: #7367f0;
  background: rgba(115, 103, 240, 0.05);
}

.env-option-card.active {
  border-color: #7367f0;
  background: rgba(115, 103, 240, 0.1);
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.2);
}

.text-sm {
  font-size: 12px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
