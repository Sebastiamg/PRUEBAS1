<template>
  <div class="gema-root gema-layout" :data-gema-theme="sesion.state.tema">
    <!-- Barra de suplantacion: siempre visible mientras root ve como otro -->
    <div v-if="sesion.state.impersonado" class="gema-imp">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
      <span>
        Viendo el modulo como <strong>{{ nombreUsuario }}</strong>
        <template v-if="sesion.state.actorReal">
          &mdash; sesion real de {{ sesion.state.actorReal.nombre_completo }}
        </template>
      </span>
      <button class="gema-btn is-sm gema-imp-btn" type="button" :disabled="saliendo" @click="salirImpersonacion">
        Volver a mi sesion
      </button>
    </div>

    <div class="gema-shell">
      <!-- =============================== MENU =============================== -->
      <aside class="gema-side" :class="{ 'is-min': menuMinimo }">
        <div class="gema-side-marca">
          <span class="gema-side-sigla">Gestion Estrategica</span>
          <button
            class="gema-btn is-quiet is-icon gema-side-toggle"
            type="button"
            :title="menuMinimo ? 'Expandir menu' : 'Contraer menu'"
            @click="alternarMenu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path :d="menuMinimo ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'" />
            </svg>
          </button>
        </div>

        <nav class="gema-side-nav">
          <div v-for="grupo in menu" :key="grupo.nombre" class="gema-side-grupo">
            <!-- Los grupos de configuracion vienen plegados: son 8 de las 19
                 opciones y casi no se tocan. Plegarlos deja a la vista solo el
                 trabajo del dia. -->
            <button
              v-if="!menuMinimo && grupo.plegable"
              class="gema-side-grupo-btn"
              type="button"
              @click="alternarGrupo(grupo.nombre)"
            >
              <span class="gema-eyebrow">{{ grupo.nombre }}</span>
              <span class="gema-side-chevron">{{ grupoAbierto(grupo.nombre) ? '−' : '+' }}</span>
            </button>

            <span
              v-else-if="!menuMinimo"
              class="gema-eyebrow gema-side-grupo-tit"
            >{{ grupo.nombre }}</span>

            <template v-if="grupoVisible(grupo)">
              <router-link
                v-for="item in grupo.items"
                :key="item.codigo"
                :to="{ name: item.ruta }"
                class="gema-side-item"
                :title="tituloItem(item)"
              >
                <!-- El numero es el mismo del asistente del inicio -->
                <span v-if="item.numero" class="gema-side-num" :class="'es-' + item.estado">
                  {{ item.numero }}
                </span>
                <feather-icon v-else :icon="item.icono" svg-classes="gema-side-icono" />

                <span v-if="!menuMinimo" class="gema-side-texto">{{ item.nombre }}</span>

                <span
                  v-if="!menuMinimo && item.estado === 'pendiente'"
                  class="gema-side-alerta"
                  title="Tiene algo pendiente aqui"
                ></span>
              </router-link>
            </template>
          </div>
        </nav>
      </aside>

      <!-- ============================== CONTENIDO ============================== -->
      <div class="gema-main">
        <header class="gema-top">
          <div class="gema-top-titulo">
            <span class="gema-h1">{{ tituloActual }}</span>
          </div>

          <div class="gema-spacer"></div>

          <button
            class="gema-btn is-quiet is-icon"
            type="button"
            :title="sesion.state.tema === 'dark' ? 'Tema claro' : 'Tema oscuro'"
            @click="sesion.alternarTema()"
          >
            <svg v-if="sesion.state.tema === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <path d="M20 14.5A8.5 8.5 0 019.5 4a7 7 0 100 14 8.5 8.5 0 0010.5-3.5z" />
            </svg>
          </button>

          <button
            v-if="sesion.esRoot && !sesion.state.impersonado"
            class="gema-btn is-quiet"
            type="button"
            @click="abrirImpersonar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
              <circle cx="12" cy="12" r="2.6" />
            </svg>
            Ver como
          </button>

          <div class="gema-top-sep"></div>

          <div class="gema-top-user">
            <div class="gema-top-user-txt">
              <span class="gema-top-user-nombre">{{ nombreUsuario }}</span>
              <span class="gema-top-user-rol">{{ perfilYUnidad }}</span>
            </div>
            <button class="gema-btn is-quiet is-icon" type="button" title="Cerrar sesion" @click="cerrarSesion">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </header>

        <main class="gema-body">
          <router-view />
        </main>
      </div>
    </div>

    <!-- ========================= PANEL: VER COMO ========================= -->
    <gema-panel :abierto="panelImp" titulo="Ver el modulo como otro colaborador" @cerrar="panelImp = false">
      <div class="gema-alert">
        Se abrira una sesion con la vista y los permisos de esa persona. Todo lo que
        haga queda registrado en auditoria con su nombre y el de usted.
      </div>

      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="busquedaImp" class="gema-input" type="text" placeholder="Nombre o cedula..." @input="buscarImpersonables" />
      </div>

      <div v-if="cargandoImp" class="gema-empty">Buscando...</div>

      <div v-else-if="!impersonables.length" class="gema-empty">
        <div class="gema-empty-title">Sin resultados</div>
        Solo aparecen colaboradores con perfil asignado en Gestion Estrategica.
      </div>

      <ul v-else class="gema-imp-lista">
        <li v-for="u in impersonables" :key="u.idusuario">
          <button class="gema-imp-item" type="button" @click="impersonar(u)">
            <span class="gema-imp-item-nombre">{{ u.nombres }} {{ u.apellidos }}</span>
            <span class="gema-imp-item-meta">
              {{ u.departamento || 'Sin unidad' }} &middot; {{ u.perfil_nombre }}
            </span>
          </button>
        </li>
      </ul>
    </gema-panel>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaPanel from '@/views/gema/componentes/GemaPanel.vue'

