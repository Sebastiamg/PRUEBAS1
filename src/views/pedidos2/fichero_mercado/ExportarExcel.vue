<template></template>

<script>
import * as XLSX from "xlsx";

export default {
    data() {
        return {
            ficheros: [],
            array_Lista_Editoriales: [],
            array_Lista_Niveles: [],
            array_Lista_CargosAutoridades: [],
            isrunLoading_export: false
        };
    },

    methods: {
        // === MÉTODO PRINCIPAL ===
        iniciarExportacionExcel() {
            const me = this;
            me.isrunLoading_export = true;
            me.$vs.loading({
                text: "Preparando exportación..."
            });

            me.cargarListasBase()
                .then(function () {
                    return me.cargarFicherosCompletos();
                })
                .then(function () {
                    return me.cargarEntregaMuestrasPorFicheros();
                })
                .then(function () {
                    return me.cargarInstitucionesDespachoPorFicheros();
                })
                .then(function () {
                    return me.exportarExcelFinal();
                })
                .then(function () {
                    me.$vs.notify({
                        title: "Éxito",
                        text: me.ficheros.length + " ficheros exportados",
                        color: "success"
                    });
                })
                .catch(function (error) {
                    console.error("Error en exportación:", error);
                    me.$vs.notify({
                        title: "Error",
                        text: error.message || "No se pudo generar el archivo",
                        color: "danger"
                    });
                })
                .finally(function () {
                    me.isrunLoading_export = false;
                    me.$vs.loading.close();
                });
        },

        // === 1. CARGAR EDITORIALES Y NIVELES ===
        cargarListasBase() {
            return new Promise(function (resolve, reject) {
                if (!this.isrunLoading_export) this.$vs.loading();

                const p1 = this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: {
                        action: 'Editoriales_Todo_Fichero'
                    }
                }).then(function (r) {
                    return r.data || [];
                });

                const p2 = this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: {
                        action: 'Niveles_Fichero'
                    }
                }).then(function (r) {
                    return r.data || [];
                });

                const p3 = this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: {
                        action: 'CargosAutoridadesInstitucion_Todo_Fichero'
                    }
                }).then(function (r) {
                    return r.data || [];
                });

                Promise.all([p1, p2, p3])
                    .then(function (resultados) {
                        this.array_Lista_Editoriales = resultados[0];
                        this.array_Lista_Niveles = resultados[1];
                        this.array_Lista_CargosAutoridades = resultados[2];
                        resolve();
                    }.bind(this))
                    .catch(reject)
                    .finally(function () {
                        if (!this.isrunLoading_export) this.$vs.loading.close();
                    }.bind(this));
            }.bind(this));
        },

        // === 2. CARGAR FICHEROS COMPLETOS ===
        cargarFicherosCompletos() {
            return new Promise(function (resolve, reject) {
                const stored = localStorage.getItem("usuario");
                const usuario = stored ? JSON.parse(stored) : {};

                if (!usuario || !usuario.idusuario) {
                    return reject(new Error("Usuario no encontrado en localStorage"));
                }

                this.$http.get(this.$server_url + "Procesar_MetodosGet_Fichero_MercadoController", {
                        params: {
                            action: "Busqueda_get_Fichero_Mercado_Todo_Export_Completo",
                            asesor_id: usuario.idusuario
                        }
                    })
                    .then(function (res) {
                        const data = res.data;
                        this.ficheros = (data && data.data && Array.isArray(data.data)) ? data.data : [];
                        // console.log("Ficheros cargados:", this.ficheros.length);
                        resolve();
                    }.bind(this))
                    .catch(function (err) {
                        this.ficheros = [];
                        reject(err);
                    }.bind(this));
            }.bind(this));
        },

        // === 3. CARGAR MUESTRAS ===
        cargarEntregaMuestrasPorFicheros() {
            return new Promise((resolve, reject) => {
                if (!this.ficheros || this.ficheros.length === 0) {
                    return resolve();
                }
                // Enviar SOLO una petición con todos los ficheros
                this.$http.post(this.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', {
                        action: 'Fechas_Entrega_muestras_masivo',
                        ficheros: this.ficheros.map(f => ({
                            idInstitucion: f.idInstitucion,
                            idperiodoescolar: f.idperiodoescolar
                        }))
                    })
                    .then(res => {
                        const data = res.data || [];
                        // Reinyectar resultados en cada fichero
                        this.ficheros.forEach(f => {
                            const encontrado = data.find(x =>
                                x.idInstitucion == f.idInstitucion &&
                                x.idperiodoescolar == f.idperiodoescolar
                            );
                            f.entregas_muestras = encontrado ? encontrado.entregas_muestras : [];
                        });
                        // console.log("Muestras cargadas para ficheros.", this.ficheros);
                        resolve();
                    })
                    .catch(reject);
            });
        },

        // === 3B. CARGAR INSTITUCIONES DESPACHO ===
        cargarInstitucionesDespachoPorFicheros() {
            return new Promise((resolve, reject) => {
                if (!this.ficheros || this.ficheros.length === 0) {
                    return resolve();
                }

                // Recolectar todos los IDs de instituciones de despacho de todos los ficheros
                let todosIds = new Set();
                this.ficheros.forEach(f => {
                    if (f.fm_establecimientos_para_despacho) {
                        try {
                            const ids = JSON.parse(f.fm_establecimientos_para_despacho);
                            if (Array.isArray(ids)) {
                                ids.forEach(id => todosIds.add(id));
                            }
                        } catch (e) {}
                    }
                });

                if (todosIds.size === 0) {
                    return resolve();
                }

                this.$http.post(this.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', {
                        action: 'ConsultaInstitucionesxFichero_Para_Despacho',
                        ids_instituciones: Array.from(todosIds)
                    })
                    .then(res => {
                        const data = res.data || [];
                        // Asignar los objetos de institución a cada fichero
                        this.ficheros.forEach(f => {
                            f.establecimientos_despacho_objs = [];
                            if (f.fm_establecimientos_para_despacho) {
                                try {
                                    const ids = JSON.parse(f.fm_establecimientos_para_despacho);
                                    if (Array.isArray(ids)) {
                                        f.establecimientos_despacho_objs = data.filter(d => ids.includes(d.idInstitucion));
                                    }
                                } catch (e) {}
                            }
                        });
                        resolve();
                    })
                    .catch(error => {
                        console.error("Error al cargar establecimientos de despacho:", error);
                        // Resolvemos de todas formas para no trabar el excel
                        resolve();
                    });
            });
        },

        // === 4. EXPORTAR EXCEL ===
        exportarExcelFinal() {
            return new Promise(function (resolve, reject) {
                try {
                    if (!this.ficheros || this.ficheros.length === 0) {
                        throw new Error("No hay ficheros para exportar");
                    }

                    const wb = XLSX.utils.book_new();
                    // ===================================================================
                    // === HOJA RESUMEN – FINAL, LIMPIO Y PROFESIONAL ===================
                    // ===================================================================

                    // === CARGAR LISTAS BASE ===
                    const nivelesLista = this.array_Lista_Niveles || [];
                    const cargosLista = this.array_Lista_CargosAutoridades || [];
                    const editorialesLista = this.array_Lista_Editoriales || [];

                    // === RECOLECTAR FACTORES ===
                    const todosLosFactores = {};
                    this.ficheros.forEach(function (fichero) {
                        try {
                            const f = JSON.parse(fichero.fm_factores_inciden_en_compra || "{}");
                            Object.keys(f).forEach(function (key) {
                                todosLosFactores[key] = true;
                            });
                        } catch (e) {}
                    });
                    const listaFactores = Object.keys(todosLosFactores).sort();

                    // ===================================================================
                    // 1. HOJA "Resumen"
                    // ===================================================================
                    const headerRow = [];

                    // Columnas iniciales + NUEVOS CAMPOS AÑADIDOS DESPUÉS DE PARROQUIA
                    const columnasIniciales = [
                        "ID Fichero", "Estado", "Institución", "Asesor", "Periodo Escolar", "Provincia", "Ciudad", "Parroquia",
                        "Dirección", "Teléfono", "Correo", "Fecha Fundación", "Es Distribuidor", "Tipo Institución", // ← NUEVOS CAMPOS
                        "Trabaja con Prolipa", "Tiene convenio", "Años que trabaja con Prolipa", "Tipo Venta", "Observación"
                    ];
                    columnasIniciales.forEach(function (col) {
                        headerRow.push(col);
                    });

                    listaFactores.forEach(function (factor) {
                        headerRow.push("Factor que incide (" + factor + ")");
                    });

                    const nivelesFijos = ["Iniciales", "Preparatoria", "Elemental", "Medio", "Superior", "Bachillerato"];
                    nivelesFijos.forEach(function (nivel) {
                        headerRow.push("Nivel Disponible (" + nivel + ")");
                    });
                    /*
                    nivelesFijos.forEach(function (nivel) {
                        headerRow.push("Valor de la Pensión (" + nivel + ")");
                    });
                    */

                    nivelesLista.forEach(function (n) {
                        headerRow.push("Aulas por Grado (" + n.nombrenivel + ")");
                    });
                    nivelesLista.forEach(function (n) {
                        headerRow.push("Estudiantes por Aula (" + n.nombrenivel + ")");
                        headerRow.push("Total Estudiantes por Aula (" + n.nombrenivel + ")");
                    });



                    headerRow.push("Total Estudiantes", "Real Estudiantes");

                    // === COLUMNAS DE HISTORIAL ===
                    headerRow.push(
                        "Creado por", "Fecha creación", "Editado por", "Fecha edición",
                        "Enviado para aprobación por", "Fecha envío",
                        "Aprobado por", "Fecha aprobación",
                        "Devuelto por", "Fecha devolución", "Comentario devolución"
                    );

                    const resumenFilas = [headerRow];

                    this.ficheros.forEach(function (fichero) {
                        // === NIVELES Y PENSIONES ===
                        const niveles = {};
                        const pensiones = {};
                        try {
                            Object.assign(niveles, JSON.parse(fichero.fm_niveles_educativos || "{}"));
                        } catch (e) {}
                        try {
                            Object.assign(pensiones, JSON.parse(fichero.fm_pensiones || "{}"));
                        } catch (e) {}

                        // === AULAS Y ESTUDIANTES ===
                        const aulas = [];
                        const estudiantes = [];
                        try {
                            aulas.push.apply(aulas, JSON.parse(fichero.fm_numero_aulas_completo || "[]"));
                        } catch (e) {}
                        try {
                            estudiantes.push.apply(estudiantes, JSON.parse(fichero.fm_cantidad_estudiantes_x_aula_completo || "[]"));
                        } catch (e) {}

                        let decideCompra = [];
                        try {
                            decideCompra = JSON.parse(fichero.fm_decide_compra || "[]");
                        } catch (e) {}

                        // (Sección de Autoridades removida de aquí para pasar a hoja Autoridades)

                        // === FACTORES QUE INCIDEN EN COMPRA (ya corregido antes) ===
                        let factoresObj = {};
                        if (fichero.fm_factores_inciden_en_compra) {
                            if (typeof fichero.fm_factores_inciden_en_compra === 'string') {
                                try {
                                    factoresObj = JSON.parse(fichero.fm_factores_inciden_en_compra);
                                } catch (e) {
                                    console.warn("Error parseando factores:", fichero.fm_factores_inciden_en_compra);
                                    factoresObj = {};
                                }
                            } else if (typeof fichero.fm_factores_inciden_en_compra === 'object' && fichero.fm_factores_inciden_en_compra !== null) {
                                factoresObj = fichero.fm_factores_inciden_en_compra;
                            }
                        }

                        const factoresCeldas = listaFactores.map(function (f) {
                            return factoresObj[f] === true ? "Sí" : "No";
                        });

                        // === DATOS DE HISTORIAL ===
                        const creadoPor = ((fichero.usercreated_nombres || "") + " " + (fichero.usercreated_apellidos || "")).trim() || "No registra";
                        const fechaCreacion = fichero.created_at ? fichero.created_at.split(" ")[0] : "";
                        const editadoPor = ((fichero.user_edit_nombres || "") + " " + (fichero.user_edit_apellidos || "")).trim() || "No registra";
                        const fechaEdicion = fichero.updated_at ? fichero.updated_at.split(" ")[0] : "";

                        let enviadoPor = "No aplica",
                            fechaEnvio = "No aplica";
                        if (["2", "3", "4"].includes(fichero.fm_estado)) {
                            enviadoPor = ((fichero.user_envia_nombres || "") + " " + (fichero.user_envia_apellidos || "")).trim() || "No registra";
                            fechaEnvio = fichero.fecha_envio_aprobacion ? fichero.fecha_envio_aprobacion.split(" ")[0] : "";
                        }

                        let aprobadoPor = "No aplica",
                            fechaAprobacion = "No aplica";
                        if (fichero.fm_estado == "3") {
                            aprobadoPor = ((fichero.user_aprobacion_nombres || "") + " " + (fichero.user_aprobacion_apellidos || "")).trim() || "No registra";
                            fechaAprobacion = fichero.fecha_aprobacion ? fichero.fecha_aprobacion.split(" ")[0] : "";
                        }

                        let devueltoPor = "No aplica",
                            fechaDevolucion = "No aplica",
                            comentarioDevolucion = "No aplica";
                        if (fichero.fm_estado == "4") {
                            devueltoPor = ((fichero.user_rechazo_nombres || "") + " " + (fichero.user_rechazo_apellidos || "")).trim() || "No registra";
                            fechaDevolucion = fichero.fecha_rechazo ? fichero.fecha_rechazo.split(" ")[0] : "";
                            comentarioDevolucion = fichero.comentario_rechazo || "Sin comentario";
                        }

                        // === FILA CON TODOS LOS DATOS + NUEVOS CAMPOS ===
                        const row = [
                            fichero.fm_id,
                            fichero.fm_estado == 1 ? "Activo/Creado" :
                            fichero.fm_estado == 2 ? "Enviado para aprobación" :
                            fichero.fm_estado == 3 ? "Aprobado" :
                            fichero.fm_estado == 4 ? "Devuelto" : "Desconocido",
                            fichero.nombreInstitucion || "",
                            fichero.asesor_institucion || "",
                            fichero.descripcion_periodoescolar || "",
                            fichero.nombreprovincia || "",
                            fichero.nombre_ciudad || "",
                            fichero.parr_nombre || "",
                            // ← AQUÍ VAN LOS NUEVOS CAMPOS
                            fichero.direccionInstitucion || "",
                            fichero.telefonoInstitucion || "",
                            fichero.email || "",
                            fichero.fecha_fundacion || "",
                            fichero.fm_es_distribuidor == '1' ? "Sí" : "No",
                            fichero.tipo_descripcion || "",
                            // ← fin nuevos campos
                            fichero.fm_trabaja_con_prolipa == 1 ? "Sí" : "No",
                            fichero.fm_trabaja_con_prolipa == 1 ? (fichero.fm_convenio == 1 ? "Sí" : "No") : "No aplica",
                            fichero.fm_trabaja_con_prolipa == 1 ? (fichero.fm_cantidad_anios_trabaja_con_prolipa || 0) : "No aplica",
                            fichero.fm_tipo_venta == '1' ? "Directa" : fichero.fm_tipo_venta == '2' ? "Comisión/Lista" : "No seleccionado",
                            fichero.fm_observacion || "",
                            ...factoresCeldas,
                            niveles.iniciales ? "Sí" : "No",
                            niveles.preparatoria ? "Sí" : "No",
                            niveles.elemental ? "Sí" : "No",
                            niveles.medio ? "Sí" : "No",
                            niveles.superior ? "Sí" : "No",
                            niveles.bachillerato ? "Sí" : "No",
                            // pensiones.iniciales ? "$" + pensiones.iniciales : "",
                            // pensiones.preparatoria ? "$" + pensiones.preparatoria : "",
                            // pensiones.elemental ? "$" + pensiones.elemental : "",
                            // pensiones.medio ? "$" + pensiones.medio : "",
                            // pensiones.superior ? "$" + pensiones.superior : "",
                            // pensiones.bachillerato ? "$" + pensiones.bachillerato : "",
                            ...nivelesLista.map(n => {
                                const a = aulas.find(x => x.idnivel == n.idnivel);
                                return a ? a.numeroAulas : 0;
                            }),
                            ...nivelesLista.reduce((acc, n) => {
                                const e = estudiantes.find(x => x.idnivel == n.idnivel);
                                const rawVals = (e && e.estudiantesXAula && e.estudiantesXAula.length > 0) ? e.estudiantesXAula : [];
                                const valString = rawVals.join(", ");

                                let suma = 0;
                                rawVals.forEach(v => {
                                    suma += (parseInt(v) || 0);
                                });

                                acc.push(valString);
                                acc.push(suma);
                                return acc;
                            }, []),

                            fichero.fm_SumaTotal_EstudiantesxAula || 0,
                            fichero.fm_cantidad_real_estudiantes || 0,
                            creadoPor, fechaCreacion, editadoPor, fechaEdicion,
                            enviadoPor, fechaEnvio, aprobadoPor, fechaAprobacion,
                            devueltoPor, fechaDevolucion, comentarioDevolucion
                        ];

                        resumenFilas.push(row);
                    });

                    // === Crear hoja ===
                    const wsResumen = XLSX.utils.aoa_to_sheet(resumenFilas);

                    wsResumen['!cols'] = Array(resumenFilas[0].length).fill({
                        wch: 16
                    });
                    wsResumen['!cols'][2] = {
                        wch: 40
                    }; // Institución
                    wsResumen['!cols'][8] = {
                        wch: 40
                    }; // Dirección (nueva columna ancha)
                    wsResumen['!cols'][12] = {
                        wch: 50
                    }; // Observación (era la 12, ahora sigue siendo válida)

                    const idxCreado = headerRow.indexOf("Creado por");
                    wsResumen['!cols'][idxCreado] = {
                        wch: 25
                    };
                    wsResumen['!cols'][idxCreado + 2] = {
                        wch: 25
                    };
                    wsResumen['!cols'][idxCreado + 4] = {
                        wch: 25
                    };
                    wsResumen['!cols'][idxCreado + 6] = {
                        wch: 25
                    };
                    wsResumen['!cols'][idxCreado + 8] = {
                        wch: 25
                    };
                    wsResumen['!cols'][idxCreado + 10] = {
                        wch: 50
                    };

                    wsResumen['!rows'] = [{
                        hpt: 50
                    }];

                    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

                    // ===================================================================
                    // 2. HOJA "Editoriales" - MEJORADA: NUNCA CELDA VACÍA
                    // ===================================================================

                    const hojaEditoriales = [];

                    // Encabezado con Periodo Escolar después del Asesor
                    const headerEd = ["ID Fichero", "Institución", "Asesor", "Periodo Escolar", "Libro"];
                    nivelesLista.forEach(function (n) {
                        headerEd.push(n.nombrenivel);
                        headerEd.push("Total Estudiantes (" + n.nombrenivel + ")");
                        headerEd.push("Valor Pensión (" + n.nombrenivel + ")");
                    });
                    hojaEditoriales.push(headerEd);

                    // Procesar cada fichero
                    this.ficheros.forEach(function (fichero) {
                        const fm_id = fichero.fm_id || "";
                        const institucion = fichero.nombreInstitucion || "";
                        const asesor = fichero.asesor_institucion || "";
                        const periodo = fichero.descripcion_periodoescolar || "Sin periodo";

                        // Caso: no tiene libros registrados
                        if (!fichero.detalles || fichero.detalles.length === 0) {
                            const filaVacia = [fm_id, institucion, asesor, periodo, "Sin libros registrados"];
                            for (let i = 0; i < nivelesLista.length; i++) {
                                filaVacia.push("");
                                filaVacia.push("");
                                filaVacia.push("");
                            }
                            hojaEditoriales.push(filaVacia);
                            return;
                        }

                        // Pre-calcular sumas de estudiantes por nivel para este fichero
                        const listaEstudiantes = [];
                        try {
                            listaEstudiantes.push.apply(listaEstudiantes, JSON.parse(fichero.fm_cantidad_estudiantes_x_aula_completo || "[]"));
                        } catch (e) {}

                        // Parsear pensiones para este fichero
                        let pensionesObj = {};
                        try {
                            pensionesObj = JSON.parse(fichero.fm_pensiones || "{}");
                        } catch (e) {}

                        const mapSumas = {};
                        nivelesLista.forEach(n => {
                           const e = listaEstudiantes.find(x => x.idnivel == n.idnivel);
                           const rawVals = (e && e.estudiantesXAula) ? e.estudiantesXAula : [];
                           let suma = 0;
                           rawVals.forEach(v => suma += (parseInt(v) || 0));
                           mapSumas[n.idnivel] = suma;
                        });

                        // Procesar cada libro del fichero
                        fichero.detalles.forEach(function (detalle) {
                            const nombreLibro = detalle.fmd_nombre_libro || "Sin nombre";

                            let nivelesEd = [];
                            try {
                                nivelesEd = JSON.parse(detalle.fmd_niveles_editoriales || "[]");
                            } catch (e) {
                                nivelesEd = [];
                            }

                            // Mapa idnivel → edi_id
                            const mapa = {};
                            nivelesEd.forEach(function (item) {
                                if (item.idnivel != null) {
                                    let edi = item.editorialesSeleccionadas;

                                    if (edi === null || edi === undefined || edi === "" || edi === 0) {
                                        edi = "";
                                    } else if (Array.isArray(edi)) {
                                        edi = edi.length > 0 ? edi[0] : "";
                                    }
                                    mapa[item.idnivel] = edi;
                                }
                            });

                            // Fila del libro
                            const fila = [fm_id, institucion, asesor, periodo, nombreLibro];

                            nivelesLista.forEach(function (nivel, idxNivel) {
                                const edi_id = mapa[nivel.idnivel];
                                const sumaEstudiantes = mapSumas[nivel.idnivel] || 0;

                                // Determinar pensión según índice
                                let rawPension = "";
                                if (idxNivel <= 1) rawPension = pensionesObj.iniciales;
                                else if (idxNivel === 2) rawPension = pensionesObj.preparatoria;
                                else if (idxNivel >= 3 && idxNivel <= 5) rawPension = pensionesObj.elemental;
                                else if (idxNivel >= 6 && idxNivel <= 8) rawPension = pensionesObj.medio;
                                else if (idxNivel >= 9 && idxNivel <= 11) rawPension = pensionesObj.superior;
                                else if (idxNivel >= 12 && idxNivel <= 14) rawPension = pensionesObj.bachillerato;

                                const pensionVal = rawPension ? "$" + rawPension : "";

                                if (!edi_id || edi_id === "") {
                                    fila.push("");
                                    fila.push("");
                                    fila.push("");
                                } else {
                                    const editorial = editorialesLista.find(function (e) {
                                        return e.edi_id === parseInt(edi_id, 10);
                                    });

                                    if (editorial) {
                                        fila.push(editorial.edi_nombre);
                                    } else {
                                        fila.push("ID " + edi_id + " (no encontrado)");
                                    }
                                    // Añadir suma de estudiantes
                                    fila.push(sumaEstudiantes);

                                    // Añadir valor pensión
                                    fila.push(pensionVal);
                                }
                            });

                            hojaEditoriales.push(fila);
                        });
                    });

                    // === Crear hoja Excel ===
                    const wsEditoriales = XLSX.utils.aoa_to_sheet(hojaEditoriales);

                    // Anchos de columna actualizados (una más por el periodo)
                    const colsEd = [{
                            wch: 12
                        }, // ID Fichero
                        {
                            wch: 45
                        }, // Institución
                        {
                            wch: 25
                        }, // Asesor
                        {
                            wch: 18
                        }, // Periodo Escolar ← nuevo
                        {
                            wch: 40
                        } // Libro
                    ];
                    for (let i = 0; i < nivelesLista.length; i++) {
                        colsEd.push({ wch: 22 }); // Editorial
                        colsEd.push({ wch: 15 }); // Total Estudiantes
                        colsEd.push({ wch: 15 }); // Valor Pensión
                    }
                    wsEditoriales['!cols'] = colsEd;

                    // Altura del encabezado
                    wsEditoriales['!rows'] = [{
                        hpt: 50
                    }];

                    // Estilo del encabezado (azul oscuro + blanco)
                    const range = XLSX.utils.decode_range(wsEditoriales['!ref']);
                    for (let C = range.s.c; C <= range.e.c; C++) {
                        const addr = XLSX.utils.encode_cell({
                            r: 0,
                            c: C
                        });
                        if (wsEditoriales[addr]) {
                            wsEditoriales[addr].s = {
                                font: {
                                    bold: true,
                                    color: {
                                        rgb: "FFFFFF"
                                    }
                                },
                                fill: {
                                    fgColor: {
                                        rgb: "1f4e78"
                                    }
                                },
                                alignment: {
                                    wrapText: true,
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            };
                        }
                    }

                    XLSX.utils.book_append_sheet(wb, wsEditoriales, "Editoriales");

                    // ===================================================================
                    // 3. HOJA "Autoridades"
                    // ===================================================================
                    const hojaAutoridades = [];
                    const headerAut = ["ID Fichero", "Institución", "Asesor", "Periodo Escolar", "Cargo", "Nombres y Apellidos", "Cédula", "Teléfono", "Email", "F. Nacimiento", "Decide Compra"];
                    hojaAutoridades.push(headerAut);

                    this.ficheros.forEach(function(fichero) {
                        const fm_id = fichero.fm_id || "";
                        const institucion = fichero.nombreInstitucion || "";
                        const asesor = fichero.asesor_institucion || "";
                        const periodo = fichero.descripcion_periodoescolar || "Sin periodo";

                        let decideCompra = [];
                        try {
                            decideCompra = JSON.parse(fichero.fm_decide_compra || "[]");
                        } catch (e) {}

                        if (!fichero.autoridades || fichero.autoridades.length === 0) {
                            // Fila vacía
                            const fila = [fm_id, institucion, asesor, periodo, "Sin autoridades", "", "", "", "", "", ""];
                            hojaAutoridades.push(fila);
                            return;
                        }

                        fichero.autoridades.forEach(function(a) {
                            const cargoId = parseInt(a.fma_cargo, 10);
                            const cargoObj = cargosLista.find(c => c.ina_id == cargoId);
                            const cargoNombre = cargoObj ? cargoObj.ina_nombre : "Cargo " + cargoId;

                            // Decide compra?
                            const decide = decideCompra.find(d => d.idusuario == a.idusuario);
                            const decideTexto = decide ? "Sí" : "No";

                             // Formatear fecha de nacimiento
                            let fechaNac = "";
                             if (a.fecha_nacimiento && a.fecha_nacimiento !== "null" && a.fecha_nacimiento !== null) {
                                try {
                                    const fecha = new Date(a.fecha_nacimiento);
                                    if (!isNaN(fecha)) {
                                        fechaNac = fecha.toLocaleDateString('es-EC');
                                    }
                                } catch (e) {}
                            }

                            const nombreCompleto = ((a.nombres || "") + " " + (a.apellidos || "")).trim();
                            const cedula = a.cedula || "";
                            // Limpiar teléfono
                            const telefono = (a.telefono && a.telefono !== "null" && a.telefono !== "0") ? a.telefono.trim() : "";
                            const email = a.email || "";

                            const fila = [
                                fm_id, institucion, asesor, periodo,
                                cargoNombre,
                                nombreCompleto,
                                cedula,
                                telefono,
                                email,
                                fechaNac,
                                decideTexto
                            ];
                            hojaAutoridades.push(fila);
                        });
                    });

                    const wsAutoridades = XLSX.utils.aoa_to_sheet(hojaAutoridades);
                    // Anchos
                    const colsAut = [
                        { wch: 10 }, // ID
                        { wch: 35 }, // Inst
                        { wch: 25 }, // Asesor
                        { wch: 20 }, // Periodo
                        { wch: 20 }, // Cargo
                        { wch: 35 }, // Nombres
                        { wch: 15 }, // Cedula
                        { wch: 15 }, // Telefono
                        { wch: 30 }, // Email
                        { wch: 15 }, // Fecha Nac
                        { wch: 10 }  // Decide
                    ];
                    wsAutoridades['!cols'] = colsAut;
                    wsAutoridades['!rows'] = [{ hpt: 30 }];

                    // Estilo Header
                     const rangeAut = XLSX.utils.decode_range(wsAutoridades['!ref']);
                    for (let C = rangeAut.s.c; C <= rangeAut.e.c; C++) {
                        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
                        if (wsAutoridades[addr]) {
                            wsAutoridades[addr].s = {
                                font: { bold: true, color: { rgb: "FFFFFF" } },
                                fill: { fgColor: { rgb: "1f4e78" } },
                                alignment: { wrapText: true, vertical: "center", horizontal: "center" }
                            };
                        }
                    }

                    XLSX.utils.book_append_sheet(wb, wsAutoridades, "Autoridades");

                    // ===================================================================
                    // 4. HOJA "Planificaciones" → CON ORDEN CORRECTO: Título → Fecha Visita
                    // ===================================================================

                    const hojaPlanificaciones = [];

                    // === 1. Recolectar todas las opciones posibles ===
                    const todasOpciones = {};
                    this.ficheros.forEach(function (fichero) {
                        if (!fichero.entregas_muestras || fichero.entregas_muestras.length === 0) return;

                        fichero.entregas_muestras.forEach(function (plan) {
                            try {
                                const opciones = JSON.parse(plan.opciones || "{}");
                                Object.keys(opciones).forEach(function (key) {
                                    if (key !== "editorial" && key !== "otraEditorial") {
                                        todasOpciones[key] = true;
                                    }
                                });
                            } catch (e) {}
                        });
                    });
                    const listaOpciones = Object.keys(todasOpciones).sort();

                    // === 2. Encabezado con "Acción planificada (Nombre)" ===
                    const headerPlan = [
                        "ID Fichero",
                        "Institución",
                        "Asesor",
                        "Periodo Escolar",
                        "Título Actividad",
                        "Fecha Creación",
                        "Usuario Creación",
                        "Fecha Planificada",
                        "Fecha Visitó",
                        "Usuario Finalizó",
                        "Fecha Finalizó"
                    ];

                    // Añadir cada opción con el prefijo "Acción planificada"
                    listaOpciones.forEach(function (op) {
                        const nombreOriginal = op
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, function (l) {
                                return l.toUpperCase();
                            });
                        headerPlan.push("Acción planificada (" + nombreOriginal + ")");
                    });

                    headerPlan.push("Estado");
                    hojaPlanificaciones.push(headerPlan);

                    // === 3. Procesar cada fichero ===
                    this.ficheros.forEach(function (fichero) {
                        const fm_id = fichero.fm_id || "";
                        const institucion = fichero.nombreInstitucion || "";
                        const asesor = fichero.asesor_institucion || "";
                        const periodo = fichero.descripcion_periodoescolar || "";

                        // SIN PLANIFICACIONES
                        if (!fichero.entregas_muestras || fichero.entregas_muestras.length === 0) {
                            const fila = [
                                fm_id, institucion, asesor, periodo,
                                "Sin planificaciones registradas",
                                "--", "--", "--", "--", "--", "--"
                            ];
                            for (let i = 0; i < listaOpciones.length; i++) fila.push("--");
                            fila.push("--");
                            hojaPlanificaciones.push(fila);
                            return;
                        }

                        // CON PLANIFICACIONES
                        fichero.entregas_muestras.forEach(function (plan) {
                            const titulo = plan.title || "";

                            const fechaCreacion = plan.created_at ? plan.created_at.split(" ")[0] : "--";
                            const usuarioCreacion = plan.us_create_planificacion || "--";

                            let fechaPlanificada = "--";
                            if (plan.startDate) {
                                fechaPlanificada = plan.startDate.split(" ")[0];
                                if (plan.hora_inicio && plan.hora_fin) {
                                    fechaPlanificada += " (" + plan.hora_inicio + " - " + plan.hora_fin + ")";
                                }
                            }

                            const fechaVisito = plan.fecha_que_visita ? plan.fecha_que_visita.split(" ")[0] : "--";
                            const usuarioFinalizo = plan.us_finalizo_planificacion || "--";
                            const fechaFinalizo = plan.fecha_captura_longitud_fin ? plan.fecha_captura_longitud_fin.split(" ")[0] : "--";

                            let estadoTexto = "Desconocido";
                            if (plan.estado == "0") estadoTexto = "Generada";
                            else if (plan.estado == "1") estadoTexto = "Realizada";
                            else if (plan.estado == "2") estadoTexto = "Eliminado";
                            else if (plan.estado == "3") estadoTexto = "No Realizada";
                            else if (plan.estado == "4") estadoTexto = "Finalizada";

                            let opcionesObj = {};
                            try {
                                opcionesObj = JSON.parse(plan.opciones || "{}");
                            } catch (e) {}

                            const fila = [
                                fm_id, institucion, asesor, periodo, titulo,
                                fechaCreacion, usuarioCreacion, fechaPlanificada, fechaVisito, usuarioFinalizo, fechaFinalizo
                            ];

                            // Cada opción → Sí / No
                            listaOpciones.forEach(function (op) {
                                fila.push(opcionesObj[op] === true ? "Sí" : "No");
                            });

                            fila.push(estadoTexto);
                            hojaPlanificaciones.push(fila);
                        });
                    });

                    // === 4. Crear hoja Excel ===
                    const wsPlan = XLSX.utils.aoa_to_sheet(hojaPlanificaciones);

                    // Anchos de columna (las de "Acción planificada" más anchas)
                    const colsBase = [{
                            wch: 12
                        }, {
                            wch: 45
                        }, {
                            wch: 25
                        }, {
                            wch: 16
                        },
                        {
                            wch: 42
                        }, // Título
                        {
                            wch: 14
                        }, // Fecha Creación
                        {
                            wch: 32
                        }, // Usuario Creación
                        {
                            wch: 24
                        }, // Fecha Planificada
                        {
                            wch: 14
                        }, // Fecha Visitó
                        {
                            wch: 32
                        }, // Usuario Finalizó
                        {
                            wch: 18
                        } // Fecha Finalizó
                    ];
                    listaOpciones.forEach(function () {
                        colsBase.push({
                            wch: 28
                        }); // ← más ancho por el texto largo
                    });
                    colsBase.push({
                        wch: 14
                    }); // Estado

                    wsPlan['!cols'] = colsBase;
                    wsPlan['!rows'] = [{
                        hpt: 60
                    }]; // un poco más alto por el texto largo

                    // Encabezado azul bonito
                    const rangeEnc = XLSX.utils.decode_range(wsPlan['!ref']);
                    for (let C = rangeEnc.s.c; C <= rangeEnc.e.c; C++) {
                        const addr = XLSX.utils.encode_cell({
                            r: 0,
                            c: C
                        });
                        if (wsPlan[addr]) {
                            wsPlan[addr].s = {
                                font: {
                                    bold: true,
                                    color: {
                                        rgb: "FFFFFF"
                                    }
                                },
                                fill: {
                                    fgColor: {
                                        rgb: "1f4e78"
                                    }
                                },
                                alignment: {
                                    wrapText: true,
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            };
                        }
                    }

                    // Fondo rojo para "Eliminada"
                    const colEstado = headerPlan.indexOf("Estado");
                    const rangeAll = XLSX.utils.decode_range(wsPlan['!ref']);
                    for (let R = 1; R <= rangeAll.e.r; R++) {
                        const celda = wsPlan[XLSX.utils.encode_cell({
                            r: R,
                            c: colEstado
                        })];
                        if (celda && (celda.v === "Eliminada" || celda.v === "Eliminado")) {
                            for (let C = rangeAll.s.c; C <= rangeAll.e.c; C++) {
                                const addr = XLSX.utils.encode_cell({
                                    r: R,
                                    c: C
                                });
                                if (!wsPlan[addr]) wsPlan[addr] = {
                                    v: ""
                                };
                                if (!wsPlan[addr].s) wsPlan[addr].s = {};
                                wsPlan[addr].s.font = {
                                    color: {
                                        rgb: "FFFFFF"
                                    }
                                };
                                wsPlan[addr].s.fill = {
                                    fgColor: {
                                        rgb: "C00000"
                                    }
                                };
                            }
                        }
                    }

                    XLSX.utils.book_append_sheet(wb, wsPlan, "Planificaciones");

                    // ===================================================================
                    // 5. HOJA "PuntosDespacho"
                    // ===================================================================
                    const hojaPuntosDespacho = [];
                    const headerDespacho = [
                        "ID Fichero",
                        "Institución (Cabecera)",
                        "Asesor",
                        "Periodo Escolar",
                        "Establecimiento de Despacho",
                        "Tipo de Establecimiento",
                        "Provincia",
                        "Ciudad/Cantón",
                        "Parroquia"
                    ];

                    hojaPuntosDespacho.push(headerDespacho);

                    this.ficheros.forEach(function (fichero) {
                        const fm_id = fichero.fm_id || "";
                        const institucion = fichero.nombreInstitucion || "";
                        const asesor = fichero.asesor_institucion || "";
                        const periodo = fichero.descripcion_periodoescolar || "";

                        if (!fichero.establecimientos_despacho_objs || fichero.establecimientos_despacho_objs.length === 0) {
                            const fila = [fm_id, institucion, asesor, periodo, "Sin establecimientos de despacho", "", "", "", ""];
                            hojaPuntosDespacho.push(fila);
                        } else {
                            fichero.establecimientos_despacho_objs.forEach(inst => {
                                const nombre = inst.nombreInstitucion || "";
                                const esPunto = inst.punto_venta == 1 ? "Punto de Venta" : "Institución";
                                const provincia = inst.nombreprovincia || "";
                                const ciudad = inst.nombre || "";
                                const parroquia = inst.parr_nombre || "";

                                const fila = [fm_id, institucion, asesor, periodo, nombre, esPunto, provincia, ciudad, parroquia];
                                hojaPuntosDespacho.push(fila);
                            });
                        }
                    });

                    const wsPuntosDespacho = XLSX.utils.aoa_to_sheet(hojaPuntosDespacho);

                    const colsDespacho = [
                        { wch: 12 }, // ID Fichero
                        { wch: 45 }, // Institucion
                        { wch: 25 }, // Asesor
                        { wch: 18 }, // Periodo Escolar
                        { wch: 50 }, // Establecimiento
                        { wch: 20 }, // Tipo Establecimiento
                        { wch: 25 }, // Provincia
                        { wch: 25 }, // Ciudad/Cantón
                        { wch: 25 }  // Parroquia
                    ];

                    wsPuntosDespacho['!cols'] = colsDespacho;
                    wsPuntosDespacho['!rows'] = [{ hpt: 30 }];

                    const rangeDesp = XLSX.utils.decode_range(wsPuntosDespacho['!ref']);
                    for (let C = rangeDesp.s.c; C <= rangeDesp.e.c; C++) {
                        const addr = XLSX.utils.encode_cell({ r: 0, c: C });
                        if (wsPuntosDespacho[addr]) {
                            wsPuntosDespacho[addr].s = {
                                font: { bold: true, color: { rgb: "FFFFFF" } },
                                fill: { fgColor: { rgb: "1f4e78" } },
                                alignment: { vertical: "center", horizontal: "center" }
                            };
                        }
                    }

                    XLSX.utils.book_append_sheet(wb, wsPuntosDespacho, "EstablecimientosDespacho");
                    // === FIN RESUMEN FICHERO ============================
                    // ===================================================================
                    // // === HOJAS DETALLADAS (UNA POR FICHERO) ============================
                    // // ===================================================================
                    // this.ficheros.forEach(function (fichero) {
                    //     const hoja = ('Fichero_' + fichero.fm_id).substring(0, 31);
                    //     const filas = [];
                    //     const merges = [];

                    //     // TÍTULO
                    //     filas.push(['FICHERO DE MERCADO - ' + (fichero.descripcion_periodoescolar || 'Sin periodo')]);
                    //     filas.push([]);

                    //     // ESTABLECIMIENTO
                    //     const headersEstablecimiento = [
                    //         "Nombre",
                    //         "Asesor",
                    //         "Provincia",
                    //         "Ciudad",
                    //         "Parroquia",
                    //         "Dirección",
                    //         "Teléfono",
                    //         "Correo",
                    //         "Tipo",
                    //         // "Punto de Venta",
                    //         "Trabaja con Prolipa",
                    //         "Convenio con Prolipa",
                    //         "Años trabajando con Prolipa",
                    //         "Tipo de Venta",
                    //     ];
                    //     const valoresEstablecimiento = [
                    //         fichero.nombreInstitucion || "",
                    //         fichero.asesor_institucion || "",
                    //         fichero.nombreprovincia || "",
                    //         fichero.nombre_ciudad || "",
                    //         fichero.parr_nombre || "",
                    //         fichero.direccionInstitucion || "",
                    //         fichero.telefonoInstitucion || "",
                    //         fichero.email || "",
                    //         fichero.tipo_descripcion || "",
                    //         // fichero.punto_venta == 1 ? "Punto de Venta" : "Plantel",
                    //         fichero.fm_trabaja_con_prolipa == 1 ? "Sí" : "No",
                    //         // === CONVENIO ===
                    //         fichero.fm_trabaja_con_prolipa == 1 ?
                    //         (fichero.fm_convenio == 1 ? "Sí" : fichero.fm_convenio == 0 ? "No" : "No seleccionado") :
                    //         "No aplica",
                    //         // === AÑOS TRABAJANDO ===
                    //         fichero.fm_trabaja_con_prolipa == 1 ?
                    //         (fichero.fm_cantidad_anios_trabaja_con_prolipa > 0 ? fichero.fm_cantidad_anios_trabaja_con_prolipa : "No seleccionado") :
                    //         "No aplica",
                    //         // === TIPO DE VENTA ===
                    //         fichero.fm_tipo_venta == '1' ? "Directa" :
                    //         fichero.fm_tipo_venta == '2' ? "Comisión/Lista" :
                    //         "No seleccionado",
                    //     ];

                    //     // Agregar título
                    //     filas.push(["DATOS DEL ESTABLECIMIENTO"]);

                    //     // Agregar cabeceras
                    //     filas.push(headersEstablecimiento);

                    //     // Agregar valores
                    //     filas.push(valoresEstablecimiento);

                    //     // Espacio
                    //     filas.push([]);

                    //     // FACTORES
                    //     filas.push(["FACTORES QUE INCIDEN EN LA COMPRA"]);
                    //     try {
                    //         const factores = JSON.parse(fichero.fm_factores_inciden_en_compra || "{}");
                    //         const activos = Object.keys(factores).filter(k => factores[k]).join(", ");
                    //         filas.push([activos || "Ninguno"]);
                    //     } catch (e) {
                    //         filas.push(["Error en datos"]);
                    //     }
                    //     filas.push([]);

                    //     // MUESTRAS
                    //     filas.push(["PLANIFICACIÓN INSTITUCIONAL (Datos obtenidos de tus planificaciones semanales)"]);
                    //     filas.push([
                    //         "Título",
                    //         "Acciones planificadas",
                    //         "Creado por",
                    //         "Fecha Creación",
                    //         "Fecha Asignada",
                    //         "Hora",
                    //         "Fecha Visita",
                    //         "Finalizado por"
                    //     ]);
                    //     if (fichero.entregas_muestras && fichero.entregas_muestras.length > 0) {
                    //         fichero.entregas_muestras.forEach(function (e) {
                    //             const fc = e.created_at ? e.created_at.split(' ')[0] : '---';
                    //             const fa = e.startDate ? e.startDate.split(' ')[0] : '---';
                    //             const hora = (e.hora_inicio && e.hora_fin) ? e.hora_inicio + ' - ' + e.hora_fin : '---';
                    //             const fv = e.fecha_que_visita ? e.fecha_que_visita.split(' ')[0] : '---';
                    //             const opciones = e.opciones_seleccionadas && e.opciones_seleccionadas.length ?
                    //                 e.opciones_seleccionadas :
                    //                 '---';
                    //             filas.push([
                    //                 opciones,
                    //                 e.title || "---",
                    //                 e.us_create_planificacion || "---",
                    //                 fc,
                    //                 fa,
                    //                 hora,
                    //                 fv,
                    //                 e.us_finalizo_planificacion || "---"
                    //             ]);
                    //         });
                    //     } else {
                    //         // Guardamos el índice de esta fila
                    //         const filaIndex = filas.length;
                    //         filas.push([
                    //             "No se han registrado planificaciones aún.", // A
                    //             "", // B
                    //             "", // C
                    //             "", "", "", "", "" // D–H
                    //         ]);
                    //         // MERGE A-C para que el mensaje ocupe 3 columnas
                    //         merges.push({
                    //             s: {
                    //                 r: filaIndex,
                    //                 c: 0
                    //             }, // Comienza en A (columna 0)
                    //             e: {
                    //                 r: filaIndex,
                    //                 c: 2
                    //             } // Termina en C (columna 2)
                    //         });
                    //     }
                    //     filas.push([]);

                    //     // PERSONAL
                    //     filas.push(["PERSONAL DEL PLANTEL"]);
                    //     filas.push(["Cargo", "Nombre", "Fecha Nacimiento", "Cédula", "Teléfono", "Correo", "Decide Compra"]);
                    //     let decideCompra = [];
                    //     try {
                    //         decideCompra = JSON.parse(fichero.fm_decide_compra || "[]");
                    //     } catch (e) {}

                    //     if (fichero.autoridades && fichero.autoridades.length > 0) {
                    //         fichero.autoridades.forEach(function (a) {
                    //             const decide = decideCompra.find(d => d.idusuario == a.idusuario);
                    //             filas.push([
                    //                 a.cargo || "Sin cargo",
                    //                 (a.nombres || "") + " " + (a.apellidos || ""),
                    //                 a.fecha_nacimiento || "",
                    //                 a.cedula || "",
                    //                 a.telefono || "",
                    //                 a.email || "",
                    //                 decide ? "Sí" : "No"
                    //             ]);
                    //         });
                    //     } else {
                    //         // Guardamos el índice de esta fila
                    //         const filaIndex = filas.length;
                    //         filas.push(["Sin autoridades", "", "", "", "", ""]);
                    //         // MERGE A-C para que el mensaje ocupe 3 columnas
                    //         merges.push({
                    //             s: {
                    //                 r: filaIndex,
                    //                 c: 0
                    //             }, // Comienza en A (columna 0)
                    //             e: {
                    //                 r: filaIndex,
                    //                 c: 2
                    //             } // Termina en C (columna 2)
                    //         });
                    //     }
                    //     filas.push([]);

                    //     // === NÚMERO DE AULAS Y ESTUDIANTES (AGRUPADO) ===
                    //     filas.push(["NÚMERO DE AULAS Y ESTUDIANTES"]);
                    //     filas.push([]);

                    //     const seccionColumnas = {
                    //         iniciales: [1, 2],
                    //         preparatoria: [3],
                    //         elemental: [4, 5, 6],
                    //         medio: [7, 8, 9],
                    //         superior: [10, 11, 12],
                    //         bachillerato: [13, 14, 15]
                    //     };

                    //     const totalColumnas = this.array_Lista_Niveles.length;

                    //     // ENCABEZADO DE GRUPOS
                    //     const headerGrupos = ["Niveles Educativos"];
                    //     let colIndex = 1;

                    //     for (const grupo in seccionColumnas) {
                    //         const cols = seccionColumnas[grupo];
                    //         const nombre = grupo.toUpperCase() +
                    //             (grupo === 'iniciales' ? ' (1–2)' :
                    //                 grupo === 'preparatoria' ? ' (1)' :
                    //                 grupo === 'elemental' ? ' (2–4)' :
                    //                 grupo === 'medio' ? ' (5–7)' :
                    //                 grupo === 'superior' ? ' (8–10)' :
                    //                 grupo === 'bachillerato' ? ' (1BGU–3BGU)' : '');

                    //         headerGrupos.push(nombre);

                    //         if (cols.length > 1) {
                    //             merges.push({
                    //                 s: {
                    //                     r: filas.length,
                    //                     c: colIndex
                    //                 },
                    //                 e: {
                    //                     r: filas.length,
                    //                     c: colIndex + cols.length - 1
                    //                 }
                    //             });
                    //             for (let i = 1; i < cols.length; i++) {
                    //                 headerGrupos.push("");
                    //             }
                    //         }
                    //         colIndex += cols.length;
                    //     }
                    //     filas.push(headerGrupos);

                    //     // DISPONIBLE Y OPERATIVO
                    //     const nivelesEducativos = {};
                    //     try {
                    //         Object.assign(nivelesEducativos, JSON.parse(fichero.fm_niveles_educativos || "{}"));
                    //     } catch (e) {}

                    //     const operativosRow = ["Disponible y operativo en la institución"];
                    //     colIndex = 1;

                    //     for (const grupo in seccionColumnas) {
                    //         const cols = seccionColumnas[grupo];
                    //         const valor = nivelesEducativos[grupo] ? "Sí" : "No";
                    //         operativosRow.push(valor);

                    //         if (cols.length > 1) {
                    //             merges.push({
                    //                 s: {
                    //                     r: filas.length,
                    //                     c: colIndex
                    //                 },
                    //                 e: {
                    //                     r: filas.length,
                    //                     c: colIndex + cols.length - 1
                    //                 }
                    //             });
                    //             for (let i = 1; i < cols.length; i++) {
                    //                 operativosRow.push("");
                    //             }
                    //         }
                    //         colIndex += cols.length;
                    //     }
                    //     filas.push(operativosRow);

                    //     // GRADO
                    //     const headerGrados = ["Grado"];
                    //     this.array_Lista_Niveles.forEach(n => headerGrados.push(n.nombrenivel));
                    //     filas.push(headerGrados);

                    //     // PENSIÓN
                    //     const pensiones = {};
                    //     try {
                    //         Object.assign(pensiones, JSON.parse(fichero.fm_pensiones || "{}"));
                    //     } catch (e) {}

                    //     const pensionRow = ["VALOR DE LA PENSIÓN"];
                    //     colIndex = 1;

                    //     for (const grupo in seccionColumnas) {
                    //         const cols = seccionColumnas[grupo];
                    //         const valor = pensiones[grupo] ? "$" + pensiones[grupo] : "";
                    //         pensionRow.push(valor);

                    //         if (cols.length > 1) {
                    //             merges.push({
                    //                 s: {
                    //                     r: filas.length,
                    //                     c: colIndex
                    //                 },
                    //                 e: {
                    //                     r: filas.length,
                    //                     c: colIndex + cols.length - 1
                    //                 }
                    //             });
                    //             for (let i = 1; i < cols.length; i++) {
                    //                 pensionRow.push("");
                    //             }
                    //         }
                    //         colIndex += cols.length;
                    //     }
                    //     filas.push(pensionRow);

                    //     // # DE AULAS
                    //     const aulas = [];
                    //     try {
                    //         aulas.push.apply(aulas, JSON.parse(fichero.fm_numero_aulas_completo || "[]"));
                    //     } catch (e) {}

                    //     const aulasRow = ["# DE AULAS"];
                    //     this.array_Lista_Niveles.forEach(n => {
                    //         const aula = aulas.find(a => a.idnivel == n.idnivel);
                    //         aulasRow.push(aula ? aula.numeroAulas : 0);
                    //     });
                    //     filas.push(aulasRow);

                    //     // ESTUDIANTES POR AULA (DINÁMICO)
                    //     const estudiantes = [];
                    //     try {
                    //         estudiantes.push.apply(estudiantes, JSON.parse(fichero.fm_cantidad_estudiantes_x_aula_completo || "[]"));
                    //     } catch (e) {}

                    //     let maxAulas = 0;
                    //     estudiantes.forEach(item => {
                    //         if (item.estudiantesXAula && item.estudiantesXAula.length > maxAulas) {
                    //             maxAulas = item.estudiantesXAula.length;
                    //         }
                    //     });

                    //     for (let i = 1; i <= maxAulas; i++) {
                    //         const row = ["ESTUDIANTES POR AULA - Aula " + i];
                    //         this.array_Lista_Niveles.forEach(n => {
                    //             const est = estudiantes.find(e => e.idnivel == n.idnivel);
                    //             row.push(est && est.estudiantesXAula && est.estudiantesXAula[i - 1] !== undefined ? est.estudiantesXAula[i - 1] : "");
                    //         });
                    //         filas.push(row);
                    //     }

                    //     // TOTALES
                    //     filas.push(["Total Estudiantes", fichero.fm_SumaTotal_EstudiantesxAula || 0]);
                    //     filas.push(["Cantidad real de estudiantes", fichero.fm_cantidad_real_estudiantes || 0]);
                    //     filas.push([]);

                    //     // EDITORIALES
                    //     filas.push(["NOMBRE DE LA/S EDITORIAL/ES CON LA/S QUE TRABAJA/N"]);
                    //     const headers = ["Libro"];
                    //     this.array_Lista_Niveles.forEach(n => headers.push(n.nombrenivel));
                    //     filas.push(headers);

                    //     if (fichero.detalles && fichero.detalles.length > 0) {
                    //         fichero.detalles.forEach(d => {
                    //             const row = [d.fmd_nombre_libro || "Sin nombre"];
                    //             let nivelesJSON = [];
                    //             try {
                    //                 nivelesJSON = JSON.parse(d.fmd_niveles_editoriales || "[]");
                    //             } catch (e) {}
                    //             this.array_Lista_Niveles.forEach(n => {
                    //                 const found = nivelesJSON.find(x => x.idnivel == n.idnivel);
                    //                 const edi_id = found ? found.editorialesSeleccionadas : null;
                    //                 const edi = this.array_Lista_Editoriales.find(e => e.edi_id == edi_id);
                    //                 row.push(edi ? edi.edi_nombre : "--");
                    //             });
                    //             filas.push(row);
                    //         });
                    //     } else {
                    //         filas.push(["No hay libros registrados"]);
                    //     }
                    //     filas.push([]);

                    //     // OBSERVACIÓN
                    //     filas.push(["OBSERVACIÓN"]);
                    //     filas.push([fichero.fm_observacion || "Sin observación"]);
                    //     filas.push([]);

                    //     // FECHAS
                    //     filas.push(["FECHAS"]);
                    //     filas.push(["Creado", fichero.created_at || "---"]);
                    //     filas.push(["Actualizado", fichero.updated_at || "---"]);
                    //     filas.push([]);

                    //     // === CREAR HOJA DETALLADA ===
                    //     const ws = XLSX.utils.aoa_to_sheet(filas);

                    //     if (merges.length > 0) {
                    //         ws['!merges'] = ws['!merges'] || [];
                    //         ws['!merges'].push.apply(ws['!merges'], merges);
                    //     }

                    //     ws['!cols'] = Array(totalColumnas + 1).fill({
                    //         wch: 15
                    //     });
                    //     XLSX.utils.book_append_sheet(wb, ws, hoja);
                    // }.bind(this));

                    // // === EXPORTAR ===
                    const fecha = new Date().toISOString().slice(0, 10);
                    XLSX.writeFile(wb, 'Ficheros_Mercado_Completos_' + fecha + '.xlsx');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }.bind(this));
        },
    }
};
</script>
