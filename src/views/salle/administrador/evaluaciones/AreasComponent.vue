<template>
<div class="vx-col md:w-full w-full mb-base">
  <vs-popup small title="Sincronizar preguntas" subtitle="Puede cargar las preguntas de otra asignatura en esta." :active.sync="modalSincronizar"><br>
      <div class="vx-col w-full mb-base mt-4">
          Seleccione una asignatura
          <v-select icon-pack="feather" class="mb-6" icon="icon-home" :options="listaAsignaturas" :reduce="listaAsignaturas => listaAsignaturas" label="nombre_asignatura" v-model="asignatura_sinc" placeholder="Seleccione una asignatura"></v-select>
      </div>

      <br><br>
      <div class="mb-6 p-5" style="border-radius: 5px; background-color: #FFE1FB; color: #BF0EA9;">
        Las preguntas de la asignatura <b>{{asign_selec.nombre_asignatura}}</b> serán eliminadas y serán cargadas las preguntas de la
        asignatura <b>{{asignatura_sinc.nombre_asignatura}}</b>
      </div>

      <br>
      <div class="vx-col sm:w-2/3 w-full ml-auto mt-6" align="right">
          <vs-button class="m-1" color="primary" type="border" @click="sincronizarPreguntas();">Sincronizar</vs-button>
          <vs-button class="m-1" color="danger" type="border" @click="modalSincronizar=false">Cancelar</vs-button>
      </div>
  </vs-popup>
  <!--MODAL GUARDAR AREAS-->
  <vs-popup :title="titulo" :active.sync="modalAreas">
      <div class="vx-col sm:w-1/1 w-full mb-4">
          <vs-input class="w-full" type="text" label="Nombre:" icon-pack="feather" icon="icon-type" maxlength="200" icon-no-border v-model="area.nombre_area" />
      </div>
      <div class="vx-col  w-full mb-4">
          <vs-input class="w-full" type="text" label="Descripción:" icon-pack="feather" icon="icon-align-center" maxlength="200" icon-no-border v-model="area.descripcion_area" />
      </div>
      <div class="vx-col w-full mb-4">
        <vs-radio class="m-2" v-model="area.estado" vs-value="1">Activa</vs-radio>
        <vs-radio class="m-2" v-model="area.estado" color="danger" vs-value="0">Bloqueada</vs-radio>
      </div>
      <div class="flex justify-center">
        <p>
          <vs-chip>Evaluación Seleccionada: <b class="ml-1">{{ EvaluacionSelectSalleNombre }}</b></vs-chip>
        </p>
        <br>
      </div>
      <div class="flex justify-center">
          <vs-button class="m-2" color="primary" type="border" @click="agregarEditarArea();">{{txt_boton}}</vs-button>
          <vs-button class="m-2" color="danger" type="border" @click="volver();">Cancelar</vs-button>
      </div>
  </vs-popup>
  <vs-popup :title="titulo" :active.sync="modalAsignaturas">
      <div class="vx-col sm:w-1/1 w-full mb-4">
          <span>Área</span>
          <v-select icon-pack="feather" icon="icon-home" :options="listaAreas" :reduce="listaAreas => listaAreas.id_area" label="nombre_area" v-model="asignatura.id_area" placeholder="Seleccione..."></v-select>
      </div>
      <div class="vx-col sm:w-1/1 w-full mb-4">
          <vs-input class="w-full" type="text" label="Nombre:" icon-pack="feather" icon="icon-type" maxlength="200" icon-no-border v-model="asignatura.nombre_asignatura" />
      </div>
      <div class="vx-col  w-full mb-4">
          <vs-input class="w-full" type="text" label="Descripción:" icon-pack="feather" icon="icon-align-center" maxlength="200" icon-no-border v-model="asignatura.descripcion_asignatura" />
      </div>
      <div class="vx-col sm:w-1/2 w-full mb-4">
          <vs-input class="w-full" type="number" label="Preguntas mínimas para la evaluación:" icon-pack="feather" icon="icon-hash" min="0" max="999" icon-no-border v-model="asignatura.cant_preguntas" />
      </div>
      <div class="vx-col sm:w-1/2 w-full mb-4">
        <vs-radio class="m-2" v-model="asignatura.estado" vs-value="1">Activa</vs-radio>
        <vs-radio class="m-2" v-model="asignatura.estado" color="danger" vs-value="0">Bloqueada</vs-radio>
      </div>
      <div class="flex justify-center">
        <vs-chip>Evaluación Seleccionada: <b class="ml-1">{{ EvaluacionSelectSalleNombre }}</b></vs-chip>
        <br>
      </div>
      <div class="vx-col   w-full mb-4">
          <vs-button class="m-2" color="primary" type="border" @click="agregarEditarAsignatura();">{{txt_boton}}</vs-button>
          <vs-button class="m-2" color="danger" type="border" @click="volver();">Cancelar</vs-button>
      </div>
  </vs-popup>
  <vx-card>
    <vs-tabs alignment="fixed" class="mt-5">
      <vs-tab :label="'Areas ( ' + listaAreas.length +' )'">
        <div class="flex mt-3">
          <vs-button color="primary"  type="border" icon-pack="feather" icon="icon-plus" @click="modalAgregaEdita(0,1);">Agregar</vs-button>
          <p class="exportButton" @click="tipo=0;OpenExportar()"><vs-chip transparent color="success" class="ml-3 cursor-pointer" style="font-size:15px;padding:15px;"><ion-icon name="cloud-download-outline" style="font-size:20px;"></ion-icon> <span class="ml-2">Exportar</span></vs-chip></p>
        </div>
        <vs-table v-model="arregloSelectArea" stripe multiple max-items="20" search pagination :data="listaAreas" style="margin-top:-20px">
          <template slot="thead">
              <vs-th width="40%" sort-key="nombre">Nombre</vs-th>
              <vs-th width="30%" sort-key="descripcion">Descripción</vs-th>
              <vs-th width="20%">Período Evaluación</vs-th>
              <vs-th width="15%" sort-key="estado">Estado</vs-th>
              <vs-th width="15%">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td width="40%">
                  {{data[indextr].nombre_area}}
                </vs-td>
                <vs-td width="30%">
                  {{data[indextr].descripcion_area}}
                </vs-td>
                <vs-td>
                  {{ tr.periodo }}
                </vs-td>
                <vs-td>
                  <vs-chip v-if="data[indextr].estado == 1" size="small">Activa</vs-chip>
                  <vs-chip v-if="data[indextr].estado == 0" color="danger" size="small">Bloqueada</vs-chip>
                  <p class="mt-2">
                    <vs-chip color="success" v-if="tr.area_basica == 1">Área Básica</vs-chip>
                  </p>
                </vs-td>
                <vs-td align="center">
                    <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                      <vs-button  v-if="data[indextr].area_basica != '1'" icon-pack="feather" icon="icon-edit" type="line" radius size="large" class="m-1" color="primary" @click="modalAgregaEdita(tr,2);"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="primary">
                      <vs-button  v-if="data[indextr].area_basica != '1'" icon-pack="feather" icon="icon-trash" type="line" radius size="large" class="m-1" color="danger" @click="confirmaEliminar(tr);"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" text="Asignar como área básica" position="top" color="primary">
                      <vs-button  v-if="data[indextr].area_basica == '0'" icon-pack="feather" icon="icon-check" type="line" size="small" class="m-1" color="dark" @click="datoFila=tr;confirmarAsignarAreaBasica(tr);">Asignar</vs-button>
                    </vx-tooltip>
                </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
    <vs-tab :label="'Asignaturas ( ' + listaAsignaturas.length +' )'">
      <div class="flex mt-3">
        <vs-button color="primary"  type="border" icon-pack="feather" icon="icon-plus" @click="modalAgregaEditaAsignatura(0,1);">Agregar</vs-button>
        <p class="exportButton" @click="tipo=1;OpenExportar()"><vs-chip transparent color="success" class="ml-3 cursor-pointer" style="font-size:15px;padding:15px;"><ion-icon name="cloud-download-outline" style="font-size:20px;"></ion-icon> <span class="ml-2">Exportar</span></vs-chip></p>
      </div>
      <vs-table v-model="arregloSelectAsignatura" multiple max-items="20" search pagination :data="listaAsignaturas" style="margin-top:-20px">
        <template slot="header">
          <div class="mt-6 mb-4">
            <br>
            <v-select @input="filtrarAsignaturas()" style="width:350px" :options="listaAreas" :reduce="listaAreas => listaAreas.id_area" label="nombre_area" v-model="asignaturaSelect" placeholder="Filtrar areas..."></v-select>
          </div>
        </template>
        <template slot="thead">
          <vs-th sort-key="nombre">Nombre</vs-th>
          <vs-th sort-key="area">Área</vs-th>
          <vs-th sort-key="cant_preguntas">Preguntas</vs-th>
          <vs-th sort-key="cant_preguntas">Período Evaluación</vs-th>
          <vs-th sort-key="estado">Estado</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td width="25%">
              <br>
              {{data[indextr].nombre_asignatura}}<br>
              <small>{{data[indextr].descripcion_asignatura}}</small>
            </vs-td>
            <vs-td width="20%">
              <span v-for="(index , lista) in listaAreas" :key="lista">
                <span v-if="index.id_area === tr.id_area "> {{index.nombre_area}} </span>
              </span>
            </vs-td>
            <vs-td width="5%">
              {{data[indextr].cant_preguntas}}
            </vs-td>
            <vs-td width="10%">
              {{ tr.periodo }}
            </vs-td>
            <vs-td width="15%">
              <vs-chip v-if="data[indextr].estado == 1" size="small">Activa</vs-chip>
              <vs-chip v-if="data[indextr].estado == 0" color="danger" size="small">Bloqueada</vs-chip>
            </vs-td>
            <vs-td width="15%">
              <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                <vs-button style="display:inline" type="line" radius size="large" icon-pack="feather" icon="icon-edit" class="m-2" color="primary" @click="modalAgregaEditaAsignatura(tr,2);"></vs-button>
              </vx-tooltip>
              <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="primary">
                <vs-button style="display:inline" type="line" radius size="large" icon-pack="feather" icon="icon-trash" class="m-1" color="danger" @click="confirmaEliminarAsignatura(tr);"></vs-button>
              </vx-tooltip>
              <!-- <vx-tooltip style="display: inline-block;" text="Sincronizar / mover preguntas" position="top" color="primary">
                <vs-button style="display:inline" type="line" radius size="large" icon-pack="feather" icon="icon-refresh-ccw"  class="m-1" color="success" @click="formSincronizar(tr)"></vs-button>
              </vx-tooltip> -->
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-tab>
    </vs-tabs>
  </vx-card>
  <!--MODALES-->
  <!--MODAL PARA EXPORTAR-->
  <!--modal exportar-->
  <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
    <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
        <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
    </vs-alert>
    <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
    <v-select v-model="selectedFormat" :options="formats" class="my-4" />
    <div class="flex">
    </div>
  </vs-prompt>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    data() {
        return {
          usuario: [],
          listaAreas: [],
          listaAsignaturas: [],
          tmpListaAsignaturas: [],
          asignaturaSelect: '',
          datoEditar: '',
          num: '',
          modalAreas: false,
          modalAsignaturas: false,
          area: {
              'id_area': '',
              'nombre_area': '',
              'descripcion_area': '',
              'estado': '',
          },
          asignatura: {
              'id_asignatura': '',
              'id_area': '',
              'nombre_asignatura': '',
              'descripcion_asignatura': '',
              'cant_preguntas': '',
              'estado': '',
          },
          titulo: '',
          txt_boton: '',
          txt_msj: '',
          id_eliminar: '',
          modalSincronizar: false,
          asignatura_sinc: [{id_asignatura: '', nombre_asignatura: ''}],
          asign_selec: [],
          //VARIABLES PARA EXPORTAR EXCEL
          arregloSelectArea: [],
          arregloSelectAsignatura:[],
          formats: ['xls', 'xlsx', 'csv', 'txt'],
          fileName:null,
          selectedFormat: 'xls',
          cellAutoWidth: true,
          activePrompt: false,
          tipo:0,
          //FIN VARIABLES PARA EXPORTAR EXCEL
          //VARIABLES DE PERIODOS EVALUACION
          periodoSelect:'',
          EvaluacionSelectSalleNombre:'',
          //FIN VARIABLES DE PERIODOS DE EVALUACION
          //VARIABLES PARA ASIGNAR COMO AREA BASICA
          datoFila:{},
          //FIN VARIABLES PARA ASIGNAR COMO AREA BASICA
        }
    },
    components: {
      'v-select': vSelect,
    },
    async created() {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
      let me = this;
      const evaluacionStorage = localStorage.getItem('EvaluacionSelectSalle');
      if (evaluacionStorage) {
        me.periodoSelect = Number(evaluacionStorage);
        me.EvaluacionSelectSalleNombre = localStorage.getItem('EvaluacionSelectSalleNombre') || '';
        me.getAreas();
      }
    },
    methods: {
      getAreas() {
        let me                  = this;
        me.listaAreas           = []
        me.listaAsignaturas     = []
        me.tmpListaAsignaturas  = []
        me.asignaturaSelect     = ''
        me.$vs.loading();
        this.$http.get(this.$server_url + 'areas_salle')
          .then(res => {
            me.$vs.loading.close();
            let datos = res.data
            if(datos.length > 0){
              me.listaAreas = datos.filter(p => p.n_evaluacion == me.periodoSelect)
            }
          })
          .catch(err => {
            me.$vs.loading.close();
          })
        this.$http.get(this.$server_url + 'asignaturas_salle?n_evaluacion='+localStorage.getItem('EvaluacionSelectSalle'))
          .then(res => {
            me.$vs.loading.close();
            let datos2 = res.data
            if(datos2.length > 0){
              me.listaAsignaturas = datos2
              me.tmpListaAsignaturas = datos2
            }
          })
          .catch(err => {
            me.$vs.loading.close();
          })
      },
        modalAgregaEdita(item, valor) {
          let me = this;
          me.area.id_area = '';
          me.area.nombre_area = '';
          me.area.descripcion_area = '';
          me.area.estado = 1;
          if (valor == 1) {
            me.titulo = 'Agregar área';
            me.txt_boton = 'Registrar';
            me.txt_msj = ' registrada ';
          }
          if (valor == 2) {
            me.titulo = 'Editar área';
            me.txt_boton = 'Editar';
            me.txt_msj = ' editada ';
            me.area.id_area = item.id_area
            me.area.estado = item.estado
            me.area.nombre_area = item.nombre_area
            me.area.descripcion_area = item.descripcion_area
          }
          me.modalAreas = true;
        },
        modalAgregaEditaAsignatura(item, valor) {
          let me = this;
          me.asignatura.id_asignatura           = '';
          me.asignatura.id_area                 = '';
          me.asignatura.nombre_asignatura       = '';
          me.asignatura.descripcion_asignatura  = '';
          me.asignatura.cant_preguntas          = '';
          me.asignatura.estado                  = 1;
          // console.log(item, valor)
          if (valor == 1) {
              me.titulo = 'Agregar asignatura';
              me.txt_boton = 'Registrar';
              me.txt_msj = ' registrada ';
          }
          if (valor == 2) {
              me.titulo = 'Editar asignatura';
              me.txt_boton = 'Editar';
              me.txt_msj = ' editada ';
              me.asignatura.id_area = item.id_area
              me.asignatura.id_asignatura = item.id_asignatura
              me.asignatura.nombre_asignatura = item.nombre_asignatura
              me.asignatura.descripcion_asignatura = item.descripcion_asignatura
              me.asignatura.cant_preguntas = item.cant_preguntas
              me.asignatura.estado = item.estado
          }
          me.modalAsignaturas = true;
        },
        agregarEditarArea() {
          let me = this;
          me.arregloSelectArea = []
          if (me.area.nombre_area == '' || me.area.nombre_area == null || me.area.descripcion_area == '' || me.area.descripcion_area == null) {
            me.$vs.notify({
              text: 'Complete todos los campos',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          if( me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
            me.$vs.notify({
              text: 'Seleccione un período Evaluación por favor',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          me.$vs.loading();
          let datas = new FormData();
          datas.append('id_area',           me.area.id_area);
          datas.append('nombre_area',       me.area.nombre_area);
          datas.append('descripcion_area',  me.area.descripcion_area);
          datas.append('estado',            me.area.estado);
          datas.append('n_evaluacion',      me.periodoSelect)
          this.$http.post(this.$server_url + 'crea_area_salle', datas)
            .then(res => {
              me.$vs.notify({
                text: 'Área ' + me.txt_msj + ' correctamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
              me.$vs.loading.close();
              me.getAreas();
            })
            .catch(err => {
              console.log(err);
              me.$vs.loading.close();
            })
          me.modalAreas = false;
        },
        agregarEditarAsignatura() {
          let me = this;
          me.arregloSelectAsignatura = []
          if (me.asignatura.id_area == '' || me.asignatura.id_area == null || me.asignatura.nombre_asignatura == '' || me.asignatura.nombre_asignatura == null || me.asignatura.descripcion_asignatura == '' || me.asignatura.descripcion_asignatura == null || me.asignatura.cant_preguntas == '' || me.asignatura.cant_preguntas == null || me.asignatura.estado == '' || me.asignatura.estado == null) {
              me.$vs.notify({
                  text: 'Complete todos los campos',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
              })
              return
          }
          me.$vs.loading();
          let datas = new FormData();
          datas.append('id_asignatura', me.asignatura.id_asignatura);
          datas.append('id_area', me.asignatura.id_area);
          datas.append('nombre_asignatura', me.asignatura.nombre_asignatura);
          datas.append('descripcion_asignatura', me.asignatura.descripcion_asignatura);
          datas.append('cant_preguntas', me.asignatura.cant_preguntas);
          datas.append('estado', me.asignatura.estado);
          this.$http.post(this.$server_url + 'crea_asignatura_salle', datas)
              .then(res => {
                  // console.log(res.data)
                  me.$vs.notify({
                      text: 'Asignatura ' + me.txt_msj + ' correctamente',
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  })
                  me.$vs.loading.close();
                  me.getAreas();
              })
              .catch(err => {
                  console.log(err);
                  me.$vs.loading.close();
              })
          me.modalAsignaturas = false;
        },
        volver() {
            let me = this;
            me.modalAreas = false;
            me.modalAsignaturas = false;
        },
        filtrarAsignaturas() {
            let me = this;
            // me.tmpAreas = me.listaAreas;
            me.listaAsignaturas = [];
            // console.log( me.asignaturaSelect )
            for (let index = 0; index < me.tmpListaAsignaturas.length; index++) {
                if (me.tmpListaAsignaturas[index].id_area == me.asignaturaSelect) {
                    me.listaAsignaturas.push(me.tmpListaAsignaturas[index]);
                }
            }
            if (me.asignaturaSelect == null) {
                me.listaAsignaturas = me.tmpListaAsignaturas;
            }
        },
        confirmaEliminar(item) {
            let me = this;
            console.log(item)
            me.id_eliminar = item.id_area;
            // return
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Seguro desea eliminar este item?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarItem
            })
        },
        eliminarItem() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'eliminaArea/' + me.id_eliminar)
                .then(res => {
                    console.log(res.data)
                    if (res.data > 0) {
                        me.$vs.notify({
                            time: 8000,
                            text: 'Esta área no puede ser eliminada, contiene ' + res.data + ' asignaturas creadas',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-check'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Area eliminada  correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                    me.getAreas();
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        confirmaEliminarAsignatura(item) {
            let me = this;
            me.id_eliminar = item.id_asignatura;
            // console.log(item)
            // return
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Seguro desea eliminar este item?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarItem
            })
        },
        eliminarItem() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'eliminaAreaSalle/' + me.id_eliminar)
                .then(res => {
                   me.$vs.loading.close();
                    if(res.data.status == 0){
                        me.$vs.notify({
                            time: 8000,
                            text:  res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-check'
                        })
                        return
                    }
                    me.$vs.notify({
                        text: 'Asignatura eliminada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })

                    me.getAreas();
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        formSincronizar(item){
            let me = this
            me.asign_selec = item
            me.modalSincronizar = true
        },
      sincronizarPreguntas(){
        let me = this
        me.$vs.loading()
        this.$http.get(this.$server_url + 'salle_sincronizar_preguntas/' + me.asignatura_sinc.id_asignatura +'/'+me.asign_selec.id_asignatura+'/'+me.usuario.idusuario+'/'+localStorage.EvaluacionSelectSalle)
        .then(res => {
          if( res.data == '1' ){
            me.$vs.notify({
              text: 'Preguntas sincronizadas correctamente.',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            })
          }else{
            me.$vs.notify({
              text: 'La asignatura seleccionada no tiene asignaturas para sincronizar.',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
          }
          me.$vs.loading.close()
        })
        .catch(err => {
          me.$vs.loading.close()
        })
      },
      //METODOS PARA EXPORTAR EXCEL
      OpenExportar(){
        let me          = this;
        //tipo => 0 exportar areas;
        if(me.tipo == 0){
          if(me.arregloSelectArea.length == 0){
            me.$vs.notify({
            text:'Seleccione al menos un registro para exportar por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
          }
        }
        if(me.tipo == 1){
          if(me.arregloSelectAsignatura.length == 0){
            me.$vs.notify({
            text:'Seleccione al menos un registro para exportar por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
          }
        }
        me.activePrompt = true
      },
      //METODOS PARA ASIGNAR COMO AREA BASICA
      confirmarAsignarAreaBasica(){
        let me = this
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          acceptText:'Si, deseo asignar',
          cancelText:'Cancelar',
          text: 'Estas seguro de asignar como área básica',
          accept:this.AsignarComoAreaBasica
        })
      },
      AsignarComoAreaBasica(){
        let me = this;
        let formData = new FormData();
        formData.append('id_area',me.datoFila.id_area);
        formData.append('n_evaluacion',localStorage.EvaluacionSelectSalle);
        me.$vs.loading()
        this.$http.post(this.$server_url+'AsignarComoAreaBasica', formData)
        .then(res => {
        me.getAreas();
        me.$vs.loading.close()
        me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
      },
      //METODOS PARA EXPORTAR EXCEL
      exportToExcel() {
        let me = this;
        var headerVal   = []
        var headerTitle = []
        //AREA
        if(me.tipo == 0){
          headerTitle = [ 'Área','Descripción', 'Estado','Período'];
          headerVal = [ 'nombre_area','descripcion_area','estadoArea','periodo'];
        }
        //ASIGNATURA
        if(me.tipo == 1){
          headerTitle = [ 'Área','Asignatura','Descripción', 'Cantidad Preguntas','Estado','Período'];
          headerVal = ['nombre_area', 'nombre_asignatura','descripcion_asignatura','cant_preguntas','estadoAsignatura','periodo'];
        }
        //tipo array
        var arryPrint = []
        //tipo => 0 = areas
        if(me.tipo == 0) arryPrint = me.arregloSelectArea
        if(me.tipo == 1) arryPrint = me.arregloSelectAsignatura
        import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(headerVal, arryPrint)
        excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileName,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
          this.arregloSelectArea = [];
          this.arregloSelectAsignatura  = [];
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    //limpiar campos para exportar de nuevo
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
  },
}
</script>
<style>
.exportButton{
  transition:1s ease-in;
}
.exportButton:hover{
  transform: scale(1.1);
  color:#f2f2f2;
}
</style>
