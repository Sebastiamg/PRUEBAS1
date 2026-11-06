/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [{
        url: "/",
        name: "Bienvenido",
        slug: "home",
        icon: "TransferIcon",
    },
    {
        url: "/instituciones",
        name: "Instituciones",
        slug: "instituciones",
        icon: "HomeIcon",
    },
    {
        url: null,
        name: "Usuarios",
        slug: "usuarios",
        icon: "UsersIcon",
        submenu: [{
                url: '/admin',
                name: 'Admin',
                slug: 'dashboard-analytics',
                i18n: 'Analytics'
            },
            {
                url: '/vendedores',
                name: 'Vendendores',
                slug: 'dashboard-analytics',
                i18n: 'Analytics'
            },
            {
                url: '/docentes',
                name: 'Docentes',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
            {
                url: '/estudiantes',
                name: 'Estudiantes',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            }
        ]
    },
    {
        url: "/contenidos",
        name: "Contenidos",
        slug: "contenidos",
        icon: "FolderIcon",
    },
    {
        url: "/periodos",
        name: "Periodo Escolar",
        slug: "periodos",
        icon: "SettingsIcon",
    },
    {
        url: "/asignaturas",
        name: "Asignaturas",
        slug: "periodos",
        icon: "FileIcon",
    },
    {
        url: "/clases",
        name: "Mis Clases",
        slug: "periodos",
        icon: "FolderPlusIcon",
    },
    {
        url: null,
        name: "Registros",
        slug: "usuarios",
        icon: "FilePlusIcon",
        submenu: [{
                url: '/libros',
                name: 'Libros',
                slug: 'dashboard-analytics',
                i18n: 'Analytics'
            },
            {
                url: '/cuadernos',
                name: 'Cuadernos',
                slug: 'dashboard-analytics',
                i18n: 'Analytics'
            },
            {
                url: '/guias',
                name: 'Guías',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
            {
                url: '/planlector',
                name: 'Planlector',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
            {
                url: '/materialapoyo',
                name: 'Material de Apoyo',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
            {
                url: '/videos',
                name: 'Videos',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
            {
                url: '/audios',
                name: 'Audios',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
            {
                url: '/juegos',
                name: 'Juegos',
                slug: 'dashboard-ecommerce',
                i18n: 'eCommerce'
            },
        ]
    },
    {
        url: null,
        name: "Digital",
        slug: "usuarios",
        icon: "BookOpenIcon",
        submenu: [{
                url: "/lista/libros",
                name: "Libros",
                slug: "periodos",
                icon: "BookIcon",
            },
            {
                url: "/lista/cuadernos",
                name: "Cuadernos",
                slug: "periodos",
                icon: "BookOpenIcon",
            },
            {
                url: "/lista/guias",
                name: "Guias",
                slug: "periodos",
                icon: "FileIcon",
            },
            {
                url: "/lista/planlector",
                name: "Plan Lector",
                slug: "periodos",
                icon: "FileIcon",
            },
            {
                url: "/lista/materialapoyo",
                name: "Material de Apoyo",
                slug: "periodos",
                icon: "FileIcon",
            },
            {
                url: "/lista/videos",
                name: "Video",
                slug: "periodos",
                icon: "FileIcon",
            },
            {
                url: "/lista/audios",
                name: "Audio",
                slug: "periodos",
                icon: "FileIcon",
            },
            {
                url: "/lista/juegos",
                name: "Juegos",
                slug: "periodos",
                icon: "FileIcon",
            },
        ]
    },
    {
        url: "/evaluaciones",
        name: "Evaluaciones",
        slug: "evaluaciones",
        icon: "FileIcon",
    },
    {
        url: "/codigoslibros",
        name: "Códigos Libros",
        slug: "codigoslibros",
        icon: "SearchIcon",
    }

]