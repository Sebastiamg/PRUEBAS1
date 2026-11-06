import axios from '@/axios.js'
import {server} from '../../main'

export default {
  addEvent ({ commit }, event) {

    let formData = new FormData();
        formData.append('id', 0);
        formData.append('idusuario', event.idusuario);
        formData.append('title', event.title);
        formData.append('label', event.label);
        formData.append('classes', event.classes);
        formData.append('startDate', event.startDate);
        formData.append('endDate', event.endDate);
        formData.append('hora_inicio', event.hora_inicio);
        formData.append('hora_fin', event.hora_fin);
        formData.append('clasificacion', event.clasificacion);
        formData.append('progreso', event.progreso);
        formData.append('url', event.url);

    return new Promise((resolve, reject) => {
      axios.post(server+'planificacion_agenda', formData)
      .then((response) => {
        commit('ADD_EVENT', Object.assign(event, {id: response.data.id}))
        resolve(response)

      })
      .catch((error) => { reject(error) })
    })
  },
  fetchEvents ({ commit }) {
    let usuario = JSON.parse(localStorage.getItem('usuario'))
    return new Promise((resolve, reject) => {
      axios.get(server+'planificacion_agenda/'+usuario.idusuario)
        .then((response) => {
          commit('SET_EVENTS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  get_finished_events ({ commit }) {
    let usuario = JSON.parse(localStorage.getItem('usuario'))
    return new Promise((resolve, reject) => {
      axios.get(server+'get_finished_events/'+usuario.idusuario)
        .then((response) => {
          commit('SET_EVENTS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  get_incomplete_events ({ commit }) {
    let usuario = JSON.parse(localStorage.getItem('usuario'))
    return new Promise((resolve, reject) => {
      axios.get(server+'get_incomplete_events/'+usuario.idusuario)
        .then((response) => {
          commit('SET_EVENTS', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchEventLabels ({ commit }) {
    let eventos = [
      { text: 'Urgente e importante', color: 'danger'},
      { text: 'Importante y no urgente', color: 'warning'},
      // { text: 'Normal', color: 'primary'},
      // { text: 'Baja', color: 'success'},
    ];
    return new Promise((resolve, reject) => {
      commit('SET_LABELS', eventos)
      resolve(eventos)
    })
  },
  editEvent ({ commit }, event) {
    let formData = new FormData();
        formData.append('id', event.id);
        formData.append('idusuario', event.idusuario);
        formData.append('title', event.title);
        formData.append('label', event.label);
        formData.append('classes', event.classes);
        formData.append('startDate', event.startDate);
        formData.append('endDate', event.endDate);
        formData.append('hora_inicio', event.hora_inicio);
        formData.append('hora_fin', event.hora_fin);
        formData.append('clasificacion', event.clasificacion);
        formData.append('progreso', event.progreso);
        formData.append('url', event.url);

    return new Promise((resolve, reject) => {
      axios.post(server+'planificacion_agenda', formData)
        .then((response) => {
          const event = response.data
          event.startDate = new Date(event.startDate)
          event.endDate = new Date(event.endDate)

          commit('UPDATE_EVENT', event)
          resolve(response)
          location.reload()
        })
        .catch((error) => { reject(error) })
    })
  },
  removeEvent ({ commit }, eventId) {
    return new Promise((resolve, reject) => {
      axios.get(server+`delete_agenda_planificacion/${eventId}`)
        .then((response) => {
          commit('REMOVE_EVENT', response.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  eventDragged ({ commit }, event) {
    let formData = new FormData();
        formData.append('id', event.id);
        formData.append('idusuario', event.idusuario);
        formData.append('title', event.title);
        formData.append('label', event.label);
        formData.append('classes', event.classes);
        formData.append('startDate', event.startDate);
        formData.append('endDate', event.endDate);
        formData.append('hora_inicio', event.hora_inicio);
        formData.append('hora_fin', event.hora_fin);
        formData.append('clasificacion', event.clasificacion);
        formData.append('progreso', event.progreso);
        formData.append('url', event.url);
    return new Promise((resolve, reject) => {
      axios.post(server+'delete_agenda_planificacion', formData)
        .then((response) => {
          const event = response.data
          event.startDate = new Date(event.startDate)
          event.endDate = new Date(event.endDate)

          commit('UPDATE_EVENT', event)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }
}
