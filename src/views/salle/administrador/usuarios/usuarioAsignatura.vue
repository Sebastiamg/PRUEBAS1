<template>
<div class="vx-col md:w-full w-full mb-base">
    <div v-if="desdeAdmin == '1'">
      <vs-list>
        <vs-list-header title="Docente"></vs-list-header>
        <vs-list-item title="Nombres"     :subtitle="user.nombres +' '+user.apellidos"></vs-list-item>
        <vs-list-item title="Cédula"     :subtitle="user.cedula"></vs-list-item>
        <vs-list-item title="institucion" :subtitle="user.nombreInstitucion"></vs-list-item>
      </vs-list>
    </div>
    <div class="vx-row">
        <div class="vx-col sm:w-1/2">
            <vx-card title="Areas" class="mb-2">
                <p>Seleccione el área:</p>
                <vs-button class="m-2" type="border" @click="areaSelect(area_seleccionada = item)" v-for="(item, tr) in listaAreas" :key="tr"> {{item.nombre_area}}</vs-button>
            </vx-card>
            <div v-if="areaClick != '' " class="mb-2">
              <vx-card :title="'Asignaturas del área '+areaClick" class="mb-2">
                <span v-if="listaAsignaturas.length>0">
                  <div v-if="usuario.id_group == 12 || usuario.id_group == 1">
                    <p>Seleccione las asignaturas que usted imparte:</p>
                    <vs-button color="success" type="border" class="m-2" v-for="(item, tr) in listaAsignaturas" :key="tr" @click='agregarAsignaturaDocente(item.id_asignatura)'> {{item.nombre_asignatura}} </vs-button>
                  </div>
                </span>
                <span v-else>
                  <small>Todas las asignaturas, ya han sido seleccionadas.</small>
                </span>
              </vx-card>
            </div>
        </div>
        <div class="vx-col sm:w-1/2 mb-4">
            <vx-card title="Asignaturas seleccionadas:" class="vs-con-loading__container" id="div-asignaturas">

                <!-- AREA BASICA DEBE MOSTRARSE POR DEFECTO  -->
                <vs-list-header title="Área Fundamentales" color="primary"></vs-list-header>
                <span v-for="(itemB, trB) in asignaturasBasica" :key="trB">
                    <small class="p-2 m-1 asignatura-select"> {{itemB.nombre_asignatura}}
                        <vs-avatar class="asig-avatar-normal" color="success" icon-pack="feather" icon="icon-check" size="18px"></vs-avatar>
                    </small>
                </span>
                <!-- AREA BASICA DEBE MOSTRARSE POR DEFECTO  -->
                <div v-if="asignaturasDocente.length > 0">
                    <div v-for="(item, tr) in areasDocente" :key="tr">
                        <vs-list-header :title="'Area '+ item.nombre_area" color="primary"></vs-list-header>
                        <span v-for="(itemD, trD) in asignaturasDocente" :key="trD">
                            <!-- <vs-list-item :subtitle="itemD.nombre_asignatura" v-if="item.id_area ==itemD.id_area">
                                <vs-button icon-pack="feather" icon="icon-trash" size="small" color="danger"></vs-button>
                            </vs-list-item> -->
                            <small v-if="item.id_area ==itemD.id_area" class="p-2 m-1 asignatura-select"> {{itemD.nombre_asignatura}}
                                <vs-avatar v-if="usuario.id_group == 12 || usuario.id_group == 1" class="asig-avatar" color="warning" icon-pack="feather" icon="icon-trash" size="25px" @click="quitarAsignatura(itemD)"></vs-avatar>
                            </small>
                        </span>
                    </div>
                </div>

            </vx-card>
        </div>

    </div>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            listaAreas: [],
            listaAsignaturas: [],
            tmpListaAsignaturas: [],
            asignaturasSelccionadas: [],
            tmpIdArea: [],
            areasDocente: [{
                'id_area': ''
            }],
            asignaturasDocente: [],
            asignaturasBasica: [],
            areaClick: '',
            miusuario: 0,
            usuario: '',
            checkBox1: '',
            chips: '',
            area_seleccionada: '',
        }
    },
    props:{
      user:{
        type:Object,
        default:function(){
          return {}
        }
      },
      desdeAdmin:{
        type:Number,
        default:0,
      },
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        if (me.usuario.id_group == 12 || me.usuario.id_group == 1) { //administrador salle
            me.miusuario = me.user.idusuario;
        }
        if (me.usuario.id_group == 13 || me.usuario.id_group == 6) {
            me.miusuario = me.usuario.idusuario; // docente salle
        }
        me.getAreas();
        me.asignaturasUsuario();
    },
    methods: {
      getAreas() {
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url+'areasSinBasica?n_evaluacion='+localStorage.EvaluacionSelectSalle)
          .then(res => {
              me.listaAreas = res.data
              me.$vs.loading.close();
          })
          .catch(err => {
              console.log(err)
              me.$vs.loading.close();
          })
        this.$http.get(this.$server_url+'asignaturas_salle?n_evaluacion='+localStorage.getItem('EvaluacionSelectSalle'))
          .then(res => {
            me.tmpListaAsignaturas = res.data
            me.$vs.loading.close();
          })
          .catch(err => {
            me.$vs.loading.close();
          })
      },
      areaSelect() {
        let me = this;
        if (me.area_seleccionada != '') {
          me.areaClick = me.area_seleccionada.nombre_area;
          me.listaAsignaturas = [];
          for (let index = 0; index < me.tmpListaAsignaturas.length; index++) {
              if (me.tmpListaAsignaturas[index].id_area == me.area_seleccionada.id_area) {
                if (me.asignaturasDocente.findIndex(obj => obj.id_asignatura == me.tmpListaAsignaturas[index].id_asignatura) == '-1') {
                    me.listaAsignaturas.push(me.tmpListaAsignaturas[index]);
                }
              }
          }
        }
      },
      agregarAsignaturaDocente(item) {
        let me = this;
        if (me.miusuario == 0) {
          me.$vs.notify({
            text: 'No tiene permisos suficientes para modificar este contenido',
            color: 'damger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
        // return
        me.$vs.loading();
        let datas = new FormData();
        datas.append('id_asignatura', item);
        datas.append('id_usuario',    me.miusuario);
        datas.append('n_evaluacion',  localStorage.EvaluacionSelectSalle);
        this.$http.post(this.$server_url+'save_asignaturas_docente_salle', datas)
          .then(res => {
            me.asignaturasUsuario();
            me.$vs.loading.close();
          })
          .catch(err => {
            console.log(err)
            me.$vs.loading.close();
          })
      },
      asignaturasUsuario() {
        let me = this;
        me.$vs.loading({
            container: '#div-asignaturas',
            type:'material'
        });
        this.$http.get(this.$server_url+'asignaturas_docente_salle/' + me.miusuario+'/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
              me.asignaturasDocente = res.data.asignaturas
              me.areasDocente = res.data.areas
              me.asignaturasBasica = res.data.basicas
              me.areaSelect();
              me.$vs.loading.close('#div-asignaturas > .con-vs-loading');
          })
          .catch(err => {
              console.log(err)
              me.$vs.loading.close('#div-asignaturas > .con-vs-loading');
            })
        },
        quitarAsignatura(item) {
            let me = this;
            // console.log(item)
            me.$vs.loading();
            this.$http.get(this.$server_url+'delete_asignaturas_docente_salle/' + item.id_asignatura_docente)
                .then(res => {
                    // console.log(res.data)
                    me.asignaturasUsuario();
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        }
    }
}
</script>

<style>
.asignatura-select {
    /* background-color: greenyellow; */
    border: rgb(216, 202, 202) solid 1px;
    border-radius: 15px;
    display: inline-block;
}

.asig-avatar {
    margin-bottom: -6px;
}
.asig-avatar-normal {
    margin-bottom: -6px;
    cursor: default;
}
</style>
