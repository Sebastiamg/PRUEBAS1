<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-btn-group">
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'resumen' }" type="button" @click="vista = 'resumen'">
          Resumen
        </button>
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'registro' }" type="button" @click="vista = 'registro'">
          Registro
        </button>
      </div>
      <span class="gema-faint gema-trabajo-nota">
        {{ vista === 'resumen'
          ? 'Como va su plan de hoy y sus actividades de este rango.'
          : 'Registre aqui su jornada: si fue produccion, vinculela al libro/etapa.' }}
      </span>
    </div>

    <!-- Produccion ya no tiene registro propio (se registra desde "Otras
         actividades", vinculado a la tarea): solo aporta algo en "Resumen". -->
    <template v-if="puedeProduccion && vista === 'resumen'">
      <span v-if="mostrarAmbos" class="gema-eyebrow gema-trabajo-grupo">Producción</span>
      <mi-avance />
    </template>

    <template v-if="puedeActividades">
      <span v-if="mostrarAmbos && vista === 'resumen'" class="gema-eyebrow gema-trabajo-grupo">Otras actividades</span>
      <mis-actividades :vista="vista" />
    </template>

    <!-- Continuidad del proceso: en que paso va y cual sigue. Una sola barra
         para las dos, porque el backend (GemaFlujo::faseCadaDia) ya las junto
         en un solo paso "mi_trabajo" — mostrar dos aqui volveria a partirlo. -->
    <gema-siguiente :seccion="seccionSiguiente" />
  </div>
</template>

<script>
import sesion from '@/services/gema/gemaSesion'
import MiAvance from './MiAvance.vue'
import MisActividades from './MisActividades.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

/**
 * "Mi avance" (produccion) y "Mis actividades" (todo lo demas) vivian como dos
 * pantallas separadas — confuso para el colaborador, que tenia que adivinar a
 * cual de las dos ir. Este componente las junta en un solo lugar.
 *
 * El eje de navegacion es "Resumen" (todo lo visual: tiles, tablas de hoy,
 * historico) vs "Registro" (donde de verdad se registra algo, produccion u
 * otra actividad) — no "produccion" vs "otras actividades": esas dos siempre
 * se muestran juntas, una debajo de otra, para no obligar a cambiar de
 * pestaña solo para ver o registrar el otro tipo. Los dos permisos
 * (`plan_avance`, `actividades_registro`) se siguen respetando por separado
 * — si a alguien solo le dieron uno de los dos, aqui solo ve ese bloque.
 */
export default {
  name: 'GemaMiTrabajo',

  components: { MiAvance, MisActividades, GemaSiguiente },

  data () {
    return {
      vista: 'resumen'
    }
  },

  computed: {
    puedeProduccion () { return sesion.puede('plan_avance', 'ver') },
    puedeActividades () { return sesion.puede('actividades_registro', 'ver') },
    mostrarAmbos () { return this.puedeProduccion && this.puedeActividades },

    // Mismo criterio que usa el backend para elegir la seccion del paso
    // fusionado (ver GemaFlujo::faseCadaDia): si tiene actividades_registro,
    // esa es la seccion del paso; si no, cae a plan_avance.
    seccionSiguiente () {
      return this.puedeActividades ? 'actividades_registro' : 'plan_avance'
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-trabajo-nota { font-size: var(--gema-fs-xs); }

.gema-trabajo-grupo {
  display: block;
  margin: var(--gema-u4) 0 var(--gema-u2);

  &:first-of-type { margin-top: 0; }
}
</style>
