import axios from '../axios'
import { server } from '../main'

export default class PedidosRepository{
  // static async actualizarValorPago(verificacion_pago_id){
  //   try {
  //     const respuesta = await axios.get(server + `pedigo_Pagos?actualizarValorPago=yes&verificacion_pago_id=${ verificacion_pago_id }`)
  //     return respuesta
  //   } catch (error) {
  //     return error
  //   }
  // }
  static async getBeneficiariosXPedido(id_pedido){
    try {
      const respuesta = await axios.get(server + `getBeneficiariosXPedido/${id_pedido}`)
      return respuesta
    } catch (error) {
    }
  }
  static async getPedidoXID(id_pedido){
    try {
      const respuesta = await axios.get(server + `pedidos/${id_pedido}`)
      return respuesta
    } catch (error) {
    }
  }
  static async rep_getAsesores(){
    try {
      const respuesta = await axios.get(server + `pedidos2/pedidos?getAsesoresPedidos=1`)
      return respuesta
    } catch (error) {
    }
  }
}
