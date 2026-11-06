/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Router from "vue-router";
import Routerpedidos from "./views/router/pedidos/Routerpedidos";
import RouterConfiguracion from "./views/router/configuracion/RouterConfiguracion";
import RouterCodigos from "./views/router/codigos/RouterCodigos";
import RouterSalle from "./views/router/salle/RouterSalle";
import RouterSeminarios from "./views/router/seminarios/RouterSeminarios";
import gemaSesion from "./services/gema/gemaSesion";
import gemaApi from "./services/gema/gemaApi";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/",
          name: "page-login",
          component: () => import("@/views/pages/ingreso.vue"),
        },
       {
          path: 'libro/demo/escuela/:libro/:paginaInicio/:paginaFin',
          name: 'libro-demo-escuela',
          component: () => import('@/views/libros/demoEscuela.vue')
        },
        //CREAR UNA RUTA que diga libro/demos/prolipa
        {
          path:'libro/demo/prolipa',
          name: 'libro-demo-prolipa',
          component: () => import('@/views/libros/demoProlipa.vue')
        },
        // {
        //   path: "/",
        //   name: "page-login",
        //   component: () => import("@/views/pages/Login.vue")
        // },
        {
          path: "/registro",
          name: "page-registro",
          component: () => import("@/views/pages/registro.vue"),
        },
        {
          path: "/formulario/docente/:institucion/:id",
          name: "page-formulario",
          component: () => import("@/views/pages/formularioDocente.vue"),
        },
        {
          path: "/formulario/diagnostico/:institucion/:periodo",
          name: "page-formulario",
          component: () => import("@/views/pages/formularioDiagnostico.vue"),
        },
        {
          path: "/encuesta/escuelas/:institucion/:id",
          name: "page-encuesta",
          component: () => import("@/views/pages/encuestaEscuela.vue"),
        },
        {
          path: "/pages/error-404",
          name: "page-error-404",
          component: () => import("@/views/pages/Error404.vue"),
        },
        {
          path: "/restaurar",
          name: "recuperacion",
          component: () => import("@/views/pages/recuperacion.vue"),
        },
        {
          path: "/libro/digital",
          name: "digitallibro",
          component: () => import("@/views/libros/digital.vue"),
        },
        {
          path: "/libro_free/:data_link",
          name: "libro_free",
          component: () => import("@/views/libros/libro_free.vue"),
        },
        {
          path: "/estudiante/libro/digital",
          name: "digitallibro",
          component: () => import("@/views/estudiantes/digital.vue"),
        },
        {
          path: "/estudiante/cuaderno/digital",
          name: "digitallibro",
          component: () => import("@/views/estudiantes/digitalcuaderno.vue"),
        },
        {
          path: "/docente/libro/digital",
          name: "digitallibro",
          component: () => import("@/views/libros/digital.vue"),
        },
        //para mostrar el libro digital en el admin
        {
          path: "/admin/libro/desgloselibro",
          name: "admin-libro",
          component: () => import("./views/libros/libro-despliegue.vue"),
        },
        {
          path: "/admin/libro/pdfsinguia",
          name: "admin-libro-singuia",
          component: () => import("./views/libros/admin-pdfsinguia.vue"),
        },
        {
          path: "/docente/libro/pdfsinguia",
          name: "digitallibro",
          component: () => import("@/views/libros/pdfsinguia.vue"),
        },
        {
          path: "/docente/libro/pdfconguia",
          name: "digitallibro",
          component: () => import("@/views/libros/pdfconguia.vue"),
        },
        {
          path: "/docente/libro/pdfguiadidactica",
          name: "digitallibro",
          component: () => import("@/views/libros/guiadidactica.vue"),
        },

        //CUADERNO

        {
          path: "/admin/cuaderno/pdfsinguia",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/pdfsinguia.vue"),
        },
        {
          path: "/admin/cuaderno/pdfconguia",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/pdfconguia.vue"),
        },
        {
          path: "/admin/cuaderno/pdfguiadidactica",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/guiadidactica.vue"),
        },
        //Fin CUADERNO
        {
          path: "/estudiante/juego/digital",
          name: "digitaljuego",
          component: () => import("./views/estudiantes/digitalJuegos.vue"),
        },
        {
          path: "/juego/digital",
          name: "digitaljuego",
          component: () => import("./views/juegos/digital.vue"),
        },
        {
          path: "/docente/juego/digital",
          name: "digitaljuego",
          component: () => import("./views/juegos/digital.vue"),
        },
        {
          path: "/docente/cuaderno/digital",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/digitalDocente.vue"),
        },
        {
          path: "/docente/cuaderno/pdfsinguia",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/pdfsinguia.vue"),
        },
        {
          path: "/docente/cuaderno/pdfconguia",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/pdfconguia.vue"),
        },
        {
          path: "/docente/cuaderno/pdfguiadidactica",
          name: "digitallibro",
          component: () => import("@/views/cuadernos/guiadidactica.vue"),
        },
        {
          path: "/docente/guia/pdfguiadidactica",
          name: "digitallibro",
          component: () => import("@/views/guias/guiadidactica.vue"),
        },
        {
          path: "/docente/planlector/digital",
          name: "digitallibro",
          component: () => import("@/views/planlector/digital.vue"),
        },
        {
          path: "/docente/planlector/pdfsinguia",
          name: "digitallibro",
          component: () => import("@/views/planlector/pdfsinguia.vue"),
        },
        {
          path: "/docente/planlector/pdfconguia",
          name: "digitallibro",
          component: () => import("@/views/planlector/pdfconguia.vue"),
        },
        {
          path: "/docente/planlector/pdfguiadidactica",
          name: "digitallibro",
          component: () => import("@/views/planlector/guiadidactica.vue"),
        },
        {
          path: "/admin/simulador/ruta",
          name: "simulador-ruta",
          component: () => import("@/views/admin/simulador/SimuladorRuta.vue"),
        },
        {
          path: "/docente/material/digital",
          name: "digitallibro",
          component: () => import("@/views/materialapoyo/digital.vue"),
        },
        {
          path: "/responderEvaluacion/:id",
          name: "responderEvaluacion",
          component: () =>
            import("./views/evaluaciones/RespuestasComponent.vue"),
        },
        {
          path: "/docente/encuesta",
          name: "/docente/encuesta",
          component: () => import("./views/docentes/encuesta.vue"),
        },
        {
          path: "/docente/descargar_certificado",
          name: "/docente/descargar_certificado",
          component: () => import("./views/docentes/descargar_certificado.vue"),
        },
        {
          path: "/evaluacion_imprimir",
          name: "evaluacion_imprimir",
          component: () =>
            import("./views/evaluaciones/evaluacion_imprimir.vue"),
        },
        {
          path: "/estudiante/libros/planlector",
          name: "digitallibro",
          component: () => import("@/views/planlector/digitalplanlector.vue"),
        },
        {
          path: "/diccionario",
          name: "diccionario",
          component: () => import("./views/estudiantes/diccionario.vue"),
        },
        //VARIOS
        {
          path: "v/:env", // ruta encriptada
          name: "varios",
          component: () => import("./views/varios/Varios.vue"),
        },
        //VARIOS
        {
          path: "admin_neet_actividad", // ruta encriptada
          name: "admin_neet_actividad",
          component: () =>
            import("./views/nee_documentos/components/NeetDigital.vue"),
        },


         //libros institucion
         {
          path: "/verificacion_institucion",
          name: "verificacion_institucion",
          component: () => import("./views/institucion/components/verificacionLibrosinstitucion.vue"),
        },
        {
          path: "/libros_institucion",
          name: "libros_institucion",
          component: () => import("@/views/libros/librosXinstitucion.vue"),
        },
        {
          path: "/libros_institucion/desgloselibro",
          name: "libros-institucion-desgloselibro",
          component: () => import("@/views/libros/librosXinstituciondespliegue.vue"),
        },

        // {
        //   path: "/export/:id_pedido/:periodo_id",
        //   name: "export-contrato",
        //   component: () => import("./views/temporadas/components/exportContrato2.vue")
        // },
      ],
    },
    // =============================================================================
    // GEMA - Gestión Estratégica de Metas y Actividades
    // =============================================================================
    // Módulo autónomo: login propio por cédula, layout propio y sesión propia por
    // token (no usa `localStorage.usuario` ni el menú general de la plataforma).
    // El guardián de sesión y de permisos está al final de este archivo.
    {
      path: "/gema/login",
      name: "gema-login",
      component: () => import("./views/gema/GemaLogin.vue"),
      meta: { gemaPublica: true },
    },
    {
      path: "/gema",
      component: () => import("./layouts/gema/GemaLayout.vue"),
      children: [
        {
          path: "",
          name: "gema-dashboard",
          component: () => import("./views/gema/Dashboard.vue"),
          meta: { gemaSeccion: "dashboard", titulo: "Dashboard" },
        },
        {
          path: "tablero/gerencia",
          name: "gema-tablero-gerencia",
          component: () => import("./views/gema/TableroN3.vue"),
          meta: { gemaSeccion: "tablero_n3", titulo: "Tablero Gerencia" },
        },
        {
          path: "plan",
          name: "gema-plan-produccion",
          component: () => import("./views/gema/PlanProduccion.vue"),
          meta: { gemaSeccion: "plan_produccion", titulo: "Plan de producción" },
        },
        {
          path: "plan/mi-avance",
          name: "gema-plan-avance",
          component: () => import("./views/gema/MiAvance.vue"),
          meta: { gemaSeccion: "plan_avance", titulo: "Mi avance" },
        },
        {
          path: "plan/seguimiento",
          name: "gema-plan-seguimiento",
          component: () => import("./views/gema/SeguimientoEquipo.vue"),
          meta: { gemaSeccion: "plan_seguimiento", titulo: "Seguimiento del equipo" },
        },
        {
          path: "kpis/captura",
          name: "gema-kpis-captura",
          component: () => import("./views/gema/CapturaValores.vue"),
          meta: { gemaSeccion: "kpi_captura", titulo: "Captura de valores" },
        },
        {
          path: "kpis/validacion",
          name: "gema-kpis-validacion",
          component: () => import("./views/gema/ValidacionValores.vue"),
          meta: { gemaSeccion: "kpi_validacion", titulo: "Validación de valores" },
        },
        {
          path: "actividades",
          name: "gema-actividades",
          component: () => import("./views/gema/MisActividades.vue"),
          meta: { gemaSeccion: "actividades_registro", titulo: "Mis actividades" },
        },
        {
          path: "actividades/validacion",
          name: "gema-actividades-validacion",
          component: () => import("./views/gema/ValidacionActividades.vue"),
          meta: { gemaSeccion: "actividades_validacion", titulo: "Validar actividades" },
        },
        {
          path: "parametrizacion/pilares",
          name: "gema-param-pilares",
          component: () => import("./views/gema/Pilares.vue"),
          meta: { gemaSeccion: "param_pilares", titulo: "Pilares y objetivos" },
        },
        {
          path: "parametrizacion/metas",
          name: "gema-param-metas",
          component: () => import("./views/gema/Metas.vue"),
          meta: { gemaSeccion: "param_metas", titulo: "Metas" },
        },
        {
          path: "parametrizacion/catalogos",
          name: "gema-param-catalogos",
          component: () => import("./views/gema/Catalogos.vue"),
          meta: { gemaSeccion: "param_catalogos", titulo: "Catálogos" },
        },
        {
          path: "parametrizacion/kpis",
          name: "gema-param-kpis",
          component: () => import("./views/gema/Kpis.vue"),
          meta: { gemaSeccion: "param_kpis", titulo: "KPIs" },
        },
        {
          path: "parametrizacion/categorias",
          name: "gema-param-categorias",
          component: () => import("./views/gema/Categorias.vue"),
          meta: { gemaSeccion: "param_categorias", titulo: "Categorías de actividad" },
        },
        {
          path: "parametrizacion/libros",
          name: "gema-param-libros",
          component: () => import("./views/gema/Libros.vue"),
          meta: { gemaSeccion: "param_libros", titulo: "Libros y unidades" },
        },
        {
          path: "parametrizacion/procesos",
          name: "gema-param-procesos",
          component: () => import("./views/gema/Procesos.vue"),
          meta: { gemaSeccion: "param_procesos", titulo: "Procesos de producción" },
        },
        {
          path: "admin/perfiles",
          name: "gema-admin-perfiles",
          component: () => import("./views/gema/Perfiles.vue"),
          meta: { gemaSeccion: "admin_perfiles", titulo: "Perfiles y permisos" },
        },
        {
          path: "admin/usuarios",
          name: "gema-admin-usuarios",
          component: () => import("./views/gema/Usuarios.vue"),
          meta: { gemaSeccion: "admin_usuarios", titulo: "Usuarios" },
        },
        {
          path: "admin/auditoria",
          name: "gema-admin-auditoria",
          component: () => import("./views/gema/Auditoria.vue"),
          meta: { gemaSeccion: "auditoria", titulo: "Auditoría" },
        },
      ],
    },
    // =============================================================================
    // PERSEO LAYOUT ROUTES - Layout independiente sin menú lateral
    // =============================================================================
    {
      path: "/perseo",
      component: () => import("./layouts/perseo/PerseoLayout.vue"),
      children: [
        {
          path: "",
          name: "perseo-seleccion-empresa",
          component: () => import("./views/perseo/SeleccionEmpresa.vue"),
          meta: {
            pageTitle: "Selección de Empresa",
          },
        },
        {
          path: "dashboard/:empresaId?",
          name: "perseo-dashboard",
          component: () => import("./views/perseo/PerseoDashboard.vue"),
          meta: {
            pageTitle: "Dashboard Perseo",
          },
        },
        {
          path: "produccion",
          name: "perseo-produccion",
          component: () => import("./views/perseo/produccion/Produccion.vue"),
          meta: {
            pageTitle: "Producción",
          },
        },
        {
          path: "inventario",
          name: "perseo-inventario",
          component: () => import("./views/perseo/inventario/Inventario.vue"),
          meta: {
            pageTitle: "Inventario",
          },
        },
        {
          path: "tesoreria",
          name: "perseo-tesoreria",
          component: () => import("./views/perseo/tesoreria/Tesoreria.vue"),
          meta: {
            pageTitle: "Tesorería",
          },
        },
        {
          path: "cartera",
          name: "perseo-cartera",
          component: () => import("./views/perseo/cartera/Cartera.vue"),
          meta: {
            pageTitle: "Cartera",
          },
        },
        {
          path: "ventas",
          name: "perseo-ventas",
          component: () => import("./views/perseo/ventas/Ventas.vue"),
          meta: {
            pageTitle: "Ventas",
          },
        },
      ],
    },

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        ...Routerpedidos,
        ...RouterConfiguracion,
        ...RouterCodigos,
        ...RouterSalle,
        ...RouterSeminarios,
        // =============================================================================
        // Institucion
        // =============================================================================
        {
          path: "/home",
          name: "home",
          component: () => import("./views/Home.vue"),
        },
        // {
        //   path: "/beneficiariosPorcentaje",
        //   name: "beneficiariosPorcentaje",
        //   component: () => import("./views/pedidos/components/beneficiarios/BeneficiariosPorcentaje.vue")
        // },
        //==============RUTAS PARA HOME===================================================

        {
          path: "/administrador/escuelas/asesor",
          name: "escuelas-asesor",
          component: () =>
            import("./views/home/components/asesor/escuelasAsesor.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Usuarios", url: "/usuarios" },
              { title: "Escuelas del Asesor", active: true },
            ],
          },
        },
        //ruta para ver las escuelas del asesor
        {
          path: "/escuelas/asesor",
          name: "escuelas-asesor",
          component: () =>
            import("./views/home/components/asesor/escuelasAsesor.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Escuelas del Asesor", active: true },
            ],
          },
        },

        //ruta para ver los contratos del asesor
        {
          path: "/contratos/asesor",
          name: "contratos-asesor",
          component: () =>
            import("./views/home/components/asesor/contratosAsesor.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Contratos del Asesor", active: true },
            ],
          },
        },
        {
          path: "/asesores/capacitaciones/",
          name: "asesores-capacitaciones",
          component: () =>
            import("@/views/asesor/capacitaciones/capacitaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Capacitaciones de la agenda", active: true },
            ],
          },
        },

        //==============FIN DE RUTAS PARA HOME============================================
         //==============CAPACITACIONES PROLIPA ADMIN======================================
        {
          path: "/capacitaciones_prolipa_admin",
          name: "capacitaciones_prolipa_admin",
          component: () => import("./views/capacitaciones_prolipa/admin_panel/AdminScreen.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Capacitaciones Prolipa", active: true },
            ],
          },
        },
        //==============FIN CAPACITACIONES PROLIPA ADMIN==================================


        //==============RUTAS PARA USUARIOS===============================================
        {
          path: "/u_usuarios/directores/",
          name: "u_usuarios-directores",
          component: () => import("@/views/usuarios/tipos/director.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Usuarios directores", active: true },
            ],
          },
        },
        {
          path: "/u_usuarios/administradores/",
          name: "u_usuarios-administradores",
          component: () => import("@/views/usuarios/tipos/admins.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Usuarios Administradores", active: true },
            ],
          },
        },
        {
          path: "/u_usuarios/perfiles/",
          name: "u_usuarios-perfiles",
          component: () => import("@/views/usuarios/perfiles.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Perfiles de usuarios", active: true },
            ],
          },
        },
        //==============FIN RUTAS PARA USUARIOS===========================================
        //==============RUTAS PARA PERIODOS===============================================
        {
          path: "/a_periodos/",
          name: "a_periodos",
          component: () => import("@/views/periodos/periodos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado períodos", active: true },
            ],
          },
        },
        //==============FIN RUTAS PARA PERIODOS===========================================
        //==============RUTAS PARA MATERIAL APOYO=========================================
        {
          path: "/a_material_cargar/",
          name: "a_material_cargar",
          component: () =>
            import("@/views/materialapoyo/material_subir/listadoMaterial.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado material", active: true },
            ],
          },
        },
        //==============FIN RUTAS PARA MATERIAL APOYO====================================
        //==============RUTAS PARA BANCO DE PREGUNTAS====================================
        {
          path: "/a_exportarPreguntas/",
          name: "a_exportarPreguntas",
          component: () => import("@/views/evaluaciones/ExportarPreguntas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Exportar preguntas", active: true },
            ],
          },
        },
        //==============FIN RUTA PARA BANCO DE PREGUNTAS=================================
        {
          path: "/administrador/seguimiento/institucion",
          name: "asesor-asesor-institucion",
          component: () => import("@/views/asesor/seguimiento/seguimiento.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Instituciones", url: "/instituciones" },
              { title: "Seguimiento a la Institución", active: true },
            ],
          },
        },
        {
          path: "/asesor/seguimiento/institucion",
          name: "asesor-asesor-institucion",
          component: () =>
            import("@/views/asesor/seguimiento/seguimientoAsesor.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis Instituciones", url: "/escuelas/asesor" },
              { title: "Seguimiento a la Institución", active: true },
            ],
          },
        },
        {
          path: "/temporada",
          name: "page-temporada",
          component: () => import("@/views/temporadas/temporada.vue"),
        },
        {
          path: "/showliquidacion/",
          name: "page-showliquidacion",
          component: () => import("@/views/temporadas/showliquidacion.vue"),
        },
        //ruta para los contratos
        {
          path: "/contratos/",
          name: "page-contratos",
          component: () => import("@/views/temporadas/contratos.vue"),
        },
        //ruta para auditorias
        {
          path: "/auditoria/",
          name: "page-auditoria",
          component: () => import("@/views/admin/auditoria.vue"),
        },
        //bodega
        {
          path: "/bodega/prueba",
          name: "bodega-prueba",
          component: () => import("./views/bodega/prueba.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Bodega", active: true },
            ],
          },
        },
        {
          path: "/prueba",
          name: "prueba",
          component: () => import("./views/prueba.vue"),
          meta: {
            breadcrumb: [{ title: "Home", url: "/home" }],
          },
        },
        {
          path: "/prueba2",
          name: "prueba2",
          component: () => import("./views/prueba2.vue"),
          meta: {
            breadcrumb: [{ title: "Home", url: "/home" }],
          },
        },
        {
          path: "/prueba3",
          name: "prueba3",
          component: () => import("./views/prueba3.vue"),
          meta: {
            breadcrumb: [{ title: "Home", url: "/home" }],
          },
        },
        // {
        //   path: "/fileprueba",
        //   name: "prueba",
        //   component: () => import("./views/prueba/fileprueba.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },

        //     ]
        //   }
        // },
        {
          path: "/juegos/cartas",
          name: "cartas",
          component: () => import("./views/juegos/cartas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado de juegos", url: "/docente/juegos" },
              { title: "Juego de cartas", active: true },
            ],
          },
        },
        // {
        //   path: "bodega/revision",
        //   name: "bodega-prueba",
        //   component: () => import("./views/bodega/MenuRevision.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },
        //       { title: "Revision codigos", active: true },
        //     ],
        //   },
        // },
        {
          path: "bodega/gestionBodega",
          name: "bodega-gestionBodega",
          component: () =>
            import("./views/codigos/components/BloqueadorCodigos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Gestion codigos", active: true },
            ],
          },
        },
        {
          path: "bodega/bloque_ar/codigos",
          name: "bodega-gestionBodega",
          component: () =>
            import("./views/codigos/components/ImportBloquear.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Bloquear codigos", active: true },
            ],
          },
        },
        // {
        //   path: "bodega/activarDevolucion",
        //   name: "bodega-activar",
        //   component: () =>
        //     import("./views/codigos/components/ImportActivarDevolucion.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },
        //       { title: "Activar devolucion", active: true },
        //     ],
        //   },
        // },
        {
          path: "bodega/api_facturacion",
          name: "bodega-facturacion",
          component: () =>
            import("./views/bodega/api_facturacion/ScreenFacturacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Facturación", active: true },
            ],
          },
        },
        // {
        //   path: "bodeg_a/crea",
        //   name: "bodeg_a-crea",
        //   component: () =>
        //     import("./views/bodega/codigos/ScreenCreaEliminaCodigosBodega.vue"),
        // },
        {
          path: "Libreria/institucion",
          name: "Libreria-institucion",
          component: () =>
            import("./views/facturacion/10_10_1_4/librerias/screen_librerias.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Librerías", active: true },
            ],
          },
        },
        // {
        //   path: "bodega/busqueda",
        //   name: "bodega-prueba",
        //   component: () => import("./views/codigos/components/seccionBuscar.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },
        //       { title: "Busqueda codigos", active: true }
        //     ]
        //   }
        // },
        {
          path: "/pedidos/gerencia/",
          name: "pedidos-gerencia",
          component: () => import("./views/pedidos/formatos_pedidos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Pedidos", active: true },
            ],
          },
        },
        {
          path: "/pedidos/contabilidad/",
          name: "pedidos-gerencia",
          component: () =>
            import("./views/pedidos/contabilidad/ScreenContabilidad.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado de pedidos", active: true },
            ],
          },
        },
        {
          path: "/bodega/eliminar",
          name: "bodega-prueba",
          component: () => import("./views/bodega/ImportEliminarCodigos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Revision codigos", active: true },
            ],
          },
        },

        //gestion de codigos
        // {
        //   path: "/bodega/devolucion/",
        //   name: "bodega-devolucion",
        //   component: () => import("./views/bodega/devolucionBodega.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },
        //       { title: "Bodega devolucion", active: true },
        //     ],
        //   },
        // },
        //bloqueo de codigos
        {
          path: "/bodega/leidos/codigos",
          name: "bodega-leidos-codigos",
          component: () =>
            import("./views/codigos/components/importCodigos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Bodega", active: true },
            ],
          },
        },

        //registro de codigos
        {
          path: "/bodega/registroCodigos",
          name: "bodega-prueba",
          component: () => import("./views/bodega/listaCodigos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Bodega", active: true },
            ],
          },
        },
        //ruta para reporteria
        {
          path: "/admin/reporteria",
          name: "admin-reporteria",
          component: () => import("@/views/admin/reporteria/reporteria.vue"),
        },
        {
          path: "/reporte_asesores",
          name: "reporte_asesores",
          component: () =>
            import("@/views/admin/reporteria/reporte_asesores.vue"),
        },
        //api para los info archivos  material
        {
          path: "/infoarchivo/",
          name: "infoarchivo",
          component: () =>
            import("./views/materialapoyo/components/infoarchivos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista material de apoyo",
                url: "/lista/materialapoyoAdmin",
              },
              { title: "info archivos", active: true },
            ],
            pageTitle: "Material de apoyo",
          },
        },
        //api para los crear archivos  material
        {
          path: "/subirmaterial/",
          name: "subirmaterial",
          component: () =>
            import("./views/materialapoyo/components/crearmaterial.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista material de apoyo",
                url: "/lista/materialapoyoAdmin",
              },
              { title: "Crear archivos", active: true },
            ],
            pageTitle: "Crear Material de apoyo",
          },
        },
        //ruta para ver el listado de los docente de manera individual
        {
          path: "/reporte/docente/listado",
          name: "reportelistadodocente",
          component: () =>
            import(
              "@/views/institucion/reportes/components/Listado-docentes.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Vista Reportes", url: "/reporte/institucion/" },
              { title: "Listado docentes para reporte", active: true },
            ],
          },
        },
        //ruta para ver el listado de los estudiantes de manera individual
        {
          path: "/reporte/estudiantes/listado",
          name: "reportelistaestudiante",
          component: () =>
            import(
              "@/views/institucion/reportes/components/Listado-docentes.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Vista Reportes", url: "/reporte/institucion/" },
              { title: "Listado estudiantes para reporte", active: true },
            ],
          },
        },
        //ruta para reporte del docente de manera individual
        {
          path: "/reporte/docente",
          name: "reportedocente",
          component: () =>
            import(
              "@/views/institucion/reportes/components/individual/reporte-docente-individual.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado de docentes", url: "/reporte/docente/listado" },
              { title: "Reporte del docente", active: true },
            ],
          },
        },

        //ruta para las visitas  del docente de manera individual
        {
          path: "/reporte/docentes/visitas",
          name: "docentevisitas",
          component: () =>
            import(
              "@/views/institucion/reportes/components/individual/docente-visitas.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado de docentes", url: "/reporte/docente/listado" },
              { title: "Reporte del docente", active: true },
            ],
          },
        },

        //ruta para las visitas  del estudiantes de manera individual
        {
          path: "/reporte/estudiantes/visitas",
          name: "estudiantevisitas",
          component: () =>
            import(
              "@/views/institucion/reportes/components/individual/docente-visitas.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Listado de estudiantes",
                url: "/reporte/estudiantes/listado",
              },
              { title: "Reporte del estudiante", active: true },
            ],
          },
        },

        //ruta para reporte del estudiante (pastel)de manera individual
        {
          path: "/reporte/estudiante",
          name: "reporteestudiante",
          component: () =>
            import(
              "@/views/institucion/reportes/components/individual/individual_reporte_estudiante.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Listado de estudiantes",
                url: "/reporte/estudiantes/listado",
              },
              { title: "Reporte del estudiante", active: true },
            ],
          },
        },
        //ruta  para ver los reportes de institucion

        {
          path: "/reporte/institucion/",
          name: "reporte-institucion",
          component: () =>
            import("@/views/institucion/reportes/reporteinstitucion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Reporte de Institucion", active: true },
            ],
          },
        },
        //ruta para areas

        {
          path: "/areas/listado",
          name: "areas-listado",
          component: () => import("@/views/areas/areas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado  de Areas", active: true },
            ],
          },
        },

        //ruta para niveles

        {
          path: "/niveles/listado",
          name: "niveles-listado",
          component: () => import("@/views/nivel/nivel.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Listado  de Niveles", active: true },
            ],
          },
        },

        //=========================================================================
        //ruta para SIMULADOR
        //=========================================================================

        {
          path: "/simulador/",
          name: "simulador",
          component: () => import("@/views/admin/simulador/simulador.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Simulador", active: true },
            ],
          },
        },

        {
          path: "/simulador/docente",
          name: "simulador-docente",
          component: () =>
            import("@/views/admin/simulador/simuladorUsuario.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Desglose Libro", url: "/docente/libro/desgloselibro" },
              { title: "Listado de simuladores", active: true },
            ],
          },
        },
        {
          path: "/simulador/estudiante",
          name: "simulador-estudiante",
          component: () =>
            import("@/views/admin/simulador/simuladorUsuario.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Cursos", url: "/estudiante/cursos" },
              { title: "Listado de simuladores", active: true },
            ],
          },
        },
        //=========================================================================
        //Rutas para colegios
        //=========================================================================
        {
          path: "/colegios/libros",
          name: "colegios-libros",
          component: () => import("@/views/colegios/colegios_libros.vue"),
          meta: {},
        },
        {
          path: "colegios/docente/libro/desgloselibro",
          name: "colegio-desgloselibro",
          component: () => import("./views/libros/desgloselibro.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              { title: "Contenido libro", active: true },
            ],
            pageTitle: "Libro",
            rule: "libros",
          },
        },
        {
          path: "/colegios/docente/libro/desgloseunidad",
          name: "colegios-desgloseunidad",
          component: () => import("./views/libros/desgloseunidad.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Contenido unidad", active: true },
            ],
            pageTitle: "Libro",
            rule: "libro",
          },
        },
        {
          path: "/colegios/docente/cursos",
          name: "colegio-cursos",
          component: () => import("./views/docentes/cursos.vue"),
        },
        {
          path: "/colegios/docente/curso/nuevo",
          name: "colegios-cursos",
          component: () => import("./views/docentes/nuevo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Agregar curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "curso",
          },
        },
        {
          path: "/colegios/docente/desglose_curso",
          name: "colegio-desglose_curso",
          component: () => import("./views/docentes/desglose_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Contenido curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "cursos",
          },
        },
        {
          path: "/colegios/docente/curso/editar",
          name: "cursos",
          component: () => import("./views/docentes/nuevo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Editar curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "curso",
          },
        },
        {
          path: "/colegios/docente/curso/virtual/:nombre",
          name: "colegios-cursos",
          component: () => import("./views/docentes/cursoVirtual.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Contenido curso",
                url: "/colegios/docente/desglose_curso",
              },
              { title: "Tareas", active: true },
            ],
            pageTitle: "Tareas",
            rule: "tareas",
          },
        },
        {
          path: "/colegios/docente/foros_curso",
          name: "colegios-foros_curso",
          component: () => import("./views/docentes/foros_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Contenido curso",
                url: "/colegios/docente/desglose_curso",
              },
              { title: "Foro", active: true },
            ],
            pageTitle: "Foros",
            rule: "foro",
          },
        },
        {
          path: "/colegios/docente/actividades_curso",
          name: "actividades_curso",
          component: () => import("./views/docentes/actividades_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Contenido curso",
                url: "/colegios/docente/desglose_curso",
              },
              { title: "Actividades", active: true },
            ],
            pageTitle: "Actividades",
            rule: "proyectos",
          },
        },
        {
          path: "/colegios/evaluaciones",
          name: "colegios-evaluaciones",
          component: () =>
            import("./views/evaluaciones/EvaluacionesComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Contenido curso",
                url: "/colegios/docente/desglose_curso",
              },
              { title: "Evaluaciones", active: true },
            ],
            pageTitle: "Evaluaciones",
            rule: "evaluaciones",
          },
        },
        {
          path: "/colegios/docente/tipos_juegos_docente",
          name: "colegios-tipos_juegos_docente",
          component: () => import("./views/docentes/tipos_juegos_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Zona diversión", active: true },
            ],
            pageTitle: "Zona diversión",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/docente/contenido_juego_docente",
          name: "colegios-contenido_juego_docente",
          component: () => import("./views/juegos/contenido_juego_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              { title: "Mis juegos ", active: true },
            ],
            pageTitle: "Zona diversión",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/crear_juego_ponchado",
          name: "colegios-crear_juego_ponchado",
          component: () => import("./views/juegos/crearJuego_ponchado.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/colegios/docente/contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Ponchado",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/crear_juego_sopa",
          name: "colegios-crear_juego_sopa",
          component: () => import("./views/juegos/crearJuego_sopa.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/colegios/docente/contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Sopa de letras",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/crearJuegoSeleccionSimple_docente",
          name: "colegios-crearJuegoSeleccionSimple_docente",
          component: () => import("./views/juegos/crearSeleccionSimple.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/colegios/docente/contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Seleccion",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/crearJuegoMillonario_docente",
          name: "colegios-crearJuegoMillonario_docente",
          component: () => import("./views/juegos/crearSeleccionSimple.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/colegios/docente/contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Millonario",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/crearJuegoMemoria_docente",
          name: "colegios-crearJuegoMemoria_docente",
          component: () => import("./views/juegos/crearMemoria.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/colegios/docente/contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Memoria",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/crearRompecabezas_docente",
          name: "colegios-crearRompecabezas_docente",
          component: () =>
            import("./views/juegos/crearRompecabezas_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Zona diversión",
                url: "/colegios/docente/tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/colegios/docente/contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Rompecabezas",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/lista/materialapoyo",
          name: "colegios-materialapoyo",
          component: () => import("./views/materialapoyo/materialapoyo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Mi material de apoyo ", active: true },
            ],
            pageTitle: "Material de apoyo",
            rule: "juegos",
          },
        },
        //propuestas colegio
        {
          path: "/colegios/propuestas2",
          name: "colegios-propuestasDocente2",
          component: () =>
            import("./views/propuestaMetodologica2/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Mis propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/verpropuesta2",
          name: "colegios-verpropuesta2",
          component: () =>
            import("./views/propuestaMetodologica2/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Mis propuestas metodológicas",
                url: "/colegios/propuestas2",
              },
              { title: "Ver propuesta metodológica", active: true },
            ],
            pageTitle: "Propuesta metodológica",
            rule: "propuestas",
          },
        },
        //adaptaciones colegios
        //DOCENTE
        {
          path: "/colegios/adaptaciones2",
          name: "colegios-adaptacionesd",
          component: () =>
            import("./views/adaptaciones2/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Mis adaptaciones curriculares", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "juegos",
          },
        },
        {
          path: "/colegios/adaptaciones2/verA",
          name: "colegios-verA",
          component: () => import("./views/adaptaciones2/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              {
                title: "Mis adaptaciones curriculares",
                url: "/colegios/adaptaciones2",
              },
              { title: "Ver adaptación", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "adaptaciones",
          },
        },

        //fin adaptaciones colegio
        //articulos
        {
          //articulos docente
          path: "/colegios/docente/ver_articulos",
          name: "colegios-ver_articulos",
          component: () => import("./views/articulos/verArticulos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/colegios/libros" },
              { title: "Mis libros", url: "/colegios/libros" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Mis artículos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "articulos",
          },
        },
        //documentos
        {
          path: "/colegios/ministerio/docente",
          name: "colegios-nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/docenteDocumentos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Documentos Ministeriales", active: true },
            ],
            pageTitle: "Documentos Ministeriales",
            rule: "documentos",
          },
        },
        {
          path: "/colegios/ministerio/docente/documento",
          name: "colegios-nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/viewDocument.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              {
                title: "Contenido libro",
                url: "/colegios/docente/libro/desgloselibro",
              },
              { title: "Documentos Ministeriales", active: true },
            ],
            pageTitle: "Documentos ministeriales",
            rule: "documentos",
          },
        },
        //=========================================================================
        //Fin de rutas para colegios
        //=========================================================================

        //=========================================================================
        //Rutas para webinar
        //=========================================================================

        //=========================================================================
        //FIN DE RUTAS PARA WEBINAR
        //=========================================================================

        //=========================================================================
        //Rutas para Matricula
        //=========================================================================

        {
          path: "/matricula/estudiante",
          name: "matricula-estudiante",
          component: () =>
            import(
              "@/views/gestion_matricula/estudiante/matricula_estudiante.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Gestión Matricula", active: true },
            ],
          },
        },

        {
          path: "/matricula/niveles",
          name: "matricula-niveles",
          component: () =>
            import(
              "@/views/gestion_matricula/administrador/matricula_niveles.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Gestión Matricula", active: true },
            ],
          },
        },

        {
          path: "/matricula/listado_matriculas",
          name: "listado_matriculas",
          component: () =>
            import(
              "@/views/gestion_matricula/administrador/listado_matriculas.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Listado Matrículas", active: true },
            ],
          },
        },

        //=========================================================================
        //Fin de rutas para Matricula
        //=========================================================================

        //=========================================================================
        //RUTAS  PARA SOPORTE
        //=========================================================================

        //Ruta para Ver usuarios por periodo
        {
          path: "/usuario/periodos/",
          name: "usuarios-periodos",
          component: () =>
            import("@/views/admin/usuarioPeriodos/usuarioPeriodos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },

              { title: "Usuarios por período", active: true },
            ],
          },
        },
        {
          path: "/docente/diagnostico",
          name: "docente-diagnostico",
          component: () => import("@/views/docentes/Diagnostico.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Menu Diagnóstico", active: true },
            ],
          },
        },
        {
          path: "/soporte",
          name: "soporte",
          component: () => import("@/views/soporte/soporte.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Soporte", active: true },
            ],
          },
        },
        {
          path: "/soporte/asesor",
          name: "soporte-asesor",
          component: () => import("@/views/soporte/soporte.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Gestión de tickets", active: true },
            ],
          },
        },

        {
          path: "/soporte/docente",
          name: "soporte-docente",
          component: () => import("@/views/soporte/ticketUsuario.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Soporte", active: true },
            ],
          },
        },
        {
          path: "/soporte/estudiante",
          name: "soporte-estudiante",
          component: () => import("@/views/soporte/ticketUsuario.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Soporte", active: true },
            ],
          },
        },

        {
          path: "/soporte/ticket/abierto/",
          name: "soporte-ticket",
          component: () =>
            import("@/views/soporte/components/seguimientoTicket.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Tickets", url: "/soporte" },
              { title: "Ticket abierto", active: true },
            ],
          },
        },

        {
          path: "/usuario/ticket/abierto/",
          name: "soporte-ticket",
          component: () =>
            import("@/views/soporte/components/seguimientoTicket.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },

              { title: "Ticket abierto", active: true },
            ],
          },
        },

        //=========================================================================
        //FIN RUTAS  PARA SOPORTE
        //=========================================================================

        {
          path: "/perfil",
          name: "perfil",
          component: () => import("./views/Perfil.vue"),
        },
        {
          path: "/cambio_password",
          name: "home",
          component: () => import("./views/pages/cambioPassword.vue"),
        },
        {
          path: "/institucion/addlibro",
          name: "institucionesLibro",
          component: () => import("./views/institucion/agregarLibro.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Agregar libro", active: true },
            ],
            pageTitle: "Libros gratis",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/librerias",
          name: "institucionesLibrerias",
          component: () => import("./views/institucion/addLibrerias.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Agregar librerias", active: true },
            ],
            pageTitle: "Librerias",
            rule: "instituciones",
          },
        },
        {
          path: "/instituciones",
          name: "instituciones",
          component: () => import("./views/institucion/instituciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/nuevo",
          name: "nuevo",
          component: () => import("./views/institucion/nuevo.vue"),
        },
        {
          path: "/institucion/docentes",
          name: "listaDocentes",
          component: () => import("./views/institucion/listaDocentes.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              // { title: 'Vista Reportes', url: '/reporte/institucion/' },
              { title: "Lista de docentes", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/estudiantes",
          name: "listaEstudiantes",
          component: () => import("./views/institucion/listaDocentes.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Lista de estudiantes", active: true },
            ],
            pageTitle: "Estudiantes",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/docentes/visitas",
          name: "visitasD",
          component: () => import("./views/institucion/visitasDocente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Lista de docentes", url: "/institucion/docentes" },
              { title: "Visitas", active: true },
            ],
            pageTitle: "Visitas docente",
            rule: "instituciones",
          },
        },
        {
          path: "/admin/usuarios/visitas",
          name: "AdminvisitasUsuarios",
          component: () => import("./views/institucion/visitasDocente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista de usuarios", url: "/usuarios" },
              { title: "Visitas", active: true },
            ],
            pageTitle: "Visitas docente",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/estudiante/visitas",
          name: "visitasE",
          component: () => import("./views/institucion/visitasDocente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              {
                title: "Lista de estudiantes",
                url: "/institucion/estudiantes",
              },
              { title: "Visitas", active: true },
            ],
            pageTitle: "Visitas estudiante",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/agregar",
          name: "agregarInstitucion",
          component: () => import("./views/institucion/addInstitucion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Agregar institución", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/editar/:id",
          name: "editarInstitucion",
          component: () => import("./views/institucion/addInstitucion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Editar institución", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/institucion/periodosInstitucion",
          name: "institucionesPeriodos",
          component: () => import("./views/periodos/periodosInstitucion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              { title: "Periodos por institución", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/director/institucion/listaLibrosEstudiante",
          name: "institucionesEstudiantesLibros",
          component: () => import("./views/director/listaLibrosEstudiante.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista instituciones", url: "/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              { title: "Lista libros", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/usuarios/librosEstudiante",
          name: "UsuariosEstudiantesLibros",
          component: () => import("./views/director/listaLibrosEstudiante.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista usuarios", url: "/usuarios" },
              { title: "Lista libros", active: true },
            ],
            pageTitle: "Estudiantes",
            rule: "institestudiantesuciones",
          },
        },
        {
          path: "/usuarios/agregar",
          name: "AdminAgregarUsuario",
          component: () => import("./views/usuarios/agrega_usuario.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista usuarios", url: "/usuarios" },
              { title: "Agregar usuario", active: true },
            ],
            pageTitle: "Usuarios",
            rule: "usuarios",
          },
        },
        // {
        //     path: '/institucion/editar/:id',
        //     name: 'editar',
        //     component: () =>
        //         import ('./views/institucion/nuevo.vue')
        // },
        // =============================================================================
        // Admin
        // =============================================================================
        {
          path: "/admin",
          name: "admin",
          component: () => import("./views/admin/admin.vue"),
        },
        {
          path: "/admin/nuevo",
          name: "nuevoadmin",
          component: () => import("./views/admin/nuevo.vue"),
        },
        {
          path: "/admin/editar",
          name: "editaradmin",
          component: () => import("./views/admin/nuevo.vue"),
        },
        {
          path: "/codigoslibros",
          name: "codigoslibros",
          component: () =>
            import("./views/codigos/CodigosLibrosComponent2.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista códigos", active: true },
            ],
            pageTitle: "Códigos libros",
            rule: "codigos",
          },
        },
        {
          path: "/codigoslibros2",
          name: "codigoslibros2",
          component: () =>
            import("./views/codigos/CodigosLibrosComponent2.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista códigos", active: true },
            ],
            pageTitle: "Códigos libros",
            rule: "codigos",
          },
        },
        // {
        //   path: "/codigoslibros2",
        //   name: "codigoslibros2",
        //   component: () => import("./views/codigos/CodigosLibrosComponent2.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },
        //       { title: "Lista códigos", active: true }
        //     ],
        //     pageTitle: "Códigos libros",
        //     rule: "codigos"
        //   }
        // },
        {
          path: "/publicaciones",
          name: "publicaciones",
          component: () =>
            import("./views/publicaciones/listaPublicaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista artículos pedagógicos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "publicaciones",
          },
        },
        {
          path: "/publicacion",
          name: "publicacion principal",
          component: () => import("./views/publicaciones/crearPub.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista articulos pedagógicos", url: "/publicaciones" },
              { title: "Agregar artículo", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "publicaciones",
          },
        },
        // =============================================================================
        // ARTICULOS PEDAGOGICOS - reemplazo de publicaciones del STRAPI
        // =============================================================================
        {
          path: "/listaArticulosPedagogicos",
          name: "listaArticulosPedagogicos-",
          component: () => import("./views/articulos/listaArticulos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista artículos pedagógicos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "articulos",
          },
        },
        {
          path: "/verArticulosAdmin",
          name: "verArticulosAdmin",
          component: () => import("./views/articulos/verArticulos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista artículos pedagógicos",
                url: "/listaArticulosPedagogicos",
              },
              { title: "Ver artículos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "articulos",
          },
        },
        {
          //articulos docente
          path: "docente/ver_articulos",
          name: "ver_articulos",
          component: () => import("./views/articulos/verArticulos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis artículos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "articulos",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/ver_aticulos",
          name: "directorInstitucionesDocentesLibroverarticulos",
          component: () => import("./views/articulos/verArticulos.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Artículos", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/vpublicaciones",
          name: "vpublicaciones",
          component: () => import("./views/publicaciones/verPublicaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis artículos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "juegos",
          },
        },
        {
          path: "/verpublicacionesAdmin",
          name: "vpublicaciones",
          component: () => import("./views/publicaciones/verPublicaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista artículos pedagógicos", url: "/publicaciones" },
              { title: "Ver artículos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "publicaciones",
          },
        },
        //=============RUTAS MIGRACION PARA ADAPTACIONES===============================
        {
          path: "/adaptacionesAdmin2",
          name: "adaptaciones2",
          component: () =>
            import("./views/adaptaciones2/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista adaptaciones curriculares", active: true },
            ],
            pageTitle: "Adaptaciones curriculares",
            rule: "juegos",
          },
        },
        {
          path: "/adaptaciones2/nuevaA",
          name: "nuevaA2",
          component: () => import("./views/adaptaciones2/nuevoAdapt.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista adaptaciones curriculares",
                url: "/adaptacionesAdmin2",
              },
              { title: "Agregar adaptación", active: true },
            ],
            pageTitle: "Adaptaciones curriculares",
            rule: "adaptaciones",
          },
        },
        {
          path: "/adaptacionesAdmin2/verA",
          name: "verA",
          component: () => import("./views/adaptaciones2/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista adaptaciones curriculares",
                url: "/adaptacionesAdmin2",
              },
              { title: "Ver adaptación", active: true },
            ],
            pageTitle: "Adaptaciones curriculares",
            rule: "adaptaciones",
          },
        },

        //DIRECTOR
        {
          path: "/director/institucion/docentes/contenidos/libro/adaptaciones2",
          name: "directorInstitucionesDocentesLibroAdaptaciones2",
          component: () =>
            import("./views/adaptaciones2/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Adaptaciones", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/adaptaciones2/ver",
          name: "directorInstitucionesDocentesLibroAdaptacionesVer2",
          component: () => import("./views/adaptaciones2/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Adaptaciones",
                url: "/director/institucion/docentes/contenidos/libro/adaptaciones2",
              },
              { title: "Ver", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        //DOCENTE
        {
          path: "/adaptaciones2",
          name: "adaptacionesd",
          component: () =>
            import("./views/adaptaciones2/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis adaptaciones curriculares", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "juegos",
          },
        },
        {
          path: "/adaptaciones2/verA",
          name: "verA",
          component: () => import("./views/adaptaciones2/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis adaptaciones curriculares", url: "/adaptaciones2" },
              { title: "Ver adaptación", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "adaptaciones",
          },
        },

        //=============FIN RUTAS MIGRACION PARA ADAPTACIONES===========================
        {
          path: "/a_adaptaciones",
          name: "adaptaciones",
          component: () => import("./views/adaptaciones/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Mis adaptaciones curriculares", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "juegos",
          },
        },
        {
          path: "/adaptaciones",
          name: "adaptaciones",
          component: () => import("./views/adaptaciones/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis adaptaciones curriculares", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "juegos",
          },
        },
        {
          path: "/adaptacionesAdmin",
          name: "adaptaciones",
          component: () => import("./views/adaptaciones/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista adaptaciones curriculares", active: true },
            ],
            pageTitle: "Adaptaciones curriculares",
            rule: "juegos",
          },
        },

        {
          path: "/adaptaciones/nuevaA",
          name: "nuevaA",
          component: () => import("./views/adaptaciones/nuevoAdapt.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista adaptaciones curriculares",
                url: "/adaptacionesAdmin",
              },
              { title: "Agregar adaptación", active: true },
            ],
            pageTitle: "Adaptaciones curriculares",
            rule: "adaptaciones",
          },
        },
        {
          path: "/adaptacionesAdmin/verA",
          name: "verA",
          component: () => import("./views/adaptaciones/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista adaptaciones curriculares",
                url: "/adaptacionesAdmin",
              },
              { title: "Ver adaptación", active: true },
            ],
            pageTitle: "Adaptaciones curriculares",
            rule: "adaptaciones",
          },
        },
        {
          path: "/adaptaciones/verA",
          name: "verA",
          component: () => import("./views/adaptaciones/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis adaptaciones curriculares", url: "/adaptaciones" },
              { title: "Ver adaptación", active: true },
            ],
            pageTitle: "Adaptaciones",
            rule: "adaptaciones",
          },
        },
        {
          path: "/verArchivo",
          name: "verArchivo",
          component: () => import("./views/adaptaciones/verArchivo.vue"),
        },
        {
          path: "/docente/a_propuestas",
          name: "propuestasAsignaturas",
          component: () =>
            import("./views/propuestaMetodologica/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Mis propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "propuestas",
          },
        },
        {
          path: "/propuestas",
          name: "propuestasDocente",
          component: () =>
            import("./views/propuestaMetodologica/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "juegos",
          },
        },
        //==========PROPUESTAS MIGRACION=======================
        //DOCENTE
        {
          path: "/docente/a_propuestas2",
          name: "propuestasAsignaturas2",
          component: () =>
            import("./views/propuestaMetodologica2/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Mis propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "propuestas",
          },
        },
        {
          path: "/propuestas2",
          name: "propuestasDocente2",
          component: () =>
            import("./views/propuestaMetodologica2/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "juegos",
          },
        },
        //ADMINISTRADOR
        {
          path: "/propuestasAdmin2",
          name: "propuestasAdmin2",
          component: () =>
            import("./views/propuestaMetodologica2/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "juegos",
          },
        },
        {
          path: "/nuevapropuesta2",
          name: "nuevapropuesta2",
          component: () =>
            import("./views/propuestaMetodologica2/nuevaProp.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Propuestas metodológicas", url: "/propuestas2" },
              { title: "Propuestas metodológicas", url: "/nuevapropuesta2" },
            ],
            pageTitle: "Agregar propuesta metodológica",
            rule: "propuestas",
          },
        },
        {
          path: "/verpropuesta2",
          name: "verpropuesta2",
          component: () =>
            import("./views/propuestaMetodologica2/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis propuestas metodológicas", url: "/propuestas2" },
              { title: "Ver propuesta metodológica", active: true },
            ],
            pageTitle: "Propuesta metodológica",
            rule: "propuestas",
          },
        },
        {
          path: "/verpropuestaAdmin2",
          name: "verpropuestaAdmin2",
          component: () =>
            import("./views/propuestaMetodologica2/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista propuestas metodológicas",
                url: "/propuestasAdmin2",
              },
              { title: "Ver propuesta metodológica", active: true },
            ],
            pageTitle: "Propuesta metodológica",
            rule: "propuestas",
          },
        },
        {
          path: "/verArchivoP2",
          name: "verArchivoP2",
          component: () =>
            import("./views/propuestaMetodologica2/verArchivoProp.vue"),
        },
        //DIRECTOR
        {
          path: "/director/institucion/docentes/contenidos/libro/propuestas2",
          name: "directorInstitucionesDocentesLibroPropuestas",
          component: () =>
            import("./views/propuestaMetodologica2/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Propuestas", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/propuestas/ver2",
          name: "directorInstitucionesDocentesLibroPropuestasVer2",
          component: () =>
            import("./views/propuestaMetodologica2/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Propuestas",
                url: "/director/institucion/docentes/contenidos/libro/propuestas2",
              },
              { title: "Ver", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },

        //==========FIN PROPUESTAS MIGRACION===================
        {
          path: "/propuestasAdmin",
          name: "propuestasAdmin",
          component: () =>
            import("./views/propuestaMetodologica/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista propuestas metodológicas", active: true },
            ],
            pageTitle: "Propuestas metodológicas",
            rule: "juegos",
          },
        },
        {
          path: "/nuevapropuesta",
          name: "nuevapropuesta",
          component: () =>
            import("./views/propuestaMetodologica/nuevaProp.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Propuestas metodológicas", url: "/propuestas" },
              { title: "Propuestas metodológicas", url: "/nuevapropuesta" },
            ],
            pageTitle: "Agregar propuesta metodológica",
            rule: "propuestas",
          },
        },
        {
          path: "/verpropuesta",
          name: "verpropuesta",
          component: () =>
            import("./views/propuestaMetodologica/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mis propuestas metodológicas", url: "/propuestas" },
              { title: "Ver propuesta metodológica", active: true },
            ],
            pageTitle: "Propuesta metodológica",
            rule: "propuestas",
          },
        },
        {
          path: "/verpropuestaAdmin",
          name: "verpropuestaAdmin",
          component: () =>
            import("./views/propuestaMetodologica/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista propuestas metodológicas",
                url: "/propuestasAdmin",
              },
              { title: "Ver propuesta metodológica", active: true },
            ],
            pageTitle: "Propuesta metodológica",
            rule: "propuestas",
          },
        },
        {
          path: "/verArchivoP",
          name: "verArchivoP",
          component: () =>
            import("./views/propuestaMetodologica/verArchivoProp.vue"),
        },

        {
          path: "/admin/documentosAdmin",
          name: "documentos",
          component: () =>
            import("./views/documentosMinisterio/listaDocumentos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista documentos", active: true },
            ],
            pageTitle: "Documentos ministeriales",
            rule: "documentos",
          },
        },

        {
          path: "/admin/nuevoDocumento",
          name: "nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/nuevoDocumento.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista documentos", url: "/admin/documentosAdmin" },
              { title: "Nuevo documento ministerial", active: true },
            ],
            pageTitle: "Documentos ministeriales",
            rule: "documentos",
          },
        },
        {
          path: "/admin/viewDocument",
          name: "nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/viewDocument.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista documentos", url: "/admin/documentosAdmin" },
              { title: "Ver documento ministerial", active: true },
            ],
            pageTitle: "Documentos ministeriales",
            rule: "documentos",
          },
        },
        {
          path: "/ver/viewDocument",
          name: "ver-nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/viewDocument.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Ver documento ministerial", active: true },
            ],
          },
        },
        {
          path: "/ministerio/docente/documento",
          name: "nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/viewDocument.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Desglose Libro", url: "/docente/libro/desgloselibro" },
              { title: "Documentos Ministeriales", active: true },
            ],
            pageTitle: "Documentos ministeriales",
            rule: "documentos",
          },
        },
        {
          path: "/ministerio/docente",
          name: "nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/docenteDocumentos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Desglose Libro", url: "/docente/libro/desgloselibro" },
              { title: "Documentos Ministeriales", active: true },
            ],
            pageTitle: "Documentos Ministeriales",
            rule: "documentos",
          },
        },
        {
          path: "/admin/editarDocumentos",
          name: "nuevoDocumento",
          component: () =>
            import("./views/documentosMinisterio/editarDocumentos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista documentos", url: "/admin/documentosAdmin" },
              { title: "Editar documento ministerial", active: true },
            ],
            pageTitle: "Documentos ministeriales",
            rule: "documentos",
          },
        },
        //////RUTAS DIRECTOR
        {
          path: "/director/instituciones",
          name: "directorInstituciones",
          component: () => import("./views/director/institucionesDirector.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes",
          name: "directorInstituciones",
          component: () => import("./views/director/listaDocentes.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              { title: "Lista docentes", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos",
          name: "directorInstitucionesDocentes",
          component: () => import("./views/director/contenidosDocente.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              { title: "Detalles", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro",
          name: "directorInstitucionesDocentesLibro",
          component: () => import("./views/libros/desgloselibro.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              { title: "Libro", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/unidad",
          name: "directorInstitucionesDocentesLibroUnidad",
          component: () => import("./views/libros/desgloseunidad.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Unidades", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso",
          name: "directorInstitucionesDocentesLibroCurso",
          component: () => import("./views/docentes/desglose_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Curso", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/tarea",
          name: "directorInstitucionesDocentesLibroCursoTareas",
          component: () => import("./views/docentes/cursoVirtual.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Tareas", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/tareas/recibidas",
          name: "directorInstitucionesDocentesLibroCursoTareas",
          component: () => import("./views/clases/tareasRecibidas.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              {
                title: "Tareas",
                url: "/director/institucion/docentes/contenidos/libro/curso/tarea",
              },
              { title: "Recibidas", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/foro",
          name: "directorInstitucionesDocentesLibroCursoForo",
          component: () => import("./views/docentes/foros_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Foro", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/foro/respuestas",
          name: "directorInstitucionesDocentesLibroCursoForoRespuestas",
          component: () => import("./views/docentes/respuestas_foro.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              {
                title: "Foro",
                url: "/director/institucion/docentes/contenidos/libro/curso/foro",
              },
              { title: "Respuestas", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/actividades",
          name: "directorInstitucionesDocentesLibroCursoActividades",
          component: () => import("./views/docentes/actividades_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Actividades", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/proyectos",
          name: "directorInstitucionesDocentesLibroCursoProyectos",
          component: () => import("./views/proyectos/listaProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Proyectos", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/proyectos/verproyecto",
          name: "directorInstitucionesDocentesLibroCursoProyectosVer",
          component: () => import("./views/proyectos/verWebQ.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              {
                title: "Proyectos",
                url: "/director/institucion/docentes/contenidos/libro/curso/proyectos",
              },
              { title: "Ver proyecto", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/proyectos/respuestas",
          name: "directorInstitucionesDocentesLibroCursoProyectosRespuestas",
          component: () => import("./views/proyectos/listaRespProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              {
                title: "Proyectos",
                url: "/director/institucion/docentes/contenidos/libro/curso/proyectos",
              },
              { title: "Respuestas", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/evaluaciones",
          name: "directorInstitucionesDocentesLibroCursoEvaluaciones",
          component: () =>
            import("./views/evaluaciones/EvaluacionesComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Evaluaciones", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/evaluaciones",
          name: "directorInstitucionesDocentesLibroCursoEvaluaciones",
          component: () =>
            import("./views/evaluaciones/EvaluacionesComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Evaluaciones", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/zonadiversion",
          name: "directorInstitucionesDocentesLibroZonadiversion",
          component: () => import("./views/docentes/tipos_juegos_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Zona diversión", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/zonadiversion/juegoDocente",
          name: "directorInstitucionesDocentesLibroZonadiversionjuegoDocente",
          component: () => import("./views/juegos/contenido_juego_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Zona diversión",
                url: "/director/institucion/docentes/contenidos/libro/zonadiversion",
              },
              { title: "Juego", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/materialapoyo",
          name: "directorInstitucionesDocentesLibroZonadiversionjuegoDocente",
          component: () => import("./views/materialapoyo/materialapoyo.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "material apoyo", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/adaptaciones",
          name: "directorInstitucionesDocentesLibroAdaptaciones",
          component: () => import("./views/adaptaciones/listaAdaptaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Adaptaciones", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/adaptaciones/ver",
          name: "directorInstitucionesDocentesLibroAdaptacionesVer",
          component: () => import("./views/adaptaciones/verAdaptacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Adaptaciones",
                url: "/director/institucion/docentes/contenidos/libro/adaptaciones",
              },
              { title: "Ver", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/propuestas",
          name: "directorInstitucionesDocentesLibroPropuestas",
          component: () =>
            import("./views/propuestaMetodologica/listaPropuestas.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Propuestas", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/propuestas/ver",
          name: "directorInstitucionesDocentesLibroPropuestasVer",
          component: () =>
            import("./views/propuestaMetodologica/verPropuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Propuestas",
                url: "/director/institucion/docentes/contenidos/libro/propuestas",
              },
              { title: "Ver", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/aticulos",
          name: "directorInstitucionesDocentesLibroarticulos",
          component: () => import("./views/publicaciones/verPublicaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              { title: "Artículos", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        // =============================================================================
        // Vendendor
        // =============================================================================
        {
          path: "/vendedores",
          name: "vendedor",
          component: () => import("./views/vendedor/vendedor.vue"),
        },
        {
          path: "/vendedor/nuevo",
          name: "nuevovendedores",
          component: () => import("./views/vendedor/nuevo.vue"),
        },
        {
          path: "/vendedor/editar",
          name: "editarvendedores",
          component: () => import("./views/vendedor/nuevo.vue"),
        },
        // =============================================================================
        // Usuarios
        // =============================================================================
        {
          path: "/usuarios",
          name: "docentes",
          component: () => import("./views/usuarios/screen.vue"),
        },

        {
          path: "/usuarios/editar/:id",
          name: "editardocentes",
          component: () => import("./views/docentes/editar.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Usuarios", url: "/usuarios" },
              { title: "Editar usuario", active: true },
            ],
            pageTitle: "Editar Usuario",
          },
        },
        // =============================================================================
        // Docentes
        // =============================================================================
        {
          path: "/docente/nuevo",
          name: "nuevodocentes",
          component: () => import("./views/docentes/nuevo.vue"),
        },
        {
          path: "/docente/archivos",
          name: "archivosdocentes",
          component: () => import("./views/docentes/archivos.vue"),
        },
        {
          path: "/docente/teletareas",
          name: "teletareas",
          component: () => import("./views/docentes/teletareas.vue"),
        },
        {
          path: "/docente/cursos",
          name: "cursos",
          component: () => import("./views/docentes/cursos.vue"),
        },
        {
          path: "/docente/desglose_curso",
          name: "desglose_curso",
          component: () => import("./views/docentes/desglose_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "cursos",
          },
        },
        {
          path: "/docente/cursos_asig_docente",
          name: "cursos_asig_docente",
          component: () => import("./views/docentes/cursos_asig_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido asignatura", active: true },
            ],
            pageTitle: "Asignatura",
            rule: "libro",
          },
        },
        {
          path: "/cursos_asig_doc_evaluacion",
          name: "cursos_asig_doc_evaluacion",
          component: () =>
            import("./views/docentes/cursos_asig_doc_evaluacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Libros Evaluaciones", url: "/cursosevaluaciones" },
              { title: "Contenido asignatura", active: true },
            ],
            pageTitle: "Asignatura",
            rule: "libro",
          },
        },
        {
          path: "/cursos_libro_evaluacion",
          name: "cursos_libro_evaluacion",
          component: () =>
            import("./views/docentes/cursos_libro_evaluacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Libros evaluaciones", url: "/cursosevaluaciones" },
              { title: "Cursos Libro", active: true },
            ],
            pageTitle: "Asignatura",
            rule: "libro",
          },
        },
        {
          path: "/docente/actividades_curso",
          name: "actividades_curso",
          component: () => import("./views/docentes/actividades_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Actividades", active: true },
            ],
            pageTitle: "Actividades",
            rule: "proyectos",
          },
        },
        {
          path: "/docente/juegos_curso",
          name: "juegos_curso",
          component: () => import("./views/docentes/juegos_curso.vue"),
        },
        {
          path: "/docente/juegos_asignatura",
          name: "juegos_asignatura",
          component: () => import("./views/docentes/juegos_asignatura.vue"),
        },
        {
          path: "/docente/teletareas_asignatura",
          name: "teletareas_asignatura",
          component: () => import("./views/docentes/teletareas_asignatura.vue"),
        },
        {
          path: "/docente/contenido_juego_docente",
          name: "contenido_juego_docente",
          component: () => import("./views/juegos/contenido_juego_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos ", active: true },
            ],
            pageTitle: "Zona diversión",
            rule: "juegos",
          },
        },
        {
          path: "/docente/a_contenido_juego_docente",
          name: "contenido_juego_docente",
          component: () => import("./views/juegos/contenido_juego_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Zona diversión",
                url: "/docente/a_tipos_juegos_docente",
              },
              { title: "Mis juegos ", active: true },
            ],
            pageTitle: "Zona diversión",
            rule: "juegos",
          },
        },
        {
          path: "/docente/curso/nuevo",
          name: "cursos",
          component: () => import("./views/docentes/nuevo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Agregar curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "curso",
          },
        },
        {
          path: "/docente/curso/editar",
          name: "cursos",
          component: () => import("./views/docentes/nuevo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Editar curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "curso",
          },
        },
        {
          path: "/docente/curso/virtual/:nombre",
          name: "cursos",
          component: () => import("./views/docentes/cursoVirtual.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Tareas", active: true },
            ],
            pageTitle: "Tareas",
            rule: "tareas",
          },
        },
        {
          path: "/docente/curso/necesidad/educativas",
          name: "cursos-educativas",
          component: () =>
            import("./views/docentes/Neet/NeetTareaDocenteMenu.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Tareas Necesidades Educativas", active: true },
            ],
            pageTitle: "Tareas",
            rule: "tareas",
          },
        },
        {
          path: "/docente/curso/a_virtual/:nombre",
          name: "cursos",
          component: () => import("./views/docentes/cursoVirtual.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Contenido curso",
                url: "/docente/libro/desglose_asig_docente",
              },
              { title: "Tareas", active: true },
            ],
            pageTitle: "Tareas",
            rule: "tareas",
          },
        },
        {
          path: "/docente/curso/tarea/nueva",
          name: "cursos",
          component: () => import("./views/docentes/agregarTareas.vue"),
        },
        {
          path: "/docente/curso/virutal/foro",
          name: "cursos",
          component: () => import("./views/docentes/foro.vue"),
        },
        {
          path: "/docente/libros",
          name: "libros",
          component: () => import("./views/docentes/libros.vue"),
        },
        {
          path: "/docente/libros2",
          name: "libros2",
          component: () => import("./views/docentes/libros2.vue"),
        },
        {
          path: "/docente/libro/desgloselibro",
          name: "desgloselibro",
          component: () => import("./views/libros/desgloselibro.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", active: true },
            ],
            pageTitle: "Libro",
            rule: "libros",
          },
        },
        //ruta para mostrar el libro en el administrador

        {
          path: "/docente/libro/desglose_asig_docente",
          name: "desglose_asig_docente",
          component: () => import("./views/libros/desglose_asig_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Contenido curso", active: true },
            ],
            pageTitle: "Curso",
            rule: "curso",
          },
        },
        {
          path: "/docente/libro/desgloseunidad",
          name: "desgloseunidad",
          component: () => import("./views/libros/desgloseunidad.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido unidad", active: true },
            ],
            pageTitle: "Libro",
            rule: "libro",
          },
        },
        {
          path: "/docente/libro/desglosetema",
          name: "desglosetema",
          component: () => import("./views/libros/desglosetema.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              {
                title: "Contenido unidad",
                url: "/docente/libro/desgloseunidad",
              },
              { title: "Contenido tema", active: true },
            ],
            pageTitle: "Tema",
            rule: "libro",
          },
        },
        {
          path: "/docente/cuadernos",
          name: "cuadernos",
          component: () => import("./views/docentes/cuadernos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Cuadernos", active: true },
            ],
            pageTitle: "Libros",
            rule: "libro",
          },
        },
        {
          path: "/docente/guias",
          name: "guias",
          component: () => import("./views/docentes/guias.vue"),
        },
        {
          path: "/docente/planlector",
          name: "planlector",
          component: () => import("./views/docentes/planlector.vue"),
        },
        {
          path: "/docente/planificaciones",
          name: "planificaciones",
          component: () => import("./views/docentes/planificaciones.vue"),
        },
        {
          path: "/docente/material",
          name: "materialapoyo",
          component: () => import("./views/docentes/materialapoyo.vue"),
        },

        {
          path: "/docente/juegos",
          name: "juegos",
          component: () => import("./views/docentes/juegos.vue"),
        },
        {
          path: "/docente/a_tipos_juegos_docente",
          name: "tipos_juegos_docente",
          component: () => import("./views/docentes/tipos_juegos_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Zona diversión", active: true },
            ],
            pageTitle: "Zona diversión",
            rule: "juegos",
          },
        },
        {
          path: "/docente/tipos_juegos_docente",
          name: "tipos_juegos_docente",
          component: () => import("./views/docentes/tipos_juegos_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", active: true },
            ],
            pageTitle: "Zona diversión",
            rule: "juegos",
          },
        },
        {
          path: "/docente/videos",
          name: "videos",
          component: () => import("./views/docentes/videos.vue"),
        },
        {
          path: "/docente/audios",
          name: "audios",
          component: () => import("./views/docentes/audios.vue"),
        },
        {
          path: "/docente/a_foros_curso",
          name: "foros_curso",
          component: () => import("./views/docentes/foros_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Contenido curso",
                url: "/docente/libro/desglose_asig_docente",
              },
              { title: "Foro", active: true },
            ],
            pageTitle: "Foros",
            rule: "foro",
          },
        },
        {
          path: "/docente/foros_curso",
          name: "foros_curso",
          component: () => import("./views/docentes/foros_curso.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Foro", active: true },
            ],
            pageTitle: "Foros",
            rule: "foro",
          },
        },
        {
          path: "/docente/respuestas_foro",
          name: "respuestas_foro",
          component: () => import("./views/docentes/respuestas_foro.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Foros", url: "/docente/foros_curso" },
              { title: "Respuestas", active: true },
            ],
            pageTitle: "Respuestas",
            rule: "foro",
          },
        },
        {
          path: "/docente/a_vpublicaciones",
          name: "vpublicaciones",
          component: () => import("./views/publicaciones/verPublicaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Mis artículos", active: true },
            ],
            pageTitle: "Artículos pedagógicos",
            rule: "articulos",
          },
        },
        {
          path: "/articulo",
          name: "articulo",
          component: () => import("./views/publicaciones/verArticulo.vue"),
        },

        // =============================================================================
        // Estudiantes
        // =============================================================================
        {
          path: "/estudiantes",
          name: "estudiantes",
          component: () => import("./views/estudiantes/estudiantes.vue"),
        },
        {
          path: "/estudiante/nuevo",
          name: "nuevoestudiantes",
          component: () => import("./views/estudiantes/nuevo.vue"),
        },
        {
          path: "/estudiante/editar",
          name: "editarestudiantes",
          component: () => import("./views/estudiantes/nuevo.vue"),
        },
        {
          path: "/estudiante/libros",
          name: "librosestudiantes",
          component: () => import("./views/estudiantes/libros.vue"),
        },
        {
          path: "/estudiante/cuadernos",
          name: "librosestudiantes",
          component: () => import("./views/estudiantes/cuadernos.vue"),
        },
        {
          path: "/estudiante/cursos",
          name: "cursosestudiantes",
          component: () => import("./views/estudiantes/cursos.vue"),
        },
        {
          path: "/estudiante/curso/virtual",
          name: "curso",
          component: () => import("@/views/estudiantes/virtual.vue"),
        },
        {
          path: "/estudiante/tarea",
          name: "curso",
          component: () => import("@/views/estudiantes/agregarTarea.vue"),
        },
        {
          path: "/estudiante/juegos",
          name: "curso",
          component: () => import("@/views/estudiantes/juegos.vue"),
        },
        {
          path: "/estudiante/foro",
          name: "foro",
          component: () => import("@/views/estudiantes/foro.vue"),
        },
        {
          path: "/estudiante/proyectos",
          name: "proyectos",
          component: () => import("@/views/estudiantes/proyectos.vue"),
        },
        {
          path: "/estudiante/respuestas",
          name: "foro",
          component: () => import("@/views/estudiantes/respuestasForo.vue"),
        },
        {
          path: "/estudiante/evaluaciones",
          name: "evaluacionesEstudiante",
          component: () => import("@/views/estudiantes/evaluaciones.vue"),
        },
        {
          path: "/estudiante/material",
          name: "materialEstudiante",
          component: () => import("@/views/estudiantes/material.vue"),
        },
        {
          path: "/estudiante/fichas",
          name: "estudiante-fichas",
          component: () =>
            import("@/views/fichas/estudiante/ScreenFichaEstudiante.vue"),
        },
        {
          path: "/estudiante/necesidades-educativas",
          name: "estudiante-necesidades",
          component: () =>
            import("@/views/estudiantes/neet/NeetMenuEstudiante.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis Cursos", url: "/estudiante/cursos" },
              { title: "", url: "" },
            ],
          },
        },
        {
          path: "/estudiante/zonadiversion",
          name: "zonadiversionEstudiante",
          component: () => import("@/views/estudiantes/zonadiversion.vue"),
        },
        {
          path: "/actividades_digitales/:link",
          name: "actividades_digitales",
          component: () => import("./views/docentes/actividades_digitales.vue"),
        },
        // =============================================================================
        // Contenidos
        // =============================================================================
        {
          path: "/contenidos",
          name: "contenidos",
          component: () => import("./views/contenidos/contenidos.vue"),
        },
        {
          path: "/contenido/nuevo",
          name: "nuevocontenidos",
          component: () => import("./views/contenidos/nuevo.vue"),
        },
        {
          path: "/contenido/editar",
          name: "editarcontenidos",
          component: () => import("./views/contenidos/nuevo.vue"),
        },
        // =============================================================================
        // Contenidos
        // =============================================================================

        {
          path: "/periodo/editar",
          name: "editarperiodos",
          component: () => import("./views/periodos/nuevo.vue"),
        },
        // =============================================================================
        // Planificaciones
        // =============================================================================
        {
          path: "/planificaciones",
          name: "planificaciones",
          component: () => import("./views/planificaciones/screen.vue"),
        },
        {
          path: "/planificaciones/agenda",
          name: "planificaciones/agenda",
          component: () => import("./views/planificaciones/agenda.vue"),
        },

        // {
        //     path: '/prueba/planificaciones',
        //     name: 'planificaciones-prueba',
        //     component: () =>
        //         import ('./views/planificaciones/pruebaPlanificacion.vue'),
        // },

        // =============================================================================
        // Asignaturas
        // =============================================================================
        {
          path: "/asignaturas",
          name: "asignaturas",
          component: () => import("./views/asignaturas/asignaturas.vue"),
        },
        {
          path: "/asignatura/nuevo",
          name: "nuevoasignaturas",
          component: () => import("./views/asignaturas/nuevo.vue"),
        },
        {
          path: "/asignatura/editar",
          name: "editarasignaturas",
          component: () => import("./views/asignaturas/nuevo.vue"),
        },
        // =============================================================================
        // Clases
        // =============================================================================
        {
          path: "/clases",
          name: "clases",
          component: () => import("./views/clases/clases.vue"),
        },
        {
          path: "/clase/nuevo",
          name: "nuevoclases",
          component: () => import("./views/clases/nuevo.vue"),
        },
        {
          path: "/clase/editar",
          name: "editarclases",
          component: () => import("./views/clases/nuevo.vue"),
        },
        {
          path: "/clase/virtual/tareas",
          name: "tareasclases",
          component: () => import("./views/clases/tareasRecibidas.vue"),
        },

        // =============================================================================
        // Libros
        // =============================================================================
        {
          path: "/lista/libros",
          name: "libros",
          component: () => import("./views/libros/ListaLibros.vue"),
        },
        {
          path: "/libros",
          name: "libros",
          component: () => import("./views/libros/libros.vue"),
        },
        {
          path: "/libro/nuevo",
          name: "nuevolibros",
          component: () => import("./views/libros/nuevo.vue"),
        },
        {
          path: "/libro/editar",
          name: "editarlibros",
          component: () => import("./views/libros/nuevo.vue"),
        },

        // =============================================================================
        // Cuadernos
        // =============================================================================
        // {
        //     path: '/lista/cuadernos',
        //     name: 'cuadernos',
        //     component: () =>
        //         import ('./views/cuadernos/cuadernos.vue'),
        // },
        {
          path: "/cuaderno/nuevo",
          name: "nuevocuadernos",
          component: () => import("./views/cuadernos/nuevo.vue"),
        },
        {
          path: "/cuaderno/editar",
          name: "editarcuadernos",
          component: () => import("./views/cuadernos/nuevo.vue"),
        },
        {
          path: "/cuaderno/digital",
          name: "digitalcuadernos",
          component: () => import("./views/cuadernos/digital.vue"),
        },
        // =============================================================================
        // Guias
        // =============================================================================
        {
          path: "/lista/guias",
          name: "guias",
          component: () => import("./views/guias/guias.vue"),
        },
        {
          path: "/guia/nuevo",
          name: "nuevoguias",
          component: () => import("./views/guias/nuevo.vue"),
        },
        {
          path: "/guia/editar",
          name: "editarguias",
          component: () => import("./views/guias/nuevo.vue"),
        },
        {
          path: "/guia/digital",
          name: "digitalguias",
          component: () => import("./views/guias/digital.vue"),
        },
        // =============================================================================
        // Plan Lector
        // =============================================================================
        {
          path: "/lista/planlector",
          name: "planlector",
          component: () => import("./views/planlector/planlector.vue"),
        },
        {
          path: "/planlector/nuevo",
          name: "nuevoplanlector",
          component: () => import("./views/planlector/nuevo.vue"),
        },
        {
          path: "/planlector/editar",
          name: "editarplanlector",
          component: () => import("./views/planlector/nuevo.vue"),
        },
        {
          path: "/planlector/digital",
          name: "digitalplanlector",
          component: () => import("./views/planlector/digital.vue"),
        },
        // =============================================================================
        // Material Apoyo
        // =============================================================================
        {
          path: "/material/subir",
          name: "materialapoyo",
          component: () =>
            import("./views/materialapoyo/material_subir/listadoMaterial.vue"),
          meta: {
            breadcrumb: [{ title: "Home", url: "/home" }],
            pageTitle: "Material subir",
          },
        },
        {
          path: "/docente/a_materialapoyo",
          name: "materialapoyo",
          component: () => import("./views/materialapoyo/materialapoyo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              { title: "Mi material de apoyo ", active: true },
            ],
            pageTitle: "Material de apoyo",
            rule: "juegos",
          },
        },
        {
          path: "/lista/materialapoyo",
          name: "materialapoyo",
          component: () => import("./views/materialapoyo/materialapoyo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mi material de apoyo ", active: true },
            ],
            pageTitle: "Material de apoyo",
            rule: "juegos",
          },
        },
        {
          path: "/lista/fichas",
          name: "lista-fichas",
          component: () =>
            import("./views/fichas/docente/ScreenFichaDocente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Listado de fichas", active: true },
            ],
          },
        },
        {
          path: "/lista/necesidades-educativas",
          name: "lista-necesidades",
          component: () => import("./views/docentes/Neet/NeetMenuDocente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Listado de Necesidades Educativas", active: true },
            ],
          },
        },
        {
          path: "/subirmaterial/docente",
          name: "subirmaterial-docente",
          component: () =>
            import("./views/materialapoyo/components/crearmaterial.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Mi material de apoyo ", active: true },
            ],
            pageTitle: "Subir archivos",
          },
        },
        //ruta apra subir los docentes archivos
        {
          path: "/lista/materialapoyoAdmin",
          name: "materialapoyo",
          component: () => import("./views/materialapoyo/materialapoyo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista material de apoyo ", active: true },
            ],
            pageTitle: "Material de apoyo",
            rule: "juegos",
          },
        },
        {
          path: "/materialapoyo/nuevo",
          name: "nuevomaterialapoyo",
          component: () => import("./views/materialapoyo/nuevo.vue"),
        },
        {
          path: "/materialapoyo/editar",
          name: "editarmaterialapoyo",
          component: () => import("./views/materialapoyo/nuevo.vue"),
        },
        {
          path: "/materialapoyo/digital",
          name: "digitalmaterialapoyo",
          component: () => import("./views/materialapoyo/digital.vue"),
        },
        {
          path: "/calificaciones_materialapoyo",
          name: "calificaciones_materialapoyo",
          component: () =>
            import("./views/materialapoyo/calificaciones_materialapoyo.vue"),
        },
        // =============================================================================
        // Videos
        // =============================================================================
        {
          path: "/lista/videos",
          name: "videos",
          component: () => import("./views/videos/videos.vue"),
        },
        {
          path: "/video/nuevo",
          name: "nuevovideo",
          component: () => import("./views/videos/nuevo.vue"),
        },
        {
          path: "/video/editar",
          name: "editarvideo",
          component: () => import("./views/videos/nuevo.vue"),
        },
        {
          path: "/video/digital",
          name: "digitalvideo",
          component: () => import("./views/videos/digital.vue"),
        },
        // =============================================================================
        // Audios
        // =============================================================================
        {
          path: "/lista/audios",
          name: "audios",
          component: () => import("./views/audios/audios.vue"),
        },
        {
          path: "/audio/nuevo",
          name: "nuevoaudio",
          component: () => import("./views/audios/nuevo.vue"),
        },
        {
          path: "/audio/editar",
          name: "editaraudio",
          component: () => import("./views/audios/nuevo.vue"),
        },
        {
          path: "/audio/digital",
          name: "digitalaudio",
          component: () => import("./views/audios/digital.vue"),
        },
        // =============================================================================
        // Juegos
        // =============================================================================
        {
          path: "/lista/juegos",
          name: "juegos",
          component: () => import("./views/juegos/juegos.vue"),
        },
        {
          path: "/juego/nuevo",
          name: "nuevojuego",
          component: () => import("./views/juegos/nuevo.vue"),
        },
        {
          path: "/juego/editar",
          name: "editarjuego",
          component: () => import("./views/juegos/nuevo.vue"),
        },
        {
          path: "/juegos_prolipa",
          name: "juegos_prolipa",
          component: () => import("./views/juegos/JuegosProlipa.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", active: true },
            ],
            pageTitle: "Juegos",
            rule: "juegos",
          },
        },
        {
          path: "/contenido_juego",
          name: "contenido_juego",
          component: () => import("./views/juegos/ContenidoJuego.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juego", active: true },
            ],
            pageTitle: "Juegos",
            rule: "juegos",
          },
        },
        {
          path: "/crear_juego_ponchado",
          name: "crear_juego_ponchado",
          component: () => import("./views/juegos/crearJuego_ponchado.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Ponchado",
            rule: "juegos",
          },
        },
        {
          path: "/crear_juego_ponchadoAdmin",
          name: "crear_juego_ponchado",
          component: () => import("./views/juegos/crearJuego_ponchado.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juegos", url: "/contenido_juego" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Ponchado",
            rule: "juegos",
          },
        },
        {
          path: "/a_crear_juego_ponchado",
          name: "crear_juego_ponchado",
          component: () => import("./views/juegos/crearJuego_ponchado.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Zona diversión",
                url: "/docente/a_tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/docente/a_contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Ponchado",
            rule: "juegos",
          },
        },
        {
          path: "/crear_juego_sopa",
          name: "crear_juego_sopa",
          component: () => import("./views/juegos/crearJuego_sopa.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Sopa de letras",
            rule: "juegos",
          },
        },
        {
          path: "/crearRompecabezas_docente",
          name: "crearRompecabezas_docente",
          component: () =>
            import("./views/juegos/crearRompecabezas_docente.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Rompecabezas",
            rule: "juegos",
          },
        },
        {
          path: "/crear_juego_sopaAdmin",
          name: "crear_juego_sopaAdmin",
          component: () => import("./views/juegos/crearJuego_sopa.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juegos", url: "/contenido_juego" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Sopa de letras",
            rule: "juegos",
          },
        },
        {
          path: "/a_crear_juego_sopa",
          name: "a_crear_juego_sopa",
          component: () => import("./views/juegos/crearJuego_sopa.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Zona diversión",
                url: "/docente/a_tipos_juegos_docente",
              },
              {
                title: "Mis juegos",
                url: "/docente/a_contenido_juego_docente",
              },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Sopa de letras",
            rule: "juegos",
          },
        },
        // {
        //   path: "/sopa_letras/:id/:codigo",
        //   name: "sopa_letras",
        //   component: () => import("./views/juegos/sopa_letras.vue"),
          // meta: {
          //   breadcrumb: [
          //     { title: "Home", url: "/home" },
          //     { title: "Mis libros", url: "/docente/libros2" },
          //     { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
          //     { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
          //     { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
          //     { title: "Agregar juego", active: true },
          //   ],
          //   pageTitle: "Sopa de letras",
          //   rule: "juegos",
          // },
        // },
        {
          path: "/rompecabezas/:id/:codigo",
          name: "rompecabezas",
          component: () => import("./views/juegos/rompecabezas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Rompecabezas",
            rule: "juegos",
          },
        },

        {
          path: "/jugarponchado/:id/",
          name: "ponchado",
          component: () => import("./views/juegos/ponchado.vue"),
        },
        {
          path: "/jugarsopa_letras/:id",
          name: "sopa_letras",
          component: () => import("./views/juegos/sopa_letras.vue"),
        },
        {
          path: "/jugar_rompecabezas/:id",
          name: "sopa_letras",
          component: () => import("./views/juegos/rompecabezas.vue"),
        },
        {
          path: "/seleccionSimple/:id",
          name: "seleccionSimple",
          component: () => import("./views/juegos/seleccionSimple.vue"),
        },
        {
          path: "/jugarMillonario_estudiante/:id/:codigo",
          name: "jugarMillonario_estudiante",
          component: () => import("./views/juegos/juegoMillonario.vue"),
        },
        // {
        //     path: '/jugarSeleccionSimple/:id/:codigo',
        //     name: 'jugarSeleccionSimple',
        //     component: () =>
        //         import ('./views/juegos/seleccionSimple.vue')
        // },
        // {
        //     path: '/jugarSeleccionSimple_estudiante/:id',
        //     name: 'jugarSeleccionSimple_estudiante',
        //     component: () =>
        //         import ('./views/juegos/seleccionSimple.vue')
        // },
        {
          path: "/crearJuegoSeleccionSimple",
          name: "crearJuegoSeleccionSimple",
          component: () => import("./views/juegos/crearSeleccionSimple.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juegos", url: "/contenido_juego" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Seleccion",
            rule: "juegos",
          },
        },
        {
          path: "/crearJuegoSeleccionSimple_docente",
          name: "crearJuegoSeleccionSimple_docente",
          component: () => import("./views/juegos/crearSeleccionSimple.vue"),
          meta: {
            breadcrumb: [
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Seleccion",
            rule: "juegos",
          },
        },
        {
          path: "/crearJuegoMillonario_docente",
          name: "crearJuegoMillonario_docente",
          component: () => import("./views/juegos/crearSeleccionSimple.vue"),
          meta: {
            breadcrumb: [
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Millonario",
            rule: "juegos",
          },
        },
        {
          path: "/crearJuegoMillonario",
          name: "crearJuegoMillonario",
          component: () => import("./views/juegos/crearMillonario.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juegos", url: "/contenido_juego" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Millonario",
            rule: "juegos",
          },
        },
        {
          path: "/crearJuegoMemoria_docente",
          name: "crearJuegoMemoria_docente",
          component: () => import("./views/juegos/crearMemoria.vue"),
          meta: {
            breadcrumb: [
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Zona diversión", url: "/docente/tipos_juegos_docente" },
              { title: "Mis juegos", url: "/docente/contenido_juego_docente" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Memoria",
            rule: "juegos",
          },
        },
        {
          path: "/crearJuegoMemoriaAdmin",
          name: "crearJuegoMemoriaAdmin",
          component: () => import("./views/juegos/crearMemoria.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juegos", url: "/contenido_juego" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Memoria",
            rule: "juegos",
          },
        },
        {
          path: "/crearJuegoRompecabezas",
          name: "crearJuegoRompecabezas",
          component: () => import("./views/juegos/crearRompecabezas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Juegos Prolipa", url: "/juegos_prolipa" },
              { title: "Lista juegos", url: "/contenido_juego" },
              { title: "Agregar juego", active: true },
            ],
            pageTitle: "Rompecabezas",
            rule: "juegos",
          },
        },
        {
          path: "/admin/capacitacionesLista",
          name: "admin/capacitacionesLista",
          component: () => import("./views/admin/screen_capacitaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista capacitaciones", active: true },
            ],
            pageTitle: "Capacitaciones",
            rule: "capacitacion",
          },
        },

        {
          path: "/asesor/seguimiento/visitas",
          name: "asesor-visitas",
          component: () =>
            import("./views/asesor/seguimiento/components/visitas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Visitas", active: true },
            ],
          },
        },

        {
          path: "/admin/capacitacionesAdmin",
          name: "admin/capacitacionesAdmin",
          component: () => import("./views/admin/capacitaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista capacitaciones", active: true },
            ],
            pageTitle: "Capacitaciones",
            rule: "capacitacion",
          },
        },
        {
          path: "/admin/agendaCapacitacionAdmin",
          name: "admin/agendaCapacitacionAdmin",
          component: () => import("./views/admin/capacitaciones_agenda.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Agenda capacitaciones", active: true },
            ],
            pageTitle: "Agenda",
            rule: "agenda",
          },
        },

        // =============================================================================
        // Evaluaciones
        // =============================================================================
        {
          path: "/docente/a_evaluaciones",
          name: "evaluaciones",
          component: () =>
            import("./views/evaluaciones/EvaluacionesComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Contenido curso",
                url: "/docente/libro/desglose_asig_docente",
              },
              { title: "Evaluaciones", active: true },
            ],
            pageTitle: "Evaluaciones",
            rule: "evaluaciones",
          },
        },
        {
          path: "/evaluaciones",
          name: "evaluaciones",
          component: () =>
            import("./views/evaluaciones/EvaluacionesComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Cursos - Evaluaciones", url: "/cursosevaluaciones" },
              // { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              // { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Evaluaciones", active: true },
            ],
            pageTitle: "Evaluaciones",
            rule: "evaluaciones",
          },
        },
        // {
        //   path: "/evaluaciones",
        //   name: "evaluaciones",
        //   component: () =>
        //     import("./views/evaluaciones/EvaluacionesComponent.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/home" },
        //       { title: "Mis libros", url: "/docente/libros2" },
        //       { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
        //       { title: "Contenido curso", url: "/docente/desglose_curso" },
        //       { title: "Evaluaciones", active: true }
        //     ],
        //     pageTitle: "Evaluaciones",
        //     rule: "evaluaciones"
        //   }
        // },
        {
          path: "/cursosevaluaciones",
          name: "cursosevaluaciones",
          component: () => import("./views/docentes/libros_evaluaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Cursos - evaluaciones", active: true },
            ],
            pageTitle: "Evaluaciones",
            rule: "evaluaciones",
          },
        },
        {
          path: "/docente/seminarios",
          name: "/docente/seminarios",
          component: () => import("./views/docentes/seminarios.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Docente - seminarios", active: true },
            ],
            pageTitle: "Seminarios",
            rule: "seminarios",
          },
        },
        {
          path: "/preguntas/:id",
          name: "preguntas-Componente",
          component: () =>
            import("./views/evaluaciones/PreguntasComponent.vue"),
        },
        {
          path: "/temas",
          name: "temas",
          component: () => import("./views/evaluaciones/TemasComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Banco preguntas", url: "/bancopreguntas" },
              { title: "Lista temas", active: true },
            ],
            pageTitle: "Temas",
            rule: "preguntas",
          },
        },
        {
          path: "/reportes",
          name: "reportes",
          component: () => import("./views/evaluaciones/ReportesComponent.vue"),
        },
        // {
        //     path: '/codigoslibros',
        //     name: 'codigoslibros',
        //     component: () =>
        //         import ('./views/codigos/CodigosLibrosComponent.vue'),
        //     meta: {
        //         breadcrumb: [
        //             { title: 'Home', url: '/home' },
        //             { title: 'Lista códigos', active: true },
        //         ],
        //         pageTitle: 'Códigos libros',
        //         rule: 'codigos'
        //     }
        // },
        {
          path: "/bancopreguntas",
          name: "bancopreguntas",
          component: () => import("./views/diagnostico/admin/MenuAdmin.vue"),
          // import("./views/evaluaciones/PreguntasComponent.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Banco preguntas", active: true },
            ],
            pageTitle: "Preguntas",
            rule: "preguntas",
          },
        },
        {
          path: "/revisarevaluacion",
          name: "revisarevaluacion",
          component: () => import("./views/evaluaciones/revisarEvaluacion.vue"),
        },
        {
          path: "/listaActividades",
          name: "listaActividades",
          component: () => import("./views/actividades/listaActividades.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Actividades", active: true },
            ],
            pageTitle: "Actividades",
            rule: "actividades",
          },
        },
        {
          path: "/listaCursos",
          name: "listaCursos",
          component: () => import("./views/cursos/listaCursos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista cursos", active: true },
            ],
            pageTitle: "Cursos",
            rule: "cursos",
          },
        },
        {
          path: "/certificados",
          name: "certificados",
          component: () => import("./views/certificados/certificados.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista seminarios", active: true },
            ],
            pageTitle: "Seminarios",
            rule: "unidades",
          },
        },
        {
          path: "/detalle_seminarios/:id",
          name: "detalle_seminarios",
          component: () =>
            import("./views/certificados/detalle_seminarios.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Detalle seminario", active: true },
            ],
            pageTitle: "Seminarios",
            rule: "unidades",
          },
        },
        {
          path: "/encuesta",
          name: "encuesta",
          component: () => import("./views/certificados/encuesta.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista seminarios", url: "/certificados" },
              { title: "Encuesta", active: true },
            ],
            pageTitle: "Certificados",
            rule: "unidades",
          },
        },
        // =============================================================================
        // Online Users
        // =============================================================================
        {
          path: "/online",
          name: "online",
          component: () => import("./views/online/screen.vue"),
        },
        // =============================================================================
        // Evaluaciones Pdf
        // =============================================================================
        {
          path: "/evaluacionespdf",
          name: "evaluacionespdf",
          component: () => import("./views/evaluacionespdf/evaluacion.vue"),
        },
        // =============================================================================
        // Chat
        // =============================================================================

        // =============================================================================
        // Estadisticas Reporte Direcctor
        // =============================================================================
        {
          path: "/reporte",
          name: "reporte",
          component: () => import("./views/reportes/screen.vue"),
          meta: {
            breadcrumb: [
              { title: "", url: "" },
              { title: "Bienvenidos", url: "/home" },
              { title: "Bienvenidos", url: "/home" },
            ],
            pageTitle: "Reportes",
            rule: "reportes",
          },
        },
        {
          path: "/estadisticas",
          name: "estadisticas",
          component: () => import("./views/Estadisticas/estadisticas.vue"),
          meta: {
            breadcrumb: [
              { title: "Instituciones", url: "/director" },
              { title: "Instituciones", url: "/director" },
              { title: "Institución", url: "/estadisticas/" },
            ],
            pageTitle: "Institución",
            rule: "estadisticas",
          },
        },
        {
          path: "/director",
          name: "director",
          component: () => import("./views/Estadisticas/instituciones.vue"),
        },
        {
          path: "/informacion",
          name: "informacion",
          component: () => import("./views/Estadisticas/informacion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/director" },
              { title: "Institución", url: "/estadisticas/" },
              { title: "Docente", active: true },
            ],
            pageTitle: "Docente",
            rule: "informacion",
          },
        },
        {
          path: "/infocursos",
          name: "infocursos",
          component: () => import("./views/Estadisticas/cursos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Instituciones", url: "/director" },
              { title: "Institución", url: "/estadisticas/" },
              { title: "Docente", url: "/informacion/" },
              { title: "Docente", url: "/informacion" },
            ],
            pageTitle: "Cursos",
            rule: "estadisticas",
          },
        },
        // =============================================================================
        // Proyectos
        // =============================================================================
        {
          path: "/proyectos",
          name: "proyectos",
          component: () => import("./views/proyectos/screen.vue"),
          meta: {
            breadcrumb: [{ title: "Home", url: "/home" }],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/proyectosAdmin",
          name: "proyectosAdmin",
          component: () => import("./views/proyectos/listaProyectosAdmin.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista proyectos integradores", active: true },
            ],
            pageTitle: "Proyectos integradores",
            rule: "proyectos",
          },
        },
        {
          path: "/proyectosAdmin2",
          name: "proyectosAdmin",
          component: () => import("./views/proyectos2/listaProyectosAdmin.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista proyectos integradores", active: true },
            ],
            pageTitle: "Proyectos integradores",
            rule: "proyectos",
          },
        },
        {
          path: "/agregarProyectoAdmin2",
          name: "webq",
          component: () => import("./views/proyectos2/crearWebQ.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista proyectos integradores",
                url: "/proyectosAdmin2",
              },
              { title: "Agregar proyecto", active: true },
            ],
            pageTitle: "Proyectos integradores",
            rule: "proyectos",
          },
        },

        {
          path: "/verProyectosAdmin2",
          name: "verProyectosAdmin2",
          component: () => import("./views/proyectos2/verWebQ.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              {
                title: "Lista proyectos integradores",
                url: "/proyectosAdmin2",
              },
              { title: "Ver proyecto", active: true },
            ],
            pageTitle: "Proyectos integradores",
            rule: "proyectos",
          },
        },
        {
          path: "/docente/proyectos2",
          name: "proyectos",
          component: () => import("./views/proyectos2/listaProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Proyectos integradores", active: true },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/docente/crearProyecto2",
          name: "docenteCrearProyecto",
          component: () => import("./views/proyectos2/docenteCreaProyecto.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Proyectos integradores", url: "/docente/proyectos2" },
              { title: "Agregar proyecto", active: true },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/ver_quest2",
          name: "ver_quest2",
          component: () => import("./views/proyectos2/verWebQ.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Proyectos integradores", url: "/docente/proyectos2" },
              { title: "Ver proyecto", active: true },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/estudiante/ver_proyecto2",
          name: "ver_quest_estudiante",
          component: () =>
            import("./views/estudiantes/ver_responder_proyecto2.vue"),
        },
        {
          path: "/estudiante/proyectos2",
          name: "proyectos",
          component: () => import("@/views/estudiantes/proyectos2.vue"),
        },
        {
          path: "/docente/proyectos/respuestas2",
          name: "proyectosRespuestas",
          component: () => import("./views/proyectos2/listaRespProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Proyectos integradores", url: "/docente/proyectos2" },
              { title: "Respuestas", active: true },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/proyectos/verproyecto2",
          name: "directorInstitucionesDocentesLibroCursoProyectosVer",
          component: () => import("./views/proyectos2/verWebQ.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              {
                title: "Proyectos",
                url: "/director/institucion/docentes/contenidos/libro/curso/proyectos2",
              },
              { title: "Ver proyecto", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        {
          path: "/director/institucion/docentes/contenidos/libro/curso/proyectos2",
          name: "directorInstitucionesDocentesLibroCursoProyectos",
          component: () => import("./views/proyectos2/listaProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/director/instituciones" },
              {
                title: "Lista docentes",
                url: "/director/institucion/docentes",
              },
              {
                title: "Detalles docente",
                url: "/director/institucion/docentes/contenidos",
              },
              {
                title: "Libro",
                url: "/director/institucion/docentes/contenidos/libro",
              },
              {
                title: "Curso",
                url: "/director/institucion/docentes/contenidos/libro/curso",
              },
              { title: "Proyectos", active: true },
            ],
            pageTitle: "Director",
            rule: "director",
          },
        },
        //FIN PROYECTOS MIGRAR
        {
          path: "/docente/a_proyectos",
          name: "proyectos-a_proyectos",
          component: () => import("./views/proyectos/listaProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              {
                title: "Contenido asignatura",
                url: "/docente/cursos_asig_docente",
              },
              {
                title: "Contenido curso",
                url: "/docente/libro/desglose_asig_docente",
              },
              { title: "Proyectos integradores", active: true },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/docente/proyectos",
          name: "proyectos",
          component: () => import("./views/proyectos/listaProyectos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Mis libros", url: "/docente/libros2" },
              { title: "Contenido libro", url: "/docente/libro/desgloselibro" },
              { title: "Contenido curso", url: "/docente/desglose_curso" },
              { title: "Proyectos integradores", active: true },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/estudiante/ver_proyecto",
          name: "ver_quest_estudiante",
          component: () =>
            import("./views/estudiantes/ver_responder_proyecto.vue"),
        },
        {
          path: "/unidadesTemas",
          name: "unidadesTemas",
          component: () => import("./views/unidades/listaUnidades.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Unidades libros", active: true },
            ],
            pageTitle: "Unidades",
            rule: "unidades",
          },
        },
        {
          path: "/docente/asignarProyecto",
          name: "asignarProyecto",
          component: () => import("./views/proyectos/asignarProyectos.vue"),
        },
        {
          path: "/proyecto/nuevo",
          name: "proyectosNuevo",
          component: () => import("./views/proyectos/nuevo.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Inicio", url: "/proyectos" },
              { title: "Proyectos", url: "/proyectos" },
              { title: "Proyectos", url: "/proyectos" },
            ],
            pageTitle: "Proyectos",
            rule: "proyectos",
          },
        },
        {
          path: "/administrador/menu",
          name: "administradorMenu",
          component: () => import("./views/menu/listaMenu.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista menú", active: true },
            ],
            pageTitle: "Menú",
            rule: "menu",
          },
        },
        {
          path: "/usuarios/asignaturasInstitucion",
          name: "DocentesAsignaturasInstitucion",
          component: () => import("./views/usuarios/asignaturas.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista instituciones", url: "/institucion" },
              { title: "Lista docentes", url: "/institucion/docentes" },
              { title: "Usuarios asignaturas", active: true },
            ],
            pageTitle: "Instituciones",
            rule: "instituciones",
          },
        },
        {
          path: "/usuarios/asignaturasDocentes",
          name: "DocentesAsignaturasPerfiles",
          component: () => import("./views/usuarios/asignaturas.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista usuarios", url: "/usuarios" },
              { title: "Usuarios asignaturas", active: true },
            ],
            pageTitle: "Usuarios",
            rule: "usuarios",
          },
        },
        // =============================================================================
        // RUTAS SALLE
        // =============================================================================
        {
          path: "/admin/usuarios",
          name: "adminUsuarios",
          component: () =>
            import("./views/salle/administrador/usuarios/listaUsuarios.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista usuarios", active: true },
            ],
            pageTitle: "Usuarios",
            rule: "usuarios",
          },
        },
        {
          path: "/admin/usuarios/agregar",
          name: "adminUsuariosAgregar",
          component: () =>
            import("./views/salle/administrador/usuarios/agregarUsuario.vue"),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista usuarios", url: "/admin/usuarios" },
              { title: "Agregar usuarios", active: true },
            ],
            pageTitle: "Usuarios",
            rule: "usuarios",
          },
        },
        {
          path: "/admin/areas",
          name: "adminAreas",
          component: () =>
            import(
              "./views/salle/administrador/evaluaciones/AreasComponent.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista areas - asignaturas", active: true },
            ],
            pageTitle: "Areas - asignaturas",
            rule: "areas",
          },
        },
        {
          path: "/admin/usuarioasignaturas",
          name: "adminUsuarioAsignaturas",
          component: () =>
            import(
              "./views/salle/administrador/usuarios/usuarioAsignatura.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              { title: "Lista usuarios", url: "/admin/usuarios" },
              { title: "Asignaturas", active: true },
            ],
            pageTitle: "Usuarios",
            rule: "areas",
          },
        },
        {
          path: "/docente/evaluacionesSalle",
          name: "docenteEvaluacionesSalle",
          component: () =>
            import("./views/salle/docente/evaluaciones/listaEvaluaciones.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Lista evaluaciones", active: true },
            ],
            pageTitle: "Evaluaciones",
            rule: "evaluaciones",
          },
        },
        {
          path: "/salle/evaluacion/revisar",
          name: "salle-revisar",
          component: () =>
            import(
              "./views/salle/docente/evaluaciones/RevisarEvaluacionSalle.vue"
            ),
        },
        {
          path: "/docente/usuarioasignaturas",
          name: "docenteUsuarioAsignaturas",
          component: () =>
            import(
              "./views/salle/administrador/usuarios/usuarioAsignatura.vue"
            ),
          meta: {
            breadcrumb: [
              { title: "Inicio", url: "/" },
              {
                title: "Lista evaluaciones",
                url: "/docente/evaluacionesSalle",
              },
              { title: "Asignaturas", active: true },
            ],
            pageTitle: "Evaluaciones",
            rule: "evaluaciones",
          },
        },

        // =============================================================================
        // RUTAS SALLE ALEJO
        // =============================================================================
        {
          path: "/salle/instituciones",
          name: "instituciones",
          component: () =>
            import("./views/salle/administrador/InstitucionesComponent.vue"),
        },
        {
          path: "/salle/preguntas",
          name: "salle-preguntas",
          component: () =>
            import(
              "./views/salle/administrador/evaluaciones/PreguntasMenu.vue"
            ),
        },
        {
          path: "/salle/reporte_evaluaciones",
          name: "reporte_evaluaciones",
          component: () =>
            import(
              "./views/salle/administrador/evaluaciones/Reporte_evaluaciones.vue"
            ),
        },
        {
          path: "/salle/reporte_evaluaciones2",
          name: "reporte_evaluaciones2",
          component: () =>
            import(
              "./views/salle/administrador/evaluaciones/Reporte_evaluaciones2.vue"
            ),
        },
        {
          path: "/salle/_periodos",
          name: "salle-periodos",
          component: () =>
            import("./views/salle/administrador/periodos/periodosSalle.vue"),
        },

        // =============================================================================
        // RUTAS SALLE ALEJO
        // =============================================================================
        {
          path: "/departamentos/archivos",
          name: "archivos",
          component: () => import("./views/departamentos/archivos.vue"),
        },

        // =============================================================================
        // PEDIDOS
        // =============================================================================
        {
          path: "/facturadores/codigos",
          name: "facturadores-codigos",
          component: () => import("./views/codigos/FacturadoresCodigos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Gestión códigos", active: true },
            ],
          },
        },
        // {
        //   path: "/pedidos/:pedido",
        //   name: "pedidos",
        //   component: () => import("./views/pedidos/facturador/pedido/PrincipalPedidos.vue"),
        //   // component: () => import("./views/pedidos/pedidos.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
        //       { title: "Detalle del pedido", active: true },
        //     ],
        //   },
        // },
        //alcance
        // {
        //   path: "/alcance",
        //   name: "alcance",
        //   component: () => import("./views/pedidos/alcance/listadoAlcance.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
        //       { title: "Detalle de libros alcance", active: true },
        //     ],
        //   },
        // },
        // {
        //   path: "/import/guias/move",
        //   name: "import-guias",
        //   component: () => import("./views/pedidos/importGuias.vue"),
        // },
        //alcance/ADMINISTRADOR
        // {
        //   path: "/alcance/A_administrador",
        //   name: "alcance-administrador",
        //   component: () => import("./views/pedidos/alcance/listadoAlcance.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       { title: "Listado de períodos", url: "/formatos_pedidos" },
        //       { title: "Detalle de libros alcance", active: true },
        //     ],
        //   },
        // },
        {
          path: "/pedidos/guias/:pedido",
          name: "pedidos-guias",
          component: () =>
            import("./views/pedidos/components/Guias/pedidos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
              { title: "Detalle del pedido de guias", active: true },
            ],
          },
        },
        // {
        //   path: "/b_bodega/paquetes",
        //   name: "b_bodega-paquetes",
        //   component: () =>
        //     import("./views/codigos/paquetes/MenuPaquetes.vue"),
        // },
        {
          path: "/pedidos/guias/bodega/:pedido",
          name: "pedidos-bodega-pedido",
          component: () =>
            import("./views/pedidos/components/Guias/pedidos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              // { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
              { title: "Detalle del pedido de guias", active: true },
            ],
          },
        },
        // {
        //   path: "/bodega/codigos/regalados",
        //   name: "bodega-codigos-regalados",
        //   component: () =>
        //     import("./views/codigos/components/CodigosRegalados/ImportSoloCodigos.vue"),
        // },
        {
          path: "/pedidos/administrador/guias/:pedido",
          name: "pedidos-administrador-guias",
          component: () =>
            import("./views/pedidos/components/Guias/pedidos.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Listado de períodos", url: "/formatos_pedidos" },
              { title: "Detalle del pedido de guias", active: true },
            ],
          },
        },
        // {
        //   path: "/pedidos/administrador/:pedido",
        //   name: "pedidos-administrador",
        //   component: () => import("./views/pedidos/facturador/pedido/PrincipalPedidos.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       { title: "Listado de períodos", url: "/formatos_pedidos" },
        //       { title: "Detalle del pedido", active: true },
        //     ],
        //   },
        // },
        // {
        //   path: "/formatos_pedidos",
        //   name: "formatos_pedidos",
        //   component: () => import("./views/pedidos/formatos_pedidos.vue"),
        // },
        // {
        //   path: "/formatos_pedidos",
        //   name: "formatos_pedidos",
        //   component: () => import("./views/pedidos/formatos_pedidos.vue"),
        // },
        // {
        //   path: "/formatos_pedidos_asesor",
        //   name: "formatos_pedidos_asesor",
        //   component: () =>
        //     import("./views/pedidos/formatos_pedidos_asesor.vue"),
        // },
        // {
        //   path: "/listado_pedidos_asesor/:id/:label",
        //   name: "listado_pedidos_asesor",
        //   component: () => import("./views/pedidos/listado_pedidos_asesor.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
        //       { title: "Listado de pedidos", active: true },
        //     ],
        //   },
        // },
        // {
        //   path: "/listado_obsequios_asesor/:id/:label",
        //   name: "listado_obsequios_asesor",
        //   component: () =>
        //     import("./views/pedidos/obsequios/ScreenObsequios.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
        //       { title: "Listado de obsequios", active: true },
        //     ],
        //   },
        // },
        // {
        //   path: "/listadoObsequios",
        //   name: "listadoObsequios",
        //   component: () => import("./views/pedidos/formatos_pedidos.vue"),
        //   meta: {
        //     breadcrumb: [
        //       { title: "Home", url: "/" },
        //       // { title: "Listado de períodos", url: "/formatos_pedidos_asesor" },
        //       { title: "Listado de obsequios", active: true },
        //     ],
        //   },
        // },
        {
          path: "/pedido/notificaciones/",
          name: "pedido-notificaciones",
          component: () =>
            import("./views/pedidos/notificaciones/screenNotificacion.vue"),
        },
        {
          path: "/pedido/reporte/venta",
          name: "pedido-reporte-venta",
          component: () =>
            import("./views/pedidos/gerencia/reportes/ScreenReporte.vue"),
        },
        {
          path: "/gerencia/comision/",
          name: "gerencia-comision",
          component: () =>
            import("./views/home/gerencia/pedidos/comision/GerenciaScreenComision.vue"),
        },
        {
          path: "/gerencia/seguimiento/",
          name: "gerencia-seguimiento",
          component: () =>
            import("./views/pedidos2/pedidos/cobranzas/seguimientoCuentasGeneral.vue"),
        },
        {
          path: "/pedido/reporte/vendedores",
          name: "pedido-reporte-vendedores",
          component: () =>
            import(
              "./views/pedidos/gerencia/reportes/ReporteVentaVendedor2.vue"
            ),
        },
        {
          path: "/pedido/reporte/trasabilidad",
          name: "pedido-reporte-trasabilidad",
          component: () =>
            import("./views/pedidos/gerencia/reportes/ReporteTrasabilidad.vue"),
        },
        {
          path: "/obsequio/gerencia",
          name: "obsequio-gerencia",
          component: () =>
            import(
              "./views/pedidos/obsequios/gerencia/ScreenObsequiosGerencia.vue"
            ),
        },
        {
          path: "/librosObsequio/gerencia",
          name: "librosObsequio-gerencia",
          component: () =>
            import(
              "./views/pedidos2/pedidos/libros/librosObsequios/librosObsequiosGerencia/ScreenLibrosObsequiosGerencia.vue"
            ),
        },

        //RUTA REVISIONES VERIFICAIONES
        {
          path: "/revisiones/verificaciones",
          name: "revisiones-verificaciones",
          component: () =>
            import("./views/pedidos2/verificaciones/revision/revisionesPendientes.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Revisiones de Verificaciones", active: true },
            ],
          },
        },

        // =============================================================================
        // CUMPLIMIENTO
        // =============================================================================
        {
          path: "/control_cumplimiento",
          name: "control_cumplimiento",
          component: () =>
            import("./views/redactores/redactor/control_cumplimientos.vue"),
        },
        // =============================================================================
        // INICIO CONEXION HIK CONNECT
        // =============================================================================
        {
          path: "/reportes_talento_humano",
          name: "reportes_talento_humano",
          component: () =>
            import("./views/talento_humano/screen_reportesth.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Talento Humano", active: true },
            ],
          },
        },
        // =============================================================================
        // INICIO FACTURACION 10_10_1_4
        // =============================================================================
        {
          path: "/asis_gerencia/general",
          name: "asis_gerencia-general",
          component: () =>
            import("./views/facturacion/10_10_1_4/screen_facturaciongeneral.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Facturación", active: true },
            ],
          },
        },
        {
          path: "/asis_gerencia/orden_trabajo",
          name: "asis_gerencia-orden_trabajo",
          component: () =>
            import("./views/facturacion/10_10_1_4/orden_pedido/screen_orden.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Facturación", active: true },
            ],
          },
        },
        {
          path: "/asis_gerencia/reportes",
          name: "asis_gerencia-reportes",
          component: () =>
            import("./views/facturacion/10_10_1_4/bodegas/codigosLR.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Facturación", active: true },
            ],
          },
        },
        // =============================================================================
        // FIN FACTURACION 10_10_1_4
        // =============================================================================
        //===============FORMULARIO DOCENTE=============================================
        {
          path: "/formulario/solicitudes",
          name: "formulario-solicitudes",
          component: () =>
            import("./views/home/docentes/formulario/listadoSolicitudes.vue"),
          meta: {
            breadcrumb: [{ title: "Home", url: "/" }],
          },
        },
        //===============FIN FORMULARIO DOCENTE========================================
        // =============================================================================
        // RUTAS DE DIAGNOSTICO
        // =============================================================================
        {
          path: "/diagnostico/preguntas",
          name: "diagnostico-preguntas",
          component: () =>
            import("./views/diagnostico/admin/ListadoPreguntas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Gestión preguntas", active: true },
            ],
          },
        },
        {
          path: "/diagnostico/resultado",
          name: "diagnostico-resultado",
          component: () =>
            import("./views/diagnostico/admin/ResultadoPreguntas.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Gestión preguntas", active: true },
            ],
          },
        },
        // =============================================================================
        // FIN RUTAS DE DIAGNOSTICO
        // =============================================================================
        // RUTAS SECUENCIA PEDIDOS //
        {
          path: "/pedido/administrador/todoPedidos",
          name: "pedido-secuencia",
          component: () => import("./views/pedidos/pedidosAdmin.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Pedidos Configuración", active: true },
            ],
          },
        },
        // RUTAS SECUENCIA PEDIDOS //
        //rutas gerencia
        {
          path: "/pedido/gerencia/screen",
          name: "pedidos-gerencia-lista",
          component: () => import("./views/home/gerencia/screen_gerencia.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Dashboard", active: true },
            ],
          },
        },
        // {
        //   path: "/pedido/asesor/contratos",
        //   name: "pedido-asesor-contratos",
        //   component: () =>
        //     import("./views/pedidos/asesor/contratos/listadoContratos.vue"),
        // },
        //rutaapiprueba
        //pruebasapifacturacion
        {
          path: "/pruebaapis",
          name: "pruebaapis",
          component: () =>
            import("./views/pedidos/facturacion_api/pruebaapi.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Pruebas", active: true },
            ],
          },
        },
        //fin ruta api prueba
        //rutas gerencia
        //ruta bodega admin
        {
          path: "/home/bodega",
          name: "home-admin-bodega-pedidos",
          component: () =>
            import("./views/home/bodega/screen_admin_bodega.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Contratos", active: true },
            ],
          },
        },
        {
          path: "/panel-administrativo",
          name: "panel-administrativo-bodega",
          component: () =>
            import("./views/home/bodega/panel_administrativo.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Panel Administrativo", active: true },
            ],
          },
        },
        //ruta bodega admin pedidos
        {
          path: "/listadoPedidos/pedidos/bodega",
          name: "bodega-bodega",
          component: () =>
            import("./views/pedidos/bodega/pedidos/ScreenBodegaPedido.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Pedidos", active: true },
            ],
          },
        },
        //fin ruta bodega admin
        //ciudades
        {
          path: "/admin/ciudades",
          name: "admin-ciudades",
          component: () => import("./views/ciudades/listaCiudad.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Ciudades", active: true },
            ],
          },
        },
        {
          path: "/admin/editarCiudad",
          name: "pedidos-editarCiudad",
          component: () => import("./views/ciudades/editCiudad.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/" },
              { title: "Listado de ciudades", url: "/admin/ciudades" },
              { title: "Editar ciudad", active: true },
            ],
          },
        },
        {
          path: "/admin/configvarios",
          name: "admin-config-varios",
          component: () => import("./views/varios/newVarios.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Crear varios", active: true },
            ],
          },
        },
        // configuracion periodos institucion por region para envio de libros desde bodega
        {
          path: "/admin/configperiodoinstitucion",
          name: "admin-config-periodo-institucion",
          component: () =>
            import("./views/periodos/periodo_config_institucion.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Configuracion", active: true },
            ],
          },
        },
        // lista de video tutoriales para asesores
        {
          path: "/admin/videotutoriales",
          name: "admin-videotutoriales",
          component: () =>
            import("./views/videoTutoriales/screenTutoriales.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Tutoriales", active: true },
            ],
          },
        },
        // FICHAS
        {
          path: "/admin/fichas",
          name: "admin-fichas",
          component: () => import("./views/fichas/screen.vue"),
          meta: {
            breadcrumb: [
              { title: "Home", url: "/home" },
              { title: "Fichas", active: true },
            ],
          },
        },
        //=====RUTAS PARA NEE_TEMAS====
        {
          path: "/nee_documentos",
          name: "admin-nee_documentos",
          component: () =>
            import("./views/nee_documentos/ScreenDocumentos.vue"),
        },
        {
          path: "/Home/nee_documentos/",
          name: "Home-nee_documentos",
          component: () => import("./views/home/neet/HomeNeet.vue"),
        },
        //=====FIN RUTAS PARA NEE_TEMAS====
        {
          path: "/home/grafitex",
          name: "grafitex",
          component: () => import("@/views/codigos/grafitex/MenuGrafitex.vue"),
        },
        //===RUTAS PROIM=======
        {
          path: "/home/proim",
          name: "proim",
          component: () => import("@/views/codigos/proim/ProimScreen.vue"),
        },
        //===FIN RUTAS PROIM===
        // EVALUACIONES DOCENTES DESDE ADMINISTRACION
        {
          path: "/evaluaciones/desdeadmin",
          name: "EvaluacionesDesdeAdmin",
          component: () => import("@/views/evaluaciones/screenEvaluacionesCursosAdmin.vue"),
        },
        {
          path: "/bodega/codigosDespachados",
          name: "codigosDespachados",
          component: () => import("@/views/bodega/buscarDocumento/index.vue"),
        },
      ],
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    // RESPONDER EVALUACION SALLE
    {
      path: "/salle/docente/evaluacion",
      name: "preguntas-evaluacion",
      component: () =>
        import("./views/salle/docente/evaluaciones/EvaluacionComponent.vue"),
    },
    {
      path: "",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/clase/virtual",
          name: "clasevirtual",
          component: () => import("@/views/clases/digital.vue"),
        },
      ],
    },
    {
      path: "/webinar/presentacion",
      name: "webinar-presentacion",
      component: () => import("@/views/admin/webinar/WebinarParticipacion.vue"),
      meta: {
        breadcrumb: [
          // { title: 'Home', url: '/' },
          { title: "Registro webinar", active: true },
        ],
      },
    },

    {
      path: "/webinar/certificado",
      name: "webinar-certificado",
      component: () =>
        import("@/views/admin/webinar/components/WebinarCertificado.vue"),
      meta: {
        breadcrumb: [
          // { title: 'Home', url: '/' },
          { title: "Webinar Certificado", active: true },
        ],
      },
    },

    {
      path: "/webinar/encuesta",
      name: "webinar-encuesta",
      component: () =>
        import("@/views/admin/webinar/components/WebinarEncuesta.vue"),
      meta: {
        breadcrumb: [
          // { title: 'Home', url: '/' },
          { title: "Webinar Encuesta", active: true },
        ],
      },
    },
    {
      path: "/asesor/planificaciones",
      name: "asesor-planificaciones",
      component: () => import("@/views/asesor/planificaciones_agenda/IndexPlanificaciones.vue"),
      meta: {
        breadcrumb: [
          // { title: 'Home', url: '/' },
          { title: "Registro Planificaciones", active: true },
        ],
      },
    },
    {
      path: "/talento-humano/reportes",
      name: "talento-humano-reportes",
      component: () => import("@/views/talento_humano/IndexTalentoHumano.vue"),
      meta: {
        breadcrumb: [
          // { title: 'Home', url: '/' },
          { title: "Talento Humano", active: true },
        ],
      },
    },
    {
      path: "/bodega/login",
      name: "bodega-login",
      component: () => import("@/views/bodega/escaneador/LoginBodega.vue"),
      meta: {
        breadcrumb: [
          { title: "Login Bodega", active: true },
        ],
      },
    },
    {
      path: "/bodega/escanear",
      name: "bodega-escanear",
      component: () => import("@/views/bodega/escaneador/index.vue"),
      meta: {
        breadcrumb: [
          { title: "Escanear", active: true },
        ],
      },
    },
    // En tu archivo de rutas (router/index.js)
    {
      path: "/bodega/escanear/:codigo",
      name: "bodega-escanear-documento",
      component: () => import("@/views/bodega/escaneador/escanear.vue"),
      meta: {
        requiresBodegaAuth: true,
        breadcrumb: [
          { title: "Escanear", path: "/bodega/escanear" },
          { title: "Documento", active: true },
        ],
      },
    },

    // =============================================================================
    // INICIO CAPACITACIONES USUARIOS PROLIPA - RUTAS PÚBLICAS
    // =============================================================================
    {
      path: "/capacitaciones_prolipa/login",
      name: "capacitaciones_prolipa_login",
      component: () => import("./views/capacitaciones_prolipa/auth/LoginScreenCapacitacionesProlipa.vue"),
      meta: {
        breadcrumb: [{ title: "Login Capacitaciones Prolipa", active: true }],
      },
    },
    {
      path: "/capacitaciones_prolipa/usuario",
      name: "capacitaciones_prolipa_usuario",
      component: () => import("./views/capacitaciones_prolipa/users_panel/UserScreen.vue"),
      meta: { requiresAuth: true, role: 'user' }
    },
    // =============================================================================
    // ENCUESTA PÚBLICA (docente responde por link/QR)
    // =============================================================================
    {
      path: "/encuesta/prolipa/certificado",
      name: "encuesta-prolipa-certificado",
      component: () => import("@/views/asesor/encuestas/EncuestaCertificadoProlipa.vue"),
    },
    {
      // Acceso por código de asignación (capacitaciones) — tiene prioridad
      path: "/encuesta/prolipa/a/:codigoAcceso",
      name: "encuesta-prolipa-asignacion",
      component: () => import("@/views/asesor/encuestas/EncuestaResponderProlipa.vue"),
    },
    {
      // Acceso legacy por código de encuesta
      path: "/encuesta/prolipa/:codigo",
      name: "encuesta-prolipa-publica",
      component: () => import("@/views/asesor/encuestas/EncuestaResponderProlipa.vue"),
    },
    //
    // =============================================================================
    // JUEGOADMINISTRABLE
    // =============================================================================
    {
      path: "/docente/juegoSeleccionSimple",
      name: "juegoSeleccionSimple",
      component: () => import("./views/juegos/seleccionSimple.vue"),
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/pages/error-404",
    },
    //para el ingreso de docentes de diferentes colegios

    {
      path: "/docente/ingreso",
      name: "docente-ingreso",
      component: () => import("@/views/colegios/docente-ingreso.vue"),
    },

    //para ver el material de apoyo
    {
      path: "/material/apoyo/ver",
      name: "materialapoyo-ver",
      component: () =>
        import("./views/materialapoyo/components/verMaterial.vue"),
    },
    {
      path: "/jugarMillonario/:id/:codigo",
      name: "jugarMillonario",
      component: () => import("./views/juegos/juegoMillonario.vue"),
    },
    {
      path: "/ponchado/:id/:codigo",
      name: "ponchado",
      component: () => import("./views/juegos/ponchado.vue"),
    },
    {
      path: "/jugarSeleccionSimple/:id/:codigo",
      name: "jugarSeleccionSimple",
      component: () => import("./views/juegos/seleccionSimple.vue"),
    },
    {
      path: "/jugarSeleccionSimple_estudiante/:id",
      name: "jugarSeleccionSimple_estudiante",
      component: () => import("./views/juegos/seleccionSimple.vue"),
    },
    {
      path: "/sopa_letras/:id/:codigo",
      name: "sopa_letras",
      component: () => import("./views/juegos/sopa_letras2.vue"),
    },
    {
      path: "/sopa_letras2/:id/:codigo",
      name: "sopa_letras_2",
      component: () => import("./views/juegos/sopa_letras2.vue"),
    },
    {
      path: "/rompecabezas2/:id/:codigo",
      name: "rompecabezas",
      component: () => import("./views/juegos/rompecabezas2.vue"),
    },
    // ======================================================================== //
    // =============== BIBLIOTECA ============================================= //
    // ======================================================================== //
    {
      path: "/biblioteca",
      name: "biblioteca",
      component: () => import("@/views/biblioteca/biblioteca.vue"),
    },
    {
      path: "/biblioteca/form",
      name: "biblioteca-form",
      component: () => import("@/views/biblioteca/Form/Form.vue"),
    },
    {
      path: "/biblioteca/form/:id",
      component: () => import("@/views/biblioteca/Form/Form.vue"),
    },
    {
      path: "/biblioteca/contenido/:id",
      name: "biblioteca-contenido",
      component: () =>
        import("@/views/biblioteca/content/View/ContentView.vue"),
    },
    // ======================================================================== //
    // =============== FIN BIBLIOTECA ========================================= //
    // ======================================================================== //
  ],
});

