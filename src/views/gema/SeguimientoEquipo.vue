<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-btn-group">
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'colaborador' }" type="button" @click="vista = 'colaborador'">
          Por colaborador
        </button>
        <button class="gema-btn is-sm" :class="{ 'is-active': vista === 'diario' }" type="button" @click="cambiarVista('diario')">
          Control diario
        </button>
      </div>
      <span class="gema-faint gema-seg-vista-nota">
        {{ vista === 'diario'
          ? 'Lo que deberia y lo que de verdad esta pasando hoy, en todos sus planes a la vez.'
          : 'Cuanto deberia llevar y cuanto lleva cada colaborador, plan por plan.' }}
      </span>
    </div>

    <template v-if="vista === 'colaborador'">
    <div class="gema-toolbar">
      <select v-model.number="planId" class="gema-select gema-seg-plan" @change="cargar">
        <option :value="null" disabled>Elija un plan...</option>
        <option v-for="p in planes" :key="p.plan_id" :value="p.plan_id">
          {{ p.nombre }} ({{ p.estado }})
        </option>
      </select>

      <input v-model="fecha" class="gema-input gema-seg-fecha" type="date" @change="cargar" />

      <div class="gema-toolbar-sep"></div>

      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar colaborador..." />
      </div>

      <label class="gema-row gema-seg-check">
        <input v-model="soloRojos" type="checkbox" />
        <span class="gema-muted">Solo con retraso</span>
      </label>

      <div class="gema-spacer"></div>
      <button class="gema-btn is-sm" type="button" :disabled="!planId" @click="cargar">Actualizar</button>
    </div>

    <div v-if="!planId" class="gema-card gema-empty">
      <div class="gema-empty-title">Elija un plan</div>
      Aqui se ve, colaborador por colaborador, cuanto deberia llevar y cuanto lleva.
    </div>

    <div v-else-if="cargando" class="gema-card gema-empty">Cargando el seguimiento...</div>

    <template v-else>
      <div v-if="resumen" class="gema-tiles">
        <div class="gema-tile">
          <div class="gema-tile-label">Colaboradores</div>
          <div class="gema-tile-value">{{ personas.length }}</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Deberian llevar</div>
          <div class="gema-tile-value">{{ num(resumen.paginas_plan_dtd) }}</div>
          <div class="gema-tile-note">paginas al {{ fmt(resumen.fecha) }}</div>
        </div>
        <div class="gema-tile">
          <div class="gema-tile-label">Llevan</div>
          <div class="gema-tile-value">{{ num(resumen.paginas_real) }}</div>
        </div>
        <div class="gema-tile" :class="{ 'is-alerta': totalRojos > 0 }">
          <div class="gema-tile-label">Tareas en rojo</div>
          <div class="gema-tile-value">{{ totalRojos }}</div>
          <div class="gema-tile-note">{{ totalJustificadas }} ya justificadas</div>
        </div>
      </div>

      <p class="gema-alert gema-seg-ayuda">
        Un rojo no siempre es bajo rendimiento. Abra el colaborador: se listan las
        <strong>otras actividades</strong> que registro en el periodo. Si eso explica
        el retraso, justifiquelo y deja de contar como incumplimiento.
      </p>

      <div v-if="!visibles.length" class="gema-card gema-empty">
        <div class="gema-empty-title">Sin colaboradores que mostrar</div>
        Revise los filtros, o asigne responsables a las tareas del plan.
      </div>

      <!-- Una tarjeta por colaborador -->
      <section v-for="p in visibles" :key="p.idusuario" class="gema-card gema-seg-persona">
        <header class="gema-card-head">
          <div class="gema-row">
            <span class="gema-h2">{{ p.nombre }}</span>
            <span v-if="p.en_rojo" class="gema-chip is-rojo">{{ p.en_rojo }} en rojo</span>
            <span v-if="p.justificadas" class="gema-chip is-ambar">{{ p.justificadas }} justificadas</span>
          </div>

          <div class="gema-row gema-seg-cifras">
            <span class="gema-faint">Deberia: <b class="gema-num">{{ num(p.paginas_plan_dtd) }}</b></span>
            <span class="gema-faint">Lleva: <b class="gema-num">{{ num(p.paginas_real) }}</b></span>
            <span
              class="gema-chip"
              :class="p.cumplimiento_dtd === null ? 'is-gris' : (p.cumplimiento_dtd >= 100 ? 'is-verde' : (p.cumplimiento_dtd >= 90 ? 'is-ambar' : 'is-rojo'))"
            >
              {{ p.cumplimiento_dtd === null ? 'sin plan' : p.cumplimiento_dtd + '%' }}
            </span>
          </div>
        </header>

        <!-- Otras actividades: la explicacion mas frecuente de un rojo -->
        <div v-if="p.otras_actividades.length" class="gema-seg-otras">
          <span class="gema-eyebrow">Otras actividades que registro en el periodo</span>
          <div class="gema-seg-chips">
            <span v-for="(a, i) in p.otras_actividades" :key="i" class="gema-chip">
              {{ a.categoria }} · {{ num(a.horas) }} h · {{ a.registros }} reg.
            </span>
          </div>
        </div>

        <div class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th>Libro · Unidad</th>
                <th style="width: 60px">Etapa</th>
                <th style="width: 168px">Ventana</th>
                <th class="is-num" style="width: 74px">Plan</th>
                <th class="is-num" style="width: 74px">A hoy</th>
                <th class="is-num" style="width: 74px">Real</th>
                <th style="width: 120px">Estado</th>
                <th class="is-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in tareasVisibles(p)" :key="t.plan_tarea_id">
                <td class="is-wrap">{{ t.libro }}<span v-if="t.tramo_actual" class="gema-faint"> · va en {{ t.tramo_actual }}</span></td>
                <td><span class="gema-chip">{{ t.etapa }}</span></td>
                <td class="gema-faint gema-num">{{ fmt(t.fecha_inicio) }} — {{ fmt(t.fecha_fin) }}</td>
                <td class="is-num">{{ num(t.paginas_plan) }}</td>
                <td class="is-num gema-faint">{{ num(t.paginas_plan_dtd) }}</td>
                <td class="is-num" :class="'gema-sem-' + t.semaforo"><b>{{ num(t.paginas_real) }}</b></td>
                <td>
                  <span class="gema-row">
                    <span class="gema-dot" :class="'is-' + t.semaforo"></span>
                    <span v-if="t.justificada" class="gema-chip is-ambar" :title="t.justificacion ? t.justificacion.comentario : ''">
                      {{ t.justificacion && t.justificacion.motivo ? t.justificacion.motivo : 'justificada' }}
                    </span>
                    <span v-else class="gema-faint gema-seg-estado">{{ t.estado }}</span>
                  </span>
                </td>
                <td class="is-actions">
                  <div class="gema-row gema-row-actions">
                    <button
                      v-if="puedeJustificar && t.semaforo === 'rojo' && !t.justificada"
                      class="gema-btn is-sm"
                      type="button"
                      @click="abrirJustificar(p, t)"
                    >
                      Justificar
                    </button>
                    <button class="gema-btn is-sm is-quiet" type="button" @click="verAvances(t)">Detalle</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
    </template>

    <!-- ===================== CONTROL DIARIO ===================== -->
    <template v-else>
      <div class="gema-toolbar">
        <input v-model="fechaDiario" class="gema-input gema-seg-fecha" type="date" @change="cargarDiario" />

        <select v-model="filtroArea" class="gema-select gema-seg-filtro" @change="cargarDiario">
          <option value="">Toda area</option>
          <option v-for="a in areasDisponibles" :key="a" :value="a">{{ a }}</option>
        </select>

        <select v-model.number="filtroLibro" class="gema-select gema-seg-filtro" @change="cargarDiario">
          <option :value="null">Todo libro</option>
          <option v-for="l in opciones.libros" :key="l.libro_id" :value="l.libro_id">{{ l.nombre }}</option>
        </select>

        <select v-model.number="filtroColaborador" class="gema-select gema-seg-filtro" @change="cargarDiario">
          <option :value="null">Todo colaborador</option>
          <option v-for="p in opciones.personas" :key="p.idusuario" :value="p.idusuario">{{ p.nombre_completo }}</option>
        </select>

        <div class="gema-spacer"></div>
        <button class="gema-btn is-sm" type="button" @click="cargarDiario">Actualizar</button>
      </div>

      <div v-if="cargandoDiario" class="gema-card gema-empty">Calculando el dia...</div>

      <template v-else>
        <!-- Tiles del dia -->
        <div class="gema-tiles">
          <div class="gema-tile">
            <div class="gema-tile-label">Paginas plan hoy</div>
            <div class="gema-tile-value">{{ num(diario.resumen.paginas_plan) }}</div>
          </div>
          <div class="gema-tile">
            <div class="gema-tile-label">Paginas real hoy</div>
            <div class="gema-tile-value">{{ num(diario.resumen.paginas_real) }}</div>
          </div>
          <div class="gema-tile">
            <div class="gema-tile-label">Productividad real</div>
            <div class="gema-tile-value">{{ num(diario.resumen.productividad_real) }}</div>
            <div class="gema-tile-note">paginas / colaborador, {{ diario.resumen.colaboradores }} reportaron</div>
          </div>
          <div class="gema-tile">
            <div class="gema-tile-label">Horas promedio hoy</div>
            <div class="gema-tile-value">{{ num(diario.horas.promedio) }}</div>
            <div class="gema-tile-note">de {{ diario.horas.colaboradores.length }} colaborador(es)</div>
          </div>
        </div>

        <!-- Plan de produccion de hoy -->
        <section class="gema-card gema-seg-diario-tabla">
          <div class="gema-card-head"><span class="gema-h2">Plan de produccion — hoy</span></div>
          <div v-if="!diario.filas_plan.length" class="gema-faint gema-seg-diario-vacio">Nadie tiene tarea activa hoy con estos filtros.</div>
          <div v-else class="gema-table-scroll">
            <table class="gema-table">
              <thead>
                <tr>
                  <th>Area</th><th>Grado</th><th class="is-wrap">Libro</th><th style="width: 50px">Etapa</th>
                  <th class="is-num" style="width: 110px">Pag. inicial-final</th>
                  <th class="is-num" style="width: 80px"># paginas</th>
                  <th>Unidad(es)</th>
                  <th class="is-num" style="width: 90px">Meta ajustada</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in diario.filas_plan" :key="'p' + f.plan_tarea_id">
                  <td class="gema-faint">{{ f.area || '—' }}</td>
                  <td class="gema-faint">{{ f.grado || '—' }}</td>
                  <td class="is-wrap">{{ f.libro }}</td>
                  <td><span class="gema-chip">{{ f.etapa }}</span></td>
                  <td class="is-num gema-num">{{ f.desde }}–{{ f.hasta }}</td>
                  <td class="is-num">{{ num(f.paginas) }}</td>
                  <td class="gema-faint">{{ f.unidades.join(', ') || '—' }}</td>
                  <td class="is-num gema-faint" :title="'Sin ajuste: ' + num(f.paginas)">{{ num(f.meta_ajustada) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Real de produccion de hoy -->
        <section class="gema-card gema-seg-diario-tabla">
          <div class="gema-card-head"><span class="gema-h2">Real de produccion — hoy</span></div>
          <div v-if="!diario.filas_real.length" class="gema-faint gema-seg-diario-vacio">Todavia nadie registro avance hoy con estos filtros.</div>
          <div v-else class="gema-table-scroll">
            <table class="gema-table">
              <thead>
                <tr>
                  <th>Area</th><th>Grado</th><th class="is-wrap">Libro</th><th style="width: 50px">Etapa</th>
                  <th class="is-num" style="width: 110px">Pag. inicial-final</th>
                  <th class="is-num" style="width: 80px"># paginas</th>
                  <th>Unidad(es)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in diario.filas_real" :key="'r' + f.plan_tarea_id">
                  <td class="gema-faint">{{ f.area || '—' }}</td>
                  <td class="gema-faint">{{ f.grado || '—' }}</td>
                  <td class="is-wrap">{{ f.libro }}</td>
                  <td><span class="gema-chip">{{ f.etapa }}</span></td>
                  <td class="is-num gema-num">{{ f.desde }}–{{ f.hasta }}</td>
                  <td class="is-num"><b>{{ num(f.paginas) }}</b></td>
                  <td class="gema-faint">{{ f.unidades.join(', ') || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Horas trabajadas hoy -->
        <section v-if="diario.horas.colaboradores.length" class="gema-card gema-seg-diario-tabla">
          <div class="gema-card-head"><span class="gema-h2">Horas trabajadas — hoy</span></div>
          <div class="gema-table-scroll">
            <table class="gema-table">
              <thead><tr><th>Colaborador</th><th class="is-num" style="width: 80px">Horas</th></tr></thead>
              <tbody>
                <tr v-for="h in diario.horas.colaboradores" :key="h.idusuario">
                  <td>{{ h.nombre }}</td>
                  <td class="is-num">{{ num(h.horas) }}</td>
                </tr>
                <tr>
                  <td><b>Promedio</b></td>
                  <td class="is-num"><b>{{ num(diario.horas.promedio) }}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Paginas finalizadas: cola de confirmacion -->
        <section class="gema-card gema-seg-diario-tabla">
          <div class="gema-card-head">
            <span class="gema-h2">Paginas finalizadas</span>
            <span class="gema-faint">Ya llegaron a su meta en la ultima etapa — confirme si de verdad ya se dan por terminadas</span>
          </div>
          <div v-if="!finalizadas.length" class="gema-faint gema-seg-diario-vacio">No hay nada pendiente de confirmar.</div>
          <div v-else class="gema-table-scroll">
            <table class="gema-table">
              <thead>
                <tr>
                  <th>Area</th><th>Grado</th><th class="is-wrap">Libro</th><th style="width: 50px">Etapa</th>
                  <th class="is-num" style="width: 90px">Plan</th><th class="is-num" style="width: 90px">Real</th>
                  <th style="width: 130px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in finalizadas" :key="f.plan_tarea_id">
                  <td class="gema-faint">{{ f.area || '—' }}</td>
                  <td class="gema-faint">{{ f.grado || '—' }}</td>
                  <td class="is-wrap">{{ f.libro }}</td>
                  <td><span class="gema-chip">{{ f.etapa }}</span></td>
                  <td class="is-num">{{ num(f.paginas_plan) }}</td>
                  <td class="is-num">{{ num(f.paginas_real) }}</td>
                  <td>
                    <button class="gema-btn is-sm is-primary" type="button" :disabled="guardando" @click="confirmarFinalizado(f)">
                      Confirmar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Historico dia a dia -->
        <section class="gema-card gema-seg-diario-tabla">
          <div class="gema-card-head"><span class="gema-h2">Registro historico</span><span class="gema-faint">Ultimos {{ historico.dias.length }} dias laborables (esquiva fines de semana y feriados)</span></div>
          <div v-if="!historico.dias.length" class="gema-faint gema-seg-diario-vacio">Sin datos todavia.</div>
          <div v-else class="gema-table-scroll">
            <table class="gema-table gema-seg-historico">
              <thead>
                <tr>
                  <th style="width: 80px">Ciclo</th>
                  <th v-for="d in historico.dias" :key="d.fecha" class="is-num" style="width: 96px">{{ fmt(d.fecha) }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="c in historico.ciclos">
                  <tr :key="c + '-plan'">
                    <td>{{ c }} <span class="gema-faint">plan</span></td>
                    <td v-for="d in historico.dias" :key="d.fecha + '-plan'" class="is-num gema-faint">{{ num(d.ciclos[c].plan) }}</td>
                  </tr>
                  <tr :key="c + '-real'">
                    <td>{{ c }} <span class="gema-faint">real</span></td>
                    <td
                      v-for="d in historico.dias"
                      :key="d.fecha + '-real'"
                      class="is-num"
                      :class="d.ciclos[c].plan > 0 && d.ciclos[c].real < d.ciclos[c].plan ? 'gema-sem-rojo' : 'gema-sem-verde'"
                    >
                      <b>{{ num(d.ciclos[c].real) }}</b>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Resumen de los libros del area -->
        <section class="gema-card gema-seg-diario-tabla">
          <div class="gema-card-head"><span class="gema-h2">Resumen de avance de produccion</span><span class="gema-faint">{{ resumenLibros.length }} libro(s), el mas avanzado primero</span></div>
          <div v-if="!resumenLibros.length" class="gema-faint gema-seg-diario-vacio">Sin libros planificados todavia.</div>
          <div v-else class="gema-table-scroll">
            <table class="gema-table">
              <thead>
                <tr>
                  <th class="is-wrap">Libro</th><th>Grado</th>
                  <th class="is-num" style="width: 130px">C1 (real/plan)</th>
                  <th class="is-num" style="width: 130px">C2 (real/plan)</th>
                  <th class="is-num" style="width: 130px">C3 (real/plan)</th>
                  <th style="width: 90px">Finalizado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="l in resumenLibros" :key="l.libro_id">
                  <td class="is-wrap">{{ l.libro }} <span class="gema-faint">{{ l.area }}</span></td>
                  <td class="gema-faint">{{ l.grado }}</td>
                  <td v-for="c in ['C1', 'C2', 'C3']" :key="c" class="is-num gema-faint">
                    <template v-if="l.ciclos[c]">
                      {{ num(l.ciclos[c].real) }}/{{ num(l.ciclos[c].plan) }}
                      <span v-if="l.delta[c] !== null" :class="l.delta[c] >= 100 ? 'gema-sem-verde' : 'gema-sem-rojo'"> ({{ l.delta[c] }}%)</span>
                    </template>
                    <span v-else>—</span>
                  </td>
                  <td>
                    <span class="gema-chip" :class="l.finalizado ? 'is-verde' : 'is-gris'">{{ l.finalizado ? 'Si' : 'No' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </template>

    <!-- ===================== PANEL: JUSTIFICAR ===================== -->
    <gema-panel
      :abierto="!!justificando"
      titulo="Justificar el retraso"
      :subtitulo="justificando ? justificando.persona.nombre : ''"
      @cerrar="justificando = null"
    >
      <template v-if="justificando">
        <dl class="gema-kv">
          <dt>Tarea</dt><dd>{{ justificando.tarea.libro }} · {{ justificando.tarea.etapa }}</dd>
          <dt>Deberia llevar</dt><dd class="gema-num">{{ num(justificando.tarea.paginas_plan_dtd) }} paginas</dd>
          <dt>Lleva</dt><dd class="gema-num">{{ num(justificando.tarea.paginas_real) }} paginas</dd>
          <dt>Faltan</dt>
          <dd class="gema-num gema-sem-rojo">
            {{ num(justificando.tarea.paginas_plan_dtd - justificando.tarea.paginas_real) }} paginas
          </dd>
        </dl>

        <div v-if="justificando.persona.otras_actividades.length" class="gema-alert">
          <div>
            <strong>En ese periodo tambien registro:</strong>
            <ul class="gema-seg-lista">
              <li v-for="(a, i) in justificando.persona.otras_actividades" :key="i">
                {{ a.categoria }} — {{ num(a.horas) }} horas en {{ a.registros }} registro(s)
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="gema-alert is-warn">
          No registro otras actividades en el periodo. Si el retraso tiene otra causa,
          dejela por escrito abajo.
        </div>

        <div class="gema-field">
          <label class="gema-label">Motivo</label>
          <select v-model.number="formJust.motivo_id" class="gema-select">
            <option :value="null">Sin clasificar</option>
            <option v-for="m in motivos" :key="m.motivo_id" :value="m.motivo_id">
              {{ m.nombre }}<template v-if="m.imputable"> (si cuenta contra el colaborador)</template>
            </option>
          </select>
          <span v-if="motivoElegido && motivoElegido.descripcion" class="gema-faint gema-seg-pista">
            {{ motivoElegido.descripcion }}
          </span>
        </div>

        <div class="gema-field">
          <label class="gema-label">Explicacion *</label>
          <textarea
            v-model.trim="formJust.comentario"
            class="gema-textarea"
            rows="4"
            placeholder="Que paso y por que el retraso no es atribuible al ritmo de trabajo"
          ></textarea>
        </div>

        <div class="gema-field">
          <label class="gema-label">Paginas que se dejan de exigir</label>
          <input v-model.number="formJust.paginas_desvio" class="gema-input" type="number" step="0.5" min="0" />
          <span class="gema-faint gema-seg-pista">Opcional, para dejar constancia del tamano del desvio.</span>
        </div>

        <p class="gema-alert">
          Queda registrado con su nombre y la fecha. La tarea pasa de rojo a ambar.
        </p>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="justificando = null">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="!formJust.comentario || guardando" @click="justificar">
          {{ guardando ? 'Guardando...' : 'Justificar' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL: DETALLE ===================== -->
    <gema-panel :abierto="!!detalleTarea" titulo="Avance dia por dia" @cerrar="detalleTarea = null">
      <template v-if="detalleTarea">
        <dl class="gema-kv">
          <dt>Tarea</dt><dd>{{ detalleTarea.libro }} · {{ detalleTarea.etapa }}</dd>
          <dt>Ventana</dt><dd class="gema-num">{{ fmt(detalleTarea.fecha_inicio) }} — {{ fmt(detalleTarea.fecha_fin) }}</dd>
        </dl>

        <div v-if="avances.length" class="gema-table-wrap">
          <table class="gema-table">
            <thead>
              <tr><th>Fecha</th><th class="is-num" style="width: 80px">Paginas</th><th class="is-num" style="width: 70px">Horas</th><th>Observacion</th></tr>
            </thead>
            <tbody>
              <tr v-for="a in avances" :key="a.plan_avance_id">
                <td class="gema-num">{{ fmt(a.fecha) }}</td>
                <td class="is-num">{{ num(a.paginas) }}</td>
                <td class="is-num">{{ a.horas === null ? '—' : num(a.horas) }}</td>
                <td class="is-wrap gema-faint">{{ a.observacion || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="gema-faint">No hay avance registrado en esta tarea.</p>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="detalleTarea = null">Cerrar</button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="plan_seguimiento" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

export default {
  name: 'GemaSeguimientoEquipo',

  components: { GemaPanel, GemaSiguiente },

  data () {
    return {
      vista: 'colaborador',
      cargando: false,
      guardando: false,
      planes: [],
      planId: null,
      fecha: new Date().toISOString().slice(0, 10),
      filtro: '',
      soloRojos: false,
      personas: [],
      resumen: null,
      motivos: [],
      justificando: null,
      formJust: { motivo_id: null, comentario: '', paginas_desvio: null },
      detalleTarea: null,
      avances: [],

      // ---- Control diario ----
      opciones: { libros: [], personas: [] },
      cargandoDiario: false,
      fechaDiario: new Date().toISOString().slice(0, 10),
      filtroArea: '',
      filtroLibro: null,
      filtroColaborador: null,
      diario: {
        resumen: { paginas_plan: 0, paginas_real: 0, productividad_real: 0, colaboradores: 0 },
        horas: { colaboradores: [], promedio: 0 },
        filas_plan: [],
        filas_real: []
      },
      finalizadas: [],
      historico: { dias: [], ciclos: [] },
      resumenLibros: []
    }
  },

  computed: {
    puedeJustificar () {
      return sesion.puede('plan_seguimiento', 'crear')
    },

    /** Areas de libro que hay en el catalogo, para el filtro del control diario. */
    areasDisponibles () {
      const vistos = new Set()

      this.opciones.libros.forEach((l) => { if (l.area) vistos.add(l.area) })

      return Array.from(vistos).sort()
    },

    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.personas.filter((p) => {
        if (this.soloRojos && !p.en_rojo) return false
        if (!texto) return true

        return p.nombre.toLowerCase().includes(texto)
      })
    },

    totalRojos () {
      return this.personas.reduce((t, p) => t + p.en_rojo, 0)
    },

    totalJustificadas () {
      return this.personas.reduce((t, p) => t + p.justificadas, 0)
    },

    motivoElegido () {
      return this.motivos.find((m) => m.motivo_id === this.formJust.motivo_id)
    }
  },

  created () {
    this.cargarPlanes()
  },

  methods: {
    num (v) {
      return (Number(v) || 0).toLocaleString('es-EC', { maximumFractionDigits: 2 })
    },

    fmt (v) {
      if (!v) return '—'

      return String(v).slice(0, 10).split('-').reverse().join('/')
    },

    tareasVisibles (p) {
      return this.soloRojos ? p.tareas.filter((t) => t.semaforo === 'rojo') : p.tareas
    },

    async cargarPlanes () {
      try {
        const r = await api.get('planes')
        // Solo tiene sentido seguir planes publicados o cerrados.
        this.planes = r.data.filter((p) => p.estado !== 'borrador')

        if (this.planes.length) {
          this.planId = this.planes[0].plan_id
          this.cargar()
        }
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      }
    },

    // ------------------------------------------------------------ control diario
    async cambiarVista (v) {
      this.vista = v

      if (!this.opciones.libros.length) {
        await this.cargarOpciones()
      }

      this.cargarDiario()
    },

    async cargarOpciones () {
      try {
        const r = await api.get('planes/opciones')
        this.opciones = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      }
    },

    /** Trae de una vez las 4 secciones del tablero del lider: hoy, finalizadas, historico y resumen de libros. */
    async cargarDiario () {
      this.cargandoDiario = true

      const filtros = {
        fecha: this.fechaDiario,
        area: this.filtroArea || undefined,
        libro_id: this.filtroLibro || undefined,
        idusuario: this.filtroColaborador || undefined
      }

      try {
        const [diario, finalizadas, historico, resumen] = await Promise.all([
          api.get('planes/control-diario', filtros),
          api.get('planes/control-diario/finalizadas', filtros),
          api.get('planes/control-diario/historico', filtros),
          api.get('planes/control-diario/resumen-libros', filtros)
        ])

        this.diario = diario.data
        this.finalizadas = finalizadas.data
        this.historico = historico.data
        this.resumenLibros = resumen.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargandoDiario = false
      }
    },

    async confirmarFinalizado (fila) {
      this.guardando = true

      try {
        const r = await api.post(`planes/tareas/${fila.plan_tarea_id}/confirmar-finalizado`)
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.finalizadas = this.finalizadas.filter((f) => f.plan_tarea_id !== fila.plan_tarea_id)
        this.cargarDiario()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo confirmar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    async cargar () {
      if (!this.planId) return

      this.cargando = true

      try {
        const r = await api.get(`planes/${this.planId}/seguimiento`, { fecha: this.fecha })
        this.personas = r.data
        this.resumen = r.resumen
        this.motivos = r.motivos || []
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    abrirJustificar (persona, tarea) {
      this.justificando = { persona, tarea }
      this.formJust = {
        motivo_id: this.motivos.length ? this.motivos[0].motivo_id : null,
        comentario: '',
        // Se propone el desvio exacto a la fecha.
        paginas_desvio: Math.max(0, Math.round((tarea.paginas_plan_dtd - tarea.paginas_real) * 100) / 100)
      }
    },

    async justificar () {
      this.guardando = true

      try {
        const r = await api.post(
          `planes/tareas/${this.justificando.tarea.plan_tarea_id}/justificar`,
          this.formJust
        )

        this.justificando = null
        this.$vs.notify({ title: 'Justificado', text: r.message, color: 'success', time: 6000 })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo justificar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    async verAvances (t) {
      this.detalleTarea = t
      this.avances = []

      try {
        const r = await api.get(`planes/tareas/${t.plan_tarea_id}/avances`)
        this.avances = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-seg-plan { width: 260px; }
.gema-seg-fecha { width: 132px; }
.gema-seg-check { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-seg-ayuda { margin: 0 0 var(--gema-u3); }
.gema-seg-persona { margin-bottom: var(--gema-u3); }
.gema-seg-cifras { font-size: var(--gema-fs-sm); gap: var(--gema-u3); }
.gema-seg-estado { font-size: var(--gema-fs-xs); }
.gema-seg-pista { font-size: var(--gema-fs-xs); line-height: 1.4; }

.gema-seg-otras {
  padding: var(--gema-u2) var(--gema-u3);
  border-bottom: 1px solid var(--gema-border);
  background: var(--gema-surface-2);
}

.gema-seg-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gema-u);
  margin-top: 3px;
}

.gema-seg-lista {
  margin: 3px 0 0;
  padding-left: var(--gema-u4);

  li { margin-bottom: 2px; }
}

.gema-seg-vista-nota { font-size: var(--gema-fs-xs); }
.gema-seg-filtro { width: 180px; }
.gema-seg-diario-tabla { margin-bottom: var(--gema-u3); }
.gema-seg-diario-vacio { padding: var(--gema-u3); }
.gema-seg-historico th:first-child { position: sticky; left: 0; z-index: 3; }
.gema-seg-historico td:first-child { position: sticky; left: 0; background: var(--gema-surface-2); }
</style>
