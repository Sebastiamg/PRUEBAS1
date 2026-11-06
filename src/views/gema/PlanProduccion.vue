<template>
  <div>
    <!-- ===================== LISTA DE PLANES ===================== -->
    <template v-if="!planActivo">
      <div class="gema-toolbar">
        <span class="gema-muted">
          El plan lo arman a la par el jefe de Redaccion y el de Diseno: cada uno
          asigna las etapas de su area.
        </span>
        <div class="gema-spacer"></div>
        <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nuevoPlan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
          Nuevo plan
        </button>
      </div>

      <gema-tabla
        :columnas="columnasPlanes"
        :filas="planes"
        :cargando="cargando"
        texto-vacio="No hay planes de produccion"
      >
        <template #vacio>Cree un plan y configurelo para generar el Gantt.</template>

        <template #default="{ filas }">
          <tr v-for="p in filas" :key="p.plan_id" @click="abrirPlan(p)">
            <td class="is-wrap">{{ p.nombre }}</td>
            <td class="gema-num gema-faint">{{ fecha(p.fecha_inicio) }}</td>
            <td class="gema-num gema-faint">{{ fecha(p.fecha_fin) }}</td>
            <td class="is-num">{{ p.tareas_count }}</td>
            <td>
              <span class="gema-chip" :class="claseEstado(p.estado)">{{ p.estado }}</span>
            </td>
            <td class="is-actions">
              <div class="gema-row gema-row-actions">
                <button class="gema-btn is-sm" type="button" @click.stop="abrirPlan(p)">Abrir</button>
                <button
                  v-if="puedeEliminar"
                  class="gema-btn is-sm is-icon is-danger"
                  type="button"
                  title="Eliminar"
                  @click.stop="eliminarPlan(p)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </gema-tabla>
    </template>

    <!-- ===================== DETALLE / GANTT ===================== -->
    <template v-else>
      <div class="gema-toolbar">
        <button class="gema-btn is-sm" type="button" @click="cerrarPlan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6" /></svg>
          Planes
        </button>

        <span class="gema-h2 gema-plan-titulo">{{ planActivo.nombre }}</span>
        <span class="gema-chip" :class="claseEstado(planActivo.estado)">{{ planActivo.estado }}</span>

        <div class="gema-toolbar-sep"></div>

        <div
          v-if="!esColaboradorPlano"
          class="gema-btn-group"
          title="El plan motivador tiene fechas mas exigentes (con margen), para que el equipo avance mas rapido que el plan real"
        >
          <button class="gema-btn is-sm" :class="{ 'is-active': vistaPlan === 'real' }" type="button" @click="cambiarVista('real')">
            Plan real
          </button>
          <button class="gema-btn is-sm" :class="{ 'is-active': vistaPlan === 'colaborador' }" type="button" @click="cambiarVista('colaborador')">
            Plan motivador
          </button>
        </div>

        <input v-model="fechaCorte" class="gema-input gema-plan-fecha" type="date" @change="cargarGantt" />

        <div class="gema-spacer"></div>

        <button
          v-if="puedeEditar && planActivo.estado === 'borrador' && tareas.length"
          class="gema-btn is-sm is-quiet"
          type="button"
          @click="panelGenerar = true"
        >
          Configurar el plan
        </button>
        <button v-if="puedeEditar && tareas.length" class="gema-btn" type="button" @click="abrirAsignar">
          Asignar responsables
        </button>
        <button
          v-if="puedeEditar && planActivo.estado === 'borrador' && tareas.length"
          class="gema-btn is-primary"
          type="button"
          @click="cambiarEstado('publicado')"
        >
          Publicar
        </button>
        <button v-if="puedeEditar && planActivo.estado === 'publicado'" class="gema-btn" type="button" @click="cambiarEstado('cerrado')">
          Cerrar
        </button>
        <button v-if="puedeEditar && planActivo.estado !== 'borrador'" class="gema-btn is-quiet is-sm" type="button" @click="cambiarEstado('borrador')">
          Volver a borrador
        </button>
      </div>

      <p class="gema-faint gema-plan-vista-nota">
        {{ esColaboradorPlano
          ? 'Estas son las fechas de su plan de trabajo.'
          : (vistaPlan === 'colaborador'
            ? 'Viendo el plan motivador: fechas mas exigentes (con margen), asi el equipo trabaja mas rapido que el plan real.'
            : 'Viendo el plan real: las fechas verdaderas del proyecto.') }}
      </p>

      <!-- Tiles del plan -->
      <div v-if="resumen && tareas.length" class="gema-tiles">
        <div class="gema-tile">
          <div class="gema-tile-label">Paginas del plan</div>
          <div class="gema-tile-value">{{ num(resumen.paginas_plan) }}</div>
          <div class="gema-tile-note">{{ resumen.tareas }} tareas en {{ librosDelPlan }} libro(s)</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Deberia llevar hoy</div>
          <div class="gema-tile-value">{{ num(resumen.paginas_plan_dtd) }}</div>
          <div class="gema-tile-note">plan dia tras dia al {{ fecha(resumen.fecha) }}</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Real</div>
          <div class="gema-tile-value">{{ num(resumen.paginas_real) }}</div>
          <div class="gema-tile-note">{{ num(resumen.horas_real) }} horas hombre</div>
        </div>
        <div class="gema-tile" :class="{ 'is-alerta': resumen.cumplimiento_dtd !== null && resumen.cumplimiento_dtd < 90 }">
          <div class="gema-tile-label">Cumplimiento</div>
          <div class="gema-tile-value">
            {{ resumen.cumplimiento_dtd === null ? '—' : resumen.cumplimiento_dtd + '%' }}
          </div>
          <div class="gema-tile-note">contra el plan a la fecha</div>
        </div>
        <div class="gema-tile" :class="{ 'is-alerta': resumen.sin_asignar > 0 }">
          <div class="gema-tile-label">Sin responsable</div>
          <div class="gema-tile-value">{{ resumen.sin_asignar }}</div>
          <div class="gema-tile-note">de {{ resumen.tareas }} tareas</div>
        </div>
        <div v-if="planActivo.meta_fecha_fin" class="gema-tile" :class="{ 'is-alerta': metaPlanIncumplida }">
          <div class="gema-tile-label">Fin vs meta</div>
          <div class="gema-tile-value">{{ fecha(planActivo.fecha_fin) }}</div>
          <div class="gema-tile-note">meta {{ fecha(planActivo.meta_fecha_fin) }} — {{ metaPlanIncumplida ? 'no alcanza' : 'a tiempo' }}</div>
        </div>
      </div>

      <div v-if="cargandoGantt" class="gema-card gema-empty">Cargando el plan...</div>

      <div v-else-if="!tareas.length && planActivo.estado === 'borrador'" class="gema-card gema-empty gema-plan-cta">
        <p class="gema-h2">Este plan todavia no tiene tareas</p>
        <p class="gema-faint">Defina calendario, productividad y libros, y arme el plan de una vez.</p>
        <button v-if="puedeEditar" class="gema-btn is-primary gema-plan-cta-btn" type="button" @click="panelGenerar = true">
          Configurar el plan
        </button>
      </div>

      <template v-else>
        <div class="gema-row gema-plan-matriz-selector">
          <label class="gema-label">Libro</label>
          <select v-model.number="libroSeleccionado" class="gema-select" @change="cargarMatrizLibro">
            <option v-for="l in librosDelPlanOpciones" :key="l.libro_id" :value="l.libro_id">{{ l.nombre }}</option>
          </select>
          <span class="gema-faint">{{ librosDelPlanOpciones.length }} libro(s) en el plan</span>
        </div>

        <div v-if="cargandoMatriz" class="gema-card gema-empty">Calculando el reparto...</div>

        <template v-else>
          <div v-for="m in matricesDelLibro" :key="m.tarea.plan_tarea_id" class="gema-card gema-plan-matriz-etapa">
            <div class="gema-card-head gema-plan-matriz-cabecera" @click="abrirTarea(m.tarea)">
              <span class="gema-h2">
                <span class="gema-chip" :class="m.tarea.area === 'diseno' ? '' : 'is-accent'">{{ m.tarea.etapa }}</span>
                {{ m.tarea.etapa_nombre }}
              </span>
              <span class="gema-faint">
                {{ fecha(m.tarea.fecha_inicio) }} — {{ fecha(m.tarea.fecha_fin) }} ({{ m.tarea.dias_plan }} dias) ·
                paginas 1–{{ num(m.tarea.paginas_plan) }} ·
                {{ m.tarea.responsables && m.tarea.responsables.length ? m.tarea.responsables.map((r) => r.nombre_completo).join(', ') : 'Sin asignar' }}
              </span>
            </div>
            <div class="gema-table-wrap gema-table-scroll">
              <table class="gema-table">
                <thead>
                  <tr>
                    <th v-for="d in m.lineas[0].dias" :key="d.fecha" class="is-num" style="width: 74px">
                      {{ fecha(d.fecha) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="d in m.lineas[0].dias" :key="d.fecha" class="is-num gema-faint">
                      <template v-if="d.paginas">
                        <span class="gema-plan-desglose-rango">{{ d.desde }}–{{ d.hasta }}</span>
                        <span class="gema-plan-desglose-cant">{{ d.paginas }}</span>
                      </template>
                      <span v-else>—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p v-if="!matricesDelLibro.length" class="gema-faint">Elija un libro para ver su avance dia a dia.</p>
        </template>
      </template>

      <!-- Carga por persona -->
      <section v-if="carga.length" class="gema-card gema-plan-carga">
        <div class="gema-card-head">
          <span class="gema-h2">Carga por colaborador</span>
          <span class="gema-faint">Para detectar sobreasignacion antes de publicar</span>
        </div>
        <div class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th class="is-num" style="width: 80px">Tareas</th>
                <th class="is-num" style="width: 90px">Dias plan</th>
                <th class="is-num" style="width: 100px">Pag. plan</th>
                <th class="is-num" style="width: 100px">Pag. real</th>
                <th style="width: 200px">Ventana</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in carga" :key="c.idusuario">
                <td>{{ c.nombre_completo }}</td>
                <td class="is-num">{{ c.tareas }}</td>
                <td class="is-num">{{ num(c.dias_plan) }}</td>
                <td class="is-num">{{ num(c.paginas_plan) }}</td>
                <td class="is-num">{{ num(c.paginas_real) }}</td>
                <td class="gema-faint gema-num">{{ fecha(c.desde) }} — {{ fecha(c.hasta) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <!-- ===================== PANEL: NUEVO PLAN ===================== -->
    <gema-panel :abierto="panelPlan" titulo="Nuevo plan de produccion" @cerrar="panelPlan = false">
      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="formPlan.nombre" class="gema-input" type="text" placeholder="Ej: Produccion serie Sinapsis 2027" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Inicio *</label>
          <input v-model="formPlan.fecha_inicio" class="gema-input" type="date" />
        </div>

        <div class="gema-field">
          <label class="gema-label">Meta fecha fin</label>
          <input v-model="formPlan.meta_fecha_fin" class="gema-input" type="date" />
          <span class="gema-faint gema-plan-pista">
            Fecha objetivo, para comparar contra lo que de verdad calcule el plan.
          </span>
        </div>
      </div>

      <p class="gema-faint gema-plan-pista">
        El resto — cuantos ciclos, la productividad (plan real y plan
        motivador), si los libros arrancan en paralelo, y cuales libros
        entran — se termina de definir despues, en "Configurar el plan".
      </p>

      <label class="gema-row">
        <input v-model="formPlan.incluye_fines_semana" type="checkbox" />
        <span>Contar sabados y domingos como dias de trabajo</span>
      </label>

      <div class="gema-field">
        <label class="gema-label">Observaciones</label>
        <textarea v-model.trim="formPlan.observaciones" class="gema-textarea" rows="2"></textarea>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelPlan = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarPlan">
          {{ guardando ? 'Creando...' : 'Crear plan' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: CONFIGURAR EL PLAN ===================== -->
    <gema-configurar-plan
      :abierto="panelGenerar"
      :plan-id="planActivo ? planActivo.plan_id : null"
      :plan="planActivo"
      :proceso="procesoDelPlan"
      :libros="opciones.libros"
      :tareas-actuales="tareas"
      :tareas-existentes="tareas.length"
      @cerrar="panelGenerar = false"
      @configurado="alConfigurar"
    />

    <!-- ===================== PANEL: ASIGNAR ===================== -->
    <gema-panel :abierto="panelAsignar" titulo="Asignar responsables" modo="modal" tamano="xl" @cerrar="panelAsignar = false">
      <p class="gema-alert">
        Un libro puede tener mas de un responsable — cada jefe asigna solo las
        columnas de su area. Haga clic en una casilla para elegir de su
        equipo completo.
      </p>

      <div class="gema-table-wrap gema-plan-asignar">
        <table class="gema-table gema-plan-asignar-matriz">
          <thead>
            <tr>
              <th class="gema-plan-asignar-libro-th">Libro</th>
              <th v-for="e in libroEtapaMatriz.etapas" :key="e.etapa_id" style="width: 190px">
                <div class="gema-plan-asignar-col-head">
                  <div>
                    <span class="gema-chip" :class="e.area === 'diseno' ? '' : 'is-accent'">{{ e.etapa }}</span>
                    <span class="gema-faint">{{ e.etapa_nombre }}</span>
                  </div>
                  <button class="gema-plan-asignar-col-btn" type="button" @click="abrirColumnaAsignar(e)">
                    Asignar a todos
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="g in libroEtapaMatriz.grupos">
              <tr :key="'g-' + g.materia" class="gema-plan-asignar-grupo-fila" @click="alternarGrupoAsignar(g.materia)">
                <td :colspan="1 + libroEtapaMatriz.etapas.length" class="gema-plan-asignar-grupo-cabecera">
                  <svg
                    class="gema-plan-asignar-grupo-flecha"
                    :class="{ 'is-colapsado': grupoAsignarColapsado(g.materia) }"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                  <strong>{{ g.materia }}</strong>
                  <span class="gema-faint">({{ g.filas.length }})</span>
                </td>
              </tr>
              <tr :key="'gb-' + g.materia" class="gema-plan-asignar-grupo-bulk">
                <td class="gema-faint is-wrap">Asignar a todo el grupo</td>
                <td v-for="e in libroEtapaMatriz.etapas" :key="e.etapa_id">
                  <button class="gema-plan-asignar-col-btn" type="button" @click="abrirGrupoAsignar(g, e)">
                    + Asignar a todos
                  </button>
                </td>
              </tr>
              <tr v-for="f in (grupoAsignarColapsado(g.materia) ? [] : g.filas)" :key="f.libro_id">
                <td class="is-wrap gema-plan-asignar-libro">{{ f.libro }}</td>
                <td v-for="e in libroEtapaMatriz.etapas" :key="e.etapa_id">
                  <button
                    v-if="f.celdas[e.etapa_id]"
                    class="gema-plan-asignar-celda"
                    type="button"
                    :title="nombresAsignados(f.celdas[e.etapa_id].plan_tarea_id).join(', ') || 'Sin asignar — clic para elegir'"
                    @click="abrirCeldaAsignar(f, e)"
                  >
                    <span v-if="nombresAsignados(f.celdas[e.etapa_id].plan_tarea_id).length">
                      {{ nombresAsignados(f.celdas[e.etapa_id].plan_tarea_id).join(', ') }}
                    </span>
                    <span v-else class="gema-faint">+ Asignar</span>
                  </button>
                  <span v-else class="gema-faint">— no aplica —</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelAsignar = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarAsignaciones">
          {{ guardando ? 'Guardando...' : 'Guardar asignaciones' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: ASIGNAR UNA CASILLA, UN GRUPO O UNA COLUMNA ===================== -->
    <gema-panel
      :abierto="!!celdaAsignar"
      :titulo="celdaAsignarInfo.titulo"
      :subtitulo="celdaAsignarInfo.subtitulo"
      tamano="md"
      @cerrar="celdaAsignar = null"
    >
      <template v-if="celdaAsignar">
        <p v-if="celdaAsignar.modo === 'columna'" class="gema-alert is-warn">
          Esto reemplaza el responsable de <strong>{{ etapaColumnaLibrosCount }} libro(s)</strong> en
          {{ celdaAsignar.etapa_nombre }}. Con una persona marcada, va en los
          {{ etapaColumnaLibrosCount }}; con varias, los libros se
          <strong>reparten entre ellas</strong> (uno por persona, en orden) —
          no se mete a todas juntas en cada libro. Si un libro puntual necesita
          dos personas trabajando juntas, ajústelo despues clic por clic.
        </p>
        <p v-else-if="celdaAsignar.modo === 'grupo'" class="gema-alert is-warn">
          Esto reemplaza el responsable de los <strong>{{ etapaGrupoLibrosCount }} libro(s) de {{ celdaAsignar.materia }}</strong>
          en {{ celdaAsignar.etapa_nombre }} — no toca otras materias. Con una
          persona marcada, va en todos esos libros; con varias, se
          <strong>reparten entre ellas</strong> (uno por persona, en orden). Si
          un libro puntual necesita dos personas trabajando juntas, ajústelo
          despues clic por clic.
        </p>

        <div class="gema-search gema-plan-asignar-buscar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
          </svg>
          <input v-model="celdaAsignarBusqueda" class="gema-input" type="text" placeholder="Buscar por nombre..." />
        </div>

        <label v-for="p in personasFiltradasParaCelda" :key="p.idusuario" class="gema-row gema-plan-asignar-opcion">
          <input v-model="celdaAsignarSeleccion" type="checkbox" :value="p.idusuario" />
          <span>{{ p.nombre_completo }}</span>
        </label>
        <p v-if="!personasPara(celdaAsignar.area).length" class="gema-faint">
          No hay colaboradores disponibles para esta area.
        </p>
        <p v-else-if="!personasFiltradasParaCelda.length" class="gema-faint">
          Nadie coincide con "{{ celdaAsignarBusqueda }}".
        </p>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="celdaAsignar = null">Cancelar</button>
        <button class="gema-btn is-primary" type="button" @click="aplicarCeldaAsignar">
          {{ celdaAsignar && celdaAsignar.modo === 'columna' ? 'Aplicar a toda la columna' : 'Aplicar' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: TAREA ===================== -->
    <gema-panel
      :abierto="!!tareaSel"
      :titulo="tareaSel ? tareaSel.etapa + ' — ' + tareaSel.etapa_nombre : ''"
      :subtitulo="tareaSel ? (tareaSel.libro + (tareaSel.tramo_actual ? ' · va en ' + tareaSel.tramo_actual : '')) : ''"
      ancho
      @cerrar="tareaSel = null"
    >
      <template v-if="tareaSel">
        <template v-if="!editandoTarea">
          <dl class="gema-kv">
            <dt>Area</dt><dd>{{ tareaSel.area }} · ciclo {{ tareaSel.ciclo }}</dd>
            <dt>Responsable(s)</dt>
            <dd>
              {{ tareaSel.responsables && tareaSel.responsables.length
                ? tareaSel.responsables.map((r) => r.nombre_completo).join(', ')
                : 'Sin asignar' }}
            </dd>
            <dt>Personas</dt><dd class="gema-num">{{ tareaSel.personas_asignadas || '—' }}</dd>
            <dt>Ventana</dt>
            <dd class="gema-num">
              {{ fecha(tareaSel.fecha_inicio) }} — {{ fecha(tareaSel.fecha_fin) }} ({{ tareaSel.dias_plan }} dias)
              <span v-if="tareaSel.fecha_fin_original && tareaSel.fecha_fin_original !== tareaSel.fecha_fin" class="gema-faint gema-plan-original">
                plan original: {{ fecha(tareaSel.fecha_fin_original) }}
              </span>
              <span v-if="tareaSel.fecha_fin_colaborador && tareaSel.fecha_fin_colaborador !== tareaSel.fecha_fin" class="gema-faint gema-plan-original">
                fecha que ve el colaborador: {{ fecha(tareaSel.fecha_fin_colaborador) }}
              </span>
            </dd>
            <dt>Plan</dt><dd class="gema-num">{{ num(tareaSel.paginas_plan) }} paginas</dd>
            <dt>A la fecha</dt><dd class="gema-num">{{ num(tareaSel.paginas_plan_dtd) }} paginas</dd>
            <dt>Real</dt>
            <dd class="gema-num" :class="'gema-sem-' + tareaSel.semaforo">
              {{ num(tareaSel.paginas_real) }} paginas
              <template v-if="tareaSel.cumplimiento_dtd !== null">({{ tareaSel.cumplimiento_dtd }}%)</template>
            </dd>
            <dt>Horas hombre</dt><dd class="gema-num">{{ tareaSel.horas_hombre_plan === null ? '—' : num(tareaSel.horas_hombre_plan) }}</dd>
            <dt>Estado</dt><dd>{{ tareaSel.estado }}</dd>
          </dl>

          <button v-if="puedeEditar" class="gema-btn is-sm" type="button" @click="abrirEdicionTarea">
            Editar fechas / paginas / personas
          </button>
        </template>

        <template v-else>
          <div class="gema-grid-2">
            <div class="gema-field">
              <label class="gema-label">Inicio</label>
              <input v-model="formTarea.fecha_inicio" class="gema-input" type="date" />
            </div>
            <div class="gema-field">
              <label class="gema-label">Fin</label>
              <input v-model="formTarea.fecha_fin" class="gema-input" type="date" />
            </div>
          </div>
          <div class="gema-grid-2">
            <div class="gema-field">
              <label class="gema-label">Paginas</label>
              <input v-model.number="formTarea.paginas_plan" class="gema-input" type="number" min="0" step="1" />
            </div>
            <div class="gema-field">
              <label class="gema-label">Personas</label>
              <input v-model.number="formTarea.personas_asignadas" class="gema-input" type="number" min="1" step="1" />
              <span class="gema-faint gema-plan-pista">
                Solo afecta el calculo de horas hombre — esta tarea sigue
                siendo un libro completo de principio a fin, no cambia el
                reparto de dias ni las fechas.
              </span>
            </div>
          </div>
          <div class="gema-row">
            <button class="gema-btn is-sm" type="button" @click="editandoTarea = false">Cancelar</button>
            <button class="gema-btn is-sm is-primary" type="button" :disabled="guardando" @click="guardarTarea">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </template>

        <template v-if="!editandoTarea && desglose.length">
          <span class="gema-eyebrow gema-plan-eyebrow">Avance planificado, dia a dia</span>
          <p class="gema-faint gema-plan-pista">
            Como se reparten las {{ num(tareaSel.paginas_plan) }} paginas del
            libro en los dias de esta etapa, al ritmo configurado.
          </p>
          <div class="gema-table-wrap gema-table-scroll gema-plan-desglose">
            <table class="gema-table">
              <thead>
                <tr>
                  <th v-for="d in desglose[0].dias" :key="d.fecha" class="is-num" style="width: 74px">
                    {{ fecha(d.fecha) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="d in desglose[0].dias" :key="d.fecha" class="is-num gema-faint">
                    <template v-if="d.paginas">
                      <span class="gema-plan-desglose-rango">{{ d.desde }}–{{ d.hasta }}</span>
                      <span class="gema-plan-desglose-cant">{{ d.paginas }}</span>
                    </template>
                    <span v-else>—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <p v-if="tareaSel.justificada && tareaSel.justificacion" class="gema-alert is-warn">
          <strong>Retraso justificado</strong> — {{ tareaSel.justificacion.motivo }}:
          {{ tareaSel.justificacion.comentario }}
        </p>

        <span class="gema-eyebrow gema-plan-eyebrow">Dia no trabajado</span>
        <p class="gema-faint gema-plan-pista">
          Si un dia se perdio (enfermedad, otra actividad), regístrelo aqui: el fin de
          ESTA tarea se corre esos dias, sin tocar las demas.
        </p>
        <div class="gema-grid-2">
          <div class="gema-field">
            <label class="gema-label">Fecha</label>
            <input v-model="formDiaPerdido.fecha" class="gema-input" type="date" />
          </div>
          <div class="gema-field">
            <label class="gema-label">Dias que se pierden</label>
            <input v-model.number="formDiaPerdido.dias_extendidos" class="gema-input" type="number" min="0.5" step="0.5" />
          </div>
        </div>
        <div class="gema-field">
          <label class="gema-label">Motivo</label>
          <select v-model.number="formDiaPerdido.motivo_id" class="gema-select">
            <option :value="null">Sin motivo especifico</option>
            <option v-for="m in opciones.motivos" :key="m.motivo_id" :value="m.motivo_id">{{ m.nombre }}</option>
          </select>
        </div>
        <div class="gema-field">
          <label class="gema-label">Comentario</label>
          <input v-model.trim="formDiaPerdido.comentario" class="gema-input" type="text" maxlength="500" />
        </div>
        <div class="gema-row">
          <button class="gema-btn is-sm" type="button" :disabled="guardandoAjuste" @click="registrarDiaPerdido">
            {{ guardandoAjuste ? 'Registrando...' : 'Registrar dia no trabajado' }}
          </button>
        </div>

        <div v-if="ajustes.length">
          <span class="gema-eyebrow gema-plan-eyebrow">Dias perdidos registrados</span>
          <div class="gema-table-wrap gema-plan-avances">
            <table class="gema-table">
              <thead>
                <tr><th>Fecha</th><th>Motivo</th><th class="is-num" style="width: 60px">Dias</th><th>Comentario</th></tr>
              </thead>
              <tbody>
                <tr v-for="a in ajustes" :key="a.ajuste_id">
                  <td class="gema-num">{{ fecha(a.fecha) }}</td>
                  <td class="gema-faint">{{ a.motivo ? a.motivo.nombre : '—' }}</td>
                  <td class="is-num">{{ num(a.dias_extendidos) }}</td>
                  <td class="is-wrap gema-faint">{{ a.comentario || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="avances.length">
          <span class="gema-eyebrow gema-plan-eyebrow">Avance dia por dia</span>
          <div class="gema-table-wrap gema-plan-avances">
            <table class="gema-table">
              <thead>
                <tr><th>Fecha</th><th>Quien</th><th class="is-num" style="width: 80px">Paginas</th><th class="is-num" style="width: 70px">Horas</th></tr>
              </thead>
              <tbody>
                <tr v-for="a in avances" :key="a.plan_avance_id">
                  <td class="gema-num">{{ fecha(a.fecha) }}</td>
                  <td class="gema-faint">{{ a.usuario ? a.usuario.nombres : '—' }}</td>
                  <td class="is-num">{{ num(a.paginas) }}</td>
                  <td class="is-num">{{ a.horas === null ? '—' : num(a.horas) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p v-else class="gema-faint">Todavia no hay avance registrado en esta tarea.</p>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="tareaSel = null">Cerrar</button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="plan_produccion" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'
import GemaConfigurarPlan from './componentes/GemaConfigurarPlan.vue'

const ESTADOS = {
  borrador:  'is-gris',
  publicado: 'is-verde',
  cerrado:   ''
}

export default {
  name: 'GemaPlanProduccion',

  components: { GemaTabla, GemaPanel, GemaSiguiente, GemaConfigurarPlan },

  data () {
    return {
      cargando: true,
      cargandoGantt: false,
      guardando: false,
      planes: [],
      planActivo: null,
      tareas: [],
      resumen: null,
      carga: [],
      opciones: { procesos: [], libros: [], personas: [], motivos: [], mi_alcance_tdp: null },
      fechaCorte: new Date().toISOString().slice(0, 10),
      libroSeleccionado: null,
      matricesDelLibro: [],
      cargandoMatriz: false,
      // Un colaborador raso arranca (y se queda) en el plan motivador — el
      // backend lo fuerza igual aunque se le mande "real" por la URL.
      vistaPlan: (sesion.state.usuario && sesion.state.usuario.perfil && sesion.state.usuario.perfil.codigo === 'colaborador')
        ? 'colaborador'
        : 'real',
      panelPlan: false,
      panelGenerar: false,
      panelAsignar: false,
      borradorAsignacion: {},
      celdaAsignar: null,
      celdaAsignarSeleccion: [],
      celdaAsignarBusqueda: '',
      gruposAsignarColapsados: {},
      tareaSel: null,
      avances: [],
      ajustes: [],
      desglose: [],
      editandoTarea: false,
      formTarea: {},
      formDiaPerdido: this.diaPerdidoVacio(),
      guardandoAjuste: false,
      formPlan: this.planVacio(),
      errores: {},
      columnasPlanes: [
        { clave: 'nombre', titulo: 'Plan' },
        { clave: 'fecha_inicio', titulo: 'Inicio', ancho: '104px' },
        { clave: 'fecha_fin', titulo: 'Fin previsto', ancho: '110px' },
        { clave: 'tareas_count', titulo: 'Tareas', numerica: true, ancho: '76px' },
        { clave: 'estado', titulo: 'Estado', ancho: '100px' },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('plan_produccion', 'crear') },
    puedeEditar () { return sesion.puede('plan_produccion', 'editar') },
    puedeEliminar () { return sesion.puede('plan_produccion', 'eliminar') },

    /** Un colaborador raso nunca ve el plan real, solo el motivador — el toggle ni se le muestra. */
    esColaboradorPlano () {
      const u = sesion.state.usuario
      return !!(u && u.perfil && u.perfil.codigo === 'colaborador')
    },

    /** El equipo de la casilla que se esta asignando, filtrado por lo que se escriba en el buscador. */
    personasFiltradasParaCelda () {
      if (!this.celdaAsignar) return []

      const texto = this.celdaAsignarBusqueda.trim().toLowerCase()
      const personas = this.personasPara(this.celdaAsignar.area)

      if (!texto) return personas

      return personas.filter((p) => p.nombre_completo.toLowerCase().includes(texto))
    },

    librosDelPlan () {
      return new Set(this.tareas.map((t) => t.libro_id)).size
    },

    /** Libros unicos del plan, para el selector de la matriz dia a dia. */
    librosDelPlanOpciones () {
      const vistos = new Map()

      this.tareas.forEach((t) => {
        if (!vistos.has(t.libro_id)) vistos.set(t.libro_id, { libro_id: t.libro_id, nombre: t.libro })
      })

      return Array.from(vistos.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
    },

    metaPlanIncumplida () {
      if (!this.planActivo || !this.planActivo.meta_fecha_fin || !this.planActivo.fecha_fin) return false
      return String(this.planActivo.fecha_fin).slice(0, 10) > String(this.planActivo.meta_fecha_fin).slice(0, 10)
    },

    procesoDelPlan () {
      if (!this.planActivo) return null
      return this.opciones.procesos.find((p) => p.proceso_id === this.planActivo.proceso_id) || null
    },

    tareasAsignables () {
      return this.tareas
    },

    /** Las tareas asignables, agrupadas por etapa — solo para sacar las
     * columnas de la matriz de abajo (una columna por etapa que el plan
     * tenga), en el orden en que ya vienen las tareas. */
    gruposEtapa () {
      const mapa = new Map()

      this.tareasAsignables.forEach((t) => {
        if (!mapa.has(t.etapa_id)) {
          mapa.set(t.etapa_id, {
            etapa_id: t.etapa_id,
            etapa: t.etapa,
            etapa_nombre: t.etapa_nombre,
            area: t.area,
            tdp_id: t.etapa_tdp_id,
            tareas: []
          })
        }
        mapa.get(t.etapa_id).tareas.push(t)
      })

      return Array.from(mapa.values())
    },

    /**
     * Matriz de asignacion: filas = libros, columnas = etapas. El plan es
     * para TODOS los libros a la vez — cada libro puede necesitar gente
     * distinta en cada etapa, por eso se elige libro por libro (nunca "toda
     * la etapa de una sola vez"), con el equipo completo de esa area siempre
     * disponible para elegir.
     */
    libroEtapaMatriz () {
      const etapas = this.gruposEtapa.map((g) => ({
        etapa_id: g.etapa_id, etapa: g.etapa, etapa_nombre: g.etapa_nombre, area: g.area, tdp_id: g.tdp_id
      }))

      const libros = new Map()
      this.tareasAsignables.forEach((t) => {
        if (!libros.has(t.libro_id)) {
          libros.set(t.libro_id, { libro_id: t.libro_id, libro: t.libro, materia: t.materia || 'Sin materia', celdas: {} })
        }
        libros.get(t.libro_id).celdas[t.etapa_id] = t
      })

      const filas = Array.from(libros.values()).sort((a, b) => a.libro.localeCompare(b.libro))

      // Agrupadas por materia (Lengua, Matematica...) — 36 libros en una sola
      // lista sin separar no es manejable; asi se puede colapsar lo que no
      // se esta usando, igual que ya se hace en "Libros a producir".
      const porMateria = new Map()
      filas.forEach((f) => {
        if (!porMateria.has(f.materia)) porMateria.set(f.materia, [])
        porMateria.get(f.materia).push(f)
      })
      const grupos = Array.from(porMateria.entries())
        .map(([materia, filasGrupo]) => ({ materia, filas: filasGrupo }))
        .sort((a, b) => a.materia.localeCompare(b.materia))

      return { etapas, filas, grupos }
    },

    /** Cuantos libros tienen esa etapa — para el aviso del panel "asignar a toda la columna". */
    etapaColumnaLibrosCount () {
      if (!this.celdaAsignar || this.celdaAsignar.modo !== 'columna') return 0

      return this.libroEtapaMatriz.filas.filter((f) => !!f.celdas[this.celdaAsignar.etapa_id]).length
    },

    /** Cuantos libros de ESA materia tienen esa etapa — para el aviso del panel "asignar a todo el grupo". */
    etapaGrupoLibrosCount () {
      if (!this.celdaAsignar || this.celdaAsignar.modo !== 'grupo') return 0

      const grupo = this.libroEtapaMatriz.grupos.find((g) => g.materia === this.celdaAsignar.materia)

      return grupo ? grupo.filas.filter((f) => !!f.celdas[this.celdaAsignar.etapa_id]).length : 0
    },

    /** Titulo/subtitulo del panel de asignar, segun si es una casilla, un grupo (materia) o una columna entera. */
    celdaAsignarInfo () {
      if (!this.celdaAsignar) return { titulo: '', subtitulo: '' }

      if (this.celdaAsignar.modo === 'columna') {
        return { titulo: 'Asignar a toda la columna', subtitulo: this.celdaAsignar.etapa + ' — todos los libros' }
      }

      if (this.celdaAsignar.modo === 'grupo') {
        return { titulo: 'Asignar a todo el grupo', subtitulo: this.celdaAsignar.etapa + ' — ' + this.celdaAsignar.materia }
      }

      return { titulo: 'Asignar responsable(s)', subtitulo: this.celdaAsignar.libro + ' · ' + this.celdaAsignar.etapa }
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    planVacio () {
      return {
        nombre: '',
        fecha_inicio: new Date().toISOString().slice(0, 10),
        meta_fecha_fin: '',
        incluye_fines_semana: false,
        observaciones: ''
      }
    },

    num (v) {
      return (Number(v) || 0).toLocaleString('es-EC', { maximumFractionDigits: 2 })
    },

    fecha (v) {
      if (!v) return '—'

      return String(v).slice(0, 10).split('-').reverse().join('/')
    },

    claseEstado (estado) {
      return ESTADOS[estado] || ''
    },

    /**
     * Personas candidatas para una etapa. Se filtra por la unidad que ejecuta esa
     * area (Redaccion tdp 6, Diseno tdp 7); si no hay nadie con esa unidad se
     * ofrecen todas, para no bloquear la asignacion.
     */
    personasPara (area) {
      const proceso = this.opciones.procesos.find((p) => this.planActivo && p.proceso_id === this.planActivo.proceso_id)
      const etapa = proceso ? (proceso.etapas || []).find((e) => e.area_responsable === area) : null
      const tdp = etapa ? etapa.tdp_id : null

      if (!tdp) return this.opciones.personas

      const delArea = this.opciones.personas.filter((p) => p.tdp_id === tdp)

      return delArea.length ? delArea : this.opciones.personas
    },

    async cargar () {
      this.cargando = true

      try {
        const [planes, opciones] = await Promise.all([
          api.get('planes'),
          api.get('planes/opciones')
        ])

        this.planes = planes.data
        this.opciones = opciones.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    // ------------------------------------------------------------------ plan
    nuevoPlan () {
      this.formPlan = this.planVacio()
      this.errores = {}
      this.panelPlan = true
    },

    async guardarPlan () {
      this.guardando = true
      this.errores = {}

      try {
        const r = await api.post('planes', this.formPlan)
        this.panelPlan = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        await this.cargar()
        this.abrirPlan(r.data)
      } catch (e) {
        if (e.errores) {
          const errores = {}
          Object.keys(e.errores).forEach((c) => { errores[c] = e.errores[c][0] })
          this.errores = errores
        }
        this.$vs.notify({ title: 'No se pudo crear', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    eliminarPlan (plan) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar plan',
        text: `Se eliminara "${plan.nombre}" con todas sus tareas.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`planes/${plan.plan_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'No se elimino', text: e.message, color: 'danger' })
          }
        }
      })
    },

    abrirPlan (plan) {
      this.planActivo = plan
      this.tareaSel = null
      this.cargarGantt()
    },

    cerrarPlan () {
      this.planActivo = null
      this.tareas = []
      this.resumen = null
      this.carga = []
      this.cargar()
    },

    async cargarGantt () {
      if (!this.planActivo) return

      this.cargandoGantt = true

      try {
        const r = await api.get(`planes/${this.planActivo.plan_id}/gantt`, {
          fecha: this.fechaCorte,
          vista: this.vistaPlan
        })

        this.tareas = r.data.tareas
        this.resumen = r.data.resumen
        this.carga = r.data.carga
        this.planActivo = r.data.plan

        // Si el libro elegido ya no esta en el plan (o no habia ninguno), se
        // arranca con el primero — asi la matriz siempre tiene algo que mostrar.
        if (!this.libroSeleccionado || !this.tareas.some((t) => t.libro_id === this.libroSeleccionado)) {
          const opciones = this.librosDelPlanOpciones
          this.libroSeleccionado = opciones.length ? opciones[0].libro_id : null
        }

        await this.cargarMatrizLibro()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargandoGantt = false
      }
    },

    /** Reparto dia a dia por linea del libro elegido: una llamada por etapa que tenga. */
    async cargarMatrizLibro () {
      if (!this.libroSeleccionado) {
        this.matricesDelLibro = []
        return
      }

      const tareasLibro = this.tareas
        .filter((t) => t.libro_id === this.libroSeleccionado)
        .slice()
        .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio))

      this.cargandoMatriz = true

      try {
        const resultados = await Promise.all(
          tareasLibro.map((t) => api.get(`planes/tareas/${t.plan_tarea_id}/desglose`).then((r) => ({ tarea: t, lineas: r.data })))
        )
        this.matricesDelLibro = resultados.filter((m) => m.lineas && m.lineas.length)
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo calcular el reparto', text: e.message, color: 'danger' })
      } finally {
        this.cargandoMatriz = false
      }
    },

    cambiarVista (vista) {
      this.vistaPlan = vista
      this.cargarGantt()
    },

    async cambiarEstado (estado, confirmarIncompleto) {
      try {
        const r = await api.post(`planes/${this.planActivo.plan_id}/estado`, {
          estado,
          confirmar_incompleto: confirmarIncompleto || false
        })
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargarGantt()
      } catch (e) {
        // 409 = hay tareas sin responsable; se avisa pero se deja publicar
        // igual, para no frenar a la unidad que ya esta lista por la que no.
        if (e.status === 409) {
          this.$vs.dialog({
            type: 'confirm',
            color: 'warning',
            title: 'Hay tareas sin responsable',
            text: e.message,
            acceptText: 'Publicar de todos modos',
            cancelText: 'Cancelar',
            accept: () => this.cambiarEstado(estado, true)
          })
        } else {
          this.$vs.notify({ title: 'No se pudo cambiar', text: e.message, color: 'danger' })
        }
      }
    },

    // -------------------------------------------------------------- generar
    /** El componente de configuracion ya hizo todo (libros, calendario, generar). */
    async alConfigurar () {
      this.panelGenerar = false
      await this.cargarGantt()
    },

    // -------------------------------------------------------------- asignar
    abrirAsignar () {
      const borrador = {}
      this.tareas.forEach((t) => {
        // idusuarios (nuevo, varios) si vino; si no, el idusuario suelto de siempre.
        borrador[t.plan_tarea_id] = t.idusuarios && t.idusuarios.length
          ? [...t.idusuarios]
          : (t.idusuario ? [t.idusuario] : [])
      })
      this.borradorAsignacion = borrador
      this.panelAsignar = true
    },

    /** Nombres cortos (solo el primero) de los responsables ya elegidos para una tarea, para la casilla compacta. */
    nombresAsignados (tareaId) {
      const idusuarios = this.borradorAsignacion[tareaId] || []

      return idusuarios
        .map((id) => {
          const p = this.opciones.personas.find((x) => x.idusuario === id)
          return p ? p.nombre_completo.split(' ')[0] : null
        })
        .filter(Boolean)
    },

    grupoAsignarColapsado (materia) {
      return !!this.gruposAsignarColapsados[materia]
    },

    alternarGrupoAsignar (materia) {
      this.$set(this.gruposAsignarColapsados, materia, !this.gruposAsignarColapsados[materia])
    },

    /** Abre el selector de UNA sola casilla (libro x etapa) — nada de listas siempre abiertas. */
    abrirCeldaAsignar (fila, etapa) {
      const tarea = fila.celdas[etapa.etapa_id]
      if (!tarea) return

      this.celdaAsignar = {
        modo: 'celda',
        plan_tarea_id: tarea.plan_tarea_id,
        libro: fila.libro,
        etapa: etapa.etapa,
        area: etapa.area
      }
      this.celdaAsignarSeleccion = [...(this.borradorAsignacion[tarea.plan_tarea_id] || [])]
      this.celdaAsignarBusqueda = ''
    },

    /** Abre el mismo selector pero para TODA la columna de una etapa — el mismo responsable en todos los libros a la vez. */
    abrirColumnaAsignar (etapa) {
      this.celdaAsignar = {
        modo: 'columna',
        etapa_id: etapa.etapa_id,
        etapa: etapa.etapa,
        etapa_nombre: etapa.etapa_nombre,
        area: etapa.area
      }
      this.celdaAsignarSeleccion = []
      this.celdaAsignarBusqueda = ''
    },

    /** Igual que abrirColumnaAsignar, pero solo para los libros de UNA materia — no toca las demas. */
    abrirGrupoAsignar (grupo, etapa) {
      this.celdaAsignar = {
        modo: 'grupo',
        materia: grupo.materia,
        etapa_id: etapa.etapa_id,
        etapa: etapa.etapa,
        etapa_nombre: etapa.etapa_nombre,
        area: etapa.area
      }
      this.celdaAsignarSeleccion = []
      this.celdaAsignarBusqueda = ''
    },

    /** Guarda la seleccion en el borrador (todavia sin mandar al servidor: eso lo hace "Guardar asignaciones"). */
    aplicarCeldaAsignar () {
      if (this.celdaAsignar.modo === 'columna' || this.celdaAsignar.modo === 'grupo') {
        const nuevo = { ...this.borradorAsignacion }

        // "columna" = todos los libros; "grupo" = solo los de esa materia.
        const filasAAplicar = this.celdaAsignar.modo === 'grupo'
          ? (this.libroEtapaMatriz.grupos.find((g) => g.materia === this.celdaAsignar.materia) || { filas: [] }).filas
          : this.libroEtapaMatriz.filas

        // Se REPARTEN los libros entre las personas marcadas (una por libro,
        // en orden) — no se mete a todas juntas en cada libro, porque eso
        // triplicaria la carga de cada una en "Carga por colaborador" en vez
        // de repartirla de verdad. Para que dos personas trabajen JUNTAS un
        // libro puntual, se ajusta esa casilla a mano despues.
        const seleccion = this.celdaAsignarSeleccion
        const tareasDeEtapa = filasAAplicar
          .map((fila) => fila.celdas[this.celdaAsignar.etapa_id])
          .filter(Boolean)

        tareasDeEtapa.forEach((tarea, indice) => {
          nuevo[tarea.plan_tarea_id] = seleccion.length ? [seleccion[indice % seleccion.length]] : []
        })

        this.borradorAsignacion = nuevo
      } else {
        this.borradorAsignacion = {
          ...this.borradorAsignacion,
          [this.celdaAsignar.plan_tarea_id]: [...this.celdaAsignarSeleccion]
        }
      }

      this.celdaAsignar = null
    },

    async guardarAsignaciones () {
      this.guardando = true

      const asignaciones = Object.keys(this.borradorAsignacion).map((id) => ({
        plan_tarea_id: Number(id),
        idusuarios: this.borradorAsignacion[id] || []
      }))

      try {
        const r = await api.post(`planes/${this.planActivo.plan_id}/asignar`, { asignaciones })
        this.panelAsignar = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success', time: 6000 })
        this.cargarGantt()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    // ---------------------------------------------------------------- tarea
    diaPerdidoVacio () {
      return {
        fecha: new Date().toISOString().slice(0, 10),
        dias_extendidos: 1,
        motivo_id: null,
        comentario: ''
      }
    },

    async abrirTarea (t) {
      this.tareaSel = t
      this.avances = []
      this.ajustes = []
      this.desglose = []
      this.editandoTarea = false
      this.formDiaPerdido = this.diaPerdidoVacio()

      try {
        const [avances, ajustes, desglose] = await Promise.all([
          api.get(`planes/tareas/${t.plan_tarea_id}/avances`),
          api.get(`planes/tareas/${t.plan_tarea_id}/ajustes`),
          api.get(`planes/tareas/${t.plan_tarea_id}/desglose`)
        ])
        this.avances = avances.data
        this.ajustes = ajustes.data
        this.desglose = desglose.data
      } catch (e) {
        // El detalle es informativo; si falla no se bloquea el panel.
      }
    },

    abrirEdicionTarea () {
      // Los responsables no se tocan aqui, eso es de "Asignar responsables".
      this.formTarea = {
        fecha_inicio: String(this.tareaSel.fecha_inicio).slice(0, 10),
        fecha_fin: String(this.tareaSel.fecha_fin).slice(0, 10),
        paginas_plan: this.tareaSel.paginas_plan,
        personas_asignadas: this.tareaSel.personas_asignadas || 1
      }
      this.editandoTarea = true
    },

    async guardarTarea () {
      this.guardando = true

      try {
        const r = await api.put(`planes/${this.planActivo.plan_id}/tareas/${this.tareaSel.plan_tarea_id}`, this.formTarea)
        this.editandoTarea = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        await this.cargarGantt()
        this.tareaSel = this.tareas.find((t) => t.plan_tarea_id === this.tareaSel.plan_tarea_id) || null
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    async registrarDiaPerdido () {
      this.guardandoAjuste = true

      try {
        const r = await api.post(`planes/tareas/${this.tareaSel.plan_tarea_id}/dia-perdido`, this.formDiaPerdido)
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success', time: 6000 })
        this.formDiaPerdido = this.diaPerdidoVacio()
        await this.cargarGantt()
        this.tareaSel = this.tareas.find((t) => t.plan_tarea_id === this.tareaSel.plan_tarea_id) || null
        const aj = await api.get(`planes/tareas/${this.tareaSel.plan_tarea_id}/ajustes`)
        this.ajustes = aj.data
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo registrar', text: e.message, color: 'danger' })
      } finally {
        this.guardandoAjuste = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-plan-titulo { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gema-plan-fecha { width: 132px; }
.gema-plan-pista { font-size: var(--gema-fs-xs); line-height: 1.4; }
.gema-plan-mini { min-height: 46px; width: 100%; }
.gema-plan-carga { margin-top: var(--gema-u3); }
.gema-plan-vista-nota { margin: 0 0 var(--gema-u2); font-size: var(--gema-fs-xs); }
.gema-plan-asignar { max-height: 500px; overflow-y: auto; }
.gema-plan-asignar-libro { min-width: 200px; font-weight: 600; }
.gema-plan-asignar-libro-th { min-width: 200px; }
// Los <th> de GEMA son white-space:nowrap por defecto; aqui se necesita que
// el nombre de la etapa (puede ser largo, ej. "Redaccion ciclo 2") y el boton
// de abajo quiebren en su propia linea, no que se compriman en una sola.
.gema-plan-asignar-col-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  white-space: normal;
}

.gema-plan-asignar-col-btn {
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: normal;
  color: var(--gema-accent);
  cursor: pointer;
}
.gema-plan-asignar-col-btn:hover { text-decoration: underline; }

.gema-plan-asignar-grupo-fila { cursor: pointer; background: var(--gema-surface-2); }
.gema-plan-asignar-grupo-fila:hover td { background: var(--gema-surface-3); }
.gema-plan-asignar-grupo-cabecera { display: flex; align-items: center; gap: var(--gema-u2); }
.gema-plan-asignar-grupo-flecha {
  width: 16px;
  height: 16px;
  flex: none;
  transition: transform 0.12s ease;
}
.gema-plan-asignar-grupo-flecha.is-colapsado { transform: rotate(0deg); }
.gema-plan-asignar-grupo-flecha:not(.is-colapsado) { transform: rotate(90deg); }
.gema-plan-asignar-grupo-bulk td { background: var(--gema-surface-2); border-bottom: 1px dashed var(--gema-border); padding-top: 4px; padding-bottom: 4px; }

.gema-plan-asignar-celda {
  display: block;
  width: 100%;
  min-height: 32px;
  padding: 5px 7px;
  border: 1px dashed transparent;
  border-radius: var(--gema-radius-sm, 4px);
  background: none;
  font: inherit;
  text-align: left;
  color: var(--gema-text);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gema-plan-asignar-celda:hover,
.gema-plan-asignar-celda:focus-visible {
  border-color: var(--gema-border);
  background: var(--gema-surface-2);
}

.gema-plan-asignar-opcion { padding: var(--gema-u) 0; cursor: pointer; }
.gema-plan-asignar-buscar { margin-bottom: var(--gema-u2); }
.gema-plan-avances { margin-top: 3px; }
.gema-plan-desglose { margin-top: 3px; max-height: 260px; }
.gema-plan-desglose-rango { display: block; font-size: 10px; }
.gema-plan-desglose-cant { display: block; font-weight: 600; color: var(--gema-text); }

.gema-plan-matriz-selector { align-items: center; margin-bottom: var(--gema-u3); }
.gema-plan-matriz-selector select { max-width: 360px; }
.gema-plan-matriz-etapa { margin-bottom: var(--gema-u3); overflow: hidden; }
.gema-plan-matriz-cabecera { cursor: pointer; flex-wrap: wrap; row-gap: 4px; }
.gema-plan-matriz-cabecera:hover { background: var(--gema-surface-3); }
.gema-plan-original { display: block; font-size: var(--gema-fs-xs); }
.gema-plan-eyebrow { display: block; margin-top: var(--gema-u3); }

.gema-plan-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gema-u2);
  padding: var(--gema-u6) var(--gema-u3);
}

.gema-plan-cta-btn { height: 40px; padding: 0 var(--gema-u4); font-size: var(--gema-fs-md); margin-top: var(--gema-u2); }
</style>
