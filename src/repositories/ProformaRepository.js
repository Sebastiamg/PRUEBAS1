import axios from '../axios'
import { server } from '../main'
export default class ProformaRepository{
  static async InformacionAgrupado(codigo){
    try {
      const respuesta = await axios.get(server + `pedidos2/pedidos?InformacionAgrupado=1&codigo=${codigo}`)
      return respuesta
    } catch (error) {
      return error
    }
  }
  static async informacionInstitucionPerseo(institucion_id){
    try {
      const respuesta = await axios.get(server + `pedidos2/pedidos?informacionInstitucionPerseo=1&institucion_id=${institucion_id}`)
      return respuesta
    } catch (error) {
      return error
    }
  }
  static async getEmpresa(){
    try {
      const respuesta = await axios.get(server + `empresa`)
      return respuesta
    } catch (error) {
      return error
    }
  }
  static async tipoDocumentoXId(id){
    try {
      const respuesta = await axios.get(server + `tipoDocumentoXId/${id}`)
      return respuesta
    } catch (error) {
      return error
    }
  }
}
