/*=========================================================================================
  File Name: mutations.js
  Description: Vuex Store - mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import axios from '../axios'

const mutations = {


    // /////////////////////////////////////////////
    // COMPONENTS
    // /////////////////////////////////////////////

    // Vertical NavMenu

    TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE(state, value) {
        state.isVerticalNavMenuActive = value
    },
    TOGGLE_REDUCE_BUTTON(state, val) {
        state.reduceButton = val
    },
    UPDATE_MAIN_LAYOUT_TYPE(state, val) {
        state.mainLayoutType = val
    },
    UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN(state, val) {
        state.verticalNavMenuItemsMin = val
    },
    UPDATE_VERTICAL_NAV_MENU_WIDTH(state, width) {
        state.verticalNavMenuWidth = width
    },


    // VxAutoSuggest

    UPDATE_STARRED_PAGE(state, payload) {

        // find item index in search list state
        const index = state.navbarSearchAndPinList["pages"].data.findIndex((item) => item.url == payload.url)

        // update the main list
        state.navbarSearchAndPinList["pages"].data[index].is_bookmarked = payload.val

        // if val is true add it to starred else remove
        if (payload.val) {
            state.starredPages.push(state.navbarSearchAndPinList["pages"].data[index])
        } else {
            // find item index from starred pages
            const index = state.starredPages.findIndex((item) => item.url == payload.url)

            // remove item using index
            state.starredPages.splice(index, 1)
        }
    },

    // Navbar-Vertical

    ARRANGE_STARRED_PAGES_LIMITED(state, list) {
        const starredPagesMore = state.starredPages.slice(10)
        state.starredPages = list.concat(starredPagesMore)
    },
    ARRANGE_STARRED_PAGES_MORE(state, list) {
        let downToUp = false
        let lastItemInStarredLimited = state.starredPages[10]
        const starredPagesLimited = state.starredPages.slice(0, 10)
        state.starredPages = starredPagesLimited.concat(list)

        state.starredPages.slice(0, 10).map((i) => {
            if (list.indexOf(i) > -1) downToUp = true
        })

        if (!downToUp) {
            state.starredPages.splice(10, 0, lastItemInStarredLimited)
        }
    },


    // ////////////////////////////////////////////
    // UI
    // ////////////////////////////////////////////

    TOGGLE_CONTENT_OVERLAY(state, val) { state.bodyOverlay = val },
    UPDATE_PRIMARY_COLOR(state, val) { state.themePrimaryColor = val },
    UPDATE_THEME(state, val) { state.theme = val },
    UPDATE_WINDOW_WIDTH(state, width) { state.windowWidth = width },
    UPDATE_WINDOW_SCROLL_Y(state, val) { state.scrollY = val },


    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    // Updates user info in state and localstorage
    UPDATE_USER_INFO(state, payload) {

        // Get Data localStorage
        let userInfo = JSON.parse(localStorage.getItem("userInfo")) || state.AppActiveUser

        for (const property of Object.keys(payload)) {

            if (payload[property] != null) {
                // If some of user property is null - user default property defined in state.AppActiveUser
                state.AppActiveUser[property] = payload[property]

                // Update key in localStorage
                userInfo[property] = payload[property]
            }


        }
        // Store data in localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    // /////////////////////////////////////////////
    // Set Contenido
    // /////////////////////////////////////////////
    SET_ERROR(state, error) {
        state.errors = error
    },
    SET_CONTENIDO(state, contenidos) {
        state.contenidos = contenidos
    },
    SET_CONTENIDO_CLEAN(state, contenidos) {
        state.contenidos = []
    },

    SET_TAREAS(state, cursos) {
        state.cursos = cursos
    },
    SET_USUARIO(state, usuario) {
        state.usuario = usuario
        state.susuario = usuario
        state.auth = Boolean(usuario)
        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            // 👇 Emitimos el evento personalizado para que ChatWidget reaccione
            window.dispatchEvent(new Event("usuario-login"));
        }
    },
    SET_TAREAS_DOCENTES(state, tareas) {
        // Forzamos la reactividad creando un nuevo array
        state.tareas = tareas ? [...tareas] : []
    },
    SET_incrementarContador(state, cantidad) {
        state.contador += cantidad;
    },
    setLimpiarErrores(state) {
        state.errors = ''
    },
    setlimpiarValues(state) {
        state.ObjectPedido = ""
        state.ObjectGuia = ""
        state.ObjectPuntos = ""
        state.userRoot = false
        state.groupFacturador = false
        state.groupBodega = false
        state.AdminBodega = false
        state.AsisGerencia = false
        state.userAsesor = false
        state.userGerencia = false
        state.userContabilidad = false
        state.userAdministrador = false
        state.userAdminFacturador = false
        state.userFacturador = false
        state.AdminFacturador = false
        state.userDocente = false
        state.userBodegaNormal = false
        state.susuario = []
        state.asesorSelectedPedido = ''
        state.permisoFichero = 0
    },
    //pedidos
    SET_pedidoId(state, payload) {
        state.pedidoId = payload.id_pedido
        state.ObjectPedido = payload
    },
    //set puntos
    SET_Puntos(state, payload) {
        state.ObjectPuntos = payload
    },
    //guias
    SET_guia(state, payload) {
        state.ObjectGuia = payload
    },
    //asesor selected pedido
    SET_asesorPedidoSelected(state, payload) {
        state.asesorSelectedPedido = payload
    },
    //asesor seleccionado para crear guías (nuevo)
    SET_ASESOR_PEDIDO_SELECTED(state, payload) {
        state.asesorPedidoSelected = payload
        console.log('Mutation SET_ASESOR_PEDIDO_SELECTED:', payload);
    },
    //user rool
    SET_root(state, permiso) {
        state.userRoot = permiso
    },
    //grupo facturador
    SET_facturador(state, permiso) {
        state.groupFacturador = permiso
    },
    //grupo bodega
    setGrupoBodega(state, permiso) {
        state.groupBodega = permiso
    },
    //admin bodega
    setAdminBodega(state, permiso) {
        state.AdminBodega = permiso
    },
    //admin facturador
    setAdminFacturador(state, permiso) {
        state.AdminFacturador = permiso
    },
    //asistente Gerenecia
    setAsisGerencia(state, permiso) {
        state.AsisGerencia = permiso
    },
    //grupo
    setGroup(state, grupo) {
        if (grupo.grupo == 6) { state.userDocente = grupo.permiso }
        if (grupo.grupo == 11) { state.userAsesor = grupo.permiso }
        if (grupo.grupo == 17) { state.userBodegaNormal = grupo.permiso }
        if (grupo.grupo == 22) { state.userFacturador = grupo.permiso }
        if (grupo.grupo == 23) { state.userAdminFacturador = grupo.permiso }
        if (grupo.grupo == 25) { state.userGerencia = grupo.permiso }
        if (grupo.grupo == 26) { state.userContabilidad = grupo.permiso }
        if (grupo.grupo == 1) { state.userAdministrador = grupo.permiso }
    },
    setDesdeHome(state, valor) {
        state.desdeHome = valor;
    },
    setPermisoFichero(state, permiso) {
        state.permisoFichero = permiso;
    },
    // Perseo
    SET_EMPRESA_PERSEO(state, empresa) {
        state.empresaPerseo = empresa;
    },
    // Empresa de la plataforma
    SET_EMPRESA_PLATAFORMA(state, empresa) {
        state.empresaPlataforma = empresa;
        if (empresa) {
            localStorage.setItem('empresaPlataforma', JSON.stringify(empresa));
        }
    },
}

export default mutations
