/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import { LogOutIcon } from 'vue-feather-icons'
import axios from '../axios'
import { server } from '../main'

const actions = {

    // /////////////////////////////////////////////
    // COMPONENTS
    // /////////////////////////////////////////////

    // Vertical NavMenu
    updateVerticalNavMenuWidth({ commit }, width) {
        commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
    },

    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
        commit('UPDATE_STARRED_PAGE', payload)
    },

    // The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
        commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
        commit('ARRANGE_STARRED_PAGES_MORE', list)
    },

    // /////////////////////////////////////////////
    // UI
    // /////////////////////////////////////////////

    toggleContentOverlay({ commit }) {
        commit('TOGGLE_CONTENT_OVERLAY')
    },
    updateTheme({ commit }, val) {
        commit('UPDATE_THEME', val)
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    updateUserInfo({ commit }, payload) {
        commit('UPDATE_USER_INFO', payload)
    },

    // /////////////////////////////////////////////
    // Contenido
    // /////////////////////////////////////////////


    getContenido({ commit }) {
        var razonBusqueda = localStorage.getItem("contenidorazonBusqueda");
        var busqueda = localStorage.getItem("contenidoBusqueda");
        axios.get(server + "contenido?busqueda=" + busqueda + '&razonBusqueda=' + razonBusqueda)
            .then(function (response) {

                // localStorage.setItem("errorContenido","no")

                if (response.data.status == '0') {
                    // localStorage.setItem("errorContenido","yes")
                    commit('SET_CONTENIDO_CLEAN', [])
                } else {
                    commit('SET_CONTENIDO', response.data.items)
                }

            })
            .catch(function (error) { })
    },

    // /////////////////////////////////////////////
    // Get tareas
    // /////////////////////////////////////////////

    getTareas({ commit }) {
        var usuario = JSON.parse(localStorage.getItem('usuario'))
        axios.get(server + 'estudianteCurso?idusuario=' + usuario.idusuario)
            .then(function (response) {
                commit('SET_TAREAS', response.data.items)
            })
            .catch(function (error) { })
    },

    async login({ dispatch, commit }, credenciales) {
        dispatch('limpiarValues')
        localStorage.setItem('bloqueo', 'no')
        let formData = new FormData();
        formData.append('name_usuario', credenciales.email);
        formData.append('password', credenciales.password);
        await axios.get(server + 'sanctum/csrf-cookie');
        await axios.post(server + 'login', formData)
            .then(function (response) {
                dispatch("getEmpresaPlataforma");
                return dispatch("getUsuario");
            })
            .catch(function (error) {
                if (error.response.status == 422) {
                    commit('SET_ERROR', error.response.data.errors.name_usuario[0])
                }
                if (error.response.status == 412) {
                    commit('SET_ERROR', error.response.data.errors)
                }
            })

    },

    async logout({ dispatch }) {
        dispatch('limpiarErrors')
        dispatch('limpiarValues')
        localStorage.removeItem("usuario");

        try {
            window.dispatchEvent(new Event("usuario-logout"));
            await axios.post(server + 'logout')
        } catch (error) {
            console.warn("Falló el logout en backend, pero continuamos:", error)
        }

        localStorage.clear()
    },
    async logout2({ dispatch }) {
        localStorage.removeItem("usuario");
        dispatch('limpiarValues')
        // 2. Emite evento para que ChatWidget lo detecte
        window.dispatchEvent(new Event("usuario-logout"));
        await axios.post(server + 'logout');
        let estado = localStorage.getItem("bloqueo")
        if (estado == "yes") {
            location.reload()
        }
        // return dispatch("getUsuario")
    },
    async limpiarErrors({ commit }) {
        commit('setLimpiarErrores', 1);
    },
    async limpiarValues({ commit }) {
        commit('setlimpiarValues', 1);
    },
    async prueba({ commit }) {
        console.log(".")
    },
    async prueba2({ commit }) {
        console.log("hola")
    },
    async incrementar({ dispatch, commit }, variable) {
        commit('SET_incrementarContador', 1);
        return dispatch("prueba2");
    },
    async setPedido({ dispatch, commit }, payload) {
        commit('SET_pedidoId', payload);
        // commit('SET_pedidoId', idPedido, pedido);
    },
    async setAsesorPedidoSelected({ dispatch, commit }, payload) {
        console.log('Action setAsesorPedidoSelected llamado con:', payload);
        commit('SET_asesorPedidoSelected', payload);
        commit('SET_ASESOR_PEDIDO_SELECTED', payload);
    },

    async setpuntos({ dispatch, commit }, payload) {
        commit('SET_Puntos', payload);
        // commit('SET_pedidoId', idPedido, pedido);
    },

    async setGuia({ dispatch, commit }, payload) {
        commit('SET_guia', payload);
    },
    async setRoot({ dispatch, commit }, id) {
        commit('SET_root', id)
    },

    async setGroupFacturador({ dispatch, commit }, permiso) {
        commit('SET_facturador', permiso)
    },
    async setGrupoBodega({ dispatch, commit }, permiso) {
        commit('setGrupoBodega', permiso)
    },
    async setAdminBodega({ dispatch, commit }, permiso) {
        commit('setAdminBodega', permiso)
    },
    async setAdminFacturador({ dispatch, commit }, permiso) {
        commit('setAdminFacturador', permiso)
    },
    async setAsisGerencia({ dispatch, commit }, permiso) {
        commit('setAsisGerencia', permiso)
    },
    async setGroup({ dispatch, commit }, grupo) {
        commit('setGroup', grupo)
        return
    },
    async getUsuario({ commit }) {
        let obtenerBloqueo = localStorage.getItem("bloqueo")
        if (obtenerBloqueo == 'yes') {
            commit('SET_USUARIO', null);
            return false

        }
        if (server == undefined) {
            return commit('SET_USUARIO', null);
        }
        await axios.get(server + 'user')

            .then(function (response) {
                if (response.data.idusuario) {
                    response.data.idusuario
                    commit('SET_USUARIO', response.data);
                }
            })
            .catch(function (error) {
                commit('SET_USUARIO', null);
            })
    },

    async getUserInfo({ commit }) {

        if (server == undefined) {
            return commit('SET_USUARIO', null);
        }
        await axios.get(server + 'userInfo')
            .then(function (response) {
                if (response.data.idusuario) {
                    response.data.idusuario
                    commit('SET_USUARIO', response.data);
                }
            })
            .catch(function (error) {
                commit('SET_USUARIO', null);
            })
    },

    getTareasDocentes({ commit }) {
        let me = this;
        var url = server + "getTareasDocentes?idcurso=" + localStorage.idcurso;
        return axios.get(url)
            .then(function (response) {
                commit('SET_TAREAS_DOCENTES', response.data.items)
                return response.data.items
            })
            .catch(function (error) {
                console.error('Error al obtener tareas:', error);
            });
    },
    actualizarDesdeHome({ commit }, valor) {
        localStorage.setItem("desdeHome", valor);
        commit('setDesdeHome', valor);
    },
    async setPermisoFichero({ dispatch, commit }, permiso) {
        commit('setPermisoFichero', permiso)
    },
    // Obtener empresa de la plataforma (imagen_utilizada = 1)
    async getEmpresaPlataforma({ commit }) {
        try {
            const response = await axios.get(server + 'empresa');
            if (response.data && Array.isArray(response.data)) {
                const empresaPrincipal = response.data.find(empresa => empresa.imagen_utilizada === 1);
                if (empresaPrincipal) {
                    commit('SET_EMPRESA_PLATAFORMA', empresaPrincipal);
                } else {
                    console.warn('No se encontró empresa con imagen_utilizada = 1');
                }
            }
        } catch (error) {
            console.error('Error al obtener empresa de la plataforma:', error);
        }
    },
    // Action para mostrar el indicador de ambiente de empresa consultando la API
    async mostrarAmbienteEmpresa({ commit }, empresaId) {
        try {
            const response = await axios.get(server + 'empresa');
            const empresas = response.data;

            // Buscar la empresa por ID
            const empresa = empresas.find(e => e.id == empresaId);

            if (empresa) {
                const tipoAmbiente = empresa.perseo_enviroment == 1 ? 'produccion' : 'local';
                commit('MOSTRAR_AMBIENTE_EMPRESA', {
                    empresaNombre: empresa.descripcion_corta || empresa.nombre || 'Empresa',
                    tipo: tipoAmbiente,
                    empresaId: empresa.id
                });
            }

            return empresa;
        } catch (error) {
            console.error('Error al consultar ambiente de empresa:', error);
            return null;
        }
    },
}

export default actions
