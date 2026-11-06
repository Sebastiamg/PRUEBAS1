import axios from '../axios'
import { server } from '../main'
export default {
  getUsuariosXRolxInstitucion(rol,institucion) {
    return axios.get(server + 'getUsuarios/'+rol+'/'+institucion).then((response) => response);
  },
  getUsuariosXRolx(rol) {
    return axios.get(server + 'getUsuariosPorRol/'+rol).then((response) => response);
  }
};
