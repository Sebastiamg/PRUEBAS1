/**
 * Sesion del modulo GEMA.
 *
 * Estado reactivo compartido (Vue.observable, sin tocar el store global de la
 * plataforma) con: token, usuario efectivo, permisos, secciones visibles, actor
 * real cuando root esta suplantando, y el tema claro/oscuro.
 *
 * Lo unico que se persiste en localStorage es el token y el tema. El resto se
 * vuelve a pedir a `auth/me` en cada carga, para que un cambio de permisos surta
 * efecto sin que el usuario tenga que volver a entrar.
 */

import Vue from 'vue'

const LLAVE_TOKEN = 'gema_token'
const LLAVE_TEMA = 'gema_tema'

function temaGuardado () {
  const guardado = localStorage.getItem(LLAVE_TEMA)

  if (guardado === 'dark' || guardado === 'light') {
    return guardado
  }

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const state = Vue.observable({
  token: localStorage.getItem(LLAVE_TOKEN) || null,
  usuario: null,
  permisos: {},
  secciones: [],
  actorReal: null,
  impersonado: false,
  tema: temaGuardado(),
  cargando: false,

  // El proceso guiado. Se pide UNA vez y lo comparten el menu, el asistente del
  // inicio y la barra de continuidad, para que los tres muestren el mismo numero
  // de paso y no se hagan 12 peticiones iguales al navegar.
  flujo: { fases: [], siguiente: null, resumen: { total: 0, pendientes: 0, al_dia: true } },
  flujoCargando: false
})

export default {
  state,

  // ---------------------------------------------------------------------------
  // Sesion
  // ---------------------------------------------------------------------------

  get autenticado () {
    return !!state.token
  },

  get esRoot () {
    return !!(state.usuario && state.usuario.perfil && state.usuario.perfil.es_root)
  },

  /** Guarda el payload que devuelven login / me / impersonar. */
  aplicar (payload) {
    if (payload.token) {
      state.token = payload.token
      localStorage.setItem(LLAVE_TOKEN, payload.token)
    }

    state.usuario = payload.usuario || null
    state.permisos = payload.permisos || {}
    state.secciones = payload.secciones || []
    state.actorReal = payload.actor_real || null
    state.impersonado = !!payload.impersonado
  },

  limpiar () {
    state.token = null
    state.usuario = null
    state.permisos = {}
    state.secciones = []
    state.actorReal = null
    state.impersonado = false
    state.flujo = { fases: [], siguiente: null, resumen: { total: 0, pendientes: 0, al_dia: true } }
    localStorage.removeItem(LLAVE_TOKEN)
  },

  // ---------------------------------------------------------------------------
  // Proceso guiado
  // ---------------------------------------------------------------------------

  /**
   * Trae el proceso del usuario. `forzar` lo vuelve a pedir despues de una accion
   * que cambia el estado de un paso (validar, capturar, registrar...).
   */
  async cargarFlujo (forzar = false) {
    if (state.flujoCargando) return state.flujo
    if (!forzar && state.flujo.fases.length) return state.flujo

    state.flujoCargando = true

    try {
      // Import diferido: gemaApi importa este modulo, y al reves seria circular.
      const api = require('./gemaApi').default
      const r = await api.get('flujo')
      state.flujo = r.data
    } catch (e) {
      // El proceso es una ayuda: si falla, el modulo sigue funcionando.
    } finally {
      state.flujoCargando = false
    }

    return state.flujo
  },

  /** Los pasos aplanados, con la fase de la que vienen. */
  pasos () {
    const planos = []

    state.flujo.fases.forEach((f) => {
      f.pasos.forEach((p) => planos.push({ ...p, faseNombre: f.nombre }))
    })

    return planos
  },

  /** El paso que corresponde a una seccion, para numerarla en el menu. */
  pasoDe (seccion) {
    return this.pasos().find((p) => p.seccion === seccion) || null
  },

  // ---------------------------------------------------------------------------
  // Permisos
  // ---------------------------------------------------------------------------

  /** puede('param_kpis', 'crear') */
  puede (seccion, accion = 'ver') {
    const fila = state.permisos[seccion]

    return !!(fila && fila[accion])
  },

  // ---------------------------------------------------------------------------
  // Tema
  // ---------------------------------------------------------------------------

  alternarTema () {
    this.fijarTema(state.tema === 'dark' ? 'light' : 'dark')
  },

  fijarTema (tema) {
    state.tema = tema
    localStorage.setItem(LLAVE_TEMA, tema)
  }
}