// =============================================================================
// GEMA - Guardián de sesión y permisos
// =============================================================================
// El módulo tiene su propia sesión por token, así que se resuelve antes que el
// guardián general de la plataforma. Se ejecuta solo para rutas /gema/*.
router.beforeEach(async (to, from, next) => {
  const esGema = to.path === '/gema' || to.path.indexOf('/gema/') === 0;

  if (!esGema) return next();

  // El login es público, pero si ya hay sesión no tiene sentido mostrarlo.
  if (to.meta && to.meta.gemaPublica) return next();

  if (!gemaSesion.autenticado) {
    return next({ name: 'gema-login', query: { redirect: to.fullPath } });
  }

  // Al recargar la página queda el token pero no el usuario ni los permisos:
  // se vuelven a pedir para que un cambio de perfil surta efecto de inmediato.
  if (!gemaSesion.state.usuario) {
    try {
      const r = await gemaApi.get('auth/me');
      gemaSesion.aplicar(r.data);
    } catch (e) {
      return next({ name: 'gema-login', query: { redirect: to.fullPath } });
    }
  }

  const seccion = to.meta && to.meta.gemaSeccion;

  if (seccion && !gemaSesion.puede(seccion, 'ver')) {
    // Sin permiso para esa sección: se manda a la primera que sí puede ver.
    const primera = gemaSesion.state.secciones[0];

    if (primera && primera.ruta !== to.name) {
      return next({ name: primera.ruta });
    }

    if (to.name !== 'gema-dashboard' && gemaSesion.puede('dashboard')) {
      return next({ name: 'gema-dashboard' });
    }

    return next({ name: 'gema-login' });
  }

  return next();
});

