import axios from '../axios'
import { server } from '../main'

export default class CodigoRepository{
  static async getComboConfigurado(){
    try {
      const respuesta = await axios.get(server + 'combos?getComboConfigurado=1')
      return respuesta
    } catch (error) {
      return error
    }
  }
}
