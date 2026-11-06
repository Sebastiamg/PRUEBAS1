import axios from '../axios'
import { server } from '../main'
export default class PedidosRepository{
  static async actualizarValorVerificacion(verificacion_id){
    try {
      const respuesta = await axios.get(server + `verificacionesDescuentos?updateValorVerificacion=yes&verificacion_id=${ verificacion_id }`)
      return respuesta
    } catch (error) {
      return error
    }
  }
}