export default {
  name: 'GemaLayout',

  components: { GemaPanel },

  data () {
    return {
      sesion,
      menuMinimo: localStorage.getItem('gema_menu_min') === '1',
      // Lo que no es parte del proceso se guarda plegado al final del menu.
      GRUPO_EXTRA: 'Mas opciones',
      gruposAbiertos: JSON.parse(localStorage.getItem('gema_grupos_abiertos') || '[]'),
      panelImp: false,
      busquedaImp: '',
      impersonables: [],
      cargandoImp: false,
      saliendo: false,
      temporizadorBusqueda: null
    }
  },

  computed: {
    /**
     * El menu ES el proceso.
     *
     * Se arma desde las fases que calcula el backend, en el mismo orden y con el
     * mismo numero que el asistente del inicio, para que el 1 este arriba y el
     * ultimo abajo. Antes el menu iba agrupado por categoria y los numeros
     * quedaban salteados (10, 5, 6, 4, 3, 1...), que confunde mas que ayudar.
     *
     * Inicio va siempre primero, sin numero. Lo que la persona puede ver pero no
     * forma parte de su proceso (catalogos, perfiles, consultas de apoyo) cae en
     * un grupo plegado al final, tambien sin numero.
     */
    menu () {
      const porCodigo = {}
      sesion.state.secciones.forEach((s) => { porCodigo[s.codigo] = s })

      const grupos = []
      const usados = {}

      // 1) Inicio, siempre visible y sin numerar: es el punto de partida.
      if (porCodigo.dashboard) {
        grupos.push({ nombre: 'Inicio', plegable: false, items: [{ ...porCodigo.dashboard }] })
        usados.dashboard = true
      }

      // 2) Una fase del proceso = un grupo del menu, en orden.
      sesion.state.flujo.fases.forEach((fase) => {
        const items = []

        fase.pasos.forEach((paso) => {
          const seccion = porCodigo[paso.seccion]
          if (!seccion || usados[paso.seccion]) return

          // Marca TODAS las secciones que este paso representa (normalmente
          // solo la suya) — si un paso fusiona mas de una (ej. "mi_trabajo"),
          // ninguna de las dos debe reaparecer suelta en "Mas opciones".
          const cubiertas = paso.secciones || [paso.seccion]
          cubiertas.forEach((codigo) => { usados[codigo] = true })

          items.push({
            ...seccion,
            // El paso puede traer su propio nombre/ruta (ej. cuando junta mas
            // de una seccion en un solo paso del dia a dia) — si no trae, se
            // queda con los de la seccion, como siempre.
            nombre: paso.nombre || seccion.nombre,
            ruta: paso.ruta || seccion.ruta,
            numero: paso.numero,
            estado: paso.estado,
            detalle: paso.detalle
          })
        })

        if (items.length) grupos.push({ nombre: fase.nombre, plegable: false, items })
      })

      // 3) El resto, plegado. Sin flujo cargado todavia, cae aqui todo el menu.
      const resto = sesion.state.secciones.filter((s) => !usados[s.codigo])

      if (resto.length) {
        grupos.push({
          nombre: this.GRUPO_EXTRA,
          plegable: grupos.length > 1,
          items: resto.map((s) => ({ ...s }))
        })
      }

      return grupos
    },

    nombreUsuario () {
      return sesion.state.usuario ? sesion.state.usuario.nombre_completo : ''
    },

    perfilYUnidad () {
      const u = sesion.state.usuario
      if (!u) return ''

      const partes = []
      if (u.perfil) partes.push(u.perfil.nombre)
      if (u.departamento) partes.push(u.departamento)

      return partes.join(' · ')
    },

    tituloActual () {
      const seccion = sesion.state.secciones.find((s) => s.ruta === this.$route.name)

      return seccion ? seccion.nombre : (this.$route.meta && this.$route.meta.titulo) || 'Gestion Estrategica'
    }
  },

  created () {
    sesion.cargarFlujo()
  },

  watch: {
    // Al cambiar de pantalla se refresca el proceso: la accion que acaba de hacer
    // (validar, capturar, registrar) probablemente cambio el estado de algun paso.
    '$route.name' () {
      sesion.cargarFlujo(true)
    }
  },

  methods: {
    alternarMenu () {
      this.menuMinimo = !this.menuMinimo
      localStorage.setItem('gema_menu_min', this.menuMinimo ? '1' : '0')
    },

    grupoAbierto (nombre) {
      return this.gruposAbiertos.includes(nombre)
    },

    /** Un grupo plegado igual se abre si trae la pantalla en la que estoy. */
    grupoVisible (grupo) {
      if (!grupo.plegable || this.menuMinimo) return true
      if (this.grupoAbierto(grupo.nombre)) return true

      return grupo.items.some((i) => i.ruta === this.$route.name)
    },

    alternarGrupo (nombre) {
      const i = this.gruposAbiertos.indexOf(nombre)

      if (i === -1) {
        this.gruposAbiertos.push(nombre)
      } else {
        this.gruposAbiertos.splice(i, 1)
      }

      localStorage.setItem('gema_grupos_abiertos', JSON.stringify(this.gruposAbiertos))
    },

    tituloItem (item) {
      if (!item.numero) return item.nombre

      return `Paso ${item.numero} · ${item.nombre}` + (item.detalle ? ` — ${item.detalle}` : '')
    },

    async cerrarSesion () {
      try {
        await api.post('auth/logout')
      } catch (e) {
        // Da igual si el token ya no era valido: igual se limpia local.
      }

      sesion.limpiar()
      this.$router.replace({ name: 'gema-login' }).catch(() => {})
    },

    // ---------------------------------------------------------------------
    // Suplantacion
    // ---------------------------------------------------------------------

    abrirImpersonar () {
      this.panelImp = true
      this.busquedaImp = ''
      this.buscarImpersonables()
    },

    buscarImpersonables () {
      clearTimeout(this.temporizadorBusqueda)

      this.temporizadorBusqueda = setTimeout(async () => {
        this.cargandoImp = true

        try {
          const r = await api.get('auth/impersonables', { q: this.busquedaImp })
          this.impersonables = r.data
        } catch (e) {
          this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
        } finally {
          this.cargandoImp = false
        }
      }, 250)
    },

    async impersonar (usuario) {
      try {
        const r = await api.post('auth/impersonar', { idusuario: usuario.idusuario })
        sesion.aplicar(r.data)
        this.panelImp = false

        // La vista actual puede haber quedado sin permiso: se vuelve al inicio.
        this.$router.replace({ name: 'gema-dashboard' }).catch(() => {})
        this.$vs.notify({ title: 'Vista cambiada', text: r.message, color: 'primary' })
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo cambiar', text: e.message, color: 'danger' })
      }
    },

    async salirImpersonacion () {
      this.saliendo = true

      try {
        const r = await api.post('auth/impersonar/salir')
        sesion.aplicar(r.data)
        this.$router.replace({ name: 'gema-dashboard' }).catch(() => {})
        this.$vs.notify({ title: 'De vuelta', text: r.message, color: 'primary' })
      } catch (e) {
        sesion.limpiar()
        this.$router.replace({ name: 'gema-login' }).catch(() => {})
      } finally {
        this.saliendo = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gema-canvas);
}

// --- Aviso de suplantacion ------------------------------------------------
.gema-imp {
  display: flex;
  align-items: center;
  gap: var(--gema-u2);
  height: 30px;
  padding: 0 var(--gema-u3);
  font-size: var(--gema-fs-sm);
  color: var(--gema-ambar);
  background: var(--gema-ambar-soft);
  border-bottom: 1px solid var(--gema-border);
  flex: none;

  svg { width: 14px; height: 14px; flex: none; }
  strong { font-weight: 600; }
}

.gema-imp-btn {
  margin-left: auto;
  height: 22px;
  background: transparent;
  border-color: currentColor;
  color: inherit;
}

.gema-shell {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}

// --- Menu lateral ----------------------------------------------------------
.gema-side {
  width: var(--gema-sidebar-w);
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--gema-surface);
  border-right: 1px solid var(--gema-border);
  transition: width 0.14s ease;

  &.is-min { width: var(--gema-sidebar-w-min); }
}

.gema-side-marca {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--gema-header-h);
  padding: 0 var(--gema-u2) 0 var(--gema-u3);
  border-bottom: 1px solid var(--gema-border);
  flex: none;
  overflow: hidden;
}

