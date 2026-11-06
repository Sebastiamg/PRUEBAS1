/**
 * Cliente HTTP del modulo GEMA.
 *
 * Todas las llamadas pasan por aqui para que el token, la base de la URL y el
 * manejo de errores esten en un solo lugar. El backend responde siempre
 * { success, message?, data?, ... }, asi que este cliente devuelve el cuerpo
 * completo y lanza un error normalizado cuando `success` es false.
 */

import axios from 'axios'
import sesion from './gemaSesion'

/**
 * Base de la API. `process.env.apiProlipa` lo inyecta vue.config.js desde
 * <ENTORNO>_API_PROLIPA del .env. Si falta (dev server arrancado sin .env, o sin
 * reiniciar despues de crearlo) se avisa y se cae al mismo origen, en lugar de
 * armar una URL con la palabra "undefined" dentro.
 */
function resolverBase () {
  const raiz = process.env.apiProlipa

  if (raiz) {
    return `${raiz.replace(/\/?$/, '/')}api/gema/`
  }

  // eslint-disable-next-line no-console
  console.warn(
    '[GEMA] apiProlipa no esta definido: revise <ENTORNO>_API_PROLIPA en el .env ' +
    'y reinicie el servidor de desarrollo. Se usara el mismo origen como respaldo.'
  )

  return '/api/gema/'
}

const BASE = resolverBase()

/** Error con los campos que necesitan los formularios (mensaje + errores 422). */
export class GemaError extends Error {
  constructor (mensaje, status, errores) {
    super(mensaje)
    this.name = 'GemaError'
    this.status = status || 0
    this.errores = errores || {}
  }
}

function encabezados () {
  const cabeceras = { Accept: 'application/json' }

  if (sesion.state.token) {
    cabeceras.Authorization = `Bearer ${sesion.state.token}`
  }

  return cabeceras
}

async function peticion (metodo, ruta, { params, data } = {}) {
  try {
    const respuesta = await axios({
      method: metodo,
      url: BASE + ruta.replace(/^\//, ''),
      params,
      data,
      headers: encabezados(),
      // El modulo se autentica por token; no necesita la cookie de sesion de
      // Laravel y enviarla provocaria conflictos de CORS con credenciales.
      withCredentials: false
    })

    return respuesta.data
  } catch (error) {
    const status = error.response ? error.response.status : 0
    const cuerpo = error.response ? error.response.data : null

    // 401 => la sesion murio: se limpia para que el router mande al login.
    if (status === 401) {
      sesion.limpiar()
    }

    throw new GemaError(
      (cuerpo && cuerpo.message) || 'No se pudo comunicar con el servidor.',
      status,
      cuerpo && cuerpo.errors
    )
  }
}

export default {
  get: (ruta, params) => peticion('get', ruta, { params }),
  post: (ruta, data) => peticion('post', ruta, { data }),
  put: (ruta, data) => peticion('put', ruta, { data }),
  del: (ruta, params) => peticion('delete', ruta, { params })
}
