<template>
    <div>
        <vx-card>
            <div class="flex p-2" style="flex-wrap:wrap;">
              <vs-button color="primary"            v-if="userRoot || userAsesor" @click="vSeccionImportB = 1" class="m-2" type="border">Pasar a estado leido</vs-button>
              <vs-button color="success"            v-if="userRoot" @click="vSeccionImportB = 2" class="m-2" type="border">Gestión bodega códigos</vs-button>
              <vs-button color="warning"            v-if="userRoot" @click="vSeccionImportB = 3" class="m-2" type="border">Revision códigos</vs-button>
              <vs-button color="rgb(178, 81, 227)"  v-if="userRoot" @click="vSeccionImportB = 4" class="m-2" type="border">Import Devoluciones</vs-button>
              <vs-button color="rgb(11, 189, 135)"  v-if="userRoot" @click="vSeccionImportB = 5" class="m-2" type="border">Activar Devoluciones</vs-button>
              <vs-button color="danger"             v-if="userRoot" @click="vSeccionImportB = 6" class="m-2" type="border">Eliminar códigos</vs-button>
              <vs-button color="dark"               v-if="userRoot" @click="vSeccionImportB = 7" class="m-2" type="border">Cambiar periodo del códigos</vs-button>
              <vs-button color="danger"             v-if="userRoot" @click="vSeccionImportB = 8" class="m-2" type="border">Guillotina códigos</vs-button>
              <vs-button color="primary"            v-if="userRoot" @click="vSeccionImportB = 9" class="m-2" type="border">Resetear campos</vs-button>
              <vs-button color="primary"            v-if="userRoot" @click="vSeccionImportB = 10" class="m-2" type="border">Resetear campos Import</vs-button>
              <vs-button color="dark"               v-if="userRoot" @click="vSeccionImportB = 11" class="m-2" type="border">Ingresar códigos</vs-button>
              <vs-button color="#ff5733"            v-if="userRoot" @click="vSeccionImportB = 12" class="m-2" type="border">Ingresar Guías</vs-button>
            </div>
            <br/>
            <!--IMPORT PASAR A LEIDO-->
            <div v-if="vSeccionImportB == 1">
              <vs-tabs alignment="fixed">
                <vs-tab :label="userRoot ? 'Venta lista' : 'Import Pasar a leidos'">
                  <div>
                    <importCodigosVue/>
                  </div>
                </vs-tab>
                <vs-tab label="Venta directa" v-if="userRoot">
                  <div>
                    <PasarLeidosVentaDirectaVue/>
                  </div>
                </vs-tab>
              </vs-tabs>
            </div>
            <!--IMPORT GESTION BODEGA CODIGOS-->
            <div v-if="vSeccionImportB == 2">
                <BloqueadorCodigosVue class="mt-1" v-if="userRoot == true"/>
            </div>
            <!--IMPORT REVISION CODIGOS-->
            <div v-if="vSeccionImportB == 3">
                <RevisionCodigosVue class="mt-1"/>
            </div>
            <!--IMPORT DEVOLUCIONES-->
            <div v-if="vSeccionImportB == 4">
                <!-- <ImportLimpiarDataVue class="mt-1"  v-if="userRoot == true"/> -->
                <div v-if="userRoot == true">
                  <BodegaMenuDevolucionVue/>
                </div>
            </div>
            <!--IMPORT ACTIVAR DEVOLUCIONES-->
            <div v-if="vSeccionImportB == 5">
                <ImportActivarDevolucionVue class="mt-1" v-if="userRoot == true"/>
            </div>
            <!--IMPORT ELIMINAR CODIGOS-->
            <div v-if="vSeccionImportB == 6">
                <EliminarCodigosVue class="mt-1" v-if="userRoot == true"/>
            </div>
            <!--IMPORT CAMBIAR  PERIODO CODIGOS-->
            <div v-if="vSeccionImportB == 7">
                <importPeriodoVue class="mt-1" v-if="userRoot == true"/>
            </div>
            <!--IMPORT BLOQUEAR CODIGOS-->
            <div v-if="vSeccionImportB == 8">
                <ImportBloquearVue class="mt-1" v-if="userRoot == true"/>
            </div>
            <!--IMPORT RESETAR CODIGOS-->
            <div v-if="vSeccionImportB == 9">
              <ResetearCamposVue style="margin-top: -20px;" v-if="userRoot == true"/>
            </div>
            <!--IMPORT RESETAR CODIGOS-->
            <div v-if="vSeccionImportB == 10">
              <ResetearCamposImportVue style="margin-top: -20px;" v-if="userRoot == true"/>
            </div>
            <!--IMPORT INGRESAR CODIGOS-->
            <div v-if="vSeccionImportB == 11">
              <ImportIngresarCodigosVue style="margin-top: -20px;" v-if="userRoot == true"/>
            </div>
            <!--IMPORT INGRESAR GUIAS-->
            <div v-if="vSeccionImportB == 12">
              <GuiasImportAsignacionVue style="margin-top: -20px;" v-if="userRoot == true"/>
            </div>
        </vx-card>
    </div>
</template>
<script>
import {
  mapState
} from "vuex";
const importCodigosVue              = () => import('./importCodigos.vue')
const BloqueadorCodigosVue          = () => import('./BloqueadorCodigos.vue')
const RevisionCodigosVue            = () => import('./RevisionCodigos.vue')
const ImportLimpiarDataVue          = () => import('./ImportLimpiarData.vue')
const ImportActivarDevolucionVue    = () => import('./ImportActivarDevolucion.vue')
const EliminarCodigosVue            = () => import('./EliminarCodigos.vue')
const importPeriodoVue              = () => import('./importPeriodo')
const ImportBloquearVue             = () => import('./ImportBloquear.vue')
const ResetearCamposVue             = () => import('./ResetearCampos.vue')
const ResetearCamposImportVue       = () => import('./ResetearCamposImport.vue')
const PasarLeidosVentaDirectaVue    = () => import('./utils/PasarLeidosVentaDirecta.vue')
const ImportIngresarCodigosVue      = () => import('@/views/codigos/components/ImportIngresarCodigos')
const BodegaMenuDevolucionVue       = () => import('../../bodega/codigos/components/BodegaMenuDevolucion.vue')
const GuiasImportAsignacionVue      = () => import('@/views/codigos/guias/GuiasImportAsignacion.vue')
export default{
  components:{
    importCodigosVue,
    BloqueadorCodigosVue,
    RevisionCodigosVue,
    ImportLimpiarDataVue,
    ImportActivarDevolucionVue,
    EliminarCodigosVue,
    importPeriodoVue,
    ImportBloquearVue,
    ResetearCamposVue,
    ResetearCamposImportVue,
    PasarLeidosVentaDirectaVue,
    ImportIngresarCodigosVue,
    BodegaMenuDevolucionVue,
    GuiasImportAsignacionVue,
  },
  data(){
      return{
        usuario:[],
        vSeccionImportB:1,
      }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','userAsesor']),
  },
  created(){
      let me = this;
      me.usuario = me.susuario
  },
  mounted(){
    let me = this;
    if(me.userRoot) { me.menu = 1;}
  },

  methods:{
  }
}
</script>