// Navigation guard para verificar sesión en la ruta raíz
router.beforeEach((to, from, next) => {
  // Si el usuario está intentando acceder a la raíz "/"
  if (to.path === '/') {
    try {
      // Verificar si hay un usuario en localStorage
      const usuario = localStorage.getItem('usuario');
      const token = localStorage.getItem('tk');
      const sessionLocked = localStorage.getItem('session_locked');

      // Si hay sesión bloqueada, ir al login
      if (sessionLocked) {
        localStorage.removeItem('tk');
        localStorage.removeItem('usuario');
        localStorage.removeItem('session_locked');
        localStorage.removeItem('last_activity');
        return next(); // Continuar a la ruta / (login)
      }

      // Si hay usuario y token válidos
      if (usuario && token) {
        try {
          const userData = JSON.parse(usuario);

          // Verificar si el usuario tiene datos válidos
          if (userData && userData.idusuario) {
            // Verificar el tiempo de inactividad
            const lastActivity = localStorage.getItem('last_activity');

            if (lastActivity) {
              const lastActivityTime = parseInt(lastActivity, 10);
              const now = Date.now();
              const idleTimeMs = now - lastActivityTime;
              const idleTimeSeconds = Math.floor(idleTimeMs / 1000);

              // Tiempo de inactividad permitido (debe coincidir con Main.vue)
              const IDLE_TIMEOUT_SECONDS = 3600; // 1 hora

              // Si NO ha excedido el tiempo de inactividad, redirigir al home
              if (idleTimeSeconds < IDLE_TIMEOUT_SECONDS) {
                // Actualizar última actividad
                localStorage.setItem('last_activity', Date.now().toString());
                return next('/home');
              } else {
                // Tiempo de inactividad excedido, limpiar sesión
                localStorage.removeItem('tk');
                localStorage.removeItem('usuario');
                localStorage.removeItem('last_activity');
                localStorage.setItem('session_locked', '1');
                return next(); // Ir al login
              }
            } else {
              // No hay registro de actividad pero hay sesión, establecer ahora y redirigir
              localStorage.setItem('last_activity', Date.now().toString());
              return next('/home');
            }
          }
        } catch (e) {
          // Error al parsear el usuario, limpiar y continuar al login
          console.warn('Error parsing usuario:', e);
          localStorage.removeItem('tk');
          localStorage.removeItem('usuario');
          localStorage.removeItem('last_activity');
        }
      }
    } catch (e) {
      console.warn('Error checking session:', e);
    }
  }

  // Para cualquier otra ruta o si no hay sesión válida, continuar normalmente
  next();
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
