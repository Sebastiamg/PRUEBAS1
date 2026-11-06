import axios from '../axios'
import { server } from '../main'
export default class FacturacionRepository{
  static async getDatoLibreria(idInstitucion){
    try {
      const respuesta = await axios.get(server + `datosFactura/datosFactura?getlibreria=1&idInstitucion=${idInstitucion}`)
      return respuesta
    } catch (error) {
      return error
    }
  }
}