.gema-side-sigla {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--gema-accent-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.gema-side.is-min .gema-side-sigla { display: none; }
.gema-side.is-min .gema-side-toggle { margin: 0 auto; }

.gema-side-nav {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: var(--gema-u2) 0;
}

.gema-side-grupo { margin-bottom: var(--gema-u2); }

.gema-side-grupo-tit {
  display: block;
  padding: var(--gema-u) var(--gema-u3) 3px;
}

// Cabecera de un grupo plegable
.gema-side-grupo-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--gema-u) var(--gema-u3) 3px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;

  &:hover .gema-eyebrow { color: var(--gema-text-2); }
  &:focus-visible { outline: 2px solid var(--gema-accent); outline-offset: -2px; }
}

.gema-side-chevron {
  font-size: var(--gema-fs-md);
  line-height: 1;
  color: var(--gema-text-3);
}

// El numero de paso: el mismo que muestra el asistente del inicio
.gema-side-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex: none;
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--gema-text-2);
  background: var(--gema-surface-3);
  border-radius: 50%;

  &.es-listo { background: var(--gema-verde-soft); color: var(--gema-verde); }
  &.es-pendiente { background: var(--gema-ambar-soft); color: var(--gema-ambar); }
  &.es-bloqueado { background: var(--gema-rojo-soft); color: var(--gema-rojo); }
}

