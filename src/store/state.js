/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import navbarSearchAndPinList from "@/layouts/components/navbar/navbarSearchAndPinList"
import themeConfig from "@/../themeConfig.js"
import colors from "@/../themeConfig.js"
import avatarS17 from "@/assets/images/portrait/small/avatar-s-17.jpg"

// /////////////////////////////////////////////
// Helper
// /////////////////////////////////////////////

// *From Auth - Data will be received from auth provider
const userDefaults = {
    uid: 0, // From Auth
    displayName: "Fernando Casame", // From Auth
    about: "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
    photoURL: avatarS17, // From Auth
    status: "online",
    userRole: "admin"
}


// Check if device is touch device
// This is used to remove perfect scrollbar from touch devices
// Using Dynamic components
const is_touch_device = () => {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function(query) {
        return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch) {
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}


// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////

const state = {
    AppActiveUser: userDefaults,
    bodyOverlay: false,
    isVerticalNavMenuActive: true,
    is_touch_device: is_touch_device(),
    mainLayoutType: themeConfig.mainLayoutType || "vertical",
    navbarSearchAndPinList: navbarSearchAndPinList,
    reduceButton: themeConfig.sidebarCollapsed,
    verticalNavMenuWidth: "default",
    verticalNavMenuItemsMin: false,
    scrollY: 0,
    starredPages: navbarSearchAndPinList["pages"].data.filter((page) => page.is_bookmarked),
    theme: themeConfig.theme || "light",
    themePrimaryColor: colors.primary,
    windowWidth: null,
    // /////////////////////////////////////////////
    // Variables globales
    // /////////////////////////////////////////////
    contenidos: [],
    cursos: [],
    usuario: null,
    susuario:null,
    tareas: [],
    auth: false,
    errors: '',
    contador: 0,
    pedidoId:0,
    ObjectPedido:'',
    ObjectGuia:'',
    userRoot:false,
    userGerencia:false,
    groupFacturador:false,
    groupBodega:false,
    AdminBodega:false,
    AdminFacturador:false,
    AsisGerencia:false,
    userAsesor:false,
    userFacturador:false,
    userAdminFacturador:false,
    ObjectPuntos:'',
    desdeHome: null,
    userContabilidad:false,
    userDocente:false,
    asesorSelectedPedido:'',
    asesorPedidoSelected: null, // Asesor seleccionado para crear pedidos/guías desde facturador
    userAdministrador:false,
    userBodegaNormal:false,
    permisoFichero:0,
    // Perseo
    empresaPerseo: null,
    // Empresa de la plataforma (imagen_utilizada = 1)
    empresaPlataforma: JSON.parse(localStorage.getItem('empresaPlataforma')) || null,
}

export default state
