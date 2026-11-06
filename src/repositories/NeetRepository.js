import axios from '../axios'
import { server } from '../main'

export default class NeetRepository{
  static async getTemas(){
    try {
      const respuesta = await axios.get(server + 'neetTema?listadoTemas=yes')
      return respuesta
    } catch (error) {
      return error
    }
  }
  static async getNecesidadesEducativasxUsuario(usuario,institucion){
    try {
      const respuesta = await axios.get(server + 'neetTema?getAsignadosAll=yes&idusuario='+usuario+'&institucion_id='+institucion)
      return respuesta
    } catch (error) {
      return error
    }
  }
}
