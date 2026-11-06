import axios from '../axios'
import { server, serverIliminar } from '../main'
export default class PeriodoRepository{
  static async getPeriodos(){
    try {
      const respuesta = await axios.get(server + `periodo`)
      return respuesta
    } catch (error) {
      return error
    }
  }
  static async getPeriodosIluminar(){
    try {
      const respuesta = await axios.get(serverIliminar + `periodo`)
      return respuesta
    } catch (error) {
      return error
    }
  }
}