// Punto de aviso a la derecha: aqui hay algo que hacer
.gema-side-alerta {
  width: 6px;
  height: 6px;
  margin-left: auto;
  flex: none;
  border-radius: 50%;
  background: var(--gema-ambar);
}

.gema-side-item {
  display: flex;
  align-items: center;
  gap: var(--gema-u2);
  height: 30px;
  padding: 0 var(--gema-u3);
  font-size: var(--gema-fs);
  color: var(--gema-text-2);
  text-decoration: none;
  border-left: 2px solid transparent;

  &:hover { background: var(--gema-surface-3); color: var(--gema-text); }

  // El activo se marca con una barra de 2px, no con un fondo de color fuerte.
  &.router-link-exact-active {
    color: var(--gema-accent-text);
    background: var(--gema-accent-soft);
    border-left-color: var(--gema-accent);
    font-weight: 500;
  }
}

.gema-side.is-min .gema-side-item { justify-content: center; padding: 0; }

.gema-side-texto { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

// --- Cabecera --------------------------------------------------------------
.gema-main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.gema-top {
  display: flex;
  align-items: center;
  gap: var(--gema-u2);
  height: var(--gema-header-h);
  padding: 0 var(--gema-u3);
  background: var(--gema-surface);
  border-bottom: 1px solid var(--gema-border);
  flex: none;
}

.gema-top-sep {
  width: 1px;
  height: 22px;
  background: var(--gema-border);
  margin: 0 var(--gema-u);
}

.gema-top-user { display: flex; align-items: center; gap: var(--gema-u2); }

.gema-top-user-txt {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.25;
}

.gema-top-user-nombre { font-size: var(--gema-fs-sm); font-weight: 600; }
.gema-top-user-rol { font-size: var(--gema-fs-xs); color: var(--gema-text-3); }

.gema-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: var(--gema-u3);
}

// --- Lista de suplantables --------------------------------------------------
.gema-imp-lista {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
  overflow: hidden;
}

.gema-imp-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  padding: 6px var(--gema-u3);
  text-align: left;
  background: var(--gema-surface);
  border: none;
  border-bottom: 1px solid var(--gema-border);
  cursor: pointer;
  font-family: inherit;

  &:hover { background: var(--gema-surface-3); }
}

.gema-imp-lista li:last-child .gema-imp-item { border-bottom: none; }

.gema-imp-item-nombre { font-size: var(--gema-fs); color: var(--gema-text); }
.gema-imp-item-meta { font-size: var(--gema-fs-xs); color: var(--gema-text-3); }

@media (max-width: 720px) {
  .gema-side { width: var(--gema-sidebar-w-min); }
  .gema-side-sigla, .gema-side-texto, .gema-side-grupo-tit { display: none; }
  .gema-side-item { justify-content: center; padding: 0; }
  .gema-top-user-txt { display: none; }
}
</style>
