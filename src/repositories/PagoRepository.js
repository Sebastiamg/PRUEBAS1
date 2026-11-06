import axios from '../axios'
import { server } from '../main'
export default class PagosRepository{
  //update anticipo y deuda
  static async generateAnticiposDeuda(id_pedido){
    try {
      if(id_pedido == null || id_pedido == "" || id_pedido == 0 || id_pedido == undefined) { return }
      const respuesta = await axios.get(server + `pedigo_Pagos?generateAnticiposDeuda=yes&id_pedido=${ id_pedido }`)
      return respuesta
    } catch (error) {
      return error
    }
  }
  //update registro de pagos por varias evidencias
  static async updateValuesVariasEvidencias(idPago){
    try {
      const respuesta = await axios.get(server + `pedigo_Pagos?updateValuesVariasEvidencias=yes&idPago=${ idPago }`)
      return respuesta
    } catch (error) {
      return error
    }
  }
  //update a aprobar anticipo del pedido en documentos liq
  // static async approveAnticipoPedidoPago(id_pedido,valor){
  //   try {
  //     const respuesta = await axios.get(server + `pedigo_Pagos?approveAnticipoPedidoPago=yes&id_pedido=${ id_pedido }&valor=${valor}`)
  //     return respuesta
  //   } catch (error) {
  //     return error
  //   }
  // }
}
